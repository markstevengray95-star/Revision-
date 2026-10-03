const fs=require('node:fs');
const path=require('node:path');
const {loadCourses,root}=require('./course-content.cjs');
const {attachAdditional}=require('./additional-questions.cjs');

const normaliseAnswer=value=>{
  if(Array.isArray(value))return value.filter(Boolean).map(v=>String(v).trim()).filter(Boolean);
  if(value==null)return [];
  return [String(value).trim()].filter(Boolean);
};

const splitFacts=value=>{
  const text=normaliseAnswer(value).join(' ').replace(/\s+/g,' ').trim();
  if(!text)return [];
  const sentenceParts=text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/).map(s=>s.trim()).filter(s=>s.length>12);
  if(sentenceParts.length>=2)return sentenceParts;
  const clauseParts=text.split(/\s*[;•]\s*|\s+\|\s+/).map(s=>s.trim()).filter(s=>s.length>12);
  return clauseParts.length?clauseParts:[text];
};

const uniq=list=>[...new Set(list.map(v=>String(v).trim()).filter(Boolean))];
const markEstimate=answer=>Math.max(1,Math.min(6,normaliseAnswer(answer).length));

function expandQuestions(base,{title,topicTitle,core,accuracy}){
  const questions=(base||[]).map(q=>({
    question:String(q.question||'').trim(),
    answer:normaliseAnswer(q.answer),
    bankType:q.bankType||'exam',
    difficulty:q.difficulty||'standard',
    marks:q.marks||markEstimate(q.answer)
  })).filter(q=>q.question&&q.answer.length);

  const facts=uniq(splitFacts(core));
  const accuracyPoints=uniq(splitFacts(accuracy));
  const shortFacts=facts.slice(0,2);
  const explainFacts=facts.slice(0,3);
  const developedFacts=facts.slice(0,4);
  const checkPoints=accuracyPoints.length?accuracyPoints.slice(0,2):facts.slice(-2);
  const topic=topicTitle||'this topic';
  const candidates=[];

  if(shortFacts.length)candidates.push({
    question:`State two key scientific points about ${title}.`,answer:shortFacts,
    bankType:'recall',difficulty:'foundation',marks:Math.min(2,shortFacts.length)
  });
  if(explainFacts.length)candidates.push({
    question:`Explain ${title} using precise scientific language.`,answer:explainFacts,
    bankType:'explain',difficulty:'standard',marks:Math.min(4,explainFacts.length+1)
  });
  if(developedFacts.length)candidates.push({
    question:`Write an exam-ready summary of ${title}. Include the important scientific detail needed for full marks.`,answer:developedFacts,
    bankType:'extended',difficulty:'standard',marks:Math.min(6,developedFacts.length+1)
  });
  if(checkPoints.length)candidates.push({
    question:`Give one important condition, limitation, accuracy point or misconception check for ${title}.`,answer:checkPoints,
    bankType:'accuracy',difficulty:'standard',marks:Math.min(3,checkPoints.length+1)
  });
  if(shortFacts.length)candidates.push({
    question:`A student gives a vague answer about ${title}. What two pieces of scientific detail should they add?`,answer:shortFacts,
    bankType:'improve',difficulty:'standard',marks:Math.min(3,shortFacts.length+1)
  });
  if(explainFacts.length)candidates.push({
    question:`How would you use your knowledge of ${title} to answer an unfamiliar question in ${topic}?`,answer:explainFacts,
    bankType:'application',difficulty:'challenge',marks:Math.min(5,explainFacts.length+2)
  });
  if(checkPoints.length&&explainFacts.length)candidates.push({
    question:`Explain ${title}, then state one check that prevents a common error.`,answer:uniq([...explainFacts.slice(0,2),...checkPoints.slice(0,1)]),
    bankType:'synoptic',difficulty:'challenge',marks:4
  });

  const seen=new Set(questions.map(q=>q.question.toLowerCase().replace(/\s+/g,' ')));
  for(const q of candidates){
    const key=q.question.toLowerCase().replace(/\s+/g,' ');
    if(seen.has(key)||!normaliseAnswer(q.answer).length)continue;
    seen.add(key);questions.push({...q,answer:normaliseAnswer(q.answer)});
  }
  return questions;
}

