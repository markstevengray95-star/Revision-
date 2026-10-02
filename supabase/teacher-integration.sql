begin;
-- Reuse and duplication keep the reviewed lesson material and audience/settings.
create or replace function private.revision_teacher_template(aid uuid) returns jsonb language plpgsql security definer set search_path='' as $$
declare a public.revision_assignments%rowtype; v public.revision_activities%rowtype; k jsonb; qs jsonb;
begin
 select * into a from public.revision_assignments where id=aid and teacher_id=auth.uid();
 select * into v from public.revision_activities where assignment_id=aid;
 if auth.uid() is null or a.id is null or v.assignment_id is null then raise exception 'Assignment not found';end if;
 select keys into k from private.revision_activity_keys where assignment_id=aid;
 select jsonb_agg(q||jsonb_build_object('key',k->(q->>'id'))) into qs from jsonb_array_elements(v.questions) q;
 return jsonb_build_object('meta',to_jsonb(a),'activity',jsonb_build_object('level',split_part(v.topic_key,':',1),'subject',split_part(v.topic_key,':',2),'topic',split_part(v.topic_key,':',3),'topicTitle',v.topic_title,'kind',v.kind,'questions',qs,'attempts_limit',v.attempts_limit,'feedback_mode',v.feedback_mode,'allow_late',v.allow_late,'study_material',v.study_material,'pathway',case when exists(select 1 from jsonb_array_elements(v.questions) q where q->>'lessonHref' like '%mode=triple%')then 'triple'else 'combined'end));
end $$;
create or replace function private.revision_duplicate_activity(p_assignment_id uuid,p_due_at timestamptz) returns jsonb language plpgsql security definer set search_path='' as $$
declare t jsonb; meta jsonb; r jsonb;
begin
 t:=private.revision_teacher_template(p_assignment_id);
 meta:=t->'meta'||jsonb_build_object('title',left(t->'meta'->>'title'||' (copy)',120),'due_at',p_due_at,'start_at',now());
 r:=public.revision_assign_work(jsonb_build_array(meta),t->'activity');return r->0;
end $$;
notify pgrst,'reload schema';
commit;
