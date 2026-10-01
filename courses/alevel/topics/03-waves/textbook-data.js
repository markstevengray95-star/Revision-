window.WAVES_TEXTBOOK = [
  {
    id:"progressive", code:"3.3.1.1", title:"Progressive waves", icon:"wave",
    summary:"Build the mathematical and physical language used throughout the Waves topic.",
    spec:["Oscillation of particles in a medium","Amplitude, frequency, wavelength and speed","Phase and phase difference","Wave equation and period relationship"],
    sections:[
      {h:"What a progressive wave is",p:"A progressive wave is a travelling disturbance that transfers energy from one place to another. In a mechanical wave, particles of the medium oscillate about equilibrium positions; the particles do not travel with the wave overall. Electromagnetic waves do not require a material medium."},
      {h:"Wave quantities",p:"Amplitude A is the maximum displacement from equilibrium. Wavelength λ is the shortest distance between two points in the same phase. Frequency f is the number of complete oscillations per second. Period T is the time for one complete oscillation. Wave speed v is the speed at which a point of constant phase moves through space.",eq:["f = 1/T","v = fλ"]},
      {h:"Phase",p:"Phase describes the stage of an oscillation. Two points are in phase if they have the same displacement and move in the same direction. One complete cycle is 360° or 2π rad. A separation Δx along a sinusoidal wave corresponds to a phase difference 2πΔx/λ. A time delay Δt corresponds to 2πΔt/T.",eq:["Δφ = 2π(Δx/λ)","Δφ = 2π(Δt/T)"]},
      {h:"Changing medium",p:"The source fixes the frequency. When a wave crosses a boundary into a medium in which its speed changes, its frequency stays constant, so its wavelength changes according to v = fλ."}
    ],
    example:{q:"A sound wave of frequency 680 Hz has speed 340 m s⁻¹. Find its wavelength and the phase difference between points 0.125 m apart.",steps:["λ = v/f = 340/680 = 0.500 m.","Δx/λ = 0.125/0.500 = 0.250 cycles.","Δφ = 2π × 0.250 = π/2 rad = 90°."],answer:"λ = 0.500 m; phase difference = π/2 rad."},
    exam:["Do not confuse particle velocity with wave speed.","For phase, state both displacement and direction of motion when explaining 'in phase'.","Convert nm, μm and mm to metres before substituting into SI equations."]
  },
  {
    id:"types", code:"3.3.1.2", title:"Transverse, longitudinal and polarisation", icon:"polarisation",
    summary:"Connect particle or field oscillation direction to energy propagation, then use polarisation as evidence for transverse waves.",
    spec:["Transverse and longitudinal wave nature","Sound, EM waves and waves on strings","Direction of displacement versus energy transfer","Polarisation and applications","Aligned transmitting and receiving aerials"],
    sections:[
      {h:"Transverse waves",p:"In a transverse wave the oscillation is perpendicular to the direction of energy propagation. Waves on a stretched string and all electromagnetic waves are transverse. For an electromagnetic wave, electric and magnetic fields oscillate perpendicular to the direction of travel."},
      {h:"Longitudinal waves",p:"In a longitudinal wave the oscillation is parallel to the direction of propagation. Sound in air is a key example. Regions of compression have particles closer together and higher pressure; rarefactions have particles farther apart and lower pressure."},
      {h:"Electromagnetic waves",p:"All electromagnetic waves travel at the same speed in a vacuum, c ≈ 3.00 × 10⁸ m s⁻¹. Their frequency and wavelength vary, but c = fλ in a vacuum."},
      {h:"Polarisation",p:"A polariser restricts a transverse oscillation to one plane. The ability to polarise electromagnetic waves is evidence that they are transverse. Longitudinal waves cannot be plane-polarised in the same way because their oscillations are along the direction of travel."},
      {h:"Applications",p:"Polaroid filters can reduce glare and select an orientation of light. Radio or microwave transmission is strongest when the receiving aerial is aligned with the transmitted electric-field polarisation. AQA requires the qualitative behaviour here; Malus's law is not required."}
    ],
    example:{q:"A receiving aerial is rotated through 90° relative to a linearly polarised transmitter. Explain the change in received signal.",steps:["The transmitted EM wave is transverse and has a fixed electric-field oscillation direction.","The aerial responds most strongly when aligned with that field.","At 90° alignment the coupling is greatly reduced, so the received signal falls."],answer:"The change is explained by polarisation and aerial alignment."},
    exam:["Use 'perpendicular' and 'parallel' precisely.","Do not describe sound in air using crests and troughs; use compressions and rarefactions.","Do not use Malus's law unless it is supplied in a question."]
  },
  {
    id:"stationary", code:"3.3.1.3", title:"Superposition and stationary waves", icon:"standing",
    summary:"Explain how overlapping waves add and how two opposite travelling waves form a stationary pattern.",
    spec:["Principle of superposition","Stationary waves","Nodes and antinodes on strings","Formation from equal-frequency opposite waves","Graphical explanation","Harmonics on strings","Microwave and sound stationary waves"],
    sections:[
      {h:"Principle of superposition",p:"When two or more waves overlap, the resultant displacement at a point is the vector sum of the individual displacements at that instant. After overlap, progressive waves continue travelling unchanged in an ideal linear medium."},
      {h:"Constructive and destructive addition",p:"Waves arriving in phase reinforce. Waves arriving in antiphase oppose one another. For equal amplitudes, complete destructive interference gives zero resultant displacement at that instant."},
      {h:"Formation of a stationary wave",p:"A stationary wave forms when two waves of the same frequency travel in opposite directions and continuously superpose. On a string this commonly occurs because a travelling wave reflects from a boundary."},
      {h:"Nodes and antinodes",p:"A node has zero displacement at all times. An antinode has maximum oscillation amplitude. Adjacent nodes are λ/2 apart; a node and its nearest antinode are λ/4 apart. Energy is not transported along the stationary pattern in the same way as in a progressive wave."},
      {h:"Harmonics on a string",p:"For a string fixed at both ends, the ends are nodes. The allowed modes contain an integer number of half-wavelengths in length L.",eq:["L = nλ/2","λₙ = 2L/n","fₙ = nv/(2L)"]},
      {h:"Stretched-string speed",p:"The wave speed on an ideal stretched string increases with tension T and decreases with mass per unit length μ.",eq:["v = √(T/μ)","fₙ = n/(2L) √(T/μ)"]}
    ],
    example:{q:"A 1.20 m string has tension 18.0 N and μ = 5.00 × 10⁻³ kg m⁻¹. Find the second-harmonic frequency.",steps:["v = √(T/μ) = √(18.0 / 0.00500) = 60.0 m s⁻¹.","For n = 2, f₂ = nv/(2L).","f₂ = 2 × 60.0 /(2 × 1.20) = 50.0 Hz."],answer:"Second harmonic frequency = 50.0 Hz."},
    exam:["AQA uses harmonic language for strings; do not rely on 'overtone' terminology.","A node is not a point where particles stop permanently; it is a fixed position of zero oscillation amplitude.","When explaining formation, mention same frequency, opposite directions and superposition."]
  },
  {
    id:"interference", code:"3.3.2.1", title:"Interference and Young’s double slit", icon:"interference",
    summary:"Move from path difference and coherence to measurable fringe spacing.",
    spec:["Path difference","Coherence","Interference with laser light","Young's double-slit experiment","Fringe spacing","White-light interference","Interference with sound and EM waves","Laser safety awareness"],
    sections:[
      {h:"Coherence",p:"For a stable interference pattern, the sources must have the same frequency and a constant phase difference. Two slits illuminated by the same monochromatic source act as coherent secondary sources."},
      {h:"Path difference",p:"The path difference is the difference between the distances travelled by the two waves to a point. Constructive interference occurs for path difference nλ. Destructive interference occurs for (n + 1/2)λ when the waves begin in phase.",eq:["constructive: Δ = nλ","destructive: Δ = (n + 1/2)λ"]},
      {h:"Young’s double slit",p:"Monochromatic light passes through two closely spaced slits. The diffracted waves overlap and create alternating bright and dark fringes. Bright fringes occur where the path difference is an integer number of wavelengths."},
      {h:"Fringe spacing",p:"For small angles, adjacent bright fringes are approximately equally spaced. If slit separation is s, screen distance is D and wavelength is λ, fringe spacing w is:",eq:["w = λD/s"]},
      {h:"White light",p:"At zero path difference all visible wavelengths reinforce, producing a central white fringe. Away from the centre, different wavelengths satisfy constructive conditions at different positions, so coloured fringes separate and overlap."},
      {h:"Sound and microwaves",p:"The same interference principles apply to all waves. Two coherent loudspeakers or microwave transmitters can produce positions of maxima and minima as path difference changes."}
    ],
    example:{q:"A laser of wavelength 632.8 nm illuminates slits separated by 0.400 mm. A screen is 2.50 m away. Find the fringe spacing.",steps:["Convert: λ = 6.328 × 10⁻⁷ m and s = 4.00 × 10⁻⁴ m.","w = λD/s.","w = (6.328 × 10⁻⁷ × 2.50)/(4.00 × 10⁻⁴) = 3.96 × 10⁻³ m."],answer:"Fringe spacing = 3.96 mm."},
    exam:["State coherence as constant phase difference, not simply 'in phase'.","Use centre-to-centre fringe distances.","Measuring across several fringes and dividing reduces percentage uncertainty."]
  },
  {
    id:"diffraction", code:"3.3.2.2", title:"Diffraction and diffraction gratings", icon:"diffraction",
    summary:"Understand spreading at an aperture, then use a grating to make precise wavelength measurements.",
    spec:["Single-slit monochromatic and white-light patterns","Effect of wavelength and slit width","Plane transmission diffraction grating","Normal incidence","d sinθ = nλ and its derivation","Applications of diffraction gratings"],
    sections:[
      {h:"What diffraction means",p:"Diffraction is the spreading of waves when they pass through a gap or around an obstacle. The effect becomes more significant when the gap size is comparable with the wavelength."},
      {h:"Single-slit pattern",p:"Monochromatic light through a single narrow slit produces a broad central maximum with weaker side maxima. The central maximum becomes wider when wavelength increases or slit width decreases. AQA requires a qualitative treatment of this width variation; an intensity-versus-angle graph is not required."},
      {h:"White light through a slit",p:"Different wavelengths diffract by different amounts. Red light, with longer wavelength than blue, spreads through larger angles, so coloured edges appear away from the central white region."},
      {h:"Diffraction grating",p:"A grating has many equally spaced parallel slits. Interference from the large number of coherent waves creates narrow principal maxima. If line density is N lines per metre, slit spacing d = 1/N.",eq:["d = 1/N","d sinθ = nλ"]},
      {h:"Why d sinθ = nλ",p:"For rays emerging at angle θ from adjacent slits separated by d, the path difference is d sinθ. A principal maximum occurs when this equals an integer number n of wavelengths."},
      {h:"Orders and limits",p:"The central maximum is n = 0. Higher orders occur symmetrically on both sides. Because |sinθ| ≤ 1, only orders satisfying nλ ≤ d are physically possible."},
      {h:"Applications",p:"Diffraction gratings separate wavelengths very precisely and are used in spectroscopy to identify atomic emission or absorption features and to measure wavelength."}
    ],
    example:{q:"A grating has 600 lines mm⁻¹. Light of wavelength 589 nm is incident normally. Find the first-order angle.",steps:["600 lines mm⁻¹ = 6.00 × 10⁵ lines m⁻¹.","d = 1/N = 1.667 × 10⁻⁶ m.","sinθ = λ/d = 5.89 × 10⁻⁷ / 1.667 × 10⁻⁶ = 0.3534.","θ = 20.7°."],answer:"First-order angle ≈ 20.7°."},
    exam:["Convert lines per mm into lines per metre before finding d.","Check that nλ/d ≤ 1 before taking sin⁻¹.","The spectrometer procedure itself is not a tested requirement in this section, but angle measurement and uncertainty remain useful practical skills."]
  },
  {
    id:"refraction", code:"3.3.2.3", title:"Refraction and total internal reflection", icon:"refraction",
    summary:"Connect refractive index to wave speed and use Snell’s law and the critical-angle condition.",
    spec:["Refractive index","Air approximately n = 1","Snell's law","Total internal reflection","Critical angle"],
    sections:[
      {h:"Refractive index and speed",p:"Refractive index n compares the speed of light in vacuum c with its speed v in a material. A larger n means light travels more slowly in the material.",eq:["n = c/v"]},
      {h:"Why refraction occurs",p:"When light crosses a boundary, its frequency remains unchanged because the oscillations must match at the boundary. If speed changes, wavelength changes. The change in direction is refraction."},
      {h:"Snell’s law",p:"Angles are measured from the normal. For a ray going from medium 1 to medium 2:",eq:["n₁ sinθ₁ = n₂ sinθ₂"]},
      {h:"Towards or away from the normal",p:"Entering a higher-index medium causes the ray to bend towards the normal. Entering a lower-index medium causes it to bend away from the normal."},
      {h:"Total internal reflection",p:"TIR can occur only when light travels from a higher refractive index to a lower refractive index. At the critical angle θc, the refracted ray is at 90° to the normal. For larger incidence angles, all the ray is internally reflected in the ideal model.",eq:["sinθc = n₂/n₁  (n₁ > n₂)"]}
    ],
    example:{q:"Glass has n = 1.52 and is surrounded by air. Find its critical angle.",steps:["n₁ = 1.52, n₂ ≈ 1.00.","sinθc = n₂/n₁ = 1/1.52 = 0.6579.","θc = sin⁻¹(0.6579) = 41.1°."],answer:"Critical angle ≈ 41.1°."},
    exam:["Always measure angles from the normal.","TIR needs both a high-to-low index boundary and incidence angle greater than the critical angle.","Do not say frequency changes at a boundary."]
  },
  {
    id:"fibres", code:"3.3.2.3", title:"Optical fibres, dispersion and absorption", icon:"fibre",
    summary:"Explain how step-index fibres guide light and why real pulses broaden and lose energy.",
    spec:["Step-index optical fibres","Function of cladding","Material dispersion","Modal dispersion","Pulse broadening","Absorption"],
    sections:[
      {h:"Step-index fibre structure",p:"A step-index fibre has a core with refractive index higher than the surrounding cladding. Rays within the acceptance conditions can undergo repeated total internal reflection at the core-cladding boundary."},
      {h:"Why cladding is needed",p:"Cladding provides a controlled lower refractive index around the core, protects the core surface and helps prevent signals leaking into neighbouring fibres. The core-cladding index difference also affects the range of guided paths."},
      {h:"Modal dispersion",p:"In a multimode fibre, different rays follow paths of different length. They therefore arrive at different times, broadening the pulse. Modal dispersion can be reduced by using a single-mode fibre with a sufficiently narrow core."},
      {h:"Material dispersion",p:"Refractive index depends slightly on wavelength. A pulse containing a range of wavelengths therefore has components travelling at different speeds. A more monochromatic source reduces material dispersion."},
      {h:"Pulse broadening",p:"Pulse broadening limits the maximum data rate because neighbouring pulses can overlap and become difficult to distinguish. A receiver needs enough time separation between pulses to decode the signal reliably."},
      {h:"Absorption",p:"Some optical energy is absorbed by the fibre material and converted to internal energy. Signal intensity therefore decreases with distance. Repeaters or optical amplifiers may be required over long links."}
    ],
    example:{q:"Explain two ways a fibre system can reduce pulse broadening.",steps:["Use a single-mode fibre to reduce the spread of path lengths, reducing modal dispersion.","Use a narrow-band/near-monochromatic source so wavelengths have similar speeds, reducing material dispersion.","Both changes reduce the spread of arrival times at the receiver."],answer:"Reduce modal dispersion and material dispersion by controlling modes and wavelength range."},
    exam:["Keep absorption and dispersion separate: absorption reduces signal amplitude; dispersion broadens pulses.","AQA limits this treatment to step-index fibres.","When discussing data rate, link pulse broadening to pulse overlap."]
  },
  {
    id:"practicals", code:"RP1 + RP2", title:"Required practicals and practical analysis", icon:"practical",
    summary:"Know the physics, variables, graph choices, uncertainty thinking and evaluation behind the two Waves required practicals.",
    spec:["RP1 stationary-wave frequency versus length, tension and μ","RP2 Young’s slits","RP2 diffraction grating","AT a, b, c, i and j skills"],
    sections:[
      {h:"Required Practical 1: stationary waves",p:"Investigate how the frequency of a stationary wave on a string varies with string length L, tension T and mass per unit length μ. A vibration generator or similar source drives the string. Resonant stationary patterns are identified by clear nodes and antinodes.",eq:["f = n/(2L) √(T/μ)"]},
      {h:"Useful RP1 graph strategies",p:"If T and μ are constant for one harmonic, f ∝ 1/L, so plotting f against 1/L should be linear through the origin. If L and μ are fixed, f ∝ √T, or equivalently f² ∝ T. If L and T are fixed, f ∝ 1/√μ."},
      {h:"RP1 quality improvements",p:"Measure the vibrating length between fixed nodes, use several repeat readings, keep the harmonic number controlled, calculate tension from the hanging mass where appropriate, and avoid assuming the pulley is perfectly frictionless without discussion."},
      {h:"Required Practical 2: Young’s slits",p:"Measure fringe spacing and use w = λD/s. Measuring the distance across many fringes and dividing by the number of spacings reduces the percentage uncertainty compared with measuring one small spacing."},
      {h:"Required Practical 2: diffraction grating",p:"Measure the angle to a principal maximum for a known grating spacing and order, then use d sinθ = nλ. Taking readings on both sides of the central maximum and averaging the magnitudes can reduce alignment error."},
      {h:"Laser safety",p:"Use only the school-approved low-power laser setup and follow your teacher’s instructions. Never look into the beam or deliberately direct it towards eyes or reflective objects."},
      {h:"Uncertainty and evaluation",p:"Distinguish random uncertainty from systematic effects. Repeat readings help estimate scatter but do not remove a systematic zero or alignment error. Quote sensible significant figures and match precision to the measurements used."}
    ],
    example:{q:"A student measures 10 fringe spacings over 42.0 mm. The slit separation is 0.300 mm and screen distance is 2.00 m. Find the wavelength.",steps:["One fringe spacing w = 42.0 mm / 10 = 4.20 mm = 4.20 × 10⁻³ m.","λ = ws/D.","λ = (4.20 × 10⁻³)(3.00 × 10⁻⁴)/2.00 = 6.30 × 10⁻⁷ m."],answer:"λ = 6.30 × 10⁻⁷ m = 630 nm."},
    exam:["Know why multiple fringes are measured, not just the equation.","For graph questions, identify the linearised variables from the proportional relationship.","Evaluation marks usually need a named source of uncertainty plus a physically relevant improvement."]
  }
];