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
