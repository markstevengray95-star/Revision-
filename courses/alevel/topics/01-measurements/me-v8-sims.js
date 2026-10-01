'use strict';
(()=>{
if(window.__meV8SimsLoaded)return;window.__meV8SimsLoaded=true;
let engine=null,autoRotate=false;

function ensureStage(){
  if(engine)return engine;
  if(!window.THREE)return null;
  const wrap=document.querySelector('.viewer-wrap'),canvas=document.querySelector('#simCanvas');
  if(!wrap||!canvas)return null;
  canvas.style.display='none';
  let host=document.querySelector('#sim3dStage');
  if(!host){
    host=document.createElement('div');
    host.id='sim3dStage';host.className='v8-sim-stage';
    wrap.insertBefore(host,wrap.firstChild);
    const hud=document.createElement('div');
    hud.className='v8-3d-hud';
    hud.innerHTML='<span>Full 3D simulation</span><button class="v8-hud-btn" id="v8ResetCamera">Reset view</button><button class="v8-hud-btn" id="v8AutoRotate">Auto rotate</button>';
    wrap.appendChild(hud);
  }
  const scene=new THREE.Scene();
  scene.background=new THREE.Color(0x06101b);
  scene.fog=new THREE.Fog(0x06101b,18,40);
  const camera=new THREE.PerspectiveCamera(42,Math.max(1,host.clientWidth)/Math.max(1,host.clientHeight),0.1,100);
  const renderer=new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(2,window.devicePixelRatio||1));
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  host.innerHTML='';
  host.appendChild(renderer.domElement);
  const group=new THREE.Group();scene.add(group);
  const hemi=new THREE.HemisphereLight(0xdfefff,0x16202a,2.2);scene.add(hemi);
  const key=new THREE.DirectionalLight(0xffffff,3.1);key.position.set(6,10,8);key.castShadow=true;scene.add(key);
  const fill=new THREE.DirectionalLight(0x65c7ff,1.2);fill.position.set(-7,4,-4);scene.add(fill);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(30,30),new THREE.MeshStandardMaterial({color:0x0c1b29,roughness:.82,metalness:.05}));
  floor.rotation.x=-Math.PI/2;floor.position.y=-2.25;floor.receiveShadow=true;scene.add(floor);
  const grid=new THREE.GridHelper(24,24,0x23455e,0x142b3b);grid.position.y=-2.23;scene.add(grid);
  let yaw=.6,pitch=.25,dist=11,drag=false,lastX=0,lastY=0;
  const reset=()=>{yaw=.6;pitch=.25;dist=11};
  function resize(){
    const w=Math.max(280,host.clientWidth),h=Math.max(360,host.clientHeight||460);
    renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
  }
  renderer.domElement.addEventListener('pointerdown',e=>{drag=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(!drag)return;yaw+=(e.clientX-lastX)*.009;pitch=Math.max(-1.05,Math.min(1.05,pitch+(e.clientY-lastY)*.008));lastX=e.clientX;lastY=e.clientY});
  renderer.domElement.addEventListener('pointerup',()=>drag=false);
  renderer.domElement.addEventListener('pointercancel',()=>drag=false);
  renderer.domElement.addEventListener('wheel',e=>{dist=Math.max(5,Math.min(19,dist+e.deltaY*.012));e.preventDefault()},{passive:false});
  document.querySelector('#v8ResetCamera')?.addEventListener('click',reset);
  document.querySelector('#v8AutoRotate')?.addEventListener('click',e=>{autoRotate=!autoRotate;e.currentTarget.classList.toggle('active',autoRotate);e.currentTarget.textContent=autoRotate?'Stop rotation':'Auto rotate'});
  window.addEventListener('resize',resize);
  engine={scene,camera,renderer,group,host,reset,get yaw(){return yaw},set yaw(v){yaw=v},get pitch(){return pitch},set pitch(v){pitch=v},get dist(){return dist},set dist(v){dist=v},resize};
  resize();
  function loop(){
    if(!host.isConnected){renderer.dispose();engine=null;return}
    requestAnimationFrame(loop);
    if(autoRotate&&!drag)yaw+=.0025;
    camera.position.set(Math.sin(yaw)*Math.cos(pitch)*dist,2+Math.sin(-pitch)*dist*.55,Math.cos(yaw)*Math.cos(pitch)*dist);
    camera.lookAt(0,0,0);
    renderer.render(scene,camera);
  }
  loop();
  const snap=document.querySelector('#snapshotSim');
  if(snap&&!snap.dataset.v8wired){
    snap.dataset.v8wired='1';
    snap.addEventListener('click',e=>{
      e.preventDefault();e.stopImmediatePropagation();
      try{
        const img=document.createElement('img');img.src=renderer.domElement.toDataURL('image/png');img.alt='3D simulation snapshot';img.className='v8-snapshot';
        const tray=document.querySelector('#snapshotTray');if(tray){tray.appendChild(img);while(tray.children.length>4)tray.removeChild(tray.firstChild)}
      }catch{}
    },true);
  }
  return engine;
}
function disposeObj(o){
  o.traverse?.(n=>{
    if(n.geometry)n.geometry.dispose?.();
    if(n.material){const a=Array.isArray(n.material)?n.material:[n.material];a.forEach(m=>{m.map?.dispose?.();m.dispose?.()})}
  });
}
function clearGroup(g){while(g.children.length){const c=g.children.pop();disposeObj(c)}}
function mat(color,metal=.15,rough=.45,transparent=false,opacity=1){return new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough,transparent,opacity})}
function box(g,sx,sy,sz,color,x=0,y=0,z=0,metal=.12,rough=.5){const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),mat(color,metal,rough));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
function sphere(g,r,color,x=0,y=0,z=0,opacity=1){const m=new THREE.Mesh(new THREE.SphereGeometry(r,24,16),mat(color,.1,.35,opacity<1,opacity));m.position.set(x,y,z);m.castShadow=true;g.add(m);return m}
function cyl(g,r,h,color,x=0,y=0,z=0,rx=0,rz=0){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,28),mat(color,.55,.28));m.position.set(x,y,z);m.rotation.x=rx;m.rotation.z=rz;m.castShadow=true;g.add(m);return m}
function line(g,a,b,color=0x57d3ff,width=1){const geo=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a),new THREE.Vector3(...b)]);const m=new THREE.Line(geo,new THREE.LineBasicMaterial({color,linewidth:width}));g.add(m);return m}
function sprite(g,text,pos=[0,0,0],color='#ffffff',scale=1){
  const c=document.createElement('canvas'),ctx=c.getContext('2d');c.width=512;c.height=128;
  ctx.clearRect(0,0,512,128);ctx.fillStyle='rgba(4,12,20,.76)';ctx.fillRect(0,0,512,128);ctx.font='bold 42px system-ui';ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,64);
  const tex=new THREE.CanvasTexture(c),sm=new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}),s=new THREE.Sprite(sm);
  s.position.set(...pos);s.scale.set(4.2*scale,1.05*scale,1);g.add(s);return s;
}
function arrow(g,a,b,color=0xffd166){const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),dir=B.clone().sub(A),len=dir.length();dir.normalize();const ar=new THREE.ArrowHelper(dir,A,len,color,.28,.14);g.add(ar);return ar}
function decorateCommon(g,title){sprite(g,title,[0,3.05,0],'#dff6ff',1.08)}

