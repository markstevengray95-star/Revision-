(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const { el, button } = window.REVISION_ACTIVITY_UI;
  const data = window.REVISION_TEACHER_DATA;
  let context, currentView = 'dashboard';
  const views = {};
  function panel(title, id) {
    const p = el('section', undefined, 'teacher-panel'); p.id = id;
    p.append(el('h2', title)); return p;
  }
  function show(view) {
    if (!views[view]) return;
    currentView = view;
    for (const [id,node] of Object.entries(views)) node.hidden = id !== view;
    document.querySelectorAll('[data-workspace-view]').forEach(b => b.setAttribute('aria-current', b.dataset.workspaceView === view ? 'page' : 'false'));
    history.replaceState(null, '', '#'+view);
  }
  function init(api) {
    context = api;
    const app = $('teacher-app'), old = app.querySelector('.teacher-layout');
    const classes = $('class-list').closest('.teacher-panel');
    const assignments = $('assignment-list').closest('.teacher-panel');
    const backup = app.querySelector('.compact-panel');
    const nav = el('nav', undefined, 'workspace-nav'); nav.setAttribute('aria-label','Teacher workspace');
    for (const [id,title] of [['dashboard','Dashboard'],['classes','Classes'],['set-work','Set Work'],['markbook','Markbook'],['insights','Insights']]) {
      const b = button(title,'workspace-view',id,'teacher-button'); b.dataset.workspaceView = id;
      b.setAttribute('aria-controls','workspace-'+id); nav.append(b);
      const v = el('section', undefined, 'workspace-view'); v.id = 'workspace-'+id; views[id]=v; app.append(v);
    }
    app.querySelector('.account-strip').after(nav);
    views.dashboard.append(panel('Your teaching overview','workspace-overview'), assignments);
    views.classes.append($('new-class'), classes, $('class-detail-panel'), backup);
    const archive=button('Show archived classes','show-archived','','teacher-button'); archive.onclick=()=>api.toggleArchived(archive); classes.prepend(archive);
    views['set-work'].append($('assign-work'));
    views.markbook.append(panel('Class markbook','markbook-content'));
    views.insights.append(panel('Topics needing attention','insights-content'));
    old.remove(); app.querySelector('.metrics-grid').remove();
    nav.addEventListener('click', e => { const b=e.target.closest('[data-workspace-view]'); if(b) show(b.dataset.workspaceView); });
    document.addEventListener('click', e => {
      const a=e.target.closest('a[href="#new-class"],a[href="#assign-work"]');
      if(a) { e.preventDefault(); show(a.hash === '#new-class' ? 'classes':'set-work'); }
    });
    show(location.hash.slice(1) || 'dashboard');
  }
  function render() {
    if(!context) return;
    const state=context.state, summary=data.overview(state), target=$('workspace-overview');
    target.replaceChildren(el('h2','Your teaching overview'));
    const grid=el('div',undefined,'workspace-metrics');
    for(const [name,value] of [['Work due today',summary.today],['Work due this week',summary.week],['Overdue students',summary.overdue],['Average class score',summary.average === null ? '—' : summary.average+'%'],['Students below 50%',summary.below]]) {
      const card=el('article',undefined,'metric-card'); card.append(el('span',name),el('strong',String(value))); grid.append(card);
    }
    target.append(grid,button('+ Set Work','workspace-set','','teacher-button primary'),el('h3','Recently completed assignments'));
    target.querySelector('[data-action="workspace-set"]').onclick=()=>show('set-work');
    if(!summary.recent.length) target.append(el('p','Completed results will appear here.','panel-copy'));
    summary.recent.forEach(a => { const m=state.members.find(m=>m.student_id===a.student_id && m.class_id===a.class_id), task=state.assignments.find(t=>t.id===a.assignment_id); target.append(el('p',`${m?.display_name || 'Student'} · ${task?.title || 'Assignment'} · ${data.percent(a.score,a.total_max)}%`)); });

  }
  function profile(member) {
    const p=panel(member.display_name || member.student_email || 'Student','workspace-student-profile');
    $('workspace-student-profile')?.remove();
    const close=button('Close profile','close-profile','','teacher-button'); close.onclick=()=>p.remove(); p.append(close);
    p.append(el('p',member.student_email || 'No email linked','panel-copy'));
    const assignments=context.state.assignments.filter(a=>a.class_id===member.class_id && (!a.recipient_ids || a.recipient_ids.includes(member.student_id)));
    if(!assignments.length) p.append(el('p','No assignments yet.'));
    for(const a of assignments) { const r=data.result(context.state,a,member.student_id); p.append(el('p',`${a.title} · ${r.status} · ${r.score===null?'—':r.score+'%'} · ${r.attempts} attempts`)); }
    views.classes.append(p); show('classes'); p.scrollIntoView({behavior:'smooth'});
  }
  window.REVISION_TEACHER_WORKSPACE={init,render,show,profile};
})();
