(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='aqa-electricity-extended-hub-v1';
  let state={question:'er-current',answers:{},drafts:{},plans:{},confidence:{}};
  try{state={...state,...(JSON.parse(localStorage.getItem(STORE)||'{}')||{})};}catch(e){}
  let timer=null,timerLeft=0;

  const QUESTIONS=[
    {
      id:'er-current',topic:'Current & charge',command:'Explain',marks:6,time:8,
      q:'A metal wire carries a steady current. Explain what electric current means in terms of charge carriers, why conventional current is opposite to electron drift, and what happens to the charge transferred if the current doubles for the same time.',
      plan:['Define electric current.','Describe the charge carriers in a metal and their direction of drift.','Use Q = It to explain the effect of doubling current.'],
      criteria:[
        {label:'Current is the rate of flow of charge.',groups:[['rate of flow','rate of charge','charge per second'],['current','charge']]},
        {label:'The mobile charge carriers in a metal are electrons.',groups:[['electron']]},
        {label:'Electrons drift from negative towards positive.',groups:[['drift','move'],['negative'],['positive']]},
        {label:'Conventional current is defined in the direction positive charge would move, opposite to electron drift.',groups:[['conventional current'],['opposite','reverse'],['electron']]},
        {label:'Uses Q = It correctly.',groups:[['q=it','q = it','charge'],['current'],['time']]},
        {label:'At constant time, doubling current doubles charge transferred.',groups:[['doubl'],['current'],['charge']]}
      ],
      model:'Electric current is the rate of flow of charge. In a metal, the mobile charge carriers are electrons, which drift from the negative terminal towards the positive terminal. Conventional current is defined as the direction in which positive charge would move, so it is opposite to electron drift. For a steady current, Q = It. If the time is unchanged and the current doubles, the charge transferred also doubles.'
    },
    {
      id:'er-pd',topic:'Potential difference & resistance',command:'Explain',marks:6,time:8,
      q:'Explain the meanings of potential difference and resistance, and explain how electrical energy is transferred when current passes through a resistor.',
      plan:['Define potential difference.','Define resistance using V and I.','Explain energy transfer from charge carriers to the lattice.'],
      criteria:[
        {label:'Potential difference is energy transferred per unit charge.',groups:[['energy','work'],['per unit charge','per coulomb','charge']]},
        {label:'Uses V = W/Q or equivalent meaning.',groups:[['v=w/q','v = w/q','w/q','joule per coulomb']]},
        {label:'Resistance is the ratio of p.d. to current at an operating point.',groups:[['resistance'],['v/i','potential difference'],['current']]},
        {label:'The supply transfers energy to charge carriers.',groups:[['energy'],['charge carrier','electron']]},
        {label:'Carriers transfer energy to the lattice through interactions/collisions.',groups:[['collision','interaction','scatter'],['lattice','ion']]},
        {label:'Electrical energy becomes internal/thermal energy of the resistor.',groups:[['internal energy','thermal','heat','heating']]}
      ],
      model:'Potential difference is the energy transferred per unit charge, so V = W/Q. Resistance is the ratio of potential difference to current for a stated operating condition, R = V/I. The electric field transfers energy to the charge carriers. As electrons move through the metal they interact with the lattice and transfer energy to it. The internal energy of the resistor increases, so its temperature rises.'
    },
    {
      id:'er-iv',topic:'I–V characteristics',command:'Compare and explain',marks:6,time:10,
      q:'Compare the I–V characteristics of an ohmic resistor, a filament lamp and a diode, and explain the physical reasons for their different shapes.',
      plan:['Describe the ohmic resistor graph.','Explain the filament lamp curve using heating.','Describe diode forward and reverse behaviour.'],
      criteria:[
        {label:'Ohmic resistor: straight line through the origin at constant physical conditions.',groups:[['straight line','linear'],['origin'],['constant','temperature','physical condition']]},
        {label:'For an ohmic resistor, current is proportional to p.d.',groups:[['proportional'],['current'],['potential difference','voltage']]},
        {label:'Filament lamp curve becomes less steep as current/p.d. increases.',groups:[['filament','lamp'],['curve','less steep','gradient']]},
        {label:'Lamp heating increases lattice vibration and resistance.',groups:[['temperature','heat'],['resistance'],['vibration','lattice','collision']]},
        {label:'A diode conducts strongly mainly in the forward direction after sufficient forward p.d.',groups:[['diode'],['forward'],['current'],['threshold','sufficient','rapid']]},
        {label:'Reverse current is very small in the simple A-level model.',groups:[['reverse'],['small','tiny','negligible'],['current']]}
      ],
      model:'An ohmic resistor at constant physical conditions has an I–V graph that is a straight line through the origin because I is proportional to V. A filament lamp has a curved graph: as current increases, the filament heats up, lattice vibrations increase and the resistance rises, so the graph becomes less steep. A diode conducts mainly in one direction. In forward bias the current stays small until the forward p.d. is sufficiently large and then rises rapidly, while in reverse bias the current is very small in the simple model.'
    },
    {
      id:'er-resistivity',topic:'Resistivity · RP5',command:'Describe and explain',marks:6,time:10,
      q:'Describe how to determine the resistivity of a uniform metal wire experimentally. Include the measurements, graph method and ways to reduce uncertainty.',
      plan:['Measure diameter and calculate area.','Measure V and I for several lengths.','Plot R against L and use the gradient.'],
      criteria:[
        {label:'Measure diameter with a micrometer at several positions/orientations and calculate a mean.',groups:[['micrometer'],['diameter'],['several','repeat','mean','average']]},
        {label:'Calculate cross-sectional area using A = πd²/4.',groups:[['area','a=','π','pi'],['diameter','d']]},
        {label:'Use a range of accurately measured wire lengths.',groups:[['range'],['length']]},
        {label:'Measure V and I and calculate R = V/I for each length.',groups:[['voltage','potential difference','v'],['current','i'],['r=v/i','resistance']]},
        {label:'Plot R against L; gradient = ρ/A, so ρ = gradient × A.',groups:[['plot','graph'],['r against l','resistance against length'],['gradient'],['resistivity','rho','ρ']]},
        {label:'Reduce heating and improve reliability by low current/switching off/repeats/wide range.',groups:[['heating','switch off','low current'],['repeat','wide range','uncertainty']]}
      ],
      model:'Measure the wire diameter with a micrometer at several positions and orientations and calculate a mean. Use A = πd²/4 to find the cross-sectional area. Set up a circuit that allows different lengths of the same wire to be tested. For each length measure V and I and calculate R = V/I. Plot R against L. Since R = ρL/A, the gradient is ρ/A, so ρ = gradient × A. Use a wide range of lengths, repeat readings and keep the current low or open the switch between readings to reduce heating.'
    },
    {
      id:'er-temperature',topic:'Temperature & superconductivity',command:'Explain',marks:6,time:9,
      q:'Explain how increasing temperature affects the resistance of a metal conductor and an NTC thermistor, then contrast both with the behaviour of a superconductor below its critical temperature.',
      plan:['Explain the metal mechanism.','State and contrast the NTC trend.','Describe the superconducting state below critical temperature.'],
      criteria:[
        {label:'Higher metal temperature increases lattice vibration.',groups:[['temperature'],['vibration','lattice']]},
        {label:'More electron–lattice interactions/scattering occur.',groups:[['electron'],['collision','scatter','interaction']]},
        {label:'Metal resistance therefore increases.',groups:[['resistance'],['increase']]},
        {label:'NTC thermistor resistance decreases as temperature increases.',groups:[['ntc','thermistor'],['resistance'],['decrease']]},
        {label:'A superconductor has zero resistivity below its critical temperature.',groups:[['superconductor'],['zero'],['resistivity','resistance'],['critical temperature']]},
        {label:'The superconducting state has no resistive energy loss.',groups:[['no','zero'],['energy loss','resistive loss','dissipation']]}
      ],
      model:'In a metal, increasing temperature increases lattice vibration. Conduction electrons are scattered more often, so the resistance increases. An NTC thermistor behaves differently: its resistance decreases as temperature increases. A superconductor undergoes a much more abrupt change; below its critical temperature its resistivity becomes zero. In the ideal superconducting state, current can flow without resistive energy loss.'
    },
    {
      id:'er-series',topic:'Series circuits',command:'Explain and derive',marks:6,time:9,
      q:'Two resistors are connected in series to a cell. Explain how current and potential difference behave in the circuit and derive the rule for total resistance using conservation ideas.',
      plan:['Use charge conservation for current.','Use energy conservation for p.d.','Substitute V = IR to derive total resistance.'],
      criteria:[
        {label:'The same current flows through all series components.',groups:[['same current','current is the same']]},
        {label:'This follows because charge cannot accumulate in steady state.',groups:[['charge'],['accumulate','conservation']]},
        {label:'Supply p.d. equals the sum of component p.d.s.',groups:[['potential difference','voltage'],['sum','add']]},
        {label:'This corresponds to conservation of energy per unit charge.',groups:[['energy'],['conservation','per unit charge']]},
        {label:'Uses V = IR for the total and each resistor.',groups:[['v=ir','v = ir','ir']]},
        {label:'Derives Rtotal = R1 + R2 (+ …).',groups:[['rt','r total','total resistance'],['r1','r2'],['+','sum','add']]}
      ],
      model:'In a series circuit the same current passes through every component because charge cannot accumulate at any point in steady state. The supply p.d. equals the sum of the p.d.s across the components because the energy transferred per unit charge is shared between them. Therefore V = V1 + V2. Using V = IR gives IRtotal = IR1 + IR2. The common current cancels, so Rtotal = R1 + R2.'
    },
    {
      id:'er-parallel',topic:'Parallel circuits & power',command:'Explain and analyse',marks:6,time:9,
      q:'Explain why adding an extra resistor in parallel decreases the total resistance. For an ideal constant-voltage supply, analyse what happens to total current and total power.',
      plan:['Use the equal p.d. rule for parallel branches.','Explain why total current increases.','Use R = V/I and P = VI.'],
      criteria:[
        {label:'Each parallel branch has the same p.d. as the supply.',groups:[['same','equal'],['potential difference','voltage'],['parallel']]},
        {label:'An extra branch provides another path for charge/current.',groups:[['additional','extra','another'],['path','branch']]},
        {label:'Total current is the sum of branch currents and increases.',groups:[['total current'],['sum','add'],['increase']]},
        {label:'At fixed V, Rtotal = V/Itotal so total resistance decreases.',groups:[['fixed','constant'],['voltage','v'],['resistance'],['decrease']]},
        {label:'At fixed V, P = VI.',groups:[['p=vi','p = vi','power'],['current'],['voltage']]},
        {label:'Because total current rises, total power drawn rises.',groups:[['power'],['increase','rise'],['current']]}
      ],
      model:'Each branch of a parallel circuit has the same p.d. as the supply. Adding another branch provides an additional path for current, so the total current, which is the sum of the branch currents, increases. With an ideal constant-voltage supply, Rtotal = V/Itotal, so a larger total current means a smaller equivalent resistance. Also Ptotal = VItotal, so at constant V the total power drawn from the supply increases.'
    },
    {
      id:'er-divider',topic:'Potential dividers & sensors',command:'Explain and design',marks:6,time:10,
      q:'A potential divider uses an NTC thermistor as the lower component and the output is measured across it. Explain how the output changes as temperature rises and describe how to redesign the circuit so the output rises with temperature instead.',
      plan:['Write the divider relationship.','Apply the NTC resistance trend.','Swap the sensor position/output arrangement to reverse the response.'],
      criteria:[
        {label:'Uses the potential-divider relationship with output across the lower component.',groups:[['vout','output'],['vin','input'],['resistance','r']]},
        {label:'NTC resistance decreases as temperature rises.',groups:[['ntc','thermistor'],['resistance'],['decrease'],['temperature']]},
        {label:'With NTC lower, the output fraction decreases.',groups:[['output'],['decrease'],['lower']]},
        {label:'Therefore Vout decreases as temperature rises.',groups:[['vout','output voltage','output potential difference'],['temperature'],['decrease']]},
        {label:'Putting the NTC in the upper position reverses the response when output is across the fixed lower resistor.',groups:[['upper','top'],['fixed resistor'],['reverse','increase']]},
        {label:'A high-resistance voltmeter/load reduces loading of the divider.',groups:[['high resistance'],['voltmeter','load'],['loading']]}
      ],
      model:'For an unloaded divider, Vout = Vin × Rlower/(Rupper + Rlower). An NTC thermistor decreases in resistance as temperature rises. If it is the lower component, the fraction of Vin across it decreases, so Vout falls. To make Vout rise with temperature, place the NTC in the upper position and measure the output across the fixed lower resistor. A high-resistance measuring device helps reduce loading of the divider.'
    },
    {
      id:'er-emf',topic:'EMF & internal resistance · RP6',command:'Describe and explain',marks:6,time:10,
      q:'Describe how to determine the emf and internal resistance of a cell using terminal p.d. and current measurements. Explain the meanings of the intercept and gradient of the graph.',
      plan:['Describe the circuit and variable load.','State what is measured and plotted.','Use V = ε − Ir to interpret intercept and gradient.'],
      criteria:[
        {label:'Use a variable external resistance and ammeter in series with the cell.',groups:[['variable resistor','variable resistance','load'],['ammeter'],['series']]},
        {label:'Connect a voltmeter across the cell terminals.',groups:[['voltmeter'],['across','parallel'],['cell','terminal']]},
        {label:'Vary the load and record pairs of I and terminal V.',groups:[['vary'],['current','i'],['terminal','voltage','potential difference']]},
        {label:'Plot V on the vertical axis against I on the horizontal axis.',groups:[['plot','graph'],['v against i','voltage against current','potential difference against current']]},
        {label:'The V-axis intercept is the emf ε.',groups:[['intercept'],['emf','epsilon','ε']]},
        {label:'The gradient is −r, so its magnitude gives internal resistance.',groups:[['gradient'],['internal resistance','r'],['negative','minus','magnitude']]}
      ],
      model:'Connect the cell, ammeter and variable load in series, with a voltmeter across the cell terminals. Change the external resistance and record pairs of current I and terminal p.d. V. Plot V against I. From V = ε − Ir, the V-axis intercept is ε and the gradient is −r, so the magnitude of the gradient gives the internal resistance. The switch should be opened between readings to reduce heating and discharge.'
    },
    {
      id:'er-energy',topic:'Electrical power & energy',command:'Explain',marks:4,time:6,
      q:'A resistor is connected to a constant-potential-difference supply. Explain how the power transferred in the resistor changes if its resistance is reduced, and relate this to the energy transferred in a fixed time.',
      plan:['Choose a power equation suited to constant V.','State the resistance effect on power.','Link power to energy transferred in time.'],
      criteria:[
        {label:'At constant V, use P = V²/R.',groups:[['p=v^2/r','p = v²/r','v²/r','v^2/r']]},
        {label:'Reducing R increases power at constant V.',groups:[['resistance'],['decrease','reduced'],['power'],['increase']]},
        {label:'Energy transferred is E = Pt.',groups:[['e=pt','e = pt','energy'],['time']]},
        {label:'For the same time, greater power means greater energy transfer.',groups:[['same','fixed'],['time'],['energy'],['increase','greater']]}
      ],
      model:'Because the potential difference is constant, P = V²/R is the most direct relationship. Reducing the resistance therefore increases the power transferred. Since E = Pt, if the time is unchanged then a larger power means a larger amount of energy is transferred in that time.'
    },
    {
      id:'er-synthesis',topic:'Synoptic circuit design',command:'Discuss',marks:6,time:11,
      q:'A sensor system needs a variable output voltage but the source has internal resistance. Discuss the electrical factors that should be considered when designing the circuit, including potential-divider loading, current, power and terminal p.d.',
      plan:['Discuss how the divider sets output.','Explain loading and current.','Link internal resistance to lost volts and power.'],
      criteria:[
        {label:'A potential divider sets output from a resistance ratio.',groups:[['potential divider'],['ratio','resistance'],['output']]},
        {label:'A connected load can change the effective divider resistance and Vout.',groups:[['load','loading'],['effective resistance','resistance'],['output','vout']]},
        {label:'A high-resistance load reduces loading.',groups:[['high resistance'],['load','loading']]},
        {label:'Larger current increases electrical power transfer/loss.',groups:[['current'],['power'],['increase','larger']]},
        {label:'Internal resistance causes lost volts Ir.',groups:[['internal resistance'],['lost volts','ir']]},
        {label:'As current rises, terminal p.d. falls: V = ε − Ir.',groups:[['terminal'],['voltage','potential difference'],['current'],['fall','decrease'],['epsilon','ε','emf']]}
      ],
      model:'A potential divider sets the output from the ratio of its resistances, but the connected load can alter the effective lower resistance and change Vout. A high-resistance load reduces this loading effect. Increasing current can increase unwanted power transfer, including heating. A real source also has internal resistance, so there are lost volts Ir and the terminal p.d. falls as current increases according to V = ε − Ir. A good design therefore balances the required sensor response with a sufficiently high load resistance and a current low enough to limit unwanted losses.'
    }
  ];

  const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const normalize=s=>String(s||'').toLowerCase().replace(/[−–—]/g,'-').replace(/²/g,'^2').replace(/ε/g,'epsilon').replace(/ρ/g,'rho').replace(/\s+/g,' ').trim();
  const persist=()=>localStorage.setItem(STORE,JSON.stringify(state));
  const current=()=>QUESTIONS.find(q=>q.id===state.question)||QUESTIONS[0];
  const topicOptions=()=>[...new Set(QUESTIONS.map(q=>q.topic))];

  function hasAlt(text,alts){return alts.some(a=>text.includes(normalize(a)));}
  function criterionMet(text,c){return c.groups.every(g=>hasAlt(text,g));}
  function mark(answer,q){
    const text=normalize(answer);
    const met=q.criteria.map(c=>criterionMet(text,c));
    const raw=met.filter(Boolean).length;
    const estimated=Math.min(q.marks,Math.round(raw*q.marks/q.criteria.length));
    const causal=(text.match(/\b(because|therefore|so|hence|causes|leads to|results in|as a result)\b/g)||[]).length;
    const compare=(text.match(/\b(whereas|while|however|in contrast|compared with|unlike)\b/g)||[]).length;
    return {met,estimated,causal,compare,words:(answer.trim().match(/\S+/g)||[]).length};
  }

  function style(){
    if($('#erHubStyle'))return;
    const s=document.createElement('style');s.id='erHubStyle';s.textContent=`
      .erhub-layout{display:grid;grid-template-columns:minmax(250px,.34fr) minmax(0,1fr);gap:16px}.erhub-side,.erhub-main{padding:16px}.erhub-list{display:grid;gap:7px;max-height:650px;overflow:auto;margin-top:12px}.erhub-qbtn{width:100%;text-align:left;border:1px solid var(--border);background:#071522;color:var(--text);border-radius:11px;padding:10px;cursor:pointer}.erhub-qbtn.active{border-color:var(--accent);box-shadow:0 0 0 2px rgba(103,199,255,.12)}.erhub-qbtn strong,.erhub-qbtn span{display:block}.erhub-qbtn span{font-size:.7rem;color:var(--muted);margin-top:3px}.erhub-controls{display:grid;gap:10px}.erhub-question{font-size:1.04rem;line-height:1.6}.erhub-meta{display:flex;gap:7px;flex-wrap:wrap;margin:8px 0 14px}.erhub-chip{font-size:.68rem;font-weight:900;border:1px solid #315b7b;border-radius:999px;padding:5px 8px;background:#071522;color:#cbefff}.erhub-plan{display:grid;gap:7px;padding:12px;border:1px solid var(--border);border-radius:12px;background:#071522}.erhub-plan label{display:grid;grid-template-columns:auto 1fr;gap:8px;align-items:start;font-size:.78rem}.erhub-answer,.erhub-draft{width:100%;min-height:250px;background:#06111e;color:var(--text);border:1px solid #31506e;border-radius:12px;padding:12px;resize:vertical;line-height:1.55}.erhub-draft{min-height:190px}.erhub-toolbar{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:9px}.erhub-count{font-size:.72rem;color:var(--muted);margin-left:auto}.erhub-feedback{display:none;margin-top:14px}.erhub-feedback.show{display:grid;gap:12px}.erhub-score{display:grid;grid-template-columns:auto 1fr;gap:12px;align-items:center;border:1px solid #315b7b;border-radius:14px;padding:13px;background:#071522}.erhub-score strong{font-size:1.7rem}.erhub-meter{height:8px;border-radius:999px;background:#132235;overflow:hidden}.erhub-meter span{display:block;height:100%;background:linear-gradient(90deg,#66c7ff,#77ddb0)}.erhub-feedback-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.erhub-card{border:1px solid var(--border);border-radius:13px;padding:12px;background:#071522}.erhub-card h3{margin-top:0}.erhub-checks{display:grid;gap:7px}.erhub-check{padding:8px 9px;border:1px solid rgba(85,122,159,.26);border-radius:9px;font-size:.76rem}.erhub-check.met{border-color:rgba(74,190,133,.45)}.erhub-check.miss{border-color:rgba(255,180,95,.4)}.erhub-note{font-size:.75rem;line-height:1.5}.erhub-model{display:none;white-space:pre-line}.erhub-model.show{display:block}.erhub-timer{font:900 1rem Consolas,monospace}.erhub-timer.low{color:#ffd56a}.erhub-timer.done{color:#ff9c86}.erhub-save{font-size:.68rem;color:#77ddb0;min-height:15px}.erhub-reflect{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.erhub-select{width:100%;background:#06111e;color:var(--text);border:1px solid #31506e;border-radius:9px;padding:9px}.erhub-warning{font-size:.7rem;color:var(--muted);margin-top:8px}.erhub-random{width:100%}@media(max-width:900px){.erhub-layout{grid-template-columns:1fr}.erhub-feedback-grid,.erhub-reflect{grid-template-columns:1fr}.erhub-list{max-height:280px}.erhub-count{margin-left:0}}
    `;document.head.appendChild(s);
  }

  function inject(){
    if($('#view-extended'))return;
    style();
    const nav=$('.main-nav'); if(!nav)return;
    const specBtn=$('.nav-button[data-view="spec"]');
    const btn=document.createElement('button');btn.className='nav-button';btn.dataset.view='extended';btn.textContent='Extended Response';
    nav.insertBefore(btn,specBtn||null);
    const spec=$('#view-spec');
    const section=document.createElement('section');section.className='view';section.id='view-extended';
    section.innerHTML=`
      <div class="section-head"><div><span class="eyebrow">4–6 mark exam practice</span><h2>Extended response answer workshop</h2></div><p class="muted">Plan, write, mark and improve original AQA-style electricity responses. Marking is a practice estimate based on physics content coverage, not an official examiner mark.</p></div>
      <div class="erhub-layout">
        <aside class="panel erhub-side">
          <div class="erhub-controls">
            <label class="field"><span>Filter by topic</span><select class="erhub-select" id="erHubTopic"><option value="all">All topics</option>${topicOptions().map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join('')}</select></label>
            <button class="button erhub-random" id="erHubRandom">Random question</button>
          </div>
          <div class="erhub-list" id="erHubList"></div>
        </aside>
        <article class="panel erhub-main">
          <div id="erHubQuestion"></div>
        </article>
      </div>`;
    (spec?.parentNode||$('main')).insertBefore(section,spec||null);

    btn.addEventListener('click',()=>{
      $$('.view').forEach(v=>v.classList.toggle('active-view',v.id==='view-extended'));
      $$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view==='extended'));
      window.scrollTo({top:Math.max(0,nav.offsetTop-72),behavior:'smooth'});
      renderList();renderQuestion();
    });
    $('#erHubTopic').addEventListener('change',renderList);
    $('#erHubRandom').addEventListener('click',()=>{
      const filter=$('#erHubTopic').value;
      const pool=QUESTIONS.filter(q=>filter==='all'||q.topic===filter);
      const next=pool[Math.floor(Math.random()*pool.length)]||QUESTIONS[0];
      state.question=next.id;persist();renderList();renderQuestion();
    });
    renderList();renderQuestion();
  }

  function renderList(){
    const list=$('#erHubList');if(!list)return;
    const filter=$('#erHubTopic')?.value||'all';
    const pool=QUESTIONS.filter(q=>filter==='all'||q.topic===filter);
    list.innerHTML=pool.map((q,i)=>`<button class="erhub-qbtn ${q.id===state.question?'active':''}" data-erhub-q="${q.id}"><strong>${i+1}. ${esc(q.topic)}</strong><span>${esc(q.command)} · ${q.marks} marks · ${q.time} min</span></button>`).join('');
    $$('[data-erhub-q]',list).forEach(b=>b.addEventListener('click',()=>{state.question=b.dataset.erhubQ;persist();renderList();renderQuestion();}));
  }

  function renderQuestion(){
    const root=$('#erHubQuestion');if(!root)return;
    const q=current();
    const ans=state.answers?.[q.id]||'';
    const draft=state.drafts?.[q.id]||'';
    const plans=state.plans?.[q.id]||[];
    const conf=state.confidence?.[q.id]||'';
    if(timer){clearInterval(timer);timer=null;} timerLeft=q.time*60;
    root.innerHTML=`
      <span class="eyebrow">${esc(q.topic)}</span><h2>${esc(q.command)} · ${q.marks} marks</h2>
      <div class="erhub-meta"><span class="erhub-chip">${q.marks} marks</span><span class="erhub-chip">Suggested ${q.time} min</span><span class="erhub-chip">Original AQA-style practice</span></div>
      <p class="erhub-question">${esc(q.q)}</p>
      <div class="erhub-plan"><strong>Plan before writing</strong>${q.plan.map((p,i)=>`<label><input type="checkbox" data-erhub-plan="${i}" ${plans.includes(i)?'checked':''}><span>${esc(p)}</span></label>`).join('')}</div>
      <div class="erhub-toolbar"><span class="erhub-timer" id="erHubTimer">${String(q.time).padStart(2,'0')}:00</span><button class="button" data-erhub-action="timer">Start timer</button><button class="button" data-erhub-action="timer-reset">Reset</button></div>
      <h3>Your answer</h3><textarea class="erhub-answer" id="erHubAnswer" placeholder="Write a connected physics response. Use precise terminology and link each statement back to the question.">${esc(ans)}</textarea>
      <div class="erhub-toolbar"><button class="button primary" data-erhub-action="mark">Mark my answer</button><button class="button" data-erhub-action="save">Save</button><button class="button" data-erhub-action="model">Reveal model answer</button><button class="button" data-erhub-action="clear">Clear</button><span class="erhub-count" id="erHubCount"></span></div><div class="erhub-save" id="erHubSaved"></div>
      <div class="erhub-feedback" id="erHubFeedback"></div>
      <div class="erhub-card erhub-model" id="erHubModel"><h3>Model response</h3><p>${esc(q.model)}</p><p class="erhub-warning">Use this to compare structure and precision after attempting the question; do not memorise it word-for-word.</p></div>
      <div class="erhub-reflect"><div class="erhub-card"><h3>Second draft</h3><p class="erhub-note">Rewrite only after using the feedback above. Aim to add missing physics and make links more explicit.</p><textarea class="erhub-draft" id="erHubDraft" placeholder="Write your improved answer here...">${esc(draft)}</textarea><div class="erhub-toolbar"><button class="button" data-erhub-action="save-draft">Save improved answer</button><button class="button" data-erhub-action="compare">Compare drafts</button></div><div id="erHubCompare" class="erhub-note"></div></div><div class="erhub-card"><h3>Confidence</h3><p class="erhub-note">How secure does this topic feel after marking?</p><select class="erhub-select" id="erHubConfidence"><option value="">Choose…</option>${['Need more practice','Nearly there','Secure','Could teach it'].map(x=>`<option ${x===conf?'selected':''}>${x}</option>`).join('')}</select></div></div>`;
    bindQuestion();updateCount();
  }

  function bindQuestion(){
    const q=current(),answer=$('#erHubAnswer'),draft=$('#erHubDraft');
    answer.addEventListener('input',()=>{updateCount();state.answers[q.id]=answer.value;persist();});
    draft.addEventListener('input',()=>{state.drafts[q.id]=draft.value;persist();});
    $$('[data-erhub-plan]').forEach(c=>c.addEventListener('change',()=>{
      state.plans[q.id]=$$('[data-erhub-plan]:checked').map(x=>Number(x.dataset.erhubPlan));persist();
    }));
    $('#erHubConfidence').addEventListener('change',e=>{state.confidence[q.id]=e.target.value;persist();});
    $$('[data-erhub-action]').forEach(b=>b.addEventListener('click',()=>action(b.dataset.erhubAction)));
  }

  function updateCount(){
    const a=$('#erHubAnswer');if(!a)return;const words=(a.value.trim().match(/\S+/g)||[]).length;const chars=a.value.length;
    $('#erHubCount').textContent=`${words} words · ${chars} characters`;
  }

  function action(type){
    const q=current(),a=$('#erHubAnswer');
    if(type==='save'){state.answers[q.id]=a.value;persist();flashSaved('Response saved on this device.');}
    if(type==='clear'){a.value='';state.answers[q.id]='';persist();updateCount();$('#erHubFeedback').classList.remove('show');}
    if(type==='model'){$('#erHubModel').classList.toggle('show');}
    if(type==='mark')renderMark(a.value,q);
    if(type==='save-draft'){state.drafts[q.id]=$('#erHubDraft').value;persist();flashSaved('Improved answer saved.');}
    if(type==='compare')compareDrafts(q);
    if(type==='timer')startTimer(q);
    if(type==='timer-reset'){resetTimer(q);}
  }

  function renderMark(answer,q){
    const out=$('#erHubFeedback');
    if(answer.trim().length<25){out.innerHTML='<div class="erhub-card"><strong>Write a fuller response first.</strong><p class="erhub-note">A few words are not enough to estimate extended-response coverage.</p></div>';out.classList.add('show');return;}
    const r=mark(answer,q),pct=100*r.estimated/q.marks;
    const explainNeeds=/explain|analyse|discuss|derive/i.test(q.command);
    const compareNeeds=/compare/i.test(q.command);
    const styleNotes=[];
    if(explainNeeds&&r.causal<1)styleNotes.push('Add explicit linking language such as “because”, “therefore” or “this causes…”.');
    if(compareNeeds&&r.compare<1)styleNotes.push('Make the comparison explicit with wording such as “whereas” or “in contrast”.');
    if(r.words<55&&q.marks>=6)styleNotes.push('The answer is quite short for a 6-mark response; check that each part of the question is addressed.');
    if(r.words>180)styleNotes.push('The response is long; remove repetition and keep each sentence earning physics credit.');
    if(!styleNotes.length)styleNotes.push('Your structure is reasonably exam-focused; now improve precision on any missing physics points below.');
    out.innerHTML=`
      <div class="erhub-score"><strong>${r.estimated}/${q.marks}</strong><div><div><strong>Practice mark estimate</strong></div><div class="erhub-meter"><span style="width:${pct}%"></span></div><p class="erhub-note">Estimated from coverage of the target physics points. This is not an official AQA mark.</p></div></div>
      <div class="erhub-feedback-grid"><div class="erhub-card"><h3>Physics covered</h3><div class="erhub-checks">${q.criteria.map((c,i)=>r.met[i]?`<div class="erhub-check met">✓ ${esc(c.label)}</div>`:'').join('')||'<div class="erhub-note">No target point was detected clearly yet.</div>'}</div></div><div class="erhub-card"><h3>Physics to add or make clearer</h3><div class="erhub-checks">${q.criteria.map((c,i)=>!r.met[i]?`<div class="erhub-check miss">→ ${esc(c.label)}</div>`:'').join('')||'<div class="erhub-note">All target content points were detected.</div>'}</div></div></div>
      <div class="erhub-card"><h3>Exam-writing feedback</h3>${styleNotes.map(n=>`<p class="erhub-note">• ${esc(n)}</p>`).join('')}<p class="erhub-note"><strong>Next step:</strong> use the missing-point list to produce a second draft below without copying the model answer.</p></div>`;
    out.classList.add('show');
  }

  function compareDrafts(q){
    const first=$('#erHubAnswer').value,second=$('#erHubDraft').value,target=$('#erHubCompare');
    if(!second.trim()){target.textContent='Write an improved answer first.';return;}
    const a=mark(first,q),b=mark(second,q);
    const delta=b.estimated-a.estimated;
    target.innerHTML=`First draft estimate: <strong>${a.estimated}/${q.marks}</strong> · Improved draft estimate: <strong>${b.estimated}/${q.marks}</strong>${delta>0?` · <strong>+${delta} mark${delta===1?'':'s'} of target coverage</strong>`:delta===0?' · Similar target coverage detected.':' · The second draft currently covers fewer target points.'}`;
  }

  function flashSaved(msg){const el=$('#erHubSaved');if(!el)return;el.textContent=msg;setTimeout(()=>{if(el)el.textContent='';},1800);}
  function resetTimer(q){if(timer){clearInterval(timer);timer=null;}timerLeft=q.time*60;paintTimer();}
  function startTimer(q){if(timer)return;if(timerLeft<=0)timerLeft=q.time*60;timer=setInterval(()=>{timerLeft--;paintTimer();if(timerLeft<=0){clearInterval(timer);timer=null;}},1000);}
  function paintTimer(){const el=$('#erHubTimer');if(!el)return;const m=Math.floor(timerLeft/60),s=timerLeft%60;el.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;el.classList.toggle('low',timerLeft<=60&&timerLeft>0);el.classList.toggle('done',timerLeft<=0);}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);else inject();
})();