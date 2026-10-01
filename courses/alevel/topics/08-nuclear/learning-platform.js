(() => {
"use strict";
const STORE="aqaNuclearPlatformV1";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const now=()=>Date.now(), day=86400000;
let state={};
try{state=JSON.parse(localStorage.getItem(STORE)||"{}")}catch{state={}}
function normalise(){
 state.performance=state.performance||{};
 state.diagnostic=state.diagnostic||{answers:{},completed:false};
 state.retrieval=state.retrieval||{};
 state.misconceptions=state.misconceptions||{};
 state.confidence=state.confidence||{};
 state.written=state.written||{};
 state.simChallenges=state.simChallenges||{};
 state.practical=state.practical||{};
 state.synoptic=state.synoptic||{};
 state.assignments=state.assignments||{teacher:[],student:null};
 state.teacherRecords=state.teacherRecords||[];
 state.paper=state.paper||{history:[]};
 state.accessibility=state.accessibility||{};
 state.history=state.history||[];
 state.ui=state.ui||{tab:"today"};
}
normalise();
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}};
function C(){return window.NuclearCourse||null}
function lessons(){return C()?.lessons||[]}
function exams(){return C()?.exam||[]}
function lessonState(i){try{return C()?.getLessonState(i)||{}}catch{return {}}}
function lessonProgress(i){try{return C()?.progress(i)||0}catch{return 0}}
function activeLesson(){try{return C()?.lessonIndex()||0}catch{return 0}}
function questionBank(){
 const out=[];
 lessons().forEach((p,i)=>{
   (p.exit||[]).forEach((q,n)=>out.push({id:`L${i}-E${n}`,lesson:i,title:p.title,q:q[0],opts:q[1],a:q[2],why:q[3],kind:"retrieval"}));
   (p.practice||[]).forEach((q,n)=>out.push({id:`L${i}-P${n}`,lesson:i,title:p.title,q:q[0],opts:q[1],a:q[2],why:q[3],kind:"practice"}));
 });
 return out;
}
const misconceptions=[
 ["A, Z and N","The element is fixed by proton number Z. Isotopes keep Z the same and change neutron number N."],
 ["Rutherford evidence","Most alpha particles passing through shows atoms are mostly empty space; rare large-angle deflections show positive charge and mass are concentrated in a tiny nucleus."],
 ["Radiation properties","Alpha, beta and gamma are not ranked by one universal 'danger' scale. Ionisation, penetration and exposure context all matter."],
 ["Inverse-square law","Use background-corrected count rate and compare it with 1/r². Doubling distance gives about one quarter of the ideal source contribution."],
 ["Radiation risk","Risk depends on type, activity, time, distance, shielding and whether material is internal or external."],
 ["Random decay","Individual nuclei decay unpredictably, but each has a constant probability per unit time and large samples follow a predictable statistical trend."],
 ["Half-life and lambda","Half-life and decay constant are inversely related: T½ = ln2/λ. Activity follows exponential decay."],
 ["Moles to activity","The common chain is mass → moles → nuclei → activity. Use n=m/M, N=nN_A and A=λN."],
 ["N–Z decay changes","Alpha changes A by −4 and Z by −2; β− makes Z+1; β+/electron capture makes Z−1; gamma leaves A and Z unchanged."],
 ["Gamma energy levels","Gamma emission changes nuclear energy state, not nucleon numbers. Photon energy equals the level spacing ΔE=hf."],
 ["Closest approach","The alpha is repelled by the positive nucleus. In the head-on model, initial kinetic energy becomes electrostatic potential energy at closest approach."],
 ["Electron diffraction","High-momentum electrons have short de Broglie wavelength. The diffraction pattern depends on nuclear size."],
 ["Radius and density","R ∝ A^(1/3), so volume ∝ A. Since nuclear mass is also roughly ∝ A, density is approximately constant."],
 ["Mass defect","A bound nucleus has less mass-energy than separated nucleons. Binding energy corresponds to the mass defect through ΔE=Δmc²."],
 ["Binding energy curve","Fusion and fission can release energy when products are more tightly bound overall, moving toward higher binding energy per nucleon."],
 ["Chain reactions","A fission chain depends on neutron production versus neutron losses. Keep criticality reasoning qualitative at this level."],
 ["Reactor roles","Moderator slows neutrons, control rods absorb neutrons and coolant transfers thermal energy."],
 ["Nuclear safety","Shielding, distance/remote handling, shutdown systems and waste containment address different parts of risk."],
 ["Synoptic modelling","Choose the physical model before calculating, state assumptions and distinguish evidence from inference."]
];
function lessonMetric(i){
 const p=lessons()[i],s=lessonState(i);
 const diag=state.diagnostic.answers?.[i];
 const wrong=state.performance[`lesson-${i}`]?.wrong||0;
 return {title:p?.title||`Lesson ${i+1}`,progress:lessonProgress(i),diag:diag?.correct??null,wrong};
}
function questionIdFor(el){
 if(!el)return null;
 if(el.dataset.lpQid)return el.dataset.lpQid;
 const panel=el.closest("[data-il-panel]");
 const lesson=activeLesson();
 let part=panel?.dataset.ilPanel||"lesson";
 let idx=0;
 const group=el.closest(".il-q,.il-vocab-q,.il-exam-card");
 if(group){
   const siblings=$$(".il-q,.il-vocab-q,.il-exam-card",panel||document);
   idx=Math.max(0,siblings.indexOf(group));
 }
 const id=`L${lesson}-${part}-${idx}`;
 if(group)group.dataset.lpQid=id;
 return id;
}
function scheduleRetrieval(qid,correct){
 const q=questionBank().find(x=>x.id===qid);
 if(!q)return;
 const r=state.retrieval[qid]||{streak:0,interval:0,due:now()};
 if(correct){r.streak++;r.interval=[1,3,7,14,30,60][Math.min(r.streak-1,5)];}
 else{r.streak=0;r.interval=1;}
 r.due=now()+r.interval*day;r.last=now();state.retrieval[qid]=r;save();
}
function recordAnswer(el,correct){
 const qid=questionIdFor(el),lesson=activeLesson(),key=`lesson-${lesson}`;
 const p=state.performance[key]||{correct:0,wrong:0,streak:0};
 if(correct){p.correct++;p.streak++;}else{p.wrong++;p.streak=0;recordMisconception(lesson);}
 state.performance[key]=p;
 const conf=state.confidence[qid]?.value;
 if(conf){state.confidence[qid].attempts=(state.confidence[qid].attempts||0)+1;state.confidence[qid].correct=(state.confidence[qid].correct||0)+(correct?1:0);}
 save();injectAdaptive();renderIfOpen();
}
function recordMisconception(i){
 const m=state.misconceptions[i]||{count:0,last:0};m.count++;m.last=now();state.misconceptions[i]=m;save();
}
document.addEventListener("click",e=>{
 const btn=e.target.closest("[data-so],[data-cco],[data-po]");
 if(!btn)return;
 const box=btn.closest(".il-q");const wasDisabled=btn.disabled;
 if(wasDisabled)return;
 setTimeout(()=>{
   const correct=btn.classList.contains("correct")||!!box?.querySelector("button.correct");
   const wrong=btn.classList.contains("wrong");
   if(correct||wrong)recordAnswer(box||btn,correct&&!wrong);
 },40);
},true);
function annotateConfidence(){
 $$(".il-q,.il-exam-card").forEach((box,n)=>{
   if(box.querySelector(".lp-confidence"))return;
   const id=questionIdFor(box);if(!id)return;
   const row=document.createElement("div");row.className="lp-confidence";row.innerHTML='<span class="muted small">Before answering:</span>'+
    ["guessing","unsure","confident"].map(v=>`<button type="button" data-conf="${v}" class="${state.confidence[id]?.value===v?"selected":""}">${v==="guessing"?"Guessing":v==="unsure"?"Unsure":"Confident"}</button>`).join("");
   const h=box.querySelector("h4,h3");if(h)h.insertAdjacentElement("afterend",row);else box.prepend(row);
   row.querySelectorAll("[data-conf]").forEach(b=>b.addEventListener("click",()=>{
     state.confidence[id]=state.confidence[id]||{};state.confidence[id].value=b.dataset.conf;save();
     row.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===b));
   }));
 });
}
function adaptiveNeeded(i){
 const p=state.performance[`lesson-${i}`]||{wrong:0,correct:0,streak:0};
 return p.wrong>=2 && p.streak<3;
}
function injectAdaptive(){
 const root=$("#interactiveLessonWorkspace");if(!root)return;
 const old=$("#lpAdaptive",root);
 const i=activeLesson(),p=lessons()[i];if(!p)return;
 const perf=state.performance[`lesson-${i}`]||{wrong:0,correct:0,streak:0};
 const strong=perf.streak>=3||perf.correct>=5,need=adaptiveNeeded(i);
 const mode=strong?"astar":need?"reteach":"none";
 if(mode==="none"){if(old)old.remove();return}
 if(old&&old.dataset.lesson===String(i)&&old.dataset.mode===mode)return;
 if(old)old.remove();
 const box=document.createElement("article");box.id="lpAdaptive";box.className="lp-adaptive";box.dataset.lesson=String(i);box.dataset.mode=mode;
 if(strong){
   const hard=exams()?.[i]?.[1]||exams()?.[i]?.[0];
   box.innerHTML=`<h4>A* extension unlocked</h4><p>Your recent answers are secure. Try a harder unfamiliar application before moving on.</p><div class="lp-question"><h4>${esc(hard?.q||"Explain this lesson using evidence, a model/equation and one limitation.")}</h4><textarea id="lpAstarUnlock" style="width:100%;min-height:90px;background:#061421;color:var(--text);border:1px solid var(--border);border-radius:9px;padding:9px"></textarea><div class="lp-actions"><button type="button" id="lpCheckAstar">Check reasoning</button></div><div id="lpAstarFb"></div></div>`;
   root.querySelector(".il-body")?.prepend(box);
   $("#lpCheckAstar",box).onclick=()=>{const ans=$("#lpAstarUnlock",box).value,pts=hard?.points||[];const hits=pts.map(x=>pointHit(ans,x));$("#lpAstarFb",box).innerHTML='<div class="lp-markpoints">'+pts.map((x,k)=>`<div class="lp-markpoint ${hits[k]?"hit":"miss"}">${hits[k]?"Likely covered":"Strengthen"} · ${esc(x)}</div>`).join("")+'</div>'};
   return;
 }
 box.innerHTML=`<h4>Adaptive reteach recommended</h4><p>You have had several attempts in this lesson. Rebuild the core model before continuing.</p><div class="lp-actions"><button type="button" id="lpReteach">Open short reteach</button><button type="button" id="lpExtraPractice">Extra practice</button></div><div id="lpAdaptiveBody"></div>`;
 root.querySelector(".il-body")?.prepend(box);
 $("#lpReteach",box).onclick=()=>{
   const body=$("#lpAdaptiveBody",box);
   body.innerHTML=`<div class="lp-coach"><strong>${esc(p.learn?.[0]?.[0]||p.title)}</strong><p>${p.learn?.[0]?.[1]||p.intro}</p><p><strong>Remember:</strong> ${p.learn?.[0]?.[2]||""}</p></div>`;
 };
 $("#lpExtraPractice",box).onclick=()=>{
   const q=p.exit?.[0];if(!q)return;
   $("#lpAdaptiveBody",box).innerHTML=`<div class="lp-question"><h4>${esc(q[0])}</h4><div class="lp-options">${q[1].map((o,j)=>`<button type="button" data-adapt="${j}">${esc(o)}</button>`).join("")}</div><div class="lp-feedback" id="lpAdaptFb">Choose an answer.</div></div>`;
   $$("[data-adapt]",box).forEach(b=>b.onclick=()=>{
     const ok=Number(b.dataset.adapt)===q[2];b.classList.add(ok?"correct":"wrong");$("#lpAdaptFb",box).textContent=(ok?"Correct — ":"Review — ")+q[3];
     if(ok){const pp=state.performance[`lesson-${i}`]||{};pp.streak=3;state.performance[`lesson-${i}`]=pp;save();}
   });
 };
}
const STOP=new Set("the a an and or to of in on for with from is are was were be been being this that it as by at into than then if using use used".split(" "));
function normalisePhysicsText(v){
 return String(v??"")
  .replace(/×/g,"x").replace(/[−–—]/g,"-")
  .replace(/λ/g," lambda ").replace(/Δ/g," delta ")
  .replace(/½/g,"1/2").replace(/²/g,"^2").replace(/³/g,"^3")
  .toLowerCase().replace(/,/g,"").replace(/\s+/g," ").trim();
}
function keywords(v){
 const expanded=normalisePhysicsText(v)
  .replace(/\bdecay constant\b/g," lambda decay constant ")
  .replace(/\bhalf[- ]life\b/g," half life ")
  .replace(/\bbecquerels?\b/g," bq becquerel ")
  .replace(/\bavogadro(?:'s)?(?: constant)?\b/g," avogadro na ");
 return [...new Set(expanded.replace(/[^a-z0-9^+\-/.]/g," ").split(/\s+/).filter(x=>x.length>2&&!STOP.has(x)))];
}
function extractNumbers(v){
 const text=normalisePhysicsText(v).replace(/(\d+(?:\.\d+)?)\s*x\s*10\s*\^?\s*([+\-]?\d+)/g,(_,a,b)=>String(Number(a)*Math.pow(10,Number(b))));
 return [...text.matchAll(/[+\-]?(?:\d+\.?\d*|\.\d+)(?:e[+\-]?\d+)?/g)].map(m=>Number(m[0])).filter(Number.isFinite);
}
function numericEvidence(answer,point){
 const need=extractNumbers(point),have=extractNumbers(answer);if(!need.length)return false;
 return need.some(n=>have.some(a=>Math.abs(a-n)<=Math.max(Math.abs(n)*.02,1e-9)));
}
function pointHit(answer,point){
 const a=normalisePhysicsText(answer),ks=keywords(point);if(!a.trim())return false;
 const wordHits=ks.filter(k=>a.includes(k));
 const numeric=numericEvidence(a,point);
 const threshold=Math.max(1,Math.ceil(ks.length*.38));
 if(!ks.length)return numeric;
 if(numeric&&wordHits.length>=Math.max(1,threshold-1))return true;
 return wordHits.length>=threshold;
}
function autoMarkQuestion(q){
 const answer=String(q.answer||"").trim();
 const hits=(q.points||[]).map(p=>pointHit(answer,p));
 const score=Math.min(Number(q.marks)||hits.length,hits.filter(Boolean).length);
 const max=Number(q.marks)||hits.length;
 return {hits,score,max,pct:max?Math.round(score/max*100):0};
}
function paperTotals(paper){
 const marked=paper.filter(q=>Array.isArray(q.hits));
 const score=marked.reduce((a,q)=>a+(Number(q.autoScore)||0),0);
 const max=paper.reduce((a,q)=>a+(Number(q.marks)||0),0);
 return {marked:marked.length,total:paper.length,score,max,pct:max?Math.round(score/max*100):0};
}
function commandCoach(q){
 const first=(String(q).trim().match(/^([A-Za-z]+)/)||[])[1]?.toLowerCase()||"";
 const map={
  explain:"Build cause → physics principle/equation → effect. Link each statement.",
  calculate:"State the equation, rearrange if needed, substitute consistent units, calculate and give the unit.",
  evaluate:"Use relevant physics evidence, limitations/risk and a justified conclusion.",
  state:"Give a precise fact. Do not add unnecessary explanation unless it helps accuracy.",
  describe:"Say what the data/graph/model shows. Quote a trend or value where useful.",
  show:"Start from the supplied relationship/data and show each mathematical step clearly.",
  compare:"Give linked similarities/differences using the same physical quantity."
 };
 return map[first]||"Identify the command word, use precise nuclear terminology and make every sentence earn a mark.";
}
function enhanceExamCards(){
 $$(".il-exam-card").forEach(card=>{
   if(card.querySelector(".lp-exam-coach"))return;
   const lesson=activeLesson(),n=Number(card.dataset.exq||0),q=exams()?.[lesson]?.[n];if(!q)return;
   const call=document.createElement("div");call.className="lp-coach lp-exam-coach";call.innerHTML=`<strong>Exam technique</strong><span>${esc(commandCoach(q.q))}</span><div class="lp-actions"><button type="button" data-coach-answer>Coach my written answer</button></div><div data-coach-result></div>`;
   const ta=card.querySelector("textarea");if(ta)ta.insertAdjacentElement("beforebegin",call);else card.appendChild(call);
   $("[data-coach-answer]",call).onclick=()=>{
     const ans=ta?.value||"",hits=q.points.map(p=>pointHit(ans,p));
     state.written[`L${lesson}-Q${n}`]={answer:ans,hits,at:now()};save();
     $("[data-coach-result]",call).innerHTML=`<div class="lp-markpoints">${q.points.map((p,k)=>`<div class="lp-markpoint ${hits[k]?"hit":"miss"}"><strong>${hits[k]?"Likely covered":"Check this point"}</strong> · ${esc(p)}</div>`).join("")}</div><p class="muted small">This is a coaching check, not an official mark. Compare your wording with the revealed mark points.</p>`;
   };
 });
}
function diagnosticQuestions(){return lessons().map((p,i)=>{const q=p.exit?.[0]||p.practice?.[0];return q?{lesson:i,title:p.title,q:q[0],opts:q[1],a:q[2],why:q[3]}:null}).filter(Boolean)}
function diagnosticScore(){const a=state.diagnostic.answers||{},qs=diagnosticQuestions();const done=Object.keys(a).length,correct=Object.values(a).filter(x=>x.correct).length;return {done,correct,total:qs.length,pct:done?Math.round(correct/done*100):0}}
function dueRetrieval(){
 const bank=questionBank();const scheduled=bank.filter(q=>state.retrieval[q.id]&&state.retrieval[q.id].due<=now());
 const weak=bank.filter(q=>state.diagnostic.answers?.[q.lesson]?.correct===false&&!state.retrieval[q.id]).slice(0,8);
 return [...scheduled,...weak].filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i);
}
function revisionItems(){
 const items=[];
 dueRetrieval().slice(0,2).forEach(q=>items.push({type:"Spaced retrieval",title:q.title,detail:q.q,lesson:q.lesson}));
 Object.entries(state.misconceptions).sort((a,b)=>(b[1].count||0)-(a[1].count||0)).slice(0,2).forEach(([i,m])=>items.push({type:"Misconception",title:lessons()[i]?.title,detail:misconceptions[i]?.[1]||"Review this lesson.",lesson:Number(i)}));
 lessons().forEach((p,i)=>{if(lessonProgress(i)<60)items.push({type:"Incomplete learning",title:p.title,detail:`${lessonProgress(i)}% complete`,lesson:i})});
 return items.filter((x,i,a)=>a.findIndex(y=>y.title===x.title&&y.type===x.type)===i).slice(0,5);
}
function renderToday(){
 const host=$("#lp-today");if(!host)return;
 const avg=lessons().length?Math.round(lessons().reduce((a,_,i)=>a+lessonProgress(i),0)/lessons().length):0;
 const due=dueRetrieval().length,mis=Object.keys(state.misconceptions).filter(i=>state.misconceptions[i].count>0).length,diag=diagnosticScore();
 const rev=revisionItems();
 host.innerHTML=`<div class="lp-grid three">
  <article class="lp-card"><div class="lp-stat"><div><strong>${avg}%</strong><span>course completion</span></div><span>19 lessons</span></div><div class="lp-progress"><i style="width:${avg}%"></i></div></article>
  <article class="lp-card"><div class="lp-stat"><div><strong>${due}</strong><span>retrieval questions due</span></div><span>spaced practice</span></div></article>
  <article class="lp-card"><div class="lp-stat"><div><strong>${mis}</strong><span>misconceptions flagged</span></div><span>targeted reteach</span></div></article>
 </div>
 <div class="lp-grid" style="margin-top:12px"><article class="lp-card"><h3>Your 5 things to revise today</h3><div class="lp-list">${rev.length?rev.map(x=>`<div class="lp-list-item"><div><strong>${esc(x.title)}</strong><small>${esc(x.type)} · ${esc(x.detail)}</small></div><button type="button" data-open-lesson="${x.lesson}">Open</button></div>`).join(""):'<p class="muted">Complete the diagnostic or some lesson checks and this list will personalise itself.</p>'}</div></article>
 <article class="lp-card"><h3>Diagnostic snapshot</h3><div class="lp-score"><div class="lp-score-ring ${diag.pct>=70?"good":"warn"}">${diag.pct}%</div><div><strong>${diag.correct} / ${diag.done}</strong><p class="muted">correct from ${diag.total} topic checks attempted.</p></div></div><div class="lp-actions"><button type="button" data-lp-go="diagnostic" class="primary">Open diagnostic</button><button type="button" data-lp-go="retrieval">Retrieval practice</button></div></article></div>`;
 host.insertAdjacentHTML("beforeend",assignmentStudentHTML());bindAssignmentStudent(host);
 bindOpenLessons(host);
}
function renderDiagnostic(){
 const host=$("#lp-diagnostic");if(!host)return;const qs=diagnosticQuestions(),score=diagnosticScore();
 host.innerHTML=`<div class="lp-hero"><div><h3>Whole-topic diagnostic</h3><p>One core check from every lesson. Results create a personal pathway; they do not block access to the course.</p></div><div class="lp-score"><div class="lp-score-ring ${score.pct>=70?"good":"warn"}">${score.pct}%</div><span>${score.done}/${score.total} attempted</span></div></div>
 <div class="lp-actions"><button type="button" id="lpResetDiagnostic">Reset diagnostic</button></div>
 <div id="lpDiagnosticQs">${qs.map((q,n)=>{const a=state.diagnostic.answers[n];return `<article class="lp-question" data-diagnostic="${n}"><span class="lp-chip">Lesson ${n+1}</span><h4>${esc(q.q)}</h4><div class="lp-options">${q.opts.map((o,j)=>`<button type="button" data-da="${j}" ${a?"disabled":""} class="${a&&j===q.a?"correct":a&&j===a.choice&&!a.correct?"wrong":""}">${esc(o)}</button>`).join("")}</div><div class="lp-feedback">${a?(a.correct?"Correct — ":"Review — ")+esc(q.why):"Choose the answer you think is best."}</div></article>`}).join("")}</div>`;
 $$("#lpDiagnosticQs [data-da]",host).forEach(b=>b.onclick=()=>{
   const card=b.closest("[data-diagnostic]"),i=Number(card.dataset.diagnostic),q=qs[i],choice=Number(b.dataset.da),correct=choice===q.a;
   state.diagnostic.answers[i]={choice,correct,at:now()};if(Object.keys(state.diagnostic.answers).length===qs.length)state.diagnostic.completed=true;
   if(!correct)recordMisconception(q.lesson);
   const bank=questionBank().find(x=>x.lesson===q.lesson);if(bank){state.retrieval[bank.id]={streak:correct?1:0,interval:correct?3:1,due:now()+(correct?3:1)*day,last:now()};}
   save();renderDiagnostic();renderToday();
 });
 $("#lpResetDiagnostic",host).onclick=()=>{state.diagnostic={answers:{},completed:false};save();renderDiagnostic();renderToday()};
}
function renderRetrieval(){
 const host=$("#lp-retrieval");if(!host)return;const due=dueRetrieval();
 host.innerHTML=`<div class="lp-hero"><div><h3>Spaced retrieval</h3><p>Questions return after 1, 3, 7, 14, 30 and 60 days depending on success.</p></div><span class="lp-chip due">${due.length} due now</span></div><div id="lpRetrievalBody"></div>`;
 const body=$("#lpRetrievalBody",host);
 if(!due.length){body.innerHTML='<article class="lp-card"><h4>Nothing due right now</h4><p class="muted">Keep completing lesson checks; weak or newly learned material will be scheduled automatically.</p></article>';return}
 const q=due[0];body.innerHTML=`<article class="lp-question"><span class="lp-chip">${esc(q.title)}</span><h4>${esc(q.q)}</h4><div class="lp-options">${q.opts.map((o,j)=>`<button type="button" data-rq="${j}">${esc(o)}</button>`).join("")}</div><div class="lp-feedback" id="lpRetrieveFb">Answer from memory before checking notes.</div></article>`;
 $$("[data-rq]",body).forEach(b=>b.onclick=()=>{const correct=Number(b.dataset.rq)===q.a;b.classList.add(correct?"correct":"wrong");$("#lpRetrieveFb",body).textContent=(correct?"Correct — ":"Review — ")+q.why;scheduleRetrieval(q.id,correct);if(!correct)recordMisconception(q.lesson);setTimeout(renderRetrieval,450);});
}
function renderMisconceptions(){
 const host=$("#lp-misconceptions");if(!host)return;
 const rows=Object.entries(state.misconceptions).filter(([,m])=>m.count>0).sort((a,b)=>b[1].count-a[1].count);
 host.innerHTML=`<div class="lp-hero"><div><h3>Misconception detector</h3><p>Repeated wrong answers are grouped into the physics idea most likely to need reteaching.</p></div><span class="lp-chip weak">${rows.length} areas flagged</span></div><div class="lp-list">${rows.length?rows.map(([i,m])=>`<div class="lp-list-item"><div><strong>${esc(misconceptions[i]?.[0]||lessons()[i]?.title)}</strong><small>${m.count} flagged attempt${m.count===1?"":"s"} · ${esc(misconceptions[i]?.[1]||"Review the lesson.")}</small></div><button type="button" data-open-lesson="${i}">Reteach</button></div>`).join(""):'<article class="lp-card"><p class="muted">No repeated misconceptions flagged yet.</p></article>'}</div>`;
 bindOpenLessons(host);
}
function calibration(){
 const vals=Object.values(state.confidence).filter(x=>x.attempts);
 const by={guessing:[0,0],unsure:[0,0],confident:[0,0]};vals.forEach(x=>{const k=x.value||"unsure";by[k][0]+=x.correct||0;by[k][1]+=x.attempts||0});return by;
}
function renderConfidence(){
 const host=$("#lp-confidence");if(!host)return;const cal=calibration();
 host.innerHTML=`<div class="lp-hero"><div><h3>Confidence calibration</h3><p>Students judge confidence before answering. Confident mistakes are prioritised because they often reveal stronger misconceptions.</p></div></div><div class="lp-grid three">${Object.entries(cal).map(([k,v])=>`<article class="lp-card"><h4>${k[0].toUpperCase()+k.slice(1)}</h4><div class="lp-stat"><strong>${v[1]?Math.round(v[0]/v[1]*100):0}%</strong><span>accuracy · ${v[1]} attempts</span></div></article>`).join("")}</div>`;
}
function bindOpenLessons(root){
 $$("[data-open-lesson]",root).forEach(b=>b.onclick=()=>{
   const i=Number(b.dataset.openLesson),nav=$('.nav-button[data-view="sequence"]');if(nav)nav.click();
   setTimeout(()=>{const steps=$$(".seq-step");if(steps[i])steps[i].click()},100);
 });
}
function renderIfOpen(){if($("#view-platform.active-view"))renderPlatformTab(state.ui.tab)}
function renderPlatformTab(tab){
 state.ui.tab=tab;save();
 $$(".lp-tab").forEach(b=>b.classList.toggle("active",b.dataset.lpTab===tab));
 $$(".lp-panel").forEach(p=>p.classList.toggle("active",p.id===`lp-${tab}`));
 ({today:renderToday,diagnostic:renderDiagnostic,retrieval:renderRetrieval,misconceptions:renderMisconceptions,confidence:renderConfidence,calculations:renderCalculations,challenges:renderChallenges,glossary:renderGlossary,paper:renderPaper,teacher:renderTeacher,reports:renderReports,settings:renderSettings}[tab]||(()=>{}))();
}
function buildPlatformView(){
 const nav=$(".main-nav"),main=$("main");if(!nav||!main)return;
 let btn=$('.nav-button[data-view="platform"]');if(!btn){btn=document.createElement("button");btn.className="nav-button";btn.dataset.view="platform";btn.textContent="Learning dashboard";nav.appendChild(btn);}
 let sec=$("#view-platform");if(!sec){sec=document.createElement("section");sec.className="view";sec.id="view-platform";sec.innerHTML=`<div class="lp-shell"><div class="lp-hero"><div><span class="eyebrow">Adaptive learning</span><h2>Learning dashboard</h2><p>Diagnostics, spaced retrieval, misconceptions, exam coaching, revision, teacher tools and progress all use the same lesson record.</p></div><div class="lp-actions"><button type="button" id="lpResume" class="primary">Resume lesson</button></div></div><div class="lp-tabs">
 ${[["today","Today"],["diagnostic","Diagnostic"],["retrieval","Retrieval"],["misconceptions","Misconceptions"],["confidence","Confidence"],["calculations","Calculations"],["challenges","Challenges"],["glossary","Glossary"],["paper","Paper generator"],["teacher","Teacher"],["reports","Reports"],["settings","Settings"]].map(x=>`<button type="button" class="lp-tab" data-lp-tab="${x[0]}">${x[1]}</button>`).join("")}
 </div>${["today","diagnostic","retrieval","misconceptions","confidence","calculations","challenges","glossary","paper","teacher","reports","settings"].map(x=>`<div class="lp-panel" id="lp-${x}"></div>`).join("")}</div>`;main.appendChild(sec);}
 const open=()=>{$$(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.view==="platform"));$$(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-platform"));renderPlatformTab(state.ui.tab||"today");window.scrollTo({top:0,behavior:"smooth"});};
 btn.addEventListener("click",open);
 $$(".lp-tab",sec).forEach(b=>b.onclick=()=>renderPlatformTab(b.dataset.lpTab));
 sec.addEventListener("click",e=>{const go=e.target.closest("[data-lp-go]");if(go)renderPlatformTab(go.dataset.lpGo);});
 $("#lpResume",sec).onclick=()=>{const b=$('.nav-button[data-view="sequence"]');if(b)b.click()};
 renderPlatformTab(state.ui.tab||"today");
}
const observer=new MutationObserver(()=>{annotateConfidence();enhanceExamCards();injectAdaptive()});
observer.observe(document.body,{childList:true,subtree:true});
setInterval(()=>{if($("#interactiveLessonWorkspace")){annotateConfidence();enhanceExamCards();}},1200);
function init(){
 if(!C()){setTimeout(init,100);return}
 const hash=location.hash.match(/assignment=([^&]+)/);
 if(hash){
   const d=decodeCode(decodeURIComponent(hash[1]));
   if(d?.type==="nuclear-assignment-v1"&&Array.isArray(d.lessons)){state.assignments.student=d;save();history.replaceState(null,"",location.pathname+location.search)}
 }
 buildPlatformView();annotateConfidence();enhanceExamCards();injectAdaptive();buildPracticalNotebook();
}
setTimeout(init,150);


/* Feature: calculation workspace */
const calcTools=[
 {id:"activity",name:"Activity",eq:"A = λN",prompt:"Find activity from decay constant and number of undecayed nuclei.",units:"A in Bq; λ in s⁻¹; N has no unit",steps:["Choose A = λN","Use consistent inverse-time units for λ","Substitute λ and N","Give activity in Bq"]},
 {id:"halflife",name:"Half-life / decay constant",eq:"T½ = ln2 / λ",prompt:"Convert between half-life and decay constant.",units:"T½ and λ must use reciprocal time units",steps:["Choose T½ = ln2/λ","Rearrange if finding λ","Convert time units consistently","State the reciprocal-time unit for λ"]},
 {id:"decay",name:"Exponential decay",eq:"N = N₀e^(−λt)",prompt:"Find number remaining or activity after a time.",units:"λt must be dimensionless",steps:["Choose the exponential law","Make λ and t compatible","Evaluate the exponent","Use A=λN if activity is required"]},
 {id:"moles",name:"Sample nuclei",eq:"N = (m/M)N_A",prompt:"Convert a pure isotope sample mass to number of nuclei.",units:"Use matching mass units for m and M",steps:["Find moles n=m/M","Use N=nN_A","Keep significant figures sensible","Use N in later activity calculations if needed"]},
 {id:"radius",name:"Nuclear radius",eq:"R = r₀A^(1/3)",prompt:"Estimate nuclear radius.",units:"R and r₀ use the same length unit",steps:["Use the cube root of A","Multiply by r₀","Convert fm to m only if required","Interpret as a nuclear-scale estimate"]},
 {id:"binding",name:"Binding energy",eq:"E = Δmc² or E(MeV)=Δm(u)×931.5",prompt:"Convert mass defect to binding energy.",units:"Use kg/J or u/MeV consistently",steps:["Find/identify mass defect","Choose SI or u→MeV route","Calculate total binding energy","Divide by A only if BE per nucleon is requested"]},
 {id:"gamma",name:"Gamma photon",eq:"ΔE = hf",prompt:"Relate nuclear level spacing to gamma frequency.",units:"Use joules with h in J s",steps:["Find level energy difference","Convert eV/keV/MeV to joules if needed","Use f=ΔE/h","Check the frequency is in the gamma range"]},
 {id:"closest",name:"Closest approach",eq:"E_k = k(2e)(Ze)/r",prompt:"Use the head-on Coulomb energy model.",units:"Use joules, coulombs and metres in SI",steps:["Convert alpha energy to joules","Use alpha charge +2e and target charge +Ze","Rearrange for r","Interpret the result in femtometres"]}
];
function renderCalculations(){
 const host=$("#lp-calculations");if(!host)return;
 const selected=state.ui.calc||calcTools[0].id,tool=calcTools.find(x=>x.id===selected)||calcTools[0];
 host.innerHTML=`<div class="lp-hero"><div><h3>Calculation workspace</h3><p>Students build the method themselves: equation → rearrangement → substitution → result → units.</p></div></div>
 <div class="lp-grid"><article class="lp-card"><label class="lp-field"><span>Calculation</span><select id="lpCalcSelect">${calcTools.map(x=>`<option value="${x.id}" ${x.id===tool.id?"selected":""}>${x.name}</option>`).join("")}</select></label><div class="lp-coach"><strong>${tool.eq}</strong><span>${tool.prompt}</span><p class="muted small">${tool.units}</p></div><ol>${tool.steps.map(x=>`<li>${x}</li>`).join("")}</ol></article>
 <article class="lp-card"><label class="lp-field"><span>1 · Equation</span><input id="lpCalcEq" placeholder="Write the equation"></label><label class="lp-field"><span>2 · Rearranged equation</span><input id="lpCalcRearr" placeholder="Rearrange if needed"></label><label class="lp-field"><span>3 · Substitution</span><input id="lpCalcSub" placeholder="Substitute values with units"></label><label class="lp-field"><span>4 · Final answer</span><input id="lpCalcAns" placeholder="Answer"></label><label class="lp-field"><span>5 · Unit / interpretation</span><input id="lpCalcUnit" placeholder="Unit and one-sentence interpretation"></label><div class="lp-actions"><button type="button" class="primary" id="lpCalcCheck">Check method</button><button type="button" id="lpCalcHint">Hint</button></div><div id="lpCalcFeedback"></div><hr style="border:0;border-top:1px solid var(--border);margin:14px 0"><h4>Quick nuclear-unit converter</h4><div class="lp-grid"><label class="lp-field"><span>Value</span><input id="lpUnitValue" type="number" step="any" value="1"></label><label class="lp-field"><span>Conversion</span><select id="lpUnitType"><option value="MeV-J">MeV → J</option><option value="J-MeV">J → MeV</option><option value="keV-J">keV → J</option><option value="fm-m">fm → m</option><option value="m-fm">m → fm</option><option value="min-s">min → s</option><option value="h-s">h → s</option></select></label></div><div class="lp-feedback" id="lpUnitResult">1 MeV = 1.602×10⁻¹³ J</div></article></div>`;
 $("#lpCalcSelect",host).onchange=e=>{state.ui.calc=e.target.value;save();renderCalculations()};
 $("#lpCalcHint",host).onclick=()=>{$("#lpCalcFeedback",host).innerHTML=`<div class="lp-feedback lp-warn">Start from <strong>${tool.eq}</strong>. ${esc(tool.steps[1])}</div>`};
 const convert=()=>{const v=Number($("#lpUnitValue",host).value),type=$("#lpUnitType",host).value;if(!Number.isFinite(v)){ $("#lpUnitResult",host).textContent="Enter a valid number.";return }const map={"MeV-J":[1.602176634e-13,"J"],"J-MeV":[1/1.602176634e-13,"MeV"],"keV-J":[1.602176634e-16,"J"],"fm-m":[1e-15,"m"],"m-fm":[1e15,"fm"],"min-s":[60,"s"],"h-s":[3600,"s"]};const [factor,unit]=map[type];const out=v*factor;$("#lpUnitResult",host).textContent=v+" → "+out.toExponential(6)+" "+unit;};$("#lpUnitValue",host).oninput=convert;$("#lpUnitType",host).onchange=convert;
 $("#lpCalcCheck",host).onclick=()=>{
   const vals=["lpCalcEq","lpCalcRearr","lpCalcSub","lpCalcAns","lpCalcUnit"].map(id=>$("#"+id,host).value.trim());
   const complete=vals.filter(Boolean).length;
   const eqWords=keywords(tool.eq),eqHit=eqWords.some(k=>vals[0].toLowerCase().includes(k))||vals[0].replace(/\s/g,"").length>3;
   $("#lpCalcFeedback",host).innerHTML=`<div class="lp-feedback ${complete===5&&eqHit?"lp-good":"lp-warn"}"><strong>${complete===5&&eqHit?"Method complete":"Keep building the method"}</strong><p>${complete}/5 stages completed. ${!eqHit?"Write the governing equation before substituting. ":""}Check units and significant figures before accepting the result.</p></div>`;
 };
}

/* Feature: simulation challenge mode + A* synoptic challenges */
const simMissionText=[
 ["Nuclear scale challenge","Use the radius model to find two nuclei whose radii differ by about a factor of 2. Explain why their A values do not differ by a factor of 2."],
 ["Rutherford investigation","Change impact parameter and alpha energy separately. Find conditions for a large deflection and explain the result using Coulomb repulsion."],
 ["Radiation detective","Use absorber changes to distinguish alpha, beta and gamma. Explain why gamma should be described as attenuated."],
 ["Inverse-square mission","Choose two distances with a factor of 2 between them. Predict and then test the corrected count-rate ratio."],
 ["Risk decision","Use the radiation model to justify a suitable radiation type for a monitoring application and state one limitation."],
 ["Random-decay evidence","Compare individual decay events with the smooth population trend and explain why both are consistent."],
 ["Half-life mission","Set a half-life, predict the fraction after three half-lives, then verify the model."],
 ["Activity chain","Use Formula Coach to connect sample mass → nuclei → activity and explain each conversion."],
 ["Stability map mission","Predict how alpha, beta-minus and beta-plus/electron capture move a point on an N–Z graph before testing."],
 ["Gamma-level mission","Choose two transitions with different energy gaps and compare emitted photon frequency."],
 ["Closest-approach mission","Find two alpha energies that give clearly different closest-approach distances and explain the inverse relationship."],
 ["Diffraction mission","Keep electron wavelength fixed and change nuclear radius. Record how the first minimum moves."],
 ["Density mission","Compare A and 8A and use the displayed radii to show the cube-root relationship."],
 ["Mass-energy mission","Change mass defect and explain how total binding energy responds."],
 ["Binding-curve mission","Identify one light and one heavy region where moving toward more tightly bound products can release energy."],
 ["Chain-reaction mission","Compare decreasing, roughly steady and increasing neutron-generation behaviour using only qualitative neutron balance."],
 ["Moderation mission","Compare collision energy loss for different moderator-mass ratios and explain the mechanical reason."],
 ["Reactor-systems mission","Identify moderator, control rods, coolant and shielding and explain why each has a different physical role."],
 ["Synoptic simulation audit","Pick two simulations from different specification sections. State the model assumption and one observable prediction for each."]
];
const synoptic=[
 {q:"A radioactive sample question gives mass, molar mass, half-life and elapsed time. Build the full calculation route to current activity.",points:["m/M to obtain moles","multiply by N_A for nuclei","λ=ln2/T½","apply exponential decay","A=λN with consistent units"]},
 {q:"A new scattering experiment shows mostly straight paths and rare large-angle deflections. Explain how you would distinguish observation, model and inference.",points:["state observations separately","identify electrostatic interaction/model","large force implies concentrated charge","most straight paths imply mostly empty space","state a model limitation/assumption"]},
 {q:"Compare closest-approach and electron-diffraction methods for learning about nuclear size.",points:["closest approach uses Coulomb energy","diffraction uses matter waves","both probe fm scale","different model assumptions","both connect measured behaviour to nuclear radius"]},
 {q:"Explain why both fission and fusion can release energy without saying that mass or energy is destroyed.",points:["products can have greater BE per nucleon","bound system has lower total rest mass","mass-energy difference appears as released energy","conservation of energy is maintained"]},
 {q:"Evaluate a thermal reactor system using neutron physics, heat transfer and safety rather than a list of component names.",points:["moderator slows neutrons","control rods absorb neutrons","coolant transfers heat","shielding/containment reduce exposure","risk-benefit conclusion uses physics evidence"]},
 {q:"An unfamiliar nuclear-physics graph is provided. Describe a strong A* strategy before doing any calculation.",points:["identify axes/units","describe trend with evidence","select relevant model/equation","quantify gradient/proportion/uncertainty where possible","state assumptions and justified conclusion"]}
];
function renderChallenges(){
 const host=$("#lp-challenges");if(!host)return;const i=Number(state.ui.challengeLesson??activeLesson()),mission=simMissionText[i]||simMissionText[0],saved=state.simChallenges[i]||{};
 host.innerHTML=`<div class="lp-grid"><article class="lp-card"><span class="eyebrow">Simulation challenge mode</span><h3>${esc(mission[0])}</h3><p>${esc(mission[1])}</p><label class="lp-field"><span>Choose lesson challenge</span><select id="lpChallengeLesson">${lessons().map((p,n)=>`<option value="${n}" ${n===i?"selected":""}>${n+1}. ${esc(p.title)}</option>`).join("")}</select></label><label class="lp-field"><span>Prediction</span><textarea id="lpChallengePredict">${esc(saved.predict||"")}</textarea></label><label class="lp-field"><span>Evidence / readings</span><textarea id="lpChallengeEvidence">${esc(saved.evidence||"")}</textarea></label><label class="lp-field"><span>Physics explanation</span><textarea id="lpChallengeExplain">${esc(saved.explain||"")}</textarea></label><div class="lp-actions"><button type="button" class="primary" id="lpSaveChallenge">Save challenge</button><button type="button" id="lpOpenChallengeLesson">Open lesson</button></div><div id="lpChallengeFb"></div></article>
 <article class="lp-card"><span class="eyebrow">A* synoptic mastery</span><h3>Multi-topic challenges</h3><div id="lpSynopticList">${synoptic.map((x,n)=>{const v=state.synoptic[n]||{};return `<div class="lp-question"><h4>${n+1}. ${esc(x.q)}</h4><textarea class="lp-field" data-syn-answer="${n}" style="width:100%;min-height:100px;background:#061421;color:var(--text);border:1px solid var(--border);border-radius:9px;padding:9px">${esc(v.answer||"")}</textarea><div class="lp-actions"><button type="button" data-syn-check="${n}">Check reasoning</button></div><div data-syn-result="${n}"></div></div>`}).join("")}</div></article></div>`;
 $("#lpChallengeLesson",host).onchange=e=>{state.ui.challengeLesson=Number(e.target.value);save();renderChallenges()};
 $("#lpSaveChallenge",host).onclick=()=>{state.simChallenges[i]={predict:$("#lpChallengePredict",host).value,evidence:$("#lpChallengeEvidence",host).value,explain:$("#lpChallengeExplain",host).value,completed:$("#lpChallengePredict",host).value.trim().length>15&&$("#lpChallengeEvidence",host).value.trim().length>15&&$("#lpChallengeExplain",host).value.trim().length>25,at:now()};save();$("#lpChallengeFb",host).innerHTML='<div class="lp-feedback lp-good">Challenge saved. Revisit it later and improve the evidence/explanation.</div>'};
 $("#lpOpenChallengeLesson",host).onclick=()=>{const nav=$('.nav-button[data-view="sequence"]');if(nav)nav.click();setTimeout(()=>{const steps=$$(".seq-step");if(steps[i])steps[i].click()},100)};
 $$("[data-syn-answer]",host).forEach(t=>t.oninput=()=>{const n=Number(t.dataset.synAnswer);state.synoptic[n]=state.synoptic[n]||{};state.synoptic[n].answer=t.value;save()});
 $$("[data-syn-check]",host).forEach(b=>b.onclick=()=>{const n=Number(b.dataset.synCheck),x=synoptic[n],ans=state.synoptic[n]?.answer||"",hits=x.points.map(p=>pointHit(ans,p));state.synoptic[n]={answer:ans,hits,completed:hits.filter(Boolean).length>=Math.ceil(x.points.length*.6)};save();$('[data-syn-result="'+n+'"]',host).innerHTML='<div class="lp-markpoints">'+x.points.map((p,k)=>`<div class="lp-markpoint ${hits[k]?"hit":"miss"}">${hits[k]?"Likely included":"Strengthen"} · ${esc(p)}</div>`).join("")+'</div>'});
}

/* Feature: virtual practical notebook */
function buildPracticalNotebook(){
 const view=$("#view-practical");if(!view||$("#lpPracticalNotebook",view))return;
 const box=document.createElement("article");box.id="lpPracticalNotebook";box.className="panel pad";box.style.marginTop="16px";
 const p=state.practical;
 box.innerHTML=`<div class="section-head"><div><span class="eyebrow">Student practical record</span><h3>Virtual RP12 notebook</h3></div><p class="muted">All writing stays in the app alongside the virtual measurements and graph.</p></div><div class="lp-grid">
 <div><label class="lp-field"><span>Prediction / hypothesis</span><textarea data-practical="prediction">${esc(p.prediction||"")}</textarea></label><label class="lp-field"><span>Independent, dependent and control variables</span><textarea data-practical="variables">${esc(p.variables||"")}</textarea></label><label class="lp-field"><span>Method / data-quality notes</span><textarea data-practical="method">${esc(p.method||"")}</textarea></label></div>
 <div><label class="lp-field"><span>Conclusion using inverse-square evidence</span><textarea data-practical="conclusion">${esc(p.conclusion||"")}</textarea></label><label class="lp-field"><span>Evaluation / uncertainties</span><textarea data-practical="evaluation">${esc(p.evaluation||"")}</textarea></label><div class="lp-actions"><button type="button" id="lpCapturePractical">Capture current results summary</button></div><div id="lpPracticalCapture" class="lp-feedback">${esc(p.capture||"No result snapshot saved yet.")}</div></div></div>`;
 view.appendChild(box);
 $$("[data-practical]",box).forEach(t=>t.oninput=()=>{state.practical[t.dataset.practical]=t.value;save()});
 $("#lpCapturePractical",box).onclick=()=>{
   const rows=$$("#practicalRows tr").map(tr=>tr.innerText.trim()).filter(Boolean);const fit=$("#fitReadout")?.textContent||"";
   state.practical.capture=`Saved ${new Date().toLocaleDateString()}: ${rows.length} result rows. Graph/fit: ${fit}`;save();$("#lpPracticalCapture",box).textContent=state.practical.capture;
 };
}


/* Feature: progress/assignment codes and teacher dashboard */
function encodeCode(obj){try{return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))}catch{return ""}}
function decodeCode(code){try{return JSON.parse(decodeURIComponent(escape(atob(String(code).trim()))))}catch{return null}}
function progressPayload(name="Student"){
 return {type:"nuclear-progress-v1",name,at:now(),lessons:lessons().map((p,i)=>({title:p.title,progress:lessonProgress(i),complete:!!C()?.isComplete(i)})),diagnostic:state.diagnostic,misconceptions:state.misconceptions,confidence:calibration(),synoptic:state.synoptic};
}
function assignmentStudentHTML(){
 const a=state.assignments.student;
 if(!a)return `<article class="lp-card"><h3>Assignment</h3><p class="muted">Paste an assignment code from your teacher to create a focused task list.</p><label class="lp-field"><span>Assignment code</span><textarea id="lpAssignmentLoad" placeholder="Paste code"></textarea></label><div class="lp-actions"><button type="button" id="lpLoadAssignment">Load assignment</button></div><div id="lpAssignmentLoadFb"></div></article>`;
 const progress=a.lessons.map(i=>({i,p:lessonProgress(i)}));const done=progress.filter(x=>x.p>=a.minProgress).length;
 return `<article class="lp-card"><h3>Current assignment: ${esc(a.title||"Teacher assignment")}</h3><p class="muted">Due ${esc(a.due||"not set")} · target ${a.minProgress}% lesson progress.</p><div class="lp-progress"><i style="width:${a.lessons.length?done/a.lessons.length*100:0}%"></i></div><div class="lp-list" style="margin-top:9px">${progress.map(x=>`<div class="lp-list-item"><div><strong>${esc(lessons()[x.i]?.title||"Lesson")}</strong><small>${x.p}% complete</small></div><button type="button" data-open-lesson="${x.i}">${x.p>=a.minProgress?"Review":"Continue"}</button></div>`).join("")}</div><div class="lp-actions"><button type="button" id="lpClearAssignment">Clear assignment</button></div></article>`;
}
function bindAssignmentStudent(host){
 $("#lpLoadAssignment",host)?.addEventListener("click",()=>{
   const d=decodeCode($("#lpAssignmentLoad",host).value);
   if(!d||d.type!=="nuclear-assignment-v1"||!Array.isArray(d.lessons)){ $("#lpAssignmentLoadFb",host).innerHTML='<div class="lp-feedback lp-bad">That assignment code is not valid.</div>';return}
   state.assignments.student=d;save();renderToday();
 });
 $("#lpClearAssignment",host)?.addEventListener("click",()=>{state.assignments.student=null;save();renderToday()});
 bindOpenLessons(host);
}
function renderTeacher(){
 const host=$("#lp-teacher");if(!host)return;
 const avg=Math.round(lessons().reduce((a,_,i)=>a+lessonProgress(i),0)/Math.max(1,lessons().length));
 const weak=revisionItems().slice(0,5);
 host.innerHTML=`<div class="lp-grid"><article class="lp-card"><span class="eyebrow">Current learner/device</span><h3>Teacher dashboard</h3><div class="lp-metric-grid"><div class="lp-metric"><strong>${avg}%</strong><span>course completion</span></div><div class="lp-metric"><strong>${diagnosticScore().pct}%</strong><span>diagnostic</span></div><div class="lp-metric"><strong>${Object.keys(state.misconceptions).length}</strong><span>flagged areas</span></div><div class="lp-metric"><strong>${Object.values(state.synoptic).filter(x=>x.completed).length}</strong><span>A* tasks secure</span></div></div><h4 style="margin-top:12px">Priority areas</h4><div class="lp-chip-row">${weak.map(x=>`<span class="lp-chip weak">${esc(x.title)}</span>`).join("")||'<span class="muted">No priorities yet</span>'}</div><label class="lp-field"><span>Student name for export</span><input id="lpProgressName" value="Student"></label><div class="lp-actions"><button type="button" class="primary" id="lpMakeProgressCode">Generate progress code</button></div><label class="lp-field"><span>Progress code</span><textarea id="lpProgressCode" readonly></textarea></label></article>
 <article class="lp-card"><span class="eyebrow">Assignment mode</span><h3>Create an assignment</h3><label class="lp-field"><span>Assignment title</span><input id="lpAssignTitle" value="Nuclear Physics assignment"></label><label class="lp-field"><span>Due date</span><input type="date" id="lpAssignDue"></label><label class="lp-field"><span>Minimum lesson progress</span><select id="lpAssignMin"><option>60</option><option selected>80</option><option>100</option></select></label><div class="lp-list">${lessons().map((p,i)=>`<label class="lp-toggle"><span>${i+1}. ${esc(p.title)}</span><input type="checkbox" data-assign-lesson="${i}" ${i<3?"checked":""}></label>`).join("")}</div><div class="lp-actions"><button type="button" class="primary" id="lpBuildAssignment">Generate assignment code</button></div><label class="lp-field"><span>Assignment code</span><textarea id="lpAssignmentCode" readonly></textarea></label><label class="lp-field"><span>Direct assignment link</span><textarea id="lpAssignmentLink" readonly></textarea></label></article></div>
 <article class="lp-card" style="margin-top:12px"><div class="lp-hero"><div><h3>Class progress imports</h3><p>Students can send their progress code. Import several codes here to compare learners without requiring a server account.</p></div><span class="lp-chip">${state.teacherRecords.length} students</span></div><div class="lp-grid"><label class="lp-field"><span>Paste student progress code</span><textarea id="lpImportProgress"></textarea></label><div><div class="lp-actions"><button type="button" id="lpImportProgressBtn">Import student</button><button type="button" id="lpClearRecords">Clear imported class</button></div><div id="lpImportFb"></div></div></div><div class="lp-table-wrap"><table class="lp-table"><thead><tr><th>Student</th><th>Average</th><th>Diagnostic</th><th>Weakest lessons</th></tr></thead><tbody>${state.teacherRecords.map(r=>{const av=Math.round((r.lessons||[]).reduce((a,x)=>a+(x.progress||0),0)/Math.max(1,(r.lessons||[]).length));const ds=r.diagnostic?.answers||{};const dvals=Object.values(ds);const dp=dvals.length?Math.round(dvals.filter(x=>x.correct).length/dvals.length*100):0;const wl=(r.lessons||[]).slice().sort((a,b)=>a.progress-b.progress).slice(0,3).map(x=>x.title).join(", ");return `<tr><td>${esc(r.name)}</td><td>${av}%</td><td>${dp}%</td><td>${esc(wl)}</td></tr>`}).join("")}</tbody></table></div><h4 style="margin-top:14px">Class heatmap</h4><div class="lp-heat">${lessons().map((p,i)=>{const vals=state.teacherRecords.map(r=>r.lessons?.[i]?.progress).filter(v=>Number.isFinite(v));const av=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):lessonProgress(i);const cls=av>=80?"high":av>=50?"mid":"low";return `<button type="button" class="${cls}" title="${esc(p.title)}">${i+1}<br>${av}%</button>`}).join("")}</div></article>`;
 $("#lpMakeProgressCode",host).onclick=()=>{$("#lpProgressCode",host).value=encodeCode(progressPayload($("#lpProgressName",host).value||"Student"))};
 $("#lpBuildAssignment",host).onclick=()=>{const ls=$$("[data-assign-lesson]:checked",host).map(x=>Number(x.dataset.assignLesson));const a={type:"nuclear-assignment-v1",title:$("#lpAssignTitle",host).value.trim(),due:$("#lpAssignDue",host).value,minProgress:Number($("#lpAssignMin",host).value),lessons:ls,created:now()};state.assignments.teacher.push(a);save();const code=encodeCode(a);$("#lpAssignmentCode",host).value=code;$("#lpAssignmentLink",host).value=location.origin+location.pathname+"#assignment="+encodeURIComponent(code)};
 $("#lpImportProgressBtn",host).onclick=()=>{const d=decodeCode($("#lpImportProgress",host).value);if(!d||d.type!=="nuclear-progress-v1"){$("#lpImportFb",host).innerHTML='<div class="lp-feedback lp-bad">Invalid progress code.</div>';return}state.teacherRecords.push(d);save();renderTeacher()};
 $("#lpClearRecords",host).onclick=()=>{state.teacherRecords=[];save();renderTeacher()};
}

