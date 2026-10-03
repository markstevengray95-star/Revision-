# Original scenario questions and assignable tasks

This expansion adds 183 original Spark questions in 61 scenarios: GCSE Biology 30, GCSE Chemistry 30, GCSE Physics 33, and A-level Biology/Chemistry/Physics 30 each. Scenarios map to existing lessons across all 44 topic areas. These are newly authored indicative questions and marking points; they are not copied AQA exam questions or official mark schemes. The user's imported Word banks remain unchanged.

Each scenario includes an application response, a practical-method or data/evidence response, and a four-option choice. Written questions award one mark per listed point; numerical working within written responses is teacher reviewed. Choices use existing automatic marking. Authored scenarios are interleaved with the lesson bank so they appear regularly in generated work. Generated question metadata preserves marks, scenario IDs and lesson links. Combined Science excludes scenarios attached to Separate Science lessons.

The course generator attaches these scenarios before writing practice-data.js (version 3). The build generates the current bank for the browser, with 7,293 answered prompts across 711 lessons. Source questions live in scripts/additional-questions.cjs; edit that file and regenerate using node scripts/practice-catalog.cjs.

Teacher Set Work now offers 10 presets: quick recall, automatic mixed homework, calculations, weekly revision, exam answers, application assessment, practical skills assessment, data/evidence assessment, end-of-topic assessment and cumulative assessment. Presets set count, question format, duration, demand, attempt limit and feedback mode, then generate a preview immediately. Subject-wide presets explicitly use all core topics. Other presets respect the selected topic. Teachers can customise, save a draft and assign through the existing release-date, recipient and grading workflow. No database migration or new question type is required.

Practical and data formats narrow the bank to the relevant reviewed scenarios. Empty or insufficient selections report a useful error instead of silently repeating questions. Written responses retain teacher review; choices and numerical final answers are automatically marked. Assignment publicQuestions removes answer keys before saving public question payloads. Existing private-key release and server grading remain unchanged.

The searchable bank includes the new question types and interactive multiple-choice checks. Choice options are shuffled, progress is self-study local storage, and the existing source-bank practice is still available.

Curriculum topic mapping references checked on 2 October 2026:
- GCSE Biology: https://www.aqa.org.uk/subjects/biology/gcse/biology-8461/specification/subject-content
- GCSE Chemistry: https://www.aqa.org.uk/subjects/chemistry/gcse/chemistry-8462/specification/subject-content
- GCSE Physics: https://www.aqa.org.uk/subjects/physics/gcse/physics-8463/specification/subject-content
- A-level Biology: https://www.aqa.org.uk/subjects/biology/a-level/biology-7402/specification/subject-content
- A-level Chemistry: https://www.aqa.org.uk/subjects/chemistry/a-level/chemistry-7405/specification/subject-content
- A-level Physics: https://www.aqa.org.uk/subjects/physics/a-level/physics-7408/specification/subject-content

Validation: tests/question-expansion.cjs audits unique IDs, exact marking totals, four distinct options, all topic/course coverage, lesson scope, deterministic generation, automatic keys, private-key stripping, inclusion of authored choices and all 60 course/preset combinations. Existing full course, homework, source-bank and marking tests continue to run. No live class, assignment, submission or grade is created by these tests.
