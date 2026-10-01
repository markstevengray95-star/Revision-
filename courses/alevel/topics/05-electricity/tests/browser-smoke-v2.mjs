import { chromium } from 'playwright';

const base=process.env.APP_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const browserErrors=[];
page.on('pageerror',e=>browserErrors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')browserErrors.push(`console: ${m.text()}`);});

const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const isVisible=async sel=>page.locator(sel).first().isVisible().catch(()=>false);
const wait=ms=>page.waitForTimeout(ms);
const click=async sel=>{await page.locator(sel).first().click();await wait(60);};

try{
  await page.goto(base,{waitUntil:'networkidle',timeout:30000});
  assert((await page.title()).includes('Electricity'),'App title missing');
  assert((await page.locator('body').innerText()).length>1000,'App body is blank/incomplete');
  assert(await page.locator('.nav-button').count()===7,'Expected 7 main navigation tabs');
  assert(await page.locator('.course-button').count()===11,'Expected 11 lessons');

  // Main navigation.
  for(const view of ['course','textbook','lab','formula','practical','mastery','spec']){
    await click(`[data-view="${view}"]`);
    assert(await page.locator(`#view-${view}`).evaluate(el=>el.classList.contains('active-view')),`View failed: ${view}`);
  }

  // Every lesson: all stages, retrieval mark, MCQ, application/exit/extended automark controls.
  await click('[data-view="course"]');
  const lessonIds=await page.locator('.course-button').evaluateAll(btns=>btns.map(b=>b.dataset.lesson));
  for(const id of lessonIds){
    await page.locator(`.course-button[data-lesson="${id}"]`).click();await wait(90);
    assert(await page.locator('.lesson-stage-button').count()===8,`${id}: expected 8 lesson stages`);
    for(const stage of ['retrieval','learn','equations','worked','apply','simulate','exam','exit']){
      await page.locator(`[data-lesson-tab="${stage}"]`).click();await wait(25);
      assert(await isVisible(`.lesson-stage[data-stage="${stage}"]`),`${id}: stage ${stage} failed to open`);
    }

    await page.locator('[data-lesson-tab="retrieval"]').click();await wait(60);
    assert(await page.locator('[data-am-retrieval]').count()>=1,`${id}: retrieval automark missing`);
    const expected=await page.locator('.answer-reveal').first().innerText();
    await page.locator('[data-am-retrieval="0"]').fill(expected);
    await page.locator('[data-am-action="retrieval"][data-index="0"]').click();await wait(20);
    assert(await isVisible('[data-am-retrieval="0"] ~ .am-feedback.show'),`${id}: retrieval feedback missing`);

    await page.locator('[data-lesson-tab="apply"]').click();await wait(30);
    assert(await page.locator('[data-am-action="apply"]').count()===1,`${id}: application automark missing`);
    await page.locator('.lesson-stage[data-stage="apply"] .student-answer').fill('Physics reasoning and calculation attempt.');
    await page.locator('[data-am-action="apply"]').click();await wait(20);
    assert(await isVisible('.lesson-stage[data-stage="apply"] .am-feedback.show'),`${id}: application feedback missing`);

    await page.locator('[data-lesson-tab="exam"]').click();await wait(20);
    const correctIndex=await page.locator('.lesson-check').first().getAttribute('data-correct');
    await page.locator(`.lesson-check[data-answer="${correctIndex}"]`).click();await wait(20);
    assert((await page.locator('#lessonFeedback').innerText()).startsWith('Correct.'),`${id}: MCQ correct answer did not mark correctly`);

    await page.locator('[data-lesson-tab="exit"]').click();await wait(70);
    assert(await page.locator('[data-am-action="exit"]').count()===1,`${id}: exit automark missing`);
    await page.locator('.lesson-stage[data-stage="exit"] > .lesson-block .student-answer').fill('A complete physics explanation attempt.');
    await page.locator('[data-am-action="exit"]').click();await wait(20);
    assert(await isVisible('.lesson-stage[data-stage="exit"] .am-feedback.show'),`${id}: exit feedback missing`);
    assert(await page.locator('#extendedResponsePractice').count()===1,`${id}: extended response missing`);
    assert(await page.locator('[data-am-action="extended"]').count()===1,`${id}: extended automark missing`);
    await page.locator('#erAnswer').fill('Extended response physics reasoning.');
    await page.locator('[data-am-action="extended"]').click();await wait(20);
    assert(await isVisible('#extendedResponsePractice .am-feedback.show'),`${id}: extended response feedback missing`);

    // Enrichment transfer question, when present, must mark too.
    const transfer=page.locator(`[data-v3-transfer="${id}"]`);
    if(await transfer.count()){
      await transfer.fill('Transfer reasoning attempt.');
      const transferButton=page.locator('[data-qv4="lesson"]');
      assert(await transferButton.count()===1,`${id}: transfer automark button missing`);
      await transferButton.click();await wait(20);
      assert(await isVisible('.qv4-feedback.show'),`${id}: transfer feedback missing`);
    }
  }

  // Equation coach from a lesson equation.
  await page.locator('.course-button').first().click();await wait(50);
  await page.locator('[data-lesson-tab="equations"]').click();await wait(30);
  await page.locator('.formula-chip').first().click();await wait(50);
  assert(await isVisible('.eq-coach-backdrop'),'Equation coach did not open from lesson equation');
  assert((await page.locator('.eq-vars').innerText()).length>10,'Equation variable breakdown missing');
  assert((await page.locator('.eq-steps').innerText()).length>10,'Equation method steps missing');
  await click('.eq-close');

  // Textbook: all 8 chapters, deep content, clickable equation, quick-check marking when present.
  await click('[data-view="textbook"]');
  assert(await page.locator('.textbook-chapter-button').count()===8,'Expected 8 textbook chapters');
  const chapterIds=await page.locator('.textbook-chapter-button').evaluateAll(btns=>btns.map(b=>b.dataset.textbookChapter));
  for(const id of chapterIds){
    await page.locator(`.textbook-chapter-button[data-textbook-chapter="${id}"]`).click();await wait(50);
    assert((await page.locator('#textbookArticle h2').innerText()).length>2,`${id}: textbook title missing`);
    assert(await page.locator('#textbookArticle .textbook-section').count()>=3,`${id}: textbook core sections missing`);
    assert((await page.locator('#textbookArticle').innerText()).length>900,`${id}: textbook content unexpectedly short`);
    const quick=page.locator(`[data-qv4-chapter="${id}"]`);
    if(await quick.count()){
      await quick.fill('Quick-check physics answer.');
      await page.locator('[data-qv4="chapter"]').click();await wait(20);
      assert(await isVisible('.qv4-feedback.show'),`${id}: textbook quick-check feedback missing`);
    }
  }
  await page.locator('.textbook-equations code').first().click();await wait(40);
  assert(await isVisible('.eq-coach-backdrop'),'Equation coach did not open from textbook equation');
  await click('.eq-close');

  // Formula coach: every calculator renders inputs and a result.
  await click('[data-view="formula"]');
  assert(await page.locator('#formulaSelect option').count()===14,'Expected 14 formula tools');
  for(let i=0;i<14;i++){
    await page.locator('#formulaSelect').selectOption({index:i});await wait(20);
    assert(await page.locator('[data-formula-input]').count()>=1,`Formula ${i+1}: inputs missing`);
    assert((await page.locator('#formulaWorking').innerText()).includes('Result'),`Formula ${i+1}: result missing`);
  }

  // Simulations: all six models plus enhancement layers.
  await click('[data-view="lab"]');
  assert(await page.locator('.sim-tab').count()===6,'Expected 6 simulation tabs');
  assert(await page.locator('#labPlus').count()===1,'Virtual Lab+ missing');
  assert(await page.locator('#realLabPro').count()===1,'Real Equipment Bench missing');
  const simIds=await page.locator('.sim-tab').evaluateAll(btns=>btns.map(b=>b.dataset.sim));
  for(const id of simIds){
    await page.locator(`.sim-tab[data-sim="${id}"]`).click();await wait(110);
    assert((await page.locator('#simTitle').innerText()).length>2,`${id}: core simulation title missing`);
    assert(await page.locator('[data-sim-control]').count()>=3,`${id}: core controls missing`);
    assert((await page.locator('#simReadout').innerText()).length>2,`${id}: live readout missing`);
    await page.locator('#snapshotSim').click();
    assert(await page.locator('#snapshotTray .snapshot').count()>=1,`${id}: core capture-reading failed`);
    assert((await page.locator('#lpTitle').innerText()).length>2,`${id}: Virtual Lab+ failed to render`);
    assert(await page.locator('[data-lp-control]').count()>=3,`${id}: Virtual Lab+ controls missing`);
    assert((await page.locator('#realLabPro').innerText()).length>200,`${id}: Real Equipment Bench failed to render`);
  }

  // Lesson -> simulation synchronisation across all layers.
  await click('[data-view="course"]');
  await page.locator('.course-button[data-lesson="iv-ohmic"]').click();
  await page.locator('[data-lesson-tab="simulate"]').click();
  const linked=await page.locator('[data-open-sim]').getAttribute('data-open-sim');
  await page.locator('[data-open-sim]').click();await wait(220);
  assert((await page.locator('.sim-tab.active').getAttribute('data-sim'))===linked,'Linked simulation did not select the requested core model');
  const lpTitle=(await page.locator('#lpTitle').innerText()).toLowerCase();
  assert(lpTitle.includes('i–v')||lpTitle.includes('i-v'),'Virtual Lab+ did not synchronise with lesson-linked simulation');
  const realTitle=(await page.locator('#realLabPro h3').first().innerText()).toLowerCase();
  assert(realTitle.includes('i–v')||realTitle.includes('i-v'),'Real Equipment Bench did not synchronise with lesson-linked simulation');

  // Required practicals.
  await click('[data-view="practical"]');
  await page.locator('#takeRp5Reading').click();await page.locator('#takeRp5Reading').click();
  assert(await page.locator('#rp5Rows tr').count()===2,'RP5 readings not added');
  await page.locator('#clearRp5Data').click();assert(await page.locator('#rp5Rows tr').count()===0,'RP5 clear failed');
  await page.locator('[data-practical="rp6"]').click();await wait(30);
  await page.locator('#takeRp6Reading').click();await page.locator('#takeRp6Reading').click();
  assert(await page.locator('#rp6Rows tr').count()===2,'RP6 readings not added');
  await page.locator('#clearRp6Data').click();assert(await page.locator('#rp6Rows tr').count()===0,'RP6 clear failed');

  // Mastery quiz and specification map.
  await click('[data-view="mastery"]');
  assert(await page.locator('.quiz-choice').count()===4,'Mastery choices missing');
  await page.locator('.quiz-choice').first().click();await wait(20);
  assert(await isVisible('#quizFeedback'),'Mastery feedback missing');
  assert(await isVisible('#nextQuestion'),'Mastery next button missing');
  await page.locator('#nextQuestion').click();
  assert((await page.locator('#quizProgress').innerText()).includes('2 /'),'Mastery quiz did not advance');
  await page.locator('#restartQuiz').click();
  assert((await page.locator('#quizProgress').innerText()).startsWith('1 /'),'Mastery restart failed');

  await click('[data-view="spec"]');
  assert(await page.locator('#specGrid .spec-card').count()>=6,'Specification map missing');

  if(browserErrors.length)throw new Error(`Browser errors detected:\n${browserErrors.join('\n')}`);
  console.log('BROWSER_SMOKE_PASS');
} finally {
  await browser.close();
}
