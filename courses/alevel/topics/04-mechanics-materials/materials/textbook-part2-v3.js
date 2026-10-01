(() => {
  const D=window.MATERIALS_DATA,V=window.MATERIALS_V3_VISUALS;if(!D||!V)return;const {fig,densitySvg,hookeSvg,unloadSvg,energySvg,stressSvg,youngSvg,curvesSvg,rpSvg}=V;
  D.textbook.push(
    {
      id:'stress-strain-v3', title:'5 · Tensile stress, strain & geometry', html:`
      <h2>Tensile stress and tensile strain</h2>
      <p>Force–extension data depend on the dimensions of the sample. Stress and strain remove those geometric effects so that materials can be compared more fairly.</p>
      ${fig('Geometry of a tensile test piece', stressSvg, 'Stress uses force per cross-sectional area; strain uses extension divided by original length.')}
      <p><button class="equation-link" data-equation="stress">σ = F/A</button> <button class="equation-link" data-equation="strain">ε = ΔL/L</button></p>
      <h3>Tensile stress</h3><p>Stress is force per unit cross-sectional area. Its SI unit is Pa = N m⁻². The same force produces a larger stress in a thinner wire.</p>
      <h3>Tensile strain</h3><p>Strain is fractional extension. It has no unit because it is a length divided by a length.</p>
      <h3>Wire cross-sectional area</h3><p><button class="equation-link" data-equation="area">A = πd²/4</button></p><p>Because d is squared, a small percentage uncertainty in diameter causes approximately twice that percentage uncertainty in area.</p>
      <h3>Worked comparison</h3><p>Two wires made of the same material can have different force–extension gradients because their lengths and areas differ. Once converted to stress–strain form, their initial gradients should agree within experimental uncertainty.</p>`
    },
    {
      id:'young-v3', title:'6 · Young modulus in depth', html:`
      <h2>Young modulus</h2>
      <p>Young modulus quantifies how resistant a material is to elastic tensile strain. It is a <strong>material property</strong>, unlike a spring constant, which describes a particular sample.</p>
      ${fig('Young modulus from a graph', youngSvg, 'When stress is plotted vertically against strain horizontally, the initial linear gradient equals Young modulus.')}
      <p><button class="equation-link" data-equation="young">E = σ/ε = FL/(AΔL)</button></p>
      <h3>Physical meaning</h3><p>A large E means a large stress is required to produce a given strain. This is why Young modulus is associated with <strong>stiffness</strong>.</p>
      <h3>Do not confuse stiffness and strength</h3><p>A material can have a high Young modulus but fracture at a relatively low stress. Young modulus describes the initial elastic slope, whereas strength is linked to failure stress.</p>
      <h3>Geometry and extension</h3><p>Rearranging gives ΔL = FL/(AE). Extension increases with force and original length, and decreases with area and Young modulus. Doubling diameter increases area by a factor of four, so the extension becomes one quarter for the same F, L and E.</p>
      <h3>Orders of magnitude</h3><p>Many metals have Young moduli of order 10¹¹ Pa. Values are commonly quoted in GPa, where 1 GPa = 10⁹ Pa.</p>`
    },
    {
      id:'curves-v3', title:'7 · Stress–strain curves & material properties', html:`
      <h2>Interpreting stress–strain curves</h2>
      <p>A single stress–strain graph can reveal several different material properties. You should be able to identify them independently rather than describing one material as simply “better”.</p>
      ${fig('Brittle and ductile response', curvesSvg, 'The initial slope indicates stiffness, while the fracture coordinates describe strength and ductility.')}
      <div class="property-table"><div><strong>Initial gradient</strong><span>Young modulus / stiffness</span></div><div><strong>Maximum or breaking stress</strong><span>strength in tension</span></div><div><strong>Strain before fracture</strong><span>ductility or brittleness</span></div><div><strong>Area under curve</strong><span>energy absorbed per unit volume</span></div></div>
      <h3>Toughness</h3><p>In a simplified mechanical sense, a material that absorbs a large amount of energy per unit volume before fracture is tough. This is related to the total area under the stress–strain curve.</p>
      <h3>Material selection</h3><p>Real engineering decisions may involve stiffness, strength, density, energy absorption, corrosion resistance, cost, manufacturing route and safety factor. A material with the greatest breaking stress is not automatically the best choice.</p>
      <div class="exam-box-v3"><strong>Exam language:</strong> stiff ≠ strong ≠ ductile ≠ tough. Use the correct property and evidence from the graph.</div>`
    },
    {
      id:'design-v3', title:'8 · Materials selection & exam interpretation', html:`
      <h2>Choosing a material from data</h2>
      <p>Many exam questions present tables or graphs and ask you to justify a material choice. The best answers link a numerical property to the design requirement.</p>
      <h3>A repeatable decision method</h3><ol><li>Identify the requirement: low mass, small deformation, high breaking stress, energy absorption, etc.</li><li>Choose the property that directly answers that requirement.</li><li>Quote or compare the data.</li><li>State a limitation or trade-off if appropriate.</li></ol>
      <div class="design-scenario"><strong>Example:</strong> A lightweight tension member needs minimal elastic stretch. A useful index is high Young modulus with low density. A crash absorber, however, may prioritise energy absorption and controlled plastic deformation instead.</div>
      <h3>Using graphs precisely</h3><p>If comparing gradients, use axes and units. If comparing fracture, distinguish the stress coordinate from the strain coordinate. If the graph is force–extension rather than stress–strain, remember that geometry still affects the result.</p>
      <h3>Uncertainty in interpretation</h3><p>When two values are close, experimental uncertainty can affect whether the difference is meaningful. Avoid claiming that one value is definitely larger when error bars overlap unless the question provides enough evidence.</p><h3>Ethical transport design</h3><p>Materials and deformation are also linked to energy conservation in transport design. Structures may be designed to deform and absorb kinetic energy in a collision, but this must be balanced against passenger protection, repairability, vehicle mass, resource use and environmental impact. A strong answer distinguishes the physics evidence from the wider ethical decision.</p>`
    },
    {
      id:'rp4-v3', title:'9 · Required Practical 4 master guide', html:`
      <h2>Required Practical 4: determine Young modulus</h2>
      <p>The aim is to determine Young modulus from measurements of force, wire dimensions and extension while the wire remains in the elastic region.</p>
      ${fig('Typical apparatus logic', rpSvg, 'A long test wire and a reference point make small extensions easier to measure. Diameter is measured with a micrometer.')}
      <h3>Core measurements</h3><ol><li>Measure original length L.</li><li>Measure diameter d with a micrometer at several positions and in two perpendicular orientations.</li><li>Calculate the mean diameter and area <button class="equation-link" data-equation="area">A = πd²/4</button>.</li><li>Add known masses gently and calculate force F = mg.</li><li>Measure extension ΔL for each load.</li><li>Stay within the elastic region and repeat readings where possible.</li></ol>
      <h3>Graphical analysis</h3><p>Calculate stress F/A and strain ΔL/L for each reading. Plot stress on the y-axis against strain on the x-axis. The gradient of the linear region is <button class="equation-link" data-equation="young">Young modulus</button>.</p>
      <h3>Why a long wire helps</h3><p>For a given stress and material, strain is fixed. Since ΔL = strain × L, a longer wire gives a larger measurable extension and therefore lowers the percentage uncertainty in extension.</p>
      <h3>Major uncertainty: diameter</h3><p>Area depends on d². If diameter has a fractional uncertainty u, area has approximately 2u fractional uncertainty. Repeated diameter measurements are therefore especially important.</p>
      <h3>Evaluation points</h3><ul><li>Remove kinks and preload gently before zeroing.</li><li>Avoid parallax when reading scales or pointers.</li><li>Use a stable support/reference system.</li><li>Add masses gently to avoid oscillation.</li><li>Use a wide but elastic load range so the gradient is based on a large triangle.</li><li>Check unloading returns close to zero extension.</li></ul>
      <div class="exam-box-v3"><strong>Strong conclusion:</strong> quote E with units, compare with an accepted/order-of-magnitude value if provided, then comment on uncertainty and likely systematic effects.</div>`
    }
  );
})();
