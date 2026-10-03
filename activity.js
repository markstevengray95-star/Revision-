(() => {
  "use strict";
  const client = globalThis.revisionSupabase,
    { el, lessonLink, percent } = window.REVISION_ACTIVITY_UI,
    $ = (id) => document.getElementById(id);
  const id = new URLSearchParams(location.search).get("assignment");
  let user,
    assignment,
    activity,
    attempts = [],
    answers = {},
    editing = false,
    teacher = false,
    feedback = {},
    dirty = false,
    savePromise = null,
    busy = false,
    timer,
    token,
    localKey;
  let studySeconds=0, questionTimes={}, lastInteraction=Date.now();
  for(const event of ['pointerdown','keydown','input'])document.addEventListener(event,()=>{lastInteraction=Date.now();});
  const studyTimer=setInterval(()=>{if(!editing||!sessionAlive||document.hidden||!document.hasFocus()||Date.now()-lastInteraction>60000||studySeconds>=43200)return;studySeconds++;const card=document.activeElement?.closest('[id^="question-"]');if(card){const key=card.id.slice(9);questionTimes[key]=(questionTimes[key]||0)+1;}},1000);
  window.addEventListener('pagehide',()=>clearInterval(studyTimer));
  async function recordStudy(){if(!editing||!sessionAlive)return;const r=await client.rpc('revision_record_study',{p_assignment_id:id,p_seconds:studySeconds,p_question_times:questionTimes});if(r.error)throw r.error;}
  let sessionAlive = true;
  const latest = () => attempts[attempts.length - 1] || null;
  const maySubmit = () =>
    !teacher &&
    assignment?.status === "active" &&
    attempts.length < activity?.attempts_limit &&
    (activity.allow_late || new Date(assignment.due_at) > new Date());
  function notice(text, error = false) {
    $("activity-notice").textContent = text;
    $("activity-notice").dataset.kind = error ? "error" : "success";
    $("activity-notice").hidden = false;
  }
  function unavailable(text) {
    $("activity-workspace").hidden = true;
    $("activity-unavailable").hidden = false;
    $("activity-error").textContent = text;
    $("activity-title").textContent = "Open your assigned work";
  }
  function remember() {
    try {
      localStorage.setItem(
        localKey,
        JSON.stringify({
          answers,
          updated: Date.now(),
          baseAttemptNo: latest()?.attempt_no || 0,
          token,
        }),
      );
    } catch {
      $("activity-save-state").textContent =
        "Device storage unavailable; save your draft online.";
    }
  }
  function readLocal() {
    try {
      const p = JSON.parse(localStorage.getItem(localKey) || "null");
      return p &&
        typeof p.answers === "object" &&
        !Array.isArray(p.answers) &&
        p.baseAttemptNo === (latest()?.attempt_no || 0)
        ? p
        : null;
    } catch {
      return null;
    }
  }
  function answered() {
    return activity.questions.filter(
      (q) => typeof answers[q.id] === "string" && answers[q.id].trim(),
    ).length;
  }
  function progress() {
    const count = answered();
    $("activity-progress").textContent =
      `${count} / ${activity.questions.length} answered · ${attempts.length} / ${activity.attempts_limit} attempts used`;
    $("activity-progress-bar").max = activity.questions.length;
    $("activity-progress-bar").value = count;
  }
  async function init() {
    if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
      unavailable("Choose an assignment from My Work.");
      return;
    }
    const { data, error } = await client.auth.getSession();
    if (error || !data?.session?.user) {
      unavailable(
        "Sign in to your student account in My Work, then open this assignment.",
      );
      return;
    }
    user = data.session.user;
    localKey = `revision-activity-draft:${user.id}:${id}`;
    $("activity-answer-form").addEventListener("submit", submit);
    $("activity-save").addEventListener("click", () => saveDraft());
    $("activity-retry").addEventListener("click", retry);
    $("activity-refresh").addEventListener("click", async () => {
      try {
        if (editing && dirty) await saveDraft(true);
        $("activity-notice").hidden = true;
        await load();
      } catch (e) {
        notice(e.message, true);
      }
    });
    $("activity-questions").addEventListener("input", (e) => {
      const q = e.target.dataset.questionId;
      if (!q || !editing || busy) return;
      answers[q] = e.target.value;
      dirty = true;
      remember();
      progress();
      $("activity-save-state").textContent = "Saving…";
      clearTimeout(timer);
      timer = setTimeout(() => saveDraft(), 800);
    });
    window.addEventListener("pagehide", () => {
      if (editing && dirty) remember();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && editing && dirty) saveDraft();
    });
    client.auth.onAuthStateChange((_e, s) => {
      if (!s?.user || s.user.id !== user.id) {
        sessionAlive = false;
        clearTimeout(timer);
        unavailable(
          "Your account changed. Open this assignment again from My Work.",
        );
      }
    });
    try {
      await load();
    } catch (e) {
      unavailable(e.message || "The activity could not be loaded.");
    }
  }
  async function load() {
    const [a, v, d, r] = await Promise.all([
      client.from("revision_assignments").select("*").eq("id", id),
      client.from("revision_activities").select("*").eq("assignment_id", id),
      client
        .from("revision_activity_drafts")
        .select("*")
        .eq("assignment_id", id)
        .eq("student_id", user.id),
      client
        .from("revision_activity_attempts")
        .select("*")
        .eq("assignment_id", id)
        .eq("student_id", user.id)
        .order("attempt_no"),
    ]);
    if (!sessionAlive) return;
    if (a.error || v.error || d.error || r.error)
      throw a.error || v.error || d.error || r.error;
    assignment = a.data?.[0];
    activity = v.data?.[0];
    if (!assignment || !activity)
      throw Error(
        "This activity is unavailable. Make sure you have joined the class with the correct account.",
      );
    teacher = activity.teacher_id === user.id;
    attempts = r.data || [];
    const draft = d.data?.[0],
      local = readLocal(),
      cloudRecent =
        draft &&
        (!latest() ||
          new Date(draft.updated_at) > new Date(latest().submitted_at));
    studySeconds=draft?.time_spent_seconds||0;questionTimes=draft?.question_times||{};
    editing =
      !teacher && maySubmit() && (!latest() || !!cloudRecent || !!local);
    answers = editing
      ? local &&
        (!draft || local.updated > new Date(draft.updated_at).getTime())
        ? local.answers
        : cloudRecent
          ? draft.answers
          : {}
      : latest()?.answers || {};
    answers = Object.fromEntries(
      activity.questions
        .filter((q) => typeof answers[q.id] === "string")
        .map((q) => [q.id, answers[q.id]]),
    );
    token = local?.token || crypto.randomUUID();
    dirty =
      editing &&
      !!local &&
      (!draft || local.updated > new Date(draft.updated_at).getTime());
    const f = await client.rpc("revision_activity_feedback", {
      p_assignment_id: id,
      p_attempt_id: latest()?.id || null,
    });
    if (!sessionAlive) return;
    if (f.error) throw f.error;
    feedback = f.data || {};
    render();
    if (dirty) saveDraft();
  }
  function render() {
    $("activity-unavailable").hidden = true;
    $("activity-workspace").hidden = false;
    $("activity-title").textContent = assignment.title;
    $("activity-meta").textContent =
      `${activity.topic_title} · ${activity.kind === "exam" ? "exam practice" : activity.kind}`;
    const date = new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(assignment.due_at));
    $("activity-description").textContent =
      `${assignment.instructions ? assignment.instructions + "\n" : ""}${activity.questions.length} questions · ${assignment.max_points} marks · Due ${date}${!activity.allow_late ? " · Late submissions disabled" : ""}${teacher ? " · Teacher preview" : ""}`;
    $("activity-save").hidden = !editing;
    $("activity-submit").hidden = !editing;
    $("activity-submit").disabled = busy;
    $("activity-retry").hidden = editing || !latest() || !maySubmit();
    $("activity-save-state").textContent = teacher
      ? "Teacher preview"
      : editing
        ? dirty
          ? "Saving…"
          : "Draft ready"
        : latest()
          ? "Submitted"
          : assignment.status === "closed"
            ? "Closed"
            : "Deadline passed";
    progress();
    renderPreparation();
    renderQuestions();
    renderResult();
  }
  function renderPreparation() {
    const box = $("activity-preparation");
    box.replaceChildren();
    box.hidden = activity.kind !== "revision" && assignment.activity_mode !== 'flashcards';
    if (box.hidden) return;
    box.append(
      el("strong", "Read, recall, then check"),
      el(
        "p",
        "Use the linked lessons to revise this topic. Complete the questions here when you are ready. Your question score measures the activity; opening a lesson does not prove mastery.",
      ),
    );
    (activity.study_material||[]).forEach(c=>{const card=el('details',undefined,'activity-question');card.append(el('summary',assignment.activity_mode==='flashcards'?c.title+' · Reveal card':c.title),el('p',c.text));box.append(card);});
    const seen = new Set();
    activity.questions.forEach((q) => {
      if (seen.has(q.lessonId)) return;
      seen.add(q.lessonId);
      const a = lessonLink(q);
      if (a) {
        a.textContent = q.title + " →";
        box.append(a);
      }
    });
  }
  function renderQuestions() {
    const target = $("activity-questions");
    target.replaceChildren();
    activity.questions.forEach((q, i) => {
      const card = el("article", undefined, "activity-question");
      card.id = `question-${q.id}`;
      const meta = el("div", undefined, "question-meta");
      meta.append(
        el(
          "span",
          `QUESTION ${i + 1} · ${q.type === "written" ? "Teacher reviewed" : q.type === "number" ? "Final answer automatically marked" : "Automatically marked"}`,
        ),
        el("span", `${q.marks} ${q.marks === 1 ? "mark" : "marks"}`),
      );
      const h = el("h3", q.prompt);
      h.id = `prompt-${q.id}`;
      card.append(meta, h);
      const figure = window.REVISION_ACTIVITY_UI.taskFigure(q);
      if (figure) card.append(figure);
      if (q.type === "choice") {
        const options = el("div", undefined, "question-options");
        options.setAttribute("role", "group");
        options.setAttribute("aria-labelledby", h.id);
        q.options.forEach((o) => {
          const label = el("label"),
            input = el("input");
          input.type = "radio";
          input.name = q.id;
          input.value = o.id;
          input.dataset.questionId = q.id;
          input.checked = answers[q.id] === o.id;
          input.disabled = !editing;
          input.required = true;
          label.append(input, el("span", o.text));
          options.append(label);
        });
        card.append(options);
      } else {
        const label = el(
          "label",
          q.type === "written" ? "Your answer" : "Your numerical answer",
          "revision-sr-only",
        );
        label.htmlFor = `answer-${q.id}`;
        const input = el(
          q.type === "written" ? "textarea" : "input",
          undefined,
          "activity-answer" +
            (q.type === "number" ? " activity-answer-number" : ""),
        );
        input.id = `answer-${q.id}`;
        input.dataset.questionId = q.id;
        input.value = answers[q.id] || "";
        input.disabled = !editing;
        input.required = true;
        input.maxLength = q.type === "written" ? 10000 : 40;
        input.setAttribute("aria-describedby", h.id);
        if (q.type === "written") input.rows = 5;
        else {
          input.type = "text";
          input.inputMode = "decimal";
          input.placeholder = "e.g. 1.25 or 1.25e-3";
        }
        card.append(label, input);
        if (q.unit) card.append(el("span", q.unit, "activity-unit"));
        if (q.type === "number")
          card.append(
            el(
              "p",
              "Enter the number only, without units. Use e for scientific notation.",
              "panel-copy",
            ),
          );
      }
      if (!editing && (latest() || teacher)) {
        const m = latest()?.marks.find((m) => m.id === q.id),
          box = el("div", undefined, "question-feedback");
        box.dataset.correct = String(m && m.awarded === m.max_marks);
        box.dataset.review = String(
          q.type === "written" && m?.awarded === null,
        );
        if (m)
          box.append(
            el(
              "strong",
              m.awarded === null
                ? "Awaiting teacher review"
                : `${m.awarded}/${m.max_marks} marks`,
            ),
          );
        if (feedback.released) {
          const solution = feedback.solutions?.[q.id]?.solution || [];
          const list = el("ol");
          solution.forEach((s) => list.append(el("li", s)));
          box.append(list);
        } else
          box.append(
            el(
              "p",
              activity.feedback_mode === "after_due"
                ? "Worked solutions will appear after the due date."
                : "Worked solutions will appear after your final allowed attempt.",
            ),
          );
        const a = lessonLink(q);
        if (a) box.append(a);
        card.append(box);
      }
      target.append(card);
    });
  }
  function renderResult() {
    const box = $("activity-result"),
      r = latest();
    box.replaceChildren();
    box.hidden = !r;
    if (!r) return;
    box.append(
      el(
        "h2",
        editing
          ? "Previous attempt"
          : r.review_state === "pending"
            ? "Submitted · written answers awaiting review"
            : "Your result",
      ),
    );
    box.append(
      el(
        "div",
        `${r.score} / ${r.total_max}${r.review_state === "pending" ? " so far" : ""}`,
        "activity-score",
      ),
    );
    box.append(
      el(
        "p",
        `Automatically marked: ${r.auto_score} / ${r.auto_max}.${r.review_state === "complete" ? ` Final score: ${percent(r.score, r.total_max)}%.` : " Your teacher will review the written responses before the score is final."}`,
      ),
    );
    if (r.feedback) box.append(el("p", "Teacher feedback: " + r.feedback));
    box.append(
      el(
        "p",
        `Attempt ${r.attempt_no} of ${activity.attempts_limit}${new Date(r.submitted_at) > new Date(assignment.due_at) ? " · Submitted late" : ""}. ${editing ? "Your next attempt is saved as a draft." : maySubmit() ? "You can revise and try again. Your latest attempt is the result shown to your teacher." : "Your submitted answers remain available here."}`,
      ),
    );
    if (attempts.length > 1) {
      const d = el("details");
      d.append(el("summary", "Attempt history"));
      attempts.forEach((a) =>
        d.append(
          el(
            "p",
            `Attempt ${a.attempt_no}: ${a.score}/${a.total_max} · ${a.review_state === "pending" ? "Awaiting review" : "Marked"} · ${new Date(a.submitted_at).toLocaleString()}`,
          ),
        ),
      );
      box.append(d);
    }
    const missed = activity.questions.filter((q) =>
      r.marks.some(
        (m) => m.id === q.id && m.awarded !== null && m.awarded < m.max_marks,
      ),
    );
    if (missed.length) {
      const links = el("div", undefined, "activity-recommendations");
      links.append(el("strong", "Focus your next revision"));
      const seen = new Set();
      missed.forEach((q) => {
        if (seen.has(q.lessonHref)) return;
        seen.add(q.lessonHref);
        const a = lessonLink(q);
        if (a) {
          a.textContent = q.title + " →";
          const p = el("p");
          p.append(a);
          links.append(p);
        }
      });
      box.append(links);
    }
  }
  async function saveDraft(throwOnError = false) {
    if (!editing || teacher || busy) return;
    if (savePromise) {
      await savePromise;
      if (dirty) return saveDraft(throwOnError);
      return;
    }
    if (!dirty) {
      $("activity-save-state").textContent = "Saved online";
      return;
    }
    clearTimeout(timer);
    const snapshot = JSON.stringify(answers);
    remember();
    $("activity-save-state").textContent = "Saving…";
    savePromise = (async () => {
      const { error } = await client.rpc("revision_save_activity_draft", {
        p_assignment_id: id,
        p_answers: JSON.parse(snapshot),
      });
      if (error) throw error;
      await recordStudy();
      if (JSON.stringify(answers) === snapshot) {
        dirty = false;
        try {
          localStorage.removeItem(localKey);
        } catch {}
      }
      $("activity-save-state").textContent = dirty ? "Saving…" : "Saved online";
    })()
      .catch((e) => {
        $("activity-save-state").textContent =
          "Saved on this device · retry online save";
        if (throwOnError) throw e;
      })
      .finally(() => {
        savePromise = null;
      });
    await savePromise;
  }
  async function submit(e) {
    e.preventDefault();
    if (!editing || busy) return;
    const form = $("activity-answer-form");
    if (!form.reportValidity()) return;
    for (const q of activity.questions) {
      if (
        q.type === "number" &&
        !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d{1,3})?$/i.test(
          (answers[q.id] || "").trim().replace(/−/g, "-"),
        )
      ) {
        notice("Enter a valid numerical answer without units.", true);
        $(`answer-${q.id}`).focus();
        return;
      }
    }
    clearTimeout(timer);
    try {
      if (savePromise) await savePromise;
      await saveDraft(true);
      busy = true;
      $("activity-submit").disabled = true;
      $("activity-questions")
        .querySelectorAll("input,textarea")
        .forEach((n) => (n.disabled = true));
      remember();
      await recordStudy();
      const { data, error } = await client.rpc("revision_submit_activity", {
        p_assignment_id: id,
        p_answers: answers,
        p_submission_token: token,
      });
      if (error) throw error;
      try {
        localStorage.removeItem(localKey);
      } catch {}
      dirty = false;
      editing = false;
      notice(
        data.review_state === "pending"
          ? "Submitted. Objective answers are marked; your teacher will review written responses."
          : "Submitted and automatically marked.",
      );
      await load();
      $("activity-result").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } catch (error) {
      notice(
        error.message ||
          "Submission failed. Your draft is still saved on this device.",
        true,
      );
    } finally {
      busy = false;
      $("activity-submit").disabled = false;
      if (editing)
        $("activity-questions")
          .querySelectorAll("input,textarea")
          .forEach((n) => (n.disabled = false));
    }
  }
  function retry() {
    if (!maySubmit() || busy) return;
    answers = {};
    studySeconds=0;questionTimes={};
    editing = true;
    token = crypto.randomUUID();
    dirty = true;
    remember();
    render();
    saveDraft();
    $("activity-topbar").scrollIntoView({ block: "start", behavior: "smooth" });
  }
  init();
})();
