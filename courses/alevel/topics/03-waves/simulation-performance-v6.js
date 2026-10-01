(()=>{
  "use strict";
  const $=(s,r=document)=>r.querySelector(s);
  let initialised=false,rafId=0,last=performance.now(),frames=0,fps=60,toolbarAttempts=0;

  function labActive(){
    const lab=$("#view-lab");
    return !document.hidden && !!lab?.classList.contains("active-view");
  }

  function addStatusBadge(){
    if($("#simFpsV6"))return true;
    const toolbar=$(".sim-pro-toolbar");
    if(!toolbar)return false;
    toolbar.insertAdjacentHTML("beforeend",'<span class="mini-badge" id="simFpsV6">render adaptive</span>');
    return true;
  }

  function tryToolbar(){
    if(addStatusBadge())return;
    toolbarAttempts+=1;
    if(toolbarAttempts<12)setTimeout(tryToolbar,500);
  }

  function stopMeter(label="render paused off-screen"){
    if(rafId){cancelAnimationFrame(rafId);rafId=0;}
    const badge=$("#simFpsV6");
    if(badge)badge.textContent=label;
  }

  function meter(ts){
    if(!labActive()){stopMeter();return;}
    frames+=1;
    if(ts-last>=900){
      fps=frames*1000/(ts-last);
      frames=0;
      last=ts;
      const badge=$("#simFpsV6");
      if(badge)badge.textContent=`render adaptive · ${Math.max(1,Math.round(fps))} fps`;
    }
    rafId=requestAnimationFrame(meter);
  }

  function sync(){
    addStatusBadge();
    if(labActive()){
      if(!rafId){frames=0;last=performance.now();rafId=requestAnimationFrame(meter);}
    }else{
      stopMeter();
    }
  }

  function init(){
    if(initialised)return;
    initialised=true;
    tryToolbar();
    document.addEventListener("visibilitychange",sync,{passive:true});
    const lab=$("#view-lab");
    if(lab)new MutationObserver(sync).observe(lab,{attributes:true,attributeFilter:["class"]});
    window.addEventListener("resize",()=>{if(labActive())addStatusBadge();},{passive:true});
    sync();
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});
  else init();
})();