/* Feature: glossary + active recall */
function glossaryEntries(){
 const m=new Map();lessons().forEach((p,i)=>(p.vocab||[]).forEach(v=>{const key=v[0].toLowerCase();if(!m.has(key))m.set(key,{term:v[0],def:v[1],lesson:i,title:p.title})}));return [...m.values()].sort((a,b)=>a.term.localeCompare(b.term));
}
function renderGlossary(){
 const host=$("#lp-glossary");if(!host)return;const all=glossaryEntries(),query=(state.ui.glossaryQuery||"").toLowerCase(),filtered=all.filter(x=>x.term.toLowerCase().includes(query)||x.def.toLowerCase().includes(query));
 let idx=Math.min(Number(state.ui.glossaryIndex||0),Math.max(0,filtered.length-1)),g=filtered[idx];
 host.innerHTML=`<div class="lp-hero"><div><h3>Glossary + active recall</h3><p>Search the full course vocabulary, then test yourself without seeing the definition first.</p></div></div><label class="lp-field"><span>Search terms</span><input id="lpGlossarySearch" value="${esc(state.ui.glossaryQuery||"")}" placeholder="e.g. binding energy"></label><div class="lp-glossary"><div class="lp-glossary-list">${filtered.map((x,n)=>`<button type="button" data-gloss="${n}" class="${n===idx?"active":""}">${esc(x.term)}</button>`).join("")}</div><article class="lp-card">${g?`<span class="lp-chip">${esc(g.title)}</span><h3>${esc(g.term)}</h3><div id="lpGlossDef" class="lp-feedback">Definition hidden — say or write it from memory first.</div><label class="lp-field"><span>Your definition</span><textarea id="lpGlossAttempt"></textarea></label><div class="lp-actions"><button type="button" class="primary" id="lpGlossReveal">Reveal and compare</button><button type="button" id="lpGlossNext">Another term</button></div><div id="lpGlossCompare"></div>`:'<p>No matching vocabulary.</p>'}</article></div>`;
 $("#lpGlossarySearch",host).oninput=e=>{state.ui.glossaryQuery=e.target.value;state.ui.glossaryIndex=0;save();renderGlossary()};
 $$("[data-gloss]",host).forEach(b=>b.onclick=()=>{state.ui.glossaryIndex=Number(b.dataset.gloss);save();renderGlossary()});
 $("#lpGlossReveal",host)?.addEventListener("click",()=>{const ans=$("#lpGlossAttempt",host).value,hits=pointHit(ans,g.def);$("#lpGlossDef",host).innerHTML=`<strong>${esc(g.def)}</strong>`;$("#lpGlossCompare",host).innerHTML=`<div class="lp-feedback ${hits?"lp-good":"lp-warn"}">${hits?"Your definition contains the main idea.":"Compare your wording with the course definition and try again from memory later."}</div>`;const qid=`gloss-${g.term.toLowerCase()}`;state.retrieval[qid]={streak:hits?1:0,interval:hits?3:1,due:now()+(hits?3:1)*day,last:now(),custom:{q:"Define "+g.term,answer:g.def,lesson:g.lesson}};save()});
 $("#lpGlossNext",host)?.addEventListener("click",()=>{state.ui.glossaryIndex=(idx+1)%Math.max(1,filtered.length);save();renderGlossary()});
}

