const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const H=6.62607015e-34,ECHARGE=1.602176634e-19,ME=9.1093837015e-31,C=299792458,MP=1.67262192595e-27,MN=1.67492750056e-27;
const fmt=(n,d=3)=>Number(n).toLocaleString(undefined,{maximumSignificantDigits:d});

const glossary={
  'specific charge':'charge divided by mass, Q/m, measured in C kg⁻¹.',
  'isotope':'atoms of the same element with the same proton number but different numbers of neutrons.',
  'nucleon':'a proton or neutron in a nucleus.',
  'strong nuclear force':'a very short-range force between nucleons that is attractive over typical nuclear separations and repulsive at extremely short range.',
  'antiparticle':'a partner particle with the same mass but opposite relevant quantum numbers such as charge.',
  'photon':'a quantum or packet of electromagnetic radiation with energy E = hf.',
  'exchange particle':'a particle used in the interaction model to transfer momentum/energy between interacting particles.',
  'hadron':'a particle subject to the strong interaction. Baryons and mesons are hadrons.',
  'baryon':'a hadron made from three quarks. Proton and neutron are the AQA examples.',
  'meson':'a hadron made from a quark and an antiquark. Pions and kaons are AQA examples.',
  'lepton':'a fundamental particle that does not take part in the strong interaction.',
  'strangeness':'a quantum number linked to strange quarks: s has S = −1 and anti-s has S = +1.',
  'work function':'the minimum energy needed to remove an electron from a metal surface.',
  'threshold frequency':'the minimum light frequency that can cause photoelectron emission from a particular metal.',
  'stopping potential':'the reverse potential needed to reduce the maximum photoelectron current to zero; eVₛ = KEmax.',
  'excitation':'an electron in an atom moves to a higher bound energy level after gaining exactly enough energy.',
  'ionisation':'an electron is completely removed from an atom.',
  'electron volt':'energy transferred when one electron moves through a potential difference of one volt; 1 eV = 1.602 × 10⁻¹⁹ J.',
  'de Broglie wavelength':'the wavelength associated with a moving particle, λ = h/p.',
  'baryon number':'a conserved quantum number: baryons have B = +1, antibaryons B = −1, others B = 0.',
  'lepton number':'a conserved quantum number tracked separately for electron and muon lepton families.'
};

const lessons=[
 {code:'3.2.1.1',title:'Constituents of the atom',sim:'atom',lead:'Start with the three particles in ordinary atoms, then learn Z, A, isotopes and specific charge.',remember:['Proton: +e, neutron: 0, electron: −e.','Z = number of protons. A = protons + neutrons.','Isotopes have the same Z but different neutron numbers.'],mistake:'Do not say isotopes have different proton numbers. If Z changes, the element changes.',example:'For ²³₁₁Na: protons = 11, neutrons = 23 − 11 = 12. A neutral atom has 11 electrons.',vocab:['specific charge','isotope','nucleon']},
 {code:'3.2.1.2',title:'Stable and unstable nuclei',sim:'strong',lead:'See why nuclei can stay together and how alpha and beta decay change a nucleus.',remember:['The strong nuclear force is attractive out to about 3 fm.','Below about 0.5 fm it becomes strongly repulsive.','In β⁻ decay a neutron changes into a proton, an electron and an electron antineutrino.'],mistake:'Do not confuse the strong nuclear force between nucleons with the electrostatic force between charged particles.',example:'Alpha decay lowers A by 4 and Z by 2. β⁻ decay keeps A the same and increases Z by 1.',vocab:['strong nuclear force','nucleon']},
 {code:'3.2.1.3',title:'Particles, antiparticles and photons',sim:'antimatter',lead:'Learn antiparticle pairs, photon energy, annihilation and pair production.',remember:['Particle and antiparticle have the same mass.','Their relevant quantum numbers are opposite.','Photon energy is E = hf and also E = hc/λ.'],mistake:'Pair production needs energy and a nearby body so momentum can be conserved. A lone photon cannot simply turn into an e⁻–e⁺ pair in empty space.',example:'A slow electron and positron have 1.022 MeV of rest energy in total, so annihilation can produce two gamma photons sharing at least this energy.',vocab:['antiparticle','photon']},
 {code:'3.2.1.4',title:'Particle interactions',sim:'interactions',lead:'Build a picture of forces using exchange particles and learn the AQA weak-interaction diagrams.',remember:['AQA names gravity, electromagnetic, weak and strong interactions.','Electromagnetic interactions use virtual photons in the exchange model.','β processes use W⁺ or W⁻ exchange particles.'],mistake:'AQA does not test gluon, Z⁰ or graviton knowledge here. For the force between nucleons, AQA also uses pion exchange in the classification section.',example:'In β⁻ decay at quark level: d → u + W⁻, then W⁻ → e⁻ + anti-νₑ.',vocab:['exchange particle','photon']},
 {code:'3.2.1.5',title:'Classification of particles',sim:'classification',lead:'Sort particles into hadrons, baryons, mesons and leptons, then add strange particles.',remember:['Hadrons take part in the strong interaction.','Baryons include proton/neutron; mesons include pion/kaon.','Leptons include electron, muon and their neutrinos.'],mistake:'A proton is a baryon and a hadron. It is not a lepton. A pion is a meson and a hadron.',example:'Kaons are strange mesons: they can be produced by the strong interaction but decay by the weak interaction.',vocab:['hadron','baryon','meson','lepton','strangeness']},
 {code:'3.2.1.6',title:'Quarks and antiquarks',sim:'quarks',lead:'Use only the three flavours AQA requires: up, down and strange, plus their antiquarks.',remember:['u has charge +⅔e; d and s each have −⅓e.','Each quark has baryon number +⅓; each antiquark −⅓.','Proton = uud and neutron = udd.'],mistake:'Do not give a meson three quarks. A meson is one quark + one antiquark.',example:'π⁺ = u anti-d gives charge +⅔e + +⅓e = +e and baryon number ⅓ − ⅓ = 0.',vocab:['baryon number','strangeness']},
 {code:'3.2.1.7',title:'Applications of conservation laws',sim:'decay',lead:'Check whether a proposed particle reaction can happen by comparing conserved quantities before and after.',remember:['Charge must be conserved.','Baryon number and each lepton family number must be conserved.','Strangeness is conserved in strong interactions but may change by 0 or ±1 in weak interactions.'],mistake:'Do not combine electron lepton number and muon lepton number into one total when AQA asks you to test them separately.',example:'n → p + e⁻ + anti-νₑ: charge 0 = +1 −1 +0; baryon 1 = 1; electron lepton number 0 = +1 −1.',vocab:['baryon number','lepton number','strangeness']},
 {code:'3.2.2.1',title:'The photoelectric effect',sim:'photo',lead:'This is the key evidence that electromagnetic radiation can behave as particles called photons.',remember:['One photon gives its energy to one electron.','Below threshold frequency, no photoelectrons are emitted however intense the light is.','hf = φ + KEmax and KEmax = eVₛ.'],mistake:'Increasing intensity does not increase photon energy if frequency stays the same. It increases the number of photons arriving each second.',example:'If photon energy is 4.0 eV and the work function is 2.3 eV, KEmax = 1.7 eV and Vₛ = 1.7 V.',vocab:['work function','threshold frequency','stopping potential','photon']},
 {code:'3.2.2.2',title:'Collisions of electrons with atoms',sim:'collisions',lead:'Learn the difference between excitation and ionisation and how a fluorescent tube uses both collisions and photon emission.',remember:['Excitation leaves the electron bound to the atom.','Ionisation removes an electron completely.','1 eV = 1.602 × 10⁻¹⁹ J.'],mistake:'An incident electron does not have to lose all its energy in an excitation. It transfers the exact energy-level difference and keeps the rest as kinetic energy.',example:'10 eV = 10 × 1.602 × 10⁻¹⁹ J = 1.602 × 10⁻¹⁸ J.',vocab:['excitation','ionisation','electron volt']},
 {code:'3.2.2.3',title:'Energy levels and photon emission',sim:'levels',lead:'Discrete energy levels explain why atoms emit line spectra rather than every possible wavelength.',remember:['Atomic energy levels are discrete.','A downward transition emits a photon.','Photon energy equals the energy-level difference: hf = E₁ − E₂.'],mistake:'The horizontal lines on an energy-level diagram are not electron orbits in space. They represent allowed energies.',example:'If ΔE = 3.0 eV, convert to joules if needed, then use f = ΔE/h or λ = hc/ΔE.',vocab:['photon','electron volt']},
 {code:'3.2.2.4',title:'Wave–particle duality',sim:'diffraction',lead:'Join together electron diffraction and the photoelectric effect to see why neither a pure wave model nor a pure particle model is enough.',remember:['Electron diffraction shows wave behaviour of matter.','The photoelectric effect shows particle behaviour of EM radiation.','λ = h/p, so increasing momentum decreases wavelength and usually reduces diffraction.'],mistake:'Do not say the electron is literally a water wave. The de Broglie wavelength describes wave-like behaviour of a quantum particle.',example:'Double the electron momentum and its de Broglie wavelength halves.',vocab:['de Broglie wavelength']}
];

const simDefs=[
 ['atom','Atomic structure','3.2.1.1'],['specific','Specific charge','3.2.1.1'],['strong','Nuclear force','3.2.1.2'],['decay','Alpha & beta decay','3.2.1.2 / 3.2.1.4 / 3.2.1.7'],['antimatter','Antimatter & photons','3.2.1.3'],['interactions','Exchange particles','3.2.1.4'],['classification','Particle families','3.2.1.5'],['quarks','Quark builder','3.2.1.6'],['photo','Photoelectric effect','3.2.2.1'],['collisions','Electron collisions','3.2.2.2'],['levels','Energy levels','3.2.2.3'],['diffraction','Electron diffraction','3.2.2.4'],['rutherford','Rutherford extension','3.8.1.1']
];

const simText={
 atom:{sub:'Build isotopes and compare the nucleus with the electron cloud.',simple:'The nucleus contains protons and neutrons. Electrons occupy the space around it. The cloud is a probability-style picture, not tiny planets on fixed circular tracks.',exam:'State charge and mass clearly, then use Z for proton number and A for total nucleons. For a neutral atom, number of electrons = Z.',mistake:'The nucleus is tiny compared with the atom. The visual scale is exaggerated so you can see both.'},
 specific:{sub:'Change nuclear charge, mass number and ion charge to see Q/m change.',simple:'Specific charge tells you how much charge there is for each kilogram of mass. Large charge and small mass gives a large specific charge.',exam:'Use specific charge = total charge / total mass. For a nucleus, charge = Ze. For an ion, use the net ion charge.',mistake:'Use the mass of the whole particle or ion, not just one proton mass unless that approximation is intended.'},
 strong:{sub:'Move two nucleons together and watch the force change with separation.',simple:'At normal nuclear distances the strong force pulls nucleons together. If they get extremely close it pushes them apart. Beyond a few femtometres it becomes negligible.',exam:'AQA expects: attractive up to about 3 fm; repulsive closer than about 0.5 fm.',mistake:'Do not say the strong force has infinite range. Its range is very short.'},
 decay:{sub:'Learn core alpha and beta-minus decay first; revisit beta-plus here when studying weak interactions in 3.2.1.4.',simple:'Radioactive decay changes an unstable nucleus into a different state. Alpha throws out a helium nucleus; beta processes change a proton or neutron.',exam:'α: A −4, Z −2. β⁻: A unchanged, Z +1 and an electron antineutrino is emitted. β⁺: A unchanged, Z −1 and an electron neutrino is emitted.',mistake:'The beta electron is created in the decay; it was not an orbital electron waiting inside the nucleus.'},
 antimatter:{sub:'Run annihilation and pair production while tracking energy and momentum.',simple:'Matter and antimatter can disappear together and their energy appears as photons. A high-energy photon can also create a particle–antiparticle pair near another body.',exam:'For slow e⁻ and e⁺, total rest energy is 1.022 MeV. In the centre-of-momentum frame two gamma photons move in opposite directions.',mistake:'Pair production in empty space from one photon alone cannot conserve momentum.'},
 interactions:{sub:'Switch between electromagnetic and weak interaction diagrams.',simple:'In the exchange-particle model, interacting particles exchange another particle. AQA uses virtual photons for electromagnetic interactions and W bosons for the weak processes you study.',exam:'Know simple diagrams for β⁻, β⁺, electron capture and electron–proton collisions, plus virtual-photon exchange for electromagnetic forces.',mistake:'Do not add gluons or Z⁰ bosons to an AQA answer unless specifically given; they are not tested in this section.'},
 classification:{sub:'Explore the particle family tree and see which particles feel the strong interaction.',simple:'First ask: does it take part in the strong interaction? If yes, it is a hadron. Then decide baryon or meson. If no, common AQA examples are leptons.',exam:'Baryons: proton, neutron and antiparticles. Mesons: pions, kaons. Leptons: electron, muon, their neutrinos and antiparticles.',mistake:'“Hadron” is the larger family. Baryons and mesons are both hadrons.'},
 quarks:{sub:'Build protons, neutrons, pions and kaons and check charge, B and S.',simple:'Hadrons are built from quarks. AQA only requires up, down and strange flavours and their antiquarks.',exam:'u: Q=+⅔e, B=⅓, S=0. d: Q=−⅓e, B=⅓, S=0. s: Q=−⅓e, B=⅓, S=−1. Antiquarks have opposite quantum numbers.',mistake:'Do not reverse the strange-quark sign: s has strangeness −1; anti-s has +1.'},
 photo:{sub:'Change frequency, intensity and work function to see when electrons are emitted.',simple:'Each photon gives energy hf to one electron. If hf is below the work function, nothing comes out. If hf is above it, the leftover energy becomes electron kinetic energy.',exam:'hf = φ + KEmax. Threshold frequency f₀ = φ/h. KEmax = eVₛ.',mistake:'Intensity changes the number of emitted electrons per second, not KEmax, when frequency is unchanged.'},
 collisions:{sub:'Fire electrons at an atom and compare no change, excitation and ionisation.',simple:'An atom can absorb only certain energy amounts for excitation. If enough energy is supplied to remove an electron completely, ionisation occurs.',exam:'Excitation transfers an exact level difference. Ionisation needs at least the ionisation energy. Convert eV ↔ J using 1 eV = 1.602 × 10⁻¹⁹ J.',mistake:'If incident energy is between two allowed excitation energies, the atom cannot take an arbitrary fraction just to fit.'},
 levels:{sub:'Choose an atomic transition and connect it to photon frequency, wavelength and line spectra.',simple:'Atoms have allowed energy levels. When an electron falls to a lower level, one photon carries away the energy difference.',exam:'ΔE = hf = hc/λ. Line spectra are evidence for discrete atomic energy levels.',mistake:'The spectrum line colour comes from photon energy, not from the electron physically travelling along a coloured path.'},
 diffraction:{sub:'Increase electron momentum and watch the de Broglie wavelength and diffraction pattern change.',simple:'Electrons can produce diffraction patterns like waves. Higher momentum means shorter de Broglie wavelength.',exam:'λ = h/p. For non-relativistic electrons p = mv. Increasing p decreases λ and therefore reduces diffraction for a fixed structure.',mistake:'Wave–particle duality does not mean the particle flips between being a classical ball and a classical water wave.'},
 rutherford:{sub:'Extension: use impact parameter and nuclear charge to alter alpha-particle deflection.',simple:'Most alpha particles miss the tiny nucleus and travel almost straight through. A few pass close to the positive nucleus and are strongly repelled.',exam:'Most straight through → atom mostly empty space. Some large deflections → positive charge concentrated. Very few backwards → nucleus tiny and massive.',mistake:'Rutherford scattering is AQA 3.8.1.1 Nuclear Physics, not part of core 3.2.'}
};

