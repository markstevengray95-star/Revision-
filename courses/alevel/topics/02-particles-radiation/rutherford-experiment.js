
(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const K = 8.9875517923e9;
  const E_CHARGE = 1.602176634e-19;
  const Z_GOLD = 79;
  const Z_ALPHA = 2;

  let THREE=null,renderer=null,scene=null,camera=null,world=null,raycaster=null,pointer=null;
  let ready=false,paused=false,drag=false,moved=false,lastX=0,lastY=0;
  let mode='apparatus',impactFm=55,energyMeV=5.5;
  let counts={fired:0,straight:0,small:0,large:0};
  let alphaParticles=[],detectorFlashes=[],animationId=0;

  const info={
    source:{title:'Alpha source',info:'The source emits alpha particles: helium nuclei with charge +2e.',science:'Positive alpha particles are repelled by the positive gold nucleus.'},
    collimator:{title:'Lead collimator',info:'The lead block and narrow gap produce a directed alpha beam.',science:'A known incoming direction makes the scattering angle meaningful.'},
    foil:{title:'Thin gold foil',info:'Very thin gold foil reduces repeated scattering through many atoms.',science:'The measured direction can be interpreted mainly as one close encounter.'},
    detector:{title:'Fluorescent detector',info:'The detector flashes when an alpha particle arrives.',science:'Impact positions reveal the distribution of scattering angles.'},
    straight:{title:'Almost-straight path',info:'Most alpha particles travel through the foil with little deflection.',science:'Most of the atom is empty space.'},
    deflected:{title:'Deflected path',info:'An alpha passing nearer a nucleus experiences stronger electrostatic repulsion.',science:'Positive charge is concentrated rather than spread uniformly.'},
    back:{title:'Large-angle scattering',info:'A tiny fraction of alpha particles are scattered through very large angles.',science:'The atom contains a tiny dense positively charged nucleus.'},
    nucleus:{title:'Gold nucleus',info:'The nucleus contains concentrated positive charge and almost all atomic mass.',science:'The electrostatic force rises sharply at close separation.'},
    impact:{title:'Impact parameter',info:'Impact parameter b is the sideways offset of the incoming path from the nucleus centre.',science:'Smaller b means closer approach and a larger scattering angle.'},
    trajectory:{title:'Coulomb trajectory',info:'The alpha trajectory bends because alpha and nucleus are both positively charged.',science:'Higher alpha energy reduces deflection; smaller b increases it.'}
  };

  function addView(){
    const nav=$('.main-nav'),main=$('main.main');
    if(!nav||!main||$('#view-rutherfordexp'))return;

    const navButton=document.createElement('button');
    navButton.className='nav-button';
    navButton.dataset.view='rutherfordexp';
    navButton.textContent='Rutherford experiment';
    nav.appendChild(navButton);

    const section=document.createElement('section');
    section.id='view-rutherfordexp';
    section.className='view';
    section.innerHTML=
      '<div class="ruth-view">'+
        '<div class="panel ruth-hero">'+
          '<div><span class="eyebrow">AQA 3.8.1.1 · Nuclear Physics extension</span><h2>3D Rutherford alpha-scattering experiment</h2><p>Rotate the apparatus, zoom, click its parts and fire alpha particles through the foil to connect observations to the nuclear model.</p></div>'+
          '<div class="ruth-controls">'+
            '<button class="button primary" id="ruthFireOne">Fire one α</button>'+
            '<button class="button" id="ruthFireBeam">Fire beam</button>'+
            '<button class="button" id="ruthPause">Pause</button>'+
            '<button class="button" id="ruthReset">Reset</button>'+
            '<button class="button" id="ruthResetCamera">Reset 3D view</button>'+
          '</div>'+
        '</div>'+
        '<div class="ruth-layout">'+
          '<div class="panel ruth-stage">'+
            '<div class="ruth-canvas-wrap">'+
              '<canvas id="rutherfordExperimentCanvas" aria-label="Interactive 3D Rutherford alpha scattering experiment"></canvas>'+
              '<span class="ruth-stage-label" id="ruthStageLabel">3D apparatus view</span>'+
              '<div class="ruth-legend"><span>Drag = rotate</span><span>Wheel = zoom</span><span>Click = explain</span></div>'+
              '<div id="ruth3DStatus" class="ruth-3d-status">Loading 3D Rutherford apparatus…</div>'+
            '</div>'+
            '<div class="ruth-controls"><button class="button active" data-ruth-mode="apparatus">3D apparatus</button><button class="button" data-ruth-mode="closeup">3D nuclear close-up</button></div>'+
            '<p class="model-note">The geometry and scale are schematic so the apparatus can be explored clearly. The close-up preserves the correct Coulomb-scattering trends.</p>'+
          '</div>'+
          '<aside class="ruth-side">'+
            '<div class="panel ruth-card ruth-click-card"><span class="eyebrow">Click the 3D model</span><h3 id="ruthClickTitle">Select a part of the experiment</h3><p id="ruthClickInfo">Click the source, collimator, foil, detector, nucleus or a trajectory.</p><div id="ruthClickScience" class="ruth-click-science"><strong>Science:</strong> scattering observations led to the nuclear model.</div></div>'+
            '<div class="panel ruth-card"><h3>What should I notice?</h3><div class="ruth-observation-grid"><div class="ruth-observation"><span>Particles fired</span><strong id="ruthFired">0</strong></div><div class="ruth-observation"><span>Little / no deflection</span><strong id="ruthStraight">0</strong></div><div class="ruth-observation"><span>Large deflection</span><strong id="ruthLarge">0</strong></div></div><p class="small subtle">Beam frequencies are illustrative; learn the qualitative observations.</p></div>'+
            '<div class="panel ruth-card" id="ruthCloseControls" hidden><h3>Change the 3D close encounter</h3><div class="ruth-mode-grid"><div class="ruth-field"><label for="ruthImpact">Impact parameter b</label><input id="ruthImpact" type="range" min="5" max="220" value="55" step="1"><div class="small subtle"><span id="ruthImpactVal">55</span> fm</div></div><div class="ruth-field"><label for="ruthEnergy">Alpha kinetic energy</label><input id="ruthEnergy" type="range" min="3" max="8" value="5.5" step="0.1"><div class="small subtle"><span id="ruthEnergyVal">5.5</span> MeV</div></div></div><div class="ruth-readout" id="ruthAngleReadout"></div></div>'+
            '<div class="panel ruth-card"><h3>The science in one sentence</h3><p class="ruth-insight"><strong>Most pass through because atoms are mostly empty space; rare large deflections show that positive charge and most mass are concentrated in a tiny nucleus.</strong></p></div>'+
          '</aside>'+
        '</div>'+
        '<div class="panel ruth-card"><div class="section-head"><div><span class="eyebrow">Observation → inference</span><h2>How the experiment changed the atomic model</h2></div></div><div class="ruth-evidence"><div class="ruth-evidence-row"><strong>Observation</strong><strong>What it tells us</strong><strong>Conclusion</strong></div><div class="ruth-evidence-row"><span>Most pass straight through.</span><span>Very little concentrated matter or charge is encountered.</span><span>The atom is mostly empty space.</span></div><div class="ruth-evidence-row"><span>Some are deflected.</span><span>Positive alpha particles are repelled.</span><span>Positive charge is concentrated.</span></div><div class="ruth-evidence-row"><span>Very few scatter through large angles.</span><span>A strong force acts in a tiny region.</span><span>Most charge and mass are in a tiny dense nucleus.</span></div></div></div>'+
        '<div class="ruth-steps"><article class="ruth-step"><span class="eyebrow">Step 1</span><h4>Form a beam</h4><p>The source and collimator create a narrow beam.</p></article><article class="ruth-step"><span class="eyebrow">Step 2</span><h4>Hit thin gold foil</h4><p>Thin foil helps single scattering dominate.</p></article><article class="ruth-step"><span class="eyebrow">Step 3</span><h4>Detect impacts</h4><p>The screen reveals where alpha particles arrive.</p></article><article class="ruth-step"><span class="eyebrow">Step 4</span><h4>Compare angles</h4><p>Most are straight; some bend; very few reverse strongly.</p></article><article class="ruth-step"><span class="eyebrow">Step 5</span><h4>Reject diffuse charge</h4><p>A spread-out positive charge cannot explain large deflections.</p></article><article class="ruth-step"><span class="eyebrow">Step 6</span><h4>Infer a nucleus</h4><p>The evidence supports a tiny dense positive nucleus.</p></article></div>'+
      '</div>';

    main.appendChild(section);

    navButton.addEventListener('click',()=>{
      $$('.view').forEach(v=>v.classList.toggle('active-view',v===section));
      $$('.nav-button').forEach(b=>b.classList.toggle('active',b===navButton));
      if(ready){resize3D();render3D();}
    });
    $$('.nav-button').filter(b=>b!==navButton).forEach(b=>b.addEventListener('click',()=>section.classList.remove('active-view')));

    bindUI();
    loadThree();
    injectLabLauncher();
  }

  function injectLabLauncher(){
    const side=$('.lab-side');
    if(!side||$('#ruthLabLauncher'))return;
    const box=document.createElement('div');
    box.id='ruthLabLauncher';
    box.className='ruth-launch-card';
    box.style.display='none';
    box.innerHTML='<h3>Open the full 3D Rutherford experiment</h3><p>Rotate the apparatus, fire alpha particles and click the source, foil, detector and trajectories.</p><button class="button primary" id="openRuthFull">Open 3D experiment</button>';
    side.prepend(box);
    $('#openRuthFull').onclick=()=>$('[data-view="rutherfordexp"]')?.click();
    const refresh=()=>{box.style.display=$('.sim-tab.active')?.dataset.sim==='rutherford'?'block':'none';};
    $('#simNav')?.addEventListener('click',()=>setTimeout(refresh,0));
    refresh();
  }

  function bindUI(){
    $('#ruthFireOne')?.addEventListener('click',()=>fire(1));
    $('#ruthFireBeam')?.addEventListener('click',()=>fire(60));
    $('#ruthPause')?.addEventListener('click',()=>{paused=!paused;$('#ruthPause').textContent=paused?'Resume':'Pause';});
    $('#ruthReset')?.addEventListener('click',resetExperiment);
    $('#ruthResetCamera')?.addEventListener('click',resetCamera);

    $$('[data-ruth-mode]').forEach(btn=>btn.addEventListener('click',()=>{
      mode=btn.dataset.ruthMode;
      $$('[data-ruth-mode]').forEach(x=>x.classList.toggle('active',x===btn));
      $('#ruthStageLabel').textContent=mode==='apparatus'?'3D apparatus view':'3D single-nucleus close-up';
      $('#ruthCloseControls').hidden=mode!=='closeup';
      if(ready)rebuildWorld();
    }));

    $('#ruthImpact')?.addEventListener('input',e=>{impactFm=Number(e.target.value);$('#ruthImpactVal').textContent=impactFm.toFixed(0);updateAngle();if(ready&&mode==='closeup')rebuildWorld();});
    $('#ruthEnergy')?.addEventListener('input',e=>{energyMeV=Number(e.target.value);$('#ruthEnergyVal').textContent=energyMeV.toFixed(1);updateAngle();if(ready&&mode==='closeup')rebuildWorld();});
    updateAngle();
  }

  async function loadThree(){
    try{
      const T=await import('./vendor/three.module.min.js');
      initThree(T);
    }catch(err){
      if($('#ruth3DStatus'))$('#ruth3DStatus').textContent='3D engine could not load on this network.';
    }
  }

  function initThree(T){
    THREE=T;
    const canvas=$('#rutherfordExperimentCanvas');
    if(!canvas)return;

    renderer=new THREE.WebGLRenderer({canvas:canvas,antialias:true,alpha:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.1;

    scene=new THREE.Scene();
    scene.fog=new THREE.FogExp2(0x06111f,.025);
    camera=new THREE.PerspectiveCamera(42,1,.1,100);
    world=new THREE.Group();
    scene.add(world);

    scene.add(new THREE.HemisphereLight(0xeaf8ff,0x1d2d43,1.9));
    const key=new THREE.DirectionalLight(0xffffff,2.4);key.position.set(4,7,8);scene.add(key);
    const blue=new THREE.PointLight(0x67c7ff,18,18,2);blue.position.set(-4,2,4);scene.add(blue);
    const gold=new THREE.PointLight(0xffca72,12,15,2);gold.position.set(2,1,4);scene.add(gold);

    raycaster=new THREE.Raycaster();
    pointer=new THREE.Vector2();
    setupPointerControls(canvas);
    new ResizeObserver(resize3D).observe(canvas.parentElement);
    window.addEventListener('resize',resize3D);

    ready=true;
    resize3D();
    rebuildWorld();

    if($('#ruth3DStatus')){
      $('#ruth3DStatus').textContent='3D ready · drag, zoom and click the apparatus';
      setTimeout(()=>$('#ruth3DStatus').style.opacity='.35',1800);
    }

    const loop=()=>{
      animationId=requestAnimationFrame(loop);
      if(!paused)updateParticles();
      pulseInteractiveObjects();
      render3D();
    };
    loop();
  }

  function setupPointerControls(canvas){
    canvas.addEventListener('pointerdown',e=>{drag=true;moved=false;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture?.(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{
      if(!drag)return;
      const dx=e.clientX-lastX,dy=e.clientY-lastY;
      if(Math.abs(dx)+Math.abs(dy)>3)moved=true;
      world.rotation.y+=dx*.008;
      world.rotation.x=Math.max(-1,Math.min(1,world.rotation.x+dy*.006));
      lastX=e.clientX;lastY=e.clientY;
    });
    canvas.addEventListener('pointerup',e=>{drag=false;if(!moved)pick3D(e);});
    canvas.addEventListener('wheel',e=>{e.preventDefault();camera.position.z=Math.max(6,Math.min(19,camera.position.z+e.deltaY*.012));},{passive:false});
  }

  function resetCamera(){
    if(!camera||!world)return;
    camera.position.set(0,3,mode==='apparatus'?12.8:10.2);
    camera.lookAt(0,0,0);
    world.rotation.set(-.08,-.12,0);
  }

  function resize3D(){
    const canvas=$('#rutherfordExperimentCanvas');
    if(!renderer||!camera||!canvas)return;
    const rect=canvas.parentElement.getBoundingClientRect();
    const w=Math.max(320,rect.width),h=Math.max(300,rect.height);
    renderer.setSize(w,h,false);
    camera.aspect=w/h;
    camera.updateProjectionMatrix();
  }

  function clearWorld(){
    if(!world)return;
    while(world.children.length){
      const o=world.children.pop();
      o.traverse?.(x=>{
        x.geometry?.dispose?.();
        if(x.material){if(Array.isArray(x.material))x.material.forEach(m=>m.dispose?.());else x.material.dispose?.();}
      });
    }
    alphaParticles=[];detectorFlashes=[];
  }

  function material(color,opts={}){
    return new THREE.MeshStandardMaterial({
      color:color,
      roughness:opts.roughness===undefined?.34:opts.roughness,
      metalness:opts.metalness===undefined?.12:opts.metalness,
      transparent:opts.opacity!==undefined&&opts.opacity<1,
      opacity:opts.opacity===undefined?1:opts.opacity,
      emissive:opts.emissive===undefined?0x000000:opts.emissive,
      emissiveIntensity:opts.emissiveIntensity===undefined?0:opts.emissiveIntensity
    });
  }

  function mark(object,key){
    object.userData.ruthKey=key;
    object.traverse?.(x=>x.userData.ruthKey=key);
    return object;
  }

  function glowSphere(r,color,key){
    const m=new THREE.Mesh(new THREE.SphereGeometry(r,28,20),material(color,{roughness:.18,metalness:.08,emissive:color,emissiveIntensity:.22}));
    if(key)mark(m,key);
    return m;
  }

  function lineFrom(points,color,opacity,key){
    const geom=new THREE.BufferGeometry().setFromPoints(points);
    const matl=new THREE.LineBasicMaterial({color:color,transparent:opacity<1,opacity:opacity});
    const line=new THREE.Line(geom,matl);
    if(key)mark(line,key);
    return line;
  }

  function makeLabel(text){
    const cv=document.createElement('canvas');cv.width=512;cv.height=96;
    const x=cv.getContext('2d');
    x.fillStyle='rgba(5,15,26,.88)';x.strokeStyle='rgba(126,216,255,.55)';x.lineWidth=3;
    x.beginPath();x.roundRect(8,8,496,80,18);x.fill();x.stroke();
    x.fillStyle='#dff4ff';x.font='700 27px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,49);
    const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));
    sp.scale.set(2.5,.47,1);
    return sp;
  }

  function addLabel(parent,text,y,key){
    const label=makeLabel(text);label.position.y=y;if(key)mark(label,key);parent.add(label);
  }

  function rebuildWorld(){
    clearWorld();
    resetCamera();
    if(mode==='apparatus')buildApparatus();else buildCloseup();
  }

  function buildApparatus(){
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(14,8),material(0x071423,{roughness:.82,metalness:.08,opacity:.55}));
    floor.rotation.x=-Math.PI/2;floor.position.y=-2.3;world.add(floor);

    const sourceG=new THREE.Group();sourceG.position.set(-5.1,0,0);
    const housing=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,1.15,32),material(0x59697b,{metalness:.55,roughness:.28}));housing.rotation.z=Math.PI/2;sourceG.add(housing);
    const active=glowSphere(.24,0xffc85f,'source');active.position.x=.62;sourceG.add(active);addLabel(sourceG,'1 · α source',1,'source');mark(sourceG,'source');world.add(sourceG);

    const col=new THREE.Group();col.position.set(-3.1,0,0);
    const top=new THREE.Mesh(new THREE.BoxGeometry(.7,1.6,2.1),material(0x5b6572,{metalness:.62,roughness:.32}));top.position.y=1.15;
    const bottom=top.clone();bottom.position.y=-1.15;col.add(top,bottom);
    const side1=new THREE.Mesh(new THREE.BoxGeometry(.7,.7,.55),material(0x5b6572,{metalness:.62,roughness:.32}));side1.position.z=.8;
    const side2=side1.clone();side2.position.z=-.8;col.add(side1,side2);addLabel(col,'2 · collimator',2.15,'collimator');mark(col,'collimator');world.add(col);

    const foilG=new THREE.Group();
    const foil=new THREE.Mesh(new THREE.BoxGeometry(.055,3.9,3.9),material(0xe6c55f,{metalness:.78,roughness:.2,emissive:0x8a6418,emissiveIntensity:.15}));foilG.add(foil);
    const nucleus=glowSphere(.23,0xffa65e,'nucleus');nucleus.position.set(.12,0,0);foilG.add(nucleus);
    addLabel(foilG,'3 · thin gold foil',2.45,'foil');mark(foilG,'foil');nucleus.userData.ruthKey='nucleus';world.add(foilG);

    const detectorG=new THREE.Group();
    const tor=new THREE.Mesh(new THREE.TorusGeometry(4.05,.10,14,100,Math.PI*1.72),material(0x66d9a6,{roughness:.24,metalness:.15,emissive:0x1f6d50,emissiveIntensity:.6,opacity:.9}));
    // Detector is laid horizontally around the foil, matching the top-down scattering geometry.
    tor.rotation.x=Math.PI/2;tor.rotation.z=-Math.PI*.86;detectorG.add(tor);addLabel(detectorG,'4 · detector',1.15,'detector');mark(detectorG,'detector');world.add(detectorG);

    world.add(lineFrom([new THREE.Vector3(-4.45,0,0),new THREE.Vector3(-.12,0,0)],0x67c7ff,.45,'straight'));
    addExamplePath(.08,0x78dcff,'straight');
    addExamplePath(.72,0xffd56a,'deflected');
    addExamplePath(-1.35,0xff8a95,'back');
    showInfo('straight');
  }

  function addExamplePath(angle,color,key){
    const start=new THREE.Vector3(-4.45,.08,0),hit=new THREE.Vector3(0,.08,0),len=4.3;
    // Scatter in the horizontal X–Z plane so trajectories meet the horizontal detector arc.
    const end=new THREE.Vector3(Math.cos(angle)*len,.08,Math.sin(angle)*len);
    world.add(lineFrom([start,hit,end],color,.42,key));
  }

  function buildCloseup(){
    const nucleus=new THREE.Group();
    for(let i=0;i<55;i++){
      const p=glowSphere(.13,i%3===0?0x72a9ff:0xff8a7a,'nucleus');
      const phi=Math.acos(2*Math.random()-1),theta=Math.random()*Math.PI*2,r=.65*Math.cbrt(Math.random());
      p.position.set(r*Math.sin(phi)*Math.cos(theta),r*Math.cos(phi),r*Math.sin(phi)*Math.sin(theta));nucleus.add(p);
    }
    mark(nucleus,'nucleus');addLabel(nucleus,'Au nucleus (+79e)',1.35,'nucleus');world.add(nucleus);

    [1.2,2,2.8].forEach(rad=>{const tor=new THREE.Mesh(new THREE.TorusGeometry(rad,.018,8,80),new THREE.MeshBasicMaterial({color:0xff7b87,transparent:true,opacity:.18}));tor.rotation.x=Math.PI/2;world.add(tor);});

    const b=impactFm/75,theta=scatterAngle(impactFm,energyMeV)*Math.PI/180;
    const start=new THREE.Vector3(-5,b,0),closest=new THREE.Vector3(-.65,b*.55,0),outAngle=-Math.min(theta,Math.PI*.93);
    const end=new THREE.Vector3(closest.x+Math.cos(outAngle)*5.2,closest.y+Math.sin(outAngle)*5.2,Math.sin(outAngle*.7));
    world.add(lineFrom([start,new THREE.Vector3(.2,b,0)],0x7898ad,.34,'impact'));
    world.add(lineFrom([new THREE.Vector3(-3,0,0),new THREE.Vector3(-3,b,0)],0xb8dfff,.65,'impact'));

    const curve=new THREE.CatmullRomCurve3([start,new THREE.Vector3(-2.7,b,0),closest,new THREE.Vector3(closest.x+Math.cos(outAngle)*1.8,closest.y+Math.sin(outAngle)*1.8,.25),end]);
    world.add(lineFrom(curve.getPoints(100),0x7ee8ff,.95,'trajectory'));
    const alpha=glowSphere(.16,0x7ee8ff,'trajectory');world.add(alpha);
    alphaParticles.push({mesh:alpha,curve:curve,t:0,speed:.0026,category:'large',loop:true});

    const impactLabel=makeLabel('impact parameter b');impactLabel.position.set(-3,b/2+.35,0);impactLabel.scale.set(2,.38,1);mark(impactLabel,'impact');world.add(impactLabel);
    updateAngle();showInfo('trajectory');
  }

  function fire(n){
    if(!ready)return;
    if(mode==='closeup'){alphaParticles.forEach(p=>p.t=0);paused=false;$('#ruthPause').textContent='Pause';return;}
    for(let i=0;i<n;i++){
      const r=Math.random();let angle,category;
      if(r<.88){angle=(Math.random()-.5)*.055;category='straight';}
      else if(r<.985){angle=(Math.random()<.5?-1:1)*(.12+Math.random()*.35);category='small';}
      else{angle=(Math.random()<.5?-1:1)*(1+Math.random()*1.35);category='large';}
      const z=(Math.random()-.5)*.18,start=new THREE.Vector3(-4.45,.08,z),hit=new THREE.Vector3(0,.08,z*.25);
      const end=new THREE.Vector3(hit.x+Math.cos(angle)*5.2,.08,hit.z+Math.sin(angle)*5.2);
      const curve=new THREE.CatmullRomCurve3([start,new THREE.Vector3(-2.2,.08,start.z),hit,new THREE.Vector3(hit.x+Math.cos(angle)*1.8,.08,hit.z+Math.sin(angle)*1.8),end]);
      const key=category==='straight'?'straight':category==='large'?'back':'deflected';
      const color=category==='straight'?0x7ee8ff:category==='small'?0xffd56a:0xff8a95;
      world.add(lineFrom(curve.getPoints(80),color,.2,key));
      const alpha=glowSphere(.095,color,key);world.add(alpha);alphaParticles.push({mesh:alpha,curve:curve,t:0,speed:.0055+Math.random()*.003,category:category,loop:false,flashDone:false});
      counts.fired++;counts[category==='straight'?'straight':category==='small'?'small':'large']++;
    }
    updateCounts();paused=false;$('#ruthPause').textContent='Pause';
  }

  function updateParticles(){
    for(const p of alphaParticles){
      p.t+=p.speed;
      if(p.loop&&p.t>1)p.t=0;
      if(p.t<=1){p.mesh.visible=true;p.mesh.position.copy(p.curve.getPoint(Math.min(1,p.t)));p.mesh.scale.setScalar(1+.12*Math.sin(performance.now()*.012));}
      else if(!p.loop){p.mesh.visible=false;if(!p.flashDone){p.flashDone=true;makeFlash(p);}}
    }
    for(const f of detectorFlashes){f.life-=.022;f.mesh.material.opacity=Math.max(0,f.life);f.mesh.scale.setScalar(1+(1-f.life)*2);}
    detectorFlashes=detectorFlashes.filter(f=>{if(f.life<=0){world.remove(f.mesh);f.mesh.geometry.dispose();f.mesh.material.dispose();return false;}return true;});
  }

  function makeFlash(p){
    if(mode!=='apparatus')return;
    const f=glowSphere(.14,0xf6ff95,'detector');f.position.copy(p.curve.getPoint(1));f.material.transparent=true;f.material.opacity=1;world.add(f);detectorFlashes.push({mesh:f,life:1});
  }

  function pulseInteractiveObjects(){
    if(!world||!camera)return;
    const t=performance.now()*.001;
    world.traverse(o=>{
      if(o.isSprite)o.quaternion.copy(camera.quaternion);
      if(o.userData?.ruthKey&&o.material?.emissiveIntensity!==undefined)o.material.emissiveIntensity=.18+.12*(1+Math.sin(t*3))/2;
    });
  }

  function pick3D(e){
    const rect=renderer.domElement.getBoundingClientRect();
    pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
    raycaster.setFromCamera(pointer,camera);
    const hits=raycaster.intersectObjects(world.children,true);
    for(const h of hits){const key=findKey(h.object);if(key){showInfo(key);highlightKey(key);return;}}
  }

  function findKey(o){
    let n=o;while(n&&n!==world){if(n.userData?.ruthKey)return n.userData.ruthKey;n=n.parent;}return null;
  }

  function highlightKey(key){
    world.traverse(o=>{if(!o.material||!o.userData?.ruthKey)return;if(o.material.emissiveIntensity!==undefined)o.material.emissiveIntensity=o.userData.ruthKey===key?.8:.16;});
  }

  function showInfo(key){
    const d=info[key]||info.nucleus;
    if($('#ruthClickTitle'))$('#ruthClickTitle').textContent=d.title;
    if($('#ruthClickInfo'))$('#ruthClickInfo').textContent=d.info;
    if($('#ruthClickScience'))$('#ruthClickScience').innerHTML='<strong>Science:</strong> '+d.science;
    window.dispatchEvent(new CustomEvent('particlelab:hotspot',{detail:{sim:'rutherford-experiment',title:d.title}}));
  }

  function scatterAngle(bFm,eMeV){
    const E=eMeV*1e6*E_CHARGE,b=Math.max(.1,bFm)*1e-15;
    return 2*Math.atan(K*Z_GOLD*Z_ALPHA*E_CHARGE*E_CHARGE/(2*E*b))*180/Math.PI;
  }

  function updateAngle(){
    const theta=scatterAngle(impactFm,energyMeV),el=$('#ruthAngleReadout');
    if(el)el.innerHTML='θ ≈ <strong>'+theta.toFixed(1)+'°</strong><br><span class="subtle">smaller b or lower energy → larger scattering angle</span>';
  }

  function updateCounts(){
    if($('#ruthFired'))$('#ruthFired').textContent=counts.fired;
    if($('#ruthStraight'))$('#ruthStraight').textContent=counts.straight;
    if($('#ruthLarge'))$('#ruthLarge').textContent=counts.large;
  }

  function resetExperiment(){counts={fired:0,straight:0,small:0,large:0};updateCounts();paused=false;$('#ruthPause').textContent='Pause';if(ready)rebuildWorld();}
  function render3D(){if(renderer&&scene&&camera)renderer.render(scene,camera);}
  function init(){addView();}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
