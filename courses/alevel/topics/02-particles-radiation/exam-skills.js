
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleExamSkillsV1';
  let state={worked:0};
  try{state={...state,...JSON.parse(localStorage.getItem(STORE)||'{}')}}catch{}
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));

  const commands=[
    ['State','Give the required information clearly and briefly. Do not add unnecessary explanation.'],
    ['Describe','Give an account of what happens or what the data show.'],
    ['Explain','Give reasons using physics ideas and link cause → effect.'],
    ['Calculate','Work out a numerical value from the information given.'],
    ['Determine','Use the supplied data or information to obtain an answer.'],
    ['Deduce','Draw a conclusion from information that has been provided.'],
    ['Show','Provide structured working that reaches the stated result.'],
    ['Suggest','Give a plausible physics-based answer in a new or unfamiliar context.'],
    ['Compare','Identify relevant similarities and/or differences.'],
    ['Discuss','Present key points about different ideas, evidence, strengths or weaknesses.']
  ];

  const worked=[
    {
      title:'Specific charge',
      topic:'Specific charge',
      q:'A nucleus has Z = 8 and A = 16. Estimate its specific charge.',
      steps:[
        ['Identify charge','Q = Ze = 8 × 1.602 × 10⁻¹⁹ C.'],
        ['Estimate mass','m ≈ A × nucleon mass ≈ 16 × 1.67 × 10⁻²⁷ kg.'],
        ['Use relationship','specific charge = Q/m.'],
        ['Substitute','(8 × 1.602 × 10⁻¹⁹) / (16 × 1.67 × 10⁻²⁷).'],
        ['State unit','Answer is positive and in C kg⁻¹.']
      ]
    },
    {
      title:'Photon energy',
      topic:'Photons',
      q:'Find the energy of a photon with frequency 6.0 × 10¹⁴ Hz.',
      steps:[
        ['Choose equation','E = hf.'],
        ['Substitute','E = 6.626 × 10⁻³⁴ × 6.0 × 10¹⁴.'],
        ['Calculate','E ≈ 3.98 × 10⁻¹⁹ J.'],
        ['Check','Higher frequency would give proportionally higher photon energy.']
      ]
    },
    {
      title:'Pair-production threshold',
      topic:'Antimatter',
      q:'What minimum photon energy is needed to create an electron–positron pair?',
      steps:[
        ['Recall rest energy','One electron has rest energy 0.511 MeV.'],
        ['Create two particles','Need e⁻ + e⁺, so double the rest energy.'],
        ['Calculate','2 × 0.511 MeV = 1.022 MeV.'],
        ['Add physics meaning','A nearby body helps conserve momentum.']
      ]
    },
    {
      title:'eV to J',
      topic:'Electron collisions',
      q:'Convert 12.0 eV to joules.',
      steps:[
        ['Recall conversion','1 eV = 1.602 × 10⁻¹⁹ J.'],
        ['Multiply','12.0 × 1.602 × 10⁻¹⁹ J.'],
        ['Calculate','1.92 × 10⁻¹⁸ J.'],
        ['Check scale','A few eV should be around 10⁻¹⁸ J.']
      ]
    },
    {
      title:'Photoelectric KE',
      topic:'Photoelectric effect',
      q:'Photon energy is 4.20 eV and the work function is 2.30 eV. Find KEmax.',
      steps:[
        ['Use equation','hf = φ + KEmax.'],
        ['Rearrange','KEmax = photon energy − work function.'],
        ['Substitute','KEmax = 4.20 − 2.30 eV.'],
        ['Answer','KEmax = 1.90 eV.']
      ]
    },
    {
      title:'Stopping potential',
      topic:'Photoelectric effect',
      q:'The fastest photoelectrons have KEmax = 2.4 eV. Find the stopping potential.',
      steps:[
        ['Use relationship','KEmax = eVs.'],
        ['Use eV shortcut carefully','An electron with 2.4 eV kinetic energy is stopped by 2.4 V.'],
        ['Answer','Vs = 2.4 V.'],
        ['Explain','The electric field removes the maximum electron kinetic energy.']
      ]
    },
    {
      title:'Energy-level wavelength',
      topic:'Energy levels',
      q:'A transition releases 3.0 eV. Find the photon wavelength.',
      steps:[
        ['Convert energy','ΔE = 3.0 × 1.602 × 10⁻¹⁹ J.'],
        ['Use relationship','ΔE = hc/λ.'],
        ['Rearrange','λ = hc/ΔE.'],
        ['Substitute','Use h = 6.626 × 10⁻³⁴ J s and c = 3.00 × 10⁸ m s⁻¹.'],
        ['Interpret','A larger ΔE would give a shorter wavelength.']
      ]
    },
    {
      title:'de Broglie wavelength',
      topic:'Wave–particle duality',
      q:'A particle has momentum 3.0 × 10⁻²⁴ kg m s⁻¹. Find its de Broglie wavelength.',
      steps:[
        ['Choose equation','λ = h/p.'],
        ['Substitute','λ = 6.626 × 10⁻³⁴ / 3.0 × 10⁻²⁴.'],
        ['Calculate','λ ≈ 2.21 × 10⁻¹⁰ m.'],
        ['Interpret','If momentum doubled, wavelength would halve.']
      ]
    }
  ];

  const killers=[
    ['Frequency vs intensity','Saying higher intensity makes each photon more energetic. Photon energy depends on frequency, E = hf.'],
    ['Excitation vs ionisation','Calling excitation “an electron leaving the atom”. Excitation leaves it bound.'],
    ['Isotopes','Saying isotopes have different proton numbers. They have the same Z.'],
    ['Meson vs baryon','Writing “meson = three quarks”. Meson = q + q̄; baryon = three quarks.'],
    ['Antiparticles','Defining every antiparticle as oppositely charged. Neutral particles can have distinct antiparticles.'],
    ['Rutherford wording','Giving the model inference without first stating the observation.'],
    ['Energy levels','Treating level lines as physical electron orbits. They represent allowed energies.'],
    ['Units','Losing marks through eV/J confusion or missing C kg⁻¹ on specific charge.'],
    ['Conservation','Checking charge only and forgetting B, L, S, energy or momentum.'],
    ['Wave–particle duality','Saying an electron is literally a classical wave instead of saying it shows wave properties.']
  ];

  function inject(){
    if($('#view-examskills'))return;
    const nav=$('.main-nav'),main=$('main.main');if(!nav||!main)return;
    const btn=document.createElement('button');
    btn.className='nav-button';btn.dataset.view='examskills';btn.textContent='Exam skills';
    nav.appendChild(btn);
    const view=document.createElement('section');
    view.id='view-examskills';view.className='view';main.appendChild(view);
    btn.onclick=open;
    render();
  }

  function open(){
    $$('.view').forEach(v=>v.classList.toggle('active-view',v.id==='view-examskills'));
    $$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view==='examskills'));
    render();
  }

  function render(){
    const v=$('#view-examskills');if(!v)return;
    const w=worked[state.worked%worked.length];
    v.innerHTML=
      '<div class="section-head"><div><span class="eyebrow">Turn knowledge into marks</span><h2>Exam skills</h2></div><p class="subtle">Command words, calculation method, explanation structure and common mark-losing errors.</p></div>'+
      '<div class="exam-skills-shell">'+
        '<section class="exam-skill-card"><span class="eyebrow">AQA language</span><h3>Command-word coach</h3><div class="command-grid">'+commands.map(x=>'<div class="command-card"><strong>'+x[0]+'</strong><span>'+x[1]+'</span></div>').join('')+'</div></section>'+
        '<section class="exam-skill-card"><span class="eyebrow">Calculation routine</span><h3>Use the same method every time</h3><div class="exam-skills-grid"><div><ol><li>Write down the known values with units.</li><li>Choose the equation before substituting.</li><li>Convert units, especially eV↔J and prefixes.</li><li>Rearrange symbolically if needed.</li><li>Substitute values carefully.</li><li>State a unit and sensible significant figures.</li><li>Check sign, scale and physical meaning.</li></ol></div><div><div class="long-answer-builder">'+[
          ['Known','What information has the question actually given you?'],
          ['Equation','Which relationship connects the knowns to the unknown?'],
          ['Units','Are all quantities compatible?'],
          ['Answer','Does the number make physical sense?']
        ].map(x=>'<div class="long-answer-row"><strong>'+x[0]+'</strong><span>'+x[1]+'</span></div>').join('')+'</div></div></div></section>'+
        '<section class="exam-skill-card"><span class="eyebrow">Worked calculations</span><h3>Step-by-step examples</h3><div class="worked-tabs">'+worked.map((x,i)=>'<button data-worked="'+i+'" class="'+(i===state.worked?'active':'')+'">'+x.title+'</button>').join('')+'</div><div class="worked-example"><span class="eyebrow">'+w.topic+'</span><h3>'+w.title+'</h3><div class="worked-question">'+w.q+'</div><div class="worked-steps">'+w.steps.map((x,i)=>'<div class="worked-step"><span>'+(i+1)+'</span><div><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div></div>').join('')+'</div></div></section>'+
        '<div class="exam-skills-grid"><section class="exam-skill-card"><span class="eyebrow">Long answers</span><h3>Physics explanation builder</h3><div class="long-answer-builder">'+[
          ['1. State the observation / change','What happened in the experiment, graph or simulation?'],
          ['2. Name the physics principle','Photon energy? Conservation? Coulomb repulsion? Discrete levels?'],
          ['3. Use the equation or relationship','Include it when it actually explains the trend.'],
          ['4. Link cause to effect','Use words such as because, therefore and so that.'],
          ['5. Return to the question','Finish by answering the exact quantity or claim being asked about.']
        ].map(x=>'<div class="long-answer-row"><strong>'+x[0]+'</strong><span>'+x[1]+'</span></div>').join('')+'</div></section>'+
        '<section class="exam-skill-card"><span class="eyebrow">Avoid these</span><h3>Common mark killers</h3><div>'+killers.map(x=>'<div class="mark-killer"><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div>').join('')+'</div></section></div>'+
      '</div>';
    $$('[data-worked]',v).forEach(b=>b.onclick=()=>{state.worked=+b.dataset.worked;save();render()});
  }

  function init(){inject()}
  window.PARTICLELAB_EXAM_SKILLS={open};

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,560),{once:true});
  else setTimeout(init,560);
})();
