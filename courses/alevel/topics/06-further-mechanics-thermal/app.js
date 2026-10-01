(() => {
'use strict';

const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const fmt=(n,d=3)=>Number.isFinite(n)?Number(n.toPrecision(d)).toString():'—';
const TAU=Math.PI*2;

const lessons=[
 {id:'radians',code:'3.6.1.1',title:'Radians and angular speed',sim:'circular',lead:'Build the mathematical language of rotation before using it in circular-motion problems.',formulas:['θ = s / r','ω = Δθ / Δt','v = ωr','T = 2π / ω'],objectives:['Use radians rather than degrees in circular-motion equations.','Calculate angular speed and period.','Link angular and linear speed.'],retrieval:[['What is one complete revolution in radians?','2π rad.'],['What is frequency?','Number of complete cycles per second, measured in hertz.'],['How are speed, distance and time related?','speed = distance / time.']],core:['Radian measure compares arc length with radius. One radian is the angle subtended when arc length equals the radius.','Angular speed ω is the rate of change of angular displacement. For uniform circular motion, ω = 2πf = 2π/T.','A point at radius r travels an arc distance s = rθ, so its linear speed is v = ωr.','Always convert degrees to radians before using s = rθ unless the equation explicitly uses degrees.'],worked:['A wheel turns at 3.0 rev s⁻¹. Find its angular speed.','f = 3.0 Hz, so ω = 2πf = 18.8 rad s⁻¹.'],task:'A point is 0.24 m from the centre of a disc rotating at 5.0 rad s⁻¹. Calculate its linear speed and the time for one revolution.',check:['If angular speed doubles while radius is unchanged, linear speed…',['halves','doubles','stays constant','quadruples'],1,'v = ωr, so v is directly proportional to ω.'],exit:'Explain why two points on the same rigid rotating disc have the same angular speed but different linear speeds.'},
 {id:'centripetal-accel',code:'3.6.1.1',title:'Centripetal acceleration',sim:'circular',lead:'Understand why constant speed in a circle still means acceleration.',formulas:['a = v² / r','a = ω²r'],objectives:['Explain why circular motion involves acceleration.','Calculate centripetal acceleration.','Identify the direction of the acceleration vector.'],retrieval:[['What changes when velocity changes?','Magnitude, direction, or both.'],['Can an object accelerate at constant speed?','Yes, if the direction of velocity changes.'],['What is acceleration?','Rate of change of velocity.']],core:['In uniform circular motion, speed is constant but velocity continually changes direction. Therefore the object accelerates.','The centripetal acceleration is always directed toward the centre of the circle.','Its magnitude is a = v²/r. Using v = ωr gives a = ω²r.','The velocity vector is tangential to the circular path and is perpendicular to the centripetal acceleration vector.'],worked:['A car moves around a bend of radius 45 m at 12 m s⁻¹. Find its centripetal acceleration.','a = v²/r = 12²/45 = 3.2 m s⁻².'],task:'Use the simulation to keep speed constant and double the radius. Record what happens to centripetal acceleration and explain the proportionality.',check:['The instantaneous direction of centripetal acceleration is…',['tangent to the circle','away from the centre','toward the centre','in the direction of angular velocity'],2,'Centripetal means centre-seeking.'],exit:'Why is an object in uniform circular motion not in equilibrium?'},
 {id:'centripetal-force',code:'3.6.1.1',title:'Centripetal force and applications',sim:'circular',lead:'Treat centripetal force as the resultant inward force, not as an extra new force.',formulas:['F = mv² / r','F = mω²r'],objectives:['Calculate the required inward resultant force.','Identify the real force providing the centripetal force.','Apply circular-motion equations in unfamiliar contexts.'],retrieval:[['State Newton’s second law.','Resultant force = mass × acceleration.'],['What direction is centripetal acceleration?','Toward the centre.'],['What force acts on a satellite in circular orbit?','Gravity.']],core:['Centripetal force is the name given to the resultant force toward the centre of a circular path.','It may be provided by tension, friction, gravity, a normal contact force, or a combination of real forces.','Using F = ma with a = v²/r gives F = mv²/r.','Do not add a separate “centripetal force” arrow to a free-body diagram. Instead identify the real forces and find their inward resultant.'],worked:['A 0.50 kg mass moves at 4.0 m s⁻¹ in a horizontal circle of radius 0.80 m. Find the inward resultant force.','F = mv²/r = 0.50×4.0²/0.80 = 10 N.'],task:'For a car on a flat bend, identify the force that provides the centripetal force. Then predict what happens if the road is icy.',check:['For a satellite in a circular orbit, the centripetal force is provided by…',['engine thrust','gravity','air resistance','a separate centripetal force'],1,'Gravity itself is the inward resultant force.'],exit:'Write one sentence explaining why “centripetal force” should not be drawn as an additional force.'},
 {id:'shm-condition',code:'3.6.1.2',title:'The SHM condition',sim:'shm',lead:'Recognise simple harmonic motion from the relationship between acceleration and displacement.',formulas:['a ∝ −x','a = −ω²x'],objectives:['State the condition for SHM.','Use a = −ω²x.','Interpret the negative sign physically.'],retrieval:[['What is an equilibrium position?','The position where resultant force is zero.'],['What does a negative gradient mean?','As one variable increases, the other decreases.'],['What is angular frequency measured in?','rad s⁻¹.']],core:['Simple harmonic motion occurs when acceleration is directly proportional to displacement from equilibrium and directed toward equilibrium.','The defining equation is a = −ω²x. The minus sign shows that acceleration and displacement are in opposite directions.','At equilibrium x = 0, so acceleration is zero. At the endpoints |x| = A, acceleration magnitude is maximum.','Because the restoring acceleration changes with displacement, SHM is not motion at constant acceleration.'],worked:['An oscillator has ω = 6.0 rad s⁻¹ and is 0.050 m from equilibrium. Find its acceleration.','a = −ω²x = −6.0²×0.050 = −1.8 m s⁻². The negative sign means toward equilibrium.'],task:'Use the SHM simulation. Pause it at equilibrium and at maximum displacement. Compare x, v and a at each point.',check:['At maximum positive displacement in SHM, acceleration is…',['zero','maximum positive','maximum negative','constant'],2,'a = −ω²x, so positive maximum x gives negative maximum a.'],exit:'State the two parts of the SHM condition in words.'},
 {id:'shm-graphs',code:'3.6.1.2',title:'SHM graphs and phase',sim:'shm',lead:'Connect displacement, velocity and acceleration graphs and understand their phase relationships.',formulas:['x = A cos(ωt)','v = −Aω sin(ωt)','a = −Aω² cos(ωt)'],objectives:['Sketch x–t, v–t and a–t graphs.','Use gradients to connect the graphs.','Describe phase differences.'],retrieval:[['What does the gradient of a displacement–time graph give?','Velocity.'],['What does the gradient of a velocity–time graph give?','Acceleration.'],['What is one full cycle in phase angle?','2π rad or 360°.']],core:['For an oscillator starting at maximum positive displacement, x can be written x = A cos(ωt).','Velocity is the gradient of the displacement–time graph. It is zero at the endpoints and greatest in magnitude at equilibrium.','Acceleration is the gradient of the velocity–time graph and is exactly opposite in phase to displacement.','Velocity is a quarter cycle out of phase with displacement; acceleration is half a cycle out of phase with displacement.'],worked:['An oscillator has A = 0.080 m and f = 2.0 Hz. Find ω.','ω = 2πf = 12.6 rad s⁻¹.'],task:'Sketch x, v and a against time on the same time axis for one complete cycle, starting at x = +A.',check:['When x = 0 in SHM, the speed is…',['zero','maximum','always negative','equal to acceleration'],1,'The oscillator has maximum kinetic energy and speed at equilibrium.'],exit:'Why does acceleration have the opposite sign to displacement throughout SHM?'},
 {id:'shm-speed',code:'3.6.1.2',title:'Maximum speed and acceleration',sim:'shm',lead:'Use amplitude and angular frequency to calculate the extreme values of speed and acceleration.',formulas:['vmax = ωA','amax = ω²A','v = ±ω√(A² − x²)'],objectives:['Calculate maximum speed.','Calculate maximum acceleration.','Relate speed to displacement.'],retrieval:[['Where is SHM speed maximum?','At equilibrium.'],['Where is acceleration magnitude maximum?','At maximum displacement.'],['What is amplitude?','Maximum displacement from equilibrium.']],core:['At equilibrium the restoring force and acceleration are zero, but the oscillator moves fastest.','The maximum speed is vmax = ωA.','At the endpoints the speed is zero and acceleration magnitude is maximum: amax = ω²A.','At any displacement x, energy or calculus gives v = ±ω√(A² − x²). The sign depends on direction of motion.'],worked:['A = 0.030 m and f = 4.0 Hz. Find vmax.','ω = 2πf = 25.1 rad s⁻¹; vmax = ωA = 0.754 m s⁻¹.'],task:'Calculate the speed when x = A/2 for an oscillator with A = 0.10 m and ω = 5.0 rad s⁻¹.',check:['If amplitude doubles while frequency stays constant, vmax…',['halves','doubles','quadruples','does not change'],1,'vmax = ωA.'],exit:'Describe x, v and a at the instant the oscillator passes through equilibrium.'},
 {id:'spring',code:'3.6.1.3',title:'Mass–spring SHM',sim:'spring',lead:'Link Hooke’s law to SHM and the period of a mass–spring oscillator.',formulas:['T = 2π√(m/k)','ω = √(k/m)','F = −kx'],objectives:['Explain why a spring–mass system can perform SHM.','Calculate period and frequency.','Predict how m and k affect T.'],retrieval:[['State Hooke’s law.','F = kΔL within the limit of proportionality.'],['What does k measure?','Spring stiffness in N m⁻¹.'],['How is T related to f?','T = 1/f.']],core:['For a horizontal spring, Hooke’s law gives restoring force F = −kx. Dividing by mass gives a = −(k/m)x, which matches the SHM condition.','Therefore ω² = k/m and T = 2π√(m/k).','Increasing mass increases the period. Increasing spring constant decreases the period.','For a vertical spring, equilibrium shifts because of weight, but oscillations about that equilibrium still follow the same period expression for an ideal spring.'],worked:['A 0.40 kg mass is attached to a spring with k = 25 N m⁻¹. Find T.','T = 2π√(0.40/25) = 0.795 s.'],task:'Use RP7 mode to collect T² against m data. Explain why a graph of T² against m should be straight.',check:['Doubling the spring constant changes the period by a factor of…',['2','√2','1/√2','1/2'],2,'T ∝ 1/√k.'],exit:'Show how Hooke’s law leads to the SHM condition.'},
 {id:'pendulum',code:'3.6.1.3',title:'Simple pendulum SHM',sim:'pendulum',lead:'Use the small-angle approximation to model a pendulum as an SHM system.',formulas:['T = 2π√(L/g)','ω = √(g/L)'],objectives:['Use the pendulum period equation.','Explain the small-angle requirement.','Identify which variables affect period.'],retrieval:[['Which component of weight acts tangentially on a pendulum bob?','mg sinθ.'],['What is the small-angle approximation used for pendulums?','For small angles in radians, sinθ ≈ θ.'],['Does bob mass affect ideal pendulum period?','No.']],core:['The restoring component of weight is toward the equilibrium position. For small angles, sinθ ≈ θ when θ is measured in radians.','This makes restoring acceleration approximately proportional to displacement, so the motion is approximately SHM.','The period is T = 2π√(L/g). It does not depend on bob mass and is approximately independent of amplitude only for small angles.','A longer pendulum has a longer period; a larger gravitational field strength gives a shorter period.'],worked:['Find the period of a 0.80 m pendulum where g = 9.81 m s⁻².','T = 2π√(0.80/9.81) = 1.79 s.'],task:'Use the pendulum practical model to compare a small release angle with a larger one. Explain why the equation is an approximation.',check:['Which change increases the ideal pendulum period?',['Increase mass','Decrease length','Increase length','Increase bob density'],2,'T ∝ √L.'],exit:'Why must the angle be small when deriving the pendulum SHM equation?'},
 {id:'energy',code:'3.6.1.3',title:'Energy in SHM',sim:'shm',lead:'Track kinetic, potential and total energy through an oscillation.',formulas:['Etotal = ½kA²','Ep = ½kx²','Ek = Etotal − Ep'],objectives:['Describe energy transfers in SHM.','Calculate elastic potential and kinetic energy.','Relate energy to displacement.'],retrieval:[['Where is speed maximum in SHM?','At equilibrium.'],['What is elastic potential energy?','Energy stored by deformation; for an ideal spring, ½kx².'],['What happens to total energy in ideal undamped SHM?','It remains constant.']],core:['In an ideal oscillator with no damping, total mechanical energy stays constant.','At maximum displacement the speed is zero, so kinetic energy is zero and potential energy is maximum.','At equilibrium x = 0, potential energy is minimum and kinetic energy is maximum.','For a spring oscillator, Ep = ½kx² and Etotal = ½kA². Energy depends on displacement squared, so the energy graphs are not simple sine waves with the same period as x.'],worked:['A spring has k = 40 N m⁻¹ and amplitude 0.10 m. Find total energy.','E = ½kA² = 0.5×40×0.10² = 0.20 J.'],task:'For the same oscillator, calculate kinetic energy when x = 0.060 m.',check:['At x = ±A in ideal SHM…',['KE is maximum','KE is zero','total energy is zero','acceleration is zero'],1,'The oscillator stops instantaneously at each turning point.'],exit:'Explain why the total-energy line is horizontal on an energy–displacement graph.'},
 {id:'damping',code:'3.6.1.3',title:'Damping',sim:'damping',lead:'See how resistive forces remove energy from an oscillator and change its motion.',formulas:['amplitude decreases with time','energy is dissipated to surroundings'],objectives:['Describe light, critical and heavy damping qualitatively.','Explain amplitude decay in energy terms.','Recognise damped oscillation graphs.'],retrieval:[['What is mechanical energy in an ideal oscillator?','KE + PE.'],['What is a resistive force?','A force opposing motion, such as drag or friction.'],['What is amplitude?','Maximum displacement from equilibrium.']],core:['Damping occurs when resistive forces transfer mechanical energy from the oscillator to the surroundings.','With light damping the system continues to oscillate but amplitude gradually falls.','Critical damping returns the system to equilibrium as quickly as possible without oscillating.','Heavy damping also avoids oscillation but returns more slowly than critical damping.'],worked:['A lightly damped oscillator is released. What happens to its maximum speed over time?','It decreases because the total mechanical energy and amplitude decrease.'],task:'Change damping in the simulation. Identify a setting that is lightly damped and one that returns to equilibrium without repeated oscillation.',check:['Critical damping is designed to…',['make resonance sharper','return to equilibrium quickly without oscillation','increase amplitude indefinitely','remove the restoring force'],1,'Critical damping gives the fastest non-oscillatory return.'],exit:'Explain damping using the language of energy transfer.'},
 {id:'resonance',code:'3.6.1.4',title:'Forced vibrations and resonance',sim:'resonance',lead:'Connect driving frequency, natural frequency, damping and response amplitude.',formulas:['resonance: fdrive ≈ fnatural','greater damping → lower, broader resonance peak'],objectives:['Distinguish free and forced vibrations.','Explain resonance.','Describe the effect of damping on resonance.'],retrieval:[['What is natural frequency?','The frequency at which a system tends to oscillate when displaced and released.'],['What is a forced vibration?','Oscillation caused by a periodic external driving force.'],['What does damping do to oscillation energy?','Transfers it to the surroundings.']],core:['A free vibration occurs when a system is displaced and then allowed to oscillate at its natural frequency.','A forced vibration occurs when a periodic driving force makes the system oscillate.','Resonance occurs when the driving frequency is close to the natural frequency, producing a large response amplitude because energy is transferred efficiently.','Increasing damping reduces the maximum amplitude and makes the resonance peak broader and less sharp. Resonance can be useful or potentially damaging depending on the system.'],worked:['A system has natural frequency 2.5 Hz. At which driving frequency would the largest steady response be expected if damping is small?','Close to 2.5 Hz.'],task:'Use the resonance simulation to compare low and high damping. Record how the peak height and width change.',check:['Increasing damping usually makes a resonance curve…',['taller and narrower','lower and broader','unchanged','move to zero frequency'],1,'Damping reduces the peak and decreases its sharpness.'],exit:'Explain resonance in terms of the relationship between driving frequency and natural frequency.'}
];

const completed=new Set(JSON.parse(localStorage.getItem('fm-completed')||'[]'));
let activeLesson=0;
function saveProgress(){
 localStorage.setItem('fm-completed',JSON.stringify([...completed]));
 const n=completed.size,p=100*n/lessons.length;
 $('#progressText').textContent=n+' / '+lessons.length+' complete';
 $('#progressFill').style.width=p+'%';
 renderSpec();
}
function openView(id){
 $$('.view').forEach(v=>v.classList.toggle('active-view',v.id==='view-'+id));
 $$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===id));
 window.scrollTo({top:0,behavior:'smooth'});
}
$$('[data-view]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.view)));
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>openView(b.dataset.jump)));
$('#resetProgress').addEventListener('click',()=>{completed.clear();saveProgress();renderCourseList();renderLesson();});

