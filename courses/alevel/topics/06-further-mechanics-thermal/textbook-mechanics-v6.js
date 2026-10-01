window.FM_TEXTBOOK=Object.assign(window.FM_TEXTBOOK||{},{
  "radians": {
    "hook": "A point on the rim of a rotating turbine and a point close to the axle complete each turn in exactly the same time, yet the outer point moves much faster. Radians and angular speed give us a language that describes both points at once.",
    "hookQuestion": "How can two points have the same angular speed but different linear speeds?",
    "visual": "radians",
    "sections": [
      {
        "heading": "Angles as a physical quantity",
        "text": "In circular motion, degrees are useful for everyday geometry, but radians connect angle directly to distance travelled. If an object moves through arc length s on a circle of radius r, its angular displacement is θ=s/r. This means the angle is built from two lengths and is therefore dimensionless, although we normally write the unit rad to make the meaning clear."
      },
      {
        "heading": "Why radians matter in physics",
        "text": "A full turn is 2π rad because the circumference is 2πr and θ=(2πr)/r. Half a turn is π rad and a quarter turn is π/2 rad. Using radians makes relationships such as s=rθ and v=ωr work without additional conversion factors, which is why radians appear throughout A-level circular motion and SHM."
      },
      {
        "heading": "Angular speed and period",
        "text": "Angular speed ω tells us how quickly angular displacement changes. For uniform rotation, one complete cycle of 2π rad takes period T, so ω=2π/T. Since frequency f=1/T, the equivalent form is ω=2πf. Angular speed is measured in rad s⁻¹."
      },
      {
        "heading": "From angular speed to tangential speed",
        "text": "A point at radius r travels an arc length rθ. Dividing by time gives v=ωr. Every point on a rigid rotating object shares the same ω, but a point with larger r has to cover a greater circumference in the same period, so its tangential speed is greater."
      },
      {
        "heading": "What AQA can test",
        "text": "Expect conversions between degrees, revolutions, frequency, period and angular speed, followed by a second step using v=ωr. A common trap is using diameter instead of radius or failing to convert rpm to revolutions per second before calculating ω."
      }
    ],
    "keyIdeas": [
      "360° = 2π rad",
      "θ=s/r",
      "ω=2πf=2π/T",
      "v=ωr",
      "Same rigid body: same ω, different v if r differs"
    ],
    "examFocus": "Show conversion steps explicitly. If a rotational speed is given in rpm, first divide by 60 to obtain Hz before using ω=2πf.",
    "summary": [
      "Radians connect angle to arc length.",
      "Angular speed describes rotation independently of radius.",
      "Tangential speed increases with radius for the same angular speed."
    ],
    "retrieval": [
      [
        "Why is a radian dimensionless?",
        "It is the ratio of arc length to radius, so metres divide by metres."
      ],
      [
        "How many radians are in 90°?",
        "π/2 rad."
      ],
      [
        "Why is the rim of a wheel faster than a point near the hub?",
        "Both have the same angular speed, but v=ωr so the larger radius gives a larger tangential speed."
      ]
    ]
  },
  "centripetal-accel": {
    "hook": "A satellite can move at almost constant speed for hours and still be accelerating every second. The key is that acceleration measures a change in velocity, not just a change in speed.",
    "hookQuestion": "If speed is constant, what exactly is changing?",
    "visual": "circular-vectors",
    "sections": [
      {
        "heading": "Velocity changes even when speed does not",
        "text": "Velocity is a vector, so it has both magnitude and direction. In uniform circular motion the speed is constant, but the velocity direction continually rotates. Because velocity changes, the object must accelerate."
      },
      {
        "heading": "Direction of centripetal acceleration",
        "text": "The instantaneous velocity is tangent to the circle, while the acceleration points toward the centre. This inward acceleration is called centripetal acceleration. It changes the direction of motion rather than directly increasing or decreasing the speed."
      },
      {
        "heading": "Magnitude of the acceleration",
        "text": "For uniform circular motion, a=v²/r. The square on v is important: doubling speed makes the acceleration four times larger if radius is unchanged. Increasing radius at the same linear speed reduces the acceleration because the direction changes more gradually."
      },
      {
        "heading": "Angular form",
        "text": "Using v=ωr gives a=ω²r. This looks different from a=v²/r because the controlled variable is different. At fixed angular speed, points farther from the axis have larger v and therefore larger centripetal acceleration."
      },
      {
        "heading": "Physical interpretation",
        "text": "A large centripetal acceleration can be produced by high speed, a tight radius or both. This is why high-speed corners, centrifuges and rotating machinery can produce very large accelerations even if their speed seems steady."
      }
    ],
    "keyIdeas": [
      "Velocity tangent to circle",
      "Acceleration toward centre",
      "a=v²/r",
      "a=ω²r",
      "At fixed r: a∝v²"
    ],
    "examFocus": "If asked for direction, write 'toward the centre of the circular path'. Do not say merely 'inwards' without defining what inward means.",
    "summary": [
      "Constant speed does not mean constant velocity.",
      "Centripetal acceleration is perpendicular to instantaneous velocity.",
      "The dependence on v² makes speed especially important."
    ],
    "retrieval": [
      [
        "Where does the velocity vector point?",
        "Tangentially to the circular path."
      ],
      [
        "Where does centripetal acceleration point?",
        "Toward the centre."
      ],
      [
        "What happens to a if v doubles at fixed r?",
        "It becomes four times larger."
      ]
    ]
  },
  "centripetal-force": {
    "hook": "When a car turns, there is no mysterious new 'centripetal force' hidden under the bonnet. Ordinary forces such as friction, tension or gravity simply combine to create the inward resultant needed for circular motion.",
    "hookQuestion": "Which real force is actually pulling or pushing the object toward the centre?",
    "visual": "force-diagram",
    "sections": [
      {
        "heading": "Centripetal force is a role, not a new interaction",
        "text": "The term centripetal force describes the resultant force directed toward the centre of the circular path. It must come from real interactions already present in the free-body diagram. Never draw an extra force labelled centripetal force if tension, friction, gravity or normal contact forces are already shown."
      },
      {
        "heading": "Newton's second law in the radial direction",
        "text": "Since radial acceleration is a=v²/r, Newton's second law gives ΣF_radial=mv²/r. If angular speed is known, the equivalent form is ΣF_radial=mω²r. The left-hand side must be built from the actual forces or components of forces acting toward and away from the centre."
      },
      {
        "heading": "Typical situations",
        "text": "On a flat road, tyre-road friction can provide the inward resultant. In a satellite orbit, gravity provides it. For an object on a string, tension contributes. In a vertical circle, weight may assist or oppose the inward direction depending on where the object is on the circle."
      },
      {
        "heading": "How to solve problems",
        "text": "Draw a free-body diagram first. Mark the centre of the circle and choose the inward radial direction as positive. Resolve the real forces along that direction, then set the inward resultant equal to mv²/r. Only after this should numbers be substituted."
      },
      {
        "heading": "What changes the required force",
        "text": "For fixed m and r, F∝v². For fixed v and r, F∝m. For fixed m and v, increasing r reduces the required inward force. These proportionalities are frequently tested without a full numerical calculation."
      }
    ],
    "keyIdeas": [
      "Centripetal force = inward resultant",
      "Use real forces only",
      "ΣF_radial=mv²/r",
      "F∝v²",
      "Free-body diagram first"
    ],
    "examFocus": "AQA often rewards identifying the actual interaction that provides the inward resultant. State the real force and its direction before using the formula.",
    "summary": [
      "Circular motion needs an inward resultant force.",
      "That resultant comes from ordinary interactions.",
      "The correct force equation is written in the radial direction."
    ],
    "retrieval": [
      [
        "What provides centripetal force for a satellite?",
        "Gravity."
      ],
      [
        "Why should you not draw an extra centripetal-force arrow?",
        "Because centripetal force is the resultant of real forces, not a separate interaction."
      ],
      [
        "At fixed mass and radius, how does required force depend on speed?",
        "It is proportional to speed squared."
      ]
    ]
  },
  "shm-condition": {
    "hook": "Many systems oscillate, but only some perform simple harmonic motion. The defining feature is not that the motion repeats—it is the very specific way the restoring acceleration depends on displacement.",
    "hookQuestion": "What mathematical test tells you whether an oscillator is truly SHM?",
    "visual": "shm-condition",
    "sections": [
      {
        "heading": "Equilibrium and displacement",
        "text": "Displacement x is measured from the equilibrium position, where the resultant force is zero. Positive and negative values of x represent opposite sides of equilibrium. The amplitude A is the maximum magnitude of displacement."
      },
      {
        "heading": "The defining condition",
        "text": "For SHM, acceleration must be directly proportional to displacement and opposite in direction: a∝−x. The defining equation is a=−ω²x. The minus sign is essential because it shows that acceleration always acts toward equilibrium."
      },
      {
        "heading": "What happens at key positions",
        "text": "At equilibrium x=0, so a=0. At the turning points x=±A, the magnitude of acceleration is greatest. The acceleration therefore changes continuously throughout the cycle; SHM is not a constant-acceleration problem."
      },
      {
        "heading": "Force form of the condition",
        "text": "Using F=ma gives F=−mω²x. This means any system whose resultant restoring force is proportional to −x will behave as ideal SHM over the region where that relationship holds."
      },
      {
        "heading": "Using an acceleration-displacement graph",
        "text": "An a–x graph for SHM is a straight line through the origin with negative gradient. The gradient is −ω², so the graph can be used to determine angular frequency and then period using T=2π/ω."
      }
    ],
    "keyIdeas": [
      "x measured from equilibrium",
      "a∝−x",
      "a=−ω²x",
      "a–x gradient=−ω²",
      "At x=0, a=0"
    ],
    "examFocus": "A definition of SHM must include both proportionality and direction. 'Acceleration is proportional to displacement' is incomplete without saying it is opposite to displacement/toward equilibrium.",
    "summary": [
      "SHM has a very specific restoring-acceleration rule.",
      "The minus sign carries physical meaning.",
      "The a–x graph provides a direct experimental test of SHM."
    ],
    "retrieval": [
      [
        "What is the acceleration at equilibrium?",
        "Zero."
      ],
      [
        "What is the sign of a when x is positive?",
        "Negative."
      ],
      [
        "What does the gradient of an a–x graph equal?",
        "−ω²."
      ]
    ]
  },
  "shm-graphs": {
    "hook": "An SHM graph is more than a wave shape. If you understand gradients and phase, one displacement graph tells you where the oscillator is, how fast it is moving and which way it is accelerating.",
    "hookQuestion": "How can one sinusoidal graph contain information about three different quantities?",
    "visual": "shm-graphs",
    "sections": [
      {
        "heading": "Displacement-time graph",
        "text": "If an oscillator starts at maximum positive displacement, a convenient equation is x=A cos(ωt). The displacement varies sinusoidally between +A and −A with period T. A different starting point may require a sine form or a phase shift."
      },
      {
        "heading": "Velocity as a gradient",
        "text": "Velocity is the gradient of the displacement-time graph. It is zero at each turning point because the displacement graph is momentarily horizontal. The magnitude of velocity is greatest as the oscillator passes through equilibrium, where the displacement graph is steepest."
      },
      {
        "heading": "Acceleration as the next gradient",
        "text": "Acceleration is the gradient of the velocity-time graph. It is zero at equilibrium and has greatest magnitude at the turning points. The relation a=−ω²x means the acceleration graph is the displacement graph inverted and scaled."
      },
      {
        "heading": "Phase relationships",
        "text": "Displacement and acceleration are π rad out of phase: when one is maximally positive, the other is maximally negative. Velocity is shifted by π/2 rad relative to displacement. Thinking through the actual direction of motion is safer than memorising a single graph pattern."
      },
      {
        "heading": "Quarter-cycle reasoning",
        "text": "At t=0 the oscillator can start at +A with v=0. At T/4 it crosses equilibrium at maximum speed. At T/2 it reaches −A and stops instantaneously. At 3T/4 it crosses equilibrium in the opposite direction, and at T the cycle repeats."
      }
    ],
    "keyIdeas": [
      "gradient of x–t = v",
      "gradient of v–t = a",
      "x and a differ by π rad",
      "v shifted by π/2 rad",
      "All three have same period"
    ],
    "examFocus": "When sketching linked graphs, align the same time axis and mark T/4, T/2, 3T/4 and T. Check signs at each quarter cycle.",
    "summary": [
      "Velocity comes from the slope of displacement.",
      "Acceleration comes from the slope of velocity.",
      "Phase tells you how the three graphs are shifted relative to one another."
    ],
    "retrieval": [
      [
        "Where is speed maximum?",
        "At equilibrium."
      ],
      [
        "What is the phase difference between x and a?",
        "π rad."
      ],
      [
        "What is v at a turning point?",
        "Zero."
      ]
    ]
  },
  "shm-extremes": {
    "hook": "An oscillator is fastest where its acceleration is zero, and its acceleration is greatest where its speed is zero. SHM becomes much easier when you understand why these extremes occur at different positions.",
    "hookQuestion": "Why are maximum speed and maximum acceleration separated in space?",
    "visual": "shm-extremes",
    "sections": [
      {
        "heading": "Maximum speed",
        "text": "The maximum speed is vmax=ωA and occurs at equilibrium. At x=0 the oscillator has converted as much of its available energy as possible into kinetic energy, so its speed is greatest."
      },
      {
        "heading": "Maximum acceleration",
        "text": "The maximum acceleration magnitude is amax=ω²A and occurs at x=±A. At the endpoints the restoring displacement is largest, so a=−ω²x gives the largest acceleration magnitude."
      },
      {
        "heading": "Speed at any displacement",
        "text": "The relationship v=±ω√(A²−x²) gives the velocity at a chosen displacement. The square-root term gives the speed magnitude, while the ± reminds us that the oscillator can pass the same position moving in either direction."
      },
      {
        "heading": "Scaling arguments",
        "text": "At fixed amplitude, doubling ω doubles vmax but quadruples amax. At fixed ω, doubling amplitude doubles both vmax and amax. These proportional relationships are useful for quick comparisons."
      },
      {
        "heading": "Checking your answer",
        "text": "At x=0 the speed equation should give vmax=ωA. At x=±A it should give zero. If |x| is greater than A, the input is physically impossible for that oscillator."
      }
    ],
    "keyIdeas": [
      "vmax=ωA at equilibrium",
      "amax=ω²A at turning points",
      "v=±ω√(A²−x²)",
      "same x can have two velocity directions"
    ],
    "examFocus": "If asked for speed, quote a positive magnitude. If asked for velocity, use the physical direction to choose the sign.",
    "summary": [
      "Speed and acceleration maxima occur at different positions.",
      "The displacement determines acceleration immediately.",
      "Velocity direction also depends on which half of the cycle the oscillator is in."
    ],
    "retrieval": [
      [
        "Where is amax?",
        "At x=±A."
      ],
      [
        "Where is vmax?",
        "At x=0."
      ],
      [
        "Why does the speed formula have ±?",
        "The oscillator can pass the same displacement in either direction."
      ]
    ]
  },
  "spring": {
    "hook": "A mass on a spring is one of the cleanest examples of SHM because Hooke's law already contains the exact restoring-force pattern needed for simple harmonic motion.",
    "hookQuestion": "How does a force law turn into a prediction for the period of oscillation?",
    "visual": "spring-system",
    "sections": [
      {
        "heading": "Hooke's law as a restoring force",
        "text": "For a displacement x measured from equilibrium, an ideal spring produces F=−kx. The negative sign means the spring force acts opposite to displacement. This is exactly the type of restoring force needed for SHM."
      },
      {
        "heading": "From force to acceleration",
        "text": "Using F=ma gives ma=−kx, so a=−(k/m)x. Compare this with a=−ω²x and we identify ω²=k/m. Therefore ω=√(k/m)."
      },
      {
        "heading": "Period of a mass-spring system",
        "text": "Since T=2π/ω, the period is T=2π√(m/k). A heavier mass oscillates more slowly because it has greater inertia. A stiffer spring oscillates more quickly because the restoring force grows more strongly for a given displacement."
      },
      {
        "heading": "Vertical spring systems",
        "text": "In a vertical setup, weight stretches the spring until a new equilibrium position is reached. When x is then measured from that equilibrium position, the static weight is already balanced and the small oscillations still follow the same period equation."
      },
      {
        "heading": "Required Practical 7 connection",
        "text": "A useful linear form is T²=(4π²/k)m. Plotting T² against m should produce a straight line. The gradient equals 4π²/k, so k can be estimated from experimental data. Timing many oscillations reduces the fractional effect of reaction time."
      },
      {
        "heading": "Limits of the model",
        "text": "The ideal equation assumes Hooke's law remains valid, damping is small and the spring mass is negligible or accounted for. Large extensions or significant damping can make the experimental behaviour depart from the simple model."
      }
    ],
    "keyIdeas": [
      "F=−kx",
      "a=−(k/m)x",
      "ω=√(k/m)",
      "T=2π√(m/k)",
      "RP7: plot T² against m"
    ],
    "examFocus": "If deriving the period, explicitly compare a=−(k/m)x with a=−ω²x. In practical questions, use the graph gradient rather than one isolated reading.",
    "summary": [
      "Hooke's law automatically creates the SHM restoring condition.",
      "Mass increases period; stiffness decreases period.",
      "Linearising T² against m turns the theory into a practical test."
    ],
    "retrieval": [
      [
        "Why does increasing m increase T?",
        "Greater inertia means slower response for the same restoring force."
      ],
      [
        "Why does increasing k decrease T?",
        "A stiffer spring provides a stronger restoring force."
      ],
      [
        "What is the gradient of T² against m?",
        "4π²/k."
      ]
    ]
  },
  "pendulum": {
    "hook": "A pendulum looks simple, but it is only approximately SHM. The approximation works because for small angles the curved sine relationship becomes almost perfectly linear.",
    "hookQuestion": "Why does the familiar pendulum-period equation fail gradually as the release angle becomes large?",
    "visual": "pendulum",
    "sections": [
      {
        "heading": "The restoring force",
        "text": "The tangential component of the bob's weight is −mg sinθ. This component always acts toward the equilibrium position. The minus sign again represents a restoring effect."
      },
      {
        "heading": "Small-angle approximation",
        "text": "For small θ measured in radians, sinθ≈θ. The arc displacement is approximately x=Lθ, so the tangential acceleration becomes a≈−(g/L)x. This has the SHM form a=−ω²x."
      },
      {
        "heading": "Pendulum period",
        "text": "Comparing coefficients gives ω²=g/L, so T=2π√(L/g). The bob mass does not appear because both the driving weight component and inertia are proportional to mass and cancel."
      },
      {
        "heading": "Why amplitude matters",
        "text": "At larger angles, sinθ is no longer close enough to θ. The restoring force is no longer exactly proportional to displacement, so the motion is not exact SHM and the actual period becomes slightly longer than the small-angle prediction."
      },
      {
        "heading": "Required Practical 7 connection",
        "text": "Measure length from the pivot to the centre of the bob. Use a small release angle, a fiducial marker and time many oscillations. Plot T² against L; the ideal gradient is 4π²/g, allowing an experimental estimate of g."
      }
    ],
    "keyIdeas": [
      "restoring force=−mg sinθ",
      "small angle: sinθ≈θ",
      "T=2π√(L/g)",
      "mass does not affect ideal T",
      "RP7: plot T² against L"
    ],
    "examFocus": "State that the small-angle approximation requires θ in radians. In practical questions, make clear that length is pivot to centre of bob.",
    "summary": [
      "A pendulum is approximately SHM only for small angles.",
      "Its period depends on L and g, not bob mass.",
      "Linearisation provides a route to measuring g."
    ],
    "retrieval": [
      [
        "Why must θ be small?",
        "So sinθ≈θ and restoring acceleration is proportional to displacement."
      ],
      [
        "Does bob mass affect ideal period?",
        "No."
      ],
      [
        "What graph can be used to determine g?",
        "T² against L."
      ]
    ]
  },
  "shm-energy": {
    "hook": "An ideal oscillator never 'runs out' of motion because energy is continuously exchanged between kinetic and potential stores while the total stays constant.",
    "hookQuestion": "Where is the energy when the oscillator is momentarily stationary?",
    "visual": "shm-energy",
    "sections": [
      {
        "heading": "Total mechanical energy",
        "text": "For an ideal spring oscillator with amplitude A, total mechanical energy is E=½kA². With negligible damping this value remains constant throughout the cycle."
      },
      {
        "heading": "Potential energy",
        "text": "At displacement x, elastic potential energy is Ep=½kx². It is zero at equilibrium and greatest at the turning points x=±A."
      },
      {
        "heading": "Kinetic energy",
        "text": "Kinetic energy is the remainder: Ek=E−Ep=½k(A²−x²). It is greatest at equilibrium where the speed is maximum and zero at the turning points where the oscillator stops instantaneously."
      },
      {
        "heading": "Energy graphs",
        "text": "Ep against x is an upward-opening parabola and Ek against x is a downward-opening parabola within ±A. The total-energy line is horizontal. Because energy depends on x², energy is always non-negative."
      },
      {
        "heading": "Energy over time",
        "text": "Displacement changes sign each half cycle, but x² does not. Therefore the kinetic and potential energies repeat twice during one complete displacement cycle. Energy graphs against time therefore have frequency 2f."
      },
      {
        "heading": "Amplitude and energy",
        "text": "Because E∝A², doubling amplitude quadruples total energy. This relationship is also useful when analysing damping: a decrease in amplitude corresponds to an even larger fractional decrease in mechanical energy."
      }
    ],
    "keyIdeas": [
      "E=½kA²",
      "Ep=½kx²",
      "Ek=½k(A²−x²)",
      "At equilibrium: KE max",
      "At endpoints: PE max"
    ],
    "examFocus": "Do not sketch KE or PE as simple copies of the displacement graph. Energy depends on squared quantities and cannot be negative.",
    "summary": [
      "Ideal SHM conserves total mechanical energy.",
      "KE and PE exchange continuously.",
      "Amplitude controls total energy through A²."
    ],
    "retrieval": [
      [
        "What is KE at x=±A?",
        "Zero."
      ],
      [
        "What is PE at equilibrium?",
        "Zero for the spring model measured from equilibrium."
      ],
      [
        "What happens to E if A doubles?",
        "It quadruples."
      ]
    ]
  },
  "damping": {
    "hook": "Without damping, a car suspension would keep bouncing after every bump. Damping is what allows real oscillating systems to settle down.",
    "hookQuestion": "How can adding resistance make a system return to equilibrium more effectively?",
    "visual": "damping",
    "sections": [
      {
        "heading": "What damping does",
        "text": "Damping occurs when resistive forces oppose motion and transfer mechanical energy to internal energy of the system and surroundings. As mechanical energy decreases, the amplitude of oscillation falls."
      },
      {
        "heading": "Light damping",
        "text": "With light damping, the system continues to oscillate many times while the amplitude gradually decreases. The period may change only slightly, but the total mechanical energy falls continuously."
      },
      {
        "heading": "Critical damping",
        "text": "Critical damping is the special case that returns a displaced system to equilibrium in the shortest time without oscillating. This is useful when a rapid, stable response is needed."
      },
      {
        "heading": "Heavy damping",
        "text": "With heavier-than-critical damping, the system also returns without overshooting, but it takes longer. More damping is therefore not always better."
      },
      {
        "heading": "Applications",
        "text": "Vehicle suspension, door closers, moving-coil instruments and sensors all use damping deliberately. Designers choose damping to balance speed of response, comfort, overshoot and stability."
      },
      {
        "heading": "Energy viewpoint",
        "text": "For the same spring, mechanical energy is proportional to A². If amplitude falls to half its initial value, the idealised mechanical energy associated with that amplitude is only one quarter as large."
      }
    ],
    "keyIdeas": [
      "Damping dissipates mechanical energy",
      "Light: decaying oscillations",
      "Critical: fastest return without overshoot",
      "Heavy: slower non-oscillatory return",
      "E∝A²"
    ],
    "examFocus": "Do not define critical damping as 'maximum damping'. It is the minimum damping that prevents oscillation and gives the fastest non-oscillatory return.",
    "summary": [
      "Damping controls how quickly oscillations disappear.",
      "Critical damping is a design optimum, not the largest damping.",
      "Energy loss explains the shrinking amplitude."
    ],
    "retrieval": [
      [
        "What happens to mechanical energy under damping?",
        "It decreases as energy is transferred to the surroundings."
      ],
      [
        "Which regime is fastest without oscillation?",
        "Critical damping."
      ],
      [
        "Why is heavy damping slower than critical damping?",
        "The resistance is larger than needed and slows the return motion."
      ]
    ]
  },
  "resonance": {
    "hook": "Push a child on a swing at the wrong time and very little happens. Push at the right rhythm and the amplitude grows rapidly. That timing effect is resonance.",
    "hookQuestion": "Why does matching a frequency make energy transfer so much more effective?",
    "visual": "resonance",
    "sections": [
      {
        "heading": "Natural frequency",
        "text": "A system displaced and released tends to oscillate at its natural frequency. This frequency depends on the physical properties of the system, such as mass and stiffness for a spring oscillator."
      },
      {
        "heading": "Forced vibration",
        "text": "A periodic external force can drive an oscillator. After transient motion has faded, the system responds at the driving frequency rather than simply continuing at its natural frequency."
      },
      {
        "heading": "Resonance",
        "text": "When the driving frequency is close to the natural frequency, the driving force is timed so that it transfers energy efficiently on successive cycles. The steady-state amplitude can therefore become large if damping is small."
      },
      {
        "heading": "Resonance curves",
        "text": "A plot of response amplitude against driving frequency has a peak near the natural frequency. Low damping produces a taller, narrower peak. Increased damping lowers the maximum response and broadens the frequency range over which a moderate response occurs."
      },
      {
        "heading": "Mechanical examples",
        "text": "Resonance may be useful, as in tuning systems or musical instruments, or undesirable, as in machinery, buildings or vehicle components. Engineers can shift the natural frequency by changing mass or stiffness, or reduce the peak by increasing damping."
      },
      {
        "heading": "Stationary-wave connection",
        "text": "Strings and air columns also have natural modes. When driven at an allowed natural frequency, resonance can establish a large-amplitude stationary wave. AQA expects students to connect the same resonance idea across mechanical oscillators and stationary-wave systems."
      }
    ],
    "keyIdeas": [
      "free vibration at natural frequency",
      "forced vibration follows driving frequency",
      "resonance when fdrive≈fnatural",
      "damping lowers and broadens peak",
      "resonance transfers energy efficiently"
    ],
    "examFocus": "A strong explanation should mention driving frequency, natural frequency and efficient energy transfer. 'The amplitude gets large' alone is not a definition.",
    "summary": [
      "Resonance is a frequency-matching effect.",
      "Damping controls the sharpness and size of the response.",
      "The same physics applies to mechanical oscillators and stationary waves."
    ],
    "retrieval": [
      [
        "What frequency does a forced oscillator follow in steady state?",
        "The driving frequency."
      ],
      [
        "What happens to the resonance peak when damping increases?",
        "It becomes lower and broader."
      ],
      [
        "Why does amplitude grow near resonance?",
        "Energy is transferred especially efficiently from the driver to the oscillator."
      ]
    ]
  }
});