const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../tools/practical-sim/index.html'),'utf8');
const start=html.indexOf('const LabCatalog =');
const end=html.indexOf('</script>',start);
assert.ok(start>0&&end>start,'Simulation registry must exist');
const box={module:{exports:{}},Math};
vm.runInNewContext(html.slice(start,end),box);
const catalog=box.module.exports;
assert.equal(Object.keys(catalog).length,26);
let cases=0,modes=0;
function finite(value,label){
 if(typeof value==='number')assert.ok(Number.isFinite(value),label);
 else if(typeof value==='string')assert.ok(!/NaN|Infinity|undefined/.test(value),label);
 else if(Array.isArray(value))value.forEach(v=>finite(v,label));
 else if(value&&typeof value==='object')Object.values(value).forEach(v=>finite(v,label));
}
for(const [id,practical] of Object.entries(catalog)){
 for(const [mode,setup] of practical.setups.entries()){
  modes++;
  const defaults=Object.fromEntries(setup.inputs.map(i=>[i.key,i.value]));
  const settings=[defaults];
  for(const input of setup.inputs){
   for(const value of input.options||[input.min,input.max])settings.push({...defaults,[input.key]:value});
  }
  for(const values of settings){
   const result=practical.model(values,{mode});
   finite(result,`${id}/${setup.name}/${JSON.stringify(values)}`);
   assert.ok(Array.isArray(result.readings)&&result.readings.length,`${id}: missing instrument reading`);
   cases++;
  }
 }
}
// The remaining sweep covers numerical and qualitative setups without treating observations as numbers.
console.log(`GCSE simulator: all 26 practicals, ${modes} setups and ${cases} default/boundary/choice cases produce valid readings.`);
