(() => {
  const D = window.MATERIALS_DATA;
  if (!D) return;
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const datasets = new Map();
  let compareMode = false;

  function activeSim(){
    const label=$('.sim-tab.active')?.textContent?.trim();
    return D.sims.find(s=>s.title===label)||D.sims[0];
  }
  function values(){
    const out={};
    $$('#simControls [data-key]').forEach(el=>{out[el.dataset.key]=el.tagName==='SELECT'?el.value:+el.value;});
    return out;
  }
  function stressModel(material,e){
    const p={Steel:{E:200,breakS:720,breakE:.055,duct:.035},Copper:{E:120,breakS:350,breakE:.10,duct:.08},Glass:{E:70,breakS:90,breakE:.0013,duct:0},Polymer:{E:3,breakS:65,breakE:.12,duct:.10}}[material]||{E:200,breakS:720,breakE:.055,duct:.035};
    if(e>p.breakE) return {stress:0, fractured:true, ...p};
    let stress=Math.min(p.E*1000*e,p.breakS*(.72+.28*Math.min(1,e/Math.max(p.breakE,.001))));
    if(p.duct>0&&e>p.breakE-p.duct) stress*=.92+.08*Math.sin((e/p.breakE)*Math.PI);
    return {stress,fractured:false,...p};
  }
  function compute(id,v){
    if(id==='density'){
      const rho=v.mass/(v.volume*1e-6);
      return {x:v.volume,y:rho,xLabel:'volume / cm³',yLabel:'density / kg m⁻³',metrics:[['Mass',`${v.mass.toFixed(2)} kg`],['Volume',`${v.volume.toFixed(0)} cm³`],['Density',`${rho.toExponential(3)} kg m⁻³`]],status:rho>7000?'high-density sample':rho>2000?'medium-density sample':'low-density sample'};
    }
    if(id==='hooke'){
      const x=v.force<=v.limit?v.force/v.k:(v.limit/v.k)+(v.force-v.limit)/v.k*1.9;
      const ratio=v.force/Math.max(x,1e-9);
      return {x,y:v.force,xLabel:'extension / m',yLabel:'force / N',metrics:[['Extension',`${(x*1000).toFixed(2)} mm`],['F/ΔL',`${ratio.toFixed(0)} N m⁻¹`],['Set k',`${v.k.toFixed(0)} N m⁻¹`]],status:v.force<=v.limit?'Hookean / proportional region':'beyond proportional limit'};
    }
    if(id==='forceExtension'){
      const elasticExt=Math.min(v.force,v.elastic)/220;
      const plastic=Math.max(0,(v.force-v.elastic)*.0025);
      const total=elasticExt+plastic;
      return {x:total*1000,y:v.force,xLabel:'extension / mm',yLabel:'force / N',metrics:[['Total extension',`${(total*1000).toFixed(2)} mm`],['Elastic component',`${(elasticExt*1000).toFixed(2)} mm`],['Plastic component',`${(plastic*1000).toFixed(2)} mm`]],status:v.force>v.elastic?'plastic deformation likely':'elastic region'};
    }
    if(id==='energy'){
      const F=v.k*v.extension,E=.5*v.k*v.extension*v.extension;
      return {x:v.extension,y:F,xLabel:'extension / m',yLabel:'force / N',metrics:[['Force',`${F.toFixed(2)} N`],['Stored energy',`${E.toFixed(4)} J`],['Spring constant',`${v.k.toFixed(0)} N m⁻¹`]],status:'area under F–x graph = stored energy'};
    }
    if(id==='stressStrain'){
      const r=stressModel(v.material,v.strain);
      return {x:v.strain,y:r.stress,xLabel:'strain',yLabel:'stress / MPa',metrics:[['Material',v.material],['Stress',r.fractured?'fractured':`${r.stress.toFixed(1)} MPa`],['Young modulus',`${r.E} GPa`],['Fracture strain',r.breakE.toFixed(4)]],status:r.fractured?'fractured':v.strain>r.breakE-r.duct&&r.duct>0?'plastic / ductile region':'elastic / rising stress'};
    }
    if(id==='young'){
      const E=v.E*1e9,d=v.diameter*1e-3,A=Math.PI*d*d/4,ext=v.force*v.length/(A*E),stress=v.force/A,strain=ext/v.length;
      return {x:strain,y:stress/1e6,xLabel:'strain',yLabel:'stress / MPa',metrics:[['Area',`${A.toExponential(3)} m²`],['Extension',`${(ext*1000).toFixed(3)} mm`],['Stress',`${(stress/1e6).toFixed(1)} MPa`],['Strain',strain.toExponential(3)]],status:`linear elastic model · E = ${v.E} GPa`};
    }
    return {x:0,y:0,xLabel:'x',yLabel:'y',metrics:[],status:''};
  }
  function dataset(id){if(!datasets.has(id))datasets.set(id,[]);return datasets.get(id);}
  function snapshot(){
    const s=activeSim(),v=values(),c=compute(s.id,v);dataset(s.id).push({x:c.x,y:c.y,values:{...v}});render();
  }
  function autoSweep(){
    const s=activeSim(),v=values(),arr=[];
    const add=(vv)=>{const c=compute(s.id,vv);arr.push({x:c.x,y:c.y,values:{...vv}});};
    if(s.id==='density') for(let volume=80;volume<=1000;volume+=80)add({...v,volume});
    if(s.id==='hooke') for(let force=0;force<=20;force+=1)add({...v,force});
    if(s.id==='forceExtension') for(let force=0;force<=30;force+=1)add({...v,force});
    if(s.id==='energy') for(let extension=0;extension<=.2;extension+=.01)add({...v,extension:+extension.toFixed(3)});
    if(s.id==='stressStrain') for(let strain=0;strain<=.12;strain+=.002)add({...v,strain:+strain.toFixed(4)});
    if(s.id==='young') for(let force=5;force<=100;force+=5)add({...v,force});
    datasets.set(s.id,arr);compareMode=false;render();
  }
  function compareMaterials(){
    if(activeSim().id!=='stressStrain') return;
    compareMode=true;render();
  }
  function clearData(){datasets.set(activeSim().id,[]);compareMode=false;render();}
  function exportCsv(){
    const s=activeSim(),arr=dataset(s.id);if(!arr.length){alert('Record or auto-sweep some data first.');return;}
    const keys=[...new Set(arr.flatMap(p=>Object.keys(p.values)))];
    const rows=[['x','y',...keys].join(','),...arr.map(p=>[p.x,p.y,...keys.map(k=>JSON.stringify(p.values[k]??''))].join(','))];
    const blob=new Blob([rows.join('\n')],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`materials-${s.id}-simulation.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),500);
  }
  function challenge(){
    const s=activeSim();
    const map={
      density:'Predict how density changes if volume doubles while mass stays fixed. Test your prediction and explain using ρ = m/V.',
      hooke:'Collect at least five points below the proportional limit. Use the graph to estimate k, then deliberately move beyond the limit and describe the change.',
      forceExtension:'Find a load that remains elastic, then one that produces a plastic component. State the experimental evidence for permanent deformation.',
      energy:'Record energy at extension x and 2x. Calculate the ratio and explain why it should be close to four.',
      stressStrain:'Compare two materials. Identify which is stiffer, which survives to larger strain, and which reaches the greater stress before fracture.',
      young:'Change length, diameter and Young modulus one at a time. Explain which are sample properties and which is a material property.'
    };
    $('#simChallengeText').textContent=map[s.id]||s.mission?.conclusion||'Make a prediction, test it, and explain the evidence.';
  }
  function niceMax(v){if(!Number.isFinite(v)||v<=0)return 1;const p=10**Math.floor(Math.log10(v));return Math.ceil(v/p*1.15)*p;}
  function plotSeries(ctx,series,area,color,label,xMax,yMax){
    const {x0,y0,w,h}=area;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2.3;ctx.beginPath();
    series.forEach((p,i)=>{const x=x0+(p.x/xMax)*w,y=y0-(p.y/yMax)*h;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
    series.filter((_,i)=>i%Math.max(1,Math.floor(series.length/20))===0).forEach(p=>{const x=x0+(p.x/xMax)*w,y=y0-(p.y/yMax)*h;ctx.beginPath();ctx.arc(x,y,3.5,0,Math.PI*2);ctx.fill();});
    if(label){ctx.font='12px system-ui';ctx.fillText(label,x0+w-95,y0-h+18);}
  }
  function draw(){
    const canvas=$('#simAnalysisCanvas');if(!canvas)return;const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(420,rect.width*dpr);canvas.height=Math.max(300,rect.height*dpr);const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);const W=rect.width,H=rect.height;ctx.clearRect(0,0,W,H);ctx.fillStyle='#081724';ctx.fillRect(0,0,W,H);
    const s=activeSim(),current=compute(s.id,values());const area={x0:68,y0:H-52,w:W-100,h:H-90};
    ctx.strokeStyle='#345168';ctx.lineWidth=1;for(let i=0;i<=5;i++){const x=area.x0+area.w*i/5,y=area.y0-area.h*i/5;ctx.beginPath();ctx.moveTo(x,area.y0);ctx.lineTo(x,area.y0-area.h);ctx.stroke();ctx.beginPath();ctx.moveTo(area.x0,y);ctx.lineTo(area.x0+area.w,y);ctx.stroke();}
    let series=dataset(s.id),seriesSet=[];
    if(compareMode&&s.id==='stressStrain'){
      const colors=['#6fdbae','#8cb8ff','#ff9f86','#ffd36f'];['Steel','Copper','Glass','Polymer'].forEach((m,idx)=>{const pts=[];for(let e=0;e<=.12;e+=.002){const r=stressModel(m,e);if(r.fractured)break;pts.push({x:e,y:r.stress});}seriesSet.push({pts,color:colors[idx],label:m});});
    } else {
      if(!series.length)series=[{x:current.x,y:current.y}];seriesSet=[{pts:series,color:'#6fdbae',label:''}];
    }
    const all=seriesSet.flatMap(s=>s.pts);const xMax=niceMax(Math.max(current.x,...all.map(p=>p.x),1e-9)),yMax=niceMax(Math.max(current.y,...all.map(p=>p.y),1e-9));
    seriesSet.forEach(sx=>plotSeries(ctx,sx.pts,area,sx.color,sx.label,xMax,yMax));
    ctx.strokeStyle='#9cb0c1';ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(area.x0,area.y0-area.h);ctx.lineTo(area.x0,area.y0);ctx.lineTo(area.x0+area.w,area.y0);ctx.stroke();
    ctx.fillStyle='#b7c9d8';ctx.font='12px system-ui';ctx.fillText(current.xLabel,area.x0+area.w/2-40,H-14);ctx.save();ctx.translate(18,area.y0-area.h/2);ctx.rotate(-Math.PI/2);ctx.fillText(current.yLabel,0,0);ctx.restore();ctx.fillText(`0`,area.x0-12,area.y0+18);ctx.fillText(xMax.toPrecision(3),area.x0+area.w-30,area.y0+18);ctx.fillText(yMax.toPrecision(3),area.x0-58,area.y0-area.h+5);
  }
  function render(){
    const s=activeSim(),c=compute(s.id,values());
    $('#simMetrics').innerHTML=c.metrics.map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join('');
    $('#simRegionBadge').textContent=c.status;
    $('#compareMaterials').hidden=s.id!=='stressStrain';
    const arr=dataset(s.id);$('#simDataCount').textContent=`${arr.length} recorded point${arr.length===1?'':'s'}`;
    $('#simDataRows').innerHTML=arr.slice(-8).reverse().map((p,i)=>`<tr><td>${arr.length-i}</td><td>${Number(p.x).toPrecision(4)}</td><td>${Number(p.y).toPrecision(4)}</td></tr>`).join('')||'<tr><td colspan="3" class="muted">No recorded data yet.</td></tr>';
    draw();challenge();
  }
  function install(){
    const lab=$('#view-lab .lab-layout');if(!lab||$('#simUpgradePanel'))return;
    const callout=document.createElement('div');callout.id='simRegionBadge';callout.className='sim-region-badge';$('.viewer-wrap')?.appendChild(callout);
    const panel=document.createElement('section');panel.id='simUpgradePanel';panel.className='panel sim-upgrade-panel';panel.innerHTML=`
      <div class="section-head compact"><div><span class="eyebrow">Investigation mode</span><h2>Live graph & data logger</h2></div><p class="muted">Record points from the model, run a theoretical sweep and use the graph as evidence in your explanation.</p></div>
      <div class="sim-metrics" id="simMetrics"></div>
      <div class="sim-analysis-grid">
        <div><canvas id="simAnalysisCanvas" aria-label="Live simulation analysis graph"></canvas><div class="graph-readout" id="graphPointerReadout">Move over the graph to inspect relative position.</div></div>
        <div class="sim-data-side"><div class="button-row"><button class="button primary" id="recordSimPoint">Record point</button><button class="button" id="autoSweepSim">Auto sweep</button><button class="button" id="compareMaterials">Compare materials</button><button class="button" id="clearSimData">Clear</button><button class="button" id="exportSimData">Export CSV</button></div><strong id="simDataCount">0 recorded points</strong><div class="table-scroll"><table class="data-table"><thead><tr><th>#</th><th>x</th><th>y</th></tr></thead><tbody id="simDataRows"></tbody></table></div><div class="sim-challenge"><strong>Investigation challenge</strong><p id="simChallengeText"></p></div></div>
      </div>`;
    lab.insertAdjacentElement('afterend',panel);
    $('#recordSimPoint').onclick=snapshot;$('#autoSweepSim').onclick=autoSweep;$('#compareMaterials').onclick=compareMaterials;$('#clearSimData').onclick=clearData;$('#exportSimData').onclick=exportCsv;
    $('#simControls').addEventListener('input',()=>requestAnimationFrame(render));$('#simControls').addEventListener('change',()=>requestAnimationFrame(render));$('#simTabs').addEventListener('click',()=>setTimeout(()=>{compareMode=false;render();},0));
    $('#simAnalysisCanvas').addEventListener('mousemove',e=>{const r=e.currentTarget.getBoundingClientRect();$('#graphPointerReadout').textContent=`Graph position: ${((e.clientX-r.left)/r.width*100).toFixed(0)}% across · ${((1-(e.clientY-r.top)/r.height)*100).toFixed(0)}% up`;});
    render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install);else install();
})();
