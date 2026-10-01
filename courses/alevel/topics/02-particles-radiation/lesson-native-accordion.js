(() => {
  'use strict';

  // Keep native <details> headings and the guided chunk state in sync.
  // Opening a closed heading uses the same selector path as the numbered
  // chunk buttons, so one chunk remains active and saved consistently.
  document.addEventListener('click',event=>{
    const summary=event.target.closest?.('#lessonPanel .native-chunk-summary');
    if(!summary)return;
    const detail=summary.closest('.lesson-chunk-rich[data-lesson-chunk]');
    if(!detail||detail.open)return; // Allow the browser to close an already-open section normally.
    const index=detail.dataset.lessonChunk;
    const selector=document.querySelector(`#lessonPanel [data-core-chunk="${index}"]`);
    if(!selector)return;
    event.preventDefault();
    event.stopPropagation();
    selector.click();
  },true);
})();
