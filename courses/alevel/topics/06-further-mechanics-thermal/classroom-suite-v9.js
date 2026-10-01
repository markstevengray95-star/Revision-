(function classroomSuite(){
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const DATA=window.FM_DATA||{lessons:[]}, CALC=window.FM_CALC||{}, TEXTBOOK=window.FM_TEXTBOOK||{};
const LEGACY_SUITE_KEY='fm-classroom-v9', SUITE_KEY='fm-classroom-v10', PROFILE_KEY='fm-profiles-v9', ACTIVE_KEY='fm-active-profile-v9';
const knownKeys=['fm36-completed','fm-mastery-v5','fm-retrieval-v5','fm-teacher-v5','fm-access-v5','fm-sim-investigations-v8'];
const load=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))??f}catch{return f}}, save=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
let profiles=load(PROFILE_KEY,[{id:'default',name:'Student 1',snapshot:{}}]),activeId=localStorage.getItem(ACTIVE_KEY)||profiles[0]?.id||'default';
const blankSuite=()=>({masteryHistory:{},teacherNotes:{},tests:[],bugReports:[],paperCounter:0});
let suite=Object.assign(blankSuite(),load(SUITE_KEY+':'+activeId,load(LEGACY_SUITE_KEY,{})));
const saveSuite=()=>save(SUITE_KEY+':'+activeId,suite);
const activeProfile=()=>profiles.find(p=>p.id===activeId)||profiles[0];
const lessonName=id=>DATA.lessons.find(l=>l.id===id)?.title||id;
const currentLesson=()=>window.FM_APP?.getProgress?.().activeLesson||DATA.lessons[0]?.id;
const safe=(s='')=>String(s).replace(/[<>&"]/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c]));
const download=(name,text,type='application/json')=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
const parseNum=(s)=>{if(typeof s==='number')return s;let t=String(s).trim().replace(/,/g,'');let m=t.match(/(-?\d+(?:\.\d+)?)\s*[×x]\s*10\^?([−-]?\d+)/i);if(m)return Number(m[1])*10**Number(m[2].replace('−','-'));let n=parseFloat(t);return Number.isFinite(n)?n:NaN};
const fmt=n=>!Number.isFinite(n)?'—':(Math.abs(n)>=1e5||(Math.abs(n)>0&&Math.abs(n)<1e-3)?n.toExponential(3):Number(n.toPrecision(4)).toString());

/* ---------- profiles ---------- */
function snapshotCurrentProfile(){
 const p=activeProfile(); if(!p)return;
 p.snapshot={}; knownKeys.forEach(k=>{const v=localStorage.getItem(k);if(v!=null)p.snapshot[k]=v}); save(PROFILE_KEY,profiles);
}
function restoreProfile(id){
 snapshotCurrentProfile(); const p=profiles.find(x=>x.id===id); if(!p)return;
 activeId=id;localStorage.setItem(ACTIVE_KEY,id);
 knownKeys.forEach(k=>localStorage.removeItem(k));
 Object.entries(p.snapshot||{}).forEach(([k,v])=>localStorage.setItem(k,v));
 location.reload();
}
function initProfiles(){
 const host=document.createElement('div');host.className='profile-bar panel';host.innerHTML=`
   <div><span class="eyebrow">Student profile</span><strong id="profileName">${safe(activeProfile()?.name||'Student')}</strong></div>
   <select id="profileSelect">${profiles.map(p=>`<option value="${p.id}" ${p.id===activeId?'selected':''}>${safe(p.name)}</option>`).join('')}</select>
   <button class="text-button" id="addProfile">＋ profile</button>
   <span id="autosaveStatus" class="autosave-status" aria-live="polite">Autosave on</span>
   <span id="connectionState" class="connection-state">${navigator.onLine?'Online':'Offline-ready'}</span>
   <button class="text-button hidden" id="installApp">Install app</button>`;
 const nav=$('.main-nav'); if(nav)nav.insertAdjacentElement('beforebegin',host);
 $('#profileSelect').onchange=e=>restoreProfile(e.target.value);
 $('#addProfile').onclick=()=>{const name=prompt('Profile name');if(!name?.trim())return;snapshotCurrentProfile();const id='p'+Date.now();profiles.push({id,name:name.trim(),snapshot:{}});save(PROFILE_KEY,profiles);restoreProfile(id)};
 window.addEventListener('beforeunload',snapshotCurrentProfile);
 const updateConnection=()=>{const x=$('#connectionState');if(x)x.textContent=navigator.onLine?'Online':'Offline-ready'};window.addEventListener('online',updateConnection);window.addEventListener('offline',updateConnection);
}

/* ---------- autosave typed student work ---------- */
const workKey=()=>`fm-student-work-v9:${activeId}`, getWork=()=>load(workKey(),{}), setWork=w=>save(workKey(),w);
function contextKey(el){
 const lid=currentLesson()||'none', mode=$('#masteryMode')?.value||'none', view=$('.view.active-view')?.id||'view';
 const root=el.closest('.chunk,.workspace-card,.panel')||document;
 const fields=$$('textarea,input[type="text"],input[type="number"],input[type="checkbox"]',root); const idx=Math.max(0,fields.indexOf(el));
 return `${lid}|${mode}|${view}|${root.className||root.id}|${idx}`;
}
let saveTimer;
function initAutosave(){
 document.addEventListener('input',e=>{
   const el=e.target;if(!(el.matches('textarea')||el.matches('input[type="text"]')||el.matches('input[type="number"]')||el.matches('input[type="checkbox"]')))return;
   clearTimeout(saveTimer);saveTimer=setTimeout(()=>{const w=getWork();w[contextKey(el)]=el.type==='checkbox'?{checked:el.checked}:{value:el.value};setWork(w);const st=$('#autosaveStatus');if(st){st.textContent='Saved';setTimeout(()=>st.textContent='Autosave on',900)}},250);
 });
 const restore=()=>{const w=getWork();$$('textarea,input[type="text"],input[type="number"],input[type="checkbox"]').forEach(el=>{const k=contextKey(el),v=w[k];if(v==null)return;if(el.type==='checkbox'&&typeof v==='object')el.checked=!!v.checked;else if(typeof v==='object'&&v.value!=null&&!el.value)el.value=v.value;else if(typeof v==='string'&&!el.value)el.value=v})};
 new MutationObserver(()=>setTimeout(restore,20)).observe(document.body,{childList:true,subtree:true});restore();
}

/* ---------- repeated-success mastery ---------- */
function initMasteryWrapper(){
 if(!window.FM_MASTERY?.result)return; const original=window.FM_MASTERY.result;
 window.FM_MASTERY.result=function(skill,topic,ok,label,xp){
   const key=topic||skill; suite.masteryHistory[key]=suite.masteryHistory[key]||[];suite.masteryHistory[key].push({ok:!!ok,time:Date.now(),skill,label});suite.masteryHistory[key]=suite.masteryHistory[key].slice(-6);
   saveSuite(); original(skill,topic,ok,label,xp); maybeIntervene(key);
 };
}
function secureStatus(key){
 const a=suite.masteryHistory[key]||[],last=a.slice(-4),wins=last.filter(x=>x.ok).length;
 return {secure:last.length>=4&&wins>=3,attempts:last.length,wins};
}
function maybeIntervene(topic){
 const a=suite.masteryHistory[topic]||[],recent=a.slice(-3); if(recent.length<3||recent.filter(x=>!x.ok).length<2)return;
 if(document.querySelector('.intervention-toast'))return;
 const t=document.createElement('div');t.className='intervention-toast';t.innerHTML=`<strong>Quick intervention</strong><span>You’ve missed this idea more than once. Revisit ${safe(lessonName(topic))} before the next attempt.</span><button class="button">Open lesson</button><button class="text-button">Dismiss</button>`;
 document.body.appendChild(t);t.querySelector('.button').onclick=()=>{window.FM_APP?.openLessonById?.(topic);t.remove()};t.querySelector('.text-button').onclick=()=>t.remove();setTimeout(()=>t.remove(),12000);
}

/* ---------- data bank ---------- */
function calcItems(topic='all'){
 const out=[];Object.entries(CALC).forEach(([id,c])=>{if(topic!=='all'&&id!==topic)return;(c.practice||[]).forEach((p,i)=>{const ans=parseNum(p.ans);if(Number.isFinite(ans))out.push({topic:id,type:'numeric',q:p.q,answer:ans,answerText:p.ans,steps:p.steps||[],difficulty:i===0?1:i===1?2:3})})});return out;
}
const coreBank=[
 {topic:'radians',type:'mcq',difficulty:1,q:'One complete revolution is:',opts:['π/2 rad','π rad','2π rad','4π rad'],correct:2},
 {topic:'centripetal-force',type:'mcq',difficulty:2,q:'At fixed mass and radius, doubling speed changes centripetal force by a factor of:',opts:['2','4','1/2','8'],correct:1},
 {topic:'shm-condition',type:'mcq',difficulty:1,q:'The defining condition for SHM is:',opts:['a∝x','a∝−x','v∝−x','F constant'],correct:1},
 {topic:'damping',type:'mcq',difficulty:2,q:'Critical damping gives:',opts:['the largest oscillation','the fastest return without oscillation','constant amplitude','the slowest return'],correct:1},
 {topic:'resonance',type:'mcq',difficulty:2,q:'Resonance occurs when:',opts:['amplitude is zero','drive frequency is near natural frequency','damping is maximum','speed is constant'],correct:1},
 {topic:'internal-energy',type:'mcq',difficulty:1,q:'Internal energy is the sum of:',opts:['heat and temperature','random particle KE and particle PE','work and power','mass and energy'],correct:1},
 {topic:'latent-heat',type:'mcq',difficulty:2,q:'During melting at constant temperature, supplied energy mainly increases:',opts:['mean random KE','particle potential-energy contribution','temperature','mass'],correct:1},
 {topic:'gas-laws',type:'mcq',difficulty:2,q:'Boyle’s law requires constant:',opts:['pressure','temperature','volume','density'],correct:1},
 {topic:'absolute-zero',type:'mcq',difficulty:1,q:'27°C is approximately:',opts:['246 K','273 K','300 K','327 K'],correct:2},
 {topic:'ideal-gas-molecules',type:'mcq',difficulty:2,q:'The relation connecting R and k is:',opts:['R=k/Nₐ','R=Nₐk','R=Nₐ/k','R=kT'],correct:1},
 {topic:'kinetic-assumptions',type:'mcq',difficulty:3,q:'The factor 1/3 in kinetic theory arises from:',opts:['one third of molecules colliding','three-dimensional isotropic motion','three walls','three gas laws'],correct:1},
 {topic:'molecular-ke',type:'mcq',difficulty:3,q:'At the same temperature, two ideal gases have the same:',opts:['rms speed','molecular mass','mean translational KE per molecule','pressure in every container'],correct:2}
];
function lessonBank(){
 const answerPool=DATA.lessons.flatMap(l=>(l.retrieval||[]).map(q=>q[1])).filter(Boolean);
 const bank=[];
 DATA.lessons.forEach((l,li)=>{
   if(l.check&&l.check.length>=4)bank.push({topic:l.id,type:'mcq',difficulty:2,q:l.check[0],opts:l.check[1],correct:l.check[2]});
   const addSet=(set,diff,offset)=>{
     (set||[]).forEach((q,qi)=>{
       const distract=answerPool.filter(a=>a!==q[1]).filter((a,i)=>((i+li*3+qi*5+offset)%17)<3).slice(0,3);
       let guard=0;
       while(distract.length<3&&guard<answerPool.length*2){
         const a=answerPool[(li*11+qi*7+distract.length*13+offset+guard)%answerPool.length];
         if(a&&a!==q[1]&&!distract.includes(a))distract.push(a); guard++;
       }
       const opts=[q[1],...distract.slice(0,3)].sort(()=>Math.random()-.5);
       bank.push({topic:l.id,type:'mcq',difficulty:diff,q:q[0],opts,correct:opts.indexOf(q[1])});
     });
   };
   addSet(l.retrieval,1,0);
   addSet(TEXTBOOK[l.id]?.retrieval,2,7);
 });
 return bank;
}
const dataQuestions=[
 {topic:'spring',type:'numeric',difficulty:3,q:'A T²–m graph has gradient 2.20 s² kg⁻¹. Calculate k.',answer:4*Math.PI*Math.PI/2.20,unit:'N m⁻¹',method:'k=4π²/gradient'},
 {topic:'pendulum',type:'numeric',difficulty:3,q:'A T²–L graph has gradient 4.12 s² m⁻¹. Calculate g.',answer:4*Math.PI*Math.PI/4.12,unit:'m s⁻²',method:'g=4π²/gradient'},
 {topic:'specific-heat',type:'numeric',difficulty:3,q:'A 60 W heater warms 0.50 kg by 18 K in 240 s. Ignore losses. Calculate c.',answer:60*240/(.5*18),unit:'J kg⁻¹ K⁻¹',method:'Pt=mcΔT'},
 {topic:'rp8-boyle',type:'numeric',difficulty:3,q:'For a gas, p=150 kPa at V=56 cm³. Predict p at 42 cm³ if T is constant.',answer:150*56/42,unit:'kPa',method:'p₁V₁=p₂V₂'},
 {topic:'kinetic-assumptions',type:'numeric',difficulty:4,q:'A gas has density 1.15 kg m⁻³ and rms speed 480 m s⁻¹. Calculate p.',answer:1.15*480*480/3,unit:'Pa',method:'p=(1/3)ρcᵣₘₛ²'}
];
function diagnose(user,ans){
 const ratio=Math.abs(user/ans);
 if(!Number.isFinite(user))return 'No numerical answer entered.';
 if(Math.abs(user+ans)<=Math.max(Math.abs(ans)*.02,1e-12))return 'Likely sign/direction error.';
 if([1000,1/1000].some(f=>Math.abs(ratio-f)<.03*Math.abs(f)))return 'Likely kilo/base-unit conversion error (for example kPa ↔ Pa or g ↔ kg).';
 if([1e6,1e-6].some(f=>Math.abs(ratio-f)<.05*Math.abs(f)))return 'Likely cm³ ↔ m³ conversion error.';
 if([100,1/100].some(f=>Math.abs(ratio-f)<.04*Math.abs(f)))return 'Likely percentage/factor-of-100 error.';
 if(ratio>.5&&ratio<2)return 'Equation choice is probably close; check rearrangement, substitution and arithmetic.';
 return 'Check equation choice first, then SI units and powers of ten.';
}

/* ---------- suite mode ---------- */
const modes=window.FM_MASTERY_MODES=window.FM_MASTERY_MODES||{};
let suiteTab='assessment';
const tabs=[['assessment','Assess'],['skills','Maths skills'],['papers','Paper builder'],['teacher','Teacher tools'],['progress','Progress & export'],['spec','Spec report']];
function ensureSuiteOption(){
 const sel=$('#masteryMode');if(sel&&!sel.querySelector('option[value="classroom"]'))sel.insertAdjacentHTML('beforeend','<option value="classroom">Classroom Suite</option>');
}
modes.classroom=renderSuite;
function renderSuite(){
 const h=$('#masteryPanel');if(!h)return;
 h.innerHTML=`<div class="classroom-shell"><div class="suite-tabs">${tabs.map(t=>`<button class="tool-chip ${suiteTab===t[0]?'active':''}" data-suite="${t[0]}">${t[1]}</button>`).join('')}</div><div id="suiteBody"></div></div>`;
 $$('[data-suite]').forEach(b=>b.onclick=()=>{suiteTab=b.dataset.suite;renderSuite()});
 ({assessment:renderAssessment,skills:renderSkills,papers:renderPapers,teacher:renderTeacherTools,progress:renderProgressTools,spec:renderSpecReport}[suiteTab]||renderAssessment)();
}

/* ---------- assessments ---------- */
let test=null,timerHandle=null;
function buildTest(count=12,topic='all',maxDiff=4){
 let bank=[...coreBank,...lessonBank(),...calcItems(),...dataQuestions].filter(x=>(topic==='all'||x.topic===topic)&&x.difficulty<=maxDiff);
 bank=bank.sort(()=>Math.random()-.5); return bank.slice(0,Math.min(count,bank.length));
}
function renderAssessment(){
 const b=$('#suiteBody'); if(!test){b.innerHTML=`<div class="suite-grid"><article class="panel pad"><span class="eyebrow">Full assessment mode</span><h3>Build a timed topic test</h3><label class="field"><span>Topic</span><select id="testTopic"><option value="all">Mixed 3.6</option>${DATA.lessons.map(l=>`<option value="${l.id}">${l.code} · ${safe(l.title)}</option>`).join('')}</select></label><label class="field"><span>Questions (up to available bank)</span><input id="testCount" type="range" min="6" max="20" value="12"><output id="testCountOut">12</output></label><label class="field"><span>Maximum difficulty</span><select id="testDiff"><option value="1">1 · core recall</option><option value="2">2 · standard A-level</option><option value="3" selected>3 · multi-step/data</option><option value="4">4 · A* / unfamiliar</option></select></label><label class="field"><span>Time limit</span><select id="testTime"><option value="0">Untimed</option><option value="10">10 min</option><option value="20" selected>20 min</option><option value="30">30 min</option></select></label><button class="button primary" id="startTest">Start assessment</button></article><aside class="panel pad"><h3>Mastery rule</h3><p>A topic is marked <strong>secure</strong> only after at least 3 successful attempts in the latest 4 recorded attempts. One lucky correct answer is not enough.</p><p>Tests report results by specification topic and question difficulty.</p></aside></div>`;$('#testCount').oninput=e=>$('#testCountOut').textContent=e.target.value;$('#startTest').onclick=()=>startTest(+$('#testCount').value,$('#testTopic').value,+$('#testDiff').value,+$('#testTime').value);return}
 renderTest();
}
function startTest(count,topic,diff,mins){
 test={items:buildTest(count,topic,diff),answers:{},started:Date.now(),ends:mins?Date.now()+mins*60000:0,index:0,finished:false};renderAssessment();if(mins){timerHandle=setInterval(()=>{if(!test||test.finished)return;const rem=Math.max(0,test.ends-Date.now());const el=$('#testTimer');if(el)el.textContent=Math.ceil(rem/1000)+' s';if(rem<=0){clearInterval(timerHandle);finishTest()}},1000)}
}
function renderTest(){
 const b=$('#suiteBody');if(test.finished)return renderTestResults();const q=test.items[test.index],a=test.answers[test.index];
 b.innerHTML=`<article class="panel pad test-card"><div class="section-mini"><span class="eyebrow">${safe(lessonName(q.topic))} · difficulty ${q.difficulty}</span><strong id="testTimer">${test.ends?Math.max(0,Math.ceil((test.ends-Date.now())/1000))+' s':'Untimed'}</strong></div><div class="progress-track"><div class="progress-fill" style="width:${(test.index+1)/test.items.length*100}%"></div></div><h3>${test.index+1}. ${q.q}</h3>${q.type==='mcq'?`<div class="choice-list">${q.opts.map((o,i)=>`<button class="choice-button ${a===i?'selected-answer':''}" data-test-choice="${i}">${o}</button>`).join('')}</div>`:`<div class="workspace-answer-row"><input id="testNumeric" type="number" step="any" value="${a??''}" placeholder="Numerical answer"><span>${q.unit||''}</span></div>`}<div class="hint-ladder"><button class="text-button" data-hint="1">Hint 1</button><button class="text-button" data-hint="2">Hint 2</button><button class="text-button" data-hint="3">Hint 3</button><span id="testHint"></span></div><div class="button-row"><button class="button" id="prevTest" ${test.index===0?'disabled':''}>Previous</button><button class="button" id="nextTest">${test.index===test.items.length-1?'Review':'Next'}</button><button class="button primary" id="finishTest">Finish & mark</button></div></article>`;
 $$('[data-test-choice]').forEach(btn=>btn.onclick=()=>{test.answers[test.index]=+btn.dataset.testChoice;renderTest()});
 $('#testNumeric')?.addEventListener('input',e=>test.answers[test.index]=e.target.value);
 $('#prevTest').onclick=()=>{captureTestAnswer();test.index--;renderTest()};
 $('#nextTest').onclick=()=>{captureTestAnswer();if(test.index<test.items.length-1)test.index++;else test.index=0;renderTest()};
 $('#finishTest').onclick=()=>{captureTestAnswer();finishTest()};
 $$('[data-hint]').forEach(btn=>btn.onclick=()=>{const lvl=+btn.dataset.hint,steps=q.steps||[q.method||'Identify the governing relationship.','Rearrange before substituting.','Check SI units and significant figures.'];$('#testHint').textContent=steps.slice(0,lvl).join(' → ')});
}
function captureTestAnswer(){const el=$('#testNumeric');if(el)test.answers[test.index]=el.value}
function finishTest(){
 if(!test||test.finished)return;clearInterval(timerHandle);test.finished=true;test.results=test.items.map((q,i)=>{const u=test.answers[i];let ok=false;if(q.type==='mcq')ok=+u===q.correct;else{const n=+u;ok=Number.isFinite(n)&&Math.abs(n-q.answer)<=Math.max(Math.abs(q.answer)*.025,1e-10)};window.FM_MASTERY?.result?.(q.type==='numeric'?'calculations':'explanations',q.topic,ok,'assessment',ok?8:1);return{q,u,ok,diagnosis:q.type==='numeric'&&!ok?diagnose(+u,q.answer):''}});suite.tests.unshift({date:new Date().toISOString(),profile:activeId,results:test.results.map(r=>({topic:r.q.topic,ok:r.ok,difficulty:r.q.difficulty}))});suite.tests=suite.tests.slice(0,20);saveSuite();renderTestResults();
}
function renderTestResults(){
 const b=$('#suiteBody'),rs=test.results,score=rs.filter(r=>r.ok).length,by={};rs.forEach(r=>{by[r.q.topic]=by[r.q.topic]||[0,0];by[r.q.topic][1]++;if(r.ok)by[r.q.topic][0]++});
 b.innerHTML=`<div class="suite-grid"><article class="panel pad"><span class="eyebrow">Assessment result</span><h2>${score}/${rs.length}</h2><div class="heat-grid">${Object.entries(by).map(([k,v])=>`<div class="heat-cell"><strong>${safe(lessonName(k))}</strong><span>${v[0]}/${v[1]}</span></div>`).join('')}</div><button class="button primary" id="newTest">New assessment</button></article><article class="panel pad"><h3>Error analysis</h3>${rs.filter(r=>!r.ok).map(r=>`<div class="error-card"><strong>${r.q.q}</strong><p>${r.q.type==='mcq'?'Revisit the underlying concept.':r.diagnosis}</p>${r.q.type==='numeric'?`<small>Expected about ${fmt(r.q.answer)} ${r.q.unit||''}</small>`:''}</div>`).join('')||'<p>All questions correct.</p>'}</article></div>`;$('#newTest').onclick=()=>{test=null;renderAssessment()};
}

/* ---------- maths skills ---------- */
let skillTab='formula';
const unitQs=[
 ['Convert 3.5 kPa to Pa',3500,'Pa'],['Convert 250 cm³ to m³',250e-6,'m³'],['Convert 45 g to kg',.045,'kg'],['Convert 27°C to K',300.15,'K'],['Convert 2.4 dm³ to m³',2.4e-3,'m³']
];
const sfQs=[[12.486,3,12.5],[0.003746,2,0.0037],[98560,3,98600],[6.022e23,4,6.022e23]];
function renderSkills(){
 const b=$('#suiteBody');b.innerHTML=`<div class="suite-tabs sub">${[['formula','Formula memory'],['units','Units'],['sigfig','Significant figures'],['datasheet','Data sheet'],['uncertainty','Uncertainty lab']].map(t=>`<button class="tool-chip ${skillTab===t[0]?'active':''}" data-skilltab="${t[0]}">${t[1]}</button>`).join('')}</div><div id="skillBody"></div>`;$$('[data-skilltab]').forEach(x=>x.onclick=()=>{skillTab=x.dataset.skilltab;renderSkills()});
 if(skillTab==='formula')renderFormulaMemory();if(skillTab==='units')renderUnits();if(skillTab==='sigfig')renderSigFigs();if(skillTab==='datasheet')renderDatasheet();if(skillTab==='uncertainty')renderUncertainty();
}
function equationList(){const arr=[];Object.entries(CALC).forEach(([topic,c])=>(c.equations||[]).forEach(e=>arr.push({topic,...e})));return arr}
function renderFormulaMemory(){
 const e=equationList()[Math.floor(Math.random()*equationList().length)];$('#skillBody').innerHTML=`<article class="panel pad"><span class="eyebrow">Formula from memory</span><h3>${safe(e.name)}</h3><p>${safe(e.meaning)}</p><input id="formulaRecall" class="wide-input" placeholder="Write the equation from memory"><div class="button-row"><button class="button primary" id="revealFormula">Reveal & self-check</button><button class="button" id="nextFormula">Another</button></div><div id="formulaReveal"></div></article>`;$('#revealFormula').onclick=()=>$('#formulaReveal').innerHTML=`<div class="workspace-feedback"><strong>${safe(e.eq)}</strong><p>${safe(e.symbols)}</p><p><em>${safe(e.sheet)}</em></p></div>`;$('#nextFormula').onclick=renderFormulaMemory;
}
function renderUnits(){
 const q=unitQs[Math.floor(Math.random()*unitQs.length)];$('#skillBody').innerHTML=`<article class="panel pad"><span class="eyebrow">Units trainer</span><h3>${q[0]}</h3><div class="workspace-answer-row"><input id="unitAns" type="number" step="any"><span>${q[2]}</span><button class="button primary" id="unitCheck">Check</button></div><div id="unitFb"></div></article>`;$('#unitCheck').onclick=()=>{const v=+$('#unitAns').value,ok=Math.abs(v-q[1])<=Math.max(Math.abs(q[1])*.002,1e-12);$('#unitFb').className='workspace-feedback '+(ok?'good':'bad');$('#unitFb').textContent=ok?'Correct.':'Not yet. Check prefixes and powers of ten.'};
}
function renderSigFigs(){
 const q=sfQs[Math.floor(Math.random()*sfQs.length)];$('#skillBody').innerHTML=`<article class="panel pad"><span class="eyebrow">Significant figures</span><h3>Round ${q[0]} to ${q[1]} significant figures.</h3><div class="workspace-answer-row"><input id="sfAns" type="number" step="any"><button class="button primary" id="sfCheck">Check</button></div><div id="sfFb"></div></article>`;$('#sfCheck').onclick=()=>{const v=+$('#sfAns').value,ok=Math.abs(v-q[2])<=Math.max(Math.abs(q[2])*1e-8,1e-12);$('#sfFb').className='workspace-feedback '+(ok?'good':'bad');$('#sfFb').textContent=ok?'Correct.':'Check which digit controls the rounding.'};
}
function renderDatasheet(){
 const es=equationList();$('#skillBody').innerHTML=`<div class="panel pad"><span class="eyebrow">AQA data-sheet familiarisation</span><h3>Provided, derived or prior knowledge?</h3><div class="datasheet-grid">${es.map(e=>`<article><strong>${safe(e.eq)}</strong><span>${safe(e.name)}</span><small>${safe(e.sheet)}</small></article>`).join('')}</div><p class="muted">Use this to distinguish equations explicitly identified as AQA data-sheet relationships from equations derived in the lessons or carried forward from earlier mechanics/electricity.</p></div>`;
}
function renderUncertainty(){
 const xs=[.2,.4,.6,.8,1.0],trueGrad=4.05,ys=xs.map(x=>trueGrad*x+(Math.random()-.5)*.08),uY=.06;
 const meanGrad=xs.reduce((sum,x,i)=>sum+x*ys[i],0)/xs.reduce((sum,x)=>sum+x*x,0);
 const steep=Math.max(...xs.map((x,i)=>(ys[i]+uY)/x)),shallow=Math.min(...xs.map((x,i)=>(ys[i]-uY)/x));
 const gradU=Math.abs(steep-shallow)/2,pct=gradU/meanGrad*100;
 $('#skillBody').innerHTML=`<div class="suite-grid"><article class="panel pad"><span class="eyebrow">Practical uncertainty simulator</span><h3>Gradient uncertainty from error bars</h3><p>These could represent a pendulum T²–L data set. Each y-value has uncertainty ±${uY.toFixed(2)} s².</p><canvas id="uncCanvas" class="trainer-canvas"></canvas><div class="data-mini-table">${xs.map((x,i)=>`<div><span>L=${x.toFixed(2)} m</span><strong>T²=${ys[i].toFixed(2)}±${uY.toFixed(2)}</strong></div>`).join('')}</div></article><aside class="panel pad"><h3>Your analysis</h3><p>Estimate percentage uncertainty in the gradient from steepest and shallowest acceptable lines.</p><div class="workspace-answer-row"><input id="uncAns" type="number" step="any"><span>%</span><button class="button primary" id="uncCheck">Check</button></div><div id="uncFb"></div><details><summary>Method</summary><p>gradient uncertainty ≈ (steepest − shallowest)/2; percentage uncertainty = gradient uncertainty / best gradient ×100.</p></details></aside></div>`;
 setTimeout(()=>drawUncertaintyCanvas(xs,ys,uY,meanGrad,steep,shallow),20);
 $('#uncCheck').onclick=()=>{const v=+$('#uncAns').value,ok=Math.abs(v-pct)<.8;$('#uncFb').className='workspace-feedback '+(ok?'good':'bad');$('#uncFb').innerHTML=ok?'Correct.':`Expected about ${pct.toFixed(1)}%. Best gradient ≈ ${meanGrad.toFixed(2)}, uncertainty ≈ ±${gradU.toFixed(2)}.`};
}
function drawUncertaintyCanvas(xs,ys,uY,m,steep,shallow){
 const c=$('#uncCanvas');if(!c)return;const r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=Math.max(1,r.width*d);c.height=300*d;const g=c.getContext('2d');g.setTransform(d,0,0,d,0,0);const w=r.width,h=300,p=42,xmin=0,xmax=1.05,ymin=0,ymax=Math.max(...ys)+.35,px=x=>p+(x-xmin)/(xmax-xmin)*(w-p-15),py=y=>h-p-(y-ymin)/(ymax-ymin)*(h-p-20);g.fillStyle='#06111d';g.fillRect(0,0,w,h);g.strokeStyle='#607d94';g.beginPath();g.moveTo(p,15);g.lineTo(p,h-p);g.lineTo(w-10,h-p);g.stroke();xs.forEach((x,i)=>{const xx=px(x),yy=py(ys[i]),yt=py(ys[i]+uY),yb=py(ys[i]-uY);g.strokeStyle='#9eb2c8';g.beginPath();g.moveTo(xx,yt);g.lineTo(xx,yb);g.moveTo(xx-5,yt);g.lineTo(xx+5,yt);g.moveTo(xx-5,yb);g.lineTo(xx+5,yb);g.stroke();g.fillStyle='#67c7ff';g.beginPath();g.arc(xx,yy,5,0,Math.PI*2);g.fill()});[[m,'#63d9a4'],[steep,'#ffd56a'],[shallow,'#ff7b87']].forEach(q=>{g.strokeStyle=q[1];g.lineWidth=2;g.beginPath();g.moveTo(px(0),py(0));g.lineTo(px(1),py(q[0]));g.stroke()});g.fillStyle='#9eb2c8';g.font='11px system-ui';g.fillText('L / m',w-52,h-12);g.fillText('T² / s²',p+5,26);
}

/* ---------- paper builder + worksheet ---------- */
function renderPapers(){
 const b=$('#suiteBody');b.innerHTML=`<div class="suite-grid"><article class="panel pad"><span class="eyebrow">Exam-paper builder</span><h3>Generate a custom paper</h3><label class="field"><span>Topic</span><select id="paperTopic"><option value="all">Mixed 3.6</option><option value="mechanics">Further Mechanics only</option><option value="thermal">Thermal Physics only</option></select></label><label class="field"><span>Questions</span><input id="paperCount" type="number" min="5" max="30" value="12"></label><label class="field"><span>Difficulty</span><select id="paperDiff"><option value="2">Core + standard</option><option value="3" selected>Include data/multi-step</option><option value="4">Include A* challenge</option></select></label><button class="button primary" id="makePaper">Generate printable paper</button><div id="paperPreview"></div></article><article class="panel pad"><span class="eyebrow">Printable lesson resource</span><h3>Lesson / practical worksheet</h3><select id="worksheetLesson">${DATA.lessons.map(l=>`<option value="${l.id}">${l.code} · ${safe(l.title)}</option>`).join('')}</select><div class="button-row"><button class="button" id="printLessonSheet">Lesson worksheet</button><button class="button" id="printPracticalSheet">Practical/data worksheet</button></div></article></div>`;
 $('#makePaper').onclick=()=>makePaper($('#paperTopic').value,+$('#paperCount').value,+$('#paperDiff').value);
 $('#printLessonSheet').onclick=()=>printWorksheet($('#worksheetLesson').value,false);
 $('#printPracticalSheet').onclick=()=>printWorksheet($('#worksheetLesson').value,true);
}
function paperTopicMatch(item,filter){if(filter==='all')return true;const l=DATA.lessons.find(x=>x.id===item.topic);return filter==='mechanics'?l?.code?.startsWith('3.6.1'):l?.code?.startsWith('3.6.2')}
function makePaper(filter,count,diff){
 let bank=[...coreBank,...lessonBank(),...calcItems(),...dataQuestions].filter(q=>paperTopicMatch(q,filter)&&q.difficulty<=diff).sort(()=>Math.random()-.5).slice(0,count);suite.paperCounter++;saveSuite();
 const html=`<div class="paper-print"><h1>AQA 3.6 Further Mechanics & Thermal Physics</h1><p>Custom practice paper ${suite.paperCounter}</p>${bank.map((q,i)=>`<section><h3>${i+1}. ${safe(q.q)}</h3>${q.type==='mcq'?`<ol type="A">${q.opts.map(o=>`<li>${safe(o)}</li>`).join('')}</ol>`:''}<div class="answer-lines"></div></section>`).join('')}<hr><h2>Answer / marking guide</h2>${bank.map((q,i)=>`<p><strong>${i+1}.</strong> ${q.type==='mcq'?safe(q.opts[q.correct]):safe(q.answerText||`${fmt(q.answer)} ${q.unit||''}`)}</p>`).join('')}</div>`;
 openPrint(html);
}
function printWorksheet(id,practical){
 const l=DATA.lessons.find(x=>x.id===id),ch=TEXTBOOK[id]||{},calc=CALC[id]||{};
 const html=`<div class="paper-print"><h1>${safe(l.code)} · ${safe(l.title)}</h1><p>${safe(l.lead)}</p><h2>Key ideas</h2><ul>${(ch.keyIdeas||[]).map(x=>`<li>${safe(x)}</li>`).join('')}</ul>${practical?'<h2>Practical / data analysis</h2><p>Identify the independent, dependent and control variables. Record repeated readings, calculate a mean, choose an appropriate graph and evaluate uncertainty.</p>':'<h2>Retrieval</h2>'}${(ch.retrieval||[]).map((q,i)=>`<p><strong>${i+1}. ${safe(q[0])}</strong></p><div class="answer-lines"></div>`).join('')}<h2>Calculation practice</h2>${(calc.practice||[]).slice(0,4).map((q,i)=>`<p><strong>${i+1}. ${safe(q.q)}</strong></p><div class="answer-lines"></div>`).join('')}<h2>Exam response</h2><p>${safe(l.exit)}</p><div class="answer-lines tall"></div></div>`;openPrint(html);
}
function openPrint(html){
 const o=document.createElement('div');o.className='print-overlay';o.innerHTML=`<div class="print-toolbar"><button class="button primary">Print / Save as PDF</button><button class="button">Close</button></div>${html}`;document.body.appendChild(o);o.querySelector('.button.primary').onclick=()=>window.print();o.querySelectorAll('.button')[1].onclick=()=>o.remove();
}

/* ---------- teacher tools ---------- */
function renderTeacherTools(){
 const id=currentLesson(),note=suite.teacherNotes[id]||'';
 $('#suiteBody').innerHTML=`<div class="suite-grid"><article class="panel pad"><span class="eyebrow">Teacher notes</span><h3>${safe(lessonName(id))}</h3><textarea id="teacherNoteText" class="student-answer tall-answer" placeholder="Class-specific prompts, examples, misconceptions, homework...">${safe(note)}</textarea><button class="button primary" id="saveTeacherNote">Save note</button></article><article class="panel pad"><span class="eyebrow">Freeze & annotate</span><h3>Simulation teaching tools</h3><p>Open the Simulation Lab and use Freeze & annotate to draw directly over the paused model. Fullscreen classroom mode enlarges the lab for projection.</p><div class="button-row"><button class="button" id="openSimTeach">Open simulations</button><button class="button" id="reportBug">Create bug report file</button></div></article></div>`;
 $('#saveTeacherNote').onclick=()=>{suite.teacherNotes[id]=$('#teacherNoteText').value;saveSuite();$('#saveTeacherNote').textContent='Saved ✓';setTimeout(()=>$('#saveTeacherNote').textContent='Save note',800)};
 $('#openSimTeach').onclick=()=>window.FM_APP?.openView?.('lab');
 $('#reportBug').onclick=createBugReport;
}

/* ---------- progress export/import ---------- */
function progressCSV(){
 const m=window.FM_MASTERY?.state||{},completed=load('fm36-completed',[]);let rows=[['Profile',activeProfile()?.name||''],['Exported',new Date().toISOString()],[],['Lesson','Complete','Mastery signal']];
 DATA.lessons.forEach(l=>rows.push([l.code+' '+l.title,completed.includes(l.id)?'Yes':'No',secureStatus(l.id).secure?'Secure':`${secureStatus(l.id).wins}/${secureStatus(l.id).attempts} recent`]));
 rows.push([],['Skill','Score']);Object.entries(m.skills||{}).forEach(([k,v])=>rows.push([k,v]));return rows.map(r=>r.map(v=>`"${String(v??'').replace(/"/g,'""')}"`).join(',')).join('\n');
}
function exportProgressJSON(){
 snapshotCurrentProfile();const payload={version:9,profile:activeProfile(),suite,exported:new Date().toISOString()};download('further-mechanics-progress.json',JSON.stringify(payload,null,2));
}
function renderProgressTools(){
 $('#suiteBody').innerHTML=`<div class="suite-grid"><article class="panel pad"><span class="eyebrow">Progress export</span><h3>Move or archive student progress</h3><div class="button-row"><button class="button" id="exportCSV">Export CSV</button><button class="button" id="exportJSON">Export progress file</button><button class="button" id="printProgress">Print / Save PDF report</button></div><label class="field"><span>Import progress file</span><input id="importProgress" type="file" accept=".json,application/json"></label></article><article class="panel pad"><h3>Mastery security</h3><div class="heat-grid">${DATA.lessons.map(l=>{const s=secureStatus(l.id);return`<div class="heat-cell ${s.secure?'secure-cell':''}"><strong>${safe(l.title)}</strong><span>${s.secure?'Secure':`${s.wins}/${s.attempts} recent success`}</span></div>`}).join('')}</div></article></div>`;
 $('#exportCSV').onclick=()=>download('further-mechanics-progress.csv',progressCSV(),'text/csv');
 $('#exportJSON').onclick=exportProgressJSON;
 $('#printProgress').onclick=()=>openPrint(`<div class="paper-print"><h1>Further Mechanics & Thermal Physics Progress</h1><p>${safe(activeProfile()?.name||'Student')}</p><pre class="report-pre">${safe(progressCSV())}</pre></div>`);
 $('#importProgress').onchange=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=()=>{try{const data=JSON.parse(r.result);if(data.profile?.snapshot){snapshotCurrentProfile();const p=activeProfile();p.snapshot=data.profile.snapshot;save(PROFILE_KEY,profiles);suite=data.suite||suite;saveSuite();restoreProfile(activeId)}else alert('Progress file not recognised.')}catch{alert('Could not read progress file.')}};r.readAsText(file)};
}

/* ---------- spec report + dependencies + retrieval calendar ---------- */
const deps={
 'centripetal-accel':['radians'],'centripetal-force':['centripetal-accel'],'shm-condition':['radians'],'shm-graphs':['shm-condition'],'shm-extremes':['shm-graphs'],'spring':['shm-condition'],'pendulum':['shm-condition'],'shm-energy':['shm-extremes'],'damping':['shm-energy'],'resonance':['damping'],
 'specific-heat':['internal-energy'],'continuous-flow':['specific-heat'],'latent-heat':['internal-energy'],'gas-laws':['absolute-zero'],'ideal-gas-moles':['gas-laws','absolute-zero'],'ideal-gas-molecules':['ideal-gas-moles'],'rp8-boyle':['gas-laws'],'rp8-charles':['gas-laws','absolute-zero'],'brownian-model':['gas-laws'],'kinetic-assumptions':['brownian-model'],'molecular-ke':['kinetic-assumptions','ideal-gas-molecules']
};
function renderSpecReport(){
 const completed=load('fm36-completed',[]),reviews=window.FM_MASTERY?.reviews?.()||[];$('#suiteBody').innerHTML=`<div class="panel pad"><span class="eyebrow">Specification completion report</span><h3>Where every AQA 3.6 lesson is taught, practised and assessed</h3><div class="spec-report-table"><table><thead><tr><th>Topic</th><th>Taught</th><th>Equations</th><th>Simulation</th><th>Assessment</th><th>Status</th></tr></thead><tbody>${DATA.lessons.map(l=>`<tr><td><strong>${safe(l.code)}</strong> ${safe(l.title)}</td><td>${TEXTBOOK[l.id]?'✓':'—'}</td><td>${(CALC[l.id]?.equations||[]).length}</td><td>${l.sim?safe(l.sim):'—'}</td><td>${[...coreBank,...lessonBank(),...calcItems(),...dataQuestions].filter(q=>q.topic===l.id).length} items</td><td>${completed.includes(l.id)?(secureStatus(l.id).secure?'Secure':'Complete / developing'):'Not complete'}</td></tr>`).join('')}</tbody></table></div><h3>Topic dependency map</h3><div class="dependency-grid">${DATA.lessons.map(l=>`<article><strong>${safe(l.title)}</strong><span>${(deps[l.id]||[]).length?'Prerequisite: '+(deps[l.id]||[]).map(lessonName).join(', '):'Starting topic'}</span></article>`).join('')}</div><h3>Spaced retrieval calendar</h3><div class="review-calendar">${reviews.slice().sort((a,b)=>a.due-b.due).slice(0,20).map(r=>`<div><strong>${safe(lessonName(r.topic))}</strong><span>${new Date(r.due).toLocaleDateString()}</span></div>`).join('')||'<p class="muted">No scheduled reviews yet.</p>'}</div></div>`;
}

/* ---------- end-of-lesson mastery button ---------- */
function injectLessonMastery(){
 const actions=$('.lesson-actions');if(!actions||actions.querySelector('[data-lesson-mastery]'))return;
 const b=document.createElement('button');b.className='button';b.dataset.lessonMastery='1';b.textContent='6-question mastery check';b.onclick=()=>{const id=currentLesson();window.FM_APP?.openView?.('mastery');setTimeout(()=>{ensureSuiteOption();const sel=$('#masteryMode');if(sel){sel.value='classroom';suiteTab='assessment';renderSuite();setTimeout(()=>{test=null;startTest(6,id,3,0)},10)}},20)};actions.prepend(b);
}
new MutationObserver(()=>injectLessonMastery()).observe(document.body,{childList:true,subtree:true});

/* ---------- sim presets / compare / annotate / fullscreen ---------- */
const presets={
 circular:[['Slow orbit',{omega:1,radius:1.5}],['High acceleration',{omega:5,radius:.6}]],
 shm:[['Clear phase',{freq:1,amp:.12}],['Fast SHM',{freq:3,amp:.08}]],
 spring:[['Soft spring',{springK:10,mass:.4}],['Stiff spring',{springK:35,mass:.4}]],
 pendulum:[['Small angle',{angle:5,length:.8}],['Large-angle contrast',{angle:20,length:.8}]],
 damping:[['Light damping',{damp:.08}],['Near critical demo',{damp:.55}]],
 resonance:[['Sharp resonance',{damp:.08,drive:2,natural:2}],['Damped resonance',{damp:.45,drive:2,natural:2}]],
 gasLaws:[['Boyle conditions',{temp:300,amount:1,volume:80}],['Compressed',{temp:300,amount:1,volume:40}]],
 heatingCurve:[['Melting plateau',{energy:27}],['Boiling plateau',{energy:80}]]
};
function initSimTeaching(){
 const vc=$('.viewer-controls');if(!vc)return;
 const freeze=document.createElement('button');freeze.className='button';freeze.id='freezeAnnotate';freeze.textContent='Freeze & annotate';
 const fs=document.createElement('button');fs.className='button';fs.id='classroomFullscreen';fs.textContent='Fullscreen';
 vc.append(freeze,fs);
 const side=$('.lab-side');if(side){const p=document.createElement('article');p.className='panel learning-box';p.innerHTML='<h3>Quick presets</h3><div id="simPresets" class="button-row"></div>';side.prepend(p)}
 window.addEventListener('fm-sim-switched',renderPresets);setTimeout(renderPresets,100);
 freeze.onclick=toggleAnnotation;fs.onclick=()=>$('#view-lab')?.requestFullscreen?.();
 const tabs=$('.workspace-tabs');if(tabs&&!tabs.querySelector('[data-sim-compare]')){const c=document.createElement('button');c.className='tool-chip';c.dataset.simCompare='1';c.textContent='Compare';tabs.append(c);c.onclick=renderCompare}
}
function renderPresets(){
 const s=window.FM_SIM?.getState?.();if(!s)return;const h=$('#simPresets');if(!h)return;const ps=presets[s.id]||[];h.innerHTML=ps.map((p,i)=>`<button class="text-button" data-preset="${i}">${p[0]}</button>`).join('')||'<span class="muted small">Use the saved-start button to make your own preset.</span>';$$('[data-preset]',h).forEach(b=>b.onclick=()=>window.FM_SIM.setValues(ps[+b.dataset.preset][1]));
}
let annotation={active:false,canvas:null,ctx:null,drawing:false};
function toggleAnnotation(){
 if(!annotation.canvas){const wrap=$('.viewer-wrap');annotation.canvas=document.createElement('canvas');annotation.canvas.id='annotateCanvas';annotation.canvas.className='annotation-canvas';wrap.append(annotation.canvas);annotation.ctx=annotation.canvas.getContext('2d');resizeAnnotation();window.addEventListener('resize',resizeAnnotation);annotation.canvas.onpointerdown=e=>{annotation.drawing=true;const p=annoPos(e);annotation.ctx.beginPath();annotation.ctx.moveTo(p.x,p.y);annotation.canvas.setPointerCapture(e.pointerId)};annotation.canvas.onpointermove=e=>{if(!annotation.drawing)return;const p=annoPos(e);annotation.ctx.lineTo(p.x,p.y);annotation.ctx.strokeStyle='#ffd56a';annotation.ctx.lineWidth=3;annotation.ctx.lineCap='round';annotation.ctx.stroke()};annotation.canvas.onpointerup=()=>annotation.drawing=false}
 annotation.active=!annotation.active;annotation.canvas.style.pointerEvents=annotation.active?'auto':'none';annotation.canvas.style.opacity=annotation.active?'1':'0';window.FM_SIM?.setRunning?.(!annotation.active);$('#freezeAnnotate').textContent=annotation.active?'Resume model':'Freeze & annotate';
 if(annotation.active&&!$('#clearAnnotation')){const b=document.createElement('button');b.id='clearAnnotation';b.className='button';b.textContent='Clear drawing';$('.viewer-controls').append(b);b.onclick=()=>annotation.ctx.clearRect(0,0,annotation.canvas.width,annotation.canvas.height)}
}
function resizeAnnotation(){if(!annotation.canvas)return;const r=$('#simCanvas').getBoundingClientRect(),d=devicePixelRatio||1;annotation.canvas.width=r.width*d;annotation.canvas.height=r.height*d;annotation.canvas.style.width=r.width+'px';annotation.canvas.style.height=r.height+'px';annotation.ctx.setTransform(d,0,0,d,0,0)}
function annoPos(e){const r=annotation.canvas.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
function renderCompare(){
 const s=window.FM_SIM?.getState?.();if(!s)return;const defs=s.definition?.controls||[],ctrl=defs[0];if(!ctrl)return;
 const key=ctrl.k,base=s.values[key],min=ctrl.min,max=ctrl.max,step=ctrl.step,body=$('#simWorkspaceBody');
 body.innerHTML=`<div class="workspace-grid"><article class="workspace-card"><span class="eyebrow">Setup A</span><h3>${safe(s.title)}</h3><canvas id="compareCanvasA" class="compare-canvas"></canvas><label class="field"><span>${safe(ctrl.label)}</span><input id="compareA" type="range" min="${min}" max="${max}" step="${step}" value="${base}"><output id="compareAOut">${base}</output></label><div id="compareAStats"></div></article><article class="workspace-card"><span class="eyebrow">Setup B</span><h3>Change one variable</h3><canvas id="compareCanvasB" class="compare-canvas"></canvas><label class="field"><span>${safe(ctrl.label)}</span><input id="compareB" type="range" min="${min}" max="${max}" step="${step}" value="${Math.min(max,base+step*2)}"><output id="compareBOut"></output></label><div id="compareBStats"></div></article></div>`;
 let raf=0;
 function update(){const av=+$('#compareA').value,bv=+$('#compareB').value;$('#compareAOut').textContent=av;$('#compareBOut').textContent=bv;const va={...s.values,[key]:av},vb={...s.values,[key]:bv};$('#compareAStats').innerHTML=compareStats(s.id,va);$('#compareBStats').innerHTML=compareStats(s.id,vb);cancelAnimationFrame(raf);const start=performance.now();function frame(t){const ca=$('#compareCanvasA'),cb=$('#compareCanvasB');if(!ca||!cb||!ca.isConnected||!cb.isConnected)return;drawCompareCanvas(ca,s.id,va,(t-start)/1000);drawCompareCanvas(cb,s.id,vb,(t-start)/1000);raf=requestAnimationFrame(frame)}raf=requestAnimationFrame(frame)}
 $('#compareA').oninput=update;$('#compareB').oninput=update;update();
}
function drawCompareCanvas(c,id,v,t){
 if(!c)return;const r=c.getBoundingClientRect(),d=devicePixelRatio||1;if(c.width!==Math.round(r.width*d)){c.width=Math.round(r.width*d);c.height=150*d}const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);const w=r.width,h=150;x.fillStyle='#06111d';x.fillRect(0,0,w,h);x.strokeStyle='#355570';x.strokeRect(.5,.5,w-1,h-1);x.fillStyle='#9eb2c8';x.font='11px system-ui';
 if(id==='circular'){const cx=w/2,cy=77,Rp=Math.min(48,18+v.radius*14),ang=v.omega*t,px=cx+Rp*Math.cos(ang),py=cy+Rp*Math.sin(ang);x.strokeStyle='#4f7a98';x.beginPath();x.arc(cx,cy,Rp,0,Math.PI*2);x.stroke();x.fillStyle='#ffd56a';x.beginPath();x.arc(px,py,7,0,Math.PI*2);x.fill()}
 else if(['shm','shmEnergy','damping'].includes(id)){const f=v.freq||1,A=(v.amp||.1)*(id==='damping'?Math.exp(-(v.damp||.1)*t):1),pos=Math.cos(2*Math.PI*f*t)*A/(v.amp||.1);x.strokeStyle='#7890a8';x.beginPath();x.moveTo(25,78);x.lineTo(w-25,78);x.stroke();x.fillStyle='#67c7ff';x.fillRect(w/2+pos*(w*.33)-18,62,36,32)}
 else if(id==='spring'){const om=Math.sqrt(v.springK/v.mass),pos=Math.cos(om*t);x.strokeStyle='#cbd9e4';x.beginPath();x.moveTo(w/2,15);for(let i=1;i<12;i++)x.lineTo(w/2+(i%2?14:-14),18+i*(70+pos*18)/12);x.stroke();x.fillStyle='#67c7ff';x.fillRect(w/2-24,88+pos*18,48,34)}
 else if(id==='pendulum'){const th=(v.angle*Math.PI/180)*Math.cos(Math.sqrt(9.81/v.length)*t),L=70,cx=w/2,cy=20,bx=cx+L*Math.sin(th),by=cy+L*Math.cos(th);x.strokeStyle='#dce5ed';x.beginPath();x.moveTo(cx,cy);x.lineTo(bx,by);x.stroke();x.fillStyle='#ffd56a';x.beginPath();x.arc(bx,by,9,0,Math.PI*2);x.fill()}
 else if(id==='resonance'){const ratio=v.drive/v.natural,A=1/Math.sqrt((1-ratio*ratio)**2+(2*v.damp*ratio)**2),pos=Math.sin(2*Math.PI*v.drive*t)*Math.min(1,A/5);x.strokeStyle='#7890a8';x.beginPath();x.moveTo(20,75);x.lineTo(w-20,75);x.stroke();x.fillStyle='#67c7ff';x.fillRect(w/2+pos*w*.32-15,60,30,30)}
 else if(['gasLaws','idealGas','boylePractical','charlesPractical'].includes(id)){const frac=id==='charlesPractical'?Math.max(.15,Math.min(.9,(v.temp-250)/200)):id==='idealGas'?Math.max(.15,Math.min(.9,v.volume/.01)):Math.max(.15,Math.min(.9,v.volume/120));x.strokeStyle='#7793aa';x.strokeRect(w*.25,18,w*.5,115);x.fillStyle='#aab7c2';x.fillRect(w*.25,28+(1-frac)*80,w*.5,10)}
 else if(id==='flowHeating'){x.strokeStyle='#4f7896';x.lineWidth=18;x.beginPath();x.moveTo(20,75);x.lineTo(w-20,75);x.stroke();x.fillStyle='#ff7b87';x.fillRect(w*.44,50,w*.12,50)}
 else {x.fillStyle='#67c7ff';for(let i=0;i<28;i++){const px=18+((i*53+t*40*(i%3+1))%(w-36)),py=25+((i*29+Math.sin(t+i)*25+i*7)%100+100)%100;x.beginPath();x.arc(px,py,3,0,Math.PI*2);x.fill()}}
}
function compareStats(id,v){
 const d=[];if(id==='circular'){d.push(['v',v.omega*v.radius,'m s⁻¹'],['a',v.omega*v.omega*v.radius,'m s⁻²'])}else if(id==='spring'){const T=2*Math.PI*Math.sqrt(v.mass/v.springK);d.push(['T',T,'s'])}else if(id==='pendulum'){d.push(['T',2*Math.PI*Math.sqrt(v.length/9.81),'s'])}else if(id==='flowHeating'){d.push(['ΔT',v.power/(v.flow*v.specificC),'K'])}else if(id==='idealGas'){d.push(['p',v.moles*8.31*v.temp/v.volume,'Pa'])}else if(id==='boylePractical'){d.push(['p',101*80/v.volume*(v.temp/295),'kPa'])}else d.push(['selected value',Object.values(v)[0],'']);
 return `<div class="stat-grid">${d.map(x=>`<div><strong>${fmt(x[1])}</strong><span>${x[0]} ${x[2]}</span></div>`).join('')}</div>`;
}

/* ---------- PWA / accessibility / performance / bug report ---------- */
function initPWA(){
 let installPrompt=null;
 window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;const b=$('#installApp');if(b)b.classList.remove('hidden')});
 document.addEventListener('click',async e=>{if(e.target?.id==='installApp'&&installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;e.target.classList.add('hidden')}});
 if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').then(reg=>{if(reg.waiting)showUpdate(reg);reg.addEventListener('updatefound',()=>{const nw=reg.installing;nw?.addEventListener('statechange',()=>{if(nw.state==='installed'&&navigator.serviceWorker.controller)showUpdate(reg)})})}).catch(()=>{})}
}
function showUpdate(reg){if(document.querySelector('.update-banner'))return;const b=document.createElement('div');b.className='update-banner';b.innerHTML='<strong>New app version available</strong><button class="button primary">Update now</button><button class="text-button">Later</button>';document.body.append(b);b.querySelector('.button').onclick=()=>{reg.waiting?.postMessage({type:'SKIP_WAITING'});navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true})};b.querySelector('.text-button').onclick=()=>b.remove()}
function initAccessibility(){
 const skip=document.createElement('a');skip.href='#mainContent';skip.className='skip-link';skip.textContent='Skip to main content';document.body.prepend(skip);$('main')?.setAttribute('id','mainContent');document.documentElement.lang='en';
 $$('button:not([type])').forEach(b=>b.type='button');$$('canvas').forEach(c=>{if(!c.getAttribute('role'))c.setAttribute('role','img')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&annotation.active)toggleAnnotation()});
}
function initPerformance(){
 const low=(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=4)||(navigator.deviceMemory&&navigator.deviceMemory<=4);window.FM_PERF_SCALE=low?.65:1;if(low){const trails=$('#showTrails');if(trails&&trails.checked){trails.click()}document.body.classList.add('low-power-mode')}
}
function createBugReport(){
 const payload={time:new Date().toISOString(),profile:activeProfile()?.name,userAgent:navigator.userAgent,url:location.href,lesson:currentLesson(),simulation:window.FM_SIM?.getState?.(),mastery:window.FM_MASTERY?.state||{},version:9};download('further-mechanics-bug-report.json',JSON.stringify(payload,null,2));
}
function initBugButton(){
 const b=document.createElement('button');b.className='bug-fab';b.textContent='Report issue';b.onclick=createBugReport;document.body.append(b);
}

/* ---------- boot ---------- */
function boot(){
 initProfiles();initAutosave();initMasteryWrapper();ensureSuiteOption();initSimTeaching();initPWA();initAccessibility();initPerformance();initBugButton();injectLessonMastery();
 const sel=$('#masteryMode');if(sel)new MutationObserver(ensureSuiteOption).observe(sel,{childList:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();