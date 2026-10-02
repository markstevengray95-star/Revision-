begin;
create table public.revision_intervention_groups (
 id uuid primary key default gen_random_uuid(),class_id uuid not null references public.revision_classes(id) on delete cascade,
 teacher_id uuid not null references auth.users(id) on delete cascade,name text not null check(length(name) between 1 and 120),
 category text not null default 'manual',topic_key text not null default '',created_at timestamptz not null default now(),unique(id,teacher_id)
);
create table public.revision_intervention_members (
 group_id uuid not null,teacher_id uuid not null,student_id uuid not null references auth.users(id) on delete cascade,
 primary key(group_id,student_id),foreign key(group_id,teacher_id)references public.revision_intervention_groups(id,teacher_id)on delete cascade
);
alter table public.revision_intervention_groups enable row level security;
alter table public.revision_intervention_members enable row level security;
revoke all on public.revision_intervention_groups,public.revision_intervention_members from anon,authenticated;
grant select,delete on public.revision_intervention_groups to authenticated;
grant select on public.revision_intervention_members to authenticated;
create policy revision_intervention_groups_owner on public.revision_intervention_groups for select to authenticated using(teacher_id=(select auth.uid()) and private.revision_owns_class(class_id));
create policy revision_intervention_groups_delete on public.revision_intervention_groups for delete to authenticated using(teacher_id=(select auth.uid()) and private.revision_owns_class(class_id));
create policy revision_intervention_members_owner on public.revision_intervention_members for select to authenticated using(teacher_id=(select auth.uid()));
create index revision_intervention_groups_teacher_idx on public.revision_intervention_groups(teacher_id);
create index revision_intervention_groups_class_idx on public.revision_intervention_groups(class_id);
create index revision_intervention_members_teacher_idx on public.revision_intervention_members(teacher_id);
create index revision_intervention_members_student_idx on public.revision_intervention_members(student_id);
create function private.revision_save_intervention(p_group jsonb,p_students uuid[])returns uuid language plpgsql security definer set search_path='' as $$
declare gid uuid;cid uuid;
begin
 cid:=(p_group->>'class_id')::uuid;gid:=nullif(p_group->>'id','')::uuid;
 if auth.uid() is null or not private.revision_is_teacher() or not exists(select 1 from public.revision_classes where id=cid and teacher_id=auth.uid() and not archived)then raise exception 'You must own this active class';end if;
 if p_students is null or coalesce(array_length(p_students,1),0)=0 or exists(select 1 from unnest(p_students)s where s is null or not exists(select 1 from public.revision_class_members m where m.class_id=cid and m.student_id=s and m.status='joined'))then raise exception 'Select joined students in this class';end if;
 if gid is null then
  insert into public.revision_intervention_groups(class_id,teacher_id,name,category,topic_key)values(cid,auth.uid(),btrim(p_group->>'name'),left(coalesce(p_group->>'category','manual'),80),left(coalesce(p_group->>'topic_key',''),120))returning id into gid;
 else
  update public.revision_intervention_groups set name=btrim(p_group->>'name')where id=gid and class_id=cid and teacher_id=auth.uid();if not found then raise exception 'Group not found';end if;
 end if;
 delete from public.revision_intervention_members where group_id=gid;
 insert into public.revision_intervention_members(group_id,teacher_id,student_id)select gid,auth.uid(),s from (select distinct unnest(p_students)s)x;
 return gid;
end $$;
create function public.revision_save_intervention(p_group jsonb,p_students uuid[])returns uuid language sql security invoker set search_path='' as $$select private.revision_save_intervention(p_group,p_students)$$;
revoke all on function private.revision_save_intervention(jsonb,uuid[]),public.revision_save_intervention(jsonb,uuid[])from public,anon;
grant execute on function private.revision_save_intervention(jsonb,uuid[]),public.revision_save_intervention(jsonb,uuid[])to authenticated;
notify pgrst,'reload schema';
commit;
