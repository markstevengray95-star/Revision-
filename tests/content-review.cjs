const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {loadCourses,root}=require('../scripts/course-content.cjs');const {generatePractice,writePractice}=require('../scripts/practice-catalog.cjs');
const w=loadCourses(),data=generatePractice();
assert.equal(data.lessons.length,711);assert.equal(new Set(data.lessons.map(l=>l.id)).size,711);
const counts={};let questions=0;
for(const l of data.lessons){
 counts[l.level+':'+l.subject]=(counts[l.level+':'+l.subject]||0)+1;
 assert.ok(l.core.length>50&&l.accuracy.length>20,'Missing science: '+l.id);assert.ok(l.questions.length>=8,'Question bank too small: '+l.id);
 assert.equal(l.questionCount,l.questions.length,'Question count metadata mismatch: '+l.id);
 for(const q of l.questions){assert.ok(q.question.length>10);assert.ok(q.answer.length&&q.answer.every(a=>a.trim().length>0),'Missing answer: '+l.id);assert.ok(Number.isInteger(q.marks)&&q.marks>=1&&q.marks<=6,'Invalid marks: '+l.id);assert.ok(q.bankType&&q.difficulty,'Missing question metadata: '+l.id);assert.ok(!/given above|solve a quantitative problem|unfamiliar context\. Explain the reasoning/i.test(q.question),'Unspecified question: '+l.id);questions++;}
 assert.ok(w.REVISION_SKILLS.build(l.skillKey),'Missing topic data challenge: '+l.id);
 const url=new URL(l.href,'http://localhost');assert.ok(fs.existsSync(path.join(root,decodeURIComponent(url.pathname))),'Broken lesson link: '+l.id);
 if(l.level==='gcse'){assert.ok(url.searchParams.get('lesson')===l.title);if(l.scope==='triple')assert.equal(url.searchParams.get('mode'),'triple');}
 if(l.level==='alevel'&&l.subject!=='physics'){
  const topic=w.ALEVEL_COURSE_REGISTRY[l.subject].topics.find(t=>t.id===url.searchParams.get('topic'));
  assert.ok(topic.modules.some(m=>m.ref===url.searchParams.get('section')),'Invalid chapter route: '+l.id);
  assert.equal(url.searchParams.get('lesson')||url.searchParams.get('section'),l.ref,'Link opens wrong lesson: '+l.id);
 }
}
assert.equal(data.questionCount,questions);assert.ok(questions>=5688,'Expanded question bank unexpectedly small');
assert.deepEqual(counts,{'gcse:biology':163,'gcse:physics':110,'gcse:chemistry':166,'alevel:physics':118,'alevel:biology':39,'alevel:chemistry':115});
for(const topic of w.GCSE_COURSE_DATA.topics)for(const [i,[title]] of topic.lessons.entries()){
 const l=w.GCSE_RICH_CONTENT.getLesson(topic,title,i),m=w.GCSE_LESSON_PRESENTATION_CATALOG.build(topic,title,i,l);
 assert.equal(m.lessonStandard.examQuestion,l.reviewPractice[1].question);assert.equal(m.lessonStandard.modelAnswer,l.reviewPractice[1].answer.join(' '));
 const ladder=w.GCSE_LESSON_QUESTION_LADDER.build(m);assert.ok(ladder.length>=8);
 for(const q of ladder){assert.equal(q.marks,q.marking.reduce((n,p)=>n+p.marks,0));assert.ok(q.marking.every(p=>Number.isInteger(p.marks)&&p.text));}
 const studio=w.GCSE_LESSON_EXAM_STUDIO.build(m);assert.equal(studio.questions.length,4);assert.equal(studio.totalMarks,16);assert.ok(studio.questions.every(q=>q.modelAnswer&&q.prompt));assert.equal(w.GCSE_LESSON_EXAM_STUDIO.validate(studio).length,0);
 for(const q of studio.questions)assert.equal(w.GCSE_REVIEWED_ASSESSMENT.score(q.marking,q.marking.map((_,i)=>i),q.marks),q.marks);
}
for(const l of w.ALEVEL_LESSONS){const p=w.ALEVEL_LESSON_CONTENT.build(l),phase=w.ALEVEL_PHASE3.profile(l.id);assert.ok(p.worked.steps.length&&p.checks.length===p.checkAnswers.length);assert.ok(p.exam.every(q=>q.answer&&q.q));assert.equal(phase.worked.question,p.worked.question);assert.equal(phase.exam[1].answer,p.exam[1].answer);}
for(const [subject,bank] of Object.entries(w.ALEVEL_ASSESSMENT_DATA.banks)){
 assert.equal(new Set(bank.map(q=>q.id)).size,bank.length);
 for(const q of bank){assert.equal(q.marks,q.markPoints.length);if(q.kind==='practical')continue;const p=(subject==='biology'?w.ALEVEL_BIOLOGY_CONTENT:w.ALEVEL_CHEMISTRY_CONTENT).get(q.ref),i=['knowledge','application','analysis'].indexOf(q.kind);assert.equal(q.prompt,p.exam[i]);assert.deepEqual(Array.from(q.markPoints),Array.from(p.examAnswers[i]).slice(0,4));}
}
assert.ok(w.ALEVEL_ASSESSMENT_DATA.banks.chemistry.find(q=>q.ref==='3.1.1.1').papers.includes('paper1'),'Detailed chemistry sections lost their paper filter');
// Independently calculated reference results for every authored numeric challenge.
const baseResults={'gcse:b1':300,'gcse:b2':8,'gcse:b3':75,'gcse:b4':3,'gcse:b5':.25,'gcse:b6':25,'gcse:b7':600,'gcse:c1':35.8,'gcse:c2':24,'gcse:c3':40,'gcse:c4':6,'gcse:c5':-130,'gcse:c6':2,'gcse:c7':12,'gcse:c8':.6,'gcse:c9':30,'gcse:c10':2,'gcse:p1':30,'gcse:p2':2,'gcse:p3':2700,'gcse:p4':100,'gcse:p5':2250,'gcse:p6':40,'gcse:p7':2,'gcse:p8':2,'alevel:biology:3.1':3,'alevel:biology:3.2':30,'alevel:biology:3.3':2,'alevel:biology:3.4':1560/560,'alevel:biology:3.5':15000,'alevel:biology:3.6':75,'alevel:biology:3.7':18,'alevel:biology:3.8':64,'alevel:chemistry:3.1':25/(8.31*298),'alevel:chemistry:3.2':7,'alevel:chemistry:3.3':.6,'alevel:physics:measurements':1,'alevel:physics:particles':1,'alevel:physics:waves':2.4,'alevel:physics:mechanics-materials':.09,'alevel:physics:electricity':1.4,'alevel:physics:further-mechanics':8400,'alevel:physics:fields':.01,'alevel:physics:nuclear':100};
assert.equal(Object.keys(w.REVISION_SKILLS.entries).length,44);assert.equal(Object.keys(baseResults).length,44);
for(const [key,expected] of Object.entries(baseResults)){
 assert.ok(Math.abs(w.REVISION_SKILLS.build(key).result-expected)<1e-9,key+' incorrect reference result');
 for(let seed=0;seed<5;seed++){const p=w.REVISION_SKILLS.build(key,seed);assert.ok(Number.isFinite(p.result)&&p.question&&p.steps.length>=2);assert.ok(w.REVISION_SKILLS.correct(w.REVISION_SKILLS.format(p.result),p.result),key+' rejects displayed rounded answer');assert.ok(!w.REVISION_SKILLS.correct(String(p.result+Math.max(1,Math.abs(p.result))),p.result),key+' accepts wrong answer');}
}
for(const invalid of ['', ' ', '1.2 wrong', '0; alert(1)', 'Infinity','NaN'])assert.ok(!Number.isFinite(w.REVISION_SKILLS.parseNumber(invalid)));
assert.equal(w.REVISION_SKILLS.parseNumber('−1.2e-3'),-.0012);
writePractice();const generated={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'practice-data.js'),'utf8'),generated);assert.equal(JSON.stringify(generated.window.REVISION_PRACTICE),JSON.stringify(data),'Practice data needs regeneration');
console.log(`Content checks passed: ${data.lessons.length} distinct lessons, ${questions} answered prompts, 44 numeric challenges with 5 data variants, and matching assessment answers.`);
