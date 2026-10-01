(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const DEG=Math.PI/180;
  const state={yaw:-28*DEG,pitch:18*DEG,zoom:1,auto:false,labels:true,flow:true,explode:false,selected:null,visible:true,last:0,drag:false,startX:0,startY:0,moved:0};
  let canvas=null,ctx=null,wrap=null,info=null,equipmentList=null,active='charge',hotspots=[],raf=0,sceneCache=null;

  const equipmentInfo={
    supply:['Low-voltage d.c. supply','Provides an adjustable potential difference. In practical work keep the current low enough to limit unwanted heating.'],
    cell:['Cell / battery','Provides emf. In the internal-resistance experiment its terminal p.d. falls as current increases because energy is transferred inside the source.'],
    ammeter:['Ammeter','Connect in series so the same current passes through the meter and the component. An ideal ammeter has zero resistance.'],
    voltmeter:['Voltmeter','Connect in parallel across the component whose p.d. is required. An ideal voltmeter has infinite resistance.'],
    resistor:['Fixed resistor','An ohmic resistor has I proportional to V when physical conditions, especially temperature, remain constant.'],
    rheostat:['Variable resistor','Changes circuit resistance and therefore current. It is used to sweep through operating points without rebuilding the circuit.'],
    lamp:['Filament lamp','As current rises the filament gets hotter, its resistance increases and the I–V characteristic curves.'],
    diode:['Semiconductor diode','Conducts strongly in one direction once forward biased sufficiently; reverse current is very small in the simple A-level model.'],
    wire:['Resistance wire','For a uniform wire R = ρL/A. RP5 changes the measured length while keeping material and diameter fixed.'],
    ruler:['Metre ruler','Measures the active wire length in RP5. Read the clip position carefully and avoid parallax.'],
    micrometer:['Micrometer','Measures wire diameter. Repeat at several positions and orientations because area depends on d².'],
    switch:['Switch','Lets the circuit be opened between readings to reduce heating and unnecessary cell discharge.'],
    ntc:['NTC thermistor','Its resistance falls as temperature rises. In a potential divider this converts temperature change into a changing output p.d.'],
    ldr:['LDR','Its resistance falls as light intensity increases. Its position in a potential divider determines whether output rises or falls with light.'],
    junction:['Junction','A branching point. Charge conservation means total current entering a junction equals total current leaving it.'],
    conductor:['Metal conductor','Contains mobile conduction electrons. Their slow drift is opposite to conventional current direction.']
  };

  function css(){
    if($('#sim3DV7Style'))return;
    const st=document.createElement('style');st.id='sim3DV7Style';st.textContent=`
      .viewer-wrap{position:relative;min-height:470px;overflow:hidden;background:radial-gradient(circle at 50% 18%,#183650 0,#081522 44%,#040b12 100%)}
      #simCanvas{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;opacity:0!important;pointer-events:none!important}
      #sim3DCanvas{display:block;width:100%;height:470px;touch-action:none;cursor:grab;outline:none}
      #sim3DCanvas.dragging{cursor:grabbing}
      .sim3d-badge{position:absolute;top:12px;left:12px;z-index:7;padding:7px 10px;border:1px solid rgba(117,211,255,.45);background:rgba(4,13,22,.78);backdrop-filter:blur(8px);border-radius:999px;font-size:.7rem;font-weight:900;color:#dff5ff}
      .sim3d-hint{position:absolute;left:12px;bottom:12px;z-index:7;max-width:min(680px,calc(100% - 24px));padding:7px 10px;border-radius:10px;background:rgba(4,13,22,.72);border:1px solid rgba(120,156,187,.3);font-size:.68rem;color:#c8deef;pointer-events:none}
      .sim3d-toolbar{display:flex;gap:7px;flex-wrap:wrap;align-items:center;margin:10px 0;padding:8px;border:1px solid #29465f;border-radius:12px;background:#071522}
      .sim3d-toolbar button{border:1px solid #365b77;background:#0a1c2d;color:var(--text);border-radius:999px;padding:7px 10px;font-size:.68rem;font-weight:900;cursor:pointer}
      .sim3d-toolbar button.active{border-color:#67c7ff;background:#173651;box-shadow:0 0 0 1px rgba(103,199,255,.2) inset}
      .sim3d-toolbar .sim3d-spacer{flex:1}.sim3d-toolbar .sim3d-camera{font:700 .66rem Consolas,monospace;color:#9fbcd2}
      .sim3d-panel{display:grid;grid-template-columns:minmax(0,1fr) minmax(260px,.48fr);gap:10px;margin:8px 0 14px}
      .sim3d-equip,.sim3d-info{border:1px solid #29465f;border-radius:12px;background:#071522;padding:10px}
      .sim3d-equip h4,.sim3d-info h4{margin:0 0 7px}.sim3d-equipment-list{display:flex;gap:6px;flex-wrap:wrap}
      .sim3d-equipment-list button{border:1px solid #31506e;background:#091a2a;color:#d9ebf8;border-radius:9px;padding:7px 9px;font-size:.68rem;cursor:pointer}
      .sim3d-equipment-list button.active{border-color:#ffd56a;box-shadow:0 0 0 2px rgba(255,213,106,.12) inset;color:#fff3c8}
      .sim3d-info p{margin:.35rem 0 0;font-size:.75rem;line-height:1.5;color:#c6d9e8}.sim3d-info strong{color:#f5fbff}
      .sim3d-scene-note{font-size:.69rem;color:#9fb7ca;margin:7px 0 0;line-height:1.45}
      @media(max-width:820px){#sim3DCanvas{height:390px}.viewer-wrap{min-height:390px}.sim3d-panel{grid-template-columns:1fr}.sim3d-toolbar .sim3d-spacer{display:none}}
      @media(prefers-reduced-motion:reduce){#sim3DCanvas{scroll-behavior:auto}.sim3d-hint{display:none}}
    `;document.head.appendChild(st);
  }

  function hexShade(hex,f){
    if(!/^#?[0-9a-f]{6}$/i.test(hex))return hex;
    const h=hex.replace('#','');
    const n=parseInt(h,16),r=(n>>16)&255,g=(n>>8)&255,b=n&255;
    const c=x=>Math.max(0,Math.min(255,Math.round(x*f))).toString(16).padStart(2,'0');
    return '#'+c(r)+c(g)+c(b);
  }
  function rotate(p){
    const cy=Math.cos(state.yaw),sy=Math.sin(state.yaw),cp=Math.cos(state.pitch),sp=Math.sin(state.pitch);
    const x=p.x*cy-p.z*sy,z=p.x*sy+p.z*cy;
    const y=p.y*cp-z*sp,z2=p.y*sp+z*cp;
    return{x,y,z:z2};
  }
  function proj(p){
    const r=rotate(p),w=canvas.clientWidth||900,h=canvas.clientHeight||470;
    const cam=820/state.zoom,depth=Math.max(180,cam+r.z),f=650;
    const s=f/depth;
    return{x:w/2+r.x*s,y:h*.57-r.y*s,z:r.z,s};
  }
  function path(points,color='#8aa6c3',width=4,dash=[]){
    if(!points?.length)return;
    ctx.beginPath();points.forEach((p,i)=>{const q=proj(p);i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y);});
    ctx.strokeStyle=color;ctx.lineWidth=width;ctx.setLineDash(dash);ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();ctx.setLineDash([]);
  }
  function box(o){
    const [sx,sy,sz]=o.size;const p=o.pos;const verts=[
      {x:p.x-sx/2,y:p.y-sy/2,z:p.z-sz/2},{x:p.x+sx/2,y:p.y-sy/2,z:p.z-sz/2},{x:p.x+sx/2,y:p.y+sy/2,z:p.z-sz/2},{x:p.x-sx/2,y:p.y+sy/2,z:p.z-sz/2},
      {x:p.x-sx/2,y:p.y-sy/2,z:p.z+sz/2},{x:p.x+sx/2,y:p.y-sy/2,z:p.z+sz/2},{x:p.x+sx/2,y:p.y+sy/2,z:p.z+sz/2},{x:p.x-sx/2,y:p.y+sy/2,z:p.z+sz/2}
    ];
    const faces=[[0,1,2,3],[4,5,6,7],[0,4,7,3],[1,5,6,2],[3,2,6,7],[0,1,5,4]];
    const shades=[.72,1,.82,.9,1.12,.62];
    const rendered=faces.map((ids,i)=>({ids,i,z:ids.reduce((a,id)=>a+rotate(verts[id]).z,0)/4})).sort((a,b)=>b.z-a.z);
    rendered.forEach(f=>{const ps=f.ids.map(id=>proj(verts[id]));ctx.beginPath();ctx.moveTo(ps[0].x,ps[0].y);ps.slice(1).forEach(q=>ctx.lineTo(q.x,q.y));ctx.closePath();ctx.fillStyle=hexShade(o.color,shades[f.i]);ctx.fill();ctx.strokeStyle='rgba(219,238,251,.22)';ctx.lineWidth=1;ctx.stroke();});
    const q=proj(p);hotspots.push({x:q.x,y:q.y,r:Math.max(20,Math.min(55,Math.max(sx,sy)*q.s*.7)),o});
    if(state.selected===o.id){ctx.beginPath();ctx.arc(q.x,q.y,Math.max(22,Math.max(sx,sy)*q.s*.8),0,Math.PI*2);ctx.strokeStyle='#ffd56a';ctx.lineWidth=3;ctx.stroke();}
    if(state.labels)label(o,q);
  }
  function sphere(o){
    const q=proj(o.pos),r=Math.max(3,o.r*q.s);const g=ctx.createRadialGradient(q.x-r*.3,q.y-r*.35,1,q.x,q.y,r);g.addColorStop(0,hexShade(o.color,1.45));g.addColorStop(1,hexShade(o.color,.55));ctx.beginPath();ctx.arc(q.x,q.y,r,0,Math.PI*2);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.stroke();
    hotspots.push({x:q.x,y:q.y,r:Math.max(16,r+6),o});if(state.labels&&o.label)label(o,q);
  }
  function cylinder(o){
    const [sx,sy,sz]=o.size;box({...o,size:[sx,sy,sz]});
    const q=proj({x:o.pos.x,y:o.pos.y,z:o.pos.z-sz/2});ctx.beginPath();ctx.ellipse(q.x,q.y,Math.max(5,sx*q.s/2),Math.max(3,sy*q.s/3),0,0,Math.PI*2);ctx.fillStyle=hexShade(o.color,1.08);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.stroke();
  }
  function label(o,q){
    const text=o.label||o.id;ctx.font='700 12px system-ui,sans-serif';const m=ctx.measureText(text),x=q.x-m.width/2-5,y=q.y-30;ctx.fillStyle='rgba(3,10,17,.8)';ctx.fillRect(x,y,m.width+10,19);ctx.strokeStyle='rgba(118,192,233,.35)';ctx.strokeRect(x,y,m.width+10,19);ctx.fillStyle='#e9f7ff';ctx.fillText(text,x+5,y+13);
  }
  function grid(){
    const range=360,step=60;for(let i=-range;i<=range;i+=step){path([{x:i,y:-95,z:-300},{x:i,y:-95,z:300}],'rgba(100,153,188,.12)',1);path([{x:-360,y:-95,z:i},{x:360,y:-95,z:i}],'rgba(100,153,188,.12)',1);}path([{x:-360,y:-95,z:0},{x:360,y:-95,z:0}],'rgba(103,199,255,.18)',1.4);path([{x:0,y:-95,z:-300},{x:0,y:-95,z:300}],'rgba(103,199,255,.18)',1.4);
  }
  function currentBeads(points,t){
    if(!state.flow||points.length<2)return;let segs=[],total=0;for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],d=Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z);segs.push({a,b,d,start:total});total+=d;}const count=12;for(let n=0;n<count;n++){let d=(t*.055+n*total/count)%total,seg=segs.find(s=>d>=s.start&&d<=s.start+s.d)||segs[0],u=(d-seg.start)/seg.d;const p={x:seg.a.x+(seg.b.x-seg.a.x)*u,y:seg.a.y+(seg.b.y-seg.a.y)*u,z:seg.a.z+(seg.b.z-seg.a.z)*u};const q=proj(p);ctx.beginPath();ctx.arc(q.x,q.y,3.2,0,Math.PI*2);ctx.fillStyle='#ffd56a';ctx.fill();ctx.shadowColor='#ffd56a';ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0;}
  }

  function E(id,type,pos,size,color,label,extra={}){return{id,type,pos:{...pos},size,color,label,...extra};}
  function scene(id){
    const ex=state.explode?1:0;
    const add=(x,y,z,dx=0,dy=0,dz=0)=>({x:x+dx*ex,y:y+dy*ex,z:z+dz*ex});
    if(id==='charge'){
      const eq=[E('supply','supply',add(-240,-20,-20,-45,20,-40),[110,80,70],'#325c7c','DC supply'),E('ammeter','ammeter',add(220,-20,-20,45,20,-35),[90,75,65],'#244b69','Ammeter'),E('conductor','conductor',add(0,25,0,0,40,30),[330,34,34],'#b87333','Metal wire')];
      const wires=[[{x:-190,y:-15,z:-15},{x:-150,y:25,z:0},{x:-165,y:25,z:0}],[{x:165,y:25,z:0},{x:175,y:-15,z:-10},{x:175,y:-15,z:-10}]];
      return{title:'3D charge-flow model',note:'Rotate the metal wire to compare the microscopic electron picture with the external circuit. The moving yellow markers show conventional current; blue particles in the conductor show electron drift in the opposite direction.',eq,wires,current:[{x:-190,y:-15,z:-15},{x:-150,y:25,z:0},{x:165,y:25,z:0},{x:175,y:-15,z:-10}],micro:true};
    }
    if(id==='iv'){
      const comp=Number($('[data-real-control="component"]')?.value||0);const kind=comp===1?'lamp':comp===2?'diode':'resistor';const lab=kind==='lamp'?'Filament lamp':kind==='diode'?'Diode':'Resistor';
      const eq=[E('supply','supply',add(-245,-25,-65,-45,20,-35),[105,78,70],'#315c7d','DC supply'),E('ammeter','ammeter',add(-80,-25,-65,-20,30,-30),[78,70,62],'#244b69','Ammeter'),E('rheostat','rheostat',add(85,-25,-65,20,35,-30),[120,58,68],'#694f86','Rheostat'),E('component',kind,add(245,-25,-65,45,20,-25),kind==='lamp'?[66,72,66]:[100,46,52],kind==='lamp'?'#d89c45':kind==='diode'?'#617fc8':'#b97842',lab),E('voltmeter','voltmeter',add(245,85,75,40,70,40),[82,70,62],'#28516f','Voltmeter')];
      const loop=[{x:-245,y:-25,z:-15},{x:-80,y:-25,z:-15},{x:85,y:-25,z:-15},{x:245,y:-25,z:-15},{x:245,y:-25,z:-120},{x:-245,y:-25,z:-120},{x:-245,y:-25,z:-15}];
      const vw=[[{x:205,y:-5,z:-45},{x:205,y:85,z:75},{x:245,y:85,z:75}],[{x:285,y:-5,z:-45},{x:285,y:85,z:75},{x:245,y:85,z:75}]];
      return{title:'3D I–V characteristics bench',note:'Ammeter and variable resistor are in series with the test component; the voltmeter is connected in parallel across that component. Change the component in the existing controls and the 3D apparatus updates.',eq,wires:[loop,...vw],current:loop};
    }
    if(id==='resistivity'){
      const eq=[E('supply','supply',add(-265,-35,-80,-45,20,-30),[105,78,70],'#315c7d','Low-voltage supply'),E('switch','switch',add(-125,-30,-80,-20,30,-25),[74,35,55],'#6f765e','Switch'),E('ammeter','ammeter',add(0,-35,-80,0,35,-30),[78,70,62],'#244b69','Ammeter'),E('ruler','ruler',add(70,-70,70,0,-5,45),[410,18,62],'#b99b63','Metre ruler'),E('wire','wire',add(70,-45,55,0,30,55),[400,12,12],'#b87333','Resistance wire'),E('voltmeter','voltmeter',add(70,75,115,0,75,55),[82,70,62],'#28516f','Voltmeter'),E('micrometer','micrometer',add(270,55,-60,70,80,-30),[94,65,70],'#747d88','Micrometer')];
      const loop=[{x:-265,y:-35,z:-40},{x:-125,y:-30,z:-40},{x:0,y:-35,z:-40},{x:-130,y:-45,z:55},{x:270,y:-45,z:55},{x:270,y:-35,z:-125},{x:-265,y:-35,z:-125},{x:-265,y:-35,z:-40}];
      const vwire=[[{x:-100,y:-45,z:55},{x:-100,y:75,z:115},{x:70,y:75,z:115}],[{x:240,y:-45,z:55},{x:240,y:75,z:115},{x:70,y:75,z:115}]];
      return{title:'3D RP5 resistivity bench',note:'Correct RP5 geometry: current is measured in series, p.d. is measured across the selected length of uniform wire, and diameter is measured separately with a micrometer. Open the switch between readings to limit heating.',eq,wires:[loop,...vwire],current:loop};
    }
    if(id==='circuits'){
      const par=String($('[data-real-control="parallel"]')?.value||'0')==='1';
      const eq=[E('cell','cell',add(-250,-35,-20,-50,20,-20),[90,65,62],'#477a5d','Cell'),E('ammeter','ammeter',add(-80,-35,-20,-15,30,-30),[78,70,62],'#244b69','Ammeter'),E('r1','resistor',add(100,par?45:-35,-20,20,par?55:35,-20),[105,42,48],'#b97842','R₁'),E('r2','resistor',add(100,par?-115:-35,par?95:120,25,par?-55:35,par?45:55),[105,42,48],'#9a6d47','R₂')];
      if(par){eq.push(E('j1','junction',add(5,-35,-20,0,20,0),[24,24,24],'#67c7ff','Junction'),E('j2','junction',add(210,-35,-20,25,20,0),[24,24,24],'#67c7ff','Junction'));const loop=[{x:-250,y:-35,z:15},{x:-80,y:-35,z:15},{x:5,y:-35,z:-20},{x:5,y:45,z:-20},{x:100,y:45,z:-20},{x:210,y:45,z:-20},{x:210,y:-35,z:-20},{x:210,y:-35,z:115},{x:-250,y:-35,z:115},{x:-250,y:-35,z:15}];const branch=[{x:5,y:-35,z:-20},{x:5,y:-115,z:95},{x:100,y:-115,z:95},{x:210,y:-115,z:95},{x:210,y:-35,z:-20}];return{title:'3D parallel-circuit model',note:'Both branches connect between the same two junctions, so they have the same p.d. Current splits at the first junction and recombines at the second.',eq,wires:[loop,branch],current:loop.concat(branch)}}
      const loop=[{x:-250,y:-35,z:15},{x:-80,y:-35,z:15},{x:100,y:-35,z:15},{x:100,y:-35,z:120},{x:250,y:-35,z:120},{x:250,y:-35,z:-90},{x:-250,y:-35,z:-90},{x:-250,y:-35,z:15}];return{title:'3D series-circuit model',note:'The two resistors are on one unbranched path, so the same current passes through both. The supply p.d. is shared between them.',eq,wires:[loop],current:loop};
    }
    if(id==='divider'){
      const sensor=Number($('[data-real-control="sensor"]')?.value||0);const kind=sensor===1?'ntc':sensor===2?'ldr':'resistor';const label=kind==='ntc'?'NTC thermistor':kind==='ldr'?'LDR':'Variable R₂';
      const eq=[E('supply','supply',add(-235,-25,-30,-45,20,-25),[105,78,70],'#315c7d','Supply'),E('r1','resistor',add(20,70,-30,0,65,-20),[105,42,48],'#b97842','R₁'),E('r2',kind,add(20,-85,-30,0,-65,-20),[105,42,48],kind==='ntc'?'#558d88':kind==='ldr'?'#9d874d':'#7f6948',label),E('voltmeter','voltmeter',add(225,-10,80,55,15,55),[82,70,62],'#28516f','Vout meter')];
      const loop=[{x:-235,y:-25,z:5},{x:-100,y:70,z:-30},{x:20,y:70,z:-30},{x:20,y:-85,z:-30},{x:-100,y:-85,z:-30},{x:-235,y:-25,z:-80},{x:-235,y:-25,z:5}];const vw=[[{x:20,y:-10,z:-30},{x:145,y:-10,z:80},{x:225,y:-10,z:80}],[{x:20,y:-85,z:-30},{x:145,y:-85,z:80},{x:225,y:-10,z:80}]];return{title:'3D potential-divider model',note:'R₁ and the lower component form a series chain across the supply. Vout is measured across the lower component, so changing its resistance changes its share of the supply p.d.',eq,wires:[loop,...vw],current:loop};
    }
    const eq=[E('cell','cell',add(-245,-25,-45,-45,20,-25),[100,70,64],'#477a5d','Cell ε, r'),E('switch','switch',add(-95,-25,-45,-15,35,-30),[74,35,55],'#6f765e','Switch'),E('ammeter','ammeter',add(35,-25,-45,0,40,-30),[78,70,62],'#244b69','Ammeter'),E('rheostat','rheostat',add(200,-25,-45,45,35,-25),[120,58,68],'#694f86','Variable load'),E('voltmeter','voltmeter',add(-245,90,95,-45,75,55),[82,70,62],'#28516f','Terminal V')];
    const loop=[{x:-245,y:-25,z:-10},{x:-95,y:-25,z:-10},{x:35,y:-25,z:-10},{x:200,y:-25,z:-10},{x:200,y:-25,z:-110},{x:-245,y:-25,z:-110},{x:-245,y:-25,z:-10}];const vw=[[{x:-285,y:-10,z:-10},{x:-285,y:90,z:95},{x:-245,y:90,z:95}],[{x:-205,y:-10,z:-10},{x:-205,y:90,z:95},{x:-245,y:90,z:95}]];return{title:'3D RP6 emf/internal-resistance bench',note:'The variable load and ammeter are in series with the cell. The voltmeter is across the cell terminals. Vary the load, record V and I, then plot V against I: intercept = ε and gradient = −r.',eq,wires:[loop,...vw],current:loop};
  }

  function fixSceneTypos(s){
    s.wires=(s.wires||[]).map(line=>line.map(p=>({x:Number(p.x)||0,y:Number(p.y)||0,z:Number(p.z)||0})));
    s.current=(s.current||[]).map(p=>({x:Number(p.x)||0,y:Number(p.y)||0,z:Number(p.z)||0}));return s;
  }
  function sceneFor(id){return fixSceneTypos(scene(id));}

  function draw(now=0){
    if(!canvas||!ctx||!state.visible)return;
    const dpr=Math.min(window.devicePixelRatio||1,document.querySelector('#view-lab')?.classList.contains('sim-v4-performance')?1:1.5);const w=Math.max(320,canvas.clientWidth),h=Math.max(300,canvas.clientHeight);const W=Math.round(w*dpr),H=Math.round(h*dpr);if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;ctx.setTransform(dpr,0,0,dpr,0,0)}else ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.clearRect(0,0,w,h);const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0d2740');bg.addColorStop(.55,'#081522');bg.addColorStop(1,'#030910');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);hotspots=[];grid();sceneCache=sceneFor(active);
    sceneCache.wires.forEach((ln,i)=>path(ln,i===0?'#5a7891':i%2?'#9a86ff':'#63d9a4',4));
    [...sceneCache.eq].sort((a,b)=>rotate(b.pos).z-rotate(a.pos).z).forEach(o=>o.type==='conductor'?cylinder(o):o.type==='junction'?sphere({...o,r:16}):box(o));
    if(sceneCache.micro){
      for(let i=0;i<18;i++){const u=(i/18+(now*.00003))%1;const x=-145+u*290;const y=22+Math.sin(i*1.7)*8,z=Math.cos(i*1.2)*9;const q=proj({x,y,z});ctx.beginPath();ctx.arc(q.x,q.y,4,0,Math.PI*2);ctx.fillStyle='#67c7ff';ctx.fill();}
      const q1=proj({x:-90,y:65,z:10}),q2=proj({x:80,y:65,z:10});ctx.strokeStyle='#67c7ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(q2.x,q2.y);ctx.lineTo(q1.x,q1.y);ctx.stroke();
    }
    currentBeads(sceneCache.current,now);
    canvas.dataset.sim3dScene=active;canvas.dataset.cameraYaw=state.yaw.toFixed(3);canvas.dataset.cameraPitch=state.pitch.toFixed(3);canvas.dataset.exploded=state.explode?'1':'0';
    const cam=$('#sim3DCamera');if(cam)cam.textContent=`yaw ${Math.round(state.yaw/DEG)}° · pitch ${Math.round(state.pitch/DEG)}° · zoom ${state.zoom.toFixed(1)}×`;
    if(state.auto&&!state.drag)state.yaw+=.0015;
  }
  function loop(now){if(now-state.last>28){state.last=now;draw(now)}raf=requestAnimationFrame(loop);}

  function selectEquipment(id){state.selected=id;const o=sceneCache?.eq.find(x=>x.id===id);$$('[data-3d-equipment]').forEach(b=>b.classList.toggle('active',b.dataset['3dEquipment']===id));if(o&&info){const meta=equipmentInfo[o.type]||[o.label,'Interactive apparatus in the current simulation.'];info.innerHTML=`<h4>${meta[0]}</h4><p>${meta[1]}</p>`;}draw(performance.now());}
  function renderEquipmentList(){if(!equipmentList)return;const s=sceneFor(active);equipmentList.innerHTML=s.eq.map(o=>`<button data-3d-equipment="${o.id}" title="Inspect ${o.label}">${o.label}</button>`).join('');if(info)info.innerHTML=`<h4>${s.title}</h4><p>${s.note}</p>`;const note=$('#sim3DSceneNote');if(note)note.textContent=s.note;}
  function setActive(id){if(!id)return;active=id;state.selected=null;renderEquipmentList();draw(performance.now());}
  function mount(){
    css();const old=$('#simCanvas');wrap=old?.closest('.viewer-wrap');if(!wrap)return;
    if(!$('#sim3DCanvas')){canvas=document.createElement('canvas');canvas.id='sim3DCanvas';canvas.tabIndex=0;canvas.setAttribute('role','img');canvas.setAttribute('aria-label','Interactive 3D electricity apparatus. Drag to orbit, use mouse wheel or trackpad scroll to zoom, and use the equipment buttons to inspect components.');wrap.appendChild(canvas);const badge=document.createElement('div');badge.className='sim3d-badge';badge.textContent='Interactive 3D laboratory';wrap.appendChild(badge);const hint=document.createElement('div');hint.className='sim3d-hint';hint.textContent='Drag to orbit · scroll to zoom · tap apparatus to inspect · use the existing sliders/switches to change the experiment';wrap.appendChild(hint);}else canvas=$('#sim3DCanvas');
    ctx=canvas.getContext('2d');
    if(!$('#sim3DToolbar')){const controls=$('.viewer-controls');const tb=document.createElement('div');tb.id='sim3DToolbar';tb.className='sim3d-toolbar';tb.innerHTML=`<button data-3d-action="reset">Reset view</button><button data-3d-action="auto">Auto orbit</button><button data-3d-action="labels" class="active">Labels</button><button data-3d-action="flow" class="active">Current flow</button><button data-3d-action="explode">Exploded view</button><span class="sim3d-spacer"></span><span class="sim3d-camera" id="sim3DCamera"></span>`;controls?.insertAdjacentElement('afterend',tb);const panel=document.createElement('div');panel.className='sim3d-panel';panel.id='sim3DPanel';panel.innerHTML=`<section class="sim3d-equip"><h4>3D equipment inspector</h4><div class="sim3d-equipment-list" id="sim3DEquipmentList"></div><p class="sim3d-scene-note" id="sim3DSceneNote"></p></section><section class="sim3d-info" id="sim3DInfo"><h4>3D apparatus</h4><p>Select a component to inspect its role and correct connection.</p></section>`;tb.insertAdjacentElement('afterend',panel);}
    equipmentList=$('#sim3DEquipmentList');info=$('#sim3DInfo');
    bind();setActive($('.sim-tab.active')?.dataset.sim||'charge');if(!raf)raf=requestAnimationFrame(loop);
  }
  function bind(){
    if(canvas.dataset.bound3d)return;canvas.dataset.bound3d='1';
    canvas.addEventListener('pointerdown',e=>{state.drag=true;state.startX=e.clientX;state.startY=e.clientY;state.moved=0;canvas.classList.add('dragging');canvas.setPointerCapture?.(e.pointerId);});
    canvas.addEventListener('pointermove',e=>{if(!state.drag)return;const dx=e.clientX-state.startX,dy=e.clientY-state.startY;state.startX=e.clientX;state.startY=e.clientY;state.moved+=Math.abs(dx)+Math.abs(dy);state.yaw+=dx*.007;state.pitch=Math.max(-.15,Math.min(.8,state.pitch+dy*.006));draw(performance.now());});
    const up=e=>{if(!state.drag)return;state.drag=false;canvas.classList.remove('dragging');if(state.moved<9){const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;let best=null,bd=Infinity;hotspots.forEach(h=>{const d=Math.hypot(h.x-x,h.y-y);if(d<h.r&&d<bd){best=h;bd=d;}});if(best)selectEquipment(best.o.id);} };canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
    canvas.addEventListener('wheel',e=>{e.preventDefault();state.zoom=Math.max(.65,Math.min(1.7,state.zoom*(e.deltaY>0?.92:1.08)));draw(performance.now());},{passive:false});
    canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft')state.yaw-=.08;if(e.key==='ArrowRight')state.yaw+=.08;if(e.key==='ArrowUp')state.pitch=Math.max(-.15,state.pitch-.06);if(e.key==='ArrowDown')state.pitch=Math.min(.8,state.pitch+.06);if(e.key==='+'||e.key==='=')state.zoom=Math.min(1.7,state.zoom*1.08);if(e.key==='-')state.zoom=Math.max(.65,state.zoom*.92);draw(performance.now());});
  }
  document.addEventListener('click',e=>{
    const sim=e.target.closest('.sim-tab');if(sim)setTimeout(()=>setActive(sim.dataset.sim),35);
    const b=e.target.closest('[data-3d-action]');if(b){const a=b.dataset['3dAction'];if(a==='reset'){state.yaw=-28*DEG;state.pitch=18*DEG;state.zoom=1}if(a==='auto')state.auto=!state.auto;if(a==='labels')state.labels=!state.labels;if(a==='flow')state.flow=!state.flow;if(a==='explode')state.explode=!state.explode;b.classList.toggle('active',a==='auto'?state.auto:a==='labels'?state.labels:a==='flow'?state.flow:state.explode);renderEquipmentList();draw(performance.now());}
    const eq=e.target.closest('[data-3d-equipment]');if(eq)selectEquipment(eq.dataset['3dEquipment']);
    if(e.target.closest('[data-open-sim]'))setTimeout(()=>setActive($('.sim-tab.active')?.dataset.sim||active),120);
  });
  document.addEventListener('input',e=>{if(e.target.closest('[data-real-control],[data-sim-control],[data-lp-control]')){sceneCache=null;renderEquipmentList();draw(performance.now());}});
  document.addEventListener('change',e=>{if(e.target.closest('[data-real-control],[data-sim-control],[data-lp-control]')){sceneCache=null;renderEquipmentList();draw(performance.now());}});
  window.addEventListener('resize',()=>draw(performance.now()));
  function start(){mount();const lab=$('#view-lab');if(lab&&'IntersectionObserver'in window)new IntersectionObserver(es=>{state.visible=es[0]?.isIntersecting??true;if(state.visible)draw(performance.now());},{threshold:.01}).observe(lab);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
