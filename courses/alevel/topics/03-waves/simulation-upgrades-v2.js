(()=>{
  "use strict";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const fmt=(v,d=3)=>Number.isFinite(v)?Number(v.toFixed(d)).toString():"—";
  let simId="progressive",probe={x:.62,y:.5,angle:0},overlay,ctx,dpr=1;

  const detail={
    progressive:{
      title:"Progressive wave probe",
      notice:"Drag the probe along the wave. The panel converts position into phase and shows how a displacement–distance snapshot connects to an oscilloscope trace.",
      relations:["v = fλ","T = 1/f","Δφ = 2πΔx/λ"],
      variables:[["A","maximum displacement"],["f","oscillations per second"],["λ","distance between points in phase"],["v","propagation speed"]],
      prompts:["Put the probe one wavelength farther along the wave. What happens to phase?","Double f without changing λ. What happens to v in this model?","Find two positions separated by λ/2 and compare their instantaneous displacements."]
    },
    polarisation:{
      title:"Polarisation analyser",
      notice:"Drag around the centre of the model to rotate the analyser directly. Compare the selected plane with the transverse oscillation direction.",
      relations:["transverse: oscillation ⟂ propagation","longitudinal: oscillation ∥ propagation","polarisation is evidence of transverse behaviour"],
      variables:[["angle","analyser orientation"],["mode","transverse or longitudinal model"]],
      prompts:["Rotate the analyser by 90° and describe the qualitative change.","Switch to the longitudinal model. Why is a polarising plane not meaningful in the same way?","Explain why aligned radio aerials give the strongest received signal."]
    },
    standing:{
      title:"Node and antinode probe",
      notice:"Drag the probe along the string. The app calculates the local stationary-wave amplitude factor and identifies positions close to nodes and antinodes.",
      relations:["L = nλ/2","fₙ = nv/(2L)","v = √(T/μ)","node spacing = λ/2"],
      variables:[["n","harmonic number"],["L","vibrating length"],["T","tension"],["μ","mass per unit length"]],
      prompts:["Drag to a node, then to the nearest antinode. Estimate the separation as a fraction of λ.","Increase tension and predict the resonant frequency change.","Increase harmonic number and count the extra nodes."]
    },
    interference:{
      title:"Movable interference detector",
      notice:"Drag anywhere over the field to reposition the detector. The px and py controls update automatically so the main model responds immediately.",
      relations:["constructive: Δ = nλ","destructive: Δ = (n+1/2)λ","Δφ = 2πΔ/λ"],
      variables:[["Δ","path difference"],["λ","wavelength"],["phase","relative stage of the two waves"]],
      prompts:["Find a position of maximum response and record the path difference.","Move to the nearest minimum. How much has path difference changed?","Increase source separation and describe how the interference field changes."]
    },
    doubleSlit:{
      title:"Young’s slit screen probe",
      notice:"Drag vertically across the screen. The probe estimates fringe order, relative intensity and position using the current wavelength, slit separation and screen distance.",
      relations:["w = λD/s","bright: Δ = nλ","dark: Δ = (n+1/2)λ"],
      variables:[["λ","wavelength"],["D","screen distance"],["s","slit separation"],["w","fringe spacing"]],
      prompts:["Increase D and measure how fringe spacing changes.","Increase s and explain why fringes move closer together.","Compare 450 nm and 650 nm light using the same geometry."]
    },
    diffraction:{
      title:"Single-slit intensity probe",
      notice:"Drag the probe across the pattern. The app calculates an illustrative sinc² intensity and first-minimum angle so the visual spreading can be measured rather than only observed.",
      relations:["greater λ → greater spreading","smaller slit width a → greater spreading","first minimum approximately sinθ = λ/a"],
      variables:[["λ","wavelength"],["a","slit width"],["θ","observation angle"]],
      prompts:["Halve the slit width and compare the first-minimum angle.","Increase wavelength and explain why the central maximum broadens.","Find the first minimum with the probe, then compare with λ/a."]
    },
    grating:{
      title:"Grating angle probe",
      notice:"Drag the detector direction around the grating. The panel compares the measured angle with the allowed diffraction orders for the current line density and wavelength.",
      relations:["d = 1/N","d sinθ = nλ","order exists only if nλ ≤ d"],
      variables:[["N","line density"],["d","grating spacing"],["n","order"],["θ","diffraction angle"]],
      prompts:["Find the first-order angle by dragging the probe, then compare it with the calculated value.","Increase line density and explain why the angle changes.","Find the largest allowed order before sinθ would exceed 1."]
    },
    refraction:{
      title:"Direct ray control",
      notice:"Drag the incident-ray handle around the point of incidence. The incidence-angle slider updates directly and the model switches into total internal reflection when the critical condition is exceeded.",
      relations:["n = c/v","n₁sinθ₁ = n₂sinθ₂","sinθc = n₂/n₁ for n₁>n₂"],
      variables:[["n₁","incident-medium refractive index"],["n₂","second-medium refractive index"],["θ₁","incidence angle"],["θc","critical angle"]],
      prompts:["Set n₁>n₂ and drag slowly through the critical angle.","Reverse the indices. Why can TIR no longer occur in that direction?","Explain why frequency stays constant while wavelength changes."]
    },
    fibre:{
      title:"Fibre signal inspector",
      notice:"Drag along the fibre to inspect progress through the link. Use the switches below to isolate modal dispersion, material dispersion and absorption.",
      relations:["core n > cladding n","modal dispersion → different path lengths","material dispersion → wavelength-dependent speed","absorption → reduced amplitude"],
      variables:[["length","fibre length"],["modal","path-spread setting"],["spectral","wavelength-spread setting"],["absorption","loss per kilometre"]],
      prompts:["Increase length and compare the output pulse width.","Set modal spread to zero and isolate material dispersion.","Increase absorption while keeping dispersion fixed. What changes: width, amplitude, or both?"]
    }
  };

  function activeId(){return $("#simTabs .sim-tab.active")?.dataset.sim || $("#simTabs [data-sim].active")?.dataset.sim || simId;}
  function control(name){return $(`[data-sim-control='${name}']`);}
  function setControl(name,value){const el=control(name);if(!el)return;const min=Number(el.min),max=Number(el.max);el.value=clamp(value,Number.isFinite(min)?min:-Infinity,Number.isFinite(max)?max:Infinity);el.dispatchEvent(new Event("input",{bubbles:true}));el.dispatchEvent(new Event("change",{bubbles:true}));}
  function value(name,fallback=0){const el=control(name);const v=Number(el?.value);return Number.isFinite(v)?v:fallback;}

  function install(){
    const wrap=$(".viewer-wrap"), side=$(".lab-side"); if(!wrap||!side||$("#simDetailOverlay"))return;
    wrap.style.position="relative";
    overlay=document.createElement("canvas");overlay.id="simDetailOverlay";overlay.className="sim-detail-overlay";wrap.appendChild(overlay);ctx=overlay.getContext("2d");
    side.insertAdjacentHTML("afterbegin",`<article class="panel sim-detail-card" id="simDetailCard"><div class="sim-detail-head"><div><span class="eyebrow">Direct interaction</span><h3 id="simDetailTitle"></h3></div><span class="mini-badge good">drag on model</span></div><p class="muted" id="simDetailNotice"></p><div class="sim-detail-readout" id="simDetailReadout"></div><div class="sim-detail-relations" id="simDetailRelations"></div><details class="sim-detail-more" open><summary>Variables and meanings</summary><div id="simDetailVariables"></div></details><details class="sim-detail-more"><summary>Investigation prompts</summary><ol id="simDetailPrompts"></ol></details></article>`);
    overlay.addEventListener("pointerdown",pointerDown);overlay.addEventListener("pointermove",pointerMove);overlay.addEventListener("pointerup",()=>probe.drag=false);overlay.addEventListener("pointercancel",()=>probe.drag=false);
    $("#measureToggle")?.addEventListener("click",()=>setTimeout(syncPointerMode,0));
    $("#simTabs")?.addEventListener("click",()=>setTimeout(()=>{simId=activeId();probe.x=.62;probe.y=.5;renderCard();draw();},30));
    $("#simControls")?.addEventListener("input",()=>{renderReadout();draw();});
    window.addEventListener("resize",resize);simId=activeId();renderCard();resize();requestAnimationFrame(loop);
  }
  function syncPointerMode(){if(!overlay)return;overlay.style.pointerEvents=$("#measureToggle")?.classList.contains("active")?"none":"auto";}
  function resize(){if(!overlay)return;const r=overlay.getBoundingClientRect();if(!r.width||!r.height)return;dpr=Math.min(devicePixelRatio||1,2);overlay.width=Math.round(r.width*dpr);overlay.height=Math.round(r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  function pos(e){const r=overlay.getBoundingClientRect();return{x:clamp((e.clientX-r.left)/r.width,0,1),y:clamp((e.clientY-r.top)/r.height,0,1),w:r.width,h:r.height};}
  function pointerDown(e){if($("#measureToggle")?.classList.contains("active"))return;probe.drag=true;overlay.setPointerCapture?.(e.pointerId);applyPointer(pos(e));}
  function pointerMove(e){if(!probe.drag)return;applyPointer(pos(e));}
  function applyPointer(p){probe.x=p.x;probe.y=p.y;const id=activeId();
    if(id==="polarisation"){const dx=p.x-.5,dy=.5-p.y;const ang=Math.abs(Math.atan2(dy,dx)*180/Math.PI);setControl("angle",clamp(ang,0,90));}
    if(id==="interference"){setControl("px",clamp(p.x,.40,.92));setControl("py",clamp(p.y,.18,.82));}
    if(id==="refraction"){const dx=p.x-.5,dy=.5-p.y;const theta=Math.atan2(Math.abs(dx),Math.max(.02,Math.abs(dy)))*180/Math.PI;setControl("theta",clamp(theta,0,80));}
    draw();renderReadout();
  }

  function renderCard(){const d=detail[activeId()]||detail.progressive;$("#simDetailTitle").textContent=d.title;$("#simDetailNotice").textContent=d.notice;$("#simDetailRelations").innerHTML=d.relations.map(x=>`<span class="formula-chip">${x}</span>`).join("");$("#simDetailVariables").innerHTML=d.variables.map(([a,b])=>`<div class="detail-var"><strong>${a}</strong><span>${b}</span></div>`).join("");$("#simDetailPrompts").innerHTML=d.prompts.map(x=>`<li>${x}</li>`).join("");renderReadout();}
  function renderReadout(){const h=$("#simDetailReadout");if(!h)return;const id=activeId();let rows=[];
    if(id==="progressive"){const f=value("f",1.2),lam=value("lambda",220),A=value("A",70),x=probe.x*900,phase=(2*Math.PI*x/lam)%(2*Math.PI),y=A*Math.sin(phase);rows=[["probe x",fmt(x,1)+" display px"],["phase",fmt(phase,2)+" rad"],["local displacement",fmt(y,1)+" display px"],["display v=fλ",fmt(f*lam,1)+" px s⁻¹"]];}
    if(id==="polarisation"){const a=value("angle",35),m=value("mode",0);rows=[["analyser angle",fmt(a,1)+"°"],["wave type",m<.5?"transverse":"longitudinal"],["qualitative transmission",m<.5?fmt(Math.cos(a*Math.PI/180)**2,2):"polarisation not applicable"]];}
    if(id==="standing"){const n=value("n",2),L=value("L",1.2),T=value("T",12),mu=value("mu",.006),x=probe.x*L,fac=Math.abs(Math.sin(n*Math.PI*x/L)),v=Math.sqrt(T/mu),f=n*v/(2*L),lambda=2*L/n;const label=fac<.10?"near node":fac>.90?"near antinode":"between node and antinode";rows=[["probe position",fmt(x,3)+" m"],["local amplitude factor",fmt(fac,2)+" · "+label],["λ",fmt(lambda,3)+" m"],["resonant fₙ",fmt(f,2)+" Hz"]];}
    if(id==="interference"){const lam=value("lambda",70),sep=value("sep",180),px=value("px",.72)*900,py=value("py",.52)*520,s1={x:220,y:260-sep/2},s2={x:220,y:260+sep/2},d1=Math.hypot(px-s1.x,py-s1.y),d2=Math.hypot(px-s2.x,py-s2.y),delta=Math.abs(d1-d2),phi=2*Math.PI*delta/lam,I=(1+Math.cos(phi))/2;rows=[["path difference",fmt(delta,1)+" px"],["phase difference",fmt(phi,2)+" rad"],["relative intensity",fmt(I,2)],["state",I>.85?"strong constructive":I<.15?"strong destructive":"partial interference"]];}
    if(id==="doubleSlit"){const lam=value("lambdaNm",600)*1e-9,D=value("D",2),s=value("sMm",.35)*1e-3,w=lam*D/s,y=(.5-probe.y)*10*w,order=y/w,I=Math.cos(Math.PI*order)**2;rows=[["fringe spacing",fmt(w*1000,3)+" mm"],["screen position",fmt(y*1000,2)+" mm"],["order coordinate y/w",fmt(order,2)],["relative intensity",fmt(I,2)]];}
    if(id==="diffraction"){const lam=value("lambdaNm",600)*1e-9,a=value("slitUm",40)*1e-6,theta=(probe.x-.5)*.12,beta=Math.PI*a*Math.sin(theta)/lam,I=Math.abs(beta)<1e-8?1:(Math.sin(beta)/beta)**2,first=Math.asin(clamp(lam/a,-1,1));rows=[["probe angle",fmt(theta*180/Math.PI,2)+"°"],["relative intensity",fmt(I,3)],["first-minimum angle",fmt(first*180/Math.PI,2)+"°"],["λ/a",fmt(lam/a,4)]];}
    if(id==="grating"){const lam=value("lambdaNm",600)*1e-9,N=value("linesMm",500)*1e3,d=1/N,theta=Math.atan2(Math.abs(probe.y-.5),Math.max(.01,probe.x-.12)),ncalc=d*Math.sin(theta)/lam,max=Math.floor(d/lam+1e-9);rows=[["probe angle",fmt(theta*180/Math.PI,2)+"°"],["equivalent order n",fmt(ncalc,2)],["nearest integer order",String(Math.round(ncalc))],["maximum possible order",String(max)]];}
    if(id==="refraction"){const n1=value("n1",1.5),n2=value("n2",1),th=value("theta",30)*Math.PI/180,s=n1*Math.sin(th)/n2,tir=s>1,th2=tir?NaN:Math.asin(s),crit=n1>n2?Math.asin(n2/n1):NaN;rows=[["incidence angle",fmt(th*180/Math.PI,1)+"°"],["refracted angle",tir?"TIR":fmt(th2*180/Math.PI,1)+"°"],["critical angle",Number.isFinite(crit)?fmt(crit*180/Math.PI,1)+"°":"not available for this direction"],["condition",tir?"total internal reflection":"refraction"]];}
    if(id==="fibre"){const L=value("length",1000),modal=value("modal",3),spectral=value("spectral",2),abs=value("absorption",.15),progress=probe.x,modalPart=modal*(L/1000)*progress,matPart=spectral*(L/1000)*progress,atten=Math.pow(10,-abs*(L/1000)*progress/10);rows=[["distance inspected",fmt(L*progress,0)+" m"],["modal contribution",fmt(modalPart,2)+" a.u."],["material contribution",fmt(matPart,2)+" a.u."],["remaining relative amplitude",fmt(atten*100,1)+"%"]];}
    h.innerHTML=rows.map(([a,b])=>`<div><span>${a}</span><strong>${b}</strong></div>`).join("");
  }

  function draw(){if(!overlay||!ctx)return;const r=overlay.getBoundingClientRect(),w=r.width,h=r.height;if(!w)return;ctx.clearRect(0,0,w,h);ctx.save();ctx.strokeStyle="#ffd56a";ctx.fillStyle="#07111f";ctx.lineWidth=2.5;ctx.setLineDash([7,5]);const id=activeId();
    if(id==="refraction"){const cx=w*.5,cy=h*.5,x=probe.x*w,y=probe.y*h;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();handle(cx,cy,"O");handle(x,y,"drag");}
    else if(id==="polarisation"){const cx=w*.5,cy=h*.5,R=Math.min(w,h)*.26,a=value("angle",35)*Math.PI/180;ctx.beginPath();ctx.arc(cx,cy,R,0,Math.PI*2);ctx.stroke();const x=cx+R*Math.cos(a),y=cy-R*Math.sin(a);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();handle(x,y,"drag");}
    else if(id==="interference"){const x=value("px",.72)*w,y=value("py",.52)*h;handle(x,y,"detector");}
    else if(id==="standing"){const x=probe.x*w;ctx.beginPath();ctx.moveTo(x,35);ctx.lineTo(x,h-35);ctx.stroke();handle(x,h*.5,"probe");}
    else if(id==="doubleSlit"){const y=probe.y*h;ctx.beginPath();ctx.moveTo(w*.70,y);ctx.lineTo(w-20,y);ctx.stroke();handle(w*.84,y,"screen probe");}
    else if(id==="diffraction"){const x=probe.x*w;ctx.beginPath();ctx.moveTo(x,35);ctx.lineTo(x,h-35);ctx.stroke();handle(x,h*.78,"intensity probe");}
    else if(id==="grating"){const ox=w*.20,oy=h*.5,x=probe.x*w,y=probe.y*h;ctx.beginPath();ctx.moveTo(ox,oy);ctx.lineTo(x,y);ctx.stroke();handle(x,y,"angle probe");}
    else if(id==="fibre"){const x=probe.x*w;ctx.beginPath();ctx.moveTo(x,h*.12);ctx.lineTo(x,h*.88);ctx.stroke();handle(x,h*.22,"inspect");}
    else {const x=probe.x*w,y=probe.y*h;ctx.beginPath();ctx.moveTo(x,35);ctx.lineTo(x,h-35);ctx.stroke();handle(x,y,"probe");}
    ctx.restore();renderReadout();
  }
  function handle(x,y,label){ctx.setLineDash([]);ctx.beginPath();ctx.arc(x,y,10,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle="#ffd56a";ctx.font="800 11px system-ui";ctx.textAlign="center";ctx.fillText(label,x,y-16);ctx.fillStyle="#07111f";}
  function loop(){if($("#view-lab")?.classList.contains("active-view"))draw();requestAnimationFrame(loop);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();