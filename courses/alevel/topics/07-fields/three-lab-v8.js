import * as THREE from 'https://esm.sh/three@0.180.0';

const root = document.querySelector('#advancedApp');
if (!root || document.querySelector('#threeLabV8')) {
  // keep module side-effect free if Advanced Lab is unavailable
} else {
  const section = document.createElement('section');
  section.id = 'threeLabV8';
  section.className = 'panel pad three-lab-v8';
  section.innerHTML = `
    <div class="section-head compact">
      <div><span class="eyebrow">WebGL 3D · high-DPI</span><h2>Realistic 3D Physics Studio</h2></div>
      <p class="muted">Rotate the camera, zoom, change physical variables and inspect apparatus in three dimensions. The original measurement labs remain below for graphing and data collection.</p>
    </div>
    <div class="three-v8-tabs" id="threeV8Tabs"></div>
    <div class="three-v8-layout">
      <div class="three-v8-stage-wrap">
        <div id="threeV8Stage" class="three-v8-stage" aria-label="Interactive 3D physics simulation"></div>
        <div class="three-v8-overlay">
          <span class="pill" id="threeV8Status">3D ready</span>
          <span class="pill" id="threeV8Fps">smooth mode</span>
        </div>
        <div class="three-v8-help">Drag to rotate · wheel/pinch to zoom · use controls to change the experiment</div>
      </div>
      <aside class="three-v8-side">
        <article class="three-v8-card"><span class="eyebrow">Current model</span><h3 id="threeV8Title"></h3><p id="threeV8Desc" class="muted"></p></article>
        <div id="threeV8Controls" class="control-stack"></div>
        <article class="three-v8-card"><span class="eyebrow">Live physics</span><div id="threeV8Readout" class="three-v8-readout"></div></article>
        <article class="three-v8-card"><span class="eyebrow">Visual layers</span><div class="button-row wrap"><button class="button" id="threeV8Vectors">Vectors</button><button class="button" id="threeV8Labels">Labels</button><button class="button" id="threeV8Reset">Reset camera</button></div></article>
      </aside>
    </div>`;
  root.prepend(section);

  const stage = section.querySelector('#threeV8Stage');
  const tabs = section.querySelector('#threeV8Tabs');
  const controlsHost = section.querySelector('#threeV8Controls');
  const readout = section.querySelector('#threeV8Readout');
  const titleEl = section.querySelector('#threeV8Title');
  const descEl = section.querySelector('#threeV8Desc');
  const fpsEl = section.querySelector('#threeV8Fps');

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x07111f);
  scene.fog = new THREE.Fog(0x07111f, 18, 55);
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 120);
  camera.position.set(9, 6.5, 11);

  const ambient = new THREE.HemisphereLight(0xbfe8ff, 0x162033, 1.8);
  scene.add(ambient);
  const key = new THREE.DirectionalLight(0xffffff, 3.0);
  key.position.set(7, 11, 8); key.castShadow = true;
  key.shadow.mapSize.set(2048, 2048);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x66bfff, 1.4); rim.position.set(-8, 4, -7); scene.add(rim);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshStandardMaterial({color:0x0b1827, roughness:0.92, metalness:0.04}));
  floor.rotation.x = -Math.PI/2; floor.position.y = -2.7; floor.receiveShadow = true; scene.add(floor);
  const grid = new THREE.GridHelper(40, 40, 0x234761, 0x152b3d); grid.position.y=-2.68; grid.material.opacity=.32; grid.material.transparent=true; scene.add(grid);

  let yaw = -0.55, pitch = 0.35, distance = 15;
  let dragging = false, lastX = 0, lastY = 0;
  function updateCamera(){
    const cp=Math.cos(pitch), sp=Math.sin(pitch), cy=Math.cos(yaw), sy=Math.sin(yaw);
    camera.position.set(distance*cp*sy, distance*sp+1.1, distance*cp*cy);
    camera.lookAt(0,0,0);
  }
  updateCamera();
  renderer.domElement.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;renderer.domElement.setPointerCapture?.(e.pointerId)});
  renderer.domElement.addEventListener('pointermove',e=>{if(!dragging)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;lastX=e.clientX;lastY=e.clientY;yaw-=dx*0.006;pitch=Math.max(-.15,Math.min(1.15,pitch-dy*0.005));updateCamera()});
  renderer.domElement.addEventListener('pointerup',()=>dragging=false);
  renderer.domElement.addEventListener('pointercancel',()=>dragging=false);
  renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(7,Math.min(27,distance+e.deltaY*0.012));updateCamera()},{passive:false});

  const metallic=(color,rough=.28,metal=.72)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal});
  const plastic=(color,rough=.55)=>new THREE.MeshStandardMaterial({color,roughness:rough,metalness:.05});
  const glass=(color=0x85dfff)=>new THREE.MeshPhysicalMaterial({color,roughness:.12,metalness:0,transmission:.45,transparent:true,opacity:.58,thickness:.5});
  function box(w,h,d,mat,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
  function sphere(r,mat,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.SphereGeometry(r,48,32),mat);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
  function cylinder(r,h,mat,x=0,y=0,z=0,axis='y'){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,40),mat);m.position.set(x,y,z);if(axis==='x')m.rotation.z=Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;m.castShadow=true;m.receiveShadow=true;scene.add(m);return m}
  function tubeRing(r,tube,mat,x=0,y=0,z=0,rotX=Math.PI/2){const m=new THREE.Mesh(new THREE.TorusGeometry(r,tube,18,64),mat);m.position.set(x,y,z);m.rotation.x=rotX;m.castShadow=true;scene.add(m);return m}
  function arrow(dir,origin,len,color){const a=new THREE.ArrowHelper(dir.clone().normalize(),origin,len,color,.35,.18);scene.add(a);return a}
  function clearModel(){
    [...scene.children].forEach(o=>{if(o.userData?.model){scene.remove(o);o.geometry?.dispose?.();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose?.());else o.material?.dispose?.()}});
  }
  function mark(o){o.userData.model=true;return o}
  function addBox(...args){return mark(box(...args))} function addSphere(...args){return mark(sphere(...args))} function addCylinder(...args){return mark(cylinder(...args))} function addRing(...args){return mark(tubeRing(...args))} function addArrow(...args){return mark(arrow(...args))}

  const modelDefs = {
    orbit:{name:'Orbit & gravitational field',desc:'A three-dimensional planet/satellite model with orbital radius, speed and gravitational/velocity vectors.',controls:[['mass','Planet mass / 10²⁴ kg',1,9,.1,5.97],['radius','Orbit radius / 10⁶ m',7,35,.5,12],['speed','Speed / circular speed',.5,1.4,.01,1]],state:{}},
    electric:{name:'Electric field & charged particle',desc:'Realistic parallel plates plus a movable charged particle, field arrows and force direction.',controls:[['voltage','Plate pd / V',100,2500,25,900],['gap','Plate separation / cm',2,12,.5,6],['charge','Particle charge / e',-3,3,1,1]],state:{}},
    capacitor:{name:'Capacitor & dielectric',desc:'3D parallel-plate capacitor with adjustable separation, plate area and a dielectric slab.',controls:[['voltage','Supply / V',1,12,.2,6],['gap','Plate gap / mm',1,12,.5,5],['area','Relative plate area',.6,1.6,.05,1],['dielectric','Dielectric fraction',0,1,.05,0]],state:{}},
    magnetic:{name:'Magnetic force & charged particle',desc:'Pole pieces, field direction, current-carrying wire and curved charged-particle motion in one 3D scene.',controls:[['B','Flux density / T',.05,.8,.01,.3],['I','Wire current / A',-5,5,.1,2],['speed','Particle speed / 10⁶ m s⁻¹',.5,5,.1,2]],state:{}},
    induction:{name:'Electromagnetic induction',desc:'Move a permanent magnet relative to a multi-turn coil and inspect flux-change direction and induced emf.',controls:[['speed','Magnet motion speed',.2,3,.1,1],['turns','Coil turns',40,400,20,180],['strength','Magnet strength',.4,1.8,.1,1]],state:{}},
    transformer:{name:'Transformer & transmission',desc:'Laminated iron core, primary/secondary coils and a transmission load with live turns-ratio behaviour.',controls:[['Np','Primary turns',100,900,50,400],['Ns','Secondary turns',100,2400,50,1200],['Vp','Primary voltage / V',12,500,1,230],['power','Transferred power / W',200,5000,100,1500]],state:{}}
  };
  const G=6.67430e-11, EPS=8.8541878128e-12;
  let mode='orbit', values={}, dynamic=[];
  let vectors=true, labels=true, lastTime=performance.now(), elapsed=0, fpsSamples=[];
  function defaults(){const o={};modelDefs[mode].controls.forEach(c=>o[c[0]]=c[5]);return o}
  function setupTabs(){tabs.innerHTML='';Object.entries(modelDefs).forEach(([id,d])=>{const b=document.createElement('button');b.className='button'+(id===mode?' primary':'');b.textContent=d.name;b.onclick=()=>{mode=id;values=defaults();build();setupTabs();renderControls();};tabs.appendChild(b)})}
  function renderControls(){controlsHost.innerHTML='';modelDefs[mode].controls.forEach(c=>{const [key,label,min,max,step]=c;const wrap=document.createElement('label');wrap.className='field';wrap.innerHTML=`<span>${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${values[key]}"><output>${Number(values[key]).toFixed(step<.1?2:1)}</output>`;const i=wrap.querySelector('input'),o=wrap.querySelector('output');i.oninput=()=>{values[key]=Number(i.value);o.textContent=Number(values[key]).toFixed(step<.1?2:1);build(true)};controlsHost.appendChild(wrap)})}
  function modelObjects(){return scene.children.filter(x=>x.userData?.model)}
  function build(preserveCamera=false){
    clearModel(); dynamic=[]; titleEl.textContent=modelDefs[mode].name;descEl.textContent=modelDefs[mode].desc;
    if(mode==='orbit')buildOrbit(); else if(mode==='electric')buildElectric(); else if(mode==='capacitor')buildCapacitor(); else if(mode==='magnetic')buildMagnetic(); else if(mode==='induction')buildInduction(); else buildTransformer();
    if(!preserveCamera){yaw=-.55;pitch=.35;distance=15;updateCamera()}
  }
  function buildOrbit(){
    const M=values.mass*1e24,r=values.radius*1e6,vc=Math.sqrt(G*M/r),v=vc*values.speed,vesc=Math.sqrt(2*G*M/r),T=2*Math.PI*Math.sqrt(r**3/(G*M));
    const planet=addSphere(2.05,new THREE.MeshStandardMaterial({color:0x2f77b7,roughness:.72,metalness:.03}),0,0,0);
    const atmosphere=addSphere(2.12,new THREE.MeshPhysicalMaterial({color:0x68cfff,transparent:true,opacity:.12,roughness:.15,transmission:.2}),0,0,0);
    const orbitR=3.2+((values.radius-7)/(35-7))*3.2;
    const ring=addRing(orbitR,.018,new THREE.MeshBasicMaterial({color:0x5fbde8,transparent:true,opacity:.55}),0,0,0,Math.PI/2);
    const sat=addBox(.48,.28,.7,metallic(0xd8e4ef,.22,.82),orbitR,0,0); addBox(.78,.04,.36,plastic(0x244d82,.45),orbitR,0,.55);addBox(.78,.04,.36,plastic(0x244d82,.45),orbitR,0,-.55);
    const fArrow=addArrow(new THREE.Vector3(-1,0,0),new THREE.Vector3(orbitR,0,0),1.35,0x78e6a1);const vArrow=addArrow(new THREE.Vector3(0,0,1),new THREE.Vector3(orbitR,0,0),1.55,0xf2c86b);
    dynamic.push({type:'orbit',sat,extras:[...modelObjects().filter(x=>x!==planet&&x!==atmosphere&&x!==ring&&x!==sat&&x!==fArrow&&x!==vArrow)],fArrow,vArrow,r:orbitR,speedFactor:values.speed});
    readout.innerHTML=`<strong>v<sub>circular</sub> ${fmt(vc)} m s⁻¹</strong><span>current v ${fmt(v)} m s⁻¹</span><span>escape ${fmt(vesc)} m s⁻¹</span><span>period ${fmt(T)} s</span>`;
  }
  function buildElectric(){
    const gap=.9+values.gap*.14, E=values.voltage/(values.gap/100), q=values.charge*1.602e-19, F=q*E;
    addBox(.22,5.2,6.2,metallic(0xb9c7d6,.18,.92),-gap,0,0);addBox(.22,5.2,6.2,metallic(0x9aa9ba,.18,.92),gap,0,0);
    const plusMat=plastic(0xc75050,.34), minusMat=plastic(0x4d73c7,.34); for(let y=-2;y<=2;y+=.8){for(let z=-2.4;z<=2.4;z+=.8){addSphere(.07,plusMat,-gap+.15,y,z);addSphere(.07,minusMat,gap-.15,y,z)}}
    for(let y=-2;y<=2;y+=1){for(let z=-2;z<=2;z+=1){addArrow(new THREE.Vector3(1,0,0),new THREE.Vector3(-gap+.35,y,z),Math.max(.5,2*gap-.7),0x68cfff)}}
    addSphere(.28,plastic(values.charge>=0?0xe15b5b:0x5d83dd,.28),0,0,0); if(vectors&&values.charge!==0)addArrow(new THREE.Vector3(Math.sign(values.charge),0,0),new THREE.Vector3(0,.4,0),1.3,0x78e6a1);
    readout.innerHTML=`<strong>E = ${fmt(E)} V m⁻¹</strong><span>q = ${fmt(q)} C</span><span>F = ${fmt(F)} N</span><span>field approximately uniform between plates</span>`;
  }
  function buildCapacitor(){
    const gap=.55+values.gap*.11, scale=values.area, C=EPS*(.032*scale*scale)/(values.gap/1000),Q=C*values.voltage,U=.5*C*values.voltage**2;
    const plateMat=metallic(0xc2ced9,.16,.92);addBox(.15,4*scale,5*scale,plateMat,-gap,0,0);addBox(.15,4*scale,5*scale,plateMat,gap,0,0);
    const ins=addBox(Math.max(.05,2*gap*values.dielectric),3.75*scale,4.7*scale,glass(0x8de2c0),-gap+gap*values.dielectric,0,0);ins.visible=values.dielectric>.02;
    const wireMat=metallic(0xd57d37,.28,.8);addCylinder(.07,3.2,wireMat,-gap-1.7,-1.9,0,'x');addCylinder(.07,3.2,wireMat,gap+1.7,-1.9,0,'x');
    const resistor=addBox(1.4,.42,.42,plastic(0xd8bf78,.55),0,-1.9,0); for(let i=-.5;i<=.5;i+=.25)addBox(.04,.46,.46,plastic(0x604733,.5),i,-1.9,0);
    readout.innerHTML=`<strong>C ≈ ${fmt(C)} F</strong><span>Q = ${fmt(Q)} C</span><span>U = ${fmt(U)} J</span><span>dielectric insertion ${(values.dielectric*100).toFixed(0)}%</span>`;
  }
  function buildMagnetic(){
    addBox(2.1,2.3,4.8,plastic(0xbd4d4d,.42),-3,1.5,0);addBox(2.1,2.3,4.8,plastic(0x4d73bd,.42),-3,-1.5,0);
    for(let x=-1.7;x<=2.5;x+=1.05)for(let z=-1.8;z<=1.8;z+=1.2)addArrow(new THREE.Vector3(0,-1,0),new THREE.Vector3(x,1.15,z),2.3,0x68cfff);
    addCylinder(.10,5.2,metallic(0xd47a35,.22,.86),.2,0,0,'x'); if(values.I!==0)addArrow(new THREE.Vector3(Math.sign(values.I),0,0),new THREE.Vector3(-2.1,.35,0),2.2,0xf2c86b);
    const force=values.B*values.I*.08;if(vectors&&Math.abs(values.I)>.05)addArrow(new THREE.Vector3(0,0,Math.sign(values.I)),new THREE.Vector3(.3,.45,0),1.45,0x78e6a1);
    const radius=Math.max(1.1,Math.min(4.1,2.6*(values.speed/2)/(values.B/.3))); const curve=new THREE.EllipseCurve(0,0,radius,radius,0,Math.PI*1.55,false,0);const pts=curve.getPoints(90).map(p=>new THREE.Vector3(p.x+3.3,p.y-1.2,p.y*.15));const geo=new THREE.BufferGeometry().setFromPoints(pts);const path=mark(new THREE.Line(geo,new THREE.LineBasicMaterial({color:0xc7a8ff})));scene.add(path);const particle=addSphere(.18,plastic(0xe8df7a,.25),pts[0].x,pts[0].y,pts[0].z);dynamic.push({type:'path',obj:particle,pts});
    readout.innerHTML=`<strong>F<sub>wire</sub> = ${fmt(force)} N</strong><span>particle curvature increases as B rises</span><span>magnetic force is perpendicular to motion</span>`;
  }
  function buildInduction(){
    const coilMat=metallic(0xd67a35,.22,.88);const n=Math.max(4,Math.round(values.turns/45));for(let i=0;i<n;i++)addRing(1.55,.055,coilMat,1.5+(i-n/2)*.12,0,0,0);
    const magnet=addCylinder(.68,3.3,plastic(0xb84949,.38),-3.0,0,0,'x');addCylinder(.69,1.6,plastic(0x4f74c5,.38),-3.85,0,0,'x');
    addCylinder(.7,.08,plastic(0xf2e5d7,.4),-2.15,0,0,'x');dynamic.push({type:'magnet',obj:magnet,speed:values.speed,strength:values.strength});
    const omega=values.speed*1.3,emfScale=values.turns*values.strength*omega*0.004;
    readout.innerHTML=`<strong>relative ε<sub>peak</sub> ≈ ${fmt(emfScale)} V</strong><span>${values.turns.toFixed(0)} turns</span><span>faster motion → greater rate of change of flux linkage</span>`;
  }
  function buildTransformer(){
    const core=metallic(0x66717f,.5,.62);addBox(6,.65,.9,core,0,2.2,0);addBox(6,.65,.9,core,0,-2.2,0);addBox(.65,4.4,.9,core,-2.7,0,0);addBox(.65,4.4,.9,core,2.7,0,0);
    const pTurns=Math.max(5,Math.round(values.Np/90)),sTurns=Math.max(5,Math.round(values.Ns/140));const pMat=metallic(0xd47a35,.25,.82),sMat=metallic(0x5eafe0,.25,.82);
    for(let i=0;i<pTurns;i++)addRing(.72,.045,pMat,-2.7,-1.5+i*(3/(pTurns-1||1)),0,Math.PI/2);
    for(let i=0;i<sTurns;i++)addRing(.72,.045,sMat,2.7,-1.5+i*(3/(sTurns-1||1)),0,Math.PI/2);
    const Vs=values.Vp*values.Ns/values.Np,Is=values.power/Math.max(Vs,.1);addBox(1.5,1.1,1.4,plastic(0x183d5b,.48),5.2,0,0);addCylinder(.055,2.0,pMat,4.0,.55,0,'x');addCylinder(.055,2.0,pMat,4.0,-.55,0,'x');
    readout.innerHTML=`<strong>V<sub>s</sub> ≈ ${fmt(Vs)} V</strong><span>I<sub>s</sub> ≈ ${fmt(Is)} A</span><span>turns ratio ${(values.Ns/values.Np).toFixed(2)}</span><span>higher V for fixed power lowers transmission current</span>`;
  }
  function fmt(n){const a=Math.abs(n);if(!Number.isFinite(n))return '—';return (a!==0&&(a<1e-3||a>=1e5))?n.toExponential(3):Number(n.toFixed(a<10?3:2)).toString()}

  function resize(){const r=stage.getBoundingClientRect();if(r.width<10||r.height<10)return;renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()}
  new ResizeObserver(()=>resize()).observe(stage);window.addEventListener('resize',resize);setTimeout(resize,50);
  const observer=new IntersectionObserver(entries=>{section.dataset.visible=entries[0]?.isIntersecting?'1':'0'},{threshold:.03});observer.observe(section);

  function animate(now){
    requestAnimationFrame(animate); if(section.dataset.visible==='0')return; const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;elapsed+=dt;
    dynamic.forEach(d=>{if(d.type==='orbit'){const a=elapsed*.45*d.speedFactor;d.sat.position.set(d.r*Math.cos(a),0,d.r*Math.sin(a));d.sat.rotation.y=-a;d.fArrow.position.copy(d.sat.position);d.fArrow.setDirection(new THREE.Vector3(-Math.cos(a),0,-Math.sin(a)));d.vArrow.position.copy(d.sat.position);d.vArrow.setDirection(new THREE.Vector3(-Math.sin(a),0,Math.cos(a)));}else if(d.type==='path'){const idx=Math.floor((elapsed*28)%d.pts.length);d.obj.position.copy(d.pts[idx]);}else if(d.type==='magnet'){d.obj.position.x=-3+Math.sin(elapsed*d.speed)*2.2;}});
    renderer.render(scene,camera);fpsSamples.push(1/Math.max(dt,.001));if(fpsSamples.length>40)fpsSamples.shift();if(Math.floor(now/1000)%2===0&&fpsSamples.length){const avg=fpsSamples.reduce((a,b)=>a+b,0)/fpsSamples.length;fpsEl.textContent=avg>45?'smooth · high quality':avg>28?'balanced quality':'performance mode'}
  }
  section.querySelector('#threeV8Vectors').onclick=e=>{vectors=!vectors;e.currentTarget.classList.toggle('primary',vectors);build(true)};
  section.querySelector('#threeV8Labels').onclick=e=>{labels=!labels;e.currentTarget.classList.toggle('primary',labels)};
  section.querySelector('#threeV8Reset').onclick=()=>{yaw=-.55;pitch=.35;distance=15;updateCamera()};
  values=defaults();setupTabs();renderControls();build();resize();requestAnimationFrame(animate);
}
