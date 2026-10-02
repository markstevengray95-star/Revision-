type LedgerRow = {
  schemePoint: string;
  awarded: boolean;
  studentEvidence: string;
  reason: string;
  confidence: number;
  markValue: number;
  markType: 'B' | 'C' | 'A' | 'L' | 'U';
};

const STOP = new Set([
  'the','and','with','from','that','this','uses','use','using','correct','value','answer','mark','then',
  'therefore','into','when','where','gives','give','states','state','calculate','calculation','method',
  'student','must','accept','allow','one','for','of','to','a','an','is','are','be','or','by','in','on',
]);

const SYMBOLS: Record<string,string> = {
  'λ':'lambda','ρ':'rho','σ':'sigma','ε':'epsilon','φ':'phi','Φ':'phi','θ':'theta','ω':'omega',
  'Δ':'delta','δ':'delta','η':'eta','μ':'u','Ω':'ohm','π':'pi','×':'x','÷':'/',
};

const SUPERSCRIPT: Record<string,string> = {
  '⁰':'0','¹':'1','²':'2','³':'3','⁴':'4','⁵':'5','⁶':'6','⁷':'7','⁸':'8','⁹':'9','⁻':'-','⁺':'+',
};

const FORMULA_FAMILIES = [
  ['q=it','i=q/t','t=q/i'],
  ['v=ir','i=v/r','r=v/i'],
  ['p=vi','v=p/i','i=p/v'],
  ['p=i^2r','i=sqrt(p/r)','r=p/i^2'],
  ['p=v^2/r','r=v^2/p'],
  ['w=fs','f=w/s','s=w/f'],
  ['ek=0.5mv^2','v=sqrt(2ek/m)'],
  ['ep=mgh','h=ep/(mg)'],
  ['f=ma','a=f/m','m=f/a'],
  ['p=mv','v=p/m'],
  ['f=deltap/deltat','deltap=f*deltat'],
  ['v=u+at','a=(v-u)/t'],
  ['s=ut+0.5at^2'],
  ['v^2=u^2+2as'],
  ['rho=m/v','m=rho*v'],
  ['sigma=f/a','f=sigma*a'],
  ['epsilon=deltal/l','deltal=epsilon*l'],
  ['e=sigma/epsilon'],
  ['v=f*lambda','lambda=v/f','f=v/lambda'],
  ['w=lambda*d/s','lambda=w*s/d'],
  ['e=hf','f=e/h'],
  ['e=hc/lambda','lambda=hc/e'],
  ['lambda=h/p','p=h/lambda'],
  ['r=rho*l/a','rho=r*a/l'],
  ['epsilon=v+ir','v=epsilon-ir'],
  ['q=cv','c=q/v','v=q/c'],
  ['e=0.5*q*v','e=0.5*c*v^2','e=q^2/(2c)'],
  ['tau=rc'],
  ['q=q0e^(-t/rc)'],
  ['v=v0e^(-t/rc)'],
  ['q=mc*deltatheta'],
  ['q=ml'],
  ['pv=nrt'],
  ['pv=nkt'],
  ['f=gm*m/r^2'],
  ['g=gm/r^2'],
  ['f=k*q*q/r^2'],
  ['e=f/q'],
  ['f=bil*sintheta'],
  ['f=bqv*sintheta'],
  ['phi=ba*costheta'],
  ['epsilon=n*deltaphi/deltat'],
  ['n=n0e^(-lambda*t)'],
  ['a=lambda*n'],
  ['t1/2=ln2/lambda'],
  ['e=mc^2'],
];

