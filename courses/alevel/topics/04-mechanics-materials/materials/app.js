(() => {
  const D = window.MATERIALS_DATA;
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const state = {
    lesson: localStorage.getItem('materials.lesson') || D.lessons[0].id,
    complete: JSON.parse(localStorage.getItem('materials.complete') || '[]'),
    chapter: D.textbook[0].id,
    sim: D.sims[0].id,
    simValues: {},
    snapshots: [],
    quizIndex: 0, quizScore: 0, quizStreak: 0, quizLocked: false,
    extended: 0,
    rpRows: []
  };

  function save(){ localStorage.setItem('materials.lesson', state.lesson); localStorage.setItem('materials.complete', JSON.stringify(state.complete)); }
  function esc(v){ return String(v ?? '').replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }
  function view(name){
    $$('.view').forEach(v=>v.classList.toggle('active-view', v.id === `view-${name}`));
    $$('.nav-button').forEach(b=>b.classList.toggle('active', b.dataset.view===name));
    if(name==='lab') requestAnimationFrame(drawSim);
    if(name==='practical') requestAnimationFrame(drawRpGraph);
    window.scrollTo({top:82,behavior:'smooth'});
  }
  $$('.nav-button').forEach(b=>b.addEventListener('click',()=>view(b.dataset.view)));
  $$('[data-jump]').forEach(b=>b.addEventListener('click',()=>view(b.dataset.jump)));

  function updateProgress(){
    const n=state.complete.length,total=D.lessons.length;
    $('#progressText').textContent=`${n} / ${total} complete`;
    $('#progressFill').style.width=`${n/total*100}%`;
  }
  function downloadText(filename, text, type='text/plain') {
    const blob = new Blob([text], {type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url), 1000);
  }
  $('#resetProgress').addEventListener('click',()=>{state.complete=[];save();renderCourse();updateProgress();});
  $('#exportProgress').addEventListener('click',()=>{
    const payload={app:'AQA Materials Learning Lab',version:2,exportedAt:new Date().toISOString(),lesson:state.lesson,complete:state.complete};
    downloadText('materials-learning-progress.json',JSON.stringify(payload,null,2),'application/json');
  });
  $('#importProgress').addEventListener('click',()=>$('#progressFile').click());
  $('#progressFile').addEventListener('change',async(e)=>{
    const file=e.target.files?.[0]; if(!file)return;
    try{
      const data=JSON.parse(await file.text());
      const validIds=new Set(D.lessons.map(l=>l.id));
      state.complete=Array.isArray(data.complete)?data.complete.filter(id=>validIds.has(id)):[];
      if(validIds.has(data.lesson))state.lesson=data.lesson;
      save();renderCourse();updateProgress();
      alert('Progress imported successfully.');
    }catch{alert('That file is not a valid Materials Learning Lab progress backup.');}
    e.target.value='';
  });

  function renderCourse(){
    const list=$('#courseList'); list.innerHTML='';
    D.lessons.forEach((l,i)=>{
      const b=document.createElement('button');
      b.className=`course-button ${l.id===state.lesson?'active':''} ${state.complete.includes(l.id)?'done':''}`;
      b.innerHTML=`<span class="code">${esc(l.code)} · Lesson ${i+1}</span><strong>${esc(l.title)}</strong><span class="status">${state.complete.includes(l.id)?'✓ Complete':'Open lesson'}</span>`;
      b.onclick=()=>{state.lesson=l.id;save();renderCourse();}; list.appendChild(b);
    });
    renderLesson(D.lessons.find(l=>l.id===state.lesson)||D.lessons[0]);
  }
  function renderLesson(l){
    const check=l.check;
    $('#lessonPanel').innerHTML=`
      <div class="lesson-title"><div><span class="eyebrow">${esc(l.code)}</span><h2>${esc(l.title)}</h2><p class="muted">${esc(l.lead)}</p></div><button class="button ${state.complete.includes(l.id)?'primary':''}" id="completeLesson">${state.complete.includes(l.id)?'✓ Complete':'Mark complete'}</button></div>
      <div class="keyword-row">${l.keywords.map(k=>`<span class="keyword">${esc(k)}</span>`).join('')}</div>
      <div class="lesson-section"><h3>Objectives</h3><ul>${l.objectives.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>
      <div class="lesson-section"><h3>Starter / retrieval</h3><div class="retrieval-grid">${l.retrieval.map((r,i)=>`<div class="reveal-card"><strong>${i+1}. ${esc(r[0])}</strong><div class="hidden" id="ret-${i}">${esc(r[1])}</div><button class="button reveal" data-r="ret-${i}">Reveal answer</button></div>`).join('')}</div></div>
      <div class="lesson-section"><h3>Core teaching</h3>${l.teach.map(t=>`<div class="teach-card"><strong>${esc(t[0])}</strong><div>${esc(t[1])}</div></div>`).join('')}</div>
      <div class="lesson-section"><h3>Equations</h3><div class="keyword-row">${l.formulas.map(f=>`<span class="equation">${esc(f)}</span>`).join('')}</div></div>
      <div class="lesson-section"><h3>Worked example</h3><div class="worked"><strong>${esc(l.worked.q)}</strong><ol>${l.worked.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div></div>
      <div class="lesson-section"><h3>Student activity</h3><p>${esc(l.activity)}</p></div>
      <div class="lesson-section"><h3>Simulation mission</h3><div class="worked"><strong>${esc(l.mission.goal)}</strong><ol>${l.mission.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><p><strong>Conclude:</strong> ${esc(l.mission.conclusion)}</p><button class="button" id="openLinkedSim">Open linked simulation</button></div></div>
      <div class="lesson-section"><h3>Auto-mark knowledge check</h3><div class="lesson-check"><strong>${esc(check[0])}</strong>${check[1].map((c,i)=>`<button class="choice lesson-choice" data-choice="${i}">${esc(c)}</button>`).join('')}<div class="feedback hidden" id="lessonFeedback"></div></div></div>
      <div class="lesson-section"><h3>Exam tip</h3><div class="teach-card"><strong>Use this wording:</strong> ${esc(l.examTip)}</div><div class="teach-card"><strong>Common misconception:</strong> ${esc(l.misconception)}</div></div>
      <div class="lesson-section auto-answer"><h3>Exit question</h3><p>${esc(l.exit)}</p><textarea id="exitAnswer" rows="4" placeholder="Write a complete physics answer..."></textarea><div class="button-row"><button class="button primary" id="markExit">Auto-mark answer</button></div><div class="feedback hidden" id="exitFeedback"></div></div>`;
    $$('.reveal').forEach(b=>b.onclick=()=>{$(`#${b.dataset.r}`).classList.remove('hidden'); b.remove();});
    $('#completeLesson').onclick=()=>{state.complete=state.complete.includes(l.id)?state.complete.filter(x=>x!==l.id):[...state.complete,l.id];save();renderCourse();updateProgress();};
    $('#openLinkedSim').onclick=()=>{state.sim=l.sim;renderSimTabs();renderSimPanel();view('lab');};
    $$('.lesson-choice').forEach(b=>b.onclick=()=>{
      $$('.lesson-choice').forEach(x=>x.disabled=true);
      const idx=+b.dataset.choice, ok=idx===check[2];
      b.classList.add(ok?'correct':'wrong'); if(!ok) $$('.lesson-choice')[check[2]].classList.add('correct');
      const f=$('#lessonFeedback');f.className=`feedback ${ok?'good':'partial'}`;f.innerHTML=`<strong>${ok?'Correct':'Not quite'}.</strong> ${esc(check[3])}`;
    });
    $('#markExit').onclick=()=>markKeywordAnswer($('#exitAnswer').value,l.exitKeywords,$('#exitFeedback'));
  }
  function markKeywordAnswer(text,keywords,box){
    const norm=text.toLowerCase(); const hits=keywords.filter(k=>norm.includes(k.toLowerCase()));
    const ratio=hits.length/Math.max(1,keywords.length); const band=ratio>=.65?'good':ratio>=.3?'partial':'bad';
    box.className=`feedback ${band}`;
    box.innerHTML=`<strong>Indicative coverage: ${Math.round(ratio*100)}%</strong><br>${hits.length?`Detected: ${hits.map(esc).join(', ')}.`:'No key physics points detected yet.'}<br><span class="muted small">This is a formative keyword check, not an official exam mark.</span>`;
  }

  function renderTextbook(){
    const list=$('#textbookList');list.innerHTML='';
    D.textbook.forEach(ch=>{const b=document.createElement('button');b.className=`chapter-button ${state.chapter===ch.id?'active':''}`;b.textContent=ch.title;b.onclick=()=>{state.chapter=ch.id;renderTextbook();};list.appendChild(b);});
    const ch=D.textbook.find(c=>c.id===state.chapter)||D.textbook[0]; $('#textbookArticle').innerHTML=ch.html; bindEquationLinks();
  }
  function bindEquationLinks(){
    $$('.equation-link').forEach(b=>b.onclick=()=>openEquation(b.dataset.equation));
  }
  function openEquation(id){
    const e=D.equations[id]; if(!e)return;
    $('#equationModalTitle').textContent=e.title;
    $('#equationModalBody').innerHTML=`<p>${esc(e.meaning)}</p><h3>Symbols</h3><ul>${e.symbols.map(s=>`<li>${esc(s)}</li>`).join('')}</ul><h3>When to use it</h3><p>${esc(e.use)}</p><h3>Exam trap</h3><div class="feedback partial">${esc(e.trap)}</div>`;
    $('#equationModal').classList.remove('hidden');
  }
  $('#closeEquation').onclick=()=>$('#equationModal').classList.add('hidden');
  $('#equationModal').addEventListener('click',e=>{if(e.target.id==='equationModal')e.currentTarget.classList.add('hidden');});

  function currentSim(){return D.sims.find(s=>s.id===state.sim)||D.sims[0];}
  function renderSimTabs(){const el=$('#simTabs');el.innerHTML='';D.sims.forEach(s=>{const b=document.createElement('button');b.className=`sim-tab ${s.id===state.sim?'active':''}`;b.textContent=s.title;b.onclick=()=>{state.sim=s.id;state.snapshots=[];renderSimTabs();renderSimPanel();};el.appendChild(b);});}
  function initSimValues(s){ if(!state.simValues[s.id]) state.simValues[s.id]=Object.fromEntries(s.controls.map(c=>[c.key,c.value])); }
  function renderSimPanel(){
    const s=currentSim();initSimValues(s);const v=state.simValues[s.id];
    $('#simCode').textContent=s.code;$('#simTitle').textContent=s.title;$('#simSubtitle').textContent=s.subtitle;$('#missionGoal').textContent=s.mission.goal;$('#missionSteps').innerHTML=s.mission.steps.map(x=>`<li>${esc(x)}</li>`).join('');$('#missionConclusion').textContent=s.mission.conclusion;$('#simpleExplain').textContent=s.simple;$('#examExplain').textContent=s.exam;$('#mistakeExplain').textContent=s.mistake;
    const controls=$('#simControls');controls.innerHTML='';
    s.controls.forEach(c=>{
      const lab=document.createElement('label');lab.className='field';
      if(c.type==='select'){
        lab.innerHTML=`<span>${esc(c.label)}</span><select data-key="${c.key}">${c.options.map(o=>`<option ${v[c.key]===o?'selected':''}>${esc(o)}</option>`).join('')}</select>`;
        $('select',lab).onchange=e=>{v[c.key]=e.target.value;drawSim();};
      }else{
        lab.innerHTML=`<span>${esc(c.label)}</span><input type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${v[c.key]}" data-key="${c.key}"><output>${format(v[c.key])} ${esc(c.unit)}</output>`;
        const inp=$('input',lab),out=$('output',lab);inp.oninput=e=>{v[c.key]=+e.target.value;out.textContent=`${format(v[c.key])} ${c.unit}`;drawSim();};
      } controls.appendChild(lab);
    });
    renderSnapshots(); requestAnimationFrame(drawSim);
  }
  function format(x){ if(typeof x==='string')return x; if(Math.abs(x)>=1000||Math.abs(x)<.001&&x!==0)return Number(x).toExponential(2); return Number(x).toFixed(Math.abs(x)<1?3:2).replace(/\.00$/,''); }
  function sizeCanvas(canvas){const dpr=Math.min(devicePixelRatio||1,2),r=canvas.getBoundingClientRect();canvas.width=Math.max(320,Math.floor(r.width*dpr));canvas.height=Math.max(300,Math.floor(r.height*dpr));const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);return [ctx,r.width,r.height];}
  function axes(ctx,w,h,xlab,ylab){ctx.strokeStyle='#567087';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(55,h-45);ctx.lineTo(w-25,h-45);ctx.moveTo(55,h-45);ctx.lineTo(55,35);ctx.stroke();ctx.fillStyle='#9fb4c6';ctx.font='12px system-ui';ctx.fillText(xlab,w/2,h-12);ctx.save();ctx.translate(16,h/2);ctx.rotate(-Math.PI/2);ctx.fillText(ylab,0,0);ctx.restore();}
  function drawSim(){
    const canvas=$('#simCanvas'); if(!canvas || $('#view-lab').classList.contains('active-view')===false)return;
    const [ctx,w,h]=sizeCanvas(canvas),s=currentSim(),v=state.simValues[s.id]||{};ctx.clearRect(0,0,w,h);ctx.fillStyle='#071522';ctx.fillRect(0,0,w,h);
    let read='';
    if(s.id==='density'){
      const volumeM3=v.volume*1e-6,rho=v.mass/volumeM3; const scale=Math.cbrt(v.volume/1000),bw=120*scale+55,bh=150*scale+45;
      ctx.fillStyle='#1e6f5a';ctx.strokeStyle='#78e0b7';ctx.lineWidth=2;ctx.fillRect(w*.27-bw/2,h*.52-bh/2,bw,bh);ctx.strokeRect(w*.27-bw/2,h*.52-bh/2,bw,bh);ctx.fillStyle='#e9f8ff';ctx.font='bold 20px system-ui';ctx.fillText(`${v.mass.toFixed(1)} kg`,w*.27-35,h*.52+5);
      ctx.font='14px system-ui';ctx.fillStyle='#aac0d3';ctx.fillText(`Volume ${v.volume.toFixed(0)} cm³`,w*.27-55,h*.52+30);axes(ctx,w,h,'volume','mass per volume');
      read=`ρ = m/V = ${rho.toExponential(3)} kg m⁻³`;
    } else if(s.id==='hooke'){
      const effective=v.force<=v.limit?v.force/v.k:(v.limit/v.k)+(v.force-v.limit)/v.k*1.9; const x=Math.min(effective,.14);
      drawSpring(ctx,w*.28,65,h*.62+x*650);ctx.fillStyle='#2c526e';ctx.fillRect(w*.28-46,h*.62+x*650,92,55);ctx.fillStyle='white';ctx.font='bold 16px system-ui';ctx.fillText(`${v.force.toFixed(1)} N`,w*.28-28,h*.62+x*650+33);
      axes(ctx,w,h,'extension / m','force / N');const gx=55,gy=h-45,gw=w-90,gh=h-90,maxX=.14,maxF=22;ctx.strokeStyle='#55d6aa';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=80;i++){const xx=maxX*i/80;const f=xx<=v.limit/v.k?v.k*xx:v.limit+(xx-v.limit/v.k)*v.k/1.9;const px=gx+xx/maxX*gw,py=gy-f/maxF*gh;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();read=`ΔL ≈ ${effective.toFixed(4)} m · F/ΔL ≈ ${(v.force/Math.max(effective,1e-9)).toFixed(0)} N m⁻¹`;
    } else if(s.id==='forceExtension'){
      const plastic=Math.max(0,(v.force-v.elastic)*.0025),elasticExt=Math.min(v.force,v.elastic)/220;const total=elasticExt+plastic;
      ctx.strokeStyle='#8edfc1';ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(w*.28,80);ctx.lineTo(w*.28,250+total*900);ctx.stroke();ctx.fillStyle='#33566f';ctx.fillRect(w*.28-50,250+total*900,100,60);ctx.fillStyle='white';ctx.font='bold 16px system-ui';ctx.fillText(`${v.force.toFixed(1)} N`,w*.28-28,286+total*900);
      axes(ctx,w,h,'extension','force');ctx.strokeStyle='#70aaff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(55,h-45);ctx.lineTo(190,h-170);ctx.bezierCurveTo(250,h-230,340,h-180,w-35,h-305);ctx.stroke();read=`Elastic extension ≈ ${(elasticExt*1000).toFixed(1)} mm · plastic component ≈ ${(plastic*1000).toFixed(1)} mm`;
    } else if(s.id==='energy'){
      const F=v.k*v.extension,E=.5*v.k*v.extension*v.extension;axes(ctx,w,h,'extension / m','force / N');const gx=55,gy=h-45,gw=w-90,gh=h-90,maxX=.2,maxF=500*.2;const px=gx+v.extension/maxX*gw,py=gy-F/maxF*gh;ctx.fillStyle='rgba(68,216,164,.23)';ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(px,gy);ctx.lineTo(px,py);ctx.closePath();ctx.fill();ctx.strokeStyle='#5cdbaa';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,gy);ctx.lineTo(gx+gw,gy-(v.k*maxX/maxF)*gh);ctx.stroke();ctx.fillStyle='#eaf6ff';ctx.font='bold 20px system-ui';ctx.fillText(`Area = ${E.toFixed(3)} J`,w*.55,75);read=`F = ${F.toFixed(2)} N · E = ½kx² = ${E.toFixed(4)} J`;
    } else if(s.id==='stressStrain'){
      const p={Steel:{E:200,breakS:720,breakE:.055,duct:.035},Copper:{E:120,breakS:350,breakE:.10,duct:.08},Glass:{E:70,breakS:90,breakE:.0013,duct:0},Polymer:{E:3,breakS:65,breakE:.12,duct:.10}}[v.material];axes(ctx,w,h,'strain','stress / MPa');const gx=55,gy=h-45,gw=w-90,gh=h-90,maxE=.12,maxS=800;ctx.strokeStyle='#6fdbb0';ctx.lineWidth=3;ctx.beginPath();let broke=false,stress=0;for(let i=0;i<=120;i++){let e=maxE*i/120;if(e>p.breakE){broke=true;break;}let st=Math.min(p.E*1000*e,p.breakS*(.72+.28*Math.min(1,e/Math.max(p.breakE,.001))));if(p.duct>0&&e>p.breakE-p.duct) st*=.92+.08*Math.sin((e/(p.breakE))*Math.PI);let px=gx+e/maxE*gw,py=gy-st/maxS*gh;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();stress=v.strain>p.breakE?0:Math.min(p.E*1000*v.strain,p.breakS*(.72+.28*Math.min(1,v.strain/Math.max(p.breakE,.001))));const pointX=gx+Math.min(v.strain,maxE)/maxE*gw,pointY=gy-stress/maxS*gh;ctx.fillStyle=v.strain>p.breakE?'#ff7d7d':'#ffd06f';ctx.beginPath();ctx.arc(pointX,pointY,6,0,Math.PI*2);ctx.fill();read=v.strain>p.breakE?`${v.material}: fractured before strain ${v.strain.toFixed(3)}`:`${v.material}: stress ≈ ${stress.toFixed(1)} MPa · initial E ≈ ${p.E} GPa`;
    } else if(s.id==='young'){
      const E=v.E*1e9,d=v.diameter*1e-3,A=Math.PI*d*d/4,x=v.force*v.length/(A*E);ctx.strokeStyle='#6ddbb0';ctx.lineWidth=Math.max(2,v.diameter*5);ctx.beginPath();ctx.moveTo(w*.27,60);ctx.lineTo(w*.27,250+Math.min(170,x*25000));ctx.stroke();ctx.fillStyle='#304e66';ctx.fillRect(w*.27-50,250+Math.min(170,x*25000),100,55);ctx.fillStyle='#dfefff';ctx.font='bold 15px system-ui';ctx.fillText(`${v.force} N`,w*.27-25,283+Math.min(170,x*25000));axes(ctx,w,h,'strain','stress');ctx.strokeStyle='#70aaff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(55,h-45);ctx.lineTo(w-35,55);ctx.stroke();read=`A = ${A.toExponential(2)} m² · ΔL = ${(x*1000).toFixed(3)} mm · E = ${v.E} GPa`;
    }
    $('#simReadout').textContent=read; $('#simState').textContent=read.split('·')[0].trim();
  }
  function drawSpring(ctx,x,y,end){ctx.strokeStyle='#7cb6ff';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(x,y);const n=14,amp=24,span=end-y;for(let i=1;i<=n;i++){ctx.lineTo(x+(i%2?amp:-amp),y+span*i/(n+1));}ctx.lineTo(x,end);ctx.stroke();ctx.strokeStyle='#7d93a8';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(x-70,y-4);ctx.lineTo(x+70,y-4);ctx.stroke();}
  function renderSnapshots(){const el=$('#snapshotTray');el.innerHTML=state.snapshots.map((s,i)=>`<span class="snapshot">${i+1}. ${esc(s)}</span>`).join('');}
  $('#resetSim').onclick=()=>{delete state.simValues[state.sim];state.snapshots=[];renderSimPanel();};
  $('#snapshotSim').onclick=()=>{state.snapshots.push($('#simReadout').textContent);state.snapshots=state.snapshots.slice(-8);renderSnapshots();};
  $('#predictPrompt').onclick=()=>{const s=currentSim();alert(`Prediction: ${s.mission.steps[0]}\n\nWrite down what you think will happen before changing the control.`);};
  window.addEventListener('resize',()=>{drawSim();drawRpGraph();});

  function renderFormula(){
    const sel=$('#formulaSelect');sel.innerHTML=D.formulas.map(f=>`<option value="${f.id}">${esc(f.name)} · ${esc(f.equation)}</option>`).join('');
    sel.onchange=renderFormulaInputs;renderFormulaInputs();
    $('#formulaCards').innerHTML=D.formulas.map(f=>`<div class="formula-card"><span class="eyebrow">${esc(f.name)}</span><br><strong>${esc(f.equation)}</strong></div>`).join('');
  }
  function renderFormulaInputs(){const f=D.formulas.find(x=>x.id===$('#formulaSelect').value)||D.formulas[0],box=$('#formulaInputs');box.innerHTML='';f.inputs.forEach(([key,label,unit])=>{const lab=document.createElement('label');lab.className='field';lab.innerHTML=`<span>${esc(label)} (${esc(unit)})</span><input type="number" step="any" data-key="${key}" placeholder="Enter value">`;box.appendChild(lab);});const btn=document.createElement('button');btn.className='button primary';btn.textContent='Calculate';btn.onclick=()=>{const vals={};let valid=true;$$('input',box).forEach(inp=>{vals[inp.dataset.key]=+inp.value;if(!Number.isFinite(vals[inp.dataset.key]))valid=false;});if(!valid){$('#formulaWorking').innerHTML='<div class="feedback bad">Enter a number for every quantity.</div>';return;}let lines;try{lines=f.working(vals)}catch{lines=['Check that no denominator is zero.'];}$('#formulaWorking').innerHTML=`<div class="equation">${esc(f.equation)}</div><ol>${lines.map(x=>`<li>${esc(x)}</li>`).join('')}</ol>`;};box.appendChild(btn);$('#formulaWorking').innerHTML='<p class="muted">Enter the known values, keeping units in SI unless stated.</p>';}

  const RP_Y=200e9;
  function rpControls(){const L=+$('#rpLength').value,d=+$('#rpDiameter').value,m=+$('#rpMass').value;$('#rpLengthOut').textContent=`${L.toFixed(1)} m`;$('#rpDiameterOut').textContent=`${d.toFixed(2)} mm`;$('#rpMassOut').textContent=`${m.toFixed(1)} kg`;const A=Math.PI*(d*1e-3)**2/4,F=m*9.81,x=F*L/(A*RP_Y);$('#rpMarker').style.top=`${190+Math.min(65,x*100000)}px`;$('#rpMassPan').style.top=`${230+Math.min(65,x*100000)}px`;$('#rpMassPan').textContent=`${m.toFixed(1)} kg`;}
  ['rpLength','rpDiameter','rpMass'].forEach(id=>$(`#${id}`).addEventListener('input',rpControls));
  $('#takeRpReading').onclick=()=>{const L=+$('#rpLength').value,d=+$('#rpDiameter').value,m=+$('#rpMass').value,A=Math.PI*(d*1e-3)**2/4,F=m*9.81,ideal=F*L/(A*RP_Y),noise=ideal*(Math.random()-.5)*.025,x=Math.max(0,ideal+noise),stress=F/A,strain=x/L;state.rpRows.push({m,F,x,stress,strain});renderRp();};
  $('#clearRpData').onclick=()=>{state.rpRows=[];renderRp();};
  $('#downloadRpCsv').onclick=()=>{
    if(!state.rpRows.length){alert('Collect at least one reading first.');return;}
    const rows=['mass_kg,force_N,extension_mm,stress_MPa,strain',...state.rpRows.map(r=>[r.m.toFixed(2),r.F.toFixed(4),(r.x*1000).toFixed(6),(r.stress/1e6).toFixed(6),r.strain.toExponential(8)].join(','))];
    downloadText('required-practical-4-young-modulus.csv',rows.join('\n'),'text/csv');
  };
  function renderRp(){const rows=$('#rpRows');rows.innerHTML=state.rpRows.map(r=>`<tr><td>${r.m.toFixed(1)}</td><td>${r.F.toFixed(2)}</td><td>${(r.x*1000).toFixed(3)}</td><td>${(r.stress/1e6).toFixed(1)}</td><td>${r.strain.toExponential(3)}</td></tr>`).join('');if(state.rpRows.length>=2){const slope=regression(state.rpRows.map(r=>[r.strain,r.stress])).m;$('#rpSummary').textContent=`Best-fit Young modulus ≈ ${(slope/1e9).toFixed(1)} GPa (${slope.toExponential(3)} Pa). Model value: 200 GPa.`;}else $('#rpSummary').textContent='Collect at least four loads.';requestAnimationFrame(drawRpGraph);}
  function regression(points){const n=points.length,sx=points.reduce((a,p)=>a+p[0],0),sy=points.reduce((a,p)=>a+p[1],0),sxx=points.reduce((a,p)=>a+p[0]*p[0],0),sxy=points.reduce((a,p)=>a+p[0]*p[1],0),den=n*sxx-sx*sx;return {m:den?(n*sxy-sx*sy)/den:0,b:den?(sy*sxx-sx*sxy)/den:0};}
  function drawRpGraph(){const c=$('#rpGraph');if(!c||$('#view-practical').classList.contains('active-view')===false)return;const [ctx,w,h]=sizeCanvas(c);ctx.clearRect(0,0,w,h);ctx.fillStyle='#071522';ctx.fillRect(0,0,w,h);axes(ctx,w,h,'strain','stress / MPa');if(!state.rpRows.length)return;const maxX=Math.max(...state.rpRows.map(r=>r.strain))*1.12,maxY=Math.max(...state.rpRows.map(r=>r.stress/1e6))*1.12,gx=55,gy=h-45,gw=w-90,gh=h-90;ctx.fillStyle='#ffd06f';state.rpRows.forEach(r=>{const x=gx+r.strain/maxX*gw,y=gy-(r.stress/1e6)/maxY*gh;ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();});if(state.rpRows.length>=2){const fit=regression(state.rpRows.map(r=>[r.strain,r.stress/1e6]));ctx.strokeStyle='#5edca9';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(gx,gy-fit.b/maxY*gh);ctx.lineTo(gx+gw,gy-(fit.m*maxX+fit.b)/maxY*gh);ctx.stroke();}}

  function renderQuiz(){const q=D.quiz[state.quizIndex];$('#quizProgress').textContent=`${state.quizIndex+1} / ${D.quiz.length}`;$('#quizProgressFill').style.width=`${(state.quizIndex+1)/D.quiz.length*100}%`;$('#quizScore').textContent=state.quizScore;$('#quizStreak').textContent=state.quizStreak;$('#quizSpec').textContent=q[0];$('#quizQuestion').textContent=q[1];$('#quizChoices').innerHTML=q[2].map((c,i)=>`<button class="choice" data-qchoice="${i}">${esc(c)}</button>`).join('');$('#quizFeedback').className='feedback hidden';$('#nextQuestion').classList.add('hidden');state.quizLocked=false;$$('[data-qchoice]').forEach(b=>b.onclick=()=>answerQuiz(+b.dataset.qchoice));}
  function answerQuiz(idx){if(state.quizLocked)return;state.quizLocked=true;const q=D.quiz[state.quizIndex],ok=idx===q[3];$$('[data-qchoice]').forEach((b,i)=>{b.disabled=true;if(i===q[3])b.classList.add('correct');if(i===idx&&!ok)b.classList.add('wrong');});if(ok){state.quizScore++;state.quizStreak++;}else state.quizStreak=0;$('#quizScore').textContent=state.quizScore;$('#quizStreak').textContent=state.quizStreak;const f=$('#quizFeedback');f.className=`feedback ${ok?'good':'partial'}`;f.innerHTML=`<strong>${ok?'Correct':'Not quite'}.</strong> ${esc(q[4])}`;$('#nextQuestion').classList.remove('hidden');}
  $('#nextQuestion').onclick=()=>{state.quizIndex=(state.quizIndex+1)%D.quiz.length;renderQuiz();};
  $('#restartQuiz').onclick=()=>{state.quizIndex=state.quizScore=state.quizStreak=0;renderQuiz();};

  function renderExtended(){const list=$('#extendedList');list.innerHTML='<span class="eyebrow">Question bank</span><h3>Choose a response</h3>';D.extended.forEach((q,i)=>{const b=document.createElement('button');b.className=`extended-button ${state.extended===i?'active':''}`;b.innerHTML=`<strong>${esc(q.title)}</strong><br><span class="muted small">${q.marks} marks</span>`;b.onclick=()=>{state.extended=i;renderExtended();};list.appendChild(b);});const q=D.extended[state.extended];$('#extendedMarks').textContent=`${q.marks} marks · AQA-style practice`;$('#extendedQuestion').textContent=q.q;$('#extendedAnswer').value='';$('#extendedFeedback').className='feedback hidden';}
  $('#markExtended').onclick=()=>{const q=D.extended[state.extended],text=$('#extendedAnswer').value.toLowerCase();let hit=[];q.points.forEach(([k,desc])=>{if(text.includes(k.toLowerCase()))hit.push(desc);});const score=Math.min(q.marks,hit.length),box=$('#extendedFeedback');box.className=`feedback ${score/q.marks>=.67?'good':score/q.marks>=.34?'partial':'bad'}`;box.innerHTML=`<strong>Indicative score: ${score}/${q.marks}</strong><p>${hit.length?'Detected creditworthy ideas:':''}</p>${hit.length?`<ul>${hit.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}<p><strong>For a stronger answer, check for:</strong></p><ul>${q.points.filter(([k])=>!text.includes(k.toLowerCase())).slice(0,Math.max(1,q.marks-score)).map(p=>`<li>${esc(p[1])}</li>`).join('')}</ul><span class="muted small">Formative auto-mark only; wording can earn credit even when this simple checker misses it.</span>`;};
  $('#clearExtended').onclick=()=>{$('#extendedAnswer').value='';$('#extendedFeedback').className='feedback hidden';};

  function renderSpec(){ $('#specGrid').innerHTML=D.spec.map(s=>`<article class="spec-card"><span class="eyebrow">${esc(s.code)}</span><h3>${esc(s.title)}</h3>${s.items.map(x=>`<div class="checkline">${esc(x)}</div>`).join('')}</article>`).join(''); }

  renderCourse();updateProgress();renderTextbook();renderSimTabs();renderSimPanel();renderFormula();rpControls();renderRp();renderQuiz();renderExtended();renderSpec();
})();
