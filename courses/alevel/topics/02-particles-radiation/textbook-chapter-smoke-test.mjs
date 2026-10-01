import { chromium } from 'playwright';

const BASE=process.env.TEST_URL||'http://127.0.0.1:4177/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(9000);
const cjk=t=>/[\u3400-\u9fff]/.test(t||'');

try{
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>!!window.PARTICLELAB_LESSON_SEQUENCE,{timeout:10000});
  await page.locator('[data-view="course"]').click();
  const lessonCount=await page.locator('[data-seq-lesson]').count();
  if(lessonCount!==16)throw new Error('Expected 16 lessons, found '+lessonCount);

  for(let li=0;li<lessonCount;li++){
    await page.locator('[data-seq-lesson]').nth(li).evaluate(el=>el.click());
    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await page.waitForSelector('.lesson-active-section .textbook-full-chapter');
    const n=li+1;
    const chapter=page.locator('.lesson-active-section .textbook-full-chapter');
    if(await chapter.count()!==1)throw new Error('Lesson '+n+' full textbook chapter missing or duplicated');
    if(await chapter.locator('.textbook-chapter-hero').count()!==1)throw new Error('Lesson '+n+' textbook hero missing');
    if(await chapter.locator('.textbook-figure svg').count()<1)throw new Error('Lesson '+n+' original diagram missing');
    if(await chapter.locator('.textbook-study-card').count()<4)throw new Error('Lesson '+n+' study support cards missing');
    if(await chapter.locator('.textbook-study-card.worked-example').count()!==1)throw new Error('Lesson '+n+' worked example missing');
    if(await chapter.locator('.textbook-study-card.misconception').count()!==1)throw new Error('Lesson '+n+' misconception panel missing');
    if(await chapter.locator('.textbook-study-card.exam-focus').count()!==1)throw new Error('Lesson '+n+' exam-focus panel missing');
    if(await chapter.locator('.textbook-chapter-summary li').count()<3)throw new Error('Lesson '+n+' specification summary too short');
    if(await page.locator('.lesson-active-section .textbook-section').count()<4)throw new Error('Lesson '+n+' original detailed chapter body was lost');
    const title=((await chapter.locator('.textbook-chapter-hero h3').textContent())||'').trim();
    if(title.length<4)throw new Error('Lesson '+n+' chapter title missing');
    const caption=((await chapter.locator('.textbook-figure figcaption').first().textContent())||'').trim();
    if(caption.length<20)throw new Error('Lesson '+n+' diagram caption missing');
    if([1,13,14,16].includes(n)){
      if(await chapter.locator('.textbook-photo-figure img').count()!==1)throw new Error('Lesson '+n+' sourced visual missing');
      const href=await chapter.locator('.textbook-photo-figure .textbook-credit a').getAttribute('href');
      if(!href?.includes('commons.wikimedia.org/wiki/File:'))throw new Error('Lesson '+n+' image attribution/source link missing');
    }
  }

  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE?.set?.('zh'));
  await page.waitForTimeout(100);
  if((await page.locator('html').getAttribute('lang'))!=='zh-CN')throw new Error('Mandarin mode did not activate');

  for(let li=0;li<lessonCount;li++){
    await page.locator('[data-seq-lesson]').nth(li).evaluate(el=>el.click());
    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await page.waitForSelector('.lesson-active-section .textbook-full-chapter');
    const n=li+1,chapter=page.locator('.lesson-active-section .textbook-full-chapter');
    const title=(await chapter.locator('.textbook-chapter-hero h3').textContent())||'';
    const mis=(await chapter.locator('.textbook-study-card.misconception p').textContent())||'';
    const summary=(await chapter.locator('.textbook-chapter-summary li').first().textContent())||'';
    const caption=(await chapter.locator('.textbook-figure figcaption').first().textContent())||'';
    if(!cjk(title))throw new Error('Lesson '+n+' full textbook title is not Mandarin');
    if(!cjk(mis))throw new Error('Lesson '+n+' misconception panel is not Mandarin');
    if(!cjk(summary))throw new Error('Lesson '+n+' specification summary is not Mandarin');
    if(!cjk(caption))throw new Error('Lesson '+n+' diagram caption is not Mandarin');
  }

  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE?.set?.('en'));
  await page.waitForTimeout(80);
  if((await page.locator('html').getAttribute('lang'))!=='en')throw new Error('English mode did not restore');

  console.log('TEXTBOOK CHAPTER TEST PASSED: all 16 lessons have full visual textbook chapters and Mandarin coverage.');
}finally{
  await browser.close();
}