const UNIT_FAMILIES: Array<{name:string; patterns:RegExp[]}> = [
  { name:'%', patterns:[/%/] },
  { name:'m s^-2', patterns:[/m\s*s\^?-?2/i,/m\/s\^?2/i,/m\s?s[-−]2/i] },
  { name:'m s^-1', patterns:[/m\s*s\^?-?1/i,/m\/s\b/i,/m\s?s[-−]1/i] },
  { name:'N C^-1', patterns:[/n\s*c\^?-?1/i,/n\/c\b/i] },
  { name:'V m^-1', patterns:[/v\s*m\^?-?1/i,/v\/m\b/i] },
  { name:'kg m s^-1', patterns:[/kg\s*m\s*s\^?-?1/i] },
  { name:'J kg^-1 K^-1', patterns:[/j\s*kg\^?-?1\s*k\^?-?1/i] },
  { name:'Ω m', patterns:[/(?:ohm|ω|Ω)\s*m\b/i] },
  { name:'Pa', patterns:[/\bpa\b/i] },
  { name:'Hz', patterns:[/\bhz\b/i] },
  { name:'W', patterns:[/\bW\b/,/\bwatts?\b/i] },
  { name:'J', patterns:[/\bJ\b/,/\bjoules?\b/i] },
  { name:'V', patterns:[/\bV\b/,/\bvolts?\b/i] },
  { name:'A', patterns:[/\bA\b/,/\bamperes?\b/i] },
  { name:'C', patterns:[/\bC\b/,/\bcoulombs?\b/i] },
  { name:'N', patterns:[/\bN\b/,/\bnewtons?\b/i] },
  { name:'F', patterns:[/\bF\b/,/\bfarads?\b/i] },
  { name:'T', patterns:[/\bT\b/,/\bteslas?\b/i] },
  { name:'Ω', patterns:[/\bohm\b/i,/Ω/,/ω/] },
  { name:'kg', patterns:[/\bkg\b/i] },
  { name:'s', patterns:[/(?:^|\s)s(?:\s|\.|$)/] },
  { name:'m', patterns:[/(?:^|\s)m(?:\s|\.|$)/] },
];

function convertScientificUnicode(text:string) {
  const exp = (chars:string) => chars.split('').map(char => SUPERSCRIPT[char] ?? char).join('');
  return text.replace(/(\d+(?:\.\d+)?)\s*[×x]\s*10([⁰¹²³⁴⁵⁶⁷⁸⁹⁻⁺]+)/g, (_m, base, power) => `${base}e${exp(power)}`);
}

function normalise(text:string) {
  let value = convertScientificUnicode(String(text || ''));
  for (const [symbol, replacement] of Object.entries(SYMBOLS)) value = value.split(symbol).join(replacement);
  value = value
    .toLowerCase()
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, char => `^${SUPERSCRIPT[char]}`)
    .replace(/⁻/g,'-')
    .replace(/potential difference/g,'voltage')
    .replace(/electromotive force/g,'emf')
    .replace(/rate of change/g,'ratechange')
    .replace(/directly proportional/g,'proportional')
    .replace(/proportional to/g,'proportional')
    .replace(/increases?|rises?|rising/g,'increase')
    .replace(/decreases?|reduces?|falls?|falling/g,'decrease')
    .replace(/greater|higher|larger/g,'higher')
    .replace(/smaller|lower|less/g,'lower')
    .replace(/flow(?:ing|s)? into|entering|enters/g,'enter')
    .replace(/flow(?:ing|s)? out(?: of)?|leaving|leaves/g,'leave')
    .replace(/stays? the same|remains? the same|unchanged/g,'same')
    .replace(/electrons?/g,'electron')
    .replace(/photons?/g,'photon')
    .replace(/metres? per second squared/g,'m s^-2')
    .replace(/metres? per second/g,'m s^-1')
    .replace(/\s+/g,' ')
    .trim();
  return value;
}

function compact(text:string) {
  return normalise(text)
    .replace(/\b(uses?|using|where|therefore|hence|so|gives?)\b/g,'')
    .replace(/\s+/g,'')
    .replace(/·/g,'*')
    .replace(/\*+/g,'*');
}

function stripLabel(point:string) {
  return point.replace(/^\s*\[[^\]]+\]\s*/, '').trim();
}

function markMeta(point:string) {
  const label = point.match(/^\s*\[([^\]]+)\]/)?.[1] || '';
  const first = label.charAt(0).toUpperCase();
  const markType: LedgerRow['markType'] = first === 'B' || first === 'C' || first === 'A' || first === 'L' ? first : 'U';
  const valueMatch = label.match(/^[BCA](\d+)/i);
  return { markType, markValue: valueMatch ? Math.max(1, Number(valueMatch[1])) : 1, label };
}

