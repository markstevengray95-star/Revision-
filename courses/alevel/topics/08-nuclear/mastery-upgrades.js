(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const STORE="aqaNuclearMasteryV1", NOTE_STORE="aqaNuclearNotebookV1";
const topics=[
 {id:"rutherford",code:"3.8.1.1",name:"Rutherford scattering",sim:"Rutherford scattering"},
 {id:"radiation",code:"3.8.1.2",name:"α, β and γ",sim:"Radiation and absorption"},
 {id:"decay",code:"3.8.1.3",name:"Radioactive decay",sim:"Random decay and half-life"},
 {id:"stability",code:"3.8.1.4",name:"Nuclear instability",sim:"N–Z stability map"},
 {id:"radius",code:"3.8.1.5",name:"Nuclear radius",sim:"Nuclear radius and density"},
 {id:"energy",code:"3.8.1.6",name:"Mass and energy",sim:"Binding-energy curve"},
 {id:"fission",code:"3.8.1.7",name:"Induced fission",sim:"Fission chain reaction"},
 {id:"safety",code:"3.8.1.8",name:"Nuclear safety",sim:"Thermal reactor systems"},
 {id:"rp12",code:"RP12",name:"Inverse-square practical",sim:"Radiation and absorption"}
];
const qs=[
 {topic:"rutherford",q:"Which observation gives the strongest evidence that positive charge is concentrated in a tiny nucleus?",o:["Most alpha particles pass straight through","A very small fraction are scattered through large angles","The foil must be thin"],a:1,why:"Rare large-angle deflections require a strong repulsive field concentrated in a very small region."},
 {topic:"radiation",q:"Which statement is correct?",o:["Gamma has a single exact stopping thickness","Alpha is strongly ionising but weakly penetrating","Beta has no charge"],a:1,why:"Alpha loses energy rapidly through ionisation, so it has short range and low penetration."},
 {topic:"decay",q:"A nucleus has survived for several half-lives. What happens to its probability of decay per unit time?",o:["It increases","It decreases","It remains constant"],a:2,why:"For a given unstable nuclide, each undecayed nucleus has a constant decay probability per unit time."},
 {topic:"stability",q:"In beta-minus decay, what happens to A and Z?",o:["A unchanged, Z increases by 1","A decreases by 4, Z decreases by 2","A unchanged, Z decreases by 1"],a:0,why:"A neutron changes into a proton, so nucleon number stays constant while proton number rises by one."},
 {topic:"radius",q:"If nucleon number A increases by a factor of 8, what happens to nuclear radius?",o:["It doubles","It increases by a factor of 8","It quadruples"],a:0,why:"R is proportional to A^(1/3), and the cube root of 8 is 2."},
 {topic:"energy",q:"Why can fission of a heavy nucleus release energy?",o:["Products have greater average binding energy per nucleon","Some nucleons vanish","Charge is destroyed"],a:0,why:"The products move toward the higher-binding-energy-per-nucleon region, corresponding to a decrease in total rest mass and energy release."},
 {topic:"fission",q:"What is the main job of control rods in a thermal reactor model?",o:["Slow neutrons by elastic collisions","Absorb neutrons","Transfer thermal energy"],a:1,why:"Control rods absorb neutrons; moderator and coolant have different roles."},
 {topic:"safety",q:"Why is 'gamma is always the most dangerous radiation' an incomplete statement?",o:["Risk depends on exposure route, activity, time, distance and shielding","Gamma is never hazardous","Only alpha can ionise matter"],a:0,why:"Hazard and risk depend on the exposure situation, not only the radiation label."},
 {topic:"rp12",q:"What should be plotted to test an ideal inverse-square relationship using corrected count rate?",o:["Corrected count rate against distance","Corrected count rate against 1/r²","Background count rate against time"],a:1,why:"A linear relationship between corrected count rate and 1/r² supports the inverse-square model."}
];
let state={};try{state=JSON.parse(localStorage.getItem(STORE)||"{}")}catch{state={}}
let current=0,locked=false;
function save(){localStorage.setItem(STORE,JSON.stringify(state))}
function scores(){
 const out={};topics.forEach(t=>out[t.id]=state[t.id]===1?1:state[t.id]===0?0:null);return out;
}
function overall(){
 const vals=Object.values(scores()).filter(v=>v!==null);return vals.length?Math.round(100*vals.reduce((a,b)=>a+b,0)/vals.length):0;
}
function openSim(name){
 if(name==="Rutherford scattering"){
   const full=$('.nav-button[data-view="rutherfordexp"]');
   if(full){full.click();return}
 }
 const lab=$('.nav-button[data-view="lab"]');if(lab)lab.click();
 setTimeout(()=>{const b=$$(".sim-tab").find(x=>x.textContent.trim()===name);if(b)b.click();},80);
}
function openTopic(code){
 const sequenceBtn=$('.nav-button[data-view="sequence"]');
 if(sequenceBtn)sequenceBtn.click();
 setTimeout(()=>{
  const step=$$(".seq-step").find(x=>x.textContent.includes(code));
  if(step){step.click();step.scrollIntoView({block:"center",behavior:"smooth"});return}
  const course=$('.nav-button[data-view="course"]');if(course)course.click();
  setTimeout(()=>{const fallback=$$(".course-button").find(x=>x.textContent.includes(code));if(fallback)fallback.click()},60);
 },100);
}
function weakest(){
 const sc=scores();
 const wrong=topics.find(t=>sc[t.id]===0);if(wrong)return wrong;
 const unanswered=topics.find(t=>sc[t.id]===null);if(unanswered)return unanswered;
 return topics[0];
}
function renderHub(){
 const host=$("#masteryTopics");if(!host)return;
 const sc=scores();
 host.innerHTML=topics.map(t=>{
   const v=sc[t.id],pct=v===1?100:v===0?20:0,label=v===1?"Secure from diagnostic":v===0?"Needs review":"Not checked";
   return '<div class="mastery-topic"><strong>'+t.code+' · '+t.name+'</strong><span>'+label+'</span><div class="mastery-meter"><i style="width:'+pct+'%"></i></div></div>';
 }).join("");
 $("#masteryOverall").textContent=overall()+"%";
 const w=weakest();
 $("#nextStep").innerHTML='<strong>Recommended next step:</strong> '+w.code+' · '+w.name+'<div class="notebook-actions"><button class="button primary" id="nextLessonMastery">Open lesson</button><button class="button" id="nextSimMastery">Open simulation</button></div>';
 $("#nextLessonMastery").onclick=()=>openTopic(w.code);
 $("#nextSimMastery").onclick=()=>openSim(w.sim);
 renderQuestion();
}
function renderQuestion(){
 const q=qs[current],box=$("#diagQuestion");if(!box)return;locked=false;
 box.innerHTML='<span class="eyebrow">'+(current+1)+' / '+qs.length+' · '+topics.find(t=>t.id===q.topic).code+'</span><h3>'+q.q+'</h3><div class="diag-options">'+q.o.map((x,i)=>'<button data-da="'+i+'">'+x+'</button>').join("")+'</div><div id="diagFeedback"></div><div class="notebook-actions"><button class="button" id="prevDiag" '+(current===0?'disabled':'')+'>← Previous</button><button class="button" id="nextDiag">'+(current===qs.length-1?'Restart review':'Next →')+'</button></div>';
 $$("[data-da]",box).forEach(b=>b.onclick=()=>{
  if(locked)return;locked=true;const i=+b.dataset.da,ok=i===q.a;
  $$("[data-da]",box).forEach((x,j)=>{x.disabled=true;if(j===q.a)x.classList.add("correct");if(j===i&&!ok)x.classList.add("wrong")});
  state[q.topic]=ok?1:0;save();
  $("#diagFeedback").className="diag-feedback";$("#diagFeedback").textContent=(ok?"Correct. ":"Review this. ")+q.why;
  renderMetersOnly();
 });
 $("#prevDiag").onclick=()=>{if(current>0){current--;renderQuestion()}};
 $("#nextDiag").onclick=()=>{current=current===qs.length-1?0:current+1;renderQuestion()};
}
function renderMetersOnly(){
 const sc=scores();
 $$(".mastery-topic").forEach((el,i)=>{const t=topics[i],v=sc[t.id],pct=v===1?100:v===0?20:0;el.querySelector("span").textContent=v===1?"Secure from diagnostic":v===0?"Needs review":"Not checked";el.querySelector("i").style.width=pct+"%"});
 $("#masteryOverall").textContent=overall()+"%";
 const w=weakest();$("#nextStep").innerHTML='<strong>Recommended next step:</strong> '+w.code+' · '+w.name+'<div class="notebook-actions"><button class="button primary" id="nextLessonMastery">Open lesson</button><button class="button" id="nextSimMastery">Open simulation</button></div>';
 $("#nextLessonMastery").onclick=()=>openTopic(w.code);$("#nextSimMastery").onclick=()=>openSim(w.sim);
}
function openMasteryHub(){
 $$(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.view==="mastery"));
 $$(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-mastery"));
 renderHub();
 window.scrollTo({top:0,behavior:"smooth"});
}
function buildHub(){
 const nav=$(".main-nav"),main=$("main");if(!nav||!main)return;
 let btn=$('.nav-button[data-view="mastery"]');
 if(!btn){
   btn=document.createElement("button");btn.className="nav-button";btn.dataset.view="mastery";btn.textContent="A* mastery hub";nav.appendChild(btn);
   btn.addEventListener("click",openMasteryHub);
 }
 let sec=$("#view-mastery");
 if(!sec){
   sec=document.createElement("section");sec.className="view";sec.id="view-mastery";
   sec.innerHTML='<div class="section-head"><div><span class="eyebrow">Adaptive revision</span><h2>A* mastery hub</h2></div><p class="muted">Diagnose weak areas, revisit the exact lesson, then push into A* reasoning and exam technique.</p></div>'+
   '<div class="mastery-grid"><article class="panel mastery-panel"><div class="progress-head"><strong>Diagnostic mastery</strong><strong id="masteryOverall">0%</strong></div><div id="masteryTopics" class="mastery-topic-list"></div><div id="nextStep" class="next-step"></div></article>'+
   '<article class="panel mastery-panel"><span class="eyebrow">Diagnostic check</span><div id="diagQuestion"></div></article></div>'+
   '<article class="panel mastery-panel" style="margin-top:16px"><div class="section-head"><div><span class="eyebrow">A* reasoning ladder</span><h3>Move beyond recall</h3></div><p class="muted">Use these four habits on unfamiliar questions.</p></div><div class="command-grid">'+
   '<div class="command-card"><strong>1 · Evidence</strong><span>State exactly what the observation, graph or numerical result shows before explaining it.</span></div>'+
   '<div class="command-card"><strong>2 · Physics link</strong><span>Name the relevant interaction, model or equation and connect it explicitly to the evidence.</span></div>'+
   '<div class="command-card"><strong>3 · Quantify</strong><span>Use a proportional relationship, gradient, uncertainty or calculation whenever the information allows it.</span></div>'+
   '<div class="command-card"><strong>4 · Evaluate</strong><span>State model assumptions or limitations and make a conclusion that is justified by the evidence.</span></div>'+
   '</div></article>'+
   '<article class="panel mastery-panel" style="margin-top:16px"><h3>Command-word coach</h3><div class="command-grid"><div class="command-card"><strong>Describe</strong><span>State what the data, graph or model shows. Do not add a mechanism unless asked.</span></div><div class="command-card"><strong>Explain</strong><span>Build a cause → physics principle → effect chain using precise nuclear terminology.</span></div><div class="command-card"><strong>Calculate</strong><span>Write the equation, substitute in compatible units, calculate, give units and check magnitude.</span></div><div class="command-card"><strong>Evaluate</strong><span>Use evidence, limitations and a justified conclusion tied to the context.</span></div></div></article>';
   main.appendChild(sec);
 }
 renderHub();
}
function controlsSnapshot(){
 return $$("#simControls .field").map(f=>{
   const label=$("span",f)?.textContent?.trim()||"control";
   const input=$("input,select",f);
   const out=$("output",f);
   let value=out?.textContent?.trim()||input?.value||"";
   if(input?.tagName==="SELECT") value=input.options[input.selectedIndex]?.text||value;
   return label+": "+value;
 }).join(" · ");
}
function loadNotes(){try{return JSON.parse(localStorage.getItem(NOTE_STORE)||"[]")}catch{return []}}
function saveNotes(n){localStorage.setItem(NOTE_STORE,JSON.stringify(n))}
let compare={A:null,B:null};
function snapshot(){
 return {title:$("#simTitle")?.textContent?.trim()||"Simulation",controls:controlsSnapshot(),readout:$("#simReadout")?.innerText?.trim()||""};
}
function renderCompare(){
 const box=$("#compareBox");if(!box)return;
 const fmt=s=>s?'<strong>'+s.title+'</strong><div>'+s.controls+'</div><div class="muted">'+s.readout+'</div>':'<span class="muted">Not saved yet</span>';
 box.innerHTML='<div class="compare-grid"><div class="compare-state">'+fmt(compare.A)+'</div><div class="compare-state">'+fmt(compare.B)+'</div></div>'+(compare.A&&compare.B?'<div class="diag-feedback"><strong>Comparison prompt:</strong> Which changed variable explains the difference in the readout? State the relationship and physics reason.</div>':'');
}
function renderNotes(){
 const host=$("#notebookList");if(!host)return;const notes=loadNotes();
 host.innerHTML=notes.length?notes.slice().reverse().map(n=>'<article class="note-card"><div class="note-card-head"><h4>'+n.title+'</h4><small>'+n.date+'</small></div><div class="note-meta"><span>'+n.controls+'</span></div><div class="muted small">'+n.readout+'</div><div class="note-poe"><div><strong>Prediction</strong>'+esc(n.pred||"—")+'</div><div><strong>Observation</strong>'+esc(n.obs||"—")+'</div><div><strong>Explanation</strong>'+esc(n.exp||"—")+'</div></div></article>').join(""):'<p class="muted">No saved simulation evidence yet.</p>';
}
function esc(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]))}
function buildNotebook(){
 const lab=$("#view-lab");if(!lab||$("#labNotebook"))return;
 const box=document.createElement("article");box.className="panel lab-notebook";box.id="labNotebook";
 box.innerHTML='<div class="notebook-head"><div><span class="eyebrow">Evidence builder</span><h3 style="margin:5px 0">Simulation lab notebook</h3><p class="muted small">Predict first, change one variable, capture the evidence, then explain it.</p></div><div class="button-row"><button class="button" id="saveA">Save state A</button><button class="button" id="saveB">Save state B</button></div></div><div id="compareBox" class="compare-box"></div><div class="poe-grid"><label>Prediction<textarea id="poePred" placeholder="Before changing the control, I predict..."></textarea></label><label>Observation<textarea id="poeObs" placeholder="The model/readout changed by..."></textarea></label><label>Explanation<textarea id="poeExp" placeholder="This happens because..."></textarea></label></div><div class="notebook-actions"><button class="button primary" id="captureNote">Capture current evidence</button><button class="button" id="clearNotes">Clear notebook</button></div><div id="notebookList" class="notebook-list"></div>';
 lab.appendChild(box);
 $("#saveA").onclick=()=>{compare.A=snapshot();renderCompare()};
 $("#saveB").onclick=()=>{compare.B=snapshot();renderCompare()};
 $("#captureNote").onclick=()=>{
   const s=snapshot(),notes=loadNotes();
   notes.push({...s,date:new Date().toLocaleString(),pred:$("#poePred").value.trim(),obs:$("#poeObs").value.trim(),exp:$("#poeExp").value.trim()});
   saveNotes(notes.slice(-30));$("#poePred").value="";$("#poeObs").value="";$("#poeExp").value="";renderNotes();
 };
 $("#clearNotes").onclick=()=>{saveNotes([]);renderNotes()};
 renderCompare();renderNotes();
}
setTimeout(()=>{buildHub();buildNotebook()},120);
})();