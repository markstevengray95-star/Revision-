(() => {
  const D = window.ELECTRICITY_DATA;
  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => [...document.querySelectorAll(sel)];
  const clamp = (x,a,b) => Math.max(a,Math.min(b,x));
  const fmt = (x,dp=3) => {
    if (!Number.isFinite(x)) return "—";
    const ax=Math.abs(x);
    if ((ax>0 && ax<0.001) || ax>=10000) return x.toExponential(3);
    return Number(x.toFixed(dp)).toString();
  };
  const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;"}[c]));
  const storeKey="aqa-electricity-v1";
  let saved={completed:[],quizBest:0};
  try{ saved={...saved,...JSON.parse(localStorage.getItem(storeKey)||"{}")}; }catch(e){}
  let selectedLesson=D.lessons[0].id;
  let activeLessonStage="retrieval";
  let activeSim="charge";
  let simValues={};
  let snapshots=[];
  let quizIndex=0,quizScore=0,quizStreak=0,quizLocked=false;
  let rp5Data=[],rp6Data=[];

  function save(){ localStorage.setItem(storeKey,JSON.stringify(saved)); }
  function setView(name){
    $$(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-"+name));
    $$(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
    if(name==="lab") setTimeout(resizeSim,30);
    if(name==="practical") setTimeout(()=>{drawRp5();drawRp6();},30);
    window.scrollTo({top:document.querySelector(".main-nav").offsetTop-72,behavior:"smooth"});
  }

  function updateProgress(){
    const n=saved.completed.length,total=D.lessons.length;
    $("progressText").textContent=`${n} / ${total} complete`;
    $("progressFill").style.width=`${100*n/total}%`;
    renderSpec();
  }

  function renderCourse(){
    $("courseList").innerHTML=D.lessons.map(l=>`
      <button class="course-button ${l.id===selectedLesson?"active":""} ${saved.completed.includes(l.id)?"complete":""}" data-lesson="${l.id}">
        <span class="course-code">${l.code}</span><span class="course-title">${esc(l.title)}</span>
      </button>`).join("");
    renderLesson();
  }

  const lessonStages=[
    ["retrieval","1","Retrieval"],
    ["learn","2","Learn"],
    ["equations","3","Equations"],
    ["worked","4","Worked example"],
    ["apply","5","Apply"],
    ["simulate","6","Simulate"],
    ["exam","7","Exam check"],
    ["exit","8","Exit"]
  ];

  function activateLessonStage(stage,scroll=false){
    const idx=lessonStages.findIndex(s=>s[0]===stage);
    if(idx<0)return;
    activeLessonStage=stage;
    $$(".lesson-stage").forEach(el=>{el.hidden=el.dataset.stage!==stage;el.classList.toggle("active",el.dataset.stage===stage);});
    $$(".lesson-stage-button").forEach(b=>{
      const on=b.dataset.lessonTab===stage;
      b.classList.toggle("active",on);
      b.setAttribute("aria-selected",on?"true":"false");
      b.tabIndex=on?0:-1;
    });
    const title=$("lessonStageTitle"),fill=$("lessonStageFill"),prev=$("lessonStagePrev"),next=$("lessonStageNext");
    if(title) title.textContent=`Stage ${idx+1} of ${lessonStages.length} · ${lessonStages[idx][2]}`;
    if(fill) fill.style.width=`${((idx+1)/lessonStages.length)*100}%`;
    if(prev) prev.disabled=idx===0;
    if(next){next.disabled=idx===lessonStages.length-1;next.textContent=idx===lessonStages.length-1?"Lesson stages complete":"Next stage →";}
    if(scroll){
      const shell=document.querySelector(".lesson-stage-shell");
      if(shell) shell.scrollIntoView({behavior:"smooth",block:"start"});
    }
  }

  function renderLesson(){
    const l=D.lessons.find(x=>x.id===selectedLesson)||D.lessons[0];
    const done=saved.completed.includes(l.id);
    const textbookMap={
      "current-charge":"basics","pd-resistance":"basics",
      "iv-ohmic":"iv","iv-nonohmic":"iv",
      "resistivity":"resistivity","temperature":"resistivity",
      "series":"circuits","parallel-power":"circuits",
      "potential-divider":"divider","emf-internal":"emf","synthesis":"circuits"
    };
    const chapter=textbookMap[l.id]||"basics";
    $("lessonPanel").innerHTML=`
      <span class="eyebrow">${l.code}</span>
      <h2>${esc(l.title)}</h2>
      <p class="lesson-lead">${esc(l.lead)}</p>
      <div class="keyword-row">${l.keywords.map(k=>`<span class="keyword-chip">${esc(k)}</span>`).join("")}</div>

      <div class="lesson-overview-grid">
        <section class="lesson-focus-card remember"><h3>Learning objectives</h3><ul>${l.objectives.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
        <section class="lesson-focus-card"><h3>Lesson route</h3><p>Work through eight short stages. Each tab has one clear purpose, so students are never faced with one long page.</p><p class="lesson-progress-note">${done?"This lesson is marked complete.":"Use Next stage to move through the lesson, then mark it complete."}</p></section>
      </div>

      <div class="lesson-textbook-link">
        <div><h3>Linked textbook chapter</h3><p>Open the full explanation, diagrams, AQA specification checklist and extended worked example whenever more support is needed.</p></div>
        <button class="button" data-open-textbook="${chapter}">Open textbook</button>
      </div>

      <div class="lesson-stage-shell">
        <div class="lesson-stage-progress-row">
          <strong id="lessonStageTitle">Stage 1 of 8 · Retrieval</strong>
          <span class="muted small">Tabbed lesson sequence</span>
        </div>
        <div class="lesson-stage-track"><div class="lesson-stage-fill" id="lessonStageFill"></div></div>
        <nav class="lesson-journey lesson-tabs" role="tablist" aria-label="Lesson stages">
          ${lessonStages.map((s,i)=>`<button class="lesson-stage-button ${s[0]===activeLessonStage?"active":""}" role="tab" aria-selected="${s[0]===activeLessonStage}" data-lesson-tab="${s[0]}"><span>Stage ${s[1]}</span>${s[2]}</button>`).join("")}
        </nav>
      </div>

      <section class="lesson-stage" data-stage="retrieval" id="lesson-stage-retrieval" role="tabpanel">
        <div class="lesson-stage-heading"><span class="lesson-stage-index">1</span><div><h3>Retrieval starter</h3><p class="muted small">Activate prior knowledge before new teaching.</p></div></div>
        <div class="teaching-stack">${l.retrieval.map((r,i)=>`
          <div class="teach-section"><strong>${i+1}. ${esc(r[0])}</strong>
          <button class="text-button" data-reveal="r-${i}">Reveal answer</button>
          <div class="answer-reveal" id="r-${i}">${esc(r[1])}</div></div>`).join("")}</div>
      </section>

      <section class="lesson-stage" data-stage="learn" id="lesson-stage-learn" role="tabpanel">
        <div class="lesson-stage-heading"><span class="lesson-stage-index">2</span><div><h3>Core teaching</h3><p class="muted small">Build the physics model in small conceptual chunks.</p></div></div>
        <div class="teaching-stack">${l.teach.map((t,i)=>`<section class="teach-section"><span class="eyebrow">Concept ${i+1}</span><h3>${esc(t[0])}</h3><p>${esc(t[1])}</p></section>`).join("")}</div>
      </section>

      <section class="lesson-stage" data-stage="equations" id="lesson-stage-equations" role="tabpanel">
        <div class="lesson-stage-heading"><span class="lesson-stage-index">3</span><div><h3>Equation focus</h3><p class="muted small">Connect symbols, units and physical meaning before calculating.</p></div></div>
        <section class="lesson-block"><p>Use SI units before substitution and check that the final value is physically sensible.</p>${l.formulas.map(x=>`<span class="formula-chip">${esc(x)}</span>`).join("")}</section>
      </section>

      <section class="lesson-stage" data-stage="worked" id="lesson-stage-worked" role="tabpanel">
        <div class="lesson-stage-heading"><span class="lesson-stage-index">4</span><div><h3>Worked example</h3><p class="muted small">Follow a complete model solution, not just the final answer.</p></div></div>
        <section class="lesson-block worked-block"><p><strong>${esc(l.worked.q)}</strong></p><ol>${l.worked.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></section>
      </section>

      <section class="lesson-stage" data-stage="apply" id="lesson-stage-apply" role="tabpanel">
        <div class="lesson-stage-heading"><span class="lesson-stage-index">5</span><div><h3>Apply the idea</h3><p class="muted small">Students now produce their own reasoning or calculation.</p></div></div>
        <section class="lesson-block"><p>${esc(l.activity)}</p><textarea class="student-answer" placeholder="Write your calculation, reasoning or explanation here..."></textarea></section>
      </section>

      <section class="lesson-stage" data-stage="simulate" id="lesson-stage-simulate" role="tabpanel">
        <div class="lesson-stage-heading"><span class="lesson-stage-index">6</span><div><h3>Simulation mission</h3><p class="muted small">Test the relationship by changing variables and explaining the evidence.</p></div></div>
        <section class="lesson-block mission-card"><h3>${esc(l.mission.goal)}</h3><ol>${l.mission.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol><p><strong>Conclude:</strong> ${esc(l.mission.conclusion)}</p><button class="button primary" data-open-sim="${l.sim}">Open linked simulation</button></section>
      </section>

      <section class="lesson-stage" data-stage="exam" id="lesson-stage-exam" role="tabpanel">
        <div class="lesson-stage-heading"><span class="lesson-stage-index">7</span><div><h3>AQA exam check</h3><p class="muted small">Check the idea using concise exam-style language.</p></div></div>
        <div class="lesson-grid">
          <section class="lesson-block exam-box"><p>${esc(l.check[0])}</p>
            <div class="choice-list">${l.check[1].map((o,i)=>`<button class="choice-button lesson-check" data-answer="${i}" data-correct="${l.check[2]}" data-explain="${esc(l.check[3])}">${esc(o)}</button>`).join("")}</div>
            <div class="feedback hidden" id="lessonFeedback"></div>
          </section>
          <section class="lesson-block warning"><h3>Exam language & pitfalls</h3><p><strong>Exam tip:</strong> ${esc(l.examTip)}</p><p><strong>Common mistake:</strong> ${esc(l.misconception)}</p></section>
        </div>
      </section>

      <section class="lesson-stage" data-stage="exit" id="lesson-stage-exit" role="tabpanel">
        <div class="lesson-stage-heading"><span class="lesson-stage-index">8</span><div><h3>Exit question</h3><p class="muted small">Finish by explaining the key idea independently.</p></div></div>
        <section class="lesson-block"><p>${esc(l.exit)}</p><textarea class="student-answer" placeholder="Answer in full A-level physics language..."></textarea></section>
        <div class="lesson-finish-box"><strong>Ready to move on?</strong><span>Check you can explain the lesson objective without notes and use the key equation correctly.</span></div>
      </section>

      <div class="lesson-stage-controls">
        <button class="button" id="lessonStagePrev" data-stage-move="-1">← Previous stage</button>
        <button class="button primary" id="lessonStageNext" data-stage-move="1">Next stage →</button>
      </div>

      <div class="lesson-actions">
        <button class="button" data-open-textbook="${chapter}">Reopen textbook chapter</button>
        <button class="button primary" data-complete="${l.id}">${done?"Mark incomplete":"Mark lesson complete"}</button>
      </div>`;
    requestAnimationFrame(()=>activateLessonStage(activeLessonStage,false));
  }

  function simDefaults(id){
    const s=D.sims[id],v={};
    s.controls.forEach(c=>v[c.k]=c.v);
    return v;
  }
  function selectSim(id){
    activeSim=id; simValues=simDefaults(id); snapshots=[];
    renderSimTabs();renderSimPanel();resizeSim();
  }
  function renderSimTabs(){
    $("simTabs").innerHTML=Object.entries(D.sims).map(([id,s])=>`<button class="sim-tab ${id===activeSim?"active":""}" data-sim="${id}">${esc(s.title)}</button>`).join("");
  }
  function renderSimPanel(){
    const s=D.sims[activeSim];
    $("simCode").textContent=s.code;$("simTitle").textContent=s.title;$("simSubtitle").textContent=s.subtitle;
    $("simpleExplain").textContent=s.simple;$("examExplain").textContent=s.exam;$("mistakeExplain").textContent=s.mistake;
    const linked=D.lessons.find(l=>l.sim===activeSim);
    const m=linked?.mission||{goal:"Explore the model",steps:["Change one variable.","Record a reading.","Explain the relationship."],conclusion:"Link the pattern to an equation."};
    $("missionGoal").textContent=m.goal;$("missionSteps").innerHTML=m.steps.map(x=>`<li>${esc(x)}</li>`).join("");$("missionConclusion").textContent=m.conclusion;
    $("simControls").innerHTML=s.controls.map(c=>{
      if(c.type==="select") return `<label class="field"><span>${esc(c.label)}</span><select data-sim-control="${c.k}">${c.options.map(o=>`<option value="${o[0]}" ${o[0]===simValues[c.k]?"selected":""}>${esc(o[1])}</option>`).join("")}</select></label>`;
      return `<label class="field"><span>${esc(c.label)}</span><input type="range" data-sim-control="${c.k}" min="${c.min}" max="${c.max}" step="${c.step}" value="${simValues[c.k]}"><output id="simout-${c.k}">${fmt(simValues[c.k])} ${c.u||""}</output></label>`;
    }).join("");
    updateSimReadout();
  }

  function simCalc(){
    const v=simValues;
    if(activeSim==="charge"){
      const Q=v.current*v.time, V=v.current*v.resistance, W=V*Q;
      return {I:v.current,Q,V,R:v.resistance,W,text:`I = ${fmt(v.current)} A · Q = It = ${fmt(Q)} C · V = IR = ${fmt(V)} V · W = VQ = ${fmt(W)} J`};
    }
    if(activeSim==="iv"){
      let I=0;
      if(v.component==="resistor") I=v.voltage/v.baseR;
      if(v.component==="lamp") I=v.voltage/(v.baseR*(1+0.045*Math.abs(v.voltage)));
      if(v.component==="diode"){
        if(v.voltage>0.55) I=Math.min(1.5,0.018*(Math.exp((v.voltage-0.55)*1.25)-1));
        else if(v.voltage<0) I=-0.0002*Math.abs(v.voltage);
      }
      const R=Math.abs(I)>1e-8?Math.abs(v.voltage/I):Infinity;
      return {I,V:v.voltage,R,text:`V = ${fmt(v.voltage)} V · I = ${fmt(I,4)} A · operating R = ${Number.isFinite(R)?fmt(R):"very large"} Ω`};
    }
    if(activeSim==="resistivity"){
      const d=v.diameter/1000,A=Math.PI*d*d/4;
      let rho=3.5e-7;
      if(v.mode==="metal") rho=3.5e-7*(1+0.0038*(v.temp-293));
      if(v.mode==="ntc") rho=3.5e-5*Math.exp(-0.024*(v.temp-293));
      if(v.mode==="super") rho=v.temp<=120?0:5e-7*(1+0.002*(v.temp-120));
      rho=Math.max(0,rho);
      const R=A>0?rho*v.length/A:0;
      return {rho,A,R,text:`A = ${fmt(A)} m² · ρ = ${fmt(rho)} Ω m · R = ρL/A = ${fmt(R)} Ω`};
    }
    if(activeSim==="circuits"){
      const V=v.supply,R1=v.r1,R2=v.r2;
      if(v.config==="series"){
        const Rt=R1+R2,I=V/Rt,V1=I*R1,V2=I*R2,P=V*I;
        return {Rt,I,V1,V2,P,text:`series: Rₜ = ${fmt(Rt)} Ω · I = ${fmt(I)} A · V₁ = ${fmt(V1)} V · V₂ = ${fmt(V2)} V · P = ${fmt(P)} W`};
      } else {
        const Rt=R1*R2/(R1+R2),I1=V/R1,I2=V/R2,I=I1+I2,P=V*I;
        return {Rt,I,I1,I2,P,text:`parallel: Rₜ = ${fmt(Rt)} Ω · I₁ = ${fmt(I1)} A · I₂ = ${fmt(I2)} A · Iₜ = ${fmt(I)} A · P = ${fmt(P)} W`};
      }
    }
    if(activeSim==="divider"){
      let R2=v.r2;
      if(v.sensor==="ntc") R2=v.r2*Math.exp(-0.018*(v.stimulus-50));
      if(v.sensor==="ldr") R2=v.r2/(0.35+1.3*v.stimulus/100);
      const I=v.vin/(v.r1+R2),Vout=I*R2;
      return {R2,I,Vout,text:`effective R₂ = ${fmt(R2)} Ω · I = ${fmt(I,5)} A · Vout = ${fmt(Vout)} V`};
    }
    if(activeSim==="internal"){
      const I=v.emf/(v.load+v.r),lost=I*v.r,V=v.emf-lost,Pload=I*I*v.load,Pint=I*I*v.r;
      return {I,lost,V,Pload,Pint,text:`I = ${fmt(I)} A · lost volts Ir = ${fmt(lost)} V · terminal V = ${fmt(V)} V · Pload = ${fmt(Pload)} W`};
    }
  }
  function updateSimReadout(){
    const s=D.sims[activeSim];
    s.controls.forEach(c=>{ if(c.type!=="select" && $("simout-"+c.k)) $("simout-"+c.k).textContent=`${fmt(simValues[c.k])} ${c.u||""}`; });
    const c=simCalc();$("simReadout").textContent=c.text;drawSim();
  }

  function resizeCanvas(canvas){
    const r=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);
    canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));
    const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w:r.width,h:r.height};
  }
  function line(ctx,x1,y1,x2,y2,color="#87a5c4",width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function label(ctx,t,x,y,size=14,color="#dceaff"){ctx.fillStyle=color;ctx.font=`${size}px system-ui`;ctx.fillText(t,x,y);}
  function box(ctx,x,y,w,h,stroke="#5d7c9c",fill="#0a1a2c"){ctx.fillStyle=fill;ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,w,h,10);ctx.fill();ctx.stroke();}
  function graphAxes(ctx,x,y,w,h,xlab,ylab){
    ctx.strokeStyle="#5f7e9e";ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);
    line(ctx,x,y+h,x+w,y+h);line(ctx,x,y,x,y+h);
    label(ctx,xlab,x+w-18,y+h+22,12);label(ctx,ylab,x-18,y+12,12);
    ctx.strokeStyle="rgba(110,145,180,.18)";ctx.lineWidth=1;
    for(let i=1;i<5;i++){line(ctx,x+i*w/5,y,x+i*w/5,y+h,"rgba(110,145,180,.18)",1);line(ctx,x,y+i*h/5,x+w,y+i*h/5,"rgba(110,145,180,.18)",1);}
  }
  function drawSim(){
    const canvas=$("simCanvas"); if(!canvas||!canvas.clientWidth)return;
    const {ctx,w,h}=resizeCanvas(canvas);
    ctx.clearRect(0,0,w,h);
    const c=simCalc(),v=simValues;
    if(activeSim==="charge"){
      const y=h*.52,left=w*.12,right=w*.88;
      line(ctx,left,y,right,y,"#d39a65",8);label(ctx,"conductor",left,y-28,14);
      const n=18,phase=(performance.now()/900*v.current)%1;
      for(let i=0;i<n;i++){const p=(i/n+phase)%1,x=left+p*(right-left);ctx.fillStyle="#67c7ff";ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fill();}
      line(ctx,w*.72,h*.26,w*.56,h*.26,"#ffd56a",3);label(ctx,"electron drift",w*.57,h*.23,12,"#ffd56a");
      line(ctx,w*.28,h*.72,w*.44,h*.72,"#63d9a4",3);label(ctx,"conventional current",w*.26,h*.77,12,"#63d9a4");
      box(ctx,w*.38,h*.10,w*.24,62);label(ctx,`Q = ${fmt(c.Q)} C`,w*.42,h*.145,18);label(ctx,`in ${fmt(v.time)} s`,w*.445,h*.18,12);
      requestAnimationFrame(drawSim);return;
    }
    if(activeSim==="iv"){
      const gx=w*.12,gy=h*.12,gw=w*.72,gh=h*.68;graphAxes(ctx,gx,gy,gw,gh,"V","I");
      const maxV=10,maxI=1.2;
      ctx.strokeStyle="#67c7ff";ctx.lineWidth=3;ctx.beginPath();
      for(let j=0;j<=160;j++){
        const V=-10+20*j/160;let I;
        if(v.component==="resistor") I=V/v.baseR;
        else if(v.component==="lamp") I=V/(v.baseR*(1+0.045*Math.abs(V)));
        else {I=V>0.55?Math.min(1.2,0.018*(Math.exp((V-0.55)*1.25)-1)):(V<0?-0.0002*Math.abs(V):0);}
        const x=gx+(V+maxV)/(2*maxV)*gw,y=gy+gh/2-(I/maxI)*(gh/2);
        if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }ctx.stroke();
      const px=gx+(v.voltage+10)/20*gw,py=gy+gh/2-(c.I/1.2)*(gh/2);
      ctx.fillStyle="#ffd56a";ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fill();
      label(ctx,v.component==="resistor"?"Ohmic resistor":v.component==="lamp"?"Filament lamp":"Semiconductor diode",gx,gy-18,16);
      return;
    }
    if(activeSim==="resistivity"){
      const x=w*.12,y=h*.45,L=w*.70,th=clamp(v.diameter*18,5,18);
      line(ctx,x,y,x+L,y,v.mode==="super"&&v.temp<=120?"#63d9a4":"#d89a65",th);
      for(let i=0;i<10;i++){const px=x+i*L/9;ctx.fillStyle="#90a4b8";ctx.beginPath();ctx.arc(px,y+28+Math.sin(i)*8,4,0,Math.PI*2);ctx.fill();}
      label(ctx,`L = ${fmt(v.length)} m`,x,y-45,16);label(ctx,`d = ${fmt(v.diameter)} mm`,x,y-18,14);
      box(ctx,w*.25,h*.68,w*.50,70);label(ctx,`ρ = ${fmt(c.rho)} Ω m`,w*.31,h*.73,16);label(ctx,`R = ${fmt(c.R)} Ω`,w*.35,h*.78,18,"#9fddff");
      if(v.mode==="super"&&v.temp<=120)label(ctx,"superconducting state: ρ = 0",w*.30,h*.20,18,"#63d9a4");
      return;
    }
    if(activeSim==="circuits"){
      const left=w*.12,right=w*.88,top=h*.25,bottom=h*.72;
      line(ctx,left,top,right,top,"#7ca1c5",3);line(ctx,left,bottom,right,bottom,"#7ca1c5",3);line(ctx,left,top,left,bottom,"#7ca1c5",3);line(ctx,right,top,right,bottom,"#7ca1c5",3);
      box(ctx,w*.43,h*.10,w*.14,58,"#63d9a4","#0b211c");label(ctx,`${v.supply} V`,w*.465,h*.145,16);
      if(v.config==="series"){
        box(ctx,w*.27,h*.43,w*.18,64,"#f2b66c","#24180c");label(ctx,`R₁ ${v.r1} Ω`,w*.30,h*.48,15);
        box(ctx,w*.56,h*.43,w*.18,64,"#f2b66c","#24180c");label(ctx,`R₂ ${v.r2} Ω`,w*.59,h*.48,15);
        label(ctx,`I = ${fmt(c.I)} A`,w*.42,h*.84,17,"#67c7ff");
      } else {
        line(ctx,w*.28,top,w*.28,bottom,"#7ca1c5",3);line(ctx,w*.72,top,w*.72,bottom,"#7ca1c5",3);
        box(ctx,w*.20,h*.40,w*.16,60,"#f2b66c","#24180c");label(ctx,`R₁ ${v.r1} Ω`,w*.215,h*.45,14);
        box(ctx,w*.64,h*.40,w*.16,60,"#f2b66c","#24180c");label(ctx,`R₂ ${v.r2} Ω`,w*.655,h*.45,14);
        label(ctx,`I₁ ${fmt(c.I1)} A`,w*.17,h*.62,13,"#67c7ff");label(ctx,`I₂ ${fmt(c.I2)} A`,w*.63,h*.62,13,"#67c7ff");
        label(ctx,`Iₜ = ${fmt(c.I)} A`,w*.41,h*.84,17,"#63d9a4");
      }
      return;
    }
    if(activeSim==="divider"){
      const x=w*.50,yt=h*.16,yb=h*.82,mid=h*.49;
      line(ctx,x,yt,x,yb,"#7ca1c5",3);
      box(ctx,x-76,h*.25,152,70,"#f2b66c","#24180c");label(ctx,`R₁ ${fmt(v.r1)} Ω`,x-56,h*.30,14);
      box(ctx,x-76,h*.56,152,70,v.sensor==="fixed"?"#f2b66c":"#67c7ff",v.sensor==="fixed"?"#24180c":"#0a2237");label(ctx,`${v.sensor.toUpperCase()} ${fmt(c.R2)} Ω`,x-62,h*.61,14);
      line(ctx,x,mid,w*.78,mid,"#63d9a4",3);label(ctx,`Vout = ${fmt(c.Vout)} V`,w*.70,mid-16,16,"#63d9a4");
      label(ctx,`Vin = ${fmt(v.vin)} V`,w*.12,h*.18,17);
      return;
    }
    if(activeSim==="internal"){
      const x=w*.14,y=h*.30;
      box(ctx,x,y,w*.20,88,"#63d9a4","#0a2019");label(ctx,`ε = ${fmt(v.emf)} V`,x+24,y+34,16);label(ctx,`r = ${fmt(v.r)} Ω`,x+30,y+62,14);
      box(ctx,w*.65,y,w*.20,88,"#f2b66c","#24180c");label(ctx,`R = ${fmt(v.load)} Ω`,w*.69,y+50,16);
      line(ctx,x+w*.20,y+44,w*.65,y+44,"#7ca1c5",3);line(ctx,w*.75,y+88,w*.75,h*.67,"#7ca1c5",3);line(ctx,w*.24,y+88,w*.24,h*.67,"#7ca1c5",3);line(ctx,w*.24,h*.67,w*.75,h*.67,"#7ca1c5",3);
      label(ctx,`I = ${fmt(c.I)} A`,w*.43,y+26,16,"#67c7ff");label(ctx,`terminal V = ${fmt(c.V)} V`,w*.39,h*.77,18,"#63d9a4");label(ctx,`lost volts = ${fmt(c.lost)} V`,w*.38,h*.83,14,"#ffd56a");
    }
  }
  function resizeSim(){drawSim();}

  function renderFormula(){
    $("formulaSelect").innerHTML=D.formulas.map(f=>`<option value="${f.id}">${esc(f.name)} · ${esc(f.eq)}</option>`).join("");
    $("formulaCards").innerHTML=D.formulas.map(f=>`<article class="formula-card"><strong>${esc(f.name)}</strong><code>${esc(f.eq)}</code><p>Output unit: ${esc(f.unit)}</p></article>`).join("");
    renderFormulaInputs();
  }
  function renderFormulaInputs(){
    const f=D.formulas.find(x=>x.id===$("formulaSelect").value)||D.formulas[0];
    $("formulaInputs").innerHTML=f.inputs.map(([k,l,u])=>`<label class="field"><span>${esc(l)} (${esc(u)})</span><input type="number" step="any" data-formula-input="${k}" value="1"></label>`).join("");
    calculateFormula();
  }
  function calculateFormula(){
    const f=D.formulas.find(x=>x.id===$("formulaSelect").value)||D.formulas[0],vals={};
    $$("[data-formula-input]").forEach(i=>vals[i.dataset.formulaInput]=Number(i.value));
    let result;try{result=f.solve(vals);}catch(e){result=NaN;}
    $("formulaWorking").innerHTML=`<span class="step"><strong>1. Choose:</strong> ${esc(f.eq)}</span><span class="step"><strong>2. Substitute:</strong> ${f.inputs.map(([k,l,u])=>`${esc(k)} = ${fmt(vals[k])} ${esc(u)}`).join(", ")}</span><span class="step"><strong>3. Result:</strong> ${fmt(result)} ${esc(f.unit)}</span>`;
  }

  function switchPractical(id){
    $$(".practical-panel").forEach(p=>p.classList.toggle("hidden",p.id!=="practical-"+id));
    $$("[data-practical]").forEach(b=>b.classList.toggle("primary",b.dataset.practical===id));
    setTimeout(()=>id==="rp5"?drawRp5():drawRp6(),30);
  }
  function bindPracticalSliders(){
    [["rp5Length","m"],["rp5Diameter","mm"],["rp5Voltage","V"],["rp6Load","Ω"]].forEach(([id,u])=>{
      const el=$(id),out=$(id+"Out");el.addEventListener("input",()=>{out.textContent=`${el.value} ${u}`;if(id==="rp5Length"&&$("wireSlider"))$("wireSlider").style.left=`${10+70*Number(el.value)}%`;if(id==="rp6Load")$("loadBox").textContent=`${el.value} Ω`;});
    });
  }
  function addRp5(){
    const L=Number($("rp5Length").value),dmm=Number($("rp5Diameter").value),Vset=Number($("rp5Voltage").value);
    const d=dmm/1000,A=Math.PI*d*d/4,rho=4.8e-7;
    const Rtrue=rho*L/A,noise=1+(Math.random()-.5)*0.02,I=Vset/(Rtrue*noise),R=Vset/I,rhoCalc=R*A/L;
    rp5Data.push({L,dmm,V:Vset,I,R,rho:rhoCalc});renderRp5();
  }
  function renderRp5(){
    $("rp5Rows").innerHTML=rp5Data.map(r=>`<tr><td>${fmt(r.L,2)}</td><td>${fmt(r.dmm,2)}</td><td>${fmt(r.V,2)}</td><td>${fmt(r.I,3)}</td><td>${fmt(r.R,3)}</td><td>${fmt(r.rho)}</td></tr>`).join("");
    if(rp5Data.length){
      const avg=rp5Data.reduce((s,r)=>s+r.rho,0)/rp5Data.length;
      $("rp5Summary").textContent=`mean resistivity = ${fmt(avg)} Ω m · use R against L for a linear relationship when A is fixed.`;
    } else $("rp5Summary").textContent="Collect at least four lengths.";
    drawRp5();
  }
  function addRp6(){
    const R=Number($("rp6Load").value),emf=1.50,r=0.65,Itrue=emf/(R+r);
    const I=Itrue*(1+(Math.random()-.5)*0.008),V=(emf-I*r)*(1+(Math.random()-.5)*0.004);
    rp6Data.push({R,I,V,lost:emf-V});renderRp6();
  }
  function linreg(data){
    const n=data.length;if(n<2)return null;
    let sx=0,sy=0,sxy=0,sxx=0;data.forEach(p=>{sx+=p.x;sy+=p.y;sxy+=p.x*p.y;sxx+=p.x*p.x;});
    const den=n*sxx-sx*sx;if(Math.abs(den)<1e-12)return null;
    const m=(n*sxy-sx*sy)/den,b=(sy-m*sx)/n;return {m,b};
  }
  function renderRp6(){
    $("rp6Rows").innerHTML=rp6Data.map(r=>`<tr><td>${fmt(r.R,1)}</td><td>${fmt(r.I,3)}</td><td>${fmt(r.V,3)}</td><td>${fmt(r.lost,3)}</td></tr>`).join("");
    const fit=linreg(rp6Data.map(r=>({x:r.I,y:r.V})));
    $("rp6Summary").textContent=fit?`best fit: V = ${fmt(fit.b,3)} + (${fmt(fit.m,3)})I · estimated ε = ${fmt(fit.b,3)} V · r = ${fmt(Math.abs(fit.m),3)} Ω`:"Collect at least five load values.";
    drawRp6();
  }
  function drawGraph(canvas,data,xKey,yKey,xLabel,yLabel,fit){
    if(!canvas||!canvas.clientWidth)return;const {ctx,w,h}=resizeCanvas(canvas);ctx.clearRect(0,0,w,h);
    const pad={l:50,r:18,t:18,b:38},gw=w-pad.l-pad.r,gh=h-pad.t-pad.b;
    graphAxes(ctx,pad.l,pad.t,gw,gh,xLabel,yLabel);if(!data.length)return;
    let xs=data.map(d=>d[xKey]),ys=data.map(d=>d[yKey]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);
    if(xmin===xmax){xmin*=.9;xmax*=1.1}if(ymin===ymax){ymin*=.9;ymax*=1.1}
    const xp=x=>pad.l+(x-xmin)/(xmax-xmin)*gw,yp=y=>pad.t+gh-(y-ymin)/(ymax-ymin)*gh;
    data.forEach(d=>{ctx.fillStyle="#67c7ff";ctx.beginPath();ctx.arc(xp(d[xKey]),yp(d[yKey]),5,0,Math.PI*2);ctx.fill();});
    if(fit){ctx.strokeStyle="#63d9a4";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(xp(xmin),yp(fit.m*xmin+fit.b));ctx.lineTo(xp(xmax),yp(fit.m*xmax+fit.b));ctx.stroke();}
  }
  function drawRp5(){drawGraph($("rp5Graph"),rp5Data,"L","R","L","R",linreg(rp5Data.map(r=>({x:r.L,y:r.R}))));}
  function drawRp6(){drawGraph($("rp6Graph"),rp6Data,"I","V","I","V",linreg(rp6Data.map(r=>({x:r.I,y:r.V}))));}

  function renderQuiz(){
    const q=D.quiz[quizIndex];
    $("quizProgress").textContent=`${quizIndex+1} / ${D.quiz.length}`;
    $("quizProgressFill").style.width=`${100*(quizIndex+1)/D.quiz.length}%`;
    $("quizScore").textContent=quizScore;$("quizStreak").textContent=quizStreak;$("quizSpec").textContent=q.code;$("quizQuestion").textContent=q.q;
    $("quizChoices").innerHTML=q.o.map((o,i)=>`<button class="choice-button quiz-choice" data-choice="${i}">${esc(o)}</button>`).join("");
    $("quizFeedback").className="feedback hidden";$("quizFeedback").textContent="";$("nextQuestion").classList.add("hidden");quizLocked=false;
  }
  function answerQuiz(i){
    if(quizLocked)return;quizLocked=true;const q=D.quiz[quizIndex],ok=i===q.a;
    if(ok){quizScore++;quizStreak++;}else quizStreak=0;
    $$(".quiz-choice").forEach((b,j)=>{if(j===q.a)b.classList.add("correct");if(j===i&&j!==q.a)b.classList.add("wrong");b.disabled=true;});
    $("quizScore").textContent=quizScore;$("quizStreak").textContent=quizStreak;
    $("quizFeedback").className=`feedback ${ok?"good":"bad"}`;$("quizFeedback").textContent=(ok?"Correct. ":"Not quite. ")+q.e;$("nextQuestion").classList.remove("hidden");
  }
  function nextQuiz(){
    if(quizIndex===D.quiz.length-1){saved.quizBest=Math.max(saved.quizBest,quizScore);save();quizIndex=0;quizScore=0;quizStreak=0;}else quizIndex++;
    renderQuiz();
  }

  function renderSpec(){
    if(!$("specGrid"))return;
    $("specGrid").innerHTML=D.spec.map(s=>{
      const linked=D.lessons.filter(l=>l.code===s.code || (s.code==="3.5.1.2"&&l.code==="3.5.1.2") || (s.code==="3.5.1.3"&&l.code==="3.5.1.3") || (s.code==="3.5.1.4"&&l.code==="3.5.1.4"));
      const done=linked.length>0 && linked.every(l=>saved.completed.includes(l.id));
      return `<article class="spec-card"><div class="status"><span class="eyebrow">${esc(s.code)}</span><span class="status-dot ${done?"done":""}"></span></div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></article>`;
    }).join("");
  }

  document.addEventListener("click",e=>{
    const t=e.target.closest("button");if(!t)return;
    if(t.dataset.view){setView(t.dataset.view);return;}
    if(t.dataset.jump){setView(t.dataset.jump);return;}
    if(t.dataset.lesson){selectedLesson=t.dataset.lesson;activeLessonStage="retrieval";renderCourse();return;}
    if(t.dataset.reveal){$(t.dataset.reveal).classList.toggle("visible");return;}
    if(t.dataset.complete){
      const id=t.dataset.complete,idx=saved.completed.indexOf(id);if(idx>=0)saved.completed.splice(idx,1);else saved.completed.push(id);save();renderCourse();updateProgress();return;
    }
    if(t.dataset.lessonTab){activateLessonStage(t.dataset.lessonTab,true);return;}
    if(t.dataset.stageMove){
      const current=lessonStages.findIndex(s=>s[0]===activeLessonStage);
      const next=clamp(current+Number(t.dataset.stageMove),0,lessonStages.length-1);
      activateLessonStage(lessonStages[next][0],true);return;
    }
    if(t.dataset.openTextbook){
      setView("textbook");
      if(window.ElectricityTextbook) window.ElectricityTextbook.open(t.dataset.openTextbook);
      return;
    }
    if(t.dataset.openSim){selectSim(t.dataset.openSim);setView("lab");return;}
    if(t.dataset.sim){selectSim(t.dataset.sim);return;}
    if(t.classList.contains("lesson-check")){
      const correct=Number(t.dataset.correct),ans=Number(t.dataset.answer),fb=$("lessonFeedback");
      $$(".lesson-check").forEach((b,i)=>{b.disabled=true;if(i===correct)b.classList.add("correct");if(i===ans&&i!==correct)b.classList.add("wrong");});
      fb.className=`feedback ${ans===correct?"good":"bad"}`;fb.textContent=(ans===correct?"Correct. ":"Not quite. ")+t.dataset.explain;return;
    }
    if(t.id==="resetProgress"){saved.completed=[];save();renderCourse();updateProgress();return;}
    if(t.id==="resetSim"){simValues=simDefaults(activeSim);snapshots=[];renderSimPanel();$("snapshotTray").innerHTML="";return;}
    if(t.id==="snapshotSim"){const c=simCalc();snapshots.unshift(c.text);snapshots=snapshots.slice(0,5);$("snapshotTray").innerHTML=snapshots.map((s,i)=>`<div class="snapshot"><strong>#${snapshots.length-i}</strong> ${esc(s)}</div>`).join("");return;}
    if(t.id==="predictPrompt"){const prompts=["Predict what will increase if the selected resistance doubles.","Predict the direction of change before moving the next slider.","Choose one variable to keep constant and explain why.","State the proportionality you expect, then test it."];$("missionConclusion").textContent=prompts[Math.floor(Math.random()*prompts.length)];return;}
    if(t.dataset.practical){switchPractical(t.dataset.practical);return;}
    if(t.id==="takeRp5Reading"){addRp5();return;}
    if(t.id==="clearRp5Data"){rp5Data=[];renderRp5();return;}
    if(t.id==="takeRp6Reading"){addRp6();return;}
    if(t.id==="clearRp6Data"){rp6Data=[];renderRp6();return;}
    if(t.classList.contains("quiz-choice")){answerQuiz(Number(t.dataset.choice));return;}
    if(t.id==="nextQuestion"){nextQuiz();return;}
    if(t.id==="restartQuiz"){quizIndex=0;quizScore=0;quizStreak=0;renderQuiz();return;}
  });
  document.addEventListener("input",e=>{
    if(e.target.dataset.simControl){
      const k=e.target.dataset.simControl;simValues[k]=e.target.tagName==="SELECT"?e.target.value:Number(e.target.value);updateSimReadout();
    }
    if(e.target.dataset.formulaInput)calculateFormula();
  });
  $("formulaSelect").addEventListener("change",renderFormulaInputs);
  window.addEventListener("resize",()=>{resizeSim();drawRp5();drawRp6();});

  renderCourse();updateProgress();renderSimTabs();simValues=simDefaults(activeSim);renderSimPanel();renderFormula();bindPracticalSliders();renderRp5();renderRp6();renderQuiz();renderSpec();
})();