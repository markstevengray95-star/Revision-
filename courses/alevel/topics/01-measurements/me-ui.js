'use strict';
  function showView(name){
    $$('.view').forEach(v=>v.classList.toggle('active-view',v.id===`view-${name}`));
    $$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
    window.scrollTo({top:Math.max(0,$('.main-nav').offsetTop-80),behavior:'smooth'});
    if(name==='lab') requestAnimationFrame(drawSim);
    if(name==='practical') requestAnimationFrame(drawGraphBench);
  }
  $$('.nav-button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
  $$('[data-jump]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.jump)));

  function renderCourse(){
    $('#courseList').innerHTML=lessons.map((l,i)=>`<button class="lesson-card ${i===state.lesson?'active':''} ${state.completed.has(l.id)?'done':''}" data-lesson="${i}"><strong>${i+1}. ${l.title}</strong><small>${l.code} · ${l.subtitle}</small></button>`).join('');
    $$('.lesson-card').forEach(b=>b.onclick=()=>{state.lesson=+b.dataset.lesson;renderCourse();});
    const l=lessons[state.lesson];
    $('#lessonPanel').innerHTML=`
      <span class="eyebrow">Lesson ${state.lesson+1} · ${l.code}</span><h2>${l.title}</h2><p class="muted">${l.subtitle}</p>
      <div class="lesson-grid">
        <section class="lesson-block"><h3>1 · Retrieval starter</h3><ol>${l.retrieval.map(x=>`<li>${x}</li>`).join('')}</ol></section>
        <section class="lesson-block"><h3>2 · Learning objectives</h3><ul>${l.objectives.map(x=>`<li>${x}</li>`).join('')}</ul></section>
        <section class="lesson-block"><h3>3 · Key vocabulary</h3><p>${l.vocab.map(x=>`<span class="pill">${x}</span>`).join(' ')}</p></section>
        <section class="lesson-block"><h3>4 · Core teaching</h3><p>${l.teach}</p></section>
        <section class="lesson-block"><h3>5 · Relationship / method</h3><button class="equation-button" data-equation="${l.equation}">${equations[l.equation].display}</button><p class="small muted">Click the relationship for a full breakdown.</p></section>
        <section class="lesson-block"><h3>6 · Worked example</h3><p>${l.worked}</p></section>
        <section class="lesson-block"><h3>7 · Interactive mission</h3><p>${l.mission}</p><button class="button" data-open-sim="${simIndexForLesson(l.id)}">Open linked model</button></section>
        <section class="lesson-block"><h3>8 · Exam check</h3><div class="callout">${l.exam}</div><p><strong>Exit question:</strong> ${l.exit}</p><div class="lesson-check"><textarea id="lessonAnswer" placeholder="Type your answer here..."></textarea><div class="button-row"><button class="button primary" id="checkLessonAnswer">Auto-check answer</button><button class="button" id="showLessonModel">Show model answer</button></div><div id="lessonFeedback" class="feedback hidden"></div></div></section>
      </div>
      <div class="lesson-actions"><button class="button" id="prevLesson" ${state.lesson===0?'disabled':''}>← Previous</button><button class="button primary" id="completeLesson">${state.completed.has(l.id)?'Completed ✓':'Mark lesson complete'}</button><button class="button" id="nextLesson" ${state.lesson===lessons.length-1?'disabled':''}>Next →</button></div>`;
    const check=lessonChecks[l.id];
    $('#checkLessonAnswer').onclick=()=>{const txt=$('#lessonAnswer').value.toLowerCase();const hits=check.points.filter(p=>new RegExp(p[1],'i').test(txt));const missed=check.points.filter(p=>!new RegExp(p[1],'i').test(txt));const fb=$('#lessonFeedback');fb.className='feedback '+(hits.length===check.points.length?'good':'partial');fb.innerHTML=`<strong>${hits.length===check.points.length?'Strong answer':'Develop this answer'}.</strong> Detected ${hits.length}/${check.points.length} key ideas.${missed.length?` Consider: ${missed.map(p=>p[0]).join(', ')}.`:''}`;};
    $('#showLessonModel').onclick=()=>{const fb=$('#lessonFeedback');fb.className='feedback good';fb.innerHTML=`<strong>Model answer:</strong> ${check.model}`;};
    $('#prevLesson').onclick=()=>{state.lesson=Math.max(0,state.lesson-1);renderCourse()};
    $('#nextLesson').onclick=()=>{state.lesson=Math.min(lessons.length-1,state.lesson+1);renderCourse()};
    $('#completeLesson').onclick=()=>{state.completed.has(l.id)?state.completed.delete(l.id):state.completed.add(l.id);saveProgress();renderCourse()};
    $$('[data-open-sim]', $('#lessonPanel')).forEach(b=>b.onclick=()=>{state.sim=+b.dataset.openSim;renderSim();showView('lab')});
    wireEquationButtons($('#lessonPanel'));
  }
  function simIndexForLesson(id){ return ({si:0,prefix:0,quality:0,errors:1,uncertainty:2,propagation:3,graphs:4,estimation:5})[id]||0; }

  function renderTextbook(){
    $('#textbookList').innerHTML=textbook.map((c,i)=>`<button class="chapter-button ${i===state.chapter?'active':''}" data-chapter="${i}"><strong>${c.title}</strong><br><span class="small muted">${c.code}</span></button>`).join('');
    $$('.chapter-button').forEach(b=>b.onclick=()=>{state.chapter=+b.dataset.chapter;renderTextbook()});
    const c=textbook[state.chapter];
    $('#textbookArticle').innerHTML=`<span class="eyebrow">${c.code} · Textbook chapter</span><h2>${c.title}</h2><p class="muted">${c.intro}</p>${c.sections.map(s=>`<section class="${s.trap?'exam-trap':''}"><h3>${s.h}</h3>${s.list?`<ul>${s.list.map(x=>`<li>${x}</li>`).join('')}</ul>`:`<p>${s.p}</p>`}${s.equation?`<button class="equation-chip" data-equation="${s.equation}">${equations[s.equation].display}</button>`:''}</section>`).join('')}`;
    wireEquationButtons($('#textbookArticle'));
  }

  function wireEquationButtons(root=document){ $$('[data-equation]',root).forEach(b=>b.onclick=()=>openEquation(b.dataset.equation)); }
  function openEquation(id){
    const e=equations[id]; if(!e)return;
    $('#equationTitle').textContent=e.title;
    $('#equationBody').innerHTML=`<div class="equation"><strong>${e.display}</strong></div><p>${e.meaning}</p><h3>How to use it</h3><ol>${e.steps.map(s=>`<li>${s}</li>`).join('')}</ol><div class="example-box"><strong>Example</strong><p>${e.example}</p></div>`;
    $('#equationModal').classList.remove('hidden');
  }
  $('#equationClose').onclick=()=>$('#equationModal').classList.add('hidden');
  $('#equationModal').onclick=e=>{if(e.target.id==='equationModal')e.currentTarget.classList.add('hidden')};

  function defaultSimVals(sim){
    const obj={}; sim.controls.forEach(c=>obj[c[0]]=c[2]); return obj;
  }
  function renderSim(){
    const sim=sims[state.sim]; if(!state.simVals[sim.id]) state.simVals[sim.id]=defaultSimVals(sim);
    $('#simTabs').innerHTML=sims.map((s,i)=>`<button class="sim-tab ${i===state.sim?'active':''}" data-sim="${i}">${s.title}</button>`).join('');
    $$('.sim-tab').forEach(b=>b.onclick=()=>{state.sim=+b.dataset.sim;renderSim()});
    $('#simCode').textContent=sim.code; $('#simTitle').textContent=sim.title; $('#simSubtitle').textContent=sim.subtitle;
    $('#missionGoal').textContent=sim.goal; $('#missionSteps').innerHTML=sim.steps.map(x=>`<li>${x}</li>`).join(''); $('#missionConclusion').textContent=sim.conclusion;
    $('#simpleExplain').textContent=sim.simple; $('#examExplain').textContent=sim.exam; $('#mistakeExplain').textContent=sim.mistake;
    const vals=state.simVals[sim.id];
    $('#simControls').innerHTML=sim.controls.map(c=>`<label class="field"><span>${c[1]}</span><input type="range" data-sim-control="${c[0]}" min="${c[3]}" max="${c[4]}" value="${vals[c[0]]}" step="${c[5]}"><output data-sim-output="${c[0]}">${vals[c[0]]}</output></label>`).join('');
    $$('[data-sim-control]').forEach(inp=>inp.oninput=()=>{vals[inp.dataset.simControl]=+inp.value;$(`[data-sim-output="${inp.dataset.simControl}"]`).textContent=inp.value;drawSim();});
    state.snapshots=[]; renderSnapshots(); drawSim();
  }

  const canvas=$('#simCanvas'), ctx=canvas.getContext('2d');
  function sizeCanvas(c){ const dpr=Math.min(2,window.devicePixelRatio||1),r=c.getBoundingClientRect(); if(c.width!==Math.round(r.width*dpr)||c.height!==Math.round(r.height*dpr)){c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr);const cx=c.getContext('2d');cx.setTransform(dpr,0,0,dpr,0,0);} return {w:r.width,h:r.height}; }
  function clearCanvas(c, title){ const x=c.getContext('2d'),{w,h}=sizeCanvas(c);x.clearRect(0,0,w,h);const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#07131f');g.addColorStop(1,'#030910');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='#9fb0c6';x.font='14px system-ui';x.fillText(title,18,30);return{x,w,h}; }
  function axis(x,w,h,pad=60){x.strokeStyle='#35506a';x.lineWidth=1;x.beginPath();x.moveTo(pad,h-pad);x.lineTo(w-25,h-pad);x.moveTo(pad,35);x.lineTo(pad,h-pad);x.stroke();}
  function drawSim(){
    const sim=sims[state.sim]; if(!sim)return; const v=state.simVals[sim.id]||defaultSimVals(sim); const {x,w,h}=clearCanvas(canvas,sim.title);
    $('#simState').textContent='Live model';
    if(sim.id==='resolution') drawResolution(x,w,h,v);
    if(sim.id==='errors') drawErrors(x,w,h,v);
    if(sim.id==='uncertainty') drawUncertainty(x,w,h,v);
    if(sim.id==='propagation') drawPropagation(x,w,h,v);
    if(sim.id==='graph') drawErrorGraph(x,w,h,v);
    if(sim.id==='estimate') drawEstimate(x,w,h,v);
  }
  function drawResolution(x,w,h,v){
    const pad=55,y=h*.55,max=90, px=(w-pad*2)/max; x.strokeStyle='#d8e3ef';x.lineWidth=3;x.beginPath();x.moveTo(pad,y);x.lineTo(w-pad,y);x.stroke();
    x.lineWidth=1; x.fillStyle='#9fb0c6';x.font='11px system-ui';
    for(let mm=0;mm<=80;mm+=5){const xx=pad+mm*px;x.beginPath();x.moveTo(xx,y-9);x.lineTo(xx,y+9);x.stroke();if(mm%10===0)x.fillText(`${mm}`,xx-5,y+25)}
    const shown=Math.round(v.value/v.res)*v.res, xx=pad+shown*px; x.strokeStyle='#57d3ff';x.lineWidth=5;x.beginPath();x.moveTo(pad,y-45);x.lineTo(xx,y-45);x.stroke();
    x.fillStyle='#f4f7fb';x.font='bold 22px system-ui';x.fillText(`true: ${fmt(v.value,2)} mm`,pad,90);x.fillText(`display: ${fmt(shown,Math.max(0,Math.ceil(-Math.log10(v.res))))} mm`,pad,125);x.fillStyle='#8ce99a';x.fillText(`resolution: ${v.res} mm`,pad,160);
    $('#simReadout').innerHTML=`Displayed reading <strong>${fmt(shown,3)} mm</strong> · resolution <strong>${v.res} mm</strong>`;
  }
  function drawErrors(x,w,h,v){
    const vals=Array.from({length:Math.round(v.n)},()=>v.true+v.offset+randn()*v.scatter), mean=vals.reduce((a,b)=>a+b,0)/vals.length; const min=v.true-4,max=v.true+4,pad=60, map=z=>pad+(z-min)/(max-min)*(w-pad*2);
    x.strokeStyle='#496177';x.lineWidth=2;x.beginPath();x.moveTo(pad,h*.62);x.lineTo(w-pad,h*.62);x.stroke();
    x.strokeStyle='#8ce99a';x.lineWidth=3;x.beginPath();x.moveTo(map(v.true),90);x.lineTo(map(v.true),h-70);x.stroke(); x.fillStyle='#8ce99a';x.fillText('true value',map(v.true)-28,78);
    vals.forEach((z,i)=>{x.fillStyle='#57d3ff';x.beginPath();x.arc(map(z),h*.62+(i%3-1)*14,5,0,Math.PI*2);x.fill()});
    x.strokeStyle='#ffd166';x.lineWidth=3;x.beginPath();x.moveTo(map(mean),110);x.lineTo(map(mean),h-80);x.stroke();x.fillStyle='#ffd166';x.font='bold 18px system-ui';x.fillText(`mean ${fmt(mean,2)}`,map(mean)-42,102);
    $('#simReadout').innerHTML=`Mean ≈ <strong>${fmt(mean,3)}</strong> · true value ${v.true} · systematic offset ${v.offset>=0?'+':''}${v.offset}`;
  }
  function drawUncertainty(x,w,h,v){
    const p=percent(v.dx,v.x),barW=w*.68,left=(w-barW)/2,y=h*.52; x.strokeStyle='#5d748a';x.lineWidth=8;x.beginPath();x.moveTo(left,y);x.lineTo(left+barW,y);x.stroke();
    const rel=clamp(v.dx/Math.max(v.x,1)*6,0.01,.48),cx=left+barW*.5,half=barW*rel;x.strokeStyle='#57d3ff';x.lineWidth=5;x.beginPath();x.moveTo(cx-half,y-35);x.lineTo(cx-half,y+35);x.moveTo(cx+half,y-35);x.lineTo(cx+half,y+35);x.moveTo(cx-half,y);x.lineTo(cx+half,y);x.stroke();
    x.fillStyle='#f4f7fb';x.font='bold 28px system-ui';x.fillText(`${v.x} ± ${v.dx}`,left,115);x.fillStyle='#8ce99a';x.fillText(`${fmt(p,2)}% uncertainty`,left,155); $('#simReadout').innerHTML=`(${v.dx} / ${v.x}) × 100 = <strong>${fmt(p,3)}%</strong>`;
  }
  function drawPropagation(x,w,h,v){
    const sum=v.ua+v.ub, power=v.power*v.ua; const cards=[['A uncertainty',v.ua+'%'],['B uncertainty',v.ub+'%'],['A × B / A ÷ B',fmt(sum,2)+'%'],[`A^${v.power}`,fmt(power,2)+'%']];
    cards.forEach((c,i)=>{const cw=(w-90)/2,ch=105,xx=30+(i%2)*(cw+30),yy=100+Math.floor(i/2)*(ch+30);x.fillStyle='#10243a';x.strokeStyle='#31506b';x.lineWidth=1;x.beginPath();x.roundRect(xx,yy,cw,ch,14);x.fill();x.stroke();x.fillStyle='#9fb0c6';x.font='13px system-ui';x.fillText(c[0],xx+15,yy+30);x.fillStyle=i>1?'#8ce99a':'#57d3ff';x.font='bold 28px system-ui';x.fillText(c[1],xx+15,yy+70)});
    $('#simReadout').innerHTML=`Product/quotient uncertainty = <strong>${fmt(sum,2)}%</strong> · A^${v.power} uncertainty = <strong>${fmt(power,2)}%</strong>`;
  }
  function graphStats(v){ const pts=[];for(let i=1;i<=7;i++)pts.push({x:i,y:v.slope*i+1+randn()*v.scatter,u:v.yunc});const lin=linearRegression(pts);const span=2*v.yunc/6;return{pts,best:lin.m,max:lin.m+span,min:lin.m-span}; }
  let lastGraphStats=null;
  function drawErrorGraph(x,w,h,v){
    axis(x,w,h);const s=graphStats(v);lastGraphStats=s;const pad=60,xm=z=>pad+z/8*(w-pad-30),ym=z=>h-pad-z/(v.slope*8+5)*(h-pad-50);
    s.pts.forEach(p=>{const xx=xm(p.x),yy=ym(p.y),yu=Math.abs(ym(p.y+p.u)-yy);x.strokeStyle='#7aa0bd';x.beginPath();x.moveTo(xx,yy-yu);x.lineTo(xx,yy+yu);x.moveTo(xx-5,yy-yu);x.lineTo(xx+5,yy-yu);x.moveTo(xx-5,yy+yu);x.lineTo(xx+5,yy+yu);x.stroke();x.fillStyle='#57d3ff';x.beginPath();x.arc(xx,yy,4,0,Math.PI*2);x.fill()});
    const line=(m,b,col)=>{x.strokeStyle=col;x.lineWidth=2;x.beginPath();x.moveTo(xm(0),ym(b));x.lineTo(xm(8),ym(m*8+b));x.stroke()};line(s.best,1,'#8ce99a');line(s.max,1,'#ffd166');line(s.min,1,'#ff8a8a');
    const dm=(s.max-s.min)/2;$('#simReadout').innerHTML=`best m ≈ <strong>${fmt(s.best,3)}</strong> · range ${fmt(s.min,3)} to ${fmt(s.max,3)} · Δm ≈ <strong>${fmt(dm,3)}</strong>`;
  }
  function drawEstimate(x,w,h,v){ const total=v.rate*60*v.hours*v.days, pow=Math.round(Math.log10(total));x.fillStyle='#f4f7fb';x.font='bold 34px system-ui';x.fillText(`${v.rate} × 60 × ${v.hours} × ${v.days}`,50,130);x.fillStyle='#57d3ff';x.fillText(`≈ ${total.toExponential(2)}`,50,190);x.fillStyle='#8ce99a';x.fillText(`order ≈ 10^${pow}`,50,250);x.fillStyle='#9fb0c6';x.font='16px system-ui';x.fillText('The model intentionally keeps assumptions visible.',50,300);$('#simReadout').innerHTML=`Estimate = <strong>${total.toExponential(3)}</strong> · nearest order ≈ <strong>10<sup>${pow}</sup></strong>`; }
  function linearRegression(pts){const n=pts.length,sx=pts.reduce((s,p)=>s+p.x,0),sy=pts.reduce((s,p)=>s+p.y,0),sxx=pts.reduce((s,p)=>s+p.x*p.x,0),sxy=pts.reduce((s,p)=>s+p.x*p.y,0);const m=(n*sxy-sx*sy)/(n*sxx-sx*sx),b=(sy-m*sx)/n;return{m,b};}

  $('#resetSim').onclick=()=>{const sim=sims[state.sim];state.simVals[sim.id]=defaultSimVals(sim);renderSim()};
  $('#snapshotSim').onclick=()=>{state.snapshots.unshift({title:sims[state.sim].title,text:$('#simReadout').innerText,time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})});state.snapshots=state.snapshots.slice(0,5);renderSnapshots()};
  $('#predictPrompt').onclick=()=>{const prompts=['What will happen if you double the uncertainty but keep the measured value fixed?','Which change affects precision and which affects accuracy?','What should happen to percentage uncertainty when the measured value increases?','Which uncertainty rule applies before you calculate?','How would this change the conclusion you could justify from the data?'];alert(prompts[state.sim%prompts.length]);};
  function renderSnapshots(){ $('#snapshotTray').innerHTML=state.snapshots.map(s=>`<span class="snapshot"><strong>${s.title}</strong> · ${s.text} · ${s.time}</span>`).join(''); }
