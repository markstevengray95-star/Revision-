window.FM_CALC = {
"radians":{
 equations:[
  {name:"Radian definition",eq:"θ = s/r",sheet:"Core relation",meaning:"Angle in radians equals arc length divided by radius.",symbols:"θ angle / rad; s arc length / m; r radius / m",units:"rad = m/m",rearrange:"s=rθ ; r=s/θ",conditions:"Use radians."},
  {name:"Angular speed",eq:"ω = 2πf = 2π/T",sheet:"AQA data sheet",meaning:"Angular speed is angle swept per second.",symbols:"ω / rad s⁻¹; f / Hz; T / s",units:"rad s⁻¹",rearrange:"f=ω/(2π); T=2π/ω",conditions:"Uniform circular motion."},
  {name:"Tangential speed",eq:"v = ωr",sheet:"AQA data sheet",meaning:"Links angular motion to linear speed along the circle.",symbols:"v / m s⁻¹; ω / rad s⁻¹; r / m",units:"m s⁻¹",rearrange:"ω=v/r; r=v/ω",conditions:"Instantaneous tangential speed."}
 ],
 strategy:["Convert rpm/rev min⁻¹ to Hz first.","Convert degrees to radians before using s=rθ.","Write the equation before substituting.","Check that radius, not diameter, has been used."],
 practice:[
  {q:"A wheel rotates at 150 rpm. Find its angular speed.",steps:["f=150/60=2.50 Hz","ω=2πf=15.7 rad s⁻¹"],ans:"15.7 rad s⁻¹"},
  {q:"A point 0.35 m from an axis rotates at 8.0 rad s⁻¹. Find its speed.",steps:["v=ωr","v=8.0×0.35=2.80"],ans:"2.80 m s⁻¹"},
  {q:"An arc length is 0.84 m on a circle of radius 0.60 m. Find the angle.",steps:["θ=s/r","θ=0.84/0.60=1.40"],ans:"1.40 rad"}
 ]
},
"centripetal-accel":{
 equations:[
  {name:"Centripetal acceleration",eq:"a = v²/r",sheet:"AQA data sheet",meaning:"Acceleration needed to continually change velocity direction.",symbols:"a / m s⁻²; v / m s⁻¹; r / m",units:"m s⁻²",rearrange:"v=√(ar); r=v²/a",conditions:"Radially inward for circular motion."},
  {name:"Angular form",eq:"a = ω²r",sheet:"AQA data sheet",meaning:"Useful when angular speed is known.",symbols:"ω / rad s⁻¹; r / m",units:"m s⁻²",rearrange:"ω=√(a/r); r=a/ω²",conditions:"Circular motion."}
 ],
 strategy:["Identify whether v or ω is given.","Square the speed/angular speed carefully.","Use radius in metres.","State direction: toward the centre."],
 practice:[
  {q:"A runner moves at 7.5 m s⁻¹ around a 25 m radius curve. Find a.",steps:["a=v²/r","a=7.5²/25=2.25"],ans:"2.25 m s⁻² inward"},
  {q:"A rotor has ω=12 rad s⁻¹ and r=0.18 m. Find a.",steps:["a=ω²r","a=12²×0.18=25.9"],ans:"25.9 m s⁻²"},
  {q:"At fixed radius, speed rises by 20%. By what factor does a change?",steps:["a∝v²","factor=1.20²=1.44"],ans:"1.44 times"}
 ]
},
"centripetal-force":{
 equations:[
  {name:"Centripetal resultant",eq:"F = mv²/r",sheet:"AQA data sheet",meaning:"Required inward resultant force.",symbols:"F / N; m / kg; v / m s⁻¹; r / m",units:"N",rearrange:"v=√(Fr/m); r=mv²/F; m=Fr/v²",conditions:"F is the inward resultant, not an extra force."},
  {name:"Angular form",eq:"F = mω²r",sheet:"AQA data sheet",meaning:"Useful for rotating systems when ω is known.",symbols:"m / kg; ω / rad s⁻¹; r / m",units:"N",rearrange:"ω=√(F/(mr))",conditions:"Use radial resultant."}
 ],
 strategy:["Draw the free-body diagram first.","Choose inward as positive radial direction.","Write ΣF_radial=mv²/r.","Only then substitute forces/components."],
 practice:[
  {q:"A 0.40 kg mass moves at 5.0 m s⁻¹ in a radius 0.80 m circle. Find the inward resultant.",steps:["F=mv²/r","F=0.40×25/0.80=12.5"],ans:"12.5 N"},
  {q:"A 1200 kg car takes a 60 m bend at 15 m s⁻¹. Find required friction.",steps:["F=mv²/r","F=1200×225/60=4500"],ans:"4.50 kN inward"},
  {q:"If speed doubles, what happens to required F at fixed m,r?",steps:["F∝v²","2²=4"],ans:"Four times"}
 ]
},
"shm-condition":{
 equations:[
  {name:"Defining SHM equation",eq:"a = −ω²x",sheet:"AQA data sheet",meaning:"Acceleration is proportional to displacement and directed toward equilibrium.",symbols:"a / m s⁻²; ω / rad s⁻¹; x / m",units:"m s⁻²",rearrange:"ω=√(|a/x|); x=−a/ω²",conditions:"x measured from equilibrium."},
  {name:"Period relation",eq:"ω = 2π/T",sheet:"Derived from angular frequency",meaning:"Links SHM angular frequency to period.",symbols:"ω / rad s⁻¹; T / s",units:"rad s⁻¹",rearrange:"T=2π/ω",conditions:"Periodic motion."}
 ],
 strategy:["Keep the minus sign when discussing direction.","For magnitudes, use |a|=ω²|x|.","From an a–x graph, gradient=−ω².","Use ω to move between graph gradient and period."],
 practice:[
  {q:"At x=+0.030 m, ω=10 rad s⁻¹. Find a.",steps:["a=−ω²x","a=−100×0.030=−3.0"],ans:"−3.0 m s⁻²"},
  {q:"An a–x graph has gradient −49 s⁻². Find T.",steps:["ω=√49=7.0 rad s⁻¹","T=2π/7.0=0.898 s"],ans:"0.898 s"},
  {q:"At x=−0.050 m and a=+2.0 m s⁻², find ω.",steps:["ω²=|a/x|=2.0/0.050=40","ω=√40=6.32"],ans:"6.32 rad s⁻¹"}
 ]
},
"shm-graphs":{
 equations:[
  {name:"Displacement",eq:"x = A cos(ωt)",sheet:"AQA data sheet",meaning:"One valid SHM displacement equation for starting at +A.",symbols:"x,A / m; ω / rad s⁻¹; t / s",units:"m",rearrange:"Use phase ωt to identify position.",conditions:"Starting condition x=+A at t=0."},
  {name:"Velocity",eq:"v = −Aω sin(ωt)",sheet:"Derived by differentiation",meaning:"Velocity is gradient of displacement.",symbols:"v / m s⁻¹",units:"m s⁻¹",rearrange:"vmax=Aω",conditions:"Matches the stated cosine starting condition."},
  {name:"Acceleration",eq:"a = −Aω² cos(ωt)",sheet:"Derived",meaning:"Acceleration is gradient of velocity and equals −ω²x.",symbols:"a / m s⁻²",units:"m s⁻²",rearrange:"amax=Aω²",conditions:"SHM."}
 ],
 strategy:["Identify the starting phase before choosing signs.","Use quarter-cycle checkpoints.","Use gradients to move x→v→a.","Use a=−ω²x as a consistency check."],
 practice:[
  {q:"A=0.050 m, f=2.0 Hz. Find vmax.",steps:["ω=2πf=12.57","vmax=ωA=0.628"],ans:"0.628 m s⁻¹"},
  {q:"For x=A cosωt, what are x and v at t=T/4?",steps:["ωt=π/2","x=A cosπ/2=0","v=−Aω sinπ/2=−Aω"],ans:"x=0, v=−Aω"},
  {q:"If a displacement graph has period 0.40 s, find ω.",steps:["ω=2π/T","ω=2π/0.40=15.7"],ans:"15.7 rad s⁻¹"}
 ]
},
"shm-extremes":{
 equations:[
  {name:"Maximum speed",eq:"vmax = ωA",sheet:"AQA data sheet",meaning:"Largest speed occurs at equilibrium.",symbols:"vmax / m s⁻¹; A / m",units:"m s⁻¹",rearrange:"A=vmax/ω",conditions:"Ideal SHM."},
  {name:"Maximum acceleration",eq:"amax = ω²A",sheet:"AQA data sheet",meaning:"Largest acceleration magnitude occurs at turning points.",symbols:"amax / m s⁻²",units:"m s⁻²",rearrange:"A=amax/ω²",conditions:"Ideal SHM."},
  {name:"Speed at displacement",eq:"v = ±ω√(A²−x²)",sheet:"AQA data sheet",meaning:"Speed/velocity at any displacement.",symbols:"x,A / m",units:"m s⁻¹",rearrange:"x²=A²−v²/ω²",conditions:"|x|≤A; ± gives direction."}
 ],
 strategy:["Calculate ω first if only f or T is given.","Check |x|≤A.","Use magnitude if asked for speed; choose sign if asked for velocity.","Use limiting cases x=0 and x=A to check."],
 practice:[
  {q:"A=0.040 m, f=3.0 Hz. Find vmax.",steps:["ω=18.85 rad s⁻¹","vmax=18.85×0.040=0.754"],ans:"0.754 m s⁻¹"},
  {q:"For the same oscillator find amax.",steps:["amax=ω²A","=18.85²×0.040=14.2"],ans:"14.2 m s⁻²"},
  {q:"A=0.10 m, ω=5.0 rad s⁻¹, x=0.060 m. Find speed.",steps:["v=5√(0.10²−0.060²)","=5√0.0064=0.400"],ans:"0.400 m s⁻¹"}
 ]
},
"spring":{
 equations:[
  {name:"Hooke restoring force",eq:"F = −kx",sheet:"Prior mechanics relation",meaning:"Spring restoring force opposes displacement from equilibrium.",symbols:"F / N; k / N m⁻¹; x / m",units:"N",rearrange:"k=|F|/|x|",conditions:"Within Hooke's-law region."},
  {name:"Angular frequency",eq:"ω = √(k/m)",sheet:"Derived from SHM",meaning:"Natural angular frequency of an ideal mass–spring system.",symbols:"k / N m⁻¹; m / kg",units:"rad s⁻¹",rearrange:"k=mω²; m=k/ω²",conditions:"Ideal spring, negligible damping."},
  {name:"Period",eq:"T = 2π√(m/k)",sheet:"AQA data sheet",meaning:"Period depends on mass and stiffness.",symbols:"T / s",units:"s",rearrange:"k=4π²m/T²; m=kT²/(4π²)",conditions:"Ideal mass–spring SHM."},
  {name:"Linearised practical form",eq:"T² = (4π²/k)m",sheet:"Derived",meaning:"Used in RP7 to obtain k from gradient.",symbols:"gradient / s² kg⁻¹",units:"T² / s²",rearrange:"k=4π²/gradient",conditions:"Plot T² against m."}
 ],
 strategy:["Measure displacement from equilibrium.","Square the period for graph work.","Use gradient, not a single data point, in practical analysis.","Include units for gradient and derived k."],
 practice:[
  {q:"m=0.50 kg, k=32 N m⁻¹. Find T.",steps:["T=2π√(m/k)","=2π√(0.50/32)=0.785"],ans:"0.785 s"},
  {q:"T=1.20 s for m=0.60 kg. Estimate k.",steps:["k=4π²m/T²","=4π²×0.60/1.20²=16.4"],ans:"16.4 N m⁻¹"},
  {q:"T²–m gradient=2.50 s² kg⁻¹. Find k.",steps:["k=4π²/gradient","=39.48/2.50=15.8"],ans:"15.8 N m⁻¹"}
 ]
},
"pendulum":{
 equations:[
  {name:"Small-angle approximation",eq:"sinθ ≈ θ",sheet:"Maths approximation",meaning:"Allows restoring force to become proportional to displacement.",symbols:"θ in radians",units:"dimensionless",rearrange:"Not an algebraic equation to rearrange.",conditions:"Small θ only."},
  {name:"Pendulum period",eq:"T = 2π√(L/g)",sheet:"AQA data sheet",meaning:"Period of an ideal simple pendulum at small angle.",symbols:"T / s; L / m; g / m s⁻²",units:"s",rearrange:"g=4π²L/T²; L=gT²/(4π²)",conditions:"Small angle, negligible damping."},
  {name:"Linearised RP7 form",eq:"T² = (4π²/g)L",sheet:"Derived",meaning:"Used to determine g from a graph.",symbols:"gradient / s² m⁻¹",units:"s²",rearrange:"g=4π²/gradient",conditions:"Plot T² against L."}
 ],
 strategy:["Measure L from pivot to centre of bob.","Convert release angle reasoning to radians for approximation.","Time many oscillations.","Use gradient of best-fit line to determine g."],
 practice:[
  {q:"L=0.64 m. Find T using g=9.81 m s⁻².",steps:["T=2π√(0.64/9.81)","T=1.60 s"],ans:"1.60 s"},
  {q:"T=2.00 s. Estimate L.",steps:["L=gT²/(4π²)","=9.81×4/39.48=0.994"],ans:"0.994 m"},
  {q:"T²–L gradient=4.02 s² m⁻¹. Find g.",steps:["g=4π²/4.02","=9.82"],ans:"9.82 m s⁻²"}
 ]
},
"shm-energy":{
 equations:[
  {name:"Elastic potential energy",eq:"Ep = ½kx²",sheet:"Prior mechanics relation",meaning:"Energy stored at displacement x.",symbols:"Ep / J; k / N m⁻¹; x / m",units:"J",rearrange:"x=√(2Ep/k)",conditions:"Ideal Hookean spring."},
  {name:"Total SHM energy",eq:"E = ½kA²",sheet:"Derived",meaning:"Constant total mechanical energy in undamped spring SHM.",symbols:"A / m",units:"J",rearrange:"A=√(2E/k)",conditions:"No damping."},
  {name:"Kinetic energy",eq:"Ek = ½k(A²−x²)",sheet:"Derived",meaning:"Energy remaining after spring PE.",symbols:"Ek / J",units:"J",rearrange:"x²=A²−2Ek/k",conditions:"Ideal spring SHM."}
 ],
 strategy:["Calculate total energy from amplitude first.","Calculate PE at x.","Use Ek=Etotal−Ep.","Check endpoints: at |x|=A, Ek=0."],
 practice:[
  {q:"k=80 N m⁻¹, A=0.050 m. Find E.",steps:["E=½kA²","=0.5×80×0.0025=0.100"],ans:"0.100 J"},
  {q:"For the same oscillator, find PE at x=0.030 m.",steps:["Ep=½kx²","=0.5×80×0.0009=0.036"],ans:"0.036 J"},
  {q:"Hence find KE at x=0.030 m.",steps:["Ek=0.100−0.036"],ans:"0.064 J"}
 ]
},
"damping":{
 equations:[
  {name:"Energy–amplitude link",eq:"E = ½kA²",sheet:"Derived spring-SHM relation",meaning:"Lets you quantify how declining amplitude implies declining mechanical energy.",symbols:"E / J; A / m",units:"J",rearrange:"E₂/E₁=(A₂/A₁)²",conditions:"Compare same spring k."}
 ],
 strategy:["AQA treatment is mainly qualitative.","Use E∝A² if a numerical energy comparison is required.","Do not invent an exponential equation unless it is given.","Read decay envelopes carefully."],
 practice:[
  {q:"Amplitude falls from 8.0 cm to 4.0 cm. What fraction of spring-SHM mechanical energy remains?",steps:["E∝A²","E2/E1=(4/8)²=0.25"],ans:"25%"},
  {q:"Amplitude becomes 70% of its original value. What fraction of energy remains?",steps:["E2/E1=0.70²=0.49"],ans:"49%"},
  {q:"Which damping regime gives fastest return without oscillation?",steps:["Use definition of critical damping."],ans:"Critical damping"}
 ]
},
"resonance":{
 equations:[
  {name:"Resonance condition",eq:"fdrive ≈ fnatural",sheet:"Qualitative AQA relation",meaning:"Largest response occurs near the system's natural frequency.",symbols:"f / Hz",units:"Hz",rearrange:"Not normally rearranged.",conditions:"Response depends strongly on damping."},
  {name:"Spring natural frequency",eq:"f = (1/2π)√(k/m)",sheet:"Derived from spring period",meaning:"Shows how changing m or k shifts resonance.",symbols:"f / Hz",units:"Hz",rearrange:"k=4π²mf²",conditions:"Ideal mass–spring system."}
 ],
 strategy:["Find natural frequency from system parameters if needed.","Compare with driving frequency.","Use damping qualitatively to explain peak height and width.","Do not treat 'large amplitude' alone as the definition of resonance."],
 practice:[
  {q:"m=0.25 kg, k=100 N m⁻¹. Find natural frequency.",steps:["f=(1/2π)√(k/m)","=(1/2π)√400=3.18"],ans:"3.18 Hz"},
  {q:"A driver operates at 3.2 Hz. Is resonance expected for the system above?",steps:["3.2 Hz is very close to 3.18 Hz."],ans:"Yes, especially if damping is small."},
  {q:"What happens to the resonance peak when damping increases?",steps:["Use qualitative resonance curve."],ans:"Lower and broader"}
 ]
},

"internal-energy":{
 equations:[
  {name:"Thermal energy balance",eq:"ΔU = net energy transferred into the system",sheet:"AQA specifies qualitative first-law treatment",meaning:"Internal energy rises when energy is transferred in by heating or work done on the system.",symbols:"ΔU / J",units:"J",rearrange:"Track energy in and energy out with a clear sign convention.",conditions:"AQA core requires qualitative first-law understanding rather than memorising a particular sign-convention formula."},
  {name:"Temperature-change energy",eq:"Q = mcΔT",sheet:"AQA data sheet",meaning:"Energy needed for a temperature change without a state change.",symbols:"Q / J; m / kg; c / J kg⁻¹ K⁻¹; ΔT / K",units:"J",rearrange:"c=Q/(mΔT); ΔT=Q/(mc); m=Q/(cΔT)",conditions:"No phase change during this stage."},
  {name:"State-change energy",eq:"Q = ml",sheet:"AQA data sheet",meaning:"Energy needed for a change of state at constant temperature.",symbols:"l / J kg⁻¹",units:"J",rearrange:"l=Q/m; m=Q/l",conditions:"Use correct latent heat for the transition."}
 ],
 strategy:["Split a thermal process into stages.","Use mcΔT only on sloping temperature-change stages.","Use ml only on phase-change stages.","Add all stage energies for the total.","State whether internal-energy change is mainly kinetic-energy or potential-energy contribution."],
 practice:[
  {q:"A 0.40 kg substance of c=850 J kg⁻¹ K⁻¹ warms by 35 K. Find Q.",steps:["Q=mcΔT","=0.40×850×35=11900"],ans:"1.19×10⁴ J"},
  {q:"The same 0.40 kg then melts with l=1.8×10⁵ J kg⁻¹. Find extra energy.",steps:["Q=ml","=0.40×1.8×10⁵"],ans:"7.20×10⁴ J"},
  {q:"Find total energy for both stages.",steps:["Qtotal=1.19×10⁴+7.20×10⁴"],ans:"8.39×10⁴ J"},
  {q:"During the melting stage, which microscopic energy contribution changes most?",steps:["Temperature is constant, so mean random KE does not rise.","Particle arrangement changes."],ans:"Potential-energy contribution"}
 ]
},
"specific-heat":{
 equations:[
  {name:"Specific heat capacity",eq:"Q = mcΔT",sheet:"AQA data sheet",meaning:"Thermal energy required for a temperature change.",symbols:"Q / J; m / kg; c / J kg⁻¹ K⁻¹; ΔT / K",units:"J",rearrange:"c=Q/(mΔT)",conditions:"No state change."},
  {name:"Electrical input",eq:"E = Pt = VIt",sheet:"Prior electricity relation",meaning:"Energy supplied by an electrical heater.",symbols:"P / W; V / V; I / A; t / s",units:"J",rearrange:"P=VI; t=E/P",conditions:"Electrical energy supplied; not all necessarily reaches sample."},
  {name:"Ideal heating-rate form",eq:"dT/dt = P/(mc)",sheet:"Derived",meaning:"Ideal temperature–time gradient under constant power.",symbols:"gradient / K s⁻¹",units:"K s⁻¹",rearrange:"c=P/(m·gradient)",conditions:"Negligible losses and constant c."},
  {name:"Including apparatus heat capacity",eq:"Pt ≈ (mc + C_apparatus)ΔT + losses",sheet:"Extended energy balance",meaning:"Shows why apparatus absorbs some energy.",symbols:"C_apparatus / J K⁻¹",units:"J",rearrange:"Use if heat capacity of container is known.",conditions:"Approximate experimental model."}
 ],
 strategy:["Find electrical energy input first.","Decide whether losses/apparatus heating are ignored or included.","Use ΔT, not final temperature.","For graph questions, gradient=ΔT/Δt.","Comment on why measured c may differ from accepted value."],
 practice:[
  {q:"A 0.75 kg block receives 24 kJ and rises 32 K. Find c.",steps:["c=Q/(mΔT)","=24000/(0.75×32)=1000"],ans:"1000 J kg⁻¹ K⁻¹"},
  {q:"A 12 V heater draws 4.0 A for 300 s. Find electrical energy.",steps:["P=VI=48 W","E=Pt=48×300"],ans:"1.44×10⁴ J"},
  {q:"If that heats 0.50 kg by 18 K with no loss, find c.",steps:["c=14400/(0.50×18)"],ans:"1600 J kg⁻¹ K⁻¹"},
  {q:"Temperature-time gradient is 0.060 K s⁻¹ for m=0.80 kg at P=60 W. Find ideal c.",steps:["c=P/(m·gradient)","=60/(0.80×0.060)"],ans:"1250 J kg⁻¹ K⁻¹"},
  {q:"Why does ignoring heat loss often make the calculated c too large when c=Eelectrical/(mΔT)?",steps:["Electrical E includes energy that did not heat the sample.","Using too large a Q in the numerator raises calculated c."],ans:"Because input energy exceeds energy gained by the sample."}
 ]
},
"continuous-flow":{
 equations:[
  {name:"Mass flow rate",eq:"ṁ = Δm/Δt",sheet:"Derived definition",meaning:"Mass passing per unit time.",symbols:"ṁ / kg s⁻¹",units:"kg s⁻¹",rearrange:"Δm=ṁΔt",conditions:"Steady flow."},
  {name:"Continuous-flow heating",eq:"P = ṁcΔT",sheet:"Derived from Q=mcΔT",meaning:"Power needed to heat a flowing fluid through ΔT.",symbols:"P / W; ṁ / kg s⁻¹; c / J kg⁻¹ K⁻¹; ΔT / K",units:"W",rearrange:"c=P/(ṁΔT); ΔT=P/(ṁc); ṁ=P/(cΔT)",conditions:"Steady state, negligible losses for ideal form."},
  {name:"With constant heat loss",eq:"Pinput = ṁcΔT + Ploss",sheet:"Extended experimental model",meaning:"Separates useful heating power from power lost to surroundings.",symbols:"Ploss / W",units:"W",rearrange:"Useful power=Pinput−Ploss",conditions:"Approximate constant-loss model."}
 ],
 strategy:["Convert flow rate into kg s⁻¹.","Use inlet-to-outlet temperature difference.","If heat loss is specified, subtract it before using ṁcΔT.","Check that W = J s⁻¹."],
 practice:[
  {q:"Water flows at 25 g s⁻¹ through a 2.1 kW heater. c=4200 J kg⁻¹ K⁻¹. Find ΔT.",steps:["ṁ=0.025 kg s⁻¹","ΔT=P/(ṁc)=2100/(0.025×4200)"],ans:"20.0 K"},
  {q:"A liquid flows at 0.015 kg s⁻¹, rises 30 K, and heater power is 900 W. Find c.",steps:["c=P/(ṁΔT)","=900/(0.015×30)"],ans:"2000 J kg⁻¹ K⁻¹"},
  {q:"If 120 W is lost from a 900 W heater in the previous case, find corrected c.",steps:["Puseful=900−120=780 W","c=780/(0.015×30)"],ans:"1733 J kg⁻¹ K⁻¹"},
  {q:"At fixed P and c, flow rate triples. What happens to ΔT?",steps:["ΔT∝1/ṁ"],ans:"It becomes one third."}
 ]
},
"latent-heat":{
 equations:[
  {name:"Specific latent heat",eq:"Q = ml",sheet:"AQA data sheet",meaning:"Energy for phase change without temperature change.",symbols:"Q / J; m / kg; l / J kg⁻¹",units:"J",rearrange:"l=Q/m; m=Q/l",conditions:"Use correct l: fusion or vaporisation."},
  {name:"Heating stage",eq:"Q = mcΔT",sheet:"AQA data sheet",meaning:"Used before/after phase changes.",symbols:"c / J kg⁻¹ K⁻¹",units:"J",rearrange:"ΔT=Q/(mc)",conditions:"Single phase."},
  {name:"Constant-power plateau",eq:"Pt = ml",sheet:"Combined relation",meaning:"Links plateau duration to latent heat.",symbols:"P / W; t / s",units:"J",rearrange:"t=ml/P; l=Pt/m",conditions:"Negligible losses, constant power."},
  {name:"Full multi-stage energy",eq:"Qtotal = Σ(mcΔT) + Σ(ml)",sheet:"Problem-solving form",meaning:"Adds all temperature-change and state-change stages.",symbols:"Each stage in J",units:"J",rearrange:"Calculate stage-by-stage.",conditions:"Never use one equation across a phase boundary."}
 ],
 strategy:["Draw a heating-curve sketch first.","Mark every phase and phase change.","Calculate each Q separately.","Add energies.","If power is given, use t=Q/P at the end."],
 practice:[
  {q:"Melt 0.20 kg ice at 0°C, lf=3.34×10⁵ J kg⁻¹.",steps:["Q=ml","=0.20×3.34×10⁵"],ans:"6.68×10⁴ J"},
  {q:"Then heat the water to 40°C, c=4200 J kg⁻¹ K⁻¹.",steps:["Q=mcΔT","=0.20×4200×40"],ans:"3.36×10⁴ J"},
  {q:"Find total energy.",steps:["Qtotal=6.68×10⁴+3.36×10⁴"],ans:"1.004×10⁵ J"},
  {q:"A 500 W heater supplies the total energy with no loss. Find time.",steps:["t=Q/P","=1.004×10⁵/500"],ans:"201 s"},
  {q:"A 0.12 kg sample has a 75 s melting plateau under 360 W. Estimate lf.",steps:["l=Pt/m","=360×75/0.12"],ans:"2.25×10⁵ J kg⁻¹"}
 ]
},
"gas-laws":{
 equations:[
  {name:"Boyle's law",eq:"p₁V₁ = p₂V₂",sheet:"Experimental law / from ideal gas",meaning:"Pressure-volume relation at constant T for fixed gas amount.",symbols:"p / Pa; V / m³",units:"pV / J",rearrange:"p₂=p₁V₁/V₂",conditions:"Constant T and fixed gas amount."},
  {name:"Charles's law",eq:"V₁/T₁ = V₂/T₂",sheet:"Experimental law",meaning:"Volume-temperature relation at constant p.",symbols:"T / K",units:"m³ K⁻¹",rearrange:"V₂=V₁T₂/T₁",conditions:"Constant p, fixed gas amount, T in K."},
  {name:"Pressure law",eq:"p₁/T₁ = p₂/T₂",sheet:"Experimental law",meaning:"Pressure-temperature relation at constant V.",symbols:"p / Pa; T / K",units:"Pa K⁻¹",rearrange:"p₂=p₁T₂/T₁",conditions:"Constant V, fixed gas amount."},
  {name:"Combined gas law",eq:"p₁V₁/T₁ = p₂V₂/T₂",sheet:"Derived for fixed amount",meaning:"Handles two changing state variables.",symbols:"p,V,T",units:"consistent on both sides",rearrange:"Solve for required state variable.",conditions:"Fixed gas amount, ideal behaviour."}
 ],
 strategy:["Write down what is constant.","Convert all temperatures to K.","Use the simplest applicable gas law.","Keep volume units consistent on both sides; SI is safest.","Check direction: compression at constant T should raise p."],
 practice:[
  {q:"A gas at 95 kPa occupies 2.8 L. It is compressed isothermally to 1.6 L. Find p₂.",steps:["p₂=p₁V₁/V₂","=95×2.8/1.6"],ans:"166 kPa"},
  {q:"80 cm³ at 290 K expands at constant p to 350 K. Find V₂.",steps:["V₂=80×350/290"],ans:"96.6 cm³"},
  {q:"A rigid gas is at 100 kPa and 300 K. Find p at 450 K.",steps:["p₂=100×450/300"],ans:"150 kPa"},
  {q:"A gas changes from 120 kPa, 3.0 L, 300 K to 2.0 L, 360 K. Find p₂.",steps:["p₂=p₁V₁T₂/(T₁V₂)","=120×3.0×360/(300×2.0)"],ans:"216 kPa"}
 ]
},
"absolute-zero":{
 equations:[
  {name:"Temperature conversion",eq:"T/K = θ/°C + 273.15",sheet:"Required conversion",meaning:"Converts Celsius temperature to absolute temperature.",symbols:"T / K; θ / °C",units:"K",rearrange:"θ/°C=T/K−273.15",conditions:"Use T in all gas-law ratios."},
  {name:"Charles relation",eq:"V ∝ T",sheet:"Gas law",meaning:"Shows why zero Kelvin is the natural proportionality origin.",symbols:"V / m³; T / K",units:"—",rearrange:"V/T=constant",conditions:"Constant pressure, fixed gas amount."}
 ],
 strategy:["Convert before any ratio.","Do not use Celsius temperatures directly in proportional calculations.","Temperature differences may be quoted in K or °C with same numerical size.","Graph extrapolation is model-based."],
 practice:[
  {q:"Convert −35°C to K.",steps:["T=−35+273.15"],ans:"238 K (3 s.f.)"},
  {q:"Convert 425 K to °C.",steps:["θ=425−273.15"],ans:"152°C"},
  {q:"At constant p, V=60 cm³ at 300 K. Find V at 250 K.",steps:["V₂=60×250/300"],ans:"50 cm³"},
  {q:"Why is 20°C/10°C=2 not a valid statement that one gas is 'twice as hot'?",steps:["Gas-law proportionality uses absolute temperature.","293 K / 283 K ≠ 2."],ans:"Because Celsius has an arbitrary zero."}
 ]
},
"ideal-gas-moles":{
 equations:[
  {name:"Ideal gas equation",eq:"pV = nRT",sheet:"AQA data sheet",meaning:"Macroscopic equation of state for an ideal gas.",symbols:"p / Pa; V / m³; n / mol; R=8.31 J mol⁻¹ K⁻¹; T / K",units:"Pa m³ = J",rearrange:"p=nRT/V; V=nRT/p; n=pV/(RT); T=pV/(nR)",conditions:"Ideal-gas model; SI units."},
  {name:"Moles from mass",eq:"n = m/M",sheet:"Amount-of-substance relation",meaning:"Converts mass to amount in moles.",symbols:"m / kg; M / kg mol⁻¹",units:"mol",rearrange:"m=nM; M=m/n",conditions:"Mass and molar mass must use matching units."}
 ],
 strategy:["Convert p, V and T to SI first.","If mass is given, find n=m/M before gas equation.","Write R=8.31 with units.","Check Pa·m³ = J.","For unknown molar mass, combine n=pV/(RT) with M=m/n."],
 practice:[
  {q:"0.35 mol gas at 320 K occupies 7.0×10⁻³ m³. Find p.",steps:["p=nRT/V","=0.35×8.31×320/0.0070"],ans:"1.33×10⁵ Pa"},
  {q:"A gas at 1.00×10⁵ Pa, 300 K occupies 2.50×10⁻³ m³. Find n.",steps:["n=pV/(RT)","=1.00×10⁵×2.50×10⁻³/(8.31×300)"],ans:"0.100 mol"},
  {q:"That sample has mass 2.8 g. Find molar mass.",steps:["M=m/n=2.8 g/0.100 mol"],ans:"28 g mol⁻¹"},
  {q:"A 5.0 L gas sample contains 0.20 mol at 25°C. Find p.",steps:["V=5.0×10⁻³ m³; T=298 K","p=nRT/V"],ans:"9.91×10⁴ Pa"}
 ]
},
"ideal-gas-molecules":{
 equations:[
  {name:"Molecular ideal gas equation",eq:"pV = NkT",sheet:"AQA data sheet",meaning:"Equation of state using particle number.",symbols:"N molecules; k=1.38×10⁻²³ J K⁻¹; T / K",units:"J",rearrange:"N=pV/(kT); p=NkT/V",conditions:"Ideal gas."},
  {name:"Particle–mole link",eq:"N = nN_A",sheet:"Core constant relation",meaning:"Converts amount in mol to number of molecules.",symbols:"N_A≈6.02×10²³ mol⁻¹",units:"molecules",rearrange:"n=N/N_A",conditions:"Count specified entities consistently."},
  {name:"Gas constants link",eq:"R = N_A k",sheet:"Derived relation",meaning:"Connects per-mole and per-particle gas constants.",symbols:"R / J mol⁻¹ K⁻¹",units:"J mol⁻¹ K⁻¹",rearrange:"k=R/N_A",conditions:"Same ideal-gas physics."},
  {name:"Mass of one molecule",eq:"m₀ = M/N_A",sheet:"Derived",meaning:"Converts molar mass to molecular mass.",symbols:"M / kg mol⁻¹; m₀ / kg",units:"kg",rearrange:"M=m₀N_A",conditions:"Use kg mol⁻¹."}
 ],
 strategy:["Decide whether question uses moles n or particles N.","Use R with n, k with N.","Convert molar mass to kg mol⁻¹ before finding molecule mass.","Track powers of ten carefully."],
 practice:[
  {q:"0.080 mol contains how many molecules?",steps:["N=nN_A","=0.080×6.02×10²³"],ans:"4.82×10²²"},
  {q:"N=2.0×10²², T=350 K, V=6.0×10⁻⁴ m³. Find p.",steps:["p=NkT/V","=2.0×10²²×1.38×10⁻²³×350/(6.0×10⁻⁴)"],ans:"1.61×10⁵ Pa"},
  {q:"Nitrogen M=28 g mol⁻¹. Find mass of one N₂ molecule.",steps:["M=0.028 kg mol⁻¹","m₀=M/N_A=0.028/(6.02×10²³)"],ans:"4.65×10⁻²⁶ kg"},
  {q:"Use N_A and k to estimate R.",steps:["R=N_Ak","=6.02×10²³×1.38×10⁻²³"],ans:"8.31 J mol⁻¹ K⁻¹"}
 ]
},
"rp8-boyle":{
 equations:[
  {name:"Boyle law",eq:"pV = constant",sheet:"RP8 relationship",meaning:"For fixed gas amount at constant T.",symbols:"p / Pa or kPa; V consistent units",units:"product depends on chosen volume units",rearrange:"p=K/V",conditions:"Constant temperature."},
  {name:"Linearised form",eq:"p = K(1/V)",sheet:"Derived for graphing",meaning:"Plot p against 1/V to obtain a straight line.",symbols:"gradient K=pV",units:"e.g. kPa·cm³",rearrange:"K=gradient",conditions:"Ideal data pass near origin."}
 ],
 strategy:["Take multiple V,p pairs.","Calculate 1/V.","Plot p on y-axis against 1/V on x-axis.","Use best-fit gradient.","Compare intercept with zero considering uncertainty."],
 practice:[
  {q:"p=140 kPa at V=60 cm³. Find pV.",steps:["pV=140×60"],ans:"8400 kPa cm³"},
  {q:"If V becomes 45 cm³ at same T, predict p.",steps:["p=8400/45"],ans:"187 kPa"},
  {q:"A p vs 1/V graph gradient is 8.3×10³ kPa cm³. What does it represent?",steps:["From p=K(1/V), gradient=K=pV."],ans:"The Boyle constant pV"}
 ]
},
"rp8-charles":{
 equations:[
  {name:"Charles law",eq:"V/T = constant",sheet:"RP8 relationship",meaning:"Volume proportional to absolute temperature at constant pressure.",symbols:"V / consistent units; T / K",units:"e.g. cm³ K⁻¹",rearrange:"V₂=V₁T₂/T₁",conditions:"Constant p."},
  {name:"Linear graph",eq:"V = kT",sheet:"Derived for graphing",meaning:"V against T/K should be straight.",symbols:"gradient k=V/T",units:"volume K⁻¹",rearrange:"k=gradient",conditions:"Fixed gas amount, constant p."}
 ],
 strategy:["Wait for thermal equilibrium.","Convert °C to K.","Plot V vs T(K).","Calculate V/T for consistency.","If using Celsius graph, extrapolate cautiously."],
 practice:[
  {q:"V=72 cm³ at 300 K. Predict V at 350 K.",steps:["V₂=72×350/300"],ans:"84.0 cm³"},
  {q:"A V–T graph gradient is 0.240 cm³ K⁻¹. Predict V at 320 K.",steps:["V=kT=0.240×320"],ans:"76.8 cm³"},
  {q:"Why should a V vs T(K) graph pass near the origin?",steps:["Charles law states direct proportionality V∝T."],ans:"Because V=kT in the ideal model."}
 ]
},
"brownian-model":{
 equations:[
  {name:"Pressure definition",eq:"p = F/A",sheet:"Core mechanics",meaning:"Macroscopic pressure is force per unit area.",symbols:"p / Pa; F / N; A / m²",units:"Pa=N m⁻²",rearrange:"F=pA",conditions:"Use average force."},
  {name:"Force from momentum transfer",eq:"F = Δp_momentum/Δt",sheet:"Newton II in momentum form",meaning:"Wall force comes from rate of molecular momentum change.",symbols:"momentum / kg m s⁻¹",units:"N",rearrange:"Δp=FΔt",conditions:"Use average over many collisions."}
 ],
 strategy:["For qualitative gas-law calculations, connect temperature to speed, then collision rate/momentum change, then pressure.","Keep 'particle momentum p' concept distinct from pressure symbol p.","Use complete causal chains in explanations."],
 practice:[
  {q:"A wall area 0.020 m² experiences gas pressure 1.5×10⁵ Pa. Find force.",steps:["F=pA","=1.5×10⁵×0.020"],ans:"3000 N"},
  {q:"Molecules transfer 0.60 kg m s⁻¹ of momentum to a wall every 2.0×10⁻⁵ s. Find average force.",steps:["F=Δp/Δt","=0.60/(2.0×10⁻⁵)"],ans:"3.0×10⁴ N"},
  {q:"If the same force acts on twice the area, what happens to pressure?",steps:["p=F/A"],ans:"It halves."}
 ]
},
"kinetic-assumptions":{
 equations:[
  {name:"Momentum change at wall",eq:"|Δp| = 2mc_x",sheet:"Derivation step",meaning:"Elastic reversal of the velocity component normal to wall.",symbols:"m / kg; c_x / m s⁻¹",units:"kg m s⁻¹",rearrange:"—",conditions:"Elastic collision with stationary wall."},
  {name:"Collision interval",eq:"Δt = 2L/c_x",sheet:"Derivation step",meaning:"Time to travel to opposite wall and back.",symbols:"L / m",units:"s",rearrange:"collision rate=c_x/(2L)",conditions:"Cubic container model."},
  {name:"Kinetic theory pressure",eq:"pV = (1/3)Nm(c_rms)²",sheet:"AQA data sheet",meaning:"Links pressure-volume to particle mass and rms speed.",symbols:"N particles; m / kg; c_rms / m s⁻¹",units:"J",rearrange:"c_rms=√(3pV/(Nm)); p=Nm c_rms²/(3V)",conditions:"Ideal gas model."},
  {name:"Density form",eq:"p = (1/3)ρ(c_rms)²",sheet:"Derived",meaning:"Uses gas mass density rather than particle count.",symbols:"ρ / kg m⁻³",units:"Pa",rearrange:"c_rms=√(3p/ρ)",conditions:"Ideal gas."}
 ],
 strategy:["Know the derivation chain, not just final formula.","Use c_rms²=<c²>.","The factor 1/3 comes from random isotropic motion in x,y,z.","Use density form when ρ is given.","Check that calculated molecular speeds are typically hundreds of m s⁻¹."],
 practice:[
  {q:"ρ=1.10 kg m⁻³, c_rms=480 m s⁻¹. Find p.",steps:["p=(1/3)ρc²","=(1/3)×1.10×480²"],ans:"8.45×10⁴ Pa"},
  {q:"p=1.0×10⁵ Pa, ρ=1.20 kg m⁻³. Find c_rms.",steps:["c=√(3p/ρ)","=√(3×10⁵/1.20)"],ans:"500 m s⁻¹"},
  {q:"A molecule has m=4.0×10⁻²⁶ kg and c_x=350 m s⁻¹. Find momentum-change magnitude at a wall.",steps:["|Δp|=2mc_x","=2×4.0×10⁻²⁶×350"],ans:"2.8×10⁻²³ kg m s⁻¹"},
  {q:"Why is <c_x²>=<c²>/3?",steps:["Random motion has no preferred axis.","Mean-square speed is shared equally among three perpendicular components."],ans:"Isotropy in 3D"}
 ]
},
"molecular-ke":{
 equations:[
  {name:"Mean molecular kinetic energy",eq:"½m(c_rms)² = 3/2 kT",sheet:"AQA data sheet",meaning:"Absolute temperature sets mean translational kinetic energy per molecule.",symbols:"m / kg; c_rms / m s⁻¹; k / J K⁻¹; T / K",units:"J",rearrange:"c_rms=√(3kT/m); T=m c_rms²/(3k)",conditions:"Ideal gas."},
  {name:"Molar form",eq:"½m(c_rms)² = 3RT/(2N_A)",sheet:"AQA data sheet",meaning:"Equivalent expression using R and Avogadro constant.",symbols:"R, N_A",units:"J per molecule",rearrange:"—",conditions:"Ideal gas."},
  {name:"Monatomic ideal-gas internal energy",eq:"U = 3/2 NkT = 3/2 nRT",sheet:"Derived",meaning:"Total translational kinetic energy of all atoms.",symbols:"U / J",units:"J",rearrange:"T=2U/(3nR)",conditions:"Monatomic ideal gas."},
  {name:"RMS-speed temperature scaling",eq:"c_rms ∝ √T / √m",sheet:"Derived",meaning:"At fixed molecular mass speed rises as square root of absolute temperature.",symbols:"T / K; m / kg",units:"—",rearrange:"c₂/c₁=√(T₂/T₁) for same gas",conditions:"Same gas for simple temperature ratio."}
 ],
 strategy:["Use kelvin.","For one molecule, use 3/2kT.","For n moles monatomic gas, use 3/2nRT.","For rms speed, use molecular mass of one molecule in kg.","At equal T, mean KE is equal for different gases but rms speeds differ."],
 practice:[
  {q:"Find mean translational KE per molecule at 400 K.",steps:["E=3/2kT","=1.5×1.38×10⁻²³×400"],ans:"8.28×10⁻²¹ J"},
  {q:"Nitrogen molecule mass is 4.65×10⁻²⁶ kg. Find c_rms at 300 K.",steps:["c=√(3kT/m)","=√(3×1.38×10⁻²³×300/(4.65×10⁻²⁶))"],ans:"517 m s⁻¹"},
  {q:"The gas is heated from 300 K to 1200 K. By what factor does c_rms change?",steps:["factor=√(1200/300)=√4"],ans:"2"},
  {q:"Find U for 0.50 mol of monatomic ideal gas at 300 K.",steps:["U=3/2nRT","=1.5×0.50×8.31×300"],ans:"1.87×10³ J"},
  {q:"Two ideal gases at same T have molecular masses in ratio 4:1. Find rms-speed ratio heavy:light.",steps:["c∝1/√m","ratio=1/√4"],ans:"1:2"}
 ]
}
};