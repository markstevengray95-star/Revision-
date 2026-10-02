-- Pass start_at into the original validated insert so past-due test fixtures
-- and imported homework satisfy the date constraint before the wrapper updates.
do $$declare body text;begin
 select pg_get_functiondef('private.revision_assign_activity_base(jsonb,jsonb)'::regprocedure) into body;
 body:=replace(body,'due_at,max_points,status)','due_at,max_points,status,start_at)');
 body:=replace(body, 'total,''active'')returning', 'total,''active'',coalesce(nullif(p_assignment->>''start_at'','''')::timestamptz,now()))returning');
 execute body;
end $$;
