(() => {
'use strict';

const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));
const clamp = (n,a,b) => Math.max(a,Math.min(b,n));
const fmt = (n,d=3) => Number.isFinite(n) ? Number(n.toPrecision(d)).toString() : '—';

const lessons = [
{
 id:'vectors', code:'3.4.1.1', title:'Scalars and vectors', sim:'vectors',
 lead:'Build the language of mechanics: distinguish scalar quantities from vector quantities and represent vectors correctly.',
 formulas:['resultant = √(x² + y²)','θ = tan⁻¹(y/x)'],
 retrieval:[
  {q:'What is the SI unit of force?',a:'newton, N'},
  {q:'What is the difference between distance and displacement?',a:'Distance is total path length (scalar); displacement is straight-line change in position with direction (vector).'},
  {q:'Give one scalar and one vector quantity.',a:'Examples: scalar—mass, speed, energy; vector—force, velocity, acceleration, displacement.'}
 ],
 objectives:['Classify physical quantities as scalars or vectors.','Add perpendicular vectors by calculation.','State a resultant with both magnitude and direction.'],
 core:[
  'A scalar has magnitude only. A vector has magnitude and direction.',
  'A vector can be represented by an arrow: the arrow length represents magnitude and its direction represents the vector direction.',
  'For perpendicular vectors, treat the components as the two sides of a right-angled triangle. Use Pythagoras for the magnitude and trigonometry for the direction.',
  'AQA questions often test paired examples: speed/velocity, distance/displacement and mass/weight.'
 ],
 worked:{q:'A student walks 6.0 m east then 8.0 m north. Find the resultant displacement.',a:'Magnitude = √(6.0² + 8.0²) = 10.0 m. Direction = tan⁻¹(8/6) = 53° north of east.'},
 task:'Draw a scale vector diagram for 12 N east and 5 N north. Calculate the resultant independently and compare your measured and calculated answers.',
 check:{q:'Which quantity is a vector?',choices:['Energy','Mass','Velocity','Temperature'],answer:2,explain:'Velocity has both magnitude and direction.'},
 exit:'Explain why an object can travel a large distance but have zero displacement.'
},
{
 id:'resolution', code:'3.4.1.1', title:'Resolving vectors and equilibrium', sim:'equilibrium',
 lead:'Resolve forces into perpendicular components and decide whether several coplanar forces are in equilibrium.',
 formulas:['Fₓ = F cosθ','Fᵧ = F sinθ','ΣF = 0 in equilibrium'],
 retrieval:[
  {q:'What information must be included when stating a vector?',a:'Magnitude and direction.'},
  {q:'What is meant by the resultant force?',a:'The single force with the same effect as all the forces acting together.'},
  {q:'What does equilibrium mean for translational motion?',a:'Resultant force is zero, so acceleration is zero; the object is stationary or moves at constant velocity.'}
 ],
 objectives:['Resolve a force into perpendicular components.','Apply components on an inclined plane.','Use the condition ΣF = 0 for equilibrium.'],
 core:[
  'Resolution replaces one vector with perpendicular component vectors whose combined effect is identical.',
  'If the angle is measured from the horizontal, the horizontal component is F cosθ and the vertical component is F sinθ.',
  'On a slope, choosing axes parallel and perpendicular to the slope often simplifies the calculation. Weight can be resolved into mg sinθ down the slope and mg cosθ into the slope.',
  'For a point in equilibrium, the vector sum of all forces is zero. Three forces can therefore form a closed vector triangle.'
 ],
 worked:{q:'A 200 N force acts at 30° above the horizontal. Find its components.',a:'Horizontal = 200 cos30° = 173 N. Vertical = 200 sin30° = 100 N.'},
 task:'For a 5.0 kg block on a 20° slope, calculate the components of weight parallel and perpendicular to the slope. Use g = 9.81 m s⁻².',
 check:{q:'A body is moving at constant velocity. What is its resultant force?',choices:['It must be increasing','Zero','Equal to its weight','Equal to mv'],answer:1,explain:'Constant velocity means zero acceleration, so the resultant force is zero.'},
 exit:'Describe one situation where resolving a force is more useful than drawing a scale diagram.'
},
{
 id:'moments', code:'3.4.1.2', title:'Moments, couples and centre of mass', sim:'moments',
 lead:'Connect forces to turning effects and use the principle of moments in equilibrium problems.',
 formulas:['moment = F × perpendicular distance','couple moment = F × separation','Σ clockwise moments = Σ anticlockwise moments'],
 retrieval:[
  {q:'What is the SI unit of moment?',a:'N m'},
  {q:'What does perpendicular distance mean in the moment equation?',a:'The shortest distance from the pivot to the line of action of the force.'},
  {q:'What is the condition for rotational equilibrium?',a:'Net moment is zero.'}
 ],
 objectives:['Calculate the moment of a force.','Explain and calculate the moment of a couple.','Apply the principle of moments and centre of mass.'],
 core:[
  'A moment is the turning effect of a force about a point or pivot.',
  'Use the perpendicular distance to the force’s line of action, not simply the distance to where the force is applied.',
  'A couple is two equal, opposite, parallel forces acting along different lines. The resultant force is zero but there is a turning effect.',
  'For equilibrium, total clockwise moment equals total anticlockwise moment about the same point.',
  'The centre of mass is the point through which the whole weight of an object can be treated as acting.'
 ],
 worked:{q:'A 40 N force acts 0.35 m perpendicularly from a pivot. Find the moment.',a:'Moment = 40 × 0.35 = 14 N m.'},
 task:'A 300 N child sits 1.8 m from a seesaw pivot. Where should a 450 N child sit on the opposite side for balance?',
 check:{q:'Which distance must be used in M = Fd?',choices:['Distance from pivot to object centre','Perpendicular distance to the line of action','Vertical distance only','Any measured distance'],answer:1,explain:'Moment uses the perpendicular distance from the pivot to the force’s line of action.'},
 exit:'Explain why a long spanner makes it easier to turn a tight nut.'
},
{
 id:'kinematics', code:'3.4.1.3', title:'Motion quantities and graphs', sim:'motion',
 lead:'Read motion from displacement–time, velocity–time and acceleration–time graphs.',
 formulas:['v = Δs/Δt','a = Δv/Δt','area under v–t = displacement','gradient of v–t = acceleration'],
 retrieval:[
  {q:'What is the difference between speed and velocity?',a:'Velocity includes direction; speed does not.'},
  {q:'What does the gradient of a displacement–time graph represent?',a:'Velocity.'},
  {q:'What does the area beneath a velocity–time graph represent?',a:'Displacement.'}
 ],
 objectives:['Calculate average and instantaneous velocity.','Interpret gradients and areas on motion graphs.','Relate displacement, velocity and acceleration graphically.'],
 core:[
  'Average velocity is total displacement divided by time. Instantaneous velocity is velocity at a particular instant.',
  'The gradient of a displacement–time graph is velocity. A changing gradient means changing velocity.',
  'The gradient of a velocity–time graph is acceleration. The signed area under the graph is displacement.',
  'The area under an acceleration–time graph gives the change in velocity.',
  'Negative values indicate direction relative to the chosen positive direction; they do not automatically mean slowing down.'
 ],
 worked:{q:'Velocity increases uniformly from 4.0 to 16.0 m s⁻¹ in 6.0 s. Find acceleration and displacement.',a:'a = (16−4)/6 = 2.0 m s⁻². Displacement = average velocity × time = (4+16)/2 × 6 = 60 m.'},
 task:'Sketch a velocity–time graph for a car that accelerates from rest for 5 s, travels at constant speed for 8 s, then brakes uniformly to rest in 4 s.',
 check:{q:'What does the gradient of a velocity–time graph give?',choices:['Displacement','Distance','Acceleration','Momentum'],answer:2,explain:'Acceleration is the rate of change of velocity, so it is the gradient of a velocity–time graph.'},
 exit:'A velocity–time graph crosses below the time axis. Explain what this means physically.'
},
{
 id:'suvat', code:'3.4.1.3', title:'SUVAT and free fall', sim:'motion',
 lead:'Choose and apply constant-acceleration equations, including motion under gravity.',
 formulas:['v = u + at','s = ut + ½at²','v² = u² + 2as','s = ½(u+v)t'],
 retrieval:[
  {q:'What does each SUVAT symbol represent?',a:'s displacement, u initial velocity, v final velocity, a acceleration, t time.'},
  {q:'When are SUVAT equations valid?',a:'When acceleration is constant.'},
  {q:'What value is commonly used for g near Earth?',a:'9.81 m s⁻² (or the value specified in the question).'}
 ],
 objectives:['Select the correct SUVAT equation from known quantities.','Use a consistent sign convention.','Model free fall with acceleration g.'],
 core:[
  'SUVAT is a set of relationships for motion with constant acceleration.',
  'Write down the values you know before choosing an equation. Prefer an equation that contains the quantity required and only the known quantities.',
  'Choose a positive direction and keep it throughout the calculation. If upward is positive, gravitational acceleration is −g.',
  'At the highest point of a vertical throw, instantaneous velocity is zero but acceleration is still downward at g.'
 ],
 worked:{q:'A ball is thrown vertically upward at 14.0 m s⁻¹. Find the maximum height above the release point.',a:'Take upward as positive. v = 0, u = 14.0, a = −9.81. v² = u² + 2as gives s = (0−196)/(−19.62) = 9.99 m.'},
 task:'A stone is dropped from rest for 1.50 s. Calculate its speed and distance fallen, ignoring air resistance.',
 check:{q:'At the highest point of a vertical throw, what is the acceleration?',choices:['0','9.81 m s⁻² upward','9.81 m s⁻² downward','It depends on mass'],answer:2,explain:'Velocity is momentarily zero, but gravity still produces downward acceleration.'},
 exit:'State two checks you should make before using a SUVAT equation.'
},
{
 id:'rp3', code:'RP3 / 3.4.1.3', title:'Required Practical 3: determining g', sim:'motion',
 lead:'Plan, process and evaluate a free-fall method for measuring gravitational acceleration.',
 formulas:['h = ½gt²','g = 2h/t²'],
 retrieval:[
  {q:'Why are repeated readings useful?',a:'They allow a mean to reduce the effect of random variation and help identify anomalies.'},
  {q:'Give one possible systematic error in a timing experiment.',a:'Examples include a zero offset, fixed trigger delay, miscalibrated scale or consistent measurement offset.'},
  {q:'What graph can linearise h = ½gt²?',a:'Plot h against t². The gradient is g/2.'}
 ],
 objectives:['Describe a workable free-fall method.','Use a graph to determine g.','Identify random and systematic errors and improvements.'],
 core:[
  'One approach measures fall distance h and time t for a released object, ideally with electronic timing such as light gates or an electromagnet/timer arrangement.',
  'From h = ½gt², a graph of h against t² should be a straight line through the origin with gradient g/2.',
  'Use a wide range of heights, repeat timings and measure distances carefully from consistent reference points.',
  'Random error creates scatter. Systematic error shifts readings in a consistent way and is not removed by repeats.',
  'A strong evaluation links each limitation to its effect on the measured value and then proposes a specific improvement.'
 ],
 worked:{q:'The gradient of a graph of h against t² is 4.88 m s⁻². Determine g.',a:'gradient = g/2, so g = 2 × 4.88 = 9.76 m s⁻².'},
 task:'Open Required Practicals and collect at least five simulated readings at different heights. Calculate a mean g and comment on scatter.',
 check:{q:'For a graph of h against t², what is the gradient?',choices:['g','g/2','2g','1/g'],answer:1,explain:'h = (g/2)t², so the gradient is g/2.'},
 exit:'Explain why measuring a longer fall time generally reduces percentage timing uncertainty.'
},
{
 id:'projectiles', code:'3.4.1.4', title:'Projectile motion, drag and terminal speed', sim:'projectile',
 lead:'Treat horizontal and vertical motion independently and explain the role of resistive forces.',
 formulas:['x = uₓt','vᵧ = uᵧ + gt','sᵧ = uᵧt + ½gt²'],
 retrieval:[
  {q:'What horizontal acceleration acts on an ideal projectile with no air resistance?',a:'Zero.'},
  {q:'What vertical acceleration acts on it?',a:'g downward.'},
  {q:'Why can horizontal and vertical motion be treated separately?',a:'They are perpendicular components; gravity acts vertically, so it does not directly change horizontal velocity in the ideal model.'}
 ],
 objectives:['Solve two-dimensional projectile problems.','Explain how drag changes a trajectory.','Explain terminal speed using changing resultant force.'],
 core:[
  'Projectile motion can be split into independent horizontal and vertical components that share the same time.',
  'Without air resistance, horizontal velocity is constant while vertical velocity changes uniformly because of gravity.',
  'Air resistance acts opposite to motion and increases with speed, so real trajectories are not perfectly symmetric.',
  'For a falling object, drag increases as speed rises. Terminal speed occurs when drag equals weight, making resultant force and acceleration zero.',
  'Lift acts approximately perpendicular to relative airflow; drag acts approximately parallel and opposite to it.'
 ],
 worked:{q:'A ball leaves a table horizontally at 6.0 m s⁻¹ from height 1.25 m. Find the flight time and horizontal range.',a:'Vertical: 1.25 = ½(9.81)t², so t = 0.505 s. Horizontal range = 6.0 × 0.505 = 3.03 m.'},
 task:'Use the projectile simulator to compare launch angles of 20°, 45° and 70° at the same speed. Record range and maximum height.',
 check:{q:'At terminal speed, which statement is correct?',choices:['Weight is zero','Drag is zero','Resultant force is zero','Acceleration equals g'],answer:2,explain:'At terminal speed, drag balances weight, so resultant force and acceleration are zero.'},
 exit:'Explain why the vertical velocity of an ideal horizontal projectile changes while horizontal velocity does not.'
},
{
 id:'newton', code:'3.4.1.5', title:'Newton’s laws and free-body diagrams', sim:'newton',
 lead:'Use Newton’s laws to connect force, acceleration and interactions.',
 formulas:['ΣF = ma','weight = mg'],
 retrieval:[
  {q:'State Newton’s first law in terms of resultant force.',a:'If resultant force is zero, velocity remains constant; this includes remaining at rest.'},
  {q:'Write Newton’s second law for constant mass.',a:'Resultant force = mass × acceleration, ΣF = ma.'},
  {q:'What is special about a Newton’s third-law pair?',a:'The forces are equal in magnitude, opposite in direction, same interaction type and act on different objects.'}
 ],
 objectives:['Apply all three Newton laws.','Draw and use free-body diagrams.','Distinguish balanced forces from third-law pairs.'],
 core:[
  'Newton’s first law describes inertia: an object changes velocity only when there is a resultant force.',
  'For constant mass, Newton’s second law is ΣF = ma. Always use the resultant force, not a single force unless it is the only unbalanced force.',
  'Newton’s third law concerns interactions between two objects: if A exerts a force on B, B simultaneously exerts an equal and opposite force on A.',
  'Third-law pairs act on different objects, so they cannot cancel on one object’s free-body diagram.',
  'A free-body diagram should show only forces acting on the chosen object, with clear directions and labels.'
 ],
 worked:{q:'A 1200 kg car has 3200 N driving force and 800 N total resistance. Find acceleration.',a:'Resultant force = 3200 − 800 = 2400 N. a = 2400/1200 = 2.0 m s⁻².'},
 task:'Draw a free-body diagram for a lift accelerating upward. Label weight, tension and resultant direction, then write an equation for its acceleration.',
 check:{q:'Which statement describes a Newton’s third-law pair?',choices:['Two equal forces on the same object','Weight and normal reaction on one object','Equal opposite forces on two interacting objects','Any two balanced forces'],answer:2,explain:'Third-law forces act on different interacting objects.'},
 exit:'Explain why weight and normal contact force on a stationary book are not a third-law pair.'
},
{
 id:'momentum', code:'3.4.1.6', title:'Momentum, impulse and collisions', sim:'momentum',
 lead:'Use conservation of momentum, impulse and force–time graphs to analyse interactions.',
 formulas:['p = mv','F = Δp/Δt','impulse = FΔt = Δp'],
 retrieval:[
  {q:'Is momentum scalar or vector?',a:'Vector.'},
  {q:'State the principle of conservation of momentum.',a:'Total momentum of a closed system remains constant if no resultant external force acts.'},
  {q:'What does the area under a force–time graph represent?',a:'Impulse, equal to change in momentum.'}
 ],
 objectives:['Calculate momentum and impulse.','Apply momentum conservation in one dimension.','Explain impact-force reduction using contact time.'],
 core:[
  'Momentum p = mv. Because velocity is a vector, signs or directions must be handled consistently.',
  'In an isolated system, total momentum before an interaction equals total momentum after.',
  'Force is the rate of change of momentum. For a fixed change in momentum, increasing collision time reduces average force.',
  'Impulse equals change in momentum and equals the area under a force–time graph, including when force varies with time.',
  'Momentum is conserved in both elastic and inelastic collisions; kinetic energy is conserved only in elastic collisions.'
 ],
 worked:{q:'A 0.20 kg ball moving at +12 m s⁻¹ rebounds at −8.0 m s⁻¹. Find its change in momentum.',a:'Δp = m(v−u) = 0.20(−8−12) = −4.0 kg m s⁻¹. Magnitude of impulse is 4.0 N s.'},
 task:'Two trolleys collide and stick. Use the simulator to test whether total momentum before and after stays constant while kinetic energy changes.',
 check:{q:'A crumple zone reduces injury risk mainly because it…',choices:['reduces change in momentum to zero','increases collision time for a similar Δp','increases acceleration','increases vehicle mass'],answer:1,explain:'Increasing the time for the same momentum change reduces the average force.'},
 exit:'State the difference between an elastic and inelastic collision in terms of kinetic energy.'
},
{
 id:'work', code:'3.4.1.7', title:'Work, energy, power and efficiency', sim:'energy',
 lead:'Calculate energy transfers and interpret force–displacement graphs.',
 formulas:['W = Fs cosθ','P = W/t = Fv','Eₖ = ½mv²','ΔEₚ = mgΔh','efficiency = useful/total'],
 retrieval:[
  {q:'What is work done?',a:'Energy transferred when a force causes displacement.'},
  {q:'What is power?',a:'Rate of energy transfer or rate of doing work.'},
  {q:'What does the area under a force–displacement graph represent?',a:'Work done / energy transferred.'}
 ],
 objectives:['Calculate work done by a force at an angle.','Use kinetic and gravitational potential energy.','Calculate power and efficiency.'],
 core:[
  'For a constant force, work done is the component of force along the displacement multiplied by displacement: W = Fs cosθ.',
  'Kinetic energy is ½mv². Gravitational potential energy change near Earth is mgΔh.',
  'Power is the rate of doing work. At constant speed with force parallel to velocity, P = Fv.',
  'For a varying force, work done is the area under the force–displacement graph.',
  'Efficiency compares useful output energy or power with total input and can be expressed as a fraction or percentage.'
 ],
 worked:{q:'A motor lifts 25 kg vertically through 4.0 m in 5.0 s. Find useful power.',a:'Energy gained = mgh = 25×9.81×4.0 = 981 J. Power = 981/5.0 = 196 W.'},
 task:'A 900 kg car travels at constant 20 m s⁻¹ against 700 N resistance. Calculate the engine power transferred to overcome resistance.',
 check:{q:'If speed doubles, kinetic energy becomes…',choices:['twice as large','three times as large','four times as large','unchanged'],answer:2,explain:'Kinetic energy is proportional to v².'},
 exit:'Explain why the area under a force–displacement graph is energy transferred.'
},
{
 id:'energy', code:'3.4.1.8', title:'Conservation of energy', sim:'energy',
 lead:'Track energy transfers through mechanical systems, including work against resistive forces.',
 formulas:['Einitial = Efinal + dissipated energy','½mv² + mgh = constant (ideal mechanical system)'],
 retrieval:[
  {q:'State the principle of conservation of energy.',a:'Energy cannot be created or destroyed; it is transferred between stores or dissipated to the surroundings.'},
  {q:'What happens to mechanical energy when resistive forces do work?',a:'Some is transferred to internal/thermal energy of the system and surroundings.'},
  {q:'Can total energy decrease?',a:'No for a closed system; useful mechanical energy can decrease while energy is transferred elsewhere.'}
 ],
 objectives:['Apply energy conservation quantitatively.','Include dissipated energy in calculations.','Compare energy and force methods.'],
 core:[
  'Choose a system boundary, identify initial and final energy stores and account for transfers across the boundary.',
  'In an ideal frictionless system, loss of gravitational potential energy can equal gain in kinetic energy.',
  'With resistive forces, some mechanical energy is dissipated. The work done against resistance is an energy transfer.',
  'Energy methods are often efficient when time is not involved and the route between initial and final states is unimportant.'
 ],
 worked:{q:'A 2.0 kg object falls 5.0 m from rest and loses 18 J to air resistance. Find its kinetic energy just before impact.',a:'GPE lost = 2.0×9.81×5.0 = 98.1 J. KE = 98.1−18 = 80.1 J.'},
 task:'Use the energy simulator to compare an ideal track with a dissipative track. Explain the change in kinetic and gravitational stores.',
 check:{q:'With friction present, which is conserved?',choices:['Kinetic energy only','Mechanical energy only','Total energy','Gravitational potential energy'],answer:2,explain:'Total energy is conserved; mechanical energy can be transferred to internal energy.'},
 exit:'Give one reason an energy method may be simpler than using SUVAT and Newton’s laws.'
},
{
 id:'density-hooke', code:'3.4.2.1', title:'Density, Hooke’s law and elastic limit', sim:'density',
 lead:'Move from mechanics into material behaviour by relating force to deformation.',
 formulas:['ρ = m/V','F = kΔL'],
 retrieval:[
  {q:'Define density.',a:'Mass per unit volume.'},
  {q:'State Hooke’s law.',a:'Extension is proportional to applied force provided the limit of proportionality is not exceeded; equivalently F = kΔL in the linear region.'},
  {q:'What is spring constant?',a:'Force per unit extension; a measure of stiffness for a spring.'}
 ],
 objectives:['Calculate density.','Use F = kΔL.','Distinguish limit of proportionality from elastic behaviour.'],
 core:[
  'Density is ρ = m/V with SI unit kg m⁻³.',
  'For a Hookean spring, force and extension are proportional, producing a straight-line force–extension graph through the origin.',
  'Spring constant k is the gradient of a force–extension graph when force is plotted vertically against extension.',
  'The limit of proportionality is where the graph stops being linear. The elastic limit is the greatest load for which the object returns to its original shape after unloading.'
 ],
 worked:{q:'A spring extends 24 mm under a 6.0 N load. Find k while behaviour is Hookean.',a:'ΔL = 0.024 m. k = F/ΔL = 6.0/0.024 = 250 N m⁻¹.'},
 task:'Use the elasticity simulation to increase force gradually. Identify the linear region and estimate the spring constant from two readings.',
 check:{q:'What is the gradient of a force against extension graph in the linear region?',choices:['1/k','k','elastic energy','stress'],answer:1,explain:'F = kΔL, so plotting F against ΔL gives gradient k.'},
 exit:'Explain why “elastic” and “linear/Hookean” are not exactly the same idea.'
},
{
 id:'stress-strain', code:'3.4.2.1', title:'Stress, strain and elastic strain energy', sim:'elasticity',
 lead:'Use stress and strain to compare materials independently of sample dimensions.',
 formulas:['stress = F/A','strain = ΔL/L','Eelastic = ½FΔL'],
 retrieval:[
  {q:'What are the SI units of stress?',a:'Pa, equivalent to N m⁻².'},
  {q:'Does strain have a unit?',a:'No. It is a ratio of two lengths.'},
  {q:'What does elastic strain energy represent?',a:'Energy stored due to elastic deformation.'}
 ],
 objectives:['Calculate tensile stress and strain.','Calculate elastic strain energy.','Explain why stress and strain are useful material quantities.'],
 core:[
  'Tensile stress is force divided by original cross-sectional area.',
  'Tensile strain is extension divided by original length and is dimensionless.',
  'Stress and strain remove much of the effect of sample geometry, allowing materials to be compared.',
  'For a linear force–extension graph, elastic strain energy is the triangular area under the graph: ½FΔL.',
  'For any force–extension graph, energy transferred in deformation is the area under the graph.'
 ],
 worked:{q:'A wire of area 2.0×10⁻⁷ m² carries 60 N. Find tensile stress.',a:'stress = 60/(2.0×10⁻⁷) = 3.0×10⁸ Pa.'},
 task:'A 2.0 m wire extends by 1.2 mm under tension. Calculate strain, then explain why this is a pure number.',
 check:{q:'Which quantity is dimensionless?',choices:['Stress','Strain','Young modulus','Spring constant'],answer:1,explain:'Strain is extension divided by original length, so the units cancel.'},
 exit:'Explain the difference between a force–extension graph and a stress–strain graph.'
},
{
 id:'material-behaviour', code:'3.4.2.1', title:'Stress–strain curves and material behaviour', sim:'elasticity',
 lead:'Interpret elastic, plastic, brittle and fracture behaviour from graphs.',
 formulas:['breaking stress = breaking force / area'],
 retrieval:[
  {q:'What is plastic deformation?',a:'Permanent deformation that remains after the load is removed.'},
  {q:'What is brittle behaviour?',a:'Fracture with little plastic deformation.'},
  {q:'What does the area under a force–extension graph represent?',a:'Energy transferred in deformation.'}
 ],
 objectives:['Interpret stress–strain and force–extension curves.','Distinguish elastic, plastic and brittle behaviour.','Identify breaking stress.'],
 core:[
  'In the initial linear region, stress is proportional to strain and the material follows Hooke-like behaviour.',
  'If unloading after elastic deformation, the sample returns to its original length.',
  'Plastic deformation leaves permanent extension after the load is removed.',
  'Brittle materials fracture after relatively little plastic deformation. Ductile materials can undergo substantial plastic deformation before fracture.',
  'Breaking stress is the tensile stress at fracture and should not be confused with breaking force, which depends on cross-sectional area.'
 ],
 worked:{q:'Two wires of the same material have different diameters. Which has the same breaking stress?',a:'Both, ideally, because breaking stress is a material property. The thicker wire has a larger breaking force because its cross-sectional area is larger.'},
 task:'Sketch qualitative stress–strain curves for a brittle material and a ductile metal. Label the elastic region and fracture point.',
 check:{q:'Which statement best describes plastic deformation?',choices:['It always obeys Hooke’s law','It is fully reversed when unloaded','It leaves permanent deformation','It means the material must fracture immediately'],answer:2,explain:'Plastic deformation remains after unloading.'},
 exit:'Explain why stress is more useful than breaking force when comparing different samples of the same material.'
},
{
 id:'young', code:'3.4.2.2', title:'Young modulus', sim:'elasticity',
 lead:'Quantify material stiffness using the ratio of tensile stress to tensile strain.',
 formulas:['E = stress/strain','E = FL/(AΔL)'],
 retrieval:[
  {q:'Define Young modulus.',a:'Tensile stress divided by tensile strain in the linear elastic region.'},
  {q:'What are the units of Young modulus?',a:'Pa.'},
  {q:'What does a larger Young modulus imply?',a:'The material is stiffer: more stress is needed for the same strain.'}
 ],
 objectives:['Calculate Young modulus.','Find Young modulus from a stress–strain graph.','Relate stiffness to material rather than specimen dimensions.'],
 core:[
  'Young modulus E = tensile stress / tensile strain while the material is in its linear elastic region.',
  'Because stress is measured in pascals and strain has no units, Young modulus is also measured in pascals.',
  'On a stress–strain graph, Young modulus is the gradient of the initial straight-line section.',
  'A high Young modulus means a stiff material. It does not directly mean the material is strong; strength relates to the stress required for yielding or fracture.'
 ],
 worked:{q:'A wire experiences stress 1.6×10⁸ Pa at strain 8.0×10⁻⁴. Find E.',a:'E = 1.6×10⁸ / 8.0×10⁻⁴ = 2.0×10¹¹ Pa.'},
 task:'Use the elasticity simulator to compare two materials with different Young moduli. Describe the effect on strain for the same stress.',
 check:{q:'On a stress–strain graph, Young modulus is…',choices:['area under graph','gradient of initial linear region','breaking stress','inverse of strain'],answer:1,explain:'Young modulus is stress/strain, so it is the gradient when stress is plotted against strain.'},
 exit:'Explain why a stiff material is not necessarily a strong material.'
},
{
 id:'rp4', code:'RP4 / 3.4.2.2', title:'Required Practical 4: Young modulus', sim:'elasticity',
 lead:'Plan, process and evaluate a simple Young modulus measurement.',
 formulas:['E = FL/(AΔL)','A = πd²/4'],
 retrieval:[
  {q:'Why measure wire diameter in several orientations/positions?',a:'To reduce random uncertainty and account for non-uniform diameter; use a mean.'},
  {q:'Why must diameter be measured accurately?',a:'Area depends on diameter squared, so diameter uncertainty has a strong effect on calculated area and Young modulus.'},
  {q:'What graph can be used?',a:'Force against extension (gradient k for the sample) or stress against strain (gradient E).'}
 ],
 objectives:['Describe a simple Young modulus method.','Process diameter, length, force and extension measurements.','Evaluate uncertainty and safety.'],
 core:[
  'Measure original wire length between fixed reference points and determine wire diameter with a micrometer at several positions.',
  'Add known loads gradually and measure extension while remaining in the elastic/linear region.',
  'Convert mass to force using F = mg. Calculate cross-sectional area from diameter and then use E = FL/(AΔL).',
  'A long thin wire gives a larger extension for a given force, which can reduce percentage uncertainty in extension.',
  'The major practical risks are from a snapping wire or falling masses, so the real experiment requires appropriate eye protection, secure apparatus and a clear load area.'
 ],
 worked:{q:'A 1.50 m wire of diameter 0.40 mm extends 1.8 mm under 30 N. Estimate E.',a:'A = π(0.00040)²/4 = 1.26×10⁻⁷ m². E = 30×1.50 /(1.26×10⁻⁷×0.0018) ≈ 2.0×10¹¹ Pa.'},
 task:'Open Required Practicals, collect at least five simulated readings and compare the calculated Young modulus across the data set.',
 check:{q:'Why does diameter uncertainty matter strongly?',choices:['Force is proportional to diameter','Area is proportional to d²','Strain is proportional to d','Length is proportional to d²'],answer:1,explain:'Cross-sectional area is πd²/4, so uncertainty in d is amplified in area.'},
 exit:'Suggest two practical changes that would reduce percentage uncertainty in Young modulus.'
},
{
 id:'mastery', code:'3.4 synthesis', title:'Mechanics mastery and synoptic problems', sim:'energy',
 lead:'Combine multiple ideas in the style of longer AQA mechanics questions.',
 formulas:['ΣF = ma','p = mv','Eₖ = ½mv²','W = Fs','SUVAT as appropriate'],
 retrieval:[
  {q:'Name three conservation principles or conditions used in this topic.',a:'Examples: conservation of momentum, conservation of energy, equilibrium/resultant force zero, principle of moments.'},
  {q:'What is a good first step in a mechanics problem?',a:'Define the system/direction, draw a diagram or free-body diagram and list known quantities.'},
  {q:'How should final numerical answers be presented?',a:'With sensible significant figures and correct units, plus direction where required.'}
 ],
 objectives:['Select between force, energy and momentum approaches.','Link graphs, equations and physical explanations.','Use clear AQA-style reasoning in extended problems.'],
 core:[
  'Mechanics problems rarely announce which equation to use. Decide what is conserved or what changes between the stated initial and final conditions.',
  'Use force/Newton methods when acceleration or interactions are central; energy methods when comparing states without needing time; momentum methods for short collisions/explosions.',
  'Draw free-body diagrams carefully and keep signs consistent. Check whether acceleration is actually constant before using SUVAT.',
  'For unfamiliar contexts, identify the same underlying physics rather than searching for a memorised scenario.',
  'After calculating, check magnitude, dimensions/units and physical plausibility.'
 ],
 worked:{q:'A 0.50 kg trolley moving at 4.0 m s⁻¹ collides and sticks to a 1.0 kg stationary trolley. Find their speed, then the kinetic energy lost.',a:'Momentum: 0.50×4.0 = 1.50v, so v = 1.33 m s⁻¹. Initial KE = 4.0 J. Final KE = ½×1.50×1.33² ≈ 1.33 J. Lost ≈ 2.67 J.'},
 task:'Create a solution map for a problem involving a car accelerating down a slope, then colliding with a barrier. Identify where vectors, Newton’s laws, energy and momentum would each be useful.',
 check:{q:'Which method is usually most direct for a short collision when external impulse is negligible?',choices:['Conservation of momentum','Young modulus','Principle of moments only','Density'],answer:0,explain:'Momentum conservation is the core tool for short interactions when external impulse is negligible.'},
 exit:'Write a five-step checklist you will use for any unfamiliar A-level mechanics calculation.'
}
];