function renderCourseList(){
 $('#courseList').innerHTML=lessons.map((l,i)=>'<button class="course-button '+(i===activeLesson?'active ':'')+(completed.has(l.id)?'complete':'')+'" data-lesson="'+i+'"><span class="course-code">AQA '+l.code+'</span><span class="course-title">'+(i+1)+'. '+l.title+'</span></button>').join('');
 $$('[data-lesson]').forEach(b=>b.addEventListener('click',()=>{activeLesson=Number(b.dataset.lesson);renderCourseList();renderLesson();}));
}
function chunkButton(name,i){return '<button class="chunk-button '+(i===0?'active':'')+'" data-chunk-button="'+i+'">'+name+'</button>';}
function qaList(items){
 return items.map((x,i)=>'<div class="mini-question"><p><strong>'+(i+1)+'. '+x[0]+'</strong></p><textarea class="student-answer" placeholder="Type your answer here..."></textarea><button class="text-button" data-reveal>Reveal answer</button><div class="answer-reveal">'+x[1]+'</div></div>').join('');
}
function renderLesson(){
 const l=lessons[activeLesson];
 const c=l.check;
 $('#lessonPanel').innerHTML=
  '<span class="eyebrow">AQA '+l.code+'</span><h2>'+l.title+'</h2><p class="lesson-lead">'+l.lead+'</p>'+
  '<div>'+l.formulas.map(f=>'<span class="formula-chip">'+f+'</span>').join('')+'</div>'+
  '<div class="chunk-strip">'+['Retrieval','Objectives','Core teaching','Worked example','Activity','Knowledge check','Exit ticket'].map(chunkButton).join('')+'</div>'+
  '<section class="chunk active" data-chunk="0"><div class="lesson-block"><h3>Retrieval starter</h3>'+qaList(l.retrieval)+'</div></section>'+
  '<section class="chunk" data-chunk="1"><div class="lesson-grid"><div class="lesson-block remember"><h3>Learning objectives</h3><ul>'+l.objectives.map(x=>'<li>'+x+'</li>').join('')+'</ul></div><div class="lesson-block"><h3>Key language</h3><p>Use precise A-level vocabulary and include direction, proportionality and conditions where they matter.</p></div></div></section>'+
  '<section class="chunk" data-chunk="2"><div class="lesson-block"><h3>Core teaching</h3><ol>'+l.core.map(x=>'<li>'+x+'</li>').join('')+'</ol></div><button class="button lesson-sim-link" data-open-sim="'+l.sim+'">Open linked simulation</button></section>'+
  '<section class="chunk" data-chunk="3"><div class="lesson-block worked-block"><h3>Worked example</h3><p><strong>'+l.worked[0]+'</strong></p><p>'+l.worked[1]+'</p></div></section>'+
  '<section class="chunk" data-chunk="4"><div class="lesson-block"><h3>Student activity</h3><p>'+l.task+'</p><textarea class="student-answer" placeholder="Write your working, observations or explanation here..."></textarea></div></section>'+
  '<section class="chunk" data-chunk="5"><div class="mini-question"><p><strong>'+c[0]+'</strong></p><div class="mini-options">'+c[1].map((x,i)=>'<button class="mini-option" data-mini="'+i+'">'+x+'</button>').join('')+'</div><div class="answer-reveal" id="miniExplain">'+c[3]+'</div></div></section>'+
  '<section class="chunk" data-chunk="6"><div class="lesson-block remember"><h3>Exit ticket</h3><p>'+l.exit+'</p><textarea class="student-answer" placeholder="Write a complete exam-style answer..."></textarea></div></section>'+
  '<div class="lesson-actions"><button class="button primary" id="completeLesson">'+(completed.has(l.id)?'✓ Lesson complete':'Mark lesson complete')+'</button><button class="button" id="prevLesson">Previous</button><button class="button" id="nextLesson">Next lesson</button></div>';
 $$('[data-chunk-button]').forEach(b=>b.addEventListener('click',()=>{$$('[data-chunk-button]').forEach(x=>x.classList.toggle('active',x===b));$$('[data-chunk]').forEach(x=>x.classList.toggle('active',x.dataset.chunk===b.dataset.chunkButton));}));
 $$('[data-reveal]').forEach(b=>b.addEventListener('click',()=>b.nextElementSibling.classList.toggle('visible')));
 $$('[data-mini]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.mini);$$('[data-mini]').forEach(x=>x.disabled=true);b.classList.add(i===c[2]?'correct':'wrong');$$('[data-mini]')[c[2]].classList.add('correct');$('#miniExplain').classList.add('visible');}));
 $$('[data-open-sim]').forEach(b=>b.addEventListener('click',()=>{activeSim=b.dataset.openSim;renderSim();openView('lab');}));
 $('#completeLesson').addEventListener('click',()=>{if(completed.has(l.id))completed.delete(l.id);else completed.add(l.id);saveProgress();renderCourseList();renderLesson();});
 $('#prevLesson').addEventListener('click',()=>{activeLesson=(activeLesson-1+lessons.length)%lessons.length;renderCourseList();renderLesson();});
 $('#nextLesson').addEventListener('click',()=>{activeLesson=(activeLesson+1)%lessons.length;renderCourseList();renderLesson();});
}

const sims={
 circular:{title:'Circular motion',code:'3.6.1.1',subtitle:'Velocity is tangential; acceleration and resultant force point inward.',controls:[['radius','Radius',1.2,0.4,2.5,0.1,'m'],['omega','Angular speed',2.5,0.5,6,0.1,'rad s⁻¹'],['mass','Mass',0.8,0.1,3,0.1,'kg']],simple:'Changing direction means changing velocity, even when speed is constant.',exam:'In uniform circular motion the velocity changes direction continuously, so there is centripetal acceleration toward the centre.',mistake:'Do not draw “centripetal force” as an extra force. It is the inward resultant of real forces.',check:['If radius doubles at fixed angular speed, centripetal acceleration…',['halves','doubles','stays constant'],1,'a = ω²r.']},
 shm:{title:'SHM phase explorer',code:'3.6.1.2',subtitle:'Watch displacement, velocity and acceleration change through one cycle.',controls:[['amp','Amplitude',0.12,0.03,0.20,0.01,'m'],['freq','Frequency',1.0,0.2,2.5,0.1,'Hz']],simple:'The object speeds up toward equilibrium and slows down toward the turning points.',exam:'For SHM, acceleration is proportional to displacement from equilibrium and opposite in direction: a = −ω²x.',mistake:'Maximum speed is at equilibrium, not at maximum displacement.',check:['At x = 0, acceleration is…',['maximum','zero','equal to speed'],1,'a = −ω²x.']},
 spring:{title:'Mass–spring oscillator',code:'3.6.1.3',subtitle:'Change mass and stiffness to see how the natural period changes.',controls:[['mass','Mass',0.40,0.10,1.00,0.05,'kg'],['k','Spring constant',24,8,50,1,'N m⁻¹'],['amp','Amplitude',0.08,0.02,0.15,0.01,'m']],simple:'A heavier mass oscillates more slowly; a stiffer spring oscillates more quickly.',exam:'Hooke’s law gives F = −kx, so a = −(k/m)x and the motion is SHM with T = 2π√(m/k).',mistake:'Amplitude does not appear in the ideal period equation.',check:['If mass increases, period generally…',['increases','decreases','stays constant'],0,'T ∝ √m.']},
 pendulum:{title:'Simple pendulum',code:'3.6.1.3',subtitle:'Explore length, release angle and the small-angle SHM model.',controls:[['length','Length',0.80,0.20,1.50,0.05,'m'],['angle','Release angle',8,2,25,1,'°']],simple:'Longer pendulums take longer to complete each swing.',exam:'For small angular displacements, sinθ ≈ θ in radians, giving approximate SHM and T = 2π√(L/g).',mistake:'The ideal small-angle period does not depend on bob mass.',check:['Increasing pendulum length makes T…',['larger','smaller','unchanged'],0,'T ∝ √L.']},
 damping:{title:'Damping explorer',code:'3.6.1.3',subtitle:'See amplitude decay as energy is transferred to the surroundings.',controls:[['amp','Initial amplitude',0.14,0.04,0.20,0.01,'m'],['freq','Natural frequency',1.0,0.4,2.0,0.1,'Hz'],['damp','Damping',0.18,0.00,0.80,0.02,'relative']],simple:'Damping removes mechanical energy, so the oscillation becomes smaller.',exam:'A resistive force transfers energy from the oscillator to the surroundings, reducing amplitude with time.',mistake:'Damping does not mean the restoring force disappears.',check:['More damping generally makes amplitude decay…',['faster','slower','not at all'],0,'More energy is dissipated per cycle.']},
 resonance:{title:'Forced vibrations and resonance',code:'3.6.1.4',subtitle:'Move the driving frequency across resonance and compare damping.',controls:[['natural','Natural frequency',2.0,0.8,4.0,0.1,'Hz'],['drive','Driving frequency',2.0,0.5,5.0,0.1,'Hz'],['damp','Damping',0.18,0.05,0.70,0.02,'relative']],simple:'The response is largest when the driving rhythm is close to the system’s own natural rhythm.',exam:'Resonance occurs when the driving frequency is close to the natural frequency, producing a large amplitude response. Greater damping lowers and broadens the resonance peak.',mistake:'Resonance is not simply “vibrating a lot”; it depends on matching driving and natural frequencies.',check:['Greater damping makes the resonance peak…',['higher and sharper','lower and broader','unchanged'],1,'Damping reduces the maximum response and sharpness.']}
};
let activeSim='circular',simVals={},running=true,slow=false,simTime=0,last=performance.now();
const canvas=$('#simCanvas'),ctx=canvas.getContext('2d');

function renderSimTabs(){
 $('#simTabs').innerHTML=Object.keys(sims).map(k=>'<button class="sim-tab '+(k===activeSim?'active':'')+'" data-sim="'+k+'">'+sims[k].title+'</button>').join('');
 $$('[data-sim]').forEach(b=>b.addEventListener('click',()=>{activeSim=b.dataset.sim;simTime=0;renderSim();}));
}
function renderSim(){
 const s=sims[activeSim];
 $('#simCode').textContent='AQA '+s.code;$('#simTitle').textContent=s.title;$('#simSubtitle').textContent=s.subtitle;$('#simSpec').textContent='AQA '+s.code;
 simVals={};s.controls.forEach(c=>simVals[c[0]]=c[2]);
 $('#simControls').innerHTML=s.controls.map(c=>'<label class="field"><span>'+c[1]+'</span><input type="range" data-control="'+c[0]+'" min="'+c[3]+'" max="'+c[4]+'" value="'+c[2]+'" step="'+c[5]+'"><output data-output="'+c[0]+'">'+c[2]+' '+c[6]+'</output></label>').join('');
 $$('[data-control]').forEach(i=>i.addEventListener('input',()=>{simVals[i.dataset.control]=Number(i.value);const c=s.controls.find(x=>x[0]===i.dataset.control);$('[data-output="'+i.dataset.control+'"]').textContent=Number(i.value).toFixed(c[5]<0.1?2:1)+' '+c[6];updateReadout();}));
 $('#simpleExplain').textContent=s.simple;$('#examExplain').textContent=s.exam;$('#mistakeExplain').textContent=s.mistake;
 const q=s.check;$('#simCheck').innerHTML='<p>'+q[0]+'</p><div class="quick-options">'+q[1].map((x,i)=>'<button class="quick-option" data-quick="'+i+'">'+x+'</button>').join('')+'</div><div class="answer-reveal" id="quickExplain">'+q[3]+'</div>';
 $$('[data-quick]').forEach(b=>b.addEventListener('click',()=>{const i=Number(b.dataset.quick);$$('[data-quick]').forEach(x=>x.disabled=true);b.classList.add(i===q[2]?'correct':'wrong');$$('[data-quick]')[q[2]].classList.add('correct');$('#quickExplain').classList.add('visible');}));
 renderSimTabs();updateReadout();
}
function updateReadout(){
 const v=simVals;
 if(activeSim==='circular'){const speed=v.omega*v.radius,a=v.omega*v.omega*v.radius,F=v.mass*a,T=TAU/v.omega;$('#simReadout').innerHTML='v = ωr = <strong>'+fmt(speed)+' m s⁻¹</strong><br>a = ω²r = <strong>'+fmt(a)+' m s⁻²</strong><br>F = ma = <strong>'+fmt(F)+' N</strong><br>T = 2π/ω = <strong>'+fmt(T)+' s</strong>';}
 if(activeSim==='shm'){const w=TAU*v.freq,x=v.amp*Math.cos(w*simTime),vel=-v.amp*w*Math.sin(w*simTime),a=-w*w*x;$('#simReadout').innerHTML='ω = '+fmt(w)+' rad s⁻¹<br>x = <strong>'+fmt(x)+' m</strong><br>v = <strong>'+fmt(vel)+' m s⁻¹</strong><br>a = <strong>'+fmt(a)+' m s⁻²</strong>';}
 if(activeSim==='spring'){const w=Math.sqrt(v.k/v.mass),T=TAU/w;$('#simReadout').innerHTML='ω = √(k/m) = <strong>'+fmt(w)+' rad s⁻¹</strong><br>T = 2π√(m/k) = <strong>'+fmt(T)+' s</strong>';}
 if(activeSim==='pendulum'){const T=TAU*Math.sqrt(v.length/9.81),f=1/T;$('#simReadout').innerHTML='T = 2π√(L/g) = <strong>'+fmt(T)+' s</strong><br>f = <strong>'+fmt(f)+' Hz</strong><br>small-angle model most accurate at low amplitudes';}
 if(activeSim==='damping'){const env=v.amp*Math.exp(-v.damp*simTime),w=TAU*v.freq;$('#simReadout').innerHTML='instantaneous envelope ≈ <strong>'+fmt(env)+' m</strong><br>x ≈ Ae<sup>−bt</sup>cos(ωt) for visual modelling<br>energy and amplitude decrease with time';}
 if(activeSim==='resonance'){const r=v.drive/v.natural,z=v.damp,response=1/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*z*r,2));$('#simReadout').innerHTML='f<sub>drive</sub>/f<sub>natural</sub> = <strong>'+fmt(r)+'</strong><br>relative response = <strong>'+fmt(response)+'</strong><br>largest response occurs close to resonance';}
}
function resizeCanvas(){const dpr=Math.min(2,window.devicePixelRatio||1),r=canvas.getBoundingClientRect();canvas.width=Math.max(1,r.width*dpr);canvas.height=Math.max(1,r.height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);}
window.addEventListener('resize',resizeCanvas);
function arrow(x1,y1,x2,y2,label,color){
 const a=Math.atan2(y2-y1,x2-x1),head=10;ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-head*Math.cos(a-.5),y2-head*Math.sin(a-.5));ctx.lineTo(x2-head*Math.cos(a+.5),y2-head*Math.sin(a+.5));ctx.closePath();ctx.fill();if(label){ctx.font='13px system-ui';ctx.fillText(label,(x1+x2)/2+6,(y1+y2)/2-6);}
}
function drawGrid(w,h){
 ctx.strokeStyle='rgba(120,160,200,.10)';ctx.lineWidth=1;
 for(let x=0;x<w;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}
 for(let y=0;y<h;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}
}
function drawSim(){
 resizeCanvas();const w=canvas.getBoundingClientRect().width,h=canvas.getBoundingClientRect().height;ctx.clearRect(0,0,w,h);drawGrid(w,h);ctx.font='14px system-ui';ctx.fillStyle='#dceaff';
 const v=simVals;
 if(activeSim==='circular'){
  const cx=w*.5,cy=h*.52,R=Math.min(w,h)*(.16+.07*(v.radius-.4)/2.1),ang=v.omega*simTime;
  ctx.strokeStyle='#46647f';ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R,0,TAU);ctx.stroke();
  ctx.fillStyle='#5f7790';ctx.beginPath();ctx.arc(cx,cy,8,0,TAU);ctx.fill();
  const x=cx+R*Math.cos(ang),y=cy+R*Math.sin(ang);ctx.fillStyle='#ffd56a';ctx.beginPath();ctx.arc(x,y,14,0,TAU);ctx.fill();
  const tx=-Math.sin(ang),ty=Math.cos(ang);arrow(x,y,x+tx*85,y+ty*85,'v','#63d9a4');arrow(x,y,x+(cx-x)*.55,y+(cy-y)*.55,'a, F','#ff7b87');
  ctx.fillStyle='#dceaff';ctx.fillText('radius '+v.radius.toFixed(2)+' m',20,h-25);
 }
 if(activeSim==='shm'){
  const ww=TAU*v.freq,x=v.amp*Math.cos(ww*simTime),vel=-v.amp*ww*Math.sin(ww*simTime),a=-ww*ww*x,mid=w*.5,scale=Math.min(w*.34,280)/.2,y=h*.33,px=mid+x*scale;
  ctx.strokeStyle='#71869d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(50,y);ctx.lineTo(w-50,y);ctx.stroke();
  ctx.fillStyle='#67c7ff';ctx.fillRect(px-36,y-24,72,48);ctx.strokeStyle='#9db1c9';ctx.beginPath();ctx.moveTo(mid,y-55);ctx.lineTo(mid,y+55);ctx.stroke();
  arrow(px,y-60,px+clamp(vel*70,-130,130),y-60,'v','#63d9a4');arrow(px,y+75,px+clamp(a*18,-130,130),y+75,'a','#ff7b87');
  const gy=h*.72,gw=w-80,gh=h*.18;ctx.strokeStyle='#314b65';ctx.strokeRect(40,gy-gh/2,gw,gh);
  ctx.strokeStyle='#67c7ff';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=160;i++){const t=simTime-1.5+i/160*3,xx=40+i/160*gw,yy=gy-v.amp*Math.cos(ww*t)*gh/(.45);if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.stroke();ctx.fillStyle='#dceaff';ctx.fillText('displacement–time',48,gy-gh/2-8);
 }
 if(activeSim==='spring'){
  const ww=Math.sqrt(v.k/v.mass),x=v.amp*Math.cos(ww*simTime),cx=w*.5,top=35,base=h*.5,py=base+x*850;
  ctx.strokeStyle='#b7c5d4';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,top);for(let i=1;i<=16;i++){ctx.lineTo(cx+(i%2?20:-20),top+i*(py-top)/17);}ctx.lineTo(cx,py);ctx.stroke();
  ctx.fillStyle='#67c7ff';ctx.fillRect(cx-55,py,110,58);ctx.fillStyle='#fff';ctx.fillText(v.mass.toFixed(2)+' kg',cx-25,py+34);
  ctx.strokeStyle='#425d77';ctx.beginPath();ctx.moveTo(cx-120,base+28);ctx.lineTo(cx+120,base+28);ctx.stroke();ctx.fillStyle='#dceaff';ctx.fillText('equilibrium',cx+125,base+33);
 }
 if(activeSim==='pendulum'){
  const theta=v.angle*Math.PI/180*Math.cos(Math.sqrt(9.81/v.length)*simTime),cx=w*.5,cy=45,L=Math.min(h*.6,170+v.length*120),bx=cx+L*Math.sin(theta),by=cy+L*Math.cos(theta);
  ctx.strokeStyle='#c9d4df';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(bx,by);ctx.stroke();ctx.fillStyle='#ffd56a';ctx.beginPath();ctx.arc(bx,by,18,0,TAU);ctx.fill();
  ctx.strokeStyle='#42617d';ctx.beginPath();ctx.arc(cx,cy,L,Math.PI/2-v.angle*Math.PI/180,Math.PI/2+v.angle*Math.PI/180);ctx.stroke();ctx.fillStyle='#dceaff';ctx.fillText('small-angle SHM model',25,h-25);
 }
 if(activeSim==='damping'){
  const ww=TAU*v.freq,env=v.amp*Math.exp(-v.damp*simTime),x=env*Math.cos(ww*simTime),mid=w*.5,y=h*.30,scale=Math.min(w*.34,280)/.2,px=mid+x*scale;
  ctx.strokeStyle='#71869d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(50,y);ctx.lineTo(w-50,y);ctx.stroke();ctx.fillStyle='#67c7ff';ctx.fillRect(px-32,y-22,64,44);
  const x0=45,y0=h*.67,gw=w-90,gh=h*.23;ctx.strokeStyle='#314b65';ctx.strokeRect(x0,y0-gh/2,gw,gh);ctx.strokeStyle='#67c7ff';ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=180;i++){const t=i/180*7,amp=v.amp*Math.exp(-v.damp*t),yy=y0-amp*Math.cos(ww*t)*gh/.45,xx=x0+i/180*gw;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.stroke();ctx.fillStyle='#dceaff';ctx.fillText('amplitude decays as energy is dissipated',x0,y0-gh/2-10);
 }
 if(activeSim==='resonance'){
  const x0=55,y0=h-70,gw=w-105,gh=h-140,fn=v.natural,z=v.damp;
  ctx.strokeStyle='#8ca0b7';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x0,35);ctx.lineTo(x0,y0);ctx.lineTo(x0+gw,y0);ctx.stroke();
  ctx.strokeStyle='#67c7ff';ctx.lineWidth=3;ctx.beginPath();let maxR=0;
  for(let i=0;i<=180;i++){const f=.3+i/180*5.2,r=f/fn,R=1/Math.sqrt(Math.pow(1-r*r,2)+Math.pow(2*z*r,2));maxR=Math.max(maxR,R);const xx=x0+i/180*gw,yy=y0-Math.min(1,R/5)*gh;if(i===0)ctx.moveTo(xx,yy);else ctx.lineTo(xx,yy);}ctx.stroke();
  const rd=v.drive/fn,Rd=1/Math.sqrt(Math.pow(1-rd*rd,2)+Math.pow(2*z*rd,2)),mx=x0+clamp((v.drive-.3)/5.2,0,1)*gw,my=y0-Math.min(1,Rd/5)*gh;
  ctx.fillStyle='#ffd56a';ctx.beginPath();ctx.arc(mx,my,8,0,TAU);ctx.fill();ctx.strokeStyle='#ffd56a';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(mx,y0);ctx.lineTo(mx,my);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='#dceaff';ctx.fillText('response amplitude',10,25);ctx.fillText('driving frequency',w-150,h-28);
 }
}
function animate(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(running)simTime+=dt*(slow?.3:1);drawSim();updateReadout();requestAnimationFrame(animate);}
requestAnimationFrame(animate);
$('#playPause').addEventListener('click',()=>{running=!running;$('#playPause').textContent=running?'Pause':'Play';$('#simState').textContent=running?(slow?'Slow motion':'Running'):'Paused';});
$('#slowMotion').addEventListener('click',()=>{slow=!slow;$('#slowMotion').textContent=slow?'Normal speed':'Slow motion';$('#simState').textContent=running?(slow?'Slow motion':'Running'):'Paused';});
$('#resetSim').addEventListener('click',()=>{simTime=0;renderSim();});

