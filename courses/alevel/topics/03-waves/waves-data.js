window.WAVES_DATA = {
  lessons: [
    {
      id:"L1", topic:"progressive", code:"3.3.1.1", title:"Progressive waves: the language of waves",
      lead:"Build a precise vocabulary for describing travelling waves and connect frequency, period, wavelength and speed.",
      objectives:["Define amplitude, wavelength, frequency, period, phase and phase difference.","Use v = fλ and f = 1/T correctly with SI units.","Explain that particles of a medium oscillate while energy is transferred through the wave."],
      retrieval:["What is meant by frequency?","What is the SI unit of wavelength?","What does amplitude tell us about an oscillation?"],
      sections:[
        {h:"1. What a progressive wave does",p:"A progressive wave transfers energy from one place to another without a net transfer of matter. In a mechanical wave, particles of the medium oscillate about equilibrium positions while the disturbance travels through the medium."},
        {h:"2. The quantities you must distinguish",p:"Amplitude A is the maximum displacement from equilibrium. Wavelength λ is the shortest distance between two points in the same phase. Frequency f is the number of complete oscillations each second. Period T is the time for one complete oscillation.",eq:"f = 1/T"},
        {h:"3. Wave speed",p:"During one period the wave profile advances by one wavelength. That gives the universal wave relationship.",eq:"v = fλ",callout:"Keep the units consistent: v in m s⁻¹, f in Hz and λ in m."},
        {h:"4. Worked example",p:"A water wave has frequency 4.0 Hz and wavelength 0.75 m. The wave speed is v = 4.0 × 0.75 = 3.0 m s⁻¹."},
        {h:"5. Exam link",p:"If frequency is set by a source and a wave enters a different medium, the frequency stays the same. A change in speed therefore causes a change in wavelength."}
      ],
      sim:"progressive", quick:{q:"A wave of frequency 250 Hz travels at 340 m s⁻¹. What is its wavelength?",a:["0.735 m","1.36 m","590 m"],correct:1,why:"λ = v/f = 340/250 = 1.36 m."}
    },
    {
      id:"L2", topic:"progressive", code:"3.3.1.1", title:"Phase and phase difference",
      lead:"Use phase to describe where points are within an oscillation and translate between cycles, degrees and radians.",
      objectives:["Recognise points that are in phase or in antiphase.","Calculate phase difference from separation along a wave.","Convert phase difference between fractions of a cycle, degrees and radians."],
      retrieval:["What separation corresponds to one full cycle?","How many degrees are in one complete cycle?","What does 'in phase' mean?"],
      sections:[
        {h:"1. Meaning of phase",p:"Phase tells us the stage reached in a cycle. Two points are in phase when they have the same displacement from equilibrium and are moving in the same direction."},
        {h:"2. Phase difference from separation",p:"A separation of one wavelength corresponds to 360° or 2π rad. Therefore phase difference is proportional to separation.",eq:"phase difference = 2π(Δx/λ) rad"},
        {h:"3. Important cases",p:"0, 2π, 4π... rad are in phase. π rad or 180° is antiphase. π/2 rad or 90° is a quarter-cycle phase difference."},
        {h:"4. Worked example",p:"Two points are separated by 0.15 m on a wave of wavelength 0.60 m. Δx/λ = 0.25, so the phase difference is 0.25 × 360° = 90° = π/2 rad."},
        {h:"5. Time phase difference",p:"The same idea works in time: phase difference = 2π(Δt/T). Spatial and temporal phase descriptions are equivalent for a sinusoidal wave."}
      ],
      sim:"progressive", quick:{q:"Points separated by λ/2 have what phase difference?",a:["π/2 rad","π rad","2π rad"],correct:1,why:"Half a wavelength is half a cycle, so phase difference = π rad."}
    },
    {
      id:"L3", topic:"progressive", code:"3.3.1.2", title:"Transverse, longitudinal and polarisation",
      lead:"Distinguish wave types by the direction of oscillation and use polarisation as evidence that a wave is transverse.",
      objectives:["Compare transverse and longitudinal waves.","Identify examples including sound, EM waves and waves on strings.","Explain polarisation and applications of aligned aerials and polarising materials."],
      retrieval:["Which direction does energy travel in a wave?","Is sound in air transverse or longitudinal?","Are electromagnetic waves transverse or longitudinal?"],
      sections:[
        {h:"1. Transverse waves",p:"The oscillation is perpendicular to the direction of energy transfer. Electromagnetic waves and waves on a stretched string are key examples."},
        {h:"2. Longitudinal waves",p:"The oscillation is parallel to the direction of energy transfer. Sound in air contains compressions and rarefactions rather than crests and troughs."},
        {h:"3. Polarisation",p:"A transverse wave can be restricted to oscillations in one plane. This is polarisation. Longitudinal waves cannot be polarised because their oscillations are already along the direction of propagation."},
        {h:"4. Applications",p:"Polaroid materials can reduce glare by blocking one component of the electric-field oscillation. Transmitting and receiving aerials work best when their orientations match."},
        {h:"5. AQA boundary",p:"You need the qualitative behaviour of polarisers and aerial alignment; Malus's law is not required for this section."}
      ],
      sim:"polarisation", quick:{q:"Why does polarisation demonstrate that electromagnetic waves are transverse?",a:["Only transverse oscillations have a selectable plane.","Polarisation changes frequency.","Longitudinal waves travel slower."],correct:0,why:"Polarisation requires oscillations perpendicular to propagation that can be selected by orientation."}
    },
    {
      id:"L4", topic:"progressive", code:"3.3.1.3", title:"Superposition and interference foundations",
      lead:"Add wave displacements at the same point and predict constructive and destructive interference.",
      objectives:["State the principle of superposition.","Use phase/path difference to predict interference.","Distinguish constructive, destructive and partial interference."],
      retrieval:["What happens when two waves occupy the same region?","What phase difference gives antiphase?","What path difference corresponds to one full wavelength?"],
      sections:[
        {h:"1. Superposition",p:"When waves overlap, the resultant displacement at a point is the vector sum of the individual displacements at that instant."},
        {h:"2. Constructive interference",p:"Waves arriving in phase reinforce. For equal amplitudes the resultant amplitude doubles. A path difference of mλ gives constructive interference, where m is an integer."},
        {h:"3. Destructive interference",p:"Waves arriving in antiphase cancel most strongly. For equal amplitudes complete cancellation occurs. A path difference of (m + 1/2)λ produces destructive interference."},
        {h:"4. Coherence",p:"A stable interference pattern requires a constant phase relationship. Coherent sources have the same frequency and a constant phase difference."},
        {h:"5. Real waves",p:"The principle applies to sound, microwaves, water waves and light. The underlying test is always the phase relationship when the waves meet."}
      ],
      sim:"interference", quick:{q:"Which path difference produces destructive interference?",a:["2λ","3λ/2","4λ"],correct:1,why:"An odd number of half wavelengths gives antiphase at the meeting point."}
    },
    {
      id:"L5", topic:"progressive", code:"3.3.1.3", title:"Stationary waves and harmonics",
      lead:"Understand how two equal waves travelling in opposite directions form nodes, antinodes and harmonics.",
      objectives:["Explain formation of a stationary wave by superposition.","Identify nodes and antinodes.","Relate string length to wavelength for different harmonics."],
      retrieval:["What phase difference gives complete cancellation?","What is superposition?","What happens to energy in a progressive wave?"],
      sections:[
        {h:"1. Formation",p:"A stationary wave can form when two waves of the same frequency and similar amplitude travel in opposite directions and superpose."},
        {h:"2. Nodes and antinodes",p:"At a node the displacement is always zero because the two waves continuously cancel. At an antinode the oscillation amplitude is maximum because the waves reinforce."},
        {h:"3. Spacing",p:"Adjacent nodes are separated by λ/2. A node and the nearest antinode are separated by λ/4."},
        {h:"4. Harmonics on a string",p:"For a string fixed at both ends, the allowed patterns satisfy L = nλ/2, where n = 1, 2, 3... is the harmonic number.",eq:"λₙ = 2L/n"},
        {h:"5. Frequency of a stretched string",p:"Wave speed on a stretched string depends on tension T and mass per unit length μ. Combining this with v = fλ gives the harmonic frequencies.",eq:"v = √(T/μ)   and   fₙ = (n/2L)√(T/μ)"}
      ],
      sim:"standing", quick:{q:"A 1.20 m string fixed at both ends vibrates in the third harmonic. What is λ?",a:["0.40 m","0.80 m","1.80 m"],correct:1,why:"λ = 2L/n = 2.40/3 = 0.80 m."}
    },
    {
      id:"L6", topic:"progressive", code:"RP1", title:"Required Practical 1: stationary waves on a string",
      lead:"Plan, analyse and evaluate the AQA stationary-wave practical using length, tension and mass per unit length.",
      objectives:["Use the string-frequency equation to plan a valid investigation.","Identify control variables and practical improvements.","Choose graphs that test proportional relationships."],
      retrieval:["State the equation for wave speed on a stretched string.","How is tension related to a hanging mass?","Why time/measure over several wavelengths where possible?"],
      sections:[
        {h:"1. Core relationship",p:"For the first harmonic, f = (1/2L)√(T/μ). This predicts f ∝ 1/L when T and μ are constant, f ∝ √T when L and μ are constant, and f ∝ 1/√μ when L and T are constant."},
        {h:"2. Measuring μ",p:"Measure a long length of the string and its mass, then calculate μ = mass/length. Using a longer sample reduces percentage uncertainty."},
        {h:"3. Tension",p:"For a hanging mass at rest, the string tension is approximately T = mg, provided friction at the pulley is small."},
        {h:"4. Graph choices",p:"To test f ∝ 1/L plot f against 1/L. To test f² ∝ T plot f² against T. A straight line through the origin supports the predicted proportionality."},
        {h:"5. Evaluation",p:"Keep the driving amplitude modest, identify the resonance pattern carefully, measure between fixed nodes, repeat readings and account for uncertainty in the vibrating length."}
      ],
      sim:"standing", quick:{q:"If string tension is quadrupled with L and μ constant, frequency changes by what factor?",a:["×2","×4","×8"],correct:0,why:"f ∝ √T, so √4 = 2."}
    },
    {
      id:"L7", topic:"optics", code:"3.3.2.1", title:"Young double-slit interference",
      lead:"Connect coherent light, path difference and geometry to the fringe-spacing equation.",
      objectives:["Explain how a double slit produces bright and dark fringes.","Use w = λD/s.","Describe the effect of changing wavelength, slit separation and screen distance."],
      retrieval:["What does coherent mean?","What path difference gives constructive interference?","What quantity does monochromatic describe?"],
      sections:[
        {h:"1. Creating two coherent sources",p:"A single monochromatic source illuminating two close slits produces two sources with a stable phase relationship."},
        {h:"2. Fringe formation",p:"At different screen positions the waves travel different distances. Bright fringes occur where path difference is mλ; dark fringes occur where it is (m + 1/2)λ."},
        {h:"3. Fringe spacing",p:"For small angles, adjacent bright fringes are evenly spaced by",eq:"w = λD/s",callout:"w = fringe spacing, λ = wavelength, D = slit-to-screen distance, s = slit separation."},
        {h:"4. Trends",p:"Increasing wavelength or screen distance increases fringe spacing. Increasing slit separation decreases fringe spacing."},
        {h:"5. White light",p:"The central fringe is white because all wavelengths have zero path difference there. Away from the centre, different wavelengths form maxima at different positions, producing coloured fringes."}
      ],
      sim:"doubleSlit", quick:{q:"What happens to fringe spacing if slit separation doubles?",a:["Doubles","Halves","Stays the same"],correct:1,why:"w = λD/s, so w is inversely proportional to slit separation."}
    },
    {
      id:"L8", topic:"optics", code:"RP2", title:"Required Practical 2: interference measurements",
      lead:"Use Young double slit and a diffraction grating to determine wavelength and evaluate the measurement.",
      objectives:["Measure fringe spacing reliably.","Determine wavelength from double-slit data.","Use multiple grating orders and discuss uncertainty."],
      retrieval:["State the Young double-slit equation.","What is meant by grating spacing d?","Why should several fringes be measured rather than one?"],
      sections:[
        {h:"1. Double-slit method",p:"Measure the slit-to-screen distance D and slit separation s. Measure across several fringe spacings and divide by the number of gaps to reduce percentage uncertainty."},
        {h:"2. Calculate wavelength",p:"Rearrange the fringe equation.",eq:"λ = ws/D"},
        {h:"3. Grating method",p:"For a grating at normal incidence the maxima satisfy",eq:"d sinθ = nλ"},
        {h:"4. Grating spacing",p:"If a grating has N lines per metre, d = 1/N. Convert lines per millimetre to lines per metre before using the equation."},
        {h:"5. Practical quality",p:"Use a long distance where possible, measure symmetric orders on both sides, repeat angle measurements, avoid parallax and follow laser safety procedures."}
      ],
      sim:"doubleSlit", quick:{q:"A grating has 600 lines mm⁻¹. What is d?",a:["1.67 × 10⁻⁶ m","6.00 × 10⁻⁴ m","1.67 × 10⁻³ m"],correct:0,why:"600 lines mm⁻¹ = 6.00×10⁵ lines m⁻¹, so d = 1/N = 1.67×10⁻⁶ m."}
    },
    {
      id:"L9", topic:"optics", code:"3.3.2.2", title:"Diffraction and single slits",
      lead:"Explain diffraction as wave spreading and predict how wavelength and aperture size affect the pattern.",
      objectives:["Describe when diffraction is most significant.","Explain how central maximum width depends qualitatively on λ and slit width.","Distinguish diffraction from refraction."],
      retrieval:["What is wavelength?","What happens when waves pass through a narrow gap?","What does monochromatic light mean?"],
      sections:[
        {h:"1. Diffraction",p:"Diffraction is the spreading of a wave after passing through a gap or around an obstacle. It is a wave phenomenon and is most noticeable when the gap size is comparable with the wavelength."},
        {h:"2. Single-slit light pattern",p:"Monochromatic light forms a broad central maximum with weaker side maxima. The central maximum becomes wider when wavelength increases or slit width decreases."},
        {h:"3. White light",p:"Different wavelengths diffract through slightly different angles, so a white-light single-slit pattern contains colour away from the central region."},
        {h:"4. Sound and radio examples",p:"Longer wavelengths diffract strongly around everyday obstacles. This helps explain why sound can be heard around corners and why radio coverage depends on wavelength and terrain."},
        {h:"5. Exam distinction",p:"Refraction is a change in direction associated with a change in wave speed at a boundary. Diffraction is spreading caused by an aperture or obstacle."}
      ],
      sim:"diffraction", quick:{q:"Which change makes a single-slit central maximum wider?",a:["Increase slit width","Decrease wavelength","Decrease slit width"],correct:2,why:"A narrower slit produces greater diffraction and a wider central maximum."}
    },
    {
      id:"L10", topic:"optics", code:"3.3.2.2", title:"Diffraction gratings",
      lead:"Use grating geometry to find wavelengths and compare the resolving behaviour of different gratings.",
      objectives:["Use d sinθ = nλ.","Convert line density to grating spacing.","Determine which diffraction orders are physically possible."],
      retrieval:["What is the meaning of diffraction order n?","What is the largest possible value of sinθ?","How is d related to lines per metre?"],
      sections:[
        {h:"1. Many-slit interference",p:"A diffraction grating contains many equally spaced slits. Constructive interference occurs only at specific angles, producing sharp principal maxima."},
        {h:"2. Grating equation",p:"At normal incidence",eq:"d sinθ = nλ",callout:"n = 0, 1, 2... is the order. d is the separation of adjacent grating lines."},
        {h:"3. Maximum order",p:"Because sinθ cannot exceed 1, only orders satisfying nλ ≤ d are possible."},
        {h:"4. Worked example",p:"For λ = 600 nm and d = 2.0 μm, the largest n is 3 because 3λ = 1.8 μm ≤ 2.0 μm, but 4λ is too large."},
        {h:"5. Applications",p:"Gratings separate wavelengths, so they are used in spectroscopy to identify or analyse light from different sources."}
      ],
      sim:"grating", quick:{q:"If d decreases while λ and n stay fixed, what happens to θ?",a:["θ increases","θ decreases","θ is unchanged"],correct:0,why:"sinθ = nλ/d, so reducing d increases sinθ and therefore θ."}
    },
    {
      id:"L11", topic:"optics", code:"3.3.2.3", title:"Refraction, refractive index and total internal reflection",
      lead:"Use refractive index and Snell's law to predict wave direction at boundaries and determine critical angle.",
      objectives:["Use n = c/v and Snell's law.","Explain bending using a change in wave speed.","Calculate critical angle for total internal reflection."],
      retrieval:["Does frequency change when light crosses a boundary?","What is the speed of light in vacuum?","What happens to wavelength if speed decreases at constant frequency?"],
      sections:[
        {h:"1. Refractive index",p:"Refractive index compares the speed of light in vacuum with its speed in a material.",eq:"n = c/v"},
        {h:"2. Snell's law",p:"For light passing between two media",eq:"n₁ sinθ₁ = n₂ sinθ₂"},
        {h:"3. Direction of bending",p:"If light slows on entering a higher-index medium, it bends towards the normal. Frequency remains unchanged, so the shorter speed corresponds to a shorter wavelength."},
        {h:"4. Critical angle",p:"Total internal reflection can occur only when light travels from higher refractive index to lower refractive index and the incidence angle exceeds the critical angle.",eq:"sinθc = n₂/n₁  (n₁ > n₂)"},
        {h:"5. Boundary cases",p:"At the critical angle the refracted ray travels along the boundary. Above it, no transmitted ray propagates into the second medium in the simple ray model."}
      ],
      sim:"refraction", quick:{q:"Light travels from glass n=1.50 to air n≈1.00. Approximate critical angle?",a:["42°","60°","90°"],correct:0,why:"θc = sin⁻¹(1/1.50) ≈ 41.8°."}
    },
    {
      id:"L12", topic:"optics", code:"3.3.2.3", title:"Optical fibres, pulse broadening and absorption",
      lead:"Apply total internal reflection to step-index fibres and explain how dispersion limits data transmission.",
      objectives:["Explain the function of core and cladding.","Describe modal and material dispersion.","Explain pulse broadening, absorption and their effect on communication."],
      retrieval:["What conditions are needed for total internal reflection?","Why must the core have a larger refractive index than the cladding?","What would overlapping pulses do to a digital signal?"],
      sections:[
        {h:"1. Core and cladding",p:"A step-index optical fibre has a higher-index core surrounded by lower-index cladding. Rays within the acceptance range undergo repeated total internal reflection at the core-cladding boundary."},
        {h:"2. Why cladding matters",p:"Cladding protects the boundary, reduces light loss and creates a controlled refractive-index interface so that total internal reflection can guide the signal."},
        {h:"3. Modal dispersion",p:"Different ray paths can have different lengths, so pulses launched at the same time may arrive over a spread of times. This broadens the received pulse."},
        {h:"4. Material dispersion",p:"The refractive index depends slightly on wavelength. If a pulse contains a range of wavelengths, different components travel at different speeds and the pulse spreads."},
        {h:"5. Absorption and bandwidth",p:"Absorption reduces signal amplitude with distance. Pulse broadening limits how close successive pulses can be before they overlap, reducing maximum data rate. Regeneration/repeaters and suitable sources/fibres help manage these limitations."}
      ],
      sim:"fibre", quick:{q:"What is the direct consequence of pulse broadening in a digital fibre link?",a:["Pulses can overlap and become harder to distinguish.","Frequency becomes zero.","The core index increases."],correct:0,why:"Broad pulses can overlap, causing ambiguity between neighbouring bits."}
    }
  ],

  sims:[
    {id:"progressive",code:"3.3.1.1",title:"Progressive Wave Explorer",subtitle:"Amplitude, wavelength, frequency, speed and phase",mission:"Link the moving profile to v = fλ.",steps:["Set a frequency and wavelength.","Pause the model and identify two points in phase.","Double the frequency while keeping wavelength fixed and compare the speed readout."],conclusion:"Wave speed is the rate the phase pattern moves. For the model, v = fλ.",simple:"The particles oscillate about equilibrium while the wave profile transfers energy across the screen.",exam:"State the relationship, substitute SI values and distinguish particle motion from wave propagation.",mistake:"Do not say particles travel with the wave; they oscillate around fixed equilibrium positions."},
    {id:"polarisation",code:"3.3.1.2",title:"Polarisation & Wave Type",subtitle:"Compare transverse and longitudinal oscillations",mission:"Use orientation to test whether a wave can be polarised.",steps:["Switch between transverse and longitudinal modes.","Rotate the analyser.","Observe which type has an orientation-dependent transmitted amplitude."],conclusion:"Polarisation is possible for transverse waves because their oscillation has a direction perpendicular to propagation.",simple:"The analyser only transmits the component aligned with its transmission axis in this qualitative model.",exam:"Use polarisation as evidence that electromagnetic waves are transverse.",mistake:"Do not claim sound in air can be polarised; ordinary sound in air is longitudinal."},
    {id:"standing",code:"3.3.1.3 / RP1",title:"Standing Wave String",subtitle:"Nodes, antinodes, harmonics and string frequency",mission:"Relate harmonic number, string length, tension and mass per unit length.",steps:["Change harmonic number and count antinodes.","Increase tension and observe frequency.","Change μ and explain the change using the square-root relationship."],conclusion:"Allowed patterns satisfy L = nλ/2 and fₙ = (n/2L)√(T/μ).",simple:"Nodes remain at zero displacement while antinodes oscillate with maximum amplitude.",exam:"Describe formation by two same-frequency waves travelling in opposite directions and superposing.",mistake:"A stationary wave does not carry a fixed waveform across the string like a progressive wave."},
    {id:"interference",code:"3.3.2.1",title:"Two-Source Interference",subtitle:"Path difference, phase and coherent sources",mission:"Predict maxima and minima from path difference.",steps:["Move the observation point.","Compare path difference with wavelength.","Find locations close to constructive and destructive interference."],conclusion:"Constructive interference occurs for mλ and destructive interference for (m+1/2)λ.",simple:"The colour/brightness of the observation point represents the combined amplitude from both sources.",exam:"Use path difference and coherence explicitly when explaining a stable interference pattern.",mistake:"Two sources with the same frequency are not necessarily coherent unless their phase relationship stays constant."},
    {id:"doubleSlit",code:"3.3.2.1 / RP2",title:"Young Double-Slit",subtitle:"Fringe spacing and experimental geometry",mission:"Test w = λD/s.",steps:["Increase D and observe fringe spacing.","Increase slit separation s.","Change wavelength and compare the fringe pattern."],conclusion:"Fringe spacing increases with λ and D, and decreases with slit separation s.",simple:"Bright fringes are positions where the path difference from the two slits is an integer number of wavelengths.",exam:"Quote w = λD/s and define every symbol with units.",mistake:"Measure the distance across several fringe gaps, then divide by the number of gaps; do not measure one narrow gap if uncertainty is large."},
    {id:"diffraction",code:"3.3.2.2",title:"Single-Slit Diffraction",subtitle:"Aperture size, wavelength and spreading",mission:"Find the conditions for strongest diffraction.",steps:["Reduce slit width.","Increase wavelength.","Compare the width of the central maximum."],conclusion:"Diffraction becomes more pronounced when the aperture size is closer to the wavelength.",simple:"The model shows a broad central maximum and weaker side structure; it is qualitative rather than a full intensity calculation.",exam:"State that the central maximum gets wider for a narrower slit or a longer wavelength.",mistake:"Diffraction is not caused by a change of medium; that would be refraction."},
    {id:"grating",code:"3.3.2.2 / RP2",title:"Diffraction Grating",subtitle:"Order, wavelength and angular separation",mission:"Use d sinθ = nλ to predict principal maxima.",steps:["Choose a line density.","Change wavelength.","Increase order until no physical solution exists."],conclusion:"Only orders with nλ ≤ d can exist because sinθ ≤ 1.",simple:"The diagram places sharp principal maxima at angles given by the grating equation.",exam:"Convert line density to lines per metre before calculating d = 1/N.",mistake:"Do not use the number of lines per metre directly as d; d is the reciprocal of line density."},
    {id:"refraction",code:"3.3.2.3",title:"Refraction & Fibre Optics",subtitle:"Snell's law, critical angle and total internal reflection",mission:"Connect refractive index to bending and total internal reflection.",steps:["Send light from lower n to higher n.","Reverse the direction.","Increase incidence angle until total internal reflection occurs."],conclusion:"TIR requires travel from higher n to lower n and incidence angle greater than the critical angle.",simple:"The ray bends because wave speed changes at the interface while frequency stays constant.",exam:"Use n₁sinθ₁ = n₂sinθ₂ and sinθc = n₂/n₁ for n₁ > n₂.",mistake:"TIR cannot occur when light travels from lower refractive index to higher refractive index."},
    {id:"fibre",code:"3.3.2.3",title:"Optical Fibre Pulse Lab",subtitle:"TIR, modal dispersion, material dispersion and absorption",mission:"Investigate what broadens and weakens pulses.",steps:["Increase fibre length.","Increase modal spread.","Increase spectral width/material dispersion and observe pulse overlap."],conclusion:"Dispersion broadens pulses; absorption reduces their amplitude. Both limit communication performance.",simple:"The animation tracks a light pulse through a step-index fibre and plots the received pulse.",exam:"Link pulse broadening to overlapping signals and reduced maximum data rate.",mistake:"Do not describe absorption as pulse broadening; absorption mainly reduces signal amplitude."}
  ],

  formulas:[
    {id:"waveSpeed",name:"Wave speed",eq:"v = fλ",fields:[["f","Frequency / Hz"],["lambda","Wavelength / m"]],calc:v=>({answer:v.f*v.lambda,unit:"m s⁻¹",steps:[`v = fλ`,`v = ${v.f} × ${v.lambda}`]})},
    {id:"period",name:"Frequency from period",eq:"f = 1/T",fields:[["T","Period / s"]],calc:v=>({answer:1/v.T,unit:"Hz",steps:[`f = 1/T`,`f = 1/${v.T}`]})},
    {id:"phaseSpace",name:"Phase difference from separation",eq:"φ = 2πΔx/λ",fields:[["dx","Separation Δx / m"],["lambda","Wavelength λ / m"]],calc:v=>({answer:2*Math.PI*v.dx/v.lambda,unit:"rad",steps:[`φ = 2πΔx/λ`,`φ = 2π × ${v.dx}/${v.lambda}`]})},
    {id:"stringSpeed",name:"Wave speed on string",eq:"v = √(T/μ)",fields:[["tension","Tension T / N"],["mu","Mass per unit length μ / kg m⁻¹"]],calc:v=>({answer:Math.sqrt(v.tension/v.mu),unit:"m s⁻¹",steps:[`v = √(T/μ)`,`v = √(${v.tension}/${v.mu})`]})},
    {id:"stringFreq",name:"String harmonic frequency",eq:"fₙ = n/(2L) √(T/μ)",fields:[["n","Harmonic n"],["L","Length L / m"],["tension","Tension T / N"],["mu","μ / kg m⁻¹"]],calc:v=>({answer:v.n/(2*v.L)*Math.sqrt(v.tension/v.mu),unit:"Hz",steps:[`fₙ = n/(2L) √(T/μ)`,`fₙ = ${v.n}/(2×${v.L}) × √(${v.tension}/${v.mu})`]})},
    {id:"young",name:"Young double-slit fringe spacing",eq:"w = λD/s",fields:[["lambda","Wavelength λ / m"],["D","Screen distance D / m"],["s","Slit separation s / m"]],calc:v=>({answer:v.lambda*v.D/v.s,unit:"m",steps:[`w = λD/s`,`w = ${v.lambda} × ${v.D} / ${v.s}`]})},
    {id:"grating",name:"Diffraction grating angle",eq:"d sinθ = nλ",fields:[["d","Grating spacing d / m"],["n","Order n"],["lambda","Wavelength λ / m"]],calc:v=>{const x=v.n*v.lambda/v.d; return x>1?{error:"No physical diffraction order: nλ > d."}:{answer:Math.asin(x)*180/Math.PI,unit:"°",steps:[`sinθ = nλ/d`,`sinθ = ${v.n} × ${v.lambda} / ${v.d}`]}}},
    {id:"refractive",name:"Refractive index from speed",eq:"n = c/v",fields:[["v","Speed in material / m s⁻¹"]],calc:v=>({answer:299792458/v.v,unit:"",steps:[`n = c/v`,`n = 2.998×10⁸ / ${v.v}`]})},
    {id:"snell",name:"Snell's law: transmitted angle",eq:"n₁sinθ₁ = n₂sinθ₂",fields:[["n1","n₁"],["theta1","θ₁ / degrees"],["n2","n₂"]],calc:v=>{const x=v.n1*Math.sin(v.theta1*Math.PI/180)/v.n2; return Math.abs(x)>1?{error:"No refracted ray: conditions correspond to total internal reflection."}:{answer:Math.asin(x)*180/Math.PI,unit:"°",steps:[`sinθ₂ = n₁sinθ₁/n₂`,`sinθ₂ = ${v.n1} × sin(${v.theta1}°) / ${v.n2}`]}}},
    {id:"critical",name:"Critical angle",eq:"sinθc = n₂/n₁",fields:[["n1","Higher refractive index n₁"],["n2","Lower refractive index n₂"]],calc:v=>v.n2>=v.n1?{error:"For this form, n₁ must be greater than n₂."}:{answer:Math.asin(v.n2/v.n1)*180/Math.PI,unit:"°",steps:[`sinθc = n₂/n₁`,`sinθc = ${v.n2}/${v.n1}`]}}
  ],

  quiz:[
    {spec:"3.3.1.1",q:"A progressive wave has speed 24 m s⁻¹ and frequency 6.0 Hz. What is its wavelength?",choices:["4.0 m","0.25 m","144 m","18 m"],answer:0,hint:"Use v = fλ.",why:"λ = v/f = 24/6 = 4.0 m."},
    {spec:"3.3.1.1",q:"Two points on a wave are separated by λ/4. What is their phase difference?",choices:["π/4 rad","π/2 rad","π rad","2π rad"],answer:1,hint:"A full wavelength corresponds to 2π rad.",why:"One quarter of a cycle corresponds to π/2 rad."},
    {spec:"3.3.1.2",q:"Which observation is evidence that electromagnetic waves are transverse?",choices:["They refract","They diffract","They can be polarised","They travel fast"],answer:2,hint:"Think about selecting a plane of oscillation.",why:"Polarisation requires transverse oscillations."},
    {spec:"3.3.1.3",q:"Adjacent nodes in a stationary wave are separated by",choices:["λ/4","λ/2","λ","2λ"],answer:1,hint:"A node-to-nearest-antinode distance is λ/4.",why:"Two node-to-antinode intervals make λ/2."},
    {spec:"3.3.1.3",q:"A stretched string's tension is increased by a factor of 9. What happens to wave speed if μ is constant?",choices:["×3","×9","÷3","No change"],answer:0,hint:"v ∝ √T.",why:"√9 = 3."},
    {spec:"3.3.2.1",q:"Which path difference gives destructive interference?",choices:["2λ","5λ/2","3λ","4λ"],answer:1,hint:"Look for an odd number of half wavelengths.",why:"5λ/2 = (2 + 1/2)λ is destructive."},
    {spec:"3.3.2.1",q:"In Young's double-slit experiment, increasing screen distance D causes fringe spacing to",choices:["increase","decrease","stay constant","become zero"],answer:0,hint:"w = λD/s.",why:"w is directly proportional to D."},
    {spec:"3.3.2.2",q:"A single-slit diffraction pattern becomes wider when",choices:["slit width increases","wavelength decreases","slit width decreases","frequency increases at fixed speed"],answer:2,hint:"Diffraction is strongest when aperture size is comparable to wavelength.",why:"A narrower slit produces greater angular spreading."},
    {spec:"3.3.2.2",q:"A grating has spacing d. Which condition must be true for order n to exist?",choices:["nλ > d","nλ ≤ d","λ = 0","n > d"],answer:1,hint:"sinθ cannot exceed 1.",why:"From d sinθ = nλ, nλ/d must be at most 1."},
    {spec:"3.3.2.3",q:"Light enters a material with larger refractive index. Its frequency",choices:["increases","decreases","stays the same","becomes zero"],answer:2,hint:"The source fixes frequency.",why:"Frequency is unchanged at a stationary boundary; speed and wavelength change."},
    {spec:"3.3.2.3",q:"Total internal reflection requires light to travel",choices:["from lower n to higher n","from higher n to lower n with incidence above critical angle","at any boundary with incidence 90°","only through air"],answer:1,hint:"Think about the critical angle.",why:"TIR occurs only from higher index to lower index and above θc."},
    {spec:"3.3.2.3",q:"What does modal dispersion do in an optical fibre?",choices:["Broadens pulses because different paths take different times","Increases the refractive index to infinity","Changes light into sound","Eliminates absorption"],answer:0,hint:"Different modes can have different path lengths.",why:"Arrival-time spread broadens the pulse."}
  ],

  spec:[
    ["3.3.1.1","Progressive waves","Amplitude, frequency, wavelength, wave speed, phase and phase difference; use v=fλ and f=1/T.","L1–L2","progressive"],
    ["3.3.1.2","Longitudinal and transverse waves","Direction of oscillation, sound/EM/string examples, polarisation and aligned aerials.","L3","polarisation"],
    ["3.3.1.3","Superposition","Add displacements and use phase/path difference to explain reinforcement and cancellation.","L4","interference"],
    ["3.3.1.3","Stationary waves","Nodes, antinodes, formation from opposite travelling waves and harmonics on strings.","L5","standing"],
    ["RP1","Required Practical 1","Investigate stationary-wave frequency against string length, tension and mass per unit length.","L6","standing"],
    ["3.3.2.1","Interference","Path difference, coherence, sound/EM/light interference and Young double-slit fringes.","L7","doubleSlit"],
    ["RP2","Required Practical 2","Investigate interference using Young double slit and a diffraction grating.","L8","doubleSlit"],
    ["3.3.2.2","Diffraction","Single-slit patterns and qualitative dependence on wavelength and slit width.","L9","diffraction"],
    ["3.3.2.2","Diffraction grating","Plane transmission grating at normal incidence; use d sinθ=nλ and applications.","L10","grating"],
    ["3.3.2.3","Refraction","Refractive index, Snell's law, critical angle and total internal reflection.","L11","refraction"],
    ["3.3.2.3","Optical fibres","Step-index fibres, cladding, material/modal dispersion, pulse broadening and absorption.","L12","fibre"]
  ]
};