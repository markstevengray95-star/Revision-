(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const body=document.body;
const coreLegends={
 'Field comparison':['3D inverse-square geometry','source objects','probe response'],
 'Gravity field + potential':['radial vectors','equipotential shells','moving probe'],
 'Orbital mechanics':['planet','orbit path','velocity + force vectors'],
 'Electric field + potential':['radial source','parallel plates','uniform-field vectors'],
 'Parallel-plate capacitor':['3D plates','dielectric region','charge animation'],
 'Capacitor discharge':['3D circuit bench','current pulses','RC time scale'],
 'Force on a wire':['magnet poles','3D wire','force vector'],
 'Charged particle in B':['3D B-field','particle trajectory','curvature'],
 'Flux-linkage rotator':['rotating 3D coil','field direction','angle'],
 'Induction + rotating coil':['rotating coil','changing flux','induced response'],
 'AC oscilloscope':['3D scope display','travelling waveform','rms relationship'],
 'Transformer + transmission':['laminated core','primary/secondary coils','moving flux marker']
};
const advLegends={
 'Orbit & gravitational field':['3D orbital geometry','live vectors','energy/speed controls'],
 'Electric field & charged particle':['3D plates','field arrows','particle force'],
 'Capacitor & dielectric':['3D plates','dielectric insertion','stored-charge response'],
 'Magnetic force & charged particle':['pole pieces','wire force','particle path'],
 'Electromagnetic induction':['moving magnet','multi-turn coil','flux-change response'],
 'Transformer & transmission':['3D core','coil turns','transmission load'],
 'Force-on-wire practical':['3D RP10 rig','current direction','force/balance response'],
 'Search-coil practical':['3D RP11 coil','field orientation','oscilloscope response']
};
function addLegend(stage,items,cls){if(!stage)return;let l=stage.querySelector('.'+cls);if(!l){l=document.createElement('div');l.className=cls;stage.appendChild(l)}l.innerHTML=(items||['3D interactive model']).map(x=>`<span>${x}</span>`).join('')}
function updateCore(){const stage=$('#core3dV10Stage'),title=$('#simTitle')?.textContent?.trim();if(!stage)return;addLegend(stage,coreLegends[title], 'core3d-v11-legend');if(!stage.querySelector('.v11-depth-badge')){const b=document.createElement('div');b.className='v11-depth-badge';b.textContent='3D model · rotate + zoom';stage.appendChild(b)}const canvas=$('#simCanvas');if(canvas)canvas.setAttribute('aria-hidden','true')}
function updateAdvanced(){const lab=$('#threeLabV9');if(!lab)return;body.classList.add('v11-advanced-clean');const stage=$('#threeV9Stage')||lab.querySelector('.three-v9-stage');const title=$('#threeV9Title')?.textContent?.trim();addLegend(stage,advLegends[title], 'adv3d-v11-legend');if(stage&&!stage.querySelector('.v11-depth-badge')){const b=document.createElement('div');b.className='v11-depth-badge';b.textContent='3D apparatus model';stage.appendChild(b)}const app=$('#advancedApp');if(app&&!app.querySelector('.v11-3d-status')){const s=document.createElement('div');s.className='v11-3d-status';s.innerHTML='<strong>3D-first mode active.</strong> Core simulation visuals and Advanced Lab apparatus are rendered in 3D. Older 2D apparatus canvases are hidden; graph/data-analysis panels remain available because they are measurement tools rather than simulation scenes.';lab.insertAdjacentElement('afterend',s)}}
function mark3DCoverage(){const view=$('#view-lab');if(view&&!view.querySelector('.v11-coverage')){const p=document.createElement('div');p.className='v11-3d-status v11-coverage';p.innerHTML='<strong>12 / 12 core simulations use 3D scenes.</strong> Drag the scene to rotate, use the wheel/pinch to zoom, and use the existing physics controls to change the model.';view.querySelector('.section-head')?.insertAdjacentElement('afterend',p)}}
function resize3D(){window.dispatchEvent(new Event('resize'))}
let timer=0;function refresh(){clearTimeout(timer);timer=setTimeout(()=>{updateCore();updateAdvanced();mark3DCoverage();resize3D()},80)}
new MutationObserver(refresh).observe(document.body,{childList:true,subtree:true,characterData:true});
document.addEventListener('click',e=>{if(e.target.closest('.sim-tab,.nav-button,[data-view],[data-jump],.three-v9-tabs button,#threeV9Tabs button'))setTimeout(refresh,50)});
window.addEventListener('load',()=>setTimeout(refresh,180),{once:true});refresh();
})();