const particles=[
 {id:'p',name:'Proton',symbol:'p',family:'baryon hadron',charge:'+1e',mass:'1.673 × 10⁻²⁷ kg',quarks:'uud',B:1,Le:0,Lm:0,S:0,note:'Stable baryon and the only stable baryon in the AQA classification statement.'},
 {id:'n',name:'Neutron',symbol:'n',family:'baryon hadron',charge:'0',mass:'1.675 × 10⁻²⁷ kg',quarks:'udd',B:1,Le:0,Lm:0,S:0,note:'A free neutron can beta-minus decay to a proton.'},
 {id:'pbar',name:'Antiproton',symbol:'p̄',family:'antibaryon hadron antiparticle',charge:'−1e',mass:'same as proton',quarks:'ūūd̄',B:-1,Le:0,Lm:0,S:0,note:'Antiparticle of the proton.'},
 {id:'nbar',name:'Antineutron',symbol:'n̄',family:'antibaryon hadron antiparticle',charge:'0',mass:'same as neutron',quarks:'ūd̄d̄',B:-1,Le:0,Lm:0,S:0,note:'Antiparticle of the neutron.'},
 {id:'pip',name:'Positive pion',symbol:'π⁺',family:'meson hadron',charge:'+1e',mass:'≈140 MeV/c²',quarks:'u d̄',B:0,Le:0,Lm:0,S:0,note:'Pions are used by AQA as exchange particles for the strong nuclear force between nucleons.'},
 {id:'pim',name:'Negative pion',symbol:'π⁻',family:'meson hadron',charge:'−1e',mass:'≈140 MeV/c²',quarks:'d ū',B:0,Le:0,Lm:0,S:0,note:'A meson: one quark plus one antiquark.'},
 {id:'kp',name:'Positive kaon',symbol:'K⁺',family:'meson hadron strange',charge:'+1e',mass:'≈494 MeV/c²',quarks:'u s̄',B:0,Le:0,Lm:0,S:1,note:'A strange meson. It can be produced strongly and decay weakly.'},
 {id:'km',name:'Negative kaon',symbol:'K⁻',family:'meson hadron strange',charge:'−1e',mass:'≈494 MeV/c²',quarks:'s ū',B:0,Le:0,Lm:0,S:-1,note:'Contains a strange quark, so S = −1.'},
 {id:'e',name:'Electron',symbol:'e⁻',family:'lepton',charge:'−1e',mass:'9.109 × 10⁻³¹ kg',quarks:'none',B:0,Le:1,Lm:0,S:0,note:'Fundamental electron-family lepton.'},
 {id:'ep',name:'Positron',symbol:'e⁺',family:'lepton antiparticle',charge:'+1e',mass:'same as electron',quarks:'none',B:0,Le:-1,Lm:0,S:0,note:'Electron antiparticle.'},
 {id:'nue',name:'Electron neutrino',symbol:'νₑ',family:'lepton',charge:'0',mass:'very small',quarks:'none',B:0,Le:1,Lm:0,S:0,note:'Electron-family neutrino.'},
 {id:'anue',name:'Electron antineutrino',symbol:'ν̄ₑ',family:'lepton antiparticle',charge:'0',mass:'very small',quarks:'none',B:0,Le:-1,Lm:0,S:0,note:'Needed in beta-minus decay to conserve electron lepton number.'},
 {id:'mu',name:'Muon',symbol:'μ⁻',family:'lepton',charge:'−1e',mass:'≈207 electron masses',quarks:'none',B:0,Le:0,Lm:1,S:0,note:'Muon-family lepton; unstable and decays to lighter leptons.'},
 {id:'mup',name:'Antimuon',symbol:'μ⁺',family:'lepton antiparticle',charge:'+1e',mass:'same as muon',quarks:'none',B:0,Le:0,Lm:-1,S:0,note:'Muon antiparticle.'},
 {id:'numu',name:'Muon neutrino',symbol:'νμ',family:'lepton',charge:'0',mass:'very small',quarks:'none',B:0,Le:0,Lm:1,S:0,note:'Muon-family neutrino.'},
 {id:'gamma',name:'Photon',symbol:'γ',family:'photon',charge:'0',mass:'zero rest mass',quarks:'none',B:0,Le:0,Lm:0,S:0,note:'Quantum of electromagnetic radiation; virtual photons model electromagnetic interactions.'}
];

const reactions=[
 {name:'Beta-minus decay',eq:'n → p + e⁻ + ν̄ₑ',type:'weak',rows:[['Charge',0,0,true],['Baryon number',1,1,true],['Electron lepton number',0,0,true],['Strangeness',0,0,true]],note:'Allowed. At quark level d → u + W⁻.'},
 {name:'Beta-plus decay',eq:'p → n + e⁺ + νₑ',type:'weak',rows:[['Charge',1,1,true],['Baryon number',1,1,true],['Electron lepton number',0,0,true],['Strangeness',0,0,true]],note:'Allowed when energy conditions permit inside an unstable nucleus.'},
 {name:'Electron capture',eq:'p + e⁻ → n + νₑ',type:'weak',rows:[['Charge',0,0,true],['Baryon number',1,1,true],['Electron lepton number',1,1,true],['Strangeness',0,0,true]],note:'Allowed weak process.'},
 {name:'Electron–positron annihilation',eq:'e⁻ + e⁺ → γ + γ',type:'electromagnetic',rows:[['Charge',0,0,true],['Baryon number',0,0,true],['Electron lepton number',0,0,true],['Strangeness',0,0,true]],note:'Allowed if energy and momentum are also conserved.'},
 {name:'Weak kaon decay example',eq:'K⁺ → π⁺ + π⁰',type:'weak',rows:[['Charge',1,1,true],['Baryon number',0,0,true],['Lepton number',0,0,true],['Strangeness',1,0,true]],note:'Strangeness changes by −1, which is allowed in a weak interaction.'},
 {name:'Impossible proton decay example',eq:'p → e⁺ + γ',type:'not allowed',rows:[['Charge',1,1,true],['Baryon number',1,0,false],['Electron lepton number',0,-1,false],['Strangeness',0,0,true]],note:'Not allowed by the AQA conservation laws shown here.'}
];

const quiz=[
 ['3.2.1.1','Which statement describes isotopes?',['Same Z, different neutron number','Different Z, same neutron number','Same A, different Z','Different numbers of protons and electrons only'],0,'Keep the element the same: proton number must stay the same.','Isotopes are atoms of the same element, so they have the same proton number Z but different neutron numbers.'],
 ['3.2.1.1','What is the specific charge of a particle?',['mass ÷ charge','charge ÷ mass','charge × mass','number of protons ÷ mass'],1,'Look at the unit C kg⁻¹.','Specific charge is Q/m and is measured in C kg⁻¹.'],
 ['3.2.1.2','At a nucleon separation of about 1 fm, the strong nuclear force is mainly…',['attractive','zero','electrostatic only','repulsive at all distances'],0,'1 fm lies between the very-short repulsive region and the ~3 fm limit.','At typical nuclear separations the strong nuclear force is attractive.'],
 ['3.2.1.2','During beta-minus decay, the proton number Z…',['decreases by 2','decreases by 1','stays the same','increases by 1'],3,'A neutron changes into a proton.','A increases by 0 and Z increases by 1 in β⁻ decay.'],
 ['3.2.1.3','Which pair has equal mass and opposite charge?',['electron and proton','electron and positron','proton and neutron','photon and electron'],1,'Think particle and antiparticle.','The positron is the electron antiparticle: same mass, opposite charge.'],
 ['3.2.1.3','A photon has energy…',['mc² only','hf','mv','Q/m'],1,'Use Planck constant h.','Photon energy is E = hf.'],
 ['3.2.1.4','What exchange particle models the electromagnetic interaction?',['pion','W⁻ only','virtual photon','neutrino'],2,'It belongs to the same radiation family as light, but is virtual in the force model.','AQA uses virtual photons as exchange particles for electromagnetic interactions.'],
 ['3.2.1.4','Which exchange particles are required for the weak interactions in this topic?',['W⁺ and W⁻','gluons only','pions only','photons only'],0,'Think beta processes.','AQA requires W⁺ and W⁻ for the weak-interaction diagrams.'],
 ['3.2.1.5','Which particle is a meson?',['proton','electron','kaon','neutron'],2,'Mesons are hadrons made from quark + antiquark.','Kaons and pions are the AQA meson examples.'],
 ['3.2.1.5','Which statement about strange particles is correct?',['They are produced weakly and decay strongly','They are produced strongly and decay weakly','They are all leptons','Strangeness never changes'],1,'Remember the “strange” lifetime clue.','AQA describes strange particles as produced through the strong interaction and decaying through the weak interaction.'],
 ['3.2.1.6','What is the quark content of a proton?',['udd','uud','uuu','u d̄'],1,'Two up quarks give +4/3e and one down gives −1/3e.','A proton is uud.'],
 ['3.2.1.6','What is the strangeness of an s quark?',['+1','0','−1','+1/3'],2,'Antistrange has the opposite sign.','The strange quark has S = −1; anti-s has S = +1.'],
 ['3.2.1.7','Why is an antineutrino included in beta-minus decay?',['to conserve baryon number only','to conserve electron lepton number and energy/momentum','to make the charge +1','because every neutron contains a neutrino'],1,'Check the lepton number before and after.','The antineutrino is needed for conservation laws including electron lepton number, energy and momentum.'],
 ['3.2.1.7','In a strong interaction, strangeness must…',['always increase by 1','always decrease by 1','be conserved','equal baryon number'],2,'Weak interactions are the ones where S can change by 0 or ±1.','Strangeness is conserved in strong interactions.'],
 ['3.2.2.1','Light is below the threshold frequency. Increasing intensity will…',['release higher-energy electrons','eventually cause emission','still cause no photoelectron emission','increase photon energy'],2,'Intensity changes photon rate, not hf.','Below threshold frequency each photon has insufficient energy, so no emission occurs.'],
 ['3.2.2.1','Which equation is the photoelectric equation?',['hf = φ + KEmax','F = ma','λ = h/p only','Q = It'],0,'Photon energy is split into removal energy and remaining kinetic energy.','hf = φ + KEmax.'],
 ['3.2.2.2','Excitation means…',['removing an electron completely','moving an electron to a higher bound level','creating a proton','splitting the nucleus'],1,'The electron stays in the atom.','Excitation raises an electron to a higher allowed level without removing it.'],
 ['3.2.2.2','1 eV is equal to approximately…',['1.60 × 10⁻¹⁹ J','6.63 × 10⁻³⁴ J','9.11 × 10⁻³¹ J','3.00 × 10⁸ J'],0,'It uses the elementary charge in coulombs.','1 eV = 1.602 × 10⁻¹⁹ J.'],
 ['3.2.2.3','Why does an atomic line spectrum contain separate lines?',['atoms have discrete energy levels','electrons can have any energy','photons have mass','all wavelengths are absorbed'],0,'Think allowed energy differences.','Discrete levels give specific ΔE values and therefore specific photon frequencies.'],
 ['3.2.2.3','If an electron drops to a lower energy level, the atom…',['absorbs a photon','emits a photon','changes proton number','must ionise'],1,'Energy leaves the atom.','A downward transition emits a photon with energy equal to the level difference.'],
 ['3.2.2.4','Electron diffraction is evidence that electrons have…',['only particle properties','wave properties','zero momentum','positive charge'],1,'Diffraction is a wave behaviour.','Electron diffraction demonstrates wave-like behaviour of matter.'],
 ['3.2.2.4','If particle momentum doubles, de Broglie wavelength…',['doubles','halves','stays constant','becomes zero'],1,'λ = h/p.','Since λ is inversely proportional to p, doubling p halves λ.'],
 ['Mixed','Which quantity is conserved in all particle interactions studied here?',['charge','strangeness','number of particles','kinetic energy separately'],0,'One option is universal; strangeness depends on interaction type.','Electric charge is conserved in all the interactions considered.'],
 ['Mixed','Which statement best links the two quantum-phenomena experiments?',['Photoelectric effect shows light can act as particles; electron diffraction shows matter can act as waves','Both prove electrons have no mass','Both show light is only a wave','Both are nuclear decay experiments'],0,'One experiment gives particle evidence for light, the other wave evidence for electrons.','Together they motivate wave–particle duality.']
];

