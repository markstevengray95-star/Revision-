(() => {
  "use strict";

  const script = document.currentScript || [...document.scripts].find((s) => /shared\/spark-access\.js/.test(s.src));
  if (!script) return;
  const root = new URL("../", script.src);
  const state = {
    ready: false,
    session: null,
    subscription: null,
    entitlement: null,
    plan: "free",
    accessActive: false,
    accessSource: "free",
    schoolPlan: null,
  };
  let client = globalThis.revisionSupabase || null;
  let observer = null;
  let routePatched = false;
  const FREE_GCSE_TOPICS = new Set(["b1", "c1", "p1"]);

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

  function gcseTopicRequirement(topicId) {
    if (!topicId || FREE_GCSE_TOPICS.has(String(topicId).toLowerCase())) return null;
    return "plus";
  }

  function requirementForUrl(urlLike) {
    let url;
    try { url = new URL(urlLike, location.href); } catch { return null; }
    if (url.origin !== location.origin) return null;
    const path = url.pathname.startsWith(root.pathname) ? url.pathname.slice(root.pathname.length) : url.pathname.replace(/^\//, "");
    if (path === "pricing.html" || path === "student.html" || path === "teacher.html" || path === "index.html" || path === "") return null;
    if (path === "practice.html" && url.searchParams.get("level") === "alevel") return "pro";
    if (path.startsWith("courses/alevel/")) return "pro";
    if (path.startsWith("courses/gcse/")) return gcseTopicRequirement(url.searchParams.get("topic"));
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
      .topic-card[data-spark-locked="true"]{position:relative;opacity:.68}
      .topic-card[data-spark-locked="true"]::after{content:"PLUS";position:absolute;right:12px;bottom:12px;padding:4px 7px;border:1px solid #52677c;background:#111f30;border-radius:999px;font-size:.58rem;font-weight:900;letter-spacing:.07em;color:#c5d1dc}
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
    state.entitlement = null;
    state.plan = "free";
    state.accessActive = false;
    state.accessSource = "free";
    state.schoolPlan = null;
    if (!supabase) return state;

    const { data } = await supabase.auth.getSession();
    state.session = data?.session || null;
    if (!state.session?.user?.id) return state;

    const [{ data: directSubscription }, { data: access, error: accessError }] = await Promise.all([
      supabase.from("spark_subscriptions").select("*").eq("user_id", state.session.user.id).maybeSingle(),
      supabase.rpc("spark_get_access"),
    ]);
    state.subscription = directSubscription || null;
    if (!accessError && access) {
      state.entitlement = access;
      state.plan = access.plan || "free";
      state.accessActive = Boolean(access.access_active);
      state.accessSource = access.source || "free";
      state.schoolPlan = access.school_plan || null;
    } else if (directSubscription) {
      state.plan = directSubscription.plan || "free";
      state.accessActive = Boolean(directSubscription.access_active);
      state.accessSource = state.accessActive ? "individual" : "free";
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
    if (!state.accessActive) pill.textContent = "Spark Free";
    else if (state.accessSource === "school") pill.textContent = `Spark ${planName(state.schoolPlan || "school")}`;
    else pill.textContent = `Spark ${planName(state.plan)}`;
  }

  function allAnchors(scope) {
    const links = [];
    if (scope?.matches?.("a[href]")) links.push(scope);
    if (scope?.querySelectorAll) links.push(...scope.querySelectorAll("a[href]"));
    return links;
  }

  function decorateLinks(scope = document) {
    allAnchors(scope).forEach((link) => {
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
        event.stopImmediatePropagation();
        goToPricing(need);
      }, true);
    });
  }

  function allTopicCards(scope) {
    const cards = [];
    if (scope?.matches?.(".topic-card[data-topic]")) cards.push(scope);
    if (scope?.querySelectorAll) cards.push(...scope.querySelectorAll(".topic-card[data-topic]"));
    return cards;
  }

  function decorateGcseTopicCards(scope = document) {
    allTopicCards(scope).forEach((card) => {
      const required = gcseTopicRequirement(card.dataset.topic);
      card.dataset.sparkLocked = String(Boolean(required && !allowed(required)));
      if (card.dataset.sparkTopicGuardBound === "true") return;
      card.dataset.sparkTopicGuardBound = "true";
      card.addEventListener("click", (event) => {
        const need = gcseTopicRequirement(card.dataset.topic);
        if (!need || allowed(need)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        goToPricing(need);
      }, true);
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        const need = gcseTopicRequirement(card.dataset.topic);
        if (!need || allowed(need)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        goToPricing(need);
      }, true);
    });
  }

  function goToPricing(required) {
    const pricing = new URL("pricing.html", root);
    pricing.searchParams.set("required", required);
    pricing.searchParams.set("return", location.pathname + location.search + location.hash);
    location.href = pricing.href;
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
        <p>${signedIn ? `This account is currently on ${state.accessActive ? (state.accessSource === "school" ? `a Spark ${planName(state.schoolPlan || "school")} licence` : `Spark ${planName(state.plan)}`) : "Spark Free"}.` : "Sign in or choose a plan to open this feature."} Active subscriptions and school seats unlock automatically.</p>
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
    document.documentElement.dataset.sparkAccessSource = state.accessSource;
    updatePlanPill();
    decorateLinks(document);
    decorateGcseTopicCards(document);
    renderGate(currentRequirement());
    window.dispatchEvent(new CustomEvent("sparkaccesschange", { detail: { ...state } }));
  }

  async function refresh() {
    await readState();
    state.ready = true;
    applyState();
    return { ...state };
  }

  function routeChanged() {
    decorateLinks(document);
    decorateGcseTopicCards(document);
    renderGate(currentRequirement());
  }

  function patchHistory() {
    if (routePatched) return;
    routePatched = true;
    for (const method of ["pushState", "replaceState"]) {
      const original = history[method];
      history[method] = function (...args) {
        const result = original.apply(this, args);
        queueMicrotask(routeChanged);
        return result;
      };
    }
    window.addEventListener("popstate", routeChanged);
    window.addEventListener("hashchange", routeChanged);
  }

  function watchDom() {
    if (observer) return;
    observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;
          decorateLinks(node);
          decorateGcseTopicCards(node);
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
    freeGcseTopics: [...FREE_GCSE_TOPICS],
  };

  async function init() {
    addStyles();
    patchHistory();
    watchDom();
    await refresh();
    if (client) client.auth.onAuthStateChange(() => { void refresh(); });
    window.addEventListener("focus", () => { void refresh(); });
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) void refresh();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { void init(); }, { once: true });
  else void init();
})();
