'use strict';
(()=>{
if(window.__meV8LessonsLoaded)return;window.__meV8LessonsLoaded=true;
const detail=window.ME_V8_DETAIL||{}
;
  Object.entries(detail).forEach(([id,d])=>{
    const l=lessons.find(x=>x.id===id);
    if(!l)return;
    l.v8=d;
    l.teach=d.big;
    l.worked=d.examples[0][1];
    l.exam=d.exam;
  });
  const graphLesson=lessons.find(x=>x.id==='graphs');
  if(graphLesson){
    graphLesson.equation='gradientUncertainty';
    graphLesson.teach=detail.graphs.big;
    graphLesson.worked=detail.graphs.examples[0][1];
  }

  const lessonSimIndex={si:0,prefix:0,quality:0,errors:1,uncertainty:2,propagation:3,graphs:4,estimation:5};

  const originalRenderCourse=window.renderCourse;
  window.renderCourse=function(){
    const list=document.querySelector('#courseList'),panel=document.querySelector('#lessonPanel');
    if(!list||!panel||!window.lessons||!window.state)return originalRenderCourse?.();
    list.innerHTML=lessons.map((l,i)=>`<button class="lesson-card ${i===state.lesson?'active':''} ${state.completed.has(l.id)?'done':''}" data-lesson="${i}"><strong>${i+1}. ${l.title}</strong><small>${l.code} · ${l.subtitle}</small></button>`).join('');
    [...list.querySelectorAll('.lesson-card')].forEach(b=>b.onclick=()=>{state.lesson=+b.dataset.lesson;renderCourse();});
    const l=lessons[state.lesson],d=l.v8;
    if(!d)return originalRenderCourse?.();
    const checks=(window.lessonChecks||{});
    const check=checks[l.id]||(l.id==='graphs'?checks.graph:null);
    const simIndex=lessonSimIndex[l.id]||0;
    panel.innerHTML=`
      <div class="v8-lesson-hero">
        <div><span class="eyebrow">Lesson ${state.lesson+1} · ${l.code}</span><h2>${l.title}</h2><p>${l.subtitle}</p></div>
        <div class="v8-lesson-badge">Expanded lesson · worked examples · 3D investigation</div>
      </div>
      <div class="v8-lesson-flow">
        <section class="lesson-block v8-span"><h3>1 · Retrieval starter</h3><div class="v8-question-grid">${l.retrieval.map((x,i)=>`<div class="v8-q"><strong>${i+1}</strong><span>${x}</span></div>`).join('')}</div></section>
        <section class="lesson-block"><h3>2 · Learning objectives</h3><ul>${l.objectives.map(x=>`<li>${x}</li>`).join('')}</ul></section>
        <section class="lesson-block"><h3>3 · Key vocabulary</h3><p>${l.vocab.map(x=>`<span class="pill">${x}</span>`).join(' ')}</p></section>
        <section class="lesson-block v8-span"><h3>4 · Big picture</h3><p class="v8-lead">${d.big}</p></section>
        <section class="lesson-block v8-span"><h3>5 · Core teaching</h3><div class="v8-chunks">${d.chunks.map((c,i)=>`<article><span class="v8-step">${i+1}</span><div><h4>${c[0]}</h4><p>${c[1]}</p></div></article>`).join('')}</div></section>
        <section class="lesson-block"><h3>6 · Key relationship / method</h3><button class="equation-button" data-equation="${l.equation}">${equations[l.equation]?.display||'Open method'}</button><p class="small muted">Open the full breakdown and identify the meaning and unit of each term.</p></section>
        <section class="lesson-block"><h3>7 · Practical connection</h3><p>${d.practical}</p></section>
        <section class="lesson-block v8-span"><h3>8 · Worked examples</h3><div class="v8-example-grid">${d.examples.map((e,i)=>`<article class="v8-example"><span>Example ${i+1}</span><h4>${e[0]}</h4><p>${e[1]}</p></article>`).join('')}</div></section>
        <section class="lesson-block v8-span"><h3>9 · Guided practice</h3><div class="v8-practice">${d.practice.map((p,i)=>`<details><summary>${i+1}. ${p[0]}</summary><p><strong>Answer:</strong> ${p[1]}</p></details>`).join('')}</div></section>
        <section class="lesson-block"><h3>10 · Common misconceptions</h3><ul class="v8-warning-list">${d.mis.map(x=>`<li>${x}</li>`).join('')}</ul></section>
        <section class="lesson-block"><h3>11 · AQA exam technique</h3><div class="callout">${d.exam}</div></section>
        <section class="lesson-block v8-span"><h3>12 · 3D investigation</h3><p>${l.mission}</p><div class="button-row"><button class="button primary" id="open3DModel">Open full 3D model</button><button class="button" id="newInvestigationPrompt">Generate investigation prompt</button></div><div id="investigationPrompt" class="feedback hidden"></div></section>
        <section class="lesson-block v8-span"><h3>13 · Exit question</h3><p><strong>${l.exit}</strong></p><textarea id="lessonAnswer" rows="5" placeholder="Write a complete answer using precise physics language..."></textarea><div class="button-row"><button class="button primary" id="checkLessonAnswer">Auto-check answer</button><button class="button" id="showLessonModel">Show model answer</button></div><div id="lessonFeedback" class="feedback hidden"></div></section>
      </div>
      <div class="lesson-actions"><button class="button" id="prevLesson" ${state.lesson===0?'disabled':''}>← Previous</button><button class="button primary" id="completeLesson">${state.completed.has(l.id)?'Completed ✓':'Mark lesson complete'}</button><button class="button" id="nextLesson" ${state.lesson===lessons.length-1?'disabled':''}>Next →</button></div>`;
    const ans=panel.querySelector('#lessonAnswer'),fb=panel.querySelector('#lessonFeedback');
    panel.querySelector('#checkLessonAnswer').onclick=()=>{
      if(!check){fb.className='feedback partial';fb.textContent='Compare your answer with the worked examples and exam technique above.';fb.classList.remove('hidden');return;}
      const txt=ans.value.toLowerCase();
      const hits=check.points.filter(p=>new RegExp(p[1],'i').test(txt));
      const missed=check.points.filter(p=>!new RegExp(p[1],'i').test(txt));
      fb.className='feedback '+(hits.length===check.points.length?'good':'partial');
      fb.innerHTML=`<strong>${hits.length===check.points.length?'Strong answer':'Develop this answer'}.</strong> Detected ${hits.length}/${check.points.length} key ideas.${missed.length?` Add: ${missed.map(p=>p[0]).join(', ')}.`:''}`;
      fb.classList.remove('hidden');
    };
    panel.querySelector('#showLessonModel').onclick=()=>{fb.className='feedback good';fb.innerHTML=`<strong>Model answer:</strong> ${check?.model||d.practice[0][1]}`;fb.classList.remove('hidden');};
    panel.querySelector('#prevLesson').onclick=()=>{state.lesson=Math.max(0,state.lesson-1);renderCourse();};
    panel.querySelector('#nextLesson').onclick=()=>{state.lesson=Math.min(lessons.length-1,state.lesson+1);renderCourse();};
    panel.querySelector('#completeLesson').onclick=()=>{state.completed.has(l.id)?state.completed.delete(l.id):state.completed.add(l.id);saveProgress();renderCourse();};
    panel.querySelector('#open3DModel').onclick=()=>{state.sim=simIndex;renderSim();showView('lab');};
    panel.querySelector('#newInvestigationPrompt').onclick=()=>{
      const prompts=[
        `Predict the effect of changing one variable in the 3D model, then explain the change using ${l.vocab.slice(0,2).join(' and ')}.`,
        `Use the 3D model to identify one measurement limitation and propose a justified improvement.`,
        `Choose two contrasting settings in the 3D model and write a comparison supported by numerical evidence.`,
        `Treat the model as a Paper 3 practical: identify one control variable, one uncertainty and one improvement.`
      ];
      const out=panel.querySelector('#investigationPrompt');out.className='feedback good';out.textContent=prompts[Math.floor(Math.random()*prompts.length)];out.classList.remove('hidden');
    };
    if(window.wireEquationButtons)wireEquationButtons(panel);
  };

  const originalRenderTextbook=window.renderTextbook;
  window.renderTextbook=function(){
    originalRenderTextbook?.();
    const l=lessons[state.chapter],d=l?.v8,article=document.querySelector('#textbookArticle');
    if(!l||!d||!article)return;
    const extra=document.createElement('section');
    extra.className='v8-textbook-extra';
    extra.innerHTML=`<h3>Deeper explanation</h3><div class="v8-chunks">${d.chunks.map((c,i)=>`<article><span class="v8-step">${i+1}</span><div><h4>${c[0]}</h4><p>${c[1]}</p></div></article>`).join('')}</div><h3>More worked examples</h3><div class="v8-example-grid">${d.examples.map((e,i)=>`<article class="v8-example"><span>Example ${i+1}</span><h4>${e[0]}</h4><p>${e[1]}</p></article>`).join('')}</div><h3>Self-check</h3><div class="v8-practice">${d.practice.map((p,i)=>`<details><summary>${i+1}. ${p[0]}</summary><p><strong>Answer:</strong> ${p[1]}</p></details>`).join('')}</div><h3>Practical and exam focus</h3><p>${d.practical}</p><div class="callout">${d.exam}</div>`;
    article.appendChild(extra);
  };

  setTimeout(()=>{renderCourse();renderTextbook?.();},0);
})();
