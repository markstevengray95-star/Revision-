(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleSimulationMissionsV2';
  let state={}; try{state=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{}
  let current='',rendering=false;
  const missions={
    atom:{code:'3.2.1.1',q:'What can change in an atom without changing which element it is?',steps:[
      ['Identify the model','Turn on Inspect 3D and select the nucleus and electron region.','The element is fixed by proton number Z. Most atomic mass is in the nucleus; the electron region dominates the atom’s size.'],
      ['Make an isotope','Build carbon-12 and then carbon-14 without changing Z.','Z stays 6; neutron number changes, so A changes. They are isotopes of the same element.'],
      ['Make an ion','Build neutral sodium-23 and then Na⁺ by changing only the electron number.','Ion formation changes electron number, not the nucleus. Na⁺ has one fewer electron than neutral Na.']
    ],check:['Which change makes a different isotope of the same element?',['Change proton number','Change neutron number while Z stays fixed','Change the symbol only'],1]},
    specific:{code:'3.2.1.1',q:'Why can two particles with the same charge have very different specific charge?',steps:[
      ['Predict the sign','Create a neutral atom, a positive ion and a negative ion. Predict Q/m before reading it.','The sign of specific charge follows the sign of the net charge Q. Neutral particles have Q/m = 0.'],
      ['Change charge only','Keep the nucleus fixed and remove one electron, then another.','Changing Q while mass changes negligibly changes Q/m.'],
      ['Compare mass effects','Compare a light and heavier nucleus with similar charge state.','Specific charge is Q/m: for the same Q, greater mass gives smaller magnitude Q/m.']
    ],check:['Specific charge is…',['Q × m','Q / m','m / Q'],1]},
    strong:{code:'3.2.1.2',q:'How does the strong nuclear force change as two nucleons move apart?',steps:[
      ['Very close','Set the separation below about 0.5 fm.','The force is strongly repulsive at extremely small separation.'],
      ['Nuclear separation','Move to around 1 fm.','At typical nuclear separation the strong nuclear force is attractive and helps bind nucleons.'],
      ['Outside its range','Move beyond about 3 fm.','The strong nuclear force becomes negligible beyond a few femtometres.']
    ],check:['At roughly 1 fm the strong nuclear force is mainly…',['attractive','zero','always repulsive'],0]},
    decay:{code:'3.2.1.2',q:'How do alpha and beta-minus decay change A and Z?',steps:[
      ['Alpha first','Select α decay. Predict A and Z changes before watching.','Alpha emission removes ⁴₂He: A decreases by 4 and Z decreases by 2.'],
      ['Beta-minus','Select β⁻. Track the nucleus, electron and antineutrino.','In β⁻, neutron character changes to proton character: A is unchanged and Z increases by 1; e⁻ and ν̄ₑ are emitted.'],
      ['Explain the neutrino','Use the model guide to identify the antineutrino, then explain why it matters.','The neutrino was proposed from beta-decay evidence to account for missing energy; the complete modern reaction also conserves momentum and lepton number.']
    ],check:['In β⁻ decay the mass number A…',['decreases by 1','stays unchanged','increases by 1'],1]},
    antimatter:{code:'3.2.1.3',q:'How do energy and momentum constrain annihilation and pair production?',steps:[
      ['Compare a pair','Inspect a particle and its antiparticle.','They have equal mass/rest energy and opposite relevant additive quantum numbers; charged pairs have opposite charge.'],
      ['Run annihilation','Watch a slow e⁻ and e⁺ annihilate.','Their rest energy plus kinetic energy becomes photon energy. Two opposite photons are the standard low-momentum example.'],
      ['Run pair production','Create an e⁻e⁺ pair and identify the energy threshold and nearby body.','At least 1.022 MeV is needed for the pair’s rest energy, and recoil of a nearby body allows momentum to be conserved.']
    ],check:['Minimum e⁻e⁺ rest energy is…',['0.511 MeV','1.022 MeV','2.044 MeV'],1]},
    interactions:{code:'3.2.1.4',q:'How can an interaction diagram tell you which fundamental interaction is occurring?',steps:[
      ['Electromagnetic','Select the electromagnetic example and inspect the exchange particle.','AQA represents electromagnetic interaction using a virtual photon.'],
      ['Weak beta processes','Compare β⁻ and β⁺ and identify W⁻/W⁺.','The weak interaction can change quark character and is represented using W⁺ or W⁻.'],
      ['Other weak processes','Run electron capture and the electron–proton collision example.','AQA expects simple diagrams for β⁻, β⁺, electron capture and electron–proton collisions.']
    ],check:['The AQA electromagnetic exchange particle is…',['virtual photon','pion','W⁻'],0]},
    classification:{code:'3.2.1.5',q:'How can you classify an unfamiliar particle systematically?',steps:[
      ['First split','Compare hadrons and leptons.','Hadrons participate in the strong interaction; leptons do not.'],
      ['Split hadrons','Inspect baryons and mesons.','Baryons contain three quarks; mesons contain a quark and antiquark.'],
      ['Find strangeness','Inspect kaons and compare their production and decay.','Strange particles are produced through the strong interaction with total strangeness conserved, and decay through the weak interaction.']
    ],check:['A kaon is a…',['baryon','meson','lepton'],1]},
    quarks:{code:'3.2.1.6',q:'Can you build a hadron and prove its Q, B and S from its quarks?',steps:[
      ['Build nucleons','Build p = uud and n = udd.','Adding the fractional quark charges gives +e for the proton and 0 for the neutron; each has B = 1.'],
      ['Build a pion','Build a charged pion.','A pion is a quark–antiquark meson, so its total baryon number is 0.'],
      ['Build a kaon','Build a kaon containing s or s̄.','s has S = −1 and s̄ has S = +1, so kaons can have non-zero strangeness.']
    ],check:['The proton quark content is…',['udd','uud','u d̄'],1]},
    photo:{code:'3.2.2.1',q:'Which variable changes photon energy, and which mainly changes photon arrival rate?',steps:[
      ['Find the threshold','Choose a work function and lower frequency below threshold.','If hf < φ, no photoelectrons are emitted no matter how intense the light is.'],
      ['Cross the threshold','Raise frequency until emission starts.','Each photon transfers hf to one electron and KEmax = hf − φ.'],
      ['Change intensity only','Keep frequency above threshold fixed and increase intensity.','Intensity increases photon arrival rate and therefore emission rate; it does not increase the energy of each photon.']
    ],check:['At fixed frequency, increasing light intensity mainly increases…',['photon energy','number of photons arriving per second','work function'],1]},
    collisions:{code:'3.2.2.2',q:'Why do electron–atom collisions show threshold behaviour?',steps:[
      ['Below excitation','Set the incident energy below the first excitation energy.','The atom cannot accept an arbitrary smaller amount for a discrete excitation.'],
      ['Excitation','Raise the energy to an allowed excitation threshold.','A bound atomic electron moves to a higher allowed energy state.'],
      ['Ionisation','Raise the energy to the ionisation threshold.','Enough energy removes an electron completely; ionisation is different from excitation.']
    ],check:['Excitation means…',['an electron is removed completely','a bound electron moves to a higher allowed level','the nucleus changes Z'],1]},
    levels:{code:'3.2.2.3',q:'Why does an atom emit only particular spectral lines?',steps:[
      ['Choose two levels','Inspect the energy-level model before running a transition.','The horizontal levels represent allowed energies, not physical electron orbits.'],
      ['Run a downward transition','Watch the electron marker change level and the photon appear.','The emitted photon has energy ΔE = hf, exactly matching the energy lost by the atom.'],
      ['Compare gaps','Choose a larger and smaller ΔE.','Larger ΔE gives higher frequency and shorter wavelength, producing a different spectral line.']
    ],check:['A downward atomic transition…',['emits a photon','absorbs a photon','changes proton number'],0]},
    diffraction:{code:'3.2.2.4',q:'How does changing electron momentum alter its diffraction pattern?',steps:[
      ['Start low','Use a lower accelerating voltage and note λ and the ring pattern.','A moving electron has de Broglie wavelength λ = h/p.'],
      ['Increase voltage','Raise the accelerating voltage substantially.','Higher voltage gives higher momentum, so λ becomes shorter.'],
      ['Connect to evidence','Compare the ring spacing before and after.','Electron diffraction is wave-like behaviour of matter; the momentum trend supports the de Broglie model.']
    ],check:['If electron momentum doubles, de Broglie wavelength…',['doubles','halves','does not change'],1]},
    rutherford:{code:'3.8.1.1 extension',extension:true,q:'Optional nuclear-physics extension: how does impact parameter affect alpha scattering?',steps:[
      ['Most paths','Inspect trajectories far from the nucleus.','Most alpha particles pass with little deflection because atoms are mostly empty space.'],
      ['Close approach','Reduce impact parameter.','Closer approach to positive nuclear charge produces stronger electrostatic repulsion and larger deflection.'],
      ['Link evidence to model','Compare rare large deflections with the old diffuse-charge prediction.','Rare large-angle scattering supports a tiny region containing concentrated positive charge and most atomic mass.']
    ],check:['A smaller impact parameter generally gives…',['larger deflection','no force','smaller nuclear charge'],0]}
  };
  const getSim=()=>window.PARTICLELAB_CORE?.getCurrentSim?.()||$('#simNav .sim-tab.active')?.dataset.sim||'atom';
  const rec=id=>state[id]||(state[id]={steps:[],prediction:'',explanation:'',check:null,secure:false});
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
  function ensure(){
    const side=$('.lab-side'); if(!side)return null;
    let p=$('#simulationMissionPanel');
    if(!p){p=document.createElement('section');p.id='simulationMissionPanel';p.className='panel simulation-mission-panel';const controls=$('#simControls');controls?.insertAdjacentElement('beforebegin',p)}
    return p;
  }
  function render(id=getSim()){
    if(rendering)return; rendering=true;
    try{
      current=id; const m=missions[id]||missions.atom,r=rec(id),p=ensure();if(!p)return;
      const done=r.steps.filter(Boolean).length;
      p.innerHTML='<div class="mission-head"><div><span class="eyebrow">'+(m.extension?'Optional extension':'Learning mission · AQA '+m.code)+'</span><h3>'+m.q+'</h3></div><div class="mission-score"><strong>'+done+' / '+m.steps.length+'</strong><span>investigations</span></div></div>'+
        (m.extension?'<div class="mission-extension"><strong>Not part of the core Particles & Radiation route.</strong> This is kept separate as AQA 3.8.1.1 Nuclear Physics.</div>':'')+
        '<label class="mission-prediction"><strong>Predict before changing the model</strong><textarea id="missionPrediction" rows="2" placeholder="What do you expect to happen, and why?">'+(r.prediction||'')+'</textarea></label>'+
        '<div class="mission-step-list">'+m.steps.map((x,i)=>'<article class="mission-step '+(r.steps[i]?'secure':'')+'"><div class="mission-step-top"><span>'+(r.steps[i]?'✓':i+1)+'</span><div><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div></div><div class="mission-actions"><button class="button" data-mission-observe="'+i+'">Reveal expected observation</button><button class="button '+(r.steps[i]?'success':'')+'" data-mission-done="'+i+'">'+(r.steps[i]?'✓ Done':'I did this')+'</button></div><div class="mission-observation" id="missionObs'+i+'" hidden><strong>Expected physics:</strong> '+x[2]+'</div></article>').join('')+'</div>'+
        '<div class="mission-tools"><button class="button primary" id="missionInspect">Inspect objects in 3D</button><span id="missionInspectStatus">Turn on labels, then click a numbered marker in the 3D scene.</span></div>'+
        '<label class="mission-explain"><strong>Explain the result without the model</strong><textarea id="missionExplanation" rows="3" placeholder="Use AQA physics language: what changed, what stayed the same, and why?">'+(r.explanation||'')+'</textarea></label>'+
        '<div class="mission-check"><span class="eyebrow">Mastery check</span><p><strong>'+m.check[0]+'</strong></p><div class="mission-options">'+m.check[1].map((x,i)=>'<button class="quick-option '+(r.check===i?(i===m.check[2]?'correct':'wrong'):'')+'" data-mission-answer="'+i+'">'+x+'</button>').join('')+'</div><div class="mission-feedback">'+(r.secure?'✓ Correct — this simulation is secure. Explain it once more without looking before moving on.':(r.check!==null?'Review the expected observation, then try the question again.':''))+'</div></div>';
      $('#missionPrediction',p).oninput=e=>{r.prediction=e.target.value;save()};
      $('#missionExplanation',p).oninput=e=>{r.explanation=e.target.value;save()};
      $$('[data-mission-observe]',p).forEach(b=>b.onclick=()=>{$('#missionObs'+b.dataset.missionObserve,p).hidden=false});
      $$('[data-mission-done]',p).forEach(b=>b.onclick=()=>{const i=+b.dataset.missionDone;r.steps[i]=!r.steps[i];save();render(id)});
      $('#missionInspect',p).onclick=()=>{const on=window.PARTICLELAB_CORE?.setInspectMode?.(true);$('#missionInspectStatus',p).textContent=on?'Inspection labels are on. Click a numbered marker in the 3D scene.':'Use the Inspect 3D control beside the viewer.';$('#sceneCanvas')?.scrollIntoView({behavior:'smooth',block:'center'})};
      $$('[data-mission-answer]',p).forEach(b=>b.onclick=()=>{const a=+b.dataset.missionAnswer;r.check=a;r.secure=a===m.check[2];save();render(id);window.dispatchEvent(new CustomEvent('particlelab:hotspot',{detail:{sim:id,title:r.secure?'mission secure':'mission retry'}}))});
    } finally {rendering=false}
  }
  function progressSummary(){
    const core=Object.entries(missions).filter(([,m])=>!m.extension);let done=0,total=0;
    core.forEach(([id,m])=>{total++;if(rec(id).secure)done++});
    return {done,total};
  }
  document.addEventListener('click',e=>{const tab=e.target.closest?.('#simNav [data-sim]');if(tab)setTimeout(()=>render(tab.dataset.sim),100)});
  window.addEventListener('particlelab:hotspot',e=>{if(e.detail?.sim&&e.detail.sim!==current&&e.detail.sim!=='knowledge-check')return;const s=$('#missionInspectStatus');if(s&&e.detail?.title)s.textContent='Selected: '+e.detail.title+'. Read the live 3D explanation beside the model.'});
  window.addEventListener('particlelab:model-click',()=>{const s=$('#missionInspectStatus');if(s)s.textContent='You clicked the physics model. Turn on Inspect 3D for labelled learning points.'});
  function init(){render();setInterval(()=>{const id=getSim();if(id!==current)render(id)},900)}
  window.PARTICLELAB_SIM_MISSIONS={missions,state,render,progressSummary};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,900),{once:true});else setTimeout(init,900);
})();