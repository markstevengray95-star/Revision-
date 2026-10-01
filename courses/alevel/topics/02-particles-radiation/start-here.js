
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleStartHereV1';

  let state={answers:{},bridge:{},active:'diagnostic'};
  try{state={...state,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{}
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));

  const diagnostic=[
    {area:'Atoms',q:'Which particle has charge −e?',opts:['Proton','Neutron','Electron','Photon'],a:2,repair:'Review atomic structure: proton +e, neutron 0, electron −e.'},
    {area:'Units',q:'Which is equal to 1 fm?',opts:['10⁻⁶ m','10⁻⁹ m','10⁻¹² m','10⁻¹⁵ m'],a:3,repair:'Review prefixes and standard form. femto = 10⁻¹⁵.'},
    {area:'Algebra',q:'If A = 23 and Z = 11, how many neutrons are present?',opts:['11','12','23','34'],a:1,repair:'Use N = A − Z.'},
    {area:'Charge',q:'A neutral atom has 8 protons. How many electrons?',opts:['0','4','8','16'],a:2,repair:'Neutral means total positive and negative charge cancel.'},
    {area:'Energy',q:'Which expression gives the kinetic energy of a moving particle at GCSE level?',opts:['mv','½mv²','mgh','QV'],a:1,repair:'Review common energy equations and what each represents.'},
    {area:'Waves',q:'Which equation links wave speed, frequency and wavelength?',opts:['v = fλ','E = hf','p = mv','F = ma'],a:0,repair:'Review wave vocabulary: speed = frequency × wavelength.'},
    {area:'Momentum',q:'What is momentum?',opts:['mv','ma','mgh','Q/m'],a:0,repair:'Review p = mv and direction for vector momentum.'},
    {area:'Graphs',q:'On a graph of y against x, what does the gradient represent?',opts:['y/x change','area only','x-intercept only','always acceleration'],a:0,repair:'Gradient = change in y divided by change in x.'},
    {area:'Scientific notation',q:'Which is 3.2 × 10⁻¹⁹ written correctly as a small number?',opts:['0.00000000000000000032','0.000000000000000000032','3200000000000000000','3.2'],a:0,repair:'Practise powers of ten and standard form.'},
    {area:'Proportional thinking',q:'If y = k/x, what happens to y when x doubles?',opts:['Doubles','Halves','Stays same','Becomes zero'],a:1,repair:'Inverse proportionality: doubling x halves y.'},
    {area:'Energy units',q:'Which is an energy unit?',opts:['J','C','kg','Hz'],a:0,repair:'Joule is the SI unit of energy.'},
    {area:'Models',q:'A scientific model is best described as…',opts:['a perfect copy of reality','a useful representation tested against evidence','an opinion','a diagram that never changes'],a:1,repair:'Scientific models are evidence-based representations that can be refined.'}
  ];

  const bridges=[
    {
      id:'notation',title:'1. Standard form, prefixes & scale',
      why:'Particle physics uses extremely small distances, masses and charges.',
      know:[
        'Standard form: a × 10ⁿ where 1 ≤ a < 10.',
        'Common prefixes: kilo 10³, mega 10⁶, milli 10⁻³, micro 10⁻⁶, nano 10⁻⁹, pico 10⁻¹², femto 10⁻¹⁵.',
        'Keep units with every quantity and convert before substituting.'
      ],
      examples:['1 fm = 1 × 10⁻¹⁵ m','500 nm = 5.00 × 10⁻⁷ m','3.2 × 10⁻¹⁹ C'],
      check:'Can you convert 2.4 fm to metres without help?'
    },
    {
      id:'atoms',title:'2. Atom & charge recap',
      why:'The topic begins by refining the GCSE model of the atom.',
      know:[
        'Proton: +e, neutron: 0, electron: −e.',
        'Nucleus contains protons and neutrons.',
        'Neutral atom: number of electrons = number of protons.',
        'Ion: electron number differs from proton number.'
      ],
      examples:['+1 ion = one fewer electron than protons','−1 ion = one extra electron'],
      check:'Can you explain why removing an electron makes an ion positive?'
    },
    {
      id:'energy',title:'3. Energy, momentum & conservation',
      why:'Particle interactions are solved by tracking what must be conserved.',
      know:[
        'Energy cannot be created or destroyed.',
        'Momentum p = mv for non-relativistic particles.',
        'Momentum is a vector, so direction matters.',
        'In particle reactions, energy and momentum are conserved.'
      ],
      examples:['p = mv','KE = ½mv²','E₀ = mc² later in the topic'],
      check:'Can you explain why two opposite photons can conserve momentum?'
    },
    {
      id:'waves',title:'4. Waves, frequency & wavelength',
      why:'Photon energy and diffraction both depend on wave quantities.',
      know:[
        'Frequency f is oscillations per second, measured in hertz.',
        'Wavelength λ is distance between equivalent points on a wave.',
        'Wave speed v = fλ.',
        'For electromagnetic waves in vacuum, speed c ≈ 3.00 × 10⁸ m s⁻¹.'
      ],
      examples:['v = fλ','c = fλ'],
      check:'If frequency increases at fixed wave speed, what happens to wavelength?'
    },
    {
      id:'graphs',title:'5. Graphs & proportional reasoning',
      why:'Several relationships are best understood through graphs rather than memorising isolated facts.',
      know:[
        'Gradient = Δy/Δx.',
        'Straight line through origin suggests direct proportionality.',
        'Inverse relationships fall as x rises.',
        'Always read axis labels, units and scale first.'
      ],
      examples:['KEmax vs f','strong-force trend vs separation','λ vs p'],
      check:'Can you explain what a steeper gradient means physically?'
    },
    {
      id:'models',title:'6. Scientific models & evidence',
      why:'The topic repeatedly changes models when experiments reveal new evidence.',
      know:[
        'Models simplify reality so predictions can be tested.',
        'A model is refined when evidence disagrees with its predictions.',
        'Peer review and replication help validate new knowledge.',
        'Large collaborations are important in modern particle physics.'
      ],
      examples:['Rutherford scattering changed the atomic model','electron diffraction supports matter-wave behaviour'],
      check:'Can you give one example where evidence changed a physics model?'
    }
  ];

  const vocab=[
    ['particle','A localised quantum object such as an electron, proton or photon.'],
    ['nucleon','A proton or neutron.'],
    ['nuclide','A nucleus specified by proton number Z and nucleon number A.'],
    ['isotope','Atoms of the same element with the same Z but different neutron numbers.'],
    ['specific charge','Charge per unit mass, Q/m.'],
    ['rest energy','Energy associated with mass at rest, E₀ = mc².'],
    ['antiparticle','Partner particle with the same mass and opposite relevant additive quantum numbers.'],
    ['photon','Quantum of electromagnetic radiation with energy hf.'],
    ['annihilation','Particle–antiparticle process converting energy into other particles.'],
    ['pair production','Creation of a particle–antiparticle pair from photon energy.'],
    ['interaction','A process where particles exchange energy/momentum and may change identity.'],
    ['exchange particle','Particle used to represent an interaction.'],
    ['hadron','Particle subject to the strong interaction.'],
    ['baryon','Hadron made from three quarks.'],
    ['meson','Hadron made from a quark and antiquark.'],
    ['lepton','Fundamental particle family not subject to the strong interaction.'],
    ['strangeness','Quantum number associated with strange quarks.'],
    ['work function','Minimum energy needed to remove an electron from a surface.'],
    ['threshold frequency','Minimum frequency that can produce photoemission.'],
    ['stopping potential','Reverse potential needed to stop the fastest photoelectrons.'],
    ['excitation','Moving a bound atomic electron to a higher allowed energy level.'],
    ['ionisation','Removing an electron from an atom.'],
    ['electron volt','Energy gained by charge e through a potential difference of 1 V.'],
    ['line spectrum','Discrete wavelengths emitted/absorbed due to energy-level transitions.'],
    ['de Broglie wavelength','Matter wavelength λ = h/p.'],
    ['wave–particle duality','Quantum behaviour showing both wave-like and particle-like evidence.']
  ];

  const concept=[
    ['Start with atoms','protons + neutrons form the nucleus; electrons surround it → define Z, A and isotopes.'],
    ['Then ask why nuclei stay together','electrostatic repulsion exists → strong nuclear force explains binding and stability.'],
    ['Unstable nuclei change','alpha/beta decay → neutrino idea → conservation becomes essential.'],
    ['Go smaller than nucleons','particles and antiparticles → interactions → hadrons/leptons → quarks → conservation laws.'],
    ['Switch to radiation','photons carry energy hf → photoelectric effect gives evidence for particle behaviour of light.'],
    ['Quantised atoms','electron collisions → excitation/ionisation → discrete energy levels → line spectra.'],
    ['Finish with duality','electrons diffract like waves → λ = h/p → modern quantum description needs wave and particle ideas.']
  ];

  function completedBridgeCount(){return bridges.filter(b=>state.bridge[b.id]).length}
  function navTo(view){
    document.querySelector('[data-view="'+view+'"]')?.click();
  }

  function inject(){
    if($('#view-starthere'))return;
    const nav=$('.main-nav'),main=$('main.main');if(!nav||!main)return;

    const btn=document.createElement('button');
    btn.className='nav-button';btn.dataset.view='starthere';btn.textContent='Start here';
    nav.insertBefore(btn,nav.firstElementChild);

    const view=document.createElement('section');
    view.id='view-starthere';view.className='view';
    main.insertBefore(view,main.firstElementChild?.nextSibling||null);

    btn.onclick=()=>openStart();
    render();
  }

  function openStart(){
    $$('.view').forEach(v=>v.classList.toggle('active-view',v.id==='view-starthere'));
    $$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view==='starthere'));
    render();
  }

  function render(){
    const v=$('#view-starthere');if(!v)return;
    const bridgeDone=completedBridgeCount();
    v.innerHTML=
      '<div class="section-head"><div><span class="eyebrow">No prior knowledge required</span><h2>Start here</h2></div><p class="subtle">Build the minimum maths, GCSE science and vocabulary needed before Lesson 1.</p></div>'+
      '<div class="beginner-shell">'+
        '<div class="beginner-hero"><div class="beginner-card"><span class="eyebrow">Your route</span><h2>From zero → confident A-level learner</h2><p>Take the diagnostic first. If anything is unfamiliar, complete the matching bridge cards, then begin Lesson 1. You can return here at any time.</p><div class="beginner-roadmap">'+
          [
            ['1','Check','10–12 minute diagnostic'],
            ['2','Bridge','Fill GCSE/maths gaps'],
            ['3','Learn','Follow 15 core lessons + optional extension'],
            ['4','Practise','Use simulations + exam tasks'],
            ['5','Retrieve','Use Revision Hub repeatedly']
          ].map(x=>'<div class="beginner-road-step"><span>'+x[0]+'</span><strong>'+x[1]+'</strong><p>'+x[2]+'</p></div>').join('')+
        '</div></div>'+
        '<div class="beginner-card beginner-progress"><span class="eyebrow">Readiness</span><strong>'+bridgeDone+' / '+bridges.length+' bridge topics secure</strong><div class="lesson-route-track"><div class="lesson-route-fill" style="width:'+(bridgeDone/bridges.length*100)+'%"></div></div><p>'+readinessText()+'</p><button class="button primary" id="beginLesson1">Begin Lesson 1</button></div></div>'+
        '<div class="beginner-tabs">'+
          [['diagnostic','Diagnostic'],['bridge','Prerequisite bridge'],['concept','Concept map'],['vocab','Vocabulary']].map(x=>'<button data-beginner-tab="'+x[0]+'" class="'+(state.active===x[0]?'active':'')+'">'+x[1]+'</button>').join('')+
        '</div>'+
        '<div id="beginner-diagnostic" class="beginner-panel '+(state.active==='diagnostic'?'active':'')+'">'+renderDiagnostic()+'</div>'+
        '<div id="beginner-bridge" class="beginner-panel '+(state.active==='bridge'?'active':'')+'">'+renderBridge()+'</div>'+
        '<div id="beginner-concept" class="beginner-panel '+(state.active==='concept'?'active':'')+'">'+renderConcept()+'</div>'+
        '<div id="beginner-vocab" class="beginner-panel '+(state.active==='vocab'?'active':'')+'">'+renderVocab()+'</div>'+
      '</div>';

    $$('[data-beginner-tab]',v).forEach(b=>b.onclick=()=>{state.active=b.dataset.beginnerTab;save();render()});
    $('#beginLesson1').onclick=()=>window.PARTICLELAB_LESSON_SEQUENCE?.openLesson?.(1);
    bindDiagnostic();
    bindBridge();
  }

  function readinessText(){
    const n=completedBridgeCount();
    if(n===bridges.length)return 'All prerequisite bridge topics are marked secure. Start Lesson 1 or use the diagnostic to check yourself.';
    if(n>=4)return 'Nearly ready. Finish the remaining bridge topics, especially any highlighted by the diagnostic.';
    return 'Complete the diagnostic and bridge cards before starting the full topic if these ideas are unfamiliar.';
  }

  function renderDiagnostic(){
    return '<div class="beginner-card"><span class="eyebrow">Baseline check</span><h3>What do you already know?</h3><p>This does not affect mastery scores. It simply tells you what to revise before starting.</p></div><div class="diagnostic-grid" style="margin-top:8px">'+
      diagnostic.map((d,i)=>'<div class="diagnostic-q"><h4>'+(i+1)+'. '+d.q+'</h4><div class="diagnostic-options">'+d.opts.map((o,j)=>'<button data-dq="'+i+'" data-do="'+j+'" class="'+(state.answers[i]===j?'selected':'')+'">'+o+'</button>').join('')+'</div></div>').join('')+
      '</div><div class="lt-actions" style="margin-top:8px"><button class="button primary" id="scoreDiagnostic">Check my starting point</button><button class="button" id="clearDiagnostic">Reset</button></div><div id="diagnosticResult"></div>';
  }

  function bindDiagnostic(){
    $$('[data-dq]').forEach(b=>b.onclick=()=>{state.answers[b.dataset.dq]=+b.dataset.do;save();render()});
    $('#scoreDiagnostic')?.addEventListener('click',scoreDiagnostic);
    $('#clearDiagnostic')?.addEventListener('click',()=>{state.answers={};save();render()});
  }

  function scoreDiagnostic(){
    let correct=0;const weak=[];
    diagnostic.forEach((d,i)=>{if(state.answers[i]===d.a)correct++;else weak.push(d)});
    const box=$('#diagnosticResult');if(!box)return;
    const pct=Math.round(correct/diagnostic.length*100);
    box.innerHTML='<div class="diagnostic-result" style="margin-top:8px"><span class="eyebrow">Result</span><h3>'+correct+' / '+diagnostic.length+' · '+pct+'%</h3><p>'+(pct>=85?'You are ready to begin the A-level sequence. Use the bridge cards only where you want a refresher.':pct>=60?'You have a useful base. Complete the bridge topics linked to missed questions before Lesson 1.':'Start with the prerequisite bridge. It will make the A-level content much easier to understand.')+'</p>'+
      (weak.length?'<ul>'+[...new Map(weak.map(x=>[x.area,x.repair])).entries()].map(([a,r])=>'<li><strong>'+a+':</strong> '+r+'</li>').join('')+'</ul>':'<p>No prerequisite gaps detected.</p>')+'</div>';
    diagnostic.forEach((d,i)=>{
      const buttons=$$('[data-dq="'+i+'"]');
      buttons.forEach((b,j)=>b.classList.add(j===d.a?'correct':state.answers[i]===j?'wrong':''));
    });
  }

  function renderBridge(){
    return '<div class="beginner-card"><span class="eyebrow">Prerequisite bridge</span><h3>Six things to know before Lesson 1</h3><p>Mark each card secure only when you could explain the check question without looking.</p></div><div class="bridge-grid" style="margin-top:8px">'+
      bridges.map(b=>'<article class="bridge-card '+(state.bridge[b.id]?'done':'')+'"><span class="eyebrow">'+(state.bridge[b.id]?'Secure ✓':'Prerequisite')+'</span><h3>'+b.title+'</h3><p><strong>Why it matters:</strong> '+b.why+'</p><ul>'+b.know.map(x=>'<li>'+x+'</li>').join('')+'</ul><div>'+b.examples.map(x=>'<code>'+x+'</code>').join('')+'</div><p><strong>Check yourself:</strong> '+b.check+'</p><div class="bridge-check"><button class="button '+(state.bridge[b.id]?'success':'')+'" data-bridge="'+b.id+'">'+(state.bridge[b.id]?'✓ I can do this':'Mark secure')+'</button></div></article>').join('')+
      '</div>';
  }

  function bindBridge(){
    $$('[data-bridge]').forEach(b=>b.onclick=()=>{const id=b.dataset.bridge;state.bridge[id]=!state.bridge[id];save();render()});
  }

  function renderConcept(){
    return '<div class="beginner-card"><span class="eyebrow">Big picture</span><h3>How the whole topic connects</h3><p>Use this before learning the topic and again during revision. Every later idea grows from an earlier one.</p></div><div class="concept-chain" style="margin-top:8px">'+concept.map((x,i)=>'<div class="concept-row"><strong>'+(i+1)+'. '+x[0]+'</strong><div>'+x[1]+'</div></div>').join('')+'</div>';
  }

  function renderVocab(){
    return '<div class="beginner-card"><span class="eyebrow">Vocabulary ladder</span><h3>Words you will meet repeatedly</h3><p>Do not memorise all of these before starting. Use this as a quick reference whenever a lesson uses unfamiliar language.</p></div><div class="beginner-vocab-grid" style="margin-top:8px">'+vocab.map(x=>'<div class="beginner-vocab"><strong>'+x[0]+'</strong><span>'+x[1]+'</span></div>').join('')+'</div>';
  }

  function init(){inject()}
  window.PARTICLELAB_START_HERE={open:openStart};

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,460),{once:true});
  else setTimeout(init,460);
})();
