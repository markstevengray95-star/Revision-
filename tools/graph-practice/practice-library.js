/* Adds a large, accessible practice library beside the original hands-on graph activities. */
(() => {
  'use strict';
  const bank=RevisionGraphBank,node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  let question,answered=false,stats={checked:0,correct:0},exerciseSeed=1;
  try{const old=JSON.parse(localStorage.getItem('revision-graph-library-v1'));if(old&&Number.isInteger(old.checked)&&Number.isInteger(old.correct))stats=old;}catch{}
  const fresh=()=>crypto.getRandomValues(new Uint32Array(1))[0];
  function svgGraph(q){
    const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 780 520');svg.setAttribute('role','img');svg.setAttribute('aria-label',q.context.title+'. Axes: '+q.context.x+' and '+q.context.y+'. A coordinate table is available below.');
    const sx=x=>80+(x-q.xMin)/(q.xMax-q.xMin)*650,sy=y=>440-(y-q.yMin)/(q.yMax-q.yMin)*370;
    const element=(tag,attrs,text)=>{const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));if(text!==undefined)e.textContent=text;svg.append(e);return e;};
    element('rect',{width:780,height:520,fill:'#f8fafc'});
    for(let i=0;i<=10;i++){const x=q.xMin+(q.xMax-q.xMin)*i/10,y=q.yMin+(q.yMax-q.yMin)*i/10;element('line',{x1:sx(x),x2:sx(x),y1:70,y2:440,stroke:'#d8e2ed'});element('line',{x1:80,x2:730,y1:sy(y),y2:sy(y),stroke:'#d8e2ed'});if(i%2===0){element('text',{x:sx(x),y:463,'text-anchor':'middle',fill:'#334155','font-size':13},Number(x.toPrecision(3)));element('text',{x:70,y:sy(y)+4,'text-anchor':'end',fill:'#334155','font-size':13},Number(y.toPrecision(3)));}}
    element('line',{x1:80,x2:730,y1:440,y2:440,stroke:'#334155','stroke-width':2});element('line',{x1:80,x2:80,y1:70,y2:440,stroke:'#334155','stroke-width':2});
    element('text',{x:400,y:498,'text-anchor':'middle',fill:'#1e293b','font-size':16},q.context.x);element('text',{x:22,y:255,transform:'rotate(-90 22 255)','text-anchor':'middle',fill:'#1e293b','font-size':16},q.context.y);
    if(q.context.family==='bar'){q.points.forEach(p=>{element('rect',{x:sx(p.x)-28,y:sy(p.y),width:56,height:sy(0)-sy(p.y),fill:'#3b82f6'});element('text',{x:sx(p.x),y:sy(p.y)-9,'text-anchor':'middle',fill:'#1e293b','font-size':14},p.y);});}
    else{if(q.skill==='area')element('polygon',{points:[[sx(q.points[0].x),sy(0)],...q.points.map(p=>[sx(p.x),sy(p.y)]),[sx(q.points.at(-1).x),sy(0)]].map(p=>p.join(',')).join(' '),fill:'#99f6e4',opacity:.5});element('polyline',{points:q.points.map(p=>`${sx(p.x)},${sy(p.y)}`).join(' '),fill:'none',stroke:'#2563eb','stroke-width':3});}
    if(q.tangent)element('line',{x1:sx(q.tangent[0].x),y1:sy(q.tangent[0].y),x2:sx(q.tangent[1].x),y2:sy(q.tangent[1].y),stroke:'#b45309','stroke-width':3,'stroke-dasharray':'7 5'});
    q.marks.forEach((p,i)=>{element('circle',{cx:sx(p.x),cy:sy(p.y),r:5,fill:'#be123c'});if(['gradient','tangent','area'].includes(q.skill))element('text',{x:Math.min(620,Math.max(100,sx(p.x)+8)),y:Math.min(425,Math.max(85,sy(p.y)+(i%2?22:-12))),fill:'#9f1239','font-size':13},`(${Number(p.x.toPrecision(4))}, ${Number(p.y.toPrecision(4))})`);});
    return svg;
  }
  function draw(){
    document.getElementById('library-graph').replaceChildren(svgGraph(question));document.getElementById('library-question').textContent=question.prompt;
    document.getElementById('library-context-note').textContent=question.context.interpretation+' Illustrative generated data for graph skills; follow the conditions in a real experiment.';
    const input=document.getElementById('library-answer');input.replaceChildren();
    if(question.options){question.options.forEach(option=>{const label=node('label',undefined,'graph-library-choice'),radio=node('input');radio.type='radio';radio.name='library-choice';radio.value=option;label.append(radio,document.createTextNode(option));input.append(label);});}
    else{const label=node('label','Your numerical answer'),field=node('input');field.id='library-number';field.type='text';field.inputMode='decimal';field.placeholder='Decimal or scientific notation';label.append(field);input.append(label,node('p',question.unit+' · answers within 0.5% accepted','graph-note'));}
    const table=document.getElementById('library-data');table.replaceChildren();const head=node('tr');head.append(node('th',question.context.x),node('th',question.context.y));table.append(head);
    // Exact labelled points are included, so keyboard/table users can solve every exercise.
    const data=question.context.family==='bar'?question.points:['gradient','tangent','area','reading','half-life'].includes(question.skill)?question.marks:question.points.filter((p,i)=>i%12===0);
    data.forEach(p=>{const row=node('tr');row.append(node('td',Number(p.x.toPrecision(4))),node('td',Number(p.y.toPrecision(4))));table.append(row);});
    document.getElementById('library-feedback').hidden=true;document.getElementById('library-check').disabled=false;document.getElementById('library-solution').hidden=true;
    document.getElementById('library-solution').textContent=question.working;answered=false;
    document.getElementById('library-progress').textContent=`On this device: ${stats.checked} first checks · ${stats.correct} correct. Revealing a solution does not earn a correct first check.`;
  }
  function refreshScenarios(){
    const level=document.getElementById('library-level').value,subject=document.getElementById('library-subject').value,select=document.getElementById('library-scenario'),previous=select.value;
    const contexts=bank.contexts.filter(c=>(level==='all'||c.level===level)&&(subject==='all'||c.subject===subject));select.replaceChildren(...contexts.map(c=>new Option(`${c.level==='gcse'?'GCSE':'A-level'} · ${c.title}`,c.id)));if(contexts.some(c=>c.id===previous))select.value=previous;
    document.getElementById('library-count').textContent=`${contexts.length} scenarios match · ${bank.contexts.length} total · fresh values for every new question.`;newQuestion();
  }
  function newQuestion(){
    const context=bank.contexts.find(c=>c.id===document.getElementById('library-scenario').value),select=document.getElementById('library-skill'),previous=select.value;
    const choices=context.family==='bar'?[['reading','Largest category'],['bar-total','Total of bars']]:[['reading','Read a value'],['relationship','Identify relationship'],['gradient','Average gradient'],['tangent','Tangent gradient'],...(['linear','direct','negative','piecewise'].includes(context.family)?[['area','Area under graph']]:[]),...(context.family==='decay'?[['half-life','Half-life']]:[])];
    select.replaceChildren(...choices.map(([value,label])=>new Option(label,value)));if(choices.some(c=>c[0]===previous))select.value=previous;
    exerciseSeed=fresh();question=bank.build(document.getElementById('library-scenario').value,exerciseSeed,document.getElementById('library-skill').value);draw();}
  function check(){if(answered)return;const answer=question.options?document.querySelector('input[name="library-choice"]:checked')?.value:document.getElementById('library-number').value;const result=bank.grade(question,answer);const feedback=document.getElementById('library-feedback');feedback.hidden=false;if(result===null){feedback.textContent='Choose an answer or enter a valid finite number.';return;}
    answered=true;document.getElementById('library-check').disabled=true;stats.checked++;stats.correct+=Number(result);try{localStorage.setItem('revision-graph-library-v1',JSON.stringify(stats));}catch{}
    feedback.textContent=(result?'Correct. ':'Review this step. ')+question.working;document.getElementById('library-progress').textContent=`On this device: ${stats.checked} first checks · ${stats.correct} correct.`;
  }
  function init(){
    const list=document.querySelector('.graph-workspace nav ul'),li=node('li'),button=node('button','7. Practice library');button.id='tab-module-library';button.type='button';button.className='w-full text-left px-6 py-4 hover:bg-slate-800 transition-colors border-l-4 border-transparent text-slate-300 whitespace-nowrap md:whitespace-normal';button.onclick=()=>switchTab('module-library');li.append(button);list.append(li);
    const section=node('section',undefined,'module-section hidden');section.id='module-library';
    section.innerHTML=`<div><h2>Graph practice library</h2><p>Choose from 58 science scenarios and generate fresh values. Practise readings, average gradients, tangents, areas, relationships and half-life with worked feedback.</p><p><a href="../../teacher.html#assign-work">Set auto-marked science homework →</a></p></div>
    <div class="graph-library-controls"><label>Qualification<select id="library-level"><option value="all">GCSE and A-level</option><option value="gcse">GCSE</option><option value="alevel">A-level</option></select></label><label>Subject<select id="library-subject"><option value="all">All sciences</option><option value="physics">Physics</option><option value="chemistry">Chemistry</option><option value="biology">Biology</option></select></label><label>Scenario<select id="library-scenario"></select></label><label>Skill<select id="library-skill"><option value="reading">Read a value</option><option value="relationship">Identify relationship</option><option value="gradient">Average gradient / bar total</option><option value="tangent">Tangent gradient</option><option value="area">Area where applicable</option><option value="half-life">Half-life where applicable</option></select></label></div>
    <p id="library-count" class="graph-note" role="status"></p><div class="graph-library-layout"><div><div id="library-graph"></div><details><summary>Accessible coordinate table</summary><p class="graph-note">Readings and labelled points are provided as an alternative to the image. Tangent exercises list points on the tangent.</p><table id="library-data"></table></details></div><div class="graph-library-card"><h3 id="library-question"></h3><p id="library-context-note" class="graph-note"></p><div id="library-answer"></div><div class="graph-library-actions"><button id="library-check" type="button">Check answer</button><button id="library-reveal" type="button">Worked solution</button><button id="library-next" type="button">Fresh values</button><button id="library-mixed" type="button">Random scenario</button></div><p id="library-feedback" role="status" aria-live="polite" hidden></p><p id="library-solution" hidden></p><p id="library-progress" class="graph-note"></p></div></div>`;
    document.querySelector('.graph-workspace>main').append(section);
    ['library-level','library-subject'].forEach(id=>document.getElementById(id).onchange=refreshScenarios);['library-scenario','library-skill'].forEach(id=>document.getElementById(id).onchange=newQuestion);
    document.getElementById('library-next').onclick=newQuestion;document.getElementById('library-check').onclick=check;
    document.getElementById('library-reveal').onclick=()=>{document.getElementById('library-solution').hidden=false;answered=true;document.getElementById('library-check').disabled=true;};
    document.getElementById('library-mixed').onclick=()=>{const s=document.getElementById('library-scenario');s.selectedIndex=fresh()%s.options.length;newQuestion();};refreshScenarios();
  }
  const originalLoad=window.onload;window.onload=function(){
    const menu=document.getElementById('dataset-selector');
    bank.contexts.filter(c=>c.family!=='bar').forEach(c=>{datasets['bank:'+c.id]={};menu.append(new Option((c.level==='gcse'?'GCSE':'A-level')+' · '+c.title,'bank:'+c.id));});
    init();originalLoad();
  };
})();
