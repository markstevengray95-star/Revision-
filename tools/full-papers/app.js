(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const letters = ['A','B','C','D','E'];
  const lessons = Array.isArray(window.REVISION_PRACTICE?.lessons) ? window.REVISION_PRACTICE.lessons : [];

  const alevelStructures = {
    biology: [
      {id:'1', label:'Paper 1-style', marks:91, minutes:120, mode:'first'},
      {id:'2', label:'Paper 2-style', marks:91, minutes:120, mode:'second'},
      {id:'3', label:'Paper 3-style · synoptic', marks:78, minutes:120, mode:'all'}
    ],
    chemistry: [
      {id:'1', label:'Paper 1-style · physical + inorganic', marks:105, minutes:120, mode:'chem1'},
      {id:'2', label:'Paper 2-style · physical + organic', marks:105, minutes:120, mode:'chem2'},
      {id:'3', label:'Paper 3-style · synoptic + practical', marks:90, minutes:120, mode:'all'}
    ],
    physics: [
      {id:'1', label:'Paper 1-style', marks:85, minutes:120, mode:'phys1'},
      {id:'2', label:'Paper 2-style', marks:85, minutes:120, mode:'phys2'},
      {id:'3', label:'Paper 3-style · practical + option preparation', marks:80, minutes:120, mode:'all'}
    ]
  };

  const gcseStructures = [
    {id:'1', label:'Paper 1-style', mode:'first'},
    {id:'2', label:'Paper 2-style', mode:'second'}
  ];

  let current = null;
  let timerInterval = null;
  let remainingSeconds = 0;
  let timerRunning = false;

  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const titleCase = value => String(value).replace(/^./, c => c.toUpperCase());
  const hash = text => {
    let h = 2166136261;
    for (let i=0;i<text.length;i++) { h ^= text.charCodeAt(i); h = Math.imul(h,16777619); }
    return h >>> 0;
  };
  const rng = seed => () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  const shuffled = (items, seedText) => {
    const out = items.slice(), random = rng(hash(seedText));
    for (let i=out.length-1;i>0;i--) { const j=Math.floor(random()*(i+1)); [out[i],out[j]]=[out[j],out[i]]; }
    return out;
  };

  function structures() {
    if ($('level').value === 'alevel') return alevelStructures[$('subject').value] || [];
    const marks = $('pathway').value === 'combined' ? 70 : 100;
    const minutes = $('pathway').value === 'combined' ? 75 : 105;
    return gcseStructures.map(p => ({...p, marks, minutes}));
  }

  function refreshPaperOptions() {
    const rows = structures();
    const old = $('paper').value;
    $('paper').innerHTML = rows.map(p => `<option value="${p.id}">${esc(p.label)}</option>`).join('');
    if (rows.some(p => p.id===old)) $('paper').value=old;
    $('pathway-label').hidden = $('level').value !== 'gcse';
    updateStructureNote();
    const count = $('level').value === 'alevel' ? 45 : 30;
    $('paper-count').textContent = `${count} full-paper combinations across ${$('level').value === 'alevel' ? 'A-level science' : 'this GCSE pathway'}`;
  }

  function updateStructureNote() {
    const p = structures().find(row => row.id === $('paper').value) || structures()[0];
    if (!p) return;
    const pathway = $('level').value === 'gcse' ? ` · ${$('pathway').value === 'combined' ? 'Combined Science' : 'Separate Science'}` : '';
    $('structure-note').textContent = `${titleCase($('subject').value)}${pathway} · ${p.label} · ${p.marks} marks · ${formatDuration(p.minutes)}. Sets A–E create five different full-paper versions.`;
  }

  function formatDuration(minutes) {
    const h=Math.floor(minutes/60), m=minutes%60;
    return m ? `${h} hour${h===1?'':'s'} ${m} minutes` : `${h} hour${h===1?'':'s'}`;
  }

  function eligibleLessons(structure) {
    const level=$('level').value, subject=$('subject').value, pathway=$('pathway').value;
    let rows=lessons.filter(l => l.level===level && l.subject===subject && (level!=='gcse' || pathway==='triple' || l.scope!=='triple'));
    if (!rows.length) return [];
    const topicOrder=[...new Map(rows.map(l => [l.topic,l.topicTitle || l.topic])).entries()];
    const half=Math.ceil(topicOrder.length/2);
    const firstIds=new Set(topicOrder.slice(0,half).map(([id])=>id));
    const secondIds=new Set(topicOrder.slice(half).map(([id])=>id));
    const organic=/organic|alkane|alkene|alcohol|halogeno|aldehyde|ketone|carbox|ester|amine|amino|polymer|synthesis|nmr|spectroscop|chromatograph/i;
    const physical=/amount|bond|energet|kinetic|equilibr|redox|thermodynam|rate|constant|electrode|acid|base/i;
    const phys1=/measurement|particle|radiation|wave|mechanic|material|electric/i;
    const phys2=/thermal|field|nuclear/i;
    const mode=structure.mode;
    if (mode==='first') rows=rows.filter(l=>firstIds.has(l.topic));
    if (mode==='second') rows=rows.filter(l=>secondIds.has(l.topic));
    if (mode==='chem1') rows=rows.filter(l=>!organic.test(`${l.topicTitle} ${l.title}`));
    if (mode==='chem2') rows=rows.filter(l=>organic.test(`${l.topicTitle} ${l.title}`)||physical.test(`${l.topicTitle} ${l.title}`));
    if (mode==='phys1') rows=rows.filter(l=>phys1.test(`${l.topicTitle} ${l.title}`));
    if (mode==='phys2') rows=rows.filter(l=>phys2.test(`${l.topicTitle} ${l.title}`));
    return rows.length ? rows : lessons.filter(l => l.level===level && l.subject===subject && (level!=='gcse' || pathway==='triple' || l.scope!=='triple'));
  }

  function makePool(structure, seedText) {
    const rows=eligibleLessons(structure);
    const entries=[];
    rows.forEach((lesson,li) => {
      (lesson.questions || []).forEach((q,qi) => {
        const answer=Array.isArray(q.answer) ? q.answer.filter(Boolean).map(String) : [String(q.answer || lesson.core || '')].filter(Boolean);
        if (!q.question || !answer.length) return;
        const baseMarks=Math.max(2,Math.min(6,answer.length+1));
        entries.push({
          id:`${lesson.id || lesson.topic}-${qi}`,
          lessonId:lesson.id,
          topic:lesson.topicTitle || lesson.topic || 'Science',
          lesson:lesson.title || '',
          question:String(q.question),
          answer,
          baseMarks,
          order:li
        });
      });
    });
    return shuffled(entries,seedText);
  }

  function assemblePaper(structure, setNumber) {
    const level=$('level').value, subject=$('subject').value, pathway=$('pathway').value;
    const seedText=`${level}|${subject}|${pathway}|${structure.id}|${setNumber}`;
    const pool=makePool(structure,seedText);
    if (!pool.length) return [];

    const byTopic=new Map();
    pool.forEach(q => { if(!byTopic.has(q.topic)) byTopic.set(q.topic,[]); byTopic.get(q.topic).push(q); });
    const topics=shuffled([...byTopic.keys()],seedText+'|topics');
    const ordered=[];
    let cursor=0;
    while (ordered.length<pool.length) {
      const topic=topics[cursor%topics.length];
      const bucket=byTopic.get(topic);
      if (bucket?.length) ordered.push(bucket.shift());
      cursor++;
      if (cursor>pool.length*topics.length*2) break;
    }

    const selected=[];
    let total=0, i=0;
    while (total<structure.marks && i<ordered.length) {
      const item={...ordered[i++]};
      let marks=Math.min(item.baseMarks,structure.marks-total);
      if (marks<=0) break;
      item.marks=marks;
      selected.push(item);
      total+=marks;
    }

    if (total<structure.marks && selected.length) {
      let missing=structure.marks-total;
      let j=selected.length-1;
      while (missing>0 && j>=0) {
        const room=8-selected[j].marks;
        const add=Math.min(room,missing);
        selected[j].marks+=add; missing-=add; j--;
      }
    }

    selected.sort((a,b)=>a.marks-b.marks || a.order-b.order);
    return selected;
  }

  function paperKey() {
    if (!current) return '';
    return `spark-full-paper-v2:${current.level}:${current.subject}:${current.pathway}:${current.structure.id}:${current.set}`;
  }

  function readSaved() {
    try { return JSON.parse(localStorage.getItem(paperKey()) || '{}') || {}; } catch { return {}; }
  }

  function saveAnswers() {
    if (!current) return;
    const answers={};
    document.querySelectorAll('[data-answer-id]').forEach(el => answers[el.dataset.answerId]=el.value);
    try {
      localStorage.setItem(paperKey(),JSON.stringify({answers,remainingSeconds,timerRunning:false,updatedAt:Date.now()}));
      $('save-state').textContent='Answers saved on this device.';
    } catch { $('save-state').textContent='Could not save locally.'; }
  }

  function buildPaper() {
    const structure=structures().find(p=>p.id===$('paper').value) || structures()[0];
    const set=Number($('set').value || 1);
    const questions=assemblePaper(structure,set);
    if (!questions.length) {
      $('paper-shell').hidden=false;
      $('question-list').innerHTML='<li class="paper-question"><p>No suitable questions were found for this selection yet.</p></li>';
      return;
    }
    current={level:$('level').value,subject:$('subject').value,pathway:$('pathway').value,structure,set,questions};
    const setLabel=letters[set-1] || String(set);
    $('paper-kicker').textContent=`${current.level==='gcse'?'GCSE':'A-level'} · ${titleCase(current.subject)}`;
    $('paper-title').textContent=`${structure.label} · Set ${setLabel}`;
    $('paper-meta').textContent=`${structure.marks} marks · ${formatDuration(structure.minutes)} · ${questions.length} questions`;
    $('question-list').innerHTML=questions.map((q,index)=>`
      <li class="paper-question">
        <div class="paper-question-header"><strong>Question</strong><span>[${q.marks} mark${q.marks===1?'':'s'}]</span></div>
        <span class="topic-chip">${esc(q.topic)}</span>
        <p>${esc(q.question)}</p>
        <label class="revision-sr-only" for="answer-${index}">Answer to question ${index+1}</label>
        <textarea id="answer-${index}" data-answer-id="${esc(q.id)}" rows="5" placeholder="Write your answer here. Show working where needed."></textarea>
      </li>`).join('');
    const saved=readSaved();
    document.querySelectorAll('[data-answer-id]').forEach(el=>{ if(saved.answers?.[el.dataset.answerId]) el.value=saved.answers[el.dataset.answerId]; el.addEventListener('input',debouncedSave); });
    remainingSeconds=Number.isFinite(saved.remainingSeconds) && saved.remainingSeconds>0 ? saved.remainingSeconds : structure.minutes*60;
    timerRunning=false; clearInterval(timerInterval); updateTimer(); $('timer-toggle').textContent='Start';
    $('marking-panel').hidden=true;
    $('paper-shell').hidden=false;
    $('save-state').textContent=saved.answers ? 'Saved answers restored.' : '';
    history.replaceState({},'',makeUrl());
    $('paper-shell').scrollIntoView({behavior:'smooth',block:'start'});
  }

  let saveTimeout=null;
  function debouncedSave(){ clearTimeout(saveTimeout); saveTimeout=setTimeout(saveAnswers,350); }

  function makeUrl() {
    const u=new URL(location.href);
    ['level','subject','pathway','paper','set'].forEach(id=>u.searchParams.set(id,$(id).value));
    return u;
  }

  function updateTimer() {
    const sec=Math.max(0,remainingSeconds);
    const h=Math.floor(sec/3600),m=Math.floor((sec%3600)/60),s=sec%60;
    $('timer').textContent=[h,m,s].map(v=>String(v).padStart(2,'0')).join(':');
    if (sec===0 && timerRunning) { timerRunning=false; clearInterval(timerInterval); $('timer-toggle').textContent='Start'; $('timer').textContent='TIME UP'; }
  }

  function toggleTimer() {
    if (!current) return;
    timerRunning=!timerRunning;
    $('timer-toggle').textContent=timerRunning?'Pause':'Start';
    clearInterval(timerInterval);
    if (timerRunning) timerInterval=setInterval(()=>{ remainingSeconds=Math.max(0,remainingSeconds-1); updateTimer(); if(remainingSeconds%30===0) saveAnswers(); },1000);
  }

  function resetTimer() {
    if (!current) return;
    timerRunning=false; clearInterval(timerInterval); remainingSeconds=current.structure.minutes*60; $('timer-toggle').textContent='Start'; updateTimer();
  }

  function markingPoints(q) {
    const points=q.answer.slice(0,q.marks);
    const extras=[
      'Uses precise scientific vocabulary and makes the link required by the question.',
      'Develops the reasoning clearly enough to justify the conclusion.',
      'Shows a logically sequenced method or working where appropriate.'
    ];
    let i=0;
    while(points.length<q.marks) points.push(extras[i++%extras.length]);
    return points;
  }

  function finishAndMark() {
    if (!current) return;
    saveAnswers(); timerRunning=false; clearInterval(timerInterval); $('timer-toggle').textContent='Start';
    const saved=readSaved();
    $('marking-list').innerHTML=current.questions.map((q,index)=>{
      const answer=saved.answers?.[q.id] || '';
      return `<article class="mark-card"><h3>Question ${index+1} · ${q.topic} · ${q.marks} marks</h3><div class="student-response">${answer ? esc(answer) : '<em>No answer entered.</em>'}</div>${markingPoints(q).map((point,pi)=>`<div class="mark-point"><input type="checkbox" id="mark-${index}-${pi}" data-mark="1"><label for="mark-${index}-${pi}">${esc(point)}</label></div>`).join('')}</article>`;
    }).join('');
    document.querySelectorAll('[data-mark]').forEach(box=>box.addEventListener('change',updateScore));
    $('score-display').textContent=`0 / ${current.structure.marks}`;
    $('final-score').textContent='0%';
    $('marking-panel').hidden=false;
    $('marking-panel').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function updateScore() {
    const score=[...document.querySelectorAll('[data-mark]:checked')].length;
    const total=current.structure.marks;
    const pct=Math.round(score/total*100);
    $('score-display').textContent=`${score} / ${total}`;
    $('final-score').textContent=`${pct}%`;
    $('score-message').textContent=pct>=80?'Strong performance. Review any missed marking points for precision.':pct>=60?'Good foundation. Use the missed points to target your next revision.':pct>=40?'There is useful knowledge here. Revisit the weakest topics before trying another set.':'Use the marking points as a revision checklist, then retry with a new set.';
  }

  function nextSet() {
    const next=(Number($('set').value)%5)+1;
    $('set').value=String(next);
    updateStructureNote(); buildPaper();
  }

  function restoreControls() {
    const p=new URLSearchParams(location.search);
    if (['gcse','alevel'].includes(p.get('level'))) $('level').value=p.get('level');
    if (['biology','chemistry','physics'].includes(p.get('subject'))) $('subject').value=p.get('subject');
    if (['combined','triple'].includes(p.get('pathway'))) $('pathway').value=p.get('pathway');
    refreshPaperOptions();
    if (structures().some(row=>row.id===p.get('paper'))) $('paper').value=p.get('paper');
    if (['1','2','3','4','5'].includes(p.get('set'))) $('set').value=p.get('set');
    updateStructureNote();
    if (p.has('paper') || p.has('set')) buildPaper();
  }

  ['level','subject','pathway'].forEach(id=>$(id).addEventListener('change',refreshPaperOptions));
  $('paper').addEventListener('change',updateStructureNote);
  $('set').addEventListener('change',updateStructureNote);
  $('build-paper').addEventListener('click',buildPaper);
  $('timer-toggle').addEventListener('click',toggleTimer);
  $('timer-reset').addEventListener('click',resetTimer);
  $('print-paper').addEventListener('click',()=>window.print());
  $('finish-paper').addEventListener('click',finishAndMark);
  $('new-version').addEventListener('click',nextSet);
  window.addEventListener('beforeunload',saveAnswers);

  if (!lessons.length) {
    $('structure-note').textContent='The practice question bank did not load. Refresh the page or rebuild the deployment.';
    $('build-paper').disabled=true;
  }
  restoreControls();
})();