const formulas=[
 {name:'Radians from arc length',desc:'θ = s/r',inputs:[['s','Arc length',1.20,'m'],['r','Radius',0.40,'m']],calc:v=>({steps:['θ = s/r','θ = '+v.s+' / '+v.r],answer:v.s/v.r,unit:'rad'})},
 {name:'Angular speed',desc:'ω = 2πf',inputs:[['f','Frequency',3,'Hz']],calc:v=>({steps:['ω = 2πf'],answer:TAU*v.f,unit:'rad s⁻¹'})},
 {name:'Linear speed',desc:'v = ωr',inputs:[['omega','Angular speed',4,'rad s⁻¹'],['r','Radius',0.60,'m']],calc:v=>({steps:['v = ωr'],answer:v.omega*v.r,unit:'m s⁻¹'})},
 {name:'Centripetal acceleration',desc:'a = v²/r',inputs:[['v','Speed',12,'m s⁻¹'],['r','Radius',45,'m']],calc:v=>({steps:['a = v²/r'],answer:v.v*v.v/v.r,unit:'m s⁻²'})},
 {name:'Centripetal force',desc:'F = mv²/r',inputs:[['m','Mass',0.50,'kg'],['v','Speed',4,'m s⁻¹'],['r','Radius',0.80,'m']],calc:v=>({steps:['F = mv²/r'],answer:v.m*v.v*v.v/v.r,unit:'N'})},
 {name:'SHM acceleration',desc:'a = −ω²x',inputs:[['omega','Angular frequency',6,'rad s⁻¹'],['x','Displacement',0.05,'m']],calc:v=>({steps:['a = −ω²x'],answer:-v.omega*v.omega*v.x,unit:'m s⁻²'})},
 {name:'SHM maximum speed',desc:'vmax = ωA',inputs:[['omega','Angular frequency',8,'rad s⁻¹'],['A','Amplitude',0.06,'m']],calc:v=>({steps:['vmax = ωA'],answer:v.omega*v.A,unit:'m s⁻¹'})},
 {name:'SHM maximum acceleration',desc:'amax = ω²A',inputs:[['omega','Angular frequency',8,'rad s⁻¹'],['A','Amplitude',0.06,'m']],calc:v=>({steps:['amax = ω²A'],answer:v.omega*v.omega*v.A,unit:'m s⁻²'})},
 {name:'Spring period',desc:'T = 2π√(m/k)',inputs:[['m','Mass',0.40,'kg'],['k','Spring constant',25,'N m⁻¹']],calc:v=>({steps:['T = 2π√(m/k)'],answer:TAU*Math.sqrt(v.m/v.k),unit:'s'})},
 {name:'Pendulum period',desc:'T = 2π√(L/g)',inputs:[['L','Length',0.80,'m'],['g','g',9.81,'m s⁻²']],calc:v=>({steps:['T = 2π√(L/g)'],answer:TAU*Math.sqrt(v.L/v.g),unit:'s'})},
 {name:'Spring total energy',desc:'E = ½kA²',inputs:[['k','Spring constant',40,'N m⁻¹'],['A','Amplitude',0.10,'m']],calc:v=>({steps:['E = ½kA²'],answer:.5*v.k*v.A*v.A,unit:'J'})},
 {name:'SHM speed at displacement',desc:'v = ω√(A²−x²)',inputs:[['omega','Angular frequency',5,'rad s⁻¹'],['A','Amplitude',0.10,'m'],['x','Displacement',0.05,'m']],calc:v=>({steps:['v = ω√(A²−x²)'],answer:v.omega*Math.sqrt(Math.max(0,v.A*v.A-v.x*v.x)),unit:'m s⁻¹'})}
];
function renderFormula(){
 $('#formulaSelect').innerHTML=formulas.map((f,i)=>'<option value="'+i+'">'+f.name+' — '+f.desc+'</option>').join('');
 $('#formulaSelect').addEventListener('change',renderFormulaInputs);
 $('#formulaCards').innerHTML=formulas.map(f=>'<article class="formula-card"><strong>'+f.name+'</strong><code>'+f.desc+'</code></article>').join('');
 renderFormulaInputs();
}
function renderFormulaInputs(){
 const f=formulas[Number($('#formulaSelect').value)||0];
 $('#formulaInputs').innerHTML=f.inputs.map(i=>'<label class="field"><span>'+i[1]+' / '+i[3]+'</span><input type="number" step="any" data-finput="'+i[0]+'" value="'+i[2]+'"></label>').join('');
 $$('[data-finput]').forEach(x=>x.addEventListener('input',calculateFormula));calculateFormula();
}
function calculateFormula(){
 const f=formulas[Number($('#formulaSelect').value)||0],v={};$$('[data-finput]').forEach(i=>v[i.dataset.finput]=Number(i.value));
 const r=f.calc(v),steps=(r.steps||[]).map(s=>'<span class="step">'+s+'</span>').join(''),ans='Answer = '+fmt(r.answer)+' '+(r.unit||'');
 $('#formulaWorking').innerHTML=steps+'<span class="step"><strong>'+ans+'</strong></span><span class="step muted">Check units, direction/sign and significant figures before finalising an exam answer.</span>';
}

