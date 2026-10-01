(() => {
'use strict';

const DATA = window.FM_DATA;
const DETAIL = window.FM_DETAIL || {};
const CALC = window.FM_CALC || {};
const TEXTBOOK = window.FM_TEXTBOOK || {};
const VISUALS = window.FM_VISUALS || {render:()=>''};
if (!DATA) throw new Error('FM_DATA did not load.');

const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const fmt=(n,d=3)=>Number.isFinite(n)?Number(n.toPrecision(d)).toString():'—';
const TAU=Math.PI*2;
const g=9.81, R=8.31, kB=1.38e-23, NA=6.02e23;

const lessons=DATA.lessons;
const completed=new Set(JSON.parse(localStorage.getItem('fm36-completed')||'[]'));
let activeLesson=0, courseFilter='all', linkedLessonIndex=null;

function saveProgress(){
  localStorage.setItem('fm36-completed',JSON.stringify([...completed]));
  const n=completed.size;
  $('#progressText').textContent=n+' / '+lessons.length+' complete';
  $('#progressFill').style.width=(100*n/lessons.length)+'%';
  renderSpec();
}
function openView(id){
  $$('.view').forEach(v=>v.classList.toggle('active-view',v.id==='view-'+id));
  $$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.view)));
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.jump)));
$('[data-filter-jump]')?.addEventListener('click',()=>{
  courseFilter='thermal';
  activeLesson=lessons.findIndex(l=>l.code.startsWith('3.6.2'));
  renderCourseFilterButtons();renderCourseList();renderLesson();openView('course');
});
$('#resetProgress').addEventListener('click',()=>{completed.clear();saveProgress();renderCourseList();renderLesson();});

function inFilter(l){
  if(courseFilter==='all') return true;
  if(courseFilter==='mechanics') return l.code.startsWith('3.6.1');
  return l.code.startsWith('3.6.2');
}
function renderCourseFilterButtons(){
  $$('[data-course-filter]').forEach(b=>b.classList.toggle('primary',b.dataset.courseFilter===courseFilter));
}
$$('[data-course-filter]').forEach(b=>b.addEventListener('click',()=>{
  courseFilter=b.dataset.courseFilter;
  const first=lessons.findIndex(inFilter);
  if(first>=0 && !inFilter(lessons[activeLesson])) activeLesson=first;
  renderCourseFilterButtons();renderCourseList();renderLesson();
}));

function renderCourseList(){
  const visible=lessons.map((l,i)=>({l,i})).filter(x=>inFilter(x.l));
  $('#courseList').innerHTML=visible.map(({l,i})=>
    '<button class="course-button '+(i===activeLesson?'active ':'')+(completed.has(l.id)?'complete':'')+'" data-lesson="'+i+'">'+
    '<span class="course-code">AQA '+l.code+' · '+l.paper+'</span><span class="course-title">'+(i+1)+'. '+l.title+'</span></button>'
  ).join('');
  $$('[data-lesson]').forEach(b=>b.addEventListener('click',()=>{activeLesson=Number(b.dataset.lesson);renderCourseList();renderLesson();}));
}
function chunkButton(name,i){return '<button class="chunk-button '+(i===0?'active':'')+'" data-chunk-button="'+i+'">'+name+'</button>';}
function qaList(items){
  return items.map((x,i)=>'<div class="mini-question"><p><strong>'+(i+1)+'. '+x[0]+'</strong></p>'+
    '<textarea class="student-answer" placeholder="Type your answer here..."></textarea>'+
    '<button class="text-button" data-reveal>Reveal answer</button><div class="answer-reveal">'+x[1]+'</div></div>').join('');
}
function renderLesson(){
  const l=lessons[activeLesson], c=l.check, d=DETAIL[l.id]||{}, chapter=TEXTBOOK[l.id]||{};
  const calc=CALC[l.id]||{equations:[],strategy:[],practice:[]};
  const teaching=l.teach.map(s=>'<div class="teach-section"><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div>').join('');
  const deepDive=(d.deepDive||[]).map(s=>'<div class="deep-card"><h3>'+s[0]+'</h3><p>'+s[1]+'</p></div>').join('');
  const maths=(d.maths||[]).map(x=>'<li>'+x+'</li>').join('');
  const graphs=(d.graphs||[]).map(x=>'<li>'+x+'</li>').join('');
  const mastery=(d.mustBeAble||[]).map(x=>'<li>'+x+'</li>').join('');
  const ext=d.extendedExample||null;
  const equationCards=(calc.equations||[]).map((e,i)=>'<article class="equation-card"><div class="equation-card-head"><span class="data-badge">Equation '+(i+1)+'</span><span class="equation-source">'+e.sheet+'</span></div><h3>'+e.name+'</h3><div class="big-equation">'+e.eq+'</div><p>'+e.meaning+'</p><dl><div><dt>Symbols</dt><dd>'+e.symbols+'</dd></div><div><dt>Units</dt><dd>'+e.units+'</dd></div><div><dt>Rearrange</dt><dd>'+e.rearrange+'</dd></div><div><dt>Use when</dt><dd>'+e.conditions+'</dd></div></dl></article>').join('');
  const calcStrategy=(calc.strategy||[]).map((x,i)=>'<li><strong>Step '+(i+1)+':</strong> '+x+'</li>').join('');
  const calcPractice=(calc.practice||[]).map((p,i)=>'<div class="calc-practice"><div class="calc-q"><span class="data-badge">Practice '+(i+1)+'</span><p><strong>'+p.q+'</strong></p><textarea class="student-answer compact-answer" placeholder="Try the calculation before revealing the method..."></textarea><button class="text-button" data-calc-reveal="'+i+'">Show worked answer</button></div><div class="calc-solution" data-calc-solution="'+i+'"><ol>'+p.steps.map(s=>'<li>'+s+'</li>').join('')+'</ol><div class="calc-final">Answer: '+p.ans+'</div></div></div>').join('');
  const extendedWorked=ext?'<div class="lesson-block worked-block extended-worked"><h3>Extended worked example</h3><p><strong>'+ext.q+'</strong></p><ol>'+ext.steps.map(x=>'<li>'+x+'</li>').join('')+'</ol></div>':'';
  const chapterSections=(chapter.sections||[]).map((s,i)=>'<article class="chapter-section"><span class="chapter-number">'+String(i+1).padStart(2,'0')+'</span><div><h3>'+s.heading+'</h3><p>'+s.text+'</p></div></article>').join('');
  const chapterIdeas=(chapter.keyIdeas||[]).map(x=>'<li>'+x+'</li>').join('');
  const chapterSummary=(chapter.summary||[]).map(x=>'<li>'+x+'</li>').join('');
  const chapterRetrieval=(chapter.retrieval||[]).map((x,i)=>'<div class="chapter-recall"><strong>'+(i+1)+'. '+x[0]+'</strong><button class="text-button" data-chapter-reveal>Reveal</button><div class="answer-reveal">'+x[1]+'</div></div>').join('');
  const visual=chapter.visual?VISUALS.render(chapter.visual):'';

  $('#lessonPanel').innerHTML=
    '<div class="lesson-meta"><span class="eyebrow">AQA '+l.code+'</span><span class="data-badge">'+l.paper+'</span></div>'+
    '<h2>'+l.title+'</h2><p class="lesson-lead">'+l.lead+'</p>'+
    '<div class="keyword-row">'+l.keywords.map(x=>'<span class="keyword-chip">'+x+'</span>').join('')+'</div>'+
    '<div class="formula-row">'+l.formulas.map(f=>'<span class="formula-chip">'+f+'</span>').join('')+'</div>'+
    '<div class="chunk-strip">'+['Retrieval','Objectives','Textbook chapter','Equations','Maths & graphs','Worked','Calculation practice','Activity','Simulation','Exam mastery','Check','Exit'].map(chunkButton).join('')+'</div>'+
    '<section class="chunk active" data-chunk="0"><div class="lesson-block"><h3>Retrieval starter</h3>'+qaList(l.retrieval)+'</div></section>'+
    '<section class="chunk" data-chunk="1"><div class="lesson-grid"><div class="lesson-block remember"><h3>Learning objectives</h3><ul>'+l.objectives.map(x=>'<li>'+x+'</li>').join('')+'</ul></div><div class="lesson-block warning"><h3>Common misconception</h3><p>'+l.misconception+'</p></div></div></section>'+
    '<section class="chunk" data-chunk="2"><article class="textbook-hook"><span class="eyebrow">Why this matters</span><p>'+((chapter.hook)||l.lead)+'</p><div class="hook-question"><strong>Think first:</strong> '+((chapter.hookQuestion)||l.exit)+'</div></article>'+visual+'<div class="chapter-body">'+chapterSections+'</div><div class="chapter-two-col"><aside class="chapter-key"><span class="eyebrow">Key ideas</span><ul>'+chapterIdeas+'</ul></aside><aside class="chapter-exam"><span class="eyebrow">AQA exam focus</span><p>'+((chapter.examFocus)||l.examTip)+'</p></aside></div><details class="chapter-more"><summary>Extra teacher notes and deeper detail</summary><div class="teaching-stack">'+teaching+'</div><div class="deep-grid">'+deepDive+'</div></details><div class="chapter-summary"><h3>In short</h3><ul>'+chapterSummary+'</ul></div><div class="chapter-retrieval"><h3>Quick recall</h3>'+chapterRetrieval+'</div></section>'+
    '<section class="chunk" data-chunk="3"><div class="equation-intro"><h3>Equation and calculation guide</h3><p>Know what each equation means, what every symbol represents, the units, how to rearrange it and the conditions under which it is valid.</p></div><div class="equation-card-grid">'+equationCards+'</div><div class="lesson-block calc-strategy"><h3>Calculation method</h3><ol>'+calcStrategy+'</ol></div></section>'+
    '<section class="chunk" data-chunk="4"><div class="lesson-grid"><div class="lesson-block maths-block"><h3>Maths you must be able to do</h3><ul>'+maths+'</ul></div><div class="lesson-block graph-block"><h3>Graphs and data interpretation</h3><ul>'+graphs+'</ul></div></div></section>'+
    '<section class="chunk" data-chunk="5"><div class="lesson-block worked-block"><h3>Core worked example</h3><p><strong>'+l.worked.q+'</strong></p><ol>'+l.worked.steps.map(x=>'<li>'+x+'</li>').join('')+'</ol></div>'+extendedWorked+'</section>'+
    '<section class="chunk" data-chunk="6"><div class="lesson-block"><h3>Calculation practice</h3><p class="muted">Attempt each problem first. Then reveal the method and compare your equation choice, substitutions, units and final answer.</p>'+calcPractice+'</div></section>'+
    '<section class="chunk" data-chunk="7"><div class="lesson-block"><h3>Student activity</h3><p>'+l.activity+'</p><textarea class="student-answer" placeholder="Write your working, graph reasoning or explanation here..."></textarea></div></section>'+
    '<section class="chunk" data-chunk="8"><div class="lesson-block mission-inline"><span class="eyebrow">Linked simulation mission</span><h3>'+l.mission.goal+'</h3><ol>'+l.mission.steps.map(x=>'<li>'+x+'</li>').join('')+'</ol><p><strong>Record:</strong> '+l.mission.record+'</p><p><strong>Conclude:</strong> '+l.mission.conclusion+'</p><button class="button primary" id="openLessonSim">Open '+simDefinitions[l.sim].title+'</button></div></section>'+
    '<section class="chunk" data-chunk="9"><div class="lesson-grid"><div class="lesson-block remember"><h3>By the end, you must be able to…</h3><ul class="mastery-list">'+mastery+'</ul></div><div class="lesson-block exam-box"><h3>Exam language</h3><p>'+l.examTip+'</p><p><strong>Avoid:</strong> '+l.misconception+'</p></div></div><div class="self-check"><label><input type="checkbox"> I can define the key quantities accurately.</label><label><input type="checkbox"> I can use the equations with correct units.</label><label><input type="checkbox"> I can interpret the key graph/data relationship.</label><label><input type="checkbox"> I can explain the physics in full sentences.</label></div></section>'+
    '<section class="chunk" data-chunk="10"><div class="mini-question"><p><strong>'+c[0]+'</strong></p><div class="mini-options">'+c[1].map((x,i)=>'<button class="mini-option" data-mini="'+i+'">'+x+'</button>').join('')+'</div><div class="answer-reveal" id="miniExplain">'+c[3]+'</div></div></section>'+
    '<section class="chunk" data-chunk="11"><div class="lesson-block remember"><h3>Exit ticket</h3><p>'+l.exit+'</p><textarea class="student-answer" placeholder="Write a complete A-level answer..."></textarea></div></section>'+
    '<div class="lesson-actions"><button class="button primary" id="completeLesson">'+(completed.has(l.id)?'✓ Lesson complete':'Mark lesson complete')+'</button><button class="button" id="prevLesson">Previous</button><button class="button" id="nextLesson">Next lesson</button></div>';

  $$('[data-chunk-button]').forEach(b=>b.addEventListener('click',()=>{
    $$('[data-chunk-button]').forEach(x=>x.classList.toggle('active',x===b));
    $$('[data-chunk]').forEach(x=>x.classList.toggle('active',x.dataset.chunk===b.dataset.chunkButton));
  }));
  $$('[data-reveal]').forEach(b=>b.addEventListener('click',()=>b.nextElementSibling.classList.toggle('visible')));
  $$('[data-chapter-reveal]').forEach(b=>b.addEventListener('click',()=>b.nextElementSibling.classList.toggle('visible')));
  $$('[data-calc-reveal]').forEach(b=>b.addEventListener('click',()=>{const sol=$('[data-calc-solution="'+b.dataset.calcReveal+'"]');sol.classList.toggle('visible');b.textContent=sol.classList.contains('visible')?'Hide worked answer':'Show worked answer';}));
  $$('[data-mini]').forEach(b=>b.addEventListener('click',()=>{
    const i=Number(b.dataset.mini);$$('[data-mini]').forEach(x=>x.disabled=true);
    b.classList.add(i===c[2]?'correct':'wrong');$$('[data-mini]')[c[2]].classList.add('correct');$('#miniExplain').classList.add('visible');
  }));
  $('#openLessonSim').addEventListener('click',()=>openSimulationFromLesson(activeLesson));
  $('#completeLesson').addEventListener('click',()=>{completed.has(l.id)?completed.delete(l.id):completed.add(l.id);saveProgress();renderCourseList();renderLesson();});
  $('#prevLesson').addEventListener('click',()=>stepLesson(-1));
  $('#nextLesson').addEventListener('click',()=>stepLesson(1));
}
function stepLesson(dir){
  let i=activeLesson;
  do{i=(i+dir+lessons.length)%lessons.length;}while(!inFilter(lessons[i]) && i!==activeLesson);
  activeLesson=i;renderCourseList();renderLesson();
}

