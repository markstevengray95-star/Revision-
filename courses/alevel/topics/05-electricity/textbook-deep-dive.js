(() => {
  const D=window.ELECTRICITY_TEXTBOOK;if(!D)return;
  const extra={
    basics:{
      summary:"This chapter establishes the energy and charge language used throughout DC electricity. The most important habit is to attach a physical meaning to every equation rather than treating I, V and R as interchangeable circuit numbers.",
      definitions:[
        ["Electric current","Rate of flow of electric charge past a point. 1 A = 1 C s⁻¹."],
        ["Potential difference","Energy transferred from the charges per unit charge between two points. 1 V = 1 J C⁻¹."],
        ["Resistance","Ratio V/I at a specified operating point. For a non-ohmic component this ratio can change as the operating point changes."],
        ["Conventional current","Direction in which positive charge would move. In a metal it is opposite to the drift direction of electrons."]
      ],
      deep:[
        ["Current is a rate, not an amount","The charge Q that passes a point can be very large even when the current is small, provided the current flows for a long time. Conversely, a large current for a very short time can transfer little total charge. This is why Q = It must always be read as charge = rate × time."],
        ["What the source actually does","A cell or power supply transfers energy to charges. The charges already exist throughout the conducting circuit; they are not manufactured at one terminal and destroyed at the other. When the circuit is complete, an electric field is established around the circuit and mobile charge carriers respond to that field."],
        ["Why p.d. is an energy quantity","A p.d. of 12 V means each coulomb transfers 12 J between the two chosen points. If 5 C passes through a component across 12 V, the energy transferred is W = VQ = 60 J. This connects microscopic charge motion to macroscopic heating, light or mechanical work."],
        ["Resistance and microscopic collisions","In a metal, free electrons have random thermal motion as well as a small average drift caused by the electric field. Collisions with the vibrating ion lattice limit the drift. Greater scattering means a smaller current for the same p.d., which is observed as a larger resistance."],
        ["Units as a checking tool","I = Q/t gives A = C s⁻¹. V = W/Q gives V = J C⁻¹. R = V/I gives Ω = V A⁻¹. Writing units alongside substitutions is one of the quickest ways to catch mistakes in A-level calculations."]
      ],
      derivation:{title:"Connecting charge, energy and power",steps:["Start from W = VQ.","Use Q = It.","Substitute: W = VIt.","Divide by time: W/t = VI.","Since power P = W/t, P = VI.","This derivation shows that electrical power is a rate of energy transfer, not a separate unrelated formula."]},
      examples:[
        {q:"A 2.4 A current flows for 35 ms. Find the charge transferred.",steps:["35 ms = 0.035 s","Q = It","Q = 2.4 × 0.035 = 0.084 C"]},
        {q:"A motor transfers 540 J when 45 C passes through it. Find its p.d.",steps:["V = W/Q","V = 540/45","V = 12 V"]},
        {q:"A component carries 0.60 A at 9.0 V. Find its resistance and power.",steps:["R = V/I = 9.0/0.60 = 15 Ω","P = VI = 9.0 × 0.60 = 5.4 W"]}
      ],
      checkpoints:[["What does 1 ampere mean?","One coulomb of charge passes a point each second."],["Why is current not used up by a resistor?","Charge is conserved; the resistor transfers energy from the charges rather than consuming charge."],["What does 6 V mean physically?","6 J of energy is transferred per coulomb."],["Why can R = V/I be used for a lamp even though it is non-ohmic?","It defines resistance at that operating point; the ratio simply is not constant for all operating points."]],
      examPractice:["Explain the difference between current and charge.","A pulse transfers 0.18 C in 3.0 ms. Calculate the average current.","Explain why a resistor can transfer energy without reducing the current in a series circuit."]
    },
    iv:{
      summary:"I–V characteristics are graphical descriptions of component behaviour. A strong answer links the graph shape to the physical state of the component and always checks which variable is on each axis.",
      definitions:[["Ohmic conductor","A conductor for which current is proportional to p.d. when physical conditions are constant."],["I–V characteristic","Graph showing how current varies with p.d. for a component."],["Forward bias","Connection of a diode in the direction that allows significant current above its characteristic turn-on region."],["Ideal voltmeter","Infinite resistance, so no current is diverted through it."],["Ideal ammeter","Zero resistance, so it causes no additional p.d. drop."]],
      deep:[
        ["Graph orientation matters","If I is plotted vertically against V, the gradient of an ohmic line is I/V = 1/R. If V is plotted vertically against I, the gradient is V/I = R. Always inspect the axes before interpreting a gradient."],
        ["Filament lamp curvature","As p.d. increases, current increases and the filament dissipates more power. Its temperature rises, causing stronger lattice vibrations and more frequent electron-lattice collisions. Resistance therefore rises. On an I-against-V graph the curve becomes less steep at larger |V|."],
        ["Diode asymmetry","A semiconductor diode is highly directional. In reverse bias the current is extremely small in the simple model. In forward bias, little current flows until the barrier is sufficiently overcome; current then rises rapidly. The exact turn-on voltage is device dependent, so use supplied data rather than memorising a universal value."],
        ["Measuring an I–V curve","Use an ammeter in series and a voltmeter across the test component. Change the p.d. using a variable resistor or variable supply. For a full characteristic, reverse the component or supply connections to obtain negative values where appropriate."],
        ["Heating as a control variable","For a metal resistor intended to behave ohmically, temperature must remain approximately constant. Using low currents, taking readings quickly or switching off between readings reduces unwanted heating."]
      ],
      derivation:{title:"Resistance from an I–V graph",steps:["Choose a point on the graph and read V and I.","Calculate the operating resistance using R = V/I.","For an ohmic conductor, repeating this at different points gives the same value.","For a lamp or diode, the calculated resistance changes with the operating point.","Do not confuse V/I with the graph gradient unless the axis arrangement makes them equivalent."]},
      examples:[{q:"An ohmic conductor carries 0.25 A at 5.0 V.",steps:["R = V/I","R = 5.0/0.25 = 20 Ω","At 10 V, if temperature stays constant, I = 10/20 = 0.50 A"]},{q:"A lamp carries 0.20 A at 3.0 V and 0.32 A at 6.0 V.",steps:["R₁ = 3.0/0.20 = 15 Ω","R₂ = 6.0/0.32 = 18.75 Ω","The larger resistance at the higher operating point is consistent with a hotter filament."]}],
      checkpoints:[["Why is a filament-lamp graph curved?","Heating raises the filament resistance as current increases."],["Where is an ammeter connected?","In series with the component."],["Where is a voltmeter connected?","In parallel across the component."],["When does graph gradient equal resistance?","When V is on the vertical axis and I is on the horizontal axis."]],
      examPractice:["Explain the shape of a filament lamp I–V characteristic using electron-lattice collisions.","Describe how to obtain both positive and negative parts of a diode characteristic.","A graph plots I vertically against V. Explain how resistance can be obtained for an ohmic conductor."]
    },
    resistivity:{
      summary:"Resistivity separates material behaviour from sample geometry. A-level questions often combine ρ = RA/L with circular cross-sections, temperature effects and percentage uncertainty.",
      definitions:[["Resistivity ρ","Material property defined by ρ = RA/L for a uniform conductor."],["Negative temperature coefficient","Resistance falls as temperature rises, as in an NTC thermistor."],["Critical temperature","Temperature at and below which a superconducting material has zero resistivity."],["Superconductor","Material that exhibits zero resistivity below its critical temperature under the conditions of the model."]],
      deep:[
        ["Geometry and resistance","For the same material and temperature, a longer wire has greater resistance because carriers experience more scattering along a longer path. A larger cross-sectional area gives more available conduction pathways, reducing resistance."],
        ["Why diameter is dangerous","For a circular wire A = πd²/4. Because the diameter is squared, a 2% uncertainty in d contributes about 4% uncertainty to A. This is why careful micrometer measurements at several orientations are important in RP5."],
        ["Metals with increasing temperature","A hotter metal lattice vibrates more strongly. Electron collisions occur more frequently, reducing mean drift for a given field. Resistivity therefore increases. This mechanism is different from an NTC thermistor."],
        ["NTC thermistor behaviour","Increasing temperature increases the number of available mobile charge carriers in the semiconductor, so its resistance decreases strongly. AQA mainly requires the observed negative temperature coefficient and its use in sensing circuits rather than a detailed semiconductor band model."],
        ["Superconductivity applications","Zero resistivity removes ordinary resistive power loss and allows very large persistent currents. This is valuable for strong electromagnets and potentially for low-loss transmission. Real applications also involve the practical difficulty and cost of maintaining sufficiently low temperature."]
      ],
      derivation:{title:"Why R is proportional to L/A",steps:["Start from the definition ρ = RA/L.","Rearrange to R = ρL/A.","For fixed material and temperature, ρ is constant.","Therefore R ∝ L and R ∝ 1/A.","For circular wire, A ∝ d², so R ∝ 1/d²."]},
      examples:[{q:"A wire is replaced by one of the same material and length but twice the diameter.",steps:["Area is proportional to d².","Doubling d makes area four times larger.","R = ρL/A, so resistance becomes one quarter of the original."]},{q:"A wire has ρ = 1.7×10⁻⁸ Ω m, L = 2.0 m and d = 0.50 mm.",steps:["d = 5.0×10⁻⁴ m","A = πd²/4 = 1.96×10⁻⁷ m²","R = ρL/A = 0.173 Ω"]}],
      checkpoints:[["What is the SI unit of resistivity?","Ω m."],["What happens to a metal's resistance when its temperature rises?","It usually increases."],["What happens to an NTC thermistor's resistance when temperature rises?","It decreases."],["Why does diameter uncertainty matter strongly?","Area depends on diameter squared."]],
      examPractice:["Explain microscopically why a metal wire's resistance rises with temperature.","Calculate the resistance change when a wire's diameter is tripled.","Explain why superconductors can reduce transmission losses."]
    },
    rp5:{
      summary:"RP5 is as much about measurement quality as calculation. A strong practical answer identifies how diameter, heating and graph choice affect the final value of resistivity.",
      definitions:[["Independent variable","Length L of test wire in the standard graph method."],["Dependent variable","Resistance R calculated from measured V and I."],["Control variables","Wire material, diameter/cross-section and temperature."],["Best-fit gradient","Gradient estimated from the overall trend rather than adjacent raw points."]],
      deep:[
        ["Apparatus arrangement","Connect the test wire and ammeter in series with the supply and control resistor. Connect the voltmeter across only the chosen test-wire length. A sliding contact or crocodile clip can change the active length."],
        ["Diameter procedure","Check the micrometer zero, measure at several positions, rotate the wire and repeat. Average the readings. A single measurement can be unrepresentative if the wire is slightly non-circular or uneven."],
        ["Collecting data","Choose a broad range of lengths. For each length record V and I, then calculate R = V/I. Repeats help identify random scatter. Avoid excessive current and disconnect between readings to minimise heating."],
        ["Graph analysis","Plot R vertically against L horizontally. From R = (ρ/A)L, gradient = ρ/A. Hence ρ = gradient × A. An intercept significantly different from zero can indicate contact resistance or other systematic effects."],
        ["Uncertainty","Percentage uncertainty in area is approximately twice the percentage uncertainty in diameter. Gradient uncertainty can be estimated from steepest and shallowest acceptable lines where required. Combine uncertainty contributions using the approach expected in the practical context."]
      ],
      derivation:{title:"Extracting ρ from the graph",steps:["R = ρL/A","Compare with y = mx + c.","y corresponds to R and x to L.","Gradient m = ρ/A.","Therefore ρ = mA.","Calculate A from the mean diameter in metres before multiplying."]},
      examples:[{q:"Gradient = 3.8 Ω m⁻¹; d = 0.32 mm.",steps:["d = 3.2×10⁻⁴ m","A = πd²/4 = 8.04×10⁻⁸ m²","ρ = gradient × A = 3.06×10⁻⁷ Ω m"]}],
      checkpoints:[["Why switch off between readings?","To reduce heating and keep resistivity more nearly constant."],["Why measure diameter in several places?","To reduce random uncertainty and account for non-uniformity."],["What does the R–L gradient represent?","ρ/A."],["What could a non-zero intercept suggest?","Contact/lead resistance or another systematic offset."]],
      examPractice:["Write a complete method for determining resistivity including how you would reduce heating.","Explain why plotting R against L is preferable to one calculation of ρ.","State how uncertainty in diameter affects uncertainty in cross-sectional area."]
    },
    circuits:{
      summary:"Circuit problems become much easier when treated as conservation problems. Charge conservation controls current at junctions; energy conservation controls p.d. around loops.",
      definitions:[["Series","Components lie on the same current path with no branching between them."],["Parallel","Components are connected between the same pair of nodes and therefore share the same p.d."],["Kirchhoff current rule","Total current entering a junction equals total current leaving it."],["Loop energy rule","Sum of potential rises and drops around a closed loop is zero, expressing energy conservation per unit charge."]],
      deep:[
        ["Series resistance","The same current I flows through each resistor. Total p.d. V = V₁ + V₂ = IR₁ + IR₂ = I(R₁+R₂). Therefore Rtotal = R₁ + R₂. Adding a series resistor increases total resistance."],
        ["Parallel resistance","Each branch has the same p.d. V. Total current I = I₁ + I₂ = V/R₁ + V/R₂. Divide by V to obtain 1/Rtotal = 1/R₁ + 1/R₂. Adding a parallel path always lowers total resistance."],
        ["Power choice","P = VI is general. P = I²R is useful when current is known and is especially helpful for heating. P = V²/R is useful when components share the same p.d., such as parallel branches."],
        ["Cells in series and parallel","Series cells in the same orientation add emfs. Identical cells in parallel retain the same emf but can share current. Once internal resistance is considered, the effective source behaviour depends on the arrangement."],
        ["Sanity checks","Series Rtotal must exceed every individual series resistance. Parallel Rtotal must be smaller than the smallest branch resistance. Branch currents must sum to total current. Component p.d.s in a simple series loop must sum to the supply p.d."]
      ],
      derivation:{title:"Two resistors in parallel",steps:["Same p.d. V across both branches.","I₁ = V/R₁ and I₂ = V/R₂.","I = I₁ + I₂.","V/Rtotal = V/R₁ + V/R₂.","Cancel V: 1/Rtotal = 1/R₁ + 1/R₂.","For two resistors, Rtotal = R₁R₂/(R₁+R₂)."]},
      examples:[{q:"4 Ω and 12 Ω are in parallel across 6 V.",steps:["Rtotal = (4×12)/(4+12) = 3 Ω","Itotal = 6/3 = 2 A","I₁ = 6/4 = 1.5 A","I₂ = 6/12 = 0.5 A","Check: 1.5 + 0.5 = 2.0 A"]},{q:"A 24 V heater draws 3.0 A for 5 min.",steps:["P = VI = 72 W","t = 300 s","E = Pt = 72×300 = 2.16×10⁴ J"]}],
      checkpoints:[["What is conserved at a junction?","Charge, giving current in = current out."],["What is the same across parallel branches?","Potential difference."],["What is the same through series components?","Current."],["Why is parallel Rtotal always small?","Adding a branch gives an additional path for charge flow, increasing total conductance."]],
      examPractice:["Derive the equation for two resistors in parallel from current conservation.","Explain why a parallel combination has lower resistance than either branch.","Compare the power in two parallel resistors of different resistance connected to the same supply."]
    },
    divider:{
      summary:"Potential dividers convert resistance ratios into output voltages. Sensor questions are solved reliably by identifying which resistance Vout is across and then tracking how that resistance changes.",
      definitions:[["Potential divider","Two or more series resistances used to provide a fraction of an input p.d."],["Output voltage","Potential difference measured across a chosen part of the divider."],["LDR","Light-dependent resistor whose resistance falls as light intensity increases."],["NTC thermistor","Thermistor whose resistance falls as temperature increases."]],
      deep:[
        ["Deriving the divider equation","The series current is I = Vin/(R₁+R₂). If Vout is across R₂, Vout = IR₂ = VinR₂/(R₁+R₂). The resistor across which the output is measured belongs in the numerator."],
        ["Sensor direction reasoning","Do not memorise 'temperature up means voltage up'. First state how the sensor resistance changes. Then identify whether Vout is measured across the sensor or the other resistor. Use the resistance fraction to determine the output change."],
        ["Choosing component values","Maximum sensitivity often occurs when the fixed resistance is of a similar order to the sensor resistance in the operating region. If one resistance is overwhelmingly larger, the output approaches one extreme and becomes less responsive to small changes."],
        ["Loaded dividers","The simple divider equation assumes the output is not significantly loaded. A measuring device with very high resistance draws negligible current, so the divider ratio is almost unchanged. A low-resistance load effectively sits in parallel with part of the divider and changes the output."],
        ["Design questions","Start with the required condition, such as 'output increases with temperature'. Choose the sensor position accordingly, then calculate component values if a threshold voltage is specified."]
      ],
      derivation:{title:"Potential divider equation",steps:["Series current I = Vin/(R₁+R₂).","Output across R₂: Vout = IR₂.","Substitute I.","Vout = VinR₂/(R₁+R₂).","So Vout/Vin = R₂/(R₁+R₂)."]},
      examples:[{q:"Vin = 12 V, R₁ = 3.0 kΩ, R₂ = 1.0 kΩ; output across R₂.",steps:["Vout = 12×1/(3+1)","Vout = 3.0 V"]},{q:"An NTC is the lower resistor and Vout is measured across it.",steps:["Temperature rises.","NTC resistance falls.","Its fraction RNTC/(Rfixed+RNTC) falls.","Therefore Vout falls."]}],
      checkpoints:[["Which resistor goes in the numerator?","The resistor across which Vout is measured."],["What happens to LDR resistance in brighter light?","It decreases."],["What happens to NTC resistance as temperature rises?","It decreases."],["Why should a voltmeter have high resistance?","So it draws negligible current and does not significantly load the divider."]],
      examPractice:["Design a divider whose output rises when temperature rises and explain the component placement.","Calculate an unknown resistor needed to obtain a specified output voltage.","Explain how a low-resistance load changes the simple divider output."]
    },
    emf:{
      summary:"Emf and terminal p.d. are both measured in volts but refer to different energy transfers. Internal resistance explains why a real source's terminal voltage falls as it supplies more current.",
      definitions:[["Emf ε","Energy supplied by the source per unit charge."],["Terminal p.d. V","Energy transferred per unit charge in the external circuit between the source terminals."],["Internal resistance r","Effective resistance inside the source that causes an internal energy transfer when current flows."],["Lost volts","Internal p.d. Ir, equal to ε − V for a discharging source in the simple model."]],
      deep:[
        ["Energy bookkeeping","Each coulomb gains ε joules inside the source. Of this, V joules per coulomb are delivered to the external circuit and Ir joules per coulomb are transferred internally. Therefore ε = V + Ir."],
        ["Open-circuit condition","When no current is drawn, I = 0 and the internal drop Ir is zero, so terminal p.d. equals emf in the idealised model. This is why measuring a cell with a high-resistance voltmeter approximates its emf."],
        ["Increasing load current","Reducing external resistance increases current. The internal loss Ir increases, so terminal p.d. decreases. This is a common interpretation question and should be described using energy per charge, not by saying the cell 'runs out of voltage'."],
        ["Complete-circuit current","For load R in series with internal r, ε = IR + Ir = I(R+r), giving I = ε/(R+r). This treats the internal resistance exactly like a series resistance for circuit calculations."],
        ["Power inside the source","Internal power loss is I²r. External load power is I²R. These relationships help explain why a source may warm when supplying a large current."]
      ],
      derivation:{title:"Terminal p.d. equation",steps:["Energy supplied per coulomb = ε.","Energy transferred externally per coulomb = V.","Energy transferred internally per coulomb = Ir.","Conservation of energy gives ε = V + Ir.","Rearrange: V = ε − Ir."]},
      examples:[{q:"ε = 9.0 V, r = 1.0 Ω, R = 8.0 Ω.",steps:["I = ε/(R+r) = 9/(8+1) = 1.0 A","lost volts = Ir = 1.0 V","terminal V = 8.0 V","Check: V = IR = 1×8 = 8.0 V"]},{q:"A source gives 5.8 V at 0.20 A and 5.2 V at 0.80 A. Estimate r.",steps:["ΔV = −0.6 V","ΔI = 0.60 A","gradient ΔV/ΔI = −1.0 V A⁻¹","r = magnitude = 1.0 Ω"]}],
      checkpoints:[["Why is emf not a force?","It is energy supplied per unit charge, measured in volts."],["When does terminal p.d. equal emf?","When current is zero in the simple model."],["What are lost volts?","The internal p.d. Ir."],["Why does terminal p.d. fall as current rises?","The internal p.d. Ir increases."]],
      examPractice:["Explain the difference between emf and terminal p.d. in terms of energy per unit charge.","Calculate current and terminal p.d. for a source with given ε, r and load R.","Explain why a cell can become warm when supplying a large current."]
    },
    rp6:{
      summary:"RP6 converts the source equation V = ε − Ir into a straight-line experiment. The quality of the answer depends on both correct graph interpretation and practical control of cell heating/discharge.",
      definitions:[["Graph intercept","At I = 0, V = ε, so the V-axis intercept estimates emf."],["Graph gradient","ΔV/ΔI = −r, so the magnitude of the gradient estimates internal resistance."],["Load resistance","External resistance varied to change current drawn from the source."],["Open switch","Used between readings to reduce discharge and heating."]],
      deep:[
        ["Circuit arrangement","Place the cell, switch, ammeter and variable resistor/load in series. Connect the voltmeter directly across the cell terminals. Changing the load changes current and therefore the internal voltage drop."],
        ["Data strategy","Use a safe but wide current range so the gradient is well defined. Very small range gives poor percentage precision in the gradient; very large current can heat or discharge the cell and change the quantities being measured."],
        ["Straight-line model","V = ε − Ir matches y = c + mx with y = V, x = I, c = ε and m = −r. This is one of the clearest examples of linearisation in the A-level practical course."],
        ["Anomalies and curvature","Random scatter may justify repeats. Systematic curvature may suggest that r or ε is changing during the experiment, for example because the source warms or discharges."],
        ["Uncertainty from a graph","Use a best-fit line for central values. Where required, steepest and shallowest acceptable lines give a gradient range, from which uncertainty in r can be estimated."]
      ],
      derivation:{title:"Why the graph gives ε and r",steps:["Start with ε = V + Ir.","Rearrange: V = ε − Ir.","Compare with y = c + mx.","V is y and I is x.","Intercept c = ε.","Gradient m = −r, so r is the positive magnitude of the gradient."]},
      examples:[{q:"Best-fit line: V = 1.62 − 0.48I.",steps:["Compare with V = ε − Ir","ε = 1.62 V","r = 0.48 Ω"]}],
      checkpoints:[["What goes on the vertical axis?","Terminal p.d. V."],["What goes on the horizontal axis?","Current I."],["What is the intercept?","Emf ε."],["Why is r positive even though the gradient is negative?","The gradient equals −r, so r is its magnitude."]],
      examPractice:["Describe the full method for determining ε and r from V–I data.","Explain why the switch should be opened between readings.","State what a curved V–I plot could indicate about the assumptions of the model."]
    }
  };

  function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
  function findChapter(){const title=document.querySelector("#textbookArticle .textbook-title h2")?.textContent;return D.chapters.find(c=>c.title===title);}
  function render(){const article=document.getElementById("textbookArticle");if(!article||article.querySelector("[data-deep-textbook]"))return;const c=findChapter();const x=c&&extra[c.id];if(!x)return;const nav=article.querySelector(".textbook-nav-row");const wrap=document.createElement("div");wrap.dataset.deepTextbook="1";wrap.className="deep-textbook";wrap.innerHTML=`
    <section class="deep-summary"><span class="eyebrow">Deep-dive overview</span><p>${esc(x.summary)}</p></section>
    <section class="deep-block"><h3>Essential definitions</h3><div class="deep-definition-grid">${x.definitions.map(d=>`<article><strong>${esc(d[0])}</strong><p>${esc(d[1])}</p></article>`).join("")}</div></section>
    <section class="deep-block"><h3>Detailed teaching notes</h3><div class="deep-notes">${x.deep.map((d,i)=>`<article><span class="deep-index">${i+1}</span><div><h4>${esc(d[0])}</h4><p>${esc(d[1])}</p></div></article>`).join("")}</div></section>
    <section class="deep-block deep-derivation"><h3>${esc(x.derivation.title)}</h3><ol>${x.derivation.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></section>
    <section class="deep-block"><h3>Additional worked examples</h3><div class="deep-examples">${x.examples.map((e,i)=>`<article><span class="eyebrow">Example ${i+1}</span><p><strong>${esc(e.q)}</strong></p><ol>${e.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></article>`).join("")}</div></section>
    <section class="deep-block"><h3>Knowledge checkpoints</h3><div class="deep-checkpoints">${x.checkpoints.map((q,i)=>`<details><summary>${i+1}. ${esc(q[0])}</summary><p>${esc(q[1])}</p></details>`).join("")}</div></section>
    <section class="deep-block deep-practice"><h3>Original AQA-style practice prompts</h3><ol>${x.examPractice.map(q=>`<li>${esc(q)}</li>`).join("")}</ol><p class="deep-note">These are original practice prompts written in AQA-style language; they are not copied past-paper questions.</p></section>`;
    if(nav)article.insertBefore(wrap,nav);else article.appendChild(wrap);
  }
  const obs=new MutationObserver(()=>queueMicrotask(render));
  const start=()=>{const a=document.getElementById("textbookArticle");if(a){obs.observe(a,{childList:true,subtree:false});render();}};
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start);else start();
})();