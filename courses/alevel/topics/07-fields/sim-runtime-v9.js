(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
function crisp(c){if(!c||c.dataset.crispV9)return;c.dataset.crispV9='1';c.classList.add('canvas-v9-crisp');c.style.imageRendering='auto';c.style.transform='translateZ(0)';c.style.backfaceVisibility='hidden'}
function allCanvases(){['#simCanvas','#advCanvas','#advGraph','#realApparatusCanvas','#rp9Graph','#rp10Graph','#rp11Graph','#gCanvas'].forEach(s=>crisp($(s)));$$('canvas').forEach(crisp)}
let resizeTimer=0;function hardResize(){clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{window.dispatchEvent(new Event('resize'));allCanvases()},30)}
function multiResize(){hardResize();setTimeout(hardResize,90);setTimeout(hardResize,260)}
document.addEventListener('click',e=>{if(e.target.closest('[data-view],[data-jump],.sim-tab,.adv-tabs button,[data-practical],.three-v9-tabs .button'))multiResize()},true);
if('ResizeObserver'in window){['#view-lab','#view-advanced','#view-practical'].map(s=>$(s)).filter(Boolean).forEach(v=>new ResizeObserver(()=>{if(v.classList.contains('active-view')||!v.classList.contains('view'))hardResize()}).observe(v))}
const touched=new WeakSet();function watchPlay(btn){if(!btn||btn.dataset.runtimeV9)return;btn.dataset.runtimeV9='1';btn.addEventListener('click',e=>{if(e.isTrusted)touched.add(btn)})}
function ensureRunning(view){const btn=view==='lab'?$('#playPause'):view==='advanced'?$('#advPlay'):null;watchPlay(btn);if(btn&&!touched.has(btn)&&/^play$/i.test(btn.textContent.trim()))btn.click()}
document.addEventListener('click',e=>{const b=e.target.closest('[data-view],[data-jump]');const v=b?.dataset.view||b?.dataset.jump;if(v==='lab'||v==='advanced')setTimeout(()=>ensureRunning(v),50)},true);
watchPlay($('#playPause'));watchPlay($('#advPlay'));
const views=['#view-lab','#view-advanced'].map(s=>$(s)).filter(Boolean);const io=new IntersectionObserver(entries=>entries.forEach(en=>en.target.dataset.runtimeVisible=en.isIntersecting?'1':'0'),{threshold:.02});views.forEach(v=>io.observe(v));
function badge(){const adv=$('#view-advanced .section-head');if(adv&&!adv.querySelector('.sim-runtime-v9-badge')){const b=document.createElement('span');b.className='sim-runtime-v9-badge';b.textContent='smooth animation runtime active';adv.appendChild(b)}}
allCanvases();badge();setTimeout(()=>{allCanvases();badge();multiResize()},500);window.addEventListener('load',()=>setTimeout(multiResize,120),{once:true});
})();