const completed=new Set(JSON.parse(localStorage.getItem('particleLabProgress')||'[]'));
let currentLesson=0,currentView='course',currentSim='atom',quizIndex=0,quizScore=0,quizStreak=0,quizLocked=false;
function saveProgress(){localStorage.setItem('particleLabProgress',JSON.stringify([...completed]));updateProgress()}
function updateProgress(){const n=completed.size;$('#overallProgressText').textContent=`${n} / ${lessons.length} complete`;$('#overallProgressBar').style.width=`${n/lessons.length*100}%`;renderCourseList();renderSpec()}

function showView(view){currentView=view;$$('.view').forEach(v=>v.classList.toggle('active-view',v.id===`view-${view}`));$$('.nav-button').forEach(b=>b.classList.toggle('active',b.dataset.view===view));window.scrollTo({top:document.querySelector('.main-nav').offsetTop-70,behavior:'smooth'});if(view==='lab')activateSim(currentSim)}
$$('[data-jump]').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.jump)));$$('.nav-button').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
$('#resetProgress').addEventListener('click',()=>{completed.clear();saveProgress();renderLesson(currentLesson)});

function renderCourseList(){if(window.PARTICLELAB_LESSON_SEQUENCE)return;const el=$('#courseList');if(!el)return;el.innerHTML=lessons.map((l,i)=>`<button class="course-button ${i===currentLesson?'active':''} ${completed.has(l.code)?'complete':''}" data-lesson="${i}"><span class="course-code">${l.code}</span><span class="course-title">${i+1}. ${l.title}</span></button>`).join('');el.querySelectorAll('[data-lesson]').forEach(b=>b.onclick=()=>{currentLesson=Number(b.dataset.lesson);renderCourseList();renderLesson(currentLesson)})}
function renderLesson(i){if(window.PARTICLELAB_LESSON_SEQUENCE)return;const l=lessons[i];$('#lessonPanel').innerHTML=`<span class="eyebrow">${l.code}</span><h2>${l.title}</h2><p class="lesson-lead">${l.lead}</p><div class="lesson-grid"><div class="lesson-block remember"><h3>Three things to remember</h3><ul>${l.remember.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="lesson-block warning"><h3>Common mistake</h3><p>${l.mistake}</p></div><div class="lesson-block worked"><h3>Worked example</h3><p>${l.example}</p></div><div class="lesson-block"><h3>Words to know</h3><div class="vocab-row">${l.vocab.map(v=>`<button class="vocab" data-word="${v}">${v}</button>`).join('')}</div></div></div><div class="lesson-actions"><button class="button primary" id="lessonSim">Open its simulation</button><button class="button" id="markLesson">${completed.has(l.code)?'✓ Marked complete':'Mark lesson complete'}</button></div>`;$('#lessonSim').onclick=()=>{currentSim=l.sim;showView('lab');activateSim(l.sim)};$('#markLesson').onclick=()=>{completed.has(l.code)?completed.delete(l.code):completed.add(l.code);saveProgress();renderLesson(i)};$('#lessonPanel').querySelectorAll('[data-word]').forEach(b=>b.onclick=()=>showGlossary(b.dataset.word))}
function showGlossary(word){document.querySelector('.glossary-pop')?.remove();const p=document.createElement('div');p.className='glossary-pop';p.innerHTML=`<button aria-label="Close">✕</button><strong>${word}</strong><span>${glossary[word]||'Key AQA physics term.'}</span>`;p.querySelector('button').onclick=()=>p.remove();document.body.appendChild(p)}
renderCourseList();renderLesson(0);updateProgress();

function renderSpec(){const grid=$('#specGrid');if(!grid)return;grid.innerHTML=lessons.map((l,i)=>`<article class="spec-card"><div class="status"><span class="eyebrow">${l.code}</span><span class="${completed.has(l.code)?'ok':'subtle'}">${completed.has(l.code)?'✓ completed':'not marked'}</span></div><h3>${l.title}</h3><p>${l.remember.join(' ')}</p><button class="button" data-spec-lesson="${i}">Open lesson</button></article>`).join('');grid.querySelectorAll('[data-spec-lesson]').forEach(b=>b.onclick=()=>{currentLesson=Number(b.dataset.specLesson);if(window.PARTICLELAB_LESSON_SEQUENCE){window.PARTICLELAB_LESSON_SEQUENCE.openLesson?.(currentLesson+1);return;}showView('course');renderCourseList();renderLesson(currentLesson)})}
renderSpec();

const simNav=$('#simNav');simNav.innerHTML=simDefs.map(([id,name,code])=>`<button class="button sim-tab ${id===currentSim?'active':''}" data-sim="${id}"><span class="small subtle">${code}</span> ${name} <span class="sim-3d-badge">3D</span></button>`).join('');simNav.querySelectorAll('[data-sim]').forEach(b=>b.onclick=()=>activateSim(b.dataset.sim));
function activateSim(id){currentSim=id;processClock=performance.now();selectedHotspot=null;$$('.sim-tab').forEach(b=>b.classList.toggle('active',b.dataset.sim===id));const def=simDefs.find(s=>s[0]===id),t=simText[id];$('#specCode').textContent=`AQA ${def[2]}`;$('#simTitle').textContent=def[1];$('#simSubtitle').textContent=t.sub;$('#simpleExplain').innerHTML=`<p>${t.simple}</p>`;$('#examExplain').innerHTML=`<p>${t.exam}</p>`;$('#mistakeExplain').innerHTML=`<p>${t.mistake}</p>`;renderSimCheck(id);if($('#live3DSelected'))$('#live3DSelected').textContent='Use the Model guide beside the simulation to identify each object. The 3D scene now contains only the physics model.';if(threeReady&&builders[id]){builders[id]();queueMicrotask(()=>addHotspots(id))}else{$('#simControls').innerHTML='<div class="field"><span>3D model</span><div class="field-readout">The explanation is ready. The 3D engine is still loading.</div></div>';$('#simReadout').textContent='Loading interactive model…'}queueMicrotask(updateLivePanel)}
function renderSimCheck(id){const q={atom:['Which number identifies the element?',['A','Z','number of neutrons'],1],specific:['Specific charge has units…',['C kg⁻¹','kg C⁻¹','J s'],0],strong:['At about 1 fm the strong force is mainly…',['attractive','zero','always repulsive'],0],decay:['In β⁻ decay Z…',['falls by 1','stays same','rises by 1'],2],antimatter:['Electron + positron can produce…',['two gamma photons','two protons','a neutron only'],0],interactions:['EM exchange particle?',['virtual photon','W⁻ only','pion'],0],classification:['A kaon is a…',['baryon','meson','lepton'],1],quarks:['Proton quarks?',['udd','uud','u d̄'],1],photo:['Below threshold frequency, more intensity gives…',['no emission','higher KE electrons','higher photon energy'],0],collisions:['Excitation means…',['electron removed','higher bound level','nucleus splits'],1],levels:['Downward transition…',['emits photon','absorbs photon','changes Z'],0],diffraction:['Higher momentum gives λ…',['larger','smaller','unchanged'],1],rutherford:['Most α particles passed straight through because…',['atoms are mostly empty space','nuclei are negative','alpha particles are neutral'],0]}[id];const box=$('#simCheck');box.innerHTML=`<div>${q[0]}</div><div class="quick-options">${q[1].map((x,i)=>`<button class="quick-option" data-a="${i}">${x}</button>`).join('')}</div><div id="quickFeedback" class="small subtle"></div>`;box.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>{box.querySelectorAll('[data-a]').forEach(x=>x.disabled=true);const ok=Number(b.dataset.a)===q[2];b.classList.add(ok?'correct':'wrong');if(!ok)box.querySelector(`[data-a="${q[2]}"]`).classList.add('correct');$('#quickFeedback').textContent=ok?'Correct — keep going.':'Not quite — use the simple explanation above, then try the idea again later.'})}

function renderAtlas(filter='all'){const filters=['all','hadron','lepton','antiparticle','strange'];$('#particleFilters').innerHTML=filters.map(f=>`<button class="button ${f===filter?'active':''}" data-filter="${f}">${f[0].toUpperCase()+f.slice(1)}</button>`).join('');$('#particleFilters').querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>renderAtlas(b.dataset.filter));const list=particles.filter(p=>filter==='all'||p.family.includes(filter));$('#particleButtons').innerHTML=list.map(p=>`<button class="particle-button" data-particle="${p.id}"><strong>${p.symbol}</strong><span>${p.name}</span><span>${p.family}</span></button>`).join('');$('#particleButtons').querySelectorAll('[data-particle]').forEach(b=>b.onclick=()=>showParticle(b.dataset.particle));showParticle(list[0]?.id||'p')}
function showParticle(id){const p=particles.find(x=>x.id===id);if(!p)return;$('#particleInfo').innerHTML=`<span class="eyebrow">${p.family}</span><h2>${p.symbol} · ${p.name}</h2><p>${p.note}</p><div class="particle-properties"><div><strong>Charge</strong><br>${p.charge}</div><div><strong>Mass/rest-mass scale</strong><br>${p.mass}</div><div><strong>Quark content</strong><br>${p.quarks}</div><div><strong>Baryon no.</strong><br>${p.B}</div><div><strong>Electron L</strong><br>${p.Le}</div><div><strong>Muon L</strong><br>${p.Lm}</div><div><strong>Strangeness</strong><br>${p.S}</div></div>`}
renderAtlas();

$('#reactionSelect').innerHTML=reactions.map((r,i)=>`<option value="${i}">${r.name}</option>`).join('');function renderReaction(){const r=reactions[Number($('#reactionSelect').value||0)];$('#reactionEquation').textContent=r.eq;$('#conservationResult').innerHTML=`<span class="eyebrow">${r.type} interaction</span><h3>Check each quantity</h3><table class="conservation-table"><thead><tr><th>Quantity</th><th>Before</th><th>After</th><th>Check</th></tr></thead><tbody>${r.rows.map(row=>`<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td class="${row[3]?'ok':'no'}">${row[3]?'✓ conserved':'✕ violated'}</td></tr>`).join('')}</tbody></table><div class="tip">${r.note}</div>`}$('#reactionSelect').onchange=renderReaction;renderReaction();

const formulas={
 photonF:{name:'Photon energy from frequency',inputs:[['Frequency f','f',5e14]],calc:v=>{const E=H*v.f;return [`E = hf`,`E = (6.626 × 10⁻³⁴) × (${v.f.toExponential(3)})`,`E = ${E.toExponential(3)} J = ${(E/ECHARGE).toFixed(3)} eV`]}},
 photonL:{name:'Photon energy from wavelength',inputs:[['Wavelength λ (m)','lam',5e-7]],calc:v=>{const E=H*C/v.lam;return [`E = hc/λ`,`E = (6.626 × 10⁻³⁴)(3.00 × 10⁸) / ${v.lam.toExponential(3)}`,`E = ${E.toExponential(3)} J = ${(E/ECHARGE).toFixed(3)} eV`]}},
 photo:{name:'Photoelectric KE and stopping potential',inputs:[['Frequency f (Hz)','f',8e14],['Work function φ (eV)','phi',2.3]],calc:v=>{const Eph=H*v.f/ECHARGE,ke=Math.max(0,Eph-v.phi);return [`Photon energy = hf = ${Eph.toFixed(3)} eV`,`KEmax = hf − φ = ${Eph.toFixed(3)} − ${v.phi} = ${ke.toFixed(3)} eV`,ke>0?`Stopping potential Vₛ = ${ke.toFixed(3)} V`:'hf < φ, so no photoelectrons are emitted.']}},
 deB:{name:'de Broglie wavelength',inputs:[['Momentum p (kg m s⁻¹)','p',1e-23]],calc:v=>{const l=H/v.p;return [`λ = h/p`,`λ = 6.626 × 10⁻³⁴ / ${v.p.toExponential(3)}`,`λ = ${l.toExponential(3)} m`]}},
 specific:{name:'Specific charge',inputs:[['Charge Q (C)','q',1.602e-19],['Mass m (kg)','m',1.673e-27]],calc:v=>{const s=v.q/v.m;return [`specific charge = Q/m`,`= ${v.q.toExponential(3)} / ${v.m.toExponential(3)}`,`= ${s.toExponential(3)} C kg⁻¹`]}},
 ev:{name:'eV to joules',inputs:[['Energy (eV)','ev',10]],calc:v=>{const j=v.ev*ECHARGE;return [`E(J) = E(eV) × 1.602 × 10⁻¹⁹`,`= ${v.ev} × 1.602 × 10⁻¹⁹`,`= ${j.toExponential(3)} J`]}}
};
$('#formulaSelect').innerHTML=Object.entries(formulas).map(([k,v])=>`<option value="${k}">${v.name}</option>`).join('');function renderFormula(){const key=$('#formulaSelect').value||Object.keys(formulas)[0],f=formulas[key];$('#formulaInputs').innerHTML=f.inputs.map(([label,id,val])=>`<label class="field"><span>${label}</span><input type="number" step="any" value="${val}" data-formula-input="${id}"></label>`).join('');const run=()=>{const vals={};$$('[data-formula-input]').forEach(i=>vals[i.dataset.formulaInput]=Number(i.value));const steps=f.calc(vals);$('#formulaWorking').innerHTML=steps.map((s,i)=>`<span class="step"><strong>${i+1}.</strong> ${s}</span>`).join('')};$$('[data-formula-input]').forEach(i=>i.oninput=run);run()}$('#formulaSelect').onchange=renderFormula;renderFormula();
$('#formulaCards').innerHTML=[['E = hf','photon energy from frequency'],['E = hc/λ','photon energy from wavelength'],['hf = φ + KEmax','photoelectric equation'],['KEmax = eVₛ','stopping potential'],['λ = h/p','de Broglie wavelength'],['specific charge = Q/m','charge-to-mass ratio'],['1 eV = 1.602×10⁻¹⁹ J','energy conversion']].map(x=>`<div class="formula-card"><code>${x[0]}</code><span class="subtle small">${x[1]}</span></div>`).join('');