const quiz=[
 ['3.6.1.1','One complete revolution equals…',['π rad','2π rad','360 rad','1 rad'],1,'Think of a full circle.','One full turn is 2π radians.'],
 ['3.6.1.1','A wheel rotates at 2.0 Hz. Its angular speed is closest to…',['3.14 rad s⁻¹','6.28 rad s⁻¹','12.6 rad s⁻¹','25.1 rad s⁻¹'],2,'Use ω = 2πf.','ω = 4π = 12.6 rad s⁻¹.'],
 ['3.6.1.1','In uniform circular motion, velocity points…',['toward the centre','away from the centre','tangent to the path','along the radius'],2,'Velocity follows the instantaneous direction of motion.','The velocity vector is tangential.'],
 ['3.6.1.1','Centripetal acceleration points…',['tangentially','toward the centre','away from the centre','upwards'],1,'Centripetal means centre-seeking.','It is directed inward.'],
 ['3.6.1.1','If speed doubles at fixed radius, centripetal acceleration…',['doubles','quadruples','halves','is unchanged'],1,'a = v²/r.','Doubling v multiplies a by four.'],
 ['3.6.1.1','A 2 kg mass has centripetal acceleration 5 m s⁻². Inward resultant force?',['0.4 N','2.5 N','7 N','10 N'],3,'Use F = ma.','F = 2×5 = 10 N.'],
 ['3.6.1.2','The defining condition for SHM is…',['a ∝ x','a ∝ −x','v ∝ −x','F = constant'],1,'Restoring acceleration must point toward equilibrium.','a is proportional to −x.'],
 ['3.6.1.2','At equilibrium in ideal SHM, acceleration is…',['maximum','zero','equal to ω','always negative'],1,'Put x = 0 into a = −ω²x.','Acceleration is zero.'],
 ['3.6.1.2','At equilibrium in ideal SHM, speed is…',['zero','maximum','minimum negative','constant'],1,'Think of energy transfer.','Speed is maximum.'],
 ['3.6.1.2','Acceleration is how far out of phase with displacement?',['π/4','π/2','π','2π'],2,'They have opposite signs at all times.','They are π radians out of phase.'],
 ['3.6.1.2','For SHM, vmax equals…',['ω/A','ωA','ω²A','A/ω'],1,'Use the maximum-speed relation.','vmax = ωA.'],
 ['3.6.1.2','For SHM, amax equals…',['ωA','ω²A','A/ω','Aω³'],1,'Use a = −ω²x at x = A.','amax = ω²A.'],
 ['3.6.1.3','The ideal mass–spring period is…',['2π√(m/k)','2π√(k/m)','m/k','2πm/k'],0,'Heavier masses oscillate more slowly.','T = 2π√(m/k).'],
 ['3.6.1.3','The ideal simple-pendulum period depends on…',['bob mass only','length and g','amplitude only','spring constant'],1,'Use T = 2π√(L/g).','It depends on length and gravitational field strength.'],
 ['3.6.1.3','The small-angle approximation used for a pendulum is…',['cosθ ≈ θ','sinθ ≈ θ','tanθ ≈ 1','θ ≈ π'],1,'Angle must be in radians.','For small θ in radians, sinθ ≈ θ.'],
 ['3.6.1.3','At maximum displacement in a spring oscillator, elastic PE is…',['zero','maximum','negative','equal to zero KE only if damped'],1,'Speed is zero at a turning point.','Elastic potential energy is maximum.'],
 ['3.6.1.3','Light damping causes amplitude to…',['grow','remain exactly constant','decrease gradually','become infinite'],2,'Energy is transferred away.','Amplitude gradually decreases.'],
 ['3.6.1.3','Critical damping returns a system to equilibrium…',['with the largest repeated oscillations','quickly without oscillating','only at resonance','with no energy transfer'],1,'Think of door closers or measuring instruments.','Critical damping gives the fastest non-oscillatory return.'],
 ['3.6.1.4','Resonance occurs when driving frequency is…',['zero','close to natural frequency','much smaller than natural frequency only','equal to amplitude'],1,'Compare two frequencies.','Maximum response occurs near the natural frequency.'],
 ['3.6.1.4','Increasing damping makes a resonance peak…',['higher and narrower','lower and broader','higher and broader','unchanged'],1,'Damping reduces sharpness.','The peak becomes lower and broader.']
];
let qi=0,score=0,streak=0;
function renderQuiz(){
 const q=quiz[qi];$('#quizSpec').textContent='AQA '+q[0];$('#quizQuestion').textContent=q[1];$('#quizChoices').innerHTML=q[2].map((x,i)=>'<button class="choice-button" data-choice="'+i+'">'+x+'</button>').join('');
 $('#quizHint').textContent=q[4];$('#quizHint').classList.add('hidden');$('#quizFeedback').className='feedback hidden';$('#nextQuestion').classList.add('hidden');$('#showHint').textContent='Show hint';
 $('#quizProgress').textContent=(qi+1)+' / '+quiz.length;$('#quizProgressFill').style.width=(100*(qi+1)/quiz.length)+'%';$('#quizScore').textContent=score;$('#quizStreak').textContent=streak;
 $$('[data-choice]').forEach(b=>b.addEventListener('click',()=>{const chosen=Number(b.dataset.choice);$$('[data-choice]').forEach(x=>x.disabled=true);b.classList.add(chosen===q[3]?'correct':'wrong');$$('[data-choice]')[q[3]].classList.add('correct');if(chosen===q[3]){score++;streak++;}else streak=0;$('#quizScore').textContent=score;$('#quizStreak').textContent=streak;const fb=$('#quizFeedback');fb.className='feedback '+(chosen===q[3]?'good':'bad');fb.textContent=(chosen===q[3]?'Correct. ':'Not quite. ')+q[5];$('#nextQuestion').classList.remove('hidden');}));
}
$('#showHint').addEventListener('click',()=>{$('#quizHint').classList.toggle('hidden');$('#showHint').textContent=$('#quizHint').classList.contains('hidden')?'Show hint':'Hide hint';});
$('#nextQuestion').addEventListener('click',()=>{qi=(qi+1)%quiz.length;renderQuiz();});
$('#restartQuiz').addEventListener('click',()=>{qi=0;score=0;streak=0;renderQuiz();});

