(() => {
  "use strict";

  const client = globalThis.revisionSupabase;
  const state = {
    user: null,
    classes: [],
    members: [],
    assignments: [],
    submissions: [],
    activities: [],
    attempts: [],
  };
  let selectedClassId = null;
  let sessionVersion = 0;
  let loadVersion = 0;

  const $ = (id) => document.getElementById(id);
  const els = {
    notice: $("teacher-notice"),
    authPanel: $("teacher-auth-panel"),
    authForm: $("teacher-auth-form"),
    authName: $("teacher-auth-name"),
    authEmail: $("teacher-auth-email"),
    authPassword: $("teacher-auth-password"),
    signUp: $("teacher-sign-up"),
    app: $("teacher-app"),
    accountEmail: $("teacher-account-email"),
    signOut: $("teacher-sign-out"),
    refresh: $("refresh-data"),
    classForm: $("class-form"),
    className: $("class-name"),
    classSubject: $("class-subject"),
    classLevel: $("class-level"),
    classYear: $("class-year"),
    classStudents: $("class-students"),
    classList: $("class-list"),
    classEmpty: $("class-empty"),
    classCountNote: $("class-count-note"),
    detailPanel: $("class-detail-panel"),
    detailTitle: $("class-detail-title"),
    detailMeta: $("class-detail-meta"),
    closeDetail: $("close-class-detail"),
    studentForm: $("student-form"),
    studentName: $("student-name"),
    studentEmail: $("student-email"),
    rosterCount: $("roster-count"),
    rosterList: $("roster-list"),
    assignmentForm: $("assignment-form"),
    assignmentClass: $("assignment-class"),
    assignmentType: $("assignment-type"),
    assignmentTitle: $("assignment-title"),
    assignmentNotes: $("assignment-notes"),
    assignmentDue: $("assignment-due"),
    assignmentSubmit: $("assignment-submit"),
    filterClass: $("assignment-filter-class"),
    filterStatus: $("assignment-filter-status"),
    assignmentList: $("assignment-list"),
    assignmentEmpty: $("assignment-empty"),
    metricClasses: $("metric-classes"),
    metricStudents: $("metric-students"),
    metricActive: $("metric-active"),
    metricSubmissions: $("metric-due-week"),
    exportData: $("export-data"),
  };

  function cleanText(value, max = 200) {
    return String(value ?? "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, max);
  }
  function cleanMultiline(value, max = 4000) {
    return String(value ?? "")
      .replace(/\r/g, "")
      .trim()
      .slice(0, max);
  }
  function safeUrl(value) {
    const v = String(value || "").trim();
    if (!v) return null;
    try {
      const u = new URL(v);
      return ["http:", "https:"].includes(u.protocol) ? u.href : null;
    } catch {
      return null;
    }
  }
  function showNotice(message, kind = "success") {
    els.notice.textContent = message;
    els.notice.dataset.kind = kind;
    els.notice.hidden = false;
    clearTimeout(showNotice.timer);
    showNotice.timer = setTimeout(() => {
      els.notice.hidden = true;
    }, 5200);
  }
  function messageFrom(error, fallback) {
    return error?.message ? cleanText(error.message, 240) : fallback;
  }
  function formatDate(value) {
    if (!value) return "No due date";
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(value));
  }
  function toEndOfDayIso(dateString) {
    return new Date(`${dateString}T23:59:59`).toISOString();
  }
  function capitalize(value) {
    return value ? value[0].toUpperCase() + value.slice(1) : "";
  }
  function classById(id) {
    return state.classes.find((item) => item.id === id) || null;
  }
  function membersForClass(id) {
    return state.members.filter((item) => item.class_id === id);
  }
  function assignmentsForClass(id) {
    return state.assignments.filter((item) => item.class_id === id);
  }
  function submissionsForAssignment(id) {
    return state.submissions.filter((item) => item.assignment_id === id);
  }
  function memberLabel(member) {
    return member.display_name || member.student_email || "Student";
  }

  async function init() {
    if (!client) {
      showNotice(
        globalThis.REVISION_SUPABASE_ERROR ||
          "Cloud connection could not start.",
        "error",
      );
      return;
    }
    bindEvents();
    window.REVISION_TEACHER_ACTIVITIES.init({
      state,
      showNotice,
      loadTeacherData,
    });
    els.assignmentDue.value = localDateString(7);
    client.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });
    const initialVersion = sessionVersion;
    const { data, error } = await client.auth.getSession();
    if (error)
      showNotice(messageFrom(error, "Could not read your session."), "error");
    if (initialVersion === sessionVersion)
      await applySession(data?.session || null);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && state.user) loadTeacherData(false);
    });
  }

  function bindEvents() {
    els.authForm.addEventListener("submit", signIn);
    els.signUp.addEventListener("click", signUp);
    els.signOut.addEventListener("click", async () => {
      await client.auth.signOut();
    });
    els.refresh.addEventListener("click", () => loadTeacherData(true));
    els.classForm.addEventListener("submit", createClass);
    els.studentForm.addEventListener("submit", addStudent);
    els.assignmentForm.addEventListener("submit", createAssignment);
    els.filterClass.addEventListener("change", renderAssignments);
    els.filterStatus.addEventListener("change", renderAssignments);
    els.classList.addEventListener("click", onClassAction);
    els.rosterList.addEventListener("click", onRosterAction);
    els.assignmentList.addEventListener("click", onAssignmentAction);
    els.closeDetail.addEventListener("click", () => {
      selectedClassId = null;
      renderClassDetail();
      renderClasses();
    });
    els.exportData.addEventListener("click", exportData);
  }

  async function signIn(event) {
    event.preventDefault();
    const email = els.authEmail.value.trim();
    const password = els.authPassword.value;
    if (!email || !password) return;
    setAuthBusy(true);
    const { error } = await client.auth.signInWithPassword({ email, password });
    setAuthBusy(false);
    if (error) showNotice(messageFrom(error, "Sign-in failed."), "error");
  }

  async function signUp() {
    const email = els.authEmail.value.trim();
    const password = els.authPassword.value;
    const displayName = cleanText(els.authName.value, 80);
    if (!email || password.length < 8) {
      showNotice(
        "Enter an email and a password of at least 8 characters.",
        "error",
      );
      return;
    }
    setAuthBusy(true);
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    setAuthBusy(false);
    if (error) {
      showNotice(messageFrom(error, "Account creation failed."), "error");
      return;
    }
    if (!data.session)
      showNotice(
        "Account created. Check your email to confirm it, then sign in here.",
        "info",
      );
    else showNotice("Teacher account created and signed in.");
  }

  function setAuthBusy(value) {
    els.authForm.querySelectorAll("button,input").forEach((node) => {
      node.disabled = value;
    });
  }

  async function applySession(session) {
    const version = ++sessionVersion;
    if (!session?.user) {
      state.user = null;
      ++loadVersion;
      els.authPassword.value = "";
      state.classes = [];
      state.members = [];
      state.assignments = [];
      state.submissions = [];
      state.activities = [];
      state.attempts = [];
      els.authPanel.hidden = false;
      els.app.hidden = true;
      els.accountEmail.textContent = "";
      renderAll();
      return;
    }
    if (state.user?.id !== session.user.id) {
      state.classes = [];
      state.members = [];
      state.assignments = [];
      state.submissions = [];
      state.activities = [];
      state.attempts = [];
      els.app.hidden = true;
    }
    state.user = session.user;
    els.accountEmail.textContent = session.user.email || "Teacher";
    const { error } = await client.rpc("revision_ensure_profile", {
      p_role: "teacher",
      p_display_name: cleanText(
        els.authName.value || session.user.user_metadata?.display_name,
        80,
      ),
    });
    if (version !== sessionVersion) return;
    if (error) {
      els.authPanel.hidden = false;
      els.app.hidden = true;
      showNotice(
        `${messageFrom(error, "Teacher profile could not be opened.")} If this account belongs to a student, use My Work instead.`,
        "error",
      );
      return;
    }
    els.authPanel.hidden = true;
    els.app.hidden = false;
    await loadTeacherData(false);
  }

  async function loadTeacherData(announce = false) {
    if (!state.user) return;
    const uid = state.user.id,
      version = ++loadVersion;
    const current = () => version === loadVersion && state.user?.id === uid;
    try {
      const { data: classes, error: classError } = await client
        .from("revision_classes")
        .select("*")
        .eq("teacher_id", uid)
        .eq("archived", false)
        .order("created_at", { ascending: true });
      if (!current()) return;
      if (classError) throw classError;
      state.classes = classes || [];
      const ids = state.classes.map((item) => item.id);
      if (!ids.length) {
        state.members = [];
        state.assignments = [];
        state.submissions = [];
        state.activities = [];
        state.attempts = [];
      } else {
        const [
          membersResult,
          assignmentsResult,
          submissionsResult,
          activitiesResult,
          attemptsResult,
        ] = await Promise.all([
          client
            .from("revision_class_members")
            .select("*")
            .in("class_id", ids)
            .order("created_at", { ascending: true }),
          client
            .from("revision_assignments")
            .select("*")
            .in("class_id", ids)
            .order("due_at", { ascending: true }),
          client
            .from("revision_submissions")
            .select("*")
            .in("class_id", ids)
            .order("submitted_at", { ascending: false }),
          client.from("revision_activities").select("*").in("class_id", ids),
          client
            .from("revision_activity_attempts")
            .select("*")
            .in("class_id", ids)
            .order("submitted_at", { ascending: false }),
        ]);
        if (!current()) return;
        if (membersResult.error) throw membersResult.error;
        if (assignmentsResult.error) throw assignmentsResult.error;
        if (submissionsResult.error) throw submissionsResult.error;
        if (activitiesResult.error) throw activitiesResult.error;
        if (attemptsResult.error) throw attemptsResult.error;
        state.members = membersResult.data || [];
        state.assignments = assignmentsResult.data || [];
        state.submissions = submissionsResult.data || [];
        state.activities = activitiesResult.data || [];
        state.attempts = attemptsResult.data || [];
      }
      if (
        selectedClassId &&
        !state.classes.some((item) => item.id === selectedClassId)
      )
        selectedClassId = null;
      renderAll();
      if (announce) showNotice("Cloud data refreshed.");
    } catch (error) {
      if (current())
        showNotice(messageFrom(error, "Could not load teacher data."), "error");
    }
  }

  function renderAll() {
    renderMetrics();
    renderClassOptions();
    renderClasses();
    renderClassDetail();
    renderAssignments();
  }
  function renderMetrics() {
    els.metricClasses.textContent = String(state.classes.length);
    els.metricStudents.textContent = String(state.members.length);
    els.metricActive.textContent = String(
      state.assignments.filter((item) => item.status === "active").length,
    );
    els.metricSubmissions.textContent = String(state.submissions.length);
  }

  function renderClassOptions() {
    const currentAssign = els.assignmentClass.value;
    const currentFilter = els.filterClass.value || "all";
    fillSelect(els.assignmentClass, "Choose a class…", false);
    fillSelect(els.filterClass, "All classes", true);
    if (state.classes.some((item) => item.id === currentAssign))
      els.assignmentClass.value = currentAssign;
    if (
      currentFilter === "all" ||
      state.classes.some((item) => item.id === currentFilter)
    )
      els.filterClass.value = currentFilter;
    els.assignmentClass.disabled = !state.classes.length;
    els.assignmentSubmit.disabled = !state.classes.length;
  }
  function fillSelect(select, label, includeAll) {
    select.replaceChildren();
    const first = document.createElement("option");
    first.value = includeAll ? "all" : "";
    first.textContent = label;
    select.append(first);
    state.classes.forEach((group) => {
      const option = document.createElement("option");
      option.value = group.id;
      option.textContent = group.name;
      select.append(option);
    });
  }

  function renderClasses() {
    els.classList.replaceChildren();
    els.classEmpty.hidden = state.classes.length > 0;
    els.classCountNote.textContent = `${state.classes.length} ${state.classes.length === 1 ? "class" : "classes"}`;
    state.classes.forEach((group) => {
      const card = document.createElement("article");
      card.className = "class-card";
      if (group.id === selectedClassId) card.dataset.selected = "true";
      const top = document.createElement("div");
      top.className = "class-card-top";
      const copy = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = group.name;
      const meta = document.createElement("p");
      meta.textContent = [group.subject, group.level, group.year_group]
        .filter(Boolean)
        .join(" · ");
      copy.append(title, meta);
      const code = document.createElement("button");
      code.type = "button";
      code.className = "class-code";
      code.dataset.action = "copy-code";
      code.dataset.id = group.id;
      code.title = "Copy class code";
      code.textContent = group.join_code;
      top.append(copy, code);
      const joined = membersForClass(group.id).filter(
        (m) => m.status === "joined",
      ).length;
      const stats = document.createElement("div");
      stats.className = "class-stats";
      stats.append(
        stat(joined, "joined students"),
        stat(
          assignmentsForClass(group.id).filter((a) => a.status === "active")
            .length,
          "active tasks",
        ),
      );
      const actions = document.createElement("div");
      actions.className = "card-actions";
      actions.append(
        button("Open class", "open-class", group.id),
        button("Assign", "assign-class", group.id),
        button("Delete", "delete-class", group.id, "mini-button danger"),
      );
      card.append(top, stats, actions);
      els.classList.append(card);
    });
  }
  function stat(value, label) {
    const box = document.createElement("span");
    const strong = document.createElement("strong");
    strong.textContent = String(value);
    const small = document.createElement("small");
    small.textContent = label;
    box.append(strong, small);
    return box;
  }
  function button(label, action, id, className = "mini-button") {
    const b = document.createElement("button");
    b.type = "button";
    b.className = className;
    b.dataset.action = action;
    b.dataset.id = id;
    b.textContent = label;
    return b;
  }

  function renderClassDetail() {
    const group = classById(selectedClassId);
    els.detailPanel.hidden = !group;
    if (!group) return;
    const members = membersForClass(group.id);
    const classAssignments = assignmentsForClass(group.id);
    els.detailTitle.textContent = group.name;
    els.detailMeta.textContent = `${[group.subject, group.level, group.year_group].filter(Boolean).join(" · ")} · class code ${group.join_code}`;
    els.rosterCount.textContent = `(${members.length})`;
    els.rosterList.replaceChildren();
    if (!members.length) {
      const empty = document.createElement("p");
      empty.className = "roster-empty";
      empty.textContent =
        "No students yet. Students can join with the class code, or you can add an invite here.";
      els.rosterList.append(empty);
      return;
    }
    members.forEach((member) => {
      const row = document.createElement("div");
      row.className = "roster-row cloud-roster-row";
      const copy = document.createElement("div");
      copy.className = "roster-copy";
      const name = document.createElement("strong");
      name.textContent = memberLabel(member);
      const meta = document.createElement("span");
      const studentSubs = member.student_id
        ? state.submissions.filter(
            (s) =>
              s.class_id === group.id && s.student_id === member.student_id,
          ).length
        : 0;
      meta.textContent =
        member.status === "joined"
          ? `${member.student_email || "Joined account"} · ${studentSubs}/${classAssignments.length} submitted`
          : `${member.student_email || "Unlinked roster entry"} · awaiting join`;
      copy.append(name, meta);
      row.append(
        copy,
        button(
          "Remove",
          "remove-student",
          member.id,
          "text-button danger-text",
        ),
      );
      els.rosterList.append(row);
    });
  }

  function renderAssignments() {
    const classFilter = els.filterClass.value || "all";
    const statusFilter = els.filterStatus.value || "active";
    const visible = state.assignments
      .filter((item) => classFilter === "all" || item.class_id === classFilter)
      .filter((item) => statusFilter === "all" || item.status === statusFilter)
      .sort((a, b) => new Date(a.due_at) - new Date(b.due_at));
    els.assignmentList.replaceChildren();
    els.assignmentEmpty.hidden = visible.length > 0;
    visible.forEach((item) => {
      const group = classById(item.class_id);
      if (!group) return;
      const card = document.createElement("article");
      card.className = "assignment-card";
      card.dataset.status = item.status;
      const header = document.createElement("div");
      header.className = "assignment-card-header";
      const labels = document.createElement("div");
      labels.className = "assignment-labels";
      const type = document.createElement("span");
      type.className = `type-badge ${item.assignment_type}`;
      type.textContent = capitalize(item.assignment_type);
      const status = document.createElement("span");
      status.className = `status-badge ${dueState(item)}`;
      status.textContent = statusLabel(item);
      labels.append(type, status);
      const className = document.createElement("span");
      className.className = "assignment-class-name";
      className.textContent = group.name;
      header.append(labels, className);
      const title = document.createElement("h3");
      title.textContent = item.title;
      const subs = submissionsForAssignment(item.id);
      const joined = membersForClass(item.class_id).filter(
        (m) => m.status === "joined",
      ).length;
      const details = document.createElement("p");
      details.className = "assignment-details";
      details.textContent = `Due ${formatDate(item.due_at)}${item.max_points !== null ? ` · ${Number(item.max_points)} marks / points` : ""} · ${subs.length}/${joined} submitted`;
      card.append(header, title, details);
      if (item.instructions) {
        const notes = document.createElement("p");
        notes.className = "assignment-notes";
        notes.textContent = item.instructions;
        card.append(notes);
      }
      if (item.resource_url) {
        const link = document.createElement("a");
        link.className = "resource-link";
        link.href = item.resource_url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = "Open linked resource ↗";
        card.append(link);
      }
      const activity = state.activities.find(
        (a) => a.assignment_id === item.id,
      );
      if (activity)
        card.append(window.REVISION_TEACHER_ACTIVITIES.renderResults(item));
      else if (subs.length) card.append(buildSubmissionBlock(item, subs));
      const actions = document.createElement("div");
      actions.className = "card-actions assignment-actions";
      actions.append(
        button(
          item.status === "closed" ? "Reopen" : "Close",
          "toggle-assignment",
          item.id,
        ),
        button("Duplicate", "duplicate-assignment", item.id),
        button("Delete", "delete-assignment", item.id, "mini-button danger"),
      );
      if (activity) {
        actions.prepend(
          button("Export results CSV", "export-results", item.id),
        );
        actions.prepend(
          window.REVISION_ACTIVITY_UI.link(
            "Preview activity",
            "activity.html?assignment=" + item.id,
            "mini-button",
          ),
        );
      }
      card.append(actions);
      els.assignmentList.append(card);
    });
  }

  function buildSubmissionBlock(assignment, submissions) {
    const wrap = document.createElement("div");
    wrap.className = "submission-block";
    const heading = document.createElement("strong");
    heading.className = "submission-heading";
    heading.textContent = "Student submissions";
    wrap.append(heading);
    submissions.forEach((submission) => {
      const member = state.members.find(
        (m) =>
          m.student_id === submission.student_id &&
          m.class_id === assignment.class_id,
      );
      const row = document.createElement("div");
      row.className = "submission-row";
      const top = document.createElement("div");
      top.className = "submission-row-top";
      const who = document.createElement("strong");
      who.textContent = member ? memberLabel(member) : "Student";
      const when = document.createElement("span");
      when.textContent = `Submitted ${formatDate(submission.submitted_at)}`;
      top.append(who, when);
      row.append(top);
      if (submission.response_text) {
        const response = document.createElement("p");
        response.className = "submission-response";
        response.textContent = submission.response_text;
        row.append(response);
      }
      const mark = document.createElement("div");
      mark.className = "mark-grid";
      const score = document.createElement("input");
      score.type = "number";
      score.min = "0";
      score.step = "0.5";
      score.className = "mark-score";
      if (assignment.max_points !== null)
        score.max = String(assignment.max_points);
      score.placeholder =
        assignment.max_points !== null
          ? `Score / ${Number(assignment.max_points)}`
          : "Score";
      if (submission.score !== null) score.value = String(submission.score);
      const feedback = document.createElement("input");
      feedback.type = "text";
      feedback.maxLength = 4000;
      feedback.className = "mark-feedback";
      feedback.placeholder = "Feedback";
      feedback.value = submission.feedback || "";
      mark.append(
        score,
        feedback,
        button(
          submission.marked_at ? "Update mark" : "Save mark",
          "mark-submission",
          submission.id,
        ),
      );
      row.append(mark);
      wrap.append(row);
    });
    return wrap;
  }

  function dueState(item) {
    if (item.status === "closed") return "closed";
    const due = new Date(item.due_at);
    const now = new Date();
    if (due < now) return "overdue";
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59, 999);
    return due <= tomorrow ? "today" : "upcoming";
  }
  function statusLabel(item) {
    return {
      closed: "Closed",
      overdue: "Overdue",
      today: "Due soon",
      upcoming: "Active",
    }[dueState(item)];
  }

  async function createClass(event) {
    event.preventDefault();
    if (!state.user) return;
    const name = cleanText(els.className.value, 80);
    if (name.length < 2) return;
    const payload = {
      teacher_id: state.user.id,
      name,
      subject: cleanText(els.classSubject.value, 60),
      level: els.classLevel.value,
      year_group: cleanText(els.classYear.value, 30),
    };
    const { data, error } = await client
      .from("revision_classes")
      .insert(payload)
      .select("*")
      .single();
    if (error) {
      showNotice(messageFrom(error, "Class could not be created."), "error");
      return;
    }
    const roster = parseRoster(els.classStudents.value);
    if (roster.length) {
      const rows = roster.map((student) => ({
        class_id: data.id,
        teacher_id: state.user.id,
        display_name: student.name,
        student_email: student.email,
        status: "invited",
      }));
      const result = await client.from("revision_class_members").insert(rows);
      if (result.error)
        showNotice(
          `Class created, but part of the initial roster could not be added: ${messageFrom(result.error, "")}`,
          "error",
        );
      else showNotice("Class created. Share the class code with students.");
    } else showNotice("Class created. Share the class code with students.");
    els.classForm.reset();
    els.classSubject.value = "Physics";
    els.classLevel.value = "GCSE";
    selectedClassId = data.id;
    await loadTeacherData(false);
  }

  function parseRoster(value) {
    const out = [];
    const seen = new Set();
    String(value || "")
      .split(/\n+/)
      .forEach((line) => {
        const raw = line.trim();
        if (!raw) return;
        const match = raw.match(/^(.*?)\s*<([^<>\s]+@[^<>\s]+)>\s*$/);
        const emailOnly = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw);
        const email = (match ? match[2] : emailOnly ? raw : "").toLowerCase();
        const name = cleanText(
          match ? match[1] : emailOnly ? raw.split("@")[0] : raw,
          80,
        );
        const key = email || name.toLowerCase();
        if (!key || seen.has(key)) return;
        seen.add(key);
        out.push({ name: name || "Student", email: email || null });
      });
    return out;
  }

  async function addStudent(event) {
    event.preventDefault();
    const group = classById(selectedClassId);
    if (!group) return;
    const name = cleanText(els.studentName.value, 80);
    const email = els.studentEmail.value.trim().toLowerCase() || null;
    const { error } = await client.from("revision_class_members").insert({
      class_id: group.id,
      teacher_id: state.user.id,
      display_name: name,
      student_email: email,
      status: "invited",
    });
    if (error) {
      showNotice(messageFrom(error, "Student could not be added."), "error");
      return;
    }
    els.studentForm.reset();
    showNotice(
      "Student added to the roster. They can join using the class code.",
    );
    await loadTeacherData(false);
  }

  async function createAssignment(event) {
    event.preventDefault();
    const classId = els.assignmentClass.value;
    if (!classById(classId)) return;
    els.assignmentSubmit.disabled = true;
    try {
      await window.REVISION_TEACHER_ACTIVITIES.create({
        class_id: classId,
        assignment_type: els.assignmentType.value,
        title: cleanText(els.assignmentTitle.value, 120),
        instructions: cleanMultiline(els.assignmentNotes.value, 4000),
        due_at: toEndOfDayIso(els.assignmentDue.value),
      });
      els.assignmentForm.reset();
      els.assignmentDue.value = localDateString(7);
      els.assignmentClass.value = classId;
      window.REVISION_TEACHER_ACTIVITIES.reset();
      showNotice("Activity assigned. Students can complete it in My Work.");
      await loadTeacherData(false);
    } catch (error) {
      showNotice(
        messageFrom(error, "Activity could not be assigned."),
        "error",
      );
    } finally {
      els.assignmentSubmit.disabled = !state.classes.length;
    }
  }

  async function onClassAction(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const id = target.dataset.id;
    const action = target.dataset.action;
    const group = classById(id);
    if (!group) return;
    if (action === "open-class") {
      selectedClassId = id;
      renderClasses();
      renderClassDetail();
      els.detailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (action === "assign-class") {
      els.assignmentClass.value = id;
      window.REVISION_TEACHER_ACTIVITIES.matchClass();
      $("assign-work").scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (action === "copy-code") {
      await copyText(group.join_code);
      showNotice(`Class code ${group.join_code} copied.`);
    }
    if (action === "delete-class") {
      if (
        !confirm(
          `Delete ${group.name}? This also deletes its assignments and submissions.`,
        )
      )
        return;
      const { error } = await client
        .from("revision_classes")
        .delete()
        .eq("id", id);
      if (error)
        showNotice(messageFrom(error, "Class could not be deleted."), "error");
      else {
        if (selectedClassId === id) selectedClassId = null;
        showNotice("Class deleted.");
        await loadTeacherData(false);
      }
    }
  }

  async function onRosterAction(event) {
    const target = event.target.closest('[data-action="remove-student"]');
    if (!target) return;
    const member = state.members.find((item) => item.id === target.dataset.id);
    if (!member) return;
    if (!confirm(`Remove ${memberLabel(member)} from this class?`)) return;
    const { error } = await client
      .from("revision_class_members")
      .delete()
      .eq("id", member.id);
    if (error)
      showNotice(messageFrom(error, "Student could not be removed."), "error");
    else {
      showNotice("Student removed.");
      await loadTeacherData(false);
    }
  }

  async function onAssignmentAction(event) {
    const target = event.target.closest("[data-action]");
    if (!target) return;
    const action = target.dataset.action;
    const id = target.dataset.id;
    if (action === "review-activity") {
      await window.REVISION_TEACHER_ACTIVITIES.review(id, target);
      return;
    }
    if (action === "mark-submission") {
      await markSubmission(id, target);
      return;
    }
    const assignment = state.assignments.find((item) => item.id === id);
    if (!assignment) return;
    if (action === "export-results") {
      window.REVISION_TEACHER_ACTIVITIES.exportResults(assignment);
      return;
    }
    if (action === "toggle-assignment") {
      const { error } = await client
        .from("revision_assignments")
        .update({
          status: assignment.status === "closed" ? "active" : "closed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error)
        showNotice(
          messageFrom(error, "Assignment could not be updated."),
          "error",
        );
      else await loadTeacherData(false);
    }
    if (
      action === "duplicate-assignment" &&
      state.activities.some((a) => a.assignment_id === id)
    ) {
      const date = new Date(assignment.due_at);
      date.setDate(date.getDate() + 7);
      target.disabled = true;
      try {
        await window.REVISION_TEACHER_ACTIVITIES.duplicate(
          id,
          date.toISOString(),
        );
        showNotice(
          "Activity duplicated with its questions and marking settings.",
        );
        await loadTeacherData(false);
      } catch (e) {
        showNotice(e.message, "error");
      } finally {
        target.disabled = false;
      }
      return;
    }
    if (action === "duplicate-assignment") {
      const due = new Date(assignment.due_at);
      due.setDate(due.getDate() + 7);
      const { error } = await client.from("revision_assignments").insert({
        class_id: assignment.class_id,
        teacher_id: state.user.id,
        assignment_type: assignment.assignment_type,
        title: `${assignment.title} (copy)`.slice(0, 120),
        instructions: assignment.instructions,
        due_at: due.toISOString(),
        max_points: assignment.max_points,
        resource_url: assignment.resource_url,
        status: "active",
      });
      if (error)
        showNotice(
          messageFrom(error, "Assignment could not be duplicated."),
          "error",
        );
      else {
        showNotice("Assignment duplicated with a due date one week later.");
        await loadTeacherData(false);
      }
    }
    if (action === "delete-assignment") {
      if (
        !confirm(
          `Delete “${assignment.title}”? Student submissions for it will also be deleted.`,
        )
      )
        return;
      const { error } = await client
        .from("revision_assignments")
        .delete()
        .eq("id", id);
      if (error)
        showNotice(
          messageFrom(error, "Assignment could not be deleted."),
          "error",
        );
      else {
        showNotice("Assignment deleted.");
        await loadTeacherData(false);
      }
    }
  }

  async function markSubmission(id, buttonNode) {
    const row = buttonNode.closest(".submission-row");
    if (!row) return;
    const scoreInput = row.querySelector(".mark-score");
    const feedbackInput = row.querySelector(".mark-feedback");
    const score = scoreInput.value === "" ? null : Number(scoreInput.value);
    const { error } = await client.rpc("revision_mark_submission", {
      p_submission_id: id,
      p_score: score,
      p_feedback: cleanText(feedbackInput.value, 4000),
    });
    if (error)
      showNotice(messageFrom(error, "Mark could not be saved."), "error");
    else {
      showNotice("Mark and feedback saved.");
      await loadTeacherData(false);
    }
  }
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.append(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
  }
  function exportData() {
    const payload = {
      exportedAt: new Date().toISOString(),
      classes: state.classes,
      members: state.members,
      assignments: state.assignments,
      submissions: state.submissions,
      activities: state.activities,
      attempts: state.attempts,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revision-teacher-backup-${localDateString(0)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function localDateString(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }
  init();
})();
