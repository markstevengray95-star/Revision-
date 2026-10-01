(function(){
'use strict';
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.from((r||document).querySelectorAll(s))};
var clamp=function(n,a,b){return Math.max(a,Math.min(b,n))},TAU=Math.PI*2,g=9.81,R=8.31,kB=1.38e-23,NA=6.02e23;
var tool='off',workspace='graph',measureStart=null,measureEnd=null,savedStarts={},laps=[],history={},questionCache={},invRows={};
try{invRows=JSON.parse(localStorage.getItem('fm-sim-investigations-v8')||'{}')}catch(e){invRows={}}
function api(){return window.FM_SIM}
function st(){return api()&&api().getState?api().getState():null}
function fmt(n,d){if(!Number.isFinite(n))return '—';d=d||4;if(Math.abs(n)>=1e5||(Math.abs(n)>0&&Math.abs(n)<1e-3))return n.toExponential(3);return Number(n.toPrecision(d)).toString()}
function saveRows(){localStorage.setItem('fm-sim-investigations-v8',JSON.stringify(invRows))}
function thermalState(E){
 if(E<20)return{label:'solid warming',temp:220+3*E};
 if(E<35)return{label:'melting plateau',temp:280};
 if(E<70)return{label:'liquid warming',temp:280+3*(E-35)};
 if(E<90)return{label:'boiling plateau',temp:385};
 return{label:'gas warming',temp:385+4*(E-90)};
}
function derived(s){
 if(!s)return{};
 var v=s.values||{},o={};
 if(s.id==='circular'){o.speed=v.omega*v.radius;o.a=v.omega*v.omega*v.radius;o.F=v.mass*o.a;o.T=TAU/v.omega}
 if(s.id==='shm'){o.w=TAU*v.freq;o.x=v.amp*Math.cos(o.w*s.time);o.vel=-v.amp*o.w*Math.sin(o.w*s.time);o.a=-o.w*o.w*o.x;o.vmax=o.w*v.amp;o.amax=o.w*o.w*v.amp}
 if(s.id==='spring'){o.w=Math.sqrt(v.springK/v.mass);o.T=TAU/o.w;o.x=v.amp*Math.cos(o.w*s.time);o.vmax=o.w*v.amp}
 if(s.id==='pendulum'){o.w=Math.sqrt(g/v.length);o.T=TAU/o.w;o.theta=v.angle*Math.cos(o.w*s.time)}
 if(s.id==='shmEnergy'){o.w=TAU*v.freq;o.x=v.amp*Math.cos(o.w*s.time);o.total=.5*v.springK*v.amp*v.amp;o.PE=.5*v.springK*o.x*o.x;o.KE=o.total-o.PE}
 if(s.id==='damping'){o.w=TAU*v.freq;o.env=v.amp*Math.exp(-v.damp*s.time);o.x=o.env*Math.cos(o.w*s.time);o.energyFrac=Math.pow(o.env/v.amp,2)}
 if(s.id==='resonance'){o.r=v.drive/v.natural;o.response=1/Math.sqrt(Math.pow(1-o.r*o.r,2)+Math.pow(2*v.damp*o.r,2))}
 if(s.id==='thermalParticles'){o.meanKE=1.5*kB*v.temp;o.phase=['solid','liquid','gas'][Math.round(v.phase)]}
 if(s.id==='calorimetry'){o.dT=v.power*s.time/(v.mass*v.specificC);o.temp=293+o.dT;o.energy=v.power*s.time}
 if(s.id==='flowHeating'){o.dT=v.power/(v.flow*v.specificC);o.energyPerKg=v.power/v.flow}
 if(s.id==='heatingCurve'){Object.assign(o,thermalState(v.energy))}
 if(s.id==='gasLaws'){o.p=101*(80/v.volume)*(v.temp/300)*v.amount;o.constant=o.p*v.volume/v.temp}
 if(s.id==='idealGas'){o.p=v.moles*R*v.temp/v.volume;o.N=v.moles*NA}
 if(s.id==='boylePractical'){o.p=101*80/v.volume*(v.temp/295);o.pV=o.p*v.volume}
 if(s.id==='charlesPractical'){o.V=70*(v.temp/300)*(101/v.pressure);o.VT=o.V/v.temp}
 if(s.id==='brownian'){o.meanKE=1.5*kB*v.temp}
 if(s.id==='kineticTheory'){o.meanKE=1.5*kB*v.temp;o.crms=Math.sqrt(3*kB*v.temp/v.molecularMass);o.V=.001;o.N=v.number*1e20;o.p=o.N*kB*v.temp/o.V}
 return o;
}

/* transport */
function syncClock(){
 var s=st();if(!s)return;
 if($('#simClock'))$('#simClock').textContent=s.time.toFixed(2)+' s';
 if($('#simLaps'))$('#simLaps').innerHTML=laps.slice(-4).map(function(x,i){return'<span class="lap-pill">Lap '+(Math.max(1,laps.length-3)+i)+': '+x.toFixed(2)+' s</span>'}).join('');
}
function bindTransport(){
 $('#stepBack').onclick=function(){api().step(-.05);syncClock()};
 $('#stepForward').onclick=function(){api().step(.05);syncClock()};
 $('#setSimStart').onclick=function(){var s=st();savedStarts[s.id]={values:Object.assign({},s.values),time:s.time};this.textContent='Start saved ✓';setTimeout(()=>this.textContent='Set current setup as start',1000)};
 $('#replaySimStart').onclick=function(){var s=st(),p=savedStarts[s.id]||{values:Object.assign({},s.values),time:0};api().setValues(p.values);api().setTime(p.time||0);api().setRunning(true);laps=[];syncClock()};
 $('#lapSimTimer').onclick=function(){var s=st();laps.push(s.time);syncClock()};
}

/* measurement overlay */
var overlay,main,mc;
function resizeOverlay(){
 if(!overlay||!main)return;var r=main.getBoundingClientRect(),d=window.devicePixelRatio||1;
 overlay.width=Math.max(1,Math.round(r.width*d));overlay.height=Math.max(1,Math.round(r.height*d));mc.setTransform(d,0,0,d,0,0);drawMeasure();
}
function pos(e){var r=overlay.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top,w:r.width,h:r.height}}
function setTool(t){
 tool=t;measureStart=measureEnd=null;
 $$('[data-measure-tool]').forEach(function(b){b.classList.toggle('active',b.dataset.measureTool===t)});
 overlay.style.pointerEvents=t==='off'?'none':'auto';
 $('#measureReadout').textContent=t==='off'?'Direct dragging enabled.':t==='ruler'?'Drag between two points. Where possible the ruler is calibrated to the model.':t==='protractor'?'Drag from a vertex; angle is measured from the vertical reference.':'Move over the model to inspect a point.';
 drawMeasure();
}
function calibratedDistance(px,s,w,h){
 var v=s.values||{};
 if(s.id==='circular'){var rp=Math.min(w,h)*(.16+.08*(v.radius-.4)/2.1);return{value:px*v.radius/rp,unit:'m'}}
 if(['shm','shmEnergy','damping'].includes(s.id)){var scale=Math.min(w*.34,300)/.2;return{value:px/scale,unit:'m'}}
 if(s.id==='spring')return{value:px/650,unit:'m'};
 if(s.id==='pendulum'){var L=Math.min(h*.62,175+v.length*110);return{value:px*v.length/L,unit:'m'}}
 return{value:px,unit:'screen px'};
}
function cursorValue(p,s){
 var v=s.values||{},o=derived(s),w=p.w,h=p.h;
 if(s.id==='circular'){var cx=w*.5,cy=h*.53,dist=Math.hypot(p.x-cx,p.y-cy),rp=Math.min(w,h)*(.16+.08*(v.radius-.4)/2.1);return'r ≈ '+fmt(dist*v.radius/rp)+' m'}
 if(['shm','shmEnergy','damping'].includes(s.id)){var scale=Math.min(w*.34,300)/.2;return'x ≈ '+fmt((p.x-w*.5)/scale)+' m'}
 if(s.id==='pendulum'){var a=Math.atan2(p.x-w*.5,p.y-54)*180/Math.PI;return'angle ≈ '+fmt(a)+'°'}
 if(s.id==='resonance'){var f=.3+clamp((p.x-70)/(w-140),0,1)*5.2,r=f/v.natural,A=1/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*v.damp*r,2));return'f ≈ '+fmt(f)+' Hz · response ≈ '+fmt(A)}
 if(s.id==='heatingCurve'){var E=clamp((p.x-65)/(w-130)*100,0,100),q=thermalState(E);return'energy ≈ '+fmt(E)+'% · T ≈ '+fmt(q.temp)+' K · '+q.label}
 if(['gasLaws','boylePractical'].includes(s.id)){var frac=clamp(1-(p.y-90)/(h*.6),.05,1),V=30+frac*110;return'V ≈ '+fmt(V)+' cm³'}
 if(s.id==='idealGas'){var fr=clamp(1-(p.y-90)/(h*.6),.05,1),Vi=.001+fr*.009;return'V ≈ '+fmt(Vi)+' m³'}
 if(s.id==='charlesPractical')return'T = '+fmt(v.temp)+' K · V ≈ '+fmt(o.V)+' cm³';
 return'x '+Math.round(p.x)+' px · y '+Math.round(p.y)+' px';
}
function drawMeasure(){
 if(!mc||!overlay)return;var r=overlay.getBoundingClientRect(),w=r.width,h=r.height;mc.clearRect(0,0,w,h);
 if(tool==='off'||!measureEnd)return;
 mc.save();mc.strokeStyle='#ffd56a';mc.fillStyle='#ffd56a';mc.lineWidth=2;mc.setLineDash([5,4]);
 if(tool==='cursor'){mc.beginPath();mc.moveTo(measureEnd.x,0);mc.lineTo(measureEnd.x,h);mc.moveTo(0,measureEnd.y);mc.lineTo(w,measureEnd.y);mc.stroke();mc.setLineDash([]);mc.beginPath();mc.arc(measureEnd.x,measureEnd.y,6,0,TAU);mc.fill();$('#measureReadout').textContent=cursorValue(Object.assign({w:w,h:h},measureEnd),st());mc.restore();return}
 if(!measureStart){mc.restore();return}
 mc.beginPath();mc.moveTo(measureStart.x,measureStart.y);mc.lineTo(measureEnd.x,measureEnd.y);mc.stroke();mc.setLineDash([]);
 mc.beginPath();mc.arc(measureStart.x,measureStart.y,5,0,TAU);mc.arc(measureEnd.x,measureEnd.y,5,0,TAU);mc.fill();
 if(tool==='ruler'){var dist=Math.hypot(measureEnd.x-measureStart.x,measureEnd.y-measureStart.y),cal=calibratedDistance(dist,st(),w,h);$('#measureReadout').textContent='Measured distance ≈ '+fmt(cal.value)+' '+cal.unit;}
 if(tool==='protractor'){var dx=measureEnd.x-measureStart.x,dy=measureEnd.y-measureStart.y,ang=Math.abs(Math.atan2(dx,dy)*180/Math.PI);if(ang>90)ang=180-ang;$('#measureReadout').textContent='Angle from vertical ≈ '+fmt(ang)+'°';var rad=55,a0=Math.PI/2,a1=Math.PI/2-Math.atan2(dy,dx);mc.beginPath();mc.arc(measureStart.x,measureStart.y,rad,Math.min(a0,a1),Math.max(a0,a1));mc.stroke();}
 mc.restore();
}
function bindMeasurement(){
 main=$('#simCanvas');overlay=$('#measureCanvas');mc=overlay.getContext('2d');resizeOverlay();
 if(window.ResizeObserver)new ResizeObserver(resizeOverlay).observe(main);window.addEventListener('resize',resizeOverlay);
 $$('[data-measure-tool]').forEach(function(b){b.onclick=function(){setTool(b.dataset.measureTool)}});
 overlay.addEventListener('pointerdown',function(e){var p=pos(e);measureStart=p;measureEnd=p;overlay.setPointerCapture(e.pointerId);drawMeasure()});
 overlay.addEventListener('pointermove',function(e){if(tool==='cursor'||measureStart){measureEnd=pos(e);drawMeasure()}});
 overlay.addEventListener('pointerup',function(e){measureEnd=pos(e);drawMeasure()});
 overlay.addEventListener('pointercancel',function(){measureStart=null});
}

