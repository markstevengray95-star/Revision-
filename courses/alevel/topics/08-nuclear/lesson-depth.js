(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const D=[
{spec:"3.8.1 foundations",must:["A=Z+N and N=A−Z","isotopes have the same proton number but different neutron number","nuclear dimensions are of order 10⁻¹⁵ m while atoms are of order 10⁻¹⁰ m","almost all atomic mass is concentrated in the nucleus"],maths:["Rearrange A=Z+N accurately.","Use powers of ten and compare orders of magnitude."],traps:["Do not identify an isotope by nucleon number alone.","Do not confuse nucleon number with neutron number."],detail:[
"Protons determine the element because changing Z changes the nuclear charge and therefore the element identity. Neutrons alter the isotope and nuclear mass but not the element name.",
"Nuclide notation is a bookkeeping system for nuclear equations. Always check that both total nucleon number and total charge balance on the two sides of a decay or reaction equation.",
"Atomic and nuclear drawings are almost never to scale. A nucleus is roughly one hundred thousand times smaller in radius than an atom, yet contains nearly all of its mass."
]},
{spec:"3.8.1.1 Rutherford scattering",must:["most alpha particles pass through thin foil with little deflection","a small fraction are deflected and a very small fraction through large angles","large deflections require a strong repulsive electric interaction in a very small region","the evidence led to the nuclear model"],maths:["Connect force/momentum change qualitatively to deflection.","Relate smaller impact parameter and lower alpha energy to larger deflection."],traps:["Observation is not the same as inference.","Do not say electrons cause the large-angle deflections."],detail:[
"The key observations have different evidential weight. Straight-through paths show that most of the atom is empty space, while rare large-angle events reveal a concentrated region capable of producing a very large force.",
"Rutherford scattering changed the model because a diffuse positive charge could not account for the rare, very large changes in alpha-particle momentum. Concentrating positive charge and mass in a tiny nucleus explains those events.",
"Alpha particles and nuclei are both positively charged, so the interaction is repulsive. A closer encounter gives a stronger Coulomb force; a faster alpha particle is less strongly turned by the same target nucleus."
]},
{spec:"3.8.1.2 alpha, beta and gamma",must:["alpha is a helium nucleus with charge +2e","beta-minus is a fast electron with charge −e","gamma is electromagnetic radiation with no charge","identify radiation using penetration/absorption evidence","link penetration and ionisation to applications and hazards"],maths:["Interpret count-rate changes when absorbers are added.","Separate measured count rate from source type conclusions."],traps:["Gamma is attenuated rather than having one universal stopping thickness.","Do not claim one radiation type is always the most dangerous."],detail:[
"Alpha interacts strongly with matter and loses energy over a short distance, so it is strongly ionising but weakly penetrating. Beta has intermediate behaviour. Gamma interacts less often and is therefore more penetrating.",
"Identification is experimental: compare the detector response after adding suitable absorbers. The pattern of transmission, not the source label, is the evidence used to infer the radiation type.",
"Risk depends on where the radiation is relative to tissue, how long exposure lasts, activity, energy, shielding and distance. Strong ionisation can make internal alpha exposure significant even though alpha has low external penetration."
]},
{spec:"3.8.1.2 inverse-square law and RP12",must:["source intensity/count contribution follows approximately 1/r² for a point-like gamma source","measure and subtract background count rate","compare corrected count rate with 1/r²","recognise random counting scatter and model limitations","interpret a straight-line test of corrected count rate against 1/r²"],maths:["Corrected rate = measured rate − background rate.","Use I₂/I₁=(r₁/r₂)².","Calculate 1/r² and interpret graphs."],traps:["Do not apply the inverse-square law to uncorrected background-inclusive data.","Do not assume every data point lies exactly on the model line."],detail:[
"The inverse-square relationship comes from geometric spreading: the same emitted radiation is distributed over an area proportional to r², so intensity falls as 1/r² when source and detector geometry are suitable.",
"Background radiation is a real detector contribution from the environment and cosmic/natural sources. Measuring it separately allows the intended source contribution to be estimated more fairly.",
"A strong analysis uses several distances, corrected count rates and a graph against 1/r². Scatter is expected because counting is statistical; longer counting times and repeats reduce relative random uncertainty.",
"At very small separation the source and detector are not perfect points, so geometry can deviate from the ideal model. In this app the investigation is virtual and focuses on safe data analysis and interpretation."
]},
{spec:"3.8.1.2 applications and hazards",must:["explain thickness monitoring using attenuation","compare external and internal exposure","evaluate medical use through risk versus benefit","apply distance, time and shielding ideas conceptually"],maths:["Reason from detector count-rate changes.","Use proportional reasoning rather than unsupported claims."],traps:["A useful thickness source must give a measurable change, not simply maximum penetration.","Risk statements need context."],detail:[
"In a thickness monitor, radiation passes through material to a detector. If the sheet becomes thicker, attenuation increases and detector count rate falls; the source is chosen so changes in thickness produce detectable changes.",
"Radiation hazard is about ionising energy deposited in tissue, not just the radiation name. Activity, exposure time, energy, distance, shielding and whether radioactive material is inside the body all change the risk.",
"In medicine, radiation can provide information or damage target tissue. A strong answer links the useful physical property to the medical purpose and then weighs that benefit against the biological risk of ionisation."
]},
{spec:"3.8.1.3 random decay and activity",must:["individual nuclear decay is random","a given nuclide has constant decay probability per unit time","activity is decay rate measured in Bq","A=λN","larger λ means faster decay for a given N"],maths:["A=λN.","Track units: λ is an inverse-time quantity and 1 Bq = 1 s⁻¹ decay rate."],traps:["A nucleus does not become more likely to decay simply because it is old.","Activity is not the same as detector count rate."],detail:[
"Random decay means the exact nucleus and decay time cannot be predicted. The statistical model becomes predictable for a large population because each undecayed nucleus follows the same constant probability rule.",
"Activity is the number of decays per second in the source. A detector may record fewer events than the source produces, so measured count rate and source activity are related but not identical quantities.",
"The decay constant λ describes the probability rate of decay for the nuclide. For the same number of nuclei, a larger λ gives a larger activity and a shorter half-life."
]},
{spec:"3.8.1.3 exponential decay and half-life",must:["N=N₀e^(−λt) and A=A₀e^(−λt)","T½=ln2/λ","determine half-life from decay curves","use ln A = ln A₀ − λt so gradient = −λ","apply decay to dating and waste-storage timescales"],maths:["Exponential calculations and natural logarithms.","Find gradient of ln(activity) against time.","Convert time units consistently."],traps:["Half-life is a statistical timescale, not a fixed lifetime of each nucleus.","Do not mix seconds and minutes when using λ."],detail:[
"The exponential law follows from the fact that the decay rate is proportional to the number of undecayed nuclei remaining. As N falls, the absolute number of decays per second also falls.",
"Half-life gives the time for N or A to halve on average. After n half-lives the expected fraction remaining is (1/2)^n, and T½ is inversely related to the decay constant.",
"Taking natural logarithms turns the exponential relationship into a straight line: ln A = ln A₀ − λt. The gradient gives −λ, which can then be converted to half-life. The same mathematics underpins radioactive dating and predictions about how waste activity changes over time."
]},
{spec:"3.8.1.3 molar mass and Avogadro calculations",must:["n=m/M","N=nN_A","A=λN","combine half-life, decay constant and exponential decay with sample amount","use consistent units through multi-stage calculations"],maths:["Mass → moles → nuclei → activity.","Use N_A≈6.02×10²³ mol⁻¹.","Apply significant figures sensibly."],traps:["Use molar mass in units compatible with sample mass.","Do not substitute half-life directly into A=λN."],detail:[
"A macroscopic radioactive sample contains an enormous number of nuclei. Molar mass and the Avogadro constant provide the bridge from a measured sample mass to the number of radioactive nuclei.",
"The calculation chain is usually n=m/M, then N=nN_A. If activity is required, obtain λ from half-life when necessary and use A=λN.",
"For an aged sample, include exponential decay as well: find the initial number or activity, apply e^(−λt), then report the current value with units. Writing the chain before entering numbers reduces calculator errors."
]},
{spec:"3.8.1.4 nuclear instability",must:["interpret an N against Z stability graph","alpha: A−4, Z−2","beta-minus: A unchanged, Z+1","beta-plus/electron capture: A unchanged, Z−1","gamma changes energy state but not A or Z","balance simple nuclear equations"],maths:["Track changes in N, Z and A.","Check conservation of nucleon number and charge."],traps:["Heavy stable nuclei do not generally have N=Z.","Gamma emission does not move a nuclide on an N–Z graph."],detail:[
"Stable nuclides form a band rather than a single N=Z line. Heavier stable nuclei generally require proportionally more neutrons because nuclear and electrostatic effects change with size.",
"Alpha decay removes two protons and two neutrons. Beta-minus converts a neutron to a proton; beta-plus and electron capture convert a proton to a neutron. These transformations determine movement on an N–Z graph.",
"Gamma emission is different: it is a change of nuclear energy state. The nucleus keeps the same numbers of protons and neutrons, so A and Z remain unchanged."
]},
{spec:"3.8.1.4 excited nuclei and gamma levels",must:["nuclei have discrete excited energy states","gamma emission occurs when a nucleus moves to a lower energy state","photon energy equals level spacing: ΔE=hf","read nuclear energy-level diagrams","know technetium-99m as a diagnostic gamma-source example"],maths:["Convert keV/MeV to joules when using h in SI.","Use f=ΔE/h."],traps:["Nuclear gamma transitions are not electron-shell transitions.","Gamma emission leaves A and Z unchanged."],detail:[
"A nucleus can store excitation energy in discrete nuclear states. A downward transition can emit a gamma photon whose energy is exactly the difference between the two nuclear levels.",
"Energy-level diagrams encode the allowed nuclear states and possible transitions. Larger vertical spacing means a higher-energy, higher-frequency gamma photon.",
"Technetium-99m is an important A-level example because a metastable nuclear state can emit gamma radiation that can be detected externally. The examinable physics is the excited state, transition and detectability, not clinical procedure."
]},
{spec:"3.8.1.5 closest approach",must:["use Coulomb repulsion for a head-on alpha–nucleus approach","at ideal closest approach the alpha's instantaneous kinetic energy is zero","set initial kinetic energy equal to electrostatic potential energy","interpret how E and Z affect r","use the result as a nuclear-size estimate"],maths:["E_k = k(2e)(Ze)/r.","Convert MeV to joules when using SI Coulomb constants.","Work with femtometres and powers of ten."],traps:["Keep both the +2e alpha charge and +Ze nuclear charge.","This is a simplified head-on model, not a full scattering calculation."],detail:[
"In the head-on model, the positively charged alpha particle slows as it approaches the positive nucleus because kinetic energy is converted into electrostatic potential energy.",
"At the turning point, the alpha's instantaneous kinetic energy is taken as zero, so the initial kinetic energy equals the Coulomb potential-energy increase. Rearranging this gives the closest-approach distance.",
"Greater alpha kinetic energy lets the particle approach more closely, while a larger nuclear charge increases repulsion. The result gives an upper-bound style estimate of nuclear-scale distance under the model assumptions."
]},
{spec:"3.8.1.5 electron diffraction",must:["electrons have de Broglie wavelength λ=h/p","high momentum gives a wavelength comparable with nuclear dimensions","nuclear scattering/diffraction produces an intensity-against-angle pattern","features such as minima depend on nuclear radius","use supplied diffraction relationships/data to infer R"],maths:["Use λ=h/p when needed.","Interpret intensity-angle graphs and angular minima."],traps:["Do not describe electron diffraction as classical alpha scattering.","For fixed wavelength, larger nuclear size gives narrower angular features."],detail:[
"High-energy electrons can probe nuclei because their de Broglie wavelength can be comparable to nuclear dimensions. When the wavelength is sufficiently short, the scattering pattern contains information about nuclear size.",
"The intensity pattern has maxima and minima produced by wave interference. The angular scale depends on the ratio of wavelength to nuclear radius, so changing R shifts the positions of the minima.",
"Exam questions often provide the precise relationship needed for a radius calculation. Students should be able to read an intensity-against-angle graph, identify a feature such as the first minimum and use it with the supplied model."
]},
{spec:"3.8.1.5 radius law and density",must:["R=r₀A^(1/3)","typical nuclear radii are a few femtometres","V=4πR³/3","nuclear mass is approximately Au","R³∝A implies approximately constant nuclear density"],maths:["Cube-root scaling.","Sphere volume.","ρ=m/V and order-of-magnitude estimates."],traps:["Radius is not proportional to A.","Use SI units when calculating density."],detail:[
"Experimental data show that nuclear radius grows as the cube root of nucleon number. This means a large increase in A produces a much smaller fractional increase in radius.",
"Because nuclear volume is proportional to R³, the radius law implies V∝A. Nuclear mass is also approximately proportional to A because each nucleon has roughly one atomic mass unit of mass.",
"Taking mass divided by volume therefore gives an approximately constant nuclear density across different nuclei. This is strong evidence that nuclear material has a broadly similar packing density."
]},
{spec:"3.8.1.6 mass defect and binding energy",must:["bound-nucleus mass is less than the total mass of separated nucleons","mass defect Δm corresponds to binding energy","ΔE=Δmc²","1 u corresponds to 931.5 MeV","binding energy per nucleon compares nuclear stability"],maths:["Convert u ↔ MeV.","Calculate mass defect carefully from supplied masses.","Divide total binding energy by A."],traps:["Mass defect is an energy difference expressed through mass-energy equivalence, not missing matter.","Do not confuse total binding energy with binding energy per nucleon."],detail:[
"When nucleons bind, the total bound system has lower energy than the same nucleons separated. Because energy contributes to mass, the bound nucleus also has a lower mass.",
"The mass difference is the mass defect. Multiplying by c² gives the binding energy: the energy required to separate the nucleus completely into free nucleons.",
"The atomic mass unit is convenient because 1 u corresponds to 931.5 MeV. Binding energy per nucleon divides the total by A and allows meaningful comparison between nuclei of very different size."
]},
{spec:"3.8.1.6 binding-energy curve, fusion and fission",must:["know the shape of average binding energy per nucleon against A","light nuclei can release energy by fusion","very heavy nuclei can release energy by fission","energy release corresponds to increased total binding/lower final mass","calculate reaction energy from mass difference"],maths:["Q=(initial mass−final mass)c².","Use u-to-MeV conversion where appropriate.","Interpret a binding-energy curve qualitatively and quantitatively."],traps:["The curve predicts the direction of energy release, not the exact energy without mass data.","Use initial minus final mass consistently for released energy."],detail:[
"Average binding energy per nucleon rises rapidly for light nuclei, reaches a broad maximum for medium-mass nuclei and then falls gradually for very heavy nuclei.",
"Fusion can release energy when light nuclei combine into products with greater binding energy per nucleon. Fission can release energy when a heavy nucleus splits into medium-mass products that are more tightly bound.",
"For a specific reaction, exact energy release comes from the difference between total initial and final mass-energy. The binding-energy curve explains why the process can be energetically favourable."
]},
{spec:"3.8.1.7 induced fission",must:["thermal-neutron absorption can induce fission in a suitable fissile nucleus","fission releases additional neutrons","a chain reaction depends on neutron production versus losses","critical mass is a qualitative condition for a self-sustaining chain","fission-product kinetic energy becomes thermal energy"],maths:["Reason generation-by-generation using ratios qualitatively.","Link energy release to kinetic energy and heating."],traps:["Keep critical-mass discussion qualitative for this course.","Do not confuse neutron moderation with neutron absorption."],detail:[
"A suitable heavy nucleus can absorb a neutron and become unstable, then split into smaller nuclei while releasing energy and more neutrons. Those neutrons may trigger later fissions.",
"A chain reaction is controlled by the balance between neutrons that cause further fission and neutrons lost by escape or non-fission absorption. If each generation produces too few useful neutrons, the chain dies away.",
"Critical mass describes the qualitative condition under which neutron losses can be balanced sufficiently for a self-sustaining chain. The energy ultimately appears largely as kinetic energy of fission products and then as thermal energy in surrounding material."
]},
{spec:"3.8.1.7 thermal reactor systems",must:["moderator slows fast neutrons","control rods absorb neutrons","coolant transfers thermal energy","simple elastic-collision model explains moderation","material choice depends on neutron and thermal properties","know suitable examples of moderator/control/coolant materials"],maths:["Use conservation/collision reasoning qualitatively for neutron moderation.","Distinguish neutron-population control from heat transfer."],traps:["Control rods do not primarily slow neutrons.","Coolant does not primarily control the neutron chain."],detail:[
"Fresh fission neutrons are fast. In a thermal reactor, the moderator reduces neutron kinetic energy through collisions so the neutron population is better matched to the intended fission process.",
"A simple mechanical model explains why relative mass matters: energy transfer in collisions is more effective when the moderator nucleus is not vastly heavier than the neutron. A moderator should also avoid excessive neutron absorption.",
"Control rods regulate the neutron population by absorption. Coolant has a different job: transfer thermal energy away from the core. Material choices therefore depend on different combinations of neutron absorption, collision efficiency, thermal behaviour and chemical/engineering suitability."
]},
{spec:"3.8.1.8 nuclear safety, fuel and waste",must:["know a fissile fuel example such as uranium containing U-235","remote handling and shielding reduce exposure","emergency shutdown reduces sustained neutron multiplication","radioactive waste is produced, handled and stored","half-life/activity affect waste timescales","evaluate nuclear power through balanced risk and benefit"],maths:["Connect activity and half-life to how hazard changes with time.","Use evidence rather than unsupported statements in evaluation."],traps:["Shielding does not change half-life.","A long half-life does not automatically mean a high activity."],detail:[
"Nuclear-power safety uses several independent controls because the hazards are different. Shielding attenuates radiation, remote handling increases separation from radioactive material and shutdown systems reduce sustained neutron multiplication.",
"Radioactive waste contains radionuclides with different activities and half-lives. Management therefore has to contain the material and account for how its activity changes over time.",
"A balanced evaluation distinguishes likelihood from consequence and considers high energy density/reliable generation alongside radioactive waste, accident consequences, engineering controls and wider environmental/economic context."
]},
{spec:"3.8 synoptic mastery",must:["choose the correct model before calculating","link evidence to inference","combine multi-stage nuclear calculations","analyse unfamiliar graphs/data","state assumptions and limitations","write complete explain/evaluate answers"],maths:["Mass→moles→nuclei→activity.","Half-life→λ→exponential decay.","Mass difference→energy→binding/reaction energy.","Use gradients, proportionality and uncertainty when data are supplied."],traps:["Do not combine equations from unrelated models.","An answer can be numerically correct but physically incomplete if assumptions/units are missing."],detail:[
"Synoptic nuclear physics is mostly about model choice. Scattering, diffraction, exponential decay, mass-energy and neutron-balance models answer different questions and rely on different assumptions.",
"For calculations, plan the chain before substituting numbers. This makes unit conversions visible and prevents using an equation before the required intermediate quantity has been found.",
"For unfamiliar data, first describe what the evidence shows, then identify the model/equation, quantify the relationship where possible and finally discuss limitations. Strong extended answers use precise causal links rather than isolated keywords.",
"Across the topic, experimental evidence supports models of nuclear structure and size; probability models describe decay; energy-level and mass-energy models explain gamma emission and binding; neutron-balance/collision models explain reactor behaviour.",
"At A* level, students should be able to move between microscopic nuclear events, measurable macroscopic data and the assumptions that connect them, then judge whether evidence supports the proposed model."
]}
];
function course(){return window.NuclearCourse}
function activeIndex(){try{return course()?.lessonIndex()||0}catch{return 0}}
function addDepth(){
 const root=$("#interactiveLessonWorkspace");if(!root)return;
 const panel=$('[data-il-panel="learn"]',root);if(!panel)return;
 const i=activeIndex(),data=D[i];if(!data)return;
 const page=Number(panel.dataset.page||0),existing=$("#lessonDepthPanel",panel);
 if(existing&&existing.dataset.lesson===String(i)&&existing.dataset.page===String(page))return;
 if(existing)existing.remove();
 const box=document.createElement("section");box.id="lessonDepthPanel";box.className="ld-depth";box.dataset.lesson=String(i);box.dataset.page=String(page);
 const detail=data.detail[Math.min(page,data.detail.length-1)]||"";
 box.innerHTML='<div class="ld-title"><div><span class="eyebrow">Full-spec teaching</span><h4>Deepen this knowledge</h4></div><span class="ld-spec">'+esc(data.spec)+'</span></div>'+
 '<p class="ld-explain">'+esc(detail)+'</p>'+
 '<div class="ld-grid"><div><strong>You must know</strong><ul>'+data.must.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div><div><strong>Maths / data skills</strong><ul>'+data.maths.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul><strong>Exam traps</strong><ul>'+data.traps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></div></div>'+
 '<div class="ld-check"><strong>Can you explain this without notes?</strong><textarea id="ldRecall" placeholder="Summarise the idea in your own words, including the key physics."></textarea><div class="ld-actions"><button type="button" id="ldCompare">Compare with core points</button></div><div id="ldFeedback"></div></div>';
 const intro=$(".il-lesson-intro",panel);if(intro)intro.insertAdjacentElement("afterend",box);else panel.prepend(box);
 $("#ldCompare",box).onclick=()=>{
   const ans=$("#ldRecall",box).value.trim().toLowerCase(),terms=data.must.flatMap(x=>x.toLowerCase().split(/[^a-z0-9λ]+/).filter(w=>w.length>4)).filter((x,n,a)=>a.indexOf(x)===n).slice(0,12);
   const hits=terms.filter(t=>ans.includes(t)).length;
   $("#ldFeedback",box).innerHTML='<div class="ld-feedback '+(ans.length>=45&&hits>=2?"good":"review")+'"><strong>'+(ans.length>=45&&hits>=2?"Good retrieval attempt":"Develop the explanation")+'</strong><p>'+(ans.length<45?"Write a fuller explanation. ":"")+(hits<2?"Use more of the lesson-specific physics vocabulary. ":"")+'Then compare your answer with the must-know list above.</p></div>';
 };
}
let timer=null;
function schedule(){clearTimeout(timer);timer=setTimeout(addDepth,40)}
document.addEventListener("click",e=>{if(e.target.closest("[data-il-tab='learn'],#ilNext,#ilPrev,[data-lesson],#seqNext,#seqPrevious"))schedule()},true);
const obs=new MutationObserver(ms=>{if(ms.some(m=>m.type==="childList"))schedule()});
const start=()=>{const root=$("#seqRoot");if(root)obs.observe(root,{childList:true,subtree:true});schedule()};
setTimeout(start,180);
window.NuclearLessonDepth=D;
})();