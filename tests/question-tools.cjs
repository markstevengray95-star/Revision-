const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const E=require('../shared/equation-bank.js'),H=require('../shared/homework-engine.js');
const context={window:{}};vm.runInNewContext(fs.readFileSync('practice-data.js','utf8'),context);const lessons=context.window.REVISION_PRACTICE.lessons;
function near(a,b){assert.ok(Math.abs(a-b)<=Math.max(Math.abs(b)*1e-10,1e-40),`${a} ≠ ${b}`);}
async function main(){
  assert.equal(E.definitions.length,272);
  let checked=0;
  for(const d of E.definitions)for(const target of [d.result,...d.inputs].filter(v=>d.forms[v.symbol]))for(let seed=0;seed<80;seed++){
    const q=E.build(d.id,seed,seed%2?'stretch':'standard',target.symbol),values={...q.values,[target.symbol]:q.expected};
    assert.ok(Number.isFinite(q.expected),q.id);assert.ok(q.steps.some(x=>x.startsWith(`${target.symbol} = `)),'Show numerical substitution');
    if(d.kind==='custom')near(values[d.result.symbol],d.calculate[d.result.symbol](values));
    else if(d.kind==='acceleration')near(values.v-values.u,values.a*values.t);
    else if(d.kind==='percentage-change')near(values.P,100*(values.F-values.I)/values.I);
    else if(d.kind==='net-production')near(values.G,values.N+values.R);
    else near(values[d.result.symbol],d.inputs.reduce((n,x)=>n*Math.pow(values[x.symbol],x.power),d.coefficient));
    q.givens.forEach(g=>near(g.baseValue,g.value*g.scale));
    assert.ok(E.close(E.format(q.expected),q.expected));assert.ok(!E.close(E.format(q.expected+Math.max(Math.abs(q.expected),1)*.1),q.expected));checked++;
  }
  near(E.solve(E.definitions.find(d=>d.id==='kinetic'),'v',{E:200,m:4}),10);
  near(E.solve(E.definitions.find(d=>d.id==='photon'),'E',{f:5e14}),3.315e-19);
  near(E.solve(E.definitions.find(d=>d.id==='percentage-change'),'P',{F:15,I:20}),-25);
  near(E.solve(E.definitions.find(d=>d.id==='acceleration'),'u',{a:2,v:20,t:4}),12);
  near(E.solve(E.definitions.find(d=>d.id==='ph'),'pH',{H:1e-4}),4);
  near(E.solve(E.definitions.find(d=>d.id==='gibbs'),'ΔG',{ΔH:20,T:300,ΔS:100}),-10);
  near(E.solve(E.definitions.find(d=>d.id==='snell'),'θ₂',{'n₁':1,'n₂':1.5,'θ₁':Math.PI/6}),Math.asin(1/3));
  near(E.solve(E.definitions.find(d=>d.id==='hardy-heterozygote'),'H',{p:.3}),.42);
  near(E.solve(E.definitions.find(d=>d.id==='simpson'),'D',{'n₁':10,'n₂':10,'n₃':20}),.625);
  near(E.solve(E.definitions.find(d=>d.id==='tof-mass'),'m',{E:1e-16,t:1e-5,d:1}),2e-26);
  near(E.solve(E.definitions.find(d=>d.id==='parallel-resistance'),'R',{'R₁':10,'R₂':30}),7.5);
  assert.equal(new Set(E.definitions.map(d=>d.id)).size,E.definitions.length,'Equation ids are unique');
  for(const invalid of ['', '1 J','3abc','NaN','Infinity','1+2','1e','0x10'])assert.equal(E.parse(invalid),null);
  assert.equal(E.parse('−2.50e-3'),-.0025);assert.ok(E.unitCorrect('m/s^2','m/s²'));assert.ok(E.unitCorrect('ohms','Ω'));assert.ok(!E.unitCorrect('g','kg'));assert.ok(!E.unitCorrect('m','m²'));
  assert.ok(E.close('16.7',458/27.4));assert.ok(!E.close('16.8',458/27.4),'Reject a different answer beyond the 3-significant-figure rounding interval');
  const magnification=E.build('magnification',0,'stretch','M');assert.ok(magnification.givens.some(x=>x.unit==='μm'));near(magnification.expected,magnification.givens[0].baseValue/magnification.givens[1].baseValue);
  const wrong=E.assess(magnification,{value:E.format(magnification.expected),unit:'mm',formula:'bad'});assert.ok(wrong.value);assert.equal(wrong.formula,false);assert.equal(wrong.unit,false);
  assert.ok(!E.available({level:'gcse',subject:'physics',pathway:'combined'}).some(d=>d.id==='momentum'));
  assert.ok(E.available({level:'gcse',subject:'physics',pathway:'triple'}).some(d=>d.id==='momentum'));
  assert.ok(!E.available({level:'gcse',subject:'physics',pathway:'triple'}).some(d=>d.id==='photon'));
  const config={v:1,l:'gcse',s:'all',p:'combined',t:'all',n:60,d:'stretch',k:H.types,z:321};
  for(const level of ['gcse','alevel'])for(const subject of ['all','biology','chemistry','physics']){
    const c={...config,l:level,s:subject},pack=H.build(c,lessons),again=H.build(JSON.parse(JSON.stringify(c)),lessons);
    assert.deepEqual(pack,again,'Fixed link must produce the same questions');assert.equal(pack.questions.length,60);assert.equal(new Set(pack.questions.map(q=>q.prompt.toLowerCase())).size,60);
    assert.equal(new Set(pack.questions.map(q=>q.type)).size,4);
    for(const q of pack.questions){if(q.type==='choice'){assert.equal(q.options.length,4);assert.equal(new Set(q.options.map(x=>x.toLowerCase())).size,4);assert.ok(q.options.includes(q.expected));}if(subject!=='all')assert.equal(q.subject,subject);if(level==='gcse')assert.ok(!/(?:biology|chemistry|physics)[ -]only|separate science|triple science/i.test(q.prompt+' '+q.model),'Combined sets must omit explicitly Separate Science content');}
    assert.notDeepEqual(pack.questions,H.build({...c,z:322},lessons).questions,'Fresh set must vary questions');
  }
  const topicPack=H.build({...config,s:'biology',t:'b1',n:20},lessons);assert.ok(topicPack.questions.every(q=>q.type==='calculation'||q.id.startsWith('gcse:b1:')));
  assert.throws(()=>H.build({...config,s:'chemistry',t:'nonexistent',k:['calculation']},lessons),/No calculation/);
  assert.throws(()=>H.validate({...config,n:61}),/valid question-set/);assert.throws(()=>H.validate({...config,k:['evil']}),/valid question-set/);assert.throws(()=>H.validate({...config,v:2}),/not supported/);
  for(const file of ['teacher-activities.js','shared/activity-generator.js','tools/equation-practice/equations.js','shared/calculation-ui.js'])new vm.Script(fs.readFileSync(file,'utf8'),{filename:file});
  console.log(`Question tools passed: ${checked} rearrangement/conversion cases across ${E.definitions.length} equations, deterministic 60-question sets, pathway/topic filters, unique scientific question formats and scope filtering.`);
}
main().catch(e=>{console.error(e);process.exitCode=1;});
