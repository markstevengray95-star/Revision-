(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.REVISION_HOMEWORK_FOLLOWUPS=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
 'use strict';
 function latest(attempts,sourceId,studentId){return attempts.filter(a=>a.assignment_id===sourceId&&a.student_id===studentId).sort((a,b)=>Number(b.attempt_no)-Number(a.attempt_no))[0];}
 function eligible(state,source){return state.members.filter(m=>m.class_id===source.class_id&&m.status==='joined'&&(!source.recipient_ids||source.recipient_ids.includes(m.student_id))).map(member=>({member,attempt:latest(state.attempts,source.id,member.student_id)})).filter(({attempt})=>attempt?.review_state==='complete'&&Number.isFinite(Number(attempt.score))&&Number(attempt.total_max)>0);}
 function signature(state,source){return JSON.stringify({source:source.id,classId:source.class_id,recipients:source.recipient_ids,results:eligible(state,source).map(({member,attempt})=>[member.student_id,attempt.id,attempt.attempt_no,attempt.score,attempt.total_max,attempt.marks])});}
 function dateAt(day,offset,hour){const d=new Date(day+'T00:00:00');d.setDate(d.getDate()+offset);d.setHours(hour,0,0,0);return d;}
 function build({state,source,template,studentIds,mode='both',firstDate,now=new Date()}){
  if(!['both','corrections','spaced'].includes(mode))throw Error('Choose corrections, spaced retrieval or both.');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(firstDate||'')||!Number.isFinite(dateAt(firstDate,0,8).getTime())||dateAt(firstDate,0,8)<=now)throw Error('Choose a first retrieval date in the future.');
  if(!template?.questions?.length||template.questions.some(q=>!q.key?.solution?.length))throw Error('The teacher question template and mark schemes are required.');
  const allowed=eligible(state,source),chosen=new Set(studentIds||[]);
  if(!chosen.size||[...chosen].some(id=>!allowed.some(r=>r.member.student_id===id)))throw Error('Select students with fully marked latest attempts from this assignment.');
  const plan=[],parts=(template.topic_key||'').split(':'),course={level:template.level||parts[0],subject:template.subject||parts[1],topic:template.topic||parts.slice(2).join(':'),topicTitle:template.topicTitle||template.topic_title,pathway:template.pathway||'combined'};
  if(!course.level||!course.subject||!course.topic)throw Error('The source activity is missing its course or topic.');
  for(const {member,attempt} of allowed.filter(r=>chosen.has(r.member.student_id))){
   const weak=template.questions.filter(q=>{const m=attempt.marks?.find(m=>m.id===q.id);return m&&m.awarded!==null&&Number.isFinite(Number(m.awarded))&&Number(m.awarded)<Number(m.max_marks);});
   const make=(questions,label,start,due,kind='quiz')=>{const activity={version:1,...course,kind,questions,attempts_limit:2,feedback_mode:'after_final_attempt',allow_late:true};const meta={class_id:source.class_id,assignment_type:'homework',title:(source.title+' · '+label).slice(0,120),instructions:label==='Corrections'?'Revisit the questions you lost marks on. Write the corrected answer and explain your reasoning. Your teacher will review the corrections.':'Retrieval practice revisits selected questions from your previous homework, prioritising questions you lost marks on. Try recalling first, then use your notes to check your understanding.',start_at:start.toISOString(),due_at:due.toISOString(),recipient_ids:[member.student_id],target_score:75,estimated_minutes:Math.max(5,questions.length*2),activity_mode:label==='Corrections'?'exam':'mixed'};plan.push({meta,activity,student:member,label,sourceAttemptId:attempt.id});};
   if(mode!=='spaced'&&weak.length){
    const questions=weak.slice(0,12).map((q,i)=>{let previous=attempt.answers?.[q.id]||'(No answer recorded)';if(q.type==='choice')previous=q.options.find(o=>o.id===previous)?.text||previous;const prefix=q.prompt.slice(0,4000),response=String(previous).slice(0,1000);return {...q,id:'correction_'+i,type:'written',marks:3,options:[],prompt:prefix+'\nYour previous answer: '+response+'\nWrite a corrected answer and explain the scientific reasoning. For calculations, show your working and units.',key:{solution:[...q.key.solution.slice(0,29),'Award credit for the corrected answer and a valid explanation or working.']}};});
    make(questions,'Corrections',now,dateAt(firstDate,0,23),'exam');
   }
   if(mode!=='corrections'){
    const ordered=[...weak,...template.questions.filter(q=>!weak.some(w=>w.id===q.id))];
    for(const [stage,offset] of [0,6,20].entries()){
     // Deliberate retrieval of prior questions; do not imply these are new assessments.
     const questions=ordered.slice(0,Math.min(6,ordered.length)).map((q,i)=>{const copy=JSON.parse(JSON.stringify(q));copy.id='retrieval_'+i;if(copy.type==='choice'&&copy.options.length>1){const shift=(stage+1)%copy.options.length;copy.options=[...copy.options.slice(shift),...copy.options.slice(0,shift)];}return copy;});
     make(questions,'Retrieval '+(stage+1),dateAt(firstDate,offset,8),dateAt(firstDate,offset+2,23));
    }
   }
  }
  if(plan.length>250)throw Error('This plan exceeds 250 assignments. Select fewer students or use one follow-up type.');
  return {plan,signature:signature(state,source),students:chosen.size,corrections:plan.filter(p=>p.label==='Corrections').length,retrieval:plan.filter(p=>p.label!=='Corrections').length};
 }
 return {latest,eligible,signature,build};
});
