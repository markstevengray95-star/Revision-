(() => {
  const D = window.ELECTRICITY_TEXTBOOK;
  if (!D) return;
  const $ = id => document.getElementById(id);
  const esc = s => String(s ?? "").replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
  let active = D.chapters[0].id;

  function diagram(type) {
    const common = 'viewBox="0 0 760 330" role="img" aria-label="Original electricity teaching diagram"';
    if (type === "charge") return '<svg '+common+'><rect width="760" height="330" rx="22" fill="#081525"/><path d="M70 166H690" stroke="#c58b54" stroke-width="24" stroke-linecap="round"/><g fill="#67c7ff">'+[120,190,260,330,400,470,540,610].map(x=>'<circle cx="'+x+'" cy="166" r="11"/>').join('')+'</g><path d="M540 86H350" stroke="#ffd56a" stroke-width="5"/><path d="M350 86l22-13v26z" fill="#ffd56a"/><text x="405" y="68" fill="#ffd56a" font-size="20">electron motion</text><path d="M220 246H410" stroke="#63d9a4" stroke-width="5"/><path d="M410 246l-22-13v26z" fill="#63d9a4"/><text x="230" y="281" fill="#63d9a4" font-size="20">conventional current</text><text x="70" y="45" fill="#f2f7ff" font-size="24" font-weight="700">Current is charge flow per unit time</text></svg>';
    if (type === "iv") return '<svg '+common+'><rect width="760" height="330" rx="22" fill="#081525"/><path d="M85 280V45M85 165H700" stroke="#8aa6c3" stroke-width="3"/><text x="708" y="171" fill="#dceaff" font-size="20">V</text><text x="68" y="36" fill="#dceaff" font-size="20">I</text><path d="M120 265L665 65" stroke="#63d9a4" stroke-width="5"/><path d="M120 254C230 235 310 212 390 165S565 94 665 82M120 276C230 263 310 230 390 165S565 67 665 54" stroke="#ffd56a" stroke-width="5" fill="none"/><path d="M120 166H410C450 166 467 158 484 145C505 128 530 87 665 76" stroke="#67c7ff" stroke-width="5" fill="none"/><text x="510" y="62" fill="#63d9a4" font-size="17">ohmic</text><text x="520" y="121" fill="#ffd56a" font-size="17">filament</text><text x="512" y="195" fill="#67c7ff" font-size="17">diode</text></svg>';
    if (type === "resistivity") return '<svg '+common+'><rect width="760" height="330" rx="22" fill="#081525"/><line x1="100" y1="150" x2="650" y2="150" stroke="#d69b61" stroke-width="22" stroke-linecap="round"/><path d="M100 95V210M650 95V210M100 235H650" stroke="#8aa6c3" stroke-width="3"/><path d="M100 235l18-10v20zM650 235l-18-10v20z" fill="#8aa6c3"/><text x="346" y="270" fill="#f2f7ff" font-size="22">length L</text><circle cx="660" cy="150" r="32" fill="none" stroke="#67c7ff" stroke-width="4"/><path d="M630 150H690" stroke="#67c7ff" stroke-width="4"/><text x="616" y="78" fill="#67c7ff" font-size="20">diameter d</text><text x="240" y="52" fill="#f2f7ff" font-size="25" font-weight="700">R = ρL/A</text></svg>';
    if (type === "rp5") return '<svg '+common+'><rect width="760" height="330" rx="22" fill="#081525"/><path d="M90 95H610V245H90Z" stroke="#8aa6c3" stroke-width="4" fill="none"/><rect x="180" y="80" width="270" height="30" rx="15" fill="#c58b54"/><circle cx="545" cy="95" r="36" fill="#102a45" stroke="#67c7ff" stroke-width="4"/><text x="532" y="104" fill="#f2f7ff" font-size="28" font-weight="700">A</text><circle cx="315" cy="205" r="36" fill="#102a45" stroke="#9a86ff" stroke-width="4"/><text x="302" y="214" fill="#f2f7ff" font-size="28" font-weight="700">V</text><path d="M250 110V205M380 110V205" stroke="#9a86ff" stroke-width="4"/><path d="M95 160h35m0-30v60m18-47v34" stroke="#63d9a4" stroke-width="4"/><text x="180" y="64" fill="#dceaff" font-size="20">test wire, measured length</text><text x="80" y="294" fill="#f2f7ff" font-size="19">Measure d repeatedly with a micrometer; vary L; calculate R = V/I.</text></svg>';
    if (type === "circuits") return '<svg '+common+'><rect width="760" height="330" rx="22" fill="#081525"/><text x="110" y="42" fill="#f2f7ff" font-size="22" font-weight="700">Series</text><path d="M75 100H310V260H75Z" stroke="#8aa6c3" stroke-width="4" fill="none"/><rect x="115" y="85" width="70" height="30" rx="5" fill="#f2b66c"/><rect x="210" y="85" width="70" height="30" rx="5" fill="#f2b66c"/><text x="135" y="108" fill="#081525" font-size="17">R₁</text><text x="230" y="108" fill="#081525" font-size="17">R₂</text><text x="452" y="42" fill="#f2f7ff" font-size="22" font-weight="700">Parallel</text><path d="M405 100H690V260H405Z" stroke="#8aa6c3" stroke-width="4" fill="none"/><path d="M470 100V260M620 100V260" stroke="#8aa6c3" stroke-width="4"/><rect x="435" y="150" width="70" height="30" rx="5" fill="#f2b66c"/><rect x="585" y="150" width="70" height="30" rx="5" fill="#f2b66c"/><text x="455" y="173" fill="#081525" font-size="17">R₁</text><text x="605" y="173" fill="#081525" font-size="17">R₂</text><text x="86" y="300" fill="#63d9a4" font-size="18">same current</text><text x="510" y="300" fill="#67c7ff" font-size="18">same p.d.</text></svg>';
    if (type === "divider") return '<svg '+common+'><rect width="760" height="330" rx="22" fill="#081525"/><path d="M330 50V280" stroke="#8aa6c3" stroke-width="5"/><rect x="275" y="80" width="110" height="70" rx="12" fill="#f2b66c"/><text x="311" y="123" fill="#081525" font-size="23" font-weight="700">R₁</text><rect x="275" y="188" width="110" height="70" rx="12" fill="#67c7ff"/><text x="311" y="232" fill="#081525" font-size="23" font-weight="700">R₂</text><path d="M330 169H590" stroke="#63d9a4" stroke-width="5"/><path d="M590 169l-20-12v24z" fill="#63d9a4"/><text x="468" y="145" fill="#63d9a4" font-size="22">Vout</text><text x="88" y="90" fill="#dceaff" font-size="22">Vin</text><path d="M120 110V250" stroke="#9a86ff" stroke-width="4"/><path d="M120 110l-10 18h20zM120 250l-10-18h20z" fill="#9a86ff"/><text x="414" y="244" fill="#dceaff" font-size="18">output taken across R₂</text></svg>';
    if (type === "emf") return '<svg '+common+'><rect width="760" height="330" rx="22" fill="#081525"/><path d="M100 100H650V250H100Z" stroke="#8aa6c3" stroke-width="4" fill="none"/><path d="M160 70v60m26-45v30" stroke="#63d9a4" stroke-width="5"/><rect x="245" y="85" width="100" height="30" rx="6" fill="#9a86ff"/><text x="287" y="107" fill="#081525" font-size="18" font-weight="700">r</text><rect x="500" y="85" width="100" height="30" rx="6" fill="#f2b66c"/><text x="540" y="107" fill="#081525" font-size="18" font-weight="700">R</text><text x="135" y="55" fill="#63d9a4" font-size="20">ε</text><path d="M360 145H470" stroke="#67c7ff" stroke-width="5"/><path d="M470 145l-18-11v22z" fill="#67c7ff"/><text x="396" y="132" fill="#67c7ff" font-size="20">I</text><text x="185" y="290" fill="#f2f7ff" font-size="23" font-weight="700">ε = V + Ir</text></svg>';
    if (type === "rp6") return '<svg '+common+'><rect width="760" height="330" rx="22" fill="#081525"/><path d="M90 280V48M90 280H690" stroke="#8aa6c3" stroke-width="3"/><text x="700" y="288" fill="#dceaff" font-size="20">I</text><text x="65" y="38" fill="#dceaff" font-size="20">V</text><path d="M120 78L650 250" stroke="#67c7ff" stroke-width="5"/><circle cx="120" cy="78" r="7" fill="#ffd56a"/><text x="140" y="72" fill="#ffd56a" font-size="19">intercept = ε</text><path d="M470 145h120v40" stroke="#63d9a4" stroke-width="3" fill="none"/><text x="470" y="128" fill="#63d9a4" font-size="18">gradient = −r</text></svg>';
    return "";
  }

  function renderList() {
    const el = $("textbookList");
    if (!el) return;
    el.innerHTML = D.chapters.map(c => '<button class="textbook-chapter-button '+(c.id===active?'active':'')+'" data-textbook-chapter="'+c.id+'"><span>'+esc(c.code)+'</span><strong>'+esc(c.title)+'</strong></button>').join("");
  }

  function renderChapter() {
    const c = D.chapters.find(x => x.id === active) || D.chapters[0];
    const el = $("textbookArticle");
    if (!el) return;
    el.innerHTML =
      '<header class="textbook-title"><span class="eyebrow">'+esc(c.code)+'</span><h2>'+esc(c.title)+'</h2><p>'+esc(c.subtitle)+'</p></header>'+
      '<div class="textbook-figure">'+diagram(c.diagram)+'<div class="figure-caption">Original teaching diagram · use alongside the explanation, not as a substitute for circuit reasoning.</div></div>'+
      '<section class="textbook-specbox"><h3>AQA specification focus</h3><ul>'+c.spec.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></section>'+
      '<section class="textbook-equations"><h3>Equations to know and use</h3><div>'+c.equations.map(x=>'<code>'+esc(x)+'</code>').join("")+'</div></section>'+
      '<div class="textbook-prose">'+c.sections.map((s,i)=>'<section class="textbook-section"><div class="section-number">'+(i+1)+'</div><div><h3>'+esc(s[0])+'</h3><p>'+esc(s[1])+'</p></div></section>').join("")+'</div>'+
      '<section class="textbook-worked"><h3>Worked example</h3><p><strong>'+esc(c.worked.q)+'</strong></p><ol>'+c.worked.steps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ol></section>'+
      '<div class="textbook-bottom-grid"><section class="textbook-exam"><h3>Exam technique</h3><p>'+esc(c.exam)+'</p></section><section class="textbook-traps"><h3>Common traps</h3><ul>'+c.traps.map(x=>'<li>'+esc(x)+'</li>').join("")+'</ul></section></div>'+
      '<div class="textbook-nav-row"><button class="button" data-textbook-prev>Previous chapter</button><button class="button primary" data-textbook-next>Next chapter</button></div>';
    renderList();
  }

  function open(id) {
    if (D.chapters.some(c => c.id === id)) active = id;
    renderChapter();
    setTimeout(() => $("textbookArticle")?.scrollIntoView({behavior:"smooth", block:"start"}), 40);
  }

  document.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.textbookChapter) { open(b.dataset.textbookChapter); return; }
    if (b.hasAttribute("data-textbook-prev") || b.hasAttribute("data-textbook-next")) {
      let i = D.chapters.findIndex(c => c.id === active);
      i += b.hasAttribute("data-textbook-next") ? 1 : -1;
      i = (i + D.chapters.length) % D.chapters.length;
      open(D.chapters[i].id);
    }
  });

  window.ElectricityTextbook = { open };
  renderList();
  renderChapter();
})();