function renderQuiz(){const q=quiz[quizIndex];quizLocked=false;$('#quizProgressText').textContent=`${quizIndex+1} / ${quiz.length}`;$('#quizProgressBar').style.width=`${(quizIndex+1)/quiz.length*100}%`;$('#quizScore').textContent=quizScore;$('#quizStreak').textContent=quizStreak;$('#quizSpec').textContent=`AQA ${q[0]}`;$('#quizQuestion').textContent=q[1];$('#quizHint').classList.add('hidden');$('#quizHint').textContent=q[4];$('#quizFeedback').className='feedback hidden';$('#nextQuestion').classList.add('hidden');$('#quizChoices').innerHTML=q[2].map((c,i)=>`<button class="choice-button" data-choice="${i}">${c}</button>`).join('');$('#quizChoices').querySelectorAll('[data-choice]').forEach(b=>b.onclick=()=>answerQuiz(Number(b.dataset.choice)))}
function answerQuiz(i){if(quizLocked)return;quizLocked=true;const q=quiz[quizIndex],ok=i===q[3];if(ok){quizScore++;quizStreak++}else quizStreak=0;$('#quizScore').textContent=quizScore;$('#quizStreak').textContent=quizStreak;$('#quizChoices').querySelectorAll('[data-choice]').forEach(b=>{b.disabled=true;const j=Number(b.dataset.choice);if(j===q[3])b.classList.add('correct');else if(j===i)b.classList.add('wrong')});const f=$('#quizFeedback');f.className=`feedback ${ok?'good':'bad'}`;f.innerHTML=`<strong>${ok?'Correct.':'Not quite.'}</strong> ${q[5]}`;$('#nextQuestion').classList.remove('hidden')}
$('#showHint').onclick=()=>$('#quizHint').classList.toggle('hidden');$('#nextQuestion').onclick=()=>{quizIndex=(quizIndex+1)%quiz.length;renderQuiz()};$('#restartQuiz').onclick=()=>{quizIndex=0;quizScore=0;quizStreak=0;renderQuiz()};renderQuiz();

const mapNodes=[
 ['atom','Atomic structure',110,90],['strong','Nuclear stability',390,90],['antimatter','Antiparticles & photons',700,90],['interactions','Interactions',930,210],['classification','Classification',660,300],['quarks','Quarks',350,300],['decay','Conservation & decay',120,330],['photo','Photoelectric effect',180,560],['collisions','Electron collisions',455,560],['levels','Energy levels',710,560],['diffraction','Wave–particle duality',950,560],['rutherford','Rutherford extension',930,385]
];const mapEdges=[['atom','strong'],['strong','decay'],['decay','quarks'],['quarks','classification'],['classification','interactions'],['interactions','antimatter'],['antimatter','photo'],['photo','levels'],['collisions','levels'],['levels','diffraction'],['classification','quarks'],['atom','rutherford'],['rutherford','strong']];function renderMap(){const svg=$('#conceptMap'),pos=Object.fromEntries(mapNodes.map(n=>[n[0],[n[2],n[3]]]));svg.innerHTML=mapEdges.map(([a,b])=>`<line class="map-edge" x1="${pos[a][0]}" y1="${pos[a][1]}" x2="${pos[b][0]}" y2="${pos[b][1]}"/>`).join('')+mapNodes.map(([id,label,x,y])=>`<g class="map-node" data-map="${id}" transform="translate(${x-92},${y-30})"><rect width="184" height="60" rx="14"/><text x="92" y="26" text-anchor="middle">${label.includes('&')?label.split(' &')[0]:label}</text><text x="92" y="46" text-anchor="middle" style="font-size:12px;fill:#9fb3ca">${label.includes('&')?'&'+label.split('&')[1]:simDefs.find(s=>s[0]===id)?.[2]||''}</text></g>`).join('');svg.querySelectorAll('[data-map]').forEach(g=>g.onclick=()=>selectMap(g.dataset.map));selectMap('atom')}
function selectMap(id){$('#conceptMap').querySelectorAll('[data-map]').forEach(g=>g.classList.toggle('active',g.dataset.map===id));const d=simDefs.find(s=>s[0]===id),t=simText[id];$('#mapInfo').innerHTML=`<span class="eyebrow">${d?.[2]||'Extension'}</span><h2>${d?.[1]||id}</h2><p>${t.simple}</p><div class="tip"><strong>Exam link:</strong> ${t.exam}</div><button id="mapOpen" class="button primary">Open simulation</button>`;$('#mapOpen').onclick=()=>{currentSim=id;showView('lab');activateSim(id)}}renderMap();

let THREE=null,renderer=null,scene=null,camera=null,world=null,raycaster=null,pointer=null,hotspotGroup=null,selectedHotspot=null,hotspotsVisible=false,threeReady=false,paused=false,drag=false,pointerMoved=false,lastX=0,lastY=0,animator=()=>{},clockStart=performance.now(),processClock=performance.now(),lastLiveUpdate=0;
const builders={};

const hotspotDefs={
 atom:[
  {p:[0,0,1.25],title:'Nucleus',what:'The tiny central region containing protons and neutrons.',science:'Almost all atomic mass is concentrated here. Proton number Z identifies the element.',exam:'State Z as proton number and A as total nucleon number.'},
  {p:[2.7,1.0,.4],title:'Electron cloud',what:'A probability-style region showing where electrons may be found.',science:'This is not a fixed planetary orbit. Atomic size is dominated by the electron region.',exam:'For a neutral atom, number of electrons = number of protons.'}
 ],
 specific:[
  {p:[0,0,1.2],title:'Mass of the ion/nucleus',what:'Most of the mass comes from protons and neutrons.',science:'Specific charge depends on the total particle mass, not only its charge.',exam:'specific charge = Q/m, unit C kg⁻¹.'},
  {p:[2.5,1.1,.3],title:'Electrons',what:'Electrons change the net charge while adding very little mass.',science:'Removing electrons can make Q positive; adding electrons can make Q negative.',exam:'Find net charge first, then divide by the whole mass.'}
 ],
 strong:[
  {p:[-1.25,0,.7],title:'Proton / nucleon',what:'One of the two nucleons in the force model.',science:'At nuclear separations nucleons experience the strong interaction.',exam:'The strong nuclear force is short range.'},
  {p:[0,1.15,.4],title:'Force region',what:'The arrows show the direction of the strong force at the selected separation.',science:'It is repulsive below about 0.5 fm, attractive over normal nuclear separations and negligible beyond about 3 fm.',exam:'Do not describe it as always attractive.'}
 ],
 decay:[
  {p:[0,0,1.2],title:'Parent nucleus',what:'The unstable nucleus before the decay.',science:'The decay changes the nucleus while conserving charge, energy and momentum.',exam:'Track A and Z carefully.'},
  {p:[2.7,1.25,.3],title:'Emitted charged particle',what:'This becomes the alpha particle, beta electron or positron depending on the selected process.',science:'In beta decay the beta particle is created in the weak interaction.',exam:'β⁻: Z +1; β⁺: Z −1; A unchanged.'},
  {p:[2.7,-1.0,.5],title:'Neutrino / antineutrino',what:'The neutral lepton emitted in beta processes.',science:'It is required for lepton-number, energy and momentum conservation.',exam:'β⁻ emits an electron antineutrino; β⁺ emits an electron neutrino.'}
 ],
 antimatter:[
  {p:[-2.7,0,.5],title:'Matter particle',what:'The electron or incoming photon side of the process.',science:'Matter–antimatter processes convert between rest energy, kinetic energy and photon energy.',exam:'Track the quoted rest energies, photon energy and conservation of energy and momentum. Use E = hf for photons.'},
  {p:[2.7,0,.5],title:'Antiparticle / products',what:'The positron or produced particle side of the process.',science:'A particle and antiparticle have equal rest mass and opposite relevant quantum numbers.',exam:'e⁻ + e⁺ annihilation commonly produces two gamma photons.'},
  {p:[0,1.5,.4],title:'Energy conversion',what:'This marker highlights the interaction region where the process changes form.',science:'Energy and momentum must both be conserved.',exam:'Electron–positron pair creation needs at least 1.022 MeV of rest energy.'}
 ],
 interactions:[
  {p:[-3,0,.6],title:'Incoming particle',what:'A particle entering the interaction.',science:'Start a particle-interaction diagram by identifying every incoming particle and its quantum numbers.',exam:'Check charge, baryon number and lepton number.'},
  {p:[0,.75,.5],title:'Exchange particle',what:'The interaction is represented using an exchange particle.',science:'AQA uses a virtual photon for electromagnetic interactions and W⁺/W⁻ for the weak processes studied here.',exam:'Name the correct exchange particle and then check the vertices.'},
  {p:[3,0,.6],title:'Outgoing particle',what:'A particle after the interaction.',science:'Outgoing particles must make the full reaction conserve the required quantities.',exam:'Also remember total energy and momentum conservation.'}
 ],
 classification:[
  {p:[-2.5,1.8,.5],title:'Baryons',what:'Protons and neutrons are baryons and therefore hadrons.',science:'Baryons contain three quarks and have baryon number +1.',exam:'Proton and neutron are the key AQA baryon examples.'},
  {p:[.5,1.4,.5],title:'Mesons',what:'Pions and kaons are mesons and therefore hadrons.',science:'Mesons contain a quark and an antiquark, so total baryon number is zero.',exam:'Kaons are strange mesons.'},
  {p:[3,1.5,.5],title:'Leptons',what:'Electrons, muons and neutrinos are leptons.',science:'Leptons do not take part in the strong interaction.',exam:'Track electron and muon lepton numbers separately.'}
 ],
 quarks:[
  {p:[0,0,1.25],title:'Quark content',what:'The coloured spheres represent the u, d or s quarks/antiquarks used to build the selected hadron.',science:'Add fractional charge, baryon number and strangeness to get the hadron totals.',exam:'p = uud; n = udd.'},
  {p:[0,1.45,.25],title:'Hadron binding model',what:'The connecting lines are a teaching visual showing that the quarks belong to one hadron.',science:'They are not literal rods or strings visible inside the particle.',exam:'Meson = quark + antiquark; baryon = three quarks.'}
 ],
 photo:[
  {p:[-2.6,1.3,.4],title:'Photon',what:'One photon approaches the metal surface carrying energy hf.',science:'Photon energy depends on frequency, not intensity.',exam:'E = hf.'},
  {p:[1.2,0,1.2],title:'Metal surface',what:'Electrons in the metal require at least the work function φ to escape.',science:'Below threshold frequency no photoelectrons are emitted, however intense the light.',exam:'hf = φ + KEmax.'},
  {p:[3.0,1.0,.4],title:'Photoelectron',what:'An emitted electron carries the photon energy left after overcoming the work function.',science:'Its maximum kinetic energy is hf − φ.',exam:'KEmax = eVs.'}
 ],
 collisions:[
  {p:[-3,0,.4],title:'Incident electron',what:'The incoming electron carries kinetic energy into the collision.',science:'It can transfer only an allowed excitation energy or enough energy for ionisation.',exam:'1 eV = 1.602 × 10⁻¹⁹ J.'},
  {p:[0,0,1.1],title:'Atom',what:'The atom can be excited or ionised depending on the transferred energy.',science:'Excitation leaves an electron bound; ionisation removes it completely.',exam:'Do not treat excitation energies as continuous.'},
  {p:[1.7,1.3,.4],title:'After the collision',what:'This region shows the changed atomic state or ejected electron.',science:'Any leftover energy remains as kinetic energy of particles after the collision.',exam:'Apply energy conservation.'}
 ],
 levels:[
  {p:[0,0,1.2],title:'Allowed energy levels',what:'Each disc represents an allowed atomic energy, not a physical orbit in space.',science:'Atomic energies are discrete.',exam:'Line spectra are evidence for discrete energy levels.'},
  {p:[0,2.0,.5],title:'Electron transition',what:'The electron marker moves from the selected upper level to the lower level.',science:'The energy lost becomes one photon.',exam:'ΔE = hf.'},
  {p:[2.5,1.1,.4],title:'Photon',what:'The photon carries exactly the energy difference between the two levels.',science:'A larger energy difference gives higher frequency and shorter wavelength.',exam:'ΔE = hf = hc/λ.'}
 ],
 diffraction:[
  {p:[-2.7,0,.4],title:'Electron beam',what:'Electrons are accelerated towards the diffracting structure/screen.',science:'Increasing accelerating voltage increases electron momentum.',exam:'Use λ = h/p.'},
  {p:[3.1,0,1.1],title:'Diffraction screen',what:'The screen shows the distribution of diffracted electrons.',science:'A ring pattern is evidence of electron wave behaviour.',exam:'Electron diffraction supports wave–particle duality.'},
  {p:[3.0,1.7,.4],title:'Diffraction rings',what:'The ring spacing changes as the electron wavelength changes.',science:'Higher momentum gives shorter de Broglie wavelength and a tighter pattern.',exam:'Increasing p decreases λ.'}
 ],
 rutherford:[
  {p:[0,0,1.3],title:'Positive nucleus',what:'The gold nucleus contains concentrated positive charge and most of the atomic mass.',science:'An alpha particle passing close to it experiences strong electrostatic repulsion.',exam:'Rare large deflections imply a tiny concentrated positive nucleus.'},
  {p:[-1.2,.8,.5],title:'Close alpha path',what:'A small impact parameter brings the alpha particle close to the nucleus.',science:'Closer approach gives a larger Coulomb deflection.',exam:'Smaller impact parameter → larger scattering angle.'},
  {p:[-1.3,1.7,.4],title:'Distant alpha path',what:'Most alpha particles pass far from a nucleus and are barely deflected.',science:'This is consistent with the atom being mostly empty space.',exam:'Most alpha particles passed straight through the foil.'}
 ]
};
window.PARTICLELAB_GUIDES=hotspotDefs;