/* live graph */
function sampleFor(s){
 var v=s.values||{},o=derived(s),t=s.time;
 if(s.id==='circular')return{x:t,xLabel:'simulation time / s',series:[['v / m s⁻¹',o.speed],['a / m s⁻²',o.a],['F / N',o.F]]};
 if(s.id==='shm')return{x:t,xLabel:'time / s',series:[['x / m',o.x],['v / m s⁻¹',o.vel],['a / m s⁻²',o.a]]};
 if(s.id==='spring')return{x:t,xLabel:'time / s',series:[['x / m',o.x]]};
 if(s.id==='pendulum')return{x:t,xLabel:'time / s',series:[['angle / °',o.theta]]};
 if(s.id==='shmEnergy')return{x:t,xLabel:'time / s',series:[['KE / J',o.KE],['PE / J',o.PE],['total / J',o.total]]};
 if(s.id==='damping')return{x:t,xLabel:'time / s',series:[['x / m',o.x],['envelope / m',o.env]]};
 if(s.id==='resonance')return{x:v.drive,xLabel:'driving frequency / Hz',series:[['response',o.response]]};
 if(s.id==='thermalParticles')return{x:v.temp,xLabel:'temperature / K',series:[['mean KE / J',o.meanKE]]};
 if(s.id==='calorimetry')return{x:t,xLabel:'time / s',series:[['temperature rise / K',o.dT]]};
 if(s.id==='flowHeating')return{x:v.flow,xLabel:'mass flow / kg s⁻¹',series:[['temperature rise / K',o.dT]]};
 if(s.id==='heatingCurve')return{x:v.energy,xLabel:'energy supplied / %',series:[['model temperature / K',o.temp]]};
 if(s.id==='gasLaws')return{x:v.volume,xLabel:'volume / cm³',series:[['pressure / kPa',o.p]]};
 if(s.id==='idealGas')return{x:v.volume,xLabel:'volume / m³',series:[['pressure / Pa',o.p]]};
 if(s.id==='boylePractical')return{x:1/v.volume,xLabel:'1/V / cm⁻³',series:[['pressure / kPa',o.p]]};
 if(s.id==='charlesPractical')return{x:v.temp,xLabel:'temperature / K',series:[['volume / cm³',o.V]]};
 if(s.id==='brownian')return{x:v.temp,xLabel:'temperature / K',series:[['mean KE scale / J',o.meanKE]]};
 if(s.id==='kineticTheory')return{x:v.temp,xLabel:'temperature / K',series:[['cᵣₘₛ / m s⁻¹',o.crms],['pressure / Pa',o.p]]};
 return null;
}
function collectSample(){
 var s=st(),q=sampleFor(s);if(!s||!q)return;
 var arr=history[s.id]=history[s.id]||[],last=arr[arr.length-1];
 var sig=q.x+'|'+q.series.map(function(x){return Number(x[1]).toPrecision(5)}).join('|');
 if(last&&last.sig===sig)return;
 arr.push({x:q.x,xLabel:q.xLabel,series:q.series,sig:sig});if(arr.length>180)arr.shift();
 if(workspace==='graph')drawLiveGraph();
}
function sizeCanvas(c,h){var r=c.getBoundingClientRect(),d=window.devicePixelRatio||1;c.width=Math.max(1,Math.round(r.width*d));c.height=Math.round((h||300)*d);var x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);return{ctx:x,w:r.width,h:h||300}}
function drawLiveGraph(){
 var c=$('#liveGraphCanvas'),s=st();if(!c||!s)return;var arr=history[s.id]||[],sz=sizeCanvas(c,300),x=sz.ctx,w=sz.w,h=sz.h,p=42;
 x.clearRect(0,0,w,h);x.fillStyle='#06111d';x.fillRect(0,0,w,h);x.strokeStyle='#526d84';x.lineWidth=1.5;x.beginPath();x.moveTo(p,18);x.lineTo(p,h-p);x.lineTo(w-12,h-p);x.stroke();
 if(arr.length<2){x.fillStyle='#9eb2c8';x.font='14px system-ui';x.fillText('Change a control or run the simulation to build the graph.',p+18,h/2);return}
 var xs=arr.map(function(a){return a.x}),xmin=Math.min.apply(null,xs),xmax=Math.max.apply(null,xs);if(xmin===xmax){xmin-=1;xmax+=1}
 var n=arr[0].series.length,colors=['#67c7ff','#63d9a4','#ff7b87','#ffd56a'],px=function(v){return p+(v-xmin)/(xmax-xmin)*(w-p-18)};
 for(var j=0;j<n;j++){
   var ys=arr.map(function(a){return a.series[j][1]}),ymin=Math.min.apply(null,ys),ymax=Math.max.apply(null,ys);if(ymin===ymax){var pad=Math.abs(ymin)*.1||1;ymin-=pad;ymax+=pad}
   var py=function(v){return h-p-(v-ymin)/(ymax-ymin)*(h-p-28)};
   x.strokeStyle=colors[j%colors.length];x.lineWidth=2.3;x.beginPath();
   arr.forEach(function(a,i){var xx=px(a.x),yy=py(a.series[j][1]);if(i===0)x.moveTo(xx,yy);else x.lineTo(xx,yy)});x.stroke();
 }
 x.fillStyle='#9eb2c8';x.font='12px system-ui';x.fillText(arr[arr.length-1].xLabel,p,h-12);
 var legend=$('#liveGraphLegend'),last=arr[arr.length-1];if(legend)legend.innerHTML=last.series.map(function(q,i){return'<span style="color:'+colors[i%colors.length]+'">'+q[0]+': '+fmt(q[1])+'</span>'}).join('')+(n>1?'<span class="muted">traces auto-scaled individually to show phase/trend</span>':'');
}
function renderGraph(){
 var s=st(),arr=history[s.id]||[];$('#simWorkspaceBody').innerHTML='<div class="workspace-grid"><article class="live-graph-card"><canvas id="liveGraphCanvas" class="live-graph-canvas"></canvas><div id="liveGraphLegend" class="graph-legend"></div><div id="liveGraphCursor" class="measure-readout">Move across the graph to inspect the nearest recorded point.</div></article><aside class="workspace-card"><h3>Graph controls</h3><p class="muted">The graph samples the current simulation automatically. Move a slider or drag the model to investigate a relationship.</p><button class="button" id="clearLiveGraph">Clear graph</button><button class="button" id="captureGraphPoint">Capture current point</button><div class="cursor-values"><div><strong>'+arr.length+'</strong><span>samples</span></div><div><strong>'+fmt(s.time)+'</strong><span>simulation s</span></div><div><strong>'+s.title+'</strong><span>model</span></div></div></aside></div>';$('#clearLiveGraph').onclick=function(){history[s.id]=[];drawLiveGraph()};$('#captureGraphPoint').onclick=function(){var q=sampleFor(st()),a=history[s.id]=history[s.id]||[];a.push({x:q.x,xLabel:q.xLabel,series:q.series,sig:'manual'+Date.now()});drawLiveGraph()};setTimeout(drawLiveGraph,20);
 var gc=$('#liveGraphCanvas');if(gc)gc.onpointermove=function(e){var a=history[s.id]||[];if(!a.length)return;var r=gc.getBoundingClientRect(),frac=clamp((e.clientX-r.left-42)/Math.max(1,r.width-72),0,1),xs=a.map(function(q){return q.x}),xmin=Math.min.apply(null,xs),xmax=Math.max.apply(null,xs),target=xmin+frac*(xmax-xmin),near=a.reduce(function(best,q){return!best||Math.abs(q.x-target)<Math.abs(best.x-target)?q:best},null);if(near&&$('#liveGraphCursor'))$('#liveGraphCursor').innerHTML='<strong>'+near.xLabel+': '+fmt(near.x)+'</strong> · '+near.series.map(function(q){return q[0]+' '+fmt(q[1])}).join(' · ');};
}