function parseNumbers(text:string) {
  const prepared = convertScientificUnicode(String(text || ''))
    .replace(/(\d+(?:\.\d+)?)\s*[×x]\s*10\s*\^?\s*([-+]?\d+)/gi,'$1e$2')
    .replace(/,/g,'');
  return (prepared.match(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi) || [])
    .map(Number)
    .filter(Number.isFinite);
}

function numericMatch(expected:number, actual:number) {
  const tolerance = Math.max(Math.abs(expected) * 0.025, Math.abs(expected) < 1 ? 0.0005 : 0.01);
  return Math.abs(actual - expected) <= tolerance;
}

function meaningfulTokens(text:string) {
  return (normalise(text).match(/[a-z][a-z0-9^-]{2,}|\d+(?:\.\d+)?/g) || [])
    .map(token => token.endsWith('ing') && token.length > 6 ? token.slice(0,-3) : token)
    .map(token => token.endsWith('ed') && token.length > 5 ? token.slice(0,-2) : token)
    .map(token => token.endsWith('s') && token.length > 4 ? token.slice(0,-1) : token)
    .filter(token => !STOP.has(token));
}

function formulaFamilyMatch(schemeText:string, answerText:string) {
  const s = compact(schemeText);
  const a = compact(answerText);
  for (const family of FORMULA_FAMILIES) {
    const schemeHas = family.some(formula => s.includes(formula));
    if (schemeHas && family.some(formula => a.includes(formula))) return family.find(formula => a.includes(formula)) || family[0];
  }
  const directEquation = s.match(/[a-z][a-z0-9]*=[a-z0-9()+\-*/^.]+/g) || [];
  return directEquation.find(eq => a.includes(eq)) || '';
}

function expectedUnit(point:string) {
  const cleaned = stripLabel(point);
  return UNIT_FAMILIES.find(unit => unit.patterns.some(pattern => pattern.test(cleaned)))?.name || '';
}

function unitPresent(text:string, expected:string) {
  if (!expected) return true;
  const family = UNIT_FAMILIES.find(unit => unit.name === expected);
  return Boolean(family?.patterns.some(pattern => pattern.test(text)));
}

function contradictionFor(point:string, answer:string) {
  const s = normalise(point);
  const a = normalise(answer);
  const opposites = [
    ['increase','decrease'],['higher','lower'],['gain','lose'],['enter','leave'],
    ['attract','repel'],['parallel','perpendicular'],['same','different'],
  ];
  for (const [left,right] of opposites) {
    if (s.includes(left) && !s.includes(right) && a.includes(right) && !a.includes(left)) return `Expected ${left}, but the answer states ${right}.`;
    if (s.includes(right) && !s.includes(left) && a.includes(left) && !a.includes(right)) return `Expected ${right}, but the answer states ${left}.`;
  }
  return '';
}

function requiredSignificantFigures(point:string) {
  const match = point.match(/\b(\d+)\s*(?:s\.?f\.?|significant\s+figures?)\b/i);
  return match ? Number(match[1]) : 0;
}

function numericTokens(text:string) {
  const prepared = convertScientificUnicode(String(text || ''))
    .replace(/(\d+(?:\.\d+)?)\s*[×x]\s*10\s*\^?\s*([-+]?\d+)/gi,'$1e$2')
    .replace(/,/g,'');
  return [...prepared.matchAll(/[-+]?\d*\.?\d+(?:e[-+]?\d+)?/gi)].map(match => ({
    raw: match[0],
    value: Number(match[0]),
  })).filter(item => Number.isFinite(item.value));
}

function significantFigures(raw:string) {
  const mantissa = raw.toLowerCase().split('e')[0].replace(/^[-+]/,'');
  const digits = mantissa.replace('.','').replace(/^0+/,'');
  return digits.length || 1;
}

function hasCausalLink(text:string) {
  return /\b(because|therefore|hence|so that|due to|causes?|leads? to|results? in|which means)\b/i.test(text);
}

