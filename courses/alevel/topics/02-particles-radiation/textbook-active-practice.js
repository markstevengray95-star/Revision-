(() => {
  'use strict';

  const STORE='particleTextbookActivePracticeV1';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const zh=()=>String(document.documentElement.lang||'').toLowerCase().startsWith('zh');
  const tr=x=>Array.isArray(x)?(zh()?x[1]:x[0]):x;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let state={};
  try{state=JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{}
  const save=()=>localStorage.setItem(STORE,JSON.stringify(state));

  const bank={
    1:[
      {type:'number',q:['For ³⁷₁₇Cl, calculate the number of neutrons.','对于 ³⁷₁₇Cl，计算中子数。'],a:20,tol:0,unit:['neutrons','个中子'],hint:['Use N = A − Z.','使用 N = A − Z。'],why:['N = 37 − 17 = 20.','N = 37 − 17 = 20。']},
      {type:'choice',q:['A neutral atom has Z = 8. How many electrons does it have?','一个中性原子的 Z = 8。它有多少个电子？'],choices:[['6','6'],['8','8'],['10','10']],a:1,hint:['Neutral means total positive and negative charge balance.','中性表示总正电荷和总负电荷相等。'],why:['A neutral atom has the same number of electrons as protons, so it has 8 electrons.','中性原子的电子数等于质子数，因此有 8 个电子。']}
    ],
    2:[
      {type:'number',q:['Using e = 1.602 × 10⁻¹⁹ C and proton mass 1.673 × 10⁻²⁷ kg, calculate the proton specific charge in C kg⁻¹.','使用 e = 1.602 × 10⁻¹⁹ C、质子质量 1.673 × 10⁻²⁷ kg，计算质子的比荷（C kg⁻¹）。'],a:9.58e7,tol:0.015,unit:['C kg⁻¹','C kg⁻¹'],hint:['Specific charge = Q/m. Keep the powers of ten until the final line.','比荷 = Q/m。最后一步前保留科学计数法。'],why:['(1.602 × 10⁻¹⁹)/(1.673 × 10⁻²⁷) ≈ 9.58 × 10⁷ C kg⁻¹.','(1.602 × 10⁻¹⁹)/(1.673 × 10⁻²⁷) ≈ 9.58 × 10⁷ C kg⁻¹。']},
      {type:'choice',q:['What is the net charge of a +2 ion?','+2 离子的净电荷是多少？'],choices:[['+1.602 × 10⁻¹⁹ C','+1.602 × 10⁻¹⁹ C'],['+3.204 × 10⁻¹⁹ C','+3.204 × 10⁻¹⁹ C'],['−3.204 × 10⁻¹⁹ C','−3.204 × 10⁻¹⁹ C']],a:1,hint:['A +2 ion has net charge +2e.','+2 离子的净电荷为 +2e。'],why:['Q = +2e = +3.204 × 10⁻¹⁹ C.','Q = +2e = +3.204 × 10⁻¹⁹ C。']}
    ],
    3:[
      {type:'choice',q:['At a nucleon separation of about 1 fm, how should the strong nuclear interaction be described?','核子间距约 1 fm 时，强核相互作用应如何描述？'],choices:[['Strongly repulsive','强烈排斥'],['Attractive','吸引'],['Negligible','可忽略']],a:1,hint:['1 fm lies inside the typical attractive nuclear-distance region.','1 fm 位于典型的核尺度吸引区。'],why:['At around 1 fm the strong interaction is attractive and can overcome proton–proton electrostatic repulsion.','约 1 fm 时强相互作用为吸引，可克服质子之间的静电排斥。']},
      {type:'choice',q:['Beyond a few femtometres, what happens to the strong nuclear interaction?','超过几飞米后，强核相互作用怎样变化？'],choices:[['It becomes much stronger','变得更强'],['It becomes negligible','变得可忽略'],['It becomes electromagnetic','变成电磁相互作用']],a:1,hint:['The strong nuclear interaction is very short range.','强核相互作用作用距离很短。'],why:['Beyond a few femtometres its effect rapidly becomes negligible.','超过几飞米后，其作用迅速变得可忽略。']}
    ],
    4:[
      {type:'number',q:['A ²³⁸₉₂U nucleus emits an alpha particle. What is the daughter nucleon number A?','²³⁸₉₂U 原子核发生 α 衰变。子核的核子数 A 是多少？'],a:234,tol:0,unit:['',''],hint:['Alpha emission removes 4 nucleons.','α 粒子带走 4 个核子。'],why:['A decreases by 4: 238 − 4 = 234.','A 减少 4：238 − 4 = 234。']},
      {type:'number',q:['For the same alpha decay, what is the daughter proton number Z?','对于同一次 α 衰变，子核的质子数 Z 是多少？'],a:90,tol:0,unit:['',''],hint:['An alpha particle contains two protons.','α 粒子含有两个质子。'],why:['Z decreases by 2: 92 − 2 = 90.','Z 减少 2：92 − 2 = 90。']}
    ],
    5:[
      {type:'number',q:['Calculate the energy of a photon with frequency 6.0 × 10¹⁴ Hz. Use h = 6.63 × 10⁻³⁴ J s.','计算频率为 6.0 × 10¹⁴ Hz 的光子能量。取 h = 6.63 × 10⁻³⁴ J s。'],a:3.98e-19,tol:0.02,unit:['J','J'],hint:['Use E = hf.','使用 E = hf。'],why:['E = (6.63 × 10⁻³⁴)(6.0 × 10¹⁴) ≈ 3.98 × 10⁻¹⁹ J.','E = (6.63 × 10⁻³⁴)(6.0 × 10¹⁴) ≈ 3.98 × 10⁻¹⁹ J。']},
      {type:'choice',q:['Which statement best describes a particle and its antiparticle?','哪项最恰当地描述粒子与其反粒子？'],choices:[['Different mass and same quantum numbers','质量不同、量子数相同'],['Same mass with opposite relevant additive quantum numbers','质量相同、相关加性量子数相反'],['Always opposite electric charge only','定义上只有电荷相反']],a:1,hint:['Neutral particles can still have distinct antiparticles.','中性粒子也可以有不同的反粒子。'],why:['Particle and antiparticle have the same mass/rest energy and opposite relevant additive quantum numbers.','粒子与反粒子具有相同质量/静能，相关加性量子数相反。']}
    ],
    6:[
      {type:'number',q:['A photon has energy 1.50 MeV and creates an electron–positron pair. Ignoring recoil for this calculation, how much energy remains after providing the 1.022 MeV rest energy?','一个 1.50 MeV 光子产生电子—正电子对。此计算中忽略反冲，提供 1.022 MeV 静能后还剩多少能量？'],a:0.478,tol:0.003,unit:['MeV','MeV'],hint:['Subtract the pair rest-energy threshold from the photon energy.','用光子能量减去粒子对的静能阈值。'],why:['1.50 − 1.022 = 0.478 MeV, available as kinetic/recoil energy.','1.50 − 1.022 = 0.478 MeV，可成为动能/反冲能。']},
      {type:'choice',q:['Why is a nearby nucleus or other body important in pair production?','为什么成对产生通常需要附近的原子核或其他物体？'],choices:[['It supplies electric charge','它提供电荷'],['It can take recoil momentum so momentum is conserved','它可承担反冲动量，使动量守恒'],['It lowers electron rest mass','它降低电子静质量']],a:1,hint:['Energy conservation is not the only conservation law.','不只有能量需要守恒。'],why:['The nearby body can recoil, allowing total momentum to be conserved.','附近物体可以反冲，使总动量守恒。']}
    ],
    7:[
      {type:'choice',q:['Which exchange particle represents the electromagnetic interaction in this AQA model?','在该 AQA 模型中，哪种交换粒子表示电磁相互作用？'],choices:[['Virtual photon','虚光子'],['W⁻ boson','W⁻ 玻色子'],['Pion','π 介子']],a:0,hint:['Think photon for electromagnetic interactions.','电磁相互作用要想到光子。'],why:['The electromagnetic interaction is represented by virtual-photon exchange.','电磁相互作用用虚光子交换表示。']},
      {type:'choice',q:['Which W boson appears in the quark-level description of beta-minus decay?','β⁻ 衰变的夸克层面描述中出现哪种 W 玻色子？'],choices:[['W⁺','W⁺'],['W⁻','W⁻'],['Neither','都不是']],a:1,hint:['In beta-minus decay, d changes to u while an electron and antineutrino ultimately appear.','β⁻ 衰变中 d 变成 u，最终产生电子和反中微子。'],why:['The weak process can be represented as d → u + W⁻, followed by W⁻ → e⁻ + ν̄ₑ.','弱相互作用可表示为 d → u + W⁻，随后 W⁻ → e⁻ + ν̄ₑ。']}
    ],
    8:[
      {type:'choice',q:['How should a pion be fully classified?','π 介子应如何完整分类？'],choices:[['Lepton','轻子'],['Hadron and baryon','强子和重子'],['Hadron and meson','强子和介子']],a:2,hint:['Hadrons split into baryons and mesons.','强子分为重子和介子。'],why:['A pion is a hadron because it participates in the strong interaction, and specifically a meson.','π 介子参与强相互作用，因此是强子，并且属于介子。']},
      {type:'choice',q:['How is a muon classified?','μ 子属于哪一类？'],choices:[['Lepton','轻子'],['Baryon','重子'],['Meson','介子']],a:0,hint:['Muons are in the same broad family as electrons, not hadrons.','μ 子与电子同属轻子大类，而不是强子。'],why:['A muon is a lepton and does not participate in the strong interaction.','μ 子是轻子，不参与强相互作用。']}
    ],
    9:[
      {type:'text',q:['Write the quark composition of a proton using u and d.','用 u 和 d 写出质子的夸克组成。'],accept:['uud'],hint:['A proton has charge +1e. Two up quarks and one down quark give +1e.','质子电荷为 +1e。两个 u 夸克和一个 d 夸克合计为 +1e。'],why:['The proton is uud.','质子的夸克组成为 uud。']},
      {type:'choice',q:['Which quark composition matches K⁺?','哪种夸克组成对应 K⁺？'],choices:[['u d̄','u d̄'],['u s̄','u s̄'],['d s̄','d s̄']],a:1,hint:['K⁺ has strangeness +1, so it contains anti-s rather than s.','K⁺ 的奇异数为 +1，因此含有反 s，而不是 s。'],why:['K⁺ is u s̄. The anti-strange quark gives strangeness +1.','K⁺ 的组成为 u s̄。反奇异夸克带来 +1 的奇异数。']}
    ],
    10:[
      {type:'number',q:['A proton and antiproton are together before an interaction. What is their total baryon number?','相互作用前有一个质子和一个反质子。它们的总重子数是多少？'],a:0,tol:0,unit:['',''],hint:['Proton B = +1; antiproton B = −1.','质子的 B = +1；反质子的 B = −1。'],why:['(+1) + (−1) = 0.','(+1) + (−1) = 0。']},
      {type:'choice',q:['A proposed reaction conserves charge but not baryon number. What conclusion should you make?','某反应电荷守恒，但重子数不守恒。应得出什么结论？'],choices:[['It is allowed because charge is enough','允许，因为电荷守恒已经足够'],['It is not allowed because all relevant conservation laws must hold','不允许，因为所有相关守恒定律都必须满足'],['It is allowed only at high energy','只要能量足够高就允许']],a:1,hint:['Check every relevant conserved quantity, not just Q.','不能只检查 Q，要检查所有相关守恒量。'],why:['Failure of any required conservation law makes the proposed reaction forbidden.','任何必需守恒定律不满足，该反应就不允许。']}
    ],
    11:[
      {type:'number',q:['For a metal, hf = 4.2 × 10⁻¹⁹ J and φ = 2.5 × 10⁻¹⁹ J. Calculate KEmax.','某金属中 hf = 4.2 × 10⁻¹⁹ J，φ = 2.5 × 10⁻¹⁹ J。计算 KEmax。'],a:1.7e-19,tol:0.02,unit:['J','J'],hint:['Use hf = φ + KEmax.','使用 hf = φ + KEmax。'],why:['KEmax = 4.2 × 10⁻¹⁹ − 2.5 × 10⁻¹⁹ = 1.7 × 10⁻¹⁹ J.','KEmax = 4.2 × 10⁻¹⁹ − 2.5 × 10⁻¹⁹ = 1.7 × 10⁻¹⁹ J。']},
      {type:'choice',q:['At fixed frequency above threshold, what does increasing light intensity mainly change?','频率固定且高于阈频时，增大光强主要改变什么？'],choices:[['The energy of each photon','每个光子的能量'],['The maximum kinetic energy of each emitted electron','每个逸出电子的最大动能'],['The photon arrival rate and therefore emission rate/current','光子到达率，因此改变逸出率/电流']],a:2,hint:['Photon energy depends on frequency, not intensity.','光子能量由频率决定，而不是光强。'],why:['At fixed frequency, greater intensity means more photons arrive each second, so more electrons can be emitted; KEmax is unchanged.','频率固定时，更大光强意味着每秒到达更多光子，因此可逸出更多电子；KEmax 不变。']}
    ],
    12:[
      {type:'number',q:['Convert 3.0 eV to joules using 1 eV = 1.602 × 10⁻¹⁹ J.','使用 1 eV = 1.602 × 10⁻¹⁹ J，将 3.0 eV 转换为焦耳。'],a:4.806e-19,tol:0.01,unit:['J','J'],hint:['Multiply the number of electronvolts by 1.602 × 10⁻¹⁹.','用电子伏特数乘以 1.602 × 10⁻¹⁹。'],why:['3.0 × 1.602 × 10⁻¹⁹ = 4.806 × 10⁻¹⁹ J.','3.0 × 1.602 × 10⁻¹⁹ = 4.806 × 10⁻¹⁹ J。']},
      {type:'choice',q:['Which statement distinguishes excitation from ionisation?','哪项能区分激发与电离？'],choices:[['Excitation removes the electron completely','激发会完全移走电子'],['Excitation leaves the electron bound; ionisation removes it','激发后电子仍被束缚；电离会移走电子'],['They are the same process at different temperatures','它们只是不同温度下的同一过程']],a:1,hint:['Ask whether the electron remains part of the atom.','判断电子是否仍属于该原子。'],why:['Excitation raises a bound electron to a higher allowed level; ionisation removes the electron from the atom.','激发使束缚电子进入更高允许能级；电离则把电子从原子中移走。']}
    ],
    13:[
      {type:'number',q:['An atomic transition releases ΔE = 3.0 × 10⁻¹⁹ J. Calculate the photon wavelength using h = 6.63 × 10⁻³⁴ J s and c = 3.00 × 10⁸ m s⁻¹.','某原子跃迁释放 ΔE = 3.0 × 10⁻¹⁹ J。使用 h = 6.63 × 10⁻³⁴ J s、c = 3.00 × 10⁸ m s⁻¹ 计算光子波长。'],a:6.63e-7,tol:0.02,unit:['m','m'],hint:['Use ΔE = hc/λ, then rearrange for λ.','使用 ΔE = hc/λ，然后变形求 λ。'],why:['λ = hc/ΔE ≈ (6.63 × 10⁻³⁴ × 3.00 × 10⁸)/(3.0 × 10⁻¹⁹) ≈ 6.63 × 10⁻⁷ m.','λ = hc/ΔE ≈ (6.63 × 10⁻³⁴ × 3.00 × 10⁸)/(3.0 × 10⁻¹⁹) ≈ 6.63 × 10⁻⁷ m。']},
      {type:'choice',q:['Why does an atomic emission spectrum contain discrete lines rather than every wavelength?','为什么原子发射光谱是分立谱线，而不是包含所有波长？'],choices:[['Atomic energy levels are discrete','原子能级是离散的'],['Electrons all move at one speed','所有电子速度相同'],['Photons can only travel in straight lines','光子只能直线传播']],a:0,hint:['Think about the allowed energy differences between states.','考虑允许能态之间的能量差。'],why:['Only certain energy differences are possible, so only photons with corresponding discrete energies and wavelengths are emitted.','只有特定能量差允许发生，因此只发射具有相应离散能量和波长的光子。']}
    ],
    14:[
      {type:'number',q:['Calculate the de Broglie wavelength of a particle with momentum 2.0 × 10⁻²⁴ kg m s⁻¹. Use h = 6.63 × 10⁻³⁴ J s.','计算动量为 2.0 × 10⁻²⁴ kg m s⁻¹ 粒子的德布罗意波长。取 h = 6.63 × 10⁻³⁴ J s。'],a:3.315e-10,tol:0.02,unit:['m','m'],hint:['Use λ = h/p.','使用 λ = h/p。'],why:['λ = 6.63 × 10⁻³⁴ / 2.0 × 10⁻²⁴ ≈ 3.32 × 10⁻¹⁰ m.','λ = 6.63 × 10⁻³⁴ / 2.0 × 10⁻²⁴ ≈ 3.32 × 10⁻¹⁰ m。']},
      {type:'choice',q:['If electron momentum increases in the same diffraction setup, what happens to de Broglie wavelength and diffraction angle?','在同一衍射装置中，若电子动量增大，德布罗意波长和衍射角如何变化？'],choices:[['λ increases and angle increases','λ 增大，角度增大'],['λ decreases and angle generally decreases','λ 减小，角度通常减小'],['λ is unchanged','λ 不变']],a:1,hint:['Start with λ = h/p.','先从 λ = h/p 出发。'],why:['Higher p gives smaller λ; for the same lattice spacing this produces smaller diffraction angles.','更大的 p 使 λ 变小；在相同晶格间距下，衍射角也变小。']}
    ],
    15:[
      {type:'choice',q:['Which approach is strongest for a synoptic particle-physics question?','处理综合粒子物理题时，哪种方法最有效？'],choices:[['Recall one isolated fact and stop','回忆一个孤立事实后停止'],['Identify the particle/process, choose relevant conservation/equations, then calculate or explain','先识别粒子/过程，再选择相关守恒定律或方程，然后计算或解释'],['Always begin with a numerical substitution','总是先代入数字']],a:1,hint:['Synoptic means linking ideas, not just remembering one definition.','综合题要求联系多个概念，而不是只记一个定义。'],why:['A reliable route is classify/identify → choose physics principles → apply equations or conservation → explain the conclusion.','可靠步骤是：分类/识别 → 选择物理原理 → 应用方程或守恒 → 解释结论。']},
      {type:'choice',q:['Which relationship links photon energy directly to wavelength?','哪条关系把光子能量与波长直接联系起来？'],choices:[['E = hc/λ','E = hc/λ'],['λ = h/p','λ = h/p'],['Q/m','Q/m']],a:0,hint:['Combine E = hf with c = fλ.','把 E = hf 与 c = fλ 结合。'],why:['E = hc/λ links photon energy and wavelength directly.','E = hc/λ 直接联系光子能量与波长。']}
    ],
    16:[
      {type:'choice',q:['What conclusion is supported by most alpha particles passing almost straight through thin gold foil?','大多数 α 粒子几乎直穿薄金箔支持什么结论？'],choices:[['Atoms are mostly empty space','原子大部分是空的'],['Positive charge fills the whole atom uniformly','正电荷均匀充满整个原子'],['Electrons contain most atomic mass','电子包含大部分原子质量']],a:0,hint:['Most alpha particles encounter very little concentrated matter or charge.','大多数 α 粒子没有遇到集中的物质或电荷。'],why:['The observation supports the idea that the nucleus occupies only a tiny fraction of atomic volume.','该观察支持原子核只占原子总体积极小部分的观点。']},
      {type:'choice',q:['What do the rare very large-angle alpha deflections show most directly?','少数 α 粒子发生很大角度偏转最直接说明什么？'],choices:[['Positive charge and most mass are concentrated in a tiny nucleus','正电荷和大部分质量集中在很小的原子核'],['The atom has no nucleus','原子没有原子核'],['Alpha particles are uncharged','α 粒子不带电']],a:0,hint:['Large deflection requires a very strong interaction over a very small region.','大角度偏转需要在很小区域内产生很强的相互作用。'],why:['Rare large deflections require a small, dense, positively charged centre: the nucleus.','少数大角度偏转说明存在很小、致密、带正电的中心——原子核。']}
    ]
  };

  function lessonNo(){
    const m=($('#lessonPanel .lesson-count')?.textContent||'').match(/\d+/);
    if(m)return Number(m[0]);
    const active=$('#courseList [data-seq-lesson].active');
    return active?Number(active.dataset.seqLesson)+1:1;
  }

  function parseNumber(raw){
    let s=String(raw||'').trim().replace(/,/g,'').replace(/−/g,'-');
    const sci=s.match(/([+-]?\d*\.?\d+)\s*[x×]\s*10\s*\^?\s*([+-]?\d+)/i);
    if(sci)s=`${sci[1]}e${sci[2]}`;
    const m=s.match(/[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);
    return m?Number(m[0]):NaN;
  }

  function norm(s){
    return String(s||'').toLowerCase().replace(/\s+/g,'').replace(/[.,;:()]/g,'').replace(/ū/g,'u').replace(/đ/g,'d');
  }

  function correct(q,val){
    if(q.type==='number'){
      const x=parseNumber(val); if(!Number.isFinite(x))return false;
      if(q.a===0)return Math.abs(x)<1e-12;
      const rel=Math.abs((x-q.a)/q.a);
      return rel<=Math.max(q.tol||0,1e-10);
    }
    if(q.type==='text')return (q.accept||[]).some(a=>norm(a)===norm(val));
    return Number(val)===Number(q.a);
  }

  function record(n,i,val,isCorrect){
    state[n]??={answers:[],correct:[]};
    state[n].answers[i]=String(val);
    state[n].correct[i]=!!isCorrect;
    save();
  }

  function inputHTML(q,i,saved){
    if(q.type==='choice')return `<div class="tbp-choice-list">${q.choices.map((c,j)=>`<button type="button" class="tbp-choice ${String(saved)===String(j)?'selected':''}" data-tbp-choice="${i}" data-value="${j}">${esc(tr(c))}</button>`).join('')}</div><input type="hidden" data-tbp-input="${i}" value="${esc(saved??'')}">`;
    return `<div class="tbp-answer-row"><input type="text" inputmode="${q.type==='number'?'decimal':'text'}" autocomplete="off" data-tbp-input="${i}" value="${esc(saved??'')}" placeholder="${esc(q.type==='number'?tr(['e.g. 3.98e-19','例如 3.98e-19']):tr(['Type your answer','输入答案']))}">${q.unit?.[0]||q.unit?.[1]?`<span>${esc(tr(q.unit))}</span>`:''}</div>`;
  }

  function render(){
    const chapter=$('.lesson-active-section .textbook-full-chapter')||$('.lesson-full-plan .textbook-full-chapter');
    if(!chapter)return;
    const n=lessonNo(), qs=bank[n]; if(!qs)return;
    if(chapter.dataset.activePracticeLesson===String(n))return;
    chapter.querySelector('.textbook-active-practice')?.remove();
    const saved=state[n]||{answers:[],correct:[]};
    const score=qs.reduce((a,_,i)=>a+(saved.correct?.[i]?1:0),0);
    const box=document.createElement('section');
    box.className='textbook-active-practice';
    box.innerHTML=`<div class="tbp-head"><div><span class="eyebrow">${esc(tr(['Your turn — active practice','轮到你——主动练习']))}</span><h4>${esc(tr(['Check that you can use the physics','检查你是否真正会用这些物理知识']))}</h4><p>${esc(tr(['These are original practice questions for this lesson. Try each one before opening the hint or solution.','这些是本课原创练习题。先独立作答，再查看提示或解析。']))}</p></div><div class="tbp-score" data-tbp-score><strong>${score}/${qs.length}</strong><span>${esc(tr(['correct','答对']))}</span></div></div><div class="tbp-grid">${qs.map((q,i)=>`<article class="tbp-question ${saved.correct?.[i]?'is-correct':''}" data-tbp-question="${i}"><div class="tbp-qhead"><span>${esc(tr(['Question','题目']))} ${i+1}</span><b>${esc(q.type==='number'?tr(['Calculation','计算']):tr(['Knowledge check','知识检查']))}</b></div><p class="tbp-prompt">${esc(tr(q.q))}</p>${inputHTML(q,i,saved.answers?.[i])}<div class="tbp-actions"><button type="button" class="button" data-tbp-check="${i}">${esc(tr(['Check answer','检查答案']))}</button><button type="button" class="text-button" data-tbp-hint="${i}">${esc(tr(['Hint','提示']))}</button></div><div class="tbp-hint hidden" data-tbp-hint-box="${i}">${esc(tr(q.hint))}</div><div class="tbp-feedback ${saved.correct?.[i]?'correct':''}" data-tbp-feedback="${i}">${saved.correct?.[i]?`<strong>${esc(tr(['Correct','正确']))}</strong><span>${esc(tr(q.why))}</span>`:''}</div><details class="tbp-solution"><summary>${esc(tr(['Show worked reasoning','查看完整解析']))}</summary><p>${esc(tr(q.why))}</p></details></article>`).join('')}</div>`;
    const grid=chapter.querySelector('.textbook-study-grid');
    if(grid)grid.insertAdjacentElement('afterend',box); else chapter.append(box);
    chapter.dataset.activePracticeLesson=String(n);
    bind(box,n,qs);
  }

  function bind(box,n,qs){
    $$('[data-tbp-choice]',box).forEach(btn=>btn.addEventListener('click',()=>{
      const i=Number(btn.dataset.tbpChoice), hidden=$(`[data-tbp-input="${i}"]`,box);
      hidden.value=btn.dataset.value;
      $$(`[data-tbp-choice="${i}"]`,box).forEach(x=>x.classList.toggle('selected',x===btn));
    }));
    $$('[data-tbp-hint]',box).forEach(btn=>btn.addEventListener('click',()=>{
      $(`[data-tbp-hint-box="${btn.dataset.tbpHint}"]`,box)?.classList.toggle('hidden');
    }));
    $$('[data-tbp-check]',box).forEach(btn=>btn.addEventListener('click',()=>{
      const i=Number(btn.dataset.tbpCheck),q=qs[i],input=$(`[data-tbp-input="${i}"]`,box),val=input?.value??'';
      const ok=correct(q,val),card=$(`[data-tbp-question="${i}"]`,box),feedback=$(`[data-tbp-feedback="${i}"]`,box);
      record(n,i,val,ok);
      card?.classList.toggle('is-correct',ok); card?.classList.toggle('is-incorrect',!ok);
      if(feedback){feedback.className=`tbp-feedback ${ok?'correct':'incorrect'}`;feedback.innerHTML=ok?`<strong>${esc(tr(['Correct','正确']))}</strong><span>${esc(tr(q.why))}</span>`:`<strong>${esc(tr(['Not yet','还没答对']))}</strong><span>${esc(tr(['Use the hint, check the physics and try again.','查看提示，重新检查物理过程后再试一次。']))}</span>`;}
      const total=qs.reduce((a,_,j)=>a+(state[n]?.correct?.[j]?1:0),0), score=$('[data-tbp-score]',box);
      if(score)score.innerHTML=`<strong>${total}/${qs.length}</strong><span>${esc(tr(['correct','答对']))}</span>`;
    }));
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;render()})};
  function init(){
    const panel=$('#lessonPanel');if(!panel){setTimeout(init,100);return;}
    new MutationObserver(schedule).observe(panel,{subtree:true,childList:true});
    document.addEventListener('click',e=>{if(e.target.closest('[data-seq-stage],[data-seq-lesson],[data-lesson-view]'))setTimeout(schedule,30)});
    window.addEventListener('particlelab:languagechange',()=>setTimeout(()=>{const ch=$('.textbook-full-chapter');if(ch)delete ch.dataset.activePracticeLesson;schedule()},40));
    schedule();
  }

  window.PARTICLELAB_TEXTBOOK_ACTIVE_PRACTICE={bank,store:STORE};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