const simDefinitions={
  circular:{
    title:'Circular motion vectors',code:'3.6.1.1',controls:[
      {k:'radius',label:'Radius',v:1.2,min:.4,max:2.5,step:.1,u:'m'},
      {k:'omega',label:'Angular speed',v:2.5,min:.5,max:6,step:.1,u:'rad s⁻¹'},
      {k:'mass',label:'Mass',v:.8,min:.1,max:3,step:.1,u:'kg'}],
    simple:'The velocity arrow stays tangent while acceleration and resultant force point to the centre.',
    exam:'Uniform circular motion has centripetal acceleration a = v²/r = ω²r and requires an inward resultant force F = ma.',
    mistake:'Centripetal force is the inward resultant of real forces, not an additional force.',
    check:['At fixed r, doubling v makes F…',['double','four times','half'],1,'F ∝ v².'],drag:'Drag the orbiting object radially to change radius.'
  },
  shm:{
    title:'SHM phase explorer',code:'3.6.1.2',controls:[
      {k:'amp',label:'Amplitude',v:.12,min:.03,max:.20,step:.01,u:'m'},
      {k:'freq',label:'Frequency',v:1,min:.2,max:2.5,step:.1,u:'Hz'}],
    simple:'The object speeds up toward equilibrium and slows toward the turning points.',
    exam:'SHM requires a = −ω²x. Speed is maximum at equilibrium; acceleration magnitude is maximum at the endpoints.',
    mistake:'Maximum speed is not at maximum displacement.',
    check:['At x = 0, acceleration is…',['maximum','zero','equal to speed'],1,'a = −ω²x.'],drag:'Drag horizontally to set amplitude.'
  },
  spring:{
    title:'Mass–spring oscillator',code:'3.6.1.3',controls:[
      {k:'mass',label:'Mass',v:.40,min:.10,max:1,step:.05,u:'kg'},
      {k:'springK',label:'Spring constant',v:24,min:8,max:50,step:1,u:'N m⁻¹'},
      {k:'amp',label:'Amplitude',v:.08,min:.02,max:.15,step:.01,u:'m'}],
    simple:'A larger mass increases period; a stiffer spring decreases it.',
    exam:'Hooke’s law gives a = −(k/m)x, so ω = √(k/m) and T = 2π√(m/k).',
    mistake:'Amplitude does not appear in the ideal period equation.',
    check:['Increasing mass makes T…',['larger','smaller','unchanged'],0,'T ∝ √m.'],drag:'Drag the mass vertically to change amplitude.'
  },
  pendulum:{
    title:'Simple pendulum',code:'3.6.1.3',controls:[
      {k:'length',label:'Length',v:.8,min:.2,max:1.5,step:.05,u:'m'},
      {k:'angle',label:'Release angle',v:8,min:2,max:25,step:1,u:'°'}],
    simple:'A longer pendulum swings more slowly.',
    exam:'For small θ in radians, sinθ ≈ θ, giving approximate SHM with T = 2π√(L/g).',
    mistake:'The period formula is a small-angle approximation and does not depend on bob mass.',
    check:['Increasing L makes T…',['larger','smaller','unchanged'],0,'T ∝ √L.'],drag:'Drag the bob sideways to set release angle.'
  },
  shmEnergy:{
    title:'Energy in SHM',code:'3.6.1.3',controls:[
      {k:'springK',label:'Spring constant',v:30,min:10,max:60,step:1,u:'N m⁻¹'},
      {k:'amp',label:'Amplitude',v:.12,min:.03,max:.20,step:.01,u:'m'},
      {k:'freq',label:'Frequency',v:1,min:.3,max:2,step:.1,u:'Hz'}],
    simple:'Kinetic and potential energy trade places while total energy stays constant in the ideal model.',
    exam:'For a spring oscillator, Ep = ½kx² and Etotal = ½kA².',
    mistake:'The energy graphs are not the same shape as displacement because energy depends on x².',
    check:['At x = ±A, KE is…',['maximum','zero','negative'],1,'The oscillator stops instantaneously.'],drag:'Drag horizontally to set amplitude.'
  },
  damping:{
    title:'Damping explorer',code:'3.6.1.3',controls:[
      {k:'amp',label:'Initial amplitude',v:.14,min:.04,max:.20,step:.01,u:'m'},
      {k:'freq',label:'Natural frequency',v:1,min:.4,max:2,step:.1,u:'Hz'},
      {k:'damp',label:'Damping',v:.18,min:0,max:.8,step:.02,u:'relative'}],
    simple:'Damping transfers mechanical energy to the surroundings, reducing amplitude.',
    exam:'Critical damping returns a system to equilibrium in the shortest time without oscillation.',
    mistake:'Critical damping does not mean the largest possible damping.',
    check:['More damping usually makes amplitude decay…',['faster','slower','not at all'],0,'More energy is dissipated.'],drag:'Drag horizontally to change the initial amplitude.'
  },
  resonance:{
    title:'Forced vibrations and resonance',code:'3.6.1.4',controls:[
      {k:'natural',label:'Natural frequency',v:2,min:.8,max:4,step:.1,u:'Hz'},
      {k:'drive',label:'Driving frequency',v:2,min:.5,max:5,step:.1,u:'Hz'},
      {k:'damp',label:'Damping',v:.18,min:.05,max:.7,step:.02,u:'relative'}],
    simple:'Response grows when the driving frequency approaches the natural frequency.',
    exam:'Greater damping lowers and broadens the resonance peak.',
    mistake:'Resonance is defined by the frequency relationship, not just by a large amplitude.',
    check:['More damping makes the peak…',['higher/narrower','lower/broader','unchanged'],1,'Damping reduces sharpness.'],drag:'Drag the yellow point along the frequency axis to change driving frequency.'
  },
  thermalParticles:{
    title:'Internal energy particle model',code:'3.6.2.1',controls:[
      {k:'temp',label:'Temperature',v:300,min:180,max:500,step:5,u:'K'},
      {k:'phase',label:'State: 0 solid · 1 liquid · 2 gas',v:1,min:0,max:2,step:1,u:''}],
    simple:'Temperature mainly changes random particle speed; changing state changes particle arrangement and potential-energy contribution.',
    exam:'Internal energy is the sum of randomly distributed particle kinetic and potential energies.',
    mistake:'Heating is energy transfer, not energy stored as “heat”.',
    check:['During melting at constant T, supplied energy mainly changes…',['mean KE','particle PE','mass'],1,'Potential-energy contribution changes.'],drag:'No dragging needed; compare state and temperature controls.'
  },
  calorimetry:{
    title:'Specific heat capacity model',code:'3.6.2.1',controls:[
      {k:'mass',label:'Mass',v:.8,min:.2,max:2,step:.1,u:'kg'},
      {k:'specificC',label:'Specific heat capacity',v:900,min:300,max:4500,step:50,u:'J kg⁻¹ K⁻¹'},
      {k:'power',label:'Heater power',v:60,min:10,max:150,step:5,u:'W'}],
    simple:'Higher power heats faster; larger mass or specific heat capacity heats more slowly.',
    exam:'Ignoring losses, dT/dt = P/(mc), from Pt = mcΔT.',
    mistake:'Specific heat capacity is per kilogram; it is not the whole object’s heat capacity.',
    check:['At fixed P and m, larger c gives a…',['steeper slope','shallower slope','same slope'],1,'dT/dt=P/(mc).'],drag:'No dragging needed; compare temperature-time slopes.'
  },
  flowHeating:{
    title:'Continuous-flow heating',code:'3.6.2.1',controls:[
      {k:'flow',label:'Mass flow rate',v:.02,min:.005,max:.05,step:.001,u:'kg s⁻¹'},
      {k:'specificC',label:'Specific heat capacity',v:4200,min:500,max:4500,step:100,u:'J kg⁻¹ K⁻¹'},
      {k:'power',label:'Heater power',v:1500,min:200,max:3000,step:50,u:'W'}],
    simple:'At fixed power, faster flow gives each kilogram less energy and therefore a smaller temperature rise.',
    exam:'For negligible losses at steady state, P = ṁcΔT.',
    mistake:'Use mass per second, not total mass that has passed.',
    check:['Doubling ṁ at fixed P makes ΔT…',['double','half','unchanged'],1,'P=ṁcΔT.'],drag:'No dragging needed; watch flow speed and outlet temperature.'
  },
  heatingCurve:{
    title:'Heating curve and latent heat',code:'3.6.2.1',controls:[
      {k:'energy',label:'Energy supplied (relative)',v:35,min:0,max:100,step:1,u:'%'},
      {k:'mass',label:'Mass',v:.5,min:.1,max:1,step:.1,u:'kg'}],
    simple:'Sloped sections raise temperature; plateaus change state at constant temperature.',
    exam:'During a phase change, average particle KE stays constant while the potential-energy contribution changes.',
    mistake:'A temperature plateau does not mean no energy is entering the system.',
    check:['On a melting plateau, temperature is…',['rising steadily','approximately constant','falling'],1,'Energy changes state.'],drag:'Drag across the graph to set supplied energy.'
  },
  gasLaws:{
    title:'Gas laws piston',code:'3.6.2.2',controls:[
      {k:'volume',label:'Volume',v:80,min:30,max:140,step:2,u:'cm³'},
      {k:'temp',label:'Temperature',v:300,min:220,max:450,step:5,u:'K'},
      {k:'amount',label:'Relative amount of gas',v:1,min:.5,max:2,step:.1,u:'×'}],
    simple:'Pressure rises when molecules hit the walls more frequently or with larger momentum changes.',
    exam:'For fixed amount of ideal gas, pV/T is constant.',
    mistake:'Gas-law proportionalities only apply when the stated control variable is held constant.',
    check:['At fixed T, halving V makes p…',['half','double','unchanged'],1,'Boyle’s law.'],drag:'Drag the piston vertically to change volume.'
  },
  idealGas:{
    title:'Ideal-gas equation explorer',code:'3.6.2.2',controls:[
      {k:'volume',label:'Volume',v:.004,min:.001,max:.01,step:.0002,u:'m³'},
      {k:'temp',label:'Temperature',v:300,min:150,max:600,step:5,u:'K'},
      {k:'moles',label:'Amount',v:.2,min:.05,max:.8,step:.01,u:'mol'}],
    simple:'pV = nRT links the macroscopic state; pV = NkT is the same relationship per particle.',
    exam:'Use SI units and absolute temperature. Choose R for moles or k for particle number.',
    mistake:'Do not mix N molecules with the molar gas constant R.',
    check:['In pV=nRT, V should normally be entered in…',['cm³','m³','dm³ only'],1,'Use SI units.'],drag:'Drag the piston vertically to change volume.'
  },
  boylePractical:{
    title:'RP8 Boyle’s law simulator',code:'3.6.2.2 / RP8',controls:[
      {k:'volume',label:'Volume',v:80,min:30,max:100,step:5,u:'cm³'},
      {k:'temp',label:'Temperature',v:295,min:285,max:315,step:1,u:'K'}],
    simple:'At constant temperature, pressure is inversely proportional to volume.',
    exam:'A p against 1/V graph should be linear for Boyle’s law.',
    mistake:'Rapid compression changes temperature and spoils the constant-temperature condition.',
    check:['Best linear plot?',['p vs V','p vs 1/V','V vs T'],1,'p ∝ 1/V.'],drag:'Drag the piston to change volume, then let the gas “settle”.'
  },
  charlesPractical:{
    title:'RP8 Charles’s law simulator',code:'3.6.2.2 / RP8',controls:[
      {k:'temp',label:'Temperature',v:300,min:270,max:370,step:5,u:'K'},
      {k:'pressure',label:'Pressure',v:101,min:95,max:110,step:1,u:'kPa'}],
    simple:'At constant pressure, gas volume is proportional to absolute temperature.',
    exam:'A V against T(K) graph should be linear for Charles’s law.',
    mistake:'Use kelvin, not Celsius, in the proportional relationship.',
    check:['At constant p, V is proportional to…',['T/K','1/T','T/°C without conversion'],0,'Absolute temperature.'],drag:'No drag; vary bath temperature and pressure controls.'
  },
  brownian:{
    title:'Brownian motion model',code:'3.6.2.3',controls:[
      {k:'temp',label:'Temperature',v:300,min:180,max:500,step:5,u:'K'},
      {k:'density',label:'Molecule density',v:1,min:.4,max:1.8,step:.1,u:'relative'}],
    simple:'Unequal random molecular impacts make a larger tracer move irregularly.',
    exam:'Brownian motion provides evidence for continuous random molecular motion.',
    mistake:'The visible Brownian particle is much larger than individual molecules.',
    check:['Higher T generally makes molecular impacts…',['less energetic','more energetic','stop'],1,'Mean molecular KE rises with T.'],drag:'Drag the tracer to reposition it, then release.'
  },
  kineticTheory:{
    title:'Kinetic-theory collision model',code:'3.6.2.3',controls:[
      {k:'temp',label:'Temperature',v:300,min:120,max:600,step:10,u:'K'},
      {k:'molecularMass',label:'Molecular mass',v:4.65e-26,min:1.5e-26,max:8e-26,step:.25e-26,u:'kg'},
      {k:'number',label:'Particle count (scaled)',v:60,min:20,max:100,step:5,u:''}],
    simple:'Pressure comes from the rate of momentum transfer when molecules collide elastically with the walls.',
    exam:'Kinetic theory gives pV = (1/3)Nm⟨c²⟩ and mean translational KE = (3/2)kT.',
    mistake:'Mean velocity may be zero even though mean-square speed is not.',
    check:['Doubling T makes mean molecular KE…',['half','double','four times'],1,'Ēk=3/2 kT.'],drag:'No drag; compare molecular speed and collision activity as T changes.'
  }
};

