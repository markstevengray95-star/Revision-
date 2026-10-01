
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  let dragType=null, ghost=null;

  const currentSim=()=>window.PARTICLELAB_CORE?.getCurrentSim?.()||$('#simNav .sim-tab.active')?.dataset.sim||'atom';

  function ensure(){
    const wrap=$('.viewer-wrap');
    if(!wrap||$('#atomDragBuilder'))return;
    const el=document.createElement('div');
    el.id='atomDragBuilder';
    el.className='atom-drag-builder';
    el.hidden=currentSim()!=='atom';
    el.innerHTML=
      '<div class="atom-drag-palette">'+
        '<h4>Drag particles into the atom</h4>'+
        '<p>Drag onto the model. On touch/keyboard, tap or press Enter to add.</p>'+
        '<div class="atom-token-row">'+
          token('proton','p⁺','proton')+
          token('neutron','n⁰','neutron')+
          token('electron','e⁻','electron')+
        '</div>'+
      '</div>'+
      '<div class="atom-drop-zone atom-electron-zone" data-drop="electron"><span class="atom-zone-label">Drop e⁻ into electron region</span></div>'+
      '<div class="atom-drop-zone atom-nucleus-zone" data-drop="nucleus"><span class="atom-zone-label">Drop p⁺ or n⁰ into nucleus</span></div>'+
      '<div class="atom-drag-status">'+
        '<strong id="atomDragName">Atom builder</strong>'+
        '<div class="atom-drag-counts">'+
          '<div class="atom-drag-count"><b id="dragP">—</b><span>protons</span></div>'+
          '<div class="atom-drag-count"><b id="dragN">—</b><span>neutrons</span></div>'+
          '<div class="atom-drag-count"><b id="dragE">—</b><span>electrons</span></div>'+
        '</div>'+
        '<div class="atom-drag-tools">'+
          '<button type="button" id="dragStartH">Start H-1</button>'+
          '<button type="button" data-remove="proton">− p⁺</button>'+
          '<button type="button" data-remove="neutron">− n⁰</button>'+
          '<button type="button" data-remove="electron">− e⁻</button>'+
        '</div>'+
        '<div id="atomDragMessage" class="atom-drag-message">Drag a labelled particle onto the model.</div>'+
      '</div>';
    wrap.appendChild(el);

    $$('.atom-drag-token',el).forEach(t=>{
      t.addEventListener('dragstart',e=>{
        dragType=t.dataset.particle;
        e.dataTransfer?.setData('text/plain',dragType);
        if(e.dataTransfer)e.dataTransfer.effectAllowed='copy';
        beginDrag(dragType);
      });
      t.addEventListener('dragend',endDrag);
      t.addEventListener('pointerdown',pointerStart);
      t.addEventListener('click',()=>{ if(!dragType) addParticle(t.dataset.particle); });
      t.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){
          e.preventDefault();
          addParticle(t.dataset.particle);
        }
      });
    });

    $$('.atom-drop-zone',el).forEach(z=>{
      z.addEventListener('dragover',e=>{
        if(validDrop(dragType,z.dataset.drop)){
          e.preventDefault();
          z.classList.add('drop-ready');
          if(e.dataTransfer)e.dataTransfer.dropEffect='copy';
        }
      });
      z.addEventListener('dragleave',()=>z.classList.remove('drop-ready'));
      z.addEventListener('drop',e=>{
        e.preventDefault();
        const type=e.dataTransfer?.getData('text/plain')||dragType;
        handleDrop(type,z.dataset.drop);
        endDrag();
      });
    });

    $('#dragStartH').onclick=()=>setAtom(1,0,1,'Started from hydrogen-1. Now drag particles onto the model.');
    $$('[data-remove]',el).forEach(b=>b.onclick=()=>removeParticle(b.dataset.remove));
    sync();
  }

  function token(type,symbol,label){
    return '<div class="atom-drag-token" draggable="true" role="button" tabindex="0" data-particle="'+type+'" aria-label="Drag '+label+'"><span>'+symbol+'<small>'+label+'</small></span></div>';
  }

  function state(){
    const a=window.PARTICLELAB_ATOM_STATE||{};
    return {
      Z:Number.isFinite(a.Z)?a.Z:+($('#atomZ')?.value||1),
      N:Number.isFinite(a.neutrons)?a.neutrons:+($('#atomN')?.value||0),
      E:Number.isFinite(a.electrons)?a.electrons:+($('#atomE')?.value||0),
      A:Number.isFinite(a.A)?a.A:(+($('#atomZ')?.value||1)+ +($('#atomN')?.value||0)),
      nuclide:a.nuclide||''
    };
  }

  function setInput(id,val){
    const el=$('#'+id);
    if(!el)return false;
    el.value=val;
    el.dispatchEvent(new Event('input',{bubbles:true}));
    return true;
  }

  function setAtom(Z,N,E,msg){
    const z=$('#atomZ'),n=$('#atomN'),e=$('#atomE');
    if(!z||!n||!e){message('Open the Atomic structure simulation first.');return}
    z.value=Z;n.value=N;e.value=E;
    e.dispatchEvent(new Event('input',{bubbles:true}));
    setTimeout(()=>{sync();if(msg)message(msg)},30);
  }

  function addParticle(type){
    const a=state();
    if(type==='proton'){
      if(a.Z>=100){message('This teaching builder is limited to Z = 100.');return}
      setAtom(a.Z+1,a.N,a.E,'Added one proton: Z and A both increased by 1.');
      window.PARTICLELAB_SOUND?.cue?.('low');
      return;
    }
    if(type==='neutron'){
      if(a.N>=180){message('This teaching builder is limited to 180 neutrons.');return}
      setAtom(a.Z,a.N+1,a.E,'Added one neutron: the element stayed the same, but the isotope changed.');
      window.PARTICLELAB_SOUND?.cue?.('soft');
      return;
    }
    if(type==='electron'){
      if(a.E>=100){message('This teaching builder is limited to 100 electrons.');return}
      setAtom(a.Z,a.N,a.E+1,'Added one electron: the nucleus stayed the same, but the ion charge changed.');
      window.PARTICLELAB_SOUND?.cue?.('tick');
    }
  }

  function removeParticle(type){
    const a=state();
    if(type==='proton'){
      if(a.Z<=1){message('Keep at least one proton so the model remains an atom.');return}
      setAtom(a.Z-1,a.N,a.E,'Removed one proton: the element changed.');
      return;
    }
    if(type==='neutron'){
      if(a.N<=0){message('There are no neutrons to remove.');return}
      setAtom(a.Z,a.N-1,a.E,'Removed one neutron: Z stayed fixed, so only the isotope changed.');
      return;
    }
    if(type==='electron'){
      if(a.E<=0){message('There are no electrons to remove.');return}
      setAtom(a.Z,a.N,a.E-1,'Removed one electron: the ion became more positive.');
    }
  }

  function validDrop(type,zone){
    return (zone==='nucleus'&&(type==='proton'||type==='neutron'))||(zone==='electron'&&type==='electron');
  }

  function handleDrop(type,zone){
    if(!validDrop(type,zone)){
      message(type==='electron'?'Electrons belong in the outer electron region, not the nucleus.':'Protons and neutrons belong in the nucleus.');
      window.PARTICLELAB_SOUND?.cue?.('wrong');
      return;
    }
    addParticle(type);
  }

  function beginDrag(type){
    dragType=type;
    $('#atomDragBuilder')?.classList.add('dragging');
    $$('.atom-drop-zone').forEach(z=>z.classList.toggle('drop-ready',validDrop(type,z.dataset.drop)));
    message(type==='electron'?'Drop e⁻ in the outer electron region.':'Drop '+(type==='proton'?'p⁺':'n⁰')+' in the central nucleus.');
  }

  function endDrag(){
    dragType=null;
    $('#atomDragBuilder')?.classList.remove('dragging');
    $$('.atom-drop-zone').forEach(z=>z.classList.remove('drop-ready'));
    if(ghost){ghost.remove();ghost=null}
    document.removeEventListener('pointermove',pointerMove);
    document.removeEventListener('pointerup',pointerEnd);
    document.removeEventListener('pointercancel',pointerEnd);
  }

  function pointerStart(e){
    if(e.pointerType==='mouse')return;
    e.preventDefault();
    dragType=e.currentTarget.dataset.particle;
    beginDrag(dragType);
    ghost=document.createElement('div');
    ghost.className='atom-drag-ghost '+dragType;
    ghost.textContent=dragType==='proton'?'p⁺':dragType==='neutron'?'n⁰':'e⁻';
    document.body.appendChild(ghost);
    moveGhost(e.clientX,e.clientY);
    document.addEventListener('pointermove',pointerMove,{passive:false});
    document.addEventListener('pointerup',pointerEnd,{passive:false});
    document.addEventListener('pointercancel',pointerEnd,{passive:false});
  }

  function pointerMove(e){
    e.preventDefault();
    moveGhost(e.clientX,e.clientY);
    const zone=zoneAt(e.clientX,e.clientY);
    $$('.atom-drop-zone').forEach(z=>z.classList.toggle('drop-ready',z===zone&&validDrop(dragType,z.dataset.drop)));
  }

  function pointerEnd(e){
    e.preventDefault();
    const zone=zoneAt(e.clientX,e.clientY);
    if(zone)handleDrop(dragType,zone.dataset.drop);
    else message('Drop cancelled. Drag the particle onto a highlighted target.');
    endDrag();
  }

  function moveGhost(x,y){if(ghost){ghost.style.left=x+'px';ghost.style.top=y+'px'}}

  function zoneAt(x,y){
    const zones=$$('.atom-drop-zone');
    if(dragType==='electron'){
      return zones.find(z=>z.dataset.drop==='electron'&&inside(z,x,y))||null;
    }
    return zones.find(z=>z.dataset.drop==='nucleus'&&inside(z,x,y))||null;
  }

  function inside(el,x,y){
    const r=el.getBoundingClientRect();
    return x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom;
  }

  function message(t){const m=$('#atomDragMessage');if(m)m.textContent=t}

  function sync(){
    ensure();
    const root=$('#atomDragBuilder');if(!root)return;
    root.hidden=currentSim()!=='atom';
    if(root.hidden)return;
    const a=state();
    if($('#dragP'))$('#dragP').textContent=a.Z;
    if($('#dragN'))$('#dragN').textContent=a.N;
    if($('#dragE'))$('#dragE').textContent=a.E;
    if($('#atomDragName'))$('#atomDragName').textContent=(a.nuclide||('A '+a.A+', Z '+a.Z))+' · A = '+a.A;
  }

  function init(){
    ensure();
    $('#simNav')?.addEventListener('click',e=>{if(e.target.closest?.('.sim-tab'))setTimeout(sync,80)});
    window.addEventListener('particlelab:atom-change',()=>setTimeout(sync,10));
  }

  window.PARTICLELAB_ATOM_DRAG={add:addParticle,remove:removeParticle,startHydrogen:()=>setAtom(1,0,1)};

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,420),{once:true});
  else setTimeout(init,420);
})();
