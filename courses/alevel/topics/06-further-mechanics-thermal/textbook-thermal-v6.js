window.FM_TEXTBOOK=Object.assign(window.FM_TEXTBOOK||{},{
  "internal-energy": {
    "hook": "Two objects can be at the same temperature but contain very different amounts of internal energy. Temperature tells us about the microscopic energy scale; internal energy depends on the entire collection of particles and how they are arranged.",
    "hookQuestion": "How can internal energy change even when temperature stays constant?",
    "visual": "internal-energy",
    "sections": [
      {
        "heading": "What internal energy actually means",
        "text": "Internal energy is the sum of the randomly distributed kinetic energies and potential energies of all the particles in a body. It is an energy store of the system, measured in joules. It is not the same as temperature and should not be described as 'heat stored in the object'."
      },
      {
        "heading": "Random kinetic energy",
        "text": "Particles in matter are continually moving. In gases this is mainly random translational motion; in solids and liquids there are also vibrational and other microscopic motions. Raising temperature generally increases the average random kinetic energy of the particles."
      },
      {
        "heading": "Potential-energy contribution",
        "text": "Particles interact through forces, so their separation and arrangement also contribute to internal energy. This contribution is especially important during changes of state, when particles rearrange without necessarily increasing their average kinetic energy."
      },
      {
        "heading": "Heating and work",
        "text": "Internal energy increases when energy is transferred into the system by heating or when work is done on the system. It decreases when energy leaves by heating or when the system does work on its surroundings. For the core AQA thermal topic, this is treated qualitatively rather than through the more advanced option-level thermodynamics equations."
      },
      {
        "heading": "Temperature is not internal energy",
        "text": "Temperature is related to the microscopic kinetic-energy scale, whereas internal energy depends on the total number of particles as well as their kinetic and potential energies. A large warm object can therefore have much greater internal energy than a tiny hotter object."
      },
      {
        "heading": "Phase changes",
        "text": "During melting or boiling at constant temperature, average kinetic energy does not increase because temperature is constant. Energy supplied instead changes the particle arrangement and increases the potential-energy contribution, so internal energy still rises."
      }
    ],
    "keyIdeas": [
      "Internal energy = random KE + particle PE",
      "Heating is a transfer, not a store",
      "Temperature tracks microscopic energy scale",
      "Internal energy can change at constant T",
      "Phase change mainly changes PE contribution"
    ],
    "examFocus": "Use the phrase 'randomly distributed kinetic and potential energies of the particles'. Avoid saying that an object 'contains heat'.",
    "summary": [
      "Internal energy belongs to the whole particle system.",
      "Temperature and internal energy are related but not identical.",
      "Phase changes show clearly why internal energy can rise without a temperature increase."
    ],
    "retrieval": [
      [
        "What two microscopic contributions make up internal energy?",
        "Random kinetic energy and particle potential energy."
      ],
      [
        "What happens to mean particle KE during a constant-temperature phase change?",
        "It remains approximately constant."
      ],
      [
        "How can internal energy increase without heating?",
        "Work can be done on the system."
      ]
    ]
  },
  "specific-heat": {
    "hook": "Why does a metal spoon become hot quickly while the water around it warms more slowly? Different materials require different amounts of energy to produce the same temperature rise.",
    "hookQuestion": "What does a large specific heat capacity tell you about a material?",
    "visual": "calorimetry",
    "sections": [
      {
        "heading": "Meaning of specific heat capacity",
        "text": "Specific heat capacity c is the energy required to raise the temperature of 1 kg of a substance by 1 K, with no change of state. A large c means a material needs a large energy transfer for a given mass and temperature rise."
      },
      {
        "heading": "The equation Q=mcΔT",
        "text": "The energy transferred is Q=mcΔT. Q is in joules, m in kilograms, c in J kg⁻¹ K⁻¹ and ΔT in kelvin. Because a 1 K interval is the same size as a 1°C interval, temperature changes may be calculated from Celsius readings even though absolute temperatures require kelvin."
      },
      {
        "heading": "Electrical heating method",
        "text": "A common practical method uses an electrical heater. Measure V, I and heating time t so the electrical input is E=VIt=Pt. Measure the sample mass and temperature rise, then compare the electrical energy input with mcΔT."
      },
      {
        "heading": "Why real experiments are imperfect",
        "text": "Not all electrical energy heats the sample. Some warms the heater, container and thermometer, and some is transferred to the surroundings. Ignoring these effects can cause systematic error in the calculated c."
      },
      {
        "heading": "Improving the experiment",
        "text": "Insulation and a lid reduce energy losses. Mixing can make temperature more uniform in liquids. A temperature sensor and data logger reduce reading errors and reveal the temperature-time trend. Repeats improve reliability, while calibration and correction for apparatus heat capacity address systematic effects."
      },
      {
        "heading": "Using a temperature-time graph",
        "text": "For constant power and negligible loss, Pt=mcΔT, so the gradient dT/dt=P/(mc). A steeper graph means faster warming. Real curves often become less steep at higher temperatures because the temperature difference from the surroundings increases and heat loss becomes larger."
      }
    ],
    "keyIdeas": [
      "c = energy per kg per K",
      "Q=mcΔT",
      "Electrical input E=VIt=Pt",
      "Heat loss and apparatus heating matter",
      "Ideal slope dT/dt=P/(mc)"
    ],
    "examFocus": "Do not use the final temperature instead of ΔT. In practical questions, identify the direction of a systematic error, not just that 'heat is lost'.",
    "summary": [
      "Specific heat capacity describes how difficult a material is to warm.",
      "Electrical methods link thermal and electrical energy calculations.",
      "Graph shape and heat loss are central to practical evaluation."
    ],
    "retrieval": [
      [
        "What are the units of c?",
        "J kg⁻¹ K⁻¹."
      ],
      [
        "What electrical equation gives heater energy?",
        "E=VIt or Pt."
      ],
      [
        "Why might a temperature-time graph curve rather than remain perfectly straight?",
        "Heat loss increases as the sample gets hotter than the surroundings."
      ]
    ]
  },
  "continuous-flow": {
    "hook": "A boiler or engine-cooling system does not heat one fixed batch of fluid. Fluid is constantly entering and leaving, so thermal calculations must be written in terms of energy transferred each second.",
    "hookQuestion": "How does increasing the flow rate change the temperature rise if heater power stays fixed?",
    "visual": "flow-heating",
    "sections": [
      {
        "heading": "From a batch to a flowing system",
        "text": "For a fixed mass, Q=mcΔT. In continuous flow, the relevant quantity is how much mass passes each second. This is the mass flow rate ṁ, measured in kg s⁻¹."
      },
      {
        "heading": "Deriving the power equation",
        "text": "Divide Q=mcΔT by time. Since Q/t is power P and m/t is mass flow rate ṁ, the equation becomes P=ṁcΔT. This is a useful example of deriving a new working equation from a familiar one."
      },
      {
        "heading": "Physical meaning",
        "text": "At fixed heater power, a larger flow rate means the available energy per second is shared between more kilograms of fluid. Each kilogram therefore gains less energy and the outlet temperature rise is smaller."
      },
      {
        "heading": "Steady-state assumption",
        "text": "The simple equation assumes a steady state: inlet temperature, outlet temperature and flow rate are stable with time. It also assumes that the useful heater power delivered to the fluid is known."
      },
      {
        "heading": "Heat loss in a real system",
        "text": "If some heater power is lost to surroundings, then P_useful=P_input−P_loss. The useful power, not the electrical input alone, should be equated to ṁcΔT. This is a common multi-step exam problem."
      },
      {
        "heading": "Applications",
        "text": "The same idea applies to domestic water heaters, heat exchangers, industrial process heating, coolant loops and engine radiators. In all cases, energy transferred per second is matched to mass transported per second."
      }
    ],
    "keyIdeas": [
      "ṁ=mass/time",
      "P=ṁcΔT",
      "Higher flow → smaller ΔT at fixed P",
      "Use useful power if losses are given",
      "Steady-state model"
    ],
    "examFocus": "Convert g s⁻¹ to kg s⁻¹ before substitution. If heat loss is given, subtract it from input power before using the flow equation.",
    "summary": [
      "Continuous-flow problems are energy-per-second problems.",
      "Mass flow rate replaces the single mass in the batch equation.",
      "Power, flow rate and temperature rise are directly linked."
    ],
    "retrieval": [
      [
        "What are the units of mass flow rate?",
        "kg s⁻¹."
      ],
      [
        "What happens to ΔT if ṁ doubles at fixed P and c?",
        "It halves."
      ],
      [
        "Why might input electrical power not equal ṁcΔT?",
        "Some power may be lost to the surroundings or apparatus."
      ]
    ]
  },
  "latent-heat": {
    "hook": "During melting, energy can pour into a substance while the thermometer barely moves. The energy has not disappeared—it is being used to reorganise the particles.",
    "hookQuestion": "Where does the supplied energy go during a temperature plateau?",
    "visual": "heating-curve",
    "sections": [
      {
        "heading": "Specific latent heat",
        "text": "Specific latent heat l is the energy required per kilogram to change the state of a substance without changing its temperature. The relationship is Q=ml. Different changes of state have different latent heats, such as fusion and vaporisation."
      },
      {
        "heading": "Why temperature stays constant",
        "text": "Temperature is linked to average random kinetic energy. During a pure phase change at constant pressure, the supplied energy is used to change particle separation and arrangement, increasing the potential-energy contribution to internal energy rather than raising average kinetic energy."
      },
      {
        "heading": "Reading a heating curve",
        "text": "Sloping regions correspond to a single phase warming, so Q=mcΔT applies. Flat regions correspond to a phase change, so Q=ml applies. Energy continues to enter during the flat region even though temperature stays approximately constant."
      },
      {
        "heading": "Multi-stage calculations",
        "text": "Real exam questions often combine several stages: warming a solid, melting it, warming the liquid and perhaps boiling it. Treat each stage separately, calculate each energy contribution and add them to obtain the total."
      },
      {
        "heading": "Constant-power timing",
        "text": "If a heater supplies constant power P, then Q=Pt. During a phase-change plateau, Pt=ml, so the plateau duration can be used to estimate latent heat if mass and useful power are known."
      },
      {
        "heading": "Data-logger investigation",
        "text": "AQA highlights using a temperature sensor and data logger while energy is supplied at a constant rate. A good investigation identifies the phase-change plateau, controls heater power and considers thermal loss, sensor lag and whether the sample is thermally uniform."
      }
    ],
    "keyIdeas": [
      "Q=ml",
      "Plateau: T constant but internal energy rises",
      "Slopes use mcΔT",
      "Plateaus use ml",
      "Multi-stage energy = sum of all stages"
    ],
    "examFocus": "Never apply mcΔT across a phase-change plateau. Split the process and use ml for the constant-temperature state change.",
    "summary": [
      "Latent heat changes state rather than temperature.",
      "Particle potential energy explains the plateau.",
      "Heating curves tell you which equation belongs to each stage."
    ],
    "retrieval": [
      [
        "What happens to average particle KE during melting at constant T?",
        "It stays approximately constant."
      ],
      [
        "Which equation is used on a heating-curve plateau?",
        "Q=ml."
      ],
      [
        "If power is constant, how can plateau time help find l?",
        "Use Pt=ml."
      ]
    ]
  },
  "gas-laws": {
    "hook": "Compress a sealed gas and its pressure rises. Warm it at constant pressure and it expands. Gas laws describe these patterns experimentally before kinetic theory explains why they happen.",
    "hookQuestion": "Which variable must stay constant for each gas law to be valid?",
    "visual": "gas-laws",
    "sections": [
      {
        "heading": "Boyle's law",
        "text": "For a fixed amount of gas at constant temperature, pressure is inversely proportional to volume: p∝1/V and pV=constant. Halving the volume ideally doubles the pressure."
      },
      {
        "heading": "Charles's law",
        "text": "For a fixed amount of gas at constant pressure, volume is directly proportional to absolute temperature: V∝T and V/T=constant. Temperature must be measured in kelvin."
      },
      {
        "heading": "Pressure law",
        "text": "For a fixed amount of gas at constant volume, pressure is directly proportional to absolute temperature: p∝T and p/T=constant."
      },
      {
        "heading": "Combined gas-law reasoning",
        "text": "For a fixed amount of ideal gas, pV/T is constant between states. This allows calculations when pressure, volume and temperature all change. However, always use the simplest specific law when one variable is explicitly constant."
      },
      {
        "heading": "Graph forms",
        "text": "Boyle's law gives a curved p–V graph but a straight p–1/V graph. Charles's law gives a straight V–T(K) graph. The pressure law gives a straight p–T(K) graph. Linearisation is an important A-level practical/data skill."
      },
      {
        "heading": "Molecular explanation",
        "text": "Gas pressure comes from momentum transfer in wall collisions. Reducing volume at constant T increases collision frequency. Raising T increases average molecular kinetic energy and molecular speed, affecting collision frequency and momentum change."
      },
      {
        "heading": "Why conditions matter",
        "text": "A gas compressed quickly may warm, so a Boyle's-law measurement can fail if temperature is not allowed to stabilise. Each experimental gas law only applies when the stated control variables really remain constant."
      }
    ],
    "keyIdeas": [
      "Boyle: pV constant at constant T",
      "Charles: V/T constant at constant p",
      "Pressure law: p/T constant at constant V",
      "Use kelvin",
      "Linearise relationships"
    ],
    "examFocus": "State the controlled variable when naming a gas law. A correct proportionality without the required condition can lose marks.",
    "summary": [
      "Gas laws are empirical relationships.",
      "Each law requires specific variables to be held constant.",
      "Kinetic theory later explains the same trends microscopically."
    ],
    "retrieval": [
      [
        "What must remain constant for Boyle's law?",
        "Temperature and amount of gas."
      ],
      [
        "Why is kelvin used in Charles's law?",
        "Direct proportionality is with absolute temperature."
      ],
      [
        "What graph linearises Boyle's law?",
        "p against 1/V."
      ]
    ]
  },
  "absolute-zero": {
    "hook": "The kelvin scale is not just Celsius with a different label. Its zero is chosen so that gas-law proportionalities and microscopic energy relationships have a natural physical origin.",
    "hookQuestion": "Why does using 20°C and 40°C as a ratio give physically misleading results?",
    "visual": "absolute-zero",
    "sections": [
      {
        "heading": "The kelvin scale",
        "text": "Absolute temperature T is measured in kelvin. The conversion is T/K=θ/°C+273.15. A change of 1 K is the same size as a change of 1°C, but the zero points are different."
      },
      {
        "heading": "Meaning of absolute zero",
        "text": "Absolute zero is 0 K, corresponding to −273.15°C. It is the lower limit of the thermodynamic temperature scale. In the classical ideal-gas model, mean translational kinetic energy tends toward zero with temperature."
      },
      {
        "heading": "Why Celsius ratios fail",
        "text": "Celsius zero is historically chosen from water's freezing point, not from zero thermal energy scale. Therefore 40°C is not twice the absolute temperature of 20°C. The correct ratio is 313 K/293 K, only about 1.07."
      },
      {
        "heading": "Gas-law extrapolation",
        "text": "If a gas is kept at constant pressure and V is plotted against Celsius temperature, the straight-line trend extrapolates toward zero volume near −273°C. Similarly, at constant volume, pressure extrapolates toward zero near the same temperature."
      },
      {
        "heading": "Limits of extrapolation",
        "text": "Real gases do not remain ideal down to absolute zero: they condense or freeze before that point. The extrapolation is evidence for the scale, not a literal claim that a real gas can be cooled while remaining ideal all the way to zero volume."
      }
    ],
    "keyIdeas": [
      "T(K)=θ(°C)+273.15",
      "0 K=−273.15°C",
      "Gas-law ratios require kelvin",
      "1 K interval = 1°C interval",
      "Extrapolation is model-based"
    ],
    "examFocus": "Convert to kelvin before using any temperature ratio. Do not say particles simply 'stop moving' as an unqualified description of real matter at 0 K.",
    "summary": [
      "Kelvin has a physically meaningful zero.",
      "Absolute temperature is essential for proportional gas laws.",
      "Gas extrapolation motivates the idea but real gases cease to behave ideally at low temperature."
    ],
    "retrieval": [
      [
        "What is 27°C in kelvin approximately?",
        "300 K."
      ],
      [
        "Why can ΔT be quoted in K or °C with the same numerical value?",
        "The interval sizes are equal."
      ],
      [
        "Why cannot a real gas simply be followed to zero volume at 0 K?",
        "It condenses/freezes and stops behaving ideally first."
      ]
    ]
  },
  "ideal-gas-moles": {
    "hook": "The ideal-gas equation compresses four macroscopic properties—pressure, volume, amount and temperature—into one relationship. It lets you move from what you can measure in the lab to how much gas is actually present.",
    "hookQuestion": "Why does the equation need absolute temperature and SI units?",
    "visual": "ideal-gas-moles",
    "sections": [
      {
        "heading": "The equation of state",
        "text": "For an ideal gas, pV=nRT. Pressure p is in pascals, volume V in m³, amount n in mol and temperature T in kelvin. R is the molar gas constant, approximately 8.31 J mol⁻¹ K⁻¹."
      },
      {
        "heading": "What a mole means",
        "text": "A mole is an amount containing Avogadro's number of specified particles. Using moles allows a sample containing an enormous number of molecules to be described with a manageable macroscopic quantity."
      },
      {
        "heading": "Mass and molar mass",
        "text": "If a gas mass m and molar mass M are known, n=m/M. Units must be consistent: if mass is in kilograms, molar mass should be in kg mol⁻¹. Alternatively, grams and g mol⁻¹ may be used together for the mole conversion before converting other quantities to SI."
      },
      {
        "heading": "Unit consistency",
        "text": "The product pV has units Pa m³, which are equivalent to joules. This is consistent with nRT because R has units J mol⁻¹ K⁻¹. Volume conversion is a frequent source of mistakes: 1 dm³=10⁻³ m³ and 1 cm³=10⁻⁶ m³."
      },
      {
        "heading": "Ideal-gas assumptions",
        "text": "An ideal gas is a model. Molecules are treated as occupying negligible volume compared with the container and intermolecular forces are neglected except during collisions. Real gases behave most ideally at low density and away from condensation."
      },
      {
        "heading": "Choosing a method",
        "text": "If two states of the same fixed gas are compared, a gas-law ratio may be quickest. If the amount n is given or required, or an absolute state value is needed, pV=nRT is usually the direct route."
      }
    ],
    "keyIdeas": [
      "pV=nRT",
      "R≈8.31 J mol⁻¹ K⁻¹",
      "n=m/M",
      "Use Pa, m³ and K",
      "Ideal gas is a model"
    ],
    "examFocus": "Write unit conversions before substitution. cm³-to-m³ errors can change an answer by a factor of one million.",
    "summary": [
      "The ideal-gas equation links measurable state variables.",
      "Moles connect sample mass to particle amount.",
      "Careful unit handling is essential."
    ],
    "retrieval": [
      [
        "What is the SI unit of volume in pV=nRT?",
        "m³."
      ],
      [
        "What equation converts mass to moles?",
        "n=m/M."
      ],
      [
        "When do real gases behave most ideally?",
        "At relatively low density and away from condensation."
      ]
    ]
  },
  "ideal-gas-molecules": {
    "hook": "The same gas can be described on two scales: by moles in the laboratory or by individual molecules in kinetic theory. Boltzmann's constant is the bridge between temperature and energy per particle.",
    "hookQuestion": "How do pV=nRT and pV=NkT describe exactly the same gas?",
    "visual": "ideal-gas-particles",
    "sections": [
      {
        "heading": "The molecular form",
        "text": "The ideal-gas equation can be written pV=NkT, where N is the number of molecules and k is the Boltzmann constant, approximately 1.38×10⁻²³ J K⁻¹."
      },
      {
        "heading": "From moles to particles",
        "text": "The number of particles is N=nN_A, where N_A is the Avogadro constant, approximately 6.02×10²³ mol⁻¹. One mole contains N_A specified entities."
      },
      {
        "heading": "Connecting R and k",
        "text": "Substitute N=nN_A into pV=NkT. This gives pV=nN_AkT. Comparing with pV=nRT shows that R=N_Ak. R is therefore the per-mole version of the per-particle constant k."
      },
      {
        "heading": "Molar mass and molecular mass",
        "text": "If molar mass is M in kg mol⁻¹, the mass of one molecule is m₀=M/N_A. This conversion is crucial in rms-speed and kinetic-theory calculations."
      },
      {
        "heading": "Choosing the correct constant",
        "text": "Use R when the amount is in moles. Use k when the number of particles is given or when working with energy per molecule. Mixing n with k or N with R is a common exam error."
      },
      {
        "heading": "Scale of the numbers",
        "text": "Particle counts are enormous and k is extremely small, so scientific notation is unavoidable. Keep powers of ten separate during calculations and check that the result has a realistic order of magnitude."
      }
    ],
    "keyIdeas": [
      "pV=NkT",
      "N=nN_A",
      "R=N_Ak",
      "molecule mass=M/N_A",
      "Use R with moles, k with particles"
    ],
    "examFocus": "Check whether the question gives n or N before choosing the equation. Distinguish lower-case n (moles) from capital N (particles).",
    "summary": [
      "The molar and molecular gas equations are equivalent.",
      "Avogadro's constant connects the two scales.",
      "Boltzmann's constant is an energy-per-particle temperature constant."
    ],
    "retrieval": [
      [
        "What does N represent?",
        "Number of particles/molecules."
      ],
      [
        "What is the relation between R and k?",
        "R=N_Ak."
      ],
      [
        "How do you find the mass of one molecule from molar mass?",
        "Divide the molar mass in kg mol⁻¹ by N_A."
      ]
    ]
  },
  "rp8-boyle": {
    "hook": "Boyle's law is not just an equation to memorise—it is an experimentally testable inverse relationship. Required Practical 8 asks you to collect evidence that pressure changes exactly as the model predicts when volume is varied at constant temperature.",
    "hookQuestion": "How can a curved relationship be transformed into a straight-line test?",
    "visual": "boyle-apparatus",
    "sections": [
      {
        "heading": "Aim and variables",
        "text": "The aim is to investigate pressure p and volume V for a fixed amount of gas at constant temperature. Volume is the independent variable and pressure is the dependent variable. Temperature and amount of gas must be controlled."
      },
      {
        "heading": "Method",
        "text": "Trap a fixed quantity of gas in a syringe, tube or Boyle's-law apparatus. Change the gas volume in steps and record the corresponding pressure. Adjust slowly and allow time for the gas to return to thermal equilibrium before each reading."
      },
      {
        "heading": "Why temperature control matters",
        "text": "Rapid compression does work on the gas and can raise its temperature, while rapid expansion can cool it. Since Boyle's law assumes constant T, readings taken before thermal equilibration can systematically depart from pV=constant."
      },
      {
        "heading": "Processing the data",
        "text": "Calculate pV for each pair of measurements and look for constancy. For stronger graphical evidence, calculate 1/V and plot p against 1/V. Since p=K(1/V), a straight line is expected and its gradient represents the Boyle constant K=pV."
      },
      {
        "heading": "Uncertainty and evaluation",
        "text": "Important issues include pressure-sensor zero/calibration, volume scale resolution, dead volume in connecting tubes, leaks, parallax and temperature drift. Repeats and a wide range of V improve confidence in the relationship."
      },
      {
        "heading": "What good evidence looks like",
        "text": "A smooth p–V curve is not enough on its own. A well-linearised p–1/V graph with points close to a best-fit straight line and an intercept consistent with the experimental uncertainty provides stronger evidence."
      }
    ],
    "keyIdeas": [
      "Fixed gas amount",
      "Constant temperature",
      "pV≈constant",
      "Plot p against 1/V",
      "Slow changes reduce temperature error"
    ],
    "examFocus": "In an RP8 evaluation, link each error to its effect. For example: rapid compression raises T, producing a pressure larger than the constant-temperature model predicts.",
    "summary": [
      "Boyle's law must be tested under controlled temperature.",
      "Linearisation turns the inverse law into a straight-line test.",
      "Practical quality depends on sensor, volume and temperature control."
    ],
    "retrieval": [
      [
        "Why should the piston be moved slowly?",
        "To reduce temperature changes and allow thermal equilibrium."
      ],
      [
        "What is the best linearised graph?",
        "p against 1/V."
      ],
      [
        "What can a non-zero intercept indicate?",
        "Systematic error, dead volume or other departure from the ideal model."
      ]
    ]
  },
  "rp8-charles": {
    "hook": "Charles's law links volume to absolute temperature. Required Practical 8 makes that abstract proportionality visible by watching a gas expand as it warms.",
    "hookQuestion": "Why must the gas be given time to reach the bath temperature before its volume is read?",
    "visual": "charles-apparatus",
    "sections": [
      {
        "heading": "Aim and variables",
        "text": "The aim is to investigate volume V and absolute temperature T for a fixed amount of gas at constant pressure. Temperature is varied while gas volume is measured."
      },
      {
        "heading": "Practical method",
        "text": "A trapped gas sample is placed in water baths at different temperatures. At each temperature, allow sufficient time for thermal equilibrium before measuring gas volume. Pressure must remain approximately constant."
      },
      {
        "heading": "Kelvin is essential",
        "text": "Charles's law states V∝T where T is absolute temperature. Convert every Celsius reading to kelvin before calculating V/T or making the proportionality graph."
      },
      {
        "heading": "Graphing the result",
        "text": "Plot V against T in kelvin. Ideal data should lie close to a straight line and extrapolate toward the origin. If plotted against Celsius temperature instead, the line extrapolates toward V=0 near −273°C."
      },
      {
        "heading": "Sources of uncertainty",
        "text": "Thermometer calibration, thermal lag, volume-reading resolution, parallax, leaks and failure to keep pressure constant can all affect the result. A water bath improves temperature control because it surrounds the gas with a nearly uniform temperature environment."
      },
      {
        "heading": "Interpreting extrapolation",
        "text": "The line toward −273°C supports the concept of absolute zero, but real gases would condense before they reached zero volume. The extrapolation belongs to the idealised relationship."
      }
    ],
    "keyIdeas": [
      "Constant pressure",
      "V/T≈constant",
      "Use kelvin",
      "Wait for thermal equilibrium",
      "V–T(K) should be linear"
    ],
    "examFocus": "If the graph is against °C, do not call it a direct-proportionality graph. Direct proportionality is only obtained with absolute temperature.",
    "summary": [
      "Charles's law is a temperature-volume proportionality.",
      "Thermal equilibrium and constant pressure are the key controls.",
      "The experiment provides a route to the idea of absolute zero."
    ],
    "retrieval": [
      [
        "What must remain constant?",
        "Pressure and amount of gas."
      ],
      [
        "Why is a water bath useful?",
        "It controls and equalises the gas temperature."
      ],
      [
        "What should V/T do for ideal data?",
        "Remain approximately constant."
      ]
    ]
  },
  "brownian-model": {
    "hook": "Long before atoms could be imaged directly, tiny suspended particles were seen jittering unpredictably. That motion became powerful evidence that invisible molecules were continually colliding with them.",
    "hookQuestion": "Why does a large visible particle move randomly if the surrounding fluid looks perfectly still?",
    "visual": "brownian",
    "sections": [
      {
        "heading": "The observation",
        "text": "A small visible particle suspended in a fluid follows an irregular, constantly changing path. The motion persists even when there is no bulk flow of the fluid."
      },
      {
        "heading": "The molecular explanation",
        "text": "The visible particle is struck by a huge number of much smaller molecules. At any instant the impacts are not perfectly balanced, so the particle experiences a fluctuating resultant force and changes direction randomly."
      },
      {
        "heading": "Evidence for atoms and molecules",
        "text": "Brownian motion provided important evidence that matter is made from particles in continuous random motion. The observed particle is not itself a single molecule; it is much larger and acts as a visible tracer of molecular impacts."
      },
      {
        "heading": "Pressure from collisions",
        "text": "The same collision picture explains gas pressure. When molecules hit a container wall and rebound, their momentum changes. The wall exerts a force on the molecules, and by Newton's third law the molecules exert a force on the wall. Force per unit area is pressure."
      },
      {
        "heading": "Explaining gas-law trends",
        "text": "At higher temperature, molecules have greater mean translational kinetic energy and generally move faster. At smaller volume, they reach the walls more often. These microscopic changes explain why pressure changes with T and V."
      },
      {
        "heading": "Empirical laws versus theory",
        "text": "Boyle's and Charles's laws were established from measurements, so they are empirical. Kinetic theory is a theoretical model that explains why those measured relationships occur and predicts further microscopic relationships."
      }
    ],
    "keyIdeas": [
      "Brownian tracer is larger than molecules",
      "Random bombardment causes irregular motion",
      "Pressure comes from momentum transfer",
      "Gas laws are empirical",
      "Kinetic theory is explanatory theory"
    ],
    "examFocus": "For gas-pressure explanations, mention both molecular collisions and momentum transfer. 'Particles hit the walls' alone is often too vague for full marks.",
    "summary": [
      "Brownian motion reveals invisible molecular motion.",
      "Momentum transfer connects microscopic collisions to macroscopic pressure.",
      "Kinetic theory explains the previously measured gas laws."
    ],
    "retrieval": [
      [
        "Is a visible Brownian particle one molecule?",
        "No, it is much larger."
      ],
      [
        "What causes gas pressure microscopically?",
        "Momentum transfer when molecules collide with walls."
      ],
      [
        "What is meant by an empirical law?",
        "A relationship established from experimental observations."
      ]
    ]
  },
  "kinetic-assumptions": {
    "hook": "The kinetic-theory equation looks complicated, but every part comes from one simple idea: repeated elastic collisions transfer momentum to the container walls.",
    "hookQuestion": "Where does the factor of one third in pV=(1/3)Nm<c²> come from?",
    "visual": "kinetic-box",
    "sections": [
      {
        "heading": "Ideal-gas model assumptions",
        "text": "Molecules are treated as tiny compared with their separations, moving randomly and obeying Newtonian mechanics. Intermolecular forces are neglected except during brief collisions, and collisions with walls and other molecules are treated as elastic."
      },
      {
        "heading": "One collision with a wall",
        "text": "Consider a molecule of mass m with velocity component c_x perpendicular to a wall. An elastic collision reverses that component from +c_x to −c_x. The magnitude of the momentum change is therefore 2mc_x."
      },
      {
        "heading": "How often the molecule returns",
        "text": "For a cubic container of side L, the molecule must travel to the opposite wall and back before hitting the same wall again. The distance is 2L, so the time between same-wall collisions is 2L/c_x."
      },
      {
        "heading": "From momentum change to force",
        "text": "Average force equals momentum change divided by time. Combining 2mc_x with 2L/c_x gives a force contribution mc_x²/L from that molecule. Summing over all molecules gives the total average wall force."
      },
      {
        "heading": "From force to pressure",
        "text": "Pressure is force divided by wall area L². Using container volume V=L³ gives an expression involving the average of c_x² across all molecules."
      },
      {
        "heading": "Why the factor one third appears",
        "text": "Random motion has no preferred direction. In three dimensions, the mean-square speed is shared equally between x, y and z components, so <c_x²>=<c²>/3. Substituting this produces pV=(1/3)Nm<c²>."
      },
      {
        "heading": "RMS speed",
        "text": "The root mean square speed is c_rms=√<c²>. It is not the same as the mean velocity, which is approximately zero in an equilibrium gas because velocities in opposite directions cancel."
      }
    ],
    "keyIdeas": [
      "Elastic wall collision: |Δp|=2mc_x",
      "Same-wall time=2L/c_x",
      "Force=rate of momentum change",
      "Isotropy gives 1/3",
      "c_rms=√<c²>"
    ],
    "examFocus": "In the derivation, the 1/3 factor must be explained using three-dimensional random motion. Do not say 'one third of the molecules move in each direction'—the key statement is about mean-square velocity components.",
    "summary": [
      "The pressure equation is built from Newtonian mechanics and collisions.",
      "The factor one third comes from isotropic random motion.",
      "RMS speed is the useful speed measure because squared components appear in the pressure equation."
    ],
    "retrieval": [
      [
        "What is the momentum-change magnitude in a normal elastic wall collision?",
        "2mc_x."
      ],
      [
        "What is the same-wall collision interval in a cube?",
        "2L/c_x."
      ],
      [
        "Why is mean velocity near zero while rms speed is not?",
        "Opposite velocity vectors cancel in the mean, but squared speeds are all positive."
      ]
    ]
  },
  "molecular-ke": {
    "hook": "Temperature finally gains a microscopic meaning here: it becomes directly proportional to the average translational kinetic energy of each ideal-gas molecule.",
    "hookQuestion": "Why can two gases at the same temperature have the same mean kinetic energy but different molecular speeds?",
    "visual": "molecular-ke",
    "sections": [
      {
        "heading": "Combining two gas equations",
        "text": "Kinetic theory gives pV=(1/3)Nm<c²>, while the molecular ideal-gas equation gives pV=NkT. Since both equal the same pV, their right-hand sides can be equated."
      },
      {
        "heading": "Mean kinetic energy relation",
        "text": "Cancelling N gives (1/3)m<c²>=kT. Multiplying by 3/2 gives ½m<c²>=3/2 kT. The left-hand side is the mean translational kinetic energy per molecule."
      },
      {
        "heading": "Microscopic meaning of temperature",
        "text": "For an ideal gas, mean translational kinetic energy is directly proportional to absolute temperature. Doubling T doubles the mean translational kinetic energy per molecule."
      },
      {
        "heading": "RMS speed and molecular mass",
        "text": "Since c_rms=√<c²>, the relation gives c_rms=√(3kT/m). At the same temperature, heavier molecules must have lower rms speed than lighter molecules because the mean kinetic energy is the same."
      },
      {
        "heading": "Internal energy of a monatomic ideal gas",
        "text": "For a monatomic ideal gas, intermolecular potential energy is neglected and the atoms have translational kinetic energy. The total internal energy is therefore U=(3/2)NkT=(3/2)nRT."
      },
      {
        "heading": "What changes when temperature changes",
        "text": "At fixed amount of monatomic ideal gas, internal energy depends only on absolute temperature in this model. A temperature increase means a proportional increase in mean molecular kinetic energy and total internal energy."
      },
      {
        "heading": "Limits and interpretation",
        "text": "The simple 3/2 relation applies to translational kinetic energy. More complex molecules can possess rotational and vibrational energy modes, so the full internal-energy behaviour of real gases can be more complicated than the monatomic ideal model."
      }
    ],
    "keyIdeas": [
      "mean KE=3/2 kT",
      "c_rms=√(3kT/m)",
      "Same T → same mean translational KE",
      "Lighter molecules move faster at same T",
      "Monatomic ideal gas: U=3/2 nRT"
    ],
    "examFocus": "When comparing gases at the same temperature, state 'same mean translational kinetic energy', not 'same molecular speed'.",
    "summary": [
      "Temperature has a direct microscopic energy interpretation.",
      "Molecular mass determines how that energy translates into speed.",
      "The monatomic ideal-gas internal energy follows directly from the per-particle kinetic energy."
    ],
    "retrieval": [
      [
        "What happens to mean molecular KE if T doubles?",
        "It doubles."
      ],
      [
        "At the same T, which has larger rms speed: lighter or heavier molecules?",
        "Lighter molecules."
      ],
      [
        "What is U for a monatomic ideal gas?",
        "U=3/2 nRT or 3/2 NkT."
      ]
    ]
  }
});