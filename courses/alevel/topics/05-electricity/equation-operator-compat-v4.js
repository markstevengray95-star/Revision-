(() => {
  const equationSelector='.formula-chip,.textbook-equations code';
  const normalizeOperators=text=>String(text||'')
    .replace(/[−–—]/g,'-')
    .replace(/[＋]/g,'+')
    .replace(/[÷]/g,'/')
    .replace(/[⋅∙]/g,'·');

  function prepareTarget(target){
    const original=target.textContent;
    const normalized=normalizeOperators(original);
    if(normalized===original)return;
    target.textContent=normalized;
    // Restore after the current click/key event has completely finished so the
    // equation-coach bubble listener reads the normalised form first.
    setTimeout(()=>{ if(target.isConnected) target.textContent=original; },0);
  }

  document.addEventListener('click',e=>{
    const target=e.target.closest?.(equationSelector);
    if(target)prepareTarget(target);
  },true);

  document.addEventListener('keydown',e=>{
    if(e.key!=='Enter'&&e.key!==' ')return;
    const target=e.target.closest?.(equationSelector);
    if(target)prepareTarget(target);
  },true);
})();