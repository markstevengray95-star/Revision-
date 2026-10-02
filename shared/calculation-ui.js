/* Accessible calculation inputs reused by the Equation Practice tab and homework. */
(() => {
  'use strict';
  const E=globalThis.RevisionEquations;
  const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  function label(parent,text,input) {const l=node('label',text);l.append(input);parent.append(l);return input;}
  function form(q,onChange,initial={}) {
    const box=node('div',undefined,'calculation-steps'),select=node('select');select.append(new Option('Choose a rearrangement…',''));
    const options=[...new Set([q.formula,q.definition.formula,`${q.target.symbol} = 1 / (${q.formula.split(' = ')[1]})`])];
    E.rng(q.seed)()>.5?options.reverse():null;options.forEach(x=>select.append(new Option(x,x)));select.value=initial.formula||'';select.dataset.field='formula';label(box,'1. Select the equation rearranged for the unknown',select);
    const conversions=node('div',undefined,'conversion-grid');q.givens.forEach(g=>{const input=node('input');input.type='text';input.inputMode='decimal';input.maxLength=32;input.value=initial.conversions?.[g.symbol]||'';input.dataset.symbol=g.symbol;label(conversions,`2. ${g.symbol}: ${E.format(g.value)} ${g.unit} → ${g.baseUnit}`,input);});box.append(conversions);
    const working=node('textarea');working.rows=2;working.maxLength=600;working.value=initial.working||'';working.dataset.field='working';working.placeholder='Write the numbers substituted into your rearranged equation.';label(box,'3. Substitute the numbers and show your working',working);
    const final=node('div',undefined,'conversion-grid'),value=node('input');value.type='text';value.inputMode='decimal';value.maxLength=32;value.value=initial.value||'';value.dataset.field='value';value.placeholder='e.g. 0.024 or 2.4e-2';label(final,'4. Calculate the answer (3 significant figures)',value);
    const unit=node('input');unit.type='text';unit.maxLength=32;unit.value=initial.unit||'';unit.dataset.field='unit';unit.placeholder=q.unit==='×'?'× (dimensionless)':q.unit;label(final,'5. State the unit',unit);box.append(final);
    const read=()=>({formula:select.value,conversions:Object.fromEntries([...conversions.querySelectorAll('input')].map(x=>[x.dataset.symbol,x.value])),working:working.value,value:value.value,unit:unit.value});box.addEventListener('input',()=>onChange(read()));box.addEventListener('change',()=>onChange(read()));box.read=read;return box;
  }
  function feedback(q,answer) {
    const result=E.assess(q,answer),list=node('ul');
    [[result.formula,'Equation and rearrangement',q.formula],...q.givens.map((g,i)=>[result.conversions[i],`${g.symbol} conversion`,`${E.format(g.baseValue)} ${g.baseUnit}`]),[result.value,'Numerical answer',`${E.format(q.expected)} ${q.unit}`],[result.unit,'Unit',q.unit],[result.working,'Working supplied','Write the substituted numerical expression; compare it with the worked solution.']].forEach(([ok,name,hint])=>list.append(node('li',`${ok?'✓':'→'} ${name}: ${ok?'checked':hint}`)));
    list.append(node('li','Your written working is recorded for review; compare the reasoning with the model below.'));return list;
  }
  function solution(q) {const list=node('ol');q.steps.forEach(step=>list.append(node('li',step)));return list;}
  globalThis.RevisionCalculationUI={node,label,form,feedback,solution};
})();
