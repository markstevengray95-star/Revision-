import { chromium } from 'playwright';

const BASE=process.env.TEST_URL||'http://127.0.0.1:4175/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(7000);

const cjk=t=>/[\u3400-\u9fff]/.test(t||'');
const obviousEnglish=/\b(?:Start here|Revision hub|Exam skills|Evidence Lab|Glossary|Practice studio|Diagnostic & lessons|Learning tools|Simulation lab|Particle atlas|Formula coach|Practice quiz|Conservation-law checker|Topic map|Guided course)\b/i;

try{
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.waitForTimeout(1800);
  if(!await page.evaluate(()=>!!window.PARTICLELAB_LANGUAGE?.set)) throw new Error('Language API missing');
  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE.set('zh'));
  await page.waitForTimeout(150);

  if((await page.locator('html').getAttribute('lang'))!=='zh-CN') throw new Error('zh-CN was not activated');
  if(!await page.evaluate(()=>!!window.PARTICLELAB_MANDARIN_GLOBAL && !!window.PARTICLELAB_MANDARIN_LESSONS)) throw new Error('Mandarin catalogues missing');

  const expected=[
    ['course','#view-course'],
    ['lab','#view-lab'],
    ['map','#view-map'],
    ['atlas','#view-atlas'],
    ['conserve','#view-conserve'],
    ['formula','#view-formula'],
    ['quiz','#view-quiz'],
    ['spec','#view-spec'],
    ['starthere','#view-starthere'],
    ['revisionhub','#view-revisionhub'],
    ['examskills','#view-examskills'],
    ['evidence','#view-evidence'],
    ['glossary','#view-glossary'],
    ['studio','#view-studio'],
    ['diagnostic','#view-diagnostic'],
    ['learninghub','#view-learninghub']
  ];

  for(const [view,selector] of expected){
    const nav=page.locator('.nav-button[data-view="'+view+'"]');
    if(!(await nav.count())) throw new Error('Missing navigation tab '+view);
    await nav.evaluate(el=>el.click());
    await page.waitForTimeout(35);
    const root=page.locator(selector);
    if(!(await root.count())) throw new Error('Missing view '+view);
    const head=(await root.locator('h2,h3').first().textContent())||'';
    if(!cjk(head)) throw new Error('Main heading not Mandarin for '+view+': '+head);
    const visible=((await root.textContent())||'').replace(/AQA|MeV|eV|SI|GCSE|A-level|PDF|3D|Q\/m|KEmax|hf|ΔE/g,'');
    if(obviousEnglish.test(visible)) throw new Error('Obvious English UI leak in '+view+': '+visible.match(obviousEnglish)?.[0]);
  }

  // Core home/header labels should also be translated.
  const brand=(await page.locator('.brand').textContent())||'';
  if(!cjk(brand)) throw new Error('Header brand did not translate');
  const hero=(await page.locator('.hero-copy h1').textContent())||'';
  if(!cjk(hero)) throw new Error('Home hero did not translate');

  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE.set('en'));
  await page.waitForTimeout(80);
  if((await page.locator('html').getAttribute('lang'))!=='en') throw new Error('English restore failed');

  console.log('MANDARIN UI SWEEP PASSED: all major student views have Mandarin headings and no obvious English navigation leakage.');
}finally{
  await browser.close();
}