function evidenceExcerpt(original:string, needles:string[]) {
  const lower = original.toLowerCase();
  const needle = needles.find(item => item && lower.includes(item.toLowerCase()));
  if (!needle) return '';
  const index = lower.indexOf(needle.toLowerCase());
  const start = Math.max(0, index - 45);
  const end = Math.min(original.length, index + needle.length + 70);
  return original.slice(start, end).trim();
}

function assessPoint(point:string, originalAnswer:string): LedgerRow {
  const answer = normalise(originalAnswer);
  const cleanPoint = stripLabel(point);
  const meta = markMeta(point);
  const pointTokens = meaningfulTokens(cleanPoint).slice(0,10);
  const answerTokens = new Set(meaningfulTokens(answer));
  const hits = pointTokens.filter(token => answerTokens.has(token));
  const ratio = pointTokens.length ? hits.length / pointTokens.length : 0;
  const equation = formulaFamilyMatch(cleanPoint, answer);
  const expectedNumbers = parseNumbers(cleanPoint);
  const answerNumbers = parseNumbers(originalAnswer);
  const numeric = expectedNumbers.find(value => answerNumbers.some(actual => numericMatch(value, actual)));
  const matchedNumericToken = numeric === undefined
    ? undefined
    : numericTokens(originalAnswer).find(token => numericMatch(numeric, token.value));
  const sigFigsRequired = requiredSignificantFigures(cleanPoint);
  const sigFigsOk = !sigFigsRequired || Boolean(matchedNumericToken && significantFigures(matchedNumericToken.raw) === sigFigsRequired);
  const unit = expectedUnit(point);
  const hasUnit = unitPresent(originalAnswer, unit);
  const contradiction = contradictionFor(cleanPoint, answer);
  const hasWorking = /[=+\-*/×÷]/.test(originalAnswer) && answerNumbers.length > 1;
  const substitutionCue = /substitut|si unit|convert/i.test(cleanPoint);
  const exactPhrase = cleanPoint.length >= 5 && answer.includes(normalise(cleanPoint));
  const causalRequired = hasCausalLink(cleanPoint);
  const causalPresent = hasCausalLink(originalAnswer);
  let awarded = false;
  let confidence = 45;
  let reason = '';
  let evidence = '';

  if (contradiction) {
    awarded = false;
    confidence = 88;
    reason = contradiction;
  } else if (meta.markType === 'A' && expectedNumbers.length) {
    awarded = numeric !== undefined && hasUnit && sigFigsOk;
    confidence = numeric !== undefined ? (hasUnit && sigFigsOk ? 96 : 86) : 90;
    reason = awarded
      ? `Expected numerical result matched within tolerance${unit ? ` with ${unit}` : ''}${sigFigsRequired ? ` to ${sigFigsRequired} significant figures` : ''}.`
      : numeric !== undefined && !hasUnit
        ? `Numerical result matches, but the required unit ${unit} is missing or incorrect.`
        : numeric !== undefined && !sigFigsOk
          ? `Numerical result matches, but it is not given to the required ${sigFigsRequired} significant figures.`
          : 'Expected final numerical result was not found within tolerance.';
    evidence = numeric !== undefined ? evidenceExcerpt(originalAnswer,[String(numeric)]) || `Numerical value ${numeric}` : '';
  } else if (meta.markType === 'C') {
    awarded = Boolean(equation) || (substitutionCue ? hasWorking && ratio >= 0.2 : ratio >= 0.5);
    confidence = equation ? 95 : awarded ? 78 : 82;
    reason = equation
      ? `Valid equation/rearrangement detected: ${equation}.`
      : awarded
        ? 'Relevant method/substitution evidence is present.'
        : 'Required method, equation or substitution evidence was not found.';
    evidence = equation || evidenceExcerpt(originalAnswer,hits);
  } else if (meta.markType === 'L') {
    awarded = ratio >= 0.45;
    confidence = 55;
    reason = awarded ? 'Some evidence matches this level descriptor.' : 'Insufficient evidence for this level descriptor.';
    evidence = evidenceExcerpt(originalAnswer,hits);
  } else {
    const minimumHits = pointTokens.length <= 2 ? pointTokens.length : Math.max(2, Math.ceil(pointTokens.length * 0.55));
    const conceptPresent = exactPhrase || hits.length >= minimumHits;
    awarded = conceptPresent && (!causalRequired || causalPresent);
    confidence = exactPhrase && awarded ? 94 : awarded ? Math.min(90, 65 + Math.round(ratio * 25)) : Math.min(88, 62 + Math.round((1-ratio) * 20));
    reason = awarded
      ? 'The answer contains the required physics idea or a close equivalent.'
      : conceptPresent && causalRequired && !causalPresent
        ? 'The relevant ideas are present, but the causal link required by the marking point is not stated.'
        : 'The complete required physics relationship/idea is not explicit.';
    evidence = evidenceExcerpt(originalAnswer,hits);
  }

  return {
    schemePoint: point,
    awarded,
    studentEvidence: evidence || (awarded && hits.length ? `Matched concepts: ${hits.join(', ')}` : ''),
    reason,
    confidence,
    markValue: meta.markValue,
    markType: meta.markType,
  };
}

