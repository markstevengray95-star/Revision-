(() => {
  'use strict';
  const percent = (score, max) => max > 0 && score !== null && score !== undefined ? Math.round(100 * Number(score) / Number(max)) : null;
  const latest = (attempts) => {
    const map = new Map();
    for (const a of attempts) {
      const key = `${a.assignment_id}:${a.student_id}`;
      if (!map.has(key) || Number(a.attempt_no) > Number(map.get(key).attempt_no)) map.set(key, a);
    }
    return [...map.values()];
  };
  function recipients(state, assignment) {
    return state.members.filter(m => m.class_id === assignment.class_id && m.status === 'joined' &&
      (!assignment.recipient_ids || assignment.recipient_ids.includes(m.student_id)));
  }
  function result(state, assignment, studentId) {
    const attempt = latest(state.attempts).find(a => a.assignment_id === assignment.id && a.student_id === studentId);
    const submission = state.submissions.find(s => s.assignment_id === assignment.id && s.student_id === studentId);
    const draft = (state.drafts || []).find(d => d.assignment_id === assignment.id && d.student_id === studentId);
    const score = attempt ? (attempt.review_state === 'complete' ? percent(attempt.score, attempt.total_max) : null) : percent(submission?.score, assignment.max_points);
    const status = attempt ? (attempt.review_state === 'complete' ? 'Complete' : 'Needs review') : submission ? 'Complete' : draft ? 'In progress' : 'Not started';
    return { attempt, submission, draft, score, status, attempts: attempt?.attempt_no || 0,
      time: attempt?.time_spent_seconds ?? draft?.time_spent_seconds ?? null,
      overdue: !attempt && !submission && assignment.status === 'active' && new Date(assignment.due_at).getTime() < Date.now(),
      belowTarget: score !== null && score < (assignment.target_score ?? 75) };
  }
  function overview(state, now = new Date()) {
    const day = new Date(now); day.setHours(0, 0, 0, 0);
    const tomorrow = new Date(day); tomorrow.setDate(tomorrow.getDate() + 1);
    const week = new Date(tomorrow); week.setDate(week.getDate() + 6);
    const active = state.assignments.filter(a => a.status === 'active');
    const scores = state.assignments.flatMap(a => recipients(state, a).map(m => result(state, a, m.student_id).score)).filter(s => s !== null);
    const overdue = new Set(active.filter(a => new Date(a.due_at) < now).flatMap(a => recipients(state, a).filter(m => !result(state, a, m.student_id).attempt && !result(state, a, m.student_id).submission).map(m => m.student_id)));
    const averages = new Map();
    for (const a of state.assignments) for (const m of recipients(state, a)) {
      const s = result(state, a, m.student_id).score;
      if (s !== null) { const list = averages.get(m.student_id) || []; list.push(s); averages.set(m.student_id, list); }
    }
    return { today: active.filter(a => new Date(a.due_at) >= day && new Date(a.due_at) < tomorrow).length,
      week: active.filter(a => new Date(a.due_at) >= day && new Date(a.due_at) < week).length,
      overdue: overdue.size, average: scores.length ? Math.round(scores.reduce((a,b) => a+b,0)/scores.length) : null,
      below: [...averages.values()].filter(v => v.reduce((a,b) => a+b,0)/v.length < 50).length,
      recent: latest(state.attempts).filter(a => a.review_state === 'complete').sort((a,b) => new Date(b.submitted_at)-new Date(a.submitted_at)).slice(0,5) };
  }
  function markbook(state, {classId, view='assignment', studentId='', from='', to=''}={}) {
    const assignments=state.assignments.filter(a=>a.class_id===classId && (!from || a.due_at.slice(0,10)>=from) && (!to || a.due_at.slice(0,10)<=to));
    const members=state.members.filter(m=>m.class_id===classId && m.status==='joined' && (!studentId || m.student_id===studentId));
    const topicFor=a=>state.activities.find(v=>v.assignment_id===a.id)?.topic_key || a.id;
    const columns=view==='topic'?[...new Map(assignments.map(a=>[topicFor(a),{id:topicFor(a),title:state.activities.find(v=>v.assignment_id===a.id)?.topic_title || a.title}])).values()]:assignments.map(a=>({id:a.id,title:a.title}));
    const rows=members.map(member=>{
      const values=columns.map(col=>{
        const tasks=assignments.filter(a=>(view==='topic'?topicFor(a):a.id)===col.id && recipients(state,a).some(m=>m.student_id===member.student_id));
        const results=tasks.map(a=>result(state,a,member.student_id)), scores=results.map(r=>r.score).filter(s=>s!==null);
        return {score:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null,status:!tasks.length?'Not assigned':results.some(r=>r.status==='Needs review')?'Needs review':results.some(r=>r.status!=='Complete')?'Incomplete':'Complete'};
      });
      const scored=values.map(v=>v.score).filter(s=>s!==null);
      return {member,values,average:scored.length?Math.round(scored.reduce((a,b)=>a+b,0)/scored.length):null};
    });
    return {columns,rows};
  }
  function evidence(state,classId,studentId='') {
    const rows=[];
    for(const a of latest(state.attempts).filter(a=>a.class_id===classId && (!studentId||a.student_id===studentId))) {
      const activity=state.activities.find(v=>v.assignment_id===a.assignment_id),assignment=state.assignments.find(v=>v.id===a.assignment_id);
      if(!activity||!assignment||!recipients(state,assignment).some(m=>m.student_id===a.student_id))continue;
      for(const q of activity.questions) {const mark=a.marks?.find(m=>m.id===q.id);if(!mark||mark.awarded===null||mark.awarded===undefined)continue;
        const prefix=activity.topic_key.split(':').slice(0,2).join(':'),topic=q.topic?prefix+':'+q.topic:activity.topic_key;
        const lesson=typeof window==='object'?window.REVISION_PRACTICE?.lessons.find(l=>l.id===q.lessonId):null;
        const topicTitle=topic===activity.topic_key?activity.topic_title:lesson?.topicTitle||state.activities.find(v=>v.topic_key===topic)?.topic_title||q.topic;
        rows.push({studentId:a.student_id,assignmentId:a.assignment_id,questionId:q.id,question:q,topic,topicTitle,
          subtopic:q.subtopic||q.title||activity.topic_title,skill:q.skill||(q.type==='number'?'calculation':q.type==='written'?'exam':'recall'),
          awarded:Number(mark.awarded),max:Number(mark.max_marks||q.marks),submittedAt:a.submitted_at});
      }
    }return rows;
  }
  function mastery(state,classId,dimension='topic',studentId='') {
    const map=new Map();for(const e of evidence(state,classId,studentId)){
      const key=dimension==='topic'?e.topic:dimension==='subtopic'?e.topic+':'+e.subtopic:e.skill;
      const row=map.get(key)||{id:key,title:dimension==='topic'?e.topicTitle:dimension==='subtopic'?e.subtopic:e.skill,topic:e.topic,awarded:0,max:0,responses:0,students:new Set(),weakStudents:new Set(),evidence:[]};
      row.awarded+=e.awarded;row.max+=e.max;row.responses++;row.students.add(e.studentId);if(e.awarded<e.max)row.weakStudents.add(e.studentId);row.evidence.push(e);map.set(key,row);
    }
    return [...map.values()].map(r=>({...r,score:percent(r.awarded,r.max),studentCount:r.students.size})).sort((a,b)=>a.score-b.score);
  }
  function interventions(state,classId) {
    const groups=new Map(),add=(id,title,category,topic,member,score)=>{const g=groups.get(id)||{id,title,category,topic,students:[],scores:[]};g.students.push(member.student_id);g.scores.push(score);groups.set(id,g);};
    for(const member of state.members.filter(m=>m.class_id===classId&&m.status==='joined')){
      const rows=evidence(state,classId,member.student_id),topics=mastery(state,classId,'topic',member.student_id),skills=mastery(state,classId,'skill',member.student_id);
      for(const r of topics)if(r.responses>=3&&r.score<50)add(r.id,'Topic support · '+r.title,'topic',r.topic,member,r.score);
      const calc=skills.find(s=>s.id==='calculation'),exam=skills.find(s=>s.id==='exam'),recall=skills.find(s=>s.id==='recall');
      if(calc?.responses>=2&&calc.score<50)add('calculations','Calculation support','calculation','',member,calc.score);
      if(exam?.responses>=2&&recall?.responses>=2&&recall.score>=70&&exam.score<60)add('exam','Exam technique','exam','',member,exam.score);
      const overall=percent(rows.reduce((s,r)=>s+r.awarded,0),rows.reduce((s,r)=>s+r.max,0));
      if(rows.length>=3&&overall>=85)add('extension','Extension','extension','',member,overall);
    }
    return [...groups.values()].map(g=>({...g,average:Math.round(g.scores.reduce((a,b)=>a+b,0)/g.scores.length)}));
  }
  const followupBand = score => score===null ? null : score<50?'foundation':score<75?'consolidation':score<90?'application':'challenge';
  function alerts(state,now=new Date()) {
    const out=[];const active=state.assignments.filter(a=>a.status==='active'&&new Date(a.due_at)<now);
    for(const a of active){const missing=recipients(state,a).filter(m=>{const r=result(state,a,m.student_id);return !r.attempt&&!r.submission;});if(missing.length)out.push({key:'deadline:'+a.id+':'+a.due_at,title:`${a.title}: ${missing.length} students overdue`,classId:a.class_id,assignmentId:a.id});}
    const cutoff=new Date(now);cutoff.setDate(cutoff.getDate()-30);
    for(const c of state.classes){const all=latest(state.attempts).filter(a=>a.class_id===c.id&&a.review_state==='complete');
      for(const m of state.members.filter(m=>m.class_id===c.id&&m.status==='joined')){
        const missed=state.assignments.filter(a=>a.class_id===c.id&&new Date(a.due_at)<now&&new Date(a.due_at)>=cutoff&&recipients(state,a).some(r=>r.student_id===m.student_id)&&!result(state,a,m.student_id).attempt&&!result(state,a,m.student_id).submission);
        if(missed.length>=3)out.push({key:'missed:'+c.id+':'+m.student_id+':'+missed.length,title:`${m.display_name||'Student'} has missed ${missed.length} assignments in 30 days`,classId:c.id,studentId:m.student_id});
        const scores=all.filter(a=>a.student_id===m.student_id).sort((a,b)=>new Date(b.submitted_at)-new Date(a.submitted_at));
        if(scores.length>=4){const change=(percent(scores[0].score,scores[0].total_max)+percent(scores[1].score,scores[1].total_max)-percent(scores[2].score,scores[2].total_max)-percent(scores[3].score,scores[3].total_max))/2;
          if(Math.abs(change)>=15)out.push({key:'trend:'+c.id+':'+m.student_id+':'+scores[0].submitted_at,title:`${m.display_name||'Student'}: scores ${change>0?'improving':'falling'} by ${Math.round(Math.abs(change))} percentage points across the last four assignments`,classId:c.id,studentId:m.student_id});}
      }
      const questions=new Map();for(const e of evidence(state,c.id)){const key=e.assignmentId+':'+e.questionId,r=questions.get(key)||{e,students:new Set(),lost:new Set()};r.students.add(e.studentId);if(e.awarded<e.max)r.lost.add(e.studentId);questions.set(key,r);}
      for(const [key,r]of questions)if(r.students.size>=3&&r.lost.size/r.students.size>0.5)out.push({key:'question:'+key+':'+r.lost.size,title:`${c.name}: ${r.lost.size}/${r.students.size} students lost marks on ${r.e.question.title||'a question'}`,classId:c.id,assignmentId:r.e.assignmentId});
      const weak=mastery(state,c.id).find(r=>r.responses>=3&&r.score<75);if(weak)out.push({key:'next:'+c.id+':'+weak.id+':'+weak.score,title:`Recommended next: ${weak.title} · ${weak.score}% practice mastery`,classId:c.id,topic:weak.topic});
    }return out;
  }
  function weeklySummary(state,classId,now=new Date()) {
    const since=new Date(now);since.setDate(since.getDate()-7);
    const attempts=latest(state.attempts).filter(a=>a.class_id===classId&&a.review_state==='complete'&&new Date(a.submitted_at)>=since&&new Date(a.submitted_at)<=now);
    const scores=attempts.map(a=>percent(a.score,a.total_max)).filter(s=>s!==null);
    return {completed:attempts.length,students:new Set(attempts.map(a=>a.student_id)).size,average:scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):null};
  }
  const api = { percent, latest, recipients, result, overview, markbook, evidence, mastery, interventions, followupBand, alerts, weeklySummary };
  if (typeof module !== 'undefined') module.exports = api;
  else window.REVISION_TEACHER_DATA = api;
})();
