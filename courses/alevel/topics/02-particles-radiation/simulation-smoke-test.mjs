
import { chromium } from 'playwright';

const BASE = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const expected = [
  'atom','specific','strong','decay','antimatter','interactions','classification',
  'quarks','photo','collisions','levels','diffraction','rutherford'
];

const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
page.setDefaultTimeout(8000);
const pageErrors = [];
page.on('pageerror', err => pageErrors.push(String(err)));
page.on('console', msg => {
  if (msg.type() === 'error') pageErrors.push('console: ' + msg.text());
});

try {
  console.log('SMOKE: boot');
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator('[data-view="lab"]').click();
  await page.waitForSelector('#simNav .sim-tab', { timeout: 10000 });

  const ids = await page.locator('#simNav .sim-tab').evaluateAll(nodes => nodes.map(n => n.dataset.sim));
  if (JSON.stringify(ids) !== JSON.stringify(expected)) {
    throw new Error('Simulation registry mismatch: ' + JSON.stringify(ids));
  }

  try {
    await page.waitForFunction(() => {
      const t = document.querySelector('#renderStatus')?.textContent || '';
      return t && !/loading 3d engine/i.test(t);
    }, null, { timeout: 15000 });
  } catch (err) {
    console.error('Renderer status:', await page.locator('#renderStatus').textContent().catch(() => 'missing'));
    console.error('Browser errors:', pageErrors);
    throw err;
  }
  const rendererStatus = (await page.locator('#renderStatus').textContent())?.trim() || '';
  if (!/3D model ready/i.test(rendererStatus)) {
    throw new Error('Expected real 3D renderer, got: ' + rendererStatus + '\n' + pageErrors.join('\n'));
  }

  console.log('SMOKE: core simulations');
  // Drag-and-drop atom builder overlay check.
  await page.locator('#simNav .sim-tab[data-sim="atom"]').click();
  await page.waitForTimeout(120);
  if (!(await page.locator('#atomDragBuilder').count())) throw new Error('Drag-and-drop atom builder overlay missing');
  if ((await page.locator('.atom-drag-token').count()) !== 3) throw new Error('Drag-and-drop particle palette is incomplete');

  // Start from carbon-12, then drag a neutron into the nucleus and verify carbon-13.
  await page.locator('#atomZ').fill('6');
  await page.locator('#atomN').fill('6');
  await page.locator('#atomE').fill('6');
  await page.locator('#atomE').dispatchEvent('input');
  await page.waitForTimeout(80);
  await page.evaluate(() => {
    const token=document.querySelector('.atom-drag-token[data-particle="neutron"]');
    const zone=document.querySelector('.atom-nucleus-zone');
    if(!token||!zone) throw new Error('Atom drag source/target missing');
    const dt=new DataTransfer();
    token.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer:dt}));
    zone.dispatchEvent(new DragEvent('dragenter',{bubbles:true,cancelable:true,dataTransfer:dt}));
    zone.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt}));
    zone.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));
    token.dispatchEvent(new DragEvent('dragend',{bubbles:true,cancelable:true,dataTransfer:dt}));
  });
  await page.waitForTimeout(100);
  const draggedState = await page.evaluate(() => window.PARTICLELAB_ATOM_STATE);
  if (!draggedState || draggedState.Z !== 6 || draggedState.neutrons !== 7 || draggedState.A !== 13) {
    throw new Error('Dragging neutron onto nucleus did not create carbon-13');
  }

  // Atom builder completion check.
  await page.locator('#simNav .sim-tab[data-sim="atom"]').click();
  await page.waitForTimeout(120);
  for (const id of ['atomZ','atomN','atomA','atomE','atomNPlus','atomNMinus']) {
    if (!(await page.locator('#' + id).count())) throw new Error('Atom builder control missing: ' + id);
  }

  // Prove a real isotope change: carbon-12 -> carbon-14 by changing neutrons only.
  await page.locator('#atomZ').fill('6');
  await page.locator('#atomN').fill('6');
  await page.locator('#atomE').fill('6');
  await page.locator('#atomE').dispatchEvent('input');
  await page.waitForTimeout(80);
  await page.locator('#atomNPlus').click();
  await page.locator('#atomNPlus').click();
  await page.waitForTimeout(80);
  const carbon14 = await page.evaluate(() => window.PARTICLELAB_ATOM_STATE);
  if (!carbon14 || carbon14.Z !== 6 || carbon14.A !== 14 || carbon14.neutrons !== 8 || carbon14.electrons !== 6) {
    throw new Error('Atom builder could not create carbon-14 by changing neutron number');
  }

  // Prove the sodium-23 lesson target can be built.
  await page.locator('#atomZ').fill('11');
  await page.locator('#atomN').fill('12');
  await page.locator('#atomE').fill('11');
  await page.locator('#atomE').dispatchEvent('input');
  await page.waitForTimeout(100);
  const atomState = await page.evaluate(() => window.PARTICLELAB_ATOM_STATE);
  if (!atomState || atomState.Z !== 11 || atomState.A !== 23 || atomState.electrons !== 11 || atomState.neutrons !== 12) {
    throw new Error('Atom builder could not construct neutral sodium-23');
  }
  if (!(await page.locator('#atomDragBuilder').count())) throw new Error('On-screen drag atom builder missing');
  const neutronToken = page.locator('.atom-drag-token[data-particle="neutron"]');
  const nucleusDrop = page.locator('.atom-drop-zone[data-drop="nucleus"]');

  // Start from carbon-12, then create carbon-14 by dragging two neutrons onto the nucleus.
  await page.locator('#atomZ').fill('6');
  await page.locator('#atomN').fill('6');
  await page.locator('#atomE').fill('6');
  await page.locator('#atomE').dispatchEvent('input');
  await page.waitForTimeout(60);
  const dragNeutronToNucleus = async () => {
    await page.evaluate(() => {
      const token=document.querySelector('.atom-drag-token[data-particle="neutron"]');
      const zone=document.querySelector('.atom-drop-zone[data-drop="nucleus"]');
      if(!token||!zone)throw new Error('Atom drag token or nucleus target missing');
      const dt=new DataTransfer();
      token.dispatchEvent(new DragEvent('dragstart',{bubbles:true,cancelable:true,dataTransfer:dt}));
      zone.dispatchEvent(new DragEvent('dragover',{bubbles:true,cancelable:true,dataTransfer:dt}));
      zone.dispatchEvent(new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:dt}));
      token.dispatchEvent(new DragEvent('dragend',{bubbles:true,cancelable:true,dataTransfer:dt}));
    });
    await page.waitForTimeout(70);
  };
  await dragNeutronToNucleus();
  await dragNeutronToNucleus();
  await page.waitForTimeout(100);
  const draggedCarbon14 = await page.evaluate(() => window.PARTICLELAB_ATOM_STATE);
  if (!draggedCarbon14 || draggedCarbon14.Z !== 6 || draggedCarbon14.neutrons !== 8 || draggedCarbon14.A !== 14) {
    throw new Error('Dragging neutrons onto the nucleus did not create carbon-14');
  }

  if (!(await page.locator('#atomBuilderPractice').count())) throw new Error('Atom Builder Practice panel missing');
  const atomPracticeText = (await page.locator('#atomBuilderPractice').textContent()) || '';
  if (!/sodium-23/i.test(atomPracticeText) || !/Build knowledge/i.test(atomPracticeText)) {
    throw new Error('Atom Builder Practice is incomplete');
  }

  const results = [];
  for (const id of expected) {
    const tab = page.locator('#simNav .sim-tab[data-sim="' + id + '"]');
    await tab.click();
    await page.waitForTimeout(120);

    const title = (await page.locator('#simTitle').textContent())?.trim();
    const controlsText = (await page.locator('#simControls').textContent())?.trim();
    const readoutText = (await page.locator('#simReadout').textContent())?.trim();

    if (!title) throw new Error(id + ': missing title');
    if (!controlsText) throw new Error(id + ': missing controls');
    if (!readoutText || /loading interactive model/i.test(readoutText)) {
      throw new Error(id + ': readout did not initialize');
    }

    const select = page.locator('#simControls select').first();
    if (await select.count()) {
      const options = await select.locator('option').evaluateAll(os => os.map(o => o.value));
      if (options.length > 1) {
        await select.selectOption(options[options.length - 1]);
        await page.waitForTimeout(80);
      }
    }

    const range = page.locator('#simControls input[type="range"]').first();
    if (await range.count()) {
      await range.evaluate(el => {
        const min = Number(el.min || 0), max = Number(el.max || 100);
        el.value = String(min + (max - min) * 0.62);
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(80);
    }

    const action = page.locator('#simControls button').first();
    if (await action.count()) {
      await action.click();
      await page.waitForTimeout(100);
    }

    const after = (await page.locator('#simReadout').textContent())?.trim();
    if (!after) throw new Error(id + ': readout disappeared after interaction');

    const mission = page.locator('#simulationMissionPanel');
    if (!(await mission.count())) throw new Error(id + ': missing guided simulation mission');
    const missionText = (await mission.textContent()) || '';
    if (!/Learning mission|Optional extension/i.test(missionText)) throw new Error(id + ': simulation mission did not render');
    if ((await mission.locator('[data-mission-done]').count()) < 3) throw new Error(id + ': simulation mission is incomplete');

    await page.waitForSelector('#simReadout .sim-readout-flow', { timeout: 3000 });
    const keyStrip = page.locator('#simKeyStrip');
    if (!(await keyStrip.count())) throw new Error(id + ': missing key-information strip');
    const keyText = (await keyStrip.textContent())?.trim();
    if (!keyText) throw new Error(id + ': key-information strip is empty');

    const legend = page.locator('#simParticleLegend');
    if (!(await legend.count())) throw new Error(id + ': missing model key');
    const legendText = (await legend.textContent())?.trim() || '';
    if (legendText.includes('Target ring')) throw new Error(id + ': obsolete target-ring legend is still visible');

    const guide = page.locator('#simObjectGuide');
    if (!(await guide.count())) throw new Error(id + ': missing external model guide');
    const guideButtons = guide.locator('.sim-guide-button');
    if ((await guideButtons.count()) < 1) throw new Error(id + ': model guide has no explanatory items');

    const sideMetrics = await page.locator('.lab-side').evaluate(el => {
      const root=el.getBoundingClientRect();
      const offenders=[...el.querySelectorAll('*')].map(node=>{
        const r=node.getBoundingClientRect(),cs=getComputedStyle(node);
        return {tag:node.tagName.toLowerCase(),id:node.id||'',cls:String(node.className||'').slice(0,120),left:Math.round(r.left),right:Math.round(r.right),width:Math.round(r.width),clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,overflowX:cs.overflowX,whiteSpace:cs.whiteSpace,position:cs.position};
      }).filter(x=>x.right>root.right+4 || (x.scrollWidth>x.clientWidth+4 && x.overflowX==='visible')).sort((a,b)=>(b.right-root.right)-(a.right-root.right)).slice(0,12);
      return {clientWidth:el.clientWidth,scrollWidth:el.scrollWidth,left:Math.round(root.left),right:Math.round(root.right),offenders};
    });
    if (sideMetrics.scrollWidth > sideMetrics.clientWidth + 4) {
      console.error(id+': lab-side overflow diagnostics',JSON.stringify(sideMetrics,null,2));
      throw new Error(id + ': simulation information column has horizontal overflow');
    }

    const essentials = page.locator('#simEssentials');
    if (!(await essentials.count())) throw new Error(id + ': missing exam essentials panel');
    const essentialText = (await essentials.textContent())?.trim() || '';
    if (!essentialText.includes('Must know') || !essentialText.includes('Exam technique')) {
      throw new Error(id + ': essentials tabs are incomplete');
    }
    const specPill = (await page.locator('#studySpecPill').textContent())?.trim() || '';
    if (!specPill) throw new Error(id + ': missing AQA specification tag');

    const coach = page.locator('#simChangeCoach');
    if (!(await coach.count())) throw new Error(id + ': missing live change coach');
    const coachText = (await coach.textContent())?.trim() || '';
    for (const phrase of ['What you should see','Why it happens','Exam connection','Try next']) {
      if (!coachText.includes(phrase)) throw new Error(id + ': live coach missing ' + phrase);
    }

    results.push({ id, title, ok: true });
  }

  const focusButton = page.locator('[data-study-mode="focus"]');
  const fullButton = page.locator('[data-study-mode="full"]');
  if (!(await focusButton.count()) || !(await fullButton.count())) throw new Error('Student Focus / Full tools controls are missing');
  await focusButton.click();
  if (!(await page.locator('body').evaluate(el => el.classList.contains('sim-focus-mode')))) throw new Error('Focus view did not activate');
  await fullButton.click();
  if (!(await page.locator('body').evaluate(el => el.classList.contains('sim-full-mode')))) throw new Error('Full tools view did not activate');

  const fullGuide = page.locator('#simObjectGuide .sim-guide-button').first();
  if (!(await fullGuide.isVisible())) throw new Error('Model guide is not visible in Full tools mode');
  await fullGuide.click();
  await page.waitForTimeout(40);
  const selectedGuideText = (await page.locator('#live3DSelected').textContent())?.trim() || '';
  if (!selectedGuideText || /use the model guide/i.test(selectedGuideText)) throw new Error('Model guide did not update the explanation panel in Full tools mode');

  await focusButton.click();

  const soundButton = page.locator('#simSoundToggle');
  const soundTest = page.locator('#simSoundTest');
  if (!(await soundButton.count()) || !(await soundTest.count())) throw new Error('Simulation sound controls are missing');
  const soundApi = await page.evaluate(() => ({
    exists: !!window.PARTICLELAB_SOUND,
    hasTest: typeof window.PARTICLELAB_SOUND?.test === 'function',
    hasCue: typeof window.PARTICLELAB_SOUND?.cue === 'function'
  }));
  if (!soundApi.exists || !soundApi.hasTest || !soundApi.hasCue) throw new Error('Simulation sound API is not wired');
  await soundTest.click();
  await page.waitForTimeout(80);

  console.log('SMOKE: start here');
  // Complete-beginner pathway checks.
  const startNav = page.locator('[data-view="starthere"]');
  if (!(await startNav.count())) throw new Error('Start Here navigation missing');
  await startNav.click();
  await page.waitForSelector('#view-starthere.active-view', { timeout: 5000 });
  if ((await page.locator('[data-dq]').count()) < 12) throw new Error('Beginner diagnostic is incomplete');
  if ((await page.locator('[data-bridge]').count()) < 6) throw new Error('Prerequisite bridge is incomplete');
  if (!(await page.locator('#beginLesson1').count())) throw new Error('Begin Lesson 1 action missing');

  console.log('SMOKE: revision hub');
  // Revision hub checks.
  const revisionNav = page.locator('[data-view="revisionhub"]');
  if (!(await revisionNav.count())) throw new Error('Revision Hub navigation missing');
  await revisionNav.click();
  await page.waitForSelector('#view-revisionhub.active-view', { timeout: 5000 });
  for (const tab of ['today','flash','mixed','formula','definitions','glossary','spec','errors']) {
    if (!(await page.locator('[data-revision-tab="' + tab + '"]').count())) throw new Error('Missing revision tab: ' + tab);
  }
  await page.locator('[data-revision-tab="glossary"]').click();
  await page.waitForTimeout(60);
  if ((await page.locator('.glossary-entry').count()) < 30) throw new Error('Glossary is too small');
  await page.locator('[data-revision-tab="spec"]').click();
  await page.waitForTimeout(60);
  if ((await page.locator('[data-spec]').count()) < 30) throw new Error('Specification checklist is incomplete');

  await page.locator('[data-revision-tab="organiser"]').click();
  await page.waitForTimeout(60);
  if (!(await page.locator('#knowledgeOrganiser').count())) throw new Error('Knowledge organiser is missing');
  if ((await page.locator('#knowledgeOrganiser .ko-block').count()) < 10) throw new Error('Knowledge organiser is incomplete');
  if (!(await page.locator('#printOrganiser').count())) throw new Error('Knowledge organiser print action is missing');

  console.log('SMOKE: exam skills');
  // AQA Physics exam-skills coach checks.
  const examSkillsNav = page.locator('[data-view="examskills"]');
  if (!(await examSkillsNav.count())) throw new Error('Exam Skills navigation missing');
  await examSkillsNav.click();
  await page.waitForSelector('#view-examskills.active-view', { timeout: 5000 });
  if ((await page.locator('.command-card').count()) < 8) throw new Error('Command-word coach is incomplete');
  if ((await page.locator('[data-worked]').count()) < 8) throw new Error('Worked-example bank is incomplete');
  if ((await page.locator('.mark-killer').count()) < 8) throw new Error('Common-error coaching is incomplete');

  console.log('SMOKE: lesson sequence');
  // Classroom lesson sequence checks.
  await page.locator('[data-view="course"]').click();
  await page.waitForSelector('#courseList.lesson-sequence-sidebar', { timeout: 5000 });
  const sequenceButtons = page.locator('[data-seq-lesson]');
  if ((await sequenceButtons.count()) !== 16) throw new Error('Expected 16 teaching-sequence lessons');
  const firstLessonText = (await sequenceButtons.first().textContent()) || '';
  if (!/Atomic structure/i.test(firstLessonText)) throw new Error('Lesson 1 is not atomic structure');

  await sequenceButtons.first().click();
  await page.waitForTimeout(120);
  if (!(await page.locator('.lesson-current-step').count())) {
    const debug = await page.evaluate(() => ({
      courseClass: document.querySelector('#courseList')?.className || '',
      panelClass: document.querySelector('#lessonPanel')?.className || '',
      panelText: (document.querySelector('#lessonPanel')?.textContent || '').slice(0,1200),
      panelHTML: (document.querySelector('#lessonPanel')?.innerHTML || '').slice(0,2500),
      viewStore: localStorage.getItem('particleLessonViewV2'),
      currentStore: localStorage.getItem('particleLessonCurrentV2'),
      lessonButtons: [...document.querySelectorAll('[data-seq-lesson]')].length,
      activeLesson: document.querySelector('[data-seq-lesson].active')?.getAttribute('data-seq-lesson') || null
    }));
    console.error('LESSON_SEQUENCE_DEBUG', JSON.stringify(debug,null,2));
    throw new Error('Guided current-step view is missing');
  }
  // Regression: core teaching chunks must switch without any secondary controller.
  await page.locator('[data-seq-stage="2"]').click();
  await page.waitForTimeout(80);
  const coreChunks = page.locator('[data-core-chunk]');
  if ((await coreChunks.count()) < 4) throw new Error('Lesson 1 core chunk selector is incomplete');
  const openBefore = page.locator('.lesson-active-section .lesson-chunk-rich[open]');
  if (await openBefore.count() !== 1 || await openBefore.getAttribute('data-lesson-chunk') !== '0') throw new Error('Lesson 1 did not start with chunk 1 open');
  const apiBefore = await page.evaluate(() => window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.());
  if (apiBefore !== 0) throw new Error('Core chunk state did not start at 0');
  await page.locator('#coreChunkNext').click();
  await page.waitForTimeout(80);
  const openAfter = page.locator('.lesson-active-section .lesson-chunk-rich[open]');
  const apiAfter = await page.evaluate(() => window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.());
  if (await openAfter.count() !== 1 || await openAfter.getAttribute('data-lesson-chunk') !== '1' || apiAfter !== 1) throw new Error('Next chunk did not advance from chunk 1 to chunk 2');
  await page.locator('#coreChunkPrev').click();
  await page.waitForTimeout(80);
  const openReturned = page.locator('.lesson-active-section .lesson-chunk-rich[open]');
  if (await openReturned.count() !== 1 || await openReturned.getAttribute('data-lesson-chunk') !== '0') throw new Error('Previous chunk did not return to chunk 1');

  // Native fallback: a chunk heading must open even without using the JS navigation buttons.
  await page.locator('.lesson-active-section .lesson-chunk-rich[data-lesson-chunk="1"] > summary').click();
  await page.waitForTimeout(30);
  if (!(await page.locator('.lesson-active-section .lesson-chunk-rich[data-lesson-chunk="1"]').evaluate(el => el.open))) throw new Error('Native chunk accordion did not open when its heading was clicked');

  await page.locator('[data-seq-stage="0"]').click();
  await page.waitForTimeout(50);
  const beforeStep = (await page.locator('#lessonStepProgress').textContent()) || '';
  await page.locator('#lessonStepDone').click();
  await page.waitForTimeout(80);
  const afterStep = (await page.locator('#lessonStepProgress').textContent()) || '';
  if (beforeStep === afterStep) throw new Error('Lesson step progress did not advance');
  await page.locator('[data-lesson-view="full"]').click();
  await page.waitForTimeout(50);
  if (!(await page.locator('.lesson-full-plan').count())) throw new Error('Full lesson plan view did not open');

  // Regression: stage tabs must open their exact section even when Full lesson plan was previously selected.
  await page.locator('[data-seq-stage="4"]').click();
  await page.waitForTimeout(70);
  if (!(await page.locator('.lesson-current-step').count())) throw new Error('Stage tab did not return to Guided view from Full lesson plan');
  const practiceHeading = ((await page.locator('.lesson-active-section h3').textContent()) || '').trim();
  if (!/Worked example|exam practice/i.test(practiceHeading)) throw new Error('Practice section did not open from Full lesson plan');
  await page.locator('[data-lesson-view="full"]').click();
  await page.waitForTimeout(50);

  const taskCount = await page.locator('.lesson-task-card').count();
  if (taskCount < 6) throw new Error('Lesson 1 independent task bank is incomplete');
  await page.locator('[data-lesson-view="guided"]').click();
  await page.waitForTimeout(50);

  const lastLessonText = (await sequenceButtons.last().textContent()) || '';
  if (!/Rutherford/i.test(lastLessonText)) throw new Error('Lesson 16 is not Rutherford extension');
  if (!(await page.locator('#lessonSequenceProgress').count())) throw new Error('Lesson sequence progress is missing');

  if (await page.locator('#studentMasteryPath').count()) throw new Error('Duplicate mastery chunk interface should not be present');

  await page.locator('[data-view="lab"]').click();
  await page.locator('#simNav .sim-tab[data-sim="atom"]').click();
  await page.waitForTimeout(120);
  if (!(await page.locator('#toggleHotspots').count())) throw new Error('Inspect 3D control is missing');
  await page.locator('#missionInspect').click();
  await page.waitForTimeout(80);
  const inspectOn = await page.evaluate(() => window.PARTICLELAB_CORE?.getInspectMode?.());
  if (!inspectOn) throw new Error('Inspect 3D mode did not activate');
  const guideCount = await page.evaluate(() => (window.PARTICLELAB_GUIDES?.atom || []).length);
  if (guideCount < 2) throw new Error('Atom 3D inspection guide is incomplete');

  await page.locator('[data-view="course"]').click();
  await page.waitForTimeout(80);
  await sequenceButtons.nth(10).click();
  await page.waitForTimeout(80);
  const lesson11Title = (await page.locator('#lessonPanel h2').textContent()) || '';
  if (!/Photoelectric/i.test(lesson11Title)) throw new Error('Lesson 11 is not photoelectric effect');
  await page.locator('[data-seq-stage="3"]').click();
  await page.waitForTimeout(60);
  await page.locator('#sequenceActivity').click();
  await page.waitForTimeout(120);
  if (!(await page.locator('#view-lab').evaluate(el => el.classList.contains('active-view')))) throw new Error('Lesson activity did not open the simulation lab');
  if (!(await page.locator('.sim-tab[data-sim="photo"]').evaluate(el => el.classList.contains('active')))) throw new Error('Lesson 11 did not launch photoelectric simulation');

  console.log('SMOKE: learning tools');
  // Feature suite checks.
  await page.locator('[data-view="lab"]').click();
  await page.waitForSelector('#learningSuite', { state: 'attached', timeout: 5000 });
  for (const tool of ['inspector','compare','graphs','measure','practical','exam']) {
    if (!(await page.locator('#lt-' + tool).count())) throw new Error('Missing learning tool: ' + tool);
  }
  if (!(await page.locator('#measureOverlay').count())) throw new Error('Measurement overlay missing');

  const learningSuite = page.locator('#learningSuite');
  if (await learningSuite.isVisible()) throw new Error('Learning Tools should be hidden in Focus mode');
  await page.locator('[data-study-mode="full"]').click();
  await page.waitForTimeout(80);
  if (!(await learningSuite.isVisible())) throw new Error('Learning Tools did not become visible in Full tools mode');
  await page.locator('[data-study-mode="focus"]').click();

  const hubNav = page.locator('[data-view="learninghub"]');
  if (!(await hubNav.count())) throw new Error('Learning Tools navigation missing');
  await hubNav.click();
  await page.waitForSelector('#view-learninghub.active-view', { timeout: 5000 });
  for (const panel of ['mastery','teacher','challenge','feynman','history','access','language']) {
    if (!(await page.locator('#hub-' + panel).count())) throw new Error('Missing learning hub panel: ' + panel);
  }

  await page.locator('[data-hub="language"]').click();
  await page.locator('[data-lang="zh"]').click();
  await page.waitForTimeout(160);
  if ((await page.locator('html').getAttribute('lang')) !== 'zh-CN') throw new Error('Mandarin mode did not activate');
  if (!(await page.evaluate(() => !!window.PARTICLELAB_MANDARIN_GLOBAL))) throw new Error('Global Mandarin catalogue did not load');

  const hasCJK = text => /[\u3400-\u9fff]/.test(text || '');

  // Simulation lab: title and all core explanations must be Mandarin.
  await page.locator('[data-view="lab"]').click();
  await page.locator('.sim-tab[data-sim="atom"]').click();
  await page.waitForTimeout(100);
  for (const selector of ['#simTitle','#simSubtitle','#simpleExplain','#examExplain','#mistakeExplain']) {
    const txt=(await page.locator(selector).textContent())||'';
    if(!hasCJK(txt)) throw new Error('Mandarin simulation text missing at '+selector+': '+txt);
  }

  // Quiz question, choices and static controls.
  await page.locator('[data-view="quiz"]').click();
  await page.waitForTimeout(60);
  if(!hasCJK((await page.locator('#quizQuestion').textContent())||'')) throw new Error('Quiz question did not translate to Mandarin');
  if(!hasCJK((await page.locator('#quizChoices .choice-button').first().textContent())||'')) throw new Error('Quiz choices did not translate to Mandarin');

  // Particle atlas name and description.
  await page.locator('[data-view="atlas"]').click();
  await page.waitForTimeout(60);
  if(!hasCJK((await page.locator('#particleInfo h2').textContent())||'')) throw new Error('Particle atlas title did not translate to Mandarin');
  if(!hasCJK((await page.locator('#particleInfo p').textContent())||'')) throw new Error('Particle atlas description did not translate to Mandarin');

  // Conservation checker.
  await page.locator('[data-view="conserve"]').click();
  await page.waitForTimeout(60);
  const conserveText=((await page.locator('#view-conserve').textContent())||'');
  if(!hasCJK(conserveText)) throw new Error('Conservation checker did not translate to Mandarin');

  // Formula coach.
  await page.locator('[data-view="formula"]').click();
  await page.waitForTimeout(60);
  const formulaText=((await page.locator('#view-formula').textContent())||'');
  if(!hasCJK(formulaText)) throw new Error('Formula coach did not translate to Mandarin');

  // Restore English and make sure exact source text returns.
  await hubNav.click();
  await page.locator('[data-hub="language"]').click();
  await page.locator('[data-lang="en"]').click();
  await page.waitForTimeout(100);
  if ((await page.locator('html').getAttribute('lang')) !== 'en') throw new Error('English mode did not restore');

  console.log('SMOKE: Rutherford experiment');
  await page.locator('[data-view="rutherfordexp"]').click();
  await page.waitForSelector('#rutherfordExperimentCanvas', { state: 'visible', timeout: 10000 });
  await page.waitForFunction(() => {
    const t = document.querySelector('#ruth3DStatus')?.textContent || '';
    return /3D ready/i.test(t);
  }, null, { timeout: 15000 });

  await page.locator('#ruthFireOne').click();
  await page.waitForTimeout(150);
  await page.locator('[data-ruth-mode="closeup"]').click();
  await page.waitForTimeout(150);
  const angle = (await page.locator('#ruthAngleReadout').textContent())?.trim();
  if (!angle || !angle.includes('θ')) throw new Error('Rutherford close-up did not calculate scattering angle');

  if (pageErrors.length) {
    throw new Error('Browser errors:\n' + [...new Set(pageErrors)].join('\n'));
  }

  console.log('Simulation smoke test passed:', results.map(r => r.id).join(', '));
  console.log('Rutherford 3D apparatus and close-up passed.');
} finally {
  await browser.close();
}
