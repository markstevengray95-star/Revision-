(()=>{
  "use strict";
  const EXPANDED={
    progressive:{
      match:/Progressive waves/i,
      title:"Deep dive: progressive waves, phase and wave motion",
      overview:"This section develops the wave language that every later Waves question relies on. The emphasis is on separating the motion of the medium from the motion of the disturbance, using phase precisely, and moving confidently between graphical, verbal and mathematical descriptions.",
      sections:[
        {h:"1. What actually travels in a wave?",p:"A progressive wave is a disturbance that transfers energy and information from one place to another. In a mechanical wave, particles of the medium oscillate around fixed equilibrium positions. They do not drift along with the wave in the ideal model. The wave pattern can move a large distance even though each particle only moves through a small displacement about equilibrium. This distinction is important in explanations: wave speed is the speed of propagation of a point of constant phase, not the instantaneous speed of an individual particle."},
        {h:"2. Displacement–distance and displacement–time graphs",p:"A displacement–distance graph is a snapshot of the whole wave at one instant. From it you can read amplitude, wavelength and phase separation between positions. A displacement–time graph follows one position as time passes. From it you can read amplitude, period and frequency. The two graph types can look similar but the horizontal axis represents different physical quantities, so a wavelength cannot be read from a time graph and a period cannot be read from a distance graph."},
        {h:"3. Frequency, period, wavelength and speed",p:"Frequency f is the number of complete oscillations per second, measured in hertz. Period T is the time for one complete oscillation, so f=1/T. Wavelength λ is the shortest distance between two points that are in the same phase. During one period, a progressive wave travels one wavelength. Therefore wave speed is v=λ/T=fλ. This relationship is valid for all periodic waves when v is the propagation speed in the medium."},
        {h:"4. Phase and phase difference",p:"Phase identifies the stage of an oscillation. Two points are in phase when they have the same displacement from equilibrium and are moving in the same direction. A full cycle corresponds to 360° or 2π radians. A separation of λ/4 corresponds to 90° or π/2 rad; λ/2 corresponds to 180° or π rad; λ corresponds to 360° or 2π rad. For a sinusoidal wave, Δφ=2πΔx/λ and also Δφ=2πΔt/T."},
        {h:"5. What changes at a boundary?",p:"When a wave crosses into another medium, the source still sets the frequency, so frequency remains constant at the boundary. If the propagation speed changes, the wavelength must change because v=fλ. This is the conceptual basis of refraction. Students often incorrectly state that frequency changes because wavelength changes; the correct chain is that the medium changes speed, the source fixes frequency, and wavelength adjusts."},
        {h:"6. Phase speed versus particle motion",p:"On a transverse wave, a marked point of the medium can be moving downward while the wave travels to the right. The direction of particle motion therefore cannot be inferred simply from the direction of propagation. To determine the local particle motion on a travelling sinusoidal wave, compare the local slope of a displacement–distance graph with the direction in which the whole pattern moves."}
      ],
      derivation:{h:"Derivation: why v=fλ",steps:["In one complete period T, the wave pattern advances by one wavelength λ.","Speed = distance/time, so v=λ/T.","Because f=1/T, substitute to obtain v=fλ.","This argument links a spatial quantity (λ) to a temporal quantity (f)."]},
      examples:[
        {q:"A wave has frequency 2.40 kHz and travels at 336 m s⁻¹. Calculate its wavelength.",a:["Convert frequency: 2.40 kHz = 2.40×10³ Hz.","Use λ=v/f.","λ=336/(2.40×10³)=0.140 m."],ans:"λ = 0.140 m"},
        {q:"Two points are 0.18 m apart on a wave of wavelength 0.72 m. Find their phase difference.",a:["Δx/λ=0.18/0.72=0.25 cycle.","Δφ=2π×0.25=π/2 rad.","This is also 90°."],ans:"π/2 rad or 90°"}
      ],
      exam:["State whether a graph is displacement–distance or displacement–time before extracting λ or T.","Use radians or degrees consistently when discussing phase difference.","When a wave enters another medium, state that frequency remains fixed by the source.","Do not describe wave speed as the speed of the oscillating particles."],
      links:["Use the Wave Measurement Lab to place two probes on the same wave and compare their phase.","Use the oscilloscope display to connect a time delay to phase difference."]
    },
    types:{
      match:/Transverse, longitudinal|polarisation/i,
      title:"Deep dive: transverse waves, longitudinal waves and polarisation",
      overview:"This section focuses on the direction of oscillation relative to energy transfer and on why polarisation is a distinctive property of transverse waves.",
      sections:[
        {h:"1. Transverse waves",p:"In a transverse wave, the oscillation is perpendicular to the direction in which the wave transfers energy. Waves on a stretched string are transverse: the string elements move up and down while the disturbance travels along the string. Electromagnetic waves are also transverse. Their electric and magnetic fields oscillate at right angles to the direction of travel."},
        {h:"2. Longitudinal waves",p:"In a longitudinal wave, oscillations are parallel to the direction of propagation. Sound in air is the standard example. Air molecules oscillate backwards and forwards and create alternating compressions and rarefactions. A compression is a region of greater pressure and density; a rarefaction is a region of lower pressure and density."},
        {h:"3. Comparing graphical representations",p:"A transverse wave can often be represented by the actual transverse displacement of the medium. A longitudinal wave is frequently drawn as crowded and spread-out particles, or using a graph of pressure/displacement against position. A sinusoidal graph for sound is therefore a graph of a varying physical quantity, not a literal picture of the air path."},
        {h:"4. Polarisation",p:"Plane polarisation restricts the oscillation of a transverse wave to one direction in the plane perpendicular to propagation. Because a longitudinal oscillation is already parallel to propagation, it cannot be plane-polarised in the same way. Observing polarisation is therefore evidence that a wave has a transverse nature."},
        {h:"5. Polarising filters",p:"An ideal polarising filter has a transmission axis. The component of the incident electric-field oscillation aligned with this axis is transmitted. Rotating a second polariser changes the transmitted intensity. For this AQA section, the important requirement is the qualitative effect and the use of polarisation to demonstrate transverse behaviour; Malus' law is not required unless supplied."},
        {h:"6. Radio and microwave aerial alignment",p:"A receiving aerial responds most effectively when aligned with the electric-field oscillation of the incoming linearly polarised electromagnetic wave. Rotating the receiving aerial by 90° can greatly reduce the received signal. This is a practical application of polarisation and a useful way to connect an abstract field direction to a measurable effect."}
      ],
      derivation:{h:"Reasoning chain: why polarisation proves transverse behaviour",steps:["Polarisation selects one allowed oscillation direction.","This only makes sense when there are oscillation directions perpendicular to the propagation direction to choose between.","Therefore a wave that can be plane-polarised must have transverse oscillations.","Electromagnetic waves can be polarised, so they are transverse."]},
      examples:[
        {q:"A linearly polarised microwave signal is detected strongly. The receiver is rotated through 90°. Explain what happens.",a:["The receiving aerial becomes perpendicular to the electric-field oscillation.","Coupling to the field is greatly reduced.","The detected signal therefore falls to a minimum in an ideal alignment."],ans:"Signal strength falls greatly because of the 90° polarisation mismatch."},
        {q:"Explain why sound in air cannot be plane-polarised.",a:["Sound in air is longitudinal.","Particle oscillations are parallel to propagation.","There is no transverse oscillation direction for a polariser to select."],ans:"Longitudinal sound has no transverse vibration plane to select."}
      ],
      exam:["Use the words parallel and perpendicular explicitly.","For sound, refer to compressions and rarefactions rather than crests and troughs.","Do not claim that all transverse waves are electromagnetic; a wave on a string is also transverse.","Treat polarisation qualitatively unless a question provides an extra relationship."],
      links:["Use the polarisation model and rotate the analyser with touch/mouse.","Compare the particle view of longitudinal waves with the transverse string view."]
    },
    stationary:{
      match:/Superposition and stationary|stationary waves/i,
      title:"Deep dive: superposition, stationary waves and harmonics",
      overview:"Stationary waves bring together reflection, superposition, phase and resonance. AQA expects students to explain their formation graphically and to use the stretched-string relationship confidently.",
      sections:[
        {h:"1. Principle of superposition",p:"When waves overlap, the resultant displacement at each point is the algebraic/vector sum of the individual displacements. Superposition is instantaneous: each wave continues after overlap in an ideal linear medium. Constructive interference occurs when contributions reinforce; destructive interference occurs when they oppose."},
        {h:"2. Formation of a stationary wave",p:"A stationary wave can form when two waves of the same frequency travel in opposite directions and superpose. On a string, one wave is often the incident wave and the other is its reflection. At positions where the two waves are always in antiphase, a node forms. At positions where their displacements repeatedly reinforce, an antinode forms."},
        {h:"3. Nodes and antinodes",p:"A node is a fixed position of zero oscillation amplitude. An antinode is a fixed position where oscillation amplitude is maximum. Adjacent nodes are separated by λ/2. A node and its nearest antinode are separated by λ/4. The particles between adjacent nodes oscillate approximately in phase, while particles in neighbouring loops oscillate in antiphase."},
        {h:"4. Progressive versus stationary waves",p:"A progressive wave transfers energy through the medium and has the same amplitude at different positions in an ideal uniform medium. A stationary wave has position-dependent amplitude: zero at nodes and maximum at antinodes. There is no net transport of energy along an ideal stationary pattern because equal waves transport energy in opposite directions."},
        {h:"5. Harmonics on a string fixed at both ends",p:"The fixed ends must be nodes, so only wavelengths that fit an integer number of half-wavelengths into the length L are allowed. Hence L=nλ/2 and λn=2L/n. Combining this with v=fλ gives fn=nv/(2L). The first allowed mode is the first harmonic; AQA uses harmonic language rather than the terms fundamental/overtone in this section."},
        {h:"6. Wave speed on a stretched string",p:"For an ideal stretched string, v=√(T/μ), where T is tension and μ is mass per unit length. Increasing tension raises wave speed and therefore raises resonant frequencies. Increasing μ lowers wave speed and resonant frequencies. Combining the relationships gives fn=n/(2L)√(T/μ)."},
        {h:"7. Resonance and driving frequency",p:"A clear stationary pattern appears when the driving frequency matches one of the allowed resonant frequencies. Away from resonance, reflections still occur but the stable high-amplitude mode is not strongly established. In practical work the resonant frequency is identified by a clear, stable pattern with large antinodes."},
        {h:"8. Stationary waves beyond strings",p:"The same ideas apply to microwaves and sound. In a microwave experiment, moving a detector through the field reveals alternating maxima and minima. In sound columns, boundary conditions determine where displacement or pressure nodes and antinodes occur. The key physics is still two same-frequency waves travelling in opposite directions and superposing."}
      ],
      derivation:{h:"Derivation: stretched-string harmonic equation",steps:["For a string fixed at both ends, L=nλ/2, so λ=2L/n.","Wave speed is v=fλ, so f=v/λ=nv/(2L).","For a stretched string v=√(T/μ).","Substitute to obtain fn=n/(2L)√(T/μ)."]},
      examples:[
        {q:"A string is 0.80 m long with T=32 N and μ=8.0×10⁻³ kg m⁻¹. Find the first-harmonic frequency.",a:["v=√(32/0.0080)=63.25 m s⁻¹.","f1=v/(2L)=63.25/(1.60).","f1=39.5 Hz."],ans:"39.5 Hz"},
        {q:"The first harmonic is 40 Hz. State the frequencies of the next two harmonics for an ideal string.",a:["For fixed L, T and μ, fn=nf1.","Second harmonic = 2×40=80 Hz.","Third harmonic = 3×40=120 Hz."],ans:"80 Hz and 120 Hz"}
      ],
      exam:["Formation explanations should include same frequency, opposite directions and superposition.","State that a node has zero amplitude, not simply zero displacement at one instant.","Use λ/2 between adjacent nodes and λ/4 from node to nearest antinode.","For proportional reasoning: f∝1/L, f∝√T and f∝1/√μ for a fixed harmonic."],
      links:["Use the resonance simulator to sweep through a mode instead of selecting a harmonic directly.","Use the stationary-wave probe to drag along the string and identify nodes and antinodes."]
    },
    interference:{
      match:/Interference and Young/i,
      title:"Deep dive: coherence, path difference and Young’s double slit",
      overview:"Interference questions are easiest when every observation is translated into path difference, phase difference and superposition.",
      sections:[
        {h:"1. Coherent sources",p:"Two sources are coherent when they emit waves of the same frequency with a constant phase difference. They do not have to be exactly in phase. The constant phase relationship is what allows the positions of maxima and minima to remain fixed instead of washing out with time."},
        {h:"2. Path difference and phase",p:"At an observation point, the two waves may have travelled different distances. The path difference Δ is the difference between those path lengths. If the sources start in phase, path difference nλ gives constructive interference, while path difference (n+1/2)λ gives destructive interference. The corresponding phase difference is Δφ=2πΔ/λ."},
        {h:"3. Why one source and two slits are useful",p:"A single monochromatic source illuminating two narrow slits creates two secondary sources that inherit a stable phase relationship. This makes them coherent. Using two unrelated lamps would not normally produce a stable visible pattern because their relative phase changes rapidly."},
        {h:"4. Young’s double-slit pattern",p:"Each slit diffracts light so the two emerging waves overlap. At points where the path difference is an integer multiple of λ, bright fringes form. Half-integer path differences produce dark fringes. Near the centre and for small angles, bright fringes are approximately equally spaced."},
        {h:"5. Fringe-spacing equation",p:"For slit separation s, screen distance D and fringe spacing w, w=λD/s. The relationship predicts that increasing wavelength or screen distance increases fringe spacing, while increasing slit separation reduces it. This is a powerful proportional-reasoning check on calculations."},
        {h:"6. White-light interference",p:"At the centre, path difference is zero for every wavelength, so a white central fringe is produced. Away from the centre, each wavelength reaches constructive interference at slightly different positions. Colours separate, then overlap as the order increases."},
        {h:"7. Sound and microwave interference",p:"Interference is not unique to light. Two coherent loudspeakers or microwave sources can create spatial maxima and minima. Moving a detector changes the path difference to the two sources. This is a useful demonstration that the same wave model applies across very different wavelengths."},
        {h:"8. Measuring wavelength accurately",p:"In Young’s experiment, measuring the distance across many fringe spacings and dividing by the number of spacings reduces percentage uncertainty. The screen should be sufficiently far from the slits for the small-angle geometry to be appropriate. Slit separation and screen distance should be measured carefully in SI units before substitution."}
      ],
      derivation:{h:"Derivation: w=λD/s (small-angle model)",steps:["For a point at angle θ, the path difference from adjacent slits is approximately s sinθ.","For a bright fringe of order n, s sinθ=nλ.","For small angles, sinθ≈tanθ≈y/D, so sy/D≈nλ.","Therefore yn≈nλD/s and the spacing between adjacent orders is w=λD/s."]},
      examples:[
        {q:"λ=520 nm, D=1.80 m and s=0.250 mm. Find w.",a:["λ=5.20×10⁻⁷ m, s=2.50×10⁻⁴ m.","w=λD/s.","w=(5.20×10⁻⁷×1.80)/(2.50×10⁻⁴)=3.74×10⁻³ m."],ans:"w = 3.74 mm"},
        {q:"A detector moves to a position where path difference is 1.5λ. What is observed for equal-amplitude waves that started in phase?",a:["1.5λ=(1+1/2)λ.","This is the destructive-interference condition.","Equal amplitudes cancel ideally."],ans:"A minimum / dark fringe"}
      ],
      exam:["Coherent means same frequency and constant phase difference.","Do not use 'in phase' as the definition of coherence.","Count fringe spacings, not bright lines, when measuring across several fringes.","Convert nm and mm to m before using w=λD/s."],
      links:["Drag the detector in the two-source model and watch path difference and intensity change together.","Use the Young’s slit screen cursor to measure the pattern instead of reading a supplied value."]
    },
    diffraction:{
      match:/Diffraction and diffraction gratings/i,
      title:"Deep dive: diffraction, single slits and diffraction gratings",
      overview:"Diffraction is wave spreading. A single slit reveals how the extent of spreading depends on λ/a, while a grating uses many coherent slits to produce sharp angular maxima for precise wavelength measurements.",
      sections:[
        {h:"1. Diffraction as spreading",p:"Diffraction is the spreading of a wave after passing through an aperture or around an obstacle. It occurs for all gap sizes, but becomes most noticeable when the gap dimension is comparable with the wavelength. Saying that diffraction only occurs when gap size equals wavelength is incorrect."},
        {h:"2. Single-slit pattern",p:"Monochromatic light through a narrow slit produces a broad central maximum and weaker side maxima. Narrowing the slit increases angular spreading. Increasing wavelength also increases spreading. In the AQA specification the change in central-maximum width is treated qualitatively; an intensity-against-angular-separation graph is not a required recall item, although the app displays one to help visual understanding."},
        {h:"3. White-light single-slit diffraction",p:"Different wavelengths diffract through different angles. Longer red wavelengths spread more than shorter blue wavelengths. The central region remains largely white because all visible wavelengths overlap around zero angle, while coloured structure appears away from the centre."},
        {h:"4. Many slits: the diffraction grating",p:"A transmission grating contains a very large number of equally spaced slits. The waves from all slits interfere. Only particular angles give a phase relationship that allows strong reinforcement from every slit, so the principal maxima are narrow and well-defined."},
        {h:"5. Grating spacing",p:"If a grating has N lines per metre, the slit spacing is d=1/N. A frequent numerical error is converting lines mm⁻¹ incorrectly: multiply by 1000 to obtain lines m⁻¹, then take the reciprocal."},
        {h:"6. Grating equation",p:"For normal incidence, the path difference between waves from adjacent slits is d sinθ. A principal maximum occurs when this equals nλ, giving d sinθ=nλ. The central maximum has n=0. First, second and higher orders occur symmetrically on both sides if the angle is physically possible."},
        {h:"7. Maximum possible order",p:"Because |sinθ| cannot exceed 1, an order exists only if nλ≤d. The largest integer satisfying this condition is the maximum possible order. This is a useful check before using inverse sine."},
        {h:"8. Spectroscopy applications",p:"A grating separates wavelengths by angle. Emission spectra can therefore identify atoms or measure unknown wavelengths. A larger number of illuminated slits produces narrower principal maxima and can improve the ability to distinguish close wavelengths. AQA expects applications of diffraction gratings; the detailed operating procedure of a spectrometer is not itself a tested requirement."}
      ],
      derivation:{h:"Derivation: d sinθ=nλ",steps:["Consider rays from two adjacent slits separated by d.","At observation angle θ, their geometric path difference is d sinθ.","For a principal maximum, adjacent rays must arrive in phase, so path difference must be an integer number of wavelengths nλ.","Therefore d sinθ=nλ."]},
      examples:[
        {q:"A grating has 300 lines mm⁻¹. Find d.",a:["300 lines mm⁻¹ = 3.00×10⁵ lines m⁻¹.","d=1/N.","d=1/(3.00×10⁵)=3.33×10⁻⁶ m."],ans:"d = 3.33 μm"},
        {q:"For d=2.00 μm and λ=500 nm, determine the largest possible order.",a:["nλ≤d.","n≤d/λ=(2.00×10⁻⁶)/(5.00×10⁻⁷)=4.00.","The largest allowed integer is n=4; it occurs at sinθ=1 in the ideal model."],ans:"Maximum order = 4"}
      ],
      exam:["Use line density in lines per metre before taking the reciprocal.","Check nλ/d≤1 before calculating θ.","State the order n used in a grating calculation.","For single-slit questions, longer λ or smaller slit width means greater spreading."],
      links:["Use the diffraction intensity probe to drag across the single-slit profile.","Use the virtual spectrometer to rotate the telescope onto a spectral line and calculate λ."]
    },
    refraction:{
      match:/Refraction and total internal reflection/i,
      title:"Deep dive: refractive index, Snell’s law and total internal reflection",
      overview:"Refraction questions become much easier when you connect three ideas: wave speed changes at the boundary, frequency stays fixed, and wavelength therefore changes.",
      sections:[
        {h:"1. Refractive index",p:"Refractive index n=c/v compares the speed of light in vacuum with its speed in the material. Because light travels more slowly in ordinary transparent media than in vacuum, n is normally greater than 1. Air is often approximated as n≈1 in AQA calculations."},
        {h:"2. What stays constant at a boundary",p:"The frequency of the electromagnetic wave is set by its source and remains continuous across the boundary. The wave speed changes because the material changes. Therefore the wavelength changes according to λ=v/f. The colour/frequency of monochromatic light is not changed by ordinary refraction."},
        {h:"3. Snell’s law",p:"For a boundary between media 1 and 2, n1 sinθ1=n2 sinθ2. Angles are always measured from the normal, not from the surface. Entering a higher-index medium bends the ray towards the normal; entering a lower-index medium bends it away from the normal."},
        {h:"4. Physical explanation of bending",p:"A wavefront reaches the boundary progressively. The part that enters the new medium first changes speed first, causing the wavefront to rotate. The ray direction, perpendicular to the wavefront, therefore changes. This wavefront explanation connects refraction to wave speed rather than treating Snell’s law as a rule to memorise."},
        {h:"5. Critical angle",p:"When light travels from a higher-index medium to a lower-index medium, increasing the incidence angle increases the refracted angle. At the critical angle θc, the refracted ray is at 90° to the normal. Substituting θ2=90° into Snell’s law gives sinθc=n2/n1, where n1>n2."},
        {h:"6. Total internal reflection",p:"For incidence angles greater than the critical angle, the simple ray model has no transmitted refracted ray and total internal reflection occurs. Two conditions must both be stated: the wave must travel from higher n to lower n, and the incidence angle must exceed the critical angle."},
        {h:"7. Common diagram mistakes",p:"The normal must be drawn perpendicular to the boundary at the point of incidence. Angles should be labelled between the ray and normal. If a ray goes from lower n to higher n, it cannot undergo total internal reflection at that boundary, however large the incidence angle."}
      ],
      derivation:{h:"Derivation: critical-angle relationship",steps:["Start with n1 sinθ1=n2 sinθ2.","At the critical condition θ1=θc and θ2=90°.","Since sin90°=1, n1 sinθc=n2.","Therefore sinθc=n2/n1, valid when n1>n2."]},
      examples:[
        {q:"Light enters glass (n=1.50) from air at 35°. Find the refracted angle.",a:["Use n1 sinθ1=n2 sinθ2.","1.00 sin35°=1.50 sinθ2.","sinθ2=0.3824, so θ2=22.5°."],ans:"22.5°"},
        {q:"Find the critical angle for glass n=1.60 surrounded by air.",a:["sinθc=n2/n1=1.00/1.60=0.625.","θc=sin⁻¹(0.625).","θc=38.7°."],ans:"38.7°"}
      ],
      exam:["Always measure ray angles from the normal.","TIR requires higher n to lower n and incidence angle greater than θc.","Frequency does not change across the boundary.","Use n=c/v only when v is the speed of light in that material."],
      links:["Drag the incident ray directly in the refraction simulation and watch the refracted ray respond.","Use the critical-angle challenge to locate the transition to TIR experimentally."]
    },
    fibres:{
      match:/Optical fibres/i,
      title:"Deep dive: step-index fibres, dispersion, pulse broadening and absorption",
      overview:"Fibre-optics questions test whether you can separate guidance of light from degradation of a digital signal. Cladding enables controlled total internal reflection, while dispersion broadens pulses and absorption reduces their amplitude.",
      sections:[
        {h:"1. Step-index fibre structure",p:"A step-index optical fibre has a central core of refractive index ncore surrounded by cladding of lower refractive index nclad. The refractive index changes abruptly at the core–cladding boundary. AQA limits this treatment to step-index fibres."},
        {h:"2. Why the cladding matters",p:"The cladding provides a controlled lower refractive index so suitable rays can undergo total internal reflection at the core boundary. It also protects the core surface and helps isolate neighbouring fibres. A bare core touching other materials would have less predictable boundary conditions and greater signal loss."},
        {h:"3. Guiding by total internal reflection",p:"For a guided ray, the incidence angle at the core–cladding boundary must exceed the critical angle for that boundary. The ray can then remain within the core through repeated internal reflections in the geometrical-ray model."},
        {h:"4. Modal dispersion",p:"In a multimode fibre, different rays/modes follow different path lengths. A near-axial path is shorter than a strongly zig-zagging path, so components of the same input pulse can arrive at different times. This spreads the output pulse. A sufficiently narrow single-mode core reduces modal dispersion."},
        {h:"5. Material dispersion",p:"The refractive index of the fibre material varies slightly with wavelength. A pulse containing a range of wavelengths therefore contains components with different propagation speeds. A source with a narrow wavelength range reduces material dispersion."},
        {h:"6. Pulse broadening and data rate",p:"Digital information may be represented by a sequence of light pulses. If each pulse spreads in time, neighbouring pulses can overlap and become difficult to distinguish. Greater pulse broadening therefore limits the maximum pulse repetition frequency and hence the available data rate."},
        {h:"7. Absorption",p:"Absorption transfers energy from the electromagnetic wave to the fibre material, reducing signal intensity with distance. Absorption changes pulse amplitude rather than being the same phenomenon as dispersion. Long links may need amplification or regeneration depending on the system."},
        {h:"8. Distinguishing the three effects",p:"Modal dispersion: different paths/modes, reduced by single-mode design. Material dispersion: different wavelengths have different speeds, reduced by a narrow spectral width. Absorption: loss of optical energy, reduced by low-loss materials and appropriate operating wavelength. Clear separation of these effects is important in extended-response questions."}
      ],
      derivation:{h:"Reasoning chain: from dispersion to data-rate limit",steps:["An input pulse has a finite duration.","Dispersion makes components arrive at different times.","The output pulse is broader than the input pulse.","At high pulse rates, neighbouring broadened pulses overlap.","The receiver can no longer reliably distinguish individual bits, so the maximum data rate is reduced."]},
      examples:[
        {q:"A multimode fibre shows severe pulse broadening but little loss of amplitude. Identify the dominant problem and one improvement.",a:["Broadening without large amplitude loss indicates dispersion rather than absorption.","If many ray paths are present, modal dispersion is likely.","Use a single-mode fibre / narrower core to reduce the range of path lengths."],ans:"Modal dispersion; reduce by using single-mode operation."},
        {q:"Two wavelengths in a pulse travel at slightly different speeds through the same fibre. Name the effect.",a:["The components differ in wavelength.","Refractive index and speed depend slightly on wavelength.","This is material dispersion."],ans:"Material dispersion"}
      ],
      exam:["Absorption reduces amplitude; dispersion broadens pulses.","State the function of cladding in terms of lower refractive index and controlled TIR.","Link pulse broadening explicitly to overlap and reduced maximum data rate.","Keep modal and material dispersion as separate mechanisms."],
      links:["Switch modal and material dispersion on and off independently in the fibre lab.","Use the arrival-time display to compare several ray paths and the broadened output pulse."]
    },
    practicals:{
      match:/Required practicals/i,
      title:"Deep dive: Required Practical 1, Required Practical 2 and data analysis",
      overview:"AQA practical questions assess more than remembering a method. Students should understand variables, graph choices, uncertainty, repeat measurements, valid conclusions and how the underlying equations generate a linear relationship.",
      sections:[
        {h:"1. Required Practical 1 — aim",p:"Investigate how the frequency of stationary waves on a string varies with length L, tension T and mass per unit length μ. A vibration generator or other driver produces waves on a stretched string. A clear resonant stationary pattern is identified using nodes and antinodes."},
        {h:"2. RP1 — changing length",p:"For a fixed harmonic with T and μ constant, f∝1/L. A plot of f against 1/L should therefore be linear. The vibrating length should be measured between the effective fixed points/nodes rather than from arbitrary apparatus edges."},
        {h:"3. RP1 — changing tension",p:"For fixed L, μ and harmonic, f∝√T, so f²∝T. Tension may be produced using a hanging mass, with the approximation T≈mg when pulley friction and acceleration are negligible. A graph of f² against T is a useful linearisation."},
        {h:"4. RP1 — changing mass per unit length",p:"For fixed L, T and harmonic, f∝1/√μ. Mass per unit length can be obtained from the mass and measured length of a sample of the string. Keeping the same material but changing thickness changes μ and therefore the wave speed."},
        {h:"5. RP1 — controlling the harmonic",p:"The mode number must remain controlled when investigating a single proportional relationship. Accidentally switching from one harmonic to another changes the wavelength condition and invalidates a simple f versus 1/L or f² versus T comparison."},
        {h:"6. Required Practical 2 — Young’s slits",p:"Use a monochromatic light source, double slit and screen to observe interference. Measure a distance spanning several fringe spacings and divide by the number of spacings. Then use w=λD/s. Laser safety must follow the school’s approved setup and teacher instructions; never look into the beam."},
        {h:"7. Required Practical 2 — diffraction grating",p:"For a known grating spacing, measure the angle of a principal maximum and use d sinθ=nλ. Measurements on both sides of the central maximum can be compared or averaged to reduce alignment effects. The physical order must satisfy nλ≤d."},
        {h:"8. Random and systematic uncertainty",p:"Repeated measurements reveal scatter and help estimate random uncertainty. Repeats do not remove a systematic error such as a zero offset or persistent misalignment. An improvement should target the named source of uncertainty rather than being a generic instruction to repeat more times."},
        {h:"9. Percentage uncertainty",p:"For a directly measured quantity x with absolute uncertainty u, percentage uncertainty is 100u/x. When a measured interval is small, measuring multiple intervals at once can reduce percentage uncertainty. For example, measuring ten fringe spacings gives a larger total distance while the ruler resolution stays similar."},
        {h:"10. Graphs and gradients",p:"Choose axes that test the predicted relationship. A straight graph supports a proportional model only if the transformed variables are appropriate. The gradient should be linked back to the theoretical equation, with units. A non-zero intercept may indicate systematic error or an unmodelled effect."}
      ],
      derivation:{h:"Linearisation map for RP1",steps:["f=(n/2L)√(T/μ).","At fixed T and μ: f∝1/L → plot f against 1/L.","At fixed L and μ: f∝√T → plot f² against T.","At fixed L and T: f∝1/√μ → plot f against 1/√μ.","Keep n fixed for each of these comparisons."]},
      examples:[
        {q:"A student measures 12 fringe spacings over 51.6 mm. Find one fringe spacing.",a:["The measured distance contains 12 spacings.","w=51.6/12 mm.","w=4.30 mm."],ans:"4.30 mm"},
        {q:"A ruler reading is 0.800 m with uncertainty ±0.001 m. Find percentage uncertainty.",a:["Percentage uncertainty=100u/x.","=100×0.001/0.800.","=0.125%."],ans:"0.125%"}
      ],
      exam:["Name the independent, dependent and important control variables.","Link an improvement to a specific uncertainty source.","Use transformed axes that follow from the equation, not simply any convenient graph.","Explain why measuring across several fringes reduces percentage uncertainty.","Know that AQA Required Practical 1 is stationary waves on a string and Required Practical 2 includes Young’s slits and a diffraction grating."],
      links:["Import practical readings into the virtual notebook and fit a line of best fit.","Use the uncertainty calculator to compare absolute, percentage and half-range uncertainty.","Open the resonance finder for RP1 and spectrometer/Young’s lab for RP2."]
    }
  };

  const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  function findData(){const title=document.querySelector("#textbookReader h2")?.textContent||"";return Object.values(EXPANDED).find(d=>d.match.test(title));}
  function render(){
    const reader=document.getElementById("textbookReader"); if(!reader)return;
    const data=findData(); if(!data)return;
    reader.querySelector(".deep-textbook-extension")?.remove();
    const host=document.createElement("div");host.className="deep-textbook-extension";
    host.innerHTML=`
      <div class="deep-divider"><span>Expanded textbook</span></div>
      <section class="deep-overview"><span class="eyebrow">More detail</span><h2>${esc(data.title)}</h2><p>${esc(data.overview)}</p></section>
      <div class="deep-section-list">${data.sections.map(s=>`<section class="deep-section"><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p></section>`).join("")}</div>
      <section class="deep-derivation"><span class="eyebrow">Derivation / reasoning</span><h3>${esc(data.derivation.h)}</h3><ol>${data.derivation.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol></section>
      <section class="deep-examples"><span class="eyebrow">Worked examples</span><div class="deep-example-grid">${data.examples.map((e,i)=>`<article class="deep-example"><span class="mini-badge">Example ${i+1}</span><h3>${esc(e.q)}</h3><ol>${e.a.map(x=>`<li>${esc(x)}</li>`).join("")}</ol><div class="lesson-callout"><strong>Answer:</strong> ${esc(e.ans)}</div></article>`).join("")}</div></section>
      <section class="deep-exam"><span class="eyebrow">Exam precision</span><h3>High-value details to remember</h3><ul>${data.exam.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>
      <section class="deep-links"><span class="eyebrow">Make it visual</span><h3>Use the app to test these ideas</h3><ul>${data.links.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></section>`;
    const nav=reader.querySelector(".textbook-reader-nav"); if(nav)reader.insertBefore(host,nav); else reader.appendChild(host);
  }
  function install(){const reader=document.getElementById("textbookReader");if(!reader)return;const obs=new MutationObserver(()=>setTimeout(render,0));obs.observe(reader,{childList:true,subtree:false});setTimeout(render,150);}
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();