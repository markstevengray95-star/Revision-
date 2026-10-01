
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];

  const quarkData={
    u:{q:2/3,B:1/3,S:0}, d:{q:-1/3,B:1/3,S:0}, s:{q:-1/3,B:1/3,S:-1},
    'ū':{q:-2/3,B:-1/3,S:0}, 'd̄':{q:1/3,B:-1/3,S:0}, 's̄':{q:1/3,B:-1/3,S:1}
  };
  const hadrons={
    p:['u','u','d'], n:['u','d','d'], 'p̄':['ū','ū','d̄'], 'n̄':['ū','d̄','d̄'],
    'π+':['u','d̄'], 'π−':['d','ū'], 'K+':['u','s̄'], 'K−':['s','ū'],
    'K0':['d','s̄'], 'K̄0':['s','d̄']
  };
  const pairData={
    electron:{name:'electron / positron',p:'e⁻',a:'e⁺',charge:'−e / +e',mass:'same mass and rest energy',quantum:'electron lepton number changes from +1 to −1'},
    proton:{name:'proton / antiproton',p:'p',a:'p̄',charge:'+e / −e',mass:'same mass and rest energy',quantum:'baryon number changes from +1 to −1'},
    neutron:{name:'neutron / antineutron',p:'n',a:'n̄',charge:'0 / 0',mass:'same mass and rest energy',quantum:'baryon number changes from +1 to −1 even though both are neutral'},
    neutrino:{name:'neutrino / antineutrino',p:'ν',a:'ν̄',charge:'0 / 0',mass:'corresponding particle–antiparticle pair',quantum:'lepton number changes sign'}
  };

  function activeId(){return $('#simNav .sim-tab.active')?.dataset.sim||'';}

  function ensurePanel(){
    let p=$('#particleDepthPanel');
    if(p)return p;
    const side=$('.lab-side');
    if(!side)return null;
    p=document.createElement('section');
    p.id='particleDepthPanel';
    p.className='particle-depth-panel';
    const readout=$('#simReadout');
    if(readout) readout.insertAdjacentElement('afterend',p); else side.prepend(p);
    return p;
  }

  function head(title,code){
    return '<div class="pd-head"><div><span class="eyebrow">'+code+'</span><h3>'+title+'</h3></div><span class="pill">Understand this topic</span></div>'+
      '<div class="pd-tabs"><button class="pd-tab active" data-pd-tab="understand">Understand</button><button class="pd-tab" data-pd-tab="examples">Examples</button><button class="pd-tab" data-pd-tab="check">Check</button></div>'+
      '<div class="pd-body" id="pdBody"></div>';
  }

  function bindTabs(id){
    $$('#particleDepthPanel [data-pd-tab]').forEach(b=>b.onclick=()=>{
      $$('#particleDepthPanel [data-pd-tab]').forEach(x=>x.classList.toggle('active',x===b));
      renderBody(id,b.dataset.pdTab);
    });
  }

  function render(id=activeId()){
    const p=ensurePanel();
    if(!p)return;
    if(!['antimatter','quarks','rutherford'].includes(id)){p.style.display='none';return;}
    p.style.display='';
    const meta={
      antimatter:['Particles and antiparticles','AQA 3.2.1.3'],
      quarks:['Quarks and antiquarks','AQA 3.2.1.6'],
      rutherford:['Rutherford scattering','AQA 3.8.1.1 extension']
    }[id];
    p.innerHTML=head(meta[0],meta[1]);
    bindTabs(id);
    renderBody(id,'understand');
  }

  function renderBody(id,tab){
    const body=$('#pdBody'); if(!body)return;
    if(id==='antimatter') antiBody(body,tab);
    if(id==='quarks') quarkBody(body,tab);
    if(id==='rutherford') ruthBody(body,tab);
  }

  function antiBody(el,tab){
    if(tab==='understand'){
      el.innerHTML=
        '<div class="pd-grid">'+
          '<div class="pd-card"><strong>1. What is an antiparticle?</strong><p>Every particle has a corresponding antiparticle. It has the same mass and rest energy, but opposite additive quantum numbers such as charge, baryon number or lepton number where applicable.</p></div>'+
          '<div class="pd-card"><strong>2. Antiparticle does not mean “negative”</strong><p>A positron is positive, but an antiproton is negative. A neutron and antineutron are both electrically neutral; their baryon numbers are opposite.</p></div>'+
          '<div class="pd-card"><strong>3. Annihilation</strong><p>A particle and its antiparticle can convert their energy into photons. For a slow electron–positron pair, the total rest energy is 1.022 MeV before any kinetic energy is included.</p></div>'+
          '<div class="pd-card"><strong>4. Pair production</strong><p>A sufficiently energetic photon can create an electron–positron pair. The threshold rest energy is 1.022 MeV and a nearby body is needed so momentum can be conserved.</p></div>'+
        '</div>'+
        '<table class="pd-table"><thead><tr><th>particle</th><th>antiparticle</th><th>charge</th><th>key change</th></tr></thead><tbody>'+
          '<tr><td>electron e⁻</td><td>positron e⁺</td><td>−e ↔ +e</td><td>electron lepton number changes sign</td></tr>'+
          '<tr><td>proton p</td><td>antiproton p̄</td><td>+e ↔ −e</td><td>baryon number +1 ↔ −1</td></tr>'+
          '<tr><td>neutron n</td><td>antineutron n̄</td><td>0 ↔ 0</td><td>baryon number changes sign</td></tr>'+
          '<tr><td>neutrino ν</td><td>antineutrino ν̄</td><td>0 ↔ 0</td><td>lepton number changes sign</td></tr>'+
        '</tbody></table>'+
        '<div class="pd-note pd-warning"><strong>Common mistake:</strong> “antiparticle” does not automatically mean “opposite electric charge”. Neutral particles can still have distinct antiparticles because other quantum numbers reverse.</div>';
    } else if(tab==='examples'){
      el.innerHTML=
        '<div class="pd-controls">'+
          '<div class="pd-control"><label>Particle pair</label><select id="pdPair"><option value="electron">electron / positron</option><option value="proton">proton / antiproton</option><option value="neutron">neutron / antineutron</option><option value="neutrino">neutrino / antineutrino</option></select></div>'+
          '<div class="pd-control"><label>Total kinetic energy in e⁻/e⁺ annihilation</label><input id="pdKE" type="range" min="0" max="4" step=".1" value="0"><div class="small subtle"><span id="pdKEV">0.0</span> MeV</div></div>'+
        '</div><div class="pd-result" id="pdAntiOut"></div>';
      const go=()=>{
        const d=pairData[$('#pdPair').value],ke=+$('#pdKE').value,total=1.022+ke,each=total/2;
        $('#pdKEV').textContent=ke.toFixed(1);
        $('#pdAntiOut').innerHTML=
          '<strong>'+d.name+'</strong><br>'+d.p+' ↔ '+d.a+' · '+d.mass+' · charge '+d.charge+'<br>'+d.quantum+
          '<div class="pd-equation-row"><span>e⁻e⁺</span><div class="pd-math">total energy = 1.022 MeV + '+ke.toFixed(1)+' MeV = '+total.toFixed(3)+' MeV</div></div>'+
          '<div class="pd-equation-row"><span>2γ</span><div>If the two photons share the energy equally in a symmetric case, each carries about '+each.toFixed(3)+' MeV.</div></div>';
      };
      $('#pdPair').onchange=go;$('#pdKE').oninput=go;go();
    } else {
      el.innerHTML=
        '<div class="pd-check">'+
          checkQ('An antineutron has zero electric charge. What still makes it different from a neutron?',['It has zero mass','Its baryon number is opposite','It contains no quarks'],1,'Baryon number reverses sign for the antiparticle.')+
          checkQ('What is the minimum rest-energy requirement for creating an electron–positron pair?',['0.511 MeV','1.022 MeV','2.044 MeV'],1,'Two electron rest energies are needed: 2 × 0.511 MeV.')+
          checkQ('Why are two photons commonly shown for slow e⁻e⁺ annihilation?',['To conserve momentum as well as energy','Because one photon has no energy','Because photons have charge'],0,'A single photon cannot satisfy both energy and momentum conservation for the simple slow-pair case.')+
        '</div>';
      bindChecks();
    }
  }

  function qfmt(x){
    const n=Math.round(x*3);
    if(n===0)return '0';
    if(Math.abs(n)===3)return (n>0?'+':'−')+'1';
    return (n>0?'+':'−')+Math.abs(n)+'/3';
  }

  function quarkBody(el,tab){
    if(tab==='understand'){
      el.innerHTML=
        '<table class="pd-table"><thead><tr><th>quark</th><th>charge / e</th><th>B</th><th>S</th><th>antiquark</th></tr></thead><tbody>'+
          '<tr><td>u</td><td>+2/3</td><td>+1/3</td><td>0</td><td>ū: −2/3, −1/3, 0</td></tr>'+
          '<tr><td>d</td><td>−1/3</td><td>+1/3</td><td>0</td><td>d̄: +1/3, −1/3, 0</td></tr>'+
          '<tr><td>s</td><td>−1/3</td><td>+1/3</td><td>−1</td><td>s̄: +1/3, −1/3, +1</td></tr>'+
        '</tbody></table>'+
        '<div class="pd-grid">'+
          '<div class="pd-card"><strong>Baryon</strong><p>Three quarks. Proton = uud and neutron = udd. Their baryon number adds to +1.</p></div>'+
          '<div class="pd-card"><strong>Antibaryon</strong><p>Three antiquarks. Antiproton = ūūd̄ and antineutron = ūd̄d̄. Their baryon number adds to −1.</p></div>'+
          '<div class="pd-card"><strong>Meson</strong><p>One quark plus one antiquark. Baryon number cancels to zero. Pions and kaons are the AQA examples.</p></div>'+
          '<div class="pd-card"><strong>Strangeness</strong><p>s has S = −1; s̄ has S = +1. u and d quarks have S = 0.</p></div>'+
        '</div>'+
        '<div class="pd-note"><strong>Fast method:</strong> write the quark content, then add charge, baryon number and strangeness column by column.</div>';
    } else if(tab==='examples'){
      el.innerHTML=
        '<div class="pd-controls"><div class="pd-control"><label>Hadron</label><select id="pdHad">'+
          Object.keys(hadrons).map(k=>'<option>'+k+'</option>').join('')+
        '</select></div></div><div class="pd-result" id="pdQuarkOut"></div>';
      const go=()=>{
        const k=$('#pdHad').value,qs=hadrons[k];
        const sum=f=>qs.reduce((a,q)=>a+quarkData[q][f],0);
        const Q=sum('q'),B=sum('B'),S=sum('S');
        const chargeLine=qs.map(q=>q+' ('+qfmt(quarkData[q].q)+')').join(' + ');
        const bLine=qs.map(q=>qfmt(quarkData[q].B)).join(' + ');
        const sLine=qs.map(q=>String(quarkData[q].S)).join(' + ');
        $('#pdQuarkOut').innerHTML=
          '<strong>'+k+' = '+qs.join(' ')+'</strong>'+
          '<div class="pd-equation-row"><span>Q</span><div class="pd-math">'+chargeLine+' = '+qfmt(Q)+'e</div></div>'+
          '<div class="pd-equation-row"><span>B</span><div class="pd-math">'+bLine+' = '+B.toFixed(0)+'</div></div>'+
          '<div class="pd-equation-row"><span>S</span><div class="pd-math">'+sLine+' = '+S+'</div></div>'+
          '<div class="pd-note">'+(qs.length===3?(B>0?'Three quarks → baryon.':'Three antiquarks → antibaryon.'):'Quark + antiquark → meson, so B = 0.')+'</div>';
      };
      $('#pdHad').onchange=go;go();
    } else {
      el.innerHTML=
        '<div class="pd-check">'+
          checkQ('What is the quark content of a proton?',['uud','udd','u d̄'],0,'Proton = uud.')+
          checkQ('What happens to baryon number when a quark is replaced by its antiquark?',['Its sign reverses for that constituent','It stays +1/3','It becomes +1'],0,'Quarks have B = +1/3; antiquarks have B = −1/3.')+
          checkQ('Which constituent gives a kaon non-zero strangeness?',['u only','d only','s or s̄'],2,'Only strange quarks/antiquarks carry non-zero strangeness in this syllabus.')+
        '</div>';
      bindChecks();
    }
  }

  function ruthBody(el,tab){
    if(tab==='understand'){
      el.innerHTML=
        '<div class="pd-model-compare">'+
          '<div class="pd-model old"><h4>Before: plum-pudding idea</h4><p>Positive charge was imagined as spread through the atom. That model would mainly produce small deflections; it did not naturally explain rare large-angle scattering.</p></div>'+
          '<div class="pd-model new"><h4>After: nuclear model</h4><p>Most of the atom is empty space, with positive charge and most mass concentrated in a tiny central nucleus.</p></div>'+
        '</div>'+
        '<div class="pd-grid">'+
          '<div class="pd-card"><strong>Why most go straight</strong><p>An alpha particle usually passes through empty space and does not come close to a nucleus.</p></div>'+
          '<div class="pd-card"><strong>Why some bend</strong><p>Both alpha particle and nucleus are positive, so electrostatic repulsion changes the alpha-particle momentum.</p></div>'+
          '<div class="pd-card"><strong>Why very few turn sharply</strong><p>Only a tiny fraction pass extremely close to a nucleus, where the repulsive force becomes very large.</p></div>'+
          '<div class="pd-card"><strong>Why thin gold foil helps</strong><p>Gold can be made extremely thin, reducing repeated scattering. Its large nuclear charge also produces clear Coulomb deflection trends.</p></div>'+
        '</div>'+
        '<div class="pd-note"><strong>Impact parameter b:</strong> smaller b → closer approach → stronger repulsion → larger scattering angle. Higher alpha-particle energy makes a given encounter harder to deflect.</div>';
    } else if(tab==='examples'){
      el.innerHTML=
        '<div class="pd-controls">'+
          '<div class="pd-control"><label>Impact parameter b / fm</label><input id="pdB" type="range" min="5" max="220" value="55"><div class="small subtle"><span id="pdBV">55</span> fm</div></div>'+
          '<div class="pd-control"><label>Alpha energy / MeV</label><input id="pdE" type="range" min="3" max="8" step=".1" value="5.5"><div class="small subtle"><span id="pdEV">5.5</span> MeV</div></div>'+
        '</div><div class="pd-result" id="pdRuthOut"></div>';
      const go=()=>{
        const b=+$('#pdB').value,E=+$('#pdE').value;
        const k=8.9875517923e9,e=1.602176634e-19,Z=79,z=2;
        const ratio=k*Z*z*e*e/(2*(E*1e6*e)*(b*1e-15));
        const theta=2*Math.atan(ratio)*180/Math.PI;
        $('#pdBV').textContent=b.toFixed(0);$('#pdEV').textContent=E.toFixed(1);
        $('#pdRuthOut').innerHTML=
          '<strong>Qualitative Coulomb-scattering link</strong><br>For this single-encounter model, θ ≈ '+theta.toFixed(1)+'°.'+
          '<div class="pd-equation-row"><span>b ↓</span><div>closer approach → stronger force → θ increases</div></div>'+
          '<div class="pd-equation-row"><span>E ↑</span><div>faster alpha particle is harder to turn → θ decreases</div></div>'+
          '<div class="pd-equation-row"><span>Z ↑</span><div>stronger nuclear charge → stronger repulsion → θ increases</div></div>';
      };
      $('#pdB').oninput=go;$('#pdE').oninput=go;go();
    } else {
      el.innerHTML=
        '<div class="pd-check">'+
          checkQ('Most alpha particles passed almost straight through. What does this show?',['Atoms are mostly empty space','The nucleus is negative','Electrons contain most mass'],0,'Most of the volume of an atom is empty space.')+
          checkQ('What observation most strongly contradicts a diffuse positive-charge model?',['No particles enter the foil','Rare very large-angle scattering','All particles stop'],1,'A tiny concentrated positive region is needed to explain rare large deflections.')+
          checkQ('What happens when the impact parameter decreases?',['Deflection tends to increase','Deflection must become zero','Nuclear charge decreases'],0,'Closer approach means a larger electrostatic repulsive impulse.')+
        '</div>';
      bindChecks();
    }
  }

  function checkQ(q,opts,correct,why){
    return '<div class="pd-q"><p>'+q+'</p><div class="pd-options">'+opts.map((o,i)=>'<button data-pd-answer="'+i+'" data-pd-correct="'+correct+'" data-pd-why="'+why.replace(/"/g,'&quot;')+'">'+o+'</button>').join('')+'</div><div class="pd-feedback"></div></div>';
  }

  function bindChecks(){
    $$('#particleDepthPanel [data-pd-answer]').forEach(b=>b.onclick=()=>{
      const box=b.closest('.pd-q'),good=Number(b.dataset.pdAnswer)===Number(b.dataset.pdCorrect);
      $$('.pd-options button',box).forEach(x=>x.classList.remove('good','bad'));
      b.classList.add(good?'good':'bad');
      $('.pd-feedback',box).textContent=(good?'Correct. ':'Not quite. ')+b.dataset.pdWhy;
      window.dispatchEvent(new CustomEvent('particlelab:hotspot',{detail:{sim:'knowledge-check',title:good?'correct':'retry'}}));
    });
  }

  function addFullRutherfordDepth(){
    if($('#ruthDepthPanel'))return true;
    const layout=$('#view-rutherfordexp .ruth-layout');
    if(!layout)return false;
    const s=document.createElement('section');
    s.id='ruthDepthPanel';
    s.className='panel particle-depth-panel pd-ruth-full';
    s.innerHTML=
      '<div class="pd-head"><div><span class="eyebrow">Deeper reasoning</span><h3>From the old model to the nuclear atom</h3></div><span class="pill">AQA 3.8.1.1</span></div>'+
      '<div class="pd-body">'+
        '<div class="pd-model-compare"><div class="pd-model old"><h4>Plum-pudding prediction</h4><p>If positive charge were spread diffusely through the atom, alpha particles would feel only relatively gentle changes in direction. Rare near-reversals are difficult to explain.</p></div><div class="pd-model new"><h4>Nuclear-model explanation</h4><p>A tiny region with concentrated positive charge can produce a very large electrostatic force during a close encounter, while most particles miss it completely.</p></div></div>'+
        '<div class="pd-grid" style="margin-top:7px"><div class="pd-card"><strong>Observation 1</strong><p>Most pass straight → atom mostly empty space.</p></div><div class="pd-card"><strong>Observation 2</strong><p>Some deflect → positive alpha is repelled by positive charge.</p></div><div class="pd-card"><strong>Observation 3</strong><p>Very few scatter backwards → charge and mass are highly concentrated.</p></div><div class="pd-card"><strong>Force idea</strong><p>Closer approach means smaller r, so the electrostatic repulsion becomes much stronger.</p></div></div>'+
      '</div>';
    layout.insertAdjacentElement('afterend',s);
    return true;
  }

  function hook(){
    render();
    document.addEventListener('click',e=>{
      const t=e.target.closest?.('#simNav .sim-tab');
      if(t)setTimeout(()=>render(t.dataset.sim),50);
    });
    let tries=0;
    const timer=setInterval(()=>{tries++;if(addFullRutherfordDepth()||tries>40)clearInterval(timer);},250);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(hook,120),{once:true});
  else setTimeout(hook,120);
})();
