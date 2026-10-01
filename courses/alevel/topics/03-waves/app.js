(() => {
  "use strict";

  const D = window.WAVES_DATA;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const fmt = (v,d=3) => {
    if (!Number.isFinite(v)) return "—";
    const av = Math.abs(v);
    if ((av && av < 0.001) || av >= 100000) return v.toExponential(3);
    return Number(v.toFixed(d)).toString();
  };

  const state = {
    lessonId:D.lessons[0].id,
    courseFilter:"all",
    progress:new Set(JSON.parse(localStorage.getItem("wavesProgressV1") || "[]")),
    simId:D.sims[0].id,
    running:true,
    slow:false,
    time:0,
    lastTs:0,
    snapshots:[],
    returnLesson:null,
    simVals:{},
    practical:"standing",
    practicalData:{standing:[],young:[],grating:[]},
    quizIndex:0, quizScore:0, quizStreak:0, quizLocked:false
  };

  function saveProgress(){
    localStorage.setItem("wavesProgressV1", JSON.stringify([...state.progress]));
    updateProgress();
  }

  function updateProgress(){
    const n = state.progress.size;
    $("#progressText").textContent = `${n} / ${D.lessons.length} complete`;
    $("#progressFill").style.width = `${100*n/D.lessons.length}%`;
  }

  function switchView(view){
    $$(".view").forEach(v => v.classList.toggle("active-view", v.id === `view-${view}`));
    $$(".nav-button").forEach(b => b.classList.toggle("active", b.dataset.view === view));
    window.scrollTo({top:Math.max(0,$(".main-nav").offsetTop-70),behavior:"smooth"});
    if(view==="lab") resizeSim();
    if(view==="practical") resizePractical();
  }

  $$(".nav-button").forEach(b => b.addEventListener("click",()=>switchView(b.dataset.view)));
  $$("[data-jump]").forEach(b => b.addEventListener("click",()=>switchView(b.dataset.jump)));
  $("#resetProgress").addEventListener("click",()=>{
    state.progress.clear(); saveProgress(); renderCourse(); renderLesson();
  });

  function renderCourse(){
    const host=$("#courseList");
    const items=D.lessons.filter(l=>state.courseFilter==="all"||l.topic===state.courseFilter);
    host.innerHTML=items.map(l=>`
      <button class="course-button ${l.id===state.lessonId?"active":""} ${state.progress.has(l.id)?"complete":""}" data-lesson="${l.id}">
        <span class="course-code">${l.code} · ${l.id}</span>
        <span class="course-title">${l.title}</span>
      </button>`).join("");
    host.querySelectorAll("[data-lesson]").forEach(b=>b.addEventListener("click",()=>{
      state.lessonId=b.dataset.lesson; state.lessonStep=0; renderCourse(); renderLesson();
    }));
  }

  $$("[data-course-filter]").forEach(b=>b.addEventListener("click",()=>{
    state.courseFilter=b.dataset.courseFilter;
    $$("[data-course-filter]").forEach(x=>x.classList.toggle("primary",x===b));
    const visible=D.lessons.filter(l=>state.courseFilter==="all"||l.topic===state.courseFilter);
    if(!visible.some(l=>l.id===state.lessonId)) state.lessonId=visible[0].id;
    renderCourse(); renderLesson();
  }));

  function renderLesson(){
    const l=D.lessons.find(x=>x.id===state.lessonId) || D.lessons[0];
    const idx=D.lessons.indexOf(l);
    const quick=l.quick;
    if(!Number.isInteger(state.lessonStep)) state.lessonStep=0;
    state.lessonStep=Math.max(0,Math.min(5,state.lessonStep));

    const mid=Math.ceil(l.sections.length/2);
    const firstSections=l.sections.slice(0,mid);
    const secondSections=l.sections.slice(mid);
    const sectionHtml=s=>`<div class="lesson-content-card">
      <h3>${s.h}</h3>
      <p>${s.p}</p>
      ${s.eq?`<div class="equation">${s.eq}</div>`:""}
      ${s.callout?`<div class="lesson-callout">${s.callout}</div>`:""}
    </div>`;
    const equations=[...new Set(l.sections.filter(s=>s.eq).map(s=>s.eq))];
    const steps=[
      ["Launch","Objectives + retrieval"],
      ["Learn","Core ideas"],
      ["Develop","Build the model"],
      ["Apply","Equations + practice"],
      ["Explore","Simulation + exam thinking"],
      ["Check","Knowledge check + exit"]
    ];

    $("#lessonPanel").innerHTML=`
      <div class="lesson-kicker">
        <span class="eyebrow">${l.code}</span>
        <span class="pill">Lesson ${idx+1} of ${D.lessons.length}</span>
        <span class="pill">Step ${state.lessonStep+1} of 6</span>
      </div>
      <h2>${l.title}</h2>
      <p class="lesson-lead">${l.lead}</p>

      <div class="lesson-path" aria-label="Lesson sequence">
        ${steps.map((s,i)=>`<button class="lesson-path-step ${i===state.lessonStep?"active":""} ${i<state.lessonStep?"visited":""}" data-lesson-step="${i}">
          <span class="lesson-path-number">${i+1}</span><span><strong>${s[0]}</strong><small>${s[1]}</small></span>
        </button>`).join("")}
      </div>

      <div class="lesson-chunk ${state.lessonStep===0?"active":""}" data-chunk="0">
        <div class="lesson-stage-head"><span class="eyebrow">1 · Launch</span><h3>Know where you are going</h3><p>Start with the goal, activate prior knowledge, then identify anything you need to revisit.</p></div>
        <div class="lesson-grid">
          <div class="lesson-block remember"><h3>Learning objectives</h3><ul>${l.objectives.map(x=>`<li>${x}</li>`).join("")}</ul></div>
          <div class="lesson-block"><h3>Starter retrieval</h3><ol>${l.retrieval.map(x=>`<li>${x}</li>`).join("")}</ol>
            <textarea class="student-answer" id="retrievalNotes" placeholder="Write brief answers before revealing the guidance..."></textarea>
            <button class="text-button" id="revealRetrieval">Show retrieval guidance</button>
            <div id="retrievalGuidance" class="answer-reveal">Answer from memory first. Use precise definitions and SI units. Any uncertain term should become a target as you work through the next chunks.</div>
          </div>
        </div>
      </div>

      <div class="lesson-chunk ${state.lessonStep===1?"active":""}" data-chunk="1">
        <div class="lesson-stage-head"><span class="eyebrow">2 · Learn</span><h3>Build the first part of the model</h3><p>Read one idea at a time. After each card, explain it aloud without looking back.</p></div>
        <div class="lesson-content-stack">${firstSections.map(sectionHtml).join("")}</div>
        <div class="lesson-task"><strong>Stop and explain:</strong> Write a three-sentence explanation of the main idea so far, using the lesson vocabulary accurately.
          <textarea class="student-answer" placeholder="Your explanation..."></textarea>
        </div>
      </div>

      <div class="lesson-chunk ${state.lessonStep===2?"active":""}" data-chunk="2">
        <div class="lesson-stage-head"><span class="eyebrow">3 · Develop</span><h3>Connect and extend the physics</h3><p>Now link the ideas together and focus on the cause-and-effect reasoning that earns explanation marks.</p></div>
        <div class="lesson-content-stack">${secondSections.map(sectionHtml).join("")}</div>
        <div class="lesson-task"><strong>Connect the ideas:</strong> Identify one variable you could change and predict what would happen to the relevant wave quantity. Give the physics reason, not just the trend.
          <textarea class="student-answer" placeholder="Prediction + physics reason..."></textarea>
        </div>
      </div>

      <div class="lesson-chunk ${state.lessonStep===3?"active":""}" data-chunk="3">
        <div class="lesson-stage-head"><span class="eyebrow">4 · Apply</span><h3>Turn the physics into calculations</h3><p>Choose the relationship, convert units first, substitute clearly and finish with a unit and sensible significant figures.</p></div>
        <div class="lesson-grid">
          <div class="lesson-block worked-block"><h3>Equations used in this lesson</h3>
            ${equations.length?equations.map(eq=>`<span class="formula-chip">${eq}</span>`).join(""):'<p>This lesson is mainly qualitative: focus on precise physical explanations.</p>'}
          </div>
          <div class="lesson-block warning"><h3>Calculation routine</h3><ol><li>Write the relationship.</li><li>Convert to SI units.</li><li>Rearrange before inserting numbers where possible.</li><li>Substitute with units.</li><li>Check magnitude and significant figures.</li></ol></div>
        </div>
        <div class="lesson-task"><strong>Practice:</strong> Create your own numerical example using one equation above, solve it, then change one input and predict how the answer changes.
          <textarea class="student-answer" placeholder="Equation, values, working and prediction..."></textarea>
        </div>
      </div>

      <div class="lesson-chunk ${state.lessonStep===4?"active":""}" data-chunk="4">
        <div class="lesson-stage-head"><span class="eyebrow">5 · Explore</span><h3>Use the simulation as evidence</h3><p>Do not just move sliders. Make a prediction, change one variable, record the observation and then explain it using the model and equation.</p></div>
        <div class="lesson-grid">
          <div class="lesson-block checkpoint-box"><h3>Simulation mission</h3><ol><li>Predict the effect of one control.</li><li>Open the linked model.</li><li>Change one variable only.</li><li>Capture or record a reading.</li><li>Explain whether the evidence supports your prediction.</li></ol><button class="button primary" id="openLessonSim">Open linked simulation</button></div>
          <div class="lesson-block"><h3>AQA explanation builder</h3><p>Use this order for longer responses: <strong>state the physics principle → apply it to the situation → describe the resulting change → link back to the observation.</strong></p>
            <textarea class="student-answer" placeholder="Write a short exam-style explanation using that structure..."></textarea>
          </div>
        </div>
        <button class="button" id="openLessonTextbook">Open full textbook chapter</button>
      </div>

      <div class="lesson-chunk ${state.lessonStep===5?"active":""}" data-chunk="5">
        <div class="lesson-stage-head"><span class="eyebrow">6 · Check</span><h3>Prove the lesson is secure</h3><p>Complete the knowledge check, then write an exit response before marking the lesson complete.</p></div>
        <div class="lesson-section">
          <h3>Quick check</h3>
          <p><strong>${quick.q}</strong></p>
          <div class="mini-options">${quick.a.map((a,i)=>`<button class="mini-option" data-qopt="${i}">${a}</button>`).join("")}</div>
          <div id="quickWhy" class="answer-reveal"></div>
        </div>
        <div class="lesson-task"><strong>Exit ticket:</strong> Write the one idea, equation or explanation from this lesson that would be most useful in an exam, then give one common mistake to avoid.
          <textarea class="student-answer" placeholder="Most useful idea + mistake to avoid..."></textarea>
        </div>
        <div class="lesson-actions">
          <button class="button ${state.progress.has(l.id)?"primary":""}" id="markLesson">${state.progress.has(l.id)?"Completed ✓":"Mark lesson complete"}</button>
        </div>
      </div>

      <div class="lesson-step-nav">
        <button class="button" id="lessonStepBack" ${state.lessonStep===0?"disabled":""}>← Previous step</button>
        <span class="muted small">Work through the lesson in order, or use the sequence above to revisit a chunk.</span>
        <button class="button primary" id="lessonStepNext" ${state.lessonStep===5?"disabled":""}>Next step →</button>
      </div>
      <div class="lesson-nav-row">
        <button class="button" id="prevLesson" ${idx===0?"disabled":""}>← Previous lesson</button>
        <button class="button" id="nextLesson" ${idx===D.lessons.length-1?"disabled":""}>Next lesson →</button>
      </div>`;

    $("#lessonPanel").querySelectorAll("[data-lesson-step]").forEach(b=>b.addEventListener("click",()=>{state.lessonStep=Number(b.dataset.lessonStep);renderLesson();}));
    $("#lessonStepBack")?.addEventListener("click",()=>{if(state.lessonStep>0){state.lessonStep--;renderLesson();}});
    $("#lessonStepNext")?.addEventListener("click",()=>{if(state.lessonStep<5){state.lessonStep++;renderLesson();}});
    $("#revealRetrieval")?.addEventListener("click",()=>$("#retrievalGuidance")?.classList.toggle("visible"));

    $("#lessonPanel").querySelectorAll("[data-qopt]").forEach(b=>b.addEventListener("click",()=>{
      const chosen=Number(b.dataset.qopt);
      $("#lessonPanel").querySelectorAll("[data-qopt]").forEach(x=>x.disabled=true);
      b.classList.add(chosen===quick.correct?"correct":"wrong");
      const correct=$("#lessonPanel").querySelector(`[data-qopt="${quick.correct}"]`); if(correct)correct.classList.add("correct");
      const why=$("#quickWhy"); if(why){why.textContent=quick.why;why.classList.add("visible");}
    }));
    $("#markLesson")?.addEventListener("click",()=>{state.progress.add(l.id);saveProgress();renderCourse();renderLesson();});
    $("#openLessonSim")?.addEventListener("click",()=>{state.returnLesson=l.id;loadSim(l.sim);switchView("lab");$("#backToLesson").classList.remove("hidden");});
    $("#openLessonTextbook")?.addEventListener("click",()=>{
      switchView("textbook");
      if(window.openWavesTextbookChapter) window.openWavesTextbookChapter(l.code);
    });
    $("#prevLesson")?.addEventListener("click",()=>{if(idx>0){state.lessonId=D.lessons[idx-1].id;state.lessonStep=0;renderCourse();renderLesson();}});
    $("#nextLesson")?.addEventListener("click",()=>{if(idx<D.lessons.length-1){state.lessonId=D.lessons[idx+1].id;state.lessonStep=0;renderCourse();renderLesson();}});
  }

  // ---------- Simulation lab ----------
  const simCanvas=$("#simCanvas"), sctx=simCanvas.getContext("2d");
  let simW=900, simH=520, dpr=1;

  const defaults = {
    progressive:{A:70,f:1.2,lambda:220},
    polarisation:{angle:35,mode:0},
    standing:{n:2,L:1.2,T:12,mu:0.006,A:80},
    interference:{lambda:70,sep:180,px:0.72,py:0.52},
    doubleSlit:{lambdaNm:600,D:2.0,sMm:0.35},
    diffraction:{lambdaNm:600,slitUm:40},
    grating:{lambdaNm:600,linesMm:500,order:1},
    refraction:{n1:1.5,n2:1.0,theta:30},
    fibre:{length:1000,modal:3,spectral:2,absorption:0.15}
  };

  function ensureVals(id){
    if(!state.simVals[id]) state.simVals[id]=JSON.parse(JSON.stringify(defaults[id]));
    return state.simVals[id];
  }

  const controlDefs = {
    progressive:[
      ["A","Amplitude",20,110,1," px"],
      ["f","Frequency",0.3,3,0.1," Hz"],
      ["lambda","Wavelength",90,380,5," px"]
    ],
    polarisation:[
      ["angle","Analyser angle",0,90,1,"°"],
      ["mode","Wave type (0 transverse, 1 longitudinal)",0,1,1,""]
    ],
    standing:[
      ["n","Harmonic",1,6,1,""],
      ["L","String length",0.5,2,0.05," m"],
      ["T","Tension",2,40,1," N"],
      ["mu","Mass per unit length",0.002,0.02,0.001," kg m⁻¹"],
      ["A","Display amplitude",30,100,1," px"]
    ],
    interference:[
      ["lambda","Wavelength",40,120,2," px"],
      ["sep","Source separation",90,300,5," px"],
      ["px","Observation x",0.40,0.92,0.01,""],
      ["py","Observation y",0.18,0.82,0.01,""]
    ],
    doubleSlit:[
      ["lambdaNm","Wavelength",400,700,5," nm"],
      ["D","Screen distance",0.5,4,0.1," m"],
      ["sMm","Slit separation",0.15,0.8,0.01," mm"]
    ],
    diffraction:[
      ["lambdaNm","Wavelength",400,700,5," nm"],
      ["slitUm","Slit width",10,100,2," μm"]
    ],
    grating:[
      ["lambdaNm","Wavelength",400,700,5," nm"],
      ["linesMm","Lines per mm",100,1000,25," mm⁻¹"],
      ["order","Order",0,5,1,""]
    ],
    refraction:[
      ["n1","n₁",1,2.2,0.01,""],
      ["n2","n₂",1,2.2,0.01,""],
      ["theta","Incidence angle",0,80,1,"°"]
    ],
    fibre:[
      ["length","Fibre length",100,5000,100," m"],
      ["modal","Modal spread",0,10,0.5,""],
      ["spectral","Material dispersion",0,10,0.5,""],
      ["absorption","Absorption",0,0.6,0.02," dB km⁻¹"]
    ]
  };

  function resizeSim(){
    const r=simCanvas.getBoundingClientRect();
    if(!r.width||!r.height)return;
    dpr=Math.min(window.devicePixelRatio||1,2);
    simW=r.width; simH=r.height;
    simCanvas.width=Math.round(simW*dpr); simCanvas.height=Math.round(simH*dpr);
    sctx.setTransform(dpr,0,0,dpr,0,0);
    drawSim();
  }
  window.addEventListener("resize",()=>{resizeSim();resizePractical();});

  function renderSimTabs(){
    $("#simTabs").innerHTML=D.sims.map(s=>`<button class="sim-tab ${s.id===state.simId?"active":""}" data-sim="${s.id}">${s.title}</button>`).join("");
    $("#simTabs").querySelectorAll("[data-sim]").forEach(b=>b.addEventListener("click",()=>{state.returnLesson=null;$("#backToLesson").classList.add("hidden");loadSim(b.dataset.sim);}));
  }

  function loadSim(id){
    state.simId=id; state.time=0; ensureVals(id);
    const s=D.sims.find(x=>x.id===id);
    $("#simCode").textContent=s.code;
    $("#simSpec").textContent=`AQA ${s.code}`;
    $("#simTitle").textContent=s.title;
    $("#simSubtitle").textContent=s.subtitle;
    $("#missionGoal").textContent=s.mission;
    $("#missionSteps").innerHTML=s.steps.map(x=>`<li>${x}</li>`).join("");
    $("#missionConclusion").textContent=s.conclusion;
    $("#simpleExplain").textContent=s.simple;
    $("#examExplain").textContent=s.exam;
    $("#mistakeExplain").textContent=s.mistake;
    renderSimTabs(); renderSimControls(); drawSim();
  }

  function renderSimControls(){
    const vals=ensureVals(state.simId);
    $("#simControls").innerHTML=(controlDefs[state.simId]||[]).map(([k,label,min,max,step,suffix])=>`
      <label class="field"><span>${label}</span>
        <input type="range" data-sim-control="${k}" min="${min}" max="${max}" step="${step}" value="${vals[k]}">
        <output data-sim-out="${k}">${fmt(vals[k],4)}${suffix}</output>
      </label>`).join("");
    $("#simControls").querySelectorAll("[data-sim-control]").forEach(input=>input.addEventListener("input",()=>{
      const k=input.dataset.simControl, v=Number(input.value);
      vals[k]=v;
      const def=controlDefs[state.simId].find(x=>x[0]===k);
      $("#simControls").querySelector(`[data-sim-out="${k}"]`).textContent=`${fmt(v,4)}${def[5]}`;
      drawSim();
    }));
  }

  $("#playPause").addEventListener("click",()=>{
    state.running=!state.running;
    $("#playPause").textContent=state.running?"Pause":"Play";
    $("#simState").textContent=state.running?(state.slow?"Slow motion":"Running"):"Paused";
  });
  $("#slowMotion").addEventListener("click",()=>{
    state.slow=!state.slow;
    $("#slowMotion").classList.toggle("primary",state.slow);
    $("#simState").textContent=state.running?(state.slow?"Slow motion":"Running"):"Paused";
  });
  $("#resetSim").addEventListener("click",()=>{
    state.simVals[state.simId]=JSON.parse(JSON.stringify(defaults[state.simId]));
    state.time=0; renderSimControls(); drawSim();
  });
  $("#snapshotSim").addEventListener("click",()=>{
    state.snapshots.unshift(`${D.sims.find(s=>s.id===state.simId).title}: ${$("#simReadout").textContent}`);
    state.snapshots=state.snapshots.slice(0,4);
    $("#snapshotTray").innerHTML=state.snapshots.map(x=>`<span class="pill">${x}</span>`).join("");
  });
  $("#backToLesson").addEventListener("click",()=>{
    if(state.returnLesson){state.lessonId=state.returnLesson;renderCourse();renderLesson();switchView("course");}
  });

  function line(x1,y1,x2,y2,stroke="#89d9ff",width=2,dash=[]){
    sctx.beginPath(); sctx.setLineDash(dash); sctx.moveTo(x1,y1); sctx.lineTo(x2,y2); sctx.strokeStyle=stroke; sctx.lineWidth=width; sctx.stroke(); sctx.setLineDash([]);
  }
  function text(t,x,y,size=13,color="#dceaff",align="left"){
    sctx.fillStyle=color;sctx.font=`${size}px system-ui`;sctx.textAlign=align;sctx.fillText(t,x,y);
  }
  function circle(x,y,r,fill,stroke=null){
    sctx.beginPath();sctx.arc(x,y,r,0,Math.PI*2);if(fill){sctx.fillStyle=fill;sctx.fill();}if(stroke){sctx.strokeStyle=stroke;sctx.stroke();}
  }
  function clear(){
    sctx.clearRect(0,0,simW,simH);
    const g=sctx.createLinearGradient(0,0,0,simH);g.addColorStop(0,"#102b48");g.addColorStop(1,"#07131f");sctx.fillStyle=g;sctx.fillRect(0,0,simW,simH);
  }

  function drawProgressive(v){
    const mid=simH/2, left=45, right=simW-35, width=right-left;
    line(left,mid,right,mid,"#49627c",1);
    sctx.beginPath();
    for(let x=0;x<=width;x+=2){
      const y=mid-v.A*Math.sin(2*Math.PI*x/v.lambda-2*Math.PI*v.f*state.time);
      if(x===0)sctx.moveTo(left+x,y); else sctx.lineTo(left+x,y);
    }
    sctx.strokeStyle="#67c7ff";sctx.lineWidth=3;sctx.stroke();
    for(let i=0;i<9;i++){
      const x=left+i*width/8;
      const y=mid-v.A*Math.sin(2*Math.PI*(x-left)/v.lambda-2*Math.PI*v.f*state.time);
      circle(x,y,5,"#ffd56a");
      line(x,mid,x,y,"rgba(255,213,106,.35)",1,[4,4]);
    }
    const speed=v.f*v.lambda;
    text("particle oscillation",left+20,35,13,"#ffd56a");
    text("energy / phase propagation →",right-10,35,13,"#9fddff","right");
    $("#simReadout").textContent=`f = ${fmt(v.f,2)} Hz · λ(display) = ${fmt(v.lambda,0)} units · v(display) = fλ = ${fmt(speed,1)} units s⁻¹`;
  }

  function drawPolarisation(v){
    const transverse=v.mode<0.5, mid=simH/2, left=55, right=simW-60;
    line(left,mid,right,mid,"#49627c",1);
    if(transverse){
      sctx.beginPath();
      for(let x=left;x<=right;x+=3){
        const y=mid-80*Math.sin((x-left)/55-state.time*3);
        if(x===left)sctx.moveTo(x,y);else sctx.lineTo(x,y);
      }
      sctx.strokeStyle="#67c7ff";sctx.lineWidth=3;sctx.stroke();
    } else {
      for(let x=left;x<=right;x+=28){
        const dx=12*Math.sin((x-left)/55-state.time*3);
        circle(x+dx,mid,7,"#67c7ff");
      }
    }
    const ax=simW*0.68, ang=v.angle*Math.PI/180;
    line(ax-75*Math.cos(ang),mid+75*Math.sin(ang),ax+75*Math.cos(ang),mid-75*Math.sin(ang),"#ffd56a",5);
    text("analyser axis",ax,mid-92,13,"#ffd56a","center");
    const transmitted=transverse?Math.abs(Math.cos(ang)):1;
    text(transverse?"TRANSVERSE":"LONGITUDINAL",80,62,18,"#dff5ff");
    text(`relative transmitted amplitude ≈ ${fmt(transmitted,2)}`,simW-55,simH-35,14,"#9fddff","right");
    $("#simReadout").textContent=transverse?`Transverse mode · analyser = ${fmt(v.angle,0)}° · transmitted component ≈ ${fmt(transmitted,2)}`:"Longitudinal mode · no selectable transverse plane";
  }

  function drawStanding(v){
    const left=55,right=simW-55,mid=simH/2,w=right-left;
    line(left,mid,right,mid,"#49627c",1);
    const phase=Math.sin(state.time*4);
    sctx.beginPath();
    for(let x=0;x<=w;x+=2){
      const y=mid-v.A*Math.sin(v.n*Math.PI*x/w)*phase;
      if(x===0)sctx.moveTo(left+x,y);else sctx.lineTo(left+x,y);
    }
    sctx.strokeStyle="#67c7ff";sctx.lineWidth=3;sctx.stroke();
    for(let i=0;i<=v.n;i++){
      const x=left+i*w/v.n; circle(x,mid,5,"#ff7b87"); text("N",x,mid+24,11,"#ffadb5","center");
    }
    for(let i=0;i<v.n;i++){
      const x=left+(i+0.5)*w/v.n; text("A",x,mid-100,11,"#63d9a4","center");
    }
    const lambda=2*v.L/v.n, speed=Math.sqrt(v.T/v.mu), f=speed/lambda;
    text(`harmonic n = ${v.n}`,left,40,14,"#dff5ff");
    $("#simReadout").textContent=`λ = 2L/n = ${fmt(lambda,3)} m · v = √(T/μ) = ${fmt(speed,2)} m s⁻¹ · f = ${fmt(f,2)} Hz`;
  }

  function drawInterference(v){
    const sx=simW*0.22, sy=simH/2, s1y=sy-v.sep/2, s2y=sy+v.sep/2;
    const px=simW*v.px, py=simH*v.py;
    [s1y,s2y].forEach((yy,i)=>{
      circle(sx,yy,8,i?"#9a86ff":"#67c7ff");
      for(let r=20;r<simW;r+=v.lambda){
        sctx.beginPath();sctx.arc(sx,yy,r,0,Math.PI*2);sctx.strokeStyle=i?"rgba(154,134,255,.20)":"rgba(103,199,255,.20)";sctx.stroke();
      }
    });
    line(sx,s1y,px,py,"rgba(255,255,255,.4)",1,[5,5]); line(sx,s2y,px,py,"rgba(255,255,255,.4)",1,[5,5]);
    const r1=Math.hypot(px-sx,py-s1y), r2=Math.hypot(px-sx,py-s2y), pd=Math.abs(r1-r2);
    const amp=2*Math.abs(Math.cos(Math.PI*pd/v.lambda));
    circle(px,py,12+8*amp,amp>1.35?"#63d9a4":amp<0.55?"#ff7b87":"#ffd56a");
    text("S₁",sx-18,s1y-10,13);text("S₂",sx-18,s2y-10,13);text("P",px+16,py-12,13);
    const cycles=pd/v.lambda;
    $("#simReadout").textContent=`path difference ≈ ${fmt(pd,1)} display units = ${fmt(cycles,2)}λ · resultant amplitude factor ≈ ${fmt(amp,2)}`;
  }

  function wavelengthColor(nm){
    if(nm<470)return "#7f77ff"; if(nm<520)return "#49c8ff"; if(nm<570)return "#63d9a4"; if(nm<600)return "#ffd56a"; return "#ff8b6a";
  }

  function drawDoubleSlit(v){
    const slitX=simW*0.25, screenX=simW*0.82, mid=simH/2;
    const lambda=v.lambdaNm*1e-9, s=v.sMm*1e-3, w=lambda*v.D/s;
    line(slitX,55,slitX,simH-55,"#dceaff",5);
    const gap=38; line(slitX,mid-gap-10,slitX,mid-gap+10,"#07131f",8);line(slitX,mid+gap-10,slitX,mid+gap+10,"#07131f",8);
    line(screenX,45,screenX,simH-45,"#dceaff",5);
    const scale=12000;
    const wpix=clamp(w*scale,10,90);
    for(let y=mid-230;y<=mid+230;y+=wpix){
      const dy=Math.abs(y-mid), intensity=Math.pow(Math.cos(Math.PI*dy/wpix),2);
      sctx.fillStyle=wavelengthColor(v.lambdaNm);sctx.globalAlpha=0.12+0.85*intensity;sctx.fillRect(screenX+6,y-wpix/2,42,wpix);
    }
    sctx.globalAlpha=1;
    line(slitX,mid-gap,screenX,mid,"rgba(103,199,255,.35)",1,[4,4]);line(slitX,mid+gap,screenX,mid,"rgba(154,134,255,.35)",1,[4,4]);
    text("double slit",slitX,35,13,"#dff5ff","center");text("screen",screenX,35,13,"#dff5ff","center");
    $("#simReadout").textContent=`w = λD/s = ${fmt(w,5)} m (${fmt(w*1000,2)} mm)`;
  }

  function drawDiffraction(v){
    const left=simW*0.18, screenX=simW*0.80, mid=simH/2;
    line(left,50,left,simH-50,"#dceaff",6);
    const gap=clamp(v.slitUm/2,8,50);
    line(left,mid-gap,left,mid+gap,"#07131f",10);
    line(screenX,45,screenX,simH-45,"#dceaff",5);
    const relative=(v.lambdaNm/600)*(40/v.slitUm);
    const central=clamp(150*relative,35,280);
    for(let y=mid-220;y<mid+220;y+=3){
      const z=(y-mid)/(central/2);
      const I=Math.abs(z)<0.001?1:Math.pow(Math.sin(Math.PI*z)/(Math.PI*z),2);
      sctx.globalAlpha=0.05+0.95*I;sctx.fillStyle=wavelengthColor(v.lambdaNm);sctx.fillRect(screenX+6,y,48,3);
    }
    sctx.globalAlpha=1;
    text("single slit",left,35,13,"#dff5ff","center");
    text(`central maximum width (relative) ≈ ${fmt(central,0)} px`,screenX-10,simH-25,13,"#9fddff","right");
    $("#simReadout").textContent=`Longer λ / narrower slit → greater diffraction · relative λ/a = ${fmt(v.lambdaNm/v.slitUm,2)} nm μm⁻¹`;
  }

  function drawGrating(v){
    const d=1/(v.linesMm*1e3), lambda=v.lambdaNm*1e-9, x=v.order*lambda/d;
    const gx=simW*0.22, mid=simH/2;
    for(let y=70;y<simH-70;y+=8) line(gx-12,y,gx+12,y,"#dceaff",2);
    line(gx,mid,simW-80,mid,"rgba(255,255,255,.25)",1,[4,4]);
    let msg;
    if(x<=1){
      const theta=Math.asin(x), endX=simW-90, len=endX-gx, endY=mid-len*Math.tan(theta);
      line(gx,mid,endX,clamp(endY,35,simH-35),wavelengthColor(v.lambdaNm),4);
      if(v.order>0)line(gx,mid,endX,clamp(mid+len*Math.tan(theta),35,simH-35),wavelengthColor(v.lambdaNm),4);
      msg=`θ = ${fmt(theta*180/Math.PI,2)}°`;
      text(`n = ${v.order}`,gx+80,mid-25,14,"#dff5ff");
    } else {
      text("No physical maximum for this order",simW/2,mid,20,"#ff7b87","center");
      msg="nλ > d — order impossible";
    }
    $("#simReadout").textContent=`d = ${d.toExponential(3)} m · nλ/d = ${fmt(x,3)} · ${msg}`;
  }

  function drawRefraction(v){
    const midY=simH/2, x0=simW/2;
    sctx.fillStyle="rgba(103,199,255,.06)";sctx.fillRect(0,0,simW,midY);
    sctx.fillStyle="rgba(154,134,255,.08)";sctx.fillRect(0,midY,simW,midY);
    line(0,midY,simW,midY,"#dceaff",2);line(x0,40,x0,simH-40,"rgba(255,255,255,.3)",1,[5,5]);
    const th1=v.theta*Math.PI/180, len=210;
    const sx=x0-len*Math.sin(th1), sy=midY-len*Math.cos(th1);
    line(sx,sy,x0,midY,"#ffd56a",4);
    const sin2=v.n1*Math.sin(th1)/v.n2;
    let out;
    if(Math.abs(sin2)<=1){
      const th2=Math.asin(sin2), ex=x0+len*Math.sin(th2), ey=midY+len*Math.cos(th2);
      line(x0,midY,ex,ey,"#67c7ff",4);
      out=`θ₂ = ${fmt(th2*180/Math.PI,2)}°`;
    } else {
      const ex=x0+len*Math.sin(th1), ey=midY-len*Math.cos(th1);
      line(x0,midY,ex,ey,"#ff7b87",4);
      out="TIR";
    }
    text(`n₁ = ${fmt(v.n1,2)}`,25,40,15,"#dff5ff");text(`n₂ = ${fmt(v.n2,2)}`,25,simH-30,15,"#dff5ff");
    const crit=v.n1>v.n2?Math.asin(v.n2/v.n1)*180/Math.PI:null;
    $("#simReadout").textContent=`n₁ sinθ₁ = n₂ sinθ₂ · θ₁ = ${fmt(v.theta,1)}° · ${out}${crit!==null?` · θc = ${fmt(crit,2)}°`:""}`;
  }

  function drawFibre(v){
    const x1=70,x2=simW-70, top=simH*0.28,bottom=simH*0.62, mid=(top+bottom)/2;
    sctx.fillStyle="rgba(103,199,255,.13)";sctx.fillRect(x1,top,x2-x1,bottom-top);
    line(x1,top,x2,top,"#9a86ff",4);line(x1,bottom,x2,bottom,"#9a86ff",4);
    const pulseX=x1+((state.time*90)%(x2-x1));
    let x=x1,y=mid,dir=1;
    sctx.beginPath();sctx.moveTo(x,y);
    const slope=0.58;
    while(x<x2){
      const nx=Math.min(x+80,x2); y += dir*slope*(nx-x);
      if(y<top+12){y=top+12;dir=1;} if(y>bottom-12){y=bottom-12;dir=-1;}
      sctx.lineTo(nx,y);x=nx;
    }
    sctx.strokeStyle="#ffd56a";sctx.lineWidth=2;sctx.stroke();
    circle(clamp(pulseX,x1,x2),mid,10,"#67c7ff");
    const broad=18+v.modal*3+v.spectral*3+v.length/700;
    const amp=Math.exp(-v.absorption*(v.length/1000)/4);
    const graphY=simH*0.83;
    line(x1,graphY,x2,graphY,"#49627c",1);
    sctx.beginPath();
    for(let px=x1;px<=x2;px+=2){
      const z=(px-(x1+(x2-x1)*0.68))/broad;
      const yy=graphY-90*amp*Math.exp(-0.5*z*z);
      if(px===x1)sctx.moveTo(px,yy);else sctx.lineTo(px,yy);
    }
    sctx.strokeStyle="#63d9a4";sctx.lineWidth=3;sctx.stroke();
    text("core",x1+10,top+25,13,"#9fddff");text("received pulse",x2-10,graphY-105,13,"#63d9a4","right");
    $("#simReadout").textContent=`relative pulse width ≈ ${fmt(broad,1)} · relative amplitude ≈ ${fmt(amp,2)} · longer fibre / more dispersion → broader pulse`;
  }

  function drawSim(){
    if(!simCanvas.width)return;
    clear();
    const v=ensureVals(state.simId);
    ({progressive:drawProgressive,polarisation:drawPolarisation,standing:drawStanding,interference:drawInterference,doubleSlit:drawDoubleSlit,diffraction:drawDiffraction,grating:drawGrating,refraction:drawRefraction,fibre:drawFibre}[state.simId]||drawProgressive)(v);
  }

  function animate(ts){
    const dt=state.lastTs?Math.min((ts-state.lastTs)/1000,0.05):0; state.lastTs=ts;
    if(state.running)state.time+=dt*(state.slow?0.25:1);
    drawSim(); requestAnimationFrame(animate);
  }

  // ---------- Practicals ----------
  const pCanvas=$("#practicalCanvas"), pctx=pCanvas.getContext("2d");
  let pW=700,pH=330,pdpr=1;
  const pVals={
    standing:{L:1.0,mass:0.5,mu:0.006,n:1},
    young:{lambdaNm:635,D:2.0,sMm:0.35},
    grating:{lambdaNm:635,linesMm:300,order:1}
  };
  const pDefs={
    standing:[["L","Vibrating length",0.4,1.5,0.05," m"],["mass","Hanging mass",0.1,1.5,0.05," kg"],["mu","μ",0.003,0.012,0.001," kg m⁻¹"],["n","Harmonic",1,4,1,""]],
    young:[["lambdaNm","Laser wavelength",500,700,5," nm"],["D","Screen distance",0.5,4,0.1," m"],["sMm","Slit separation",0.15,0.8,0.01," mm"]],
    grating:[["lambdaNm","Laser wavelength",500,700,5," nm"],["linesMm","Grating lines",100,1000,25," mm⁻¹"],["order","Order",1,5,1,""]]
  };

  function resizePractical(){
    const r=pCanvas.getBoundingClientRect(); if(!r.width||!r.height)return;
    pdpr=Math.min(window.devicePixelRatio||1,2);pW=r.width;pH=r.height;pCanvas.width=pW*pdpr;pCanvas.height=pH*pdpr;pctx.setTransform(pdpr,0,0,pdpr,0,0);drawPractical();
  }

  function renderPractical(){
    const type=state.practical, vals=pVals[type];
    const meta={
      standing:["Required Practical 1","Stationary waves on a string","Investigate how frequency changes with string length, tension and mass per unit length.","Keep string type fixed unless investigating μ; identify a stable harmonic; measure vibrating length between nodes; repeat readings. Plot f against 1/L or f² against T where appropriate."],
      young:["Required Practical 2","Young double-slit interference","Measure fringe spacing and use it to determine the wavelength of light.","Measure across several fringes and divide by the number of gaps. Use a long screen distance where practical, keep geometry square and follow laser safety procedures."],
      grating:["Required Practical 2","Diffraction grating","Measure diffraction angle and determine wavelength from d sinθ = nλ.","Measure symmetric orders on both sides when possible, convert lines per mm to lines per metre, repeat angular readings and check that the selected order can exist."]
    }[type];
    $("#practicalCode").textContent=meta[0];$("#practicalTitle").textContent=meta[1];$("#practicalIntro").textContent=meta[2];$("#practicalGuidance").innerHTML=`<strong>Method/evaluation focus:</strong> ${meta[3]}`;
    $("#practicalControls").innerHTML=pDefs[type].map(([k,label,min,max,step,suffix])=>`
      <label class="field"><span>${label}</span><input type="range" data-pc="${k}" min="${min}" max="${max}" step="${step}" value="${vals[k]}"><output data-po="${k}">${fmt(vals[k],4)}${suffix}</output></label>`).join("");
    $("#practicalControls").querySelectorAll("[data-pc]").forEach(i=>i.addEventListener("input",()=>{
      const k=i.dataset.pc;vals[k]=Number(i.value);const def=pDefs[type].find(x=>x[0]===k);$("#practicalControls").querySelector(`[data-po="${k}"]`).textContent=`${fmt(vals[k],4)}${def[5]}`;drawPractical();
    }));
    const headers={
      standing:["L / m","T / N","f / Hz","1/L / m⁻¹","f² / Hz²"],
      young:["D / m","s / mm","fringe w / mm","λcalc / nm"],
      grating:["lines / mm⁻¹","order n","θ / °","λcalc / nm"]
    }[type];
    $("#practicalHead").innerHTML=`<tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr>`;
    renderPracticalRows(); drawPractical();
  }

  $$("[data-practical]").forEach(b=>b.addEventListener("click",()=>{
    state.practical=b.dataset.practical;
    $$("[data-practical]").forEach(x=>x.classList.toggle("primary",x===b));
    renderPractical();
  }));
  $("#clearPracticalData").addEventListener("click",()=>{state.practicalData[state.practical]=[];renderPracticalRows();drawPractical();});
  $("#takePracticalReading").addEventListener("click",()=>{
    const t=state.practical,v=pVals[t],noise=()=>1+(Math.random()-.5)*0.018;
    if(t==="standing"){
      const T=v.mass*9.81, speed=Math.sqrt(T/v.mu), f=v.n*speed/(2*v.L)*noise();
      state.practicalData[t].push([v.L,T,f,1/v.L,f*f]);
    } else if(t==="young"){
      const lam=v.lambdaNm*1e-9,s=v.sMm*1e-3,w=lam*v.D/s*noise();
      const calc=w*s/v.D*1e9; state.practicalData[t].push([v.D,v.sMm,w*1000,calc]);
    } else {
      const d=1/(v.linesMm*1e3),x=v.order*v.lambdaNm*1e-9/d;
      if(x<=1){const theta=Math.asin(x)*180/Math.PI*noise();const calc=d*Math.sin(theta*Math.PI/180)/v.order*1e9;state.practicalData[t].push([v.linesMm,v.order,theta,calc]);}
    }
    renderPracticalRows(); drawPractical();
  });

  function renderPracticalRows(){
    const rows=state.practicalData[state.practical];
    $("#practicalRows").innerHTML=rows.map(r=>`<tr>${r.map(v=>`<td>${fmt(v,4)}</td>`).join("")}</tr>`).join("");
    $("#practicalSummary").textContent=rows.length? `${rows.length} reading${rows.length===1?"":"s"} collected. Look for the predicted proportional relationship and consider scatter/uncertainty.`:"Collect several readings to reveal the relationship.";
    $("#practicalStats").innerHTML=`<div><strong>${rows.length}</strong><span>readings</span></div><div><strong>${rows.length?fmt(rows[rows.length-1][rows[rows.length-1].length-1],3):"—"}</strong><span>latest derived value</span></div><div><strong>${rows.length>=5?"Good":"More data"}</strong><span>data coverage</span></div>`;
  }

  function pLine(x1,y1,x2,y2,c="#89d9ff",w=2){pctx.beginPath();pctx.moveTo(x1,y1);pctx.lineTo(x2,y2);pctx.strokeStyle=c;pctx.lineWidth=w;pctx.stroke();}
  function drawPractical(){
    if(!pCanvas.width)return;
    pctx.clearRect(0,0,pW,pH);pctx.fillStyle="#081421";pctx.fillRect(0,0,pW,pH);
    const t=state.practical,v=pVals[t];
    if(t==="standing"){
      const y=pH/2,left=45,right=pW-45,w=right-left; pLine(left,y,right,y,"#49627c",1);
      pctx.beginPath();for(let x=0;x<=w;x+=2){const yy=y-65*Math.sin(v.n*Math.PI*x/w)*Math.sin(state.time*4);if(x===0)pctx.moveTo(left+x,yy);else pctx.lineTo(left+x,yy);}pctx.strokeStyle="#67c7ff";pctx.lineWidth=3;pctx.stroke();
      for(let i=0;i<=v.n;i++){pctx.beginPath();pctx.arc(left+i*w/v.n,y,5,0,Math.PI*2);pctx.fillStyle="#ff7b87";pctx.fill();}
      const T=v.mass*9.81,f=v.n/(2*v.L)*Math.sqrt(T/v.mu);pctx.fillStyle="#dff5ff";pctx.font="14px system-ui";pctx.fillText(`predicted f ≈ ${fmt(f,2)} Hz`,20,28);
    } else if(t==="young"){
      const mid=pH/2,screen=pW*0.82,slit=pW*0.24; pLine(slit,30,slit,pH-30,"#dceaff",4);pLine(screen,25,screen,pH-25,"#dceaff",4);
      const w=v.lambdaNm*1e-9*v.D/(v.sMm*1e-3),wp=clamp(w*12000,10,70);
      for(let y=mid-135;y<mid+135;y+=wp){pctx.fillStyle=wavelengthColor(v.lambdaNm);pctx.globalAlpha=.85;pctx.fillRect(screen+5,y-wp*.25,40,wp*.5);}pctx.globalAlpha=1;
      pctx.fillStyle="#dff5ff";pctx.font="14px system-ui";pctx.fillText(`predicted fringe spacing ${fmt(w*1000,2)} mm`,20,28);
    } else {
      const gx=pW*0.25,mid=pH/2;for(let y=40;y<pH-40;y+=7)pLine(gx-10,y,gx+10,y,"#dceaff",2);
      const d=1/(v.linesMm*1e3),x=v.order*v.lambdaNm*1e-9/d;pLine(gx,mid,pW-50,mid,"#49627c",1);
      pctx.fillStyle="#dff5ff";pctx.font="14px system-ui";
      if(x<=1){const th=Math.asin(x),len=pW-gx-70;pLine(gx,mid,gx+len,mid-len*Math.tan(th),wavelengthColor(v.lambdaNm),3);pLine(gx,mid,gx+len,mid+len*Math.tan(th),wavelengthColor(v.lambdaNm),3);pctx.fillText(`predicted θ ≈ ${fmt(th*180/Math.PI,2)}°`,20,28);}
      else pctx.fillText("Selected order is not physically possible.",20,28);
    }
  }

  // ---------- Formula coach ----------
  function renderFormula(){
    $("#formulaSelect").innerHTML=D.formulas.map(f=>`<option value="${f.id}">${f.name} · ${f.eq}</option>`).join("");
    renderFormulaInputs();
    $("#formulaSelect").addEventListener("change",renderFormulaInputs);
    $("#formulaCards").innerHTML=D.formulas.map(f=>`<article class="formula-card"><strong>${f.name}</strong><code>${f.eq}</code><p>Use SI units unless the input label states otherwise.</p></article>`).join("");
  }

  function renderFormulaInputs(){
    const f=D.formulas.find(x=>x.id===$("#formulaSelect").value) || D.formulas[0];
    $("#formulaInputs").innerHTML=f.fields.map(([k,label],i)=>`<label class="field"><span>${label}</span><input type="number" step="any" data-fi="${k}" value="${defaultFormulaValue(f.id,k,i)}"></label>`).join("");
    $("#formulaInputs").querySelectorAll("input").forEach(i=>i.addEventListener("input",calculateFormula));
    calculateFormula();
  }
  function defaultFormulaValue(id,k,i){
    const map={f:5,lambda:0.8,T:0.2,dx:0.15,tension:12,mu:0.006,n:2,L:1.2,D:2,s:0.00035,d:0.000002,v:200000000,n1:1.5,theta1:30,n2:1};
    return map[k]??(i+1);
  }
  function calculateFormula(){
    const f=D.formulas.find(x=>x.id===$("#formulaSelect").value) || D.formulas[0], vals={};
    $("#formulaInputs").querySelectorAll("[data-fi]").forEach(i=>vals[i.dataset.fi]=Number(i.value));
    let r; try{r=f.calc(vals);}catch(e){r={error:"Enter valid numerical values."};}
    if(r.error){$("#formulaWorking").innerHTML=`<span class="step">${r.error}</span>`;return;}
    $("#formulaWorking").innerHTML=`
      <span class="step"><strong>1. Equation:</strong> ${f.eq}</span>
      ${r.steps.map((s,i)=>`<span class="step"><strong>${i+2}. ${i===0?"Rearrange/substitute":"Substitute"}:</strong> ${s}</span>`).join("")}
      <span class="step formula-answer"><strong>Answer:</strong> ${fmt(r.answer,6)} ${r.unit}</span>`;
  }

  // ---------- Quiz ----------
  function renderQuiz(){
    const q=D.quiz[state.quizIndex];
    $("#quizProgress").textContent=`${state.quizIndex+1} / ${D.quiz.length}`;
    $("#quizProgressFill").style.width=`${100*(state.quizIndex+1)/D.quiz.length}%`;
    $("#quizScore").textContent=state.quizScore;$("#quizStreak").textContent=state.quizStreak;$("#quizSpec").textContent=`AQA ${q.spec}`;$("#quizQuestion").textContent=q.q;
    $("#quizHint").textContent=q.hint;$("#quizHint").classList.add("hidden");$("#showHint").textContent="Show hint";
    $("#quizFeedback").className="feedback hidden";$("#nextQuestion").classList.add("hidden");state.quizLocked=false;
    $("#quizChoices").innerHTML=q.choices.map((c,i)=>`<button class="choice-button" data-choice="${i}">${c}</button>`).join("");
    $("#quizChoices").querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>answerQuiz(Number(b.dataset.choice))));
  }
  function answerQuiz(choice){
    if(state.quizLocked)return;state.quizLocked=true;const q=D.quiz[state.quizIndex],ok=choice===q.answer;
    if(ok){state.quizScore++;state.quizStreak++;}else state.quizStreak=0;
    $("#quizChoices").querySelectorAll("[data-choice]").forEach(b=>{b.disabled=true;const n=Number(b.dataset.choice);if(n===q.answer)b.classList.add("correct");else if(n===choice)b.classList.add("wrong");});
    const fb=$("#quizFeedback");fb.classList.remove("hidden");fb.classList.add(ok?"good":"bad");fb.innerHTML=`<strong>${ok?"Correct":"Not quite"}.</strong> ${q.why}`;
    $("#quizScore").textContent=state.quizScore;$("#quizStreak").textContent=state.quizStreak;$("#nextQuestion").classList.remove("hidden");
  }
  $("#showHint").addEventListener("click",()=>$("#quizHint").classList.toggle("hidden"));
  $("#nextQuestion").addEventListener("click",()=>{state.quizIndex=(state.quizIndex+1)%D.quiz.length;renderQuiz();});
  $("#restartQuiz").addEventListener("click",()=>{state.quizIndex=0;state.quizScore=0;state.quizStreak=0;renderQuiz();});

  // ---------- Spec map ----------
  function renderSpec(){
    $("#specGrid").innerHTML=D.spec.map(([code,title,desc,lesson,sim])=>`
      <article class="spec-card">
        <div class="status"><span class="eyebrow">${code}</span><span class="status-dot ${lesson.split("–")[0] && [...state.progress].some(p=>lesson.includes(p))?"done":""}"></span></div>
        <h3>${title}</h3><p>${desc}</p><p><strong>Linked:</strong> ${lesson} · ${D.sims.find(s=>s.id===sim)?.title||sim}</p>
        <button class="text-button" data-spec-sim="${sim}">Open model</button>
      </article>`).join("");
    $("#specGrid").querySelectorAll("[data-spec-sim]").forEach(b=>b.addEventListener("click",()=>{loadSim(b.dataset.specSim);switchView("lab");}));
  }

  // Init
  updateProgress();renderCourse();renderLesson();renderSimTabs();loadSim(state.simId);renderPractical();renderFormula();renderQuiz();renderSpec();
  resizeSim();resizePractical();requestAnimationFrame(animate);

  if("serviceWorker" in navigator){
    window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
  }
})();