let activeSim='circular', simVals={}, running=true, slow=false, simTime=0, last=performance.now(), snapshots=[];
const simVisual={labels:true,vectors:true,trails:true};
const trailPoints={};
const canvas=$('#simCanvas'), ctx=canvas.getContext('2d');
$('#showLabels')?.addEventListener('change',e=>simVisual.labels=e.target.checked);
$('#showVectors')?.addEventListener('change',e=>simVisual.vectors=e.target.checked);
$('#showTrails')?.addEventListener('change',e=>{simVisual.trails=e.target.checked;if(!e.target.checked)Object.keys(trailPoints).forEach(k=>trailPoints[k]=[]);});
let brownianTracer={x:.5,y:.5,vx:0,vy:0};

function openSimulationFromLesson(i){
  linkedLessonIndex=i;activeSim=lessons[i].sim;simTime=0;snapshots=[];renderSim();renderMission();openView('lab');
}
function renderMission(){
  const l=linkedLessonIndex===null?null:lessons[linkedLessonIndex];
  if(l){
    $('#missionGoal').textContent=l.mission.goal;
    $('#missionSteps').innerHTML=l.mission.steps.map(x=>'<li>'+x+'</li>').join('');
    $('#missionRecord').textContent=l.mission.record;
    $('#missionConclusion').textContent=l.mission.conclusion;
    $('#backToLesson').classList.remove('hidden');
  }else{
    const s=simDefinitions[activeSim];
    $('#missionGoal').textContent='Explore '+s.title;
    $('#missionSteps').innerHTML='<li>Change one variable at a time.</li><li>Capture at least two readings.</li><li>Explain the physical relationship shown.</li>';
    $('#missionRecord').textContent='Record the variables and readout values.';
    $('#missionConclusion').textContent='State the relationship using A-level physics language.';
    $('#backToLesson').classList.add('hidden');
  }
}
$('#backToLesson').addEventListener('click',()=>{if(linkedLessonIndex!==null){activeLesson=linkedLessonIndex;renderCourseList();renderLesson();openView('course');}});

function renderSimTabs(){
  $('#simTabs').innerHTML=Object.entries(simDefinitions).map(([k,s])=>'<button class="sim-tab '+(k===activeSim?'active':'')+'" data-sim="'+k+'">'+s.title+'</button>').join('');
  $$('[data-sim]').forEach(b=>b.addEventListener('click',()=>{activeSim=b.dataset.sim;linkedLessonIndex=null;simTime=0;snapshots=[];renderSim();renderMission();}));
}
function renderSim(){
  const s=simDefinitions[activeSim];simVals={};
  s.controls.forEach(c=>simVals[c.k]=c.v);
  $('#simCode').textContent='AQA '+s.code;$('#simTitle').textContent=s.title;$('#simSubtitle').textContent=s.drag;$('#simSpec').textContent='AQA '+s.code;$('#dragHint').textContent=s.drag;
  $('#simpleExplain').textContent=s.simple;$('#examExplain').textContent=s.exam;$('#mistakeExplain').textContent=s.mistake;
  $('#simControls').innerHTML=s.controls.map(c=>'<label class="field"><span>'+c.label+'</span><input type="range" data-control="'+c.k+'" min="'+c.min+'" max="'+c.max+'" value="'+c.v+'" step="'+c.step+'"><output data-output="'+c.k+'"></output></label>').join('');
  $$('[data-control]').forEach(i=>i.addEventListener('input',()=>{simVals[i.dataset.control]=Number(i.value);updateControlOutput(i.dataset.control);updateReadout();}));
  s.controls.forEach(c=>updateControlOutput(c.k));
  const q=s.check;$('#simCheck').innerHTML='<p>'+q[0]+'</p><div class="quick-options">'+q[1].map((x,i)=>'<button class="quick-option" data-quick="'+i+'">'+x+'</button>').join('')+'</div><div class="answer-reveal" id="quickExplain">'+q[3]+'</div>';
  $$('[data-quick]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.quick);$$('[data-quick]').forEach(x=>x.disabled=true);b.classList.add(i===q[2]?'correct':'wrong');$$('[data-quick]')[q[2]].classList.add('correct');$('#quickExplain').classList.add('visible');}));
  renderSimTabs();renderSnapshotTray();updateReadout();
  window.dispatchEvent(new CustomEvent('fm-sim-switched',{detail:{id:activeSim,title:s.title}}));
}
function updateControlOutput(key){
  const c=simDefinitions[activeSim].controls.find(x=>x.k===key), out=$('[data-output="'+key+'"]');
  if(!c||!out)return;
  let v=simVals[key],digits=Math.abs(v)<.01?4:(c.step<.1?2:(c.step<1?1:0));
  if(Math.abs(v)>1e6 || (Math.abs(v)>0&&Math.abs(v)<1e-4)) out.textContent=Number(v).toExponential(2)+' '+c.u;
  else out.textContent=Number(v).toFixed(digits)+' '+c.u;
}
function setSimValue(key,value){
  const c=simDefinitions[activeSim].controls.find(x=>x.k===key);if(!c)return;
  value=clamp(value,c.min,c.max);simVals[key]=value;
  const input=$('[data-control="'+key+'"]');if(input)input.value=value;
  updateControlOutput(key);updateReadout();
}
function currentReadoutText(){return $('#simReadout').innerText.replace(/\n+/g,' · ');}
$('#snapshotSim').addEventListener('click',()=>{snapshots.push({t:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}),text:currentReadoutText()});if(snapshots.length>5)snapshots.shift();renderSnapshotTray();});
function renderSnapshotTray(){const h=$('#snapshotTray');h.innerHTML=snapshots.map((s,i)=>'<div class="snapshot"><strong>#'+(i+1)+'</strong> '+s.text+'</div>').join('');}

