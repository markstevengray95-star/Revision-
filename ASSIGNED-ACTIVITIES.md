# Teacher assignments and student activities

Teachers can now generate work for each of the 44 main GCSE and A-level science topics. Select the course, subject, GCSE pathway and topic; choose a quiz, exam practice or guided revision. Preview the questions and answer keys, remove unwanted questions, and add custom multiple-choice, numerical or written questions before assigning.

The builder supports 3–60 distinct questions, selectable question mixes and Support/Standard/Stretch calculation challenges. Scientific missing words are reviewed by the teacher; multiple choice and final numerical answers retain server marking. Fresh equation-based calculations draw on the 45-equation library. If a narrow selection cannot supply the requested count, the preview reports the shortage. **Equation Practice** is also a dedicated tab with equation breakdowns, worked examples and interactive answer steps. See [docs/question-tools.md](docs/question-tools.md) for the capacity upgrade and verification details.

Students join with the existing class code and open an activity from **My Work**. They answer within the app, save drafts across devices, submit for marking, see attempt history and worked feedback, and follow links to relevant lessons. In-progress, overdue, awaiting-review and marked filters help organise work.

## Marking and classroom controls

- Choice questions use the selected option, not keyword matching.
- Numerical answers are checked on the server against the teacher-approved value and absolute tolerance. Generated calculation questions accept answers rounded to three significant figures and scientific notation. They award final-answer marks; working is not automatically assessed.
- Generated exam practice is fully automatically marked by default. Teachers can opt to include written responses. Written answers have a model answer or mark scheme and need teacher review. Objective marks appear immediately, with a clear provisional result until written marking is complete.
- Teachers control the due date, acceptance of late work, 1–5 attempts, and release of worked solutions after each attempt, after the final allowed attempt, or after the due date. The latest attempt is the planner result; previous attempts remain in the history.
- Questions and marking settings are frozen when assigned. Teachers can close/reopen an activity, duplicate it for the same class with a later due date, view outstanding students and common missed questions, and export class results as CSV. Customisation of a copy happens by generating a new preview; an already assigned question set is not edited in place.

These are original practice activities drawn from the reviewed course content, not official past papers or exam-board grades. Guided revision includes lesson links and marked checks; a lesson visit alone is not counted as proof of learning.

## Database and access

The existing Supabase project `emjmvgginijkupwuflla` has the additive activity upgrade. The complete upgrade source is [supabase/topic-activities.sql](supabase/topic-activities.sql), layered on the existing Revision profile/class/member/assignment/submission schema. It is excluded from the public static build.

Student-readable question specifications contain no embedded marking keys. Keys live in a private schema with no client table access and an explicit deny policy. Public RPC wrappers use `SECURITY INVOKER`; private implementations check authentication and class ownership/membership, with fixed search paths. Scores and written-review marks are written by those implementations. Existing note-submission endpoints cannot overwrite scored activities. Repeated submission requests use an idempotency token and do not consume another attempt.

Teacher accounts remain self-registering, as in the existing app. A teacher only accesses their own classes. The original course content and public practice area remain readable, so this is a learning platform rather than a locked-down examination environment.

## Verification

- `npm test` checks existing course integrity and lesson solutions, activity generation across 612 level/subject/pathway/type/seed combinations, plus fully automatic 15-question exam sets for every topic. It also checks answer keys, unique questions, calculation tolerances, links, CSV quoting, spreadsheet formula protection and session refresh/sign-out races.
- `npm run build` includes all new pages and runtime assets in the static output.
- [tests/activity-database.sql](tests/activity-database.sql) passes against the live database. Temporary rows are rolled back. It verifies class isolation, private keys, cloud drafts, objective marking, written review, retry/deadline limits, solution release, duplication, idempotency and rejection of forged scores or legacy endpoint bypasses.
- Browser verification used temporary teacher/student accounts and an isolated class: generated and assigned an exam activity, saved/reloaded answers, submitted a calculation, reviewed written answers, and confirmed final marks/feedback reached the student. Guided revision also passed two attempts (2/4 then 4/4), delayed solutions, a custom teacher question, attempt history and lesson recommendations.
- The student activity and teacher form were checked at mobile sizes. CSV generation and download attachment passed local checks; the in-app browser did not expose a completed download event, so that browser's native download handling was not confirmed.
- Immediate sign-out during dashboard loading and sign-out in another browser tab were verified. Pending requests do not restore a signed-out dashboard or overwrite a different account's session.

Verification accounts and their class data are removed after the browser checks. No real student results are used for testing.