const lessonExtensions = {
 vectors:{
  keyTerms:[['scalar','A physical quantity with magnitude only.'],['vector','A physical quantity with magnitude and direction.'],['resultant','A single vector with the same effect as two or more vectors combined.'],['displacement','Straight-line change of position in a stated direction.']],
  depth:[
   'AQA expects students to distinguish paired scalar/vector quantities, including speed and velocity, distance and displacement, mass and weight, and to recognise acceleration and force as vectors.',
   'Vector addition can be carried out by calculation or by a scale drawing. Calculations in this part of the specification are limited to two vectors at right angles, although scale drawings can use other angles.',
   'When using a scale diagram, state the scale, draw arrows accurately head-to-tail, measure the resultant from the start of the first vector to the end of the last, and quote both magnitude and direction.',
   'For perpendicular components, Pythagoras gives the resultant magnitude. A trigonometric ratio then gives the direction; always state the reference direction, for example 37° north of east.',
   'A negative component does not mean a negative magnitude: it means the component points opposite to the chosen positive direction.'
  ],
  exam:['Write vector answers with both magnitude and direction.','Show the component triangle or equations before calculating.','Check whether the question wants distance or displacement, speed or velocity.'],
  pitfalls:['Giving only the magnitude of a resultant vector.','Adding vector magnitudes arithmetically when directions differ.']
 },
 resolution:{
  keyTerms:[['component','One of the perpendicular vectors into which a vector is resolved.'],['equilibrium','Zero resultant force; acceleration is zero.'],['coplanar','Acting in the same plane.'],['closed triangle','Three force vectors arranged head-to-tail and returning to the start when in equilibrium.']],
  depth:[
   'Resolving means replacing one vector by perpendicular components that together have exactly the same effect.',
   'If an angle is measured from the horizontal, the adjacent horizontal component is F cosθ and the vertical component is F sinθ. If the angle is measured from another axis, identify adjacent and opposite rather than memorising a diagram.',
   'For an inclined plane, choosing axes parallel and perpendicular to the slope usually simplifies the problem. Weight resolves to mg sinθ down the slope and mg cosθ perpendicular to the slope.',
   'For two or three coplanar forces acting at a point in equilibrium, the vector sum is zero. Equilibrium can mean stationary or moving with constant velocity.',
   'A three-force equilibrium can be solved using components or represented by a closed vector triangle.'
  ],
  exam:['Draw a free-body diagram before resolving.','State the positive direction and keep signs consistent.','For equilibrium write ΣFₓ = 0 and ΣFᵧ = 0 explicitly when useful.'],
  pitfalls:['Assuming equilibrium means the object must be stationary.','Using mg cosθ and mg sinθ without checking how θ is defined.']
 },
 moments:{
  keyTerms:[['moment','Turning effect of a force about a point: force × perpendicular distance.'],['line of action','An imaginary straight line through a force in its direction.'],['couple','Two equal, opposite, parallel forces acting along different lines.'],['centre of mass','Point at which the mass of a body may be considered concentrated for translational motion.']],
  depth:[
   'The perpendicular distance in M = Fd is the shortest distance from the pivot to the line of action of the force.',
   'A couple has zero resultant force but a non-zero turning effect. Its moment is one force multiplied by the perpendicular separation of the two lines of action.',
   'For rotational equilibrium, the algebraic sum of moments about any point is zero. In many questions this is expressed as total clockwise moment equals total anticlockwise moment.',
   'The centre of mass of a uniform regular solid lies at its geometric centre. Weight can be treated as acting vertically downward through the centre of mass.',
   'Choosing the pivot strategically can eliminate unknown forces whose lines of action pass through that pivot.'
  ],
  exam:['Mark the pivot and perpendicular distances on the diagram.','Use N m for moments, not J even though the dimensions are the same.','If several forces act, include every force that has a non-zero moment about the chosen pivot.'],
  pitfalls:['Using the sloping distance instead of the perpendicular distance.','Treating the two forces in a couple as cancelling their turning effect.']
 },
 kinematics:{
  keyTerms:[['average velocity','Total displacement divided by total time.'],['instantaneous velocity','Velocity at a particular instant.'],['acceleration','Rate of change of velocity.'],['gradient','Rate of change of the vertical quantity with respect to the horizontal quantity.']],
  depth:[
   'The gradient of a displacement–time graph is velocity. A tangent gives instantaneous velocity on a curved graph.',
   'The gradient of a velocity–time graph is acceleration. A tangent gives instantaneous acceleration when the graph is curved.',
   'The signed area under a velocity–time graph is displacement. Areas below the time axis count as negative displacement.',
   'The signed area under an acceleration–time graph gives change in velocity, not displacement.',
   'Uniform acceleration produces a straight line on a velocity–time graph. Non-uniform acceleration produces a changing gradient.',
   'AQA can use unfamiliar graphs such as a bouncing ball. Interpret each region physically rather than relying on the appearance alone.'
  ],
  exam:['Put units on every gradient or area result.','Use a tangent for an instantaneous gradient and a sufficiently large triangle.','Distinguish distance from displacement when velocity becomes negative.'],
  pitfalls:['Saying area under a velocity–time graph is always distance.','Confusing the gradient of a displacement–time graph with acceleration.']
 },
 suvat:{
  keyTerms:[['uniform acceleration','Acceleration that remains constant.'],['free fall','Motion under gravity alone in the idealised model.'],['g','Magnitude of gravitational field acceleration near Earth, approximately 9.81 m s⁻².'],['sign convention','A chosen positive direction used consistently in vector equations.']],
  depth:[
   'The SUVAT equations apply only when acceleration is constant over the interval considered.',
   'List s, u, v, a and t before selecting an equation. Choose an equation containing the required quantity and the values you know.',
   'Gravity acts downward. If upward is positive, a = −g; if downward is positive, a = +g.',
   'At the top of a vertical throw, velocity is instantaneously zero but acceleration remains g downward.',
   'Free-fall questions may combine graph interpretation and SUVAT. Check whether air resistance can be neglected before treating acceleration as constant g.'
  ],
  exam:['State the sign convention before substitution in multi-stage problems.','Do not round intermediate values too early.','Check the final sign and whether the magnitude is physically sensible.'],
  pitfalls:['Setting acceleration to zero at maximum height.','Using SUVAT while acceleration is changing because of significant drag.']
 },
 rp3:{
  keyTerms:[['random error','Unpredictable variation that causes scatter between repeated readings.'],['systematic error','A consistent offset or bias that shifts readings in the same direction.'],['uncertainty','A quantitative estimate of the range within which a measured value is expected to lie.'],['linearisation','Rearranging a relationship so a graph of chosen variables should be a straight line.']],
  depth:[
   'AQA Required Practical 3 is determination of g by a free-fall method. The exact apparatus can vary, but the method must produce a measured displacement and corresponding fall time.',
   'For release from rest with negligible air resistance, h = ½gt². A plot of h against t² should have gradient g/2, so g = 2 × gradient.',
   'Electronic timing such as light gates reduces reaction-time error. Distances should be measured from consistent reference points and over a useful range.',
   'Repeat readings to identify anomalies and reduce random uncertainty in mean values. Repetition does not remove a systematic offset.',
   'A strong evaluation identifies a specific source of error, explains its effect on h, t or g, and proposes a realistic improvement.',
   'The AQA practical skills include identifying random and systematic errors and determining g from a graph.'
  ],
  exam:['Describe how the gradient leads to g rather than just saying “use a graph”.','Separate random uncertainty from systematic error.','For percentage uncertainty, compare absolute uncertainty with the measured value.'],
  pitfalls:['Averaging values of g without considering whether a graph would use all data more effectively.','Claiming repeats remove systematic error.']
 },
 projectiles:{
  keyTerms:[['projectile','An object moving through a gravitational field after launch, with no continuing propulsion in the ideal model.'],['drag','Resistive force opposite relative motion through a fluid.'],['lift','Force approximately perpendicular to relative fluid flow.'],['terminal speed','Constant speed reached when resistive force balances the driving force such as weight.']],
  depth:[
   'Horizontal and vertical components of ideal projectile motion are independent but share the same time.',
   'With negligible air resistance, horizontal acceleration is zero and horizontal velocity is constant. Vertical acceleration is g downward.',
   'Resolve the launch velocity first: uₓ = u cosθ and uᵧ = u sinθ when θ is measured above the horizontal.',
   'Air resistance increases with speed and changes both components of velocity, giving a lower, shorter and generally non-symmetric trajectory than the vacuum model.',
   'For a falling body, drag increases as speed increases. Terminal speed occurs when drag equals weight, so resultant force and acceleration are zero.',
   'AQA requires qualitative treatment of friction, lift and drag and qualitative understanding of factors affecting the maximum speed of a vehicle.'
  ],
  exam:['Treat horizontal and vertical motion in separate columns and link them with time.','State when air resistance is neglected.','Use force balance, not “no forces”, to explain terminal speed.'],
  pitfalls:['Assuming acceleration is zero at the top of a projectile path.','Assuming terminal speed means weight has disappeared.']
 },
 newton:{
  keyTerms:[['inertia','Tendency of an object to maintain its velocity unless acted on by a resultant force.'],['resultant force','Vector sum of all forces acting on one object.'],['free-body diagram','Diagram showing only the external forces acting on the chosen object.'],['third-law pair','Equal and opposite forces of the same interaction acting on different objects.']],
  depth:[
   'Newton’s first law: if the resultant force is zero, an object remains at rest or continues with constant velocity.',
   'For constant mass, Newton’s second law is ΣF = ma. The acceleration is in the direction of the resultant force.',
   'Newton’s third law applies to interactions: if object A exerts a force on B, B exerts an equal and opposite force on A.',
   'Third-law pairs act on different objects and therefore do not cancel on a single free-body diagram.',
   'Free-body diagrams should show forces, not motion arrows. Typical forces include weight, normal contact force, tension, thrust, friction and drag.',
   'On a slope or in connected-body problems, resolve forces along convenient axes before applying ΣF = ma.'
  ],
  exam:['Write an equation from the free-body diagram before inserting numbers.','Name both objects when explaining a Newton III pair.','Use resultant force, not total force magnitude.'],
  pitfalls:['Calling weight and normal reaction on the same object a third-law pair.','Including forces exerted by the object rather than forces acting on it.']
 },
 momentum:{
  keyTerms:[['momentum','Vector quantity p = mv.'],['impulse','Change in momentum; for constant force J = FΔt.'],['closed system','System with negligible resultant external impulse during the interaction.'],['elastic collision','Collision in which total kinetic energy as well as momentum is conserved.']],
  depth:[
   'Linear momentum is conserved when the resultant external force on the system is negligible over the interaction time.',
   'In one-dimensional calculations, choose a positive direction and give velocities signs. Momentum before equals momentum after.',
   'Force is the rate of change of momentum, F = Δp/Δt for average force and F = dp/dt conceptually.',
   'The area under a force–time graph is impulse, equal to change in momentum. This remains valid when force varies with time.',
   'Increasing the contact time for a given momentum change reduces the average impact force. This explains features such as crumple zones and protective packaging.',
   'Momentum is conserved in elastic and inelastic collisions and in explosions. Kinetic energy is conserved only in elastic collisions.'
  ],
  exam:['Define the system before applying momentum conservation.','Keep velocity signs throughout instead of adding directions afterwards.','For force–time graphs, calculate the actual geometric area.'],
  pitfalls:['Assuming momentum conservation means kinetic energy is conserved.','Using speed rather than signed velocity in a one-dimensional collision.']
 },
 work:{
  keyTerms:[['work done','Energy transferred by a force acting through a displacement.'],['power','Rate of doing work or transferring energy.'],['efficiency','Useful output energy or power divided by total input energy or power.'],['variable force','A force whose magnitude changes with displacement.']],
  depth:[
   'For a constant force at angle θ to the displacement, W = Fs cosθ. Only the component parallel to displacement transfers energy by mechanical work.',
   'Kinetic energy is Eₖ = ½mv² and near Earth gravitational potential energy change is ΔEₚ = mgΔh.',
   'Power P = W/t. If a constant force acts parallel to the velocity, P = Fv.',
   'For a variable force, work done is the area under a force–displacement graph.',
   'Efficiency = useful output / total input and may be expressed as a decimal or percentage.',
   'The specification includes practical opportunities such as investigating the efficiency of an electric motor lifting a mass; students should be able to discuss random and systematic errors.'
  ],
  exam:['If force is angled, use the parallel component.','For graph questions, label the area that represents work.','State whether efficiency is a fraction or percentage and keep numerator/denominator consistent.'],
  pitfalls:['Using W = Fs when force is not parallel to displacement.','Using the area under a force–time graph for work; that area is impulse.']
 },
 energy:{
  keyTerms:[['conservation of energy','Total energy of a closed system remains constant.'],['dissipation','Transfer of energy into less useful stores, often internal energy of surroundings.'],['resistive force','Force opposing motion and transferring mechanical energy.'],['mechanical energy','Sum of kinetic and potential energies in the chosen mechanical model.']],
  depth:[
   'Total energy is conserved even when mechanical energy decreases. Resistive forces transfer energy to internal stores and the surroundings.',
   'For changes involving height and speed, write an energy balance such as initial GPE + initial KE = final GPE + final KE + energy dissipated.',
   'Work done against a resistive force is an energy transfer and must be included in the balance.',
   'Energy methods can be quicker than force-and-acceleration methods when only initial and final states matter.',
   'AQA expects both quantitative and qualitative applications involving GPE, KE and work done against resistive forces.'
  ],
  exam:['Define the system and identify all relevant stores/transfers.','Do not say energy is “lost”; say where it is transferred.','Check that both sides of an energy equation have units of joules.'],
  pitfalls:['Assuming kinetic plus GPE is always conserved when resistive forces act.','Confusing conservation of energy with conservation of momentum.']
 },
 'density-hooke':{
  keyTerms:[['density','Mass per unit volume, ρ = m/V.'],['Hooke’s law','Extension is proportional to applied force up to the limit of proportionality.'],['spring constant','Stiffness k = F/ΔL in the linear region.'],['elastic limit','Largest deformation for which the object returns to its original shape when unloaded.']],
  depth:[
   'Density links a bulk sample’s mass and volume. Use SI units kg and m³ to obtain kg m⁻³.',
   'For a Hookean spring or wire, F = kΔL while force is proportional to extension. The gradient of a force–extension graph is k.',
   'The limit of proportionality is the end of the straight-line F–extension region. The elastic limit concerns whether permanent deformation remains after unloading; these ideas are related but not identical.',
   'Elastic strain energy is the area under a force–extension graph. In the linear region E = ½FΔL = ½k(ΔL)².',
   'Spring energy can transform into kinetic or gravitational potential energy, so energy conservation can connect materials and mechanics.'
  ],
  exam:['Convert cm³ or mm³ to m³ before density calculations.','Use extension, not total length, in Hooke’s law.','For non-linear force–extension graphs, use area rather than ½FΔL unless justified.'],
  pitfalls:['Treating the elastic limit and limit of proportionality as exact synonyms.','Using original length in F = kΔL.']
 },
 'stress-strain':{
  keyTerms:[['tensile stress','Force divided by cross-sectional area, σ = F/A.'],['tensile strain','Extension divided by original length, ε = ΔL/L.'],['breaking stress','Stress at which the material fractures.'],['elastic strain energy','Energy stored during elastic deformation.']],
  depth:[
   'Stress allows forces on different-sized samples to be compared by dividing by cross-sectional area. Unit: pascal, Pa.',
   'Strain compares extension with original length and has no unit because it is a ratio of lengths.',
   'The area under a force–extension graph is the work done deforming that particular sample.',
   'For a linearly elastic material, elastic strain energy = ½FΔL. If unloading occurs within the elastic region, this stored energy can be returned.',
   'Breaking stress describes the stress at fracture. It is a material property only when test conditions and material state are appropriately controlled.'
  ],
  exam:['Convert diameter to area using A = πd²/4.','Write strain as a decimal rather than attaching a unit.','Keep sample-level force–extension ideas separate from material-level stress–strain ideas.'],
  pitfalls:['Using diameter directly as area.','Giving strain in metres or percent without noticing what the question requests.']
 },
 'material-behaviour':{
  keyTerms:[['plastic behaviour','Deformation that remains after the force is removed.'],['brittle','Fractures with little or no plastic deformation.'],['fracture','Physical breaking of the material.'],['yield','Onset of substantial plastic deformation in a ductile material.']],
  depth:[
   'A straight initial stress–strain region indicates stress proportional to strain. If unloading occurs in this region, the material returns to its original dimensions.',
   'Beyond the elastic region, a ductile material may deform plastically, so extension remains after unloading.',
   'Brittle materials fracture after relatively little plastic deformation; their stress–strain curves are therefore much shorter in the strain direction.',
   'The area under a stress–strain curve represents energy transferred per unit volume during deformation.',
   'Force–extension curves depend on sample dimensions as well as material, whereas stress–strain curves allow more direct comparison of material behaviour.'
  ],
  exam:['Use graph shape and labelled regions rather than memorised adjectives alone.','Distinguish stiffness (Young modulus) from strength (stress before failure).','When comparing materials, state which graph feature supports the comparison.'],
  pitfalls:['Calling a high Young modulus material “strong” without evidence about breaking stress.','Assuming a ductile material must have a larger Young modulus.']
 },
 young:{
  keyTerms:[['Young modulus','Ratio of tensile stress to tensile strain in the linear elastic region.'],['stiffness','Resistance to elastic deformation; larger E means more stress is needed for the same strain.'],['cross-sectional area','Area normal to the tensile force.'],['linear elastic region','Region where stress is proportional to strain and deformation is recoverable.']],
  depth:[
   'Young modulus E = stress/strain = FL/(AΔL) in the linear elastic region.',
   'On a stress–strain graph, Young modulus is the gradient of the initial straight-line section.',
   'Young modulus is a property of the material, whereas spring constant k depends on the material and the dimensions of the sample.',
   'For a wire, increasing length increases extension for the same stress; increasing cross-sectional area decreases extension for the same force.',
   'Because strain is dimensionless, Young modulus has the same unit as stress: Pa.'
  ],
  exam:['Use original length L and extension ΔL as different quantities.','Convert mm² to m² and mm to m before substitution.','Take the gradient only from the linear elastic region.'],
  pitfalls:['Using the gradient of a force–extension graph as Young modulus directly.','Forgetting area is based on diameter squared.']
 },
 rp4:{
  keyTerms:[['micrometer','Instrument suited to measuring small diameters accurately.'],['reference wire','Wire used in some methods to compensate for support or temperature changes.'],['gradient method','Using a best-fit graph to determine a proportionality constant.'],['percentage uncertainty','Absolute uncertainty divided by measured value × 100%.']],
  depth:[
   'AQA Required Practical 4 is determination of Young modulus by a simple method. A common approach measures original wire length, diameter, load and extension.',
   'Measure diameter at several positions and orientations because wire thickness may vary; use the mean diameter to calculate A = πd²/4.',
   'Load is converted to force using F = mg. Extension is the change in length produced by the load, not the final length.',
   'A graph can be used to reduce the influence of random scatter. For example, plotting stress against strain gives Young modulus as the gradient in the linear region.',
   'Keep within the elastic region so the wire returns to its original length and the Young modulus relationship is valid.',
   'Uncertainty in diameter is especially important because cross-sectional area depends on d².'
  ],
  exam:['Describe exactly how extension is measured and how parallax is reduced.','Explain why multiple diameter readings are taken.','Link the graph gradient to E with units.'],
  pitfalls:['Loading beyond the elastic region and still applying the linear Young modulus model.','Ignoring the squared dependence of area on diameter uncertainty.']
 },
 mastery:{
  keyTerms:[['model selection','Choosing the physics principle that most directly links known and unknown quantities.'],['system','The objects included when applying conservation laws.'],['dimensional check','Checking that equation terms and final answers have compatible units.'],['limiting case','Testing whether a result behaves sensibly when a variable becomes very small, large or zero.']],
  depth:[
   'Mechanics problems often combine several ideas. Start with a diagram, define the system and choose axes before choosing equations.',
   'Use force methods when acceleration or interactions during motion matter; use energy methods when comparing states; use momentum for short interactions; use moments for rotational equilibrium.',
   'Conservation laws require clear system boundaries. External work or impulse can prevent the simple conservation equation from applying to the chosen subsystem.',
   'Graphs may encode the required quantity as a gradient or area. Always identify the physical units of that gradient or area.',
   'A complete A-level solution includes a model assumption, symbolic relationship, substitution with units, numerical answer and physical interpretation.'
  ],
  exam:['Write the governing principle before calculation.','Keep enough significant figures until the final line.','Use a reasonableness check and identify assumptions such as negligible drag or constant acceleration.'],
  pitfalls:['Trying SUVAT automatically without checking acceleration is constant.','Mixing scalar energy equations and vector momentum/force equations without a consistent direction convention.']
 }
};
lessons.forEach(l=>Object.assign(l, lessonExtensions[l.id] || {}));