function updateReadout(){
  const v=simVals;
  if(activeSim==='circular'){const speed=v.omega*v.radius,a=v.omega*v.omega*v.radius,F=v.mass*a,T=TAU/v.omega;$('#simReadout').innerHTML='v = <strong>'+fmt(speed)+' m s⁻¹</strong><br>a = <strong>'+fmt(a)+' m s⁻²</strong><br>F = <strong>'+fmt(F)+' N</strong><br>T = <strong>'+fmt(T)+' s</strong>';}
  else if(activeSim==='shm'){const w=TAU*v.freq,x=v.amp*Math.cos(w*simTime),vel=-v.amp*w*Math.sin(w*simTime),a=-w*w*x;$('#simReadout').innerHTML='ω = '+fmt(w)+' rad s⁻¹<br>x = <strong>'+fmt(x)+' m</strong><br>v = <strong>'+fmt(vel)+' m s⁻¹</strong><br>a = <strong>'+fmt(a)+' m s⁻²</strong>';}
  else if(activeSim==='spring'){const w=Math.sqrt(v.springK/v.mass),T=TAU/w;$('#simReadout').innerHTML='ω = <strong>'+fmt(w)+' rad s⁻¹</strong><br>T = <strong>'+fmt(T)+' s</strong><br>vmax = '+fmt(w*v.amp)+' m s⁻¹';}
  else if(activeSim==='pendulum'){const T=TAU*Math.sqrt(v.length/g);$('#simReadout').innerHTML='T ≈ <strong>'+fmt(T)+' s</strong><br>f ≈ '+fmt(1/T)+' Hz<br>small-angle model; θ = '+fmt(v.angle)+'°';}
  else if(activeSim==='shmEnergy'){const w=TAU*v.freq,x=v.amp*Math.cos(w*simTime),Et=.5*v.springK*v.amp*v.amp,Ep=.5*v.springK*x*x,Ek=Et-Ep;$('#simReadout').innerHTML='x = '+fmt(x)+' m<br>KE = <strong>'+fmt(Ek)+' J</strong><br>PE = <strong>'+fmt(Ep)+' J</strong><br>Total = <strong>'+fmt(Et)+' J</strong>';}
  else if(activeSim==='damping'){const env=v.amp*Math.exp(-v.damp*simTime),w=TAU*v.freq,x=env*Math.cos(w*simTime);$('#simReadout').innerHTML='x ≈ '+fmt(x)+' m<br>amplitude envelope ≈ <strong>'+fmt(env)+' m</strong><br>damping setting = '+fmt(v.damp);}
  else if(activeSim==='resonance'){const r=v.drive/v.natural,z=v.damp,response=1/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*z*r,2));$('#simReadout').innerHTML='fdrive/fnatural = '+fmt(r)+'<br>relative response = <strong>'+fmt(response)+'</strong><br>damping = '+fmt(z);}
  else if(activeSim==='thermalParticles'){const phase=['solid','liquid','gas'][Math.round(v.phase)],ke=1.5*kB*v.temp;$('#simReadout').innerHTML='state = <strong>'+phase+'</strong><br>T = '+fmt(v.temp)+' K<br>mean translational KE scale = <strong>'+ke.toExponential(2)+' J</strong>';}
  else if(activeSim==='calorimetry'){const rise=v.power*simTime/(v.mass*v.specificC);$('#simReadout').innerHTML='ΔT = Pt/(mc) = <strong>'+fmt(rise)+' K</strong><br>dT/dt = '+fmt(v.power/(v.mass*v.specificC))+' K s⁻¹<br>energy supplied = '+fmt(v.power*simTime)+' J';}
  else if(activeSim==='flowHeating'){const dT=v.power/(v.flow*v.specificC);$('#simReadout').innerHTML='ΔT = P/(ṁc) = <strong>'+fmt(dT)+' K</strong><br>energy per kg = '+fmt(v.power/v.flow)+' J kg⁻¹';}
  else if(activeSim==='heatingCurve'){const state=heatingState(v.energy);$('#simReadout').innerHTML='supplied energy = '+fmt(v.energy)+'%<br>region = <strong>'+state.label+'</strong><br>model temperature = <strong>'+fmt(state.temp)+' K</strong><br>'+state.note;}
  else if(activeSim==='gasLaws'){const p=101*(80/v.volume)*(v.temp/300)*v.amount;$('#simReadout').innerHTML='p ≈ <strong>'+fmt(p)+' kPa</strong><br>V = '+fmt(v.volume)+' cm³<br>T = '+fmt(v.temp)+' K<br>pV/T = '+fmt(p*v.volume/v.temp)+' relative constant';}
  else if(activeSim==='idealGas'){const p=v.moles*R*v.temp/v.volume,N=v.moles*NA;$('#simReadout').innerHTML='p = nRT/V = <strong>'+fmt(p)+' Pa</strong><br>N = '+N.toExponential(2)+' molecules<br>pV/(nT) = '+fmt(p*v.volume/(v.moles*v.temp))+' J mol⁻¹ K⁻¹';}
  else if(activeSim==='boylePractical'){const p=101*80/v.volume*(v.temp/295);$('#simReadout').innerHTML='p ≈ <strong>'+fmt(p)+' kPa</strong><br>V = '+fmt(v.volume)+' cm³<br>pV = '+fmt(p*v.volume)+' kPa·cm³<br>T = '+fmt(v.temp)+' K';}
  else if(activeSim==='charlesPractical'){const V=70*(v.temp/300)*(101/v.pressure);$('#simReadout').innerHTML='V ≈ <strong>'+fmt(V)+' cm³</strong><br>T = '+fmt(v.temp)+' K<br>p = '+fmt(v.pressure)+' kPa<br>V/T = '+fmt(V/v.temp)+' cm³ K⁻¹';}
  else if(activeSim==='brownian'){const ke=1.5*kB*v.temp;$('#simReadout').innerHTML='T = '+fmt(v.temp)+' K<br>molecular impact energy scale ∝ <strong>'+ke.toExponential(2)+' J</strong><br>tracer motion is irregular because impacts are unequal';}
  else if(activeSim==='kineticTheory'){const meanKE=1.5*kB*v.temp,crms=Math.sqrt(3*kB*v.temp/v.molecularMass),V=.001,N=v.number*1e20,p=N*kB*v.temp/V;$('#simReadout').innerHTML='mean KE = <strong>'+meanKE.toExponential(2)+' J</strong><br>crms ≈ <strong>'+fmt(crms)+' m s⁻¹</strong><br>model p = '+fmt(p)+' Pa<br>pV = (1/3)Nm⟨c²⟩';}
}
function heatingState(E){
  if(E<20)return {label:'solid warming',temp:220+3*E,note:'supplied energy increases particle KE'};
  if(E<35)return {label:'melting plateau',temp:280,note:'temperature constant; particle PE increases'};
  if(E<70)return {label:'liquid warming',temp:280+3*(E-35),note:'supplied energy increases particle KE'};
  if(E<90)return {label:'boiling plateau',temp:385,note:'temperature constant; particle PE increases'};
  return {label:'gas warming',temp:385+4*(E-90),note:'supplied energy increases particle KE'};
}

