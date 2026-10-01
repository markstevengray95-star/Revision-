(() => {
  const fig = (title, body, caption) => `
    <figure class="textbook-figure">
      <div class="figure-title">${title}</div>
      ${body}
      <figcaption>${caption}</figcaption>
    </figure>`;

  const densitySvg = `<svg viewBox="0 0 720 280" role="img" aria-label="Equal volume blocks with different mass and density">
    <defs><linearGradient id="g1" x1="0" x2="1"><stop stop-color="#234b66"/><stop offset="1" stop-color="#2e7f70"/></linearGradient></defs>
    <rect x="65" y="75" width="180" height="130" rx="18" fill="url(#g1)" stroke="#7fd9ba" stroke-width="3"/>
    <rect x="475" y="75" width="180" height="130" rx="18" fill="#315a77" stroke="#8db9ff" stroke-width="3"/>
    <g fill="#dff8ef"><circle cx="95" cy="105" r="8"/><circle cx="130" cy="145" r="8"/><circle cx="180" cy="110" r="8"/><circle cx="215" cy="165" r="8"/></g>
    <g fill="#d8e7ff"><circle cx="500" cy="100" r="8"/><circle cx="530" cy="125" r="8"/><circle cx="565" cy="95" r="8"/><circle cx="605" cy="120" r="8"/><circle cx="625" cy="155" r="8"/><circle cx="585" cy="175" r="8"/><circle cx="540" cy="165" r="8"/><circle cx="510" cy="185" r="8"/></g>
    <text x="155" y="235" text-anchor="middle">same volume, lower mass</text><text x="565" y="235" text-anchor="middle">same volume, higher mass</text>
    <text x="360" y="42" text-anchor="middle" class="svg-heading">Density compares mass with volume</text>
    <path d="M275 140 H445" stroke="#ffd36f" stroke-width="4"/>
  </svg>`;

  const hookeSvg = `<svg viewBox="0 0 720 340" role="img" aria-label="Hooke's law spring and force extension graph">
    <line x1="120" y1="45" x2="120" y2="100" stroke="#9fb6ca" stroke-width="8"/><path d="M120 100 l-24 18 48 22-48 22 48 22-48 22 48 22-48 22 24 18" fill="none" stroke="#79b8ff" stroke-width="6"/><rect x="77" y="278" width="86" height="44" rx="8" fill="#315b78"/><text x="120" y="305" text-anchor="middle">load</text>
    <line x1="360" y1="280" x2="665" y2="280" stroke="#8197ab"/><line x1="360" y1="280" x2="360" y2="55" stroke="#8197ab"/>
    <path d="M360 280 L555 110 Q590 90 655 75" fill="none" stroke="#64d8ad" stroke-width="5"/><circle cx="555" cy="110" r="7" fill="#ffd36f"/><text x="568" y="104">limit of proportionality</text>
    <text x="515" y="320" text-anchor="middle">extension ΔL</text><text x="330" y="170" transform="rotate(-90 330 170)" text-anchor="middle">force F</text>
    <text x="455" y="175">gradient = k</text>
  </svg>`;

  const unloadSvg = `<svg viewBox="0 0 720 330" role="img" aria-label="Loading and unloading paths showing elastic and plastic deformation">
    <line x1="85" y1="275" x2="655" y2="275" stroke="#8197ab"/><line x1="85" y1="275" x2="85" y2="50" stroke="#8197ab"/>
    <path d="M85 275 C190 210 255 150 350 110 C430 75 510 85 590 120" fill="none" stroke="#6cdbae" stroke-width="5"/>
    <path d="M430 80 L235 250" fill="none" stroke="#8cb8ff" stroke-width="4" stroke-dasharray="10 8"/>
    <line x1="85" y1="250" x2="235" y2="250" stroke="#ffd36f" stroke-width="5"/>
    <text x="160" y="240" text-anchor="middle">permanent extension</text><text x="495" y="67">loading beyond elastic limit</text><text x="255" y="185">unloading path</text>
    <text x="370" y="314" text-anchor="middle">extension</text><text x="48" y="165" transform="rotate(-90 48 165)" text-anchor="middle">force</text>
  </svg>`;

  const energySvg = `<svg viewBox="0 0 720 320" role="img" aria-label="Area under a force extension graph representing elastic strain energy">
    <line x1="90" y1="260" x2="650" y2="260" stroke="#8197ab"/><line x1="90" y1="260" x2="90" y2="55" stroke="#8197ab"/>
    <path d="M90 260 L565 85 L565 260 Z" fill="rgba(86,214,170,.26)" stroke="#63d7aa" stroke-width="4"/>
    <text x="365" y="205" text-anchor="middle" class="svg-heading">elastic strain energy</text><text x="365" y="230" text-anchor="middle">area = ½FΔL</text>
    <text x="365" y="300" text-anchor="middle">extension ΔL</text><text x="52" y="165" transform="rotate(-90 52 165)" text-anchor="middle">force F</text>
  </svg>`;

  const stressSvg = `<svg viewBox="0 0 720 300" role="img" aria-label="Wire showing stress and strain quantities">
    <rect x="95" y="110" width="530" height="70" rx="30" fill="#274b65" stroke="#72d9b1" stroke-width="3"/>
    <line x1="35" y1="145" x2="92" y2="145" stroke="#ffd36f" stroke-width="6"/><polygon points="35,145 57,132 57,158" fill="#ffd36f"/><line x1="628" y1="145" x2="685" y2="145" stroke="#ffd36f" stroke-width="6"/><polygon points="685,145 663,132 663,158" fill="#ffd36f"/>
    <line x1="120" y1="225" x2="600" y2="225" stroke="#9fb6ca"/><line x1="120" y1="216" x2="120" y2="234" stroke="#9fb6ca"/><line x1="600" y1="216" x2="600" y2="234" stroke="#9fb6ca"/><text x="360" y="250" text-anchor="middle">original length L</text>
    <circle cx="360" cy="145" r="33" fill="#0b1824" stroke="#8cb8ff" stroke-width="3"/><line x1="360" y1="112" x2="360" y2="178" stroke="#8cb8ff"/><text x="410" y="148">cross-sectional area A</text>
    <text x="75" y="102">F</text><text x="640" y="102">F</text>
  </svg>`;

  const youngSvg = `<svg viewBox="0 0 720 330" role="img" aria-label="Stress strain graph showing Young modulus as gradient">
    <line x1="90" y1="270" x2="650" y2="270" stroke="#8197ab"/><line x1="90" y1="270" x2="90" y2="50" stroke="#8197ab"/>
    <path d="M90 270 L555 75" fill="none" stroke="#79b8ff" stroke-width="5"/>
    <path d="M235 270 L555 135 L555 270 Z" fill="rgba(255,211,111,.13)" stroke="#ffd36f" stroke-width="2" stroke-dasharray="7 6"/>
    <text x="445" y="185" class="svg-heading">E = Δstress / Δstrain</text><text x="370" y="310" text-anchor="middle">tensile strain</text><text x="50" y="160" transform="rotate(-90 50 160)" text-anchor="middle">tensile stress</text>
  </svg>`;

  const curvesSvg = `<svg viewBox="0 0 720 350" role="img" aria-label="Comparison of simplified stress strain curves for brittle and ductile materials">
    <line x1="80" y1="290" x2="660" y2="290" stroke="#8197ab"/><line x1="80" y1="290" x2="80" y2="45" stroke="#8197ab"/>
    <path d="M80 290 L225 95" fill="none" stroke="#ff9f86" stroke-width="5"/><circle cx="225" cy="95" r="7" fill="#ff9f86"/><text x="165" y="80">brittle</text>
    <path d="M80 290 L235 110 C310 75 430 92 520 135 C575 162 610 200 620 235" fill="none" stroke="#6fdbae" stroke-width="5"/><circle cx="620" cy="235" r="7" fill="#6fdbae"/><text x="535" y="120">ductile</text>
    <text x="370" y="330" text-anchor="middle">strain</text><text x="43" y="170" transform="rotate(-90 43 170)" text-anchor="middle">stress</text>
  </svg>`;

  const rpSvg = `<svg viewBox="0 0 720 390" role="img" aria-label="Young modulus practical apparatus with reference and test wires">
    <rect x="95" y="35" width="530" height="34" rx="10" fill="#47647a"/><line x1="250" y1="69" x2="250" y2="290" stroke="#8cb8ff" stroke-width="4"/><line x1="455" y1="69" x2="455" y2="290" stroke="#72d9b1" stroke-width="4"/>
    <rect x="200" y="290" width="100" height="48" rx="10" fill="#315a77"/><rect x="405" y="290" width="100" height="48" rx="10" fill="#315a77"/>
    <text x="250" y="319" text-anchor="middle">reference</text><text x="455" y="319" text-anchor="middle">load</text>
    <line x1="230" y1="200" x2="480" y2="200" stroke="#ffd36f" stroke-width="3" stroke-dasharray="9 7"/><text x="520" y="204">fiducial marker</text>
    <rect x="110" y="120" width="95" height="55" rx="8" fill="#183143" stroke="#8cb8ff"/><text x="158" y="142" text-anchor="middle">micrometer</text><text x="158" y="162" text-anchor="middle">measure d</text>
    <text x="352" y="366" text-anchor="middle">measure ΔL for known F, then plot stress against strain</text>
  </svg>`;

  window.MATERIALS_V3_VISUALS={fig,densitySvg,hookeSvg,unloadSvg,energySvg,stressSvg,youngSvg,curvesSvg,rpSvg};
})();
