(() => {
 'use strict';
 const $=id=>document.getElementById(id),{el,button}=window.REVISION_ACTIVITY_UI,data=window.REVISION_TEACHER_DATA;
 let context;
 function init(api){context=api;const target=$('insights-content'),controls=el('div',undefined,'workspace-controls');
  for(const [id,title]of [['insights-class','Class'],['insights-dimension','Evidence view']]){const label=el('label',title),s=el('select');s.id=id;s.setAttribute('aria-label',title);label.append(s);controls.append(label);}
  for(const [v,t]of [['topic','Topics'],['subtopic','Subtopics'],['skill','Skills']])$('insights-dimension')?.append(new Option(t,v));
  target.append(controls,el('p','Practice mastery = marked question points earned / points available, using the latest attempt per assignment. Small samples and pending written marks need teacher judgement.','panel-copy'));
  const list=el('div');list.id='insights-list';target.append(list);
  $('insights-dimension').replaceChildren(new Option('Topics','topic'),new Option('Subtopics','subtopic'),new Option('Skills','skill'));
  controls.querySelectorAll('select').forEach(s=>s.onchange=draw);
 }
 function render(){if(!context)return;const s=$('insights-class'),v=s.value;s.replaceChildren(...context.state.classes.map(c=>new Option(c.name,c.id)));if([...s.options].some(o=>o.value===v))s.value=v;draw();}
 function draw(){const cid=$('insights-class').value,rows=data.mastery(context.state,cid,$('insights-dimension').value),target=$('insights-list');target.replaceChildren();
  if(!rows.length){target.append(el('p','No marked question evidence yet. Set work and review any written responses to populate this view.'));return;}
  for(const r of rows){const card=el('article',undefined,'teacher-panel'),head=el('h3',`${r.title} · ${r.score}%`);head.className=r.score>=75?'mastery-high':r.score>=50?'mastery-mid':'mastery-low';card.append(head,el('p',`${r.studentCount} students · ${r.responses} marked responses · ${r.awarded}/${r.max} points`));
   const gap=el('details');gap.append(el('summary','View students and questions to revisit'));
   const weak=[...r.weakStudents].map(id=>context.state.members.find(m=>m.class_id===cid&&m.student_id===id)).filter(Boolean);
   weak.forEach(m=>{const b=button(m.display_name||m.student_email||'Student','insight-student',m.id);b.onclick=()=>window.REVISION_TEACHER_WORKSPACE.profile(m);gap.append(b);});
   const questions=new Map();for(const e of r.evidence){if(e.awarded>=e.max)continue;const key=e.assignmentId+':'+e.questionId,entry=questions.get(key)||{e,students:new Set()};entry.students.add(e.studentId);questions.set(key,entry);}
   [...questions.values()].sort((a,b)=>b.students.size-a.students.size).slice(0,5).forEach(x=>{gap.append(el('p',`${x.students.size} students lost marks: ${x.e.question.prompt}`));if(x.e.question.misconception)gap.append(el('p','Teaching check / possible misconception: '+x.e.question.misconception,'panel-copy'));if(x.e.question.specification)gap.append(el('p','Specification reference: '+x.e.question.specification,'question-meta'));});
   card.append(gap);
   if(weak.length){const b=button('Assign intervention','insight-intervention',r.id,'teacher-button');b.onclick=()=>targetWork(cid,weak.map(m=>m.student_id),r);card.append(b);}target.append(card);
  }
 }
 function targetWork(cid,ids,row){window.REVISION_TEACHER_WORKSPACE.show('set-work');$('assignment-class').value=cid;$('assignment-class').dispatchEvent(new Event('change'));
  const topic=(row.topic||'').split(':');if(topic.length>=3){$('activity-level').value=topic[0];$('activity-subject').value=topic[1];$('activity-subject').dispatchEvent(new Event('change'));$('activity-topic').value=topic.slice(2).join(':');$('activity-topic').dispatchEvent(new Event('change'));}
  $('work-audience').value='selected';$('work-audience').dispatchEvent(new Event('change'));for(const i of $('work-recipients').querySelectorAll('input'))i.checked=ids.includes(i.value);
  $('work-mode').value='lesson';$('work-mode').dispatchEvent(new Event('change'));$('assignment-title').value=(`${row.title} · intervention`).slice(0,120);window.REVISION_SET_WORK.go(2);
 }
 window.REVISION_INSIGHTS={init,render,targetWork};
})();
