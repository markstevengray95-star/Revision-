(() => {
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const lessonDepth={
    'current-charge':{
      big:'Electric current describes how quickly charge crosses a point. In a metal, conduction electrons already exist throughout the lattice; closing the circuit establishes an electric field through the conductor and produces a small net drift superimposed on their random thermal motion.',
      deep:[
        ['Current is a rate, not an amount','The statement I = ΔQ/Δt means that current measures charge transferred per unit time. A current of 1 A means 1 C of charge passes a chosen cross-section each second. This is why charge questions should be approached by identifying both the current and the time interval.'],
        ['Electron drift and conventional current','Electrons carry negative charge, so their drift direction in a metallic wire is opposite to conventional current. Circuit diagrams use conventional current because the convention was established before the electron was identified and remains useful for circuit laws.'],
        ['What changes when current changes?','A larger current means more charge passes a cross-section each second. In a given metal wire this can arise from a stronger electric field producing a larger drift effect. Do not describe electrons as travelling from the cell to the component almost instantly; the field establishes through the circuit much faster than an individual electron drifts.']
      ],
      deriv:['Start from I = ΔQ/Δt.','Multiply both sides by Δt.','ΔQ = IΔt.','Use seconds for time and amperes for current so the answer is in coulombs.'],
      worked:['A current of 0.42 A flows for 3.5 minutes. Find the charge transferred.','Convert 3.5 min to 210 s.','Use Q = It.','Q = 0.42 × 210 = 88.2 C.','The answer represents total charge transferred, not the number of electrons.'],
      practical:'An ammeter measures current by being placed in series. In an ideal model it has zero resistance, so inserting it does not change the circuit current.',
      exam:'For explanations, link “rate of flow of charge” to I = ΔQ/Δt and distinguish clearly between electron drift and conventional-current direction.',
      links:'This idea is the foundation for junction rules later: if charge is not accumulating at a junction, the rate at which charge arrives must equal the rate at which charge leaves.'
    },
    'pd-resistance':{
      big:'Potential difference is an energy-transfer idea: it tells you how much energy is transferred per coulomb of charge. Resistance describes how much potential difference is required to produce a given current under the stated physical conditions.',
      deep:[
        ['Potential difference is energy per charge','V = W/Q means 1 V is 1 J C⁻¹. A 6 V component transfers 6 J of energy for every coulomb of charge passing through it. This is more informative than saying voltage “pushes current” because it connects circuit behaviour to energy conservation.'],
        ['Resistance is an operating relationship','R = V/I compares p.d. and current at a particular operating condition. For an ohmic conductor at constant temperature the ratio stays constant; for a lamp or diode it changes with operating point.'],
        ['Microscopic energy transfer','In a metal, the electric field does work on charge carriers. Collisions and interactions with the lattice transfer energy to the material, which can increase internal energy and temperature.']
      ],
      deriv:['Potential difference: V = W/Q, so W = VQ.','Resistance: R = V/I, so V = IR and I = V/R.','Choose the relationship that contains the quantity asked for and the values supplied.'],
      worked:['A resistor transfers 54 J when 6.0 C passes through it. Find the p.d.','Use V = W/Q.','V = 54/6.0 = 9.0 V.','If its current is 0.30 A at this condition, R = V/I = 30 Ω.'],
      practical:'A voltmeter is connected in parallel across the component because it measures the energy change per coulomb between two points. In ideal questions its resistance is treated as infinite.',
      exam:'Do not define p.d. as “the current supplied”. Use energy transferred per unit charge. Do not assume R is constant unless the component is ohmic and physical conditions are constant.',
      links:'Power follows naturally from energy transfer: combining W = VQ with Q = It gives P = W/t = VI.'
    },
    'iv-ohmic':{
      big:'An I–V characteristic is a map of a component’s electrical behaviour. For an ohmic conductor at constant physical conditions, current is directly proportional to p.d., giving a straight line through the origin.',
      deep:[
        ['Read the axes before using the gradient','If I is vertical and V horizontal, gradient = ΔI/ΔV = 1/R. If V is vertical and I horizontal, gradient = ΔV/ΔI = R. The physics is unchanged but the numerical interpretation of the gradient reverses.'],
        ['Why constant temperature matters','As a metal warms, lattice vibrations become larger. This increases scattering of conduction electrons and usually increases resistance. A resistor may therefore stop producing a perfectly straight characteristic if it heats significantly.'],
        ['Ideal meters in the model','An ideal ammeter has zero resistance and an ideal voltmeter has infinite resistance. These idealisations prevent the measuring instruments from changing the circuit being investigated.']
      ],
      deriv:['For constant R, V = IR.','Rearrange to I = (1/R)V.','Comparing with y = mx shows that on an I-versus-V graph the gradient m = 1/R.'],
      worked:['An I–V graph has I on the vertical axis. Current rises from 0.10 A to 0.40 A while p.d. rises from 2.0 V to 8.0 V.','Gradient = ΔI/ΔV = 0.30/6.0 = 0.050 A V⁻¹.','R = 1/gradient = 20 Ω.'],
      practical:'Use a variable resistor or variable supply to obtain several operating points. Include values over a useful range and reverse polarity if a full characteristic is required.',
      exam:'Always state “at constant physical conditions” when invoking Ohm’s law. Check the graph axes before saying what the gradient represents.',
      links:'The same graph-reading discipline is used in RP6, where the gradient of V against I is negative and its magnitude gives internal resistance.'
    },
    'iv-nonohmic':{
      big:'Non-ohmic components do not keep a constant V/I ratio. Their I–V curve carries physical information about how the component changes internally as its operating point changes.',
      deep:[
        ['Filament lamp','Increasing current transfers energy to the filament more rapidly. The filament temperature rises, lattice vibration increases and the metal resistance increases. The curve therefore becomes progressively less steep on an I-against-V plot.'],
        ['Semiconductor diode','A diode has strongly direction-dependent behaviour. In forward bias the current remains small until the applied p.d. is sufficient for strong conduction, after which current rises rapidly. In reverse bias the simple A-level model has only a very small current.'],
        ['Resistance at one operating point','For a non-ohmic component, R = V/I still gives the resistance at a selected operating point. What fails is the assumption that this value remains constant as V and I change.']
      ],
      deriv:['Choose one operating point from the graph.','Read V and I for that same point.','Calculate R = V/I.','Repeat at another point to show that the resistance changes.'],
      worked:['A filament lamp operates at 6.0 V and 0.50 A. Later it operates at 10.0 V and 0.65 A.','First resistance = 6.0/0.50 = 12 Ω.','Second resistance = 10.0/0.65 ≈ 15.4 Ω.','The higher resistance is consistent with the hotter filament.'],
      practical:'When collecting an I–V curve, obtain enough readings to reveal the shape rather than only two points. Reverse the supply connections carefully when negative values are needed.',
      exam:'Describe the curve first, then explain it. For a lamp, link current → heating → increased lattice vibration → increased resistance.',
      links:'Potential dividers later use components such as NTC thermistors and LDRs whose resistance changes deliberately with an environmental variable.'
    },
    'resistivity':{
      big:'Resistivity is a material property that separates the effect of the material from the geometry of the sample. For a uniform wire, resistance increases with length and decreases with cross-sectional area.',
      deep:[
        ['Geometry and material','R = ρL/A says that two wires of the same material can have different resistances because their length or area differs, even though their resistivity is the same at the same temperature.'],
        ['Why diameter matters so much','For a circular wire A = πd²/4. Because area depends on d², a percentage uncertainty in diameter contributes roughly twice that percentage uncertainty to area. Repeated diameter measurements are therefore especially important.'],
        ['Graph method in RP5','With ρ and A constant, R = (ρ/A)L. A graph of R against L should therefore be linear. Its gradient is ρ/A, so ρ = gradient × A.']
      ],
      deriv:['Start with R = ρL/A.','For fixed material and temperature, ρ is constant; for one wire, A is constant.','Therefore R ∝ L.','On a graph of R against L, gradient = ρ/A.','Multiply gradient by A to obtain ρ.'],
      worked:['A wire has diameter 0.36 mm. Its R–L graph has gradient 8.2 Ω m⁻¹.','Convert d = 3.6 × 10⁻⁴ m.','A = πd²/4 = 1.02 × 10⁻⁷ m².','ρ = gradient × A ≈ 8.4 × 10⁻⁷ Ω m.'],
      practical:'Measure diameter at several positions and orientations, use a long range of lengths, avoid heating by using a low current and opening the switch between readings, and calculate R from paired V and I readings.',
      exam:'Keep units consistent. Millimetres must be converted to metres before calculating area in SI units. Use the graph gradient rather than a single pair of readings when the question asks for a graphical method.',
      links:'The temperature lesson explains why RP5 should limit heating: resistivity and hence resistance of a metal change with temperature.'
    },
    'temperature':{
      big:'Temperature can change resistance because it changes the microscopic processes that limit charge transport. Metals and NTC thermistors respond in opposite directions, while superconductors exhibit a sharp transition to zero resistivity below a critical temperature.',
      deep:[
        ['Metal conductors','As temperature rises, ions in the lattice vibrate more strongly. Conduction electrons are scattered more frequently, so resistance increases.'],
        ['NTC thermistors','For an NTC thermistor, increasing temperature decreases resistance. This makes the device useful as a temperature sensor, particularly when combined with a potential divider.'],
        ['Superconductivity','Certain materials have zero resistivity at and below a material-dependent critical temperature. Applications include producing strong magnetic fields and reducing resistive energy losses. The critical magnetic field is not required here.']
      ],
      deriv:['For a metal wire of fixed geometry, R = ρL/A.','L and A are approximately fixed during a normal measurement.','A temperature-induced change in resistivity therefore produces a change in resistance.'],
      worked:['A sensor uses an NTC thermistor as temperature rises. Predict the resistance change and the current change if the thermistor is connected alone to a constant-p.d. supply.','NTC resistance decreases.','With V constant, I = V/R, so current increases.'],
      practical:'When investigating temperature dependence, allow the sensor to reach thermal equilibrium before recording a reading and measure temperature close to the component itself.',
      exam:'Do not apply the metal explanation to an NTC thermistor. State the correct trend first, then use it in the circuit relationship required by the question.',
      links:'In a potential divider, the changing sensor resistance is converted into a changing output p.d., allowing temperature or light level to be measured electrically.'
    },
    'series':{
      big:'Series-circuit rules come from conservation laws. Charge conservation gives the same current through every component on an unbranched path, while energy conservation gives the rule for sharing potential difference.',
      deep:[
        ['Same current','In steady state, charge is not accumulating between components. The rate of charge flow into a component must equal the rate out, so current is the same throughout a series path.'],
        ['Potential differences add','Each coulomb gains energy from the source and transfers portions of that energy in the components. Therefore the supply p.d. equals the sum of the p.d.s across the series components.'],
        ['Equivalent resistance','If the same current I passes through R₁ and R₂, then V = IR₁ + IR₂ = I(R₁ + R₂). The circuit behaves like one resistance Rtotal = R₁ + R₂.']
      ],
      deriv:['Write Vtotal = V₁ + V₂.','Use V = IR for each term.','IRtotal = IR₁ + IR₂.','Divide by the common current I.','Rtotal = R₁ + R₂.'],
      worked:['A 4.0 Ω and 8.0 Ω resistor are in series across 12 V.','Rtotal = 12 Ω.','I = V/R = 12/12 = 1.0 A.','V₁ = 4.0 V and V₂ = 8.0 V; these add to the 12 V supply.'],
      practical:'Use one ammeter at different positions in a simple series loop to test the current rule, then place a voltmeter across each resistor to test energy sharing.',
      exam:'Explain series rules using conservation of charge and conservation of energy rather than memorised statements alone.',
      links:'The potential divider is a purposeful application of series p.d. sharing.'
    },
    'parallel-power':{
      big:'Parallel branches share the same pair of junctions, so each branch has the same potential difference. Charge conservation determines how current divides between branches.',
      deep:[
        ['Current at a junction','At a junction, total current entering equals total current leaving because charge is conserved. A lower-resistance branch takes a larger current for the same branch p.d.'],
        ['Why total resistance decreases','Adding another parallel branch creates another path for charge flow. At the same supply p.d. the total current increases, so Rtotal = V/Itotal decreases.'],
        ['Power consequence','With an ideal constant-voltage supply, Ptotal = VItotal. Therefore adding a parallel branch usually increases total power drawn because total current increases.']
      ],
      deriv:['For two branches: Itotal = I₁ + I₂.','Use I = V/R and the same V across each branch.','V/Rtotal = V/R₁ + V/R₂.','Divide by V.','1/Rtotal = 1/R₁ + 1/R₂.'],
      worked:['6.0 Ω and 3.0 Ω resistors are in parallel across 12 V.','I₁ = 12/6 = 2.0 A.','I₂ = 12/3 = 4.0 A.','Itotal = 6.0 A, so Rtotal = 12/6 = 2.0 Ω.','Ptotal = VI = 72 W.'],
      practical:'Measure current before a junction and in each branch. The readings should satisfy Itotal = I₁ + I₂ within experimental uncertainty.',
      exam:'Never add parallel resistances directly. A useful sense check is that the equivalent resistance must be smaller than the smallest individual branch resistance.',
      links:'Parallel reasoning also matters when a measuring device or load is connected across part of a potential divider.'
    },
    'potential-divider':{
      big:'A potential divider converts a fixed supply p.d. into a chosen or variable output p.d. by sharing the supply across series resistances.',
      deep:[
        ['Deriving the divider equation','The same current flows through both series components. I = Vin/(R₁+R₂), and Vout across R₂ is IR₂. Substitution gives Vout = VinR₂/(R₁+R₂).'],
        ['Sensor direction matters','If an NTC or LDR is the lower component and Vout is measured across it, a decrease in its resistance decreases its fraction of the total resistance and usually decreases Vout. Swapping positions reverses the trend.'],
        ['Loading as an extension','A real output device connected across R₂ can act as an additional parallel resistance. This changes the effective lower resistance and can change Vout. A high-resistance measuring device minimises this effect.']
      ],
      deriv:['Series current I = Vin/(R₁+R₂).','Output is across R₂, so Vout = IR₂.','Substitute I.','Vout = Vin × R₂/(R₁+R₂).'],
      worked:['A 9.0 V supply is connected to R₁ = 2.0 kΩ and R₂ = 4.0 kΩ.','Vout = 9.0 × 4.0/(2.0+4.0).','Vout = 6.0 V.','The ratio, not the absolute size alone, determines the ideal unloaded output.'],
      practical:'Build the two resistors in series across the supply and measure Vout across only the chosen resistor or sensor. Vary the sensor stimulus and record the output response.',
      exam:'State exactly which component Vout is measured across before predicting whether it rises or falls. Use the divider equation to support the qualitative explanation.',
      links:'Potential dividers connect resistance changes from thermistors/LDRs to measurable voltage changes used by sensing and control systems.'
    },
    'emf-internal':{
      big:'EMF is the energy supplied per coulomb by a source. A real source also has internal resistance, so some of that energy can be transferred inside the source itself when current flows.',
      deep:[
        ['EMF versus terminal p.d.','The emf ε is the energy supplied per unit charge by the source. The terminal p.d. V is the energy per unit charge delivered to the external circuit. When current flows, the difference ε − V equals the lost volts Ir.'],
        ['Equation from energy conservation','For each coulomb, energy supplied by the source is shared between the external circuit and the internal resistance. Therefore ε = V + Ir, or V = ε − Ir.'],
        ['Graph interpretation','Plotting V vertically against I horizontally gives a straight line with intercept ε and gradient −r. The magnitude of the gradient is the internal resistance.']
      ],
      deriv:['Begin with ε = V + Ir.','Rearrange to V = ε − Ir.','Compare with y = c + mx.','y → V, x → I, intercept c → ε, gradient m → −r.'],
      worked:['A cell has ε = 1.50 V and r = 0.40 Ω. It supplies 0.80 A.','Lost volts = Ir = 0.80 × 0.40 = 0.32 V.','Terminal p.d. V = 1.50 − 0.32 = 1.18 V.'],
      practical:'For RP6, vary the external load, record paired I and V values, open the switch between readings, then fit V against I over a useful current range.',
      exam:'Do not say emf is a force. It is energy supplied per unit charge. When finding r from a V–I graph, use the magnitude of the negative gradient.',
      links:'The result links circuit energy, power and source behaviour: larger current causes larger lost volts and more internal heating.'
    },
    'synthesis':{
      big:'Electricity questions often combine several models at once. Strong solutions identify the circuit structure first, apply conservation laws, choose the relevant component model and only then calculate.',
      deep:[
        ['A reliable circuit-analysis order','Identify series and parallel sections. Apply junction current rules and loop energy rules. Replace resistor groups with equivalent resistance where useful. Then calculate currents, p.d.s and powers.'],
        ['Check the component model','Decide whether a resistance can be treated as constant. A fixed resistor may be ohmic at constant temperature, while a lamp, diode, NTC or LDR changes behaviour with operating conditions.'],
        ['Include the source when necessary','If internal resistance is non-negligible, the external circuit does not receive the full emf. Use V = ε − Ir and remember that changing external resistance changes current and therefore terminal p.d.']
      ],
      deriv:['Simplify resistor combinations where appropriate.','Find total current from the effective external resistance and source model.','Work back through branches to obtain individual currents and p.d.s.','Use P = VI, I²R or V²/R only after the correct component values are known.'],
      worked:['A source with ε = 6.0 V and r = 1.0 Ω supplies a 5.0 Ω external resistor.','Total resistance = 6.0 Ω.','I = 6.0/6.0 = 1.0 A.','Terminal p.d. = ε − Ir = 5.0 V.','External power = VI = 5.0 W; internal power = I²r = 1.0 W.'],
      practical:'Use simulation and practical data to check whether numerical answers match observed trends. A physically sensible solution should agree with conservation of charge and energy.',
      exam:'Write the physical principle beside each major step. This makes multi-stage solutions easier to follow and helps avoid using a correct equation in the wrong part of a circuit.',
      links:'This synthesis prepares students for later A-level topics where electricity ideas support capacitors, electric fields, magnetic effects and electromagnetic induction.'
    }
  };
  const chapterDepth={
    basics:['A useful unifying picture is to track both charge and energy. Current tells you the rate at which charge moves through a cross-section; potential difference tells you the energy transferred per coulomb between two points; resistance links the p.d. and current for a component at a stated operating condition.','When a circuit question feels confusing, annotate each branch with current and each component with p.d. Then ask which conservation law applies: charge at junctions or energy around a complete loop.'],
    iv:['An I–V graph is not just a shape to memorise. Its curvature tells you whether V/I is changing. For an ohmic resistor under constant conditions the ratio is constant; for a lamp, heating changes the resistance; for a diode, conduction depends strongly on direction and forward bias.','Graph questions can place either I or V on either axis. Read the labels before interpreting a gradient, and use a secant ratio V/I for the resistance at a particular operating point rather than assuming every curve has one constant gradient.'],
    resistivity:['Resistivity allows comparison of materials independent of sample dimensions. The RP5 graph method is powerful because many readings are combined into one gradient rather than relying on one measurement pair.','The diameter measurement often dominates uncertainty because area depends on d². A strong evaluation therefore discusses repeated micrometer readings, temperature control and a wide range of wire lengths rather than simply saying “repeat the experiment”.'],
    rp5:['A high-quality RP5 method separates geometry, electrical measurement and temperature control. Measure diameter independently, choose a range of lengths, measure V and I at each length, calculate R, then obtain resistivity from the gradient of R against L.','Systematic effects include contact resistance and zero errors; random effects include reading scatter. Heating is especially important because it changes the wire resistance while you are trying to investigate length.'],
    circuits:['Series and parallel rules are consequences of conservation. In series, steady current is the same because charge does not accumulate between components. In parallel, currents add at junctions. Potential-difference rules follow from energy transferred per coulomb.','Power equations are interchangeable only when the required assumptions and variables are appropriate. P = VI is the general electrical relationship; for a resistive component V = IR allows P = I²R or P = V²/R.'],
    divider:['A divider equation is best understood as a resistance fraction, not a formula to memorise. With output across the lower resistor, Vout/Vin equals Rlower/(Rupper+Rlower).','Sensor questions depend on two decisions: how the sensor resistance changes, and whether the output is measured across the sensor or the other resistor. State both before predicting the voltage trend.'],
    emf:['A source transfers energy to charge; emf describes the energy supplied per coulomb. Internal resistance means that not all of this energy reaches the external circuit when current flows.','The graph form V = ε − Ir is deliberately linear. A wide range of current values improves the reliability of the fitted gradient, while opening the switch between readings reduces heating and cell discharge.'],
    rp6:['RP6 is both a circuit experiment and a graph-analysis experiment. V and I must be measured simultaneously for several load settings, then the straight-line model is used to separate two source properties.','Interpretation should be explicit: the V-axis intercept estimates ε, while the gradient is negative and has magnitude r. A good evaluation considers meter resolution, heating, cell discharge and the range/distribution of current readings.']
  };

  function css(){if($('#contentDepthV8Style'))return;const s=document.createElement('style');s.id='contentDepthV8Style';s.textContent=`
    .depth-v8{margin-top:16px;border:1px solid rgba(103,199,255,.3);border-radius:16px;background:linear-gradient(145deg,rgba(8,27,44,.97),rgba(5,16,28,.97));padding:15px}.depth-v8 h3{margin:0 0 8px}.depth-v8-intro{font-size:.92rem;line-height:1.65;color:#e2eef7}.depth-v8-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:11px}.depth-v8-card{border:1px solid #29465f;border-radius:12px;background:#071522;padding:11px}.depth-v8-card h4{margin:0 0 6px;color:#eaf7ff}.depth-v8-card p,.depth-v8-card li{font-size:.76rem;line-height:1.55;color:#c7d9e8}.depth-v8-card ol,.depth-v8-card ul{padding-left:1.2rem}.depth-v8-wide{grid-column:1/-1}.depth-v8 .formula-chip{display:inline-block;margin:3px 4px 3px 0}.textbook-depth-v8{margin:18px 0;border:1px solid rgba(99,217,164,.35);border-radius:16px;background:#071522;padding:15px}.textbook-depth-v8 p{line-height:1.68;color:#d5e5f1}.depth-v8-tag{display:inline-flex;border:1px solid #315b7b;border-radius:999px;padding:4px 8px;font-size:.64rem;font-weight:900;color:#cbefff;margin-bottom:7px}.depth-v8-worked{border-left:3px solid #ffd56a}.depth-v8-practical{border-left:3px solid #63d9a4}.depth-v8-exam{border-left:3px solid #9a86ff}@media(max-width:800px){.depth-v8-grid{grid-template-columns:1fr}.depth-v8-wide{grid-column:auto}}
  `;document.head.appendChild(s);}
  function lessonId(){return $('.course-button.active')?.dataset.lesson||null;}
  function lessonBlock(id){const d=lessonDepth[id];if(!d)return'';return `<section class="depth-v8 lesson-depth-v8" data-depth-lesson="${id}"><span class="depth-v8-tag">Deep learning · AQA electricity</span><h3>Build the full physics model</h3><p class="depth-v8-intro">${esc(d.big)}</p><div class="depth-v8-grid">${d.deep.map(([h,p])=>`<article class="depth-v8-card"><h4>${esc(h)}</h4><p>${esc(p)}</p></article>`).join('')}<article class="depth-v8-card depth-v8-wide"><h4>Derive it rather than memorise it</h4><ol>${d.deriv.map(x=>`<li>${esc(x)}</li>`).join('')}</ol></article><article class="depth-v8-card depth-v8-worked"><h4>Additional worked example</h4><p><strong>${esc(d.worked[0])}</strong></p><ol>${d.worked.slice(1).map(x=>`<li>${esc(x)}</li>`).join('')}</ol></article><article class="depth-v8-card depth-v8-practical"><h4>Practical evidence</h4><p>${esc(d.practical)}</p></article><article class="depth-v8-card depth-v8-exam"><h4>Exam reasoning</h4><p>${esc(d.exam)}</p></article><article class="depth-v8-card"><h4>Connection to the wider course</h4><p>${esc(d.links)}</p></article></div></section>`;}
  function decorateLesson(){const id=lessonId(),learn=$('.lesson-stage[data-stage="learn"]');if(!id||!learn||!lessonDepth[id])return;if(learn.querySelector(`.lesson-depth-v8[data-depth-lesson="${id}"]`))return;learn.insertAdjacentHTML('beforeend',lessonBlock(id));}
  function chapterId(){return $('.textbook-chapter-button.active')?.dataset.textbookChapter||null;}
  function decorateTextbook(){const id=chapterId(),article=$('#textbookArticle');if(!id||!article||!chapterDepth[id])return;if(article.querySelector(`.textbook-depth-v8[data-depth-chapter="${id}"]`))return;const nav=article.querySelector('.textbook-nav-row');const html=`<section class="textbook-depth-v8" data-depth-chapter="${id}"><span class="depth-v8-tag">Deeper explanation</span><h3>Connect the equations to the physics</h3><p>${esc(chapterDepth[id][0])}</p><p>${esc(chapterDepth[id][1])}</p></section>`;if(nav)nav.insertAdjacentHTML('beforebegin',html);else article.insertAdjacentHTML('beforeend',html);}
  let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;decorateLesson();decorateTextbook();});}
  function start(){css();schedule();const lp=$('#lessonPanel'),ta=$('#textbookArticle');if(lp)new MutationObserver(schedule).observe(lp,{childList:true,subtree:false});if(ta)new MutationObserver(schedule).observe(ta,{childList:true,subtree:false});document.addEventListener('click',e=>{if(e.target.closest('.course-button,.textbook-chapter-button,[data-open-textbook],[data-textbook-prev],[data-textbook-next]'))setTimeout(schedule,30);});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();
