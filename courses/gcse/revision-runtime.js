(() => {
  'use strict';
  // Many lesson extensions used to rescan the whole page after their own DOM
  // edits. Run them together when new study content is mounted instead.
  const scans=new Set();let scheduled=false;
  function schedule(){
    if(scheduled)return;scheduled=true;
    requestAnimationFrame(()=>{scheduled=false;for(const scan of scans){try{scan();}catch(error){console.error('Lesson enhancement failed',error);}}});
  }
  const relevant=records=>records.some(record=>record.target.id==='topicContent'||[...record.addedNodes].some(node=>node.nodeType===1&&(node.matches?.('.lesson-presentation,.lesson-card')||node.querySelector?.('.lesson-presentation'))));
  function boot(){const host=document.getElementById('topicContent');if(host)new MutationObserver(records=>{if(relevant(records))schedule();}).observe(host,{childList:true,subtree:true});schedule();}
  window.GCSE_REVISION_RUNTIME={watch(scan){scans.add(scan);schedule();},schedule,relevant};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
