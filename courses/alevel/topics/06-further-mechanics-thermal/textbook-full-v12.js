(function(){
'use strict';
const DATA=window.FM_DATA||{lessons:[]},DETAIL=window.FM_DETAIL||{},CALC=window.FM_CALC||{},TEXTBOOK=window.FM_TEXTBOOK||{},VISUALS=window.FM_VISUALS||{};
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function currentId(){return window.FM_APP?.getProgress?.().activeLesson||DATA.lessons[0]?.id}
function fallbackVisual(l,c){
 const eq=(CALC[l.id]?.equations||[]).slice(0,3);
 return '<figure class="textbook-visual textbook-fallback"><div class="visual-title">'+esc(l.title)+' · concept map</div><svg viewBox="0 0 720 360" role="img" aria-label="Concept diagram for '+esc(l.title)+'"><rect width="720" height="360" fill="#06111d"/><circle cx="360" cy="178" r="72" fill="#12344d" stroke="#67c7ff" stroke-width="4"/><text x="360" y="168" text-anchor="middle" fill="#fff" font-size="21" font-family="system-ui">'+esc(l.title).slice(0,28)+'</text><text x="360" y="198" text-anchor="middle" fill="#9edcff" font-size="16" font-family="system-ui">AQA '+esc(l.code)+'</text>'+eq.map((e,i)=>{const x=[120,600,360][i],y=[95,95,315][i];return '<line x1="360" y1="178" x2="'+x+'" y2="'+(y+(i===2?-35:35))+'" stroke="#526f87" stroke-width="3"/><rect x="'+(x-100)+'" y="'+(y-30)+'" width="200" height="60" rx="12" fill="#0d2238" stroke="#63d9a4"/><text x="'+x+'" y="'+(y+6)+'" text-anchor="middle" fill="#fff" font-size="18" font-family="system-ui">'+esc(e.eq).slice(0,25)+'</text>'}).join('')+'</svg><figcaption>Concept map generated from the equations and specification content for this lesson.</figcaption></figure>';
}
function visual(l,c){try{const v=c.visual&&VISUALS.render?VISUALS.render(c.visual):'';return v&&v.includes('<svg')?v:fallbackVisual(l,c)}catch(e){return fallbackVisual(l,c)}}
function equationCards(id){return (CALC[id]?.equations||[]).map((e,i)=>'<article class="textbook-equation-card"><div><span class="data-badge">Equation '+(i+1)+'</span><small>'+esc(e.sheet)+'</small></div><button class="big-equation equation-clickable" type="button">'+esc(e.eq)+'</button><h4>'+esc(e.name)+'</h4><p>'+esc(e.meaning)+'</p><dl><div><dt>Symbols</dt><dd>'+esc(e.symbols)+'</dd></div><div><dt>Units</dt><dd>'+esc(e.units)+'</dd></div><div><dt>Use when</dt><dd>'+esc(e.conditions)+'</dd></div></dl></article>').join('')}
function build(id){
 const l=DATA.lessons.find(x=>x.id===id);if(!l)return '';
 const c=TEXTBOOK[id]||{},d=DETAIL[id]||{},calc=CALC[id]||{};
 const sections=(c.sections||[]).map((s,i)=>'<article class="full-book-section"><div class="book-section-no">'+String(i+1).padStart(2,'0')+'</div><div><h3>'+esc(s.heading)+'</h3><p>'+esc(s.text)+'</p></div></article>').join('');
 const teach=(l.teach||[]).map(x=>'<article class="book-detail-card"><h4>'+esc(x[0])+'</h4><p>'+esc(x[1])+'</p></article>').join('');
 const deep=(d.deepDive||[]).map(x=>'<article class="book-detail-card deep"><h4>'+esc(x[0])+'</h4><p>'+esc(x[1])+'</p></article>').join('');
 const maths=(d.maths||[]).map(x=>'<li>'+esc(x)+'</li>').join(''),graphs=(d.graphs||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
 const key=(c.keyIdeas||[]).map(x=>'<li>'+esc(x)+'</li>').join(''),summary=(c.summary||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
 const recall=(c.retrieval||[]).map((x,i)=>'<article class="chapter-recall"><strong>'+(i+1)+'. '+esc(x[0])+'</strong><textarea class="student-answer compact-answer" placeholder="Answer before revealing..."></textarea><button class="text-button" data-chapter-reveal>Reveal answer</button><div class="answer-reveal">'+esc(x[1])+'</div></article>').join('');
 const worked=l.worked?'<article class="book-worked"><span class="eyebrow">Worked example</span><h3>'+esc(l.worked.q)+'</h3><ol>'+l.worked.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></article>':'';
 const ext=d.extendedExample?'<article class="book-worked"><span class="eyebrow">Extended worked example</span><h3>'+esc(d.extendedExample.q)+'</h3><ol>'+d.extendedExample.steps.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ol></article>':'';
 const strategy=(calc.strategy||[]).map(x=>'<li>'+esc(x)+'</li>').join('');
 return '<div class="full-textbook" data-textbook-id="'+esc(id)+'">'+
 '<header class="book-hero"><span class="eyebrow">Full textbook chapter · AQA '+esc(l.code)+'</span><h2>'+esc(l.title)+'</h2><p>'+esc(c.hook||l.lead)+'</p><div class="book-hook"><strong>Think first:</strong> '+esc(c.hookQuestion||l.exit)+'</div></header>'+visual(l,c)+
 '<section class="book-section-wrap"><div class="book-section-heading"><span class="eyebrow">Core theory</span><h2>Build the idea from first principles</h2></div>'+sections+'</section>'+ 
 '<section class="book-detail"><div class="book-section-heading"><span class="eyebrow">Deeper explanation</span><h2>What you need to understand, not just memorise</h2></div><div class="book-detail-grid">'+teach+deep+'</div></section>'+ 
 '<section class="book-equations"><div class="book-section-heading"><span class="eyebrow">Equation explorer</span><h2>Relationships used in this chapter</h2><p>Click any equation to open the full breakdown, symbols, units, assumptions and worked use.</p></div><div class="book-equation-grid">'+equationCards(id)+'</div><aside class="book-method"><h3>Calculation method</h3><ol>'+strategy+'</ol></aside></section>'+ 
 '<section class="book-maths-grid"><article><h3>Maths you must be able to do</h3><ul>'+maths+'</ul></article><article><h3>Graphs and data interpretation</h3><ul>'+graphs+'</ul></article></section>'+ 
 '<section class="book-worked-grid">'+worked+ext+'</section>'+ 
 '<section class="book-exam-grid"><article class="chapter-key"><span class="eyebrow">Key ideas</span><ul>'+key+'</ul></article><article class="chapter-exam"><span class="eyebrow">AQA exam focus</span><p>'+esc(c.examFocus||l.examTip)+'</p><p><strong>Common misconception:</strong> '+esc(l.misconception)+'</p></article></section>'+ 
 '<section class="chapter-summary"><h3>Chapter summary</h3><ul>'+summary+'</ul></section>'+ 
 '<section class="chapter-retrieval"><span class="eyebrow">Check your understanding</span><h3>Quick recall</h3>'+recall+'</section>'+ 
 '</div>';
}
function wire(chunk){$$('[data-chapter-reveal]',chunk).forEach(b=>b.onclick=()=>b.nextElementSibling?.classList.toggle('visible'))}
let busy=false;
function ensure(){if(busy)return;const panel=$('#lessonPanel');if(!panel)return;const chunk=$('.chunk[data-chunk="2"]',panel);if(!chunk)return;const id=currentId();if(chunk.dataset.fullTextbook==='12'&&chunk.querySelector('[data-textbook-id="'+id+'"]'))return;busy=true;chunk.innerHTML=build(id);chunk.dataset.fullTextbook='12';wire(chunk);busy=false;}
function boot(){ensure();const panel=$('#lessonPanel');if(panel)new MutationObserver(()=>setTimeout(ensure,0)).observe(panel,{childList:true,subtree:false});document.addEventListener('click',e=>{if(e.target.matches('[data-chunk-button="2"]'))setTimeout(ensure,0)});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();