(() => {
  const $ = (s,r=document) => r.querySelector(s);
  const $$ = (s,r=document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const storeKey = 'aqa-electricity-learning-depth-v2';
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem(storeKey) || '{}'); } catch(e) { saved = {}; }
  const persist = () => localStorage.setItem(storeKey, JSON.stringify(saved));

  const lessonDepth = {
    'current-charge': {
      chain:['Current is a rate: I = ΔQ/Δt.','A larger current means more charge crosses a point each second.','In metals, electrons drift opposite to conventional current.','Potential difference is not needed to define current, but an electric field is what drives the drift in a circuit.'],
      maths:'If 18 C passes a point in 12 s, I = Q/t = 18/12 = 1.5 A. If that current continues for 40 s, Q = It = 60 C.',
      explain:'Do not describe current as being used up. Charge is conserved around a complete circuit; energy is transferred by components.',
      stretch:'A steady current of 0.80 A flows for 3.0 min. Calculate the charge transferred and state what would happen to the transferred charge if the time doubled at constant current.'
    },
    'pd-resistance': {
      chain:['Potential difference is energy transferred per unit charge: V = W/Q.','Resistance links p.d. and current at an operating point: R = V/I.','For an ohmic conductor at constant temperature, V is proportional to I.','Changing temperature can change resistance, so R is not automatically constant.'],
      maths:'A component transfers 24 J when 4.0 C passes through it. V = 24/4.0 = 6.0 V. If the current is 0.30 A, R = 6.0/0.30 = 20 Ω.',
      explain:'“Voltage flows” is incorrect. Charge/current flows; potential difference is an energy-per-charge quantity between two points.',
      stretch:'A resistor has 9.0 V across it and transfers 54 J. Calculate the charge that passes and, if this occurs in 20 s, calculate the current and resistance.'
    },
    'iv-ohmic': {
      chain:['An I–V graph shows how current responds to applied p.d.','For an ohmic conductor at constant temperature, the graph is a straight line through the origin.','On an I-against-V graph, gradient = I/V = 1/R.','A steeper I–V line therefore represents a smaller resistance.'],
      maths:'If an I–V graph gives I = 0.40 A at V = 8.0 V, R = V/I = 20 Ω and the I–V gradient is 0.050 A V⁻¹.',
      explain:'Always identify the graph axes before linking gradient to resistance. If V is on the y-axis instead, the gradient is R.',
      stretch:'Two straight I–V lines pass through the origin. Line A is twice as steep as line B. Explain the relationship between their resistances.'
    },
    'iv-nonohmic': {
      chain:['A filament lamp heats strongly as current increases.','Higher temperature causes greater lattice vibration and more electron–ion collisions.','Its resistance therefore increases, so the I–V curve becomes less steep at larger |V|.','A diode conducts strongly in one direction and has very small reverse current in the simplified model.'],
      maths:'At one lamp operating point, V = 3.0 V and I = 0.45 A, so R ≈ 6.7 Ω. At 6.0 V and 0.60 A, R = 10 Ω: the hot filament has greater resistance.',
      explain:'Do not claim the lamp “runs out of current”. The curvature comes from changing resistance as temperature changes.',
      stretch:'Use two operating points on a filament-lamp I–V curve to show quantitatively that its resistance increases as it gets hotter.'
    },
    'resistivity': {
      chain:['Resistance depends on material and geometry.','For a uniform wire, R = ρL/A.','Doubling length doubles resistance if area and temperature stay constant.','Doubling diameter makes area four times larger, so resistance becomes one quarter.'],
      maths:'For d = 0.40 mm, A = π(d/2)² = 1.26 × 10⁻⁷ m². If R = 2.4 Ω for L = 0.75 m, ρ = RA/L ≈ 4.0 × 10⁻⁷ Ω m.',
      explain:'Diameter must be converted from mm to m before area is calculated. Because area depends on d², diameter uncertainty matters strongly.',
      stretch:'A wire is replaced by the same material with twice the length and half the diameter. Determine the factor by which its resistance changes.'
    },
    'temperature': {
      chain:['In a metal, increasing temperature increases lattice vibration.','More frequent collisions reduce electron mobility and resistance rises.','An NTC thermistor behaves differently: its resistance falls as temperature rises.','Superconductors have zero electrical resistance below a critical temperature.'],
      maths:'If a metallic wire rises from 5.0 Ω to 6.5 Ω while p.d. stays at 3.0 V, current falls from 0.60 A to about 0.46 A.',
      explain:'Do not transfer the metal model directly to thermistors. Their resistance–temperature behaviour is different and should be described from the appropriate characteristic.',
      stretch:'Explain why a metal wire and an NTC thermistor connected separately to the same fixed p.d. show opposite current changes when heated.'
    },
    'series': {
      chain:['In series there is only one path, so the current is the same through each component.','The supply p.d. is shared between components.','Energy conservation gives the sum of component p.d.s equal to the supply p.d.','For resistors in series, R_total = R1 + R2 + …'],
      maths:'A 4 Ω and 8 Ω resistor in series across 12 V give R_total = 12 Ω, I = 1.0 A, with 4 V and 8 V across the resistors.',
      explain:'The larger resistor gets the larger share of p.d. because the same current flows through both and V = IR.',
      stretch:'Three series resistors of 2 Ω, 5 Ω and 8 Ω are connected to 15 V. Calculate the current and each p.d., then check energy conservation.'
    },
    'parallel-power': {
      chain:['Parallel branches share the same p.d.','Charge conservation means branch currents add at junctions.','Adding a parallel branch reduces total resistance.','At fixed supply p.d., a lower total resistance increases total current and therefore total power P = VI.'],
      maths:'6 Ω and 3 Ω in parallel give 1/R = 1/6 + 1/3 = 1/2, so R = 2 Ω. Across 12 V, total current is 6 A.',
      explain:'The total parallel resistance must be smaller than the smallest branch resistance. Use this as a quick check.',
      stretch:'Two resistors are connected in parallel to a fixed supply. Explain mathematically why adding a third resistor in parallel increases the current drawn from the supply.'
    },
    'potential-divider': {
      chain:['A potential divider uses series resistors to produce a fraction of the input p.d.','If Vout is across R2, Vout = Vin R2/(R1 + R2).','Changing a sensor resistance changes the fraction of Vin across it.','The direction of Vout change depends on where the sensor is placed and where Vout is measured.'],
      maths:'With Vin = 9 V, R1 = 3 kΩ and R2 = 6 kΩ, Vout = 9 × 6/(3+6) = 6 V.',
      explain:'State explicitly which component Vout is measured across. Otherwise a correct sensor trend can appear reversed.',
      stretch:'Design a divider from two resistors to produce approximately 3.0 V from a 12 V supply. Give one valid resistor ratio and justify it.'
    },
    'emf-internal': {
      chain:['EMF ε is energy supplied per unit charge by a source.','Some energy is transferred inside the source because it has internal resistance r.','Terminal p.d. is V = ε − Ir.','With external load R, I = ε/(R+r).'],
      maths:'For ε = 6.0 V, r = 1.0 Ω and R = 5.0 Ω, I = 1.0 A. Lost volts Ir = 1.0 V, so terminal p.d. = 5.0 V.',
      explain:'EMF is not a force. It is measured in volts and represents energy supplied per coulomb.',
      stretch:'A cell has ε = 4.5 V and r = 0.50 Ω. Calculate terminal p.d. for a 4.0 Ω load, then explain why terminal p.d. approaches ε as R becomes very large.'
    },
    'synthesis': {
      chain:['Start by identifying what is conserved: charge at junctions and energy around loops.','Reduce resistor combinations where possible.','Use V = IR locally for individual components and P = VI for energy-transfer rate.','For real sources include internal resistance before checking whether the final values are physically sensible.'],
      maths:'A 6 V cell with r = 0.50 Ω supplies two 6 Ω resistors in parallel. External R = 3 Ω, so I = 6/(3.5) ≈ 1.71 A and terminal p.d. ≈ 5.14 V.',
      explain:'Complex circuits become manageable when you separate source behaviour, network resistance and component-level quantities.',
      stretch:'Create a complete solution path for a circuit containing a real cell, a series resistor and two parallel resistors. State the order in which you would calculate quantities and why.'
    }
  };

  const chapterDepth = {
    basics:{
      sections:[
        ['From microscopic motion to measurable current','In a metal, conduction electrons have rapid random thermal motion even when no current flows. Applying an electric field produces a small net drift superimposed on that random motion. The measurable current depends on the rate at which charge crosses a section of conductor, not on individual electrons racing around the circuit.'],
        ['Energy transfer and potential difference','Potential difference compares two points. A p.d. of 1 V means 1 J of energy is transferred per coulomb of charge between those points. This is why V = W/Q and W = VQ are energy statements, not merely calculation rules.'],
        ['Resistance as an operating relationship','R = V/I defines resistance at an operating point. For an ohmic conductor at constant temperature, R remains constant and V is proportional to I. For many devices, however, temperature or other physical conditions change as current changes, so resistance can vary.']
      ],
      derivation:'Combine Q = It with W = VQ to obtain W = VIt. Since P = W/t, electrical power becomes P = VI.',
      exam:'When asked to explain current or p.d., link the definition to charge or energy explicitly. Avoid circular phrases such as “voltage is the amount of volts”.'
    },
    iv:{
      sections:[
        ['Reading I–V characteristics properly','An I–V characteristic is evidence about how a component behaves as its operating point changes. Always identify which variable is on each axis before interpreting gradient.'],
        ['Filament-lamp feedback','Increasing current raises the filament temperature. Higher temperature increases lattice vibration, which increases collision frequency and resistance. That increased resistance then limits further current increase, producing the characteristic curved graph.'],
        ['Diode asymmetry','A diode is designed to conduct predominantly in one direction. In the simplified A-level treatment, reverse current is negligible while forward current increases rapidly once the forward bias is sufficiently large.']
      ],
      derivation:'For an I-against-V graph of an ohmic resistor, gradient = ΔI/ΔV = 1/R. Therefore R = 1/gradient.',
      exam:'For curved graphs, use V/I at a stated operating point for resistance unless the question explicitly asks for a differential quantity.'
    },
    resistivity:{
      sections:[
        ['Separating material from geometry','Resistance alone is not a material property because it changes with length and cross-sectional area. Resistivity ρ allows materials to be compared independently of sample geometry when temperature is controlled.'],
        ['Why area matters so strongly','A larger cross-sectional area provides more parallel conduction paths. Since A = πd²/4, small changes in diameter can produce much larger percentage changes in area and therefore in calculated resistivity.'],
        ['Temperature dependence','For a metal, higher temperature usually means stronger lattice vibrations and more frequent scattering of conduction electrons. That raises resistance and can distort a resistivity experiment if the wire heats during measurements.']
      ],
      derivation:'Rearrange R = ρL/A to ρ = RA/L. If R is plotted against L, gradient = ρ/A, so ρ = gradient × A.',
      exam:'State the SI unit Ω m and convert diameter to metres before squaring it.'
    },
    rp5:{
      sections:[
        ['Why use several wire lengths','A range of lengths produces a set of R values so a graph can be used. A best-fit gradient uses all the data and is usually more reliable than calculating ρ from one reading.'],
        ['Why repeat diameter measurements','Real wire is not perfectly uniform and micrometer readings have finite resolution. Measuring at several positions, and ideally in different orientations, gives a better estimate of mean diameter.'],
        ['Managing heating','Current heats the test wire. If temperature rises, resistance changes while length is supposedly the only independent variable. Using a low current and opening the switch between readings helps control this systematic effect.']
      ],
      derivation:'Measure V and I, calculate R = V/I, plot R against L, find gradient m, then calculate ρ = mA with A = πd²/4.',
      exam:'A strong evaluation identifies the direction of an error. For example, heating raises R, so it can make the calculated resistivity too large.'
    },
    circuits:{
      sections:[
        ['Why current is the same in series','With a single path and steady conditions, charge cannot accumulate indefinitely at a component. The same rate of charge flow therefore passes each point in the series loop.'],
        ['Why p.d. is the same across parallel branches','Parallel branches share the same two connection nodes. The energy transferred per coulomb between those two nodes is therefore the same for each branch.'],
        ['Power and network behaviour','Power is the rate of energy transfer. At fixed supply p.d., reducing total resistance increases total current and hence increases total power drawn from the source.']
      ],
      derivation:'Series: Vtotal = I(R1+R2), so Rtotal = R1+R2. Parallel: Itotal = V/R1 + V/R2 = V(1/R1+1/R2), giving 1/Rtotal = 1/R1+1/R2.',
      exam:'Use conservation language: charge conservation for junction currents and energy conservation for p.d. sums around a loop.'
    },
    divider:{
      sections:[
        ['Divider ratio from series current','The same current flows through both divider resistors. Vout across one resistor is therefore proportional to that resistor’s share of the total series resistance.'],
        ['Sensor placement controls response','If an NTC is the lower resistor and Vout is measured across it, heating decreases its resistance and usually decreases Vout. Put the sensor in the other position and the direction reverses.'],
        ['Loading effect','A real output device connected across part of a divider can change the effective resistance of that part. A high-resistance voltmeter minimises this loading and better reflects the intended divider ratio.']
      ],
      derivation:'I = Vin/(R1+R2). Since Vout = IR2, substituting I gives Vout = VinR2/(R1+R2).',
      exam:'Draw or label clearly which resistor is R1, which is R2, and where Vout is measured before substituting numbers.'
    },
    emf:{
      sections:[
        ['EMF and terminal p.d. are different','EMF describes energy supplied per coulomb by the source. Terminal p.d. is the energy per coulomb delivered to the external circuit, which is smaller when current flows through internal resistance.'],
        ['Lost volts','The internal p.d. is Ir. Energy conservation gives ε = V + Ir, so V = ε − Ir. The larger the current, the greater the lost volts.'],
        ['Load resistance controls current','For a source with internal resistance, the external load and internal resistance are effectively in series for current calculation, giving I = ε/(R+r).']
      ],
      derivation:'External terminal p.d. V = IR while ε = I(R+r). Expanding gives ε = IR + Ir = V + Ir.',
      exam:'If a question gives open-circuit terminal p.d., current is approximately zero, so the terminal p.d. is approximately equal to the emf.'
    },
    rp6:{
      sections:[
        ['Why vary the load','Changing the variable resistor changes current, producing multiple pairs of terminal p.d. V and current I. These points reveal the linear relationship V = ε − Ir.'],
        ['Why the graph is powerful','On a V-against-I graph, the vertical intercept is ε and the gradient is −r. Using a best-fit line reduces the influence of random scatter.'],
        ['Why open the switch','Leaving current flowing can warm the cell and change its internal resistance or discharge it. Opening the switch between readings helps keep source conditions more stable.']
      ],
      derivation:'Write V = ε − Ir in the form y = c + mx. Then y→V, x→I, intercept c→ε and gradient m→−r.',
      exam:'Quote internal resistance as the magnitude of the gradient and include Ω as the unit.'
    }
  };

  function activeLessonId(){ return $('.course-button.active')?.dataset.lesson || null; }
  function activeChapterId(){ return $('.textbook-chapter-button.active')?.dataset.textbookChapter || null; }

  function ensureStyle(){
    if($('#learningDepthStyle')) return;
    const st=document.createElement('style');
    st.id='learningDepthStyle';
    st.textContent=`
      .depth-v2{margin:18px 0;border:1px solid var(--border);border-radius:18px;padding:16px;background:linear-gradient(145deg,#0b1a2b,#071522)}
      .depth-v2-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:12px}.depth-v2-head h3{margin:3px 0}.depth-v2-head p{margin:0;color:var(--muted)}
      .depth-v2-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.depth-v2-card{border:1px solid #29465f;border-radius:14px;padding:13px;background:#081421}.depth-v2-card h4{margin:0 0 8px}.depth-v2-card p{margin:0;line-height:1.55}.depth-v2-card ol,.depth-v2-card ul{margin:0;padding-left:20px}.depth-v2-card li{margin:7px 0;line-height:1.45}.depth-v2-card.stretch{border-color:#695fa8;background:linear-gradient(145deg,#11182b,#0c1324)}
      .confidence-row{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:center;margin-top:12px}.confidence-row input{width:100%}.confidence-row strong{min-width:42px;text-align:right}
      .teachback{width:100%;min-height:92px;margin-top:8px;background:#06111e;color:var(--text);border:1px solid #31506e;border-radius:10px;padding:10px;resize:vertical}
      .textbook-deep-v2{margin:20px 0}.textbook-deep-v2 .deep-section{display:grid;grid-template-columns:42px 1fr;gap:12px;padding:16px 0;border-top:1px solid rgba(130,160,190,.18)}.textbook-deep-v2 .deep-index{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#17314a;color:#8ed8ff;font-weight:900}.textbook-deep-v2 h3{margin:0 0 7px}.textbook-deep-v2 p{margin:0;line-height:1.65}.derivation-box{margin:14px 0;padding:14px;border-radius:14px;border:1px solid #42617f;background:#08192a}.derivation-box strong{display:block;margin-bottom:6px}.exam-bridge{margin:14px 0;padding:14px;border-radius:14px;border:1px solid rgba(99,217,164,.45);background:rgba(99,217,164,.06)}
      .depth-chip{display:inline-flex;padding:5px 8px;border-radius:999px;background:#17314a;color:#bfe8ff;font-size:.7rem;font-weight:850}
      @media(max-width:760px){.depth-v2-grid{grid-template-columns:1fr}.depth-v2-head{display:block}.confidence-row{grid-template-columns:1fr}.confidence-row strong{text-align:left}}
    `;
    document.head.appendChild(st);
  }

  function renderLessonDepth(){
    const panel=$('#lessonPanel'); if(!panel) return;
    const id=activeLessonId(); const d=lessonDepth[id]; if(!id || !d) return;
    const old=$('#lessonDepthV2'); if(old) old.remove();
    const wrap=document.createElement('section');
    wrap.id='lessonDepthV2'; wrap.className='depth-v2';
    const conf=saved[`confidence:${id}`] ?? 3;
    const note=saved[`teachback:${id}`] ?? '';
    wrap.innerHTML=`
      <div class="depth-v2-head"><div><span class="depth-chip">Deepen your understanding</span><h3>Make the physics connect</h3><p>Use this after the core lesson to strengthen explanation, calculation and transfer.</p></div></div>
      <div class="depth-v2-grid">
        <article class="depth-v2-card"><h4>Reasoning chain</h4><ol>${d.chain.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></article>
        <article class="depth-v2-card"><h4>Mini worked calculation</h4><p>${esc(d.maths)}</p></article>
        <article class="depth-v2-card"><h4>High-value exam distinction</h4><p>${esc(d.explain)}</p></article>
        <article class="depth-v2-card stretch"><h4>Stretch problem</h4><p>${esc(d.stretch)}</p><textarea class="teachback" data-depth-note="${esc(id)}" placeholder="Work through the reasoning here...">${esc(note)}</textarea></article>
      </div>
      <div class="confidence-row"><span>Confidence after this topic</span><input type="range" min="1" max="5" step="1" value="${conf}" data-depth-confidence="${esc(id)}"><strong>${conf}/5</strong></div>`;
    const controls=$('.lesson-stage-controls',panel);
    if(controls) controls.insertAdjacentElement('beforebegin',wrap); else panel.appendChild(wrap);
  }

  function renderChapterDepth(){
    const article=$('#textbookArticle'); if(!article) return;
    const id=activeChapterId(); const d=chapterDepth[id]; if(!id || !d) return;
    const old=$('#textbookDeepV2'); if(old) old.remove();
    const wrap=document.createElement('section'); wrap.id='textbookDeepV2'; wrap.className='textbook-deep-v2';
    const note=saved[`chapter-note:${id}`] ?? '';
    wrap.innerHTML=`
      <section class="depth-v2"><div class="depth-v2-head"><div><span class="depth-chip">Deeper textbook layer</span><h3>Why the equations work</h3><p>Extra conceptual detail for stronger A-level explanations and unfamiliar problems.</p></div></div>
        ${d.sections.map((s,i)=>`<div class="deep-section"><div class="deep-index">${i+1}</div><div><h3>${esc(s[0])}</h3><p>${esc(s[1])}</p></div></div>`).join('')}
        <div class="derivation-box"><strong>Equation link / derivation</strong><p>${esc(d.derivation)}</p></div>
        <div class="exam-bridge"><strong>Exam bridge</strong><p>${esc(d.exam)}</p></div>
        <label><strong>Teach it back in your own words</strong><textarea class="teachback" data-chapter-note="${esc(id)}" placeholder="Explain the chapter without copying the notes...">${esc(note)}</textarea></label>
      </section>`;
    const nav=$('.textbook-nav-row',article); if(nav) nav.insertAdjacentElement('beforebegin',wrap); else article.appendChild(wrap);
  }

  let lessonQueued=false,chapterQueued=false;
  function queueLesson(){ if(lessonQueued) return; lessonQueued=true; requestAnimationFrame(()=>{lessonQueued=false; renderLessonDepth();}); }
  function queueChapter(){ if(chapterQueued) return; chapterQueued=true; requestAnimationFrame(()=>{chapterQueued=false; renderChapterDepth();}); }

  document.addEventListener('input',e=>{
    if(e.target.matches('[data-depth-confidence]')){
      const id=e.target.dataset.depthConfidence; saved[`confidence:${id}`]=Number(e.target.value); persist();
      const out=e.target.parentElement?.querySelector('strong'); if(out) out.textContent=`${e.target.value}/5`;
    }
    if(e.target.matches('[data-depth-note]')){ saved[`teachback:${e.target.dataset.depthNote}`]=e.target.value; persist(); }
    if(e.target.matches('[data-chapter-note]')){ saved[`chapter-note:${e.target.dataset.chapterNote}`]=e.target.value; persist(); }
  });

  function start(){
    ensureStyle(); queueLesson(); queueChapter();
    const lp=$('#lessonPanel'); if(lp) new MutationObserver(queueLesson).observe(lp,{childList:true,subtree:false});
    const ta=$('#textbookArticle'); if(ta) new MutationObserver(queueChapter).observe(ta,{childList:true,subtree:false});
    document.addEventListener('click',e=>{
      if(e.target.closest('.course-button')) setTimeout(queueLesson,30);
      if(e.target.closest('.textbook-chapter-button,[data-textbook-prev],[data-textbook-next],[data-open-textbook]')) setTimeout(queueChapter,50);
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
