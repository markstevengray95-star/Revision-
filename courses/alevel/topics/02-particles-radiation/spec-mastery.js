(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const sections=[
    {code:'3.2.1.1',title:'Constituents of the atom',sim:'atom',items:[
      ['know','Recall proton, neutron and electron charge and mass in SI and relative units.'],
      ['calc','Calculate specific charge Q/m for particles, nuclei and ions.'],
      ['know','Use proton number Z, nucleon number A and neutron number N correctly.'],
      ['use','Interpret and write nuclide notation.'],
      ['explain','Explain isotopes and use isotopic data.']
    ]},
    {code:'3.2.1.2',title:'Stable and unstable nuclei',sim:'strong',items:[
      ['explain','Explain the role and range of the strong nuclear force.'],
      ['know','Know the attractive region up to about 3 fm and very-short-range repulsion below about 0.5 fm.'],
      ['use','Write and balance alpha-decay equations.'],
      ['use','Write β⁻ decay equations including the antineutrino.'],
      ['explain','Explain why the neutrino was proposed in relation to conservation of energy in beta decay.']
    ]},
    {code:'3.2.1.3',title:'Particles, antiparticles and photons',sim:'antimatter',items:[
      ['know','Match particles with antiparticles including e⁺, antiproton, antineutron and antineutrino.'],
      ['compare','Compare particle and antiparticle mass, charge and rest energy.'],
      ['calc','Use photon energy E = hf and relate energy to frequency or wavelength.'],
      ['explain','Explain annihilation and pair production and account for the energy involved.']
    ]},
    {code:'3.2.1.4',title:'Particle interactions',sim:'interactions',items:[
      ['know','Identify gravity, electromagnetic, weak and strong as the four fundamental interactions.'],
      ['explain','Explain interactions using exchange particles.'],
      ['diagram','Use virtual photons in electromagnetic-interaction diagrams.'],
      ['diagram','Use W⁺ and W⁻ in β⁻, β⁺, electron-capture and electron–proton interaction diagrams.'],
      ['diagram','Read simple incoming/outgoing/exchange-particle diagrams.']
    ]},
    {code:'3.2.1.5',title:'Classification of particles',sim:'classification',items:[
      ['sort','Distinguish hadrons, baryons, antibaryons, mesons and leptons.'],
      ['know','Know proton/neutron, pion/kaon and electron/muon/neutrino examples.'],
      ['use','Apply baryon-number conservation.'],
      ['use','Apply separate electron- and muon-lepton-number conservation.'],
      ['explain','Explain the pion as an exchange particle of the strong nuclear force.'],
      ['explain','Explain strange-particle production through the strong interaction and decay through the weak interaction.'],
      ['use','Apply strangeness conservation in strong interactions and allowed change in weak interactions.']
    ]},
    {code:'3.2.1.6',title:'Quarks and antiquarks',sim:'quarks',items:[
      ['know','Recall charge, baryon number and strangeness for u, d, s quarks and antiquarks.'],
      ['build','Construct proton uud and neutron udd from quarks.'],
      ['build','Construct antiproton and antineutron from antiquarks.'],
      ['build','Identify permitted pion and kaon quark–antiquark combinations used by AQA.'],
      ['explain','Describe neutron decay at quark level.']
    ]},
    {code:'3.2.1.7',title:'Applications of conservation laws',sim:'decay',items:[
      ['explain','Show the quark-character change in β⁻ and β⁺ decay.'],
      ['use','Check conservation of charge.'],
      ['use','Check conservation of baryon number.'],
      ['use','Check conservation of electron and muon lepton numbers.'],
      ['use','Check conservation of strangeness.'],
      ['explain','Recognise that energy and momentum must also be conserved in interactions.']
    ]},
    {code:'3.2.2.1',title:'The photoelectric effect',sim:'photo',items:[
      ['explain','Explain threshold frequency using photon energy.'],
      ['know','Define work function φ.'],
      ['calc','Use hf = φ + KEmax.'],
      ['calc','Relate stopping potential to maximum photoelectron kinetic energy.'],
      ['explain','Distinguish the effects of changing radiation intensity and frequency.']
    ]},
    {code:'3.2.2.2',title:'Collisions of electrons with atoms',sim:'collisions',items:[
      ['explain','Distinguish excitation from ionisation.'],
      ['explain','Explain excitation and ionisation in a fluorescent tube.'],
      ['calc','Use the electron volt and convert between eV and J.']
    ]},
    {code:'3.2.2.3',title:'Energy levels and photon emission',sim:'levels',items:[
      ['explain','Use line spectra as evidence for discrete energy levels.'],
      ['calc','Calculate photon energy/frequency/wavelength from an energy-level difference.'],
      ['use','Work with energy levels given in either J or eV.']
    ]},
    {code:'3.2.2.4',title:'Wave–particle duality',sim:'diffraction',items:[
      ['explain','Use electron diffraction as evidence that particles possess wave properties.'],
      ['explain','Use the photoelectric effect as evidence for the particulate nature of electromagnetic radiation.'],
      ['calc','Use de Broglie wavelength λ = h/p.'],
      ['explain','Explain how changing particle momentum changes diffraction.'],
      ['explain','Recognise that physical models develop through evidence, peer review and validation.']
    ]}
  ];

  const labels={know:'Knowledge',calc:'Calculation',use:'Apply',explain:'Explain',diagram:'Diagram',compare:'Compare',sort:'Classify',build:'Build'};
  let state={};
  try{state=JSON.parse(localStorage.getItem('particleSpecMasteryV3')||'{}')}catch{state={}}

  function activeCount(){let total=0,done=0;sections.forEach(s=>s.items.forEach((_,i)=>{total++;if(state[`${s.code}-${i}`])done++}));return {done,total}}
  function openSim(id){
    const lab=$('[data-view="lab"]'); if(lab) lab.click(); else {$$('.view').forEach(v=>v.classList.toggle('active-view',v.id==='view-lab'))}
    setTimeout(()=>document.querySelector(`.sim-tab[data-sim="${id}"]`)?.click(),30);
  }

  function render(){
    const host=$('#specMastery'); if(!host)return;
    const c=activeCount();
    host.innerHTML=`<div class="mastery-summary panel"><div><span class="eyebrow">Detailed AQA mastery</span><h2>${c.done} / ${c.total} requirements secure</h2><p class="subtle">Tick an item only when the student can do it without support. This is stored on this device.</p></div><div class="mastery-meter"><div class="progress-track"><div class="progress-fill" style="width:${c.total?100*c.done/c.total:0}%"></div></div><strong>${Math.round(c.total?100*c.done/c.total:0)}%</strong></div><button id="clearMastery" class="button">Reset mastery</button></div><div class="mastery-sections">${sections.map(s=>`<section class="panel mastery-section"><div class="mastery-head"><div><span class="eyebrow">AQA ${s.code}</span><h3>${s.title}</h3></div><button class="button" data-open-sim="${s.sim}">Open simulation</button></div><div class="mastery-items">${s.items.map(([type,text],i)=>{const k=`${s.code}-${i}`;return `<label class="mastery-item"><input type="checkbox" data-mastery="${k}" ${state[k]?'checked':''}><span class="mastery-tag">${labels[type]||type}</span><span>${text}</span></label>`}).join('')}</div></section>`).join('')}</div>`;
    host.querySelectorAll('[data-mastery]').forEach(x=>x.onchange=()=>{state[x.dataset.mastery]=x.checked;localStorage.setItem('particleSpecMasteryV3',JSON.stringify(state));render()});
    host.querySelectorAll('[data-open-sim]').forEach(b=>b.onclick=()=>openSim(b.dataset.openSim));
    $('#clearMastery').onclick=()=>{if(confirm('Reset the detailed AQA mastery ticks on this device?')){state={};localStorage.removeItem('particleSpecMasteryV3');render()}};
  }

  function init(){
    const view=$('#view-spec'); if(!view||$('#specMastery'))return;
    const st=document.createElement('style');st.textContent=`.mastery-summary{margin-top:16px;display:grid;grid-template-columns:minmax(0,1fr) minmax(210px,.45fr) auto;gap:15px;align-items:center}.mastery-summary h2{margin:.25rem 0}.mastery-meter{display:grid;grid-template-columns:1fr auto;gap:9px;align-items:center}.mastery-sections{display:grid;gap:12px;margin-top:12px}.mastery-head{display:flex;gap:12px;align-items:start;justify-content:space-between}.mastery-head h3{margin:.2rem 0}.mastery-items{display:grid;gap:7px;margin-top:10px}.mastery-item{display:grid;grid-template-columns:auto 90px minmax(0,1fr);gap:9px;align-items:start;padding:9px;border-radius:10px;background:rgba(255,255,255,.025)}.mastery-item input{width:20px;height:20px;margin-top:1px}.mastery-tag{font-size:.72rem;font-weight:800;text-transform:uppercase;color:var(--accent)}@media(max-width:780px){.mastery-summary{grid-template-columns:1fr}.mastery-item{grid-template-columns:auto minmax(0,1fr)}.mastery-tag{grid-column:2}}`;
    document.head.appendChild(st);
    const host=document.createElement('div');host.id='specMastery';view.appendChild(host);render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();