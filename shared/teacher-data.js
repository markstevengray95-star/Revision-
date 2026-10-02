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
  const api = { percent, latest, recipients, result, overview };
  if (typeof module !== 'undefined') module.exports = api;
  else window.REVISION_TEACHER_DATA = api;
})();
