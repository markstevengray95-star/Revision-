'use strict';

  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const clamp = (v,min,max) => Math.min(max,Math.max(min,v));
  const fmt = (v,d=3) => Number(v).toFixed(d).replace(/\.0+$|(?<=\.[0-9]*?)0+$/,'');
  const percent = (part, whole) => whole === 0 ? 0 : Math.abs(part/whole)*100;
  const randn = () => {
    let u=0,v=0; while(!u)u=Math.random(); while(!v)v=Math.random();
    return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
  };

  const lessons = [
    {
      id:'si', code:'3.1.1', title:'SI base units and physical quantities', subtitle:'Build the language of measurement first.',
      retrieval:['What SI unit is used for time?','State the SI unit of electric current.','What is meant by a physical quantity?'],
      objectives:['Recall the six base quantities required by AQA in this section.','Match each quantity to its SI base unit.','Recognise when a unit is derived from base units.'],
      vocab:['mass','length','time','amount of substance','temperature','electric current','base unit','derived unit'],
      teach:`A measurement is a numerical value multiplied by a unit. AQA expects confident use of the base units for mass (kg), length (m), time (s), amount of substance (mol), temperature (K) and current (A). Many other units are derived: for example a newton is kg m s⁻² and a joule is kg m² s⁻². The candela is not required in this specification section.`,
      equation:'unitConversion', worked:'A speed of 72 km h⁻¹ is 72 000 m / 3600 s = 20 m s⁻¹.',
      mission:'Switch to the Units & Prefixes simulation. Convert quantities between prefixes and look for the factor of ten each step introduces.',
      exam:'Always attach units to numerical answers unless the quantity is dimensionless. Write unit symbols exactly: m for metre, s for second, A for ampere.',
      exit:'Why is N described as a derived unit rather than a base unit?'
    },
    {
      id:'prefix', code:'3.1.1', title:'Prefixes, standard form and conversions', subtitle:'Move safely between very large and very small scales.',
      retrieval:['What power of ten does milli represent?','What power of ten does mega represent?','Write 0.0000042 in standard form.'],
      objectives:['Use T, G, M, k, c, m, μ, n, p and f.','Convert between units with different prefixes.','Avoid errors when converting squared or cubed units.'],
      vocab:['tera','giga','mega','kilo','centi','milli','micro','nano','pico','femto','standard form'],
      teach:`A prefix multiplies the unit by a power of ten. The most common mistakes happen when the unit itself is squared or cubed. For example 1 cm = 10⁻² m, so 1 cm² = (10⁻² m)² = 10⁻⁴ m². Treat the power as applying to the conversion factor as well as the unit. AQA also expects conversion between different units for the same quantity, including J ↔ eV and J ↔ kW h.`,
      equation:'prefixPower', worked:'3.2 mm² = 3.2 × (10⁻³ m)² = 3.2 × 10⁻⁶ m².',
      mission:'Use the prefix converter. Try length, area and volume and explain why the exponent changes the conversion factor.',
      exam:'Do the unit conversion before substituting into an equation. This prevents hidden powers-of-ten errors.',
      exit:'Convert 250 μm into metres and write the answer in standard form.'
    },
    {
      id:'quality', code:'3.1.2', title:'Accuracy, precision and measurement quality', subtitle:'Use the right word for the right idea.',
      retrieval:['Is a digital display with more decimal places automatically more accurate?','What is resolution?','What does repeatability describe?'],
      objectives:['Distinguish accuracy from precision.','Define repeatability, reproducibility and resolution.','Relate instrument resolution to measurement uncertainty.'],
      vocab:['accuracy','precision','repeatability','reproducibility','resolution','true value'],
      teach:`Accuracy describes closeness to the true value. Precision describes how closely repeated values agree with one another. Repeatability means obtaining similar results using the same method, equipment and operator; reproducibility means obtaining similar results when method, equipment or operator changes. Resolution is the smallest change an instrument can distinguish. A precise set can still be inaccurate if every reading is shifted by a systematic error.`,
      equation:'resolution', worked:'A ruler marked every 1 mm has a resolution of 1 mm. A sensible single-reading uncertainty is commonly based on that scale resolution and the way the reading is made.',
      mission:'Use the Resolution & Instruments model. Compare ruler, vernier and micrometer readouts for the same object.',
      exam:'Do not use “accurate” when you mean “precise”. If the true value is unknown, you often cannot directly judge accuracy.',
      exit:'A set of readings are tightly clustered but all 0.30 mm too high. Which measurement-quality words describe this set?'
    },
    {
      id:'errors', code:'3.1.2', title:'Random and systematic errors', subtitle:'Identify the pattern, then choose the right improvement.',
      retrieval:['What happens to random scatter when readings are repeated?','Does averaging remove a zero error?','Give one source of systematic error.'],
      objectives:['Identify random and systematic errors from data.','Suggest methods that reduce random error.','Suggest methods that remove or correct systematic error.'],
      vocab:['random error','systematic error','zero error','calibration','scatter','mean'],
      teach:`Random errors cause unpredictable variation from reading to reading. Repeating and averaging can reduce their effect on the estimate of the mean. Systematic errors shift readings in the same direction or by a consistent pattern; they are not removed by simply repeating. Calibration, zero checks, method redesign or applying a correction are appropriate responses.`,
      equation:'meanHalfRange', worked:'Readings 9.8, 10.2, 10.0, 10.1 and 9.9 cm have mean 10.0 cm. Half range = (10.2 − 9.8)/2 = 0.2 cm.',
      mission:'Open the Random vs Systematic model. Add scatter and zero offset separately and watch what averaging changes.',
      exam:'Link the improvement to the error type: repeats → random; calibration/zero correction → systematic.',
      exit:'Why does taking 20 readings not automatically fix a balance that reads +0.50 g when empty?'
    },
    {
      id:'uncertainty', code:'3.1.2', title:'Absolute, fractional and percentage uncertainty', subtitle:'Express how large the uncertainty is relative to the measurement.',
      retrieval:['What unit does an absolute uncertainty have?','Does a fractional uncertainty have units?','How is percentage uncertainty related to fractional uncertainty?'],
      objectives:['Convert between absolute, fractional and percentage uncertainty.','Quote values and uncertainties consistently.','Relate significant figures to the size of the uncertainty.'],
      vocab:['absolute uncertainty','fractional uncertainty','percentage uncertainty','significant figures'],
      teach:`Absolute uncertainty has the same unit as the measurement, for example 12.4 ± 0.2 cm. Fractional uncertainty is Δx/x and percentage uncertainty is (Δx/x) × 100%. The stated value should not imply more precision than the uncertainty supports. A common convention is to quote the uncertainty to one significant figure (sometimes two when useful) and match the measured value to the same decimal place.`,
      equation:'percentageUncertainty', worked:'For L = 0.840 ± 0.002 m, percentage uncertainty = (0.002/0.840)×100 = 0.238% ≈ 0.24%.',
      mission:'Use the Uncertainty Explorer. Change the same absolute uncertainty for small and large measured values and compare the percentage uncertainty.',
      exam:'A small absolute uncertainty can still be a large percentage uncertainty if the measured value is small.',
      exit:'Which is better in relative terms: 5.0 ± 0.1 cm or 50.0 ± 0.1 cm? Explain numerically.'
    },
    {
      id:'propagation', code:'3.1.2', title:'Combining uncertainties', subtitle:'Apply the correct rule for the mathematical operation.',
      retrieval:['When adding measured quantities, which uncertainties are combined?','When multiplying, which uncertainties are combined?','What happens to percentage uncertainty when a quantity is squared?'],
      objectives:['Add absolute uncertainties for sums and differences.','Add percentage uncertainties for products and quotients.','Multiply percentage uncertainty by the power for powers.'],
      vocab:['propagation','sum','difference','product','quotient','power'],
      teach:`For A = B ± C, add the absolute uncertainties: ΔA = ΔB + ΔC. For A = BC or A = B/C, add percentage (or fractional) uncertainties. For A = Bⁿ, multiply the percentage uncertainty in B by |n|. These are the AQA rules used for examination calculations; trigonometric and logarithmic combinations are not required.`,
      equation:'combineUncertainty', worked:'r = 6.0 ± 0.1 cm. Area A = πr². % uncertainty in r = 1.67%, so % uncertainty in A = 2×1.67% = 3.33%.',
      mission:'Use the Propagation Builder. Switch between +, −, ×, ÷ and powers, then predict which type of uncertainty will be combined.',
      exam:'Do not add percentage uncertainties for addition/subtraction, and do not add absolute uncertainties for multiplication/division.',
      exit:'A = xy². x has 2% uncertainty and y has 3% uncertainty. What is the percentage uncertainty in A?'
    },
    {
      id:'graphs', code:'3.1.2', title:'Error bars and gradient uncertainty', subtitle:'Show uncertainty on a graph and test the range of acceptable lines.',
      retrieval:['What does an error bar represent?','Why is a line of best fit not expected to pass through every point?','What does the gradient represent in y = mx + c?'],
      objectives:['Represent point uncertainty with error bars.','Estimate maximum and minimum acceptable gradients.','State an uncertainty in gradient and intercept.'],
      vocab:['error bar','best fit','maximum gradient','minimum gradient','intercept','gradient uncertainty'],
      teach:`Error bars show the uncertainty associated with plotted coordinates. For a straight-line relationship, draw a sensible best-fit line, then identify the steepest or shallowest acceptable line that is still consistent with the uncertainty bars. Following AQA practical guidance, compare the best gradient with the single worst acceptable gradient: percentage uncertainty = |m_best − m_worst| / |m_best| × 100%. Apply the same best-versus-worst method to the intercept.`,
      equation:'gradientUncertainty', worked:'If m_best = 2.40 and the worst acceptable gradient is 2.55, Δm = |2.40−2.55| = 0.15 and percentage uncertainty = 0.15/2.40 × 100 = 6.25%, so m = 2.40 ± 0.15.',
      mission:'Use the Error Bars & Gradients model. Increase error bars and see how the allowable gradient range changes.',
      exam:'The steepest and shallowest acceptable lines should still be consistent with the error bars; do not simply connect extreme raw data points.',
      exit:'Why does larger point uncertainty usually increase the uncertainty in a graph gradient?'
    },
    {
      id:'estimation', code:'3.1.3', title:'Orders of magnitude and estimation', subtitle:'Use physics sense to check whether an answer is plausible.',
      retrieval:['What is an order of magnitude?','Which power of ten is closest to 6300?','Why are estimates useful before calculator work?'],
      objectives:['Estimate a quantity to the nearest order of magnitude.','Build derived estimates from simple assumptions.','Use estimation to spot impossible calculator answers.'],
      vocab:['order of magnitude','estimate','assumption','Fermi estimate','plausibility'],
      teach:`An order-of-magnitude estimate identifies the nearest power of ten. Good estimates use simple, stated assumptions and values known from everyday physics. The point is not false precision; it is to produce a physically sensible scale and to test whether a detailed answer is plausible.`,
      equation:'orderMagnitude', worked:'A classroom is about 10 m long, 10 m wide and 3 m high, so its volume is roughly 3×10² m³, which is order 10² m³.',
      mission:'Use the Estimation Challenge. Adjust assumptions for a real-world estimate and compare the calculated value with its nearest power of ten.',
      exam:'State assumptions clearly. A well-reasoned approximate value is stronger than an unexplained number with many significant figures.',
      exit:'Estimate the order of magnitude of the number of heartbeats a person experiences in a year.'
    }
  ];

  const practicalNotes = {
    si:'Use unit headings in tables so each numerical column has an unambiguous unit. Convert all values to a consistent set of units before combining them.',
    prefix:'For area and volume, apply the conversion factor to the appropriate power. Write the factor explicitly before using the calculator.',
    quality:'Choose instruments with a resolution suitable for the size of the quantity being measured. Extra decimal places on a display do not guarantee accuracy.',
    errors:'Repeat values to reveal scatter; zero and calibration checks target systematic offsets. A good evaluation names the source and the improvement.',
    uncertainty:'Uncertainty should reflect the method, instrument and judgement involved. Report the final value to a precision consistent with the uncertainty.',
    propagation:'Carry more calculator digits during working and round the final answer only after the uncertainty has been determined.',
    graphs:'Use a large graph scale, label axes with units, plot error bars carefully and use the full data range for gradient calculations.',
    estimation:'Use assumptions that are defensible and physically plausible; round early enough to keep the estimate transparent.'
  };


  const lessonChecks = {
    si:{points:[['base units','base unit|kg|metre|meter|second|ampere|kelvin|mol'],['derived from base units','derived|combination|kg.*m|m.*s']],model:'A newton is derived because it can be written using base units: N = kg m s⁻².'},
    prefix:{points:[['correct power of ten','2\\.?5.*10.*-4|0\\.?00025'],['metres','metre|meter| m\\b']],model:'250 μm = 250 × 10⁻⁶ m = 2.50 × 10⁻⁴ m.'},
    quality:{points:[['precise','precis'],['not accurate / inaccurate','inacc|not accurate'],['systematic offset','systematic|offset|zero error']],model:'The readings are precise but inaccurate because a systematic offset shifts the whole cluster.'},
    errors:{points:[['random scatter reduced by repeats','random|scatter'],['systematic error remains','systematic|zero error|offset'],['calibration/correction needed','calibrat|correct|zero check']],model:'Repeats reduce random scatter, but the +0.50 g systematic zero error remains until it is corrected or the balance is zeroed/calibrated.'},
    uncertainty:{points:[['5 cm result about 2%','2%|2 percent|2\\.0'],['50 cm result about 0.2%','0\\.2%|0\\.2 percent'],['50 cm is better relatively','50.*better|second.*better|smaller percentage']],model:'5.0 ± 0.1 cm has 2% uncertainty; 50.0 ± 0.1 cm has 0.2%, so the 50.0 cm measurement is better in relative terms.'},
    propagation:{points:[['8 percent','8%|8 percent|eight percent'],['square doubles y contribution','2.*3|twice|squared'],['percentage uncertainties are added','add|sum']],model:'A = xy² gives 2% + 2×3% = 8%.'},
    graph:{points:[['wider acceptable range','wider|larger range|more possible'],['larger gradient uncertainty','gradient uncertainty.*larg|uncertainty.*increase|greater uncertainty']],model:'Larger error bars permit a wider range of acceptable limiting lines, so uncertainty in gradient (and often intercept) increases.'},
    estimation:{points:[['about 3.7 × 10^7','3\\.?[5-9].*10.*7|37000000|3\\.?7e7'],['order 10^7','10.*7|ten million']],model:'At about 70 beats min⁻¹: 70 × 60 × 24 × 365 ≈ 3.7 × 10⁷ beats, so the order of magnitude is 10⁷.'}
  };

  const textbook = lessons.map((l, i) => ({
    id:l.id, title:`${i+1}. ${l.title}`, code:l.code,
    intro:l.teach,
    sections:[
      {h:'Core idea', p:l.teach},
      {h:'What you must be able to do', list:l.objectives},
      {h:'Key language', p:l.vocab.join(' · ')},
      {h:'Worked example', p:l.worked, equation:l.equation},
      {h:'Practical thinking', p:practicalNotes[l.id] || 'Use a measurement method that gives a realistic uncertainty, record enough information to repeat the method, and evaluate limitations using evidence from the data.'},
      {h:'AQA exam focus', p:l.exam, trap:true}
    ]
  }));

