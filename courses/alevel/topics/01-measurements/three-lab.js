'use strict';
(function(){
  const API={ready:false,mode:'micrometer',scene:null,camera:null,renderer:null,root:null,controls:{yaw:-.35,pitch:.25,zoom:6},objects:{},state:{micrometer:0.52,zero:0,caliper:22.4,parallax:0}};
  function hasTHREE(){return typeof window.THREE!=='undefined'}
  function dispose(obj){if(!obj)return;obj.traverse?.(c=>{c.geometry?.dispose?.();if(c.material){(Array.isArray(c.material)?c.material:[c.material]).forEach(m=>m.dispose?.())}})}
  function mat(color,metal=.7,rough=.28){return new THREE.MeshStandardMaterial({color,metalness:metal,roughness:rough})}
  function box(w,h,d,color=0x73808c,metal=.7,rough=.3){return new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(color,metal,rough))}
  function cyl(r,h,color=0x8b98a4,metal=.8,rough=.25,radial=48){const g=new THREE.CylinderGeometry(r,r,h,radial);const m=new THREE.Mesh(g,mat(color,metal,rough));m.rotation.z=Math.PI/2;return m}
  function torus(R,r,color=0x7d8894){return new THREE.Mesh(new THREE.TorusGeometry(R,r,32,96),mat(color,.9,.22))}
  function plane(w,h,color=0x0d1721){return new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial({color,roughness:.85,metalness:.05}))}
  function labelSprite(text,color='#dff7ff'){
    const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.clearRect(0,0,c.width,c.height);x.fillStyle='rgba(5,13,22,.82)';x.roundRect?.(8,8,496,112,24);x.fill();x.strokeStyle='#365a78';x.lineWidth=4;x.stroke();x.font='700 42px system-ui';x.fillStyle=color;x.textAlign='center';x.textBaseline='middle';x.fillText(text,256,64);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true}));s.scale.set(3.2,.8,1);return s
  }
  function addStudio(){
    const floor=plane(14,10,0x18232d);floor.rotation.x=-Math.PI/2;floor.position.y=-1.75;floor.receiveShadow=true;API.scene.add(floor);
    const back=plane(14,8,0x0e1923);back.position.z=-3.5;back.position.y=1.5;API.scene.add(back);
    const amb=new THREE.HemisphereLight(0xcfeaff,0x25303a,2.3);API.scene.add(amb);
    const key=new THREE.DirectionalLight(0xffffff,4.4);key.position.set(4,7,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);API.scene.add(key);
    const rim=new THREE.DirectionalLight(0x77baff,2.2);rim.position.set(-5,2,-4);API.scene.add(rim);
    const fill=new THREE.PointLight(0x8ce99a,1.4,12);fill.position.set(-3,2,4);API.scene.add(fill);
  }
  function setup(container){
    if(!hasTHREE())return false;
    API.scene=new THREE.Scene();API.scene.background=new THREE.Color(0x050b12);
    API.camera=new THREE.PerspectiveCamera(40,1,.1,100);API.camera.position.set(4,2.4,6);
    API.renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});API.renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));API.renderer.shadowMap.enabled=true;API.renderer.shadowMap.type=THREE.PCFSoftShadowMap;API.renderer.outputColorSpace=THREE.SRGBColorSpace;API.renderer.toneMapping=THREE.ACESFilmicToneMapping;API.renderer.toneMappingExposure=1.25;
    container.innerHTML='';container.appendChild(API.renderer.domElement);API.renderer.domElement.className='three-canvas';
    API.root=new THREE.Group();API.scene.add(API.root);addStudio();bind(container);resize(container);window.addEventListener('resize',()=>resize(container));animate();API.ready=true;setMode('micrometer');return true
  }
  function resize(container){if(!API.renderer)return;const r=container.getBoundingClientRect(),w=Math.max(320,r.width),h=Math.max(320,r.height);API.renderer.setSize(w,h,false);API.camera.aspect=w/h;API.camera.updateProjectionMatrix()}
  function bind(){
    let drag=false,last={x:0,y:0};const el=API.renderer.domElement;
    el.addEventListener('pointerdown',e=>{drag=true;last={x:e.clientX,y:e.clientY};el.setPointerCapture?.(e.pointerId)});
    el.addEventListener('pointermove',e=>{if(!drag)return;API.controls.yaw+=(e.clientX-last.x)*.008;API.controls.pitch=Math.max(-.6,Math.min(.8,API.controls.pitch+(e.clientY-last.y)*.006));last={x:e.clientX,y:e.clientY}});
    el.addEventListener('pointerup',()=>drag=false);el.addEventListener('pointercancel',()=>drag=false);
    el.addEventListener('wheel',e=>{e.preventDefault();API.controls.zoom=Math.max(3.1,Math.min(11,API.controls.zoom+Math.sign(e.deltaY)*.45))},{passive:false});
  }
  function animate(){if(!API.renderer)return;requestAnimationFrame(animate);const c=API.controls;API.camera.position.set(Math.sin(c.yaw)*Math.cos(c.pitch)*c.zoom,Math.sin(c.pitch)*c.zoom*.75,Math.cos(c.yaw)*Math.cos(c.pitch)*c.zoom);API.camera.lookAt(0,0,0);API.renderer.render(API.scene,API.camera)}
  function clearRoot(){if(!API.root)return;while(API.root.children.length){const c=API.root.children.pop();dispose(c)}}
  function mmTicks(parent,startX,len,count,y,z){for(let i=0;i<=count;i++){const tick=box(.018,i%10===0?.23:i%5===0?.17:.11,.035,0x182129,.1,.75);tick.position.set(startX+i*(len/count),y+(tick.geometry.parameters.height/2),z);parent.add(tick);if(i%10===0){const s=labelSprite(String(i/10));s.scale.set(.45,.13,1);s.position.set(startX+i*(len/count),y+.38,z+.03);parent.add(s)}}}
  function buildMicrometer(){
    clearRoot();const G=new THREE.Group();G.rotation.y=-.12;API.root.add(G);
    const frame=torus(1.6,.22,0x5b6771);frame.scale.set(1.15,1,.7);frame.position.x=-.35;G.add(frame);
    const cut=box(1.8,2.15,1.2,0x050b12,0,.9);cut.position.set(.45,.1,0);G.add(cut);
    const anvil=cyl(.24,.55,0xcbd3d9);anvil.position.set(-1.2,0,0);G.add(anvil);
    const spindle=cyl(.18,1.65,0xcdd6dc);spindle.position.set(.15,0,0);G.add(spindle);API.objects.spindle=spindle;
    const sleeve=cyl(.45,2.15,0x8f9ba4);sleeve.position.set(1.35,0,0);G.add(sleeve);
    const thimble=cyl(.66,1.35,0x65727d);thimble.position.set(2.65,0,0);G.add(thimble);API.objects.thimble=thimble;
    const ratchet=cyl(.42,.55,0x444f58);ratchet.position.set(3.58,0,0);G.add(ratchet);
    for(let i=0;i<24;i++){const grip=box(.04,.86,.03,0x2d3740,.6,.5);grip.position.set(2.65,Math.cos(i/24*Math.PI*2)*.68,Math.sin(i/24*Math.PI*2)*.68);grip.rotation.x=i/24*Math.PI*2;G.add(grip)}
    const wire=cyl(.12,1.0,0xb87333,.75,.3);wire.position.set(-.55,0,0);G.add(wire);API.objects.wire=wire;
    const screen=labelSprite('0.52 mm');screen.position.set(.6,1.42,.2);G.add(screen);API.objects.label=screen;updateMicrometer();
  }
  function updateMicrometer(){if(!API.objects.spindle)return;const d=API.state.micrometer+API.state.zero;API.objects.spindle.position.x=.05+(d-.5)*.9;API.objects.thimble.rotation.x=(d*100)%50/50*Math.PI*2;if(API.objects.label){const parent=API.objects.label.parent;parent?.remove(API.objects.label);API.objects.label.material.map.dispose();API.objects.label.material.dispose();const s=labelSprite(`${d.toFixed(2)} mm`);s.position.set(.6,1.42,.2);parent?.add(s);API.objects.label=s}}
  function buildCaliper(){
    clearRoot();const G=new THREE.Group();G.rotation.y=-.08;API.root.add(G);
    const beam=box(5.6,.28,.35,0xa8b2ba,.88,.22);beam.position.x=.3;beam.castShadow=true;G.add(beam);mmTicks(G,-2.4,4.9,100,.18,.2);
    const fixed=box(.22,2.1,.42,0x89969f,.85,.28);fixed.position.set(-2.2,.7,0);G.add(fixed);const fixedTip=box(.75,.2,.42,0x89969f,.85,.28);fixedTip.position.set(-1.95,1.7,0);G.add(fixedTip);
    const slider=new THREE.Group();G.add(slider);API.objects.slider=slider;const body=box(1.3,.82,.62,0x606d77,.85,.24);slider.add(body);const jaw=box(.22,2.05,.48,0x89969f,.85,.28);jaw.position.set(-.48,.72,0);slider.add(jaw);const tip=box(.75,.2,.48,0x89969f,.85,.28);tip.position.set(-.72,1.68,0);slider.add(tip);
    const obj=box(.8,1.18,.8,0x2b8db7,.2,.42);obj.position.set(-1.2,.55,0);obj.castShadow=true;G.add(obj);API.objects.caliperObject=obj;
    const lab=labelSprite('22.4 mm');lab.position.set(.2,-1.0,.25);G.add(lab);API.objects.label=lab;updateCaliper();
  }
  function updateCaliper(){if(!API.objects.slider)return;API.objects.slider.position.x=-1.48+API.state.caliper/20*.9;if(API.objects.label){const parent=API.objects.label.parent;parent.remove(API.objects.label);API.objects.label.material.map.dispose();API.objects.label.material.dispose();const s=labelSprite(`${API.state.caliper.toFixed(1)} mm`);s.position.set(.2,-1.0,.25);parent.add(s);API.objects.label=s}}
  function buildParallax(){
    clearRoot();const G=new THREE.Group();API.root.add(G);const meter=box(5.4,2.45,.28,0xf0ece3,.03,.8);meter.position.z=-.2;G.add(meter);const face=plane(5.0,2.05,0xf7f2e7);face.position.z=.0;G.add(face);
    for(let i=0;i<=20;i++){const tick=box(.026,i%5===0?.48:.3,.035,0x222222,0,.9);tick.position.set(-2.25+i*.225,-.65+(tick.geometry.parameters.height/2),.03);G.add(tick)}
    const needle=box(.055,1.45,.04,0xd33b3b,.05,.7);needle.position.set(.35,.05,.07);needle.rotation.z=-.14;G.add(needle);API.objects.needle=needle;
    const eye=new THREE.Group();const eyeBall=new THREE.Mesh(new THREE.SphereGeometry(.2,40,20),new THREE.MeshStandardMaterial({color:0xe9eef2,roughness:.25}));const pupil=new THREE.Mesh(new THREE.SphereGeometry(.08,30,16),new THREE.MeshStandardMaterial({color:0x20384f,roughness:.2}));pupil.position.z=.18;eye.add(eyeBall,pupil);eye.position.set(API.state.parallax,1.3,2.1);G.add(eye);API.objects.eye=eye;updateParallax();const lab=labelSprite('Move viewing angle → apparent reading changes');lab.position.set(0,-1.55,.25);G.add(lab);
  }
  function updateParallax(){if(API.objects.eye)API.objects.eye.position.x=API.state.parallax}
  function buildComparison(){
    clearRoot();const G=new THREE.Group();API.root.add(G);const base=box(6.2,.18,2.2,0x2b3741,.6,.55);base.position.y=-1.25;G.add(base);const ruler=box(5.3,.18,.45,0xb58448,.2,.55);ruler.position.set(0,-.85,-.55);G.add(ruler);
    for(let i=0;i<=50;i++){const t=box(.015,i%10===0?.18:.1,.03,0x1d1710,0,.9);t.position.set(-2.45+i*.098,-.71,-.55);G.add(t)}
    const v=box(3.8,.24,.38,0x8e9aa3,.85,.25);v.position.set(0,.05,0);G.add(v);const s=box(.8,.65,.55,0x606d77,.85,.24);s.position.set(.4,.05,0);G.add(s);const micro=torus(.75,.16,0x6b7780);micro.position.set(0,.9,.15);micro.scale.set(1.15,1,.6);G.add(micro);
    [['Ruler · 1 mm',-1.9,-.86],['Vernier · 0.1 mm',-1.9,.02],['Micrometer · 0.01 mm',-1.9,.9]].forEach(([t,x,y])=>{const sp=labelSprite(t);sp.scale.set(2.15,.55,1);sp.position.set(x,y,.5);G.add(sp)});
  }
  function setMode(mode){API.mode=mode;API.objects={};if(mode==='micrometer')buildMicrometer();else if(mode==='caliper')buildCaliper();else if(mode==='parallax')buildParallax();else buildComparison()}
  function setValue(key,val){if(key in API.state){API.state[key]=+val;if(key==='micrometer'||key==='zero')updateMicrometer();if(key==='caliper')updateCaliper();if(key==='parallax')updateParallax()}}
  function reading(){if(API.mode==='micrometer')return {value:API.state.micrometer+API.state.zero,unit:'mm',resolution:.01};if(API.mode==='caliper')return {value:API.state.caliper,unit:'mm',resolution:.1};if(API.mode==='parallax'){const ideal=7.4,apparent=ideal+API.state.parallax*.18;return {value:apparent,unit:'scale divisions',resolution:.1,ideal}};return {value:null,unit:'',resolution:null}}
  window.Measurements3D={...API,setup,setMode,setValue,reading,get mode(){return API.mode},get state(){return API.state},get ready(){return API.ready}};
})();
