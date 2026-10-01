(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const guide={
    atom:{code:'3.2.1.1',name:'Atomic structure',showing:'A tiny nucleus containing protons and neutrons, with an electron probability cloud around it.',change:'Choose the isotope. Watch Z, A, neutron number and electron number change.',watch:'Changing neutrons changes the isotope but not the element. The element changes only when proton number Z changes.',science:'Protons have charge +e, neutrons 0 and electrons −e. A = protons + neutrons. A neutral atom has electrons = Z.',equation:'N = A − Z; net charge Q = (protons − electrons)e',evidence:'Nuclide notation and isotopic data are the key AQA skills here.',model:'Electron positions are schematic. The cloud represents probability, not fixed planetary orbits.'},
    specific:{code:'3.2.1.1',name:'Specific charge',showing:'How charge-to-mass ratio changes for particles, nuclei and ions.',change:'Adjust proton number, nucleon number and ion/electron charge.',watch:'A small mass makes |Q/m| very large. This is why the electron has a much larger magnitude of specific charge than the proton.',science:'Specific charge is total charge divided by total mass. The sign tells you whether the object is positively or negatively charged.',equation:'specific charge = Q/m  (C kg⁻¹)',evidence:'Use SI charge and mass consistently.',model:'Binding-energy mass defects are ignored in this teaching calculation.'},
    strong:{code:'3.2.1.2',name:'Strong nuclear force',showing:'Two nucleons separated by a controllable distance measured in femtometres.',change:'Move the nucleons closer together or farther apart.',watch:'Beyond about 3 fm the force becomes negligible; from about 0.5–3 fm it is attractive; below about 0.5 fm it becomes repulsive.',science:'The attractive strong interaction helps bind the nucleus; the very-short-range repulsion prevents nucleons collapsing into one point.',equation:'AQA qualitative model: repulsive < ~0.5 fm; attractive to ~3 fm',evidence:'This short-range behaviour is part of the required AQA model.',model:'The displayed force curve is qualitative rather than a full nuclear-potential calculation.'},
    decay:{code:'3.2.1.2 / 3.2.1.7',name:'Alpha and beta decay',showing:'How an unstable nucleus changes during alpha, beta-minus and beta-plus processes, including the quark change in beta decay.',change:'Switch decay type and follow the daughter nucleus and emitted particles.',watch:'Alpha changes A and Z. Beta changes Z but leaves A unchanged. In β⁻ a neutron becomes a proton; in β⁺ a proton becomes a neutron.',science:'β processes occur through the weak interaction and require neutrinos/antineutrinos so conservation laws can be satisfied.',equation:'α: A−4, Z−2 · β⁻: n → p + e⁻ + ν̄ₑ · β⁺: p → n + e⁺ + νₑ',evidence:'At quark level β⁻ is d → u + W⁻; β⁺ is u → d + W⁺.',model:'The W boson is an interaction representation, not a visible ball travelling through the nucleus.'},
    antimatter:{code:'3.2.1.3',name:'Antimatter and photons',showing:'Electron–positron annihilation and photon pair production.',change:'Choose annihilation or pair production and change the available energy.',watch:'Annihilation converts rest energy plus kinetic energy into photons. Pair production needs at least the rest energy of the new particles.',science:'Particle and antiparticle have equal mass and opposite relevant quantum numbers. Energy and momentum must both be conserved.',equation:'E = mc²; photon E = hf; e⁻e⁺ threshold = 1.022 MeV',evidence:'A nearby nucleus can recoil during pair production so momentum is conserved.',model:'Photon paths are drawn as visible rays for teaching; photons are quantum objects.'},
    interactions:{code:'3.2.1.4',name:'Particle interactions',showing:'AQA-style exchange-particle diagrams for electromagnetic and weak interactions.',change:'Select the interaction/process and trace each incoming line, exchange particle and outgoing line.',watch:'Electromagnetic interactions use a virtual photon in this model. Weak processes involve W⁺ or W⁻ and can change quark flavour.',science:'Exchange-particle diagrams represent how momentum/energy and quantum numbers are transferred in an interaction.',equation:'β⁻: d → u + W⁻, then W⁻ → e⁻ + ν̄ₑ',evidence:'Check charge, baryon number, each lepton number, energy and momentum for the complete interaction.',model:'Feynman-style diagrams are not literal particle trajectories through space.'},
    classification:{code:'3.2.1.5',name:'Particle classification',showing:'The AQA particle family tree: hadrons, baryons, mesons and leptons, including strange particles.',change:'Choose different particles and compare family, interactions and quantum numbers.',watch:'Protons/neutrons are baryons; pions/kaons are mesons; electrons/muons/neutrinos are leptons.',science:'Hadrons experience the strong interaction. Baryons are three-quark states; mesons are quark–antiquark states.',equation:'Baryons B=+1; antibaryons B=−1; mesons/leptons B=0',evidence:'Strange particles are strongly produced with strangeness conserved and typically decay weakly.',model:'The family tree is a classification diagram, not a size or mass scale.'},
    quarks:{code:'3.2.1.6',name:'Quark builder',showing:'Up, down and strange quarks combining to form AQA hadrons.',change:'Build a proton, neutron, pion or kaon and inspect total charge, baryon number and strangeness.',watch:'Fractional quark charges add to whole-particle charge. Meson baryon number cancels to zero.',science:'u has +⅔e; d and s have −⅓e. Quarks have B=+⅓ and antiquarks B=−⅓. s has S=−1; s̄ has S=+1.',equation:'p = uud · n = udd · π⁺ = u d̄ · K⁺ = u s̄',evidence:'The quark model explains hadron quantum numbers and beta-decay flavour change.',model:'Quark positions and colours in the visual are symbolic, not physical photographs.'},
    photo:{code:'3.2.2.1',name:'Photoelectric effect',showing:'Photons striking a metal surface and either failing or succeeding in ejecting electrons.',change:'Change light frequency, intensity and the metal work function.',watch:'Below threshold frequency there is no emission whatever the intensity. Above threshold, frequency controls KEmax while intensity mainly controls emission rate.',science:'One photon transfers energy hf to one electron. The electron must first overcome the work function φ.',equation:'hf = φ + KEmax · KEmax = eVs · f₀ = φ/h',evidence:'Threshold frequency and instantaneous emission support the photon model of electromagnetic radiation.',model:'Electron paths and metal atoms are enlarged for visibility.'},
    collisions:{code:'3.2.2.2',name:'Electron collisions',showing:'An incident electron colliding with an atom and causing no change, excitation or ionisation.',change:'Change the incident electron energy.',watch:'Excitation only occurs when an allowed energy gap can be transferred. Ionisation occurs when enough energy is supplied to remove an electron.',science:'Atomic energies are discrete. An incident electron can retain leftover kinetic energy after transferring an allowed amount.',equation:'electron energy gained through p.d. = eV; 1 eV = 1.602 × 10⁻¹⁹ J',evidence:'This model links directly to excitation/ionisation and fluorescent-tube physics.',model:'The collision geometry is illustrative; the important quantity is energy transfer.'},
    levels:{code:'3.2.2.3',name:'Energy levels and spectra',showing:'Discrete atomic energy levels and a photon emitted or absorbed during a transition.',change:'Choose the starting and finishing energy levels.',watch:'Only particular energy differences are allowed, so only particular photon frequencies/wavelengths appear.',science:'A downward transition emits a photon; an upward transition needs energy equal to the gap.',equation:'ΔE = hf = hc/λ',evidence:'Discrete spectral lines are evidence for discrete atomic energy levels.',model:'Horizontal lines are allowed energies, not physical electron orbits.'},
    diffraction:{code:'3.2.2.4',name:'Electron diffraction',showing:'Electrons accelerated toward a crystal and a diffraction pattern produced by their wave behaviour.',change:'Increase or decrease accelerating voltage/momentum.',watch:'Higher momentum gives shorter de Broglie wavelength and smaller diffraction angles.',science:'Electrons are detected as particles but build a diffraction pattern associated with wave behaviour.',equation:'λ = h/p; non-relativistic p = √(2mₑeV)',evidence:'Electron diffraction is evidence for wave–particle duality.',model:'The rings are a teaching representation of diffraction from many crystal orientations.'},
    rutherford:{code:'3.8.1.1',name:'Rutherford scattering',showing:'Positive alpha particles approaching a positively charged nucleus and being deflected by electrostatic repulsion.',change:'Change impact parameter, nuclear charge and alpha energy where available.',watch:'A closer approach, larger nuclear charge or lower alpha energy produces a greater deflection.',science:'Most alpha particles pass almost straight because atoms are mostly empty space. Rare large-angle events require a tiny concentrated positive nucleus.',equation:'tan(θ/2) = kZz e²/(2Eb), with z=2 for α',evidence:'Large-angle/back scattering led to the nuclear model of the atom.',model:'This is a single-scattering Coulomb model. Use the dedicated Rutherford Experiment tab for the apparatus and statistical observations.'}
  };

  function activeId(){return $('.sim-tab.active')?.dataset.sim || $('#simNav .sim-tab')?.dataset.sim || 'atom'}
  function render(id=activeId()){
    const d=guide[id]||guide.atom, host=$('#simClarityGuide'); if(!host)return;
    host.innerHTML=`<div class="clarity-head"><div><span class="eyebrow">AQA ${d.code}</span><h3>What this simulation is showing</h3></div><span class="pill">${d.name}</span></div>
      <div class="clarity-grid">
        <div class="clarity-item"><span class="clarity-label">1 · What you are seeing</span><p>${d.showing}</p></div>
        <div class="clarity-item"><span class="clarity-label">2 · Change this</span><p>${d.change}</p></div>
        <div class="clarity-item"><span class="clarity-label">3 · Watch for</span><p>${d.watch}</p></div>
        <div class="clarity-item"><span class="clarity-label">4 · The science</span><p>${d.science}</p></div>
        <div class="clarity-item wide"><span class="clarity-label">Equation / key relationship</span><p class="clarity-equation">${d.equation}</p></div>
        <div class="clarity-item"><span class="clarity-label">What it demonstrates</span><p>${d.evidence}</p></div>
        <div class="clarity-item"><span class="clarity-label">Model warning</span><p class="clarity-note">${d.model}</p></div>
      </div>
      <div class="clarity-actions"><button class="button" id="clarityStep">Explain step by step</button>${id==='rutherford'?'<button class="button primary" id="clarityRuth">Open full Rutherford experiment</button>':''}</div>`;
    $('#clarityStep')?.addEventListener('click',()=>{
      const details=$('#simExtraHelp'); if(details){details.open=true; details.scrollIntoView({behavior:'smooth',block:'start'});}
      const g=$('.step-guide'); if(g) g.scrollIntoView({behavior:'smooth',block:'center'});
    });
    $('#clarityRuth')?.addEventListener('click',()=>document.querySelector('[data-view="rutherford-experiment"]')?.click());
    const select=$('#cleanSimSelect'); if(select && select.value!==id) select.value=id;
  }

  function buildPicker(){
    const nav=$('#simNav'); if(!nav||$('#cleanSimPicker'))return;
    const tabs=()=>$$('.sim-tab',nav);
    const box=document.createElement('div'); box.id='cleanSimPicker'; box.className='sim-picker-shell';
    box.innerHTML=`<div class="sim-picker-title">Choose simulation</div><label><span>Simulation</span><select id="cleanSimSelect"></select></label><button class="button" id="cleanPrev">← Previous</button><button class="button" id="cleanNext">Next →</button>`;
    nav.before(box);
    const fill=()=>{const s=$('#cleanSimSelect'); if(!s)return; const list=tabs(); if(!list.length)return; s.innerHTML=list.map(t=>`<option value="${t.dataset.sim}">${t.textContent.trim().replace(/\s+/g,' ')}</option>`).join(''); s.value=activeId();};
    fill();
    $('#cleanSimSelect')?.addEventListener('change',e=>nav.querySelector(`.sim-tab[data-sim="${e.target.value}"]`)?.click());
    const move=dir=>{const list=tabs(),i=Math.max(0,list.findIndex(t=>t.classList.contains('active'))),n=(i+dir+list.length)%list.length;list[n]?.click()};
    $('#cleanPrev')?.addEventListener('click',()=>move(-1)); $('#cleanNext')?.addEventListener('click',()=>move(1));
    new MutationObserver(()=>fill()).observe(nav,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }

  function organiseSide(){
    const side=$('.lab-side'); if(!side||$('#simClarityGuide'))return;
    const clarity=document.createElement('section');clarity.id='simClarityGuide';clarity.className='panel clarity-guide';
    const heading=$('.sim-heading',side),controls=$('#simControls'),readout=$('#simReadout');
    if(heading) heading.after(clarity); else side.prepend(clarity);
    if(readout && !$('#liveReadoutLabel')){const l=document.createElement('div');l.id='liveReadoutLabel';l.className='live-readout-label';l.textContent='Live physics readout';readout.before(l)}
    const details=document.createElement('details');details.id='simExtraHelp';details.className='sim-extra-help';details.innerHTML='<summary>More help: exam wording, misconceptions, step-by-step and deeper detail</summary><div class="sim-extra-content"></div>';
    side.appendChild(details); const content=$('.sim-extra-content',details);
    const keep=new Set([heading,clarity,controls,readout,$('#liveReadoutLabel'),details]);
    [...side.children].forEach(n=>{if(!keep.has(n) && n!==details)content.appendChild(n)});
    const observer=new MutationObserver(records=>{for(const r of records){for(const n of r.addedNodes){if(!(n instanceof HTMLElement))continue;if(n.parentElement===side && !keep.has(n)&&n!==details&&!n.matches('#simClarityGuide,#simControls,#simReadout,.sim-heading,#liveReadoutLabel'))content.appendChild(n)}}});
    observer.observe(side,{childList:true});
    render();
  }

  function hookTabs(){
    const nav=$('#simNav'); if(!nav)return;
    nav.addEventListener('click',e=>{const t=e.target.closest('.sim-tab');if(!t)return;setTimeout(()=>render(t.dataset.sim),0)});
    const title=$('#simTitle'); if(title)new MutationObserver(()=>render()).observe(title,{childList:true,characterData:true,subtree:true});
  }

  function init(){buildPicker();organiseSide();hookTabs();setTimeout(()=>{buildPicker();organiseSide();render()},250)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
