
(() => {
  'use strict';

  const $ = (s, r=document) => r.querySelector(s);

  const hud = {
    atom: ['Changing neutrons changes the isotope, not the element.', 'Z = proton number; A = total nucleons.'],
    specific: ['Watch how net charge and total mass alter Q/m.', 'Specific charge = Q/m, in C kg⁻¹.'],
    strong: ['Move the nucleons and watch the force change with separation.', 'Attractive over normal nuclear range, repulsive when extremely close.'],
    decay: ['Follow what leaves the nucleus and how Z and A change.', 'Beta decay is a weak interaction and includes a neutrino or antineutrino.'],
    antimatter: ['Watch energy move between particles and photons.', 'Energy and momentum must both be conserved.'],
    interactions: ['Track incoming particle → exchange → outgoing particle.', 'Virtual γ models EM; W⁺/W⁻ model the weak processes here.'],
    classification: ['Sort by family first, then sub-family.', 'Hadrons feel the strong interaction; leptons do not.'],
    quarks: ['Add fractional quantum numbers to build the hadron.', 'Proton = uud; neutron = udd.'],
    photo: ['Change frequency and intensity separately.', 'hf = φ + KEmax; intensity does not change photon energy.'],
    collisions: ['Watch for no transition, excitation, then ionisation.', 'Atomic excitation takes discrete amounts of energy.'],
    levels: ['Watch the energy gap and the photon produced.', 'ΔE = hf = hc/λ.'],
    diffraction: ['Increase momentum and watch the diffraction pattern tighten.', 'λ = h/p, so larger p means shorter wavelength.'],
    rutherford: ['Change impact parameter and watch the deflection.', 'Large deflections reveal a tiny concentrated positive nucleus.']
  };

  const simCue = {
    atom:'soft', specific:'tick', strong:'low', decay:'decay',
    antimatter:'pair', interactions:'exchange', classification:'soft',
    quarks:'snap', photo:'photon', collisions:'impact', levels:'level',
    diffraction:'shimmer', rutherford:'scatter'
  };

  let audioCtx = null;
  let master = null;
  let enabled = localStorage.getItem('particleLabSound') !== 'off';
  let lastSliderSound = 0;

  function selectedSim(){
    return document.querySelector('#simNav .sim-tab.active')?.dataset.sim || 'atom';
  }

  function ensureAudio(){
    if(!enabled) return false;
    if(!audioCtx){
      const AC = window.AudioContext || window.webkitAudioContext;
      if(!AC) return false;
      audioCtx = new AC();
      master = audioCtx.createGain();
      master.gain.value = 0.16;
      master.connect(audioCtx.destination);
    }
    if(audioCtx.state === 'suspended') audioCtx.resume().catch(()=>{});
    return true;
  }

  function tone(freq=440, duration=.08, type='sine', gain=.16, delay=0){
    if(!ensureAudio()) return;
    const t = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001,gain), t+.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t+duration);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t+duration+.02);
  }

  function sweep(from, to, duration=.16, type='sine', gain=.13, delay=0){
    if(!ensureAudio()) return;
    const t = audioCtx.currentTime + delay;
    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20,to), t+duration);
    g.gain.setValueAtTime(0.0001,t);
    g.gain.exponentialRampToValueAtTime(gain,t+.01);
    g.gain.exponentialRampToValueAtTime(0.0001,t+duration);
    osc.connect(g);
    g.connect(master);
    osc.start(t);
    osc.stop(t+duration+.02);
  }

  function noise(duration=.05, gain=.035){
    if(!ensureAudio()) return;
    const length = Math.max(1, Math.floor(audioCtx.sampleRate*duration));
    const buffer = audioCtx.createBuffer(1,length,audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for(let i=0;i<length;i++) data[i]=(Math.random()*2-1)*(1-i/length);
    const src=audioCtx.createBufferSource();
    const g=audioCtx.createGain();
    g.gain.value=gain;
    src.buffer=buffer;
    src.connect(g);
    g.connect(master);
    src.start();
  }

  function cue(name){
    if(!enabled) return;
    switch(name){
      case 'soft': tone(360,.06,'sine',.09); break;
      case 'tick': tone(520,.035,'triangle',.07); break;
      case 'low': tone(120,.11,'sine',.11); tone(180,.08,'sine',.06,.035); break;
      case 'decay': sweep(420,170,.17,'sawtooth',.07); tone(720,.05,'sine',.07,.10); break;
      case 'pair': sweep(250,650,.13,'sine',.08); sweep(650,250,.13,'sine',.08,.025); break;
      case 'exchange': tone(300,.05,'triangle',.06); tone(470,.05,'triangle',.06,.055); break;
      case 'snap': tone(430,.045,'square',.045); tone(650,.045,'square',.04,.04); break;
      case 'photon': tone(980,.08,'sine',.07); tone(1320,.05,'sine',.04,.045); break;
      case 'impact': noise(.04,.035); tone(190,.055,'triangle',.065); break;
      case 'level': tone(760,.07,'sine',.07); tone(520,.11,'sine',.07,.07); break;
      case 'shimmer': [620,820,1040].forEach((f,i)=>tone(f,.07,'sine',.035,i*.035)); break;
      case 'scatter': noise(.035,.03); sweep(260,720,.11,'triangle',.07,.01); break;
      case 'correct': tone(620,.07,'sine',.07); tone(880,.11,'sine',.07,.07); break;
      case 'wrong': tone(220,.08,'triangle',.07); tone(170,.10,'triangle',.06,.07); break;
      case 'step': tone(500,.045,'sine',.04); break;
      default: tone(440,.05,'sine',.045);
    }
  }

  function addHud(){
    const wrap=$('.viewer-wrap');
    if(!wrap || $('#simVisualHud')) return;

    const box=document.createElement('div');
    box.id='simVisualHud';
    box.className='sim-visual-hud';
    box.innerHTML =
      '<div class="sim-hud-card"><span>Look for</span><strong id="simHudWatch"></strong></div>' +
      '<div class="sim-hud-card"><span>Key science</span><strong id="simHudScience"></strong></div>';
    wrap.appendChild(box);

    const note=document.createElement('div');
    note.className='sim-sound-note';
    note.textContent='Sound effects are teaching cues, not literal particle sounds.';
    wrap.appendChild(note);
    updateHud();
  }

  function updateHud(){
    const d=hud[selectedSim()] || hud.atom;
    const watch=$('#simHudWatch');
    const science=$('#simHudScience');
    if(watch) watch.textContent=d[0];
    if(science) science.textContent=d[1];
  }

  function addButtons(){
    const buttons=$('.viewer-buttons');
    if(!buttons) return;

    if(!$('#simSoundToggle')){
      const b=document.createElement('button');
      b.id='simSoundToggle';
      b.className='button';
      buttons.appendChild(b);
      b.addEventListener('click',e=>{
        e.stopPropagation();
        enabled=!enabled;
        localStorage.setItem('particleLabSound',enabled?'on':'off');
        renderSoundButton();
        if(enabled){
          ensureAudio();
          cue('correct');
        }
      });
    }


    if(!$('#simSoundTest')){
      const t=document.createElement('button');
      t.id='simSoundTest';
      t.className='button';
      t.textContent='♪ Test sound';
      buttons.appendChild(t);
      t.addEventListener('click',e=>{
        e.stopPropagation();
        if(!enabled){
          enabled=true;
          localStorage.setItem('particleLabSound','on');
          renderSoundButton();
        }
        ensureAudio();
        cue(simCue[selectedSim()] || 'correct');
      });
    }

    if(!$('#simMoreToggle')){
      const b=document.createElement('button');
      b.id='simMoreToggle';
      b.className='button';
      b.textContent='More detail';
      buttons.appendChild(b);
      b.addEventListener('click',e=>{
        e.stopPropagation();
        const lab=$('#view-lab');
        const open=lab ? lab.classList.toggle('show-sim-extras') : false;
        b.classList.toggle('active',!!open);
        b.textContent=open?'Hide extra detail':'More detail';
        cue('soft');
      });
    }
    renderSoundButton();
  }

  function renderSoundButton(){
    const b=$('#simSoundToggle');
    if(!b) return;
    b.textContent=enabled?'🔊 Simulation sound: ON':'🔇 Simulation sound: OFF';
    b.classList.toggle('sound-on',enabled);
    b.classList.toggle('sound-off',!enabled);
    b.setAttribute('aria-pressed',enabled?'true':'false');
  }

  function controlPitch(el){
    if(el.type!=='range') return 500;
    const min=Number(el.min||0);
    const max=Number(el.max||100);
    const v=Number(el.value||0);
    const n=max>min?(v-min)/(max-min):.5;
    return 260+n*560;
  }

  function hotspotCue(title=''){
    const t=String(title).toLowerCase();
    if(t.includes('photon')) return 'photon';
    if(t.includes('quark')||t.includes('hadron')) return 'snap';
    if(t.includes('nucleus')||t.includes('nucleon')||t.includes('force')) return 'low';
    if(t.includes('detector')||t.includes('scatter')||t.includes('trajectory')) return 'scatter';
    if(t.includes('electron')||t.includes('positron')||t.includes('neutrino')) return 'tick';
    return 'soft';
  }

  window.addEventListener('particlelab:hotspot',e=>cue(hotspotCue(e.detail?.title)));

  document.addEventListener('click',e=>{
    if(e.target.closest?.('#simSoundToggle,#simMoreToggle')) return;

    const tab=e.target.closest?.('#simNav .sim-tab');
    if(tab){
      ensureAudio();
      setTimeout(()=>{
        updateHud();
        cue(simCue[tab.dataset.sim] || 'soft');
      },20);
      return;
    }

    if(e.target.closest?.('#stepNext,#stepPrev,.step-dot')){
      cue('step');
      return;
    }

    const quick=e.target.closest?.('.quick-option');
    if(quick){
      setTimeout(()=>{
        if(quick.classList.contains('correct')) cue('correct');
        else if(quick.classList.contains('wrong')) cue('wrong');
      },0);
      return;
    }

    if(e.target.closest?.('#ruthFireOne,#ruthFireBeam')){
      cue('scatter');
      return;
    }

    if(e.target.closest?.('#simControls button')){
      cue(simCue[selectedSim()] || 'soft');
      return;
    }

    if(e.target.closest?.('#rotateLeft,#rotateRight,#resetView,#pauseMotion')){
      cue('soft');
      return;
    }

    if(e.target.closest?.('[data-ruth-mode],#ruthReset,#ruthResetCamera,#ruthPause')){
      cue('scatter');
      return;
    }

    if(e.target.closest?.('.sim-guide-button')){
      cue(hotspotCue(e.target.closest('.sim-guide-button')?.textContent || ''));
      return;
    }
  },false);

  document.addEventListener('input',e=>{
    const el=e.target;
    if(!el.closest?.('#simControls,#ruthCloseControls')) return;
    const now=performance.now();
    if(now-lastSliderSound<110) return;
    lastSliderSound=now;
    if(!enabled) return;
    tone(controlPitch(el),.03,'sine',.025);
  },false);

  document.addEventListener('change',e=>{
    if(e.target.closest?.('#simControls select')){
      cue(simCue[selectedSim()] || 'tick');
      return;
    }
    if(e.target.closest?.('#ruthCloseControls input,[data-ruth-mode]')){
      cue('scatter');
    }
  },false);

  window.PARTICLELAB_SOUND={
    isEnabled:()=>enabled,
    test:()=>{ensureAudio();cue(simCue[selectedSim()] || 'soft');},
    cue
  };

  function init(){
    addHud();
    addButtons();
    updateHud();
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
