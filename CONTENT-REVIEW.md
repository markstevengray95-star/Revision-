# Lesson content and activity review

Reviewed 1 October 2026. This records changes to the main lesson catalogue and shared assessments in the combined Revision app.

## Coverage

| Course | Distinct lesson entries |
| --- | ---: |
| GCSE Biology | 163 |
| GCSE Chemistry | 166 |
| GCSE Physics | 110 |
| A-level Biology | 39 |
| A-level Chemistry | 115 |
| A-level Physics | 118 |
| **Total** | **711** |

Chemistry includes chapter overviews and detailed specification lessons. Some detailed rows share the chapter reference, so raw counts from the source files double-count ten entries. The practice catalogue uses distinct references. Separate Science lessons remain clearly separated from the Combined Science pathway.

## Changes to explanations and answers

- Replaced generic prompts in 27 GCSE lesson explanations with substantive science and a specific accuracy check, including microscopy, food tests, stem cells, plant responses, fuel-cell half equations and infrared radiation.
- Linked GCSE lesson questions to their own scientific explanations. The previous model-answer field often contained advice about writing an answer instead of an answer to the question. Topic-wide worked examples are now separated from lesson-specific explanations.
- Selected GCSE vocabulary from the explanation and the same subject, using whole terms. This prevents an osmosis lesson inheriting unrelated microscopy terminology or matching “ion” inside “solution”.
- Corrected refraction wording for incidence along the normal, defined internal energy using random kinetic energy, and specified that steady temperature requires all energy inputs and outputs to balance.
- Distinguished atoms from smaller particles, discrete fullerene molecules from graphene sheets, electrode signs in electrolysis from electricity-generating cells, and antigens from an exclusively foreign-substance definition.
- Removed automatic exclusion of an unusual reaction-time reading. The worked example gives the mean of all five readings and explains when an independently justified exclusion would be appropriate.
- Corrected melting answer guidance that implied increased particle kinetic energy during a constant-temperature change of state, and clarified that a catalyst added at equilibrium leaves the composition unchanged.
- Clarified reaction conditions in physics examples: a string fixed at both ends, angles measured from the normal, capacitor discharge, and distance from the centre of a spherical gravitational source.
- Replaced vague A-level Physics calculation tasks with questions containing actual data, model answers and worked steps. The notes reader now exposes matching answers as well as the slide presentations.
- Clarified that an ionisation-energy jump question concerns a separate main-group metal, rather than implying that iron belongs to Group 2. Added the equations directly to a chlorine/ozone question that previously referred to unspecified steps “above”.
- Qualified hydrogen bonding to allow suitable intramolecular geometry. Kept the GCSE supernova model while acknowledging other heavy-element formation processes in the broader science.
- Loaded detailed Biology and Chemistry answers into the A-level assessment hub. Questions and answer points now come from the same resolved lesson profile, including individual Chemistry lessons. Detailed physical Chemistry sections retain their correct paper filters.
- Removed keyword-based marks from written-answer comparisons. A-level assessments require explicit self-assessment against matching points; GCSE topic practice shows indicative guidance. The GCSE Exam Studio correctly sums the weights of selected guidance points.

## Added activities

The shared **Practise** page is linked from the dashboard and course navigation. Each of the 711 entries has three answered retrieval prompts, a missing-word activity drawn from its scientific explanation, and an accuracy-check explanation activity. Each of the 44 core topics has an additional numerical data challenge with a complete worked solution. Most challenges support changing the data.

Answers to numerical questions are checked against a calculated result with tolerance for three significant figures. Inputs must be valid numbers, including scientific `e` notation. Explanations are compared with model answers and self-assessed. These are original practice activities and indicative answers, not official AQA papers or mark schemes.

Written responses and confidence are stored on the current device. Lesson links preserve the selected GCSE lesson and pathway, Physics lesson ID, or Chemistry chapter and individual lesson. Filters, previous/next navigation and browser Back are supported.

## Verification

`npm test` checks all 711 catalogue entries, 2,133 answered prompts, question/answer pairing, valid chapter and individual-lesson routes, Separate Science routing, every GCSE lesson's question ladder and exam pack, all 118 Physics presentations, assessment paper filtering, and reference results for all 44 numerical activities. Five seeds per challenge are checked for valid results, accepted rounded answers and rejected incorrect answers. `npm run build` regenerates the catalogue and produces the complete static app.

Browser checks exercise correct and incorrect answers, scientific notation, saved responses after reload, empty searches, GCSE lesson links, individual Chemistry lesson links and return navigation, Physics worked answers, A-level self-marking and a narrow mobile viewport without horizontal overflow.

Scientific review and automated checks serve different purposes: the tests verify coverage, arithmetic and application behaviour; they cannot certify every scientific statement. This review covers the primary lesson catalogue and shared assessments. The imported specialist tools and Physics option apps retain their own separate materials. The material has not received independent subject-teacher certification.

## Reference specifications

The review uses the current AQA subject-content pages and their detailed sections as the curriculum reference:

- [GCSE Biology 8461](https://www.aqa.org.uk/subjects/biology/gcse/biology-8461/specification/subject-content)
- [GCSE Chemistry 8462](https://www.aqa.org.uk/subjects/chemistry/gcse/chemistry-8462/specification/subject-content)
- [GCSE Physics 8463](https://www.aqa.org.uk/subjects/physics/gcse/physics-8463/specification/subject-content)
- [Combined Science: Trilogy 8464](https://www.aqa.org.uk/subjects/science/gcse/combined-science-trilogy-8464/specification/subject-content)
- [A-level Biology 7402](https://www.aqa.org.uk/subjects/biology/a-level/biology-7402/specification/subject-content)
- [A-level Chemistry 7405](https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content)
- [A-level Physics 7408](https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content)
- [NASA: heavy-element evidence from a neutron-star merger](https://science.nasa.gov/missions/webb/nasas-webb-makes-first-detection-of-heavy-element-from-star-merger/)
