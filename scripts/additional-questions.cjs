// Original Spark science scenarios; see docs/question-expansion.md for curriculum sources.
'use strict';
const scenarios=[
  {
    "id": "spark-gcse-biology-potato-osmosis",
    "level": "gcse",
    "subject": "biology",
    "topic": "b1",
    "lessonMatch": "osmosis",
    "context": "Potato cylinders in two sucrose solutions change mass by +8% and −6% after 30 minutes.",
    "application": {
      "question": "Explain why the cylinder with a −6% change loses mass.",
      "answer": [
        "Water moves out of its cells by osmosis.",
        "Water moves through partially permeable membranes from the more dilute cell contents to the more concentrated surrounding solution."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two controls needed to compare the solutions fairly.",
      "answer": [
        "Use cylinders with the same initial dimensions.",
        "Keep immersion time and temperature the same."
      ]
    },
    "choice": {
      "question": "Which result suggests the solution is less concentrated than the potato cell contents?",
      "options": [
        "+8% mass change",
        "−6% mass change",
        "Neither result",
        "Both results show water leaving"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-microscope-scale",
    "level": "gcse",
    "subject": "biology",
    "topic": "b1",
    "lessonMatch": "magnification",
    "context": "An image of a cell is 24 mm wide. The cell's actual width is 0.060 mm.",
    "application": {
      "question": "Calculate the magnification, showing your working.",
      "answer": [
        "Magnification = image size ÷ actual size.",
        "24 ÷ 0.060 = 400; magnification is ×400."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "A student divides 24 by 60 and reports ×0.4. Explain the mistake.",
      "answer": [
        "They have mixed millimetres and micrometres.",
        "Convert both lengths to the same unit before dividing."
      ]
    },
    "choice": {
      "question": "Which change improves resolution rather than simply making an image bigger?",
      "options": [
        "Use a microscope able to distinguish closer points",
        "Enlarge a blurred photograph",
        "Print the image on larger paper",
        "Move the image closer to your eyes"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-amylase-temperature",
    "level": "gcse",
    "subject": "biology",
    "topic": "b2",
    "lessonMatch": "enzyme",
    "context": "Amylase breaks down starch in 120 s at 20°C, 60 s at 35°C and not within 300 s at 70°C.",
    "application": {
      "question": "Explain the difference between the results at 35°C and 70°C.",
      "answer": [
        "At 70°C the enzyme can denature.",
        "The active site changes shape so starch no longer fits effectively.",
        "Fewer enzyme–substrate complexes form."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "How could the experiment detect when starch has disappeared?",
      "answer": [
        "Test samples at regular intervals with iodine solution.",
        "The endpoint is when iodine remains orange-brown rather than becoming blue-black."
      ]
    },
    "choice": {
      "question": "Using 1 ÷ time as a rate estimate, how does the rate at 35°C compare with that at 20°C?",
      "options": [
        "It is twice as large",
        "It is half as large",
        "It is unchanged",
        "It is four times as large"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-alveoli-smoking",
    "level": "gcse",
    "subject": "biology",
    "topic": "b2",
    "lessonMatch": "alveoli|gas exchange",
    "context": "Damage to alveoli reduces their total surface area while oxygen demand stays the same.",
    "application": {
      "question": "Explain why less oxygen may enter the blood each second.",
      "answer": [
        "There is less surface area available for diffusion.",
        "Fewer oxygen molecules cross into the blood per second for the same concentration gradient."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Why does this result alone not prove that every patient will have the same reduction in oxygen uptake?",
      "answer": [
        "The extent of damage can differ between patients.",
        "Other factors such as ventilation or blood flow can also differ."
      ]
    },
    "choice": {
      "question": "Which feature of healthy alveoli shortens the diffusion path?",
      "options": [
        "Thin walls",
        "A thick muscle layer",
        "A small surface area",
        "A waterproof covering"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-antibiotic-zones",
    "level": "gcse",
    "subject": "biology",
    "topic": "b3",
    "lessonMatch": "antibiotic",
    "context": "Two antibiotic discs produce inhibition zones with diameters of 12 mm and 18 mm against the same bacterial culture.",
    "application": {
      "question": "Explain what the larger clear zone indicates under these conditions.",
      "answer": [
        "Bacterial growth is inhibited farther from that disc.",
        "This is evidence of greater inhibition in this test, rather than proof it is the best treatment in every patient."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two controls when comparing the discs.",
      "answer": [
        "Use the same bacterial strain and inoculum density.",
        "Keep disc dose, agar conditions and incubation conditions comparable."
      ]
    },
    "choice": {
      "question": "Why do antibiotics not treat influenza directly?",
      "options": [
        "Influenza is caused by a virus",
        "All viruses are resistant bacteria",
        "Antibiotics only destroy fungi",
        "Influenza has no genetic material"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-pondweed-plateau",
    "level": "gcse",
    "subject": "biology",
    "topic": "b4",
    "lessonMatch": "photosynth",
    "context": "A pondweed's oxygen production rises as light intensity increases, then reaches a plateau.",
    "application": {
      "question": "Explain why further increases in light intensity do not increase the rate.",
      "answer": [
        "Light is no longer the limiting factor.",
        "Another factor, such as carbon dioxide concentration or temperature, limits the rate."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain why collecting oxygen volume is usually better than counting bubbles.",
      "answer": [
        "Bubbles can have different volumes.",
        "Measuring collected gas volume gives a more direct measure of oxygen production."
      ]
    },
    "choice": {
      "question": "Which change could test whether carbon dioxide is limiting at the plateau?",
      "options": [
        "Increase carbon dioxide while holding other conditions constant",
        "Reduce every variable at once",
        "Change the pondweed species only",
        "Stop measuring oxygen"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-sprint-recovery",
    "level": "gcse",
    "subject": "biology",
    "topic": "b4",
    "lessonMatch": "anaerobic",
    "context": "A runner continues breathing rapidly after a short sprint.",
    "application": {
      "question": "Explain why oxygen is needed during recovery.",
      "answer": [
        "Some energy was supplied by anaerobic respiration during the sprint.",
        "Extra oxygen is needed to react with the accumulated lactic acid and help restore normal conditions."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "A student says rapid breathing proves muscles produced no carbon dioxide during the sprint. Explain why this conclusion is unsupported.",
      "answer": [
        "Aerobic respiration can occur alongside anaerobic respiration.",
        "Breathing rate alone does not measure the amount of carbon dioxide produced."
      ]
    },
    "choice": {
      "question": "Which product is associated with anaerobic respiration in human muscle?",
      "options": [
        "Lactic acid",
        "Ethanol",
        "Starch",
        "Chlorophyll"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-meal-glucose",
    "level": "gcse",
    "subject": "biology",
    "topic": "b5",
    "lessonMatch": "glucose|insulin",
    "context": "Blood glucose concentration rises after a carbohydrate-rich meal, then returns towards its usual level.",
    "application": {
      "question": "Explain how insulin helps bring the concentration down.",
      "answer": [
        "The pancreas releases insulin.",
        "Insulin promotes glucose uptake by cells.",
        "It promotes conversion of glucose to glycogen in liver and muscle cells."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Why is taking just one glucose reading immediately after eating a weak test of glucose regulation?",
      "answer": [
        "It does not show how the concentration changes over time.",
        "Repeated readings are needed to see whether the concentration returns towards its usual level."
      ]
    },
    "choice": {
      "question": "Which organ releases insulin?",
      "options": [
        "Pancreas",
        "Stomach",
        "Lung",
        "Bladder"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-recessive-cross",
    "level": "gcse",
    "subject": "biology",
    "topic": "b6",
    "lessonMatch": "inherit|genetic",
    "context": "In a simplified single-gene model, two parents have genotype Aa. The recessive phenotype occurs only in aa individuals.",
    "application": {
      "question": "Use the possible offspring genotypes to calculate the probability of the recessive phenotype.",
      "answer": [
        "Possible combinations are AA, Aa, Aa and aa.",
        "One of four combinations is aa: probability 1/4 or 25%."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why four offspring would not necessarily include exactly one with the recessive phenotype.",
      "answer": [
        "Fertilisation is random.",
        "The 25% value is a probability, not a guarantee for a small family."
      ]
    },
    "choice": {
      "question": "Which genotype is homozygous recessive?",
      "options": [
        "aa",
        "Aa",
        "AA",
        "A"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-biology-meadow-sampling",
    "level": "gcse",
    "subject": "biology",
    "topic": "b7",
    "lessonMatch": "quadrat|sampling",
    "context": "A class estimates daisy abundance using five quadrats placed beside a path.",
    "application": {
      "question": "Explain why the estimate may be biased.",
      "answer": [
        "The quadrats do not sample the whole meadow randomly.",
        "Conditions near the path may differ from those elsewhere."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Describe how to improve the sampling method.",
      "answer": [
        "Use randomly generated coordinates across the study area.",
        "Use more quadrats and calculate a mean before scaling to the whole area."
      ]
    },
    "choice": {
      "question": "What is the main benefit of increasing the number of randomly placed quadrats?",
      "options": [
        "A more representative estimate",
        "A guarantee of counting every daisy",
        "Removal of all systematic errors",
        "A change in the meadow's actual population"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-chlorine-isotopes",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c1",
    "lessonMatch": "isotop",
    "context": "A chlorine sample contains 75% chlorine-35 and 25% chlorine-37.",
    "application": {
      "question": "Calculate the relative atomic mass of this sample.",
      "answer": [
        "Use a weighted mean: (75 × 35 + 25 × 37) ÷ 100.",
        "The relative atomic mass is 35.5."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why the two isotopes have the same chemical properties.",
      "answer": [
        "They have the same number of electrons.",
        "They have the same electronic structure, including outer-shell electrons."
      ]
    },
    "choice": {
      "question": "What differs between chlorine-35 and chlorine-37?",
      "options": [
        "Number of neutrons",
        "Number of protons",
        "Number of outer-shell electrons",
        "Position in the periodic table"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-salt-conductivity",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c2",
    "lessonMatch": "ionic",
    "context": "Solid sodium chloride does not conduct electricity, but molten sodium chloride does.",
    "application": {
      "question": "Explain the difference in electrical conductivity.",
      "answer": [
        "In the solid the ions are held in fixed positions.",
        "In the molten material the ions can move.",
        "Moving charged ions carry the current."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "A student attributes the current in molten salt to free electrons. Correct this explanation.",
      "answer": [
        "The mobile charge carriers in molten sodium chloride are ions.",
        "Delocalised electrons explain conduction in metals, not this molten ionic compound."
      ]
    },
    "choice": {
      "question": "Which substance would also conduct by mobile ions?",
      "options": [
        "Sodium chloride solution",
        "Solid sodium chloride",
        "Solid sulfur",
        "Pure solid diamond"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-dilute-salt",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c3",
    "lessonMatch": "concentration",
    "context": "A student dissolves 6.0 g of salt to make 0.200 dm³ of solution.",
    "application": {
      "question": "Calculate the concentration in g/dm³.",
      "answer": [
        "Concentration = mass ÷ solution volume.",
        "6.0 ÷ 0.200 = 30 g/dm³."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Describe how to make the solution volume accurately rather than simply adding 200 cm³ of water.",
      "answer": [
        "Dissolve the solid in a smaller amount of water first.",
        "Make the total solution volume up to the calibration mark in suitable volumetric apparatus."
      ]
    },
    "choice": {
      "question": "The same 6.0 g is diluted to 0.400 dm³. What is the new concentration?",
      "options": [
        "15 g/dm³",
        "30 g/dm³",
        "60 g/dm³",
        "2.4 g/dm³"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-copper-salt",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c4",
    "lessonMatch": "salt|neutral",
    "context": "A student prepares copper sulfate crystals from dilute sulfuric acid and insoluble copper oxide.",
    "application": {
      "question": "Explain why copper oxide is added until some remains unreacted.",
      "answer": [
        "This ensures the acid has reacted completely.",
        "Excess insoluble copper oxide can then be removed by filtration."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Describe how crystals are obtained after filtration.",
      "answer": [
        "Gently evaporate some water to concentrate the solution.",
        "Allow it to cool so crystals form.",
        "Separate and dry the crystals."
      ]
    },
    "choice": {
      "question": "Which technique removes excess copper oxide?",
      "options": [
        "Filtration",
        "Chromatography",
        "Fractional distillation",
        "Electrolysis"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-insulated-cup",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c5",
    "lessonMatch": "exother|energy",
    "context": "Mixing two solutions in a cup causes the temperature to increase.",
    "application": {
      "question": "Explain what this shows about energy transfer in the reaction.",
      "answer": [
        "The reaction is exothermic.",
        "Energy is transferred from the reacting system to the surroundings."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two improvements that reduce energy loss when measuring the temperature change.",
      "answer": [
        "Use an insulated cup.",
        "Fit a lid while allowing the thermometer or probe to measure the solution."
      ]
    },
    "choice": {
      "question": "Which statement about bond changes is correct?",
      "options": [
        "Breaking bonds takes in energy; forming bonds releases energy",
        "Breaking and forming bonds both release energy",
        "Breaking bonds releases energy; forming bonds takes it in",
        "No bonds change in an exothermic reaction"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-marble-chips",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c6",
    "lessonMatch": "rate|collision",
    "context": "Equal masses of large and small marble chips react separately with the same excess acid. Small chips produce gas faster initially.",
    "application": {
      "question": "Explain the faster initial rate with small chips.",
      "answer": [
        "Small chips have a greater total surface area.",
        "More reacting particles are exposed to acid.",
        "Successful collisions occur more frequently."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain why the final gas volumes should be similar if both reactions finish.",
      "answer": [
        "The same mass of marble provides the same amount of limiting reactant.",
        "Acid is in excess in both experiments, so the same amount of gas can be formed."
      ]
    },
    "choice": {
      "question": "Which graph feature represents the initial reaction rate?",
      "options": [
        "The gradient at the start",
        "The final gas volume only",
        "The time-axis label",
        "The width of the graph paper"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-crude-oil-column",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c7",
    "lessonMatch": "fractional|crude",
    "context": "A fractionating column is hot near its base and cooler at the top.",
    "application": {
      "question": "Explain why different fractions are collected at different heights.",
      "answer": [
        "Hydrocarbons have different boiling points.",
        "Vapours condense when they reach a region below their boiling point.",
        "Higher-boiling fractions condense lower down the column."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why a fraction is not usually a single pure compound.",
      "answer": [
        "Each fraction contains a range of hydrocarbons.",
        "They have similar boiling points rather than all having the same molecular formula."
      ]
    },
    "choice": {
      "question": "Which fraction generally contains the smallest molecules?",
      "options": [
        "A fraction collected near the top",
        "A fraction collected near the bottom",
        "Every fraction has the same molecule size",
        "Only the residue"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-ink-chromatogram",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c8",
    "lessonMatch": "chromat",
    "context": "An ink separates into three spots. One spot travels 4.0 cm while the solvent front travels 8.0 cm.",
    "application": {
      "question": "Calculate the Rf value for that spot.",
      "answer": [
        "Rf = distance travelled by spot ÷ distance travelled by solvent front.",
        "4.0 ÷ 8.0 = 0.50; Rf has no unit."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain why the ink start line must be above the solvent level.",
      "answer": [
        "Otherwise the ink can dissolve into the solvent reservoir.",
        "It may wash off the paper instead of moving up with the solvent."
      ]
    },
    "choice": {
      "question": "What does the separation into three spots suggest?",
      "options": [
        "The ink contains at least three components under these conditions",
        "The ink is certainly a pure substance",
        "The solvent contains no molecules",
        "All components have identical affinities"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-atmospheric-gases",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c9",
    "lessonMatch": "greenhouse",
    "context": "A student says that carbon dioxide warms Earth mainly by absorbing visible sunlight before it reaches the surface.",
    "application": {
      "question": "Correct the student's explanation of the greenhouse effect.",
      "answer": [
        "Earth's surface emits infrared radiation.",
        "Greenhouse gases absorb outgoing infrared radiation.",
        "They emit radiation in different directions, affecting energy transfer to space."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Why does a correlation between temperature and carbon dioxide alone not identify every cause of a temperature change?",
      "answer": [
        "Other factors can also affect temperature.",
        "A correlation alone does not isolate or control those factors."
      ]
    },
    "choice": {
      "question": "Which type of radiation is central to greenhouse-gas absorption?",
      "options": [
        "Infrared",
        "Gamma",
        "Radio only",
        "Visible light only"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-chemistry-water-treatment",
    "level": "gcse",
    "subject": "chemistry",
    "topic": "c10",
    "lessonMatch": "water",
    "context": "A reservoir supplies water containing suspended solids and microorganisms.",
    "application": {
      "question": "Explain the purposes of filtration and sterilisation when producing potable water.",
      "answer": [
        "Filtration removes suspended solids.",
        "Sterilisation kills microorganisms that may cause disease."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Why would evaporation to dryness alone not be a suitable way to test whether the original water is safe to drink?",
      "answer": [
        "It can indicate dissolved solids but does not identify all contaminants.",
        "It does not establish whether harmful microorganisms were present."
      ]
    },
    "choice": {
      "question": "Which description of potable water is correct?",
      "options": [
        "Water safe to drink, even if it contains dissolved substances",
        "Chemically pure H₂O only",
        "Water with all dissolved salts removed",
        "Any colourless liquid"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-motor-efficiency",
    "level": "gcse",
    "subject": "physics",
    "topic": "p1",
    "lessonMatch": "efficiency",
    "context": "A motor transfers 800 J electrically and does 200 J of useful lifting work.",
    "application": {
      "question": "Calculate the motor's efficiency.",
      "answer": [
        "Efficiency = useful energy output ÷ total energy input.",
        "200 ÷ 800 = 0.25, or 25%."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Account for the remaining energy without saying it has disappeared.",
      "answer": [
        "600 J is transferred in less useful ways, such as heating the motor and surroundings.",
        "Total energy is conserved."
      ]
    },
    "choice": {
      "question": "Which change would increase efficiency for the same useful output?",
      "options": [
        "Reduce wasted energy transfers",
        "Increase friction in the bearings",
        "Increase total input without changing useful output",
        "Remove useful lifting work"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-cooling-cups",
    "level": "gcse",
    "subject": "physics",
    "topic": "p1",
    "lessonMatch": "insulation|thermal",
    "context": "Identical cups contain equal masses of water at the same starting temperature. One cup has an insulating jacket.",
    "application": {
      "question": "Explain why the jacket can reduce the rate of cooling.",
      "answer": [
        "Insulation reduces energy transfer from the hot water to the surroundings.",
        "It can reduce conduction and air movement around the cup, depending on its structure."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two controls needed to compare the cooling curves.",
      "answer": [
        "Use the same water mass and initial temperature.",
        "Keep cup shape and surrounding conditions the same."
      ]
    },
    "choice": {
      "question": "Which measurement best compares the cooling over five minutes?",
      "options": [
        "Temperature decrease over the same time interval",
        "Cup colour alone",
        "The starting temperature only",
        "The mass of the thermometer"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-series-lamps",
    "level": "gcse",
    "subject": "physics",
    "topic": "p2",
    "lessonMatch": "series",
    "context": "Two identical lamps are connected in series to a battery.",
    "application": {
      "question": "Explain why the current is the same through both lamps.",
      "answer": [
        "There is one continuous path for charge.",
        "Charge does not build up at either lamp in a steady circuit."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Describe how to measure the potential difference across one lamp.",
      "answer": [
        "Connect a voltmeter in parallel with that lamp.",
        "Use a suitable range and connect its terminals with the correct polarity."
      ]
    },
    "choice": {
      "question": "If one lamp is removed and the circuit is left open, what happens to the other?",
      "options": [
        "It goes out",
        "It becomes twice as bright",
        "It receives infinite current",
        "Its resistance becomes zero"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-resistor-results",
    "level": "gcse",
    "subject": "physics",
    "topic": "p2",
    "lessonMatch": "resistan|ohm",
    "context": "A component has current 0.20 A at 2.0 V and 0.40 A at 4.0 V.",
    "application": {
      "question": "Calculate its resistance at both readings and state what the data suggest.",
      "answer": [
        "R = V ÷ I gives 10 Ω for each reading.",
        "The two results are consistent with constant resistance over this range."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why two readings do not prove resistance is constant at every temperature.",
      "answer": [
        "Only two operating conditions were tested.",
        "Resistance can change if the component's temperature changes."
      ]
    },
    "choice": {
      "question": "Which graph pattern represents an ohmic conductor at constant temperature?",
      "options": [
        "A straight I–V line through the origin",
        "A horizontal voltage line for all currents",
        "A curved line that never reaches the origin",
        "Any line with a nonzero intercept"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-melting-ice",
    "level": "gcse",
    "subject": "physics",
    "topic": "p3",
    "lessonMatch": "latent|state",
    "context": "Ice is heated steadily. Its temperature stays at 0°C while it melts.",
    "application": {
      "question": "Explain why heating does not increase the temperature during melting.",
      "answer": [
        "Energy is transferred to overcome forces between particles.",
        "The internal potential energy increases.",
        "The average kinetic energy, and therefore temperature, does not increase during the phase change."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two reasons to stir and use a temperature probe properly when measuring a heating curve.",
      "answer": [
        "Stirring reduces temperature differences within the sample.",
        "Keep the probe in the sample without touching the heater or container base."
      ]
    },
    "choice": {
      "question": "What is the name for energy per kilogram needed for melting?",
      "options": [
        "Specific latent heat of fusion",
        "Specific heat capacity",
        "Density",
        "Specific latent heat of vaporisation"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-background-count",
    "level": "gcse",
    "subject": "physics",
    "topic": "p4",
    "lessonMatch": "half-life",
    "context": "A source gives 180 counts/min above background. After one half-life its count rate above background is measured again.",
    "application": {
      "question": "Predict the corrected count rate and explain the prediction.",
      "answer": [
        "After one half-life the expected activity is half its initial value.",
        "The expected corrected count rate is 90 counts/min."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Describe how to correct a raw count rate for background.",
      "answer": [
        "Measure background without the source in comparable conditions.",
        "Subtract the background count rate from the raw source count rate."
      ]
    },
    "choice": {
      "question": "Why might a short actual measurement differ from 90 counts/min?",
      "options": [
        "Radioactive decay is random",
        "Half-life changes on every count",
        "The detector makes atoms decay",
        "Every atom decays at the same scheduled instant"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-wet-road",
    "level": "gcse",
    "subject": "physics",
    "topic": "p5",
    "lessonMatch": "stopping|braking",
    "context": "The same car brakes from the same speed on a dry road and on a wet road.",
    "application": {
      "question": "Explain why braking distance can increase on the wet road.",
      "answer": [
        "There can be less friction between the tyres and the road.",
        "A smaller braking force produces a smaller deceleration."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why this does not by itself show that the driver's thinking distance increased.",
      "answer": [
        "Thinking distance depends on speed and reaction time.",
        "The road surface can change braking distance without changing reaction time."
      ]
    },
    "choice": {
      "question": "Which factor directly increases thinking distance at fixed speed?",
      "options": [
        "Longer reaction time",
        "Greater tyre-road friction",
        "A larger braking force",
        "A shorter reaction time"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-velocity-area",
    "level": "gcse",
    "subject": "physics",
    "topic": "p5",
    "lessonMatch": "motion graph|velocity",
    "context": "A velocity–time graph is a straight line from 0 m/s at 0 s to 12 m/s at 4 s.",
    "application": {
      "question": "Calculate acceleration and distance travelled in the four seconds.",
      "answer": [
        "Acceleration = gradient = 12 ÷ 4 = 3 m/s².",
        "Distance = area under the graph = 1/2 × 4 × 12 = 24 m."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Correct the claim that the final velocity alone gives the distance travelled.",
      "answer": [
        "Velocity and distance have different units.",
        "Distance depends on velocity throughout the interval and is obtained from the graph's area."
      ]
    },
    "choice": {
      "question": "What does the gradient of a velocity–time graph represent?",
      "options": [
        "Acceleration",
        "Distance",
        "Force in every case",
        "Mass"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-glass-ray",
    "level": "gcse",
    "subject": "physics",
    "topic": "p6",
    "lessonMatch": "refraction",
    "context": "A light ray enters glass from air at an angle to the normal.",
    "application": {
      "question": "Describe and explain the direction change on entering the glass.",
      "answer": [
        "Light travels more slowly in glass than in air.",
        "The ray bends towards the normal."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two steps that improve a ray-tracing measurement.",
      "answer": [
        "Use a narrow ray and mark its path carefully.",
        "Draw a normal at the boundary and measure angles from that normal."
      ]
    },
    "choice": {
      "question": "Which quantity stays unchanged when the light enters glass?",
      "options": [
        "Frequency",
        "Speed",
        "Wavelength",
        "Angle to the normal in every case"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-lifting-electromagnet",
    "level": "gcse",
    "subject": "physics",
    "topic": "p7",
    "lessonMatch": "electromagnet|solenoid",
    "context": "A scrapyard electromagnet is used to lift steel.",
    "application": {
      "question": "Explain how the magnetic effect of its coil can be increased.",
      "answer": [
        "Increase the current through the coil.",
        "Use more turns or a suitable soft iron core to strengthen the field."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain one practical limitation of continually increasing current.",
      "answer": [
        "Electrical heating increases and can overheat the coil.",
        "The power supply and wires have safe operating limits."
      ]
    },
    "choice": {
      "question": "Why is an electromagnet useful for releasing the load?",
      "options": [
        "Its magnetic field can be reduced by switching off the current",
        "It permanently magnetises every object",
        "Its mass becomes zero when off",
        "It works only on plastic"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-competitive-inhibitor",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-molecules",
    "lessonMatch": "protein",
    "context": "An inhibitor resembles an enzyme's substrate. Its effect becomes smaller when substrate concentration is increased.",
    "application": {
      "question": "Explain why these results support competitive inhibition.",
      "answer": [
        "The inhibitor competes with substrate for the active site.",
        "More substrate increases the likelihood of substrate occupying the active site.",
        "The enzyme's active site is not permanently altered by this competition."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two controls for comparing rates with and without inhibitor.",
      "answer": [
        "Keep enzyme concentration and pH the same.",
        "Keep temperature constant and use the same method of measuring initial rate."
      ]
    },
    "choice": {
      "question": "Where does a competitive inhibitor bind?",
      "options": [
        "The active site",
        "Only to a ribosome",
        "Only to the product",
        "To every substrate molecule permanently"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-membrane-temperature",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-cells",
    "lessonMatch": "transport",
    "context": "Beetroot tissue releases more coloured pigment into water at high temperatures.",
    "application": {
      "question": "Explain how high temperature can increase pigment leakage.",
      "answer": [
        "Phospholipid membranes become disrupted.",
        "Membrane proteins can denature.",
        "Increased membrane permeability allows more pigment to leave cells."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Why should cut beetroot pieces be rinsed before testing?",
      "answer": [
        "Cutting damages cells and releases pigment.",
        "Rinsing removes this initial pigment so it does not distort the temperature comparison."
      ]
    },
    "choice": {
      "question": "Which measurement estimates pigment concentration in the surrounding water?",
      "options": [
        "Absorbance using a colorimeter",
        "Diameter of the test tube only",
        "Mass of the empty rack",
        "Length of the power cable"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-fish-countercurrent",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-exchange",
    "lessonMatch": "gas exchange",
    "context": "Water and blood flow in opposite directions across a fish's gill lamellae.",
    "application": {
      "question": "Explain how countercurrent flow supports oxygen uptake.",
      "answer": [
        "At each point along the lamella, water can have a higher oxygen concentration than adjacent blood.",
        "This maintains a diffusion gradient along the exchange surface.",
        "Oxygen can diffuse into blood over more of the lamella's length."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Predict why parallel flow would extract less oxygen under otherwise similar conditions.",
      "answer": [
        "Concentrations in water and blood approach equilibrium along the surface.",
        "The diffusion gradient is reduced over more of its length."
      ]
    },
    "choice": {
      "question": "What is the immediate mechanism moving oxygen across the gill exchange surface?",
      "options": [
        "Diffusion",
        "Active transport of every oxygen molecule",
        "Osmosis of oxygen",
        "Bulk flow through membrane channels only"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-potometer-humidity",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-exchange",
    "lessonMatch": "mass transport",
    "context": "A potometer air bubble moves more slowly when the surrounding air becomes more humid.",
    "application": {
      "question": "Explain the likely effect of humidity on transpiration.",
      "answer": [
        "Higher humidity reduces the water-vapour concentration gradient between the leaf and air.",
        "Water vapour diffuses out more slowly.",
        "Less water is drawn into the shoot to replace losses."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain why a potometer does not directly measure transpiration.",
      "answer": [
        "It measures water uptake by the shoot.",
        "Some absorbed water is used or retained rather than being lost through transpiration."
      ]
    },
    "choice": {
      "question": "Which condition is essential for a reliable potometer?",
      "options": [
        "An airtight apparatus",
        "A deliberate air leak at every joint",
        "A dry cut stem inserted in air",
        "No record of time"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-dna-mutation",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-genetic-info",
    "lessonMatch": "protein synthesis",
    "context": "A base substitution changes a codon, but the polypeptide's amino-acid sequence is unchanged.",
    "application": {
      "question": "Explain how the amino-acid sequence can remain unchanged.",
      "answer": [
        "The genetic code is degenerate.",
        "More than one codon can specify the same amino acid."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why a different base substitution could change enzyme function.",
      "answer": [
        "A changed codon may specify a different amino acid.",
        "This can alter bonding and protein folding.",
        "A changed active-site shape can affect substrate binding."
      ]
    },
    "choice": {
      "question": "Which molecule carries the coding sequence from DNA to a ribosome?",
      "options": [
        "mRNA",
        "ATP",
        "Triglyceride",
        "Cellulose"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-thylakoid-inhibitor",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-energy",
    "lessonMatch": "photosynth",
    "context": "A chemical prevents electron transfer through a chloroplast's thylakoid electron-transport chain.",
    "application": {
      "question": "Explain why production of ATP and reduced NADP can decrease.",
      "answer": [
        "Electron transfer contributes to the proton gradient used for ATP synthesis.",
        "Disrupting electron transfer reduces this gradient.",
        "Fewer electrons are available for the reduction of NADP."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain the resulting effect on carbon fixation products.",
      "answer": [
        "The Calvin cycle requires ATP and reduced NADP to reduce glycerate 3-phosphate to triose phosphate.",
        "A reduced supply limits this conversion and carbohydrate production."
      ]
    },
    "choice": {
      "question": "Where does the Calvin cycle occur?",
      "options": [
        "Stroma",
        "Thylakoid lumen",
        "Mitochondrial matrix",
        "Outer cell wall"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-respirometer-control",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-energy",
    "lessonMatch": "respiration",
    "context": "A respirometer contains germinating seeds and an absorbent that removes carbon dioxide.",
    "application": {
      "question": "Explain why a decrease in gas volume can estimate oxygen uptake.",
      "answer": [
        "Seeds consume oxygen during aerobic respiration.",
        "Produced carbon dioxide is absorbed.",
        "The remaining decrease in gas volume mainly reflects oxygen uptake."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Why include a control with the same volume of inert beads?",
      "answer": [
        "It detects gas-volume changes caused by temperature or pressure rather than respiration.",
        "Using a similar volume makes the control more comparable."
      ]
    },
    "choice": {
      "question": "Which condition should be held constant during a rate comparison?",
      "options": [
        "Temperature",
        "The seeds' oxygen uptake rate",
        "The result itself",
        "Every seed's final ATP yield"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-synapse-block",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-response",
    "lessonMatch": "nervous",
    "context": "A toxin prevents calcium ions entering a presynaptic neurone's terminal when an action potential arrives.",
    "application": {
      "question": "Explain why transmission across the synapse is reduced.",
      "answer": [
        "Calcium entry normally triggers synaptic vesicles to fuse with the presynaptic membrane.",
        "Less neurotransmitter is released by exocytosis.",
        "There is less stimulation of receptors on the postsynaptic membrane."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why blocking neurotransmitter breakdown would have a different effect.",
      "answer": [
        "Neurotransmitter would remain in the synaptic cleft for longer.",
        "Postsynaptic receptors could continue to be stimulated."
      ]
    },
    "choice": {
      "question": "Which process releases neurotransmitter from vesicles?",
      "options": [
        "Exocytosis",
        "DNA replication",
        "Osmosis",
        "Translation"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-mark-release",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-populations",
    "lessonMatch": "populations in ecosystems",
    "context": "Researchers capture and mark 40 animals. Later they capture 50 animals, of which 10 are marked.",
    "application": {
      "question": "Estimate population size using the mark–release–recapture method.",
      "answer": [
        "Estimated population = first sample × second sample ÷ marked recaptures.",
        "40 × 50 ÷ 10 = 200 animals."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two assumptions needed for this estimate.",
      "answer": [
        "Marks remain visible and do not affect survival or likelihood of recapture.",
        "Marked animals mix with the population and population size remains approximately stable between samples."
      ]
    },
    "choice": {
      "question": "If marked animals become harder to recapture, what is the likely bias?",
      "options": [
        "Population size is overestimated",
        "Population size is always underestimated",
        "There is no possible effect",
        "The estimate becomes exactly correct"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-biology-pcr-cycles",
    "level": "alevel",
    "subject": "biology",
    "topic": "bio-gene-expression",
    "lessonMatch": "gene technologies",
    "context": "A DNA sample undergoes ideal PCR amplification with one complete doubling per cycle.",
    "application": {
      "question": "Explain the purposes of heating and cooling during each PCR cycle.",
      "answer": [
        "Heating separates the DNA strands by breaking hydrogen bonds.",
        "Cooling allows primers to anneal.",
        "A suitable extension temperature allows DNA polymerase to extend the primers."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Starting with one double-stranded molecule, calculate the ideal number after five cycles and give one reason actual yield can be lower.",
      "answer": [
        "Ideal number = 2⁵ = 32 molecules.",
        "Actual amplification may be incomplete because reactants or enzyme activity become limiting."
      ]
    },
    "choice": {
      "question": "Why is a thermostable DNA polymerase used?",
      "options": [
        "It tolerates the repeated high-temperature stages",
        "It replaces the need for primers",
        "It permanently joins the two original strands",
        "It makes RNA instead of DNA"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-successive-ionisation",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-physical",
    "lessonMatch": "atomic structure",
    "context": "Successive ionisation energies show a large jump between removing the second and third electrons.",
    "application": {
      "question": "Explain what this suggests about the atom's outer electron arrangement.",
      "answer": [
        "The first two electrons are removed from the outer shell.",
        "The third electron is removed from an inner shell closer to the nucleus and less shielded.",
        "This suggests two outer-shell electrons."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why successive ionisation energies generally increase even before the large jump.",
      "answer": [
        "Electrons are removed from an increasingly positive ion.",
        "The remaining electrons experience stronger attraction to the nucleus."
      ]
    },
    "choice": {
      "question": "Which group is most consistent with two outer-shell electrons in a main-group metal?",
      "options": [
        "Group 2",
        "Group 1",
        "Group 7",
        "Group 0"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-titration-moles",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-physical",
    "lessonMatch": "amount of substance",
    "context": "25.0 cm³ of 0.100 mol/dm³ sodium hydroxide is exactly neutralised by 20.0 cm³ hydrochloric acid.",
    "application": {
      "question": "Calculate the hydrochloric acid concentration using the 1:1 reaction.",
      "answer": [
        "NaOH amount = 0.100 × 0.0250 = 0.00250 mol.",
        "The acid amount is also 0.00250 mol.",
        "Acid concentration = 0.00250 ÷ 0.0200 = 0.125 mol/dm³."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Why rinse the burette with the acid after rinsing with water?",
      "answer": [
        "Residual water would dilute the acid.",
        "Rinsing with the acid ensures the delivered solution has the intended concentration."
      ]
    },
    "choice": {
      "question": "Which volume conversion is correct?",
      "options": [
        "25.0 cm³ = 0.0250 dm³",
        "25.0 cm³ = 25.0 dm³",
        "25.0 cm³ = 250 dm³",
        "25.0 cm³ = 0.250 dm³"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-catalyst-distribution",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-physical",
    "lessonMatch": "kinetics",
    "context": "A catalyst increases a reaction's rate without changing the temperature.",
    "application": {
      "question": "Explain the increased rate using activation energy and particle energies.",
      "answer": [
        "The catalyst provides an alternative pathway with a lower activation energy.",
        "A larger proportion of particles can react successfully.",
        "The energy distribution is unchanged if temperature is unchanged."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Correct the statement that a catalyst increases the equilibrium constant by making more product.",
      "answer": [
        "A catalyst speeds up both forward and reverse reactions.",
        "It does not change the equilibrium constant at a fixed temperature."
      ]
    },
    "choice": {
      "question": "What changes when a catalyst is added at constant temperature?",
      "options": [
        "The activation energy of the reaction pathway",
        "The total number of atoms in the system",
        "The temperature by definition",
        "The equilibrium constant"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-initial-rates",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-physical",
    "lessonMatch": "rate equation",
    "context": "Doubling [A] at fixed [B] doubles the initial rate. Doubling [B] at fixed [A] quadruples it.",
    "application": {
      "question": "Deduce the rate equation and overall order.",
      "answer": [
        "The reaction is first order with respect to A.",
        "It is second order with respect to B.",
        "Rate = k[A][B]²; overall order is 3."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Why use initial rates rather than compare rates after arbitrary different times?",
      "answer": [
        "Initial concentrations are known and comparable.",
        "Later concentrations change as reaction proceeds, making the comparison less controlled."
      ]
    },
    "choice": {
      "question": "If both concentrations double, by what factor does the initial rate rise?",
      "options": [
        "8",
        "2",
        "4",
        "6"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-buffer-added-acid",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-physical",
    "lessonMatch": "acids and bases",
    "context": "Small amounts of acid are added to a buffer containing a weak acid HA and its conjugate base A⁻.",
    "application": {
      "question": "Explain why the pH changes only slightly.",
      "answer": [
        "A⁻ reacts with added H⁺ to form HA.",
        "Most of the added hydrogen ions are removed.",
        "The HA/A⁻ ratio changes relatively little for a small addition."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why a large addition of acid can overwhelm the buffer.",
      "answer": [
        "The supply of A⁻ is finite.",
        "When much of it has reacted, additional H⁺ is no longer removed effectively."
      ]
    },
    "choice": {
      "question": "Which equation represents removal of added hydrogen ions?",
      "options": [
        "A⁻ + H⁺ → HA",
        "HA → A⁻ + H⁺ only",
        "H⁺ + H⁺ → H₂",
        "A⁻ → A + e⁻"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-group2-trend",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-inorganic",
    "lessonMatch": "group 2",
    "context": "Magnesium and calcium are compared in reactions with water.",
    "application": {
      "question": "Explain why calcium generally reacts more readily than magnesium.",
      "answer": [
        "Calcium's outer electrons are farther from the nucleus and more shielded.",
        "The attraction to those electrons is weaker.",
        "Removing the outer electrons requires less energy overall."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why comparing pieces with very different surface areas weakens the rate comparison.",
      "answer": [
        "Surface area affects the area exposed to water.",
        "A rate difference could partly reflect specimen size rather than the chemical trend."
      ]
    },
    "choice": {
      "question": "Which ion is formed when a Group 2 atom loses its outer electrons?",
      "options": [
        "M²⁺",
        "M⁺",
        "M²⁻",
        "M⁻"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-halogen-displacement",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-inorganic",
    "lessonMatch": "group 7|halogen",
    "context": "Chlorine water is added to a solution containing bromide ions.",
    "application": {
      "question": "Write the ionic equation and identify the substance oxidised.",
      "answer": [
        "Cl₂ + 2Br⁻ → 2Cl⁻ + Br₂.",
        "Bromide ions lose electrons and are oxidised."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain why chlorine must be handled using appropriate ventilation and a small quantity.",
      "answer": [
        "Chlorine is hazardous by inhalation.",
        "Ventilation and small quantities reduce exposure; follow the laboratory's safety procedure."
      ]
    },
    "choice": {
      "question": "Why does chlorine displace bromine from bromide?",
      "options": [
        "Chlorine is a stronger oxidising agent",
        "Chloride ions are neutral atoms",
        "Bromide contains no electrons",
        "Chlorine is always a reducing agent"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-ethanol-oxidation",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-organic",
    "lessonMatch": "alcohol",
    "context": "Ethanol is oxidised using acidified potassium dichromate(VI).",
    "application": {
      "question": "Explain how conditions can favour an aldehyde rather than a carboxylic acid.",
      "answer": [
        "Use controlled oxidation and distil the aldehyde as it forms.",
        "Removing ethanal limits its further oxidation to ethanoic acid."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Why is reflux used when complete oxidation to the carboxylic acid is required?",
      "answer": [
        "Vapours condense and return to the reaction vessel.",
        "This allows prolonged heating without losing volatile reactants."
      ]
    },
    "choice": {
      "question": "What colour change indicates reduction of acidified dichromate(VI)?",
      "options": [
        "Orange to green",
        "Green to orange",
        "Colourless to purple",
        "Blue to red"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-aldehyde-test",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-organic",
    "lessonMatch": "aldehydes",
    "context": "Two unknown compounds are an aldehyde and a ketone. Both have a carbonyl group.",
    "application": {
      "question": "Describe how Tollens' reagent distinguishes them.",
      "answer": [
        "Warm gently with Tollens' reagent.",
        "The aldehyde gives a silver mirror.",
        "The ketone does not give this positive result under these conditions."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain why a positive 2,4-DNPH test alone cannot identify which is the aldehyde.",
      "answer": [
        "Both aldehydes and ketones react with 2,4-DNPH.",
        "The test identifies a carbonyl group rather than distinguishing these two classes."
      ]
    },
    "choice": {
      "question": "What is observed in a positive 2,4-DNPH test?",
      "options": [
        "An orange or yellow precipitate",
        "A silver mirror in every case",
        "A green solution",
        "Oxygen bubbles only"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-chemistry-chromatography-peak",
    "level": "alevel",
    "subject": "chemistry",
    "topic": "chem-organic",
    "lessonMatch": "chromat",
    "context": "A chromatogram contains a peak with the same retention time as a reference compound.",
    "application": {
      "question": "Explain what this suggests and why it is not definitive identification.",
      "answer": [
        "It is consistent with the reference compound being present under the same conditions.",
        "Different compounds can have similar retention times.",
        "An additional technique such as mass spectrometry can strengthen identification."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Give two conditions that must be comparable for a useful retention-time comparison.",
      "answer": [
        "Use the same stationary phase and operating conditions.",
        "Keep mobile-phase flow and temperature conditions comparable."
      ]
    },
    "choice": {
      "question": "What is the role of the stationary phase?",
      "options": [
        "Components interact with it to different extents",
        "It must move through the column faster than the sample",
        "It removes every impurity automatically",
        "It supplies electrons to all compounds"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-wire-uncertainty",
    "level": "alevel",
    "subject": "physics",
    "topic": "measurements",
    "lessonMatch": "uncertaint",
    "context": "A wire's diameter is measured as 0.50 ± 0.01 mm. Cross-sectional area is proportional to diameter squared.",
    "application": {
      "question": "Estimate the percentage uncertainty in cross-sectional area.",
      "answer": [
        "Percentage uncertainty in diameter = (0.01 ÷ 0.50) × 100 = 2%.",
        "For a squared quantity, percentage uncertainty is approximately doubled.",
        "Area uncertainty is approximately 4%."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "A student says closely repeated diameter readings prove the area is accurate. Evaluate this claim.",
      "answer": [
        "Close repeats indicate precision.",
        "A systematic error such as an incorrect micrometer zero can remain in every reading.",
        "Precision alone does not establish accuracy."
      ]
    },
    "choice": {
      "question": "Which measurement dominates uncertainty when calculating area from diameter?",
      "options": [
        "The diameter measurement",
        "The ruler's colour",
        "The wire's electrical current",
        "The laboratory's room number"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-threshold-frequency",
    "level": "alevel",
    "subject": "physics",
    "topic": "particles",
    "lessonMatch": "photoelectric",
    "context": "Light below a metal's threshold frequency does not release photoelectrons, even when its intensity is increased.",
    "application": {
      "question": "Explain this observation using the photon model.",
      "answer": [
        "Each photon has energy hf.",
        "Below threshold, one photon's energy is less than the work function.",
        "Increasing intensity adds more photons but does not increase each photon's energy."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Predict the effect of increasing frequency above threshold on maximum photoelectron kinetic energy.",
      "answer": [
        "Maximum kinetic energy is hf minus the work function.",
        "Increasing frequency increases this maximum kinetic energy."
      ]
    },
    "choice": {
      "question": "What is the gradient of a maximum kinetic energy versus frequency graph?",
      "options": [
        "Planck's constant h",
        "The work function",
        "The electron mass",
        "The speed of light"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-double-slit-spacing",
    "level": "alevel",
    "subject": "physics",
    "topic": "waves",
    "lessonMatch": "double-slit",
    "context": "Monochromatic light produces interference fringes in a double-slit experiment.",
    "application": {
      "question": "Use w = λD/s to predict what happens when slit separation is doubled.",
      "answer": [
        "With wavelength and screen distance fixed, fringe spacing is inversely proportional to slit separation.",
        "Doubling s halves w."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain how to reduce percentage uncertainty when measuring fringe spacing.",
      "answer": [
        "Measure across several adjacent fringe intervals.",
        "Divide the total measured distance by the number of intervals."
      ]
    },
    "choice": {
      "question": "Which change doubles fringe spacing under the small-angle approximation?",
      "options": [
        "Double screen distance",
        "Double slit separation",
        "Halve wavelength",
        "Halve screen distance"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-inelastic-collision",
    "level": "alevel",
    "subject": "physics",
    "topic": "mechanics-materials",
    "lessonMatch": "momentum",
    "context": "A 2.0 kg trolley moving at 3.0 m/s collides with a stationary 1.0 kg trolley. They stick together; external impulse is negligible.",
    "application": {
      "question": "Calculate their common velocity after the collision.",
      "answer": [
        "Initial momentum = 2.0 × 3.0 = 6.0 kg m/s.",
        "Total mass after collision is 3.0 kg.",
        "Velocity = 6.0 ÷ 3.0 = 2.0 m/s in the original direction."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Compare kinetic energy before and after the collision.",
      "answer": [
        "Initial kinetic energy = 1/2 × 2.0 × 3.0² = 9.0 J.",
        "Final kinetic energy = 1/2 × 3.0 × 2.0² = 6.0 J.",
        "3.0 J is transferred to internal energy, sound and deformation."
      ]
    },
    "choice": {
      "question": "Which quantity is conserved under the stated condition?",
      "options": [
        "Total momentum",
        "Total kinetic energy",
        "Each trolley's velocity",
        "Each trolley's momentum separately"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-wire-modulus",
    "level": "alevel",
    "subject": "physics",
    "topic": "mechanics-materials",
    "lessonMatch": "young modulus",
    "context": "A student uses E = FL/(AΔL) to determine a wire's Young modulus.",
    "application": {
      "question": "Explain why a long, thin wire gives a more measurable extension for the same force.",
      "answer": [
        "Extension is proportional to original length for fixed E and A.",
        "Extension is inversely proportional to cross-sectional area for fixed E and L.",
        "A larger extension reduces relative uncertainty in its measurement."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Why should loading remain in the linear elastic region?",
      "answer": [
        "The equation assumes stress is proportional to strain.",
        "Beyond that region the measured ratio need not represent the constant Young modulus."
      ]
    },
    "choice": {
      "question": "What is the SI unit of Young modulus?",
      "options": [
        "Pa",
        "N",
        "m",
        "J"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-cell-load",
    "level": "alevel",
    "subject": "physics",
    "topic": "electricity",
    "lessonMatch": "internal resistance",
    "context": "A cell has emf 1.50 V. At a current of 0.40 A its terminal potential difference is 1.30 V.",
    "application": {
      "question": "Calculate its internal resistance.",
      "answer": [
        "Lost volts = emf − terminal p.d. = 0.20 V.",
        "r = lost volts ÷ current = 0.20 ÷ 0.40 = 0.50 Ω."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain why the circuit should be opened between readings when studying the cell.",
      "answer": [
        "It reduces heating and discharge of the cell.",
        "This helps keep emf and internal resistance more consistent between measurements."
      ]
    },
    "choice": {
      "question": "For a V versus I graph obeying V = ε − Ir, what does the gradient represent?",
      "options": [
        "−r",
        "ε",
        "1/r",
        "The external resistance in every case"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-driven-oscillation",
    "level": "alevel",
    "subject": "physics",
    "topic": "further-mechanics",
    "lessonMatch": "resonance",
    "context": "A damped oscillator is driven through a range of frequencies.",
    "application": {
      "question": "Explain why its amplitude peaks near its natural frequency.",
      "answer": [
        "Near resonance, the driving force transfers energy effectively to the oscillator.",
        "The steady amplitude is greatest when energy input balances losses at a large amplitude."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Describe the effect of increasing damping on the resonance response.",
      "answer": [
        "The peak amplitude decreases.",
        "The resonance peak becomes broader and less sharp."
      ]
    },
    "choice": {
      "question": "What distinguishes forced oscillations?",
      "options": [
        "An external periodic driving force",
        "No energy transfers",
        "A frequency always equal to zero",
        "The absence of damping in every case"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-capacitor-time",
    "level": "alevel",
    "subject": "physics",
    "topic": "fields",
    "lessonMatch": "capacitor.*discharg|discharg.*capacitor",
    "context": "A discharging capacitor obeys V = V₀e^(−t/RC). Its time constant is 2.0 s.",
    "application": {
      "question": "Calculate the voltage fraction remaining after one time constant.",
      "answer": [
        "At t = RC, V/V₀ = e⁻¹.",
        "The fraction is approximately 0.368, or 36.8%."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain why a high-resistance voltmeter is useful in this experiment.",
      "answer": [
        "It draws little current from the capacitor.",
        "It reduces the effect of the measurement circuit on the discharge time constant."
      ]
    },
    "choice": {
      "question": "What happens to the time constant if R doubles and C is unchanged?",
      "options": [
        "It doubles",
        "It halves",
        "It stays unchanged",
        "It becomes zero"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-moving-magnet",
    "level": "alevel",
    "subject": "physics",
    "topic": "fields",
    "lessonMatch": "electromagnetic induction",
    "context": "A magnet is moved into a coil connected to a sensitive voltmeter.",
    "application": {
      "question": "Explain why faster motion can produce a larger induced emf.",
      "answer": [
        "The coil's magnetic flux linkage changes as the magnet moves.",
        "Faster motion produces a greater rate of change of flux linkage.",
        "Faraday's law relates induced emf magnitude to that rate."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain what happens to the sign of the induced emf when the same magnet is withdrawn.",
      "answer": [
        "The change of flux linkage reverses direction.",
        "The induced emf reverses polarity, consistent with Lenz's law."
      ]
    },
    "choice": {
      "question": "When is no emf induced by an otherwise stationary magnet and coil?",
      "options": [
        "When their flux linkage is constant",
        "Whenever a magnet is present",
        "Only when the coil has many turns",
        "Whenever the voltmeter is sensitive"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-alevel-physics-decay-log",
    "level": "alevel",
    "subject": "physics",
    "topic": "nuclear",
    "lessonMatch": "half-life",
    "context": "For a radioactive source, a graph of ln(corrected count rate) against time is a straight line with gradient −0.020 min⁻¹.",
    "application": {
      "question": "Calculate the decay constant and half-life.",
      "answer": [
        "The gradient is −λ, so λ = 0.020 min⁻¹.",
        "Half-life = ln 2 ÷ λ.",
        "Half-life ≈ 34.7 min."
      ]
    },
    "review": {
      "bankType": "practical",
      "question": "Explain why background must be subtracted before taking logarithms.",
      "answer": [
        "Background is an additional count rate not due to the source's decay.",
        "Taking logarithms of the uncorrected total can distort the straight-line relationship and decay constant."
      ]
    },
    "choice": {
      "question": "Which relation links half-life and decay constant?",
      "options": [
        "T₁/₂ = ln 2 / λ",
        "T₁/₂ = λ ln 2",
        "T₁/₂ = 1 / λ²",
        "T₁/₂ = λ / ln 2"
      ],
      "correct": 0
    }
  },
  {
    "id": "spark-gcse-physics-galaxy-redshift",
    "level": "gcse",
    "subject": "physics",
    "topic": "p8",
    "lessonMatch": "red.?shift",
    "context": "Light from a distant galaxy has absorption lines shifted to longer wavelengths compared with a laboratory spectrum.",
    "application": {
      "question": "Explain what the shift suggests about the galaxy's motion.",
      "answer": [
        "A shift to longer wavelengths is a red-shift.",
        "It indicates that the galaxy is moving away from us."
      ]
    },
    "review": {
      "bankType": "data",
      "question": "Explain how observations of many galaxies support an expanding Universe.",
      "answer": [
        "Most distant galaxies show red-shift.",
        "More distant galaxies generally have greater recession speeds.",
        "This is consistent with distances between galaxies increasing."
      ]
    },
    "choice": {
      "question": "Which comparison is needed to identify a red-shift?",
      "options": [
        "The same spectral lines measured in a laboratory",
        "Two unrelated stars' apparent brightness only",
        "The size of the telescope mirror alone",
        "The galaxy's colour in a single photograph"
      ],
      "correct": 0
    }
  }
];
function attachAdditional(lessons){
  for(const s of scenarios){
    const lesson=lessons.find(l=>l.level===s.level&&l.subject===s.subject&&l.topic===s.topic&&new RegExp(s.lessonMatch,'i').test(l.title));
    if(!lesson)throw Error('No precise lesson for authored scenario: '+s.id);
    const common={authored:true,scenarioId:s.id,context:s.context};
    for(const [suffix,q] of [['application',s.application],['review',s.review]]){
      lesson.questions.push({...common,bankId:s.id+':'+suffix,question:s.context+'\n'+q.question,answer:q.answer,marks:q.answer.length,bankType:q.bankType||'application',difficulty:suffix==='application'?'standard':'challenge'});
    }
    const c=s.choice;
    lesson.questions.push({...common,bankId:s.id+':choice',question:s.context+'\n'+c.question,answer:[c.options[c.correct]],marks:1,bankType:'choice',difficulty:'foundation',options:c.options,correct:c.correct});
    lesson.questionCount=lesson.questions.length;
  }
  return lessons;
}
module.exports={scenarios,attachAdditional};
