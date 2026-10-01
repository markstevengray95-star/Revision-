(()=>{
  const chapters = window.WAVES_TEXTBOOK || [];
  const toc = document.getElementById("textbookToc");
  const reader = document.getElementById("textbookReader");
  const search = document.getElementById("textbookSearch");
  if(!toc || !reader || !chapters.length) return;

  let activeId = chapters[0].id;

  const esc = s => String(s).replace(/[&<>"']/g, m => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));

  function diagramSVG(type){
    const common = 'viewBox="0 0 760 300" role="img" class="textbook-diagram-svg"';
    if(type==="wave") return `<svg ${common} aria-label="Progressive wave diagram">
      <defs><marker id="arr1" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="currentColor"/></marker></defs>
      <line x1="40" y1="150" x2="720" y2="150" class="d-axis"/>
      <path d="M40 150 C95 40 150 40 205 150 S315 260 370 150 S480 40 535 150 S645 260 700 150" class="d-wave"/>
      <line x1="150" y1="150" x2="150" y2="55" class="d-measure"/><text x="160" y="88">amplitude A</text>
      <line x1="150" y1="42" x2="480" y2="42" class="d-measure" marker-end="url(#arr1)"/><text x="292" y="30">wavelength λ</text>
      <circle cx="150" cy="55" r="6" class="d-dot"/><circle cx="480" cy="55" r="6" class="d-dot"/>
      <text x="40" y="285">Energy propagates → while particles oscillate about equilibrium</text>
    </svg>`;
    if(type==="polarisation") return `<svg ${common} aria-label="Transverse and longitudinal waves">
      <text x="28" y="34">Transverse</text><line x1="40" y1="95" x2="720" y2="95" class="d-axis"/>
      <path d="M50 95 C110 25 170 165 230 95 S350 25 410 95 S530 165 590 95 S680 25 715 80" class="d-wave"/>
      <text x="28" y="184">Longitudinal</text>
      <g class="d-particles">${Array.from({length:28},(_,i)=>{const x=52+i*24+(Math.sin(i*.9)*8);return `<circle cx="${x}" cy="225" r="5"/>`;}).join("")}</g>
      <path d="M55 266 H710" class="d-measure"/><text x="274" y="291">direction of energy transfer →</text>
    </svg>`;
    if(type==="standing") return `<svg ${common} aria-label="Stationary wave nodes and antinodes">
      <line x1="55" y1="150" x2="705" y2="150" class="d-axis"/>
      <path d="M55 150 Q135 40 215 150 Q295 260 375 150 Q455 40 535 150 Q620 260 705 150" class="d-wave"/>
      <path d="M55 150 Q135 260 215 150 Q295 40 375 150 Q455 260 535 150 Q620 40 705 150" class="d-wave d-wave-soft"/>
      <g class="d-nodes"><circle cx="55" cy="150" r="7"/><circle cx="215" cy="150" r="7"/><circle cx="375" cy="150" r="7"/><circle cx="535" cy="150" r="7"/><circle cx="705" cy="150" r="7"/></g>
      <text x="42" y="184">node</text><text x="120" y="38">antinode</text>
      <line x1="55" y1="275" x2="215" y2="275" class="d-measure"/><text x="112" y="264">λ/2</text>
    </svg>`;
    if(type==="interference") return `<svg ${common} aria-label="Young double slit interference">
      <line x1="120" y1="45" x2="120" y2="255" class="d-screen"/>
      <line x1="365" y1="45" x2="365" y2="255" class="d-screen"/>
      <rect x="357" y="112" width="16" height="15" class="d-gap"/><rect x="357" y="175" width="16" height="15" class="d-gap"/>
      <line x1="373" y1="120" x2="675" y2="82" class="d-ray"/><line x1="373" y1="183" x2="675" y2="82" class="d-ray"/>
      <g>${Array.from({length:13},(_,i)=>`<rect x="690" y="${40+i*17}" width="28" height="10" rx="4" class="${i%2?"d-dark":"d-bright"}"/>`).join("")}</g>
      <text x="28" y="30">source</text><text x="320" y="30">double slit</text><text x="664" y="30">screen fringes</text>
      <text x="430" y="275">path difference determines bright / dark</text>
    </svg>`;
    if(type==="diffraction") return `<svg ${common} aria-label="Single slit and diffraction grating">
      <line x1="210" y1="35" x2="210" y2="120" class="d-screen"/><line x1="210" y1="180" x2="210" y2="265" class="d-screen"/>
      <path d="M30 150 H205" class="d-ray"/><path d="M218 150 Q350 35 520 40" class="d-wave"/><path d="M218 150 Q350 265 520 260" class="d-wave"/>
      <text x="108" y="132">narrow slit</text><text x="310" y="22">spreading increases when slit narrows</text>
      <g>${Array.from({length:11},(_,i)=>`<line x1="${560+i*9}" y1="72" x2="${560+i*9}" y2="228" class="d-grating"/>`).join("")}</g>
      <path d="M610 150 L720 85 M610 150 L720 150 M610 150 L720 215" class="d-ray"/>
      <text x="545" y="50">grating</text><text x="655" y="277">orders</text>
    </svg>`;
    if(type==="refraction") return `<svg ${common} aria-label="Refraction and total internal reflection">
      <line x1="35" y1="150" x2="725" y2="150" class="d-boundary"/><line x1="380" y1="25" x2="380" y2="275" class="d-normal"/>
      <path d="M210 40 L380 150 L475 265" class="d-ray"/>
      <text x="52" y="70">medium 1</text><text x="52" y="225">medium 2</text><text x="392" y="63">normal</text>
      <path d="M380 150 Q420 118 470 150" class="d-angle"/><text x="440" y="128">θ₂</text>
      <path d="M305 98 Q345 72 380 105" class="d-angle"/><text x="320" y="72">θ₁</text>
    </svg>`;
    if(type==="fibre") return `<svg ${common} aria-label="Step index optical fibre">
      <rect x="40" y="70" width="680" height="160" rx="30" class="d-cladding"/><rect x="40" y="105" width="680" height="90" rx="18" class="d-core"/>
      <path d="M65 150 L205 112 L345 188 L485 112 L625 188 L700 150" class="d-ray"/>
      <path d="M65 150 C240 135 415 165 700 150" class="d-ray d-ray-soft"/>
      <text x="55" y="92">lower-n cladding</text><text x="55" y="136">higher-n core</text><text x="360" y="264">different paths → modal dispersion</text>
    </svg>`;
    return `<svg ${common} aria-label="Required practical apparatus overview">
      <line x1="70" y1="105" x2="610" y2="105" class="d-string"/><path d="M70 105 Q205 35 340 105 Q475 175 610 105" class="d-wave"/>
      <circle cx="620" cy="105" r="22" class="d-pulley"/><line x1="642" y1="105" x2="642" y2="222" class="d-string"/><rect x="615" y="218" width="54" height="40" rx="6" class="d-mass"/>
      <text x="65" y="35">RP1: stationary waves on a string</text><text x="488" y="285">T ≈ mg</text>
      <line x1="75" y1="270" x2="335" y2="270" class="d-measure"/><text x="165" y="260">measure L</text>
    </svg>`;
  }

  function chapterMatches(ch,q){
    if(!q) return true;
    const hay = [ch.title,ch.code,ch.summary,...ch.spec,...ch.sections.flatMap(s=>[s.h,s.p,...(s.eq||[])]),ch.example.q,...ch.example.steps,ch.example.answer,...ch.exam].join(" ").toLowerCase();
    return hay.includes(q.toLowerCase());
  }

  function renderToc(q=""){
    const filtered = chapters.filter(ch=>chapterMatches(ch,q));
    toc.innerHTML = `<div class="toc-head"><span class="eyebrow">Contents</span><strong>${filtered.length} chapters</strong></div>` +
      filtered.map((ch,i)=>`<button class="textbook-toc-button ${ch.id===activeId?"active":""}" data-chapter="${esc(ch.id)}">
        <span class="course-code">${esc(ch.code)}</span>
        <span><b>${i+1}.</b> ${esc(ch.title)}</span>
      </button>`).join("");
    toc.querySelectorAll("[data-chapter]").forEach(b=>b.addEventListener("click",()=>{activeId=b.dataset.chapter;renderToc(search?.value||"");renderReader();}));
    if(filtered.length && !filtered.some(ch=>ch.id===activeId)){activeId=filtered[0].id;renderReader();}
    if(!filtered.length) toc.innerHTML += '<div class="textbook-empty">No chapter matches that search.</div>';
  }

  function renderReader(){
    const ch = chapters.find(x=>x.id===activeId) || chapters[0];
    reader.innerHTML = `
      <div class="textbook-hero">
        <div><span class="eyebrow">AQA ${esc(ch.code)}</span><h2>${esc(ch.title)}</h2><p>${esc(ch.summary)}</p></div>
        <div class="textbook-spec-box"><strong>Specification checklist</strong><ul>${ch.spec.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
      </div>
      <figure class="textbook-figure">${diagramSVG(ch.icon)}<figcaption>Original schematic diagram for learning; not drawn to scale.</figcaption></figure>
      <div class="textbook-prose">
        ${ch.sections.map((s,i)=>`<section class="textbook-section"><span class="textbook-section-number">${i+1}</span><div><h3>${esc(s.h)}</h3><p>${esc(s.p)}</p>${(s.eq||[]).map(eq=>`<div class="equation textbook-equation">${esc(eq)}</div>`).join("")}</div></section>`).join("")}
      </div>
      <section class="textbook-worked">
        <span class="eyebrow">Worked example</span><h3>${esc(ch.example.q)}</h3>
        <ol>${ch.example.steps.map(x=>`<li>${esc(x)}</li>`).join("")}</ol>
        <div class="lesson-callout"><strong>Answer:</strong> ${esc(ch.example.answer)}</div>
      </section>
      <section class="textbook-exam">
        <span class="eyebrow">Exam focus</span><h3>What AQA-style answers need</h3>
        <ul>${ch.exam.map(x=>`<li>${esc(x)}</li>`).join("")}</ul>
      </section>
      <div class="textbook-reader-nav">
        <button class="button" id="textbookPrev">← Previous chapter</button>
        <button class="button primary" id="textbookNext">Next chapter →</button>
      </div>`;
    const idx=chapters.indexOf(ch);
    const prev=document.getElementById("textbookPrev"), next=document.getElementById("textbookNext");
    prev.disabled=idx===0; next.disabled=idx===chapters.length-1;
    prev.onclick=()=>{if(idx>0){activeId=chapters[idx-1].id;renderToc(search?.value||"");renderReader();reader.scrollIntoView({behavior:"smooth",block:"start"});}};
    next.onclick=()=>{if(idx<chapters.length-1){activeId=chapters[idx+1].id;renderToc(search?.value||"");renderReader();reader.scrollIntoView({behavior:"smooth",block:"start"});}};
  }

  window.openWavesTextbookChapter = code => {
    const map = [
      ["3.3.1.1","progressive"],["3.3.1.2","types"],["3.3.1.3","stationary"],
      ["3.3.2.1","interference"],["3.3.2.2","diffraction"],["3.3.2.3","refraction"],
      ["RP1","practicals"],["RP2","practicals"]
    ];
    const hit = map.find(([prefix])=>String(code).includes(prefix));
    if(hit){activeId=hit[1];renderToc("");renderReader();}
  };
  search?.addEventListener("input",()=>renderToc(search.value.trim()));
  renderToc();
  renderReader();
})();