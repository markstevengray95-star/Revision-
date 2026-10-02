(() => {
  'use strict';
  const $=id=>document.getElementById(id), ui=window.REVISION_ACTIVITY_UI;
  let context, step=0, draftId=null;
  const fields=['assignment-class','assignment-type','assignment-title','assignment-notes','assignment-due','activity-level','activity-subject','activity-pathway','activity-topic','activity-kind','activity-count','activity-format','activity-demand','activity-writing','activity-attempts','activity-feedback','activity-late','work-start','work-target','work-duration','work-mode','work-audience','work-lesson'];
  const steps=[];
  function field(title,id,type,value) {
    const l=ui.el('label',title), input=ui.el('input');input.id=id;input.type=type;input.value=value ?? '';l.append(input);return l;
  }
  function select(title,id,options) {
    const l=ui.el('label',title), s=ui.el('select');s.id=id;options.forEach(([value,text])=>s.append(new Option(text,value)));l.append(s);return l;
  }
  function go(index,validate=false) {
    if(validate) for(const f of steps[step].querySelectorAll('input,select,textarea')) if(!f.checkValidity()) {f.reportValidity();return;}
    step=Math.max(0,Math.min(4,index));steps.forEach((s,i)=>s.hidden=i!==step);
    $('work-step-title').textContent=`${step+1} of 5 · ${['Choose class','Choose curriculum topic','Choose activity','Choose students','Settings and preview'][step]}`;
    $('work-prev').disabled=step===0;$('work-next').hidden=step===4;$('assignment-submit').hidden=step!==4;
  }
  function init(api) {
    context=api;
    const form=$('assignment-form'), header=ui.el('h3');header.id='work-step-title';form.prepend(header);
    for(let i=0;i<5;i++) { const s=ui.el('div',undefined,'teacher-form wizard-step');steps.push(s);form.append(s); }
    const move=(id,index)=>steps[index].append($(id).closest('label'));
    move('assignment-class',0);move('assignment-type',2);
    ['activity-level','activity-subject','activity-pathway','activity-topic'].forEach(id=>move(id,1));
    steps[1].append(select('Subtopic / lesson','work-lesson',[['','All lessons in this topic']]));
    steps[2].append(select('Activity','work-mode',[['lesson','Revision lesson'],['quiz','Quiz'],['flashcards','Flashcards + recall check'],['exam','Exam questions'],['test','Topic test'],['mixed','Mixed assignment']]));
    const ready=ui.el('section');ready.append(ui.el('h3','Auto-marked homework'),ui.el('p','Choose a ready-made set, then review the generated questions before assigning.','panel-copy'));
    for(const [title,format,kind,count] of [['Recall check','choice','quiz',8],['Mixed automatic questions','objective','revision',12],['Calculation practice','calculation','exam',10]]){
      const b=ui.button(title,'automatic-preset','','teacher-button');b.onclick=()=>{$('activity-format').value=format;$('activity-kind').value=kind;$('activity-count').value=count;$('activity-writing').checked=false;$('work-mode').value=kind==='quiz'?'quiz':kind==='exam'?'exam':'mixed';$('work-lesson').value='';$('activity-format').dispatchEvent(new Event('change'));go(4);$('activity-generate').click();};ready.append(b);
    }steps[2].append(ready);
    $('activity-kind').closest('label').hidden=true;move('activity-kind',2);move('activity-count',2);move('activity-format',2);move('activity-demand',2);move('activity-writing',2);
    steps[3].append(select('Assign to','work-audience',[['all','Whole class'],['selected','Selected students']]),ui.el('div'));
    steps[3].lastChild.id='work-recipients';
    const extra=ui.el('details');extra.append(ui.el('summary','Also set to other classes'),ui.el('div'));extra.lastChild.id='work-extra-classes';steps[0].append(extra);
    ['assignment-title','assignment-notes','assignment-due','activity-attempts','activity-feedback','activity-late'].forEach(id=>move(id,4));
    steps[4].append(field('Start date and time (leave blank to release now)','work-start','datetime-local',''),field('Target score (%)','work-target','number',75),field('Estimated duration (minutes)','work-duration','number',15));
    $('work-target').min=0;$('work-target').max=100;$('work-duration').min=1;$('work-duration').max=240;
    for(const id of ['activity-generate','activity-preview-summary','activity-preview']) steps[4].append($(id));
    steps[4].append(form.querySelector('.custom-question'));
    const tips=form.querySelector('.activity-builder .panel-copy');if(tips)steps[4].append(tips);
    form.querySelectorAll('.form-grid,.activity-builder').forEach(n=>{if(!n.children.length)n.remove();});
    const nav=ui.el('div',undefined,'workspace-controls');
    for(const [id,text] of [['work-prev','Back'],['work-next','Next'],['work-save','Save as draft']]) {const b=ui.button(text,id,'','teacher-button');b.id=id;nav.append(b);}
    nav.append($('assignment-submit'));form.append(nav);form.noValidate=true;
    $('work-prev').onclick=()=>go(step-1);$('work-next').onclick=()=>go(step+1,true);$('work-save').onclick=saveDraft;
    $('work-mode').onchange=()=>{
      const mode=$('work-mode').value; $('activity-kind').value=['exam','test'].includes(mode)?'exam':['lesson','mixed'].includes(mode)?'revision':'quiz';
      $('activity-kind').dispatchEvent(new Event('change'));$('activity-count').value=mode==='test'?12:mode==='flashcards'?5:6;
      $('activity-writing').checked=['exam','test'].includes(mode);$('activity-writing').dispatchEvent(new Event('change'));
      $('activity-feedback').value=['lesson','flashcards'].includes(mode)?'immediate':'after_final_attempt';
    };
    $('assignment-class').addEventListener('change',()=>{render();});$('work-audience').onchange=renderRecipients;
    for(const id of ['activity-topic','activity-level','activity-subject','activity-pathway']) $(id).addEventListener('change',()=>setTimeout(renderLessons,0));
    $('work-lesson').onchange=()=>window.REVISION_TEACHER_ACTIVITIES.invalidate();
    const drafts=ui.el('section',undefined,'teacher-panel');drafts.id='work-drafts';$('workspace-set-work').append(drafts);
    $('work-mode').value='quiz';go(0);renderLessons();
  }
  function renderLessons() {
    const s=$('work-lesson'),previous=s.value;
    s.replaceChildren(new Option('All lessons in this topic',''));
    window.REVISION_PRACTICE.lessons.filter(l=>l.level===$('activity-level').value && l.subject===$('activity-subject').value && l.topic===$('activity-topic').value && ($('activity-level').value!=='gcse'||$('activity-pathway').value==='triple'||l.scope!=='triple')).forEach(l=>s.append(new Option(l.title,l.id)));
    if([...s.options].some(o=>o.value===previous))s.value=previous;
  }
  function renderRecipients() {
    const list=$('work-recipients'), checked=new Set([...list.querySelectorAll('input:checked')].map(i=>i.value));list.replaceChildren();
    list.hidden=$('work-audience').value==='all';
    const gid=$('work-audience').value.startsWith('group:')?$('work-audience').value.slice(6):null;if(gid){checked.clear();(context.state.interventionMembers||[]).filter(m=>m.group_id===gid).forEach(m=>checked.add(m.student_id));}
    context.state.members.filter(m=>m.class_id===$('assignment-class').value&&m.status==='joined').forEach(m=>{const l=ui.el('label',undefined,'checkbox-label'),i=ui.el('input');i.type='checkbox';i.value=m.student_id;i.checked=checked.has(m.student_id);l.append(i,ui.el('span',m.display_name||m.student_email||'Student'));list.append(l);});
    if(!list.children.length)list.append(ui.el('p','Students must join the class before you can target them individually.','panel-copy'));
  }
  function render() {
    if(!context)return;
    const extra=$('work-extra-classes'),selected=new Set([...extra.querySelectorAll('input:checked')].map(i=>i.value));extra.replaceChildren();
    context.state.classes.filter(c=>!c.archived).forEach(c=>{const l=ui.el('label',undefined,'checkbox-label'),i=ui.el('input');i.type='checkbox';i.value=c.id;i.checked=selected.has(c.id);l.append(i,ui.el('span',c.name));extra.append(l);});
    const audience=$('work-audience'),current=audience.value;audience.replaceChildren(new Option('Whole class','all'),new Option('Selected students','selected'),...(context.state.interventionGroups||[]).filter(g=>g.class_id===$('assignment-class').value).map(g=>new Option(g.name,'group:'+g.id)));if([...audience.options].some(o=>o.value===current))audience.value=current;
    renderRecipients();renderLessons();
    const target=$('work-drafts');target.replaceChildren(ui.el('h2','Saved drafts and previous homework'));
    for(const d of context.state.teacherDrafts||[]) {const b=ui.button(d.title,'load-draft',d.id,'teacher-button');b.onclick=()=>restore(d.payload,d.id);target.append(b);const del=ui.button('Delete draft','delete-draft',d.id);del.onclick=async()=>{if(!confirm('Delete this draft?'))return;const r=await revisionSupabase.from('revision_teacher_drafts').delete().eq('id',d.id);if(r.error)context.showNotice(r.error.message,'error');else context.loadTeacherData();};target.append(del);}
    const reuse=select('Reuse previous homework','work-reuse',[['','Choose an assignment'],...context.state.assignments.map(a=>[a.id,a.title])]);target.append(reuse);
    $('work-reuse').onchange=async()=>{if(!$('work-reuse').value)return;const r=await revisionSupabase.rpc('revision_teacher_template',{aid:$('work-reuse').value});if(r.error)return context.showNotice(r.error.message,'error');const t=r.data;window.REVISION_TEACHER_ACTIVITIES.setPreview(t.activity);$('assignment-class').value=t.meta.class_id;$('assignment-title').value=t.meta.title+' (copy)';$('assignment-notes').value=t.meta.instructions;$('activity-attempts').value=t.activity.attempts_limit;$('activity-feedback').value=t.activity.feedback_mode;$('activity-late').checked=t.activity.allow_late;$('work-target').value=t.meta.target_score;$('work-duration').value=t.meta.estimated_minutes;$('work-mode').value=t.meta.activity_mode;go(4);window.REVISION_TEACHER_WORKSPACE.show('set-work');};
  }
  function snapshot() {return {fields:Object.fromEntries(fields.map(id=>[id,$(id).type==='checkbox'?$(id).checked:$(id).value])),preview:window.REVISION_TEACHER_ACTIVITIES.getPreview(),recipients:[...$('work-recipients').querySelectorAll('input:checked')].map(i=>i.value),classes:[...$('work-extra-classes').querySelectorAll('input:checked')].map(i=>i.value)};}
  async function saveDraft() {
    const payload=snapshot(),title=$('assignment-title').value.trim()||'Untitled homework';
    let query=revisionSupabase.from('revision_teacher_drafts')[draftId?'update':'insert']({teacher_id:context.state.user.id,title,payload}); if(draftId)query=query.eq('id',draftId); const r=await query;
    if(r.error)context.showNotice(r.error.message,'error');else{context.showNotice('Draft saved.');await context.loadTeacherData();}
  }
  function restore(payload,id=null) {
    draftId=id;
    const v=payload.fields||{};
    for(const key of ['assignment-class','activity-level','activity-subject','activity-pathway']) if(v[key]!==undefined){$(key).value=v[key];$(key).dispatchEvent(new Event('change'));}
    for(const [key,value] of Object.entries(v))if($(key)){if($(key).type==='checkbox')$(key).checked=value;else $(key).value=value;}
    renderLessons();if(v['work-lesson'])$('work-lesson').value=v['work-lesson'];renderRecipients();
    for(const i of $('work-recipients').querySelectorAll('input'))i.checked=(payload.recipients||[]).includes(i.value);
    for(const i of $('work-extra-classes').querySelectorAll('input'))i.checked=(payload.classes||[]).includes(i.value);
    window.REVISION_TEACHER_ACTIVITIES.setPreview(payload.preview);go(0);window.REVISION_TEACHER_WORKSPACE.show('set-work');
  }
  function metadata(meta) {
    for(const f of $('assignment-form').querySelectorAll('input,select,textarea')) if(!f.checkValidity()){go(steps.findIndex(s=>s.contains(f)));f.reportValidity();throw Error('Complete the highlighted field.');}
    const selected=$('work-audience').value!=='all'?snapshot().recipients:null;
    if(selected&&!selected.length)throw Error('Select at least one joined student.');
    const extras=snapshot().classes.filter(id=>id!==meta.class_id);
    if(selected&&extras.length)throw Error('Individual student targeting supports one class at a time.');
    const base={...meta,start_at:$('work-start').value?new Date($('work-start').value).toISOString():new Date().toISOString(),recipient_ids:selected,target_score:Number($('work-target').value),estimated_minutes:Number($('work-duration').value),activity_mode:$('work-mode').value};
    return [meta.class_id,...extras].map(class_id=>({...base,class_id}));
  }
  async function afterAssigned() {if(draftId){await revisionSupabase.from('revision_teacher_drafts').delete().eq('id',draftId);draftId=null;}go(0);}
  window.REVISION_SET_WORK={init,render,metadata,snapshot,restore,go,afterAssigned};
})();
