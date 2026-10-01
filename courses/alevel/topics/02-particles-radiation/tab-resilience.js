(() => {
  'use strict';

  // A malformed value here used to be capable of stopping app.js before the
  // navigation/render functions were installed. Repair it before the module runs.
  try {
    const raw = localStorage.getItem('particleLabProgress');
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('progress is not an array');
    }
  } catch (err) {
    localStorage.removeItem('particleLabProgress');
  }

  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const H = 6.62607015e-34;
  const E = 1.602176634e-19;
  const C = 299792458;

  const sims = [
    ['atom','Atomic structure','3.2.1.1'],
    ['specific','Specific charge','3.2.1.1'],
    ['strong','Nuclear force','3.2.1.2'],
    ['decay','Alpha & beta decay','3.2.1.2 / 3.2.1.7'],
    ['antimatter','Antimatter & photons','3.2.1.3'],
    ['interactions','Exchange particles','3.2.1.4'],
    ['classification','Particle families','3.2.1.5'],
    ['quarks','Quark builder','3.2.1.6'],
    ['photo','Photoelectric effect','3.2.2.1'],
    ['collisions','Electron collisions','3.2.2.2'],
    ['levels','Energy levels','3.2.2.3'],
    ['diffraction','Electron diffraction','3.2.2.4'],
    ['rutherford','Rutherford extension','3.8.1.1']
  ];

  const topicInfo = {
    atom:['Atomic structure','3.2.1.1','Atoms contain a tiny nucleus of protons and neutrons with electrons around it. Z is proton number and A is nucleon number.','Use Z to identify the element. Isotopes have the same Z but different neutron numbers.'],
    strong:['Nuclear stability','3.2.1.2','The strong nuclear force is attractive over typical nuclear separations, repulsive at extremely short range and negligible beyond a few femtometres.','AQA expects the short range and the change from attraction to repulsion to be described clearly.'],
    antimatter:['Antiparticles & photons','3.2.1.3','Particles have antiparticles with the same mass and opposite relevant quantum numbers. Annihilation can produce photons and pair production can create matter and antimatter.','Photon energy is E = hf. For an electron–positron pair, the minimum total rest energy is 1.022 MeV.'],
    interactions:['Particle interactions','3.2.1.4','Interactions can be represented using exchange particles. AQA uses virtual photons for electromagnetic interactions and W bosons for the weak interaction examples.','Know the exchange-particle picture for electromagnetic and weak processes.'],
    classification:['Particle classification','3.2.1.5','Hadrons feel the strong interaction. Baryons and mesons are hadrons, while electrons, muons and neutrinos are leptons.','Be able to classify proton, neutron, pion, kaon, electron, muon and neutrinos.'],
    quarks:['Quarks','3.2.1.6','AQA requires up, down and strange quarks and their antiquarks. Proton = uud and neutron = udd.','Track charge, baryon number and strangeness when building hadrons.'],
    decay:['Conservation & decay','3.2.1.7','Particle reactions are tested using conservation of charge, baryon number, lepton number and, where appropriate, strangeness.','For every reaction, total each conserved quantity before and after.'],
    photo:['Photoelectric effect','3.2.2.1','One photon transfers energy hf to one electron. Emission only occurs when photon energy is at least the work function.','Use hf = φ + KEmax and KEmax = eVs.'],
    collisions:['Electron collisions','3.2.2.2','Electron collisions can excite or ionise atoms. Excitation moves an electron to a higher bound level; ionisation removes it.','Energy transfers to bound electrons occur in discrete amounts.'],
    levels:['Energy levels','3.2.2.3','Electrons occupy discrete energy levels. A downward transition emits a photon whose energy equals the level difference.','Use ΔE = hf = hc/λ to connect transitions to spectra.'],
    diffraction:['Wave–particle duality','3.2.2.4','Electron diffraction demonstrates wave behaviour of matter. The de Broglie wavelength is λ = h/p.','Increasing momentum decreases de Broglie wavelength.'],
    rutherford:['Rutherford extension','3.8.1.1','Most alpha particles pass through foil while a small number are strongly deflected, supporting a tiny, dense, positively charged nucleus.','This is a Nuclear Physics extension included because it links naturally to atomic structure.']
  };

  const lessons = [
    ['3.2.1.1','Constituents of the atom','Protons, neutrons, electrons, isotopes, proton number, nucleon number and specific charge.','atom'],
    ['3.2.1.2','Stable and unstable nuclei','Strong nuclear force, nuclear stability and alpha/beta changes.','strong'],
    ['3.2.1.3','Particles, antiparticles and photons','Antiparticles, annihilation, pair production and photon energy.','antimatter'],
    ['3.2.1.4','Particle interactions','Fundamental interactions and exchange particles.','interactions'],
    ['3.2.1.5','Classification of particles','Hadrons, baryons, mesons, leptons and strange particles.','classification'],
    ['3.2.1.6','Quarks and antiquarks','Up, down and strange quarks; hadron structures and quantum numbers.','quarks'],
    ['3.2.1.7','Applications of conservation laws','Charge, baryon number, lepton number and strangeness.','decay'],
    ['3.2.2.1','The photoelectric effect','Threshold frequency, work function, stopping potential and photon model.','photo'],
    ['3.2.2.2','Collisions of electrons with atoms','Excitation, ionisation and electron volts.','collisions'],
    ['3.2.2.3','Energy levels and photon emission','Discrete energy levels, transitions and line spectra.','levels'],
    ['3.2.2.4','Wave–particle duality','Electron diffraction and de Broglie wavelength.','diffraction']
  ];

  const particles = [
    {id:'p',symbol:'p',name:'proton',family:'baryon · hadron',charge:'+1e',mass:'≈ 1.67 × 10⁻²⁷ kg',quarks:'uud',B:'+1',Le:'0',Lm:'0',S:'0',note:'Stable baryon and nucleus constituent.'},
    {id:'n',symbol:'n',name:'neutron',family:'baryon · hadron',charge:'0',mass:'≈ 1.675 × 10⁻²⁷ kg',quarks:'udd',B:'+1',Le:'0',Lm:'0',S:'0',note:'Neutral baryon found in nuclei.'},
    {id:'e',symbol:'e⁻',name:'electron',family:'lepton',charge:'−1e',mass:'9.11 × 10⁻³¹ kg',quarks:'none',B:'0',Le:'+1',Lm:'0',S:'0',note:'Fundamental charged lepton.'},
    {id:'ep',symbol:'e⁺',name:'positron',family:'antiparticle · lepton',charge:'+1e',mass:'9.11 × 10⁻³¹ kg',quarks:'none',B:'0',Le:'−1',Lm:'0',S:'0',note:'Electron antiparticle.'},
    {id:'mu',symbol:'μ⁻',name:'muon',family:'lepton',charge:'−1e',mass:'≈ 207 electron masses',quarks:'none',B:'0',Le:'0',Lm:'+1',S:'0',note:'Heavier charged lepton.'},
    {id:'nue',symbol:'νₑ',name:'electron neutrino',family:'lepton',charge:'0',mass:'very small',quarks:'none',B:'0',Le:'+1',Lm:'0',S:'0',note:'Electron-family neutrino.'},
    {id:'num',symbol:'νμ',name:'muon neutrino',family:'lepton',charge:'0',mass:'very small',quarks:'none',B:'0',Le:'0',Lm:'+1',S:'0',note:'Muon-family neutrino.'},
    {id:'pip',symbol:'π⁺',name:'positive pion',family:'meson · hadron',charge:'+1e',mass:'meson scale',quarks:'u d̄',B:'0',Le:'0',Lm:'0',S:'0',note:'Non-strange meson.'},
    {id:'kp',symbol:'K⁺',name:'positive kaon',family:'meson · hadron · strange',charge:'+1e',mass:'meson scale',quarks:'u s̄',B:'0',Le:'0',Lm:'0',S:'+1',note:'Strange meson.'}
  ];

  function show(view) {
    const target = $(`#view-${view}`);
    if (!target) return;
    $$('.view').forEach(v => v.classList.toggle('active-view', v === target));
    $$('.nav-button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
    ensure(view);
    requestAnimationFrame(() => ensure(view));
  }

  function openSimulation(id) {
    show('lab');
    const tab = document.querySelector(`.sim-tab[data-sim="${id}"]`);
    if (tab) tab.click();
  }

  function ensureMap() {
    const svg = $('#conceptMap'), info = $('#mapInfo');
    if (!svg || !info) return;
    const nodes = [
      ['atom',110,90],['strong',390,90],['antimatter',700,90],['interactions',930,210],
      ['classification',660,300],['quarks',350,300],['decay',120,330],['photo',180,560],
      ['collisions',455,560],['levels',710,560],['diffraction',950,560],['rutherford',930,385]
    ];
    const edges = [['atom','strong'],['strong','decay'],['decay','quarks'],['quarks','classification'],['classification','interactions'],['interactions','antimatter'],['antimatter','photo'],['photo','levels'],['collisions','levels'],['levels','diffraction'],['atom','rutherford'],['rutherford','strong']];
    const pos = Object.fromEntries(nodes.map(n => [n[0],[n[1],n[2]]]));
    svg.innerHTML = edges.map(([a,b]) => `<line class="map-edge" x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}"/>`).join('') +
      nodes.map(([id,x,y]) => {
        const d=topicInfo[id], label=d[0], first=label.includes(' & ')?label.split(' & ')[0]:label, second=label.includes(' & ')?'& '+label.split(' & ')[1]:d[1];
        return `<g class="map-node" data-res-map="${id}" transform="translate(${x-92},${y-30})"><rect width="184" height="60" rx="14"/><text x="92" y="25" text-anchor="middle">${first}</text><text x="92" y="46" text-anchor="middle" style="font-size:12px;fill:#9fb3ca">${second}</text></g>`;
      }).join('');
    const select = id => {
      svg.querySelectorAll('[data-res-map]').forEach(g => g.classList.toggle('active', g.dataset.resMap === id));
      const d=topicInfo[id];
      info.innerHTML=`<span class="eyebrow">AQA ${d[1]}</span><h2>${d[0]}</h2><p>${d[2]}</p><div class="tip"><strong>Exam link:</strong> ${d[3]}</div><button id="resMapOpen" class="button primary">Open simulation</button>`;
      $('#resMapOpen').onclick=()=>openSimulation(id);
    };
    svg.querySelectorAll('[data-res-map]').forEach(g=>g.onclick=()=>select(g.dataset.resMap));
    select(svg.querySelector('.map-node.active')?.dataset.resMap || 'atom');
  }

  function ensureSimNav() {
    const nav=$('#simNav');
    if (!nav || nav.children.length) return;
    nav.innerHTML=sims.map(([id,name,code],i)=>`<button class="button sim-tab ${i===0?'active':''}" data-sim="${id}"><span class="small subtle">${code}</span> ${name}</button>`).join('');
    nav.querySelectorAll('.sim-tab').forEach(tab=>tab.addEventListener('click',()=>{
      nav.querySelectorAll('.sim-tab').forEach(x=>x.classList.toggle('active',x===tab));
      const d=topicInfo[tab.dataset.sim]||topicInfo.atom;
      if($('#specCode')) $('#specCode').textContent=`AQA ${d[1]}`;
      if($('#simTitle')) $('#simTitle').textContent=d[0];
      if($('#simSubtitle')) $('#simSubtitle').textContent=d[2];
      if($('#simpleExplain') && !$('#simpleExplain').textContent.trim()) $('#simpleExplain').innerHTML=`<p>${d[2]}</p>`;
      if($('#examExplain') && !$('#examExplain').textContent.trim()) $('#examExplain').innerHTML=`<p>${d[3]}</p>`;
    }));
  }

  function ensureCourse() {
    if(window.PARTICLELAB_LESSON_SEQUENCE) return;
    const list=$('#courseList'), panel=$('#lessonPanel');
    if(!list||!panel) return;
    if(list.children.length && panel.textContent.trim()) return;
    list.innerHTML=lessons.map((l,i)=>`<button class="course-button ${i===0?'active':''}" data-res-lesson="${i}"><span class="course-code">${l[0]}</span><span class="course-title">${i+1}. ${l[1]}</span></button>`).join('');
    const select=i=>{
      const l=lessons[i]; list.querySelectorAll('[data-res-lesson]').forEach((b,j)=>b.classList.toggle('active',j===i));
      panel.innerHTML=`<span class="eyebrow">AQA ${l[0]}</span><h2>${l[1]}</h2><p class="lesson-lead">${l[2]}</p><div class="lesson-grid"><div class="lesson-block remember"><h3>Key focus</h3><p>${l[2]}</p></div><div class="lesson-block worked"><h3>Linked simulation</h3><p>Use the simulation to change variables and connect the model to the AQA wording.</p></div></div><div class="lesson-actions"><button class="button primary" id="resLessonSim">Open its simulation</button></div>`;
      $('#resLessonSim').onclick=()=>openSimulation(l[3]);
    };
    list.querySelectorAll('[data-res-lesson]').forEach(b=>b.onclick=()=>select(Number(b.dataset.resLesson)));
    select(0);
  }

  function ensureAtlas(force=false) {
    const filters=$('#particleFilters'), buttons=$('#particleButtons'), info=$('#particleInfo');
    if(!filters||!buttons||!info) return;
    if(!force && buttons.children.length && info.textContent.trim()) return;
    const drawFilter=(filter='all')=>{
      const names=['all','hadron','lepton','antiparticle','strange'];
      filters.innerHTML=names.map(f=>`<button class="button ${f===filter?'active':''}" data-res-filter="${f}">${f[0].toUpperCase()+f.slice(1)}</button>`).join('');
      const list=particles.filter(p=>filter==='all'||p.family.includes(filter));
      buttons.innerHTML=list.map(p=>`<button class="particle-button" data-res-particle="${p.id}"><strong>${p.symbol}</strong><span>${p.name}</span><span>${p.family}</span></button>`).join('');
      const select=id=>{const p=particles.find(x=>x.id===id)||list[0];if(!p)return;info.innerHTML=`<span class="eyebrow">${p.family}</span><h2>${p.symbol} · ${p.name}</h2><p>${p.note}</p><div class="particle-properties"><div><strong>Charge</strong><br>${p.charge}</div><div><strong>Mass/rest-mass scale</strong><br>${p.mass}</div><div><strong>Quark content</strong><br>${p.quarks}</div><div><strong>Baryon no.</strong><br>${p.B}</div><div><strong>Electron L</strong><br>${p.Le}</div><div><strong>Muon L</strong><br>${p.Lm}</div><div><strong>Strangeness</strong><br>${p.S}</div></div>`;};
      filters.querySelectorAll('[data-res-filter]').forEach(b=>b.onclick=()=>drawFilter(b.dataset.resFilter));
      buttons.querySelectorAll('[data-res-particle]').forEach(b=>b.onclick=()=>select(b.dataset.resParticle));
      select(list[0]?.id);
    };
    drawFilter('all');
  }

  const reactions=[
    ['Beta-minus decay','n → p + e⁻ + ν̄ₑ','weak',[['Charge','0','0',true],['Baryon number','1','1',true],['Electron lepton number','0','0',true],['Strangeness','0','0',true]],'Allowed: a neutron changes to a proton while charge and lepton number are conserved.'],
    ['Beta-plus decay','p → n + e⁺ + νₑ','weak',[['Charge','+1','+1',true],['Baryon number','1','1',true],['Electron lepton number','0','0',true],['Strangeness','0','0',true]],'Allowed when the nuclear energy balance permits it.'],
    ['Electron capture','p + e⁻ → n + νₑ','weak',[['Charge','0','0',true],['Baryon number','1','1',true],['Electron lepton number','1','1',true],['Strangeness','0','0',true]],'Allowed weak interaction.'],
    ['Impossible example','p → e⁺ + γ','not allowed',[['Charge','+1','+1',true],['Baryon number','1','0',false],['Electron lepton number','0','−1',false]],'This proposed reaction violates baryon and lepton-number conservation in the AQA model.']
  ];

  function ensureConservation() {
    const sel=$('#reactionSelect'), eq=$('#reactionEquation'), out=$('#conservationResult');
    if(!sel||!eq||!out) return;
    if(sel.options.length && out.textContent.trim()) return;
    sel.innerHTML=reactions.map((r,i)=>`<option value="${i}">${r[0]}</option>`).join('');
    const render=()=>{const r=reactions[Number(sel.value||0)];eq.textContent=r[1];out.innerHTML=`<span class="eyebrow">${r[2]} interaction</span><h3>Check each quantity</h3><table class="conservation-table"><thead><tr><th>Quantity</th><th>Before</th><th>After</th><th>Check</th></tr></thead><tbody>${r[3].map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td class="${x[3]?'ok':'no'}">${x[3]?'✓ conserved':'✕ violated'}</td></tr>`).join('')}</tbody></table><div class="tip">${r[4]}</div>`;};
    sel.onchange=render;render();
  }

  function ensureFormula() {
    const sel=$('#formulaSelect'), inputs=$('#formulaInputs'), work=$('#formulaWorking'), cards=$('#formulaCards');
    if(!sel||!inputs||!work||!cards) return;
    if(sel.options.length && work.textContent.trim()) return;
    const formulas={
      photonF:{name:'Photon energy from frequency',fields:[['Frequency f (Hz)','f',5e14]],run:v=>{const x=H*v.f;return [`E = hf`,`E = (6.626 × 10⁻³⁴) × ${v.f.toExponential(3)}`,`E = ${x.toExponential(3)} J = ${(x/E).toFixed(3)} eV`]}},
      photonL:{name:'Photon energy from wavelength',fields:[['Wavelength λ (m)','l',5e-7]],run:v=>{const x=H*C/v.l;return [`E = hc/λ`,`E = ${x.toExponential(3)} J`,`E = ${(x/E).toFixed(3)} eV`]}},
      photo:{name:'Photoelectric KE',fields:[['Frequency f (Hz)','f',8e14],['Work function φ (eV)','phi',2.3]],run:v=>{const ph=H*v.f/E,ke=Math.max(0,ph-v.phi);return [`Photon energy = ${ph.toFixed(3)} eV`,`KEmax = hf − φ = ${ke.toFixed(3)} eV`,ke>0?`Stopping potential = ${ke.toFixed(3)} V`:'No emission: hf < φ']}},
      deb:{name:'de Broglie wavelength',fields:[['Momentum p (kg m s⁻¹)','p',1e-23]],run:v=>[`λ = h/p`,`λ = ${(H/v.p).toExponential(3)} m`]},
      ev:{name:'eV to joules',fields:[['Energy (eV)','ev',10]],run:v=>[`E(J) = E(eV) × 1.602 × 10⁻¹⁹`,`E = ${(v.ev*E).toExponential(3)} J`]}
    };
    sel.innerHTML=Object.entries(formulas).map(([k,f])=>`<option value="${k}">${f.name}</option>`).join('');
    const render=()=>{const f=formulas[sel.value||'photonF'];inputs.innerHTML=f.fields.map(x=>`<label class="field"><span>${x[0]}</span><input type="number" step="any" value="${x[2]}" data-res-formula="${x[1]}"></label>`).join('');const calc=()=>{const v={};inputs.querySelectorAll('[data-res-formula]').forEach(i=>v[i.dataset.resFormula]=Number(i.value));work.innerHTML=f.run(v).map((x,i)=>`<span class="step"><strong>${i+1}.</strong> ${x}</span>`).join('');};inputs.querySelectorAll('input').forEach(i=>i.oninput=calc);calc();};
    sel.onchange=render;render();
    cards.innerHTML=[['E = hf','photon energy'],['hf = φ + KEmax','photoelectric effect'],['λ = h/p','de Broglie wavelength'],['ΔE = hf','energy levels'],['1 eV = 1.602 × 10⁻¹⁹ J','conversion']].map(x=>`<div class="formula-card"><code>${x[0]}</code><span class="subtle small">${x[1]}</span></div>`).join('');
  }

  const fallbackQuiz=[
    ['3.2.1.1','Which number identifies an element?',['A','Z','neutron number'],1,'Z is the proton number.'],
    ['3.2.1.2','At around 1 fm, the strong nuclear force is mainly…',['attractive','zero','always repulsive'],0,'At typical nuclear separation it is attractive.'],
    ['3.2.1.3','Electron + positron annihilation can produce…',['gamma photons','two protons','only a neutron'],0,'Annihilation converts rest/kinetic energy into photons.'],
    ['3.2.1.5','A kaon is a…',['baryon','meson','lepton'],1,'Kaons are strange mesons.'],
    ['3.2.1.6','The proton quark content is…',['udd','uud','u d̄'],1,'A proton is uud.'],
    ['3.2.2.1','Below threshold frequency, increasing intensity causes…',['no emission','greater KEmax','greater photon energy'],0,'Each photon still has insufficient energy.'],
    ['3.2.2.3','A downward atomic transition…',['emits a photon','absorbs a photon','changes Z'],0,'The lost atomic energy is carried by a photon.'],
    ['3.2.2.4','If momentum doubles, de Broglie wavelength…',['doubles','halves','is unchanged'],1,'λ = h/p.']
  ];

  function ensureQuiz() {
    const qEl=$('#quizQuestion'), choices=$('#quizChoices');
    if(!qEl||!choices) return;
    if(qEl.textContent.trim() && choices.children.length) return;
    let i=0,score=0,streak=0,locked=false;
    const render=()=>{const q=fallbackQuiz[i];locked=false;$('#quizProgressText').textContent=`${i+1} / ${fallbackQuiz.length}`;$('#quizProgressBar').style.width=`${(i+1)/fallbackQuiz.length*100}%`;$('#quizScore').textContent=score;$('#quizStreak').textContent=streak;$('#quizSpec').textContent=`AQA ${q[0]}`;qEl.textContent=q[1];choices.innerHTML=q[2].map((x,j)=>`<button class="choice-button" data-res-choice="${j}">${x}</button>`).join('');$('#quizFeedback').className='feedback hidden';$('#nextQuestion').classList.add('hidden');$('#quizHint').classList.add('hidden');$('#quizHint').textContent=q[4];choices.querySelectorAll('[data-res-choice]').forEach(b=>b.onclick=()=>{if(locked)return;locked=true;const ok=Number(b.dataset.resChoice)===q[3];if(ok){score++;streak++;}else streak=0;choices.querySelectorAll('[data-res-choice]').forEach(x=>{x.disabled=true;if(Number(x.dataset.resChoice)===q[3])x.classList.add('correct')});if(!ok)b.classList.add('wrong');$('#quizScore').textContent=score;$('#quizStreak').textContent=streak;const f=$('#quizFeedback');f.className=`feedback ${ok?'good':'bad'}`;f.textContent=ok?'Correct. '+q[4]:'Not quite. '+q[4];$('#nextQuestion').classList.remove('hidden');});};
    $('#showHint').onclick=()=>$('#quizHint').classList.toggle('hidden');
    $('#nextQuestion').onclick=()=>{i=(i+1)%fallbackQuiz.length;render();};
    $('#restartQuiz').onclick=()=>{i=0;score=0;streak=0;render();};
    render();
  }

  function ensureSpec() {
    const grid=$('#specGrid'); if(!grid) return;
    if(grid.children.length) return;
    grid.innerHTML=lessons.map((l,i)=>`<article class="spec-card"><div class="status"><span class="eyebrow">${l[0]}</span><span class="subtle">AQA core</span></div><h3>${l[1]}</h3><p>${l[2]}</p><button class="button" data-res-spec="${i}">Open lesson</button></article>`).join('');
    grid.querySelectorAll('[data-res-spec]').forEach(b=>b.onclick=()=>{show('course');setTimeout(()=>{const btn=$(`#courseList [data-res-lesson="${b.dataset.resSpec}"]`);if(btn)btn.click();},0);});
  }

  function ensure(view) {
    try {
      if(view==='course') ensureCourse();
      if(view==='lab') ensureSimNav();
      if(view==='map') ensureMap();
      if(view==='atlas') ensureAtlas();
      if(view==='conserve') ensureConservation();
      if(view==='formula') ensureFormula();
      if(view==='quiz') ensureQuiz();
      if(view==='spec') ensureSpec();
    } catch (err) {
      console.error('Tab recovery error', view, err);
      const panel=$(`#view-${view}`);
      if(panel && !panel.querySelector('.tab-error')) {
        const msg=document.createElement('div');msg.className='panel tab-error';msg.style.padding='16px';msg.style.marginTop='12px';msg.innerHTML='<strong>This panel hit a display error.</strong><br>Reload the page once. The rest of the app will continue to work.';panel.appendChild(msg);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    $$('.nav-button[data-view]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();show(btn.dataset.view);}));
    $$('[data-jump]').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();show(btn.dataset.jump);}));
    ensure('course');
    ensureSimNav();
    // Run a delayed health pass after app.js has had a chance to initialise.
    setTimeout(()=>{
      const checks=['map','atlas','conserve','formula','quiz','spec'];
      checks.forEach(v=>ensure(v));
    },700);
  });
})();
