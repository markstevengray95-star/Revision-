const assert=require('node:assert/strict'),tasks=require('../shared/homework-tasks.js');
const settings={prompt:'Revise energy stores.',marks:1,id:'sample',seed:7};
const match=tasks.build({...settings,type:'matching',content:'Kinetic | Moving objects\nThermal | Hot objects\nElastic | Stretched springs'});
assert.equal(match.length,3);assert.equal(new Set(match.map(q=>q.id)).size,3);
for(const q of match){assert.equal(q.type,'choice');assert.equal(q.options.length,3);assert.equal(q.options.find(o=>o.id===q.key.correct).text,q.key.solution[0].split(' → ')[1]);}
const order=tasks.build({...settings,type:'ordering',content:'Heat water\nRecord temperature\nCalculate the change'})[0];
assert.equal(order.type,'written');assert.deepEqual(order.key.solution,['1. Heat water','2. Record temperature','3. Calculate the change']);assert.ok(!order.prompt.includes('A. Heat water\nB. Record temperature\nC. Calculate the change'));
const gap=tasks.build({...settings,type:'gaps',content:'The unit is [joules] and the symbol is [J].'})[0];assert.ok(!gap.prompt.includes('joules'));assert.ok(!gap.prompt.includes('[J]'));assert.deepEqual(gap.key.solution,['1. joules','2. J']);
const mistake=tasks.build({...settings,type:'mistake',content:'Energy is destroyed.',solution:'Energy is conserved.\nEnergy is transferred between stores.'})[0];assert.equal(mistake.key.solution.length,2);assert.ok(!mistake.prompt.includes('Energy is conserved.'));
for(const type of tasks.types)assert.throws(()=>tasks.build({...settings,type,content:'incomplete'}));
assert.throws(()=>tasks.build({...settings,type:'matching',content:'A | same\nB | same'}),/distinct/);
assert.throws(()=>tasks.build({...settings,type:'gaps',content:'A [broken'}),/square brackets/);
assert.throws(()=>tasks.build({...settings,type:'ordering',content:'A\nB\nC',marks:NaN}),/marks/);
for(const q of [...match,order,gap,mistake]){const {key,...publicQ}=q;assert.ok(!('key' in publicQ));assert.ok(q.prompt.length<=6000);}
console.log('Homework tasks passed: correct matching keys after shuffling, ordering, gaps, mistake schemes, invalid authoring and public question privacy.');
const resources=require('../shared/homework-resources.js'),fs=require('node:fs'),path=require('node:path');
for(const e of resources.examples){
 const q=tasks.build({...e,id:'example',resource:e.id})[0];assert.equal(q.type,'written');assert.equal(q.marks,e.marks);assert.deepEqual(q.key.solution,e.solution.split('\n'));assert.ok(q.prompt.length<=6000);
 if(e.href){assert.equal(q.lessonHref,e.href);assert.ok(fs.existsSync(path.join(__dirname,'..',e.href)));assert.ok(!fs.readFileSync(path.join(__dirname,'..',e.href),'utf8').includes('<script'));assert.ok(e.alt.length>20);}
}
assert.throws(()=>tasks.build({...settings,type:'diagram',resource:'../secret',solution:'answer'}),/resource library/);
assert.throws(()=>tasks.build({...settings,type:'graph',resource:'cell',solution:'answer'}),/resource library/);
assert.throws(()=>tasks.build({...settings,type:'practical',content:'Measure time',solution:''}),/mark scheme/);
console.log('Resource tasks passed: vetted figures, accessible graph data, private marking schemes and practical examples.');
