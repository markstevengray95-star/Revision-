(() => {
  'use strict';
  if(window.self!==window.top)return;
  const script=document.currentScript || [...document.scripts].find(s=>/shared\/revision-shell\.js/.test(s.src));
  if(!script)return;
  const root=new URL('../',script.src);
  const relative=location.pathname.startsWith(root.pathname)?location.pathname.slice(root.pathname.length):'';
  const level=relative==='teacher.html'?'teacher':['student.html','activity.html'].includes(relative)?'student':relative==='pricing.html'?'pricing':relative==='practice.html'?'practice':relative.startsWith('courses/gcse/')?'gcse':relative.startsWith('courses/alevel/')?'alevel':relative.startsWith('tools/')?'tools':'home';
  const params=new URLSearchParams(location.search);
  const subject=['biology','chemistry','physics'].includes(params.get('subject'))?params.get('subject'):'physics';
  const sparkWordmark='Spark<svg class="spark-bolt" aria-hidden="true" viewBox="0 0 12 18" focusable="false"><path d="M7.2 0 1.4 9h4L3.8 18 10.6 7.2H6.8z" fill="currentColor"/></svg>';
  const applyBrand=()=>{
    document.title=document.title.replace(/\bRevision\b/g,'Spark');
    document.querySelectorAll('.revision-wordmark').forEach(node=>{node.innerHTML=sparkWordmark;});
    const description=document.querySelector('meta[name="description"]');
    if(description)description.content=description.content.replace(/\bRevision\b/g,'Spark');
  };
  const bar=document.createElement('header');bar.className='revision-bar';
  const wrap=document.createElement('div');wrap.className='revision-bar-inner';
  const brand=document.createElement('a');brand.className='revision-wordmark';brand.href=root.href;brand.innerHTML=sparkWordmark;
  const nav=document.createElement('nav');nav.className='revision-nav';nav.setAttribute('aria-label','Spark app');
  const links=[['home','Dashboard','index.html'],['gcse','GCSE Science','courses/gcse/index.html'],['alevel','A-level Science','courses/alevel/index.html'],['practice','Practise',`practice.html${level==='gcse'||level==='alevel'?'?level='+level+'&subject='+subject:''}`],['tools','Practice tools','index.html#tools'],['student','My Work','student.html'],['teacher','Teacher','teacher.html'],['pricing','Pricing','pricing.html']];
  links.forEach(([key,label,target])=>{const a=document.createElement('a');a.href=new URL(target,root).href;a.textContent=label;if(level===key)a.setAttribute('aria-current','page');nav.append(a);});
  const practiceLink=nav.querySelector('a[href*="practice.html"]');
  practiceLink.addEventListener('click',()=>{
    if(level!=='gcse'&&level!=='alevel')return;
    const current=new URLSearchParams(location.search),url=new URL('practice.html',root);url.searchParams.set('level',level);url.searchParams.set('subject',current.get('subject')||subject);
    if(current.get('topic'))url.searchParams.set('topic',current.get('topic'));
    if(level==='gcse'){
      if(current.get('mode')==='triple')url.searchParams.set('pathway','triple');
      const topic=window.GCSE_COURSE_DATA?.topics.find(t=>t.id===current.get('topic'));
      const title=current.get('lesson')||document.querySelector('.lesson-presentation')?.dataset.lessonTitle;
      const index=topic?.lessons.findIndex(([name])=>name===title);if(index>=0)url.searchParams.set('lesson',`gcse:${topic.id}:${index}`);
    }else{
      const id=location.hash.match(/^#lesson=(.+)$/)?.[1];
      const ref=current.get('lesson')||current.get('section');if(id)url.searchParams.set('lesson',`alevel:physics:${decodeURIComponent(id)}`);else if(ref)url.searchParams.set('lesson',`alevel:${subject}:${ref}`);
    }
    practiceLink.href=url.href;
  });
  const context=document.createElement('span');context.className='revision-context';context.textContent=level==='home'?'Your science, together':level==='teacher'?'Teacher workspace':level==='student'?'Student workspace':level==='pricing'?'Plans for students & schools':level==='tools'?'Practice tools':level==='practice'?'Recall · Check · Apply':level==='gcse'?'AQA · GCSE Science':`AQA · A-level ${subject[0].toUpperCase()+subject.slice(1)}`;
  wrap.append(brand,nav,context);bar.append(wrap);document.body.prepend(bar);applyBrand();
  if(level==='gcse'||level==='alevel'){
    document.body.classList.add('revision-integrated');
    const url=new URL(location.href);if(url.origin===root.origin){try{localStorage.setItem('revision-last-study-v1',JSON.stringify({path:relative+url.search+url.hash,level,at:Date.now()}));}catch{}}
    const skip=document.createElement('a');skip.className='revision-skip';skip.href='#revision-main';skip.textContent='Skip to study content';const main=document.querySelector('main');if(main){main.id=main.id||'revision-main';skip.href='#'+main.id;document.body.prepend(skip);}
    const remember=()=>{try{const url=new URL(location.href);localStorage.setItem('revision-last-study-v1',JSON.stringify({path:url.pathname.slice(root.pathname.length)+url.search+url.hash,level,at:Date.now()}));}catch{}};
    window.addEventListener('coursecontextchange',remember);window.addEventListener('hashchange',remember);window.addEventListener('pagehide',remember);
  }
  if(level==='teacher'){
    const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('teacher-simple.css',root).href;document.head.append(style);
    const enhancement=document.createElement('script');enhancement.src=new URL('teacher-simple.js',root).href;enhancement.defer=true;document.head.append(enhancement);
  }
  window.REVISION_ROOT=root.href;
  window.SPARK_ROOT=root.href;
})();