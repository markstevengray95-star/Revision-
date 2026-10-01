window.FM_DETAIL = {
  "radians": {
    deepDive:[
      ["Radian definition and conversion","Radians are defined geometrically by θ=s/r. Because s and r are both lengths, radian measure is dimensionless even though 'rad' is normally written. Use 180°=π rad, so degrees × π/180 = radians and radians × 180/π = degrees."],
      ["Angular quantities","Angular displacement θ tells how far around a circle an object has moved. Angular speed ω is the rate of change of angular displacement. For uniform rotation, ω is constant and ω=2π/T=2πf."],
      ["Linear–angular connection","Every point on a rigid rotating body completes each revolution in the same time, so all points have the same ω and f. A point farther from the axis travels a larger circumference in the same time, therefore v=ωr is larger."],
      ["Units and scale","θ in rad, ω in rad s⁻¹, f in Hz and T in s. Always convert rpm or rev min⁻¹ to rev s⁻¹ before using ω=2πf."]
    ],
    maths:[
      "Convert 120° to radians: 120×π/180 = 2π/3 rad.",
      "Convert 90 rpm to Hz: 90/60 = 1.5 Hz, then ω = 2π×1.5 = 9.42 rad s⁻¹.",
      "From s=rθ, if r=0.40 m and θ=1.8 rad then s=0.72 m.",
      "Proportionality: at fixed ω, v∝r; at fixed r, v∝ω."
    ],
    graphs:[
      "For uniform circular motion, θ against t is a straight line; its gradient is ω.",
      "If ω changes, the gradient of θ–t changes.",
      "v against r is a straight line through the origin when ω is constant; gradient = ω."
    ],
    mustBeAble:[
      "Define one radian.",
      "Convert reliably between degrees, revolutions and radians.",
      "Use ω=2πf and T=1/f.",
      "Use v=ωr and explain why v varies with r on a rigid body.",
      "Estimate sensible magnitudes and check units."
    ],
    extendedExample:{
      q:"A centrifuge rotates at 3600 rpm. A sample is 0.12 m from the axis. Find f, ω and tangential speed.",
      steps:["f=3600/60=60 Hz","ω=2πf=377 rad s⁻¹","v=ωr=377×0.12=45.2 m s⁻¹","Check: the outer point travels one circumference 2πr≈0.754 m, 60 times each second, giving ≈45.2 m s⁻¹."]
    }
  },
  "centripetal-accel": {
    deepDive:[
      ["Why there is acceleration","Acceleration is rate of change of velocity, and velocity includes direction. In uniform circular motion the speed is constant but the direction changes continuously, so acceleration is non-zero."],
      ["Vector directions","Velocity is tangential to the circle. Centripetal acceleration is radial and points toward the centre. They are perpendicular at every instant in uniform circular motion."],
      ["Dependence on speed and radius","a=v²/r. At fixed r, doubling v gives four times a. At fixed v, doubling r halves a. Using v=ωr gives a=ω²r, so at fixed ω a increases with r."],
      ["Scope of AQA","Students need to use the centripetal-acceleration formula and interpret it physically; the formal derivation is not required by the specification."]
    ],
    maths:[
      "Rearrangements: v=√(ar), r=v²/a.",
      "Using angular speed: a=ω²r.",
      "If v changes by factor k at fixed r, a changes by factor k².",
      "Always use radius in metres."
    ],
    graphs:[
      "At fixed r, a against v² is a straight line through the origin with gradient 1/r.",
      "At fixed v, a against 1/r is a straight line through the origin with gradient v².",
      "At fixed ω, a against r is linear through the origin with gradient ω²."
    ],
    mustBeAble:[
      "Explain acceleration at constant speed.",
      "State velocity and acceleration directions.",
      "Use a=v²/r and a=ω²r.",
      "Use proportional reasoning without full recalculation.",
      "Distinguish centripetal acceleration from tangential acceleration."
    ],
    extendedExample:{
      q:"A car travels at 18 m s⁻¹ around a bend of radius 54 m. It then travels around the same bend at 27 m s⁻¹. Compare the centripetal accelerations.",
      steps:["First a=18²/54=6.0 m s⁻²","Second a=27²/54=13.5 m s⁻²","Speed ratio=27/18=1.5","Acceleration ratio=1.5²=2.25, and 13.5/6.0=2.25."]
    }
  },
  "centripetal-force": {
    deepDive:[
      ["Resultant, not new force","Centripetal force means the resultant radial force toward the centre. Identify real forces first: friction, tension, gravity, normal reaction or components of these."],
      ["Newton's second law","Because radial acceleration is v²/r, the radial resultant is ΣF_radial=mv²/r=mω²r."],
      ["Common contexts","Flat bend: friction supplies radial force. Satellite: gravity supplies it. Object on a string: tension contributes. Vertical circle: the radial resultant changes because weight may help or oppose the required inward resultant depending on position."],
      ["Free-body diagrams","Draw only forces acting on the chosen object. Then choose the radial direction and resolve forces along it. Do not add an extra centripetal-force arrow."]
    ],
    maths:[
      "Rearrange F=mv²/r for v=√(Fr/m).",
      "At fixed m and r, F∝v².",
      "At fixed v and r, F∝m.",
      "At fixed m and ω, F∝r."
    ],
    graphs:[
      "F against v² is linear for fixed m and r.",
      "F against 1/r is linear for fixed m and v.",
      "A free-body diagram is often more important than a graph: label real forces and radial direction clearly."
    ],
    mustBeAble:[
      "Identify the physical force providing the radial resultant.",
      "Use ΣF_radial=mv²/r with correct signs.",
      "Draw accurate free-body diagrams.",
      "Explain why 'centripetal force' is not an additional interaction.",
      "Solve unfamiliar rotating-system problems."
    ],
    extendedExample:{
      q:"A 900 kg car takes a flat bend of radius 50 m at 14 m s⁻¹. Find the required frictional force.",
      steps:["On a flat bend, horizontal friction provides the radial resultant.","F=mv²/r=900×14²/50","F=3528 N ≈ 3.53 kN toward the centre.","If available friction is less than this, the car cannot maintain that circular path at that speed."]
    }
  },
  "shm-condition": {
    deepDive:[
      ["Precise definition","For SHM, acceleration is directly proportional to displacement from equilibrium and opposite in direction: a∝−x."],
      ["Defining equation","a=−ω²x. The negative sign is essential because it indicates restoring acceleration. ω determines how rapidly the oscillator cycles."],
      ["Position dependence","At x=0, a=0. At x=±A, |a| is maximum. Acceleration changes continuously and is not constant."],
      ["Restoring force version","Using F=ma gives F=−mω²x. Any system whose resultant force is proportional to −x will execute ideal SHM for the region where that proportionality holds."]
    ],
    maths:[
      "Gradient of an a–x graph is −ω².",
      "Therefore ω=√(|gradient|).",
      "Then T=2π/ω and f=ω/2π.",
      "Sign reasoning: positive x gives negative a; negative x gives positive a."
    ],
    graphs:[
      "a against x is a straight line through the origin with negative gradient −ω².",
      "A steeper negative gradient means larger ω and therefore shorter period.",
      "The graph directly tests the defining SHM condition."
    ],
    mustBeAble:[
      "State both parts of the SHM definition.",
      "Use a=−ω²x including sign.",
      "Interpret an a–x graph.",
      "Find ω or T from graph gradient.",
      "Recognise when a restoring-force relationship is or is not SHM."
    ],
    extendedExample:{
      q:"An a–x graph has gradient −64 s⁻². Find ω, f and T.",
      steps:["Gradient=−ω², so ω²=64","ω=8.0 rad s⁻¹","f=ω/(2π)=1.27 Hz","T=1/f=0.785 s."]
    }
  },
  "shm-graphs": {
    deepDive:[
      ["Displacement equation","A convenient starting condition is x=A cos(ωt), meaning the oscillator starts at +A. Other sine/cosine forms are possible depending on starting conditions."],
      ["Velocity","v=dx/dt=−Aω sin(ωt). Velocity is zero at turning points and has maximum magnitude Aω at equilibrium."],
      ["Acceleration","a=dv/dt=−Aω² cos(ωt)=−ω²x. Acceleration is exactly opposite in phase to displacement."],
      ["Phase relationships","x and a differ by π rad. v is π/2 rad out of phase with x. Use the physical motion to determine signs rather than memorising one graph blindly."]
    ],
    maths:[
      "At t=0 for x=A cosωt: x=+A, v=0, a=−ω²A.",
      "At T/4: x=0, speed is maximum toward negative x, a=0.",
      "At T/2: x=−A, v=0, a=+ω²A.",
      "Gradient links: gradient of x–t is v; gradient of v–t is a."
    ],
    graphs:[
      "x–t, v–t and a–t are sinusoidal with the same period.",
      "v peaks when x crosses zero.",
      "a peaks when |x| is maximum and has opposite sign to x.",
      "When sketching, align key times 0, T/4, T/2, 3T/4, T."
    ],
    mustBeAble:[
      "Sketch all three graphs from a stated starting condition.",
      "Use gradient arguments to connect them.",
      "State phase differences in radians.",
      "Read amplitude, period and frequency from a graph.",
      "Use graph signs to identify direction of motion and acceleration."
    ],
    extendedExample:{
      q:"An oscillator starts at +A at t=0 with T=0.80 s. State x, v and a qualitatively at 0.20 s and 0.40 s.",
      steps:["0.20 s=T/4: x=0, velocity has maximum magnitude toward −x, a=0.","0.40 s=T/2: x=−A, v=0, acceleration is maximum toward +x.","These positions follow directly from quarter-cycle phase progression."]
    }
  },
  "shm-extremes": {
    deepDive:[
      ["Maximum speed","vmax=ωA and occurs at equilibrium. Increasing A or ω increases the maximum speed."],
      ["Maximum acceleration","amax=ω²A and occurs at the turning points."],
      ["Speed at displacement","v²=ω²(A²−x²), so |v|=ω√(A²−x²). The sign of velocity depends on direction of travel."],
      ["Physical interpretation","At equilibrium, restoring force and acceleration are zero but kinetic energy and speed are maximum. At turning points the reverse is true."]
    ],
    maths:[
      "Check that x≤A before using √(A²−x²).",
      "If ω doubles at fixed A: vmax doubles, amax quadruples.",
      "If A doubles at fixed ω: both vmax and amax double.",
      "Use metres for A and x."
    ],
    graphs:[
      "v² against x² is linear: v²=ω²A²−ω²x².",
      "|v| against x forms the upper half of an ellipse-like relation, zero at ±A and maximum at 0.",
      "|a| increases linearly with |x|."
    ],
    mustBeAble:[
      "Calculate vmax and amax.",
      "Calculate speed at arbitrary x.",
      "Use proportional reasoning.",
      "Explain why x alone does not determine the sign of v.",
      "Link extremes to energy changes."
    ],
    extendedExample:{
      q:"A=0.080 m, T=0.50 s. Find vmax and the speed at x=0.040 m.",
      steps:["ω=2π/T=12.57 rad s⁻¹","vmax=ωA=1.01 m s⁻¹","v=ω√(A²−x²)=12.57√(0.080²−0.040²)","v=0.871 m s⁻¹ in magnitude."]
    }
  },
  "spring": {
    deepDive:[
      ["Why a spring gives SHM","For extension/compression x measured from equilibrium, Hooke's law gives restoring force F=−kx. Therefore a=F/m=−(k/m)x."],
      ["Comparing equations","Compare a=−(k/m)x with a=−ω²x to obtain ω²=k/m, so ω=√(k/m) and T=2π√(m/k)."],
      ["Vertical spring","Weight changes the equilibrium position, but when displacement x is measured from equilibrium the mg term is already balanced by the static spring force. The oscillation equation still reduces to the SHM form."],
      ["Limits","The ideal relation assumes Hooke's law, small enough deformation, negligible damping and effectively constant spring mass unless corrections are introduced."]
    ],
    maths:[
      "Linear form: T²=(4π²/k)m.",
      "Gradient of T² against m =4π²/k, so k=4π²/gradient.",
      "Alternatively at fixed m, T² against 1/k is linear.",
      "Percentage uncertainty in T is reduced by timing many oscillations."
    ],
    graphs:[
      "F–x is linear with negative restoring gradient if direction is included.",
      "T²–m should be a straight line through the origin for the ideal model.",
      "A non-zero intercept can indicate effective spring mass or systematic timing/measurement effects."
    ],
    mustBeAble:[
      "Derive the SHM equation from Hooke's law.",
      "Use T=2π√(m/k).",
      "Linearise for graph analysis.",
      "Explain the role of equilibrium in a vertical spring.",
      "Evaluate RP7 spring data."
    ],
    extendedExample:{
      q:"A T²–m graph has gradient 1.80 s² kg⁻¹. Estimate k.",
      steps:["gradient=4π²/k","k=4π²/1.80","k=21.9 N m⁻¹","State an appropriate number of significant figures from the graph precision."]
    }
  },
  "pendulum": {
    deepDive:[
      ["Restoring component","For a pendulum bob, tangential restoring force is −mg sinθ. The negative sign indicates motion toward equilibrium."],
      ["Small-angle approximation","For small θ in radians, sinθ≈θ. With arc displacement x≈Lθ, a_t≈−(g/L)x, matching SHM."],
      ["Period","Comparing with a=−ω²x gives ω²=g/L and T=2π√(L/g)."],
      ["Conditions","The model works best for small angles, a point-like bob, light inextensible string and negligible air resistance/pivot friction."]
    ],
    maths:[
      "Linear form: T²=(4π²/g)L.",
      "Gradient of T² against L =4π²/g, so g=4π²/gradient.",
      "Mass cancels from the dynamics, so ideal period is independent of bob mass.",
      "If L quadruples, T doubles."
    ],
    graphs:[
      "T² against L is linear through the origin ideally.",
      "At larger amplitudes the measured period becomes slightly longer than the small-angle prediction.",
      "Plot residuals or compare repeat spread when evaluating precision."
    ],
    mustBeAble:[
      "Explain the small-angle approximation.",
      "Use T=2π√(L/g).",
      "Linearise and extract g from gradient.",
      "Describe RP7 method and uncertainties.",
      "Explain why mass does not affect ideal period."
    ],
    extendedExample:{
      q:"A T²–L graph has gradient 4.10 s² m⁻¹. Estimate g.",
      steps:["gradient=4π²/g","g=4π²/4.10","g=9.63 m s⁻²","Compare with 9.81 m s⁻² and discuss possible systematic errors."]
    }
  },
  "shm-energy": {
    deepDive:[
      ["Spring potential energy","For an ideal spring, Ep=½kx² measured from equilibrium."],
      ["Total energy","At x=A, v=0, so Etotal=½kA². In undamped motion this total remains constant."],
      ["Kinetic energy","Ek=Etotal−Ep=½k(A²−x²). This is consistent with v²=ω²(A²−x²)."],
      ["Time behaviour","Because x² is involved, energy varies at twice the oscillation frequency: KE and PE repeat every T/2 even though x repeats every T."]
    ],
    maths:[
      "At x=A/√2, Ep=½Etotal and Ek=½Etotal.",
      "At x=0, Ep=0 and Ek=Etotal.",
      "At x=±A, Ek=0.",
      "If amplitude doubles, total energy quadruples because E∝A²."
    ],
    graphs:[
      "Ep against x is an upward parabola.",
      "Ek against x is an inverted parabola within −A to +A.",
      "Total energy against x is a horizontal line.",
      "KE–time and PE–time are always non-negative and alternate maxima."
    ],
    mustBeAble:[
      "Use Ep, Ek and total-energy equations.",
      "Interpret energy graphs.",
      "Explain energy transfer through a cycle.",
      "Relate amplitude to total energy.",
      "Recognise the effect of damping as declining total mechanical energy."
    ],
    extendedExample:{
      q:"A spring oscillator has k=50 N m⁻¹ and A=0.060 m. Find KE at x=0.030 m.",
      steps:["Etotal=½kA²=0.090 J","Ep=½kx²=0.0225 J","Ek=0.090−0.0225=0.0675 J"]
    }
  },
  "damping": {
    deepDive:[
      ["Cause of damping","Resistive forces such as friction or drag oppose motion and transfer mechanical energy to internal energy of the oscillator/surroundings."],
      ["Light damping","The system oscillates many times while amplitude progressively decreases."],
      ["Critical damping","The system returns to equilibrium in the shortest possible time without overshooting."],
      ["Heavy damping","The system does not oscillate but returns more slowly than at critical damping."],
      ["Design choices","Vehicle suspension, door closers and measuring instruments are chosen to balance fast response, stability and comfort."]
    ],
    maths:[
      "AQA mainly requires qualitative treatment of damping rather than a specific exponential-decay equation.",
      "Lower amplitude means lower total mechanical energy; for a spring E∝A².",
      "If amplitude is reduced to half, spring-oscillator energy is reduced to one quarter, assuming k unchanged."
    ],
    graphs:[
      "Light damping: oscillatory x–t graph with shrinking envelope.",
      "Critical damping: fastest monotonic return to x=0.",
      "Heavy damping: slower monotonic return.",
      "Compare all graphs from identical initial displacement."
    ],
    mustBeAble:[
      "Distinguish light, critical and heavy damping.",
      "Explain damping using energy transfer.",
      "Identify damping regimes from graphs.",
      "Explain why critical damping is useful.",
      "Connect damping to resonance."
    ],
    extendedExample:{
      q:"Two sensors are displaced and released. A returns to zero without overshoot in 0.4 s; B returns without overshoot in 1.2 s. Which is more likely critically damped?",
      steps:["Critical damping is the fastest non-oscillatory return.","A returns faster and does not overshoot.","Therefore A is more consistent with critical damping; B is more heavily damped."]
    }
  },
  "resonance": {
    deepDive:[
      ["Free vibration","After displacement and release, a system tends to oscillate at its natural frequency."],
      ["Forced vibration","A periodic external force drives the oscillator. After transients, the system responds at the driving frequency."],
      ["Resonance","When driving frequency is close to natural frequency, energy transfer per cycle is especially effective, producing a large steady-state amplitude when damping is small."],
      ["Damping effect","Greater damping lowers the resonance peak and broadens it, reducing sharpness and maximum amplitude."],
      ["Examples","Mechanical: vehicle suspension, buildings, bridges and machines. Stationary waves: strings and air columns resonate at allowed natural modes."]
    ],
    maths:[
      "Resonance is identified by comparing f_drive with f_natural.",
      "Q-factor equations are not required in this core section, so focus on peak height/width qualitatively.",
      "Changing mass or stiffness of a spring system changes its natural frequency and therefore shifts resonance."
    ],
    graphs:[
      "Plot response amplitude against driving frequency.",
      "Low damping gives a tall narrow peak.",
      "High damping gives a lower broader peak.",
      "The peak lies near the natural frequency."
    ],
    mustBeAble:[
      "Define free and forced vibration.",
      "Explain resonance in terms of frequency and energy transfer.",
      "Sketch/interpret resonance curves.",
      "Explain damping effects.",
      "Apply resonance ideas to mechanical and stationary-wave systems."
    ],
    extendedExample:{
      q:"A machine produces a periodic force at 12 Hz and a support has natural frequency 11.8 Hz. Explain why vibration may be large and suggest a remedy.",
      steps:["The driving frequency is close to the natural frequency, so resonance can occur.","Energy transfer is efficient and response amplitude becomes large.","Change stiffness/mass to shift natural frequency or increase damping to reduce the peak."]
    }
  },
  "internal-energy": {
    deepDive:[
      ["Definition","Internal energy is the sum of randomly distributed kinetic energies and potential energies of the particles in a body."],
      ["Kinetic contribution","Random translational, rotational and vibrational motion contributes to microscopic kinetic energy depending on the material/model."],
      ["Potential contribution","Intermolecular forces mean energy is associated with particle separation/arrangement. This is particularly important during changes of state."],
      ["Energy transfer","Internal energy changes when energy is transferred by heating or by mechanical work. Heating is a process, not a store of energy."],
      ["Temperature and state","A temperature rise is associated with increased average random kinetic energy. During a constant-temperature phase change, internal energy can still increase because the potential-energy contribution changes."]
    ],
    maths:[
      "Use an energy balance: change in internal energy = net energy transferred into the system.",
      "For heating without change of state, use Q=mcΔT.",
      "For a phase change at constant temperature, use Q=ml.",
      "In multi-stage questions, calculate each stage separately."
    ],
    graphs:[
      "Heating curves show sloping temperature-rise regions and flat phase-change regions.",
      "Internal energy can increase across both types of region even though temperature rises only on sloping sections."
    ],
    mustBeAble:[
      "Define internal energy precisely.",
      "Explain heating vs temperature.",
      "Explain phase changes in particle-energy terms.",
      "Apply energy conservation across thermal processes.",
      "Avoid the phrase 'heat contained in an object'."
    ],
    extendedExample:{
      q:"A substance is heated and begins to melt while its temperature remains at 350 K. Explain what happens to internal energy.",
      steps:["Energy continues to enter by heating.","Mean random kinetic energy stays approximately constant because temperature stays constant.","Particle arrangement changes and the potential-energy contribution increases.","Therefore total internal energy increases despite constant temperature."]
    }
  },
  "specific-heat": {
    deepDive:[
      ["Definition","Specific heat capacity c is the energy required to raise the temperature of 1 kg of a substance by 1 K, without a change of state."],
      ["Equation","Q=mcΔT. The temperature interval has the same numerical size in kelvin and degrees Celsius."],
      ["Electrical method","Measure mass m, electrical power P=VI, heating time t and temperature change. If losses are negligible, VIt≈mcΔT."],
      ["Heat capacity of apparatus","The heater, container and thermometer may absorb energy. Ignoring this can bias the calculated c."],
      ["Experimental evaluation","Reduce heat loss with insulation/lid, mix where appropriate, use temperature logging, repeat measurements, calibrate sensors and account for apparatus thermal capacity if required."]
    ],
    maths:[
      "c=Q/(mΔT).",
      "For constant power, ideal slope dT/dt=P/(mc).",
      "If electrical measurements are used, Q≈VIt.",
      "Percentage uncertainty in ΔT can be large if the temperature rise is small."
    ],
    graphs:[
      "Temperature against time is approximately linear over a limited range if power and losses are roughly constant.",
      "Gradient can be used with P/(mc), but real curves may flatten as heat loss increases with temperature difference."
    ],
    mustBeAble:[
      "Define c and state units.",
      "Use Q=mcΔT.",
      "Describe an electrical or mixtures method.",
      "Identify random/systematic errors.",
      "Suggest realistic improvements."
    ],
    extendedExample:{
      q:"A 1.20 kg aluminium block is heated electrically at 55 W for 300 s and rises by 14.5 K. Ignore losses. Find c.",
      steps:["Energy supplied=Pt=55×300=16500 J","c=Q/(mΔT)=16500/(1.20×14.5)","c=948 J kg⁻¹ K⁻¹"]
    }
  },
  "continuous-flow": {
    deepDive:[
      ["Steady-flow idea","A fluid passes continuously through a heater. At steady state, inlet and outlet temperatures remain constant with time."],
      ["Derivation","Q=mcΔT. Divide by time: Q/t=(m/t)cΔT. Since Q/t=P and m/t=ṁ, P=ṁcΔT."],
      ["Interpretation","At fixed power, a larger mass flow rate means less energy per kilogram, so the temperature rise is smaller."],
      ["Real systems","Some power heats the apparatus or is lost to surroundings. Measurements can be designed so these losses are estimated or reduced."]
    ],
    maths:[
      "ṁ must be in kg s⁻¹.",
      "ΔT=P/(ṁc).",
      "c=P/(ṁΔT).",
      "Convert g s⁻¹ to kg s⁻¹ by dividing by 1000."
    ],
    graphs:[
      "At fixed P and c, ΔT against 1/ṁ is linear through the origin ideally.",
      "At fixed ṁ and c, ΔT against P is linear."
    ],
    mustBeAble:[
      "Derive P=ṁcΔT.",
      "Use mass flow rate correctly.",
      "Convert units.",
      "Explain inverse dependence of ΔT on flow rate.",
      "Discuss heat-loss limitations."
    ],
    extendedExample:{
      q:"Oil with c=2100 J kg⁻¹ K⁻¹ flows at 18 g s⁻¹ through a 900 W heater. Estimate the temperature rise.",
      steps:["ṁ=18 g s⁻¹=0.018 kg s⁻¹","ΔT=P/(ṁc)=900/(0.018×2100)","ΔT=23.8 K"]
    }
  },
  "latent-heat": {
    deepDive:[
      ["Definition","Specific latent heat l is the energy needed per kilogram to change state without a temperature change."],
      ["Fusion and vaporisation","Different transitions have different latent heats, such as specific latent heat of fusion and vaporisation."],
      ["Particle model","During a phase change, supplied energy changes particle separation/arrangement and hence potential energy rather than increasing mean kinetic energy."],
      ["Heating curves","At constant input power, sloping sections correspond to increasing temperature; flat sections correspond to phase change."],
      ["Data logging","AQA highlights using a data logger and temperature sensor to record temperature against time while energy is supplied at a constant rate."]
    ],
    maths:[
      "Q=ml.",
      "Multi-stage total Q = sum of mcΔT terms and ml terms.",
      "At constant power P, time spent on a phase-change plateau t=ml/P if losses are neglected.",
      "Units: l in J kg⁻¹."
    ],
    graphs:[
      "Temperature–time heating curve: gradients depend on P/(mc).",
      "Plateau duration depends on ml/P.",
      "Greater latent heat gives a longer plateau at fixed m and P."
    ],
    mustBeAble:[
      "Define latent heat.",
      "Use Q=ml.",
      "Explain a phase-change plateau.",
      "Solve multi-stage thermal-energy problems.",
      "Describe/evaluate a constant-power data-logger investigation."
    ],
    extendedExample:{
      q:"0.15 kg of ice at 0°C is melted then the water is heated to 20°C. Use lf=3.34×10⁵ J kg⁻¹ and c=4200 J kg⁻¹ K⁻¹.",
      steps:["Melting: Q1=ml=0.15×3.34×10⁵=5.01×10⁴ J","Heating water: Q2=mcΔT=0.15×4200×20=1.26×10⁴ J","Total Q=6.27×10⁴ J"]
    }
  },
  "gas-laws": {
    deepDive:[
      ["Boyle's law","For a fixed mass of gas at constant temperature, pV=constant, so p∝1/V."],
      ["Charles's law","For a fixed mass of gas at constant pressure, V/T=constant using absolute temperature, so V∝T."],
      ["Pressure law","At constant volume, p/T=constant, so p∝T."],
      ["Combined relation","For a fixed amount of ideal gas, pV/T is constant between states."],
      ["Conditions matter","The named variables must be held constant as stated. Rapid compression/expansion can change gas temperature and invalidate a Boyle's-law measurement."]
    ],
    maths:[
      "Boyle: p1V1=p2V2.",
      "Charles: V1/T1=V2/T2.",
      "Pressure law: p1/T1=p2/T2.",
      "Combined: p1V1/T1=p2V2/T2.",
      "All T values must be in kelvin."
    ],
    graphs:[
      "Boyle: p vs V is a hyperbola; p vs 1/V is linear.",
      "Charles: V vs T(K) is linear through the origin ideally.",
      "Pressure law: p vs T(K) is linear through the origin ideally."
    ],
    mustBeAble:[
      "State each gas law with conditions.",
      "Choose and rearrange the correct relationship.",
      "Use kelvin.",
      "Linearise experimental relationships.",
      "Explain trends using molecular collisions."
    ],
    extendedExample:{
      q:"A gas changes from 100 kPa, 2.5×10⁻³ m³, 300 K to 1.8×10⁻³ m³ and 360 K. Find final pressure.",
      steps:["p1V1/T1=p2V2/T2","p2=p1V1T2/(T1V2)","p2=100×2.5×360/(300×1.8) kPa","p2=167 kPa"]
    }
  },
  "absolute-zero": {
    deepDive:[
      ["Kelvin scale","Thermodynamic temperature uses absolute zero as 0 K. Celsius and kelvin have equal-sized intervals but different zero points."],
      ["Conversion","T/K = θ/°C + 273.15. For most A-level calculations, 273 is adequate unless precision requires 273.15."],
      ["Gas-law meaning","Direct proportionalities such as V∝T and p∝T only work with absolute temperature."],
      ["Extrapolation","Idealised gas data extrapolate toward zero volume or pressure near −273°C, supporting the concept of absolute zero, though real gases condense before reaching that limit."]
    ],
    maths:[
      "20°C=293 K approximately.",
      "−50°C=223 K approximately.",
      "A temperature difference of 20 K is numerically the same size as a difference of 20°C.",
      "Ratios must use absolute temperatures, not Celsius values."
    ],
    graphs:[
      "V vs Celsius temperature extrapolates to zero near −273°C.",
      "V vs kelvin temperature is linear through the origin in the ideal model."
    ],
    mustBeAble:[
      "Convert °C↔K.",
      "Explain absolute zero conceptually.",
      "Explain why gas laws require kelvin.",
      "Interpret extrapolated gas-law graphs.",
      "Avoid saying that real-gas particles literally become completely motionless at an experimentally reachable 0 K."
    ],
    extendedExample:{
      q:"A gas has volume 50 cm³ at 27°C and constant pressure. Estimate its volume at 87°C.",
      steps:["T1=300 K, T2=360 K","V2=V1T2/T1=50×360/300","V2=60 cm³"]
    }
  },
  "ideal-gas-moles": {
    deepDive:[
      ["Ideal gas equation","pV=nRT links macroscopic pressure, volume, amount and absolute temperature."],
      ["Amount of substance","n=m/M, where M is molar mass. Keep units consistent; SI uses kg and kg mol⁻¹."],
      ["Gas constant","R≈8.31 J mol⁻¹ K⁻¹. Because 1 Pa m³ = 1 J, the units are consistent."],
      ["Idealisation","An ideal gas has negligible molecular volume and intermolecular forces except during collisions. Real gases behave more ideally at low density and away from condensation."],
      ["State changes","For fixed n, pV/T is constant. Use full pV=nRT when amount changes or an absolute state value is required."]
    ],
    maths:[
      "p=nRT/V; V=nRT/p; T=pV/(nR); n=pV/(RT).",
      "Convert dm³ to m³ by ×10⁻³ and cm³ to m³ by ×10⁻⁶.",
      "Convert kPa to Pa by ×10³.",
      "Use kelvin."
    ],
    graphs:[
      "At fixed n,T: p∝1/V.",
      "At fixed n,p: V∝T.",
      "At fixed n,V: p∝T."
    ],
    mustBeAble:[
      "Use pV=nRT in SI units.",
      "Use n=m/M.",
      "Explain ideal-gas assumptions qualitatively.",
      "Choose appropriate gas-law or ideal-gas method.",
      "Check orders of magnitude."
    ],
    extendedExample:{
      q:"4.4 g of CO₂ (M=44 g mol⁻¹) occupies 2.0×10⁻³ m³ at 300 K. Find pressure.",
      steps:["n=m/M=4.4/44=0.100 mol","p=nRT/V","p=0.100×8.31×300/(2.0×10⁻³)","p=1.25×10⁵ Pa"]
    }
  },
  "ideal-gas-molecules": {
    deepDive:[
      ["Molecular equation","pV=NkT where N is number of molecules and k is Boltzmann constant."],
      ["Avogadro connection","N=nN_A. Substitution into pV=NkT gives pV=nN_AkT, so R=N_Ak."],
      ["Constants","N_A≈6.02×10²³ mol⁻¹, k≈1.38×10⁻²³ J K⁻¹, R≈8.31 J mol⁻¹ K⁻¹."],
      ["Molecular mass","Mass of one molecule m0=M/N_A when molar mass M is in kg mol⁻¹."],
      ["Choosing form","Use pV=nRT for moles; use pV=NkT for individual-particle count."]
    ],
    maths:[
      "N=nN_A.",
      "n=N/N_A.",
      "k=R/N_A.",
      "molecule mass = molar mass/N_A.",
      "Scientific notation and powers of ten are central."
    ],
    graphs:[
      "At fixed V and N, p vs T is linear with gradient Nk/V.",
      "At fixed T and V, p vs N is linear."
    ],
    mustBeAble:[
      "Switch between n and N.",
      "Use R=N_Ak.",
      "Use pV=NkT.",
      "Calculate molecular mass from molar mass.",
      "Handle scientific notation accurately."
    ],
    extendedExample:{
      q:"0.25 mol of gas contains how many molecules, and what is the value of R predicted from N_Ak?",
      steps:["N=nN_A=0.25×6.02×10²³=1.51×10²³ molecules","N_Ak=6.02×10²³×1.38×10⁻²³","R≈8.31 J mol⁻¹ K⁻¹"]
    }
  },
  "rp8-boyle": {
    deepDive:[
      ["Aim","Test pV=constant for a fixed mass of gas while temperature is kept constant."],
      ["Method","Trap gas in a syringe/tube or Boyle's-law apparatus, vary V, allow thermal equilibration, then read p and V."],
      ["Data processing","Calculate pV for each reading and/or plot p against 1/V. A straight line supports p∝1/V."],
      ["Uncertainties","Volume scale resolution, pressure-sensor resolution/calibration, dead volume, leaks and parallax can affect results."],
      ["Temperature control","Compression warms gas and expansion cools it. Move the piston slowly and wait before readings."]
    ],
    maths:[
      "Convert volumes consistently.",
      "For linearisation use x=1/V and y=p.",
      "Use gradient and intercept with uncertainties if required.",
      "Compare percentage spread in pV."
    ],
    graphs:[
      "p vs V: inverse curve.",
      "p vs 1/V: straight line ideally through origin.",
      "Scatter beyond uncertainty may indicate temperature drift or leakage."
    ],
    mustBeAble:[
      "Describe a valid method.",
      "Control temperature.",
      "Identify variables and uncertainties.",
      "Linearise Boyle's law.",
      "Evaluate whether data support the relationship."
    ],
    extendedExample:{
      q:"A student measures p=120 kPa at 70 cm³ and p=168 kPa at 50 cm³. Compare pV.",
      steps:["First pV=120×70=8400 kPa cm³","Second pV=168×50=8400 kPa cm³","The equal products are consistent with Boyle's law for those two readings."]
    }
  },
  "rp8-charles": {
    deepDive:[
      ["Aim","Test V∝T for a fixed mass of gas at constant pressure."],
      ["Method","Place trapped gas in baths at different temperatures while maintaining approximately constant pressure. Allow equilibrium before measuring V."],
      ["Kelvin scale","Convert measured Celsius temperatures to kelvin before graphing or ratios."],
      ["Data processing","Plot V against T(K). An ideal relationship is linear and extrapolates toward the origin."],
      ["Uncertainties","Temperature lag, thermometer calibration, volume-reading resolution, leaks and failure to maintain pressure can distort results."]
    ],
    maths:[
      "V/T should be approximately constant.",
      "Linear graph gradient has units volume per kelvin.",
      "If plotting Celsius instead, the intercept near −273°C can be estimated by extrapolation."
    ],
    graphs:[
      "V vs T(K): straight line ideally through origin.",
      "V vs °C: straight line extrapolating to V=0 near −273°C."
    ],
    mustBeAble:[
      "Describe the practical method.",
      "Explain thermal equilibrium.",
      "Use kelvin.",
      "Interpret extrapolation.",
      "Evaluate systematic and random errors."
    ],
    extendedExample:{
      q:"A gas volume rises from 62.0 cm³ at 285 K to 70.5 cm³ at 325 K. Compare V/T.",
      steps:["62.0/285=0.2175 cm³ K⁻¹","70.5/325=0.2169 cm³ K⁻¹","The close values are consistent with Charles's law within experimental uncertainty."]
    }
  },
  "brownian-model": {
    deepDive:[
      ["Observation","Small visible particles suspended in a fluid move irregularly even when no macroscopic flow is present."],
      ["Explanation","The visible particle is bombarded unevenly by much smaller, rapidly moving molecules. The resultant force fluctuates randomly, producing an irregular path."],
      ["Evidence","Brownian motion provided important evidence that matter is made of atoms/molecules in continuous random motion."],
      ["Pressure connection","Gas pressure arises from molecular collisions with container walls and the associated momentum transfer."],
      ["Empirical vs theory","Gas laws were established experimentally; kinetic theory is a theoretical model that explains those empirical relationships."]
    ],
    maths:[
      "No detailed Brownian-motion equation is required here.",
      "Use momentum change Δp and collision rate conceptually when explaining pressure.",
      "Higher T means larger mean molecular kinetic energy and typically larger molecular speeds."
    ],
    graphs:[
      "A Brownian path is irregular rather than smooth/periodic.",
      "Pressure vs temperature at fixed V is explained by increasing collision rate and momentum change."
    ],
    mustBeAble:[
      "Describe Brownian motion.",
      "Explain it in terms of random bombardment.",
      "Explain pressure microscopically.",
      "Explain Boyle/Charles/pressure-law trends using molecules.",
      "Distinguish empirical laws from theoretical models."
    ],
    extendedExample:{
      q:"Explain why pressure increases when a sealed rigid gas container is heated.",
      steps:["Temperature rises, so mean molecular translational kinetic energy rises.","Molecules move faster.","They hit the walls more often and each collision generally involves a larger momentum change.","The rate of momentum transfer increases, so force per area and pressure increase."]
    }
  },
  "kinetic-assumptions": {
    deepDive:[
      ["Ideal kinetic model","Molecules are treated as very small compared with their separations, moving randomly and obeying Newtonian mechanics."],
      ["Collisions","Collisions between molecules and with walls are taken as perfectly elastic, with negligible interaction time; intermolecular forces are neglected except during collision."],
      ["Single collision","For x-velocity c_x, an elastic reversal changes momentum from +mc_x to −mc_x, giving magnitude 2mc_x."],
      ["Collision rate","For a cubic box side L, time between successive collisions with the same wall is 2L/c_x, so collision frequency is c_x/(2L)."],
      ["Summing","Average force contribution is mc_x²/L. Sum over N molecules, divide by area L², then use isotropy ⟨c_x²⟩=⟨c²⟩/3 to obtain pV=(1/3)Nm⟨c²⟩."],
      ["RMS speed","c_rms=√⟨c²⟩. This is not the same as mean velocity, which is zero for random motion in equilibrium."]
    ],
    maths:[
      "Δp=2mc_x for one normal elastic wall collision.",
      "Force=rate of change of momentum.",
      "p=F/A.",
      "pV=(1/3)Nm⟨c²⟩.",
      "Since ρ=Nm/V, p=(1/3)ρc_rms²."
    ],
    graphs:[
      "At fixed density, p against c_rms² is linear.",
      "At fixed volume and particle count, higher speed distribution gives higher pressure."
    ],
    mustBeAble:[
      "State model assumptions.",
      "Follow the algebraic momentum derivation.",
      "Explain the 1/3 factor using three-dimensional isotropy.",
      "Use pV=(1/3)Nm⟨c²⟩ and p=(1/3)ρc_rms².",
      "Define rms speed."
    ],
    extendedExample:{
      q:"A gas has density 0.90 kg m⁻³ and pressure 8.0×10⁴ Pa. Find c_rms.",
      steps:["p=(1/3)ρc_rms²","c_rms=√(3p/ρ)","c_rms=√(3×8.0×10⁴/0.90)","c_rms=516 m s⁻¹"]
    }
  },
  "molecular-ke": {
    deepDive:[
      ["Combine models","Kinetic theory gives pV=(1/3)Nm⟨c²⟩ while the ideal-gas equation gives pV=NkT."],
      ["Mean kinetic energy","Equating them gives (1/3)m⟨c²⟩=kT, so ½m⟨c²⟩=3/2 kT."],
      ["Temperature meaning","Absolute temperature is proportional to mean translational kinetic energy per molecule in the ideal-gas model."],
      ["Mass and speed","At the same T, all ideal-gas molecules have the same mean translational kinetic energy, but lighter molecules must have larger rms speeds than heavier molecules."],
      ["Internal energy","For a monatomic ideal gas, intermolecular potential energy is neglected and internal energy is the sum of translational kinetic energies: U=3/2 NkT=3/2 nRT."]
    ],
    maths:[
      "Mean KE per molecule =3/2 kT.",
      "c_rms=√(3kT/m).",
      "U=3/2 NkT=3/2 nRT for monatomic ideal gas.",
      "If T doubles, mean KE doubles and c_rms increases by √2."
    ],
    graphs:[
      "Mean KE against T is linear through the origin.",
      "c_rms² against T is linear through the origin.",
      "For fixed molecular mass, c_rms∝√T."
    ],
    mustBeAble:[
      "Derive mean KE from the two gas equations.",
      "Use Ēk=3/2 kT.",
      "Use c_rms=√(3kT/m).",
      "Explain mass-speed differences at equal temperature.",
      "Use monatomic ideal-gas internal energy."
    ],
    extendedExample:{
      q:"Compare rms speeds of helium atoms of mass 6.64×10⁻²⁷ kg at 300 K and 1200 K.",
      steps:["c_rms∝√T for fixed mass.","Temperature ratio=1200/300=4.","Speed ratio=√4=2.","At 1200 K the rms speed is twice its value at 300 K."]
    }
  }
};