/* current-value calculations */
function calcFor(s){
 var v=s.values,o=derived(s);
 if(s.id==='circular')return{q:'Using the current m, ω and r, calculate the required centripetal force.',a:o.F,u:'N',steps:['a=ω²r','F=ma=mω²r']};
 if(s.id==='shm')return{q:'Using the current amplitude and frequency, calculate the maximum speed.',a:o.vmax,u:'m s⁻¹',steps:['ω=2πf','vmax=ωA']};
 if(s.id==='spring')return{q:'Calculate the period for the current mass and spring constant.',a:o.T,u:'s',steps:['T=2π√(m/k)']};
 if(s.id==='pendulum')return{q:'Calculate the small-angle period for the current pendulum length.',a:o.T,u:'s',steps:['T=2π√(L/g)']};
 if(s.id==='shmEnergy')return{q:'Calculate the total spring-SHM energy for the current amplitude and k.',a:o.total,u:'J',steps:['E=½kA²']};
 if(s.id==='damping')return{q:'What fraction of the initial mechanical energy remains at the current time if E∝A²?',a:o.energyFrac*100,u:'%',steps:['A/A₀=e^(−damping·t)','E/E₀=(A/A₀)²','multiply by 100 for percentage']};
 if(s.id==='resonance')return{q:'Calculate the current driving-frequency ratio fdrive/fnatural.',a:o.r,u:'',steps:['ratio=fdrive/fnatural']};
 if(s.id==='thermalParticles')return{q:'Calculate the mean translational kinetic energy scale 3/2 kT at the current temperature.',a:o.meanKE,u:'J',steps:['Ēk=3/2 kT']};
 if(s.id==='calorimetry')return{q:'Ignoring heat loss, calculate the temperature rise at the current simulation time.',a:o.dT,u:'K',steps:['Q=Pt','Q=mcΔT','ΔT=Pt/(mc)']};
 if(s.id==='flowHeating')return{q:'Calculate the outlet temperature rise for the current flow, power and c.',a:o.dT,u:'K',steps:['P=ṁcΔT','ΔT=P/(ṁc)']};
 if(s.id==='heatingCurve'){var eq=(o.label.indexOf('plateau')>=0?'Q=ml':'Q=mcΔT');return{choice:true,q:'At the current point ('+o.label+'), which thermal equation belongs to this stage?',options:['Q=mcΔT','Q=ml'],correct:eq==='Q=ml'?1:0,explain:eq+' is appropriate for this stage.'}}
 if(s.id==='gasLaws')return{q:'Using the current model state, calculate the displayed model pressure.',a:o.p,u:'kPa',steps:['p=101×(80/V)×(T/300)×relative amount']};
 if(s.id==='idealGas')return{q:'Calculate the pressure from the current n, T and V.',a:o.p,u:'Pa',steps:['pV=nRT','p=nRT/V']};
 if(s.id==='boylePractical')return{q:'Calculate pV for the current Boyle-law reading.',a:o.pV,u:'kPa·cm³',steps:['pV=pressure×volume']};
 if(s.id==='charlesPractical')return{q:'Calculate the gas volume predicted by the current T and p settings.',a:o.V,u:'cm³',steps:['V=70×(T/300)×(101/p) for this model']};
 if(s.id==='brownian')return{q:'Calculate the mean translational kinetic-energy scale at the current temperature.',a:o.meanKE,u:'J',steps:['Ēk=3/2 kT']};
 if(s.id==='kineticTheory')return{q:'Calculate the rms speed for the current temperature and molecular mass.',a:o.crms,u:'m s⁻¹',steps:['½mcᵣₘₛ²=3/2kT','cᵣₘₛ=√(3kT/m)']};
}
function renderCalculate(){
 var s=st(),q=calcFor(s);questionCache[s.id]=q;
 if(q.choice){$('#simWorkspaceBody').innerHTML='<article class="workspace-card"><span class="eyebrow">Question from the current simulation</span><h3 class="workspace-question">'+q.q+'</h3><div class="prediction-options">'+q.options.map(function(o,i){return'<button class="button" data-calc-choice="'+i+'">'+o+'</button>'}).join('')+'</div><div id="currentCalcFeedback"></div><button class="text-button" id="refreshCurrentCalc">Refresh from current setup</button></article>';$$('[data-calc-choice]').forEach(function(b){b.onclick=function(){var ok=+b.dataset.calcChoice===q.correct;$('#currentCalcFeedback').className='workspace-feedback '+(ok?'good':'bad');$('#currentCalcFeedback').textContent=(ok?'Correct. ':'Not quite. ')+q.explain}});$('#refreshCurrentCalc').onclick=renderCalculate;return}
 $('#simWorkspaceBody').innerHTML='<div class="workspace-grid"><article class="workspace-card"><span class="eyebrow">Question from the exact current values</span><h3 class="workspace-question">'+q.q+'</h3><div class="workspace-answer-row"><input id="currentCalcAnswer" type="number" step="any" placeholder="Your answer"><span>'+q.u+'</span><button class="button primary" id="checkCurrentCalc">Check</button></div><div id="currentCalcFeedback"></div></article><aside class="workspace-card"><h3>Hint ladder</h3><p class="muted">Reveal only as much help as you need.</p><div class="hint-ladder"><button class="text-button" data-live-hint="1">Hint 1</button><button class="text-button" data-live-hint="2">Hint 2</button><button class="text-button" data-live-hint="3">Full setup</button></div><div id="liveHintText" class="workspace-feedback hidden"></div><button class="button" id="refreshCurrentCalc">Refresh from current setup</button></aside></div>';
 $('#refreshCurrentCalc').onclick=renderCalculate;
 $$('[data-live-hint]').forEach(function(b){b.onclick=function(){var n=+b.dataset.liveHint;$('#liveHintText').classList.remove('hidden');$('#liveHintText').innerHTML='<ol>'+q.steps.slice(0,n).map(function(x){return'<li>'+x+'</li>'}).join('')+'</ol>';}});
 $('#checkCurrentCalc').onclick=function(){var a=+$('#currentCalcAnswer').value,tol=Math.max(Math.abs(q.a)*.02,1e-12),ok=Number.isFinite(a)&&Math.abs(a-q.a)<=tol;$('#currentCalcFeedback').className='workspace-feedback '+(ok?'good':'bad');$('#currentCalcFeedback').innerHTML=ok?'Correct — <strong>'+fmt(q.a)+' '+q.u+'</strong>.':'Check the equation and substitution. Current answer is about <strong>'+fmt(q.a)+' '+q.u+'</strong>.'};
}

