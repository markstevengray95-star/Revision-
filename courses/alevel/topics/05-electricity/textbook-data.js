window.ELECTRICITY_TEXTBOOK = {
  chapters: [
    {
      id: "basics",
      code: "3.5.1.1",
      title: "Current, charge, potential difference and resistance",
      subtitle: "Build the four definitions that every later electricity calculation depends on.",
      spec: [
        "Electric current is the rate of flow of charge.",
        "Potential difference is work done or energy transferred per unit charge.",
        "Resistance is the ratio of potential difference to current."
      ],
      equations: ["I = ΔQ / Δt", "V = W / Q", "R = V / I", "Q = It", "W = VQ"],
      sections: [
        ["Charge and current", "Charge is a property of matter measured in coulombs, C. Electric current tells us how quickly charge passes a point in a circuit. One ampere means one coulomb of charge passes each second. The equation I = ΔQ/Δt is a rate equation, so current increases if more charge passes in the same time or if the same charge passes in less time."],
        ["Conventional current and electron motion", "In metallic conductors the mobile charge carriers are electrons. Electrons move through the metal in the direction opposite to conventional current. Conventional current is still defined as the direction positive charge would move. In circuit calculations, use the conventional current direction unless the question explicitly asks about electron flow."],
        ["Potential difference", "Potential difference measures energy transferred per coulomb between two points. A component with a potential difference of 6.0 V transfers 6.0 J of energy for every coulomb of charge passing through it. A source raises the energy of the charges; components transfer electrical energy into other stores such as thermal, light or kinetic energy."],
        ["Resistance", "Resistance describes how strongly a component opposes current for a given potential difference. R = V/I is always the definition of resistance at a particular operating point. A component can have a changing resistance, so do not assume resistance is constant unless its physical conditions make it ohmic."]
      ],
      worked: {
        q: "A current of 0.35 A flows for 4.0 minutes through a resistor connected across 12 V. Find the charge transferred and the energy transferred.",
        steps: ["Convert time: 4.0 min = 240 s.", "Q = It = 0.35 × 240 = 84 C.", "W = VQ = 12 × 84 = 1008 J.", "Give a sensible number of significant figures: 1.0 × 10³ J."]
      },
      diagram: "charge",
      exam: "Keep the physical meanings separate: current is charge per second; potential difference is joules per coulomb; resistance is volts per ampere. Examiners often reward the definition before the calculation.",
      traps: ["Do not say current is 'used up'.", "Do not confuse charge Q with energy W.", "Convert minutes, milliseconds and microseconds before substituting."]
    },
    {
      id: "iv",
      code: "3.5.1.2",
      title: "Current–voltage characteristics and Ohm’s law",
      subtitle: "Read and explain the characteristic curves of resistors, lamps and diodes.",
      spec: [
        "Know the I–V characteristics of an ohmic conductor, filament lamp and semiconductor diode.",
        "Use Ohm’s law only when current is proportional to voltage under constant physical conditions.",
        "Treat ammeters as ideal zero-resistance devices and voltmeters as ideal infinite-resistance devices unless told otherwise.",
        "Be ready for either I or V on the horizontal axis."
      ],
      equations: ["R = V / I", "Ohmic conductor: I ∝ V when physical conditions are constant"],
      sections: [
        ["Ohmic conductor", "For an ohmic conductor at constant temperature, current is directly proportional to potential difference. Its characteristic is a straight line through the origin. The ratio V/I is constant, so its resistance is constant. If V is on the horizontal axis and I on the vertical axis, the gradient is 1/R. If the axes are reversed, the gradient is R."],
        ["Filament lamp", "As current increases, the filament becomes hotter. The ions in the metal lattice vibrate more strongly, increasing the rate at which conduction electrons collide with the lattice. The resistance therefore increases. The I–V curve becomes less steep as the magnitude of voltage increases when I is plotted vertically against V."],
        ["Semiconductor diode", "A diode allows substantial current in one direction once it is forward biased sufficiently, while the reverse current is extremely small in the simple A-level model. Its characteristic is strongly non-linear. In calculations, use the graph or data given rather than assuming a single constant resistance."],
        ["Meters and practical circuits", "An ideal ammeter has zero resistance so it does not change the circuit current and is placed in series. An ideal voltmeter has infinite resistance so it draws no current and is placed in parallel across the component whose potential difference is measured."]
      ],
      worked: {
        q: "A resistor has a straight I–V graph passing through I = 0.40 A at V = 8.0 V. Find its resistance and state what the straight line indicates.",
        steps: ["R = V/I.", "R = 8.0/0.40 = 20 Ω.", "A straight line through the origin shows I is proportional to V.", "The resistor is ohmic provided its physical conditions, especially temperature, remain constant."]
      },
      diagram: "iv",
      exam: "When explaining a filament lamp, connect the whole chain: greater current → greater heating → larger lattice vibrations → more collisions → larger resistance.",
      traps: ["The gradient only equals resistance when V is plotted vertically against I.", "A curved graph does not mean R = V/I is invalid; it means R is not constant.", "Do not describe a diode as having literally zero reverse current unless the model or data justify that."]
    },
    {
      id: "resistivity",
      code: "3.5.1.3",
      title: "Resistivity, temperature effects, thermistors and superconductivity",
      subtitle: "Separate the geometry of a conductor from the electrical property of its material.",
      spec: [
        "Use ρ = RA/L.",
        "Describe the qualitative effect of temperature on metallic conductors and NTC thermistors.",
        "Interpret resistance–temperature graphs for NTC thermistors and explain sensor applications.",
        "Know that superconductors have zero resistivity at and below a material-dependent critical temperature.",
        "Know applications: strong magnetic fields and reduced energy loss in power transmission; critical field is not assessed."
      ],
      equations: ["ρ = RA / L", "R = ρL / A", "A = πd² / 4"],
      sections: [
        ["What resistivity means", "Resistance depends on the material and on the dimensions of the sample. Resistivity ρ removes the effects of length and cross-sectional area, allowing materials to be compared. Its SI unit is Ω m. For a uniform wire at constant temperature, doubling the length doubles resistance and doubling the cross-sectional area halves resistance."],
        ["Cross-sectional area", "For a circular wire A = πd²/4. Diameter must be converted to metres before calculating area. Because area depends on d², a small percentage uncertainty in diameter produces roughly twice that percentage uncertainty in area and therefore strongly affects a resistivity result."],
        ["Metals and temperature", "As the temperature of a metal rises, the lattice ions vibrate with greater amplitude. Conduction electrons experience more frequent collisions, so the resistivity and therefore the resistance increase. The exact relationship need not be assumed linear unless data show that it is approximately linear over the range used."],
        ["NTC thermistors", "An NTC thermistor has a negative temperature coefficient: its resistance decreases as temperature increases. This makes it useful in temperature sensing. In a potential divider, whether the output rises or falls with temperature depends on the thermistor’s position and which component the output is taken across."],
        ["Superconductivity", "Some materials have zero resistivity at and below a critical temperature that depends on the material. This can allow persistent currents and very large currents without ordinary resistive heating. Applications include producing strong magnetic fields and reducing electrical transmission losses. AQA does not require the critical magnetic field in this section."]
      ],
      worked: {
        q: "A 1.20 m wire has diameter 0.36 mm and resistance 5.2 Ω. Calculate its resistivity.",
        steps: ["d = 0.36 mm = 3.6 × 10⁻⁴ m.", "A = πd²/4 = 1.02 × 10⁻⁷ m².", "ρ = RA/L.", "ρ = 5.2 × 1.02 × 10⁻⁷ / 1.20 = 4.4 × 10⁻⁷ Ω m."]
      },
      diagram: "resistivity",
      exam: "Whenever diameter is provided, show the conversion to metres and the area calculation explicitly. It is a common source of lost marks.",
      traps: ["Resistivity is not the same as resistance.", "Use radius squared or diameter squared with the correct formula.", "NTC means resistance falls as temperature rises."]
    },
    {
      id: "rp5",
      code: "Required Practical 5",
      title: "Required Practical 5: determine the resistivity of a wire",
      subtitle: "Plan the circuit, collect reliable measurements and extract ρ from the data.",
      spec: [
        "Determine resistivity using a micrometer, ammeter and voltmeter.",
        "Relevant apparatus and techniques include length measurement, digital electrical measurements, micrometer use and circuit construction."
      ],
      equations: ["R = V / I", "ρ = RA / L", "A = πd² / 4", "R = (ρ/A)L"],
      sections: [
        ["Core method", "Measure the wire diameter with a micrometer at several positions and in more than one orientation, then calculate a mean diameter and cross-sectional area. Construct a circuit that allows the potential difference across a chosen length of test wire and the current through it to be measured. Vary the length and obtain several pairs of V and I values."],
        ["Controlling heating", "The wire must remain as close as possible to constant temperature because resistivity depends on temperature. Keep currents modest, switch off between readings and take measurements efficiently. If the wire warms, the resistance can increase during the experiment and introduce a systematic trend."],
        ["Graph method", "For a fixed material and cross-sectional area, R = ρL/A. Plot R on the vertical axis against L on the horizontal axis. The gradient is ρ/A, so ρ = gradient × A. A graph uses all the measurements and is usually preferable to calculating a separate resistivity from only one reading."],
        ["Uncertainty and evaluation", "Diameter uncertainty is especially important because A depends on d². Repeat diameter measurements, avoid measuring a visibly deformed section, use a long range of wire lengths and read scales at eye level where relevant. A best-fit line should be used rather than joining data points."]
      ],
      worked: {
        q: "A graph of resistance R against length L has gradient 4.6 Ω m⁻¹. The wire diameter is 0.40 mm. Find ρ.",
        steps: ["d = 4.0 × 10⁻⁴ m.", "A = πd²/4 = 1.26 × 10⁻⁷ m².", "gradient = ρ/A.", "ρ = 4.6 × 1.26 × 10⁻⁷ = 5.8 × 10⁻⁷ Ω m."]
      },
      diagram: "rp5",
      exam: "For evaluation questions, link each improvement to the measurement it improves: repeated diameter readings reduce random uncertainty in d; switching off reduces temperature change.",
      traps: ["Do not use a single diameter reading if repeat measurements are available.", "Do not leave the circuit connected continuously.", "A graph of R against L should be linear only if material, area and temperature stay effectively constant."]
    },
    {
      id: "circuits",
      code: "3.5.1.4",
      title: "Series and parallel circuits, energy and power",
      subtitle: "Use conservation of charge and energy to analyse unfamiliar DC networks.",
      spec: [
        "Calculate resistance combinations in series and parallel.",
        "Use E = IVt and P = IV = I²R = V²/R.",
        "Apply current, potential difference and resistance relationships in series and parallel circuits.",
        "Analyse cells in series and identical cells in parallel.",
        "Apply conservation of charge and conservation of energy in DC circuits."
      ],
      equations: ["Rₜ = R₁ + R₂ + …", "1/Rₜ = 1/R₁ + 1/R₂ + …", "E = IVt", "P = IV = I²R = V²/R"],
      sections: [
        ["Series circuits", "The same current passes through components in series because there is no junction at which charge can split. The potential differences across the components add to the supply potential difference, expressing conservation of energy per unit charge. Resistors in series therefore have a total resistance equal to the sum of their individual resistances."],
        ["Parallel circuits", "Components connected between the same two nodes are in parallel and therefore have the same potential difference. Current divides between branches and recombines, so the total current equals the sum of branch currents. The reciprocal rule for resistors means the total resistance of a parallel combination is always less than the smallest branch resistance."],
        ["Conservation laws", "At a junction, charge cannot steadily accumulate, so current entering equals current leaving. Around a complete loop, the energy supplied per coulomb by sources equals the energy transferred per coulomb by components. These are the physical ideas behind the familiar current and voltage rules."],
        ["Cells", "Cells in series can provide a larger total emf when they are connected in the same sense. Identical cells in parallel have the same emf as one cell in the simple model, while sharing the current. When internal resistance matters, parallel identical cells can have a smaller effective internal resistance."],
        ["Electrical power and energy", "Power is the rate of energy transfer. P = IV is the most general electrical form here. Combining it with V = IR gives P = I²R and P = V²/R. Choose the form that matches the quantities known in the question, and remember that E = Pt = IVt gives the energy transferred over a time interval."]
      ],
      worked: {
        q: "A 12 V supply is connected to 6.0 Ω and 3.0 Ω resistors in parallel. Find the total current and total power.",
        steps: ["1/Rₜ = 1/6.0 + 1/3.0 = 0.50 Ω⁻¹, so Rₜ = 2.0 Ω.", "Iₜ = V/Rₜ = 12/2.0 = 6.0 A.", "P = VI = 12 × 6.0 = 72 W.", "Check: Rₜ is less than 3.0 Ω, so the parallel result is physically sensible."]
      },
      diagram: "circuits",
      exam: "Mark nodes before deciding whether components are in series or parallel. Components that merely look side-by-side on a diagram are not necessarily parallel.",
      traps: ["Parallel resistance must be smaller than the smallest branch resistance.", "Current is not generally the same in parallel branches.", "Power and energy have different units: W and J."]
    },
    {
      id: "divider",
      code: "3.5.1.5",
      title: "Potential dividers, variable resistors and sensors",
      subtitle: "Design circuits that turn a changing resistance into a useful output voltage.",
      spec: [
        "Use a potential divider to supply a constant or variable potential difference from a power supply.",
        "Analyse examples containing variable resistors, NTC thermistors and LDRs.",
        "Design and construct potential divider circuits to achieve specified outcomes.",
        "A potentiometer as a measuring instrument is not required."
      ],
      equations: ["Vout = Vin × Routput / (Rtop + Rbottom)", "V₁ / V₂ = R₁ / R₂ for two series resistors"],
      sections: [
        ["Why a divider works", "Two resistors in series carry the same current. The potential difference across each resistor is therefore IR, so the supply potential difference divides in the same ratio as the resistances. The output is taken across one chosen resistor."],
        ["Choosing the numerator", "In the divider equation, the resistance in the numerator must be the resistance directly across which Vout is measured. This is more reliable than memorising a diagram orientation because the circuit can be drawn in many different ways."],
        ["Variable output", "Replacing one resistor with a variable resistor allows the output voltage to be adjusted. A sliding contact on a uniform resistance track can select a fraction of the input potential difference. AQA expects the divider to be used as a source of constant or variable potential difference."],
        ["Thermistor sensor", "For an NTC thermistor, resistance falls as temperature rises. If Vout is measured across the thermistor, Vout tends to fall as temperature rises. If the thermistor is the other resistor and Vout is measured across the fixed resistor, Vout tends to rise. Always reason from the divider equation rather than memorising a direction."],
        ["LDR sensor", "An LDR has lower resistance in brighter conditions. The same position logic applies: output across the LDR tends to fall as light intensity rises; output across the fixed resistor tends to rise if the LDR is the upper resistor. The exact response can be non-linear."]
      ],
      worked: {
        q: "A 9.0 V supply is connected across a 2.0 kΩ resistor in series with a 4.0 kΩ resistor. Vout is measured across the 4.0 kΩ resistor.",
        steps: ["Use Routput = 4.0 kΩ.", "Vout = 9.0 × 4.0/(2.0 + 4.0).", "Vout = 6.0 V.", "Check: the larger resistor receives the larger share of the supply potential difference."]
      },
      diagram: "divider",
      exam: "For sensor questions, state how the sensor resistance changes first, then use the potential-divider ratio to state how Vout changes.",
      traps: ["Do not automatically put the lower resistor in the numerator; use the resistor across which Vout is measured.", "Do not state that an NTC thermistor’s resistance rises with temperature.", "LDR and thermistor responses are generally non-linear."]
    },
    {
      id: "emf",
      code: "3.5.1.6",
      title: "Electromotive force, terminal potential difference and internal resistance",
      subtitle: "Model a real source and explain why terminal voltage falls when current increases.",
      spec: [
        "Use ε = E/Q.",
        "Use ε = I(R + r) and equivalent forms.",
        "Distinguish emf from terminal potential difference.",
        "Solve circuits where source internal resistance is not negligible."
      ],
      equations: ["ε = E / Q", "ε = I(R + r)", "ε = V + Ir", "V = ε − Ir", "lost volts = Ir"],
      sections: [
        ["What emf means", "Electromotive force is the energy supplied by a source per unit charge. The unit is the volt, equivalent to J C⁻¹. Despite its name, emf is not a force. It describes energy transfer to the charges inside the source."],
        ["Terminal potential difference", "Terminal potential difference is the energy transferred per coulomb in the external circuit. When no current is drawn in the simple model, terminal pd equals emf. When current flows, some energy is transferred inside the source because of its internal resistance."],
        ["Internal resistance and lost volts", "A real source can be modelled as an ideal emf ε in series with an internal resistance r. The internal potential drop is Ir, often called lost volts. Therefore ε = V + Ir and V = ε − Ir. Increasing current increases the internal drop and usually reduces terminal pd."],
        ["Current in a complete circuit", "If an external resistance R is connected to a source with emf ε and internal resistance r, then ε = I(R + r), so I = ε/(R + r). The external terminal pd is V = IR. These equations are consistent with conservation of energy around the loop."],
        ["Power transfer", "The power dissipated internally is I²r and the useful power delivered to an external resistor is I²R. AQA’s core requirement is the emf/internal-resistance model; power reasoning is a useful extension when interpreting source behaviour and energy losses."]
      ],
      worked: {
        q: "A cell has emf 1.50 V and internal resistance 0.40 Ω. It is connected to a 2.60 Ω resistor. Find the current and terminal pd.",
        steps: ["Total resistance = R + r = 2.60 + 0.40 = 3.00 Ω.", "I = ε/(R + r) = 1.50/3.00 = 0.500 A.", "V = IR = 0.500 × 2.60 = 1.30 V.", "Check using V = ε − Ir = 1.50 − 0.500 × 0.40 = 1.30 V."]
      },
      diagram: "emf",
      exam: "Do not define emf as 'the voltage of the battery'. Use energy supplied per unit charge, then distinguish it from terminal pd.",
      traps: ["Emf is not a force.", "Terminal pd is smaller than emf when a discharging source with internal resistance supplies current.", "The gradient of V against I is negative; r is the magnitude of that gradient."]
    },
    {
      id: "rp6",
      code: "Required Practical 6",
      title: "Required Practical 6: emf and internal resistance",
      subtitle: "Use a V–I graph to measure both properties of a real cell.",
      spec: [
        "Investigate how terminal pd varies with current.",
        "Relevant practical skills include digital electrical measurement, circuit construction and circuit design/checking."
      ],
      equations: ["V = ε − Ir", "straight-line form: y = c + mx", "intercept = ε", "gradient = −r"],
      sections: [
        ["Circuit and measurements", "Connect the cell, switch, ammeter and variable load in series. Connect the voltmeter across the cell terminals. Vary the load resistance to obtain a range of current values and record the corresponding terminal potential difference."],
        ["Why the switch matters", "Open the switch between readings. This limits discharge and heating of the cell, both of which could alter its emf or internal resistance during the experiment. Avoid very large currents that may significantly change the cell temperature."],
        ["Linear graph", "Rearrange the model to V = ε − Ir. Plot V vertically against I horizontally. The intercept on the V axis gives ε and the gradient is −r, so the internal resistance is the magnitude of the gradient. Use a best-fit line through all appropriate data."],
        ["Data quality", "Choose a broad but safe range of load resistances so the data span a useful current range. Repeat measurements if practical, identify anomalous points cautiously and use sufficient scale on the graph. Quote units on both gradient-derived r and intercept-derived ε."],
        ["Interpreting departures", "If the data curve systematically rather than lying close to a straight line, the simple assumption of constant emf and internal resistance may not hold over the range. Heating, discharge or measurement limitations may be responsible."]
      ],
      worked: {
        q: "A best-fit graph of terminal pd V against current I has intercept 1.58 V and gradient −0.72 V A⁻¹.",
        steps: ["Compare V = ε − Ir with y = c + mx.", "The intercept c is ε = 1.58 V.", "The gradient m is −r.", "Therefore r = 0.72 Ω because V A⁻¹ is equivalent to Ω."]
      },
      diagram: "rp6",
      exam: "State exactly what the graph gives: y-intercept = emf; magnitude of the gradient = internal resistance.",
      traps: ["Do not report a negative resistance.", "Do not connect the voltmeter in series.", "Do not leave the switch closed for long periods between readings."]
    }
  ]
};