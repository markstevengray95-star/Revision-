-- Phase 2. Additive teacher workflow upgrade; apply once after topic-activities.sql.
begin;
alter table public.revision_assignments add column start_at timestamptz not null default now(),
 add column recipient_ids uuid[], add column target_score integer not null default 75 check(target_score between 0 and 100),
 add column estimated_minutes integer not null default 15 check(estimated_minutes between 1 and 240),
 add column activity_mode text not null default 'quiz' check(activity_mode in ('lesson','quiz','flashcards','exam','test','mixed'));
update public.revision_assignments set start_at=least(created_at,due_at);
alter table public.revision_assignments add constraint revision_assignment_dates check(start_at <= due_at);
create table public.revision_teacher_drafts (
 id uuid primary key default gen_random_uuid(), teacher_id uuid not null references auth.users(id) on delete cascade,
 title text not null check(length(title) between 1 and 120), payload jsonb not null check(octet_length(payload::text)<250000),
 created_at timestamptz not null default now()
);
alter table public.revision_teacher_drafts enable row level security;
revoke all on public.revision_teacher_drafts from anon,authenticated;
grant select,insert,update,delete on public.revision_teacher_drafts to authenticated;
create policy revision_teacher_drafts_owner on public.revision_teacher_drafts for all to authenticated
 using(teacher_id=(select auth.uid()) and private.revision_is_teacher())
 with check(teacher_id=(select auth.uid()) and private.revision_is_teacher());
create index revision_teacher_drafts_teacher_idx on public.revision_teacher_drafts(teacher_id);

-- Internal visibility helper checks the caller, roster, archive, start time and targeting.
create function private.revision_can_access_assignment(aid uuid) returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from public.revision_assignments a join public.revision_classes c on c.id=a.class_id
 where a.id=aid and auth.uid() is not null and
 (a.teacher_id=auth.uid() or (not c.archived and a.start_at<=now() and
 (a.recipient_ids is null or auth.uid()=any(a.recipient_ids)) and private.revision_is_class_member(a.class_id))))
$$;
revoke all on function private.revision_can_access_assignment(uuid) from public,anon;
grant execute on function private.revision_can_access_assignment(uuid) to authenticated;
drop policy if exists revision_assignments_read on public.revision_assignments;
drop policy if exists revision_assignments_select on public.revision_assignments;
drop policy if exists revision_activities_read on public.revision_activities;
create policy revision_assignments_read on public.revision_assignments for select to authenticated using(private.revision_can_access_assignment(id));
create policy revision_activities_read on public.revision_activities for select to authenticated using(private.revision_can_access_assignment(assignment_id));
drop policy revision_drafts_read on public.revision_activity_drafts;
create policy revision_drafts_read on public.revision_activity_drafts for select to authenticated
 using((student_id=(select auth.uid()) and private.revision_can_access_assignment(assignment_id)) or exists(select 1 from public.revision_assignments a where a.id=assignment_id and a.teacher_id=(select auth.uid())));

