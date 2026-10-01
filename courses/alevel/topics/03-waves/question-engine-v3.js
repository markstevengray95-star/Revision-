(()=>{
  "use strict";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=(v,d=3)=>Number.isFinite(v)?Number(v.toFixed(d)).toString():"—";
  const STORE="wavesQuestionEngineV3";
  const TOPICS={progressive:"Progressive waves",phase:"Phase",polarisation:"Polarisation",stationary:"Stationary waves",interference:"Interference",diffraction:"Diffraction & gratings",refraction:"Refraction & TIR",fibres:"Optical fibres",practicals:"Practical skills"};
  let S={attempts:0,correct:0,marks:0,totalMarks:0,topic:{},misconceptions:{},history:[],mode:"adaptive",paper:[],index:0};
  try{S=Object.assign(S,JSON.parse(localStorage.getItem(STORE)||"{}"));}catch(e){}
  const save=()=>localStorage.setItem(STORE,JSON.stringify(S));
  const pick=(arr,i)=>arr[Math.abs(i)%arr.length];
  const round=(v,d=3)=>Number(v.toFixed(d));
  const shuffled=a=>a.map(x=>[Math.random(),x]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]);
  const keywordHit=(text,group)=>group.some(k=>new RegExp(k,"i").test(text));
  const mk=(base,extra={})=>Object.assign({difficulty:2,math:false,practical:false,command:"Calculate",misconception:"",type:"numeric",marks:2,tolerance:.02},base,extra);

  function generate(i){
    const k=i%18, n=Math.floor(i/18), d=1+(n%3);
    const lamNm=pick([450,480,520,550,589,600,633,650],i)+((n%4)*2);
    const lam=lamNm*1e-9;
    const f=pick([2.4,3.0,4.5,6.0,8.0,12],i+n)*100;
    const v=pick([240,300,330,340,360],i+2*n);
    if(k===0){const L=v/f;return mk({id:`Q${i+1}`,topic:"progressive",spec:"3.3.1.1",skill:"wave equation",prompt:`A progressive wave has frequency ${f} Hz and speed ${v} m s⁻¹. Calculate its wavelength.`,answer:L,unit:"m",marks:2,steps:["v=fλ","λ=v/f",`${v}/${f}`,fmt(L,4)]},{difficulty:d,math:true,misconception:"using period instead of frequency"});}
    if(k===1){const frac=pick([.125,.25,.375,.5,.75],n);const phi=2*Math.PI*frac;return mk({id:`Q${i+1}`,topic:"phase",spec:"3.3.1.1",skill:"phase difference",prompt:`Two points on a sinusoidal wave are separated by ${frac}λ. Calculate their phase difference in radians.`,answer:phi,unit:"rad",marks:2,steps:["Δφ=2πΔx/λ",`Δx/λ=${frac}`,`2π×${frac}`,fmt(phi,3)]},{difficulty:d,math:true,misconception:"confusing phase with amplitude"});}
    if(k===2){const L=round(.6+.1*(n%7),2),T=pick([12,18,24,32,40],n),mu=pick([.003,.004,.005,.006,.008],n+2),harm=1+(n%4),ans=harm/(2*L)*Math.sqrt(T/mu);return mk({id:`Q${i+1}`,topic:"stationary",spec:"3.3.1.3",skill:"stretched string harmonics",prompt:`A string of length ${L} m has tension ${T} N and mass per unit length ${mu.toExponential(1)} kg m⁻¹. Calculate the frequency of harmonic n=${harm}.`,answer:ans,unit:"Hz",marks:4,steps:["v=√(T/μ)","fₙ=nv/(2L)",`√(${T}/${mu})`,fmt(ans,3)]},{difficulty:d,math:true,misconception:"using L as a whole wavelength for every harmonic"});}
    if(k===3){const opts=["same frequency and constant phase difference","same amplitude only","same wavelength but random phase","same speed only"];return mk({id:`Q${i+1}`,topic:"interference",spec:"3.3.2.1",skill:"coherence",prompt:"Which statement best defines coherent sources?",type:"mcq",choices:opts,correct:0,marks:1,command:"Select",misconception:"coherent means exactly in phase"},{difficulty:d});}
    if(k===4){const D=round(1.5+.25*(n%6),2),smm=pick([.25,.30,.35,.40,.50],n),s=smm*1e-3,w=lam*D/s;return mk({id:`Q${i+1}`,topic:"interference",spec:"3.3.2.1",skill:"Young double slit",prompt:`Light of wavelength ${lamNm} nm passes through slits separated by ${smm} mm. The screen is ${D} m away. Calculate the fringe spacing.`,answer:w*1000,unit:"mm",marks:3,steps:["w=λD/s","convert nm and mm to m",`(${lamNm}×10⁻⁹×${D})/(${smm}×10⁻³)`,fmt(w*1000,3)]},{difficulty:d,math:true,practical:true,misconception:"forgetting unit conversions"});}
    if(k===5){return mk({id:`Q${i+1}`,topic:"diffraction",spec:"3.3.2.2",skill:"single slit diffraction",prompt:"Explain what happens to the diffraction pattern when the slit width is decreased while wavelength stays constant.",type:"written",marks:3,command:"Explain",markPoints:[["more diffraction|greater spreading|spreads more"],["central maximum.*wider|wider central"],["slit.*comparable.*wavelength|ratio.*wavelength.*slit|smaller aperture"]],model:"The wave diffracts more strongly, so the central maximum becomes wider because the aperture size is smaller relative to the wavelength.",misconception:"diffraction only happens when gap equals wavelength"},{difficulty:d});}
    if(k===6){const lines=pick([300,400,500,600],n),order=1+(n%2),theta=pick([15,20,25,30,35],n+1)*Math.PI/180,dspace=1/(lines*1e3),ans=dspace*Math.sin(theta)/order*1e9;return mk({id:`Q${i+1}`,topic:"diffraction",spec:"3.3.2.2",skill:"diffraction grating",prompt:`A grating has ${lines} lines mm⁻¹. The order n=${order} maximum is measured at ${round(theta*180/Math.PI,1)}°. Calculate the wavelength.`,answer:ans,unit:"nm",marks:4,steps:["d=1/N","d sinθ=nλ","convert lines mm⁻¹ to lines m⁻¹",fmt(ans,3)]},{difficulty:d,math:true,practical:true,misconception:"using line density directly as grating spacing"});}
    if(k===7){const lines=pick([400,500,600],n),lambda=pick([450,550,650],n)*1e-9,dspace=1/(lines*1e3),ans=Math.floor(dspace/lambda);return mk({id:`Q${i+1}`,topic:"diffraction",spec:"3.3.2.2",skill:"maximum grating order",prompt:`A ${lines} lines mm⁻¹ grating is used with ${Math.round(lambda*1e9)} nm light. Determine the greatest possible diffraction order.`,answer:ans,unit:"",marks:3,steps:["d=1/N","nλ≤d","n≤d/λ",String(ans)]},{difficulty:d,math:true,misconception:"rounding maximum order up"});}
    if(k===8){const n1=1,n2=pick([1.33,1.42,1.50,1.60],n),a=pick([20,30,40,50],n)*Math.PI/180,ans=Math.asin(n1*Math.sin(a)/n2)*180/Math.PI;return mk({id:`Q${i+1}`,topic:"refraction",spec:"3.3.2.3",skill:"Snell law",prompt:`Light travels from air into a material of refractive index ${n2}. The angle of incidence is ${round(a*180/Math.PI,1)}°. Calculate the angle of refraction.`,answer:ans,unit:"°",marks:3,steps:["n₁sinθ₁=n₂sinθ₂","sinθ₂=n₁sinθ₁/n₂","angles measured from normal",fmt(ans,3)]},{difficulty:d,math:true,misconception:"measuring angles from the surface"});}
    if(k===9){const n1=pick([1.42,1.50,1.52,1.60],n),n2=1,ans=Math.asin(n2/n1)*180/Math.PI;return mk({id:`Q${i+1}`,topic:"refraction",spec:"3.3.2.3",skill:"critical angle",prompt:`A transparent material has refractive index ${n1} and is surrounded by air. Calculate its critical angle.`,answer:ans,unit:"°",marks:3,steps:["sinθc=n₂/n₁",`sinθc=1/${n1}`,"inverse sine",fmt(ans,3)]},{difficulty:d,math:true,misconception:"TIR occurs from low to high refractive index"});}
    if(k===10){return mk({id:`Q${i+1}`,topic:"fibres",spec:"3.3.2.3",skill:"fibre dispersion",prompt:"Explain the difference between modal dispersion and material dispersion in a step-index optical fibre, and state one way to reduce each.",type:"written",marks:4,command:"Explain",markPoints:[["different paths|path lengths"],["single.mode|narrow core"],["different wavelength.*different speed|refractive index.*wavelength"],["monochromatic|narrow.*wavelength|laser"]],model:"Modal dispersion arises because modes follow different path lengths and is reduced by single-mode fibre. Material dispersion arises because different wavelengths travel at different speeds and is reduced by a narrow-band source.",misconception:"absorption and dispersion are the same process"},{difficulty:d});}
    if(k===11){return mk({id:`Q${i+1}`,topic:"practicals",spec:"RP1",skill:"experimental design",prompt:"In the stationary-wave required practical, explain how a student could test the prediction f ∝ 1/L while keeping other important variables controlled.",type:"written",marks:4,command:"Explain",practical:true,markPoints:[["vary.*length|change.*L"],["keep.*tension|same.*mass"],["keep.*mass per unit length|same string|same μ"],["plot.*f.*1/L|linear.*f.*against.*1/L"]],model:"Vary the vibrating length while keeping the same string and tension. Find the resonant frequency for the same harmonic at each length and plot f against 1/L; a straight line supports f ∝ 1/L.",misconception:"changing several independent variables together"},{difficulty:d});}
    if(k===12){return mk({id:`Q${i+1}`,topic:"practicals",spec:"RP2",skill:"uncertainty",prompt:"Why is it usually better to measure the distance across several Young double-slit fringes and divide by the number of fringe spacings rather than measuring one spacing?",type:"written",marks:2,command:"Explain",practical:true,markPoints:[["larger distance|multiple fringes|several fringes"],["percentage uncertainty.*smaller|fractional uncertainty.*smaller|reduces.*percentage"]],model:"The measured distance is larger while the ruler resolution is unchanged, so the fractional/percentage uncertainty is smaller.",misconception:"repeats remove systematic error"},{difficulty:d});}
    if(k===13){const opts=["f against 1/L","f against L²","f² against 1/L","1/f against 1/L²"];return mk({id:`Q${i+1}`,topic:"practicals",spec:"RP1",skill:"graph linearisation",prompt:"For a fixed harmonic, tension and mass per unit length, which graph should be linear if f ∝ 1/L?",type:"mcq",choices:opts,correct:0,marks:1,command:"Select",practical:true,misconception:"plotting raw variables without linearising"},{difficulty:d});}
    if(k===14){return mk({id:`Q${i+1}`,topic:"polarisation",spec:"3.3.1.2",skill:"polarisation",prompt:"Explain why the ability of electromagnetic radiation to be plane-polarised is evidence that electromagnetic waves are transverse.",type:"written",marks:3,command:"Explain",markPoints:[["oscillation|field"],["perpendicular.*propagation|perpendicular.*direction"],["polariser.*select|one plane|one direction"]],model:"Polarisation selects one oscillation direction perpendicular to propagation. This is only possible for transverse oscillations, so the observation supports the transverse nature of electromagnetic waves.",misconception:"polarisation proves a wave is longitudinal"},{difficulty:d});}
    if(k===15){const opts=["Sound in air is longitudinal; light is transverse.","Sound and light are both longitudinal.","Sound is transverse; light is longitudinal.","Both are transverse."];return mk({id:`Q${i+1}`,topic:"polarisation",spec:"3.3.1.2",skill:"wave type",prompt:"Which statement correctly compares sound in air with electromagnetic radiation?",type:"mcq",choices:opts,correct:0,marks:1,command:"Select",misconception:"drawing sound as literal transverse crests"},{difficulty:d});}
    if(k===16){const A=pick([2,3,4,5],n),B=pick([1,2,3],n+1),same=n%2===0,ans=same?A+B:Math.abs(A-B);return mk({id:`Q${i+1}`,topic:"interference",spec:"3.3.1.3",skill:"superposition",prompt:`Two waves overlap at a point with instantaneous displacements ${A} mm and ${same?B:-B} mm. Calculate the resultant displacement at that instant.`,answer:ans,unit:"mm",marks:2,steps:["resultant displacement is algebraic sum",`${A}+(${same?B:-B})`,String(ans)]},{difficulty:d,math:true,misconception:"adding amplitudes regardless of sign"});}
    const values=[round(39.8+(n%5)*.4,1),round(40.2+(n%4)*.3,1),round(39.9+(n%3)*.5,1)];const mean=values.reduce((a,b)=>a+b,0)/values.length,half=(Math.max(...values)-Math.min(...values))/2;return mk({id:`Q${i+1}`,topic:"practicals",spec:"3.1 + RP1/RP2",skill:"data analysis",prompt:`A student obtains repeated frequency readings ${values.join(", ")} Hz. Calculate the mean and estimate the random uncertainty using half the range. Enter the mean frequency.`,answer:mean,unit:"Hz",marks:3,steps:["calculate arithmetic mean",`(${values.join("+")})/${values.length}`,`half-range uncertainty=${fmt(half,2)} Hz`,fmt(mean,3)]},{difficulty:d,math:true,practical:true,misconception:"using full range rather than half range"});
  }

  const BANK=Array.from({length:360},(_,i)=>generate(i));
  let current=null,session=[],idx=0,score=0,possible=0,marked=false;
  function topicScore(topic){const t=S.topic[topic]||{m:0,p:0};return t.p?100*t.m/t.p:0;}
  function weakestTopic(){return Object.keys(TOPICS).sort((a,b)=>topicScore(a)-topicScore(b))[0];}
  function filterBank(filters={}){return BANK.filter(q=>(!filters.topic||filters.topic==="all"||q.topic===filters.topic)&&(!filters.type||filters.type==="all"||q.type===filters.type)&&(!filters.practical||q.practical));}
  function selectAdaptive(){const weak=weakestTopic();const pool=filterBank({topic:weak});return pick(pool,S.attempts+Math.floor(Math.random()*pool.length));}
  function makePaper(mode){
    if(mode==="paper1"){
      const written=shuffled(BANK.filter(q=>!q.practical&&q.type!=="mcq")).slice(0,14);
      const mcq=shuffled(BANK.filter(q=>q.type==="mcq")).slice(0,6);
      return [...written,...mcq];
    }
    if(mode==="paper3") return shuffled(BANK.filter(q=>q.practical)).slice(0,16);
    if(mode==="simulation"){
      const sim=$(".sim-tab.active")?.dataset.sim||"progressive";
      const map={progressive:"progressive",polarisation:"polarisation",standing:"stationary",interference:"interference",doubleSlit:"interference",diffraction:"diffraction",grating:"diffraction",refraction:"refraction",fibre:"fibres"};
      return shuffled(BANK.filter(q=>q.topic===(map[sim]||"progressive"))).slice(0,12);
    }
    return [];
  }

  function install(){
    const view=$("#view-exam");if(!view||$("#assessmentCentreV3"))return;
    const old=$(".quiz-layout",view);const shell=document.createElement("div");shell.id="assessmentCentreV3";shell.className="assessment-centre-v3";
    shell.innerHTML=`<div class="paper-banner"><strong>Waves Assessment Centre</strong><span class="muted small">360 original AQA-style question variants · tagged by specification point, skill, marks, command word, practical demand and misconception. Paper modes are Waves-focused practice, not official AQA papers.</span></div>
      <div class="assessment-toolbar">
        <button class="button primary" data-assess-mode="adaptive">Adaptive</button><button class="button" data-assess-mode="paper1">Paper 1-style</button><button class="button" data-assess-mode="paper3">Paper 3 practical/data</button><button class="button" data-assess-mode="working">Mark my working</button><button class="button" data-assess-mode="simulation">From simulation</button><button class="button" data-assess-mode="bank">Question bank</button>
      </div><div class="assessment-layout"><aside class="panel assessment-side" id="assessmentSide"></aside><article class="panel assessment-main" id="assessmentMain"></article></div>`;
    if(old)view.insertBefore(shell,old);else view.appendChild(shell);
    $$('[data-assess-mode]',shell).forEach(b=>b.onclick=()=>startMode(b.dataset.assessMode));
    startMode("adaptive");
  }

  function startMode(mode){
    S.mode=mode;save();$$('[data-assess-mode]').forEach(b=>b.classList.toggle("primary",b.dataset.assessMode===mode));
    score=0;possible=0;idx=0;marked=false;
    if(mode==="adaptive")session=[selectAdaptive()];
    else if(mode==="working")session=shuffled(BANK.filter(q=>q.type==="numeric"&&q.steps)).slice(0,12);
    else if(mode==="bank")session=[];
    else session=makePaper(mode);
    renderSide(); if(mode==="bank")renderBank(); else renderQuestion();
  }

  function renderSide(){
    const side=$("#assessmentSide");if(!side)return;
    const modeNames={adaptive:"Adaptive practice",paper1:"Waves Paper 1-style mini-paper",paper3:"Waves Paper 3 practical/data",working:"Mark my working",simulation:"Simulation-linked practice",bank:"Question bank"};
    side.innerHTML=`<span class="eyebrow">${modeNames[S.mode]||"Assessment"}</span><h3>${BANK.length} generated variants</h3><div class="assessment-stats"><div><strong>${score}</strong><span>marks this session</span></div><div><strong>${possible}</strong><span>available marks answered</span></div><div><strong>${S.attempts||0}</strong><span>lifetime attempts</span></div><div><strong>${S.totalMarks?Math.round(100*S.marks/S.totalMarks):0}%</strong><span>lifetime marks</span></div></div>
      <div class="paper-progress"><span style="width:${session.length?100*idx/session.length:0}%"></span></div><p class="muted small">${session.length?`Question ${Math.min(idx+1,session.length)} of ${session.length}`:"Browse by topic and skill."}</p>
      <h3>Topic diagnosis</h3><div class="assessment-meta">${Object.entries(TOPICS).map(([k,v])=>`<span class="mini-badge">${v}: ${Math.round(topicScore(k))}%</span>`).join("")}</div>
      <h3>Recent misconceptions</h3><div>${Object.entries(S.misconceptions||{}).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([m,c])=>`<span class="misconception-chip">${m} ×${c}</span>`).join(" ")||'<span class="muted small">No diagnostic pattern recorded yet.</span>'}</div>`;
  }

  function renderQuestion(){
    const main=$("#assessmentMain");if(!main)return;if(!session.length){main.innerHTML='<p>No questions available for this mode.</p>';return;}if(idx>=session.length){renderSummary();return;}
    current=session[idx];marked=false;
    const q=current;main.innerHTML=`<div class="assessment-tags"><span class="assessment-tag">${q.spec}</span><span class="assessment-tag">${TOPICS[q.topic]}</span><span class="assessment-tag">${q.skill}</span><span class="assessment-tag">${q.command}</span><span class="assessment-tag">${q.marks} mark${q.marks===1?"":"s"}</span><span class="assessment-tag">difficulty ${q.difficulty}/3</span>${q.practical?'<span class="assessment-tag">practical</span>':''}</div><div class="assessment-question"><h3>${q.prompt}</h3><div id="answerArea"></div><div id="assessmentFeedback"></div></div><div class="button-row" style="margin-top:10px"><button class="button" id="assessHint">Hint</button><button class="button primary" id="assessMark">Mark response</button><button class="button hidden" id="assessNext">Next question →</button></div><div class="hint hidden" id="assessHintBox">${hintFor(q)}</div>`;
    renderAnswerArea(q);$("#assessHint").onclick=()=>$("#assessHintBox").classList.toggle("hidden");$("#assessMark").onclick=markCurrent;$("#assessNext").onclick=()=>{idx++;if(S.mode==="adaptive")session=[selectAdaptive()],idx=0;renderSide();renderQuestion();};
  }

  function hintFor(q){
    if(q.type==="numeric")return `Identify the relationship for ${q.skill}, convert all quantities into compatible units, then rearrange before substituting.`;
    if(q.type==="mcq")return `Eliminate options that contradict the definition or physical condition before selecting.`;
    return `Structure the response as: physical principle → apply it to this situation → resulting observation.`;
  }

  function renderAnswerArea(q){
    const a=$("#answerArea");if(q.type==="mcq"){a.innerHTML=`<div class="assessment-options">${q.choices.map((x,i)=>`<button class="button assessment-option" data-assess-option="${i}">${String.fromCharCode(65+i)}. ${x}</button>`).join("")}</div>`;$$('[data-assess-option]',a).forEach(b=>b.onclick=()=>{$$('[data-assess-option]',a).forEach(x=>x.classList.remove("active"));b.classList.add("active");a.dataset.choice=b.dataset.assessOption;});return;}
    if(S.mode==="working"&&q.type==="numeric"){
      const labels=["1. Relationship / equation","2. Rearrangement or unit conversion","3. Substitution","4. Final answer + unit"];
      a.innerHTML=`<div class="working-grid">${labels.map((l,i)=>`<div class="working-row"><label>${l}</label><textarea class="working-input" data-work-step="${i}" placeholder="Show this step..."></textarea></div>`).join("")}</div>`;return;
    }
    if(q.type==="numeric")a.innerHTML=`<label class="field"><span>Answer ${q.unit?`(${q.unit})`:""}</span><input id="numericAnswer" type="number" step="any" placeholder="Enter numerical answer"></label><details class="sim-detail-more"><summary>Show working box</summary><textarea class="assessment-response" id="optionalWorking" placeholder="Equation, rearrangement, conversions and substitution..."></textarea></details>`;
    else a.innerHTML='<textarea class="assessment-response" id="writtenAnswer" placeholder="Write your exam-style answer here..."></textarea>';
  }

  function markCurrent(){
    if(marked)return;const q=current;let earned=0,feedback="",detail=[];
    if(q.type==="mcq"){
      const choice=Number($("#answerArea").dataset.choice);earned=choice===q.correct?q.marks:0;$$('[data-assess-option]').forEach((b,i)=>{b.disabled=true;if(i===q.correct)b.classList.add("correct");else if(i===choice)b.classList.add("wrong");});feedback=earned?"Correct.":`Correct answer: ${q.choices[q.correct]}`;
    }else if(S.mode==="working"&&q.type==="numeric"){
      const responses=$$('[data-work-step]').map(x=>x.value.trim());const expected=q.steps||[];let hits=0;responses.forEach((r,i)=>{const e=String(expected[Math.min(i,expected.length-1)]||"").toLowerCase();const tokens=e.replace(/[^a-z0-9λμθπ√=\/\.\-]+/gi," ").split(/\s+/).filter(x=>x.length>1);if(r&&tokens.some(t=>r.toLowerCase().includes(t.toLowerCase())))hits++;});const final=parseFloat(responses[3]);if(Number.isFinite(final)&&Math.abs(final-q.answer)<=Math.max(Math.abs(q.answer)*q.tolerance,.02))hits=Math.max(hits,3);earned=Math.min(q.marks,Math.round(q.marks*hits/4));feedback=`Working awarded ${earned}/${q.marks}. Expected route: ${(q.steps||[]).join(" → ")}.`;detail=(q.steps||[]).map((x,i)=>`<div class="mark-point-v3 ${i<hits?"hit":"miss"}">${i<hits?"✓":"○"} ${x}</div>`);
    }else if(q.type==="numeric"){
      const val=parseFloat($("#numericAnswer")?.value);const tol=Math.max(Math.abs(q.answer)*q.tolerance,.02);earned=Number.isFinite(val)&&Math.abs(val-q.answer)<=tol?q.marks:0;feedback=earned?`Correct: ${fmt(q.answer,4)} ${q.unit}.`:`Expected about ${fmt(q.answer,4)} ${q.unit}. Check equation, rearrangement and unit conversions.`;detail=(q.steps||[]).map(x=>`<div class="mark-point-v3">${x}</div>`);
    }else{
      const text=$("#writtenAnswer")?.value||"";const points=q.markPoints||[];const hits=points.map(g=>keywordHit(text,g));earned=hits.filter(Boolean).length;feedback=`${earned}/${q.marks} mark points detected. Compare your wording with the model and add any missing physics.`;detail=points.map((g,i)=>`<div class="mark-point-v3 ${hits[i]?"hit":"miss"}">${hits[i]?"✓":"○"} ${g.join(" / ")}</div>`);if(q.model)detail.push(`<div class="lesson-callout"><strong>Model:</strong> ${q.model}</div>`);
    }
    marked=true;score+=earned;possible+=q.marks;S.attempts=(S.attempts||0)+1;S.marks=(S.marks||0)+earned;S.totalMarks=(S.totalMarks||0)+q.marks;S.topic[q.topic]=S.topic[q.topic]||{m:0,p:0};S.topic[q.topic].m+=earned;S.topic[q.topic].p+=q.marks;if(earned<q.marks&&q.misconception)S.misconceptions[q.misconception]=(S.misconceptions[q.misconception]||0)+1;S.history.unshift({id:q.id,topic:q.topic,m:earned,p:q.marks,t:Date.now()});S.history=S.history.slice(0,80);save();
    const fb=$("#assessmentFeedback");fb.className=`assessment-feedback ${earned===q.marks?"good":"warn"}`;fb.innerHTML=`<strong>${feedback}</strong>${q.misconception&&earned<q.marks?`<p class="small"><strong>Diagnostic:</strong> ${q.misconception}</p>`:""}<div class="mark-point-grid">${detail.join("")}</div>`;$("#assessMark").disabled=true;$("#assessNext").classList.remove("hidden");renderSide();
  }

  function renderSummary(){
    const main=$("#assessmentMain");const pct=possible?Math.round(100*score/possible):0;main.innerHTML=`<span class="eyebrow">Session complete</span><h2>${score} / ${possible} marks · ${pct}%</h2><p>Your topic diagnosis has been updated. Adaptive mode will now prioritise the lowest-scoring area.</p><button class="button primary" id="newAssessment">Start another set</button>`;$("#newAssessment").onclick=()=>startMode(S.mode);renderSide();
  }

  function renderBank(){
    const side=$("#assessmentSide");side.innerHTML=`<span class="eyebrow">Question bank</span><h3>${BANK.length} original variants</h3><div class="assessment-filter"><label class="field"><span>Topic</span><select id="bankTopic"><option value="all">All topics</option>${Object.entries(TOPICS).map(([k,v])=>`<option value="${k}">${v}</option>`).join("")}</select></label><label class="field"><span>Type</span><select id="bankType"><option value="all">All types</option><option value="numeric">Calculations</option><option value="written">Written</option><option value="mcq">Multiple choice</option></select></label><button class="button primary" id="applyBank">Apply filter</button></div><p class="muted small">Every question is generated from an original template and parameter set; no past-paper wording is reproduced.</p>`;
    const render=()=>{const qs=filterBank({topic:$("#bankTopic").value,type:$("#bankType").value});const main=$("#assessmentMain");main.innerHTML=`<div class="question-bank-table">${qs.slice(0,120).map(q=>`<div class="question-bank-row"><span>${q.id}</span><button class="text-button" data-open-q="${q.id}">${q.prompt}</button><span class="hide-mobile">${TOPICS[q.topic]}</span><span>${q.marks}m</span><span class="hide-mobile">${q.type}</span></div>`).join("")}</div><p class="muted small">Showing ${Math.min(qs.length,120)} of ${qs.length} matches.</p>`;$$('[data-open-q]',main).forEach(b=>b.onclick=()=>{session=[BANK.find(q=>q.id===b.dataset.openQ)];idx=0;renderQuestion();});};$("#applyBank").onclick=render;render();
  }

  window.WAVES_QUESTION_BANK=BANK;
  window.WavesAssessment={bank:BANK,start:startMode,weakest:weakestTopic};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(install,180));else setTimeout(install,180);
})();