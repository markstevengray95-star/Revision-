(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const DATA=window.FM_DATA||{lessons:[]};
const DEPTH={
 radians:{
  model:'Radians are most useful when angle is treated as a physical measure of arc travelled rather than as a separate geometry convention. Because θ=s/r, the same angular displacement can describe every point on a rigid rotating object even though the outer points travel farther. That is why angular quantities are ideal for describing rotating systems.',
  maths:'The chain s=rθ → v=ds/dt=r(dθ/dt)=rω explains why v=ωr. Likewise, one complete cycle gives Δθ=2π in time T, so ω=2π/T=2πf. Students should be comfortable moving between rpm, Hz, period, angular speed, arc length and tangential speed in multi-step problems.',
  exam:'A high-level answer should distinguish angular and linear quantities explicitly. Check radius rather than diameter, convert rpm before using ω=2πf, and keep radians for equations involving angular displacement. When asked to explain why two points have different speeds, connect the larger circumference directly to v=ωr.'
 },
 'centripetal-accel':{
  model:'Uniform circular motion has constant speed but continuously changing velocity because the direction of the tangent changes. Over a short time interval the change in velocity points approximately towards the centre, and in the limit this gives an inward acceleration perpendicular to the instantaneous velocity. That perpendicular acceleration redirects the motion without changing the speed.',
  maths:'The two useful forms are a=v²/r and a=ω²r. They appear to give different radius dependencies only because a different quantity is being held constant. At fixed v, increasing r makes the turn gentler and decreases a. At fixed ω, increasing r also increases v, so a increases with r. Always identify what is controlled before making proportionality statements.',
  exam:'Vector language matters. Velocity is tangential and acceleration is towards the centre. Avoid saying that an object moving at constant speed has no acceleration. For comparison questions, quote the relevant proportionality before giving the factor change, especially the square dependence on speed.'
 },
 'centripetal-force':{
  model:'Centripetal force is not an extra force; it is the name for the inward resultant of real interactions. Tension, friction, gravity, normal contact forces or components of these can provide the radial resultant. The correct approach is therefore to draw the real forces first and only then resolve them in the radial direction.',
  maths:'Newton’s second law gives ΣFradial=mv²/r=mω²r. In vertical circles the signs of weight and tension depend on position, so the same formula for the required inward resultant can lead to different force equations at the top, side and bottom. This is why a carefully chosen positive radial direction is so useful.',
  exam:'Marks are often lost by drawing a separate centripetal-force arrow in addition to the actual forces. Name the interaction that supplies the inward resultant, state the centre direction and then write the radial equation. In explanation questions, connect a larger speed to the v² dependence of the required resultant.'
 },
 'shm-condition':{
  model:'SHM is defined by the form of the restoring acceleration, not simply by repeated motion. The equilibrium position has zero resultant force. Moving away from equilibrium creates a restoring effect that grows in direct proportion to displacement and points back towards equilibrium, producing a=−ω²x.',
  maths:'An acceleration–displacement graph for ideal SHM is a straight line through the origin with gradient −ω². This gives an experimental route from data to ω and then T=2π/ω. The force form F=−mω²x shows that any system with a resultant restoring force proportional to −x behaves as SHM over the range where that linear relation is valid.',
  exam:'A complete definition must include both proportionality and direction. “Acceleration is proportional to displacement” is incomplete. Use the minus sign physically: positive x gives negative acceleration and vice versa. At equilibrium a=0; at ±A the magnitude of a is maximum.'
 },
 'shm-graphs':{
  model:'Displacement, velocity and acceleration describe the same oscillator from different viewpoints. Velocity is the instantaneous rate of change of displacement, while acceleration is the rate of change of velocity. The phase shifts are therefore consequences of differentiation rather than three unrelated graphs to memorise.',
  maths:'Starting from x=Acosωt gives v=−Aωsinωt and a=−Aω²cosωt=−ω²x. This makes the phase relationships explicit: x and a are π rad apart, while v is shifted by π/2 relative to x. The largest gradient of x occurs at equilibrium, which is why speed is greatest there.',
  exam:'When sketching linked graphs, mark quarter-cycle times and reason about signs. At +A, v=0 and a is maximally negative; at equilibrium travelling towards negative x, v is maximally negative and a=0. Graph-gradient questions often test understanding more reliably than recalled shapes.'
 },
 'shm-extremes':{
  model:'The oscillator’s maximum speed occurs at equilibrium because its stored potential-energy contribution has been converted most completely into kinetic energy. Maximum acceleration occurs at the turning points because the restoring displacement is largest there. Speed and acceleration therefore reach their maxima at different positions.',
  maths:'The key results vmax=ωA and amax=ω²A show different sensitivity to frequency. Doubling frequency doubles vmax but makes amax four times larger, provided amplitude is unchanged. The speed at a general displacement can also be related to the amplitude through v=ω√(A²−x²).',
  exam:'State position as well as magnitude. “Maximum speed is ωA” is stronger when paired with “at x=0”. For unfamiliar oscillators, identify A and ω first, then use the same SHM relationships. Check whether the question asks for speed or velocity because direction may matter.'
 },
 spring:{
  model:'For an ideal spring obeying Hooke’s law, displacement of the mass from equilibrium changes the spring force by an amount proportional to displacement. After accounting for the equilibrium stretch, the changing resultant is −kx, which matches the SHM condition and gives ω²=k/m.',
  maths:'From m a=−kx and a=−ω²x, ω=√(k/m) and T=2π√(m/k). Squaring gives T²=(4π²/k)m, so a T²–m graph should be linear. Its gradient provides k independently of the oscillation amplitude, making this a powerful practical analysis.',
  exam:'In RP7, time many oscillations and divide to reduce percentage timing uncertainty. Use a sensible mass range, avoid amplitudes that make the spring non-linear, repeat readings and plot T² against m. A non-zero intercept can indicate effective spring mass or a systematic offset.'
 },
 pendulum:{
  model:'A pendulum is only approximately SHM because the tangential restoring component is mg sinθ. For small angles measured in radians, sinθ≈θ and arc displacement x≈Lθ, turning the restoring acceleration into a quantity proportional to −x. At larger angles the approximation breaks down and the period becomes amplitude-dependent.',
  maths:'The small-angle result T=2π√(L/g) leads to T²=(4π²/g)L. A graph of T² against L should therefore be linear with gradient 4π²/g. This lets experimental data determine g and also gives a direct way to test the square-root length dependence.',
  exam:'State the small-angle condition when applying the period equation. In practical work measure length from the pivot to the centre of the bob, time multiple oscillations, use a small release angle and avoid giving the bob a push. Discuss reaction-time uncertainty and how longer total timing intervals reduce its percentage effect.'
 },
 'shm-energy':{
  model:'Ideal SHM continually transfers energy between kinetic and potential forms while total mechanical energy remains constant. At the turning points the oscillator is instantaneously at rest, so energy is entirely potential. At equilibrium the restoring potential contribution is minimum and kinetic energy is maximum.',
  maths:'For a spring oscillator Etotal=½kA², Ep=½kx² and Ek=½k(A²−x²). Both energy–displacement curves depend on squared displacement, so they are not sinusoidal in x. Against time, because x² contains a cos² term, energy exchanges twice per oscillation period.',
  exam:'Do not say energy disappears at equilibrium or at a turning point; it changes form. If damping is absent, the total stays constant. A larger amplitude has a strong effect because Etotal∝A², so doubling A gives four times the total mechanical energy.'
 },
 damping:{
  model:'Damping transfers mechanical energy from an oscillator to its surroundings, usually through resistive forces. Light damping allows several oscillations with decreasing amplitude. Critical damping returns the system to equilibrium in the shortest time without overshoot, while heavier damping returns more slowly without oscillating.',
  maths:'A useful model for light damping is an exponentially decaying amplitude envelope A=A0e^(−bt), so energy falls even faster because E∝A². The exact mathematical form is not usually the assessment target; the important physics is the relationship between energy loss, amplitude decay and response time.',
  exam:'Compare cases using both oscillation and return time. “More damping means faster return” is not always true: beyond critical damping, additional damping slows the return. Link applications to purpose—for example, suspension should settle rapidly rather than continue bouncing.'
 },
 resonance:{
  model:'A free oscillator vibrates at its natural frequency. A periodic driving force can transfer energy to it, and when the driving frequency is close to the natural frequency successive energy transfers reinforce the motion. This produces resonance and a large steady-state amplitude when damping is low.',
  maths:'A resonance curve plots response amplitude against driving frequency. Increasing damping lowers and broadens the peak and can shift the precise maximum slightly in more complete models. The area is less important at A-level than recognising natural frequency, peak response and the effect of damping on sharpness.',
  exam:'Explain resonance through efficient energy transfer rather than simply saying “frequencies are equal”. Include real examples such as bridges, vehicle suspension or stationary-wave systems. When discussing safety, explain how damping limits amplitude by removing energy from the oscillator.'
 },
 'internal-energy':{
  model:'Internal energy is microscopic: it is the sum of the randomly distributed kinetic energies and interaction-related potential energies of the particles. Temperature is linked to particle kinetic-energy distributions, but it is not the same quantity as internal energy because internal energy also depends on amount of substance and intermolecular configuration.',
  maths:'Energy can enter a system by heating or by work done on the system. During a temperature rise, the mean random kinetic-energy contribution typically increases. During a phase change at constant temperature, the potential-energy contribution changes while the mean kinetic-energy contribution remains approximately unchanged.',
  exam:'Use particle language precisely. Avoid saying that a substance “contains heat”; heating describes a transfer pathway. For phase changes, explain the constant temperature by separating kinetic and potential contributions to internal energy rather than claiming that no energy is being transferred.'
 },
 'specific-heat':{
  model:'Specific heat capacity measures the energy needed per kilogram for a one-kelvin temperature rise. Materials differ because supplied energy is distributed among microscopic degrees of freedom differently. The equation Q=mcΔT links a macroscopic temperature change to an energy transfer.',
  maths:'Electrical heating gives Q≈Pt=VIt, so c can be found from c=Pt/(mΔT). A temperature–time graph can also be analysed: if P and m are constant and heat loss is negligible, its gradient is P/(mc). A lower-than-ideal gradient signals energy transfer to the surroundings or apparatus.',
  exam:'Discuss systematic losses rather than just “human error”. Insulation, a lid, thermal paste, measuring the heater power directly and allowing sensors to equilibrate improve the method. Heat absorbed by the heater/container can make a calculated c too large if all supplied energy is incorrectly assigned to the sample.'
 },
 'continuous-flow':{
  model:'In steady continuous-flow heating, material enters, receives energy and leaves continuously. If the flow is steady, each second a mass ṁ passes through the heater. The power supplied must match the rate at which enthalpy-like thermal energy is added to the moving material in the simplified A-level model.',
  maths:'In time Δt, mass m=ṁΔt receives Q=mcΔT. Dividing by Δt gives P=ṁcΔT. Therefore ΔT=P/(ṁc): increasing flow rate gives less energy per kilogram and a smaller outlet temperature rise when power and c are fixed.',
  exam:'Be clear that ṁ is mass per unit time, not total mass. Check kg s⁻¹ rather than g s⁻¹. In practical evaluation, discuss heat loss, incomplete steady state, thermometer placement and uncertainty in measuring flow rate.'
 },
 'latent-heat':{
  model:'During a change of state, particles reorganise and their separation/interactions change. Energy is therefore changing the potential-energy contribution to internal energy rather than raising the mean random kinetic energy. That is why temperature can stay approximately constant while energy continues to enter.',
  maths:'Use Q=mcΔT for temperature change within one phase and Q=ml for a phase change. On a constant-power heating curve, sloping sections correspond to temperature rise while plateaus correspond to latent-energy transfer. The duration of a plateau is linked to ml/P for a fixed mass.',
  exam:'Identify the process before choosing an equation. Do not mix ΔT into a latent-heat calculation. For data-logger questions, use gradient, plateau duration and constant power to extract c or l, and comment on heat loss when real curves depart from ideal straight segments.'
 },
 'gas-laws':{
  model:'The empirical gas laws describe how macroscopic variables change for a fixed amount of gas under specified conditions. Boyle’s law links p and V at constant temperature, Charles’s law links V and absolute T at constant pressure, and the pressure law links p and T at constant volume.',
  maths:'Useful linear forms include p against 1/V for Boyle’s law and V against T(K) for Charles’s law. Combining the relationships gives pV/T=constant for a fixed amount of ideal gas. Celsius must not be used in proportional gas-law calculations because the proportionality is to absolute temperature.',
  exam:'Always state the controlled quantity. A graph that is straight but does not pass appropriately through the origin may indicate systematic error or non-ideal behaviour. Explain trends molecularly using collision rate and momentum transfer rather than vague statements about particles “wanting more space”.'
 },
 'absolute-zero':{
  model:'Absolute zero is the zero point of the thermodynamic temperature scale. In the ideal-gas model, extrapolating pressure or volume trends suggests that gas pressure/volume would reach zero near −273.15 °C, although real gases condense before this state is reached.',
  maths:'Kelvin temperature is related to Celsius by T/K=θ/°C+273.15. Ratios such as V1/T1=V2/T2 only make physical sense on an absolute scale because zero kelvin represents the limiting zero of the temperature variable used by the ideal-gas model.',
  exam:'Do not describe absolute zero as a temperature at which particles have “no energy” in every possible sense. Within this A-level ideal-gas context, link T to translational molecular kinetic energy and remember that extrapolation is a model-based inference rather than a direct gas measurement at 0 K.'
 },
 'ideal-gas-moles':{
  model:'The mole form pV=nRT links macroscopic state variables to amount of substance. R is the molar gas constant, so n must be in moles. The model works best when particles are sufficiently separated that their own volume and intermolecular interactions are negligible compared with the container scale and collision dynamics.',
  maths:'Use p in Pa, V in m³ and T in K when using R=8.31 J mol⁻¹ K⁻¹. Moles can be found from n=m/M using consistent mass units. Multi-step questions often require a conversion from mass to moles before the ideal-gas equation is used.',
  exam:'Unit conversion is a major discriminator: cm³ or dm³ must become m³, kPa must become Pa and Celsius must become kelvin. State assumptions if asked whether a real gas behaves ideally, especially at high pressure or low temperature.'
 },
 'ideal-gas-molecules':{
  model:'The particle form pV=NkT describes the same ideal-gas behaviour using the actual number of molecules N. Boltzmann’s constant k is the gas constant per particle. The bridge between the mole and molecular descriptions is N=nNA and R=NAk.',
  maths:'Use N=nNA or N=m/mmolecule. Molecular mass can be obtained from molar mass by dividing by NA, with careful conversion of grams per mole to kilograms per mole first. Substituting N=nNA and R=NAk demonstrates directly why pV=nRT and pV=NkT are equivalent.',
  exam:'Decide whether the question gives amount in moles or number of molecules before selecting R or k. Confusing N with n can produce answers wrong by a factor of Avogadro’s constant. Keep track of capital N for particle number and lower-case n for moles.'
 },
 'rp8-boyle':{
  model:'A Boyle’s-law investigation tests the inverse relationship between pressure and volume for a fixed mass of gas at constant temperature. The practical difficulty is that compression can temporarily heat the gas, so readings should be taken slowly and only after the gas returns to thermal equilibrium.',
  maths:'If pV=constant, a graph of p against 1/V should be linear. Alternatively, calculate pV for each reading and inspect its constancy within uncertainty. Pressure may need atmospheric-pressure correction if the instrument reports gauge rather than absolute pressure.',
  exam:'Evaluation should mention leaks, dead volume in tubing, finite scale resolution, temperature drift and reading parallax where relevant. Use a wide but safe range of volumes and repeat readings. Explain why taking data too quickly can systematically distort the relationship.'
 },
 'rp8-charles':{
  model:'Charles’s law investigates V∝T for a fixed mass of gas at constant pressure. A trapped gas sample is allowed to reach thermal equilibrium at different temperatures while its volume is measured. Constant external pressure is essential; otherwise volume changes cannot be attributed to temperature alone.',
  maths:'Plot V against T in kelvin for a direct proportionality test. A Celsius plot can be extrapolated towards the temperature at which the idealised volume would be zero, providing a route to estimating absolute zero. The extrapolation extends far outside the measured range and should therefore be treated cautiously.',
  exam:'Allow enough time for thermal equilibrium and measure the gas temperature rather than only the bath temperature if possible. Discuss scale resolution, pressure constancy, trapped-gas leaks and the uncertainty introduced by extrapolating far beyond the experimental data.'
 },
 'brownian-model':{
  model:'Brownian motion is the irregular motion of visible suspended particles caused by continual, uneven bombardment by much smaller molecules. The visible particle is not itself a single gas molecule; it acts as a tracer whose changing momentum provides indirect evidence for microscopic molecular motion.',
  maths:'At a higher temperature the molecular kinetic-energy scale is larger, so collision impulses tend to be more energetic. The tracer path remains random because impacts arrive from many directions with fluctuating net momentum. The model is qualitative, but it connects naturally to the kinetic-theory idea of momentum transfer at surfaces.',
  exam:'Do not say Brownian particles move because of convection unless convection is the experimental artefact being discussed. Link irregular direction changes to unequal molecular collisions. For gas pressure, extend the same idea to molecules colliding with container walls and changing momentum.'
 },
 'kinetic-assumptions':{
  model:'Kinetic theory connects microscopic collisions to macroscopic pressure. The idealised molecules move randomly, experience negligible intermolecular forces except during collisions, occupy negligible volume compared with the container and undergo elastic collisions. Pressure arises from repeated momentum changes at the walls.',
  maths:'For one molecule, the x-component of momentum reverses on an elastic wall collision, giving Δpx=2mcx. The time between successive collisions with the same wall depends on L/cx. Summing forces for many particles and using isotropic motion gives ⟨cx²⟩=⅓⟨c²⟩, producing pV=⅓Nm⟨c²⟩.',
  exam:'The factor 1/3 comes from three-dimensional isotropic motion, not from one third of molecules hitting a wall. Keep molecular mass m distinct from total gas mass. In derivations, show the momentum change and collision-time reasoning clearly before summing over molecules.'
 },
 'molecular-ke':{
  model:'Combining kinetic theory with the molecular ideal-gas equation links temperature directly to microscopic motion. Equating pV=⅓Nm⟨c²⟩ with pV=NkT gives ½m⟨c²⟩=3/2 kT, so absolute temperature measures the mean translational kinetic-energy scale per molecule.',
  maths:'The rms speed is crms=√⟨c²⟩=√(3kT/m). At the same temperature, molecules of different mass have the same mean translational kinetic energy but different rms speeds: lighter molecules move faster. For a monatomic ideal gas, U=3/2 NkT=3/2 nRT.',
  exam:'Do not claim all molecules have the same speed; the equation uses a mean of c². Distinguish mean kinetic energy from rms speed. Questions often combine molecular mass, k and T, so convert molecular mass to kilograms before using the rms-speed relationship.'
 }
};
function esc(s){return String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
function render(id){const d=DEPTH[id],book=$('.full-textbook[data-textbook-id="'+id+'"]');if(!d||!book||book.querySelector('.master-topic-v15'))return;const section=document.createElement('section');section.className='master-topic-v15';section.innerHTML='<div class="book-section-heading"><span class="eyebrow">Master the topic</span><h2>Deeper reasoning, maths and exam application</h2><p>Use this section after the core chapter to connect the ideas at full A-level depth.</p></div><div class="master-topic-grid"><article><span class="master-tag">Physical model</span><h3>Understand what is really happening</h3><p>'+esc(d.model)+'</p></article><article><span class="master-tag">Mathematical reasoning</span><h3>Connect the equations to the physics</h3><p>'+esc(d.maths)+'</p></article><article><span class="master-tag">Exam & practical thinking</span><h3>Turn understanding into marks</h3><p>'+esc(d.exam)+'</p></article></div><div class="master-topic-check"><strong>A* checkpoint:</strong> Explain the topic without looking at an equation first, then use the equation to justify the direction, proportionality or numerical relationship you described.</div>';const detail=$('.book-detail',book),eq=$('.book-equations',book);if(eq)eq.insertAdjacentElement('beforebegin',section);else if(detail)detail.insertAdjacentElement('afterend',section);else book.appendChild(section)}
function refresh(){const id=window.FM_APP?.getProgress?.().activeLesson;if(id)render(id)}
function boot(){refresh();const p=$('#lessonPanel');if(p)new MutationObserver(()=>setTimeout(refresh,10)).observe(p,{childList:true,subtree:true});document.addEventListener('click',e=>{if(e.target.matches?.('[data-chunk-button="2"]'))setTimeout(refresh,20)})}
window.FM_DEPTH_V15=DEPTH;if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();