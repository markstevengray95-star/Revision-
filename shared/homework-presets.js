/* Homework templates reuse the reviewed activity bank and its private answer keys. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.REVISION_HOMEWORK_PRESETS=api;})(typeof window==='object'?window:globalThis,()=>{
 'use strict';
 const list=[
  {id:'retrieval',title:'10-minute retrieval',description:'Ten knowledge checks from your selected topic.',count:10,minutes:10,mode:'quiz',kind:'quiz',format:'choice',writing:false,feedback:'after_final_attempt',instructions:'Answer the retrieval questions from memory, then use the released feedback to check your understanding.'},
  {id:'recap',title:'Last lesson recap',description:'Choose the lesson you just taught for a short recall check.',count:3,minutes:5,mode:'quiz',kind:'quiz',format:'choice',writing:false,feedback:'after_final_attempt',instructions:'Recall the key ideas from our last lesson. Complete the questions before checking the feedback.'},
  {id:'weekly',title:'Weekly mixed revision',description:'Revisit the current topic alongside up to three older topics you have taught.',count:12,minutes:15,mode:'quiz',kind:'quiz',format:'choice',writing:false,feedback:'after_final_attempt',instructions:'Complete a mix of this week’s topic and earlier learning. Use the feedback to identify what needs another look.'},
  {id:'equations',title:'Equation practice',description:'Practise calculations with fresh values. Choose a topic that contains calculations.',count:8,minutes:15,mode:'exam',kind:'exam',format:'calculation',writing:false,feedback:'after_final_attempt',instructions:'Choose an equation, rearrange where needed and calculate your answer. Show your working on paper; this task marks the final numerical answer.'},
  {id:'exam',title:'Exam preparation',description:'Mix recall, calculations where available and written exam responses for teacher review.',count:10,minutes:20,mode:'exam',kind:'exam',format:'auto',writing:true,feedback:'after_final_attempt',instructions:'Answer the exam practice questions. Show calculation working on paper and use linked scientific explanations for written responses.'}
 ];
 const get=id=>list.find(p=>p.id===id);
 function generate(bank,settings,{presetId='',olderTopics=[]}={}){
  const p=get(presetId);
  if(!p)return bank.generate(settings);
  if(p.id==='recap'&&!settings.lessonIds?.length)throw Error('Choose the lesson you just taught for Last lesson recap.');
  if(p.id==='equations'&&settings.lessonIds?.length)throw Error('Choose All lessons in this topic for Equation practice.');
  if(p.id!=='weekly')return {...bank.generate(settings),homework_preset:p.id};
  const valid=new Map(bank.topics(settings.level,settings.subject,settings.pathway).filter(t=>t.id!=='all').map(t=>[t.id,t.title]));
  const older=[...new Set(olderTopics)].filter(t=>t!==settings.topic);
  if(!valid.has(settings.topic)||older.length<1||older.length>3||older.some(t=>!valid.has(t)))throw Error('Weekly mixed revision needs a current topic and 1–3 different older topics from this course.');
  if(!Number.isInteger(settings.count)||settings.count<6||settings.count>60)throw Error('Choose 6–60 questions for weekly mixed revision.');
  if(settings.lessonIds?.length)throw Error('Choose All lessons in this topic for weekly mixed revision.');
  const topics=[settings.topic,...older],quotas=topics.map(()=>1);
  // Keep roughly half the work on the current topic; distribute the rest fairly.
  quotas[0]=Math.max(3,Math.ceil(settings.count/2));
  let remaining=settings.count-quotas[0];
  for(let i=1;i<topics.length;i++){quotas[i]=Math.floor(remaining/(topics.length-i));remaining-=quotas[i];}
  const used=new Set(),questions=[],parts=[];
  topics.forEach((topic,i)=>{
   const activity=bank.generate({...settings,topic,lessonIds:undefined,count:Math.max(3,quotas[i]),seed:(settings.seed||0)+i*97});
   const chosen=activity.questions.filter(q=>!used.has(q.prompt)).slice(0,quotas[i]);
   if(chosen.length<quotas[i])throw Error('These topics do not provide enough distinct questions. Reduce the size or choose different topics.');
   chosen.forEach(q=>{used.add(q.prompt);questions.push({...q,id:'q'+(questions.length+1)});});parts.push(activity);
  });
  return {...parts[0],topic:'all',topicTitle:topics.map(t=>valid.get(t)).join(' + '),questions:bank.shuffle(questions,(settings.seed||0)+7),homework_preset:p.id};
 }
 return {list,get,generate};
});
