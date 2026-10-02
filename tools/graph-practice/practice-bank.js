/* Original generated datasets for graph skills; no exam-paper images or remote dependencies. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.RevisionGraphBank=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const contexts=[];
  const add=(id,level,subject,title,x,y,family,interpretation)=>contexts.push({id,level,subject,title,x,y,family,interpretation});
  [
    ['motion','physics','Displacement and time','Time (s)','Displacement (m)','linear','Gradient of displacement–time is velocity.'],
    ['acceleration','physics','Velocity and time','Time (s)','Velocity (m/s)','linear','Gradient gives acceleration; signed area gives displacement.'],
    ['spring','physics','Spring extension','Force (N)','Extension (cm)','direct','Within the proportional region, extension is proportional to force. Convert cm to m before finding spring constant.'],
    ['ohm','physics','Ohmic conductor','Current (A)','Potential difference (V)','direct','Gradient of V against I gives resistance.'],
    ['density','physics','Mass and volume','Volume (cm³)','Mass (g)','direct','Gradient of mass against volume is density.'],
    ['cooling','physics','Cooling liquid','Time (min)','Temperature (°C)','decay-offset','Cooling slows as the liquid approaches room temperature.'],
    ['filament','physics','Filament lamp','Potential difference (V)','Current (A)','root','The filament heats up and resistance increases; current rises less rapidly.'],
    ['gas','physics','Gas pressure and volume','Volume (cm³)','Pressure (kPa)','inverse','Fixed gas mass at constant temperature: pV is constant.'],
    ['energy','physics','Kinetic energy and speed','Speed (m/s)','Kinetic energy (J)','quadratic','At fixed mass, kinetic energy is proportional to speed squared.'],
    ['radiation','physics','Radioactive count rate','Time (s)','Corrected count rate (counts/s)','decay','Background has been subtracted. Equal time intervals leave the same fraction.'],
    ['speed-area','physics','Journey speed','Time (s)','Speed (m/s)','piecewise','Area under a speed–time graph is total distance.'],
    ['energy-bars','physics','Electrical energy sources','Source','Energy (kWh)','bar','Categories need separated bars; the largest category is the mode.'],
    ['reaction','chemistry','Gas-producing reaction','Time (s)','Gas volume (cm³)','plateau','The gradient is reaction rate; it falls as reactants are used up.'],
    ['rate-concentration','chemistry','Rate and concentration','Concentration (mol/dm³)','Rate (cm³/s)','direct','At fixed conditions, this dataset shows rate proportional to concentration.'],
    ['calorimetry','chemistry','Energy and temperature rise','Temperature rise (°C)','Energy (J)','direct','Gradient equals mass × specific heat capacity for the sample.'],
    ['solubility','chemistry','Solubility and temperature','Temperature (°C)','Solubility (g/100 g water)','linear','Solubility is the mass dissolving in a fixed solvent amount, not reaction rate.'],
    ['chromatography','chemistry','Chromatography distances','Solvent front distance (cm)','Spot distance (cm)','direct','Gradient is Rf when both distances start at the baseline.'],
    ['mass-loss','chemistry','Mass loss during reaction','Time (s)','Mass remaining (g)','decay-offset','Mass loss per unit time is the magnitude of the negative gradient.'],
    ['products','chemistry','Comparing product yields','Method','Yield (%)','bar','Compare methods using the same yield calculation and conditions.'],
    ['titration','chemistry','Acid–base titration','Base volume (cm³)','pH','sigmoid','The steep section identifies an approximate equivalence region.'],
    ['photosynthesis','biology','Photosynthesis and light','Light intensity (a.u.)','Photosynthesis rate (a.u.)','plateau','At high light intensity another factor limits photosynthesis.'],
    ['enzyme-ph','biology','Enzyme pH response','pH','Rate (a.u.)','peak','The peak gives optimum pH; activity decreases on either side.'],
    ['osmosis','biology','Osmosis mass change','Solution concentration (mol/dm³)','Mass change (%)','negative','The zero crossing estimates isotonic concentration for this tissue.'],
    ['transpiration','biology','Potometer bubble distance','Time (s)','Bubble distance (mm)','direct','Gradient is bubble speed; multiply by capillary area to estimate uptake rate.'],
    ['population','biology','Population growth','Time (days)','Population (a.u.)','growth','Ideal exponential growth assumes no limiting factors.'],
    ['habitat','biology','Quadrat species counts','Species','Count','bar','Counts are discrete. Compare samples collected with the same effort.'],
    ['temperature-enzyme','biology','Enzyme temperature response','Temperature (°C)','Rate (a.u.)','peak','A model optimum is shown; do not assume the same optimum for all enzymes.'],
    ['germination','biology','Seed germination over time','Time (days)','Germination (%)','plateau','Cumulative germination approaches a maximum; compare conditions fairly.'],
  ].forEach(r=>add(r[0],'gcse',...r.slice(1)));
  [
    ['wire','physics','Wire extension and force','Force (N)','Extension (mm)','direct','Gradient = L/(AE). Use the original length and cross-sectional area to find Young modulus.'],
    ['shm','physics','Simple harmonic displacement','Time (s)','Displacement (m)','sine','The displacement repeats periodically; gradient is instantaneous velocity.'],
    ['capacitor','physics','Capacitor discharge','Time (s)','Voltage (V)','decay','At one RC time constant, voltage is 1/e of its initial value.'],
    ['capacitor-charge','physics','Capacitor charging','Time (s)','Voltage (V)','plateau','Initially uncharged capacitor approaches supply voltage.'],
    ['ln-charge','physics','Linearised capacitor discharge','Time (s)','ln(Q/Q₀)','negative-origin','Gradient = −1/(RC); logarithm of a ratio is dimensionless.'],
    ['inverse-radius','physics','Gravitational field','Distance from centre (a.u.)','Field strength (a.u.)','inverse-square','Radial gravitational field strength follows an inverse-square relationship.'],
    ['flux','physics','Alternating EMF','Time (s)','EMF (V)','sine','A uniformly rotating coil produces sinusoidal EMF.'],
    ['force-time','physics','Collision force pulse','Time (s)','Force (N)','piecewise','Area under force–time is impulse, the change in momentum.'],
    ['pressure-volume','physics','Gas expansion work','Volume (m³)','Pressure (Pa)','linear','Area under p–V gives work done by gas between the volume limits.'],
    ['resonance','physics','Forced oscillation response','Driving frequency (Hz)','Amplitude (a.u.)','peak','The response peaks near resonance; damping changes the height and width.'],
    ['temperature-pressure','physics','Ideal gas at fixed volume','Temperature (K)','Pressure (Pa)','direct','Absolute temperature must be in K; at fixed gas mass and volume p ∝ T.'],
    ['ln-activity','physics','Linearised radioactive decay','Time (s)','ln(A/A₀)','negative-origin','Gradient = −λ; half-life = ln(2)/λ.'],
    ['first-order','chemistry','First-order reactant decay','Time (s)','Concentration (mol/dm³)','decay','Constant half-life is characteristic of first-order decay under these conditions.'],
    ['zero-order','chemistry','Zero-order concentration','Time (s)','Concentration (mol/dm³)','negative','Constant negative gradient gives the zero-order rate constant.'],
    ['second-order','chemistry','Second-order rate dependence','Concentration (mol/dm³)','Rate (mol/(dm³ s))','quadratic','Doubling reactant concentration gives four times the rate when order is two.'],
    ['arrhenius','chemistry','Arrhenius plot','1/T (K⁻¹)','ln(k)','negative','Gradient = −Ea/R; intercept = ln(A).'],
    ['gibbs','chemistry','Gibbs energy and temperature','Temperature (K)','Gibbs energy (kJ/mol)','negative','Gradient = −ΔS with compatible units; the intercept is ΔH.'],
    ['beer','chemistry','Colorimetry calibration','Concentration (mol/dm³)','Absorbance (a.u.)','direct','Calibration is valid within its measured concentration range.'],
    ['equilibrium','chemistry','Equilibrium approach','Time (s)','Product concentration (mol/dm³)','plateau','Concentration becomes constant at dynamic equilibrium; reactions continue.'],
    ['ionisation','chemistry','Successive ionisation energies','Ionisation number','Energy (kJ/mol)','bar','Discrete ionisation stages use separate bars; a jump can indicate a new shell.'],
    ['substrate','biology','Enzyme substrate concentration','Substrate concentration (a.u.)','Rate (a.u.)','plateau','Saturation occurs when enzyme active sites limit the rate.'],
    ['oxygen','biology','Oxygen dissociation curve','Oxygen partial pressure (kPa)','Haemoglobin saturation (%)','sigmoid','Cooperative binding gives an S-shaped curve; curve position depends on conditions.'],
    ['cardiac','biology','Heart rate and cardiac output','Heart rate (beats/min)','Cardiac output (cm³/min)','direct','With fixed stroke volume the gradient equals stroke volume.'],
    ['respiration','biology','Respirometer measurements','Time (s)','Oxygen uptake (cm³)','direct','Gradient is uptake rate; control temperature and account for carbon dioxide absorption.'],
    ['log-growth','biology','Logarithmic bacterial growth','Time (min)','ln(N/N₀)','direct','Exponential growth becomes linear on a log plot; gradient is specific growth rate.'],
    ['ecology','biology','Ecological population response','Time (days)','Population (a.u.)','sigmoid','A logistic model approaches carrying capacity; real ecosystems may fluctuate.'],
    ['inhibitor','biology','Enzyme activity with inhibitor','Inhibitor concentration (a.u.)','Rate (a.u.)','inverse','This model decreases with inhibitor concentration; the shape alone does not establish mechanism.'],
    ['biomass','biology','Trophic biomass comparison','Trophic level','Biomass (g/m²)','bar','Compare biomass using the same area and time; transfer is inefficient.'],
    ['action-potential','biology','Membrane potential pulse','Time (ms)','Potential change (mV)','peak','This simplified pulse practises reading and rate skills; a complete action potential also has resting potential and undershoot.'],
    ['diffusion','biology','Diffusion distance model','Time (s)','Distance (mm)','root','In a simple diffusion model, characteristic distance scales with √time.'],
  ].forEach(r=>add(r[0],'alevel',...r.slice(1)));
  function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
  const round=n=>Number(n.toPrecision(4));
  function build(id,seed=1,skill='reading') {
    const context=contexts.find(c=>c.id===id);if(!context)throw Error('Unknown graph scenario');
    const random=rng(seed),a=2+Math.floor(random()*7),b=5+Math.floor(random()*20),scale=1+Math.floor(random()*3),maxX=context.id==='enzyme-ph'?14:context.id==='temperature-enzyme'?60:context.id==='arrhenius'?.004:10*scale;
    let fn,derivative;
    switch(context.family){
      case 'linear':fn=x=>a*x+b;derivative=()=>a;break;
      case 'direct':fn=x=>a*x;derivative=()=>a;break;
      case 'negative':fn=x=>a*(maxX-x)+b;derivative=()=>-a;break;
      case 'negative-origin':fn=x=>-a*x/10;derivative=()=>-a/10;break;
      case 'quadratic':fn=x=>a*x*x/maxX;derivative=x=>2*a*x/maxX;break;
      case 'root':fn=x=>a*Math.sqrt(x);derivative=x=>a/(2*Math.sqrt(x));break;
      case 'inverse':fn=x=>a*maxX/x;derivative=x=>-a*maxX/(x*x);break;
      case 'inverse-square':fn=x=>a*maxX*scale/(x*x);derivative=x=>-2*a*maxX*scale/(x*x*x);break;
      case 'decay':fn=x=>a*10*Math.exp(-x/(maxX/2));derivative=x=>-fn(x)/(maxX/2);break;
      case 'decay-offset':fn=x=>b+a*10*Math.exp(-x/(maxX/2));derivative=x=>-(fn(x)-b)/(maxX/2);break;
      case 'plateau':fn=x=>a*10*(1-Math.exp(-x/(maxX/3)));derivative=x=>a*10/(maxX/3)*Math.exp(-x/(maxX/3));break;
      case 'growth':fn=x=>b*Math.exp(x/(maxX/2));derivative=x=>fn(x)/(maxX/2);break;
      case 'sigmoid':fn=x=>100/(1+Math.exp(-(x-maxX/2)/(maxX/10)));derivative=x=>{const y=fn(x);return y*(1-y/100)/(maxX/10);};break;
      case 'peak':fn=x=>a*10*Math.exp(-(((x-maxX/2)/(maxX/4))**2));derivative=x=>fn(x)*(-2*(x-maxX/2)/(maxX/4)**2);break;
      case 'sine':fn=x=>a*5*Math.sin(2*Math.PI*x/maxX);derivative=x=>a*5*2*Math.PI/maxX*Math.cos(2*Math.PI*x/maxX);break;
      case 'piecewise':fn=x=>x<maxX/3?a*x:x<2*maxX/3?a*maxX/3:a*(maxX-x);derivative=x=>x<maxX/3?a:x<2*maxX/3?0:-a;break;
      case 'bar':fn=()=>0;derivative=()=>0;break;
    }
    if(context.id==='chromatography'){fn=x=>.1*a*x;derivative=()=>.1*a;}
    if(context.id==='first-order'){fn=x=>.1*Math.exp(-x/(maxX/2));derivative=x=>-fn(x)/(maxX/2);}
    if(context.id==='zero-order'){fn=x=>.1-.002*x;derivative=()=>-.002;}
    if(context.id==='arrhenius'){fn=x=>25-a*1000*x;derivative=()=>-a*1000;}
    if(context.id==='titration'){fn=x=>14/(1+Math.exp(-(x-maxX/2)/(maxX/10)));derivative=x=>{const y=fn(x);return y*(1-y/14)/(maxX/10);};}
    if(context.id==='osmosis'){fn=x=>30-3*x;derivative=()=>-3;}
    const minX=context.family==='inverse'||context.family==='inverse-square'?scale:0;
    let points=context.family==='bar'?Array.from({length:5},(_,i)=>({x:i+1,y:10+Math.floor(random()*70)})):Array.from({length:121},(_,i)=>({x:minX+i*(maxX-minX)/120,y:fn(minX+i*(maxX-minX)/120)}));
    if(context.family==='bar'){const used=new Set();points.forEach(p=>{while(used.has(p.y))p.y=10+(p.y-9)%70;used.add(p.y);});}
    let ymin=Math.min(0,...points.map(p=>p.y)),ymax=Math.max(.001,...points.map(p=>p.y));const ypad=(ymax-ymin)*.1;ymin=ymin<0?ymin-ypad:0;ymax+=ypad;
    const t=maxX*.4,p1={x:maxX*.2,y:round(fn(maxX*.2))},p2={x:maxX*.8,y:round(fn(maxX*.8))};
    let prompt,expected,unit='',options,working,marks=[],tangent;
    if(context.family==='bar'){skill=['gradient','bar-total','area'].includes(skill)?'bar-total':'bar-largest';const top=points.reduce((p,q)=>q.y>p.y?q:p);if(skill==='bar-total'){expected=points.reduce((s,p)=>s+p.y,0);prompt='Calculate the total of the five category values.';unit=context.y.match(/\((.+)\)/)?.[1]||'count';working='Add the five displayed bar heights: '+points.map(p=>p.y).join(' + ')+' = '+expected+'.';}else{expected='Category '+top.x;options=points.map(p=>'Category '+p.x);prompt='Which category has the largest value?';working='Compare bar heights: Category '+top.x+' is tallest ('+top.y+').';}}
    else if(skill==='gradient'){expected=(p2.y-p1.y)/(p2.x-p1.x);prompt='Calculate the average gradient between the two marked coordinates. Use Δy / Δx.';unit='y-unit/x-unit';marks=[p1,p2];working=`Δy = ${p2.y} − ${p1.y} = ${round(p2.y-p1.y)}; Δx = ${p2.x} − ${p1.x} = ${p2.x-p1.x}; gradient = ${round(expected)} (${context.y} per ${context.x}). This is an average rate, not a tangent gradient.`;}
    else if(skill==='tangent'){expected=derivative(t);prompt='Find the instantaneous gradient using the two labelled points on the dashed tangent.';unit='y-unit/x-unit';const dt=maxX*.1;marks=[{x:round(t-dt),y:round(fn(t)-expected*dt)},{x:round(t+dt),y:round(fn(t)+expected*dt)}];expected=(marks[1].y-marks[0].y)/(marks[1].x-marks[0].x);tangent=marks;working=`Tangent gradient = (${marks[1].y} − ${marks[0].y}) / (${marks[1].x} − ${marks[0].x}) = ${round(expected)}. Use the tangent points, not two points on the curve.`;}
    else if(skill==='area'&&['linear','direct','negative','piecewise'].includes(context.family)){const areaPoints=context.family==='piecewise'?[{x:0,y:0},{x:maxX/3,y:a*maxX/3},{x:2*maxX/3,y:a*maxX/3},{x:maxX,y:0}]:[{x:0,y:fn(0)},{x:maxX,y:fn(maxX)}];points=areaPoints;marks=areaPoints.map(p=>({x:round(p.x),y:round(p.y)}));expected=marks.slice(1).reduce((sum,p,i)=>sum+(p.x-marks[i].x)*(p.y+marks[i].y)/2,0);prompt='Calculate the area under the graph over the full displayed x interval using the labelled vertices.';unit='y-unit × x-unit';working='Split the area into trapezia. Area = Σ ½(y₁ + y₂)(x₂ − x₁) = '+round(expected)+'. Its physical meaning follows the axis units; for speed–time it is distance.';}
    else if(skill==='relationship'){expected=({direct:'Directly proportional',linear:'Linear with intercept',negative:'Linear with negative gradient','negative-origin':'Linear with negative gradient',quadratic:'Quadratic',root:'Square root',inverse:'Inverse','inverse-square':'Inverse square',decay:'Exponential decay','decay-offset':'Exponential approach to non-zero limit',plateau:'Approaches a plateau',growth:'Exponential growth',sigmoid:'Sigmoid',peak:'Peak / optimum',sine:'Periodic',piecewise:'Piecewise linear'})[context.family];const pool=['Directly proportional','Linear with intercept','Linear with negative gradient','Quadratic','Square root','Shifted inverse','Shifted inverse square','Exponential decay','Exponential approach to non-zero limit','Approaches a plateau','Exponential growth','Sigmoid','Peak / optimum','Periodic','Piecewise linear'];options=[expected,...pool.filter(x=>x!==expected).sort(()=>random()-.5).slice(0,3)];prompt='Which mathematical pattern best describes the graph?';working=expected+'. '+context.interpretation;}
    else if(skill==='half-life'&&context.family==='decay'){expected=maxX/2*Math.log(2);prompt='Estimate the half-life: the time for the initial y-value to halve.';unit=context.x.match(/\((.+)\)/)?.[1]||'x-unit';marks=[{x:0,y:fn(0)},{x:expected,y:fn(0)/2}];working=`Read the initial value ${round(fn(0))}; half is ${round(fn(0)/2)}. The corresponding time is ${round(expected)} ${unit}. Half-life is this time interval.`;}
    else {skill='reading';expected=round(fn(t));marks=[{x:t,y:expected}];prompt=`Read the y value at x = ${t}.`;unit=context.y.match(/\((.+)\)/)?.[1]||'y-unit';working=`Start at x = ${t}, go to the graph, then across to the y axis: ${expected} ${unit}. Interpolation is within the displayed data; it does not justify extrapolation.`;}
    const axisUnit=label=>label.match(/\((.+)\)/)?.[1]||'dimensionless';
    if(unit==='y-unit/x-unit')unit=`(${axisUnit(context.y)}) / (${axisUnit(context.x)})`;
    if(unit==='y-unit × x-unit')unit=`(${axisUnit(context.y)}) × (${axisUnit(context.x)})`;
    if(options)options=options.map(value=>({value,rank:random()})).sort((a,b)=>a.rank-b.rank).map(x=>x.value);
    const tolerance=typeof expected==='number'?Math.max(Math.abs(expected)*.005,1e-8):0;
    return {id:`${id}:${seed}:${skill}`,context,seed,skill,points,marks,tangent,fn,derivative,xMin:minX,xMax:context.family==='bar'?6:maxX,yMin:ymin,yMax:ymax,prompt,expected,unit,options,working,tolerance};
  }
  function grade(q,value){if(q.options)return q.options.includes(value)?value===q.expected:null;const t=String(value).trim().replace(/−/g,'-');if(!/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(t)||!Number.isFinite(Number(t)))return null;return Math.abs(Number(t)-q.expected)<=q.tolerance;}
  return {contexts,build,grade,rng};
});