function applyCalculationDependencies(rows:LedgerRow[], body:any, originalAnswer:string) {
  const copy = rows.map(row => ({...row}));
  const tokens = numericTokens(originalAnswer);

  for (let index = 0; index < copy.length; index += 1) {
    const point = copy[index].schemePoint;
    const previousAwarded = copy.slice(0,index).some(row => row.awarded);
    const explicitDependency = /\b(dep(?:endent)?(?:\s+on)?|must follow|from previous|using previous)\b/i.test(point);
    if (copy[index].markType === 'A' && copy[index].awarded && explicitDependency && !previousAwarded) {
      copy[index].awarded = false;
      copy[index].reason = 'This accuracy mark is explicitly dependent on earlier working that was not credited.';
      copy[index].confidence = 90;
    }

    const allowsFollowThrough = /\b(ecf|follow[- ]?through|ft|their value|their answer)\b/i.test(point);
    const priorMethod = copy.slice(0,index).some(row => row.markType === 'C' && row.awarded);
    const unit = expectedUnit(point);
    if (copy[index].markType === 'A' && !copy[index].awarded && allowsFollowThrough && priorMethod && tokens.length && unitPresent(originalAnswer,unit)) {
      copy[index].awarded = true;
      copy[index].studentEvidence = copy[index].studentEvidence || 'Consistent follow-through from credited method.';
      copy[index].reason = 'Follow-through/error-carried-forward credit awarded from a valid earlier method.';
      copy[index].confidence = 72;
    }
  }

  if (/\b(show|prove|derive)\b/i.test(String(body?.questionPrompt || ''))) return copy;
  const answerNumbers = parseNumbers(originalAnswer);
  if (!answerNumbers.length) return copy;

  for (let index = 0; index < copy.length; index += 1) {
    if (copy[index].markType !== 'A' || !copy[index].awarded) continue;
    for (let previous = index - 1; previous >= 0 && copy[previous].markType === 'C'; previous -= 1) {
      if (!copy[previous].awarded) {
        copy[previous].awarded = true;
        copy[previous].studentEvidence = copy[index].studentEvidence || 'Correct final result.';
        copy[previous].reason = 'Correct final result provides implicit evidence of the preceding calculation method.';
        copy[previous].confidence = Math.min(copy[index].confidence, 84);
      }
    }
  }
  return copy;
}

function overallContradictions(answer:string) {
  const a = normalise(answer);
  const pairs = [['increase','decrease'],['higher','lower'],['attract','repel']];
  return pairs
    .filter(([left,right]) => a.includes(left) && a.includes(right))
    .map(([left,right]) => `Check whether the response contradicts itself: both "${left}" and "${right}" are used.`);
}

