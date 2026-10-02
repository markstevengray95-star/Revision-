begin;
create table public.revision_followup_runs (
 token uuid primary key,teacher_id uuid not null references auth.users(id)on delete cascade,
 source_id uuid not null references public.revision_assignments(id)on delete cascade,
 result jsonb not null,created_at timestamptz not null default now()
);
alter table public.revision_followup_runs enable row level security;
revoke all on public.revision_followup_runs from anon,authenticated;
grant select on public.revision_followup_runs to authenticated;
create policy revision_followup_runs_owner on public.revision_followup_runs for select to authenticated using(teacher_id=(select auth.uid()));
create index revision_followup_runs_teacher_idx on public.revision_followup_runs(teacher_id);
create index revision_followup_runs_source_idx on public.revision_followup_runs(source_id);
create function private.revision_assign_followups(p_source_id uuid,p_plan jsonb,p_token uuid)returns jsonb language plpgsql security definer set search_path='' as $$
declare source public.revision_assignments%rowtype;entry jsonb;result jsonb:='[]';prior public.revision_followup_runs%rowtype;
begin
 if auth.uid() is null or not private.revision_is_teacher() or p_token is null then raise exception 'Teacher authentication required';end if;
 select * into source from public.revision_assignments where id=p_source_id and teacher_id=auth.uid();if source.id is null then raise exception 'Source assignment not found';end if;
 perform pg_advisory_xact_lock(hashtextextended(p_token::text,0));
 select * into prior from public.revision_followup_runs where token=p_token;
 if prior.token is not null then if prior.teacher_id<>auth.uid()or prior.source_id<>p_source_id then raise exception 'Token already used';end if;return prior.result;end if;
 if jsonb_typeof(p_plan) is distinct from 'array' or jsonb_array_length(p_plan)not between 1 and 250 or octet_length(p_plan::text)>10000000 then raise exception 'Choose 1–250 follow-up assignments';end if;
 for entry in select value from jsonb_array_elements(p_plan)loop
  if (entry->'meta'->>'class_id')::uuid<>source.class_id or jsonb_typeof(entry->'meta'->'recipient_ids') is distinct from 'array' or jsonb_array_length(entry->'meta'->'recipient_ids')<>1 then raise exception 'Follow-ups must target one student from the source class';end if;
  result:=result||public.revision_assign_work(jsonb_build_array(entry->'meta'),entry->'activity');
 end loop;
 insert into public.revision_followup_runs(token,teacher_id,source_id,result)values(p_token,auth.uid(),p_source_id,result);return result;
end $$;
create function public.revision_assign_followups(p_source_id uuid,p_plan jsonb,p_token uuid)returns jsonb language sql security invoker set search_path='' as $$select private.revision_assign_followups(p_source_id,p_plan,p_token)$$;
revoke all on function private.revision_assign_followups(uuid,jsonb,uuid),public.revision_assign_followups(uuid,jsonb,uuid)from public,anon;
grant execute on function private.revision_assign_followups(uuid,jsonb,uuid),public.revision_assign_followups(uuid,jsonb,uuid)to authenticated;
notify pgrst,'reload schema';
commit;
