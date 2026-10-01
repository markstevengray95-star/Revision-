(() => {
  'use strict';
  const D=window.MATERIALS_DATA;
  if(!D?.lessons)return;
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const LESSONS={
    density:{
      big:'Density is a bulk property: it describes how much mass is contained in each unit volume of a material. The central skill is moving fluently between a physical object, measurements of mass and dimensions, a calculated volume and the ratio ρ = m/V.',
      sections:[
        ['From object to material property','Mass alone cannot identify a material because a larger sample normally has more mass. Volume alone also cannot identify it. Dividing mass by volume removes the effect of sample size, so samples of the same uniform material should give approximately the same density.'],
        ['Measuring regular solids','For a cuboid, measure three perpendicular dimensions and use V = lwh. Repeat small dimensions where practical, avoid parallax, and keep all lengths in metres before calculating m³. The percentage uncertainty in a product is approximately the sum of the percentage uncertainties of the measured dimensions.'],
        ['Measuring irregular solids','Use displacement when the object is fully immersible and does not react with the liquid. The rise in liquid volume equals the object volume. Read the bottom of the meniscus at eye level and state the instrument resolution.'],
        ['Unit conversion that often loses marks','1 cm = 10⁻² m, so 1 cm³ = (10⁻²)³ m³ = 10⁻⁶ m³. Therefore 250 cm³ = 2.50 × 10⁻⁴ m³. Converting cubic units requires cubing the length conversion factor.'],
        ['Estimation and plausibility','Before calculating, estimate the order of magnitude. A metal result of only a few kg m⁻³ is implausible; a common metal is usually thousands of kg m⁻³. Use this check to catch missed powers of ten.'],
        ['Comparing methods','A balance may have very small resolution while the volume measurement dominates uncertainty. A good evaluation identifies which measured quantity contributes most to the final uncertainty rather than simply saying “use more accurate equipment”.']
      ],
      worked:[
        ['A cylinder has mass 0.212 kg, diameter 24.0 mm and length 80.0 mm. Find its density.',['d = 0.0240 m, so r = 0.0120 m','L = 0.0800 m','V = πr²L = π(0.0120)²(0.0800) = 3.62 × 10⁻⁵ m³','ρ = m/V = 0.212/(3.62 × 10⁻⁵) = 5.86 × 10³ kg m⁻³','Quote to an appropriate number of significant figures: 5.86 × 10³ kg m⁻³.']],
        ['A stone displaces water from 42 cm³ to 67 cm³ and has mass 68 g.',['V = 25 cm³ = 25 × 10⁻⁶ m³','m = 0.068 kg','ρ = 0.068/(25 × 10⁻⁶) = 2.72 × 10³ kg m⁻³','The answer is plausible for a dense rock or mineral.']]
      ],
      guided:['Why does doubling both mass and volume leave density unchanged?','Which measurement is likely to dominate uncertainty for a small cylinder: mass or diameter? Explain.','A student gets 7.8 kg m⁻³ for steel. Identify the most likely type of mistake.'],
      exam:'For explain questions, link the measurement to the ratio: “samples of the same material have the same mass per unit volume, so m/V is approximately constant.” For evaluation, name the measurement, the error mechanism and the resulting effect.',
      challenge:'Design a method to identify an unknown metal sample using only a balance, micrometer or vernier callipers and a table of accepted densities. Include repeats, uncertainty and a decision rule.'
    },
    hooke:{
      big:'Hooke’s law is a proportionality statement, not just a formula. In the proportional region the ratio F/ΔL is constant, the force–extension graph is a straight line through the origin and its gradient is the spring constant k when force is plotted vertically.',
      sections:[
        ['Extension is a change, not a length','Always distinguish original length L₀, final length L and extension ΔL = L − L₀. Using total length in F = kΔL gives a physically meaningless spring constant.'],
        ['Direct proportionality','F ∝ ΔL means doubling F doubles ΔL and F/ΔL remains constant. A graph that is straight but does not pass through the origin is not evidence of direct proportionality unless a zero offset is identified and corrected.'],
        ['Spring constant','k = F/ΔL measures the stiffness of a particular spring or sample. A larger k means more force is required for each metre of extension. It depends on geometry as well as material.'],
        ['Graph gradients','On a graph of F against ΔL, gradient = k. On ΔL against F, gradient = 1/k. Always read the axes before assigning meaning to a gradient.'],
        ['Limit of proportionality','At the limit of proportionality the graph begins to curve. This tells you Hooke’s law has stopped applying. It does not by itself prove that deformation has become permanent.'],
        ['Experimental route','Add loads in measured increments, allow oscillations to settle, record position, convert position to extension and plot F against ΔL. Take a large gradient triangle using well-separated points on the best-fit line.']
      ],
      worked:[
        ['A spring extends from 12.4 cm to 15.6 cm under 7.2 N. Calculate k.',['ΔL = 3.2 cm = 0.032 m','k = F/ΔL = 7.2/0.032','k = 225 N m⁻¹.']],
        ['A best-fit graph passes through (0.010 m, 2.6 N) and (0.045 m, 11.4 N).',['ΔF = 8.8 N','Δ(ΔL) = 0.035 m','k = gradient = 8.8/0.035 = 2.51 × 10² N m⁻¹','Use points on the line, not necessarily raw data points.']]
      ],
      guided:['Explain why a straight line with a non-zero intercept needs investigation.','How would the graph change for a stiffer spring?','Why should a gradient triangle use points far apart?'],
      exam:'Use the phrase “directly proportional provided the limit of proportionality has not been exceeded.” If asked for evidence, refer to a straight line through the origin or a constant ratio F/ΔL.',
      challenge:'Two springs have different lengths and coil diameters. Plan a fair comparison of stiffness and explain why k is a sample property rather than a pure material property.'
    },
    'force-extension':{
      big:'The key distinction is between proportional behaviour and elastic behaviour. A sample can stop obeying Hooke’s law yet still return to its original dimensions when unloaded. Plastic deformation begins only after the elastic limit is exceeded.',
      sections:[
        ['Three important regions','The initial straight region is proportional. Beyond the limit of proportionality the curve may bend while the material is still elastic. Beyond the elastic limit, unloading leaves a permanent extension.'],
        ['Loading and unloading','An elastic sample returns to zero extension after unloading. A plastically deformed sample reaches zero force at a non-zero extension, called permanent set.'],
        ['Microscopic picture','Elastic deformation mainly changes interatomic spacing and bond angles reversibly. Plastic deformation involves irreversible movement or rearrangement of internal structure, so the original arrangement is not fully recovered.'],
        ['Ductile and brittle','Ductile materials undergo substantial plastic deformation before fracture. Brittle materials fracture with little plastic deformation. Neither word by itself tells you the Young modulus.'],
        ['Fracture and breaking force','Breaking force depends strongly on specimen cross-sectional area. To compare materials, breaking stress is more meaningful because it divides force by area.'],
        ['Evidence language','Do not infer plasticity merely because the graph is curved. The strongest experimental evidence is permanent extension after the load has been removed.']
      ],
      worked:[
        ['A 1.500 m wire is loaded and then unloaded. Its final length is 1.504 m.',['Permanent extension = 0.004 m','Because the extension remains after force is removed, the elastic limit was exceeded','The deformation has a plastic component.']],
        ['Two materials break at the same force, but one specimen has half the cross-sectional area.',['Breaking force alone cannot establish equal strength','The thinner specimen experienced double the stress at the same force','Compare breaking stress, not breaking force.']]
      ],
      guided:['Can a material be non-Hookean but still elastic? Explain.','What observation proves permanent deformation?','Why does brittle not mean weak?'],
      exam:'Keep limit of proportionality and elastic limit separate. A high-quality answer states what happens on unloading and uses “permanent extension” when describing plastic deformation.',
      challenge:'Sketch and explain loading and unloading curves for an elastic sample and a plastically deformed sample. Annotate the permanent extension and energy differences.'
    },
    energy:{
      big:'Elastic strain energy is work done in deforming a sample. On a force–extension graph, work is the area under the curve because each small strip has area FΔx, representing a small amount of work.',
      sections:[
        ['Why ½FΔL appears','For a Hookean spring, force rises linearly from zero to final force F. The average force is therefore F/2, so W = average force × extension = ½FΔL.'],
        ['Second form','Substitute F = kΔL into ½FΔL to obtain E = ½k(ΔL)². The square means a small increase in extension can produce a much larger increase in stored energy.'],
        ['Non-linear loading','If the force–extension graph is curved, do not automatically use ½FΔL. Estimate or calculate the full area under the actual curve.'],
        ['Energy conservation','When released, elastic energy can become kinetic energy, gravitational potential energy, internal energy and sound. In an ideal model total energy is conserved; real systems transfer some energy thermally.'],
        ['Loading–unloading loops','If unloading follows a different path from loading, the area enclosed by the loop represents energy dissipated per cycle. This is useful when discussing damping and energy-absorbing materials.'],
        ['Exam graph skill','State the physical quantity before calculating an area. Include units: N m = J. If using a triangle or trapezium, make clear which region of the graph is being approximated.']
      ],
      worked:[
        ['A spring with k = 480 N m⁻¹ is extended 35 mm.',['x = 0.035 m','E = ½kx²','E = 0.5 × 480 × 0.035² = 0.294 J.']],
        ['A force rises linearly from 0 to 12 N over 0.050 m, then remains 12 N for a further 0.020 m.',['Triangular area = ½ × 12 × 0.050 = 0.300 J','Rectangular area = 12 × 0.020 = 0.240 J','Total work = 0.540 J.']]
      ],
      guided:['Why is final force × extension too large for a Hookean spring loaded from zero?','What does the area enclosed by a loading–unloading loop mean?','If extension triples, by what factor does Hookean strain energy change?'],
      exam:'When a graph is supplied, use “area under the force–extension graph = work done = energy transferred to deformation.” Do not use the triangular formula beyond a linear region unless justified.',
      challenge:'Use conservation of energy to predict the launch speed of a block released from a compressed spring, then discuss why the measured speed might be lower.'
    },
    'stress-strain':{
      big:'Stress and strain remove the effect of specimen geometry. Stress scales force by cross-sectional area; strain scales extension by original length. This lets us compare how materials respond rather than how differently sized samples respond.',
      sections:[
        ['Tensile stress','σ = F/A. Stress has unit Pa because N m⁻² = Pa. For a circular wire A = πd²/4, so diameter errors are especially important because d is squared.'],
        ['Tensile strain','ε = ΔL/L. Both numerator and denominator are lengths, so strain is dimensionless. It may be written as a decimal or percentage, but do not attach a length unit.'],
        ['Why original length matters','For the same material, a longer wire extends more under the same stress. Dividing extension by original length removes this geometry effect.'],
        ['Why area matters','A thinner wire carries the same force over a smaller area, so its stress is larger. This is why force alone cannot be used to compare the intrinsic tensile strength of different specimens.'],
        ['Circular cross-sections','If diameter d = 0.50 mm, convert d to metres before squaring. Using radius incorrectly or forgetting the factor of 4 can change stress by a factor of four.'],
        ['From force–extension to stress–strain','Convert each force value to stress using the same original area and each extension to strain using the same original length, provided those initial dimensions are the intended model.']
      ],
      worked:[
        ['A wire of diameter 0.42 mm carries 38 N. Find stress.',['d = 4.2 × 10⁻⁴ m','A = πd²/4 = 1.39 × 10⁻⁷ m²','σ = 38/(1.39 × 10⁻⁷) = 2.74 × 10⁸ Pa = 274 MPa.']],
        ['A 1.80 m wire extends by 1.6 mm. Find strain.',['ΔL = 1.6 × 10⁻³ m','ε = ΔL/L = 1.6 × 10⁻³ / 1.80','ε = 8.89 × 10⁻⁴, with no unit.']]
      ],
      guided:['Why does doubling diameter reduce stress by a factor of four at the same force?','Why is strain dimensionless?','What geometry information is removed when converting force–extension data to stress–strain data?'],
      exam:'Show the cross-sectional area calculation explicitly. State “strain has no unit”. When comparing materials, refer to stress and strain rather than raw force and extension.',
      challenge:'Take a force–extension dataset for a wire and transform every point into stress–strain coordinates. State assumptions and the quantities that must stay fixed.'
    },
    young:{
      big:'Young modulus E is the ratio of tensile stress to tensile strain in the linear elastic region. It measures material stiffness: a large E means a large stress is needed to produce a given strain.',
      sections:[
        ['Definition and units','E = σ/ε. Since strain has no unit, E has the same unit as stress: Pa. Engineering values are commonly quoted in GPa.'],
        ['Derivation','Substitute σ = F/A and ε = ΔL/L: E = (F/A)/(ΔL/L) = FL/(AΔL). This makes the experimental variables in Required Practical 4 explicit.'],
        ['Graph method','If stress is on the vertical axis and strain on the horizontal axis, the gradient of the straight elastic region is E. Use a best-fit line and a large gradient triangle.'],
        ['What E does not mean','Young modulus describes stiffness, not breaking stress, toughness or ductility. A material can be very stiff yet fracture at relatively small strain.'],
        ['Geometry prediction','Rearrange to ΔL = FL/(AE). Extension increases with F and L, decreases with A and E. For a circular wire, increasing diameter strongly reduces extension because A ∝ d².'],
        ['Material condition','Treat E as a material property under stated conditions. Real values can vary with composition, temperature and processing, so experimental answers should be compared sensibly rather than expected to match a table exactly.']
      ],
      worked:[
        ['A 2.40 m wire of diameter 0.50 mm extends 2.9 mm under 60 N. Find E.',['A = π(5.0 × 10⁻⁴)²/4 = 1.96 × 10⁻⁷ m²','ΔL = 2.9 × 10⁻³ m','E = FL/(AΔL)','E = (60 × 2.40)/(1.96 × 10⁻⁷ × 2.9 × 10⁻³) = 2.54 × 10¹¹ Pa.']],
        ['A stress–strain line rises from (0,0) to (0.0012, 240 MPa).',['E = Δσ/Δε','E = 240 × 10⁶ / 0.0012','E = 2.0 × 10¹¹ Pa = 200 GPa.']]
      ],
      guided:['How does extension change if the original length doubles?','How does extension change if diameter doubles?','Why does a steeper initial stress–strain gradient mean a stiffer material?'],
      exam:'Use the initial linear region only. If finding E experimentally, state how F, L, d or A and ΔL are measured and how the gradient or combined equation is used.',
      challenge:'Derive an expression for the force required to produce a chosen strain in a wire, then explain which specimen dimensions disappear from the result and why.'
    },
    curves:{
      big:'A stress–strain curve contains several different material properties at once. Read it systematically: initial gradient → stiffness, breaking or maximum stress → strength, strain at fracture → ductility, and area under the curve → energy absorbed per unit volume.',
      sections:[
        ['Stiffness','The initial gradient is Young modulus. Do not judge stiffness from how high the curve eventually reaches; use the gradient close to the origin.'],
        ['Strength','Breaking stress describes the stress at fracture. Depending on the curve, maximum tensile stress may occur before final fracture, especially where necking develops.'],
        ['Ductility','Large strain before fracture indicates ductile behaviour. A material with small fracture strain and little plastic region is brittle.'],
        ['Energy absorption','The area under a stress–strain curve has units Pa × dimensionless = J m⁻³, so it represents deformation energy per unit volume. This is useful when considering impact and energy absorption.'],
        ['Material selection','There is rarely one universally “best” material. Selection depends on stiffness, strength, density, energy absorption, manufacture, cost, corrosion, recyclability and safety.'],
        ['Transport design and ethics','Reducing mass can lower energy use, but material production, repairability, crash performance and lifetime environmental cost also matter. A physics argument should identify the trade-off rather than claiming one property decides everything.']
      ],
      worked:[
        ['Material A has E = 210 GPa and breaks at 350 MPa; B has E = 70 GPa and breaks at 500 MPa.',['A is stiffer because E is larger','B withstands a larger tensile stress before fracture','The data given are insufficient to decide which is more ductile.']],
        ['A polymer reaches strain 0.25 before fracture while glass fractures at strain 0.002.',['The polymer is much more ductile','Glass is brittle in this comparison','This alone does not tell us which has the larger Young modulus; use the initial gradient.']]
      ],
      guided:['Can a strong material be flexible? Explain using two different graph features.','What quantity does the area under a stress–strain curve represent?','Why should transport material choice include density as well as strength?'],
      exam:'Structure comparisons property by property: “A is stiffer because…; B is stronger because…; A or B is more ductile because…”. Avoid vague words such as “better” unless the design requirement is stated.',
      challenge:'Choose materials for a bicycle frame, protective crash structure and transparent panel. Justify each using at least three physical properties and one wider design consideration.'
    },
    rp4:{
      big:'Required Practical 4 is a complete measurement chain: measure original length and wire diameter, apply known forces, measure small extensions, convert the data to stress and strain or use FL/(AΔL), then determine Young modulus while controlling uncertainty and safety.',
      sections:[
        ['Apparatus logic','A long thin wire gives a measurable extension. A comparison or reference wire can reduce errors caused by movement of the support. A micrometer is needed because wire diameter is small and its uncertainty strongly affects area.'],
        ['Measuring diameter','Check for zero error, measure diameter at several positions and orientations, then calculate a mean. Because A ∝ d², the percentage uncertainty in area is approximately twice the percentage uncertainty in diameter.'],
        ['Original length and extension','Measure the original test length between fixed reference points. Use a vernier or travelling marker, or another sensitive method, to measure extension. Avoid parallax and wait for oscillations to settle.'],
        ['Loading strategy','Add masses gently and in increments. Convert mass to force using F = mg. Stay within the required elastic or proportional region when determining E and consider unloading readings to check for permanent deformation.'],
        ['Graph analysis','A stress–strain graph has gradient E in the linear region. Alternatively, a force–extension graph can be used with geometry to calculate E. Best-fit gradients should use well-separated points.'],
        ['Uncertainty and evaluation','Identify the dominant uncertainty, repeat measurements, distinguish random scatter from systematic offsets, and suggest specific improvements. A zero error is systematic; repeated diameter readings help estimate random variation but do not remove a common zero offset.'],
        ['Safety','Secure the support and masses, protect against a falling mass or wire failure, keep the loading area clear and use appropriate eye protection where a snapping wire is a risk.'],
        ['Written-paper link','AQA can assess the required practical and the skills it exemplifies in written exams, so students must justify apparatus choices, process data, discuss uncertainty and evaluate method—not only remember the sequence.']
      ],
      worked:[
        ['A 2.00 m steel wire has mean diameter 0.46 mm. Under 40 N it extends 2.10 mm. Find E.',['A = π(4.6 × 10⁻⁴)²/4 = 1.66 × 10⁻⁷ m²','ΔL = 2.10 × 10⁻³ m','E = FL/(AΔL)','E = (40 × 2.00)/(1.66 × 10⁻⁷ × 2.10 × 10⁻³) = 2.30 × 10¹¹ Pa.']],
        ['Diameter = 0.46 ± 0.01 mm. Estimate percentage uncertainty in area.',['Percentage uncertainty in d = 0.01/0.46 × 100 ≈ 2.17%','A ∝ d², so percentage uncertainty in A ≈ 2 × 2.17% = 4.35%','This can dominate the uncertainty in E.']]
      ],
      guided:['Why is a long wire useful?','Why measure diameter in several places and directions?','Why can a reference wire improve the extension measurement?','How would a positive micrometer zero error affect calculated area and hence E if uncorrected?'],
      exam:'A strong practical answer links every improvement to an error mechanism: “measure diameter repeatedly at different positions to reduce the effect of random variation and obtain a representative mean.”',
      challenge:'Write a full method capable of producing a Young modulus value and uncertainty estimate, including apparatus, measurements, graph, safety, error analysis and two justified improvements.'
    }
  };
  function cards(items){return items.map(([h,b])=>`<article class="v11-depth-card"><h4>${esc(h)}</h4><p>${esc(b)}</p></article>`).join('');}
  function worked(items){return items.map(([q,steps],i)=>`<article class="v11-worked"><span class="eyebrow">Worked example ${i+1}</span><h4>${esc(q)}</h4><ol>${steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></article>`).join('');}
  function enhance(){
    const panel=$('#lessonPanel');if(!panel||panel.querySelector('#lessonDepthV11'))return;
    const id=localStorage.getItem('materials.lesson')||D.lessons[0]?.id,x=LESSONS[id];if(!x)return;
    const sec=document.createElement('section');sec.id='lessonDepthV11';sec.className='lesson-depth-v11';
    sec.innerHTML=`<div class="v11-depth-head"><div><span class="eyebrow">v11 · deep lesson extension</span><h3>Build full A-level understanding</h3></div><button class="button primary" data-v11-open3d="${esc(id)}">Open this lesson in 3D</button></div><article class="v11-big-idea"><strong>Big idea</strong><p>${esc(x.big)}</p></article><div class="v11-depth-grid">${cards(x.sections)}</div><div class="v11-depth-section"><h3>More worked examples</h3><div class="v11-worked-grid">${worked(x.worked)}</div></div><div class="v11-depth-section"><h3>Guided thinking</h3><ol class="v11-guided">${x.guided.map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div><div class="v11-depth-grid two"><article class="v11-depth-card exam"><h4>Exam language & technique</h4><p>${esc(x.exam)}</p></article><article class="v11-depth-card challenge"><h4>Stretch / A* challenge</h4><p>${esc(x.challenge)}</p></article></div><div class="v11-depth-section v11-plenary"><h3>End-of-lesson retrieval</h3><p>Without notes, explain the lesson’s central relationship, name one common error, and describe what evidence from a graph or practical would support your explanation.</p></div>`;
    panel.appendChild(sec);
    sec.querySelector('[data-v11-open3d]')?.addEventListener('click',e=>{document.querySelector('[data-view="lab"]')?.click();window.dispatchEvent(new CustomEvent('materials-v11-open-scene',{detail:{lesson:e.currentTarget.dataset.v11Open3d}}));});
  }
  let queued=false;const observer=new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhance();});});
  const panel=$('#lessonPanel');if(panel)observer.observe(panel,{childList:true,subtree:false});enhance();
  window.MaterialsLessonDepthV11={lessons:LESSONS,enhance};
})();