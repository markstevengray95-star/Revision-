begin;
alter table public.revision_activity_drafts add column time_spent_seconds integer not null default 0, add column question_times jsonb not null default '{}'::jsonb;
alter table public.revision_activity_attempts add column time_spent_seconds integer, add column question_times jsonb not null default '{}'::jsonb;
create function private.revision_record_study(p_assignment_id uuid,p_seconds integer,p_question_times jsonb) returns void language plpgsql security definer set search_path='' as $$
declare d public.revision_activity_drafts%rowtype;
begin
 if auth.uid() is null or not private.revision_can_access_assignment(p_assignment_id) or not private.revision_is_class_member((select class_id from public.revision_assignments where id=p_assignment_id)) then raise exception 'Activity unavailable';end if;
 if p_seconds not between 0 and 43200 or p_seconds is null or jsonb_typeof(p_question_times) is distinct from 'object' or octet_length(p_question_times::text)>10000 then raise exception 'Invalid study time';end if;
 if exists(select 1 from jsonb_each(p_question_times) t where jsonb_typeof(t.value)<>'number' or (t.value#>>'{}')::numeric not between 0 and 43200 or mod((t.value#>>'{}')::numeric,1)<>0 or not exists(select 1 from public.revision_activities a,jsonb_array_elements(a.questions)q where a.assignment_id=p_assignment_id and q->>'id'=t.key)) then raise exception 'Invalid question timing';end if;
 update public.revision_activity_drafts set time_spent_seconds=p_seconds,question_times=p_question_times where assignment_id=p_assignment_id and student_id=auth.uid();
end $$;
create function public.revision_record_study(p_assignment_id uuid,p_seconds integer,p_question_times jsonb) returns void language sql security invoker set search_path='' as $$select private.revision_record_study(p_assignment_id,p_seconds,p_question_times)$$;
revoke all on function private.revision_record_study(uuid,integer,jsonb),public.revision_record_study(uuid,integer,jsonb) from public,anon;
grant execute on function private.revision_record_study(uuid,integer,jsonb),public.revision_record_study(uuid,integer,jsonb) to authenticated;
create or replace function private.revision_submit_activity(p_assignment_id uuid,p_answers jsonb,p_submission_token uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare d public.revision_activity_drafts%rowtype;r jsonb;
begin
 if not private.revision_can_access_assignment(p_assignment_id) then raise exception 'Activity not available to you yet';end if;
 select * into d from public.revision_activity_drafts where assignment_id=p_assignment_id and student_id=auth.uid();
 r:=private.revision_submit_activity_base(p_assignment_id,p_answers,p_submission_token);
 if d.assignment_id is not null then
  update public.revision_activity_attempts set time_spent_seconds=coalesce(time_spent_seconds,d.time_spent_seconds),question_times=case when time_spent_seconds is null then d.question_times else question_times end where id=(r->>'id')::uuid and student_id=auth.uid();
  select to_jsonb(a)into r from public.revision_activity_attempts a where a.id=(r->>'id')::uuid;
 end if;return r;
end $$;
notify pgrst,'reload schema';
commit;
