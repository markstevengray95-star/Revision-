(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const R=[
{
 title:"Nuclei, isotopes and notation",
 summary:"This lesson establishes the language and scale of nuclear physics. Students should be able to move fluently between nuclide notation, proton number, neutron number and nucleon number, and should understand why the nucleus dominates atomic mass while occupying only a tiny fraction of atomic volume.",
 sections:[
  ["Protons, neutrons and nucleons","The nucleus contains protons and neutrons. These are collectively called nucleons. The proton number Z is the number of protons and fixes the element. The neutron number N is the number of neutrons. The nucleon number A is the total number of nucleons, so A = Z + N and N = A − Z. Changing Z changes the element; changing N while keeping Z fixed produces a different isotope of the same element."],
  ["Nuclide notation","A nuclide symbol records the chemical symbol together with A and Z. The lower number is Z and the upper number is A. Once A and Z are known, N follows immediately. Nuclear equations should conserve total nucleon number and total charge, so nuclide notation also becomes a checking tool later in the topic."],
  ["Isotopes","Isotopes are atoms of the same element with the same proton number but different neutron numbers. Their chemical behaviour is broadly similar because chemistry depends mainly on electron structure, but their nuclear masses and stability can differ because the nucleus is different."],
  ["Nuclear and atomic scale","Typical atomic radii are of order 10⁻¹⁰ m while nuclear radii are of order 10⁻¹⁵ m. The nucleus is therefore about five orders of magnitude smaller in radius. Despite this, almost all atomic mass is concentrated in the nucleus because electrons have much smaller mass than protons and neutrons."]
 ],
 equations:[["A = Z + N","A: nucleon number; Z: proton number; N: neutron number","dimensionless counts"],["N = A − Z","Find neutron number from nuclide notation","dimensionless counts"]],
 evidence:["Use standard form confidently: 1 fm = 10⁻¹⁵ m.","Distinguish radius from volume when comparing nuclear and atomic scale.","Use conservation of nucleon number and charge as a check in later decay equations."],
 exam:["If asked to define an isotope, state both parts: same Z, different N.","If asked for neutron number, show N = A − Z before the numerical answer.","Avoid saying the nucleus contains 'all' the atomic mass; say almost all."]
},
{
 title:"Rutherford scattering",
 summary:"Rutherford scattering is evidence-based model building. Students need to know the observations, then explain exactly how each observation supports the nuclear model and why the earlier diffuse-positive-charge picture failed.",
 sections:[
  ["Experimental observations","Most alpha particles passed through a thin metal foil with little or no deflection. A smaller number were deflected through modest angles. A very small fraction were scattered through very large angles, including some back toward the source. These observations must be kept separate from the conclusions drawn from them."],
  ["From observation to inference","Mostly straight-through paths imply that most of the atom contains no concentrated matter or charge capable of strongly deflecting the alpha particles. Rare large-angle events require a very strong repulsive interaction acting in a very small region. This supports a tiny, positively charged nucleus containing most of the atomic mass."],
  ["Why the force is repulsive","An alpha particle has charge +2e and the nucleus has positive charge +Ze. The electric interaction is therefore repulsive. A smaller impact parameter brings the alpha closer to the nucleus and increases the force. For a given path, a higher-energy alpha particle is less strongly deflected because its momentum is harder to change."],
  ["Scientific model change","The key lesson is not just the final nuclear model but how evidence changed the accepted model of the atom. A diffuse positive charge could not generate the rare, very large deflections, so the model had to concentrate positive charge into a much smaller region."]
 ],
 equations:[["F ∝ 1/r²","Qualitative link to stronger electrostatic force at smaller separation","force relationship from electrostatics"],["alpha charge = +2e","Use when reasoning about repulsion","C"]],
 evidence:["Separate observations from conclusions in extended responses.","Use 'rare large-angle scattering' as the strongest evidence for a compact nucleus.","Link stronger force to greater momentum change and therefore greater deflection."],
 exam:["A high-quality explanation follows observation → force/interaction → structural conclusion.","Do not say that most alpha particles miss the atom; they pass through the mostly empty atomic volume.","Do not attribute large deflections to electrons."]
},
{
 title:"Alpha, beta and gamma",
 summary:"Students should compare alpha, beta-minus and gamma radiation by what they are, their charge, ionising behaviour, penetration and experimental identification. They should then apply those properties to hazards and uses.",
 sections:[
  ["Nature and charge","Alpha radiation consists of helium nuclei containing two protons and two neutrons, so each alpha particle has charge +2e. Beta-minus radiation consists of fast electrons emitted in nuclear beta decay, so each has charge −e. Gamma radiation consists of high-energy electromagnetic photons, so it has no charge and no rest mass."],
  ["Ionisation and penetration","Alpha particles interact strongly with matter, lose energy quickly and are therefore strongly ionising but weakly penetrating. Beta radiation has intermediate ionising and penetrating power. Gamma photons interact less frequently and can travel much further through matter, so they are highly penetrating but generally less ionising per unit path."],
  ["Experimental identification","Unknown radiation can be identified by comparing detector count rate with different absorbers in place. Alpha is stopped very readily, beta penetrates further but is strongly reduced by thin metal, and gamma is attenuated progressively. Gamma does not have one universal stopping thickness."],
  ["Hazards depend on context","External and internal hazards differ. Alpha is usually not a major external penetration hazard but can be significant if radioactive material is inside the body because its energy is deposited over a short range. Gamma can be an important external hazard because of its penetration. Risk also depends on activity, exposure time, distance, energy and shielding."]
 ],
 equations:[["1 Bq = 1 decay s⁻¹","Activity unit used later in the topic","s⁻¹"],["count rate","Detector response; not automatically equal to source activity","counts s⁻¹"]],
 evidence:["Use absorption evidence, not memorised labels, to identify unknown radiation.","Describe gamma as attenuated rather than 'stopped at an exact thickness'.","Link ionisation and penetration to both application and hazard."],
 exam:["For compare questions, use the same property across all three radiation types.","For hazard questions, specify whether exposure is internal or external.","Do not equate detector count rate directly with source activity without considering detection efficiency/geometry."]
},
{
 title:"Inverse square, background and Required Practical 12",
 summary:"This lesson combines a physical model, experimental design and data analysis. Students should understand why a point-like gamma source follows an inverse-square relationship and how background-corrected count-rate data are used to test it.",
 sections:[
  ["Why inverse square occurs","For an approximately point source radiating in all directions, the same emitted energy or photon flux is spread over the surface of a sphere. Sphere area is proportional to r², so intensity is proportional to 1/r². Doubling distance therefore reduces ideal source intensity to one quarter."],
  ["Background radiation","A detector records events even without the intended source. Background can arise from cosmic rays, naturally occurring radioactive materials and the local environment. Measure background separately and subtract it from the measured count rate to estimate the count rate due to the source."],
  ["How to test the relationship","Take readings at several distances, keep geometry consistent, estimate background and calculate corrected count rate. For each distance calculate 1/r². A graph of corrected count rate against 1/r² should be approximately linear and close to the origin if the inverse-square model is suitable."],
  ["Random uncertainty","Radioactive counting fluctuates randomly. Repeats and/or longer counting intervals reduce relative random uncertainty because a larger total number of counts is collected. Scatter around a trend is therefore expected and should be interpreted rather than treated as automatic experimental failure."],
  ["Limits of the model","At small source-detector separations the source and detector cannot be treated as perfect points and the geometry may distort the ideal relationship. Background subtraction also becomes increasingly important when the source contribution becomes small at large distance."]
 ],
 equations:[["I ∝ 1/r²","Ideal point-source intensity relation","W m⁻² or relative intensity"],["I₂/I₁ = (r₁/r₂)²","Compare two distances","ratio"],["corrected count rate = measured count rate − background count rate","Remove environmental detector contribution","counts s⁻¹"]],
 evidence:["RP12 requires interpretation of inverse-square data, background and graph behaviour.","A straight graph of corrected rate against 1/r² supports the model.","Discuss random scatter and finite geometry as limitations."],
 exam:["Always say 'background-corrected count rate' when testing 1/r² using detector data.","When distance doubles, square the distance factor before applying it to intensity.","For evaluation, suggest longer counts/repeats for random uncertainty and discuss geometry/systematic effects separately."]
},
{
 title:"Radiation applications, hazards and medicine",
 summary:"This lesson is about choosing radiation for a purpose and evaluating risk using physics. Students should move beyond memorised advantages/disadvantages and link every conclusion to penetration, ionisation, activity and exposure conditions.",
 sections:[
  ["Thickness monitoring","A source and detector are placed on opposite sides of a moving material. If thickness increases, attenuation increases and detector count rate decreases. The radiation must be penetrating enough to reach the detector but not so penetrating that changes in thickness barely affect the count rate."],
  ["Relative hazards","Ionising radiation can damage biological tissue. The size of the risk depends on radiation type and energy, source activity, exposure duration, distance, shielding and whether radioactive material is outside or inside the body. A complete answer names the relevant exposure conditions rather than ranking alpha, beta and gamma with one universal danger scale."],
  ["Safe handling principles","Increasing distance reduces exposure from a localized source, reducing exposure time reduces accumulated exposure, and suitable shielding attenuates radiation. In the course these ideas are treated conceptually and through virtual models."],
  ["Medicine","Radiation can be useful for diagnosis because penetrating radiation can leave the body and be detected externally, and for treatment because ionisation can damage target cells. Evaluation should balance the intended benefit against unwanted ionisation of healthy tissue and justify why the chosen radiation is suitable."]
 ],
 equations:[["I ∝ 1/r²","Useful for distance reasoning around an approximately point-like gamma source","relative intensity"],["activity A","Number of decays per second","Bq"]],
 evidence:["Link detector count-rate change to material thickness.","Use risk-benefit reasoning rather than lists.","Distinguish physical property, useful effect and possible biological harm."],
 exam:["A good evaluation has a justified conclusion based on relevant physics.","Avoid vague phrases such as 'gamma is stronger'. Name penetration/ionisation instead.","For thickness gauges explain why both too little and too much penetration would be unsuitable."]
},
{
 title:"Random decay, activity and decay constant",
 summary:"Students need a probabilistic model of decay: individual events are unpredictable, but large populations follow a predictable statistical law because each undecayed nucleus has the same constant probability per unit time.",
 sections:[
  ["Random individual events","You cannot predict exactly when a particular unstable nucleus will decay. Radioactive decay is spontaneous and random at the level of individual nuclei. A nucleus does not 'age' toward decay in the model."],
  ["Constant probability","For a given nuclide, each undecayed nucleus has a constant probability of decay per unit time. This is the reason decay is exponential rather than linear: when fewer nuclei remain, fewer decays occur per unit time on average."],
  ["Activity","Activity A is the rate at which nuclei decay in the source. The SI unit is the becquerel, with 1 Bq equal to 1 decay per second. Activity is not necessarily the same as the detector count rate because a detector may record only a fraction of emitted radiation."],
  ["Decay constant","The decay constant λ describes the probability rate for decay and has dimensions of inverse time. For a fixed N, a larger λ gives a larger activity. A large λ also corresponds to a shorter half-life."]
 ],
 equations:[["A = λN","Activity from decay constant and number of undecayed nuclei","A in Bq; λ in s⁻¹ if time is in seconds"],["1 Bq = 1 s⁻¹","One nuclear decay per second","Bq"]],
 evidence:["Dice/coin simulations can model constant probability while individual events remain random.","A smooth exponential curve describes expected large-population behaviour, not the exact history of every small sample.","Distinguish activity from measured detector count rate."],
 exam:["Use 'constant probability per unit time' in explanations of randomness.","State the inverse-time unit for λ.","Do not say half the nuclei decay at exactly one chosen instant."]
},
{
 title:"Exponential decay, half-life and graphs",
 summary:"This lesson turns the probability model into mathematical relationships. Students should calculate with exponential decay, determine half-life graphically, use log graphs and apply the model to contexts such as dating and radioactive waste.",
 sections:[
  ["Exponential population law","Because decay rate is proportional to the number of undecayed nuclei, N follows N = N₀e^(−λt). Activity follows the same form because A = λN, giving A = A₀e^(−λt). The ideal curve approaches zero asymptotically rather than reaching zero at one finite time."],
  ["Half-life","Half-life T½ is the time for the number of undecayed nuclei or the activity to fall to half its value. After n half-lives, the expected fraction remaining is (1/2)^n. The relationship T½ = ln2/λ connects the graphical timescale to the decay constant."],
  ["Decay curves","On an ordinary activity-time or number-time graph, half-life can be estimated by choosing a value and finding the time interval for it to halve. Repeating this at different parts of the curve checks whether the half-life is consistent."],
  ["Log graphs","Taking natural logs gives ln A = ln A₀ − λt. A graph of ln A against t should therefore be a straight line with gradient −λ and intercept ln A₀. Use the magnitude of the gradient to find λ and then half-life."],
  ["Applications","Radioactive dating uses predictable decay to relate the current amount/activity of a radionuclide to elapsed time, provided the assumptions of the dating model are suitable. Waste-storage questions use the same exponential mathematics to estimate how activity changes over long timescales."]
 ],
 equations:[["N = N₀e^(−λt)","Number of undecayed nuclei after time t","N: nuclei"],["A = A₀e^(−λt)","Activity after time t","Bq"],["T½ = ln2/λ","Half-life relationship","time"],["ln A = ln A₀ − λt","Linearised decay relationship","gradient = −λ"]],
 evidence:["Use ordinary decay curves and log-linear plots.","Check units of λ against the time unit used.","Interpret gradient and intercept rather than just drawing a line."],
 exam:["If λ is in s⁻¹, t must be in seconds.","Use the magnitude of the negative log-graph gradient for λ.","For dating questions state or recognise the assumptions supplied in the question rather than treating every radionuclide as a universal clock."]
},
{
 title:"Decay calculations with moles and Avogadro constant",
 summary:"This lesson links measurable sample mass to microscopic numbers of nuclei and then to activity. Students should be able to build multi-stage calculation chains without losing units or confusing molar mass with nucleon number.",
 sections:[
  ["Mass to amount of substance","Use n = m/M, where m is the sample mass and M is molar mass. The units must match: for example, grams with grams per mole or kilograms with kilograms per mole."],
  ["Moles to nuclei","One mole contains the Avogadro constant N_A of particles. For a pure isotope sample, N = nN_A gives the number of nuclei. If the sample is not pure, any abundance/fraction information supplied in the question must be included."],
  ["Nuclei to activity","Once N is known, activity is A = λN. If the question gives half-life rather than λ, first use λ = ln2/T½. Keep time units consistent."],
  ["Including elapsed time","If the sample has been decaying for time t, use N = N₀e^(−λt) or A = A₀e^(−λt). Plan the chain before calculating so every intermediate quantity is clear and unit conversions are visible."]
 ],
 equations:[["n = m/M","Amount of substance","mol"],["N = nN_A","Number of nuclei","N_A ≈ 6.02 × 10²³ mol⁻¹"],["A = λN","Activity","Bq"],["λ = ln2/T½","Convert half-life to decay constant","inverse time"],["N = N₀e^(−λt)","Include elapsed decay time","nuclei"]],
 evidence:["Use standard form carefully because N is usually very large.","Check whether the sample is pure and whether molar mass is supplied in g mol⁻¹ or kg mol⁻¹.","Estimate order of magnitude to catch calculator-entry errors."],
 exam:["Write the calculation chain before substituting numbers.","Do not use T½ in A=λN; convert it to λ first.","Give activity in Bq and keep λ/t units consistent."]
},
{
 title:"Nuclear instability and decay equations",
 summary:"Students should use the N–Z stability graph and simple nuclear equations to describe how alpha, beta-minus, beta-plus, electron capture and gamma processes change a nucleus.",
 sections:[
  ["Band of stability","Stable nuclei occupy a band on an N-versus-Z graph. For light stable nuclei N is often similar to Z, but heavier stable nuclei generally contain proportionally more neutrons. Stability is therefore not a universal N=Z rule."],
  ["Alpha decay","An alpha particle contains two protons and two neutrons. Alpha decay decreases A by 4, Z by 2 and N by 2. The daughter nucleus therefore moves down and left on an N–Z graph."],
  ["Beta-minus","In beta-minus decay a neutron changes into a proton while a beta-minus particle is emitted. A remains constant, Z increases by 1 and N decreases by 1. The daughter moves down and right on an N–Z graph."],
  ["Beta-plus and electron capture","Both processes convert a proton into a neutron at the nuclear bookkeeping level. A remains constant, Z decreases by 1 and N increases by 1. Electron capture involves the nucleus capturing an inner atomic electron."],
  ["Gamma emission","Gamma emission changes only the nuclear energy state. It does not change A, Z or N, so the nuclide remains at the same position on an N–Z graph."]
 ],
 equations:[["alpha: ΔA = −4, ΔZ = −2","Alpha emission",""],["beta−: ΔA = 0, ΔZ = +1","n → p transformation",""],["beta+/electron capture: ΔA = 0, ΔZ = −1","p → n transformation",""],["gamma: ΔA = 0, ΔZ = 0","Energy-state change only",""]],
 evidence:["Use both N and Z axes when describing graph movement.","Balance simple decay equations by total nucleon number and total charge.","Relate decay mode to movement toward the stability band when appropriate."],
 exam:["For decay equations, check A first and charge/Z second.","Do not move the nuclide on the stability graph for gamma emission.","Do not describe beta radiation as an electron originally orbiting the nucleus."]
},
{
 title:"Excited nuclei and gamma energy levels",
 summary:"This lesson connects nuclear excited states with gamma photons. Students should read energy-level diagrams, calculate photon energy/frequency and understand why technetium-99m is a useful A-level diagnostic example.",
 sections:[
  ["Discrete nuclear energy states","A nucleus can occupy discrete energy states. The ground state is the lowest energy state; excited states lie above it. Nuclear transitions are distinct from atomic electron-shell transitions."],
  ["Gamma emission","When a nucleus changes from a higher nuclear energy state to a lower one, it can emit a gamma photon. The photon energy equals the difference between the two levels. Because no nucleons are added or removed, A and Z do not change."],
  ["Energy-level diagrams","Horizontal lines represent allowed nuclear energy states. A downward arrow represents a transition with photon emission. The vertical energy difference determines the gamma energy. Different possible transitions can create different photon energies."],
  ["Technetium-99m","The 'm' indicates a metastable excited state with a relatively long lifetime compared with many nuclear excited states. Its gamma emission can be detected outside the body, making it a useful example for diagnosis. The examinable focus is nuclear states, gamma emission and external detection."]
 ],
 equations:[["ΔE = hf","Gamma photon energy from level spacing","J if h is in J s"],["f = ΔE/h","Photon frequency","Hz"],["1 eV = 1.60 × 10⁻¹⁹ J","Energy conversion","J"]],
 evidence:["Read energy differences directly from supplied level diagrams.","Convert keV/MeV to joules when using Planck's constant in SI.","Identify whether a transition is emission (downward) or requires energy input (upward)."],
 exam:["State explicitly that A and Z are unchanged in gamma emission.","Do not confuse nuclear gamma levels with atomic electron levels.","If ΔE is given in MeV, convert units consistently before using h in SI."]
},
{
 title:"Alpha closest approach",
 summary:"Closest approach uses conservation of energy and Coulomb repulsion to estimate a nuclear-scale distance. Students should understand the assumptions and how changes in alpha energy or target charge alter the result.",
 sections:[
  ["Head-on approximation","The model considers an alpha particle approaching a positive nucleus with an impact parameter close to zero. The electrostatic interaction is repulsive. As the alpha approaches, its kinetic energy decreases and electrostatic potential energy increases."],
  ["Turning point","At the ideal closest approach, the alpha particle is momentarily at rest in the radial direction, so its initial kinetic energy has been converted into electrostatic potential energy. This creates a simple energy equation for the minimum separation."],
  ["Charge factors","The alpha has charge +2e and a target nucleus with proton number Z has charge +Ze. Both factors must appear in the Coulomb potential-energy expression."],
  ["Trends","For fixed Z, increasing alpha kinetic energy decreases the closest-approach distance because the alpha can move further into the repulsive potential. For fixed alpha energy, increasing Z increases the closest-approach distance because repulsion is stronger."],
  ["Interpretation and limitations","The result estimates a nuclear-scale upper limit/approach distance under a simplified head-on Coulomb model. It is not the same measurement technique as electron diffraction and is not a detailed model of the nuclear force."]
 ],
 equations:[["E_k = (1/4πε₀)(2Ze²/r)","Head-on closest-approach energy balance","J"],["r = (1/4πε₀)(2Ze²/E_k)","Closest-approach distance","m"],["1 MeV = 1.60 × 10⁻¹³ J","Energy conversion","J"]],
 evidence:["State the energy-conservation assumption.","Track +2e and +Ze separately.","Report nuclear distances conveniently in femtometres."],
 exam:["If alpha energy doubles with Z fixed, r halves in this model.","A larger Z gives a larger r for the same alpha energy.","State the head-on/electrostatic assumptions when evaluating the estimate."]
},
{
 title:"Electron diffraction and nuclear radius",
 summary:"Electron diffraction provides a wave-based method of determining nuclear radius. Students should connect de Broglie wavelength, the angular diffraction pattern and the size of the nucleus.",
 sections:[
  ["Why electrons work as probes","Matter has wave behaviour. An electron has de Broglie wavelength λ = h/p. High-momentum electrons have short wavelengths that can be comparable with nuclear dimensions, so their scattering/diffraction pattern can reveal nuclear size."],
  ["Intensity against angle","The experiment records scattered-electron intensity as a function of angle. The pattern contains maxima and minima caused by wave interference from the finite nuclear charge distribution."],
  ["Radius information","For a fixed electron wavelength, a larger scattering object produces a narrower angular diffraction pattern, so characteristic minima move to smaller angles. Questions may provide a specific relationship between wavelength, angle and radius; students should use the supplied model rather than memorising an unprovided constant."],
  ["Comparison with closest approach","Electron diffraction is fundamentally a wave-scattering measurement of nuclear size. Closest approach instead uses Coulomb energy conservation with alpha particles. The two methods rely on different physics and different assumptions."]
 ],
 equations:[["λ = h/p","de Broglie wavelength","m"],["p","Electron momentum; may be supplied or found from other data","kg m s⁻¹"]],
 evidence:["Be familiar with an intensity-against-angle graph.","Identify characteristic minima/maxima and use supplied relationships.","Keep wavelength fixed when inferring relative radii from angular shifts."],
 exam:["A smaller first-minimum angle at the same wavelength implies a larger nucleus.","Do not describe the pattern as simply particles bouncing from a hard sphere.","Use the exact relationship supplied in the question for numerical radius calculations."]
},
{
 title:"Radius law and nuclear density",
 summary:"Students should use experimental nuclear-radius data to understand R = r₀A^(1/3), then show why it implies approximately constant nuclear density and calculate that density.",
 sections:[
  ["Radius relationship","Experimental data show R = r₀A^(1/3), where r₀ is a constant of order 1 fm. The cube-root dependence means radius grows slowly with nucleon number. If A increases by a factor of 8, radius increases by a factor of 2."],
  ["Volume","Approximating a nucleus as a sphere gives V = 4πR³/3. Since R³ is proportional to A, nuclear volume is proportional to nucleon number."],
  ["Mass","Nuclear mass is approximately Au, where u is the atomic mass unit. This means nuclear mass is also approximately proportional to A."],
  ["Constant density","Density is ρ = m/V. If both m and V are proportional to A, A cancels from the ratio, giving approximately constant nuclear density across different nuclei."],
  ["Typical scale","Nuclear radii are typically a few femtometres. Calculated nuclear densities are enormous compared with everyday materials because a large amount of mass is concentrated in an extremely small volume."]
 ],
 equations:[["R = r₀A^(1/3)","Nuclear radius law","m"],["V = 4πR³/3","Spherical nuclear volume","m³"],["m ≈ Au","Approximate nuclear mass","kg"],["ρ = m/V","Nuclear density","kg m⁻³"],["1 fm = 10⁻¹⁵ m","Length conversion","m"]],
 evidence:["Use log/graph data if supplied to infer the A^(1/3) trend.","Use SI units for density.","Show the proportionality chain R³∝A → V∝A and m∝A."],
 exam:["For a derivation, explicitly show why A cancels in m/V.","Do not say density is exactly identical for every nucleus; say approximately constant.","Check cubing powers of ten carefully."]
},
{
 title:"Mass defect and binding energy",
 summary:"Mass defect and binding energy describe the lower mass-energy of a bound nucleus compared with separated nucleons. Students should calculate mass differences and convert them into nuclear binding energies.",
 sections:[
  ["Meaning of mass defect","The total mass of a bound nucleus is less than the sum of the masses of its separated constituent protons and neutrons. The difference is the mass defect Δm. This is an energy difference expressed through mass-energy equivalence."],
  ["Binding energy","Binding energy is the energy required to separate the nucleus completely into free nucleons. Equivalently, it is the energy released when the bound state is formed from separated nucleons, ignoring the detailed pathway."],
  ["Mass-energy equivalence","Use ΔE = Δmc². Nuclear mass differences are often given in atomic mass units, where 1 u corresponds to 931.5 MeV of energy, making direct u-to-MeV conversion convenient."],
  ["Binding energy per nucleon","Total binding energy increases with nucleus size in many cases, so total binding alone is not a good comparison of stability. Dividing by A gives average binding energy per nucleon, which is used in the binding-energy curve."],
  ["Mass bookkeeping","Use the masses supplied by the question consistently. If atomic masses are used, consider whether electron masses cancel between initial and final states; follow the data conventions given in the question."]
 ],
 equations:[["ΔE = Δmc²","Mass-energy equivalence","J"],["1 u = 931.5 MeV","Nuclear mass-energy conversion","MeV"],["BE per nucleon = total BE/A","Average binding energy","MeV per nucleon"]],
 evidence:["Mass defect = separated-nucleon mass − bound-nucleus mass.","Positive binding energy corresponds to a lower-energy bound state.","Use sufficient significant figures when subtracting similar masses."],
 exam:["Do not call mass defect 'lost matter'. Explain lower total mass-energy.","Distinguish total binding energy from binding energy per nucleon.","If using u, multiply the mass difference by 931.5 MeV/u."]
},
{
 title:"Binding-energy curve, fusion and fission",
 summary:"The binding-energy-per-nucleon curve explains why both fusion of light nuclei and fission of heavy nuclei can release energy. Exact reaction energies require mass data.",
 sections:[
  ["Shape of the curve","Average binding energy per nucleon rises rapidly from very light nuclei, reaches a broad maximum in the medium-mass region and then decreases gradually for very heavy nuclei. A higher value means nucleons are more tightly bound on average."],
  ["Fusion","When suitable light nuclei combine, the product can have a greater binding energy per nucleon. The final system is more tightly bound and has lower rest mass-energy, so the mass difference appears as released energy."],
  ["Fission","A very heavy nucleus can split into medium-mass products with greater binding energy per nucleon. Again the products are more tightly bound overall, so the reduction in total rest mass corresponds to released energy."],
  ["Exact reaction energy","The curve explains the direction and qualitative reason for energy release. For a specific fission or fusion reaction, calculate Q from the total initial and final masses supplied."],
  ["Societal link","Understanding nuclear binding and reaction energy allows nuclear-energy claims to be evaluated using physics rather than only social or political assertions."]
 ],
 equations:[["Q = (m_initial − m_final)c²","Reaction energy","J"],["Q(MeV) = Δm(u) × 931.5","Convenient nuclear conversion","MeV"],["BE/A","Average binding energy per nucleon","MeV per nucleon"]],
 evidence:["Identify fusion-favourable and fission-favourable regions on the curve.","Compare total binding, not only the visual height of a single point, when reasoning about whole reactions.","Use exact mass data for numerical Q values."],
 exam:["A positive initial-minus-final mass difference corresponds to released energy.","Do not claim the binding-energy curve alone gives the exact energy of any arbitrary reaction.","Explain 'more tightly bound' through higher BE per nucleon/lower total mass-energy."]
},
{
 title:"Induced fission, chain reactions and criticality",
 summary:"This lesson explains neutron-induced fission and the qualitative neutron balance behind chain reactions. Students need conceptual understanding rather than operational reactor or criticality design.",
 sections:[
  ["Induced fission","A suitable fissile nucleus can absorb a neutron, become unstable and split into smaller nuclei. Fission releases energy and additional neutrons that may interact with other fissile nuclei."],
  ["Chain reaction","A chain reaction consists of successive generations. Some emitted neutrons produce further fissions; others escape or are absorbed without causing fission. The size of each new generation depends on the balance between useful neutron production and neutron losses."],
  ["Subcritical, critical and increasing behaviour","If too few neutrons cause later fissions, the chain dies away. A self-sustaining condition occurs when neutron production balances losses sufficiently for one generation to replace the previous one. If later generations grow, the neutron population is increasing. For this course, this remains qualitative."],
  ["Critical mass concept","The amount and geometry of fissile material affect the fraction of neutrons that escape. The idea of critical mass therefore represents a qualitative condition for a self-sustaining chain, not a calculation students need to design or optimise."],
  ["Energy transfer","Much of the fission energy initially appears as kinetic energy of fission products. Collisions transfer this energy to surrounding material, increasing internal energy and producing useful thermal energy in a reactor context."]
 ],
 equations:[["neutron generation balance","production vs escape/absorption losses","qualitative"],["energy conservation","fission mass-energy difference becomes kinetic/radiation energy","J or MeV"]],
 evidence:["Explain a chain generation by generation.","Separate neutron losses from moderation: a slowed neutron is not necessarily removed.","Keep criticality reasoning qualitative, as required by the course."],
 exam:["Use 'thermal neutron induced fission' where the question specifies a thermal reactor context.","Do not confuse critical mass with a universal fixed number independent of conditions.","Do not give reactor-design or criticality calculations; AQA requires the concept, not operational design."]
},
{
 title:"Thermal reactors: moderator, control rods and coolant",
 summary:"Students should distinguish the three main reactor functions—moderation, neutron absorption/control and heat transfer—and understand how material properties are matched to each role.",
 sections:[
  ["Why moderation is needed","Fission neutrons are produced fast. In a thermal reactor, a moderator reduces their kinetic energy through collisions, producing slower thermal neutrons that are more suitable for sustaining the intended fission process in the fuel."],
  ["Mechanical model of moderation","In an elastic collision, kinetic energy can be transferred from a neutron to a moderator nucleus. Energy transfer is more effective when the target mass is not enormously larger than the neutron mass. A good moderator also has low neutron absorption so neutrons are slowed rather than removed."],
  ["Control rods","Control rods absorb neutrons. Moving more absorbing material into the active region reduces the number of neutrons available to cause further fission; withdrawing it increases availability. The examinable role is neutron absorption/control, not detailed engineering."],
  ["Coolant","Coolant transfers thermal energy away from the reactor core to another part of the energy-conversion system. Its job is heat transfer, so useful properties include suitable thermal behaviour and chemical/engineering compatibility."],
  ["Material choices","Typical classroom examples include water or graphite as moderators and boron- or cadmium-containing materials for neutron absorption in control systems. Coolants may include water or gases depending on the reactor example. Students should link each material property to the required function rather than memorising an unexplained list."]
 ],
 equations:[["elastic-collision energy transfer","Use qualitative mechanics model",""],["thermal energy transfer","Coolant removes energy from core","J"]],
 evidence:["Moderator = slows neutrons.","Control rods = absorb neutrons.","Coolant = transfers thermal energy.","Material-choice questions require property → function reasoning."],
 exam:["Do not say control rods slow neutrons; they primarily absorb them.","Do not say coolant controls the chain reaction; its main role is heat transfer.","For material questions name a useful property and explicitly connect it to the component's job."]
},
{
 title:"Nuclear power safety, fuel and waste",
 summary:"This lesson brings nuclear physics into safety and decision-making. Students should know the specified safety features, how radioactive waste is managed conceptually, and how to evaluate benefits and risks using physics evidence.",
 sections:[
  ["Fuel","A thermal fission reactor uses fissile nuclear fuel; uranium fuel containing uranium-235 is a standard A-level example. Fission products and some fuel-related materials are radioactive, so containment and radiation protection are important."],
  ["Remote handling and shielding","Remote handling increases distance between workers and radioactive material and avoids direct contact. Shielding attenuates radiation before it reaches people or the environment. These controls reduce exposure but do not change the decay constant or half-life of the radioactive material."],
  ["Emergency shutdown","A shutdown system must rapidly reduce sustained neutron multiplication, for example by increasing neutron absorption. The examinable idea is the physics purpose of stopping/reducing the chain reaction, not detailed engineering design."],
  ["Radioactive waste","Waste is produced during reactor operation and fuel use. It can contain radionuclides with different radiation types, activities and half-lives. Handling and storage must keep radioactive material contained while its activity changes with time."],
  ["Half-life and waste","A long half-life means slow fractional decay, but it does not by itself tell you the activity; activity also depends on λ and the number of nuclei. Waste questions may ask about how storage timescale and activity are related."],
  ["Risk-benefit evaluation","Benefits can include large energy release from small amounts of fuel, reliable generation and low operational carbon emissions. Challenges include radioactive waste, engineering cost and low-probability/high-consequence accident scenarios. A strong answer uses physics evidence, separates probability from consequence and reaches a justified conclusion."]
 ],
 equations:[["A = λN","Relates activity to decay constant and number of nuclei","Bq"],["A = A₀e^(−λt)","Activity change during storage","Bq"],["T½ = ln2/λ","Waste timescale link","time"]],
 evidence:["Know fuel, remote handling, shielding, shutdown and waste as separate specification points.","Use decay mathematics for waste-timescale questions.","Evaluate with evidence and a justified conclusion."],
 exam:["Shielding reduces radiation transmission; it does not change source half-life.","Long half-life does not automatically mean high activity.","Evaluation marks come from explained evidence and judgement, not an unlinked pros/cons list."]
},
{
 title:"A* synoptic mastery",
 summary:"The final lesson should make students able to select and combine nuclear models under unfamiliar conditions. It revises the whole topic through model choice, multi-stage calculations, evidence interpretation and high-quality extended writing.",
 sections:[
  ["Choose the model first","Closest approach uses Coulomb energy. Electron diffraction uses matter waves. Radioactive decay uses probability and exponential mathematics. Binding/reaction energy uses mass-energy. Reactor behaviour uses neutron balance and collision ideas. Identify which physical model answers the question before choosing equations."],
  ["Plan multi-stage calculations","Write the chain before substituting values. Typical chains include mass → moles → nuclei → activity; half-life → decay constant → exponential decay; mass difference → energy → binding energy per nucleon. This exposes unit conversions and prevents equation-hopping."],
  ["Analyse evidence","Describe what the graph/data show before explaining why. Quantify gradients, ratios or proportionality where possible. Then connect the evidence to the relevant physical model and state any important limitations or assumptions."],
  ["Write explanations","Use a cause → physics principle/equation → effect chain. Precise terms such as 'background-corrected count rate', 'binding energy per nucleon' or 'constant probability per unit time' usually earn more credit than vague descriptions."],
  ["Evaluate","An evaluation should use evidence on more than one side, identify relevant limitations or risks, and finish with a conclusion that follows from the evidence. Do not use a memorised conclusion that ignores the question context."],
  ["Connect the topic","Scattering and diffraction give evidence about nuclear structure and size; radioactive decay connects microscopic randomness to macroscopic statistics; nuclear energy levels explain gamma emission; mass-energy explains binding, fusion and fission; neutron physics links nuclear events to power generation and safety."]
 ],
 equations:[["A = λN; A=A₀e^(−λt); T½=ln2/λ","Radioactive decay family",""],["R = r₀A^(1/3); ρ=m/V","Nuclear size/density family",""],["ΔE=Δmc²; 1u=931.5MeV","Mass-energy family",""],["ΔE=hf; λ=h/p","Quantum/nuclear probing family",""],["E_k = k(2e)(Ze)/r","Closest approach family",""]],
 evidence:["Explain why a model is appropriate before using it.","Use graph gradients/intercepts and uncertainty where supplied.","State assumptions explicitly in unfamiliar contexts."],
 exam:["Check units, significant figures and whether the result is physically plausible.","Use exact nuclear vocabulary throughout extended answers.","After calculating, add interpretation if the command word requires explanation or evaluation."]
}
];
function index(){try{return window.NuclearCourse?.lessonIndex()||0}catch{return 0}}
function render(){
 const root=$("#interactiveLessonWorkspace");if(!root)return;
 const learn=$('[data-il-panel="learn"]',root);if(!learn)return;
 const i=index(),d=R[i];if(!d)return;
 let box=$("#completeLessonNotes",learn);
 if(box&&box.dataset.lesson===String(i))return;
 if(box)box.remove();
 box=document.createElement("section");box.id="completeLessonNotes";box.className="cln";box.dataset.lesson=String(i);
 box.innerHTML='<details open><summary><div><span class="eyebrow">Complete lesson reference</span><strong>'+esc(d.title)+'</strong></div><span>Open / close full notes</span></summary><div class="cln-body">'+
 '<p class="cln-summary">'+esc(d.summary)+'</p>'+
 '<div class="cln-sections">'+d.sections.map((x,n)=>'<article><span class="cln-num">'+(n+1)+'</span><div><h4>'+esc(x[0])+'</h4><p>'+esc(x[1])+'</p></div></article>').join("")+'</div>'+
 '<div class="cln-grid"><article><h4>Equations, symbols and units</h4>'+d.equations.map(x=>'<div class="cln-eq"><code>'+esc(x[0])+'</code><span>'+esc(x[1])+'</span><small>'+esc(x[2])+'</small></div>').join("")+'</article>'+
 '<article><h4>Graphs / evidence / practical thinking</h4><ul>'+d.evidence.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><h4>Exam language and traps</h4><ul>'+d.exam.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></article></div>'+
 '<div class="cln-check"><strong>Lesson completeness check</strong><p>Before leaving the lesson, you should be able to explain each numbered section above without copying it, use the listed equations with correct units, and answer the lesson exam questions.</p></div>'+
 '</div></details>';
 const depth=$("#lessonDepthPanel",learn);
 if(depth)depth.insertAdjacentElement("afterend",box);else learn.appendChild(box);
}
let timer;
function schedule(){clearTimeout(timer);timer=setTimeout(render,60)}
document.addEventListener("click",e=>{if(e.target.closest("[data-il-tab='learn'],#ilNext,#ilPrev,[data-lesson],#seqNext,#seqPrevious"))schedule()},true);
const obs=new MutationObserver(()=>schedule());
setTimeout(()=>{const r=$("#seqRoot");if(r)obs.observe(r,{childList:true,subtree:true});schedule()},250);
window.NuclearCompleteNotes=R;
})();