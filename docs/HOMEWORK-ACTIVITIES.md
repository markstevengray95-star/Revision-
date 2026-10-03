# Homework activities — Phase 1

Set Work now offers five editable homework presets:

* 10-minute retrieval: 10 automatically marked recall questions.
* Last lesson recap: 3 recall questions from an explicitly selected lesson (5 minutes).
* Weekly mixed revision: 12 recall questions split between the current topic and 1–3 older topics selected by the teacher (15 minutes).
* Equation practice: 8 automatically marked numerical questions (15 minutes).
* Exam preparation: 10 recall/calculation/written questions (20 minutes); written responses need teacher review.

Presets fill the question mix, attempts, feedback release, instructions and estimated duration. Teachers can adjust these and review every question and answer before assigning. Durations are estimates, not timed cut-offs. Narrow selections with insufficient distinct questions report the shortage instead of repeating questions.

Older-topic suggestions come from the selected class's due or marked work, filtered to the chosen course and pathway. Teachers confirm that those topics were taught; the app does not infer mastery from an assignment merely having been set. The current topic receives roughly half the questions, with the remainder distributed across the selected older topics. Topic selection and the complete preview are saved in existing teacher drafts. No database migration is required.

Mixed assignments retain per-question topic metadata, so topic mastery and intervention suggestions track the relevant knowledge rather than attributing everything to “mixed revision”. Existing assignment, student answer, tracking, marking and export flows are reused.

Validation: tests/homework-presets.cjs checks all five presets across GCSE and A-level Biology, Chemistry and Physics, question uniqueness, private key stripping, lesson scope, calculation type, topic quotas and invalid selections. tests/teacher-data.cjs checks separate mastery for mixed-topic questions.

## Phase 2 — More homework task types

In Settings and preview, open **Add your own question** after generating a preview. Four new authoring choices are available:

* Matching: enter 2–6 `term | definition` pairs. Each term becomes a multiple-choice question with shuffled definitions and automatic marking. Marks are per match; all pairs count towards the 60-question limit.
* Ordering: enter 3–10 steps in the correct order. Students see a shuffled list and write the correct sequence. Teachers review it against the private numbered sequence.
* Missing words: write a paragraph with 1–10 answers in square brackets. Students see numbered gaps and write the answers; teachers review synonyms and spelling using the private answer list.
* Spot the mistake: enter an incorrect statement and the corrected explanation. Students identify, correct and explain the mistake; teachers review the supplied mark scheme.

These tasks use the existing question formats, drafts, assignment transport, student responses, feedback release, marking and markbook. No database migration is required. Student questions contain only public task text and choices; answers stay in private keys. Teachers can add these tasks to any generated homework preview, remove questions and save the result as a draft or reuse it later. Ordering and missing-word tasks use the existing written answer box rather than drag-and-drop controls.

Validation: `tests/homework-tasks.cjs` verifies matching keys after shuffling, hidden gap answers, shuffled ordering, correction schemes, authoring validation and public-key stripping. Existing activity and result checks cover the reused student and marking flows.

Later phases remain separate: diagram/graph/practical tasks; corrections and spaced follow-ups based on previous results.
