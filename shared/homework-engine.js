(function(root,factory){const api=factory(typeof module==='object'&&module.exports?require('./equation-bank.js'):root.RevisionEquations);if(typeof module==='object'&&module.exports)module.exports=api;else root.RevisionHomework=api;})(typeof globalThis!=='undefined'?globalThis:this,function(E){
  'use strict';
  const types=['written','choice','cloze','calculation'];
  function validate(raw) {
    if(!raw || raw.v!==1) throw new Error('This question-set version is not supported.');
    const c={v:1,l:raw.l,s:raw.s,p:raw.p||'combined',t:raw.t||'all',n:Number(raw.n),d:raw.d,k:raw.k,z:Number(raw.z)};
    if(!['gcse','alevel'].includes(c.l)||!['biology','chemistry','physics','all'].includes(c.s)||!['combined','triple'].includes(c.p)||!['support','standard','stretch'].includes(c.d)||!Number.isInteger(c.n)||c.n<3||c.n>60||!Number.isInteger(c.z)||c.z<0||c.z>4294967295||!Array.isArray(c.k)||!c.k.length||c.k.some(x=>!types.includes(x))||typeof c.t!=='string'||!/^[-a-z0-9]+$/.test(c.t)||c.t.length>40)throw new Error('Choose 3–60 questions and valid question-set settings.');
    c.k=types.filter(x=>c.k.includes(x));return c;
  }
  function shuffled(items,random) {const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
  const stop=new Set('about after again along also another because before between could during every first from have into more most only other over should some such than that their them then there these they this those through under using very what when where which while with would science explain answer sentence present final useful clear explaining meeting without compromising different include includes including produce produces requires required means helps allows causes occurs occurs usually often describes describe leads changes change'.split(' '));
  const families=[
    ['accuracy','precision','resolution','uncertainty'],['systematic','random','absolute','percentage'],['base','derived','dimensionless','prefix'],
    ['wavelength','frequency','amplitude','period'],['speed','velocity','acceleration','distance'],['current','voltage','resistance','power'],
    ['kinetic','gravitational','chemical','elastic','thermal','nuclear'],['filtration','distillation','crystallisation','chromatography'],
    ['protons','neutrons','electrons','nucleons'],['atoms','ions','molecules','isotopes'],['ionic','covalent','metallic','intermolecular'],
    ['oxidised','reduced','neutralised','dissolved'],['cathode','anode','electrode','electrolyte'],['exothermic','endothermic','reversible','irreversible'],
    ['nucleus','cytoplasm','membrane','ribosome','chloroplast'],['mitochondria','ribosomes','plasmids','chromosomes'],
    ['diffusion','osmosis','respiration','photosynthesis'],['dominant','recessive','homozygous','heterozygous'],
    ['genotype','phenotype','allele','mutation'],['proteins','carbohydrates','lipids','enzymes'],['substrate','enzyme','product','catalyst'],
    ['arteries','veins','capillaries','alveoli'],['pathogens','antibodies','antigens','antibiotics'],['insulin','glucagon','thyroxine','adrenaline'],
    ['biotic','abiotic','living','non-living'],['producers','consumers','decomposers','predators'],['competition','predation','decomposition','pollination']
  ];
  const terms=new Set([...families.flat(),...'mass density pressure volume energy charge force extension magnification population efficiency concentration moles mole molar yield biomass trophic temperature specific latent equilibrium catalyst collision electrons electron neutron proton nucleus organelle eukaryotic prokaryotic bacteria bacterial photosynthetic hormones neuron synapse receptor kidney nephron glucose starch protein lipid polymer monomer condensation hydrolysis peptide ester amino enzyme active oxygen carbon hydrogen nitrogen sulfur sulphur combustion hydrocarbon alkanes alkenes polymerisation oxidation reduction electrolysis precipitation displacement rusting corrosion neutralisation reactants products reactant bond bonds bonding atomic radioactive radiation fission fusion ionisation isotope isotopes half-life magnetic electromagnet induction potential momentum resultant vector scalar perpendicular normal wavelength ultrasound infrared ultraviolet microwave convection conduction radiation evaporation sublimation melting freezing boiling energy aerobic anaerobic fermentation stomata xylem phloem transpiration translocation fertilisation mitosis meiosis gametes DNA chromosomes chromosome alleles variation adaptation natural evolution biodiversity conservation sustainability uncertainty resolution range mean anomalies particle particles formula reactants solute solvent gases molecules mass masses'.toLowerCase().split(' ')]);
  function gaps(lesson) {
    const text=[lesson.core,lesson.accuracy,...lesson.questions.flatMap(q=>q.answer)].filter(Boolean).join(' ');
    return text.split(/(?<=[.!?])\s+/).flatMap((sentence,index)=>{
      const matches=[...sentence.matchAll(/\b[a-zA-Z][a-zA-Z-]{2,}\b/g)].filter(m=>!stop.has(m[0].toLowerCase()));
      const meaningful=matches.filter(m=>terms.has(m[0].toLowerCase()));
      const words=meaningful;
      return words.map((word,j)=>({sentence,answer:word[0],start:word.index,id:`${lesson.id}:gap:${index}:${j}`}));
    });
  }
  function build(raw,lessons,extraCalculations=[]) {
    const c=validate(raw),random=E.rng(c.z), pool=lessons.filter(l=>l.level===c.l&&(c.s==='all'||l.subject===c.s)&&(c.t==='all'||l.topic===c.t)&&(c.l!=='gcse'||c.p==='triple'||l.scope!=='triple'));
    const banks={written:[],choice:[],cloze:[],calculation:[]};
    const allowedText=text=>c.l!=='gcse'||c.p==='triple'||!/(?:biology|chemistry|physics)[ -]only|separate science|triple science/i.test(text);
    const gapBank=new Map(pool.map(l=>[l.id,gaps(l).filter(g=>allowedText(g.sentence))])),topicWords=new Map();
    pool.forEach(l=>{const key=l.subject+':'+l.topic;if(!topicWords.has(key))topicWords.set(key,new Set());gapBank.get(l.id).forEach(g=>topicWords.get(key).add(g.answer.toLowerCase()));});
    const vocab=[...new Set([...gapBank.values()].flatMap(items=>items.map(g=>g.answer.toLowerCase())))];
    for(const l of shuffled(pool,random)) {
      for(const [i,q] of l.questions.entries()) {
        if(!allowedText(q.question))continue;
        const model=q.answer.map(line=>line.split(/(?<=[.!?])\s+/).filter(allowedText).join(' ')).filter(Boolean).join('\n');
        const item={id:`${l.id}:written:${q.bankId||i}`,subject:l.subject,topic:l.topicTitle,source:l.href,prompt:q.question,model,marks:q.marks,bankType:q.bankType,authored:!!q.authored};
        if(Array.isArray(q.options)){
          if(!Number.isInteger(q.correct)||!q.options[q.correct])throw Error('Missing reviewed choice key.');
          banks.choice.push({...item,type:'choice',expected:q.options[q.correct],options:shuffled(q.options,random)});
        }else if(model)banks.written.push({...item,type:'written',prompt:q.question+(!q.authored&&c.d==='stretch'?' Include a linked scientific explanation and relevant conditions.':'')});
      }
      for(const g of gapBank.get(l.id)) {
        const prompt=g.sentence.slice(0,g.start)+'________'+g.sentence.slice(g.start+g.answer.length);
        const item={id:g.id,type:'cloze',subject:l.subject,topic:l.topicTitle,source:l.href,prompt,expected:g.answer,model:g.sentence};
        banks.cloze.push(item);
        const family=families.find(f=>f.includes(g.answer.toLowerCase()));
        const related=family||[...topicWords.get(l.subject+':'+l.topic)];
        const candidates=related.filter(x=>x!==g.answer.toLowerCase());
        const distractors=shuffled(candidates.length>=3?candidates:vocab.filter(x=>x!==g.answer.toLowerCase()),random).slice(0,3);
        if(distractors.length===3)banks.choice.push({...item,id:g.id+':choice',type:'choice',options:shuffled([g.answer,...distractors],random)});
      }
    }
    for(const k of ['written','choice','cloze']){
      const authored=shuffled(banks[k].filter(q=>q.authored),random),other=shuffled(banks[k].filter(q=>!q.authored),random),mixed=[];
      // Include original scenarios regularly while retaining the wider lesson bank.
      while(authored.length||other.length){if(authored.length)mixed.push(authored.pop());for(let i=0;i<2&&other.length;i++)mixed.push(other.pop());}
      banks[k]=mixed;
    }
    const equations=E.available({level:c.l,subject:c.s,pathway:c.p,topic:c.t}).filter(d=>c.t!=="all"||!["astrophysics","medical","engineering","turning-points","electronics"].includes(d.topic));
    if(c.k.includes('calculation')&&equations.length) {
      const order=shuffled(equations,random);
      for(let i=0;i<c.n*3;i++) {const d=order[i%order.length],q=E.build(d.id,Math.floor(random()*4294967296),c.d);banks.calculation.push({id:q.id,type:'calculation',subject:d.subject,topic:d.name,prompt:q.prompt,model:q.steps.join('\n'),calculation:q});}
    }
    banks.calculation.push(...extraCalculations);
    const unavailable=c.k.filter(k=>!banks[k].length);
    if(unavailable.length)throw new Error(`No ${unavailable.join(' / ')} questions for these filters. Choose another topic or remove that format.`);
    const picked=[],seen=new Set(),indices={written:0,choice:0,cloze:0,calculation:0};
    // Avoid asking the same missing-word sentence twice, even in different formats.
    while(picked.length<c.n) {
      let added=false;
      for(const k of c.k) {
        let candidate;
        while(indices[k]<banks[k].length){const q=banks[k][indices[k]++];const key=q.prompt.toLowerCase();if(!seen.has(key)){candidate=q;seen.add(key);break;}}
        if(candidate){picked.push(candidate);added=true;if(picked.length===c.n)break;}
      }
      if(!added)break;
    }
    if(picked.length<c.n)throw new Error(`Only ${picked.length} unique questions match. Reduce the size or broaden your filters.`);
    return {config:c,questions:picked,title:`${c.l==='gcse'?'GCSE':'A-level'} ${c.s==='all'?'Science':c.s[0].toUpperCase()+c.s.slice(1)} · ${c.n} questions`};
  }
  return {types,validate,build};
});
