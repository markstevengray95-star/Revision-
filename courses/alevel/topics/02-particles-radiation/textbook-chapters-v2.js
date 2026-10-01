(() => {
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const zh=()=>String(document.documentElement.lang||'').toLowerCase().startsWith('zh');
  const tr=(en,cn)=>zh()?cn:en;
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));

  const misconceptions={
    1:['Isotopes have the same proton number. Changing Z changes the element; changing neutron number changes the isotope.','同位素具有相同的质子数。改变 Z 会改变元素；改变中子数才会改变同位素。'],
    2:['Specific charge is the net charge of the whole particle divided by its total mass, not the charge of one proton.','比荷是整个粒子的净电荷除以总质量，而不是“一个质子的电荷”。'],
    3:['The strong nuclear force is not attractive at every separation: it is repulsive at extremely short range and negligible beyond a few femtometres.','强核力并非在所有距离都吸引：极短距离时为排斥，超过几飞米后可忽略。'],
    4:['The beta electron is created during beta decay; it is not an orbital electron that was already inside the nucleus.','β 电子是在 β 衰变过程中产生的，并不是原先存在于原子核中的轨道电子。'],
    5:['An antiparticle is not defined only by opposite charge. Neutral particles can have distinct antiparticles.','反粒子不能只用“电荷相反”定义；中性粒子也可以有不同的反粒子。'],
    6:['Pair production must satisfy momentum conservation as well as energy conservation; a nearby body can take recoil momentum.','成对产生必须同时满足能量和动量守恒；附近物体可以承担反冲动量。'],
    7:['Exchange-particle diagrams are interaction models, not photographs of tiny visible particles travelling along drawn tracks.','交换粒子图是相互作用模型，并不是微小可见粒子沿图中轨迹运动的照片。'],
    8:['Hadron and baryon are not interchangeable terms: baryons and mesons are both hadrons.','强子和重子不能互换：重子和介子都属于强子。'],
    9:['Do not reverse the strange-quark sign: s has S = −1, while anti-s has S = +1.','不要弄反奇异夸克的奇异数：s 的 S = −1，而反 s 的 S = +1。'],
    10:['Charge conservation alone does not make a particle reaction possible. Check every relevant conservation law.','仅电荷守恒不足以说明粒子反应允许；必须检查所有相关守恒定律。'],
    11:['At fixed frequency, increasing light intensity increases photon arrival rate, not the energy of each photon.','频率不变时，提高光强增加的是光子到达率，而不是单个光子的能量。'],
    12:['Excitation leaves the electron bound to the atom; ionisation removes it completely.','激发后电子仍被原子束缚；电离会把电子完全移出原子。'],
    13:['Energy-level lines show allowed energies, not literal electron paths or physical shelves inside the atom.','能级线表示允许能量，并不是电子真实运动路径或原子内部的物理“层板”。'],
    14:['Wave–particle duality does not mean an electron switches between being a classical ball and a classical water wave.','波粒二象性并不表示电子在“经典小球”和“经典水波”之间切换。'],
    15:['Synoptic questions require linked reasoning across classification, equations, interactions and conservation—not isolated memorised facts.','综合题需要把分类、方程、相互作用和守恒规律联系起来，而不是只记孤立事实。'],
    16:['Most alpha particles passing through does not mean the foil contains no matter; it means the nucleus occupies a tiny fraction of atomic volume.','大多数 α 粒子直穿并不表示金箔“没有物质”，而是说明原子核只占原子总体积的极小部分。']
  };

  const photos={
    1:{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Atom1.png',page:'https://commons.wikimedia.org/wiki/File:Atom1.png',credit:'Bensaccount / Wikimedia Commons',license:'Public domain',en:'Electron-cloud-style representation of a helium atom. The nucleus is enlarged so its structure can be seen.',cn:'氦原子的电子云式表示。原子核被放大，以便观察其内部结构。'},
    13:{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Hydrogen%20spectrum%20visible.png',page:'https://commons.wikimedia.org/wiki/File:Hydrogen_spectrum_visible.png',credit:'McZusatz / Wikimedia Commons',license:'CC0',en:'Visible hydrogen emission spectrum. The separate bright wavelengths are evidence for discrete atomic energy changes.',cn:'可见氢原子发射光谱。分立的亮线说明原子的能量变化是离散的。'},
    14:{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/ElectronDiffraction01.jpg',page:'https://commons.wikimedia.org/wiki/File:ElectronDiffraction01.jpg',credit:'And1mu / Wikimedia Commons',license:'CC BY-SA 4.0',en:'Real school electron-diffraction pattern from graphite. The rings are experimental evidence of wave-like electron behaviour.',cn:'石墨产生的真实学校电子衍射图样。环纹是电子具有波动性的实验证据。'},
    16:{src:'https://commons.wikimedia.org/wiki/Special:Redirect/file/Rutherford%20Experiment.svg',page:'https://commons.wikimedia.org/wiki/File:Rutherford_Experiment.svg',credit:'Dombob / Wikimedia Commons',license:'CC0',en:'Open-licensed Rutherford scattering apparatus diagram showing the source, gold foil and detector geometry.',cn:'开放许可的卢瑟福散射装置图，展示粒子源、金箔和探测器的几何关系。'}
  };

  const titles={
    1:['Atomic structure and nuclide notation','原子结构与核素表示法'],2:['Specific charge: charge divided by mass','比荷：电荷除以质量'],3:['Strong nuclear force vs separation','强核力随距离变化'],4:['Alpha and beta-minus decay','α 衰变与 β⁻ 衰变'],5:['Photons and particle–antiparticle pairs','光子与粒子—反粒子对'],6:['Annihilation and pair production','湮灭与成对产生'],7:['Exchange-particle interaction model','交换粒子相互作用模型'],8:['Particle classification tree','粒子分类树'],9:['Quark structure of selected hadrons','常见强子的夸克结构'],10:['Conservation-law ledger','守恒定律检查表'],11:['Photoelectric effect energy flow','光电效应能量关系'],12:['Electron collisions: excitation vs ionisation','电子碰撞：激发与电离'],13:['Energy levels, photons and line spectra','能级、光子与线状光谱'],14:['Electron diffraction and de Broglie wavelength','电子衍射与德布罗意波长'],15:['Synoptic map of Particles & Radiation','粒子与辐射综合知识图'],16:['Rutherford scattering evidence','卢瑟福散射证据']
  };

  const node=(x,y,w,h,label,cls='svg-node')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" class="${cls}"/><text x="${x+w/2}" y="${y+h/2+5}" class="svg-label" text-anchor="middle">${esc(label)}</text>`;
  const line=(x1,y1,x2,y2,cls='svg-line')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  const text=(x,y,en,cn,cls='svg-label',anchor='start')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${esc(tr(en,cn))}</text>`;
  const circ=(x,y,r,label='',cls='svg-node')=>`<circle cx="${x}" cy="${y}" r="${r}" class="${cls}"/>${label?`<text x="${x}" y="${y+5}" class="svg-label" text-anchor="middle">${esc(label)}</text>`:''}`;
  const svg=(n,body)=>{const t=titles[n]||['Physics diagram','物理图示'];return `<svg viewBox="0 0 620 300" role="img" aria-label="${esc(tr(t[0],t[1]))}">${body}</svg>`};

  function diagram(n){
    switch(n){
      case 1:return svg(n,`${circ(165,150,55,tr('nucleus','原子核'))}${circ(165,150,105,'','svg-soft')}${circ(260,115,9,'e⁻','svg-node3')}${node(370,80,170,110,tr('nuclide notation','核素表示法'),'svg-node3')}${text(455,145,'A  X','A  X','svg-equation','middle')}${text(455,175,'Z','Z','svg-equation','middle')}${text(455,220,'N = A − Z','N = A − Z','svg-equation','middle')}`);
      case 2:return svg(n,`${circ(135,130,36,'Q')}${line(210,65,210,205)}${text(300,100,'specific charge','比荷','svg-label','middle')}${text(300,140,'Q / m','Q / m','svg-equation','middle')}${text(455,105,'large |Q|','|Q| 大','svg-small','middle')}${text(455,135,'+','+','svg-label','middle')}${text(455,165,'small m','m 小','svg-small','middle')}${text(455,215,'→ large |Q/m|','→ |Q/m| 大','svg-label','middle')}`);
      case 3:return svg(n,`${line(75,245,555,245)}${line(75,245,75,50)}<path d="M85 65 C110 145 140 220 190 200 C260 170 330 150 390 190 C450 225 510 238 555 240" class="svg-line"/>${line(150,48,150,245,'svg-soft')}${line(390,48,390,245,'svg-soft')}${text(150,270,'≈0.5 fm','≈0.5 fm','svg-small','middle')}${text(390,270,'≈3 fm','≈3 fm','svg-small','middle')}${text(125,85,'repulsive','排斥','svg-label','middle')}${text(285,145,'attractive','吸引','svg-label','middle')}${text(485,210,'negligible','可忽略','svg-label','middle')}`);
      case 4:return svg(n,`${node(45,55,155,80,tr('parent nucleus','母核'),'svg-node2')}${text(122,123,'A, Z','A, Z','svg-equation','middle')}${line(205,95,335,95,'svg-accent')}${text(270,78,'α','α','svg-equation','middle')}${node(355,55,170,80,tr('daughter nucleus','子核'))}${text(440,123,'A−4, Z−2','A−4, Z−2','svg-equation','middle')}${node(45,190,155,55,'n → p','svg-node2')}${line(205,217,350,217)}${text(285,195,'β⁻','β⁻','svg-equation','middle')}${text(425,213,'e⁻ + ν̄ₑ','e⁻ + ν̄ₑ','svg-equation','middle')}${text(425,240,'A same, Z + 1','A 不变，Z + 1','svg-small','middle')}`);
      case 5:return svg(n,`${circ(110,135,30,'e⁻')}${circ(235,135,30,'e⁺','svg-node3')}${text(173,80,'same mass','质量相同','svg-label','middle')}${text(173,190,'opposite charge','电荷相反','svg-small','middle')}<path d="M355 145 q25 -48 50 0 t50 0 t50 0" class="svg-accent"/>${text(430,92,'photon','光子','svg-label','middle')}${text(430,210,'E = hf = hc/λ','E = hf = hc/λ','svg-equation','middle')}`);
      case 6:return svg(n,`${text(155,40,'annihilation','湮灭','svg-label','middle')}${circ(90,110,23,'e⁻')}${circ(220,110,23,'e⁺','svg-node3')}${line(115,110,150,110)}${line(195,110,160,110)}${line(155,120,85,185,'svg-accent')}${line(155,120,225,185,'svg-accent')}${text(70,205,'γ','γ','svg-equation','middle')}${text(240,205,'γ','γ','svg-equation','middle')}${text(460,40,'pair production','成对产生','svg-label','middle')}<path d="M350 105 q20 -38 40 0 t40 0" class="svg-accent"/>${line(430,105,485,78)}${line(430,105,485,138)}${circ(510,75,22,'e⁻')}${circ(510,142,22,'e⁺','svg-node3')}${text(455,220,'threshold 1.022 MeV','阈能 1.022 MeV','svg-small','middle')}`);
      case 7:return svg(n,`${line(85,70,255,140)}${line(85,220,255,150)}${line(365,140,535,70)}${line(365,150,535,220)}${line(255,145,365,145,'svg-warn')}${text(310,125,'γ / W','γ / W','svg-equation','middle')}${text(105,55,'incoming','入射','svg-small')}${text(470,55,'outgoing','出射','svg-small')}${text(310,195,'exchange particle','交换粒子','svg-small','middle')}`);
      case 8:return svg(n,`${node(250,25,120,45,tr('particles','粒子'),'svg-node3')}${line(310,70,180,115)}${line(310,70,440,115)}${node(105,115,150,45,tr('hadrons','强子'))}${node(365,115,150,45,tr('leptons','轻子'),'svg-node2')}${line(180,160,115,205)}${line(180,160,245,205)}${node(55,205,125,45,tr('baryons','重子'))}${node(190,205,125,45,tr('mesons','介子'))}${text(440,215,'e⁻, μ⁻, ν','e⁻, μ⁻, ν','svg-equation','middle')}`);
      case 9:return svg(n,`${node(50,55,225,80,tr('proton','质子'))}${text(163,115,'u   u   d','u   u   d','svg-equation','middle')}${node(345,55,225,80,tr('neutron','中子'),'svg-node2')}${text(458,115,'u   d   d','u   d   d','svg-equation','middle')}${node(50,180,225,70,'π⁺','svg-node3')}${text(163,235,'u   d̄','u   d̄','svg-equation','middle')}${node(345,180,225,70,'K⁺','svg-node3')}${text(458,235,'u   s̄','u   s̄','svg-equation','middle')}`);
      case 10:return svg(n,`${node(70,55,480,190,tr('conservation ledger','守恒检查表'))}${line(230,55,230,245,'svg-soft')}${line(390,55,390,245,'svg-soft')}${line(70,100,550,100,'svg-soft')}${line(70,138,550,138,'svg-soft')}${line(70,176,550,176,'svg-soft')}${line(70,214,550,214,'svg-soft')}${text(150,88,'quantity','物理量','svg-small','middle')}${text(310,88,'before','反应前','svg-small','middle')}${text(470,88,'after','反应后','svg-small','middle')}${text(150,126,'charge Q','电荷 Q','svg-small','middle')}${text(150,164,'baryon B','重子数 B','svg-small','middle')}${text(150,202,'lepton L','轻子数 L','svg-small','middle')}${text(150,238,'strangeness S','奇异数 S','svg-small','middle')}`);
      case 11:return svg(n,`${node(65,165,300,55,tr('metal surface','金属表面'),'svg-node2')}<path d="M80 70 q24 -40 48 0 t48 0" class="svg-accent"/>${text(130,45,'photon hf','光子 hf','svg-small','middle')}${line(180,90,220,165,'svg-accent')}${line(240,165,320,90)}${circ(332,82,13,'e⁻')}${text(445,120,'hf = φ + KEmax','hf = φ + KEmax','svg-equation','middle')}${text(445,165,'KEmax = eVs','KEmax = eVs','svg-equation','middle')}${text(445,205,'hf₀ = φ','hf₀ = φ','svg-small','middle')}`);
      case 12:return svg(n,`${circ(135,150,62,tr('atom','原子'),'svg-node2')}${circ(55,150,12,'e⁻','svg-node3')}${line(68,150,105,150)}${line(135,90,135,55,'svg-accent')}${circ(135,45,10,'e⁻','svg-node3')}${text(225,75,'excitation','激发','svg-label')}${text(225,100,'electron remains bound','电子仍被束缚','svg-small')}${line(180,160,320,160,'svg-warn')}${circ(350,160,12,'e⁻','svg-node3')}${text(380,155,'ionisation','电离','svg-label')}${text(380,180,'electron removed','电子被移走','svg-small')}${text(315,240,'1 eV = 1.602 × 10⁻¹⁹ J','1 eV = 1.602 × 10⁻¹⁹ J','svg-equation','middle')}`);
      case 13:return svg(n,`${line(80,245,300,245,'svg-soft')}${line(80,195,300,195,'svg-soft')}${line(80,135,300,135,'svg-soft')}${line(80,70,300,70,'svg-soft')}${line(210,75,210,190,'svg-accent')}${text(235,125,'ΔE = hf','ΔE = hf','svg-equation')}${node(355,70,180,155,tr('line spectrum','线状光谱'))}${line(385,190,385,110,'svg-warn')}${line(425,190,425,135,'svg-accent')}${line(470,190,470,155)}${line(510,190,510,170,'svg-soft')}`);
      case 14:return svg(n,`${line(55,145,220,145)}${text(85,125,'electron beam','电子束','svg-small')}${node(220,90,24,110,tr('graphite','石墨'),'svg-node2')}${circ(430,145,35,'','svg-soft')}${circ(430,145,65,'','svg-soft')}${circ(430,145,95,'','svg-soft')}${text(430,270,'diffraction rings','衍射环','svg-label','middle')}${text(320,55,'λ = h/p','λ = h/p','svg-equation','middle')}${text(320,82,'p ↑ → λ ↓','p ↑ → λ ↓','svg-small','middle')}`);
      case 15:return svg(n,`${circ(310,145,55,tr('AQA 3.2','AQA 3.2'),'svg-node3')}${node(50,45,155,55,tr('particles','粒子'))}${node(415,45,155,55,tr('interactions','相互作用'),'svg-node2')}${node(50,205,155,55,tr('quantum','量子现象'),'svg-node2')}${node(415,205,155,55,tr('conservation','守恒'))}${line(205,85,270,120)}${line(415,85,350,120)}${line(205,225,270,170)}${line(415,225,350,170)}${text(310,285,'classify → model → calculate → explain','分类 → 建模 → 计算 → 解释','svg-small','middle')}`);
      case 16:return svg(n,`${line(50,150,240,150,'svg-accent')}${node(245,55,18,190,tr('foil','箔'),'svg-node2')}${circ(405,150,24,'+','svg-node3')}${line(263,150,555,150,'svg-accent')}${line(263,145,520,70,'svg-warn')}${line(263,155,490,230)}${text(485,55,'rare large deflection','少数大角度偏转','svg-small','middle')}${text(455,140,'most pass through','大多数直穿','svg-small','middle')}${text(405,198,'tiny + nucleus','很小的正原子核','svg-small','middle')}`);
      default:return svg(n,text(310,150,'Physics model','物理模型','svg-label','middle'));
    }
  }

  function lessonNumber(){
    const raw=$('#lessonPanel .lesson-count')?.textContent||'';
    const m=raw.match(/\d+/); if(m)return Number(m[0]);
    const active=$('#courseList [data-seq-lesson].active');
    return active?Number(active.dataset.seqLesson)+1:1;
  }

  function lesson(n){
    const api=window.PARTICLELAB_LESSON_SEQUENCE;
    return api?.getLocalizedLesson?.(n)||api?.lessons?.find(x=>x.n===n)||null;
  }

  function points(n,l){
    if(zh())return window.PARTICLELAB_MANDARIN_LESSONS?.lessons?.[n]?.spec||l?.objectives||[];
    return window.PARTICLELAB_LESSON_SEQUENCE?.specCoverage?.[n]?.points||l?.objectives||[];
  }

  function photo(n){
    const p=photos[n]; if(!p)return '';
    return `<figure class="textbook-figure textbook-photo-figure"><div class="textbook-photo"><img loading="lazy" referrerpolicy="no-referrer" src="${p.src}" alt="${esc(tr(p.en,p.cn))}" onerror="this.parentElement.classList.add('is-failed')"><div class="photo-fallback">${esc(tr('Image unavailable. The original diagram and full lesson content still work.','图片暂时无法加载。原创图示和完整课程内容仍可使用。'))}</div></div><figcaption><strong>${esc(tr('Sourced visual','来源图像'))}.</strong> ${esc(tr(p.en,p.cn))}<br><span class="textbook-credit">${esc(p.credit)} · ${esc(p.license)} · <a href="${p.page}" target="_blank" rel="noopener noreferrer">${esc(tr('source & licence','来源与许可'))}</a></span></figcaption></figure>`;
  }

  function equationCard(l){
    const eq=(l?.equations||[]).filter(Boolean);
    const heading=eq.length?tr('Use these deliberately','有目的地使用这些方程'):tr('Conceptual lesson','概念课');
    const body=eq.length?`<div class="textbook-equation-list">${eq.map(x=>`<div class="textbook-equation">${esc(x)}</div>`).join('')}</div>`:`<p>${esc(tr('There is no new calculation equation to memorise here. Focus on the physical model, definitions and cause-and-effect reasoning.','本课没有新的计算公式需要记忆；重点是物理模型、定义以及因果推理。'))}</p>`;
    return `<section class="textbook-study-card equations"><span class="eyebrow">${esc(tr('Key equations / relationships','关键方程 / 关系'))}</span><h4>${esc(heading)}</h4>${body}</section>`;
  }

  function visualPair(n){
    const t=titles[n]||['Physics diagram','物理图示'];
    const original=`<figure class="textbook-figure"><div class="textbook-figure-graphic">${diagram(n)}</div><figcaption><strong>${esc(tr('Original teaching diagram','原创教学图示'))}.</strong> ${esc(tr(t[0],t[1]))}. ${esc(tr('Created for this app; schematic and not to physical scale unless stated.','为本应用创建；属于示意图，除非另有说明，否则不按真实比例。'))}</figcaption></figure>`;
    const sourced=photo(n);
    if(sourced)return original+sourced;
    return original+`<figure class="textbook-figure"><div class="textbook-figure-graphic">${diagram(n)}</div><figcaption><strong>${esc(tr('Explain from the picture','看图解释'))}.</strong> ${esc(tr('Cover the text and use the diagram alone to explain the physics in complete sentences.','遮住正文，仅根据图示用完整句子解释物理过程。'))}</figcaption></figure>`;
  }

  function enhance(){
    const host=$('.lesson-active-section .lesson-textbook')||$('.lesson-full-plan .lesson-textbook');
    if(!host)return;
    const n=lessonNumber();
    if(host.dataset.fullTextbookLesson===String(n))return;
    const l=lesson(n); if(!l)return;
    host.querySelector('.textbook-full-chapter')?.remove();
    const sections=window.PARTICLELAB_LESSON_SEQUENCE?.textbook?.[n]?.sections?.length||0;
    const checklist=points(n,l);
    const mis=misconceptions[n]||misconceptions[1];
    const el=document.createElement('section');
    el.className='textbook-full-chapter';
    el.innerHTML=`
      <div class="textbook-chapter-hero"><div><span class="eyebrow">${esc(tr('Full digital textbook chapter','完整数字教材章节'))}</span><h3>${esc(l.title||'')}</h3><p>${esc(l.overview||'')}</p><div class="textbook-chapter-badges"><span>${esc(l.code||'')}</span><span>${sections} ${esc(tr('guided reading sections','个引导阅读章节'))}</span><span>${esc(tr('visuals + worked examples + exam focus','图示 + 示例 + 考试重点'))}</span></div></div><aside><div><strong>${esc(tr('How to use it','如何使用'))}</strong><span>${esc(tr('Read the visual overview first. Then work through every guided section below and answer its checkpoint before revealing the model response.','先看视觉概览，再按顺序完成下方每个引导章节，并在查看参考答案前完成检查题。'))}</span></div><div><strong>${esc(tr('AQA focus','AQA 重点'))}</strong><span>${esc(tr('The chapter body and summary are linked to the specification points for this lesson.','章节正文与总结均对应本课的规格要求。'))}</span></div></aside></div>
      <div class="textbook-reading-route"><b>${esc(tr('Reading route:','阅读路线：'))}</b><span>${esc(tr('1 Visual overview','1 视觉概览'))}</span><span>${esc(tr('2 Guided reading','2 引导阅读'))}</span><span>${esc(tr('3 Checkpoints','3 检查题'))}</span><span>${esc(tr('4 Worked example','4 示例'))}</span><span>${esc(tr('5 Exam wording','5 考试表述'))}</span></div>
      <div class="textbook-visual-grid">${visualPair(n)}</div>
      <div class="textbook-study-grid">${equationCard(l)}<section class="textbook-study-card worked-example"><span class="eyebrow">${esc(tr('Worked example / model reasoning','示例 / 模型推理'))}</span><h4>${esc(tr('Follow the physics, not just the final answer','关注物理过程，而不仅是最终答案'))}</h4><p>${esc(l.worked||'')}</p></section><section class="textbook-study-card misconception"><span class="eyebrow">${esc(tr('Common misconception','常见误区'))}</span><h4>${esc(tr('Correct the idea before it becomes a habit','及时纠正错误概念'))}</h4><p>${esc(tr(mis[0],mis[1]))}</p></section><section class="textbook-study-card exam-focus"><span class="eyebrow">${esc(tr('AQA exam focus','AQA 考试重点'))}</span><h4>${esc(tr('Precise wording matters','精确表述很重要'))}</h4><p>${esc(l.exam||'')}</p></section></div>
      <section class="textbook-chapter-summary"><span class="eyebrow">${esc(tr('Chapter summary — what you must know','章节总结——必须掌握'))}</span><h4>${esc(tr('Specification-linked checklist','规格要求关联清单'))}</h4><ul>${checklist.map(p=>`<li>${esc(p)}</li>`).join('')}</ul></section>
      <div class="textbook-reading-route"><b>${esc(tr('Chapter body:','章节正文：'))}</b><span>${esc(tr(`Continue through the ${sections} detailed guided sections below.`,`继续学习下方 ${sections} 个详细引导章节。`))}</span></div>`;
    const intro=host.querySelector('.textbook-intro');
    if(intro)intro.insertAdjacentElement('afterend',el); else host.prepend(el);
    host.dataset.fullTextbookLesson=String(n);
  }

  let queued=false;
  const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance()})};
  function init(){
    const panel=$('#lessonPanel'); if(!panel){setTimeout(init,120);return}
    new MutationObserver(schedule).observe(panel,{subtree:true,childList:true});
    document.addEventListener('click',e=>{if(e.target.closest('[data-seq-stage],[data-seq-lesson],[data-lesson-view]'))setTimeout(schedule,20)});
    window.addEventListener('particlelab:languagechange',()=>setTimeout(()=>{const h=$('.lesson-textbook');if(h)delete h.dataset.fullTextbookLesson;schedule()},30));
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
