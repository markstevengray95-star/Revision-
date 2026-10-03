const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {readCourses,writeCourses}=require('../scripts/subject-courses.cjs'),answers=require('../courses/subjects/answers.js');
writeCourses();let count=0;const ids=new Set();
for(const {meta,data}of readCourses()){
 assert.ok(data.introduction&&data.examGuide&&data.topics.length>=4,meta.id);
 for(const t of data.topics){assert.ok(t.lessons.length&&t.summary);for(const l of t.lessons){assert.ok(!ids.has(l.id),'Duplicate lesson '+l.id);ids.add(l.id);assert.ok(l.sections.length>=2&&l.sections.every(s=>s.text.length>100),l.id+' requires authored explanations');assert.ok(l.worked.prompt&&l.worked.steps.length>=2&&l.misconception&&l.exam.model);assert.ok(l.questions.length>=2);for(const q of l.questions){assert.ok(q.prompt&&q.model);if(q.answer!==undefined)assert.equal(answers.check(q,String(q.answer)),true,l.id+': answer check');}count++;}}
}
assert.equal(answers.check({type:'expression',answer:'(x+2)(x-3)'},'x^2-x-6'),true);
assert.equal(answers.check({type:'expression',answer:'x^2'},'2x'),false);
assert.equal(answers.check({type:'number',answer:'1/2'},'0.5'),true);
for(const bad of ['alert(1)','x/0','1/0','x^20','x;1','NaN'])assert.equal(answers.check({type:'number',answer:1},bad),false,bad);
assert.equal(answers.check({type:'written'},'thoughtful response'),null);
for(const file of ['course.js','tools.js','answers.js','registry.js'])new vm.Script(fs.readFileSync('courses/subjects/'+file,'utf8'),{filename:file});
new vm.Script(fs.readFileSync('dashboard.js','utf8'));
console.log(`Subject courses passed: ${readCourses().length} courses, ${count} authored lessons, answer equivalence and unsafe-input rejection.`);