/* Feature: personalised exam paper generator */
function examFlat(){const out=[];exams().forEach((arr,i)=>(arr||[]).forEach((q,n)=>out.push({lesson:i,n,title:lessons()[i]?.title||"",...q})));return out}
function newPaper(count){
 const pool=examFlat().slice();for(let i=pool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]]}
 state.paper.current=pool.slice(0,Math.min(count,pool.length)).map(q=>({...q,answer:"",revealed:false}));state.paper.created=now();save();
}
function markPaperQuestion(i){
 const q=state.paper.current?.[i];if(!q)return;
 const result=autoMarkQuestion(q);
 q.hits=result.hits;q.autoScore=result.score;q.autoPct=result.pct;q.revealed=true;q.markedAt=now();save();
}
function markWholePaper(){
 const paper=state.paper.current||[];
 paper.forEach((q,i)=>markPaperQuestion(i));
 state.paper.history=state.paper.history||[];
 const totals=paperTotals(paper);
 state.paper.history.unshift({at:now(),score:totals.score,max:totals.max,pct:totals.pct,count:paper.length});
 state.paper.history=state.paper.history.slice(0,20);save();
}
function paperResultHTML(q){
 if(!Array.isArray(q.hits))return "";
 const score=Number(q.autoScore)||0,max=Number(q.marks)||0;
 const missing=q.hits.filter(x=>!x).length;
 return '<div class="lp-auto-score"><strong>'+score+' / '+max+' marks</strong><span>'+Math.round(max?score/max*100:0)+'%</span></div>'+
 '<div class="lp-markpoints">'+q.points.map((p,k)=>'<div class="lp-markpoint '+(q.hits[k]?"hit":"miss")+'"><strong>'+(q.hits[k]?"Mark likely awarded":"Missing / unclear")+'</strong> · '+esc(p)+'</div>').join("")+'</div>'+
 '<div class="lp-feedback '+(score===max?"lp-good":score>=Math.ceil(max*.6)?"lp-warn":"lp-bad")+'"><strong>'+(score===max?"Full-mark response":score>=Math.ceil(max*.6)?"Mostly secure":"Needs development")+'</strong><p>'+(missing?'Add the missing physics ideas above, then re-mark the answer.':'All listed mark points were detected in the response.')+'</p></div>';
}
function renderPaper(){
 const host=$("#lp-paper");if(!host)return;const paper=state.paper.current||[],tot=paperTotals(paper);
 host.innerHTML='<div class="lp-hero"><div><h3>Personalised mini-paper</h3><p>Generate a mixed paper from the course\'s original AQA-style question bank. Answers are auto-marked against transparent lesson mark points.</p></div><div class="lp-actions"><select id="lpPaperCount"><option>5</option><option selected>8</option><option>10</option><option>12</option></select><button type="button" class="primary" id="lpGeneratePaper">Generate paper</button></div></div>'+
 (paper.length?'<article class="lp-card"><div class="lp-paper-summary"><div><strong>'+tot.max+'</strong><span>available marks</span></div><div><strong>'+(tot.marked?tot.score:"—")+'</strong><span>auto-mark score</span></div><div><strong>'+(tot.marked?tot.pct+"%":"—")+'</strong><span>percentage</span></div><div><strong>'+tot.marked+'/'+tot.total+'</strong><span>questions marked</span></div></div><div class="lp-actions"><button type="button" class="primary" id="lpAutoMarkPaper">Auto-mark entire paper</button><button type="button" id="lpClearPaperMarks">Clear marks</button></div><div class="lp-feedback lp-warn"><strong>Practice marking estimate</strong><p>The marker checks the answer against the displayed physics mark points, including key terminology and numerical evidence. Extended prose can still need teacher/examiner judgement.</p></div>'+
 paper.map((q,i)=>'<div class="lp-paper-q"><span class="lp-chip">'+esc(q.title)+' · '+q.marks+' marks</span><h4>'+(i+1)+'. '+esc(q.q)+'</h4><div class="lp-coach"><strong>Command-word coach</strong><span>'+esc(commandCoach(q.q))+'</span></div><textarea data-paper-answer="'+i+'" placeholder="Write your answer">'+esc(q.answer||"")+'</textarea><div class="lp-actions"><button type="button" data-paper-mark="'+i+'">'+(Array.isArray(q.hits)?"Re-mark answer":"Auto-mark answer")+'</button></div><div data-paper-result="'+i+'">'+paperResultHTML(q)+'</div></div>').join("")+'</article>':'<article class="lp-card"><p class="muted">Generate a paper to begin.</p></article>');
 $("#lpGeneratePaper",host).onclick=()=>{newPaper(Number($("#lpPaperCount",host).value));renderPaper()};
 $$("[data-paper-answer]",host).forEach(t=>t.oninput=()=>{const q=state.paper.current[Number(t.dataset.paperAnswer)];q.answer=t.value;delete q.hits;delete q.autoScore;delete q.autoPct;save()});
 $$("[data-paper-mark]",host).forEach(b=>b.onclick=()=>{markPaperQuestion(Number(b.dataset.paperMark));renderPaper()});
 const all=$("#lpAutoMarkPaper",host);if(all)all.onclick=()=>{markWholePaper();renderPaper()};
 const clear=$("#lpClearPaperMarks",host);if(clear)clear.onclick=()=>{paper.forEach(q=>{delete q.hits;delete q.autoScore;delete q.autoPct;delete q.markedAt});save();renderPaper()};
}