function resizeCanvas(){
  const dpr=Math.min(2,window.devicePixelRatio||1),r=canvas.getBoundingClientRect();
  canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize',()=>{resizeCanvas();drawPracticalGraphs();});
function arrow(x1,y1,x2,y2,label,color){
  const a=Math.atan2(y2-y1,x2-x1),head=10;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-head*Math.cos(a-.5),y2-head*Math.sin(a-.5));ctx.lineTo(x2-head*Math.cos(a+.5),y2-head*Math.sin(a+.5));ctx.closePath();ctx.fill();if(label){ctx.font='13px system-ui';ctx.fillText(label,(x1+x2)/2+5,(y1+y2)/2-6);}
}
function rounded(x,y,w,h,r,fill,stroke){
  ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill()}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke()}
}
function drawGrid(w,h){
  const g=ctx.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0b1e31');g.addColorStop(1,'#06111d');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle='rgba(125,170,210,.07)';ctx.lineWidth=1;
  for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
}
function labelPill(x,y,text,color='#8fcfff'){
  if(!simVisual.labels)return;ctx.font='12px system-ui';const m=ctx.measureText(text).width;rounded(x,y,m+18,25,10,'rgba(4,12,21,.82)',color);ctx.fillStyle=color;ctx.fillText(text,x+9,y+17);
}
function glowDot(x,y,r,color){
  ctx.save();ctx.shadowBlur=22;ctx.shadowColor=color;ctx.fillStyle=color;ctx.beginPath();ctx.arc(x,y,r,0,TAU);ctx.fill();ctx.restore();
}
function addTrail(key,x,y,color,max=28){
  if(!simVisual.trails)return;trailPoints[key]=trailPoints[key]||[];trailPoints[key].push({x,y});if(trailPoints[key].length>max)trailPoints[key].shift();
  trailPoints[key].forEach((p,i)=>{ctx.fillStyle=color;ctx.globalAlpha=.05+.45*i/trailPoints[key].length;ctx.beginPath();ctx.arc(p.x,p.y,2+3*i/trailPoints[key].length,0,TAU);ctx.fill();});ctx.globalAlpha=1;
}
function drawRuler(x1,y1,x2,y2,label){
  ctx.strokeStyle='#58738d';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  const n=8;for(let i=0;i<=n;i++){const t=i/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x,y+5);ctx.stroke();}
  if(simVisual.labels){ctx.fillStyle='#9eb5ca';ctx.font='12px system-ui';ctx.fillText(label,(x1+x2)/2-25,(y1+y2)/2-9);}
}
function drawMassBlock(x,y,w,h,text,color='#67c7ff'){
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'#9de0ff');g.addColorStop(.45,color);g.addColorStop(1,'#245e82');ctx.save();ctx.shadowBlur=16;ctx.shadowColor='rgba(0,0,0,.45)';rounded(x,y,w,h,8,g,'#bce7ff');ctx.restore();
  if(simVisual.labels){ctx.fillStyle='#06111d';ctx.font='700 14px system-ui';ctx.fillText(text,x+w/2-ctx.measureText(text).width/2,y+h/2+5);}
}
function drawSpringCoil(cx,top,bottom,width=23,turns=18){
  ctx.strokeStyle='#d7e1ea';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx,top);for(let i=1;i<=turns;i++){const yy=top+(bottom-top)*i/(turns+1);ctx.lineTo(cx+(i%2?width:-width),yy)}ctx.lineTo(cx,bottom);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=1.3;ctx.stroke();
}
function particleBox(x,y,w,h,count,speed,gas=true){
  count=Math.max(8,Math.round(count*(window.FM_PERF_SCALE||1)));
  rounded(x,y,w,h,10,'rgba(7,19,32,.5)','#567690');
  for(let i=0;i<count;i++){
    const px=x+8+((i*73+simTime*speed*(i%3+1)*23)%(w-16));
    const py=y+8+((i*47+Math.sin(simTime*speed+i)*35+i*9)%(h-16)+h)% (h-16);
    const color=i%5===0?'#b292ff':'#6ed2ff';
    if(simVisual.trails&&gas){ctx.strokeStyle=color;ctx.globalAlpha=.14;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px-(i%2?8:-8),py-(i%3-1)*5);ctx.stroke();ctx.globalAlpha=1;}
    glowDot(px,py,gas?2.8:4,color);
  }
}
function drawSim(){
  resizeCanvas();const r=canvas.getBoundingClientRect(),w=r.width,h=r.height,v=simVals;ctx.clearRect(0,0,w,h);drawGrid(w,h);ctx.font='14px system-ui';ctx.fillStyle='#dceaff';
  labelPill(16,14,simDefinitions[activeSim].title,'#8fd7ff');

  if(activeSim==='circular'){
    const cx=w*.5,cy=h*.53,Rp=Math.min(w,h)*(.16+.08*(v.radius-.4)/2.1),ang=v.omega*simTime,x=cx+Rp*Math.cos(ang),y=cy+Rp*Math.sin(ang);
    ctx.save();ctx.shadowBlur=22;ctx.shadowColor='rgba(103,199,255,.25)';ctx.strokeStyle='#4f7a98';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,Rp,0,TAU);ctx.stroke();ctx.restore();
    ctx.strokeStyle='rgba(160,200,230,.35)';ctx.lineWidth=2;ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);
    glowDot(cx,cy,8,'#8aa7bd');addTrail('circular',x,y,'rgba(255,213,106,.55)');glowDot(x,y,14,'#ffd56a');
    const tx=-Math.sin(ang),ty=Math.cos(ang),speed=v.omega*v.radius,aMag=v.omega*v.omega*v.radius,dx=cx-x,dy=cy-y,dr=Math.hypot(dx,dy)||1,vLen=clamp(speed*22,30,130),aLen=clamp(aMag*15,30,130);if(simVisual.vectors){arrow(x,y,x+tx*vLen,y+ty*vLen,simVisual.labels?'v '+fmt(speed)+' m s⁻¹':'','#63d9a4');arrow(x,y,x+dx/dr*aLen,y+dy/dr*aLen,simVisual.labels?'a '+fmt(aMag)+' m s⁻²':'','#ff7b87');}
    drawRuler(cx,cy+24,x, y+24,'r = '+v.radius.toFixed(2)+' m');
    labelPill(16,h-42,'ω = '+v.omega.toFixed(2)+' rad s⁻¹','#ffd56a');
  } else if(activeSim==='shm'){
    const om=TAU*v.freq,xm=v.amp*Math.cos(om*simTime),vel=-v.amp*om*Math.sin(om*simTime),acc=-om*om*xm,mid=w*.5,y=h*.26,scale=Math.min(w*.34,300)/.2,px=mid+xm*scale;
    rounded(38,y-36,w-76,72,14,'rgba(20,40,57,.65)','#496781');ctx.strokeStyle='#91a9be';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(55,y+26);ctx.lineTo(w-55,y+26);ctx.stroke();
    ctx.strokeStyle='#ffd56a';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(mid,y-48);ctx.lineTo(mid,y+48);ctx.stroke();ctx.setLineDash([]);labelPill(mid-45,y+52,'equilibrium','#ffd56a');
    addTrail('shm',px,y,'rgba(103,199,255,.5)');drawMassBlock(px-34,y-22,68,44,'oscillator');
    if(simVisual.vectors){arrow(px,y-56,px+clamp(vel*75,-135,135),y-56,'v','#63d9a4');arrow(px,y+72,px+clamp(acc*16,-135,135),y+72,'a','#ff7b87');}
    if(simVisual.labels)labelPill(16,h*.51,'x = '+xm.toFixed(3)+' m','#8fd7ff');
    drawWaveGraph(45,h*.67,w-90,h*.23,om,v.amp);
  } else if(activeSim==='spring'){
    const om=Math.sqrt(v.springK/v.mass),x=v.amp*Math.cos(om*simTime),cx=w*.5,top=38,base=h*.43,py=base+x*650;
    ctx.fillStyle='#8599aa';ctx.fillRect(cx-100,22,200,14);ctx.fillStyle='#4c5f70';for(let i=0;i<9;i++)ctx.fillRect(cx-95+i*23,36,12,7);
    drawSpringCoil(cx,top+10,py,22,18);drawMassBlock(cx-58,py,116,60,v.mass.toFixed(2)+' kg');
    ctx.strokeStyle='#ffd56a';ctx.setLineDash([6,5]);ctx.beginPath();ctx.moveTo(cx-150,base+30);ctx.lineTo(cx+150,base+30);ctx.stroke();ctx.setLineDash([]);labelPill(cx+155,base+18,'equilibrium','#ffd56a');
    if(simVisual.vectors){const dir=x===0?0:-Math.sign(x),len=Math.min(90,Math.abs(v.springK*x)*12);arrow(cx+80,py+30,cx+80,py+30+dir*len,'F = −kx','#ff7b87');}
    labelPill(16,h-42,'T = '+(TAU/om).toFixed(3)+' s','#8fd7ff');
  } else if(activeSim==='pendulum'){
    const theta=v.angle*Math.PI/180*Math.cos(Math.sqrt(g/v.length)*simTime),cx=w*.5,cy=54,L=Math.min(h*.62,175+v.length*110),bx=cx+L*Math.sin(theta),by=cy+L*Math.cos(theta);
    ctx.fillStyle='#7b8e9f';ctx.fillRect(cx-95,24,190,12);ctx.fillRect(cx-5,24,10,28);glowDot(cx,cy,6,'#d5e0e8');
    ctx.strokeStyle='#e2e9ef';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(bx,by);ctx.stroke();addTrail('pendulum',bx,by,'rgba(255,213,106,.5)');
    const gb=ctx.createRadialGradient(bx-7,by-7,2,bx,by,22);gb.addColorStop(0,'#fff0b0');gb.addColorStop(.45,'#ffd56a');gb.addColorStop(1,'#a26c18');ctx.fillStyle=gb;ctx.beginPath();ctx.arc(bx,by,20,0,TAU);ctx.fill();
    ctx.strokeStyle='#516e86';ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,L,Math.PI/2-v.angle*Math.PI/180,Math.PI/2+v.angle*Math.PI/180);ctx.stroke();
    if(simVisual.vectors){arrow(bx,by,bx,by+72,'mg','#ff7b87');arrow(bx,by,bx+(cx-bx)*.28,by+(cy-by)*.28,'tension','#63d9a4');}
    labelPill(16,h-42,'θ = '+(theta*180/Math.PI).toFixed(1)+'° · L = '+v.length.toFixed(2)+' m','#8fd7ff');
  } else if(activeSim==='shmEnergy'){
    const om=TAU*v.freq,x=v.amp*Math.cos(om*simTime),Et=.5*v.springK*v.amp*v.amp,Ep=.5*v.springK*x*x,Ek=Et-Ep,mid=w*.39,y=h*.25,scale=w*.25/.2,px=mid+x*scale;
    rounded(35,y-38,w*.60,76,14,'rgba(20,40,57,.65)','#496781');ctx.strokeStyle='#ffd56a';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(mid,y-45);ctx.lineTo(mid,y+45);ctx.stroke();ctx.setLineDash([]);addTrail('energy',px,y,'rgba(103,199,255,.5)');drawMassBlock(px-28,y-20,56,40,'m');
    const bx=w*.73,barW=42,maxH=h*.42,base=h*.76;drawBar(bx,base,barW,maxH,Et?Ek/Et:0,'KE','#63d9a4');drawBar(bx+66,base,barW,maxH,Et?Ep/Et:0,'PE','#9a86ff');drawBar(bx+132,base,barW,maxH,1,'Total','#67c7ff');
    if(simVisual.labels)labelPill(22,h*.49,'KE '+Ek.toFixed(3)+' J · PE '+Ep.toFixed(3)+' J','#dceaff');
  } else if(activeSim==='damping'){
    const om=TAU*v.freq,env=v.amp*Math.exp(-v.damp*simTime),x=env*Math.cos(om*simTime),mid=w*.5,y=h*.22,scale=w*.28/.2,px=mid+x*scale;
    rounded(38,y-34,w-76,68,14,'rgba(20,40,57,.65)','#496781');ctx.strokeStyle='#ffd56a';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(mid,y-42);ctx.lineTo(mid,y+42);ctx.stroke();ctx.setLineDash([]);addTrail('damp',px,y,'rgba(103,199,255,.45)');drawMassBlock(px-30,y-20,60,40,'m');
    labelPill(16,h*.42,'amplitude envelope = '+env.toFixed(3)+' m','#8fd7ff');drawDampedGraph(45,h*.62,w-90,h*.29,v);
  } else if(activeSim==='resonance'){
    rounded(48,28,w-96,h-80,16,'rgba(6,17,29,.42)','#355570');drawResonanceGraph(70,55,w-140,h-135,v);
    if(simVisual.labels){labelPill(75,h-60,'drive '+v.drive.toFixed(2)+' Hz','#ffd56a');labelPill(220,h-60,'natural '+v.natural.toFixed(2)+' Hz','#67c7ff');labelPill(390,h-60,'damping '+v.damp.toFixed(2),'#ff9aa3');}
  } else if(activeSim==='thermalParticles'){
    const phase=Math.round(v.phase),box={x:70,y:64,w:w-140,h:h-135},state=['SOLID','LIQUID','GAS'][phase];rounded(box.x,box.y,box.w,box.h,14,'rgba(8,25,39,.55)','#5d7890');
    const count=phase===0?48:(phase===1?42:32),speed=.3+v.temp/250;
    if(phase===0){for(let j=0;j<6;j++)for(let i=0;i<8;i++){const jitter=Math.sin(simTime*speed+i+j)*2.2;glowDot(box.x+45+i*box.w/9+jitter,box.y+42+j*box.h/7+jitter,5.5,'#67c7ff');}}
    else if(phase===1){for(let i=0;i<count;i++){const px=box.x+25+((i*61+Math.sin(simTime*speed+i)*18)%(box.w-50)),py=box.y+box.h*.43+((i*37+Math.cos(simTime*speed*.8+i)*25)%(box.h*.46));glowDot(px,py,4.5,'#67c7ff');}}
    else particleBox(box.x+5,box.y+5,box.w-10,box.h-10,count,speed,true);
    labelPill(84,80,state+' · '+v.temp.toFixed(0)+' K',phase===2?'#ff9d73':'#8fd7ff');
    if(simVisual.labels)ctx.fillText(['ordered lattice + vibration','close-packed but disordered','widely separated random motion'][phase],90,h-38);
  } else if(activeSim==='calorimetry'){
    const rise=v.power*simTime/(v.mass*v.specificC),temp=293+rise,bx=w*.27,by=h*.29,bw=w*.42,bh=h*.40;
    ctx.save();ctx.shadowBlur=20;ctx.shadowColor='rgba(0,0,0,.4)';rounded(bx-20,by-20,bw+40,bh+40,18,'#263b4b','#8296a8');rounded(bx,by,bw,bh,12,'#568dad','#b6d6e8');ctx.restore();
    ctx.fillStyle='#ff6d74';ctx.fillRect(bx+bw*.46,by-55,14,bh+60);ctx.fillStyle='#ffd56a';ctx.fillRect(bx+bw*.66,by-42,8,bh+45);drawThermometer(w*.79,h*.18,h*.54,clamp((temp-293)/60,0,1));
    labelPill(bx,by+bh+30,'heater '+v.power.toFixed(0)+' W','#ff8f98');labelPill(bx+155,by+bh+30,'T ≈ '+temp.toFixed(1)+' K','#ffd56a');
  } else if(activeSim==='flowHeating'){
    const y=h*.5,x1=65,x2=w-65;ctx.lineCap='round';ctx.strokeStyle='#294d67';ctx.lineWidth=38;ctx.beginPath();ctx.moveTo(x1,y);ctx.lineTo(x2,y);ctx.stroke();ctx.strokeStyle='#5a839e';ctx.lineWidth=30;ctx.stroke();
    const hx=w*.43,hw=w*.14;ctx.strokeStyle='#ff6f76';ctx.lineWidth=7;for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(hx+i*hw/5,y-28);ctx.lineTo(hx+(i+.5)*hw/5,y+28);ctx.stroke();}
    const speed=80+v.flow*3000;for(let i=0;i<13;i++){const px=x1+((i*68+simTime*speed)%(x2-x1)),c=px<w*.5?'#67c7ff':'#ff9e7b';glowDot(px,y,4.5,c);}
    const dT=v.power/(v.flow*v.specificC);if(simVisual.vectors){arrow(x1+15,y-52,x1+95,y-52,'flow','#67c7ff');arrow(x2-95,y-52,x2-15,y-52,'flow','#ff9e7b');}
    labelPill(x1,y+34,'inlet 293 K','#67c7ff');labelPill(x2-145,y+34,'outlet '+(293+dT).toFixed(1)+' K','#ff9e7b');
  } else if(activeSim==='heatingCurve'){
    drawHeatingCurve(65,48,w-130,h-120,v.energy);
  } else if(['gasLaws','idealGas','boylePractical'].includes(activeSim)){
    const V=activeSim==='idealGas'?v.volume*10000:v.volume,frac=activeSim==='idealGas'?clamp((V-10)/90,.1,1):clamp((V-30)/110,.05,1),bx=w*.25,by=65,bw=w*.50,bh=h*.68,pistonY=by+35+(1-frac)*(bh-95);
    rounded(bx,by,bw,bh,12,'rgba(8,26,42,.52)','#7f98aa');ctx.fillStyle='#a9b7c2';rounded(bx-5,pistonY-10,bw+10,22,5,'#a9b7c2','#dce5eb');ctx.fillStyle='#6f7f8d';ctx.fillRect(bx+bw*.42,pistonY-48,bw*.16,38);
    const temp=v.temp||300,amount=v.amount||v.moles||1;particleBox(bx+8,pistonY+14,bw-16,by+bh-pistonY-22,Math.max(18,Math.round(24*(amount||1))),.6+temp/300,true);
    drawRuler(bx-35,pistonY,bx-35,by+bh,'gas volume');labelPill(bx+bw-110,pistonY-40,'drag piston','#ffd56a');
  } else if(activeSim==='charlesPractical'){
    const V=70*(v.temp/300)*(101/v.pressure),bx=w*.32,by=h*.19,bw=w*.36,bh=h*.53,frac=clamp((V-50)/55,.1,1),py=by+bh*(1-frac);
    rounded(bx-75,by-38,bw+150,bh+105,18,'rgba(70,166,217,.18)','#4f7996');labelPill(bx-55,by-28,'water bath '+v.temp.toFixed(0)+' K','#67c7ff');
    rounded(bx,by,bw,bh,8,'rgba(8,26,42,.58)','#9db0be');rounded(bx-3,py,bw+6,17,4,'#adb9c4','#dce5eb');particleBox(bx+8,py+20,bw-16,by+bh-py-28,24,.7+v.temp/350,true);
    if(simVisual.labels)labelPill(bx+bw+20,py-4,'V ≈ '+V.toFixed(1)+' cm³','#ffd56a');
  } else if(activeSim==='brownian'){
    const bx=55,by=48,bw=w-110,bh=h-110,speed=.7+v.temp/260,count=Math.round(40*v.density);particleBox(bx,by,bw,bh,count,speed,true);
    brownianTracer.vx+=(Math.random()-.5)*v.temp/14000;brownianTracer.vy+=(Math.random()-.5)*v.temp/14000;brownianTracer.vx*=.95;brownianTracer.vy*=.95;brownianTracer.x=clamp(brownianTracer.x+brownianTracer.vx,.08,.92);brownianTracer.y=clamp(brownianTracer.y+brownianTracer.vy,.08,.92);const tx=bx+brownianTracer.x*bw,ty=by+brownianTracer.y*bh;addTrail('brownian',tx,ty,'rgba(255,213,106,.65)',55);glowDot(tx,ty,14,'#ffd56a');labelPill(tx+18,ty-14,'visible tracer','#ffd56a');
  } else if(activeSim==='kineticTheory'){
    const bx=55,by=48,bw=w-110,bh=h-115,crms=Math.sqrt(3*kB*v.temp/v.molecularMass),speed=.35+crms/600;particleBox(bx,by,bw,bh,Math.round(v.number),speed,true);
    if(simVisual.vectors){const px=bx+bw*.78,py=by+bh*.45;arrow(px-75,py,px,py,'incoming momentum','#63d9a4');arrow(px,py,px-75,py+42,'rebound','#ff7b87');}
    labelPill(70,h-52,'cᵣₘₛ ≈ '+crms.toFixed(0)+' m s⁻¹','#8fd7ff');
  }
}
function drawWaveGraph(x,y,w,h,om,A){
  ctx.strokeStyle='#314b65';ctx.strokeRect(x,y-h/2,w,h);const series=[{phase:0,amp:A,color:'#67c7ff'},{phase:-Math.PI/2,amp:A*.75,color:'#63d9a4'},{phase:Math.PI,amp:A*.6,color:'#ff7b87'}];series.forEach(s=>{ctx.strokeStyle=s.color;ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=160;i++){const t=i/160*TAU,xx=x+i/160*w,yy=y-Math.cos(t+s.phase)*h*.36;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.stroke();});ctx.fillStyle='#67c7ff';ctx.fillText('x',x+5,y-h/2+15);ctx.fillStyle='#63d9a4';ctx.fillText('v',x+25,y-h/2+15);ctx.fillStyle='#ff7b87';ctx.fillText('a',x+45,y-h/2+15);
}
function drawDampedGraph(x,y,w,h,v){
  const om=TAU*v.freq;ctx.strokeStyle='#314b65';ctx.strokeRect(x,y-h/2,w,h);ctx.strokeStyle='#67c7ff';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=180;i++){const t=i/180*8,amp=v.amp*Math.exp(-v.damp*t),yy=y-amp*Math.cos(om*t)*h/.45,xx=x+i/180*w;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.stroke();
}
function drawResonanceGraph(x,y,w,h,v){
  ctx.strokeStyle='#7894aa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.stroke();
  ctx.fillStyle='rgba(103,199,255,.05)';ctx.fillRect(x,y,w,h);
  ctx.strokeStyle='#67c7ff';ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<=180;i++){const f=.3+i/180*5.2,r=f/v.natural,A=1/Math.sqrt((1-r*r)**2+(2*v.damp*r)**2),xx=x+i/180*w,yy=y+h-Math.min(1,A/5)*h*.90;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.stroke();
  const natX=x+clamp((v.natural-.3)/5.2,0,1)*w;ctx.strokeStyle='#67c7ff';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(natX,y);ctx.lineTo(natX,y+h);ctx.stroke();ctx.setLineDash([]);
  const rd=v.drive/v.natural,A=1/Math.sqrt((1-rd*rd)**2+(2*v.damp*rd)**2),mx=x+clamp((v.drive-.3)/5.2,0,1)*w,my=y+h-Math.min(1,A/5)*h*.90;glowDot(mx,my,8,'#ffd56a');
  if(simVisual.labels){ctx.fillStyle='#dceaff';ctx.fillText('response amplitude',x+6,y+16);ctx.fillText('driving frequency',x+w-118,y+h+22);labelPill(natX-45,y+8,'natural f','#67c7ff');}
}
function drawBar(x,base,w,h,f,label,color){
  rounded(x,base-h,w,h,7,'#17304a','#31526c');const gh=ctx.createLinearGradient(x,base-h,x,base);gh.addColorStop(0,color);gh.addColorStop(1,'rgba(255,255,255,.18)');ctx.fillStyle=gh;ctx.beginPath();ctx.roundRect(x,base-h*f,w,h*f,7);ctx.fill();
  if(simVisual.labels){ctx.fillStyle='#dceaff';ctx.font='12px system-ui';ctx.fillText(label,x-1,base+20);ctx.fillText(Math.round(f*100)+'%',x+5,base-h*f-7);}
}
function drawThermometer(x,y,h,f){
  ctx.strokeStyle='#d0dce6';ctx.lineWidth=7;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.stroke();const gr=ctx.createLinearGradient(0,y+h,0,y);gr.addColorStop(0,'#67c7ff');gr.addColorStop(1,'#ff6d74');ctx.strokeStyle=gr;ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x,y+h*(1-f));ctx.stroke();glowDot(x,y+h+13,13,'#ff6d74');
}
function drawHeatingCurve(x,y,w,h,E){
  ctx.strokeStyle='#7894aa';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.stroke();
  const pts=[[0,.9],[.2,.65],[.35,.65],[.7,.28],[.9,.28],[1,.08]],labels=['solid warms','melting','liquid warms','boiling','gas warms'],cols=['#67c7ff','#ffd56a','#63d9a4','#ffd56a','#ff9d73'];
  for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],x1=x+a[0]*w,x2=x+b[0]*w,y1=y+a[1]*h,y2=y+b[1]*h;ctx.strokeStyle=cols[i-1];ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();if(simVisual.labels)labelPill((x1+x2)/2-35,(y1+y2)/2-33,labels[i-1],cols[i-1]);}
  const e=E/100;let seg=0;for(let i=1;i<pts.length;i++)if(e<=pts[i][0]){seg=i;break;}if(!seg)seg=pts.length-1;const a=pts[seg-1],b=pts[seg],q=(e-a[0])/(b[0]-a[0]),mx=x+e*w,my=y+(a[1]+(b[1]-a[1])*q)*h;glowDot(mx,my,9,'#ffffff');
  if(simVisual.labels){ctx.fillStyle='#dceaff';ctx.fillText('temperature',x+5,y+14);ctx.fillText('energy supplied',x+w-105,y+h+22);}
}
function animate(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(running)simTime+=dt*(slow?.3:1);drawSim();updateReadout();requestAnimationFrame(animate);}
requestAnimationFrame(animate);
$('#playPause').addEventListener('click',()=>{running=!running;$('#playPause').textContent=running?'Pause':'Play';$('#simState').textContent=running?(slow?'Slow motion':'Running'):'Paused';});
$('#slowMotion').addEventListener('click',()=>{slow=!slow;$('#slowMotion').textContent=slow?'Normal speed':'Slow motion';$('#simState').textContent=running?(slow?'Slow motion':'Running'):'Paused';});
$('#resetSim').addEventListener('click',()=>{simTime=0;brownianTracer={x:.5,y:.5,vx:0,vy:0};Object.keys(trailPoints).forEach(k=>trailPoints[k]=[]);renderSim();renderMission();});

