(() => {
  'use strict';

  const STAGE_STORE='particleLessonStagesV2';
  const LESSON_STORE='particleLessonSequenceV1';
  const CHUNK_STORE='particleChunkMasteryV1';
  const ACTIVE_CHUNK_STORE='particleActiveChunkV1';

  const api=()=>window.PARTICLELAB_LESSON_SEQUENCE;

  function readJSON(key,fallback){
    try{return JSON.parse(localStorage.getItem(key)||JSON.stringify(fallback));}
    catch{return fallback;}
  }

  function writeJSON(key,value){
    try{localStorage.setItem(key,JSON.stringify(value));}catch{}
  }

  function activeLessonIndex(){
    const active=document.querySelector('#courseList [data-seq-lesson].active');
    const n=Number(active?.dataset.seqLesson);
    return Number.isInteger(n)?n:0;
  }

  function activeLessonNumber(){
    const a=api();
    return a?.lessons?.[activeLessonIndex()]?.n||1;
  }

  function activeStageIndex(){
    const active=document.querySelector('#lessonPanel [data-seq-stage].active');
    const n=Number(active?.dataset.seqStage);
    return Number.isInteger(n)?n:0;
  }

  function markCurrentStageComplete(){
    const a=api();
    if(!a?.lessons?.length||!a?.stages?.length)return;
    const lessonNumber=activeLessonNumber();
    const stageIndex=activeStageIndex();
    const stage=a.stages[stageIndex];
    if(!stage)return;

    const stageState=readJSON(STAGE_STORE,{});
    const done=new Set(stageState[lessonNumber]||[]);
    done.add(stage.id);
    stageState[lessonNumber]=[...done];
    writeJSON(STAGE_STORE,stageState);

    const completed=new Set(readJSON(LESSON_STORE,[]));
    if(done.size>=a.stages.length)completed.add(lessonNumber);
    writeJSON(LESSON_STORE,[...completed]);

    a.openLesson?.(lessonNumber);
    setTimeout(()=>{
      const next=Math.min(stageIndex+1,a.stages.length-1);
      a.openStage?.(next);
    },20);
  }

  function getChunkState(){
    return readJSON(CHUNK_STORE,{});
  }

  function setChunkFlag(lessonNumber,chunkIndex,flag,on){
    const state=getChunkState();
    const key=lessonNumber+':'+chunkIndex;
    state[key]=state[key]||{};
    state[key][flag]=on;
    writeJSON(CHUNK_STORE,state);
  }

  function getActiveChunk(lessonNumber,total){
    const state=readJSON(ACTIVE_CHUNK_STORE,{});
    const raw=Number(state[lessonNumber]);
    const value=Number.isInteger(raw)?raw:0;
    return Math.max(0,Math.min(Math.max(0,total-1),value));
  }

  function setActiveChunk(lessonNumber,index,total){
    const state=readJSON(ACTIVE_CHUNK_STORE,{});
    state[lessonNumber]=Math.max(0,Math.min(Math.max(0,total-1),Number(index)||0));
    writeJSON(ACTIVE_CHUNK_STORE,state);
  }

  function updateChunkUI(){
    const lessonNumber=activeLessonNumber();
    const state=getChunkState();
    const cards=[...document.querySelectorAll('#lessonPanel .lesson-chunk-rich')];
    let secure=0;

    cards.forEach(card=>{
      const i=Number(card.dataset.lessonChunk||0);
      const s=state[lessonNumber+':'+i]||{};
      const flags=['explain','apply','exam'];
      const done=flags.filter(k=>s[k]).length;
      if(done===flags.length)secure++;
      card.classList.toggle('chunk-secure',done===flags.length);
      card.querySelectorAll('[data-chunk-flag]').forEach(button=>{
        const on=!!s[button.dataset.chunkFlag];
        button.classList.toggle('active',on);
        button.setAttribute('aria-pressed',String(on));
        button.textContent=(on?'✓ ':'')+button.dataset.label;
      });
      const meter=card.querySelector('.chunk-card-meter');
      if(meter)meter.style.width=(done/flags.length*100)+'%';
      const count=card.querySelector('.chunk-card-count');
      if(count)count.textContent=done+' / '+flags.length+' checks';
    });

    document.querySelectorAll('#lessonPanel .chunk-mastery-summary').forEach(summary=>{
      const total=cards.length;
      const label=summary.querySelector('[data-chunk-summary-text]');
      const fill=summary.querySelector('[data-chunk-summary-fill]');
      if(label)label.textContent=secure+' / '+total+' chunks secure';
      if(fill)fill.style.width=(total?secure/total*100:0)+'%';
    });
  }

  function applyChunkVisibility({scroll=false}={}){
    const lessonNumber=activeLessonNumber();
    const lists=[...document.querySelectorAll('#lessonPanel .lesson-check-list')].filter(list=>list.querySelector('.lesson-chunk-rich'));
    lists.forEach(list=>{
      const cards=[...list.querySelectorAll(':scope > .lesson-chunk-rich')];
      if(!cards.length)return;
      const current=getActiveChunk(lessonNumber,cards.length);

      cards.forEach((card,i)=>{
        const active=i===current;
        card.hidden=!active;
        card.classList.toggle('active-chunk',active);
        card.setAttribute('aria-hidden',active?'false':'true');
      });

      const shell=list.closest('.lesson-section')||list.parentElement;
      shell?.querySelectorAll('[data-chunk-open]').forEach(button=>{
        const i=Number(button.dataset.chunkOpen);
        const active=i===current;
        button.classList.toggle('active',active);
        button.setAttribute('aria-current',active?'step':'false');
      });

      const now=shell?.querySelector('[data-active-chunk-label]');
      if(now)now.textContent='Chunk '+(current+1)+' of '+cards.length;

      const prev=shell?.querySelector('[data-chunk-prev]');
      const next=shell?.querySelector('[data-chunk-next]');
      if(prev)prev.disabled=current===0;
      if(next){
        next.disabled=current===cards.length-1;
        next.removeAttribute('data-chunk-open');
      }

      if(scroll){
        cards[current]?.scrollIntoView({behavior:'smooth',block:'start'});
      }
    });
    updateChunkUI();
  }

  function enhanceChunks(){
    const a=api();
    if(!a?.lessons)return;
    const lessonNumber=activeLessonNumber();
    const lesson=a.lessons.find(l=>l.n===lessonNumber);
    if(!lesson)return;

    const lists=[...document.querySelectorAll('#lessonPanel .lesson-check-list')].filter(list=>list.querySelector('.lesson-chunk-rich'));
    if(!lists.length)return;

    lists.forEach(list=>{
      const cards=[...list.querySelectorAll(':scope > .lesson-chunk-rich')];
      if(!cards.length)return;
      const section=list.closest('.lesson-section')||list.parentElement;

      if(!section.querySelector('.chunk-mastery-summary')){
        const summary=document.createElement('div');
        summary.className='chunk-mastery-summary';
        summary.innerHTML=
          '<div class="chunk-summary-head"><div><span class="eyebrow">Teaching sequence</span><strong data-active-chunk-label>Chunk 1 of '+cards.length+'</strong></div><strong data-chunk-summary-text>0 / '+cards.length+' chunks secure</strong></div>'+
          '<div class="chunk-summary-track"><div class="chunk-summary-fill" data-chunk-summary-fill></div></div>'+
          '<div class="chunk-selector" role="tablist" aria-label="Teaching chunks">'+
            cards.map((card,i)=>{
              const title=card.querySelector('.lesson-chunk-main strong')?.textContent?.replace(/^\d+\.\s*/,'')||('Chunk '+(i+1));
              return '<button type="button" role="tab" data-chunk-open="'+i+'" title="'+title+'"><span>'+(i+1)+'</span><strong>'+title+'</strong></button>';
            }).join('')+
          '</div>';
        list.insertAdjacentElement('beforebegin',summary);
      }

      cards.forEach((card,i)=>{
        if(!card.querySelector('.chunk-mastery-check')){
          const support=a.getChunkSupport?.(lessonNumber,i)||{};
          const box=document.createElement('div');
          box.className='chunk-mastery-check';
          box.innerHTML=
            '<div class="chunk-check-head"><div><span class="eyebrow">Before you move on</span><strong>Prove you understand this chunk</strong></div><span class="chunk-card-count">0 / 3 checks</span></div>'+
            '<div class="chunk-card-track"><div class="chunk-card-meter"></div></div>'+
            '<div class="chunk-proof-grid">'+
              '<div><strong>1 · Explain</strong><p>Close the notes and explain the idea in your own words using the correct physics terms.</p></div>'+
              '<div><strong>2 · Apply</strong><p>'+(support.task||'Apply this idea to a new example or calculation.')+'</p></div>'+
              '<div><strong>3 · Exam language</strong><p>'+(support.exam||lesson.exam||'State the idea using precise AQA terminology.')+'</p></div>'+
            '</div>'+
            '<div class="chunk-proof-actions">'+
              '<button type="button" data-chunk-flag="explain" data-label="I can explain it">I can explain it</button>'+
              '<button type="button" data-chunk-flag="apply" data-label="I can apply it">I can apply it</button>'+
              '<button type="button" data-chunk-flag="exam" data-label="I can use exam wording">I can use exam wording</button>'+
            '</div>';
          card.appendChild(box);
        }
      });

      if(!section.querySelector('.chunk-switch-actions')){
        const nav=document.createElement('div');
        nav.className='chunk-switch-actions';
        nav.innerHTML='<button type="button" class="button" data-chunk-prev>← Previous chunk</button><button type="button" class="button primary" data-chunk-next>Next chunk →</button>';
        list.insertAdjacentElement('afterend',nav);
      }
    });

    applyChunkVisibility();
  }

  function improveAccessibility(){
    document.querySelectorAll('#lessonPanel button,#courseList button').forEach(b=>{
      if(!b.getAttribute('type'))b.setAttribute('type','button');
    });
    document.querySelectorAll('#courseList [data-seq-lesson]').forEach(b=>{
      b.setAttribute('aria-current',b.classList.contains('active')?'step':'false');
    });
    document.querySelectorAll('#lessonPanel [data-seq-stage]').forEach(b=>{
      b.setAttribute('aria-current',b.classList.contains('active')?'step':'false');
    });
  }

  function enhance(){
    if(!api())return;
    improveAccessibility();
    enhanceChunks();
  }

  document.addEventListener('click',event=>{
    const a=api();
    if(!a)return;
    const target=event.target.closest('button,[role="button"]');
    if(!target)return;

    if(target.matches('#courseList [data-seq-lesson]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      const i=Number(target.dataset.seqLesson);
      const n=a.lessons?.[i]?.n;
      if(n)a.openLesson?.(n);
      return;
    }

    if(target.matches('#lessonPanel [data-seq-stage]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      a.openStage?.(Number(target.dataset.seqStage));
      return;
    }

    if(target.matches('#sequencePrev,#sequenceNext')){
      event.preventDefault();
      event.stopImmediatePropagation();
      const delta=target.id==='sequencePrev'?-1:1;
      const next=activeLessonIndex()+delta;
      const n=a.lessons?.[next]?.n;
      if(n)a.openLesson?.(n);
      return;
    }

    if(target.matches('#lessonStepBack')){
      event.preventDefault();
      event.stopImmediatePropagation();
      a.openStage?.(Math.max(0,activeStageIndex()-1));
      return;
    }

    if(target.matches('#lessonStepDone')){
      event.preventDefault();
      event.stopImmediatePropagation();
      markCurrentStageComplete();
      return;
    }

    if(target.matches('[data-chunk-open]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      const section=target.closest('.lesson-section')||document.querySelector('#lessonPanel .lesson-active-section');
      const cards=[...section?.querySelectorAll('.lesson-check-list > .lesson-chunk-rich')||[]];
      if(!cards.length)return;
      setActiveChunk(activeLessonNumber(),Number(target.dataset.chunkOpen),cards.length);
      applyChunkVisibility({scroll:true});
      return;
    }

    if(target.matches('[data-chunk-prev]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      const section=target.closest('.lesson-section');
      const cards=[...section?.querySelectorAll('.lesson-check-list > .lesson-chunk-rich')||[]];
      if(!cards.length)return;
      const current=getActiveChunk(activeLessonNumber(),cards.length);
      setActiveChunk(activeLessonNumber(),current-1,cards.length);
      applyChunkVisibility({scroll:true});
      return;
    }

    if(target.matches('[data-chunk-next]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      const section=target.closest('.lesson-section');
      const cards=[...section?.querySelectorAll('.lesson-check-list > .lesson-chunk-rich')||[]];
      if(!cards.length)return;
      const current=getActiveChunk(activeLessonNumber(),cards.length);
      setActiveChunk(activeLessonNumber(),current+1,cards.length);
      applyChunkVisibility({scroll:true});
      return;
    }

    if(target.matches('[data-chunk-flag]')){
      event.preventDefault();
      event.stopImmediatePropagation();
      const card=target.closest('.lesson-chunk-rich');
      const i=Number(card?.dataset.lessonChunk||0);
      const state=getChunkState();
      const current=!!state[activeLessonNumber()+':'+i]?.[target.dataset.chunkFlag];
      setChunkFlag(activeLessonNumber(),i,target.dataset.chunkFlag,!current);
      updateChunkUI();
    }
  },true);

  const observer=new MutationObserver(()=>requestAnimationFrame(enhance));
  function init(){
    const course=document.querySelector('#view-course');
    if(course)observer.observe(course,{childList:true,subtree:true});
    enhance();
    setTimeout(enhance,500);
    setTimeout(enhance,1400);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();