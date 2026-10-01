(()=>{
  "use strict";
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const clickView=id=>document.querySelector(`[data-view='${id}']`)?.click();
  const openStudio=mode=>{clickView("studio");setTimeout(()=>document.querySelector(`[data-studio='${mode}']`)?.click(),80);};
  const openSim=id=>{clickView("lab");setTimeout(()=>document.querySelector(`[data-sim='${id}']`)?.click(),80);};

  function addPracticalLinks(){
    const sw=$(".practical-switch");if(!sw||$("#openResonanceStudio"))return;
    sw.insertAdjacentHTML("beforeend",'<button class="button" id="openResonanceStudio">Advanced RP1 · Resonance finder</button><button class="button" id="openYoungStudio">Advanced RP2 · Fringe measurement</button><button class="button" id="openGratingStudio">Advanced RP2 · Spectrometer</button>');
    $("#openResonanceStudio").onclick=()=>openStudio("resonance");
    $("#openYoungStudio").onclick=()=>openStudio("young");
    $("#openGratingStudio").onclick=()=>openStudio("spectrometer");
  }

  function addSimulationBridge(){
    const side=$(".lab-side");if(!side||$("#advancedLabBridge"))return;
    side.insertAdjacentHTML("beforeend",'<article class="panel learning-box checkpoint-box" id="advancedLabBridge"><h3>Take it further</h3><p>Switch from the rotatable 3D concept model to a measurement-led investigation with draggable instruments, oscilloscope traces, linked 3D apparatus and hidden-answer missions.</p><button class="button primary" id="openMatchingAdvanced">Open matching Advanced Studio lab</button></article>');
    $("#openMatchingAdvanced").onclick=()=>{
      const id=$(".sim-tab.active")?.dataset.sim||"progressive";
      const map={progressive:"measure",polarisation:"measure",standing:"resonance",interference:"interference",doubleSlit:"young",diffraction:"diffraction",grating:"spectrometer",refraction:"measure",fibre:"fibre"};
      openStudio(map[id]||"measure");
    };
  }

  function addTeacherSimulationShortcuts(){
    const drawer=$("#teacherDrawer");if(!drawer||$("#teacherSimShortcuts"))return;
    const shareTitle=$$("h3",drawer).find(x=>x.textContent.includes("Share this point"));
    const block=document.createElement("div");block.id="teacherSimShortcuts";block.innerHTML='<h3>Simulation shortcuts</h3><div class="teacher-shortcuts"><button class="button" data-teacher-sim="progressive">Progressive</button><button class="button" data-teacher-sim="standing">Standing</button><button class="button" data-teacher-sim="doubleSlit">Young</button><button class="button" data-teacher-sim="grating">Grating</button><button class="button" data-teacher-sim="refraction">Refraction</button><button class="button" data-teacher-sim="fibre">Fibre</button></div>';
    if(shareTitle)drawer.insertBefore(block,shareTitle);else drawer.appendChild(block);
    $$('[data-teacher-sim]',block).forEach(b=>b.onclick=()=>{openSim(b.dataset.teacherSim);drawer.classList.remove("open");});
  }

  const contexts={
    water:{label:"Water waves",note:"Treat the drawn spacing as centimetre-scale wavefronts. Move the detector to map maxima and minima."},
    sound:{label:"Sound",note:"Interpret the sources as coherent loudspeakers. Detector intensity represents loud and quiet positions."},
    microwave:{label:"Microwaves",note:"Interpret the sources as coherent microwave emitters. Path difference still controls maxima and minima."},
    light:{label:"Light",note:"Interpret the sources as coherent optical paths. The geometry is rescaled, but the phase and path-difference rules are unchanged."}
  };
  function enhanceInterferenceContext(){
    const body=$("#studioBody");if(!body)return;
    const active=$("[data-studio='interference'].active");if(!active||$("#interferenceContext",body))return;
    const controls=$(".studio-controls",body);if(!controls)return;
    controls.insertAdjacentHTML("afterbegin",`<label class="field" id="interferenceContext"><span>Wave context</span><select id="waveContextSelect">${Object.entries(contexts).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join("")}</select><small class="muted" id="waveContextNote">${contexts.water.note}</small></label>`);
    $("#waveContextSelect").onchange=e=>{$("#waveContextNote").textContent=contexts[e.target.value].note;};
  }

  function addMeasurementGuide(){
    const tools=$(".measure-tools");if(!tools||$("#measurementGuide"))return;
    tools.insertAdjacentHTML("beforeend",'<span class="mini-badge" id="measurementGuide">A–B ruler · angle tool · phase marker</span>');
  }

  function observeDynamic(){
    const body=$("#studioBody");if(body)new MutationObserver(()=>enhanceInterferenceContext()).observe(body,{childList:true,subtree:true});
    const drawer=$("#teacherDrawer");if(drawer)new MutationObserver(()=>addTeacherSimulationShortcuts()).observe(drawer,{childList:true,subtree:false});
  }

  function loadDetailUpgrades(){
    const addCss=(href,id)=>{if(document.getElementById(id)||document.querySelector(`link[href^='${href}']`))return;const link=document.createElement("link");link.id=id;link.rel="stylesheet";link.href=href;document.head.appendChild(link);};
    addCss("detail-upgrades.css?v=2","detailUpgradeCss");
    addCss("course-upgrades-v3.css?v=3","courseUpgradeCss");
    addCss("extended-response-v4.css?v=4","extendedResponseCss");
    addCss("learning-upgrades-v5.css?v=5","learningUpgradeV5Css");
    addCss("learning-v6.css?v=6","learningV6Css");
    addCss("visual-polish-v7.css?v=7","visualPolishV7Css");
    addCss("simulation-hud-v7.css?v=7","simulationHudV7Css");
    addCss("fibre-pulse-final-v13.css?v=14","fibrePulseFinalV13Css");
    addCss("lesson-depth-v15.css?v=16","lessonDepthV16Css");
    addCss("simulations-3d-v15.css?v=16","simulations3DV16Css");
    addCss("studio-3d-v18.css?v=18","studio3DV18Css");
    const load=(src,id)=>{if(document.getElementById(id))return;const s=document.createElement("script");s.src=src;s.id=id;s.defer=true;document.body.appendChild(s);};
    load("textbook-expansion.js?v=2","textbookExpansionScript");
    load("simulation-upgrades-v2.js?v=2","simulationUpgradeScript");
    load("simulation-upgrades-v3.js?v=3","simulationUpgradeV3Script");
    load("simulation-upgrades-v4.js?v=4","simulationUpgradeV4Script");
    load("textbook-interactives-v3.js?v=3","textbookInteractiveV3Script");
    load("question-engine-v3.js?v=3","questionEngineV3Script");
    load("extended-response-v4.js?v=4","extendedResponseV4Script");
    load("topic-end-practice-v5.js?v=5","topicEndPracticeV5Script");
    load("equation-coach-v6.js?v=6","equationCoachV6Script");
    load("learning-depth-v6.js?v=6","learningDepthV6Script");
    load("simulation-performance-v6.js?v=7","simulationPerformanceV6Script");
    load("lesson-expansion-v7.js?v=7","lessonExpansionV7Script");
    load("simulation-visuals-v7.js?v=8","simulationVisualsV7Script");
    load("fibre-pulse-final-v13.js?v=14","fibrePulseFinalV13Script");
    load("lesson-depth-v16.js?v=16","lessonDepthV16Script");
    load("simulations-3d-v16.js?v=16","simulations3DV16Script");
    load("studio-3d-v18.js?v=18","studio3DV18Script");
  }

  function init(){addPracticalLinks();addSimulationBridge();addTeacherSimulationShortcuts();addMeasurementGuide();observeDynamic();enhanceInterferenceContext();loadDetailUpgrades();}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>setTimeout(init,100));else setTimeout(init,100);
})();