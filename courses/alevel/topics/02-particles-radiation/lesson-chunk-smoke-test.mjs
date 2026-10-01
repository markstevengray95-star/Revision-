import { chromium } from 'playwright';

const BASE=process.env.TEST_URL||'http://127.0.0.1:4172/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(6000);

try{
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.locator('[data-view="course"]').click();
  await page.waitForSelector('#courseList.lesson-sequence-sidebar');

  const lessonCount=await page.locator('[data-seq-lesson]').count();
  if(lessonCount!==16) throw new Error('Expected 16 lessons, found '+lessonCount);

  for(let li=0;li<lessonCount;li++){
    await page.locator('[data-seq-lesson]').nth(li).evaluate(el=>el.click());
    await page.waitForTimeout(15);
    const lessonNo=li+1;
    await page.locator('#lessonPanel [data-seq-stage="0"]').evaluate(el=>el.click());
    await page.waitForTimeout(10);
    const starterInputs=page.locator('.lesson-active-section [data-starter-input]');
    if(await starterInputs.count()!==3) throw new Error('Lesson '+lessonNo+' starter answer boxes missing');
    await starterInputs.first().fill('Saved starter test response');
    await page.waitForTimeout(5);
    const storedStarter=await page.evaluate(lessonNo=>{
      try{return JSON.parse(localStorage.getItem('particleLessonStarterAnswersV1')||'{}')?.[lessonNo]?.[0]||''}catch{return ''}
    },lessonNo);
    if(storedStarter!=='Saved starter test response') throw new Error('Lesson '+lessonNo+' starter answer did not save');

    await page.locator('#lessonPanel [data-seq-stage="3"]').evaluate(el=>el.click());
    await page.waitForTimeout(8);
    const investigation=page.locator('.lesson-active-section .investigation-notebook');
    if(!(await investigation.count())) throw new Error('Lesson '+lessonNo+' investigation notebook missing');
    if(await investigation.locator('[data-investigation]').count()!==3) throw new Error('Lesson '+lessonNo+' investigation fields missing');
    if(lessonNo===1){
      await investigation.locator('[data-investigation="prediction"]').fill('Prediction persistence test');
      await page.waitForTimeout(5);
      const storedInvestigation=await page.evaluate(()=>{
        try{return JSON.parse(localStorage.getItem('particleLessonInvestigationV1')||'{}')?.[1]?.prediction||''}catch{return ''}
      });
      if(storedInvestigation!=='Prediction persistence test') throw new Error('Lesson 1 investigation note did not persist');
    }

    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await page.waitForTimeout(15);
    const textbook=page.locator('.lesson-active-section .lesson-textbook');
    if(!(await textbook.count())) throw new Error('Lesson '+lessonNo+' guided mini textbook missing');
    const textbookSections=textbook.locator('.textbook-section');
    if(await textbookSections.count()<4) throw new Error('Lesson '+lessonNo+' mini textbook is too short');
    const confidenceButtons=textbook.locator('[data-textbook-secure]');
    if(await confidenceButtons.count()!==await textbookSections.count()) throw new Error('Lesson '+lessonNo+' mastery buttons missing');

    const textbookInput=textbook.locator('[data-textbook-input]').first();
    await textbookInput.fill('Saved textbook checkpoint response');
    await page.waitForTimeout(5);
    const storedTextbook=await page.evaluate(lessonNo=>{
      try{return JSON.parse(localStorage.getItem('particleLessonTextbookAnswersV1')||'{}')?.[lessonNo]?.[0]||''}catch{return ''}
    },lessonNo);
    if(storedTextbook!=='Saved textbook checkpoint response') throw new Error('Lesson '+lessonNo+' textbook checkpoint did not save');
    if(lessonNo===1){
      await textbook.locator('[data-textbook-secure="0"]').evaluate(el=>el.click());
      await page.waitForTimeout(20);
      const savedMastery=await page.evaluate(()=>{
        try{return JSON.parse(localStorage.getItem('particleLessonTextbookMasteryV1')||'{}')?.[1]?.[0]||''}catch{return ''}
      });
      if(savedMastery!=='secure') throw new Error('Lesson 1 textbook mastery did not persist');
      const nextOpen=page.locator('.lesson-active-section .textbook-section[data-textbook-section="1"]');
      if(!(await nextOpen.evaluate(el=>el.open))) throw new Error('Lesson 1 secure action did not open the next textbook section');
    }

    const coverage=page.locator('.lesson-active-section .aqa-core-knowledge');
    if(!(await coverage.count())) throw new Error('Lesson '+lessonNo+' AQA core knowledge panel missing');
    if((await coverage.locator('li').count())<4) throw new Error('Lesson '+lessonNo+' AQA core knowledge is too thin');

    const lesson=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.lessons?.find(x=>x.n===Number((document.querySelector('#lessonPanel .lesson-count')?.textContent||'').match(/Lesson\s+(\d+)/i)?.[1]||1)));
    if(!lesson) throw new Error('Lesson '+lessonNo+' data missing');

    const chunks=page.locator('.lesson-active-section .native-chunk-list > .lesson-chunk-rich');
    const count=await chunks.count();
    if(count!==lesson.teach.length) throw new Error('Lesson '+lessonNo+' chunk count mismatch '+count+' vs '+lesson.teach.length);

    for(let ci=0;ci<count;ci++){
      const detail=page.locator('.lesson-active-section .lesson-chunk-rich[data-lesson-chunk="'+ci+'"]');
      const summary=detail.locator(':scope > summary');
      if(!(await summary.count())) throw new Error('Lesson '+lessonNo+' chunk '+(ci+1)+' heading missing');
      if(!(await detail.evaluate(el=>el.open))){
        await summary.evaluate(el=>el.click());
        await page.waitForTimeout(5);
      }
      if(!(await detail.evaluate(el=>el.open))) throw new Error('Lesson '+lessonNo+' chunk '+(ci+1)+' would not open');
    }

    await page.locator('#lessonPanel [data-seq-stage="5"]').evaluate(el=>el.click());
    await page.waitForTimeout(8);
    const shortInputs=page.locator('.lesson-active-section [data-short-test-input]');
    if(await shortInputs.count()<3) throw new Error('Lesson '+lessonNo+' short test inputs missing');
    if(lessonNo===1){
      await shortInputs.first().fill('Persistent short-test response');
      await page.waitForTimeout(5);
      const savedShort=await page.evaluate(()=>{
        try{return JSON.parse(localStorage.getItem('particleLessonShortTestAnswersV1')||'{}')?.[1]?.[0]||''}catch{return ''}
      });
      if(savedShort!=='Persistent short-test response') throw new Error('Lesson 1 short-test response did not persist');
    }
    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await page.waitForTimeout(8);

    if(count>1){
      await page.locator('[data-core-chunk="0"]').evaluate(el=>el.click());
      await page.waitForTimeout(8);
      if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==0) throw new Error('Lesson '+lessonNo+' could not select chunk 1');
      await page.locator('#coreChunkNext').evaluate(el=>el.click());
      await page.waitForTimeout(8);
      if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==1) throw new Error('Lesson '+lessonNo+' Next chunk failed');
      const second=page.locator('.lesson-active-section .lesson-chunk-rich[data-lesson-chunk="1"]');
      if(!(await second.evaluate(el=>el.open))) throw new Error('Lesson '+lessonNo+' Next chunk did not open chunk 2');
      await page.locator('#coreChunkPrev').evaluate(el=>el.click());
      await page.waitForTimeout(8);
      if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==0) throw new Error('Lesson '+lessonNo+' Previous chunk failed');
    }
  }

  // Full Mandarin lesson regression: switch language through the real controller.
  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE?.set?.('zh'));
  await page.waitForTimeout(80);
  if((await page.locator('html').getAttribute('lang'))!=='zh-CN') throw new Error('Mandarin mode did not set zh-CN');

  for(let li=0;li<lessonCount;li++){
    await page.locator('[data-seq-lesson]').nth(li).evaluate(el=>el.click());
    await page.waitForTimeout(8);
    const lessonNo=li+1;

    const title=(await page.locator('#lessonPanel .lesson-hero h2').textContent())||'';
    if(!/[\u3400-\u9fff]/.test(title)) throw new Error('Lesson '+lessonNo+' title did not render in Mandarin');

    await page.locator('#lessonPanel [data-seq-stage="0"]').evaluate(el=>el.click());
    await page.waitForTimeout(5);
    const starterQ=(await page.locator('.lesson-active-section .starter-question-head strong').first().textContent())||'';
    const starterPlaceholder=await page.locator('.lesson-active-section [data-starter-input]').first().getAttribute('placeholder');
    if(!/[\u3400-\u9fff]/.test(starterQ)) throw new Error('Lesson '+lessonNo+' starter question is not Mandarin');
    if(!/[\u3400-\u9fff]/.test(starterPlaceholder||'')) throw new Error('Lesson '+lessonNo+' starter placeholder is not Mandarin');

    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await page.waitForTimeout(5);
    const tb=(await page.locator('.lesson-active-section .textbook-section-body > p').first().textContent())||'';
    const spec=(await page.locator('.lesson-active-section .aqa-core-knowledge li').first().textContent())||'';
    const tbPlaceholder=await page.locator('.lesson-active-section [data-textbook-input]').first().getAttribute('placeholder');
    if(!/[\u3400-\u9fff]/.test(tb)) throw new Error('Lesson '+lessonNo+' textbook paragraph is not Mandarin');
    if(!/[\u3400-\u9fff]/.test(spec)) throw new Error('Lesson '+lessonNo+' AQA knowledge point is not Mandarin');
    if(!/[\u3400-\u9fff]/.test(tbPlaceholder||'')) throw new Error('Lesson '+lessonNo+' textbook placeholder is not Mandarin');

    const englishLeak=[title,starterQ,tb,spec].join(' ')
      .replace(/AQA|MeV|eV|SI|Na|Cl|Hz|fm|kg|W|UV|Q|KE|Z|A|N|B|S|E|h|f|c|p|m|V|J|C/g,'');
    if(/\b(?:the|and|with|from|energy|particle|electron|proton|neutron|lesson|question|answer)\b/i.test(englishLeak)){
      throw new Error('Lesson '+lessonNo+' contains obvious English leakage in Mandarin core content');
    }
  }

  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE?.set?.('en'));
  await page.waitForTimeout(50);
  if((await page.locator('html').getAttribute('lang'))!=='en') throw new Error('English mode did not restore after Mandarin test');

  console.log('MANDARIN LESSON TEST PASSED: all 16 lessons render Mandarin title, starter, textbook, AQA content and placeholders.');

  console.log('LESSON CHUNK TEST PASSED: all 16 lessons, all native chunk headings, Next and Previous.');
}finally{
  await browser.close();
}
