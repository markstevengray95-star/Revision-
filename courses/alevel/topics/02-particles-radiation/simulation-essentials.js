
(() => {
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleStudyViewV1';

  const data={
    atom:{
      code:'AQA 3.2.1.1',
      title:'Atomic structure & isotopes',
      core:[
        'Proton: charge +e, neutron: charge 0, electron: charge −e.',
        'Proton number Z = number of protons. Nucleon number A = protons + neutrons.',
        'Neutrons = A − Z. A neutral atom has electrons = protons.',
        'Isotopes are atoms of the same element with the same Z but different neutron numbers.'
      ],
      equations:[
        ['N = A − Z','number of neutrons'],
        ['specific charge = Q / m','charge per unit mass']
      ],
      values:[
        ['Proton','charge +1 relative / +1.602 × 10⁻¹⁹ C; relative mass 1 / 1.673 × 10⁻²⁷ kg'],
        ['Neutron','charge 0; relative mass 1 / 1.675 × 10⁻²⁷ kg'],
        ['Electron','charge −1 relative / −1.602 × 10⁻¹⁹ C; relative mass ≈ 1/1836 / 9.11 × 10⁻³¹ kg']
      ],
      exam:'Use nuclide notation correctly: ᴬZX. If Z changes, the element changes. If only neutron number changes, the isotope changes.',
      trap:'Do not say isotopes have different proton numbers. They have the same Z and different neutron numbers.',
      remember:['Z = protons','A = p + n','neutral atom: e⁻ = p','isotopes: same Z, different n']
    },
    specific:{
      code:'AQA 3.2.1.1',
      title:'Specific charge',
      core:[
        'Specific charge is charge per unit mass.',
        'For an ion or nucleus, total charge comes from the imbalance between protons and electrons.',
        'Electrons contribute very little to total mass compared with nucleons.',
        'The electron has a much larger |Q/m| than the proton because its mass is much smaller.'
      ],
      equations:[
        ['specific charge = Q / m','unit: C kg⁻¹'],
        ['Q = (Z − Nₑ)e','net charge of an ion']
      ],
      values:[
        ['Elementary charge e','1.602 × 10⁻¹⁹ C'],['Proton specific charge','≈ +9.58 × 10⁷ C kg⁻¹'],
        ['Electron specific charge','≈ −1.76 × 10¹¹ C kg⁻¹']
      ],
      exam:'State both the sign and the unit. For nuclei/ions, calculate total charge and total mass before dividing.',
      trap:'Do not divide the charge of one proton by the mass of the whole ion unless that is what the question asks.',
      remember:['Q/m','C kg⁻¹','electron |Q/m| ≫ proton |Q/m|','ion charge depends on electron loss/gain']
    },
    strong:{
      code:'AQA 3.2.1.2',
      title:'Strong nuclear force',
      core:[
        'The strong nuclear force acts between nucleons and helps bind nuclei.',
        'At typical nuclear separations it is attractive.',
        'At very small separation it becomes strongly repulsive.',
        'It is short range and becomes negligible beyond a few femtometres.'
      ],
      equations:[],
      values:[
        ['Repulsive region','closer than about 0.5 fm'],
        ['Attractive range','up to about 3 fm'],
        ['1 femtometre','1 fm = 10⁻¹⁵ m']
      ],
      exam:'Describe the force as a function of separation. “Strong” alone is not enough — mention attractive, repulsive and short-range behaviour.',
      trap:'Do not confuse the strong nuclear force between nucleons with electrostatic repulsion between protons.',
      remember:['< 0.5 fm: repulsive','~0.5–3 fm: attractive','> few fm: negligible']
    },
    decay:{
      code:'AQA 3.2.1.2 / 3.2.1.7',
      title:'Alpha and beta decay',
      core:[
        'Alpha decay emits a helium nucleus: two protons and two neutrons.',
        'In β⁻ decay a neutron changes into a proton, electron and electron antineutrino.',
        'In β⁺ decay a proton changes into a neutron, positron and electron neutrino.',
        'Charge, baryon number, lepton number, energy and momentum must be conserved.'
      ],
      equations:[
        ['α: A → A − 4, Z → Z − 2','alpha decay'],
        ['β⁻: n → p + e⁻ + ν̄ₑ','beta-minus decay'],
        ['β⁺: p → n + e⁺ + νₑ','beta-plus decay']
      ],
      values:[],
      exam:'For nuclear equations, balance A and Z first. For particle reactions, then check charge, baryon number and lepton number.',
      trap:'The beta electron is created in the decay; it is not an orbital electron leaving the atom.',
      remember:['α: A−4, Z−2','β⁻: A same, Z+1','β⁺: A same, Z−1','include ν / ν̄']
    },
    antimatter:{
      code:'AQA 3.2.1.3',
      title:'Particles, antiparticles & photons',
      core:[
        'Every particle has a corresponding antiparticle.',
        'Particle and antiparticle have the same mass and rest energy.',
        'Relevant additive quantum numbers are opposite; electric charge is opposite where the particle is charged.',
        'Annihilation converts particle/antiparticle energy into other particles, commonly photons in the e⁻/e⁺ example.',
        'Pair production converts photon energy into a particle–antiparticle pair when energy and momentum can be conserved.'
      ],
      equations:[
        ['E = hf','photon energy'],
        ['E = hc / λ','photon energy from wavelength'],
        ['E₀ = mc²','rest energy']
      ],
      values:[
        ['Electron rest energy','0.511 MeV'],['e⁻ + e⁺ minimum rest energy','1.022 MeV'],
        ['Planck constant h','6.626 × 10⁻³⁴ J s'],['Speed of light c','3.00 × 10⁸ m s⁻¹']
      ],
      exam:'A nearby nucleus/body in pair production allows momentum conservation. In annihilation, conserve both energy and momentum.',
      trap:'“Antiparticle” does not simply mean “negative particle”. A neutron and antineutron are both neutral.',
      remember:['same mass','opposite additive quantum numbers','annihilation','pair production ≥ rest energy']
    },
    interactions:{
      code:'AQA 3.2.1.4',
      title:'Particle interactions',
      core:[
        'The four fundamental interactions are gravity, electromagnetic, weak and strong.',
        'Exchange particles are used to model interactions between elementary particles.',
        'Electromagnetic interactions use virtual photons in the AQA model.',
        'Weak processes tested include β⁻, β⁺, electron capture and electron–proton collisions.',
        'W⁺ and W⁻ are the charged weak exchange particles required by AQA.'
      ],
      equations:[],
      values:[],
      exam:'Read diagrams by identifying incoming particles, outgoing particles and the exchange particle. Check conservation at each interaction.',
      trap:'AQA does not require gluon, Z⁰ or graviton knowledge in this section.',
      remember:['EM → virtual γ','weak → W⁺ / W⁻','exchange transfers energy/momentum','check conservation']
    },
    classification:{
      code:'AQA 3.2.1.5',
      title:'Classification of particles',
      core:[
        'Hadrons experience the strong interaction; leptons do not.',
        'Hadrons are baryons or mesons.',
        'Baryons include proton and neutron; mesons include pions and kaons.',
        'Leptons required include electron, muon, electron neutrino and muon neutrino plus antiparticles.',
        'The proton is the only stable baryon into which other baryons eventually decay.',
        'The pion is used in the AQA model as the exchange particle of the strong nuclear force between nucleons.',
        'The muon is a lepton that decays to products including an electron.',
        'Strange particles are produced via the strong interaction, with total strangeness conserved, and decay via the weak interaction.',
        'Modern particle physics depends on large collaborations reproducing and validating new knowledge.'
      ],
      equations:[],
      values:[
        ['Baryon number','baryon +1, antibaryon −1, others 0'],
        ['Lepton number','tracked separately for electron and muon families'],
        ['Strangeness in strong interactions','conserved; strange particles are produced with balancing strangeness'],
        ['Strangeness in weak interactions','may change by 0 or ±1']
      ],
      exam:'Give the full classification when asked: e.g. proton = hadron + baryon; pion = hadron + meson; electron = lepton.',
      trap:'Do not call a proton a lepton, or a pion a baryon.',
      remember:['hadrons feel strong','baryon = 3 quarks','meson = q + q̄','leptons do not feel strong']
    },
    quarks:{
      code:'AQA 3.2.1.6',
      title:'Quarks and antiquarks',
      core:[
        'Only up u, down d and strange s quarks and their antiquarks are required.',
        'u has charge +2/3 e; d and s each have charge −1/3 e.',
        'Every quark has B = +1/3; every antiquark has B = −1/3.',
        's has strangeness −1; s̄ has strangeness +1.',
        'Proton = uud and neutron = udd.',
        'Mesons are one quark + one antiquark; baryons are three quarks.'
      ],
      equations:[
        ['p = uud','proton'],
        ['n = udd','neutron'],
        ['β⁻ at quark level: d → u','neutron becomes proton'],
        ['β⁺ at quark level: u → d','proton becomes neutron']
      ],
      values:[
        ['u','Q = +2/3 e, B = +1/3, S = 0'],
        ['d','Q = −1/3 e, B = +1/3, S = 0'],
        ['s','Q = −1/3 e, B = +1/3, S = −1'],
        ['antiquarks','reverse Q, B and S']
      ],
      exam:'Add charge, B and S constituent by constituent. This is usually safer than relying on memory alone.',
      trap:'A meson is not three quarks. It is one quark plus one antiquark.',
      remember:['u +2/3','d,s −1/3','quark B +1/3','antiquark B −1/3','s: S−1']
    },
    photo:{
      code:'AQA 3.2.2.1',
      title:'Photoelectric effect',
      core:[
        'Electromagnetic radiation transfers energy in photons of energy hf.',
        'One photon transfers its energy to one electron.',
        'Below threshold frequency, no photoelectrons are emitted regardless of intensity.',
        'Above threshold, increasing frequency increases maximum photoelectron kinetic energy.',
        'Increasing intensity at fixed frequency mainly increases the photon arrival rate and therefore emitted-electron rate.'
      ],
      equations:[
        ['E = hf','photon energy'],
        ['hf = φ + KEmax','photoelectric equation'],
        ['KEmax = eVs','stopping potential'],
        ['f₀ = φ / h','threshold frequency']
      ],
      values:[
        ['Work function φ','minimum energy to remove an electron'],
        ['Threshold frequency f₀','minimum frequency for emission'],
        ['Stopping potential Vs','reverse potential that stops fastest photoelectrons']
      ],
      exam:'Use frequency to discuss photon energy. Use intensity to discuss the number/rate of photons, not the energy per photon.',
      trap:'Higher intensity does not increase photon energy if frequency is unchanged.',
      remember:['one photon → one electron','hf ≥ φ','KEmax = hf − φ','KEmax = eVs']
    },
    collisions:{
      code:'AQA 3.2.2.2',
      title:'Electron collisions with atoms',
      core:[
        'Excitation raises an atomic electron to a higher bound energy level.',
        'Ionisation removes an electron from the atom completely.',
        'For excitation, the incident electron must transfer exactly an allowed energy-level difference.',
        'An incident electron can keep leftover kinetic energy after excitation.',
        'Fluorescent tubes involve electron collisions, excitation/ionisation and later photon emission.'
      ],
      equations:[
        ['1 eV = 1.602 × 10⁻¹⁹ J','electron-volt conversion'],
        ['E(eV) = E(J) / e','joule to eV conversion']
      ],
      values:[],
      exam:'State clearly whether the atom is excited or ionised, and explain what happens to the incident electron’s remaining kinetic energy.',
      trap:'Excitation does not mean the electron has left the atom. That is ionisation.',
      remember:['excitation = still bound','ionisation = removed','convert eV ↔ J']
    },
    levels:{
      code:'AQA 3.2.2.3',
      title:'Energy levels & line spectra',
      core:[
        'Atomic electrons occupy discrete allowed energy levels.',
        'A downward transition emits a photon.',
        'The photon energy equals the difference between the two energy levels.',
        'Line spectra are evidence for discrete atomic energy levels because only certain photon energies are emitted.',
        'Energy levels may be given in joules or electron volts.'
      ],
      equations:[
        ['ΔE = hf','transition energy'],
        ['ΔE = hc / λ','transition wavelength'],
        ['f = ΔE / h','photon frequency']
      ],
      values:[],
      exam:'On an energy-level diagram, the horizontal lines represent allowed energies, not physical electron orbits.',
      trap:'Do not describe the electron as travelling along the drawn transition arrow in physical space.',
      remember:['discrete levels','down → photon emitted','ΔE = hf','line spectra = evidence']
    },
    diffraction:{
      code:'AQA 3.2.2.4',
      title:'Wave–particle duality',
      core:[
        'Electron diffraction shows that particles can display wave behaviour.',
        'The photoelectric effect shows that electromagnetic radiation can display particle behaviour.',
        'A moving particle has a de Broglie wavelength λ = h/p.',
        'Increasing particle momentum decreases its de Broglie wavelength.',
        'A shorter wavelength generally produces less diffraction for the same structure.',
        'Changes to models of matter are evaluated through evidence, peer review, replication and validation by the scientific community.'
      ],
      equations:[
        ['λ = h / p','de Broglie wavelength'],
        ['p = mv','non-relativistic momentum where appropriate'],
        ['p = √(2m eV)','electron momentum after acceleration from rest through V, non-relativistic']
      ],
      values:[],
      exam:'Link the observed change in diffraction to λ = h/p: greater momentum → shorter wavelength → reduced diffraction. AQA requires the evidence and trend, not details of a particular diffraction method.',
      trap:'Do not say the electron is literally a classical water wave. It exhibits wave properties.',
      remember:['electron diffraction → wave evidence','photoelectric → photon evidence','λ = h/p']
    },
    rutherford:{
      code:'AQA 3.8.1.1 · A-level extension',
      title:'Rutherford scattering',
      core:[
        'Most alpha particles pass through with little deflection.',
        'Some are deflected through moderate angles.',
        'A very small number undergo large-angle or backward scattering.',
        'The observations imply that most of the atom is empty space.',
        'Positive charge and most atomic mass are concentrated in a tiny central nucleus.'
      ],
      equations:[
        ['Coulomb repulsion ∝ 1 / r²','closer approach → stronger force'],
        ['smaller impact parameter b → larger θ','qualitative scattering trend'],
        ['higher alpha kinetic energy → smaller θ','for the same encounter']
      ],
      values:[],
      exam:'Write observation first, then inference. Example: “very few large-angle deflections” → “a tiny region contains concentrated positive charge and most mass”.',
      trap:'Rutherford scattering is AQA 3.8.1.1 Nuclear Physics, not core 3.2 Particles and Radiation.',
      remember:['most straight → empty space','few deflect → positive nucleus','rare backwards → tiny dense nucleus']
    }
  };

  let mode='focus';
  try{mode=localStorage.getItem(STORE)||'focus'}catch{}

  const currentSim=()=>$('#simNav .sim-tab.active')?.dataset.sim||'atom';

  function addToolbar(){
    const side=$('.lab-side');
    if(!side||$('#simStudyToolbar'))return;
    const el=document.createElement('div');
    el.id='simStudyToolbar';el.className='sim-study-toolbar';
    el.innerHTML='<div><span class="study-label">Student view</span><button class="study-mode-button" data-study-mode="focus">Focus</button><button class="study-mode-button" data-study-mode="full">Full tools</button></div><span id="studySpecPill" class="study-spec-pill"></span>';
    side.prepend(el);
    $$('[data-study-mode]',el).forEach(b=>b.onclick=()=>setMode(b.dataset.studyMode));
  }

  function addEssentials(){
    const side=$('.lab-side');
    if(!side||$('#simEssentials'))return;
    const el=document.createElement('section');
    el.id='simEssentials';el.className='sim-essentials';
    const toolbar=$('#simStudyToolbar');
    if(toolbar)toolbar.insertAdjacentElement('afterend',el);else side.prepend(el);
  }

  function setMode(next){
    mode=next;
    try{localStorage.setItem(STORE,mode)}catch{}
    document.body.classList.toggle('sim-focus-mode',mode==='focus');
    document.body.classList.toggle('sim-full-mode',mode==='full');
    $$('[data-study-mode]').forEach(b=>b.classList.toggle('active',b.dataset.studyMode===mode));
  }

  function render(tab='core'){
    addToolbar();addEssentials();setMode(mode);
    const d=data[currentSim()]||data.atom;
    const pill=$('#studySpecPill');if(pill)pill.textContent=d.code;
    const box=$('#simEssentials');if(!box)return;
    box.innerHTML=
      '<div class="sim-essentials-head"><div><span class="eyebrow">Exam essentials</span><h3>'+d.title+'</h3></div><p>Everything worth learning from this model</p></div>'+
      '<div class="sim-essentials-tabs">'+
        ['core','maths','exam'].map(x=>'<button class="sim-essential-tab '+(x===tab?'active':'')+'" data-essential-tab="'+x+'">'+({core:'Must know',maths:'Maths & values',exam:'Exam technique'}[x])+'</button>').join('')+
      '</div><div class="sim-essential-body" id="simEssentialBody"></div>';
    $$('[data-essential-tab]',box).forEach(b=>b.onclick=()=>render(b.dataset.essentialTab));
    renderBody(d,tab);
  }

  function renderBody(d,tab){
    const body=$('#simEssentialBody');if(!body)return;
    if(tab==='core'){
      body.innerHTML='<div class="essential-grid">'+
        '<div class="essential-card"><strong>Core knowledge</strong><ul>'+d.core.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>'+
        '<div class="essential-card"><strong>Memorise these</strong><div class="essential-memory">'+d.remember.map(x=>'<span class="memory-chip">'+x+'</span>').join('')+'</div></div>'+
      '</div>';
      return;
    }
    if(tab==='maths'){
      const eq=d.equations.length
        ? d.equations.map(x=>'<div class="essential-equation"><code>'+x[0]+'</code><span>'+x[1]+'</span></div>').join('')
        : '<p>No extra equation needs memorising for this simulation. Concentrate on the qualitative physics and exam wording.</p>';
      const vals=d.values.length
        ? '<table class="essential-value-table"><thead><tr><th>Quantity</th><th>What to know</th></tr></thead><tbody>'+d.values.map(x=>'<tr><td>'+x[0]+'</td><td>'+x[1]+'</td></tr>').join('')+'</tbody></table>'
        : '<p>No fixed numerical value is central to this simulation. Use values supplied in the question and keep units consistent.</p>';
      body.innerHTML='<div class="essential-grid"><div class="essential-card"><strong>Equations / relationships</strong>'+eq+'</div><div class="essential-card"><strong>Values, units & definitions</strong>'+vals+'</div></div>';
      return;
    }
    body.innerHTML='<div class="essential-grid">'+
      '<div class="essential-card essential-exam"><strong>How to score the marks</strong><p>'+d.exam+'</p></div>'+
      '<div class="essential-card essential-trap"><strong>Common exam trap</strong><p>'+d.trap+'</p></div>'+
    '</div>';
  }

  function refresh(){
    render('core');
  }

  function init(){
    refresh();
    $('#simNav')?.addEventListener('click',e=>{
      if(e.target.closest?.('.sim-tab'))setTimeout(refresh,70);
    });
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,220),{once:true});
  else setTimeout(init,220);
})();
