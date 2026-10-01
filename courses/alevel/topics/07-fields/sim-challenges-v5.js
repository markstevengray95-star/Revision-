(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const root=$('#advancedApp'); if(!root) return;
  const real=root.querySelector('.real-lab-v4'); if(!real) return;

  const sec=document.createElement('section'); sec.className='panel pad advanced-section sim-challenge-v5';
  sec.innerHTML=`
    <div class="section-head compact"><div><span class="eyebrow">Interactive challenge mode</span><h2>Manipulate the apparatus to hit a physics target</h2></div><p class="muted">The target is checked from the live instrument readings. You must change the apparatus yourself rather than entering the answer.</p></div>
    <div class="challenge-grid-v5">
      <article class="challenge-card-v5"><div class="question-meta"><span class="data-badge" data-cmode></span><span class="data-badge" data-level>Challenge</span></div><h3 data-cq></h3><p class="muted" data-chint></p><div class="button-row"><button class="button primary" data-check>Check live setup</button><button class="button" data-new>New target</button><button class="button" data-freeze>Capture as comparison run</button></div><div data-cfeedback class="challenge-feedback-v5"></div></article>
      <article class="challenge-card-v5"><span class="eyebrow">Persistent run logger</span><h3>Save, restore and compare apparatus settings</h3><div class="button-row"><button class="button primary" data-log>Save current run</button><button class="button" data-clear>Clear logger</button></div><div class="table-scroll"><table class="data-table"><thead><tr><th>Run</th><th>Apparatus</th><th>Controls</th><th>Readings</th><th></th></tr></thead><tbody data-runs></tbody></table></div><div class="practical-guidance" data-compare>Save two runs to generate a comparison prompt.</div></article>
    </div>
    <div class="simulation-reflection-v5"><strong>Explain from evidence</strong><textarea data-reflect placeholder="Use your two runs to write: variable changed → measured effect → equation/relationship → physical explanation..."></textarea></div>`;
  real.after(sec);

  const STORE='aqa-fields-sim-runs-v5';
  let runs=(()=>{try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch{return []}})();
  const saveRuns=()=>localStorage.setItem(STORE,JSON.stringify(runs));
  let challengeIndex=0;

  const challenges={
    rp9:[
      {q:'Set the time constant τ between 2.0 s and 3.0 s.',hint:'Change R and/or C. Remember τ = RC.',ok:({m})=>num(m['τ'])>=2&&num(m['τ'])<=3},
      {q:'Set the capacitor so the displayed voltage is between 35% and 40% of its supply/initial voltage during discharge.',hint:'For discharge this occurs close to one time constant.',ok:({m,c})=>{const V=num(m['V']),V0=num(c['V0']);return V0>0&&V/V0>=.35&&V/V0<=.40;}},
      {q:'Make the displayed time approximately equal to one time constant.',hint:'Adjust R, C and the time control until t ≈ τ.',ok:({m,c})=>Math.abs(num(c['t'])-num(m['τ']))<.2}
    ],
    rp10:[
      {q:'Create a magnetic force between 0.035 N and 0.045 N.',hint:'Use B, I and L. F = BIL.',ok:({m})=>num(m['F'])>=.035&&num(m['F'])<=.045},
      {q:'Reverse the current direction.',hint:'Make I negative and explain what changes physically.',ok:({c})=>num(c['I'])<0},
      {q:'Set BL close to 0.020 N A⁻¹.',hint:'Use field strength and wire length.',ok:({m})=>Math.abs(num(m['BL'])-.020)<.002}
    ],
    rp11:[
      {q:'Rotate the coil until the flux linkage is approximately zero.',hint:'Think about cosθ and the angle to the coil normal.',ok:({m})=>Math.abs(num(m['NΦ']))<0.00005},
      {q:'Set the coil close to 60° and explain why the flux linkage is about half its maximum value.',hint:'cos60° = 0.5.',ok:({m})=>Math.abs(num(m['θ'])-60)<3},
      {q:'Adjust the coil so |cosθ| is greater than 0.95.',hint:'The normal must be nearly parallel or antiparallel to B.',ok:({m})=>Math.abs(num(m['cosθ']))>.95}
    ],
    induction:[
      {q:'Move the magnet so the induced-emf reading is clearly non-zero, then capture the run.',hint:'Emf depends on rate of change of flux linkage, so move the magnet through the coil region.',ok:({m})=>num(m['relative ε'])>.05},
      {q:'Increase the speed control above 2.0 relative units.',hint:'A faster change of flux linkage should produce a larger emf.',ok:({c})=>num(c['speed'])>2},
      {q:'Set the coil to at least 350 turns.',hint:'More turns increases flux linkage and induced emf for the same field change.',ok:({c})=>num(c['N'])>=350}
    ],
    transformer:[
      {q:'Create a step-up transformer with secondary voltage at least twice the primary voltage.',hint:'Use a secondary turns count at least twice the primary turns count.',ok:({m,c})=>num(m['Vs ideal'])>=2*num(c['Vp'])},
      {q:'Reduce transmission line loss below 1 W while keeping transferred power at 1500 W or more.',hint:'Raise the secondary voltage to reduce current.',ok:({m,c})=>num(m['I²R loss'])<1&&num(c['P'])>=1500},
      {q:'Create a turns ratio Ns/Np close to 3.',hint:'Adjust both windings if needed.',ok:({c})=>Math.abs(num(c['Ns'])/Math.max(1,num(c['Np']))-3)<.15}
    ],
    field:[
      {q:'Move the probe until the relative field magnitude is below 3 while the potential is not close to zero.',hint:'Try a region where vector contributions partly cancel without scalar potential cancelling.',ok:({m})=>num(m['relative E'])<3&&Math.abs(num(m['relative V']))>.5},
      {q:'Make the two source charges have the same sign.',hint:'Use the charge sliders, then inspect the region between them.',ok:({c})=>num(c['q1'])*num(c['q2'])>0},
      {q:'Make the source charges opposite in sign with magnitudes within 1 nC of each other.',hint:'Create an approximate dipole.',ok:({c})=>num(c['q1'])*num(c['q2'])<0&&Math.abs(Math.abs(num(c['q1']))-Math.abs(num(c['q2'])))<=1}
    ]
  };

  function mode(){
    const title=real.querySelector('#realTitle')?.textContent||'';
    if(/capacitor/i.test(title))return'rp9'; if(/balance/i.test(title))return'rp10'; if(/search coil/i.test(title))return'rp11'; if(/moving magnet/i.test(title))return'induction'; if(/transformer/i.test(title))return'transformer'; return'field';
  }
  function num(x){const v=parseFloat(String(x??'').replace(/[^0-9eE+\-.]/g,''));return Number.isFinite(v)?v:NaN;}
  function snapshot(){
    const c={}; real.querySelectorAll('[data-k]').forEach(el=>{c[el.dataset.k]=el.value;});
    const m={}; real.querySelectorAll('#instrumentDock .instrument-card').forEach(card=>{const k=card.querySelector('strong')?.textContent?.trim(),v=card.querySelector('span')?.textContent?.trim();if(k)m[k]=v;});
    return {mode:mode(),title:real.querySelector('#realTitle')?.textContent||'',c,m,time:Date.now()};
  }
  function renderChallenge(){
    const md=mode(),list=challenges[md]||[]; challengeIndex%=Math.max(1,list.length); const ch=list[challengeIndex];
    sec.querySelector('[data-cmode]').textContent=real.querySelector('#realCode')?.textContent||md;
    sec.querySelector('[data-cq]').textContent=ch?.q||'Manipulate the apparatus and explain the relationship.';
    sec.querySelector('[data-chint]').textContent=ch?.hint||'';
    sec.querySelector('[data-cfeedback]').innerHTML='';
  }
  sec.querySelector('[data-check]').onclick=()=>{
    const md=mode(),ch=(challenges[md]||[])[challengeIndex]; const ok=!!ch?.ok(snapshot());
    sec.querySelector('[data-cfeedback]').innerHTML=ok?'<span class="success"><strong>Target reached.</strong> Now explain why the apparatus values satisfy the physics.</span>':'<span class="warning"><strong>Not yet.</strong> Keep manipulating the live apparatus and use the hint rather than calculating the target away from the simulation.</span>';
  };
  sec.querySelector('[data-new]').onclick=()=>{challengeIndex++;renderChallenge();};
  sec.querySelector('[data-freeze]').onclick=()=>logRun();

  function logRun(){runs.unshift(snapshot());runs=runs.slice(0,12);saveRuns();renderRuns();}
  function restore(i){const run=runs[i]; if(!run)return; const desired=run.mode;
    const titleMap={rp9:'Capacitor',rp10:'Top-pan',rp11:'Search coil',induction:'Moving magnet',transformer:'Transformer',field:'Field-mapping'};
    [...real.querySelectorAll('#realModes .button')].find(b=>b.textContent.includes(titleMap[desired]))?.click();
    setTimeout(()=>{Object.entries(run.c||{}).forEach(([k,v])=>{const el=real.querySelector(`[data-k="${CSS.escape(k)}"]`);if(el){el.value=v;el.dispatchEvent(new Event('input',{bubbles:true}));}});renderChallenge();},30);
  }
  function renderRuns(){
    const body=sec.querySelector('[data-runs]'); body.innerHTML=runs.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r.title)}</td><td>${esc(Object.entries(r.c).map(([k,v])=>`${k}=${v}`).join(', '))}</td><td>${esc(Object.entries(r.m).map(([k,v])=>`${k}=${v}`).join(' · '))}</td><td><button class="text-button" data-load="${i}">Load</button></td></tr>`).join('');
    body.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>restore(Number(b.dataset.load)));
    const cmp=sec.querySelector('[data-compare]');
    if(runs.length>=2){const a=runs[0],b=runs[1];cmp.innerHTML=`<strong>Comparison prompt:</strong> Run 1 and Run 2 used ${a.title===b.title?'the same apparatus':'different apparatus'}. Identify the independent variable that changed most clearly, describe the measured effect, then justify it using an equation or physical model.`;} else cmp.textContent='Save two runs to generate a comparison prompt.';
  }
  sec.querySelector('[data-log]').onclick=logRun;
  sec.querySelector('[data-clear]').onclick=()=>{runs=[];saveRuns();renderRuns();};

  const observer=new MutationObserver(()=>renderChallenge());
  const title=real.querySelector('#realTitle'); if(title)observer.observe(title,{childList:true,subtree:true});
  renderRuns(); renderChallenge();
})();