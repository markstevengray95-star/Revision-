(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=(v,n=3)=>Number.isFinite(v)?(Math.abs(v)>=1e5||Math.abs(v)<1e-3&&v!==0?v.toExponential(n):Number(v).toFixed(n).replace(/0+$/,'').replace(/\.$/,'')):'—';
  const data=new Map();
  let running=false, compare=['Steel','Copper'], instrument={zero:.006,diameters:[],lengths:[],extensions:[]};

  const props={
    Steel:{E:200,breakS:720,breakE:.055,yieldE:.0025},
    Copper:{E:120,breakS:350,breakE:.10,yieldE:.0035},
    Glass:{E:70,breakS:90,breakE:.0013,yieldE:.0013},
    Polymer:{E:3,breakS:65,breakE:.12,yieldE:.025}
  };

  const missions={
    hooke:{title:'Determine spring constant from 3D data',steps:['Set the spring constant to an unknown-looking value.','Record at least five force–extension points below the proportional limit.','Use a large gradient triangle on the live graph.','Increase force beyond the proportional limit and explain how the graph changes.'],target:'gradient of F against extension = k'},
    deformation:{title:'Prove the difference between elastic and plastic deformation',steps:['Load the specimen to a small strain.','Return the strain control towards zero and note whether the shape recovers.','Repeat beyond the model yield region.','Explain what permanent set means and why curved loading alone is not proof of plastic deformation.'],target:'unloading evidence distinguishes reversible from permanent deformation'},
    stress:{title:'Compare material properties from stress–strain curves',steps:['Choose two materials.','Run a slow sweep for each.','Compare initial gradient, breaking stress and fracture strain.','Use the correct words: stiff, strong, ductile and brittle.'],target:'different graph features describe different material properties'},
    young:{title:'Carry out a virtual Young modulus investigation',steps:['Measure diameter several times with the micrometer tool.','Set original length and record at least five loads.','Use the live table to calculate stress and strain.','Find the gradient and evaluate the dominant uncertainty.'],target:'gradient of stress against strain = Young modulus'},
    density:{title:'Separate mass, volume and density',steps:['Keep volume fixed and change mass.','Keep mass fixed and change volume.','Record several points.','Explain why density is a material property but mass is not.'],target:'ρ = m/V'},
    energy:{title:'Test the square relationship for elastic energy',steps:['Record energy at extension x.','Double extension without changing k.','Compare the two energy values.','Explain why the area under the force–extension graph gives work done.'],target:'E = ½kx²'}
  };

  function sceneId(){return $('[data-three-scene].active')?.dataset.threeScene||'hooke';}
  function values(){const o={};$$('#threeControlsV5 [data-three-key]').forEach(el=>o[el.dataset.threeKey]=el.tagName==='SELECT'?el.value:+el.value);return o;}
  function setValue(key,val){const el=$(`#threeControlsV5 [data-three-key="${key}"]`);if(!el)return;el.value=val;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}
  function setScene(id){const b=$(`[data-three-scene="${id}"]`);b?.click();}

  function model(id,v){
    if(id==='hooke'){
      const x=v.force<=v.propLimit?v.force/v.k:(v.propLimit/v.k)+(v.force-v.propLimit)/v.k*1.85;
      return {x,y:v.force,xLabel:'extension / m',yLabel:'force / N',metrics:[['Force',`${fmt(v.force,1)} N`],['Extension',`${fmt(x*1000,2)} mm`],['F/ΔL',`${fmt(v.force/Math.max(x,1e-9),0)} N m⁻¹`],['Region',v.force<=v.propLimit?'proportional':'non-proportional']],row:{force:v.force,extension:x}};
    }
    if(id==='deformation'){
      const p=props[v.material]||props.Steel,plastic=Math.max(0,v.strain-p.yieldE),stress=v.strain>p.breakE?0:Math.min(p.E*1000*v.strain,p.breakS);
      return {x:v.strain,y:stress,xLabel:'strain',yLabel:'stress / MPa',metrics:[['Material',v.material],['Strain',fmt(v.strain,4)],['Stress',v.strain>p.breakE?'fractured':`${fmt(stress,1)} MPa`],['Plastic component',fmt(plastic,4)]],row:{material:v.material,strain:v.strain,stress}};
    }
    if(id==='stress'){
      const p=props[v.material]||props.Steel,stress=v.strain>p.breakE?0:Math.min(p.E*1000*v.strain,p.breakS*(.82+.18*Math.min(1,v.strain/p.breakE)));
      return {x:v.strain,y:stress,xLabel:'strain',yLabel:'stress / MPa',metrics:[['Material',v.material],['Young modulus',`${p.E} GPa`],['Stress',v.strain>p.breakE?'fractured':`${fmt(stress,1)} MPa`],['Fracture strain',fmt(p.breakE,4)]],row:{material:v.material,strain:v.strain,stress}};
    }
    if(id==='young'){
      const E=v.young*1e9,d=v.diameter*1e-3,A=Math.PI*d*d/4,F=v.mass*9.81,x=F*v.length/(A*E),stress=F/A,strain=x/v.length;
      return {x:strain,y:stress/1e6,xLabel:'strain',yLabel:'stress / MPa',metrics:[['Load',`${fmt(F,2)} N`],['Extension',`${fmt(x*1000,3)} mm`],['Stress',`${fmt(stress/1e6,1)} MPa`],['Strain',fmt(strain,6)],['Area',`${A.toExponential(3)} m²`]],row:{mass:v.mass,force:F,diameter:v.diameter,length:v.length,extension:x,stress,strain}};
    }
    if(id==='density'){
      const rho=v.densityMass/(v.densityVolume*1e-6);
      return {x:v.densityVolume,y:rho,xLabel:'volume / cm³',yLabel:'density / kg m⁻³',metrics:[['Mass',`${fmt(v.densityMass,2)} kg`],['Volume',`${fmt(v.densityVolume,0)} cm³`],['Density',`${rho.toExponential(3)} kg m⁻³`]],row:{mass:v.densityMass,volume:v.densityVolume,density:rho}};
    }
    const F=v.energyK*v.energyX,E=.5*v.energyK*v.energyX*v.energyX;
    return {x:v.energyX,y:F,xLabel:'extension / m',yLabel:'force / N',metrics:[['Extension',`${fmt(v.energyX,3)} m`],['Force',`${fmt(F,2)} N`],['Stored energy',`${fmt(E,4)} J`],['Spring constant',`${fmt(v.energyK,0)} N m⁻¹`]],row:{extension:v.energyX,force:F,energy:E,k:v.energyK}};
  }

  function rows(id){if(!data.has(id))data.set(id,[]);return data.get(id);}
  function record(){const id=sceneId(),m=model(id,values());rows(id).push({x:m.x,y:m.y,...m.row});if(rows(id).length>60)rows(id).shift();render();}
  function clear(){data.set(sceneId(),[]);render();}
  function exportCsv(){const id=sceneId(),r=rows(id);if(!r.length){alert('Record some 3D data first.');return;}const keys=[...new Set(r.flatMap(x=>Object.keys(x)))],csv=[keys.join(','),...r.map(x=>keys.map(k=>JSON.stringify(x[k]??'')).join(','))].join('\n');const blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`materials-3d-${id}-data.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);}

  function autoSweep(){if(running)return;running=true;const id=sceneId(),seq=[];
    if(id==='hooke')for(let f=0;f<=21;f+=1.5)seq.push(['force',f]);
    if(id==='deformation'||id==='stress')for(let e=0;e<=.12;e+=.004)seq.push(['strain',+e.toFixed(4)]);
    if(id==='young')for(let m=.5;m<=7;m+=.5)seq.push(['mass',m]);
    if(id==='density')for(let v=100;v<=800;v+=50)seq.push(['densityVolume',v]);
    if(id==='energy')for(let x=0;x<=.2;x+=.01)seq.push(['energyX',+x.toFixed(3)]);
    data.set(id,[]);let i=0;const step=()=>{if(!running||i>=seq.length){running=false;render();return;}const [k,v]=seq[i++];setValue(k,v);record();setTimeout(step,90);};step();
  }
  function stopSweep(){running=false;}

  function slowMotion(){if(running)return;running=true;const id=sceneId(),start=performance.now(),duration=5500;
    const tick=t=>{if(!running)return;const p=clamp((t-start)/duration,0,1),ease=.5-.5*Math.cos(Math.PI*p);
      if(id==='hooke')setValue('force',2+ease*18);
      else if(id==='young')setValue('mass',.5+ease*6.5);
      else if(id==='energy')setValue('energyX',.01+ease*.18);
      else if(id==='deformation'||id==='stress')setValue('strain',.001+ease*.11);
      else setValue('densityMass',.5+ease*4.2);
      if(Math.round(p*100)%5===0)record();
      if(p<1)requestAnimationFrame(tick);else{running=false;render();}
    };requestAnimationFrame(tick);
  }

  function regression(arr){if(arr.length<2)return null;const n=arr.length,sx=arr.reduce((s,p)=>s+p.x,0),sy=arr.reduce((s,p)=>s+p.y,0),sxx=arr.reduce((s,p)=>s+p.x*p.x,0),sxy=arr.reduce((s,p)=>s+p.x*p.y,0),den=n*sxx-sx*sx;if(Math.abs(den)<1e-20)return null;const m=(n*sxy-sx*sy)/den,c=(sy-m*sx)/n;return {m,c};}
  function graph(){const c=$('#threeGraphV6');if(!c)return;const id=sceneId(),r=rows(id),current=model(id,values()),ctx=c.getContext('2d'),W=c.clientWidth||700,H=320,dpr=Math.min(devicePixelRatio||1,2);c.width=W*dpr;c.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.fillStyle='#07131e';ctx.fillRect(0,0,W,H);const all=r.length?r:[{x:current.x,y:current.y}],xMax=Math.max(...all.map(p=>p.x),current.x,1e-9)*1.1,yMax=Math.max(...all.map(p=>p.y),current.y,1e-9)*1.12,x0=62,y0=H-46,gw=W-92,gh=H-78;ctx.strokeStyle='#355267';ctx.lineWidth=1;for(let i=0;i<=5;i++){const x=x0+gw*i/5,y=y0-gh*i/5;ctx.beginPath();ctx.moveTo(x,y0);ctx.lineTo(x,y0-gh);ctx.stroke();ctx.beginPath();ctx.moveTo(x0,y);ctx.lineTo(x0+gw,y);ctx.stroke();}ctx.strokeStyle='#8ca7b9';ctx.beginPath();ctx.moveTo(x0,y0-gh);ctx.lineTo(x0,y0);ctx.lineTo(x0+gw,y0);ctx.stroke();ctx.fillStyle='#bed1dd';ctx.font='12px system-ui';ctx.fillText(current.xLabel,x0+gw/2-35,H-12);ctx.save();ctx.translate(15,y0-gh/2);ctx.rotate(-Math.PI/2);ctx.fillText(current.yLabel,0,0);ctx.restore();
    if(id==='stress'&&$('#compare3DV6')?.checked){const colors=['#67d9ad','#8bb8ff'];compare.forEach((mat,idx)=>{const p=props[mat],pts=[];for(let e=0;e<=p.breakE;e+=Math.max(.0005,p.breakE/80)){const s=Math.min(p.E*1000*e,p.breakS*(.82+.18*Math.min(1,e/p.breakE)));pts.push({x:e,y:s});}drawSeries(ctx,pts,x0,y0,gw,gh,xMax,yMax,colors[idx]);ctx.fillStyle=colors[idx];ctx.fillText(mat,W-110,24+idx*17);});}
    drawSeries(ctx,r,x0,y0,gw,gh,xMax,yMax,'#66d9ad',true);
    const reg=regression(r.filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));if(reg&&r.length>=3){const p1={x:0,y:reg.c},p2={x:xMax,y:reg.m*xMax+reg.c};drawSeries(ctx,[p1,p2],x0,y0,gw,gh,xMax,yMax,'#ffd36f');ctx.fillStyle='#ffd36f';ctx.fillText(`best-fit gradient ≈ ${reg.m.toExponential(3)}`,x0+12,22);}
  }
  function drawSeries(ctx,pts,x0,y0,gw,gh,xMax,yMax,color,points=false){if(!pts.length)return;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2.4;ctx.beginPath();pts.forEach((p,i)=>{const x=x0+p.x/xMax*gw,y=y0-p.y/yMax*gh;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();if(points)pts.forEach(p=>{ctx.beginPath();ctx.arc(x0+p.x/xMax*gw,y0-p.y/yMax*gh,3.5,0,Math.PI*2);ctx.fill();});}

  function instrumentPanel(){const id=sceneId(),box=$('#threeInstrumentV6');if(!box)return;if(id!=='young'){box.innerHTML='<p class="muted">Switch to <strong>Young modulus / RP4</strong> to use the micrometer, length and extension measurement tools.</p>';return;}const v=values(),corr=instrument.diameters.length?instrument.diameters.reduce((a,b)=>a+b,0)/instrument.diameters.length:null;box.innerHTML=`<div class="instrument-grid-v6"><div class="micrometer-v6"><div class="micro-frame-v6"></div><div class="micro-anvil-v6"></div><div class="micro-spindle-v6" style="width:${54+v.diameter*32}px"></div><div class="micro-thimble-v6"></div><div class="micro-wire-v6"></div></div><div><div class="instrument-readout-v6"><span>model diameter</span><strong>${v.diameter.toFixed(3)} mm</strong></div><div class="instrument-readout-v6"><span>zero error</span><strong>${instrument.zero>=0?'+':''}${instrument.zero.toFixed(3)} mm</strong></div><div class="button-row"><button class="button" id="zeroMicroV6">Check zero</button><button class="button primary" id="readMicroV6">Take micrometer reading</button></div></div></div><div class="repeat-readings-v6">${instrument.diameters.map((d,i)=>`<span>${i+1}: ${d.toFixed(3)} mm</span>`).join('')||'<span class="muted">Take repeated diameter readings.</span>'}</div>${corr?`<div class="feedback good"><strong>Corrected mean diameter = ${corr.toFixed(3)} mm</strong><br>Use repeated positions/orientations because area depends on d².</div>`:''}`;$('#zeroMicroV6').onclick=()=>alert(`Micrometer closes at ${instrument.zero>=0?'+':''}${instrument.zero.toFixed(3)} mm. Subtract this zero error from raw readings.`);$('#readMicroV6').onclick=()=>{const raw=v.diameter+instrument.zero+(Math.random()-.5)*.008,corrected=raw-instrument.zero;instrument.diameters.push(corrected);instrument.diameters=instrument.diameters.slice(-8);instrumentPanel();};}

  function renderMission(){const id=sceneId(),m=missions[id],el=$('#threeMissionV6');if(!el)return;el.innerHTML=`<span class="eyebrow">Guided 3D investigation</span><h3>${m.title}</h3><ol>${m.steps.map(x=>`<li>${x}</li>`).join('')}</ol><div class="target-v6"><strong>Physics target:</strong> ${m.target}</div>`;}
  function render(){const id=sceneId(),m=model(id,values()),r=rows(id);$('#threeMetricsV6').innerHTML=m.metrics.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');$('#threeRowsV6').innerHTML=r.slice(-10).reverse().map((p,i)=>`<tr><td>${r.length-i}</td><td>${fmt(p.x,5)}</td><td>${fmt(p.y,5)}</td></tr>`).join('')||'<tr><td colspan="3" class="muted">No data logged yet.</td></tr>';$('#threeCountV6').textContent=`${r.length} point${r.length===1?'':'s'} logged`;const show=id==='stress';$('#compareWrapV6').hidden=!show;graph();renderMission();instrumentPanel();}

  function wire(){
    $('#record3DV6').onclick=record;$('#sweep3DV6').onclick=autoSweep;$('#slow3DV6').onclick=slowMotion;$('#stop3DV6').onclick=stopSweep;$('#clear3DV6').onclick=clear;$('#export3DV6').onclick=exportCsv;
    $('#compare3DV6').onchange=graph;$('#matA3DV6').onchange=e=>{compare[0]=e.target.value;graph()};$('#matB3DV6').onchange=e=>{compare[1]=e.target.value;graph()};
    $('#threeControlsV5').addEventListener('input',()=>requestAnimationFrame(render));$('#threeControlsV5').addEventListener('change',()=>requestAnimationFrame(render));
    $('.scene-nav-v5')?.addEventListener('click',()=>setTimeout(render,30));
    const stage=$('#threeStageV5');stage?.addEventListener('pointerup',()=>setTimeout(render,20));stage?.addEventListener('wheel',()=>requestAnimationFrame(render),{passive:true});
    window.addEventListener('resize',()=>requestAnimationFrame(graph));
  }

  function install(){const lab=$('#threeLabV5');if(!lab||$('#threeExperimentV6'))return;const sec=document.createElement('section');sec.id='threeExperimentV6';sec.className='three-experiment-v6';sec.innerHTML=`<div class="section-head"><div><span class="eyebrow">v6 · 3D experiment engine</span><h2>Measure, graph and analyse the 3D apparatus</h2></div><p class="muted">The graph and data table are synchronised with the controls and direct 3D manipulation above.</p></div><div class="three-metrics-v6" id="threeMetricsV6"></div><div class="three-analysis-grid-v6"><article class="panel pad"><div class="button-row"><button class="button primary" id="record3DV6">Record 3D reading</button><button class="button" id="sweep3DV6">Auto sweep</button><button class="button" id="slow3DV6">Slow-motion load</button><button class="button" id="stop3DV6">Stop</button><button class="button" id="clear3DV6">Clear</button><button class="button" id="export3DV6">CSV</button></div><canvas id="threeGraphV6" height="320"></canvas><div id="compareWrapV6" class="compare-row-v6" hidden><label><input type="checkbox" id="compare3DV6"> overlay material comparison</label><select id="matA3DV6"><option>Steel</option><option>Copper</option><option>Glass</option><option>Polymer</option></select><select id="matB3DV6"><option>Copper</option><option>Steel</option><option>Glass</option><option>Polymer</option></select></div></article><aside class="panel pad"><div id="threeMissionV6"></div><div class="table-scroll"><div class="progress-head"><strong id="threeCountV6">0 points logged</strong></div><table class="data-table"><thead><tr><th>#</th><th>x</th><th>y</th></tr></thead><tbody id="threeRowsV6"></tbody></table></div></aside></div><article class="panel pad instrument-panel-v6"><span class="eyebrow">Real measurement mode</span><h3>Micrometer and RP4 measurement practice</h3><div id="threeInstrumentV6"></div></article>`;lab.insertAdjacentElement('afterend',sec);wire();render();}

  const boot=()=>{const wait=()=>{if($('#threeLabV5')&&$('#threeControlsV5'))install();else setTimeout(wait,120)};wait();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();