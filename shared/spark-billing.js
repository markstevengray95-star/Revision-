(() => {
  "use strict";

  const INDIVIDUAL_PORTAL = "https://billing.stripe.com/p/login/7sYaEY2lRcHc3Ch2KR5AQ01";
  const SCHOOL_PORTAL = "https://billing.stripe.com/p/login/3cI28sf8D36C2yd85b5AQ02";
  let lastKey = "";

  function client() {
    return globalThis.revisionSupabase || null;
  }

  function styleOnce() {
    if (document.getElementById("spark-billing-style")) return;
    const style = document.createElement("style");
    style.id = "spark-billing-style";
    style.textContent = `
      .spark-billing-actions{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
      .spark-billing-link{display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid #355064;background:#18283b;color:#edf3f8!important;border-radius:9px;padding:8px 11px;text-decoration:none!important;font-size:.72rem;font-weight:850;white-space:nowrap}
      .spark-billing-link:hover{transform:translateY(-1px);border-color:#80e0cc}.spark-billing-note{font-size:.68rem;color:#91a3b5}
      .account-strip .spark-billing-actions{margin-left:auto}
      @media(max-width:720px){.account-strip .spark-billing-actions{width:100%;margin-left:0}.spark-billing-link{width:100%}}
    `;
    document.head.append(style);
  }

  async function state() {
    const supabase = client();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user) return null;
    const [accessResult, directResult, schoolResult] = await Promise.all([
      supabase.rpc("spark_get_access"),
      supabase.from("spark_subscriptions").select("plan,status,access_active,stripe_customer_id").eq("user_id", user.id).single(),
      supabase.rpc("spark_school_license_summary"),
    ]);
    return {
      user,
      access: accessResult.error ? null : accessResult.data,
      direct: directResult.error ? null : directResult.data,
      school: schoolResult.error ? null : schoolResult.data,
    };
  }

  function clear() {
    document.querySelectorAll("[data-spark-billing-ui]").forEach((node) => node.remove());
  }

  function makeLink(href, label) {
    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.className = "spark-billing-link";
    a.textContent = label;
    return a;
  }

  function renderPricing(snapshot) {
    const account = document.getElementById("spark-account-state");
    if (!account || !snapshot) return;
    const wrap = document.createElement("span");
    wrap.dataset.sparkBillingUi = "pricing";
    wrap.className = "spark-billing-actions";

    if (snapshot.access?.source === "school") {
      if (snapshot.access?.school_role === "owner") {
        wrap.append(makeLink(SCHOOL_PORTAL, "Manage school billing"));
      } else {
        const note = document.createElement("span");
        note.className = "spark-billing-note";
        note.textContent = "Billing is managed by your school licence owner.";
        wrap.append(note);
      }
    } else if (snapshot.direct?.access_active && snapshot.direct?.stripe_customer_id) {
      wrap.append(makeLink(INDIVIDUAL_PORTAL, "Manage billing"));
    }

    if (wrap.childNodes.length) account.append(wrap);
  }

  function renderTeacher(snapshot) {
    const strip = document.querySelector(".account-strip");
    if (!strip || !snapshot?.school?.has_license) return;
    const wrap = document.createElement("div");
    wrap.dataset.sparkBillingUi = "teacher";
    wrap.className = "spark-billing-actions";
    if (snapshot.school.role === "owner") {
      wrap.append(makeLink(SCHOOL_PORTAL, "Manage billing & invoices"));
    } else {
      const note = document.createElement("span");
      note.className = "spark-billing-note";
      note.textContent = snapshot.school.role === "admin" ? "School billing is owner-only." : "Shared school licence";
      wrap.append(note);
    }
    strip.append(wrap);
  }

  async function refresh() {
    styleOnce();
    const snapshot = await state();
    const key = snapshot ? `${snapshot.user.id}:${snapshot.access?.source || "none"}:${snapshot.school?.role || ""}:${snapshot.direct?.plan || ""}:${snapshot.direct?.access_active || false}` : "signed-out";
    if (key === lastKey && document.querySelector("[data-spark-billing-ui]")) return;
    lastKey = key;
    clear();
    if (!snapshot) return;
    renderPricing(snapshot);
    renderTeacher(snapshot);
  }

  function start() {
    void refresh();
    const supabase = client();
    supabase?.auth?.onAuthStateChange?.(() => setTimeout(() => void refresh(), 200));
    window.addEventListener("sparkaccesschange", () => setTimeout(() => void refresh(), 200));
    window.addEventListener("focus", () => void refresh());
    document.addEventListener("visibilitychange", () => { if (!document.hidden) void refresh(); });
    const observer = new MutationObserver(() => {
      if ((document.getElementById("spark-account-state") || document.querySelector(".account-strip")) && !document.querySelector("[data-spark-billing-ui]")) void refresh();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
