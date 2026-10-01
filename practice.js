(() => {
 'use strict';
 const $=id=>document.getElementById(id),all=window.REVISION_PRACTICE.lessons,skills=window.REVISION_SKILLS;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const storageKey='revision-practice-v1';let saved={};try{saved=JSON.parse(localStorage.getItem(storageKey)||'{}');if(!saved||Array.isArray(saved)||typeof saved!=='object')saved={};}catch{}
 let list=[],active=null,promptIndex=0,clozeIndex=0,seed=0,cloze=null,problem=null;
 const stop=new Set('about after before between because their these those which where would should there through include scientific science using model process explanation answer water other same different first second during example according however this that with from into each have been when they than only more some both also very them such does will most'.split(' '));
 function sentences(l){return l.core.split(/(?<=[.!?])\s+(?=[A-Z])/).filter(s=>s.length>35);}
 function makeCloze(l,index){
  const lines=sentences(l),line=lines[index%lines.length]||l.core;
  const tokens=[...line.matchAll(/[A-Za-z][A-Za-z-]{4,}/g)].filter(m=>!stop.has(m[0].toLowerCase()));
  const selected=tokens[index%tokens.length]||[line.slice(0,5)];const word=selected[0],offset=selected.index??0;
  const alternatives=[...new Set([...l.core.matchAll(/[A-Za-z][A-Za-z-]{4,}/g)].map(m=>m[0]).filter(w=>w.toLowerCase()!==word.toLowerCase()&&!stop.has(w.toLowerCase())))].slice(0,2);
  while(alternatives.length<2)alternatives.push(['quantity','structure','measurement'].find(w=>w!==word&&!alternatives.includes(w)));
  const options=[word,...alternatives];for(let i=0;i<(index%3);i++)options.push(options.shift());
  return {question:line.slice(0,offset)+'______'+line.slice(offset+word.length),word,options,line};
 }
 function note(){if(!active)return {};return saved[active.id]||{};}
 function save(patch){if(!active)return;saved[active.id]={...note(),...patch};try{localStorage.setItem(storageKey,JSON.stringify(saved));$('saved-state').textContent='Saved on this device.';}catch{$('saved-state').textContent='Storage is unavailable; this session still works.';}}
 function option(value,label){return `<option value="${esc(value)}">${esc(label)}</option>`;}
 function topics(){const rows=all.filter(l=>l.level===$('level').value&&l.subject===$('subject').value&&($('level').value!=='gcse'||$('pathway').value==='triple'||l.scope!=='triple'));return [...new Map(rows.map(l=>[l.topic,l.topicTitle])).entries()];}
 function refreshTopics(preferred){const rows=topics();$('topic').innerHTML=rows.map(([id,title])=>option(id,title)).join('');if(rows.some(([id])=>id===preferred))$('topic').value=preferred;$('pathway-label').hidden=$('level').value!=='gcse';}
 function updateURL(push){const url=new URL(location.href);for(const id of ['level','subject','topic','pathway'])url.searchParams.set(id,$(id).value);if(active)url.searchParams.set('lesson',active.id);else url.searchParams.delete('lesson');if($('search').value)url.searchParams.set('search',$('search').value);else url.searchParams.delete('search');history[push?'pushState':'replaceState']({},'',url);}
 function refreshLessons(preferred,push=false){
  const search=$('search').value.trim().toLowerCase();list=all.filter(l=>l.level===$('level').value&&l.subject===$('subject').value&&l.topic===$('topic').value&&($('level').value!=='gcse'||$('pathway').value==='triple'||l.scope!=='triple')&&(!search||(l.title+' '+(l.ref||'')).toLowerCase().includes(search)));
  $('lesson').innerHTML=list.map(l=>option(l.id,(l.ref?l.ref+' · ':'')+l.title)).join('');$('lesson').disabled=!list.length;
  active=list.find(l=>l.id===preferred)||list[0]||null;if(active)$('lesson').value=active.id;
  $('lesson-count').textContent=`${list.length} lessons in this selection · ${all.length} lessons available across the app`;
  $('activities').hidden=!active;$('empty').hidden=!!active;if(active)renderLesson();updateURL(push);
 }
 function renderPrompt(){const q=active.questions[promptIndex];$('recall-question').textContent=q.question;$('recall-model').innerHTML=q.answer.map(p=>`<p>${esc(p)}</p>`).join('');$('recall-reveal').open=false;$('recall-answer').value=note().recall?.[promptIndex]||'';$('prompt-position').textContent=`${promptIndex+1} / ${active.questions.length}`;}
 function renderCloze(){cloze=makeCloze(active,clozeIndex);$('cloze-question').textContent=cloze.question;$('cloze-options').innerHTML=cloze.options.map((w,i)=>`<label><input type="radio" name="missing-word" value="${i}">${esc(w)}</label>`).join('');$('cloze-feedback').textContent='';$('cloze-feedback').className='activity-feedback';}
 function renderData(){problem=skills.build(active.skillKey,seed);$('data-activity').hidden=!problem;if(!problem)return;$('data-title').textContent=problem.title;$('data-question').textContent=problem.question;$('data-answer').value='';$('data-unit').textContent=problem.unit;$('data-working').innerHTML=problem.steps.map(s=>`<li>${esc(s)}</li>`).join('');$('data-reveal').open=false;$('data-feedback').textContent='';$('data-feedback').className='activity-feedback';$('new-data').hidden=skills.build(active.skillKey,seed+1)?.question===problem.question;}
 function renderConfidence(){document.querySelectorAll('[data-confidence]').forEach(b=>b.setAttribute('aria-pressed',String(note().confidence===b.dataset.confidence)));$('saved-state').textContent=note().confidence?'Your self-assessment is saved on this device.':'';}
 function renderLesson(){promptIndex=0;clozeIndex=0;seed=0;$('lesson-title').textContent=active.title;$('lesson-meta').textContent=`${active.level==='gcse'?'GCSE':'A-level'} · ${active.subject} · ${active.topicTitle}`;$('open-lesson').href=active.href;
  $('accuracy-statement').textContent=active.accuracy;$('accuracy-model').innerHTML=`<p>${esc(active.accuracy)}</p><p>${esc(active.core)}</p>`;$('accuracy-answer').value=note().accuracy||'';document.querySelectorAll('#activities details').forEach(d=>d.open=false);
  renderPrompt();renderCloze();renderData();renderConfidence();const i=list.indexOf(active);$('previous-lesson').disabled=i<=0;$('next-lesson').disabled=i>=list.length-1;
 }
 function restore(){const p=new URLSearchParams(location.search),requested=all.find(l=>l.id===p.get('lesson'));$('level').value=requested?.level||(['gcse','alevel'].includes(p.get('level'))?p.get('level'):'gcse');$('subject').value=requested?.subject||(['biology','chemistry','physics'].includes(p.get('subject'))?p.get('subject'):'biology');$('pathway').value=requested?.scope==='triple'||p.get('pathway')==='triple'?'triple':'combined';$('search').value=p.get('search')||'';refreshTopics(requested?.topic||p.get('topic'));refreshLessons(requested?.id);}
 for(const id of ['level','subject','pathway'])$(id).addEventListener('change',()=>{refreshTopics($('topic').value);refreshLessons(null,true);});
 $('topic').addEventListener('change',()=>refreshLessons(null,true));$('search').addEventListener('input',()=>refreshLessons(active?.id));$('clear-search').addEventListener('click',()=>{$('search').value='';refreshLessons(null,true);});
 $('lesson').addEventListener('change',()=>{active=list.find(l=>l.id===$('lesson').value);renderLesson();updateURL(true);});
 for(const [id,delta] of [['previous-lesson',-1],['next-lesson',1]])$(id).addEventListener('click',()=>{const next=list[list.indexOf(active)+delta];if(next){active=next;$('lesson').value=next.id;renderLesson();updateURL(true);$('lesson-title').scrollIntoView({block:'start',behavior:'smooth'});}});
 $('next-prompt').addEventListener('click',()=>{promptIndex=(promptIndex+1)%active.questions.length;renderPrompt();});$('recall-answer').addEventListener('input',()=>save({recall:{...(note().recall||{}),[promptIndex]:$('recall-answer').value}}));$('accuracy-answer').addEventListener('input',()=>save({accuracy:$('accuracy-answer').value}));
 $('check-cloze').addEventListener('click',()=>{const choice=document.querySelector('input[name="missing-word"]:checked');if(!choice){$('cloze-feedback').textContent='Choose a word first.';return;}const correct=cloze.options[Number(choice.value)]===cloze.word;$('cloze-feedback').textContent=correct?`Correct. ${cloze.line}`:'Try again. Read the sentence and think about the scientific relationship.';$('cloze-feedback').className='activity-feedback '+(correct?'correct':'retry');});
 $('next-cloze').addEventListener('click',()=>{clozeIndex++;renderCloze();});$('new-data').addEventListener('click',()=>{seed++;renderData();});
 $('check-data').addEventListener('click',()=>{const value=skills.parseNumber($('data-answer').value);if(!Number.isFinite(value)){$('data-feedback').textContent='Enter a number, using e notation if needed (for example 1.2e-3). The unit is shown beside the input.';$('data-feedback').className='activity-feedback retry';return;}const correct=skills.correct($('data-answer').value,problem.result);$('data-feedback').textContent=correct?'Correct. Compare your method with the worked solution.':'Try again. Check the equation, unit conversion and arithmetic. You can reveal the working for support.';$('data-feedback').className='activity-feedback '+(correct?'correct':'retry');});
 document.querySelectorAll('[data-confidence]').forEach(b=>b.addEventListener('click',()=>{save({confidence:b.dataset.confidence});renderConfidence();}));window.addEventListener('popstate',restore);restore();
})();