function levelOfResponse(body:any, answer:string, maxMarks:number) {
  const required = Array.isArray(body?.requiredKeywords) ? body.requiredKeywords.map(String) : [];
  const modelTokens = meaningfulTokens(String(body?.modelAnswer || '')).slice(0,30);
  const answerNorm = normalise(answer);
  const keywordHits = required.filter((keyword:string) => {
    const n = normalise(keyword);
    const tokens = meaningfulTokens(n);
    return answerNorm.includes(n) || (tokens.length > 0 && tokens.every(token => answerNorm.includes(token)));
  });
  const tokenSet = new Set(meaningfulTokens(answerNorm));
  const modelHits = modelTokens.filter(token => tokenSet.has(token));
  const keywordCoverage = required.length ? keywordHits.length / required.length : 0;
  const modelCoverage = modelTokens.length ? modelHits.length / modelTokens.length : 0;
  const coverage = required.length ? keywordCoverage * 0.7 + modelCoverage * 0.3 : modelCoverage;
  const links = (answerNorm.match(/\b(because|therefore|so|hence|caus|leads? to|results? in|which means)\b/g) || []).length;
  const wordCount = answerNorm.split(/\s+/).filter(Boolean).length;
  let marks = 0;
  let level = 0;
  if (coverage >= 0.72 && links >= 2 && wordCount >= 45) { level = 3; marks = coverage >= 0.88 ? maxMarks : Math.max(1,maxMarks-1); }
  else if (coverage >= 0.42 && links >= 1 && wordCount >= 25) { level = 2; marks = Math.max(3,Math.round(maxMarks * 0.6)); }
  else if (coverage >= 0.18 || keywordHits.length >= 1) { level = 1; marks = Math.max(1,Math.round(maxMarks * 0.3)); }
  return { marks: Math.min(maxMarks,marks), level, coverage, keywordHits, links, wordCount };
}

