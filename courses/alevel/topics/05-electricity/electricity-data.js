window.ELECTRICITY_DATA = {
  lessons: [
    {
      id:"current-charge", code:"3.5.1.1", title:"Charge, current and the rate of flow of charge", sim:"charge",
      lead:"Build the microscopic and mathematical meaning of electric current.",
      keywords:["charge","coulomb","current","ampere","electron","conventional current"],
      formulas:["I = ΔQ/Δt","Q = It"],
      objectives:["Define current as rate of flow of charge.","Use I = ΔQ/Δt in calculations.","Distinguish electron flow from conventional current."],
      retrieval:[["What is the SI unit of charge?","coulomb, C"],["What charge does an electron carry?","−1.60 × 10⁻¹⁹ C"],["What does 1 A mean?","1 C of charge passing a point each second."]],
      teach:[
        ["Current is a rate","Current tells us how quickly charge passes a point in a circuit. I = ΔQ/Δt. A current of 3.0 A means 3.0 C passes a chosen cross-section every second."],
        ["What actually moves","In a metal, mobile electrons drift through the lattice. The conventional current direction is defined as the direction positive charge would move, so it is opposite to electron drift."],
        ["Steady current","If current is constant, Q = It. If current changes, the equation still describes an average over the chosen time interval."],
        ["Exam language","Use 'rate of flow of charge' rather than saying current is simply 'the flow of electrons'. That definition works in metallic wires but is not general enough for all current carriers."]
      ],
      worked:{q:"A current of 0.75 A flows for 4.0 min. Calculate the charge transferred.",steps:["Convert time: 4.0 min = 240 s","Q = It","Q = 0.75 × 240 = 180 C"]},
      activity:"Calculate the charge transferred by currents of 25 mA for 80 s and 1.2 A for 3.5 min. State the conventional current direction if electrons drift to the left.",
      mission:{goal:"Link current to charge transferred per second.",steps:["Set the current to 0.50 A.","Run the model for 4 s.","Double the current and compare the charge transferred in the same time."],conclusion:"Explain why doubling I doubles Q for a fixed time."},
      check:["A current of 2.0 A flows for 6.0 s. What charge passes?",["0.33 C","3.0 C","8.0 C","12 C"],3,"Q = It = 2.0 × 6.0 = 12 C."],
      examTip:"Always convert minutes and milliseconds to seconds before using Q = It.",
      misconception:"Current is not 'used up' as charge moves around a steady series circuit.",
      exit:"Write a precise one-sentence definition of electric current."
    },
    {
      id:"pd-resistance", code:"3.5.1.1", title:"Potential difference, energy transfer and resistance", sim:"charge",
      lead:"Connect electrical energy per charge to p.d. and current response to resistance.",
      keywords:["potential difference","work done","energy transfer","resistance","volt","ohm"],
      formulas:["V = W/Q","W = VQ","R = V/I"],
      objectives:["Define p.d. as work done per unit charge.","Calculate energy transferred by a charge.","Use R = V/I correctly."],
      retrieval:[["What is 1 volt in base energy terms?","1 J C⁻¹"],["Unit of resistance?","ohm, Ω"],["Which meter measures p.d.?","voltmeter, connected in parallel."]],
      teach:[
        ["Potential difference","Potential difference is the work done, or energy transferred, per unit charge between two points: V = W/Q. A 6.0 V supply transfers 6.0 J per coulomb through the external circuit."],
        ["Resistance","Resistance at an operating point is defined by R = V/I. It describes how large a p.d. is required to drive a given current."],
        ["Meters","Unless a question states otherwise, AQA treats ammeters as ideal with zero resistance and voltmeters as ideal with infinite resistance."],
        ["Cause and response","Do not describe p.d. as something that 'flows'. Charge flows; p.d. is an energy-per-charge difference between points."]
      ],
      worked:{q:"12 J of energy is transferred when 2.5 C passes through a component. Find the p.d.",steps:["V = W/Q","V = 12/2.5 = 4.8 V"]},
      activity:"A resistor carries 0.32 A when 4.0 V is across it. Find R. Then calculate the energy transferred when 18 C passes through it.",
      mission:{goal:"Relate energy-per-charge and current.",steps:["Choose a p.d.","Observe the energy transferred for each coulomb.","Change resistance and compare the current."],conclusion:"Separate what V tells you from what R tells you."},
      check:["A p.d. of 5.0 V means…",["5 C pass each second","5 J are transferred per coulomb","5 Ω of resistance","5 electrons pass"],1,"1 V = 1 J C⁻¹."],
      examTip:"For definition questions, use 'work done per unit charge' or 'energy transferred per unit charge'.",
      misconception:"Resistance is not energy lost; it is V/I at the operating point.",
      exit:"Explain the physical meaning of a p.d. of 9.0 V."
    },
    {
      id:"iv-ohmic", code:"3.5.1.2", title:"Ohm's law and the I–V characteristic of an ohmic conductor", sim:"iv",
      lead:"Understand when resistance is constant and how that appears on a graph.",
      keywords:["ohmic conductor","Ohm's law","I–V characteristic","gradient","constant physical conditions"],
      formulas:["R = V/I","I ∝ V at constant physical conditions"],
      objectives:["State Ohm's law precisely.","Interpret linear I–V data.","Handle either axis orientation."],
      retrieval:[["What is resistance defined as?","R = V/I."],["What does proportional mean on a graph?","A straight line through the origin."],["What condition matters for Ohm's law?","Physical conditions, especially temperature, must remain constant."]],
      teach:[
        ["Ohm's law","An ohmic conductor obeys I ∝ V provided physical conditions remain constant. Its resistance therefore stays constant."],
        ["Graph orientation","AQA may put I or V on the horizontal axis. If V is vertical and I horizontal, gradient = R. If I is vertical and V horizontal, gradient = 1/R."],
        ["Heating","A nominal resistor can stop behaving perfectly ohmically if its temperature rises significantly because its resistance changes."],
        ["Ideal meters","An ideal ammeter does not alter the circuit current; an ideal voltmeter takes no current from the circuit."]
      ],
      worked:{q:"A straight I–V graph passes through V = 6.0 V, I = 0.40 A. Find the resistance.",steps:["R = V/I","R = 6.0/0.40 = 15 Ω"]},
      activity:"Sketch both V-against-I and I-against-V graphs for a 20 Ω resistor and label the meaning of each gradient.",
      mission:{goal:"Test proportionality for an ohmic conductor.",steps:["Select 'Ohmic resistor'.","Record I for 2 V, 4 V and 6 V.","Compare V/I."],conclusion:"Explain how constant V/I supports Ohm's law."},
      check:["On a graph of V on the vertical axis against I on the horizontal axis, the gradient is…",["I/V","R","1/R","power"],1,"V = IR, so gradient ΔV/ΔI = R."],
      examTip:"Always inspect which quantity is on each axis before using a graph gradient.",
      misconception:"Ohm's law is not simply V = IR; it is the proportionality I ∝ V under constant physical conditions.",
      exit:"How would an increase in resistor temperature affect an otherwise straight I–V graph?"
    },
    {
      id:"iv-nonohmic", code:"3.5.1.2", title:"Filament lamps and semiconductor diodes", sim:"iv",
      lead:"Use changing gradient to explain non-ohmic behaviour.",
      keywords:["filament lamp","semiconductor diode","forward bias","reverse bias","dynamic resistance"],
      formulas:["R = V/I at an operating point"],
      objectives:["Recognise lamp and diode characteristics.","Explain the filament-lamp curve using temperature.","Describe diode directionality."],
      retrieval:[["What makes a conductor ohmic?","I proportional to V at constant physical conditions."],["What happens to metal resistance when temperature rises?","It increases."],["What is reverse bias?","A diode polarity that strongly suppresses current."]],
      teach:[
        ["Filament lamp","As current increases, the filament heats. Increased lattice vibration causes more electron scattering, so resistance rises and the I–V curve becomes less steep when I is plotted vertically."],
        ["Diode","A semiconductor diode conducts strongly in the forward direction once the applied p.d. is sufficient, but carries negligible reverse current in the normal operating range."],
        ["Operating-point resistance","For a non-ohmic component, R = V/I still defines resistance at a chosen operating point even though the ratio is not constant across the graph."],
        ["Graph reading","Do not confuse the gradient of a curved I–V graph with the simple ratio V/I unless the question explicitly asks for differential resistance."]
      ],
      worked:{q:"At one operating point a lamp has V = 9.0 V and I = 0.60 A. Find its resistance at that point.",steps:["R = V/I","R = 9.0/0.60 = 15 Ω"]},
      activity:"For each component—fixed resistor, filament lamp, diode—sketch an I–V graph and annotate the physical reason for its shape.",
      mission:{goal:"Compare three component characteristics.",steps:["Cycle through resistor, lamp and diode.","Apply both positive and negative p.d.","Compare symmetry, slope and operating resistance."],conclusion:"Explain which component is direction-dependent and which is strongly temperature-dependent."},
      check:["Why does a filament lamp's resistance rise at larger current?",["The wire gets shorter","The filament cools","Lattice vibration increases","Charge disappears"],2,"Heating increases lattice vibration and electron scattering."],
      examTip:"For a lamp explanation, explicitly link greater current → higher temperature → greater resistance.",
      misconception:"A diode does not have zero resistance in forward bias.",
      exit:"Describe two differences between a resistor I–V curve and a diode I–V curve."
    },
    {
      id:"resistivity", code:"3.5.1.3", title:"Resistivity and the geometry of a wire", sim:"resistivity",
      lead:"Separate a material property from the resistance of a particular sample.",
      keywords:["resistivity","cross-sectional area","length","micrometer","material property"],
      formulas:["ρ = RA/L","R = ρL/A","A = πd²/4"],
      objectives:["Use ρ = RA/L.","Explain the effects of L and A on R.","Plan the core measurements for Required Practical 5."],
      retrieval:[["Unit of resistivity?","Ω m"],["Area of a circular wire from diameter d?","A = πd²/4"],["What instrument measures small wire diameter accurately?","micrometer."]],
      teach:[
        ["Resistance versus resistivity","Resistance depends on material and dimensions. Resistivity ρ is a material property at a stated temperature."],
        ["Geometry","R = ρL/A. A longer wire has more opportunities for carrier scattering, so R increases with L. A larger cross-sectional area provides more parallel conducting paths, so R decreases as A increases."],
        ["Wire area","For diameter d, A = πd²/4. Because d is squared, percentage uncertainty in area is approximately twice the percentage uncertainty in d."],
        ["Practical link","For RP5, measure wire diameter at several positions and orientations, determine resistance from V/I, and combine R, A and L to obtain ρ. Keep temperature as constant as possible."]
      ],
      worked:{q:"A wire has R = 2.4 Ω, L = 0.80 m and diameter 0.40 mm. Find ρ.",steps:["d = 0.40 mm = 4.0 × 10⁻⁴ m","A = πd²/4 = 1.26 × 10⁻⁷ m²","ρ = RA/L = (2.4 × 1.26 × 10⁻⁷)/0.80 = 3.77 × 10⁻⁷ Ω m"]},
      activity:"Predict the new resistance if length doubles, diameter doubles, or both double. Check each prediction in the model.",
      mission:{goal:"Discover how strongly diameter affects resistance.",steps:["Fix material and temperature.","Double wire length and record R.","Return length, then double diameter and record R."],conclusion:"Explain why doubling diameter reduces resistance by a factor of four."},
      check:["If wire diameter doubles with everything else unchanged, resistance becomes…",["2R","R/2","R/4","4R"],2,"Area is proportional to d², and R is inversely proportional to area."],
      examTip:"Convert mm to m before squaring the diameter.",
      misconception:"Resistivity is not the same as resistance and does not depend on the sample's length or area.",
      exit:"Why is measuring diameter carefully especially important in a resistivity experiment?"
    },
    {
      id:"temperature", code:"3.5.1.3", title:"Temperature, thermistors and superconductivity", sim:"resistivity",
      lead:"Explain why resistance changes with temperature and how this is used.",
      keywords:["metal conductor","NTC thermistor","superconductivity","critical temperature","temperature sensor"],
      formulas:["R = ρL/A"],
      objectives:["Describe the temperature effect for metals and NTC thermistors.","Explain a thermistor sensor qualitatively.","Define superconductivity and state applications."],
      retrieval:[["Metal resistance usually does what as temperature rises?","It increases."],["What does NTC mean?","negative temperature coefficient."],["What is zero resistivity?","No electrical energy is dissipated by resistance in the superconducting state."]],
      teach:[
        ["Metals","As a metal gets hotter, lattice ions vibrate more strongly. Conduction electrons are scattered more frequently, so resistivity and resistance increase."],
        ["NTC thermistors","For an NTC thermistor, resistance decreases as temperature increases. This strong temperature dependence allows it to act as a temperature sensor, often inside a potential divider."],
        ["Superconductivity","Certain materials have zero resistivity at and below a critical temperature characteristic of the material. AQA does not require critical-field calculations."],
        ["Applications","Superconductors can support very large currents for strong electromagnets and can reduce resistive energy losses in power transmission where practical cooling is available."]
      ],
      worked:{q:"A metal wire's resistance rises from 4.0 Ω to 4.8 Ω after heating. Calculate the percentage increase.",steps:["Increase = 0.8 Ω","percentage increase = 0.8/4.0 × 100 = 20%"]},
      activity:"Sketch R–T graphs for a metal and an NTC thermistor. Add arrows showing the direction of change as temperature rises.",
      mission:{goal:"Compare metallic and NTC temperature behaviour.",steps:["Switch between metal and NTC modes.","Raise temperature steadily.","Observe the change in R."],conclusion:"State the opposite temperature trends and link each to a useful application."},
      check:["For an NTC thermistor, increasing temperature normally makes resistance…",["increase","decrease","remain exactly constant","become infinite"],1,"NTC means negative temperature coefficient."],
      examTip:"Do not say all resistors increase resistance with temperature; thermistors in this specification are NTC.",
      misconception:"Superconductivity means zero resistivity, not merely 'very low resistance'.",
      exit:"Give one use of a superconductor and explain why zero resistivity is helpful."
    },
    {
      id:"series", code:"3.5.1.4", title:"Series circuits, cells and conservation laws", sim:"circuits",
      lead:"Use conservation of charge and energy to derive series rules.",
      keywords:["series","Kirchhoff","conservation of charge","conservation of energy","cells in series"],
      formulas:["Rₜ = R₁ + R₂ + …","Vₛ = V₁ + V₂ + …","I is common in series"],
      objectives:["Calculate total series resistance.","Explain why current is common in series.","Use p.d. sharing and cells in series."],
      retrieval:[["What is conserved at a junction?","charge, so total current in equals total current out."],["What is conserved around a circuit loop?","energy per charge, represented by p.d./emf."],["How do ideal cell emfs combine in series when aligned?","They add."]],
      teach:[
        ["Same current","In a single series path, charge cannot accumulate at a component in steady state, so the current is the same through each component."],
        ["Potential differences","Energy transferred per coulomb across the components adds to the energy supplied per coulomb by the source. Therefore the p.d.s around a loop add to the supply emf/terminal p.d."],
        ["Resistance rule","With V = IR for each resistor and common I, Vtotal = I(R₁ + R₂ + …), giving Rₜ = R₁ + R₂ + …"],
        ["Cells in series","Aligned cells in series add their emfs. Internal resistances also add if they are included."]
      ],
      worked:{q:"Two resistors 12 Ω and 18 Ω are in series across 9.0 V. Find current and each p.d.",steps:["Rₜ = 12 + 18 = 30 Ω","I = 9.0/30 = 0.300 A","V₁ = 0.300 × 12 = 3.6 V","V₂ = 0.300 × 18 = 5.4 V"]},
      activity:"Design a 40 Ω series combination using three resistors and calculate the p.d. across each for a 12 V supply.",
      mission:{goal:"Verify voltage sharing in a series circuit.",steps:["Choose two different resistances.","Record the common current.","Add the two resistor p.d.s and compare with the supply."],conclusion:"Use conservation of energy to explain the result."},
      check:["Two resistors of 4 Ω and 6 Ω in series have total resistance…",["2.4 Ω","5 Ω","10 Ω","24 Ω"],2,"Series resistances add."],
      examTip:"For series circuits, write the total resistance first, then calculate the single current.",
      misconception:"Current is not split between components in a simple series loop.",
      exit:"Why does the larger resistor in series receive the larger p.d.?"
    },
    {
      id:"parallel-power", code:"3.5.1.4", title:"Parallel circuits, electrical power and energy", sim:"circuits",
      lead:"Combine junction rules with energy and power equations.",
      keywords:["parallel","branch current","power","electrical energy","identical cells in parallel"],
      formulas:["1/Rₜ = 1/R₁ + 1/R₂ + …","P = IV","P = I²R","P = V²/R","E = IVt"],
      objectives:["Calculate equivalent parallel resistance.","Apply current and p.d. rules.","Use electrical power and energy equations."],
      retrieval:[["What is common to parallel branches?","p.d."],["What happens to current at a junction?","Total current equals the sum of branch currents."],["Unit of power?","watt, W = J s⁻¹."]],
      teach:[
        ["Parallel rule","Each branch has the same p.d. Combining Itotal = I₁ + I₂ + … with I = V/R gives 1/Rₜ = 1/R₁ + 1/R₂ + …"],
        ["Sanity check","The total resistance of parallel resistors is always less than the smallest individual branch resistance."],
        ["Power","P = IV. Using V = IR gives P = I²R and P = V²/R. Choose the form that matches the quantities known."],
        ["Energy","Electrical energy transferred in time t is E = Pt = IVt. Identical cells in parallel have the same emf as one cell but can share the load current; for ideal identical cells their effective internal resistance is reduced."]
      ],
      worked:{q:"6 Ω and 3 Ω are in parallel across 12 V. Find total current and total power.",steps:["1/Rₜ = 1/6 + 1/3 = 1/2, so Rₜ = 2 Ω","Itotal = V/Rₜ = 12/2 = 6 A","P = IV = 6 × 12 = 72 W"]},
      activity:"Compare the total power dissipated by two 10 Ω resistors connected first in series and then in parallel to the same 6 V supply.",
      mission:{goal:"See current splitting and total resistance fall.",steps:["Select parallel mode.","Use unequal branch resistances.","Compare each branch current with total current."],conclusion:"Explain why the lower-resistance branch takes the larger current."},
      check:["Two identical 8 Ω resistors in parallel have equivalent resistance…",["16 Ω","8 Ω","4 Ω","2 Ω"],2,"Two equal resistors in parallel give R/2."],
      examTip:"After a parallel calculation, check Rₜ is smaller than the smallest branch resistance.",
      misconception:"Adding another parallel branch does not increase the total resistance.",
      exit:"Why does a 4 Ω branch carry more current than an 8 Ω branch when they are in parallel?"
    },
    {
      id:"potential-divider", code:"3.5.1.5", title:"Potential dividers, variable resistors and sensors", sim:"divider",
      lead:"Control an output p.d. by sharing a supply between resistances.",
      keywords:["potential divider","output p.d.","variable resistor","thermistor","LDR","sensor"],
      formulas:["Vout = Vin × R₂/(R₁ + R₂)"],
      objectives:["Calculate a potential-divider output.","Predict how changing a sensor resistance changes Vout.","Design simple sensing arrangements."],
      retrieval:[["What is common in two series resistors?","current."],["How is p.d. shared in series?","In proportion to resistance for ohmic resistors."],["What happens to NTC thermistor resistance when temperature rises?","It falls."]],
      teach:[
        ["Core idea","Two series resistors share the supply p.d. If the output is measured across R₂, Vout = Vin R₂/(R₁ + R₂)."],
        ["Variable output","Replacing one resistor with a variable resistor allows continuous adjustment of Vout from a fraction of the supply toward the full supply depending on the arrangement."],
        ["Thermistor sensor","If an NTC thermistor is the lower resistor R₂, rising temperature lowers R₂ and usually lowers Vout. If it is the upper resistor, the output trend reverses."],
        ["LDR sensor","An LDR's resistance decreases as light intensity increases. Its location in the divider determines whether Vout rises or falls in brighter light."]
      ],
      worked:{q:"A 12 V supply feeds 3.0 kΩ above 1.0 kΩ. Vout is across the 1.0 kΩ resistor. Find Vout.",steps:["Vout = Vin × R₂/(R₁ + R₂)","Vout = 12 × 1.0/(3.0 + 1.0) = 3.0 V"]},
      activity:"Choose resistor values to produce about 2.0 V from a 9.0 V supply. Then explain how you would adapt the divider to make a temperature-sensitive output.",
      mission:{goal:"Build intuition for sensor placement.",steps:["Set R₁ = R₂ and note Vout.","Increase only R₂.","Switch R₂ to NTC mode and raise temperature."],conclusion:"Explain why Vout changes in each case."},
      check:["With equal series resistors and the output across one resistor, Vout is…",["0","Vin/2","Vin","2Vin"],1,"Equal resistances share the supply p.d. equally."],
      examTip:"Mark clearly which component Vout is measured across before substituting into a divider equation.",
      misconception:"A potential divider does not create extra energy; it redistributes the supply p.d. between series components.",
      exit:"How could the same thermistor produce an output that rises rather than falls as temperature increases?"
    },
    {
      id:"emf-internal", code:"3.5.1.6", title:"EMF, terminal p.d. and internal resistance", sim:"internal",
      lead:"Model a real source as an ideal emf plus internal resistance.",
      keywords:["emf","terminal p.d.","internal resistance","lost volts","short-circuit current"],
      formulas:["ε = I(R + r)","V = ε − Ir","ε = V + Ir"],
      objectives:["Distinguish emf from terminal p.d.","Calculate lost volts and current.","Interpret the V–I graph used in Required Practical 6."],
      retrieval:[["What does emf measure?","Energy supplied per unit charge by a source."],["What causes lost volts?","Energy transferred per charge inside the source due to internal resistance."],["What happens to terminal p.d. as current rises?","It falls if internal resistance is non-zero."]],
      teach:[
        ["EMF","Electromotive force ε is the energy supplied per unit charge by the source. Despite its name it is not a force; its unit is the volt."],
        ["Internal resistance","A real cell has internal resistance r. When current I flows, a p.d. Ir appears across that internal resistance. The terminal p.d. is V = ε − Ir."],
        ["External load","For external resistance R, ε = I(R + r). Decreasing R increases current, which increases lost volts and usually reduces terminal p.d."],
        ["RP6 graph","Plot terminal p.d. V on the vertical axis against current I on the horizontal axis. From V = ε − Ir, the y-intercept is ε and the gradient is −r."]
      ],
      worked:{q:"A cell has ε = 1.50 V and r = 0.40 Ω. It supplies 0.80 A. Find terminal p.d.",steps:["V = ε − Ir","V = 1.50 − (0.80 × 0.40)","V = 1.18 V"]},
      activity:"For ε = 6.0 V and r = 1.0 Ω, calculate I and V for load resistances of 11 Ω, 5 Ω and 2 Ω.",
      mission:{goal:"Generate the linear V–I relationship.",steps:["Set ε and r.","Change the load resistance to create several currents.","Compare the intercept and slope of the V–I trend."],conclusion:"Explain why the line has gradient −r."},
      check:["On a graph of terminal V against I, the magnitude of the gradient is…",["ε","R","r","power"],2,"V = ε − Ir, so gradient = −r."],
      examTip:"State 'lost volts = Ir' and keep emf separate from terminal p.d.",
      misconception:"EMF is not necessarily equal to the measured terminal p.d. when the source is delivering current.",
      exit:"Why can a battery read close to its emf with no load but a lower voltage when powering a device?"
    },
    {
      id:"synthesis", code:"3.5 synthesis", title:"Electricity problem solving and specification mastery", sim:"circuits",
      lead:"Combine conservation laws, component behaviour and source physics in unfamiliar circuits.",
      keywords:["modelling","conservation","operating point","uncertainty","graph interpretation"],
      formulas:["I = Q/t","V = W/Q","R = V/I","ρ = RA/L","P = IV","V = ε − Ir"],
      objectives:["Choose equations from physical principles.","Check answers using limiting cases and units.","Connect practical evidence to circuit models."],
      retrieval:[["What two conservation principles organise dc circuits?","conservation of charge and conservation of energy."],["What property distinguishes a diode?","strongly asymmetric I–V characteristic."],["What graph gives ε and r?","terminal V against I."]],
      teach:[
        ["Start with structure","Identify series and parallel sections, label currents and p.d.s, then apply conservation of charge and energy before reaching for equations."],
        ["Check physical sense","Parallel resistance must be below the smallest branch resistance; terminal p.d. should not exceed emf for a discharging cell; a metal wire usually becomes more resistive when hotter."],
        ["Use graphs carefully","Check axes first. Distinguish a ratio such as V/I from a graph gradient when the graph is curved."],
        ["Practical thinking","High-quality A-level answers identify independent, dependent and control variables, explain repeats, discuss heating/contact resistance and connect gradient/intercept to a physical quantity."]
      ],
      worked:{q:"A 2.0 Ω load is connected to a cell of ε = 3.0 V and r = 0.50 Ω. Find current, terminal p.d. and load power.",steps:["I = ε/(R + r) = 3.0/2.5 = 1.20 A","V = IR = 1.20 × 2.0 = 2.40 V","Pload = I²R = 1.20² × 2.0 = 2.88 W","Check: lost volts = Ir = 0.60 V and ε = V + Ir = 3.00 V"]},
      activity:"Create a concept map linking charge, current, p.d., resistance, resistivity, power, potential dividers, emf and internal resistance.",
      mission:{goal:"Solve a multi-step circuit from evidence.",steps:["Choose a circuit configuration.","Predict current before changing any value.","Use the readout to check and explain any difference."],conclusion:"Describe the sequence of physical principles you used rather than listing equations."},
      check:["Which statement is always true for a discharging cell with internal resistance?",["V > ε","V = ε + Ir","V = ε − Ir","r = 0"],2,"Terminal p.d. is reduced by the internal voltage drop Ir."],
      examTip:"Write a short physics statement before each major equation in long calculations.",
      misconception:"A correct numerical answer with unexplained circuit assumptions can still lose reasoning marks.",
      exit:"What three checks would you apply to a complicated electricity calculation before accepting your answer?"
    }
  ],

  sims: {
    charge:{
      title:"Charge & current flow", code:"3.5.1.1", subtitle:"Watch charge transfer build with time and current.",
      controls:[
        {k:"current",label:"Current",v:0.8,min:0.1,max:3,step:0.1,u:"A"},
        {k:"time",label:"Observation time",v:4,min:1,max:10,step:1,u:"s"},
        {k:"resistance",label:"Load resistance",v:6,min:1,max:20,step:1,u:"Ω"}
      ],
      simple:"Current is the rate at which charge crosses a chosen section. The animation speed is linked to current, while Q = It gives the charge transferred over the selected time.",
      exam:"Electric current is the rate of flow of charge. Potential difference is energy transferred per unit charge.",
      mistake:"Do not say current is used up by a component."
    },
    iv:{
      title:"I–V characteristic explorer", code:"3.5.1.2", subtitle:"Compare resistor, filament lamp and diode curves.",
      controls:[
        {k:"component",label:"Component",type:"select",options:[["resistor","Ohmic resistor"],["lamp","Filament lamp"],["diode","Semiconductor diode"]],v:"resistor"},
        {k:"voltage",label:"Applied p.d.",v:4,min:-10,max:10,step:0.5,u:"V"},
        {k:"baseR",label:"Nominal resistance",v:20,min:5,max:80,step:5,u:"Ω"}
      ],
      simple:"The graph shows current response as applied p.d. changes. Only the fixed resistor keeps a constant V/I ratio in the model.",
      exam:"Ohm's law is I proportional to V under constant physical conditions. A filament lamp heats and its resistance rises; a diode is strongly direction-dependent.",
      mistake:"Check the graph axes before interpreting a slope."
    },
    resistivity:{
      title:"Resistivity wire laboratory", code:"3.5.1.3", subtitle:"Change wire geometry, material behaviour and temperature.",
      controls:[
        {k:"length",label:"Wire length",v:0.6,min:0.1,max:1.5,step:0.05,u:"m"},
        {k:"diameter",label:"Wire diameter",v:0.40,min:0.20,max:1.00,step:0.02,u:"mm"},
        {k:"mode",label:"Material behaviour",type:"select",options:[["metal","Metal wire"],["ntc","NTC thermistor model"],["super","Superconductor model"]],v:"metal"},
        {k:"temp",label:"Temperature",v:293,min:100,max:380,step:5,u:"K"}
      ],
      simple:"Resistance follows R = ρL/A. The material model changes ρ with temperature to show metallic, NTC and superconducting trends.",
      exam:"Resistivity is a material property measured in Ω m. Metals usually increase resistance with temperature; NTC thermistors decrease.",
      mistake:"Remember that area depends on diameter squared."
    },
    circuits:{
      title:"Series & parallel circuit analyser", code:"3.5.1.4", subtitle:"See current, p.d., total resistance and power together.",
      controls:[
        {k:"config",label:"Configuration",type:"select",options:[["series","Series"],["parallel","Parallel"]],v:"series"},
        {k:"supply",label:"Supply p.d.",v:9,min:1,max:18,step:1,u:"V"},
        {k:"r1",label:"R₁",v:10,min:1,max:40,step:1,u:"Ω"},
        {k:"r2",label:"R₂",v:20,min:1,max:40,step:1,u:"Ω"}
      ],
      simple:"Series circuits share current; parallel branches share p.d. The model calculates branch currents and total electrical power.",
      exam:"Use conservation of charge at junctions and conservation of energy around loops.",
      mistake:"Parallel total resistance must be lower than the smallest branch resistance."
    },
    divider:{
      title:"Potential-divider sensor", code:"3.5.1.5", subtitle:"Control an output p.d. and test sensor placement.",
      controls:[
        {k:"vin",label:"Supply p.d.",v:12,min:3,max:15,step:1,u:"V"},
        {k:"r1",label:"Upper resistance R₁",v:3000,min:500,max:10000,step:500,u:"Ω"},
        {k:"r2",label:"Lower resistance R₂",v:3000,min:500,max:10000,step:500,u:"Ω"},
        {k:"sensor",label:"Lower component",type:"select",options:[["fixed","Fixed resistor"],["ntc","NTC thermistor"],["ldr","LDR"]],v:"fixed"},
        {k:"stimulus",label:"Temperature / light level",v:50,min:0,max:100,step:5,u:"%"}
      ],
      simple:"The output is measured across the lower component. Changing that resistance changes its share of the supply p.d.",
      exam:"For output across R₂, Vout = Vin R₂/(R₁ + R₂). Sensor location determines whether output rises or falls with the stimulus.",
      mistake:"Do not use the wrong resistor in the numerator."
    },
    internal:{
      title:"Real cell & internal resistance", code:"3.5.1.6", subtitle:"Load a real cell and see terminal p.d. fall as current rises.",
      controls:[
        {k:"emf",label:"EMF ε",v:1.5,min:1,max:12,step:0.5,u:"V"},
        {k:"r",label:"Internal resistance r",v:0.5,min:0.1,max:3,step:0.1,u:"Ω"},
        {k:"load",label:"External resistance R",v:5,min:0.5,max:20,step:0.5,u:"Ω"}
      ],
      simple:"The current is I = ε/(R + r). The terminal p.d. is V = ε − Ir and the internal voltage drop Ir grows as current rises.",
      exam:"On a graph of terminal V against I, intercept = ε and gradient = −r.",
      mistake:"EMF and terminal p.d. are not generally equal when current is flowing."
    }
  },

  formulas:[
    {id:"current",name:"Current from charge and time",eq:"I = Q/t",inputs:[["Q","Charge","C"],["t","Time","s"]],solve:v=>v.Q/v.t,unit:"A"},
    {id:"charge",name:"Charge transferred",eq:"Q = It",inputs:[["I","Current","A"],["t","Time","s"]],solve:v=>v.I*v.t,unit:"C"},
    {id:"pd",name:"Potential difference",eq:"V = W/Q",inputs:[["W","Energy transferred","J"],["Q","Charge","C"]],solve:v=>v.W/v.Q,unit:"V"},
    {id:"energyCharge",name:"Energy from p.d. and charge",eq:"W = VQ",inputs:[["V","Potential difference","V"],["Q","Charge","C"]],solve:v=>v.V*v.Q,unit:"J"},
    {id:"resistance",name:"Resistance",eq:"R = V/I",inputs:[["V","Potential difference","V"],["I","Current","A"]],solve:v=>v.V/v.I,unit:"Ω"},
    {id:"rho",name:"Resistivity",eq:"ρ = RA/L",inputs:[["R","Resistance","Ω"],["A","Area","m²"],["L","Length","m"]],solve:v=>v.R*v.A/v.L,unit:"Ω m"},
    {id:"wireR",name:"Wire resistance",eq:"R = ρL/A",inputs:[["rho","Resistivity","Ω m"],["L","Length","m"],["A","Area","m²"]],solve:v=>v.rho*v.L/v.A,unit:"Ω"},
    {id:"series",name:"Two resistors in series",eq:"Rₜ = R₁ + R₂",inputs:[["R1","R₁","Ω"],["R2","R₂","Ω"]],solve:v=>v.R1+v.R2,unit:"Ω"},
    {id:"parallel",name:"Two resistors in parallel",eq:"Rₜ = R₁R₂/(R₁+R₂)",inputs:[["R1","R₁","Ω"],["R2","R₂","Ω"]],solve:v=>v.R1*v.R2/(v.R1+v.R2),unit:"Ω"},
    {id:"power",name:"Electrical power",eq:"P = IV",inputs:[["I","Current","A"],["V","Potential difference","V"]],solve:v=>v.I*v.V,unit:"W"},
    {id:"energy",name:"Electrical energy",eq:"E = IVt",inputs:[["I","Current","A"],["V","Potential difference","V"],["t","Time","s"]],solve:v=>v.I*v.V*v.t,unit:"J"},
    {id:"divider",name:"Potential-divider output",eq:"Vout = Vin R₂/(R₁+R₂)",inputs:[["Vin","Supply p.d.","V"],["R1","Upper R₁","Ω"],["R2","Lower R₂","Ω"]],solve:v=>v.Vin*v.R2/(v.R1+v.R2),unit:"V"},
    {id:"cellCurrent",name:"Current from emf, load and internal resistance",eq:"I = ε/(R+r)",inputs:[["emf","EMF","V"],["R","Load resistance","Ω"],["r","Internal resistance","Ω"]],solve:v=>v.emf/(v.R+v.r),unit:"A"},
    {id:"terminal",name:"Terminal p.d.",eq:"V = ε − Ir",inputs:[["emf","EMF","V"],["I","Current","A"],["r","Internal resistance","Ω"]],solve:v=>v.emf-v.I*v.r,unit:"V"}
  ],

  quiz:[
    {code:"3.5.1.1",q:"A steady current of 0.40 A flows for 50 s. How much charge passes?",o:["0.008 C","20 C","50 C","125 C"],a:1,e:"Q = It = 0.40 × 50 = 20 C."},
    {code:"3.5.1.1",q:"Which statement best defines potential difference?",o:["charge per second","energy transferred per unit charge","resistance per ampere","power per coulomb"],a:1,e:"V = W/Q, so p.d. is energy transferred per unit charge."},
    {code:"3.5.1.2",q:"Which condition is required for an ohmic conductor?",o:["zero temperature","constant physical conditions","zero resistance","alternating current"],a:1,e:"Ohm's law requires I proportional to V while physical conditions remain constant."},
    {code:"3.5.1.2",q:"A filament lamp becomes hotter as current increases. Its resistance normally…",o:["decreases","stays constant","increases","becomes zero"],a:2,e:"Greater lattice vibration produces more carrier scattering."},
    {code:"3.5.1.2",q:"An ideal voltmeter has resistance that is…",o:["zero","very small","infinite","equal to the component"],a:2,e:"An ideal voltmeter draws no current, so its resistance is infinite."},
    {code:"3.5.1.3",q:"A wire's length doubles while area and resistivity stay constant. Its resistance becomes…",o:["R/2","R","2R","4R"],a:2,e:"R = ρL/A."},
    {code:"3.5.1.3",q:"A wire's diameter doubles. Its cross-sectional area becomes…",o:["twice","four times","half","one quarter"],a:1,e:"A = πd²/4."},
    {code:"3.5.1.3",q:"For an NTC thermistor, resistance normally… as temperature rises.",o:["increases","decreases","stays exactly constant","becomes infinite"],a:1,e:"NTC means negative temperature coefficient."},
    {code:"3.5.1.4",q:"Two resistors 7 Ω and 13 Ω are in series. Total resistance is…",o:["6 Ω","20 Ω","91 Ω","4.55 Ω"],a:1,e:"Series resistances add."},
    {code:"3.5.1.4",q:"Two identical 10 Ω resistors are in parallel. Equivalent resistance is…",o:["20 Ω","10 Ω","5 Ω","2 Ω"],a:2,e:"Two equal parallel resistors give R/2."},
    {code:"3.5.1.4",q:"Which equation is always valid for electrical power?",o:["P = IV","P = IR","P = V/R","P = It"],a:0,e:"P = IV. Other useful forms follow using V = IR."},
    {code:"3.5.1.4",q:"At a junction, 2.0 A enters and 0.7 A leaves through one branch. The other branch current is…",o:["1.3 A","2.7 A","0.35 A","1.4 A"],a:0,e:"Conservation of charge: current in = current out."},
    {code:"3.5.1.5",q:"A potential divider has equal resistors and output is across one of them. Vout is…",o:["0","Vin/2","Vin","2Vin"],a:1,e:"Equal series resistances share p.d. equally."},
    {code:"3.5.1.6",q:"A cell has ε = 2.0 V, r = 0.50 Ω and I = 1.0 A. Terminal p.d. is…",o:["0.5 V","1.0 V","1.5 V","2.5 V"],a:2,e:"V = ε − Ir = 2.0 − 0.5 = 1.5 V."},
    {code:"3.5.1.6",q:"On a graph of terminal V against current I, the y-intercept is…",o:["internal resistance","emf","load resistance","power"],a:1,e:"V = ε − Ir, so at I = 0, V = ε."},
    {code:"3.5 synthesis",q:"Which result should immediately trigger a re-check?",o:["Parallel total resistance below both branches","Terminal p.d. below emf","Series total resistance above each resistor","Parallel total resistance above both branches"],a:3,e:"Adding parallel paths lowers the equivalent resistance."}
  ],

  spec:[
    {code:"3.5.1.1",title:"Basics of electricity",text:"Current as rate of flow of charge; p.d. as work done per unit charge; resistance defined by V/I."},
    {code:"3.5.1.2",title:"Current–voltage characteristics",text:"Ohmic conductor, filament lamp and semiconductor diode; Ohm's law; ideal ammeters/voltmeters; either graph-axis orientation."},
    {code:"3.5.1.3",title:"Resistivity",text:"ρ = RA/L; temperature effects in metals and NTC thermistors; thermistor applications; superconductivity and applications."},
    {code:"Required Practical 5",title:"Resistivity of a wire",text:"Determine resistivity using wire dimensions, ammeter and voltmeter, with careful control of heating and diameter measurement."},
    {code:"3.5.1.4",title:"Circuits",text:"Series/parallel resistance; electrical energy and power; current and p.d. relationships; cells; conservation of charge and energy."},
    {code:"3.5.1.5",title:"Potential divider",text:"Constant/variable outputs using fixed and variable resistors, thermistors and LDRs."},
    {code:"3.5.1.6",title:"EMF and internal resistance",text:"Real-source calculations using emf, terminal p.d. and internal resistance."},
    {code:"Required Practical 6",title:"EMF and internal resistance",text:"Measure terminal p.d. against current to determine emf from the intercept and internal resistance from the gradient magnitude."}
  ]
};