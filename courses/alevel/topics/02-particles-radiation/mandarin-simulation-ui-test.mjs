import { chromium } from 'playwright';

const BASE=process.env.TEST_URL||'http://127.0.0.1:4176/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.setDefaultTimeout(7000);
const cjk=t=>/[\u3400-\u9fff]/.test(t||'');
const obviousEnglish=/\b(?:Build|Quick|Protons|Neutrons|Mass number|Electrons|Change isotope|Make neutral|Rules|separation|force|decay|frequency|intensity|work function|transition|voltage|impact parameter|model|particle|electron|proton|neutron|photon|nucleus|atom|energy|momentum|charge|mass)\b/i;

try{
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.waitForTimeout(1500);
  await page.evaluate(()=>window.PARTICLELAB_LANGUAGE?.set?.('zh'));
  await page.waitForTimeout(100);
  if((await page.locator('html').getAttribute('lang'))!=='zh-CN') throw new Error('Mandarin mode failed');

  const translated=await page.evaluate(()=>window.PARTICLELAB_APP_TRANSLATE?.('Nucleus'));
  if(!cjk(translated||'')) throw new Error('3D canvas label translator is not active');

  await page.locator('[data-view="lab"]').evaluate(el=>el.click());
  const ids=['atom','specific','strong','decay','antimatter','interactions','classification','quarks','photo','collisions','levels','diffraction','rutherford'];
  for(const id of ids){
    const tab=page.locator('.sim-tab[data-sim="'+id+'"]');
    await tab.evaluate(el=>el.click());
    await page.waitForTimeout(50);

    const title=(await page.locator('#simTitle').textContent())||'';
    const controls=(await page.locator('#simControls').textContent())||'';
    const stage=(await page.locator('#live3DStage').textContent())||'';
    const now=(await page.locator('#live3DNow').textContent())||'';

    if(!cjk(title)) throw new Error(id+' title is not Mandarin: '+title);
    if(!cjk(controls)) throw new Error(id+' controls contain no Mandarin text: '+controls.slice(0,180));
    if(!cjk(stage)) throw new Error(id+' live 3D stage is not Mandarin: '+stage);
    if(now.trim()&&!cjk(now) && /[A-Za-z]{4}/.test(now)) throw new Error(id+' live 3D state is still English: '+now);

    const leak=controls.replace(/AQA|MeV|eV|SI|Hz|fm|kg|KE|max|Q|Z|A|N|B|S|W|H|He|Na|Cl|Au|pH/g,' ');
    const m=leak.match(obviousEnglish);
    if(m) throw new Error(id+' has English simulation control text: '+m[0]+' :: '+controls.slice(0,260));
  }

  console.log('MANDARIN SIMULATION UI PASSED: all 13 simulations have Mandarin controls, titles and live 3D guidance.');
}finally{
  await browser.close();
}
