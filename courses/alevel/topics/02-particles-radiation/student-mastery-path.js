(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleStudentMasteryV3';
  let state={}; try{state=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{}
  let activeChunk=0,lastLesson=0,rendering=false;
  const coverage={
    1:['Constituents of the atom and their charges/masses','Z, A, nuclide notation and isotopes'],
    2:['Specific charge of a charged particle','Specific charge of nuclei and ions'],
    3:['Strong nuclear force range and attractive/repulsive behaviour','Role of the strong force in nuclear stability'],
    4:['Unstable nuclei, alpha decay and beta-minus decay','Neutrino hypothesis from beta-decay energy evidence'],
    5:['Particle/antiparticle properties and rest energies','Photon model of electromagnetic radiation'],
    6:['Annihilation and pair production','Conservation of energy and momentum in matter–antimatter processes'],
    7:['Four fundamental interactions','Virtual-photon and W± exchange-particle diagrams'],
    8:['Hadrons, baryons, mesons and leptons','Pions, kaons, muons, strange particles and scientific collaboration'],
    9:['u, d, s quarks and antiquarks','Quark composition and Q, B, S of hadrons'],
    10:['Quark changes in beta processes','Conservation of charge, baryon number, lepton number, strangeness, energy and momentum'],
    11:['Photoelectric observations and photon explanation','Work function, threshold frequency, stopping potential and hf = φ + KEmax'],
    12:['Excitation, ionisation and electron collisions','Electron volt and fluorescent-tube energy transfer'],
    13:['Discrete atomic energy levels','Photon emission/absorption and line spectra'],
    14:['Electron diffraction and wave–particle duality','de Broglie λ = h/p and momentum–diffraction trend'],
    15:['Synoptic retrieval across all AQA 3.2 requirements','Mixed calculation, explanation and conservation practice']
  };
  const stretch={
    1:['Why can changing neutron number alter mass number but never create a different element?','Element identity is determined by proton number Z. Neutrons contribute to A but do not change Z, so the nucleus becomes a different isotope of the same element.'],
    2:['Explain why an electron has a much larger magnitude of specific charge than a proton even though |Q| is the same.','Specific charge is Q/m. Electron and proton have equal charge magnitude, but the electron mass is far smaller, so |Q/m| is far larger.'],
    3:['Why must the strong nuclear force become repulsive at extremely short distance as well as attractive at normal nuclear distance?','The model needs attraction to bind nucleons but a very-short-range repulsive region prevents nucleons collapsing into the same position; AQA expects the change of behaviour with separation.'],
    4:['A beta spectrum is continuous rather than one fixed electron energy. Why did this create a conservation problem historically?','If only the daughter nucleus and electron carried the energy, individual decays appeared to lose different amounts. An additional neutral particle carrying variable energy resolved the missing-energy problem.'],
    5:['Why is “same mass, opposite charge” not a complete definition of an antiparticle?','Some neutral particles have distinct antiparticles. Antiparticle identity involves opposite relevant additive quantum numbers, not charge alone.'],
    6:['Why can a single photon not create an electron–positron pair in empty space even if its energy exceeds 1.022 MeV?','Energy alone is not enough: momentum must also be conserved. A nearby nucleus or other body can recoil to take momentum.'],
    7:['How can you distinguish an electromagnetic interaction from a weak interaction from a simple exchange diagram?','Identify the exchange particle and particle identities at the vertices: virtual photon indicates EM; W± indicates the weak processes in this specification.'],
    8:['Why can a strange particle be produced by the strong interaction but then decay through the weak interaction?','Strong production conserves total strangeness, usually producing balancing strange content. Weak decay can change strangeness by the allowed amount, permitting decay.'],
    9:['Prove from quark quantum numbers that a charged pion is a meson rather than a baryon.','A pion contains one quark and one antiquark. Their baryon numbers +1/3 and −1/3 sum to 0, while the fractional charges combine to the pion charge.'],
    10:['Why is checking only electric charge insufficient to decide whether a particle reaction is allowed?','A reaction can conserve charge while violating baryon number, an individual lepton-family number, strangeness rules, energy or momentum. Every relevant conserved quantity must be checked.'],
    11:['Why does raising intensity below threshold frequency still fail to emit electrons?','Intensity adds more photons but does not change energy per photon at fixed frequency. If hf < φ, every photon is individually below the energy required for emission.'],
    12:['Why can an incident electron pass an atom without transferring a smaller arbitrary amount of energy?','Bound atomic energies are quantised. Excitation requires an allowed energy difference; below that threshold the atom cannot accept an arbitrary fraction as a bound-state transition.'],
    13:['Explain how a line spectrum is evidence for quantised atomic energy rather than just evidence that atoms emit light.','Each spectral line corresponds to a definite photon energy hf and therefore a definite level difference ΔE. Discrete lines imply only discrete energy differences are available.'],
    14:['Why does increasing accelerating voltage generally tighten an electron diffraction pattern?','Higher accelerating voltage gives the electron greater momentum; λ = h/p therefore decreases. For the same diffracting structure, shorter wavelength produces smaller diffraction angles.'],
    15:['Connect three different areas of the topic in one chain of reasoning.','Example: electron collisions excite atoms → atoms de-excite by emitting photons with ΔE = hf → discrete energy differences produce line spectra; the photon model also explains the photoelectric effect.']
  };
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));
  const lessonNo=()=>Number(($('#lessonPanel .lesson-count')?.textContent||'').match(/Lesson\s+(\d+)/i)?.[1]||1);
  const core=l=>l && (String(l.code).startsWith('3.2') || l.code==='3.2 mixed');
  function rec(n){const r=state[n]||(state[n]={chunks:[],exit:[],attempts:{},retrieval:{},tasks:[]});r.chunks=r.chunks||[];r.exit=r.exit||[];r.attempts=r.attempts||{};r.retrieval=r.retrieval||{};r.tasks=r.tasks||[];return r}
  function lesson(){const n=lessonNo();return window.PARTICLELAB_LESSON_SEQUENCE?.lessons?.find(x=>x.n===n)}
  function simOpen(l){
    if(l.sim){document.querySelector('[data-view="lab"]')?.click();setTimeout(()=>window.PARTICLELAB_CORE?.activateSim?.(l.sim),70)}
    else document.querySelector('[data-view="'+(l.view||'quiz')+'"]')?.click();
  }
  function patchSpec(){
    const l4=window.PARTICLELAB_LESSON_SEQUENCE?.lessons?.find(x=>x.n===4); if(!l4)return;
    l4.title='Alpha decay, beta-minus decay & the neutrino';
    l4.overview='AQA 3.2.1.2 core: unstable nuclei, alpha decay, beta-minus decay and why the neutrino was proposed.';
    l4.objectives=['Balance alpha and beta-minus nuclear equations.','State how A and Z change in α and β⁻ decay.','Explain why the neutrino was proposed in beta decay.'];
    l4.teach=[['1. Alpha decay','An alpha particle is ⁴₂He, so A decreases by 4 and Z decreases by 2.'],['2. Beta-minus decay','A neutron changes to proton character; an electron and electron antineutrino are emitted. A is unchanged and Z increases by 1.'],['3. Why the neutrino?','The neutrino was proposed to account for conservation of energy in beta decay.'],['4. Specification boundary','β⁺ is taught later with weak particle interactions, electron capture and electron–proton collisions.']];
    l4.simTask='Run α and β⁻. Predict the changes in A and Z before starting each animation, then explain the role of the emitted particles.';
    l4.equations=['α: ᴬZX → ᴬ⁻⁴Z⁻²Y + ⁴₂He','β⁻: n → p + e⁻ + ν̄ₑ'];
    l4.exit=['What happens to A and Z in alpha decay?','What happens to Z in β⁻ decay?','Why was the neutrino proposed?'];
    const l5=window.PARTICLELAB_LESSON_SEQUENCE?.lessons?.find(x=>x.n===5);
    if(l5)l5.exam='Know particle/antiparticle mass, charge and rest energy in MeV. E = mc² is useful context, but it is not the required calculation route in this AQA subsection.';
  }
  function ensureSummary(){
    const section=$('#view-course'); if(!section)return;
    let box=$('#studentMasterySummary'); if(!box){box=document.createElement('section');box.id='studentMasterySummary';box.className='student-mastery-summary panel';$('#lessonRouteSummary')?.insertAdjacentElement('afterend',box)}
    const lessons=(window.PARTICLELAB_LESSON_SEQUENCE?.lessons||[]).filter(core); let done=0,total=0;
    lessons.forEach(l=>{const r=rec(l.n),n=l.teach?.length||0;total+=n+3;done+=(r.chunks||[]).filter(Boolean).length+(r.exit||[]).filter(Boolean).length});
    const pc=total?Math.round(done/total*100):0;
    box.innerHTML='<div><span class="eyebrow">AQA 3.2 student mastery pathway</span><h3>'+done+' / '+total+' checks secure</h3><p>Every core lesson now runs as explain → do → retrieve → check. Nuclear/Rutherford extension content is not counted.</p></div><div class="student-mastery-meter"><strong>'+pc+'%</strong><div class="progress-track"><div class="progress-fill" style="width:'+pc+'%"></div></div></div>';
  }
  function chunkCheck(l,i){
    const r=rec(l.n),secured=!!r.chunks[i],key=l.teach[i][1],taskDone=!!r.tasks[i];
    const written=(r.retrieval?.[i]||''),ready=written.trim().length>=12&&taskDone;
    return '<div class="mastery-retrieve"><strong>Retrieve it</strong><p>Close the notes and explain this idea in your own words. Write enough to show your reasoning, then compare it with the key idea.</p><textarea data-retrieval="'+i+'" rows="2" placeholder="Write your explanation here...">'+written.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</textarea><div class="mastery-inline-actions"><button class="button" data-reveal-key="'+i+'">Reveal key idea</button><button class="button '+(secured?'success':'')+'" data-secure-chunk="'+i+'" '+(!secured&&!ready?'disabled':'')+'>'+(secured?'✓ Secure':'Mark secure')+'</button></div><div class="mastery-retrieval-status">'+(secured?'Retrieved and marked secure.':!taskDone?'Complete the application task above, then retrieve the explanation.':written.trim().length>=12?'Ready to compare and mark secure.':'Write a short explanation before this chunk can be secured.')+'</div><div class="mastery-key" id="masteryKey'+i+'" hidden><strong>Key idea:</strong> '+key+'</div></div>';
  }
  function render(){
    if(rendering)return; rendering=true;
    try{
      patchSpec(); const l=lesson(),hostPanel=$('#lessonPanel'); if(!l||!hostPanel)return;
      if(lastLesson!==l.n){activeChunk=0;lastLesson=l.n}
      let host=$('#studentMasteryPath',hostPanel); if(!host){host=document.createElement('section');host.id='studentMasteryPath';host.className='student-mastery-path';$('.lesson-hero',hostPanel)?.insertAdjacentElement('afterend',host)}
      if(!core(l)){host.innerHTML='<div class="mastery-core-note"><strong>Separate extension:</strong> this lesson is outside AQA 3.2 Particles and Radiation, so it is not part of the core mastery route.</div>';ensureSummary();return}
      const r=rec(l.n),chunks=l.teach||[];activeChunk=Math.max(0,Math.min(activeChunk,chunks.length-1));const secured=!!r.chunks[activeChunk];const support=window.PARTICLELAB_LESSON_SEQUENCE?.getChunkSupport?.(l.n,activeChunk)||{detail:chunks[activeChunk]?.[1]||'',taskTitle:'Apply it',task:'Explain the idea using correct physics terminology.',answer:chunks[activeChunk]?.[1]||'',exam:l.exam||''};
      host.innerHTML='<div class="mastery-path-head"><div><span class="eyebrow">Teach me from zero knowledge</span><h3>'+l.title+'</h3><p>Learn one idea at a time. Use the simulation only to make the physics visible, then retrieve the explanation without it.</p><div class="mastery-spec-links">'+(coverage[l.n]||[]).map(x=>'<span>'+x+'</span>').join('')+'</div></div><div class="mastery-path-score"><strong>'+r.chunks.filter(Boolean).length+' / '+chunks.length+'</strong><span>chunks secure</span></div></div>'+
        '<div class="mastery-chunk-tabs">'+chunks.map((c,i)=>'<button class="mastery-chunk-tab '+(i===activeChunk?'active ':'')+(r.chunks[i]?'secure ':'')+(i>0&&!r.chunks[i-1]&&!r.chunks[i]?'locked':'')+'" data-mastery-chunk="'+i+'" '+(i>0&&!r.chunks[i-1]&&!r.chunks[i]?'disabled':'')+'><span>'+(r.chunks[i]?'✓':i+1)+'</span>'+c[0].replace(/^\d+\.\s*/,'')+'</button>').join('')+'</div>'+
        '<article class="mastery-chunk-card '+(secured?'is-secure':'')+'"><div class="mastery-chunk-label">Chunk '+(activeChunk+1)+' of '+chunks.length+'</div><h3>'+chunks[activeChunk][0]+'</h3><div class="mastery-learn"><strong>Learn</strong><p>'+chunks[activeChunk][1]+'</p><div class="mastery-deeper"><strong>More detail</strong><p>'+support.detail+'</p></div>'+(l.equations?.length?'<div class="mastery-equations">'+l.equations.map(x=>'<code>'+x+'</code>').join('')+'</div>':'')+'</div><div class="mastery-do"><strong>Do with the model</strong><p>'+l.simTask+'</p><button class="button" id="masteryOpenSim">Open linked interactive model</button></div><div class="mastery-apply"><strong>Apply it · '+support.taskTitle+'</strong><p>'+support.task+'</p><label class="mastery-task-check"><input type="checkbox" data-chunk-task="'+activeChunk+'" '+(r.tasks[activeChunk]?'checked':'')+'> <span>I completed this task before checking the answer.</span></label><details><summary>Check the answer</summary><p>'+support.answer+'</p></details><div class="mastery-exam-link"><strong>Exam connection</strong><p>'+support.exam+'</p></div></div>'+chunkCheck(l,activeChunk)+'</article>'+
        '<div class="mastery-path-actions"><button class="button" id="masteryPrev" '+(activeChunk===0?'disabled':'')+'>← Previous chunk</button><button class="button primary" id="masteryNext" '+(!secured||activeChunk===chunks.length-1?'disabled':'')+'>Next chunk →</button></div>'+
        '<div class="mastery-gate"><span class="eyebrow">End-of-lesson mastery gate</span><h3>Answer without notes</h3><p class="mastery-gate-instruction">Only tick a question when you can answer it aloud or on paper without the simulation or lesson notes.</p><div class="mastery-exit-grid">'+l.exit.map((q,i)=>'<label class="mastery-exit '+(r.exit[i]?'secure':'')+'"><input type="checkbox" data-exit="'+i+'" '+(r.exit[i]?'checked':'')+'><span>'+q+'</span></label>').join('')+'</div><p><strong>Exam language:</strong> '+l.exam+'</p><p><strong>Worked example:</strong> '+l.worked+'</p><div id="masteryUnlockStatus" class="mastery-unlock-status"></div></div>'+
        (stretch[l.n]?'<details class="mastery-stretch"><summary><span class="eyebrow">Higher-demand reasoning</span><strong>A* stretch challenge</strong></summary><p>'+stretch[l.n][0]+'</p><details class="mastery-stretch-answer"><summary>Compare with a strong reasoning chain</summary><p>'+stretch[l.n][1]+'</p></details></details>':'');
      $$('[data-mastery-chunk]',host).forEach(b=>b.onclick=()=>{activeChunk=+b.dataset.masteryChunk;render()});
      $('#masteryOpenSim',host)?.addEventListener('click',()=>simOpen(l));
      $('#masteryPrev',host)?.addEventListener('click',()=>{activeChunk--;render()});
      $('#masteryNext',host)?.addEventListener('click',()=>{if(r.chunks[activeChunk]){activeChunk++;render()}});
      $$('[data-reveal-key]',host).forEach(b=>b.onclick=()=>{$('#masteryKey'+b.dataset.revealKey,host).hidden=false});
      $$('[data-chunk-task]',host).forEach(x=>x.onchange=()=>{const i=+x.dataset.chunkTask;r.tasks[i]=x.checked;save();render()});
      $$('[data-retrieval]',host).forEach(t=>t.oninput=()=>{const i=+t.dataset.retrieval;r.retrieval[i]=t.value;save();const b=host.querySelector('[data-secure-chunk="'+i+'"]');if(b&&!r.chunks[i])b.disabled=t.value.trim().length<12||!r.tasks[i];const status=t.closest('.mastery-retrieve')?.querySelector('.mastery-retrieval-status');if(status&&!r.chunks[i])status.textContent=!r.tasks[i]?'Complete the application task above, then retrieve the explanation.':t.value.trim().length>=12?'Ready to compare and mark secure.':'Write a short explanation before this chunk can be secured.'});
      $$('[data-secure-chunk]',host).forEach(b=>b.onclick=()=>{const i=+b.dataset.secureChunk;if(!r.chunks[i]&&((r.retrieval?.[i]||'').trim().length<12||!r.tasks[i]))return;r.chunks[i]=!r.chunks[i];save();window.dispatchEvent(new CustomEvent('particlelab:hotspot',{detail:{sim:l.sim||'course',title:r.chunks[i]?'mastery secure':'review'}}));render()});
      $$('[data-exit]',host).forEach(x=>x.onchange=()=>{r.exit[+x.dataset.exit]=x.checked;save();render();ensureSummary()});
      const mastered=chunks.every((_,i)=>!!r.chunks[i])&&l.exit.every((_,i)=>!!r.exit[i]);
      const next=$('#sequenceNext',hostPanel);
      if(next&&l.n<15){next.disabled=!mastered;next.title=mastered?'Ready for the next lesson':'Complete every learning chunk and the mastery gate first';}
      const unlock=$('#masteryUnlockStatus',host);
      if(unlock)unlock.innerHTML=mastered?'<strong>✓ Lesson secure.</strong> The next lesson is unlocked.':'<strong>Next lesson locked.</strong> Secure every chunk and all three exit questions first.';
      ensureSummary();
    } finally {rendering=false}
  }
  function init(){
    patchSpec();render();
    const panel=$('#lessonPanel');if(panel)new MutationObserver(()=>requestAnimationFrame(render)).observe(panel,{childList:true,subtree:false});
    setInterval(()=>{if($('#view-course')){patchSpec();ensureSummary();if(!$('#studentMasteryPath'))render()}},1800);
  }
  window.PARTICLELAB_STUDENT_MASTERY={render,state};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,650),{once:true});else setTimeout(init,650);
})();