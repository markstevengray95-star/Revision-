(() => {
"use strict";
const ROOT_ID="interactiveLessonWorkspace", STORE="aqaNuclearInteractiveV1";
const VALID_TABS=new Set(["starter","learn","example","practice","reinforce","simulation","exam","exit"]);
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const safe=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
let state={};try{state=JSON.parse(localStorage.getItem(STORE)||"{}")}catch{}
const save=()=>localStorage.setItem(STORE,JSON.stringify(state));

const P=[
{title:"Nuclei, isotopes and notation",intro:"Start with the language of nuclear physics. Every later calculation depends on being able to read A, Z and N correctly.",
learn:[
["What is in a nucleus?","A nucleus contains protons and neutrons, collectively called nucleons. Proton number <b>Z</b> fixes the element. Neutron number is <b>N</b>. Nucleon number is <b>A = Z + N</b>. The surrounding electrons do not contribute to A.","A identifies the total number of nucleons; Z identifies the element.","A = Z + N"],
["Nuclide notation","Nuclides are written with nucleon number A and proton number Z beside the chemical symbol. Isotopes have the same Z but different N, so they are the same element but have different nuclear masses.","Same Z means same element; different N means different isotope."],
["Nuclear scale","Typical atomic dimensions are about 10⁻¹⁰ m, while nuclear dimensions are about 10⁻¹⁵ m. The nucleus is therefore tiny compared with the atom, even though it contains nearly all the atomic mass.","Do not draw atomic and nuclear sizes to scale on the same ordinary diagram."]
],vocab:[["nucleon","A proton or neutron."],["proton number Z","Number of protons."],["neutron number N","Number of neutrons."],["nucleon number A","Total protons + neutrons."],["isotope","Same Z, different N."]],
worked:{q:"A nucleus has A = 60 and Z = 27. Find N.",steps:["Use A = Z + N.","Rearrange: N = A − Z.","N = 60 − 27 = 33."],answer:"The nucleus contains 33 neutrons."},
practice:[["Which pair are isotopes of the same element?",["Same A, different Z","Same Z, different A","Different Z and different A"],1,"Isotopes have the same proton number Z but different neutron number, so A differs."],["A nucleus has Z=14 and N=16. What is A?",["2","14","30"],2,"A = Z + N = 14 + 16 = 30."]],
short:["Explain why changing neutron number does not change which element the atom is.","Element identity is fixed by proton number Z. Changing neutron number makes a different isotope, not a different element."],
sim:["Use the nuclear-radius model to compare a light and heavy nucleus. Focus on the scale of the nucleus, not an atom-sized picture.",["I changed A and observed radius.","I noted that nuclear sizes are measured in femtometres.","I can state the difference between atomic and nuclear scales."]],
exit:[["Which quantity fixes the chemical element?",["A","Z","N"],1,"Z is the proton number."],["If A=23 and Z=11, N is…",["12","34","11"],0,"N=A−Z=12."],["An isotope change involves…",["changing Z only","changing N while Z stays the same","removing all electrons"],1,"Isotopes share Z but differ in N."]]},
{title:"Rutherford scattering",intro:"Use experimental observations to understand why the nuclear model replaced the plum-pudding model.",
learn:[
["The observations","Most alpha particles passed through thin foil with little or no deflection. Some were deflected by small angles. A very small fraction were deflected through large angles or back toward the source.","A strong scientific answer separates observation from inference."],
["What the observations imply","Mostly straight-through paths imply that most of the atom is empty space. Rare large deflections require a very strong repulsive field concentrated in a tiny region, so positive charge and most mass are concentrated in a small nucleus.","Large-angle scattering is the strongest evidence for a compact positive nucleus."],
["Why alpha particles deflect","An alpha particle and the nucleus are both positively charged, so the interaction is repulsive. A smaller impact parameter means the alpha passes closer, experiences a stronger electric force and is deflected more. Higher kinetic energy makes a given encounter produce less deflection.","Alpha particles are repelled, not attracted, by the positive nucleus."]
],vocab:[["alpha particle","A helium nucleus with charge +2e."],["impact parameter","Offset of the incoming path from a head-on collision."],["scattering","Change in direction caused by interaction."],["inference","A conclusion drawn from observations."]],
worked:{q:"Explain the rare backward-scattering events.",steps:["Identify the observation: very few alpha particles change direction dramatically.","A large momentum change requires a large force acting for a short time.","A strong repulsive electric field must therefore be concentrated in a very small positively charged region."],answer:"The events show that positive charge and most mass are concentrated in a tiny nucleus."},
practice:[["Most alpha particles pass straight through because…",["the atom is mostly empty space","alpha particles have no charge","the nucleus is negative"],0,"Most atomic volume contains no concentrated matter or charge."],["Closer approach generally causes…",["less deflection","more deflection","no change"],1,"Coulomb repulsion is stronger at smaller separation."]],
short:["Write a three-link chain from observation to conclusion for large-angle scattering.","A small number of alpha particles are deflected through large angles → they experience a very strong repulsive force → positive charge and most mass must be concentrated in a very small nucleus."],
sim:["Use the Rutherford model. Predict first, then vary impact parameter and alpha energy one at a time.",["I tested a closer and a more distant pass.","I tested lower and higher alpha energy.","I explained each change using electrostatic repulsion."]],
exit:[["The strongest evidence for a tiny nucleus is…",["most pass straight","rare large-angle scattering","the foil is metal"],1,"Large deflections require a concentrated field."],["The alpha–nucleus interaction is…",["gravitational attraction","electrostatic repulsion","magnetic attraction"],1,"Both are positively charged."],["Increasing alpha energy usually makes a given deflection…",["larger","smaller","exactly 90°"],1,"A faster particle is less strongly turned by the same interaction."]]},
{title:"Alpha, beta and gamma",intro:"Learn the properties, experimental identification and applications of the three main types of nuclear radiation.",
learn:[
["Properties","Alpha is a helium nucleus: charge +2e, relatively massive, strongly ionising and weakly penetrating. Beta-minus is a fast electron: charge −e, much smaller mass and intermediate penetration/ionisation. Gamma is electromagnetic radiation: no charge, no rest mass, weakly ionising per interaction and highly penetrating.","Penetration and ionisation are related to how radiation interacts with matter."],
["Identification by absorption","Alpha is stopped by a very small amount of material or a short range in air. Beta penetrates further but can be substantially absorbed by thin metal. Gamma is attenuated gradually; it does not have one exact stopping thickness.","Say gamma is attenuated, not completely stopped by a universal thickness."],
["Applications and risk","Penetration makes beta and gamma useful in thickness monitoring. Ionising radiation also has medical uses, but risk depends on activity, exposure time, distance, shielding and whether the source is inside or outside the body.","Hazard is contextual: radiation type alone is not a complete risk assessment."]
],vocab:[["ionisation","Removal/addition of electrons, creating ions."],["penetration","Ability to pass through matter."],["attenuation","Reduction in intensity through matter."],["activity","Number of decays per second."]],
worked:{q:"An unknown source is stopped by a thin sheet of metal but not paper. Identify the likely radiation.",steps:["Alpha would be stopped very easily, so surviving paper argues against alpha.","Gamma would usually be reduced gradually rather than stopped by a thin sheet.","Beta has intermediate penetration and is the best match."],answer:"The radiation is most likely beta."},
practice:[["Which is generally most ionising?",["alpha","beta","gamma"],0,"Alpha deposits energy strongly over a short range."],["Which statement about gamma is best?",["It is uncharged electromagnetic radiation","It is a helium nucleus","It always stops at the same thickness"],0,"Gamma photons are electromagnetic and are attenuated probabilistically."]],
short:["Explain why internal alpha exposure can be serious even though alpha has low penetration.","Inside the body, alpha radiation is already close to tissue. Its strong ionising ability means it can deposit substantial energy over a very short range."],
sim:["Compare alpha, beta and gamma in the absorption simulation. Change only absorber thickness after selecting each radiation.",["I compared all three radiation types.","I distinguished stopping from attenuation.","I linked the pattern to ionisation/penetration."]],
exit:[["Alpha has charge…",["+2e","−e","0"],0,"Alpha is a helium nucleus."],["Gamma is…",["an electron","electromagnetic radiation","a neutron"],1,"Gamma is a photon."],["The best wording for gamma through shielding is…",["always stopped completely","attenuated","converted to alpha"],1,"Gamma intensity falls progressively."]]},
{title:"Inverse square, background and Required Practical 12",intro:"Learn the physics and data analysis of AQA Required Practical 12 using the app's virtual investigation.",
learn:[
["Inverse-square law","For an approximately point-like gamma source, intensity or corrected count rate follows I ∝ 1/r². Doubling distance gives about one quarter of the intensity; tripling gives about one ninth.","The law is geometric spreading, not radioactive decay.","I₂ = I₁(r₁/r₂)²"],
["Background radiation","A detector records radiation even without the intended source. Background can come from cosmic rays, naturally occurring radioactive materials and the environment. Estimate a background count rate and subtract it from measured count rate before testing the law.","Corrected count rate = measured count rate − background count rate."],
["Testing the relationship","A strong test is to compare corrected count rate with 1/r². A graph of corrected count rate against 1/r² should be approximately linear and pass close to the origin within uncertainty. Random counting fluctuations produce scatter.","Longer counts and repeats reduce relative random uncertainty."],
["Model limits","At very small separations, finite source/detector size and geometry can make the point-source approximation less accurate. The app uses a virtual source; real ionising-radiation work must follow approved school procedures and supervision.","This lesson stays virtual: focus on data handling and physics."]
],vocab:[["count rate","Counts detected per unit time."],["background","Radiation detected without the intended source."],["inverse square","Quantity proportional to 1/r²."],["random uncertainty","Scatter caused by unpredictable counting fluctuations."]],
worked:{q:"A corrected count rate is 480 s⁻¹ at 0.20 m. Predict it at 0.40 m.",steps:["The distance doubles.","Inverse square means intensity is divided by 2² = 4.","480/4 = 120 s⁻¹."],answer:"Predicted corrected count rate = 120 s⁻¹."},
practice:[["If distance triples, intensity becomes…",["1/3","1/6","1/9"],2,"Inverse square gives 1/3² = 1/9."],["A measured rate is 82 s⁻¹ and background is 12 s⁻¹. Corrected rate is…",["70","82","94"],0,"Subtract background: 82−12=70 s⁻¹."]],
short:["Why should background be subtracted before applying the inverse-square law?","The detector includes counts not produced by the intended source. Subtracting background isolates the source contribution so the relationship with distance can be tested correctly."],
sim:["Use Required Practical 12 in the app. Take several virtual readings, measure background, inspect the corrected data and graph corrected count rate against 1/r².",["I measured virtual background.","I collected readings at several distances.","I used corrected count rate.","I interpreted the corrected-rate vs 1/r² graph."]],
exit:[["At twice the distance an ideal intensity is…",["half","quarter","double"],1,"1/2²=1/4."],["Background correction requires…",["adding background","subtracting background","squaring background"],1,"Remove the background contribution."],["The most useful linear test plots corrected rate against…",["r","r²","1/r²"],2,"I ∝ 1/r²."]]},
{title:"Radiation applications, hazards and medicine",intro:"Use radiation properties to explain applications and evaluate benefits versus risks.",
learn:[
["Thickness monitoring","A detector on the far side of a sheet can measure transmitted radiation. If material gets thicker, more radiation is absorbed and detector count rate falls. The chosen radiation must have suitable penetration for the material being monitored.","A useful source must be neither absorbed completely nor transmitted almost unchanged."],
["Exposure and hazard","Risk depends on how much ionising energy is deposited in tissue. Relevant factors include radiation type, activity, exposure duration, distance, shielding and whether radioactive material is internal or external.","Do not rank danger from radiation type alone."],
["Medicine","Ionising radiation can provide diagnostic information or destroy unwanted tissue. A good evaluation links the physical property that makes the radiation useful to the associated biological risk, then weighs benefit against exposure.","AQA evaluation answers need physics evidence, not a generic pros/cons list."]
],vocab:[["diagnosis","Using measurements/images to identify a condition."],["therapy","Treatment intended to change/destroy tissue."],["dose","Energy deposition measure related to exposure."],["risk–benefit","Comparison of likely benefit with potential harm."]],
worked:{q:"Why is gamma useful for imaging from outside the body?",steps:["The radiation must leave the body to reach an external detector.","Gamma is highly penetrating compared with alpha and beta.","Its penetration makes external detection practical, while ionisation means exposure still carries risk."],answer:"Gamma combines useful penetration with detectability, but exposure must be justified by diagnostic benefit."},
practice:[["A thickness gauge needs radiation that…",["is always fully absorbed","changes transmitted count rate as thickness changes","cannot reach a detector"],1,"The detector needs a measurable response to thickness."],["A good medical evaluation should…",["only list benefits","only list hazards","link physical properties to both benefit and risk"],2,"Evaluation requires relevant evidence on both sides."]],
short:["Why is 'gamma is always the most dangerous' an incomplete statement?","Risk depends on exposure context: activity, time, distance, shielding, energy and whether the source is internal or external. Radiation type alone does not determine total risk."],
sim:["Use the absorption simulation to compare which radiation could sensibly monitor different sheet thicknesses.",["I linked penetration to thickness measurement.","I considered what happens if radiation is too weakly/strongly penetrating.","I wrote a risk–benefit statement using physics."]],
exit:[["For thickness monitoring, detector count rate usually falls when thickness…",["falls","rises","stays fixed"],1,"More material causes more attenuation."],["Radiation risk depends on…",["type only","exposure context and deposited ionising energy","colour of the source"],1,"Context matters."],["A balanced medical answer includes…",["benefit only","risk only","benefit and risk linked to physics"],2,"That is evaluation."]]},
{title:"Random decay, activity and decay constant",intro:"Build the probabilistic model of radioactive decay and connect it to activity.",
learn:[
["Random but predictable","You cannot predict which individual unstable nucleus will decay next or exactly when. For a given nuclide, each undecayed nucleus has a constant probability of decay per unit time. A large population therefore follows a predictable statistical trend.","A nucleus does not 'age' toward decay."],
["Activity","Activity A is the decay rate: number of nuclear decays per second. Its unit is the becquerel, Bq, where 1 Bq = 1 decay s⁻¹. If N undecayed nuclei are present and λ is the decay constant, A = λN.","More undecayed nuclei gives greater activity for the same λ.","A = λN"],
["Decay constant","λ is the probability rate for decay and has unit s⁻¹ (or another inverse-time unit if time is expressed consistently). Large λ means a faster-decaying nuclide and shorter half-life.","λ is a property of the nuclide in the model."]
],vocab:[["activity A","Decay rate."],["becquerel Bq","One decay per second."],["decay constant λ","Probability rate of decay."],["random decay","Individual event time cannot be predicted."]],
worked:{q:"A sample has N = 2.0×10¹² nuclei and λ = 4.0×10⁻⁶ s⁻¹. Find A.",steps:["Use A = λN.","Substitute: A = (4.0×10⁻⁶)(2.0×10¹²).","A = 8.0×10⁶ s⁻¹ = 8.0×10⁶ Bq."],answer:"Activity = 8.0 MBq."},
practice:[["1 Bq means…",["1 J per second","1 decay per second","1 nucleus"],1,"Becquerel is a rate of decay."],["For a fixed nuclide, doubling N makes A…",["halve","double","unchanged"],1,"A=λN."]],
short:["How can decay be random and yet produce a smooth decay curve for a large sample?","Individual events are unpredictable, but the constant decay probability applied to a very large number of independent nuclei gives a statistically predictable average behaviour."],
sim:["Run the random-decay model and compare individual nuclei with the smooth population curve.",["I saw random individual events.","I compared them with exponential population behaviour.","I linked activity to the number remaining."]],
exit:[["λ has dimensions of…",["time","inverse time","energy"],1,"It is a probability rate."],["A equals…",["N/λ","λN","λ/N"],1,"A=λN."],["An undecayed nucleus becomes more likely to decay just because it is old…",["true","false","only after one half-life"],1,"Constant probability per unit time means no ageing effect."]]},
{title:"Exponential decay, half-life and graphs",intro:"Move from the probabilistic model to equations and graphical analysis.",
learn:[
["Exponential law","If λ is constant, the number remaining follows N = N₀e⁻ˡᵗ. Since A = λN, activity follows the same form: A = A₀e⁻ˡᵗ. Exponential decay never reaches exactly zero in the ideal mathematical model.","Keep λ and t in compatible units.","N = N₀e^(−λt) ; A = A₀e^(−λt)"],
["Half-life","Half-life T½ is the time for N or A to fall to half its value. The relationship is T½ = ln2/λ. A short half-life corresponds to a large decay constant.","After n half-lives, expected fraction remaining is (1/2)ⁿ.","T½ = ln2 / λ"],
["Graphs and applications","On an ordinary decay curve, identify times for halving. For a log graph, ln A = ln A₀ − λt, so a plot of ln A against t is a straight line with gradient −λ. The same decay model underpins applications such as radioactive dating and decisions about how activity changes during radioactive-waste storage.","A negative log-graph gradient gives λ from its magnitude; dating and storage applications use the same exponential time model."]
],vocab:[["half-life","Time for N or A to halve."],["exponential","Rate of change proportional to amount remaining."],["log graph","Transformation that can linearise exponential data."],["gradient","Change in y divided by change in x."]],
worked:{q:"A nuclide has half-life 12 h. Find λ in h⁻¹.",steps:["Use T½ = ln2/λ.","Rearrange λ = ln2/T½.","λ = 0.693/12 = 0.0578 h⁻¹."],answer:"λ ≈ 5.78×10⁻² h⁻¹."},
practice:[["After three half-lives, fraction remaining is…",["1/3","1/6","1/8"],2,"(1/2)³=1/8."],["Gradient of ln A vs t is…",["+λ","−λ","T½"],1,"ln A = ln A₀ − λt."]],
short:["Why is a log graph useful for exponential decay data?","Taking natural logs gives ln A = ln A₀ − λt, a straight-line equation. The gradient can therefore be used to determine −λ."],
sim:["Adjust half-life and elapsed time in the decay simulation. Compare the visual population with the equation prediction.",["I tested one, two and three half-lives.","I linked T½ and λ.","I can interpret a log-graph gradient."]],
exit:[["T½ equals…",["λ/ln2","ln2/λ","1/2λ"],1,"T½=ln2/λ."],["A=A₀e⁻ˡᵗ describes…",["linear growth","exponential decay","constant activity"],1,"It is exponential."],["If λ increases, T½…",["increases","decreases","stays fixed"],1,"They are inversely related."]]},
{title:"Decay calculations with moles and Avogadro constant",intro:"Combine chemistry-style mole calculations with nuclear decay equations.",
learn:[
["From mass to moles","If a sample has mass m and molar mass M, amount n = m/M, provided units are consistent (for example g and g mol⁻¹).","Molar mass links macroscopic sample mass to amount of substance.","n = m/M"],
["From moles to nuclei","Number of nuclei N = nN_A, where N_A ≈ 6.02×10²³ mol⁻¹. For a pure isotope sample, each atom contributes one nucleus of that isotope.","Check whether the question gives a pure isotope or a fraction/mixture.","N = nN_A"],
["Complete chain","A common exam route is m → n → N → A using A = λN. If half-life is given, find λ = ln2/T½ first. If time has elapsed, apply exponential decay before or after calculating activity as appropriate.","Write each link separately to reduce calculator mistakes."]
],vocab:[["molar mass M","Mass of one mole."],["amount n","Number of moles."],["Avogadro constant N_A","Particles per mole."],["pure isotope","Sample consisting of one isotope."]],
worked:{q:"A pure 60 g mol⁻¹ isotope sample has mass 0.120 g. Find the number of nuclei.",steps:["n = m/M = 0.120/60 = 2.00×10⁻³ mol.","N = nN_A.","N = (2.00×10⁻³)(6.02×10²³) = 1.20×10²¹ nuclei."],answer:"N ≈ 1.20×10²¹ nuclei."},
practice:[["The route from sample mass to number of nuclei is…",["m→n→N","m→λ→Z","m→A→Z"],0,"Use moles then Avogadro constant."],["0.5 mol contains approximately…",["3.01×10²³ particles","6.02×10²³ particles","1 particle"],0,"Half a mole contains half Avogadro's number."]],
short:["Outline how to find activity when given sample mass, molar mass and half-life.","Find n=m/M, then N=nN_A. Find λ=ln2/T½, making time units consistent. Finally use A=λN."],
sim:["Use the Formula Coach tools for number of nuclei and sample activity. Try one set of values, then change only sample mass.",["I converted mass to moles.","I used Avogadro constant.","I combined λ and N to obtain activity."]],
exit:[["N equals…",["n/N_A","nN_A","M/m"],1,"N=nN_A."],["If sample mass doubles for the same pure isotope, N…",["halves","doubles","unchanged"],1,"n and N are proportional to mass."],["A from a sample can be found from…",["λN","λ/N","N−λ"],0,"A=λN."]]},
{title:"Nuclear instability and decay equations",intro:"Use the N–Z picture to predict how unstable nuclei move toward greater stability.",
learn:[
["Stability graph","Stable nuclei occupy a band on a graph of neutron number N against proton number Z. Light stable nuclei have N roughly comparable with Z, while heavier stable nuclei tend to require proportionally more neutrons.","The graph is evidence-based, not a simple universal N=Z rule."],
["Alpha decay","An alpha particle contains two protons and two neutrons. Alpha decay therefore changes A by −4 and Z by −2; N also falls by 2.","Balance both nucleon number and charge in every nuclear equation."],
["Beta processes","In beta-minus, a neutron changes to a proton, so A stays constant and Z increases by 1. In beta-plus, a proton changes to a neutron, so A stays constant and Z decreases by 1. Electron capture also converts a proton to a neutron, so A stays constant and Z decreases by 1.","Beta processes move along constant A."],
["Gamma","Gamma emission changes the energy state of a nucleus but does not change A, Z or N.","Do not move the nuclide on an N–Z graph for pure gamma emission."]
],vocab:[["stable band","Region containing stable nuclides."],["alpha decay","Emission of 2p+2n nucleus."],["beta-minus","n → p transformation with beta emission."],["beta-plus","p → n transformation with positron emission."],["electron capture","Nucleus captures an inner electron, converting p → n."]],
worked:{q:"A nucleus undergoes beta-minus decay. What happens to A, Z and N?",steps:["A neutron becomes a proton.","Total nucleons do not change, so A is unchanged.","Protons increase by 1: Z+1. Neutrons decrease by 1: N−1."],answer:"A unchanged; Z increases by 1; N decreases by 1."},
practice:[["Alpha decay changes Z by…",["+2","−2","−4"],1,"Two protons leave the nucleus."],["Electron capture changes A and Z by…",["A unchanged, Z−1","A−4, Z−2","A unchanged, Z+1"],0,"A proton becomes a neutron."]],
short:["Explain why gamma emission does not move a nucleus on an N–Z stability graph.","Gamma emission changes only the nuclear energy state. The numbers of protons and neutrons stay the same, so both N and Z are unchanged."],
sim:["Use the N–Z stability simulation and apply each decay mode in turn. Predict the direction before applying it.",["I tested alpha.","I tested beta-minus.","I tested beta-plus/electron capture.","I confirmed gamma leaves N and Z unchanged."]],
exit:[["β− causes Z to…",["increase by 1","decrease by 1","decrease by 2"],0,"n→p."],["β+ causes Z to…",["increase by 1","decrease by 1","stay fixed"],1,"p→n."],["γ changes A by…",["−4","+1","0"],2,"No nucleons are emitted."]]},
{title:"Excited nuclei and gamma energy levels",intro:"Learn how nuclear excited states produce gamma photons and how to read energy-level diagrams.",
learn:[
["Nuclear excited states","A nucleus can exist in discrete excited energy states above its ground state. When it moves to a lower nuclear energy state, it can emit a gamma photon.","The transition is within the nucleus, not an electron-shell transition."],
["Photon energy","The gamma photon energy equals the difference between the nuclear energy levels: ΔE = hf. Convert MeV or keV to joules if using h in SI units.","A and Z are unchanged in the gamma transition.","ΔE = hf"],
["Energy-level diagrams","Horizontal lines represent allowed nuclear energy states. A downward transition arrow corresponds to photon emission. The arrow's vertical energy difference gives photon energy.","Multiple possible transitions can produce different gamma energies."],
["Technetium-99m","AQA uses metastable technetium-99m as an example of a gamma source in medical diagnosis. The important physics is that a metastable excited nucleus can emit gamma radiation that can be detected outside the body.","Focus on nuclear energy states and detectability, not clinical procedure."]
],vocab:[["ground state","Lowest nuclear energy state."],["excited state","Higher nuclear energy state."],["metastable","Excited state with a relatively longer lifetime."],["photon","Quantum of electromagnetic radiation."]],
worked:{q:"A nuclear transition releases 0.140 MeV. Find the photon frequency.",steps:["Convert 0.140 MeV to joules: 0.140×10⁶×1.60×10⁻¹⁹ J.","Use f = ΔE/h.","Substitution gives a frequency of order 10¹⁹ Hz."],answer:"Use ΔE=hf; the gamma frequency is about 3.4×10¹⁹ Hz."},
practice:[["During gamma emission, Z…",["increases","decreases","does not change"],2,"No proton/neutron transformation occurs."],["Photon energy equals…",["sum of level energies","difference between level energies","nucleon number"],1,"ΔE is the level spacing."]],
short:["Distinguish a nuclear gamma transition from an atomic electron transition.","A gamma transition is between nuclear energy states and involves the nucleus. Atomic transitions are between electron energy levels. Nuclear energy spacings are generally much larger."],
sim:["Use the nuclear energy-level simulation. Choose different upper/lower levels and relate the spacing to gamma energy.",["I changed the upper/lower level.","I calculated/compared ΔE.","I confirmed A and Z remain unchanged."]],
exit:[["ΔE equals…",["hf","h/f","f/h"],0,"Photon energy is hf."],["A gamma photon changes nuclear A by…",["4","1","0"],2,"Composition does not change."],["A larger level spacing gives photon frequency…",["smaller","larger","unchanged"],1,"f=ΔE/h."]]},
{title:"Alpha closest approach",intro:"Use energy conservation and Coulomb potential energy to estimate nuclear-scale distances.",
learn:[
["Head-on model","For a head-on alpha particle approaching a positive nucleus, electrostatic repulsion slows the alpha. In the ideal model, at closest approach its instantaneous kinetic energy is zero.","This is an estimate based on a simplified head-on encounter."],
["Energy conservation","Set initial alpha kinetic energy equal to the increase in electrostatic potential energy: E_k = kQ₁Q₂/r. For an alpha Q₁=+2e and target nucleus Q₂=+Ze.","Keep both charge factors.","E_k = (1/4πε₀)(2Ze²/r)"],
["Interpreting the result","A higher alpha kinetic energy gives a smaller closest-approach distance. A larger nuclear charge Z gives stronger repulsion and therefore a larger closest-approach distance for the same alpha energy.","The result estimates how close the alpha can reach; connect it carefully to nuclear size evidence."]
],vocab:[["closest approach","Minimum separation in a scattering encounter."],["Coulomb potential","Electrostatic potential energy between charges."],["head-on","Impact parameter approximately zero."],["femtometre","10⁻¹⁵ m."]],
worked:{q:"What happens to closest-approach distance if alpha kinetic energy doubles, with Z fixed?",steps:["r is inversely proportional to E_k in the head-on equation.","Doubling E_k multiplies the denominator by 2.","Therefore r halves."],answer:"Closest-approach distance halves."},
practice:[["For fixed Z, larger alpha energy gives r…",["larger","smaller","unchanged"],1,"r∝1/E_k."],["Target nuclear charge in the equation is…",["Ze","2Ze","e/Z"],0,"The target has charge +Ze; the alpha supplies the separate +2e factor."]],
short:["State two assumptions behind the simple closest-approach estimate.","The encounter is treated as head-on, energy losses other than electrostatic energy transfer are neglected, and the charges are modelled using Coulomb interaction."],
sim:["Use the closest-approach simulation. Change Z and alpha kinetic energy separately.",["I tested higher alpha energy.","I tested higher target Z.","I explained the trend using Coulomb energy."]],
exit:[["The alpha charge is…",["+e","+2e","0"],1,"Alpha contains two protons."],["At closest approach in the ideal head-on model, alpha kinetic energy is…",["maximum","zero instantaneously","unchanged"],1,"It has converted into electrostatic potential energy."],["r is inversely proportional to…",["alpha kinetic energy","nuclear charge","both? energy only in denominator while Z is numerator"],0,"For fixed Z, r∝1/E."]]},
{title:"Electron diffraction and nuclear radius",intro:"Use wave behaviour of high-energy electrons to measure nuclear dimensions.",
learn:[
["Why electrons can probe nuclei","A particle has de Broglie wavelength λ = h/p. High-momentum electrons can have wavelengths comparable with nuclear dimensions, so they can diffract from nuclei and reveal size information.","To resolve a small object, wavelength must be sufficiently small."],
["Diffraction pattern","The measured intensity varies with scattering angle, producing maxima and minima. The angular position of diffraction features depends on the ratio of wavelength to nuclear size.","For fixed wavelength, a larger nucleus gives narrower angular diffraction features."],
["Finding radius","Exam questions may supply a diffraction relationship or data. Use the location of a minimum together with the supplied model to estimate radius. AQA expects familiarity with intensity-against-angle graphs for nuclear electron diffraction.","Do not confuse wave diffraction with classical Rutherford scattering."]
],vocab:[["de Broglie wavelength","λ=h/p."],["diffraction","Wave spreading/interference caused by finite-size structure."],["minimum","Angle where intensity falls strongly."],["resolution","Ability to distinguish small-scale structure."]],
worked:{q:"For the same electron wavelength, nucleus B has its first diffraction minimum at a smaller angle than nucleus A. Which is larger?",steps:["Angular diffraction scale is roughly inversely related to object size for fixed wavelength.","Smaller minimum angle means narrower pattern.","Therefore B has the larger radius."],answer:"Nucleus B is larger."},
practice:[["To probe a nucleus, electron wavelength should be…",["much larger than atomic size","comparable with nuclear scale","infinite"],1,"Resolution requires sufficiently short wavelength."],["A larger nucleus gives the first minimum at generally…",["smaller angle","larger angle","same angle"],0,"Larger object → narrower angular pattern."]],
short:["Why can electron diffraction measure nuclear size?","Electrons have wave behaviour. At high momentum their de Broglie wavelength can be comparable with nuclear dimensions, so the diffraction pattern depends on the size of the nucleus."],
sim:["Use the electron-diffraction model. Keep wavelength fixed and change radius; then keep radius fixed and change wavelength.",["I observed the first-minimum shift with R.","I observed the effect of wavelength.","I distinguished diffraction from Rutherford scattering."]],
exit:[["Electron matter wavelength is…",["h/p","p/h","hc"],0,"de Broglie relation."],["Larger R at fixed λ makes angular features…",["narrower","wider","identical"],0,"Diffraction angle scale falls with size."],["Electron diffraction evidence is evidence for…",["nuclear size","electron charge only","half-life"],0,"Pattern encodes nuclear dimensions."]]},
{title:"Radius law and nuclear density",intro:"Learn the experimental radius relationship and why it implies nearly constant nuclear density.",
learn:[
["Radius law","Experimental nuclear radii follow R = r₀A^(1/3), where r₀ is about 1.2 fm in the simple model. Radius grows slowly because A is under a cube root.","If A increases by 8, R increases by 2.","R = r₀A^(1/3)"],
["Volume and A","For a roughly spherical nucleus, V = 4πR³/3. Since R³ ∝ A, nuclear volume is proportional to A.","This is the crucial link to constant density.","V = 4πR³/3"],
["Density","Nuclear mass is approximately Au, so mass ∝ A. Since both mass and volume are proportional to A, density ρ = m/V is approximately constant across nuclei.","Nuclear density is enormously larger than ordinary material density but approximately similar between nuclei."]
],vocab:[["r₀","Proportionality constant in nuclear radius law."],["nuclear density","Mass per nuclear volume."],["sphere model","Approximation V=4πR³/3."],["atomic mass unit u","Convenient nuclear mass unit."]],
worked:{q:"If A changes from 20 to 160, by what factor does R change?",steps:["A increases by factor 160/20 = 8.","R ∝ A^(1/3).","Cube root of 8 is 2."],answer:"Radius doubles."},
practice:[["R is proportional to…",["A","A²","A^(1/3)"],2,"Radius follows the cube-root law."],["Why is nuclear density nearly constant?",["mass and volume both ∝ A","radius is constant","all nuclei have same A"],0,"Their ratio is approximately independent of A."]],
short:["Derive the constant-density conclusion from R=r₀A^(1/3).","Cube the radius relationship: R³∝A. Spherical volume V∝R³, so V∝A. Nuclear mass is approximately proportional to A, therefore ρ=m/V is approximately constant."],
sim:["Use the nuclear radius simulation. Compare A and 8A where possible, then inspect the density implication.",["I confirmed cube-root scaling.","I connected R³ with volume.","I explained why density is approximately constant."]],
exit:[["A×8 makes R…",["×2","×4","×8"],0,"Cube root of 8 is 2."],["Nuclear volume is approximately proportional to…",["A","A^(1/3)","1/A"],0,"V∝R³∝A."],["Density is mass divided by…",["radius","volume","A only"],1,"ρ=m/V."]]},
{title:"Mass defect and binding energy",intro:"Connect nuclear mass differences to the energy required to separate a nucleus into nucleons.",
learn:[
["Mass defect","The mass of a bound nucleus is less than the total mass of the separated protons and neutrons that form it. The difference is the mass defect Δm.","Mass is not missing; the bound system has lower total energy."],
["Binding energy","Binding energy is the energy required to separate the nucleus completely into free nucleons. It corresponds to the mass defect through ΔE = Δmc².","A more strongly bound system has lower total mass-energy.","ΔE = Δmc²"],
["Atomic mass unit","1 u corresponds to 931.5 MeV of energy. This lets you convert a mass defect measured in u directly to energy in MeV without going through kilograms and joules.","1 u ↔ 931.5 MeV"],
["Binding energy per nucleon","Average binding energy per nucleon = total binding energy/A. It is useful for comparing how tightly nucleons are bound in nuclei of different sizes.","Do not confuse total binding energy with average binding energy per nucleon."]
],vocab:[["mass defect","Separated-nucleon mass minus bound-nucleus mass."],["binding energy","Energy required to fully separate nucleus."],["MeV","Mega-electronvolt, convenient nuclear energy unit."],["BE per nucleon","Total binding energy divided by A."]],
worked:{q:"A mass defect is 0.020 u. Find the binding energy.",steps:["Use 1 u = 931.5 MeV.","E = 0.020 × 931.5 MeV.","E = 18.63 MeV."],answer:"Binding energy ≈ 18.6 MeV."},
practice:[["A bound nucleus has mass that is…",["greater than separated nucleons","less than separated nucleons","always zero"],1,"Binding lowers system energy and mass."],["0.010 u corresponds to about…",["9.315 MeV","93.15 MeV","9315 MeV"],0,"Multiply by 931.5 MeV/u."]],
short:["Why is it misleading to say binding energy is 'energy stored in individual nucleons'?","Binding energy describes the energy difference between the bound nuclear system and separated nucleons. It is a property of the whole bound system and its interactions."],
sim:["Use the mass-defect simulation and formula coach. Change mass defect and A separately.",["I converted u to MeV.","I calculated total binding energy.","I distinguished total BE from BE per nucleon."]],
exit:[["Mass defect converts to energy using…",["F=ma","ΔE=Δmc²","V=IR"],1,"Mass-energy equivalence."],["1 u corresponds to…",["931.5 eV","931.5 MeV","9.315 J"],1,"Standard nuclear conversion."],["BE per nucleon equals…",["BE×A","BE/A","A/BE"],1,"Average per nucleon."]]},
{title:"Binding-energy curve, fusion and fission",intro:"Use the binding-energy-per-nucleon curve to understand why both fusion and fission can release energy.",
learn:[
["Shape of the curve","Average binding energy per nucleon rises rapidly for light nuclei, reaches a broad maximum around medium-mass nuclei, then falls gradually for very heavy nuclei.","Moving toward greater BE per nucleon generally corresponds to a more tightly bound final system."],
["Fusion","Light nuclei can combine to form a heavier nucleus with greater binding energy per nucleon. The increase in total binding corresponds to a decrease in total rest mass, so energy is released.","Fusion releases energy when products are more tightly bound overall."],
["Fission","A very heavy nucleus can split into medium-mass products with greater binding energy per nucleon. Again, increased total binding corresponds to lower final rest mass and released energy.","The curve explains the direction of energy release; exact reaction energy needs mass data."],
["Reaction energy","Use supplied nuclear/atomic masses consistently: Q = (initial mass − final mass)c². A positive Q corresponds to released energy in the simple bookkeeping convention.","Check whether electron masses cancel when using atomic masses; follow the data supplied in the question."]
],vocab:[["fusion","Joining light nuclei."],["fission","Splitting a heavy nucleus."],["Q value","Net reaction energy from mass difference."],["BE curve","Average binding energy per nucleon vs A."]],
worked:{q:"Why can both fusion and fission release energy?",steps:["Fusion of light nuclei moves products upward toward greater BE per nucleon.","Fission of heavy nuclei also moves products toward greater BE per nucleon.","In each case the products are more tightly bound and have lower total rest mass, so energy is released."],answer:"Both processes can move nuclei toward more tightly bound configurations."},
practice:[["Fusion releases energy when products have…",["lower BE per nucleon","higher BE per nucleon","no nucleons"],1,"They become more tightly bound."],["Exact reaction energy is found from…",["mass difference","nuclear colour","only A"],0,"Use Δmc²."]],
short:["What can the BE-per-nucleon curve tell you, and what usually requires detailed mass data?","The curve shows which mass regions tend to release energy by fusion or fission and compares average binding. Exact reaction energies for specific isotopes normally require their masses."],
sim:["Explore the binding-energy curve. Move A from light to medium to heavy regions and identify fusion/fission directions.",["I identified the high-BE region.","I explained fusion direction.","I explained fission direction.","I linked released energy to mass loss."]],
exit:[["Heavy-nucleus fission tends to move products toward…",["higher BE per nucleon","lower BE per nucleon","zero BE"],0,"Medium products are generally more tightly bound."],["Light-nucleus fusion can release energy because…",["products are more tightly bound","charge vanishes","nucleons vanish"],0,"Binding increases."],["Reaction energy comes from…",["Δmc²","A/Z","λN only"],0,"Mass-energy difference."]]},
{title:"Induced fission, chain reactions and criticality",intro:"Understand how neutron-induced fission can become a self-sustaining chain reaction at a qualitative A-level depth.",
learn:[
["Induced fission","A suitable heavy nucleus can absorb a neutron and become unstable, then split into smaller nuclei while releasing energy and additional neutrons.","The key exam idea is neutron-induced fission followed by further available neutrons."],
["Chain reaction","Some emitted neutrons can cause further fissions. A chain reaction depends on the balance between neutrons produced and neutrons lost by escape or absorption without fission.","Think generation by generation, not as a single event."],
["Qualitative criticality","A self-sustaining chain requires enough neutrons from one generation to produce the next. If too many escape or are absorbed elsewhere, the chain dies away. Geometry and amount of fissile material affect neutron escape, giving rise to the concept of critical mass.","Keep this qualitative: AQA does not require reactor-specific criticality calculations."],
["Energy transfer","Energy released appears mainly as kinetic energy of fission products and other radiation, eventually becoming thermal energy through interactions with surrounding material.","Nuclear energy becomes useful heat through energy transfer."]
],vocab:[["induced fission","Fission initiated by neutron absorption."],["chain reaction","Sequence where neutrons trigger further fissions."],["critical mass","Qualitative minimum condition for self-sustaining chain in a given system."],["neutron loss","Escape/absorption without producing another fission."]],
worked:{q:"Why can a smaller lump fail to sustain a chain reaction more easily?",steps:["Neutrons are produced throughout the material.","A larger surface-area-to-volume ratio gives more opportunity for neutrons to escape relative to the amount of material.","If too many neutrons escape, too few remain to trigger the next generation."],answer:"Greater relative neutron escape can prevent the chain from sustaining itself."},
practice:[["A chain reaction needs…",["neutrons from one generation to cause later fissions","gamma photons only","no neutron production"],0,"Neutrons link fission generations."],["Criticality is mainly a balance of…",["neutron production and losses","electron charge and mass","temperature only"],0,"Generation balance is central."]],
short:["Explain critical mass qualitatively without quoting a number.","A system must be large/arranged enough that neutron production from fission can balance neutron losses by escape and non-fission absorption. Below that condition the chain reaction dies away."],
sim:["Use the conceptual chain-reaction simulation. Compare decreasing, steady and increasing neutron-generation behaviour.",["I identified a dying chain.","I identified an approximately steady chain.","I explained growth/decline through neutron balance."]],
exit:[["Fission can be induced by…",["thermal neutron absorption","visible light only","removing electrons"],0,"AQA focuses on thermal-neutron-induced fission."],["If losses exceed useful neutron production, chain reaction…",["grows","dies away","is unchanged"],1,"Each generation shrinks."],["Critical mass is linked to…",["sustaining neutron balance","gamma wavelength only","electron shells"],0,"It is a qualitative neutron-balance condition."]]},
{title:"Thermal reactors: moderator, control rods and coolant",intro:"Separate the different physical jobs performed inside a thermal nuclear reactor.",
learn:[
["Thermal neutrons","For some fissile nuclei, slower (thermal) neutrons are more effective at inducing fission. Fresh fission neutrons are fast, so a moderator is used to reduce their kinetic energy through collisions.","Moderation means slowing, not absorbing."],
["Moderator","A good moderator transfers kinetic energy efficiently in collisions while absorbing relatively few neutrons. Simple elastic-collision models explain why nuclei with masses not vastly larger than a neutron can be effective.","AQA expects the mechanical collision model qualitatively."],
["Control rods","Control rods absorb neutrons, changing how many remain available for further fission. In an operating reactor their role is neutron population control, distinct from moderation.","Do not say control rods slow neutrons."],
["Coolant","Coolant transfers thermal energy away from the reactor core to a system where useful energy can be extracted. Its main job is heat transfer, not direct control of the chain reaction.","Separate neutron physics from thermal energy transfer."],
["Material choice","Material selection considers neutron absorption, collision effectiveness, thermal properties, chemical stability and engineering suitability. Typical A-level examples include water or graphite as moderators, boron- or cadmium-containing control materials because they absorb neutrons, and water or gas as coolants because they can transfer thermal energy.","Know the role, a suitable example and why its properties fit that role; detailed reactor designs are not required."]
],vocab:[["moderator","Slows neutrons."],["control rod","Absorbs neutrons."],["coolant","Transfers thermal energy."],["thermal neutron","Slow neutron with energy comparable to thermal motion."]],
worked:{q:"A student says 'the coolant slows neutrons and controls the chain reaction'. Correct the statement.",steps:["Moderator is the component whose neutron-collision role is to slow fast neutrons.","Control rods absorb neutrons to influence neutron population.","Coolant removes/transfers thermal energy from the core."],answer:"The three systems have distinct roles: moderator slows, control rods absorb, coolant transfers heat."},
practice:[["Moderator mainly…",["slows neutrons","absorbs all neutrons","transfers electricity"],0,"Its role is moderation."],["Control rods mainly…",["slow neutrons","absorb neutrons","increase neutron speed"],1,"They regulate neutron availability by absorption."]],
short:["Why is a simple collision model useful for understanding moderation?","It shows how kinetic energy can be transferred from a neutron to a moderator nucleus during collisions, reducing neutron speed. It also helps explain why relative masses affect transfer efficiency."],
sim:["Use the moderation and reactor-system models. Keep the roles of moderator, control and coolant separate in your explanation.",["I modelled neutron slowing.","I identified neutron absorption by control rods.","I identified heat transfer by coolant.","I can discuss material-choice factors."]],
exit:[["Moderator function is…",["slow","absorb for control","cool directly"],0,"Slow neutrons."],["Coolant function is…",["heat transfer","nuclear stability","beta decay"],0,"It moves thermal energy."],["Control rods primarily…",["absorb neutrons","create neutrons","change proton number"],0,"Neutron absorption changes chain balance."]]},
{title:"Nuclear power safety, fuel and waste",intro:"Use nuclear physics to explain safety systems and make balanced evidence-based evaluations of nuclear power.",
learn:[
["Fuel and radiation","Thermal reactors use fissile nuclear fuel; at A-level, uranium fuel containing a fissile isotope such as uranium-235 is a standard example. The fuel and many fission products are radioactive, so safety focuses on limiting unnecessary exposure and containing radioactive material.","Know the fuel example and connect the hazard to ionising radiation, activity, shielding and containment rather than memorising reactor engineering details."],
["Shielding and remote handling","Shielding reduces radiation reaching workers/the environment; remote handling increases separation from radioactive material. These are applications of attenuation and distance principles.","This is conceptual safety physics, not an instruction for handling sources."],
["Emergency shutdown","A reactor needs systems capable of rapidly reducing the fission chain when required by increasing neutron absorption and stopping sustained neutron multiplication.","Describe the physics purpose rather than reactor-specific engineering detail."],
["Radioactive waste","Radioactive waste is produced during reactor operation and fuel use. It must be contained, remotely handled where appropriate, and stored so radioactive material remains isolated while its activity changes with time. Waste may contain radionuclides with a wide range of half-lives and activities.","Long half-life does not automatically mean high activity; activity also depends on number of nuclei and λ."],
["Evaluation","Balanced nuclear-power evaluation can include low operational carbon emissions, reliable energy output, high energy density, accident consequences, radioactive waste and economic/engineering factors. Physics answers should distinguish probability of harm from severity of consequence.","Make a justified conclusion tied to evidence, not a slogan."]
],vocab:[["shielding","Material used to reduce radiation transmission."],["remote handling","Increasing separation between people and radioactive material."],["shutdown","Rapid reduction of sustained chain reaction."],["radioactive waste","Material requiring management because of radionuclide content."]],
worked:{q:"Why does half-life matter when planning radioactive-waste storage?",steps:["Activity changes with time according to radioactive decay.","Half-life determines the timescale of that change.","Different radionuclides can therefore remain significant for very different durations."],answer:"Half-life helps determine how long activity persists and therefore informs long-term management."},
practice:[["Shielding mainly aims to…",["reduce transmitted radiation","increase activity","change half-life"],0,"Shielding attenuates radiation."],["Remote handling helps mainly by…",["increasing distance/separation","making nuclei stable instantly","raising activity"],0,"Distance reduces exposure and avoids direct contact."]],
short:["Write a balanced physics-based evaluation sentence about nuclear power.","Example: Nuclear fission can provide large, reliable energy output with low operational carbon emissions, but radioactive waste and low-probability high-consequence accidents require long-term engineered controls, so its value depends on how these risks are managed relative to alternatives."],
sim:["Use the reactor-system model and identify which parts relate to normal control, heat transfer and protection.",["I identified shielding purpose.","I explained shutdown in neutron-balance terms.","I linked waste to activity and half-life.","I wrote a balanced evaluation."]],
exit:[["Shielding changes source half-life…",["yes","no","only for gamma"],1,"It reduces transmission, not nuclear decay constant."],["Waste timescale is strongly related to…",["half-life","electron colour","foil thickness only"],0,"Half-life sets decay timescale."],["A strong evaluation should…",["separate probability and consequence","list one benefit only","avoid physics"],0,"Risk evaluation needs evidence."]]},
{title:"A* synoptic mastery",intro:"Combine the entire topic: evidence, probability, mathematical modelling, nuclear size, mass–energy and reactor physics.",
learn:[
["Choose the model","Before calculating, identify which model applies: Coulomb interaction for closest approach, wave diffraction for nuclear radius, exponential probability for decay, mass–energy for binding/reactions, or neutron balance for fission systems.","A* answers do not mix assumptions from unrelated models."],
["Build multi-stage calculations","Write a chain of equations before substituting. Examples: mass→moles→nuclei→activity; half-life→λ→exponential decay; mass difference→energy→binding per nucleon.","State units and convert only where needed."],
["Analyse unfamiliar data","Look for proportional relationships, gradients, intercepts, uncertainty, scatter and whether data support the proposed model. Separate what the data show from what you infer.","Use quantitative evidence when available."],
["Write high-level explanations","A strong explanation uses cause → principle/equation → effect, with precise vocabulary. An evaluation adds evidence, limitations and a justified judgement tied to the question context.","Avoid vague phrases like 'because it is more powerful'."],
["Specification synthesis","The whole topic links experimental evidence for nuclear structure, random radioactive behaviour, nuclear-energy states, radius measurements, mass–energy changes, fission chains and societal decisions about nuclear power.","You should now be able to move between microscopic nuclear models and macroscopic measurements."]
],vocab:[["model","Simplified representation with assumptions."],["assumption","Condition under which a model is applied."],["synoptic","Combining ideas from different parts of the course."],["evaluation","Evidence-based judgement including limitations."]],
worked:{q:"A problem gives sample mass, half-life and elapsed time, then asks for current activity. Plan the solution before calculating.",steps:["Convert sample mass to moles and then initial number N₀ using N_A.","Find λ = ln2/T½ with consistent time units.","Find N = N₀e⁻ˡᵗ or A = A₀e⁻ˡᵗ.","Use A = λN and report units in Bq."],answer:"Plan the equation chain first; each stage feeds the next."},
practice:[["Which is the best first step in an unfamiliar problem?",["guess a formula","identify the physical model and known quantities","round all numbers"],1,"Model selection controls the method."],["A high-quality evaluation should include…",["evidence, limitations and justified conclusion","only advantages","only equations with no context"],0,"Evaluation is reasoned judgement."]],
short:["Explain how nuclear physics combines evidence and models across the topic.","Scattering and diffraction provide experimental evidence for nuclear structure and size; radioactive decay uses probability and exponential models; energy levels explain gamma emission; mass-energy explains binding and reaction energy; neutron-balance models explain fission systems. Each model has its own assumptions and evidence."],
sim:["Choose any two simulations from different specification sections. State the assumptions of each and explain what evidence/readout would test the model.",["I selected two different models.","I stated assumptions for each.","I linked predictions to evidence/readouts.","I completed a synoptic written explanation."]],
exit:[["Best synoptic habit is to…",["identify model before calculation","combine every equation at once","ignore assumptions"],0,"Select the relevant model first."],["Data analysis should distinguish…",["observation from inference","mass from all energy","nothing"],0,"Evidence and interpretation are different."],["An A* explanation usually contains…",["precise linked reasoning","keywords only","unsupported opinion"],0,"Cause → physics → effect is stronger."]]}

];

const EXAM=[
[
 {marks:3,q:"A nuclide has nucleon number 37 and proton number 17. State the neutron number and explain what would have to remain unchanged for another nuclide to be an isotope of the same element.",points:["N = 20","Proton number Z must remain 17","An isotope may have a different neutron/nucleon number"]},
 {marks:4,q:"Explain why the nucleus contains almost all the mass of an atom even though its radius is much smaller than the radius of the atom.",points:["Protons and neutrons are in the nucleus","Electrons have much smaller mass than nucleons","Most atomic volume is the electron region/empty space","Nuclear dimensions are about 10⁻¹⁵ m compared with atomic dimensions about 10⁻¹⁰ m"]}
],
[
 {marks:3,q:"State two observations from Rutherford scattering and give one conclusion about atomic structure.",points:["Most alpha particles passed through with little/no deflection","A very small fraction were scattered through large angles/backwards","Positive charge and most mass are concentrated in a tiny nucleus"]},
 {marks:5,q:"Explain why rare large-angle alpha scattering could not be explained by a diffuse positive charge model.",points:["Alpha particles are positively charged","They are repelled by positive charge","A large deflection requires a large force/momentum change","A large force must act over a very small region","Therefore positive charge is highly concentrated in a small nucleus"]}
],
[
 {marks:3,q:"Compare alpha, beta-minus and gamma radiation in terms of charge and penetration.",points:["Alpha has charge +2e and low penetration","Beta-minus has charge −e and intermediate penetration","Gamma has no charge and is highly penetrating"]},
 {marks:4,q:"A source passes through paper but is strongly reduced by a thin metal sheet. Explain how an absorption experiment can identify the radiation and why gamma cannot be said to have one exact stopping thickness.",points:["Surviving paper argues against alpha","Strong reduction by thin metal is consistent with beta","Gamma is attenuated probabilistically","Gamma intensity decreases progressively rather than stopping at one universal thickness"]}
],
[
 {marks:3,q:"A corrected count rate is 360 s⁻¹ at 0.25 m. Calculate the expected corrected count rate at 0.50 m for an ideal point source.",points:["Distance doubles","Inverse square gives factor 1/4","Expected corrected count rate = 90 s⁻¹"]},
 {marks:5,q:"Describe how virtual data from Required Practical 12 should be processed to test the inverse-square law.",points:["Measure/estimate background count rate","Subtract background from measured count rate","Use several distances","Calculate 1/r² for each distance","Plot corrected count rate against 1/r² and look for an approximately straight line through/near the origin"]}
],
[
 {marks:3,q:"Explain why the most suitable radiation for a thickness gauge must have an appropriate penetration rather than simply the greatest penetration.",points:["Detector count must change when thickness changes","If absorbed too strongly little/no radiation reaches detector","If too penetrating count changes too little with thickness"]},
 {marks:5,q:"Evaluate the use of ionising radiation in medicine using physics rather than a simple list of advantages and disadvantages.",points:["Identify a useful property such as penetration/detectability or ionisation","Link the property to diagnosis or treatment","Recognise ionising radiation can damage biological tissue","Risk depends on exposure factors such as activity/time/distance/shielding/internal exposure","Make a justified risk–benefit conclusion"]}
],
[
 {marks:3,q:"A sample contains 4.0×10¹¹ undecayed nuclei and has decay constant 2.5×10⁻⁵ s⁻¹. Calculate its activity.",points:["Use A = λN","Substitute correct values","A = 1.0×10⁷ Bq"]},
 {marks:4,q:"Explain how radioactive decay can be random for individual nuclei but predictable for a large sample.",points:["Cannot predict which nucleus decays next","Each nucleus has a constant probability per unit time","Many independent nuclei are present","Statistical average follows a predictable exponential trend"]}
],
[
 {marks:3,q:"A nuclide has half-life 18 min. Calculate its decay constant in min⁻¹.",points:["Use λ = ln2/T½","λ = 0.693/18","λ ≈ 3.85×10⁻² min⁻¹"]},
 {marks:5,q:"Explain how a graph of ln(activity) against time can be used to determine half-life.",points:["Use ln A = ln A₀ − λt","Graph is linear","Gradient = −λ","Find magnitude of gradient to obtain λ","Use T½ = ln2/λ"]}
],
[
 {marks:4,q:"A pure isotope has sample mass 0.240 g and molar mass 120 g mol⁻¹. Calculate the number of nuclei.",points:["n = m/M","n = 0.240/120 = 2.00×10⁻³ mol","N = nN_A","N ≈ 1.20×10²¹ nuclei"]},
 {marks:5,q:"Outline the full method for calculating the activity of a pure radioactive sample when mass, molar mass and half-life are supplied.",points:["Convert mass to moles using n=m/M","Convert moles to nuclei using N=nN_A","Convert half-life to decay constant using λ=ln2/T½","Keep time units consistent","Use A=λN"]}
],
[
 {marks:4,q:"State the changes in A and Z for alpha decay and beta-minus decay.",points:["Alpha: A decreases by 4","Alpha: Z decreases by 2","Beta-minus: A unchanged","Beta-minus: Z increases by 1"]},
 {marks:5,q:"Explain how an N–Z stability graph can be used to discuss alpha, beta-minus, beta-plus/electron-capture and gamma decay.",points:["Stable nuclides occupy a band","Alpha changes N and Z by −2 each","Beta-minus gives N−1, Z+1","Beta-plus/electron capture gives N+1, Z−1","Gamma leaves N and Z unchanged"]}
],
[
 {marks:3,q:"A nuclear transition has energy 0.140 MeV. State the equation used to find the gamma frequency and explain what happens to A and Z.",points:["Use ΔE = hf","A is unchanged","Z is unchanged"]},
 {marks:4,q:"Explain what a nuclear energy-level diagram shows and why technetium-99m can be useful as a gamma source in diagnosis.",points:["Lines represent discrete nuclear energy states","Downward transition can emit a gamma photon","Photon energy equals level spacing","Gamma can leave the body and be detected externally"]}
],
[
 {marks:4,q:"For a head-on alpha particle, explain the energy argument used to estimate closest approach to a nucleus.",points:["Alpha and nucleus repel electrostatically","Alpha kinetic energy falls as electrostatic potential energy rises","At ideal closest approach instantaneous kinetic energy is zero","Set initial kinetic energy equal to k(2e)(Ze)/r"]},
 {marks:4,q:"Predict and explain the effect on closest-approach distance of increasing alpha kinetic energy while keeping target Z fixed.",points:["Closest-approach distance decreases","More initial kinetic energy is available","Alpha can move further into the repulsive electric potential","From r ∝ 1/E for fixed Z"]}
],
[
 {marks:4,q:"Explain why high-energy electrons can be used to determine nuclear radius.",points:["Electrons have de Broglie wavelength λ=h/p","High momentum gives a very short wavelength","Wavelength can be comparable with nuclear dimensions","Diffraction/scattering pattern depends on nuclear size"]},
 {marks:4,q:"For fixed electron wavelength, a second nucleus has its first diffraction minimum at a smaller angle. Explain what this indicates.",points:["Smaller diffraction angle means narrower pattern","Angular scale is inversely related to scattering-object size","Second nucleus has larger radius","Conclusion assumes wavelength is unchanged"]}
],
[
 {marks:3,q:"A nucleus has A=64. Another has A=8 times larger. Use R=r₀A^(1/3) to state the factor by which radius changes.",points:["A changes by factor 8","Cube root of 8 is 2","Radius changes by factor 2"]},
 {marks:5,q:"Show why R=r₀A^(1/3) provides evidence that nuclear density is approximately constant.",points:["Cube relationship to obtain R³ ∝ A","Nuclear volume V ∝ R³","Therefore V ∝ A","Nuclear mass is approximately proportional to A","ρ=m/V is therefore approximately independent of A"]}
],
[
 {marks:3,q:"A nucleus has mass defect 0.025 u. Calculate its binding energy in MeV.",points:["Use 1 u = 931.5 MeV","0.025×931.5","Binding energy ≈ 23.3 MeV"]},
 {marks:5,q:"Explain the physical meaning of mass defect and binding energy.",points:["Bound nucleus has less mass than separated nucleons","Mass defect is the difference","Binding energy is energy required to separate nucleus completely","Energy difference obeys ΔE=Δmc²","Lower mass-energy corresponds to a bound system"]}
],
[
 {marks:4,q:"Explain, using the binding-energy-per-nucleon curve, why fusion of light nuclei can release energy.",points:["Light nuclei are on rising part of curve","Fusion products can have greater BE per nucleon","Products are more tightly bound","Increase in binding corresponds to lower rest mass/energy release"]},
 {marks:4,q:"Explain why heavy-nucleus fission can release energy and state what is needed for an exact reaction-energy calculation.",points:["Medium-mass products can have greater BE per nucleon","Products are more tightly bound","Mass decreases and energy is released","Exact energy needs initial/final nuclear or atomic mass data used consistently"]}
],
[
 {marks:4,q:"Explain qualitatively what determines whether an induced-fission chain reaction dies away or sustains itself.",points:["Fission releases additional neutrons","Some neutrons can induce later fissions","Neutrons are also lost by escape/other absorption","Sustained chain requires production to balance or exceed losses"]},
 {marks:4,q:"Explain the idea of critical mass without using a numerical value.",points:["Relates to whether a chain can sustain itself","Amount/geometry affects neutron escape","Too much neutron loss makes chain die away","Critical condition is where useful neutron production can balance losses"]}
],
[
 {marks:5,q:"State the functions of moderator, control rods and coolant, and give one factor affecting material choice for any one component.",points:["Moderator slows neutrons","Control rods absorb neutrons","Coolant transfers thermal energy","Material choice may depend on neutron absorption, collision effectiveness, thermal or chemical properties","Correct factor linked to relevant component"]},
 {marks:4,q:"Use a simple collision model to explain why moderator-nucleus mass matters.",points:["Neutron loses kinetic energy in collisions","Energy is transferred to moderator nucleus","Transfer is more effective when masses are not extremely different","Moderator should also avoid excessive neutron absorption"]}
],
[
 {marks:4,q:"Explain the physics purpose of shielding, remote handling and emergency shutdown in nuclear power.",points:["Shielding attenuates radiation","Remote handling increases separation/reduces exposure","Shutdown reduces sustained neutron multiplication","These controls address different parts of the hazard"]},
 {marks:5,q:"Evaluate one benefit and two challenges of nuclear power using relevant nuclear physics.",points:["Identify a benefit such as high energy density/reliable low-operational-carbon generation","Explain radioactive waste using activity/half-life","Explain accident/exposure risk or need for engineered control","Distinguish probability from consequence where relevant","Give a justified conclusion based on the evidence"]}
],
[
 {marks:5,q:"A problem gives sample mass, molar mass, half-life and elapsed time. Write a complete equation plan for finding current activity.",points:["n=m/M","N₀=nN_A","λ=ln2/T½","N=N₀e⁻ˡᵗ or A=A₀e⁻ˡᵗ","Current activity A=λN with consistent units"]},
 {marks:6,q:"Explain how experimental evidence and mathematical models combine across nuclear physics. Refer to at least three different parts of the topic.",points:["Rutherford scattering gives evidence for a compact nucleus","Electron diffraction/closest approach gives nuclear size evidence","Random decay is modelled statistically/exponentially","Mass-energy/binding models explain nuclear energy release","Fission/reactor behaviour uses neutron balance and collision ideas","Answer distinguishes evidence, model assumptions and conclusions"]}
]
];

function currentIndex(){
 const b=$(".seq-step.active[data-lesson]"); return b?Number(b.dataset.lesson):0;
}
function S(i){
 let s=state[i];
 if(!s||typeof s!=="object")s=state[i]={};
 s.starter=(s.starter&&typeof s.starter==="object"&&!Array.isArray(s.starter))?s.starter:{};
 s.exam=(s.exam&&typeof s.exam==="object"&&!Array.isArray(s.exam))?s.exam:{};
 s.conceptChecks=(s.conceptChecks&&typeof s.conceptChecks==="object"&&!Array.isArray(s.conceptChecks))?s.conceptChecks:{};
 s.pages=(s.pages&&typeof s.pages==="object"&&!Array.isArray(s.pages))?s.pages:{};
 s.practice=(s.practice&&typeof s.practice==="object"&&!Array.isArray(s.practice))?s.practice:{};
 s.sim=(s.sim&&typeof s.sim==="object"&&!Array.isArray(s.sim))?s.sim:{};
 s.reinforce=(s.reinforce&&typeof s.reinforce==="object"&&!Array.isArray(s.reinforce))?s.reinforce:{};
 s.reinforce.vocab=(s.reinforce.vocab&&typeof s.reinforce.vocab==="object"&&!Array.isArray(s.reinforce.vocab))?s.reinforce.vocab:{};
 s.reinforce.sequence=!!s.reinforce.sequence;
 s.reinforce.explain=!!s.reinforce.explain;
 s.reinforce.answer=typeof s.reinforce.answer==="string"?s.reinforce.answer:"";
 s.worked=Number.isFinite(Number(s.worked))?Math.max(0,Number(s.worked)):0;
 s.short=!!s.short;
 s.shortAnswer=typeof s.shortAnswer==="string"?s.shortAnswer:"";
 s.simNotes=(s.simNotes&&typeof s.simNotes==="object"&&!Array.isArray(s.simNotes))?s.simNotes:{};
 s.simNotes.prediction=typeof s.simNotes.prediction==="string"?s.simNotes.prediction:"";
 s.simNotes.explanation=typeof s.simNotes.explanation==="string"?s.simNotes.explanation:"";
 s.exitBest=Number.isFinite(Number(s.exitBest))?Math.max(0,Math.min(3,Number(s.exitBest))):0;
 s.tab=VALID_TABS.has(s.tab)?s.tab:"starter";
 return s;
}
function pct(i){
 const p=P[i],s=S(i);let done=0,total=3+(p.learn.length*2)+1+p.practice.length+1+p.sim[1].length+2+p.vocab.length+2+EXAM[i].length+1;
 done+=Object.values(s.starter).filter(Boolean).length;
 done+=Object.values(s.pages).filter(Boolean).length;
 done+=Object.values(s.conceptChecks).filter(Boolean).length;
 if(s.worked>=p.worked.steps.length)done++;
 done+=Object.values(s.practice).filter(Boolean).length;
 if(s.short)done++;
 done+=Object.values(s.sim).filter(Boolean).length;
 if(s.simNotes.prediction.trim().length>=15)done++;
 if(s.simNotes.explanation.trim().length>=25)done++;
 done+=Object.values(s.reinforce.vocab).filter(Boolean).length;
 if(s.reinforce.sequence)done++;
 if(s.reinforce.explain)done++;
 done+=Object.values(s.exam).filter(v=>v&&v.completed).length;
 if(s.exitBest>=2)done++;
 return Math.round(100*done/total);
}
function inject(){
 const main=$(".seq-main"); if(!main)return;
 const i=currentIndex(); if(!P[i])return;
 const old=$("#"+ROOT_ID); if(old&&old.dataset.lesson===String(i)){updateProgress(i);return}
 if(old)old.remove();
 const p=P[i],s=S(i);const wrap=document.createElement("section");wrap.id=ROOT_ID;wrap.className="il-shell";wrap.dataset.lesson=i;
 wrap.innerHTML='<div class="il-head"><div><span class="eyebrow">Complete student lesson</span><h3>'+safe(p.title)+'</h3><p>'+p.intro+'</p></div><div class="il-progress"><strong id="ilPct">'+pct(i)+'% lesson progress</strong><div class="il-track"><i id="ilBar" style="width:'+pct(i)+'%"></i></div></div></div>'+
 '<div class="il-tabs">'+["starter","learn","example","practice","reinforce","simulation","exam","exit"].map((t,n)=>'<button class="il-tab '+(s.tab===t?"active":"")+'" data-il-tab="'+t+'">'+(n+1)+'. '+({starter:"Starter",learn:"Learn",example:"Worked example",practice:"Practice",reinforce:"Reinforce",simulation:"Simulation task",exam:"Exam questions",exit:"Exit ticket"}[t])+'</button>').join("")+'</div>'+
 '<div class="il-body"><div class="il-panel" data-il-panel="starter"></div><div class="il-panel" data-il-panel="learn"></div><div class="il-panel" data-il-panel="example"></div><div class="il-panel" data-il-panel="practice"></div><div class="il-panel" data-il-panel="reinforce"></div><div class="il-panel" data-il-panel="simulation"></div><div class="il-panel" data-il-panel="exam"></div><div class="il-panel" data-il-panel="exit"></div></div>';
 const obj=$(".seq-objectives",main); if(obj)obj.insertAdjacentElement("afterend",wrap); else main.prepend(wrap);
 wire(i);
 showTab(i,s.tab);
}
function wire(i){
 const root=$("#"+ROOT_ID);
 $$("[data-il-tab]",root).forEach(b=>b.addEventListener("click",()=>showTab(i,b.dataset.ilTab)));
 renderStarter(i);renderLearn(i);renderExample(i);renderPractice(i);renderReinforce(i);renderSimulation(i);renderExam(i);renderExit(i);
}
function showTab(i,tab){
 const root=$("#"+ROOT_ID);if(!root)return;
 const s=S(i),next=VALID_TABS.has(tab)?tab:"starter";s.tab=next;save();
 $$("[data-il-tab]",root).forEach(b=>b.classList.toggle("active",b.dataset.ilTab===next));
 $$("[data-il-panel]",root).forEach(x=>x.classList.toggle("active",x.dataset.ilPanel===next));
}

function starterQuestions(i){
 const p=P[i],prev=i>0?P[i-1]:p;
 const current=p.practice[0],prior=prev.exit[0];
 const vocab=p.vocab[0];
 const defs=[vocab[1],...p.vocab.slice(1,3).map(v=>v[1])];
 return [
  {q:current[0],opts:current[1],a:current[2],why:current[3],tag:"Current knowledge"},
  {q:i>0?"Retrieval from the previous lesson: "+prior[0]:"Foundation retrieval: "+p.exit[1][0],opts:i>0?prior[1]:p.exit[1][1],a:i>0?prior[2]:p.exit[1][2],why:i>0?prior[3]:p.exit[1][3],tag:"Previous learning"},
  {q:"Which definition best matches “"+vocab[0]+"”?",opts:defs,a:0,why:vocab[0]+": "+vocab[1],tag:"Key vocabulary"}
 ];
}
function currentObjectives(){
 return $$(".seq-objectives section:first-child li").map(li=>li.textContent.trim()).filter(Boolean);
}
function conceptCheckFor(i,page){
 const p=P[i];
 if(page<p.practice.length)return p.practice[page];
 return p.exit[page%p.exit.length];
}
function coreKnowledgeHTML(p){
 const equations=p.learn.map(x=>x[3]).filter(Boolean);
 return '<div class="il-core-map"><div><strong>Core knowledge you will build</strong><ol>'+p.learn.map(x=>'<li>'+x[0]+'</li>').join("")+'</ol></div><div><strong>Key language</strong><p>'+p.vocab.map(v=>'<span>'+v[0]+'</span>').join(" ")+'</p>'+(equations.length?'<strong>Key relationships</strong><div class="il-core-equations">'+equations.map(e=>'<code>'+e+'</code>').join("")+'</div>':'')+'</div></div>';
}
function renderStarter(i){
 const p=P[i],s=S(i),host=$('[data-il-panel="starter"]');if(!host)return;
 const qs=starterQuestions(i),objectives=currentObjectives();
 const secure=Object.values(s.starter).filter(Boolean).length;
 host.innerHTML='<div class="il-reinforce-head"><div><span class="eyebrow">Starter / retrieval · 5–8 min</span><h4>Activate prior knowledge</h4><p>Answer from memory first. A question only counts as secure when you get it correct.</p></div><span class="il-badge">'+secure+'/3 secure</span></div>'+
 '<div class="il-start-grid"><article class="il-card"><h4>Learning objectives</h4><ul>'+(objectives.length?objectives.map(x=>'<li>'+safe(x)+'</li>').join(""):'<li>Build the lesson knowledge and apply it independently.</li>')+'</ul></article><article class="il-card"><h4>Lesson roadmap</h4><p>Retrieval → core knowledge → knowledge checks → worked example → guided practice → independent practice → interactive activity → exam questions → exit ticket.</p></article></div>'+
 coreKnowledgeHTML(p)+
 qs.map((q,n)=>'<article class="il-q il-starter-q" data-sq="'+n+'"><span class="il-badge">'+q.tag+'</span><h4>'+(n+1)+'. '+q.q+'</h4><div class="il-options">'+q.opts.map((o,j)=>'<button data-so="'+j+'" '+(s.starter[n]?'disabled':'')+'>'+o+'</button>').join("")+'</div><div class="il-feedback '+(s.starter[n]?'':'hidden')+'">'+(s.starter[n]?'Secure — '+q.why:'')+'</div></article>').join("")+
 '<div class="il-actions"><button class="button primary" id="ilStarterNext" '+(secure<3?'disabled':'')+'>Start core learning →</button></div>';
 $$(".il-starter-q",host).forEach((box,n)=>$$("[data-so]",box).forEach(b=>b.onclick=()=>{
   if(s.starter[n])return;
   const q=qs[n],choice=Number(b.dataset.so),ok=choice===q.a,fb=$(".il-feedback",box);
   fb.classList.remove("hidden");
   if(ok){
     s.starter[n]=true;save();
     $$("[data-so]",box).forEach((x,j)=>{x.disabled=true;if(j===q.a)x.classList.add("correct")});
     fb.textContent="Correct — "+q.why;
     updateProgress(i);renderStarter(i);
   }else{
     b.disabled=true;b.classList.add("wrong");fb.textContent="Not yet — "+q.why+" Try another option.";
   }
 }));
 $("#ilStarterNext",host).onclick=()=>showTab(i,"learn");
}
function renderLearn(i){
 const p=P[i],s=S(i),host=$('[data-il-panel="learn"]');if(!host)return;
 let page=Number(host.dataset.page||0);page=Math.max(0,Math.min(p.learn.length-1,page));host.dataset.page=page;
 const [t,b,k,e]=p.learn[page],q=conceptCheckFor(i,page),secure=!!s.conceptChecks[page];
 host.innerHTML='<div class="il-learning-progress"><span class="il-badge">Core knowledge '+(page+1)+' / '+p.learn.length+'</span><strong>'+p.learn.filter((_,n)=>s.conceptChecks[n]).length+'/'+p.learn.length+' checks secure</strong></div>'+
 '<div class="il-lesson-intro"><article class="il-card"><h4>'+t+'</h4><p>'+b+'</p>'+(e?'<div class="il-equation">'+e+'</div>':'')+'<div class="il-key"><strong>Core point:</strong> '+k+'</div></article><aside class="il-card"><h4>Key vocabulary</h4><div class="il-vocab">'+p.vocab.map(v=>'<div><strong>'+v[0]+'</strong><span>'+v[1]+'</span></div>').join("")+'</div></aside></div>'+
 '<article class="il-q il-concept-check" data-cc="'+page+'"><span class="eyebrow">Knowledge check before you move on</span><h4>'+q[0]+'</h4><div class="il-options">'+q[1].map((o,j)=>'<button data-cco="'+j+'" '+(secure?'disabled':'')+'>'+o+'</button>').join("")+'</div><div class="il-feedback '+(secure?'':'hidden')+'">'+(secure?'Secure — '+q[3]:'')+'</div></article>'+
 '<div class="il-page-nav"><button class="button" id="ilPrev" '+(page===0?"disabled":"")+'>← Previous chunk</button><div class="il-page-dots">'+p.learn.map((_,n)=>'<span class="il-dot '+(s.conceptChecks[n]?"done ":"")+(n===page?"active":"")+'"></span>').join("")+'</div><button class="button primary" id="ilNext" '+(!secure?'disabled':'')+'>'+(page===p.learn.length-1?"Continue to worked example →":"Next knowledge chunk →")+'</button></div>';
 $$("[data-cco]",host).forEach(btn=>btn.onclick=()=>{
   if(s.conceptChecks[page])return;
   const choice=Number(btn.dataset.cco),ok=choice===q[2],box=$(".il-concept-check",host),fb=$(".il-feedback",box);
   fb.classList.remove("hidden");
   if(ok){
     s.conceptChecks[page]=true;s.pages[page]=true;save();
     $$("[data-cco]",box).forEach((x,j)=>{x.disabled=true;if(j===q[2])x.classList.add("correct")});
     fb.textContent="Correct — "+q[3];updateProgress(i);renderLearn(i);
   }else{
     btn.disabled=true;btn.classList.add("wrong");fb.textContent="Not yet — "+q[3]+" Try another answer.";
   }
 });
 $("#ilPrev",host).onclick=()=>{host.dataset.page=page-1;renderLearn(i)};
 $("#ilNext",host).onclick=()=>{if(!s.conceptChecks[page])return;if(page<p.learn.length-1){host.dataset.page=page+1;renderLearn(i)}else showTab(i,"example")};
}
function renderExample(i){
 const p=P[i],s=S(i),host=$('[data-il-panel="example"]');if(!host)return;
 host.innerHTML='<article class="il-card"><span class="eyebrow">Worked example</span><h4>'+p.worked.q+'</h4><p class="muted">Reveal one step at a time. Try each step yourself before revealing it.</p><div id="ilSteps">'+p.worked.steps.map((x,n)=>'<div class="il-example-step '+(n<s.worked?"show":"")+'"><strong>Step '+(n+1)+'</strong><div>'+x+'</div></div>').join("")+'</div><div class="il-model '+(s.worked>=p.worked.steps.length?"":"hidden")+'" id="ilAnswer"><strong>Answer:</strong> '+p.worked.answer+'</div><div class="il-actions"><button class="button primary" id="ilReveal">'+(s.worked>=p.worked.steps.length?"Example complete":"Reveal next step")+'</button><button class="button" id="ilToPractice">Go to practice →</button></div></article>';
 $("#ilReveal",host).onclick=()=>{if(s.worked<p.worked.steps.length)s.worked++;save();renderExample(i);updateProgress(i)};
 $("#ilToPractice",host).onclick=()=>showTab(i,"practice");
}
function renderPractice(i){
 const p=P[i],s=S(i),host=$('[data-il-panel="practice"]');if(!host)return;
 const secure=Object.values(s.practice).filter(Boolean).length;
 host.innerHTML='<div class="il-reinforce-head"><div><span class="eyebrow">Guided practice</span><h4>Apply the core ideas</h4><p>Use the feedback to correct mistakes before moving to independent practice.</p></div><span class="il-badge">'+secure+'/'+p.practice.length+' checks secure</span></div>'+
 '<div id="ilPracticeQs">'+p.practice.map((q,n)=>'<article class="il-q" data-pq="'+n+'"><h4>'+(n+1)+'. '+q[0]+'</h4><div class="il-options">'+q[1].map((o,j)=>'<button data-po="'+j+'" '+(s.practice[n]?'disabled':'')+'>'+o+'</button>').join("")+'</div><div class="il-feedback '+(s.practice[n]?'':'hidden')+'">'+(s.practice[n]?'Secure — '+q[3]:'')+'</div></article>').join("")+'</div>'+
 '<article class="il-card il-short"><h4>Guided short answer</h4><p>'+p.short[0]+'</p><textarea id="ilShort" placeholder="Write your answer here before checking the model response.">'+safe(s.shortAnswer)+'</textarea><div class="il-actions"><button class="button primary" id="ilModelBtn">Check against model answer</button></div><div class="il-model '+(s.short?'':'hidden')+'" id="ilShortModel"><strong>Model answer:</strong> '+p.short[1]+'<p class="muted">Edit your own answer above so it contains the key physics before moving on.</p></div></article>'+
 '<div class="il-actions"><button class="button primary" id="ilToSim" '+((secure<p.practice.length||!s.short)?'disabled':'')+'>Continue to independent practice →</button></div>';
 $$(".il-q",host).forEach((box,n)=>{
   const q=p.practice[n];$$("[data-po]",box).forEach(btn=>btn.onclick=()=>{
     if(s.practice[n])return;
     const choice=Number(btn.dataset.po),ok=choice===q[2],fb=$(".il-feedback",box);fb.classList.remove("hidden");
     if(ok){
       s.practice[n]=true;save();$$("[data-po]",box).forEach((x,j)=>{x.disabled=true;if(j===q[2])x.classList.add("correct")});
       fb.textContent="Correct — "+q[3];updateProgress(i);renderPractice(i);
     }else{
       btn.disabled=true;btn.classList.add("wrong");fb.textContent="Not yet — "+q[3]+" Try again.";
     }
   });
 });
 $("#ilShort",host).oninput=e=>{s.shortAnswer=e.target.value;save()};
 $("#ilModelBtn",host).onclick=()=>{
   s.shortAnswer=$("#ilShort",host).value;
   if(s.shortAnswer.trim().length<25){
     const box=$("#ilShortModel",host);box.classList.remove("hidden");box.innerHTML='<strong>Add more detail first.</strong><p>Write at least one complete physics explanation before checking the model response.</p>';return;
   }
   s.short=true;save();renderPractice(i);updateProgress(i);
 };
 $("#ilToSim",host).onclick=()=>showTab(i,"reinforce");
}
function shuffledIndices(n,seed){
 const arr=Array.from({length:n},(_,i)=>i);let x=(seed+1)*2654435761>>>0;
 for(let i=n-1;i>0;i--){x=(1664525*x+1013904223)>>>0;const j=x%(i+1);[arr[i],arr[j]]=[arr[j],arr[i]]}
 return arr;
}
function renderReinforce(i){
 const p=P[i],s=S(i),host=$('[data-il-panel="reinforce"]');if(!host)return;
 const seqOrder=shuffledIndices(p.worked.steps.length,i+17);
 const vocabDone=Object.values(s.reinforce.vocab).filter(Boolean).length;
 host.innerHTML=
 '<div class="il-reinforce-head"><div><span class="eyebrow">Build and strengthen</span><h4>Reinforcement tasks</h4><p>Complete these after the first practice. They move from precise vocabulary → method → explanation.</p></div><span class="il-badge">'+vocabDone+'/'+p.vocab.length+' vocabulary secure</span></div>'+
 '<article class="il-card il-reinforce-card"><div class="il-task-number">1</div><div><h4>Vocabulary retrieval</h4><p class="muted">Choose the correct definition for each key term. Your progress is saved.</p><div id="ilVocabTasks" class="il-vocab-tasks"></div></div></article>'+
 '<article class="il-card il-reinforce-card"><div class="il-task-number">2</div><div><h4>Build the method</h4><p>'+p.worked.q+'</p><p class="muted">Click the steps in the correct order. If you make a mistake, the sequence resets so you can try again.</p><div id="ilSequencePool" class="il-sequence-pool"></div><div id="ilSequenceChosen" class="il-sequence-chosen"></div><div id="ilSequenceFeedback" class="il-feedback hidden"></div></div></article>'+
 '<article class="il-card il-reinforce-card"><div class="il-task-number">3</div><div><h4>Explain it from memory</h4><p>'+p.short[0]+'</p><textarea id="ilReinforceExplain" class="il-long-answer" placeholder="Write your explanation without looking back first.">'+safe(s.reinforce.answer||"")+'</textarea><div class="il-keyword-strip"><strong>Try to use:</strong> '+p.vocab.slice(0,4).map(v=>'<span>'+v[0]+'</span>').join("")+'</div><div class="il-actions"><button class="button primary" id="ilCheckExplain">Check my explanation</button><button class="button" id="ilRevealExplain">Reveal model answer</button></div><div id="ilExplainFeedback" class="il-feedback hidden"></div><div id="ilExplainModel" class="il-model hidden"><strong>Model response:</strong> '+p.short[1]+'</div></div></article>'+
 '<div class="il-actions"><button class="button primary" id="ilReinforceNext">Continue to simulation task →</button></div>';
 renderVocabTasks(i);
 renderSequenceTask(i,seqOrder,[]);
 $("#ilReinforceExplain",host).oninput=e=>{s.reinforce.answer=e.target.value;save()};
 $("#ilCheckExplain",host).onclick=()=>checkReinforceExplain(i);
 $("#ilRevealExplain",host).onclick=()=>{s.reinforce.explain=true;save();$("#ilExplainModel",host).classList.remove("hidden");updateProgress(i)};
 $("#ilReinforceNext",host).onclick=()=>showTab(i,"simulation");
}
function renderVocabTasks(i){
 const p=P[i],s=S(i),box=$("#ilVocabTasks");if(!box)return;
 box.innerHTML=p.vocab.map((v,n)=>{
   const distract=shuffledIndices(p.vocab.length,i*31+n+5).filter(x=>x!==n).slice(0,2);
   const ids=shuffledIndices(3,i*41+n+11), defs=[n,...distract];
   return '<div class="il-vocab-q" data-vq="'+n+'"><strong>'+v[0]+'</strong><div class="il-mini-options">'+ids.map(slot=>{const idx=defs[slot];return '<button data-vdef="'+idx+'" '+(s.reinforce.vocab[n]?'disabled':'')+'>'+p.vocab[idx][1]+'</button>'}).join("")+'</div><div class="il-feedback '+(s.reinforce.vocab[n]?'':'hidden')+'">'+(s.reinforce.vocab[n]?'Secure — '+v[1]:'')+'</div></div>';
 }).join("");
 $$(".il-vocab-q",box).forEach((q,n)=>$$("[data-vdef]",q).forEach(b=>b.onclick=()=>{
   const ok=Number(b.dataset.vdef)===n,fb=$(".il-feedback",q);
   if(ok){
     s.reinforce.vocab[n]=true;save();
     $$("[data-vdef]",q).forEach(x=>{x.disabled=true;if(Number(x.dataset.vdef)===n)x.classList.add("correct")});
     fb.classList.remove("hidden");fb.textContent="Correct — "+p.vocab[n][1];updateProgress(i);
   }else{
     b.classList.add("wrong");fb.classList.remove("hidden");fb.textContent="Not quite. Use the lesson meaning, not just a familiar-sounding phrase.";
   }
 }));
}
function renderSequenceTask(i,order,chosen){
 const p=P[i],s=S(i),pool=$("#ilSequencePool"),out=$("#ilSequenceChosen"),fb=$("#ilSequenceFeedback");if(!pool||!out||!fb)return;
 pool.innerHTML=order.filter(idx=>!chosen.includes(idx)).map(idx=>'<button class="il-seq-chip" data-stepidx="'+idx+'">'+p.worked.steps[idx]+'</button>').join("");
 out.innerHTML=chosen.length?chosen.map((idx,n)=>'<div class="il-seq-picked"><span>'+(n+1)+'</span>'+p.worked.steps[idx]+'</div>').join(""):'<span class="muted">Your ordered steps will appear here.</span>';
 $$("[data-stepidx]",pool).forEach(b=>b.onclick=()=>{
   const idx=Number(b.dataset.stepidx),expected=chosen.length;
   if(idx!==expected){
     fb.classList.remove("hidden");fb.textContent="That step does not come next. Resetting the chain — decide what must happen first.";
     setTimeout(()=>renderSequenceTask(i,order,[]),500);return;
   }
   const next=[...chosen,idx];
   if(next.length===p.worked.steps.length){
     s.reinforce.sequence=true;save();fb.classList.remove("hidden");fb.textContent="Method complete. You built the reasoning in the correct order.";updateProgress(i);
   }
   renderSequenceTask(i,order,next);
 });
 if(s.reinforce.sequence){fb.classList.remove("hidden");fb.textContent="Method already secured. Rebuild it again if you want more practice."}
}
function checkReinforceExplain(i){
 const p=P[i],s=S(i),text=($("#ilReinforceExplain")?.value||"").trim(),fb=$("#ilExplainFeedback");
 s.reinforce.answer=text;save();
 const terms=p.vocab.slice(0,4).map(v=>v[0].toLowerCase()).filter(x=>x.length>1);
 const low=text.toLowerCase(),hits=terms.filter(t=>low.includes(t)).length;
 fb.classList.remove("hidden");
 if(text.length<45){fb.textContent="Develop this further. Aim for a complete cause → physics idea → effect explanation.";return}
 s.reinforce.explain=true;save();updateProgress(i);
 fb.textContent=hits>=2?"Good: your explanation uses lesson-specific vocabulary. Compare it with the model answer and improve precision.":"Your reasoning has enough detail, but strengthen it by using more of the lesson's precise vocabulary before comparing with the model answer.";
}
function renderSimulation(i){
 const p=P[i],s=S(i),host=$('[data-il-panel="simulation"]');if(!host)return;
 host.innerHTML='<div class="il-simtask"><article class="il-card"><span class="eyebrow">Predict → test → explain</span><h4>Interactive activity</h4><p>'+p.sim[0]+'</p><div class="il-predict"><label>Prediction<textarea id="ilPrediction" placeholder="What do you expect to happen and why?">'+safe(s.simNotes.prediction)+'</textarea></label><label>Explanation after testing<textarea id="ilExplanation" placeholder="What did the model show? Explain it with physics.">'+safe(s.simNotes.explanation)+'</textarea></label></div><div class="il-actions"><button class="button primary" id="ilOpenSim">Open linked simulation</button><button class="button" id="ilFormula">Open Formula Coach</button></div></article><article class="il-card"><h4>Simulation evidence checklist</h4><div class="il-checklist">'+p.sim[1].map((x,n)=>'<label class="il-check"><input type="checkbox" data-sc="'+n+'" '+(s.sim[n]?"checked":"")+'> <span>'+x+'</span></label>').join("")+'</div><p class="muted small">Make a prediction, test it, write the physics explanation, then tick the evidence you actually observed.</p></article></div><div class="il-actions"><button class="button primary" id="ilToExit" '+((Object.values(s.sim).filter(Boolean).length<p.sim[1].length||s.simNotes.prediction.trim().length<15||s.simNotes.explanation.trim().length<25)?'disabled':'')+'>Continue to exam questions →</button></div>';
 $("#ilPrediction",host).oninput=e=>{s.simNotes.prediction=e.target.value;save();updateProgress(i)};
 $("#ilExplanation",host).oninput=e=>{s.simNotes.explanation=e.target.value;save();updateProgress(i)};
 $$("[data-sc]",host).forEach(c=>c.onchange=()=>{s.sim[c.dataset.sc]=c.checked;save();updateProgress(i);renderSimulation(i)});
 $("#ilOpenSim",host).onclick=()=>{const b=$(".seq-phase [data-open-sim]");if(b)b.click();else{const full=p.title.includes("Rutherford")?$('.nav-button[data-view="rutherfordexp"]'):null;if(full)full.click();else{const lab=$('.nav-button[data-view="lab"]');if(lab)lab.click()}}};
 $("#ilFormula",host).onclick=()=>{const b=$('.nav-button[data-view="formula"]');if(b)b.click()};
 $("#ilToExit",host).onclick=()=>showTab(i,"exam");
}
function renderExam(i){
 const qs=EXAM[i],s=S(i),host=$('[data-il-panel="exam"]');if(!host)return;
 const completed=Object.values(s.exam).filter(v=>v&&v.completed).length;
 host.innerHTML='<div class="il-reinforce-head"><div><span class="eyebrow">Original AQA-style practice</span><h4>Exam questions</h4><p>Write your answer first. Then reveal the mark points and self-mark each point you genuinely included.</p></div><span class="il-badge">'+completed+'/'+qs.length+' completed</span></div>'+
 qs.map((q,n)=>'<article class="il-card il-exam-card" data-exq="'+n+'"><div class="il-exam-head"><div><span class="il-task-number">'+(n+1)+'</span><strong>'+q.marks+' marks</strong></div><span class="il-badge">'+(s.exam[n]?.completed?'Completed':'Not marked')+'</span></div><h4>'+q.q+'</h4><textarea class="il-long-answer" data-exam-answer="'+n+'" placeholder="Write a full exam answer here before opening the mark points.">'+safe(s.exam[n]?.answer||"")+'</textarea><div class="il-actions"><button class="button primary" data-reveal-ms="'+n+'">Reveal mark points</button></div><div class="il-mark-scheme '+(s.exam[n]?.revealed?'':'hidden')+'" data-ms="'+n+'"><h4>Self-mark</h4><p class="muted">Tick only points that are clearly present in your answer.</p>'+q.points.map((p,k)=>'<label class="il-check"><input type="checkbox" data-mp="'+n+'-'+k+'" '+(s.exam[n]?.points?.[k]?'checked':'')+'> <span>'+p+'</span></label>').join("")+'<div class="il-exam-score" data-score="'+n+'"></div><button class="button" data-save-exam="'+n+'">Save score</button></div></article>').join("")+
 '<div class="il-actions"><button class="button primary" id="ilExamNext">Continue to exit ticket →</button></div>';
 $$("[data-exam-answer]",host).forEach(t=>t.oninput=()=>{const n=Number(t.dataset.examAnswer);s.exam[n]=s.exam[n]||{};s.exam[n].answer=t.value;save()});
 $$("[data-reveal-ms]",host).forEach(b=>b.onclick=()=>{const n=Number(b.dataset.revealMs);s.exam[n]=s.exam[n]||{};s.exam[n].revealed=true;save();$('[data-ms="'+n+'"]',host).classList.remove("hidden")});
 $$("[data-save-exam]",host).forEach(b=>b.onclick=()=>saveExamScore(i,Number(b.dataset.saveExam)));
 qs.forEach((_,n)=>updateExamScoreDisplay(i,n));
 $("#ilExamNext",host).onclick=()=>showTab(i,"exit");
}
function saveExamScore(i,n){
 const s=S(i),q=EXAM[i][n],checks=$$('[data-mp^="'+n+'-"]'),points=checks.map(c=>c.checked);
 s.exam[n]=s.exam[n]||{};s.exam[n].points=points;s.exam[n].score=points.filter(Boolean).length;s.exam[n].completed=true;save();
 updateExamScoreDisplay(i,n);updateProgress(i);
 const card=$('[data-exq="'+n+'"]');const badge=$(".il-badge",card);if(badge)badge.textContent="Completed";
}
function updateExamScoreDisplay(i,n){
 const host=$('[data-score="'+n+'"]');if(!host)return;const s=S(i),q=EXAM[i][n],saved=s.exam[n];
 const checked=$$('[data-mp^="'+n+'-"]').filter(c=>c.checked).length;
 const score=saved?.completed?saved.score:checked;
 host.innerHTML='<strong>'+score+' / '+q.marks+' marks</strong><span>'+(score===q.marks?'Excellent — all mark points are present.':score>=Math.ceil(q.marks*.6)?'Secure. Improve precision to gain the remaining marks.':'Review the lesson and strengthen the reasoning before retrying.')+'</span>';
}
function renderExit(i){
 const p=P[i],s=S(i),host=$('[data-il-panel="exit"]');if(!host)return;
 host.innerHTML='<article class="il-card"><span class="eyebrow">Mastery gate</span><h4>Exit ticket</h4><p>Score at least 2/3. Feedback appears after you submit.</p><div id="ilExitQs">'+p.exit.map((q,n)=>'<div class="il-q" data-eq="'+n+'"><h4>'+(n+1)+'. '+q[0]+'</h4><div class="il-options">'+q[1].map((o,j)=>'<label class="il-check"><input type="radio" name="ilExit'+i+'_'+n+'" value="'+j+'"> <span>'+o+'</span></label>').join("")+'</div><div class="il-feedback hidden"></div></div>').join("")+'</div><div class="il-actions"><button class="button primary" id="ilSubmitExit">Mark exit ticket</button><button class="button" id="ilRetryExit">Clear answers</button></div><div id="ilExitResult"></div></article>';
 $("#ilSubmitExit",host).onclick=()=>markExit(i);
 $("#ilRetryExit",host).onclick=()=>renderExit(i);
 if(s.exitBest>=2)showExitResult(i,s.exitBest,true);
}
function markExit(i){
 const p=P[i],s=S(i);let score=0,complete=true;
 p.exit.forEach((q,n)=>{
   const box=$('[data-eq="'+n+'"]'),pick=$('input:checked',box),fb=$(".il-feedback",box);
   if(!pick){complete=false;fb.classList.remove("hidden");fb.textContent="Choose an answer first.";return}
   const val=Number(pick.value),ok=val===q[2];if(ok)score++;
   fb.classList.remove("hidden");fb.textContent=(ok?"Correct. ":"Review: ")+q[3];
 });
 if(!complete)return;
 s.exitBest=Math.max(s.exitBest,score);save();showExitResult(i,score,false);updateProgress(i);
 if(score>=2&&isComplete(i))syncSequenceCompletion();
}
function showExitResult(i,score,stored){
 const host=$("#ilExitResult");if(!host)return;const pass=score>=2;
 host.innerHTML='<div class="il-exit-score"><div class="il-score-ring '+(pass?"pass":"retry")+'">'+score+'/3</div><div class="il-status '+(pass?"pass":"retry")+'"><strong>'+(pass?"Exit ticket passed":"Not secure yet")+'</strong><div>'+(pass?"You have met the exit-ticket threshold. Finish any unticked lesson activities to complete the lesson.":"Review the teaching pages and retry. Your best score is saved.")+'</div></div></div>'+(pass&&isComplete(i)?'<div class="il-complete-banner"><strong>Lesson mastered.</strong> All learning, practice, simulation evidence and exit-ticket requirements are complete.</div>':'');
}
function isComplete(i){
 const p=P[i],s=S(i);return Object.values(s.starter).filter(Boolean).length>=3 && Object.values(s.pages).filter(Boolean).length>=p.learn.length && Object.values(s.conceptChecks).filter(Boolean).length>=p.learn.length && s.worked>=p.worked.steps.length && Object.values(s.practice).filter(Boolean).length>=p.practice.length && s.short && Object.values(s.reinforce.vocab).filter(Boolean).length>=p.vocab.length && s.reinforce.sequence && s.reinforce.explain && Object.values(s.sim).filter(Boolean).length>=p.sim[1].length && s.simNotes.prediction.trim().length>=15 && s.simNotes.explanation.trim().length>=25 && Object.values(s.exam).filter(v=>v&&v.completed).length>=EXAM[i].length && s.exitBest>=2;
}
function syncSequenceCompletion(){
 setTimeout(()=>{
   const dots=$$(".mastery-dot");if(dots[2]&&!dots[2].classList.contains("on"))dots[2].click();
   setTimeout(()=>{const b=$("#seqComplete");if(b&&/Mark lesson complete/i.test(b.textContent))b.click()},120);
 },80);
}
function updateProgress(i){
 const root=$("#"+ROOT_ID);if(!root)return;
 const v=pct(i), label=v+"% lesson progress", width=v+"%";
 const pctNode=$("#ilPct",root), bar=$("#ilBar",root);
 if(pctNode && pctNode.textContent!==label)pctNode.textContent=label;
 if(bar && bar.style.width!==width)bar.style.width=width;
}
function safeInject(){
 try{inject()}
 catch(err){
   console.error("Interactive lesson failed to render",err);
   const main=$(".seq-main");if(!main)return;
   const old=$("#"+ROOT_ID);if(old)old.remove();
   const box=document.createElement("section");box.id=ROOT_ID;box.className="il-shell";
   box.innerHTML='<article class="il-card"><h3>Reload lesson content</h3><p>A saved lesson state from an earlier version caused a loading problem. The lesson can repair itself without resetting the rest of the course.</p><button class="button primary" id="ilRepairReload">Repair and reload this lesson</button></article>';
   main.prepend(box);
   $("#ilRepairReload",box).onclick=()=>{state[currentIndex()]={};save();box.remove();safeInject()};
 }
}
function attachSequenceWatcher(){
 const root=$("#seqRoot");
 if(!root){setTimeout(attachSequenceWatcher,100);return}
 const observer=new MutationObserver(mutations=>{
   if(mutations.some(m=>m.type==="childList" && m.target===root)){
     requestAnimationFrame(()=>safeInject());
   }
 });
 observer.observe(root,{childList:true});
 document.addEventListener("click",e=>{
   const trigger=e.target.closest("[data-lesson],[data-mode],#seqNext,#seqPrevious,#seqComplete,#teacherComplete,[data-mastery]");
   if(trigger)setTimeout(safeInject,0);
 });
 safeInject();
}
window.NuclearCourse={
 get lessons(){return P},
 get exam(){return EXAM},
 get state(){return state},
 lessonIndex:currentIndex,
 getLessonState(i){return S(i)},
 save(){
  try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}
 },
 showTab(i,tab){
  const active=currentIndex();
  if(i===active)showTab(i,tab);
 },
 isComplete,
 progress:pct
};
setTimeout(attachSequenceWatcher,120);
})();