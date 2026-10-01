(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const sim=()=>$('.sim-tab.active')?.dataset.sim||'charge';
  let smoothMode=true, drag=null, pending=null, lastFrame=0;
  const faults={
    charge:[
      ['The ammeter has been connected in parallel with the resistor.','Reconnect the ammeter in series so the same current passes through the meter and the component.'],
      ['The switch is open but a non-zero current is recorded.','An open circuit should give zero current. Check the switch state or the meter reading.'],
      ['The voltmeter is inserted into the main series path.','Reconnect the voltmeter in parallel across the component because it measures potential difference between two points.']
    ],
    iv:[
      ['The student changes p.d. but never reverses polarity.','To obtain the full characteristic where appropriate, reverse the supply polarity and collect negative as well as positive values.'],
      ['The filament lamp is left at a large current for a long time before each reading.','Heating changes the filament resistance. Take readings efficiently and recognise temperature as part of the lamp behaviour.'],
      ['The voltmeter is connected in series.','Move it across the test component. The ammeter belongs in series; the voltmeter belongs in parallel.']
    ],
    resistivity:[
      ['The student measures wire diameter once at one position.','Take several micrometer readings at different positions and use a mean diameter.'],
      ['The switch is left closed between all readings.','Open the switch between measurements to reduce heating, which would change the resistance.'],
      ['The student plots resistance against 1/length.','For constant area and temperature, R is proportional to L, so plot R against L.']
    ],
    circuits:[
      ['A calculated parallel resistance is larger than both branch resistances.','For positive resistors in parallel, the total resistance must be smaller than the smallest branch resistance.'],
      ['The student assumes current is the same in each parallel branch.','Parallel branches share p.d.; branch currents depend on branch resistance and add at the junction.'],
      ['The student adds parallel resistances directly.','Use the reciprocal relationship for parallel resistance, not the series rule.']
    ],
    divider:[
      ['The student predicts an NTC output trend without saying where Vout is measured.','State which component Vout is across. The response direction depends on sensor position and measurement points.'],
      ['A low-resistance measuring device is connected across the output.','This can load the divider and change the effective resistance. Use a high-resistance voltmeter in the idealised measurement.'],
      ['The numerator in the divider equation uses the wrong resistor.','Use the resistance across which Vout is measured in the numerator.']
    ],
    internal:[
      ['The switch is left closed while the variable resistor is adjusted for every reading.','Open the switch between readings to reduce heating and discharge effects.'],
      ['The student reads the V–I graph gradient as +r.','For V = ε − Ir, the gradient of V against I is −r; internal resistance is the magnitude of the gradient.'],
      ['The voltmeter is placed in series with the load.','The voltmeter should be connected across the cell terminals to measure terminal p.d.']
    ]
  };
  const faultIndex={};

  function css(){
    if($('#simPerformanceV3Style'))return;
    const st=document.createElement('style');st.id='simPerformanceV3Style';st.textContent=`
      .real-lab,.sim-depth,.circuit-sandbox,.depth-v2,.textbook-section{contain:layout paint style}.sim-depth-card,.real-card,.depth-v2-card{content-visibility:auto;contain-intrinsic-size:180px}
      [data-real-drag],.direct-knob,.stimulus-direct{will-change:transform;touch-action:none}.wire-overlay path,.flow-overlay path{will-change:stroke-dashoffset}
      .performance-tools{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}.performance-tools button{border:1px solid #31506e;background:#071522;color:var(--text);border-radius:999px;padding:6px 9px;font-size:.7rem;font-weight:850}.performance-tools button.active{background:#17314a;border-color:#67c7ff;color:#dff5ff}
      .sim-paused *{animation-play-state:paused!important}.low-motion .flow-overlay,.low-motion .electron-flow,.low-motion .current-particle{display:none!important}.low-motion [class*=glow]{box-shadow:none!important;filter:none!important}
      .fault-card-v3{margin:12px 0;border:1px solid #6c5f33;border-radius:14px;padding:12px;background:linear-gradient(145deg,#17160d,#0c1118)}.fault-card-v3 h4{margin:0 0 6px}.fault-card-v3 p{margin:6px 0;line-height:1.45}.fault-actions{display:flex;gap:7px;flex-wrap:wrap}.fault-fix{display:none;margin-top:9px;padding:9px;border-radius:9px;background:#071522;border:1px solid #31506e}.fault-fix.show{display:block}
      .sim-perf-note{font-size:.68rem;color:var(--muted);margin-top:6px}.perf-meter{display:inline-flex;gap:5px;align-items:center;font-size:.66rem;color:#a9c3d8}.perf-dot{width:8px;height:8px;border-radius:50%;background:#63d9a4;box-shadow:0 0 9px rgba(99,217,164,.55)}
      @media(prefers-reduced-motion:reduce){.flow-overlay,.electron-flow,.current-particle{display:none!important}*{scroll-behavior:auto!important}}
    `;document.head.appendChild(st);
  }

  function controlFor(kind){
    const id=sim();
    if(kind==='clip')return $('[data-real-control=length]');
    if(kind==='micrometer')return $('[data-real-control=diameter]');
    if(kind==='rheostat')return id==='internal'?$('[data-real-control=load]'):id==='iv'?$('[data-real-control=voltage]'):null;
    if(kind==='supply')return $('[data-real-control=supply],[data-real-control=vin],[data-real-control=emf]');
    if(kind==='stimulus')return $('[data-real-control=stimulus]');
    return null;
  }
  function dispatchControl(el,val){
    if(!el)return; const min=Number(el.min),max=Number(el.max),step=Number(el.step)||1;
    val=clamp(val,min,max); val=Math.round(val/step)*step; el.value=String(val); el.dispatchEvent(new Event('input',{bubbles:true}));
  }
  function queue(val){
    pending=val;
    if(queue.raf)return;
    queue.raf=requestAnimationFrame(ts=>{
      queue.raf=0;
      const minGap=smoothMode?22:12;
      if(ts-lastFrame<minGap){queue(pending);return;}
      lastFrame=ts;
      if(drag?.el)dispatchControl(drag.el,pending);
    });
  }
  function beginDrag(e,kind,target){
    const el=controlFor(kind); if(!el)return;
    e.preventDefault();e.stopImmediatePropagation();
    drag={kind,el,startX:e.clientX,startValue:Number(el.value),target};
    document.body.classList.add('sim-direct-drag');
  }
  document.addEventListener('pointerdown',e=>{
    const t=e.target.closest('[data-real-drag],.direct-knob,.stimulus-direct'); if(!t)return;
    if(t.closest('#realLabPro')===null)return;
    let kind=t.dataset.realDrag||'';
    if(t.classList.contains('direct-knob'))kind='supply';
    if(t.classList.contains('stimulus-direct'))kind='stimulus';
    beginDrag(e,kind,t);
  },true);
  window.addEventListener('pointermove',e=>{
    if(!drag)return;
    e.preventDefault();
    const bench=$('#realBench'); const br=bench?.getBoundingClientRect();
    const el=drag.el,min=Number(el.min),max=Number(el.max);
    let val=drag.startValue;
    if((drag.kind==='clip'||drag.kind==='rheostat'||drag.kind==='supply'||drag.kind==='stimulus')&&br){
      const p=clamp((e.clientX-br.left)/br.width,0,1);
      if(drag.kind==='clip') val=0.2+clamp((p-.10)/.78,0,1)*0.7;
      else val=min+p*(max-min);
    } else if(drag.kind==='micrometer') val=drag.startValue+(e.clientX-drag.startX)/500*(max-min);
    queue(val);
  },{passive:false,capture:true});
  window.addEventListener('pointerup',()=>{drag=null;pending=null;document.body.classList.remove('sim-direct-drag');},{capture:true});

  function addTools(){
    const head=$('#realLabPro .real-lab-head'); if(!head||$('#simPerformanceTools'))return;
    const box=document.createElement('div');box.id='simPerformanceTools';box.className='performance-tools';
    box.innerHTML=`<button data-perf="smooth" class="active">Smooth mode</button><button data-perf="effects">Full effects</button><span class="perf-meter"><i class="perf-dot"></i> RAF-throttled controls</span>`;
    head.appendChild(box);
  }
  function setMode(mode){
    if(mode==='smooth'){smoothMode=true;document.body.classList.add('low-motion');}
    if(mode==='effects'){smoothMode=false;document.body.classList.remove('low-motion');}
    $$('[data-perf]').forEach(b=>b.classList.toggle('active',(mode==='smooth'&&b.dataset.perf==='smooth')||(mode==='effects'&&b.dataset.perf==='effects')));
  }

  function addFaultCard(){
    const root=$('#simulationDepth'); if(!root||$('#faultCardV3'))return;
    const id=sim(), arr=faults[id]||faults.charge; faultIndex[id]=faultIndex[id]??0; const pair=arr[faultIndex[id]%arr.length];
    const card=document.createElement('section');card.id='faultCardV3';card.className='fault-card-v3';
    card.innerHTML=`<span class="eyebrow">Practical fault-finder</span><h4>What is wrong with this setup or reasoning?</h4><p>${pair[0]}</p><div class="fault-actions"><button class="button" data-fault="reveal">Reveal correction</button><button class="button" data-fault="next">Next fault</button></div><div class="fault-fix" id="faultFixV3"><strong>Correction</strong><p>${pair[1]}</p></div>`;
    root.appendChild(card);
  }
  function refreshFault(){const c=$('#faultCardV3');if(c)c.remove();addFaultCard();}

  function pauseWhenHidden(){
    const root=$('#view-lab'); if(!root||pauseWhenHidden.done)return; pauseWhenHidden.done=true;
    if('IntersectionObserver'in window){new IntersectionObserver(entries=>{entries.forEach(en=>root.classList.toggle('sim-paused',!en.isIntersecting));},{threshold:.02}).observe(root);}
    document.addEventListener('visibilitychange',()=>root.classList.toggle('sim-paused',document.hidden));
  }

  let scheduled=false;
  function decorate(){
    scheduled=false; css(); addTools(); addFaultCard(); pauseWhenHidden();
    if(smoothMode)document.body.classList.add('low-motion');
  }
  function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(decorate);}

  document.addEventListener('click',e=>{
    const b=e.target.closest('button');if(!b)return;
    if(b.dataset.perf){setMode(b.dataset.perf);return;}
    if(b.dataset.fault==='reveal'){ $('#faultFixV3')?.classList.add('show');return; }
    if(b.dataset.fault==='next'){const id=sim();faultIndex[id]=(faultIndex[id]??0)+1;refreshFault();return;}
    if(b.classList.contains('sim-tab'))setTimeout(()=>{refreshFault();schedule();},50);
  });

  function start(){css();schedule();const lab=$('#view-lab');if(lab)new MutationObserver(schedule).observe(lab,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