/* Feature: progress reports */
function snapshot(){
 const d=new Date().toISOString().slice(0,10),avg=Math.round(lessons().reduce((a,_,i)=>a+lessonProgress(i),0)/Math.max(1,lessons().length));
 const last=state.history[state.history.length-1];if(last?.date===d){last.avg=avg}else state.history.push({date:d,avg});state.history=state.history.slice(-90);save();
}
function renderReports(){
 const host=$("#lp-reports");if(!host)return;snapshot();const name=state.ui.reportName||"Student",diag=diagnosticScore();
 host.innerHTML=`<div class="lp-hero"><div><h3>Progress report</h3><p>Printable summary of lesson completion, diagnostic performance, misconceptions and recommended next steps.</p></div><div class="lp-actions"><button type="button" class="primary" id="lpPrintReport">Print report</button><button type="button" id="lpReportCode">Generate progress code</button></div></div><label class="lp-field"><span>Student name</span><input id="lpReportName" value="${esc(name)}"></label><div id="lpReportCodeBox"></div><section class="lp-report" id="lpPrintableReport"><h2>AQA A-level Nuclear Physics Progress Report</h2><p><strong>Student:</strong> ${esc(name)} &nbsp; <strong>Date:</strong> ${new Date().toLocaleDateString()}</p><h3>Summary</h3><p>Diagnostic: ${diag.pct}% · Spaced retrieval due: ${dueRetrieval().length} · Misconception areas flagged: ${Object.keys(state.misconceptions).length}</p><h3>Lesson progress</h3><table><thead><tr><th>Lesson</th><th>Progress</th><th>Status</th></tr></thead><tbody>${lessons().map((p,i)=>`<tr><td>${i+1}. ${esc(p.title)}</td><td>${lessonProgress(i)}%</td><td>${C()?.isComplete(i)?"Mastered":lessonProgress(i)>=60?"Developing":"Needs attention"}</td></tr>`).join("")}</tbody></table><h3>Recommended next steps</h3><ol>${revisionItems().map(x=>`<li><strong>${esc(x.title)}</strong> — ${esc(x.detail)}</li>`).join("")||"<li>Continue spaced retrieval and A* synoptic practice.</li>"}</ol></section>`;
 $("#lpReportName",host).oninput=e=>{state.ui.reportName=e.target.value;save()};
 $("#lpPrintReport",host).onclick=()=>window.print();
 $("#lpReportCode",host).onclick=()=>{$("#lpReportCodeBox",host).innerHTML=`<label class="lp-field"><span>Shareable progress code</span><textarea readonly>${encodeCode(progressPayload($("#lpReportName",host).value||"Student"))}</textarea></label>`};
}


