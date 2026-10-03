(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.REVISION_HOMEWORK_TASKS=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const types=['matching','ordering','gaps','mistake'];
  function shuffle(values,seed=1){const a=[...values];let z=seed>>>0;for(let i=a.length-1;i>0;i--){z=(Math.imul(z,1664525)+1013904223)>>>0;const j=z%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
  function build({type,prompt,content='',solution='',marks=1,id='task',seed=1}){
    if(!types.includes(type))throw Error('Choose a homework task type.');
    prompt=String(prompt||'').trim();content=String(content).trim();solution=String(solution).trim();marks=Number(marks);
    if(prompt.length<3||prompt.length>2000||content.length>4000||solution.length>4000||!Number.isFinite(marks)||marks<0.5||marks>10||marks%0.5)throw Error('Enter a task instruction and 0.5–10 marks in half-mark steps.');
    const common={type:'written',marks,title:{matching:'Match the terms',ordering:'Put the steps in order',gaps:'Complete the missing words',mistake:'Spot and correct the mistake'}[type]};
    const lines=content.split(/\n/).map(s=>s.trim()).filter(Boolean);
    const unique=values=>new Set(values.map(s=>s.toLowerCase())).size===values.length;
    if(type==='matching'){
      const pairs=lines.map(line=>line.split('|').map(s=>s.trim()));
      if(pairs.length<2||pairs.length>6||pairs.some(p=>p.length!==2||p.some(s=>!s||s.length>500))||!unique(pairs.map(p=>p[0]))||!unique(pairs.map(p=>p[1])))throw Error('Enter 2–6 distinct pairs as term | definition, one per line.');
      return shuffle(pairs.map(([term,definition],i)=>({...common,id:id+'_'+i,type:'choice',prompt:prompt+'\nMatch: '+term,options:shuffle(pairs.map((p,j)=>({id:'o'+j,text:p[1]})),seed+i),key:{correct:'o'+i,solution:[term+' → '+definition,...(solution?[solution]:[])]}})),seed);
    }
    if(type==='ordering'){
      if(lines.length<3||lines.length>10||lines.some(s=>s.length>350)||!unique(lines))throw Error('Enter 3–10 distinct steps in the correct order, one per line.');
      let mixed=shuffle(lines,seed);if(mixed.every((s,i)=>s===lines[i]))mixed=[...mixed.slice(1),mixed[0]];
      return [{...common,id,prompt:prompt+'\nWrite these steps in the correct order:\n'+mixed.map((s,i)=>String.fromCharCode(65+i)+'. '+s).join('\n'),key:{solution:lines.map((s,i)=>(i+1)+'. '+s).concat(solution?[solution]:[])}}];
    }
    if(type==='gaps'){
      const words=[...content.matchAll(/\[([^\[\]\n]+)\]/g)].map(m=>m[1].trim());
      if(!words.length||words.length>10||words.some(s=>!s||s.length>120)||content.replace(/\[[^\[\]\n]+\]/g,'').match(/[\[\]]/))throw Error('Put 1–10 missing answers in square brackets, for example Current is measured in [amperes].');
      let n=0;return [{...common,id,prompt:prompt+'\n'+content.replace(/\[[^\[\]\n]+\]/g,()=>`____ (${++n})`)+'\nWrite the numbered answers below.',key:{solution:words.map((s,i)=>(i+1)+'. '+s).concat(solution?[solution]:[])}}];
    }
    if(content.length<3||!solution||solution.split(/\n+/).filter(Boolean).length>30)throw Error('Enter an incorrect statement and a corrected explanation with at most 30 marking points.');
    return [{...common,id,prompt:prompt+'\nStatement to check:\n'+content+'\nIdentify the mistake, rewrite the statement correctly and explain why.',key:{solution:solution.split(/\n+/).filter(Boolean)}}];
  }
  return {types,build,shuffle};
});
