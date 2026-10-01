import { chromium } from 'playwright';

const BASE=process.env.TEST_URL||'http://127.0.0.1:4171/';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:960}});
page.setDefaultTimeout(8000);

const assert=(ok,msg)=>{if(!ok)throw new Error(msg)};
const has=(text,re,label)=>assert(re.test(text),label+' missing');
const collectLesson=(data,nums)=>{
  const parts=[];
  for(const n of nums){
    const lesson=data.lessons.find(x=>x.n===n);
    const book=data.textbook?.[n];
    const chunks=data.chunkDetail?.[n];
    const tasks=data.taskBank?.[n];
    parts.push(JSON.stringify({lesson,book,chunks,tasks}));
  }
  return parts.join(' ');
};

try{
  await page.goto(BASE,{waitUntil:'networkidle',timeout:30000});
  await page.waitForFunction(()=>!!window.PARTICLELAB_LESSON_SEQUENCE,{timeout:10000});
  const data=await page.evaluate(()=>({
    lessons:window.PARTICLELAB_LESSON_SEQUENCE.lessons,
    stages:window.PARTICLELAB_LESSON_SEQUENCE.stages,
    textbook:window.PARTICLELAB_LESSON_SEQUENCE.textbook,
    chunkDetail:window.PARTICLELAB_LESSON_SEQUENCE.chunkDetail,
    taskBank:window.PARTICLELAB_LESSON_SEQUENCE.taskBank,
    specCoverage:window.PARTICLELAB_LESSON_SEQUENCE.specCoverage
  }));

  assert(data.lessons.length===16,'Expected 16 lessons');
  assert(data.stages.map(x=>x.id).join(',')==='recall,objectives,teach,simulate,practice,exit,next','Seven-stage sequence is not in the intended order');

  const expectedCodes=['3.2.1.1','3.2.1.1','3.2.1.2','3.2.1.2','3.2.1.3','3.2.1.3','3.2.1.4','3.2.1.5','3.2.1.6','3.2.1.7','3.2.2.1','3.2.2.2','3.2.2.3','3.2.2.4'];
  expectedCodes.forEach((code,i)=>assert(data.lessons[i]?.code===code,'Lesson '+(i+1)+' should map to '+code+' but maps to '+data.lessons[i]?.code));
  assert(/synoptic|consolidation/i.test([data.lessons[14]?.code,data.lessons[14]?.phase,data.lessons[14]?.title].join(' ')),'Lesson 15 should be synoptic consolidation');
  assert(data.lessons[15]?.code==='3.8.1.1','Lesson 16 should be the clearly separated Rutherford 3.8.1.1 extension');

  for(const lesson of data.lessons){
    const n=lesson.n;
    const book=data.textbook?.[n];
    assert((lesson.recall||[]).length>=3,'Lesson '+n+' needs at least 3 starter questions');
    assert((lesson.objectives||[]).length>=3,'Lesson '+n+' needs at least 3 clear objectives');
    assert((lesson.teach||[]).length>=4,'Lesson '+n+' needs at least 4 teaching chunks');
    assert((data.taskBank?.[n]||[]).length>=3,'Lesson '+n+' needs at least 3 independent practice tasks');
    assert((lesson.exit||[]).length>=3,'Lesson '+n+' needs at least 3 exit-test prompts');
    assert(lesson.sim||lesson.view,'Lesson '+n+' needs a linked simulation or activity');
    assert(book?.sections?.length>=4,'Lesson '+n+' needs at least 4 mini-textbook sections');
    for(const [i,sec] of book.sections.entries()){
      assert((sec.p||[]).join(' ').length>80,'Lesson '+n+' textbook section '+(i+1)+' explanation is too thin');
      assert((sec.k||[]).length>=2,'Lesson '+n+' textbook section '+(i+1)+' needs retained key points');
      assert((sec.q||'').length>8 && (sec.a||'').length>8,'Lesson '+n+' textbook section '+(i+1)+' needs a checkpoint question and model response');
    }
  }

  // Official AQA 7408/7407 Particles & Radiation content audit.
  let x=collectLesson(data,[1,2]);
  has(x,/proton/i,'3.2.1.1 proton'); has(x,/neutron/i,'3.2.1.1 neutron'); has(x,/electron/i,'3.2.1.1 electron');
  has(x,/relative mass/i,'3.2.1.1 relative particle masses'); has(x,/1\.67[35].*10/i,'3.2.1.1 SI nucleon masses');
  has(x,/specific charge/i,'3.2.1.1 specific charge'); has(x,/nuclei|nucleus/i,'3.2.1.1 nuclei'); has(x,/ions?/i,'3.2.1.1 ions');
  has(x,/proton number|\bZ\b/i,'3.2.1.1 proton number'); has(x,/nucleon number|\bA\b/i,'3.2.1.1 nucleon number');
  has(x,/nuclide notation/i,'3.2.1.1 nuclide notation'); has(x,/isotop/i,'3.2.1.1 isotopes');

  x=collectLesson(data,[3,4]);
  has(x,/strong nuclear force/i,'3.2.1.2 strong nuclear force'); has(x,/3 fm/i,'3.2.1.2 short-range attraction');
  has(x,/0\.5 fm/i,'3.2.1.2 very-short-range repulsion'); has(x,/alpha/i,'3.2.1.2 alpha decay');
  has(x,/beta-minus|β⁻/i,'3.2.1.2 beta-minus decay'); has(x,/neutrino/i,'3.2.1.2 neutrino');
  has(x,/missing energy|conservation of energy/i,'3.2.1.2 neutrino energy-conservation motivation');

  x=collectLesson(data,[5,6]);
  has(x,/antiparticle/i,'3.2.1.3 antiparticles'); has(x,/same mass/i,'3.2.1.3 equal particle/antiparticle mass');
  has(x,/rest energy/i,'3.2.1.3 rest energy'); has(x,/MeV/i,'3.2.1.3 MeV');
  has(x,/positron/i,'3.2.1.3 positron'); has(x,/antiproton/i,'3.2.1.3 antiproton');
  has(x,/antineutron/i,'3.2.1.3 antineutron'); has(x,/antineutrino/i,'3.2.1.3 antineutrino');
  has(x,/Planck/i,'3.2.1.3 Planck constant'); has(x,/annihilation/i,'3.2.1.3 annihilation'); has(x,/pair production/i,'3.2.1.3 pair production');

  x=collectLesson(data,[7]);
  for(const [label,re] of [
    ['gravity',/gravity|gravitational/i],['electromagnetic interaction',/electromagnetic/i],['weak interaction',/weak interaction/i],['strong interaction',/strong interaction/i],
    ['exchange particles',/exchange particle/i],['virtual photon',/virtual photon/i],['beta-minus',/beta-minus|β⁻/i],['beta-plus',/beta-plus|β⁺/i],
    ['electron capture',/electron capture/i],['electron-proton collision',/electron.?proton/i],['W bosons',/W⁺|W⁻|W boson/i]
  ]) has(x,re,'3.2.1.4 '+label);

  x=collectLesson(data,[8]);
  for(const [label,re] of [
    ['hadrons',/hadron/i],['baryons',/baryon/i],['antibaryons',/antibaryon/i],['mesons',/meson/i],['pions',/pion/i],['kaons',/kaon/i],
    ['baryon number',/baryon number/i],['stable proton',/proton.*stable baryon|stable baryon.*proton/is],['pion exchange',/pion.*exchange/is],
    ['kaon decay',/kaon.*decay.*pion/is],['electron and muon leptons',/electron.*muon.*neutrino/is],['separate lepton families',/electron.*lepton number.*muon|muon.*lepton number.*electron/is],
    ['muon decay',/muon.*decay.*electron/is],['strange production and decay',/strange.*strong.*weak/is],['strangeness rules',/strangeness.*conserved.*strong/is],
    ['large collaborations',/collaboration|large.*team/i]
  ]) has(x,re,'3.2.1.5 '+label);

  x=collectLesson(data,[9]);
  for(const [label,re] of [
    ['quark charge',/quark.*charge/is],['baryon number',/baryon number/i],['strangeness',/strangeness/i],['up/down/strange',/up.*down.*strange/is],
    ['proton uud',/proton.*uud|uud.*proton/is],['neutron udd',/neutron.*udd|udd.*neutron/is],['pion and kaon',/pion.*kaon|kaon.*pion/is],['neutron decay',/neutron.*beta|neutron.*decay/is]
  ]) has(x,re,'3.2.1.6 '+label);

  x=collectLesson(data,[10]);
  for(const [label,re] of [
    ['beta-minus quark change',/beta-minus.*d.*u|β⁻.*d.*u/is],['beta-plus quark change',/beta-plus.*u.*d|β⁺.*u.*d/is],
    ['charge conservation',/charge.*conserv/is],['baryon conservation',/baryon.*conserv/is],['lepton conservation',/lepton.*conserv/is],
    ['strangeness conservation',/strangeness.*conserv/is],['energy conservation',/energy.*conserv/is],['momentum conservation',/momentum.*conserv/is]
  ]) has(x,re,'3.2.1.7 '+label);

  x=collectLesson(data,[11]);
  for(const [label,re] of [
    ['threshold frequency',/threshold frequency/i],['work function',/work function/i],['stopping potential',/stopping potential/i],
    ['photoelectric equation',/hf\s*=\s*φ\s*\+\s*KE/i],['maximum kinetic energy',/maximum kinetic energy|KEmax/i]
  ]) has(x,re,'3.2.2.1 '+label);

  x=collectLesson(data,[12]);
  for(const [label,re] of [
    ['ionisation',/ionisation/i],['excitation',/excitation/i],['fluorescent tube',/fluorescent tube/i],['electron volt',/electronvolt|electron volt|\beV\b/i],['eV-J conversion',/1\.602.*(?:10\s*⁻¹⁹|10\s*\^?\s*-?19).*J/i]
  ]) has(x,re,'3.2.2.2 '+label);

  x=collectLesson(data,[13]);
  for(const [label,re] of [
    ['line spectra',/line spectra|line spectrum/i],['discrete energy levels',/discrete.*energy level/is],['transitions',/transition/i],['J and eV',/joules|\bJ\b.*eV|eV.*J/is]
  ]) has(x,re,'3.2.2.3 '+label);

  x=collectLesson(data,[14]);
  for(const [label,re] of [
    ['electron diffraction',/electron diffraction/i],['particle wave properties',/wave.*properties|wave behaviour/is],['photoelectric particulate nature',/photoelectric.*particle|photoelectric.*particulate/is],
    ['de Broglie',/de Broglie/i],['momentum relationship',/λ\s*=\s*h\/p|momentum.*wavelength/is],['diffraction change with momentum',/momentum.*diffraction|diffraction.*momentum/is],
    ['changing scientific knowledge',/model.*change|knowledge.*change|evidence.*model/is],['peer review and validation',/peer review.*validat|validat.*scientific community/is]
  ]) has(x,re,'3.2.2.4 '+label);

  x=collectLesson(data,[16]);
  has(x,/Rutherford/i,'3.8.1.1 Rutherford extension'); has(x,/alpha.*scatter|scattering/is,'3.8.1.1 alpha scattering');
  has(x,/mostly empty space/i,'3.8.1.1 mostly empty space'); has(x,/small nucleus|tiny nucleus/i,'3.8.1.1 small nucleus');

  console.log('AQA CONTENT AUDIT PASSED: all core 3.2 requirements are present in the teaching content, with Rutherford separated as 3.8.1.1.');
}finally{
  await browser.close();
}
