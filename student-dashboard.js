(() => {
  "use strict";
  const client = globalThis.revisionSupabase;
  const state = {
    user: null,
    profile: null,
    memberships: [],
    classes: [],
    assignments: [],
    submissions: [],
    activities: [],
    attempts: [],
    drafts: [],
  };
  let sessionVersion = 0,
    loadVersion = 0;
  const $ = (id) => document.getElementById(id);
  const els = {
    notice: $("student-notice"),
    authPanel: $("student-auth-panel"),
    authForm: $("student-auth-form"),
    authName: $("student-auth-name"),
    authEmail: $("student-auth-email"),
    authPassword: $("student-auth-password"),
    signUp: $("student-sign-up"),
    app: $("student-app"),
    accountEmail: $("student-account-email"),
    refresh: $("student-refresh"),
    signOut: $("student-sign-out"),
    joinForm: $("join-class-form"),
    joinCode: $("join-class-code"),
    classList: $("student-class-list"),
    classEmpty: $("student-class-empty"),
    filterClass: $("student-filter-class"),
    filterType: $("student-filter-type"),
    assignmentList: $("student-assignment-list"),
    assignmentEmpty: $("student-assignment-empty"),
    metricClasses: $("student-metric-classes"),
    metricOutstanding: $("student-metric-outstanding"),
    metricSubmitted: $("student-metric-submitted"),
    metricMarked: $("student-metric-marked"),
  };
  const clean = (v, m = 4000) =>
    String(v ?? "")
      .trim()
      .slice(0, m);
  const show = (m, k = "success") => {
    els.notice.textContent = m;
    els.notice.dataset.kind = k;
    els.notice.hidden = false;
    clearTimeout(show.t);
    show.t = setTimeout(() => (els.notice.hidden = true), 5000);
  };
  const msg = (e, f) => e?.message || f;
  const fmt = (v) =>
    new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(v));
  async function init() {
    if (!client) {
      show(
        globalThis.REVISION_SUPABASE_ERROR ||
          "Cloud connection could not start.",
        "error",
      );
      return;
    }
    bind();
    client.auth.onAuthStateChange((_e, s) => {
      void session(s);
    });
    const initialVersion = sessionVersion;
    const { data, error } = await client.auth.getSession();
    if (error) show(msg(error, "Could not read session."), "error");
    if (initialVersion === sessionVersion) await session(data?.session || null);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && state.user) load(false);
    });
  }
  function bind() {
    els.authForm.addEventListener("submit", signIn);
    els.signUp.addEventListener("click", signUp);
    els.signOut.addEventListener("click", () => client.auth.signOut());
    els.refresh.addEventListener("click", () => load(true));
    els.joinForm.addEventListener("submit", joinClass);
    els.filterClass.addEventListener("change", renderAssignments);
    els.filterType.addEventListener("change", renderAssignments);
    els.assignmentList.addEventListener("click", submitWork);
    const status = document.createElement("select");
    status.id = "student-filter-status";
    status.setAttribute("aria-label", "Filter work by progress");
    [
      ["all", "All progress"],
      ["outstanding", "To do"],
      ["draft", "In progress"],
      ["review", "Awaiting review"],
      ["marked", "Marked"],
      ["overdue", "Overdue"],
    ].forEach(([v, t]) => status.append(new Option(t, v)));
    els.filterType.parentElement.append(status);
    status.addEventListener("change", renderAssignments);
  }
  async function signIn(e) {
    e.preventDefault();
    const { error } = await client.auth.signInWithPassword({
      email: els.authEmail.value.trim(),
      password: els.authPassword.value,
    });
    if (error) show(msg(error, "Sign-in failed."), "error");
  }
  async function signUp() {
    const email = els.authEmail.value.trim(),
      password = els.authPassword.value,
      name = clean(els.authName.value, 80);
    if (!email || password.length < 8) {
      show("Enter an email and a password of at least 8 characters.", "error");
      return;
    }
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: { data: { display_name: name } },
    });
    if (error) show(msg(error, "Account creation failed."), "error");
    else if (!data.session)
      show(
        "Account created. Check your email to confirm it, then sign in here.",
        "info",
      );
    else show("Student account created and signed in.");
  }
  async function session(s) {
    const version = ++sessionVersion;
    if (!s?.user) {
      state.user = null;
      ++loadVersion;
      state.profile = null;
      state.memberships = [];
      els.accountEmail.textContent = "";
      els.authPassword.value = "";
      state.classes = [];
      state.assignments = [];
      state.submissions = [];
      state.activities = [];
      state.attempts = [];
      state.drafts = [];
      els.authPanel.hidden = false;
      els.app.hidden = true;
      return;
    }
    if (state.user?.id !== s.user.id) {
      state.profile = null;
      state.memberships = [];
      state.classes = [];
      state.assignments = [];
      state.submissions = [];
      state.activities = [];
      state.attempts = [];
      state.drafts = [];
      els.app.hidden = true;
    }
    state.user = s.user;
    els.accountEmail.textContent = s.user.email || "Student";
    const { data, error } = await client.rpc("revision_ensure_profile", {
      p_role: "student",
      p_display_name: clean(
        els.authName.value || s.user.user_metadata?.display_name,
        80,
      ),
    });
    if (version !== sessionVersion) return;
    if (error) {
      els.authPanel.hidden = false;
      els.app.hidden = true;
      show(
        `${msg(error, "Student profile could not be opened.")} If this is a teacher account, use Teacher instead.`,
        "error",
      );
      return;
    }
    state.profile = Array.isArray(data) ? data[0] : data;
    els.authPanel.hidden = true;
    els.app.hidden = false;
    await load(false);
  }
  async function load(announce) {
    if (!state.user) return;
    const uid = state.user.id,
      version = ++loadVersion;
    const current = () => version === loadVersion && state.user?.id === uid;
    const { data: members, error: me } = await client
      .from("revision_class_members")
      .select("*")
      .eq("student_id", uid)
      .eq("status", "joined");
    if (!current()) return;
    if (me) {
      show(msg(me, "Could not load classes."), "error");
      return;
    }
    state.memberships = members || [];
    const ids = state.memberships.map((m) => m.class_id);
    if (!ids.length) {
      state.classes = [];
      state.assignments = [];
      state.submissions = [];
      state.activities = [];
      state.attempts = [];
      state.drafts = [];
    } else {
      const [c, a, s, v, r, d] = await Promise.all([
        client.from("revision_classes").select("*").in("id", ids),
        client
          .from("revision_assignments")
          .select("*")
          .in("class_id", ids)
          .order("due_at", { ascending: true }),
        client.from("revision_submissions").select("*").eq("student_id", uid),
        client.from("revision_activities").select("*").in("class_id", ids),
        client
          .from("revision_activity_attempts")
          .select("*")
          .eq("student_id", uid),
        client
          .from("revision_activity_drafts")
          .select("*")
          .eq("student_id", uid),
      ]);
      if (!current()) return;
      if (c.error || a.error || s.error || v.error || r.error || d.error) {
        show(
          msg(
            c.error || a.error || s.error || v.error || r.error || d.error,
            "Could not load My Work.",
          ),
          "error",
        );
        return;
      }
      state.classes = c.data || [];
      state.assignments = a.data || [];
      state.submissions = s.data || [];
      state.activities = v.data || [];
      state.attempts = r.data || [];
      state.drafts = d.data || [];
    }
    render();
    if (announce) show("My Work refreshed.");
  }
  async function joinClass(e) {
    e.preventDefault();
    const code = clean(els.joinCode.value, 12).toUpperCase();
    const { error } = await client.rpc("revision_join_class", {
      p_code: code,
      p_display_name:
        state.profile?.display_name || clean(els.authName.value, 80),
    });
    if (error) show(msg(error, "Could not join that class."), "error");
    else {
      els.joinForm.reset();
      show("Class joined.");
      await load(false);
    }
  }
  function render() {
    els.metricClasses.textContent = state.classes.length;
    const submittedIds = new Set(state.submissions.map((s) => s.assignment_id));
    els.metricOutstanding.textContent = state.assignments.filter(
      (a) => a.status === "active" && !submittedIds.has(a.id),
    ).length;
    els.metricSubmitted.textContent = state.submissions.length;
    els.metricMarked.textContent = state.submissions.filter(
      (s) => s.marked_at,
    ).length;
    renderClasses();
    renderFilters();
    renderAssignments();
  }
  function renderClasses() {
    els.classList.replaceChildren();
    els.classEmpty.hidden = state.classes.length > 0;
    state.classes.forEach((c) => {
      const card = document.createElement("article");
      card.className = "class-card";
      const h = document.createElement("h3");
      h.textContent = c.name;
      const p = document.createElement("p");
      p.textContent = [c.subject, c.level, c.year_group]
        .filter(Boolean)
        .join(" · ");
      card.append(h, p);
      els.classList.append(card);
    });
  }
  function renderFilters() {
    const prev = els.filterClass.value || "all";
    els.filterClass.replaceChildren(new Option("All classes", "all"));
    state.classes.forEach((c) =>
      els.filterClass.append(new Option(c.name, c.id)),
    );
    if (prev === "all" || state.classes.some((c) => c.id === prev))
      els.filterClass.value = prev;
  }
  function workStatus(a) {
    const sub = state.submissions.find((s) => s.assignment_id === a.id),
      draft = state.drafts.find((d) => d.assignment_id === a.id);
    if (draft) return "draft";
    if (sub) return sub.marked_at ? "marked" : "review";
    if (a.status === "active" && new Date(a.due_at) < new Date())
      return "overdue";
    return "outstanding";
  }
  function renderAssignments() {
    const { el, link } = window.REVISION_ACTIVITY_UI,
      cf = els.filterClass.value || "all",
      tf = els.filterType.value || "all",
      sf = $("student-filter-status")?.value || "all";
    const list = state.assignments.filter(
      (a) =>
        (cf === "all" || a.class_id === cf) &&
        (tf === "all" || a.assignment_type === tf) &&
        (sf === "all" || workStatus(a) === sf),
    );
    els.assignmentList.replaceChildren();
    els.assignmentEmpty.hidden = list.length > 0;
    list.forEach((a) => {
      const group = state.classes.find((c) => c.id === a.class_id),
        sub = state.submissions.find((s) => s.assignment_id === a.id),
        activity = state.activities.find((v) => v.assignment_id === a.id),
        draft = state.drafts.find((d) => d.assignment_id === a.id),
        attempts = state.attempts
          .filter((r) => r.assignment_id === a.id)
          .sort((x, y) => y.attempt_no - x.attempt_no),
        latest = attempts[0];
      const card = el("article", undefined, "assignment-card"),
        head = el("div", undefined, "assignment-card-header"),
        labels = el("div", undefined, "assignment-labels"),
        type = el("span", a.assignment_type, "type-badge " + a.assignment_type),
        status = workStatus(a);
      const text =
        a.status === "closed"
          ? "Closed"
          : {
              draft: "In progress",
              marked: "Marked",
              review: "Awaiting review",
              overdue: "Overdue",
              outstanding: "To do",
            }[status];
      labels.append(
        type,
        el(
          "span",
          text,
          "status-badge " +
            (status === "overdue"
              ? "overdue"
              : status === "marked"
                ? "closed"
                : "upcoming"),
        ),
      );
      head.append(
        labels,
        el("span", group?.name || "Class", "assignment-class-name"),
      );
      card.append(
        head,
        el("h3", a.title),
        el(
          "p",
          "Due " +
            fmt(a.due_at) +
            (a.max_points !== null ? " · " + a.max_points + " marks" : ""),
          "assignment-details",
        ),
      );
      if (a.instructions)
        card.append(el("p", a.instructions, "assignment-notes"));
      const box = el("div", undefined, "student-submit-box");
      if (activity) {
        box.append(
          el(
            "p",
            activity.topic_title +
              " · " +
              activity.questions.length +
              " questions · " +
              attempts.length +
              "/" +
              activity.attempts_limit +
              " attempts used",
            "assignment-details",
          ),
        );
        if (draft)
          box.append(
            el(
              "p",
              Object.values(draft.answers).filter(
                (v) => typeof v === "string" && v.trim(),
              ).length +
                "/" +
                activity.questions.length +
                " answered · draft saved online",
              "submission-result",
            ),
          );
        if (latest)
          box.append(
            el(
              "p",
              "Score " +
                latest.score +
                "/" +
                latest.total_max +
                (latest.review_state === "pending"
                  ? " so far · written answers await review"
                  : ""),
              "submission-result",
            ),
          );
        if (latest?.feedback)
          box.append(
            el(
              "p",
              "Teacher feedback: " + latest.feedback,
              "submission-feedback",
            ),
          );
        const label = draft
          ? "Continue activity"
          : latest
            ? "View results / activity"
            : "Start activity";
        box.append(
          link(
            label,
            "activity.html?assignment=" + encodeURIComponent(a.id),
            "teacher-button primary",
          ),
        );
        if (!latest && a.status === "closed")
          box.append(
            el(
              "p",
              "Your teacher has closed this activity.",
              "submission-result",
            ),
          );
      } else {
        if (sub) {
          box.append(
            el(
              "p",
              "Submitted " +
                fmt(sub.submitted_at) +
                (sub.score !== null
                  ? " · Score " +
                    sub.score +
                    (a.max_points !== null ? " / " + a.max_points : "")
                  : ""),
              "submission-result",
            ),
          );
          if (sub.feedback)
            box.append(
              el(
                "p",
                "Teacher feedback: " + sub.feedback,
                "submission-feedback",
              ),
            );
        }
        if (a.resource_url && /^https?:\/\//i.test(a.resource_url)) {
          const resource = link(
            "Open resource ↗",
            a.resource_url,
            "resource-link",
          );
          resource.target = "_blank";
          resource.rel = "noopener noreferrer";
          box.append(resource);
        }
        if (a.status === "active") {
          const label = el("label", "Your response", "revision-sr-only"),
            ta = el("textarea", undefined, "student-response");
          ta.id = "response-" + a.id;
          label.htmlFor = ta.id;
          ta.dataset.assignmentId = a.id;
          ta.rows = 4;
          ta.maxLength = 10000;
          ta.placeholder = "Enter your response or completion notes…";
          ta.value = sub?.response_text || "";
          const b = window.REVISION_ACTIVITY_UI.button(
            sub ? "Resubmit work" : "Submit work",
            "submit-work",
            a.id,
            "teacher-button primary",
          );
          box.append(label, ta, b);
        }
      }
      card.append(box);
      els.assignmentList.append(card);
    });
  }
  async function submitWork(e) {
    const b = e.target.closest('[data-action="submit-work"]');
    if (!b) return;
    const ta = els.assignmentList.querySelector(
      `.student-response[data-assignment-id="${CSS.escape(b.dataset.id)}"]`,
    );
    const { error } = await client.rpc("revision_submit_assignment", {
      p_assignment_id: b.dataset.id,
      p_response: clean(ta?.value, 10000),
    });
    if (error) show(msg(error, "Work could not be submitted."), "error");
    else {
      show("Work submitted to your teacher.");
      await load(false);
    }
  }
  init();
})();
