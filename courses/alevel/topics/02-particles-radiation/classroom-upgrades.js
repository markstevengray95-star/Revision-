(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const evidence = [
    {
      code:'3.2.1.2', title:'Alpha range and nuclear radiation', icon:'α',
      observe:'Alpha particles have a very short range in air and are strongly ionising.',
      infer:'Their short range is consistent with frequent interactions with matter. In nuclear equations, alpha emission reduces A by 4 and Z by 2.',
      link:'AQA links this section to observing alpha range using suitable detection equipment.',
      question:'What changes happen to A and Z after alpha emission?', answer:'A decreases by 4 and Z decreases by 2.'
    },
    {
      code:'3.2.1.5', title:'Cosmic-ray particle tracks', icon:'μ',
      observe:'High-energy particles from cosmic-ray showers can produce tracks or detector coincidences. Pions, kaons and muons may appear in cosmic-ray processes.',
      infer:'Particle physics identifies particles from their interactions, decays, charge and conserved quantities rather than by directly seeing tiny particles.',
      link:'AQA explicitly identifies cosmic-ray showers and computer simulations of particle collisions as useful contexts.',
      question:'Why is a kaon called a strange particle?', answer:'It can be produced by the strong interaction but decays through the weak interaction; strangeness is conserved in strong production.'
    },
    {
      code:'3.2.2.1', title:'Photoelectric-effect evidence', icon:'hν',
      observe:'Below a threshold frequency no photoelectrons are emitted, even if intensity is increased. Above threshold, increasing frequency increases maximum kinetic energy.',
      infer:'Energy arrives in photons with energy E = hf. One electron absorbs one photon, so frequency controls photon energy while intensity mainly controls photon arrival rate.',
      link:'This is evidence that electromagnetic radiation has a particulate nature.',
      question:'Why can brighter low-frequency light still fail to eject electrons?', answer:'Each photon still has energy hf below the work function, so no single photon can release an electron.'
    },
    {
      code:'3.2.2.2', title:'Fluorescent-tube collisions', icon:'e⁻',
      observe:'Accelerated electrons collide with gas atoms. Some collisions excite atoms and higher-energy collisions can ionise them.',
      infer:'Excitation raises an electron to a higher discrete energy level; ionisation removes an electron completely. Excited atoms later emit photons as they de-excite.',
      link:'AQA requires understanding of excitation and ionisation in the fluorescent tube and conversion between eV and J.',
      question:'What is the difference between excitation and ionisation?', answer:'Excitation raises a bound electron to a higher level; ionisation removes an electron from the atom.'
    },
    {
      code:'3.2.2.3', title:'Atomic line spectra', icon:'ΔE',
      observe:'A glowing gas produces specific spectral lines rather than every possible wavelength.',
      infer:'Atoms have discrete energy levels. A transition emits a photon with ΔE = hf, so only particular photon energies and wavelengths are produced.',
      link:'AQA identifies line spectra as evidence for discrete atomic energy levels.',
      question:'Why does an atom produce only certain wavelengths?', answer:'Only certain energy differences between discrete levels are possible, so emitted photon energies are restricted.'
    },
    {
      code:'3.2.2.4', title:'Electron diffraction', icon:'λ',
      observe:'Electrons can produce diffraction patterns. Changing electron momentum changes the amount of diffraction.',
      infer:'Particles possess wave properties. The de Broglie wavelength is λ = h/p, so greater momentum gives a shorter wavelength and generally less diffraction.',
      link:'AQA uses electron diffraction as evidence for the wave nature of particles.',
      question:'What happens to de Broglie wavelength if momentum doubles?', answer:'It halves, because λ = h/p.'
    }
  ];

  const glossary = [
    ['annihilation','A particle and its antiparticle interact and their energy is transferred to other particles, commonly photons in the electron–positron example.','3.2.1.3'],
    ['antibaryon','The antiparticle counterpart of a baryon. It has baryon number −1.','3.2.1.5'],
    ['antiparticle','A partner particle with the same mass and rest energy as its particle but opposite values of relevant quantum numbers such as charge.','3.2.1.3'],
    ['baryon','A hadron made from three quarks. Proton and neutron are the required AQA examples.','3.2.1.5'],
    ['baryon number','Quantum number B: +1 for baryons, −1 for antibaryons and 0 for non-baryons. It is conserved.','3.2.1.5'],
    ['de Broglie wavelength','The wavelength associated with a particle: λ = h/p.','3.2.2.4'],
    ['electron capture','A weak interaction in which a proton and electron produce a neutron and electron neutrino.','3.2.1.4'],
    ['electron volt','Energy gained by a charge of magnitude e moving through 1 volt. 1 eV = 1.602 × 10⁻¹⁹ J.','3.2.2.2'],
    ['excitation','A bound electron gains energy and moves to a higher allowed atomic energy level.','3.2.2.2'],
    ['exchange particle','A particle used in the interaction model to represent transfer of energy and momentum between interacting particles.','3.2.1.4'],
    ['hadron','A particle subject to the strong interaction. Hadrons are baryons or mesons.','3.2.1.5'],
    ['ionisation','Removal of an electron from an atom, leaving an ion.','3.2.2.2'],
    ['isotope','Atoms with the same proton number Z but different neutron numbers.','3.2.1.1'],
    ['kaon','A strange meson. Kaons can be produced through the strong interaction and decay through the weak interaction.','3.2.1.5'],
    ['lepton','A particle not subject to the strong interaction. AQA requires electrons, muons, electron/muon neutrinos and their antiparticles.','3.2.1.5'],
    ['lepton number','Quantum number used separately for electron and muon families; conserved in the interactions studied.','3.2.1.5'],
    ['meson','A hadron consisting of a quark and an antiquark. AQA requires pion and kaon examples.','3.2.1.5'],
    ['muon','A charged lepton with greater mass than the electron. It is unstable and decays into an electron plus neutrinos.','3.2.1.5'],
    ['neutrino','A neutral lepton. The electron antineutrino is needed in β⁻ decay to satisfy conservation laws including energy and lepton number.','3.2.1.2'],
    ['nucleon number','A, the total number of protons and neutrons in a nucleus.','3.2.1.1'],
    ['pair production','Conversion of photon energy into a particle–antiparticle pair when sufficient energy and momentum conditions are met.','3.2.1.3'],
    ['photon','A quantum of electromagnetic radiation with energy E = hf.','3.2.1.3'],
    ['pion','A meson. In the AQA model, pions are exchange particles associated with the strong nuclear force between nucleons.','3.2.1.5'],
    ['proton number','Z, the number of protons in a nucleus. It identifies the element.','3.2.1.1'],
    ['quark','An elementary constituent of hadrons. AQA tests up, down and strange quarks and their antiquarks.','3.2.1.6'],
    ['rest energy','Energy associated with mass: E₀ = mc². Particle rest energies are often expressed in MeV.','3.2.1.3'],
    ['specific charge','Charge divided by mass, Q/m, with unit C kg⁻¹.','3.2.1.1'],
    ['stopping potential','Potential difference required to reduce the maximum kinetic energy of emitted photoelectrons to zero: eVₛ = KEmax.','3.2.2.1'],
    ['strangeness','Quantum number associated with strange quarks. It is conserved in strong interactions but may change by 0, +1 or −1 in weak interactions.','3.2.1.5'],
    ['strong interaction','Fundamental interaction affecting hadrons. The strong nuclear force between nucleons is attractive over typical nuclear separations and repulsive at very short range.','3.2.1.2'],
    ['threshold frequency','Minimum frequency needed for photoelectric emission: hf₀ = φ.','3.2.2.1'],
    ['virtual photon','Exchange particle used to model the electromagnetic interaction.','3.2.1.4'],
    ['weak interaction','Fundamental interaction responsible for processes including β decay, electron capture and electron–proton collisions. W⁺ and W⁻ are the tested exchange particles.','3.2.1.4'],
    ['work function','Minimum energy required to remove an electron from a metal surface, φ.','3.2.2.1'],
    ['W boson','Charged exchange particle of the weak interaction. AQA requires W⁺ and W⁻.','3.2.1.4']
  ];

  const predictions = {
    atom:['If the neutron number changes but Z stays the same, what changes?',['The element','The isotope','The proton charge'],1,'Changing neutron number changes the isotope, not the element.'],
    specific:['Which has the larger magnitude of specific charge?',['Proton','Electron','They are equal'],1,'The electron has the same charge magnitude but much smaller mass, so |Q/m| is much larger.'],
    strong:['At separations below about 0.5 fm, the strong nuclear force is mainly…',['attractive','repulsive','zero'],1,'At very short range the force is repulsive; over typical nuclear separations it is attractive.'],
    decay:['In β⁻ decay, what happens inside the neutron?',['u → d','d → u','s → u'],1,'A down quark changes to an up quark, turning a neutron into a proton.'],
    antimatter:['A slow electron and positron annihilate. Their rest energy mainly becomes…',['gamma photons','a proton','a neutron'],0,'The standard AQA example produces photons; energy and momentum must be conserved.'],
    interactions:['Which exchange particle is tested for electromagnetic interactions?',['virtual photon','gluon','graviton'],0,'AQA specifies virtual photons for the electromagnetic interaction.'],
    classification:['Which family is subject to the strong interaction?',['leptons','hadrons','photons only'],1,'Hadrons are subject to the strong interaction.'],
    quarks:['What is the quark content of a proton?',['uud','udd','uū'],0,'A proton is uud.'],
    photo:['Increasing intensity while frequency remains below threshold causes…',['emission with more KE','no emission','higher photon energy'],1,'Photon energy depends on frequency, not intensity.'],
    collisions:['An incident electron transfers less energy than the ionisation energy but exactly matches an allowed gap. The atom is…',['excited','ionised','unchanged in all cases'],0,'Matching an allowed energy gap can excite the atom.'],
    levels:['A downward transition in an atom causes…',['photon emission','photon absorption','an increase in Z'],0,'The energy difference is carried away by a photon.'],
    diffraction:['Increasing particle momentum makes de Broglie wavelength…',['larger','smaller','unchanged'],1,'λ = h/p, so increasing p reduces λ.'],
    rutherford:['A smaller impact parameter usually gives…',['greater deflection','less deflection','no change'],0,'A closer approach gives a stronger Coulomb interaction and usually a larger scattering angle.']
  };

  function style(){
    if($('#classroomUpgradeStyle')) return;
    const st=document.createElement('style'); st.id='classroomUpgradeStyle'; st.textContent=`
      .classroom-tools{display:grid;gap:10px;padding:14px;border:1px solid var(--border);border-radius:18px;background:rgba(13,30,49,.92)}
      .classroom-tools .tool-row,.confidence-row,.prediction-choices,.evidence-tabs{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
      .tool-label{font-size:.78rem;color:var(--muted);font-weight:700;text-transform:uppercase;letter-spacing:.06em}
      .level-select{min-width:150px}
      .presentation-mode .topbar,.presentation-mode .hero,.presentation-mode footer{display:none!important}
      .presentation-mode .main{max-width:1500px}.presentation-mode .view:not(#view-lab){display:none!important}.presentation-mode #view-lab{display:block!important}
      .presentation-mode .lab-layout{grid-template-columns:minmax(0,1.35fr) minmax(360px,.65fr)}
      .presentation-mode .lab-side{font-size:1.08rem}
      .evidence-grid{display:grid;grid-template-columns:minmax(220px,.36fr) minmax(0,.64fr);gap:16px}
      .evidence-list{display:grid;gap:8px}.evidence-btn{width:100%;text-align:left;padding:12px;border:1px solid var(--border);border-radius:13px;background:var(--panel);color:var(--text);cursor:pointer}.evidence-btn.active{outline:2px solid var(--accent);background:var(--panel2)}
      .evidence-icon{font-size:1.3rem;font-weight:900;margin-right:8px}.evidence-detail{display:grid;gap:12px}.evidence-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.flow-card{padding:13px;border:1px solid var(--border);border-radius:14px;background:var(--panel2)}
      .flow-card strong{display:block;margin-bottom:6px}.evidence-q{padding:13px;border-radius:14px;background:rgba(69,173,255,.08);border:1px solid var(--border)}
      .glossary-tools{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}.glossary-tools input{flex:1;min-width:210px}.glossary-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(235px,1fr));gap:10px}.glossary-card{padding:13px;border:1px solid var(--border);border-radius:14px;background:var(--panel)}.glossary-card h3{margin:0 0 5px;text-transform:capitalize}.glossary-code{font-size:.75rem;color:var(--muted)}
      .prediction-box{padding:14px;border:1px solid var(--border);border-radius:18px;background:linear-gradient(145deg,rgba(33,45,69,.95),rgba(11,28,45,.95));display:grid;gap:9px}.prediction-feedback{padding:10px;border-radius:11px;background:rgba(255,255,255,.04)}
      .confidence-card{margin-top:12px;padding:12px;border:1px solid var(--border);border-radius:14px;background:rgba(255,255,255,.03)}.confidence-btn.active{outline:2px solid var(--accent)}
      .interaction-lab{margin-top:16px}.interaction-diagram{width:100%;max-width:760px;height:auto;border:1px solid var(--border);border-radius:14px;background:#071421}.interaction-caption{margin-top:8px;color:var(--muted)}
      .exam-ladder{display:grid;gap:8px}.ladder-step{padding:10px 12px;border-left:3px solid var(--border);background:rgba(255,255,255,.025);border-radius:0 10px 10px 0}.ladder-step strong{display:block;margin-bottom:3px}
      .class-readout{font-variant-numeric:tabular-nums}
      @media(max-width:850px){.evidence-grid{grid-template-columns:1fr}.evidence-flow{grid-template-columns:1fr}.presentation-mode .lab-layout{grid-template-columns:1fr}}
    `; document.head.appendChild(st);
  }

  function showView(view){
    $$('.view').forEach(v=>v.classList.toggle('active-view',v.id===`view-${view}`));
    $$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function addViews(){
    const nav=$('.main-nav'); if(!nav) return;
    if(!nav.querySelector('[data-view="evidence"]')){
      const b=document.createElement('button'); b.className='nav-button'; b.dataset.view='evidence'; b.textContent='Evidence lab'; nav.appendChild(b);
      b.addEventListener('click',()=>showView('evidence'));
    }
    if(!nav.querySelector('[data-view="glossary"]')){
      const b=document.createElement('button'); b.className='nav-button'; b.dataset.view='glossary'; b.textContent='Glossary'; nav.appendChild(b);
      b.addEventListener('click',()=>showView('glossary'));
    }
    const main=$('main');
    if(main && !$('#view-evidence')){
      const s=document.createElement('section'); s.id='view-evidence'; s.className='view';
      s.innerHTML=`<div class="section-head"><div><span class="eyebrow">AQA evidence and practical links</span><h2>Evidence Lab</h2></div><p class="subtle">Start with what you would observe, then connect it to the model and the exam conclusion.</p></div><div class="evidence-grid"><div id="evidenceList" class="evidence-list"></div><article id="evidenceDetail" class="panel evidence-detail"></article></div>`;
      main.appendChild(s);
    }
    if(main && !$('#view-glossary')){
      const s=document.createElement('section'); s.id='view-glossary'; s.className='view';
      s.innerHTML=`<div class="section-head"><div><span class="eyebrow">Language support</span><h2>Particles & Radiation glossary</h2></div><p class="subtle">Search a term and see the definition in AQA-friendly language.</p></div><div class="glossary-tools"><input id="glossarySearch" type="search" placeholder="Search e.g. strangeness, work function, baryon…" aria-label="Search glossary"><button id="glossaryClear" class="button">Clear</button></div><div id="glossaryGrid" class="glossary-grid"></div>`;
      main.appendChild(s);
    }
  }

  function renderEvidence(){
    const list=$('#evidenceList'), detail=$('#evidenceDetail'); if(!list||!detail) return;
    list.innerHTML=evidence.map((e,i)=>`<button class="evidence-btn ${i===0?'active':''}" data-evidence="${i}"><span class="evidence-icon">${e.icon}</span><strong>${e.title}</strong><br><span class="small subtle">AQA ${e.code}</span></button>`).join('');
    const draw=i=>{
      const e=evidence[i];
      list.querySelectorAll('.evidence-btn').forEach((b,j)=>b.classList.toggle('active',j===i));
      detail.innerHTML=`<span class="eyebrow">AQA ${e.code}</span><h2>${e.icon} ${e.title}</h2><div class="evidence-flow"><div class="flow-card"><strong>1 · Observe</strong>${e.observe}</div><div class="flow-card"><strong>2 · Infer</strong>${e.infer}</div><div class="flow-card"><strong>3 · Exam link</strong>${e.link}</div></div><div class="evidence-q"><strong>Check your understanding</strong><p>${e.question}</p><button class="button" id="evidenceReveal">Reveal answer</button><p id="evidenceAnswer" class="hidden"><strong>Answer:</strong> ${e.answer}</p></div><div class="exam-ladder"><div class="ladder-step"><strong>Describe</strong>State what is observed without explaining it.</div><div class="ladder-step"><strong>Explain</strong>Connect the observation to the physical model or equation.</div><div class="ladder-step"><strong>Conclude</strong>State what the evidence tells us about particles, radiation or energy levels.</div></div>`;
      $('#evidenceReveal').onclick=()=>$('#evidenceAnswer').classList.remove('hidden');
    };
    list.querySelectorAll('[data-evidence]').forEach(b=>b.onclick=()=>draw(Number(b.dataset.evidence)));
    draw(0);
  }

  function renderGlossary(filter=''){
    const grid=$('#glossaryGrid'); if(!grid) return;
    const q=filter.trim().toLowerCase();
    const rows=glossary.filter(([term,def,code])=>!q||term.includes(q)||def.toLowerCase().includes(q)||code.includes(q));
    grid.innerHTML=rows.length?rows.map(([term,def,code])=>`<article class="glossary-card"><span class="glossary-code">AQA ${code}</span><h3>${term}</h3><p>${def}</p></article>`).join(''):`<div class="panel">No matching term. Try a broader search.</div>`;
  }

  function setupGlossary(){
    const input=$('#glossarySearch'), clear=$('#glossaryClear'); if(!input||!clear) return;
    input.oninput=()=>renderGlossary(input.value); clear.onclick=()=>{input.value='';renderGlossary('');input.focus()}; renderGlossary('');
  }

  function activeSim(){return $('.sim-tab.active')?.dataset.sim || 'atom';}

  function addClassroomTools(){
    const side=$('.lab-side'); if(!side||$('#classroomTools')) return;
    const box=document.createElement('div'); box.id='classroomTools'; box.className='classroom-tools';
    box.innerHTML=`<div><span class="eyebrow">Classroom controls</span><h3 style="margin:.2rem 0">Teaching mode</h3></div><div class="tool-row"><label class="field level-select"><span>Explanation level</span><select id="explainLevel"><option value="simple">Simple</option><option value="standard" selected>Standard</option><option value="exam">Exam wording</option></select></label><button id="readExplanation" class="button">🔊 Read aloud</button><button id="presentSimulation" class="button">Presentation mode</button></div><div id="levelNote" class="small subtle">Standard: concept + equation + AQA link.</div>`;
    side.insertBefore(box,side.firstChild);
    const select=$('#explainLevel'), note=$('#levelNote');
    const apply=()=>{
      const v=select.value;
      const simple=$('#simpleExplain'),exam=$('#examExplain'),mistake=$('#mistakeExplain');
      if(simple) simple.closest('.learning-box').style.display=v==='exam'?'none':'';
      if(exam) exam.closest('.learning-box').style.display=v==='simple'?'none':'';
      if(mistake) mistake.closest('.learning-box').style.display=v==='exam'?'none':'';
      note.textContent=v==='simple'?'Simple: short explanation + common mistake.':v==='exam'?'Exam wording: focus on precise AQA language.':'Standard: concept + equation + AQA link.';
    };
    select.onchange=apply; apply();
    $('#readExplanation').onclick=()=>{
      if(!('speechSynthesis' in window)) return alert('Read aloud is not supported by this browser.');
      speechSynthesis.cancel();
      const parts=[$('#simTitle')?.textContent,$('#stepTitle')?.textContent,$('#stepText')?.textContent,$('#examExplain')?.textContent].filter(Boolean).join('. ');
      const u=new SpeechSynthesisUtterance(parts);u.rate=.92;speechSynthesis.speak(u);
    };
    $('#presentSimulation').onclick=()=>{
      document.body.classList.toggle('presentation-mode');
      $('#presentSimulation').textContent=document.body.classList.contains('presentation-mode')?'Exit presentation':'Presentation mode';
    };
  }

  function predictionBox(){
    const side=$('.lab-side'); if(!side) return;
    let box=$('#predictionBox'); if(!box){box=document.createElement('div');box.id='predictionBox';box.className='prediction-box';const anchor=$('#classroomTools');anchor?.insertAdjacentElement('afterend',box)}
    const id=activeSim(),p=predictions[id]||predictions.atom;
    box.innerHTML=`<span class="eyebrow">Predict before reveal</span><strong>${p[0]}</strong><div class="prediction-choices">${p[1].map((x,i)=>`<button class="button" data-pred="${i}">${x}</button>`).join('')}</div><div id="predictionFeedback" class="prediction-feedback subtle">Choose an answer before reading the explanation.</div>`;
    box.querySelectorAll('[data-pred]').forEach(b=>b.onclick=()=>{
      const i=Number(b.dataset.pred),ok=i===p[2];box.querySelectorAll('[data-pred]').forEach(x=>x.disabled=true);$('#predictionFeedback').innerHTML=`<strong>${ok?'Correct':'Not quite'}.</strong> ${p[3]}`;
    });
  }

  function confidence(){
    const panel=$('#lessonPanel'); if(!panel) return;
    let card=$('#confidenceCard');
    if(!card){
      card=document.createElement('div');
      card.id='confidenceCard';
      card.className='confidence-card';
      panel.appendChild(card);
    }
    const code=panel.querySelector('.eyebrow')?.textContent?.replace('AQA ','')||'3.2';
    let data={};try{data=JSON.parse(localStorage.getItem('particleConfidenceV2')||'{}')}catch{}
    const current=data[code]||'';
    card.innerHTML=`<div class="tool-label">How confident are you with ${code}?</div><div class="confidence-row"><button class="button confidence-btn ${current==='red'?'active':''}" data-conf="red">Need help</button><button class="button confidence-btn ${current==='amber'?'active':''}" data-conf="amber">Nearly there</button><button class="button confidence-btn ${current==='green'?'active':''}" data-conf="green">Confident</button></div><div class="small subtle">Saved only on this device. Use this to decide what to revisit.</div>`;
    card.querySelectorAll('[data-conf]').forEach(b=>b.onclick=()=>{data[code]=b.dataset.conf;localStorage.setItem('particleConfidenceV2',JSON.stringify(data));card.querySelectorAll('[data-conf]').forEach(x=>x.classList.toggle('active',x===b))});
  }

  const interactions={
    betaMinus:{name:'β⁻ decay',code:'3.2.1.4 / 3.2.1.7',left:'n (udd)',right:'p (uud) + e⁻ + ν̄ₑ',exchange:'W⁻',caption:'At quark level: d → u + W⁻, then W⁻ → e⁻ + ν̄ₑ.'},
    betaPlus:{name:'β⁺ decay',code:'3.2.1.4 / 3.2.1.7',left:'p (uud)',right:'n (udd) + e⁺ + νₑ',exchange:'W⁺',caption:'At quark level: u → d + W⁺, then W⁺ → e⁺ + νₑ.'},
    capture:{name:'Electron capture',code:'3.2.1.4',left:'p + e⁻',right:'n + νₑ',exchange:'W⁺',caption:'A proton interacts with an electron via the weak interaction, producing a neutron and electron neutrino.'},
    ep:{name:'Electron–proton collision',code:'3.2.1.4',left:'e⁻ + p',right:'νₑ + n',exchange:'W⁻',caption:'AQA requires simple incoming/outgoing particle diagrams with W exchange for the weak interaction.'}
  };

  function addInteractionLab(){
    const view=$('#view-conserve'); if(!view||$('#interactionLab')) return;
    const wrap=document.createElement('div');wrap.id='interactionLab';wrap.className='panel interaction-lab';
    wrap.innerHTML=`<div class="section-head"><div><span class="eyebrow">Required weak-interaction diagrams</span><h2>Interaction diagram trainer</h2></div><p class="subtle">Follow incoming particles → exchange particle → outgoing particles.</p></div><label class="field"><span>Process</span><select id="interactionSelect">${Object.entries(interactions).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('')}</select></label><svg id="interactionDiagram" class="interaction-diagram" viewBox="0 0 760 300" role="img" aria-label="Weak interaction diagram"></svg><div id="interactionCaption" class="interaction-caption"></div>`;
    view.appendChild(wrap);
    const render=()=>{
      const x=interactions[$('#interactionSelect').value],svg=$('#interactionDiagram');
      svg.innerHTML=`<defs><marker id="arrowW" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto"><polygon points="0 0, 8 3.5, 0 7" fill="#9ad8ff"/></marker></defs><text x="50" y="45" fill="#9fb3ca" font-size="14">incoming</text><text x="555" y="45" fill="#9fb3ca" font-size="14">outgoing</text><line x1="125" y1="105" x2="310" y2="145" stroke="#dbe9f7" stroke-width="3"/><line x1="125" y1="205" x2="310" y2="155" stroke="#dbe9f7" stroke-width="3"/><line x1="450" y1="145" x2="635" y2="105" stroke="#dbe9f7" stroke-width="3"/><line x1="450" y1="155" x2="635" y2="205" stroke="#dbe9f7" stroke-width="3"/><line x1="315" y1="150" x2="445" y2="150" stroke="#9ad8ff" stroke-width="4" stroke-dasharray="8 6" marker-end="url(#arrowW)"/><circle cx="315" cy="150" r="9" fill="#ffd36a"/><circle cx="445" cy="150" r="9" fill="#ffd36a"/><text x="75" y="98" fill="#fff" font-size="20">${x.left.split(' + ')[0]}</text><text x="75" y="215" fill="#fff" font-size="20">${x.left.split(' + ')[1]||''}</text><text x="560" y="98" fill="#fff" font-size="20">${x.right.split(' + ')[0]}</text><text x="560" y="215" fill="#fff" font-size="18">${x.right.split(' + ').slice(1).join(' + ')}</text><text x="365" y="132" fill="#9ad8ff" font-size="21" font-weight="700">${x.exchange}</text><text x="285" y="275" fill="#9fb3ca" font-size="14">AQA ${x.code} · schematic interaction diagram</text>`;
      $('#interactionCaption').innerHTML=`<strong>${x.name}:</strong> ${x.caption} The diagram is a teaching schematic; it is not a literal picture of particles travelling along visible tracks.`;
    };
    $('#interactionSelect').onchange=render;render();
  }

  function observe(){
    const simNav=$('#simNav'); if(simNav){new MutationObserver(()=>predictionBox()).observe(simNav,{subtree:true,attributes:true,attributeFilter:['class']});simNav.addEventListener('click',()=>setTimeout(predictionBox,0))}
    const lesson=$('#lessonPanel'); if(lesson)new MutationObserver(()=>{clearTimeout(window.__confTimer);window.__confTimer=setTimeout(confidence,20)}).observe(lesson,{childList:true,subtree:false});
  }

  function init(){
    style();addViews();renderEvidence();setupGlossary();addClassroomTools();predictionBox();confidence();addInteractionLab();observe();
    $$('.nav-button').forEach(b=>{if(!b.dataset.classroomNav){b.dataset.classroomNav='1';b.addEventListener('click',()=>{if(b.dataset.view==='evidence'||b.dataset.view==='glossary')showView(b.dataset.view)})}});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true}); else init();
})();