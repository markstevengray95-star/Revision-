
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleRevisionHubV1';

  let state={
    active:'today', flashIndex:0, showBack:false, due:{}, quizAnswers:{},
    errors:[], spec:{}, formulaIndex:0, definitionIndex:0
  };
  try{state={...state,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{}
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));

  const topicNames={
    atom:'Atomic structure',specific:'Specific charge',strong:'Strong nuclear force',decay:'Radioactive decay',
    antimatter:'Antiparticles & photons',interactions:'Particle interactions',classification:'Particle classification',
    quarks:'Quarks',conservation:'Conservation laws',photo:'Photoelectric effect',collisions:'Electron collisions',
    levels:'Energy levels',diffraction:'Wave–particle duality',rutherford:'Rutherford extension'
  };

  const glossary=[
    ['atomic number Z','Number of protons in the nucleus.','atom'],
    ['nucleon number A','Total number of protons and neutrons.','atom'],
    ['nuclide','Nucleus specified by A and Z.','atom'],
    ['isotope','Atoms of the same element with the same Z but different neutron numbers.','atom'],
    ['specific charge','Charge per unit mass, Q/m, in C kg⁻¹.','specific'],
    ['nucleon','A proton or neutron.','strong'],
    ['strong nuclear force','Short-range interaction between nucleons: repulsive very close, attractive over nuclear distances.','strong'],
    ['alpha particle','Helium nucleus containing two protons and two neutrons.','decay'],
    ['beta-minus decay','Weak decay in which neutron character changes to proton character with e⁻ and ν̄ₑ emitted.','decay'],
    ['beta-plus decay','Weak decay in which proton character changes to neutron character with e⁺ and νₑ emitted.','decay'],
    ['neutrino','Neutral lepton with very small mass that participates in weak interactions.','decay'],
    ['antiparticle','Partner particle with the same mass/rest energy and opposite relevant additive quantum numbers.','antimatter'],
    ['positron','Antiparticle of the electron.','antimatter'],
    ['annihilation','Particle–antiparticle process producing other particles while conserving energy and momentum.','antimatter'],
    ['pair production','Creation of a particle–antiparticle pair from photon energy.','antimatter'],
    ['photon','Quantum of electromagnetic radiation with energy hf.','antimatter'],
    ['exchange particle','Particle used to represent an interaction and transfer of energy/momentum.','interactions'],
    ['virtual photon','Exchange particle used to model electromagnetic interactions.','interactions'],
    ['W boson','Charged weak-interaction exchange particle, W⁺ or W⁻.','interactions'],
    ['hadron','Particle subject to the strong interaction.','classification'],
    ['baryon','Hadron made from three quarks.','classification'],
    ['meson','Hadron made from a quark and antiquark.','classification'],
    ['lepton','Fundamental particle not subject to the strong interaction.','classification'],
    ['strangeness','Quantum number associated with strange quarks.','classification'],
    ['pion','Meson; in the AQA model it is the exchange particle of the strong nuclear force between nucleons.','classification'],
    ['kaon','Strange meson containing an s or s̄ quark.','classification'],
    ['muon','Lepton similar to a heavy electron that decays to products including an electron.','classification'],
    ['up quark','u quark: charge +2/3 e, B = +1/3, S = 0.','quarks'],
    ['down quark','d quark: charge −1/3 e, B = +1/3, S = 0.','quarks'],
    ['strange quark','s quark: charge −1/3 e, B = +1/3, S = −1.','quarks'],
    ['baryon number','Additive quantum number: baryons +1, antibaryons −1, mesons/leptons 0.','conservation'],
    ['lepton number','Additive quantum number conserved separately for electron and muon lepton families.','conservation'],
    ['work function φ','Minimum energy needed to remove an electron from a metal surface.','photo'],
    ['threshold frequency f₀','Minimum frequency that can produce photoelectrons.','photo'],
    ['stopping potential Vs','Reverse potential that stops the fastest photoelectrons.','photo'],
    ['photoelectron','Electron emitted from a material in the photoelectric effect.','photo'],
    ['excitation','Bound electron moves to a higher allowed energy level.','collisions'],
    ['ionisation','Electron is removed from the atom.','collisions'],
    ['electron volt','Energy gained by charge e when moved through a potential difference of 1 V.','collisions'],
    ['energy level','Allowed discrete energy state for an electron in an atom.','levels'],
    ['line spectrum','Discrete emitted/absorbed wavelengths caused by transitions between energy levels.','levels'],
    ['de Broglie wavelength','Matter wavelength λ = h/p.','diffraction'],
    ['wave–particle duality','Evidence that quantum objects display both wave-like and particle-like behaviour.','diffraction'],
    ['diffraction','Spreading/interference behaviour associated with waves.','diffraction'],
    ['impact parameter','Perpendicular offset of an incoming alpha path from the nuclear centre if undeflected.','rutherford'],
    ['peer review','Evaluation of scientific work by other experts before wider acceptance.','diffraction'],
    ['model','Evidence-based representation used to explain observations and make predictions.','rutherford']
  ];

  const flashcards=[
    ['atom','What does proton number Z tell you?','The number of protons; it identifies the element.'],
    ['atom','How do you find neutron number?','N = A − Z.'],
    ['atom','Define isotopes.','Atoms of the same element with the same proton number but different neutron numbers.'],
    ['specific','Define specific charge and state its unit.','Specific charge = Q/m, in C kg⁻¹.'],
    ['specific','Why is |Q/m| much larger for an electron than a proton?','They have equal charge magnitude but the electron has much smaller mass.'],
    ['strong','Describe the strong nuclear force below about 0.5 fm.','Strongly repulsive.'],
    ['strong','Describe the strong nuclear force from about 0.5–3 fm.','Attractive.'],
    ['strong','What happens beyond a few fm?','The strong nuclear force becomes negligible.'],
    ['decay','How do A and Z change in alpha decay?','A −4 and Z −2.'],
    ['decay','How do A and Z change in β⁻ decay?','A unchanged, Z +1.'],
    ['decay','Write the neutron-level β⁻ equation.','n → p + e⁻ + ν̄ₑ.'],
    ['antimatter','What stays the same for particle and antiparticle?','Mass and rest energy.'],
    ['antimatter','Minimum rest energy for e⁻e⁺ pair production?','1.022 MeV.'],
    ['antimatter','Why is a nearby nucleus useful in pair production?','It can recoil so momentum can be conserved.'],
    ['interactions','Exchange particle for electromagnetic interaction?','Virtual photon.'],
    ['interactions','Exchange particles for the charged weak interaction?','W⁺ and W⁻.'],
    ['classification','What is a hadron?','A particle subject to the strong interaction.'],
    ['classification','Baryon vs meson?','Baryon = three quarks; meson = quark + antiquark.'],
    ['classification','How are strange particles produced and how do they decay?','Produced via strong interaction, decay via weak interaction.'],
    ['classification','What happens to a muon?','It decays to products including an electron.'],
    ['quarks','Charge, B and S of u?','Q = +2/3 e, B = +1/3, S = 0.'],
    ['quarks','Charge, B and S of s?','Q = −1/3 e, B = +1/3, S = −1.'],
    ['quarks','Quark content of proton and neutron?','p = uud, n = udd.'],
    ['conservation','Which quantities are conserved in all particle interactions studied?','Charge, baryon number, lepton number, energy and momentum.'],
    ['conservation','When is strangeness conserved?','In strong interactions; in weak interactions it may change by 0 or ±1.'],
    ['photo','State the photoelectric equation.','hf = φ + KEmax.'],
    ['photo','What does intensity change at fixed frequency?','Mainly photon arrival rate / photoelectron emission rate, not photon energy.'],
    ['photo','What happens below threshold frequency?','No photoelectron emission regardless of intensity.'],
    ['photo','How is stopping potential related to KEmax?','KEmax = eVs.'],
    ['collisions','Excitation vs ionisation?','Excitation: electron remains bound at higher level. Ionisation: electron removed.'],
    ['collisions','Convert 1 eV to J.','1 eV = 1.602 × 10⁻¹⁹ J.'],
    ['levels','Why are atomic spectra lines discrete?','Only discrete ΔE values are possible between allowed energy levels.'],
    ['levels','Photon energy from a transition?','ΔE = hf = hc/λ.'],
    ['diffraction','State the de Broglie equation.','λ = h/p.'],
    ['diffraction','What happens to λ if p doubles?','λ halves.'],
    ['diffraction','What evidence supports particle behaviour of EM radiation?','Photoelectric effect.'],
    ['diffraction','What evidence supports wave behaviour of matter?','Electron diffraction.'],
    ['rutherford','What does “most alpha particles pass straight through” imply?','Atoms are mostly empty space.'],
    ['rutherford','What do rare large-angle deflections imply?','Positive charge and most mass are concentrated in a tiny nucleus.'],
    ['rutherford','Effect of decreasing impact parameter?','Stronger repulsion and larger scattering angle.']
  ];

  const formulas=[
    ['N = A − Z','neutron number','atom'],
    ['specific charge = Q / m','charge per unit mass','specific'],
    ['E = hf','photon energy','antimatter'],
    ['E = hc / λ','photon energy from wavelength','antimatter'],
    ['E₀ = mc²','rest energy','antimatter'],
    ['hf = φ + KEmax','photoelectric equation','photo'],
    ['KEmax = eVs','stopping potential relation','photo'],
    ['f₀ = φ / h','threshold frequency','photo'],
    ['1 eV = 1.602 × 10⁻¹⁹ J','energy conversion','collisions'],
    ['ΔE = hf','energy-level transition','levels'],
    ['ΔE = hc / λ','energy-level transition wavelength','levels'],
    ['λ = h / p','de Broglie wavelength','diffraction'],
    ['p = mv','non-relativistic momentum','diffraction']
  ];

  const definitions=[
    ['Isotope','Atoms of the same element with the same proton number but different neutron numbers.','atom'],
    ['Specific charge','Charge per unit mass.','specific'],
    ['Hadron','Particle subject to the strong interaction.','classification'],
    ['Baryon','Hadron made from three quarks.','classification'],
    ['Meson','Hadron made from a quark and antiquark.','classification'],
    ['Work function','Minimum energy required to remove an electron from a metal surface.','photo'],
    ['Threshold frequency','Minimum frequency that can cause photoemission.','photo'],
    ['Stopping potential','Reverse potential needed to stop the fastest photoelectrons.','photo'],
    ['Excitation','Movement of a bound electron to a higher allowed energy level.','collisions'],
    ['Ionisation','Removal of an electron from an atom.','collisions'],
    ['Electron volt','Energy gained by charge e through a potential difference of 1 V.','collisions'],
    ['de Broglie wavelength','Wavelength associated with a moving particle, λ = h/p.','diffraction']
  ];

  const quiz=[
    ['atom','Which change creates a different isotope of the same element?',['Change Z','Change neutron number only','Remove all electrons','Change proton and neutron number together'],1,'Same Z but different neutron number.'],
    ['specific','Specific charge has unit…',['C kg⁻¹','C kg','J C⁻¹','kg C⁻¹'],0,'Specific charge = Q/m.'],
    ['strong','At a nucleon separation of about 1 fm, the strong nuclear force is mainly…',['attractive','repulsive','zero','gravitational'],0,'At typical nuclear distances it is attractive.'],
    ['decay','In β⁻ decay, Z…',['decreases by 2','decreases by 1','stays same','increases by 1'],3,'Neutron character changes to proton character.'],
    ['antimatter','Minimum rest energy for e⁻ + e⁺ creation?',['0.511 MeV','1.022 MeV','2.044 MeV','0 MeV'],1,'Two electron rest energies are required.'],
    ['interactions','AQA exchange particle for electromagnetic interaction?',['W⁻','pion','virtual photon','gluon'],2,'Virtual photon.'],
    ['classification','Which is a meson?',['proton','neutron','pion','electron'],2,'Pions are mesons.'],
    ['classification','A strange particle is typically…',['produced weakly and decays strongly','produced strongly and decays weakly','always stable','a lepton'],1,'That production/decay pattern is central to AQA strangeness.'],
    ['quarks','Quark content of proton?',['udd','uud','uū','uds'],1,'Proton = uud.'],
    ['quarks','Baryon number of an antiquark?',['+1','−1','+1/3','−1/3'],3,'Antiquark B = −1/3.'],
    ['conservation','Which is NOT optional to conserve in the studied interactions?',['charge','baryon number','energy','all are conserved'],3,'Charge, B, energy and momentum are conserved; lepton number too.'],
    ['photo','Increasing intensity at fixed frequency above threshold mainly increases…',['photon energy','work function','emission rate','threshold frequency'],2,'More photons arrive per second.'],
    ['photo','Below threshold frequency, higher intensity causes…',['higher KEmax','photoemission eventually','no photoemission','lower work function'],2,'Each photon still lacks enough energy.'],
    ['collisions','Excitation means…',['electron removed','electron moves to higher bound level','nucleus splits','photon becomes electron'],1,'The electron remains bound.'],
    ['collisions','5 eV equals…',['8.01 × 10⁻¹⁹ J','3.20 × 10⁻²⁰ J','5 J','1.60 × 10⁻¹⁹ J'],0,'5 × 1.602 × 10⁻¹⁹ J.'],
    ['levels','A larger downward ΔE gives…',['lower f and longer λ','higher f and shorter λ','same f','no photon'],1,'ΔE = hf and c = fλ.'],
    ['diffraction','If electron momentum increases, de Broglie wavelength…',['increases','decreases','stays same','becomes zero instantly'],1,'λ = h/p.'],
    ['diffraction','Electron diffraction is evidence for…',['matter wave behaviour','light only being waves','atoms being indivisible','no momentum conservation'],0,'Particles show wave-like diffraction.'],
    ['rutherford','Most alpha particles going straight through suggests…',['atoms are solid','most atom is empty space','electrons are massive','nuclei are negative'],1,'Most of the atom is empty space.'],
    ['rutherford','Smaller impact parameter generally causes…',['smaller scattering angle','larger scattering angle','no force','lower nuclear charge'],1,'Closer approach increases Coulomb repulsion.']
  ];

  const specGroups=[
    ['3.2.1.1 Constituents of the atom',[
      ['Simple atomic model; proton, neutron, electron charges and masses in SI and relative units.','atom'],
      ['Specific charge of proton/electron, nuclei and ions.','specific'],
      ['Z, A, nuclide notation, isotopes and isotopic data.','atom']
    ]],
    ['3.2.1.2 Stable and unstable nuclei',[
      ['Strong nuclear force: attractive to ~3 fm; repulsive closer than ~0.5 fm.','strong'],
      ['Alpha and beta decay equations; need for neutrino in β decay.','decay'],
      ['Prefixes for very small distances.','strong']
    ]],
    ['3.2.1.3 Particles, antiparticles and photons',[
      ['Particle/antiparticle masses, charge and rest energy in MeV.','antimatter'],
      ['Positron, antiproton, antineutron and antineutrino.','antimatter'],
      ['Photon model, Planck constant, annihilation and pair production.','antimatter']
    ]],
    ['3.2.1.4 Particle interactions',[
      ['Four fundamental interactions.','interactions'],
      ['Exchange-particle concept.','interactions'],
      ['Virtual photon for EM; W⁺/W⁻ for required weak processes.','interactions'],
      ['Simple incoming/exchange/outgoing diagrams.','interactions']
    ]],
    ['3.2.1.5 Classification of particles',[
      ['Hadrons, baryons, mesons and antibaryons.','classification'],
      ['Baryon number and conservation.','classification'],
      ['Pion as exchange particle of strong nuclear force.','classification'],
      ['Leptons; muon decay; electron and muon lepton numbers.','classification'],
      ['Strange particles, pair creation, strangeness conservation/change.','classification'],
      ['Large-team collaboration validates particle-physics knowledge.','classification']
    ]],
    ['3.2.1.6 Quarks and antiquarks',[
      ['u, d, s and antiquark charge, baryon number, strangeness.','quarks'],
      ['Required baryon, antibaryon, pion and kaon quark combinations.','quarks'],
      ['Neutron decay knowledge.','quarks']
    ]],
    ['3.2.1.7 Conservation laws',[
      ['Quark-character change in β⁻ and β⁺.','conservation'],
      ['Conservation of charge, B, L and S.','conservation'],
      ['Energy and momentum conserved in interactions.','conservation']
    ]],
    ['3.2.2.1 Photoelectric effect',[
      ['Threshold frequency and photon explanation.','photo'],
      ['Work function and stopping potential.','photo'],
      ['Photoelectric equation and KEmax.','photo']
    ]],
    ['3.2.2.2 Electron collisions',[
      ['Ionisation and excitation including fluorescent tube.','collisions'],
      ['Electron volt and eV↔J conversion.','collisions']
    ]],
    ['3.2.2.3 Energy levels and photon emission',[
      ['Line spectra as evidence for discrete energy levels.','levels'],
      ['Energy levels may be quoted in J or eV.','levels']
    ]],
    ['3.2.2.4 Wave–particle duality',[
      ['Electron diffraction → wave properties of particles.','diffraction'],
      ['Photoelectric effect → particulate nature of EM radiation.','diffraction'],
      ['de Broglie wavelength and diffraction vs momentum.','diffraction'],
      ['Knowledge changes over time through peer review and scientific validation.','diffraction']
    ]],
    ['3.8.1.1 Rutherford extension',[
      ['Qualitative Rutherford scattering.','rutherford'],
      ['How nuclear-structure knowledge changed over time.','rutherford']
    ]]
  ];

  function inject(){
    if($('#view-revisionhub'))return;
    const nav=$('.main-nav'),main=$('main.main');if(!nav||!main)return;
    const btn=document.createElement('button');
    btn.className='nav-button';btn.dataset.view='revisionhub';btn.textContent='Revision hub';
    nav.appendChild(btn);
    const view=document.createElement('section');
    view.id='view-revisionhub';view.className='view';main.appendChild(view);
    btn.onclick=openHub;
    render();
  }

  function openHub(){
    $$('.view').forEach(v=>v.classList.toggle('active-view',v.id==='view-revisionhub'));
    $$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view==='revisionhub'));
    render();
  }

  function weakScores(){
    const scores={};Object.keys(topicNames).forEach(k=>scores[k]=50);
    try{
      const tools=JSON.parse(localStorage.getItem('particleLearningToolsV1')||'{}');
      Object.keys(topicNames).forEach(k=>{
        const use=Math.min(20,(tools.usage?.[k]||0)*4);
        const secure=Object.entries(tools.exam||{}).filter(([id,v])=>id.startsWith(k+':')&&v==='secure').length*10;
        const mistakes=(tools.mistakes?.[k]||0)*8;
        scores[k]=Math.max(0,Math.min(100,45+use+secure-mistakes));
      });
    }catch{}
    for(const e of state.errors||[])scores[e.topic]=Math.max(0,(scores[e.topic]||50)-6);
    return scores;
  }

  function dueCards(){
    const now=Date.now();
    return flashcards.map((c,i)=>({c,i,due:state.due[i]?.time||0})).filter(x=>x.due<=now);
  }

  function render(){
    const v=$('#view-revisionhub');if(!v)return;
    const scores=weakScores(),due=dueCards().length,checked=Object.values(state.spec||{}).filter(Boolean).length;
    const totalSpec=specGroups.reduce((n,g)=>n+g[1].length,0);
    v.innerHTML=
      '<div class="section-head"><div><span class="eyebrow">Retrieve · repair · repeat</span><h2>Revision hub</h2></div><p class="subtle">Use retrieval practice and spaced review rather than only rereading notes.</p></div>'+
      '<div class="revision-shell">'+
        '<div class="revision-overview"><div class="revision-card"><span class="eyebrow">Today</span><h2>Build a 20-minute revision session</h2><p>The session generator prioritises weak topics from your quiz errors and app activity.</p><div class="lt-actions"><button class="button primary" id="generateSession">Generate today’s session</button><button class="button" id="openLessonSequenceRev">Lesson sequence</button></div></div>'+
        '<div class="revision-card"><span class="eyebrow">Revision status</span><h3>'+due+' flashcards due</h3><p>'+checked+' / '+totalSpec+' specification points checked · '+(state.errors?.length||0)+' logged errors.</p></div></div>'+
        '<div class="revision-tabs">'+[
          ['today','Today'],['flash','Flashcards'],['mixed','Mixed test'],['formula','Formula sprint'],
          ['definitions','Definitions'],['glossary','Glossary'],['spec','Spec checklist'],['organiser','Knowledge organiser'],['errors','Error log']
        ].map(x=>'<button data-revision-tab="'+x[0]+'" class="'+(state.active===x[0]?'active':'')+'">'+x[1]+'</button>').join('')+'</div>'+
        '<div id="revision-today" class="revision-panel '+(state.active==='today'?'active':'')+'">'+renderToday(scores)+'</div>'+
        '<div id="revision-flash" class="revision-panel '+(state.active==='flash'?'active':'')+'">'+renderFlash()+'</div>'+
        '<div id="revision-mixed" class="revision-panel '+(state.active==='mixed'?'active':'')+'">'+renderMixed()+'</div>'+
        '<div id="revision-formula" class="revision-panel '+(state.active==='formula'?'active':'')+'">'+renderSprint('formula')+'</div>'+
        '<div id="revision-definitions" class="revision-panel '+(state.active==='definitions'?'active':'')+'">'+renderSprint('definition')+'</div>'+
        '<div id="revision-glossary" class="revision-panel '+(state.active==='glossary'?'active':'')+'">'+renderGlossary()+'</div>'+
        '<div id="revision-spec" class="revision-panel '+(state.active==='spec'?'active':'')+'">'+renderSpec()+'</div>'+ 
        '<div id="revision-organiser" class="revision-panel '+(state.active==='organiser'?'active':'')+'">'+renderOrganiser()+'</div>'+
        '<div id="revision-errors" class="revision-panel '+(state.active==='errors'?'active':'')+'">'+renderErrors()+'</div>'+
      '</div>';
    bind(scores);
  }

  function renderToday(scores){
    const ordered=Object.entries(scores).sort((a,b)=>a[1]-b[1]);
    return '<div class="revision-card"><span class="eyebrow">Priority map</span><h3>Revise weakest first</h3><div class="priority-grid">'+ordered.map(([k,s])=>'<button class="priority-card" data-revise-topic="'+k+'"><strong>'+topicNames[k]+'</strong><span>'+s+'% current evidence</span><div class="priority-meter"><div class="priority-fill" style="width:'+s+'%"></div></div></button>').join('')+'</div></div><div id="revisionSession" style="margin-top:8px"></div>';
  }

  function sessionHTML(scores){
    const weak=Object.entries(scores).sort((a,b)=>a[1]-b[1]).slice(0,3);
    const items=[
      ['3 min','Retrieval warm-up','Answer 5 flashcards without notes.','flash'],
      ['6 min','Weak topic 1',topicNames[weak[0][0]]+' — open the lesson essentials and explain the simulation aloud.',weak[0][0]],
      ['5 min','Weak topic 2',topicNames[weak[1][0]]+' — answer one exam question, then correct it.',weak[1][0]],
      ['4 min','Mixed test','Complete 5 mixed retrieval questions.','mixed'],
      ['2 min','Error log','Write the one thing you are most likely to forget next time.','errors']
    ];
    return '<div class="revision-card"><span class="eyebrow">20-minute session</span><h3>Do this in order</h3><div class="session-list">'+items.map(x=>'<div class="session-step"><span>'+x[0]+'</span><div><strong>'+x[1]+'</strong><p>'+x[2]+'</p></div><button class="button" data-session-open="'+x[3]+'">Open</button></div>').join('')+'</div></div>';
  }

  function renderFlash(){
    const due=dueCards(),pick=due.length?due[state.flashIndex%due.length]:{c:flashcards[state.flashIndex%flashcards.length],i:state.flashIndex%flashcards.length};
    const card=pick.c,meta=state.due[pick.i]||{};
    return '<div class="revision-card"><span class="eyebrow">Spaced retrieval</span><h3>'+(due.length?due.length+' cards due':'No cards due — optional extra practice')+'</h3><p>Click the card to reveal the answer, then grade how well you remembered it.</p></div><div class="flashcard-wrap" style="margin-top:8px"><div class="flashcard" id="flashcard"><span class="fc-topic">'+topicNames[card[0]]+'</span><h3>'+(state.showBack?card[2]:card[1])+'</h3><p>'+(state.showBack?'Answer shown — rate your recall honestly.':'Think first, then click to reveal.')+'</p></div><div class="flash-controls"><div class="flash-meta">Card '+(pick.i+1)+' / '+flashcards.length+'<br>Next due: '+(meta.time?new Date(meta.time).toLocaleDateString():'not scheduled')+'</div><button class="button" id="flashReveal">'+(state.showBack?'Show question':'Reveal answer')+'</button><button class="button" data-flash-grade="again">Again</button><button class="button" data-flash-grade="hard">Hard</button><button class="button" data-flash-grade="good">Good</button><button class="button primary" data-flash-grade="easy">Easy</button></div></div>';
  }

  function gradeFlash(g){
    const due=dueCards(),pick=due.length?due[state.flashIndex%due.length]:{i:state.flashIndex%flashcards.length};
    const delays={again:5*60e3,hard:24*3600e3,good:3*24*3600e3,easy:7*24*3600e3};
    const old=state.due[pick.i]||{interval:0};
    const factor={again:.5,hard:1.2,good:2,easy:3}[g];
    const base=Math.max(delays[g],old.interval?old.interval*factor:delays[g]);
    state.due[pick.i]={time:Date.now()+base,interval:base,last:g};
    state.flashIndex++;state.showBack=false;save();render();
  }

  function renderMixed(){
    return '<div class="revision-card"><span class="eyebrow">Exam-style retrieval</span><h3>20-question mixed check</h3><p>Answer without notes, then submit once. Wrong answers are added to your error log and lower that topic’s revision score.</p></div><div class="diagnostic-grid" style="margin-top:8px">'+quiz.map((q,i)=>'<div class="retrieval-q"><h4>'+(i+1)+'. '+q[1]+'</h4><div class="retrieval-options">'+q[2].map((o,j)=>'<button data-rq="'+i+'" data-ro="'+j+'" class="'+(state.quizAnswers[i]===j?'selected':'')+'">'+o+'</button>').join('')+'</div></div>').join('')+'</div><div class="lt-actions" style="margin-top:8px"><button class="button primary" id="submitMixed">Mark test</button><button class="button" id="clearMixed">Reset answers</button></div><div id="mixedResult"></div>';
  }

  function markMixed(){
    let score=0;const wrong=[];
    quiz.forEach((q,i)=>{
      if(state.quizAnswers[i]===q[3])score++;else wrong.push({topic:q[0],q:q[1],answer:q[2][q[3]],why:q[4],time:Date.now()});
      $$('[data-rq="'+i+'"]').forEach((b,j)=>b.classList.add(j===q[3]?'correct':state.quizAnswers[i]===j?'wrong':''));
    });
    state.errors=[...wrong,...(state.errors||[])].slice(0,80);save();
    const box=$('#mixedResult');if(box)box.innerHTML='<div class="revision-result" style="margin-top:8px"><h3>'+score+' / '+quiz.length+'</h3><p>'+(score>=17?'Strong retrieval. Review any errors, then move to exam questions.':score>=12?'Developing. Repair the wrong topics before retesting.':'Use the lesson sequence and Start Here pathway to rebuild the weakest areas, then retest.')+'</p><p>'+wrong.length+' question(s) added to the error log.</p></div>';
  }

  function renderSprint(type){
    const arr=type==='formula'?formulas:definitions;
    const idx=(type==='formula'?state.formulaIndex:state.definitionIndex)%arr.length,item=arr[idx];
    return '<div class="revision-card"><span class="eyebrow">'+(type==='formula'?'Formula retrieval':'Definition retrieval')+'</span><h3>Say or write the answer before revealing it</h3></div><div class="sprint-card" style="margin-top:8px"><span>'+topicNames[item[2]]+'</span><h3>'+(type==='formula'?item[1]:item[0])+'</h3><p id="sprintAnswer" hidden>'+(type==='formula'?item[0]:item[1])+'</p><div class="lt-actions"><button class="button primary" id="sprintReveal">Reveal</button><button class="button" id="sprintNext">Next</button></div></div>';
  }

  function renderGlossary(){
    return '<div class="revision-card"><span class="eyebrow">Reference</span><h3>Searchable glossary</h3><div class="glossary-tools"><input id="glossarySearch" placeholder="Search e.g. strangeness, work function, baryon..."><button class="button" id="glossaryClear">Clear</button></div><div id="glossaryGrid" class="glossary-grid">'+glossaryHTML('')+'</div></div>';
  }
  function glossaryHTML(q){
    q=(q||'').toLowerCase().trim();
    return glossary.filter(x=>!q||x.join(' ').toLowerCase().includes(q)).map(x=>'<div class="glossary-entry"><strong>'+x[0]+'</strong><span>'+x[1]+'</span><em>'+topicNames[x[2]]+'</em></div>').join('');
  }

  function renderSpec(){
    let idx=0;
    return '<div class="revision-card"><span class="eyebrow">AQA coverage</span><h3>Full specification checklist</h3><p>Tick a point only when you could explain it without notes and answer a question on it.</p></div><div class="spec-groups" style="margin-top:8px">'+specGroups.map(g=>'<section class="spec-group"><h3>'+g[0]+'</h3>'+g[1].map(x=>{const key='s'+(idx++);return '<label class="spec-row"><input type="checkbox" data-spec="'+key+'" '+(state.spec[key]?'checked':'')+'><div><strong>'+x[0]+'</strong><p>'+topicNames[x[1]]+'</p></div><code>'+x[1]+'</code></label>'}).join('')+'</section>').join('')+'</div>';
  }


  function renderOrganiser(){
    return '<div id="knowledgeOrganiser" class="ko-view">'+
      '<div class="revision-card"><span class="eyebrow">Whole topic at a glance</span><h3>Particles & Radiation knowledge organiser</h3><p>Use this after learning the topic. It is a summary, not a replacement for the lesson explanations.</p><div class="ko-toolbar"><button class="button primary" id="printOrganiser">Print / save as PDF</button><button class="button" id="openSequenceFromKO">Open lesson sequence</button></div></div>'+
      '<div class="ko-sheet">'+
        '<section class="ko-block"><h3>Atoms & nuclei</h3><ul><li>Z = proton number; A = proton + neutron number.</li><li>Neutrons = A − Z.</li><li>Isotopes: same Z, different neutron number.</li><li>Specific charge = Q/m in C kg⁻¹.</li><li>Strong force: repulsive below ~0.5 fm, attractive to ~3 fm, negligible beyond a few fm.</li></ul></section>'+
        '<section class="ko-block"><h3>Decay</h3><ul><li>α: A −4, Z −2.</li><li>β⁻: neutron character → proton + e⁻ + ν̄ₑ; A same, Z +1.</li><li>β⁺: proton character → neutron + e⁺ + νₑ; A same, Z −1.</li></ul></section>'+
        '<section class="ko-block"><h3>Photons & antiparticles</h3><span class="ko-equation">E = hf = hc/λ</span><span class="ko-equation">E₀ = mc²</span><ul><li>Particle/antiparticle: same mass/rest energy, opposite relevant additive quantum numbers.</li><li>e⁻/e⁺ pair rest energy = 1.022 MeV.</li><li>Annihilation and pair production must conserve energy and momentum.</li></ul></section>'+
        '<section class="ko-block"><h3>Interactions</h3><ul><li>Four fundamental interactions: gravity, EM, weak, strong.</li><li>EM exchange particle: virtual photon.</li><li>Weak exchange particles required: W⁺, W⁻.</li><li>AQA does not test gluon, Z⁰ or graviton in this section.</li></ul></section>'+
        '<section class="ko-block"><h3>Particle families</h3><table class="ko-table"><tr><th>Family</th><th>Key idea</th></tr><tr><td>Hadron</td><td>Feels strong interaction</td></tr><tr><td>Baryon</td><td>3 quarks; B = +1</td></tr><tr><td>Meson</td><td>q + q̄; B = 0</td></tr><tr><td>Lepton</td><td>Does not feel strong interaction</td></tr></table><ul><li>Pion: meson and exchange particle in AQA nucleon strong-force model.</li><li>Muon decays to products including an electron.</li><li>Strange particles: produced strongly, decay weakly.</li></ul></section>'+
        '<section class="ko-block"><h3>Quarks</h3><table class="ko-table"><tr><th>Quark</th><th>Q</th><th>B</th><th>S</th></tr><tr><td>u</td><td>+2/3 e</td><td>+1/3</td><td>0</td></tr><tr><td>d</td><td>−1/3 e</td><td>+1/3</td><td>0</td></tr><tr><td>s</td><td>−1/3 e</td><td>+1/3</td><td>−1</td></tr></table><p>Antiquarks reverse additive quantum numbers. p = uud; n = udd.</p></section>'+
        '<section class="ko-block"><h3>Conservation</h3><ul><li>Conserve charge, baryon number, lepton number, energy and momentum.</li><li>Strangeness conserved in strong interactions.</li><li>In weak interactions strangeness may change by 0 or ±1.</li><li>β⁻ quark change: d → u; β⁺: u → d.</li></ul></section>'+
        '<section class="ko-block"><h3>Photoelectric effect</h3><span class="ko-equation">hf = φ + KEmax</span><span class="ko-equation">KEmax = eVs</span><span class="ko-equation">f₀ = φ/h</span><ul><li>Frequency sets photon energy.</li><li>Intensity mainly sets photon arrival rate.</li><li>Below threshold: no emission regardless of intensity.</li></ul></section>'+
        '<section class="ko-block"><h3>Collisions & eV</h3><span class="ko-equation">1 eV = 1.602 × 10⁻¹⁹ J</span><ul><li>Excitation: electron remains bound at higher energy.</li><li>Ionisation: electron removed.</li><li>Fluorescent tubes use collisions, excitation/ionisation and photon emission.</li></ul></section>'+
        '<section class="ko-block"><h3>Energy levels</h3><span class="ko-equation">ΔE = hf = hc/λ</span><ul><li>Energy levels are discrete.</li><li>Downward transition emits a photon.</li><li>Line spectra are evidence for discrete ΔE values.</li></ul></section>'+
        '<section class="ko-block"><h3>Wave–particle duality</h3><span class="ko-equation">λ = h/p</span><ul><li>Electron diffraction → wave evidence for matter.</li><li>Photoelectric effect → particle evidence for EM radiation.</li><li>Higher momentum → shorter de Broglie wavelength → less diffraction for the same structure.</li><li>Models are tested through peer review and scientific validation.</li></ul></section>'+
        '<section class="ko-block ko-warning"><h3>Common traps</h3><ul><li>Intensity does not change photon energy at fixed frequency.</li><li>Excitation is not ionisation.</li><li>Meson ≠ three quarks.</li><li>Neutral antiparticles can still be distinct.</li><li>Energy-level lines are not physical orbits.</li><li>Check every conservation rule, not charge alone.</li></ul></section>'+
        '<section class="ko-block ko-extension"><h3>Rutherford extension · 3.8.1.1</h3><ul><li>Most α straight → atom mostly empty space.</li><li>Some deflect → positive nucleus.</li><li>Rare large/backward scattering → tiny dense nucleus with concentrated charge/mass.</li><li>Smaller impact parameter → larger deflection.</li></ul></section>'+
      '</div></div>';
  }

  function renderErrors(){
    const errors=state.errors||[];
    return '<div class="revision-card"><span class="eyebrow">Repair mistakes</span><h3>Error log</h3><p>Wrong mixed-test answers stay here until you remove them after successful correction.</p><div class="lt-actions"><button class="button" id="clearErrors">Clear all</button></div></div><div class="error-log" style="margin-top:8px">'+(errors.length?errors.map((e,i)=>'<div class="error-item"><strong>'+topicNames[e.topic]+' · '+e.q+'</strong><p><b>Correct answer:</b> '+e.answer+'</p><p>'+e.why+'</p><button class="button" data-error-fixed="'+i+'">I can explain this now</button></div>').join(''):'<div class="revision-card"><p>No logged errors. Complete the mixed test to create a targeted error list.</p></div>')+'</div>';
  }

  function openTopic(topic){
    if(topic==='mixed'||topic==='flash'||topic==='errors'){state.active=topic;save();render();return}
    const lessonMap={atom:1,specific:2,strong:3,decay:4,antimatter:5,interactions:7,classification:8,quarks:9,conservation:10,photo:11,collisions:12,levels:13,diffraction:14,rutherford:16};
    window.PARTICLELAB_LESSON_SEQUENCE?.openLesson?.(lessonMap[topic]||1);
  }

  function bind(scores){
    $$('[data-revision-tab]').forEach(b=>b.onclick=()=>{state.active=b.dataset.revisionTab;save();render()});
    $('#generateSession')?.addEventListener('click',()=>{
      const box=$('#revisionSession');if(box)box.innerHTML=sessionHTML(scores);
      $$('[data-session-open]').forEach(b=>b.onclick=()=>openTopic(b.dataset.sessionOpen));
    });
    $('#openLessonSequenceRev')?.addEventListener('click',()=>document.querySelector('[data-view="course"]')?.click());
    $$('[data-revise-topic]').forEach(b=>b.onclick=()=>openTopic(b.dataset.reviseTopic));

    $('#flashcard')?.addEventListener('click',()=>{state.showBack=!state.showBack;save();render()});
    $('#flashReveal')?.addEventListener('click',()=>{state.showBack=!state.showBack;save();render()});
    $$('[data-flash-grade]').forEach(b=>b.onclick=()=>gradeFlash(b.dataset.flashGrade));

    $$('[data-rq]').forEach(b=>b.onclick=()=>{state.quizAnswers[b.dataset.rq]=+b.dataset.ro;save();render()});
    $('#submitMixed')?.addEventListener('click',markMixed);
    $('#clearMixed')?.addEventListener('click',()=>{state.quizAnswers={};save();render()});

    $('#sprintReveal')?.addEventListener('click',()=>{$('#sprintAnswer').hidden=false});
    $('#sprintNext')?.addEventListener('click',()=>{
      if(state.active==='formula')state.formulaIndex++;else state.definitionIndex++;
      save();render();
    });

    $('#glossarySearch')?.addEventListener('input',e=>{$('#glossaryGrid').innerHTML=glossaryHTML(e.target.value)});
    $('#glossaryClear')?.addEventListener('click',()=>{const i=$('#glossarySearch');if(i)i.value='';const g=$('#glossaryGrid');if(g)g.innerHTML=glossaryHTML('')});

    $$('[data-spec]').forEach(x=>x.onchange=()=>{state.spec[x.dataset.spec]=x.checked;save()});

    $('#printOrganiser')?.addEventListener('click',()=>window.print());
    $('#openSequenceFromKO')?.addEventListener('click',()=>document.querySelector('[data-view="course"]')?.click());

    $$('[data-error-fixed]').forEach(b=>b.onclick=()=>{state.errors.splice(+b.dataset.errorFixed,1);save();render()});
    $('#clearErrors')?.addEventListener('click',()=>{state.errors=[];save();render()});
  }

  function init(){inject()}
  window.PARTICLELAB_REVISION_HUB={open:openHub};

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,520),{once:true});
  else setTimeout(init,520);
})();
