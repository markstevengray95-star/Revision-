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
        rows.push({studentId:a.student_id,assignmentId:a.assignment_id,questionId:q.id,question:q,topic:activity.topic_key,topicTitle:activity.topic_title,
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
  const api = { percent, latest, recipients, result, overview, markbook, evidence, mastery, interventions, followupBand };
  if (typeof module !== 'undefined') module.exports = api;
  else window.REVISION_TEACHER_DATA = api;
})();