/* Feature: accessibility, read-aloud and offline/install state */
let installPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;renderIfOpen()});
function applyAccessibility(){
 const a=state.accessibility;
 document.body.classList.toggle("lp-font-large",!!a.largeText);
 document.body.classList.toggle("lp-high-contrast",!!a.highContrast);
 document.body.classList.toggle("lp-dyslexia",!!a.dyslexia);
 document.body.classList.toggle("lp-focus-mode",!!a.focusMode);
 document.body.classList.toggle("lp-reduce-motion",!!a.reduceMotion);
}
function speakActiveView(){
 if(!("speechSynthesis" in window))return false;
 speechSynthesis.cancel();
 const view=$(".view.active-view")||document.querySelector("main");
 const text=(view?.innerText||"").replace(/\s+/g," ").trim().slice(0,12000);
 if(!text)return false;
 const u=new SpeechSynthesisUtterance(text);u.rate=.95;speechSynthesis.speak(u);return true;
}
function renderSettings(){
 const host=$("#lp-settings");if(!host)return;const a=state.accessibility;
 const online=navigator.onLine;
 host.innerHTML=`<div class="lp-grid"><article class="lp-card"><span class="eyebrow">Accessibility</span><h3>Reading and display controls</h3>
 ${[["largeText","Larger text"],["highContrast","Higher contrast"],["dyslexia","Dyslexia-friendly spacing/font"],["reduceMotion","Reduce animation"],["focusMode","Focus mode — hide page chrome"]].map(([k,label])=>`<label class="lp-toggle"><span>${label}</span><input type="checkbox" data-a11y="${k}" ${a[k]?"checked":""}></label>`).join("")}
 <div class="lp-actions"><button type="button" id="lpReadAloud">Read current page aloud</button><button type="button" id="lpStopSpeech">Stop reading</button></div><p class="muted small">Read-aloud uses the browser's built-in speech engine when available.</p></article>
 <article class="lp-card"><span class="eyebrow">Offline / installable</span><h3>Use like an app</h3><div class="lp-feedback ${online?"lp-good":"lp-warn"}"><strong>${online?"Online":"Offline"}</strong><p>${online?"Core files are cached after use so the course can reopen with limited/no connection.":"You are currently using the offline cache where available."}</p></div><div class="lp-actions"><button type="button" class="primary" id="lpInstallApp" ${installPrompt?"":"disabled"}>Install app</button><button type="button" id="lpRefreshCache">Refresh offline cache</button></div><p class="muted small">${installPrompt?"Installation is available in this browser.":"If this button is disabled, use your browser's Install/Add to Home Screen option when supported."}</p><div id="lpOfflineFb"></div></article></div>`;
 $$("[data-a11y]",host).forEach(c=>c.onchange=()=>{state.accessibility[c.dataset.a11y]=c.checked;save();applyAccessibility()});
 $("#lpReadAloud",host).onclick=()=>{if(!speakActiveView())alert("Read-aloud is not available in this browser.")};
 $("#lpStopSpeech",host).onclick=()=>{if("speechSynthesis" in window)speechSynthesis.cancel()};
 $("#lpInstallApp",host).onclick=async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;renderSettings()};
 $("#lpRefreshCache",host).onclick=async()=>{try{const reg=await navigator.serviceWorker?.getRegistration();if(reg)await reg.update();$("#lpOfflineFb",host).innerHTML='<div class="lp-feedback lp-good">Offline cache update requested.</div>'}catch{$("#lpOfflineFb",host).innerHTML='<div class="lp-feedback lp-warn">The browser could not refresh the offline cache.</div>'}};
}
window.addEventListener("online",()=>renderIfOpen());window.addEventListener("offline",()=>renderIfOpen());
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}))}
applyAccessibility();

/*__LP_FEATURES__*/ 
})();