import { chromium } from 'playwright';

const BASE = process.env.TEST_URL || 'http://127.0.0.1:4173/';
const browser = await chromium.launch({
  headless: true,
  args: ['--use-gl=swiftshader','--enable-webgl','--ignore-gpu-blocklist']
});
const page = await browser.newPage({ viewport: { width: 1440, height: 960 } });
page.setDefaultTimeout(8000);
const errors=[];
page.on('pageerror',e=>errors.push(String(e)));
page.on('console',m=>{ if(m.type()==='error') errors.push('console: '+m.text()); });

const pause=(ms=35)=>page.waitForTimeout(ms);
const activeView=async id=>page.locator('#view-'+id).evaluate(el=>el.classList.contains('active-view'));

try {
  console.log('STEPS: boot');
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.locator('[data-view="course"]').click();
  await page.waitForSelector('#courseList.lesson-sequence-sidebar');

  const lessonData=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.lessons||[]);
  const stageData=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.stages||[]);
  const taskBankData=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.taskBank||{});
  if(lessonData.length!==16) throw new Error('Expected 16 lessons, found '+lessonData.length);
  if(stageData.length!==7) throw new Error('Expected 7 guided stages, found '+stageData.length);

  console.log('STEPS: every lesson stage and activity hand-off');
  for(let li=0; li<lessonData.length; li++){
    await page.locator('[data-seq-lesson]').nth(li).click();
    await pause();
    const lesson=lessonData[li];
    const title=((await page.locator('#lessonPanel h2').textContent())||'').trim();
    if(title!==lesson.title) throw new Error('Lesson '+lesson.n+' title mismatch: '+title);

    const stageButtons=page.locator('#lessonPanel [data-seq-stage]');
    if(await stageButtons.count()!==7) throw new Error('Lesson '+lesson.n+' does not expose all 7 guided stages');

    for(let si=0; si<stageData.length; si++){
      await page.locator('#lessonPanel [data-seq-stage="'+si+'"]').click();
      await pause(25);
      const active=page.locator('#lessonPanel [data-seq-stage="'+si+'"]');
      if(!(await active.evaluate(el=>el.classList.contains('active')))) throw new Error('Lesson '+lesson.n+' stage '+si+' did not become active');

      const stage=stageData[si];
      const heading=((await page.locator('.lesson-active-section > h3').textContent())||'').trim();
      if(heading!==stage.label) throw new Error('Lesson '+lesson.n+' stage '+stage.id+' heading mismatch: '+heading);

      if(stage.id==='recall'){
        const cards=page.locator('.lesson-active-section .starter-question-card');
        const inputs=page.locator('.lesson-active-section [data-starter-input]');
        if(await cards.count()!==lesson.recall.length) throw new Error('Lesson '+lesson.n+' starter question count mismatch');
        if(await inputs.count()!==lesson.recall.length) throw new Error('Lesson '+lesson.n+' starter answer boxes missing');
        await inputs.first().fill('Lesson '+lesson.n+' starter response');
        await pause(5);
        const saved=await page.evaluate(n=>JSON.parse(localStorage.getItem('particleLessonStarterAnswersV1')||'{}')?.[n]?.[0]||'',lesson.n);
        if(saved!=='Lesson '+lesson.n+' starter response') throw new Error('Lesson '+lesson.n+' starter response did not persist');
      }
      if(stage.id==='objectives'){
        const count=await page.locator('.lesson-active-section li').count();
        if(count!==lesson.objectives.length) throw new Error('Lesson '+lesson.n+' objectives stage is incomplete');
      }
      if(stage.id==='teach'){
        const count=await page.locator('.lesson-active-section .lesson-check').count();
        if(count!==lesson.teach.length){
          const debug=await page.locator('.lesson-active-section').evaluate(el=>({
            html:el.innerHTML,
            chunks:[...el.querySelectorAll('[data-lesson-chunk]')].map(x=>({i:x.dataset.lessonChunk,text:(x.textContent||'').slice(0,260)})),
            checks:[...el.querySelectorAll('.lesson-check')].map(x=>(x.textContent||'').slice(0,180))
          }));
          console.error('TEACH_CHUNK_DEBUG',JSON.stringify(debug,null,2));
          throw new Error('Lesson '+lesson.n+' teaching chunks mismatch: '+count+' vs '+lesson.teach.length);
        }
        const detailCount=await page.locator('.lesson-active-section .lesson-chunk-detail').count();
        const taskCount=await page.locator('.lesson-active-section .lesson-chunk-task').count();
        const examCount=await page.locator('.lesson-active-section .lesson-chunk-exam').count();
        if(detailCount!==lesson.teach.length||taskCount!==lesson.teach.length||examCount!==lesson.teach.length) throw new Error('Lesson '+lesson.n+' rich chunk support is incomplete');

        const chunkTabs=page.locator('.lesson-active-section [data-core-chunk]');
        if(await chunkTabs.count()!==lesson.teach.length) throw new Error('Lesson '+lesson.n+' core chunk selector mismatch');
        const activityBoxes=page.locator('.lesson-active-section [data-chunk-activity-input]');
        if(await activityBoxes.count()!==lesson.teach.length) throw new Error('Lesson '+lesson.n+' teaching activities are not all answerable in-app');
        for(let ci=0; ci<lesson.teach.length; ci++){
          await page.locator('.lesson-active-section [data-core-chunk="'+ci+'"]').click();
          await pause(25);
          const activeChunk=await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.());
          if(activeChunk!==ci) throw new Error('Lesson '+lesson.n+' chunk '+ci+' did not become active');
          const openChunk=page.locator('.lesson-active-section .lesson-chunk-rich[open]');
          if(await openChunk.count()!==1) throw new Error('Lesson '+lesson.n+' should have exactly one teaching chunk open after tab navigation');
          if(Number(await openChunk.getAttribute('data-lesson-chunk'))!==ci) throw new Error('Lesson '+lesson.n+' open teaching chunk mismatch');
          const answer=page.locator('.lesson-active-section [data-chunk-activity-input="'+ci+'"]');
          const value='Lesson '+lesson.n+' chunk '+ci+' activity response';
          await answer.fill(value);
          await pause(4);
          const saved=await page.evaluate(({n,ci})=>JSON.parse(localStorage.getItem('particleLessonChunkActivityAnswersV1')||'{}')?.[n]?.[ci]||'',{n:lesson.n,ci});
          if(saved!==value) throw new Error('Lesson '+lesson.n+' chunk '+ci+' activity response did not persist');
        }
        if(lesson.teach.length>1){
          await page.locator('.lesson-active-section [data-core-chunk="0"]').click();
          await pause(20);
          await page.locator('#coreChunkNext').click();
          await pause(25);
          if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==1) throw new Error('Lesson '+lesson.n+' Next chunk button failed');
          await page.locator('#coreChunkPrev').click();
          await pause(25);
          if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==0) throw new Error('Lesson '+lesson.n+' Previous chunk button failed');
        }
      }
      if(stage.id==='simulate'){
        const notebook=page.locator('.lesson-active-section [data-investigation]');
        if(await notebook.count()!==3) throw new Error('Lesson '+lesson.n+' investigation notebook must contain prediction, observation and explanation');
        for(const key of ['prediction','observation','explanation']){
          const value='Lesson '+lesson.n+' '+key+' note';
          await page.locator('.lesson-active-section [data-investigation="'+key+'"]').fill(value);
          await pause(4);
          const saved=await page.evaluate(({n,key})=>JSON.parse(localStorage.getItem('particleLessonInvestigationV1')||'{}')?.[n]?.[key]||'',{n:lesson.n,key});
          if(saved!==value) throw new Error('Lesson '+lesson.n+' '+key+' investigation note did not persist');
        }
        const activity=page.locator('#sequenceActivity');
        if(!(await activity.count())) throw new Error('Lesson '+lesson.n+' simulation/activity action missing');
        await activity.click();
        await pause(100);
        if(lesson.sim){
          if(!(await activeView('lab'))) throw new Error('Lesson '+lesson.n+' did not open lab');
          const sim=await page.evaluate(()=>window.PARTICLELAB_CORE?.getCurrentSim?.());
          if(sim!==lesson.sim) throw new Error('Lesson '+lesson.n+' opened '+sim+' instead of '+lesson.sim);
        }else{
          const view=lesson.view||'quiz';
          if(!(await activeView(view))) throw new Error('Lesson '+lesson.n+' did not open '+view);
        }
        await page.locator('[data-view="course"]').click();
        await pause(50);
        await page.locator('[data-seq-lesson]').nth(li).click();
        await pause(30);
        await page.locator('#lessonPanel [data-seq-stage="'+si+'"]').click();
        await pause(20);
        const retained=await page.locator('.lesson-active-section [data-investigation="prediction"]').inputValue();
        if(retained!=='Lesson '+lesson.n+' prediction note') throw new Error('Lesson '+lesson.n+' investigation notes were lost after simulation hand-off');
      }
      if(stage.id==='practice'){
        if(!(await page.locator('#sequenceExamPractice').count())) throw new Error('Lesson '+lesson.n+' exam-practice action missing');
        const expectedTasks=(taskBankData[lesson.n]||[]).length;
        const renderedTasks=await page.locator('.lesson-task-card').count();
        const practiceInputs=page.locator('.lesson-active-section [data-practice-input]');
        if(expectedTasks<3) throw new Error('Lesson '+lesson.n+' configured task bank has fewer than 3 tasks');
        if(renderedTasks!==expectedTasks) throw new Error('Lesson '+lesson.n+' task bank mismatch: rendered '+renderedTasks+' vs configured '+expectedTasks);
        if(await practiceInputs.count()!==expectedTasks) throw new Error('Lesson '+lesson.n+' independent-practice answer boxes missing');
        const firstCard=page.locator('.lesson-task-card').first();
        if(!(await firstCard.evaluate(el=>el.open))) await firstCard.locator(':scope > summary').click();
        const value='Lesson '+lesson.n+' independent practice response';
        await practiceInputs.first().fill(value);
        await pause(5);
        const saved=await page.evaluate(n=>JSON.parse(localStorage.getItem('particleLessonPracticeAnswersV1')||'{}')?.[n]?.[0]||'',lesson.n);
        if(saved!==value) throw new Error('Lesson '+lesson.n+' independent-practice response did not persist');
      }
      if(stage.id==='exit'){
        const expected=Math.min(5,Math.max(3,(taskBankData[lesson.n]||[]).length));
        const tests=page.locator('.lesson-active-section .short-test-question');
        const testInputs=page.locator('.lesson-active-section [data-short-test-input]');
        if(await tests.count()!==expected) throw new Error('Lesson '+lesson.n+' short-test question count mismatch');
        if(await testInputs.count()!==expected) throw new Error('Lesson '+lesson.n+' short-test answer boxes missing');
        if(await page.locator('.lesson-active-section .short-test-question details').count()!==expected) throw new Error('Lesson '+lesson.n+' short-test mark-point reveals missing');
        const value='Lesson '+lesson.n+' short test response';
        await testInputs.first().fill(value);
        await pause(5);
        const saved=await page.evaluate(n=>JSON.parse(localStorage.getItem('particleLessonShortTestAnswersV1')||'{}')?.[n]?.[0]||'',lesson.n);
        if(saved!==value) throw new Error('Lesson '+lesson.n+' short-test response did not persist');
      }
      if(stage.id==='next'){
        const txt=(await page.locator('.lesson-active-section').textContent())||'';
        if(!/Homework:/i.test(txt)) throw new Error('Lesson '+lesson.n+' homework step missing');
      }
    }

    // Back/forward step buttons are part of the guided route.
    await page.locator('#lessonPanel [data-seq-stage="1"]').click();
    await pause(20);
    if(!(await page.locator('#lessonStepBack').count())) throw new Error('Lesson '+lesson.n+' previous-step button missing');
    await page.locator('#lessonStepBack').click();
    await pause(20);
    const firstActive=await page.locator('#lessonPanel [data-seq-stage="0"]').evaluate(el=>el.classList.contains('active'));
    if(!firstActive) throw new Error('Lesson '+lesson.n+' previous-step navigation failed');

    // Complete all seven guided steps using the real progression button.
    for(let si=0; si<stageData.length; si++){
      const activeBefore=await page.locator('#lessonPanel [data-seq-stage="'+si+'"]').evaluate(el=>el.classList.contains('active'));
      if(!activeBefore) throw new Error('Lesson '+lesson.n+' completion flow was not on step '+si);
      const doneButton=page.locator('#lessonStepDone');
      if(!(await doneButton.count())) throw new Error('Lesson '+lesson.n+' step '+si+' completion button missing');
      await doneButton.click();
      await pause(30);
      const finished=await page.locator('#lessonPanel [data-seq-stage="'+si+'"]').evaluate(el=>el.classList.contains('done'));
      if(!finished) throw new Error('Lesson '+lesson.n+' step '+si+' did not record as done');
      if(si<stageData.length-1){
        const advanced=await page.locator('#lessonPanel [data-seq-stage="'+(si+1)+'"]').evaluate(el=>el.classList.contains('active'));
        if(!advanced) throw new Error('Lesson '+lesson.n+' did not advance from step '+si+' to '+(si+1));
      }
    }
    const completeText=(await page.locator('#sequenceComplete').textContent())||'';
    if(!/Lesson complete/i.test(completeText)) throw new Error('Lesson '+lesson.n+' did not complete after all seven steps');
  }

  console.log('STEPS: native chunk accordion across all lessons');
  for(let li=0; li<lessonData.length; li++){
    const lesson=lessonData[li];
    await page.locator('[data-seq-lesson]').nth(li).evaluate(el=>el.click());
    await pause(12);
    await page.locator('#lessonPanel [data-seq-stage="2"]').evaluate(el=>el.click());
    await pause(12);
    const details=page.locator('.lesson-active-section .native-chunk-list > .lesson-chunk-rich');
    if(await details.count()!==lesson.teach.length) throw new Error('Lesson '+lesson.n+' native chunk count mismatch');
    for(let ci=0; ci<lesson.teach.length; ci++){
      const d=page.locator('.lesson-active-section .lesson-chunk-rich[data-lesson-chunk="'+ci+'"]');
      const summary=d.locator(':scope > summary');
      if(!(await summary.count())) throw new Error('Lesson '+lesson.n+' chunk '+ci+' native summary missing');
      if(!(await d.evaluate(el=>el.open))){
        await summary.evaluate(el=>el.click());
        await pause(5);
      }
      if(!(await d.evaluate(el=>el.open))) throw new Error('Lesson '+lesson.n+' chunk '+ci+' could not be opened natively');
    }
    if(lesson.teach.length>1){
      await page.locator('.lesson-active-section [data-core-chunk="0"]').evaluate(el=>el.click());
      await pause(8);
      await page.locator('#coreChunkNext').evaluate(el=>el.click());
      await pause(8);
      if((await page.evaluate(()=>window.PARTICLELAB_LESSON_SEQUENCE?.getActiveChunk?.()))!==1) throw new Error('Lesson '+lesson.n+' Next chunk failed in native accordion mode');
    }
  }

  console.log('STEPS: every simulation mission step');
  await page.locator('[data-view="lab"]').click();
  await page.waitForSelector('#simNav .sim-tab');
  const simIds=await page.locator('#simNav .sim-tab').evaluateAll(ns=>ns.map(n=>n.dataset.sim));
  for(const id of simIds){
    await page.locator('#simNav .sim-tab[data-sim="'+id+'"]').click();
    await pause(70);
    const mission=page.locator('#simulationMissionPanel');
    if(!(await mission.count())) throw new Error(id+': mission panel missing');
    const stepCount=await mission.locator('[data-mission-done]').count();
    if(stepCount<3) throw new Error(id+': expected at least 3 mission steps');

    await page.locator('#missionPrediction').fill('I predict a measurable change based on the physics model.');
    await page.locator('#missionExplanation').fill('The result follows from the relevant AQA physics relationship and conservation rules.');

    for(let mi=0; mi<stepCount; mi++){
      const reveal=page.locator('[data-mission-observe="'+mi+'"]');
      await reveal.evaluate(el=>el.click()); await pause(8);
      if(await page.locator('#missionObs'+mi).isHidden()) throw new Error(id+': mission observation '+mi+' did not reveal');
      await page.locator('[data-mission-done="'+mi+'"]').evaluate(el=>el.click()); await pause(10);
      const state=await page.evaluate(({id,mi})=>!!window.PARTICLELAB_SIM_MISSIONS?.state?.[id]?.steps?.[mi],{id,mi});
      if(!state) throw new Error(id+': mission step '+mi+' did not persist as complete');
    }

    const correct=await page.evaluate(id=>window.PARTICLELAB_SIM_MISSIONS?.missions?.[id]?.check?.[2],id);
    if(!Number.isInteger(correct)) throw new Error(id+': mission mastery answer key missing');
    await page.locator('[data-mission-answer="'+correct+'"]').evaluate(el=>el.click()); await pause(10);
    const secure=await page.evaluate(id=>!!window.PARTICLELAB_SIM_MISSIONS?.state?.[id]?.secure,id);
    if(!secure) throw new Error(id+': mission mastery check did not become secure');
  }

  if(errors.length) throw new Error('Browser errors:\n'+[...new Set(errors)].join('\n'));
  console.log('ALL STEP VERIFICATION PASSED: '+lessonData.length+' lessons × '+stageData.length+' stages, native teaching chunks, and '+simIds.length+' simulation missions.');
} finally {
  await browser.close();
}
