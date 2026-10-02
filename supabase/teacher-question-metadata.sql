-- Extend the validated public question allowlist. No arbitrary nested fields or answer keys.
do $$declare body text;begin
 select pg_get_functiondef('private.revision_assign_activity_base(jsonb,jsonb)'::regprocedure) into body;
 body:=replace(body,'''lessonId'',left(coalesce(q->>''lessonId'',''''),120)',
 '''subject'',left(coalesce(p_activity->>''subject'',''''),80),''topic'',left(coalesce(p_activity->>''topic'',''''),120),''subtopic'',left(coalesce(q->>''subtopic'',q->>''title'',''''),200),''skill'',case when q->>''skill'' in (''recall'',''calculation'',''exam'',''application'') then q->>''skill'' when q->>''type''=''number'' then ''calculation'' when q->>''type''=''written'' then ''exam'' else ''recall'' end,''specification'',left(coalesce(q->>''specification'',''''),100),''misconception'',left(coalesce(q->>''misconception'',''''),1000),''difficulty'',case when q->>''difficulty'' in (''foundation'',''standard'',''application'',''challenge'') then q->>''difficulty'' else ''standard'' end,''lessonId'',left(coalesce(q->>''lessonId'',''''),120)');
 execute body;
end $$;