const lessonSkillMap = {
 vectors:['MS 0.6','MS 4.2','MS 4.4','MS 4.5','PS 1.1'],
 resolution:['MS 0.6','MS 4.2','MS 4.4','MS 4.5','PS 1.1'],
 moments:['Mathematical modelling'],
 kinematics:['MS 3.5','MS 3.6','MS 3.7','PS 1.1','PS 3.1'],
 suvat:['MS 0.5','MS 2.2','MS 2.3','MS 2.4'],
 rp3:['Required Practical 3','AT d','MS 3.9','PS 1.1'],
 projectiles:['PS 2.2','PS 3.1'],
 newton:['PS 4.1','MS 4.1','MS 4.2','AT a/b/d'],
 momentum:['MS 2.2','MS 2.3'],
 work:['MS 0.3','PS 3.3','PS 4.1','AT a/b/f'],
 energy:['MS 0.4','MS 2.2'],
 'density-hooke':['MS 0.2','MS 4.3','AT e','PS 3.3'],
 'stress-strain':['MS 4.3','PS 3.3'],
 'material-behaviour':['MS 4.3'],
 young:['MS 3.1'],
 rp4:['Required Practical 4','MS 3.1'],
 mastery:['Synoptic problem solving']
};
lessons.forEach(l=>l.skills=lessonSkillMap[l.id]||[]);

