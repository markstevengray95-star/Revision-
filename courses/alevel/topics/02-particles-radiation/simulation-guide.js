(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const H = 6.62607015e-34;
  const C = 299792458;
  const E = 1.602176634e-19;
  const ME = 9.1093837015e-31;
  const MP = 1.67262192369e-27;
  const MN = 1.67492749804e-27;
  const K = 8.9875517923e9;

  const guides = {
    atom: {
      title:'Atomic structure and isotopes', code:'3.2.1.1', accuracy:'Electron positions are shown schematically. In an atom, electrons are described by a probability distribution rather than little planets on fixed circular paths.',
      steps:[
        ['Identify the nucleus','The nucleus contains protons and neutrons. Proton number Z tells you the element; nucleon number A is protons + neutrons.','A = Z + N, so neutron number N = A − Z.'],
        ['Check the charge','Each proton has charge +e, each electron −e and each neutron 0. A neutral atom has the same number of electrons as protons.','Net charge Q = (number of protons − number of electrons)e.'],
        ['Recognise an isotope','Changing the neutron number changes A but not Z. The element therefore stays the same.','Isotopes have the same proton number but different neutron numbers.'],
        ['Interpret the electron cloud','The cloud is a teaching representation of where electrons are likely to be found. Its scale is hugely exaggerated compared with the nucleus.','Do not describe electrons as orbiting the nucleus like planets in an exam.']
      ]
    },
    specific: {
      title:'Specific charge', code:'3.2.1.1', accuracy:'The calculation uses SI charges and particle masses. Nuclear binding-energy mass defects are ignored, which is appropriate for this A-level specific-charge model.',
      steps:[
        ['Find the net charge','Count positive proton charges and negative electron charges.','Q = (Z − Nₑ)e.'],
        ['Find the mass','Add the masses of the protons, neutrons and any electrons present. Electron mass is much smaller but is included here.','m ≈ Zmₚ + (A−Z)mₙ + Nₑmₑ.'],
        ['Divide charge by mass','Specific charge means charge per unit mass. Keep the sign of the charge.','specific charge = Q/m, unit C kg⁻¹.'],
        ['Sense-check the result','An electron has a much larger magnitude of specific charge than a proton because its mass is far smaller.','A negative ion has negative specific charge; a positive ion has positive specific charge.']
      ]
    },
    strong: {
      title:'Strong nuclear force', code:'3.2.1.2', accuracy:'The AQA model is qualitative: negligible beyond about 3 fm, attractive over normal nucleon separations, and repulsive at very short separation below roughly 0.5 fm.',
      steps:[
        ['Separate the nucleons','At separations greater than roughly 3 fm the strong interaction between nucleons is negligible.','The strong nuclear force is short range.'],
        ['Move them into nuclear range','Between about 0.5 fm and 3 fm the force is attractive, helping bind nucleons together.','This attraction can overcome proton–proton electrostatic repulsion at nuclear distances.'],
        ['Push them extremely close','Below roughly 0.5 fm the interaction becomes repulsive.','The repulsive core prevents nucleons collapsing into the same position.'],
        ['Relate this to stability','Nuclear stability depends on the balance of the strong interaction and electrostatic repulsion, as well as neutron–proton composition.','Do not say the strong force is simply “always attractive”.']
      ]
    },
    decay: {
      title:'Alpha and beta processes', code:'3.2.1.2 / 3.2.1.7', accuracy:'Beta decay is represented at both nuclear and quark level. Neutrinos/antineutrinos are included because charge, lepton number, energy and momentum must all be conserved.',
      steps:[
        ['Choose the process','Alpha emission removes a helium-4 nucleus. Beta processes change neutron/proton character through the weak interaction.','α: A decreases by 4 and Z by 2. β processes leave A unchanged.'],
        ['For β⁻, change a down quark','Inside a neutron, d → u + W⁻. The neutron udd becomes a proton uud.','n → p + W⁻.'],
        ['Let the W⁻ decay','The W⁻ produces an electron and an electron antineutrino.','W⁻ → e⁻ + ν̄ₑ, so n → p + e⁻ + ν̄ₑ.'],
        ['For β⁺, reverse the character change','Inside a proton, u → d + W⁺. The proton becomes a neutron.','W⁺ → e⁺ + νₑ, so p → n + e⁺ + νₑ when energetically possible in a nucleus.'],
        ['Check the nucleus','In β⁻, Z increases by 1. In β⁺, Z decreases by 1. A is unchanged in both.','Always check charge, baryon number and lepton number.']
      ]
    },
    antimatter: {
      title:'Antiparticles, annihilation and pair production', code:'3.2.1.3', accuracy:'The model enforces the important energy threshold and explains the role of a nearby nucleus in pair production so momentum can be conserved.',
      steps:[
        ['Match particle and antiparticle','A particle and its antiparticle have the same rest mass and opposite charge; other additive quantum numbers reverse sign.','For example e⁻ and e⁺ have equal mass and charges −e and +e.'],
        ['Annihilate the pair','Electron–positron annihilation converts their rest energy and any kinetic energy into photons.','Total energy and momentum must be conserved. Two photons are the common minimum arrangement for a low-momentum pair.'],
        ['Check the minimum energy','Creating an electron and positron requires at least twice the electron rest energy.','2mₑc² = 1.022 MeV.'],
        ['Create a pair','A photon with enough energy can produce e⁻ + e⁺ near a nucleus. The nucleus can recoil.','The nearby nucleus allows momentum as well as energy to be conserved.']
      ]
    },
    interactions: {
      title:'Particle interactions and exchange particles', code:'3.2.1.4', accuracy:'Exchange-particle drawings are schematic Feynman-style teaching diagrams. They represent interactions, not visible trajectories of tiny messenger balls.',
      steps:[
        ['Identify the interaction','Use the particles before and after to decide whether the process is electromagnetic, weak or strong. Gravity exists but is negligible in particle-physics examples at this level.','AQA expects the four fundamental interactions to be known.'],
        ['Electromagnetic interaction','Charged particles can interact by exchange of a virtual photon.','Exchange particle: virtual photon γ.'],
        ['Weak interaction','A quark can change flavour through W⁺ or W⁻ exchange/emission. Beta decay is the key example.','Required weak exchange particles here: W⁺ and W⁻.'],
        ['Strong interaction between nucleons','At AQA level, pion exchange can be used to model the strong interaction between nucleons.','Pions are mesons; this is a nucleon-level model.'],
        ['Read a diagram carefully','Track each incoming line, vertex/exchange particle and outgoing line, then test conservation laws.','At every complete interaction, charge, baryon number, lepton number, energy and momentum must be conserved.']
      ]
    },
    classification: {
      title:'Particle classification and strangeness', code:'3.2.1.5', accuracy:'The families follow the AQA classification: hadrons feel the strong interaction; baryons are three-quark states, mesons are quark–antiquark states; leptons are fundamental in this model.',
      steps:[
        ['Separate hadrons and leptons','Hadrons participate in the strong interaction. Leptons do not.','Protons/neutrons are hadrons; electrons/muons/neutrinos are leptons.'],
        ['Split the hadrons','Baryons contain three quarks; antibaryons contain three antiquarks. Mesons contain a quark and antiquark.','AQA examples: p, n; pions and kaons.'],
        ['Recognise strange particles','Kaons contain s or s̄ quarks. Strangeness is conserved in strong interactions but can change by 0 or ±1 in weak interactions.','Strange particles are typically produced via strong interaction and decay via weak interaction.'],
        ['Track the lepton family','Electron and electron-neutrino carry electron lepton number; muon and muon-neutrino carry muon lepton number. Antiparticles have the opposite value.','Separate electron and muon lepton numbers when checking interactions.'],
        ['Remember the muon','The muon is a lepton similar to a heavier electron and is unstable.','It is not made of quarks.']
      ]
    },
    quarks: {
      title:'Quarks and antiquarks', code:'3.2.1.6', accuracy:'Only u, d and s flavours and their antiquarks are used because these are the quarks specified for assessment in this section.',
      steps:[
        ['Assign quark properties','u has charge +2/3e; d and s each have −1/3e. Every quark has baryon number +1/3.','s has strangeness −1; u and d have strangeness 0.'],
        ['Reverse for antiquarks','Antiquarks have opposite charge, baryon number and strangeness to their matching quark.','For example s̄ has charge +1/3e, B = −1/3 and S = +1.'],
        ['Build baryons','Proton = uud and neutron = udd. Their antiparticles use the corresponding antiquarks.','Add fractional charges to check the total charge.'],
        ['Build mesons','Pions contain u/d combinations; kaons include a strange or antistrange quark.','Mesons have total baryon number 0 because +1/3 and −1/3 cancel.'],
        ['Connect to beta decay','In β⁻ a d quark changes to u; in β⁺ a u quark changes to d.','This is a weak-interaction flavour change.']
      ]
    },
    photo: {
      title:'Photoelectric effect', code:'3.2.2.1', accuracy:'The model uses one-photon–one-electron energy transfer, a material work function and the correct threshold condition. Intensity changes photon rate, not individual photon energy.',
      steps:[
        ['Photon arrives','Each photon has energy E = hf. Increasing frequency increases the energy of each photon.','Photon energy depends on frequency, not intensity.'],
        ['Compare with the work function','The work function φ is the minimum energy needed to release an electron from the surface.','Threshold frequency f₀ = φ/h.'],
        ['Decide whether emission occurs','If hf < φ, no electron is emitted however intense the light is. If hf ≥ φ, emission can occur immediately.','Threshold frequency is evidence for photon behaviour.'],
        ['Share the energy','Any energy above the work function becomes photoelectron kinetic energy.','hf = φ + KEₘₐₓ.'],
        ['Apply stopping potential','The stopping potential just prevents the fastest electrons reaching the collector.','KEₘₐₓ = eVₛ. Increasing intensity above threshold increases the number emitted per second, not KEₘₐₓ.']
      ]
    },
    collisions: {
      title:'Electron collisions, excitation and ionisation', code:'3.2.2.2', accuracy:'Electron energy gained through a potential difference is calculated using E = eV. Atomic energy transfers are discrete for excitation.',
      steps:[
        ['Accelerate an electron','An electron accelerated through potential difference V gains kinetic energy eV.','1 eV is the energy gained by one electron through 1 V; 1 eV = 1.602 × 10⁻¹⁹ J.'],
        ['Collide with an atom','The incident electron can transfer energy to an atomic electron.','The transferred amount must match an allowed excitation energy for excitation.'],
        ['Excite the atom','If enough appropriate energy is transferred, an atomic electron moves to a higher bound energy level.','The electron remains part of the atom.'],
        ['Ionise the atom','If the incident electron transfers at least the ionisation energy, an electron can be removed completely.','Ionisation is not the same as excitation.'],
        ['Explain a fluorescent tube','Electrons excite mercury atoms; emitted ultraviolet photons excite the phosphor coating, which then emits visible photons.','Use energy-level transitions to explain the emitted radiation.']
      ]
    },
    levels: {
      title:'Energy levels and line spectra', code:'3.2.2.3', accuracy:'The diagram shows energy levels, not electron orbits. Photon energy is exactly the difference between two allowed atomic energy states.',
      steps:[
        ['Select two levels','Atomic electrons can occupy discrete energy states.','The vertical spacing on an energy-level diagram represents an energy difference.'],
        ['Move upward by absorption','An upward transition requires absorption of a photon whose energy exactly matches the gap.','hf = ΔE.'],
        ['Move downward by emission','When an electron falls to a lower level, a photon is emitted.','Photon energy E = ΔE = hf = hc/λ.'],
        ['Build a line spectrum','Different allowed energy gaps produce photons at specific frequencies/wavelengths.','Discrete levels therefore give discrete spectral lines.'],
        ['Avoid the orbit misconception','An energy-level diagram is an energy representation, not a picture of electron paths around the nucleus.','Label it “energy level”, not “orbit”.']
      ]
    },
    diffraction: {
      title:'Wave–particle duality and electron diffraction', code:'3.2.2.4', accuracy:'For the non-relativistic voltages used in the classroom model, p = √(2mₑeV) and λ = h/p. Higher accelerating voltage therefore reduces wavelength and tightens the diffraction pattern.',
      steps:[
        ['Give the electron momentum','An accelerated electron has particle momentum. For a non-relativistic electron, its kinetic energy is eV.','p = √(2mₑeV).'],
        ['Assign a matter wavelength','de Broglie proposed that a particle with momentum p has wavelength λ = h/p.','Higher momentum means shorter wavelength.'],
        ['Pass electrons through graphite','The regularly spaced crystal planes act as a diffraction structure.','Diffraction is wave behaviour.'],
        ['Observe rings','Many tiny crystal orientations produce circular diffraction rings on the screen.','Electron arrival is particle-like, while the overall diffraction pattern is wave-like.'],
        ['Increase accelerating voltage','V rises → p rises → λ falls → diffraction angles become smaller.','This links the visible ring pattern directly to λ = h/p.']
      ]
    },
    rutherford: {
      title:'Rutherford alpha scattering extension', code:'3.8.1.1', accuracy:'The upgraded explanation uses Coulomb repulsion: a positive alpha particle approaching a positive nucleus is deflected more strongly for smaller impact parameter, larger nuclear charge or lower alpha-particle kinetic energy.',
      steps:[
        ['Fire alpha particles at thin foil','Alpha particles are positively charged helium nuclei. A thin foil reduces the chance of multiple scattering events.','Most alpha particles pass through with little deflection.'],
        ['Approach the positive nucleus','The alpha particle feels electrostatic repulsion from the concentrated positive nuclear charge.','The force grows rapidly as separation decreases.'],
        ['Change the impact parameter','A smaller impact parameter means a closer approach and therefore a larger deflection angle.','Head-on approaches can produce very large-angle scattering.'],
        ['Use the scattering relation','For a single Coulomb encounter, tan(θ/2) = kZz e²/(2Eb), where z = 2 for an alpha particle.','Larger Z or smaller b/E increases θ.'],
        ['Draw the conclusion','The rare large deflections require a tiny region containing most of the atom’s positive charge and mass.','Atoms are mostly empty space with a small, dense, positively charged nucleus.']
      ]
    }
  };

  let currentId='atom', stepIndex=0, autoTimer=null;

  function css(){
    if($('#stepGuideStyles')) return;
    const s=document.createElement('style'); s.id='stepGuideStyles'; s.textContent=`
      .step-guide{padding:14px;border-left:4px solid var(--good);display:grid;gap:10px}.step-guide-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-wrap:wrap}.step-guide-head h3{margin:0;font-size:1rem}.step-toolbar{display:flex;gap:6px;flex-wrap:wrap}.step-toolbar .button{min-height:38px;padding:7px 10px}.step-progress{display:flex;gap:5px;flex-wrap:wrap}.step-dot{width:28px;height:28px;border-radius:999px;border:1px solid var(--border);background:#0a192b;display:grid;place-items:center;font-size:.72rem;font-weight:900;cursor:pointer}.step-dot.active{border-color:var(--accent);background:#173650}.step-dot.done{border-color:var(--good);color:var(--good)}.step-card{border:1px solid var(--border);border-radius:12px;background:#091827;padding:12px}.step-card h4{margin:0 0 5px}.step-card p{margin:5px 0}.step-equation{font-family:Consolas,monospace;color:#bde8ff;background:#071522;border-radius:9px;padding:9px;margin-top:8px}.accuracy-note{border:1px solid #31577b;border-radius:11px;padding:10px;background:#0a192c;color:var(--muted);font-size:.82rem}.accuracy-calc{border:1px solid var(--border);border-radius:11px;padding:10px;background:#0a1729;font-size:.82rem}.accuracy-calc strong{color:#dff3ff}.step-number{color:#90d5ff;font-size:.76rem;font-weight:900}.step-actions{display:flex;justify-content:space-between;gap:8px}.step-actions .button{flex:1}.step-explain-toggle{white-space:nowrap}
    `; document.head.appendChild(s);
  }

  function selectedSim(){
    return $('.sim-tab.active')?.dataset.sim || currentId || 'atom';
  }

  function calcFor(id){
    try {
      if(id==='specific'){
        const Z=Number($('#scZ')?.value ?? 6), A=Math.max(Number($('#scA')?.value ?? 12),Z), Ne=Number($('#scE')?.value ?? Z);
        const q=(Z-Ne)*E, m=Z*MP+(A-Z)*MN+Ne*ME;
        return `<strong>Live physics:</strong> Q = ${(Z-Ne)}e = ${q.toExponential(3)} C; m ≈ ${m.toExponential(3)} kg; Q/m = ${(q/m).toExponential(3)} C kg⁻¹.`;
      }
      if(id==='strong'){
        const fm=Number($('#sep')?.value ?? 120)/100;
        const state=fm<0.5?'repulsive':fm<=3?'attractive':'negligible';
        return `<strong>Live physics:</strong> separation ≈ ${fm.toFixed(2)} fm, so the AQA strong-force model is currently <strong>${state}</strong>.`;
      }
      if(id==='photo'){
        const f=Number($('#pf')?.value ?? 8)*1e14, phi=Number($('#work')?.value ?? 2.3);
        const eph=H*f/E, ke=Math.max(0,eph-phi), f0=phi*E/H;
        return `<strong>Live physics:</strong> hf = ${eph.toFixed(2)} eV, φ = ${phi.toFixed(2)} eV, f₀ = ${(f0/1e14).toFixed(2)} × 10¹⁴ Hz, KEₘₐₓ = ${ke.toFixed(2)} eV${ke>0?`, Vₛ = ${ke.toFixed(2)} V`:'. No photoemission at this frequency.'}`;
      }
      if(id==='diffraction'){
        const V=Number($('#dv')?.value ?? $('#fbDv')?.value ?? 200);
        const p=Math.sqrt(2*ME*E*V), lam=H/p;
        return `<strong>Live physics:</strong> V = ${V.toFixed(0)} V → p ≈ ${p.toExponential(3)} kg m s⁻¹ → λ ≈ ${(lam*1e10).toFixed(3)} Å.`;
      }
      if(id==='rutherford'){
        const Z=Number($('#rz')?.value ?? $('#fbRz')?.value ?? 79), bFm=Number($('#rb')?.value ?? $('#fbRb')?.value ?? 70)/100;
        const energyMeV=5.0, b=bFm*1e-15, kinetic=energyMeV*1e6*E;
        const ratio=K*Z*2*E*E/(2*kinetic*Math.max(b,1e-18));
        const theta=2*Math.atan(ratio)*180/Math.PI;
        return `<strong>Coulomb estimate:</strong> with Z = ${Z}, b ≈ ${bFm.toFixed(2)} fm and a representative 5.0 MeV α particle, θ ≈ ${Math.min(theta,180).toFixed(1)}°. The on-screen path remains schematic; this calculation gives the physical trend and scale.`;
      }
      if(id==='levels'){
        return `<strong>Accuracy reminder:</strong> each emitted/absorbed photon must satisfy ΔE = hf exactly for the selected atomic transition.`;
      }
      if(id==='antimatter'){
        return `<strong>Threshold:</strong> e⁻/e⁺ pair creation needs at least 2mₑc² = ${(2*ME*C*C/E/1e6).toFixed(3)} MeV, plus any kinetic/recoil energy.`;
      }
    } catch(e) {}
    return '<strong>Accuracy check:</strong> the visual is schematic, but the quantities, conservation rules and relationships described here are the physical rules students should use in AQA answers.';
  }

  function ensurePanel(){
    css();
    const side=$('.lab-side'); if(!side) return null;
    let panel=$('#stepGuide');
    if(!panel){
      panel=document.createElement('section'); panel.id='stepGuide'; panel.className='panel step-guide';
      panel.innerHTML=`<div class="step-guide-head"><div><span class="eyebrow">Guided explanation</span><h3>Explain this simulation step by step</h3></div><button type="button" id="stepAuto" class="button step-explain-toggle">▶ Auto explain</button></div><div id="stepProgress" class="step-progress"></div><div id="stepContent" class="step-card" aria-live="polite"></div><div id="accuracyLive" class="accuracy-calc"></div><div id="accuracyNote" class="accuracy-note"></div><div class="step-actions"><button type="button" id="stepPrev" class="button">← Previous</button><button type="button" id="stepNext" class="button primary">Next step →</button></div>`;
      side.appendChild(panel);
      $('#stepPrev').addEventListener('click',()=>move(-1));
      $('#stepNext').addEventListener('click',()=>move(1));
      $('#stepAuto').addEventListener('click',toggleAuto);
    }
    return panel;
  }

  function render(id=selectedSim(), reset=false){
    const panel=ensurePanel(); if(!panel) return;
    const guide=guides[id] || guides.atom;
    if(id!==currentId || reset){currentId=id;stepIndex=0;stopAuto();}
    stepIndex=Math.max(0,Math.min(stepIndex,guide.steps.length-1));
    $('#stepProgress').innerHTML=guide.steps.map((_,i)=>`<button type="button" class="step-dot ${i===stepIndex?'active':''} ${i<stepIndex?'done':''}" data-step="${i}" aria-label="Go to step ${i+1}">${i+1}</button>`).join('');
    $$('#stepProgress [data-step]').forEach(b=>b.addEventListener('click',()=>{stepIndex=Number(b.dataset.step);render(currentId);}));
    const [name,body,equation]=guide.steps[stepIndex];
    $('#stepContent').innerHTML=`<div class="step-number">STEP ${stepIndex+1} OF ${guide.steps.length} · AQA ${guide.code}</div><h4>${name}</h4><p>${body}</p><div class="step-equation">${equation}</div>`;
    $('#accuracyLive').innerHTML=calcFor(id);
    $('#accuracyNote').innerHTML=`<strong>Model accuracy:</strong> ${guide.accuracy}`;
    $('#stepPrev').disabled=stepIndex===0;
    $('#stepNext').textContent=stepIndex===guide.steps.length-1?'Restart explanation':'Next step →';
  }

  function move(delta){
    const guide=guides[currentId] || guides.atom;
    if(delta>0 && stepIndex===guide.steps.length-1) stepIndex=0;
    else stepIndex=Math.max(0,Math.min(guide.steps.length-1,stepIndex+delta));
    render(currentId);
  }

  function stopAuto(){
    if(autoTimer){clearInterval(autoTimer);autoTimer=null;}
    const b=$('#stepAuto'); if(b) b.textContent='▶ Auto explain';
  }

  function toggleAuto(){
    if(autoTimer){stopAuto();return;}
    const b=$('#stepAuto'); if(b) b.textContent='⏸ Stop auto explain';
    autoTimer=setInterval(()=>{
      const guide=guides[currentId]||guides.atom;
      if(stepIndex>=guide.steps.length-1){stopAuto();return;}
      stepIndex++; render(currentId);
    },4200);
  }

  function attach(){
    ensurePanel(); render(selectedSim(),true);
    document.addEventListener('click',e=>{
      const tab=e.target.closest?.('.sim-tab');
      if(tab) setTimeout(()=>render(tab.dataset.sim,true),50);
      if(e.target.closest?.('#lessonSim,#mapOpen,#resLessonSim,#resMapOpen')) setTimeout(()=>render(selectedSim(),true),120);
    });
    document.addEventListener('input',e=>{
      if(e.target.closest?.('#simControls')) setTimeout(()=>{const live=$('#accuracyLive'); if(live) live.innerHTML=calcFor(selectedSim());},0);
    });
    document.addEventListener('change',e=>{
      if(e.target.closest?.('#simControls')) setTimeout(()=>{const live=$('#accuracyLive'); if(live) live.innerHTML=calcFor(selectedSim());},0);
    });
    const observer=new MutationObserver(()=>{
      const id=selectedSim();
      if(id!==currentId) render(id,true);
      const live=$('#accuracyLive'); if(live) live.innerHTML=calcFor(id);
    });
    const nav=$('#simNav'); if(nav) observer.observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',attach,{once:true}); else attach();
})();