(() => {
  const status = document.getElementById('networkStatus');
  const install = document.getElementById('installApp');
  let deferredInstall = null;
  function updateNetworkStatus(){if(!status)return;const online=navigator.onLine;status.textContent=online?'Online · progress saves locally':'Offline mode · progress still saves';status.classList.toggle('offline',!online);}
  window.addEventListener('online',updateNetworkStatus);window.addEventListener('offline',updateNetworkStatus);updateNetworkStatus();
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();deferredInstall=event;if(install)install.hidden=false;});
  if(install)install.addEventListener('click',async()=>{if(!deferredInstall)return;deferredInstall.prompt();try{await deferredInstall.userChoice;}catch(_){}deferredInstall=null;install.hidden=true;});
  window.addEventListener('appinstalled',()=>{deferredInstall=null;if(install)install.hidden=true;});
  if('serviceWorker'in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))window.addEventListener('load',()=>navigator.serviceWorker.register('./service-worker.js').catch(error=>console.warn('Service worker registration failed:',error)));
  const addCss=href=>{if(document.querySelector(`link[href*="${href.split('?')[0]}"]`))return;const link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);};
  const addScript=src=>{if(document.querySelector(`script[src*="${src.split('?')[0]}"]`))return;const script=document.createElement('script');script.src=src;script.defer=true;document.body.appendChild(script);};
  addCss('simulation-studio-v7.css?v=7');addScript('simulation-studio-v7.js?v=7');
  addCss('practical-studio-v8.css?v=8');addScript('practical-studio-v8.js?v=8');addScript('micrometer-3d-v8.js?v=8');
  addCss('simulation-fidelity-v9.css?v=9');addScript('simulation-fidelity-v9.js?v=9');
  addCss('learning-system-v10.css?v=10');addScript('learning-system-v10.js?v=10');
  addCss('learning-3d-v11.css?v=11');addScript('lesson-depth-v11.js?v=11');addScript('simulation-suite-v11.js?v=11');
})();