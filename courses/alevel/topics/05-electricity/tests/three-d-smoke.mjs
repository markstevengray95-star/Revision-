import { chromium } from 'playwright';
const base=process.env.APP_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`);});
const assert=(c,m)=>{if(!c)throw new Error(m);};const wait=ms=>page.waitForTimeout(ms);
try{
  await page.goto(base,{waitUntil:'networkidle',timeout:30000});
  await page.locator('[data-view="lab"]').click();await wait(180);
  assert(await page.locator('#sim3DCanvas').count()===1,'3D simulation canvas missing');
  assert(await page.locator('#sim3DToolbar').count()===1,'3D toolbar missing');
  assert(await page.locator('[data-3d-nudge]').count()===4,'Accessible 3D orbit controls missing');
  const ids=await page.locator('.sim-tab').evaluateAll(xs=>xs.map(x=>x.dataset.sim));
  assert(ids.length===6,'Expected six 3D simulation scenes');
  for(const id of ids){
    await page.locator(`.sim-tab[data-sim="${id}"]`).click();await wait(100);
    assert((await page.locator('#sim3DCanvas').getAttribute('data-sim3d-scene'))===id,`${id}: 3D scene did not synchronise`);
    assert(await page.locator('[data-3d-equipment]').count()>=3,`${id}: 3D equipment inspector incomplete`);
    assert((await page.locator('#sim3DInfo').innerText()).length>60,`${id}: 3D scene explanation missing`);
    await page.locator('[data-3d-equipment]').first().click();await wait(20);
    assert((await page.locator('#sim3DInfo').innerText()).length>50,`${id}: equipment inspection failed`);
  }
  const yaw0=Number(await page.locator('#sim3DCanvas').getAttribute('data-camera-yaw'));
  await page.locator('[data-3d-nudge="right"]').click();await wait(80);
  const yaw1=Number(await page.locator('#sim3DCanvas').getAttribute('data-camera-yaw'));
  assert(Math.abs(yaw1-yaw0)>.05,'3D orbit control did not change camera');
  await page.locator('#sim3DCanvas').focus();await page.keyboard.press('ArrowLeft');await wait(60);
  const yaw2=Number(await page.locator('#sim3DCanvas').getAttribute('data-camera-yaw'));
  assert(Math.abs(yaw2-yaw1)>.05,'Keyboard 3D orbit did not change camera');
  await page.locator('[data-3d-action="explode"]').click();await wait(40);assert((await page.locator('#sim3DCanvas').getAttribute('data-exploded'))==='1','Exploded 3D view failed');
  await page.locator('[data-3d-action="reset"]').click();await wait(40);const resetYaw=Number(await page.locator('#sim3DCanvas').getAttribute('data-camera-yaw'));assert(Math.abs(resetYaw+0.4887)<.08,'3D reset view failed');

  await page.locator('[data-view="course"]').click();await wait(40);
  const lessonIds=await page.locator('.course-button').evaluateAll(xs=>xs.map(x=>x.dataset.lesson));
  for(const id of lessonIds){
    await page.locator(`.course-button[data-lesson="${id}"]`).click();await wait(45);await page.locator('[data-lesson-tab="learn"]').click();await wait(35);
    assert(await page.locator(`.lesson-depth-v8[data-depth-lesson="${id}"]`).count()===1,`${id}: detailed lesson expansion missing`);
    assert((await page.locator(`.lesson-depth-v8[data-depth-lesson="${id}"]`).innerText()).length>900,`${id}: detailed lesson expansion too short`);
  }
  await page.locator('[data-view="textbook"]').click();await wait(50);
  const chapters=await page.locator('.textbook-chapter-button').evaluateAll(xs=>xs.map(x=>x.dataset.textbookChapter));
  for(const id of chapters){
    await page.locator(`.textbook-chapter-button[data-textbook-chapter="${id}"]`).click();await wait(35);
    assert(await page.locator(`.textbook-depth-v8[data-depth-chapter="${id}"]`).count()===1,`${id}: textbook depth section missing`);
  }
  if(errors.length)throw new Error(`Browser errors detected:\n${errors.join('\n')}`);
  console.log('THREE_D_AND_CONTENT_PASS');
}finally{await browser.close();}
