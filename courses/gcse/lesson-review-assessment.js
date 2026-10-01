(() => {
 'use strict';
 const api=window.GCSE_LESSON_PRESENTATION_CATALOG;if(!api)return;
 const base=api.build.bind(api);
 api.build=function(topic,title,index,lesson){
  const model=base(topic,title,index,lesson);if(!model)return model;
  model.reviewPractice=lesson.reviewPractice;
  if(model.lessonStandard&&lesson.reviewPractice){const q=lesson.reviewPractice[1];model.lessonStandard.examQuestion=q.question;model.lessonStandard.modelAnswer=q.answer.join(' ');}
  return model;
 };
 const mark=(text,marks=1)=>({text,marks});
 function questions(model){
  const practice=model.reviewPractice||[{question:`Explain ${model.title}.`,answer:[model.coreExplanation]}];
  const core=practice[0].answer.join(' '),accuracy=model.misconception;
  const terms=model.keyTerms||[],a=terms[0]||[model.title,core],b=terms[1]||a;
  const skill=window.REVISION_SKILLS?.build(`gcse:${model.topicId}`,0);
  const list=[
   {command:'Define',marks:1,prompt:`Define “${a[0]}”.`,marking:[mark(a[1])]},
   {command:'Describe',marks:2,prompt:`Describe the scientific process or model in ${model.title.toLowerCase()}.`,marking:[mark(core,2)]},
   {command:'Explain',marks:3,prompt:practice[0].question,marking:[mark(core,3)]},
   terms.length>1?{command:'Compare',marks:2,prompt:`Compare the meanings of “${a[0]}” and “${b[0]}”.`,marking:[mark(a[1]),mark(b[1])]}:{command:'Explain',marks:2,prompt:`Explain why this accuracy check matters: ${accuracy}`,marking:[mark(accuracy),mark(core)]},
   {command:'Suggest',marks:2,prompt:`Suggest how a labelled diagram or sequence could communicate this explanation: ${core}`,marking:[mark(core),mark('Labels and links should correctly represent the named structures, quantities or processes.')]},
   {command:'Evaluate',marks:3,prompt:practice[1]?.question||`Justify this accuracy check: ${accuracy}`,marking:[mark(accuracy),mark(core,2)]},
   {command:'Explain',marks:3,prompt:practice[2]?.question||practice[0].question,marking:[mark(core,2),mark(accuracy)]}
  ];
  if(skill)list.splice(5,0,{command:'Calculate',marks:3,prompt:`Topic skills practice: ${skill.question}`,marking:[mark('Select the correct relationship and convert the quantities to compatible units.'),mark(skill.steps.slice(0,-1).join(' ')),mark(skill.steps.at(-1))]});
  return list.map((q,i)=>({...q,id:`review-q${i+1}`,phase:i<2?'teach':i<5?'apply':'practice'}));
 }
 if(window.GCSE_LESSON_QUESTION_LADDER)window.GCSE_LESSON_QUESTION_LADDER.build=questions;
 const studio=window.GCSE_LESSON_EXAM_STUDIO;
 if(studio){const old=studio.build.bind(studio);studio.build=function(model,practical){const pack=old(model,practical);if(!pack)return pack;const core=model.reviewPractice?.[0]?.answer.join(' ')||model.coreExplanation;
   const make=(id,section,command,marks,prompt,answer)=>({id,section,command,marks,prompt,marking:[mark(answer,marks)],modelAnswer:answer,revisitType:'spec',levelOfResponse:marks===6});
   pack.questions=[make('review-short','Short response','Describe',2,`Describe the main process or model in ${model.title.toLowerCase()}.`,core),make('review-precision','Accuracy check','Explain',4,model.reviewPractice?.[1]?.question||`Explain this accuracy check: ${model.misconception}`,`${model.misconception} ${core}`),make('review-extended','Extended explanation','Explain',6,`Explain ${model.title.toLowerCase()} in a linked response. Include the scientific mechanism and justify the accuracy check: ${model.misconception}`,`${core} ${model.misconception}`)];
   const skill=window.REVISION_SKILLS?.build(`gcse:${model.topicId}`,0);if(skill)pack.questions.push(make('review-data','Topic data practice','Calculate',4,skill.question,skill.steps.join(' ')));
   pack.totalMarks=pack.questions.reduce((n,q)=>n+q.marks,0);return pack;};}
 window.GCSE_REVIEWED_ASSESSMENT={score:(points,checked,max)=>Math.min(max,[...new Set(checked)].reduce((sum,i)=>sum+(points[i]?.marks||0),0))};
})();
