(() => {
  let dragging=false,lastX=0,lastY=0,accX=0,accY=0;
  const canvas=()=>document.getElementById('sim3DCanvas');
  function send(key){
    const c=canvas();
    if(!c)return;
    c.focus({preventScroll:true});
    c.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true,cancelable:true}));
  }
  function installStyle(){
    if(document.getElementById('sim3DInputV8Style'))return;
    const s=document.createElement('style');
    s.id='sim3DInputV8Style';
    s.textContent='#sim3DCanvas{position:relative!important;z-index:4!important;pointer-events:auto!important;user-select:none;-webkit-user-select:none;-webkit-touch-callout:none} .sim3d-badge,.sim3d-hint{pointer-events:none!important}.sim3d-orbit-pad{display:inline-flex;gap:4px;align-items:center}.sim3d-orbit-pad button{min-width:34px;padding-inline:8px}';
    document.head.appendChild(s);
  }
  function installPad(){
    const tb=document.getElementById('sim3DToolbar');
    if(!tb||tb.querySelector('.sim3d-orbit-pad'))return false;
    const pad=document.createElement('span');
    pad.className='sim3d-orbit-pad';
    pad.setAttribute('aria-label','3D camera orbit controls');
    pad.innerHTML='<button type="button" data-3d-nudge="left" aria-label="Orbit left">↶</button><button type="button" data-3d-nudge="up" aria-label="Orbit up">↑</button><button type="button" data-3d-nudge="down" aria-label="Orbit down">↓</button><button type="button" data-3d-nudge="right" aria-label="Orbit right">↷</button>';
    tb.insertBefore(pad,tb.firstChild);
    return true;
  }
  function ensurePad(){if(installPad())return;let n=0;const id=setInterval(()=>{n++;if(installPad()||n>40)clearInterval(id);},100);}
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('[data-3d-nudge]');
    if(!b)return;
    const map={left:'ArrowLeft',right:'ArrowRight',up:'ArrowUp',down:'ArrowDown'};
    send(map[b.dataset['3dNudge']]);
  },true);
  document.addEventListener('pointerdown',e=>{
    const c=e.target.closest?.('#sim3DCanvas');
    if(!c)return;
    dragging=true;lastX=e.clientX;lastY=e.clientY;accX=0;accY=0;
    c.classList.add('dragging');
    c.focus({preventScroll:true});
    try{c.setPointerCapture?.(e.pointerId);}catch(_){}
    e.preventDefault();
  },true);
  window.addEventListener('pointermove',e=>{
    if(!dragging)return;
    const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;accX+=dx;accY+=dy;
    while(Math.abs(accX)>=8){send(accX>0?'ArrowRight':'ArrowLeft');accX+=accX>0?-8:8;}
    while(Math.abs(accY)>=8){send(accY>0?'ArrowDown':'ArrowUp');accY+=accY>0?-8:8;}
    e.preventDefault();
  },true);
  function end(){if(!dragging)return;dragging=false;canvas()?.classList.remove('dragging');accX=0;accY=0;}
  window.addEventListener('pointerup',end,true);window.addEventListener('pointercancel',end,true);window.addEventListener('blur',end);
  document.addEventListener('touchmove',e=>{if(dragging)e.preventDefault();},{passive:false,capture:true});
  function start(){installStyle();ensurePad();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
