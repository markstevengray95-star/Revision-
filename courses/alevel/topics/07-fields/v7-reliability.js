(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const panel=$('#lessonPanel');if(!panel)return;
function refreshAudit(){const box=$('.v7-audit',panel);if(!box)return;const tas=$$('textarea',panel),mc=$$('[data-answer]',panel).length;let working=0;tas.forEach(t=>{const p=t.parentElement,has=p?.querySelector('.auto-v6')||p?.parentElement?.querySelector('.auto-v6');if(has){working++;p?.classList.add('v7-question-ok');p?.classList.remove('v7-question-missing')}else{p?.classList.add('v7-question-missing');p?.classList.remove('v7-question-ok')}});const out=$('.audit-count',box);if(out)out.textContent=`${working}/${tas.length} written responses automarked · ${mc?1:0} MCQ check active`;}
let timer=0;const schedule=()=>{clearTimeout(timer);timer=setTimeout(refreshAudit,180)};
new MutationObserver(schedule).observe(panel,{childList:true,subtree:true});
window.addEventListener('load',()=>setTimeout(refreshAudit,220),{once:true});
schedule();
})();