const lessonPractice = {
 vectors:[
  {q:'A displacement has components 9.0 m east and 12.0 m north. Calculate the resultant magnitude.',type:'number',answer:15,tol:.05,unit:'m',explain:'Use Pythagoras: √(9²+12²)=15 m.'},
  {q:'Why is velocity a vector?',type:'text',keywords:['direction','magnitude'],answerText:'Because velocity has both magnitude and direction.'}
 ],
 resolution:[
  {q:'A 100 N force acts at 60° above the horizontal. Calculate its horizontal component.',type:'number',answer:50,tol:.5,unit:'N',explain:'Fₓ=F cos60°=50 N.'},
  {q:'State the condition for translational equilibrium.',type:'text',keywords:['resultant','zero'],answerText:'The resultant force is zero.'}
 ],
 moments:[
  {q:'A 75 N force acts perpendicularly 0.40 m from a pivot. Calculate the moment.',type:'number',answer:30,tol:.1,unit:'N m',explain:'M=Fd=75×0.40=30 N m.'},
  {q:'What is a couple?',type:'text',keywords:['equal','opposite','parallel','forces'],answerText:'Two equal, opposite, parallel forces acting along different lines.'}
 ],
 kinematics:[
  {q:'Velocity rises uniformly from 3.0 to 15.0 m s⁻¹ in 4.0 s. Calculate the acceleration.',type:'number',answer:3,tol:.03,unit:'m s⁻²',explain:'a=(15−3)/4=3.0 m s⁻².'},
  {q:'What does area under an acceleration–time graph represent?',type:'text',keywords:['change','velocity'],answerText:'The change in velocity.'}
 ],
 suvat:[
  {q:'An object starts from rest and accelerates at 2.5 m s⁻² for 6.0 s. Find its final speed.',type:'number',answer:15,tol:.05,unit:'m s⁻¹',explain:'v=u+at=0+2.5×6=15 m s⁻¹.'},
  {q:'At the highest point of a vertical throw, what is the acceleration?',type:'text',keywords:['9.81','down'],answerText:'Approximately 9.81 m s⁻² downward.'}
 ],
 rp3:[
  {q:'A graph of h against t² has gradient 4.91 m s⁻². Calculate g.',type:'number',answer:9.82,tol:.05,unit:'m s⁻²',explain:'h=(g/2)t², so g=2×gradient.'},
  {q:'Do repeated readings remove systematic error?',type:'text',keywords:['no'],answerText:'No. Repeats reduce random uncertainty but do not remove a systematic offset.'}
 ],
 projectiles:[
  {q:'A ball is launched horizontally at 8.0 m s⁻¹ for 0.60 s. Ignoring drag, calculate horizontal displacement.',type:'number',answer:4.8,tol:.03,unit:'m',explain:'x=uₓt=8.0×0.60=4.8 m.'},
  {q:'Why is acceleration not zero at the top of a projectile path?',type:'text',keywords:['gravity','down'],answerText:'Gravity still acts downward, so acceleration remains g downward.'}
 ],
 newton:[
  {q:'A 4.0 kg object experiences a resultant force of 18 N. Calculate acceleration.',type:'number',answer:4.5,tol:.03,unit:'m s⁻²',explain:'a=F/m=18/4=4.5 m s⁻².'},
  {q:'Why do Newton third-law forces not cancel on one free-body diagram?',type:'text',keywords:['different','objects'],answerText:'They act on different interacting objects.'}
 ],
 momentum:[
  {q:'A 0.50 kg trolley travels at 6.0 m s⁻¹. Calculate its momentum.',type:'number',answer:3,tol:.02,unit:'kg m s⁻¹',explain:'p=mv=0.50×6.0=3.0 kg m s⁻¹.'},
  {q:'What does area under a force–time graph represent?',type:'text',keywords:['impulse'],answerText:'Impulse, which equals change in momentum.'}
 ],
 work:[
  {q:'A constant 40 N force moves an object 3.0 m in the same direction. Calculate work done.',type:'number',answer:120,tol:.2,unit:'J',explain:'W=Fs=40×3=120 J.'},
  {q:'What graph area represents work done by a varying force?',type:'text',keywords:['force','displacement'],answerText:'Area under a force–displacement graph.'}
 ],
 energy:[
  {q:'A 2.0 kg object falls through 5.0 m. Calculate the GPE decrease using g=9.81 m s⁻².',type:'number',answer:98.1,tol:.2,unit:'J',explain:'ΔEₚ=mgΔh=2×9.81×5=98.1 J.'},
  {q:'If mechanical energy decreases because of friction, is total energy destroyed?',type:'text',keywords:['no','transferred'],answerText:'No. Energy is transferred to other stores, commonly internal energy.'}
 ],
 'density-hooke':[
  {q:'A 0.60 kg sample has volume 2.0×10⁻⁴ m³. Calculate density.',type:'number',answer:3000,tol:5,unit:'kg m⁻³',explain:'ρ=m/V=0.60/(2.0×10⁻⁴)=3000 kg m⁻³.'},
  {q:'What is the difference between extension and total length?',type:'text',keywords:['change','length'],answerText:'Extension is the change in length from the original length.'}
 ],
 'stress-strain':[
  {q:'A force of 200 N acts on area 4.0×10⁻⁶ m². Calculate tensile stress.',type:'number',answer:5e7,tol:1e5,unit:'Pa',explain:'σ=F/A=200/(4×10⁻⁶)=5.0×10⁷ Pa.'},
  {q:'Does tensile strain have a unit?',type:'text',keywords:['no'],answerText:'No. It is a ratio of two lengths.'}
 ],
 'material-behaviour':[
  {q:'A material returns to its original dimensions after unloading. Is the deformation elastic or plastic?',type:'text',keywords:['elastic'],answerText:'Elastic.'},
  {q:'What graph feature distinguishes a more ductile material?',type:'text',keywords:['strain'],answerText:'It reaches a larger strain before fracture / has a larger plastic region.'}
 ],
 young:[
  {q:'Stress is 1.5×10⁸ Pa and strain is 7.5×10⁻⁴. Calculate Young modulus.',type:'number',answer:2e11,tol:2e8,unit:'Pa',explain:'E=stress/strain=2.0×10¹¹ Pa.'},
  {q:'What does the gradient of the initial linear stress–strain graph represent?',type:'text',keywords:['young','modulus'],answerText:'Young modulus.'}
 ],
 rp4:[
  {q:'Why is uncertainty in wire diameter especially important?',type:'text',keywords:['area','squared'],answerText:'Area depends on diameter squared, A=πd²/4.'},
  {q:'Why should several diameter readings be taken?',type:'text',keywords:['variation','mean'],answerText:'To account for variation in diameter and obtain a more reliable mean.'}
 ],
 mastery:[
  {q:'Before choosing an equation in an unfamiliar mechanics problem, what should you identify first?',type:'text',keywords:['system','diagram'],answerText:'Define the system and represent the situation with a clear diagram / variables.'},
  {q:'What two checks should follow a numerical answer?',type:'text',keywords:['unit','sensible'],answerText:'Check units/dimensions and physical reasonableness.'}
 ]
};

const masteryState = JSON.parse(localStorage.getItem('mechanicsMastery')||'{}');
function masteryCodeForLesson(l){
 if(l.id==='rp3') return 'RP3';
 if(l.id==='rp4') return 'RP4';
 const m=(l.code||'').match(/3\.4\.\d\.\d/); return m?m[0]:'3.4';
}
function recordMastery(code,correct){
 if(!masteryState[code]) masteryState[code]={correct:0,total:0};
 masteryState[code].total+=1;
 if(correct) masteryState[code].correct+=1;
 localStorage.setItem('mechanicsMastery',JSON.stringify(masteryState));
 renderMasteryPanel();
}
function masteryPct(code){
 const m=masteryState[code]; return m&&m.total ? Math.round(100*m.correct/m.total) : null;
}
function renderMasteryPanel(){
 const grid=$('#masteryGrid'),pctEl=$('#masteryPercent'),sumEl=$('#masterySummary'),nextEl=$('#nextBestAction');
 if(!grid||!pctEl||!sumEl||!nextEl)return;
 const rows=spec.map(s=>({code:s[0],title:s[1],pct:masteryPct(s[0]),attempts:(masteryState[s[0]]||{}).total||0,lesson:s[3]}));
 const attempted=rows.filter(r=>r.attempts>0);
 const total=attempted.reduce((a,r)=>a+r.attempts,0),correct=attempted.reduce((a,r)=>a+((masteryState[r.code]||{}).correct||0),0);
 const overall=total?Math.round(100*correct/total):0;
 pctEl.textContent=overall+'%';
 sumEl.textContent=total?correct+' correct from '+total+' tracked attempts.':'Answer questions to build a topic profile.';
 grid.innerHTML=rows.map(r=>'<article class="mastery-topic"><div class="mastery-line"><strong>'+r.code+'</strong><small>'+(r.pct===null?'Not tested':r.pct+'%')+'</small></div><div class="mastery-bar"><span style="width:'+(r.pct===null?0:r.pct)+'%"></span></div><small>'+r.title+'</small></article>').join('');
 const weakest=attempted.slice().sort((a,b)=>(a.pct??101)-(b.pct??101))[0];
 if(weakest && weakest.pct<80){
  nextEl.innerHTML='Recommended next step: revisit <strong>'+weakest.title+'</strong> ('+weakest.code+'), then retry related questions.';
 }else if(total){
  nextEl.textContent='Strong profile so far. Continue mixed practice to confirm mastery across every specification point.';
 }else{
  nextEl.textContent='Complete some exam or lesson questions to receive a recommended next step.';
 }
}
function renderLessonPractice(l){
 const qs=lessonPractice[l.id]||[];
 return '<div class="practice-stack">'+qs.map((q,i)=>'<div class="practice-question"><p><strong>'+(i+1)+'. '+q.q+'</strong></p><div class="practice-entry"><input '+(q.type==='number'?'type="number" step="any"':'type="text"')+' data-practice-input="'+i+'" placeholder="Enter your answer"><button class="button" data-practice-check="'+i+'">Check answer</button></div><div class="practice-feedback hidden" data-practice-feedback="'+i+'"></div></div>').join('')+'</div>';
}
function bindLessonPractice(l){
 $$('[data-practice-check]',$('#lessonPanel')).forEach(b=>b.addEventListener('click',()=>{
  const i=Number(b.dataset.practiceCheck),q=(lessonPractice[l.id]||[])[i],input=$('[data-practice-input="'+i+'"]',$('#lessonPanel')),fb=$('[data-practice-feedback="'+i+'"]',$('#lessonPanel'));
  let ok=false;
  if(q.type==='number'){
   const val=Number(input.value); ok=Number.isFinite(val)&&Math.abs(val-q.answer)<=q.tol;
  }else{
   const text=input.value.toLowerCase(); ok=(q.keywords||[]).every(k=>text.includes(k.toLowerCase()));
  }
  fb.className='practice-feedback '+(ok?'good':'bad');
  fb.textContent=(ok?'Correct. ':'Not quite. ')+(q.explain||q.answerText||'');
  recordMastery(masteryCodeForLesson(l),ok);
 }));
}

const completed = new Set(JSON.parse(localStorage.getItem('mechanicsCompleted') || '[]'));
let activeLesson = 0;

