(() => {
  "use strict";

  const client = globalThis.revisionSupabase;
  const accountBox = document.getElementById("spark-account-state");
  const successBox = document.getElementById("checkout-success");
  const paidLinks = [...document.querySelectorAll("a[data-stripe-link]")];
  let session = null;
  let subscription = null;

  const planNames = {
    free: "Spark Free",
    plus: "Spark Plus",
    pro: "Spark Pro",
    school: "Spark School",
    school_plus: "Spark School Plus",
    whole_school: "Spark Whole School",
  };

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setAccountMessage(html, kind = "info") {
    if (!accountBox) return;
    accountBox.dataset.kind = kind;
    accountBox.innerHTML = html;
  }

  function formatDate(value) {
    if (!value) return "";
    try {
      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date(value));
    } catch {
      return "";
    }
  }

  async function readSubscription(userId) {
    if (!client || !userId) return null;
    const { data, error } = await client
      .from("spark_subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single();
    if (error) return null;
    return data || null;
  }

  function renderAccount() {
    if (!session?.user) {
      setAccountMessage(
        `<strong>Sign in before subscribing.</strong> This lets Spark connect the Stripe subscription to the correct account. <span class="account-links"><a href="student.html">Student sign in</a><a href="teacher.html">Teacher sign in</a></span>`,
        "warning",
      );
      return;
    }

    const email = escapeHtml(session.user.email || "your account");
    if (!subscription) {
      setAccountMessage(
        `<strong>Signed in as ${email}</strong><span>Current plan: Spark Free</span>`,
        "success",
      );
      return;
    }

    const name = planNames[subscription.plan] || "Spark";
    const active = Boolean(subscription.access_active);
    const status = escapeHtml(subscription.status || "inactive").replaceAll("_", " ");
    const period = formatDate(subscription.current_period_end);
    const trial = formatDate(subscription.trial_ends_at);
    const detail = trial && subscription.status === "trialing"
      ? `Trial ends ${trial}`
      : period
        ? `${subscription.cancel_at_period_end ? "Access until" : "Renews"} ${period}`
        : status;

    setAccountMessage(
      `<strong>Signed in as ${email}</strong><span>Current plan: ${escapeHtml(name)} · ${active ? "access active" : status}${detail ? ` · ${escapeHtml(detail)}` : ""}</span>`,
      active ? "success" : "warning",
    );
  }

  function checkoutUrl(base) {
    if (!session?.user?.id || !session.user.email) return null;
    const url = new URL(base);
    url.searchParams.set("client_reference_id", session.user.id);
    url.searchParams.set("locked_prefilled_email", session.user.email);
    return url.href;
  }

  function bindCheckoutLinks() {
    paidLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        if (!session?.user) {
          setAccountMessage(
            `<strong>Please sign in first.</strong> Use <a href="student.html">My Work</a> for a student account or <a href="teacher.html">Teacher</a> for a school account, then return to Pricing.`,
            "warning",
          );
          accountBox?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        if (subscription?.access_active) {
          const name = planNames[subscription.plan] || "your current Spark plan";
          setAccountMessage(
            `<strong>${escapeHtml(name)} is already active.</strong><span>Spark has blocked a second checkout so this account is not billed twice.</span>`,
            "warning",
          );
          accountBox?.scrollIntoView({ behavior: "smooth", block: "center" });
          return;
        }
        const target = checkoutUrl(link.dataset.stripeLink || link.href);
        if (target) location.href = target;
      });
    });
  }

  async function refreshSubscription() {
    if (!session?.user?.id) {
      subscription = null;
      renderAccount();
      return null;
    }
    subscription = await readSubscription(session.user.id);
    renderAccount();
    return subscription;
  }

  async function init() {
    bindCheckoutLinks();
    if (!client) {
      setAccountMessage("<strong>Account connection unavailable.</strong> Please reload the page before subscribing.", "warning");
      return;
    }

    const { data } = await client.auth.getSession();
    session = data?.session || null;
    await refreshSubscription();

    client.auth.onAuthStateChange((_event, nextSession) => {
      session = nextSession || null;
      void refreshSubscription();
    });

    const checkoutSuccess = new URLSearchParams(location.search).get("checkout") === "success";
    if (!checkoutSuccess || !successBox) return;

    successBox.hidden = false;
    successBox.textContent = "Stripe checkout completed. Spark is syncing access to your signed-in account…";

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const current = await refreshSubscription();
      if (current?.access_active) {
        const name = planNames[current.plan] || "Spark paid";
        successBox.textContent = `${name} access is active on this account.`;
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  void init();
})();
