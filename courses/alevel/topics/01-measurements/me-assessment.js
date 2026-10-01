'use strict';
  function renderQuiz(){
    const q=quizzes[state.quizIndex];$('#quizProgress').textContent=`${state.quizIndex+1} / ${quizzes.length}`;$('#quizProgressFill').style.width=`${(state.quizIndex+1)/quizzes.length*100}%`;$('#quizScore').textContent=state.quizScore;$('#quizStreak').textContent=state.quizStreak;$('#quizSpec').textContent=q.spec;$('#quizQuestion').textContent=q.q;$('#quizChoices').innerHTML=q.choices.map((c,i)=>`<button class="choice" data-choice="${i}">${c}</button>`).join('');$('#quizFeedback').classList.add('hidden');$('#nextQuestion').classList.add('hidden');$$('[data-choice]').forEach(b=>b.onclick=()=>answerQuiz(+b.dataset.choice));
  }
  function answerQuiz(i){const q=quizzes[state.quizIndex],correct=i===q.answer;if(correct){state.quizScore++;state.quizStreak++;}else state.quizStreak=0;$$('[data-choice]').forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add('correct');if(j===i&&!correct)b.classList.add('wrong')});$('#quizScore').textContent=state.quizScore;$('#quizStreak').textContent=state.quizStreak;$('#quizFeedback').innerHTML=`<strong>${correct?'Correct':'Not quite'}.</strong> ${q.why}`;$('#quizFeedback').classList.remove('hidden');$('#nextQuestion').classList.remove('hidden');}
  $('#nextQuestion').onclick=()=>{state.quizIndex=(state.quizIndex+1)%quizzes.length;renderQuiz()}; $('#restartQuiz').onclick=()=>{state.quizIndex=0;state.quizScore=0;state.quizStreak=0;renderQuiz()};
  $$('[data-mastery]').forEach(b=>b.onclick=()=>{const id=b.dataset.mastery;$('#mastery-quiz').classList.toggle('hidden',id!=='quiz');$('#mastery-extended').classList.toggle('hidden',id!=='extended');$$('[data-mastery]').forEach(x=>x.classList.toggle('primary',x.dataset.mastery===id));if(id==='extended')renderExtended();});
  function renderExtended(){ $('#extendedList').innerHTML=`<span class="eyebrow">Extended response bank</span><h3>Explain, evaluate, justify</h3>${extended.map((e,i)=>`<button class="extended-item ${i===state.extendedIndex?'active':''}" data-ext="${i}"><strong>${e.code}</strong><br><span class="small">${e.q}</span></button>`).join('')}`;$$('[data-ext]').forEach(b=>b.onclick=()=>{state.extendedIndex=+b.dataset.ext;renderExtended()});const e=extended[state.extendedIndex];$('#extendedCode').textContent=e.code;$('#extendedQuestion').textContent=e.q;$('#extendedPrompt').textContent=e.prompt;$('#extendedAnswer').value='';$('#extendedFeedback').classList.add('hidden'); }
  $('#markExtended').onclick=()=>{const e=extended[state.extendedIndex],txt=$('#extendedAnswer').value.toLowerCase();const hits=e.points.filter(p=>new RegExp(p[1],'i').test(txt));const missed=e.points.filter(p=>!new RegExp(p[1],'i').test(txt));$('#extendedFeedback').innerHTML=`<h3>Estimated mark points: ${hits.length} / ${e.points.length}</h3><p><strong>Detected:</strong> ${hits.length?hits.map(h=>h[0]).join(', '):'none yet'}.</p><p><strong>Consider adding:</strong> ${missed.length?missed.map(h=>h[0]).join(', '):'all core points detected'}.</p><p class="muted small">This is transparent keyword/idea matching for practice, not an official AQA mark scheme.</p>`;$('#extendedFeedback').classList.remove('hidden');}; $('#clearExtended').onclick=()=>{$('#extendedAnswer').value='';$('#extendedFeedback').classList.add('hidden')};

  function renderSpec(){ $('#specGrid').innerHTML=specs.map(s=>`<article class="panel spec-card"><span class="eyebrow">${s.code}</span><h3>${s.title}</h3><ul>${s.items.map(i=>`<li>${i}</li>`).join('')}</ul></article>`).join(''); }

  $('#resetProgress').onclick=()=>{if(confirm('Reset completed lessons?')){state.completed.clear();saveProgress();renderCourse()}};
  window.addEventListener('resize',()=>{drawSim();drawGraphBench()});

  renderCourse(); renderTextbook(); renderSim(); renderFormula(); renderTiming(); updateMicroVisual(); renderMicro(); renderQuiz(); renderExtended(); renderSpec(); updateProgress();

// v3 enhancement layer: keep v2 stable and load optional improvements after initialization.
(() => {
  const css=document.createElement('link');
  css.rel='stylesheet'; css.href='v3.css?v=3'; document.head.appendChild(css);
  const js=document.createElement('script');
  js.src='me-v3.js?v=3'; js.defer=true; document.body.appendChild(js);
})();