const spec=[
 ['3.6.1.1','Circular motion','Radian measure, angular speed, v = ωr, centripetal acceleration and centripetal force.','radians'],
 ['3.6.1.2','Simple harmonic motion','SHM condition, a = −ω²x, x/v/a graphs, phase, maximum speed and maximum acceleration.','shm-condition'],
 ['3.6.1.3','Simple harmonic systems','Mass–spring and pendulum systems, energy variation and damping.','spring'],
 ['RP7','Required practical 7','Investigation of SHM using a mass–spring system and a simple pendulum.','spring'],
 ['3.6.1.4','Forced vibrations and resonance','Free and forced vibrations, resonance and effect of damping on resonance sharpness.','resonance']
];
function renderSpec(){
 const host=$('#specGrid');if(!host)return;
 host.innerHTML=spec.map(s=>'<article class="spec-card"><div class="status"><span class="eyebrow">'+s[0]+'</span><span class="status-dot '+(completed.has(s[3])?'done':'')+'"></span></div><h3>'+s[1]+'</h3><p>'+s[2]+'</p><button class="text-button" data-spec-lesson="'+s[3]+'">Open lesson</button></article>').join('');
 $$('[data-spec-lesson]').forEach(b=>b.addEventListener('click',()=>{const i=lessons.findIndex(l=>l.id===b.dataset.specLesson);if(i>=0){activeLesson=i;renderCourseList();renderLesson();openView('course');}}));
}