/* guided investigations */
var inv={
 circular:{aim:'Investigate how angular speed changes centripetal acceleration and force.',steps:['Keep mass and radius fixed.','Change angular speed in several steps.','Record v, a and F.','Look for a relationship with ω² or v².'],heads:['ω / rad s⁻¹','r / m','v / m s⁻¹','a / m s⁻²','F / N'],row:function(s,o){return[s.values.omega,s.values.radius,o.speed,o.a,o.F]},gx:0,gy:4,conclusion:'At fixed m and r, F is proportional to ω² and v².'},
 shm:{aim:'Investigate how frequency changes the maximum SHM speed and acceleration.',steps:['Keep amplitude fixed.','Change frequency.','Record vmax and amax.','Compare with ω and ω².'],heads:['f / Hz','A / m','vmax / m s⁻¹','amax / m s⁻²'],row:function(s,o){return[s.values.freq,s.values.amp,o.vmax,o.amax]},gx:0,gy:2,conclusion:'At fixed A, vmax∝f and amax∝f².'},
 spring:{aim:'Test the mass–spring period relationship used in RP7.',steps:['Keep k and amplitude fixed.','Change mass.','Record T and T².','Plot T² against m.'],heads:['m / kg','k / N m⁻¹','T / s','T² / s²'],row:function(s,o){return[s.values.mass,s.values.springK,o.T,o.T*o.T]},gx:0,gy:3,conclusion:'T² is proportional to mass; gradient=4π²/k.'},
 pendulum:{aim:'Test the simple-pendulum period relationship used in RP7.',steps:['Keep release angle small.','Change length.','Record T and T².','Plot T² against L.'],heads:['L / m','angle / °','T / s','T² / s²'],row:function(s,o){return[s.values.length,s.values.angle,o.T,o.T*o.T]},gx:0,gy:3,conclusion:'For small angles, T²∝L and gradient=4π²/g.'},
 shmEnergy:{aim:'Track the exchange between kinetic and potential energy through an SHM cycle.',steps:['Pause at several positions or use frame-step.','Record x, KE and PE.','Check the total.','Compare equilibrium and turning points.'],heads:['t / s','x / m','KE / J','PE / J','total / J'],row:function(s,o){return[s.time,o.x,o.KE,o.PE,o.total]},gx:1,gy:2,conclusion:'KE is greatest near equilibrium, PE near the endpoints, while total energy is constant.'},
 damping:{aim:'Measure how damping changes amplitude and mechanical-energy fraction.',steps:['Choose an initial amplitude.','Record the envelope at different times.','Repeat with a new damping setting.','Compare decay rates.'],heads:['t / s','damping','envelope / m','energy / initial'],row:function(s,o){return[s.time,s.values.damp,o.env,o.energyFrac]},gx:0,gy:2,conclusion:'Greater damping removes mechanical energy more rapidly, reducing the amplitude envelope.'},
 resonance:{aim:'Build a resonance curve from individual driving-frequency readings.',steps:['Keep natural frequency and damping fixed.','Change driving frequency.','Record relative response.','Repeat across both sides of resonance.'],heads:['fdrive / Hz','fnatural / Hz','damping','response'],row:function(s,o){return[s.values.drive,s.values.natural,s.values.damp,o.response]},gx:0,gy:3,conclusion:'Response peaks when the driving frequency is close to the natural frequency.'},
 thermalParticles:{aim:'Connect absolute temperature to the molecular kinetic-energy scale.',steps:['Choose one state.','Change temperature.','Record 3/2 kT.','Describe what the visual particle motion does.'],heads:['T / K','state','mean KE / J'],row:function(s,o){return[s.values.temp,o.phase,o.meanKE]},gx:0,gy:2,conclusion:'Mean translational kinetic energy is directly proportional to absolute temperature.'},
 calorimetry:{aim:'Investigate temperature rise during constant-power electrical heating.',steps:['Set m, c and P.','Run or frame-step the simulation.','Record time and ΔT.','Repeat for a different power or mass.'],heads:['t / s','P / W','m / kg','ΔT / K'],row:function(s,o){return[s.time,s.values.power,s.values.mass,o.dT]},gx:0,gy:3,conclusion:'Ideally ΔT increases linearly with time, with gradient P/(mc).'},
 flowHeating:{aim:'Investigate how mass flow rate affects outlet temperature rise.',steps:['Keep power and c fixed.','Change mass flow rate.','Record ΔT.','Plot ΔT against flow rate or 1/flow rate.'],heads:['flow / kg s⁻¹','P / W','c / J kg⁻¹ K⁻¹','ΔT / K'],row:function(s,o){return[s.values.flow,s.values.power,s.values.specificC,o.dT]},gx:0,gy:3,conclusion:'At fixed P and c, ΔT is inversely proportional to mass flow rate.'},
 heatingCurve:{aim:'Identify the different physical stages of a heating curve.',steps:['Move the energy marker through the curve.','Record the stage and temperature.','Identify where mcΔT applies.','Identify where ml applies.'],heads:['energy / %','stage','model T / K'],row:function(s,o){return[s.values.energy,o.label,o.temp]},gx:0,gy:2,conclusion:'Slopes correspond to temperature rise; plateaus correspond to changes of state.'},
 gasLaws:{aim:'Explore how pressure responds to changes in volume and temperature.',steps:['Hold temperature and gas amount fixed.','Change volume.','Record p and pV.','Then repeat with a different temperature.'],heads:['V / cm³','T / K','p / kPa','pV/T'],row:function(s,o){return[s.values.volume,s.values.temp,o.p,o.constant]},gx:0,gy:2,conclusion:'For a fixed gas amount, pV/T remains constant in the ideal model.'},
 idealGas:{aim:'Test the ideal-gas equation with controlled state variables.',steps:['Hold n and T fixed.','Change V.','Record p.','Check pV/(nT).'],heads:['V / m³','T / K','n / mol','p / Pa'],row:function(s,o){return[s.values.volume,s.values.temp,s.values.moles,o.p]},gx:0,gy:3,conclusion:'The model obeys pV=nRT.'},
 boylePractical:{aim:'Carry out a virtual RP8 Boyle-law investigation.',steps:['Keep temperature fixed.','Change volume slowly.','Record pressure.','Plot p against 1/V and inspect pV.'],heads:['V / cm³','1/V / cm⁻³','p / kPa','pV'],row:function(s,o){return[s.values.volume,1/s.values.volume,o.p,o.pV]},gx:1,gy:2,conclusion:'At constant temperature, p is proportional to 1/V and pV is approximately constant.'},
 charlesPractical:{aim:'Carry out a virtual RP8 Charles-law investigation.',steps:['Keep pressure fixed.','Change temperature.','Record volume.','Plot V against T(K).'],heads:['T / K','p / kPa','V / cm³','V/T'],row:function(s,o){return[s.values.temp,s.values.pressure,o.V,o.VT]},gx:0,gy:2,conclusion:'At constant pressure, volume is directly proportional to absolute temperature.'},
 brownian:{aim:'Compare molecular energy scale with the apparent irregularity of Brownian motion.',steps:['Hold tracer setup fixed.','Change temperature.','Observe the path and record mean KE scale.','Compare low and high temperatures.'],heads:['T / K','density','mean KE / J'],row:function(s,o){return[s.values.temp,s.values.density,o.meanKE]},gx:0,gy:2,conclusion:'Higher temperature corresponds to a greater molecular kinetic-energy scale and more vigorous bombardment.'},
 kineticTheory:{aim:'Connect temperature, rms speed and pressure in the kinetic-theory model.',steps:['Keep molecular mass and particle number fixed.','Change temperature.','Record crms and pressure.','Compare crms² with T.'],heads:['T / K','molecule mass / kg','crms / m s⁻¹','p / Pa'],row:function(s,o){return[s.values.temp,s.values.molecularMass,o.crms,o.p]},gx:0,gy:2,conclusion:'For fixed molecular mass, crms² is proportional to T; pressure also rises with T at fixed V and N.'}
};
function drawInvestigationGraph(rows,def){
 var c=$('#investigationCanvas');if(!c||rows.length<2)return;var sz=sizeCanvas(c,260),x=sz.ctx,w=sz.w,h=sz.h,p=40,pts=rows.map(function(r){return[Number(r[def.gx]),Number(r[def.gy])]}).filter(function(q){return q.every(Number.isFinite)});if(pts.length<2)return;
 x.clearRect(0,0,w,h);x.fillStyle='#06111d';x.fillRect(0,0,w,h);var xs=pts.map(q=>q[0]),ys=pts.map(q=>q[1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);if(xmin===xmax){xmin-=1;xmax+=1}if(ymin===ymax){ymin-=1;ymax+=1}
 var px=v=>p+(v-xmin)/(xmax-xmin)*(w-p-15),py=v=>h-p-(v-ymin)/(ymax-ymin)*(h-p-20);x.strokeStyle='#607d94';x.beginPath();x.moveTo(p,15);x.lineTo(p,h-p);x.lineTo(w-10,h-p);x.stroke();x.fillStyle='#67c7ff';pts.forEach(function(q){x.beginPath();x.arc(px(q[0]),py(q[1]),5,0,TAU);x.fill()});x.strokeStyle='#63d9a4';x.lineWidth=2;if(pts.length>1){var n=pts.length,mx=xs.reduce((a,b)=>a+b,0)/n,my=ys.reduce((a,b)=>a+b,0)/n,sxx=xs.reduce((s,v)=>s+(v-mx)*(v-mx),0),sxy=pts.reduce((s,q)=>s+(q[0]-mx)*(q[1]-my),0),m=sxx?sxy/sxx:0,b=my-m*mx;x.beginPath();x.moveTo(px(xmin),py(m*xmin+b));x.lineTo(px(xmax),py(m*xmax+b));x.stroke();}
 x.fillStyle='#9eb2c8';x.font='11px system-ui';x.fillText(def.heads[def.gx],p,h-10);x.fillText(def.heads[def.gy],p+5,27);
}
function renderInvestigation(){
 var s=st(),d=inv[s.id],rows=invRows[s.id]||[];
 $('#simWorkspaceBody').innerHTML='<div class="workspace-grid"><article class="workspace-card"><span class="eyebrow">Guided investigation</span><h3>'+d.aim+'</h3><ol class="investigation-steps">'+d.steps.map(function(x){return'<li>'+x+'</li>'}).join('')+'</ol><div class="button-row"><button class="button primary" id="recordInvestigation">Record current reading</button><button class="button" id="clearInvestigation">Clear table</button></div><div class="investigation-table"><table><thead><tr>'+d.heads.map(function(h){return'<th>'+h+'</th>'}).join('')+'</tr></thead><tbody>'+rows.map(function(r){return'<tr>'+r.map(function(v){return'<td>'+((typeof v==='number')?fmt(v):v)+'</td>'}).join('')+'</tr>'}).join('')+'</tbody></table></div><label class="field"><span>Your conclusion</span><textarea id="investigationConclusion" class="student-answer" placeholder="Describe the relationship and support it with your data..."></textarea></label><details><summary>Compare with the physics conclusion</summary><p>'+d.conclusion+'</p></details></article><aside class="workspace-card"><h3>Graph your readings</h3><canvas id="investigationCanvas" class="investigation-canvas"></canvas><p class="muted small">x: '+d.heads[d.gx]+' · y: '+d.heads[d.gy]+'</p></aside></div>';
 $('#recordInvestigation').onclick=function(){var now=st(),row=d.row(now,derived(now));invRows[s.id]=invRows[s.id]||[];invRows[s.id].push(row);if(invRows[s.id].length>18)invRows[s.id].shift();saveRows();renderInvestigation()};
 $('#clearInvestigation').onclick=function(){invRows[s.id]=[];saveRows();renderInvestigation()};
 setTimeout(function(){drawInvestigationGraph(rows,d)},20);
}

/* predictions */
var pred={
 circular:['If angular speed doubles while m and r stay fixed, what happens to centripetal force?',['It doubles','It becomes four times larger','It halves'],1,'F=mω²r, so doubling ω multiplies F by 4.','Test it by recording F, doubling ω and recording F again.'],
 shm:['At fixed frequency, if amplitude doubles, what happens to maximum speed?',['It doubles','It quadruples','It is unchanged'],0,'vmax=ωA, so vmax is proportional to amplitude.','Keep f fixed and compare two amplitudes.'],
 spring:['If mass is made four times larger at fixed k, what happens to period?',['It doubles','It quadruples','It halves'],0,'T∝√m, so √4=2.','Keep k fixed and compare m with 4m.'],
 pendulum:['If pendulum length is made four times larger, what happens to period?',['It doubles','It quadruples','It halves'],0,'T∝√L.','Keep the angle small and compare L with 4L.'],
 shmEnergy:['If SHM amplitude doubles at fixed k, what happens to total energy?',['It doubles','It quadruples','It is unchanged'],1,'E=½kA², so energy is proportional to A².','Compare total-energy readouts at A and 2A.'],
 damping:['What happens if the damping setting is increased?',['Amplitude decays faster','Amplitude decays slower','Frequency becomes zero immediately'],0,'Greater damping removes mechanical energy more quickly.','Run equal starting amplitudes with two damping values.'],
 resonance:['As driving frequency approaches natural frequency with low damping, the response generally…',['decreases','increases toward a peak','stays constant'],1,'Resonance produces a large response near the natural frequency.','Drag the driving-frequency marker toward the natural frequency.'],
 thermalParticles:['If absolute temperature doubles, mean translational KE becomes…',['half','double','four times'],1,'Mean translational KE=3/2 kT.','Compare the energy calculation at two temperatures in a 1:2 ratio.'],
 calorimetry:['At fixed P and c, doubling the sample mass changes the heating rate dT/dt how?',['doubles','halves','unchanged'],1,'dT/dt=P/(mc).','Run equal times using m and 2m.'],
 flowHeating:['At fixed P and c, doubling mass flow rate makes ΔT…',['double','half','unchanged'],1,'ΔT=P/(ṁc).','Compare two flow settings in a 1:2 ratio.'],
 heatingCurve:['During a phase-change plateau, continued energy supply makes temperature…',['rise steadily','stay approximately constant','fall'],1,'The energy changes particle arrangement/potential energy rather than mean kinetic energy.','Drag the marker along a plateau.'],
 gasLaws:['At constant temperature and gas amount, halving volume makes pressure approximately…',['half','double','four times'],1,'Boyle’s law gives p∝1/V.','Hold T and amount fixed, then compare V and V/2.'],
 idealGas:['At fixed n and V, doubling absolute temperature makes pressure…',['half','double','four times'],1,'p=nRT/V, so p∝T.','Keep n and V fixed and compare two temperatures.'],
 boylePractical:['For good Boyle-law data, p plotted against 1/V should be…',['a straight line','a horizontal line','a circle'],0,'p=K(1/V) at constant temperature.','Record several readings and use the investigation graph.'],
 charlesPractical:['At constant pressure, if absolute temperature increases by 20%, ideal gas volume should…',['increase by 20%','decrease by 20%','stay fixed'],0,'Charles’s law gives V∝T.','Use two temperatures with a 1:1.2 ratio.'],
 brownian:['Increasing temperature should make Brownian motion appear generally…',['more vigorous','less vigorous','perfectly periodic'],0,'Higher molecular kinetic energy produces more energetic random bombardment.','Compare the tracer path at low and high T.'],
 kineticTheory:['For the same gas, if T becomes four times larger, crms becomes…',['2 times larger','4 times larger','16 times larger'],0,'crms∝√T.','Compare T with 4T using the rms-speed readout.']
};
function renderPredict(){
 var s=st(),p=pred[s.id];$('#simWorkspaceBody').innerHTML='<div class="workspace-grid"><article class="workspace-card"><span class="eyebrow">Predict before testing</span><h3 class="workspace-question">'+p[0]+'</h3><div class="prediction-options">'+p[1].map(function(x,i){return'<button class="button" data-pred="'+i+'">'+x+'</button>'}).join('')+'</div><div id="predResult" class="prediction-result"></div></article><aside class="workspace-card"><h3>Then test it</h3><p>'+p[4]+'</p><p class="muted">Make your prediction first. The point is to use the simulation as evidence, not to guess after seeing the result.</p></aside></div>';$$('[data-pred]').forEach(function(b){b.onclick=function(){var ok=+b.dataset.pred===p[2];$$('[data-pred]').forEach(function(x){x.disabled=true});b.classList.add(ok?'correct':'wrong');$$('[data-pred]')[p[2]].classList.add('correct');$('#predResult').className='workspace-feedback '+(ok?'good':'bad');$('#predResult').textContent=(ok?'Correct. ':'Not quite. ')+p[3]}})};
function renderWorkspace(){
 $$('[data-sim-workspace]').forEach(function(b){b.classList.toggle('active',b.dataset.simWorkspace===workspace)});
 if(workspace==='graph')renderGraph();else if(workspace==='calculate')renderCalculate();else if(workspace==='investigate')renderInvestigation();else renderPredict();
}
function bindWorkspace(){
 $$('[data-sim-workspace]').forEach(function(b){b.onclick=function(){workspace=b.dataset.simWorkspace;renderWorkspace()}});
}

/* switching and sampling */
function onSwitch(){
 var s=st();if(!s)return;laps=[];measureStart=measureEnd=null;if(tool!=='off')setTool(tool);questionCache[s.id]=null;syncClock();renderWorkspace();
}
function init(){
 if(!window.FM_SIM||!$('#simWorkspaceBody')){setTimeout(init,30);return}
 bindTransport();bindMeasurement();bindWorkspace();setTool('off');syncClock();collectSample();renderWorkspace();
 window.addEventListener('fm-sim-switched',onSwitch);
 setInterval(function(){syncClock();collectSample();},120);
}
init();
})();