function saveProgress(){
 localStorage.setItem('mechanicsCompleted',JSON.stringify(Array.from(completed)));
 const pct = lessons.length ? 100*completed.size/lessons.length : 0;
 $('#progressText').textContent = completed.size+' / '+lessons.length+' complete';
 $('#progressFill').style.width = pct+'%';
 renderSpec();
}
function renderCourseList(){
 const host=$('#courseList');
 host.innerHTML='';
 lessons.forEach((l,i)=>{
  const b=document.createElement('button');
  b.className='course-button'+(i===activeLesson?' active':'')+(completed.has(l.id)?' complete':'');
  b.innerHTML='<span class="course-code">'+l.code+'</span><span class="course-title">'+l.title+'</span>';
  b.addEventListener('click',()=>{activeLesson=i;renderCourseList();renderLesson();});
  host.appendChild(b);
 });
}
function lessonChunk(title,id,html,active=false){
 return '<section class="chunk '+(active?'active':'')+'" data-chunk-panel="'+id+'"><div class="lesson-block"><h3>'+title+'</h3>'+html+'</div></section>';
}
function renderLesson(){
 const l=lessons[activeLesson];
 const saved=JSON.parse(localStorage.getItem('mechanicsLessonAnswers')||'{}');
 const answerKey=(kind,i='')=>l.id+'::'+kind+'::'+i;
 let retrieval=l.retrieval.map((r,i)=>'<div class="mini-question"><p><strong>'+(i+1)+'. '+r.q+'</strong></p><textarea class="student-answer" data-answer-key="'+answerKey('retrieval',i)+'" placeholder="Type your answer here...">'+(saved[answerKey('retrieval',i)]||'')+'</textarea><button class="text-button reveal-answer">Show answer</button><div class="answer-reveal">'+r.a+'</div></div>').join('');
 let objectives='<ul>'+l.objectives.map(x=>'<li>'+x+'</li>').join('')+'</ul><div class="skill-row">'+(l.skills||[]).map(x=>'<span class="skill-badge">'+x+'</span>').join('')+'</div>';
 let core='<div class="textbook-note"><strong>Core explanation</strong><p>Work through each statement slowly. These notes are aligned to the AQA specification point shown above.</p></div><ul>'+l.core.map(x=>'<li>'+x+'</li>').join('')+'</ul>';
 let terms='<div class="term-grid">'+(l.keyTerms||[]).map(t=>'<article class="term-card"><strong>'+t[0]+'</strong><span>'+t[1]+'</span></article>').join('')+'</div>';
 let depth='<div class="depth-list">'+(l.depth||[]).map((x,i)=>'<article class="depth-card"><span class="depth-number">'+(i+1)+'</span><p>'+x+'</p></article>').join('')+'</div>';
 let worked='<p><strong>Question:</strong> '+l.worked.q+'</p><button class="text-button reveal-answer">Show worked answer</button><div class="answer-reveal">'+l.worked.a+'</div>';
 let practice=renderLessonPractice(l);
 let task='<p>'+l.task+'</p><textarea class="student-answer" data-answer-key="'+answerKey('task')+'" placeholder="Record your working, prediction or explanation...">'+(saved[answerKey('task')]||'')+'</textarea>';
 let technique='<div class="exam-grid"><article class="exam-tip"><h4>Exam technique</h4><ul>'+(l.exam||[]).map(x=>'<li>'+x+'</li>').join('')+'</ul></article><article class="exam-tip warning"><h4>Common traps</h4><ul>'+(l.pitfalls||[]).map(x=>'<li>'+x+'</li>').join('')+'</ul></article></div>';
 let check='<div class="mini-question"><p><strong>'+l.check.q+'</strong></p><div class="mini-options">'+l.check.choices.map((x,i)=>'<button class="mini-option" data-mini="'+i+'">'+x+'</button>').join('')+'</div><div class="feedback hidden" data-mini-feedback></div></div>';
 let exit='<p>'+l.exit+'</p><textarea class="student-answer" data-answer-key="'+answerKey('exit')+'" placeholder="Write your exit-ticket answer...">'+(saved[answerKey('exit')]||'')+'</textarea>';
 const chunks=[
  ['retrieval','1 · Retrieval'],['objectives','2 · Objectives'],['core','3 · Core teaching'],['terms','4 · Key terms'],['depth','5 · AQA depth'],['worked','6 · Worked example'],['practice','7 · Auto-mark practice'],['task','8 · Apply it'],['technique','9 · Exam technique'],['check','10 · Check'],['exit','11 · Exit']
 ];
 $('#lessonPanel').innerHTML =
  '<span class="eyebrow">'+l.code+'</span><h2>'+l.title+'</h2><p class="lesson-lead">'+l.lead+'</p>'+
  '<div>'+l.formulas.map(f=>'<span class="formula-chip">'+f+'</span>').join('')+'</div>'+
  '<div class="spec-coverage"><strong>AQA coverage:</strong> This lesson is mapped to '+l.code+' and includes the examinable content, mathematical treatment and practical/graph skills relevant to this part of Mechanics & Materials.</div>'+
  '<div class="chunk-strip">'+chunks.map((c,i)=>'<button class="chunk-button '+(i===0?'active':'')+'" data-chunk="'+c[0]+'">'+c[1]+'</button>').join('')+'</div>'+
  lessonChunk('Retrieval starter', 'retrieval', retrieval, true)+
  lessonChunk('Learning objectives','objectives',objectives)+
  lessonChunk('Core teaching','core',core)+
  lessonChunk('Key vocabulary','terms',terms)+
  lessonChunk('AQA specification depth','depth',depth)+
  lessonChunk('Worked example','worked',worked)+
  lessonChunk('Auto-marked practice','practice',practice)+
  lessonChunk('Apply it','task',task)+
  lessonChunk('Exam technique and misconceptions','technique',technique)+
  lessonChunk('Knowledge check','check',check)+
  lessonChunk('Exit ticket','exit',exit)+
  '<div class="lesson-actions"><button class="button primary" id="completeLesson">'+(completed.has(l.id)?'Completed ✓':'Mark lesson complete')+'</button><button class="button" id="openLessonSim">Open linked simulation</button>'+(activeLesson<lessons.length-1?'<button class="button" id="nextLessonBtn">Next lesson →</button>':'')+'</div>';

 $$('.chunk-button',$('#lessonPanel')).forEach(b=>b.addEventListener('click',()=>{
  $$('.chunk-button',$('#lessonPanel')).forEach(x=>x.classList.remove('active'));
  $$('.chunk',$('#lessonPanel')).forEach(x=>x.classList.remove('active'));
  b.classList.add('active');
  $('[data-chunk-panel="'+b.dataset.chunk+'"]',$('#lessonPanel')).classList.add('active');
 }));
 $$('.reveal-answer',$('#lessonPanel')).forEach(b=>b.addEventListener('click',()=>{
  const ans=b.nextElementSibling; ans.classList.toggle('visible'); b.textContent=ans.classList.contains('visible')?'Hide answer':'Show answer';
 }));
 $$('.student-answer',$('#lessonPanel')).forEach(t=>t.addEventListener('input',()=>{
   const data=JSON.parse(localStorage.getItem('mechanicsLessonAnswers')||'{}');
   data[t.dataset.answerKey]=t.value;
   localStorage.setItem('mechanicsLessonAnswers',JSON.stringify(data));
 }));
 bindLessonPractice(l);
 $$('.mini-option',$('#lessonPanel')).forEach(b=>b.addEventListener('click',()=>{
  const all=$$('.mini-option',$('#lessonPanel')); all.forEach(x=>{x.disabled=true;x.classList.remove('correct','wrong')});
  const chosen=Number(b.dataset.mini); b.classList.add(chosen===l.check.answer?'correct':'wrong'); all[l.check.answer].classList.add('correct');
  const fb=$('[data-mini-feedback]',$('#lessonPanel')); fb.classList.remove('hidden'); fb.textContent=(chosen===l.check.answer?'Correct. ':'Not quite. ')+l.check.explain;
  recordMastery(masteryCodeForLesson(l),chosen===l.check.answer);
 }));
 $('#completeLesson').addEventListener('click',()=>{
  if(completed.has(l.id)) completed.delete(l.id); else completed.add(l.id);
  saveProgress();renderCourseList();renderLesson();
 });
 $('#openLessonSim').addEventListener('click',()=>{openView('lab');setSimById(l.sim);});
 if($('#nextLessonBtn')) $('#nextLessonBtn').addEventListener('click',()=>{activeLesson++;renderCourseList();renderLesson();window.scrollTo({top:250,behavior:'smooth'});});
}

function openView(name){
 $$('.view').forEach(v=>v.classList.toggle('active-view',v.id==='view-'+name));
 $$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
}
$$('.nav-button').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.view)));
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.jump)));
$('#resetProgress').addEventListener('click',()=>{completed.clear();saveProgress();renderCourseList();renderLesson();});

const sims = [
{id:'vectors',code:'3.4.1.1',title:'Vector components',subtitle:'Resolve a vector and see its perpendicular components.',controls:[
 {key:'mag',label:'Vector magnitude / N',min:10,max:100,step:1,value:60},
 {key:'angle',label:'Angle above horizontal / °',min:0,max:90,step:1,value:35}
],simple:'A vector can be replaced by perpendicular horizontal and vertical components with exactly the same combined effect.',exam:'For an angle measured from the horizontal, use Fₓ = F cosθ and Fᵧ = F sinθ. State the direction of the final vector.',mistake:'Do not decide sine/cosine from memory alone; identify the adjacent and opposite sides relative to the stated angle.',check:['At 0°, which component equals the full vector?','The horizontal component.'],investigate:'Set 30°, 45° and 60°. Compare how the two components change while the vector magnitude stays fixed.'},
{id:'equilibrium',code:'3.4.1.1',title:'Three-force equilibrium',subtitle:'Build a closed vector triangle for three coplanar forces acting at a point.',controls:[
 {key:'f1',label:'Force 1 / N',min:10,max:100,step:2,value:50},
 {key:'a1',label:'Force 1 angle / °',min:0,max:180,step:5,value:20},
 {key:'f2',label:'Force 2 / N',min:10,max:100,step:2,value:65},
 {key:'a2',label:'Force 2 angle / °',min:0,max:180,step:5,value:125}
],simple:'For equilibrium the third force must be equal and opposite to the resultant of the first two forces.',exam:'For three coplanar forces in equilibrium, the vector sum is zero. The three vectors form a closed triangle when placed head-to-tail.',mistake:'Equilibrium means zero resultant force, not zero individual forces.',check:['What must the vector sum of forces equal in equilibrium?','Zero.'],investigate:'Change both angles and compare the magnitude/direction of the balancing third force.'},
{id:'moments',code:'3.4.1.2',title:'Moments and balance',subtitle:'Change force and perpendicular distance to see the turning effect.',controls:[
 {key:'force',label:'Applied force / N',min:10,max:120,step:5,value:60},
 {key:'distance',label:'Perpendicular distance / m',min:.1,max:1.2,step:.05,value:.6}
],simple:'Moment increases when either force or perpendicular distance from the pivot increases.',exam:'Moment about a point = force × perpendicular distance from the point to the force’s line of action.',mistake:'The distance is to the line of action, not simply the distance to where the force is applied.',check:['What happens to the moment if distance doubles at fixed force?','The moment doubles.'],investigate:'Keep the moment at about 36 N m using at least three different force–distance combinations.'},
{id:'motion',code:'3.4.1.3',title:'Motion + graph links',subtitle:'Watch position and velocity evolve while the live velocity–time graph builds.',controls:[
 {key:'u',label:'Initial velocity / m s⁻¹',min:-10,max:25,step:1,value:4},
 {key:'a',label:'Acceleration / m s⁻²',min:-5,max:5,step:.5,value:2}
],simple:'Constant acceleration changes velocity by the same amount each second. The live graph shows this as a straight line.',exam:'For constant acceleration, v = u + at and s = ut + ½at². Gradient of the v–t graph is acceleration; area is displacement.',mistake:'SUVAT is not valid over an interval in which acceleration changes.',check:['If a = 0, what happens to the velocity–time graph?','It becomes horizontal because velocity is constant.'],investigate:'Try positive, zero and negative acceleration. Predict the graph gradient and whether the object changes direction.'},
{id:'projectile',code:'3.4.1.4',title:'Projectile motion + drag',subtitle:'Compare ideal motion with a simple linear-drag model and inspect velocity components.',controls:[
 {key:'speed',label:'Launch speed / m s⁻¹',min:5,max:35,step:1,value:20},
 {key:'angle',label:'Launch angle / °',min:5,max:85,step:1,value:45},
 {key:'drag',label:'Linear drag constant / s⁻¹',min:0,max:.20,step:.01,value:0}
],simple:'Horizontal and vertical components share the same time. Without drag, only the vertical component accelerates. Drag reduces both components.',exam:'Resolve the launch velocity, solve vertical and horizontal motion separately, and use the same time. Treat lift/drag qualitatively unless a model is supplied.',mistake:'At maximum height vertical velocity is zero, but acceleration is still downward.',check:['Without drag, what is horizontal acceleration?','Zero.'],investigate:'Compare the same launch with drag = 0 and drag > 0. Note the change in range, peak height and symmetry.'},
{id:'terminal',code:'3.4.1.4',title:'Terminal speed',subtitle:'Watch drag increase with speed until it balances weight.',controls:[
 {key:'mass',label:'Mass / kg',min:.2,max:5,step:.2,value:1.2},
 {key:'k',label:'Linear drag coefficient / N s m⁻¹',min:.5,max:12,step:.5,value:3}
],simple:'As speed increases, drag grows. The resultant force becomes smaller until drag equals weight and acceleration becomes zero.',exam:'Terminal speed occurs when the resistive force balances the driving force, so resultant force and acceleration are zero.',mistake:'Terminal speed does not mean no forces act; the forces are balanced.',check:['At terminal speed, what is the resultant force?','Zero.'],investigate:'Increase mass, then increase drag coefficient. Predict which change increases the terminal speed in this teaching model.'},
{id:'newton',code:'3.4.1.5',title:'Newton’s laws + free-body view',subtitle:'See driving force, resistance, resultant force and acceleration together.',controls:[
 {key:'drive',label:'Driving force / N',min:0,max:5000,step:100,value:3000},
 {key:'resist',label:'Resistance / N',min:0,max:2500,step:100,value:800},
 {key:'mass',label:'Mass / kg',min:500,max:2000,step:50,value:1200}
],simple:'Acceleration depends on the resultant force. Equal driving and resistive forces produce zero acceleration, not necessarily zero velocity.',exam:'Construct a free-body diagram, choose a positive direction, calculate ΣF, then use ΣF = ma for constant mass.',mistake:'Do not put the driving force into F = ma without subtracting opposing forces.',check:['If resultant force is zero, what is acceleration?','Zero.'],investigate:'Keep the resultant force fixed while changing mass. Check the inverse relationship between mass and acceleration.'},
{id:'momentum',code:'3.4.1.6',title:'Momentum collision',subtitle:'Model a one-dimensional perfectly inelastic collision and compare momentum with kinetic energy.',controls:[
 {key:'m1',label:'Mass 1 / kg',min:.5,max:4,step:.5,value:1},
 {key:'v1',label:'Velocity 1 / m s⁻¹',min:-8,max:8,step:1,value:5},
 {key:'m2',label:'Mass 2 / kg',min:.5,max:4,step:.5,value:2},
 {key:'v2',label:'Velocity 2 / m s⁻¹',min:-8,max:8,step:1,value:0}
],simple:'When the trolleys stick, total momentum is unchanged if external impulse is negligible, but kinetic energy usually decreases.',exam:'Use signed velocities: m₁u₁ + m₂u₂ = (m₁+m₂)v for a sticking collision.',mistake:'Momentum conservation does not imply kinetic-energy conservation.',check:['What is conserved in both elastic and inelastic collisions in a closed system?','Total momentum.'],investigate:'Try collisions with one trolley moving in the negative direction. Check that signs are essential.'},
{id:'impulse',code:'3.4.1.6',title:'Force–time impulse graph',subtitle:'Change peak force and contact time; the shaded area is impulse.',controls:[
 {key:'peak',label:'Peak force / N',min:100,max:5000,step:100,value:2400},
 {key:'time',label:'Contact time / s',min:.01,max:.30,step:.01,value:.08},
 {key:'mass',label:'Object mass / kg',min:.1,max:5,step:.1,value:.8}
],simple:'Impulse is the area under a force–time graph. For the triangular pulse shown, J = ½ × peak force × contact time.',exam:'Area under an F–t graph = impulse = Δp. For a given Δp, increasing contact time reduces the average force.',mistake:'Area under force–time is not work; work comes from a force–displacement graph.',check:['What physical quantity is represented by area under an F–t graph?','Impulse, equal to change in momentum.'],investigate:'Keep impulse roughly constant while increasing contact time. Observe how the peak force can be reduced.'},
{id:'energy',code:'3.4.1.7–8',title:'Energy transfer on a track',subtitle:'Track GPE, KE and dissipated energy throughout the motion.',controls:[
 {key:'height',label:'Starting height / m',min:.5,max:8,step:.5,value:4},
 {key:'mass',label:'Mass / kg',min:.5,max:5,step:.5,value:2},
 {key:'loss',label:'Energy dissipated / %',min:0,max:60,step:5,value:10}
],simple:'As height decreases, GPE can transfer to KE. Resistive forces transfer some energy to internal stores while total energy is conserved.',exam:'Write an energy balance and include work done against resistive forces. Mechanical energy can decrease while total energy remains conserved.',mistake:'Do not say energy is lost; identify where it is transferred.',check:['If no energy is dissipated, what happens to the lost GPE in this model?','It becomes kinetic energy.'],investigate:'Compare 0%, 20% and 50% dissipation. Relate the final speed to the energy available for KE.'},
{id:'workgraph',code:'3.4.1.7',title:'Variable force + work graph',subtitle:'The shaded area under force–displacement gives work done.',controls:[
 {key:'f0',label:'Starting force / N',min:0,max:120,step:5,value:20},
 {key:'f1',label:'Final force / N',min:0,max:120,step:5,value:80},
 {key:'distance',label:'Displacement / m',min:.5,max:8,step:.5,value:4}
],simple:'When force changes with displacement, work is found from the area under the force–displacement graph.',exam:'For a straight-line change in force, the area is a trapezium: W = ½(F₀ + F₁)s.',mistake:'Do not multiply the final force by distance unless the force is constant at that value.',check:['What does area under an F–s graph represent?','Work done / energy transferred.'],investigate:'Set F₀ = F₁ to recover the constant-force case, then compare with a changing-force case.'},
{id:'density',code:'3.4.2.1',title:'Density and sample dimensions',subtitle:'Relate mass and volume and see how dimensions determine bulk density.',controls:[
 {key:'mass',label:'Mass / g',min:20,max:1000,step:10,value:270},
 {key:'length',label:'Length / cm',min:1,max:12,step:.5,value:5},
 {key:'width',label:'Width / cm',min:1,max:10,step:.5,value:4},
 {key:'height',label:'Height / cm',min:1,max:10,step:.5,value:2.5}
],simple:'Density is mass divided by volume. For a cuboid, volume is length × width × height.',exam:'Convert mass to kg and dimensions to metres before using ρ=m/V in SI units.',mistake:'A volume conversion is cubed: 1 cm³ = 10⁻⁶ m³.',check:['What is the SI unit of density?','kg m⁻³.'],investigate:'Double one dimension while keeping mass fixed. Predict and check how density changes in this model.'},
{id:'elasticity',code:'3.4.2.1–2',title:'Elastic wire + Young modulus',subtitle:'Link force, area and original length to stress, strain and extension.',controls:[
 {key:'force',label:'Tension / N',min:0,max:120,step:5,value:50},
 {key:'length',label:'Original length / m',min:.5,max:3,step:.1,value:1.5},
 {key:'area',label:'Area / mm²',min:.1,max:1.2,step:.05,value:.4},
 {key:'young',label:'Young modulus / GPa',min:20,max:220,step:10,value:200}
],simple:'Stress compares force with area; strain compares extension with original length. Young modulus measures stiffness in the linear elastic region.',exam:'E = stress/strain = FL/(AΔL). Young modulus is the gradient of the linear stress–strain region.',mistake:'Convert mm² to m² and keep original length separate from extension.',check:['What does a larger Young modulus mean?','A stiffer material.'],investigate:'Double the original length, then double the area. Predict how extension changes for the same force and material.'},
{id:'stressstrain',code:'3.4.2.1–2',title:'Stress–strain material behaviour',subtitle:'Move through elastic, plastic and fracture regions on a simplified material curve.',controls:[
 {key:'strain',label:'Applied strain',min:0,max:.080,step:.001,value:.010},
 {key:'young',label:'Young modulus / GPa',min:20,max:220,step:10,value:120},
 {key:'yield',label:'Yield stress / MPa',min:80,max:500,step:20,value:240},
 {key:'break',label:'Breaking strain',min:.025,max:.100,step:.005,value:.070}
],simple:'The initial straight region is elastic. Beyond yield, a ductile teaching model shows plastic deformation until fracture.',exam:'Young modulus is the gradient of the initial linear stress–strain graph. Strength and stiffness are different properties.',mistake:'A material with a high Young modulus is stiff, but that alone does not tell you its breaking stress.',check:['What does the initial stress–strain gradient represent?','Young modulus.'],investigate:'Compare high and low Young modulus while keeping yield stress similar. Then change breaking strain to model more or less ductile behaviour.'}
];
let activeSim=0, simValues={}, running=true, slow=false, simTime=0, last=performance.now();
const canvas=$('#simCanvas'), ctx=canvas.getContext('2d');

