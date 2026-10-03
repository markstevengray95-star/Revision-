// All explanations, examples and answers are supplied by authors.
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
function lesson(title,explanation,method,prompt,steps,misconception,questions,exam,tier){return {id:slug(title),title,tier,objectives:[`Explain and apply ${title.toLowerCase()}.`,`Use the worked method, then attempt the practice independently.`],sections:[{heading:'Understand the ideas',text:explanation},{heading:'Apply the method',text:method}],worked:{prompt,steps},misconception,questions,exam:{prompt:exam[0],model:exam[1]}};}
function topic(subject,title,summary,lessons,option){return {id:subject+'-'+slug(title),title,summary,option,lessons:lessons.map(l=>({...l,id:subject+'-'+l.id}))};}
const q=(prompt,answer,model,type='number',extra={})=>({prompt,answer,model,type,...extra});
const w=(prompt,model)=>({prompt,type:'written',model});
module.exports={lesson,topic,q,w};