const processTimelines={
 decay:{duration:2600,steps:['Unstable nucleus','Weak change inside the nucleus','Emitted particles separate','Daughter nucleus remains']},
 antimatter:{duration:2400,steps:['Particles/photon approach','Energy is concentrated at the interaction','New photons or pair appear','Energy and momentum are checked']},
 interactions:{duration:2200,steps:['Incoming particles','Exchange particle carries the interaction','Interaction vertex','Outgoing particles']},
 photo:{duration:2200,steps:['Photon approaches metal','Photon energy transfers to one electron','Electron overcomes work function','Photoelectron leaves the surface']},
 collisions:{duration:2600,steps:['Electron approaches','Collision occurs','Excitation or ionisation happens','Particles leave with conserved energy']},
 levels:{duration:3000,steps:['Electron begins on upper level','Electron changes energy','Photon is emitted','Electron remains on lower level']},
 diffraction:{duration:2200,steps:['Electron beam travels','Electron reaches diffracting structure','Wave-like diffraction occurs','Ring pattern is observed']},
 rutherford:{duration:3000,steps:['Alpha particle approaches','Coulomb repulsion increases near nucleus','Trajectory bends','Detector records the scattering angle']}
};

function appTranslate(text){
 const raw=String(text);
 const zh=(document.documentElement.lang||'').toLowerCase().startsWith('zh');
 if(!zh)return raw;
 const exact=window.PARTICLELAB_MANDARIN_GLOBAL?.[raw];
 if(exact)return exact;
 const step=raw.match(/^Step\s+(\d+)\s+of\s+(\d+)$/i);
 if(step)return '第 '+step[1]+' / '+step[2]+' 步';
 return window.PARTICLELAB_LANGUAGE?.translate?.(raw)||raw;
}
window.PARTICLELAB_APP_TRANSLATE=appTranslate;
function makeHotspotLabel(text){
 const cv=document.createElement('canvas');cv.width=512;cv.height=96;
 const x=cv.getContext('2d');x.clearRect(0,0,512,96);x.fillStyle='rgba(5,17,30,.88)';x.strokeStyle='rgba(126,216,255,.75)';x.lineWidth=3;
 x.beginPath();x.roundRect(8,8,496,80,20);x.fill();x.stroke();
 x.fillStyle='#eaf7ff';x.font='700 28px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(appTranslate(text),256,49);
 const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;
 const mat=new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false});
 const sp=new THREE.Sprite(mat);sp.scale.set(2.4,.45,1);sp.position.y=.52;sp.renderOrder=50;return sp;
}
function makeHotspot(def,index){
 const g=new THREE.Group();g.position.set(def.p[0],def.p[1],def.p[2]||0);g.userData.hotspotInfo=def;g.userData.hotspotIndex=index;
 // Large invisible hit target: clickable, but never looks like a physics particle.
 const hit=new THREE.Mesh(new THREE.SphereGeometry(.28,12,10),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
 hit.userData.hotspotInfo=def;g.add(hit);
 const ringMat=new THREE.MeshBasicMaterial({color:0xbbeaff,transparent:true,opacity:.88,depthTest:false});
 const ringA=new THREE.Mesh(new THREE.TorusGeometry(.25,.025,8,40),ringMat.clone());
 const ringB=new THREE.Mesh(new THREE.TorusGeometry(.25,.025,8,40),ringMat.clone());ringB.rotation.x=Math.PI/2;
 const ringC=new THREE.Mesh(new THREE.TorusGeometry(.25,.025,8,40),ringMat.clone());ringC.rotation.y=Math.PI/2;
 [ringA,ringB,ringC].forEach(r=>{r.userData.hotspotInfo=def;g.add(r)});
 const stem=new THREE.Line(
   new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,.24,0),new THREE.Vector3(0,.48,0)]),
   new THREE.LineBasicMaterial({color:0xbbeaff,transparent:true,opacity:.75,depthTest:false})
 );
 stem.userData.hotspotInfo=def;g.add(stem);
 const label=makeHotspotLabel(String(index+1)+' · '+def.title);label.userData.hotspotInfo=def;g.add(label);
 return g;
}
function addHotspots(id){
 if(hotspotGroup&&hotspotGroup.parent)world.remove(hotspotGroup);
 hotspotGroup=new THREE.Group();
 hotspotGroup.name='learning-hotspots';
 (hotspotDefs[id]||[]).forEach((def,i)=>hotspotGroup.add(makeHotspot(def,i)));
 hotspotGroup.visible=hotspotsVisible;
 world.add(hotspotGroup);
 selectedHotspot=null;
 const toggle=$('#toggleHotspots');
 if(toggle){
   toggle.textContent=hotspotsVisible?'Hide 3D labels':'Inspect 3D';
   toggle.classList.toggle('primary',hotspotsVisible);
   toggle.setAttribute('aria-pressed',String(hotspotsVisible));
 }
 updateLivePanel();
}
function hotspotInfoFromObject(o){
 let n=o;while(n&&n!==world){if(n.userData&&n.userData.hotspotInfo)return n.userData.hotspotInfo;n=n.parent}return null;
}
function hotspotNodeFromObject(o){
 let n=o;while(n&&n!==world){if(n.userData&&n.userData.hotspotInfo&&n.type==='Group')return n;n=n.parent}return null;
}
function ensureInteractionPanel(){
 const wrap=$('.viewer-wrap');if(!wrap)return;
 if(!$('#live3DPanel')){
  const p=document.createElement('div');p.id='live3DPanel';p.className='live-3d-panel';
  p.innerHTML='<div class="live-3d-head"><span class="eyebrow">Live 3D explanation</span><strong id="live3DStage">Explore the model</strong></div><div id="live3DNow" class="live-3d-now"></div><div id="live3DSelected" class="live-3d-selected">Use the Model guide beside the simulation to identify each object. The 3D scene now contains only the physics model.</div><div class="live-3d-grid"><div><span>Science</span><p id="live3DScience"></p></div><div><span>Exam link</span><p id="live3DExam"></p></div></div>';
  wrap.appendChild(p);
 }
 if(!$('#toggleHotspots')){
  const b=document.createElement('button');b.type='button';b.id='toggleHotspots';b.className='button model-guide-hint';b.textContent='Inspect 3D';b.setAttribute('aria-pressed','false');
  b.onclick=()=>{hotspotsVisible=!hotspotsVisible;if(hotspotGroup)hotspotGroup.visible=hotspotsVisible;b.textContent=hotspotsVisible?'Hide 3D labels':'Inspect 3D';b.classList.toggle('primary',hotspotsVisible);b.setAttribute('aria-pressed',String(hotspotsVisible));if(hotspotsVisible){selectedHotspot=null;updateLivePanel()}};
  $('.viewer-buttons')?.appendChild(b);
 }
}
function currentDynamicState(){
 const id=currentSim;
 try{
  if(id==='atom'){const v=$('#iso')?.value||'6,12';const a=v.split(',').map(Number);return 'Selected isotope: Z = '+a[0]+', A = '+a[1]+', neutrons = '+(a[1]-a[0])+'.';}
  if(id==='specific'){const Z=+($('#scZ')?.value||6),A=Math.max(+($('#scA')?.value||12),Z),ne=+($('#scE')?.value||Z);const q=(Z-ne)*ECHARGE,m=Z*MP+(A-Z)*MN+ne*ME;return 'Net charge = '+(Z-ne)+'e; specific charge ≈ '+(q/m).toExponential(2)+' C kg⁻¹.';}
  if(id==='strong'){const d=+($('#sep')?.value||120)/100;const st=d<.5?'repulsive':d<=3?'attractive':'negligible';return 'Nucleon separation = '+d.toFixed(2)+' fm, so the strong force is currently '+st+'.';}
  if(id==='decay'){const m=$('#decayMode')?.value||'bm';return m==='alpha'?'Alpha decay: a helium-4 nucleus is emitted.':m==='bm'?'Beta-minus: neutron character changes to proton character; e⁻ and anti-νₑ are emitted.':'Beta-plus: proton character changes to neutron character; e⁺ and νₑ are emitted.';}
  if(id==='antimatter'){const m=$('#antiMode')?.value||'ann';return m==='ann'?'An electron and positron approach and convert their energy into photons.':'A high-energy photon near a nucleus can create an electron–positron pair.';}
  if(id==='interactions'){const m=$('#intMode')?.value||'em';return 'Selected interaction: '+({em:'electromagnetic virtual-photon exchange',bm:'beta-minus weak interaction',bp:'beta-plus weak interaction',capture:'electron capture',ep:'electron–proton collision'}[m]||m)+'.';}
  if(id==='classification'){return 'Highlighted family: '+($('#fam')?.value||'all particles')+'. Use the Model guide to compare groups.';}
  if(id==='quarks'){return 'Selected hadron: '+($('#had')?.selectedOptions?.[0]?.textContent||'proton p = uud')+'. Add the quark quantum numbers to check the totals.';}
  if(id==='photo'){const f=+($('#pf')?.value||8)*1e14,phi=+($('#pphi')?.value||2.3),eph=H*f/ECHARGE,ke=Math.max(0,eph-phi);return ke>0?'Photon energy '+eph.toFixed(2)+' eV exceeds φ = '+phi.toFixed(2)+' eV; photoemission occurs with KEmax = '+ke.toFixed(2)+' eV.':'Photon energy '+eph.toFixed(2)+' eV is below φ = '+phi.toFixed(2)+' eV; no photoemission occurs.';}
  if(id==='collisions'){const E=+($('#ce')?.value||11),vals=($('#ct')?.value||'10.2,13.6').split(',').map(Number);return E>=vals[1]?'Incident electron has enough energy for ionisation.':E>=vals[0]?'Incident electron can excite the atom to an allowed higher state.':'Incident electron is below the first model excitation threshold.';}
  if(id==='levels'){return 'Selected transition: '+($('#tr')?.selectedOptions?.[0]?.textContent||'n=3 → n=2')+'. The emitted photon carries exactly the energy difference.';}
  if(id==='diffraction'){const V=+($('#dv')?.value||200),p=Math.sqrt(2*ME*ECHARGE*V),lam=H/p;return 'At '+V+' V, electron wavelength ≈ '+(lam*1e10).toFixed(3)+' Å. Higher voltage tightens the diffraction pattern.';}
  if(id==='rutherford'){const b=+($('#rb')?.value||70)/100,Z=+($('#rz')?.value||79);return 'Impact parameter b = '+b.toFixed(2)+' scaled units and nuclear charge Z = '+Z+'. Smaller b or larger Z gives stronger deflection.';}
 }catch(e){}
 return 'Use the controls and the Model guide to connect the visual model to the physics.';
}
function currentTimelineStage(){
 const t=processTimelines[currentSim];if(!t)return {label:'Current state',text:currentDynamicState()};
 const q=((performance.now()-processClock)%t.duration)/t.duration;const i=Math.min(t.steps.length-1,Math.floor(q*t.steps.length));
 return {label:'Step '+(i+1)+' of '+t.steps.length,text:t.steps[i]};
}
function updateLivePanel(){
 ensureInteractionPanel();
 const stage=currentTimelineStage();
 if($('#live3DStage'))$('#live3DStage').textContent=appTranslate(stage.label)+' · '+appTranslate(stage.text);
 if($('#live3DNow'))$('#live3DNow').textContent=appTranslate(currentDynamicState());
 const base=hotspotDefs[currentSim]?.[0];
 if(!selectedHotspot&&base){
  if($('#live3DScience'))$('#live3DScience').textContent=appTranslate(base.science);
  if($('#live3DExam'))$('#live3DExam').textContent=appTranslate(base.exam);
 }
}
window.addEventListener('particlelab:guide-select',e=>{
 const info=e.detail;
 if(!info)return;
 selectedHotspot=info;
 if($('#live3DSelected'))$('#live3DSelected').innerHTML='<strong>'+appTranslate(info.title)+'</strong> · '+appTranslate(info.what);
 if($('#live3DScience'))$('#live3DScience').textContent=appTranslate(info.science);
 if($('#live3DExam'))$('#live3DExam').textContent=appTranslate(info.exam);
});
function selectHotspotAt(e){
 if(!raycaster||!pointer||!camera||!world||!hotspotGroup||hotspotGroup.visible===false)return false;
 const rect=renderer.domElement.getBoundingClientRect();pointer.x=((e.clientX-rect.left)/rect.width)*2-1;pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
 raycaster.setFromCamera(pointer,camera);const hits=raycaster.intersectObjects(hotspotGroup.children,true);
 if(!hits.length)return false;
 const info=hotspotInfoFromObject(hits[0].object),node=hotspotNodeFromObject(hits[0].object);if(!info)return false;
 selectedHotspot=info;
 hotspotGroup.children.forEach(g=>g.scale.setScalar(g===node?1.32:1));
 if($('#live3DSelected'))$('#live3DSelected').innerHTML='<strong>'+appTranslate(info.title)+'</strong> · '+appTranslate(info.what);
 if($('#live3DScience'))$('#live3DScience').textContent=appTranslate(info.science);
 if($('#live3DExam'))$('#live3DExam').textContent=appTranslate(info.exam);
 window.dispatchEvent(new CustomEvent('particlelab:hotspot',{detail:{sim:currentSim,title:info.title}}));
 return true;
}
function animateHotspots(t){
 if(!hotspotGroup||hotspotGroup.visible===false)return;
 hotspotGroup.children.forEach((g,i)=>{const s=g.userData.hotspotInfo===selectedHotspot?1.32:1;const pulse=1+.07*Math.sin(t*3+i);g.scale.setScalar(s*pulse);g.children.forEach(o=>{if(o.type==='Sprite')o.quaternion.copy(camera.quaternion)})});
}
function threeColor(css){return new THREE.Color(css)}
function sphere(r,color,opacity=1){const m=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),new THREE.MeshStandardMaterial({color,roughness:.24,metalness:.1,transparent:opacity<1,opacity}));m.castShadow=true;m.receiveShadow=true;return m}
function line3(points,color){return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity:.88}))}
function addSceneStage(id){
  if(!THREE||!world)return;
  const accents={
    atom:0x67c7ff,specific:0x7ee8ff,strong:0xff8a95,decay:0xffd56a,
    antimatter:0xc9b7ff,interactions:0x8edcff,classification:0x63d9a4,
    quarks:0xffc85f,photo:0xffe88a,collisions:0xffa65e,levels:0xb895ff,
    diffraction:0x7ee8ff,rutherford:0x66d9a6
  };
  const accent=accents[id]||0x67c7ff;
  const stage=new THREE.Group();
  stage.name='simulation-stage';

  const shadow=new THREE.Mesh(
    new THREE.PlaneGeometry(13.5,9),
    new THREE.ShadowMaterial({color:0x000000,opacity:.16})
  );
  shadow.rotation.x=-Math.PI/2;
  shadow.position.y=-2.24;
  shadow.receiveShadow=true;
  stage.add(shadow);

  const grid=new THREE.GridHelper(12,24,0x31536c,0x173044);
  grid.position.y=-2.22;
  grid.material.transparent=true;
  grid.material.opacity=.22;
  grid.material.depthWrite=false;
  stage.add(grid);

  const ring=new THREE.Mesh(
    new THREE.TorusGeometry(2.45,.015,6,96),
    new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.28,depthWrite:false})
  );
  ring.rotation.x=Math.PI/2;
  ring.position.y=-2.20;
  stage.add(ring);

  const inner=new THREE.Mesh(
    new THREE.RingGeometry(.9,1.0,64),
    new THREE.MeshBasicMaterial({color:accent,transparent:true,opacity:.08,side:THREE.DoubleSide,depthWrite:false})
  );
  inner.rotation.x=-Math.PI/2;
  inner.position.y=-2.19;
  stage.add(inner);

  world.add(stage);
}

