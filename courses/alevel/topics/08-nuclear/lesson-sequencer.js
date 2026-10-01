(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const STORAGE="aqaNuclearSequencerV2";
const sequence=[
 {id:"L0",tier:"Foundation",title:"Start here: nuclei, isotopes and notation",code:"Bridge",minutes:50,sim:"radius",
  objectives:["Interpret A, Z and N correctly","Distinguish atomic and nuclear scales","Use isotope and nuclide notation confidently"],
  retrieval:["Name the particles in the nucleus.","What does atomic number tell you?"],
  teach:["Build A = Z + N from proton and neutron counts.","Use nuclide notation to compare isotopes.","Compare atomic radius (~10⁻¹⁰ m) with nuclear radius (~10⁻¹⁵ m)."],
  exam:"Explain why isotopes of one element have the same proton number but different nucleon numbers.",
  success:["I calculate N from A and Z","I read nuclide notation","I compare atomic and nuclear scales"],
  astar:"Estimate the order-of-magnitude size difference between atom and nucleus and explain why teaching diagrams cannot be to scale."},

 {id:"L1",tier:"Foundation",title:"Rutherford scattering and the nuclear model",code:"3.8.1.1",minutes:55,sim:"rutherford",
  objectives:["Describe Rutherford scattering observations","Separate observations from inferences","Explain deflection by electrostatic repulsion"],
  retrieval:["What charge does an alpha particle have?","What did the plum-pudding model assume?"],
  teach:["Classify straight-through, small-angle and rare large-angle events.","Build the evidence chain: observation → inference → nuclear model.","Use impact parameter and alpha energy qualitatively."],
  exam:"Explain how alpha-particle scattering changed the accepted model of atomic structure.",
  success:["I distinguish observation and inference","I explain rare large-angle scattering","I use 'small, massive, positively charged nucleus' precisely"],
  astar:"Predict how alpha-particle energy and impact parameter affect closest approach and scattering angle."},

 {id:"L2",tier:"Foundation",title:"Alpha, beta and gamma: properties and identification",code:"3.8.1.2",minutes:55,sim:"radiation",
  objectives:["Compare α, β and γ","Explain ionisation and penetration","Identify radiation from absorption evidence"],
  retrieval:["State the charge of α, β⁻ and γ.","Which radiation is electromagnetic?"],
  teach:["Compare charge, mass, speed, ionisation and penetration.","Interpret simple absorption experiments.","Connect interaction frequency with ionising effect."],
  exam:"A source emits unknown radiation. Explain how absorption measurements can help identify it.",
  success:["I compare all three radiations","I interpret absorption evidence","I avoid claiming gamma has one fixed stopping thickness"],
  astar:"Explain why ionising power and penetrating ability tend to show opposite trends for α, β and γ."},

 {id:"L3",tier:"Core",title:"Inverse-square gamma, background radiation and RP12",code:"3.8.1.2 / RP12",minutes:60,sim:"radiation",
  objectives:["Apply I ∝ 1/r²","Correct measurements for background","Plan and evaluate Required Practical 12"],
  retrieval:["What happens to intensity if distance doubles?","Why measure background radiation?"],
  teach:["Collect virtual count data at several distances.","Measure and subtract background count rate.","Plot corrected count rate against 1/r² and evaluate whether the relationship is supported.","Identify origins of background radiation and explain why repeated/longer counts improve reliability."],
  exam:"Explain how an experiment can test the inverse-square law for gamma radiation and how background count should be handled.",
  success:["I calculate 1/r²","I correct for background","I evaluate scatter and uncertainty","I explain safe-distance implications qualitatively"],
  astar:"Explain why finite source/detector geometry can cause deviations from ideal inverse-square behaviour at very small separations."},

 {id:"L4",tier:"Core",title:"Radiation applications, hazards and medical risk–benefit",code:"3.8.1.2",minutes:50,sim:"radiation",
  objectives:["Relate radiation properties to applications","Compare relative exposure hazards","Construct evidence-based risk–benefit arguments"],
  retrieval:["Which radiation is most strongly ionising?","Which is most penetrating?"],
  teach:["Connect penetration to thickness measurement applications.","Compare internal and external exposure qualitatively.","Use medical imaging/treatment examples to practise balanced risk–benefit reasoning."],
  exam:"Evaluate a medical use of ionising radiation by linking physical properties to both benefit and risk.",
  success:["I link property to application","I distinguish hazard from benefit","I make a physics-based evaluation"],
  astar:"Explain why a statement such as 'gamma is always more dangerous' is scientifically incomplete without exposure context."},

 {id:"L5",tier:"Core",title:"Random decay, activity and decay constant",code:"3.8.1.3",minutes:55,sim:"decay",
  objectives:["Explain random radioactive decay","Use A = λN","Interpret λ as constant probability per unit time"],
  retrieval:["What is one becquerel?","What does random mean for one nucleus?"],
  teach:["Compare unpredictable individual events with predictable population behaviour.","Connect activity to undecayed nuclei using A = λN.","Interpret λ and its inverse-time unit."],
  exam:"Explain why the activity of a large radioactive sample changes smoothly even though decay is random.",
  success:["I define activity","I interpret decay constant","I use A = λN"],
  astar:"Use a probability argument to explain why many independent nuclei produce an exponential population law."},

 {id:"L6",tier:"Core",title:"Exponential decay, half-life and logarithmic graphs",code:"3.8.1.3",minutes:60,sim:"decay",
  objectives:["Use N=N₀e⁻ˡᵗ and A=A₀e⁻ˡᵗ","Use T½=ln2/λ","Determine half-life or λ from graphs"],
  retrieval:["How many half-lives leave 1/8?","What is the unit of λ?"],
  teach:["Move between half-life and decay constant.","Solve exponential decay calculations.","Use decay curves and straight-line logarithmic plots.","Interpret the gradient of ln A against t."],
  exam:"A graph of ln A against t is linear. Explain how its gradient can be used to determine half-life.",
  success:["I solve exponential decay equations","I extract half-life graphically","I link gradient, λ and T½"],
  astar:"Compare uncertainty in a half-life obtained from a decay curve with one obtained from a suitable log-linear treatment."},

 {id:"L7",tier:"Secure",title:"Decay calculations with moles and Avogadro constant",code:"3.8.1.3",minutes:55,sim:"decay",
  objectives:["Find N from sample mass and molar mass","Combine N with A=λN","Solve multi-stage decay problems"],
  retrieval:["State the Avogadro constant relationship for number of particles.","What quantity does molar mass convert?"],
  teach:["Calculate amount in moles from mass/molar mass.","Use N = nN_A.","Combine with λ and activity, then apply exponential decay when required."],
  exam:"Determine the activity of a radioactive sample from its mass, molar mass and half-life.",
  success:["I convert mass to moles","I calculate number of nuclei","I combine Avogadro and decay equations"],
  astar:"Solve an unfamiliar multi-stage problem where both sample composition and elapsed decay time matter."},

 {id:"L8",tier:"Secure",title:"Nuclear instability and decay equations",code:"3.8.1.4",minutes:55,sim:"stability",
  objectives:["Interpret the N–Z stability graph","Write α, β⁻, β⁺ and electron-capture equations","Track changes in N, Z and A"],
  retrieval:["What changes in beta-minus decay?","What changes in alpha decay?"],
  teach:["Use movement on an N–Z plot to derive daughter nuclei.","Balance nucleon number and charge.","Compare beta-plus emission with electron capture."],
  exam:"Write and explain a beta-minus decay equation including changes in neutron and proton number.",
  success:["I balance decay equations","I derive changes rather than memorise them","I use the stability graph"],
  astar:"Compare β⁺ emission and electron capture as alternative proton-to-neutron transformations."},

 {id:"L9",tier:"Secure",title:"Excited nuclei, gamma emission and nuclear energy levels",code:"3.8.1.4",minutes:50,sim:"energyLevels",
  objectives:["Explain nuclear excited states","Interpret nuclear energy-level diagrams","Explain gamma emission without changing A or Z","Apply the model to technetium-99m"],
  retrieval:["Does gamma emission change proton number?","What does an excited state mean?"],
  teach:["Read transitions on nuclear energy-level diagrams.","Use ΔE = hf for emitted gamma photons.","Explain why metastable technetium-99m is useful as a diagnostic gamma source at A-level depth."],
  exam:"Use an energy-level diagram to determine the energy/frequency of a gamma photon and state the nuclear changes involved.",
  success:["I interpret nuclear level diagrams","I calculate photon energy or frequency","I explain why A and Z stay unchanged"],
  astar:"Distinguish nuclear gamma transitions from atomic electron transitions in both scale and physical origin."},

 {id:"L10",tier:"Secure",title:"Closest approach of alpha particles",code:"3.8.1.5",minutes:55,sim:"closestApproach",
  objectives:["Use Coulomb potential energy at closest approach","Relate alpha kinetic energy to minimum separation","Estimate nuclear-scale distances"],
  retrieval:["State the Coulomb potential-energy expression.","Why does an alpha particle slow as it approaches a positive nucleus head-on?"],
  teach:["Set initial kinetic energy equal to electrostatic potential energy for a head-on closest-approach estimate.","Keep charge factors and units explicit.","Explain why closest approach gives an upper bound/estimate related to nuclear size."],
  exam:"Calculate the distance of closest approach of an alpha particle to a nucleus from its kinetic energy.",
  success:["I convert MeV to joules","I use both nuclear charges correctly","I state the assumptions of the model"],
  astar:"Evaluate why closest-approach scattering and electron diffraction provide different kinds of evidence about nuclear radius."},

 {id:"L11",tier:"Secure",title:"Electron diffraction and nuclear radius",code:"3.8.1.5",minutes:55,sim:"electronDiffraction",
  objectives:["Recognise the nuclear diffraction intensity pattern","Use diffraction minima to reason about size","Explain why high-energy electrons probe nuclei"],
  retrieval:["What causes diffraction?","What is required of wavelength to resolve a small object?"],
  teach:["Interpret intensity against angle for electron diffraction by nuclei.","Connect de Broglie wavelength with resolving nuclear dimensions.","Use the position of diffraction features qualitatively to compare nuclear radii."],
  exam:"Explain how electron diffraction provides evidence for nuclear size and how a diffraction pattern changes for a larger nucleus.",
  success:["I identify minima/maxima","I link wavelength to resolution","I compare radius from diffraction patterns"],
  astar:"Use a simple diffraction condition supplied in a question to obtain an order-of-magnitude nuclear radius."},

 {id:"L12",tier:"Secure",title:"Radius law and nuclear density",code:"3.8.1.5",minutes:55,sim:"radius",
  objectives:["Use R=r₀A¹ᐟ³","Interpret radius data","Show why nuclear density is approximately constant"],
  retrieval:["State the scale of a typical nuclear radius.","What does A represent?"],
  teach:["Use cube-root scaling.","Derive R³ ∝ A.","Combine mass ≈ Au with spherical volume to calculate nuclear density."],
  exam:"Show that R=r₀A¹ᐟ³ predicts an approximately constant density of nuclear matter.",
  success:["I calculate R","I derive the constant-density argument","I calculate nuclear density"],
  astar:"Use experimental R–A data to estimate r₀ and comment on model quality."},

 {id:"L13",tier:"Exam",title:"Mass defect, binding energy and atomic mass unit",code:"3.8.1.6",minutes:60,sim:"massEnergy",
  objectives:["Define mass defect","Use ΔE=Δmc²","Use 1 u = 931.5 MeV","Calculate binding energy per nucleon"],
  retrieval:["State E=mc².","What does a bound system mean?"],
  teach:["Compare separated nucleon mass with bound-nucleus mass.","Convert u directly to MeV when appropriate.","Distinguish total binding energy from average binding energy per nucleon."],
  exam:"Calculate the binding energy per nucleon from nuclear and nucleon masses.",
  success:["I calculate mass defect","I convert u ↔ MeV","I interpret binding energy per nucleon"],
  astar:"Explain binding energy in terms of lower total system energy rather than saying energy is 'stored inside nucleons'."},

 {id:"L14",tier:"Exam",title:"Binding-energy curve, fusion and fission calculations",code:"3.8.1.6",minutes:60,sim:"binding",
  objectives:["Interpret the binding-energy-per-nucleon curve","Explain fusion and fission energy release","Calculate reaction energies from nuclear masses"],
  retrieval:["Where is average binding energy per nucleon greatest?","What happens to total mass when energy is released?"],
  teach:["Identify fusion and fission regions on the curve.","Calculate Q values from mass differences.","Explain energy release using increased total binding and reduced mass."],
  exam:"Use the binding-energy-per-nucleon curve and supplied nuclear masses to explain and calculate energy release.",
  success:["I interpret the graph","I calculate reaction energy","I explain both fission and fusion"],
  astar:"Separate what the binding-energy curve alone shows from what requires isotope-specific mass data."},

 {id:"L15",tier:"Exam",title:"Induced fission, chain reactions and critical mass",code:"3.8.1.7",minutes:55,sim:"fission",
  objectives:["Explain neutron-induced fission","Explain a chain reaction","Explain critical mass qualitatively","Track neutron production and losses"],
  retrieval:["What particle can induce fission?","Why can one fission lead to another?"],
  teach:["Follow neutrons between generations.","Compare neutron production with escape/absorption losses.","Explain critical mass in terms of geometry, escape and ability to sustain a chain reaction."],
  exam:"Explain why there is a minimum critical mass/geometry for a self-sustaining fission chain reaction.",
  success:["I explain induced fission","I describe neutron balance","I explain critical mass qualitatively"],
  astar:"Predict how changing surface-area-to-volume ratio affects neutron escape and the ability to sustain a chain reaction."},

 {id:"L16",tier:"Exam",title:"Thermal reactors: moderation, control rods and coolant",code:"3.8.1.7",minutes:60,sim:"reactor",
  objectives:["Explain why thermal neutrons are useful","Model moderation by elastic collision","Distinguish moderator, control rods and coolant","Discuss material properties"],
  retrieval:["What is a thermal neutron?","What does a moderator do?"],
  teach:["Use a mechanical collision model to explain neutron slowing.","Separate slowing from absorption.","Compare desirable properties of moderator, control-rod and coolant materials.","Connect component function to neutron balance and heat transfer."],
  exam:"Explain the functions of moderator, control rods and coolant and discuss suitable material properties for each.",
  success:["I explain moderation by collisions","I distinguish all component roles","I discuss material choice"],
  astar:"Use momentum/energy-transfer reasoning to explain why collisions with low-mass moderator nuclei can be effective."},

 {id:"L17",tier:"Exam",title:"Nuclear power safety, fuel and radioactive waste",code:"3.8.1.8",minutes:55,sim:"reactor",
  objectives:["Explain shielding and remote handling","Explain emergency shutdown","Discuss radioactive waste production and storage","Balance risks and benefits"],
  retrieval:["Why is shielding needed?","Why does half-life matter for waste?"],
  teach:["Link fuel handling to ionising-radiation risk.","Explain shielding, remote handling and emergency shutdown by function.","Connect waste-storage decisions to activity and half-life.","Construct evidence-based evaluations rather than generic pros/cons."],
  exam:"Evaluate the use of nuclear fission for electricity generation, including safety and waste considerations.",
  success:["I explain safety systems","I discuss waste using activity and half-life","I evaluate risk and benefit with physics"],
  astar:"Distinguish probability, consequence and uncertainty when evaluating nuclear-power risks."},

 {id:"L18",tier:"Astar",title:"A* synoptic mastery and final assessment",code:"3.8 Synoptic",minutes:70,sim:"binding",
  objectives:["Combine equations across the whole topic","Interpret unfamiliar experimental data","Write precise extended explanations","Identify and correct modelling assumptions"],
  retrieval:["Recall five key nuclear equations from memory.","Name three sources of experimental uncertainty in nuclear measurements."],
  teach:["Complete a mixed decay + Avogadro + mass-energy problem.","Interpret an unfamiliar diffraction or inverse-square dataset.","Build a six-mark explanation from evidence → physics → conclusion.","Review every specification statement using the checklist."],
  exam:"Complete a synoptic problem combining radioactive decay, data analysis, nuclear size and binding energy, showing every reasoning step.",
  success:["I select equations independently","I justify assumptions","I evaluate data quantitatively","I write precise extended answers","I can explain every AQA 3.8 statement"],
  astar:"Explain how experimental evidence, probabilistic decay and mass–energy models fit together while keeping the assumptions of each model distinct."}
]

let state;
try{state=JSON.parse(localStorage.getItem(STORAGE)||"{}")}catch{state={}}
state.mode=state.mode==="teacher"?"teacher":"student";
state.current=Number.isInteger(Number(state.current))?Math.max(0,Math.min(sequence.length-1,Number(state.current))):0;
state.done=(state.done&&typeof state.done==="object")?state.done:{};
state.mastery=(state.mastery&&typeof state.mastery==="object")?state.mastery:{};
state.notes=(state.notes&&typeof state.notes==="object")?state.notes:{};
let presentIndex=0;

function save(){localStorage.setItem(STORAGE,JSON.stringify(state));}
function ensureView(){
 const nav=$(".main-nav"); if(!nav||$("#view-sequence")) return;
 const b=document.createElement("button");b.className="nav-button";b.dataset.view="sequence";b.textContent="Lesson sequencer";nav.prepend(b);
 const main=nav.parentElement; const sec=document.createElement("section");sec.className="view";sec.id="view-sequence";
 sec.innerHTML='<div class="section-head"><div><span class="eyebrow">From zero to A*</span><h2>Complete Nuclear Physics lesson sequencer</h2></div><p class="muted">Use Student mode for self-study or Teacher mode to deliver the topic lesson by lesson.</p></div><div id="seqRoot"></div><div class="presentation-overlay" id="presentationOverlay"><button class="button presentation-close" id="presentationClose">Exit presentation</button><div class="presentation-inner"><div id="presentationSlide"></div><div class="presentation-controls"><button class="button" id="presentPrev">← Previous</button><button class="button primary" id="presentNext">Next →</button></div></div></div>';
 main.insertBefore(sec,$("#view-lab"));
 // Replace original nav handler behavior for this injected tab while allowing app.js handlers on old buttons.
 b.addEventListener("click",()=>openSequence());
 render();
}
function openSequence(){
 $$(".nav-button").forEach(x=>x.classList.toggle("active",x.dataset.view==="sequence"));
 $$(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-sequence"));
 window.scrollTo({top:0,behavior:"smooth"});
}
function masteryFor(id){return state.mastery[id]||0}
function completion(){
 const d=sequence.filter(x=>state.done[x.id]).length; return {d,total:sequence.length,p:Math.round(100*d/sequence.length)};
}
function nextRecommended(){
 const first=sequence.findIndex(x=>!state.done[x.id]); return first<0?sequence.length-1:first;
}
function tierClass(t){return t.toLowerCase().replace("*","star")}
function render(){
 const root=$("#seqRoot"); if(!root)return;
 const c=completion(), avg=Math.round(sequence.reduce((a,x)=>a+masteryFor(x.id),0)/(sequence.length*3)*100)||0;
 root.className="seq-shell "+(state.mode==="teacher"?"teacher-mode":"");
 root.innerHTML=
 '<aside class="panel seq-sidebar">'+
   '<div class="seq-top"><div><strong>Learning route</strong><div class="muted small">'+c.d+' of '+c.total+' lessons complete</div></div></div>'+
   '<div class="seq-progress-line"><span style="width:'+c.p+'%"></span></div>'+
   '<div class="seq-summary"><div><strong>'+c.p+'%</strong><span>course</span></div><div><strong>'+avg+'%</strong><span>mastery</span></div><div><strong>'+sequence.filter(x=>x.tier==="Exam"&&state.done[x.id]).length+'/3</strong><span>exam lessons</span></div><div><strong>'+sequence.filter(x=>x.tier==="Astar"&&state.done[x.id]).length+'/1</strong><span>A* challenge</span></div></div>'+
   '<div class="seq-mode"><button class="button '+(state.mode==="student"?"active":"")+'" data-mode="student">Student mode</button><button class="button '+(state.mode==="teacher"?"active":"")+'" data-mode="teacher">Teacher mode</button></div>'+
   '<div class="seq-route">'+sequence.map((l,i)=>'<button class="seq-step '+(i===state.current?"active ":"")+(state.done[l.id]?"complete ":"")+'" data-lesson="'+i+'"><span class="seq-num">'+(state.done[l.id]?"✓":i+1)+'</span><strong>'+l.title+'</strong><small>'+l.code+' · '+l.minutes+' min</small><span class="seq-tier '+tierClass(l.tier)+'">'+l.tier+'</span></button>').join("")+'</div>'+
 '</aside>'+
 '<main class="panel seq-main">'+lessonHTML(sequence[state.current])+'</main>';
 $$("[data-mode]",root).forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;save();render()});
 $$("[data-lesson]",root).forEach(b=>b.onclick=()=>{state.current=Number(b.dataset.lesson);save();render()});
 wireLesson();
}
function lessonHTML(l){
 const m=masteryFor(l.id), next=nextRecommended();
 const studentRoadmap='<section class="seq-card student-only seq-roadmap"><h3>Student lesson pathway</h3><div class="seq-roadmap-steps"><span>1 · Starter / retrieval</span><span>2 · Objectives & core knowledge</span><span>3 · Learn in small chunks</span><span>4 · Knowledge checks</span><span>5 · Worked example</span><span>6 · Guided practice</span><span>7 · Independent practice</span><span>8 · Simulation / activity</span><span>9 · Exam questions</span><span>10 · Exit ticket</span></div><p class="muted">Complete the interactive lesson above in order. Every question can be answered and checked inside the app.</p></section>';
 const teacherDelivery=state.mode==="teacher"?(
 '<div class="seq-delivery">'+
 phase("Do now / retrieval","5–8 min",'<ul>'+l.retrieval.map(x=>'<li>'+x+'</li>').join("")+'</ul>')+
 phase("Teach and model","15–20 min",'<ul>'+l.teach.map(x=>'<li>'+x+'</li>').join("")+'</ul>')+
 phase("Interactive simulation","10–15 min",'<p>Open the linked <strong>'+simName(l.sim)+'</strong> model. Change variables deliberately, predict first, then compare the result with the readout.</p><button class="button" data-open-sim="'+l.sim+'">Open simulation</button>')+
 phase("Exam application","10–15 min",'<p><strong>Exam task:</strong> '+l.exam+'</p><p class="muted">Require explicit physics vocabulary and a complete reasoning chain rather than keyword spotting.</p>')+
 phase("A* extension","5–10 min",'<p>'+l.astar+'</p>')+
 '</div>'):studentRoadmap;
 return '<section class="seq-hero"><span class="eyebrow">'+l.tier+' · '+l.code+'</span><h2>'+(state.current+1)+'. '+l.title+'</h2><p class="muted">Designed for a '+l.minutes+'-minute lesson. Students move from retrieval → core knowledge → guided checks → independent application → exam practice.</p><div class="seq-meta"><span>'+l.minutes+' minutes</span><span>'+l.objectives.length+' objectives</span><span>Interactive tasks</span><span>Exam practice</span></div></section>'+
 '<div class="seq-objectives">'+
  '<section class="seq-card"><h3>Learning objectives</h3><ul>'+l.objectives.map(x=>'<li>'+x+'</li>').join("")+'</ul></section>'+
  '<section class="seq-card"><h3>Success criteria</h3><ul>'+l.success.map(x=>'<li>'+x+'</li>').join("")+'</ul></section>'+
 '</div>'+
 teacherDelivery+
 '<section class="seq-card" style="margin-top:12px"><h3>Mastery check</h3><div class="mastery-row"><span>Current level</span><div class="mastery-dots">'+[1,2,3].map(n=>'<button class="mastery-dot '+(m>=n?"on":"")+'" data-mastery="'+n+'" title="Set mastery '+n+'"></button>').join("")+'</div><strong>'+["Not checked","Developing","Secure","Exam-ready"][m]+'</strong></div><p class="mastery-label">1 = developing · 2 = secure · 3 = can apply independently in unfamiliar exam contexts</p></section>'+
 '<div class="seq-recommend student-only"><strong>Recommended next:</strong> '+(state.done[l.id]?(next===state.current?"Revisit weak mastery areas or attempt the A* challenge.":sequence[next].title):"Complete the interactive lesson, then move to "+(sequence[Math.min(state.current+1,sequence.length-1)].title))+'</div>'+
 '<div class="teacher-panel"><section class="seq-card"><h3>Teacher delivery controls</h3><div class="teacher-tools"><div class="teacher-tool"><strong>Presentation mode</strong><span>Large classroom view of lesson phases.</span><button class="button" id="startPresent">Present lesson</button></div><div class="teacher-tool"><strong>Lesson status</strong><span>Mark the class sequence point.</span><button class="button" id="teacherComplete">'+(state.done[l.id]?"Reopen lesson":"Mark delivered")+'</button></div><div class="teacher-tool"><strong>Teaching note</strong><span>Saved on this device.</span><textarea id="teacherNote" style="width:100%;min-height:72px;background:#071522;color:var(--text);border:1px solid var(--border);border-radius:8px;padding:7px">'+escapeHTML(state.notes[l.id]||"")+'</textarea></div></div></section></div>'+
 '<div class="seq-actions"><button class="button primary" id="seqComplete">'+(state.done[l.id]?"Mark incomplete":"Mark lesson complete")+'</button><button class="button" id="seqPrevious" '+(state.current===0?"disabled":"")+'>← Previous lesson</button><button class="button" id="seqNext" '+(state.current===sequence.length-1?"disabled":"")+'>Next lesson →</button></div>';
}
function phase(title,time,html){return '<section class="seq-phase"><button><span>'+title+'</span><span class="time">'+time+'</span></button><div class="seq-phase-content">'+html+'</div></section>'}
function simName(id){const names={rutherford:"Rutherford scattering",radiation:"radiation and absorption",decay:"random decay",stability:"N–Z stability",energyLevels:"nuclear energy levels",closestApproach:"alpha closest approach",electronDiffraction:"electron diffraction",radius:"nuclear radius",massEnergy:"mass defect",binding:"binding-energy curve",fission:"fission chain",moderation:"neutron moderation",reactor:"reactor systems"};return names[id]||id}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function wireLesson(){
 $$(".seq-phase > button",$("#seqRoot")).forEach(b=>b.onclick=()=>b.parentElement.classList.toggle("open"));
 $$("[data-mastery]",$("#seqRoot")).forEach(b=>b.onclick=()=>{const l=sequence[state.current];state.mastery[l.id]=Number(b.dataset.mastery);save();render()});
 $$("[data-open-sim]",$("#seqRoot")).forEach(b=>b.onclick=()=>openSim(b.dataset.openSim));
 $("#seqComplete").onclick=()=>toggleDone();
 if($("#teacherComplete"))$("#teacherComplete").onclick=()=>toggleDone();
 $("#seqPrevious").onclick=()=>{if(state.current>0){state.current--;save();render()}};
 $("#seqNext").onclick=()=>{if(state.current<sequence.length-1){state.current++;save();render()}};
 if($("#teacherNote"))$("#teacherNote").oninput=e=>{state.notes[sequence[state.current].id]=e.target.value;save()};
 if($("#startPresent"))$("#startPresent").onclick=startPresentation;
}
function toggleDone(){const id=sequence[state.current].id;state.done[id]=!state.done[id];save();render()}
function openSim(id){
 if(id==="rutherford"){
   const full=$('.nav-button[data-view="rutherfordexp"]');
   if(full){full.click();return;}
 }
 const tabs=$$(".sim-tab"); const idx=tabs.findIndex(b=>b.textContent.toLowerCase().includes(simName(id).split(" ")[0].toLowerCase()));
 const labBtn=$('.nav-button[data-view="lab"]'); if(labBtn)labBtn.click();
 if(idx>=0)setTimeout(()=>tabs[idx].click(),60);
}
function slidesFor(l){
 return [
  {eyebrow:l.code,title:l.title,body:"By the end: "+l.objectives.join(" · ")},
  {eyebrow:"Retrieval",title:"Do now",body:"<ul>"+l.retrieval.map(x=>"<li>"+x+"</li>").join("")+"</ul>"},
  {eyebrow:"Core model",title:"Build the physics",body:"<ul>"+l.teach.map(x=>"<li>"+x+"</li>").join("")+"</ul>"},
  {eyebrow:"Exam application",title:"Now apply it",body:"<p>"+l.exam+"</p>"},
  {eyebrow:"A* extension",title:"Push the reasoning",body:"<p>"+l.astar+"</p>"},
  {eyebrow:"Exit check",title:"Can you do these independently?",body:"<ul>"+l.success.map(x=>"<li>"+x+"</li>").join("")+"</ul>"}
 ];
}
function startPresentation(){presentIndex=0;$("#presentationOverlay").classList.add("open");renderPresent()}
function renderPresent(){const l=sequence[state.current],slides=slidesFor(l),s=slides[presentIndex];$("#presentationSlide").className="presentation-slide";$("#presentationSlide").innerHTML='<div><span class="eyebrow">'+s.eyebrow+'</span><h1>'+s.title+'</h1><div>'+s.body+'</div><p class="muted">'+(presentIndex+1)+' / '+slides.length+'</p></div>';$("#presentPrev").disabled=presentIndex===0;$("#presentNext").textContent=presentIndex===slides.length-1?"Finish":"Next →"}
document.addEventListener("click",e=>{
 if(e.target&&e.target.id==="presentationClose")$("#presentationOverlay").classList.remove("open");
 if(e.target&&e.target.id==="presentPrev"&&presentIndex>0){presentIndex--;renderPresent()}
 if(e.target&&e.target.id==="presentNext"){const n=slidesFor(sequence[state.current]).length;if(presentIndex<n-1){presentIndex++;renderPresent()}else $("#presentationOverlay").classList.remove("open")}
});
setTimeout(ensureView,0);
})();