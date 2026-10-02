(() => {
  "use strict";

  let summary = null;
  let team = null;
  let seatEmails = new Set();
  let currentUserId = null;
  let refreshTimer = null;
  let observer = null;
  let actionsBound = false;

  const planNames = {
    school: "Spark School",
    school_plus: "Spark School Plus",
    whole_school: "Spark Whole School",
  };

  function client() {
    return globalThis.revisionSupabase || null;
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function showNotice(message, kind = "error") {
    const notice = document.getElementById("teacher-notice");
    if (!notice) return;
    notice.textContent = message;
    notice.dataset.kind = kind;
    notice.hidden = false;
    clearTimeout(showNotice.timer);
    showNotice.timer = setTimeout(() => {
      notice.hidden = true;
    }, 6000);
  }

  function ensureUi() {
    const grid = document.querySelector(".metrics-grid");
    if (!grid) return null;
    let card = document.getElementById("metric-school-seats-card");
    if (!card) {
      const style = document.createElement("style");
      style.id = "spark-school-seat-style";
      style.textContent = `
        @media(min-width:981px){.metrics-grid{grid-template-columns:repeat(5,minmax(0,1fr))}}
        #metric-school-seats-card[data-active="true"]{border-color:#31524f;background:linear-gradient(145deg,#102725,#101f30)}
        #metric-school-seats-card strong{font-size:1.75rem;white-space:nowrap}
        #metric-school-seats-card .seat-plan{display:block;margin-top:7px;color:var(--revision-accent);font-size:.62rem;font-weight:800;letter-spacing:.04em}
        .spark-school-team-panel{margin:0 0 22px}.spark-school-team-panel[hidden]{display:none!important}
        .spark-school-team-copy{margin:-6px 0 16px;color:var(--revision-muted);font-size:.75rem;line-height:1.6}
        .spark-school-team-form{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr) auto;gap:9px;margin-bottom:15px}
        .spark-school-team-form input{min-width:0;border:1px solid var(--revision-line);background:#0b1828;color:var(--revision-text);border-radius:9px;padding:10px 12px}
        .spark-school-team-form input:focus{border-color:var(--revision-accent);outline:none}
        .spark-school-team-list{display:grid;border-top:1px solid var(--revision-line)}
        .spark-school-team-row{display:grid;grid-template-columns:minmax(0,1fr) auto auto;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #223448}
        .spark-school-team-who{min-width:0}.spark-school-team-who strong,.spark-school-team-who span{display:block}.spark-school-team-who strong{font-size:.78rem}.spark-school-team-who span{margin-top:3px;color:var(--revision-muted);font-size:.67rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .spark-school-role,.spark-school-status{display:inline-flex;align-items:center;border-radius:999px;padding:4px 8px;font-size:.59rem;font-weight:850;letter-spacing:.05em;text-transform:uppercase;white-space:nowrap}
        .spark-school-role{background:#17342f;color:#aee8d8}.spark-school-status{background:#1a3048;color:#b8d4ed}.spark-school-status.invited{background:#493b1f;color:#f2d58d}
        .spark-school-team-actions{display:flex;gap:7px;align-items:center}.spark-school-team-empty{color:var(--revision-muted);font-size:.72rem;padding:14px 0}
        @media(max-width:720px){.spark-school-team-form{grid-template-columns:1fr}.spark-school-team-row{grid-template-columns:minmax(0,1fr) auto}.spark-school-team-actions{grid-column:1/-1}.spark-school-team-form .teacher-button{width:100%}}
      `;
      document.head.append(style);
      card = document.createElement("article");
      card.id = "metric-school-seats-card";
      card.className = "metric-card";
      card.innerHTML = `<span>School seats</span><strong id="metric-school-seats">—</strong><small id="metric-school-seats-note">No school licence</small><span id="metric-school-seats-plan" class="seat-plan"></span>`;
      grid.append(card);
    }

    let panel = document.getElementById("spark-school-team-panel");
    if (!panel) {
      panel = document.createElement("section");
      panel.id = "spark-school-team-panel";
      panel.className = "teacher-panel compact-panel spark-school-team-panel";
      panel.hidden = true;
      panel.innerHTML = `
        <div class="panel-heading">
          <div><span class="teacher-eyebrow">SCHOOL LICENCE</span><h2>School team</h2></div>
          <span id="spark-school-team-note" class="panel-note"></span>
        </div>
        <p id="spark-school-team-copy" class="spark-school-team-copy"></p>
        <form id="spark-school-team-form" class="spark-school-team-form" hidden>
          <input id="spark-school-teacher-name" maxlength="80" autocomplete="name" placeholder="Teacher name (optional)" aria-label="Teacher name" />
          <input id="spark-school-teacher-email" type="email" required maxlength="160" autocomplete="email" placeholder="teacher@school.org" aria-label="Teacher email" />
          <button class="teacher-button primary" type="submit">Add teacher</button>
        </form>
        <div id="spark-school-team-list" class="spark-school-team-list"></div>`;
      grid.insertAdjacentElement("afterend", panel);
    }
    bindTeamActions();
    return card;
  }

  function render() {
    const card = ensureUi();
    if (!card) return;
    const count = document.getElementById("metric-school-seats");
    const note = document.getElementById("metric-school-seats-note");
    const plan = document.getElementById("metric-school-seats-plan");
    const panel = document.getElementById("spark-school-team-panel");

    if (!summary?.has_license) {
      card.dataset.active = "false";
      count.textContent = "—";
      note.textContent = "school licence required";
      plan.textContent = "";
      card.title = "Choose a Spark School plan to allocate pupil seats.";
      if (panel) panel.hidden = true;
      return;
    }

    card.dataset.active = String(Boolean(summary.access_active));
    count.textContent = `${Number(summary.used || 0)} / ${Number(summary.seat_limit || 0)}`;
    note.textContent = summary.access_active
      ? `${Number(summary.active || 0)} active · ${Number(summary.reserved || 0)} reserved · ${Number(summary.available || 0)} available`
      : `licence ${String(summary.status || "inactive").replaceAll("_", " ")}`;
    plan.textContent = `${planNames[summary.plan] || "Spark School"}${summary.role === "teacher" ? " · shared" : ""}`;
    card.title = summary.access_active
      ? "A unique pupil uses one shared school seat even when they belong to classes taught by different teachers."
      : "This school licence is not currently granting pupil access.";

    renderTeam();
  }

  function renderTeam() {
    const panel = document.getElementById("spark-school-team-panel");
    const list = document.getElementById("spark-school-team-list");
    const form = document.getElementById("spark-school-team-form");
    const note = document.getElementById("spark-school-team-note");
    const copy = document.getElementById("spark-school-team-copy");
    if (!panel || !list || !form || !note || !copy) return;

    panel.hidden = !summary?.has_license;
    if (panel.hidden) return;

    const members = Array.isArray(team?.members) ? team.members : [];
    const owner = team?.owner || null;
    const activeTeachers = Number(summary?.staff_active || 1);
    const invitedTeachers = Number(summary?.staff_invited || 0);
    note.textContent = `${activeTeachers} active${invitedTeachers ? ` · ${invitedTeachers} invited` : ""}`;
    form.hidden = !Boolean(summary?.can_manage_staff);
    copy.textContent = summary?.can_manage_staff
      ? "Add teacher accounts to this licence. When they sign in with the invited email, Spark links them automatically. Their classes share the same pupil-seat pool."
      : "This teacher account is using a shared school licence. Your classes draw from the same pupil-seat pool as the rest of the school team.";

    list.replaceChildren();
    if (owner) list.append(teamRow(owner, true));
    members.forEach((member) => list.append(teamRow(member, false)));
    if (!owner && !members.length) {
      const empty = document.createElement("div");
      empty.className = "spark-school-team-empty";
      empty.textContent = "School staff details are not available yet.";
      list.append(empty);
    }
  }

  function teamRow(member, isOwner) {
    const row = document.createElement("div");
    row.className = "spark-school-team-row";
    const who = document.createElement("div");
    who.className = "spark-school-team-who";
    const name = document.createElement("strong");
    name.textContent = member.display_name || String(member.email || "Teacher").split("@")[0] || "Teacher";
    const email = document.createElement("span");
    email.textContent = member.email || "";
    who.append(name, email);

    const status = document.createElement("span");
    status.className = `spark-school-status ${member.status === "invited" ? "invited" : ""}`;
    status.textContent = member.status === "invited" ? "Invited" : "Active";

    const actions = document.createElement("div");
    actions.className = "spark-school-team-actions";
    const role = document.createElement("span");
    role.className = "spark-school-role";
    role.textContent = isOwner ? "Owner" : "Teacher";
    actions.append(role);

    if (!isOwner && summary?.can_manage_staff && member.id) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "mini-button danger";
      remove.dataset.schoolStaffRemove = member.id;
      remove.dataset.schoolStaffLabel = member.display_name || member.email || "this teacher";
      remove.textContent = "Remove";
      actions.append(remove);
    }

    row.append(who, status, actions);
    return row;
  }

  async function refresh() {
    const supabase = client();
    ensureUi();
    if (!supabase) return;
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user || null;
    currentUserId = user?.id || null;
    if (!currentUserId) {
      summary = null;
      team = null;
      seatEmails = new Set();
      render();
      return;
    }

    await supabase.rpc("spark_claim_school_staff_invite");
    const [summaryResult, teamResult] = await Promise.all([
      supabase.rpc("spark_school_license_summary"),
      supabase.rpc("spark_school_staff_list"),
    ]);

    if (summaryResult.error) {
      summary = null;
      team = null;
      seatEmails = new Set();
      render();
      return;
    }

    summary = summaryResult.data || null;
    team = teamResult.error ? null : teamResult.data || null;
    const ownerId = summary?.owner_user_id || null;
    let seats = [];
    if (ownerId) {
      const seatsResult = await supabase
        .from("spark_school_seats")
        .select("student_email,status")
        .eq("license_owner_id", ownerId);
      seats = seatsResult.error ? [] : seatsResult.data || [];
    }
    seatEmails = new Set(
      seats
        .filter((seat) => seat.status === "active" || seat.status === "reserved")
        .map((seat) => String(seat.student_email || "").trim().toLowerCase())
        .filter(Boolean),
    );
    render();
  }

  function scheduleRefresh(delay = 250) {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => void refresh(), delay);
  }

  function rosterEmails(value) {
    const emails = new Set();
    String(value || "")
      .split(/\n+/)
      .forEach((line) => {
        const raw = line.trim();
        if (!raw) return;
        const bracket = raw.match(/<([^<>\s]+@[^<>\s]+)>/);
        const plain = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw) ? raw : null;
        const email = String(bracket?.[1] || plain || "").trim().toLowerCase();
        if (email) emails.add(email);
      });
    return emails;
  }

  function activeSchoolLicence() {
    return Boolean(summary?.has_license && summary?.access_active);
  }

  function guardClassRoster(event) {
    if (!activeSchoolLicence()) return;
    const textarea = document.getElementById("class-students");
    const incoming = rosterEmails(textarea?.value);
    const newEmails = [...incoming].filter((email) => !seatEmails.has(email));
    if (newEmails.length <= Number(summary.available || 0)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showNotice(
      `This roster needs ${newEmails.length} new Spark seats, but only ${Number(summary.available || 0)} are available on the shared ${Number(summary.seat_limit || 0)}-seat school licence.`,
    );
  }

  function guardStudentAdd(event) {
    if (!activeSchoolLicence()) return;
    const email = String(document.getElementById("student-email")?.value || "").trim().toLowerCase();
    if (!email || seatEmails.has(email) || Number(summary.available || 0) > 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showNotice(
      `All ${Number(summary.seat_limit || 0)} shared school seats are currently in use. Remove a pupil from their final class or upgrade the school plan before adding another email.`,
    );
  }

  function bindGuards() {
    document.getElementById("class-form")?.addEventListener("submit", guardClassRoster, true);
    document.getElementById("student-form")?.addEventListener("submit", guardStudentAdd, true);
  }

  function bindTeamActions() {
    if (actionsBound) return;
    actionsBound = true;
    document.addEventListener("submit", async (event) => {
      const form = event.target.closest?.("#spark-school-team-form");
      if (!form) return;
      event.preventDefault();
      const supabase = client();
      if (!supabase || !summary?.can_manage_staff) return;
      const name = String(document.getElementById("spark-school-teacher-name")?.value || "").trim();
      const email = String(document.getElementById("spark-school-teacher-email")?.value || "").trim().toLowerCase();
      if (!email) return;
      const button = form.querySelector("button[type=submit]");
      if (button) button.disabled = true;
      const { error } = await supabase.rpc("spark_school_invite_teacher", {
        p_email: email,
        p_display_name: name,
      });
      if (button) button.disabled = false;
      if (error) {
        showNotice(error.message || "Teacher could not be added.");
        return;
      }
      form.reset();
      showNotice(`Teacher access added for ${email}.`, "success");
      await refresh();
    });

    document.addEventListener("click", async (event) => {
      const button = event.target.closest?.("[data-school-staff-remove]");
      if (!button || !summary?.can_manage_staff) return;
      const label = button.dataset.schoolStaffLabel || "this teacher";
      if (!confirm(`Remove ${label} from this Spark school licence? Their classes will stop using the shared licence and any pupil seats used only by their classes will be released.`)) return;
      const supabase = client();
      if (!supabase) return;
      button.disabled = true;
      const { error } = await supabase.rpc("spark_school_remove_teacher", {
        p_staff_id: button.dataset.schoolStaffRemove,
      });
      button.disabled = false;
      if (error) {
        showNotice(error.message || "Teacher could not be removed.");
        return;
      }
      showNotice(`${label} was removed from the school licence.`, "success");
      await refresh();
    });
  }

  function watchRoster() {
    if (observer) return;
    const targets = [document.getElementById("roster-list"), document.getElementById("class-list")].filter(Boolean);
    if (!targets.length) return;
    observer = new MutationObserver(() => scheduleRefresh(350));
    targets.forEach((target) => observer.observe(target, { childList: true, subtree: true }));
  }

  async function init() {
    ensureUi();
    bindGuards();
    watchRoster();
    const supabase = client();
    if (!supabase) {
      setTimeout(() => void init(), 400);
      return;
    }
    await refresh();
    supabase.auth.onAuthStateChange(() => scheduleRefresh(100));
    window.addEventListener("sparkaccesschange", () => scheduleRefresh(100));
    window.addEventListener("focus", () => scheduleRefresh(100));
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) scheduleRefresh(100);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => void init(), { once: true });
  else void init();
})();
