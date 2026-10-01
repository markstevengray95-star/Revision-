(() => {
  'use strict';
  if(!document.querySelector('link[data-textbook-active-practice]')){
    const link=document.createElement('link');
    link.rel='stylesheet';
    link.href='textbook-active-practice.css?v=active-practice-1';
    link.dataset.textbookActivePractice='1';
    document.head.appendChild(link);
  }
  for(const src of ['lesson-native-accordion.js?v=native-sync-1','textbook-chapters-v2.js?v=full-textbook-2','textbook-active-practice.js?v=active-practice-1']){
    const script=document.createElement('script');
    script.src=src;
    script.async=false;
    document.head.appendChild(script);
  }
})();
