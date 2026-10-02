(() => {
 'use strict';
 const $=id=>document.getElementById(id),{el,button,downloadCSV}=window.REVISION_ACTIVITY_UI,data=window.REVISION_TEACHER_DATA;
 let context,book;
 function select(label,id,values){const l=el('label',label),s=el('select');s.id=id;s.setAttribute('aria-label',label);values.forEach(([v,t])=>s.append(new Option(t,v)));l.append(s);return l;}
 function init(api){context=api;const target=$('markbook-content'),controls=el('div',undefined,'workspace-controls');
  controls.append(select('Class','markbook-class',[]),select('View','markbook-view',[['assignment','Assignment'],['topic','Topic'],['student','Student']]),select('Student','markbook-student',[['','All students']]),select('Period (assignment due date)','markbook-period',[['all','All time'],['week','Last 7 days'],['month','Last 30 days'],['custom','Custom dates']]));
  for(const [id,title]of [['markbook-from','From'],['markbook-to','To']]){const l=el('label',title),i=el('input');i.type='date';i.id=id;i.setAttribute('aria-label',title);l.append(i);controls.append(l);}
  controls.querySelectorAll('select,input').forEach(i=>i.onchange=()=>{if(i.id==='markbook-class')fillStudents();if(i.id==='markbook-period')period();draw();});
  target.append(controls,el('p','Green: 75%+ · Amber: 50–74% · Red: below 50%. Pending reviews are excluded from averages.','panel-copy'));
  const exportBar=el('div',undefined,'workspace-controls');for(const [format,title]of [['csv','Export CSV'],['xlsx','Export Excel'],['pdf','Print / Save PDF']]){const b=button(title,'export-markbook',format,'teacher-button');b.onclick=()=>exportBook(format);exportBar.append(b);}target.append(exportBar);
  const table=el('div',undefined,'workspace-table-wrap');table.id='markbook-table';target.append(table);
 }
 function fillStudents(){const s=$('markbook-student'),value=s.value;s.replaceChildren(new Option('All students',''));context.state.members.filter(m=>m.class_id===$('markbook-class').value&&m.status==='joined').forEach(m=>s.append(new Option(m.display_name||m.student_email||'Student',m.student_id)));if([...s.options].some(o=>o.value===value))s.value=value;}
 function period(){const v=$('markbook-period').value;if(v==='all'){$('markbook-from').value='';$('markbook-to').value='';}else if(v!=='custom'){const now=new Date(),from=new Date(now);from.setDate(from.getDate()-(v==='week'?7:30));const date=d=>new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,10);$('markbook-from').value=date(from);$('markbook-to').value=date(now);}}
 function render(){if(!context)return;const s=$('markbook-class'),v=s.value;s.replaceChildren(...context.state.classes.map(c=>new Option(c.name,c.id)));if([...s.options].some(o=>o.value===v))s.value=v;fillStudents();draw();}
 function draw(){const view=$('markbook-view').value;book=data.markbook(context.state,{classId:$('markbook-class').value,view:view==='student'?'assignment':view,studentId:$('markbook-student').value,from:$('markbook-from').value,to:$('markbook-to').value});
  const target=$('markbook-table');target.replaceChildren();if(!book.rows.length||!book.columns.length){target.append(el('p','Choose a class with joined students and assignments in this period.'));return;}
  const table=el('table',undefined,'workspace-table'),head=el('thead'),tr=el('tr');for(const title of ['Student',...book.columns.map(c=>c.title),'Average']){const th=el('th',title);th.scope='col';tr.append(th);}head.append(tr);table.append(head);const body=el('tbody');table.append(body);
  for(const r of book.rows){const row=el('tr'),name=el('th',r.member.display_name||r.member.student_email||'Student');name.scope='row';row.append(name);for(const v of [...r.values,{score:r.average,status:'Average of marked results'}]){const cell=el('td',v.score===null?v.status==='Not assigned'?'Not assigned':v.status==='Needs review'?'Needs review':'—':v.score+'%');cell.title=v.status;cell.className=v.score===null?'':v.score>=75?'mastery-high':v.score>=50?'mastery-mid':'mastery-low';row.append(cell);}body.append(row);}target.append(table);
 }
 function exportRows(){return [['Student',...book.columns.map(c=>c.title),'Average'],...book.rows.map(r=>[r.member.display_name||r.member.student_email||'Student',...r.values.map(v=>v.score??v.status),r.average??''])];}
 function exportBook(format){if(!book?.rows.length)return context.showNotice('No results in this view to export.','info');const rows=exportRows();if(format==='csv')downloadCSV('spark-markbook.csv',rows);else if(format==='xlsx')window.REVISION_TEACHER_EXPORT.download('spark-markbook.xlsx',window.REVISION_TEACHER_EXPORT.xlsx(rows));else{document.body.classList.add('print-markbook');window.print();document.body.classList.remove('print-markbook');}}
 window.REVISION_MARKBOOK={init,render};
})();
