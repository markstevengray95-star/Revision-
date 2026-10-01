(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const fmt = (x,dp=3) => {
    if (!Number.isFinite(x)) return "—";
    const a=Math.abs(x);
    if ((a>0&&a<0.001)||a>=10000) return x.toExponential(3);
    return Number(x.toFixed(dp)).toString();
  };
  const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
  const randNoise=(amp)=>1+(Math.random()-.5)*2*amp;

  const cfg={
    charge:{
      title:"Current, charge and microscopic conduction",
      hint:"Drag the current handle. Switch on microscopic view to see electron drift and lattice collisions.",
      x:"current",xLabel:"Current / A",y:"charge",yLabel:"Charge / C",
      controls:[
        {k:"current",label:"Current",min:.05,max:2,step:.05,u:"A",v:.40},
        {k:"time",label:"Time",min:1,max:60,step:1,u:"s",v:20},
        {k:"resistance",label:"Resistance",min:1,max:30,step:1,u:"Ω",v:10},
        {k:"temperature",label:"Lattice temperature",min:250,max:700,step:10,u:"K",v:293}
      ],
      prediction:"If current doubles while time is unchanged, what happens to charge transferred?",
      predictionAnswer:"doubles",
      investigate:"Investigate how charge transferred depends on current when time is constant.",
      challenge:{q:"A current of 0.65 A flows for 24 s. Calculate the charge transferred.",a:15.6,u:"C",tol:.03},
      calc:v=>{const Q=v.current*v.time,V=v.current*v.resistance,W=V*Q;return {charge:Q,current:v.current,voltage:V,resistance:v.resistance,energy:W,meterV:V,meterA:v.current,meterR:v.resistance,main:`Q = ${fmt(Q)} C`,secondary:`V = ${fmt(V)} V · W = ${fmt(W)} J`};}
    },
    iv:{
      title:"I–V characteristics virtual practical",
      hint:"Drag the variable-resistor control to change p.d., capture readings and build the I–V graph.",
      x:"voltage",xLabel:"V / V",y:"current",yLabel:"I / A",
      controls:[
        {k:"voltage",label:"Applied p.d.",min:-8,max:8,step:.1,u:"V",v:2},
        {k:"baseR",label:"Base resistance",min:5,max:50,step:1,u:"Ω",v:20},
        {k:"componentIndex",label:"Component",type:"select",options:[[0,"Ohmic resistor"],[1,"Filament lamp"],[2,"Diode"]],v:0}
      ],
      prediction:"For a filament lamp, what happens to resistance as the filament becomes hotter?",
      predictionAnswer:"increases",
      investigate:"Compare the I–V characteristics of an ohmic resistor, filament lamp and semiconductor diode.",
      challenge:{q:"A point on an I–V graph is V = 6.0 V and I = 0.30 A. Calculate the operating resistance.",a:20,u:"Ω",tol:.03},
      calc:v=>{let I=0;const kind=Number(v.componentIndex);if(kind===0)I=v.voltage/v.baseR;if(kind===1)I=v.voltage/(v.baseR*(1+.05*Math.abs(v.voltage)));if(kind===2){if(v.voltage>.55)I=Math.min(1.5,.018*(Math.exp((v.voltage-.55)*1.25)-1));else if(v.voltage<0)I=-.0002*Math.abs(v.voltage);}const R=Math.abs(I)>1e-7?Math.abs(v.voltage/I):Infinity;return {voltage:v.voltage,current:I,resistance:R,meterV:v.voltage,meterA:I,meterR:R,main:`I = ${fmt(I,4)} A`,secondary:`Operating R = ${Number.isFinite(R)?fmt(R):"very large"} Ω`};}
    },
    resistivity:{
      title:"Resistivity virtual wire bench",
      hint:"Drag the crocodile clip along the metre wire, take repeated diameter readings and analyse R against L.",
      x:"length",xLabel:"Length / m",y:"resistance",yLabel:"R / Ω",
      controls:[
        {k:"length",label:"Wire length",min:.10,max:1.00,step:.02,u:"m",v:.50},
        {k:"diameter",label:"Diameter",min:.20,max:.70,step:.01,u:"mm",v:.40},
        {k:"voltage",label:"Supply p.d.",min:.5,max:3,step:.1,u:"V",v:1.5},
        {k:"temperature",label:"Wire temperature",min:273,max:373,step:2,u:"K",v:293}
      ],
      prediction:"If wire length doubles while material, area and temperature stay constant, what happens to resistance?",
      predictionAnswer:"doubles",
      investigate:"Determine the resistivity of the wire from a graph of resistance against length.",
      challenge:{q:"A wire has R = 4.2 Ω, L = 0.80 m and A = 1.1×10⁻⁷ m². Calculate ρ.",a:5.775e-7,u:"Ω m",tol:.06},
      calc:v=>{const rho=4.8e-7*(1+.0038*(v.temperature-293));const d=v.diameter/1000,A=Math.PI*d*d/4,R=rho*v.length/A,I=v.voltage/R;return {length:v.length,resistance:R,current:I,voltage:v.voltage,rho,area:A,diameter:v.diameter,meterV:v.voltage,meterA:I,meterR:R,main:`R = ${fmt(R)} Ω`,secondary:`ρ ≈ ${fmt(rho)} Ω m · A = ${fmt(A)} m²`};}
    },
    circuits:{
      title:"Series and parallel circuit builder",
      hint:"Switch between series and parallel arrangements, adjust the resistors and inspect current, p.d. and power.",
      x:"r2",xLabel:"R₂ / Ω",y:"current",yLabel:"Total I / A",
      controls:[
        {k:"supply",label:"Supply",min:1,max:15,step:.5,u:"V",v:9},
        {k:"r1",label:"R₁",min:1,max:30,step:1,u:"Ω",v:10},
        {k:"r2",label:"R₂",min:1,max:30,step:1,u:"Ω",v:15},
        {k:"parallel",label:"Arrangement",type:"select",options:[[0,"Series"],[1,"Parallel"]],v:0}
      ],
      prediction:"When an extra resistance path is placed in parallel, what happens to total circuit resistance?",
      predictionAnswer:"decreases",
      investigate:"Compare total resistance, current and power for the same two resistors in series and parallel.",
      challenge:{q:"A 12 V supply is connected to 6 Ω and 3 Ω resistors in parallel. Calculate total current.",a:6,u:"A",tol:.03},
      calc:v=>{const p=Number(v.parallel)===1;let Rt,I,I1=0,I2=0;if(p){Rt=v.r1*v.r2/(v.r1+v.r2);I1=v.supply/v.r1;I2=v.supply/v.r2;I=I1+I2;}else{Rt=v.r1+v.r2;I=v.supply/Rt;I1=I2=I;}const P=v.supply*I;return {r2:v.r2,resistance:Rt,current:I,voltage:v.supply,power:P,i1:I1,i2:I2,meterV:v.supply,meterA:I,meterR:Rt,main:`Rₜ = ${fmt(Rt)} Ω`,secondary:`Iₜ = ${fmt(I)} A · P = ${fmt(P)} W`};}
    },
    divider:{
      title:"Potential divider and sensor laboratory",
      hint:"Move the sensor stimulus and choose whether the lower component is fixed, NTC or LDR.",
      x:"stimulus",xLabel:"Stimulus / %",y:"vout",yLabel:"Vout / V",
      controls:[
        {k:"vin",label:"Input p.d.",min:1,max:15,step:.5,u:"V",v:9},
        {k:"r1",label:"Upper resistance",min:100,max:10000,step:100,u:"Ω",v:2000},
        {k:"r2",label:"Lower base resistance",min:100,max:10000,step:100,u:"Ω",v:4000},
        {k:"sensor",label:"Lower component",type:"select",options:[[0,"Fixed resistor"],[1,"NTC thermistor"],[2,"LDR"]],v:0},
        {k:"stimulus",label:"Temperature / light",min:0,max:100,step:1,u:"%",v:50}
      ],
      prediction:"If Vout is measured across an NTC thermistor, what usually happens to Vout as temperature rises?",
      predictionAnswer:"decreases",
      investigate:"Investigate how sensor resistance changes the output potential difference of a divider.",
      challenge:{q:"A 9.0 V divider uses 2.0 kΩ above and 4.0 kΩ below. Vout is across the 4.0 kΩ resistor. Find Vout.",a:6,u:"V",tol:.03},
      calc:v=>{let R2=v.r2;const s=Number(v.sensor);if(s===1)R2=v.r2*Math.exp(-.018*(v.stimulus-50));if(s===2)R2=v.r2/(.35+1.3*v.stimulus/100);const I=v.vin/(v.r1+R2),Vout=I*R2;return {stimulus:v.stimulus,vout:Vout,current:I,resistance:R2,voltage:Vout,meterV:Vout,meterA:I,meterR:R2,main:`Vout = ${fmt(Vout)} V`,secondary:`Sensor R = ${fmt(R2)} Ω · I = ${fmt(I,5)} A`};}
    },
    internal:{
      title:"EMF and internal resistance virtual practical",
      hint:"Drag the load control, close the virtual switch and capture V–I readings. Use the graph to estimate ε and r.",
      x:"current",xLabel:"I / A",y:"terminal",yLabel:"Terminal V / V",
      controls:[
        {k:"emf",label:"EMF",min:1,max:12,step:.1,u:"V",v:6},
        {k:"r",label:"Internal resistance",min:.1,max:5,step:.1,u:"Ω",v:1},
        {k:"load",label:"Load resistance",min:.5,max:25,step:.5,u:"Ω",v:8},
        {k:"switchOn",label:"Switch",type:"select",options:[[1,"Closed"],[0,"Open"]],v:1}
      ],
      prediction:"As current drawn from a real cell increases, what happens to terminal potential difference?",
      predictionAnswer:"decreases",
      investigate:"Determine the emf and internal resistance from a graph of terminal p.d. against current.",
      challenge:{q:"A cell has ε = 1.50 V, r = 0.40 Ω and supplies 0.50 A. Calculate terminal p.d.",a:1.30,u:"V",tol:.03},
      calc:v=>{const on=Number(v.switchOn)===1;const I=on?v.emf/(v.load+v.r):0,lost=I*v.r,V=v.emf-lost;return {current:I,terminal:V,voltage:V,resistance:v.load,lost,load:v.load,meterV:V,meterA:I,meterR:v.load,main:`Terminal V = ${fmt(V)} V`,secondary:`I = ${fmt(I)} A · lost volts = ${fmt(lost)} V`};}
    }
  };

  let active="charge",mode="explore",meter="V",state={},data=[],uncertainty=false,frozen=false,hideValues=false,annotate=false,micro=true;

  function activeFromOriginal(){const b=$(".sim-tab.active");return b?.dataset.sim||active;}
  function defaults(id){const v={};cfg[id].controls.forEach(c=>v[c.k]=c.v);return v;}
  function ensureState(){if(!state[active])state[active]=defaults(active);}
  function calc(){ensureState();let out=cfg[active].calc(state[active]);if(uncertainty){out={...out};["meterV","meterA","meterR","voltage","current","resistance","terminal","vout","charge"].forEach(k=>{if(Number.isFinite(out[k]))out[k]*=randNoise(.008);});}return out;}

  function inject(){
    const view=$("#view-lab"), tabs=$("#simTabs"); if(!view||!tabs||$("#labPlus"))return;
    const root=document.createElement("section");root.id="labPlus";root.className="labplus";
    root.innerHTML=`
      <div class="labplus-top">
        <div><span class="eyebrow">Virtual Lab+</span><h3 class="labplus-section-title">Interactive experiment workspace</h3><p class="labplus-note">Direct manipulation · meters · graphing · uncertainty · prediction · investigation · challenge · teacher controls</p></div>
        <div class="labplus-teacher-tools">
          <button class="labplus-tool" data-lp-tool="uncertainty">Uncertainty</button>
          <button class="labplus-tool" data-lp-tool="freeze">Freeze</button>
          <button class="labplus-tool" data-lp-tool="hide">Hide values</button>
          <button class="labplus-tool" data-lp-tool="annotate">Annotate</button>
        </div>
      </div>
      <div class="labplus-mode-tabs" role="tablist">
        <button class="labplus-mode active" data-lp-mode="explore">Explore</button>
        <button class="labplus-mode" data-lp-mode="predict">Predict → Test → Explain</button>
        <button class="labplus-mode" data-lp-mode="investigate">Investigation</button>
        <button class="labplus-mode" data-lp-mode="challenge">Challenge</button>
      </div>
      <div class="labplus-grid">
        <div class="labplus-board">
          <div class="labplus-board-head"><div><h3 id="lpTitle"></h3><p class="labplus-note" id="lpHint"></p></div><span class="pill" id="lpEquipment">Virtual equipment</span></div>
          <div class="labplus-stage" id="lpStage"><div class="labplus-annotation" id="lpAnnotation"></div><div class="labplus-crosshair"></div></div>
          <div class="labplus-reading-row" id="lpReadings"></div>
          <div class="labplus-actions">
            <button class="button primary" id="lpCapture">Capture reading</button>
            <button class="button" id="lpReset">Reset experiment</button>
            <button class="button" id="lpMicro">Microscopic view: on</button>
          </div>
        </div>
        <aside class="labplus-side">
          <div class="labplus-card"><h4>Virtual multimeter</h4><div class="labplus-meter-tabs"><button class="labplus-meter active" data-lp-meter="V">V</button><button class="labplus-meter" data-lp-meter="A">A</button><button class="labplus-meter" data-lp-meter="R">Ω</button></div><div class="labplus-meter-box"><div class="labplus-meter-face" id="lpMeterFace"></div><div class="labplus-meter-copy" id="lpMeterCopy"></div></div></div>
          <div class="labplus-card"><h4>Direct controls</h4><div class="labplus-controls" id="lpControls"></div></div>
          <div class="labplus-card" id="lpLearning"></div>
        </aside>
      </div>
      <div class="labplus-panel" style="padding:14px"><div class="labplus-data"><div><div class="labplus-board-head"><h3>Experimental data</h3><div class="labplus-actions"><button class="button" id="lpClearData">Clear data</button><button class="button" id="lpBestFit">Best-fit line</button></div></div><div class="labplus-table-wrap"><table class="labplus-table"><thead id="lpTableHead"></thead><tbody id="lpTableBody"></tbody></table></div></div><div><div class="labplus-board-head"><h3>Interactive graph</h3><span class="labplus-note" id="lpGraphInfo">Tap a point to inspect it.</span></div><div class="labplus-graph"><canvas id="lpGraph"></canvas></div></div></div></div>`;
    tabs.insertAdjacentElement("afterend",root);
  }

  function equipmentSvg(){
    ensureState();const v=state[active],c=calc();
    const wire=`<path d="M95 175H675" stroke="#7f9db7" stroke-width="4" fill="none"/>`;
    const cell=`<g><rect x="75" y="125" width="95" height="90" rx="14" fill="#102b43" stroke="#63d9a4" stroke-width="4"/><path d="M106 145v50m24-38v26" stroke="#dff5e9" stroke-width="5"/><text x="90" y="238" fill="#9ddfc2" font-size="16">source</text></g>`;
    const ammeter=`<g><circle cx="570" cy="95" r="38" fill="#d9e3ea" stroke="#617f99" stroke-width="5"/><text x="556" y="106" fill="#081522" font-size="32" font-weight="800">A</text></g>`;
    const voltmeter=`<g><circle cx="570" cy="250" r="38" fill="#d9e3ea" stroke="#7d6fc2" stroke-width="5"/><text x="556" y="261" fill="#081522" font-size="32" font-weight="800">V</text></g>`;
    if(active==="charge"){
      const temp=(v.temperature-250)/(700-250);const amp=4+temp*13;let ions="";for(let i=0;i<10;i++){const x=120+i*55;ions+=`<circle cx="${x}" cy="175" r="${7+temp*3}" fill="#b8c4cf" opacity=".8"><animate attributeName="cy" values="${175-amp};${175+amp};${175-amp}" dur="${.7+i*.03}s" repeatCount="indefinite"/></circle>`;}let es="";if(micro){for(let i=0;i<9;i++){const x=110+i*65;es+=`<circle cx="${x}" cy="145" r="7" fill="#67c7ff"><animate attributeName="cx" values="${x+38};${x-38};${x+38}" dur="${1.4/Math.max(.2,v.current)}s" repeatCount="indefinite"/></circle>`;}}return `<svg viewBox="0 0 760 340" aria-label="Microscopic conductor model"><rect width="760" height="340" fill="transparent"/><text x="38" y="42" fill="#f2f7ff" font-size="21" font-weight="700">Metal conductor: electrons + vibrating lattice</text><rect x="75" y="115" width="610" height="120" rx="24" fill="#4a382e" stroke="#c58b54" stroke-width="3"/>${ions}${es}<path d="M540 78H330" stroke="#ffd56a" stroke-width="5"/><path d="M330 78l20-12v24z" fill="#ffd56a"/><text x="385" y="66" fill="#ffd56a" font-size="16">electron drift</text><g class="labplus-drag" data-drag="current"><circle class="labplus-drag-handle" cx="${130+v.current/2*500}" cy="290" r="18" fill="#67c7ff"/><path d="M125 290H635" stroke="#395772" stroke-width="5" stroke-linecap="round"/></g></svg>`;}
    if(active==="iv"){
      const kind=Number(v.componentIndex);const component=kind===0?`<rect x="320" y="155" width="120" height="40" rx="8" fill="#d9a464" stroke="#ffd56a" stroke-width="3"/><text x="346" y="181" fill="#07111f" font-size="17" font-weight="800">RESISTOR</text>`:kind===1?`<g><circle cx="380" cy="175" r="38" fill="#553a1a" stroke="#ffd56a" stroke-width="4"/><path d="M360 185q20-55 40 0" stroke="#ffb44b" stroke-width="5" fill="none"/><text x="338" y="235" fill="#ffd56a" font-size="16">filament lamp</text></g>`:`<g><path d="M345 145l70 30-70 30z" fill="#67c7ff"/><path d="M420 145v60" stroke="#dff5ff" stroke-width="5"/><text x="350" y="235" fill="#67c7ff" font-size="16">diode</text></g>`;return `<svg viewBox="0 0 760 340">${wire}${cell}${ammeter}${voltmeter}<path d="M170 175H320M440 175H665" stroke="#7f9db7" stroke-width="4"/>${component}<path d="M380 215V250H532" stroke="#8f81d0" stroke-width="3" fill="none"/><path d="M608 250H665V175" stroke="#8f81d0" stroke-width="3" fill="none"/><g class="labplus-drag" data-drag="voltage"><path d="M220 290H500" stroke="#395772" stroke-width="5" stroke-linecap="round"/><circle class="labplus-drag-handle" cx="${220+(v.voltage+8)/16*280}" cy="290" r="18" fill="#67c7ff"/></g><text x="510" y="296" fill="#9fdcff" font-size="16">variable control</text></svg>`;}
    if(active==="resistivity"){
      const clipX=135+v.length*.52*900;return `<svg viewBox="0 0 760 340"><text x="40" y="42" fill="#f2f7ff" font-size="20" font-weight="700">Metre wire + movable crocodile clip</text><path d="M120 170H650" stroke="#c47b4a" stroke-width="12" stroke-linecap="round"/><path d="M120 215H650" stroke="#8aa6c3" stroke-width="3"/><g fill="#b9c8d5" font-size="12">${[0,1,2,3,4,5,6,7,8,9,10].map(i=>`<path d="M${120+i*53} 205v20" stroke="#8aa6c3" stroke-width="2"/><text x="${112+i*53}" y="244">${i*10}</text>`).join("")}</g><g class="labplus-drag" data-drag="length"><path d="M${clipX} 110v115" stroke="#dce8f1" stroke-width="7"/><path d="M${clipX-18} 112h36l-8-20h-20z" fill="#dce8f1"/><circle class="labplus-drag-handle" cx="${clipX}" cy="90" r="17" fill="#67c7ff"/></g>${ammeter}${voltmeter}<g transform="translate(120 272)"><rect width="185" height="42" rx="10" fill="#26394b" stroke="#a8bac8" stroke-width="2"/><rect x="95" y="4" width="78" height="34" rx="5" fill="#c9d8e4"/><text x="106" y="27" fill="#07111f" font-size="16">${fmt(v.diameter,2)} mm</text><text x="10" y="27" fill="#dfeaf3" font-size="14">micrometer</text></g></svg>`;}
    if(active==="circuits"){
      const par=Number(v.parallel)===1;const rs=par?`<path d="M300 105V245M500 105V245" stroke="#7f9db7" stroke-width="4"/><rect x="255" y="155" width="90" height="40" rx="7" fill="#d9a464"/><rect x="455" y="155" width="90" height="40" rx="7" fill="#d9a464"/><text x="280" y="181" fill="#07111f" font-size="18">R₁</text><text x="480" y="181" fill="#07111f" font-size="18">R₂</text>`:`<rect x="270" y="155" width="90" height="40" rx="7" fill="#d9a464"/><rect x="430" y="155" width="90" height="40" rx="7" fill="#d9a464"/><text x="295" y="181" fill="#07111f" font-size="18">R₁</text><text x="455" y="181" fill="#07111f" font-size="18">R₂</text>`;return `<svg viewBox="0 0 760 340"><path d="M90 105H670V245H90Z" stroke="#7f9db7" stroke-width="4" fill="none"/>${cell}${rs}<text x="310" y="55" fill="#f2f7ff" font-size="22" font-weight="700">${par?"Parallel":"Series"} circuit</text><g class="labplus-drag" data-drag="r2"><path d="M220 295H540" stroke="#395772" stroke-width="5"/><circle class="labplus-drag-handle" cx="${220+(v.r2-1)/29*320}" cy="295" r="18" fill="#67c7ff"/></g></svg>`;}
    if(active==="divider"){
      const s=Number(v.sensor),lab=s===0?"R₂":s===1?"NTC":"LDR";return `<svg viewBox="0 0 760 340"><path d="M350 50V290" stroke="#7f9db7" stroke-width="5"/><rect x="295" y="80" width="110" height="62" rx="12" fill="#d9a464"/><text x="333" y="118" fill="#07111f" font-size="19" font-weight="800">R₁</text><rect x="295" y="195" width="110" height="62" rx="12" fill="#67c7ff"/><text x="325" y="233" fill="#07111f" font-size="19" font-weight="800">${lab}</text><path d="M350 170H610" stroke="#63d9a4" stroke-width="5"/><text x="500" y="150" fill="#63d9a4" font-size="19">Vout</text><g class="labplus-drag" data-drag="stimulus"><path d="M90 285H260" stroke="#395772" stroke-width="5"/><circle class="labplus-drag-handle" cx="${90+v.stimulus/100*170}" cy="285" r="18" fill="#ffd56a"/></g><text x="88" y="255" fill="#ffd56a" font-size="16">${s===2?"light intensity":"temperature / stimulus"}</text>${s===2?`<g transform="translate(110 105)"><circle cx="45" cy="45" r="30" fill="#ffd56a"/><g stroke="#ffd56a" stroke-width="5"><path d="M45 0V-25M45 90v25M0 45h-25M90 45h25"/></g></g>`:`<g transform="translate(135 105)"><rect x="25" y="0" width="22" height="95" rx="11" fill="#dfeaf3"/><circle cx="36" cy="100" r="28" fill="#ff8b64"/></g>`}</svg>`;}
    const switchClosed=Number(v.switchOn)===1;return `<svg viewBox="0 0 760 340"><path d="M90 105H670V245H90Z" stroke="#7f9db7" stroke-width="4" fill="none"/><g><rect x="85" y="130" width="120" height="90" rx="14" fill="#102b43" stroke="#63d9a4" stroke-width="4"/><text x="108" y="166" fill="#dff5e9" font-size="19">ε = ${fmt(v.emf)} V</text><text x="108" y="196" fill="#dff5e9" font-size="17">r = ${fmt(v.r)} Ω</text></g><rect x="475" y="145" width="130" height="60" rx="12" fill="#d9a464"/><text x="505" y="181" fill="#07111f" font-size="18" font-weight="800">R = ${fmt(v.load)} Ω</text><g transform="translate(295 75)"><path d="M0 30h45" stroke="#7f9db7" stroke-width="4"/><path d="M45 30l${switchClosed?"45 0":"45 -28"}" stroke="#ffd56a" stroke-width="5"/><circle cx="45" cy="30" r="6" fill="#ffd56a"/><circle cx="92" cy="30" r="6" fill="#ffd56a"/><text x="5" y="5" fill="#ffd56a" font-size="15">switch</text></g>${ammeter}${voltmeter}<g class="labplus-drag" data-drag="load"><path d="M245 300H525" stroke="#395772" stroke-width="5"/><circle class="labplus-drag-handle" cx="${245+(v.load-.5)/24.5*280}" cy="300" r="18" fill="#67c7ff"/></g></svg>`;
  }

  function renderControls(){ensureState();const v=state[active];$("#lpControls").innerHTML=cfg[active].controls.map(c=>{
    if(c.type==="select")return `<div class="labplus-control"><label><span>${c.label}</span></label><select data-lp-control="${c.k}">${c.options.map(o=>`<option value="${o[0]}" ${String(v[c.k])===String(o[0])?"selected":""}>${o[1]}</option>`).join("")}</select></div>`;
    return `<div class="labplus-control"><label><span>${c.label}</span><strong id="lpOut-${c.k}">${fmt(Number(v[c.k]))} ${c.u||""}</strong></label><input type="range" min="${c.min}" max="${c.max}" step="${c.step}" value="${v[c.k]}" data-lp-control="${c.k}" ${frozen?"disabled":""}></div>`;
  }).join("");}

  function renderLearning(){const c=cfg[active],out=calc();let html="";
    if(mode==="explore")html=`<h4>Explore mode</h4><p>Manipulate the equipment directly or use the controls. Capture several readings and look for a relationship.</p><div class="labplus-chip-row"><span class="labplus-chip">Change one variable</span><span class="labplus-chip">Observe</span><span class="labplus-chip">Explain</span></div>`;
    if(mode==="predict")html=`<h4>Predict → Test → Explain</h4><p><strong>${c.prediction}</strong></p><input type="text" id="lpPrediction" placeholder="Write your prediction..."><textarea id="lpExplanation" placeholder="After testing, explain the physics..."></textarea><button class="button" id="lpCheckPrediction">Check prediction</button><div id="lpModeFeedback"></div>`;
    if(mode==="investigate")html=`<h4>Investigation mode</h4><p><strong>${c.investigate}</strong></p><label class="labplus-mini">Independent variable<input type="text" placeholder="What will you change?"></label><label class="labplus-mini">Dependent variable<input type="text" placeholder="What will you measure?"></label><label class="labplus-mini">Control variables<textarea placeholder="What must stay constant, and why?"></textarea></label><p class="labplus-mini">Collect at least five readings, then use the graph and best-fit tool.</p>`;
    if(mode==="challenge")html=`<h4>Challenge mode</h4><p><strong>${c.challenge.q}</strong></p><input type="number" step="any" id="lpChallengeAnswer" placeholder="Numerical answer"><button class="button" id="lpCheckChallenge">Check</button><div id="lpModeFeedback"></div>`;
    $("#lpLearning").innerHTML=html;
  }

  function meterText(out){if(meter==="V")return {v:out.meterV,u:"V",copy:"Voltmeter mode: connect across two points or a component."};if(meter==="A")return {v:out.meterA,u:"A",copy:"Ammeter mode: current through the selected circuit path."};return {v:out.meterR,u:"Ω",copy:"Resistance mode: displays the effective resistance represented by the current setup."};}

  function renderReadings(){const o=calc();const pairs=active==="resistivity"?[["Length",`${fmt(o.length)} m`],["Current",`${fmt(o.current)} A`],["Resistance",`${fmt(o.resistance)} Ω`],["ρ",`${fmt(o.rho)} Ω m`]]:active==="internal"?[["Current",`${fmt(o.current)} A`],["Terminal p.d.",`${fmt(o.terminal)} V`],["Lost volts",`${fmt(o.lost)} V`],["Load",`${fmt(o.load)} Ω`]]:active==="divider"?[["Stimulus",`${fmt(o.stimulus)} %`],["Vout",`${fmt(o.vout)} V`],["Current",`${fmt(o.current,5)} A`],["Sensor R",`${fmt(o.resistance)} Ω`]]:[["Current",`${fmt(o.current)} A`],["p.d.",`${fmt(o.voltage)} V`],["Resistance",`${fmt(o.resistance)} Ω`],["Result",o.main]];$("#lpReadings").innerHTML=pairs.map(p=>`<div class="labplus-reading"><strong>${hideValues?"?":p[1]}</strong><span>${p[0]}</span></div>`).join("");const m=meterText(o),face=$("#lpMeterFace");face.textContent=`${fmt(m.v)} ${m.u}`;face.classList.toggle("hidden-reading",hideValues);$("#lpMeterCopy").textContent=m.copy;}

  function renderTable(){const c=cfg[active];$("#lpTableHead").innerHTML=`<tr><th>#</th><th>${c.xLabel}</th><th>${c.yLabel}</th><th>Meter</th></tr>`;$("#lpTableBody").innerHTML=data.map((d,i)=>`<tr><td>${i+1}</td><td>${fmt(d.x)}</td><td>${fmt(d.y)}</td><td>${d.meter}</td></tr>`).join("");drawGraph();}

  function graphFit(){if(data.length<2)return null;let sx=0,sy=0,sxx=0,sxy=0;for(const p of data){sx+=p.x;sy+=p.y;sxx+=p.x*p.x;sxy+=p.x*p.y;}const n=data.length,den=n*sxx-sx*sx;if(Math.abs(den)<1e-12)return null;const m=(n*sxy-sx*sy)/den,b=(sy-m*sx)/n;return {m,b};}
  let showFit=false;
  function drawGraph(){const canvas=$("#lpGraph");if(!canvas)return;const r=canvas.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);canvas.width=Math.max(1,r.width*dpr);canvas.height=Math.max(1,r.height*dpr);const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);const w=r.width,h=r.height;ctx.clearRect(0,0,w,h);ctx.fillStyle="#06111e";ctx.fillRect(0,0,w,h);const pad={l:50,r:16,t:18,b:38};ctx.strokeStyle="#587896";ctx.lineWidth=1;ctx.strokeRect(pad.l,pad.t,w-pad.l-pad.r,h-pad.t-pad.b);ctx.fillStyle="#bcd2e7";ctx.font="12px system-ui";ctx.fillText(cfg[active].xLabel,w-95,h-10);ctx.save();ctx.translate(14,105);ctx.rotate(-Math.PI/2);ctx.fillText(cfg[active].yLabel,0,0);ctx.restore();if(!data.length){ctx.fillStyle="#7691aa";ctx.font="14px system-ui";ctx.fillText("Capture readings to build the graph",pad.l+20,h/2);return;}let xs=data.map(d=>d.x),ys=data.map(d=>d.y);let xmin=Math.min(...xs),xmax=Math.max(...xs),ymin=Math.min(...ys),ymax=Math.max(...ys);if(xmin===xmax){xmin-=1;xmax+=1;}if(ymin===ymax){ymin-=1;ymax+=1;}const dx=(xmax-xmin)*.12||1,dy=(ymax-ymin)*.12||1;xmin-=dx;xmax+=dx;ymin-=dy;ymax+=dy;const xp=x=>pad.l+(x-xmin)/(xmax-xmin)*(w-pad.l-pad.r),yp=y=>pad.t+(ymax-y)/(ymax-ymin)*(h-pad.t-pad.b);ctx.strokeStyle="rgba(110,145,180,.16)";for(let i=1;i<5;i++){const xx=pad.l+i*(w-pad.l-pad.r)/5,yy=pad.t+i*(h-pad.t-pad.b)/5;ctx.beginPath();ctx.moveTo(xx,pad.t);ctx.lineTo(xx,h-pad.b);ctx.stroke();ctx.beginPath();ctx.moveTo(pad.l,yy);ctx.lineTo(w-pad.r,yy);ctx.stroke();}ctx.fillStyle="#67c7ff";for(const p of data){ctx.beginPath();ctx.arc(xp(p.x),yp(p.y),5,0,Math.PI*2);ctx.fill();}if(showFit){const f=graphFit();if(f){ctx.strokeStyle="#63d9a4";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(xp(xmin),yp(f.m*xmin+f.b));ctx.lineTo(xp(xmax),yp(f.m*xmax+f.b));ctx.stroke();$("#lpGraphInfo").textContent=`Best fit: gradient ${fmt(f.m)} · intercept ${fmt(f.b)}`;}}}

  function renderBoard(){ensureState();$("#lpTitle").textContent=cfg[active].title;$("#lpHint").textContent=cfg[active].hint;const st=$("#lpStage");st.classList.toggle("labplus-frozen",frozen);st.innerHTML=equipmentSvg()+`<div class="labplus-annotation ${annotate?"visible":""}" id="lpAnnotation"></div><div class="labplus-crosshair"></div>`;bindDrag();renderReadings();}
  function renderAll(){active=activeFromOriginal();ensureState();data=[];showFit=false;$("#lpMicro").textContent=`Microscopic view: ${micro?"on":"off"}`;renderBoard();renderControls();renderLearning();renderTable();$$('[data-lp-tool]').forEach(b=>{const k=b.dataset.lpTool;b.classList.toggle("active",k==="uncertainty"?uncertainty:k==="freeze"?frozen:k==="hide"?hideValues:annotate);});}

  function updateControl(k,val){ensureState();const conf=cfg[active].controls.find(c=>c.k===k);state[active][k]=conf?.type==="select"?Number(val):Number(val);const out=$("#lpOut-"+k);if(out&&conf)out.textContent=`${fmt(Number(val))} ${conf.u||""}`;renderBoard();}

  function bindDrag(){if(frozen)return;const el=$("#lpStage [data-drag]");if(!el)return;const key=el.dataset.drag,conf=cfg[active].controls.find(c=>c.k===key);if(!conf||conf.type==="select")return;const stage=$("#lpStage");let down=false;const move=e=>{if(!down)return;const r=stage.getBoundingClientRect();const x=clamp((e.clientX-r.left)/r.width,0,1);let val=conf.min+x*(conf.max-conf.min);val=Math.round(val/conf.step)*conf.step;val=clamp(val,conf.min,conf.max);state[active][key]=val;const input=$(`[data-lp-control="${key}"]`);if(input)input.value=val;renderControls();renderBoard();};el.addEventListener("pointerdown",e=>{down=true;el.setPointerCapture?.(e.pointerId);move(e);});stage.addEventListener("pointermove",move);stage.addEventListener("pointerup",()=>down=false,{once:true});}

  function capture(){const o=calc(),c=cfg[active];const m=meterText(o);data.push({x:Number(o[c.x]),y:Number(o[c.y]),meter:`${fmt(m.v)} ${m.u}`});renderTable();}

  function checkPrediction(){const t=$("#lpPrediction")?.value.trim().toLowerCase()||"";const ans=cfg[active].predictionAnswer.toLowerCase(),ok=t.includes(ans)||((ans==="decreases"||ans==="increases"||ans==="doubles")&&t.includes(ans.slice(0,-1)));const f=$("#lpModeFeedback");if(f){f.className=`labplus-feedback ${ok?"good":"bad"}`;f.textContent=ok?"Prediction is consistent with the model. Now use your test result to explain why.":`Look again at the relationship and test it before revising your prediction. Expected direction: ${ans}.`;}}
  function checkChallenge(){const val=Number($("#lpChallengeAnswer")?.value),q=cfg[active].challenge,ok=Number.isFinite(val)&&Math.abs(val-q.a)<=Math.max(Math.abs(q.a)*q.tol,1e-12);const f=$("#lpModeFeedback");if(f){f.className=`labplus-feedback ${ok?"good":"bad"}`;f.textContent=ok?`Correct: ${fmt(q.a)} ${q.u}.`:`Not yet. Check the equation, units and substitution, then try again.`;}}

  function bindGlobal(){document.addEventListener("click",e=>{const b=e.target.closest("button");if(!b)return;if(b.classList.contains("sim-tab")){setTimeout(()=>{active=activeFromOriginal();state[active]??=defaults(active);renderAll();},20);return;}if(b.dataset.lpMode){mode=b.dataset.lpMode;$$('[data-lp-mode]').forEach(x=>x.classList.toggle("active",x===b));renderLearning();return;}if(b.dataset.lpMeter){meter=b.dataset.lpMeter;$$('[data-lp-meter]').forEach(x=>x.classList.toggle("active",x===b));renderReadings();return;}if(b.dataset.lpTool){const k=b.dataset.lpTool;if(k==="uncertainty")uncertainty=!uncertainty;if(k==="freeze")frozen=!frozen;if(k==="hide")hideValues=!hideValues;if(k==="annotate")annotate=!annotate;renderAll();return;}if(b.id==="lpCapture"){capture();return;}if(b.id==="lpReset"){state[active]=defaults(active);data=[];showFit=false;renderAll();return;}if(b.id==="lpMicro"){micro=!micro;renderBoard();b.textContent=`Microscopic view: ${micro?"on":"off"}`;return;}if(b.id==="lpClearData"){data=[];showFit=false;renderTable();return;}if(b.id==="lpBestFit"){showFit=!showFit;drawGraph();return;}if(b.id==="lpCheckPrediction"){checkPrediction();return;}if(b.id==="lpCheckChallenge"){checkChallenge();return;}});
    document.addEventListener("input",e=>{const k=e.target.dataset.lpControl;if(k)updateControl(k,e.target.value);});document.addEventListener("change",e=>{const k=e.target.dataset.lpControl;if(k)updateControl(k,e.target.value);});window.addEventListener("resize",()=>drawGraph());
    const canvas=()=>$("#lpGraph");document.addEventListener("pointerdown",e=>{if(e.target!==canvas()||!data.length)return;const r=e.target.getBoundingClientRect();let best=null,dist=Infinity;for(const p of data){const d=Math.abs((e.clientX-r.left)/r.width-.5)+Math.random()*1e-9;if(d<dist){best=p;dist=d;}}if(best)$("#lpGraphInfo").textContent=`Selected reading: x = ${fmt(best.x)}, y = ${fmt(best.y)}`;});
  }

  function boot(){inject();active=activeFromOriginal();state[active]=defaults(active);renderAll();bindGlobal();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();