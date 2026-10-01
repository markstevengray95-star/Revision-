(()=>{
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  const META={
    progressive:{watch:"Watch individual particles oscillate while the phase pattern travels across the screen.",measure:"Use the probe or display to compare wavelength, frequency and wave speed.",equation:"v = fλ",accent:"#65cdfc"},
    polarisation:{watch:"Track the oscillation direction relative to the analyser axis. The propagation direction itself does not rotate.",measure:"Rotate the analyser and compare the transmitted component at 0°, 45° and 90°.",equation:"transverse displacement ⟂ propagation",accent:"#b498ff"},
    standing:{watch:"Focus on fixed nodes, moving antinodes and the opposite phase of neighbouring loops.",measure:"Measure adjacent node spacing and compare it with λ/2.",equation:"fₙ = n/(2L) √(T/μ)",accent:"#ffd167"},
    interference:{watch:"Follow the path lengths from S₁ and S₂ to the detector rather than memorising bright/dark bands.",measure:"Move P between a maximum and minimum and record the change in path difference.",equation:"constructive Δ=nλ · destructive Δ=(n+½)λ",accent:"#63d9a4"},
    doubleSlit:{watch:"Relate the screen fringes to the changing path difference from the two coherent slits.",measure:"Measure several fringe gaps and divide, just as you would in the practical.",equation:"w = λD/s",accent:"#ffcb68"},
    diffraction:{watch:"Compare aperture width with wavelength. The important idea is the ratio λ/a.",measure:"Reduce the slit width and compare the width of the central maximum.",equation:"narrower slit / longer λ → more spreading",accent:"#ff9b74"},
    grating:{watch:"Look for discrete orders rather than a continuous spread of light.",measure:"Read an order angle and test it using the grating equation.",equation:"d sinθ = nλ",accent:"#9c91ff"},
    refraction:{watch:"Use the normal, ray direction and wavefront spacing together. Frequency remains unchanged across the boundary.",measure:"Increase incidence angle until the refracted ray approaches 90°, then identify the critical condition.",equation:"n₁ sinθ₁ = n₂ sinθ₂",accent:"#6ed3ff"},
    fibre:{watch:"Separate ray guidance from pulse broadening and attenuation. They are related to different physical processes.",measure:"Change one dispersion effect at a time and compare output pulse width and amplitude.",equation:"TIR guides · dispersion broadens · absorption attenuates",accent:"#62dda4"}
  };

  function simId(){return $("#simTabs .sim-tab.active")?.dataset.sim||"progressive";}

  function ensure(){
    if($("#simVisualHudV7"))return true;
    const wrap=$(".viewer-wrap");
    if(!wrap)return false;
    wrap.insertAdjacentHTML("afterend",'<div class="sim-visual-hud-v7" id="simVisualHudV7"><div class="sim-hud-head"><span class="eyebrow">Visual guide</span><strong id="simHudEquation"></strong></div><div class="sim-hud-grid"><div><span class="sim-hud-dot watch"></span><strong>Watch</strong><p id="simHudWatch"></p></div><div><span class="sim-hud-dot measure"></span><strong>Measure</strong><p id="simHudMeasure"></p></div></div></div>');
    return true;
  }

  function update(){
    if(!ensure())return;
    const m=META[simId()]||META.progressive;
    const hud=$("#simVisualHudV7"),eq=$("#simHudEquation"),watch=$("#simHudWatch"),measure=$("#simHudMeasure");
    if(!hud||!eq||!watch||!measure)return;
    hud.style.setProperty("--sim-accent",m.accent);
    if(eq.textContent!==m.equation)eq.textContent=m.equation;
    if(watch.textContent!==m.watch)watch.textContent=m.watch;
    if(measure.textContent!==m.measure)measure.textContent=m.measure;
  }

  function bind(){
    update();
    $("#simTabs")?.addEventListener("click",()=>setTimeout(update,60));
    document.querySelector('[data-view="lab"]')?.addEventListener("click",()=>setTimeout(update,80));
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",bind,{once:true});
  else bind();
})();