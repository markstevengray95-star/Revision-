(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const STORE = 'particleDiagnosticTeacherV1';

  const sections = [
    ['3.2.1.1','Constituents of the atom','atom'],
    ['3.2.1.2','Stable and unstable nuclei','strong'],
    ['3.2.1.3','Particles, antiparticles and photons','antimatter'],
    ['3.2.1.4','Particle interactions','interactions'],
    ['3.2.1.5','Particle classification','classification'],
    ['3.2.1.6','Quarks and antiquarks','quarks'],
    ['3.2.1.7','Conservation laws','decay'],
    ['3.2.2.1','Photoelectric effect','photo'],
    ['3.2.2.2','Electron collisions with atoms','collisions'],
    ['3.2.2.3','Energy levels and photon emission','levels'],
    ['3.2.2.4','Wave–particle duality','diffraction']
  ];

  const questions = [
    {code:'3.2.1.1',q:'Which statement correctly describes isotopes?',choices:['Same neutron number, different proton number','Same proton number, different neutron number','Same nucleon number, different charge','Different elements with the same mass'],a:1,why:'Isotopes are atoms of the same element, so Z is unchanged, but they contain different numbers of neutrons and therefore different A values.'},
    {code:'3.2.1.2',q:'Which description of the strong nuclear force is correct?',choices:['Always attractive and infinite range','Repulsive beyond 3 fm','Attractive over typical nuclear separations but repulsive at very short range','Only acts on electrons'],a:2,why:'AQA expects short-range attraction up to about 3 fm and very-short-range repulsion below roughly 0.5 fm.'},
    {code:'3.2.1.3',q:'What is the minimum total photon energy needed to create an electron–positron pair?',choices:['0.511 MeV','1.022 MeV','2.044 MeV','No minimum energy'],a:1,why:'The pair requires at least two electron rest energies: 2 × 0.511 MeV = 1.022 MeV, with extra energy becoming kinetic energy.'},
    {code:'3.2.1.4',q:'Which exchange particle is used in the AQA model of the electromagnetic interaction?',choices:['W⁻ boson','Virtual photon','Gluon','Graviton'],a:1,why:'AQA uses a virtual photon for electromagnetic interactions and W⁺/W⁻ for the specified weak interactions.'},
    {code:'3.2.1.5',q:'Which particle is a meson?',choices:['Proton','Neutron','Pion','Electron'],a:2,why:'Pions and kaons are mesons. Protons and neutrons are baryons; electrons are leptons.'},
    {code:'3.2.1.6',q:'What is the quark composition of a proton?',choices:['udd','uud','uū','uds'],a:1,why:'A proton is uud. A neutron is udd.'},
    {code:'3.2.1.7',q:'Which statement about strangeness is correct?',choices:['It must be conserved in every weak interaction','It is never conserved','It is conserved in strong interactions but may change in weak interactions','Only leptons carry strangeness'],a:2,why:'Strangeness is conserved in strong interactions. In weak interactions it may change by 0, +1 or −1.'},
    {code:'3.2.2.1',q:'Light is below the threshold frequency. What happens if its intensity is increased?',choices:['Electrons are emitted with larger maximum KE','Electrons are emitted but more slowly','No photoelectrons are emitted','The work function decreases'],a:2,why:'Increasing intensity raises the photon arrival rate, not the energy hf of each photon. Below threshold, no single photon has enough energy.'},
    {code:'3.2.2.2',q:'What is ionisation?',choices:['Moving a bound electron to a higher bound level','Removing an electron from an atom','A nucleus emitting an alpha particle','Creating a photon from nothing'],a:1,why:'Excitation raises a bound electron to a higher level; ionisation removes an electron completely.'},
    {code:'3.2.2.3',q:'Why does an atomic emission spectrum contain discrete lines?',choices:['Atomic energies are continuous','Only particular energy-level differences are available','Photons lose energy continuously','Electrons orbit at arbitrary radii'],a:1,why:'A transition emits a photon with ΔE = hf. Discrete energy levels therefore give only particular photon energies and wavelengths.'},
    {code:'3.2.2.4',q:'What happens to de Broglie wavelength when particle momentum doubles?',choices:['It doubles','It halves','It stays the same','It becomes zero'],a:1,why:'λ = h/p, so wavelength is inversely proportional to momentum.'}
  ];

  const particles = [
    {id:'p',name:'proton',symbol:'p',family:'baryon / hadron',charge:'+1e',mass:'1.67 × 10⁻²⁷ kg',structure:'uud',B:'+1',Le:'0',Lm:'0',S:'0'},
    {id:'n',name:'neutron',symbol:'n',family:'baryon / hadron',charge:'0',mass:'1.675 × 10⁻²⁷ kg',structure:'udd',B:'+1',Le:'0',Lm:'0',S:'0'},
    {id:'ap',name:'antiproton',symbol:'p̄',family:'antibaryon / hadron',charge:'−1e',mass:'same as proton',structure:'ūūd̄',B:'−1',Le:'0',Lm:'0',S:'0'},
    {id:'an',name:'antineutron',symbol:'n̄',family:'antibaryon / hadron',charge:'0',mass:'same as neutron',structure:'ūd̄d̄',B:'−1',Le:'0',Lm:'0',S:'0'},
    {id:'e',name:'electron',symbol:'e⁻',family:'lepton',charge:'−1e',mass:'9.11 × 10⁻³¹ kg',structure:'fundamental',B:'0',Le:'+1',Lm:'0',S:'0'},
    {id:'ep',name:'positron',symbol:'e⁺',family:'antilepton',charge:'+1e',mass:'same as electron',structure:'fundamental',B:'0',Le:'−1',Lm:'0',S:'0'},
    {id:'mu',name:'muon',symbol:'μ⁻',family:'lepton',charge:'−1e',mass:'≈ 207 electron masses',structure:'fundamental',B:'0',Le:'0',Lm:'+1',S:'0'},
    {id:'nue',name:'electron neutrino',symbol:'νₑ',family:'lepton',charge:'0',mass:'very small',structure:'fundamental',B:'0',Le:'+1',Lm:'0',S:'0'},
    {id:'anue',name:'electron antineutrino',symbol:'ν̄ₑ',family:'antilepton',charge:'0',mass:'very small',structure:'fundamental',B:'0',Le:'−1',Lm:'0',S:'0'},
    {id:'pip',name:'positive pion',symbol:'π⁺',family:'meson / hadron',charge:'+1e',mass:'meson scale',structure:'u d̄',B:'0',Le:'0',Lm:'0',S:'0'},
    {id:'pim',name:'negative pion',symbol:'π⁻',family:'meson / hadron',charge:'−1e',mass:'meson scale',structure:'d ū',B:'0',Le:'0',Lm:'0',S:'0'},
    {id:'kp',name:'positive kaon',symbol:'K⁺',family:'strange meson / hadron',charge:'+1e',mass:'meson scale',structure:'u s̄',B:'0',Le:'0',Lm:'0',S:'+1'},
    {id:'k0',name:'neutral kaon',symbol:'K⁰',family:'strange meson / hadron',charge:'0',mass:'meson scale',structure:'d s̄',B:'0',Le:'0',Lm:'0',S:'+1'},
    {id:'g',name:'photon',symbol:'γ',family:'exchange / EM quantum',charge:'0',mass:'zero rest mass',structure:'fundamental',B:'0',Le:'0',Lm:'0',S:'0'}
  ];

  const dataChallenges = [
    {title:'Photoelectric trend',prompt:'A metal is illuminated above threshold. Frequency increases while intensity is kept constant. Predict what happens to maximum photoelectron kinetic energy.',answer:'It increases linearly because KEmax = hf − φ. The work function is fixed for the metal, so increasing f increases the available kinetic energy.'},
    {title:'Electron diffraction trend',prompt:'Electrons are accelerated through a larger potential difference. Predict the change in diffraction spread.',answer:'The electron momentum increases, so λ = h/p decreases. A shorter de Broglie wavelength gives less diffraction for the same crystal spacing.'},
    {title:'Line-spectrum evidence',prompt:'A gas emits only a small set of sharp wavelengths. What does this tell you about atomic energies?',answer:'The atom has discrete energy levels. Each observed wavelength corresponds to a photon energy hf equal to one allowed energy-level difference.'},
    {title:'Strong-force range',prompt:'Two nucleons are separated by 4 fm. What should the strong nuclear force model show?',answer:'The strong nuclear force is negligible at this separation because its attractive range is only about 3 fm.'}
  ];

  let state = {answers:{}, index:0, completed:false, lessonTopic:'3.2.1.1', lessonTime:20, compare:['p','e','pip']};
  try { state = Object.assign(state, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch {}
  const save = () => { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch {} };

  function addStyle() {
    if ($('#diagnosticTeacherStyle')) return;
    const s = document.createElement('style');
    s.id = 'diagnosticTeacherStyle';
    s.textContent = `
      .dt-tabs,.dt-actions,.dt-choice-row,.dt-duration,.dt-compare-picks{display:flex;gap:8px;flex-wrap:wrap}
      .dt-tab.active,.dt-choice.selected,.dt-duration .active{outline:2px solid var(--accent)}
      .dt-panel{display:none}.dt-panel.active{display:block}.dt-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px}
      .dt-card{padding:14px;border:1px solid var(--border);border-radius:15px;background:rgba(255,255,255,.025)}.dt-card h3{margin:.2rem 0 .45rem}
      .dt-question{font-size:1.08rem;font-weight:700;margin:.5rem 0 1rem}.dt-choices{display:grid;gap:8px}.dt-choice{text-align:left;justify-content:flex-start;min-height:44px}
      .dt-feedback{margin-top:12px;padding:12px;border-radius:12px;border:1px solid var(--border)}.dt-correct{border-color:rgba(80,210,135,.65);background:rgba(80,210,135,.08)}.dt-wrong{border-color:rgba(255,190,80,.7);background:rgba(255,190,80,.07)}
      .dt-progress{display:flex;justify-content:space-between;gap:12px;align-items:center;margin-bottom:8px}.dt-results{display:grid;gap:10px}.dt-result{padding:12px;border:1px solid var(--border);border-radius:13px;display:grid;gap:7px}.dt-result.weak{border-color:rgba(255,190,80,.6)}
      .dt-plan{display:grid;gap:10px;margin-top:12px}.dt-plan-step{display:grid;grid-template-columns:70px minmax(0,1fr);gap:12px;padding:12px;border:1px solid var(--border);border-radius:13px}.dt-time{font-weight:800;font-size:1.05rem}
      .dt-compare{overflow-x:auto}.dt-compare table{width:100%;border-collapse:collapse;min-width:720px}.dt-compare th,.dt-compare td{padding:9px;border-bottom:1px solid var(--border);text-align:left;vertical-align:top}.dt-compare th{position:sticky;top:0;background:var(--panel)}
      .dt-data-answer{margin-top:9px;padding:10px;border-radius:10px;background:rgba(255,255,255,.035);border:1px solid var(--border)}
      .dt-command-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(165px,1fr));gap:9px}.dt-command{padding:10px;border:1px solid var(--border);border-radius:12px}.dt-command strong{display:block;margin-bottom:4px}
      @media(max-width:700px){.dt-plan-step{grid-template-columns:1fr}.dt-actions .button{flex:1 1 145px}}
    `;
    document.head.appendChild(s);
  }

  function showView(name) {
    $$('.view').forEach(v => v.classList.toggle('active-view', v.id === `view-${name}`));
    $$('.nav-button').forEach(b => b.classList.toggle('active', b.dataset.view === name));
    if (name === 'diagnostic') renderDiagnostic();
  }

  function openSim(sim) {
    const lab = $('[data-view="lab"]');
    if (lab) lab.click(); else showView('lab');
    setTimeout(() => $(`.sim-tab[data-sim="${sim}"]`)?.click(), 80);
  }

  function addShell() {
    const nav = $('.main-nav'), main = $('main.main');
    if (!nav || !main || $('#view-diagnostic')) return;
    const b = document.createElement('button');
    b.className = 'nav-button';
    b.dataset.view = 'diagnostic';
    b.textContent = 'Diagnostic & lessons';
    nav.appendChild(b);
    b.addEventListener('click', () => showView('diagnostic'));
    $$('.nav-button').filter(x => x !== b).forEach(x => x.addEventListener('click', () => $('#view-diagnostic')?.classList.remove('active-view')));

    const sec = document.createElement('section');
    sec.id = 'view-diagnostic';
    sec.className = 'view';
    sec.innerHTML = `
      <div class="section-head"><div><span class="eyebrow">Find the gap, then fix it</span><h2>Diagnostic & lesson hub</h2></div><p class="subtle">A short AQA diagnostic, targeted reteaching, classroom lesson launcher, particle comparison and data-reasoning practice.</p></div>
      <div class="dt-tabs" role="tablist">
        <button class="button dt-tab active" data-dt="test">Diagnostic</button>
        <button class="button dt-tab" data-dt="lesson">Lesson launcher</button>
        <button class="button dt-tab" data-dt="compare">Compare particles</button>
        <button class="button dt-tab" data-dt="data">Data & evidence</button>
        <button class="button dt-tab" data-dt="commands">Exam command words</button>
      </div>
      <div id="dt-test" class="dt-panel active"></div>
      <div id="dt-lesson" class="dt-panel"></div>
      <div id="dt-compare" class="dt-panel"></div>
      <div id="dt-data" class="dt-panel"></div>
      <div id="dt-commands" class="dt-panel"></div>`;
    main.appendChild(sec);

    sec.querySelectorAll('.dt-tab').forEach(tab => tab.addEventListener('click', () => {
      sec.querySelectorAll('.dt-tab').forEach(x => x.classList.toggle('active', x === tab));
      sec.querySelectorAll('.dt-panel').forEach(p => p.classList.toggle('active', p.id === `dt-${tab.dataset.dt}`));
      ({test:renderDiagnostic,lesson:renderLesson,compare:renderCompare,data:renderData,commands:renderCommands}[tab.dataset.dt])();
    }));
  }

  function renderDiagnostic() {
    const host = $('#dt-test'); if (!host) return;
    if (state.completed) return renderResults();
    const i = Math.max(0, Math.min(questions.length - 1, Number(state.index) || 0));
    const q = questions[i], selected = state.answers[i];
    host.innerHTML = `
      <div class="panel" style="margin-top:12px">
        <div class="dt-progress"><span class="eyebrow">AQA ${q.code}</span><strong>${i+1} / ${questions.length}</strong></div>
        <div class="progress-track"><div class="progress-fill" style="width:${((i+1)/questions.length)*100}%"></div></div>
        <p class="dt-question">${q.q}</p>
        <div class="dt-choices">${q.choices.map((c,j)=>`<button class="button dt-choice ${selected===j?'selected':''}" data-diag-choice="${j}">${String.fromCharCode(65+j)}. ${c}</button>`).join('')}</div>
        <div id="dtFeedback"></div>
        <div class="dt-actions" style="margin-top:12px">
          <button class="button" id="dtPrev" ${i===0?'disabled':''}>Previous</button>
          <button class="button primary" id="dtNext" ${selected===undefined?'disabled':''}>${i===questions.length-1?'Finish diagnostic':'Next'}</button>
        </div>
      </div>`;
    host.querySelectorAll('[data-diag-choice]').forEach(btn => btn.addEventListener('click', () => {
      state.answers[i] = Number(btn.dataset.diagChoice); save(); renderDiagnostic();
    }));
    if (selected !== undefined) {
      const ok = Number(selected) === q.a;
      $('#dtFeedback').innerHTML = `<div class="dt-feedback ${ok?'dt-correct':'dt-wrong'}"><strong>${ok?'Correct':'Not quite'}.</strong> ${q.why}</div>`;
    }
    $('#dtPrev').onclick = () => { state.index = Math.max(0, i-1); save(); renderDiagnostic(); };
    $('#dtNext').onclick = () => {
      if (state.answers[i] === undefined) return;
      if (i === questions.length-1) { state.completed = true; save(); renderResults(); }
      else { state.index = i+1; save(); renderDiagnostic(); }
    };
  }

  function renderResults() {
    const host = $('#dt-test'); if (!host) return;
    const results = questions.map((q,i)=>({q,i,ok:Number(state.answers[i])===q.a}));
    const score = results.filter(x=>x.ok).length;
    const weak = results.filter(x=>!x.ok);
    host.innerHTML = `
      <div class="panel" style="margin-top:12px">
        <span class="eyebrow">Diagnostic result</span><h2>${score} / ${questions.length}</h2>
        <p>${weak.length ? 'Use the weak-area list below as your next revision route. The aim is to fix one gap at a time, not simply repeat the whole topic.' : 'All sections were correct on this short check. Use the Practice Studio for extended responses and calculations.'}</p>
        <div class="dt-results">${results.map(({q,ok})=>{const sec=sections.find(s=>s[0]===q.code);return `<div class="dt-result ${ok?'':'weak'}"><div><strong>${ok?'✓':'→'} AQA ${q.code} · ${sec?.[1]||''}</strong></div><span>${ok?'Secure on this checkpoint':'Needs another look: '+q.why}</span>${ok?'':`<button class="button primary" data-result-sim="${sec?.[2]||'atom'}">Open reteaching simulation</button>`}</div>`}).join('')}</div>
        <div class="dt-actions" style="margin-top:12px"><button class="button" id="dtReset">Retake diagnostic</button><button class="button" id="dtPractice">Open Practice Studio</button></div>
      </div>`;
    host.querySelectorAll('[data-result-sim]').forEach(b=>b.onclick=()=>openSim(b.dataset.resultSim));
    $('#dtReset').onclick=()=>{state.answers={};state.index=0;state.completed=false;save();renderDiagnostic()};
    $('#dtPractice').onclick=()=>document.querySelector('[data-view="studio"]')?.click();
  }

  function lessonSteps(code, minutes) {
    const sec = sections.find(s=>s[0]===code) || sections[0];
    const topic = sec[1];
    if (minutes === 10) return [
      ['2 min','Retrieval starter',`Ask students for two facts or equations they already know about ${topic}.`],
      ['5 min','Simulation focus','Use the linked simulation. Make one prediction before changing a control, then explain the observed change.'],
      ['3 min','Exit check','Students write one AQA-style sentence explaining the key idea without looking at notes.']
    ];
    if (minutes === 40) return [
      ['5 min','Do-now diagnostic',`Use one diagnostic question and one misconception prompt on ${topic}.`],
      ['10 min','Direct teaching','Use Simple → Standard → Exam wording in the simulation guide. Pause after each stage.'],
      ['8 min','Guided simulation','Students predict, change one variable, observe, then connect the result to an equation or conservation law.'],
      ['10 min','Practice Studio','Complete a linked interaction, decay, misconception or exam-response activity.'],
      ['5 min','Independent response','Students answer a short original exam-style question without the scaffold.'],
      ['2 min','Confidence check','Rate the AQA mastery target and identify one next step.']
    ];
    return [
      ['3 min','Starter',`Retrieve one definition, one equation and one common mistake for ${topic}.`],
      ['7 min','Teach with simulation','Use the step-by-step explainer and accuracy view. Ask for a prediction before each change.'],
      ['6 min','Guided practice','Students explain the simulation using the exam-language panel, then attempt one related task.'],
      ['4 min','Plenary','One-sentence explanation plus confidence rating: Need help / Developing / Secure.']
    ];
  }

  function renderLesson() {
    const host = $('#dt-lesson'); if (!host) return;
    const steps = lessonSteps(state.lessonTopic, Number(state.lessonTime));
    const sec = sections.find(s=>s[0]===state.lessonTopic) || sections[0];
    host.innerHTML = `
      <div class="panel" style="margin-top:12px">
        <div class="two-col"><label class="field"><span>Topic</span><select id="dtLessonTopic">${sections.map(s=>`<option value="${s[0]}" ${s[0]===state.lessonTopic?'selected':''}>${s[0]} · ${s[1]}</option>`).join('')}</select></label><div><span class="small subtle">Lesson length</span><div class="dt-duration" style="margin-top:7px">${[10,20,40].map(n=>`<button class="button ${Number(state.lessonTime)===n?'active':''}" data-lesson-time="${n}">${n} min</button>`).join('')}</div></div></div>
        <div class="dt-plan">${steps.map(([t,title,desc],i)=>`<div class="dt-plan-step"><div class="dt-time">${t}</div><div><strong>${i+1}. ${title}</strong><div class="subtle">${desc}</div></div></div>`).join('')}</div>
        <div class="dt-actions" style="margin-top:12px"><button class="button primary" id="dtOpenLessonSim">Open ${sec[1]} simulation</button><button class="button" id="dtOpenMastery">Open AQA checklist</button><button class="button" id="dtOpenStudio">Open Practice Studio</button></div>
      </div>`;
    $('#dtLessonTopic').onchange=e=>{state.lessonTopic=e.target.value;save();renderLesson()};
    host.querySelectorAll('[data-lesson-time]').forEach(b=>b.onclick=()=>{state.lessonTime=Number(b.dataset.lessonTime);save();renderLesson()});
    $('#dtOpenLessonSim').onclick=()=>openSim(sec[2]);
    $('#dtOpenMastery').onclick=()=>document.querySelector('[data-view="spec"]')?.click();
    $('#dtOpenStudio').onclick=()=>document.querySelector('[data-view="studio"]')?.click();
  }

  function renderCompare() {
    const host = $('#dt-compare'); if (!host) return;
    const selected = particles.filter(p => state.compare.includes(p.id));
    const rows = [['Family','family'],['Charge','charge'],['Mass / scale','mass'],['Structure','structure'],['Baryon no.','B'],['Electron lepton no.','Le'],['Muon lepton no.','Lm'],['Strangeness','S']];
    host.innerHTML = `
      <div class="panel" style="margin-top:12px">
        <p class="subtle">Choose up to four particles. Use the quantum-number rows to practise conservation checks.</p>
        <div class="dt-compare-picks">${particles.map(p=>`<button class="button ${state.compare.includes(p.id)?'active':''}" data-compare-p="${p.id}">${p.symbol} ${p.name}</button>`).join('')}</div>
        <div class="dt-compare" style="margin-top:12px"><table><thead><tr><th>Property</th>${selected.map(p=>`<th>${p.symbol}<br><span class="small subtle">${p.name}</span></th>`).join('')}</tr></thead><tbody>${rows.map(([lab,key])=>`<tr><th>${lab}</th>${selected.map(p=>`<td>${p[key]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>
        <div class="tip" style="margin-top:12px"><strong>AQA method:</strong> for a proposed interaction, total charge, baryon number and each lepton-family number on both sides. Apply the correct strangeness rule and remember energy and momentum must also be conserved.</div>
      </div>`;
    host.querySelectorAll('[data-compare-p]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.compareP, i=state.compare.indexOf(id);
      if(i>=0){if(state.compare.length>1)state.compare.splice(i,1)}else if(state.compare.length<4)state.compare.push(id);
      save();renderCompare();
    });
  }

  function renderData() {
    const host = $('#dt-data'); if (!host) return;
    host.innerHTML = `<div class="dt-grid" style="margin-top:12px">${dataChallenges.map((d,i)=>`<article class="dt-card"><span class="eyebrow">Reason from evidence</span><h3>${d.title}</h3><p>${d.prompt}</p><button class="button" data-data-reveal="${i}">Reveal reasoning</button><div id="dtData${i}"></div></article>`).join('')}</div>`;
    host.querySelectorAll('[data-data-reveal]').forEach(b=>b.onclick=()=>{const i=Number(b.dataset.dataReveal),box=$(`#dtData${i}`);if(box)box.innerHTML=`<div class="dt-data-answer"><strong>Reasoning:</strong> ${dataChallenges[i].answer}</div>`});
  }

  function renderCommands() {
    const host = $('#dt-commands'); if (!host) return;
    const commands = [
      ['State / give','A short factual answer. Do not add a long explanation unless asked.'],
      ['Describe','Say what happens or what the pattern looks like. Use the data or simulation directly.'],
      ['Explain','Give the physics reason: link cause → principle/equation → effect.'],
      ['Calculate','Write the equation, substitute values with units, then give a sensible final answer.'],
      ['Determine','Work out the requested value from the information given; show the reasoning.'],
      ['Show that','Start from known information and demonstrate that the stated result follows. Keep enough significant figures during working.'],
      ['Compare','Make paired statements about both quantities or particles, not two separate descriptions.'],
      ['Justify','Give evidence or physics that supports the choice or conclusion.']
    ];
    host.innerHTML = `<div class="panel" style="margin-top:12px"><span class="eyebrow">Turn knowledge into marks</span><h3>Command-word translator</h3><div class="dt-command-grid">${commands.map(([c,d])=>`<div class="dt-command"><strong>${c}</strong><span class="subtle">${d}</span></div>`).join('')}</div><div class="tip" style="margin-top:12px"><strong>Useful structure for explanations:</strong> identify what changes → name the physics principle/equation → link it to the observed result. For particle reactions, explicitly state which conserved quantity you checked.</div></div>`;
  }

  function init() {
    addStyle(); addShell(); renderDiagnostic(); renderLesson(); renderCompare(); renderData(); renderCommands();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
