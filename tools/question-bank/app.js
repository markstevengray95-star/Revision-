(() => {
  'use strict';
  const $=id=>document.getElementById(id);
  const data=window.REVISION_PRACTICE||{lessons:[]};
  const lessons=Array.isArray(data.lessons)?data.lessons:[];
  const storageKey='spark-question-bank-progress-v1';
  let progress={};try{progress=JSON.parse(localStorage.getItem(storageKey)||'{}')||{};}catch{}
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const label=value=>String(value||'').replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  const all=[];
  lessons.forEach(lesson=>(lesson.questions||[]).forEach((q,index)=>{
    const answers=Array.isArray(q.answer)?q.answer.filter(Boolean).map(String):[String(q.answer||'')].filter(Boolean);
    if(!q.question||!answers.length)return;
    all.push({
      id:q.bankId||`${lesson.id}:q${index}`,
      level:lesson.level,subject:lesson.subject,scope:lesson.scope||'combined',topic:lesson.topic,
      topicTitle:lesson.topicTitle||lesson.topic||'Science',lessonTitle:lesson.title||'',href:lesson.href||'#',
      question:String(q.question),answer:answers,type:q.bankType||'exam',difficulty:q.difficulty||'standard',
      options:Array.isArray(q.options)?shuffleRows(q.options.slice()):null,
      marks:Number(q.marks)||Math.max(1,Math.min(6,answers.length+1))
    });
  }));

  let filtered=all.slice(),shown=24,randomMode=false;
  const topicKey=q=>`${q.subject}:${q.topic}`;
  const validSubjects=new Set(['biology','chemistry','physics']);

  function saveProgress(){try{localStorage.setItem(storageKey,JSON.stringify(progress));}catch{}}
  function updateStats(){
    $('total-questions').textContent=(data.questionCount||all.length).toLocaleString();
    $('visible-questions').textContent=filtered.length.toLocaleString();
    $('topics-count').textContent=new Set(filtered.map(topicKey)).size.toLocaleString();
    $('attempted-count').textContent=Object.values(progress).filter(Boolean).length.toLocaleString();
  }

  function baseForTopics(){
    const level=$('level').value,subject=$('subject').value,pathway=$('pathway').value;
    return all.filter(q=>(level==='all'||q.level===level)&&(subject==='all'||q.subject===subject)&&(level!=='gcse'||pathway!=='combined'||q.scope!=='triple'));
  }

  function refreshTopics(){
    const previous=$('topic').value;
    const map=new Map();baseForTopics().forEach(q=>map.set(`${q.subject}:${q.topic}`,`${label(q.subject)} · ${q.topicTitle}`));
    const options=[['all','All topics'],...[...map.entries()].sort((a,b)=>a[1].localeCompare(b[1]))];
    $('topic').innerHTML=options.map(([value,text])=>`<option value="${esc(value)}">${esc(text)}</option>`).join('');
    if(options.some(([value])=>value===previous))$('topic').value=previous;
  }

  function applyFilters(reset=true){
    if(reset){shown=24;randomMode=false;}
    const level=$('level').value,subject=$('subject').value,pathway=$('pathway').value,topic=$('topic').value,type=$('type').value,difficulty=$('difficulty').value;
    const search=$('search').value.trim().toLowerCase();
    filtered=all.filter(q=>{
      if(level!=='all'&&q.level!==level)return false;
      if(subject!=='all'&&q.subject!==subject)return false;
      if(q.level==='gcse'&&pathway==='combined'&&q.scope==='triple')return false;
      if(topic!=='all'&&`${q.subject}:${q.topic}`!==topic)return false;
      if(type!=='all'&&q.type!==type)return false;
      if(difficulty!=='all'&&q.difficulty!==difficulty)return false;
      if(search&&!`${q.question} ${q.topicTitle} ${q.lessonTitle} ${q.subject}`.toLowerCase().includes(search))return false;
      return true;
    });
    render();
  }

  function card(q,index){
    const state=progress[q.id]||'';
    const markPoints=q.answer.map(a=>`<li>${esc(a)}</li>`).join('');
    return `<article class="question-card" data-id="${esc(q.id)}">
      <div class="question-top"><div><div class="question-meta"><span class="pill">${q.level==='alevel'?'A-level':'GCSE'}</span><span class="pill">${esc(label(q.subject))}</span><span class="pill">${esc(q.topicTitle)}</span><span class="pill">${esc(label(q.type))}</span><span class="pill">${esc(label(q.difficulty))}</span><span class="pill">${q.marks} mark${q.marks===1?'':'s'}</span></div><h3>${esc(q.question)}</h3><a class="lesson-link" href="../../${esc(q.href)}">Review lesson: ${esc(q.lessonTitle)} →</a></div><span class="question-number">#${index+1}</span></div>
      <div class="question-answer">${q.options?`<fieldset><legend>Select your answer</legend>${q.options.map((text,j)=>`<label style="display:block;padding:8px 0"><input type="radio" name="choice-${index}" value="${esc(text)}"> ${esc(text)}</label>`).join('')}<button type="button" class="revision-button" data-check-choice>Check answer</button><p data-choice-feedback role="status" aria-live="polite"></p></fieldset>`:`<label class="revision-sr-only" for="answer-${index}">Your answer</label><textarea id="answer-${index}" placeholder="Write your answer before revealing the mark points…"></textarea>`}</div>
      <div class="question-actions"><details class="mark-scheme"><summary>Show indicative mark points</summary><ol>${markPoints}</ol></details><div class="self-mark" role="group" aria-label="Self-assess this question"><span>How did you do?</span><button type="button" data-score="revisit" aria-pressed="${state==='revisit'}">Revisit</button><button type="button" data-score="partial" aria-pressed="${state==='partial'}">Partly</button><button type="button" data-score="secure" aria-pressed="${state==='secure'}">Got it</button></div></div>
    </article>`;
  }

  function render(){
    const rows=randomMode?filtered.slice(0,1):filtered.slice(0,shown);
    $('question-list').innerHTML=rows.map(card).join('');
    $('empty').hidden=filtered.length!==0;
    $('load-more').parentElement.hidden=randomMode||shown>=filtered.length||!filtered.length;
    $('result-note').textContent=randomMode?(filtered.length?'Random question from your current filters.':'No questions match your filters.'):`Showing ${Math.min(shown,filtered.length).toLocaleString()} of ${filtered.length.toLocaleString()} matching questions.`;
    updateStats();
    $('question-list').querySelectorAll('[data-check-choice]').forEach(button=>button.addEventListener('click',()=>{
      const cardEl=button.closest('.question-card'),q=all.find(q=>q.id===cardEl.dataset.id);
      const selected=cardEl.querySelector('input[type=radio]:checked'),feedback=cardEl.querySelector('[data-choice-feedback]');
      if(!selected){feedback.textContent='Select an answer first.';return;}
      const correct=selected.value===q.answer[0];
      feedback.textContent=correct?'Correct · 1/1 mark.':'0/1 marks. Correct answer: '+q.answer[0];
      progress[q.id]=correct?'secure':'revisit';saveProgress();updateStats();
      cardEl.querySelectorAll('.self-mark button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.score===progress[q.id])));
    }));
    $('question-list').querySelectorAll('.self-mark button').forEach(button=>button.addEventListener('click',()=>{
      const cardEl=button.closest('.question-card'),id=cardEl?.dataset.id;if(!id)return;
      progress[id]=button.dataset.score;saveProgress();
      cardEl.querySelectorAll('.self-mark button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      updateStats();
    }));
  }

  function shuffleRows(rows){for(let i=rows.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rows[i],rows[j]]=[rows[j],rows[i]];}return rows;}

  for(const id of ['level','subject','pathway'])$(id).addEventListener('change',()=>{refreshTopics();applyFilters();});
  for(const id of ['topic','type','difficulty'])$(id).addEventListener('change',()=>applyFilters());
  $('search').addEventListener('input',()=>applyFilters());
  $('load-more').addEventListener('click',()=>{shown+=24;render();});
  $('shuffle').addEventListener('click',()=>{randomMode=false;filtered=shuffleRows(filtered.slice());render();});
  $('random-question').addEventListener('click',()=>{applyFilters();if(!filtered.length)return;const pick=filtered[Math.floor(Math.random()*filtered.length)];filtered=[pick,...filtered.filter(q=>q.id!==pick.id)];randomMode=true;shown=1;render();document.querySelector('.question-card')?.scrollIntoView({behavior:'smooth',block:'center'});});
  $('clear-filters').addEventListener('click',()=>{$('level').value='all';$('subject').value='all';$('pathway').value='all';$('type').value='all';$('difficulty').value='all';$('search').value='';refreshTopics();$('topic').value='all';applyFilters();});

  const params=new URLSearchParams(location.search);
  if(['gcse','alevel'].includes(params.get('level'))) $('level').value=params.get('level');
  if(validSubjects.has(params.get('subject'))) $('subject').value=params.get('subject');
  if(['combined','triple'].includes(params.get('pathway'))) $('pathway').value=params.get('pathway');
  $('pathway-label').hidden=false;
  refreshTopics();applyFilters();
})();
