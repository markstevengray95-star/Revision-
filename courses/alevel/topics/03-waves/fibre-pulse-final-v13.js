(()=>{
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=(v,d=2)=>Number.isFinite(v)?Number(v.toFixed(d)).toString():"—";
  let animId=0, animStart=0;

  const studioIsFibre=()=>!!document.querySelector("[data-studio='fibre'].active");
  const ctl=name=>document.querySelector(`#studioBody [data-studio-control='${name}']`);
  const toggle=name=>name==="modal"?$("#modalToggle"):name==="material"?$("#materialToggle"):null;
  const num=(name,fallback)=>{const e=ctl(name),n=Number(e?.value);return Number.isFinite(n)?n:fallback;};
  const enabled=(name,fallback=true)=>{const e=toggle(name)||ctl(name);if(!e)return fallback;return e.type==="checkbox"?e.checked:Number(e.value)!==0;};
  const setCtl=(name,value)=>{const e=toggle(name)||ctl(name);if(!e)return;if(e.type==="checkbox")e.checked=!!value;else e.value=value;e.dispatchEvent(new Event("input",{bubbles:true}));e.dispatchEvent(new Event("change",{bubbles:true}));};

  function model(){
    const lengthM=Math.max(100,num("length",1200));
    const lengthKm=lengthM/1000;
    const modes=Math.max(1,num("modes",5));
    const spectral=Math.max(0,num("spectral",3));
    const modalOn=enabled("modal",true);
    const materialOn=enabled("material",true);
    const alpha=Math.max(0,num("absorption",0.18));
    const inputWidth=Math.max(2,Number($("#fibreInputWidthV13")?.value||12));
    const bitRate=Math.max(1,Number($("#fibreBitRateV13")?.value||40));
    const modalBroad=modalOn?(modes-1)*1.15*lengthKm:0;
    const materialBroad=materialOn?spectral*1.35*lengthKm:0;
    const outputWidth=Math.sqrt(inputWidth**2+modalBroad**2+materialBroad**2);
    const lossDb=alpha*lengthKm;
    const powerFrac=Math.pow(10,-lossDb/10);
    const bitPeriod=1000/bitRate;
    const overlap=outputWidth/bitPeriod;
    let quality="Clear pulses";
    if(overlap>0.75)quality="Severe overlap";else if(overlap>0.5)quality="Overlap likely";else if(overlap>0.32)quality="Reduced margin";
    return {lengthM,lengthKm,modes,spectral,modalOn,materialOn,alpha,inputWidth,bitRate,modalBroad,materialBroad,outputWidth,lossDb,powerFrac,bitPeriod,overlap,quality};
  }

  function ensure(){
    if(!studioIsFibre())return;
    const body=$("#studioBody");if(!body||$("#fibrePulseFinalV13",body))return;
    const stage=$(".studio-stage",body);if(!stage)return;
    const panel=document.createElement("section");panel.id="fibrePulseFinalV13";panel.className="fibre-final-v13";
    panel.innerHTML=`
      <div class="fibre-final-head">
        <div><span class="eyebrow">Final fibre upgrade</span><h3>Pulse transmission analyser</h3><p class="muted">See how modal dispersion, material dispersion and absorption change a digital pulse separately and together.</p></div>
        <button class="button primary" id="fibreSendPulseV13">Send pulse</button>
      </div>
      <div class="fibre-final-grid">
        <div class="fibre-final-canvas-wrap"><canvas id="fibrePulseCanvasV13" class="fibre-final-canvas"></canvas></div>
        <div class="fibre-final-controls">
          <label class="field"><span>Input pulse width</span><input id="fibreInputWidthV13" type="range" min="4" max="30" step="1" value="12"><output id="fibreInputWidthOutV13">12 ns</output></label>
          <label class="field"><span>Bit rate</span><input id="fibreBitRateV13" type="range" min="5" max="100" step="5" value="40"><output id="fibreBitRateOutV13">40 Mbit s⁻¹</output></label>
          <div class="fibre-isolate-row"><button class="button" data-fibre-preset="modal">Modal only</button><button class="button" data-fibre-preset="material">Material only</button><button class="button" data-fibre-preset="clean">No dispersion</button><button class="button" data-fibre-preset="all">Both</button></div>
          <p class="small muted">The numerical broadening model uses relative teaching coefficients so the cause-and-effect is visible. Use it for comparison and explanation, not as a calibrated telecoms design tool.</p>
        </div>
      </div>
      <div class="fibre-metrics-v13" id="fibreMetricsV13"></div>
      <div class="fibre-explain-v13" id="fibreExplainV13"></div>`;
    stage.appendChild(panel);
    $("#fibreInputWidthV13").addEventListener("input",draw);
    $("#fibreBitRateV13").addEventListener("input",draw);
    $("#fibreSendPulseV13").addEventListener("click",sendPulse);
    panel.querySelectorAll("[data-fibre-preset]").forEach(b=>b.addEventListener("click",()=>preset(b.dataset.fibrePreset)));
    draw();
  }

  function preset(p){
    if(p==="modal"){setCtl("modal",true);setCtl("material",false);} 
    if(p==="material"){setCtl("modal",false);setCtl("material",true);} 
    if(p==="clean"){setCtl("modal",false);setCtl("material",false);} 
    if(p==="all"){setCtl("modal",true);setCtl("material",true);} 
    draw();
  }

  function sendPulse(){
    cancelAnimationFrame(animId);animStart=performance.now();
    const btn=$("#fibreSendPulseV13");if(btn)btn.textContent="Pulse travelling…";
    const tick=t=>{if(!studioIsFibre()||!$("#fibrePulseCanvasV13")){cancelAnimationFrame(animId);return;}const p=clamp((t-animStart)/1500,0,1);draw(p);if(p<1)animId=requestAnimationFrame(tick);else{if(btn)btn.textContent="Send pulse";draw(1);}};
    animId=requestAnimationFrame(tick);
  }

  function pulse(ctx,x0,y0,width,height,amp,color){
    ctx.strokeStyle=color;ctx.lineWidth=2.5;ctx.beginPath();
    let first=true;
    for(let x=-width*2.8;x<=width*2.8;x+=2){const g=Math.exp(-.5*(x/width)**2);const y=y0-height*amp*g;const px=x0+x;if(first){ctx.moveTo(px,y);first=false;}else ctx.lineTo(px,y);}ctx.stroke();
  }

  function draw(progress=null){
    if(!studioIsFibre())return;const c=$("#fibrePulseCanvasV13");if(!c)return;
    const m=model();
    const r=c.getBoundingClientRect();if(!r.width)return;const d=Math.min(devicePixelRatio||1,1.6),w=r.width,h=r.height||330;
    const W=Math.round(w*d),H=Math.round(h*d);if(c.width!==W||c.height!==H){c.width=W;c.height=H;}
    const x=c.getContext("2d");x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);x.fillStyle="#06111d";x.fillRect(0,0,w,h);
    const left=34,right=w-34,top=42,bottom=148,coreTop=67,coreBottom=123;
    x.fillStyle="#153653";x.fillRect(left,top,right-left,bottom-top);x.fillStyle="#08233a";x.fillRect(left,coreTop,right-left,coreBottom-coreTop);
    x.fillStyle="#9db5c9";x.font="700 11px system-ui";x.fillText("cladding (lower n)",left+8,top+16);x.fillText("core (higher n)",left+8,coreTop+17);
    const rayColors=["#67c7ff","#9a86ff","#63d9a4"];const rays=Math.min(3,Math.max(1,Math.round(m.modes/2)));
    for(let q=0;q<rays;q++){x.strokeStyle=rayColors[q];x.lineWidth=2;x.beginPath();let px=left+8,py=(coreTop+coreBottom)/2+(q-1)*5;x.moveTo(px,py);const bounces=q+1;for(let j=1;j<=bounces*2+1;j++){px=left+8+(right-left-16)*j/(bounces*2+1);py=j%2?coreTop+5+q*3:coreBottom-5-q*3;x.lineTo(px,py);}x.stroke();}
    if(progress!==null){const px=left+8+(right-left-16)*progress;x.fillStyle="#ffd56a";x.shadowColor="#ffd56a";x.shadowBlur=12;x.beginPath();x.arc(px,(coreTop+coreBottom)/2,7,0,Math.PI*2);x.fill();x.shadowBlur=0;}
    const yBase=h-62,graphTop=184;x.strokeStyle="#29445d";x.lineWidth=1;x.beginPath();x.moveTo(28,yBase);x.lineTo(w-28,yBase);x.stroke();
    x.fillStyle="#9db5c9";x.font="700 11px system-ui";x.fillText("INPUT",32,graphTop);x.fillText("OUTPUT",w*.56,graphTop);
    const inX=w*.25,outX=w*.75;const scale=2.1;const inWidth=clamp(m.inputWidth*scale,10,60),outWidth=clamp(m.outputWidth*scale,10,95);
    pulse(x,inX,yBase,inWidth,78,1,"#63d9a4");pulse(x,outX,yBase,outWidth,78,Math.sqrt(m.powerFrac),"#ffd56a");
    const marker=clamp(m.bitPeriod*1.6,28,150);x.strokeStyle="rgba(103,199,255,.6)";x.setLineDash([5,4]);x.beginPath();x.moveTo(outX-marker/2,yBase+8);x.lineTo(outX+marker/2,yBase+8);x.stroke();x.setLineDash([]);x.fillStyle="#9db5c9";x.font="600 10px system-ui";x.fillText("one bit period",outX-marker/2,yBase+24);
    const metrics=$("#fibreMetricsV13");if(metrics)metrics.innerHTML=[
      ["Input width",`${fmt(m.inputWidth,0)} ns`],["Output width",`${fmt(m.outputWidth,1)} ns`],["Modal broadening",`${fmt(m.modalBroad,1)} ns`],["Material broadening",`${fmt(m.materialBroad,1)} ns`],["Loss",`${fmt(m.lossDb,2)} dB`],["Power remaining",`${fmt(m.powerFrac*100,1)}%`],["Bit period",`${fmt(m.bitPeriod,1)} ns`],["Pulse quality",m.quality]
    ].map(([a,b])=>`<div><strong>${b}</strong><span>${a}</span></div>`).join("");
    const explain=$("#fibreExplainV13");if(explain){const parts=[];if(m.modalOn)parts.push("Modal dispersion broadens the pulse because different guided paths have different path lengths.");if(m.materialOn)parts.push("Material dispersion broadens the pulse because different wavelengths travel at slightly different speeds in the fibre material.");if(!m.modalOn&&!m.materialOn)parts.push("With dispersion switched off, the pulse keeps its width in this teaching model.");parts.push(`Absorption reduces signal power; it changes amplitude, not pulse width. At ${fmt(m.bitRate,0)} Mbit s⁻¹ the bit period is ${fmt(m.bitPeriod,1)} ns, so the current output is classified as “${m.quality}”.`);explain.innerHTML=`<strong>What the model shows</strong><p>${parts.join(" ")}</p>`;}
    const i=$("#fibreInputWidthOutV13");if(i)i.textContent=`${fmt(m.inputWidth,0)} ns`;const b=$("#fibreBitRateOutV13");if(b)b.textContent=`${fmt(m.bitRate,0)} Mbit s⁻¹`;
  }

  function onDocumentClick(e){
    const tab=e.target.closest?.("[data-studio]");if(tab)setTimeout(()=>{if(tab.dataset.studio==="fibre")ensure();else cancelAnimationFrame(animId);},70);
  }
  function onInput(e){if(studioIsFibre()&&e.target.closest?.("#studioBody")&&(e.target.matches("[data-studio-control]")||e.target.matches("#modalToggle,#materialToggle")))requestAnimationFrame(()=>draw());}
  document.addEventListener("click",onDocumentClick);
  document.addEventListener("input",onInput);
  document.addEventListener("change",onInput);
  window.addEventListener("resize",()=>{if(studioIsFibre())requestAnimationFrame(()=>draw());});
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(ensure,450));else setTimeout(ensure,450);
})();