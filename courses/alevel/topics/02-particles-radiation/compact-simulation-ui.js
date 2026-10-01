
(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const keyInfo = {
    atom: {
      watch:'Notice how changing neutron number changes the isotope without changing the element.',
      science:'Z fixes the element; A = protons + neutrons. Electron positions are schematic probability regions, not fixed planetary orbits.'
    },
    specific: {
      watch:'Watch how net charge and total mass change the value and sign of Q/m.',
      science:'Specific charge = Q/m. A small mass can produce a very large magnitude of specific charge.'
    },
    strong: {
      watch:'Move the nucleons closer and identify where the force is attractive, repulsive or negligible.',
      science:'The strong nuclear force is attractive over normal nuclear separations, repulsive below about 0.5 fm and negligible beyond about 3 fm.'
    },
    decay: {
      watch:'Follow how A and Z change and which particles are emitted in α, β⁻ and β⁺ processes.',
      science:'β decay is a weak interaction. In β⁻, a down quark changes to an up quark and a neutron becomes a proton.'
    },
    antimatter: {
      watch:'Compare annihilation with pair production and track where the energy goes.',
      science:'Particle–antiparticle processes conserve energy and momentum. e⁻e⁺ pair creation needs at least 1.022 MeV of rest energy.'
    },
    interactions: {
      watch:'Identify the incoming particles, exchange particle and outgoing particles at each interaction.',
      science:'AQA uses virtual photons for electromagnetic interactions and W⁺/W⁻ for the weak interactions studied here.'
    },
    classification: {
      watch:'Sort particles into hadrons and leptons, then split hadrons into baryons and mesons.',
      science:'Baryons are three-quark hadrons; mesons are quark–antiquark hadrons; leptons do not experience the strong interaction.'
    },
    quarks: {
      watch:'Add fractional charge, baryon number and strangeness to see how a hadron’s total properties are built.',
      science:'AQA requires u, d and s quarks and their antiquarks. Proton = uud and neutron = udd.'
    },
    photo: {
      watch:'Change frequency and intensity separately. See which one changes whether emission happens and which changes the number emitted.',
      science:'One photon transfers energy hf to one electron. hf = φ + KEmax and KEmax = eVs.'
    },
    collisions: {
      watch:'Increase incident electron energy and distinguish no transition, excitation and ionisation.',
      science:'Excitation requires an allowed discrete energy transfer; ionisation removes an electron completely.'
    },
    levels: {
      watch:'Change the transition and connect the energy gap to the emitted photon and spectral line.',
      science:'Photon energy equals the level difference: ΔE = hf = hc/λ.'
    },
    diffraction: {
      watch:'Increase accelerating voltage and see the diffraction pattern tighten as wavelength falls.',
      science:'Electron diffraction demonstrates wave behaviour. de Broglie wavelength obeys λ = h/p.'
    },
    rutherford: {
      watch:'Change impact parameter and nuclear charge, then watch how the alpha-particle deflection changes.',
      science:'Large-angle scattering is caused by electrostatic repulsion from a tiny, concentrated positive nucleus.'
    }
  };

  let currentSim = 'atom';
  let shellBuilt = false;
  let stepObserver = null;

  function activeSim() {
    return $('#simNav .sim-tab.active')?.dataset.sim || currentSim || 'atom';
  }

  function createToolbar(lab) {
    if ($('#compactSimToolbar')) return;
    const nav = $('#simNav');
    if (!nav) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'compactSimToolbar';
    toolbar.className = 'panel compact-sim-toolbar';
    toolbar.innerHTML = `
      <button class="button" id="compactPrevSim" aria-label="Previous simulation">←</button>
      <label class="compact-sim-select"><span>Simulation</span><select id="compactSimSelect" aria-label="Choose simulation"></select></label>
      <button class="button" id="compactNextSim" aria-label="Next simulation">→</button>`;
    nav.insertAdjacentElement('afterend', toolbar);

    rebuildSelect();
    $('#compactSimSelect').addEventListener('change', e => openSim(e.target.value));
    $('#compactPrevSim').addEventListener('click', () => cycle(-1));
    $('#compactNextSim').addEventListener('click', () => cycle(1));
  }

  function rebuildSelect() {
    const select = $('#compactSimSelect');
    if (!select) return;
    const tabs = $$('#simNav .sim-tab');
    if (!tabs.length) return;
    const selected = activeSim();
    select.innerHTML = tabs.map(tab => `<option value="${tab.dataset.sim}">${tab.textContent.trim()}</option>`).join('');
    select.value = selected;
  }

  function cycle(dir) {
    const tabs = $$('#simNav .sim-tab');
    if (!tabs.length) return;
    const id = activeSim();
    let i = tabs.findIndex(t => t.dataset.sim === id);
    if (i < 0) i = 0;
    i = (i + dir + tabs.length) % tabs.length;
    tabs[i].click();
  }

  function openSim(id) {
    const tab = $$('#simNav .sim-tab').find(t => t.dataset.sim === id);
    tab?.click();
  }

  function buildShell() {
    const lab = $('#view-lab');
    const side = $('.lab-side');
    const viewer = $('.viewer-wrap');
    if (!lab || !side || !viewer) return false;

    lab.classList.add('compact-simulation-lab');
    createToolbar(lab);

    if (!$('#compactViewOverlay')) {
      const overlay = document.createElement('div');
      overlay.id = 'compactViewOverlay';
      overlay.className = 'compact-view-overlay';
      overlay.innerHTML = `
        <div class="compact-overlay-row"><strong>WATCH</strong><span id="compactOverlayWatch"></span></div>
        <div class="compact-overlay-row"><strong>SCIENCE</strong><span id="compactOverlayScience"></span></div>`;
      viewer.appendChild(overlay);
    }

    const heading = $('.sim-heading', side);
    if (!$('#compactKeyStrip')) {
      const strip = document.createElement('div');
      strip.id = 'compactKeyStrip';
      strip.className = 'compact-key-strip';
      strip.innerHTML = `
        <div class="compact-key-card"><span>What is happening?</span><p id="compactHappening"></p></div>
        <div class="compact-key-card"><span>Key physics</span><p id="compactPhysics"></p></div>`;
      heading?.insertAdjacentElement('afterend', strip);
    }

    if (!$('#compactStepNow')) {
      const step = document.createElement('section');
      step.id = 'compactStepNow';
      step.className = 'compact-step-now';
      step.innerHTML = `
        <div class="compact-step-top">
          <span id="compactStepLabel" class="compact-step-label">Step-by-step</span>
          <div class="compact-step-buttons">
            <button type="button" id="compactStepPrev" aria-label="Previous explanation step">←</button>
            <button type="button" id="compactStepNext" aria-label="Next explanation step">→</button>
          </div>
        </div>
        <h4 id="compactStepTitle">What happens first?</h4>
        <p id="compactStepBody">Use the controls and follow the explanation one step at a time.</p>
        <div id="compactStepEquation" class="compact-step-equation"></div>`;
      $('#simReadout')?.insertAdjacentElement('afterend', step);
      $('#compactStepPrev').onclick = () => $('#stepPrev')?.click();
      $('#compactStepNext').onclick = () => $('#stepNext')?.click();
    }

    if (!$('#compactInfoShell')) {
      const shell = document.createElement('section');
      shell.id = 'compactInfoShell';
      shell.className = 'compact-info-shell';
      shell.innerHTML = `
        <div class="compact-info-tabs">
          <button class="compact-info-tab active" data-compact-pane="overview">Overview</button>
          <button class="compact-info-tab" data-compact-pane="exam">Exam help</button>
          <button class="compact-info-tab" data-compact-pane="check">Quick check</button>
          <button class="compact-info-tab" data-compact-pane="more">More detail</button>
        </div>
        <div class="compact-pane active" id="compactPaneOverview"></div>
        <div class="compact-pane" id="compactPaneExam"></div>
        <div class="compact-pane" id="compactPaneCheck"></div>
        <div class="compact-pane" id="compactPaneMore"></div>`;
      side.appendChild(shell);
      $$('.compact-info-tab', shell).forEach(btn => {
        btn.addEventListener('click', () => {
          $$('.compact-info-tab', shell).forEach(x => x.classList.toggle('active', x === btn));
          $$('.compact-pane', shell).forEach(p => p.classList.remove('active'));
          $('#compactPane' + btn.dataset.compactPane[0].toUpperCase() + btn.dataset.compactPane.slice(1))?.classList.add('active');
        });
      });
    }

    shellBuilt = true;
    organize();
    updateKeyInfo();
    syncStep();
    return true;
  }

  function moveInto(node, target) {
    if (!node || !target || node.parentElement === target) return;
    target.appendChild(node);
  }

  function organize() {
    if (!shellBuilt) return;
    const overview = $('#compactPaneOverview');
    const exam = $('#compactPaneExam');
    const check = $('#compactPaneCheck');
    const more = $('#compactPaneMore');
    if (!overview || !exam || !check || !more) return;

    moveInto($('.simple-box'), overview);
    moveInto($('#predictionBox'), overview);
    moveInto($('#ruthLabLauncher'), overview);

    moveInto($('.exam-box'), exam);
    moveInto($('.mistake-box'), exam);

    moveInto($('.checkpoint-box'), check);

    moveInto($('#classroomTools'), more);
    moveInto($('#aqaDeepDive'), more);
    moveInto($('#accuracyVisualWrap'), more);
    moveInto($('#stepGuide'), more);
  }

  function textOf(el) {
    return (el?.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function updateKeyInfo() {
    const id = activeSim();
    currentSim = id;
    const d = keyInfo[id] || keyInfo.atom;
    const simple = textOf($('#simpleExplain'));
    const sub = textOf($('#simSubtitle'));

    if ($('#compactHappening')) $('#compactHappening').textContent = simple || sub || d.watch;
    if ($('#compactPhysics')) $('#compactPhysics').textContent = d.science;
    if ($('#compactOverlayWatch')) $('#compactOverlayWatch').textContent = d.watch;
    if ($('#compactOverlayScience')) $('#compactOverlayScience').textContent = d.science;
    if ($('#compactSimSelect')) $('#compactSimSelect').value = id;
  }

  function syncStep() {
    const content = $('#stepContent');
    if (!content) return;
    const label = textOf($('.step-number', content));
    const title = textOf($('h4', content));
    const body = textOf($('p', content));
    const equation = textOf($('.step-equation', content));
    if ($('#compactStepLabel')) $('#compactStepLabel').textContent = label || 'Step-by-step';
    if ($('#compactStepTitle')) $('#compactStepTitle').textContent = title || 'Follow the process';
    if ($('#compactStepBody')) $('#compactStepBody').textContent = body || 'Use Next to move through the explanation.';
    if ($('#compactStepEquation')) {
      $('#compactStepEquation').textContent = equation;
      $('#compactStepEquation').style.display = equation ? '' : 'none';
    }
    if ($('#compactStepPrev')) $('#compactStepPrev').disabled = $('#stepPrev')?.disabled || false;
  }

  function attachEvents() {
    document.addEventListener('click', e => {
      if (e.target.closest?.('#simNav .sim-tab')) {
        setTimeout(() => {
          organize();
          updateKeyInfo();
          syncStep();
          const select = $('#compactSimSelect');
          if (select) select.value = activeSim();
        }, 90);
      }
      if (e.target.closest?.('#stepPrev,#stepNext,.step-dot')) {
        setTimeout(syncStep, 20);
      }
    });
    document.addEventListener('input', e => {
      if (e.target.closest?.('#simControls')) requestAnimationFrame(updateKeyInfo);
    });
    document.addEventListener('change', e => {
      if (e.target.closest?.('#simControls')) requestAnimationFrame(updateKeyInfo);
    });
  }

  function watchStepGuide() {
    const content = $('#stepContent');
    if (!content || stepObserver) return;
    stepObserver = new MutationObserver(syncStep);
    stepObserver.observe(content, {childList:true, subtree:true, characterData:true});
  }

  function init() {
    attachEvents();
    let tries = 0;
    const timer = setInterval(() => {
      tries++;
      if (!shellBuilt) buildShell();
      if (shellBuilt) {
        organize();
        updateKeyInfo();
        syncStep();
        watchStepGuide();
        if (tries >= 20) clearInterval(timer);
      } else if (tries > 40) {
        clearInterval(timer);
      }
    }, 150);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
