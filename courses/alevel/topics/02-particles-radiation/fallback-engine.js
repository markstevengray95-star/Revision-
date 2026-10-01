(() => {
  'use strict';

  const H = 6.62607015e-34;
  const E = 1.602176634e-19;
  const ME = 9.1093837015e-31;
  const C = 299792458;
  const MP = 1.67262192595e-27;
  const MN = 1.67492750056e-27;

  let active = false;
  let canvas, ctx, raf = 0, started = performance.now(), current = 'atom';
  let drawFrame = () => {};
  const $ = s => document.querySelector(s);

  const palette = {
    bg:'#081421', grid:'#17304a', text:'#eaf5ff', muted:'#95abc1',
    proton:'#ff7777', neutron:'#72a9ff', electron:'#7ee8ff',
    photon:'#ffe88a', good:'#63d9a4', bad:'#ff7b87', purple:'#b895ff',
    orange:'#ffc85f', green:'#67d3a1'
  };

  function statusText(text){ const el=$('#renderStatus'); if(el){el.textContent=text; el.style.opacity='1';} }
  function setReadout(html){ const el=$('#simReadout'); if(el) el.innerHTML=html; }
  function setControls(html){ const el=$('#simControls'); if(el) el.innerHTML=html; }
  function control(label, inner){ return `<label class="field"><span>${label}</span>${inner}</label>`; }
  function range(id,min,max,step,value,readout=''){ return `<input id="${id}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><div id="${id}R" class="field-readout">${readout}</div>`; }
  function select(id, options){ return `<select id="${id}">${options.map(o=>`<option value="${o[0]}" ${o[2]?'selected':''}>${o[1]}</option>`).join('')}</select>`; }

  function installCanvas(){
    const old=$('#sceneCanvas'); if(!old) return false;
    const fresh=document.createElement('canvas'); fresh.id='sceneCanvas'; fresh.setAttribute('aria-label','Interactive physics simulation fallback');
    old.replaceWith(fresh); canvas=fresh; ctx=canvas.getContext('2d');
    const resize=()=>{
      const r=canvas.parentElement.getBoundingClientRect(), d=Math.min(window.devicePixelRatio||1,2);
      canvas.width=Math.max(10,Math.round(r.width*d)); canvas.height=Math.max(10,Math.round(r.height*d));
      canvas.style.width=r.width+'px'; canvas.style.height=r.height+'px'; ctx.setTransform(d,0,0,d,0,0);
    };
    resize(); new ResizeObserver(resize).observe(canvas.parentElement); return true;
  }

  function size(){ const r=canvas.getBoundingClientRect(); return [r.width,r.height]; }
  function clear(title='Interactive teaching model'){
    const [w,h]=size(); ctx.clearRect(0,0,w,h); ctx.fillStyle=palette.bg; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle=palette.grid; ctx.lineWidth=1;
    for(let x=0;x<w;x+=48){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
    for(let y=0;y<h;y+=48){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
    ctx.fillStyle=palette.muted;ctx.font='12px system-ui';ctx.fillText(title,14,24);
  }
  function circle(x,y,r,color,label='',alpha=1){
    ctx.save();ctx.globalAlpha=alpha;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=1.5;ctx.stroke();
    if(label){ctx.fillStyle='#06111d';ctx.font=`700 ${Math.max(11,r*.72)}px system-ui`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(label,x,y)}ctx.restore();
  }
  function text(t,x,y,align='left',color=palette.text,size=14,weight=600){ctx.fillStyle=color;ctx.font=`${weight} ${size}px system-ui`;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillText(t,x,y)}
  function line(x1,y1,x2,y2,color=palette.text,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()}
  function arrow(x1,y1,x2,y2,color=palette.text,width=2){line(x1,y1,x2,y2,color,width);const a=Math.atan2(y2-y1,x2-x1),s=9;ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-s*Math.cos(a-.45),y2-s*Math.sin(a-.45));ctx.lineTo(x2-s*Math.cos(a+.45),y2-s*Math.sin(a+.45));ctx.closePath();ctx.fill()}
  function bind(ids,fn){ids.forEach(id=>{const el=$('#'+id);if(el){el.oninput=fn;el.onchange=fn}})}
  function animate(fn){drawFrame=fn;started=performance.now();}
  function loop(){ if(!active) return; const t=(performance.now()-started)/1000; try{drawFrame(t)}catch(e){statusText('Fallback simulation error'); console.error(e)} raf=requestAnimationFrame(loop); }

  function drawNucleus(cx,cy,Z,A,scale=1){
    const n=Math.min(A,70), rad=Math.max(5,9*scale), ring=Math.ceil(Math.sqrt(n));
    for(let i=0;i<n;i++){
      const ang=i*2.399963, rr=Math.sqrt(i)*rad*.62, x=cx+Math.cos(ang)*rr, y=cy+Math.sin(ang)*rr;
      circle(x,y,rad*.72,i<Math.round(n*Z/A)?palette.proton:palette.neutron,'',.96);
    }
  }

  const sims={
    atom(){
      setControls(control('Choose isotope',select('fbIso',[['1,1','Hydrogen-1'],['6,12','Carbon-12',true],['6,14','Carbon-14'],['8,16','Oxygen-16'],['79,197','Gold-197']])));
      const update=()=>{const [Z,A]=$('#fbIso').value.split(',').map(Number);setReadout(`Z = ${Z} · A = ${A} · neutrons = ${A-Z} · neutral atom electrons = ${Z}`);animate(t=>{clear('Atomic structure');const [w,h]=size(),cx=w*.5,cy=h*.52;drawNucleus(cx,cy,Z,A,A>60?.58:1);const orbit=Math.min(w,h)*.3;ctx.strokeStyle='rgba(126,232,255,.22)';for(let k=1;k<=3;k++){ctx.beginPath();ctx.ellipse(cx,cy,orbit*k/3,orbit*k/5,0,0,Math.PI*2);ctx.stroke()}for(let i=0;i<Math.min(Z,12);i++){const a=t*.7+i*Math.PI*2/Math.min(Z,12),r=orbit*(.55+(i%3)*.18);circle(cx+Math.cos(a)*r,cy+Math.sin(a)*r*.48,6,palette.electron)}})};$('#fbIso').onchange=update;update();
    },
    specific(){
      setControls(control('Proton number Z',range('fbZ',1,30,1,6))+control('Nucleon number A',range('fbA',1,70,1,12))+control('Electrons present',range('fbEl',0,35,1,6)));
      const update=()=>{let Z=+$('#fbZ').value,A=Math.max(Z,+$('#fbA').value),ne=Math.min(+$('#fbEl').value,Z+5);$('#fbA').value=A;$('#fbA').min=Z;$('#fbEl').max=Z+5;$('#fbZR').textContent=`Z = ${Z}`;$('#fbAR').textContent=`A = ${A}`;$('#fbElR').textContent=`electrons = ${ne}`;const Q=(Z-ne)*E,m=Z*MP+(A-Z)*MN+ne*ME,s=Q/m;setReadout(`net charge = ${Z-ne}e = ${Q.toExponential(3)} C<br>mass ≈ ${m.toExponential(3)} kg<br><strong>specific charge ≈ ${s.toExponential(3)} C kg⁻¹</strong>`);animate(t=>{clear('Specific charge');const [w,h]=size(),cx=w*.42,cy=h*.52;drawNucleus(cx,cy,Z,A,A>40?.65:.95);for(let i=0;i<Math.min(ne,16);i++){const a=t*.45+i*Math.PI*2/Math.max(1,Math.min(ne,16)),r=Math.min(w,h)*(.22+(i%3)*.04);circle(cx+Math.cos(a)*r,cy+Math.sin(a)*r*.55,5,palette.electron)}text(`Q/m = ${s.toExponential(2)} C kg⁻¹`,w*.7,h*.5,'center',palette.text,17,700)})};bind(['fbZ','fbA','fbEl'],update);update();
    },
    strong(){
      setControls(control('Nucleon separation',range('fbSep',20,420,1,120)));
      const update=()=>{const d=+$('#fbSep').value/100,state=d<.5?'repulsive':d<=3?'attractive':'negligible';$('#fbSepR').textContent=`${d.toFixed(2)} fm · ${state}`;setReadout(`r = ${d.toFixed(2)} fm → strong force is <strong>${state}</strong>`);animate(()=>{clear('Strong nuclear force');const [w,h]=size(),cx=w/2,cy=h/2,gap=Math.min(w*.34,60+d*45);circle(cx-gap/2,cy,34,palette.proton,'p');circle(cx+gap/2,cy,34,palette.neutron,'n');if(state==='attractive'){arrow(cx-gap/2+38,cy,cx-8,cy,palette.good,4);arrow(cx+gap/2-38,cy,cx+8,cy,palette.good,4)}else if(state==='repulsive'){arrow(cx-gap/2-4,cy,cx-gap/2-90,cy,palette.bad,4);arrow(cx+gap/2+4,cy,cx+gap/2+90,cy,palette.bad,4)}text(state.toUpperCase(),cx,cy+95,'center',state==='attractive'?palette.good:state==='repulsive'?palette.bad:palette.muted,18,800)})};bind(['fbSep'],update);update();
    },
    decay(){
      setControls(control('Decay type',select('fbDecay',[['alpha','alpha decay'],['bm','beta-minus decay',true],['bp','beta-plus decay']]))+'<button class="button primary" id="fbRunDecay">Run decay</button>');
      const run=()=>{const m=$('#fbDecay').value;setReadout(m==='alpha'?'α decay: A → A − 4, Z → Z − 2':m==='bm'?'β⁻: n → p + e⁻ + ν̄ₑ · A unchanged, Z + 1':'β⁺: p → n + e⁺ + νₑ · A unchanged, Z − 1');animate(t=>{clear('Radioactive decay');const [w,h]=size(),cx=w*.42,cy=h*.5,q=Math.min(1,t/2.2);drawNucleus(cx,cy,8,16,1);if(q>.35){const k=(q-.35)/.65;if(m==='alpha'){drawNucleus(cx+70+k*w*.28,cy-40*k,2,4,.85);text('α',cx+70+k*w*.28,cy-70-40*k,'center',palette.orange,20,800)}else{circle(cx+60+k*w*.32,cy-45*k,10,m==='bm'?palette.electron:'#ff9fcb',m==='bm'?'e⁻':'e⁺');circle(cx+55+k*w*.29,cy+55*k,7,'#f3f7ff','ν')}}})};$('#fbRunDecay').onclick=run;$('#fbDecay').onchange=run;run();
    },
    antimatter(){
      setControls(control('Process',select('fbAnti',[['ann','annihilation: e⁻ + e⁺ → γ + γ',true],['pair','pair production near a nucleus']]))+'<button class="button primary" id="fbRunAnti">Run animation</button>');
      const run=()=>{const m=$('#fbAnti').value;setReadout(m==='ann'?'e⁻ + e⁺ → γ + γ · minimum combined rest energy = 1.022 MeV':'γ + nucleus → e⁻ + e⁺ + nucleus · Eγ ≥ 1.022 MeV');animate(t=>{clear('Matter and antimatter');const [w,h]=size(),cy=h/2,q=(t%3)/3,cx=w/2;if(m==='ann'){if(q<.48){circle(60+(cx-60)*q/.48,cy,14,palette.electron,'−');circle(w-60-(w-60-cx)*q/.48,cy,14,'#ff9fcb','+')}else{const k=(q-.48)/.52;circle(cx-k*w*.38,cy,9,palette.photon,'γ');circle(cx+k*w*.38,cy,9,palette.photon,'γ')}}else{drawNucleus(w*.62,cy,6,12,.8);if(q<.5){circle(40+q*w,cy,10,palette.photon,'γ')}else{const k=(q-.5)/.5;circle(w*.62+k*w*.25,cy-70*k,13,palette.electron,'−');circle(w*.62+k*w*.25,cy+70*k,13,'#ff9fcb','+')}}})};$('#fbRunAnti').onclick=run;$('#fbAnti').onchange=run;run();
    },
    interactions(){
      setControls(control('Interaction',select('fbInt',[['em','electromagnetic: like charges repel',true],['bm','beta-minus'],['bp','beta-plus'],['capture','electron capture'],['ep','electron–proton collision']])));
      const update=()=>{const m=$('#fbInt').value,eq={em:'electromagnetic interaction → virtual photon exchange',bm:'d → u + W⁻, then W⁻ → e⁻ + ν̄ₑ',bp:'u → d + W⁺, then W⁺ → e⁺ + νₑ',capture:'p + e⁻ → n + νₑ',ep:'e⁻ + p → n + νₑ'}[m];setReadout(eq);animate(t=>{clear('Exchange-particle model');const [w,h]=size(),cy=h/2,cx=w/2,q=(t%2.2)/2.2;circle(w*.25,cy,25,m==='em'?palette.proton:palette.neutron,m==='em'?'+':'q');circle(w*.75,cy,25,m==='em'?palette.proton:palette.electron,m==='em'?'+':'q');const x=w*.32+q*w*.36;circle(x,cy-35*Math.sin(q*Math.PI),11,m==='em'?palette.photon:palette.purple,m==='em'?'γ':'W');arrow(w*.3,cy+70,w*.18,cy+70,palette.bad,3);arrow(w*.7,cy+70,w*.82,cy+70,palette.bad,3);text(eq,w/2,h*.82,'center',palette.text,14,700)})};$('#fbInt').onchange=update;update();
    },
    classification(){
      setControls(control('Highlight family',select('fbFam',[['all','all particles',true],['hadron','hadrons'],['baryon','baryons'],['meson','mesons'],['lepton','leptons']])));
      const update=()=>{const f=$('#fbFam').value;setReadout(f==='all'?'Hadrons → baryons + mesons. Leptons form a separate family.':`Highlighted: ${f}`);animate(()=>{clear('Particle classification');const [w,h]=size(),items=[['p','baryon hadron',.18,.33,palette.proton],['n','baryon hadron',.34,.58,palette.neutron],['π','meson hadron',.50,.33,palette.orange],['K','meson hadron',.57,.62,palette.purple],['e','lepton',.75,.33,palette.electron],['μ','lepton',.83,.58,palette.green],['ν','lepton',.70,.72,'#f3f7ff']];items.forEach(([n,fam,x,y,c])=>circle(w*x,h*y,28,c,n,f==='all'||fam.includes(f)?1:.14));text('HADRONS',w*.37,h*.17,'center',palette.orange,16,800);text('LEPTONS',w*.76,h*.17,'center',palette.electron,16,800)})};$('#fbFam').onchange=update;update();
    },
    quarks(){
      const opts=[['p','proton p = uud',true],['n','neutron n = udd'],['pip','π⁺ = u d̄'],['pim','π⁻ = d ū'],['kp','K⁺ = u s̄'],['km','K⁻ = s ū']];setControls(control('Build a hadron',select('fbHad',opts)));
      const data={p:['u','u','d'],n:['u','d','d'],pip:['u','d̄'],pim:['d','ū'],kp:['u','s̄'],km:['s','ū']},charge={u:2/3,d:-1/3,s:-1/3,'ū':-2/3,'d̄':1/3,'s̄':1/3},strange={u:0,d:0,s:-1,'ū':0,'d̄':0,'s̄':1};
      const update=()=>{const qs=data[$('#fbHad').value],Q=qs.reduce((a,q)=>a+charge[q],0),B=qs.reduce((a,q)=>a+(q.includes('̄')?-1/3:1/3),0),S=qs.reduce((a,q)=>a+strange[q],0);setReadout(`${qs.join(' + ')} · charge = ${Q.toFixed(2)}e · B = ${B.toFixed(0)} · S = ${S}`);animate(t=>{clear('Quark builder');const [w,h]=size(),cx=w/2,cy=h/2,R=70,rot=t*.2;qs.forEach((q,i)=>{const a=rot+i*Math.PI*2/qs.length,col=q.startsWith('u')||q.startsWith('ū')?palette.orange:q.startsWith('s')||q.startsWith('s̄')?palette.purple:palette.green;circle(cx+Math.cos(a)*R,cy+Math.sin(a)*R,32,col,q)});ctx.strokeStyle=palette.electron;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,R+45,0,Math.PI*2);ctx.stroke()})};$('#fbHad').onchange=update;update();
    },
    photo(){
      setControls(control('Photon frequency',range('fbPf',2,15,.1,8))+control('Light intensity',range('fbPi',1,8,1,4))+control('Work function φ',range('fbPhi',1,5,.1,2.3)));
      const update=()=>{const f=+$('#fbPf').value*1e14,I=+$('#fbPi').value,phi=+$('#fbPhi').value,Eph=H*f/E,ke=Math.max(0,Eph-phi);$('#fbPfR').textContent=`${(f/1e14).toFixed(1)} × 10¹⁴ Hz`;$('#fbPiR').textContent=`${I} relative units`;$('#fbPhiR').textContent=`${phi.toFixed(1)} eV`;setReadout(ke>0?`hf = ${Eph.toFixed(2)} eV · KEmax = ${ke.toFixed(2)} eV · Vₛ = ${ke.toFixed(2)} V`:`hf = ${Eph.toFixed(2)} eV < φ = ${phi.toFixed(2)} eV → no emission`);animate(t=>{clear('Photoelectric effect');const [w,h]=size(),plate=w*.62,q=(t%2.2)/2.2;ctx.fillStyle='#7890a8';ctx.fillRect(plate,h*.18,22,h*.64);for(let i=0;i<I;i++){const y=h*.25+i*(h*.5/Math.max(1,I-1)),x=20+q*(plate-30);circle(x,y,7,palette.photon,'γ');if(ke>0&&q>.86)circle(plate+25+(q-.86)*w*2.2,y,7,palette.electron,'e')}})};bind(['fbPf','fbPi','fbPhi'],update);update();
    },
    collisions(){
      setControls(control('Incident electron energy',range('fbCe',1,20,.1,11))+control('Model threshold set',select('fbCt',[['10.2,13.6','hydrogen: excitation 10.2 eV, ionisation 13.6 eV',true],['4,8','fluorescent-tube teaching example: 4 eV, 8 eV']])));
      const update=()=>{const en=+$('#fbCe').value,[ex,ion]=$('#fbCt').value.split(',').map(Number),out=en>=ion?'ionisation':en>=ex?'excitation':'no allowed transition';$('#fbCeR').textContent=`${en.toFixed(1)} eV → ${out}`;setReadout(en>=ion?`${en.toFixed(1)} eV ≥ ${ion} eV → ionisation can occur`:en>=ex?`${en.toFixed(1)} eV ≥ ${ex} eV → excitation can occur`:`${en.toFixed(1)} eV is below ${ex} eV → no excitation in this model`);animate(t=>{clear('Electron–atom collisions');const [w,h]=size(),cx=w*.62,cy=h/2,q=(t%2.6)/2.6;circle(cx,cy,42,palette.neutron,'atom',.7);circle(35+q*w*.65,cy,10,palette.electron,'e');if(q>.68&&out==='excitation'){ctx.strokeStyle=palette.photon;ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,58+8*Math.sin(t*8),0,Math.PI*2);ctx.stroke()}if(q>.68&&out==='ionisation')circle(cx+80+(q-.68)*180,cy-70*(q-.68),9,palette.electron,'e')})};bind(['fbCe','fbCt'],update);update();
    },
    levels(){
      setControls(control('Hydrogen transition',select('fbTr',[['3,2','n=3 → n=2',true],['4,2','n=4 → n=2'],['2,1','n=2 → n=1'],['3,1','n=3 → n=1'],['4,1','n=4 → n=1']])));
      const update=()=>{const [ni,nf]=$('#fbTr').value.split(',').map(Number),Ei=-13.6/(ni*ni),Ef=-13.6/(nf*nf),d=Math.abs(Ef-Ei),lam=H*C/(d*E)*1e9;setReadout(`ΔE = ${d.toFixed(3)} eV · photon wavelength = ${lam.toFixed(1)} nm`);animate(t=>{clear('Atomic energy levels');const [w,h]=size(),left=w*.2,right=w*.72;for(let n=1;n<=4;n++){const y=h*.82-(n-1)*h*.18;line(left,y,right,y,'#6b87a8',2);text(`n=${n}`,left-18,y+4,'right',palette.muted,13,700)}const yi=h*.82-(ni-1)*h*.18,yf=h*.82-(nf-1)*h*.18,q=(t%3)/3,eY=q<.5?yi+(yf-yi)*(q/.5):yf;circle(w*.45,eY,9,palette.electron,'e');if(q>.5){const k=(q-.5)/.5;circle(w*.5+k*w*.42,(yi+yf)/2,8,palette.photon,'γ')}})};$('#fbTr').onchange=update;update();
    },
    diffraction(){
      setControls(control('Electron accelerating voltage',range('fbDv',50,5000,50,200)));
      const update=()=>{const V=+$('#fbDv').value,p=Math.sqrt(2*ME*E*V),lam=H/p;$('#fbDvR').textContent=`${V} V`;setReadout(`p = ${p.toExponential(3)} kg m s⁻¹ · λ = ${(lam*1e10).toFixed(3)} Å · higher V → smaller λ`);animate(t=>{clear('Electron diffraction');const [w,h]=size(),cx=w*.73,cy=h*.5,scale=Math.max(.35,2.1/Math.sqrt(V/50));ctx.fillStyle='#102a43';ctx.beginPath();ctx.arc(cx,cy,Math.min(w,h)*.32,0,Math.PI*2);ctx.fill();for(let i=1;i<=4;i++){ctx.strokeStyle=palette.electron;ctx.lineWidth=2;ctx.beginPath();ctx.arc(cx,cy,i*28*scale,0,Math.PI*2);ctx.stroke()}const q=(t%2.2)/2.2;circle(30+q*(cx-40),cy,7,palette.electron,'e')})};$('#fbDv').oninput=update;update();
    },
    rutherford(){
      setControls(control('Impact parameter',range('fbRb',15,190,1,70))+control('Nuclear charge Z',range('fbRz',10,90,1,79)));
      const update=()=>{const b=+$('#fbRb').value/100,Z=+$('#fbRz').value;$('#fbRbR').textContent=`b = ${b.toFixed(2)} scaled units`;$('#fbRzR').textContent=`Z = ${Z}${Z===79?' (gold)':''}`;setReadout('Smaller impact parameter and larger nuclear charge give stronger electrostatic deflection.');animate(()=>{clear('Rutherford scattering extension');const [w,h]=size(),cx=w*.62,cy=h*.5;drawNucleus(cx,cy,Math.min(Z,20),Math.min(45,Z+20),.55);[-1.5,-1,-.65,.65,1,1.5,b].forEach((bb,j)=>{const col=j===6?palette.electron:'#57718d',startY=cy+bb*55,strength=(Z/79)*110/(Math.abs(bb)+.28),endY=startY+Math.sign(bb||1)*Math.min(170,strength);ctx.strokeStyle=col;ctx.lineWidth=j===6?3:1.5;ctx.beginPath();ctx.moveTo(0,startY);ctx.quadraticCurveTo(cx-45,startY,cx+130,endY);ctx.stroke()})})};bind(['fbRb','fbRz'],update);update();
    }
  };

  function render(id){ current=id; const fn=sims[id]||sims.atom; fn(); statusText('Interactive model ready · reliable 2D fallback'); }

  function startFallback(reason){
    if(active) return; active=true; if(!installCanvas()) return;
    statusText(`Interactive fallback ready${reason?' · '+reason:''}`);
    document.querySelectorAll('.viewer-help span').forEach(s=>s.textContent='Works without WebGL/CDN');
    const left=$('#rotateLeft'),right=$('#rotateRight'),reset=$('#resetView'),pause=$('#pauseMotion');
    if(left) left.disabled=true; if(right) right.disabled=true; if(reset) reset.onclick=()=>render(current);
    if(pause){let paused=false;pause.onclick=()=>{paused=!paused;pause.textContent=paused?'Resume motion':'Pause motion';if(paused){cancelAnimationFrame(raf)}else{started=performance.now();loop()}}}
    const activeTab=$('.sim-tab.active'); render(activeTab?.dataset.sim||'atom');
    document.addEventListener('click',e=>{
      const tab=e.target.closest?.('.sim-tab'); if(tab) setTimeout(()=>render(tab.dataset.sim),0);
      if(e.target.closest?.('#lessonSim')||e.target.closest?.('#mapOpen')) setTimeout(()=>{const t=$('.sim-tab.active'); if(t) render(t.dataset.sim)},30);
    });
    loop();
  }

  function monitor(){
    const st=$('#renderStatus'); if(!st) return;
    const text=(st.textContent||'').toLowerCase();
    if(text.includes('unavailable')||text.includes('error')||text.includes('failed')) return startFallback('3D library unavailable');
    if(text.includes('3d model ready')) return;
    if(window.PARTICLELAB_3D_READY) return; if(performance.now()-boot>8000) return startFallback('3D start timed out');
    setTimeout(monitor,350);
  }
  const boot=performance.now();
  setTimeout(monitor,350);
})();