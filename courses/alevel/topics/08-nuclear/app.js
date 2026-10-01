(() => {
"use strict";

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const fmt = (n,d=3) => Number.isFinite(n) ? Number(n).toPrecision(d) : "—";
const e = 1.602176634e-19;
const c = 299792458;
const eps0 = 8.8541878128e-12;
const uKg = 1.66053906660e-27;
const ln2 = Math.log(2);

const lessons = [
  {
    code:"3.8.1.1", title:"Rutherford scattering", sim:"rutherford",
    lead:"Alpha-particle scattering showed that almost all atomic mass and all positive charge are concentrated in a tiny nucleus.",
    core:["Most alpha particles pass through with little or no deflection.","A small number are deflected through large angles.","Very rare backward scattering requires a concentrated positive nucleus.","The nuclear model replaced the plum-pudding model."],
    remember:"Large-angle scattering is evidence for a tiny, massive, positively charged centre — not evidence that the atom is solid.",
    mistake:"Do not say most alpha particles hit the nucleus. Most pass through because atoms are mostly empty space.",
    formulas:["Electrostatic potential energy at closest approach ≈ initial kinetic energy"]
  },
  {
    code:"3.8.1.2", title:"Alpha, beta and gamma radiation", sim:"radiation",
    lead:"The three radiations differ in charge, mass, ionising ability, penetration and behaviour in fields.",
    core:["Alpha is a helium nucleus: charge +2e and high ionising ability.","Beta radiation is a fast electron or positron from a nuclear transformation.","Gamma is an electromagnetic photon from a nuclear energy transition.","Background count rate must be allowed for when analysing measurements.","For a point-like source, gamma intensity follows an inverse-square relationship."],
    remember:"Penetrating power and ionising power are not the same thing.",
    mistake:"Gamma is not a particle with rest mass and charge; it is electromagnetic radiation.",
    formulas:["I ∝ 1/r²","corrected count rate = measured rate − background rate"]
  },
  {
    code:"3.8.1.3", title:"Radioactive decay", sim:"decay",
    lead:"Individual nuclear decays are random, but a large sample follows a predictable exponential law.",
    core:["Each undecayed nucleus has a constant probability of decay per unit time.","Decay constant λ is the probability per unit time for a nucleus.","Activity A is the rate of decay.","Half-life is the time for N or A to fall to half its value.","Exponential and log graphs can be used to determine λ and half-life."],
    remember:"Random does not mean unpredictable at sample level: large populations produce a smooth exponential trend.",
    mistake:"Half-life is not the time for every nucleus to decay.",
    formulas:["N = N₀e^(−λt)","A = λN","A = A₀e^(−λt)","T½ = ln2/λ"]
  },
  {
    code:"3.8.1.4", title:"Nuclear instability", sim:"stability",
    lead:"Stable nuclei occupy a band on an N–Z graph. Unstable nuclei can move toward greater stability through alpha, beta or electron-capture processes.",
    core:["Alpha decay reduces A by 4 and Z by 2.","Beta-minus converts a neutron to a proton, so Z increases by 1 while A is unchanged.","Beta-plus converts a proton to a neutron, so Z decreases by 1 while A is unchanged.","Electron capture also reduces Z by 1 while A is unchanged.","Gamma emission changes nuclear energy, not A or Z."],
    remember:"Track proton number Z and neutron number N separately before writing the daughter nuclide.",
    mistake:"Beta-minus emission does not remove a pre-existing orbital electron from the atom.",
    formulas:["A = N + Z","α: ΔZ = −2, ΔN = −2","β⁻: ΔZ = +1, ΔN = −1","β⁺ / EC: ΔZ = −1, ΔN = +1"]
  },
  {
    code:"3.8.1.5", title:"Nuclear radius", sim:"radius",
    lead:"Scattering and diffraction show that nuclear radius increases approximately with the cube root of nucleon number.",
    core:["Closest approach of alpha particles gives an estimate of nuclear size.","Electron diffraction provides a more direct measure of nuclear radius.","R = r₀A^(1/3) describes the observed dependence.","Because volume is proportional to R³, nuclear density is approximately constant."],
    remember:"If R ∝ A^(1/3), then volume ∝ A, so mass/volume is roughly constant.",
    mistake:"The nuclear radius is around 10⁻¹⁵ m, not the atomic radius around 10⁻¹⁰ m.",
    formulas:["R = r₀A^(1/3)","ρ = mass / ((4/3)πR³)"]
  },
  {
    code:"3.8.1.6", title:"Mass and energy", sim:"massEnergy",
    lead:"Changes in nuclear binding are accompanied by tiny mass changes and much larger energy changes through E = mc².",
    core:["A bound nucleus has less mass than its separated nucleons.","Mass defect corresponds to binding energy.","1 u corresponds to 931.5 MeV/c² in mass-energy calculations.","Binding energy per nucleon is a useful measure of nuclear stability.","Energy can be released by fusion of light nuclei and fission of heavy nuclei."],
    remember:"Use the difference between initial and final total mass; the sign tells you whether energy is released or required.",
    mistake:"Do not confuse total binding energy with binding energy per nucleon.",
    formulas:["ΔE = Δmc²","1 u → 931.5 MeV","BE per nucleon = BE/A"]
  },
  {
    code:"3.8.1.7", title:"Induced fission", sim:"fission",
    lead:"Absorption of a neutron can make a heavy nucleus split, releasing energy and additional neutrons that may continue a chain reaction.",
    core:["A thermal neutron can induce fission in a suitable heavy nucleus.","Fission products have greater binding energy per nucleon than the original heavy nucleus.","Released neutrons may cause further fissions.","A chain reaction can decrease, remain steady or increase depending on neutron balance.","In a thermal reactor, moderator, control rods and coolant have different functions."],
    remember:"The energy comes from an increase in total binding energy, corresponding to a reduction in mass.",
    mistake:"The moderator does not absorb neutrons as its main job; it slows them by collisions.",
    formulas:["energy released = (initial mass − final mass)c²"]
  },
  {
    code:"3.8.1.8", title:"Safety aspects of nuclear power", sim:"reactor",
    lead:"Nuclear power requires engineered systems for control, cooling, shielding, shutdown and management of radioactive material.",
    core:["Control systems manage the neutron population and therefore reactor power.","Cooling transfers thermal energy away from the reactor core.","Shielding reduces exposure outside controlled regions.","Shutdown systems are designed to reduce the chain reaction rapidly.","Radioactive waste requires secure handling and storage appropriate to its activity and half-life.","Benefits and risks should be evaluated using evidence."],
    remember:"A safety explanation should link each engineering feature to the specific hazard or physical process it controls.",
    mistake:"Do not describe control rods, moderator and coolant as interchangeable; each has a distinct function.",
    formulas:["Qualitative section: focus on function, risk reduction and evidence."]
  }
];

const sims = [
  {
    id:"rutherford", code:"3.8.1.1", title:"Rutherford scattering",
    subtitle:"Vary impact parameter and alpha energy to see how electrostatic repulsion changes the path.",
    controls:[
      {key:"impact",label:"Impact parameter",type:"range",min:-80,max:80,step:2,value:28,unit:" px"},
      {key:"energy",label:"Relative alpha energy",type:"range",min:2,max:9,step:.5,value:5,unit:" MeV"}
    ],
    simple:"A closer pass means a stronger repulsive force, so the alpha particle changes direction more.",
    exam:"Large-angle deflections show that positive charge and most atomic mass are concentrated in a very small nucleus. Most particles pass through because the atom is mostly empty space.",
    mistake:"Do not describe the alpha particle as being attracted to the nucleus; both are positively charged.",
    check:{q:"Which observation most strongly supports a tiny concentrated nucleus?",opts:["Most alpha particles pass straight through","A very small number scatter through very large angles","The foil is thin"],a:1}
  },
  {
    id:"radiation", code:"3.8.1.2", title:"Radiation and absorption",
    subtitle:"Compare alpha, beta and gamma behaviour through idealised absorbing layers.",
    controls:[
      {key:"radType",label:"Radiation",type:"select",value:"gamma",options:[["alpha","Alpha"],["beta","Beta"],["gamma","Gamma"]]},
      {key:"thickness",label:"Absorber thickness (relative)",type:"range",min:0,max:100,step:1,value:35,unit:" %"}
    ],
    simple:"Alpha is stopped most easily, beta penetrates further, and gamma is the most penetrating of the three.",
    exam:"Different radiations can be distinguished by their penetrating properties and ionising effects. Gamma intensity is reduced by absorption but gamma does not have a single fixed stopping thickness.",
    mistake:"Do not say a particular sheet always stops all gamma radiation; attenuation is probabilistic.",
    check:{q:"Which is generally the most ionising?",opts:["Alpha","Beta","Gamma"],a:0}
  },
  {
    id:"decay", code:"3.8.1.3", title:"Random decay and half-life",
    subtitle:"Watch a population decay and compare the random-looking nuclei with the smooth exponential prediction.",
    controls:[
      {key:"halfLife",label:"Half-life",type:"range",min:2,max:20,step:1,value:8,unit:" s"},
      {key:"decayTime",label:"Elapsed time",type:"range",min:0,max:40,step:.5,value:0,unit:" s"}
    ],
    simple:"You cannot predict which nucleus decays next, but the fraction left after many trials follows an exponential pattern.",
    exam:"Radioactive decay is random for an individual nucleus and has a constant probability per unit time. Therefore a large sample obeys N = N₀e^(−λt).",
    mistake:"A nucleus does not become more likely to decay just because it has existed for a long time.",
    check:{q:"After two half-lives, what fraction of the original nuclei remains?",opts:["1/2","1/3","1/4"],a:2}
  },
  {
    id:"stability", code:"3.8.1.4", title:"N–Z stability map",
    subtitle:"Apply a decay mode and see how proton and neutron numbers move on an N–Z plot.",
    controls:[
      {key:"Z",label:"Proton number Z",type:"range",min:10,max:90,step:1,value:50,unit:""},
      {key:"N",label:"Neutron number N",type:"range",min:10,max:145,step:1,value:75,unit:""},
      {key:"decayMode",label:"Decay mode",type:"select",value:"betaMinus",options:[["alpha","Alpha"],["betaMinus","Beta minus"],["betaPlus","Beta plus"],["ec","Electron capture"],["gamma","Gamma"]]}
    ],
    simple:"Each decay mode moves a nucleus in a specific direction on the neutron-number versus proton-number map.",
    exam:"Beta processes change a neutron into a proton or a proton into a neutron, so A remains constant while Z changes by one. Alpha decay reduces A by four and Z by two.",
    mistake:"Gamma emission does not move the nuclide on an N–Z plot because N and Z are unchanged.",
    check:{q:"What happens to Z in beta-minus decay?",opts:["Decreases by 1","Increases by 1","Decreases by 2"],a:1}
  },
  {
    id:"decayChain", code:"3.8.1.4", title:"Animated decay chain",
    subtitle:"Follow the natural U-238 decay series step by step and watch how alpha and beta-minus decays change A, Z and N until a stable lead nucleus is reached.",
    controls:[
      {key:"chainStep",label:"Decay-chain step",type:"range",min:0,max:14,step:1,value:0,unit:""},
      {key:"chainPhase",label:"Event progress",type:"range",min:0,max:100,step:1,value:0,unit:" %"},
      {key:"chainView",label:"View",type:"select",value:"timeline",options:[["timeline","Timeline + animated nucleus"],["nz","N–Z path + animated nucleus"]]}
    ],
    simple:"A decay chain is a sequence of unstable parent nuclei. Each alpha or beta-minus decay creates a new daughter nucleus, which may itself be unstable and decay again.",
    exam:"Use A and Z bookkeeping at every step. Alpha decay gives A−4 and Z−2. Beta-minus decay leaves A unchanged and gives Z+1. Gamma emission would leave A and Z unchanged. The specific natural chain is an application; the examinable skill is tracking the nuclear changes correctly.",
    mistake:"Do not assume every daughter nucleus is stable after one decay. In a decay chain, the daughter can remain radioactive and decay again.",
    check:{q:"In beta-minus decay, what happens to A and Z?",opts:["A unchanged, Z +1","A −4, Z −2","A unchanged, Z −1"],a:0}
  },
  {
    id:"radius", code:"3.8.1.5", title:"Nuclear radius and density",
    subtitle:"Change nucleon number and see why R ∝ A^(1/3) implies nearly constant nuclear density.",
    controls:[
      {key:"A",label:"Nucleon number A",type:"range",min:4,max:240,step:1,value:56,unit:""},
      {key:"r0",label:"r₀",type:"range",min:1.15,max:1.30,step:.01,value:1.20,unit:" fm"}
    ],
    simple:"A bigger nucleus contains more nucleons, but its radius grows only as the cube root of A.",
    exam:"Since R = r₀A^(1/3), nuclear volume is proportional to R³ and therefore proportional to A. Nuclear mass is also approximately proportional to A, so nuclear density is approximately constant.",
    mistake:"Doubling A does not double nuclear radius.",
    check:{q:"If A becomes 8 times larger, the radius becomes approximately…",opts:["2 times larger","4 times larger","8 times larger"],a:0}
  },
  {
    id:"massEnergy", code:"3.8.1.6", title:"Mass defect and binding energy",
    subtitle:"Convert a mass defect in atomic mass units into binding energy.",
    controls:[
      {key:"massDefect",label:"Mass defect",type:"range",min:.001,max:.300,step:.001,value:.100,unit:" u"},
      {key:"massA",label:"Nucleon number",type:"range",min:2,max:240,step:1,value:16,unit:""}
    ],
    simple:"A small missing mass corresponds to the energy needed to separate the nucleus into free nucleons.",
    exam:"The binding energy is the energy equivalent of the mass defect: ΔE = Δmc². Using atomic mass units, 1 u corresponds to 931.5 MeV.",
    mistake:"Mass is not destroyed; mass-energy is conserved.",
    check:{q:"A larger binding energy per nucleon generally indicates…",opts:["A more tightly bound nucleus","A larger atomic radius","A larger charge"],a:0}
  },
  {
    id:"binding", code:"3.8.1.6", title:"Binding-energy curve",
    subtitle:"Explore why light nuclei can release energy by fusion and heavy nuclei by fission.",
    controls:[
      {key:"bindA",label:"Nucleon number A",type:"range",min:2,max:240,step:1,value:56,unit:""}
    ],
    simple:"Nuclei release energy when the products move higher on the binding-energy-per-nucleon curve.",
    exam:"Fusion of light nuclei and fission of heavy nuclei can release energy because the products have a greater average binding energy per nucleon, so total mass decreases.",
    mistake:"The peak of the curve does not mean iron nuclei contain the most total binding energy; it refers to average binding energy per nucleon.",
    check:{q:"Why can fission release energy?",opts:["Products have higher binding energy per nucleon","Products have more nucleons","Neutrons have no mass"],a:0}
  },
  {
    id:"fission", code:"3.8.1.7", title:"Fission chain reaction",
    subtitle:"Step through neutron capture, the excited compound nucleus, deformation, splitting, prompt-neutron release and the next chain-reaction generation.",
    controls:[
      {key:"eventStage",label:"Fission event stage",type:"range",min:0,max:5,step:1,value:0,unit:""},
      {key:"k",label:"Conceptual chain behaviour",type:"range",min:.6,max:1.4,step:.05,value:1.0,unit:""},
      {key:"generation",label:"Chain generations shown",type:"range",min:0,max:5,step:1,value:3,unit:""}
    ],
    simple:"A slow neutron can be absorbed by a fissile U-235 nucleus, forming an excited U-236* compound nucleus. It deforms and splits into two neutron-rich fragments, releasing energy and typically several prompt neutrons that may trigger further fissions.",
    exam:"For AQA, explain the sequence: neutron absorption → unstable/excited compound nucleus → fission fragments + released neutrons + energy. A chain reaction then depends on whether enough released neutrons cause later fissions rather than being lost by escape or non-fission absorption.",
    mistake:"The exact fission fragments vary. The chain-behaviour control is deliberately conceptual and is not a real criticality or reactor-design calculation.",
    check:{q:"What directly links one fission event to the next generation?",opts:["Prompt neutrons released by fission","Electrons leaving the atom","The coolant"],a:0}
  },
  {
    id:"reactor", code:"3.8.1.7–8", title:"Thermal reactor systems",
    subtitle:"See the distinct roles of moderator, control system, coolant, shielding and shutdown.",
    controls:[
      {key:"reactorFocus",label:"Teaching view",type:"select",value:"overview",options:[["overview","Overview"],["neutrons","Neutron pathway"],["heat","Heat pathway"],["safety","Safety systems"]]},
      {key:"control",label:"Control insertion (conceptual)",type:"range",min:0,max:100,step:1,value:50,unit:" %"},
      {key:"cooling",label:"Cooling effectiveness (conceptual)",type:"range",min:20,max:100,step:1,value:75,unit:" %"}
    ],
    simple:"A reactor combines separate systems: one manages neutron balance, one slows neutrons, one removes heat, and shielding reduces radiation outside the core.",
    exam:"The moderator slows neutrons by collisions; control rods absorb neutrons; coolant transfers thermal energy; shielding reduces exposure; shutdown systems reduce the chain reaction rapidly.",
    mistake:"Do not say the coolant controls the chain reaction directly.",
    check:{q:"What is the main role of a moderator in a thermal reactor?",opts:["Slow neutrons","Absorb all neutrons","Produce gamma rays"],a:0}
  },
  {
    id:"energyLevels", code:"3.8.1.4", title:"Nuclear energy levels and gamma emission",
    subtitle:"Move between nuclear excited states and see the gamma photon energy set by the level spacing.",
    controls:[
      {key:"upperLevel",label:"Upper nuclear level",type:"range",min:1,max:4,step:1,value:3,unit:""},
      {key:"lowerLevel",label:"Lower nuclear level",type:"range",min:0,max:3,step:1,value:1,unit:""}
    ],
    simple:"An excited nucleus can move to a lower nuclear energy state by emitting a gamma photon.",
    exam:"Gamma emission changes the energy state of the nucleus but does not change proton number Z or nucleon number A. The photon energy equals the difference between the nuclear energy levels.",
    mistake:"Do not confuse nuclear gamma transitions with electron transitions between atomic energy levels.",
    check:{q:"During gamma emission, which nuclear quantities stay unchanged?",opts:["A and Z","Energy only","Z only"],a:0}
  },
  {
    id:"closestApproach", code:"3.8.1.5", title:"Alpha closest approach",
    subtitle:"Use a head-on alpha particle to connect kinetic energy with electrostatic potential energy at minimum separation.",
    controls:[
      {key:"targetZ",label:"Target proton number Z",type:"range",min:20,max:92,step:1,value:79,unit:""},
      {key:"alphaMeV",label:"Alpha kinetic energy",type:"range",min:3,max:10,step:.25,value:5.0,unit:" MeV"}
    ],
    simple:"A head-on alpha particle slows as electrostatic potential energy increases. At closest approach its initial kinetic energy has been converted into electrostatic potential energy in the ideal model.",
    exam:"For a head-on closest-approach estimate, set the initial alpha kinetic energy equal to the Coulomb potential energy between charges +2e and +Ze.",
    mistake:"Use both nuclear charges in the Coulomb expression and convert MeV to joules if working fully in SI units.",
    check:{q:"Increasing alpha kinetic energy makes the closest approach distance…",opts:["smaller","larger","unchanged"],a:0}
  },
  {
    id:"electronDiffraction", code:"3.8.1.5", title:"Electron diffraction by nuclei",
    subtitle:"Change nuclear radius and electron wavelength to see how the diffraction pattern shifts.",
    controls:[
      {key:"diffRadius",label:"Nuclear radius",type:"range",min:3,max:8,step:.1,value:5.0,unit:" fm"},
      {key:"wavelength",label:"Electron wavelength (relative)",type:"range",min:.4,max:1.2,step:.05,value:.7,unit:" fm"}
    ],
    simple:"Short-wavelength electrons can diffract from a nucleus. The angular positions of minima contain information about nuclear size.",
    exam:"Electron diffraction provides a nuclear-radius measurement because the de Broglie wavelength can be comparable with nuclear dimensions. A larger scattering object shifts diffraction features to smaller angles for the same wavelength.",
    mistake:"Do not treat the intensity pattern as Rutherford scattering; this is wave diffraction.",
    check:{q:"For the same electron wavelength, a larger nucleus moves the first diffraction minimum to…",opts:["a smaller angle","a larger angle","exactly 90°"],a:0}
  },
  {
    id:"moderation", code:"3.8.1.7", title:"Neutron moderation by collisions",
    subtitle:"Compare how effectively different target-nucleus masses reduce a fast neutron's kinetic energy in a simple collision model.",
    controls:[
      {key:"massRatio",label:"Moderator nucleus mass / neutron mass",type:"range",min:1,max:20,step:1,value:2,unit:""},
      {key:"collisionCount",label:"Number of collisions",type:"range",min:1,max:12,step:1,value:5,unit:""}
    ],
    simple:"A moderator reduces neutron kinetic energy through collisions. Energy transfer is most effective when the colliding masses are not extremely different.",
    exam:"A moderator should slow neutrons efficiently while having a low tendency to absorb them. A simple mechanical collision model helps explain energy transfer during moderation.",
    mistake:"Moderation means slowing neutrons, not removing them from the chain reaction.",
    check:{q:"What is the primary purpose of a moderator?",opts:["Reduce neutron kinetic energy","Absorb every neutron","Cool the fuel directly"],a:0}
  }
];

const formulas = [
  {id:"decay",name:"Number remaining",eq:"N = N₀e^(−λt)",inputs:[["N0","Initial nuclei N₀",1000],["lambda","Decay constant λ / s⁻¹",0.02],["t","Time t / s",50]],calc:v => {
    const N=v.N0*Math.exp(-v.lambda*v.t);
    return ["N = "+v.N0+" × e^(−"+v.lambda+" × "+v.t+")","N = "+fmt(N,5),"Fraction remaining = "+fmt(N/v.N0,4)];
  }},
  {id:"activity",name:"Activity",eq:"A = λN",inputs:[["lambda","Decay constant λ / s⁻¹",0.015],["N","Number of undecayed nuclei",2000000]],calc:v => {
    const A=v.lambda*v.N;
    return ["A = "+v.lambda+" × "+v.N,"A = "+fmt(A,5)+" Bq","1 Bq = 1 decay s⁻¹"];
  }},
  {id:"half",name:"Half-life and decay constant",eq:"T½ = ln2 / λ",inputs:[["lambda","Decay constant λ / s⁻¹",0.005]],calc:v => {
    const T=ln2/v.lambda;
    return ["T½ = 0.693 / "+v.lambda,"T½ = "+fmt(T,5)+" s","A larger λ means a shorter half-life."];
  }},
  {id:"inverse",name:"Inverse-square intensity",eq:"I₂ = I₁(r₁/r₂)²",inputs:[["I1","Intensity/count rate I₁",800],["r1","Distance r₁ / m",0.2],["r2","Distance r₂ / m",0.5]],calc:v => {
    const I=v.I1*Math.pow(v.r1/v.r2,2);
    return ["I₂ = "+v.I1+" × ("+v.r1+"/"+v.r2+")²","I₂ = "+fmt(I,5),"Valid for point-like emission in the idealised inverse-square model."];
  }},
  {id:"radius",name:"Nuclear radius",eq:"R = r₀A^(1/3)",inputs:[["r0","r₀ / fm",1.2],["A","Nucleon number A",56]],calc:v => {
    const R=v.r0*Math.cbrt(v.A);
    return ["R = "+v.r0+" × "+v.A+"^(1/3) fm","R = "+fmt(R,5)+" fm","R = "+fmt(R*1e-15,5)+" m"];
  }},
  {id:"density",name:"Nuclear density",eq:"ρ = m / ((4/3)πR³)",inputs:[["A","Nucleon number A",56],["r0","r₀ / fm",1.2]],calc:v => {
    const R=v.r0*Math.cbrt(v.A)*1e-15, m=v.A*uKg, rho=m/((4/3)*Math.PI*Math.pow(R,3));
    return ["m ≈ A u = "+fmt(m,4)+" kg","R = "+fmt(R,4)+" m","ρ ≈ "+fmt(rho,5)+" kg m⁻³"];
  }},
  {id:"mass",name:"Mass–energy",eq:"ΔE = Δmc²",inputs:[["du","Mass difference / u",0.1]],calc:v => {
    const MeV=v.du*931.5, J=MeV*1e6*e;
    return ["ΔE = "+v.du+" × 931.5 MeV","ΔE = "+fmt(MeV,5)+" MeV","ΔE = "+fmt(J,5)+" J"];
  }},
  {id:"bind",name:"Binding energy per nucleon",eq:"BE/A",inputs:[["du","Mass defect / u",0.12],["A","Nucleon number A",16]],calc:v => {
    const BE=v.du*931.5, per=BE/v.A;
    return ["BE = "+v.du+" × 931.5 = "+fmt(BE,5)+" MeV","BE/A = "+fmt(BE,5)+" / "+v.A,"BE per nucleon = "+fmt(per,5)+" MeV"];
  }},
  {id:"nuclei",name:"Number of nuclei from sample mass",eq:"N = (m/M)N_A",inputs:[["m","Sample mass m / g",0.5],["M","Molar mass M / g mol⁻¹",60]],calc:v => {
    const NA=6.02214076e23, n=v.m/v.M, N=n*NA;
    return ["n = m/M = "+v.m+"/"+v.M+" = "+fmt(n,5)+" mol","N = nN_A = "+fmt(N,5)+" nuclei","Use the number of radioactive nuclei in A = λN."];
  }},
  {id:"sampleActivity",name:"Activity from mass and half-life",eq:"A = (ln2/T½)(m/M)N_A",inputs:[["m","Sample mass m / g",0.001],["M","Molar mass M / g mol⁻¹",60],["T","Half-life T½ / s",3600]],calc:v => {
    const NA=6.02214076e23, N=(v.m/v.M)*NA, lambda=ln2/v.T, A=lambda*N;
    return ["N = (m/M)N_A = "+fmt(N,5),"λ = 0.693/T½ = "+fmt(lambda,5)+" s⁻¹","A = λN = "+fmt(A,5)+" Bq"];
  }},
  {id:"closest",name:"Alpha closest approach",eq:"E_k = (1/4πε₀)(2Ze²/r)",inputs:[["Z","Target proton number Z",79],["E","Alpha kinetic energy / MeV",5]],calc:v => {
    const k=8.9875517923e9, Ej=v.E*1e6*e, r=k*(2*v.Z*e*e)/Ej;
    return ["E_k = "+v.E+" MeV = "+fmt(Ej,5)+" J","r = k(2Ze²)/E_k","r = "+fmt(r,5)+" m = "+fmt(r/1e-15,5)+" fm"];
  }},
  {id:"gamma",name:"Gamma photon from level spacing",eq:"ΔE = hf",inputs:[["dE","Nuclear level spacing / MeV",0.14]],calc:v => {
    const h=6.62607015e-34, Ej=v.dE*1e6*e, freq=Ej/h;
    return ["ΔE = "+v.dE+" MeV = "+fmt(Ej,5)+" J","f = ΔE/h","f = "+fmt(freq,5)+" Hz"];
  }}
];

const quiz = [
  ["3.8.1.1","Which Rutherford observation requires a very concentrated positive charge?",["Most alpha particles pass straight through","Some alpha particles scatter through very large angles","The source emits alpha particles"],1,"Think about what could reverse the direction of a positive alpha particle.","Large-angle scattering requires a strong repulsive force in a very small region."],
  ["3.8.1.2","Which radiation has the greatest ionising ability in typical comparisons?",["Alpha","Beta","Gamma"],0,"Consider charge and interaction frequency.","Alpha particles ionise strongly over a short range."],
  ["3.8.1.2","If corrected gamma count rate follows the inverse-square law, doubling distance changes it by a factor of…",["1/2","1/4","1/8"],1,"Use 1/r².","Doubling r makes 1/r² four times smaller."],
  ["3.8.1.3","What does the decay constant represent?",["Energy per decay","Probability per unit time that a nucleus decays","Half the activity"],1,"It has units of inverse time.","λ describes the constant decay probability per unit time."],
  ["3.8.1.3","A sample has a half-life of 6 h. What fraction remains after 18 h?",["1/4","1/8","1/16"],1,"18 h is three half-lives.","After three half-lives the fraction is (1/2)³ = 1/8."],
  ["3.8.1.3","Which equation links activity and number of undecayed nuclei?",["A = λN","A = N/λ","A = λ/t"],0,"Activity is proportional to N.","A = λN."],
  ["3.8.1.4","In beta-minus decay, proton number Z…",["increases by 1","decreases by 1","decreases by 2"],0,"A neutron changes into a proton.","The daughter has one more proton and one fewer neutron."],
  ["3.8.1.4","Gamma emission changes…",["A only","Z only","nuclear energy state but not A or Z"],2,"A gamma photon carries energy.","Gamma de-excitation does not change nucleon composition."],
  ["3.8.1.5","The relation R = r₀A^(1/3) implies nuclear volume is proportional to…",["A","A²","A^(1/3)"],0,"Volume is proportional to R³.","R³ is proportional to A."],
  ["3.8.1.5","Which experiment gives information about nuclear size using a diffraction pattern?",["Electron diffraction","Young double slit","Photoelectric effect"],0,"Very short wavelengths probe nuclear dimensions.","Electron diffraction can determine nuclear radius."],
  ["3.8.1.6","What is the mass defect?",["Mass of one proton","Difference between separated nucleon mass and bound nucleus mass","Mass of emitted gamma radiation only"],1,"Binding reduces the total mass-energy of the bound system.","Mass defect corresponds to binding energy."],
  ["3.8.1.6","1 u corresponds to approximately…",["931.5 eV","931.5 keV","931.5 MeV"],2,"This is a standard nuclear conversion.","1 u corresponds to 931.5 MeV of mass-energy."],
  ["3.8.1.6","Why can fusion of light nuclei release energy?",["Products have greater binding energy per nucleon","Products have lower charge","Nucleons disappear"],0,"Use the binding-energy curve.","Moving upward on the BE-per-nucleon curve releases energy."],
  ["3.8.1.6","Why can fission of heavy nuclei release energy?",["Products are closer to the BE-per-nucleon peak","Neutrons have zero rest mass","Charge is destroyed"],0,"Compare average binding before and after.","Medium-mass fission products are more tightly bound per nucleon."],
  ["3.8.1.7","What is the main role of a moderator?",["Slow neutrons","Absorb gamma rays","Remove radioactive waste"],0,"It changes neutron kinetic energy.","A moderator slows neutrons by collisions."],
  ["3.8.1.7","What is the main role of control rods?",["Absorb neutrons","Increase fuel temperature","Create neutrons"],0,"They change neutron population.","Control rods absorb neutrons and therefore influence the chain reaction."],
  ["3.8.1.7","A steady chain reaction means the neutron population is approximately…",["constant from generation to generation","zero","doubling each generation"],0,"Think balance of production and loss.","A steady reaction replaces the neutrons that are lost."],
  ["3.8.1.8","Which system transfers thermal energy away from a reactor core?",["Coolant","Moderator only","Shielding"],0,"It transports heat.","Coolant carries thermal energy away."],
  ["3.8.1.8","Why is shielding used?",["To reduce radiation exposure outside controlled regions","To increase fission rate","To increase neutron speed"],0,"It is a protection system.","Shielding attenuates ionising radiation."],
  ["RP12","Why subtract background count rate?",["To estimate the count associated with the source/model signal","To make the distance smaller","To change the half-life"],0,"Background contributes even without the source signal.","Subtracting background isolates the measured contribution of interest."],
  ["3.8.1.3","A sample contains n moles of a radioactive isotope. Which expression gives the number of nuclei?",["N = nN_A","N = n/N_A","N = N_A/n"],0,"Use the definition of the Avogadro constant.","N = nN_A."],
  ["3.8.1.4","A nucleus emits a gamma photon. What happens to A and Z?",["Both decrease","A unchanged and Z unchanged","A unchanged and Z increases"],1,"Gamma emission is a nuclear energy transition.","The nucleus changes energy state, not its nucleon composition."],
  ["3.8.1.4","A nuclear energy-level transition has energy difference ΔE. Which equation gives the gamma frequency?",["f = h/ΔE","f = ΔE/h","f = hc/ΔE"],1,"Start with E = hf.","f = ΔE/h."],
  ["3.8.1.5","In a head-on closest-approach estimate, the initial alpha kinetic energy is equated to…",["gravitational potential energy","electrostatic potential energy","binding energy per nucleon"],1,"Both the alpha and target nucleus are positively charged.","The ideal head-on estimate uses Coulomb potential energy."],
  ["3.8.1.5","For the same electron wavelength, increasing nuclear radius moves diffraction minima generally toward…",["smaller angles","larger angles","unchanged angles"],0,"Think of diffraction angle versus object size.","A larger diffracting object gives narrower angular features."],
  ["3.8.1.7","Critical mass is linked most directly to whether…",["enough neutrons remain available to sustain the chain reaction","gamma photons escape the reactor","all nuclei have the same mass"],0,"Compare neutron production with losses.","Critical conditions depend on sustaining the neutron chain against losses."],
  ["3.8.1.7","A good moderator should primarily…",["slow neutrons efficiently without strongly absorbing them","absorb as many neutrons as possible","increase neutron kinetic energy"],0,"Moderation and control are different jobs.","The moderator slows neutrons; control rods are used for neutron absorption."],
  ["3.8.1.7","Why can low-mass moderator nuclei transfer neutron kinetic energy effectively?",["Their masses are relatively comparable to a neutron","They have no nucleus","They always absorb the neutron"],0,"Think about mechanical collision energy transfer.","Comparable masses can exchange a large fraction of kinetic energy in a collision."],
  ["3.8.1.8","Why is remote handling useful for radioactive fuel or waste?",["It increases distance and reduces direct exposure","It increases the activity","It makes half-life shorter"],0,"Consider reducing exposure.","Remote handling increases separation from the radiation source."],
  ["3.8.1.8","Which statement best links waste storage to half-life?",["Half-life helps determine how activity changes over long times","All waste becomes safe after one half-life","Half-life changes when shielding is added"],0,"Half-life describes the rate of activity decrease.","Storage decisions depend partly on how long significant activity persists."]
];

let completed = new Set(JSON.parse(localStorage.getItem("nuclearCompleted") || "[]"));
let activeLesson = 0;
let activeSim = 0;
let running = true;
let slow = false;
let startTime = performance.now();
let lastTime = startTime;
let simClock = 0;
let params = {};
let atomRandom = Array.from({length:120},(_,i)=> {
  const x = Math.sin((i+1)*12.9898)*43758.5453;
  return x-Math.floor(x);
});
let practicalData = [];
let backgroundRate = null;
let quizIndex = 0, quizScore = 0, quizStreak = 0, quizLocked = false;

function saveProgress(){
  localStorage.setItem("nuclearCompleted", JSON.stringify(Array.from(completed)));
  updateProgress();
}
function updateProgress(){
  $("#progressText").textContent = completed.size+" / "+lessons.length+" complete";
  $("#progressFill").style.width = (100*completed.size/lessons.length)+"%";
}

function showView(name){
  $$(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
  $$(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-"+name));
  if(name==="practical") drawPracticalGraph();
  window.scrollTo({top:0,behavior:"smooth"});
}
$$(".nav-button").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$$("[data-jump]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.jump)));
$("#resetProgress").addEventListener("click",()=>{completed.clear();saveProgress();renderCourse();renderSpec();});

function renderCourse(){
  const list=$("#courseList");
  list.innerHTML="";
  lessons.forEach((l,i)=>{
    const b=document.createElement("button");
    b.className="course-button"+(i===activeLesson?" active":"")+(completed.has(l.code)?" complete":"");
    b.innerHTML='<span class="course-code">AQA '+l.code+'</span><span class="course-title">'+l.title+'</span>';
    b.addEventListener("click",()=>{activeLesson=i;renderCourse();});
    list.appendChild(b);
  });
  const l=lessons[activeLesson];
  $("#lessonPanel").innerHTML=
    '<span class="eyebrow">AQA '+l.code+'</span>'+
    '<h2>'+l.title+'</h2>'+
    '<p class="lesson-lead">'+l.lead+'</p>'+
    '<div class="lesson-grid">'+
      '<section class="lesson-block"><h3>Core knowledge</h3><ul>'+l.core.map(x=>'<li>'+x+'</li>').join("")+'</ul></section>'+
      '<section class="lesson-block remember"><h3>Remember</h3><p>'+l.remember+'</p></section>'+
      '<section class="lesson-block warning"><h3>Common exam mistake</h3><p>'+l.mistake+'</p></section>'+
      '<section class="lesson-block worked-block"><h3>Key equations / relationships</h3>'+l.formulas.map(x=>'<span class="formula-chip">'+x+'</span>').join("")+'</section>'+
    '</div>'+
    '<div class="lesson-actions"><button class="button primary" id="lessonSim">Open simulation</button><button class="button" id="markLesson">'+(completed.has(l.code)?"Mark incomplete":"Mark complete")+'</button></div>';
  $("#lessonSim").addEventListener("click",()=>{
    const idx=sims.findIndex(s=>s.id===l.sim); if(idx>=0) selectSim(idx);
    showView("lab");
  });
  $("#markLesson").addEventListener("click",()=>{
    if(completed.has(l.code)) completed.delete(l.code); else completed.add(l.code);
    saveProgress();renderCourse();renderSpec();
  });
}

function initSimTabs(){
  const nav=$("#simTabs"); nav.innerHTML="";
  sims.forEach((s,i)=>{
    const b=document.createElement("button"); b.className="sim-tab"+(i===activeSim?" active":"");
    b.textContent=s.title;b.addEventListener("click",()=>selectSim(i));nav.appendChild(b);
  });
}
function selectSim(i){
  activeSim=i; simClock=0; startTime=performance.now(); lastTime=startTime;
  const s=sims[i]; params={};
  s.controls.forEach(c=>params[c.key]=c.value);
  initSimTabs(); buildSimPanel(); renderSim(performance.now());
}
function buildSimPanel(){
  const s=sims[activeSim];
  $("#simSpec").textContent="AQA "+s.code; $("#simCode").textContent="AQA "+s.code;
  $("#simTitle").textContent=s.title; $("#simSubtitle").textContent=s.subtitle;
  $("#simpleExplain").innerHTML="<p>"+s.simple+"</p>";
  $("#examExplain").innerHTML="<p>"+s.exam+"</p>";
  $("#mistakeExplain").innerHTML="<p>"+s.mistake+"</p>";
  const controls=$("#simControls"); controls.innerHTML="";
  s.controls.forEach(c=>{
    const lab=document.createElement("label");lab.className="field";
    const title=document.createElement("span");title.textContent=c.label;lab.appendChild(title);
    let input;
    if(c.type==="select"){
      input=document.createElement("select");
      c.options.forEach(o=>{const op=document.createElement("option");op.value=o[0];op.textContent=o[1];input.appendChild(op);});
      input.value=params[c.key];
    }else{
      input=document.createElement("input");input.type="range";input.min=c.min;input.max=c.max;input.step=c.step;input.value=params[c.key];
    }
    input.dataset.key=c.key; lab.appendChild(input);
    const out=document.createElement("output");out.textContent=String(params[c.key])+(c.unit||"");lab.appendChild(out);
    input.addEventListener("input",()=>{
      params[c.key]=c.type==="select"?input.value:Number(input.value);
      out.textContent=String(params[c.key])+(c.unit||"");
      renderSim(performance.now());
    });
    controls.appendChild(lab);
  });
  const chk=s.check;
  $("#simCheck").innerHTML='<p>'+chk.q+'</p><div class="quick-options">'+chk.opts.map((o,j)=>'<button class="quick-option" data-answer="'+j+'">'+o+'</button>').join("")+'</div><div class="small muted" id="quickFeedback"></div>';
  $$(".quick-option",$("#simCheck")).forEach(b=>b.addEventListener("click",()=>{
    $$(".quick-option",$("#simCheck")).forEach(x=>x.disabled=true);
    const ok=Number(b.dataset.answer)===chk.a;b.classList.add(ok?"correct":"wrong");
    if(!ok) $$(".quick-option",$("#simCheck"))[chk.a].classList.add("correct");
    $("#quickFeedback").textContent=ok?"Correct.":"Check the highlighted answer and the exam wording above.";
  }));
}
$("#playPause").addEventListener("click",()=>{running=!running;$("#playPause").textContent=running?"Pause":"Play";$("#simState").textContent=running?"Running":"Paused";});
$("#slowMotion").addEventListener("click",()=>{slow=!slow;$("#slowMotion").textContent=slow?"Normal speed":"Slow motion";});
$("#resetSim").addEventListener("click",()=>selectSim(activeSim));

function sizeCanvas(canvas){
  const r=canvas.getBoundingClientRect(), dpr=Math.min(window.devicePixelRatio||1,2);
  const w=Math.max(1,Math.round(r.width*dpr)), h=Math.max(1,Math.round(r.height*dpr));
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}
  const ctx=canvas.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);return {ctx,w:r.width,h:r.height};
}
function clearCanvas(ctx,w,h){
  ctx.clearRect(0,0,w,h);
  const g=ctx.createRadialGradient(w*.5,h*.44,20,w*.5,h*.44,Math.max(w,h)*.7);
  g.addColorStop(0,"#153456");g.addColorStop(1,"#07131f");ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
  ctx.strokeStyle="rgba(140,180,220,.08)";ctx.lineWidth=1;
  for(let x=20;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
  for(let y=20;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
}
function circle(ctx,x,y,r,fill,stroke){
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.stroke();}
}
function label(ctx,text,x,y,color="#eaf3ff",size=13,align="left"){
  ctx.fillStyle=color;ctx.font="700 "+size+"px system-ui";ctx.textAlign=align;ctx.fillText(text,x,y);
}
function drawNucleus(ctx,x,y,r,Z=10,N=10){
  const total=Math.min(30,Z+N), golden=2.399963;
  for(let i=0;i<total;i++){
    const rr=r*.72*Math.sqrt((i+.5)/total), a=i*golden;
    const isP=i%2===0;
    circle(ctx,x+Math.cos(a)*rr,y+Math.sin(a)*rr,Math.max(4,r*.12),isP?"#ff7777":"#72a9ff","rgba(255,255,255,.25)");
  }
  ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.strokeStyle="rgba(210,235,255,.35)";ctx.lineWidth=2;ctx.stroke();
}
function readout(text){$("#simReadout").innerHTML=text;}

function renderRutherford(ctx,w,h,t){
  const nx=w*.72, ny=h*.5, nr=Math.min(w,h)*.075;
  drawNucleus(ctx,nx,ny,nr,12,14);
  label(ctx,"positive nucleus",nx,ny+nr+26,"#ffd3d3",12,"center");
  const b=params.impact, E=params.energy;
  const phase=(t*.16)%1;
  for(let j=-2;j<=2;j++){
    const y0=ny+b+j*24;
    ctx.beginPath();
    for(let i=0;i<=100;i++){
      const x=w*.06+(nx-w*.08)*i/100;
      const dx=nx-x, dy=y0-ny;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const sign=(y0>=ny?1:-1);
      const def=sign*(21000/(E*E))*Math.exp(-Math.max(0,dist-nr)/75)/(Math.abs(dy)+24);
      const y=y0+def*(i/100)*(i/100)*35;
      if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
    }
    ctx.strokeStyle=j===0?"#ffe98a":"rgba(255,233,138,.30)";ctx.lineWidth=j===0?3:1.3;ctx.stroke();
  }
  const x=w*.06+(nx-w*.08)*phase, dx=nx-x, dy=(ny+b)-ny;
  const dist=Math.sqrt(dx*dx+dy*dy), sign=(b>=0?1:-1);
  const def=sign*(21000/(E*E))*Math.exp(-Math.max(0,dist-nr)/75)/(Math.abs(dy)+24);
  const y=ny+b+def*phase*phase*35;
  circle(ctx,x,y,8,"#ffe98a","#fff7c2");
  const approx=clamp(140/(Math.abs(b)+18)*(5/E),2,150);
  readout("Relative deflection angle ≈ <strong>"+approx.toFixed(1)+"°</strong><br>Smaller impact parameter → stronger Coulomb repulsion.");
}
function renderRadiation(ctx,w,h,t){
  const type=params.radType, thick=params.thickness/100;
  const benchY=h*.70, sourceX=w*.10, colX=w*.22, absorberX=w*.47, detectorX=w*.80;

  // laboratory bench
  const benchGrad=ctx.createLinearGradient(0,benchY,0,h);
  benchGrad.addColorStop(0,"#31465b");benchGrad.addColorStop(1,"#111b27");
  ctx.fillStyle=benchGrad;ctx.fillRect(w*.04,benchY,w*.90,h*.10);
  ctx.fillStyle="#73869a";ctx.fillRect(w*.04,benchY,w*.90,3);

  // sealed teaching source holder
  const sg=ctx.createRadialGradient(sourceX-6,h*.47,4,sourceX,h*.48,34);
  sg.addColorStop(0,"#7c91a8");sg.addColorStop(.55,"#30445a");sg.addColorStop(1,"#111d2b");
  ctx.fillStyle=sg;ctx.beginPath();ctx.arc(sourceX,h*.48,31,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle="#99abc0";ctx.lineWidth=2;ctx.stroke();
  label(ctx,"virtual source",sourceX,h*.31,"#d8e9fa",11,"center");
  label(ctx,type==="alpha"?"α":type==="beta"?"β":"γ",sourceX,h*.54,"#fff",20,"center");

  // collimator
  ctx.fillStyle="#4d5968";ctx.fillRect(colX-18,h*.35,36,h*.13);ctx.fillRect(colX-18,h*.54,36,h*.13);
  ctx.fillStyle="#1c2734";ctx.fillRect(colX-18,h*.48,36,h*.06);
  label(ctx,"collimator",colX,h*.30,"#cfe8ff",11,"center");

  // absorber cassette
  const absorberW=14+thick*40;
  const ag=ctx.createLinearGradient(absorberX-absorberW/2,0,absorberX+absorberW/2,0);
  ag.addColorStop(0,"#7d8a99");ag.addColorStop(.5,"#d4dde6");ag.addColorStop(1,"#64717f");
  ctx.fillStyle=ag;ctx.fillRect(absorberX-absorberW/2,h*.31,absorberW,h*.38);
  ctx.strokeStyle="#e6eef6";ctx.strokeRect(absorberX-absorberW/2,h*.31,absorberW,h*.38);
  label(ctx,"absorber",absorberX,h*.26,"#cfe8ff",11,"center");

  // Geiger-style detector tube
  const dg=ctx.createLinearGradient(detectorX-45,0,detectorX+45,0);
  dg.addColorStop(0,"#66798d");dg.addColorStop(.5,"#d3dde7");dg.addColorStop(1,"#53677a");
  ctx.fillStyle=dg;ctx.beginPath();ctx.roundRect(detectorX-48,h*.43,96,40,18);ctx.fill();
  ctx.strokeStyle="#a8bbcd";ctx.stroke();
  ctx.fillStyle="#182532";ctx.fillRect(detectorX-57,h*.455,12,22);
  label(ctx,"detector",detectorX,h*.36,"#cfe8ff",11,"center");

  const transmission=type==="alpha"?Math.max(0,1-thick*8):type==="beta"?Math.exp(-thick*4):Math.exp(-thick*1.3);
  const ph=(t*.24)%1;
  const beamY=h*.50;
  ctx.strokeStyle="rgba(130,205,255,.16)";ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(sourceX+31,beamY);ctx.lineTo(detectorX-58,beamY);ctx.stroke();

  for(let j=0;j<12;j++){
    const p=(ph+j/12)%1;
    const survives=j/12 < transmission || p < .48;
    const x=sourceX+32+(detectorX-sourceX-90)*p;
    if(x>absorberX+absorberW/2 && !survives) continue;
    const y=beamY+(j%3-1)*8;
    if(type==="gamma"){
      ctx.strokeStyle="rgba(255,232,128,.88)";ctx.lineWidth=2;ctx.beginPath();
      for(let k=0;k<14;k++){const xx=x-20+k*3.2,yy=y+Math.sin(k*1.4)*4;if(k===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy)}ctx.stroke();
    }else circle(ctx,x,y,type==="alpha"?6:4,type==="alpha"?"#ff9b72":"#7ee8ff","#fff");
  }

  // detector count display
  const meterX=w*.69,meterY=h*.15,meterW=w*.22;
  ctx.fillStyle="#07121e";ctx.fillRect(meterX,meterY,meterW,46);
  ctx.strokeStyle="#38536d";ctx.strokeRect(meterX,meterY,meterW,46);
  ctx.fillStyle="#68dca6";ctx.fillRect(meterX+8,meterY+31,(meterW-16)*transmission,7);
  label(ctx,"relative count rate "+(100*transmission).toFixed(0)+"%",meterX+meterW/2,meterY+22,"#bff4d6",11,"center");

  readout("Virtual source → absorber → detector · relative transmission: <strong>"+(100*transmission).toFixed(1)+"%</strong><br>Alpha is stopped most readily; beta is intermediate; gamma is attenuated progressively rather than having one fixed stopping thickness.");
}
function renderDecay(ctx,w,h,t){
  if(running){
    params.decayTime=clamp(params.decayTime+(slow?.006:.018),0,40);
    const input=$('[data-key="decayTime"]');
    if(input){input.value=params.decayTime;input.nextElementSibling.textContent=params.decayTime.toFixed(1)+" s";}
  }
  const T=params.halfLife,time=params.decayTime,lambda=ln2/T,survival=Math.exp(-lambda*time);
  const left=w*.055,top=h*.18,gridW=w*.48,gridH=h*.58,cols=12,gap=Math.min(gridW/cols,gridH/10);
  let alive=0,decayed=0;

  label(ctx,"MICROSCOPIC VIEW — WHICH NUCLEUS DECAYS IS RANDOM",left,top-34,"#d6ecff",11);
  atomRandom.forEach((r,i)=>{
    const survives=r<survival;if(survives)alive++;else decayed++;
    const x=left+(i%cols)*gap, y=top+Math.floor(i/cols)*gap;
    if(survives){
      circle(ctx,x,y,Math.max(3,gap*.23),"#72a9ff","rgba(255,255,255,.25)");
    }else{
      circle(ctx,x,y,Math.max(3,gap*.19),"rgba(110,130,150,.16)");
      if(i%11===0){
        ctx.strokeStyle="rgba(255,218,125,.42)";ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+11,y-8);ctx.stroke();
        circle(ctx,x+13,y-9,2.5,"#ffe17a");
      }
    }
  });
  label(ctx,"undecayed",left,top+gridH+20,"#a9cfff",10);
  label(ctx,"decayed event",left+w*.18,top+gridH+20,"#d7bb7b",10);

  // Expected-vs-observed summary
  const expected=120*survival,obsFrac=alive/120;
  const bx=left,by=h*.82,bw=w*.43;
  ctx.fillStyle="#102337";ctx.fillRect(bx,by,bw,12);ctx.fillRect(bx,by+26,bw,12);
  ctx.fillStyle="#67c7ff";ctx.fillRect(bx,by,bw*survival,12);
  ctx.fillStyle="#ffe98a";ctx.fillRect(bx,by+26,bw*obsFrac,12);
  label(ctx,"expected N/N₀",bx,by-5,"#aee5ff",9);
  label(ctx,"displayed sample",bx,by+21,"#ffe9a9",9);

  // Graph panel
  const gx=w*.61,gy=h*.79,gw=w*.33,gh=h*.54;
  ctx.strokeStyle="#7b93ad";ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(gx,gy-gh);ctx.lineTo(gx,gy);ctx.lineTo(gx+gw,gy);ctx.stroke();
  ctx.beginPath();
  for(let i=0;i<=100;i++){
    const tt=40*i/100,yy=Math.exp(-lambda*tt),x=gx+gw*i/100,y=gy-gh*yy;
    if(i===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle="#67c7ff";ctx.lineWidth=3;ctx.stroke();

  // Half-life guide lines
  for(let n=1;n<=Math.min(4,Math.floor(40/T));n++){
    const tt=n*T,x=gx+gw*tt/40,y=gy-gh*Math.pow(.5,n);
    ctx.strokeStyle="rgba(255,233,138,.30)";ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x,gy);ctx.lineTo(x,y);ctx.lineTo(gx,y);ctx.stroke();ctx.setLineDash([]);
    circle(ctx,x,y,4,"#ffe98a");
    label(ctx,n+"T½",x,gy+16,"#d9c785",8,"center");
  }
  circle(ctx,gx+gw*time/40,gy-gh*survival,5,"#ffffff","#ffe98a");
  label(ctx,"N/N₀",gx-8,gy-gh-8,"#cfe8ff",10,"right");
  label(ctx,"time / s",gx+gw,gy+18,"#cfe8ff",10,"right");
  label(ctx,"MACROSCOPIC MODEL — SMOOTH EXPONENTIAL",gx,gy-gh-28,"#d6ecff",11);

  readout(
    "λ = <strong>"+lambda.toFixed(4)+" s⁻¹</strong> · T½ = <strong>"+T.toFixed(1)+" s</strong> · t/T½ = <strong>"+(time/T).toFixed(2)+"</strong><br>"+
    "Expected fraction remaining = <strong>"+survival.toFixed(3)+"</strong> ("+expected.toFixed(1)+" of 120 on average); this displayed random sample has <strong>"+alive+"</strong> undecayed and "+decayed+" decayed.<br>"+
    "Key idea: individual decay events are unpredictable, but a large population follows N = N₀e<sup>−λt</sup>."
  );
}
function decayDelta(mode,Z,N){
  if(mode==="alpha")return [Z-2,N-2];
  if(mode==="betaMinus")return [Z+1,N-1];
  if(mode==="betaPlus"||mode==="ec")return [Z-1,N+1];
  return [Z,N];
}
function renderStability(ctx,w,h){
  const ox=w*.10,oy=h*.84,gw=w*.65,gh=h*.66;
  ctx.strokeStyle="#7990a8";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ox,oy-gh);ctx.lineTo(ox,oy);ctx.lineTo(ox+gw,oy);ctx.stroke();
  label(ctx,"neutron number N",ox-14,oy-gh,"#cfe8ff",10,"right");
  label(ctx,"proton number Z",ox+gw,oy+22,"#cfe8ff",10,"right");

  // N=Z reference
  ctx.strokeStyle="rgba(180,195,210,.24)";ctx.setLineDash([4,5]);ctx.beginPath();
  for(let z=10;z<=90;z++){
    const x=ox+gw*(z-10)/80,y=oy-gh*(z-10)/135;
    if(z===10)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.stroke();ctx.setLineDash([]);
  label(ctx,"N = Z reference",ox+gw*.22,oy-gh*.18,"#8799aa",9);

  // stability band
  ctx.beginPath();
  for(let z=10;z<=90;z++){
    const stable=z<20?z:Math.round(z*(1.05+.0055*z));
    const x=ox+gw*(z-10)/80,y=oy-gh*(stable-10)/135;
    if(z===10)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle="rgba(99,217,164,.42)";ctx.lineWidth=18;ctx.stroke();ctx.lineWidth=2;
  label(ctx,"approximate band of stability",ox+gw*.57,oy-gh*.63,"#8ff0bf",10);

  const Z=params.Z,N=params.N,[z2,n2]=decayDelta(params.decayMode,Z,N);
  const x1=ox+gw*(Z-10)/80,y1=oy-gh*(N-10)/135,x2=ox+gw*(z2-10)/80,y2=oy-gh*(n2-10)/135;
  circle(ctx,x1,y1,10,"#ffe98a","#fff");
  circle(ctx,x2,y2,8,"#ff8fa0","#fff");
  arrowLine(ctx,x1,y1,x2,y2,"#ff8fa0");
  label(ctx,"parent",x1,y1-15,"#ffe9a8",9,"center");
  label(ctx,"daughter",x2,y2+20,"#ffb7c1",9,"center");

  const changes={
    alpha:["A −4","Z −2","N −2"],
    betaMinus:["A unchanged","Z +1","N −1"],
    betaPlus:["A unchanged","Z −1","N +1"],
    ec:["A unchanged","Z −1","N +1"],
    gamma:["A unchanged","Z unchanged","N unchanged"]
  }[params.decayMode];
  const pX=w*.79,pY=h*.21,pW=w*.18;
  ctx.fillStyle="rgba(6,20,33,.82)";ctx.strokeStyle="#35536e";ctx.beginPath();ctx.roundRect(pX,pY,pW,h*.48,10);ctx.fill();ctx.stroke();
  label(ctx,"DECAY BOOKKEEPING",pX+10,pY+20,"#d6ecff",9);
  changes.forEach((v,n)=>label(ctx,v,pX+12,pY+48+n*28,n===0?"#ffe98a":"#c9dceb",10));
  label(ctx,"Parent: A="+(Z+N),pX+12,pY+150,"#a9bfd3",9);
  label(ctx,"Daughter: A="+(z2+n2),pX+12,pY+170,"#a9bfd3",9);

  const targetN=Z<20?Z:Math.round(Z*(1.05+.0055*Z)),delta=N-targetN;
  const region=Math.abs(delta)<=6?"near the stability band":delta>6?"neutron-rich relative to the band":"proton-rich relative to the band";
  readout(
    "Parent: <strong>Z="+Z+", N="+N+", A="+(Z+N)+"</strong> → daughter: <strong>Z="+z2+", N="+n2+", A="+(z2+n2)+"</strong>.<br>"+
    "Selected parent is "+region+". The arrow shows the bookkeeping effect of <strong>"+params.decayMode+"</strong>; gamma produces no N–Z movement."
  );
}
function renderDecayChain(ctx,w,h,t){
  const chain=[
    {sym:"U",name:"uranium",A:238,Z:92,mode:"α"},
    {sym:"Th",name:"thorium",A:234,Z:90,mode:"β⁻"},
    {sym:"Pa",name:"protactinium",A:234,Z:91,mode:"β⁻"},
    {sym:"U",name:"uranium",A:234,Z:92,mode:"α"},
    {sym:"Th",name:"thorium",A:230,Z:90,mode:"α"},
    {sym:"Ra",name:"radium",A:226,Z:88,mode:"α"},
    {sym:"Rn",name:"radon",A:222,Z:86,mode:"α"},
    {sym:"Po",name:"polonium",A:218,Z:84,mode:"α"},
    {sym:"Pb",name:"lead",A:214,Z:82,mode:"β⁻"},
    {sym:"Bi",name:"bismuth",A:214,Z:83,mode:"β⁻"},
    {sym:"Po",name:"polonium",A:214,Z:84,mode:"α"},
    {sym:"Pb",name:"lead",A:210,Z:82,mode:"β⁻"},
    {sym:"Bi",name:"bismuth",A:210,Z:83,mode:"β⁻"},
    {sym:"Po",name:"polonium",A:210,Z:84,mode:"α"},
    {sym:"Pb",name:"lead",A:206,Z:82,mode:"stable"}
  ];
  const elementColor={U:"#8fd3ff",Th:"#a7dcff",Pa:"#b4e4ff",Ra:"#ffd89b",Rn:"#cfb8ff",Po:"#ffb6c8",Pb:"#a9d4c1",Bi:"#d8c2ff"};
  let step=clamp(Math.round(Number(params.chainStep)||0),0,chain.length-1);
  let phase=clamp((Number(params.chainPhase)||0)/100,0,1);
  if(running){
    const cycle=t/2.1;
    step=Math.min(chain.length-1,Math.floor(cycle%chain.length));
    phase=cycle%1;
    params.chainStep=step;params.chainPhase=Math.round(phase*100);
    const stepInput=$('[data-key="chainStep"]'),phaseInput=$('[data-key="chainPhase"]');
    if(stepInput){stepInput.value=step;const out=stepInput.nextElementSibling;if(out)out.textContent=String(step);}
    if(phaseInput){phaseInput.value=params.chainPhase;const out=phaseInput.nextElementSibling;if(out)out.textContent=String(params.chainPhase)+" %";}
  }
  const p=chain[step]||chain[0];
  const next=chain[Math.min(step+1,chain.length-1)]||p;
  const parentN=p.A-p.Z,daughterN=next.A-next.Z;
  const changed=phase>=.52||p.mode==="stable";
  const shown=changed?next:p;

  function nucleusParticles(x,y,r,node,transitionMode,progress){
    node=node||p||chain[0];
    const total=42,golden=2.399963;
    const protonFrac=node.Z/node.A;
    for(let i=0;i<total;i++){
      const rr=r*.72*Math.sqrt((i+.55)/total),a=i*golden;
      let isP=(i/total)<protonFrac;
      let fill=isP?"#ef6f79":"#6ca5ef";
      // During beta-minus, make one neutron visibly transform into a proton.
      if(transitionMode==="β⁻" && i===Math.floor(total*.68)){
        const mix=clamp((progress-.28)/.34,0,1);
        fill=mix<.5?"#6ca5ef":"#ef6f79";
        const pulse=1+Math.sin(Math.PI*mix)*.55;
        circle(ctx,x+Math.cos(a)*rr,y+Math.sin(a)*rr,Math.max(3.4,r*.075)*pulse,fill,"rgba(255,255,255,.55)");
        continue;
      }
      circle(ctx,x+Math.cos(a)*rr,y+Math.sin(a)*rr,Math.max(3.4,r*.075),fill,"rgba(255,255,255,.25)");
    }
    const halo=ctx.createRadialGradient(x,y,r*.55,x,y,r*1.08);
    halo.addColorStop(0,"rgba(255,255,255,0)");
    halo.addColorStop(1,"rgba(135,190,235,.16)");
    ctx.fillStyle=halo;ctx.beginPath();ctx.arc(x,y,r*1.08,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="rgba(210,235,255,.42)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke();
  }
  function elementCard(x,y,node,title,active=true){
    const cw=w*.145,ch=h*.18,c=elementColor[node.sym]||"#b7c7d7";
    ctx.fillStyle=active?"rgba(7,23,36,.92)":"rgba(7,23,36,.58)";
    ctx.strokeStyle=active?c:"rgba(120,145,165,.35)";
    ctx.lineWidth=active?2:1;ctx.beginPath();ctx.roundRect(x,y,cw,ch,12);ctx.fill();ctx.stroke();
    label(ctx,title.toUpperCase(),x+10,y+18,active?c:"#76899a",8);
    label(ctx,String(node.Z),x+10,y+42,active?"#d6e9f7":"#7f91a0",9);
    label(ctx,node.sym,x+cw/2,y+77,active?c:"#718392",30,"center");
    label(ctx,String(node.A),x+cw-10,y+42,active?"#d6e9f7":"#7f91a0",9,"right");
    label(ctx,node.name,x+cw/2,y+100,active?"#eef7ff":"#7f91a0",9,"center");
    label(ctx,"N="+(node.A-node.Z),x+cw/2,y+119,active?"#9fc0d7":"#6e8190",8,"center");
  }
  function alphaCluster(x,y,scale=1){
    const r=6*scale;
    circle(ctx,x-r,y-r,r,"#ef6f79","#fff");
    circle(ctx,x+r,y-r,r,"#ef6f79","#fff");
    circle(ctx,x-r,y+r,r,"#6ca5ef","#fff");
    circle(ctx,x+r,y+r,r,"#6ca5ef","#fff");
  }

  label(ctx,"REALISTIC DECAY-CHAIN TRANSFORMATION",w*.04,h*.055,"#d8ecff",13);
  label(ctx,"U-238 natural series · timing compressed · nuclei enlarged",w*.96,h*.055,"#90a7bb",9,"right");

  // Element identity cards make the element change explicit.
  elementCard(w*.035,h*.12,p,"parent",!changed);
  elementCard(w*.82,h*.12,next,step===chain.length-1?"stable":"daughter",changed);
  arrowLine(ctx,w*.19,h*.21,w*.80,h*.21,changed?"#8fe6b8":"rgba(150,180,205,.34)");
  label(ctx,p.sym+" → "+next.sym,w*.50,h*.19,changed?"#bff5d4":"#93a9bb",11,"center");
  label(ctx,"Z "+p.Z+" → "+next.Z,w*.50,h*.235,changed?"#ffe98a":"#93a9bb",9,"center");

  const cx=w*.42,cy=h*.39,baseR=Math.min(w,h)*.115;
  const r=baseR*(.90+.10*Math.cbrt(shown.A/238));
  if(step===chain.length-1){
    nucleusParticles(cx,cy,r,p,"stable",1);
    label(ctx,"Pb-206",cx,cy+r+26,"#9cf0bc",13,"center");
    label(ctx,"stable end point",cx,cy-r-30,"#9cf0bc",11,"center");
  }else{
    // Slight contraction as four nucleons leave during alpha decay.
    const alphaShrink=p.mode==="α"?1-.025*clamp((phase-.30)/.45,0,1):1;
    nucleusParticles(cx,cy,r*alphaShrink,shown,p.mode,phase);
    label(ctx,(changed?next.sym+"-"+next.A:p.sym+"-"+p.A),cx,cy+r+27,changed?"#a9e8c4":"#ffe9a8",13,"center");

    if(p.mode==="α"){
      const emit=clamp((phase-.22)/.62,0,1);
      const ex=cx+r*.42+emit*w*.24,ey=cy-r*.22-emit*h*.09;
      if(emit>0){
        alphaCluster(ex,ey,.9+emit*.25);
        ctx.strokeStyle="rgba(255,183,125,.42)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+r*.45,cy-r*.12);ctx.lineTo(ex-8,ey+5);ctx.stroke();
        label(ctx,"α = 2p + 2n",ex,ey-20,"#ffd0ad",10,"center");
      }
      if(phase>.34&&phase<.64){
        label(ctx,"four-nucleon cluster leaves nucleus",cx,cy-r-34,"#ffcca6",10,"center");
      }
    }else{
      // Beta-minus: neutron converts into proton, beta electron is emitted; neutrino shown conceptually.
      const emit=clamp((phase-.34)/.50,0,1);
      if(phase>.20){
        label(ctx,"n → p + β⁻ + anti-ν",cx,cy-r-34,"#bfeeff",10,"center");
      }
      if(emit>0){
        const ex=cx+r*.42+emit*w*.25,ey=cy-r*.08-emit*h*.11;
        circle(ctx,ex,ey,5,"#75e9ff","#ffffff");
        label(ctx,"β⁻ electron",ex,ey-14,"#bff4ff",9,"center");
        const vx=cx+r*.28+emit*w*.19,vy=cy+r*.12+emit*h*.10;
        ctx.strokeStyle="rgba(190,190,255,.55)";ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(cx+r*.25,cy+r*.10);ctx.lineTo(vx,vy);ctx.stroke();ctx.setLineDash([]);
        label(ctx,"anti-ν",vx,vy+16,"#c9c8ff",8,"center");
      }
    }
  }

  // Transformation strip: exact nuclear bookkeeping.
  const by=h*.58,bx=w*.05,bw=w*.90;
  ctx.fillStyle="rgba(5,18,30,.88)";ctx.strokeStyle="#34536e";ctx.beginPath();ctx.roundRect(bx,by,bw,h*.115,12);ctx.fill();ctx.stroke();
  if(p.mode!=="stable"){
    const dA=next.A-p.A,dZ=next.Z-p.Z,dN=daughterN-parentN;
    const eq=p.mode==="α"
      ? p.A+"_"+p.Z+p.sym+" → "+next.A+"_"+next.Z+next.sym+" + 4_2He"
      : p.A+"_"+p.Z+p.sym+" → "+next.A+"_"+next.Z+next.sym+" + 0_-1e + anti-ν";
    label(ctx,eq,bx+16,by+28,"#ffffff",11);
    label(ctx,"ΔA "+(dA>=0?"+":"")+dA+"   ΔZ "+(dZ>=0?"+":"")+dZ+"   ΔN "+(dN>=0?"+":"")+dN,bx+16,by+54,"#ffe98a",10);
    const meaning=p.mode==="α"
      ? "element changes because two protons leave the nucleus"
      : "element changes because one neutron becomes a proton, increasing Z by 1";
    label(ctx,meaning,bx+16,by+78,p.mode==="α"?"#ffc79f":"#aeefff",9);
  }else{
    label(ctx,"206_82Pb is stable in this natural decay series",bx+16,by+34,"#9cf0bc",11);
  }

  // Timeline or N-Z path.
  if(params.chainView==="timeline"){
    const left=w*.05,right=w*.95,y=h*.79;
    ctx.strokeStyle="rgba(140,175,205,.25)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();
    chain.forEach((n,i)=>{
      const x=left+(right-left)*i/(chain.length-1),active=i===step,done=i<step;
      circle(ctx,x,y,active?8:5,active?"#ffe98a":done?"#8fe6b8":"#557088",active?"#fff":null);
      if(i<chain.length-1){
        const mode=chain[i].mode;
        label(ctx,mode,x+(right-left)/(chain.length-1)*.5,y-13,mode==="α"?"#ffb38d":"#9de9ff",8,"center");
      }
      if(i===0||i===step||i===chain.length-1) label(ctx,n.sym+"-"+n.A,x,y+23,active?"#fff":"#afc2d2",8,"center");
    });
    label(ctx,"U-238",left,y-31,"#a7b9ca",8,"center");
    label(ctx,"Pb-206 stable",right,y-31,"#9cf0bc",8,"center");
  }else{
    const ox=w*.08,oy=h*.93,gw=w*.82,gh=h*.22;
    ctx.strokeStyle="#6e859d";ctx.beginPath();ctx.moveTo(ox,oy-gh);ctx.lineTo(ox,oy);ctx.lineTo(ox+gw,oy);ctx.stroke();
    let prev=null;
    chain.forEach((n,i)=>{
      const N=n.A-n.Z,x=ox+gw*(n.Z-80)/14,y=oy-gh*(N-120)/30;
      if(prev){ctx.strokeStyle=i<=step?"rgba(255,232,138,.85)":"rgba(125,155,185,.23)";ctx.lineWidth=i<=step?2.4:1;ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(x,y);ctx.stroke();}
      circle(ctx,x,y,i===step?7:4,i===step?"#ffe98a":i<step?"#8fe6b8":"#557088");
      if(i===step) label(ctx,n.sym+"-"+n.A,x,y-10,"#ffffff",8,"center");
      prev={x,y};
    });
    label(ctx,"Z",ox+gw,oy+16,"#cfe8ff",9,"right");label(ctx,"N",ox-10,oy-gh,"#cfe8ff",9,"right");
    label(ctx,"α: down-left  ·  β⁻: right",ox,oy-gh-11,"#a9bfd2",9);
  }

  const identityChange=p.mode==="α"
    ? p.name+" ("+p.sym+", Z="+p.Z+") becomes "+next.name+" ("+next.sym+", Z="+next.Z+") because two protons leave."
    : p.mode==="β⁻"
      ? p.name+" ("+p.sym+", Z="+p.Z+") becomes "+next.name+" ("+next.sym+", Z="+next.Z+") because a neutron becomes a proton."
      : "The series has reached stable lead-206.";
  readout(
    "<strong>"+identityChange+"</strong><br>"+
    (p.mode==="α"
      ? "Alpha decay visibly removes a 2-proton + 2-neutron cluster: A decreases by 4, Z by 2 and N by 2."
      : p.mode==="β⁻"
        ? "Beta-minus decay converts one neutron into a proton and emits a beta electron (with an antineutrino): A is unchanged, Z increases by 1 and N decreases by 1."
        : "No further radioactive step is shown.")+
    "<br>Use the event-progress control while paused to scrub through the transformation."
  );
}
function renderRadius(ctx,w,h){
  const A=params.A,r0=params.r0,R=r0*Math.cbrt(A),scale=Math.min(w,h)*.020;
  const u=1.66053906660e-27,rm=R*1e-15,m=A*u,V=(4/3)*Math.PI*Math.pow(rm,3),rho=m/V;
  const x=w*.26,y=h*.47,r=R*scale;
  drawNucleus(ctx,x,y,r,Math.round(A*.45),Math.round(A*.55));
  ctx.strokeStyle="#9fddff";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+r,y);ctx.stroke();
  label(ctx,"R = "+R.toFixed(2)+" fm",x+r/2,y-9,"#9fddff",10,"center");
  label(ctx,"A = "+A,x,y+r+28,"#cfe8ff",10,"center");

  const A2=Math.min(240,A*8),R2=r0*Math.cbrt(A2),r2=R2*scale,x2=w*.59,y2=h*.47;
  drawNucleus(ctx,x2,y2,r2,Math.round(A2*.45),Math.round(A2*.55));
  label(ctx,"A × "+(A2/A).toFixed(1),x2,y2+r2+28,"#cfe8ff",10,"center");
  label(ctx,"R × "+(R2/R).toFixed(2),x2,y2+r2+44,"#9fddff",9,"center");

  const bx=w*.76,by=h*.20,bw=w*.20;
  ctx.fillStyle="rgba(6,20,33,.82)";ctx.strokeStyle="#35536e";ctx.beginPath();ctx.roundRect(bx,by,bw,h*.48,10);ctx.fill();ctx.stroke();
  label(ctx,"DENSITY CHECK",bx+10,by+21,"#d6ecff",9);
  label(ctx,"mass ≈ A u",bx+10,by+50,"#c9dceb",9);
  label(ctx,"volume = 4πR³/3",bx+10,by+74,"#c9dceb",9);
  label(ctx,"R³ ∝ A",bx+10,by+98,"#8fe6b8",9);
  label(ctx,"m ∝ A",bx+10,by+122,"#8fe6b8",9);
  label(ctx,"therefore ρ ≈ constant",bx+10,by+151,"#ffe98a",9);
  label(ctx,"ρ ≈ "+rho.toExponential(2),bx+10,by+181,"#ffffff",10);
  label(ctx,"kg m⁻³",bx+10,by+199,"#9db4c9",9);

  readout(
    "R = "+r0.toFixed(2)+" × "+A+"<sup>1/3</sup> = <strong>"+R.toFixed(2)+" fm</strong> = "+fmt(rm,4)+" m.<br>"+
    "Using m ≈ Au and V = 4πR³/3 gives ρ ≈ <strong>"+rho.toExponential(3)+" kg m⁻³</strong>. Because both mass and volume are proportional to A, nuclear density is approximately constant."
  );
}
function renderMassEnergy(ctx,w,h){
  const dm=params.massDefect,A=params.massA,BE=dm*931.5,per=BE/A;
  const left=w*.07,right=w*.93,mid=w*.50,top=h*.18;

  label(ctx,"SEPARATED NUCLEONS",w*.22,top-28,"#d6ecff",11,"center");
  label(ctx,"BOUND NUCLEUS",w*.72,top-28,"#d6ecff",11,"center");

  // separated nucleons
  const count=Math.min(24,Math.max(4,Math.round(A/8)));
  for(let i=0;i<count;i++){
    const cols=6,x=w*.10+(i%cols)*w*.045,y=top+Math.floor(i/cols)*36;
    circle(ctx,x,y,8,i%2?"#72a9ff":"#ff7777","rgba(255,255,255,.25)");
  }
  label(ctx,"higher total rest mass-energy",w*.22,top+h*.25,"#ffcf9d",10,"center");

  // bound nucleus
  const nr=Math.min(w,h)*.10;drawNucleus(ctx,w*.72,top+h*.12,nr,Math.round(A*.45),Math.round(A*.55));
  label(ctx,"lower bound-state mass-energy",w*.72,top+h*.25,"#a9e7c3",10,"center");

  // energy difference
  arrowLine(ctx,w*.38,top+h*.12,w*.57,top+h*.12,"#ffe98a");
  label(ctx,"binding releases energy",mid,top+h*.08,"#ffe98a",10,"center");
  label(ctx,"Δm = "+dm.toFixed(3)+" u",mid,top+h*.18,"#d7e9f7",10,"center");

  // energy bars
  const barY=h*.69,barW=w*.72,barX=w*.14,frac=clamp(BE/300,0,1);
  ctx.fillStyle="#12273f";ctx.fillRect(barX,barY,barW,18);ctx.fillRect(barX,barY+42,barW,18);
  ctx.fillStyle="#67c7ff";ctx.fillRect(barX,barY,barW*frac,18);
  ctx.fillStyle="#8fe6b8";ctx.fillRect(barX,barY+42,barW*clamp(per/10,0,1),18);
  label(ctx,"total binding energy",barX,barY-7,"#cfe8ff",9);
  label(ctx,BE.toFixed(2)+" MeV",barX+barW,barY+14,"#ffffff",9,"right");
  label(ctx,"binding energy per nucleon",barX,barY+35,"#cfe8ff",9);
  label(ctx,per.toFixed(3)+" MeV nucleon⁻¹",barX+barW,barY+56,"#ffffff",9,"right");

  readout(
    "Mass defect Δm = <strong>"+dm.toFixed(3)+" u</strong> → binding energy = Δmc² = <strong>"+BE.toFixed(2)+" MeV</strong>.<br>"+
    "For A = "+A+", binding energy per nucleon = <strong>"+per.toFixed(3)+" MeV</strong>. The bound nucleus has lower total mass-energy than the same nucleons separated; mass-energy is conserved."
  );
}
function beCurve(A){
  if(A<4)return 1.1+1.8*A;
  if(A<16)return 4.4+4.0*(1-Math.exp(-(A-4)/5));
  if(A<56)return 8.1+.75*(1-Math.exp(-(A-16)/15));
  return 8.8-.0019*(A-56);
}
function renderBinding(ctx,w,h){
  const ox=w*.09,oy=h*.80,gw=w*.82,gh=h*.58;
  ctx.strokeStyle="#7990a8";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(ox,oy-gh);ctx.lineTo(ox,oy);ctx.lineTo(ox+gw,oy);ctx.stroke();

  // grid
  for(let yv=2;yv<=10;yv+=2){
    const y=oy-gh*(yv/10);ctx.strokeStyle="rgba(120,145,170,.13)";ctx.beginPath();ctx.moveTo(ox,y);ctx.lineTo(ox+gw,y);ctx.stroke();
    label(ctx,String(yv),ox-8,y+3,"#8196aa",8,"right");
  }

  ctx.beginPath();
  for(let A=2;A<=240;A++){
    const x=ox+gw*(A-2)/238,y=oy-gh*(beCurve(A)/10);
    if(A===2)ctx.moveTo(x,y);else ctx.lineTo(x,y);
  }
  ctx.strokeStyle="#67c7ff";ctx.lineWidth=3;ctx.stroke();

  const A=params.bindA,be=beCurve(A),x=ox+gw*(A-2)/238,y=oy-gh*(be/10);
  circle(ctx,x,y,7,"#ffe98a","#fff");
  label(ctx,"selected A="+A,x,y-14,"#ffe98a",9,"center");

  // reference peak
  const peakA=56,peak=beCurve(peakA),px=ox+gw*(peakA-2)/238,py=oy-gh*(peak/10);
  circle(ctx,px,py,6,"#8ff0bf","#fff");
  label(ctx,"near maximum BE/nucleon",px,py-16,"#8ff0bf",9,"center");

  // fusion arrow from light region
  const fA=8,fx=ox+gw*(fA-2)/238,fy=oy-gh*(beCurve(fA)/10);
  arrowLine(ctx,fx,fy,px-18,py+10,"rgba(99,217,164,.75)");
  label(ctx,"fusion: light nuclei → more tightly bound",ox+gw*.12,oy-gh*.37,"#8ff0bf",9);

  // fission arrow from heavy region
  const hA=220,hx=ox+gw*(hA-2)/238,hy=oy-gh*(beCurve(hA)/10);
  arrowLine(ctx,hx,hy,px+28,py+16,"rgba(255,170,185,.75)");
  label(ctx,"fission: heavy nuclei → more tightly bound",ox+gw*.59,oy-gh*.46,"#ffb1bd",9);

  label(ctx,"nucleon number A",ox+gw,oy+20,"#cfe8ff",9,"right");
  label(ctx,"average binding energy / nucleon (MeV)",ox-7,oy-gh-10,"#cfe8ff",9);
  readout(
    "At A = "+A+", schematic average binding energy ≈ <strong>"+be.toFixed(2)+" MeV per nucleon</strong>.<br>"+
    "Energy can be released when products have a higher binding energy per nucleon: light nuclei can move upward by fusion and very heavy nuclei can move upward by fission. Exact reaction energy requires the actual initial and final masses."
  );
}
function renderFission(ctx,w,h,t){
  const k=params.k,gen=Math.round(params.generation),stage=Math.round(params.eventStage||0);
  const cx=w*.43,cy=h*.31,R=Math.min(w,h)*.105;
  const stageNames=[
    "1 · incoming thermal neutron",
    "2 · neutron capture: U-236* formed",
    "3 · excited nucleus deforms",
    "4 · scission: nucleus splits",
    "5 · fragments accelerate + prompt neutrons released",
    "6 · released neutrons can start the next generation"
  ];

  // Title / stage timeline
  label(ctx,"INDUCED FISSION OF U-235 — CONCEPTUAL EVENT",w*.05,h*.075,"#d8ecff",13);
  const tx=w*.05,ty=h*.105,tw=w*.88/6;
  for(let n=0;n<6;n++){
    ctx.fillStyle=n===stage?"rgba(103,199,255,.24)":"rgba(95,120,145,.10)";
    ctx.strokeStyle=n===stage?"#67c7ff":"rgba(130,160,190,.28)";
    ctx.lineWidth=n===stage?2:1;
    ctx.beginPath();ctx.roundRect(tx+n*tw,ty,tw-5,24,6);ctx.fill();ctx.stroke();
    label(ctx,String(n+1),tx+n*tw+(tw-5)/2,ty+16,n===stage?"#dff5ff":"#9db1c5",10,"center");
  }
  label(ctx,stageNames[stage],w*.49,ty+43,"#bfe8ff",12,"center");

  // Helper: schematic nucleus / fragment
  function nucleus(x,y,r,labelText,excited=false){
    const g=ctx.createRadialGradient(x-r*.25,y-r*.25,3,x,y,r);
    g.addColorStop(0,excited?"#ffe09b":"#dcecff");
    g.addColorStop(.45,excited?"#d49352":"#7f9dbb");
    g.addColorStop(1,"#25384c");
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=excited?"#ffd27a":"#a8c0d8";ctx.lineWidth=2;ctx.stroke();
    for(let i=0;i<18;i++){
      const a=i*2.399963,rr=r*.68*Math.sqrt((i+.4)/18);
      circle(ctx,x+Math.cos(a)*rr,y+Math.sin(a)*rr,Math.max(2.5,r*.075),i%2?"#6ca5ef":"#ef7777");
    }
    label(ctx,labelText,x,y+r+20,"#d8e9f7",11,"center");
  }
  function deformed(x,y,r){
    ctx.save();ctx.translate(x,y);
    const pulse=1.0+0.04*Math.sin(t*4);
    ctx.scale(1.42*pulse,.76/pulse);
    const g=ctx.createRadialGradient(-r*.2,-r*.2,3,0,0,r);
    g.addColorStop(0,"#ffe5a8");g.addColorStop(.5,"#c98a50");g.addColorStop(1,"#3b3040");
    ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,r,r,0,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle="#ffd18a";ctx.lineWidth=2;ctx.stroke();ctx.restore();
    label(ctx,"deformed excited U-236*",x,y+r+26,"#ffd9a5",11,"center");
  }
  function fragment(x,y,r,text){
    drawNucleus(ctx,x,y,r,8,11);
    label(ctx,text,x,y+r+17,"#e6eff8",10,"center");
  }
  function neutron(x,y,labText){
    circle(ctx,x,y,6,"#7ee8ff","#dffaff");
    if(labText)label(ctx,labText,x,y-12,"#aeefff",9,"center");
  }

  // Single fission event
  if(stage===0){
    nucleus(cx,cy,R,"U-235");
    const p=.12+.68*((t*.25)%1),nx=w*.06+(cx-R-w*.08)*p;
    neutron(nx,cy,"slow neutron");
    arrowLine(ctx,nx+10,cy,cx-R-5,cy,"rgba(126,232,255,.55)");
    label(ctx,"neutron approaches a fissile nucleus",w*.19,cy+74,"#a8c4da",10,"center");
  }else if(stage===1){
    nucleus(cx,cy,R,"U-236*",true);
    neutron(cx-R*.15,cy-R*.12);
    ctx.strokeStyle="rgba(255,220,130,.65)";ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(cx,cy,R+14,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
    label(ctx,"U-235 + n → excited compound nucleus U-236*",cx,cy-R-28,"#ffd99a",11,"center");
    label(ctx,"absorbed neutron adds energy; the compound nucleus is unstable",cx,cy+R+42,"#a8c4da",10,"center");
  }else if(stage===2){
    deformed(cx,cy,R);
    arrowLine(ctx,cx-R*.9,cy,cx-R*1.65,cy,"rgba(255,210,120,.45)");
    arrowLine(ctx,cx+R*.9,cy,cx+R*1.65,cy,"rgba(255,210,120,.45)");
    label(ctx,"nuclear shape oscillates / elongates",cx,cy-R-34,"#ffd99a",11,"center");
    label(ctx,"repulsion between the two developing positive regions helps drive separation",cx,cy+R+48,"#a8c4da",10,"center");
  }else if(stage===3){
    const sep=R*.72;
    fragment(cx-sep,cy,R*.58,"fission fragment");
    fragment(cx+sep,cy,R*.52,"fission fragment");
    ctx.strokeStyle="rgba(255,215,130,.75)";ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(cx,cy-R*.75);ctx.lineTo(cx,cy+R*.75);ctx.stroke();ctx.setLineDash([]);
    label(ctx,"scission",cx,cy-R-22,"#ffe09b",11,"center");
    arrowLine(ctx,cx-sep-R*.3,cy,cx-sep-R*.9,cy,"#ffb27a");
    arrowLine(ctx,cx+sep+R*.3,cy,cx+sep+R*.9,cy,"#ffb27a");
    label(ctx,"the exact fragment isotopes vary between fission events",cx,cy+R+52,"#a8c4da",10,"center");
  }else{
    const sep=R*1.15,move=Math.min(w*.10,(stage-3)*w*.035);
    fragment(cx-sep-move,cy,R*.48,"neutron-rich fragment");
    fragment(cx+sep+move,cy,R*.44,"neutron-rich fragment");
    const dirs=[[-1.0,-.75],[.10,-1.0],[1.0,.70]];
    dirs.forEach((d,n)=>{
      const dist=stage===4?R*(1.0+((t*.35+n*.21)%1)*1.35):R*2.05;
      const x=cx+d[0]*dist,y=cy+d[1]*dist;
      neutron(x,y,n===0?"prompt n":"");
      ctx.strokeStyle="rgba(126,232,255,.38)";ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();
    });
    arrowLine(ctx,cx-sep,cy,cx-sep-move-R*.55,cy,"#ffae72");
    arrowLine(ctx,cx+sep,cy,cx+sep+move+R*.55,cy,"#ffae72");
    label(ctx,"most released energy initially appears as kinetic energy of the fragments",cx,cy+R+54,"#ffd5a5",10,"center");
    label(ctx,"typically several prompt neutrons are released",cx,cy-R-44,"#aeefff",10,"center");
  }

  // Energy / process panel at right
  const px=w*.72,py=h*.18,pw=w*.24;
  ctx.fillStyle="rgba(6,20,33,.82)";ctx.strokeStyle="#35536e";ctx.lineWidth=1;
  ctx.beginPath();ctx.roundRect(px,py,pw,h*.36,12);ctx.fill();ctx.stroke();
  label(ctx,"WHAT IS HAPPENING",px+12,py+22,"#d8efff",10);
  const lines=[
    "U-235 absorbs a neutron",
    "→ excited U-236*",
    "→ nucleus deforms",
    "→ splits into 2 fragments",
    "→ prompt neutrons + energy",
    "→ neutrons may trigger later fissions"
  ];
  lines.forEach((x,n)=>{
    ctx.fillStyle=n<=stage?"#cfeaff":"#6f8498";ctx.font=(n===stage?"800 ":"600 ")+"10px system-ui";ctx.textAlign="left";ctx.fillText(x,px+12,py+46+n*24);
  });
  ctx.fillStyle="#071421";ctx.fillRect(px+12,py+h*.245,pw-24,42);
  label(ctx,"example bookkeeping",px+20,py+h*.265,"#99b7cf",9);
  label(ctx,"n + U-235 → U-236* →",px+20,py+h*.285,"#d5eafa",9);
  label(ctx,"fragments + 2–3 n + energy",px+20,py+h*.303,"#d5eafa",9);

  // Chain-reaction panel
  const chainTop=h*.64,chainBottom=h*.91,left=w*.07,right=w*.93;
  ctx.strokeStyle="rgba(90,125,155,.35)";ctx.beginPath();ctx.moveTo(left,chainTop-18);ctx.lineTo(right,chainTop-18);ctx.stroke();
  label(ctx,"HOW ONE FISSION CAN LINK TO THE NEXT GENERATION",left,chainTop-28,"#d8efff",11);

  const levels=Math.min(5,gen+1);
  const rows=[];
  for(let g=0;g<levels;g++){
    const raw=Math.pow(Math.max(.55,k),g)*Math.pow(1.45,g);
    const count=Math.max(1,Math.min(9,Math.round(raw)));
    const yy=chainTop+g*((chainBottom-chainTop)/Math.max(1,levels));
    const xs=[];
    for(let n=0;n<count;n++) xs.push(count===1?w*.5:left+(right-left)*(n+.5)/count);
    rows.push({yy,xs});
  }
  rows.forEach((row,g)=>{
    row.xs.forEach((x,n)=>{
      if(g>0){
        const prev=rows[g-1],parent=prev.xs[Math.min(prev.xs.length-1,Math.floor(n*prev.xs.length/row.xs.length))];
        ctx.strokeStyle="rgba(126,232,255,.24)";ctx.beginPath();ctx.moveTo(parent,prev.yy+7);ctx.lineTo(x,row.yy-7);ctx.stroke();
      }
      circle(ctx,x,row.yy,7,g===levels-1?"#ffe08a":"#7eaef0","rgba(255,255,255,.25)");
    });
    label(ctx,"generation "+g,left-8,row.yy+4,"#9db4c9",9,"right");
  });

  // conceptual neutron losses
  const status=k<.95?"decreasing chain":k>1.05?"increasing chain":"approximately steady chain";
  const lossText=k<.95?"more released neutrons are lost than successfully continue the chain":k>1.05?"more released neutrons successfully cause later fissions than are lost":"useful neutron production approximately balances losses";
  const ly=chainBottom+12;
  ctx.strokeStyle="rgba(255,145,145,.55)";ctx.setLineDash([5,4]);
  arrowLine(ctx,w*.20,chainTop+8,w*.10,chainTop+32,"rgba(255,145,145,.65)");
  arrowLine(ctx,w*.80,chainTop+8,w*.90,chainTop+32,"rgba(255,145,145,.65)");
  ctx.setLineDash([]);
  label(ctx,"neutron lost by escape / non-fission absorption",w*.5,ly,"#e8b2b2",9,"center");

  readout("<strong>"+stageNames[stage]+"</strong><br>"+
    "Example sequence: n + U-235 → U-236* → two neutron-rich fragments + prompt neutrons + energy. The exact fragments vary. "+
    "Most fission energy initially becomes kinetic energy of the fragments and is later transferred as thermal energy by collisions.<br>"+
    "Chain view: <strong>"+status+"</strong> because "+lossText+". This is a qualitative AQA teaching model, not a real criticality calculation.");
}
function renderReactor(ctx,w,h,t){
  const control=params.control,cooling=params.cooling,focus=params.reactorFocus||"overview";
  const vesselX=w*.10,vesselY=h*.16,vesselW=w*.43,vesselH=h*.62;

  // Shielding and vessel.
  ctx.fillStyle="rgba(255,233,138,.06)";ctx.strokeStyle=focus==="safety"?"rgba(255,233,138,.78)":"rgba(255,233,138,.32)";ctx.lineWidth=14;
  ctx.beginPath();ctx.roundRect(vesselX-16,vesselY-16,vesselW+32,vesselH+32,28);ctx.fill();ctx.stroke();ctx.lineWidth=2;
  label(ctx,"biological shielding",vesselX+vesselW/2,vesselY+vesselH+38,focus==="safety"?"#fff0a6":"#c3b780",10,"center");

  const vg=ctx.createLinearGradient(vesselX,0,vesselX+vesselW,0);
  vg.addColorStop(0,"#53687a");vg.addColorStop(.45,"#a8bac9");vg.addColorStop(.55,"#71879a");vg.addColorStop(1,"#43596d");
  ctx.fillStyle=vg;ctx.beginPath();ctx.roundRect(vesselX,vesselY,vesselW,vesselH,24);ctx.fill();ctx.strokeStyle="#b9c8d4";ctx.stroke();
  label(ctx,"reactor vessel",vesselX+vesselW/2,vesselY-28,"#d6e7f4",11,"center");

  // Moderator region.
  ctx.fillStyle=focus==="neutrons"?"rgba(70,170,235,.34)":"rgba(70,150,205,.18)";
  ctx.fillRect(vesselX+24,vesselY+42,vesselW-48,vesselH-74);
  label(ctx,"moderator slows neutrons",vesselX+vesselW-31,vesselY+63,focus==="neutrons"?"#bfeaff":"#8cb7d2",8,"right");

  // Fuel and rods.
  for(let i=0;i<6;i++){
    const x=vesselX+46+i*(vesselW-92)/5;
    const fuel=ctx.createLinearGradient(x-6,0,x+6,0);fuel.addColorStop(0,"#8b6a2c");fuel.addColorStop(.5,"#e7b866");fuel.addColorStop(1,"#6e4f1e");
    ctx.fillStyle=fuel;ctx.fillRect(x-6,vesselY+92,12,vesselH-130);
    const rodH=(vesselH-108)*(control/100);
    ctx.fillStyle=focus==="neutrons"?"#1f2c37":"#313d49";ctx.fillRect(x-9,vesselY+45,18,rodH);
  }
  label(ctx,"fuel: fission releases energy + neutrons",vesselX+30,vesselY+vesselH-26,"#ffd493",8);
  label(ctx,"control rods absorb neutrons",vesselX+vesselW/2,vesselY+34,focus==="neutrons"?"#ffffff":"#bcc9d3",8,"center");

  // Neutron pathway: fast -> collisions -> slower.
  for(let i=0;i<18;i++){
    const p=(t*.09+i/18)%1,x=vesselX+34+p*(vesselW-68),y=vesselY+112+(i%5)*(vesselH-185)/4;
    const slow=p>.52;
    circle(ctx,x,y,slow?3:4,slow?"#7ee8ff":"#ffe98a");
    if(focus==="neutrons"&&i%4===0){
      ctx.strokeStyle="rgba(126,232,255,.30)";ctx.beginPath();ctx.moveTo(x-18,y-8);ctx.lineTo(x,y);ctx.stroke();
    }
  }

  // Heat flow / coolant loop.
  const loopX=w*.68,loopTop=h*.27,loopBottom=h*.68;
  ctx.strokeStyle=focus==="heat"?"#7ce4ff":"#4fa8cf";ctx.lineWidth=focus==="heat"?16:11;ctx.beginPath();
  ctx.moveTo(vesselX+vesselW,vesselY+vesselH*.34);
  ctx.bezierCurveTo(loopX-50,loopTop,loopX-20,loopTop,loopX,loopTop);
  ctx.lineTo(loopX,loopBottom);
  ctx.bezierCurveTo(loopX-20,loopBottom,loopX-50,loopBottom,vesselX+vesselW,vesselY+vesselH*.72);ctx.stroke();ctx.lineWidth=2;
  ctx.fillStyle="#586c7e";ctx.beginPath();ctx.roundRect(loopX-28,h*.38,56,h*.20,12);ctx.fill();
  label(ctx,"heat exchanger",loopX,h*.36,"#cfe8ff",9,"center");
  arrowLine(ctx,loopX+34,h*.48,w*.91,h*.48,focus==="heat"?"#ffb06f":"rgba(255,176,111,.55)");
  label(ctx,"thermal energy transferred away",w*.91,h*.44,focus==="heat"?"#ffd0a0":"#c09672",9,"right");

  // Teaching panel: distinct functions.
  const px=w*.76,py=h*.18,pw=w*.20;
  ctx.fillStyle="rgba(6,20,33,.86)";ctx.strokeStyle="#35536e";ctx.beginPath();ctx.roundRect(px,py,pw,h*.50,10);ctx.fill();ctx.stroke();
  const rows=[
    ["fuel","fission source"],
    ["moderator","slows neutrons"],
    ["control rods","absorb neutrons"],
    ["coolant","moves thermal energy"],
    ["shielding","reduces external radiation"]
  ];
  label(ctx,"SYSTEM FUNCTIONS",px+10,py+19,"#d8efff",9);
  rows.forEach((r,n)=>{
    const active=focus==="overview"||(focus==="neutrons"&&n<=2)||(focus==="heat"&&n===3)||(focus==="safety"&&n===4);
    label(ctx,r[0],px+10,py+48+n*43,active?"#ffffff":"#72879a",9);
    label(ctx,r[1],px+10,py+64+n*43,active?"#aeefff":"#637687",8);
  });

  const neutronIndicator=clamp(100*(1-control/125),0,100),heatRemoval=clamp(cooling,0,100);
  readout(
    "<strong>"+(focus==="overview"?"Overview":focus==="neutrons"?"Neutron pathway":focus==="heat"?"Heat-transfer pathway":"Safety view")+"</strong><br>"+
    "Moderator slows neutrons; control rods absorb neutrons; coolant transfers thermal energy; shielding reduces radiation outside the core. The conceptual controls illustrate these separate roles only and are <strong>not</strong> a real reactor operating model.<br>"+
    "Teaching indicators: neutron-population index "+neutronIndicator.toFixed(0)+"%, heat-removal index "+heatRemoval.toFixed(0)+"%."
  );
}
function renderEnergyLevels(ctx,w,h,t){
  const levels=[0,0.14,0.39,0.82,1.42];
  let up=Math.round(params.upperLevel),low=Math.round(params.lowerLevel);
  if(low>=up)low=Math.max(0,up-1);
  const dE=Math.max(0,levels[up]-levels[low]);
  const hPlanck=6.62607015e-34,c=299792458,Ej=dE*1e6*e,freq=Ej/hPlanck,wavelength=freq>0?c/freq:0;

  // Two nuclei: before and after gamma emission.
  const nx1=w*.15,nx2=w*.39,ny=h*.33,nr=Math.min(w,h)*.085;
  drawNucleus(ctx,nx1,ny,nr,10,12);drawNucleus(ctx,nx2,ny,nr,10,12);
  ctx.strokeStyle="rgba(255,228,125,.75)";ctx.setLineDash([5,4]);ctx.beginPath();ctx.arc(nx1,ny,nr+10,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  label(ctx,"excited nucleus",nx1,ny+nr+24,"#ffe7a2",11,"center");
  label(ctx,"lower-energy nucleus",nx2,ny+nr+24,"#a9e8c4",11,"center");
  label(ctx,"same A and Z",nx2,ny+nr+42,"#9db7ca",9,"center");

  // Animated photon leaves the nucleus.
  const ph=(t*.45)%1,px=nx1+nr+ph*(nx2-nx1-nr*1.2),py=ny-nr*.9;
  ctx.strokeStyle="#ffe98a";ctx.lineWidth=2.5;ctx.beginPath();
  for(let i=0;i<28;i++){
    const xx=px-35+i*3,yy=py+Math.sin(i*1.35+t*5)*6;
    if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);
  }
  ctx.stroke();label(ctx,"γ photon",px,py-14,"#ffe98a",9,"center");
  arrowLine(ctx,nx1+nr*.7,ny-nr*.55,nx2-nr*.7,ny-nr*.55,"rgba(255,233,138,.38)");

  // Energy-level diagram.
  const left=w*.57,right=w*.86,base=h*.77,scale=h*.40/1.5;
  levels.forEach((E,i)=>{
    const y=base-E*scale;
    ctx.strokeStyle=i===up?"#ffe98a":i===low?"#67c7ff":"rgba(190,215,240,.34)";
    ctx.lineWidth=(i===up||i===low)?3:1.3;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();
    label(ctx,"E"+i+"  "+E.toFixed(2)+" MeV",right+9,y+4,"#cfe8ff",9);
  });
  const y1=base-levels[up]*scale,y2=base-levels[low]*scale,x=w*.70;
  arrowLine(ctx,x,y1+5,x,y2-5,"#ffe98a");
  label(ctx,"ΔE = "+dE.toFixed(2)+" MeV",x+10,(y1+y2)/2,"#ffe98a",9);

  // Quantitative panel.
  const bx=w*.08,by=h*.66,bw=w*.40;
  ctx.fillStyle="rgba(7,22,35,.86)";ctx.strokeStyle="#35536e";ctx.beginPath();ctx.roundRect(bx,by,bw,h*.20,10);ctx.fill();ctx.stroke();
  label(ctx,"PHOTON CALCULATION",bx+10,by+18,"#d6ecff",9);
  label(ctx,"ΔE = hf",bx+10,by+44,"#ffffff",11);
  label(ctx,"f ≈ "+freq.toExponential(2)+" Hz",bx+10,by+68,"#aeefff",10);
  label(ctx,"λ ≈ "+wavelength.toExponential(2)+" m",bx+10,by+90,"#aeefff",10);

  readout(
    "Nuclear transition: <strong>"+levels[up].toFixed(2)+" MeV → "+levels[low].toFixed(2)+" MeV</strong>, so ΔE = <strong>"+dE.toFixed(2)+" MeV</strong>.<br>"+
    "The gamma photon carries E = hf, giving f ≈ <strong>"+freq.toExponential(3)+" Hz</strong> and wavelength ≈ <strong>"+wavelength.toExponential(3)+" m</strong>. A and Z are unchanged because no nucleons are added or removed."
  );
}
function arrowLine(ctx,x1,y1,x2,y2,color){
  ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  const a=Math.atan2(y2-y1,x2-x1),q=8;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-Math.cos(a-.55)*q,y2-Math.sin(a-.55)*q);ctx.lineTo(x2-Math.cos(a+.55)*q,y2-Math.sin(a+.55)*q);ctx.closePath();ctx.fill();
}
function renderClosestApproach(ctx,w,h,t){
  const Z=params.targetZ,E=params.alphaMeV,k=8.9875517923e9,Ej=E*1e6*e;
  const r=k*(2*Z*e*e)/Ej,rfm=r/1e-15;
  const nx=w*.72,ny=h*.48,nr=Math.min(w,h)*.09;
  drawNucleus(ctx,nx,ny,nr,18,23);
  label(ctx,"target nucleus +"+Z+"e",nx,ny+nr+25,"#ffd1d8",11,"center");

  for(let q=1;q<=5;q++){
    ctx.strokeStyle="rgba(255,120,140,"+(0.17/q+.025)+")";ctx.lineWidth=1.2;
    ctx.beginPath();ctx.arc(nx,ny,nr+q*28,0,Math.PI*2);ctx.stroke();
  }

  // Alpha approaches, slows, turns, and moves away.
  const cyc=(t*.36)%1;
  const inward=cyc<.5?cyc*2:(1-cyc)*2;
  const minX=nx-nr-50;
  const startX=w*.08;
  const x=startX+(minX-startX)*inward;
  const relativePE=clamp((x-startX)/(minX-startX),0,1);
  const relativeKE=1-relativePE;
  circle(ctx,x,ny,10,"#ffe98a","#fff7c2");label(ctx,"α  +2e",x,ny+28,"#ffe98a",10,"center");
  arrowLine(ctx,x-10,ny-34,x-22-55*relativePE,ny-34,"rgba(255,175,95,.86)");
  label(ctx,"repulsion",x-25,ny-45,"#ffc89c",8,"center");

  // Energy conservation bars.
  const bx=w*.07,by=h*.15,bw=w*.39;
  label(ctx,"ENERGY TRANSFER ALONG THE APPROACH",bx,by-14,"#d6ecff",10);
  ctx.fillStyle="#102337";ctx.fillRect(bx,by,bw,15);ctx.fillRect(bx,by+34,bw,15);
  ctx.fillStyle="#67c7ff";ctx.fillRect(bx,by,bw*relativeKE,15);
  ctx.fillStyle="#ff9e73";ctx.fillRect(bx,by+34,bw*relativePE,15);
  label(ctx,"kinetic energy",bx,by-3,"#9fe0ff",9);
  label(ctx,"electrostatic potential energy",bx,by+31,"#ffc0a5",9);
  label(ctx,(relativeKE*E).toFixed(2)+" MeV",bx+bw,by+12,"#ffffff",9,"right");
  label(ctx,(relativePE*E).toFixed(2)+" MeV",bx+bw,by+46,"#ffffff",9,"right");

  ctx.strokeStyle="#ffe98a";ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(minX,ny-66);ctx.lineTo(minX,ny+66);ctx.stroke();ctx.setLineDash([]);
  label(ctx,"turning point",minX,ny-76,"#ffe98a",10,"center");
  label(ctx,"r ≈ "+rfm.toFixed(1)+" fm",minX,ny+82,"#ffe98a",10,"center");

  // Calculation panel.
  const px=w*.53,py=h*.71,pw=w*.40;
  ctx.fillStyle="rgba(6,20,33,.84)";ctx.strokeStyle="#35536e";ctx.beginPath();ctx.roundRect(px,py,pw,h*.16,10);ctx.fill();ctx.stroke();
  label(ctx,"AT CLOSEST APPROACH",px+10,py+18,"#d8efff",9);
  label(ctx,"Eₖ(initial) = electrostatic PE",px+10,py+43,"#ffffff",10);
  label(ctx,"r = k(2e)(Ze)/Eₖ",px+10,py+66,"#aeefff",10);
  label(ctx,"= "+rfm.toFixed(2)+" fm",px+10,py+90,"#ffe98a",11);

  readout(
    "Head-on model: as the alpha approaches, <strong>kinetic energy decreases</strong> while <strong>electrostatic potential energy increases</strong>. At the ideal turning point, the initial kinetic energy has become Coulomb potential energy.<br>"+
    "For Z="+Z+" and Eₖ="+E.toFixed(2)+" MeV, r ≈ <strong>"+rfm.toFixed(2)+" fm</strong>. Higher alpha energy gives a smaller r; larger Z gives a larger r."
  );
}
function renderElectronDiffraction(ctx,w,h){
  const R=params.diffRadius,lam=params.wavelength,split=w*.43;
  const first=clamp(18*(lam/.7)*(5/R),4,55);
  const compareR=R*1.35,first2=clamp(18*(lam/.7)*(5/compareR),3,55);

  ctx.fillStyle="#0b1826";ctx.fillRect(w*.035,h*.11,split-w*.045,h*.73);
  ctx.strokeStyle="#35516d";ctx.strokeRect(w*.035,h*.11,split-w*.045,h*.73);
  label(ctx,"WAVE PROBE OF THE NUCLEUS",w*.22,h*.16,"#cfe8ff",11,"center");

  // Electron gun and de Broglie wavefronts.
  ctx.fillStyle="#53677b";ctx.beginPath();ctx.roundRect(w*.065,h*.40,w*.10,h*.13,8);ctx.fill();
  ctx.fillStyle="#e5eef6";ctx.fillRect(w*.155,h*.44,w*.025,h*.05);
  label(ctx,"electron gun",w*.115,h*.58,"#bcd8ec",9,"center");
  for(let n=0;n<7;n++){
    const x=w*.19+n*w*.017;
    ctx.strokeStyle="rgba(126,232,255,.35)";ctx.beginPath();ctx.arc(x,h*.465,13,Math.PI*.5,Math.PI*1.5);ctx.stroke();
  }
  label(ctx,"λ = "+lam.toFixed(2)+" fm",w*.23,h*.39,"#9fe8ff",9,"center");

  // Nucleus as finite scattering object.
  drawNucleus(ctx,w*.315,h*.465,21,9,11);
  ctx.strokeStyle="rgba(255,224,138,.75)";ctx.setLineDash([4,4]);ctx.beginPath();ctx.arc(w*.315,h*.465,28,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);
  label(ctx,"radius R = "+R.toFixed(1)+" fm",w*.315,h*.57,"#ffe9a8",9,"center");

  // Detector arc and diffracted rays.
  ctx.strokeStyle="#79d7a8";ctx.lineWidth=5;ctx.beginPath();ctx.arc(w*.315,h*.465,w*.10,-Math.PI*.72,Math.PI*.72);ctx.stroke();ctx.lineWidth=2;
  [-.62,-.34,0,.34,.62].forEach((a,i)=>{
    ctx.strokeStyle=i===2?"rgba(126,232,255,.75)":"rgba(126,232,255,.34)";
    ctx.lineWidth=i===2?2.2:1.2;ctx.beginPath();ctx.moveTo(w*.315,h*.465);ctx.lineTo(w*.315+Math.cos(a)*w*.10,h*.465+Math.sin(a)*w*.10);ctx.stroke();
  });
  label(ctx,"angular detector",w*.37,h*.26,"#aef0c9",9,"center");

  // Intensity-angle graph with comparison curve.
  const left=w*.49,base=h*.79,gw=w*.45,gh=h*.59;
  ctx.strokeStyle="#7890aa";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(left,base-gh);ctx.lineTo(left,base);ctx.lineTo(left+gw,base);ctx.stroke();
  function curve(minAngle,color,alpha=1){
    ctx.beginPath();
    for(let i=0;i<=260;i++){
      const ang=65*i/260,x=ang/(minAngle||1)*Math.PI;
      const sinc=Math.abs(x)<.04?1:Math.sin(x)/x;
      const intensity=Math.pow(sinc,2);
      const px=left+gw*i/260,py=base-gh*intensity;
      if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);
    }
    ctx.strokeStyle=color;ctx.globalAlpha=alpha;ctx.lineWidth=2.5;ctx.stroke();ctx.globalAlpha=1;
  }
  curve(first,"#67c7ff",1);curve(first2,"#ffb37a",.65);
  const minX=left+gw*(first/65),minX2=left+gw*(first2/65);
  ctx.strokeStyle="#ffe98a";ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(minX,base-gh*.04);ctx.lineTo(minX,base);ctx.stroke();ctx.setLineDash([]);
  label(ctx,"selected R: first min "+first.toFixed(1)+"°",minX,base-12,"#ffe98a",8,"center");
  label(ctx,"larger R comparison",left+gw*.68,base-gh*.82,"#ffb37a",8);
  label(ctx,"intensity",left-6,base-gh,"#cfe8ff",9,"right");label(ctx,"scattering angle",left+gw,base+18,"#cfe8ff",9,"right");

  // Interpretation panel.
  const bx=w*.06,by=h*.68,bw=w*.34;
  ctx.fillStyle="rgba(6,20,33,.82)";ctx.strokeStyle="#35536e";ctx.beginPath();ctx.roundRect(bx,by,bw,h*.13,9);ctx.fill();ctx.stroke();
  label(ctx,"WHY THE MINIMUM MOVES",bx+10,by+17,"#d8efff",8);
  label(ctx,"same λ + larger R",bx+10,by+42,"#ffffff",9);
  label(ctx,"→ narrower angular pattern",bx+10,by+62,"#aeefff",9);
  label(ctx,"→ first minimum at smaller angle",bx+10,by+82,"#ffe98a",9);

  readout(
    "Electron de Broglie wavelength = <strong>"+lam.toFixed(2)+" fm</strong>; selected nuclear radius = <strong>"+R.toFixed(1)+" fm</strong>.<br>"+
    "The diffraction pattern depends on the ratio of wavelength to nuclear size. At fixed λ, increasing R shifts the characteristic minima to <strong>smaller scattering angles</strong>. The orange comparison curve shows that change."
  );
}
function renderModeration(ctx,w,h,t){
  const M=params.massRatio,n=Math.round(params.collisionCount);
  const headOnRetain=Math.pow((M-1)/(M+1),2);
  const transfer=Math.max(0,1-headOnRetain);
  const energies=[1];
  for(let i=1;i<=n;i++)energies.push(energies[i-1]*(.5+.5*headOnRetain));

  const left=w*.07,right=w*.68,trackY=h*.44,step=(right-left)/Math.max(1,n);
  label(ctx,"NEUTRON COLLISION PATH",left,h*.13,"#d6ecff",11);
  ctx.fillStyle="rgba(80,110,145,.08)";ctx.fillRect(w*.04,h*.18,w*.68,h*.59);

  // moderator targets and neutron path
  let prevX=left,prevY=trackY;
  for(let i=0;i<=n;i++){
    const x=left+i*step,y=trackY+Math.sin(i*1.55)*22,Erel=energies[i];
    if(i>0){
      const rad=11+Math.min(20,Math.sqrt(M)*3.2),tx=x,ty=h*.62;
      const g=ctx.createRadialGradient(tx-4,ty-5,3,tx,ty,rad);
      g.addColorStop(0,"#a7c7ff");g.addColorStop(1,"#3c5f91");
      ctx.fillStyle=g;ctx.beginPath();ctx.arc(tx,ty,rad,0,Math.PI*2);ctx.fill();
      ctx.strokeStyle="rgba(220,235,255,.45)";ctx.stroke();
      arrowLine(ctx,prevX,prevY,x,y,"rgba(126,232,255,.42)");
      label(ctx,""+i,x,h*.70,"#9db3c8",8,"center");
    }
    circle(ctx,x,y,5+8*Math.sqrt(Erel),"#7ee8ff","#fff");
    prevX=x;prevY=y;
  }
  label(ctx,"fast",left,trackY-30,"#9fe8ff",9,"center");
  label(ctx,"slower after collisions",right,trackY-30,"#9fe8ff",9,"center");
  label(ctx,"moderator nuclei (relative mass "+M.toFixed(0)+")",w*.37,h*.76,"#b9ccff",9,"center");

  // collision physics panel
  const px=w*.75,py=h*.18,pw=w*.21;
  ctx.fillStyle="rgba(6,20,33,.84)";ctx.strokeStyle="#35536e";ctx.beginPath();ctx.roundRect(px,py,pw,h*.52,10);ctx.fill();ctx.stroke();
  label(ctx,"ONE COLLISION",px+10,py+20,"#d6ecff",9);
  label(ctx,"neutron mass ≈ 1",px+10,py+48,"#c9dceb",9);
  label(ctx,"target mass = "+M.toFixed(0),px+10,py+68,"#c9dceb",9);
  label(ctx,"max head-on",px+10,py+98,"#9db4c9",8);
  label(ctx,"energy transfer",px+10,py+115,"#9db4c9",8);

  const bw=pw-22,bx=px+11,by=py+134;
  ctx.fillStyle="#102337";ctx.fillRect(bx,by,bw,13);
  ctx.fillStyle="#8fe6b8";ctx.fillRect(bx,by,bw*clamp(transfer,0,1),13);
  label(ctx,(100*transfer).toFixed(0)+"% max transfer",bx+bw/2,by+30,"#aeecc7",9,"center");

  const finalE=energies[n];
  label(ctx,"AFTER "+n+" MODEL COLLISIONS",px+10,py+190,"#d6ecff",9);
  label(ctx,(100*finalE).toFixed(1)+"% KE remains",px+10,py+214,"#ffe98a",10);
  label(ctx,"moderation ≠ absorption",px+10,py+246,"#ffbdc5",9);

  readout(
    "For a head-on elastic-collision model with target/neutron mass ratio "+M.toFixed(0)+", up to <strong>"+(100*transfer).toFixed(1)+"%</strong> of neutron kinetic energy can be transferred in one ideal collision.<br>"+
    "After "+n+" teaching-model collisions, relative neutron kinetic energy ≈ <strong>"+finalE.toFixed(3)+"</strong>. A moderator slows neutrons; it should not simply remove them from the chain."
  );
}
function renderSim(now){
  const canvas=$("#simCanvas"); if(!canvas)return;
  const {ctx,w,h}=sizeCanvas(canvas);clearCanvas(ctx,w,h);
  const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;if(running)simClock+=dt*(slow?.3:1);
  const t=simClock;
  const id=sims[activeSim].id;
  if(id==="rutherford")renderRutherford(ctx,w,h,t);
  else if(id==="radiation")renderRadiation(ctx,w,h,t);
  else if(id==="decay")renderDecay(ctx,w,h,t);
  else if(id==="stability")renderStability(ctx,w,h);
  else if(id==="decayChain")renderDecayChain(ctx,w,h,t);
  else if(id==="energyLevels")renderEnergyLevels(ctx,w,h,t);
  else if(id==="closestApproach")renderClosestApproach(ctx,w,h,t);
  else if(id==="electronDiffraction")renderElectronDiffraction(ctx,w,h);
  else if(id==="radius")renderRadius(ctx,w,h);
  else if(id==="massEnergy")renderMassEnergy(ctx,w,h);
  else if(id==="binding")renderBinding(ctx,w,h);
  else if(id==="fission")renderFission(ctx,w,h,t);
  else if(id==="moderation")renderModeration(ctx,w,h,t);
  else if(id==="reactor")renderReactor(ctx,w,h,t);
}
function animationLoop(now){renderSim(now);requestAnimationFrame(animationLoop);}

function initFormula(){
  const sel=$("#formulaSelect");sel.innerHTML=formulas.map(f=>'<option value="'+f.id+'">'+f.name+' — '+f.eq+'</option>').join("");
  sel.addEventListener("change",renderFormula);
  $("#formulaCards").innerHTML=formulas.map(f=>'<article class="formula-card"><strong>'+f.name+'</strong><code>'+f.eq+'</code><p>'+formulaNote(f.id)+'</p></article>').join("");
  renderFormula();
}
function formulaNote(id){
  return {
    decay:"Exponential number-decay relationship.",
    activity:"Activity is decay rate, measured in Bq.",
    half:"Connect half-life and decay probability.",
    inverse:"Ideal inverse-square scaling with distance.",
    radius:"Cube-root dependence of nuclear radius.",
    density:"Shows why nuclear density is nearly constant.",
    mass:"Convert mass difference into energy.",
    bind:"Compare stability using binding energy per nucleon.",
    nuclei:"Convert sample mass into number of nuclei using molar mass and Avogadro constant.",
    sampleActivity:"Combine sample composition, half-life and A = λN.",
    closest:"Use electrostatic potential energy for a head-on alpha closest-approach estimate.",
    gamma:"Convert a nuclear level spacing into gamma-photon frequency."
  }[id]||"";
}
function renderFormula(){
  const f=formulas.find(x=>x.id===$("#formulaSelect").value)||formulas[0],box=$("#formulaInputs");box.innerHTML="";
  f.inputs.forEach(inp=>{
    const lab=document.createElement("label");lab.className="field";lab.innerHTML='<span>'+inp[1]+'</span><input type="number" step="any" data-fkey="'+inp[0]+'" value="'+inp[2]+'">';
    box.appendChild(lab);$("input",lab).addEventListener("input",updateFormulaWorking);
  });updateFormulaWorking();
}
function updateFormulaWorking(){
  const f=formulas.find(x=>x.id===$("#formulaSelect").value)||formulas[0],v={};
  $$("[data-fkey]",$("#formulaInputs")).forEach(i=>v[i.dataset.fkey]=Number(i.value));
  let lines;try{lines=f.calc(v);}catch(err){lines=["Check the entered values."];}
  $("#formulaWorking").innerHTML=lines.map(x=>'<span class="step">'+x+'</span>').join("");
}

function updateDistanceUI(){
  const r=Number($("#distanceSlider").value)/100;
  $("#distanceOutput").textContent=r.toFixed(2)+" m";$("#distanceLabel").textContent=r.toFixed(2)+" m";
}
$("#distanceSlider").addEventListener("input",updateDistanceUI);
$("#measureBackground").addEventListener("click",()=>{
  backgroundRate=0.8+Math.random()*.35;
  $("#backgroundReadout").textContent="Measured virtual background ≈ "+backgroundRate.toFixed(2)+" counts s⁻¹";
});
$("#takeReading").addEventListener("click",()=>{
  const r=Number($("#distanceSlider").value)/100, bg=backgroundRate==null?1.0:backgroundRate;
  const signal=15/(r*r), expected=(signal+bg)*30;
  const noisy=Math.max(0,Math.round(expected + (Math.random()-.5)*2*Math.sqrt(expected)));
  const corrected=Math.max(0,noisy/30-bg);
  practicalData.push({r,inv:1/(r*r),count:noisy,corrected});
  renderPracticalTable();drawPracticalGraph();
});
$("#clearPractical").addEventListener("click",()=>{practicalData=[];backgroundRate=null;renderPracticalTable();drawPracticalGraph();$("#backgroundReadout").textContent="Background not measured yet.";});
function renderPracticalTable(){
  $("#practicalRows").innerHTML=practicalData.map(d=>'<tr><td>'+d.r.toFixed(2)+'</td><td>'+d.inv.toFixed(2)+'</td><td>'+d.count+'</td><td>'+d.corrected.toFixed(2)+'</td></tr>').join("");
}
function drawPracticalGraph(){
  const canvas=$("#practicalCanvas");if(!canvas)return;const {ctx,w,h}=sizeCanvas(canvas);ctx.clearRect(0,0,w,h);ctx.fillStyle="#071522";ctx.fillRect(0,0,w,h);
  const pad={l:58,r:18,t:20,b:42};ctx.strokeStyle="#7690aa";ctx.beginPath();ctx.moveTo(pad.l,pad.t);ctx.lineTo(pad.l,h-pad.b);ctx.lineTo(w-pad.r,h-pad.b);ctx.stroke();
  label(ctx,"corrected count rate / s⁻¹",pad.l-12,pad.t+6,"#cfe8ff",11,"right");label(ctx,"1/r² / m⁻²",w-pad.r,h-14,"#cfe8ff",11,"right");
  if(!practicalData.length){$("#fitReadout").textContent="Collect at least 3 distances";return;}
  const maxX=Math.max(...practicalData.map(d=>d.inv))*1.12,maxY=Math.max(...practicalData.map(d=>d.corrected))*1.12;
  const px=d=>pad.l+(w-pad.l-pad.r)*d.inv/maxX,py=d=>h-pad.b-(h-pad.t-pad.b)*d.corrected/maxY;
  practicalData.forEach(d=>circle(ctx,px(d),py(d),5,"#ffe98a","#fff"));
  if(practicalData.length>=2){
    const sx=practicalData.reduce((a,d)=>a+d.inv,0),sy=practicalData.reduce((a,d)=>a+d.corrected,0),sxx=practicalData.reduce((a,d)=>a+d.inv*d.inv,0),sxy=practicalData.reduce((a,d)=>a+d.inv*d.corrected,0),n=practicalData.length;
    const m=(n*sxy-sx*sy)/(n*sxx-sx*sx||1),b=(sy-m*sx)/n;
    ctx.strokeStyle="#67c7ff";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(pad.l,h-pad.b-(h-pad.t-pad.b)*b/maxY);ctx.lineTo(w-pad.r,h-pad.b-(h-pad.t-pad.b)*(m*maxX+b)/maxY);ctx.stroke();
    const mean=sy/n,ssTot=practicalData.reduce((a,d)=>a+Math.pow(d.corrected-mean,2),0),ssRes=practicalData.reduce((a,d)=>a+Math.pow(d.corrected-(m*d.inv+b),2),0),r2=ssTot?1-ssRes/ssTot:1;
    $("#fitReadout").textContent="Linear fit R² ≈ "+clamp(r2,0,1).toFixed(3);
  } else $("#fitReadout").textContent="Collect at least 3 distances";
}

function renderQuiz(){
  const q=quiz[quizIndex];quizLocked=false;
  $("#quizProgress").textContent=(quizIndex+1)+" / "+quiz.length;$("#quizProgressFill").style.width=(100*(quizIndex+1)/quiz.length)+"%";
  $("#quizScore").textContent=quizScore;$("#quizStreak").textContent=quizStreak;$("#quizSpec").textContent="AQA "+q[0];$("#quizQuestion").textContent=q[1];
  $("#quizHint").classList.add("hidden");$("#quizHint").textContent=q[3]===undefined?"":q[4];$("#quizFeedback").className="feedback hidden";$("#nextQuestion").classList.add("hidden");
  $("#quizChoices").innerHTML=q[2].map((x,i)=>'<button class="choice-button" data-qans="'+i+'">'+x+'</button>').join("");
  $$("[data-qans]",$("#quizChoices")).forEach(b=>b.addEventListener("click",()=>answerQuiz(Number(b.dataset.qans))));
}
function answerQuiz(i){
  if(quizLocked)return;quizLocked=true;const q=quiz[quizIndex],ok=i===q[3];
  $$("[data-qans]",$("#quizChoices")).forEach((b,j)=>{b.disabled=true;if(j===q[3])b.classList.add("correct");if(j===i&&!ok)b.classList.add("wrong");});
  if(ok){quizScore++;quizStreak++;}else quizStreak=0;
  $("#quizScore").textContent=quizScore;$("#quizStreak").textContent=quizStreak;
  $("#quizFeedback").className="feedback "+(ok?"good":"bad");$("#quizFeedback").textContent=(ok?"Correct. ":"Not quite. ")+q[5];
  $("#nextQuestion").classList.remove("hidden");
}
$("#showHint").addEventListener("click",()=>$("#quizHint").classList.remove("hidden"));
$("#nextQuestion").addEventListener("click",()=>{quizIndex=(quizIndex+1)%quiz.length;renderQuiz();});
$("#restartQuiz").addEventListener("click",()=>{quizIndex=0;quizScore=0;quizStreak=0;renderQuiz();});

function renderSpec(){
  $("#specGrid").innerHTML=lessons.map((l,i)=>
    '<article class="spec-card"><div class="status"><span class="eyebrow">'+l.code+'</span><span class="status-dot '+(completed.has(l.code)?"done":"")+'"></span></div><h3>'+l.title+'</h3><p>'+l.lead+'</p><button class="button" data-spec-open="'+i+'">Open lesson</button></article>'
  ).join("");
  $$("[data-spec-open]").forEach(b=>b.addEventListener("click",()=>{activeLesson=Number(b.dataset.specOpen);renderCourse();showView("course");}));
}

window.addEventListener("resize",()=>{renderSim(performance.now());drawPracticalGraph();});
updateProgress();renderCourse();renderSpec();initFormula();updateDistanceUI();renderPracticalTable();renderQuiz();selectSim(0);requestAnimationFrame(animationLoop);
})();