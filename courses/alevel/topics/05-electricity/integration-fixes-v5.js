(() => {
  const $=(s,r=document)=>r.querySelector(s);
  let syncPending=false;

  function syncSimulationLayers(){
    if(syncPending)return;
    syncPending=true;
    requestAnimationFrame(()=>{
      syncPending=false;
      const tab=$('.sim-tab.active');
      if(!tab)return;
      // The core app can select a simulation programmatically from a lesson.
      // Re-dispatch one tab click so enhancement layers that listen for tab changes
      // (Virtual Lab+, Real Equipment Bench, depth/fault tools) receive the same event.
      if(tab.dataset.integrationSynced==='1'){
        tab.dataset.integrationSynced='0';
        return;
      }
      tab.dataset.integrationSynced='1';
      tab.click();
      setTimeout(()=>{
        const current=$('.sim-tab.active');
        if(current)current.dataset.integrationSynced='0';
      },80);
    });
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-open-sim]')) setTimeout(syncSimulationLayers,50);
  },true);

  // Keep enhancement canvases correctly sized after view/stage changes and on mobile.
  let resizeQueued=false;
  function requestResize(){
    if(resizeQueued)return;
    resizeQueued=true;
    requestAnimationFrame(()=>{
      resizeQueued=false;
      window.dispatchEvent(new Event('resize'));
    });
  }
  document.addEventListener('click',e=>{
    if(e.target.closest('.nav-button,.lesson-stage-button,.sim-tab,[data-practical],[data-stage-move]')) setTimeout(requestResize,40);
  });
  if('ResizeObserver' in window){
    const lab=$('#view-lab');
    if(lab)new ResizeObserver(()=>requestResize()).observe(lab);
  }

  // Improve feedback announcements without changing the visual layout.
  function decorateFeedback(){
    document.querySelectorAll('.feedback,.am-feedback,.qv4-feedback,.eq-feedback,.labplus-feedback').forEach(el=>{
      if(!el.hasAttribute('role'))el.setAttribute('role','status');
      if(!el.hasAttribute('aria-live'))el.setAttribute('aria-live','polite');
    });
  }
  decorateFeedback();
  new MutationObserver(decorateFeedback).observe(document.body,{childList:true,subtree:true});
})();