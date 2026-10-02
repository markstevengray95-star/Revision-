-- Additive upgrade for the existing Revision classes database.
-- Applied to the hosted project with Supabase apply_migration(name: topic_activities).
-- Private keys never appear in student-readable tables. Public RPCs are invokers;
-- their private implementations authenticate and check class ownership/membership.
create table public.revision_activities (
 assignment_id uuid primary key references public.revision_assignments(id) on delete cascade,
 class_id uuid not null references public.revision_classes(id) on delete cascade,
 teacher_id uuid not null references auth.users(id) on delete cascade,
 kind text not null check(kind in ('quiz','exam','revision')),
 topic_key text not null, topic_title text not null,
 questions jsonb not null check(jsonb_typeof(questions)='array'),
 attempts_limit integer not null check(attempts_limit between 1 and 5),
 feedback_mode text not null check(feedback_mode in ('immediate','after_final_attempt','after_due')),
 allow_late boolean not null default true,
 created_at timestamptz not null default now()
);
create table private.revision_activity_keys (
 assignment_id uuid primary key references public.revision_activities(assignment_id) on delete cascade,
 keys jsonb not null
);
create table public.revision_activity_drafts (
 assignment_id uuid not null references public.revision_activities(assignment_id) on delete cascade,
 student_id uuid not null references auth.users(id) on delete cascade,
 answers jsonb not null default '{}'::jsonb,
 updated_at timestamptz not null default now(),
 primary key(assignment_id,student_id)
);
create table public.revision_activity_attempts (
 id uuid primary key default gen_random_uuid(),
 assignment_id uuid not null references public.revision_activities(assignment_id) on delete cascade,
 class_id uuid not null references public.revision_classes(id) on delete cascade,
 teacher_id uuid not null references auth.users(id) on delete cascade,
 student_id uuid not null references auth.users(id) on delete cascade,
 attempt_no integer not null,
 submission_token uuid not null unique,
 answers jsonb not null, marks jsonb not null,
 auto_score numeric not null, auto_max numeric not null, total_max numeric not null,
 score numeric not null,
 review_state text not null check(review_state in ('pending','complete')),
 feedback text not null default '',
 submitted_at timestamptz not null default now(), reviewed_at timestamptz,
 unique(assignment_id,student_id,attempt_no)
);
create index revision_activities_class_idx on public.revision_activities(class_id);
create index revision_activities_teacher_idx on public.revision_activities(teacher_id);
create index revision_drafts_student_idx on public.revision_activity_drafts(student_id);
create index revision_attempts_class_idx on public.revision_activity_attempts(class_id);
create index revision_attempts_teacher_idx on public.revision_activity_attempts(teacher_id);
create index revision_attempts_student_idx on public.revision_activity_attempts(student_id);
alter table public.revision_activities enable row level security;
alter table private.revision_activity_keys enable row level security;
create policy revision_activity_keys_deny_client on private.revision_activity_keys for all to authenticated using(false) with check(false);
alter table public.revision_activity_drafts enable row level security;
alter table public.revision_activity_attempts enable row level security;
revoke all on public.revision_activities,public.revision_activity_drafts,public.revision_activity_attempts from anon,authenticated;
revoke all on private.revision_activity_keys from public,anon,authenticated;
grant select on public.revision_activities,public.revision_activity_drafts,public.revision_activity_attempts to authenticated;
create policy revision_activities_read on public.revision_activities for select to authenticated
 using(teacher_id=(select auth.uid()) or private.revision_is_class_member(class_id));
create policy revision_drafts_read on public.revision_activity_drafts for select to authenticated
 using(student_id=(select auth.uid()));
create policy revision_attempts_read on public.revision_activity_attempts for select to authenticated
 using(teacher_id=(select auth.uid()) or (student_id=(select auth.uid()) and private.revision_is_class_member(class_id)));

