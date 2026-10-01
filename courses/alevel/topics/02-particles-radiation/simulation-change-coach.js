
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);

  const currentSim=()=>window.PARTICLELAB_CORE?.getCurrentSim?.()||$('#simNav .sim-tab.active')?.dataset.sim||'atom';

  const coaches={
    atom:()=> {
      const a=window.PARTICLELAB_ATOM_STATE||{};
      const Z=Number.isFinite(a.Z)?a.Z:+($('#atomZ')?.value||6);
      const N=Number.isFinite(a.neutrons)?a.neutrons:+($('#atomN')?.value||6);
      const A=Number.isFinite(a.A)?a.A:Z+N;
      const ne=Number.isFinite(a.electrons)?a.electrons:+($('#atomE')?.value||Z);
      return {
        observe:(a.nuclide||('A='+A+', Z='+Z))+' has '+Z+' protons, '+N+' neutrons and '+ne+' electrons.',
        why:'The element is fixed by proton number Z. An isotope is made by keeping Z fixed and changing the neutron number N, so A = Z + N changes.',
        exam:'For isotope questions: identify Z first, calculate N = A − Z, then decide electron number from the charge.',
        next:'Keep Z fixed and press + neutron. Check that the element stays the same while A increases by 1.'
      };
    },
    specific:()=> {
      const Z=+($('#scZ')?.value||6),A=Math.max(+($('#scA')?.value||12),Z),ne=+($('#scE')?.value||Z),q=Z-ne;
      return {
        observe:'Net charge is '+(q===0?'0':(q>0?'+':'')+q+'e')+'.',
        why:'Removing electrons makes the ion positive; adding electrons makes it negative. The mass is still dominated by nucleons.',
        exam:'Specific charge is Q/m in C kg⁻¹. Use the total charge and total mass of the particle you are given.',
        next:'Reduce the electron number by one and predict the sign of Q/m before checking.'
      };
    },
    strong:()=> {
      const d=+($('#sep')?.value||120)/100;
      const state=d<.5?'strongly repulsive':d<=3?'attractive':'very small / negligible';
      return {
        observe:'At '+d.toFixed(2)+' fm the strong nuclear force is '+state+'.',
        why:d<.5?'At very small separation the repulsive part prevents nucleons collapsing together.':d<=3?'At nuclear separations the attractive part helps bind nucleons together.':'The strong force is short range, so it rapidly becomes negligible.',
        exam:'Describe the force as a function of separation: repulsive very close, attractive over nuclear distances, negligible beyond a few fm.',
        next:'Move through all three regions and identify where the behaviour changes.'
      };
    },
    decay:()=> {
      const m=$('#decayMode')?.value||'bm';
      if(m==='alpha')return {observe:'An alpha particle is emitted.',why:'The parent loses two protons and two neutrons.',exam:'A decreases by 4 and Z decreases by 2.',next:'Check the daughter nuclide by balancing A and Z.'};
      if(m==='bp')return {observe:'A positron and electron neutrino are emitted.',why:'A proton changes to neutron character through the weak interaction.',exam:'A is unchanged and Z decreases by 1. Check charge and lepton number.',next:'Compare β⁺ with β⁻ and identify which way Z changes.'};
      return {observe:'An electron and electron antineutrino are emitted.',why:'A neutron changes to proton character through the weak interaction.',exam:'A is unchanged and Z increases by 1. Check charge and lepton number.',next:'Write the neutron-level equation n → p + e⁻ + ν̄ₑ.'};
    },
    antimatter:()=> {
      const m=$('#antiMode')?.value||'ann';
      return m==='ann'
        ? {observe:'Matter and antimatter disappear and photons are produced.',why:'Rest energy and any kinetic energy are converted while energy and momentum remain conserved.',exam:'For a slow e⁻/e⁺ pair, the minimum combined rest energy is 1.022 MeV.',next:'Explain why two photons are commonly shown for a slow pair.'}
        : {observe:'A photon creates an electron–positron pair.',why:'The photon must provide at least the combined rest energy, and a nearby body helps conserve momentum.',exam:'Threshold rest energy for e⁻/e⁺ creation = 1.022 MeV.',next:'Increase photon energy and decide where any energy above threshold goes.'};
    },
    interactions:()=> {
      const m=$('#intMode')?.value||'em';
      const map={
        em:['Electromagnetic exchange is selected.','The interaction is represented by a virtual photon.','Identify incoming/outgoing particles and the virtual photon.'],
        bm:['A weak β⁻ process is selected.','A W⁻ carries the weak interaction at the vertex.','Check charge, baryon number and lepton number at the vertex.'],
        bp:['A weak β⁺ process is selected.','A W⁺ carries the weak interaction at the vertex.','Check charge, baryon number and lepton number at the vertex.'],
        capture:['Electron capture is selected.','A weak interaction changes proton character to neutron character.','Track the electron neutrino and conservation laws.'],
        ep:['Electron–proton weak interaction is selected.','Weak exchange changes particle identities.','Use the exchange particle and conserved quantities to justify the products.']
      };
      const x=map[m]||map.em;return {observe:x[0],why:x[1],exam:x[2],next:'Name the exchange particle before looking at the answer.'};
    },
    classification:()=> {
      const f=$('#fam')?.value||'all';
      return {
        observe:'The highlighted family is '+f+'.',
        why:'Classification tells you which interactions and quantum numbers are relevant.',
        exam:'Use full labels: proton = hadron + baryon; pion = hadron + meson; electron = lepton.',
        next:'Pick one baryon, one meson and one lepton and state how they differ.'
      };
    },
    quarks:()=> {
      const txt=$('#had')?.selectedOptions?.[0]?.textContent||'proton p = uud';
      return {
        observe:'Selected hadron: '+txt+'.',
        why:'The hadron properties come from adding the quark charge, baryon number and strangeness.',
        exam:'Write each constituent value, then add Q, B and S column by column.',
        next:'Predict the total charge before changing to a different hadron.'
      };
    },
    photo:()=> {
      const f=+($('#pf')?.value||8)*1e14,phi=+($('#pphi')?.value||2.3),eph=6.62607015e-34*f/1.602176634e-19,ke=eph-phi;
      return ke>=0
        ? {observe:'Photoelectrons are emitted. KEmax ≈ '+ke.toFixed(2)+' eV.',why:'Each photon has enough energy hf to overcome the work function φ. The excess becomes electron kinetic energy.',exam:'Use hf = φ + KEmax and KEmax = eVs.',next:'Keep frequency fixed and change intensity. Decide what should and should not change.'}
        : {observe:'No photoelectrons are emitted.',why:'Photon energy hf is below the work function φ. More low-energy photons cannot compensate for this.',exam:'Below threshold frequency there is no emission, regardless of intensity.',next:'Increase frequency until you just reach the threshold.'};
    },
    collisions:()=> {
      const E=+($('#ce')?.value||11),vals=($('#ct')?.value||'10.2,13.6').split(',').map(Number);
      if(E>=vals[1])return {observe:'Ionisation is possible.',why:'The incident electron can transfer enough energy to remove an atomic electron completely.',exam:'Ionisation removes an electron from the atom.',next:'Reduce the energy until only excitation is possible.'};
      if(E>=vals[0])return {observe:'Excitation is possible.',why:'The incident electron can transfer an allowed energy difference while the atomic electron remains bound.',exam:'Excitation moves an electron to a higher allowed level; it does not remove it.',next:'Compare the excitation threshold with the ionisation threshold.'};
      return {observe:'No model excitation occurs.',why:'The incident electron energy is below the first allowed excitation energy.',exam:'Atomic energy transfer is quantised for excitation.',next:'Raise the energy slowly and identify the first threshold.'};
    },
    levels:()=> {
      const tr=$('#tr')?.selectedOptions?.[0]?.textContent||'n=3 → n=2';
      return {observe:'Transition selected: '+tr+'.',why:'The electron loses a discrete amount of energy and one photon carries that exact ΔE.',exam:'Use ΔE = hf = hc/λ.',next:'Choose a larger energy drop and predict whether the emitted wavelength increases or decreases.'};
    },
    diffraction:()=> {
      const V=+($('#dv')?.value||200),p=Math.sqrt(2*9.1093837015e-31*1.602176634e-19*V),lam=6.62607015e-34/p;
      return {observe:'At '+V+' V, λ ≈ '+(lam*1e10).toFixed(3)+' Å.',why:'Increasing voltage increases electron momentum, so λ = h/p decreases.',exam:'Higher p → shorter de Broglie wavelength → reduced diffraction / tighter pattern.',next:'Double the voltage and predict the direction of the wavelength change before checking.'};
    },
    rutherford:()=> {
      const b=+($('#rb')?.value||70)/100,Z=+($('#rz')?.value||79);
      return {observe:'Current model: b = '+b.toFixed(2)+' scaled units, Z = '+Z+'.',why:'A smaller impact parameter gives a closer approach, so electrostatic repulsion is stronger and the scattering angle increases.',exam:'Link observation to inference: rare large-angle scattering requires concentrated positive charge in a tiny nucleus.',next:'Decrease b and describe what happens to the path before looking at the result.'};
    }
  };

  function ensure(){
    if($('#simChangeCoach'))return;
    const side=$('.lab-side');if(!side)return;
    const el=document.createElement('section');
    el.id='simChangeCoach';el.className='sim-change-coach';
    el.innerHTML='<div class="sim-change-coach-head"><div><span class="eyebrow">Live explanation</span><h3>What changed and why?</h3></div><span>Observe → explain → exam</span></div>'+
      '<div class="sim-change-grid"><div class="sim-change-card"><b>What you should see</b><p id="changeObserve"></p></div><div class="sim-change-card"><b>Why it happens</b><p id="changeWhy"></p></div><div class="sim-change-card"><b>Exam connection</b><p id="changeExam"></p></div></div>'+
      '<div class="sim-next-step"><strong>Try next:</strong><span id="changeNext"></span></div>';
    const essentials=$('#simEssentials');
    if(essentials)essentials.insertAdjacentElement('afterend',el);else side.appendChild(el);
  }

  function update(){
    ensure();
    const fn=coaches[currentSim()]||coaches.atom;
    let d;try{d=fn()}catch{d={observe:'Change one control and watch the model.',why:'Use the visible model and equation together.',exam:'Explain the change using the relevant AQA relationship.',next:'Change one variable at a time.'};}
    if($('#changeObserve'))$('#changeObserve').textContent=d.observe;
    if($('#changeWhy'))$('#changeWhy').textContent=d.why;
    if($('#changeExam'))$('#changeExam').textContent=d.exam;
    if($('#changeNext'))$('#changeNext').textContent=d.next;
  }

  function init(){
    ensure();update();
    $('#simNav')?.addEventListener('click',e=>{if(e.target.closest?.('.sim-tab'))setTimeout(update,80)});
    document.addEventListener('input',e=>{if(e.target.closest?.('#simControls'))setTimeout(update,20)});
    document.addEventListener('change',e=>{if(e.target.closest?.('#simControls'))setTimeout(update,20)});
    document.addEventListener('click',e=>{if(e.target.closest?.('#simControls button'))setTimeout(update,60)});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,260),{once:true});
  else setTimeout(init,260);
})();
