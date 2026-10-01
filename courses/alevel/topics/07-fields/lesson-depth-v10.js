(()=>{'use strict';
const D=window.FIELD_LAB||{}, $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)], panel=$('#lessonPanel');
if(!panel||!D.lessons)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const chapters={
'Fields: the unifying idea':{
 title:'A field is a model of influence in space',
 core:['A force field assigns a vector quantity to every point in space. The field belongs to the source arrangement; adding a small test object reveals the field but does not create it.','Gravitational field direction is defined by the force on a small positive mass. Electric field direction is defined by the force on a positive test charge. Magnetic fields require moving charge/current before a force is produced.','For point sources, gravitational and electrostatic force laws share inverse-square geometry. This is why both are represented using radial field lines, field strength and potential.'],
 math:['Inverse-square means multiplying distance by n divides the field magnitude by n².','Superposition means adding vector fields component-by-component but adding scalar potentials algebraically.','Equipotential surfaces are always perpendicular to the field direction in electrostatic and gravitational examples.'],
 example:'If a point-source field strength is 36 N kg⁻¹ at r, at 3r it is 36/9 = 4 N kg⁻¹.',
 graphs:'Compare a 1/r² field-strength curve with a 1/r potential curve. The field falls more rapidly with distance.',
 exam:'Do not say “field lines are paths”. They are a graphical representation showing vector direction and relative strength.',
 stretch:'Explain how two equal and opposite electric charges can give V = 0 at the midpoint while E is not zero.'},
"Newton's law and gravitational field strength":{
 title:'From universal gravitation to g',
 core:['Newtonian gravitation treats any two point masses as mutually attracting. For a spherically symmetric body, points outside the body behave as if all mass were concentrated at the centre.','Gravitational field strength g is force per unit mass. It is independent of the chosen test mass because the test mass cancels when F = GMm/r² is divided by m.','The vector field is radial and inward. At a planet surface, r is the planet radius, not altitude above the surface.'],
 math:['F = GMm/r² and g = F/m combine to give g = GM/r².','Units N kg⁻¹ and m s⁻² are equivalent because 1 N = 1 kg m s⁻².','For constant density, M ∝ R³, therefore surface g = GM/R² implies g ∝ R.'],
 example:'For Earth-like M = 5.97×10²⁴ kg and r = 7.0×10⁶ m, g ≈ 8.13 N kg⁻¹.',
 graphs:'A plot of g against r outside a spherical mass has inverse-square curvature. Doubling r gives one quarter of g.',
 exam:'AQA questions often hide the centre distance inside “height above the surface”; add the radius before substituting.',
 stretch:'Derive how the surface value of g changes for two planets with equal density but different radii.'},
'Gravitational potential and equipotentials':{
 title:'Potential links work, energy and field strength',
 core:['Gravitational potential is work done per unit mass in bringing a small mass from infinity to a point. The zero is chosen at infinity.','Potential is negative because a mass in a bound position has less energy than it would at infinity; positive work must be supplied to remove it completely.','Potential is scalar. A change in potential gives the change in potential energy per unit mass, so ΔEp = mΔV.'],
 math:['For a spherical source V = −GM/r.','The field is related to the spatial gradient of potential: g = −dV/dr in one-dimensional radial form.','The potential difference between two radii is linked to the area under a g–r graph, with sign handled consistently.'],
 example:'A 2.0 kg satellite moving from −30 MJ kg⁻¹ to −20 MJ kg⁻¹ gains 20 MJ of gravitational potential energy.',
 graphs:'V approaches zero from below as r increases; g magnitude is positive on a magnitude graph and falls as 1/r².',
 exam:'Do not confuse “higher potential” with “larger negative number”. −20 MJ kg⁻¹ is higher than −30 MJ kg⁻¹.',
 stretch:'Use the gradient idea to explain why the V–r curve is steep near the planet and flatter far away.'},
'Circular orbits: speed, period and energy':{
 title:'Orbiting objects are continually falling',
 core:['A circular orbit occurs when gravity supplies exactly the inward resultant force required for circular motion. There is no extra centripetal force.','The satellite mass cancels, so orbital speed at a given radius depends on the central mass and orbital radius rather than the satellite mass.','A larger circular orbit has lower speed but a longer period and a less negative total energy.'],
 math:['Set GMm/r² = mv²/r to obtain v = √(GM/r).','Using v = 2πr/T gives T² = 4π²r³/(GM).','For a circular orbit Ek = GMm/(2r), Ep = −GMm/r and Etot = −GMm/(2r).'],
 example:'At r = 7.0×10⁶ m around Earth, v ≈ 7.55 km s⁻¹ and the period is about 97 min.',
 graphs:'T² against r³ is linear for bodies orbiting the same central mass; the gradient is 4π²/(GM).',
 exam:'If asked why speed falls as radius rises, link the equation to the weaker field and smaller centripetal acceleration required.',
 stretch:'Explain why energy must be supplied to reach a higher circular orbit even though the final orbital speed is smaller.'},
'Escape velocity and synchronous satellites':{
 title:'Escape is an energy threshold, not a fixed height',
 core:['Minimum escape speed is the launch speed that allows an object to reach infinity with zero final kinetic energy in the ideal model.','Synchronous only means matching the rotation period. Geostationary requires the correct period plus a circular equatorial orbit in the same rotational direction.','Low-Earth orbit gives short periods and small signal distances; geostationary orbit gives fixed apparent position but a much longer signal path.'],
 math:['Conservation of energy gives ½mv² = GMm/R and therefore vescape = √(2GM/R).','At the same radius vescape = √2 vcircular.','The geostationary radius follows from T² = 4π²r³/(GM) using Earth’s rotational period.'],
 example:'If circular orbital speed at a radius is 7.8 km s⁻¹, escape speed there is about 11.0 km s⁻¹.',
 graphs:'Plot circular and escape speed against r. Both decrease with radius, while escape speed remains √2 times larger at the same r.',
 exam:'State all geostationary conditions; “24-hour period” on its own is incomplete.',
 stretch:'Compare LEO and geostationary satellites for imaging, communications, latency and ground tracking.'},
"Coulomb's law":{
 title:'Electrostatic force: inverse-square with sign',
 core:['Coulomb’s law gives the magnitude of the force between point charges. Outside a spherically symmetric charge distribution, the charge can be treated as concentrated at the centre.','The sign of the charges determines whether the force is attractive or repulsive; the magnitude itself is positive.','At A-level, air is normally treated as vacuum unless a dielectric is explicitly introduced.'],
 math:['F = Qq/(4πε₀r²) = kQq/r² in magnitude.','Doubling one charge doubles F; doubling both charges multiplies F by four; doubling r divides F by four.','The ratio of electrostatic to gravitational force between the same two particles is independent of r because both laws contain 1/r².'],
 example:'For +2.0 nC and +3.0 nC at 0.10 m, F ≈ 5.39 μN and the force is repulsive.',
 graphs:'F against r has inverse-square curvature; a log-log plot would have gradient −2.',
 exam:'Calculate the magnitude first, then state attraction or repulsion separately.',
 stretch:'Show why electrostatic force dominates gravitational force between an electron and proton at atomic scales.'},
'Electric field strength: uniform and radial':{
 title:'Field strength predicts force and particle motion',
 core:['Electric field strength is force per unit positive charge. In a radial field, direction is away from a positive source and toward a negative source.','Between large parallel plates away from edges, the field is approximately uniform. This lets E = V/d be used.','A charged particle entering a uniform electric field sideways has constant acceleration in the field direction and constant velocity perpendicular to it, giving a parabolic path.'],
 math:['E = F/Q, E = V/d for a uniform field, and E = Q/(4πε₀r²) for a radial point-source field.','For a particle of charge q and mass m, a = qE/m in a uniform field.','The uniform-field derivation follows W = Fd, V = W/q and F = Eq.'],
 example:'800 V across 4.0 cm gives E = 2.0×10⁴ V m⁻¹ = 2.0×10⁴ N C⁻¹.',
 graphs:'Uniform field: V changes linearly with distance. Radial field: E follows 1/r² and V follows 1/r.',
 exam:'E = V/d is not a general electric-field equation; use it only for an approximately uniform field.',
 stretch:'Derive the trajectory equation for a charged particle crossing a uniform field using constant-acceleration mechanics.'},
'Electric potential and equipotentials':{
 title:'Potential, potential energy and field are different quantities',
 core:['Electric potential is work done per unit positive charge in moving from infinity to a point. Potential energy of a particle is qV.','Potential is scalar while field strength is vector. This difference is crucial in multi-charge configurations.','No work is done moving a charge along an equipotential because the potential difference is zero.'],
 math:['For a point charge V = Q/(4πε₀r).','Potential-energy change is ΔE = qΔV.','Field is related to the negative gradient of potential: E = −dV/dr along one dimension.'],
 example:'A +2.0 nC charge moving through +300 V gains 6.0×10⁻⁷ J of potential energy; a negative charge would change energy with the opposite sign.',
 graphs:'For a negative point charge V is negative and approaches zero from below, while the field points inward.',
 exam:'Keep the sign of q when using ΔE = qΔV. It determines whether the particle gains or loses potential energy.',
 stretch:'Construct an arrangement where V = 0 at a point but E ≠ 0 and justify both results.'},
'Capacitance and parallel plates':{
 title:'Capacitance is set by geometry and dielectric response',
 core:['Capacitance is charge stored per unit potential difference. For an ideal capacitor, changing Q and V along Q = CV does not change C unless the construction changes.','For parallel plates, greater area allows more separated charge, while greater separation weakens the coupling between plates and reduces capacitance.','A dielectric polarises in the field. Bound charges partly oppose the field due to the free charges, so more free charge can be stored at the same pd.'],
 math:['C = Q/V and for ideal parallel plates C = ε₀εrA/d.','With a fixed-voltage supply, inserting a dielectric increases C and therefore Q = CV.','With the capacitor isolated, Q stays constant, so increasing C reduces V.'],
 example:'Doubling A while keeping d and εr unchanged doubles capacitance.',
 graphs:'Q against V is a straight line through the origin for a fixed capacitor; its gradient is C.',
 exam:'Always identify whether the capacitor remains connected to a supply or is isolated before predicting Q and V changes.',
 stretch:'Explain energy changes when a dielectric is inserted under fixed-V and fixed-Q conditions.'},
'Energy stored in a capacitor':{
 title:'Stored energy is the accumulated work of charging',
 core:['When a capacitor charges, the pd is not equal to its final value throughout the process. Early charge is moved at low pd; later charge requires more work per coulomb.','For an ideal linear Q–V relation the average pd during charging is V/2, giving E = ½QV.','The same result is the triangular area under a V–Q graph.'],
 math:['E = ½QV = ½CV² = Q²/(2C).','At fixed C, energy ∝ V². Doubling V quadruples stored energy.','At fixed Q, increasing C reduces stored energy according to E = Q²/(2C).'],
 example:'A 470 μF capacitor at 6.0 V stores 8.46 mJ.',
 graphs:'Area under a V–Q graph gives energy transferred to the capacitor.',
 exam:'Choose the energy equation that matches the quantities given rather than rearranging unnecessarily.',
 stretch:'Explain where the “missing” energy goes when a charged capacitor is connected to an identical uncharged capacitor.'},
'Capacitor charge/discharge and time constant':{
 title:'RC circuits are exponential systems',
 core:['During discharge, Q, V and current magnitude fall exponentially. During charging, Q and capacitor voltage rise asymptotically while current falls.','The time constant τ = RC sets the characteristic time scale. After one τ in discharge, about 36.8% remains.','Required Practical 9 uses a log-linear transformation so experimental data can produce a straight line and a reliable value of RC.'],
 math:['Discharge: V = V₀e^(−t/RC), Q = Q₀e^(−t/RC), I = I₀e^(−t/RC).','Taking logs gives ln(V/V₀) = −t/RC, so gradient = −1/RC.','Half-time t½ = RC ln2, which is not equal to RC.'],
 example:'R = 4.7 kΩ and C = 470 μF gives τ ≈ 2.21 s and t½ ≈ 1.53 s.',
 graphs:'Recognise exponential curves and the straight-line transformed graph. Use gradient and uncertainty from a best-fit line.',
 exam:'Do not call τ the half-life. State what fraction remains after one time constant.',
 stretch:'Predict what happens if R doubles and C halves: τ stays constant but initial current and stored charge scales change.'},
'Magnetic flux density and force on a wire':{
 title:'Magnetic force provides a measurable definition of B',
 core:['A current-carrying wire in a magnetic field experiences a force when the current is not parallel to the field. The perpendicular case gives the maximum force.','Direction can be found using Fleming’s left-hand rule for conventional current. Reversing current or field reverses force.','Required Practical 10 uses a top-pan balance to measure the equal-and-opposite force on the magnet system.'],
 math:['For perpendicular geometry F = BIL.','On a graph of F against I with B and L fixed, gradient = BL.','Balance mass change Δm converts to force using F = Δmg.'],
 example:'B = 0.25 T, I = 2.0 A and L = 0.080 m gives F = 0.040 N.',
 graphs:'F–I, F–B and F–L should be linear through the origin when other variables are controlled.',
 exam:'Use only the wire length actually inside the uniform magnetic field region.',
 stretch:'Explain how a non-zero intercept in an RP10 graph could arise and how to test whether it is significant.'},
'Moving charges and circular paths':{
 title:'Magnetic force bends trajectories without changing speed',
 core:['A charge moving perpendicular to B experiences a force perpendicular to its velocity. This changes direction but does no work, so speed and kinetic energy stay constant.','The magnetic force can supply the centripetal force needed for circular motion.','If velocity has a component parallel to B as well as a perpendicular component, the motion becomes helical.'],
 math:['BQv = mv²/r gives r = mv/(BQ) using charge magnitude.','Radius increases with momentum and decreases with B or |Q|.','The cyclotron exploits repeated magnetic bending with electric acceleration across a gap.'],
 example:'Doubling B at fixed m, v and Q halves the circular radius.',
 graphs:'r against 1/B is linear at fixed momentum and charge.',
 exam:'Use charge magnitude for radius; use the sign only to determine curvature direction.',
 stretch:'Resolve velocity into parallel and perpendicular components to derive the pitch of a helical path.'},
'Magnetic flux and flux linkage':{
 title:'Flux measures field passing through an area',
 core:['Magnetic flux depends on the component of B normal to an area. For a multi-turn coil, flux linkage is N times the flux through one turn.','The angle in BANcosθ is between the field direction and the normal to the coil, not the plane of the coil.','Required Practical 11 links this geometry to measurements made with a search coil and oscilloscope.'],
 math:['Φ = BA when B is normal to the area; general form NΦ = BANcosθ.','NΦ is maximum at θ = 0°, zero at 90°, and changes sign by 180° if direction is retained.','A graph of NΦ against cosθ is linear with gradient BAN.'],
 example:'B = 0.10 T, A = 0.010 m², N = 200 and θ = 60° gives NΦ = 0.10 Wb turn.',
 graphs:'NΦ against cosθ should be a straight line. Near 90°, small angle errors can create large percentage uncertainty in cosθ.',
 exam:'State the angle convention before calculating.',
 stretch:'Explain why the same angular uncertainty has different percentage effects at 20° and 88°.'},
'Faraday and Lenz laws / electromagnetic induction':{
 title:'Induction depends on how quickly flux linkage changes',
 core:['Faraday’s law links induced emf to the rate of change of flux linkage. Large flux alone does not guarantee large emf.','Lenz’s law gives the direction: the induced effect opposes the change producing it, consistent with conservation of energy.','A magnet moving faster through a coil or a coil with more turns gives a larger induced emf when the rate of change is larger.'],
 math:['Average magnitude ε ≈ Δ(NΦ)/Δt; instantaneous form is ε = −d(NΦ)/dt.','For a conductor moving perpendicular to B, motional emf can be described by ε = Blv under the stated geometry.','The negative sign encodes Lenz’s law.'],
 example:'If flux linkage changes by 0.040 Wb turn in 0.020 s, average |ε| = 2.0 V.',
 graphs:'On an NΦ–t graph, the induced emf is the negative gradient. Flat sections give zero emf.',
 exam:'Say the induced field/current opposes the change in flux linkage, not simply “opposes the magnetic field”.',
 stretch:'Compare the emf-time traces for the same magnet pushed slowly and quickly through the same coil.'},
'Rotating-coil generator':{
 title:'A generator converts mechanical rotation into alternating emf',
 core:['For a coil rotating at constant angular speed in a uniform field, the angle changes continuously, so flux linkage varies sinusoidally.','Emf is greatest when flux linkage changes fastest, and zero when flux linkage is momentarily at a maximum or minimum.','The resulting emf is alternating because the sign of the rate of change reverses every half turn.'],
 math:['NΦ = BANcos(ωt). Differentiating gives ε = BANωsin(ωt) in magnitude/sign convention.','Peak emf ε₀ = BANω.','Increasing B, A, N or rotational frequency increases peak emf linearly.'],
 example:'Doubling rotation frequency doubles ω and therefore doubles peak emf.',
 graphs:'Flux linkage and emf are one quarter cycle out of phase.',
 exam:'When flux is maximum the induced emf is zero because the gradient is zero.',
 stretch:'Sketch NΦ and ε on common time axes and annotate the points of maximum gradient.'},
'Alternating current, rms and oscilloscope':{
 title:'RMS connects an alternating waveform to its heating effect',
 core:['Alternating current changes direction periodically. For a sinusoidal waveform, the mean over a full cycle is zero but the rms value is not.','RMS voltage is the DC voltage that would produce the same mean power in a resistor.','An oscilloscope provides voltage scale and time-base information from which peak voltage, period and frequency can be measured.'],
 math:['For a sinusoid Vrms = Vpeak/√2 and Irms = Ipeak/√2.','Frequency f = 1/T.','Peak-to-peak voltage is 2Vpeak for a symmetric sine wave.'],
 example:'230 V rms corresponds to about 325 V peak and about 650 V peak-to-peak.',
 graphs:'Read vertical centre-to-peak amplitude for Vpeak and horizontal width of one or several cycles for T.',
 exam:'Do not confuse peak, peak-to-peak and rms values.',
 stretch:'Explain why power calculations for mains devices normally use rms rather than peak values.'},
'Transformers and high-voltage transmission':{
 title:'Changing flux transfers energy between circuits',
 core:['AC in the primary produces changing magnetic flux in the core. The linked changing flux induces an emf in the secondary.','For an ideal transformer, voltage ratio equals turns ratio and power is conserved. In a real transformer, resistance, eddy currents, hysteresis and imperfect coupling cause losses.','Power transmission uses high voltage because for a fixed power, current is smaller, greatly reducing I²R heating in cables.'],
 math:['Vs/Vp = Ns/Np. For an ideal transformer VpIp = VsIs.','Efficiency = Pout/Pin.','Cable loss Ploss = I²R, so reducing current by a factor of 10 reduces cable loss by a factor of 100.'],
 example:'500 primary turns, 50 secondary turns and 230 V primary gives 23 V secondary ideally.',
 graphs:'At fixed transmitted power and line resistance, Ploss ∝ 1/V² because I = P/V.',
 exam:'A transformer requires changing flux; steady DC does not sustain transformer action.',
 stretch:'Quantitatively compare cable losses when transmission voltage is doubled at fixed delivered power.'}
};
function render(){
 const l=(()=>{const t=$('h2',panel)?.textContent?.trim();return D.lessons.find(x=>x.title===t)})(); if(!l)return;
 const ch=chapters[l.title]; if(!ch)return;
 const target=panel.querySelector('.chunk[data-chunk="2"]'); if(!target||target.querySelector('.v10-deep-chapter'))return;
 const sec=document.createElement('section'); sec.className='v10-deep-chapter';
 sec.innerHTML=`<div class="v10-title-row"><div><span class="eyebrow">Deep textbook · v10</span><h3>${esc(ch.title)}</h3><p class="muted">Designed so the lesson can be used as a self-contained A-level textbook chapter.</p></div><span class="v10-spec-chip">${esc(l.code)}</span></div>
 <div class="v10-reading">${ch.core.map((p,i)=>`<article><span>${i+1}</span><p>${esc(p)}</p></article>`).join('')}</div>
 <div class="v10-grid"><article class="v10-card"><h4>Mathematical structure</h4><ul>${ch.math.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></article><article class="v10-card"><h4>Worked reasoning</h4><p>${esc(ch.example)}</p><p class="v10-hint">Before calculating: predict the sign, direction and approximate size.</p></article><article class="v10-card"><h4>Graph interpretation</h4><p>${esc(ch.graphs)}</p><p><strong>Graph routine:</strong> identify axes and units → describe the shape → identify gradient/area meaning → connect to the governing equation.</p></article><article class="v10-card"><h4>Exam precision</h4><p>${esc(ch.exam)}</p><p><strong>A* extension:</strong> ${esc(ch.stretch)}</p></article></div>
 <div class="v10-checkpoint"><div><strong>Explain it</strong><p>Explain the central idea without using the equation first.</p></div><div><strong>Then mathematise it</strong><p>Choose the equation, define the symbols and justify why the assumptions match.</p></div><div><strong>Then apply it</strong><p>Use a graph, practical situation or unfamiliar context to test the same model.</p></div></div>`;
 target.appendChild(sec);
 window.dispatchEvent(new CustomEvent('fields-v10-content-added'));
}
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(render,40)}).observe(panel,{childList:true,subtree:true});render();
})();