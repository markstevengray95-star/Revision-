(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const STORE='aqa-electricity-question-v4';
  let saved={};
  try{saved=JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch(e){}
  const persist=()=>localStorage.setItem(STORE,JSON.stringify(saved));
  const norm=s=>String(s||'').toLowerCase().replace(/Ω/g,' ohm ').replace(/ε/g,' epsilon ').replace(/ρ/g,' rho ').replace(/²/g,'2').replace(/[^a-z0-9.+\- ]/g,' ').replace(/\s+/g,' ').trim();
  const lesson=()=>$('.course-button.active')?.dataset.lesson||null;
  const chapter=()=>$('.textbook-chapter-button.active')?.dataset.textbookChapter||null;

  const LR={
    'current-charge':[['Q = It',['q it','charge current time']],['short time limits charge',['short time','brief']],['large current alone does not guarantee large Q',['large current','modest charge','small charge']]],
    'pd-resistance':[['P = VI',['p vi','power']],['same V can have different I',['different current','current differs']],['different I gives different power',['different power','rate of energy transfer']]],
    'iv-ohmic':[['heating raises temperature',['heating','temperature']],['metal resistance increases',['resistance increases']],['graph gradient changes / curves',['gradient changes','curve','not straight','less steep']]],
    'iv-nonohmic':[['resistance depends on operating point',['operating point','changes']],['R = V/I',['v i','v/i']],['lamp temperature changes with current',['temperature','heating','filament']]],
    'resistivity':[['A proportional to d²',['d2','diameter squared']],['percentage uncertainty roughly doubles',['twice','double','2%']],['because diameter is squared',['squared','power 2']]],
    'temperature':[['NTC resistance decreases when hotter',['ntc','resistance decreases']],['output depends on sensor position',['position','upper','lower','across']],['resistance change alters divider ratio',['vout','ratio','potential divider']]],
    'series':[['same current',['same current']],['V = IR',['v ir','v=ir']],['larger R gives larger V at same I',['larger resistance','larger pd','larger voltage']]],
    'parallel-power':[['extra branch adds current path',['extra path','another branch']],['total current increases',['total current increases']],['Rtotal decreases at fixed V',['resistance decreases','v/i','lower resistance']]],
    'potential-divider':[['LDR resistance decreases in brighter light',['ldr','resistance decreases','light']],['output is across lower component',['lower','numerator','across']],['Vout decreases',['vout decreases','output falls']]],
    'emf-internal':[['larger external R reduces current',['current decreases','i decreases']],['lost volts Ir tends to zero',['lost volts','ir','zero']],['terminal V approaches emf',['approaches emf','v approaches epsilon','terminal pd']]],
    'synthesis':[['parallel resistance below smallest branch',['parallel','smaller than']],['conservation checks',['conservation','voltage','current']],['terminal p.d. sensible relative to emf',['terminal pd','emf']],['units / power / signs checked',['power','units','sensible']]]
  };

  const CR={
    basics:[['Q = 10 C',['10 c','charge 10']],['energy = 120 J',['120 j','vq']],['12 V means 12 J C⁻¹',['12 j per c','12 joules per coulomb','energy per charge']]],
    iv:[['steeper I–V means lower R',['smaller resistance','lower resistance']],['gradient = 1/R',['1/r','reciprocal']],['three times steeper means one-third R',['one third','1/3']]],
    resistivity:[['diameter uncertainty = 2.5%',['2.5%','2.5 percent']],['area uncertainty ≈ 5%',['5%','5 percent']],['area depends on d²',['d2','squared']]],
    rp5:[['positive intercept can be contact/lead resistance',['contact resistance','lead resistance']],['extra resistance exists at zero length',['intercept','zero length','additional resistance']]],
    circuits:[['parallel provides more current paths',['more paths','branch']],['same V gives greater total I',['total current','same voltage']],['R=V/I so total R is lower',['v/i','lower resistance']]],
    divider:[['Vout/Vin = 0.2',['0.2','one fifth','1/5']],['required resistance ratio 1:4',['1:4','1 to 4','4:1']],['valid example such as 1 kΩ and 4 kΩ',['1 kohm','4 kohm','1000','4000']]],
    emf:[['ε = 1.55 V',['1.55 v','emf 1.55']],['r = 0.42 Ω',['0.42 ohm','internal resistance 0.42']],['gradient magnitude gives r',['gradient','magnitude']]],
    rp6:[['large R gives small current',['small current','low current']],['reduces heating/discharge',['heating','discharge']],['protects cell / gives safer starting point',['protect','safe','cell']]]
  };

  function score(text,rubric){
    const a=norm(text);
    const hits=(rubric||[]).map(([label,alts])=>alts.some(t=>a.includes(norm(t))));
    return {score:hits.filter(Boolean).length,max:(rubric||[]).length,missing:(rubric||[]).filter((x,i)=>!hits[i]).map(x=>x[0])};
  }
  function css(){
    if($('#qAutoV4Style'))return;
    const st=document.createElement('style');st.id='qAutoV4Style';st.textContent=`
      .qv4-tools{display:flex;gap:7px;align-items:center;flex-wrap:wrap;margin-top:7px}.qv4-feedback{display:none;margin-top:7px;padding:8px 9px;border-radius:9px;background:#06111e;border:1px solid #31506e;font-size:.73rem;line-height:1.45}.qv4-feedback.show{display:block}.qv4-feedback.good{border-color:#4e9b7d;color:#9cf0c6}.qv4-feedback.mid{border-color:#8a7437;color:#ffe09a}.qv4-feedback.low{border-color:#865148;color:#ffc1b5}.chapter-v3-check textarea{width:100%;min-height:90px;background:#071522;border:1px solid #31506e;border-radius:9px;color:var(--text);padding:9px;margin-top:7px}`;
    document.head.appendChild(st);
  }
  function decorateLesson(){
    const id=lesson(),ta=$(`[data-v3-transfer="${id}"]`);
    if(!id||!ta||ta.dataset.qv4)return;
    ta.dataset.qv4='1';
    const key=`lesson:${id}`;if(saved[key]&&!ta.value)ta.value=saved[key];
    const tools=document.createElement('div');tools.className='qv4-tools';tools.innerHTML='<button class="button primary" data-qv4="lesson">Auto-mark transfer</button><div class="qv4-feedback" style="flex-basis:100%"></div>';ta.insertAdjacentElement('afterend',tools);
  }
  function decorateChapter(){
    const id=chapter(),box=$('#chapterDepthV3 .chapter-v3-check');
    if(!id||!box||box.dataset.qv4)return;
    box.dataset.qv4='1';const key=`chapter:${id}`;
    box.insertAdjacentHTML('beforeend',`<textarea data-qv4-chapter="${id}" placeholder="Answer the quick check here...">${saved[key]||''}</textarea><div class="qv4-tools"><button class="button primary" data-qv4="chapter">Auto-mark quick check</button><div class="qv4-feedback" style="flex-basis:100%"></div></div>`);
  }
  function show(fb,res){
    const p=res.max?res.score/res.max:0;fb.className='qv4-feedback show '+(p>=.8?'good':p>=.5?'mid':'low');
    fb.innerHTML=`<strong>${res.score}/${res.max} key points detected.</strong>${res.missing.length?`<br>Develop: ${res.missing.join(' · ')}`:'<br>Strong coverage — now check precision, units and linking words.'}<br><small>Formative automark: use the wording feedback to improve the response.</small>`;
  }
  document.addEventListener('input',e=>{
    if(e.target.matches('[data-v3-transfer]')){saved[`lesson:${e.target.dataset.v3Transfer}`]=e.target.value;persist();}
    if(e.target.matches('[data-qv4-chapter]')){saved[`chapter:${e.target.dataset.qv4Chapter}`]=e.target.value;persist();}
  });
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-qv4]');if(!b)return;
    if(b.dataset.qv4==='lesson'){const id=lesson(),ta=$(`[data-v3-transfer="${id}"]`),fb=b.parentElement.querySelector('.qv4-feedback');show(fb,score(ta?.value||'',LR[id]||[]));}
    if(b.dataset.qv4==='chapter'){const id=chapter(),ta=$(`[data-qv4-chapter="${id}"]`),fb=b.parentElement.querySelector('.qv4-feedback');show(fb,score(ta?.value||'',CR[id]||[]));}
  });
  let q=false;function schedule(){if(q)return;q=true;requestAnimationFrame(()=>{q=false;css();decorateLesson();decorateChapter();});}
  function start(){css();schedule();new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();