function drawResolution3D(g,v){
  decorateCommon(g,'Resolution & Instruments');
  box(g,8,.18,1.15,0x697b8d,0,-1.55,0,.5,.35);
  for(let i=-4;i<=4;i+=.5){const major=Math.abs(i-Math.round(i))<.01;box(g,.025,major?.38:.22,.08,0xe8edf2,i,-1.35,.4,.2,.35)}
  const shown=Math.round(v.value/v.res)*v.res;
  const len=Math.max(.5,Math.min(6.6,v.value/12));
  box(g,len,.7,.85,0x36a2dc,-3.2+len/2,-.75,0,.08,.4);
  line(g,[-3.2,-.25,.58],[-3.2+len,-.25,.58],0x8ce99a);
  sphere(g,.09,0x8ce99a,-3.2,-.25,.58);sphere(g,.09,0x8ce99a,-3.2+len,-.25,.58);
  const type=v.res<=.03?'Micrometer':v.res<=.2?'Vernier caliper':'Ruler';
  if(type==='Micrometer'){
    const arc=new THREE.Mesh(new THREE.TorusGeometry(1.5,.22,16,70,Math.PI*1.45),mat(0xb8c4cf,.75,.2));arc.rotation.z=-Math.PI*.72;arc.position.set(2.25,.2,0);g.add(arc);
    cyl(g,.28,2.2,0xb9c4cc,3.05,.15,0,0,Math.PI/2);cyl(g,.42,1.15,0x5d7080,4.05,.15,0,0,Math.PI/2);
  }else if(type==='Vernier caliper'){
    box(g,4.3,.18,.35,0xb8c4cc,2.2,.1,0,.8,.22);box(g,.18,1.5,.4,0x9fafbd,.5,.55,0,.7,.24);box(g,.18,1.1,.4,0x9fafbd,3.9,.35,0,.7,.24);box(g,1,.45,.5,0x70889a,2.8,.1,0,.7,.24);
  }else box(g,4.5,.22,.55,0xd8c28b,2.2,.2,0,.05,.8);
  sprite(g,`${type} · resolution ${v.res} mm`,[1.6,1.65,0],'#ffd166',.78);
  sprite(g,`reading ${Number(shown.toFixed(4))} mm`,[-1.7,1.6,0],'#8ce99a',.82);
  const out=document.querySelector('#simReadout');if(out)out.innerHTML=`3D ${type}: displayed reading <strong>${Number(shown.toFixed(4))} mm</strong> · resolution <strong>${v.res} mm</strong>`;
}
function drawErrors3D(g,v){
  decorateCommon(g,'Random vs Systematic Error');
  const plate=box(g,.18,5.1,6.4,0x17334b,0,.25,0,.1,.75);plate.material.transparent=true;plate.material.opacity=.82;
  line(g,[.12,-2.2,0],[.12,2.7,0],0x8ce99a);line(g,[.12,.25,-3],[.12,.25,3],0x8ce99a);
  sphere(g,.22,0x8ce99a,.2,.25,0);sprite(g,'true value',[0,2.45,0],'#8ce99a',.62);
  const n=Math.min(30,Math.round(v.n)),scale=.95;let sum=0;
  for(let i=0;i<n;i++){const noise=Math.sin(i*2.39+1.2)*v.scatter+Math.sin(i*.77)*v.scatter*.35;const reading=v.true+v.offset+noise;sum+=reading;const dy=(reading-v.true)*scale,dz=((i%7)-3)*.32+Math.cos(i)*v.scatter*.4;sphere(g,.11,0x57d3ff,.32,dy,dz,.95)}
  const mean=sum/n,meanY=(mean-v.true)*scale;
  box(g,.05,.08,5.8,0xffd166,.4,meanY,0,.1,.3);sprite(g,`mean ${mean.toFixed(2)}`,[1.6,meanY,0],'#ffd166',.58);
  arrow(g,[-1.2,-1.8,0],[-1.2,-1.8+v.offset*scale,0],0xff8a65);sprite(g,`offset ${v.offset>=0?'+':''}${v.offset}`,[-2.1,-1.95,0],'#ffb099',.55);
  const out=document.querySelector('#simReadout');if(out)out.innerHTML=`3D sample mean ≈ <strong>${mean.toFixed(3)}</strong> · true value ${v.true} · systematic offset ${v.offset>=0?'+':''}${v.offset}`;
}
function drawUncertainty3D(g,v){
  decorateCommon(g,'Absolute & Percentage Uncertainty');
  const scale=Math.min(6.2,Math.max(.6,v.x/16)),unc=Math.min(2.5,Math.max(.08,v.dx/Math.max(v.x,1)*scale*7));
  box(g,scale,.9,1,0x287fa9,-scale/2+.2,-.4,0,.12,.38);
  const left=box(g,unc,.98,1.08,0x57d3ff,.2-scale,-.4,0,.05,.25);left.material.transparent=true;left.material.opacity=.32;
  const right=box(g,unc,.98,1.08,0x57d3ff,.2,-.4,0,.05,.25);right.material.transparent=true;right.material.opacity=.32;
  line(g,[.2-scale-unc,-1.15,.65],[.2+unc,-1.15,.65],0x8ce99a);line(g,[.2-scale-unc,-1.35,.65],[.2-scale-unc,-.95,.65],0x8ce99a);line(g,[.2+unc,-1.35,.65],[.2+unc,-.95,.65],0x8ce99a);
  const p=Math.abs(v.dx/v.x)*100;sprite(g,`${v.x} ± ${v.dx}`,[0,1.25,0],'#dff6ff',.95);sprite(g,`${p.toFixed(2)}% uncertainty`,[0,.25,1.05],'#8ce99a',.72);
  const out=document.querySelector('#simReadout');if(out)out.innerHTML=`(${v.dx} / ${v.x}) × 100 = <strong>${p.toFixed(3)}%</strong>`;
}
function drawPropagation3D(g,v){
  decorateCommon(g,'Uncertainty Propagation');
  const data=[['A',v.ua,-3.3,0x57d3ff],['B',v.ub,-1.1,0x65d9a5],['A×B / A÷B',v.ua+v.ub,1.45,0xffd166],[`A^${v.power}`,v.power*v.ua,3.7,0xff8a65]];
  data.forEach(([name,val,x,col],i)=>{const h=.8+Math.min(3.1,val/4);box(g,1.55,h,1.55,col,x,-2+h/2,0,.18,.32);sprite(g,String(name),[x,1.55,0],'#ffffff',.48);sprite(g,`${Number(val.toFixed(2))}%`,[x,.85,0],'#dff6ff',.5);if(i<2)arrow(g,[x+.85,-.4,0],[x+1.25,-.4,0],0x9fb0c6)});
  sprite(g,'height = percentage uncertainty',[0,2.45,0],'#9fb0c6',.55);
  const out=document.querySelector('#simReadout');if(out)out.innerHTML=`Product/quotient: <strong>${(v.ua+v.ub).toFixed(2)}%</strong> · A^${v.power}: <strong>${(v.power*v.ua).toFixed(2)}%</strong>`;
}
function drawGraph3D(g,v){
  decorateCommon(g,'3D Error Bars & Gradient');
  const ox=-3.5,oy=-1.75;line(g,[ox,oy,0],[3.7,oy,0],0xffffff);line(g,[ox,oy,0],[ox,2.2,0],0xffffff);
  const pts=[];for(let i=1;i<=7;i++){const y=v.slope*i+1+(Math.sin(i*1.73)+Math.cos(i*.81)*.4)*v.scatter;pts.push({x:i,y})}
  const mapX=x=>ox+x*.95,mapY=y=>oy+(y/(v.slope*7+4))*3.6;
  pts.forEach(p=>{const x=mapX(p.x),y=mapY(p.y),du=v.yunc/(v.slope*7+4)*3.6;sphere(g,.11,0x57d3ff,x,y,0);line(g,[x,y-du,0],[x,y+du,0],0x8ce99a);line(g,[x-.13,y-du,0],[x+.13,y-du,0],0x8ce99a);line(g,[x-.13,y+du,0],[x+.13,y+du,0],0x8ce99a)});
  const best=v.slope,worst=v.slope+(v.yunc*.22+v.scatter*.13),y0=mapY(1),yb=mapY(best*7+1),yw=mapY(worst*7+1-v.yunc*.7);
  line(g,[mapX(0),y0,.05],[mapX(7),yb,.05],0xffd166);line(g,[mapX(0),y0-.08,-.03],[mapX(7),yw,-.03],0xff8a65);
  sprite(g,'best line',[1.8,1.7,.1],'#ffd166',.48);sprite(g,'worst acceptable',[1.8,1.15,.1],'#ff9d86',.48);
  const pct=Math.abs(best-worst)/Math.abs(best)*100;const out=document.querySelector('#simReadout');if(out)out.innerHTML=`Best gradient ≈ <strong>${best.toFixed(2)}</strong> · worst acceptable ≈ <strong>${worst.toFixed(2)}</strong> · uncertainty ≈ <strong>${pct.toFixed(1)}%</strong>`;
}
function drawEstimate3D(g,v){
  decorateCommon(g,'Order-of-Magnitude Estimation');
  const total=v.rate*60*v.hours*v.days,log=Math.log10(total),order=Math.round(log),count=Math.max(8,Math.min(72,Math.round((log-4)*14)));
  const instGeo=new THREE.BoxGeometry(.34,.34,.34),instMat=mat(0x57d3ff,.05,.35),mesh=new THREE.InstancedMesh(instGeo,instMat,count),dummy=new THREE.Object3D();
  for(let i=0;i<count;i++){const cols=9,row=Math.floor(i/cols),col=i%cols,layer=Math.floor(row/6),r=row%6;dummy.position.set((col-4)*.52,-1.8+r*.5,(layer-1)*.72);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)}
  mesh.castShadow=true;g.add(mesh);const height=Math.max(.8,Math.min(4.2,(order-4)*.7));cyl(g,.62,height,0xffd166,3,-2+height/2,0);
  sprite(g,`≈ ${total.toExponential(2)}`,[0,1.35,0],'#dff6ff',.88);sprite(g,`nearest order 10^${order}`,[0,.45,0],'#8ce99a',.72);sprite(g,'relative scale',[3,1.2,0],'#ffd166',.5);
  const out=document.querySelector('#simReadout');if(out)out.innerHTML=`Annual estimate ≈ <strong>${total.toExponential(3)}</strong> · nearest order of magnitude <strong>10<sup>${order}</sup></strong>`;
}
function drawFallback(g,sim){decorateCommon(g,sim?.title||'3D model');sphere(g,1.2,0x57d3ff,0,0,0);sprite(g,'Interactive 3D model',[0,-1.8,0],'#8ce99a',.7)}
function drawSim3D(){
  const e=ensureStage();if(!e){return window.__meV8OldDraw?.()}
  const sim=sims[state.sim];if(!sim)return;const vals=state.simVals[sim.id]||Object.fromEntries(sim.controls.map(c=>[c[0],c[2]]));clearGroup(e.group);
  if(sim.id==='resolution')drawResolution3D(e.group,vals);else if(sim.id==='errors')drawErrors3D(e.group,vals);else if(sim.id==='uncertainty')drawUncertainty3D(e.group,vals);else if(sim.id==='propagation')drawPropagation3D(e.group,vals);else if(sim.id==='graph')drawGraph3D(e.group,vals);else if(sim.id==='estimate')drawEstimate3D(e.group,vals);else drawFallback(e.group,sim);
  const stateEl=document.querySelector('#simState');if(stateEl)stateEl.textContent='Interactive 3D';const note=document.querySelector('.model-note');if(note)note.textContent='Full 3D teaching model · drag to orbit · scroll/pinch to zoom · use controls to change the physics.';
}
window.__meV8OldDraw=window.drawSim;window.drawSim=drawSim3D;
const originalRenderSim=window.renderSim;window.renderSim=function(){originalRenderSim?.();ensureStage();document.querySelectorAll('.sim-tab').forEach(b=>{if(!b.dataset.v8label){b.textContent=b.textContent+' · 3D';b.dataset.v8label='1'}});requestAnimationFrame(drawSim3D)};
const originalShowView=window.showView;window.showView=function(name){originalShowView?.(name);if(name==='lab')setTimeout(()=>{ensureStage()?.resize();drawSim3D()},60)};
setTimeout(()=>{ensureStage();renderSim?.()},0);
})();