function clearWorld(){animator=()=>{};hotspotGroup=null;selectedHotspot=null;if(!world)return;while(world.children.length){const o=world.children.pop();o.traverse?.(x=>{x.geometry?.dispose?.();if(x.material){if(Array.isArray(x.material))x.material.forEach(m=>m.dispose?.());else x.material.dispose?.()}})}queueMicrotask(()=>{if(threeReady&&world){addSceneStage(currentSim);addHotspots(currentSim)}})}
function randomBall(r){let v;do{v=new THREE.Vector3((Math.random()*2-1)*r,(Math.random()*2-1)*r,(Math.random()*2-1)*r)}while(v.length()>r);return v}
function cluster(Z,A,size=.16){const g=new THREE.Group(),R=.42+.16*Math.cbrt(Math.min(A,210));for(let i=0;i<A;i++){const m=sphere(size,i<Z?'#ff7777':'#72a9ff');m.position.copy(randomBall(R));g.add(m)}return g}
function setCamera(z=8){camera.position.set(0,1.3,z);camera.lookAt(0,0,0);world.rotation.set(0,0,0)}
function control(label,inner){return `<label class="field"><span>${appTranslate(label)}</span>${inner}</label>`}
function setReadout(html){
 const box=$('#simReadout');
 const parts=String(html)
   .replace(/<br\s*\/?>/gi,' · ')
   .split(/\s*·\s*/)
   .map(x=>x.trim())
   .filter(Boolean);
 box.innerHTML='<div class="sim-readout-flow">'+parts.map(x=>'<span class="sim-readout-chip">'+x+'</span>').join('')+'</div>';
 queueMicrotask(updateLivePanel);
}

builders.atom=()=>{clearWorld();setCamera(8);
  const zh=window.PARTICLELAB_LANGUAGE?.get?.()==='zh';
  const presets=[
    ['1,0,1',zh?'氢-1 · ¹₁H':'Hydrogen-1 · ¹₁H'],['6,6,6',zh?'碳-12 · ¹²₆C':'Carbon-12 · ¹²₆C'],['6,8,6',zh?'碳-14 · ¹⁴₆C':'Carbon-14 · ¹⁴₆C'],
    ['8,8,8',zh?'氧-16 · ¹⁶₈O':'Oxygen-16 · ¹⁶₈O'],['11,12,11',zh?'钠-23 · ²³₁₁Na':'Sodium-23 · ²³₁₁Na'],['17,18,17',zh?'氯-35 · ³⁵₁₇Cl':'Chlorine-35 · ³⁵₁₇Cl'],
    ['17,20,17',zh?'氯-37 · ³⁷₁₇Cl':'Chlorine-37 · ³⁷₁₇Cl'],['79,118,79',zh?'金-197 · ¹⁹⁷₇₉Au':'Gold-197 · ¹⁹⁷₇₉Au'],['custom',zh?'自定义同位素 / 离子':'Custom isotope / ion']
  ];
  const symbols={1:'H',2:'He',3:'Li',4:'Be',5:'B',6:'C',7:'N',8:'O',9:'F',10:'Ne',11:'Na',12:'Mg',13:'Al',14:'Si',15:'P',16:'S',17:'Cl',18:'Ar',19:'K',20:'Ca',21:'Sc',22:'Ti',23:'V',24:'Cr',25:'Mn',26:'Fe',27:'Co',28:'Ni',29:'Cu',30:'Zn',79:'Au'};
  const names={1:'Hydrogen',2:'Helium',3:'Lithium',4:'Beryllium',5:'Boron',6:'Carbon',7:'Nitrogen',8:'Oxygen',9:'Fluorine',10:'Neon',11:'Sodium',12:'Magnesium',13:'Aluminium',14:'Silicon',15:'Phosphorus',16:'Sulfur',17:'Chlorine',18:'Argon',19:'Potassium',20:'Calcium',26:'Iron',29:'Copper',30:'Zinc',79:'Gold'};
  const namesZH={1:'氢',2:'氦',3:'锂',4:'铍',5:'硼',6:'碳',7:'氮',8:'氧',9:'氟',10:'氖',11:'钠',12:'镁',13:'铝',14:'硅',15:'磷',16:'硫',17:'氯',18:'氩',19:'钾',20:'钙',26:'铁',29:'铜',30:'锌',79:'金'};
  const sup={'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
  const sub={'0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉'};
  const digits=(n,map)=>String(n).split('').map(x=>map[x]||x).join('');
  const notation=(A,Z,symbol)=>digits(A,sup)+digits(Z,sub)+symbol;

  $('#simControls').innerHTML=
    '<div class="atom-isotope-intro">'+(zh?'构建同位素：保持质子数 Z 不变，只改变中子数；核子数 A 会自动更新。':'Build an isotope: keep proton number Z fixed and change neutron number. Mass number A updates automatically.')+'</div>'+
    control(zh?'快速同位素预设':'Quick isotope preset','<select id="iso">'+presets.map((p,i)=>'<option value="'+p[0]+'" '+(i===1?'selected':'')+'>'+p[1]+'</option>').join('')+'</select>')+
    '<div class="atom-builder-grid">'+
      control(zh?'质子 · Z':'Protons · Z','<input id="atomZ" type="number" min="1" max="100" value="6"><div class="field-readout" id="atomZr">'+(zh?'Z = 6 个质子':'Z = 6 protons')+'</div>')+
      control(zh?'中子 · N':'Neutrons · N','<input id="atomN" type="number" min="0" max="180" value="6"><div class="field-readout" id="atomNr">'+(zh?'N = 6 个中子':'N = 6 neutrons')+'</div>')+
      control(zh?'核子数 · A':'Mass number · A','<input id="atomA" type="number" value="12" readonly aria-readonly="true"><div class="field-readout" id="atomAr">A = Z + N = 12</div>')+
      control(zh?'电子':'Electrons','<input id="atomE" type="number" min="0" max="100" value="6"><div class="field-readout" id="atomEr">'+(zh?'电子数 = 6':'electrons = 6')+'</div>')+
    '</div>'+
    '<div class="atom-isotope-actions"><span>'+(zh?'改变同位素：':'Change isotope:')+'</span><button class="button" id="atomNMinus">'+(zh?'− 中子':'− neutron')+'</button><button class="button primary" id="atomNPlus">'+(zh?'+ 中子':'+ neutron')+'</button><span class="atom-isotope-note">'+(zh?'Z 保持不变':'Z stays fixed')+'</span></div>'+
    '<div class="atom-builder-actions"><button class="button" id="atomNeutral">'+(zh?'变为中性':'Make neutral')+'</button><button class="button" id="atomPlus">'+(zh?'变为 +1 离子':'Make +1 ion')+'</button><button class="button" id="atomMinus">'+(zh?'变为 −1 离子':'Make −1 ion')+'</button></div>'+
    '<div class="atom-builder-help">'+(zh?'规则：元素由 Z 决定 · 同位素改变 N · A = Z + N · 中性原子的电子数 = Z · 形成离子时只改变电子数。':'Rules: element = Z · isotope changes N · A = Z + N · neutral atom: electrons = Z · ion formation changes electrons only.')+'</div>';

  const build=()=>{
    let Z=Math.max(1,Math.min(100,+$('#atomZ').value||1));
    let N=Math.max(0,Math.min(180,+$('#atomN').value||0));
    let A=Z+N;
    let ne=Math.max(0,Math.min(100,+$('#atomE').value||0));
    $('#atomZ').value=Z;$('#atomN').value=N;$('#atomA').value=A;$('#atomE').value=ne;
    $('#atomZr').textContent=zh?'Z = '+Z+' 个质子':'Z = '+Z+' protons';
    $('#atomNr').textContent=zh?'N = '+N+' 个中子':'N = '+N+' neutrons';
    $('#atomAr').textContent='A = Z + N = '+A;
    const charge=Z-ne;
    $('#atomEr').textContent=zh?'电子数 = '+ne+' · 电荷 = '+(charge===0?'0':(charge>0?'+':'')+charge+'e'):'electrons = '+ne+' · charge = '+(charge===0?'0':(charge>0?'+':'')+charge+'e');
    clearWorld();
    const nuc=cluster(Z,A,A>120?.065:A>60?.08:.15);world.add(nuc);
    const visible=Math.min(ne,30),electronGroup=new THREE.Group();
    for(let i=0;i<visible;i++){
      const el=sphere(.085,'#76d8ff');
      const shell=i<2?1:(i<10?2:(i<18?3:4));
      const shellStart=shell===1?0:shell===2?2:shell===3?10:18;
      const shellCount=shell===1?2:shell===2?8:shell===3?8:12;
      const j=i-shellStart,a=j/Math.max(1,shellCount)*Math.PI*2,r=1.55+(shell-1)*.62;
      el.position.set(Math.cos(a)*r,Math.sin(a*1.7)*.42,Math.sin(a)*r);
      electronGroup.add(el);
    }
    world.add(electronGroup);
    const pts=[];for(let i=0;i<Math.min(1000,180+ne*8);i++){let v=randomBall(4);if(v.length()<1.5)v.setLength(1.5+Math.random()*2.3);pts.push(v.x,v.y,v.z)}
    const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));
    const cloud=new THREE.Points(geom,new THREE.PointsMaterial({color:'#76d8ff',size:.035,transparent:true,opacity:.16,depthWrite:false}));world.add(cloud);
    const symbol=symbols[Z]||('Z'+Z),element=(zh?namesZH[Z]:names[Z])||(zh?'元素 Z='+Z:'Element Z='+Z),nuclide=notation(A,Z,symbol);
    const kind=zh?(charge===0?'中性原子':(charge>0?charge+'+ 离子':Math.abs(charge)+'− 离子')):(charge===0?'neutral atom':(charge>0?charge+'+ ion':Math.abs(charge)+'− ion'));
    setReadout(zh?('核素 = '+nuclide+' · '+element+'-'+A+' · Z = '+Z+' · A = '+A+' · 质子 = '+Z+' · 中子 = '+N+' · 电子 = '+ne+' · '+kind):('nuclide = '+nuclide+' · '+element+'-'+A+' · Z = '+Z+' · A = '+A+' · protons = '+Z+' · neutrons = '+N+' · electrons = '+ne+' · '+kind));
    animator=t=>{cloud.rotation.y=t*.08;nuc.rotation.y=-t*.05;electronGroup.rotation.y=t*.12};
    window.PARTICLELAB_ATOM_STATE={Z,A,electrons:ne,neutrons:N,charge,symbol,element,nuclide,kind};
    window.dispatchEvent(new CustomEvent('particlelab:atom-change',{detail:window.PARTICLELAB_ATOM_STATE}));
  };

  const customBuild=()=>{$('#iso').value='custom';build()};
  const setPreset=()=>{
    const val=$('#iso').value;
    if(val==='custom')return;
    const [Z,N,e]=val.split(',').map(Number);
    $('#atomZ').value=Z;$('#atomN').value=N;$('#atomE').value=e;build();
  };
  $('#iso').onchange=setPreset;
  ['atomZ','atomN','atomE'].forEach(id=>{$('#'+id).oninput=customBuild;$('#'+id).onchange=customBuild});
  $('#atomNMinus').onclick=()=>{$('#atomN').value=Math.max(0,+$('#atomN').value-1);customBuild()};
  $('#atomNPlus').onclick=()=>{$('#atomN').value=Math.min(180,+$('#atomN').value+1);customBuild()};
  $('#atomNeutral').onclick=()=>{$('#atomE').value=$('#atomZ').value;customBuild()};
  $('#atomPlus').onclick=()=>{$('#atomE').value=Math.max(0,+$('#atomZ').value-1);customBuild()};
  $('#atomMinus').onclick=()=>{$('#atomE').value=Math.min(100,+$('#atomZ').value+1);customBuild()};
  build()
};
builders.specific=()=>{clearWorld();setCamera(8);$('#simControls').innerHTML=control('Proton number Z','<input id="scZ" type="range" min="1" max="30" value="6"><div id="scZr" class="field-readout"></div>')+control('Nucleon number A','<input id="scA" type="range" min="1" max="70" value="12"><div id="scAr" class="field-readout"></div>')+control('Electrons present','<input id="scE" type="range" min="0" max="30" value="6"><div id="scEr" class="field-readout"></div>');const draw=()=>{let Z=+$('#scZ').value,A=Math.max(+$('#scA').value,Z),ne=Math.min(+$('#scE').value,Z+5);$('#scA').value=A;$('#scE').value=ne;$('#scA').min=Z;$('#scE').max=Z+5;$('#scZr').textContent=`Z = ${Z}`;$('#scAr').textContent=`A = ${A}`;$('#scEr').textContent=`electrons = ${ne}`;clearWorld();const nuc=cluster(Z,A,A>35?.1:.15);world.add(nuc);for(let i=0;i<Math.min(ne,18);i++){const el=sphere(.09,'#7ee8ff');const a=i/Math.max(1,Math.min(ne,18))*Math.PI*2,r=2.3+(i%3)*.45;el.position.set(Math.cos(a)*r,Math.sin(a*1.7)*.7,Math.sin(a)*r);world.add(el)}const Q=(Z-ne)*ECHARGE,m=Z*MP+(A-Z)*MN+ne*ME,s=m?Q/m:0;setReadout(`net charge = ${(Z-ne)}e = ${Q.toExponential(3)} C<br>mass ≈ ${m.toExponential(3)} kg<br><strong>specific charge ≈ ${s.toExponential(3)} C kg⁻¹</strong>`);animator=t=>world.rotation.y=t*.07};['scZ','scA','scE'].forEach(id=>$('#'+id).oninput=draw);draw()};