let dragging=false;
canvas.addEventListener('pointerdown',e=>{dragging=true;canvas.setPointerCapture(e.pointerId);handleDrag(e);});
canvas.addEventListener('pointermove',e=>{if(dragging)handleDrag(e);});
canvas.addEventListener('pointerup',()=>dragging=false);
canvas.addEventListener('pointercancel',()=>dragging=false);
function handleDrag(e){
  const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top,w=r.width,h=r.height;
  if(activeSim==='circular'){const cx=w*.5,cy=h*.52,dist=Math.hypot(x-cx,y-cy),val=.4+(clamp(dist/(Math.min(w,h)*.24),0,1))*2.1;setSimValue('radius',Math.round(val*10)/10);}
  else if(['shm','shmEnergy','damping'].includes(activeSim)){const amp=clamp(Math.abs(x-w*.5)/(w*.34)*.2,.03,.2);setSimValue('amp',Math.round(amp*100)/100);}
  else if(activeSim==='spring'){const amp=clamp(Math.abs(y-h*.45)/700,.02,.15);setSimValue('amp',Math.round(amp*100)/100);}
  else if(activeSim==='pendulum'){const cx=w*.5,cy=40,ang=Math.atan2(x-cx,y-cy)*180/Math.PI;setSimValue('angle',Math.round(Math.abs(ang)));}
  else if(activeSim==='resonance'){const f=.3+clamp((x-55)/(w-105),0,1)*5.2;setSimValue('drive',Math.round(f*10)/10);}
  else if(['gasLaws','boylePractical'].includes(activeSim)){const frac=clamp(1-(y-90)/(h*.6),.05,1),V=30+frac*110;setSimValue('volume',Math.round(V/2)*2);}
  else if(activeSim==='idealGas'){const frac=clamp(1-(y-90)/(h*.6),.05,1),V=.001+frac*.009;setSimValue('volume',Math.round(V*10000)/10000);}
  else if(activeSim==='heatingCurve'){const E=clamp((x-55)/(w-110)*100,0,100);setSimValue('energy',Math.round(E));}
  else if(activeSim==='brownian'){brownianTracer.x=clamp((x-55)/(w-110),.05,.95);brownianTracer.y=clamp((y-40)/(h-90),.05,.95);brownianTracer.vx=0;brownianTracer.vy=0;}
  else if(activeSim==='flowHeating'){const flow=clamp(.005+(x/w)*.055,.005,.06);setSimValue('flow',Math.round(flow*1000)/1000);}
  else if(activeSim==='calorimetry'){const power=clamp(20+(1-y/h)*180,20,200);setSimValue('power',Math.round(power/5)*5);}
  else if(activeSim==='thermalParticles'){const temp=clamp(180+(1-y/h)*320,180,500);setSimValue('temp',Math.round(temp/5)*5);}
  else if(activeSim==='charlesPractical'){const temp=clamp(260+(x/w)*160,260,420);setSimValue('temp',Math.round(temp/5)*5);}
  else if(activeSim==='kineticTheory'){const temp=clamp(180+(x/w)*720,180,900);setSimValue('temp',Math.round(temp/10)*10);}
}

