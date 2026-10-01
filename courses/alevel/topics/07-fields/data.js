window.FIELD_LAB = (() => {
  const k = 8.9875517923e9, G = 6.67430e-11, e0 = 8.8541878128e-12;
  const lessons = [
    {
      id:"fields", topic:"fields", code:"3.7.1", title:"Fields: the unifying idea", sim:"fieldCompare",
      lead:"Build one model for gravitational, electric and magnetic force fields.",
      keywords:["force field","vector","field line","equipotential","inverse square"],
      formulas:["field strength = force / test quantity"],
      objectives:["Define a force field.","Interpret field lines as a vector representation.","Compare gravitational and electrostatic fields."],
      retrieval:[["What is a non-contact force?","A force acting without physical contact."],["What is a vector?","A quantity with magnitude and direction."],["What does an inverse-square law mean?","The quantity is proportional to 1/r²."]],
      teach:[
        ["Force fields","A force field is a region in which a suitable body experiences a non-contact force. Gravitational fields act on mass, electric fields on charge, and magnetic fields act on moving charges or currents."],
        ["Vectors and field lines","Field strength is a vector. A field-line arrow shows the direction of the force on a positive test quantity: a small mass for gravity and a positive test charge for electric fields. Closer lines represent a stronger field."],
        ["Similarities","Gravity and electrostatics both obey inverse-square laws for point sources, both use field strength and potential, and both can be represented using field lines and equipotential surfaces."],
        ["Key difference","Masses are always gravitationally attractive. Electric charges may attract or repel, so electric field patterns can have sources and sinks."]
      ],
      worked:{q:"A field strength falls from 40 units at r to what value at 2r?",steps:["Inverse square: strength ∝ 1/r²","Doubling r gives 1/2² = 1/4","New strength = 10 units."]},
      activity:"Sketch radial gravitational and electric fields and annotate the direction convention.",
      mission:{goal:"Compare inverse-square fields.",steps:["Choose gravity or electric mode.","Move the test point away from the source.","Watch vector magnitude and field-line spacing."],record:"Record field strength at r and 2r.",conclusion:"State the inverse-square relationship."},
      check:["If distance from a point source triples, field strength becomes…",["3 times","1/3","1/9","9 times"],2,"Inverse-square gives 1/3² = 1/9."],
      examTip:"Always state what the field direction convention refers to.",
      misconception:"Field lines are not physical strings; they are a representation of a vector field.",
      exit:"Give two similarities and one difference between gravitational and electric fields."
    },
    {
      id:"gravity-law", topic:"gravity", code:"3.7.2.1–2", title:"Newton's law and gravitational field strength", sim:"gravity",
      lead:"Move from force between masses to the field produced by one mass.",
      keywords:["Newton's law","G","point mass","gravitational field strength","radial field"],
      formulas:["F = GMm/r²","g = F/m","g = GM/r²"],
      objectives:["Use Newton's law of gravitation.","Define g as force per unit mass.","Calculate g in a radial field."],
      retrieval:[["Unit of force?","N."],["Unit of mass?","kg."],["What happens to an inverse-square quantity when r doubles?","It becomes one quarter."]],
      teach:[
        ["Universal gravitation","Any two masses attract. For point masses, F = GMm/r². For spherical bodies outside the sphere, the mass can be treated as concentrated at the centre."],
        ["Field strength","Gravitational field strength g is the force per unit mass on a small test mass: g = F/m. Combining this with Newton's law gives g = GM/r²."],
        ["Direction","The gravitational field around an isolated spherical mass is radial and directed toward the mass."],
        ["Surface gravity","At a planet surface, use r equal to the distance from the planet's centre, not the height above the surface."]
      ],
      worked:{q:"Find g at r = 7.0×10⁶ m from a planet of mass 6.0×10²⁴ kg.",steps:["g = GM/r²","g = (6.67×10⁻¹¹)(6.0×10²⁴)/(7.0×10⁶)²","g ≈ 8.17 N kg⁻¹."]},
      activity:"Explain why astronaut mass cancels when deriving g from Newton's law.",
      mission:{goal:"Test g ∝ 1/r².",steps:["Keep source mass fixed.","Double the radial distance.","Compare g."],record:"Record r and g for three positions.",conclusion:"Use data to verify inverse-square behaviour."},
      check:["The SI unit N kg⁻¹ is equivalent to…",["kg N⁻¹","m s⁻²","J kg⁻¹","T"],1,"From F = ma, N kg⁻¹ = m s⁻²."],
      examTip:"For a spherical planet, r is measured from its centre.",
      misconception:"g and G are different: g varies with position; G is universal.",
      exit:"Derive g = GM/r² from F = GMm/r² and g = F/m."
    },
    {
      id:"g-potential", topic:"gravity", code:"3.7.2.3", title:"Gravitational potential and equipotentials", sim:"gravity",
      lead:"Connect field strength, work and potential.",
      keywords:["potential","potential difference","equipotential","zero at infinity","negative potential"],
      formulas:["V = −GM/r","ΔE = mΔV","g = −dV/dr"],
      objectives:["Define gravitational potential.","Explain the negative sign.","Relate potential difference to work done and field graphs."],
      retrieval:[["What is an equipotential?","A surface of constant potential."],["Work done moving along an equipotential?","Zero."],["Reference value for gravitational potential?","Zero at infinity."]],
      teach:[
        ["Definition","Gravitational potential V is work done per unit mass in bringing a small mass from infinity to a point. It is measured in J kg⁻¹."],
        ["Why negative","Taking V = 0 at infinity means bound positions have negative potential: energy must be supplied to move a mass away to infinity."],
        ["Radial potential","For a spherical mass, V = −GM/r. Unlike g, potential follows a 1/r relationship."],
        ["Graph link","The change in potential is related to the area under a g–r graph, and field strength is the negative gradient of potential with distance."]
      ],
      worked:{q:"A 2.0 kg satellite moves from V = −30 MJ kg⁻¹ to −20 MJ kg⁻¹. Find ΔEp.",steps:["ΔEp = mΔV","ΔV = (+10 MJ kg⁻¹)","ΔEp = 2.0×10 MJ = 20 MJ."]},
      activity:"Sketch V against r and g against r on separate axes and compare their shapes.",
      mission:{goal:"Connect g and V.",steps:["Move the probe outward.","Compare how g and V change.","Look at the potential curve slope."],record:"Record r, g and V.",conclusion:"Explain why V becomes less negative outward."},
      check:["Moving a mass along an equipotential requires gravitational work of…",["positive amount","negative amount","zero","GMm/r"],2,"There is no potential difference along an equipotential."],
      examTip:"Use ΔV = Vfinal − Vinitial before multiplying by mass.",
      misconception:"A more negative gravitational potential is lower, not higher.",
      exit:"Explain why gravitational potential is negative when zero is defined at infinity."
    },
    {
      id:"orbits", topic:"gravity", code:"3.7.2.4", title:"Circular orbits: speed, period and energy", sim:"orbit",
      lead:"Use gravity as the centripetal force for a circular orbit.",
      keywords:["orbit","centripetal force","orbital speed","period","total energy"],
      formulas:["v = √(GM/r)","T² = 4π²r³/(GM)","Etotal = −GMm/(2r)"],
      objectives:["Derive circular orbital speed.","Relate T² and r³.","Describe kinetic, potential and total energy in orbit."],
      retrieval:[["Centripetal acceleration?","v²/r."],["Gravitational force?","GMm/r²."],["Circumference of circular orbit?","2πr."]],
      teach:[
        ["Force balance","For a circular orbit, gravity provides the centripetal force: GMm/r² = mv²/r. The satellite mass cancels."],
        ["Orbital speed","Rearranging gives v = √(GM/r), so satellites farther out move more slowly."],
        ["Period","Using v = 2πr/T gives T² = 4π²r³/(GM). Therefore T² ∝ r³ for bodies orbiting the same central mass."],
        ["Energy","For a circular orbit, Ek = GMm/(2r), Ep = −GMm/r and total energy = −GMm/(2r). A more distant circular orbit has a less negative total energy."]
      ],
      worked:{q:"Find orbital speed at r = 7.0×10⁶ m around Earth, M = 5.97×10²⁴ kg.",steps:["v = √(GM/r)","v = √[(6.67×10⁻¹¹)(5.97×10²⁴)/(7.0×10⁶)]","v ≈ 7.54×10³ m s⁻¹."]},
      activity:"Derive T² ∝ r³ starting from gravity = centripetal force.",
      mission:{goal:"Explore orbit radius.",steps:["Increase orbital radius.","Observe speed and period.","Compare total energy."],record:"Record r, v and T.",conclusion:"State how v and T vary with r."},
      check:["For a larger circular orbit around the same planet, orbital speed is…",["larger","smaller","unchanged","zero"],1,"v ∝ 1/√r."],
      examTip:"Do not add an extra 'centripetal force'; gravity is the centripetal force.",
      misconception:"A satellite in orbit is not beyond gravity; it is continually falling.",
      exit:"Explain why orbital speed decreases as orbital radius increases."
    },
    {
      id:"satellites", topic:"gravity", code:"3.7.2.4", title:"Escape velocity and synchronous satellites", sim:"orbit",
      lead:"Apply orbital physics to satellite technology.",
      keywords:["escape velocity","geostationary","synchronous","low Earth orbit","equatorial plane"],
      formulas:["vescape = √(2GM/R)"],
      objectives:["Calculate escape velocity.","State geostationary conditions.","Compare low and geostationary orbits."],
      retrieval:[["What is total energy at escape threshold at infinity?","Zero."],["Period of a geostationary satellite?","One sidereal day, approximately 24 h."],["Direction of geostationary orbit?","Same direction as Earth's rotation."]],
      teach:[
        ["Escape","At the minimum escape speed, initial kinetic energy exactly supplies the increase in gravitational potential energy to reach infinity with zero final speed. This gives vescape = √(2GM/R)."],
        ["Geostationary conditions","A geostationary satellite must have a period equal to Earth's rotation, orbit above the equator, move in the same rotational direction and have the required orbital radius."],
        ["LEO","Low Earth orbit gives short period, lower signal delay and strong imaging resolution but a satellite moves across the sky relative to an observer."],
        ["Geostationary uses","Communication and weather observation benefit from a satellite remaining over the same longitude."]
      ],
      worked:{q:"Show the relationship between escape speed and circular orbital speed at the same radius.",steps:["vorbit = √(GM/r)","vescape = √(2GM/r)","Therefore vescape = √2 vorbit."]},
      activity:"Create a table comparing LEO and geostationary orbit by period, radius, speed and typical use.",
      mission:{goal:"Compare orbit regimes.",steps:["Set a low orbit.","Increase radius toward synchronous conditions.","Observe period and speed."],record:"Record one low-orbit and one high-orbit case.",conclusion:"Explain the trade-off in period and signal distance."},
      check:["A geostationary orbit must lie in the…",["polar plane","equatorial plane","ecliptic only","any plane"],1,"It must remain above the same point on the equator."],
      examTip:"State all geostationary conditions; '24 h period' alone is incomplete.",
      misconception:"Synchronous only means matching rotation period; geostationary has extra geometric conditions.",
      exit:"List the conditions required for a satellite to appear fixed above one point on Earth."
    },
    {
      id:"coulomb", topic:"electric", code:"3.7.3.1", title:"Coulomb's law", sim:"electric",
      lead:"Model the inverse-square force between point charges.",
      keywords:["Coulomb's law","permittivity","point charge","electrostatic force","air ≈ vacuum"],
      formulas:["F = Qq/(4πε₀r²)"],
      objectives:["Use Coulomb's law.","Determine attraction or repulsion.","Compare electrostatic and gravitational forces."],
      retrieval:[["Like charges…","repel."],["Unlike charges…","attract."],["Unit of charge?","C."]],
      teach:[
        ["Magnitude","For point charges in vacuum, F = Qq/(4πε₀r²) in magnitude. Air can normally be treated as vacuum for A-level calculations."],
        ["Direction","The force acts along the line joining the charges. Like signs repel; unlike signs attract."],
        ["Charged spheres","Outside a spherically symmetric charged object, treat the charge as if concentrated at its centre."],
        ["Comparison with gravity","Both forces are inverse-square, but electrostatic force can attract or repel and is enormously stronger than gravity between subatomic particles."]
      ],
      worked:{q:"Find the force between +2.0 nC and +3.0 nC separated by 0.10 m.",steps:["F = kQq/r²","F = (8.99×10⁹)(2.0×10⁻⁹)(3.0×10⁻⁹)/(0.10)²","F ≈ 5.39×10⁻⁶ N, repulsive."]},
      activity:"Calculate the force again if the separation doubles, then explain the factor change.",
      mission:{goal:"Explore charge and distance.",steps:["Set two positive charges.","Double one charge.","Then double separation."],record:"Record force for each case.",conclusion:"Distinguish linear charge dependence from inverse-square distance dependence."},
      check:["Doubling both charges while keeping r fixed changes F by…",["2","4","1/2","1/4"],1,"F ∝ Qq."],
      examTip:"Calculate magnitude first, then state attraction or repulsion separately.",
      misconception:"The sign of Qq tells direction/type, not a 'negative force magnitude'.",
      exit:"State two ways Coulomb's law resembles Newton's gravitational law."
    },
    {
      id:"efield", topic:"electric", code:"3.7.3.2", title:"Electric field strength: uniform and radial", sim:"electric",
      lead:"Use field strength to predict forces and charged-particle motion.",
      keywords:["electric field strength","uniform field","radial field","parallel plates","trajectory"],
      formulas:["E = F/Q","E = V/d","E = Q/(4πε₀r²)"],
      objectives:["Define E as force per unit positive charge.","Use E = V/d in a uniform field.","Use radial-field equations and analyse charged-particle trajectories."],
      retrieval:[["Direction of E?","Direction of force on a positive test charge."],["Unit of E?","N C⁻¹ or V m⁻¹."],["Uniform field lines?","Parallel and equally spaced."]],
      teach:[
        ["Definition","Electric field strength E = F/Q for a small positive test charge. It is a vector quantity."],
        ["Uniform fields","Between large parallel plates away from edges, E ≈ V/d. A charged particle feels F = QE and therefore constant acceleration if E is uniform."],
        ["Radial fields","Around a point charge, E = Q/(4πε₀r²) in magnitude. For a positive source the field points outward; for a negative source it points inward."],
        ["Particle trajectory","A particle entering a uniform electric field with velocity perpendicular to E has constant velocity in one axis and constant acceleration in the other, giving a parabolic path."]
      ],
      worked:{q:"A 2.0 kV pd is applied across plates 0.040 m apart. Find E.",steps:["E = V/d","E = 2000/0.040","E = 5.0×10⁴ V m⁻¹."]},
      activity:"Explain why an electron accelerates opposite to the electric-field direction.",
      mission:{goal:"Compare uniform and radial fields.",steps:["Switch between plate and point-charge modes.","Move the probe.","Observe vector direction and magnitude."],record:"Record E at two radial distances and one plate setting.",conclusion:"Explain which field is uniform."},
      check:["An electron in an electric field experiences force…",["along E","opposite E","always upward","zero"],1,"F = QE and electron charge is negative."],
      examTip:"E direction is defined using a positive test charge, regardless of the actual particle used.",
      misconception:"E = V/d is for a uniform field, not a general radial field.",
      exit:"Describe the path of a positive charge entering a uniform electric field at right angles."
    },
    {
      id:"epotential", topic:"electric", code:"3.7.3.3", title:"Electric potential and equipotential surfaces", sim:"electric",
      lead:"Link work, potential and electric field.",
      keywords:["electric potential","absolute potential","equipotential","work done","potential gradient"],
      formulas:["V = Q/(4πε₀r)","W = qΔV","E = −dV/dr"],
      objectives:["Define electric potential.","Use radial electric potential.","Relate potential difference to work and field strength."],
      retrieval:[["Zero reference for absolute electric potential?","Infinity."],["Work moving along an equipotential?","Zero."],["Potential unit?","V = J C⁻¹."]],
      teach:[
        ["Definition","Electric potential is work done per unit positive charge in bringing a small test charge from infinity to a point."],
        ["Sign","Potential around a positive source is positive; around a negative source it is negative when zero is at infinity."],
        ["Work","Moving charge q through potential difference ΔV changes electric potential energy by ΔEp = qΔV."],
        ["Field relationship","Electric field points in the direction of decreasing potential. In one dimension, E is the negative potential gradient."]
      ],
      worked:{q:"A +3.0 nC charge moves through a potential rise of 500 V. Find ΔEp.",steps:["ΔEp = qΔV","= 3.0×10⁻⁹ × 500","= 1.5×10⁻⁶ J."]},
      activity:"Compare the signs of potential energy change for a proton and an electron moved through the same ΔV.",
      mission:{goal:"Map potential and field.",steps:["Move the probe around a source charge.","Watch V and E.","Compare positions on an equipotential circle."],record:"Record two points with similar r but different angle.",conclusion:"Explain why potential is constant around a radial equipotential."},
      check:["Electric field points toward…",["increasing potential","decreasing potential","constant potential only","higher resistance"],1,"E = −dV/dr."],
      examTip:"Potential is scalar; electric field is vector.",
      misconception:"Negative electric potential is possible and does not mean field strength is negative.",
      exit:"Explain why no work is done moving a charge along an equipotential."
    },
    {
      id:"capacitance", topic:"capacitance", code:"3.7.4.1–2", title:"Capacitance, parallel plates and dielectrics", sim:"capacitor",
      lead:"Understand what determines how much charge a capacitor stores per volt.",
      keywords:["capacitance","dielectric","relative permittivity","parallel plate","polar molecule"],
      formulas:["C = Q/V","C = ε₀εrA/d"],
      objectives:["Define capacitance.","Predict effects of A, d and dielectric.","Explain dielectric polarisation."],
      retrieval:[["Unit of capacitance?","F."],["Capacitor stores separated…","charge."],["Increasing plate area generally does what to C?","Increases it."]],
      teach:[
        ["Definition","Capacitance C = Q/V. A large capacitance means more charge can be stored for a given potential difference."],
        ["Parallel plates","For an ideal parallel-plate capacitor, C = ε₀εrA/d. Larger plate area and higher relative permittivity increase C; greater separation decreases C."],
        ["Dielectric action","Polar molecules rotate in the electric field. Bound charges oppose the original field, reducing the effective field for a given free charge."],
        ["Result","With a dielectric inserted, a capacitor can store more free charge at the same pd, so capacitance increases."]
      ],
      worked:{q:"A 220 µF capacitor has 12 V across it. Find Q.",steps:["Q = CV","Q = 220×10⁻⁶ × 12","Q = 2.64×10⁻³ C."]},
      activity:"Predict how C changes if area doubles and separation halves.",
      mission:{goal:"Design a high-capacitance capacitor.",steps:["Increase plate area.","Reduce separation.","Increase εr."],record:"Record initial and final C.",conclusion:"Explain each change using C = ε₀εrA/d."},
      check:["Doubling A and doubling d changes ideal C by…",["×4","×2","unchanged","×1/4"],2,"The factors cancel."],
      examTip:"Convert µF, nF and pF carefully to farads.",
      misconception:"A dielectric is not simply 'extra conductor' between plates.",
      exit:"Describe how a polar dielectric increases capacitance."
    },
    {
      id:"cap-energy", topic:"capacitance", code:"3.7.4.3", title:"Energy stored by a capacitor", sim:"capacitor",
      lead:"Connect capacitor energy to the area under a Q–V graph.",
      keywords:["energy","charge–pd graph","triangle area","stored energy"],
      formulas:["E = ½QV","E = ½CV²","E = Q²/(2C)"],
      objectives:["Interpret Q–V graph area.","Use equivalent capacitor-energy equations.","Explain why the 1/2 appears."],
      retrieval:[["Graph area of triangle?","½ base × height."],["Q = ?","CV."],["Unit of energy?","J."]],
      teach:[
        ["Charging work","As a capacitor charges, the pd rises from 0 to V. Successive increments of charge are moved through an increasing pd."],
        ["Graph area","On a V–Q or Q–V representation, the stored energy corresponds to the appropriate area under the charging relationship. For a linear capacitor this gives E = ½QV."],
        ["Equivalent forms","Using Q = CV gives E = ½CV² and E = Q²/(2C). Choose the form matching the known variables."],
        ["Energy transfer","On discharge, stored electric energy is transferred to the rest of the circuit, commonly as thermal energy in a resistor."]
      ],
      worked:{q:"Find the energy in a 470 µF capacitor charged to 9.0 V.",steps:["E = ½CV²","= 0.5×470×10⁻⁶×9.0²","= 1.90×10⁻² J."]},
      activity:"For fixed C, explain why doubling V quadruples stored energy.",
      mission:{goal:"Explore energy scaling.",steps:["Keep C fixed.","Double V.","Compare stored energy."],record:"Record V and E for three values.",conclusion:"State the V² dependence."},
      check:["At fixed C, tripling V changes stored energy by…",["×3","×6","×9","×1/9"],2,"E ∝ V²."],
      examTip:"The factor 1/2 comes from the pd rising during charging.",
      misconception:"Stored energy is not simply QV for a capacitor charged from zero.",
      exit:"Explain the physical meaning of the area under a capacitor charge–pd graph."
    },
    {
      id:"cap-discharge", topic:"capacitance", code:"3.7.4.4", title:"Capacitor charge, discharge and time constant", sim:"discharge",
      lead:"Use exponential models and log-linear analysis.",
      keywords:["time constant","exponential","discharge","charging","half-life","log-linear"],
      formulas:["τ = RC","V = V₀e^(−t/RC)","Q = Q₀e^(−t/RC)","I = I₀e^(−t/RC)","Vcharge = V₀(1−e^(−t/RC))"],
      objectives:["Interpret charging/discharging graphs.","Calculate RC time constant.","Use exponential and log-linear forms.","Connect to RP9."],
      retrieval:[["Time constant?","τ = RC."],["At t = τ during discharge, remaining fraction?","e⁻¹ ≈ 0.368."],["Half-time relation?","t½ = RC ln2."]],
      teach:[
        ["Discharge","For a capacitor discharging through R, Q, V and current magnitude fall exponentially with the same time constant τ = RC."],
        ["Charging","During charging, Q and V rise asymptotically toward final values while current falls exponentially toward zero."],
        ["Meaning of τ","After one time constant of discharge, about 37% remains. A larger R or C makes the process slower."],
        ["RP9 analysis","Taking logs gives ln(V/V₀) = −t/RC, so a plot of ln(V/V₀) against t is a straight line with gradient −1/RC."]
      ],
      worked:{q:"R = 4.7 kΩ and C = 470 µF. Find τ and V after 2.0 s if V₀ = 6.0 V.",steps:["τ = RC = 4700×470×10⁻⁶ = 2.21 s","V = 6.0e^(−2.0/2.21)","V ≈ 2.43 V."]},
      activity:"Sketch V, Q and I magnitude against time for a discharge and mark one time constant.",
      mission:{goal:"Measure a time constant.",steps:["Choose R and C.","Run the discharge.","Find the time when V ≈ 0.37V₀."],record:"Record R, C, RC and measured time.",conclusion:"Compare measured and calculated τ."},
      check:["If R doubles and C halves, τ…",["doubles","halves","quadruples","stays the same"],3,"The product RC is unchanged."],
      examTip:"Be clear whether current sign or current magnitude is plotted.",
      misconception:"A capacitor never reaches exactly zero in the ideal exponential model at finite time.",
      exit:"Explain how a straight-line graph can be used to determine RC."
    },
    {
      id:"mag-wire", topic:"magnetic", code:"3.7.5.1", title:"Magnetic flux density and force on a wire", sim:"magWire",
      lead:"Define the tesla through the force on a current-carrying conductor.",
      keywords:["magnetic flux density","tesla","current","Fleming's left-hand rule","wire force"],
      formulas:["F = BIL (perpendicular)"],
      objectives:["Use F = BIL.","Apply Fleming's left-hand rule.","Define magnetic flux density and the tesla.","Connect to RP10."],
      retrieval:[["Conventional current direction?","Direction of positive charge flow."],["Unit of B?","T."],["Maximum wire force angle?","90° between current and field."]],
      teach:[
        ["Force on current","A current-carrying wire in a magnetic field experiences a force because moving charges in the conductor interact with the field."],
        ["Perpendicular case","When the current is perpendicular to the field, F = BIL, where L is the length of wire within the uniform field."],
        ["Tesla","1 T is the flux density that produces 1 N on a 1 m wire carrying 1 A perpendicular to the field."],
        ["Direction","Use Fleming's left-hand rule: first finger field, second finger conventional current, thumb force."]
      ],
      worked:{q:"A 0.080 m wire carries 3.0 A perpendicular to a 0.25 T field. Find F.",steps:["F = BIL","= 0.25×3.0×0.080","= 0.060 N."]},
      activity:"Explain how a top-pan balance can measure the magnetic force in RP10.",
      mission:{goal:"Test F = BIL.",steps:["Keep B and L fixed.","Vary I.","Observe force."],record:"Record I and F.",conclusion:"State the expected graph shape and gradient."},
      check:["If B and I both double, F becomes…",["×2","×4","×1/2","unchanged"],1,"F ∝ BI."],
      examTip:"L is only the length of conductor actually inside the field.",
      misconception:"Magnetic field direction is N to S outside a magnet, but Fleming's rule uses the field vector at the wire.",
      exit:"Define one tesla using force, current and conductor length."
    },
    {
      id:"moving-charge", topic:"magnetic", code:"3.7.5.2", title:"Moving charges, circular paths and cyclotrons", sim:"particle",
      lead:"See how a magnetic force bends motion without changing speed.",
      keywords:["Lorentz force","circular motion","radius","cyclotron","charge sign"],
      formulas:["F = BQv (perpendicular)","r = mv/(BQ)","T = 2πm/(BQ)"],
      objectives:["Determine force direction on moving charges.","Derive circular radius.","Explain basic cyclotron operation."],
      retrieval:[["Magnetic force relative to velocity?","Perpendicular when v ⟂ B."],["Does perpendicular force do work?","No."],["Centripetal force equation?","mv²/r."]],
      teach:[
        ["Particle force","For a charge moving perpendicular to a magnetic field, force magnitude is F = BQv. Reverse charge sign and the force direction reverses."],
        ["Circular motion","The magnetic force is perpendicular to velocity, so it changes direction but not speed. Setting BQv = mv²/r gives r = mv/(BQ)."],
        ["Mass spectrometry link","For fixed B and v, larger momentum gives a larger path radius; larger charge magnitude gives a smaller radius."],
        ["Cyclotron","An alternating electric field accelerates the particle across the gap between dees while a perpendicular magnetic field bends it into semicircles. Non-relativistically, the period is independent of speed."]
      ],
      worked:{q:"A proton at 2.0×10⁶ m s⁻¹ enters B = 0.20 T perpendicular to the field. Find r.",steps:["r = mv/(BQ)","= (1.67×10⁻²⁷)(2.0×10⁶)/(0.20×1.60×10⁻¹⁹)","r ≈ 0.104 m."]},
      activity:"Predict how the path changes for an electron with the same momentum magnitude.",
      mission:{goal:"Control a charged-particle path.",steps:["Change B.","Change speed.","Flip charge sign."],record:"Record radius for two B values.",conclusion:"Explain r ∝ v/B for fixed m and Q."},
      check:["A perpendicular magnetic field changes a charged particle's…",["speed only","direction only","kinetic energy only","mass"],1,"The force is perpendicular to motion, so it does no work."],
      examTip:"Use charge magnitude in radius calculations; use sign for direction.",
      misconception:"A magnetic field alone cannot increase the speed of a charged particle.",
      exit:"Derive r = mv/(BQ) in two equations."
    },
    {
      id:"flux", topic:"magnetic", code:"3.7.5.3", title:"Magnetic flux and flux linkage", sim:"flux",
      lead:"Turn area, angle and field strength into flux linkage.",
      keywords:["magnetic flux","flux linkage","coil normal","cosine","turns"],
      formulas:["Φ = BA cosθ","NΦ = BAN cosθ"],
      objectives:["Calculate flux and flux linkage.","Use the coil normal to define θ.","Interpret angular variation.","Connect to RP11."],
      retrieval:[["Unit of flux?","Wb."],["Flux linkage?","NΦ."],["Maximum flux occurs when field is…","parallel to the area normal."]],
      teach:[
        ["Flux","Magnetic flux through area A is Φ = BA cosθ, where θ is the angle between B and the normal to the area."],
        ["Flux linkage","For N identical turns, flux linkage is NΦ = BAN cosθ."],
        ["Angle convention","If the field lies in the plane of the coil, θ = 90° to the normal and flux is zero. If the field is perpendicular to the coil plane, θ = 0° and flux magnitude is maximum."],
        ["RP11","A search coil and oscilloscope can investigate how flux linkage varies with orientation. A cosθ relationship is expected."]
      ],
      worked:{q:"A 200-turn coil of area 0.010 m² is in B = 0.080 T at θ = 60° to the normal. Find NΦ.",steps:["NΦ = BAN cosθ","= 0.080×0.010×200×cos60°","= 0.080 Wb turn."]},
      activity:"Draw a coil and label the area normal, B and θ for maximum and zero flux.",
      mission:{goal:"Map cosθ dependence.",steps:["Rotate the coil from 0° to 180°.","Observe flux linkage.","Compare with cosθ."],record:"Record θ and NΦ.",conclusion:"Identify where flux is maximum, zero and negative."},
      check:["If B lies in the plane of the coil, flux is…",["BA","−BA","zero","2BA"],2,"B is 90° to the area normal."],
      examTip:"Check whether the stated angle is to the plane or to the normal.",
      misconception:"Flux is not simply BA for every orientation.",
      exit:"Explain why rotating a coil changes flux linkage."
    },
    {
      id:"induction", topic:"magnetic", code:"3.7.5.4", title:"Faraday's law, Lenz's law and motional emf", sim:"induction",
      lead:"Generate emf by changing flux linkage.",
      keywords:["Faraday's law","Lenz's law","induced emf","rate of change","motional emf"],
      formulas:["|ε| = Δ(NΦ)/Δt","ε = Blv (perpendicular)"],
      objectives:["Apply Faraday's law.","Use Lenz's law for direction.","Calculate emf for a moving conductor."],
      retrieval:[["What must change to induce an emf in a coil?","Flux linkage."],["What does Lenz's law determine?","Direction/polarity."],["Unit of emf?","V."]],
      teach:[
        ["Faraday","The magnitude of induced emf equals the rate of change of magnetic flux linkage. Faster change gives larger emf."],
        ["Lenz","The induced current acts so that its magnetic effect opposes the change that produced it. This is an energy-conservation statement, not simply 'opposes the field'."],
        ["Moving conductor","For a straight conductor of length l moving at speed v perpendicular to B, charge separation can produce ε = Blv."],
        ["Ways to induce","Move a magnet, move a conductor, change B, rotate the coil or change the linked area."]
      ],
      worked:{q:"Flux linkage changes from 0.40 Wb turn to 0.10 Wb turn in 0.050 s. Find |ε|.",steps:["|ε| = |Δ(NΦ)|/Δt","= |0.10−0.40|/0.050","= 6.0 V."]},
      activity:"Use Lenz's law to explain why pushing a magnet faster into a coil requires more mechanical effort when the circuit is closed.",
      mission:{goal:"Maximise induced emf.",steps:["Increase speed of flux change.","Reverse motion.","Observe emf magnitude and sign."],record:"Record two speeds and peak emf.",conclusion:"Explain magnitude using Faraday and sign using Lenz."},
      check:["Lenz's law says the induced effect opposes…",["the magnetic field always","the change producing it","the current always","gravity"],1,"It opposes the change in flux linkage."],
      examTip:"Faraday gives magnitude; Lenz gives polarity/direction.",
      misconception:"A constant flux linkage produces no induced emf even if the flux itself is large.",
      exit:"State two different physical ways to change flux linkage."
    },
    {
      id:"rotating-coil", topic:"magnetic", code:"3.7.5.4", title:"Rotating coil generator", sim:"induction",
      lead:"Derive a sinusoidal emf from rotating flux linkage.",
      keywords:["generator","angular speed","sinusoidal emf","peak emf","phase"],
      formulas:["NΦ = BAN cosωt","ε = BANω sinωt","ε₀ = BANω"],
      objectives:["Describe flux linkage of a rotating coil.","Relate induced emf to rate of change of flux.","Calculate peak emf."],
      retrieval:[["Flux-linkage shape for uniform rotation?","Cosine."],["Emf is proportional to…","rate of change of flux linkage."],["Angular speed relation?","ω = 2πf."]],
      teach:[
        ["Rotating linkage","For a coil rotating uniformly in a uniform field, NΦ = BAN cosωt when t = 0 is chosen at maximum linkage."],
        ["Induced emf","Differentiating gives a sinusoidal emf, with magnitude ε = BANω sinωt."],
        ["Peak emf","ε₀ = BANω. More turns, stronger field, larger area or faster rotation increases the peak."],
        ["Phase idea","Flux linkage is maximum when its rate of change is zero, so emf is zero there. Emf magnitude is maximum when flux linkage crosses zero most steeply."]
      ],
      worked:{q:"N=100, B=0.20 T, A=0.015 m², f=50 Hz. Find ε₀.",steps:["ω = 2πf = 314 rad s⁻¹","ε₀ = BANω","= 0.20×0.015×100×314 ≈ 94.2 V."]},
      activity:"Sketch NΦ and ε on the same time axis and mark their quarter-cycle phase difference.",
      mission:{goal:"Link coil angle to AC output.",steps:["Run the rotating coil.","Pause at maximum flux.","Pause at zero flux."],record:"Record flux and emf at each point.",conclusion:"Explain why the graphs are quarter-cycle out of phase."},
      check:["At maximum flux linkage, induced emf is…",["maximum","zero","always negative","equal to BA"],1,"The rate of change is zero."],
      examTip:"Do not confuse maximum flux with maximum emf.",
      misconception:"The generator emf depends on rate of flux change, not flux alone.",
      exit:"Explain why increasing rotation frequency increases peak emf."
    },
    {
      id:"ac", topic:"magnetic", code:"3.7.5.5", title:"Alternating current, rms and oscilloscope skills", sim:"ac",
      lead:"Interpret sinusoidal AC numerically and on an oscilloscope.",
      keywords:["alternating current","rms","peak","peak-to-peak","frequency","oscilloscope"],
      formulas:["Vrms = V₀/√2","Irms = I₀/√2","Vpp = 2V₀","f = 1/T"],
      objectives:["Convert between rms, peak and peak-to-peak values.","Read amplitude and period from an oscilloscope.","Explain why rms is useful."],
      retrieval:[["UK mains quoted value is an…","rms voltage."],["Peak-to-peak?","Twice the peak amplitude."],["Frequency unit?","Hz."]],
      teach:[
        ["Sinusoidal AC","For a sinusoidal voltage, the polarity and magnitude vary periodically about zero."],
        ["RMS","Vrms = Vpeak/√2 and Irms = Ipeak/√2. RMS values give the same average heating power in a resistor as an equivalent DC value."],
        ["Peak-to-peak","Vpp = 2Vpeak for a symmetric sine wave."],
        ["Oscilloscope","Voltage scale gives vertical amplitude per division; time-base gives time per horizontal division. Measure one or several cycles to find period and frequency."]
      ],
      worked:{q:"A sine wave has Vrms = 230 V. Find Vpeak and Vpp.",steps:["Vpeak = √2 Vrms ≈ 325 V","Vpp = 2Vpeak ≈ 650 V."]},
      activity:"If one cycle occupies 4.0 divisions at 5.0 ms div⁻¹, calculate f.",
      mission:{goal:"Read an AC waveform.",steps:["Change amplitude.","Change frequency.","Use the grid to estimate peak and period."],record:"Record Vpeak, Vrms, T and f.",conclusion:"Check the rms and frequency relationships."},
      check:["For a sine wave with Vpeak = 10 V, Vrms is closest to…",["14.1 V","10 V","7.07 V","5.0 V"],2,"Vrms = Vpeak/√2."],
      examTip:"Oscilloscope vertical readings from centre to peak give peak, not peak-to-peak.",
      misconception:"RMS is not the arithmetic mean of a sine wave, which is zero over a full cycle.",
      exit:"Explain what an rms voltage means physically."
    },
    {
      id:"transformer", topic:"magnetic", code:"3.7.5.6", title:"Transformers and high-voltage transmission", sim:"transformer",
      lead:"Use electromagnetic induction to transfer energy efficiently between circuits.",
      keywords:["transformer","turns ratio","step-up","efficiency","eddy currents","power loss"],
      formulas:["Vs/Vp = Ns/Np","Ip/Is = Ns/Np (ideal)","efficiency = Pout/Pin","Ploss = I²R"],
      objectives:["Use transformer ratios.","Calculate efficiency.","Explain transformer losses.","Explain why transmission uses high voltage."],
      retrieval:[["Transformer needs AC or DC?","AC."],["Step-up transformer changes voltage…","up."],["Resistive cable loss?","I²R."]],
      teach:[
        ["Operation","AC in the primary produces a changing magnetic flux in the core. This changing flux links the secondary and induces an emf."],
        ["Turns ratio","For an ideal transformer, Vs/Vp = Ns/Np. Power is approximately conserved, so increasing voltage reduces current."],
        ["Losses","Real transformers lose energy through coil resistance, eddy currents, hysteresis and imperfect flux linkage. Laminated cores reduce eddy currents."],
        ["Transmission","For a required power P = VI, transmitting at high V allows smaller I. Since cable heating loss is I²R, reducing current greatly reduces wasted power."]
      ],
      worked:{q:"A transformer has 500 primary turns and 50 secondary turns. Vp = 230 V. Find Vs.",steps:["Vs/Vp = Ns/Np","Vs = 230×50/500","Vs = 23 V."]},
      activity:"Show quantitatively why reducing transmission current by a factor of 10 reduces I²R losses by a factor of 100.",
      mission:{goal:"Balance voltage, current and power.",steps:["Change turns ratio.","Observe secondary voltage and ideal current.","Compare transmission loss at low and high voltage."],record:"Record two turns ratios and cable losses.",conclusion:"Explain the national-grid advantage of step-up transformation."},
      check:["If transmission current is halved at fixed cable R, heating loss becomes…",["half","quarter","double","four times"],1,"Ploss = I²R."],
      examTip:"Use the ideal power relation only when losses are negligible or efficiency is given.",
      misconception:"A transformer does not create energy when it steps voltage up; current correspondingly falls.",
      exit:"Explain in a linked chain why electrical power is transmitted at high voltage."
    }
  ];

  const simulations = {
    fieldCompare:{code:"3.7.1",title:"Field comparison",subtitle:"Compare gravitational and electric inverse-square fields.",controls:[
      {id:"source",label:"Source strength",min:1,max:10,step:0.2,value:5,unit:"×"},
      {id:"distance",label:"Probe distance",min:0.8,max:4.5,step:0.05,value:2,unit:" r"}
    ],explain:"Both point-source fields weaken with the square of distance. Gravity is always inward; electric direction depends on source charge.",exam:"State field direction conventions and the inverse-square dependence.",mistake:"Do not treat field lines as particle trajectories."},
    gravity:{code:"3.7.2",title:"Gravity field + potential",subtitle:"Explore g ∝ 1/r² and V ∝ −1/r.",controls:[
      {id:"mass",label:"Source mass",min:1,max:10,step:0.1,value:5.97,unit:"×10²⁴ kg"},
      {id:"radius",label:"Radius",min:4,max:20,step:0.1,value:7,unit:"×10⁶ m"}
    ],explain:"The field vector points inward. Potential is negative and approaches zero with increasing distance.",exam:"Use distance from the centre of a spherical mass.",mistake:"Potential follows 1/r; field strength follows 1/r²."},
    orbit:{code:"3.7.2.4",title:"Orbital mechanics",subtitle:"Change orbital radius and watch speed, period and energy.",controls:[
      {id:"mass",label:"Central mass",min:1,max:10,step:0.1,value:5.97,unit:"×10²⁴ kg"},
      {id:"radius",label:"Orbital radius",min:6.6,max:25,step:0.1,value:8,unit:"×10⁶ m"}
    ],explain:"Gravity supplies the centripetal force. Larger circular orbits have lower speed, longer period and less-negative total energy.",exam:"Derive orbital relationships from GMm/r² = mv²/r.",mistake:"Do not add gravity and a separate centripetal force."},
    electric:{code:"3.7.3",title:"Electric field + potential",subtitle:"Switch between radial and uniform field thinking.",controls:[
      {id:"charge",label:"Source charge",min:-8,max:8,step:0.2,value:4,unit:" nC"},
      {id:"distance",label:"Probe distance",min:0.05,max:0.5,step:0.01,value:0.2,unit:" m"},
      {id:"plateV",label:"Plate pd",min:100,max:2000,step:50,value:800,unit:" V"}
    ],explain:"Radial E follows 1/r² and radial V follows 1/r. Between ideal parallel plates E ≈ V/d.",exam:"Field direction is defined by force on a positive test charge.",mistake:"Potential is scalar; electric field is vector."},
    capacitor:{code:"3.7.4",title:"Parallel-plate capacitor",subtitle:"Adjust plate geometry, dielectric and voltage.",controls:[
      {id:"area",label:"Plate area",min:0.002,max:0.03,step:0.001,value:0.01,unit:" m²"},
      {id:"gap",label:"Plate gap",min:0.0005,max:0.005,step:0.0001,value:0.002,unit:" m"},
      {id:"er",label:"Relative permittivity",min:1,max:8,step:0.1,value:1,unit:""},
      {id:"voltage",label:"Voltage",min:1,max:20,step:0.5,value:10,unit:" V"}
    ],explain:"Capacitance rises with plate area and dielectric permittivity, and falls with plate separation.",exam:"Use C = ε₀εrA/d for ideal parallel plates.",mistake:"Changing voltage does not change ideal geometric capacitance."},
    discharge:{code:"3.7.4.4",title:"Capacitor discharge",subtitle:"See exponential decay and the meaning of RC.",controls:[
      {id:"R",label:"Resistance",min:1000,max:10000,step:100,value:4700,unit:" Ω"},
      {id:"C",label:"Capacitance",min:100,max:1000,step:10,value:470,unit:" µF"},
      {id:"V0",label:"Initial voltage",min:1,max:12,step:0.5,value:6,unit:" V"}
    ],explain:"During discharge V, Q and current magnitude fall exponentially with the same time constant RC.",exam:"A log-linear plot of ln(V/V₀) against t has gradient −1/RC.",mistake:"One time constant is not the half-life."},
    magWire:{code:"3.7.5.1",title:"Force on a wire",subtitle:"Manipulate B, I and L and determine force direction.",controls:[
      {id:"B",label:"Flux density",min:0.05,max:0.6,step:0.01,value:0.25,unit:" T"},
      {id:"I",label:"Current",min:-5,max:5,step:0.1,value:2.5,unit:" A"},
      {id:"L",label:"Length in field",min:0.02,max:0.15,step:0.005,value:0.08,unit:" m"}
    ],explain:"For perpendicular current and field, force magnitude is BIL. Reversing current reverses force.",exam:"Use Fleming's left-hand rule for conventional current.",mistake:"Only the conductor length inside the field contributes."},
    particle:{code:"3.7.5.2",title:"Charged particle in B",subtitle:"Control circular radius with B, speed, mass and charge sign.",controls:[
      {id:"B",label:"Flux density",min:0.05,max:0.5,step:0.01,value:0.2,unit:" T"},
      {id:"speed",label:"Speed",min:0.5,max:5,step:0.1,value:2,unit:"×10⁶ m s⁻¹"},
      {id:"chargeSign",label:"Charge sign",min:-1,max:1,step:2,value:1,unit:""}
    ],explain:"A perpendicular magnetic force bends a charged particle into a circle without changing speed.",exam:"Use charge magnitude for radius and charge sign for direction.",mistake:"Magnetic force does no work when perpendicular to velocity."},
    flux:{code:"3.7.5.3",title:"Flux-linkage rotator",subtitle:"Rotate a coil through a magnetic field.",controls:[
      {id:"B",label:"Flux density",min:0.02,max:0.2,step:0.01,value:0.08,unit:" T"},
      {id:"N",label:"Turns",min:50,max:500,step:10,value:200,unit:""},
      {id:"angle",label:"Angle to normal",min:0,max:180,step:1,value:30,unit:"°"}
    ],explain:"Flux linkage varies as BAN cosθ, where θ is measured to the area normal.",exam:"Always identify the angle convention before substituting.",mistake:"At 90° to the normal the field lies in the coil plane, so flux is zero."},
    induction:{code:"3.7.5.4",title:"Induction + rotating coil",subtitle:"Watch flux linkage and induced emf as a coil rotates.",controls:[
      {id:"B",label:"Flux density",min:0.02,max:0.3,step:0.01,value:0.15,unit:" T"},
      {id:"N",label:"Turns",min:50,max:500,step:10,value:200,unit:""},
      {id:"f",label:"Rotation frequency",min:0.2,max:4,step:0.1,value:1,unit:" Hz"}
    ],explain:"Induced emf is proportional to the rate of change of flux linkage, not simply to the flux.",exam:"For uniform rotation εpeak = BANω.",mistake:"Maximum flux linkage occurs when induced emf is zero."},
    ac:{code:"3.7.5.5",title:"AC oscilloscope",subtitle:"Read amplitude, rms, period and frequency.",controls:[
      {id:"peak",label:"Peak voltage",min:1,max:20,step:0.5,value:10,unit:" V"},
      {id:"f",label:"Frequency",min:1,max:100,step:1,value:20,unit:" Hz"}
    ],explain:"A sinusoidal AC waveform alternates polarity. RMS is peak divided by √2.",exam:"Measure centre-to-peak for peak voltage and horizontal divisions for period.",mistake:"Peak-to-peak is twice the peak value."},
    transformer:{code:"3.7.5.6",title:"Transformer + transmission",subtitle:"Change turns ratio and transmission voltage.",controls:[
      {id:"Np",label:"Primary turns",min:100,max:1000,step:50,value:500,unit:""},
      {id:"Ns",label:"Secondary turns",min:50,max:1500,step:50,value:1000,unit:""},
      {id:"Vp",label:"Primary voltage",min:50,max:500,step:10,value:230,unit:" V"},
      {id:"loadP",label:"Power transferred",min:100,max:5000,step:100,value:1000,unit:" W"}
    ],explain:"Changing turns ratio changes voltage. At approximately constant power, higher voltage means lower current and much lower I²R cable loss.",exam:"Separate ideal turns-ratio calculations from real efficiency losses.",mistake:"A step-up transformer increases voltage but does not create power."}
  };

  const formulas = [
    {topic:"gravity",name:"Newton gravitational force",eq:"F = GMm/r²",vars:[["M","Source mass","kg",5.97e24],["m","Object mass","kg",1000],["r","Separation","m",7e6]],calc:v=>G*v.M*v.m/v.r**2,unit:"N"},
    {topic:"gravity",name:"Gravitational field strength",eq:"g = GM/r²",vars:[["M","Source mass","kg",5.97e24],["r","Radius","m",7e6]],calc:v=>G*v.M/v.r**2,unit:"N kg⁻¹"},
    {topic:"gravity",name:"Gravitational potential",eq:"V = −GM/r",vars:[["M","Source mass","kg",5.97e24],["r","Radius","m",7e6]],calc:v=>-G*v.M/v.r,unit:"J kg⁻¹"},
    {topic:"gravity",name:"Potential-energy change",eq:"ΔE = mΔV",vars:[["m","Mass","kg",2],["dV","Potential change","J kg⁻¹",1e7]],calc:v=>v.m*v.dV,unit:"J"},
    {topic:"gravity",name:"Circular orbital speed",eq:"v = √(GM/r)",vars:[["M","Central mass","kg",5.97e24],["r","Orbital radius","m",7e6]],calc:v=>Math.sqrt(G*v.M/v.r),unit:"m s⁻¹"},
    {topic:"gravity",name:"Orbital period",eq:"T = 2π√(r³/GM)",vars:[["M","Central mass","kg",5.97e24],["r","Orbital radius","m",7e6]],calc:v=>2*Math.PI*Math.sqrt(v.r**3/(G*v.M)),unit:"s"},
    {topic:"gravity",name:"Circular-orbit total energy",eq:"E = −GMm/(2r)",vars:[["M","Central mass","kg",5.97e24],["m","Satellite mass","kg",1000],["r","Radius","m",7e6]],calc:v=>-G*v.M*v.m/(2*v.r),unit:"J"},
    {topic:"gravity",name:"Escape speed",eq:"v = √(2GM/r)",vars:[["M","Body mass","kg",5.97e24],["r","Launch radius","m",6.37e6]],calc:v=>Math.sqrt(2*G*v.M/v.r),unit:"m s⁻¹"},
    {topic:"electric",name:"Coulomb force",eq:"F = kQq/r²",vars:[["Q","Charge Q","C",2e-9],["q","Charge q","C",3e-9],["r","Separation","m",0.1]],calc:v=>k*Math.abs(v.Q*v.q)/v.r**2,unit:"N"},
    {topic:"electric",name:"Electric field from force",eq:"E = F/Q",vars:[["F","Force","N",0.02],["Q","Test charge","C",2e-6]],calc:v=>v.F/v.Q,unit:"N C⁻¹"},
    {topic:"electric",name:"Uniform electric field",eq:"E = V/d",vars:[["V","Potential difference","V",2000],["d","Plate spacing","m",0.04]],calc:v=>v.V/v.d,unit:"V m⁻¹"},
    {topic:"electric",name:"Radial electric field",eq:"E = kQ/r²",vars:[["Q","Source charge","C",4e-9],["r","Radius","m",0.2]],calc:v=>k*v.Q/v.r**2,unit:"N C⁻¹"},
    {topic:"electric",name:"Radial electric potential",eq:"V = kQ/r",vars:[["Q","Source charge","C",4e-9],["r","Radius","m",0.2]],calc:v=>k*v.Q/v.r,unit:"V"},
    {topic:"electric",name:"Electrical work / energy",eq:"ΔE = qΔV",vars:[["q","Charge","C",3e-9],["dV","Potential change","V",500]],calc:v=>v.q*v.dV,unit:"J"},
    {topic:"capacitance",name:"Capacitance",eq:"C = Q/V",vars:[["Q","Charge","C",0.00264],["V","Potential difference","V",12]],calc:v=>v.Q/v.V,unit:"F"},
    {topic:"capacitance",name:"Parallel-plate capacitance",eq:"C = ε₀εrA/d",vars:[["er","Relative permittivity","",2.2],["A","Area","m²",0.01],["d","Separation","m",0.002]],calc:v=>e0*v.er*v.A/v.d,unit:"F"},
    {topic:"capacitance",name:"Capacitor energy (CV²)",eq:"E = ½CV²",vars:[["C","Capacitance","F",470e-6],["V","Potential difference","V",9]],calc:v=>0.5*v.C*v.V**2,unit:"J"},
    {topic:"capacitance",name:"Time constant",eq:"τ = RC",vars:[["R","Resistance","Ω",4700],["C","Capacitance","F",470e-6]],calc:v=>v.R*v.C,unit:"s"},
    {topic:"capacitance",name:"Discharge voltage",eq:"V = V₀e^(−t/RC)",vars:[["V0","Initial voltage","V",6],["t","Time","s",2],["R","Resistance","Ω",4700],["C","Capacitance","F",470e-6]],calc:v=>v.V0*Math.exp(-v.t/(v.R*v.C)),unit:"V"},
    {topic:"magnetic",name:"Force on current-carrying wire",eq:"F = BIL",vars:[["B","Flux density","T",0.25],["I","Current","A",3],["L","Length","m",0.08]],calc:v=>v.B*v.I*v.L,unit:"N"},
    {topic:"magnetic",name:"Force on moving charge",eq:"F = BQv",vars:[["B","Flux density","T",0.2],["Q","Charge magnitude","C",1.6e-19],["v","Speed","m s⁻¹",2e6]],calc:v=>v.B*v.Q*v.v,unit:"N"},
    {topic:"magnetic",name:"Particle path radius",eq:"r = mv/(BQ)",vars:[["m","Mass","kg",1.67e-27],["v","Speed","m s⁻¹",2e6],["B","Flux density","T",0.2],["Q","Charge magnitude","C",1.6e-19]],calc:v=>v.m*v.v/(v.B*v.Q),unit:"m"},
    {topic:"magnetic",name:"Magnetic flux",eq:"Φ = BA cosθ",vars:[["B","Flux density","T",0.08],["A","Area","m²",0.01],["theta","Angle to normal","deg",60]],calc:v=>v.B*v.A*Math.cos(v.theta*Math.PI/180),unit:"Wb"},
    {topic:"magnetic",name:"Flux linkage",eq:"NΦ = BAN cosθ",vars:[["B","Flux density","T",0.08],["A","Area","m²",0.01],["N","Turns","",200],["theta","Angle to normal","deg",60]],calc:v=>v.B*v.A*v.N*Math.cos(v.theta*Math.PI/180),unit:"Wb turn"},
    {topic:"magnetic",name:"Faraday induced emf",eq:"|ε| = |Δ(NΦ)|/Δt",vars:[["dFlux","Change in flux linkage","Wb turn",0.3],["dt","Time interval","s",0.05]],calc:v=>Math.abs(v.dFlux/v.dt),unit:"V"},
    {topic:"magnetic",name:"Motional emf",eq:"ε = Blv",vars:[["B","Flux density","T",0.25],["L","Length","m",0.12],["v","Speed","m s⁻¹",3]],calc:v=>v.B*v.L*v.v,unit:"V"},
    {topic:"magnetic",name:"Rotating-coil peak emf",eq:"ε₀ = BANω",vars:[["B","Flux density","T",0.2],["A","Area","m²",0.015],["N","Turns","",100],["f","Frequency","Hz",50]],calc:v=>v.B*v.A*v.N*2*Math.PI*v.f,unit:"V"},
    {topic:"magnetic",name:"RMS voltage",eq:"Vrms = Vpeak/√2",vars:[["Vpeak","Peak voltage","V",325]],calc:v=>v.Vpeak/Math.sqrt(2),unit:"V"},
    {topic:"magnetic",name:"Transformer voltage",eq:"Vs = Vp Ns/Np",vars:[["Vp","Primary voltage","V",230],["Np","Primary turns","",500],["Ns","Secondary turns","",50]],calc:v=>v.Vp*v.Ns/v.Np,unit:"V"},
    {topic:"magnetic",name:"Transmission cable loss",eq:"Ploss = I²R",vars:[["I","Line current","A",5],["R","Cable resistance","Ω",2]],calc:v=>v.I**2*v.R,unit:"W"}
  ];

  const diagnostics = [
    {q:"Why is gravitational potential negative near a planet when zero is chosen at infinity?",a:"Because energy must be supplied to move a mass from the bound position to infinity; the bound position is below the zero reference."},
    {q:"A satellite moves to a higher circular orbit. What happens to speed and total energy?",a:"Speed decreases; total energy increases toward zero (becomes less negative)."},
    {q:"Why does a magnetic field not change the speed of a charged particle when v is perpendicular to B?",a:"The magnetic force is perpendicular to velocity, so it does no work."},
    {q:"What graph would you use in RP9 to obtain RC from a discharge?",a:"Plot ln(V/V₀) against t; gradient = −1/RC."},
    {q:"Why does high-voltage transmission reduce power loss?",a:"For the same transmitted power, higher voltage gives lower current; cable loss I²R therefore falls strongly."},
    {q:"When is induced emf zero for a rotating coil?",a:"When flux linkage is at a maximum or minimum because its instantaneous rate of change is zero."},
    {q:"State the difference between electric potential and electric field strength.",a:"Potential is scalar work per unit charge; field strength is vector force per unit positive charge."}
  ];

  const specMap = [
    ["3.7.1 Fields","Force fields, vectors, similarities/differences","Fields: the unifying idea","Field comparison"],
    ["3.7.2 Gravitational fields","Newton law, g, potential, orbits, escape, synchronous satellites","Lessons 2–5","Gravity + orbit labs"],
    ["3.7.3 Electric fields","Coulomb law, E, uniform/radial fields, potential","Lessons 6–8","Electric-field lab"],
    ["3.7.4 Capacitance","C, parallel plates, dielectrics, energy, exponential charge/discharge","Lessons 9–11","Capacitor labs + RP9"],
    ["3.7.5.1–2 Magnetic forces","Wire force, flux density, moving charges, cyclotron","Lessons 12–13","Wire + particle labs + RP10"],
    ["3.7.5.3 Flux","Flux, flux linkage, angle","Lesson 14","Flux rotator + RP11"],
    ["3.7.5.4 Induction","Faraday, Lenz, moving conductor, rotating coil","Lessons 15–16","Induction generator lab"],
    ["3.7.5.5 AC","Sinusoidal AC, rms, peak, oscilloscope","Lesson 17","AC oscilloscope lab"],
    ["3.7.5.6 Transformer","Turns ratio, efficiency, eddy currents, power transmission","Lesson 18","Transformer + grid lab"]
  ];

  return {G,k,e0,lessons,simulations,formulas,diagnostics,specMap};
})();