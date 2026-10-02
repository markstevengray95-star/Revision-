'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {generatePractice}=require('../scripts/practice-catalog.cjs');
const {scenarios}=require('../scripts/additional-questions.cjs');
const {presets}=require('../shared/task-presets.js');
const data=generatePractice(),authored=data.lessons.flatMap(l=>l.questions.filter(q=>q.authored).map(q=>({...q,lesson:l})));
assert.equal(scenarios.length,61);assert.equal(authored.length,183);
assert.equal(new Set(authored.map(q=>q.bankId)).size,183);
assert.equal(new Set(authored.map(q=>q.lesson.level+':'+q.lesson.subject+':'+q.lesson.topic)).size,44);
for(const q of authored){
  assert.ok(q.question.startsWith(q.context));assert.equal(q.marks,q.answer.length);
  assert.ok(q.lesson.href&&q.answer.every(a=>a.trim()));
  if(q.options){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.equal(q.answer[0],q.options[q.correct]);}
}
const w={REVISION_PRACTICE:data},ctx=vm.createContext({window:w,console});
for(const file of ['shared/practice-skills.js','shared/equation-bank.js','shared/homework-engine.js','shared/activity-generator.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),ctx);
assert.equal(presets.length,10);
for(const level of ['gcse','alevel'])for(const subject of ['biology','chemistry','physics']){
  const questions=authored.filter(q=>q.lesson.level===level&&q.lesson.subject===subject);
  assert.ok(questions.length>=30);
  const topic=w.REVISION_ACTIVITIES.topics(level,subject,'combined')[1].id;
  for(const p of presets){
    const settings={level,subject,pathway:'combined',topic:p.allTopics?'all':topic,format:p.format,kind:p.kind,count:p.count,demand:p.demand,seed:81,includeWritten:['mixed','written','application','practical','analysis'].includes(p.format)};
    const a=w.REVISION_ACTIVITIES.generate(settings);
    assert.equal(a.questions.length,p.count,level+'/'+subject+'/'+p.id);
    assert.equal(new Set(a.questions.map(q=>q.prompt)).size,p.count);
    for(const q of a.questions){
      const lesson=data.lessons.find(l=>l.id===q.lessonId);assert.ok(lesson);
      if(level==='gcse')assert.notEqual(lesson.scope,'triple');
      assert.ok(q.key.solution.length);
      if(q.authored&&q.type==='written')assert.equal(q.marks,q.key.solution.length,'One mark per authored point');
      if(q.type==='choice'){assert.equal(q.options.filter(o=>o.id===q.key.correct).length,1);assert.ok(q.key.solution.join(' ').includes(q.options.find(o=>o.id===q.key.correct).text));}
    }
    if(['practical','analysis'].includes(p.format))assert.ok(a.questions.every(q=>q.authored&&q.bankType===(p.format==='practical'?'practical':'data')));
    if(['choice','objective','calculation'].includes(p.format))assert.ok(a.questions.every(q=>q.type!=='written'));
    assert.ok(w.REVISION_ACTIVITIES.publicQuestions(a).every(q=>!('key' in q)),'Keys must remain in private assignment payload');
    assert.equal(JSON.stringify(a),JSON.stringify(w.REVISION_ACTIVITIES.generate(settings)));
  }
  for(const seed of [1,2,3]){
    const a=w.REVISION_ACTIVITIES.generate({level,subject,topic:'all',format:'objective',kind:'quiz',count:20,seed});
    assert.ok(a.questions.some(q=>q.authored),'Objective homework should include reviewed contextual choices');
  }
}
for(const file of ['tools/question-bank/app.js','teacher-set-work.js','shared/task-presets.js'])new vm.Script(fs.readFileSync(path.join(__dirname,'..',file),'utf8'),{filename:file});
const html=fs.readFileSync(path.join(__dirname,'..','teacher.html'),'utf8');
assert.ok(html.indexOf('shared/task-presets.js')<html.indexOf('teacher-set-work.js'));
for(const format of ['application','practical','analysis'])assert.ok(html.includes('value="'+format+'"'));
const practice=fs.readFileSync(path.join(__dirname,'..','scripts/practice-catalog.cjs'),'utf8');assert.ok(practice.includes('attachAdditional(lessons)'));
console.log('Question expansion passed: 183 authored questions, all 44 topics, 60 course/preset combinations, private keys, marking points, correct lesson scope and deterministic generation.');