function setSimulationRunning(value){
  running=Boolean(value);
  $('#playPause').textContent=running?'Pause':'Play';
  $('#simState').textContent=running?(slow?'Slow motion':'Running'):'Paused';
}
function stepSimulation(dt){
  running=false;simTime=Math.max(0,simTime+dt);drawSim();updateReadout();setSimulationRunning(false);
}
function setSimulationTime(t){
  running=false;simTime=Math.max(0,Number(t)||0);drawSim();updateReadout();setSimulationRunning(false);
}
function setSimulationValues(values){
  Object.entries(values||{}).forEach(([k,v])=>setSimValue(k,Number(v)));
  drawSim();updateReadout();
}
function simulationState(){
  return {id:activeSim,title:simDefinitions[activeSim]?.title||activeSim,time:simTime,running,slow,values:{...simVals},readout:currentReadoutText(),definition:simDefinitions[activeSim]};
}
window.FM_SIM={
  getState:simulationState,
  setValue:setSimValue,
  setValues:setSimulationValues,
  setRunning:setSimulationRunning,
  step:stepSimulation,
  setTime:setSimulationTime,
  reset:function(){simTime=0;brownianTracer={x:.5,y:.5,vx:0,vy:0};Object.keys(trailPoints).forEach(k=>trailPoints[k]=[]);drawSim();updateReadout();},
  getCanvas:function(){return canvas;}
};

/* Formula coach */
const formulas=[
 {topic:'mechanics',name:'Radians',desc:'θ=s/r',inputs:[['s','Arc length',1.2,'m'],['r','Radius',.4,'m']],calc:v=>({steps:['θ=s/r'],answer:v.s/v.r,unit:'rad'})},
 {topic:'mechanics',name:'Angular speed',desc:'ω=2πf',inputs:[['f','Frequency',3,'Hz']],calc:v=>({steps:['ω=2πf'],answer:TAU*v.f,unit:'rad s⁻¹'})},
 {topic:'mechanics',name:'Tangential speed',desc:'v=ωr',inputs:[['omega','Angular speed',4,'rad s⁻¹'],['r','Radius',.6,'m']],calc:v=>({steps:['v=ωr'],answer:v.omega*v.r,unit:'m s⁻¹'})},
 {topic:'mechanics',name:'Centripetal acceleration',desc:'a=v²/r',inputs:[['v','Speed',12,'m s⁻¹'],['r','Radius',45,'m']],calc:v=>({steps:['a=v²/r'],answer:v.v*v.v/v.r,unit:'m s⁻²'})},
 {topic:'mechanics',name:'Centripetal force',desc:'F=mv²/r',inputs:[['m','Mass',.5,'kg'],['v','Speed',4,'m s⁻¹'],['r','Radius',.8,'m']],calc:v=>({steps:['F=mv²/r'],answer:v.m*v.v*v.v/v.r,unit:'N'})},
 {topic:'mechanics',name:'SHM acceleration',desc:'a=−ω²x',inputs:[['omega','Angular frequency',6,'rad s⁻¹'],['x','Displacement',.05,'m']],calc:v=>({steps:['a=−ω²x'],answer:-v.omega*v.omega*v.x,unit:'m s⁻²'})},
 {topic:'mechanics',name:'Maximum SHM speed',desc:'vmax=ωA',inputs:[['omega','Angular frequency',8,'rad s⁻¹'],['A','Amplitude',.06,'m']],calc:v=>({steps:['vmax=ωA'],answer:v.omega*v.A,unit:'m s⁻¹'})},
 {topic:'mechanics',name:'Maximum SHM acceleration',desc:'amax=ω²A',inputs:[['omega','Angular frequency',8,'rad s⁻¹'],['A','Amplitude',.06,'m']],calc:v=>({steps:['amax=ω²A'],answer:v.omega*v.omega*v.A,unit:'m s⁻²'})},
 {topic:'mechanics',name:'Spring period',desc:'T=2π√(m/k)',inputs:[['m','Mass',.4,'kg'],['springK','Spring constant',25,'N m⁻¹']],calc:v=>({steps:['T=2π√(m/k)'],answer:TAU*Math.sqrt(v.m/v.springK),unit:'s'})},
 {topic:'mechanics',name:'Pendulum period',desc:'T=2π√(L/g)',inputs:[['L','Length',.8,'m'],['grav','g',9.81,'m s⁻²']],calc:v=>({steps:['T=2π√(L/g)'],answer:TAU*Math.sqrt(v.L/v.grav),unit:'s'})},
 {topic:'mechanics',name:'SHM total energy',desc:'E=½kA²',inputs:[['springK','Spring constant',40,'N m⁻¹'],['A','Amplitude',.1,'m']],calc:v=>({steps:['E=½kA²'],answer:.5*v.springK*v.A*v.A,unit:'J'})},
 {topic:'thermal',name:'Specific heat energy',desc:'Q=mcΔT',inputs:[['m','Mass',.8,'kg'],['c','Specific heat capacity',900,'J kg⁻¹ K⁻¹'],['dT','Temperature change',24,'K']],calc:v=>({steps:['Q=mcΔT'],answer:v.m*v.c*v.dT,unit:'J'})},
 {topic:'thermal',name:'Specific heat capacity',desc:'c=Q/(mΔT)',inputs:[['Q','Energy',18000,'J'],['m','Mass',.8,'kg'],['dT','Temperature change',24,'K']],calc:v=>({steps:['c=Q/(mΔT)'],answer:v.Q/(v.m*v.dT),unit:'J kg⁻¹ K⁻¹'})},
 {topic:'thermal',name:'Continuous-flow ΔT',desc:'ΔT=P/(ṁc)',inputs:[['P','Power',1500,'W'],['flow','Mass flow rate',.02,'kg s⁻¹'],['c','Specific heat capacity',4200,'J kg⁻¹ K⁻¹']],calc:v=>({steps:['P=ṁcΔT','ΔT=P/(ṁc)'],answer:v.P/(v.flow*v.c),unit:'K'})},
 {topic:'thermal',name:'Latent heat energy',desc:'Q=ml',inputs:[['m','Mass',.25,'kg'],['l','Specific latent heat',210000,'J kg⁻¹']],calc:v=>({steps:['Q=ml'],answer:v.m*v.l,unit:'J'})},
 {topic:'thermal',name:'Boyle final pressure',desc:'p₁V₁=p₂V₂',inputs:[['p1','p₁',110000,'Pa'],['V1','V₁',.0024,'m³'],['V2','V₂',.0015,'m³']],calc:v=>({steps:['p₂=p₁V₁/V₂'],answer:v.p1*v.V1/v.V2,unit:'Pa'})},
 {topic:'thermal',name:'Charles final volume',desc:'V₁/T₁=V₂/T₂',inputs:[['V1','V₁',68,'cm³'],['T1','T₁',290,'K'],['T2','T₂',330,'K']],calc:v=>({steps:['V₂=V₁T₂/T₁'],answer:v.V1*v.T2/v.T1,unit:'cm³'})},
 {topic:'thermal',name:'Ideal gas pressure (moles)',desc:'p=nRT/V',inputs:[['n','Amount',.2,'mol'],['T','Temperature',300,'K'],['V','Volume',.004,'m³']],calc:v=>({steps:['p=nRT/V'],answer:v.n*R*v.T/v.V,unit:'Pa'})},
 {topic:'thermal',name:'Amount of gas',desc:'n=pV/(RT)',inputs:[['p','Pressure',120000,'Pa'],['V','Volume',.003,'m³'],['T','Temperature',300,'K']],calc:v=>({steps:['n=pV/(RT)'],answer:v.p*v.V/(R*v.T),unit:'mol'})},
 {topic:'thermal',name:'Ideal gas pressure (molecules)',desc:'p=NkT/V',inputs:[['N','Number of molecules',3e22,''],['T','Temperature',290,'K'],['V','Volume',.0008,'m³']],calc:v=>({steps:['p=NkT/V'],answer:v.N*kB*v.T/v.V,unit:'Pa'})},
 {topic:'thermal',name:'Molecule number',desc:'N=pV/(kT)',inputs:[['p','Pressure',100000,'Pa'],['V','Volume',.001,'m³'],['T','Temperature',300,'K']],calc:v=>({steps:['N=pV/(kT)'],answer:v.p*v.V/(kB*v.T),unit:'molecules'})},
 {topic:'thermal',name:'Mean molecular KE',desc:'Ēk=3/2 kT',inputs:[['T','Temperature',300,'K']],calc:v=>({steps:['Ēk=3/2 kT'],answer:1.5*kB*v.T,unit:'J'})},
 {topic:'thermal',name:'RMS speed from temperature',desc:'crms=√(3kT/m)',inputs:[['T','Temperature',300,'K'],['m','Molecular mass',4.65e-26,'kg']],calc:v=>({steps:['½m<c²>=3/2kT','crms=√(3kT/m)'],answer:Math.sqrt(3*kB*v.T/v.m),unit:'m s⁻¹'})},
 {topic:'thermal',name:'Kinetic-theory pressure',desc:'p=(1/3)ρcrms²',inputs:[['rho','Gas density',1.2,'kg m⁻³'],['c','RMS speed',500,'m s⁻¹']],calc:v=>({steps:['p=(1/3)ρcrms²'],answer:v.rho*v.c*v.c/3,unit:'Pa'})},
 {topic:'thermal',name:'Monatomic ideal-gas internal energy',desc:'U=3/2 nRT',inputs:[['n','Amount',.5,'mol'],['T','Temperature',300,'K']],calc:v=>({steps:['U=3/2 nRT'],answer:1.5*v.n*R*v.T,unit:'J'})}
];
function filteredFormulas(){const topic=$('#formulaTopic').value;return formulas.filter(f=>topic==='all'||f.topic===topic);}
function renderFormula(){
  const fs=filteredFormulas();$('#formulaSelect').innerHTML=fs.map((f,i)=>'<option value="'+i+'">'+f.name+' — '+f.desc+'</option>').join('');
  $('#formulaCards').innerHTML=fs.map(f=>'<article class="formula-card"><strong>'+f.name+'</strong><code>'+f.desc+'</code><p>'+f.topic+'</p></article>').join('');
  renderFormulaInputs();
}
$('#formulaTopic').addEventListener('change',renderFormula);
$('#formulaSelect').addEventListener('change',renderFormulaInputs);
function renderFormulaInputs(){
  const f=filteredFormulas()[Number($('#formulaSelect').value)||0];if(!f)return;
  $('#formulaInputs').innerHTML=f.inputs.map(i=>'<label class="field"><span>'+i[1]+' / '+i[3]+'</span><input type="number" step="any" data-finput="'+i[0]+'" value="'+i[2]+'"></label>').join('');
  $$('[data-finput]').forEach(x=>x.addEventListener('input',calculateFormula));calculateFormula();
}
function calculateFormula(){
  const f=filteredFormulas()[Number($('#formulaSelect').value)||0];if(!f)return;const v={};$$('[data-finput]').forEach(i=>v[i.dataset.finput]=Number(i.value));const res=f.calc(v);
  $('#formulaWorking').innerHTML=res.steps.map(s=>'<span class="step">'+s+'</span>').join('')+'<span class="step"><strong>Answer = '+(Math.abs(res.answer)>1e6||Math.abs(res.answer)<1e-4&&res.answer!==0?res.answer.toExponential(3):fmt(res.answer,4))+' '+res.unit+'</strong></span><span class="step muted">Check SI units, kelvin temperature where required, direction/sign and significant figures.</span>';
}

