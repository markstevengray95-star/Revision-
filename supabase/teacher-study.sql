begin;
alter table public.revision_activities add column study_material jsonb not null default '[]'::jsonb;
create function private.revision_store_study_material() returns trigger language plpgsql security definer set search_path='' as $$
declare cards jsonb; c jsonb; clean jsonb:='[]';
begin
 cards:=coalesce(nullif(current_setting('revision.study_material',true),''),'[]')::jsonb;
 if jsonb_typeof(cards)<>'array' or jsonb_array_length(cards)>30 or octet_length(cards::text)>100000 then raise exception 'Invalid study material';end if;
 for c in select value from jsonb_array_elements(cards) loop
  clean:=clean||jsonb_build_array(jsonb_build_object('title',left(coalesce(c->>'title','Lesson'),200),'text',left(coalesce(c->>'text',''),6000)));
 end loop;
 new.study_material:=clean;return new;
end $$;
revoke all on function private.revision_store_study_material() from public,anon,authenticated;
create trigger revision_store_study_material before insert on public.revision_activities for each row execute function private.revision_store_study_material();
create or replace function public.revision_assign_work(p_assignments jsonb,p_activity jsonb) returns jsonb language plpgsql security invoker set search_path='' as $$
declare meta jsonb; results jsonb:='[]';
begin
 if jsonb_typeof(p_assignments) is distinct from 'array' or jsonb_array_length(p_assignments) not between 1 and 30 then raise exception 'Select 1–30 classes';end if;
 perform set_config('revision.study_material',coalesce((p_activity->'study_material')::text,'[]'),true);
 for meta in select value from jsonb_array_elements(p_assignments) loop results:=results||jsonb_build_array(private.revision_assign_activity(meta,p_activity));end loop;
 return results;
end $$;
notify pgrst,'reload schema';
commit;
