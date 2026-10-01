
(() => {
  'use strict';

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const STORE='particleLessonSequenceV1';

  const lessons=[
    {
      n:1,phase:'Foundations',code:'3.2.1.1',title:'Atomic structure, nuclide notation & isotopes',duration:'50–60 min',
      overview:'Build the language students need for the whole topic: proton, neutron, electron, Z, A, nuclide notation, isotopes, relative/SI particle data and simple isotopic information.',
      objectives:['State proton, neutron and electron charge and mass data in relative and SI form.','Use Z and A correctly in nuclide notation.','Calculate neutron number, identify isotopes and interpret simple isotopic data.'],
      recall:['What particles are found in an atom?','What does atomic number tell you at GCSE?','What does “neutral atom” mean?'],
      teach:[
        ['1. Build the atom','Nucleus = protons + neutrons; electrons occupy the region around it. Emphasise that the 3D model is not to scale.'],
        ['2. Particle data','Proton: +e, about 1 u, 1.673 × 10⁻²⁷ kg. Neutron: 0, about 1 u, 1.675 × 10⁻²⁷ kg. Electron: −e, about 1/1836 u, 9.109 × 10⁻³¹ kg. Use e = 1.602 × 10⁻¹⁹ C.'],
        ['3. Introduce Z and A','Z = proton number. A = nucleon number = protons + neutrons. Neutrons = A − Z.'],
        ['4. Nuclide notation','Practise reading ᴬZX and moving between notation and particle numbers.'],
        ['5. Isotopes and isotopic data','Isotopes have the same Z but different neutron number. Read simple isotopic data to identify the isotope and determine proton, neutron and electron counts.']
      ],
      sim:'atom',simTask:'Use the particle palette on the 3D screen: drag p⁺ and n⁰ into the nucleus and e⁻ into the electron region. Build H-1, C-12, then make C-14 by adding two neutrons without changing Z, before building neutral sodium-23. Say p, n and e before pressing Check my atom.',
      equations:['N = A − Z'],worked:'For ²³₁₁Na: p = 11, n = 12 and a neutral atom has 11 electrons.',
      exam:'“Isotopes are atoms of the same element with the same proton number but different neutron numbers.”',
      exit:['State the charge and approximate relative mass of proton, neutron and electron.','How many neutrons are in ³⁷₁₇Cl?','Why does changing neutron number not change the element?'],
      next:'Specific charge',homework:'Short isotope / nuclide-notation retrieval practice.'
    },
    {
      n:2,phase:'Foundations',code:'3.2.1.1',title:'Specific charge of particles, nuclei & ions',duration:'50–60 min',
      overview:'Turn atomic structure into a quantitative skill by calculating charge per unit mass for particles, nuclei and ions.',
      objectives:['Define specific charge.','Calculate total charge for nuclei and ions.','Use total mass and charge to calculate Q/m with correct units.'],
      recall:['State proton and electron charge.','Which particle has much smaller mass: proton or electron?','What happens to charge when an electron is removed?'],
      teach:[
        ['1. Define specific charge','Specific charge = charge per unit mass, not “charge of one proton”.'],
        ['2. Build total charge','For a nucleus Q = Ze. For ions, use proton number minus electron number.'],
        ['3. Build total mass','Mass is dominated by nucleons; electrons contribute very little.'],
        ['4. Compare e⁻ and p','Same |Q| but electron mass is far smaller, so |Q/m| is much larger.']
      ],
      sim:'specific',simTask:'Create a neutral atom, a +1 ion and a −1 ion. Predict the sign of Q/m before reading the result.',
      equations:['specific charge = Q / m','Q = (Z − Nₑ)e'],worked:'For a +2 ion, find total charge first: Q = +2e = +3.204 × 10⁻¹⁹ C, then divide by the ion mass.',
      exam:'Always state the unit C kg⁻¹ and use the charge/mass of the whole particle being considered.',
      exit:['What is the unit of specific charge?','Why is electron |Q/m| so large?','What sign does Q/m have for an anion?'],
      next:'Strong nuclear force',homework:'Three specific-charge calculations of increasing difficulty.'
    },
    {
      n:3,phase:'Foundations',code:'3.2.1.2',title:'Nuclear stability & the strong nuclear force',duration:'50–60 min',
      overview:'Explain why nuclei can exist despite proton–proton electrostatic repulsion.',
      objectives:['Describe the strong nuclear force as separation changes.','Identify attractive, repulsive and negligible regions.','Explain its role in nuclear stability.'],
      recall:['What force acts between two positive charges?','What length scale is 1 fm?','What particles are nucleons?'],
      teach:[
        ['1. The stability problem','Protons repel electrically, so another interaction is required to bind nuclei.'],
        ['2. Attractive region','Strong nuclear force is attractive over typical nuclear separations up to about 3 fm.'],
        ['3. Very-short-range repulsion','Closer than about 0.5 fm it becomes strongly repulsive.'],
        ['4. Short range','Beyond a few femtometres it becomes negligible.']
      ],
      sim:'strong',simTask:'Move through the repulsive, attractive and negligible regions. Record the separation range for each.',
      equations:[],worked:'At about 1 fm the strong nuclear force is attractive and can overcome proton electrostatic repulsion over this short range.',
      exam:'Use all three words in extended answers: “repulsive very close, attractive at nuclear separations, negligible beyond a few fm.”',
      exit:['At 0.3 fm, is the force attractive or repulsive?','At 1 fm?','Why does the force not bind separate atoms together?'],
      next:'Radioactive decay',homework:'Sketch and annotate force vs separation qualitatively.'
    },
    {
      n:4,phase:'Foundations',code:'3.2.1.2',title:'Alpha decay, beta-minus decay & the neutrino',duration:'50–60 min',
      overview:'Complete the AQA 3.2.1.2 core by learning how unstable nuclei change in alpha and beta-minus decay, and why the neutrino was proposed.',
      objectives:['Balance alpha and beta-minus nuclear equations.','State how A and Z change in α and β⁻ decay.','Explain why the neutrino was proposed from beta-decay evidence.'],
      recall:['What do A and Z represent?','What is an alpha particle?','Which quantities must remain conserved in a decay?'],
      teach:[
        ['1. Alpha decay','An alpha particle is a helium-4 nucleus, ⁴₂He. Emitting one makes A decrease by 4 and Z decrease by 2.'],
        ['2. Beta-minus decay','A neutron changes to proton character and an electron plus electron antineutrino are emitted. A is unchanged and Z increases by 1.'],
        ['3. Why the neutrino?','The neutrino was proposed because beta-decay observations required an unseen particle to account for the missing energy.'],
        ['4. Keep the specification sequence clear','β⁺, electron capture and electron–proton collisions are taught later under AQA 3.2.1.4 particle interactions, where W⁺ and W⁻ exchange is introduced.']
      ],
      sim:'decay',simTask:'Run α and β⁻ first. Before each animation, predict the change in A and Z and identify every emitted particle. Use β⁺ later when you reach the particle-interactions lesson.',
      equations:['α: ᴬZX → ᴬ⁻⁴Z⁻²Y + ⁴₂He','β⁻: n → p + e⁻ + ν̄ₑ'],worked:'In β⁻ decay the mass number A stays the same while Z increases by 1 because neutron character changes to proton character.',
      exam:'For AQA 3.2.1.2, be precise: α changes A and Z; β⁻ leaves A unchanged, increases Z by 1 and emits an electron antineutrino. The beta electron is created in the decay.',
      exit:['What happens to A and Z in alpha decay?','What happens to A and Z in β⁻ decay?','Why was the neutrino proposed?'],
      next:'Antiparticles & photons',homework:'Balance alpha and beta-minus decay equations, then explain the neutrino evidence in one sentence.'
    },
    {
      n:5,phase:'Particle physics',code:'3.2.1.3',title:'Photons, rest energy & antiparticles',duration:'50–60 min',
      overview:'Introduce the photon model and the idea that every particle has a corresponding antiparticle.',
      objectives:['Use E = hf and E = hc/λ for photons.','Compare particle and antiparticle properties.','Interpret particle rest energies quoted in MeV without treating E = mc² as a required AQA calculation here.'],
      recall:['What is frequency?','What is wavelength?','What does c represent?'],
      teach:[
        ['1. Photon model','EM radiation is exchanged in quanta called photons, with energy hf.'],
        ['2. Rest energy','Mass has rest energy E₀ = mc²; particle rest energies are often quoted in MeV.'],
        ['3. Antiparticle pairs','Same mass/rest energy; opposite relevant additive quantum numbers.'],
        ['4. Key examples','e⁻/e⁺, p/p̄, n/n̄ and ν/ν̄. Neutral does not mean “same particle”.']
      ],
      sim:'antimatter',simTask:'Use comparison mode to inspect electron/positron, proton/antiproton and neutron/antineutron pairs.',
      equations:['E = hf','E = hc / λ'],worked:'Electron rest energy is 0.511 MeV, so an electron + positron pair has 1.022 MeV of rest energy in total.',
      exam:'Know that a particle and antiparticle have equal mass and opposite charge when charged, and recognise their rest energies in MeV. Do not reduce the definition to “opposite charge” because neutral particles can have distinct antiparticles.',
      exit:['What stays the same for a particle and antiparticle?','What is a photon’s energy equation?','Why is an antineutron distinct from a neutron?'],
      next:'Annihilation & pair production',homework:'Photon-energy calculations in J and eV.'
    },
    {
      n:6,phase:'Particle physics',code:'3.2.1.3',title:'Annihilation & pair production',duration:'50–60 min',
      overview:'Apply rest energy, photon energy and momentum conservation to matter–antimatter processes.',
      objectives:['Describe annihilation and pair production.','Calculate the minimum energy for e⁻/e⁺ pair creation.','Explain why momentum conservation matters.'],
      recall:['What is the rest energy of one electron?','State E = hf.','What quantities are conserved in interactions?'],
      teach:[
        ['1. Annihilation','Particle + antiparticle energy becomes other particles; use e⁻/e⁺ → γ + γ as the key example.'],
        ['2. Minimum energy','Slow e⁻ + e⁺ provide 1.022 MeV total rest energy.'],
        ['3. Pair production','A sufficiently energetic photon can create e⁻ + e⁺ near another body.'],
        ['4. Momentum','The nearby nucleus/body can recoil, making momentum conservation possible.']
      ],
      sim:'antimatter',simTask:'Run annihilation, then pair production. Explain the energy flow and why momentum must be considered.',
      equations:['minimum e⁻/e⁺ rest energy = 2 × 0.511 MeV = 1.022 MeV'],worked:'If a photon has 1.50 MeV, 1.022 MeV can become rest energy and the remainder can appear as kinetic/recoil energy.',
      exam:'For slow e⁻/e⁺ annihilation, two photons are commonly shown moving oppositely so momentum can be conserved.',
      exit:['What is the pair-production threshold for e⁻/e⁺?','Why is a nearby nucleus useful?','Where can energy above threshold go?'],
      next:'Fundamental interactions',homework:'One annihilation and one pair-production calculation.'
    },
    {
      n:7,phase:'Particle physics',code:'3.2.1.4',title:'Fundamental interactions & exchange particles',duration:'50–60 min',
      overview:'Move from “forces” to the exchange-particle model used in particle physics.',
      objectives:['Name the four fundamental interactions.','Identify the AQA exchange particles for EM and weak interactions.','Read simple particle-interaction diagrams.'],
      recall:['Which forces are familiar from GCSE?','What is transferred in a collision?','What did beta decay do to neutron/proton character?'],
      teach:[
        ['1. Four interactions','Gravity, electromagnetic, weak and strong.'],
        ['2. Exchange idea','Interactions can be represented by exchange particles carrying energy/momentum.'],
        ['3. Electromagnetic','Virtual photon is the AQA exchange particle.'],
        ['4. Weak interaction','W⁺ and W⁻ appear in β⁻, β⁺, electron capture and electron–proton processes.']
      ],
      sim:'interactions',simTask:'Switch through EM and each weak process. Identify incoming, exchange and outgoing particles.',
      equations:[],worked:'At quark level in β⁻: d → u + W⁻, then W⁻ → e⁻ + ν̄ₑ.',
      exam:'AQA does not test gluon, Z⁰ or graviton knowledge in this section.',
      exit:['Exchange particle for EM?','Which W appears in β⁻?','What three parts should you identify in an interaction diagram?'],
      next:'Classifying particles',homework:'Label four simple exchange-particle diagrams.'
    },
    {
      n:8,phase:'Particle physics',code:'3.2.1.5',title:'Classifying particles: hadrons, leptons & strange particles',duration:'50–60 min',
      overview:'Build the family tree before introducing quark structure.',
      objectives:['Classify particles as hadrons or leptons.','Split hadrons into baryons and mesons.','Describe strange-particle production and decay.'],
      recall:['Do protons feel the strong interaction?','Name an electron-family lepton.','What is an antiparticle?'],
      teach:[
        ['1. Hadrons vs leptons','Hadrons experience the strong interaction; leptons do not.'],
        ['2. Baryons','Proton, neutron and antibaryons. Proton is the stable baryon in the AQA classification statement.'],
        ['3. Mesons','Pions and kaons. Pions also appear in the nucleon strong-force exchange model.'],
        ['4. Lepton families and lepton number','Electron/electron-neutrino form one lepton family and muon/muon-neutrino another. Particles have family lepton number +1 and antiparticles −1; track electron and muon lepton numbers separately.'],
        ['5. Strange particles','Produced through strong interaction, typically in pairs so total strangeness is conserved; they decay through the weak interaction.'],
        ['6. Pions, muons & scientific evidence','Pion is the AQA exchange particle for the strong nuclear force between nucleons. Muons decay to products including an electron. Modern particle physics depends on large collaborations reproducing and validating results.']
      ],
      sim:'classification',simTask:'Sort each displayed particle into the full family: e.g. proton = hadron + baryon.',
      equations:[],worked:'K⁺ is a hadron and meson. It is strange because its quark content includes s̄ and it has non-zero strangeness. In strong production, total strangeness is conserved, so strange particles are created with balancing strangeness.',
      exam:'Give the full classification when asked, not just one family label.',
      exit:['Is a pion a baryon or meson, and what role does AQA assign it in the nucleon strong-force model?','What happens when a muon decays?','How are strange particles produced and how do they decay?'],
      next:'Quarks & antiquarks',homework:'Complete a particle-family classification table.'
    },
    {
      n:9,phase:'Particle physics',code:'3.2.1.6',title:'Quarks, antiquarks & hadron structure',duration:'50–60 min',
      overview:'Use u, d and s quarks to explain the particles students classified last lesson.',
      objectives:['Recall u, d and s quantum numbers.','Build proton, neutron, pions and kaons.','Calculate total charge, baryon number and strangeness.'],
      recall:['What is a baryon?','What is a meson?','What is strangeness?'],
      teach:[
        ['1. Quark properties','u: +2/3e; d and s: −1/3e. All quarks B = +1/3.'],
        ['2. Antiquarks','Reverse additive quantum numbers: charge, B and strangeness.'],
        ['3. Baryons','Proton = uud; neutron = udd. Antibaryons contain three antiquarks.'],
        ['4. Mesons','One quark + one antiquark; practise pions and kaons.'],
        ['5. Neutron decay at quark level','A neutron udd becomes a proton uud when one down quark changes to an up quark: d → u. The full weak-interaction detail and W⁻ diagram are then connected back to the interactions lesson.']
      ],
      sim:'quarks',simTask:'Build p, n, π⁺, π⁻, K⁺ and K⁻. Predict Q, B and S before reading the totals.',
      equations:['p = uud','n = udd','quark B = +1/3','antiquark B = −1/3'],worked:'π⁺ = u d̄: charge = +2/3e + +1/3e = +e; B = +1/3 − 1/3 = 0.',
      exam:'Write the constituent values first, then add Q, B and S. This reduces sign errors.',
      exit:['State proton and neutron quark content, then give the quark change in neutron β⁻ decay.','What is B for a meson?','What is S for an anti-strange quark?'],
      next:'Conservation laws & reactions',homework:'Quark-content and quantum-number calculations.'
    },
    {
      n:10,phase:'Particle physics',code:'3.2.1.7',title:'Conservation laws & particle reactions',duration:'50–60 min',
      overview:'Bring classification, quarks and weak interactions together to decide whether particle reactions are allowed.',
      objectives:['Apply conservation of charge, baryon number and lepton number.','Apply strangeness rules to strong and weak interactions.','Recognise quark-character changes in beta decay.'],
      recall:['What is B for a quark?','What is electron lepton number for e⁻ and νₑ?','When is strangeness conserved?'],
      teach:[
        ['1. Conservation method','Create left and right totals for one quantum number at a time.'],
        ['2. Charge and B','Always conserved in the interactions studied.'],
        ['3. Lepton families','Track electron and muon lepton numbers separately.'],
        ['4. Strangeness','Conserved in strong interactions; may change by 0 or ±1 in weak interactions.'],
        ['5. Beta at quark level','β⁻: d → u; β⁺: u → d.']
      ],
      view:'conserve',viewLabel:'Open conservation-law checker',simTask:'Test each built-in reaction one quantum number at a time. Explain why allowed/forbidden examples differ.',
      equations:['ΣQ before = ΣQ after','ΣB before = ΣB after','ΣL before = ΣL after'],worked:'n → p + e⁻ + ν̄ₑ: charge 0 = +1 −1 +0; B 1 = 1; electron L 0 = +1 −1.',
      exam:'Do not judge a reaction by charge alone. A reaction can conserve charge but fail baryon or lepton number.',
      exit:['Which quantities must you check?','When is strangeness conserved?','What quark change occurs in β⁻ decay?'],
      next:'Photoelectric effect',homework:'Allowed/not-allowed reaction questions with full working.'
    },
    {
      n:11,phase:'Quantum phenomena',code:'3.2.2.1',title:'Photoelectric effect',duration:'50–60 min',
      overview:'Use experimental observations to build the photon model of electromagnetic radiation.',
      objectives:['Explain threshold frequency using photons.','Use hf = φ + KEmax and KEmax = eVs.','Distinguish effects of frequency and intensity.'],
      recall:['State E = hf.','What is a photon?','What does kinetic energy mean?'],
      teach:[
        ['1. Observations','Below threshold frequency: no emission. Above it: immediate emission.'],
        ['2. One photon–one electron','Each electron absorbs one photon of energy hf.'],
        ['3. Work function','Minimum energy needed to remove an electron from the metal.'],
        ['4. Frequency vs intensity','Frequency changes photon energy; intensity mainly changes photon rate.'],
        ['5. Stopping potential','eVs = KEmax for the fastest photoelectrons.']
      ],
      sim:'photo',simTask:'Find threshold frequency for two work functions. Then hold frequency fixed and vary intensity.',
      equations:['E = hf','hf = φ + KEmax','KEmax = eVs','f₀ = φ / h'],worked:'Photon energy 4.0 eV, φ = 2.3 eV → KEmax = 1.7 eV and Vs = 1.7 V.',
      exam:'Never say “greater intensity gives more energetic photons” when frequency is unchanged.',
      exit:['What determines photon energy?','What happens below threshold frequency?','How is stopping potential linked to KEmax?'],
      next:'Electron collisions & eV',homework:'Photoelectric calculations and one explanation question.'
    },
    {
      n:12,phase:'Quantum phenomena',code:'3.2.2.2',title:'Electron collisions, excitation, ionisation & the electron volt',duration:'50–60 min',
      overview:'Connect energy transfer in collisions to quantised atomic energies.',
      objectives:['Distinguish excitation from ionisation.','Explain threshold behaviour in electron collisions.','Convert between eV and J.'],
      recall:['What is an energy level?','What is ionisation at GCSE?','State elementary charge e.'],
      teach:[
        ['1. Excitation','Electron remains bound but moves to a higher allowed energy.'],
        ['2. Quantised transfer','For excitation, energy transfer must match an allowed level difference.'],
        ['3. Ionisation','Enough energy removes an electron completely.'],
        ['4. Electron volt','1 eV = 1.602 × 10⁻¹⁹ J. Practise both directions.'],
        ['5. Fluorescent tube','Collision → excitation/ionisation → de-excitation → photon emission.']
      ],
      sim:'collisions',simTask:'Find the no-change, excitation and ionisation regions. Explain what happens to leftover incident-electron KE.',
      equations:['1 eV = 1.602 × 10⁻¹⁹ J'],worked:'10 eV = 10 × 1.602 × 10⁻¹⁹ J = 1.602 × 10⁻¹⁸ J.',
      exam:'Excitation leaves the atomic electron bound. Ionisation removes it completely.',
      exit:['Define excitation.','Define ionisation.','Convert 5 eV to joules.'],
      next:'Energy levels & line spectra',homework:'eV/J conversions plus excitation/ionisation explanations.'
    },
    {
      n:13,phase:'Quantum phenomena',code:'3.2.2.3',title:'Energy levels, photons & line spectra',duration:'50–60 min',
      overview:'Explain why atomic spectra contain discrete lines rather than a continuous range.',
      objectives:['Interpret energy-level diagrams.','Calculate photon energy/frequency/wavelength from ΔE.','Explain why line spectra support discrete energy levels.'],
      recall:['What does excitation mean?','State E = hf.','What happens when an electron loses energy?'],
      teach:[
        ['1. Discrete levels','Only particular bound energies are allowed.'],
        ['2. Downward transitions','Energy lost becomes one photon with ΔE = hf.'],
        ['3. Upward transitions','Absorption requires the correct photon energy.'],
        ['4. Line spectra','Only certain ΔE values exist, so only certain photon wavelengths are emitted.'],
        ['5. Units','Levels may be given in J or eV; convert when necessary.']
      ],
      sim:'levels',simTask:'Compare several downward transitions. Rank them by photon energy and wavelength before checking.',
      equations:['ΔE = hf','ΔE = hc / λ'],worked:'Larger ΔE means higher photon frequency and shorter wavelength.',
      exam:'The horizontal lines are allowed energies, not physical electron orbits.',
      exit:['Why are spectra lines discrete?','What happens in a downward transition?','Which transition gives the shortest wavelength?'],
      next:'Wave–particle duality',homework:'Energy-level diagram and spectral-line questions.'
    },
    {
      n:14,phase:'Quantum phenomena',code:'3.2.2.4',title:'Wave–particle duality & electron diffraction',duration:'50–60 min',
      overview:'Finish the core topic by combining particle evidence for light with wave evidence for matter.',
      objectives:['Explain what electron diffraction demonstrates.','Use λ = h/p.','Predict how diffraction changes as momentum changes.'],
      recall:['What did the photoelectric effect show about light?','What phenomenon is usually associated with waves?','State momentum p for non-relativistic motion.'],
      teach:[
        ['1. Evidence for matter waves','Electron diffraction is wave-like behaviour from particles.'],
        ['2. de Broglie relation','λ = h/p applies wavelength to moving particles.'],
        ['3. Momentum trend','Higher p → shorter λ.'],
        ['4. Diffraction trend','For the same structure, shorter λ generally means less diffraction / tighter pattern.'],
        ['5. Duality','Quantum objects are not simply classical waves or classical particles.'],
        ['6. How knowledge changes','New models are evaluated through evidence, peer review, replication and validation by the scientific community.']
      ],
      sim:'diffraction',simTask:'Increase accelerating voltage and explain the chain V ↑ → p ↑ → λ ↓ → pattern changes.',
      equations:['λ = h / p','p = mv'],worked:'If momentum doubles, de Broglie wavelength halves.',
      exam:'Electron diffraction gives wave evidence for matter; photoelectric effect gives particle evidence for EM radiation. Details of a particular electron-diffraction method are not required by AQA, but the evidence and momentum trend are.',
      exit:['What does λ = h/p predict?','What happens to λ as p rises?','Give one experiment supporting each side of wave–particle duality.'],
      next:'Synoptic review',homework:'Mixed wave–particle duality questions.'
    },
    {
      n:15,phase:'Consolidation',code:'3.2 mixed',title:'Synoptic Particles & Radiation review',duration:'50–60 min',
      overview:'Bring the whole core topic together before moving on.',
      objectives:['Connect particle physics and quantum phenomena.','Identify weak areas using the mastery map.','Answer mixed short and extended questions under timed conditions.'],
      recall:['List the 11 AQA 3.2 subsection headings from memory or reconstruct them.','Write every core equation you can remember.','Name three common misconceptions you now know to avoid.'],
      teach:[
        ['1. Retrieval grid','Atoms → nuclei → antiparticles → interactions → classification → quarks → conservation.'],
        ['2. Quantum chain','Photoelectric effect → electron collisions → energy levels → diffraction.'],
        ['3. Mixed maths','Specific charge, photons, eV/J, energy levels and de Broglie wavelength.'],
        ['4. Exam technique','Use definitions precisely and always link observations to physics principles.']
      ],
      view:'quiz',viewLabel:'Open mixed practice quiz',simTask:'Complete a mixed quiz, then open the Mastery Map and revisit one red/amber area.',
      equations:['Q/m','E = hf','hf = φ + KEmax','ΔE = hf','λ = h/p','1 eV = 1.602 × 10⁻¹⁹ J'],
      worked:'For any unfamiliar reaction: classify particles, list quantum numbers, then test conservation one quantity at a time.',
      exam:'Use the simulation explanations to revise, but practise expressing the physics without relying on the visual.',
      exit:['Which three subtopics are strongest?','Which one still needs revision?','Can you explain one simulation in exam language without looking?'],
      next:'Optional Rutherford extension',homework:'Targeted revision from the mastery map.'
    },
    {
      n:16,phase:'A-level extension',code:'3.8.1.1',title:'Rutherford scattering & development of the nuclear model',duration:'50–60 min',extension:true,
      overview:'Optional extension beyond core 3.2: use alpha scattering evidence to explain why the nuclear model replaced diffuse-positive-charge models.',
      objectives:['State the qualitative Rutherford observations.','Link each observation to an inference about atomic structure.','Explain how impact parameter affects deflection qualitatively.'],
      recall:['What is an alpha particle?','What electric charges do alpha particle and nucleus have?','What does “mostly empty space” mean in atomic structure?'],
      teach:[
        ['1. Old-model prediction','A diffuse positive charge would mainly cause small deflections.'],
        ['2. Key observations','Most straight; some deflected; very few scattered through large angles/backwards.'],
        ['3. Evidence → model','Mostly empty space; positive charge and most mass concentrated in tiny nucleus.'],
        ['4. Impact parameter','Smaller b → closer approach → stronger electrostatic repulsion → larger angle.'],
        ['5. Scientific models','Evidence can force a model to be replaced or refined.']
      ],
      sim:'rutherford',simTask:'Use both Rutherford models. Change impact parameter and explain every trajectory using Coulomb repulsion.',
      equations:['smaller b → larger scattering angle','electrostatic force increases strongly at small separation'],worked:'“Very few alpha particles scatter backwards” means only a tiny fraction come close to a very small, highly concentrated positive nucleus.',
      exam:'Write observation first, inference second. Do not merge them into one vague statement.',
      exit:['Why do most alpha particles pass straight through?','Why are large-angle events rare?','What does a smaller impact parameter do?'],
      next:'Nuclear Physics',homework:'Optional Rutherford exam-style explanation.',
    }
  ];

  

  const lessonTaskBank={
    1:[
      ['Particle ID','State the charge of a proton, neutron and electron.','p = +e, n = 0, e⁻ = −e.'],
      ['Particle mass scale','Compare the approximate relative masses of proton, neutron and electron.','Proton ≈ 1 u, neutron ≈ 1 u, electron ≈ 1/1836 u. In SI, electron mass is about 9.11 × 10⁻³¹ kg while nucleons are about 1.67 × 10⁻²⁷ kg.'],
      ['Read nuclide notation','For ²³₁₁Na, state Z and A.','Z = 11 and A = 23.'],
      ['Find neutrons','How many neutrons are in ²³₁₁Na?','A − Z = 23 − 11 = 12 neutrons.'],
      ['Neutral atom','How many electrons are in neutral ²³₁₁Na?','11 electrons because a neutral atom has electrons = protons.'],
      ['Isotope reasoning','What changes between ¹²₆C and ¹⁴₆C?','Neutron number changes from 6 to 8; proton number stays 6.'],
      ['Ion reasoning','What changes when ²³Na becomes Na⁺?','Only electron number changes: 11 → 10. The nucleus is unchanged.']
    ],
    2:[
      ['Sign first','Predict the sign of Q/m for a +2 ion.','Positive, because Q is positive.'],
      ['Whole particle','Why must total ion mass be used in Q/m?','Specific charge is charge per unit mass of the whole particle.'],
      ['Compare','Why is |Q/m| far greater for an electron than a proton?','Same |Q| but electron mass is much smaller.']
    ],
    3:[
      ['Three regions','Describe the strong force at 0.3 fm, 1 fm and 4 fm.','Repulsive; attractive; negligible.'],
      ['Nuclear stability','Why does the nucleus not simply fly apart from proton repulsion?','At nuclear distances the attractive strong force can overcome electrostatic repulsion.'],
      ['Explain range','Why does the strong force not bind separate atoms?','It is very short range and negligible beyond a few fm.']
    ],
    4:[
      ['Balance α','A parent has A = 226 and Z = 88. Find daughter A and Z after α decay.','A = 222, Z = 86.'],
      ['Balance β⁻','What happens to A and Z in β⁻ decay?','A unchanged, Z +1.'],
      ['Neutrino','Why is a neutrino/antineutrino included in beta decay?','To satisfy conservation laws including energy, momentum and lepton number.']
    ],
    5:[
      ['Same / opposite','Give two properties shared by particle and antiparticle.','Same mass and same rest energy.'],
      ['Photon maths','What happens to photon energy if frequency doubles?','Photon energy doubles because E = hf.'],
      ['Neutral antiparticle','Why can a neutral particle still have a distinct antiparticle?','Antiparticle identity also depends on additive quantum numbers, not charge alone.']
    ],
    6:[
      ['Threshold','Minimum rest energy for e⁻e⁺ pair creation?','1.022 MeV.'],
      ['Extra energy','A photon has energy above threshold. Where can the extra energy go?','Into kinetic energy and recoil while conserving momentum.'],
      ['Two photons','Why are two photons commonly shown in slow e⁻e⁺ annihilation?','Opposite photon momenta can conserve total momentum.']
    ],
    7:[
      ['EM exchange','Name the AQA exchange particle for EM interactions.','Virtual photon.'],
      ['Weak exchange','Which W boson appears in β⁻ decay?','W⁻.'],
      ['Read a diagram','What three things should you identify first?','Incoming particles, exchange particle and outgoing particles.']
    ],
    8:[
      ['Full class','Classify a proton fully.','Hadron → baryon.'],
      ['Meson','Classify a pion fully.','Hadron → meson.'],
      ['Lepton families','State electron and muon lepton numbers for e⁻, νₑ, μ⁻ and νμ, and explain what happens for antiparticles.','Each listed particle has +1 in its own lepton family and 0 in the other; the corresponding antiparticle has −1 in its own family.'],
      ['Strange particles','How are strange particles typically produced and how do they decay?','Produced via strong interaction; decay via weak interaction.']
    ],
    9:[
      ['Proton charge','Show that uud has charge +e.','+2/3 +2/3 −1/3 = +1 e.'],
      ['Meson B','Why does a meson have B = 0?','Quark +1/3 plus antiquark −1/3 = 0.'],
      ['Strangeness','What is S for s and s̄?','s has S = −1; s̄ has S = +1.'],
      ['Neutron decay','Use quark content to explain the neutron-to-proton change in β⁻ decay.','Neutron udd becomes proton uud because one d quark changes to u: d → u.']
    ],
    10:[
      ['Conservation list','Name the key quantities to check in a particle reaction.','Charge, baryon number, lepton number, energy, momentum and strangeness where relevant.'],
      ['β⁻ quark change','What quark changes in β⁻ decay?','d → u.'],
      ['Strong strangeness','What happens to total strangeness in a strong interaction?','It is conserved.']
    ],
    11:[
      ['Threshold','Why can intense low-frequency light still fail to emit electrons?','Each photon has hf < φ, so no photon has enough energy.'],
      ['Frequency','What happens to KEmax as frequency rises above threshold?','KEmax increases because hf = φ + KEmax.'],
      ['Intensity','What mainly changes when intensity rises at fixed frequency?','Photon arrival rate and therefore photoelectron emission rate.']
    ],
    12:[
      ['Excitation','Define excitation.','A bound electron moves to a higher allowed energy level.'],
      ['Ionisation','Define ionisation.','An electron is removed from the atom.'],
      ['Convert','Convert 10 eV to joules.','1.602 × 10⁻¹⁸ J.']
    ],
    13:[
      ['Photon from level','What happens in a downward energy transition?','A photon is emitted with energy equal to ΔE.'],
      ['Spectrum','Why are line spectra discrete?','Only certain allowed energy differences exist.'],
      ['Trend','Which gives shorter wavelength: large or small ΔE?','Large ΔE gives higher f and shorter λ.']
    ],
    14:[
      ['Equation','State the de Broglie relation.','λ = h/p.'],
      ['Momentum trend','What happens to λ if p doubles?','λ halves.'],
      ['Evidence pair','Give one particle-like and one wave-like piece of evidence.','Photoelectric effect for photons; electron diffraction for matter waves.']
    ],
    15:[
      ['Equation dump','Write five core equations without notes.','Examples: Q/m, E = hf, hf = φ + KEmax, ΔE = hf, λ = h/p.'],
      ['Link topics','How do electron collisions connect to line spectra?','Collisions excite atoms; de-excitation emits photons at discrete ΔE values.'],
      ['Self diagnosis','Choose one weak area and explain exactly what you still confuse.','Use the Mastery Map/Error Log to target the gap.']
    ],
    16:[
      ['Observation → inference','Most α particles pass straight through. What does this imply?','Most of the atom is empty space.'],
      ['Rare event','Why are large-angle deflections rare?','Only a small fraction pass very close to the tiny nucleus.'],
      ['Impact parameter','What happens as impact parameter decreases?','Closer approach gives stronger electrostatic repulsion and larger scattering angle.']
    ]
  };

  const lessonChunkDetail={
    1:[
      'The nucleus contains almost all of the atomic mass. Electrons occupy the much larger surrounding region; the teaching model is deliberately not drawn to scale.',
      'Use both relative and SI data confidently: proton charge +e, electron charge −e, neutron charge 0; electron mass is tiny compared with a nucleon.',
      'Z fixes the element because it counts protons. A counts all nucleons, so neutron number is always A − Z.',
      'Read nuclide notation systematically: element symbol identifies the species, lower number is Z and upper number is A.',
      'Isotopes keep the same proton number but change neutron number. Losing or gaining electrons makes ions, not new isotopes.'
    ],
    2:[
      'Specific charge compares electrical charge with total mass, so it is a ratio with units C kg⁻¹ rather than just a charge value.',
      'For nuclei Q = Ze. For ions, count protons and electrons separately so the sign of the net charge is correct before dividing by mass.',
      'For nuclei and ordinary ions, almost all mass comes from nucleons. Electron mass usually makes a negligible contribution at this level.',
      'Electron and proton have equal charge magnitude but enormously different masses, which is why the electron has the much larger magnitude of specific charge.'
    ],
    3:[
      'Without another interaction, positively charged protons would repel and nuclei could not remain bound. The strong nuclear force solves this stability problem at nuclear distances.',
      'At typical nucleon separations the strong force is attractive and can exceed electrostatic repulsion between protons.',
      'At extremely small separation the force becomes strongly repulsive, helping prevent nucleons collapsing into the same tiny region.',
      'The strong nuclear force has a very short range, becoming negligible beyond a few femtometres; this is why it does not bind separate atoms together.'
    ],
    4:[
      'An alpha particle is a helium-4 nucleus containing two protons and two neutrons, so alpha emission changes both A and Z in a predictable way.',
      'In beta-minus decay neutron character changes to proton character. The emitted beta electron is created in the decay; it was not orbiting inside the nucleus.',
      'The neutrino hypothesis explained why beta-decay measurements appeared to lose energy and momentum. An electron antineutrino accompanies beta-minus decay.',
      'Keep the specification boundary clear: beta-plus, electron capture and electron–proton interactions are revisited with weak interactions and W bosons.'
    ],
    5:[
      'A photon is a quantum of electromagnetic radiation. Its energy depends on frequency, not intensity, through E = hf.',
      'Rest energy is the energy associated with mass. Particle rest energies are commonly quoted in electronvolts or MeV in particle physics.',
      'A particle and its antiparticle have the same mass and rest energy but opposite additive quantum numbers; charged pairs also have opposite charge.',
      'Neutral particles can still have distinct antiparticles, so “antiparticle means opposite charge” is not a complete definition.'
    ],
    6:[
      'Annihilation converts the available rest and kinetic energy of a particle–antiparticle pair into other particles, commonly photons for an electron–positron pair.',
      'Creating an electron and positron requires at least twice the electron rest energy: 2 × 0.511 MeV = 1.022 MeV.',
      'Pair production is the reverse idea: photon energy becomes particle rest energy and kinetic energy, with another body nearby to help conserve momentum.',
      'Energy conservation alone is not enough. Total momentum must also balance, which is why recoil or two oppositely directed photons matter.'
    ],
    7:[
      'The four fundamental interactions are gravitational, electromagnetic, weak and strong. Particle physics questions mainly focus on the latter three here.',
      'Exchange-particle diagrams are models of interactions: identify incoming particles, the exchanged boson and outgoing particles before doing any conservation analysis.',
      'Electromagnetic interactions are represented using virtual photons in this part of the AQA course.',
      'Weak interactions use W⁺ or W⁻ exchange in the processes studied, including beta decay, electron capture and electron–proton collisions.'
    ],
    8:[
      'Hadrons experience the strong interaction; leptons do not. This is the first split to make when classifying a particle.',
      'Baryons are hadrons made from three quarks; antibaryons contain three antiquarks. Proton and neutron are the key examples.',
      'Mesons are hadrons made from a quark–antiquark pair. Pions and kaons are the main AQA examples.',
      'Electron and muon families have separate lepton numbers. Track each family independently in particle reactions.',
      'Strange particles are produced through the strong interaction with total strangeness conserved, but they decay through the weak interaction.',
      'Pions model the exchange responsible for the strong nuclear force between nucleons; muon decay and collaborative evidence illustrate how particle ideas are tested.'
    ],
    9:[
      'Up quarks carry +2/3e, while down and strange carry −1/3e. Every quark has baryon number +1/3.',
      'Antiquarks reverse additive quantum numbers such as charge, baryon number and strangeness. The bar notation must be read carefully.',
      'A baryon contains three quarks. Adding the quark charges for uud gives +e for the proton and udd gives 0 for the neutron.',
      'A meson contains one quark and one antiquark, so its total baryon number is zero.',
      'In neutron beta-minus decay one down quark changes into an up quark, changing udd into uud while the weak interaction carries away the other products.'
    ],
    10:[
      'A reliable conservation method is to total one quantity at a time on each side of the reaction rather than trying to judge the whole equation at once.',
      'Charge and baryon number must balance in every reaction studied. Baryon number is especially useful for spotting impossible reactions.',
      'Track electron and muon lepton numbers separately; a reaction can conserve total charge yet still violate a lepton-family number.',
      'Strangeness is conserved in strong interactions. In weak interactions it may change by 0 or ±1 in the processes required here.',
      'At quark level beta-minus changes d → u, while beta-plus changes u → d. Link the quark change to the W boson and emitted leptons.'
    ],
    11:[
      'The key observations are immediate emission above a threshold frequency and no emission below it, however intense the light is.',
      'The photon model treats absorption as one photon transferring its energy to one electron, which explains the threshold behaviour.',
      'The work function φ is the minimum energy needed to remove an electron from the metal surface.',
      'Frequency changes energy per photon; intensity mainly changes the number of photons arriving each second at fixed frequency.',
      'Stopping potential measures the maximum photoelectron kinetic energy using eVₛ = KEmax, linking an electrical measurement to the photon model.'
    ],
    12:[
      'Excitation moves a bound electron to a higher allowed energy level while leaving it inside the atom.',
      'Because atomic energy levels are discrete, excitation requires specific energy transfers rather than any arbitrary amount.',
      'Ionisation removes an electron completely. The transferred energy must be at least the ionisation energy from the starting state.',
      'One electronvolt is the energy transferred when one electron moves through a potential difference of one volt: 1 eV = 1.602 × 10⁻¹⁹ J.',
      'In a fluorescent tube, energetic electrons excite mercury atoms; de-excitation produces ultraviolet photons that the coating converts to visible light.'
    ],
    13:[
      'Atomic electrons can occupy only allowed energy levels. The gaps between levels determine the photon energies that can be absorbed or emitted.',
      'A downward transition releases a photon with energy equal to the energy-level difference, ΔE = hf.',
      'An upward transition requires absorption of exactly the right energy or an inelastic collision transferring enough energy.',
      'Discrete energy differences produce discrete spectral lines. Each line corresponds to a particular transition.',
      'Convert energy units carefully before using equations: joules are SI, while electronvolts are convenient for atomic-scale energies.'
    ],
    14:[
      'Electron diffraction is direct evidence that particles with mass can show wave behaviour when their wavelength is comparable with a lattice spacing.',
      'The de Broglie relation λ = h/p links a particle property, momentum, with a wave property, wavelength.',
      'Increasing momentum decreases de Broglie wavelength. For non-relativistic electrons, greater accelerating voltage generally gives greater momentum.',
      'A shorter wavelength produces smaller diffraction angles for the same crystal spacing, so the diffraction pattern tightens as momentum increases.',
      'Wave–particle duality means neither a purely classical particle model nor a purely classical wave model explains every observation.',
      'Scientific models change when new evidence demands it; replication, peer review and large collaborations are central to modern particle physics.'
    ],
    15:[
      'Retrieval should mix equations, definitions and qualitative explanations so students practise choosing knowledge rather than only recognising it.',
      'Connect the quantum chain: electron collisions excite atoms, de-excitation emits photons, and discrete ΔE values create line spectra.',
      'Mixed calculations require choosing the correct equation, converting units and stating a sensible final unit before substituting values.',
      'Strong exam answers identify the physics principle first, apply it to the context, then use precise AQA terminology and a clear logical chain.'
    ],
    16:[
      'Before Rutherford scattering, a diffuse positive-charge model predicted only small deflections for alpha particles.',
      'Most alpha particles passed straight through, some were deflected and a tiny fraction underwent very large-angle deflections.',
      'Those observations imply atoms are mostly empty space with positive charge and most mass concentrated in a tiny nucleus.',
      'Smaller impact parameter means a closer approach to the positive nucleus, stronger electrostatic repulsion and a larger change in direction.',
      'Rutherford scattering is a useful example of evidence forcing scientists to replace an established model; it is a 3.8 Nuclear Physics extension here.'
    ]
  };

  function isMandarin(){
    return (document.documentElement.lang||'').toLowerCase().startsWith('zh');
  }
  function zhLesson(n){
    return window.PARTICLELAB_MANDARIN_LESSONS?.lessons?.[n]||null;
  }
  function lessonUI(text){
    return isMandarin()?(window.PARTICLELAB_MANDARIN_LESSONS?.ui?.[text]||text):text;
  }
  function bi(en,zh){return isMandarin()?zh:en;}
  function phaseLabel(text){
    if(!isMandarin())return text;
    return ({'Foundations':'基础','Particle physics':'粒子物理','Quantum phenomena':'量子现象','Consolidation':'综合复习','A-level extension':'A-level 扩展'})[text]||text;
  }
  function lessonTime(text){
    return isMandarin()?String(text).replace(/min/g,'分钟'):text;
  }
  function localLesson(base){
    if(!isMandarin())return base;
    const z=zhLesson(base.n);
    if(!z)return base;
    return {
      ...base,
      title:z.title||base.title,
      overview:z.overview||base.overview,
      objectives:z.objectives||base.objectives,
      recall:(z.recall||[]).map(x=>x[0]),
      teach:(z.sections||[]).map((x,i)=>[(i+1)+'. '+x[0],(x[1]||[]).join(' ')]),
      simTask:z.simTask||base.simTask,
      worked:z.worked||base.worked,
      exam:z.exam||base.exam,
      exit:z.exit||base.exit,
      next:z.next||base.next,
      homework:z.homework||base.homework
    };
  }
  function localTextbook(n){
    if(isMandarin()){
      const z=zhLesson(n);
      if(z)return {title:z.title,sections:(z.sections||[]).map(x=>({h:x[0],p:x[1],k:x[2],q:x[3],a:x[4]}))};
    }
    return lessonTextbook[n];
  }
  function localKeywords(n){
    if(isMandarin())return zhLesson(n)?.keywords||keywordBank[n]||[];
    return keywordBank[n]||[];
  }
  function localSpec(n){
    if(isMandarin()){
      const z=zhLesson(n);
      if(z)return {section:lessons.find(x=>x.n===n)?.code||'',title:z.title,points:z.spec||[]};
    }
    return aqaCoreKnowledge[n];
  }
  function localPractice(n){
    if(isMandarin()){
      const z=zhLesson(n);
      if(z)return (z.sections||[]).map((x,i)=>['检查理解 '+(i+1),x[3],x[4]]);
    }
    return lessonTaskBank[n]||[];
  }

  function chunkSupport(l,i){
    if(isMandarin()){
      const z=zhLesson(l.n),sec=z?.sections?.[i];
      if(sec)return {detail:(sec[1]||[]).join(' '),taskTitle:'检查理解',task:sec[3],answer:sec[4],exam:z.exam||''};
    }
    const tasks=lessonTaskBank[l.n]||[];
    const task=tasks.length?tasks[i%tasks.length]:['Explain it','Explain this idea using the correct physics terms.',l.teach?.[i]?.[1]||''];
    const detail=lessonChunkDetail[l.n]?.[i]||l.teach?.[i]?.[1]||'';
    return {detail,taskTitle:task[0],task:task[1],answer:task[2],exam:l.exam||''};
  }

  function taskBankHTML(n){
    const tasks=localPractice(n);
    if(!tasks.length)return '';
    const zh=isMandarin(),saved=practiceAnswers[n]||[];
    const answered=tasks.reduce((sum,_,i)=>sum+((saved[i]||'').trim()?1:0),0);
    return '<div class="lesson-independent-tasks"><div class="lesson-task-heading"><div><span class="eyebrow">'+(zh?'独立练习':'Independent practice')+'</span><strong>'+tasks.length+(zh?' 道额外练习':' extra tasks')+'</strong></div><span class="lesson-task-progress">'+answered+' / '+tasks.length+(zh?' 已作答':' answered')+'</span></div>'+
      tasks.map((t,i)=>'<details class="lesson-task-card"><summary><span>'+(zh?'练习 ':'Task ')+(i+1)+'</span><strong>'+t[0]+'</strong></summary>'+
        '<div class="lesson-task-body"><p>'+t[1]+'</p>'+
          '<textarea rows="3" data-practice-input="'+i+'" placeholder="'+(zh?'先独立写出答案……':'Write your answer independently first...')+'">'+esc(saved[i]||'')+'</textarea>'+
          '<small data-practice-status="'+i+'">'+((saved[i]||'').trim()?(zh?'已保存':'Saved'):(zh?'尚未作答':'Not answered yet'))+'</small>'+
          '<details class="lesson-task-check"><summary>'+(zh?'完成后检查答案':'Check answer after attempting')+'</summary><div class="lesson-task-answer"><strong>'+(zh?'检查：':'Check:')+'</strong> '+t[2]+'</div></details>'+
        '</div></details>').join('')+
      '</div>';
  }

  const lessonTextbook={"1":{"title":"Atomic structure, nuclide notation and isotopes","sections":[{"h":"1. The structure of an atom","p":["An atom contains a tiny central nucleus made from protons and neutrons, with electrons in the much larger region around the nucleus. Almost all of the atom’s mass is concentrated in the nucleus because electrons are far lighter than nucleons. Any visual model in the app is therefore schematic rather than drawn to scale.","The proton has charge +e, the neutron has charge 0 and the electron has charge −e, where e = 1.602 × 10⁻¹⁹ C. Their approximate SI masses are 1.673 × 10⁻²⁷ kg, 1.675 × 10⁻²⁷ kg and 9.109 × 10⁻³¹ kg respectively. In relative terms, proton and neutron masses are about 1 while an electron is about 1/1836."],"k":["The nucleus contains protons and neutrons.","Electrons have the same charge magnitude as protons but opposite sign.","Electron mass is tiny compared with nucleon mass."],"q":"Why is nearly all atomic mass found in the nucleus?","a":"Because the nucleus contains protons and neutrons, each around 1800 times more massive than an electron."},{"h":"2. Proton number Z and nucleon number A","p":["The proton number Z is the number of protons in the nucleus. It fixes the chemical element: if Z changes, the element changes. The nucleon number A is the total number of protons and neutrons in the nucleus.","The neutron number is therefore N = A − Z. A neutral atom has the same number of electrons as protons. An ion has gained or lost electrons, so electron number changes but Z and A do not."],"k":["Z = number of protons.","A = protons + neutrons.","N = A − Z.","Neutral atom: electrons = protons."],"q":"For an atom with A = 31 and Z = 15, how many neutrons are present?","a":"N = A − Z = 31 − 15 = 16 neutrons."},{"h":"3. Nuclide notation","p":["A nuclide is written with the nucleon number as the upper left number and the proton number as the lower left number beside the element symbol. Read the two numbers before doing any calculation.","From nuclide notation you can immediately identify proton number, neutron number and—if the atom is neutral—electron number. For ions, use the ionic charge to adjust the electron count."],"k":["Upper left = A.","Lower left = Z.","Element symbol must agree with Z."],"q":"What information does ²³₁₁Na give you?","a":"11 protons, 12 neutrons and, if neutral, 11 electrons."},{"h":"4. Isotopes and isotopic data","p":["Isotopes are atoms of the same element with the same proton number but different neutron numbers. Because Z stays the same, they are the same element; because neutron number changes, A changes.","Do not confuse isotopes with ions. Isotopes differ in neutrons; ions differ in electrons. In data questions, identify Z first, then calculate neutron number from A − Z."],"k":["Same Z, different neutron number.","Different isotopes have different A.","Ion formation does not create a new isotope."],"q":"Why are carbon-12 and carbon-14 both carbon?","a":"Both have Z = 6, so both contain six protons; they differ only in neutron number."}]},"2":{"title":"Specific charge of particles, nuclei and ions","sections":[{"h":"1. What specific charge means","p":["Specific charge is the electric charge per unit mass of a particle or object. It is defined by Q/m and has units C kg⁻¹. It is not the same as electric charge: two objects can have the same charge but very different specific charges if their masses differ.","The sign matters. Positive particles have positive specific charge, negative particles have negative specific charge and neutral objects have zero specific charge."],"k":["specific charge = Q/m","unit: C kg⁻¹","keep the sign of Q"],"q":"Why does an electron have a much larger magnitude of specific charge than a proton?","a":"They have equal charge magnitude, but the electron has far smaller mass, so |Q/m| is much larger."},{"h":"2. Proton and electron specific charge","p":["Use the elementary charge and SI mass values. For a proton, divide +1.602 × 10⁻¹⁹ C by 1.673 × 10⁻²⁷ kg. For an electron, divide −1.602 × 10⁻¹⁹ C by 9.109 × 10⁻³¹ kg.","AQA questions may ask you to compare magnitudes or signs. State the unit and avoid replacing the particle mass with a relative mass unless the question explicitly supports that."],"k":["Use SI charge and SI mass for numerical Q/m.","Electron Q/m is negative; proton Q/m is positive."],"q":"Which particle has the larger |Q/m|, proton or electron?","a":"The electron, because its mass is much smaller for the same charge magnitude."},{"h":"3. Nuclei and ions","p":["For a nucleus containing Z protons, total charge is Q = Ze. The nuclear mass is dominated by its A nucleons. For an ion, first work out its net charge from the imbalance between proton number and electron number.","A +2 ion has two fewer electrons than protons; a −1 ion has one more electron than protons. Once Q and total mass are known, substitute into Q/m."],"k":["nucleus: Q = Ze","cation: fewer electrons than protons","anion: more electrons than protons"],"q":"What is the charge of a +3 ion in coulombs?","a":"+3e = +4.806 × 10⁻¹⁹ C."},{"h":"4. A reliable calculation method","p":["Use a three-step method: calculate total charge, calculate or identify total mass, then divide. Keep powers of ten until the final line and include C kg⁻¹.","A common error is to use the charge of one proton when the whole nucleus or ion is being considered. Another is to lose the negative sign for an anion."],"k":["1: find Q","2: find m","3: calculate Q/m"],"q":"Why should you find the total charge before dividing by mass?","a":"Specific charge belongs to the whole particle or ion, so Q must represent its net charge."}]},"3":{"title":"Nuclear stability and the strong nuclear force","sections":[{"h":"1. Why nuclei need another interaction","p":["Protons are positively charged, so electrostatic repulsion acts between every pair of protons in a nucleus. If electrostatic force were the only interaction, a compact nucleus would not remain bound.","The strong nuclear interaction acts between nucleons—protons and neutrons—and is strong enough at nuclear distances to overcome proton–proton electrostatic repulsion."],"k":["Electrostatic force repels protons.","Strong interaction acts between nucleons."],"q":"Why are neutrons useful to nuclear stability even though they are uncharged?","a":"They participate in the attractive strong interaction without adding electrostatic repulsion."},{"h":"2. Attraction over nuclear distances","p":["At typical nucleon separations, the strong nuclear force is attractive. AQA specifies short-range attraction out to approximately 3 fm. This attraction binds nucleons together.","A femtometre is 10⁻¹⁵ m, so the distances involved are extremely small compared with atomic dimensions."],"k":["Attractive over typical nuclear separations.","Range approximately a few femtometres.","1 fm = 10⁻¹⁵ m."],"q":"Why does the strong interaction not hold separate atoms together?","a":"It becomes negligible beyond only a few femtometres, much shorter than atomic separations."},{"h":"3. Very-short-range repulsion","p":["When nucleons approach closer than roughly 0.5 fm, the strong force becomes strongly repulsive. This prevents the attractive interaction from pulling nucleons into the same tiny region.","So the qualitative force–separation description has three parts: very-close repulsion, attraction at normal nuclear separations, and negligible force beyond a few femtometres."],"k":["< about 0.5 fm: repulsive","normal nuclear separation: attractive","> a few fm: negligible"],"q":"What should an AQA force–separation explanation always include?","a":"Very-short-range repulsion, short-range attraction and the fact that the force becomes negligible beyond a few femtometres."},{"h":"4. Connecting the forces to stability","p":["A stable nucleus reflects a balance of interactions. Protons repel electrostatically, while the strong interaction between neighbouring nucleons provides short-range binding.","In exam explanations, do not say the strong force is simply 'stronger than electrostatic force everywhere'. Its effect depends strongly on separation and has only a short range."],"k":["Stability depends on separation.","Strong force is not long range."],"q":"What is wrong with saying 'the strong force always wins'?","a":"The strong interaction acts only over very short distances and changes from repulsive to attractive with separation."}]},"4":{"title":"Alpha decay, beta-minus decay and the neutrino","sections":[{"h":"1. Unstable nuclei and alpha decay","p":["An unstable nucleus can transform spontaneously into a more stable arrangement. In alpha decay the nucleus emits an alpha particle, which is a helium-4 nucleus containing two protons and two neutrons.","Because four nucleons leave, A decreases by 4. Because two protons leave, Z decreases by 2. Both numbers must balance in a nuclear equation."],"k":["α = ⁴₂He","A changes by −4","Z changes by −2"],"q":"A nucleus with A = 226 and Z = 88 emits alpha radiation. What are the daughter values?","a":"A = 222 and Z = 86."},{"h":"2. Beta-minus decay","p":["In beta-minus decay, neutron character changes to proton character. An electron and an electron antineutrino are emitted. The beta electron is created in the decay; it was not stored inside the nucleus.","The total number of nucleons does not change, so A stays the same. Proton number increases by 1 because there is one more proton after the transformation."],"k":["β⁻: A unchanged","β⁻: Z increases by 1","electron + electron antineutrino emitted"],"q":"Why does A stay unchanged in beta-minus decay?","a":"One nucleon changes from neutron character to proton character; no nucleon is added or removed."},{"h":"3. Why the neutrino was proposed","p":["Early beta-decay measurements appeared not to conserve energy if only the daughter nucleus and beta electron were considered. The neutrino was proposed as an unseen particle carrying away part of the energy.","In beta-minus decay the emitted neutral lepton is an electron antineutrino. The neutrino idea allows the decay to satisfy conservation laws."],"k":["Neutrino hypothesis solved missing-energy problem.","β⁻ emits an electron antineutrino."],"q":"What observation motivated the neutrino hypothesis?","a":"Beta-decay measurements appeared to have missing energy unless an unseen neutral particle carried some away."},{"h":"4. Writing decay equations","p":["Balance nucleon number and proton number on both sides. For alpha decay include ⁴₂He. For beta-minus decay, the electron has nucleon number 0 and charge/proton-number contribution −1 in nuclear-equation notation.","Later lessons extend weak interactions to beta-plus decay, electron capture and exchange particles. Keep those ideas separate from the core alpha/beta-minus description here."],"k":["Check A totals.","Check Z/charge totals.","Include the neutrino or antineutrino where required."],"q":"What two totals should you check first when balancing a nuclear decay equation?","a":"Nucleon number A and proton/charge number Z."}]},"5":{"title":"Particles, antiparticles and photons","sections":[{"h":"1. The antiparticle idea","p":["For every type of particle there is a corresponding antiparticle. A particle and its antiparticle have the same mass and rest energy, while relevant additive quantum numbers are reversed. If the particle is charged, its antiparticle has the opposite charge.","Required named pairs include electron/positron, proton/antiproton, neutron/antineutron and neutrino/antineutrino. A neutral particle can still have a distinct antiparticle, so 'opposite charge' is not a complete definition."],"k":["same mass","same rest energy","opposite relevant quantum numbers"],"q":"Why is an antineutron still different from a neutron even though both are neutral?","a":"Their internal/additive quantum numbers are opposite even though net electric charge is zero."},{"h":"2. Rest energy and MeV","p":["Particle energies are often quoted in electronvolts or megaelectronvolts because joules are inconveniently small on the particle scale. Rest energy is the energy associated with a particle’s mass.","In this core section, be able to compare quoted rest energies and use them in annihilation/pair-production reasoning. You should not assume every question requires an E = mc² calculation."],"k":["1 MeV = 10⁶ eV","electron rest energy ≈ 0.511 MeV"],"q":"What is the combined rest energy of an electron and positron?","a":"2 × 0.511 MeV = 1.022 MeV."},{"h":"3. The photon model","p":["Electromagnetic radiation transfers energy in discrete quanta called photons. Each photon has energy E = hf, where h is the Planck constant and f is frequency.","Since c = fλ for electromagnetic waves in vacuum, photon energy can also be written E = hc/λ. Higher frequency means higher energy per photon; higher intensity at fixed frequency means more photons arriving per second, not more energy per photon."],"k":["E = hf","E = hc/λ","frequency sets photon energy"],"q":"If frequency doubles, what happens to photon energy?","a":"Photon energy doubles because E is directly proportional to f."},{"h":"4. Required examples","p":["The positron is the electron antiparticle, the antiproton is the proton antiparticle, the antineutron is the neutron antiparticle and the antineutrino is the neutrino antiparticle.","When comparing a pair in an exam, state mass/rest energy first, then charge if relevant, then the reversal of quantum numbers. This is more complete than only discussing charge."],"k":["e⁻ ↔ e⁺","p ↔ p̄","n ↔ n̄","ν ↔ ν̄"],"q":"Give two properties shared by a particle and its antiparticle.","a":"They have the same mass and the same rest energy."}]},"6":{"title":"Annihilation and pair production","sections":[{"h":"1. Annihilation","p":["When a particle meets its antiparticle they can annihilate. Their rest energy and any kinetic energy are converted into the energy of other particles. For a slow electron–positron pair, the standard model is two gamma photons.","Two photons travelling in opposite directions allow total momentum to remain zero when the initial pair has negligible total momentum."],"k":["energy conserved","momentum conserved","slow e⁻ + e⁺ commonly → 2γ"],"q":"Why are two photons used for slow electron–positron annihilation rather than one?","a":"Two opposite photons can conserve momentum while carrying away the energy."},{"h":"2. Energy involved","p":["One electron has rest energy about 0.511 MeV, so a slow electron and positron together provide about 1.022 MeV before any kinetic energy is included.","If the pair has kinetic energy, the photons can carry more than the combined rest energy. The total energy before and after must match."],"k":["minimum combined rest energy = 1.022 MeV","Slow e⁻/e⁺ pair rest energy totals 1.022 MeV.","Any initial kinetic energy adds to the energy carried by the products."],"q":"What total photon energy is expected from a slow e⁻/e⁺ pair?","a":"Approximately 1.022 MeV in total."},{"h":"3. Pair production","p":["Pair production is the creation of a particle–antiparticle pair from photon energy. For electron–positron production, the photon must supply at least 1.022 MeV of rest energy.","Any energy above the rest-energy requirement appears as kinetic energy and recoil. A nearby nucleus or other body is needed to take momentum so conservation can be satisfied."],"k":["photon → particle + antiparticle","threshold for e⁻/e⁺ pair: 1.022 MeV","nearby body can recoil"],"q":"A photon has 1.50 MeV. After e⁻/e⁺ rest energy is created, where can the remaining energy go?","a":"Into kinetic energy of the created particles and recoil of the nearby body."},{"h":"4. Conservation reasoning","p":["Do not check only energy. Momentum must also be conserved. This is why the geometry of annihilation photons and the recoil in pair production matter.","AQA questions may combine photon equations with these processes. Convert units consistently before using E = hf or E = hc/λ."],"k":["check energy","check momentum","convert eV/MeV and J carefully"],"q":"What two conservation laws are essential when explaining annihilation and pair production?","a":"Energy and momentum conservation."}]},"7":{"title":"Fundamental interactions and exchange particles","sections":[{"h":"1. The four fundamental interactions","p":["The four fundamental interactions are gravitational, electromagnetic, weak nuclear and strong nuclear. At particle-physics scale, electromagnetic, weak and strong interactions are especially important.","Different particles respond to different interactions. Hadrons feel the strong interaction; leptons do not. Charged particles experience electromagnetic interaction."],"k":["gravity","electromagnetic","weak","strong"],"q":"Which interaction is responsible for beta decay?","a":"The weak interaction."},{"h":"2. Exchange-particle model","p":["Interactions can be represented using exchange particles. The exchange carries energy and momentum between the interacting particles; a diagram is a model of the process rather than a literal picture of tiny balls being thrown.","For AQA diagrams, identify the incoming particles, exchange particle and outgoing particles, and make sure charge is consistent at every vertex."],"k":["incoming particles","exchange particle","outgoing particles"],"q":"What should you identify first when reading an exchange-particle diagram?","a":"The incoming particles, the exchange particle and the outgoing particles."},{"h":"3. Electromagnetic interaction","p":["The electromagnetic interaction is represented using virtual photons as exchange particles. This applies to attraction and repulsion between charged particles.","Do not confuse a virtual exchange photon with an ordinary detectable photon of electromagnetic radiation. In this specification it is a model used to describe the interaction."],"k":["EM exchange particle: virtual photon","Electromagnetic interactions are represented by virtual-photon exchange.","A virtual exchange photon is not the same as a detectable real photon."],"q":"What exchange particle represents the electromagnetic interaction?","a":"A virtual photon."},{"h":"4. Weak interaction","p":["AQA limits the weak processes here to beta-minus decay, beta-plus decay, electron capture and electron–proton collisions. W⁺ and W⁻ bosons are the exchange particles.","At quark level, beta-minus involves a down quark changing to an up quark and beta-plus involves an up quark changing to a down quark. The later quark lesson develops this in more detail."],"k":["weak exchange particles: W⁺ and W⁻","β⁻: d → u","β⁺: u → d"],"q":"Which exchange bosons are required for the weak interaction in this course?","a":"W⁺ and W⁻ bosons."}]},"8":{"title":"Classification of particles","sections":[{"h":"1. Hadrons and leptons","p":["The first classification question is whether the particle experiences the strong interaction. Hadrons do; leptons do not.","Hadrons are divided into baryons and mesons. Leptons form a separate family including electrons, muons and their corresponding neutrinos."],"k":["hadrons feel strong interaction","leptons do not"],"q":"Is an electron a hadron or a lepton?","a":"A lepton; it does not experience the strong interaction."},{"h":"2. Baryons and baryon number","p":["The required baryons are proton and neutron, with antiproton and antineutron as antibaryons. Baryon number is +1 for baryons, −1 for antibaryons and 0 for non-baryons.","Baryon number is conserved. In this classification, the proton is the only stable baryon; other baryons eventually decay into states that include a proton."],"k":["B baryon = +1","B antibaryon = −1","B conserved"],"q":"What is the baryon number of a proton–antiproton pair in total?","a":"0, because +1 + (−1) = 0."},{"h":"3. Mesons, pions and kaons","p":["Mesons are hadrons made from a quark and an antiquark. AQA requires pions and kaons as the key examples.","The pion is used as the exchange particle in the model of the strong nuclear force between nucleons. Kaons are strange particles and can decay into pions."],"k":["meson = quark + antiquark","pions and kaons required"],"q":"Which meson is used in the nucleon strong-force exchange model?","a":"The pion."},{"h":"4. Leptons and lepton number","p":["Required leptons are electron, muon, electron neutrino and muon neutrino, plus their antiparticles. Electron-family and muon-family lepton numbers are tracked separately.","For a family, the lepton and its neutrino have lepton number +1; their antiparticles have −1. Lepton number is conserved in the reactions studied. A muon can decay into an electron with neutrino products."],"k":["track electron lepton number separately","track muon lepton number separately"],"q":"Why is one total 'lepton number' not always enough for an AQA reaction?","a":"Electron-family and muon-family lepton numbers must be conserved separately."},{"h":"5. Strange particles","p":["Strange particles, such as kaons, are produced through the strong interaction and decay through the weak interaction. In strong interactions, total strangeness is conserved, so strange particles are produced with balancing strangeness.","In weak interactions, strangeness may change by 0 or ±1. This explains why strange particles can be produced rapidly but decay more slowly through a different interaction."],"k":["strong production: strangeness conserved","weak decay: strangeness may change by 0 or ±1"],"q":"Why are strange particles often created in pairs in strong interactions?","a":"So total strangeness can remain conserved."},{"h":"6. How particle knowledge is established","p":["Modern particle physics depends on large collaborations of scientists and engineers. Experiments generate huge data sets and results must be checked, repeated and independently validated.","This matters because claims about new particles or interactions need strong statistical and experimental support before becoming accepted knowledge."],"k":["collaboration","validation","reproducibility"],"q":"Why are large collaborations important in particle physics?","a":"They allow complex experiments, independent checks and validation of large data sets and new claims."}]},"9":{"title":"Quarks, antiquarks and hadron structure","sections":[{"h":"1. Required quarks","p":["AQA requires only up (u), down (d) and strange (s) quarks and their antiquarks in this section. The up quark has charge +2/3 e; down and strange quarks have charge −1/3 e.","Every quark has baryon number +1/3. Antiquarks have the opposite charge and baryon number. The strange quark has strangeness −1; anti-strange has +1."],"k":["u: +2/3e","d: −1/3e","s: −1/3e, S = −1","quark B = +1/3"],"q":"What are the charge and baryon number of an anti-up quark?","a":"Charge −2/3 e and baryon number −1/3."},{"h":"2. Building baryons","p":["A baryon contains three quarks. The proton is uud, giving charge +1 e. The neutron is udd, giving charge 0. Antiproton and antineutron contain the corresponding three antiquarks.","Adding three quark baryon numbers gives +1 for a baryon; adding three antiquark baryon numbers gives −1 for an antibaryon."],"k":["p = uud","n = udd"],"q":"Show that uud has charge +e.","a":"+2/3 e + 2/3 e − 1/3 e = +1 e."},{"h":"3. Building mesons","p":["A meson contains one quark and one antiquark, so its total baryon number is zero. Required examples are pions and kaons.","Useful charged examples are π⁺ = u anti-d, π⁻ = d anti-u, K⁺ = u anti-s and K⁻ = s anti-u. Their charges and strangeness follow by adding the constituent quantum numbers."],"k":["meson B = 0","π⁺ = u anti-d","K⁺ = u anti-s"],"q":"What is the strangeness of K⁺ = u anti-s?","a":"+1, because the anti-strange quark has S = +1."},{"h":"4. Antiquarks","p":["An antiquark reverses the additive quantum numbers of the corresponding quark. A bar over the symbol is therefore important: anti-d has charge +1/3 e and anti-s has charge +1/3 e with strangeness +1.","A frequent exam error is to reverse charge but forget baryon number or strangeness. Write a small quantum-number table before adding totals."],"k":["antiquark quantum numbers are reversed","Antiquarks have opposite charge and additive quantum numbers to the matching quark.","For anti-s: Q = +1/3 e, B = −1/3 and S = +1."],"q":"What are Q, B and S for anti-s?","a":"Q = +1/3 e, B = −1/3 and S = +1."},{"h":"5. Neutron beta decay at quark level","p":["A neutron udd becomes a proton uud during beta-minus decay. One down quark changes into an up quark.","The change is a weak interaction: d → u with W⁻ emission in the exchange-particle model. The W⁻ then produces the electron and electron antineutrino."],"k":["neutron udd → proton uud","quark change d → u"],"q":"Which quark changes in neutron beta-minus decay?","a":"One down quark changes into an up quark."}]},"10":{"title":"Conservation laws in particle reactions","sections":[{"h":"1. A systematic conservation method","p":["Particle reactions must satisfy conservation laws. The safest method is to make a before/after table and total one quantity at a time.","Do not decide that a reaction is allowed just because charge balances. Charge, baryon number, the appropriate lepton-family numbers, strangeness where relevant, energy and momentum must all be consistent."],"k":["check one quantity at a time","charge alone is not enough"],"q":"Why can a charge-balanced reaction still be impossible?","a":"It may violate baryon number, lepton number, strangeness, energy or momentum."},{"h":"2. Charge and baryon number","p":["Total electric charge is conserved. Baryon number is also conserved: baryons contribute +1, antibaryons −1, quarks +1/3 and antiquarks −1/3.","This can quickly identify impossible reactions involving creation or loss of baryon content."],"k":["ΣQ before = ΣQ after","ΣB before = ΣB after"],"q":"Can a single proton disappear into photons only?","a":"No. Photons have B = 0, so baryon number would change from +1 to 0."},{"h":"3. Lepton-family numbers","p":["Electron and muon family lepton numbers are conserved separately. Electrons and electron neutrinos have electron lepton number +1; their antiparticles have −1. Muons and muon neutrinos are treated similarly for the muon family.","This is why neutrinos and antineutrinos are essential products in many weak decays."],"k":["electron-family L conserved","muon-family L conserved"],"q":"In n → p + e⁻ + anti-νe, what is total electron lepton number after the decay?","a":"+1 + (−1) = 0, matching the initial value 0."},{"h":"4. Strangeness","p":["Strangeness is conserved in strong interactions. In weak interactions it can change by 0 or ±1 for the processes required by AQA.","So a reaction involving strange particles may be allowed as a weak decay even though total strangeness changes, but the same change would rule out a strong interaction."],"k":["strong: ΔS = 0","weak: ΔS may be 0, +1 or −1"],"q":"A reaction changes total strangeness by +1. Could it be a strong interaction?","a":"No. Strong interactions conserve strangeness."},{"h":"5. Quark changes and energy–momentum","p":["Beta-minus changes d → u and beta-plus changes u → d. These changes help you connect hadron-level reactions with the weak interaction.","Energy and momentum are conserved in every interaction. Even when quantum numbers balance, a proposed process can still be impossible if there is not enough energy or momentum cannot be conserved."],"k":["β⁻: d → u","β⁺: u → d","energy conserved","momentum conserved"],"q":"What additional checks remain after all quantum numbers balance?","a":"Energy and momentum conservation."}]},"11":{"title":"The photoelectric effect","sections":[{"h":"1. The key observations","p":["Electrons can be emitted from a metal surface when electromagnetic radiation shines on it. Emission occurs only if the radiation frequency is above a threshold frequency for that metal.","Below threshold, increasing intensity does not cause emission. Above threshold, emission is effectively immediate. These observations are difficult to explain using a purely continuous wave-energy model."],"k":["threshold frequency exists","no emission below threshold however intense","emission above threshold is immediate"],"q":"Why can very intense low-frequency light still fail to emit electrons?","a":"Each photon has energy hf; if hf is below the work function, no individual photon can remove an electron."},{"h":"2. Photon explanation","p":["In the photon model, one electron absorbs the energy of one photon. Photon energy is E = hf. The metal requires a minimum energy φ, called the work function, to release an electron.","If hf < φ, no electron is emitted. At threshold, hf₀ = φ. Above threshold, the excess energy becomes electron kinetic energy."],"k":["one photon transfers energy to one electron","φ = work function","f₀ = φ/h"],"q":"What physical quantity determines the threshold frequency?","a":"The work function of the surface."},{"h":"3. Photoelectric equation","p":["For the most energetic emitted electrons, hf = φ + KEmax. Not every emitted electron necessarily has KEmax because electrons can lose energy before escaping the metal.","Use joules consistently if h is in J s, or convert electronvolt energies carefully."],"k":["hf = φ + KEmax","The maximum photoelectron kinetic energy is KEmax = hf − φ.","Use consistent energy units before substituting into the equation."],"q":"A photon has energy 4.2 eV and φ = 2.5 eV. What is KEmax?","a":"KEmax = 4.2 eV − 2.5 eV = 1.7 eV, so the fastest emitted photoelectrons have 1.7 eV of kinetic energy."},{"h":"4. Intensity and frequency","p":["Frequency controls energy per photon. At fixed frequency above threshold, increasing intensity increases the number of photons arriving per second, so more electrons can be emitted per second.","It does not increase the maximum kinetic energy unless frequency also changes."],"k":["frequency → energy per photon","intensity → photon rate"],"q":"At fixed frequency above threshold, what happens when intensity increases?","a":"The emission rate/current can increase, but KEmax stays unchanged."},{"h":"5. Stopping potential","p":["A reverse potential can stop photoelectrons reaching the collector. The stopping potential Vs is the potential needed to stop even the fastest photoelectrons.","The relation is KEmax = eVs. AQA requires use of stopping potential, but experimental determination of it is not required knowledge."],"k":["KEmax = eVs","Stopping potential gives KEmax through KEmax = eVs.","Vs is the reverse potential that stops even the fastest photoelectrons."],"q":"What does the stopping potential measure indirectly?","a":"The maximum kinetic energy of the emitted photoelectrons."}]},"12":{"title":"Electron collisions, excitation and ionisation","sections":[{"h":"1. Excitation","p":["Atomic electrons can occupy only certain allowed energy levels. In excitation, a bound electron gains energy and moves to a higher allowed level but remains part of the atom.","Because the levels are discrete, an inelastic collision can transfer the exact energy difference needed for a particular excitation."],"k":["excitation: electron remains bound","energy transfer matches an allowed gap"],"q":"How is excitation different from simply increasing kinetic energy of a free electron?","a":"Excitation changes the allowed bound energy state of an atomic electron."},{"h":"2. Ionisation","p":["Ionisation occurs when enough energy is transferred to remove an electron completely from the atom. The minimum required energy depends on the electron’s starting state.","After ionisation the atom is positively charged because it has lost an electron."],"k":["ionisation removes an electron","ionised atom becomes positive"],"q":"What happens if an atom loses one electron?","a":"It becomes a +1 ion."},{"h":"3. Electron-volt","p":["One electronvolt is the energy transferred when one electron moves through a potential difference of one volt. 1 eV = 1.602 × 10⁻¹⁹ J.","To convert eV to J, multiply by 1.602 × 10⁻¹⁹. To convert J to eV, divide by 1.602 × 10⁻¹⁹."],"k":["1 eV = 1.602 × 10⁻¹⁹ J","1 eV = 1.602 × 10⁻¹⁹ J.","Multiply by 1.602 × 10⁻¹⁹ to convert eV to J; divide to convert J to eV."],"q":"Convert 3.0 eV to joules.","a":"3.0 × 1.602 × 10⁻¹⁹ = 4.806 × 10⁻¹⁹ J."},{"h":"4. Threshold collision behaviour","p":["If an incoming electron has less energy than an excitation gap, that excitation cannot occur. Once the threshold is reached, the atom can absorb the required discrete amount and the incident electron keeps any leftover energy.","For ionisation, the incoming particle must supply at least the ionisation energy."],"k":["discrete excitation thresholds","leftover energy can remain as kinetic energy"],"q":"An electron has more kinetic energy than the required excitation energy. Must all of its energy be absorbed?","a":"No. The atom takes the allowed excitation energy and the remaining energy can stay as kinetic energy."},{"h":"5. Fluorescent tube","p":["Electrons accelerated through the tube collide with mercury atoms and cause excitation or ionisation. Excited mercury atoms later de-excite and emit ultraviolet photons.","A phosphor coating absorbs the ultraviolet and re-emits visible light. This provides a useful application of collision excitation and photon emission."],"k":["electron collision excites mercury","de-excitation emits UV","phosphor produces visible light"],"q":"Why is a phosphor coating used?","a":"It absorbs ultraviolet photons and emits visible light."}]},"13":{"title":"Energy levels, photons and line spectra","sections":[{"h":"1. Discrete energy levels","p":["Bound electrons in atoms do not have any arbitrary energy. They occupy discrete allowed levels. A diagram represents energy values, not literal circular electron paths.","The ground state is the lowest allowed energy. Excited states are higher allowed energies."],"k":["allowed energies are discrete","ground state = lowest level"],"q":"What do horizontal lines on an energy-level diagram represent?","a":"Allowed electron energies, not physical orbital paths."},{"h":"2. Downward transitions and emission","p":["When an electron moves from a higher level to a lower level, the atom loses energy. That energy is emitted as one photon with ΔE = hf.","A larger energy difference produces a higher-frequency photon and therefore a shorter wavelength."],"k":["ΔE = hf","larger ΔE → larger f → shorter λ"],"q":"Which transition gives the shortest-wavelength photon?","a":"The transition with the largest energy difference."},{"h":"3. Upward transitions and absorption","p":["An atom can absorb a photon if the photon energy matches an allowed energy difference. If the photon energy does not correspond to an available transition, that particular bound-bound absorption does not occur.","Electron collisions can also excite atoms by transferring an allowed energy difference."],"k":["photon absorption requires matching ΔE","Upward photon absorption requires photon energy to match an allowed energy gap.","Electron collisions can also transfer the required excitation energy."],"q":"Why is an arbitrary photon energy not always absorbed by a bound electron?","a":"Only discrete energy differences between allowed levels are available."},{"h":"4. Line spectra","p":["Because only particular energy differences exist, atoms emit photons at only particular frequencies and wavelengths. A line emission spectrum is therefore evidence for discrete atomic energy levels.","Likewise, absorption spectra contain missing wavelengths corresponding to photons absorbed in upward transitions."],"k":["discrete transitions → discrete spectral lines","Discrete energy gaps produce discrete photon frequencies and wavelengths.","Line spectra are experimental evidence for quantised atomic energy levels."],"q":"Why is an atomic emission spectrum not continuous?","a":"Only certain electron energy differences are allowed, so only certain photon energies can be emitted."},{"h":"5. Calculations and units","p":["Use ΔE = hf and ΔE = hc/λ. If levels are given in eV, either work consistently in eV where appropriate or convert to joules before using h in J s.","Always take the magnitude of the level difference when calculating photon energy."],"k":["ΔE = hf","ΔE = hc/λ","check eV/J units"],"q":"What is the first calculation when using two quoted energy levels?","a":"Find the magnitude of the energy difference ΔE."}]},"14":{"title":"Wave–particle duality and electron diffraction","sections":[{"h":"1. Why duality is needed","p":["The photoelectric effect provides evidence that electromagnetic radiation can behave as particles because energy is transferred in discrete photons. Electron diffraction provides evidence that particles with mass can show wave behaviour.","Quantum objects are therefore not adequately described as purely classical particles or purely classical waves."],"k":["photoelectric effect → particle nature of EM","electron diffraction → wave nature of matter"],"q":"Give one piece of evidence for each side of wave–particle duality.","a":"Photoelectric effect for particle behaviour of EM radiation; electron diffraction for wave behaviour of electrons."},{"h":"2. de Broglie wavelength","p":["The de Broglie relation assigns a wavelength to a moving particle: λ = h/p. Here p is particle momentum.","For non-relativistic motion p = mv, so increasing mass or speed increases momentum and reduces wavelength."],"k":["λ = h/p","higher p → smaller λ"],"q":"What happens to de Broglie wavelength if momentum doubles?","a":"It halves."},{"h":"3. Diffraction and momentum","p":["Diffraction is most noticeable when wavelength is comparable with the spacing of the structure causing diffraction. If electron momentum rises, de Broglie wavelength falls.","For the same crystal or lattice, the diffraction angles/pattern therefore change as momentum changes. AQA requires the reasoning, not details of a particular apparatus method."],"k":["diffraction depends on λ relative to spacing","Higher particle momentum gives a shorter de Broglie wavelength.","For a fixed diffracting structure, changing wavelength changes the diffraction angles/pattern."],"q":"Why does increasing electron accelerating voltage alter the diffraction pattern?","a":"It increases electron momentum, reducing de Broglie wavelength, so the diffraction angles change."},{"h":"4. Scientific knowledge changes","p":["Wave–particle duality is an example of scientific models changing when new evidence cannot be explained by older ideas. New explanations are proposed and tested against experiment.","AQA also expects appreciation of peer review and validation by the scientific community. A result becomes reliable through scrutiny, replication and agreement with evidence."],"k":["evidence can change models","peer review and validation matter"],"q":"Why is one surprising experiment not enough to establish a new physical model?","a":"Results must be scrutinised, reproduced and validated by the scientific community."},{"h":"5. Exam calculation route","p":["For de Broglie questions, identify or calculate momentum first, then use λ = h/p. Keep SI units: momentum in kg m s⁻¹ gives wavelength in metres.","If accelerating potential or another context is supplied, first derive the momentum using the physics relationships given or previously learned, then apply de Broglie."],"k":["calculate p first","then λ = h/p"],"q":"What SI unit should momentum use before substitution into λ = h/p?","a":"kg m s⁻¹."},{"h":"6. Avoiding common misconceptions","p":["Do not say the electron literally turns into a classical wave. The experiment shows wave-like behaviour described by a wavelength relation.","Do not say increasing momentum increases diffraction. Higher momentum gives shorter wavelength, so for the same structure the diffraction angles generally become smaller."],"k":["higher p → shorter λ","Wave–particle duality describes quantum behaviour, not switching between two classical objects.","For the same structure, greater momentum generally means smaller diffraction angles."],"q":"What common trend should you remember for momentum and diffraction angle?","a":"Higher momentum means shorter wavelength and generally smaller diffraction angle for the same structure."}]},"15":{"title":"Synoptic Particles and Radiation review","sections":[{"h":"1. Particle foundations","p":["Start with atomic structure, Z and A, isotopes and specific charge. Then connect nuclear stability to the strong interaction and distinguish alpha from beta-minus decay.","Make sure you can switch between words, nuclide notation, equations and numerical calculations."],"k":["atom → nucleus → decay","definitions + calculations"],"q":"Which quantity identifies the element: A or Z?","a":"Z, the proton number."},{"h":"2. Particle physics chain","p":["Link antiparticles and photons to annihilation and pair production. Then classify interactions using exchange particles and classify particles as hadrons, baryons, mesons or leptons.","Quark structure explains baryons and mesons, while conservation laws determine whether reactions are possible."],"k":["antiparticles → interactions → classification → quarks → conservation","Classify particles before applying quantum numbers and conservation laws.","Use interactions, quark structure and conservation together when analysing reactions."],"q":"What is the best first step when given an unfamiliar particle reaction?","a":"Identify/classify the particles and list the quantum numbers to be checked."},{"h":"3. Quantum chain","p":["The quantum section starts with photon evidence from the photoelectric effect. Electron collisions introduce excitation, ionisation and the electronvolt.","Discrete energy levels explain line spectra, and electron diffraction completes the topic by showing wave behaviour of matter."],"k":["photoelectric → collisions → energy levels → diffraction","Photoelectric evidence supports the photon model.","Electron diffraction and line spectra connect quantum behaviour to wave and energy-level models."],"q":"What single idea links line spectra to photon energy?","a":"Discrete energy differences between atomic levels give discrete photon energies."},{"h":"4. Core equations","p":["Know when to use specific charge Q/m, photon energy E = hf and E = hc/λ, photoelectric equation hf = φ + KEmax, stopping potential KEmax = eVs, energy levels ΔE = hf and de Broglie wavelength λ = h/p.","Also be fluent converting 1 eV = 1.602 × 10⁻¹⁹ J. Equation selection and unit consistency often determine whether a calculation succeeds."],"k":["select equation from physics meaning","keep SI units consistent"],"q":"Which equation links stopping potential to maximum photoelectron kinetic energy?","a":"KEmax = eVs."}]},"16":{"title":"Rutherford scattering and the nuclear model","sections":[{"h":"1. The experiment and old model","p":["Rutherford scattering uses alpha particles directed at thin material and observes how their directions change. A diffuse positive-charge model would predict only small deflections.","The key value of the experiment is the link between observations and what they imply about atomic structure."],"k":["compare prediction with observation","Compare the old diffuse-charge prediction with the observed scattering.","The value of the experiment comes from linking observation to model evidence."],"q":"What would a diffuse positive-charge model predict for most alpha particles?","a":"Only small deflections."},{"h":"2. Most particles pass straight through","p":["Most alpha particles passed through with little or no deflection. This implies that most of the volume of an atom is empty space.","It does not mean the atom contains no electrons; it means the concentrated nucleus occupies only a tiny fraction of atomic volume."],"k":["most straight → atom mostly empty space","Most alpha particles passing straight through implies atoms are mostly empty space.","The nucleus occupies only a tiny fraction of atomic volume."],"q":"What inference follows from most alpha particles passing straight through?","a":"Most of the atom is empty space."},{"h":"3. Large-angle deflections","p":["A small fraction of alpha particles were deflected through large angles and a very small fraction came back. Because alpha particles are positive, large deflections require strong electrostatic repulsion from concentrated positive charge.","The rarity of these events shows that the region containing this positive charge is very small."],"k":["rare large deflection → tiny concentrated positive nucleus","Rare large-angle scattering requires strong repulsion from concentrated positive charge.","The rarity of these events shows the positively charged region is very small."],"q":"Why are backward-scattering events rare?","a":"Only a very small fraction of alpha particles pass close enough to the tiny nucleus for very strong repulsion."},{"h":"4. Mass and charge in the nucleus","p":["The scattering evidence led to the nuclear model: positive charge and most atomic mass are concentrated in a very small nucleus, with electrons outside.","This replaced models with diffuse positive charge because the older model could not explain the rare, very large deflections."],"k":["nucleus contains concentrated positive charge and most mass","Positive charge and most atomic mass are concentrated in the nucleus.","The nuclear model explains observations that diffuse-positive-charge models could not."],"q":"What feature of the old model failed to explain the observations?","a":"Its positive charge was too spread out to produce rare very large deflections."},{"h":"5. Impact parameter","p":["Impact parameter describes how far an incoming alpha particle’s original straight-line path would pass from the nucleus centre. Smaller impact parameter means a closer approach.","Closer approach produces stronger electrostatic repulsion, so the alpha particle’s direction changes more and the scattering angle is larger."],"k":["smaller b → closer approach → stronger repulsion → larger angle","Smaller impact parameter means closer approach to the nucleus.","Closer approach gives stronger electrostatic repulsion and a larger scattering angle."],"q":"What happens to scattering angle as impact parameter decreases?","a":"It increases."}]}};

  const aqaCoreKnowledge={
    1:{section:'3.2.1.1',title:'Constituents of the atom',points:[
      'Use a simple atomic model containing protons, neutrons and electrons; almost all atomic mass is concentrated in the nucleus.',
      'Know proton, neutron and electron charge in relative and SI form: +e, 0, −e with e = 1.602 × 10⁻¹⁹ C.',
      'Know approximate relative masses and SI masses: proton ≈ 1 u and 1.673 × 10⁻²⁷ kg; neutron ≈ 1 u and 1.675 × 10⁻²⁷ kg; electron ≈ 1/1836 u and 9.109 × 10⁻³¹ kg.',
      'Use proton number Z and nucleon number A correctly, including neutron number N = A − Z and standard nuclide notation.',
      'Define isotopes as atoms with the same proton number but different neutron numbers, and interpret simple isotopic data.',
      'Changing electron number makes an ion; changing proton number changes the element.'
    ]},
    2:{section:'3.2.1.1',title:'Specific charge',points:[
      'Define specific charge as charge per unit mass, Q/m, with unit C kg⁻¹.',
      'Calculate the specific charge of a proton and an electron from their SI charge and mass.',
      'For a nucleus, total charge is Q = Ze; for an ion, find net charge from proton number minus electron number.',
      'Use the mass of the whole particle or ion in Q/m; for nuclei and ordinary ions, nucleon mass dominates because electron mass is very small.',
      'Keep the sign of the charge: cations have positive specific charge and anions negative specific charge.'
    ]},
    3:{section:'3.2.1.2',title:'Stable and unstable nuclei',points:[
      'The strong nuclear force acts between nucleons and is required to overcome proton–proton electrostatic repulsion inside stable nuclei.',
      'At ordinary nuclear separations the strong force is attractive and acts over a short range up to roughly 3 fm.',
      'At extremely small separation, below roughly 0.5 fm, the strong force becomes strongly repulsive.',
      'Beyond a few femtometres the strong interaction becomes negligible, so it does not bind separate atoms together.',
      'Use femtometres correctly: 1 fm = 1 × 10⁻¹⁵ m.'
    ]},
    4:{section:'3.2.1.2',title:'Alpha and beta decay',points:[
      'An alpha particle is a helium-4 nucleus, so alpha emission changes A by −4 and Z by −2.',
      'In beta-minus decay neutron character changes to proton character; A is unchanged and Z increases by 1.',
      'A beta-minus decay emits an electron and an electron antineutrino; the beta electron is created during the decay.',
      'Balance nuclear equations using both nucleon number and proton number.',
      'The neutrino was proposed to account for the apparently missing energy in beta decay measurements.'
    ]},
    5:{section:'3.2.1.3',title:'Particles, antiparticles and photons',points:[
      'Every particle type has a corresponding antiparticle.',
      'Particle and antiparticle have the same mass and rest energy; charged pairs have opposite charge and additive quantum numbers are reversed.',
      'Know the named pairs required here: electron/positron, proton/antiproton, neutron/antineutron and neutrino/antineutrino.',
      'Treat electromagnetic radiation as photons with energy E = hf, where h is the Planck constant.',
      'Particle rest energies are commonly expressed in MeV; neutral particles can still have distinct antiparticles.'
    ]},
    6:{section:'3.2.1.3',title:'Annihilation and pair production',points:[
      'In annihilation, particle–antiparticle energy is converted into other particles; slow electron–positron annihilation is commonly represented by two photons.',
      'The combined electron–positron rest energy is 1.022 MeV, so this is the minimum rest-energy requirement for producing the pair.',
      'Pair production converts photon energy into a particle and its antiparticle; energy above the threshold becomes kinetic/recoil energy.',
      'A nearby nucleus or body can recoil so total momentum can be conserved.',
      'Energy and momentum must both be conserved in annihilation and pair-production processes.'
    ]},
    7:{section:'3.2.1.4',title:'Particle interactions',points:[
      'Know the four fundamental interactions: gravitational, electromagnetic, weak and strong.',
      'Use the exchange-particle model to represent interactions between particles.',
      'Electromagnetic interactions use virtual photons as exchange particles in this specification.',
      'Weak interactions studied here include beta-minus, beta-plus, electron capture and electron–proton collisions, using W⁺ or W⁻ exchange.',
      'Read simple interaction diagrams by identifying incoming particles, the exchanged particle and outgoing particles.',
      'Knowledge of gluons, Z⁰ and gravitons is not tested in this AQA subsection.'
    ]},
    8:{section:'3.2.1.5',title:'Classification of particles',points:[
      'Hadrons experience the strong interaction; leptons do not.',
      'Baryons include proton and neutron; antibaryons include antiproton and antineutron. Baryon number is conserved and the proton is the only stable baryon in this classification.',
      'Mesons include pions and kaons. Pions model the exchange responsible for the strong nuclear force between nucleons; kaons can decay into pions.',
      'Required leptons are electron, muon, electron neutrino and muon neutrino, plus their antiparticles. Track electron and muon lepton numbers separately.',
      'A muon can decay into an electron plus neutrino products.',
      'Strange particles such as kaons are produced through the strong interaction and decay through the weak interaction; total strangeness is conserved in strong production and may change by 0 or ±1 in weak interactions.',
      'Modern particle physics depends on large scientific collaborations checking and validating evidence.'
    ]},
    9:{section:'3.2.1.6',title:'Quarks and antiquarks',points:[
      'Only up, down and strange quarks and their antiquarks are required here.',
      'u has charge +2/3e; d and s have charge −1/3e. Each quark has baryon number +1/3; antiquarks have the opposite additive quantum numbers.',
      'The strange quark has strangeness −1 and the anti-strange quark has strangeness +1.',
      'Required baryons: proton uud and neutron udd; corresponding antibaryons contain three antiquarks.',
      'Required mesons are pions and kaons, each formed from one quark and one antiquark.',
      'Know neutron beta decay and the quark change d → u.'
    ]},
    10:{section:'3.2.1.7',title:'Applications of conservation laws',points:[
      'Apply conservation of electric charge, baryon number, electron lepton number, muon lepton number and strangeness to particle reactions.',
      'For particles outside the required set, use quantum-number data supplied in the question.',
      'Strangeness is conserved in strong interactions; in weak interactions it may change by 0 or ±1.',
      'Know the quark-character changes d → u in beta-minus decay and u → d in beta-plus decay.',
      'Energy and momentum are also conserved in particle interactions.',
      'Test one conserved quantity at a time rather than deciding from charge alone.'
    ]},
    11:{section:'3.2.2.1',title:'The photoelectric effect',points:[
      'Photoelectrons are emitted only when incident radiation exceeds a threshold frequency for that surface.',
      'Explain threshold frequency using the photon model: one electron absorbs one photon of energy hf.',
      'The work function φ is the minimum energy needed to remove an electron from the surface.',
      'Use the photoelectric equation hf = φ + KEmax.',
      'Use stopping potential through KEmax = eVs.',
      'At fixed frequency above threshold, increasing intensity increases the photon arrival rate and therefore mainly changes emission rate, not photon energy.'
    ]},
    12:{section:'3.2.2.2',title:'Collisions of electrons with atoms',points:[
      'Excitation transfers an atomic electron to a higher allowed bound state; ionisation removes an electron completely.',
      'Atomic excitation is quantised because only discrete energy differences are allowed.',
      'Understand how electron collisions cause excitation and ionisation in a fluorescent tube.',
      'Know the electron volt and convert both ways using 1 eV = 1.602 × 10⁻¹⁹ J.',
      'If a collision transfers more energy than required, remaining energy can stay as kinetic energy of the particles.'
    ]},
    13:{section:'3.2.2.3',title:'Energy levels and photon emission',points:[
      'Atomic electrons occupy discrete allowed energy levels rather than a continuous range of bound energies.',
      'A downward transition emits one photon with energy ΔE = hf; an upward transition requires the matching energy input.',
      'Line spectra are evidence for discrete energy differences because only particular photon frequencies and wavelengths are emitted.',
      'Energy levels in exam questions may be given in joules or electronvolts, so convert units before using equations when necessary.',
      'Use ΔE = hf and ΔE = hc/λ to connect energy-level differences to frequency and wavelength.'
    ]},
    14:{section:'3.2.2.4',title:'Wave–particle duality',points:[
      'Electron diffraction is evidence that particles can show wave properties.',
      'The photoelectric effect is evidence that electromagnetic radiation has a particulate nature.',
      'Use the de Broglie relation λ = h/p.',
      'Increasing particle momentum decreases de Broglie wavelength and therefore changes the amount/angle of diffraction for the same structure.',
      'Details of a particular particle-diffraction method are not required; the evidence and momentum relationship are.',
      'Scientific models change when new evidence is evaluated, peer reviewed, replicated and validated by the scientific community.'
    ]},
    15:{section:'3.2 synoptic review',title:'Particles and radiation consolidation',points:[
      'Retrieve all content from 3.2.1.1 to 3.2.1.7 and 3.2.2.1 to 3.2.2.4.',
      'Be fluent with specific charge, photon energy, photoelectric equations, eV/J conversion, energy-level differences and de Broglie wavelength.',
      'Classify particles before applying quantum numbers and conservation laws.',
      'Use precise definitions and link experimental observations to the physical model that explains them.'
    ]},
    16:{section:'3.8.1.1',title:'Rutherford scattering extension',points:[
      'Know the qualitative Rutherford alpha-scattering observations.',
      'Most alpha particles passing through with little deflection implies atoms are mostly empty space.',
      'Rare large-angle/backward scattering implies positive charge and most atomic mass are concentrated in a very small nucleus.',
      'Smaller impact parameter produces closer approach, stronger electrostatic repulsion and a larger scattering angle.',
      'Use Rutherford scattering as an example of experimental evidence replacing or refining a scientific model.'
    ]}
  };

  const starterAnswerBank={
    1:[
      'Protons and neutrons are in the nucleus; electrons occupy the surrounding region.',
      'Atomic number is the number of protons in the nucleus.',
      'A neutral atom has equal numbers of protons and electrons, so its net charge is zero.'
    ],
    2:[
      'Proton charge is +1.602 × 10⁻¹⁹ C and electron charge is −1.602 × 10⁻¹⁹ C.',
      'The electron has much less mass than the proton.',
      'Removing an electron makes the atom or ion more positive by one elementary charge.'
    ],
    3:[
      'Like charges repel, so two positive charges experience electrostatic repulsion.',
      '1 fm = 1 × 10⁻¹⁵ m.',
      'Nucleons are protons and neutrons.'
    ],
    4:[
      'A is nucleon number (protons + neutrons); Z is proton number.',
      'An alpha particle is a helium-4 nucleus containing two protons and two neutrons.',
      'Conservation laws require appropriate totals such as charge, energy and momentum to balance through an isolated decay or interaction.'
    ],
    5:[
      'Frequency is the number of complete oscillations or wave cycles per second, measured in hertz.',
      'Wavelength is the distance between equivalent points on successive waves.',
      'c is the speed of light in vacuum, approximately 3.00 × 10⁸ m s⁻¹.'
    ],
    6:[
      'The electron rest energy is about 0.511 MeV.',
      'Photon energy is E = hf.',
      'Energy, momentum and the relevant quantum numbers must be conserved.'
    ],
    7:[
      'Examples from earlier study include gravitational and electromagnetic interactions; particle physics also requires weak and strong interactions.',
      'Momentum can be transferred in a collision or interaction.',
      'In beta-minus decay neutron character changes to proton character; in beta-plus decay proton character changes to neutron character.'
    ],
    8:[
      'Yes. Protons are hadrons and experience the strong interaction.',
      'An electron or electron neutrino is an electron-family lepton.',
      'An antiparticle has the same mass as its partner but opposite relevant additive quantum numbers; charged pairs have opposite charge.'
    ],
    9:[
      'A baryon is a hadron made from three quarks.',
      'A meson is a hadron made from one quark and one antiquark.',
      'Strangeness is a quantum number associated with strange quarks; s has S = −1 and anti-s has S = +1.'
    ],
    10:[
      'A quark has baryon number +1/3; an antiquark has −1/3.',
      'Electron lepton number is +1 for e⁻ and νe, −1 for their antiparticles, and 0 for non-electron-family particles.',
      'Strangeness is conserved in strong interactions; in weak interactions it may change by 0 or ±1.'
    ],
    11:[
      'Photon energy is E = hf.',
      'A photon is a quantum of electromagnetic radiation.',
      'Kinetic energy is energy associated with motion.'
    ],
    12:[
      'An energy level is an allowed discrete energy state for an atomic electron.',
      'Ionisation means removing an electron completely from an atom.',
      'The elementary charge magnitude is e = 1.602 × 10⁻¹⁹ C.'
    ],
    13:[
      'Excitation moves a bound electron to a higher allowed energy level without removing it from the atom.',
      'Photon energy is E = hf.',
      'When an electron moves to a lower energy level it loses energy, normally by emitting a photon.'
    ],
    14:[
      'The photoelectric effect shows that electromagnetic radiation transfers energy in discrete photon packets.',
      'Diffraction is a characteristic wave effect.',
      'For non-relativistic motion momentum is p = mv.'
    ],
    15:[
      'The AQA 3.2 sequence runs from constituents of the atom through conservation laws, then photoelectric effect, electron collisions, energy levels and wave–particle duality.',
      'Core equations include Q/m, E = hf, hf = φ + KEmax, KEmax = eVs, ΔE = hf, λ = h/p and 1 eV = 1.602 × 10⁻¹⁹ J.',
      'Examples include: isotope versus ion, intensity versus photon energy, excitation versus ionisation, and charge conservation alone being insufficient for particle reactions.'
    ],
    16:[
      'An alpha particle is a helium-4 nucleus with charge +2e.',
      'The alpha particle and nucleus are both positively charged, so they repel electrostatically.',
      'Mostly empty space means the nucleus occupies only a tiny fraction of the atom’s volume.'
    ]
  };

  function esc(value){
    return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  function textbookHTML(l){
    const chapter=localTextbook(l.n);
    if(!chapter)return '';
    const saved=textbookAnswers[l.n]||[],mastery=textbookMastery[l.n]||{},zh=isMandarin();
    const secureCount=chapter.sections.reduce((n,_,i)=>n+(mastery[i]==='secure'?1:0),0);
    return '<section class="lesson-textbook"><div class="textbook-title"><div><span class="eyebrow">'+(zh?'引导式小教材':'Guided mini textbook')+'</span><h3>'+chapter.title+'</h3></div><span class="textbook-mastery-count">'+secureCount+' / '+chapter.sections.length+(zh?' 个章节已掌握':' sections secure')+'</span></div>'+
      '<div class="textbook-mastery-track"><div style="width:'+(chapter.sections.length?secureCount/chapter.sections.length*100:0)+'%"></div></div>'+
      '<p class="textbook-intro">'+(zh?'每次只学习一个章节。先阅读解释，再用要点总结；随后不看答案完成检查题，最后再打开参考答案。完成后标记“已理解”或“需要更多帮助”。':'Read one section at a time. Use the key points to summarise it, answer the checkpoint from memory, then reveal the model response. Finish by marking whether you understand it or need more help.')+'</p>'+
      '<div class="textbook-sections">'+chapter.sections.map((sec,i)=>{
        const status=mastery[i]||'';
        return '<details class="textbook-section '+(status==='secure'?'secure ':status==='help'?'needs-help ':'')+'" '+(i===0?'open':'')+' data-textbook-section="'+i+'"><summary><span>'+(i+1)+'</span><strong>'+sec.h+'</strong><em class="textbook-section-state">'+(status==='secure'?(zh?'✓ 已掌握':'✓ Secure'):status==='help'?(zh?'需要帮助':'Needs help'):'')+'</em></summary>'+
        '<div class="textbook-section-body">'+sec.p.map(p=>'<p>'+p+'</p>').join('')+
          '<div class="textbook-keyfacts"><span class="eyebrow">'+(zh?'必须记住的要点':'Key points to retain')+'</span><ul>'+sec.k.map(k=>'<li>'+k+'</li>').join('')+'</ul></div>'+
          '<div class="textbook-check"><span class="eyebrow">'+(zh?'检查你的理解':'Check your understanding')+'</span><strong>'+sec.q+'</strong>'+
            '<textarea rows="3" data-textbook-input="'+i+'" placeholder="'+(zh?'请先写出答案，再查看参考答案……':'Write your answer before revealing the model response...')+'">'+esc(saved[i]||'')+'</textarea>'+
            '<div class="textbook-save-state" data-textbook-status="'+i+'">'+((saved[i]||'').trim()?(zh?'已保存在此设备':'Saved on this device'):(zh?'尚未作答':'Not answered yet'))+'</div>'+
            '<details class="textbook-model"><summary>'+(zh?'显示参考答案':'Reveal model response')+'</summary><p>'+sec.a+'</p></details>'+
            '<div class="textbook-confidence"><span>'+ (zh?'这一节你掌握了吗？':'How secure are you on this section?') +'</span><div><button type="button" class="button '+(status==='help'?'active':'')+'" data-textbook-help="'+i+'">'+(zh?'我需要更多帮助':'I need more help')+'</button><button type="button" class="button primary '+(status==='secure'?'active':'')+'" data-textbook-secure="'+i+'">'+(zh?'✓ 我理解了 — 继续':'✓ I understand — continue')+'</button></div></div>'+
          '</div></div></details>';
      }).join('')+'</div></section>';
  }

  function aqaCoverageHTML(l){
    const item=localSpec(l.n);
    if(!item)return '';
    const zh=isMandarin();
    return '<section class="aqa-core-knowledge"><div class="aqa-core-head"><div><span class="eyebrow">'+(zh?'AQA 7408 规格要求覆盖':'AQA 7408 specification coverage')+'</span><strong>'+item.section+' · '+item.title+'</strong></div><span>'+item.points.length+(zh?' 个必会要点':' must-know points')+'</span></div>'+
      '<p class="aqa-core-intro">'+(zh?'把这里作为本课的知识清单。下方的小教材、学习段和活动会逐项解释并应用这些要求。':'Use this as the knowledge checklist for the lesson. The teaching chunks below explain and apply each point.')+'</p>'+
      '<ul>'+item.points.map(p=>'<li>'+p+'</li>').join('')+'</ul></section>';
  }

  function starterHTML(l){
    const zh=isMandarin(),z=zhLesson(l.n);
    const models=zh?(z?.recall||[]).map(x=>x[1]):starterAnswerBank[l.n]||[];
    const questions=zh?(z?.recall||[]).map(x=>x[0]):l.recall;
    const saved=starterAnswers[l.n]||[];
    return '<div class="starter-answer-grid">'+questions.map((q,i)=>
      '<article class="starter-question-card"><div class="starter-question-head"><span>'+(i+1)+'</span><strong>'+q+'</strong></div>'+
      '<textarea rows="3" data-starter-input="'+i+'" placeholder="'+(zh?'在这里输入答案……':'Type your answer here...')+'">'+esc(saved[i]||'')+'</textarea>'+
      '<div class="starter-save-state" data-starter-status="'+i+'">'+((saved[i]||'').trim()?(zh?'已保存在此设备':'Saved on this device'):(zh?'尚未作答':'Not answered yet'))+'</div>'+
      (models[i]?'<details class="starter-model-answer"><summary>'+(zh?'完成尝试后查看参考答案':'Check model answer after attempting')+'</summary><p>'+models[i]+'</p></details>':'')+
      '</article>').join('')+'</div>';
  }

  const keywordBank={
    1:[['nucleon','A proton or neutron in the nucleus.'],['proton number, Z','The number of protons; it identifies the element.'],['nucleon number, A','The total number of protons and neutrons.'],['isotope','Atoms of the same element with the same Z but different neutron numbers.'],['ion','An atom or group with unequal numbers of protons and electrons.']],
    2:[['specific charge','Charge per unit mass, Q/m, measured in C kg⁻¹.'],['net charge','The total charge after positive and negative charges are combined.'],['cation','A positively charged ion.'],['anion','A negatively charged ion.'],['charge-to-mass ratio','Another description of specific charge.']],
    3:[['strong nuclear force','The short-range interaction between nucleons.'],['electrostatic repulsion','Repulsion between positively charged protons.'],['femtometre','10⁻¹⁵ m, a useful nuclear distance scale.'],['attractive','A force tending to pull particles together.'],['repulsive','A force tending to push particles apart.']],
    4:[['alpha particle','A helium-4 nucleus containing two protons and two neutrons.'],['beta-minus particle','An electron created and emitted in β⁻ decay.'],['antineutrino','A neutral antilepton emitted in β⁻ decay.'],['daughter nucleus','The nucleus remaining after a radioactive decay.'],['conservation law','A quantity that must have the same total before and after an interaction.']],
    5:[['photon','A quantum of electromagnetic radiation.'],['antiparticle','A particle with the same mass as its partner but opposite relevant additive quantum numbers.'],['rest energy','Energy associated with rest mass.'],['electronvolt','The energy transferred to one electron through a potential difference of one volt.'],['frequency','Number of wave cycles per second.']],
    6:[['annihilation','A particle and antiparticle interact and their energy appears in other particles.'],['pair production','Photon energy creates a particle–antiparticle pair.'],['threshold energy','The minimum energy required for a process.'],['rest energy','Energy associated with particle mass.'],['momentum conservation','Total momentum is unchanged through an isolated interaction.']],
    7:[['fundamental interaction','One of the basic interactions of nature.'],['exchange particle','A particle used to represent how an interaction is mediated.'],['virtual photon','The exchange particle used for electromagnetic interactions in the AQA model.'],['W boson','W⁺ or W⁻ exchange particle involved in weak interactions studied here.'],['interaction vertex','A point on a particle diagram where particles interact.']],
    8:[['hadron','A particle that experiences the strong interaction.'],['baryon','A hadron made from three quarks.'],['meson','A hadron made from a quark and an antiquark.'],['lepton','A fundamental particle that does not experience the strong interaction.'],['strangeness','An additive quantum number associated with strange quarks.'],['lepton number','A conserved additive quantum number tracked separately for lepton families.']],
    9:[['quark','A fundamental constituent of hadrons.'],['antiquark','The antiparticle of a quark.'],['up quark','u quark with charge +2/3 e.'],['down quark','d quark with charge −1/3 e.'],['strange quark','s quark with charge −1/3 e and strangeness −1.'],['baryon number','An additive quantum number: +1/3 for a quark and −1/3 for an antiquark.']],
    10:[['charge conservation','Total electric charge is the same before and after an interaction.'],['baryon number conservation','Total baryon number is conserved.'],['lepton number conservation','Each relevant lepton-family number is conserved.'],['strangeness','Conserved in strong interactions but may change in weak interactions.'],['allowed reaction','A reaction consistent with the required conservation laws.']],
    11:[['photoelectric effect','Emission of electrons from a surface due to incident electromagnetic radiation.'],['work function, φ','Minimum energy needed to remove an electron from a surface.'],['threshold frequency','Minimum light frequency needed for photoemission.'],['stopping potential','Potential difference that stops the fastest emitted photoelectrons.'],['maximum kinetic energy','Greatest kinetic energy of emitted photoelectrons.']],
    12:[['excitation','A bound electron moves to a higher allowed energy level.'],['ionisation','An electron is removed completely from an atom.'],['ground state','The lowest allowed atomic energy state.'],['energy level','An allowed discrete energy of an atomic electron.'],['electronvolt','A convenient microscopic energy unit equal to 1.602 × 10⁻¹⁹ J.']],
    13:[['energy level','A discrete allowed energy state in an atom.'],['transition','A change between allowed energy levels.'],['line spectrum','A spectrum containing discrete wavelengths.'],['emission','Release of a photon when an electron moves to a lower energy level.'],['absorption','Gain of photon energy that raises an electron to a higher allowed level.']],
    14:[['de Broglie wavelength','Matter-wave wavelength λ = h/p.'],['wave–particle duality','The idea that quantum objects show both wave-like and particle-like behaviour.'],['diffraction','Wave spreading/interference produced by an obstacle or periodic structure.'],['momentum','For de Broglie waves, greater momentum means shorter wavelength.'],['electron diffraction','Evidence for the wave behaviour of electrons.']],
    15:[['retrieval','Recalling knowledge without notes.'],['synoptic','Linking knowledge from several parts of the topic.'],['equation selection','Choosing the correct relationship before substituting values.'],['exam command word','A word such as state, explain or calculate that tells you what the question requires.'],['error log','A record of mistakes used to target revision.']],
    16:[['alpha scattering','Deflection of alpha particles by atomic nuclei.'],['impact parameter','Perpendicular offset of an incoming particle from the nucleus centre if undeflected.'],['nuclear model','Model in which positive charge and most mass are concentrated in a tiny nucleus.'],['Coulomb repulsion','Electrostatic repulsion between positive charges.'],['scattering angle','Change in direction of an alpha particle after passing the nucleus.']]
  };

  function keywordHTML(l){
    const words=localKeywords(l.n);
    if(!words.length)return '';
    return '<div class="lesson-keywords"><span class="eyebrow">'+(isMandarin()?'关键词':'Key words')+'</span><div class="lesson-keyword-grid">'+words.map(w=>'<div class="lesson-keyword"><strong>'+w[0]+'</strong><span>'+w[1]+'</span></div>').join('')+'</div></div>';
  }

  function shortTestHTML(l){
    const zh=isMandarin(),bank=localPractice(l.n);
    const count=Math.min(5,Math.max(3,bank.length));
    const chosen=bank.slice(0,count),saved=shortTestAnswers[l.n]||[];
    const answered=chosen.reduce((n,_,i)=>n+((saved[i]||'').trim()?1:0),0);
    return '<div class="lesson-short-test"><div class="short-test-intro"><div><strong>'+(zh?'课末小测验':'Short end-of-lesson test')+'</strong><p>'+(zh?'先不看笔记完成。答案会自动保存；然后打开每题参考答案进行自我检查。':'Complete this without notes first. Your answers save automatically; then open each mark point and self-check.')+'</p></div><span class="short-test-progress">'+answered+' / '+chosen.length+(zh?' 已作答':' answered')+'</span></div>'+
      chosen.map((q,i)=>'<article class="short-test-question"><span>Q'+(i+1)+'</span><div><strong>'+q[0]+'</strong><p>'+q[1]+'</p><textarea rows="2" data-short-test-input="'+i+'" placeholder="'+(zh?'检查前先写出你的答案……':'Write your answer before checking...')+'">'+esc(saved[i]||'')+'</textarea><small data-short-test-status="'+i+'">'+((saved[i]||'').trim()?(zh?'已保存':'Saved'):(zh?'尚未作答':'Not answered yet'))+'</small><details><summary>'+(zh?'显示评分点':'Reveal mark point')+'</summary><p>'+q[2]+'</p></details></div></article>').join('')+
      '<div class="lesson-ready"><strong>'+(zh?'掌握检查：':'Mastery check:')+'</strong> '+(zh?'目标是在不看笔记的情况下准确回答所有问题；若缺少关键点，返回相应学习章节。':'Aim to answer every question accurately without notes. Revisit the relevant teaching chunk if a mark point is missing.')+'</div></div>';
  }

  const CURRENT_STORE='particleLessonCurrentV2';
  const STAGE_STORE='particleLessonStagesV2';
  const VIEW_STORE='particleLessonViewV2';
  const CHUNK_POS_STORE='particleLessonChunkPositionV3';
  const STARTER_STORE='particleLessonStarterAnswersV1';
  const TEXTBOOK_STORE='particleLessonTextbookAnswersV1';
  const TEXTBOOK_MASTERY_STORE='particleLessonTextbookMasteryV1';
  const INVESTIGATION_STORE='particleLessonInvestigationV1';
  const SHORT_TEST_STORE='particleLessonShortTestAnswersV1';
  const CHUNK_ACTIVITY_STORE='particleLessonChunkActivityAnswersV1';
  const PRACTICE_STORE='particleLessonPracticeAnswersV1';
  const stages=[
    {id:'recall',label:'Starter / retrieval',short:'Starter',time:'5 min'},
    {id:'objectives',label:'Key words & objectives',short:'Set up',time:'3 min'},
    {id:'teach',label:'Learn in chunks',short:'Learn',time:'20–25 min'},
    {id:'simulate',label:'Apply / investigate',short:'Apply',time:'10 min'},
    {id:'practice',label:'Exam practice',short:'Practice',time:'8–10 min'},
    {id:'exit',label:'Short test',short:'Test',time:'5–8 min'},
    {id:'next',label:'Review & next steps',short:'Review',time:'2 min'}
  ];

  let completed=new Set(),stageDone={},chunkPosition={},starterAnswers={},textbookAnswers={},textbookMastery={},investigationNotes={},shortTestAnswers={},chunkActivityAnswers={},practiceAnswers={},current=0,activeStage=0,lessonView='guided';
  try{completed=new Set(JSON.parse(localStorage.getItem(STORE)||'[]'))}catch{}
  try{stageDone=JSON.parse(localStorage.getItem(STAGE_STORE)||'{}')||{}}catch{}
  try{
    const saved=JSON.parse(localStorage.getItem(CURRENT_STORE)||'{}');
    if(Number.isInteger(saved.lesson))current=Math.max(0,Math.min(lessons.length-1,saved.lesson));
    if(Number.isInteger(saved.stage))activeStage=Math.max(0,Math.min(stages.length-1,saved.stage));
  }catch{}
  try{lessonView=localStorage.getItem(VIEW_STORE)||'guided'}catch{}
  try{chunkPosition=JSON.parse(localStorage.getItem(CHUNK_POS_STORE)||'{}')||{}}catch{}
  try{starterAnswers=JSON.parse(localStorage.getItem(STARTER_STORE)||'{}')||{}}catch{}
  try{textbookAnswers=JSON.parse(localStorage.getItem(TEXTBOOK_STORE)||'{}')||{}}catch{}
  try{textbookMastery=JSON.parse(localStorage.getItem(TEXTBOOK_MASTERY_STORE)||'{}')||{}}catch{}
  try{investigationNotes=JSON.parse(localStorage.getItem(INVESTIGATION_STORE)||'{}')||{}}catch{}
  try{shortTestAnswers=JSON.parse(localStorage.getItem(SHORT_TEST_STORE)||'{}')||{}}catch{}
  try{chunkActivityAnswers=JSON.parse(localStorage.getItem(CHUNK_ACTIVITY_STORE)||'{}')||{}}catch{}
  try{practiceAnswers=JSON.parse(localStorage.getItem(PRACTICE_STORE)||'{}')||{}}catch{}

  function saveAll(){
    localStorage.setItem(STORE,JSON.stringify([...completed]));
    localStorage.setItem(STAGE_STORE,JSON.stringify(stageDone));
    localStorage.setItem(CURRENT_STORE,JSON.stringify({lesson:current,stage:activeStage}));
    localStorage.setItem(VIEW_STORE,lessonView);
    localStorage.setItem(CHUNK_POS_STORE,JSON.stringify(chunkPosition));
    localStorage.setItem(STARTER_STORE,JSON.stringify(starterAnswers));
    localStorage.setItem(TEXTBOOK_STORE,JSON.stringify(textbookAnswers));
    localStorage.setItem(TEXTBOOK_MASTERY_STORE,JSON.stringify(textbookMastery));
    localStorage.setItem(INVESTIGATION_STORE,JSON.stringify(investigationNotes));
    localStorage.setItem(SHORT_TEST_STORE,JSON.stringify(shortTestAnswers));
    localStorage.setItem(CHUNK_ACTIVITY_STORE,JSON.stringify(chunkActivityAnswers));
    localStorage.setItem(PRACTICE_STORE,JSON.stringify(practiceAnswers));
    updateProgress();
  }

  function doneStagesFor(n){
    return new Set(stageDone[n]||[]);
  }

  function markStage(stageId,on=true){
    const l=lessons[current],set=doneStagesFor(l.n);
    if(on)set.add(stageId);else set.delete(stageId);
    stageDone[l.n]=[...set];
    if(set.size===stages.length)completed.add(l.n);
    else completed.delete(l.n);
    saveAll();
  }

  function setStage(i,scroll=false){
    activeStage=Math.max(0,Math.min(stages.length-1,i));
    lessonView='guided';
    saveAll();
    renderLesson();
    if(scroll){
      requestAnimationFrame(()=>$('#lessonPanel .lesson-active-section')?.scrollIntoView({behavior:'smooth',block:'nearest'}));
    }
  }


  function activeChunkFor(l){
    const max=Math.max(0,(l?.teach?.length||1)-1);
    const raw=Number(chunkPosition[l?.n]);
    return Number.isInteger(raw)?Math.max(0,Math.min(max,raw)):0;
  }

  function setActiveChunk(l,index,scroll=false){
    if(!l?.teach?.length)return;
    chunkPosition[l.n]=Math.max(0,Math.min(l.teach.length-1,Number(index)||0));
    saveAll();
    renderLesson();
    if(scroll){
      requestAnimationFrame(()=>{
        const target=$('#lessonPanel .lesson-chunk-rich[data-lesson-chunk="'+activeChunkFor(l)+'"]');
        if(target){target.open=true;target.scrollIntoView({behavior:'smooth',block:'start'});}
      });
    }
  }

  function teachingStageHTML(l){
    const active=activeChunkFor(l);
    const guided=lessonView==='guided';
    const selector=guided?
      '<div class="core-chunk-nav"><div class="core-chunk-status"><span class="eyebrow">'+(isMandarin()?'教学顺序':'Teaching sequence')+'</span><strong>'+(isMandarin()?'学习段 ':'Chunk ')+(active+1)+(isMandarin()?' / ':' of ')+l.teach.length+'</strong><small>'+((chunkActivityAnswers[l.n]||[]).filter(x=>String(x||'').trim()).length)+' / '+l.teach.length+(isMandarin()?' 个活动已作答':' activities answered')+'</small></div><div class="chunk-selector" role="tablist" aria-label="Lesson teaching chunks">'+
        l.teach.map((x,i)=>'<button type="button" role="tab" data-core-chunk="'+i+'" class="'+(i===active?'active':'')+'" aria-selected="'+(i===active?'true':'false')+'"><span>'+(i+1)+'</span><strong>'+x[0].replace(/^\d+\.\s*/,'')+'</strong></button>').join('')+
      '</div></div>':'';

    const cards='<div class="lesson-check-list native-chunk-list">'+l.teach.map((x,i)=>{
      const cs=chunkSupport(l,i);
      const open=(!guided||i===active)?' open':'';
      return '<details class="lesson-check lesson-chunk-rich '+(guided&&i===active?'active-chunk':'')+'" data-lesson-chunk="'+i+'"'+open+'>'+
        '<summary class="native-chunk-summary"><span class="native-chunk-number">'+(i+1)+'</span><span><small>'+(isMandarin()?'教学学习段 ':'Teaching chunk ')+(i+1)+(isMandarin()?' / ':' of ')+l.teach.length+'</small><strong>'+x[0].replace(/^\d+\.\s*/,'')+'</strong></span></summary>'+
        '<div class="native-chunk-content">'+
          '<div class="lesson-chunk-main"><span class="eyebrow">'+(isMandarin()?'核心概念':'Core idea')+'</span><p>'+x[1]+'</p></div>'+
          '<div class="lesson-chunk-detail"><span class="eyebrow">'+(isMandarin()?'关键信息':'Key information')+'</span><p>'+cs.detail+'</p></div>'+
          '<div class="lesson-chunk-task"><span class="eyebrow">'+(isMandarin()?'活动':'Activity')+'</span><strong>'+cs.taskTitle+'</strong><p>'+cs.task+'</p>'+
            '<textarea rows="3" data-chunk-activity-input="'+i+'" placeholder="'+(isMandarin()?'先在这里完成活动……':'Complete the activity here before checking...')+'">'+esc((chunkActivityAnswers[l.n]||[])[i]||'')+'</textarea>'+
            '<small data-chunk-activity-status="'+i+'">'+(((chunkActivityAnswers[l.n]||[])[i]||'').trim()?(isMandarin()?'已保存':'Saved'):(isMandarin()?'尚未作答':'Not answered yet'))+'</small>'+
            '<details class="chunk-answer"><summary>'+(isMandarin()?'完成尝试后再查看答案':'Check the answer only after attempting it')+'</summary><p>'+cs.answer+'</p></details></div>'+
          '<div class="lesson-chunk-exam"><span class="eyebrow">'+(isMandarin()?'考试表述':'Exam language')+'</span><p>'+cs.exam+'</p></div>'+
        '</div>'+
      '</details>';
    }).join('')+'</div>';

    const controls=guided?
      '<div class="chunk-switch-actions"><button type="button" class="button" id="coreChunkPrev" '+(active===0?'disabled':'')+'>← '+(isMandarin()?'上一学习段':'Previous chunk')+'</button><button type="button" class="button primary" id="coreChunkNext" '+(active===l.teach.length-1?'disabled':'')+'>'+(isMandarin()?'下一学习段':'Next chunk')+' →</button></div>':'';

    return selector+cards+controls+
      (l.equations.length?'<div class="lesson-key-equation"><span class="eyebrow">'+(isMandarin()?'本课公式':'Equations from this lesson')+'</span>'+l.equations.map(x=>'<code>'+x+'</code>').join('')+'</div>':'');
  }

  function updateProgress(){
    const done=completed.size,total=lessons.length;
    if($('#overallProgressText'))$('#overallProgressText').textContent=done+' / '+total+' lessons complete';
    if($('#overallProgressBar'))$('#overallProgressBar').style.width=(done/total*100)+'%';
    if($('#lessonSequenceProgress'))$('#lessonSequenceProgress').textContent=done+' / '+total;
    if($('#lessonSequenceFill'))$('#lessonSequenceFill').style.width=(done/total*100)+'%';
    const currentDone=doneStagesFor(lessons[current]?.n).size;
    if($('#lessonStepProgress'))$('#lessonStepProgress').textContent=currentDone+' / '+stages.length+' steps';
    if($('#lessonStepFill'))$('#lessonStepFill').style.width=(currentDone/stages.length*100)+'%';
  }

  function openView(view,sim){
    document.querySelector('[data-view="'+view+'"]')?.click();
    if(view==='lab'&&sim){
      setTimeout(()=>{
        window.PARTICLELAB_CORE?.activateSim?.(sim);
        document.querySelector('.sim-tab[data-sim="'+sim+'"]')?.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
      },70);
    }
  }

  function phaseGroups(){
    const groups=[];
    for(const l of lessons){
      let g=groups.find(x=>x.phase===l.phase);
      if(!g){g={phase:l.phase,items:[]};groups.push(g)}
      g.items.push(l);
    }
    return groups;
  }

  function renderList(){
    const list=$('#courseList');if(!list)return;
    list.className='course-list lesson-sequence-sidebar';
    list.innerHTML=phaseGroups().map(g=>
      '<div class="lesson-phase-heading">'+phaseLabel(g.phase)+'</div>'+
      g.items.map(base=>{
        const l=localLesson(base),i=lessons.indexOf(base),done=completed.has(base.n),stepCount=doneStagesFor(base.n).size;
        return '<button class="lesson-route-button '+(i===current?'active ':'')+(done?'complete':'')+'" data-seq-lesson="'+i+'">'+
          '<span class="lesson-route-number">'+(done?'✓':base.n)+'</span>'+
          '<span class="lesson-route-title"><strong>'+l.title+'</strong><span>'+base.code+' · '+stepCount+'/'+stages.length+(isMandarin()?' 步':' steps')+'</span></span>'+
          '<span class="lesson-route-status">'+(done?'done':(i===current?'now':''))+'</span></button>';
      }).join('')
    ).join('');
    $$('[data-seq-lesson]',list).forEach(b=>b.onclick=()=>{
      current=+b.dataset.seqLesson;
      lessonView='guided';
      const nextUndone=stages.findIndex(s=>!doneStagesFor(lessons[current].n).has(s.id));
      activeStage=nextUndone<0?0:nextUndone;
      saveAll();renderList();renderLesson();
    });
  }

  function investigationNotebookHTML(l){
    const zh=isMandarin(),saved=investigationNotes[l.n]||{};
    const fields=[
      ['prediction',zh?'预测':'Prediction',zh?'在运行模拟前，你认为会发生什么？说明理由。':'Before running the simulation, what do you predict will happen? Explain why.'],
      ['observation',zh?'观察':'Observation',zh?'改变一个变量后，你实际观察到了什么？':'After changing one variable, what did you actually observe?'],
      ['explanation',zh?'物理解释':'Physics explanation',zh?'用本课的 AQA 物理知识解释你的观察结果。':'Explain your observation using the AQA physics from this lesson.']
    ];
    const done=fields.reduce((n,[k])=>n+((saved[k]||'').trim()?1:0),0);
    return '<section class="investigation-notebook"><div class="investigation-head"><div><span class="eyebrow">'+(zh?'模拟探究记录':'Simulation investigation notebook')+'</span><strong>'+(zh?'预测 → 观察 → 解释':'Predict → observe → explain')+'</strong></div><span>'+done+' / 3 '+(zh?'已完成':'complete')+'</span></div>'+
      '<p>'+(zh?'像物理学家一样使用模拟：先预测，只改变一个变量，记录观察结果，再用规范物理语言解释。':'Use the model like a physicist: predict first, change one variable, record what you observe, then explain it using precise physics.')+'</p>'+
      '<div class="investigation-grid">'+fields.map(([key,label,prompt])=>
        '<label class="investigation-field"><span><strong>'+label+'</strong><small>'+prompt+'</small></span><textarea rows="3" data-investigation="'+key+'" placeholder="'+prompt+'">'+esc(saved[key]||'')+'</textarea><em data-investigation-status="'+key+'">'+((saved[key]||'').trim()?(zh?'已保存':'Saved'):(zh?'尚未填写':'Not completed'))+'</em></label>'
      ).join('')+'</div></section>';
  }

  function stageBody(l,stageId){
    const zh=isMandarin();
    if(stageId==='recall'){
      const older=[];
      if(current>0){const p=localLesson(lessons[current-1]);older.push(p.exit[0]);}
      if(current>1){const p=localLesson(lessons[current-2]);older.push(p.exit[1]||p.exit[0]);}
      return '<div class="lesson-stage-guidance"><strong>'+bi('Starter instructions','启动任务说明')+'</strong><p>'+bi('Answer from memory in the boxes below. Your responses save automatically on this device. Only reveal the model answer after you have made a genuine attempt.','请在下方输入框中凭记忆作答。答案会自动保存在此设备上。认真尝试后再查看参考答案。')+'</p></div>'+
        starterHTML(l)+
        (older.length?'<div class="cumulative-retrieval"><span class="eyebrow">'+bi('Cumulative retrieval','累积检索')+'</span><ol>'+older.map(x=>'<li>'+x+'</li>').join('')+'</ol><p class="small subtle">'+bi('These deliberately revisit earlier learning so knowledge is retained.','这些问题会有意回顾较早内容，帮助长期记忆。')+'</p></div>':'');
    }
    if(stageId==='objectives')return keywordHTML(l)+
      '<div class="lesson-objective-block"><span class="eyebrow">'+bi('By the end of this lesson you should be able to','本课结束时你应该能够')+'</span><ul>'+l.objectives.map(x=>'<li>'+x+'</li>').join('')+'</ul></div>'+
      '<div class="lesson-stage-guidance"><strong>'+bi('How to use this lesson','如何使用本课')+'</strong><p>'+bi('Work through the teaching chunks in order. Each chunk gives you the information first, then an activity and answer check before you move on.','按顺序完成各学习段。每一段先给出知识讲解，再完成活动并核对答案，然后进入下一段。')+'</p></div>';
    if(stageId==='teach')return '<div class="lesson-learning-cycle-intro"><strong>'+bi('Learn → apply → check → continue','学习 → 应用 → 检查 → 继续')+'</strong><p>'+bi('Work through the chunks in order. Read the key information, complete the activity before revealing the answer, then use Next chunk.','按顺序学习。先阅读关键信息，完成活动后再查看答案，然后进入下一学习段。')+'</p></div>'+textbookHTML(l)+aqaCoverageHTML(l)+teachingStageHTML(l);
    if(stageId==='simulate')return '<div class="lesson-stage-guidance"><strong>'+bi('Apply the knowledge','应用知识')+'</strong><p>'+bi('Predict first, use the model or activity second, then explain what happened using the physics from the teaching chunks.','先做预测，再使用模型或活动，最后用本课学习的物理知识解释观察结果。')+'</p></div>'+investigationNotebookHTML(l)+'<p>'+l.simTask+'</p>'+
      (l.n===1?'<div class="lesson-ready"><strong>'+bi('Atom-builder goal:','原子构建目标：')+'</strong> '+bi('Complete the first four Atom Builder Practice targets in order. They teach Z → A → neutrons → electrons before the sodium-23 question.','按顺序完成前四个原子构建练习：Z → A → 中子 → 电子，然后再完成钠-23。')+'</div>':'')+
      '<div class="lesson-actions-sequence lesson-inline-actions">'+
      (l.sim?'<button class="button primary" id="sequenceActivity">'+bi('Open simulation','打开模拟')+'</button>':'<button class="button primary" id="sequenceActivity">'+(l.viewLabel||bi('Open activity','打开活动'))+'</button>')+
      (l.n===1?'<button class="button" id="sequenceAtomPractice">'+bi('Open atom-builder practice','打开原子构建练习')+'</button>':'')+
      '<button class="button" id="sequenceFullTools">'+bi('Open full learning tools','打开完整学习工具')+'</button></div>';
    if(stageId==='practice')return '<div class="lesson-stage-guidance"><strong>'+bi('Exam practice','考试练习')+'</strong><p>'+bi('Use the worked example to model the method, then complete the independent questions without copying it.','先学习示例方法，再独立完成练习，不要直接照抄示例。')+'</p></div>'+
      '<p><strong>'+bi('Worked example:','示例：')+'</strong> '+l.worked+'</p><p><strong>'+bi('High-value exam wording:','高分考试表述：')+'</strong> '+l.exam+'</p>'+taskBankHTML(l.n)+
      '<div class="lesson-actions-sequence lesson-inline-actions"><button class="button primary" id="sequenceExamPractice">'+bi('Open additional exam questions','打开更多考试题')+'</button></div>';
    if(stageId==='exit')return shortTestHTML(l);
    return '<div class="lesson-stage-guidance"><strong>'+bi('Review the lesson','复习本课')+'</strong><p>'+bi('Return to any chunk you could not explain confidently. Then complete the homework or move to the next lesson.','返回任何你还不能自信解释的学习段，然后完成作业或进入下一课。')+'</p></div>'+
      '<p><strong>'+bi('Homework:','作业：')+'</strong> '+l.homework+'</p><p><strong>'+bi('Next lesson:','下一课：')+'</strong> '+l.next+'</p>'+
      (current<lessons.length-1?'<div class="lesson-next-preview"><span>'+bi('Up next','接下来')+'</span><strong>'+localLesson(lessons[current+1]).title+'</strong><p>'+localLesson(lessons[current+1]).overview+'</p></div>':'<div class="lesson-ready"><strong>'+bi('Sequence complete.','课程序列完成。')+'</strong> '+bi('Use the Mastery Map and mixed quiz for targeted revision.','使用掌握度地图和混合测验进行针对性复习。')+'</div>');
  }

  function sectionClass(id){
    return id==='recall'?'recall':id==='objectives'?'objective':id==='teach'?'teach':id==='simulate'?'sim':id==='practice'?'practice':id==='exit'?'exit':'next';
  }

  function renderGuidedContent(l){
    const step=stages[activeStage],done=doneStagesFor(l.n),isDone=done.has(step.id),stepLabel=lessonUI(step.label),stepTime=lessonTime(step.time);
    return '<div class="lesson-current-step">'+
      '<div class="lesson-now-banner"><div><span class="eyebrow">'+bi('Do this now','现在完成')+' · '+bi('Step','步骤')+' '+(activeStage+1)+' / '+stages.length+'</span><h3>'+stepLabel+'</h3><p>'+stepTime+'</p></div>'+
      '<div class="lesson-step-progress"><span id="lessonStepProgress">'+done.size+' / '+stages.length+' '+bi('steps','步')+'</span><div class="lesson-route-track compact"><div id="lessonStepFill" class="lesson-route-fill" style="width:'+(done.size/stages.length*100)+'%"></div></div></div></div>'+
      '<section class="lesson-section '+sectionClass(step.id)+' lesson-active-section"><span class="lesson-mini-time">'+stepTime+'</span><h3>'+stepLabel+'</h3>'+stageBody(l,step.id)+'</section>'+
      '<div class="lesson-step-actions">'+
        '<button class="button" id="lessonStepBack" '+(activeStage===0?'disabled':'')+'>← '+bi('Previous step','上一步')+'</button>'+
        '<button class="button primary" id="lessonStepDone">'+(isDone?bi('✓ Done — next step','✓ 已完成 — 下一步'):bi('Mark step done →','标记本步骤完成 →'))+'</button>'+
      '</div></div>';
  }

  function renderFullPlan(l){
    return '<div class="lesson-content lesson-full-plan">'+stages.map((st,i)=>
      '<section class="lesson-section '+sectionClass(st.id)+'" data-full-stage="'+i+'"><span class="lesson-mini-time">'+lessonTime(st.time)+'</span><h3>'+lessonUI(st.label)+'</h3>'+stageBody(l,st.id)+'</section>'
    ).join('')+'</div>';
  }

  function renderLesson(){
    const panel=$('#lessonPanel');if(!panel)return;
    const base=lessons[current],l=localLesson(base),done=completed.has(base.n),doneSet=doneStagesFor(base.n);
    panel.className='panel lesson-route-panel';
    panel.innerHTML=
      '<div class="lesson-hero">'+
        (l.extension?'<div class="lesson-extension-banner"><strong>'+bi('Extension:','扩展：')+'</strong> '+bi('this is AQA 3.8.1.1 Nuclear Physics, not part of core section 3.2.','这是 AQA 3.8.1.1 核物理内容，不属于核心 3.2。')+'</div>':'')+
        '<div class="lesson-hero-top"><span class="eyebrow">'+phaseLabel(base.phase)+' · '+base.code+'</span><span class="lesson-count">'+(isMandarin()?'第 '+l.n+' / '+lessons.length+' 课':'Lesson '+l.n+' of '+lessons.length)+'</span></div>'+
        '<h2>'+l.title+'</h2><p>'+l.overview+'</p>'+
        '<div class="lesson-meta"><span>'+lessonTime(base.duration)+'</span><span>'+l.objectives.length+(isMandarin()?' 个学习目标':' objectives')+'</span><span>'+(base.sim?(isMandarin()?'3D 模拟':'3D simulation'):(isMandarin()?'引导活动':'guided activity'))+'</span></div>'+
      '</div>'+
      '<div class="lesson-view-toolbar"><div><span class="study-label">'+bi('Lesson view','课程视图')+'</span><button class="study-mode-button '+(lessonView==='guided'?'active':'')+'" data-lesson-view="guided">'+bi('Guided steps','引导步骤')+'</button><button class="study-mode-button '+(lessonView==='full'?'active':'')+'" data-lesson-view="full">'+bi('Full lesson plan','完整课程计划')+'</button></div><button class="text-button" id="resumeThisLesson">'+bi('Jump to first unfinished step','跳到第一个未完成步骤')+'</button></div>'+
      '<div class="lesson-stage-strip">'+
        stages.map((st,i)=>'<button class="lesson-stage '+(i===activeStage?'active ':'')+(doneSet.has(st.id)?'done':'')+'" data-seq-stage="'+i+'"><span>'+(doneSet.has(st.id)?'✓':i+1)+'</span>'+lessonUI(st.short)+'</button>').join('')+
      '</div>'+
      (lessonView==='guided'?renderGuidedContent(l):renderFullPlan(l))+
      '<div class="lesson-actions-sequence lesson-footer-actions"><button class="button '+(done?'success':'')+'" id="sequenceComplete">'+(done?bi('✓ Lesson complete','✓ 本课完成'):bi('Complete remaining steps to finish lesson','完成剩余步骤以结束本课'))+'</button></div>'+
      '<div class="lesson-nav-row"><button class="button" id="sequencePrev" '+(current===0?'disabled':'')+'>← '+bi('Previous lesson','上一课')+'</button><button class="button" id="sequenceNext" '+(current===lessons.length-1?'disabled':'')+'>'+bi('Next lesson','下一课')+' →</button></div>';

    $$('[data-seq-stage]',panel).forEach(b=>b.onclick=()=>setStage(+b.dataset.seqStage,true));
    $$('[data-lesson-view]',panel).forEach(b=>b.onclick=()=>{lessonView=b.dataset.lessonView;saveAll();renderLesson();});
    $('#resumeThisLesson').onclick=()=>{
      const i=stages.findIndex(s=>!doneStagesFor(l.n).has(s.id));
      setStage(i<0?0:i,true);
    };

    $$('[data-starter-input]',panel).forEach(input=>input.addEventListener('input',()=>{
      const i=Number(input.dataset.starterInput);
      starterAnswers[l.n]=starterAnswers[l.n]||[];
      starterAnswers[l.n][i]=input.value;
      try{localStorage.setItem(STARTER_STORE,JSON.stringify(starterAnswers));}catch{}
      const status=panel.querySelector('[data-starter-status="'+i+'"]');
      if(status)status.textContent=input.value.trim()?bi('Saved on this device','已保存在此设备'):bi('Not answered yet','尚未作答');
    }));

    $$('[data-chunk-activity-input]',panel).forEach(input=>input.addEventListener('input',()=>{
      const i=Number(input.dataset.chunkActivityInput);
      chunkActivityAnswers[l.n]=chunkActivityAnswers[l.n]||[];
      chunkActivityAnswers[l.n][i]=input.value;
      try{localStorage.setItem(CHUNK_ACTIVITY_STORE,JSON.stringify(chunkActivityAnswers));}catch{}
      const status=panel.querySelector('[data-chunk-activity-status="'+i+'"]');
      if(status)status.textContent=input.value.trim()?bi('Saved','已保存'):bi('Not answered yet','尚未作答');
    }));

    $$('[data-practice-input]',panel).forEach(input=>input.addEventListener('input',()=>{
      const i=Number(input.dataset.practiceInput);
      practiceAnswers[l.n]=practiceAnswers[l.n]||[];
      practiceAnswers[l.n][i]=input.value;
      try{localStorage.setItem(PRACTICE_STORE,JSON.stringify(practiceAnswers));}catch{}
      const status=panel.querySelector('[data-practice-status="'+i+'"]');
      if(status)status.textContent=input.value.trim()?bi('Saved','已保存'):bi('Not answered yet','尚未作答');
    }));

    $$('[data-textbook-input]',panel).forEach(input=>input.addEventListener('input',()=>{
      const i=Number(input.dataset.textbookInput);
      textbookAnswers[l.n]=textbookAnswers[l.n]||[];
      textbookAnswers[l.n][i]=input.value;
      try{localStorage.setItem(TEXTBOOK_STORE,JSON.stringify(textbookAnswers));}catch{}
      const status=panel.querySelector('[data-textbook-status="'+i+'"]');
      if(status)status.textContent=input.value.trim()?'Saved on this device':'Not answered yet';
    }));

    $$('[data-textbook-help]',panel).forEach(btn=>btn.addEventListener('click',()=>{
      const i=Number(btn.dataset.textbookHelp);
      textbookMastery[l.n]=textbookMastery[l.n]||{};
      textbookMastery[l.n][i]='help';
      saveAll();
      renderLesson();
      requestAnimationFrame(()=>{
        const d=panel.querySelector('.textbook-section[data-textbook-section="'+i+'"]');
        if(d){d.open=true;d.querySelector('.textbook-model')?.setAttribute('open','');d.scrollIntoView({behavior:'smooth',block:'center'});}
      });
    }));
    $$('[data-textbook-secure]',panel).forEach(btn=>btn.addEventListener('click',()=>{
      const i=Number(btn.dataset.textbookSecure),chapter=localTextbook(l.n);
      textbookMastery[l.n]=textbookMastery[l.n]||{};
      textbookMastery[l.n][i]='secure';
      saveAll();
      renderLesson();
      requestAnimationFrame(()=>{
        const next=panel.querySelector('.textbook-section[data-textbook-section="'+Math.min(i+1,(chapter?.sections?.length||1)-1)+'"]');
        if(next){next.open=true;next.scrollIntoView({behavior:'smooth',block:'center'});}
      });
    }));

    $$('[data-investigation]',panel).forEach(input=>input.addEventListener('input',()=>{
      const key=input.dataset.investigation;
      investigationNotes[l.n]=investigationNotes[l.n]||{};
      investigationNotes[l.n][key]=input.value;
      try{localStorage.setItem(INVESTIGATION_STORE,JSON.stringify(investigationNotes));}catch{}
      const status=panel.querySelector('[data-investigation-status="'+key+'"]');
      if(status)status.textContent=input.value.trim()?bi('Saved','已保存'):bi('Not completed','尚未填写');
      const badge=panel.querySelector('.investigation-head>span');
      if(badge){
        const fields=['prediction','observation','explanation'];
        const done=fields.reduce((n,k)=>n+((investigationNotes[l.n]?.[k]||'').trim()?1:0),0);
        badge.textContent=done+' / 3 '+bi('complete','已完成');
      }
    }));

    $$('[data-short-test-input]',panel).forEach(input=>input.addEventListener('input',()=>{
      const i=Number(input.dataset.shortTestInput);
      shortTestAnswers[l.n]=shortTestAnswers[l.n]||[];
      shortTestAnswers[l.n][i]=input.value;
      try{localStorage.setItem(SHORT_TEST_STORE,JSON.stringify(shortTestAnswers));}catch{}
      const status=panel.querySelector('[data-short-test-status="'+i+'"]');
      if(status)status.textContent=input.value.trim()?bi('Saved','已保存'):bi('Not answered yet','尚未作答');
      const progress=panel.querySelector('.short-test-progress');
      if(progress){
        const inputs=$$('[data-short-test-input]',panel);
        const answered=inputs.reduce((n,x)=>n+(x.value.trim()?1:0),0);
        progress.textContent=answered+' / '+inputs.length+' '+bi('answered','已作答');
      }
    }));

    const bindActivity=()=>{
      $('#sequenceActivity')?.addEventListener('click',()=>l.sim?openView('lab',l.sim):openView(l.view||'quiz'));
      $('#sequenceAtomPractice')?.addEventListener('click',()=>{openView('lab','atom');setTimeout(()=>window.PARTICLELAB_ATOM_PRACTICE?.open?.(0),120)});
      $('#sequenceExamPractice')?.addEventListener('click',()=>{openView('lab',l.sim||'atom');setTimeout(()=>document.querySelector('[data-lt="exam"]')?.click(),120)});
      $('#sequenceFullTools')?.addEventListener('click',()=>{if(l.sim){openView('lab',l.sim);setTimeout(()=>document.querySelector('[data-study-mode="full"]')?.click(),120)}else openView('learninghub')});
    };
    bindActivity();

    $('#lessonStepBack')?.addEventListener('click',()=>{if(activeStage>0)setStage(activeStage-1)});
    $('#lessonStepDone')?.addEventListener('click',()=>{
      markStage(stages[activeStage].id,true);
      if(activeStage<stages.length-1){
        activeStage++;
        saveAll();renderList();renderLesson();
      }else{
        completed.add(l.n);saveAll();renderList();renderLesson();
      }
    });


    $$('[data-core-chunk]',panel).forEach(b=>b.addEventListener('click',()=>setActiveChunk(l,+b.dataset.coreChunk,true)));
    $('#coreChunkPrev')?.addEventListener('click',()=>setActiveChunk(l,activeChunkFor(l)-1,true));
    $('#coreChunkNext')?.addEventListener('click',()=>setActiveChunk(l,activeChunkFor(l)+1,true));
    $$('.native-chunk-list > details[data-lesson-chunk]',panel).forEach(d=>d.addEventListener('toggle',()=>{
      if(!d.open)return;
      const i=Number(d.dataset.lessonChunk);
      if(Number.isInteger(i)&&chunkPosition[l.n]!==i){
        chunkPosition[l.n]=i;
        saveAll();
        $$('[data-core-chunk]',panel).forEach(b=>{
          const active=Number(b.dataset.coreChunk)===i;
          b.classList.toggle('active',active);
          b.setAttribute('aria-selected',String(active));
        });
        const status=$('.core-chunk-status strong',panel);
        if(status)status.textContent='Chunk '+(i+1)+' of '+l.teach.length;
      }
    }));

    $('#sequenceComplete').onclick=()=>{
      if(done){
        completed.delete(l.n);stageDone[l.n]=[];saveAll();activeStage=0;renderList();renderLesson();
      }else{
        const first=stages.findIndex(s=>!doneStagesFor(l.n).has(s.id));
        if(first>=0)setStage(first);
      }
    };
    $('#sequencePrev').onclick=()=>changeLesson(-1);
    $('#sequenceNext').onclick=()=>changeLesson(1);
    updateProgress();
  }

  function changeLesson(delta){
    const next=current+delta;
    if(next<0||next>=lessons.length)return;
    current=next;
    const first=stages.findIndex(s=>!doneStagesFor(lessons[current].n).has(s.id));
    activeStage=first<0?0:first;
    saveAll();renderList();renderLesson();scrollCourseTop();
  }

  function scrollCourseTop(){
    $('#view-course')?.scrollIntoView({behavior:'smooth',block:'start'});
  }

  function renderSummary(){
    const section=$('#view-course');if(!section)return;
    const head=$('.section-head',section);
    if(head){
      head.innerHTML='<div><span class="eyebrow">'+bi('Classroom teaching route','课堂学习路线')+'</span><h2>'+bi('Particles & Radiation lesson sequence','粒子与辐射课程序列')+'</h2></div><p class="subtle">'+bi('Open one lesson, follow the highlighted step, then press “Mark step done” to move through it.','打开一课，按高亮步骤学习，完成后点击“标记本步骤完成”继续。')+'</p>';
    }
    let summary=$('#lessonRouteSummary');
    if(!summary){
      summary=document.createElement('div');
      summary.id='lessonRouteSummary';summary.className='lesson-route-summary';
      head?.insertAdjacentElement('afterend',summary);
    }
    const l=localLesson(lessons[current]),step=stages[activeStage];
    summary.innerHTML='<div class="lesson-route-overview"><span class="eyebrow">'+bi('Continue where you left off','从上次位置继续')+'</span><h3>'+bi('Lesson','第')+' '+l.n+(isMandarin()?' 课 · ':' · ')+l.title+'</h3><p>'+bi('Current step:','当前步骤：')+' <strong>'+lessonUI(step.label)+'</strong>。 '+bi('The app remembers this lesson and step on this device.','应用会在此设备上记住你的课程与步骤。')+'</p><div class="lesson-route-phases">'+
      phaseGroups().map(g=>'<span class="lesson-phase-chip">'+phaseLabel(g.phase)+' · '+g.items.length+(isMandarin()?' 课':' lessons')+'</span>').join('')+
      '</div><button class="button primary" id="resumeLessonSequence" style="margin-top:8px">'+bi('Continue lesson','继续第')+' '+l.n+(isMandarin()?' 课':'')+'</button></div>'+
      '<div class="lesson-route-progress"><div class="lesson-progress-line"><div><span class="eyebrow">'+bi('Sequence progress','课程进度')+'</span><h3 id="lessonSequenceProgress"></h3></div><strong>'+lessons.length+'</strong></div><div class="lesson-route-track"><div id="lessonSequenceFill" class="lesson-route-fill"></div></div><p style="margin-top:6px">'+bi('A lesson completes after all seven steps are ticked.','完成七个步骤后，本课即完成。')+'</p></div>';
    $('#resumeLessonSequence').onclick=()=>{$('#lessonPanel')?.scrollIntoView({behavior:'smooth',block:'start'})};
    const layout=$('.course-layout',section);
    layout?.classList.add('lesson-sequence-layout');
  }

  function relabelNavigation(){
    const nav=$('.nav-button[data-view="course"]');if(nav)nav.textContent=bi('Lesson sequence','课程序列');
    const jump=$('[data-jump="course"]');if(jump)jump.textContent=bi('Continue lesson sequence','继续课程序列');
  }

  function init(){
    relabelNavigation();
    renderSummary();
    renderList();
    renderLesson();
    updateProgress();

    window.addEventListener('particlelab:languagechange',()=>{
      relabelNavigation();renderSummary();renderList();renderLesson();updateProgress();
    });

    $('#resetProgress')?.addEventListener('click',()=>{
      setTimeout(()=>{
        completed.clear();stageDone={};chunkPosition={};starterAnswers={};textbookAnswers={};textbookMastery={};investigationNotes={};shortTestAnswers={};chunkActivityAnswers={};practiceAnswers={};current=0;activeStage=0;saveAll();renderSummary();renderList();renderLesson();
      },0);
    });

    setInterval(()=>{
      if(!$('#view-course'))return;
      const now=$('#courseList')?.className||'';
      if(!now.includes('lesson-sequence-sidebar')){
        renderSummary();renderList();renderLesson();updateProgress();
      }
    },800);
  }

  window.PARTICLELAB_LESSON_SEQUENCE={
    lessons,
    stages,
    taskBank:lessonTaskBank,
    chunkDetail:lessonChunkDetail,
    specCoverage:aqaCoreKnowledge,
    textbook:lessonTextbook,
    starterModels:starterAnswerBank,
    getLocalizedLesson:n=>{const b=lessons.find(x=>x.n===n);return b?localLesson(b):null},
    getChunkSupport:(lessonNumber,chunkIndex)=>{const l=lessons.find(x=>x.n===lessonNumber);return l?chunkSupport(l,chunkIndex):null},
    getActiveChunk:()=>activeChunkFor(lessons[current]),
    openStage:i=>setStage(i,true),
    openLesson:n=>{
      const i=lessons.findIndex(l=>l.n===n);
      if(i>=0){
        current=i;
        lessonView='guided';
        const first=stages.findIndex(s=>!doneStagesFor(lessons[current].n).has(s.id));
        activeStage=first<0?0:first;
        saveAll();
        document.querySelector('[data-view="course"]')?.click();
        renderSummary();renderList();renderLesson();
      }
    }
  };

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(init,380),{once:true});
  else setTimeout(init,380);
})();
