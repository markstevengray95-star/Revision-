(() => {
  const D=window.MATERIALS_DATA,V=window.MATERIALS_V3_VISUALS;if(!D||!V)return;const {fig,densitySvg,hookeSvg,unloadSvg,energySvg,stressSvg,youngSvg,curvesSvg,rpSvg}=V;
  D.textbook=[

    {
      id:'bulk-v3', title:'1 · Density, structure & bulk properties', html:`
      <h2>Density, structure and bulk properties</h2>
      <p>A <strong>bulk property</strong> describes the behaviour of a macroscopic sample. Density is the simplest example: it links how much matter is present to how much space the sample occupies.</p>
      ${fig('Visual model: equal volumes can have different masses', densitySvg, 'If two samples occupy the same volume, the one with the larger mass has the larger density.')}
      <h3>Density</h3><p><button class="equation-link" data-equation="density">ρ = m/V</button></p>
      <p><strong>ρ</strong> is density in kg m⁻³, <strong>m</strong> is mass in kg and <strong>V</strong> is volume in m³. Density is not the same thing as mass: a small piece of a dense metal may have less mass than a large block of wood while still having the greater density.</p>
      <div class="concept-grid"><div><strong>Same volume</strong><span>larger mass → larger density</span></div><div><strong>Same mass</strong><span>smaller volume → larger density</span></div><div><strong>SI unit</strong><span>kg m⁻³</span></div></div>
      <h3>Unit conversions you must control</h3>
      <p>Length conversions must be cubed when converting volume. Since 1 cm = 10⁻² m, <strong>1 cm³ = 10⁻⁶ m³</strong>. A density quoted in g cm⁻³ can be multiplied by 1000 to convert to kg m⁻³.</p>
      <div class="exam-box-v3"><strong>Exam trap:</strong> converting 10 cm³ as 10 × 10⁻² m³ is wrong. Convert cubic units as cubic units.</div>
      <h3>Worked example</h3><p>A sample has mass 78 g and volume 10 cm³. Convert: m = 0.078 kg and V = 10 × 10⁻⁶ m³ = 1.0 × 10⁻⁵ m³. Therefore ρ = 0.078/(1.0 × 10⁻⁵) = <strong>7.8 × 10³ kg m⁻³</strong>.</p>
      <h3>What density can and cannot tell you</h3><p>Density is useful in material selection where mass matters, but it does not tell you whether a material is stiff, strong, tough or brittle. Those require mechanical properties studied later in this topic.</p>`
    },
    {
      id:'hooke-v3', title:'2 · Hooke’s law, stiffness & force–extension', html:`
      <h2>Hooke’s law and force–extension behaviour</h2>
      <p>When a sample is stretched, the applied tensile force can cause an extension. For many systems the first part of the force–extension graph is linear.</p>
      ${fig('Spring and graph model', hookeSvg, 'Within the proportional region, force is directly proportional to extension. The gradient of F against ΔL is k.')}
      <h3>The relationship</h3><p><button class="equation-link" data-equation="hooke">F = kΔL</button></p>
      <p>Hooke’s law is a statement of <strong>proportionality</strong>: extension is directly proportional to applied force provided the limit of proportionality is not exceeded. The equation F = kΔL can be used in that region.</p>
      <h3>Spring constant and stiffness</h3><p>The spring constant <strong>k</strong> is measured in N m⁻¹. A large k means the sample is stiff: a larger force is needed to produce the same extension.</p>
      <h3>Reading graph gradients</h3><ul><li>Force on y-axis, extension on x-axis → gradient = k.</li><li>Extension on y-axis, force on x-axis → gradient = 1/k.</li></ul>
      <h3>Limit of proportionality vs elastic limit</h3><p>The <strong>limit of proportionality</strong> is where F is no longer proportional to ΔL. The <strong>elastic limit</strong> is the greatest load for which the sample returns to its original dimensions when the force is removed. They are related but not identical.</p>
      <div class="exam-box-v3"><strong>Strong exam wording:</strong> “extension is directly proportional to force provided the limit of proportionality is not exceeded.”</div>`
    },
    {
      id:'elastic-plastic-v3', title:'3 · Elastic, plastic, brittle & ductile behaviour', html:`
      <h2>Elastic and plastic deformation</h2>
      <p>Elastic behaviour is defined by what happens <em>after unloading</em>. If the sample returns to its original dimensions, the deformation was elastic. If a permanent extension remains, plastic deformation has occurred.</p>
      ${fig('Loading and unloading', unloadSvg, 'If a sample is taken beyond its elastic limit, unloading can return along a different path and leave a permanent extension.')}
      <h3>Internal interpretation</h3><p>At small deformation, atomic separations are changed reversibly. Beyond the elastic range, parts of the structure rearrange irreversibly, producing permanent deformation.</p>
      <h3>Brittle and ductile materials</h3><p>A <strong>brittle</strong> material fractures with little plastic deformation. A <strong>ductile</strong> material can undergo substantial plastic strain before fracture.</p>
      <div class="concept-grid"><div><strong>Elastic</strong><span>returns to original dimensions</span></div><div><strong>Plastic</strong><span>permanent deformation remains</span></div><div><strong>Brittle</strong><span>little plastic deformation before fracture</span></div><div><strong>Ductile</strong><span>large plastic deformation before fracture</span></div></div>
      <h3>How to prove plastic deformation experimentally</h3><p>Load the sample, remove the load and remeasure its length. A remaining extension provides direct evidence that the elastic limit was exceeded.</p>`
    },
    {
      id:'energy-v3', title:'4 · Elastic strain energy & graph area', html:`
      <h2>Elastic strain energy</h2>
      <p>Work is done when a force moves through a distance. When a spring or wire is stretched elastically, the work done can be stored as elastic strain energy.</p>
      ${fig('Area under the graph', energySvg, 'For Hookean loading from the origin, the area is triangular, giving E = ½FΔL.')}
      <p><button class="equation-link" data-equation="energy1">E = ½FΔL</button> <button class="equation-link" data-equation="energy2">E = ½k(ΔL)²</button></p>
      <h3>Why the factor ½ appears</h3><p>The force does not remain at its final value while stretching. It rises from zero to F, so the mean force for a linear Hookean graph is F/2.</p>
      <h3>General graph rule</h3><p>For any force–extension curve, <strong>area under the graph = work done deforming the sample</strong>. For a curved graph, the energy must be estimated by graphical or numerical area rather than by the triangular expression.</p>
      <h3>Scaling</h3><p>Since E = ½kx², doubling extension at constant k makes the stored energy four times larger.</p><h3>Energy conservation applications</h3><p>Stored spring energy can be transferred into kinetic energy and gravitational potential energy. In real systems some energy may also be transferred internally by damping, air resistance or deformation. AQA can combine elastic energy with conservation-of-energy calculations.</p>
      <div class="exam-box-v3"><strong>Exam trap:</strong> use extension, not total length, in spring-energy equations.</div>`
    }
  ];
})();