function setSimById(id){
 const i=sims.findIndex(s=>s.id===id); if(i>=0){activeSim=i;renderSim();}
}
function renderSimTabs(){
 $('#simTabs').innerHTML=sims.map((s,i)=>'<button class="sim-tab '+(i===activeSim?'active':'')+'" data-sim="'+i+'">'+s.title+'</button>').join('');
 $$('.sim-tab').forEach(b=>b.addEventListener('click',()=>{activeSim=Number(b.dataset.sim);renderSim();}));
}
function renderSim(){
 const s=sims[activeSim]; simValues={}; s.controls.forEach(c=>simValues[c.key]=c.value); simTime=0;
 renderSimTabs();
 $('#simCode').textContent=s.code; $('#simSpec').textContent='AQA '+s.code; $('#simTitle').textContent=s.title; $('#simSubtitle').textContent=s.subtitle;
 $('#simpleExplain').textContent=s.simple; $('#examExplain').textContent=s.exam; $('#mistakeExplain').textContent=s.mistake;
 $('#simCheck').innerHTML='<p>'+s.check[0]+'</p><button class="text-button" id="revealSimCheck">Show answer</button><div class="answer-reveal">'+s.check[1]+'</div><div class="sim-investigate"><strong>Try this investigation:</strong> '+s.investigate+'</div>';
 $('#revealSimCheck').addEventListener('click',e=>{const a=e.target.nextElementSibling;a.classList.toggle('visible');e.target.textContent=a.classList.contains('visible')?'Hide answer':'Show answer';});
 $('#simControls').innerHTML=s.controls.map(c=>'<label class="field"><span>'+c.label+'</span><input type="range" data-control="'+c.key+'" min="'+c.min+'" max="'+c.max+'" step="'+c.step+'" value="'+c.value+'"><output data-output="'+c.key+'">'+c.value+'</output></label>').join('');
 $$('[data-control]').forEach(inp=>inp.addEventListener('input',()=>{simValues[inp.dataset.control]=Number(inp.value);$('[data-output="'+inp.dataset.control+'"]').textContent=inp.value;simTime=0;updateReadout();}));
 updateReadout();
}

function updateReadout(){
 const s=sims[activeSim].id, v=simValues; let txt='';
 if(s==='vectors'){const x=v.mag*Math.cos(v.angle*Math.PI/180),y=v.mag*Math.sin(v.angle*Math.PI/180);txt='Fₓ = '+fmt(x)+' N   |   Fᵧ = '+fmt(y)+' N';}
 if(s==='equilibrium'){const r1=v.a1*Math.PI/180,r2=v.a2*Math.PI/180,x=v.f1*Math.cos(r1)+v.f2*Math.cos(r2),y=v.f1*Math.sin(r1)+v.f2*Math.sin(r2),f3=Math.hypot(x,y),ang=(Math.atan2(-y,-x)*180/Math.PI+360)%360;txt='Balancing force = '+fmt(f3)+' N at '+fmt(ang)+'° from +x';}
 if(s==='moments'){txt='Moment = '+fmt(v.force*v.distance)+' N m';}
 if(s==='motion'){const t=simTime%8,vel=v.u+v.a*t,pos=v.u*t+.5*v.a*t*t;txt='t = '+fmt(t)+' s   |   v = '+fmt(vel)+' m s⁻¹   |   s = '+fmt(pos)+' m';}
 if(s==='projectile'){const r=v.angle*Math.PI/180,ux=v.speed*Math.cos(r),uy=v.speed*Math.sin(r);txt='uₓ = '+fmt(ux)+' m s⁻¹   |   uᵧ = '+fmt(uy)+' m s⁻¹   |   drag constant = '+fmt(v.drag)+' s⁻¹';}
 if(s==='terminal'){const vt=v.mass*9.81/v.k,t=simTime%8,speed=vt*(1-Math.exp(-v.k*t/v.mass)),drag=v.k*speed,result=v.mass*9.81-drag;txt='vₜ ≈ '+fmt(vt)+' m s⁻¹   |   v = '+fmt(speed)+' m s⁻¹   |   drag = '+fmt(drag)+' N   |   ΣF = '+fmt(result)+' N';}
 if(s==='newton'){const r=v.drive-v.resist,a=r/v.mass;txt='Resultant force = '+fmt(r)+' N   |   a = '+fmt(a)+' m s⁻²';}
 if(s==='momentum'){const p=v.m1*v.v1+v.m2*v.v2,fin=p/(v.m1+v.m2),kei=.5*v.m1*v.v1*v.v1+.5*v.m2*v.v2*v.v2,kef=.5*(v.m1+v.m2)*fin*fin;txt='Total p = '+fmt(p)+' kg m s⁻¹   |   final v = '+fmt(fin)+' m s⁻¹   |   KE change = '+fmt(kef-kei)+' J';}
 if(s==='impulse'){const J=.5*v.peak*v.time,dv=J/v.mass;txt='Impulse = area = '+fmt(J)+' N s   |   |Δp| = '+fmt(J)+' kg m s⁻¹   |   |Δv| = '+fmt(dv)+' m s⁻¹';}
 if(s==='energy'){const gpe=v.mass*9.81*v.height,ke=gpe*(1-v.loss/100),speed=Math.sqrt(Math.max(0,2*ke/v.mass));txt='Initial GPE = '+fmt(gpe)+' J   |   final KE available = '+fmt(ke)+' J   |   final v ≈ '+fmt(speed)+' m s⁻¹';}
 if(s==='workgraph'){const W=.5*(v.f0+v.f1)*v.distance;txt='Work = area = ½('+fmt(v.f0)+' + '+fmt(v.f1)+') × '+fmt(v.distance)+' = '+fmt(W)+' J';}
 if(s==='density'){const Vcm=v.length*v.width*v.height,V=Vcm*1e-6,rho=(v.mass/1000)/V;txt='Volume = '+fmt(Vcm)+' cm³   |   density = '+fmt(rho)+' kg m⁻³';}
 if(s==='elasticity'){const A=v.area*1e-6,E=v.young*1e9,stress=v.force/A,strain=stress/E,ext=strain*v.length;txt='stress = '+stress.toExponential(2)+' Pa   |   strain = '+strain.toExponential(2)+'   |   ΔL = '+(ext*1000).toFixed(3)+' mm';}
 if(s==='stressstrain'){const E=v.young*1e9,y=v.yield*1e6,epsY=y/E,broken=v.strain>=v.break,stress=broken?0:(v.strain<=epsY?E*v.strain:y+(v.yield*.22e6)*Math.log1p((v.strain-epsY)*120));const region=broken?'fractured':(v.strain<=epsY?'linear elastic':'plastic');txt='region: '+region+'   |   stress ≈ '+(stress/1e6).toFixed(1)+' MPa   |   elastic strain limit ≈ '+epsY.toExponential(2);}
 $('#simReadout').textContent=txt;
}

