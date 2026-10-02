/* Topic activities use reviewed lessons; assignment answer keys are stored privately. */
(() => {
  "use strict";
  const stop = new Set(
    "about after before between because their these those which where would should there through include scientific science using model process explanation answer other same different first second during example according however this that with from into each have been when they than only more some both also very them such does will most purpose intended rather created questions question effect effects possible depends useful important system object moving method methods identify describe explain state calculate correctly correct incorrect increase increases decrease decreases transport-safety".split(
      " ",
    ),
  );
  const technical = new Set(
    "energy power force speed velocity acceleration current voltage resistance charge potential magnetic field wave frequency wavelength amplitude density pressure temperature thermal kinetic gravitational chemical elastic nuclear atom element ion electron proton neutron mass volume molecule isotope proton neutron solenoid radiation decay radioactive activity half-life enzyme protein carbohydrate lipid glucose starch cellulose amino peptide water osmosis diffusion respiration photosynthesis mitochondria chloroplast nucleus cytoplasm membrane cell chromosome gene allele inheritance recessive dominant mutation meiosis mitosis DNA RNA ribosome antigen antibody immune pathogen bacteria virus disease vaccination hormone homeostasis insulin glucagon glycogen kidney absorption digestion ecosystem population biodiversity species carbon oxygen nitrogen hydrogen covalent ionic metallic lattice polymer monomer electrolyte electrode electrolysis reduction oxidation alkane alkene alcohol ester equilibrium catalyst titration chromatography concentration entropy enthalpy activation exothermic endothermic acid alkaline neutralisation reactant product electron uncertainty interference refraction diffraction photon electron elastic spring stress strain extension modulus stores surroundings".split(
      " ",
    ),
  );
  const hash = (value) => {
    let n = 2166136261;
    for (const ch of String(value))
      n = Math.imul(n ^ ch.charCodeAt(0), 16777619);
    return n >>> 0;
  };
  const shuffle = (items, seed) => {
    const out = [...items];
    let n = seed >>> 0;
    for (let i = out.length - 1; i > 0; i--) {
      n = (Math.imul(n, 1664525) + 1013904223) >>> 0;
      const j = n % (i + 1);
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  };
  function topics(level, subject, pathway = "combined") {
    const rows = window.REVISION_PRACTICE.lessons.filter(
      (l) =>
        l.level === level &&
        l.subject === subject &&
        (level !== "gcse" || pathway === "triple" || l.scope !== "triple"),
    );
    return [
      ...new Map(
        rows.map((l) => [l.topic, { id: l.topic, title: l.topicTitle }]),
      ).values(),
    ];
  }
  function choice(lesson, seed, index) {
    const lines = lesson.core
      .split(/(?<=[.!?])\s+(?=[A-Z])/)
      .filter((s) => s.length > 35);
    const line = lines[seed % lines.length] || lesson.core;
    const scientific = (w) =>
      technical.has(w.toLowerCase()) ||
      technical.has(w.toLowerCase().replace(/s$/, ""));
    const tokens = [...line.matchAll(/[A-Za-z][A-Za-z-]{4,}/g)].filter(
      (m) => !stop.has(m[0].toLowerCase()),
    );
    const preferred = tokens.filter((m) => scientific(m[0]));
    const candidates = preferred.length ? preferred : tokens;
    if (!candidates.length) return null;
    const word = candidates[seed % candidates.length],
      correct = word[0];
    const words = [
      ...new Set(
        [...lesson.core.matchAll(/[A-Za-z][A-Za-z-]{4,}/g)]
          .map((m) => m[0].toLowerCase())
          .filter((w) => w !== correct.toLowerCase() && !stop.has(w)),
      ),
    ];
    const pool = words.filter(scientific);
    for (const w of words)
      if (pool.length < 3 && !pool.includes(w)) pool.push(w);
    const alternatives = shuffle(pool, seed).slice(0, 3);
    for (const fallback of [
      "measurement",
      "substance",
      "arrangement",
      "organism",
      "frequency",
    ])
      if (
        alternatives.length < 3 &&
        !alternatives.includes(fallback) &&
        fallback !== correct.toLowerCase()
      )
        alternatives.push(fallback);
    const options = shuffle(
      [correct.toLowerCase(), ...alternatives],
      seed + 7,
    ).map((text, i) => ({ id: `o${i + 1}`, text }));
    const id = `q${index + 1}`;
    return {
      id,
      type: "choice",
      title: lesson.title,
      lessonId: lesson.id,
      lessonHref: lesson.href,
      marks: 1,
      prompt:
        "Complete the statement with the correct term.\n" +
        line.slice(0, word.index) +
        "______" +
        line.slice(word.index + correct.length),
      options,
      key: {
        correct: options.find((o) => o.text === correct.toLowerCase()).id,
        solution: [line],
      },
    };
  }
  function number(lesson, seed, index, rows) {
    const p = window.REVISION_SKILLS.build(lesson.skillKey, seed);
    if (!p) return null;
    const terms = p.title.toLowerCase().match(/[a-z]{4,}/g) || [];
    const ranked = rows
      .map((l) => ({
        l,
        score: terms.reduce(
          (n, t) =>
            n + (l.title.toLowerCase().includes(t.slice(0, -1)) ? 1 : 0),
          0,
        ),
      }))
      .sort((a, b) => b.score - a.score);
    const targets = {
      "gcse:c2": /empirical formulae/i,
      "gcse:c3": /concentration in g per/i,
      "gcse:c10": /analysis and purification of water/i,
      "gcse:p8": /red-shift/i,
      "alevel:biology:3.1": /^proteins$/i,
      "alevel:biology:3.2": /^cell structure$/i,
      "alevel:biology:3.5": /energy and ecosystems/i,
      "alevel:biology:3.6": /^homeostasis/i,
      "alevel:biology:3.8": /^gene technologies/i,
      "alevel:physics:mechanics-materials": /hooke/i,
      "alevel:physics:further-mechanics": /specific heat capacity/i,
      "alevel:physics:nuclear": /half-life/i,
    };
    lesson =
      rows.find((l) => targets[lesson.skillKey]?.test(l.title)) ||
      (ranked[0]?.score ? ranked[0].l : lesson);
    const tolerance =
      p.result === 0
        ? 1e-12
        : 0.51 * 10 ** (Math.floor(Math.log10(Math.abs(p.result))) - 2);
    return {
      id: `q${index + 1}`,
      type: "number",
      title: p.title,
      marks: 1,
      prompt: p.question + " Give the final answer to 3 significant figures.",
      unit: p.unit,
      lessonId: lesson.id,
      lessonHref: lesson.href,
      key: { value: p.result, tolerance, solution: p.steps },
    };
  }
  function written(lesson, seed, index) {
    const p = lesson.questions[seed % lesson.questions.length];
    return {
      id: `q${index + 1}`,
      type: "written",
      title: lesson.title,
      marks: Math.min(4, Math.max(2, p.answer.length)),
      prompt: p.question,
      lessonId: lesson.id,
      lessonHref: lesson.href,
      key: { solution: p.answer },
    };
  }
  function generate({
    level,
    subject,
    topic,
    pathway = "combined",
    kind = "quiz",
    count = 6,
    seed = 0,
    includeWritten = true,
    lessonIds,
  }) {
    const rows = shuffle(
      window.REVISION_PRACTICE.lessons.filter(
        (l) =>
          l.level === level &&
          l.subject === subject &&
          l.topic === topic &&
          (!lessonIds?.length || lessonIds.includes(l.id)) &&
          (level !== "gcse" || pathway === "triple" || l.scope !== "triple"),
      ),
      hash(`${seed}:${topic}`),
    );
    if (!rows.length) throw Error("Choose a topic with lessons.");
    if (
      !["quiz", "exam", "revision"].includes(kind) ||
      !Number.isInteger(count) ||
      count < 3 ||
      count > 15
    )
      throw Error("Choose 3–15 questions and a valid activity.");
    const questions = [];
    const used = new Set();
    for (let i = 0; i < count; i++) {
      let q = null;
      for (let retry = 0; retry < 100; retry++) {
        const l = rows[(i + retry) % rows.length],
          s = hash(`${seed}:${i}:${retry}`);
        q =
          kind === "exam"
            ? i % 3 === 0 && retry < 20
              ? number(l, s, i, rows)
              : includeWritten
                ? written(l, s, i)
                : choice(l, s, i)
            : kind === "revision" && i % 3 === 2 && retry < 20
              ? number(l, s, i, rows)
              : choice(l, s, i);
        if (q && !used.has(q.prompt)) break;
        q = null;
      }
      if (q) {
        used.add(q.prompt);
        const linked=rows.find(l=>l.id===q.lessonId);
        q.subject=subject;q.topic=topic;q.subtopic=q.title;q.skill=q.type==='number'?'calculation':q.type==='written'?'exam':'recall';q.specification='';q.misconception=linked?.accuracy||'';q.difficulty='standard';
        questions.push(q);
      }
    }
    if (questions.length < 3)
      throw Error(
        "This selection has too few distinct questions. Choose another topic.",
      );
    return {
      version: 1,
      level,
      subject,
      topic,
      topicTitle: rows[0].topicTitle,
      pathway,
      kind,
      questions,
    };
  }
  const total = (activity) =>
    activity.questions.reduce((sum, q) => sum + q.marks, 0);
  const publicQuestions = (activity) =>
    activity.questions.map(({ key, ...q }) => q);
  window.REVISION_ACTIVITIES = {
    topics,
    generate,
    total,
    publicQuestions,
    shuffle,
  };
})();
