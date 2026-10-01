(() => {
  'use strict';
  const D = window.FIELD_LAB;
  if (!D) return;
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmt = n => !Number.isFinite(n) ? '—' : ((Math.abs(n)>0 && Math.abs(n)<1e-3)||Math.abs(n)>=1e5 ? n.toExponential(3) : Number(n.toFixed(3)).toString());

  const key='aqa-fields-progress';
  let done=new Set(JSON.parse(localStorage.getItem(key)||'[]'));
  let lesson=D.lessons[0].id, filter='all', sim='fieldCompare', vals={}, t=0, playing=true;

  function show(view){
    $$('.view').forEach(v=>v.classList.remove('active-view'));
    $('#view-'+view)?.classList.add('active-view');
    $$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    if(view==='lab') requestAnimationFrame(resize);
  }
  $$('.nav-button').forEach(b=>b.addEventListener('click',()=>show(b.dataset.view)));
  $$('[data-jump]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.jump)));

  function progress(){
    $('#progressText').textContent=done.size+' / '+D.lessons.length+' complete';
    $('#progressFill').style.width=(100*done.size/D.lessons.length)+'%';
    localStorage.setItem(key,JSON.stringify([...done]));
  }
  $('#resetProgress').addEventListener('click',()=>{done.clear();progress();renderCourse();renderLesson(lesson);});

  function renderCourse(){
    const h=$('#courseList'); h.innerHTML='';
    D.lessons.filter(x=>filter==='all'||x.topic===filter).forEach(x=>{
      const b=document.createElement('button');
      b.className='lesson-card panel'+(x.id===lesson?' active':'')+(done.has(x.id)?' complete':'');
      b.innerHTML='<div class="lesson-card-row"><div><div class="lesson-code">'+esc(x.code)+'</div><div class="lesson-title">'+esc(x.title)+'</div></div><span class="lesson-status">'+(done.has(x.id)?'✓ complete':'lesson '+(D.lessons.indexOf(x)+1))+'</span></div><p class="muted small">'+esc(x.lead)+'</p>';
      b.addEventListener('click',()=>{lesson=x.id;renderCourse();renderLesson(x.id);});
      h.appendChild(b);
    });
  }
  function renderLesson(id){
    const x=D.lessons.find(l=>l.id===id)||D.lessons[0]; lesson=x.id;
    const topicFormulas=D.formulas.filter(f=>f.topic===x.topic).slice(0,6);
    const chunkNames=['Retrieval','Objectives','Textbook chapter','Equations','Maths & graphs','Worked','Calculation practice','Activity','Simulation','Exam mastery','Check','Exit'];
    const retrieval=x.retrieval.map((a,i)=>'<div class="mini-question"><p><strong>'+(i+1)+'. '+esc(a[0])+'</strong></p><textarea class="student-answer" placeholder="Type your answer here..."></textarea><button class="text-button" data-reveal>Reveal answer</button><div class="answer-reveal">'+esc(a[1])+'</div></div>').join('');
    const teaching=x.teach.map((a,i)=>'<article class="chapter-section"><span class="chapter-number">'+String(i+1).padStart(2,'0')+'</span><div><h3>'+esc(a[0])+'</h3><p>'+esc(a[1])+'</p></div></article>').join('');
    const formulaCards=topicFormulas.map((f,i)=>'<article class="equation-card"><div class="equation-card-head"><span class="data-badge">Equation '+(i+1)+'</span><span class="equation-source">AQA 3.7</span></div><h3>'+esc(f.name)+'</h3><div class="big-equation">'+esc(f.eq)+'</div><p>Use this relationship when the stated physical conditions match the model. Keep values in SI units unless the question explicitly permits otherwise.</p></article>').join('');
    const maths=[
      'Convert prefixes and standard form before substitution.',
      'Rearrange symbolically before inserting numbers.',
      'Use gradients and areas to connect field strength and potential where required.',
      'Recognise inverse-square, inverse, exponential, cosine and sinusoidal relationships.',
      'State final answers with appropriate units and sensible significant figures.'
    ].map(a=>'<li>'+a+'</li>').join('');
    const graphs=[
      x.topic==='gravity'?'Interpret g–r and V–r graphs and link potential change to area under a field-strength graph.':'',
      x.topic==='electric'?'Interpret E–r and V–r graphs and distinguish vector field strength from scalar potential.':'',
      x.topic==='capacitance'?'Interpret Q/V, exponential charge/discharge and log-linear capacitor plots.':'',
      x.topic==='magnetic'?'Interpret flux-linkage/angle, induced-emf/time and sinusoidal AC waveforms.':'',
      x.topic==='fields'?'Compare vector field-line patterns and inverse-square behaviour.':''
    ].filter(Boolean).map(a=>'<li>'+a+'</li>').join('');
    const calcPractice=topicFormulas.slice(0,3).map((f,i)=>'<div class="calc-practice"><div class="calc-q"><span class="data-badge">Practice '+(i+1)+'</span><p><strong>Write down '+esc(f.eq)+' from memory, identify every symbol and state the conditions in which it is valid.</strong></p><textarea class="student-answer compact-answer" placeholder="Equation, symbols, units and conditions..."></textarea><button class="text-button" data-formula-reveal="'+i+'">Show equation</button></div><div class="calc-solution" data-formula-solution="'+i+'"><div class="calc-final">'+esc(f.name)+': '+esc(f.eq)+'</div></div></div>').join('');
    const mastery=x.objectives.concat([
      'Use the relevant equation without being prompted by name.',
      'Explain the physics in a linked chain using precise field terminology.',
      'Interpret an unfamiliar graph or data set from this specification area.'
    ]).map(a=>'<li>'+esc(a)+'</li>').join('');
    $('#lessonPanel').innerHTML=
      '<div class="lesson-meta"><span class="eyebrow">AQA '+esc(x.code)+'</span><span class="data-badge">Paper 2</span></div>'+
      '<h2>'+esc(x.title)+'</h2><p class="lesson-lead">'+esc(x.lead)+'</p>'+
      '<div class="keyword-row">'+x.keywords.map(k=>'<span class="keyword-chip">'+esc(k)+'</span>').join('')+'</div>'+
      '<div class="formula-row">'+x.formulas.map(a=>'<span class="formula-chip">'+esc(a)+'</span>').join('')+'</div>'+
      '<div class="chunk-strip">'+chunkNames.map((n,i)=>'<button class="chunk-button '+(i===0?'active':'')+'" data-chunk-button="'+i+'">'+n+'</button>').join('')+'</div>'+
      '<section class="chunk active" data-chunk="0"><div class="lesson-block"><h3>Retrieval starter</h3>'+retrieval+'</div></section>'+
      '<section class="chunk" data-chunk="1"><div class="lesson-grid"><div class="lesson-block remember"><h3>Learning objectives</h3><ul>'+x.objectives.map(a=>'<li>'+esc(a)+'</li>').join('')+'</ul></div><div class="lesson-block warning"><h3>Common misconception</h3><p>'+esc(x.misconception)+'</p></div></div></section>'+
      '<section class="chunk" data-chunk="2"><article class="textbook-hook"><span class="eyebrow">Why this matters</span><p>'+esc(x.lead)+'</p><div class="hook-question"><strong>Think first:</strong> '+esc(x.exit)+'</div></article><div class="chapter-body">'+teaching+'</div><div class="chapter-two-col"><aside class="chapter-key"><span class="eyebrow">Key ideas</span><ul>'+x.objectives.map(a=>'<li>'+esc(a)+'</li>').join('')+'</ul></aside><aside class="chapter-exam"><span class="eyebrow">AQA exam focus</span><p>'+esc(x.examTip)+'</p></aside></div><div class="chapter-summary"><h3>In short</h3><ul>'+x.teach.map(a=>'<li><strong>'+esc(a[0])+':</strong> '+esc(a[1])+'</li>').join('')+'</ul></div></section>'+
      '<section class="chunk" data-chunk="3"><div class="equation-intro"><h3>Equation and calculation guide</h3><p>Know what each equation means, what each symbol represents, the units and the conditions under which it is valid.</p></div><div class="equation-card-grid">'+formulaCards+'</div><button class="button primary" id="openFormulaCoach">Open Formula Coach</button></section>'+
      '<section class="chunk" data-chunk="4"><div class="lesson-grid"><div class="lesson-block maths-block"><h3>Maths you must be able to do</h3><ul>'+maths+'</ul></div><div class="lesson-block graph-block"><h3>Graphs and data interpretation</h3><ul>'+graphs+'</ul></div></div></section>'+
      '<section class="chunk" data-chunk="5"><div class="lesson-block worked-block"><h3>Core worked example</h3><p><strong>'+esc(x.worked.q)+'</strong></p><ol>'+x.worked.steps.map(a=>'<li>'+esc(a)+'</li>').join('')+'</ol></div></section>'+
      '<section class="chunk" data-chunk="6"><div class="lesson-block"><h3>Calculation practice</h3><p class="muted">Attempt each item from memory before revealing the relationship. Then use the Formula Coach for numerical practice.</p>'+calcPractice+'</div></section>'+
      '<section class="chunk" data-chunk="7"><div class="lesson-block"><h3>Student activity</h3><p>'+esc(x.activity)+'</p><textarea class="student-answer" placeholder="Write your working, explanation or graph reasoning here..."></textarea></div></section>'+
      '<section class="chunk" data-chunk="8"><div class="lesson-block mission-inline"><span class="eyebrow">Linked simulation mission</span><h3>'+esc(x.mission.goal)+'</h3><ol>'+x.mission.steps.map(a=>'<li>'+esc(a)+'</li>').join('')+'</ol><p><strong>Record:</strong> '+esc(x.mission.record)+'</p><p><strong>Conclude:</strong> '+esc(x.mission.conclusion)+'</p><button class="button primary" id="lessonSim">Open linked simulation</button></div></section>'+
      '<section class="chunk" data-chunk="9"><div class="lesson-grid"><div class="lesson-block remember"><h3>By the end, you must be able to…</h3><ul class="mastery-list">'+mastery+'</ul></div><div class="lesson-block exam-box"><h3>Exam language</h3><p>'+esc(x.examTip)+'</p><p><strong>Avoid:</strong> '+esc(x.misconception)+'</p></div></div><div class="self-check"><label><input type="checkbox"> I can define the key quantities accurately.</label><label><input type="checkbox"> I can select and use the equations with correct units.</label><label><input type="checkbox"> I can interpret the key graph/data relationship.</label><label><input type="checkbox"> I can explain the physics in full A-level sentences.</label></div></section>'+
      '<section class="chunk" data-chunk="10"><div class="mini-question"><p><strong>'+esc(x.check[0])+'</strong></p><div class="mini-options">'+x.check[1].map((a,i)=>'<button class="mini-option" data-answer="'+i+'">'+esc(a)+'</button>').join('')+'</div><div class="answer-reveal" id="checkResult">'+esc(x.check[3])+'</div></div></section>'+
      '<section class="chunk" data-chunk="11"><div class="lesson-block remember"><h3>Exit ticket</h3><p>'+esc(x.exit)+'</p><textarea class="student-answer" placeholder="Write a complete A-level answer..."></textarea></div></section>'+
      '<div class="lesson-actions"><button class="button primary" id="complete">'+(done.has(x.id)?'✓ Lesson complete':'Mark lesson complete')+'</button><button class="button" id="prev">Previous</button><button class="button" id="next">Next lesson</button></div>';
    $$('[data-chunk-button]',$('#lessonPanel')).forEach(b=>b.addEventListener('click',()=>{
      $$('[data-chunk-button]',$('#lessonPanel')).forEach(q=>q.classList.toggle('active',q===b));
      $$('[data-chunk]',$('#lessonPanel')).forEach(q=>q.classList.toggle('active',q.dataset.chunk===b.dataset.chunkButton));
    }));
    $$('[data-reveal]',$('#lessonPanel')).forEach(b=>b.addEventListener('click',()=>b.nextElementSibling.classList.toggle('visible')));
    $$('[data-formula-reveal]',$('#lessonPanel')).forEach(b=>b.addEventListener('click',()=>{
      const sol=$('[data-formula-solution="'+b.dataset.formulaReveal+'"]',$('#lessonPanel'));
      sol.classList.toggle('visible');
      b.textContent=sol.classList.contains('visible')?'Hide equation':'Show equation';
    }));
    $$('[data-answer]',$('#lessonPanel')).forEach(b=>b.addEventListener('click',()=>{
      const options=$$('[data-answer]',$('#lessonPanel')); options.forEach(q=>q.disabled=true);
      const chosen=Number(b.dataset.answer), correct=x.check[2];
      b.classList.add(chosen===correct?'correct':'wrong');
      if(options[correct]) options[correct].classList.add('correct');
      $('#checkResult').classList.add('visible');
    }));
    $('#lessonSim').addEventListener('click',()=>{setSim(x.sim);show('lab');});
    $('#openFormulaCoach').addEventListener('click',()=>{const map={gravity:'gravity',electric:'electric',capacitance:'capacitance',magnetic:'magnetic'};$('#formulaTopic').value=map[x.topic]||'all';renderFormulaMenu();show('formula');});
    $('#complete').addEventListener('click',()=>{done.has(x.id)?done.delete(x.id):done.add(x.id);progress();renderCourse();renderLesson(x.id);});
    $('#prev').addEventListener('click',()=>{const i=D.lessons.findIndex(l=>l.id===x.id);const n=D.lessons[(i-1+D.lessons.length)%D.lessons.length];lesson=n.id;renderCourse();renderLesson(n.id);});
    $('#next').addEventListener('click',()=>{const i=D.lessons.findIndex(l=>l.id===x.id);const n=D.lessons[(i+1)%D.lessons.length];lesson=n.id;renderCourse();renderLesson(n.id);});
  }
  $$('[data-course-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.courseFilter;$$('[data-course-filter]').forEach(q=>q.classList.toggle('primary',q===b));const f=D.lessons.find(x=>filter==='all'||x.topic===filter);if(f)lesson=f.id;renderCourse();renderLesson(lesson);}));

  const canvas=$('#simCanvas'), ctx=canvas.getContext('2d'); let W=900,H=520,DPR=1;
  function resize(){const r=canvas.getBoundingClientRect();DPR=Math.max(1,Math.min(2,devicePixelRatio||1));W=Math.max(320,r.width);H=Math.max(300,r.height);canvas.width=W*DPR;canvas.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0);draw();}
  addEventListener('resize',resize);
  function line(x1,y1,x2,y2,c='#67c7ff',w=2){ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function circle(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
  function label(s,x,y,c='#dceaff'){ctx.fillStyle=c;ctx.font='13px system-ui';ctx.fillText(s,x,y);}
  function arrow(x1,y1,x2,y2,c='#72e0a3'){line(x1,y1,x2,y2,c,2);const a=Math.atan2(y2-y1,x2-x1);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-9*Math.cos(a-.5),y2-9*Math.sin(a-.5));ctx.lineTo(x2-9*Math.cos(a+.5),y2-9*Math.sin(a+.5));ctx.closePath();ctx.fill();}
  function background(){const g=ctx.createRadialGradient(W*.5,H*.3,10,W*.5,H*.5,Math.max(W,H));g.addColorStop(0,'#102a45');g.addColorStop(1,'#04101b');ctx.fillStyle=g;ctx.fillRect(0,0,W,H);}
  function radial(cx,cy,out=true){for(let i=0;i<14;i++){const a=i*Math.PI*2/14,x1=cx+Math.cos(a)*30,y1=cy+Math.sin(a)*30,x2=cx+Math.cos(a)*Math.min(W,H)*.34,y2=cy+Math.sin(a)*Math.min(W,H)*.34;out?arrow(x1,y1,x2,y2,'rgba(103,199,255,.6)'):arrow(x2,y2,x1,y1,'rgba(103,199,255,.6)');}}
  function readout(){const v=vals;switch(sim){case'fieldCompare':return'Relative field = '+fmt(v.source/v.distance**2);case'gravity':{const M=v.mass*1e24,r=v.radius*1e6;return'g = '+fmt(D.G*M/r**2)+' N kg⁻¹ · V = '+fmt(-D.G*M/r)+' J kg⁻¹';}case'orbit':{const M=v.mass*1e24,r=v.radius*1e6;return'v = '+fmt(Math.sqrt(D.G*M/r))+' m s⁻¹ · T = '+fmt(2*Math.PI*Math.sqrt(r**3/(D.G*M)))+' s';}case'electric':{const Q=v.charge*1e-9;return'E = '+fmt(D.k*Q/v.distance**2)+' N C⁻¹ · V = '+fmt(D.k*Q/v.distance)+' V';}case'capacitor':{const C=D.e0*v.er*v.area/v.gap;return'C = '+fmt(C)+' F · Q = '+fmt(C*v.voltage)+' C';}case'discharge':{const tau=v.R*v.C*1e-6;return'τ = '+fmt(tau)+' s · V(t) = '+fmt(v.V0*Math.exp(-t/tau))+' V';}case'magWire':return'F = '+fmt(v.B*v.I*v.L)+' N';case'particle':return'r ≈ '+fmt(1.67e-27*v.speed*1e6/(v.B*1.6e-19))+' m';case'flux':return'NΦ = '+fmt(v.B*.01*v.N*Math.cos(v.angle*Math.PI/180))+' Wb turn';case'induction':{const w=2*Math.PI*v.f;return'εpeak = '+fmt(v.B*.01*v.N*w)+' V';}case'ac':return'Vrms = '+fmt(v.peak/Math.sqrt(2))+' V · T = '+fmt(1/v.f)+' s';case'transformer':return'Vs = '+fmt(v.Vp*v.Ns/v.Np)+' V';default:return'';}}
  function draw(){background();const x=W/2,y=H/2,v=vals;switch(sim){
    case'fieldCompare':circle(x,y,26,'#f2c14e');radial(x,y,true);circle(x+120*v.distance/2,y,8,'#72e0a3');break;
    case'gravity':circle(x,y,55,'#2d6a9f');radial(x,y,false);circle(x+150,y,8,'#fff');arrow(x+150,y,x+90,y);break;
    case'orbit':{circle(x,y,45,'#2d6a9f');const r=Math.min(W,H)*.32;ctx.strokeStyle='rgba(103,199,255,.5)';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();const a=t*.7;circle(x+r*Math.cos(a),y+r*Math.sin(a),8,'#fff');break;}
    case'electric':{const pos=v.charge>=0;circle(x*.65,y,28,pos?'#ff9b9b':'#86b7ff');radial(x*.65,y,pos);ctx.fillStyle='#ff9b9b';ctx.fillRect(W*.65-100,y-105,200,9);ctx.fillStyle='#86b7ff';ctx.fillRect(W*.65-100,y+105,200,9);for(let q=W*.65-80;q<W*.65+90;q+=35)arrow(q,y-90,q,y+90,'rgba(103,199,255,.65)');break;}
    case'capacitor':{const g=50+v.gap/.005*80;ctx.fillStyle='#d8e4ee';ctx.fillRect(x-g/2-7,y-120,14,240);ctx.fillRect(x+g/2-7,y-120,14,240);ctx.fillStyle='rgba(242,193,78,.25)';ctx.fillRect(x-g/2+7,y-120,g-14,240);for(let q=y-90;q<=y+90;q+=30)arrow(x-g/2+18,q,x+g/2-18,q,'rgba(103,199,255,.65)');break;}
    case'discharge':{const x0=60,y0=45,w=W-110,h=H-95;line(x0,y0+h,x0+w,y0+h,'#8ea7bd');line(x0,y0,x0,y0+h,'#8ea7bd');ctx.strokeStyle='#67c7ff';ctx.beginPath();for(let i=0;i<=150;i++){const u=i/150,px=x0+u*w,py=y0+h-Math.exp(-u*5)*h;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();label('exponential discharge',x0+15,y0+20);break;}
    case'magWire':for(let q=70;q<W-60;q+=45)for(let z=60;z<H-50;z+=45)label('×',q,z,'rgba(103,199,255,.5)');line(x-150,y,x+150,y,'#f2c14e',8);arrow(x,y,x,y-Math.sign(v.I||1)*110);break;
    case'particle':{for(let q=60;q<W-40;q+=50)for(let z=55;z<H-45;z+=50)label('×',q,z,'rgba(103,199,255,.3)');const r=Math.min(W,H)*.3,a=t*v.chargeSign;ctx.strokeStyle='rgba(242,193,78,.6)';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();circle(x+r*Math.cos(a),y+r*Math.sin(a),8,v.chargeSign>0?'#ff9b9b':'#86b7ff');break;}
    case'flux':{for(let q=70;q<W-60;q+=55)arrow(q,70,q,H-70,'rgba(103,199,255,.4)');ctx.save();ctx.translate(x,y);ctx.rotate(v.angle*Math.PI/900);ctx.strokeStyle='#f2c14e';ctx.lineWidth=6;ctx.strokeRect(-110,-75,220,150);ctx.restore();label('θ = '+v.angle+'°',x-30,y+130);break;}
    case'induction':{for(let q=70;q<W*.52;q+=55)arrow(q,70,q,H-70,'rgba(103,199,255,.4)');ctx.save();ctx.translate(W*.32,y);ctx.rotate(2*Math.PI*v.f*t);ctx.strokeStyle='#f2c14e';ctx.lineWidth=6;ctx.strokeRect(-85,-55,170,110);ctx.restore();label('rotating coil',W*.25,y+95);break;}
    case'ac':{const x0=55,y0=45,w=W-100,h=H-90;for(let i=0;i<=8;i++)line(x0,y0+i*h/8,x0+w,y0+i*h/8,'rgba(255,255,255,.1)',1);ctx.strokeStyle='#67c7ff';ctx.beginPath();for(let i=0;i<=220;i++){const u=i/220,px=x0+u*w,py=y0+h/2-Math.sin(u*Math.PI*6)*h*.38;i?ctx.lineTo(px,py):ctx.moveTo(px,py);}ctx.stroke();break;}
    case'transformer':{ctx.strokeStyle='#6f7f8e';ctx.lineWidth=25;ctx.strokeRect(x-150,y-125,300,250);label('Primary',x-230,y-145,'#f2c14e');label('Secondary',x+170,y-145,'#67c7ff');arrow(x-70,y,x+70,y);break;}
  }$('#simReadout').textContent=readout();}
  function setSim(id){sim=D.simulations[id]?id:'fieldCompare';const s=D.simulations[sim];vals={};s.controls.forEach(c=>vals[c.id]=c.value);t=0;$('#simCode').textContent=s.code;$('#simTitle').textContent=s.title;$('#simSubtitle').textContent=s.subtitle;$('#simSpec').textContent='AQA '+s.code;$('#simpleExplain').textContent=s.explain;$('#examExplain').textContent=s.exam;$('#mistakeExplain').textContent=s.mistake;const l=D.lessons.find(x=>x.sim===sim)||D.lessons[0];$('#missionGoal').textContent=l.mission.goal;$('#missionSteps').innerHTML=l.mission.steps.map(a=>'<li>'+esc(a)+'</li>').join('');$('#missionRecord').textContent=l.mission.record;$('#missionConclusion').textContent=l.mission.conclusion;$('#simTabs').innerHTML='';Object.entries(D.simulations).forEach(([k,q])=>{const b=document.createElement('button');b.className='sim-tab'+(k===sim?' active':'');b.textContent=q.title;b.addEventListener('click',()=>setSim(k));$('#simTabs').appendChild(b);});$('#simControls').innerHTML='';s.controls.forEach(c=>{const w=document.createElement('div');w.className='sim-control';w.innerHTML='<label><span>'+esc(c.label)+'</span><input type="range" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+c.value+'"><output>'+fmt(c.value)+' '+esc(c.unit)+'</output></label>';const i=$('input',w),o=$('output',w);i.addEventListener('input',()=>{vals[c.id]=Number(i.value);o.textContent=fmt(vals[c.id])+' '+c.unit;draw();});$('#simControls').appendChild(w);});draw();}
  $('#playPause').addEventListener('click',()=>{playing=!playing;$('#playPause').textContent=playing?'Pause':'Play';});
  $('#resetSim').addEventListener('click',()=>setSim(sim));
  $('#showFieldLines').addEventListener('click',()=>draw());
  $('#showVectors').addEventListener('click',()=>draw());
  $('#snapshotSim').addEventListener('click',()=>{$('#snapshotTray').innerHTML='<div class="snapshot"><strong>'+esc(D.simulations[sim].title)+'</strong> · '+esc(readout())+'</div>'+$('#snapshotTray').innerHTML;});
  let last=performance.now();function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(playing){t+=dt;if(['orbit','discharge','particle','induction','ac'].includes(sim))draw();}requestAnimationFrame(loop);}requestAnimationFrame(loop);

  function formulas(){const topic=$('#formulaTopic').value;return D.formulas.filter(f=>topic==='all'||f.topic===topic);}
  function renderFormulaMenu(){const list=formulas();$('#formulaSelect').innerHTML=list.map(f=>'<option value="'+D.formulas.indexOf(f)+'">'+esc(f.name)+'</option>').join('');$('#formulaCards').innerHTML=list.map(f=>'<div class="formula-card"><strong>'+esc(f.name)+'</strong><div class="eq">'+esc(f.eq)+'</div></div>').join('');renderFormula();}
  function renderFormula(){const f=D.formulas[Number($('#formulaSelect').value)]||formulas()[0];if(!f)return;$('#formulaInputs').innerHTML=f.vars.map(v=>'<label class="field"><span>'+esc(v[1])+' <small class="muted">'+esc(v[2])+'</small></span><input type="number" step="any" value="'+v[3]+'" data-v="'+esc(v[0])+'"></label>').join('');$$('[data-v]',$('#formulaInputs')).forEach(i=>i.addEventListener('input',calc));calc();function calc(){const z={};$$('[data-v]',$('#formulaInputs')).forEach(i=>z[i.dataset.v]=Number(i.value));let ans=NaN;try{ans=f.calc(z);}catch(e){}$('#formulaWorking').innerHTML='<div class="working-line"><strong>'+esc(f.eq)+'</strong></div><div class="working-line">'+f.vars.map(v=>esc(v[0])+' = '+fmt(z[v[0]])+' '+esc(v[2])).join(' · ')+'</div><div class="working-line"><strong>Result: '+fmt(ans)+' '+esc(f.unit)+'</strong></div>';}}
  $('#formulaTopic').addEventListener('change',renderFormulaMenu);$('#formulaSelect').addEventListener('change',renderFormula);

  $$('[data-practical]').forEach(b=>b.addEventListener('click',()=>{$$('[data-practical]').forEach(x=>x.classList.toggle('primary',x===b));$$('.practical-panel').forEach(p=>p.classList.add('hidden'));$('#practical-'+b.dataset.practical).classList.remove('hidden');}));
  function range(id,out,fn){const e=$('#'+id),o=$('#'+out);const u=()=>o.textContent=fn(Number(e.value));e.addEventListener('input',u);u();}
  range('rp9C','rp9COut',v=>v+' µF');range('rp9R','rp9ROut',v=>fmt(v/1000)+' kΩ');range('rp9T','rp9TOut',v=>fmt(v)+' s');range('rp10I','rp10IOut',v=>fmt(v)+' A');range('rp10L','rp10LOut',v=>fmt(v)+' m');range('rp10B','rp10BOut',v=>fmt(v)+' T');range('rp11Angle','rp11AngleOut',v=>v+'°');range('rp11N','rp11NOut',v=>v);range('rp11B','rp11BOut',v=>fmt(v)+' T');
  const p9=[],p10=[],p11=[];
  function plot(id,points,xLabel,yLabel){
    const c=$('#'+id); if(!c) return;
    const r=c.getBoundingClientRect(), d=Math.max(1,Math.min(2,window.devicePixelRatio||1));
    const w=Math.max(260,r.width||420), h=Math.max(180,r.height||230);
    c.width=Math.round(w*d); c.height=Math.round(h*d);
    const g=c.getContext('2d'); g.setTransform(d,0,0,d,0,0);
    g.fillStyle='#071522'; g.fillRect(0,0,w,h);
    const p=34;
    for(let i=0;i<=5;i++){
      lineGraph(g,p,p+i*(h-2*p)/5,w-p,p+i*(h-2*p)/5,'rgba(255,255,255,.10)');
      lineGraph(g,p+i*(w-2*p)/5,p,p+i*(w-2*p)/5,h-p,'rgba(255,255,255,.10)');
    }
    lineGraph(g,p,h-p,w-p,h-p,'#7f96aa'); lineGraph(g,p,p,p,h-p,'#7f96aa');
    if(points.length){
      const xs=points.map(q=>q[0]), ys=points.map(q=>q[1]);
      const xmin=Math.min(...xs), xmax=Math.max(...xs), ymin=Math.min(...ys), ymax=Math.max(...ys);
      const sx=x=>p+(x-xmin)/(xmax-xmin||1)*(w-2*p);
      const sy=y=>h-p-(y-ymin)/(ymax-ymin||1)*(h-2*p);
      const sorted=points.slice().sort((a,b)=>a[0]-b[0]);
      g.strokeStyle='#67c7ff'; g.lineWidth=2; g.beginPath();
      sorted.forEach((q,i)=>{const X=sx(q[0]),Y=sy(q[1]);i?g.lineTo(X,Y):g.moveTo(X,Y);}); g.stroke();
      g.fillStyle='#f2c14e'; points.forEach(q=>{g.beginPath();g.arc(sx(q[0]),sy(q[1]),4,0,Math.PI*2);g.fill();});
    }
    g.fillStyle='#b8cadb'; g.font='11px system-ui'; g.fillText(xLabel,w/2-18,h-8);
    g.save(); g.translate(11,h/2+20); g.rotate(-Math.PI/2); g.fillText(yLabel,0,0); g.restore();
  }
  function lineGraph(g,x1,y1,x2,y2,c){g.strokeStyle=c;g.lineWidth=1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
  $('#takeRP9').addEventListener('click',()=>{const C=+$('#rp9C').value*1e-6,R=+$('#rp9R').value,tt=+$('#rp9T').value,V=6*Math.exp(-tt/(R*C)),ln=Math.log(V/6);p9.push([tt,V,ln]);$('#rp9Rows').innerHTML=p9.map(q=>'<tr><td>'+fmt(q[0])+'</td><td>'+fmt(q[1])+'</td><td>'+fmt(q[2])+'</td></tr>').join('');$('#rp9Summary').textContent='τ = '+fmt(R*C)+' s · expected log-plot gradient = '+fmt(-1/(R*C))+' s⁻¹';plot('rp9Graph',p9.map(q=>[q[0],q[2]]),'t / s','ln(V/V₀)');});
  $('#clearRP9').addEventListener('click',()=>{p9.length=0;$('#rp9Rows').innerHTML='';$('#rp9Summary').textContent='Collect at least five readings.';plot('rp9Graph',[],'t / s','ln(V/V₀)');});
  $('#takeRP10').addEventListener('click',()=>{const I=+$('#rp10I').value,L=+$('#rp10L').value,B=+$('#rp10B').value,F=B*I*L;p10.push([I,L,B,F]);$('#rp10Rows').innerHTML=p10.map(q=>'<tr><td>'+fmt(q[0])+'</td><td>'+fmt(q[1])+'</td><td>'+fmt(q[2])+'</td><td>'+fmt(q[3])+'</td></tr>').join('');$('#rp10Summary').textContent='For fixed B and L, F against I should be a straight line through the origin.';plot('rp10Graph',p10.map(q=>[q[0],q[3]]),'I / A','F / N');});
  $('#clearRP10').addEventListener('click',()=>{p10.length=0;$('#rp10Rows').innerHTML='';plot('rp10Graph',[],'I / A','F / N');});
  $('#takeRP11').addEventListener('click',()=>{const a=+$('#rp11Angle').value,N=+$('#rp11N').value,B=+$('#rp11B').value,c=Math.cos(a*Math.PI/180),fl=B*.01*N*c;p11.push([a,c,fl]);$('#rp11Rows').innerHTML=p11.map(q=>'<tr><td>'+fmt(q[0])+'</td><td>'+fmt(q[1])+'</td><td>'+fmt(q[2])+'</td></tr>').join('');$('#rp11Summary').textContent='NΦ should be directly proportional to cosθ.';plot('rp11Graph',p11.map(q=>[q[1],q[2]]),'cosθ','NΦ');});
  $('#clearRP11').addEventListener('click',()=>{p11.length=0;$('#rp11Rows').innerHTML='';plot('rp11Graph',[],'cosθ','NΦ');});

  function diagnostic(){const d=D.diagnostics[Math.floor(Math.random()*D.diagnostics.length)];$('#diagnosticBox').innerHTML='<p><strong>'+esc(d.q)+'</strong></p><textarea placeholder="Write your answer first..."></textarea><button class="button" id="reveal">Reveal answer</button><div class="diagnostic-answer" id="diagAnswer">'+esc(d.a)+'</div>';$('#reveal').addEventListener('click',()=>$('#diagAnswer').classList.add('show'));}
  $('#newDiagnostic').addEventListener('click',diagnostic);
  $('#languageChecklist').innerHTML=['Define field direction clearly.','Use r from the correct reference point.','Separate scalar potential from vector field strength.','Use Faraday for magnitude and Lenz for direction.','State graph gradient/area meanings with units.','Distinguish ideal transformer ratios from losses.'].map(x=>'<label class="checklist-item"><input type="checkbox"> '+esc(x)+'</label>').join('');
  $('#trapList').innerHTML='<ul>'+['Using altitude instead of distance from a planet centre.','Confusing 1/r potential with 1/r² field strength.','Using E = V/d for radial fields.','Calling one RC time constant a half-life.','Using angle to the coil plane instead of its normal.','Saying Lenz opposes the field instead of the change.','Using rms mains voltage as the peak value.'].map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
  $('#equationLinks').innerHTML='<div class="comparison-grid"><div class="mini"><strong>Gravity</strong><p>F → g → V → orbit</p></div><div class="mini"><strong>Electric</strong><p>F → E → V → capacitance</p></div><div class="mini"><strong>Magnetic</strong><p>F → flux → induction → AC</p></div></div>';
  $('#specMap').innerHTML=D.specMap.map(r=>'<div class="spec-card"><strong>'+esc(r[0])+'</strong><span>'+esc(r[1])+'</span><span>'+esc(r[2])+'</span><span>'+esc(r[3])+'</span></div>').join('');

  const quizBank=D.lessons.flatMap(l=>{
    const q=[{spec:l.code,q:l.check[0],choices:l.check[1],correct:l.check[2],hint:l.examTip,explain:l.check[3]}];
    (l.retrieval||[]).slice(0,2).forEach((r,ri)=>{
      const distract=D.lessons.flatMap(z=>z.retrieval||[]).map(a=>a[1]).filter(a=>a!==r[1]);
      const picks=[];
      for(let j=0;j<distract.length&&picks.length<3;j++){
        const a=distract[(j*7+D.lessons.indexOf(l)*3+ri*11)%distract.length];
        if(a&&!picks.includes(a)) picks.push(a);
      }
      const choices=[r[1],...picks].sort(()=>Math.random()-.5);
      q.push({spec:l.code,q:r[0],choices,correct:choices.indexOf(r[1]),hint:'Think back to the core definition or relationship from '+l.title+'.',explain:r[1]});
    });
    return q;
  });
  let quizOrder=[],quizIndex=0,quizScore=0,quizStreak=0,quizAnswered=false;
  function newQuiz(){
    quizOrder=[...quizBank].sort(()=>Math.random()-.5).slice(0,Math.min(20,quizBank.length));
    quizIndex=0;quizScore=0;quizStreak=0;renderQuiz();
  }
  function renderQuiz(){
    if(!$('#quizQuestion')) return;
    const q=quizOrder[quizIndex]||quizBank[0];
    quizAnswered=false;
    $('#quizProgress').textContent=(quizIndex+1)+' / '+quizOrder.length;
    $('#quizProgressFill').style.width=(100*(quizIndex+1)/quizOrder.length)+'%';
    $('#quizScore').textContent=quizScore;
    $('#quizStreak').textContent=quizStreak;
    $('#quizSpec').textContent='AQA '+q.spec;
    $('#quizQuestion').textContent=q.q;
    $('#quizHint').textContent=q.hint;
    $('#quizHint').classList.add('hidden');
    $('#quizFeedback').classList.add('hidden');
    $('#nextQuestion').classList.add('hidden');
    $('#quizChoices').innerHTML=q.choices.map((c,i)=>'<button class="choice-button" data-quiz-choice="'+i+'">'+esc(c)+'</button>').join('');
    $$('[data-quiz-choice]').forEach(b=>b.addEventListener('click',()=>{
      if(quizAnswered) return; quizAnswered=true;
      const chosen=Number(b.dataset.quizChoice),ok=chosen===q.correct;
      $$('[data-quiz-choice]').forEach((x,i)=>{x.disabled=true;if(i===q.correct)x.classList.add('correct');});
      if(!ok)b.classList.add('wrong');
      if(ok){quizScore++;quizStreak++;}else quizStreak=0;
      $('#quizScore').textContent=quizScore;$('#quizStreak').textContent=quizStreak;
      $('#quizFeedback').innerHTML='<strong>'+(ok?'Correct.':'Not quite.')+'</strong> '+esc(q.explain);
      $('#quizFeedback').classList.remove('hidden');$('#nextQuestion').classList.remove('hidden');
    }));
  }
  $('#showHint')?.addEventListener('click',()=>$('#quizHint').classList.toggle('hidden'));
  $('#nextQuestion')?.addEventListener('click',()=>{quizIndex=(quizIndex+1)%quizOrder.length;renderQuiz();});
  $('#restartQuiz')?.addEventListener('click',newQuiz);

  newQuiz();
  progress();renderCourse();renderLesson(lesson);setSim(sim);renderFormulaMenu();diagnostic();requestAnimationFrame(()=>{resize();plot('rp9Graph',[],'t / s','ln(V/V₀)');plot('rp10Graph',[],'I / A','F / N');plot('rp11Graph',[],'cosθ','NΦ');});
})();