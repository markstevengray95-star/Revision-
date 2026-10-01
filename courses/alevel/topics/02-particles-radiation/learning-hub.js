
(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const HUBSTORE='particleLearningHubV1';

  let hubState={language:'en',teacher:false,lock:false,hideAnswers:false,a11y:{contrast:false,large:false,reduced:false,colorblind:false}};
  try{hubState={...hubState,...JSON.parse(localStorage.getItem(HUBSTORE)||'{}')}}catch{}
  const save=()=>localStorage.setItem(HUBSTORE,JSON.stringify(hubState));
  const currentSim=()=>window.PARTICLELAB_CORE?.getCurrentSim?.()||$('#simNav .sim-tab.active')?.dataset.sim||'atom';

  const challengeData={
    atom:[
      {title:'Build carbon-14',text:'Create a neutral ¹⁴₆C atom.',check:()=>{const a=window.PARTICLELAB_ATOM_STATE||{};return a.Z===6&&a.A===14&&a.electrons===6;},hint:'Carbon has Z = 6. For A = 14, neutrons = 8. Neutral means 6 electrons.'},
      {title:'Build sodium-23',text:'Create a neutral ²³₁₁Na atom.',check:()=>{const a=window.PARTICLELAB_ATOM_STATE||{};return a.Z===11&&a.A===23&&a.electrons===11;},hint:'Z = 11, A = 23; neutral means electrons = protons.'},
      {title:'Make sodium +1',text:'Turn your sodium-23 atom into Na⁺ without changing the nucleus.',check:()=>{const a=window.PARTICLELAB_ATOM_STATE||{};return a.Z===11&&a.A===23&&a.electrons===10;},hint:'An ion changes electron number, not proton or neutron number.'},
      {title:'Build chloride ion',text:'Create ³⁷₁₇Cl⁻.',check:()=>{const a=window.PARTICLELAB_ATOM_STATE||{};return a.Z===17&&a.A===37&&a.electrons===18;},hint:'Cl has 17 protons. A − Z = 20 neutrons. A −1 charge means one extra electron.'}
    ],
    specific:[
      {title:'Make a positive ion',text:'Create a particle with fewer electrons than protons so its specific charge is positive.',check:()=>+($('#scE')?.value||0)<+($('#scZ')?.value||0),hint:'Remove electrons so Ne < Z.'}
    ],
    strong:[
      {title:'Find the attractive region',text:'Set the nucleon separation so the strong force is attractive.',check:()=>{const d=+($('#sep')?.value||0)/100;return d>=.5&&d<=3;},hint:'Use a separation between about 0.5 fm and 3 fm.'}
    ],
    decay:[
      {title:'Choose β⁻ decay',text:'Select beta-minus and identify the daughter change.',check:()=>$('#decayMode')?.value==='bm',hint:'β⁻ keeps A constant and increases Z by 1.'}
    ],
    antimatter:[
      {title:'Show annihilation',text:'Run the electron–positron annihilation process.',check:()=>$('#antiMode')?.value==='ann',hint:'Choose e⁻ + e⁺ → γ + γ.'}
    ],
    interactions:[
      {title:'Weak interaction',text:'Select a weak process that uses a W boson.',check:()=>['bm','bp','capture','ep'].includes($('#intMode')?.value),hint:'Beta decay, electron capture and e–p interactions use W exchange.'}
    ],
    classification:[
      {title:'Find the hadrons',text:'Select or highlight a hadron family in the classification model.',check:()=>/had|bary|mes/i.test($('#fam')?.value||''),hint:'Baryons and mesons are hadrons.'}
    ],
    quarks:[
      {title:'Build a baryon',text:'Choose a proton or neutron and explain why B = +1.',check:()=>['p','n'].includes($('#had')?.value),hint:'Three quarks each contribute B = +1/3.'}
    ],
    photo:[
      {title:'Cross the threshold',text:'Adjust frequency until photoelectrons are emitted.',check:()=>{const f=+($('#pf')?.value||0)*1e14,phi=+($('#pphi')?.value||2.3);return 6.62607015e-34*f/1.602176634e-19>=phi;},hint:'You need hf ≥ φ.'}
    ],
    collisions:[
      {title:'Cause excitation',text:'Set the incident electron energy high enough for excitation but below ionisation.',check:()=>{const E=+($('#ce')?.value||0),vals=($('#ct')?.value||'10.2,13.6').split(',').map(Number);return E>=vals[0]&&E<vals[1];},hint:'Match or exceed the first excitation gap, but stay below ionisation energy.'}
    ],
    levels:[
      {title:'Emit a photon',text:'Choose a downward energy-level transition.',check:()=>!!$('#tr')?.value,hint:'Any listed downward transition emits a photon of energy ΔE.'}
    ],
    diffraction:[
      {title:'Shorten the wavelength',text:'Increase the accelerating voltage so the electron wavelength falls.',check:()=>+($('#dv')?.value||0)>=500,hint:'Higher voltage → greater p → shorter λ.'}
    ],
    rutherford:[
      {title:'Create a large deflection',text:'Set a small impact parameter so the scattering angle becomes large.',check:()=>+($('#rb')?.value||999)<=40,hint:'Smaller b means a closer approach and stronger Coulomb repulsion.'}
    ]
  };

  const history=[
    {year:'1897–1904',name:'Thomson model',summary:'Electrons were known, so atoms were modelled as negative electrons embedded in diffuse positive charge.',evidence:'Cathode-ray experiments established the electron.',change:'It explained neutrality but not later alpha-scattering results.'},
    {year:'1909–1911',name:'Rutherford nuclear model',summary:'Most of the atom is empty space with positive charge and most mass in a tiny nucleus.',evidence:'Most alpha particles passed straight through; a few were strongly deflected.',change:'Diffuse positive charge could not explain rare large-angle scattering.'},
    {year:'1913',name:'Bohr energy-level model',summary:'Electrons were assigned discrete allowed energies.',evidence:'Atomic line spectra contain only particular photon energies.',change:'Discrete levels explained spectral lines better than classical continuous energies.'},
    {year:'Modern',name:'Quantum model',summary:'Electrons are described by quantum states and probability distributions rather than fixed classical paths.',evidence:'Spectra, diffraction and wave–particle duality require quantum ideas.',change:'The model reflects the limits of classical particle-orbit pictures.'}
  ];

  const feynmanTasks={
    betaMinus:{label:'β⁻ decay',incoming:['n'],exchange:['W⁻'],outgoing:['p','e⁻','ν̄ₑ'],explain:'At quark level d → u + W⁻, then W⁻ → e⁻ + ν̄ₑ.'},
    betaPlus:{label:'β⁺ decay',incoming:['p'],exchange:['W⁺'],outgoing:['n','e⁺','νₑ'],explain:'At quark level u → d + W⁺, then W⁺ → e⁺ + νₑ.'},
    capture:{label:'Electron capture',incoming:['p','e⁻'],exchange:['W⁺'],outgoing:['n','νₑ'],explain:'A proton and electron interact through the weak interaction to produce a neutron and electron neutrino.'},
    em:{label:'Electromagnetic scattering',incoming:['e⁻','p'],exchange:['γ*'],outgoing:['e⁻','p'],explain:'A virtual photon represents electromagnetic exchange.'}
  };

  const phraseZH={
    'Particles & Radiation Learning Lab':'粒子与辐射学习实验室',
    'AQA A-level Physics 7408 · complete section 3.2 · Year 12 guided learning':'AQA A-level 物理 7408 · 3.2 粒子与辐射 · 12年级引导学习',
    'AQA linked':'对应 AQA',
    '3D simulations':'3D 模拟',
    'Guided mode':'引导模式',
    'Guided course':'引导课程',
    'Simulation lab':'模拟实验室',
    'Topic map':'主题地图',
    'Particle atlas':'粒子图鉴',
    'Conservation':'守恒定律',
    'Formula coach':'公式辅导',
    'Practice quiz':'练习测验',
    'AQA checklist':'AQA 清单',
    'Interactive learning':'互动学习',
    'Drag the model to rotate it. Use the controls to change the physics and watch what changes.':'拖动模型进行旋转。使用控制项改变物理条件并观察变化。',
    'Rotate':'旋转',
    'Reset view':'重置视图',
    'Pause motion':'暂停动画',
    'Resume motion':'继续动画',
    'In simple words':'简单解释',
    'Say it like this in an exam':'考试答题表述',
    'Common mistake':'常见错误',
    'Quick check':'快速检查',
    'Model key':'模型图例',
    'What the colours and objects mean':'颜色和对象的含义',
    'What am I looking at?':'我正在看什么？',
    'Click an item to explain it':'点击项目查看解释',
    'Interactive 3D model':'互动 3D 模型',
    'Focus':'重点',
    'Change':'改变',
    'Watch for':'观察',
    'Particle inspector':'粒子检查器',
    'Compare':'对比',
    'Graphs':'图像',
    'Measure':'测量',
    'Practical':'实验探究',
    'Exam':'考试题',
    'Start guided course':'开始引导课程',
    'Explore simulations':'探索模拟',
    'Your topic progress':'主题进度',
    'Reset my progress':'重置进度',
    'English':'英语',
    'Mandarin':'中文',
    'Teacher mode':'教师模式',
    'Presentation mode':'演示模式',
    'Accessibility':'无障碍设置',
    'History':'原子模型历史',
    'Mastery map':'掌握度地图',
    'Scenario challenges':'情境挑战',
    'Interaction builder':'相互作用构建器',
    'Language':'语言',
    'Particle':'粒子',
    'Proton':'质子',
    'Neutron':'中子',
    'Electron':'电子',
    'Photon':'光子',
    'Positron':'正电子',
    'Neutrino':'中微子',
    'Nucleus':'原子核',
    'Alpha particle':'α 粒子',
    'Quark':'夸克',
    'Antiparticle':'反粒子',
    'Charge':'电荷',
    'Mass':'质量',
    'Rest energy':'静止能量',
    'Family':'粒子类别',
    'Baryon number':'重子数',
    'Lepton number':'轻子数',
    'Quark structure':'夸克结构',
    'Exam link':'考试联系',
    'Science':'物理原理',
    'Correct.':'正确。',
    'Not quite.':'不完全正确。',
    'Show tools':'显示测量工具',
    'Hide tools':'隐藏测量工具',
    'Start stopwatch':'开始秒表',
    'Pause stopwatch':'暂停秒表',
    'Reset':'重置',
    'Reveal answer':'显示答案',
    'I could do this':'我会做',
    'I need practice':'我需要练习',
    'Open simulation':'打开模拟'
  };

  const dynamicZH=[
    [/^(\d+) flashcards due$/,m=>m.match(/\d+/)[0]+' 张闪卡待复习'],
    [/^(\d+) cards due$/,m=>m.match(/\d+/)[0]+' 张卡片待复习'],
    [/^(\d+)% current evidence$/,m=>m.match(/\d+/)[0]+'% 当前掌握证据'],
    [/^(\d+) question\(s\) added to the error log\.$/,m=>m.match(/\d+/)[0]+' 道题已加入错题记录。'],
    [/^(\d+) min$/,m=>m.match(/\d+/)[0]+' 分钟'],
    [/^Lesson (\d+)$/,m=>'第 '+m.match(/\d+/)[0]+' 课'],
    [/^Open (.+) simulation$/,m=>'打开 '+m.replace(/^Open | simulation$/g,'')+' 模拟'],
    [/^(\d+) \/ (\d+) specification points checked · (\d+) logged errors\.$/,m=>{const x=m.match(/\d+/g);return x[0]+' / '+x[1]+' 个规格点已检查 · '+x[2]+' 个错误已记录。';}],
    [/^Selected isotope: Z = (\d+), A = (\d+), neutrons = (\d+)\.$/,m=>{const x=m.match(/\d+/g);return '已选同位素：Z = '+x[0]+'，A = '+x[1]+'，中子数 = '+x[2]+'。';}],
    [/^Net charge = ([^;]+); specific charge ≈ ([^ ]+) C kg⁻¹\.$/,m=>{const x=m.match(/^Net charge = ([^;]+); specific charge ≈ ([^ ]+)/);return '净电荷 = '+x[1]+'；比荷 ≈ '+x[2]+' C kg⁻¹。';}],
    [/^Nucleon separation = ([\d.]+) fm, so the strong force is currently (repulsive|attractive|negligible)\.$/,m=>{const x=m.match(/^Nucleon separation = ([\d.]+) fm, so the strong force is currently (.+)\.$/);const st={repulsive:'排斥',attractive:'吸引',negligible:'可忽略'}[x[2]]||x[2];return '核子间距 = '+x[1]+' fm，因此当前强核力为'+st+'。';}],
    [/^Selected interaction: (.+)\.$/,m=>'已选相互作用：'+m.replace(/^Selected interaction: |\.$/g,'').replace('electromagnetic virtual-photon exchange','电磁虚光子交换').replace('beta-minus weak interaction','β⁻ 弱相互作用').replace('beta-plus weak interaction','β⁺ 弱相互作用').replace('electron capture','电子俘获').replace('electron–proton collision','电子—质子碰撞')+'。'],
    [/^Highlighted family: (.+)\. Use the Model guide to compare groups\.$/,m=>'高亮粒子家族：'+m.match(/^Highlighted family: (.+)\./)[1]+'。使用模型指南比较各组。'],
    [/^Selected hadron: (.+)\. Add the quark quantum numbers to check the totals\.$/,m=>'已选强子：'+m.match(/^Selected hadron: (.+)\./)[1]+'。将夸克量子数相加以检查总量。'],
    [/^Photon energy ([\d.]+) eV exceeds φ = ([\d.]+) eV; photoemission occurs with KEmax = ([\d.]+) eV\.$/,m=>{const x=m.match(/[\d.]+/g);return '光子能量 '+x[0]+' eV 大于 φ = '+x[1]+' eV；发生光电子发射，KEmax = '+x[2]+' eV。';}],
    [/^Photon energy ([\d.]+) eV is below φ = ([\d.]+) eV; no photoemission occurs\.$/,m=>{const x=m.match(/[\d.]+/g);return '光子能量 '+x[0]+' eV 小于 φ = '+x[1]+' eV；不发生光电子发射。';}],
  ];

  const termZH=[
    [/\bmass number\b/gi,'核子数'],[/\bproton number\b/gi,'质子数'],[/\bneutron number\b/gi,'中子数'],
    [/\bnucleon number\b/gi,'核子数'],[/\blight intensity\b/gi,'光强'],[/\bincident electron energy\b/gi,'入射电子能量'],
    [/\belectron accelerating voltage\b/gi,'电子加速电压'],[/\bnuclear charge\b/gi,'核电荷'],
    [/\bDiagnostic\s*&\s*lesson hub\b/gi,'诊断与课程中心'],
    [/\bRevision Hub\b/gi,'复习中心'],[/\bPractice Studio\b/gi,'练习工作室'],[/\bExam Skills\b/gi,'考试技巧'],
    [/\bStart Here\b/gi,'从这里开始'],[/\bEvidence Lab\b/gi,'证据实验室'],[/\bGlossary\b/gi,'词汇表'],
    [/\bDiagnostic\s*&\s*lessons\b/gi,'诊断与课程'],[/\bLearning tools\b/gi,'学习工具'],[/\bSimulation lab\b/gi,'模拟实验室'],
    [/\bParticle atlas\b/gi,'粒子图鉴'],[/\bFormula coach\b/gi,'公式辅导'],[/\bPractice quiz\b/gi,'练习测验'],
    [/\bTopic map\b/gi,'主题地图'],[/\bGuided course\b/gi,'引导课程'],[/\bAQA checklist\b/gi,'AQA 清单'],
    [/\bphotoelectric effect\b/gi,'光电效应'],[/\bwork function\b/gi,'逸出功'],[/\bthreshold frequency\b/gi,'截止频率'],
    [/\bstopping potential\b/gi,'遏止电势'],[/\benergy levels?\b/gi,'能级'],[/\bwave.?particle duality\b/gi,'波粒二象性'],
    [/\bde Broglie wavelength\b/gi,'德布罗意波长'],[/\bstrong nuclear force\b/gi,'强核力'],[/\bstrong interaction\b/gi,'强相互作用'],
    [/\bweak interaction\b/gi,'弱相互作用'],[/\belectromagnetic interaction\b/gi,'电磁相互作用'],[/\bexchange particle\b/gi,'交换粒子'],
    [/\bpair production\b/gi,'对产生'],[/\bannihilation\b/gi,'湮灭'],[/\bexcitation\b/gi,'激发'],[/\bionisation\b/gi,'电离'],
    [/\bscattering angle\b/gi,'散射角'],[/\bimpact parameter\b/gi,'碰撞参数'],[/\bdiffraction\b/gi,'衍射'],
    [/\bhadron\b/gi,'强子'],[/\bbaryon\b/gi,'重子'],[/\bmeson\b/gi,'介子'],[/\blepton\b/gi,'轻子'],[/\bstrangeness\b/gi,'奇异数'],
    [/\bprotons?\b/gi,'质子'],[/\bneutrons?\b/gi,'中子'],[/\belectrons?\b/gi,'电子'],[/\bpositrons?\b/gi,'正电子'],[/\bphotons?\b/gi,'光子'],
    [/\bneutrino\b/gi,'中微子'],[/\bnucleus\b/gi,'原子核'],[/\bquark\b/gi,'夸克'],[/\bantiquark\b/gi,'反夸克']
  ];

  const originals=new WeakMap();
  const attrOriginals=new WeakMap();
  let translating=false;

  function translateString(text){
    const trimmed=text.trim();
    if(!trimmed)return text;
    const external=window.PARTICLELAB_MANDARIN_LESSONS?.ui?.[trimmed];
    if(external){
      const lead=text.match(/^\s*/)?.[0]||'',tail=text.match(/\s*$/)?.[0]||'';
      return lead+external+tail;
    }
    const globalExact=window.PARTICLELAB_MANDARIN_GLOBAL?.[trimmed];
    if(globalExact){
      const lead=text.match(/^\s*/)?.[0]||'',tail=text.match(/\s*$/)?.[0]||'';
      return lead+globalExact+tail;
    }
    for(const [re,replace] of dynamicZH){
      if(re.test(trimmed)){
        re.lastIndex=0;
        const lead=text.match(/^\s*/)?.[0]||'',tail=text.match(/\s*$/)?.[0]||'';
        return lead+trimmed.replace(re,replace)+tail;
      }
      re.lastIndex=0;
    }
    if(phraseZH[trimmed]){
      const lead=text.match(/^\s*/)?.[0]||'',tail=text.match(/\s*$/)?.[0]||'';
      return lead+phraseZH[trimmed]+tail;
    }
    let out=text;
    for(const [re,to] of termZH)out=out.replace(re,to);
    return out;
  }

  function translateAttributes(root,lang){
    const nodes=[root,...(root?.querySelectorAll?.('[placeholder],[title],[aria-label]')||[])].filter(Boolean);
    for(const el of nodes){
      if(!el?.getAttribute)continue;
      let saved=attrOriginals.get(el);
      if(!saved){saved={};attrOriginals.set(el,saved);}
      for(const attr of ['placeholder','title','aria-label']){
        const current=el.getAttribute(attr);
        if(current==null)continue;
        if(saved[attr]==null)saved[attr]=current;
        el.setAttribute(attr,lang==='zh'?translateString(saved[attr]):saved[attr]);
      }
    }
  }

  function setLanguage(lang){
    hubState.language=lang;save();
    document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    translating=true;
    const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:n=>{
      if(!n.nodeValue?.trim())return NodeFilter.FILTER_REJECT;
      if(['SCRIPT','STYLE','TEXTAREA'].includes(n.parentElement?.tagName))return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }});
    let n;while((n=walker.nextNode())){
      if(lang==='zh'){
        if(!originals.has(n))originals.set(n,n.nodeValue);
        n.nodeValue=translateString(originals.get(n));
      }else if(originals.has(n)){
        n.nodeValue=originals.get(n);
      }
    }
    translateAttributes(document.body,lang);
    translating=false;
    window.PARTICLELAB_LANGUAGE_STATE=lang;
    renderLanguageButtons();
    window.dispatchEvent(new CustomEvent('particlelab:languagechange',{detail:{language:lang}}));
  }

  function translateNewNode(node){
    if(hubState.language!=='zh'||translating)return;
    const walker=document.createTreeWalker(node,NodeFilter.SHOW_TEXT);
    let n;while((n=walker.nextNode())){
      if(!n.nodeValue?.trim()||['SCRIPT','STYLE','TEXTAREA'].includes(n.parentElement?.tagName))continue;
      if(!originals.has(n))originals.set(n,n.nodeValue);
      n.nodeValue=translateString(originals.get(n));
    }
    translateAttributes(node,'zh');
  }

  function injectHub(){
    if($('#view-learninghub'))return;
    const nav=$('.main-nav'),main=$('main.main');
    if(!nav||!main)return;

    const navBtn=document.createElement('button');
    navBtn.className='nav-button';navBtn.dataset.view='learninghub';navBtn.textContent='Learning tools';
    nav.appendChild(navBtn);

    const view=document.createElement('section');
    view.id='view-learninghub';view.className='view';
    view.innerHTML='<div class="section-head"><div><span class="eyebrow">Personalise · teach · review</span><h2>Learning tools</h2></div><p class="subtle">Mastery, class controls, challenges, particle interactions, history, accessibility and language.</p></div>'+
      '<div class="hub-shell"><div class="hub-tabs">'+
      [['mastery','Mastery map'],['teacher','Teacher mode'],['challenge','Scenario challenges'],['feynman','Interaction builder'],['history','History'],['access','Accessibility'],['language','Language']].map((x,i)=>'<button data-hub="'+x[0]+'" class="'+(i===0?'active':'')+'">'+x[1]+'</button>').join('')+
      '</div>'+
      ['mastery','teacher','challenge','feynman','history','access','language'].map((id,i)=>'<div id="hub-'+id+'" class="hub-panel '+(i===0?'active':'')+'"></div>').join('')+'</div>';
    main.appendChild(view);

    navBtn.addEventListener('click',()=>{$$('.view').forEach(v=>v.classList.toggle('active-view',v===view));$$('.nav-button').forEach(b=>b.classList.toggle('active',b===navBtn));renderHub();});
    $$('.hub-tabs [data-hub]',view).forEach(b=>b.onclick=()=>{$$('.hub-tabs button',view).forEach(x=>x.classList.toggle('active',x===b));$$('.hub-panel',view).forEach(p=>p.classList.toggle('active',p.id==='hub-'+b.dataset.hub));renderHubPanel(b.dataset.hub);});

    const banner=document.createElement('div');banner.className='teacher-banner';banner.innerHTML='<strong>Teacher mode</strong><span id="teacherChallengeBanner"></span><button class="button" id="teacherExit">Exit</button>';document.body.appendChild(banner);
    $('#teacherExit').onclick=()=>{hubState.teacher=false;applyTeacher();save();};

    renderHub();
    applyTeacher();applyA11y();
    installTranslationObserver();
    setTimeout(()=>setLanguage(hubState.language),300);
  }

  function renderHub(){['mastery','teacher','challenge','feynman','history','access','language'].forEach(renderHubPanel);}
  function renderHubPanel(id){
    if(id==='mastery')renderMastery();
    if(id==='teacher')renderTeacher();
    if(id==='challenge')renderChallenges();
    if(id==='feynman')renderFeynman();
    if(id==='history')renderHistory();
    if(id==='access')renderAccess();
    if(id==='language')renderLanguage();
  }

  function renderMastery(){
    const h=$('#hub-mastery');if(!h)return;
    let tools={usage:{},exam:{}};try{tools=JSON.parse(localStorage.getItem('particleLearningToolsV1')||'{}')}catch{}
    let spec={};try{spec=JSON.parse(localStorage.getItem('particleSpecMasteryV3')||'{}')}catch{}
    const sims=['atom','specific','strong','decay','antimatter','interactions','classification','quarks','photo','collisions','levels','diffraction','rutherford'];
    const names={atom:'Atomic structure',specific:'Specific charge',strong:'Nuclear force',decay:'Decay',antimatter:'Antimatter',interactions:'Interactions',classification:'Particle families',quarks:'Quarks',photo:'Photoelectric effect',collisions:'Electron collisions',levels:'Energy levels',diffraction:'Electron diffraction',rutherford:'Rutherford'};
    h.innerHTML='<div class="hub-card"><span class="eyebrow">Adaptive overview</span><h3>Mastery map</h3><p>Green means strong evidence of secure practice; amber means developing; red means little evidence yet. It combines simulation use, exam self-assessment and AQA checklist activity stored on this device.</p></div><div class="mastery-map" style="margin-top:8px">'+
      sims.map(sim=>{const usage=Math.min(35,(tools.usage?.[sim]||0)*7),exam=Object.entries(tools.exam||{}).filter(([k,v])=>k.startsWith(sim+':')&&v==='secure').length*18,specScore=Math.min(25,Object.values(spec).filter(Boolean).length/4);const score=Math.min(100,Math.round(usage+exam+specScore));return '<button class="mastery-node" data-master-sim="'+sim+'"><strong>'+names[sim]+'</strong><span>'+score+'% evidence</span><div class="mastery-bar"><div class="mastery-fill" style="width:'+score+'%"></div></div></button>';}).join('')+'</div>';
    $$('[data-master-sim]',h).forEach(b=>b.onclick=()=>openSim(b.dataset.masterSim));
  }

  function renderTeacher(){
    const h=$('#hub-teacher');if(!h)return;
    const sims=['atom','specific','strong','decay','antimatter','interactions','classification','quarks','photo','collisions','levels','diffraction','rutherford'];
    h.innerHTML='<div class="hub-card"><span class="eyebrow">Classroom control</span><h3>Teacher mode</h3><p>Launch a model, lock controls, hide revealed answers, set a class challenge or switch to large presentation mode.</p></div>'+
      '<div class="teacher-grid" style="margin-top:8px">'+
      '<div class="teacher-control"><label>Launch simulation</label><select id="teacherSim">'+sims.map(x=>'<option>'+x+'</option>').join('')+'</select><button class="button" id="teacherLaunch" style="margin-top:6px">Launch</button></div>'+
      '<div class="teacher-control"><label>Class challenge</label><input id="teacherChallenge" type="text" placeholder="e.g. Explain why increasing intensity does not increase photon energy"><button class="button" id="teacherSetChallenge" style="margin-top:6px">Show challenge</button></div>'+
      '<div class="teacher-control"><label><input id="teacherLock" type="checkbox" '+(hubState.lock?'checked':'')+'> Lock simulation controls</label><label><input id="teacherHide" type="checkbox" '+(hubState.hideAnswers?'checked':'')+'> Hide revealed answers</label></div>'+
      '<div class="teacher-control"><label>Display</label><div class="lt-actions"><button class="button" id="teacherToggle">'+(hubState.teacher?'Exit teacher mode':'Enter teacher mode')+'</button><button class="button" id="teacherPresent">Presentation mode</button></div></div></div>';
    $('#teacherLaunch').onclick=()=>openSim($('#teacherSim').value);
    $('#teacherSetChallenge').onclick=()=>{$('#teacherChallengeBanner').textContent=$('#teacherChallenge').value;hubState.teacher=true;applyTeacher();save();};
    $('#teacherLock').onchange=e=>{hubState.lock=e.target.checked;applyTeacher();save();};
    $('#teacherHide').onchange=e=>{hubState.hideAnswers=e.target.checked;applyTeacher();save();};
    $('#teacherToggle').onclick=()=>{hubState.teacher=!hubState.teacher;applyTeacher();save();renderTeacher();};
    $('#teacherPresent').onclick=()=>{document.body.classList.toggle('presentation-mode');openSim(currentSim());};
  }
  function applyTeacher(){document.body.classList.toggle('teacher-mode',hubState.teacher);document.body.classList.toggle('lock-sim',hubState.lock);document.body.classList.toggle('hide-answers',hubState.hideAnswers);}

  function renderChallenges(){
    const h=$('#hub-challenge');if(!h)return;
    const sim=currentSim(),items=challengeData[sim]||[];
    h.innerHTML='<div class="hub-card"><span class="eyebrow">Apply the model</span><h3>Scenario challenges · '+sim+'</h3><p>Change the real simulation controls, then check whether you have met the target.</p></div><div class="challenge-list" style="margin-top:8px">'+items.map((c,i)=>'<div class="challenge-card"><h4>'+c.title+'</h4><p>'+c.text+'</p><div class="lt-actions"><button class="button" data-ch-check="'+i+'">Check setup</button><button class="button" data-ch-hint="'+i+'">Hint</button></div><div class="challenge-status" id="chStatus'+i+'"></div></div>').join('')+'</div>';
    $$('[data-ch-check]',h).forEach(b=>b.onclick=()=>{const c=items[+b.dataset.chCheck],ok=c.check();$('#chStatus'+b.dataset.chCheck).textContent=ok?'✓ Challenge met.':'Not yet — adjust the simulation and try again.';if(ok)window.PARTICLELAB_SOUND?.cue?.('correct');});
    $$('[data-ch-hint]',h).forEach(b=>b.onclick=()=>$('#chStatus'+b.dataset.chHint).textContent=items[+b.dataset.chHint].hint);
  }

  function renderFeynman(){
    const h=$('#hub-feynman');if(!h)return;
    h.innerHTML='<div class="hub-card"><span class="eyebrow">Construct the process</span><h3>Interactive particle-interaction builder</h3><p>Drag particles into incoming, exchange and outgoing slots, then check conservation and the expected interaction.</p></div>'+
      '<div class="feynman-builder" style="margin-top:8px"><div class="hub-card"><label class="field"><span>Target process</span><select id="fTask">'+Object.entries(feynmanTasks).map(([k,v])=>'<option value="'+k+'">'+v.label+'</option>').join('')+'</select></label><div class="particle-bank" id="fBank"></div></div>'+
      '<div class="hub-card"><div class="f-slots"><div class="f-slot" data-fslot="incoming"><strong>Incoming</strong></div><div class="f-vertex">→</div><div class="f-slot" data-fslot="outgoing"><strong>Outgoing</strong></div></div><div class="f-slot" data-fslot="exchange" style="margin-top:8px;min-height:76px"><strong>Exchange particle</strong></div><div class="lt-actions"><button class="button primary" id="fCheck">Check process</button><button class="button" id="fClear">Clear</button></div><div id="fFeedback" class="challenge-status"></div></div></div>';
    const bank=['n','p','e⁻','e⁺','νₑ','ν̄ₑ','W⁻','W⁺','γ*'];
    const bankEl=$('#fBank');bankEl.innerHTML=bank.map(x=>'<div class="f-particle" draggable="true" data-p="'+x+'">'+x+'</div>').join('');
    $$('.f-particle',bankEl).forEach(p=>p.ondragstart=e=>e.dataTransfer.setData('text/plain',p.dataset.p));
    $$('.f-slot',h).forEach(slot=>{slot.ondragover=e=>e.preventDefault();slot.ondrop=e=>{e.preventDefault();const p=e.dataTransfer.getData('text/plain');const chip=document.createElement('span');chip.className='f-particle';chip.dataset.p=p;chip.textContent=p;chip.onclick=()=>chip.remove();slot.appendChild(chip);};});
    $('#fCheck').onclick=checkFeynman;$('#fClear').onclick=()=>{$$('.f-slot .f-particle',h).forEach(x=>x.remove());$('#fFeedback').textContent='';};
  }
  function checkFeynman(){
    const t=feynmanTasks[$('#fTask').value],got={};['incoming','exchange','outgoing'].forEach(k=>got[k]=$$('[data-fslot="'+k+'"] .f-particle').map(x=>x.dataset.p).sort());
    const same=(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort());
    const ok=same(got.incoming,t.incoming)&&same(got.exchange,t.exchange)&&same(got.outgoing,t.outgoing);
    $('#fFeedback').innerHTML=ok?'✓ Correct. '+t.explain:'Not yet. Check the incoming particles, exchange particle and outgoing products.';
    window.PARTICLELAB_SOUND?.cue?.(ok?'correct':'wrong');
  }

  function renderHistory(){
    const h=$('#hub-history');if(!h)return;
    h.innerHTML='<div class="hub-card"><span class="eyebrow">Evidence changes models</span><h3>Atomic-model timeline</h3><p>Use the evidence to see why each model replaced or extended the previous one.</p></div><div class="history-line" style="margin-top:8px">'+history.map((x,i)=>'<button class="history-step '+(i===1?'active':'')+'" data-hist="'+i+'"><span>'+x.year+'</span><h4>'+x.name+'</h4><p>'+x.summary+'</p></button>').join('')+'</div><div id="historyDetail" class="hub-card" style="margin-top:8px"></div>';
    $$('[data-hist]',h).forEach(b=>b.onclick=()=>{const i=+b.dataset.hist;$$('[data-hist]',h).forEach(x=>x.classList.toggle('active',x===b));showHistory(i);});showHistory(1);
  }
  function showHistory(i){const d=history[i],box=$('#historyDetail');if(box)box.innerHTML='<h3>'+d.name+'</h3><p><strong>Evidence:</strong> '+d.evidence+'</p><p><strong>Why the model changed:</strong> '+d.change+'</p>';}

  function renderAccess(){
    const h=$('#hub-access');if(!h)return;
    h.innerHTML='<div class="hub-card"><span class="eyebrow">Make the app easier to use</span><h3>Accessibility controls</h3></div><div class="a11y-grid" style="margin-top:8px">'+
      toggleRow('High contrast','contrast',hubState.a11y.contrast)+toggleRow('Larger text','large',hubState.a11y.large)+toggleRow('Reduced motion','reduced',hubState.a11y.reduced)+toggleRow('Colour-blind safer accent palette','colorblind',hubState.a11y.colorblind)+
      '<div class="a11y-row"><span>Keyboard</span><span class="small subtle">Tab through controls · Enter/Space activates buttons · arrow keys change sliders</span></div>'+
      '<div class="a11y-row"><span>Sound captions</span><span class="small subtle">All sound cues are supplementary; the visible physics explanation remains primary.</span></div></div>';
    $$('[data-a11y]',h).forEach(x=>x.onchange=()=>{hubState.a11y[x.dataset.a11y]=x.checked;save();applyA11y();});
  }
  function toggleRow(label,key,on){return '<label class="a11y-row"><span>'+label+'</span><input type="checkbox" data-a11y="'+key+'" '+(on?'checked':'')+'></label>';}
  function applyA11y(){document.body.classList.toggle('high-contrast',!!hubState.a11y.contrast);document.body.classList.toggle('large-text',!!hubState.a11y.large);document.body.classList.toggle('reduced-motion',!!hubState.a11y.reduced);document.body.classList.toggle('colorblind-safe',!!hubState.a11y.colorblind);}

  function renderLanguage(){
    const h=$('#hub-language');if(!h)return;
    h.innerHTML='<div class="hub-card"><span class="eyebrow">Bilingual mode</span><h3>Language</h3><p>Switch the interface between English and Mandarin Chinese. Physics symbols and equations are kept unchanged.</p><div class="lang-switch" style="margin-top:8px"><button data-lang="en">English</button><button data-lang="zh">中文 / Mandarin</button></div><p class="small subtle" style="margin-top:8px">Mandarin mode translates the app interface and core physics terminology locally in the browser, so it does not require an online translation service.</p></div>';
    $$('[data-lang]',h).forEach(b=>b.onclick=()=>setLanguage(b.dataset.lang));renderLanguageButtons();
  }
  function renderLanguageButtons(){$$('[data-lang]').forEach(b=>b.classList.toggle('active',b.dataset.lang===hubState.language));}

  function installTranslationObserver(){
    new MutationObserver(ms=>{
      if(hubState.language!=='zh'||translating)return;
      for(const m of ms){
        for(const n of m.addedNodes){
          if(n.nodeType===1){
            translateNewNode(n);
          }else if(n.nodeType===3&&n.nodeValue?.trim()){
            if(['SCRIPT','STYLE','TEXTAREA'].includes(n.parentElement?.tagName))continue;
            if(!originals.has(n))originals.set(n,n.nodeValue);
            n.nodeValue=translateString(originals.get(n));
          }
        }
      }
    }).observe(document.body,{childList:true,subtree:true});
  }

  function openSim(id){
    $('[data-view="lab"]')?.click();
    setTimeout(()=>document.querySelector('.sim-tab[data-sim="'+id+'"]')?.click(),60);
  }

  window.PARTICLELAB_LANGUAGE={
    get:()=>hubState.language,
    set:setLanguage,
    translate:translateString
  };

  function init(){
    injectHub();
    $('#simNav')?.addEventListener('click',()=>setTimeout(()=>{if($('#hub-challenge.active'))renderChallenges();if($('#hub-mastery.active'))renderMastery();},100));
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,260),{once:true});else setTimeout(init,260);
})();