/* Quiz */
let qi=0,score=0,streak=0;
function renderQuiz(){
  const q=DATA.quiz[qi];$('#quizSpec').textContent='AQA '+q[0];$('#quizQuestion').textContent=q[1];$('#quizChoices').innerHTML=q[2].map((x,i)=>'<button class="choice-button" data-choice="'+i+'">'+x+'</button>').join('');
  $('#quizHint').textContent=q[4];$('#quizHint').classList.add('hidden');$('#quizFeedback').className='feedback hidden';$('#nextQuestion').classList.add('hidden');$('#showHint').textContent='Show hint';
  $('#quizProgress').textContent=(qi+1)+' / '+DATA.quiz.length;$('#quizProgressFill').style.width=(100*(qi+1)/DATA.quiz.length)+'%';$('#quizScore').textContent=score;$('#quizStreak').textContent=streak;
  $$('[data-choice]').forEach(b=>b.addEventListener('click',()=>{const chosen=Number(b.dataset.choice);$$('[data-choice]').forEach(x=>x.disabled=true);b.classList.add(chosen===q[3]?'correct':'wrong');$$('[data-choice]')[q[3]].classList.add('correct');if(chosen===q[3]){score++;streak++;}else streak=0;$('#quizScore').textContent=score;$('#quizStreak').textContent=streak;const fb=$('#quizFeedback');fb.className='feedback '+(chosen===q[3]?'good':'bad');fb.textContent=(chosen===q[3]?'Correct. ':'Not quite. ')+q[5];$('#nextQuestion').classList.remove('hidden');}));
}
$('#showHint').addEventListener('click',()=>{$('#quizHint').classList.toggle('hidden');$('#showHint').textContent=$('#quizHint').classList.contains('hidden')?'Show hint':'Hide hint';});
$('#nextQuestion').addEventListener('click',()=>{qi=(qi+1)%DATA.quiz.length;renderQuiz();});
$('#restartQuiz').addEventListener('click',()=>{qi=0;score=0;streak=0;renderQuiz();});

/* Spec */
function renderSpec(){
  $('#specGrid').innerHTML=DATA.spec.map(s=>'<article class="spec-card"><div class="status"><span class="eyebrow">'+s[0]+'</span><span class="status-dot '+(completed.has(s[3])?'done':'')+'"></span></div><h3>'+s[1]+'</h3><p>'+s[2]+'</p><button class="text-button" data-spec-lesson="'+s[3]+'">Open linked lesson</button></article>').join('');
  $$('[data-spec-lesson]').forEach(b=>b.addEventListener('click',()=>{const i=lessons.findIndex(l=>l.id===b.dataset.specLesson);if(i>=0){activeLesson=i;courseFilter='all';renderCourseFilterButtons();renderCourseList();renderLesson();openView('course');}}));
}

/* Required practicals */
let springData=[],pendData=[],boyleData=[],charlesData=[];
$$('[data-practical]').forEach(b=>b.addEventListener('click',()=>{$$('[data-practical]').forEach(x=>x.classList.toggle('primary',x===b));$$('.practical-panel').forEach(p=>p.classList.add('hidden'));$('#practical'+b.dataset.practical[0].toUpperCase()+b.dataset.practical.slice(1)).classList.remove('hidden');setTimeout(drawPracticalGraphs,20);}));
function updatePracticalOutputs(){
  $('#springMassOut').textContent=Number($('#springMass').value).toFixed(2)+' kg';$('#springKOut').textContent=Number($('#springK').value).toFixed(0)+' N m⁻¹';$('#springBlock').textContent=Number($('#springMass').value).toFixed(2)+' kg';
  $('#pendLengthOut').textContent=Number($('#pendLength').value).toFixed(2)+' m';$('#pendAngleOut').textContent=Number($('#pendAngle').value).toFixed(0)+'°';
  $('#boyleVolumeOut').textContent=Number($('#boyleVolume').value).toFixed(0)+' cm³';$('#boyleTempOut').textContent=Number($('#boyleTemp').value).toFixed(0)+' K';
  $('#charlesTempOut').textContent=Number($('#charlesTemp').value).toFixed(0)+' K';$('#charlesPressureOut').textContent=Number($('#charlesPressure').value).toFixed(0)+' kPa';
  const a=Number($('#pendAngle').value);$('#pendString').style.transform='rotate('+a+'deg)';$('#pendBob').style.transform='rotate('+a+'deg)';
  const vf=clamp((Number($('#boyleVolume').value)-30)/70,0,1);$('#boylePiston').style.top=(10+(1-vf)*65)+'%';
  const Tv=Number($('#charlesTemp').value),pp=Number($('#charlesPressure').value),V=70*(Tv/300)*(101/pp),cf=clamp((V-50)/50,0,1);$('#charlesPlunger').style.left=(10+cf*60)+'%';
}
['springMass','springK','pendLength','pendAngle','boyleVolume','boyleTemp','charlesTemp','charlesPressure'].forEach(id=>$('#'+id).addEventListener('input',updatePracticalOutputs));
function drawScatter(id,data,xKey,yKey,xLabel,yLabel){
  const c=$('#'+id);if(!c)return;const r=c.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);c.width=Math.max(1,r.width*dpr);c.height=Math.max(1,r.height*dpr);const gc=c.getContext('2d');gc.setTransform(dpr,0,0,dpr,0,0);const w=r.width,h=r.height;gc.clearRect(0,0,w,h);gc.strokeStyle='#66809a';gc.beginPath();gc.moveTo(42,15);gc.lineTo(42,h-32);gc.lineTo(w-12,h-32);gc.stroke();gc.fillStyle='#aabbd1';gc.font='11px system-ui';gc.fillText(yLabel,4,14);gc.fillText(xLabel,w-82,h-10);if(!data.length)return;const xs=data.map(d=>d[xKey]),ys=data.map(d=>d[yKey]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);data.forEach(d=>{const xx=42+(d[xKey]-xmin)/(xmax-xmin||1)*(w-60),yy=h-32-(d[yKey]-ymin)/(ymax-ymin||1)*(h-52);gc.fillStyle='#67c7ff';gc.beginPath();gc.arc(xx,yy,5,0,TAU);gc.fill();});}
function drawPracticalGraphs(){
  drawScatter('springGraph',springData,'m','T2','m / kg','T² / s²');drawScatter('pendGraph',pendData,'L','T2','L / m','T² / s²');drawScatter('boyleGraph',boyleData,'invV','p','1/V','p / kPa');drawScatter('charlesGraph',charlesData,'T','V','T / K','V / cm³');
}
function renderSpring(){ $('#springRows').innerHTML=springData.map(r=>'<tr><td>'+r.m.toFixed(2)+'</td><td>'+r.tenT.toFixed(2)+'</td><td>'+r.T.toFixed(3)+'</td><td>'+r.T2.toFixed(3)+'</td></tr>').join('');$('#springSummary').textContent=springData.length?'For ideal data, T² = (4π²/k)m. Use the gradient to estimate k and discuss timing uncertainty.':'Collect at least three readings.';drawPracticalGraphs();}
function renderPend(){ $('#pendRows').innerHTML=pendData.map(r=>'<tr><td>'+r.L.toFixed(2)+'</td><td>'+r.tenT.toFixed(2)+'</td><td>'+r.T.toFixed(3)+'</td><td>'+r.T2.toFixed(3)+'</td></tr>').join('');$('#pendSummary').textContent=pendData.length?'For small angles, T² = (4π²/g)L. Use the gradient to estimate g.':'Collect at least three readings.';drawPracticalGraphs();}
function renderBoyle(){ $('#boyleRows').innerHTML=boyleData.map(r=>'<tr><td>'+r.V.toFixed(0)+'</td><td>'+r.p.toFixed(1)+'</td><td>'+r.invV.toFixed(4)+'</td><td>'+r.pV.toFixed(0)+'</td></tr>').join('');$('#boyleSummary').textContent=boyleData.length?'Plot p against 1/V. A straight relationship supports Boyle’s law; check whether pV is approximately constant.':'Collect at least five readings.';drawPracticalGraphs();}
function renderCharles(){ $('#charlesRows').innerHTML=charlesData.map(r=>'<tr><td>'+(r.T-273.15).toFixed(1)+'</td><td>'+r.T.toFixed(0)+'</td><td>'+r.V.toFixed(1)+'</td><td>'+(r.V/r.T).toFixed(4)+'</td></tr>').join('');$('#charlesSummary').textContent=charlesData.length?'Plot V against T/K. A straight relationship supports Charles’s law at constant pressure.':'Collect at least five readings.';drawPracticalGraphs();}
$('#takeSpringReading').addEventListener('click',()=>{const m=+$('#springMass').value,ks=+$('#springK').value,T=TAU*Math.sqrt(m/ks)*(1+(Math.random()-.5)*.012),tenT=10*T;springData.push({m,T,tenT,T2:T*T});renderSpring();});
$('#clearSpringData').addEventListener('click',()=>{springData=[];renderSpring();});
$('#takePendReading').addEventListener('click',()=>{const L=+$('#pendLength').value,ang=+$('#pendAngle').value,T=TAU*Math.sqrt(L/g)*(1+(ang*Math.PI/180)**2/16)*(1+(Math.random()-.5)*.008),tenT=10*T;pendData.push({L,T,tenT,T2:T*T});renderPend();});
$('#clearPendData').addEventListener('click',()=>{pendData=[];renderPend();});
$('#takeBoyleReading').addEventListener('click',()=>{const V=+$('#boyleVolume').value,T=+$('#boyleTemp').value,p=101*80/V*(T/295)*(1+(Math.random()-.5)*.012);boyleData.push({V,p,invV:1/V,pV:p*V});renderBoyle();});
$('#clearBoyleData').addEventListener('click',()=>{boyleData=[];renderBoyle();});
$('#takeCharlesReading').addEventListener('click',()=>{const T=+$('#charlesTemp').value,p=+$('#charlesPressure').value,V=70*(T/300)*(101/p)*(1+(Math.random()-.5)*.008);charlesData.push({T,p,V});renderCharles();});
$('#clearCharlesData').addEventListener('click',()=>{charlesData=[];renderCharles();});

window.FM_APP={
  openView:openView,
  openLessonById:function(id){var i=lessons.findIndex(function(l){return l.id===id});if(i>=0){activeLesson=i;courseFilter='all';renderCourseFilterButtons();renderCourseList();renderLesson();openView('course');}},
  openFormula:function(){openView('formula');},
  openExam:function(){openView('exam');},
  getProgress:function(){return{completed:Array.from(completed),activeLesson:lessons[activeLesson]&&lessons[activeLesson].id};}
};

/* Initialise */
renderCourseFilterButtons();renderCourseList();renderLesson();saveProgress();renderSim();renderMission();renderFormula();renderQuiz();renderSpec();updatePracticalOutputs();renderSpring();renderPend();renderBoyle();renderCharles();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
})();