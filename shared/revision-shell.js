(() => {
  'use strict';
  // Study modules already embedded in a course keep their focused lesson view.
  if(window.self!==window.top)return;
  const script=document.currentScript || [...document.scripts].find(s=>/shared\/revision-shell\.js/.test(s.src));
  if(!script)return;
  const root=new URL('../',script.src);
  const relative=location.pathname.startsWith(root.pathname)?location.pathname.slice(root.pathname.length):'';
  const level=relative==='teacher.html'?'teacher':relative.startsWith('courses/gcse/')?'gcse':relative.startsWith('courses/alevel/')?'alevel':'home';
  const params=new URLSearchParams(location.search);
  const subject=['biology','chemistry','physics'].includes(params.get('subject'))?params.get('subject'):'physics';
  const bar=document.createElement('header');bar.className='revision-bar';
  const wrap=document.createElement('div');wrap.className='revision-bar-inner';
  const brand=document.createElement('a');brand.className='revision-wordmark';brand.href=root.href;brand.innerHTML='Revision<span>.</span>';
  const nav=document.createElement('nav');nav.className='revision-nav';nav.setAttribute('aria-label','Revision app');
  const links=[['home','Dashboard','index.html'],['gcse','GCSE Science','courses/gcse/index.html'],['alevel','A-level Science','courses/alevel/index.html'],['teacher','Teacher','teacher.html']];
  links.forEach(([key,label,target])=>{const a=document.createElement('a');a.href=new URL(target,root).href;a.textContent=label;if(level===key)a.setAttribute('aria-current','page');nav.append(a);});
  const context=document.createElement('span');context.className='revision-context';context.textContent=level==='home'?'Your science, together':level==='teacher'?'Teacher workspace':level==='gcse'?'AQA · GCSE Science':`AQA · A-level ${subject[0].toUpperCase()+subject.slice(1)}`;
  wrap.append(brand,nav,context);bar.append(wrap);document.body.prepend(bar);
  if(level==='gcse'||level==='alevel'){
    document.body.classList.add('revision-integrated');
    const url=new URL(location.href);if(url.origin===root.origin){try{localStorage.setItem('revision-last-study-v1',JSON.stringify({path:relative+url.search+url.hash,level,at:Date.now()}));}catch{}}
    const skip=document.createElement('a');skip.className='revision-skip';skip.href='#revision-main';skip.textContent='Skip to study content';const main=document.querySelector('main');if(main){main.id=main.id||'revision-main';skip.href='#'+main.id;document.body.prepend(skip);}
    // Course state changes are reflected in the dashboard's Continue action.
    const remember=()=>{try{const url=new URL(location.href);localStorage.setItem('revision-last-study-v1',JSON.stringify({path:url.pathname.slice(root.pathname.length)+url.search+url.hash,level,at:Date.now()}));}catch{}};
    window.addEventListener('coursecontextchange',remember);window.addEventListener('hashchange',remember);window.addEventListener('pagehide',remember);
  }
  window.REVISION_ROOT=root.href;
})();
