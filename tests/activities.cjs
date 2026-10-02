const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  vm = require("node:vm"),
  path = require("node:path");
const root = path.resolve(__dirname, ".."),
  w = {};
const ctx = vm.createContext({ window: w, console });
for (const file of [
  "practice-data.js",
  "shared/practice-skills.js",
  "shared/equation-bank.js",
  "shared/homework-engine.js",
  "shared/activity-generator.js",
])
  vm.runInContext(fs.readFileSync(path.join(root, file), "utf8"), ctx);
let generated = 0;
for (const level of ["gcse", "alevel"])
  for (const subject of ["biology", "chemistry", "physics"])
    for (const pathway of level === "gcse"
      ? ["combined", "triple"]
      : ["combined"])
      for (const topic of w.REVISION_ACTIVITIES.topics(level, subject, pathway))
        for (const kind of ["quiz", "exam", "revision"])
          for (const seed of [0, 1, 8]) {
            const activity = w.REVISION_ACTIVITIES.generate({
              level,
              subject,
              pathway,
              topic: topic.id,
              kind,
              count: 6,
              seed,
            });
            generated++;
            assert.equal(
              activity.questions.length,
              6,
              `${level}/${subject}/${topic.id}/${kind}/${seed} must produce requested count`,
            );
            assert.equal(
              new Set(activity.questions.map((q) => q.prompt)).size,
              6,
            );
            assert.equal(new Set(activity.questions.map((q) => q.id)).size, 6);
            assert.ok(w.REVISION_ACTIVITIES.total(activity) > 0);
            for (const q of activity.questions) {
              assert.ok(q.key.solution.length);
              assert.ok(
                fs.existsSync(
                  path.join(
                    root,
                    new URL(q.lessonHref, "http://localhost").pathname,
                  ),
                ),
              );
              const lesson = w.REVISION_PRACTICE.lessons.find(
                (l) => l.id === q.lessonId,
              );
              assert.ok(lesson);
              if (pathway === "combined" && level === "gcse")
                assert.notEqual(lesson.scope, "triple");
              if (q.type === "choice") {
                assert.equal(
                  new Set(q.options.map((o) => o.text.toLowerCase())).size,
                  q.options.length,
                );
                const option = q.options.find((o) => o.id === q.key.correct);
                assert.ok(option);
                assert.ok(
                  q.key.solution[0].toLowerCase().includes(option.text.toLowerCase()),
                );
              }
              if (q.type === "number") {
                assert.ok(Number.isFinite(q.key.value));
                assert.ok(q.key.tolerance >= 0);
                assert.ok(
                  w.REVISION_SKILLS.correct(String(q.key.value), q.key.value),
                );
                assert.ok(
                  w.REVISION_SKILLS.correct(
                    w.REVISION_SKILLS.format(q.key.value),
                    q.key.value,
                  ),
                );
              }
            }
            const clean = w.REVISION_ACTIVITIES.publicQuestions(activity);
            assert.ok(clean.every((q) => !q.key));
            assert.equal(
              JSON.stringify(activity),
              JSON.stringify(
                w.REVISION_ACTIVITIES.generate({
                  level,
                  subject,
                  pathway,
                  topic: topic.id,
                  kind,
                  count: 6,
                  seed,
                }),
              ),
              "Seeds must be reproducible",
            );
          }
assert.throws(() =>
  w.REVISION_ACTIVITIES.generate({
    level: "gcse",
    subject: "physics",
    topic: "missing",
  }),
);
for (const level of ["gcse", "alevel"])
  for (const subject of ["biology", "chemistry", "physics"])
    for (const topic of w.REVISION_ACTIVITIES.topics(
      level,
      subject,
      "triple",
    )) {
      const activity = w.REVISION_ACTIVITIES.generate({
        level,
        subject,
        topic: topic.id,
        pathway: "triple",
        kind: "exam",
        count: 15,
        seed: 5,
        includeWritten: false,
      });
      assert.equal(activity.questions.length, 15);
      assert.ok(
        activity.questions.every((q) => q.type !== "written"),
        "Automatic exam mode must contain only objective questions",
      );
    }
console.log(
  `Activities passed: ${generated} topic/pathway/type/seed combinations, correct objective keys, numerical tolerance, unique questions, lesson links and deterministic generation.`,
);
for(const [level,subject,topic] of [['gcse','biology','b1'],['gcse','chemistry','c3'],['gcse','physics','p1'],['alevel','biology','bio-molecules'],['alevel','chemistry','chem-physical'],['alevel','physics','mechanics-materials']]) {
  for(const format of ['mixed','calculation']) {
    const settings={level,subject,topic,pathway:'triple',kind:'exam',count:60,seed:76,format,demand:'stretch'};
    const activity=w.REVISION_ACTIVITIES.generate(settings);
    assert.equal(activity.questions.length,60);assert.equal(new Set(activity.questions.map(q=>q.prompt)).size,60);
    const clean=w.REVISION_ACTIVITIES.publicQuestions(activity);assert.ok(!/"(?:key|expected|calculation|model|solution)"/.test(JSON.stringify(clean)),'Public questions must not contain nested keys');
    assert.equal(JSON.stringify(activity),JSON.stringify(w.REVISION_ACTIVITIES.generate(settings)));
    assert.notEqual(JSON.stringify(activity.questions),JSON.stringify(w.REVISION_ACTIVITIES.generate({...settings,seed:77}).questions));
    if(format==='calculation')assert.ok(activity.questions.every(q=>q.type==='number'));
  }
}
const missingWords=w.REVISION_ACTIVITIES.generate({level:'gcse',subject:'biology',topic:'b1',format:'cloze',count:20});assert.ok(missingWords.questions.every(q=>q.type==='written'&&q.marks===1));
assert.throws(()=>w.REVISION_ACTIVITIES.generate({level:'gcse',subject:'physics',topic:'p1',count:61}),/3–60/);
console.log('Expanded activities passed: 60 unique mixed/calculation questions for all six courses, fresh seeds, teacher-reviewed missing words and no private fields in student specifications.');

for(const level of ['gcse','alevel'])for(const subject of ['physics','chemistry','biology']){const q=w.REVISION_ACTIVITIES.generate({level,subject,topic:'all',format:'objective',kind:'exam',includeWritten:true,count:60,seed:13});assert.equal(q.questions.length,60);assert.ok(q.questions.every(x=>x.type!=='written'),'Objective mode must remain automatically markable even in exam mode');}
console.log('Objective homework passed: all six courses support 60 auto-marked questions with teacher writing enabled.');
