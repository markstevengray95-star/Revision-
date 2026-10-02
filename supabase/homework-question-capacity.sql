-- Expand the existing classroom assignment limit without changing marking,
-- membership checks, private answer keys, deadlines, retries or feedback rules.
-- Run after topic-activities.sql. Safe to reapply.
do $migration$
declare
 definition text := pg_get_functiondef('private.revision_assign_activity(jsonb,jsonb)'::regprocedure);
 previous_limit text := 'jsonb_array_length(p_activity->''questions'') not between 1 and 30 or';
 expanded_limit text := 'jsonb_array_length(p_activity->''questions'') not between 1 and 60 or';
begin
 if position(previous_limit in definition) > 0 then
  definition := replace(definition, previous_limit, expanded_limit);
  definition := replace(definition, 'Choose 1–30 questions', 'Choose 1–60 questions');
  execute definition;
 elsif position(expanded_limit in definition) = 0 then
  raise exception 'Assignment validator has changed. Inspect its definition before applying this upgrade.';
 end if;
end;
$migration$;
