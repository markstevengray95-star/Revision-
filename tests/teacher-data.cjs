const assert=require('node:assert/strict');
const d=require('../shared/teacher-data.js');
const state={classes:[{id:'c'}],members:[{class_id:'c',student_id:'s',status:'joined'},{class_id:'c',student_id:'z',status:'joined'}],assignments:[{id:'a',class_id:'c',status:'active',due_at:'2020-01-01',max_points:10}],attempts:[{assignment_id:'a',student_id:'s',attempt_no:1,score:2,total_max:10,review_state:'complete'},{assignment_id:'a',student_id:'s',attempt_no:2,score:8,total_max:10,review_state:'pending'}],submissions:[],drafts:[]};
assert.equal(d.latest(state.attempts)[0].attempt_no,2);
assert.equal(d.result(state,state.assignments[0],'s').score,null,'Pending review must not inflate averages');
assert.equal(d.overview(state).overdue,1);
state.attempts[1].review_state='complete';assert.equal(d.overview(state).average,80);
state.assignments[0].recipient_ids=['s'];assert.equal(d.recipients(state,state.assignments[0]).length,1);assert.equal(d.overview(state).overdue,0);
assert.equal(d.percent(null,10),null);assert.equal(d.percent(0,10),0);
console.log('Teacher data passed: latest attempt, pending review, recipient scopes, overdue students and averages.');

state.activities=[{assignment_id:'a',topic_key:'gcse:physics:p1',topic_title:'Energy'}];
const book=d.markbook(state,{classId:'c',view:'topic'});assert.equal(book.rows[0].average,80);assert.equal(book.rows[1].values[0].status,'Not assigned');assert.equal(book.rows[1].average,null);assert.equal(d.markbook(state,{classId:'c',from:'2099-01-01'}).columns.length,0);

state.activities[0].questions=[{id:'q',marks:2,title:'Energy stores',type:'choice'}];state.attempts[1].class_id='c';state.attempts[1].marks=[{id:'q',awarded:1,max_marks:2}];assert.equal(d.mastery(state,'c')[0].score,50);assert.equal(d.mastery(state,'c')[0].studentCount,1);assert.equal(d.mastery(state,'c','skill')[0].title,'recall');state.attempts[1].marks[0].awarded=null;assert.equal(d.mastery(state,'c').length,0);