let springData=[],pendData=[];
function updatePracticalControls(){
 $('#springMassOut').textContent=Number($('#springMass').value).toFixed(2)+' kg';
 $('#springKOut').textContent=Number($('#springK').value).toFixed(0)+' N m⁻¹';
 $('#springBlock').textContent=Number($('#springMass').value).toFixed(2)+' kg';
 $('#pendLengthOut').textContent=Number($('#pendLength').value).toFixed(2)+' m';
 $('#pendAngleOut').textContent=Number($('#pendAngle').value).toFixed(0)+'°';
 const a=Number($('#pendAngle').value);$('#pendString').style.transform='rotate('+a+'deg)';$('#pendBob').style.transform='rotate('+a+'deg)';
}
['springMass','springK','pendLength','pendAngle'].forEach(id=>$('#'+id).addEventListener('input',updatePracticalControls));
$$('[data-practical]').forEach(b=>b.addEventListener('click',()=>{const spring=b.dataset.practical==='spring';$('#practicalSpring').classList.toggle('hidden',!spring);$('#practicalPendulum').classList.toggle('hidden',spring);$$('[data-practical]').forEach(x=>x.classList.toggle('primary',x===b));setTimeout(drawPracticalGraphs,30);}));

function drawScatter(canvasId,data,xKey,yKey,xLabel,yLabel){
 const c=$('#'+canvasId);if(!c)return;const r=c.getBoundingClientRect(),dpr=Math.min(2,window.devicePixelRatio||1);c.width=Math.max(1,r.width*dpr);c.height=Math.max(1,r.height*dpr);const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);const w=r.width,h=r.height;g.clearRect(0,0,w,h);g.strokeStyle='#66809a';g.lineWidth=1.5;g.beginPath();g.moveTo(42,15);g.lineTo(42,h-32);g.lineTo(w-12,h-32);g.stroke();g.fillStyle='#aabbd1';g.font='11px system-ui';g.fillText(yLabel,5,14);g.fillText(xLabel,w-75,h-10);if(!data.length)return;const xs=data.map(d=>d[xKey]),ys=data.map(d=>d[yKey]),xmax=Math.max(...xs)*1.12,ymax=Math.max(...ys)*1.12;data.forEach(d=>{const x=42+d[xKey]/xmax*(w-58),y=h-32-d[yKey]/ymax*(h-52);g.fillStyle='#67c7ff';g.beginPath();g.arc(x,y,5,0,TAU);g.fill();});
}
function drawPracticalGraphs(){drawScatter('springGraph',springData,'m','T2','m / kg','T² / s²');drawScatter('pendGraph',pendData,'L','T2','L / m','T² / s²');}
function renderSpringData(){
 $('#springRows').innerHTML=springData.map(r=>'<tr><td>'+r.m.toFixed(2)+'</td><td>'+r.tenT.toFixed(2)+'</td><td>'+r.T.toFixed(3)+'</td><td>'+r.T2.toFixed(3)+'</td></tr>').join('');
 $('#springSummary').textContent=springData.length?'Plot T² against m. For an ideal spring, gradient = 4π²/k. Repeats and timing 10 oscillations reduce percentage uncertainty.':'Collect at least three readings.';drawPracticalGraphs();
}
function renderPendData(){
 $('#pendRows').innerHTML=pendData.map(r=>'<tr><td>'+r.L.toFixed(2)+'</td><td>'+r.tenT.toFixed(2)+'</td><td>'+r.T.toFixed(3)+'</td><td>'+r.T2.toFixed(3)+'</td></tr>').join('');
 $('#pendSummary').textContent=pendData.length?'Plot T² against L. For an ideal small-angle pendulum, gradient = 4π²/g. Measure L from pivot to the bob’s centre.':'Collect at least three readings.';drawPracticalGraphs();
}
$('#takeSpringReading').addEventListener('click',()=>{const m=Number($('#springMass').value),k=Number($('#springK').value),T=TAU*Math.sqrt(m/k)*(1+(Math.random()-.5)*.012),tenT=10*T,T2=T*T;springData.push({m,T,tenT,T2});renderSpringData();const b=$('#springBlock');b.animate([{transform:'translateY(-8px)'},{transform:'translateY(12px)'},{transform:'translateY(-5px)'},{transform:'translateY(0)'}],{duration:850});});
$('#clearSpringData').addEventListener('click',()=>{springData=[];renderSpringData();});
$('#takePendReading').addEventListener('click',()=>{const L=Number($('#pendLength').value),ang=Number($('#pendAngle').value),correction=1+Math.pow(ang*Math.PI/180,2)/16,T=TAU*Math.sqrt(L/9.81)*correction*(1+(Math.random()-.5)*.008),tenT=10*T,T2=T*T;pendData.push({L,T,tenT,T2});renderPendData();const s=$('#pendString'),b=$('#pendBob');s.animate([{transform:'rotate(-'+ang+'deg)'},{transform:'rotate('+ang+'deg)'},{transform:'rotate(-'+ang+'deg)'}],{duration:900});b.animate([{transform:'rotate(-'+ang+'deg)'},{transform:'rotate('+ang+'deg)'},{transform:'rotate(-'+ang+'deg)'}],{duration:900});});
$('#clearPendData').addEventListener('click',()=>{pendData=[];renderPendData();});
window.addEventListener('resize',drawPracticalGraphs);

renderCourseList();renderLesson();saveProgress();renderSim();renderFormula();renderQuiz();renderSpec();updatePracticalControls();renderSpringData();renderPendData();
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
})();