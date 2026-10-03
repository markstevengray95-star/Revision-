const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const presets=require('../shared/homework-presets.js'),root=path.resolve(__dirname,'..'),w={};
const ctx=vm.createContext({window:w,console});
for(const f of ['practice-data.js','shared/practice-skills.js','shared/equation-bank.js','shared/homework-engine.js','shared/activity-generator.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx);
assert.equal(presets.list.length,5);
for(const level of ['gcse','alevel'])for(const subject of ['biology','chemistry','physics']){
 const lesson=w.REVISION_PRACTICE.lessons.find(l=>l.level===level&&l.subject===subject&&l.scope!=='triple');
 const topics=w.REVISION_ACTIVITIES.topics(level,subject,'combined').filter(t=>t.id!=='all');
 for(const p of presets.list){
  const settings={level,subject,pathway:'combined',topic:lesson.topic,kind:p.kind,format:p.format,count:p.count,includeWritten:p.writing,demand:'standard',seed:12};
  if(p.id==='recap')settings.lessonIds=[lesson.id];
  const activity=presets.generate(w.REVISION_ACTIVITIES,settings,{presetId:p.id,olderTopics:topics.filter(t=>t.id!==lesson.topic).slice(0,2).map(t=>t.id)});
  assert.equal(activity.questions.length,p.count,level+'/'+subject+'/'+p.id);
  assert.equal(new Set(activity.questions.map(q=>q.id)).size,p.count);
  assert.equal(new Set(activity.questions.map(q=>q.prompt)).size,p.count);
  if(p.id==='recap')assert.ok(activity.questions.every(q=>q.lessonId===lesson.id));
  if(p.id==='weekly')assert.equal(new Set(activity.questions.map(q=>q.topic)).size,3);
  if(p.id==='equations')assert.ok(activity.questions.every(q=>q.type==='number'));
  assert.ok(w.REVISION_ACTIVITIES.publicQuestions(activity).every(q=>!q.key));
 }
}
const bank=w.REVISION_ACTIVITIES,settings={level:'gcse',subject:'physics',pathway:'combined',topic:'p1',count:12,kind:'quiz',format:'choice'};
assert.throws(()=>presets.generate(bank,settings,{presetId:'recap'}),/lesson you just taught/);
assert.throws(()=>presets.generate(bank,settings,{presetId:'weekly',olderTopics:[]}),/1–3/);
assert.throws(()=>presets.generate(bank,settings,{presetId:'weekly',olderTopics:['p1','bad']}),/1–3/);
console.log('Homework presets passed: five templates across six science courses, balanced topic coverage, unique questions, lesson scope, calculation marking and private keys.');
