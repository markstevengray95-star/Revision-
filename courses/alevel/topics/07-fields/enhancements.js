(() => {
  'use strict';
  const head = document.head || document.documentElement;
  const addCss = (href, key) => {
    if (document.querySelector(`link[data-${key}]`)) return;
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = href;
    css.dataset[key.replace(/-([a-z])/g,(_,c)=>c.toUpperCase())] = 'true';
    head.appendChild(css);
  };
  addCss('enhancements-v5.css?v=5','fields-v5');
  addCss('enhancements-v7.css?v=7.1','fields-v7');
  addCss('enhancements-v8.css?v=8','fields-v8');
  addCss('enhancements-v9.css?v=9.1','fields-v9');
  addCss('enhancements-v10.css?v=10','fields-v10');
  addCss('enhancements-v11.css?v=11','fields-v11');
  const loadEnhancements = () => {
    if (document.querySelector('script[data-fields-v11-three-polish]')) return;
    [
      ['topic-practice-v5.js?v=5','fieldsV5'],
      ['sim-challenges-v5.js?v=5','fieldsV5'],
      ['v6-upgrades.js?v=6','fieldsV6'],
      ['lesson-depth-v7.js?v=7.1','fieldsV7'],
      ['v7-reliability.js?v=7.1','fieldsV7Reliability'],
      ['learning-v8.js?v=8','fieldsV8Learning'],
      ['legacy-motion-v9.js?v=9.1','fieldsV9LegacyMotion'],
      ['sim-runtime-v9.js?v=9.1','fieldsV9Runtime'],
      ['equation-clinic-v9.js?v=9.1','fieldsV9Equations'],
      ['lesson-depth-v10.js?v=10','fieldsV10Lessons'],
      ['lesson-visuals-v11.js?v=11','fieldsV11Lessons'],
      ['three-polish-v11.js?v=11','fieldsV11ThreePolish']
    ].forEach(([src,key]) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.dataset[key] = 'true';
      document.body.appendChild(s);
    });
    if (!document.querySelector('script[data-fields-v9-three]')) {
      const m = document.createElement('script');
      m.type = 'module';
      m.src = 'three-lab-v9.js?v=9.1';
      m.dataset.fieldsV9Three = 'true';
      document.body.appendChild(m);
    }
    if (!document.querySelector('script[data-fields-v10-core-three]')) {
      const m = document.createElement('script');
      m.type = 'module';
      m.src = 'core-3d-v10.js?v=10.1';
      m.dataset.fieldsV10CoreThree = 'true';
      document.body.appendChild(m);
    }
  };
  if (document.readyState === 'complete') loadEnhancements();
  else window.addEventListener('load', loadEnhancements, { once:true });
})();