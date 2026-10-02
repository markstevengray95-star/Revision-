(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const STORAGE_KEY = "revision-teacher-view-v2";
  const PRESETS = [
    { id: "exit", name: "Exit ticket", detail: "3 quick auto-marked questions", kind: "quiz", count: 3, writing: false, attempts: 1, feedback: "after_final_attempt" },
    { id: "retrieval", name: "Retrieval starter", detail: "5 short recall questions", kind: "quiz", count: 5, writing: false, attempts: 2, feedback: "after_final_attempt" },
    { id: "check", name: "Knowledge check", detail: "8 auto-marked topic questions", kind: "quiz", count: 8, writing: false, attempts: 2, feedback: "after_final_attempt" },
    { id: "mixed", name: "Mixed revision", detail: "10 recall and calculation questions", kind: "revision", count: 10, writing: false, attempts: 3, feedback: "immediate" },
    { id: "skills", name: "Calculation + recall", detail: "12 mixed skills questions", kind: "revision", count: 12, writing: false, attempts: 3, feedback: "immediate" },
    { id: "exam", name: "Exam practice", detail: "6 exam-style questions with written responses", kind: "exam", count: 6, writing: true, attempts: 1, feedback: "after_due" },
    { id: "topic-test", name: "Topic test", detail: "12-question assessed task", kind: "exam", count: 12, writing: true, attempts: 1, feedback: "after_due" },
    { id: "assessment", name: "Full topic assessment", detail: "15-question mixed assessment", kind: "exam", count: 15, writing: true, attempts: 1, feedback: "after_due" },
  ];

  const monitor = {
    userId: null,
    classes: [],
    members: [],
    assignments: [],
    submissions: [],
    activities: [],
    attempts: [],
    loading: false,
    request: 0,
  };

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function button(text, className = "teacher-button") {
    const node = el("button", className, text);
    node.type = "button";
    return node;
  }

  function percent(value, total) {
    const n = Number(value), d = Number(total);
    return Number.isFinite(n) && Number.isFinite(d) && d > 0 ? Math.round((n / d) * 100) : null;
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" }).format(date);
  }

  function setupWorkspace() {
    const app = $("teacher-app");
    if (!app || app.dataset.simpleLayout === "true") return;
    const oldLayout = app.querySelector(".teacher-layout");
    if (!oldLayout) return;

    const columns = [...oldLayout.children].filter((node) => node.classList.contains("teacher-column"));
    const classListPanel = $("class-list")?.closest(".teacher-panel");
    const assignmentPanel = $("assignment-list")?.closest(".teacher-panel");
    const syncPanel = app.querySelector(".compact-panel");
    const metrics = app.querySelector(".metrics-grid");
    const account = app.querySelector(".account-strip");

    const nav = el("nav", "teacher-view-nav");
    nav.setAttribute("aria-label", "Teacher dashboard sections");
    const names = [
      ["overview", "Overview"],
      ["set-work", "Set work"],
      ["classes", "Classes"],
      ["monitor", "Monitor"],
    ];
    const views = {};
    names.forEach(([id, label]) => {
      const b = button(label, "teacher-view-button");
      b.dataset.view = id;
      b.setAttribute("aria-controls", `teacher-view-${id}`);
      nav.append(b);
      const view = el("section", "teacher-view");
      view.id = `teacher-view-${id}`;
      view.dataset.viewPanel = id;
      view.hidden = true;
      views[id] = view;
    });

    account?.after(nav, views.overview, views["set-work"], views.classes, views.monitor);
    if (metrics) views.overview.append(metrics);
    views.overview.append(buildQuickActions());
    if (syncPanel) views.overview.append(syncPanel);
    if ($("new-class")) views.classes.append($("new-class"));
    if (classListPanel) views.classes.append(classListPanel);
    if ($("class-detail-panel")) views.classes.append($("class-detail-panel"));
    views["set-work"].append(buildPresetPanel());
    if ($("assign-work")) views["set-work"].append($("assign-work"));
    views.monitor.append(buildMonitoringPanel());
    if (assignmentPanel) views.monitor.append(assignmentPanel);
    oldLayout.remove();

    nav.addEventListener("click", (event) => {
      const target = event.target.closest("[data-view]");
      if (!target) return;
      openView(target.dataset.view, true);
    });
    app.addEventListener("click", (event) => {
      const target = event.target.closest("[data-open-teacher-view]");
      if (!target) return;
      openView(target.dataset.openTeacherView, true);
    });

    app.dataset.simpleLayout = "true";
    let saved = "overview";
    try {
      saved = localStorage.getItem(STORAGE_KEY) || "overview";
    } catch {}
    if (!views[saved]) saved = "overview";
    openView(saved, false);
    simplifyActivityOptions();
  }

  function openView(id, remember) {
    const app = $("teacher-app");
    if (!app) return;
    app.querySelectorAll("[data-view-panel]").forEach((view) => {
      view.hidden = view.dataset.viewPanel !== id;
    });
    app.querySelectorAll(".teacher-view-button").forEach((tab) => {
      const selected = tab.dataset.view === id;
      tab.dataset.active = selected ? "true" : "false";
      tab.setAttribute("aria-current", selected ? "page" : "false");
    });
    if (remember) {
      try { localStorage.setItem(STORAGE_KEY, id); } catch {}
    }
    if (id === "monitor" && monitor.userId) void loadMonitoring(monitor.userId, false);
    const nav = app.querySelector(".teacher-view-nav");
    if (nav && remember) nav.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function buildQuickActions() {
    const panel = el("section", "teacher-panel teacher-quick-panel");
    const head = el("div", "panel-heading");
    const copy = el("div");
    copy.append(el("span", "teacher-eyebrow", "QUICK ACTIONS"), el("h2", undefined, "What do you want to do?"));
    head.append(copy);
    panel.append(head);
    const grid = el("div", "teacher-quick-grid");
    [
      ["set-work", "Set an activity", "Choose a topic and assign questions."],
      ["monitor", "Check progress", "See completion, scores and missing work."],
      ["classes", "Manage classes", "Add students or copy a class code."],
    ].forEach(([view, title, detail]) => {
      const b = button("", "teacher-quick-action");
      b.dataset.openTeacherView = view;
      b.append(el("strong", undefined, title), el("span", undefined, detail));
      grid.append(b);
    });
    panel.append(grid);
    return panel;
  }

  function buildPresetPanel() {
    const panel = el("section", "teacher-panel teacher-preset-panel");
    const heading = el("div", "panel-heading");
    const copy = el("div");
    copy.append(el("span", "teacher-eyebrow", "ACTIVITY LIBRARY"), el("h2", undefined, "Choose a ready-made activity"));
    heading.append(copy);
    panel.append(heading, el("p", "panel-copy", "Pick a format, then choose the class and topic below. Press Generate again whenever you want a different version of the questions."));
    const grid = el("div", "teacher-preset-grid");
    PRESETS.forEach((preset) => {
      const b = button("", "teacher-preset");
      b.dataset.preset = preset.id;
      b.append(el("strong", undefined, preset.name), el("span", undefined, preset.detail));
      b.addEventListener("click", () => applyPreset(preset, b));
      grid.append(b);
    });
    panel.append(grid);
    return panel;
  }

  function applyPreset(preset, node) {
    const kind = $("activity-kind"), count = $("activity-count"), writing = $("activity-writing"), attempts = $("activity-attempts"), feedback = $("activity-feedback");
    if (!kind || !count) return;
    kind.value = preset.kind;
    count.value = String(preset.count);
    if (writing) writing.checked = preset.writing;
    if (attempts) attempts.value = String(preset.attempts);
    if (feedback) feedback.value = preset.feedback;
    kind.dispatchEvent(new Event("change", { bubbles: true }));
    count.dispatchEvent(new Event("change", { bubbles: true }));
    writing?.dispatchEvent(new Event("change", { bubbles: true }));
    document.querySelectorAll(".teacher-preset").forEach((b) => b.dataset.selected = "false");
    node.dataset.selected = "true";
    $("activity-topic")?.focus({ preventScroll: true });
  }

  function simplifyActivityOptions() {
    const builder = document.querySelector(".activity-builder");
    if (!builder || builder.dataset.simpleOptions === "true") return;
    const attempts = $("activity-attempts")?.closest("label");
    const feedback = $("activity-feedback")?.closest("label");
    const late = $("activity-late")?.closest("label");
    if (attempts && feedback && late) {
      const oldGrid = attempts.parentElement;
      const details = el("details", "simple-advanced");
      details.append(el("summary", undefined, "Optional settings"));
      const grid = el("div", "simple-advanced-grid");
      grid.append(attempts, feedback, late);
      details.append(grid);
      const generate = $("activity-generate");
      if (generate) generate.before(details);
      if (oldGrid && !oldGrid.children.length) oldGrid.remove();
    }
    const typeLabel = $("assignment-type")?.closest("label");
    if (typeLabel) typeLabel.classList.add("simple-secondary-field");
    builder.dataset.simpleOptions = "true";
  }

  function buildMonitoringPanel() {
    const panel = el("section", "teacher-panel teacher-monitor-panel");
    const heading = el("div", "panel-heading teacher-monitor-heading");
    const copy = el("div");
    copy.append(el("span", "teacher-eyebrow", "CLASS MONITORING"), el("h2", undefined, "Progress at a glance"));
    const controls = el("div", "teacher-monitor-controls");
    const select = el("select");
    select.id = "monitor-class";
    select.setAttribute("aria-label", "Class to monitor");
    select.append(new Option("All classes", "all"));
    const refresh = button("Refresh", "teacher-button");
    refresh.id = "monitor-refresh";
    controls.append(select, refresh);
    heading.append(copy, controls);
    panel.append(heading, el("p", "panel-copy", "Completion combines assigned activities and submitted work. Scores use marked work and completed automatically marked activities."));

    const status = el("p", "monitor-status", "Sign in to see class monitoring.");
    status.id = "monitor-status";
    panel.append(status);

    const summary = el("div", "monitor-summary");
    summary.id = "monitor-summary";
    panel.append(summary);

    const split = el("div", "monitor-split");
    const attention = el("section", "monitor-box");
    attention.append(el("h3", undefined, "Needs attention"));
    const attentionList = el("div", "monitor-list");
    attentionList.id = "monitor-attention";
    attention.append(attentionList);
    const topics = el("section", "monitor-box");
    topics.append(el("h3", undefined, "Topics to revisit"));
    const topicList = el("div", "monitor-list");
    topicList.id = "monitor-topics";
    topics.append(topicList);
    split.append(attention, topics);
    panel.append(split);

    const tableBox = el("div", "monitor-table-wrap");
    const table = el("table", "monitor-table");
    table.id = "monitor-table";
    const thead = el("thead");
    const tr = el("tr");
    ["Student", "Class", "Completed", "Average", "Overdue", "Last work"].forEach((label) => tr.append(el("th", undefined, label)));
    thead.append(tr);
    table.append(thead, el("tbody"));
    tableBox.append(table);
    panel.append(tableBox);
    return panel;
  }

  async function initMonitoring() {
    const client = globalThis.revisionSupabase;
    if (!client) return;
    $("monitor-class")?.addEventListener("change", renderMonitoring);
    $("monitor-refresh")?.addEventListener("click", () => monitor.userId && loadMonitoring(monitor.userId, true));
    $("refresh-data")?.addEventListener("click", () => monitor.userId && loadMonitoring(monitor.userId, false));
    client.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        monitor.userId = session.user.id;
        void loadMonitoring(session.user.id, false);
      } else {
        resetMonitoring();
      }
    });
    const { data } = await client.auth.getSession();
    if (data?.session?.user) {
      monitor.userId = data.session.user.id;
      await loadMonitoring(data.session.user.id, false);
    }
  }

  function resetMonitoring() {
    monitor.userId = null;
    monitor.classes = [];
    monitor.members = [];
    monitor.assignments = [];
    monitor.submissions = [];
    monitor.activities = [];
    monitor.attempts = [];
    renderMonitoring();
  }

  async function loadMonitoring(userId, announce) {
    const client = globalThis.revisionSupabase;
    if (!client || !userId || monitor.loading) return;
    const request = ++monitor.request;
    monitor.loading = true;
    const status = $("monitor-status");
    if (status) status.textContent = "Refreshing progress…";
    try {
      const classesResult = await client.from("revision_classes").select("*").eq("teacher_id", userId).eq("archived", false).order("created_at", { ascending: true });
      if (request !== monitor.request) return;
      if (classesResult.error) throw classesResult.error;
      monitor.classes = classesResult.data || [];
      const ids = monitor.classes.map((row) => row.id);
      if (!ids.length) {
        monitor.members = [];
        monitor.assignments = [];
        monitor.submissions = [];
        monitor.activities = [];
        monitor.attempts = [];
      } else {
        const [members, assignments, submissions, activities, attempts] = await Promise.all([
          client.from("revision_class_members").select("*").in("class_id", ids).eq("status", "joined").order("display_name", { ascending: true }),
          client.from("revision_assignments").select("*").in("class_id", ids).order("due_at", { ascending: true }),
          client.from("revision_submissions").select("*").in("class_id", ids).order("submitted_at", { ascending: false }),
          client.from("revision_activities").select("*").in("class_id", ids),
          client.from("revision_activity_attempts").select("*").in("class_id", ids).order("submitted_at", { ascending: false }),
        ]);
        const error = members.error || assignments.error || submissions.error || activities.error || attempts.error;
        if (error) throw error;
        monitor.members = members.data || [];
        monitor.assignments = assignments.data || [];
        monitor.submissions = submissions.data || [];
        monitor.activities = activities.data || [];
        monitor.attempts = attempts.data || [];
      }
      populateMonitorClasses();
      renderMonitoring();
      if (announce && status) status.textContent = "Progress refreshed.";
    } catch (error) {
      if (status) status.textContent = error?.message || "Could not load monitoring data.";
    } finally {
      if (request === monitor.request) monitor.loading = false;
    }
  }

  function populateMonitorClasses() {
    const select = $("monitor-class");
    if (!select) return;
    const previous = select.value || "all";
    select.replaceChildren(new Option("All classes", "all"));
    monitor.classes.forEach((group) => select.append(new Option(group.name, group.id)));
    select.value = previous === "all" || monitor.classes.some((group) => group.id === previous) ? previous : "all";
  }

  function assignmentResult(assignment, studentId) {
    const activity = monitor.activities.find((row) => row.assignment_id === assignment.id);
    if (activity) {
      const attempts = monitor.attempts.filter((row) => row.assignment_id === assignment.id && row.student_id === studentId).sort((a, b) => Number(b.attempt_no) - Number(a.attempt_no));
      const latest = attempts[0] || null;
      return {
        submitted: Boolean(latest),
        pending: latest?.review_state === "pending",
        pct: latest?.review_state === "complete" ? percent(latest.score, latest.total_max) : null,
        at: latest?.submitted_at || null,
      };
    }
    const submission = monitor.submissions.find((row) => row.assignment_id === assignment.id && row.student_id === studentId) || null;
    return {
      submitted: Boolean(submission),
      pending: Boolean(submission && !submission.marked_at),
      pct: submission && submission.score !== null && assignment.max_points ? percent(submission.score, assignment.max_points) : null,
      at: submission?.submitted_at || null,
    };
  }

  function studentRows(classId) {
    const members = monitor.members.filter((member) => classId === "all" || member.class_id === classId);
    const now = Date.now();
    return members.map((member) => {
      const group = monitor.classes.find((row) => row.id === member.class_id);
      const tasks = monitor.assignments.filter((assignment) => assignment.class_id === member.class_id);
      const results = tasks.map((assignment) => ({ assignment, result: assignmentResult(assignment, member.student_id) }));
      const completed = results.filter((row) => row.result.submitted).length;
      const scores = results.map((row) => row.result.pct).filter((value) => value !== null);
      const overdue = results.filter((row) => !row.result.submitted && new Date(row.assignment.due_at).getTime() < now).length;
      const pending = results.filter((row) => row.result.pending).length;
      const last = results.map((row) => row.result.at).filter(Boolean).sort((a, b) => new Date(b) - new Date(a))[0] || null;
      return {
        member,
        group,
        taskCount: tasks.length,
        completed,
        completion: tasks.length ? Math.round((completed / tasks.length) * 100) : null,
        average: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
        overdue,
        pending,
        last,
      };
    });
  }

  function topicRows(classId) {
    const assignmentIds = new Set(monitor.assignments.filter((row) => classId === "all" || row.class_id === classId).map((row) => row.id));
    const groups = new Map();
    monitor.activities.filter((activity) => assignmentIds.has(activity.assignment_id)).forEach((activity) => {
      const attempts = monitor.attempts.filter((row) => row.assignment_id === activity.assignment_id);
      const latest = new Map();
      attempts.forEach((attempt) => {
        const prev = latest.get(attempt.student_id);
        if (!prev || Number(attempt.attempt_no) > Number(prev.attempt_no)) latest.set(attempt.student_id, attempt);
      });
      const scores = [...latest.values()].filter((attempt) => attempt.review_state === "complete").map((attempt) => percent(attempt.score, attempt.total_max)).filter((value) => value !== null);
      if (!scores.length) return;
      const key = activity.topic_title || activity.topic_key || "Topic";
      const row = groups.get(key) || { title: key, total: 0, count: 0 };
      row.total += scores.reduce((a, b) => a + b, 0);
      row.count += scores.length;
      groups.set(key, row);
    });
    return [...groups.values()].map((row) => ({ ...row, average: Math.round(row.total / row.count) })).sort((a, b) => a.average - b.average);
  }

  function renderMonitoring() {
    const status = $("monitor-status"), summary = $("monitor-summary"), attention = $("monitor-attention"), topics = $("monitor-topics"), tbody = $("monitor-table")?.querySelector("tbody");
    if (!summary || !attention || !topics || !tbody) return;
    summary.replaceChildren();
    attention.replaceChildren();
    topics.replaceChildren();
    tbody.replaceChildren();
    if (!monitor.userId) {
      if (status) status.textContent = "Sign in to see class monitoring.";
      return;
    }
    const classId = $("monitor-class")?.value || "all";
    const rows = studentRows(classId);
    const assignments = monitor.assignments.filter((row) => classId === "all" || row.class_id === classId);
    const expected = rows.reduce((sum, row) => sum + row.taskCount, 0);
    const completed = rows.reduce((sum, row) => sum + row.completed, 0);
    const averages = rows.map((row) => row.average).filter((value) => value !== null);
    const overdue = rows.reduce((sum, row) => sum + row.overdue, 0);
    const pending = rows.reduce((sum, row) => sum + row.pending, 0);
    const completion = expected ? Math.round((completed / expected) * 100) : null;
    const classAverage = averages.length ? Math.round(averages.reduce((a, b) => a + b, 0) / averages.length) : null;
    [
      [completion === null ? "—" : `${completion}%`, "Completion"],
      [classAverage === null ? "—" : `${classAverage}%`, "Class average"],
      [String(overdue), "Overdue items"],
      [String(pending), "Awaiting review"],
    ].forEach(([value, label]) => {
      const card = el("article", "monitor-stat");
      card.append(el("strong", undefined, value), el("span", undefined, label));
      summary.append(card);
    });
    if (status) status.textContent = `${rows.length} students · ${assignments.length} assignments in this view`;

    const needs = rows.filter((row) => row.overdue > 0 || (row.average !== null && row.average < 60)).sort((a, b) => b.overdue - a.overdue || (a.average ?? 101) - (b.average ?? 101));
    if (!needs.length) attention.append(el("p", "monitor-empty", "No overdue work or low-score flags in this view."));
    needs.slice(0, 8).forEach((row) => {
      const item = el("div", "monitor-list-row");
      const name = row.member.display_name || row.member.student_email || "Student";
      const reasons = [];
      if (row.overdue) reasons.push(`${row.overdue} overdue`);
      if (row.average !== null && row.average < 60) reasons.push(`${row.average}% average`);
      item.append(el("strong", undefined, name), el("span", undefined, reasons.join(" · ")));
      attention.append(item);
    });

    const topicData = topicRows(classId);
    if (!topicData.length) topics.append(el("p", "monitor-empty", "Topic data will appear after marked activities."));
    topicData.slice(0, 6).forEach((row) => {
      const item = el("div", "monitor-list-row");
      item.append(el("strong", undefined, row.title), el("span", undefined, `${row.average}% average · ${row.count} scored attempts`));
      topics.append(item);
    });

    rows.sort((a, b) => (b.overdue - a.overdue) || ((a.average ?? 101) - (b.average ?? 101))).forEach((row) => {
      const tr = el("tr");
      const name = row.member.display_name || row.member.student_email || "Student";
      [
        name,
        row.group?.name || "—",
        row.taskCount ? `${row.completed}/${row.taskCount} (${row.completion}%)` : "—",
        row.average === null ? "—" : `${row.average}%`,
        String(row.overdue),
        formatDate(row.last),
      ].forEach((value, index) => {
        const td = el("td", index === 4 && Number(value) > 0 ? "monitor-warning" : undefined, value);
        tr.append(td);
      });
      tbody.append(tr);
    });
  }

  function boot() {
    setupWorkspace();
    const start = () => void initMonitoring();
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
