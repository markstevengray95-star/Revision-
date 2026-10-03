(() => {
 'use strict';
 const $=id=>document.getElementById(id),ui=window.REVISION_ACTIVITY_UI,F=window.REVISION_HOMEWORK_FOLLOWUPS;
 let context,prepared=null,token=null,generation=0,owner=null;
 function select(label,id,options){const l=ui.el('label',label),s=ui.el('select');s.id=id;for(const [v,t]of options)s.append(new Option(t,v));l.append(s);return l;}
 function clear(){generation++;prepared=null;token=null;owner=null;$('repeat-preview')?.replaceChildren();}
 function init(api){
  context=api;const panel=ui.el('section',undefined,'teacher-panel');panel.id='repeat-panel';
  panel.append(ui.el('h2','Corrections and spaced retrieval'),ui.el('p','Choose fully marked homework, review the students and tasks, then approve the plan. Corrections revisit lost marks. Retrieval deliberately repeats selected questions from the source homework at 1, 7 and 21 days; it prioritises previous mistakes. Unmarked latest attempts are excluded.','panel-copy'));
  const controls=ui.el('div',undefined,'workspace-controls');
  controls.append(select('Source homework','repeat-source',[['','Choose marked homework']]),select('Follow-up type','repeat-mode',[['both','Corrections + spaced retrieval'],['corrections','Corrections only'],['spaced','Spaced retrieval only']]));
  const label=ui.el('label','First retrieval date'),date=ui.el('input');date.type='date';date.id='repeat-first';const d=new Date();d.setDate(d.getDate()+1);date.value=new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);label.append(date);controls.append(label);panel.append(controls);
  panel.append(ui.el('p','Corrections release immediately and are due on the first retrieval date. Retrieval releases at 08:00 on that date, 6 days later and 20 days later, with two days to complete each task. Dates use your local time.','panel-copy'));
  const students=ui.el('fieldset');students.id='repeat-students';students.append(ui.el('legend','Students with fully marked latest attempts'));panel.append(students);
  const generate=ui.button('Preview corrections and retrieval','preview-repeat','','teacher-button');generate.id='repeat-generate';generate.onclick=()=>build(generate);panel.append(generate);
  const preview=ui.el('div');preview.id='repeat-preview';preview.setAttribute('aria-live','polite');panel.append(preview);$('workspace-insights').append(panel);
  $('repeat-source').onchange=()=>{clear();renderStudents();};$('repeat-mode').onchange=clear;$('repeat-first').onchange=clear;
 }
 function source(){return context.state.assignments.find(a=>a.id===$('repeat-source').value);}
 function renderStudents(){
  const box=$('repeat-students'),a=source(),previous=new Set([...box.querySelectorAll('input:checked')].map(i=>i.value)),same=box.dataset.source===a?.id;
  box.dataset.source=a?.id||'';box.replaceChildren(ui.el('legend','Students with fully marked latest attempts'));
  const eligible=a?F.eligible(context.state,a):[];
  for(const {member,attempt}of eligible){const l=ui.el('label',undefined,'checkbox-label'),i=ui.el('input');i.type='checkbox';i.value=member.student_id;i.checked=same?previous.has(i.value):true;i.onchange=clear;l.append(i,ui.el('span',(member.display_name||'Student')+' · '+Math.round(100*attempt.score/attempt.total_max)+'%'));box.append(l);}
  if(!eligible.length)box.append(ui.el('p','Choose homework with fully marked latest attempts.'));
  $('repeat-generate').disabled=!eligible.length;
 }
 function render(){
  if(!context)return;const s=$('repeat-source'),value=s.value;
  const sources=context.state.assignments.filter(a=>context.state.activities.some(v=>v.assignment_id===a.id)&&F.eligible(context.state,a).length);
  s.replaceChildren(new Option('Choose marked homework',''),...sources.map(a=>new Option(a.title,a.id)));
  if(sources.some(a=>a.id===value))s.value=value;else clear();
  const a=source();if(prepared&&(!a||owner!==context.state.user?.id||prepared.signature!==F.signature(context.state,a)))clear();renderStudents();
 }
 async function build(b){
  clear();const a=source(),uid=context.state.user?.id,version=generation,ids=[...$('repeat-students').querySelectorAll('input:checked')].map(i=>i.value);
  if(!a||!ids.length)return context.showNotice('Choose marked homework and at least one student.','error');
  const before=F.signature(context.state,a);b.disabled=true;
  try{
   const response=await revisionSupabase.rpc('revision_teacher_template',{aid:a.id});
   if(version!==generation||uid!==context.state.user?.id||a.id!==$('repeat-source').value)return;
   if(response.error)throw response.error;
   if(before!==F.signature(context.state,a))throw Error('Results changed while loading. Generate a new preview.');
   prepared=F.build({state:context.state,source:a,template:response.data.activity,studentIds:ids,mode:$('repeat-mode').value,firstDate:$('repeat-first').value});
   owner=uid;token=crypto.randomUUID();showPlan();
  }catch(e){if(uid===context.state.user?.id){clear();context.showNotice(e.message,'error');}}
  finally{if(uid===context.state.user?.id&&version===generation)b.disabled=false;else renderStudents();}
 }
 function showPlan(){
  const box=$('repeat-preview');box.replaceChildren();box.append(ui.el('h3',`${prepared.students} students · ${prepared.corrections} correction tasks · ${prepared.retrieval} retrieval tasks`));
  if(!prepared.plan.length){box.append(ui.el('p','These students have no lost marks to correct. Choose spaced retrieval to revisit the work.'));return;}
  for(const entry of prepared.plan){const detail=ui.el('details');detail.append(ui.el('summary',`${entry.student.display_name||'Student'} · ${entry.label} · ${entry.activity.questions.length} questions`));const dates=new Intl.DateTimeFormat(undefined,{dateStyle:'medium',timeStyle:'short'});detail.append(ui.el('p','Release: '+dates.format(new Date(entry.meta.start_at))+' · Due: '+dates.format(new Date(entry.meta.due_at))));
   for(const q of entry.activity.questions){detail.append(ui.el('h4',q.prompt));const fig=ui.taskFigure(q);if(fig)detail.append(fig);if(q.type==='choice')for(const option of q.options)detail.append(ui.el('p',option.text));const scheme=ui.el('details');scheme.append(ui.el('summary','Teacher mark scheme'),ui.el('p',q.key.solution.join('\n')));detail.append(scheme);}
   box.append(detail);
  }
  const approve=ui.button('Approve and schedule follow-ups','approve-repeat','','teacher-button primary');approve.onclick=()=>assign(approve);box.append(approve);
 }
 async function assign(b){
  const a=source(),uid=context.state.user?.id;
  if(!prepared||owner!==uid||!a||prepared.signature!==F.signature(context.state,a)){clear();return context.showNotice('Results changed. Generate a new preview before assigning.','error');}
  const plan=prepared.plan.map(({meta,activity})=>({meta,activity})),requestToken=token;b.disabled=true;
  try{const r=await revisionSupabase.rpc('revision_assign_followups',{p_source_id:a.id,p_plan:plan,p_token:requestToken});if(uid!==context.state.user?.id)return;if(r.error)throw r.error;clear();context.showNotice(`${r.data.length} correction and retrieval tasks scheduled.`);await context.loadTeacherData();}
  catch(e){if(uid===context.state.user?.id)context.showNotice(e.message,'error');}
  finally{if(uid===context.state.user?.id)b.disabled=false;}
 }
 window.REVISION_HOMEWORK_FOLLOWUP_UI={init,render,clear};
})();