export function offlineMark(body:any) {
  const originalAnswer = String(body?.studentAnswer || '');
  const maxMarks = Math.max(0,Math.trunc(Number(body?.maxMarks) || 0));
  const scheme:string[] = Array.isArray(body?.markScheme) ? body.markScheme.map(String) : body?.markScheme ? [String(body.markScheme)] : [];
  const isLor = scheme.some(point => /^\s*\[L\d/i.test(point)) || /extended 6-mark|level-of-response/i.test(String(body?.questionType || ''));
  const isCalculation = /calculate|determine|find|show/i.test(String(body?.commandWord || '')) || scheme.some(point => /^\s*\[[CA]\d+/i.test(point));

  let rows = scheme.map(point => assessPoint(point,originalAnswer));
  if (isCalculation && !isLor) rows = applyCalculationDependencies(rows,body,originalAnswer);

  let marksAwarded:number;
  let lor: ReturnType<typeof levelOfResponse> | undefined;
  if (isLor) {
    const lorResult = levelOfResponse(body,originalAnswer,maxMarks);
    lor = lorResult;
    marksAwarded = lorResult.marks;
    rows = rows.map(row => ({
      ...row,
      awarded: row.markType === 'L'
        ? (lorResult.level === 3 ? /^\s*\[L3/i.test(row.schemePoint) : lorResult.level === 2 ? /^\s*\[L2/i.test(row.schemePoint) : lorResult.level === 1 ? /^\s*\[L1/i.test(row.schemePoint) : false)
        : row.awarded,
    }));
  } else {
    marksAwarded = Math.min(maxMarks,rows.reduce((sum,row) => sum + (row.awarded ? row.markValue : 0),0));
  }

  const audit:{issue:string;suggestion:string}[] = [];
  if (isCalculation) {
    if (!/[=]/.test(originalAnswer)) audit.push({issue:'No explicit equation/equality detected.',suggestion:'Show the physics equation and substitution so method marks are secure.'});
    if (!parseNumbers(originalAnswer).length) audit.push({issue:'No numerical working detected.',suggestion:'Show substitution and a final numerical answer.'});
  }

  const contradictions = overallContradictions(originalAnswer);
  const pointConfidence = rows.length ? rows.reduce((sum,row) => sum + row.confidence,0) / rows.length : 35;
  let confidence = Math.round(pointConfidence);
  if (!scheme.length) confidence = Math.min(confidence,40);
  if (isLor) confidence = Math.min(confidence,62);
  if (body?.studentInlineData && !originalAnswer.trim()) confidence = Math.min(confidence,25);
  if (contradictions.length) confidence = Math.min(confidence,60);

  const credited = rows.filter(row => row.awarded);
  const denied = rows.filter(row => !row.awarded);
  const presentKeywords = [...new Set(credited.flatMap(row => meaningfulTokens(stripLabel(row.schemePoint))).slice(0,20))];
  const missingKeywords = [...new Set(denied.flatMap(row => meaningfulTokens(stripLabel(row.schemePoint))).slice(0,20))];

  return {
    marksAwarded,
    totalMarks:maxMarks,
    commandWordCheck:{
      commandWord:String(body?.commandWord || 'None'),
      satisfied:marksAwarded > 0 && (maxMarks === 0 || marksAwarded / maxMarks >= 0.4),
      examinerNotes:isLor
        ? 'Offline level-of-response estimate uses concept coverage and linked reasoning; teacher/online review remains recommended.'
        : 'Offline marking uses mark-type-specific evidence, equation equivalence, numerical tolerance and unit checks.',
    },
    keywordAnalysis:{presentKeywords,missingKeywords,laymanTermsUsed:[]},
    markingLedger:rows.map(({confidence: _confidence,markValue: _markValue,markType: _markType,...row}) => row),
    creditedPoints:credited.map(row => ({mark:row.schemePoint,studentEvidence:row.studentEvidence})),
    lostMarksAnalysis:denied.slice(0,Math.max(0,maxMarks-marksAwarded)).map(row => ({
      reason:row.reason || `No credit for: ${stripLabel(row.schemePoint)}`,
      improvementSuggestion:`Add clear evidence that satisfies: ${stripLabel(row.schemePoint)}`,
    })),
    lorRubric:isLor ? {
      levelAwarded:lor?.level || 0,
      levelDescription:`Offline estimate: Level ${lor?.level || 0}`,
      justification:`Concept coverage ${Math.round((lor?.coverage || 0)*100)}%; linked reasoning cues ${lor?.links || 0}. Extended responses remain review-recommended offline.`,
    } : undefined,
    sigFigUnitAudit:audit,
    misconceptions:contradictions,
    inDepthAnalysis:{
      physicsPrinciples:'Each supplied mark-scheme point is checked according to its mark type rather than by keyword count alone.',
      stepByStepReasoning:isCalculation
        ? 'The offline examiner distinguishes equation/method evidence, numerical accuracy and units, and can recognise common equivalent rearrangements.'
        : 'Concept marks require the complete physics idea or a close equivalent, with explicit contradiction checks.',
      structureAndClarity:'Marks are based on physics evidence, not writing length or style. Ambiguous extended responses are deliberately flagged for review.',
    },
    officialMarkScheme:scheme,
    modelAnswer:String(body?.modelAnswer || ''),
    examinerConfidence:Math.max(20,Math.min(96,confidence)),
    confidenceReason:isLor
      ? 'Extended responses require holistic judgement, so offline confidence is intentionally capped.'
      : confidence >= 80
        ? 'Mark-scheme evidence is clear and mostly objective.'
        : confidence >= 65
          ? 'Most evidence is clear, but one or more points depend on interpretation.'
          : 'Evidence is incomplete, ambiguous, image-only, or not well suited to deterministic offline marking.',
    reviewRecommended:isLor || confidence < 70 || Boolean(body?.studentInlineData && !originalAnswer.trim()) || contradictions.length > 0,
    offlineDiagnostics:{
      engineVersion:2,
      calculation:isCalculation,
      levelOfResponse:isLor,
      pointConfidences:rows.map(row => row.confidence),
      pointTypes:rows.map(row => row.markType),
      objectivePositivePoints:rows
        .map((row,index) => row.awarded && (row.markType === 'A' || row.markType === 'C') && row.confidence >= 92 ? index : -1)
        .filter(index => index >= 0),
    },
  };
}

