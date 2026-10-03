const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {loadCourses,root}=require('../scripts/course-content.cjs');
const w=loadCourses(),box={window:w,document:{readyState:'loading',addEventListener(){},querySelector(){return null},getElementById(){return null}},URLSearchParams,console};
for(const subject of ['biology','chemistry'])vm.runInNewContext(fs.readFileSync(path.join(root,`courses/alevel/subjects/${subject}-lessons.js`),'utf8'),box);
const expectedStages=['Start','Learn','Practise','Review'];
const counts={physics:0,biology:0,chemistry:0};
function check(deck,subject,id){
 assert.ok(deck,`${id}: missing deck`);
 assert.equal(deck.slides.length,15,`${id}: inconsistent slide count`);
 const stages=deck.slides.map(s=>s.section||s.group);
 assert.deepEqual([...new Set(stages)],expectedStages,`${id}: inconsistent learning sequence`);
 for(const slide of deck.slides){
  assert.ok(slide.title&&Array.isArray(slide.bullets),`${id}: incomplete slide`);
  assert.ok(!/undefined|\[object Object\]/.test(slide.title+' '+slide.bullets.join(' ')),`${id}: invalid content`);
 }
 assert.ok(deck.slides.some(s=>s.solution?.length),`${id}: missing worked guidance`);
 counts[subject]++;
}
for(const lesson of w.ALEVEL_LESSONS)check(w.ALEVEL_SLIDE_DESIGN.build(w.ALEVEL_PHASE3.profile(lesson.id)),'physics',lesson.id);
for(const subject of ['biology','chemistry']){
 const config=w.ALEVEL_COURSE_REGISTRY[subject];
 const content=w[`ALEVEL_${subject.toUpperCase()}_CONTENT`];
 const refs=new Set([...content.refs,...(subject==='chemistry'?w.ALEVEL_CHEMISTRY_DETAIL.rows.map(r=>r.ref):[])]);
 for(const ref of refs){
  const topic=config.topics.find(t=>t.modules.some(m=>m.ref===ref||ref.startsWith(m.ref+'.')));
  assert.ok(topic,`${subject}/${ref}: missing chapter`);
  const section=topic.modules.find(m=>m.ref===ref)||{ref,title:w.ALEVEL_CHEMISTRY_DETAIL.lookup[ref].title};
  const deck=w[`ALEVEL_${subject.toUpperCase()}_LESSONS`].buildDeck({config,topic,section});
  check(deck,subject,ref);
  const p=content.get(ref),practice=deck.slides[12].practice;
  assert.equal(practice.length,3);
  for(let i=0;i<3;i++){
   assert.equal(practice[i].question,p.exam[i],`${ref}: changed question`);
   assert.deepEqual(practice[i].answer,p.examAnswers[i],`${ref}: mismatched answer`);
  }
 }
}
assert.deepEqual(counts,{physics:118,biology:39,chemistry:115});
console.log('Lesson formats: all 272 A-level decks use 15 slides and Start → Learn → Practise → Review, with matched question/answer pairs.');

const gcseTools=fs.readFileSync(path.join(root,'courses/gcse/presentation-teaching-tools.js'),'utf8');
const phaseSource=gcseTools.match(/function phaseFor\(type\)\{[\s\S]*?\n  \}/)[0];
const phaseFor=vm.runInNewContext('('+phaseSource+')');
for(const [type,phase] of Object.entries({title:'Start',retrieval:'Start',objectives:'Start',teach:'Learn',teachchunk:'Learn',specpoint:'Learn',worked:'Learn',terms:'Learn',practice:'Practise',specapply:'Practise',chunkcheck:'Practise',spec:'Review',exam:'Review',plenary:'Review'}))assert.equal(phaseFor(type)[0],phase,type+' is labelled incorrectly');
console.log('GCSE presentation stages match the shared four-phase format, including teaching chunks and embedded checks.');
