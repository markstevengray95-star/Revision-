(() => {
  'use strict';
  const catalog=window.REVISION_CATALOG;if(!catalog)return;
  const $=id=>document.getElementById(id);
  const safeRead=(key,fallback={})=>{try{const value=JSON.parse(localStorage.getItem(key));return value&&typeof value==='object'&&!Array.isArray(value)?value:fallback;}catch{return fallback;}};
  const params=new URLSearchParams(location.search);
  const initialMode=params.get('mode')||safeRead('gcse-science-settings-v2').mode;
  const subjects=[...new Set(catalog.courses.map(c=>c.subject))];
  const state={level:['gcse','alevel'].includes(params.get('level'))?params.get('level'):'all',subject:subjects.includes(params.get('subject'))?params.get('subject'):'all',mode:initialMode==='triple'?'triple':'combined',search:params.get('q')||''};
  for(const subject of subjects)if(![...$('topic-subject').options].some(o=>o.value===subject))$('topic-subject').add(new Option(catalog.courses.find(c=>c.subject===subject).title.replace(/^GCSE |^A-level /,''),subject));
  const icons={biology:'◎',chemistry:'⚗',physics:'ϕ'};
  const escape=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const visibleTopic=t=>t.level!=='gcse'||state.mode==='triple'||t.scope!=='triple';
  const courseTopics=course=>catalog.topics.filter(t=>t.course===course.id&&visibleTopic(t));
  const isComplete=t=>Boolean(safeRead(catalog.courses.find(c=>c.id===t.course).progressKey)[t.id]);
  function studyUrl(href){const url=new URL(href,location.href);if(url.pathname.includes('/gcse/'))url.searchParams.set('mode',state.mode);return url.pathname+url.search+url.hash;}
  function renderProgress(){
    const topics=catalog.topics.filter(visibleTopic),gcse=topics.filter(t=>t.level==='gcse'),alevel=topics.filter(t=>t.level==='alevel');
    const done=topics.filter(isComplete).length;
    $('total-completed').textContent=done;$('total-progress').style.width=`${done/topics.length*100}%`;
    $('progress-caption').textContent=done?`${done} of ${topics.length} topics complete. Keep the momentum.`:`${topics.length} topics ready when you are.`;
    $('gcse-progress').textContent=`${gcse.filter(isComplete).length} / ${gcse.length}`;$('alevel-progress').textContent=`${alevel.filter(isComplete).length} / ${alevel.length}`;
    const last=safeRead('revision-last-study-v1');const resume=$('resume-link');
    // Only allow a study path inside this installation, including subpath hosting.
    if(typeof last.path==='string'&&/^courses\/(gcse|alevel|subjects)\//.test(last.path)){
      const root=new URL('./',location.href),url=new URL(last.path,root);
      if(url.origin===root.origin&&url.pathname.startsWith(root.pathname+'courses/')){resume.href=url.href;resume.hidden=false;}
    }
  }
  function renderCourses(){
    const courses=catalog.courses.filter(c=>(state.level==='all'||state.level===c.level)&&(state.subject==='all'||state.subject===c.subject));
    $('course-grid').innerHTML=courses.map(c=>{const topics=courseTopics(c),done=topics.filter(isComplete).length;return `<article class="course-card ${c.subject}"><div class="course-card-top"><span class="subject-icon" aria-hidden="true">${icons[c.subject]||'◇'}</span><span class="qualification-tag">${c.level==='gcse'?'GCSE':'A-LEVEL'}</span></div><h3><a href="${escape(studyUrl(c.href))}">${escape(c.title)}</a></h3><p>${escape(c.summary)}</p><div class="course-card-bottom"><span>${topics.length} topics · ${escape(c.spec.replace('AQA GCSE ',''))}</span><strong aria-hidden="true">Explore ↗</strong></div><div class="card-progress" role="img" aria-label="${done} of ${topics.length} topics complete"><span style="width:${done/topics.length*100}%"></span></div></article>`;}).join('');
  }
  function renderTopics(){
    const query=state.search.trim().toLowerCase();
    const topics=catalog.topics.filter(t=>visibleTopic(t)&&(state.level==='all'||t.level===state.level)&&(state.subject==='all'||t.subject===state.subject)&&(!query||`${t.title} ${t.summary} ${t.code} ${t.subject} ${t.search}`.toLowerCase().includes(query)));
    $('result-count').textContent=`${topics.length} topic${topics.length===1?'':'s'}`;
    $('empty-state').hidden=topics.length>0;
    $('topic-list').innerHTML=topics.map(t=>{const done=isComplete(t),subject=catalog.courses.find(c=>c.id===t.course).title.replace(/^GCSE |^A-level /,'');const detail=t.paper?`Paper ${t.paper}${t.scope==='triple'?' · Separate only':''}`:t.year||'Full course';return `<a class="topic-row ${t.subject} ${done?'completed':''}" href="${escape(studyUrl(t.href))}"><span class="topic-dot" aria-hidden="true"></span><span class="topic-row-copy"><strong>${escape(t.title)}</strong><small>${t.level==='gcse'?'GCSE':'A-level'} ${escape(subject)} · ${escape(t.code)} · ${escape(detail)}${done?' · Completed':''}</small></span><span class="topic-arrow" aria-hidden="true">${done?'✓':'↗'}</span></a>`;}).join('');
  }
  function render(){document.querySelectorAll('[data-level]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.level===state.level)));$('gcse-mode').value=state.mode;$('topic-subject').value=state.subject;$('topic-search').value=state.search;renderProgress();renderCourses();renderTopics();}
  function updateUrl(){const url=new URL(location.href);for(const [key,value] of Object.entries({level:state.level,subject:state.subject,mode:state.mode,q:state.search})){if(!value||value==='all'||(key==='mode'&&value==='combined'))url.searchParams.delete(key);else url.searchParams.set(key,value);}history.replaceState({},'',url);}
  document.querySelectorAll('[data-level]').forEach(btn=>btn.addEventListener('click',()=>{state.level=btn.dataset.level;updateUrl();render();}));
  $('gcse-mode').addEventListener('change',e=>{state.mode=e.target.value;try{localStorage.setItem('gcse-science-settings-v2',JSON.stringify({...safeRead('gcse-science-settings-v2'),mode:state.mode}));}catch{}updateUrl();render();});
  $('topic-subject').addEventListener('change',e=>{state.subject=e.target.value;updateUrl();render();});
  $('topic-search').addEventListener('input',e=>{state.search=e.target.value;updateUrl();renderTopics();});
  $('reset-filters').addEventListener('click',()=>{state.level='all';state.subject='all';state.search='';updateUrl();render();$('topic-search').focus();});
  window.addEventListener('storage',render);window.addEventListener('pageshow',render);
  render();
})();