function sizeCanvas(){
 const r=canvas.getBoundingClientRect(), dpr=Math.min(2,window.devicePixelRatio||1);
 canvas.width=Math.max(1,Math.floor(r.width*dpr));canvas.height=Math.max(1,Math.floor(r.height*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
}
window.addEventListener('resize',sizeCanvas);setTimeout(sizeCanvas,0);
function arrow(x1,y1,x2,y2,label,color='#67c7ff'){
 ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
 const a=Math.atan2(y2-y1,x2-x1),h=10;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-h*Math.cos(a-.5),y2-h*Math.sin(a-.5));ctx.lineTo(x2-h*Math.cos(a+.5),y2-h*Math.sin(a+.5));ctx.closePath();ctx.fill();
 if(label){ctx.font='13px system-ui';ctx.fillText(label,(x1+x2)/2+6,(y1+y2)/2-6);}
}
function grid(w,h){
 ctx.strokeStyle='rgba(120,160,200,.10)';ctx.lineWidth=1;for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
}
function drawAxes(x,y,w,h,xLabel,yLabel){
 ctx.strokeStyle='#71849a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.moveTo(x,y+h);ctx.lineTo(x,y);ctx.stroke();
 ctx.fillStyle='#9fb2c8';ctx.font='12px system-ui';ctx.fillText(xLabel,x+w-30,y+h-8);ctx.fillText(yLabel,x+7,y+14);
}
function projectileState(t,v){
 const r=v.angle*Math.PI/180,ux=v.speed*Math.cos(r),uy=v.speed*Math.sin(r),k=v.drag;
 if(k<1e-6) return {x:ux*t,y:uy*t-.5*9.81*t*t,vx:ux,vy:uy-9.81*t};
 const e=Math.exp(-k*t);
 return {x:ux*(1-e)/k,y:(uy+9.81/k)*(1-e)/k-9.81*t/k,vx:ux*e,vy:(uy+9.81/k)*e-9.81/k};
}
function projectileFlight(v){
 let t=.02,last=projectileState(t,v);
 while(t<20){t+=.02;const p=projectileState(t,v);if(p.y<0&&t>.1)return t;last=p;} return 20;
}
function drawSim(){
 const w=canvas.clientWidth,h=canvas.clientHeight;ctx.clearRect(0,0,w,h);grid(w,h);
 const id=sims[activeSim].id,v=simValues;
 ctx.fillStyle='#dceaff';ctx.font='14px system-ui';
 if(id==='vectors'){
  const o={x:w*.22,y:h*.72}, scale=Math.min(w,h)*.006,rad=v.angle*Math.PI/180,x=o.x+v.mag*Math.cos(rad)*scale,y=o.y-v.mag*Math.sin(rad)*scale;
  arrow(o.x,o.y,x,o.y,'Fₓ','#63d9a4');arrow(x,o.y,x,y,'Fᵧ','#ffd56a');arrow(o.x,o.y,x,y,'F','#67c7ff');
  ctx.setLineDash([5,5]);ctx.strokeStyle='#7389a1';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,o.y);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#dceaff';ctx.fillText('Components form a right-angled vector triangle.',w*.52,h*.2);
 }
 if(id==='equilibrium'){
  const cx=w*.38,cy=h*.58,scale=Math.min(w,h)*.0045,r1=v.a1*Math.PI/180,r2=v.a2*Math.PI/180;
  const x1=cx+v.f1*Math.cos(r1)*scale,y1=cy-v.f1*Math.sin(r1)*scale;
  const x2=x1+v.f2*Math.cos(r2)*scale,y2=y1-v.f2*Math.sin(r2)*scale;
  arrow(cx,cy,x1,y1,'F₁','#67c7ff');arrow(x1,y1,x2,y2,'F₂','#63d9a4');arrow(x2,y2,cx,cy,'F₃','#ffd56a');
  ctx.fillStyle='#dceaff';ctx.fillText('Closed triangle → ΣF = 0',w*.60,h*.22);
  ctx.fillText('F₃ balances the resultant of F₁ + F₂',w*.55,h*.30);
 }
 if(id==='moments'){
  const py=h*.52,cx=w*.46,len=Math.min(w*.72,620);ctx.strokeStyle='#9db1c9';ctx.lineWidth=10;ctx.beginPath();ctx.moveTo(cx-len/2,py);ctx.lineTo(cx+len/2,py);ctx.stroke();
  ctx.fillStyle='#788aa0';ctx.beginPath();ctx.moveTo(cx,py);ctx.lineTo(cx-28,py+48);ctx.lineTo(cx+28,py+48);ctx.closePath();ctx.fill();
  const fx=cx+clamp(v.distance/1.2,0,1)*len*.42;arrow(fx,py-95,fx,py,'F','#ffd56a');
  ctx.strokeStyle='#67c7ff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx,py+70);ctx.lineTo(fx,py+70);ctx.stroke();ctx.fillStyle='#dceaff';ctx.fillText(v.distance.toFixed(2)+' m',(cx+fx)/2-15,py+92);
  ctx.fillText('M = '+fmt(v.force*v.distance)+' N m',w*.68,h*.18);
 }
 if(id==='motion'){
  const t=simTime%8,pos=v.u*t+.5*v.a*t*t,min=-80,max=220,x=40+(clamp(pos,min,max)-min)/(max-min)*(w-80),trackY=h*.32;
  ctx.strokeStyle='#6f8197';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(30,trackY+28);ctx.lineTo(w-30,trackY+28);ctx.stroke();ctx.fillStyle='#67c7ff';ctx.fillRect(x-34,trackY-20,68,36);ctx.fillStyle='#0b1726';ctx.beginPath();ctx.arc(x-22,trackY+20,11,0,Math.PI*2);ctx.arc(x+22,trackY+20,11,0,Math.PI*2);ctx.fill();
  arrow(x,trackY-50,x+clamp((v.u+v.a*t)*5,-120,120),trackY-50,'v','#63d9a4');
  const gx=65,gy=h*.55,gw=w-120,gh=h*.34;drawAxes(gx,gy,gw,gh,'t / s','v');
  ctx.strokeStyle='#ffd56a';ctx.lineWidth=3;ctx.beginPath();
  for(let i=0;i<=80;i++){const tt=8*i/80,vv=v.u+v.a*tt,px=gx+gw*tt/8,py=gy+gh*.5-vv*gh/60;if(i===0)ctx.moveTo(px,py);else ctx.lineTo(px,py);}ctx.stroke();
  const py=gy+gh*.5-(v.u+v.a*t)*gh/60;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(gx+gw*t/8,py,5,0,Math.PI*2);ctx.fill();
 }
 if(id==='projectile'){
  const T=projectileFlight(v),pts=[];let maxX=1,maxY=1;
  for(let i=0;i<=160;i++){const tt=T*i/160,p=projectileState(tt,v);pts.push(p);maxX=Math.max(maxX,p.x);maxY=Math.max(maxY,p.y);}
  const sx=(w-90)/(maxX*1.08),sy=(h-105)/(maxY*1.35),base=h-45;
  ctx.strokeStyle='#67c7ff';ctx.lineWidth=3;ctx.beginPath();pts.forEach((p,i)=>{const x=45+p.x*sx,y=base-p.y*sy;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
  const t=simTime%Math.max(.2,T),p=projectileState(t,v),px=45+p.x*sx,py=base-p.y*sy;
  ctx.fillStyle='#ffd56a';ctx.beginPath();ctx.arc(px,py,9,0,Math.PI*2);ctx.fill();
  arrow(px,py,px+clamp(p.vx*3,-85,85),py,'vₓ','#63d9a4');arrow(px,py,px,py-clamp(p.vy*3,-85,85),'vᵧ','#ffb66a');
  ctx.strokeStyle='#6f8197';ctx.beginPath();ctx.moveTo(20,base+10);ctx.lineTo(w-20,base+10);ctx.stroke();
 }
 if(id==='terminal'){
  const t=simTime%8,vt=v.mass*9.81/v.k,speed=vt*(1-Math.exp(-v.k*t/v.mass)),drag=v.k*speed,weight=v.mass*9.81,result=weight-drag;
  const x=w*.30,y=70+(h-150)*(t/8);ctx.fillStyle='#ffd56a';ctx.beginPath();ctx.arc(x,y,18,0,Math.PI*2);ctx.fill();
  arrow(x-25,y,x-25,y+clamp(weight*3,25,120),'mg','#ff7b87');arrow(x+25,y,x+25,y-clamp(drag*3,5,120),'drag','#63d9a4');
  const gx=w*.52,gy=55,gw=w*.40,gh=h-110;drawAxes(gx,gy,gw,gh,'t','speed');
  ctx.strokeStyle='#67c7ff';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=100;i++){const tt=8*i/100,ss=vt*(1-Math.exp(-v.k*tt/v.mass)),px=gx+gw*i/100,py=gy+gh-(ss/(vt*1.1))*gh;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();
  ctx.setLineDash([5,5]);ctx.strokeStyle='#ffd56a';const vy=gy+gh-(vt/(vt*1.1))*gh;ctx.beginPath();ctx.moveTo(gx,vy);ctx.lineTo(gx+gw,vy);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#dceaff';ctx.fillText('terminal speed',gx+8,vy-8);
 }
 if(id==='newton'){
  const y=h*.52,x=w*.5,r=v.drive-v.resist,a=r/v.mass;ctx.fillStyle='#67c7ff';ctx.fillRect(x-70,y-30,140,50);ctx.fillStyle='#07111f';ctx.beginPath();ctx.arc(x-45,y+24,16,0,Math.PI*2);ctx.arc(x+45,y+24,16,0,Math.PI*2);ctx.fill();
  arrow(x-10,y-65,x+clamp(v.drive/25,20,180),y-65,'drive','#63d9a4');arrow(x+10,y-105,x-clamp(v.resist/25,10,140),y-105,'resistance','#ff7b87');arrow(x,y+85,x+clamp(a*35,-140,140),y+85,'a','#ffd56a');
  ctx.fillStyle='#dceaff';ctx.fillText('ΣF = '+fmt(r)+' N',x-55,y+125);
 }
 if(id==='momentum'){
  const before=(simTime%6)<3,cy=h*.48;if(before){const p=simTime%3;drawCart(w*.24+v.v1*p*10,cy,Math.max(36,v.m1*16),'1');drawCart(w*.76+v.v2*p*10,cy,Math.max(36,v.m2*16),'2');}
  else{const fin=(v.m1*v.v1+v.m2*v.v2)/(v.m1+v.m2),p=(simTime%6)-3;drawCart(w*.5+fin*p*12,cy,Math.max(70,(v.m1+v.m2)*13),'1+2');}
  const pTot=v.m1*v.v1+v.m2*v.v2,fin=pTot/(v.m1+v.m2),kei=.5*v.m1*v.v1*v.v1+.5*v.m2*v.v2*v.v2,kef=.5*(v.m1+v.m2)*fin*fin;
  ctx.fillStyle='#dceaff';ctx.fillText(before?'Before collision':'After: perfectly inelastic',30,35);ctx.fillText('p total = '+fmt(pTot)+' kg m s⁻¹',30,h-58);ctx.fillText('KE before = '+fmt(kei)+' J   KE after = '+fmt(kef)+' J',30,h-30);
 }
 if(id==='impulse'){
  const gx=70,gy=55,gw=w-130,gh=h-110;drawAxes(gx,gy,gw,gh,'time / s','force');
  const px=gx+gw*.5,top=gy+20;ctx.fillStyle='rgba(103,199,255,.20)';ctx.beginPath();ctx.moveTo(gx,gy+gh);ctx.lineTo(px,top);ctx.lineTo(gx+gw,gy+gh);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#67c7ff';ctx.lineWidth=3;ctx.stroke();ctx.fillStyle='#dceaff';ctx.fillText('peak '+fmt(v.peak)+' N',px-35,top-10);ctx.fillText('contact time '+fmt(v.time)+' s',gx+gw*.62,gy+gh-12);
 }
 if(id==='energy'){
  const ground=h-70,left=50,right=w*.63,top=70,p=(simTime%6)/6,x=left+(right-left)*p,y=top+(ground-top)*(1-Math.pow(1-p,2));
  ctx.strokeStyle='#7d91a9';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(left,top);ctx.quadraticCurveTo(w*.32,ground-20,right,ground);ctx.stroke();ctx.fillStyle='#ffd56a';ctx.beginPath();ctx.arc(x,y-12,13,0,Math.PI*2);ctx.fill();
  const total=v.mass*9.81*v.height,frac=1-p,gpe=total*frac,usable=total*(1-v.loss/100),ke=Math.max(0,usable-gpe*(1-v.loss/100)),diss=total-ke-gpe;
  const bx=w*.70,bw=w*.22,maxH=h*.55;[['GPE',gpe,'#67c7ff'],['KE',ke,'#63d9a4'],['diss.',Math.max(0,diss),'#ffd56a']].forEach((b,i)=>{const bh=maxH*(b[1]/Math.max(1,total));ctx.fillStyle=b[2];ctx.fillRect(bx+i*bw/3,ground-bh,bw/4,bh);ctx.fillStyle='#dceaff';ctx.fillText(b[0],bx+i*bw/3,ground+20);});
 }
 if(id==='workgraph'){
  const gx=70,gy=55,gw=w-130,gh=h-110,maxF=Math.max(10,v.f0,v.f1)*1.15;drawAxes(gx,gy,gw,gh,'s / m','F / N');
  const y0=gy+gh-v.f0/maxF*gh,y1=gy+gh-v.f1/maxF*gh;
  ctx.fillStyle='rgba(99,217,164,.20)';ctx.beginPath();ctx.moveTo(gx,gy+gh);ctx.lineTo(gx,y0);ctx.lineTo(gx+gw,y1);ctx.lineTo(gx+gw,gy+gh);ctx.closePath();ctx.fill();
  ctx.strokeStyle='#63d9a4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,y0);ctx.lineTo(gx+gw,y1);ctx.stroke();
  ctx.fillStyle='#dceaff';ctx.fillText('Area = work = '+fmt(.5*(v.f0+v.f1)*v.distance)+' J',gx+20,gy+30);
 }
 if(id==='density'){
  const bx=w*.25,by=h*.32,sx=Math.min(180,60+v.length*8),sy=Math.min(120,35+v.height*7),d=Math.min(70,20+v.width*5);
  ctx.fillStyle='rgba(103,199,255,.22)';ctx.strokeStyle='#67c7ff';ctx.lineWidth=2;
  ctx.beginPath();ctx.rect(bx,by,sx,sy);ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(bx+d,by-d);ctx.lineTo(bx+sx+d,by-d);ctx.lineTo(bx+sx,by);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.beginPath();ctx.moveTo(bx+sx,by);ctx.lineTo(bx+sx+d,by-d);ctx.lineTo(bx+sx+d,by+sy-d);ctx.lineTo(bx+sx,by+sy);ctx.closePath();ctx.fill();ctx.stroke();
  const V=v.length*v.width*v.height,rho=(v.mass/1000)/(V*1e-6);
  ctx.fillStyle='#dceaff';ctx.fillText(v.length+' cm',bx+sx*.35,by+sy+24);ctx.fillText(v.height+' cm',bx-5,by+sy*.5);ctx.fillText(v.width+' cm',bx+sx+12,by-18);
  ctx.fillText('mass = '+v.mass+' g',w*.62,h*.33);ctx.fillText('volume = '+fmt(V)+' cm³',w*.62,h*.43);ctx.fillText('ρ = '+fmt(rho)+' kg m⁻³',w*.62,h*.53);
 }
 if(id==='elasticity'){
  const A=v.area*1e-6,E=v.young*1e9,stress=v.force/A,strain=stress/E,ext=strain*v.length,base=65,pix=Math.min(h*.48,100+ext*1e5),wireX=w*.30;
  ctx.strokeStyle='#c7d4e2';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(wireX,base);ctx.lineTo(wireX,base+pix);ctx.stroke();ctx.fillStyle='#60748a';ctx.fillRect(wireX-50,base+pix,100,48);ctx.fillStyle='#fff';ctx.fillText(v.force+' N',wireX-17,base+pix+30);
  const gx=w*.52,gy=55,gw=w*.40,gh=h-110;drawAxes(gx,gy,gw,gh,'strain','stress');
  const maxStr=Math.max(.0005,strain*1.5),maxStress=Math.max(1e6,stress*1.5);ctx.strokeStyle='#67c7ff';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(gx,gy+gh);ctx.lineTo(gx+gw*(strain/maxStr),gy+gh-gh*(stress/maxStress));ctx.stroke();
  ctx.fillStyle='#ffd56a';ctx.beginPath();ctx.arc(gx+gw*(strain/maxStr),gy+gh-gh*(stress/maxStress),6,0,Math.PI*2);ctx.fill();
 }
 if(id==='stressstrain'){
  const E=v.young*1e9,yieldPa=v.yield*1e6,epsY=yieldPa/E,br=v.break,maxStress=yieldPa*1.55,gx=70,gy=55,gw=w-130,gh=h-110;drawAxes(gx,gy,gw,gh,'strain','stress');
  function matStress(e){if(e>=br)return 0;if(e<=epsY)return E*e;return yieldPa+(v.yield*.22e6)*Math.log1p((e-epsY)*120);}
  ctx.strokeStyle='#67c7ff';ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=120;i++){const e=br*i/120,s=matStress(e),px=gx+gw*(e/(br*1.08)),py=gy+gh-(s/maxStress)*gh;i?ctx.lineTo(px,py):ctx.moveTo(px,py)}ctx.stroke();
  const e=Math.min(v.strain,br),s=matStress(e),px=gx+gw*(e/(br*1.08)),py=gy+gh-(s/maxStress)*gh;ctx.fillStyle=v.strain>=br?'#ff7b87':'#ffd56a';ctx.beginPath();ctx.arc(px,py,7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#dceaff';ctx.fillText('elastic',gx+15,gy+gh-55);ctx.fillText('plastic',gx+gw*.42,gy+55);ctx.fillText('fracture',gx+gw*.82,gy+95);
 }
}

function drawCart(x,y,width,label){ctx.fillStyle='#67c7ff';ctx.fillRect(x-width/2,y-24,width,38);ctx.fillStyle='#081422';ctx.beginPath();ctx.arc(x-width*.28,y+20,11,0,Math.PI*2);ctx.arc(x+width*.28,y+20,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.fillText(label,x-8,y);}
function animate(now){
 const dt=Math.min(.05,(now-last)/1000);last=now;if(running)simTime+=dt*(slow?.3:1);drawSim();updateReadout();requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
$('#playPause').addEventListener('click',()=>{running=!running;$('#playPause').textContent=running?'Pause':'Play';$('#simState').textContent=running?(slow?'Slow motion':'Running'):'Paused';});
$('#slowMotion').addEventListener('click',()=>{slow=!slow;$('#slowMotion').textContent=slow?'Normal speed':'Slow motion';$('#simState').textContent=running?(slow?'Slow motion':'Running'):'Paused';});
$('#resetSim').addEventListener('click',()=>{simTime=0;renderSim();});

const formulas = [
{id:'resultant',name:'Perpendicular resultant',desc:'R = √(x²+y²)',inputs:[['x','x component',6,'N'],['y','y component',8,'N']],calc:v=>({steps:['R = √(x² + y²)','R = √('+v.x+'² + '+v.y+'²)'],answer:Math.hypot(v.x,v.y),unit:'N'})},
{id:'components',name:'Resolve vector',desc:'Fₓ = Fcosθ',inputs:[['F','magnitude',60,'N'],['theta','angle',35,'°']],calc:v=>({steps:['Fₓ = F cosθ','Fᵧ = F sinθ'],answerText:'Fₓ = '+fmt(v.F*Math.cos(v.theta*Math.PI/180))+' N; Fᵧ = '+fmt(v.F*Math.sin(v.theta*Math.PI/180))+' N'})},
{id:'moment',name:'Moment',desc:'M = Fd',inputs:[['F','force',40,'N'],['d','perpendicular distance',.35,'m']],calc:v=>({steps:['M = Fd','M = '+v.F+' × '+v.d],answer:v.F*v.d,unit:'N m'})},
{id:'accel',name:'Newton II',desc:'a = F/m',inputs:[['F','resultant force',2400,'N'],['m','mass',1200,'kg']],calc:v=>({steps:['ΣF = ma','a = F/m'],answer:v.F/v.m,unit:'m s⁻²'})},
{id:'suvat',name:'SUVAT: v = u + at',desc:'v = u + at',inputs:[['u','initial velocity',4,'m s⁻¹'],['a','acceleration',2,'m s⁻²'],['t','time',6,'s']],calc:v=>({steps:['v = u + at','v = '+v.u+' + '+v.a+'×'+v.t],answer:v.u+v.a*v.t,unit:'m s⁻¹'})},
{id:'momentum',name:'Momentum',desc:'p = mv',inputs:[['m','mass',.2,'kg'],['v','velocity',12,'m s⁻¹']],calc:v=>({steps:['p = mv','p = '+v.m+' × '+v.v],answer:v.m*v.v,unit:'kg m s⁻¹'})},
{id:'impulse',name:'Impulse',desc:'J = FΔt',inputs:[['F','average force',850,'N'],['t','contact time',.06,'s']],calc:v=>({steps:['J = FΔt','J = '+v.F+' × '+v.t],answer:v.F*v.t,unit:'N s'})},
{id:'ke',name:'Kinetic energy',desc:'Eₖ = ½mv²',inputs:[['m','mass',900,'kg'],['v','speed',20,'m s⁻¹']],calc:v=>({steps:['Eₖ = ½mv²'],answer:.5*v.m*v.v*v.v,unit:'J'})},
{id:'gpe',name:'GPE change',desc:'ΔEₚ = mgΔh',inputs:[['m','mass',25,'kg'],['g','g',9.81,'m s⁻²'],['h','height change',4,'m']],calc:v=>({steps:['ΔEₚ = mgΔh'],answer:v.m*v.g*v.h,unit:'J'})},
{id:'power',name:'Power',desc:'P = W/t',inputs:[['W','work',981,'J'],['t','time',5,'s']],calc:v=>({steps:['P = W/t'],answer:v.W/v.t,unit:'W'})},
{id:'hooke',name:'Hooke’s law',desc:'k = F/ΔL',inputs:[['F','force',6,'N'],['x','extension',.024,'m']],calc:v=>({steps:['F = kΔL','k = F/ΔL'],answer:v.F/v.x,unit:'N m⁻¹'})},
{id:'stress',name:'Tensile stress',desc:'σ = F/A',inputs:[['F','force',60,'N'],['A','area',2e-7,'m²']],calc:v=>({steps:['stress = F/A'],answer:v.F/v.A,unit:'Pa'})},
{id:'strain',name:'Tensile strain',desc:'ε = ΔL/L',inputs:[['x','extension',.0012,'m'],['L','original length',2,'m']],calc:v=>({steps:['strain = ΔL/L'],answer:v.x/v.L,unit:''})},
{id:'young',name:'Young modulus',desc:'E = FL/(AΔL)',inputs:[['F','force',30,'N'],['L','length',1.5,'m'],['A','area',1.26e-7,'m²'],['x','extension',.0018,'m']],calc:v=>({steps:['E = FL/(AΔL)'],answer:v.F*v.L/(v.A*v.x),unit:'Pa'})},
{id:'density',name:'Density',desc:'ρ = m/V',inputs:[['m','mass',2.7,'kg'],['V','volume',.001,'m³']],calc:v=>({steps:['ρ = m/V'],answer:v.m/v.V,unit:'kg m⁻³'})},
{id:'workangle',name:'Work at an angle',desc:'W = Fs cosθ',inputs:[['F','force',50,'N'],['s','displacement',4,'m'],['theta','angle to displacement',30,'°']],calc:v=>({steps:['W = Fs cosθ'],answer:v.F*v.s*Math.cos(v.theta*Math.PI/180),unit:'J'})},
{id:'efficiency',name:'Efficiency',desc:'η = useful / input',inputs:[['useful','useful output energy',750,'J'],['input','total input energy',1000,'J']],calc:v=>({steps:['η = useful output / total input','percentage = η × 100'],answerText:'η = '+fmt(v.useful/v.input)+' = '+fmt(100*v.useful/v.input)+'%'})},
{id:'elasticenergy',name:'Elastic strain energy',desc:'E = ½FΔL',inputs:[['F','force',12,'N'],['x','extension',.040,'m']],calc:v=>({steps:['E = ½FΔL','valid for a linear force–extension relation'],answer:.5*v.F*v.x,unit:'J'})}
];
function renderFormula(){
 $('#formulaSelect').innerHTML=formulas.map((f,i)=>'<option value="'+i+'">'+f.name+' — '+f.desc+'</option>').join('');
 renderFormulaInputs();
 $('#formulaSelect').addEventListener('change',renderFormulaInputs);
 $('#formulaCards').innerHTML=formulas.map(f=>'<article class="formula-card"><strong>'+f.name+'</strong><code>'+f.desc+'</code></article>').join('');
}
function renderFormulaInputs(){
 const f=formulas[Number($('#formulaSelect').value)||0];
 $('#formulaInputs').innerHTML=f.inputs.map(i=>'<label class="field"><span>'+i[1]+' / '+i[3]+'</span><input type="number" step="any" data-finput="'+i[0]+'" value="'+i[2]+'"></label>').join('');
 $$('[data-finput]').forEach(x=>x.addEventListener('input',calculateFormula));calculateFormula();
}
function calculateFormula(){
 const f=formulas[Number($('#formulaSelect').value)||0],v={};$$('[data-finput]').forEach(i=>v[i.dataset.finput]=Number(i.value));
 const r=f.calc(v),steps=(r.steps||[]).map(s=>'<span class="step">'+s+'</span>').join(''),ans=r.answerText||('Answer = '+fmt(r.answer)+' '+(r.unit||''));
 $('#formulaWorking').innerHTML=steps+'<span class="step"><strong>'+ans+'</strong></span><span class="step muted">Check units and significant figures before finalising an exam answer.</span>';
}

const quiz = [
['3.4.1.1','Which is a vector quantity?',['Mass','Velocity','Energy','Time'],1,'Think: does direction matter?','Velocity has magnitude and direction.'],
['3.4.1.1','A 3 N east vector and 4 N north vector have resultant magnitude…',['1 N','5 N','7 N','12 N'],1,'Use Pythagoras.','√(3²+4²)=5 N.'],
['3.4.1.2','A 20 N force acts 0.40 m perpendicularly from a pivot. Moment?',['8 N m','50 N m','0.05 N m','20.4 N m'],0,'Use M = Fd.','20×0.40=8 N m.'],
['3.4.1.3','What is the area under a velocity–time graph?',['Acceleration','Displacement','Force','Power'],1,'Think about velocity × time.','The signed area gives displacement.'],
['3.4.1.3','A car changes velocity from 5 to 17 m s⁻¹ in 4 s. Acceleration?',['3 m s⁻²','5.5 m s⁻²','12 m s⁻²','48 m s⁻²'],0,'a=Δv/Δt.','(17−5)/4=3 m s⁻².'],
['3.4.1.4','For an ideal projectile, horizontal acceleration is…',['g','0','u cosθ','variable'],1,'Gravity acts vertically.','Without air resistance, horizontal acceleration is zero.'],
['3.4.1.4','At terminal speed…',['weight is zero','drag is zero','drag equals weight','acceleration equals g'],2,'Resultant force is zero.','Drag balances weight.'],
['3.4.1.5','A 2 kg object has resultant force 10 N. Acceleration?',['5 m s⁻²','20 m s⁻²','0.2 m s⁻²','12 m s⁻²'],0,'Use F=ma.','a=10/2=5 m s⁻².'],
['3.4.1.5','A Newton III pair acts…',['on the same object','on different interacting objects','only in equilibrium','only during collisions'],1,'Ask which objects experience the forces.','Third-law forces act on different objects.'],
['3.4.1.6','Momentum equals…',['mv','ma','½mv²','Fv'],0,'Definition.','p=mv.'],
['3.4.1.6','Area under a force–time graph gives…',['work','power','impulse','stress'],2,'Impulse equals change in momentum.','Area gives impulse.'],
['3.4.1.7','If speed doubles, kinetic energy…',['doubles','quadruples','halves','stays constant'],1,'KE∝v².','Doubling v gives four times KE.'],
['3.4.1.8','With friction, which remains conserved for a closed system?',['Mechanical energy only','Kinetic energy only','Total energy','Momentum in every case'],2,'Energy can transfer to internal stores.','Total energy is conserved.'],
['3.4.2.1','Hooke’s law applies while…',['force is zero','extension is proportional to force','material is broken','strain is always permanent'],1,'Look for the linear region.','In the Hookean region extension is proportional to force.'],
['3.4.2.1','Tensile strain has unit…',['Pa','N','m','no unit'],3,'It is a ratio of lengths.','The units cancel.'],
['3.4.2.1','Elastic strain energy for a linear spring is…',['FΔL','½FΔL','F/ΔL','½k/F'],1,'Area of triangle under F–extension graph.','E=½FΔL.'],
['3.4.2.2','Young modulus is…',['stress × strain','stress / strain','strain / stress','force / extension'],1,'Definition.','E=stress/strain in the linear elastic region.'],
['RP4','Why is wire diameter especially important in Young modulus?',['Area depends on d²','Force equals d²','Length equals d²','Strain has units of d²'],0,'Think A=πd²/4.','Area depends on diameter squared.'],
['3.4.1.1','For three coplanar forces acting at a point in equilibrium, their vectors…',['must have equal magnitudes','form a closed triangle','must all be at 90°','must all point upward'],1,'Think about the vector sum.','A zero vector sum means the force vectors can form a closed triangle.'],
['3.4.1.2','A couple produces a turning effect because…',['the forces act on the same line','the forces are unequal','equal opposite forces act along different lines','there is a resultant force'],2,'A couple has zero resultant force but separated lines of action.','The separation of the equal opposite forces gives a non-zero moment.'],
['3.4.1.3','Area under an acceleration–time graph gives…',['displacement','change in velocity','force','power'],1,'Consider acceleration × time.','The signed area gives change in velocity.'],
['3.4.1.3','On a displacement–time graph, instantaneous velocity is found from…',['area under the graph','gradient of a tangent','maximum displacement','intercept only'],1,'Instantaneous rate of change needs a tangent.','The tangent gradient gives instantaneous velocity.'],
['3.4.1.4','As a falling object speeds up through air, drag generally…',['decreases','stays zero','increases','reverses gravity'],2,'AQA requires this qualitative relationship.','Air resistance increases with speed.'],
['3.4.1.5','Newton’s first law applies when resultant force is zero. The object then…',['must be stationary','has constant velocity','must speed up','has zero mass'],1,'Zero resultant force means zero acceleration.','Velocity remains constant, which includes remaining at rest.'],
['3.4.1.6','A triangular force–time pulse has peak 1000 N and duration 0.20 s. Impulse is…',['50 N s','100 N s','200 N s','5000 N s'],1,'Find the triangle area.','½×1000×0.20=100 N s.'],
['3.4.1.6','In an explosion of an initially stationary closed system, total momentum after is…',['zero','always positive','equal to kinetic energy','equal to total mass'],0,'Use momentum conservation.','Initial momentum is zero, so the vector total after remains zero.'],
['3.4.1.7','A 50 N force acts through 4.0 m at 60° to displacement. Work done is…',['25 J','100 J','200 J','400 J'],1,'Use Fs cosθ.','50×4×cos60°=100 J.'],
['3.4.1.7','The area under a force–displacement graph is…',['impulse','work done','acceleration','strain'],1,'Do not confuse F–s with F–t.','Area under F–s is work done.'],
['3.4.1.7','A device receives 800 J and transfers 600 J usefully. Efficiency is…',['25%','60%','75%','133%'],2,'Useful/input ×100%.','600/800=0.75=75%.'],
['3.4.2.1','A sample has mass 0.50 kg and volume 2.0×10⁻⁴ m³. Density is…',['250 kg m⁻³','1000 kg m⁻³','2500 kg m⁻³','10000 kg m⁻³'],2,'Use ρ=m/V.','0.50/(2×10⁻⁴)=2500 kg m⁻³.'],
['3.4.2.1','Which statement best distinguishes elastic limit from limit of proportionality?',['They are always identical by definition','one concerns permanent deformation; the other concerns linear F–extension behaviour','elastic limit is a density','limit of proportionality is fracture'],1,'Think return-to-original-shape versus straight-line proportionality.','The elastic limit concerns recoverability; the limit of proportionality concerns proportional F–extension behaviour.'],
['3.4.2.2','Young modulus is obtained from the initial linear stress–strain graph using…',['area','gradient','x-intercept','maximum strain'],1,'E=stress/strain.','Young modulus is the gradient of the initial linear region.']
];
let qi=0,score=0,streak=0;
function renderQuiz(){
 const q=quiz[qi];$('#quizSpec').textContent='AQA '+q[0];$('#quizQuestion').textContent=q[1];$('#quizChoices').innerHTML=q[2].map((x,i)=>'<button class="choice-button" data-choice="'+i+'">'+x+'</button>').join('');
 $('#quizHint').textContent=q[4];$('#quizHint').classList.add('hidden');$('#quizFeedback').className='feedback hidden';$('#nextQuestion').classList.add('hidden');$('#showHint').textContent='Show hint';
 $('#quizProgress').textContent=(qi+1)+' / '+quiz.length;$('#quizProgressFill').style.width=(100*(qi+1)/quiz.length)+'%';$('#quizScore').textContent=score;$('#quizStreak').textContent=streak;
 $$('[data-choice]').forEach(b=>b.addEventListener('click',()=>{
  const chosen=Number(b.dataset.choice);$$('[data-choice]').forEach(x=>x.disabled=true);b.classList.add(chosen===q[3]?'correct':'wrong');$$('[data-choice]')[q[3]].classList.add('correct');
  if(chosen===q[3]){score++;streak++;}else streak=0;$('#quizScore').textContent=score;$('#quizStreak').textContent=streak;
  recordMastery(q[0],chosen===q[3]);
  const fb=$('#quizFeedback');fb.className='feedback '+(chosen===q[3]?'good':'bad');fb.textContent=(chosen===q[3]?'Correct. ':'Not quite. ')+q[5];$('#nextQuestion').classList.remove('hidden');
 }));
}
$('#showHint').addEventListener('click',()=>{$('#quizHint').classList.toggle('hidden');$('#showHint').textContent=$('#quizHint').classList.contains('hidden')?'Show hint':'Hide hint';});
$('#nextQuestion').addEventListener('click',()=>{qi=(qi+1)%quiz.length;renderQuiz();});
$('#restartQuiz').addEventListener('click',()=>{qi=0;score=0;streak=0;renderQuiz();});

const spec = [
['3.4.1.1','Scalars and vectors','Scalar/vector nature, examples, vector addition, resolution and equilibrium.','vectors'],
['3.4.1.2','Moments','Moments, couples, principle of moments and centre of mass.','moments'],
['3.4.1.3','Motion along a straight line','Displacement, velocity, acceleration, graphs, uniform acceleration and g.','kinematics'],
['RP3','Determination of g','Free-fall method, graphing and evaluation of errors.','rp3'],
['3.4.1.4','Projectile motion','Independent horizontal/vertical motion, friction, drag, lift and terminal speed.','projectiles'],
['3.4.1.5','Newton’s laws','Three laws, ΣF=ma and free-body diagrams.','newton'],
['3.4.1.6','Momentum','Momentum conservation, rate of change, impulse, force–time graphs and collisions.','momentum'],
['3.4.1.7','Work, energy and power','Work, kinetic/GPE, power, efficiency and force–displacement graphs.','work'],
['3.4.1.8','Conservation of energy','Energy conservation including work against resistive forces.','energy'],
['3.4.2.1','Bulk properties of solids','Density, Hooke’s law, stress, strain, elastic energy and material behaviour.','density-hooke'],
['3.4.2.2','Young modulus','Stress–strain gradient and Young modulus.','young'],
['RP4','Determination of Young modulus','Simple experimental method and uncertainty/evaluation.','rp4']
];
function renderSpec(){
 const host=$('#specGrid'); if(!host)return;
 host.innerHTML=spec.map(s=>'<article class="spec-card"><div class="status"><span class="eyebrow">'+s[0]+'</span><span class="status-dot '+(completed.has(s[3])?'done':'')+'"></span></div><h3>'+s[1]+'</h3><p>'+s[2]+'</p><span class="mastery-chip">'+(masteryPct(s[0])===null?'No mastery data yet':'Tracked mastery: '+masteryPct(s[0])+'%')+'</span><button class="text-button" data-spec-lesson="'+s[3]+'">Open lesson</button></article>').join('');
 $$('[data-spec-lesson]').forEach(b=>b.addEventListener('click',()=>{const i=lessons.findIndex(l=>l.id===b.dataset.specLesson);if(i>=0){activeLesson=i;renderCourseList();renderLesson();openView('course');}}));
}

function regression(points){
 if(points.length<2)return null;
 const n=points.length,sx=points.reduce((a,p)=>a+p.x,0),sy=points.reduce((a,p)=>a+p.y,0),sxx=points.reduce((a,p)=>a+p.x*p.x,0),sxy=points.reduce((a,p)=>a+p.x*p.y,0);
 const den=n*sxx-sx*sx;if(Math.abs(den)<1e-15)return null;
 const m=(n*sxy-sx*sy)/den,b=(sy-m*sx)/n;return {m,b};
}
function drawPracticalGraph(id,points,xLabel,yLabel){
 const canvas=document.getElementById(id);if(!canvas)return;
 const rect=canvas.getBoundingClientRect(),W=Math.max(320,rect.width||600),H=260,dpr=Math.min(2,window.devicePixelRatio||1);
 canvas.width=W*dpr;canvas.height=H*dpr;const g=canvas.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);
 g.fillStyle='#091625';g.fillRect(0,0,W,H);const left=58,right=18,top=18,bottom=42,pw=W-left-right,ph=H-top-bottom;
 g.strokeStyle='#72859b';g.lineWidth=1.5;g.beginPath();g.moveTo(left,top);g.lineTo(left,H-bottom);g.lineTo(W-right,H-bottom);g.stroke();
 g.fillStyle='#9fb2c8';g.font='12px system-ui';g.fillText(xLabel,W/2-20,H-12);g.save();g.translate(14,H/2+20);g.rotate(-Math.PI/2);g.fillText(yLabel,0,0);g.restore();
 if(!points.length){g.fillText('Collect readings to build the graph.',left+20,top+40);return;}
 const maxX=Math.max(...points.map(p=>p.x),1e-9)*1.12,maxY=Math.max(...points.map(p=>p.y),1e-9)*1.12;
 const px=x=>left+(x/maxX)*pw,py=y=>H-bottom-(y/maxY)*ph;
 g.fillStyle='#ffd56a';points.forEach(p=>{g.beginPath();g.arc(px(p.x),py(p.y),5,0,Math.PI*2);g.fill();});
 const fit=regression(points);if(fit){g.strokeStyle='#67c7ff';g.lineWidth=2;g.beginPath();g.moveTo(px(0),py(Math.max(0,fit.b)));g.lineTo(px(maxX),py(fit.m*maxX+fit.b));g.stroke();}
}

let gData=[],yData=[];
function updatePracticalControls(){
 $('#dropHeightOut').textContent=(Number($('#dropHeight').value)/100).toFixed(2)+' m';
 $('#loadMassOut').textContent=Number($('#loadMass').value).toFixed(1)+' kg';
 $('#wireDiameterOut').textContent=Number($('#wireDiameter').value).toFixed(2)+' mm';
 $('#massBlock').textContent=Number($('#loadMass').value).toFixed(1)+' kg';
}
['dropHeight','loadMass','wireDiameter'].forEach(id=>$('#'+id).addEventListener('input',updatePracticalControls));
$$('[data-practical]').forEach(b=>b.addEventListener('click',()=>{
 const g=b.dataset.practical==='g';$('#practicalG').classList.toggle('hidden',!g);$('#practicalYoung').classList.toggle('hidden',g);$('[data-practical]').forEach(x=>x.classList.toggle('primary',x===b));requestAnimationFrame(()=>g?renderG():renderY());
}));
function renderG(){
 $('#gRows').innerHTML=gData.map(r=>'<tr><td>'+r.h.toFixed(2)+'</td><td>'+r.t.toFixed(3)+'</td><td>'+r.t2.toFixed(4)+'</td><td>'+r.g.toFixed(2)+'</td></tr>').join('');
 drawPracticalGraph('gGraph',gData.map(r=>({x:r.t2,y:r.h})),'t² / s²','h / m');
 if(gData.length){const mean=gData.reduce((a,b)=>a+b.g,0)/gData.length,fit=regression(gData.map(r=>({x:r.t2,y:r.h}))),graphG=fit?2*fit.m:null;$('#gSummary').textContent='Mean g = '+mean.toFixed(2)+' m s⁻²'+(graphG!==null?' | best-fit graph g = '+graphG.toFixed(2)+' m s⁻²':'')+'. Compare with 9.81 m s⁻² and evaluate scatter, intercept and uncertainty.';}else $('#gSummary').textContent='Collect at least three readings.';
}
$('#takeGReading').addEventListener('click',()=>{
 const h=Number($('#dropHeight').value)/100,ideal=Math.sqrt(2*h/9.81),noise=(Math.random()-.5)*.012,t=Math.max(.05,ideal+noise),g=2*h/(t*t);gData.push({h,t,t2:t*t,g});renderG();
 const ball=$('#dropBall');ball.style.transition='none';ball.style.top='30px';requestAnimationFrame(()=>{ball.style.transition='top '+Math.max(.25,ideal)+'s linear';ball.style.top='185px';});
});
$('#clearGData').addEventListener('click',()=>{gData=[];renderG();});

function renderY(){
 $('#yRows').innerHTML=yData.map(r=>'<tr><td>'+r.F.toFixed(1)+'</td><td>'+r.extmm.toFixed(3)+'</td><td>'+r.stress.toExponential(2)+'</td><td>'+r.strain.toExponential(2)+'</td><td>'+r.E.toExponential(2)+'</td></tr>').join('');
 drawPracticalGraph('yGraph',yData.map(r=>({x:r.strain,y:r.stress})),'strain','stress / Pa');
 if(yData.length){const mean=yData.reduce((a,b)=>a+b.E,0)/yData.length,fit=regression(yData.map(r=>({x:r.strain,y:r.stress}))),graphE=fit?fit.m:null;$('#ySummary').textContent='Mean E = '+mean.toExponential(3)+' Pa'+(graphE!==null?' | stress–strain gradient E = '+graphE.toExponential(3)+' Pa':'')+'. Check linearity, consistency and the effect of diameter uncertainty.';}else $('#ySummary').textContent='Collect at least three readings.';
}
$('#takeYReading').addEventListener('click',()=>{
 const m=Number($('#loadMass').value),d=Number($('#wireDiameter').value)*1e-3,L=1.5,F=m*9.81,A=Math.PI*d*d/4,trueE=2.0e11,ideal=F*L/(A*trueE),noise=1+(Math.random()-.5)*.04,ext=ideal*noise,stress=F/A,strain=ext/L,E=stress/strain;
 yData.push({F,extmm:ext*1000,stress,strain,E});renderY();$('#massBlock').style.top=(170+Math.min(18,ext*50000))+'px';
});
$('#clearYData').addEventListener('click',()=>{yData=[];renderY();});

renderCourseList();renderLesson();saveProgress();renderSim();renderFormula();renderQuiz();renderSpec();renderMasteryPanel();updatePracticalControls();renderG();renderY();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
})();