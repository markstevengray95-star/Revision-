
(() => {
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleLearningToolsV1';
  const H=6.62607015e-34, E=1.602176634e-19, ME=9.1093837015e-31, C=299792458, K=8.9875517923e9;

  const particleDB={
    proton:{name:'Proton',symbol:'p',charge:'+1 e',mass:'1.673 × 10⁻²⁷ kg',rest:'938.3 MeV',family:'Hadron → baryon',B:'+1',L:'0',quarks:'uud',anti:'Antiproton p̄'},
    neutron:{name:'Neutron',symbol:'n',charge:'0',mass:'1.675 × 10⁻²⁷ kg',rest:'939.6 MeV',family:'Hadron → baryon',B:'+1',L:'0',quarks:'udd',anti:'Antineutron n̄'},
    electron:{name:'Electron',symbol:'e⁻',charge:'−1 e',mass:'9.11 × 10⁻³¹ kg',rest:'0.511 MeV',family:'Lepton',B:'0',L:'electron lepton number +1',quarks:'none — fundamental lepton',anti:'Positron e⁺'},
    positron:{name:'Positron',symbol:'e⁺',charge:'+1 e',mass:'9.11 × 10⁻³¹ kg',rest:'0.511 MeV',family:'Antilepton',B:'0',L:'electron lepton number −1',quarks:'none — fundamental antilepton',anti:'Electron e⁻'},
    photon:{name:'Photon',symbol:'γ',charge:'0',mass:'zero rest mass',rest:'E = hf',family:'Gauge boson / EM quantum',B:'0',L:'0',quarks:'none',anti:'Photon is its own antiparticle'},
    neutrino:{name:'Electron neutrino',symbol:'νₑ',charge:'0',mass:'very small',rest:'not required numerically here',family:'Lepton',B:'0',L:'electron lepton number +1',quarks:'none',anti:'Electron antineutrino ν̄ₑ'},
    antineutrino:{name:'Electron antineutrino',symbol:'ν̄ₑ',charge:'0',mass:'very small',rest:'not required numerically here',family:'Antilepton',B:'0',L:'electron lepton number −1',quarks:'none',anti:'Electron neutrino νₑ'},
    muon:{name:'Muon',symbol:'μ⁻',charge:'−1 e',mass:'1.88 × 10⁻²⁸ kg',rest:'105.7 MeV',family:'Lepton',B:'0',L:'muon lepton number +1',quarks:'none',anti:'Antimuon μ⁺'},
    alpha:{name:'Alpha particle',symbol:'α / ⁴₂He',charge:'+2 e',mass:'≈ 6.64 × 10⁻²⁷ kg',rest:'composite helium nucleus',family:'Nucleus / hadronic composite',B:'4 nucleons',L:'0',quarks:'2 protons + 2 neutrons',anti:'Not treated as a fundamental antiparticle pair here'},
    up:{name:'Up quark',symbol:'u',charge:'+2/3 e',mass:'small current-quark mass',rest:'not used directly in AQA calculations',family:'Quark',B:'+1/3',L:'0',quarks:'fundamental',anti:'Anti-up ū'},
    down:{name:'Down quark',symbol:'d',charge:'−1/3 e',mass:'small current-quark mass',rest:'not used directly in AQA calculations',family:'Quark',B:'+1/3',L:'0',quarks:'fundamental',anti:'Anti-down d̄'},
    strange:{name:'Strange quark',symbol:'s',charge:'−1/3 e',mass:'larger than u/d',rest:'not used directly in AQA calculations',family:'Quark',B:'+1/3',L:'0',quarks:'fundamental; S = −1',anti:'Anti-strange s̄'},
    w:{name:'W boson',symbol:'W⁺ / W⁻',charge:'±1 e',mass:'very large',rest:'~80 GeV',family:'Weak-interaction gauge boson',B:'0',L:'0',quarks:'none',anti:'W⁺ and W⁻ are antiparticle partners'}
  };

  const colourMaps={
    atom:{'#ff7777':'proton','#72a9ff':'neutron','#76d8ff':'electron','#7ee8ff':'electron'},
    specific:{'#ff7777':'proton','#72a9ff':'neutron','#7ee8ff':'electron'},
    strong:{'#ff7777':'proton','#72a9ff':'neutron'},
    decay:{'#ff7777':'proton','#72a9ff':'neutron','#7ee8ff':'electron','#ff9fcb':'positron','#f3f7ff':'neutrino'},
    antimatter:{'#7ee8ff':'electron','#ff9fcb':'positron','#ffe88a':'photon'},
    interactions:{'#7ee8ff':'electron','#ffe88a':'photon','#b895ff':'w','#ff7777':'proton','#72a9ff':'neutron'},
    classification:{'#ff7777':'proton','#72a9ff':'neutron','#7ee8ff':'electron','#67d3a1':'muon','#f3f7ff':'neutrino'},
    quarks:{'#ffc85f':'up','#67d3a1':'down','#b895ff':'strange'},
    photo:{'#ffe88a':'photon','#7ee8ff':'electron'},
    collisions:{'#7ee8ff':'electron','#ff7777':'proton','#72a9ff':'neutron'},
    levels:{'#7ee8ff':'electron','#ffe88a':'photon'},
    diffraction:{'#7ee8ff':'electron'},
    rutherford:{'#7ee8ff':'alpha','#ff7777':'proton','#72a9ff':'neutron'}
  };

  const examQuestions={
    atom:[
      ['Recall · 2 marks','Define isotopes.','Atoms of the same element have the same proton number but different neutron numbers.'],
      ['Application · 3 marks','For ²³₁₁Na, state the number of protons, neutrons and electrons in a neutral atom.','11 protons, 12 neutrons, 11 electrons.'],
      ['Explain · 4 marks','Explain why changing neutron number changes the isotope but not the element.','The element is defined by proton number Z. Changing neutrons changes nucleon number A but leaves Z unchanged.']
    ],
    specific:[
      ['Recall · 2 marks','State the equation and unit for specific charge.','Specific charge = Q/m, measured in C kg⁻¹.'],
      ['Application · 3 marks','Explain why the electron has a much larger magnitude of specific charge than the proton.','They have equal charge magnitude e, but the electron has much smaller mass, so |Q/m| is much larger.'],
      ['Explain · 4 marks','Describe how ionisation changes specific charge.','Removing or adding electrons changes net Q by integer multiples of e while mass changes very little, so Q/m changes strongly.']
    ],
    strong:[
      ['Recall · 2 marks','Describe the strong nuclear force at very short range and at typical nucleon separations.','Strongly repulsive below about 0.5 fm, attractive over typical nuclear separations, negligible beyond a few fm.'],
      ['Application · 3 marks','Predict what happens to the force as two nucleons move from 4 fm to 1 fm apart.','It changes from nearly negligible to strongly attractive.'],
      ['Explain · 4 marks','Explain why the short-range repulsive part is important.','It prevents nucleons collapsing into the same position while the attractive part binds the nucleus.']
    ],
    decay:[
      ['Recall · 2 marks','State the changes in A and Z for alpha decay.','A decreases by 4; Z decreases by 2.'],
      ['Application · 3 marks','State the changes in A and Z for β⁻ decay.','A unchanged; Z increases by 1.'],
      ['Explain · 4 marks','Explain why a neutrino/antineutrino is needed in beta decay descriptions.','It helps satisfy conservation of energy, momentum and lepton number.']
    ],
    antimatter:[
      ['Recall · 2 marks','State two properties shared by a particle and its antiparticle.','Same mass and same rest energy.'],
      ['Application · 3 marks','Calculate the minimum combined rest energy of an electron and positron.','2 × 0.511 MeV = 1.022 MeV.'],
      ['Explain · 4 marks','Explain why pair production is normally shown near a nucleus.','A nearby body allows momentum as well as energy to be conserved.']
    ],
    interactions:[
      ['Recall · 2 marks','Name the exchange particle for electromagnetic interactions in the AQA model.','Virtual photon.'],
      ['Application · 3 marks','Identify the weak exchange particle used in β⁻ decay.','W⁻.'],
      ['Explain · 4 marks','Explain what an exchange-particle diagram represents.','It models transfer of energy and momentum between interacting particles and must obey conservation rules at vertices.']
    ],
    classification:[
      ['Recall · 2 marks','State the difference between hadrons and leptons.','Hadrons experience the strong interaction; leptons do not.'],
      ['Application · 3 marks','Classify the proton and pion as fully as possible.','Proton: hadron, baryon. Pion: hadron, meson.'],
      ['Explain · 4 marks','Explain why a kaon is called a strange particle.','It contains s or s̄ quark content, carries non-zero strangeness, is produced strongly and decays weakly.']
    ],
    quarks:[
      ['Recall · 2 marks','Give the quark content of a proton and neutron.','p = uud; n = udd.'],
      ['Application · 3 marks','Show that uud has charge +e.','2/3 + 2/3 − 1/3 = +1 e.'],
      ['Explain · 4 marks','Explain why a meson has baryon number zero.','It contains one quark B = +1/3 and one antiquark B = −1/3, which cancel.']
    ],
    photo:[
      ['Recall · 2 marks','Define work function.','Minimum energy required to remove an electron from a metal surface.'],
      ['Application · 3 marks','Photon energy is 4.0 eV and φ = 2.3 eV. Find KEmax.','KEmax = 1.7 eV.'],
      ['Explain · 4 marks','Explain why increasing intensity below threshold does not cause emission.','Intensity raises photon arrival rate, but each photon still has hf < φ, so no single photon can release an electron.']
    ],
    collisions:[
      ['Recall · 2 marks','Distinguish excitation from ionisation.','Excitation moves a bound electron to a higher allowed level; ionisation removes it from the atom.'],
      ['Application · 3 marks','Convert 10 eV to joules.','10 × 1.602 × 10⁻¹⁹ = 1.602 × 10⁻¹⁸ J.'],
      ['Explain · 4 marks','Explain why excitation energies are discrete.','Atomic electrons occupy discrete allowed energy levels, so only exact level differences can be transferred for excitation.']
    ],
    levels:[
      ['Recall · 2 marks','State the equation linking photon energy and frequency.','E = hf.'],
      ['Application · 3 marks','A transition has ΔE = 3.0 eV. Describe how to find wavelength.','Convert ΔE to J if needed, then λ = hc/ΔE.'],
      ['Explain · 4 marks','Explain why line spectra are evidence for discrete energy levels.','Only certain ΔE values are possible, so only certain photon energies/frequencies/wavelengths are emitted.']
    ],
    diffraction:[
      ['Recall · 2 marks','State the de Broglie equation.','λ = h/p.'],
      ['Application · 3 marks','What happens to λ if momentum doubles?','It halves.'],
      ['Explain · 4 marks','Explain why electron diffraction supports wave–particle duality.','Electrons are detected as particles but produce diffraction patterns characteristic of waves.']
    ],
    rutherford:[
      ['Recall · 2 marks','State two observations from Rutherford scattering.','Most alpha particles passed straight through; some deflected; very few scattered through large angles/backwards.'],
      ['Application · 3 marks','Predict the effect of decreasing impact parameter.','Closer approach gives a stronger electrostatic interaction and a larger scattering angle.'],
      ['Explain · 4 marks','Explain how the observations support a nuclear model.','Most straight-through paths imply mostly empty space; rare large deflections require concentrated positive charge and mass in a tiny nucleus.']
    ]
  };

  const practicals={
    photo:{
      title:'Photoelectric investigation',
      aim:'Investigate how maximum photoelectron kinetic energy depends on radiation frequency.',
      iv:'Frequency f',dv:'Stopping potential Vs or KEmax',controls:'Metal/work function, light geometry; treat intensity separately.',
      method:['Select one metal/work function.','Vary frequency across and above threshold.','Record whether emission occurs and record stopping potential.','Plot Vs against f.','Use the gradient/intercept qualitatively to connect with hf = φ + eVs.'],
      x:'Frequency / Hz',y:'Stopping potential / V'
    },
    diffraction:{
      title:'Electron diffraction investigation',
      aim:'Investigate how electron diffraction changes with accelerating voltage.',
      iv:'Accelerating voltage V',dv:'Diffraction-ring radius / relative spread',controls:'Same target/screen geometry.',
      method:['Vary accelerating voltage.','Record the pattern/ring spacing measure.','Calculate or compare de Broglie wavelength.','Plot pattern measure against voltage or momentum.','Explain the trend using λ = h/p.'],
      x:'Voltage / V',y:'Pattern measure / relative units'
    },
    rutherford:{
      title:'Rutherford scattering investigation',
      aim:'Investigate how scattering angle depends on impact parameter or alpha energy.',
      iv:'Impact parameter b or alpha energy',dv:'Scattering angle θ',controls:'Nuclear charge and the other independent variable.',
      method:['Choose whether to vary b or alpha energy.','Keep nuclear charge fixed.','Record the predicted scattering angle for several values.','Plot θ against the chosen variable.','Explain the trend using Coulomb repulsion and closest approach.'],
      x:'Impact parameter / fm',y:'Scattering angle / °'
    }
  };

  const graphModes={
    strong:['Strong-force trend','Separation / fm','Relative force',x=>{
      if(x<.5)return -(0.5-x)*7;
      if(x<=3)return 2.2*Math.exp(-Math.pow((x-1.1)/.75,2));
      return .05*Math.exp(-(x-3));
    },.15,4],
    photo:['KEmax vs frequency','Frequency / 10¹⁴ Hz','KEmax / eV',x=>Math.max(0,(6.62607015e-34*(x*1e14)/E)-2.3),2,16],
    photoStop:['Stopping potential vs frequency','Frequency / 10¹⁴ Hz','Stopping potential / V',x=>Math.max(0,(6.62607015e-34*(x*1e14)/E)-2.3),2,16],
    diffraction:['de Broglie wavelength vs momentum','Momentum / 10⁻²⁴ kg m s⁻¹','λ / nm',x=>(H/(x*1e-24))*1e9,.2,8],
    rutherford:['Scattering angle vs impact parameter','Impact parameter / fm','θ / °',x=>{
      const En=5.5e6*E,b=x*1e-15;
      return 2*Math.atan(K*79*2*E*E/(2*En*b))*180/Math.PI;
    },5,220]
  };

  const compareModes={
    photo:{label:'Photon frequency',unit:'×10¹⁴ Hz',min:2,max:16,step:.1,defA:5,defB:12,calc:v=>{
      const eV=H*(v*1e14)/E,phi=2.3;
      return {headline:Math.max(0,eV-phi).toFixed(2)+' eV KEmax',body:'Photon '+eV.toFixed(2)+' eV · '+(eV>=phi?'emission occurs':'below threshold')};
    }},
    strong:{label:'Nucleon separation',unit:'fm',min:.15,max:4,step:.05,defA:.35,defB:1.2,calc:v=>{
      const zone=v<.5?'repulsive':v<=3?'attractive':'negligible';
      return {headline:zone,body:'Separation '+v.toFixed(2)+' fm'};
    }},
    diffraction:{label:'Accelerating voltage',unit:'V',min:50,max:1000,step:10,defA:100,defB:700,calc:v=>{
      const p=Math.sqrt(2*ME*E*v),lam=H/p;
      return {headline:(lam*1e10).toFixed(3)+' Å',body:'Higher V → higher p → shorter λ'};
    }},
    rutherford:{label:'Impact parameter',unit:'fm',min:5,max:220,step:1,defA:25,defB:150,calc:v=>{
      const En=5.5e6*E,b=v*1e-15,theta=2*Math.atan(K*79*2*E*E/(2*En*b))*180/Math.PI;
      return {headline:theta.toFixed(1)+'°',body:'Smaller b → stronger deflection'};
    }}
  };

  let state={mistakes:{},exam:{},practical:{},usage:{}};
  try{state={...state,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{}
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
  const currentSim=()=>window.PARTICLELAB_CORE?.getCurrentSim?.()||$('#simNav .sim-tab.active')?.dataset.sim||'atom';

  function particleFromClick(detail){
    const sim=detail.sim||currentSim(), map=colourMaps[sim]||{};
    const c=(detail.colour||'').toLowerCase();
    let id=map[c];
    if(!id){
      const near=Object.keys(map).find(k=>colourDistance(k,c)<55);
      if(near)id=map[near];
    }
    return id?particleDB[id]:null;
  }
  function colourDistance(a,b){
    const x=parseInt(a.replace('#',''),16),y=parseInt(b.replace('#',''),16);
    if(!Number.isFinite(x)||!Number.isFinite(y))return 999;
    return Math.hypot((x>>16)-(y>>16),((x>>8)&255)-((y>>8)&255),(x&255)-(y&255));
  }

  function inject(){
    if($('#learningSuite'))return;
    const host=document.createElement('section');
    host.id='learningSuite';host.className='learning-suite';
    host.innerHTML=
      '<div class="learning-suite-tabs">'+
      ['Inspector','Compare','Graphs','Measure','Practical','Exam'].map((x,i)=>'<button data-lt="'+x.toLowerCase()+'" class="'+(i===0?'active':'')+'">'+x+'</button>').join('')+
      '</div>'+
      ['inspector','compare','graphs','measure','practical','exam'].map((x,i)=>'<div id="lt-'+x+'" class="learning-tool-panel '+(i===0?'active':'')+'"></div>').join('');
    const lab=$('#view-lab .lab-layout'); lab?.insertAdjacentElement('afterend',host);
    $$('#learningSuite [data-lt]').forEach(b=>b.onclick=()=>openTool(b.dataset.lt));
    renderAll();
    installMeasurementOverlay();
  }

  function openTool(id){
    $$('#learningSuite [data-lt]').forEach(b=>b.classList.toggle('active',b.dataset.lt===id));
    $$('#learningSuite .learning-tool-panel').forEach(p=>p.classList.toggle('active',p.id==='lt-'+id));
    if(id==='graphs')drawGraph();
    if(id==='practical')renderPractical();
    if(id==='exam')renderExam();
  }

  function renderAll(){renderInspector(null);renderCompare();renderGraphs();renderMeasurePanel();renderPractical();renderExam();}
  function simChanged(){state.usage[currentSim()]=(state.usage[currentSim()]||0)+1;save();renderAll();}

  function renderInspector(p){
    const h=$('#lt-inspector');if(!h)return;
    h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Particle inspector</span><h3>Click a real object in the 3D model</h3><p>The inspector reads the object you clicked rather than using floating markers.</p></div><span class="lt-chip">'+currentSim()+'</span></div>'+
      '<div id="ltInspectorBody">'+(p?inspectorHTML(p):'<div class="lt-inspector-empty">Click a coloured particle or nucleus component in the 3D canvas. If the clicked object is a surface, line or teaching aid rather than a particle, the inspector will tell you.</div>')+'</div>';
  }
  function inspectorHTML(p){
    return '<div class="lt-grid"><div class="lt-card"><strong>'+p.symbol+' · '+p.name+'</strong><div class="lt-kv">'+
      kv('Charge',p.charge)+kv('Mass',p.mass)+kv('Rest energy',p.rest)+kv('Family',p.family)+'</div></div>'+
      '<div class="lt-card"><strong>Quantum numbers / structure</strong><div class="lt-kv">'+
      kv('Baryon no.',p.B)+kv('Lepton no.',p.L)+kv('Quark structure',p.quarks)+kv('Antiparticle',p.anti)+'</div></div></div>';
  }
  const kv=(a,b)=>'<b>'+a+'</b><span>'+b+'</span>';

  function renderCompare(){
    const h=$('#lt-compare');if(!h)return;
    const sim=currentSim(),m=compareModes[sim];
    if(!m){h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Side-by-side comparison</span><h3>Compare two states</h3></div></div><div class="lt-inspector-empty">This simulation is mainly qualitative. Comparison mode is enabled for strong force, photoelectric effect, electron diffraction and Rutherford scattering.</div>';return;}
    h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Side-by-side comparison</span><h3>'+sim+' · compare two parameter values</h3></div></div>'+
      '<div class="lt-compare">'+scenario('A',m,m.defA)+scenario('B',m,m.defB)+'</div><div id="ltCompareDelta" class="lt-delta"></div>';
    ['A','B'].forEach(k=>$('#ltComp'+k).oninput=updateCompare);updateCompare();
  }
  function scenario(k,m,v){
    return '<div class="lt-scenario"><h4>Scenario '+k+'</h4><div class="lt-control"><label>'+m.label+' · <span id="ltComp'+k+'Val">'+v+'</span> '+m.unit+'</label><input id="ltComp'+k+'" type="range" min="'+m.min+'" max="'+m.max+'" step="'+m.step+'" value="'+v+'"></div><div id="ltComp'+k+'Out"></div></div>';
  }
  function updateCompare(){
    const m=compareModes[currentSim()];if(!m)return;
    const vals={};
    ['A','B'].forEach(k=>{const v=+$('#ltComp'+k).value,o=m.calc(v);vals[k]=v;$('#ltComp'+k+'Val').textContent=v;$('#ltComp'+k+'Out').innerHTML='<div class="lt-big">'+o.headline+'</div><div class="small subtle">'+o.body+'</div>';});
    $('#ltCompareDelta').textContent='Difference in selected input: '+Math.abs(vals.B-vals.A).toFixed(2)+' '+m.unit;
  }

  function renderGraphs(){
    const h=$('#lt-graphs');if(!h)return;
    const sim=currentSim(),opts=[];
    if(sim==='strong')opts.push(['strong','Strong force vs separation']);
    if(sim==='photo')opts.push(['photo','KEmax vs frequency'],['photoStop','Stopping potential vs frequency']);
    if(sim==='diffraction')opts.push(['diffraction','de Broglie wavelength vs momentum']);
    if(sim==='rutherford')opts.push(['rutherford','Scattering angle vs impact parameter']);
    if(!opts.length){h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Graph mode</span><h3>Live physics graphs</h3></div></div><div class="lt-inspector-empty">Graph mode is available for strong force, photoelectric effect, electron diffraction and Rutherford scattering.</div>';return;}
    h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Graph mode</span><h3>Turn simulation relationships into data</h3></div></div><div class="lt-chart-controls"><select id="ltGraphSelect">'+opts.map(o=>'<option value="'+o[0]+'">'+o[1]+'</option>').join('')+'</select><button class="button" id="ltGraphRedraw">Redraw</button></div><canvas id="ltGraphCanvas" class="lt-chart" width="900" height="360"></canvas>';
    $('#ltGraphSelect').onchange=drawGraph;$('#ltGraphRedraw').onclick=drawGraph;setTimeout(drawGraph,0);
  }
  function drawGraph(){
    const c=$('#ltGraphCanvas');if(!c)return;
    const key=$('#ltGraphSelect')?.value||({'strong':'strong','photo':'photo','diffraction':'diffraction','rutherford':'rutherford'}[currentSim()]);
    const d=graphModes[key];if(!d)return;
    const x=c.getContext('2d'),w=c.width,h=c.height,pad={l:70,r:25,t:25,b:55};
    x.clearRect(0,0,w,h);x.fillStyle='#06111d';x.fillRect(0,0,w,h);
    const pts=[];for(let i=0;i<=120;i++){const xv=d[4]+(d[5]-d[4])*i/120;pts.push([xv,d[3](xv)]);}
    let ymin=Math.min(...pts.map(p=>p[1])),ymax=Math.max(...pts.map(p=>p[1]));if(ymin===ymax){ymin-=1;ymax+=1}
    const px=v=>pad.l+(v-d[4])/(d[5]-d[4])*(w-pad.l-pad.r),py=v=>h-pad.b-(v-ymin)/(ymax-ymin)*(h-pad.t-pad.b);
    x.strokeStyle='rgba(180,215,240,.18)';x.lineWidth=1;
    for(let i=0;i<=5;i++){const yy=pad.t+(h-pad.t-pad.b)*i/5;x.beginPath();x.moveTo(pad.l,yy);x.lineTo(w-pad.r,yy);x.stroke();}
    x.strokeStyle='#8edcff';x.lineWidth=3;x.beginPath();pts.forEach((p,i)=>{const X=px(p[0]),Y=py(p[1]);i?x.lineTo(X,Y):x.moveTo(X,Y)});x.stroke();
    x.fillStyle='#dff4ff';x.font='700 18px system-ui';x.fillText(d[0],pad.l,18);
    x.font='14px system-ui';x.fillStyle='#9fb4c7';x.fillText(d[1],w/2-70,h-12);
    x.save();x.translate(18,h/2+60);x.rotate(-Math.PI/2);x.fillText(d[2],0,0);x.restore();
    x.font='12px monospace';x.fillText(d[4],pad.l,h-pad.b+18);x.fillText(d[5],w-pad.r-28,h-pad.b+18);x.fillText(ymin.toFixed(2),8,h-pad.b);x.fillText(ymax.toFixed(2),8,pad.t+5);
  }

  let measure={timer:null,start:0,elapsed:0,running:false};
  function installMeasurementOverlay(){
    const wrap=$('.viewer-wrap');if(!wrap||$('#measureOverlay'))return;
    const o=document.createElement('div');o.id='measureOverlay';o.className='measure-overlay';o.hidden=true;
    o.innerHTML='<div id="measureRuler" class="measure-ruler">0 ┃ 1 ┃ 2 ┃ 3 ┃ 4 ┃ 5 ┃ 6 ┃ 7 ┃ 8 ┃ 9 ┃ 10</div>'+
      '<div id="measureA" class="measure-angle-point" style="left:35%;top:55%"></div><div id="measureB" class="measure-angle-point" style="left:50%;top:55%"></div><div id="measureC" class="measure-angle-point" style="left:58%;top:38%"></div>'+
      '<div id="measureLine1" class="measure-angle-line"></div><div id="measureLine2" class="measure-angle-line"></div>'+
      '<div id="measureCursor" class="measure-cursor" style="left:65%;top:30%"></div><div id="measureReadout" class="measure-readout"></div>';
    wrap.appendChild(o);
    ['measureRuler','measureA','measureB','measureC','measureCursor'].forEach(id=>makeDrag($('#'+id),o));
    ['measureA','measureB','measureC'].forEach(id=>$('#'+id).addEventListener('pointermove',updateMeasureLines));
    updateMeasureLines();
  }
  function makeDrag(el,bound){
    if(!el)return;let d=false,ox=0,oy=0;
    el.addEventListener('pointerdown',e=>{d=true;const r=el.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;el.setPointerCapture?.(e.pointerId)});
    el.addEventListener('pointermove',e=>{if(!d)return;const br=bound.getBoundingClientRect();el.style.left=Math.max(0,Math.min(br.width-el.offsetWidth,e.clientX-br.left-ox))+'px';el.style.top=Math.max(0,Math.min(br.height-el.offsetHeight,e.clientY-br.top-oy))+'px';updateMeasureLines();});
    el.addEventListener('pointerup',()=>d=false);
  }
  function updateMeasureLines(){
    const b=$('#measureOverlay')?.getBoundingClientRect();if(!b)return;
    const point=id=>{const r=$('#'+id).getBoundingClientRect();return{x:r.left-b.left+r.width/2,y:r.top-b.top+r.height/2}};
    const A=point('measureA'),B=point('measureB'),C1=point('measureC');
    line($('#measureLine1'),B,A);line($('#measureLine2'),B,C1);
    const v1={x:A.x-B.x,y:A.y-B.y},v2={x:C1.x-B.x,y:C1.y-B.y};
    const cos=(v1.x*v2.x+v1.y*v2.y)/(Math.hypot(v1.x,v1.y)*Math.hypot(v2.x,v2.y)||1);
    const angle=Math.acos(Math.max(-1,Math.min(1,cos)))*180/Math.PI;
    $('#measureReadout').textContent='Angle ≈ '+angle.toFixed(1)+'° · ruler is screen-scale only';
  }
  function line(el,a,b){const dx=b.x-a.x,dy=b.y-a.y;el.style.left=a.x+'px';el.style.top=a.y+'px';el.style.width=Math.hypot(dx,dy)+'px';el.style.transform='rotate('+Math.atan2(dy,dx)+'rad)';}
  function renderMeasurePanel(){
    const h=$('#lt-measure');if(!h)return;
    h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Measurement tools</span><h3>Take readings from the model</h3><p>Screen ruler, angle tool, stopwatch and data cursor. Use them for relative measurements unless the simulation provides physical units.</p></div></div>'+
      '<div class="lt-actions"><button class="button" id="ltMeasureToggle">Show tools</button><button class="button" id="ltWatchStart">Start stopwatch</button><button class="button" id="ltWatchReset">Reset</button><span class="lt-stopwatch" id="ltWatch">0.00 s</span></div>';
    $('#ltMeasureToggle').onclick=()=>{const o=$('#measureOverlay');o.hidden=!o.hidden;$('#ltMeasureToggle').textContent=o.hidden?'Show tools':'Hide tools';};
    $('#ltWatchStart').onclick=toggleWatch;$('#ltWatchReset').onclick=()=>{measure.elapsed=0;measure.start=performance.now();$('#ltWatch').textContent='0.00 s';};
  }
  function toggleWatch(){
    measure.running=!measure.running;$('#ltWatchStart').textContent=measure.running?'Pause stopwatch':'Start stopwatch';
    if(measure.running){measure.start=performance.now()-measure.elapsed*1000;const tick=()=>{if(!measure.running)return;measure.elapsed=(performance.now()-measure.start)/1000;$('#ltWatch').textContent=measure.elapsed.toFixed(2)+' s';measure.timer=requestAnimationFrame(tick)};tick();}else cancelAnimationFrame(measure.timer);
  }

  function renderPractical(){
    const h=$('#lt-practical');if(!h)return;
    const sim=currentSim(),p=practicals[sim];
    if(!p){h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Practical investigation</span><h3>Turn a simulation into an investigation</h3></div></div><div class="lt-inspector-empty">Investigation mode is currently built for photoelectric effect, electron diffraction and Rutherford scattering.</div>';return;}
    const rows=state.practical[sim]||[];
    h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Practical investigation</span><h3>'+p.title+'</h3></div></div>'+
      '<div class="lt-practical-grid"><div><div class="lt-card"><strong>Aim</strong><p>'+p.aim+'</p></div><div class="lt-card" style="margin-top:6px"><strong>Variables</strong><p><b>IV:</b> '+p.iv+'<br><b>DV:</b> '+p.dv+'<br><b>Controls:</b> '+p.controls+'</p></div><div class="lt-card" style="margin-top:6px"><strong>Method</strong><ol class="lt-method">'+p.method.map(x=>'<li>'+x+'</li>').join('')+'</ol></div></div>'+
      '<div><table class="lt-table"><thead><tr><th>'+p.x+'</th><th>'+p.y+'</th><th>Note</th></tr></thead><tbody id="ltPracticalRows">'+rows.map((r,i)=>'<tr><td>'+r.x+'</td><td>'+r.y+'</td><td>'+r.note+'</td></tr>').join('')+'</tbody></table>'+
      '<div class="lt-actions"><input id="ltPX" placeholder="'+p.x+'"><input id="ltPY" placeholder="'+p.y+'"><input id="ltPNote" placeholder="note"><button class="button" id="ltPAdd">Add row</button><button class="button" id="ltPPlot">Plot results</button><button class="button" id="ltPClear">Clear</button></div><canvas id="ltPracticalGraph" class="lt-chart" width="900" height="320" style="margin-top:7px"></canvas></div></div>';
    $('#ltPAdd').onclick=()=>{const row={x:$('#ltPX').value,y:$('#ltPY').value,note:$('#ltPNote').value};if(row.x===''||row.y==='')return;(state.practical[sim]||(state.practical[sim]=[])).push(row);save();renderPractical();};
    $('#ltPPlot').onclick=drawPractical;$('#ltPClear').onclick=()=>{state.practical[sim]=[];save();renderPractical();};setTimeout(drawPractical,0);
  }
  function drawPractical(){
    const c=$('#ltPracticalGraph'),rows=(state.practical[currentSim()]||[]).map(r=>[+r.x,+r.y]).filter(p=>p.every(Number.isFinite));if(!c)return;
    const x=c.getContext('2d'),w=c.width,h=c.height;x.clearRect(0,0,w,h);x.fillStyle='#06111d';x.fillRect(0,0,w,h);
    if(rows.length<1){x.fillStyle='#8fa5b8';x.font='16px system-ui';x.fillText('Add numerical readings to plot your results.',24,38);return;}
    const xs=rows.map(p=>p[0]),ys=rows.map(p=>p[1]),xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys),pad=55;
    const px=v=>pad+(v-xmin)/((xmax-xmin)||1)*(w-2*pad),py=v=>h-pad-(v-ymin)/((ymax-ymin)||1)*(h-2*pad);
    x.strokeStyle='#8edcff';x.lineWidth=2;rows.sort((a,b)=>a[0]-b[0]);x.beginPath();rows.forEach((p,i)=>{i?x.lineTo(px(p[0]),py(p[1])):x.moveTo(px(p[0]),py(p[1]))});x.stroke();
    x.fillStyle='#fff';rows.forEach(p=>{x.beginPath();x.arc(px(p[0]),py(p[1]),5,0,Math.PI*2);x.fill()});
  }

  function renderExam(){
    const h=$('#lt-exam');if(!h)return;
    const sim=currentSim(),qs=examQuestions[sim]||[];
    h.innerHTML='<div class="lt-head"><div><span class="eyebrow">Exam link</span><h3>Questions based on this simulation</h3><p>Recall → application → explanation.</p></div></div>'+
      qs.map((q,i)=>'<div class="lt-question"><h4>'+q[0]+'</h4><p>'+q[1]+'</p><div class="lt-actions"><button class="button" data-reveal="'+i+'">Reveal answer</button><button class="button" data-secure="'+i+'">I could do this</button><button class="button" data-review="'+i+'">I need practice</button></div><div id="ltAns'+i+'"></div></div>').join('')+
      adaptiveHTML(sim);
    $$('[data-reveal]',h).forEach(b=>b.onclick=()=>$('#ltAns'+b.dataset.reveal).innerHTML='<div class="lt-answer">'+qs[+b.dataset.reveal][2]+'</div>');
    $$('[data-secure]',h).forEach(b=>b.onclick=()=>{state.exam[sim+':'+b.dataset.secure]='secure';save();renderExam()});
    $$('[data-review]',h).forEach(b=>b.onclick=()=>{state.exam[sim+':'+b.dataset.review]='review';state.mistakes[sim]=(state.mistakes[sim]||0)+1;save();renderExam()});
  }
  function adaptiveHTML(sim){
    const n=state.mistakes[sim]||0;if(n<2)return '';
    const msg={
      photo:'Revisit the distinction between frequency and intensity. Photon energy is hf; intensity mainly changes photon rate.',
      quarks:'Write Q, B and S for each quark before adding them. Antiquarks reverse the signs of additive quantum numbers.',
      rutherford:'Separate observation from inference: most straight → empty space; rare large deflection → concentrated positive nucleus.',
      decay:'Track A and Z first, then check charge and lepton number.',
      diffraction:'Keep λ = h/p central: larger momentum means shorter wavelength.',
      interactions:'Check each vertex and conserved quantity rather than memorising only the picture.'
    }[sim]||'Return to the simple explanation, change one control at a time, then answer the recall question again.';
    return '<div class="lt-adaptive"><strong>Adaptive review:</strong> '+msg+'</div>';
  }

  function bindMistakes(){
    document.addEventListener('click',e=>{
      const q=e.target.closest?.('.quick-option');if(!q)return;
      setTimeout(()=>{if(q.classList.contains('wrong')){const sim=currentSim();state.mistakes[sim]=(state.mistakes[sim]||0)+1;save();if($('#lt-exam.active'))renderExam();}},20);
    });
  }

  window.addEventListener('particlelab:model-click',e=>{
    const p=particleFromClick(e.detail);
    renderInspector(p);
    if(!p){$('#ltInspectorBody').innerHTML='<div class="lt-inspector-empty">You clicked part of the model that is not identified as a particle. Try a coloured sphere or particle object.</div>';}
    openTool('inspector');
  });

  function init(){
    inject();bindMistakes();
    $('#simNav')?.addEventListener('click',e=>{if(e.target.closest?.('.sim-tab'))setTimeout(simChanged,80)});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,180),{once:true});else setTimeout(init,180);
})();
