/* Topic activities use reviewed lessons; assignment answer keys are stored privately. */
(() => {
  "use strict";
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
  function generate({level,subject,topic,pathway="combined",kind="quiz",count=6,seed=0,includeWritten=true,format="auto",demand="standard"}) {
    const H=globalThis.RevisionHomework,E=globalThis.RevisionEquations;
    const rows=window.REVISION_PRACTICE.lessons.filter(l=>l.level===level&&l.subject===subject&&l.topic===topic&&(level!=="gcse"||pathway==="triple"||l.scope!=="triple"));
    if(!rows.length)throw Error("Choose a topic with lessons.");
    if(!["quiz","exam","revision"].includes(kind)||!["auto","mixed","choice","cloze","written","calculation"].includes(format))throw Error("Choose a valid activity and question mix.");
    const equationPool=E.available({level,subject,topic,pathway});
    const extra=[];
    if(!equationPool.length&&(format==="mixed"||format==="calculation"||(format==="auto"&&kind!=="quiz")))for(let i=0;i<30;i++){const q=number(rows[i%rows.length],hash(seed+":"+i),i,rows);if(q)extra.push({id:"legacy:"+i,type:"calculation",prompt:q.prompt,model:q.key.solution.join("\n"),legacyActivity:q});}
    const calculations=equationPool.length||extra.length;
    const automatic=kind==="quiz"?["choice"]:["choice",...(calculations?["calculation"]:[]),...(kind==="exam"&&includeWritten?["written"]:[])];
    const formats=format==="auto"?automatic:format==="mixed"?["choice","cloze","written",...(calculations?["calculation"]:[])]:[format];
    const pack=H.build({v:1,l:level,s:subject,p:pathway,t:topic,n:count,d:demand,k:formats,z:hash(seed+":"+topic)},window.REVISION_PRACTICE.lessons,extra);
    const questions=pack.questions.map((q,i)=>{
      const id="q"+(i+1);
      if(q.legacyActivity)return {...q.legacyActivity,id};
      let lesson=q.source?rows.find(l=>l.href===q.source):null;
      if(!lesson){const words=q.topic.toLowerCase().match(/[a-z]{4,}/g)||[];lesson=[...rows].sort((a,b)=>words.reduce((n,w)=>n+(b.title.toLowerCase().includes(w.slice(0,-1))?1:0)-(a.title.toLowerCase().includes(w.slice(0,-1))?1:0),0))[0];}
      const common={id,title:q.topic,lessonId:lesson.id,lessonHref:lesson.href,prompt:q.prompt};
      if(q.type==="choice"){const options=q.options.map((text,j)=>({id:"o"+(j+1),text}));return {...common,type:"choice",marks:1,options,key:{correct:options.find(o=>o.text.toLowerCase()===q.expected.toLowerCase()).id,solution:[q.model]}};}
      if(q.type==="calculation"){const c=q.calculation,tolerance=c.expected===0?1e-12:0.51*10**(Math.floor(Math.log10(Math.abs(c.expected)))-2);return {...common,type:"number",marks:1,prompt:q.prompt+" Give the final answer to 3 significant figures.",unit:c.unit,key:{value:c.expected,tolerance,solution:c.steps}};}
      return {...common,type:"written",marks:q.type==="cloze"?1:Math.min(4,Math.max(2,q.model.split("\n").length)),prompt:q.type==="cloze"?"Complete the missing scientific word.\n"+q.prompt:q.prompt,key:{solution:q.model.split("\n")}};
    });
    return {version:1,level,subject,topic,topicTitle:rows[0].topicTitle,pathway,kind,questions};
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