create function private.revision_assign_activity(p_assignment jsonb,p_activity jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare
 uid uuid:=auth.uid(); cid uuid; aid uuid; q jsonb; qs jsonb:='[]'; keys jsonb:='{}'; seen text[]:='{}';
 k jsonb; marks numeric; total numeric:=0; attempts integer; feedback text; options jsonb; opt jsonb; option_ids text[]; option_texts text[];
begin
 if uid is null then raise exception 'Authentication required';end if;
 cid:=(p_assignment->>'class_id')::uuid;
 if not private.revision_is_teacher() or not exists(select 1 from public.revision_classes where id=cid and teacher_id=uid and not archived) then raise exception 'You must own this active class';end if;
 if p_activity->>'kind' not in ('quiz','exam','revision') or p_activity->>'kind' is null then raise exception 'Invalid activity type';end if;
 if jsonb_typeof(p_activity->'questions') is distinct from 'array' then raise exception 'Questions must be an array';end if;
 if jsonb_array_length(p_activity->'questions') not between 1 and 60 or octet_length(p_activity::text)>200000 then raise exception 'Choose 1–60 questions';end if;
 if length(btrim(coalesce(p_activity->>'topicTitle',''))) not between 1 and 160 or length(coalesce(p_activity->>'topic','')) not between 1 and 120 then raise exception 'Choose a topic';end if;
 attempts:=(p_activity->>'attempts_limit')::integer;feedback:=p_activity->>'feedback_mode';
 if attempts is null or attempts not between 1 and 5 or feedback is null or feedback not in ('immediate','after_final_attempt','after_due') then raise exception 'Invalid retry or feedback settings';end if;
 for q in select value from jsonb_array_elements(p_activity->'questions') loop
  if coalesce(q->>'id','') !~ '^[A-Za-z0-9_-]{1,40}$' or q->>'id'=any(seen) then raise exception 'Question IDs must be unique';end if;
  seen:=array_append(seen,q->>'id');
  if q->>'type' is null or q->>'type' not in ('choice','number','written') or length(btrim(coalesce(q->>'prompt',''))) not between 3 and 6000 then raise exception 'Invalid question';end if;
  marks:=(q->>'marks')::numeric;
  if marks is null or marks::text='NaN' or marks not between 0.5 and 10 or mod(marks,0.5)<>0 then raise exception 'Marks must be 0.5–10 in half-mark increments';end if;
  total:=total+marks;k:=q->'key';
  if jsonb_typeof(k->'solution') is distinct from 'array' or jsonb_array_length(k->'solution') not between 1 and 30 then raise exception 'Every question needs a solution or mark scheme';end if;
  if exists(select 1 from jsonb_array_elements(k->'solution') s where jsonb_typeof(s.value)<>'string' or length(s.value#>>'{}') not between 1 and 6000) then raise exception 'Invalid solution';end if;
  if q->>'type'='choice' then
   options:=q->'options';option_ids:='{}';option_texts:='{}';
   if jsonb_typeof(options) is distinct from 'array' or jsonb_array_length(options) not between 2 and 6 then raise exception 'Choose 2–6 options';end if;
   for opt in select value from jsonb_array_elements(options) loop
    if coalesce(opt->>'id','') !~ '^[A-Za-z0-9_-]{1,40}$' or opt->>'id'=any(option_ids) or length(btrim(coalesce(opt->>'text',''))) not between 1 and 2000 or lower(btrim(opt->>'text'))=any(option_texts) then raise exception 'Options must be distinct and valid';end if;
    option_ids:=array_append(option_ids,opt->>'id');option_texts:=array_append(option_texts,lower(btrim(opt->>'text')));
   end loop;
   if k->>'correct' is null or not (k->>'correct'=any(option_ids)) then raise exception 'Select a correct option';end if;
   k:=jsonb_build_object('correct',k->>'correct','solution',k->'solution');
  elsif q->>'type'='number' then
   if jsonb_typeof(k->'value') is distinct from 'number' or jsonb_typeof(k->'tolerance') is distinct from 'number' or abs((k->>'value')::numeric)>1e100 or (k->>'tolerance')::numeric<0 or (k->>'tolerance')::numeric>1e100 then raise exception 'Invalid expected number or tolerance';end if;
   k:=jsonb_build_object('value',(k->>'value')::numeric,'tolerance',(k->>'tolerance')::numeric,'solution',k->'solution');
  else k:=jsonb_build_object('solution',k->'solution');end if;
  -- Allowlist the public specification: nested or renamed key fields cannot leak.
  qs:=qs||jsonb_build_array(jsonb_build_object('id',q->>'id','type',q->>'type','prompt',q->>'prompt','marks',marks,'options',case when q->>'type'='choice' then options else '[]'::jsonb end,'unit',left(coalesce(q->>'unit',''),80),'title',left(coalesce(q->>'title',''),200),'lessonId',left(coalesce(q->>'lessonId',''),120),'lessonHref',case when q->>'lessonHref' like 'courses/%' and q->>'lessonHref' not like '%..%' and position(chr(92) in q->>'lessonHref')=0 then left(q->>'lessonHref',1000) else '' end));
  keys:=keys||jsonb_build_object(q->>'id',k);
 end loop;
 insert into public.revision_assignments(class_id,teacher_id,assignment_type,title,instructions,due_at,max_points,status)
 values(cid,uid,p_assignment->>'assignment_type',btrim(p_assignment->>'title'),left(coalesce(p_assignment->>'instructions',''),4000),(p_assignment->>'due_at')::timestamptz,total,'active')returning id into aid;
 insert into public.revision_activities(assignment_id,class_id,teacher_id,kind,topic_key,topic_title,questions,attempts_limit,feedback_mode,allow_late)
 values(aid,cid,uid,p_activity->>'kind',concat(p_activity->>'level',':',p_activity->>'subject',':',p_activity->>'topic'),p_activity->>'topicTitle',qs,attempts,feedback,coalesce((p_activity->>'allow_late')::boolean,true));
 insert into private.revision_activity_keys values(aid,keys);
 return jsonb_build_object('id',aid,'total_marks',total);
end $$;

create function private.revision_save_activity_draft(p_assignment_id uuid,p_answers jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();a public.revision_assignments%rowtype;v public.revision_activities%rowtype;updated timestamptz;
begin
 if uid is null then raise exception 'Authentication required';end if;
 select * into a from public.revision_assignments where id=p_assignment_id;
 if a.id is null or not private.revision_is_class_member(a.class_id) or not exists(select 1 from public.revision_activities where assignment_id=a.id) then raise exception 'Activity unavailable for this account';end if;
 if a.status<>'active' then raise exception 'Assignment is closed';end if;
 if jsonb_typeof(p_answers) is distinct from 'object' or octet_length(p_answers::text)>100000 then raise exception 'Invalid answers';end if;
 if exists(select 1 from jsonb_each(p_answers) x where jsonb_typeof(x.value)<>'string' or length(x.value#>>'{}')>10000 or not exists(select 1 from public.revision_activities act,jsonb_array_elements(act.questions) q where act.assignment_id=a.id and q->>'id'=x.key)) then raise exception 'Invalid question answer';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_assignment_id::text||uid::text,0));
 select * into v from public.revision_activities where assignment_id=a.id;
 if (select count(*)from public.revision_activity_attempts where assignment_id=a.id and student_id=uid)>=v.attempts_limit then raise exception 'All attempts have been used';end if;
 if now()>a.due_at and not v.allow_late then raise exception 'The submission deadline has passed';end if;
 insert into public.revision_activity_drafts(assignment_id,student_id,answers)values(a.id,uid,p_answers)
 on conflict(assignment_id,student_id)do update set answers=excluded.answers,updated_at=clock_timestamp()returning updated_at into updated;
 return jsonb_build_object('saved_at',updated);
end $$;

create function private.revision_submit_activity(p_assignment_id uuid,p_answers jsonb,p_submission_token uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();a public.revision_assignments%rowtype;v public.revision_activities%rowtype;r public.revision_activity_attempts%rowtype;
 keys jsonb;q jsonb;k jsonb;answer text;num numeric;awarded numeric;marks jsonb:='[]';auto_score numeric:=0;auto_max numeric:=0;total numeric:=0;pending boolean:=false;n integer;responses text:='';
begin
 if uid is null or p_submission_token is null then raise exception 'Authentication and a submission token are required';end if;
 select * into a from public.revision_assignments where id=p_assignment_id for share;
 select * into v from public.revision_activities where assignment_id=p_assignment_id;
 if a.id is null or v.assignment_id is null or not private.revision_is_class_member(a.class_id) then raise exception 'Activity unavailable for this account';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_assignment_id::text||uid::text,0));
 select * into r from public.revision_activity_attempts where submission_token=p_submission_token;
 if r.id is not null then
  if r.student_id<>uid or r.assignment_id<>p_assignment_id or r.answers is distinct from p_answers then raise exception 'Submission token already used';end if;
  return to_jsonb(r);
 end if;
 if a.status<>'active' then raise exception 'Assignment is closed';end if;
 if now()>a.due_at and not v.allow_late then raise exception 'The submission deadline has passed';end if;
 select coalesce(max(attempt_no),0)+1 into n from public.revision_activity_attempts where assignment_id=a.id and student_id=uid;
 if n>v.attempts_limit then raise exception 'All attempts have been used';end if;
 if jsonb_typeof(p_answers) is distinct from 'object' or octet_length(p_answers::text)>100000 then raise exception 'Invalid answers';end if;
 if (select count(*) from jsonb_object_keys(p_answers))<>jsonb_array_length(v.questions) then raise exception 'Answer every question before submitting';end if;
 select x.keys into keys from private.revision_activity_keys x where x.assignment_id=a.id;
 for q in select value from jsonb_array_elements(v.questions) loop
  if jsonb_typeof(p_answers->(q->>'id')) is distinct from 'string' then raise exception 'Answer every question';end if;
  answer:=btrim(p_answers->>(q->>'id'));
  if length(answer) not between 1 and 10000 then raise exception 'Answer every question (up to 10,000 characters each)';end if;
  k:=keys->(q->>'id');total:=total+(q->>'marks')::numeric;awarded:=0;
  if q->>'type'='choice' then
   if not exists(select 1 from jsonb_array_elements(q->'options') o where o->>'id'=answer) then raise exception 'Choose an available answer';end if;
   if answer=k->>'correct' then awarded:=(q->>'marks')::numeric;end if;
  elsif q->>'type'='number' then
   answer:=replace(answer,'−','-');
   if length(answer)>40 or answer !~* '^[+-]?([0-9]+(\.[0-9]*)?|\.[0-9]+)(e[+-]?[0-9]{1,3})?$' then raise exception 'Enter numbers without units, using e for scientific notation';end if;
   begin num:=answer::numeric;exception when others then raise exception 'Invalid numerical answer';end;
   if abs(num)>1e100 then raise exception 'Numerical answer is too large';end if;
   if abs(num-(k->>'value')::numeric)<=(k->>'tolerance')::numeric then awarded:=(q->>'marks')::numeric;end if;
  else pending:=true;awarded:=null;responses:=responses||(q->>'prompt')||E'\n'||answer||E'\n\n';end if;
  if q->>'type'<>'written' then auto_max:=auto_max+(q->>'marks')::numeric;auto_score:=auto_score+awarded;end if;
  marks:=marks||jsonb_build_array(jsonb_build_object('id',q->>'id','type',q->>'type','max_marks',(q->>'marks')::numeric,'awarded',awarded));
 end loop;
 insert into public.revision_activity_attempts(assignment_id,class_id,teacher_id,student_id,attempt_no,submission_token,answers,marks,auto_score,auto_max,total_max,score,review_state)
 values(a.id,a.class_id,a.teacher_id,uid,n,p_submission_token,p_answers,marks,auto_score,auto_max,total,auto_score,case when pending then 'pending' else 'complete' end)returning * into r;
 perform set_config('revision.activity_write','true',true);
 insert into public.revision_submissions(assignment_id,class_id,teacher_id,student_id,response_text,status,submitted_at,score,feedback,marked_at,updated_at)
 values(a.id,a.class_id,a.teacher_id,uid,left(responses,10000),case when n>1 then 'resubmitted' else 'submitted' end,r.submitted_at,auto_score,case when pending then 'Objective answers marked automatically. Written answers await teacher review.' else 'Marked automatically.' end,case when pending then null else now()end,now())
 on conflict(assignment_id,student_id)do update set response_text=excluded.response_text,status=excluded.status,submitted_at=excluded.submitted_at,score=excluded.score,feedback=excluded.feedback,marked_at=excluded.marked_at,updated_at=now();
 perform set_config('revision.activity_write','false',true);
 delete from public.revision_activity_drafts where assignment_id=a.id and student_id=uid;
 return to_jsonb(r);
end $$;

create function private.revision_activity_feedback(p_assignment_id uuid,p_attempt_id uuid default null) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();v public.revision_activities%rowtype;r public.revision_activity_attempts%rowtype;due timestamptz;n integer;released boolean:=false;keys jsonb;
begin
 if uid is null then raise exception 'Authentication required';end if;
 select * into v from public.revision_activities where assignment_id=p_assignment_id;
 if v.assignment_id is null or (v.teacher_id<>uid and not private.revision_is_class_member(v.class_id)) then raise exception 'Activity unavailable for this account';end if;
 if v.teacher_id=uid then released:=true;
 else
  select * into r from public.revision_activity_attempts where assignment_id=v.assignment_id and student_id=uid and (p_attempt_id is null or id=p_attempt_id) order by attempt_no desc limit 1;
  if r.id is not null then
   select due_at into due from public.revision_assignments where id=v.assignment_id;
   select count(*) into n from public.revision_activity_attempts where assignment_id=v.assignment_id and student_id=uid;
   released:=v.feedback_mode='immediate' or(v.feedback_mode='after_final_attempt' and n>=v.attempts_limit)or(v.feedback_mode='after_due' and now()>=due);
  end if;
 end if;
 if released then select x.keys into keys from private.revision_activity_keys x where x.assignment_id=v.assignment_id;end if;
 return jsonb_build_object('released',released,'solutions',case when released then keys else '{}'::jsonb end,'feedback_mode',v.feedback_mode);
end $$;

create function private.revision_review_activity(p_attempt_id uuid,p_marks jsonb,p_feedback text default '') returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();r public.revision_activity_attempts%rowtype;m jsonb;new_marks jsonb:='[]';awarded numeric;v_score numeric:=0;pending boolean:=false;
begin
 if uid is null or not private.revision_is_teacher() then raise exception 'Teacher authentication required';end if;
 select * into r from public.revision_activity_attempts where id=p_attempt_id and teacher_id=uid for update;
 if r.id is null or not private.revision_owns_class(r.class_id) then raise exception 'Attempt not found';end if;
 if jsonb_typeof(p_marks) is distinct from 'object' then raise exception 'Invalid marks';end if;
 for m in select value from jsonb_array_elements(r.marks) loop
  awarded:=(m->>'awarded')::numeric;
  if m->>'type'='written' then
   if jsonb_typeof(p_marks->(m->>'id'))='null' or not(p_marks ? (m->>'id')) then awarded:=null;
   elsif jsonb_typeof(p_marks->(m->>'id'))='number' then awarded:=(p_marks->>(m->>'id'))::numeric;
   else raise exception 'Enter numerical marks';end if;
   if awarded is not null and (awarded::text='NaN' or awarded<0 or awarded>(m->>'max_marks')::numeric or mod(awarded,0.5)<>0) then raise exception 'A mark is outside its question range';end if;
   if awarded is null then pending:=true;end if;
  end if;
  v_score:=v_score+coalesce(awarded,0);new_marks:=new_marks||jsonb_build_array(m||jsonb_build_object('awarded',awarded));
 end loop;
 update public.revision_activity_attempts set marks=new_marks,score=v_score,review_state=case when pending then 'pending' else 'complete' end,feedback=left(coalesce(p_feedback,''),4000),reviewed_at=now()where id=r.id returning * into r;
 -- Only the latest attempt updates the main planner result; history remains intact.
 if not exists(select 1 from public.revision_activity_attempts where assignment_id=r.assignment_id and student_id=r.student_id and attempt_no>r.attempt_no) then
  perform set_config('revision.activity_write','true',true);
  update public.revision_submissions set score=r.score,feedback=r.feedback,marked_at=case when pending then null else now()end,updated_at=now()where assignment_id=r.assignment_id and student_id=r.student_id;
  perform set_config('revision.activity_write','false',true);
 end if;
 return to_jsonb(r);
end $$;

create function private.revision_duplicate_activity(p_assignment_id uuid,p_due_at timestamptz) returns jsonb
language plpgsql security definer set search_path='' as $$
declare uid uuid:=auth.uid();a public.revision_assignments%rowtype;v public.revision_activities%rowtype;keys jsonb;qs jsonb;
begin
 if uid is null then raise exception 'Authentication required';end if;
 select * into a from public.revision_assignments where id=p_assignment_id and teacher_id=uid;
 select * into v from public.revision_activities where assignment_id=p_assignment_id;
 if a.id is null or v.assignment_id is null then raise exception 'Activity not found';end if;
 select x.keys into keys from private.revision_activity_keys x where x.assignment_id=a.id;
 select jsonb_agg(q||jsonb_build_object('key',keys->(q->>'id')))into qs from jsonb_array_elements(v.questions)q;
 return private.revision_assign_activity(jsonb_build_object('class_id',a.class_id,'assignment_type',a.assignment_type,'title',left(a.title||' (copy)',120),'instructions',a.instructions,'due_at',p_due_at),jsonb_build_object('kind',v.kind,'level',split_part(v.topic_key,':',1),'subject',split_part(v.topic_key,':',2),'topic',split_part(v.topic_key,':',3),'topicTitle',v.topic_title,'questions',qs,'attempts_limit',v.attempts_limit,'feedback_mode',v.feedback_mode,'allow_late',v.allow_late));
end $$;

create function public.revision_assign_activity(p_assignment jsonb,p_activity jsonb)returns jsonb language sql security invoker set search_path='' as $$select private.revision_assign_activity(p_assignment,p_activity)$$;
create function public.revision_save_activity_draft(p_assignment_id uuid,p_answers jsonb)returns jsonb language sql security invoker set search_path='' as $$select private.revision_save_activity_draft(p_assignment_id,p_answers)$$;
create function public.revision_submit_activity(p_assignment_id uuid,p_answers jsonb,p_submission_token uuid)returns jsonb language sql security invoker set search_path='' as $$select private.revision_submit_activity(p_assignment_id,p_answers,p_submission_token)$$;
create function public.revision_activity_feedback(p_assignment_id uuid,p_attempt_id uuid default null)returns jsonb language sql security invoker set search_path='' as $$select private.revision_activity_feedback(p_assignment_id,p_attempt_id)$$;
create function public.revision_review_activity(p_attempt_id uuid,p_marks jsonb,p_feedback text default '')returns jsonb language sql security invoker set search_path='' as $$select private.revision_review_activity(p_attempt_id,p_marks,p_feedback)$$;
create function public.revision_duplicate_activity(p_assignment_id uuid,p_due_at timestamptz)returns jsonb language sql security invoker set search_path='' as $$select private.revision_duplicate_activity(p_assignment_id,p_due_at)$$;
revoke all on function public.revision_assign_activity(jsonb,jsonb),private.revision_assign_activity(jsonb,jsonb),public.revision_save_activity_draft(uuid,jsonb),private.revision_save_activity_draft(uuid,jsonb),public.revision_submit_activity(uuid,jsonb,uuid),private.revision_submit_activity(uuid,jsonb,uuid),public.revision_activity_feedback(uuid,uuid),private.revision_activity_feedback(uuid,uuid),public.revision_review_activity(uuid,jsonb,text),private.revision_review_activity(uuid,jsonb,text),public.revision_duplicate_activity(uuid,timestamptz),private.revision_duplicate_activity(uuid,timestamptz)from public,anon;
grant execute on function public.revision_assign_activity(jsonb,jsonb),private.revision_assign_activity(jsonb,jsonb),public.revision_save_activity_draft(uuid,jsonb),private.revision_save_activity_draft(uuid,jsonb),public.revision_submit_activity(uuid,jsonb,uuid),private.revision_submit_activity(uuid,jsonb,uuid),public.revision_activity_feedback(uuid,uuid),private.revision_activity_feedback(uuid,uuid),public.revision_review_activity(uuid,jsonb,text),private.revision_review_activity(uuid,jsonb,text),public.revision_duplicate_activity(uuid,timestamptz),private.revision_duplicate_activity(uuid,timestamptz)to authenticated;

-- Existing note-only endpoints must not overwrite scored activity submissions.
create function private.revision_guard_legacy_activity()returns trigger language plpgsql security definer set search_path='' as $$
begin
 if exists(select 1 from public.revision_activities where assignment_id=new.assignment_id) and current_setting('revision.activity_write',true) is distinct from 'true' then
  -- The new scoring RPCs set a transaction-local flag. Clients cannot set it through REST.
  raise exception 'Complete and mark this activity using the activity workspace';
 end if;return new;
end $$;
-- Trigger is attached after the scoring RPCs have been marked as allowed writers.
revoke all on function private.revision_guard_legacy_activity()from public,anon,authenticated;
create trigger revision_activity_submission_guard before insert or update on public.revision_submissions for each row execute function private.revision_guard_legacy_activity();

notify pgrst,'reload schema';
