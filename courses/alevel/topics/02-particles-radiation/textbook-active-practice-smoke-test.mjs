import { chromium } from 'playwright';

const BASE=process.env.TEST_URL||'http://127.0.0.1:4178/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(9000);
const cjk=t=>/[\u3400-\u9fff]/.test(t||'');
const answers=['20','9.58e7','1','234','3.98e-19','0.478','0','2','uud','0','1.7e-19','4.806e-19','6.63e-7','3.315e-10','1','0'];
const types=['number','number','choice','number','number','number','choice','choice','text','number','number','number','number','number','choice','choice'];

try{
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>!!window.PARTICLELAB_LESSON_SEQUENCE && !!window.PARTICLELAB_TEXTBOOK_ACTIVE_PRACTICE,{timeout:12000});
  await page.locator('[data-view="course"]').click();
  const lessonCount=await page.locator('[data-seq-lesson]').count();
  if(lessonCount!==16)throw new Error('Expected 16 lessons, found '+lessonCount);

  for(let li=0;li<lessonCount;li++){
    const n=li+1;
    await page.locator('[data-seq-lesson]').nth(li).evaluate(el=>el.click());
    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await page.waitForSelector('.lesson-active-section .textbook-active-practice');
    const panel=page.locator('.lesson-active-section .textbook-active-practice');
    if(await panel.locator('.tbp-question').count()!==2)throw new Error('Lesson '+n+' should have exactly two active-practice questions');
    if(await panel.locator('[data-tbp-hint]').count()!==2)throw new Error('Lesson '+n+' hints missing');
    if(await panel.locator('.tbp-solution').count()!==2)throw new Error('Lesson '+n+' worked reasoning missing');

    if(types[li]==='choice'){
      await panel.locator('[data-tbp-choice="0"][data-value="'+answers[li]+'"]').evaluate(el=>el.click());
    }else{
      await panel.locator('[data-tbp-input="0"]').fill(answers[li]);
    }
    await panel.locator('[data-tbp-check="0"]').evaluate(el=>el.click());
    await page.waitForTimeout(15);
    if(!(await panel.locator('[data-tbp-question="0"]').evaluate(el=>el.classList.contains('is-correct'))))throw new Error('Lesson '+n+' first practice question did not mark correct');
    const feedback=(await panel.locator('[data-tbp-feedback="0"]').textContent())||'';
    if(!/Correct/i.test(feedback))throw new Error('Lesson '+n+' correct feedback missing');
    const saved=await page.evaluate(n=>JSON.parse(localStorage.getItem('particleTextbookActivePracticeV1')||'{}')?.[n]?.correct?.[0],n);
    if(saved!==true)throw new Error('Lesson '+n+' active-practice result did not persist');

    await panel.locator('[data-tbp-hint="1"]').evaluate(el=>el.click());
    if(await panel.locator('[data-tbp-hint-box="1"]').evaluate(el=>el.classList.contains('hidden')))throw new Error('Lesson '+n+' hint did not open');
  }

  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE?.set?.('zh'));
  await page.waitForTimeout(100);
  for(let li=0;li<lessonCount;li++){
    const n=li+1;
    await page.locator('[data-seq-lesson]').nth(li).evaluate(el=>el.click());
    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await page.waitForSelector('.lesson-active-section .textbook-active-practice');
    const prompt=(await page.locator('.lesson-active-section .textbook-active-practice .tbp-prompt').first().textContent())||'';
    const heading=(await page.locator('.lesson-active-section .textbook-active-practice h4').first().textContent())||'';
    if(!cjk(prompt)||!cjk(heading))throw new Error('Lesson '+n+' active practice is not Mandarin');
  }

  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE?.set?.('en'));
  console.log('ACTIVE TEXTBOOK PRACTICE TEST PASSED: 32 questions present, first question auto-marked and persisted in all 16 lessons, Mandarin verified.');
}finally{
  await browser.close();
}
