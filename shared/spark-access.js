(() => {
  "use strict";

  const script = document.currentScript || [...document.scripts].find((s) => /shared\/spark-access\.js/.test(s.src));
  if (!script) return;
  const root = new URL("../", script.src);
  const state = {
    ready: false,
    session: null,
    subscription: null,
    plan: "free",
    accessActive: false,
  };
  let client = globalThis.revisionSupabase || null;
  let observer = null;

  const rank = (plan) => ({ free: 0, plus: 1, pro: 2, school: 2, school_plus: 2, whole_school: 2 }[plan] ?? 0);
  const planName = (plan) => ({
    free: "Free",
    plus: "Plus",
    pro: "Pro",
    school: "School",
    school_plus: "School Plus",
    whole_school: "Whole School",
  }[plan] || "Free");

  function allowed(required = "free") {
    if (required === "free") return true;
    if (!state.accessActive) return false;
    return rank(state.plan) >= rank(required);
  }

  function requirementForUrl(urlLike) {
    let url;
    try { url = new URL(urlLike, location.href); } catch { return null; }
    if (url.origin !== location.origin) return null;
    const path = url.pathname.startsWith(root.pathname) ? url.pathname.slice(root.pathname.length) : url.pathname.replace(/^\//, "");
    if (path === "pricing.html" || path === "student.html" || path === "teacher.html" || path === "index.html" || path === "") return null;
    if (path === "practice.html" && url.searchParams.get("level") === "alevel") return "pro";
    if (path.startsWith("courses/alevel/")) return "pro";
    if (path.startsWith("tools/alevel-marking")) return "pro";
    if (path.startsWith("tools/question-bank/")) return "plus";
    if (path.startsWith("tools/full-papers/")) return "plus";
    if (path.startsWith("tools/gcse-exam")) return "plus";
    if (path.startsWith("tools/practical-sim/")) return "plus";
    return null;
  }

  function currentRequirement() {
    return requirementForUrl(location.href);
  }

  function addStyles() {
    if (document.getElementById("spark-access-style")) return;
    const style = document.createElement("style");
    style.id = "spark-access-style";
    style.textContent = `
      .spark-plan-pill{display:inline-flex;align-items:center;gap:5px;margin-left:6px;padding:4px 8px;border:1px solid #355064;border-radius:999px;color:#a4b4c5;font-size:.66rem;font-weight:800;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}
      .spark-plan-pill[data-active="true"]{border-color:#2e514b;background:#15342f;color:#bff5e7}
      a[data-spark-locked="true"]{position:relative;opacity:.72}
      a[data-spark-locked="true"]::after{content:"LOCKED";margin-left:7px;padding:2px 5px;border:1px solid #52677c;border-radius:999px;font-size:.55rem;letter-spacing:.06em;vertical-align:middle;color:#c5d1dc}
      .spark-access-gate{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:24px;background:rgba(6,13,23,.94);backdrop-filter:blur(14px);font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;color:#edf3f8}
      .spark-access-gate-card{width:min(560px,100%);padding:30px;border:1px solid #2a3b4f;border-radius:22px;background:#111f30;box-shadow:0 28px 80px rgba(0,0,0,.35);text-align:center}
      .spark-access-gate-card .spark-gate-kicker{display:inline-block;margin-bottom:12px;color:#80e0cc;font-size:.75rem;font-weight:850;letter-spacing:.11em;text-transform:uppercase}
      .spark-access-gate-card h1{margin:0 0 12px;font-size:clamp(1.8rem,5vw,2.7rem);letter-spacing:-.04em}.spark-access-gate-card p{margin:0 auto 22px;max-width:460px;color:#a4b4c5;line-height:1.65}
      .spark-access-gate-actions{display:flex;gap:10px;justify-content:center;flex-wrap:wrap}.spark-access-gate-actions a{padding:11px 15px;border-radius:10px;border:1px solid #355064;color:#edf3f8;text-decoration:none;font-weight:800}.spark-access-gate-actions a:first-child{background:#80e0cc;border-color:#80e0cc;color:#07151d}
    `;
    document.head.append(style);
  }

  async function ensureClient() {
    if (client) return client;
    const existing = [...document.scripts].find((s) => /shared\/revision-supabase\.js/.test(s.src));
    if (existing) {
      await new Promise((resolve) => {
        if (globalThis.revisionSupabase) return resolve();
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", resolve, { once: true });
        setTimeout(resolve, 2500);
      });
      client = globalThis.revisionSupabase || null;
      if (client) return client;
    }
    await new Promise((resolve) => {
      const node = document.createElement("script");
      node.src = new URL("shared/revision-supabase.js", root).href;
      node.onload = resolve;
      node.onerror = resolve;
      document.head.append(node);
    });
    client = globalThis.revisionSupabase || null;
    return client;
  }

  async function readState() {
    const supabase = await ensureClient();
    state.session = null;
    state.subscription = null;
    state.plan = "free";
    state.accessActive = false;
    if (!supabase) return state;

    const { data } = await supabase.auth.getSession();
    state.session = data?.session || null;
    if (!state.session?.user?.id) return state;

    const { data: subscription, error } = await supabase
      .from("spark_subscriptions")
      .select("*")
      .eq("user_id", state.session.user.id)
      .single();
    if (!error && subscription) {
      state.subscription = subscription;
      state.plan = subscription.plan || "free";
      state.accessActive = Boolean(subscription.access_active);
    }
    return state;
  }

  function updatePlanPill() {
    const bar = document.querySelector(".revision-bar-inner");
    if (!bar) return;
    let pill = document.getElementById("spark-plan-pill");
    if (!pill) {
      pill = document.createElement("span");
      pill.id = "spark-plan-pill";
      pill.className = "spark-plan-pill";
      pill.title = "Spark subscription access";
      bar.append(pill);
    }
    pill.dataset.active = String(state.accessActive);
    pill.textContent = state.accessActive ? `Spark ${planName(state.plan)}` : "Spark Free";
  }

  function decorateLinks(scope = document) {
    const links = scope.querySelectorAll ? scope.querySelectorAll("a[href]") : [];
    links.forEach((link) => {
      if (link.closest(".spark-access-gate")) return;
      const required = requirementForUrl(link.href);
      if (!required) {
        delete link.dataset.sparkRequired;
        delete link.dataset.sparkLocked;
        return;
      }
      link.dataset.sparkRequired = required;
      link.dataset.sparkLocked = String(!allowed(required));
      if (link.dataset.sparkGuardBound === "true") return;
      link.dataset.sparkGuardBound = "true";
      link.addEventListener("click", (event) => {
        const need = link.dataset.sparkRequired;
        if (!need || allowed(need)) return;
        event.preventDefault();
        const pricing = new URL("pricing.html", root);
        pricing.searchParams.set("required", need);
        pricing.searchParams.set("return", location.pathname + location.search + location.hash);
        location.href = pricing.href;
      });
    });
  }

  function removeGate() {
    document.getElementById("spark-access-gate")?.remove();
    document.documentElement.style.removeProperty("overflow");
  }

  function renderGate(required) {
    if (!required || allowed(required)) {
      removeGate();
      return;
    }
    let gate = document.getElementById("spark-access-gate");
    if (gate) return;
    gate = document.createElement("div");
    gate.id = "spark-access-gate";
    gate.className = "spark-access-gate";
    const signedIn = Boolean(state.session?.user);
    const name = required === "pro" ? "Spark Pro" : "Spark Plus";
    gate.innerHTML = `
      <section class="spark-access-gate-card" role="dialog" aria-modal="true" aria-labelledby="spark-gate-title">
        <span class="spark-gate-kicker">Premium Spark content</span>
        <h1 id="spark-gate-title">${name} access required</h1>
        <p>${signedIn ? `This account is currently on ${state.accessActive ? `Spark ${planName(state.plan)}` : "Spark Free"}.` : "Sign in or choose a plan to open this feature."} Active subscriptions unlock automatically after Stripe confirms payment.</p>
        <div class="spark-access-gate-actions">
          <a href="${new URL("pricing.html", root).href}">View plans</a>
          <a href="${new URL(signedIn ? "index.html" : "student.html", root).href}">${signedIn ? "Back to dashboard" : "Sign in"}</a>
        </div>
      </section>`;
    document.body.append(gate);
    document.documentElement.style.overflow = "hidden";
  }

  function applyState() {
    document.documentElement.dataset.sparkPlan = state.plan;
    document.documentElement.dataset.sparkAccess = state.accessActive ? "active" : "free";
    updatePlanPill();
    decorateLinks(document);
    renderGate(currentRequirement());
    window.dispatchEvent(new CustomEvent("sparkaccesschange", { detail: { ...state } }));
  }

  async function refresh() {
    await readState();
    state.ready = true;
    applyState();
    return { ...state };
  }

  function watchDom() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) decorateLinks(node);
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  globalThis.SparkAccess = {
    state,
    refresh,
    canAccess: allowed,
    requiredFor: requirementForUrl,
  };

  async function init() {
    addStyles();
    watchDom();
    await refresh();
    if (client) {
      client.auth.onAuthStateChange(() => { void refresh(); });
    }
    window.addEventListener("focus", () => { void refresh(); });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) void refresh();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { void init(); }, { once: true });
  else void init();
})();
