/* Shared, testable rules for self-study completion and judging supplied answers. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RevisionQuestionBank=api;})(typeof globalThis==='object'?globalThis:this,()=>{
 'use strict';
 const integer=(value,max)=>typeof value==='number'&&Number.isInteger(value)&&value>=0&&value<=max;
 function complete(set,draft){return set.parts.every(part=>typeof draft?.answers?.[part.label]==='string'&&draft.answers[part.label].trim().length>0||typeof draft?.sketches?.[part.label]==='string'&&draft.sketches[part.label].startsWith('data:image/png;base64,'));}
 function award(examples,selections){if(examples.length!==selections.length||selections.some((n,i)=>!integer(n,examples[i].max)))return null;return {correct:selections.filter((n,i)=>n===examples[i].score).length,total:examples.length};}
 function selfScore(set,marks){if(set.parts.some(p=>!integer(marks?.[p.label],p.marks)))return null;return {score:set.parts.reduce((n,p)=>n+marks[p.label],0),max:set.marks};}
 function canMark(set){return set.markingExamples.length>=2&&set.markingExamples.every(e=>integer(e.score,e.max)&&set.parts.filter(p=>e.label.split(' & ').includes(p.label)).reduce((n,p)=>n+p.marks,0)===e.max);}
 function safeDraft(set,value){if(!value||typeof value!=='object'||Array.isArray(value))return {answers:{},sketches:{}};const draft={answers:{},sketches:{},selfMarks:{}};for(const p of set.parts){const a=value.answers?.[p.label],s=value.sketches?.[p.label];if(typeof a==='string')draft.answers[p.label]=a.slice(0,40000);if(typeof s==='string'&&s.length<600000&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(s))draft.sketches[p.label]=s;if(integer(value.selfMarks?.[p.label],p.marks))draft.selfMarks[p.label]=value.selfMarks[p.label];}draft.completed=value.completed===true&&complete(set,draft);return draft;}
 return {complete,award,selfScore,canMark,safeDraft};
});
