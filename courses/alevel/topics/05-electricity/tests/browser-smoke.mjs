import { chromium } from 'playwright';

const base = process.env.APP_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
page.on('console',m=>{ if(m.type()==='error') errors.push(`console: ${m.text()}`); });

function ok(condition,message){ if(!condition) throw new Error(message); }
async function visible(sel){ return await page.locator(sel).first().isVisible().catch(()=>false); }
async function click(sel){ await page.locator(sel).first().click(); await page.waitForTimeout(60); }

try{
  await page.goto(base,{waitUntil:'networkidle',timeout:30000});
  ok((await page.title()).includes('Electricity'),'Page title did not load');
  ok((await page.locator('body').innerText()).length>1000,'Page appears blank or incomplete');
  ok(await page.locator('.nav-button').count()===7,'Expected 7 main navigation buttons');
  ok(await page.locator('.course-button').count()===11,'Expected 11 lessons');

  // Main navigation renders every view.
  for(const view of ['course','textbook','lab','formula','practical','mastery','spec']){
    await click(`[data-view="${view}"]`);
    ok(await page.locator(`#view-${view}`).evaluate(el=>el.classList.contains('active-view')),`View ${view} did not activate`);
  }

  // Every lesson renders all eight stages and core question controls.
  await click('[data-view="course"]');
  const lessonButtons=page.locator('.course-button');
  for(let i=0;i<11;i++){
    await lessonButtons.nth(i).click();
    await page.waitForTimeout(80);
    ok(await page.locator('.lesson-stage-button').count()===8,`Lesson ${i+1}: expected 8 stages`);
    for(const stage of ['retrieval','learn','equations','worked','apply','simulate','exam','exit']){
      await page.locator(`[data-lesson-tab="${stage}"]`).click();
      await page.waitForTimeout(30);
      ok(await visible(`.lesson-stage[data-stage="${stage}"]`),`Lesson ${i+1}: stage ${stage} did not open`);
    }
    // Retrieval, apply and exit automark controls should be injected for every lesson.
    await page.locator('[data-lesson-tab="retrieval"]').click();
    await page.waitForTimeout(50);
    ok(await page.locator('[data-am-retrieval]').count()>=1,`Lesson ${i+1}: retrieval automark missing`);
    await page.locator('[data-lesson-tab="apply"]').click();
    await page.waitForTimeout(30);
    ok(await page.locator('[data-am-action="apply"]').count()===1,`Lesson ${i+1}: application automark missing`);
    await page.locator('[data-lesson-tab="exit"]').click();
    await page.waitForTimeout(60);
    ok(await page.locator('[data-am-action="exit"]').count()===1,`Lesson ${i+1}: exit automark missing`);
    ok(await page.locator('#extendedResponsePractice').count()===1,`Lesson ${i+1}: extended response missing`);
    ok(await page.locator('[data-am-action="extended"]').count()===1,`Lesson ${i+1}: extended response automark missing`);
  }

  // Functional automark checks on a representative lesson.
  await page.locator('.course-button').first().click(); await page.waitForTimeout(60);
  await page.locator('[data-lesson-tab="retrieval"]').click();
  const r0=page.locator('[data-am-retrieval="0"]'); await r0.fill('coulomb C');
  await page.locator('[data-am-action="retrieval"][data-index="0"]').click();
  ok(await visible('[data-am-retrieval="0"] ~ .am-feedback.show'),'Retrieval feedback did not display');

  await page.locator('[data-lesson-tab="apply"]').click();
  await page.locator('.lesson-stage[data-stage="apply"] .student-answer').fill('2 C; 252 C; conventional current is to the right.');
  await page.locator('[data-am-action="apply"]').click();
  ok(await visible('.lesson-stage[data-stage="apply"] .am-feedback.show'),'Application feedback did not display');

  await page.locator('[data-lesson-tab="exam"]').click();
  const correct=page.locator('.lesson-check').filter({has:page.locator('')});
  const answerIndex=await page.locator('.lesson-check').first().getAttribute('data-correct');
  await page.locator(`.lesson-check[data-answer="${answerIndex}"]`).click();
  ok(!(await page.locator('#lessonFeedback').evaluate(el=>el.classList.contains('hidden'))),'Exam-check feedback stayed hidden');

  await page.locator('[data-lesson-tab="exit"]').click();
  await page.locator('.lesson-stage[data-stage="exit"] > .lesson-block .student-answer').fill('Electric current is the rate of flow of charge per unit time.');
  await page.locator('[data-am-action="exit"]').click();
  ok(await visible('.lesson-stage[data-stage="exit"] .am-feedback.show'),'Exit feedback did not display');
  await page.locator('#erAnswer').fill('Current is the rate of flow of charge. Electrons are mobile charge carriers and drift opposite to conventional current. Conventional current follows positive charge. Q = It, so doubling current at fixed time doubles charge.');
  await page.locator('[data-am-action="extended"]').click();
  ok(await visible('#extendedResponsePractice .am-feedback.show'),'Extended response feedback did not display');

  // Equation coach opens from every lesson/textbook equation surface.
  await page.locator('[data-lesson-tab="equations"]').click(); await page.waitForTimeout(30);
  await page.locator('.formula-chip').first().click(); await page.waitForTimeout(50);
  ok(await visible('.eq-coach-backdrop'),'Equation coach did not open from lesson equation');
  ok((await page.locator('.eq-vars').innerText()).length>10,'Equation variable table missing');
  await click('.eq-close');

  await click('[data-view="textbook"]');
  ok(await page.locator('.textbook-chapter-button').count()===8,'Expected 8 textbook chapters');
  for(let i=0;i<8;i++){
    await page.locator('.textbook-chapter-button').nth(i).click(); await page.waitForTimeout(40);
    ok((await page.locator('#textbookArticle h2').innerText()).length>2,`Textbook chapter ${i+1} did not render`);
    ok(await page.locator('#textbookArticle .textbook-section').count()>=3,`Textbook chapter ${i+1} has too little content`);
  }
  await page.locator('.textbook-equations code').first().click(); await page.waitForTimeout(40);
  ok(await visible('.eq-coach-backdrop'),'Equation coach did not open from textbook equation');
  await click('.eq-close');

  // Formula coach: all 14 calculators render and calculate.
  await click('[data-view="formula"]');
  ok(await page.locator('#formulaSelect option').count()===14,'Expected 14 formula tools');
  for(let i=0;i<14;i++){
    await page.locator('#formulaSelect').selectOption({index:i}); await page.waitForTimeout(20);
    ok(await page.locator('[data-formula-input]').count()>=1,`Formula tool ${i+1} has no inputs`);
    ok((await page.locator('#formulaWorking').innerText()).includes('Result'),'Formula result did not render');
  }

  // Simulations: all six core models, enhancement layers and controls.
  await click('[data-view="lab"]');
  ok(await page.locator('.sim-tab').count()===6,'Expected 6 simulation tabs');
  ok(await page.locator('#labPlus').count()===1,'Virtual Lab+ missing');
  ok(await page.locator('#realLabPro').count()===1,'Real Equipment Bench missing');
  for(let i=0;i<6;i++){
    await page.locator('.sim-tab').nth(i).click(); await page.waitForTimeout(90);
    ok((await page.locator('#simTitle').innerText()).length>2,`Simulation ${i+1} title missing`);
    ok(await page.locator('[data-sim-control]').count()>=3,`Simulation ${i+1} controls missing`);
    await page.locator('#snapshotSim').click();
    ok(await page.locator('#snapshotTray .snapshot').count()>=1,`Simulation ${i+1} capture reading failed`);
    ok((await page.locator('#lpTitle').innerText()).length>2,`Simulation ${i+1} Virtual Lab+ did not update`);
  }

  // Linked lesson simulation must synchronize all simulation layers.
  await click('[data-view="course"]');
  await page.locator('.course-button[data-lesson="iv-ohmic"]').click();
  await page.locator('[data-lesson-tab="simulate"]').click();
  const expectedSim=await page.locator('[data-open-sim]').getAttribute('data-open-sim');
  await page.locator('[data-open-sim]').click(); await page.waitForTimeout(180);
  ok((await page.locator('.sim-tab.active').getAttribute('data-sim'))===expectedSim,'Linked lesson simulation did not select correct core simulation');
  ok((await page.locator('#lpTitle').innerText()).toLowerCase().includes('i–v') || (await page.locator('#lpTitle').innerText()).toLowerCase().includes('i-v'),'Virtual Lab+ did not synchronize with linked lesson simulation');

  // Practicals collect and clear data.
  await click('[data-view="practical"]');
  await page.locator('#takeRp5Reading').click(); await page.locator('#takeRp5Reading').click();
  ok(await page.locator('#rp5Rows tr').count()===2,'RP5 readings were not added');
  await page.locator('#clearRp5Data').click(); ok(await page.locator('#rp5Rows tr').count()===0,'RP5 clear failed');
  await page.locator('[data-practical="rp6"]').click();
  await page.locator('#takeRp6Reading').click(); await page.locator('#takeRp6Reading').click();
  ok(await page.locator('#rp6Rows tr').count()===2,'RP6 readings were not added');
  await page.locator('#clearRp6Data').click(); ok(await page.locator('#rp6Rows tr').count()===0,'RP6 clear failed');

  // Mastery quiz and specification map.
  await click('[data-view="mastery"]');
  ok(await page.locator('.quiz-choice').count()===4,'Mastery question choices missing');
  await page.locator('.quiz-choice').first().click();
  ok(await visible('#quizFeedback'),'Mastery feedback did not appear');
  ok(await visible('#nextQuestion'),'Mastery next-question button did not appear');
  await page.locator('#nextQuestion').click();
  ok((await page.locator('#quizProgress').innerText()).includes('2 /'),'Mastery quiz did not advance');

  await click('[data-view="spec"]');
  ok(await page.locator('#specGrid .spec-card').count()>=6,'AQA specification map did not render');

  if(errors.length) throw new Error(`Browser errors detected:\n${errors.join('\n')}`);
  console.log('BROWSER_SMOKE_PASS');
} finally {
  await browser.close();
}