function addLesson(lessons,lesson){
  const questions=expandQuestions(lesson.questions,lesson);
  lessons.push({...lesson,questions,questionCount:questions.length});
}

function generatePractice(){
  const w=loadCourses(),lessons=[];
  for(const topic of w.GCSE_COURSE_DATA.topics)for(const [index,[title,scope]] of topic.lessons.entries()){
    const p=w.GCSE_RICH_CONTENT.getLesson(topic,title,index);
    const query=new URLSearchParams({subject:topic.subject,topic:topic.id,mode:scope==='triple'||topic.scope==='triple'?'triple':'combined',tab:'lessons',lesson:title});
    addLesson(lessons,{id:`gcse:${topic.id}:${index}`,level:'gcse',subject:topic.subject,topic:topic.id,topicTitle:topic.title,title,scope:scope==='triple'||topic.scope==='triple'?'triple':'combined',href:`courses/gcse/index.html?${query}`,core:p.reviewPractice[0].answer.join(' '),accuracy:p.depth.misconception,questions:p.reviewPractice,skillKey:`gcse:${topic.id}`});
  }
  for(const l of w.ALEVEL_LESSONS){
    const m=w.ALEVEL_SLIDE_DESIGN.modelFor(l);if(!m)throw Error('No reviewed physics model: '+l.id);
    addLesson(lessons,{id:`alevel:physics:${l.id}`,level:'alevel',subject:'physics',topic:l.topicId,topicTitle:l.topicTitle,title:l.title,ref:l.ref,scope:'alevel',href:`courses/alevel/index.html?subject=physics#lesson=${l.id}`,core:m.facts.join(' '),accuracy:m.use,questions:[{question:m.check,answer:[m.answer]},{question:m.q,answer:m.steps},{question:`Explain how to use ${m.eq}. Include its conditions or an important check.`,answer:[m.use,...m.facts]}],skillKey:`alevel:physics:${l.topicId}`});
  }
  for(const subject of ['biology','chemistry']){
    const source=subject==='biology'?w.ALEVEL_BIOLOGY_CONTENT:w.ALEVEL_CHEMISTRY_CONTENT;
    const refs=new Set([...source.refs,...(subject==='chemistry'?w.ALEVEL_CHEMISTRY_DETAIL.rows.map(r=>r.ref):[])]);
    const topics=w.ALEVEL_COURSE_REGISTRY[subject].topics;
    for(const ref of refs){
      const p=source.get(ref),topic=topics.find(t=>t.modules.some(m=>ref===m.ref||ref.startsWith(m.ref+'.')));
      if(!p||!topic)throw Error('No lesson or topic: '+subject+' '+ref);
      const module=topic.modules.find(m=>ref===m.ref||ref.startsWith(m.ref+'.'));
      const detail=subject==='chemistry'?w.ALEVEL_CHEMISTRY_DETAIL.rows.find(r=>r.ref===ref):null;
      const query=new URLSearchParams({subject,topic:topic.id,section:module.ref});if(ref!==module.ref)query.set('lesson',ref);
      addLesson(lessons,{id:`alevel:${subject}:${ref}`,level:'alevel',subject,topic:topic.id,topicTitle:topic.title,title:detail?.title||module.title,ref,scope:'alevel',href:`courses/alevel/subjects/topic-shell.html?${query}`,core:p.core.join(' '),accuracy:p.mis,questions:p.exam.map((question,i)=>({question,answer:p.examAnswers?.[i]||[]})),skillKey:`alevel:${subject}:${ref.split('.').slice(0,2).join('.')}`});
    }
  }
  attachAdditional(lessons);
  const questionCount=lessons.reduce((sum,l)=>sum+l.questions.length,0);
  return JSON.parse(JSON.stringify({version:3,questionCount,lessons}));
}

function writePractice(){
  const data=generatePractice();
  fs.writeFileSync(path.join(root,'practice-data.js'),`// Generated by scripts/practice-catalog.cjs. Edit the source lessons, then regenerate.\nwindow.REVISION_PRACTICE = ${JSON.stringify(data)};\n`);
  console.log(`Indexed ${data.lessons.length} lessons and ${data.questionCount} questions for practice.`);
  return data;
}
if(require.main===module)writePractice();
module.exports={generatePractice,writePractice,expandQuestions};
