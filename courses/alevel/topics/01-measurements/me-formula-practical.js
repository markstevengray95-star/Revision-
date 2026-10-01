'use strict';
  function renderFormula(){
    $('#formulaSelect').innerHTML=formulae.map(f=>`<option value="${f.id}">${f.name}</option>`).join('');
    $('#formulaCards').innerHTML=formulae.map(f=>`<article class="panel formula-card"><span class="eyebrow">Calculation tool</span><h3>${f.name}</h3><p class="muted small">Open in the Formula Coach to work through values.</p><button class="button" data-formula="${f.id}">Open tool</button></article>`).join('');
    $('#formulaSelect').onchange=renderFormulaInputs; $$('[data-formula]').forEach(b=>b.onclick=()=>{$('#formulaSelect').value=b.dataset.formula;renderFormulaInputs();window.scrollTo({top:$('#view-formula').offsetTop,behavior:'smooth'})}); renderFormulaInputs();
  }
  function renderFormulaInputs(){
    const f=formulae.find(x=>x.id===$('#formulaSelect').value)||formulae[0];
    $('#formulaInputs').innerHTML=f.fields.map(z=>`<label class="field"><span>${z[1]}</span><input type="number" step="any" data-f="${z[0]}" value="${z[2]}"></label>`).join('');
    $$('[data-f]').forEach(i=>i.oninput=calcFormula);calcFormula();
  }
  function calcFormula(){
    const f=formulae.find(x=>x.id===$('#formulaSelect').value)||formulae[0],vals={};$$('[data-f]').forEach(i=>vals[i.dataset.f]=+i.value);const r=f.calc(vals);
    $('#formulaWorking').innerHTML=`<p><strong>Relationship:</strong> ${f.name}</p><p><strong>Substitution:</strong> ${r.display}</p><div class="equation"><strong>Result: ${fmt(r.result,4)} ${r.unit}</strong></div><p class="muted">${r.explain}</p>`;
  }

  function practicalSwitch(id){
    $$('.practical-panel').forEach(p=>p.classList.toggle('hidden',p.id!==`practical-${id}`));
    $$('[data-practical]').forEach(b=>b.classList.toggle('primary',b.dataset.practical===id)); if(id==='graph')requestAnimationFrame(drawGraphBench);
  }
  $$('[data-practical]').forEach(b=>b.onclick=()=>practicalSwitch(b.dataset.practical));
  function renderInstrumentChooser(){
    const sel=$('#instrumentTask'); if(!sel)return;
    sel.innerHTML=instrumentTasks.map((t,i)=>`<option value="${i}">${t.task}</option>`).join('');
    const paint=()=>{const t=instrumentTasks[+sel.value];$('#instrumentPrompt').innerHTML=`<strong>Task:</strong> ${t.task}<br><span class="instrument-note">Choose the instrument/method with the most appropriate range and resolution.</span>`;$('#instrumentChoices').innerHTML=t.choices.map(c=>`<button class="choice" data-inst="${c}">${c}</button>`).join('');$('#instrumentFeedback').classList.add('hidden');$$('[data-inst]').forEach(b=>b.onclick=()=>{const ok=b.dataset.inst===t.best;$$('[data-inst]').forEach(x=>{x.disabled=true;if(x.dataset.inst===t.best)x.classList.add('correct');if(x===b&&!ok)x.classList.add('wrong')});const f=$('#instrumentFeedback');f.className='feedback '+(ok?'good':'partial');f.innerHTML=`<strong>${ok?'Good choice':'Not the best choice'}.</strong> ${t.why}`;});};
    sel.onchange=paint; paint();
  }
  renderInstrumentChooser();
  $('#timingCount').oninput=e=>$('#timingCountOut').textContent=e.target.value; $('#timingReaction').oninput=e=>$('#timingReactionOut').textContent=`±${(+e.target.value).toFixed(2)} s`;
  $('#takeTimingReading').onclick=()=>{const n=+$('#timingCount').value, reaction=+$('#timingReaction').value,trueT=1.72,total=trueT*n+randn()*reaction,T=total/n,dT=reaction/n;state.timing.push({n,total,T,dT,p:percent(dT,T)});renderTiming()};
  $('#clearTimingData').onclick=()=>{state.timing=[];renderTiming()};
  function renderTiming(){ $('#timingRows').innerHTML=state.timing.map(r=>`<tr><td>${r.n}</td><td>${fmt(r.total,3)}</td><td>${fmt(r.T,4)}</td><td>${fmt(r.dT,4)}</td><td>${fmt(r.p,2)}%</td></tr>`).join('');$('#timingSummary').innerHTML=state.timing.length?`Best relative precision so far: <strong>${fmt(Math.min(...state.timing.map(r=>r.p)),2)}%</strong>. Timing more oscillations divides the timing uncertainty across the count.`:'Collect readings using different counts.'; }

  $('#microTrue').oninput=e=>{$('#microTrueOut').textContent=`${(+e.target.value).toFixed(2)} mm`;updateMicroVisual()}; $('#microZero').oninput=e=>{$('#microZeroOut').textContent=`${(+e.target.value).toFixed(2)} mm`;updateMicroVisual()};
  function updateMicroVisual(){const t=+$('#microTrue').value;$('#microWire').style.width=`${clamp(t*16,4,18)}px`;$('#microScale').textContent=`${(t+(+$('#microZero').value)).toFixed(2)} mm`}
  $('#takeMicroReading').onclick=()=>{const t=+$('#microTrue').value,z=+$('#microZero').value,raw=t+z+randn()*.008,corrected=raw-z;state.micro.push({raw,corrected});renderMicro()}; $('#clearMicroData').onclick=()=>{state.micro=[];renderMicro()};
  function renderMicro(){ $('#microRows').innerHTML=state.micro.map((r,i)=>`<tr><td>${i+1}</td><td>${r.raw.toFixed(3)}</td><td>${r.corrected.toFixed(3)}</td></tr>`).join(''); if(state.micro.length){const vals=state.micro.map(r=>r.corrected),mean=vals.reduce((a,b)=>a+b,0)/vals.length,hr=(Math.max(...vals)-Math.min(...vals))/2;$('#microSummary').innerHTML=`Corrected mean = <strong>${mean.toFixed(3)} mm</strong> · half-range ≈ <strong>±${hr.toFixed(3)} mm</strong>`;}else $('#microSummary').textContent='Take at least five readings.'; }

  $('#graphUnc').oninput=e=>{$('#graphUncOut').textContent=`±${(+e.target.value).toFixed(2)}`}; $('#graphScatter').oninput=e=>{$('#graphScatterOut').textContent=(+e.target.value).toFixed(2)};
  $('#generateGraphData').onclick=()=>{const u=+$('#graphUnc').value,s=+$('#graphScatter').value;state.graphData=Array.from({length:8},(_,i)=>({x:i+1,y:1.6*(i+1)+2+randn()*s,u}));drawGraphBench()}; $('#clearGraphData').onclick=()=>{state.graphData=[];drawGraphBench()};
  function drawGraphBench(){
    const c=$('#graphBenchCanvas');if(!c)return;const {x,w,h}=clearCanvas(c,'Graph uncertainty bench');axis(x,w,h); if(!state.graphData.length){x.fillStyle='#9fb0c6';x.fillText('Generate data to plot error bars and limiting gradients.',80,90);$('#graphBenchSummary').textContent='Generate a data set to begin.';return}
    const pad=60,xmax=9,ymax=Math.max(...state.graphData.map(p=>p.y+p.u))*1.12,xm=z=>pad+z/xmax*(w-pad-25),ym=z=>h-pad-z/ymax*(h-pad-45);state.graphData.forEach(p=>{const xx=xm(p.x),yy=ym(p.y),yu=Math.abs(ym(p.y+p.u)-yy);x.strokeStyle='#7695ae';x.beginPath();x.moveTo(xx,yy-yu);x.lineTo(xx,yy+yu);x.moveTo(xx-5,yy-yu);x.lineTo(xx+5,yy-yu);x.moveTo(xx-5,yy+yu);x.lineTo(xx+5,yy+yu);x.stroke();x.fillStyle='#57d3ff';x.beginPath();x.arc(xx,yy,4,0,Math.PI*2);x.fill()});const best=linearRegression(state.graphData),first=state.graphData[0],last=state.graphData[state.graphData.length-1],dx=last.x-first.x,max=((last.y+last.u)-(first.y-first.u))/dx,min=((last.y-last.u)-(first.y+first.u))/dx,maxB=(first.y-first.u)-max*first.x,minB=(first.y+first.u)-min*first.x; const line=(m,b,col)=>{x.strokeStyle=col;x.lineWidth=2;x.beginPath();x.moveTo(xm(0),ym(b));x.lineTo(xm(9),ym(m*9+b));x.stroke()};line(best.m,best.b,'#8ce99a');line(max,maxB,'#ffd166');line(min,minB,'#ff8a8a');const useMax=Math.abs(max-best.m)>=Math.abs(min-best.m),worst=useMax?max:min,worstB=useMax?maxB:minB,dm=Math.abs(best.m-worst),dc=Math.abs(best.b-worstB);$('#graphBenchSummary').innerHTML=`Best gradient ≈ <strong>${fmt(best.m,3)}</strong> · worst acceptable ≈ <strong>${fmt(worst,3)}</strong> · Δm ≈ <strong>${fmt(dm,3)}</strong> (${fmt(percent(dm,best.m),2)}%) · best intercept ≈ <strong>${fmt(best.b,3)}</strong> · Δc ≈ <strong>${fmt(dc,3)}</strong>`;
  }