builders.strong=()=>{clearWorld();setCamera(7);$('#simControls').innerHTML=control('Nucleon separation','<input id="sep" type="range" min="20" max="420" value="120"><div id="sepR" class="field-readout"></div>');const a=sphere(.52,'#ff7777'),b=sphere(.52,'#72a9ff');world.add(a,b);let arrows=[];const draw=()=>{arrows.forEach(o=>world.remove(o));arrows=[];const d=+$('#sep').value/100;a.position.x=-d*.75;b.position.x=d*.75;const state=d<.5?'repulsive':d<=3?'attractive':'negligible';$('#sepR').textContent=`${d.toFixed(2)} fm · ${state}`;setReadout(`r = ${d.toFixed(2)} fm → strong force is <strong>${state}</strong>`);if(state!=='negligible'){const toward=state==='attractive',col=state==='attractive'?0x63d9a4:0xff7b87;const ar1=new THREE.ArrowHelper(new THREE.Vector3(toward?1:-1,0,0),a.position.clone(),.9,col,.22,.12),ar2=new THREE.ArrowHelper(new THREE.Vector3(toward?-1:1,0,0),b.position.clone(),.9,col,.22,.12);world.add(ar1,ar2);arrows=[ar1,ar2]}};$('#sep').oninput=draw;draw()};

builders.decay=()=>{clearWorld();setCamera(8);$('#simControls').innerHTML=control('Decay type','<select id="decayMode"><option value="alpha">alpha decay</option><option value="bm" selected>beta-minus decay</option><option value="bp">beta-plus decay</option></select>')+'<button class="button primary" id="runDecay">Run decay</button>';let parent,em1,em2,start;const run=()=>{clearWorld();const mode=$('#decayMode').value;parent=cluster(8,16,.12);world.add(parent);em1=em2=null;if(mode==='alpha'){em1=cluster(2,4,.18);em1.visible=false;world.add(em1);setReadout('α decay: A → A − 4, Z → Z − 2')}else{em1=sphere(.16,mode==='bm'?'#7ee8ff':'#ff9fcb');em2=sphere(.10,'#f3f7ff');em1.visible=em2.visible=false;world.add(em1,em2);setReadout(mode==='bm'?'β⁻: n → p + e⁻ + ν̄ₑ · A unchanged, Z + 1':'β⁺: p → n + e⁺ + νₑ · A unchanged, Z − 1')}start=performance.now();animator=()=>{const q=Math.min(1,(performance.now()-start)/2600);parent.rotation.y=q*2;if(q>.38){em1.visible=true;em1.position.set((q-.38)*7,1.1*(q-.38),0);if(em2){em2.visible=true;em2.position.set((q-.38)*6,-1.2*(q-.38),.4)}}}};$('#runDecay').onclick=run;$('#decayMode').onchange=run;run()};

builders.antimatter=()=>{clearWorld();setCamera(8);$('#simControls').innerHTML=control('Process','<select id="antiMode"><option value="ann">annihilation: e⁻ + e⁺ → γ + γ</option><option value="pair">pair production near a nucleus</option></select>')+'<button class="button primary" id="runAnti">Run animation</button>';let parts=[],start;const run=()=>{clearWorld();parts=[];const mode=$('#antiMode').value;if(mode==='ann'){const a=sphere(.28,'#7ee8ff'),b=sphere(.28,'#ff9fcb');a.position.x=-3.5;b.position.x=3.5;world.add(a,b);parts=[a,b];setReadout('e⁻ + e⁺ → γ + γ · minimum combined rest energy = 1.022 MeV')}else{const ph=sphere(.18,'#ffe88a'),nuc=cluster(6,12,.1);nuc.position.x=1.2;world.add(ph,nuc);ph.position.x=-4;parts=[ph,nuc];setReadout('γ + nucleus → e⁻ + e⁺ + nucleus · Eγ must be at least 1.022 MeV')}start=performance.now();animator=()=>{const q=((performance.now()-start)%3200)/3200,mode=$('#antiMode').value;if(mode==='ann'){if(q<.46&&parts.length===2){parts[0].position.x=-3.5+q*7.6;parts[1].position.x=3.5-q*7.6}else if(q>=.46&&parts.length===2){parts.forEach(x=>world.remove(x));const g1=sphere(.15,'#ffe88a'),g2=sphere(.15,'#ffe88a');world.add(g1,g2);parts=[g1,g2]}if(q>=.46&&parts.length===2){const k=(q-.46)*7;parts[0].position.x=-k;parts[1].position.x=k}}else{const ph=parts[0],nuc=parts[1];if(q<.5)ph.position.x=-4+q*10;else if(parts.length===2){world.remove(ph);const el=sphere(.25,'#7ee8ff'),pos=sphere(.25,'#ff9fcb');world.add(el,pos);parts=[el,pos,nuc]}if(q>=.5&&parts.length===3){const k=(q-.5)*5;parts[0].position.set(1.2+k,k*.45,0);parts[1].position.set(1.2+k,-k*.45,0)}}}};$('#runAnti').onclick=run;$('#antiMode').onchange=run;run()};

builders.interactions=()=>{clearWorld();setCamera(8);$('#simControls').innerHTML=control('Interaction','<select id="intMode"><option value="em">electromagnetic: like charges repel</option><option value="bm">beta-minus</option><option value="bp">beta-plus</option><option value="capture">electron capture</option><option value="ep">electron–proton collision</option></select>');let a,b,x,start;const build=()=>{clearWorld();const m=$('#intMode').value;a=sphere(.34,m==='em'?'#ff7777':'#72a9ff');b=sphere(.34,m==='em'?'#ff7777':'#7ee8ff');x=sphere(.16,m==='em'?'#ffe88a':'#b895ff');world.add(a,b,x);a.position.x=-3;b.position.x=3;start=performance.now();const equations={em:'electromagnetic interaction → virtual photon exchange',bm:'d → u + W⁻, then W⁻ → e⁻ + ν̄ₑ',bp:'u → d + W⁺, then W⁺ → e⁺ + νₑ',capture:'p + e⁻ → n + νₑ',ep:'e⁻ + p → n + νₑ'};setReadout(equations[m]);animator=()=>{const q=((performance.now()-start)%2200)/2200;x.position.x=-2+4*q;x.position.y=.45*Math.sin(q*Math.PI*2);a.rotation.y=q*4;b.rotation.y=-q*4}};$('#intMode').onchange=build;build()};

builders.classification=()=>{clearWorld();setCamera(9);$('#simControls').innerHTML=control('Highlight family','<select id="fam"><option value="all">all particles</option><option value="hadron">hadrons</option><option value="baryon">baryons</option><option value="meson">mesons</option><option value="lepton">leptons</option></select>');const objs=[];const labels=[['p','baryon hadron',-3,1.5,'#ff7777'],['n','baryon hadron',-2,0,'#72a9ff'],['π','meson hadron',0,1.5,'#ffc85f'],['K','meson hadron',1,0,'#b895ff'],['e','lepton',2.7,1.5,'#7ee8ff'],['μ','lepton',3.4,0,'#67d3a1'],['ν','lepton',2.8,-1.5,'#f3f7ff']];labels.forEach(([name,fam,x,y,col])=>{const m=sphere(.48,col);m.position.set(x,y,0);m.userData={name,fam};world.add(m);objs.push(m)});const update=()=>{const f=$('#fam').value;objs.forEach(o=>{o.material.opacity=f==='all'||o.userData.fam.includes(f)?1:.12;o.material.transparent=o.material.opacity<1});setReadout(f==='all'?'Hadrons → baryons + mesons. Leptons form a separate family.':`Highlighted: ${f}`)};$('#fam').onchange=update;update();animator=t=>world.rotation.y=Math.sin(t*.4)*.18};

builders.quarks=()=>{clearWorld();setCamera(7);$('#simControls').innerHTML=control('Build a hadron','<select id="had"><option value="p">proton p = uud</option><option value="n">neutron n = udd</option><option value="pip">π⁺ = u d̄</option><option value="pim">π⁻ = d ū</option><option value="kp">K⁺ = u s̄</option><option value="km">K⁻ = s ū</option></select>');const data={p:['u','u','d'],n:['u','d','d'],pip:['u','d̄'],pim:['d','ū'],kp:['u','s̄'],km:['s','ū']},charge={u:2/3,d:-1/3,s:-1/3,'ū':-2/3,'d̄':1/3,'s̄':1/3},strange={u:0,d:0,s:-1,'ū':0,'d̄':0,'s̄':1};const col=q=>q.includes('u')?'#ffc85f':q.includes('s')?'#b895ff':'#67d3a1';const build=()=>{clearWorld();const qs=data[$('#had').value],g=new THREE.Group(),pos=qs.length===3?[[-1,0,0],[.7,.8,0],[.7,-.8,0]]:[[-.85,0,0],[.85,0,0]];qs.forEach((q,i)=>{const m=sphere(.5,col(q));m.position.set(...pos[i]);g.add(m)});for(let i=0;i<pos.length;i++)for(let j=i+1;j<pos.length;j++)g.add(line3([new THREE.Vector3(...pos[i]),new THREE.Vector3(...pos[j])],0x6cc7ff));world.add(g);const Q=qs.reduce((s,q)=>s+charge[q],0),B=qs.reduce((s,q)=>s+(q.includes('̄')?-1/3:1/3),0),S=qs.reduce((s,q)=>s+strange[q],0);setReadout(`${qs.join(' + ')} · charge = ${Math.round(Q*3)}/3 e = ${Q.toFixed(2)}e · B = ${B.toFixed(0)} · S = ${S}`);animator=t=>{g.rotation.y=t*.25;g.rotation.x=Math.sin(t*.3)*.15}};$('#had').onchange=build;build()};

