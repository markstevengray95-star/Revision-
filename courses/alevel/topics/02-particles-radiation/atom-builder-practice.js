
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleAtomBuilderPracticeV1';

  let state={index:0,complete:[]};
  try{state={...state,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{}
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));

  const tasks=[
    {
      level:'Level 1 · Start simple',
      title:'Build neutral hydrogen-1',
      prompt:'Create ¹₁H.',
      target:{Z:1,A:1,electrons:1},
      hint:'Z tells you protons. A − Z gives neutrons. Neutral means electrons = protons.',
      why:'Hydrogen-1 has 1 proton, 0 neutrons and 1 electron.'
    },
    {
      level:'Level 1 · Read Z and A',
      title:'Build carbon-12',
      prompt:'Create ¹²₆C.',
      target:{Z:6,A:12,electrons:6},
      hint:'Carbon has Z = 6. Neutrons = 12 − 6.',
      why:'Carbon-12 has 6 protons, 6 neutrons and 6 electrons.'
    },
    {
      level:'Level 2 · Isotopes',
      title:'Change carbon-12 into carbon-14',
      prompt:'Keep the element carbon but make the isotope ¹⁴₆C.',
      target:{Z:6,A:14,electrons:6},
      hint:'Keep Z = 6. Only the neutron number changes.',
      why:'Carbon-14 still has 6 protons, but now has 8 neutrons.'
    },
    {
      level:'Level 2 · Exam builder',
      title:'Build sodium-23',
      prompt:'Create a neutral ²³₁₁Na atom.',
      target:{Z:11,A:23,electrons:11},
      hint:'Z = 11, A = 23. Neutrons = 12. Neutral means 11 electrons.',
      why:'This is the key atom-builder question: p = 11, n = 12, e = 11.'
    },
    {
      level:'Level 3 · Ions',
      title:'Turn sodium-23 into Na⁺',
      prompt:'Keep the sodium-23 nucleus unchanged, but create a +1 ion.',
      target:{Z:11,A:23,electrons:10},
      hint:'A +1 ion has one fewer electron than protons.',
      why:'Ion formation changes electron number, not proton or neutron number.'
    },
    {
      level:'Level 3 · Isotope + ion',
      title:'Build chloride-37',
      prompt:'Create ³⁷₁₇Cl⁻.',
      target:{Z:17,A:37,electrons:18},
      hint:'Cl has 17 protons and 20 neutrons. A −1 ion has one extra electron.',
      why:'³⁷Cl⁻ has 17 protons, 20 neutrons and 18 electrons.'
    },
    {
      level:'Level 4 · Unknown nuclide',
      title:'Build aluminium-27 3+',
      prompt:'Create ²⁷₁₃Al³⁺.',
      target:{Z:13,A:27,electrons:10},
      hint:'Al has 13 protons. A = 27, so neutrons = 14. A 3+ ion has lost 3 electrons.',
      why:'²⁷Al³⁺ has 13 protons, 14 neutrons and 10 electrons.'
    },
    {
      level:'Level 4 · Exam challenge',
      title:'Build iron-56 2+',
      prompt:'Create ⁵⁶₂₆Fe²⁺.',
      target:{Z:26,A:56,electrons:24},
      hint:'Fe has 26 protons. Neutrons = 56 − 26. A 2+ ion has 2 fewer electrons than protons.',
      why:'⁵⁶Fe²⁺ has 26 protons, 30 neutrons and 24 electrons.'
    }
  ];

  function currentSim(){
    return window.PARTICLELAB_CORE?.getCurrentSim?.()||$('#simNav .sim-tab.active')?.dataset.sim||'atom';
  }

  function ensure(){
    if($('#atomBuilderPractice'))return;
    const side=$('.lab-side');if(!side)return;
    const el=document.createElement('section');
    el.id='atomBuilderPractice';el.className='atom-practice';el.hidden=currentSim()!=='atom';
    const coach=$('#simChangeCoach'),essentials=$('#simEssentials');
    if(coach)coach.insertAdjacentElement('afterend',el);
    else if(essentials)essentials.insertAdjacentElement('afterend',el);
    else side.appendChild(el);
    render();
  }

  function render(){
    ensure();
    const box=$('#atomBuilderPractice');if(!box)return;
    box.hidden=currentSim()!=='atom';
    if(box.hidden)return;
    const i=Math.max(0,Math.min(tasks.length-1,state.index)),t=tasks[i];
    const complete=new Set(state.complete||[]);
    const a=window.PARTICLELAB_ATOM_STATE||{};
    const progress=complete.size/tasks.length*100;
    box.innerHTML=
      '<div class="atom-practice-head"><div><span class="eyebrow">Build knowledge → apply it</span><h3>Atom Builder Practice</h3></div><span>Use the real atom controls</span></div>'+
      '<div class="atom-practice-body">'+
        '<div class="atom-knowledge-grid">'+
          rule('1. Proton number Z','Z = number of protons. Z decides which element it is.')+
          rule('2. Nucleon number A','A = protons + neutrons, so neutrons = A − Z.')+
          rule('3. Neutral atom','electrons = protons, so total charge is zero.')+
          rule('4. Ion','Only electron number changes when forming a simple ion.')+
        '</div>'+
        '<div class="atom-task-route">'+tasks.map((x,j)=>'<span class="'+(complete.has(j)?'done ':'')+(j===i?'active':'')+'">'+(j+1)+'. '+x.title+'</span>').join('')+'</div>'+
        '<div class="atom-progress"><div class="atom-progress-track"><div class="atom-progress-fill" style="width:'+progress+'%"></div></div><span>'+complete.size+' / '+tasks.length+' targets complete</span></div>'+
        '<div class="atom-challenge-card">'+
          '<div class="atom-challenge-top"><div><span class="atom-level">'+t.level+'</span><h4>'+t.title+'</h4></div><span class="study-spec-pill">Target '+(i+1)+' / '+tasks.length+'</span></div>'+
          '<div class="atom-target"><b>Your task:</b> '+t.prompt+'</div>'+
          '<div class="atom-live-check">'+
            live('Protons · Z',Number.isFinite(a.Z)?a.Z:'—')+
            live('Neutrons',Number.isFinite(a.neutrons)?a.neutrons:'—')+
            live('Electrons',Number.isFinite(a.electrons)?a.electrons:'—')+
            live('Charge',Number.isFinite(a.charge)?chargeText(a.charge):'—')+
          '</div>'+
          '<div class="atom-practice-actions"><button class="button primary" id="atomCheckTarget">Check my atom</button><button class="button" id="atomHintTarget">Hint</button><button class="button" id="atomPrevTarget" '+(i===0?'disabled':'')+'>← Previous</button><button class="button" id="atomNextTarget" '+(i===tasks.length-1?'disabled':'')+'>Next →</button><button class="button" id="atomResetPractice">Reset progress</button></div>'+
          '<div id="atomPracticeFeedback"></div>'+
        '</div>'+
      '</div>';

    $('#atomCheckTarget').onclick=check;
    $('#atomHintTarget').onclick=()=>feedback(t.hint,'try');
    $('#atomPrevTarget').onclick=()=>{state.index=Math.max(0,i-1);save();render()};
    $('#atomNextTarget').onclick=()=>{state.index=Math.min(tasks.length-1,i+1);save();render()};
    $('#atomResetPractice').onclick=()=>{state={index:0,complete:[]};save();render()};
  }

  function rule(a,b){return '<div class="atom-rule"><strong>'+a+'</strong><span>'+b+'</span></div>'}
  function live(a,b){return '<div><b>'+a+'</b><span>'+b+'</span></div>'}
  function chargeText(q){return q===0?'0':q>0?'+'+q+'e':q+'e'}

  function check(){
    const t=tasks[state.index],a=window.PARTICLELAB_ATOM_STATE||{};
    const ok=a.Z===t.target.Z&&a.A===t.target.A&&a.electrons===t.target.electrons;
    if(ok){
      const set=new Set(state.complete||[]);set.add(state.index);state.complete=[...set];save();
      feedback('✓ Correct. '+t.why,'good');
      window.PARTICLELAB_SOUND?.cue?.('correct');
      if(state.index<tasks.length-1){
        setTimeout(()=>{state.index++;save();render()},650);
      }
    }else{
      const wrong=[];
      if(a.Z!==t.target.Z)wrong.push('proton number Z');
      if(a.A!==t.target.A)wrong.push('nucleon number A');
      if(a.electrons!==t.target.electrons)wrong.push('electron number');
      feedback('Not yet. Recheck '+wrong.join(', ')+'. Use Z first, then A − Z for neutrons, then decide whether the atom is neutral or an ion.','try');
      window.PARTICLELAB_SOUND?.cue?.('wrong');
    }
  }

  function feedback(msg,kind){
    const f=$('#atomPracticeFeedback');if(!f)return;
    f.className='atom-feedback '+kind;f.textContent=msg;
  }

  function sync(){
    ensure();
    const box=$('#atomBuilderPractice');if(box)box.hidden=currentSim()!=='atom';
    if(currentSim()==='atom')render();
  }

  function init(){
    ensure();
    $('#simNav')?.addEventListener('click',e=>{if(e.target.closest?.('.sim-tab'))setTimeout(sync,80)});
    window.addEventListener('particlelab:atom-change',()=>{if(currentSim()==='atom')render()});
  }

  window.PARTICLELAB_ATOM_PRACTICE={tasks,open:(i=0)=>{state.index=Math.max(0,Math.min(tasks.length-1,i));save();document.querySelector('[data-view="lab"]')?.click();setTimeout(()=>window.PARTICLELAB_CORE?.activateSim?.('atom'),50)}};

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,360),{once:true});
  else setTimeout(init,360);
})();
