const assert=require('node:assert/strict'),B=require('../tools/graph-practice/practice-bank.js');
assert.equal(B.contexts.length,58);assert.equal(new Set(B.contexts.map(c=>c.id)).size,58);
let count=0;
for(const context of B.contexts)for(let seed=0;seed<40;seed++)for(const skill of ['reading','gradient','tangent','area','relationship','half-life']){
  const q=B.build(context.id,seed,skill);assert.ok(q.working.length>20);assert.ok(q.points.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)));assert.ok(q.points.every(p=>p.x>=q.xMin&&p.x<=q.xMax+1e-9));
  assert.equal(B.grade(q,String(q.expected)),true,q.id);assert.equal(B.grade(q,''),null);assert.equal(B.grade(q,'Infinity'),null);
  if(!q.options){assert.ok(Number.isFinite(q.expected));assert.equal(B.grade(q,String(q.expected+Math.max(1,Math.abs(q.expected))*.1)),false);}
  else{assert.equal(new Set(q.options).size,q.options.length);assert.equal(B.grade(q,q.options.find(x=>x!==q.expected)),false);}
  if(q.skill==='tangent'){const a=q.marks[0],b=q.marks[1];assert.ok(Math.abs((b.y-a.y)/(b.x-a.x)-q.expected)<1e-8);}
  if(q.skill==='area'&&context.family!=='bar'){const area=q.marks.slice(1).reduce((sum,p,i)=>sum+(p.x-q.marks[i].x)*(p.y+q.marks[i].y)/2,0);assert.ok(Math.abs(area-q.expected)<1e-8);}
  if(context.id==='chromatography')assert.ok(q.fn(q.xMax)/q.xMax<1,'Rf cannot exceed one');
  if(context.id==='titration')assert.ok(q.points.every(p=>p.y>=0&&p.y<=14));
  if(context.family==='inverse'){const x=q.xMax/2;assert.ok(Math.abs(q.fn(x)*x-q.fn(x*2)*(x*2))<1e-8);}
  if(q.skill==='half-life')assert.ok(Math.abs(q.fn(q.expected)-q.fn(0)/2)<1e-8);
  count++;
}
console.log(`Graph library passed: ${count} generated answer cases across 58 scenarios, finite coordinates, tangent/area/half-life consistency, invalid answers and physical limits.`);
