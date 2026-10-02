(() => {
  "use strict";
  const ui = window.REVISION_ACTIVITY_UI;
  const { el, button, downloadCSV, percent } = ui;
  const bank = window.REVISION_ACTIVITIES,
    $ = (id) => document.getElementById(id);
  let context,
    preview = null,
    seed = 0,
    lastSuggestedTitle = "";
  function invalidate() {
    preview = null;
    $("activity-preview").replaceChildren();
    $("activity-preview-summary").textContent =
      "Selection changed. Generate a fresh preview before assigning.";
  }
  function refreshTopics() {
    const previous = $("activity-topic").value;
    const list = bank.topics(
      $("activity-level").value,
      $("activity-subject").value,
      $("activity-pathway").value,
    );
    $("activity-topic").replaceChildren(
      ...list.map((t) => new Option(t.title, t.id)),
    );
    if (list.some((t) => t.id === previous))
      $("activity-topic").value = previous;
    $("activity-pathway-label").hidden = $("activity-level").value !== "gcse";
    invalidate();
  }
  function matchClass() {
    const c = context.state.classes.find(
      (c) => c.id === $("assignment-class").value,
    );
    if (!c) return;
    $("activity-level").value = c.level === "A-level" ? "alevel" : "gcse";
    const subject = c.subject.toLowerCase();
    if (["biology", "chemistry", "physics"].includes(subject))
      $("activity-subject").value = subject;
    refreshTopics();
  }
  function init(api) {
    context = api;
    refreshTopics();
    for (const id of ["activity-level", "activity-subject", "activity-pathway"])
      $(id).addEventListener("change", refreshTopics);
    for (const id of [
      "activity-topic",
      "activity-kind",
      "activity-count",
      "activity-writing",
      "activity-format",
      "activity-demand",
    ])
      $(id).addEventListener("change", () => {
        invalidate();
        if (id === "activity-kind" || id === "activity-format") {
          $("activity-writing-label").hidden =
            $("activity-kind").value !== "exam" || $("activity-format").value !== "auto";
          $("assignment-type").value =
            $("activity-kind").value === "exam"
              ? "test"
              : $("activity-kind").value === "revision"
                ? "revision"
                : "homework";
        }
      });
    $("assignment-class").addEventListener("change", matchClass);
    $("activity-generate").addEventListener("click", generate);
    $("custom-type").addEventListener("change", () => {
      $("custom-options-label").hidden = $("custom-type").value !== "choice";
      $("custom-number-fields").hidden = $("custom-type").value !== "number";
      $("custom-marks").value =
        $("custom-type").value === "written" ? "3" : "1";
    });
    $("custom-add").addEventListener("click", addCustom);
    $("activity-preview").addEventListener("click", (e) => {
      const b = e.target.closest('[data-action="remove-preview"]');
      if (!b || !preview) return;
      preview.questions = preview.questions.filter(
        (q) => q.id !== b.dataset.id,
      );
      renderPreview();
    });
  }
  function generate() {
    try {
      preview = bank.generate({
        level: $("activity-level").value,
        subject: $("activity-subject").value,
        topic: $("activity-topic").value,
        pathway: $("activity-pathway").value,
        kind: $("activity-kind").value,
        count: Number($("activity-count").value),
        seed: ++seed,
        includeWritten: $("activity-writing").checked,
        format: $("activity-format").value,
        demand: $("activity-demand").value,
      });
      renderPreview();
      if (
        !$("assignment-title").value.trim() ||
        $("assignment-title").value === lastSuggestedTitle
      )
        $("assignment-title").value = lastSuggestedTitle =
          `${preview.topicTitle} · ${$("assignment-type").value === "homework" ? "homework" : preview.kind === "exam" ? "exam practice" : preview.kind}`.slice(
            0,
            120,
          );
    } catch (e) {
      preview = null;
      $("activity-preview").replaceChildren();
      $("activity-preview-summary").textContent = e.message;
      context.showNotice(e.message, "error");
    }
  }
  function renderPreview() {
    const target = $("activity-preview");
    target.replaceChildren();
    if (!preview) return;
    const auto = preview.questions.filter((q) => q.type !== "written");
    $("activity-preview-summary").textContent =
      `${preview.questions.length} questions · ${bank.total(preview)} marks · ${auto.length} automatically marked · ${preview.questions.length - auto.length} written responses for teacher review. Check the wording and answers before assigning.`;
    preview.questions.forEach((q, i) => {
      const card = el("article", undefined, "activity-question");
      const head = el("div", undefined, "activity-preview-header");
      head.append(
        el(
          "span",
          `${i + 1}. ${q.type} · ${q.marks} ${q.marks === 1 ? "mark" : "marks"}`,
          "question-meta",
        ),
        button("Remove", "remove-preview", q.id),
      );
      card.append(head, el("h3", q.prompt));
      if (q.type === "choice") {
        const list = el("ol");
        q.options.forEach((o) =>
          list.append(el("li", o.text + (o.id === q.key.correct ? " ✓" : ""))),
        );
        card.append(list);
      }
      if (q.type === "number")
        card.append(
          el(
            "p",
            `Expected: ${window.REVISION_SKILLS.format(q.key.value)} ${q.unit || ""} · tolerance ±${window.REVISION_SKILLS.format(q.key.tolerance)}`,
          ),
        );
      const details = el("details"),
        summary = el("summary", "Solution / mark scheme"),
        list = el("ol");
      q.key.solution.forEach((p) => list.append(el("li", p)));
      details.append(summary, list);
      card.append(details);
      target.append(card);
    });
  }
  function addCustom() {
    try {
      if (!preview) throw Error("Generate a topic preview first.");
      if (preview.questions.length >= 60)
        throw Error("Use at most 60 questions.");
      const type = $("custom-type").value,
        prompt = $("custom-prompt").value.trim(),
        marks = Number($("custom-marks").value),
        solution = $("custom-solution")
          .value.trim()
          .split(/\n+/)
          .filter(Boolean);
      if (
        prompt.length < 3 ||
        !solution.length ||
        marks < 0.5 ||
        marks > 10 ||
        marks % 0.5
      )
        throw Error("Add a question, solution and valid marks.");
      const q = {
        id: "custom_" + crypto.randomUUID().slice(0, 8),
        type,
        prompt,
        marks,
        title: "Teacher question",
        options: [],
        key: { solution },
      };
      if (type === "choice") {
        const values = $("custom-options")
          .value.trim()
          .split(/\n+/)
          .map((v) => v.trim())
          .filter(Boolean);
        if (
          values.length < 2 ||
          values.length > 6 ||
          new Set(values.map((v) => v.toLowerCase())).size !== values.length
        )
          throw Error(
            "Provide 2–6 distinct options, with the correct answer first.",
          );
        q.options = bank.shuffle(
          values.map((text, i) => ({ id: `o${i + 1}`, text })),
          seed++,
        );
        q.key.correct = "o1";
      }
      if (type === "number") {
        const value = window.REVISION_SKILLS.parseNumber(
            $("custom-value").value,
          ),
          tolerance = window.REVISION_SKILLS.parseNumber(
            $("custom-tolerance").value,
          );
        if (
          !Number.isFinite(value) ||
          !Number.isFinite(tolerance) ||
          tolerance < 0
        )
          throw Error(
            "Enter an expected number and non-negative absolute tolerance.",
          );
        q.key = { ...q.key, value, tolerance };
        q.unit = $("custom-unit").value.trim();
      }
      preview.questions.push(q);
      renderPreview();
      $("custom-prompt").value = "";
      $("custom-solution").value = "";
      context.showNotice("Custom question added to the preview.");
    } catch (e) {
      context.showNotice(e.message, "error");
    }
  }
  async function create(meta) {
    if (!preview || !preview.questions.length)
      throw Error("Generate and check a question preview before assigning.");
    const p_activity = {
      ...preview,
      attempts_limit: Number($("activity-attempts").value),
      feedback_mode: $("activity-feedback").value,
      allow_late: $("activity-late").checked,
    };
    const result = await globalThis.revisionSupabase.rpc(
      "revision_assign_activity",
      { p_assignment: meta, p_activity },
    );
    if (result.error) throw result.error;
    return result.data;
  }
  function reset() {
    preview = null;
    lastSuggestedTitle = "";
    $("activity-writing-label").hidden = true;
    matchClass();
  }
  function activityFor(id) {
    return context.state.activities.find((a) => a.assignment_id === id);
  }
  function attemptsFor(id) {
    return context.state.attempts
      .filter((a) => a.assignment_id === id)
      .sort((a, b) => b.attempt_no - a.attempt_no);
  }
  function latestFor(id) {
    return [
      ...new Map(
        attemptsFor(id)
          .map((a) => [a.student_id, a])
          .reverse(),
      ).values(),
    ];
  }
  function renderResults(assignment) {
    const activity = activityFor(assignment.id),
      all = attemptsFor(assignment.id),
      latest = latestFor(assignment.id),
      wrap = el("div", undefined, "activity-submission");
    wrap.append(
      el(
        "p",
        `${activity.topic_title} · ${activity.kind} · ${activity.questions.length} questions · ${activity.attempts_limit} allowed ${activity.attempts_limit === 1 ? "attempt" : "attempts"}`,
        "assignment-details",
      ),
    );
    const joined = context.state.members.filter(
      (m) => m.class_id === assignment.class_id && m.status === "joined",
    );
    const strip = el("div", undefined, "activity-stat-strip");
    const complete = latest.filter((a) => a.review_state === "complete");
    const average = complete.length
      ? Math.round(
          complete.reduce((sum, a) => sum + percent(a.score, a.total_max), 0) /
            complete.length,
        )
      : null;
    strip.append(
      el("span", `${latest.length}/${joined.length} submitted`),
      el(
        "span",
        `${latest.filter((a) => a.review_state === "pending").length} awaiting review`,
      ),
      el(
        "span",
        average === null
          ? "Class average: pending"
          : `Class average: ${average}%`,
      ),
    );
    wrap.append(strip);
    const missing = joined.filter(
      (m) => !latest.some((a) => a.student_id === m.student_id),
    );
    if (missing.length)
      wrap.append(
        el(
          "p",
          "Not submitted: " +
            missing
              .map((m) => m.display_name || m.student_email || "Student")
              .join(", "),
          "activity-missing",
        ),
      );
    const weak = activity.questions
      .map((q) => ({
        q,
        miss: latest.filter((a) =>
          a.marks.some(
            (m) =>
              m.id === q.id && m.awarded !== null && m.awarded < m.max_marks,
          ),
        ).length,
      }))
      .filter((x) => x.miss)
      .sort((a, b) => b.miss - a.miss)
      .slice(0, 3);
    if (weak.length) {
      const gaps = el("details");
      gaps.append(el("summary", "Questions to revisit"));
      weak.forEach((x) => {
        gaps.append(
          el(
            "p",
            `${x.miss} of ${latest.length} students lost marks: ${x.q.prompt}`,
            "assignment-notes",
          ),
        );
        const l = ui.lessonLink(x.q);
        if (l) gaps.append(l);
      });
      wrap.append(gaps);
    }
    latest.forEach((attempt) => {
      const member = joined.find((m) => m.student_id === attempt.student_id),
        details = el("details", undefined, "submission-row");
      details.dataset.attemptId = attempt.id;
      const summary = el(
        "summary",
        `${member?.display_name || member?.student_email || "Student"} · ${attempt.score}/${attempt.total_max}${attempt.review_state === "pending" ? " so far · needs review" : ""} · attempt ${attempt.attempt_no}`,
      );
      details.append(summary);
      const history = all
        .filter((a) => a.student_id === attempt.student_id)
        .sort((a, b) => a.attempt_no - b.attempt_no);
      details.append(
        el(
          "p",
          "Attempts: " +
            history
              .map(
                (a) =>
                  `${a.attempt_no}: ${a.score}/${a.total_max}${a.review_state === "pending" ? " pending" : ""}`,
              )
              .join(" · "),
          "assignment-details",
        ),
      );
      const body = el("div", undefined, "activity-review-body");
      body.dataset.assignmentId = assignment.id;
      body.dataset.attemptId = attempt.id;
      activity.questions.forEach((q) => {
        const mark = attempt.marks.find((m) => m.id === q.id),
          row = el("div", undefined, "activity-review-item");
        row.append(el("h4", q.prompt));
        let answer = attempt.answers[q.id];
        if (q.type === "choice")
          answer = q.options.find((o) => o.id === answer)?.text || answer;
        row.append(el("p", "Student answer: " + answer));
        row.append(
          el(
            "p",
            q.type === "written"
              ? "Teacher review"
              : `Automatically marked: ${mark?.awarded ?? 0}/${q.marks}`,
          ),
        );
        if (q.type === "written") {
          const label = el("label", "Marks: "),
            input = el(
              "input",
              undefined,
              "activity-answer activity-review-score",
            );
          input.type = "number";
          input.min = 0;
          input.max = q.marks;
          input.step = 0.5;
          input.dataset.questionId = q.id;
          input.setAttribute("aria-label", `Marks for ${q.title || q.id}`);
          input.value = mark?.awarded ?? "";
          label.append(input, el("span", ` / ${q.marks}`));
          row.append(label);
        }
        const scheme = el("div", undefined, "activity-mark-scheme");
        scheme.dataset.questionId = q.id;
        row.append(scheme);
        body.append(row);
      });
      const feedback = el(
        "textarea",
        undefined,
        "activity-answer activity-review-feedback",
      );
      feedback.rows = 2;
      feedback.maxLength = 4000;
      feedback.placeholder = "Feedback for this attempt";
      feedback.setAttribute("aria-label", "Teacher feedback");
      feedback.value = attempt.feedback || "";
      body.append(
        feedback,
        button(
          "Save review & feedback",
          "review-activity",
          attempt.id,
          "teacher-button",
        ),
      );
      details.append(body);
      details.addEventListener("toggle", async () => {
        if (!details.open || details.dataset.loaded) return;
        const { data, error } = await globalThis.revisionSupabase.rpc(
          "revision_activity_feedback",
          { p_assignment_id: assignment.id, p_attempt_id: attempt.id },
        );
        if (error) {
          context.showNotice(error.message, "error");
          return;
        }
        details.dataset.loaded = "true";
        body.querySelectorAll(".activity-mark-scheme").forEach((node) => {
          const parts =
            data.solutions?.[node.dataset.questionId]?.solution || [];
          const d = el("details"),
            s = el("summary", "Solution / mark scheme"),
            ol = el("ol");
          parts.forEach((p) => ol.append(el("li", p)));
          d.append(s, ol);
          node.append(d);
        });
      });
      wrap.append(details);
    });
    return wrap;
  }
  async function review(id, node) {
    const body = node.closest(".activity-review-body");
    if (!body) return;
    const marks = {};
    for (const input of body.querySelectorAll(
      "[data-question-id].activity-review-score",
    )) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
      marks[input.dataset.questionId] =
        input.value === "" ? null : Number(input.value);
    }
    node.disabled = true;
    try {
      const { error } = await globalThis.revisionSupabase.rpc(
        "revision_review_activity",
        {
          p_attempt_id: id,
          p_marks: marks,
          p_feedback: body.querySelector(".activity-review-feedback").value,
        },
      );
      if (error) throw error;
      context.showNotice(
        "Review saved. The student can see their updated result.",
      );
      await context.loadTeacherData(false);
    } catch (e) {
      context.showNotice(e.message, "error");
    } finally {
      node.disabled = false;
    }
  }
  async function duplicate(id, due) {
    const { error } = await globalThis.revisionSupabase.rpc(
      "revision_duplicate_activity",
      { p_assignment_id: id, p_due_at: due },
    );
    if (error) throw error;
  }
  function exportResults(assignment) {
    const latest = latestFor(assignment.id),
      members = context.state.members.filter(
        (m) => m.class_id === assignment.class_id && m.status === "joined",
      );
    const rows = [
      [
        "Student",
        "Email",
        "Assignment",
        "Topic",
        "Status",
        "Score",
        "Maximum",
        "Percent",
        "Attempts",
        "Submitted",
        "Late",
        "Feedback",
      ],
    ];
    members.forEach((m) => {
      const a = latest.find((a) => a.student_id === m.student_id);
      rows.push([
        m.display_name,
        m.student_email,
        assignment.title,
        activityFor(assignment.id).topic_title,
        a
          ? a.review_state === "complete"
            ? "Marked"
            : "Needs review"
          : "Not submitted",
        a?.score ?? "",
        assignment.max_points,
        a?.review_state === "complete" ? percent(a.score, a.total_max) : "",
        a?.attempt_no ?? 0,
        a?.submitted_at ?? "",
        a ? new Date(a.submitted_at) > new Date(assignment.due_at) : "",
        a?.feedback ?? "",
      ]);
    });
    downloadCSV("revision-results-" + assignment.id.slice(0, 8) + ".csv", rows);
  }
  window.REVISION_TEACHER_ACTIVITIES = {
    init,
    matchClass,
    create,
    reset,
    renderResults,
    review,
    duplicate,
    exportResults,
  };
})();
