
(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];


  const legends = {
    atom:[
      ['#ff7777','Proton','+e, inside nucleus'],
      ['#72a9ff','Neutron','0 charge, inside nucleus'],
      ['#76d8ff','Electron cloud','probability-style region'],
    ],
    specific:[
      ['#ff7777','Proton','adds +e and mass'],
      ['#72a9ff','Neutron','adds mass only'],
      ['#7ee8ff','Electron','adds −e, very small mass'],
    ],
    strong:[
      ['#ff7777','Proton / nucleon','one interacting nucleon'],
      ['#72a9ff','Neutron / nucleon','one interacting nucleon'],
      ['#63d9a4','Green arrow','attractive force'],
      ['#ff7b87','Red arrow','repulsive force'],
    ],
    decay:[
      ['#ff7777','Proton','nuclear proton'],
      ['#72a9ff','Neutron','nuclear neutron'],
      ['#7ee8ff','β⁻ electron','emitted in beta-minus decay'],
      ['#ff9fcb','β⁺ positron','emitted in beta-plus decay'],
      ['#f3f7ff','ν / ν̄','neutrino or antineutrino'],
    ],
    antimatter:[
      ['#7ee8ff','Electron e⁻','matter particle'],
      ['#ff9fcb','Positron e⁺','electron antiparticle'],
      ['#ffe88a','Photon γ','electromagnetic radiation'],
    ],
    interactions:[
      ['#ff7777','Charged / proton-like particle','depends on selected process'],
      ['#72a9ff','Neutron-like particle','depends on selected process'],
      ['#7ee8ff','Electron','charged lepton'],
      ['#ffe88a','Virtual photon γ','EM exchange'],
      ['#b895ff','W boson','weak exchange'],
    ],
    classification:[
      ['#ff7777','Proton','baryon / hadron'],
      ['#72a9ff','Neutron','baryon / hadron'],
      ['#ffc85f','Pion','meson / hadron'],
      ['#b895ff','Kaon','meson / hadron'],
      ['#7ee8ff','Electron','lepton'],
      ['#67d3a1','Muon','lepton'],
      ['#f3f7ff','Neutrino','lepton'],
    ],
    quarks:[
      ['#ffc85f','Up quark u','charge +2/3 e'],
      ['#67d3a1','Down quark d','charge −1/3 e'],
      ['#b895ff','Strange quark s','charge −1/3 e, S = −1'],
    ],
    photo:[
      ['#ffe88a','Photon γ','energy hf'],
      ['#7ee8ff','Photoelectron','electron emitted from metal'],
      ['#8fa3b8','Metal surface','provides work function φ'],
    ],
    collisions:[
      ['#7ee8ff','Incident electron','brings kinetic energy'],
      ['#ff7777','Proton','part of atom'],
      ['#72a9ff','Neutron','part of atom'],
      ['#7ee8ff','Atomic electron','can be excited or ionised'],
    ],
    levels:[
      ['#7ee8ff','Electron','moves between allowed levels'],
      ['#ffe88a','Photon','carries ΔE'],
      ['#b895ff','Energy-level discs','allowed energies, not physical orbits'],
    ],
    diffraction:[
      ['#7ee8ff','Electron beam','matter particles with de Broglie wavelength'],
      ['#b9d8ef','Diffraction pattern','wave behaviour on screen'],
    ],
    rutherford:[
      ['#7ee8ff','Alpha particle','helium nucleus, charge +2e'],
      ['#ff7777','Proton in nucleus','positive nuclear charge'],
      ['#72a9ff','Neutron in nucleus','neutral nucleon'],
      ['#66d9a6','Detector','records alpha arrival'],
    ]
  };

  const profiles = {
    atom:{
      focus:'Nucleus ↔ electron region',
      change:'Change isotope and electron count',
      watch:'Z fixes the element; A changes with neutrons'
    },
    specific:{
      focus:'Charge divided by total mass',
      change:'Change Z, A and electrons',
      watch:'Large |Q| and small m give large |Q/m|'
    },
    strong:{
      focus:'Force changes with separation',
      change:'Move the two nucleons',
      watch:'Repulsive very close; attractive over nuclear range'
    },
    decay:{
      focus:'Parent → emitted particles → daughter',
      change:'Switch α, β⁻ and β⁺',
      watch:'Track how A and Z change'
    },
    antimatter:{
      focus:'Matter ↔ antimatter ↔ photons',
      change:'Run annihilation or pair production',
      watch:'Energy and momentum must both be conserved'
    },
    interactions:{
      focus:'Incoming → exchange → outgoing',
      change:'Switch interaction process',
      watch:'Identify the exchange particle and conserved quantities'
    },
    classification:{
      focus:'Hadron, baryon, meson or lepton',
      change:'Select a particle family',
      watch:'Strong interaction separates hadrons from leptons'
    },
    quarks:{
      focus:'Add quark quantum numbers',
      change:'Build different hadrons',
      watch:'Charge, baryon number and strangeness must add correctly'
    },
    photo:{
      focus:'Photon energy vs work function',
      change:'Frequency, intensity and φ',
      watch:'Below threshold: no emission; above: KEmax rises with f'
    },
    collisions:{
      focus:'Electron energy transfer',
      change:'Incident energy and atom',
      watch:'No change → excitation → ionisation'
    },
    levels:{
      focus:'Discrete energy-level transition',
      change:'Choose the transition',
      watch:'Photon energy equals the level difference'
    },
    diffraction:{
      focus:'Electron wavelength and diffraction',
      change:'Accelerating voltage / momentum',
      watch:'Higher p → shorter λ → tighter pattern'
    },
    rutherford:{
      focus:'Impact parameter and Coulomb repulsion',
      change:'b, nuclear charge and alpha energy',
      watch:'Closer approach gives a larger deflection'
    }
  };

  function currentSim(){
    return $('#simNav .sim-tab.active')?.dataset.sim || 'atom';
  }

  function addKeyStrip(){
    const side=$('.lab-side');
    if(!side || $('#simKeyStrip')) return;
    const strip=document.createElement('div');
    strip.id='simKeyStrip';
    strip.className='sim-key-strip';
    strip.innerHTML=
      '<div class="sim-key-item"><span>Focus</span><strong id="simKeyFocus"></strong></div>'+
      '<div class="sim-key-item"><span>Change</span><strong id="simKeyChange"></strong></div>'+
      '<div class="sim-key-item"><span>Watch for</span><strong id="simKeyWatch"></strong></div>';
    const readout=$('#simReadout');
    if(readout) readout.insertAdjacentElement('afterend',strip);
    else side.prepend(strip);
  }


  function addLegend(){
    const side=$('.lab-side');
    if(!side || $('#simParticleLegend')) return;
    const box=document.createElement('div');
    box.id='simParticleLegend';
    box.className='sim-particle-legend';
    const strip=$('#simKeyStrip');
    if(strip) strip.insertAdjacentElement('afterend',box);
    else side.prepend(box);
  }

  function updateLegend(){
    const box=$('#simParticleLegend');
    if(!box) return;
    const rows=legends[currentSim()] || [];
    box.innerHTML='<div class="sim-legend-title"><strong>Model key</strong><span>What the colours and objects mean</span></div>'+
      '<div class="sim-legend-items">'+rows.map(([colour,name,note])=>{
        const mark=colour==='target'
          ? '<span class="sim-legend-target" aria-hidden="true"></span>'
          : '<span class="sim-legend-dot" style="--legend-colour:'+colour+'" aria-hidden="true"></span>';
        return '<div class="sim-legend-item">'+mark+'<div><strong>'+name+'</strong><span>'+note+'</span></div></div>';
      }).join('')+'</div>';
  }


  function addObjectGuide(){
    const side=$('.lab-side');
    if(!side || $('#simObjectGuide')) return;
    const box=document.createElement('div');
    box.id='simObjectGuide';
    box.className='sim-object-guide';
    const legend=$('#simParticleLegend');
    if(legend) legend.insertAdjacentElement('afterend',box);
    else side.prepend(box);
  }

  function updateObjectGuide(){
    const box=$('#simObjectGuide');
    if(!box) return;
    const guides=window.PARTICLELAB_GUIDES?.[currentSim()] || [];
    box.innerHTML=
      '<div class="sim-guide-title"><strong>What am I looking at?</strong><span>Click an item to explain it</span></div>'+
      '<div class="sim-guide-buttons">'+
        guides.map((g,i)=>'<button class="sim-guide-button" data-guide-index="'+i+'"><span>'+String(i+1)+'</span><strong>'+g.title+'</strong></button>').join('')+
      '</div>';
    $$('.sim-guide-button',box).forEach(btn=>btn.addEventListener('click',()=>{
      const item=guides[Number(btn.dataset.guideIndex)];
      if(!item) return;
      $$('.sim-guide-button',box).forEach(x=>x.classList.toggle('active',x===btn));
      window.dispatchEvent(new CustomEvent('particlelab:guide-select',{detail:item}));
      window.dispatchEvent(new CustomEvent('particlelab:hotspot',{detail:{sim:currentSim(),title:item.title}}));
    }));
  }

  function add3DBadge(){
    const wrap=$('.viewer-wrap');
    if(!wrap || $('#sim3DStatusBadge')) return;
    const b=document.createElement('div');
    b.id='sim3DStatusBadge';
    b.className='sim-corner-badge';
    b.textContent='Interactive 3D model';
    wrap.appendChild(b);
  }

  function updateProfile(){
    const p=profiles[currentSim()] || profiles.atom;
    if($('#simKeyFocus')) $('#simKeyFocus').textContent=p.focus;
    if($('#simKeyChange')) $('#simKeyChange').textContent=p.change;
    if($('#simKeyWatch')) $('#simKeyWatch').textContent=p.watch;
  }

  function escapeHtml(s){
    return s.replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    })[c]);
  }

  function physicsMarkup(text){
    let s=escapeHtml(text);
    const reps = [
      [/\bKEmax\b/g,'KE<sub>max</sub>'],
      [/\bVs\b/g,'V<sub>s</sub>'],
      [/\bf0\b/g,'f<sub>0</sub>'],
      [/\bNe\b/g,'N<sub>e</sub>'],
      [/\bme\b/g,'m<sub>e</sub>'],
      [/\bmp\b/g,'m<sub>p</sub>'],
      [/\bmn\b/g,'m<sub>n</sub>'],
      [/C kg⁻¹/g,'<span class="physics-unit">C kg⁻¹</span>'],
      [/10⁻¹⁹/g,'10<sup>−19</sup>'],
      [/10⁻²⁷/g,'10<sup>−27</sup>'],
      [/10⁻³¹/g,'10<sup>−31</sup>']
    ];
    for(const [re,to] of reps) s=s.replace(re,to);
    const looksMath=/[=≈λφθΔ±×÷]|(?:\b[AQEZBSpfhmcV]\b)/.test(text);
    return looksMath ? '<span class="physics-math">'+s+'</span>' : s;
  }

  let formatting=false;
  function formatReadout(){
    const box=$('#simReadout');
    if(!box || formatting) return;
    const raw=(box.textContent || '').replace(/\s+/g,' ').trim();
    if(!raw) return;
    if(box.dataset.formattedRaw===raw && box.querySelector('.sim-readout-flow')) return;
    formatting=true;
    const pieces=raw.split(/\s*[·•]\s*/).map(x=>x.trim()).filter(Boolean);
    const use=pieces.length ? pieces : [raw];
    box.innerHTML='<div class="sim-readout-flow">'+use.map(x=>'<span class="sim-readout-chip">'+physicsMarkup(x)+'</span>').join('')+'</div>';
    box.dataset.formattedRaw=raw;
    formatting=false;
  }

  function formatLearningText(){
    const targets=[
      ['#simpleExplain','Key idea'],
      ['#examExplain','Exam wording'],
      ['#mistakeExplain','Avoid this']
    ];
    for(const [sel] of targets){
      const el=$(sel);
      if(!el) continue;
      el.querySelectorAll('p').forEach(p=>{
        p.style.margin='0';
      });
    }
  }

  function refresh(){
    addKeyStrip();
    addLegend();
    addObjectGuide();
    add3DBadge();
    updateProfile();
    updateLegend();
    updateObjectGuide();
    formatLearningText();
    setTimeout(formatReadout,0);
  }

  function init(){
    refresh();

    const readout=$('#simReadout');
    if(readout){
      const observer=new MutationObserver(()=>{
        if(!formatting) queueMicrotask(formatReadout);
      });
      observer.observe(readout,{childList:true,subtree:true,characterData:true});
    }

    let lastSim=currentSim();
    setInterval(()=>{
      const now=currentSim();
      if(now!==lastSim){
        lastSim=now;
        refresh();
      }else{
        addKeyStrip();
        addLegend();
        addObjectGuide();
        if(!$('#simObjectGuide .sim-guide-button') && window.PARTICLELAB_GUIDES?.[now]?.length){
          updateObjectGuide();
        }
        formatReadout();
      }
    },250);

    $('#simNav')?.addEventListener('click',e=>{
      if(e.target.closest?.('.sim-tab')) setTimeout(refresh,35);
    });

    document.addEventListener('input',e=>{
      if(e.target.closest?.('#simControls')) setTimeout(formatReadout,30);
    });
    document.addEventListener('change',e=>{
      if(e.target.closest?.('#simControls')) setTimeout(formatReadout,30);
    });
    document.addEventListener('click',e=>{
      if(e.target.closest?.('#simControls button')) setTimeout(formatReadout,60);
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
