# Teacher platform delivery

Each phase is tested and pushed separately to main.

1. Dashboard and Classes
2. Set Work
3. Assignment tracking
4. Markbook
5. Topic mastery
6. Intervention groups
7. Adaptive follow-up
8. Homework planner and alerts

## Phase 1
Five-section navigation, real result metrics, rename/archive/restore and student profiles. Pending written reviews are excluded from averages. Archived classes can be restored. The existing integration branding assertion now matches the Spark lightning icon.

## Phase 2
Five-step Set Work wizard; topic/lesson selection; six activity presets; cloud drafts; targeted students and atomic multi-class assignments; scheduled release, target and duration; reuse and duplicate homework. New release and recipient rules are enforced on reads, draft saving, submission and feedback.

## Phase 3
Assignment reports show all recipients, including saved drafts, with completion/overdue/target filters and expandable answer review. Active time and question time are estimates recorded only during recent interaction in a focused, visible tab. Historical rows display an em dash when timing is unavailable.

Timing is saved with each submitted attempt and survives duplicate submission tokens. Live rollback fixtures verify time is carried over without leaving test accounts.

## Phase 4
Class markbook with assignment/topic/student selection and due-date periods. Latest marked results only; pending reviews and unassigned students remain distinct from zero. Exports include formula-safe CSV, native .xlsx with Unicode text, and a print layout for browser Save as PDF.

## Phase 5
Question metadata includes subject/topic/subtopic/skill and optional teacher-verified specification references. Topic/subtopic/skill mastery uses latest marked question evidence, displays sample size and ignores unmarked answers. Lost marks flag questions and possible teaching checks; they do not assert a diagnosed misconception from a wrong answer alone. Selected pupils can be sent into the intervention assignment wizard.

## Phase 6
Evidence-based topic/calculation/exam/extension suggestions with minimum sample requirements. Teachers review names, save groups, edit membership and select a saved group in Set Work. Group writes validate class ownership and joined membership atomically.

## Phase 7
Teacher-approved per-student follow-up plans use exact non-overlapping score bands. Foundation includes reteach notes and worked examples; consolidation mixes retrieval and calculations; application/challenge draws on the existing application/synoptic question bank and requires teacher review for written marks. Plans exclude pending/unsubmitted results and show every question and mark scheme before approval. Assignment runs are atomic and idempotent. Short subtopics can supply fewer distinct recall questions than requested; preview shows the actual count.

## Phase 8
Weekly homework planner with editable topic/lesson/activity for up to 52 weeks. Preview questions and schedules, save a cloud plan and schedule all atomically with idempotent retries. Assignments release through database time rules even while the teacher is offline. Dashboard alerts cover passed deadlines, 3 missed tasks in 30 days, 15-point score trends over 4 assignments, majority question struggles, recommended topics, and 7-day class summaries. Alerts refresh while the workspace is open and can be dismissed across devices. This phase provides in-app notifications, not email or background browser push.

## Database upgrade order
Already applied to the connected Revision database: teacher-workflow.sql, teacher-study.sql, teacher-assignment-dates.sql, teacher-tracking.sql, teacher-question-metadata.sql, teacher-interventions.sql, teacher-followups.sql, teacher-planner.sql, then teacher-integration.sql. Follow these after topic-activities.sql when provisioning a new environment.

## Validation
Pure aggregation tests, generator checks, rollback database fixtures, browser inspection, Excel archive/XML checks and the repository regression/build checks. Database fixtures leave no accounts or classroom rows behind.

Integration verification also covers preserving lesson materials and recipient/settings when duplicating homework, and clears private previews and student profiles on teacher account changes. Alerts and weekly summaries run inside the teacher workspace; email and background push delivery are not enabled.

Current main integration retains the expanded 60-question builder, equation practice and school seat controls. Selected-lesson quizzes can use scientific vocabulary from the same topic for distractors while keeping every prompt within the selected lesson. Application and challenge generation was rechecked across all six GCSE/A-level science courses after integration.

Final validation: expanded activity generator passed 693 topic/pathway/type/seed combinations in course batches, plus 60-question mixes, objective mode and targeted-lesson checks. All 12 offline marking tests passed. Production Next build, teacher aggregation/export/auth checks and rollback database checks passed.
