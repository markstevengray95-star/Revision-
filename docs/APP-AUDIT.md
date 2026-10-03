# Revision app audit — 3 October 2026

The audit covers the combined GCSE/A-level revision app and integrates the homework changes from main at 1f04cd7891cdcd99f55a0d56ffb272af4bb3de6e. Original imported question-bank wording and diagram hashes remain intact.

## Fixes

- GCSE calculation marking shares the tested equation, rearrangement, number, unit and significant-figure checks used by the A-level marker. A correct I=Q/t calculation now receives 2/2; a missing required unit or incorrect result does not earn the accuracy mark.
- Lesson presentation phase labels are Start, Learn, Practise and Review. A-level Biology, Chemistry and Physics use 15-slide decks. GCSE keeps its variable-length specification teaching and embedded checks; teaching chunks and application checks now receive the correct phase labels.
- Biology and Chemistry teacher notes are hidden until requested. Worked solutions retain their separate reveal control.
- Practical simulator layout uses compiled local CSS rather than the remote Tailwind runtime. Dark-mode styling retains class-based switching.
- Updated stale audit tests to load the actual lesson detail/answer dependencies and corrected a Windows line-ending issue in the worked-example check. Extended lesson and simulation checks now run in CI.
- Resolved conflicts with newer homework work, retaining both the five homework templates and ten ready-made assessments. Clicking a ready-made assessment clears the previous weekly-template selection before generating its preview.

## Verification

| Area | Evidence |
| --- | --- |
| Courses and question data | 711 lessons; 7,293 questions; six courses; 44 topics; original Word data/83 diagram hashes checked |
| Lesson presentations | All 439 GCSE decks audited; all 272 A-level decks built with matching practice/answer pairs; Biology and Chemistry navigation, notes and solution controls checked in a browser |
| Graph practice | 58 scenarios; 13,920 generated-answer checks; browser keyboard plotting, variable selection and anomaly feedback; mobile layout checked |
| Equation practice | 272 equation forms; 64,880 rearrangement/conversion cases; browser breakdown, worked example, structured answer and feedback; mobile layout checked |
| GCSE simulations | All 26 practicals exercised in the browser; 36 model setups and 154 default/boundary/choice cases checked |
| A-level simulations | All 12 Physics practicals pass model sweeps; animation regressions for practicals 1–6; lab-book integrity and 12 worked examples; practical 1 recording and optional 3D loading checked in browser |
| Homework and assessment | All six courses and ten assessment presets checked; five newer templates checked across all courses; matching, ordering, gaps, corrections and resource tasks checked. Isolated teacher UI generates 12 auto-marked mixed questions and a 10-question application assessment after switching from weekly revision |
| Marking APIs and routes | Real compiled Next server: 11 main pages respond successfully; both GCSE/A-level offline marking award correct/missing-unit results; invalid requests rejected; question generation succeeds |
| Build and automated checks | npm test, npm run audit (27 extended checks), npm run test:marking (19 regressions) and npm run build pass locally |

## Verification limits

Authenticated assignment publication, real student submission, feedback release and cloud grade persistence require a signed-in teacher/student session and were not verified end to end. Browser homework checks use an isolated fixture with no account or database writes. Offline marking and local simulation/model checks do not verify an external AI provider. Only A-level Physics practical 1 received a browser 3D-loading check; the remaining Physics models were checked mathematically and through their automated regressions. Biology/Chemistry practical-learning coverage tests do not imply 24 additional Physics-style 3D simulations.

These changes are on the open pull request; production is unchanged until it is merged and deployed.
