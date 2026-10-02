/* Shared, deterministic calculation engine for practice and teacher question sets. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.RevisionEquations = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const units = {
    m: [['cm', .01], ['mm', .001], ['km', 1000]], s: [['ms', .001], ['min', 60]],
    kg: [['g', .001]], g: [['mg', .001], ['kg', 1000]], mm: [['μm', .001], ['cm', 10]],
    'm²': [['cm²', .0001]], 'm³': [['cm³', .000001], ['dm³', .001]],
    'dm³': [['cm³', .001]], J: [['kJ', 1000]], W: [['kW', 1000]],
    A: [['mA', .001]], C: [['mC', .001]], F: [['μF', .000001]],
    Hz: [['kHz', 1000]], Pa: [['kPa', 1000]], N: [['kN', 1000]]
  };
  const variable = (symbol, name, unit, low, high, power = 1) => ({symbol, name, unit, low, high, power});
  const definitions = [];
  function expression(d,target,values) {
    const token=x=>values?`(${format(values[x.symbol])})`:x.symbol;
    const term=x=>token(x)+(Math.abs(x.power)===2?'²':'');
    const positives=d.inputs.filter(x=>x.power>0&&x.symbol!==target),negatives=d.inputs.filter(x=>x.power<0&&x.symbol!==target);
    const unknown=d.inputs.find(x=>x.symbol===target);
    const coefficient=values?format(d.coefficient):/^[gRh] \(/.test(d.constant)?d.constant[0]:d.coefficient===.5?'½':format(d.coefficient);
    let numerator,denominator;
    if(!unknown){numerator=[...(d.coefficient!==1?[coefficient]:[]),...positives.map(term)];denominator=negatives.map(term);}
    else if(unknown.power>0){numerator=[...(d.coefficient===.5?['2']:[]),token(d.result),...negatives.map(term)];denominator=[...(d.coefficient!==1&&d.coefficient!==.5?[coefficient]:[]),...positives.map(term)];}
    else {numerator=[...(d.coefficient!==1?[coefficient]:[]),...positives.map(term)];denominator=[token(d.result),...negatives.map(term)];}
    const top=numerator.join(' × ')||'1',bottom=denominator.join(' × '),ratio=bottom?`${numerator.length>1?'('+top+')':top} / ${denominator.length>1?'('+bottom+')':bottom}`:top;
    return unknown&&Math.abs(unknown.power)===2?`√(${ratio})`:ratio;
  }
  function add(id, subject, levels, topic, name, formula, result, inputs, coefficient = 1, note = '', constant = '') {
    const powers = inputs.map(v => v.power);
    const d={id,subject,levels,topic,name,formula,result,inputs,powers,coefficient,note,constant};
    const forms = {[result.symbol]: formula};
    inputs.forEach(v=>forms[v.symbol]=`${v.symbol} = ${expression(d,v.symbol)}`);
    definitions.push({...d,forms});
  }
  const v = variable;
  const both = ['gcse', 'alevel'], advanced = ['alevel'];
  add('speed','physics',both,'p5','Speed','v = d / t',v('v','speed','m/s'),[v('d','distance','m',12,750),v('t','time','s',2,90, -1)],1,'Use total distance and time for average speed.');
  add('force','physics',both,'p5','Newton’s second law','F = m × a',v('F','resultant force','N'),[v('m','mass','kg',.3,80),v('a','acceleration','m/s²',.2,12)]);
  add('weight','physics',both,'p5','Weight','W = m × g',v('W','weight','N'),[v('m','mass','kg',.1,90)],9.8,'Weight is a force. Mass is measured in kg.','g (9.8 N/kg)');
  add('density','physics',both,'p3','Density','ρ = m / V',v('ρ','density','kg/m³'),[v('m','mass','kg',.2,12),v('V','volume','m³',.0002,.01,-1)]);
  add('work','physics',both,'p1','Work done','E = F × d',v('E','work done','J'),[v('F','force','N',5,600),v('d','distance in the force direction','m',.2,30)]);
  add('kinetic','physics',both,'p1','Kinetic energy','E = ½ × m × v²',v('E','kinetic energy','J'),[v('m','mass','kg',.2,60),v('v','speed','m/s',1,35,2)],.5,'Square the speed before multiplying.','½');
  add('potential','physics',both,'p1','Gravitational potential energy','E = m × g × h',v('E','change in gravitational potential energy','J'),[v('m','mass','kg',.2,30),v('h','vertical height change','m',.3,40)],9.8,'Use the change in vertical height. Assume g = 9.8 N/kg.','g (9.8 N/kg)');
  add('elastic','physics',both,'p1','Elastic potential energy','E = ½ × k × x²',v('E','elastic energy','J'),[v('k','spring constant','N/m',20,600),v('x','extension','m',.01,.3,2)],.5,'Only valid within the limit of proportionality. Extension must be in metres.','½');
  add('hooke','physics',both,'p5','Hooke’s law','F = k × x',v('F','spring force','N'),[v('k','spring constant','N/m',20,800),v('x','extension','m',.01,.25)],1,'Only valid within the limit of proportionality.');
  add('power','physics',both,'p1','Power','P = E / t',v('P','power','W'),[v('E','energy transferred','J',50,20000),v('t','time','s',2,200,-1)]);
  add('efficiency','physics',both,'p1','Efficiency','η = 100 × U / I',v('η','efficiency','%'),[v('U','useful energy output','J',10,90),v('I','total energy input','J',100,200,-1)],100,'Efficiency cannot exceed 100%. Both energies must use the same units.','100');
  add('charge','physics',both,'p2','Charge flow','Q = I × t',v('Q','charge','C'),[v('I','current','A',.05,8),v('t','time','s',5,300)]);
  add('resistance','physics',both,'p2','Potential difference','V = I × R',v('V','potential difference','V'),[v('I','current','A',.05,3),v('R','resistance','Ω',2,80)]);
  add('electrical-power','physics',both,'p2','Electrical power','P = V × I',v('P','power','W'),[v('V','potential difference','V',2,240),v('I','current','A',.02,5)]);
  add('resistor-power','physics',both,'p2','Resistor power','P = I² × R',v('P','power','W'),[v('I','current','A',.05,4,2),v('R','resistance','Ω',2,100)]);
  add('electrical-energy','physics',both,'p2','Electrical energy','E = Q × V',v('E','energy','J'),[v('Q','charge','C',.1,120),v('V','potential difference','V',2,230)]);
  add('wave','physics',both,'p6','Wave speed','v = f × λ',v('v','wave speed','m/s'),[v('f','frequency','Hz',20,3000),v('λ','wavelength','m',.02,4)]);
  add('period','physics',both,'p6','Period and frequency','T = 1 / f',v('T','period','s'),[v('f','frequency','Hz',2,800,-1)]);
  add('pressure','physics',both,'p5','Pressure','p = F / A',v('p','pressure','Pa'),[v('F','normal force','N',10,1500),v('A','area','m²',.002,.4,-1)],1,'Force acts perpendicular to the surface. This GCSE calculation is Separate Science.');
  add('thermal','physics',both,'p1','Specific heat capacity','E = m × c × ΔT',v('E','thermal energy change','J'),[v('m','mass','kg',.1,5),v('c','specific heat capacity','J/(kg °C)',200,4200),v('ΔT','temperature change','°C',2,60)],1,'ΔT is the temperature change, not the final temperature.');
  add('latent','physics',both,'p3','Specific latent heat','E = m × L',v('E','energy transferred','J'),[v('m','mass','kg',.01,3),v('L','specific latent heat','J/kg',20000,2300000)],1,'During a change of state the temperature remains constant.');
  add('momentum','physics',both,'p5','Momentum','p = m × v',v('p','momentum','kg m/s'),[v('m','mass','kg',.1,100),v('v','velocity','m/s',.5,35)],1,'Momentum is a vector. This calculation uses magnitudes in one direction; GCSE Separate Science.');
  add('moment','physics',both,'p5','Moment of a force','M = F × d',v('M','moment','N m'),[v('F','force','N',5,400),v('d','perpendicular distance from pivot','m',.05,2)],1,'Use the perpendicular distance. GCSE Separate Science.');
  add('capacitance','physics',advanced,'electricity','Capacitance','Q = C × V',v('Q','charge','C'),[v('C','capacitance','F',.000001,.002),v('V','potential difference','V',2,100)]);
  add('capacitor-energy','physics',advanced,'electricity','Capacitor energy','E = ½ × C × V²',v('E','stored energy','J'),[v('C','capacitance','F',.000001,.001),v('V','potential difference','V',2,100,2)],.5,'Square the potential difference.','½');
  add('photon','physics',advanced,'particles','Photon energy','E = h × f',v('E','photon energy','J'),[v('f','frequency','Hz',1e14,9e14)],6.63e-34,'Use h = 6.63 × 10⁻³⁴ J s. Scientific notation is accepted.','h (6.63 × 10⁻³⁴ J s)');
  add('centripetal','physics',advanced,'further-mechanics','Centripetal force','F = m × v² / r',v('F','centripetal force','N'),[v('m','mass','kg',.1,5),v('v','speed','m/s',1,20,2),v('r','radius','m',.2,5,-1)],1,'Resultant force points towards the centre.');
  add('ideal-gas','chemistry',advanced,'chem-physical','Ideal gas equation','p = n × R × T / V',v('p','pressure','Pa'),[v('n','amount','mol',.01,.5),v('T','absolute temperature','K',273,500),v('V','volume','m³',.001,.03,-1)],8.31,'Temperature must be in kelvin and volume in m³. Assume ideal gas behaviour.','R (8.31 J/(mol K))');
  add('moles','chemistry',both,'c3','Amount of substance','n = m / M',v('n','amount','mol'),[v('m','mass','g',.1,30),v('M','molar mass','g/mol',18,200,-1)],1,'Use mass in grams when molar mass is in g/mol.');
  add('molarity','chemistry',both,'c3','Amount concentration','c = n / V',v('c','concentration','mol/dm³'),[v('n','amount','mol',.005,.5),v('V','solution volume','dm³',.025,2,-1)],1,'Convert cm³ to dm³ by dividing by 1000. GCSE Separate Science.');
  add('mass-concentration','chemistry',both,'c3','Mass concentration','c = m / V',v('c','mass concentration','g/dm³'),[v('m','solute mass','g',.1,20),v('V','solution volume','dm³',.05,2,-1)]);
  add('gas-volume','chemistry',both,'c3','Gas volume at RTP','V = n × 24',v('V','gas volume','dm³'),[v('n','amount','mol',.005,2)],24,'Use 24 dm³/mol at room temperature and pressure. GCSE Separate Science.','24 dm³/mol');
  add('yield','chemistry',both,'c3','Percentage yield','Y = 100 × A / T',v('Y','percentage yield','%'),[v('A','actual mass of product','g',1,9),v('T','theoretical mass of product','g',10,25,-1)],100,'Use the same mass units. Pure, dry actual yield should not exceed theoretical yield. GCSE Separate Science.','100');
  add('atom-economy','chemistry',both,'c3','Atom economy','A = 100 × D / R',v('A','atom economy','%'),[v('D','stoichiometric mass of desired product','g',10,90),v('R','total stoichiometric mass of reactants','g',100,250,-1)],100,'Include balanced-equation coefficients in these masses. GCSE Separate Science.','100');
  add('rate','chemistry',both,'c6','Mean reaction rate','r = V / t',v('r','mean rate','cm³/s'),[v('V','gas produced','cm³',10,250),v('t','time','s',5,200,-1)],1,'Use change in gas volume over the specified time interval.');
  add('calorimetry','chemistry',advanced,'chem-physical','Calorimetry','q = m × c × ΔT',v('q','heat absorbed by solution','J'),[v('m','solution mass','g',25,250),v('c','specific heat capacity','J/(g °C)',4.18,4.18),v('ΔT','temperature rise','°C',2,30)],1,'Assume no heat loss. Reaction heat has the opposite sign; ΔH = −q/n for an exothermic reaction.');
  add('magnification','biology',both,'b1','Microscope magnification','M = I / A',v('M','magnification','×'),[v('I','image size','mm',10,90),v('A','actual size','mm',.01,.3,-1)],1,'Image and actual size must use the same units. 1000 μm = 1 mm. Magnification is dimensionless.');
  add('growth-rate','biology',both,'b2','Mean growth rate','r = L / t',v('r','mean growth rate','mm/s'),[v('L','change in length','mm',1,30),v('t','time interval','s',10,300,-1)]);
  add('population','biology',both,'b7','Quadrat population estimate','N = D × A',v('N','estimated population','organisms'),[v('D','mean population density','organisms/m²',2,80),v('A','habitat area','m²',10,800)],1,'Assume random, representative samples and a reasonably uniform distribution. Estimates need not be whole numbers before rounding.');
  add('transfer','biology',both,'b7','Biomass transfer efficiency','E = 100 × B / A',v('E','transfer efficiency','%'),[v('B','biomass at next trophic level','g',1,9),v('A','biomass at preceding trophic level','g',10,100,-1)],100,'Compare the same area and time interval. GCSE Separate Science.','100');
  add('surface-volume','biology',advanced,'bio-molecules','Cube surface area to volume ratio','R = 6 / l',v('R','surface area to volume ratio','mm⁻¹'),[v('l','cube side length','mm',.5,10,-1)],6,'For a cube, surface area = 6l² and volume = l³. The ratio decreases as size increases.','6');
  add('dilution','biology',advanced,'bio-molecules','Dilution','c₂ = c₁ × V₁ / V₂',v('c₂','final concentration','g/dm³'),[v('c₁','stock concentration','g/dm³',10,100),v('V₁','stock volume used','dm³',.001,.01),v('V₂','final total volume','dm³',.02,.1,-1)],1,'V₂ is the final total volume after adding solvent. Both volumes use the same units.');
  definitions.push({id:'acceleration',subject:'physics',levels:both,topic:'p5',name:'Acceleration',formula:'a = (v − u) / t',result:v('a','acceleration','m/s²'),inputs:[v('u','initial velocity','m/s',1,10),v('v','final velocity','m/s',15,40),v('t','time','s',2,30)],coefficient:1,kind:'acceleration',note:'Use the change in velocity. These questions consider motion along one direction.',forms:{a:'a = (v − u) / t',u:'u = v − a × t',v:'v = u + a × t',t:'t = (v − u) / a'}});
  definitions.push({id:'percentage-change',subject:'biology',levels:both,topic:'b1',name:'Percentage change',formula:'P = 100 × (F − I) / I',result:v('P','percentage change','%'),inputs:[v('F','final sample mass','g',1,40),v('I','initial sample mass','g',3,40)],coefficient:100,kind:'percentage-change',note:'A negative percentage means a decrease. Divide by the initial mass, not the final mass.',constant:'100',forms:{P:'P = 100 × (F − I) / I',F:'F = I × (1 + P / 100)',I:'I = F / (1 + P / 100)'}});
  definitions.push({id:'net-production',subject:'biology',levels:advanced,topic:'bio-energy',name:'Net primary production',formula:'N = G − R',result:v('N','net primary production','kJ/(m² year)'),inputs:[v('G','gross primary production','kJ/(m² year)',50,200),v('R','respiratory losses','kJ/(m² year)',5,40)],coefficient:1,kind:'net-production',note:'Compare energy transfers over the same area and time period.',forms:{N:'N = G − R',G:'G = N + R',R:'R = G − N'}});
  const separate = new Set(['pressure','momentum','moment','molarity','gas-volume','yield','atom-economy','transfer']);
  const physicsTopics = {p1:'mechanics-materials',p2:'electricity',p3:'further-mechanics',p5:'mechanics-materials',p6:'waves'};
  const biologyTopics = {b1:'bio-cells',b2:'bio-exchange',b7:'bio-energy'};
  definitions.forEach(d => {d.scope = separate.has(d.id) ? 'triple' : 'combined'; d.topics = {gcse:d.topic,alevel:d.subject === 'physics' ? physicsTopics[d.topic] || d.topic : d.subject === 'chemistry' ? 'chem-physical' : biologyTopics[d.topic] || d.topic};});
  function rng(seed) {let a = Number(seed) >>> 0; return () => {a += 0x6D2B79F5;let t = a;t = Math.imul(t ^ t >>> 15,t | 1);t ^= t + Math.imul(t ^ t >>> 7,t | 61);return ((t ^ t >>> 14) >>> 0) / 4294967296;};}
  function rounded(n) {return Number(n.toPrecision(3));}
  function format(n) {return Number(n).toPrecision(3).replace(/\.0+(?=e|$)/,'').replace(/(\.\d*?)0+(?=e|$)/,'$1');}
  function parse(value) {const t = String(value ?? '').trim().replace(/−/g,'-');if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(t)) return null;const n=Number(t);return Number.isFinite(n)?n:null;}
  function close(value, expected) {const n = parse(value),tolerance=expected===0?1e-12:0.51*10**(Math.floor(Math.log10(Math.abs(expected)))-2);return n !== null && Math.abs(n-expected) <= tolerance;}
  function normalUnit(unit) {return String(unit).trim().toLowerCase().replace(/micro/g,'μ').replace(/µ/g,'μ').replace(/ohms?/g,'ω').replace(/degrees?\s*c(?:elsius)?/g,'°c').replace(/\^?2/g,'²').replace(/\^?3/g,'³').replace(/\*|·/g,' ').replace(/\s+/g,'');}
  function unitCorrect(input, expected) {const aliases = {'×':['','x','times','dimensionless'], '%':['percent'], 'N m':['nm','n*m'], 'organisms':['organism'], 'mm⁻¹':['1/mm','mm^-1'],'kg m/s':['kgm/s','kgms^-1']};return normalUnit(input)===normalUnit(expected) || (aliases[expected] || []).some(a=>normalUnit(input)===normalUnit(a));}
  function available({level='gcse',subject='physics',pathway='combined',topic='all'}={}) {return definitions.filter(d=>d.levels.includes(level) && (subject==='all'||d.subject===subject) && (level!=='gcse'||pathway==='triple'||d.scope!=='triple') && (topic==='all'||d.topics[level]===topic));}
  function solve(d, target, values) {
    if(d.kind==='acceleration'){const {a,u,v,t}=values;return target==='a'?(v-u)/t:target==='u'?v-a*t:target==='v'?u+a*t:(v-u)/a;}
    if(d.kind==='percentage-change'){const {P,F,I}=values;return target==='P'?100*(F-I)/I:target==='F'?I*(1+P/100):F/(1+P/100);}
    if(d.kind==='net-production'){const {N,G,R}=values;return target==='N'?G-R:target==='G'?N+R:G-N;}
    if(target===d.result.symbol) return d.inputs.reduce((n,v)=>n*Math.pow(values[v.symbol],v.power),d.coefficient);
    const v=d.inputs.find(x=>x.symbol===target);
    const factor=d.inputs.filter(x=>x!==v).reduce((n,x)=>n*Math.pow(values[x.symbol],x.power),d.coefficient);
    return Math.pow(values[d.result.symbol]/factor,1/v.power);
  }
  function build(id,seed=1,demand='standard',targetSymbol) {
    const d = definitions.find(x=>x.id===id);if (!d) throw new Error('Unknown equation.');
    const random=rng(seed), all=[d.result,...d.inputs];
    const target=all.find(x=>x.symbol===targetSymbol) || (demand==='support'?d.result:all[Math.floor(random()*all.length)]);
    const values={};d.inputs.forEach(x=>{values[x.symbol]=rounded(x.low+(x.high-x.low)*random());});
    values[d.result.symbol]=rounded(solve(d,d.result.symbol,values));
    const givens=all.filter(x=>x!==target).map(x=>{
      const alternatives=units[x.unit];
      const alternate=demand==='stretch' && alternatives?.length ? alternatives[Math.floor(random()*alternatives.length)] : null;
      const unit=alternate?alternate[0]:x.unit, scale=alternate?alternate[1]:1;
      const displayed=rounded(values[x.symbol]/scale);
      values[x.symbol]=displayed*scale;
      return {...x,value:displayed,unit,baseUnit:x.unit,scale,baseValue:values[x.symbol]};
    });
    const expected=solve(d,target.symbol,values);
    const conversions=givens.map(x=>`${x.symbol}: ${format(x.value)} ${x.unit}${x.scale!==1?` × ${x.scale} = ${format(x.baseValue)} ${x.baseUnit}`:' (already in the required units)'}`);
    const substitutions=givens.map(x=>`${x.symbol} = ${format(x.baseValue)}`).join(', ');
    const numerical=d.kind?d.forms[target.symbol].split(' = ')[1].replace(/[a-zA-Z]+/g,s=>values[s]===undefined?s:`(${format(values[s])})`):expression(d,target.symbol,values);
    const steps=[`Select and rearrange: ${d.forms[target.symbol]}`, ...conversions, `Substitute ${substitutions}${d.constant?`; constant: ${d.constant}`:''}.`,`${target.symbol} = ${numerical}`, `Calculate ${target.symbol} = ${format(expected)} ${target.unit} (3 significant figures).`];
    return {id:`${id}:${seed}:${demand}:${target.symbol}`,equationId:id,seed,demand,definition:d,target,givens,expected,unit:target.unit,formula:d.forms[target.symbol],prompt:`Calculate the ${target.name} in ${target.unit}. ${givens.map(x=>`${x.name} ${x.symbol} = ${format(x.value)} ${x.unit}`).join('; ')}.${d.constant?` Use ${d.constant}.`:''}`,steps,values};
  }
  function assess(q,answer={}) {return {formula:answer.formula===q.formula, conversions:q.givens.map(x=>close(answer.conversions?.[x.symbol],x.baseValue)),value:close(answer.value,q.expected),unit:unitCorrect(answer.unit,q.unit),working:!!String(answer.working||'').trim()};}
  return {definitions,available,build,solve,rng,format,parse,close,unitCorrect,assess};
});
