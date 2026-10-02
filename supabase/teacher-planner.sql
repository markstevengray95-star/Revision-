begin;
create table public.revision_homework_plans (
 id uuid primary key default gen_random_uuid(),teacher_id uuid not null references auth.users(id)on delete cascade,
 class_id uuid not null references public.revision_classes(id)on delete cascade,
 name text not null check(length(name)between 1 and 120),payload jsonb not null check(octet_length(payload::text)<5000000),
 scheduled_ids jsonb,created_at timestamptz not null default now(),scheduled_at timestamptz
);
alter table public.revision_homework_plans enable row level security;
revoke all on public.revision_homework_plans from anon,authenticated;
grant select,insert,delete on public.revision_homework_plans to authenticated;
create policy revision_homework_plans_owner on public.revision_homework_plans for select to authenticated using(teacher_id=(select auth.uid()) and private.revision_owns_class(class_id));
create policy revision_homework_plans_insert on public.revision_homework_plans for insert to authenticated with check(teacher_id=(select auth.uid()) and private.revision_owns_class(class_id) and private.revision_is_teacher() and scheduled_ids is null and scheduled_at is null);
create policy revision_homework_plans_delete on public.revision_homework_plans for delete to authenticated using(teacher_id=(select auth.uid()) and private.revision_owns_class(class_id));
create index revision_homework_plans_teacher_idx on public.revision_homework_plans(teacher_id);
create index revision_homework_plans_class_idx on public.revision_homework_plans(class_id);
create function private.revision_schedule_plan(p_plan_id uuid)returns jsonb language plpgsql security definer set search_path='' as $$
declare p public.revision_homework_plans%rowtype;item jsonb;result jsonb:='[]';
begin
 if auth.uid() is null or not private.revision_is_teacher()then raise exception 'Teacher authentication required';end if;
 select * into p from public.revision_homework_plans where id=p_plan_id and teacher_id=auth.uid()for update;if p.id is null then raise exception 'Plan not found';end if;
 if p.scheduled_ids is not null then return p.scheduled_ids;end if;
 if jsonb_typeof(p.payload->'entries') is distinct from 'array' or jsonb_array_length(p.payload->'entries')not between 1 and 52 then raise exception 'Plan needs 1–52 weeks';end if;
 for item in select value from jsonb_array_elements(p.payload->'entries')loop
  if (item->'meta'->>'class_id')::uuid<>p.class_id then raise exception 'Plan class mismatch';end if;
  result:=result||public.revision_assign_work(jsonb_build_array(item->'meta'),item->'activity');
 end loop;
 update public.revision_homework_plans set scheduled_ids=result,scheduled_at=now()where id=p.id;return result;
end $$;
create function public.revision_schedule_plan(p_plan_id uuid)returns jsonb language sql security invoker set search_path='' as $$select private.revision_schedule_plan(p_plan_id)$$;
revoke all on function private.revision_schedule_plan(uuid),public.revision_schedule_plan(uuid)from public,anon;
grant execute on function private.revision_schedule_plan(uuid),public.revision_schedule_plan(uuid)to authenticated;
create table public.revision_teacher_alert_state (
 teacher_id uuid not null references auth.users(id)on delete cascade,alert_key text not null check(length(alert_key)between 1 and 400),
 dismissed_at timestamptz not null default now(),primary key(teacher_id,alert_key)
);
alter table public.revision_teacher_alert_state enable row level security;
revoke all on public.revision_teacher_alert_state from anon,authenticated;
grant select,insert,update,delete on public.revision_teacher_alert_state to authenticated;
create policy revision_teacher_alert_owner on public.revision_teacher_alert_state for all to authenticated
 using(teacher_id=(select auth.uid()) and private.revision_is_teacher())with check(teacher_id=(select auth.uid()) and private.revision_is_teacher());
create function public.revision_dismiss_alert(p_key text)returns void language sql security invoker set search_path='' as $$
 insert into public.revision_teacher_alert_state(teacher_id,alert_key)values(auth.uid(),p_key)on conflict(teacher_id,alert_key)do update set dismissed_at=now()
$$;
revoke all on function public.revision_dismiss_alert(text)from public,anon;
grant execute on function public.revision_dismiss_alert(text)to authenticated;
notify pgrst,'reload schema';
commit;
