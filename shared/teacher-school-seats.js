(() => {
  "use strict";

  let summary = null;
  let seatEmails = new Set();
  let currentUserId = null;
  let refreshTimer = null;
  let observer = null;

  const planNames = {
    school: "Spark School",
    school_plus: "Spark School Plus",
    whole_school: "Spark Whole School",
  };

  function client() {
    return globalThis.revisionSupabase || null;
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
      `;
      document.head.append(style);
      card = document.createElement("article");
      card.id = "metric-school-seats-card";
      card.className = "metric-card";
      card.innerHTML = `<span>School seats</span><strong id="metric-school-seats">—</strong><small id="metric-school-seats-note">No school licence</small><span id="metric-school-seats-plan" class="seat-plan"></span>`;
      grid.append(card);
    }
    return card;
  }

  function render() {
    const card = ensureUi();
    if (!card) return;
    const count = document.getElementById("metric-school-seats");
    const note = document.getElementById("metric-school-seats-note");
    const plan = document.getElementById("metric-school-seats-plan");
    if (!summary?.has_license) {
      card.dataset.active = "false";
      count.textContent = "—";
      note.textContent = "school licence required";
      plan.textContent = "";
      card.title = "Choose a Spark School plan to allocate pupil seats.";
      return;
    }
    card.dataset.active = String(Boolean(summary.access_active));
    count.textContent = `${Number(summary.used || 0)} / ${Number(summary.seat_limit || 0)}`;
    note.textContent = summary.access_active
      ? `${Number(summary.active || 0)} active · ${Number(summary.reserved || 0)} reserved · ${Number(summary.available || 0)} available`
      : `licence ${String(summary.status || "inactive").replaceAll("_", " ")}`;
    plan.textContent = planNames[summary.plan] || "Spark School";
    card.title = summary.access_active
      ? "A unique pupil uses one seat even when they belong to several classes."
      : "This school licence is not currently granting pupil access.";
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
      seatEmails = new Set();
      render();
      return;
    }

    const [summaryResult, seatsResult] = await Promise.all([
      supabase.rpc("spark_school_license_summary"),
      supabase
        .from("spark_school_seats")
        .select("student_email,status")
        .eq("license_owner_id", currentUserId),
    ]);

    if (summaryResult.error) {
      summary = null;
      seatEmails = new Set();
      render();
      return;
    }
    summary = summaryResult.data || null;
    seatEmails = new Set(
      (seatsResult.data || [])
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
      `This roster needs ${newEmails.length} new Spark seats, but only ${Number(summary.available || 0)} are available on the ${Number(summary.seat_limit || 0)}-seat school licence.`,
    );
  }

  function guardStudentAdd(event) {
    if (!activeSchoolLicence()) return;
    const email = String(document.getElementById("student-email")?.value || "").trim().toLowerCase();
    if (!email || seatEmails.has(email) || Number(summary.available || 0) > 0) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    showNotice(
      `All ${Number(summary.seat_limit || 0)} school seats are currently in use. Remove a pupil from their final class or upgrade the school plan before adding another email.`,
    );
  }

  function bindGuards() {
    document.getElementById("class-form")?.addEventListener("submit", guardClassRoster, true);
    document.getElementById("student-form")?.addEventListener("submit", guardStudentAdd, true);
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
