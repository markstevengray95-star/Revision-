(() => {
  'use strict';
  const THREE_LOCAL='./three-performance-v10.js';
  const THREE_CDN='https://cdn.jsdelivr.net/npm/three@0.186.0/build/three.module.js';
  const XLSX_LOCAL='./vendor/xlsx.full.min.js';
  const XLSX_CDN='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
  let threePromise=null,xlsxPromise=null;
  if(!document.querySelector('script[data-materials-import-map]')){
    const map=document.createElement('script');map.type='importmap';map.dataset.materialsImportMap='v10';map.textContent=JSON.stringify({imports:{[THREE_CDN]:THREE_LOCAL+'?v=10'}});document.head.appendChild(map);
  }
  async function importThree(){if(threePromise)return threePromise;threePromise=(async()=>{try{return await import(THREE_LOCAL+'?v=10');}catch(localError){console.warn('Local Three.js bundle unavailable; using development CDN fallback.',localError);return import(THREE_CDN);}})();return threePromise;}
  function loadScript(src){return new Promise((resolve,reject)=>{const existing=[...document.scripts].find(s=>s.src&&s.src.includes(src.split('/').pop()));if(existing){if(window.XLSX)return resolve(window.XLSX);existing.addEventListener('load',()=>resolve(window.XLSX),{once:true});existing.addEventListener('error',reject,{once:true});return;}const script=document.createElement('script');script.src=src;script.async=false;script.onload=()=>resolve(window.XLSX);script.onerror=reject;document.head.appendChild(script);});}
  async function loadXlsx(){if(window.XLSX)return window.XLSX;if(xlsxPromise)return xlsxPromise;xlsxPromise=(async()=>{try{return await loadScript(XLSX_LOCAL+'?v=0.18.5');}catch(localError){console.warn('Local Excel bundle unavailable; using development CDN fallback.',localError);return loadScript(XLSX_CDN);}})();return xlsxPromise;}
  const quality={ultra:{pixelRatio:2,shadows:true,antialias:true,animation:true,label:'Ultra 3D'},standard:{pixelRatio:1.5,shadows:true,antialias:true,animation:true,label:'Standard 3D'},low:{pixelRatio:1,shadows:false,antialias:false,animation:true,label:'Low-power 3D'},'2d':{pixelRatio:1,shadows:false,antialias:false,animation:false,label:'2D fallback'}};
  function getPerformanceMode(){return localStorage.getItem('materials.performance.v10')||'standard';}
  function getPerformanceConfig(){return quality[getPerformanceMode()]||quality.standard;}
  function setPerformanceMode(mode){if(!quality[mode])mode='standard';localStorage.setItem('materials.performance.v10',mode);document.documentElement.dataset.materialsPerformance=mode;window.dispatchEvent(new CustomEvent('materials-performance-change',{detail:{mode,config:quality[mode]}}));return quality[mode];}
  document.documentElement.dataset.materialsPerformance=getPerformanceMode();
  window.MaterialsAssets={loadThree:importThree,loadXlsx,getPerformanceMode,getPerformanceConfig,setPerformanceMode,quality};
})();
