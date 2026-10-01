import { chromium } from 'playwright';

const base=process.env.APP_URL||'http://127.0.0.1:4173';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];
page.on('pageerror',e=>errors.push(`pageerror: ${e.message}`));
page.on('console',m=>{if(m.type()==='error')errors.push(`console: ${m.text()}`);});
const assert=(c,m)=>{if(!c)throw new Error(m);};
const wait=ms=>page.waitForTimeout(ms);

try{
  await page.goto(base,{waitUntil:'networkidle',timeout:30000});
  await page.addScriptTag({url:`${base}/extended-response-hub-v1.js`});
  await wait(120);

  assert(await page.locator('[data-view="extended"]').count()===1,'Extended Response navigation tab missing');
  await page.locator('[data-view="extended"]').click();await wait(80);
  assert(await page.locator('#view-extended').evaluate(el=>el.classList.contains('active-view')),'Extended Response view did not open');
  assert(await page.locator('[data-erhub-q]').count()===11,'Expected 11 extended-response questions');
  assert((await page.locator('#erHubQuestion').innerText()).length>300,'Extended-response question panel incomplete');
  assert(await page.locator('[data-erhub-plan]').count()>=3,'Planning scaffold missing');

  const answer='Electric current is the rate of flow of charge. In a metal the charge carriers are electrons. Electrons drift from the negative terminal towards the positive terminal. Conventional current is defined opposite to electron drift. Q = It links charge, current and time. Therefore if the current doubles for the same time, the charge transferred doubles.';
  await page.locator('#erHubAnswer').fill(answer);
  await page.locator('[data-erhub-action="mark"]').click();await wait(60);
  assert(await page.locator('#erHubFeedback').evaluate(el=>el.classList.contains('show')),'Extended-response feedback did not open');
  assert((await page.locator('#erHubFeedback').innerText()).includes('/6'),'Practice mark estimate missing');
  assert((await page.locator('#erHubFeedback .erhub-check.met').count())>=4,'Target physics coverage was not detected');

  await page.locator('[data-erhub-action="model"]').click();
  assert(await page.locator('#erHubModel').evaluate(el=>el.classList.contains('show')),'Model answer did not reveal');

  await page.locator('#erHubDraft').fill(answer+' This is a connected explanation using the equation to justify the proportional change.');
  await page.locator('[data-erhub-action="compare"]').click();await wait(30);
  assert((await page.locator('#erHubCompare').innerText()).includes('First draft estimate'),'Draft comparison missing');

  await page.locator('#erHubTopic').selectOption({label:'Resistivity · RP5'});await wait(30);
  assert(await page.locator('[data-erhub-q]').count()===1,'Topic filter failed');
  await page.locator('#erHubRandom').click();await wait(30);
  assert((await page.locator('#erHubQuestion').innerText()).includes('resistivity'),'Filtered random question failed');

  await page.locator('#erHubTopic').selectOption('all');await wait(30);
  await page.locator('[data-erhub-q="er-energy"]').click();await wait(30);
  assert((await page.locator('#erHubQuestion').innerText()).includes('4 marks'),'4-mark question failed to load');

  if(errors.length)throw new Error(`Browser errors detected:\n${errors.join('\n')}`);
  console.log('EXTENDED_RESPONSE_SMOKE_PASS');
} finally {
  await browser.close();
}
