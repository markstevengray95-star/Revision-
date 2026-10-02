-- Run through the connected project's SQL tool. All fixture rows are rolled back
-- in a subtransaction; no real accounts, classes, emails or submissions are kept.
do $$
declare
 t uuid:=gen_random_uuid();s uuid:=gen_random_uuid();o uuid:=gen_random_uuid();cid uuid;aid uuid;duplicate_id uuid;late_id uuid;
 code text;meta jsonb;activity jsonb;result jsonb;first_id uuid;token uuid:=gen_random_uuid();blocked boolean;student_answers jsonb;
begin
 begin
  insert into auth.users(id,email)values(t,t||'@revision-test.invalid'),(s,s||'@revision-test.invalid'),(o,o||'@revision-test.invalid');
  perform set_config('request.jwt.claim.sub',t::text,true);perform set_config('request.jwt.claims',jsonb_build_object('sub',t,'role','authenticated')::text,true);
  set local role authenticated;
  perform public.revision_ensure_profile('teacher','Test teacher');
  insert into public.revision_classes(teacher_id,name,subject,level)values(t,'Activity verification','Physics','GCSE')returning id,join_code into cid,code;
  meta:=jsonb_build_object('class_id',cid,'assignment_type','test','title','Verification activity','instructions','Test only','due_at',now()+interval '7 days');
  activity:='{"level":"gcse","subject":"physics","topic":"p1","topicTitle":"Energy","kind":"exam","attempts_limit":2,"feedback_mode":"after_final_attempt","allow_late":true,"questions":[{"id":"q1","type":"choice","marks":1,"prompt":"Which is correct?","options":[{"id":"a","text":"Correct"},{"id":"b","text":"Incorrect"}],"key":{"correct":"a","solution":["Correct explanation"]}},{"id":"q2","type":"number","marks":1,"prompt":"Calculate the result.","key":{"value":0.125,"tolerance":0.0005,"solution":["Divide 1 by 8: 0.125"]}},{"id":"q3","type":"written","marks":2,"prompt":"Explain the result.","key":{"solution":["First point","Second point"]}}]}'::jsonb;
  result:=public.revision_assign_activity(meta,activity);aid:=(result->>'id')::uuid;
  if result->>'total_marks'<>'4' then raise exception 'Wrong generated total';end if;
  if exists(select 1 from public.revision_activities where assignment_id=aid and questions::text like '%solution%') then raise exception 'Answer keys leaked into public questions';end if;
  perform set_config('request.jwt.claim.sub',s::text,true);perform set_config('request.jwt.claims',jsonb_build_object('sub',s,'role','authenticated')::text,true);
  perform public.revision_ensure_profile('student','Test student');perform public.revision_join_class(code,'Test student');
  if (select count(*)from public.revision_activities where assignment_id=aid)<>1 then raise exception 'Joined student cannot read activity';end if;
  blocked:=false;begin perform keys from private.revision_activity_keys;exception when insufficient_privilege then blocked:=true;end;if not blocked then raise exception 'Private answer keys are readable';end if;
  perform public.revision_save_activity_draft(aid,'{"q1":"a"}');
  if (select answers->>'q1'from public.revision_activity_drafts where assignment_id=aid)<>'a' then raise exception 'Draft did not persist';end if;
  student_answers:='{"q1":"a","q2":"5","q3":"A written explanation"}';
  result:=public.revision_submit_activity(aid,student_answers,token);first_id:=(result->>'id')::uuid;
  if result->>'score'<>'1' or result->>'auto_max'<>'2' or result->>'review_state'<>'pending' then raise exception 'Wrong automatic or written marking';end if;
  if exists(select 1 from public.revision_activity_drafts where assignment_id=aid) then raise exception 'Submitted draft remains';end if;
  if (public.revision_submit_activity(aid,student_answers,token)->>'id')::uuid<>first_id or(select count(*)from public.revision_activity_attempts where assignment_id=aid)<>1 then raise exception 'Retry was not idempotent';end if;
  if (public.revision_activity_feedback(aid,first_id)->>'released')::boolean then raise exception 'Solutions released before final attempt';end if;
  blocked:=false;begin perform public.revision_submit_assignment(aid,'Forged completion');exception when others then if sqlerrm like '%activity workspace%'then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Legacy submission bypass';end if;
  blocked:=false;begin update public.revision_activity_attempts set score=4 where id=first_id;exception when insufficient_privilege then blocked:=true;end;if not blocked then raise exception 'Student can forge score';end if;
  blocked:=false;begin perform public.revision_review_activity(first_id,'{"q3":2}','Forged mark');exception when others then if sqlerrm like '%Teacher authentication%'then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Student can review own work';end if;
  perform set_config('request.jwt.claim.sub',t::text,true);perform set_config('request.jwt.claims',jsonb_build_object('sub',t,'role','authenticated')::text,true);
  result:=public.revision_review_activity(first_id,'{"q3":2}','Good explanation');
  if result->>'score'<>'3' or result->>'review_state'<>'complete' or(select score from public.revision_submissions where assignment_id=aid)<>3 then raise exception 'Review did not update result';end if;
  result:=public.revision_duplicate_activity(aid,now()+interval '14 days');duplicate_id:=(result->>'id')::uuid;
  if (select questions from public.revision_activities where assignment_id=duplicate_id)is distinct from(select questions from public.revision_activities where assignment_id=aid) then raise exception 'Duplicate lost questions';end if;
  result:=public.revision_assign_activity(meta||jsonb_build_object('start_at',now()-interval '2 days','due_at',now()-interval '1 day'),activity||'{"allow_late":false,"feedback_mode":"after_due"}');late_id:=(result->>'id')::uuid;
  perform set_config('request.jwt.claim.sub',s::text,true);perform set_config('request.jwt.claims',jsonb_build_object('sub',s,'role','authenticated')::text,true);
  blocked:=false;begin perform public.revision_submit_activity(late_id,student_answers,gen_random_uuid());exception when others then if sqlerrm like '%deadline%'then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Deadline not enforced';end if;
  result:=public.revision_submit_activity(aid,'{"q1":"b","q2":"1.25e-1","q3":"Improved explanation"}',gen_random_uuid());
  if result->>'score'<>'1' or result->>'attempt_no'<>'2' then raise exception 'Scientific notation or attempts incorrect';end if;
  if not(public.revision_activity_feedback(aid,null)->>'released')::boolean then raise exception 'Final-attempt feedback missing';end if;
  blocked:=false;begin perform public.revision_save_activity_draft(aid,student_answers);exception when others then if sqlerrm like '%All attempts%'then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Draft can resurrect exhausted activity';end if;
  blocked:=false;begin perform public.revision_submit_activity(aid,student_answers,gen_random_uuid());exception when others then if sqlerrm like '%All attempts%'then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Retry limit bypass';end if;
  perform set_config('request.jwt.claim.sub',o::text,true);perform set_config('request.jwt.claims',jsonb_build_object('sub',o,'role','authenticated')::text,true);
  perform public.revision_ensure_profile('teacher','Other teacher');
  if exists(select 1 from public.revision_activities where assignment_id=aid)or exists(select 1 from public.revision_activity_attempts where assignment_id=aid)then raise exception 'Unrelated account can read work';end if;
  blocked:=false;begin perform public.revision_activity_feedback(aid,first_id);exception when others then if sqlerrm like '%unavailable%'then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Unrelated account can obtain solutions';end if;
  blocked:=false;begin perform public.revision_review_activity(first_id,'{"q3":2}','Other teacher');exception when others then if sqlerrm like '%not found%'then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Wrong teacher can mark work';end if;
  perform set_config('request.jwt.claim.sub',t::text,true);perform set_config('request.jwt.claims',jsonb_build_object('sub',t,'role','authenticated')::text,true);
  result:=public.revision_assign_work(jsonb_build_array(meta||jsonb_build_object('start_at',now()+interval '1 day','recipient_ids',jsonb_build_array(s))),activity);late_id:=(result->0->>'id')::uuid;
  if public.revision_teacher_template(late_id)->'activity'->'questions'->0->'key' is null then raise exception 'Teacher reuse lost answer keys';end if;
  perform set_config('request.jwt.claim.sub',s::text,true);perform set_config('request.jwt.claims',jsonb_build_object('sub',s,'role','authenticated')::text,true);
  if exists(select 1 from public.revision_assignments where id=late_id) or exists(select 1 from public.revision_activities where assignment_id=late_id) then raise exception 'Scheduled content visible early';end if;
  blocked:=false;begin perform public.revision_save_activity_draft(late_id,student_answers);exception when others then if sqlerrm like '%not available%' then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Scheduled draft bypass';end if;
  blocked:=false;begin perform public.revision_submit_activity(late_id,student_answers,gen_random_uuid());exception when others then if sqlerrm like '%not available%' then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Scheduled submit bypass';end if;
  perform set_config('request.jwt.claim.sub',t::text,true);perform set_config('request.jwt.claims',jsonb_build_object('sub',t,'role','authenticated')::text,true);
  blocked:=false;begin perform public.revision_assign_work(jsonb_build_array(meta,meta||jsonb_build_object('class_id',gen_random_uuid())),activity);exception when others then if sqlerrm like '%own this active%' then blocked:=true;else raise;end if;end;if not blocked then raise exception 'Atomic class ownership bypass';end if;
  raise exception using errcode='ZX001',message='Rollback verification fixtures';
 exception when sqlstate 'ZX001'then null;
 end;
end $$;
select 'Passed: scheduled release, RPC guards, reuse, atomic multi-class ownership, generation, private keys, student membership, saved drafts, objective marking, written review, idempotency, legacy bypass protection, score tampering protection, retry limits, deadline, feedback release, duplication and class isolation. Fixtures rolled back.' as activity_database_verification;
