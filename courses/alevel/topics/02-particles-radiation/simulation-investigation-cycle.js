(() => {
  'use strict';

  const STORE='particleSimulationInvestigationV1';

  const prompts={
    atom:{
      predict:'Predict what will happen to Z, A and charge if you add one neutron, then one electron.',
      test:'Build two isotopes of the same element and then make a positive or negative ion. Record which particle changed each quantity.',
      explain:'Explain why changing neutron number can change the isotope without changing the element.'
    },
    specific:{
      predict:'Predict the sign and relative size of Q/m for a neutral atom, a positive ion and an electron.',
      test:'Change the proton/electron balance and compare how total charge and total mass affect the result.',
      explain:'Explain why the electron has a much larger magnitude of specific charge than a proton.'
    },
    strong:{
      predict:'Predict whether the force is repulsive, attractive or negligible at 0.3 fm, 1.0 fm and 4 fm.',
      test:'Move through the separation range and identify the boundaries between the three regions.',
      explain:'Explain how the strong nuclear force can stabilise a nucleus despite electrostatic repulsion.'
    },
    decay:{
      predict:'Before running the animation, predict the changes in A and Z and identify the emitted particles.',
      test:'Run the available decay processes and compare the daughter nucleus with the parent.',
      explain:'Use conservation ideas to explain why the emitted neutrino or antineutrino matters.'
    },
    antimatter:{
      predict:'Predict the minimum rest-energy requirement for creating an electron–positron pair.',
      test:'Compare annihilation and pair production. Track where energy and momentum go in each process.',
      explain:'Explain why pair production needs both enough energy and a way to conserve momentum.'
    },
    interactions:{
      predict:'Predict the exchange particle before revealing each electromagnetic or weak interaction.',
      test:'Follow one interaction from incoming particles through the exchange particle to the products.',
      explain:'Explain what the exchange-particle model is representing and name the AQA particles used here.'
    },
    classification:{
      predict:'Predict the complete family for each particle: hadron or lepton, then baryon or meson if needed.',
      test:'Classify several particles and compare the rules used for baryons, mesons and leptons.',
      explain:'Explain the difference between a hadron and a lepton, then between a baryon and a meson.'
    },
    quarks:{
      predict:'Predict Q, baryon number and strangeness before revealing the totals for a hadron.',
      test:'Build a proton, neutron, pion and kaon and add the constituent quantum numbers.',
      explain:'Explain how fractional quark properties combine to give the observed hadron properties.'
    },
    photo:{
      predict:'Predict separately what happens when frequency increases and when intensity increases.',
      test:'Find a threshold frequency, then hold frequency fixed while changing intensity.',
      explain:'Use the one-photon–one-electron model and hf = φ + KEmax to explain the observations.'
    },
    collisions:{
      predict:'Predict whether the atom will stay unchanged, become excited or become ionised for the chosen incident energy.',
      test:'Change the electron energy and identify the discrete energy transfers that are possible.',
      explain:'Explain why excitation energies are discrete rather than continuous.'
    },
    levels:{
      predict:'Predict how photon frequency changes when the energy-level gap becomes larger.',
      test:'Choose different transitions and compare ΔE, photon frequency and wavelength.',
      explain:'Explain how discrete energy levels produce a line spectrum.'
    },
    diffraction:{
      predict:'Predict how increasing electron momentum will change de Broglie wavelength and the diffraction pattern.',
      test:'Vary the electron conditions and compare the ring spacing or diffraction scale.',
      explain:'Use λ = h/p to explain why the pattern is evidence for wave behaviour of electrons.'
    },
    rutherford:{
      predict:'Predict which alpha particles will experience the largest deflections.',
      test:'Compare several impact parameters and relate close approach to scattering angle.',
      explain:'Use the scattering observations to explain why the nuclear model replaced the diffuse-positive-charge model.'
    }
  };

  function read(){
    try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{};}catch{return {};}
  }

  function write(state){
    try{localStorage.setItem(STORE,JSON.stringify(state));}catch{}
  }

  function activeSim(){
    return document.querySelector('#simNav .sim-tab.active[data-sim]')?.dataset.sim||
      document.querySelector('#simNav [data-sim].active')?.dataset.sim||
      'atom';
  }

  function titleFor(id){
    return document.querySelector('#simTitle')?.textContent?.trim()||id;
  }

  function ensurePanel(){
    const side=document.querySelector('#view-lab .lab-side');
    if(!side)return null;
    let panel=document.querySelector('#simulationInvestigationCycle');
    if(panel)return panel;

    panel=document.createElement('section');
    panel.id='simulationInvestigationCycle';
    panel.className='panel simulation-investigation-cycle';
    const heading=side.querySelector('.sim-heading');
    if(heading)heading.insertAdjacentElement('afterend',panel);
    else side.prepend(panel);

    panel.addEventListener('input',event=>{
      const field=event.target.closest('[data-investigation-field]');
      if(!field)return;
      const state=read();
      const id=panel.dataset.sim||activeSim();
      state[id]=state[id]||{};
      state[id][field.dataset.investigationField]=field.value;
      write(state);
      updateStatus(panel,id);
    });

    panel.addEventListener('click',event=>{
      const reset=event.target.closest('[data-investigation-reset]');
      if(reset){
        const state=read();
        const id=panel.dataset.sim||activeSim();
        delete state[id];
        write(state);
        render(id);
      }
      const complete=event.target.closest('[data-investigation-complete]');
      if(complete){
        const state=read();
        const id=panel.dataset.sim||activeSim();
        state[id]=state[id]||{};
        state[id].complete=!state[id].complete;
        write(state);
        updateStatus(panel,id);
      }
    });

    return panel;
  }

  function updateStatus(panel,id){
    const state=read();
    const s=state[id]||{};
    const values=['prediction','observation','explanation'].map(k=>(s[k]||'').trim());
    const filled=values.filter(v=>v.length>=8).length;
    const fill=panel.querySelector('[data-investigation-fill]');
    const text=panel.querySelector('[data-investigation-status]');
    const button=panel.querySelector('[data-investigation-complete]');
    if(fill)fill.style.width=(filled/3*100)+'%';
    if(text)text.textContent=filled+' / 3 investigation notes complete';
    if(button){
      button.disabled=filled<3;
      button.classList.toggle('success',!!s.complete);
      button.textContent=s.complete?'✓ Investigation complete':'Mark investigation complete';
    }
    panel.classList.toggle('investigation-complete',!!s.complete);
  }

  function render(id){
    const panel=ensurePanel();
    if(!panel)return;
    const p=prompts[id]||{
      predict:'Predict what should happen before changing the model.',
      test:'Change one variable at a time and record what the simulation shows.',
      explain:'Explain the result using the relevant equation or AQA physics principle.'
    };
    const s=read()[id]||{};
    panel.dataset.sim=id;
    panel.innerHTML=
      '<div class="investigation-head">'+
        '<div><span class="eyebrow">Simulation investigation</span><h3>Predict → test → explain</h3><p class="subtle small">Use the 3D model as evidence, not as a picture to watch.</p></div>'+
        '<span class="investigation-badge">'+titleFor(id)+'</span>'+
      '</div>'+
      '<div class="investigation-progress"><span data-investigation-status></span><div class="investigation-track"><div class="investigation-fill" data-investigation-fill></div></div></div>'+
      '<details class="investigation-step" open><summary><strong>1 · Predict</strong><span>Before touching the controls</span></summary><p>'+p.predict+'</p><textarea rows="2" data-investigation-field="prediction" placeholder="Write your prediction and reason...">'+(s.prediction||'')+'</textarea></details>'+
      '<details class="investigation-step"><summary><strong>2 · Test and observe</strong><span>Change one variable at a time</span></summary><p>'+p.test+'</p><textarea rows="2" data-investigation-field="observation" placeholder="Record what changed and what stayed the same...">'+(s.observation||'')+'</textarea></details>'+
      '<details class="investigation-step"><summary><strong>3 · Explain</strong><span>Turn the observation into physics</span></summary><p>'+p.explain+'</p><textarea rows="2" data-investigation-field="explanation" placeholder="Explain using precise AQA language...">'+(s.explanation||'')+'</textarea></details>'+
      '<div class="investigation-actions"><button type="button" class="button primary" data-investigation-complete>Mark investigation complete</button><button type="button" class="text-button" data-investigation-reset>Clear notes</button></div>';
    updateStatus(panel,id);
  }

  function sync(){
    const id=activeSim();
    const panel=document.querySelector('#simulationInvestigationCycle');
    if(!panel||panel.dataset.sim!==id)render(id);
  }

  function init(){
    render(activeSim());
    const nav=document.querySelector('#simNav');
    if(nav)new MutationObserver(()=>requestAnimationFrame(sync)).observe(nav,{subtree:true,attributes:true,attributeFilter:['class']});
    document.addEventListener('click',event=>{
      const button=event.target.closest('#simNav [data-sim]');
      if(button)setTimeout(()=>render(button.dataset.sim),0);
    });
    setTimeout(sync,600);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();