alter function private.revision_assign_activity(jsonb,jsonb) rename to revision_assign_activity_base;
revoke all on function private.revision_assign_activity_base(jsonb,jsonb) from public,anon,authenticated;
create function private.revision_assign_activity(p_assignment jsonb,p_activity jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare r jsonb; aid uuid; cid uuid; targets uuid[]; start_time timestamptz; q jsonb; mode text;
begin
 cid:=(p_assignment->>'class_id')::uuid;
 if auth.uid() is null or not private.revision_is_teacher() or not exists(select 1 from public.revision_classes where id=cid and teacher_id=auth.uid() and not archived) then raise exception 'You must own this active class';end if;
 start_time:=coalesce(nullif(p_assignment->>'start_at','')::timestamptz,now());
 if start_time>(p_assignment->>'due_at')::timestamptz then raise exception 'Start must be before the due date';end if;
 if p_assignment->'recipient_ids' is not null and p_assignment->'recipient_ids'<>'null'::jsonb then
  if jsonb_typeof(p_assignment->'recipient_ids')<>'array' then raise exception 'Invalid student selection';end if;
  select array_agg(distinct value::uuid) into targets from jsonb_array_elements_text(p_assignment->'recipient_ids');
  if coalesce(array_length(targets,1),0)=0 or exists(select 1 from unnest(targets) s where not exists(select 1 from public.revision_class_members m where m.class_id=cid and m.student_id=s and m.status='joined')) then raise exception 'Select joined students in this class';end if;
 end if;
 mode:=coalesce(p_assignment->>'activity_mode','quiz');
 r:=private.revision_assign_activity_base(p_assignment,p_activity);aid:=(r->>'id')::uuid;
 update public.revision_assignments set start_at=start_time,recipient_ids=targets,
 target_score=coalesce((p_assignment->>'target_score')::integer,75),estimated_minutes=coalesce((p_assignment->>'estimated_minutes')::integer,15),activity_mode=mode where id=aid;
 return r;
end $$;
revoke all on function private.revision_assign_activity(jsonb,jsonb) from public,anon;
grant execute on function private.revision_assign_activity(jsonb,jsonb) to authenticated;
create function public.revision_assign_work(p_assignments jsonb,p_activity jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare meta jsonb; results jsonb:='[]';
begin
 if jsonb_typeof(p_assignments) is distinct from 'array' or jsonb_array_length(p_assignments) not between 1 and 30 then raise exception 'Select 1–30 classes';end if;
 for meta in select value from jsonb_array_elements(p_assignments) loop results:=results||jsonb_build_array(private.revision_assign_activity(meta,p_activity));end loop;
 return results;
end $$;
revoke all on function public.revision_assign_work(jsonb,jsonb) from public,anon;
grant execute on function public.revision_assign_work(jsonb,jsonb) to authenticated;

-- Guard existing scoring endpoints as well as REST reads.
alter function private.revision_save_activity_draft(uuid,jsonb) rename to revision_save_activity_draft_base;
alter function private.revision_submit_activity(uuid,jsonb,uuid) rename to revision_submit_activity_base;
alter function private.revision_activity_feedback(uuid,uuid) rename to revision_activity_feedback_base;
revoke all on function private.revision_save_activity_draft_base(uuid,jsonb),private.revision_submit_activity_base(uuid,jsonb,uuid),private.revision_activity_feedback_base(uuid,uuid) from public,anon,authenticated;
create function private.revision_save_activity_draft(p_assignment_id uuid,p_answers jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
begin if not private.revision_can_access_assignment(p_assignment_id) then raise exception 'Activity not available to you yet';end if;return private.revision_save_activity_draft_base(p_assignment_id,p_answers);end $$;
create function private.revision_submit_activity(p_assignment_id uuid,p_answers jsonb,p_submission_token uuid) returns jsonb language plpgsql security definer set search_path='' as $$
begin if not private.revision_can_access_assignment(p_assignment_id) then raise exception 'Activity not available to you yet';end if;return private.revision_submit_activity_base(p_assignment_id,p_answers,p_submission_token);end $$;
create function private.revision_activity_feedback(p_assignment_id uuid,p_attempt_id uuid default null) returns jsonb language plpgsql security definer set search_path='' as $$
begin if not private.revision_can_access_assignment(p_assignment_id) then raise exception 'Activity unavailable';end if;return private.revision_activity_feedback_base(p_assignment_id,p_attempt_id);end $$;
revoke all on function private.revision_save_activity_draft(uuid,jsonb),private.revision_submit_activity(uuid,jsonb,uuid),private.revision_activity_feedback(uuid,uuid) from public,anon;
grant execute on function private.revision_save_activity_draft(uuid,jsonb),private.revision_submit_activity(uuid,jsonb,uuid),private.revision_activity_feedback(uuid,uuid) to authenticated;

create function private.revision_teacher_template(aid uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.revision_assignments%rowtype; v public.revision_activities%rowtype; k jsonb; qs jsonb;
begin
 select * into a from public.revision_assignments where id=aid and teacher_id=auth.uid();
 select * into v from public.revision_activities where assignment_id=aid;
 if auth.uid() is null or a.id is null or v.assignment_id is null then raise exception 'Assignment not found';end if;
 select keys into k from private.revision_activity_keys where assignment_id=aid;
 select jsonb_agg(q||jsonb_build_object('key',k->(q->>'id'))) into qs from jsonb_array_elements(v.questions) q;
 return jsonb_build_object('meta',to_jsonb(a),'activity',jsonb_build_object('level',split_part(v.topic_key,':',1),'subject',split_part(v.topic_key,':',2),'topic',split_part(v.topic_key,':',3),'topicTitle',v.topic_title,'kind',v.kind,'questions',qs,'attempts_limit',v.attempts_limit,'feedback_mode',v.feedback_mode,'allow_late',v.allow_late));
end $$;
create function public.revision_teacher_template(aid uuid) returns jsonb language sql security invoker set search_path='' as $$select private.revision_teacher_template(aid)$$;
revoke all on function private.revision_teacher_template(uuid),public.revision_teacher_template(uuid) from public,anon;
grant execute on function private.revision_teacher_template(uuid),public.revision_teacher_template(uuid) to authenticated;
notify pgrst,'reload schema';
commit;