builders.photo=()=>{clearWorld();setCamera(8);$('#simControls').innerHTML=control('Photon frequency','<input id="pf" type="range" min="2" max="15" step=".1" value="8"><div id="pfR" class="field-readout"></div>')+control('Light intensity','<input id="pi" type="range" min="1" max="8" value="4"><div id="piR" class="field-readout"></div>')+control('Work function φ','<input id="pphi" type="range" min="1" max="5" step=".1" value="2.3"><div id="pphiR" class="field-readout"></div>');const plate=new THREE.Mesh(new THREE.BoxGeometry(.32,5.2,5.2),new THREE.MeshStandardMaterial({color:0x7890a8,metalness:.65,roughness:.25}));plate.position.x=1.2;world.add(plate);let photons=[],electrons=[],start=performance.now();const update=()=>{photons.forEach(o=>world.remove(o));electrons.forEach(o=>world.remove(o));photons=[];electrons=[];const f=+$('#pf').value*1e14,intensity=+$('#pi').value,phi=+$('#pphi').value,Eph=H*f/ECHARGE,ke=Math.max(0,Eph-phi);$('#pfR').textContent=`${(f/1e14).toFixed(1)} × 10¹⁴ Hz`;$('#piR').textContent=`${intensity} relative units`;$('#pphiR').textContent=`${phi.toFixed(1)} eV`;for(let i=0;i<intensity;i++){const p=sphere(.11,'#ffe88a');world.add(p);photons.push(p);if(ke>0){const el=sphere(.12,'#7ee8ff');world.add(el);electrons.push(el)}}setReadout(ke>0?`hf = ${Eph.toFixed(2)} eV · KEmax = ${ke.toFixed(2)} eV · Vₛ = ${ke.toFixed(2)} V`:`hf = ${Eph.toFixed(2)} eV < φ = ${phi.toFixed(2)} eV → no emission`);start=performance.now();animator=()=>{const q=((performance.now()-start)%2200)/2200;photons.forEach((p,i)=>p.position.set(-4+q*5.2,-1.6+i*(3.2/Math.max(1,intensity-1)),(i%2)*.35));electrons.forEach((el,i)=>{el.visible=q>.78;el.position.set(1.3+(q-.78)*8,-1.6+i*(3.2/Math.max(1,electrons.length-1)),(i%2)*.4)})}};['pf','pi','pphi'].forEach(id=>$('#'+id).oninput=update);update()};

builders.collisions=()=>{clearWorld();setCamera(8);$('#simControls').innerHTML=control('Incident electron energy','<input id="ce" type="range" min="1" max="20" step=".1" value="11"><div id="ceR" class="field-readout"></div>')+control('Model threshold set','<select id="ct"><option value="10.2,13.6">hydrogen example: excitation 10.2 eV, ionisation 13.6 eV</option><option value="4,8">simplified fluorescent-tube teaching example: 4 eV, 8 eV</option></select>');let atom,electron,start;const update=()=>{clearWorld();const E=+$('#ce').value,[ex,ion]=$('#ct').value.split(',').map(Number);atom=sphere(.7,'#72a9ff',.5);electron=sphere(.15,'#7ee8ff');electron.position.x=-4;world.add(atom,electron);let outcome=E>=ion?'ionisation':E>=ex?'excitation':'no allowed transition';$('#ceR').textContent=`${E.toFixed(1)} eV → ${outcome}`;setReadout(E>=ion?`incident energy ${E.toFixed(1)} eV ≥ ionisation threshold ${ion} eV → electron can be removed`:E>=ex?`incident energy ${E.toFixed(1)} eV ≥ excitation threshold ${ex} eV → atom can be excited`:`${E.toFixed(1)} eV is below the first model threshold ${ex} eV → no excitation in this model`);start=performance.now();animator=()=>{const q=((performance.now()-start)%2600)/2600;electron.position.x=-4+q*6;if(outcome==='excitation'&&q>.65)atom.scale.setScalar(1+.18*Math.sin((q-.65)*10));if(outcome==='ionisation'&&q>.65){atom.material.opacity=.25;electron.position.y=(q-.65)*3}}};['ce','ct'].forEach(id=>$('#'+id).oninput=update);$('#ct').onchange=update;update()};

builders.levels=()=>{clearWorld();setCamera(8);$('#simControls').innerHTML=control('Hydrogen transition','<select id="tr"><option value="3,2">n=3 → n=2</option><option value="4,2">n=4 → n=2</option><option value="2,1">n=2 → n=1</option><option value="3,1">n=3 → n=1</option><option value="4,1">n=4 → n=1</option></select>');let marker,photon,start,yi,yf;const build=()=>{clearWorld();for(let n=1;n<=4;n++){const y=-2+(n-1)*1.25;const disc=new THREE.Mesh(new THREE.CylinderGeometry(2.5,2.5,.025,64),new THREE.MeshBasicMaterial({color:0x6b87a8,transparent:true,opacity:.28}));disc.position.y=y;world.add(disc)}const [ni,nf]=$('#tr').value.split(',').map(Number);yi=-2+(ni-1)*1.25;yf=-2+(nf-1)*1.25;marker=sphere(.2,'#7ee8ff');marker.position.y=yi;photon=sphere(.13,'#ffe88a');photon.visible=false;world.add(marker,photon);const Ei=-13.6/(ni*ni),Ef=-13.6/(nf*nf),d=Math.abs(Ef-Ei),lam=H*C/(d*ECHARGE)*1e9;setReadout(`ΔE = ${d.toFixed(3)} eV · photon wavelength = ${lam.toFixed(1)} nm`);start=performance.now();animator=()=>{const q=((performance.now()-start)%3000)/3000;if(q<.5){marker.position.y=yi+(yf-yi)*q/.5;photon.visible=false}else{marker.position.y=yf;photon.visible=true;photon.position.set((q-.5)*8,(yi+yf)/2+.2,0)}}};$('#tr').onchange=build;build()};

builders.diffraction=()=>{clearWorld();setCamera(9);$('#simControls').innerHTML=control('Electron accelerating voltage','<input id="dv" type="range" min="50" max="5000" step="50" value="200"><div id="dvR" class="field-readout"></div>');let electron,screen,rings=[],start;const build=()=>{clearWorld();const V=+$('#dv').value,p=Math.sqrt(2*ME*ECHARGE*V),lam=H/p;$('#dvR').textContent=`${V} V`;screen=new THREE.Mesh(new THREE.CircleGeometry(2.8,64),new THREE.MeshBasicMaterial({color:0x17324b,transparent:true,opacity:.65,side:THREE.DoubleSide}));screen.rotation.y=Math.PI/2;screen.position.x=3.2;world.add(screen);const ringScale=Math.max(.35,2.1/Math.sqrt(V/50));for(let i=1;i<=4;i++){const tor=new THREE.Mesh(new THREE.TorusGeometry(i*ringScale,.035,10,64),new THREE.MeshBasicMaterial({color:0x85d9ff}));tor.rotation.y=Math.PI/2;tor.position.x=3.15;world.add(tor);rings.push(tor)}electron=sphere(.16,'#7ee8ff');world.add(electron);setReadout(`p = ${p.toExponential(3)} kg m s⁻¹ · λ = ${(lam*1e10).toFixed(3)} Å · higher V → higher p → smaller λ`);start=performance.now();animator=()=>{const q=((performance.now()-start)%2200)/2200;electron.position.x=-4+q*7.2;electron.position.y=.08*Math.sin(q*35)}};$('#dv').oninput=build;build()};

function trajectory(b,Z){let p=new THREE.Vector3(-6,b,0),v=new THREE.Vector3(.105,0,0),pts=[];for(let i=0;i<260;i++){pts.push(p.clone());const r=Math.max(.28,p.length()),a=p.clone().normalize().multiplyScalar(.000065*Z/(r*r));v.add(a);p.add(v);if(p.x>6||Math.abs(p.y)>6)break}return pts}
builders.rutherford=()=>{clearWorld();setCamera(10);$('#simControls').innerHTML=control('Impact parameter','<input id="rb" type="range" min="15" max="190" value="70"><div id="rbR" class="field-readout"></div>')+control('Nuclear charge Z','<input id="rz" type="range" min="10" max="90" value="79"><div id="rzR" class="field-readout"></div>');const nucleus=cluster(79,197,.07);world.add(nucleus);let paths=[];const draw=()=>{paths.forEach(p=>world.remove(p));paths=[];const b=+$('#rb').value/100,Z=+$('#rz').value;$('#rbR').textContent=`b = ${b.toFixed(2)} scaled units`;$('#rzR').textContent=`Z = ${Z}${Z===79?' (gold)':''}`;[-1.5,-1.0,-.65,.65,1.0,1.5].forEach(v=>{const l=line3(trajectory(v,Z),0x57718d);world.add(l);paths.push(l)});const h=line3(trajectory(b,Z),0x67c7ff);world.add(h);paths.push(h);setReadout('Smaller impact parameter and larger nuclear charge give stronger electrostatic deflection.');animator=t=>nucleus.rotation.y=t*.1};['rb','rz'].forEach(id=>$('#'+id).oninput=draw);draw()};

function initThree(T){THREE=T;const canvas=$('#sceneCanvas');renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x07111f,.018);camera=new THREE.PerspectiveCamera(42,1,.1,100);world=new THREE.Group();scene.add(world);raycaster=new THREE.Raycaster();pointer=new THREE.Vector2();scene.add(new THREE.HemisphereLight(0xeef8ff,0x22344d,1.75));const dl=new THREE.DirectionalLight(0xffffff,2.35);dl.position.set(5,8,7);dl.castShadow=true;scene.add(dl);const rim=new THREE.PointLight(0x67c7ff,18,18,2);rim.position.set(-5,2,4);scene.add(rim);const warm=new THREE.PointLight(0xffc86b,9,14,2);warm.position.set(4,-3,2);scene.add(warm);const resize=()=>{const r=canvas.parentElement.getBoundingClientRect();renderer.setSize(Math.max(10,r.width),Math.max(10,r.height),false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(canvas.parentElement);resize();ensureInteractionPanel();canvas.onpointerdown=e=>{drag=true;pointerMoved=false;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(!drag)return;const dx=e.clientX-lastX,dy=e.clientY-lastY;if(Math.abs(dx)+Math.abs(dy)>3)pointerMoved=true;world.rotation.y+=dx*.008;world.rotation.x=Math.max(-1.2,Math.min(1.2,world.rotation.x+dy*.006));lastX=e.clientX;lastY=e.clientY};canvas.onpointerup=e=>{
 drag=false;
 if(pointerMoved||!raycaster||!pointer||!camera||!world)return;
 if(hotspotsVisible&&selectHotspotAt(e))return;
 const rect=canvas.getBoundingClientRect();
 pointer.x=((e.clientX-rect.left)/rect.width)*2-1;
 pointer.y=-((e.clientY-rect.top)/rect.height)*2+1;
 raycaster.setFromCamera(pointer,camera);
 const hits=raycaster.intersectObjects(world.children,true).filter(h=>{
   let n=h.object;
   while(n&&n!==world){if(n.name==='simulation-stage')return false;n=n.parent}
   return !!h.object.geometry;
 });
 const hit=hits[0];
 if(!hit)return;
 const mat=Array.isArray(hit.object.material)?hit.object.material[0]:hit.object.material;
 const colour=mat?.color?.getHexString?.()||'';
 window.dispatchEvent(new CustomEvent('particlelab:model-click',{detail:{
   sim:currentSim,
   colour:'#'+colour,
   objectType:hit.object.type||'Object',
   position:{x:hit.point.x,y:hit.point.y,z:hit.point.z}
 }}));
};canvas.addEventListener('wheel',e=>{e.preventDefault();camera.position.z=Math.max(4,Math.min(16,camera.position.z+e.deltaY*.01))},{passive:false});$('#rotateLeft').onclick=()=>world.rotation.y-=.3;$('#rotateRight').onclick=()=>world.rotation.y+=.3;$('#resetView').onclick=()=>setCamera(currentSim==='rutherford'?10:8);$('#pauseMotion').onclick=()=>{paused=!paused;$('#pauseMotion').textContent=paused?'Resume motion':'Pause motion'};document.addEventListener('input',e=>{if(e.target.closest?.('#simControls')){processClock=performance.now();setTimeout(updateLivePanel,0)}});document.addEventListener('change',e=>{if(e.target.closest?.('#simControls')){processClock=performance.now();setTimeout(updateLivePanel,0)}});document.addEventListener('click',e=>{if(e.target.closest?.('#simControls button')){processClock=performance.now();setTimeout(updateLivePanel,0)}});threeReady=true;$('#renderStatus').textContent='Interactive 3D model ready · use controls and Model guide';setTimeout(()=>$('#renderStatus').style.opacity=.35,1900);const loop=()=>{requestAnimationFrame(loop);const now=performance.now(),t=(now-clockStart)/1000;if(!paused)animator(t);animateHotspots(t);if(now-lastLiveUpdate>180){lastLiveUpdate=now;updateLivePanel()}renderer.render(scene,camera)};loop();activateSim(currentSim)}
window.PARTICLELAB_CORE={
 getCurrentSim:()=>currentSim,
 activateSim,
 is3DReady:()=>threeReady,
 setInspectMode:on=>{hotspotsVisible=!!on;if(hotspotGroup)hotspotGroup.visible=hotspotsVisible;const b=$('#toggleHotspots');if(b){b.textContent=hotspotsVisible?'Hide 3D labels':'Inspect 3D';b.classList.toggle('primary',hotspotsVisible);b.setAttribute('aria-pressed',String(hotspotsVisible))}return hotspotsVisible},
 getInspectMode:()=>hotspotsVisible,
 getControlState:()=>Object.fromEntries([...document.querySelectorAll('#simControls input,#simControls select')].map(el=>[el.id||el.name||el.type,el.value]))
};
activateSim(currentSim);
import('./vendor/three.module.min.js').then(T=>{window.PARTICLELAB_3D_READY=true;return initThree(T)}).catch(()=>{$('#renderStatus').textContent='3D engine unavailable on this network';$('#simReadout').textContent='The teaching notes, formulas, map, atlas and quiz still work. Try another network for the 3D models.'});
