(() => {
  "use strict";

  let summary = null;
  let profile = null;
  let team = null;
  let started = false;

  function client() { return globalThis.revisionSupabase || null; }
  function esc(value) {
    return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
  }
  function notice(message, kind = "success") {
    const box = document.getElementById("teacher-notice");
    if (!box) return;
    box.textContent = message;
    box.dataset.kind = kind;
    box.hidden = false;
    clearTimeout(notice.timer);
    notice.timer = setTimeout(() => { box.hidden = true; }, 6500);
  }
  function styleOnce() {
    if (document.getElementById("spark-school-admin-style")) return;
    const style = document.createElement("style");
    style.id = "spark-school-admin-style";
    style.textContent = `
      .spark-school-admin-panel{margin:0 0 22px}.spark-school-admin-grid{display:grid;grid-template-columns:1.05fr .95fr;gap:18px}.spark-school-admin-card{border:1px solid var(--revision-line);background:#0d1a2a;border-radius:14px;padding:16px}.spark-school-admin-card h3{margin:0 0 10px;font-size:.9rem}.spark-school-admin-copy{margin:0 0 14px;color:var(--revision-muted);font-size:.72rem;line-height:1.55}.spark-school-profile-form{display:grid;gap:10px}.spark-school-profile-form .two{display:grid;grid-template-columns:1fr 1fr;gap:10px}.spark-school-profile-form label{display:grid;gap:5px;font-size:.67rem;color:#aebdcb}.spark-school-profile-form input{width:100%;box-sizing:border-box;border:1px solid var(--revision-line);background:#091625;color:var(--revision-text);border-radius:9px;padding:9px 10px}.spark-school-profile-form input:focus{outline:none;border-color:var(--revision-accent)}.spark-school-admin-list{display:grid;gap:8px}.spark-school-admin-row{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid #223448}.spark-school-admin-who strong,.spark-school-admin-who span{display:block}.spark-school-admin-who strong{font-size:.74rem}.spark-school-admin-who span{font-size:.64rem;color:var(--revision-muted);margin-top:3px}.spark-school-admin-role{display:inline-flex;border-radius:999px;padding:4px 8px;font-size:.58rem;font-weight:850;text-transform:uppercase;background:#17342f;color:#aee8d8}.spark-school-checks{display:grid;gap:7px;margin-top:10px}.spark-school-check{display:flex;justify-content:space-between;gap:10px;border-bottom:1px solid #223448;padding:7px 0;font-size:.68rem}.spark-school-check b.ok{color:#80e0cc}.spark-school-check b.bad{color:#f2a8a8}.spark-school-readiness{margin-top:15px;padding-top:14px;border-top:1px solid var(--revision-line)}.spark-vat-note{font-size:.65rem;line-height:1.5;color:#8fa1b3;margin:2px 0 0}.spark-school-shared-name{font-weight:850;color:#edf3f8}.spark-school-admin-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}
      @media(max-width:850px){.spark-school-admin-grid{grid-template-columns:1fr}.spark-school-profile-form .two{grid-template-columns:1fr}}
    `;
    document.head.append(style);
  }

  function ensurePanel() {
    const teamPanel = document.getElementById("spark-school-team-panel");
    const app = document.getElementById("teacher-app");
    if (!app) return null;
    let panel = document.getElementById("spark-school-admin-panel");
    if (panel) return panel;
    panel = document.createElement("section");
    panel.id = "spark-school-admin-panel";
    panel.className = "teacher-panel compact-panel spark-school-admin-panel";
    panel.hidden = true;
    panel.innerHTML = `
      <div class="panel-heading"><div><span class="teacher-eyebrow">SCHOOL SETTINGS</span><h2>School profile & admins</h2></div><span id="spark-school-role-note" class="panel-note"></span></div>
      <div class="spark-school-admin-grid">
        <article class="spark-school-admin-card">
          <h3>School & billing details</h3>
          <p id="spark-school-profile-copy" class="spark-school-admin-copy"></p>
          <form id="spark-school-profile-form" class="spark-school-profile-form" hidden>
            <label>School name<input id="spark-school-name" maxlength="120" required></label>
            <label>Legal / billing name<input id="spark-school-legal-name" maxlength="160" placeholder="Optional if same as school name"></label>
            <div class="two"><label>Billing contact<input id="spark-school-billing-contact" maxlength="120"></label><label>Billing email<input id="spark-school-billing-email" type="email" maxlength="160"></label></div>
            <label>Address line 1<input id="spark-school-address1" maxlength="160"></label>
            <label>Address line 2<input id="spark-school-address2" maxlength="160"></label>
            <div class="two"><label>Town / city<input id="spark-school-city" maxlength="100"></label><label>County / region<input id="spark-school-region" maxlength="100"></label></div>
            <div class="two"><label>Postcode<input id="spark-school-postcode" maxlength="30"></label><label>Country code<input id="spark-school-country" maxlength="2" value="GB" placeholder="GB"></label></div>
            <label>VAT number (optional)<input id="spark-school-vat" maxlength="32" placeholder="e.g. GB123456789"></label>
            <p class="spark-vat-note">VAT/tax ID is stored for billing reference and can also be maintained in Stripe Billing. Spark automatic VAT/tax calculation remains off.</p>
            <button class="teacher-button primary" type="submit">Save school details</button>
          </form>
          <div id="spark-school-profile-readonly" hidden></div>
        </article>
        <article class="spark-school-admin-card">
          <h3>School administrators</h3>
          <p class="spark-school-admin-copy">The licence owner can promote another teacher to Admin. Admins can invite and remove standard teachers and manage shared classes, but only the owner can change billing details or other admin roles.</p>
          <div id="spark-school-admin-list" class="spark-school-admin-list"></div>
          <div class="spark-school-readiness">
            <div class="panel-heading"><div><h3>Launch check</h3></div><button id="spark-school-run-check" class="teacher-button" type="button">Run setup check</button></div>
            <p class="spark-school-admin-copy">This is a non-charging diagnostic. It checks the Stripe subscription link, licence, shared seat pool and profile wiring without creating a payment.</p>
            <div id="spark-school-checks" class="spark-school-checks"></div>
          </div>
        </article>
      </div>`;
    (teamPanel || app.querySelector(".metrics-grid"))?.insertAdjacentElement("afterend", panel);
    bind(panel);
    return panel;
  }

  function value(id, fallback = "") { return document.getElementById(id)?.value ?? fallback; }
  function setValue(id, value) { const node = document.getElementById(id); if (node) node.value = value || ""; }

  function renderProfile() {
    const panel = ensurePanel();
    if (!panel) return;
    panel.hidden = !summary?.has_license;
    if (panel.hidden) return;
    const roleNote = document.getElementById("spark-school-role-note");
    if (roleNote) roleNote.textContent = summary.role === "owner" ? "Licence owner" : summary.role === "admin" ? "School admin" : "Teacher";
    const form = document.getElementById("spark-school-profile-form");
    const readonly = document.getElementById("spark-school-profile-readonly");
    const copy = document.getElementById("spark-school-profile-copy");
    const canEdit = Boolean(profile?.can_edit_billing);
    if (copy) copy.textContent = canEdit ? "Keep the school identity and invoice contact details together. VAT number is optional." : "School billing details are controlled by the licence owner.";
    if (form) form.hidden = !canEdit;
    if (readonly) {
      readonly.hidden = canEdit;
      readonly.innerHTML = `<span class="spark-school-shared-name">${esc(profile?.school_name || summary.school_name || "School licence")}</span><p class="spark-school-admin-copy">Shared ${esc(summary.plan || "school").replaceAll("_", " ")} licence · ${Number(summary.used || 0)} / ${Number(summary.seat_limit || 0)} pupil seats used.</p>`;
    }
    if (!canEdit) return;
    const b = profile?.billing || {};
    setValue("spark-school-name", profile?.school_name || summary.school_name || "");
    setValue("spark-school-legal-name", b.legal_name || "");
    setValue("spark-school-billing-contact", b.billing_contact_name || "");
    setValue("spark-school-billing-email", b.billing_email || "");
    setValue("spark-school-address1", b.address_line1 || "");
    setValue("spark-school-address2", b.address_line2 || "");
    setValue("spark-school-city", b.city || "");
    setValue("spark-school-region", b.region || "");
    setValue("spark-school-postcode", b.postal_code || "");
    setValue("spark-school-country", b.country_code || "GB");
    setValue("spark-school-vat", b.vat_number || "");
  }

  function renderAdmins() {
    const list = document.getElementById("spark-school-admin-list");
    if (!list) return;
    list.replaceChildren();
    const owner = team?.owner;
    if (owner) list.append(adminRow(owner, true));
    (team?.members || []).forEach((member) => list.append(adminRow(member, false)));
  }

  function adminRow(member, owner) {
    const row = document.createElement("div");
    row.className = "spark-school-admin-row";
    const who = document.createElement("div");
    who.className = "spark-school-admin-who";
    who.innerHTML = `<strong>${esc(member.display_name || member.email || "Teacher")}</strong><span>${esc(member.email || "")}</span>`;
    const actions = document.createElement("div");
    actions.className = "spark-school-admin-actions";
    const badge = document.createElement("span");
    badge.className = "spark-school-admin-role";
    badge.textContent = owner ? "Owner" : member.role === "admin" ? "Admin" : "Teacher";
    actions.append(badge);
    if (!owner && summary?.can_manage_admins && member.id) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "mini-button";
      button.dataset.sparkStaffRoleId = member.id;
      button.dataset.sparkStaffRole = member.role === "admin" ? "teacher" : "admin";
      button.textContent = member.role === "admin" ? "Make teacher" : "Make admin";
      actions.append(button);
    }
    row.append(who, actions);
    return row;
  }

  function renderChecks(result) {
    const target = document.getElementById("spark-school-checks");
    if (!target) return;
    target.replaceChildren();
    const labels = {
      signed_in: "Signed in",
      school_subscription: "School plan recognised",
      subscription_active: "Subscription active",
      stripe_customer_linked: "Stripe customer linked",
      stripe_subscription_linked: "Stripe subscription linked",
      school_licence: "School licence created",
      licence_active: "School licence active",
      seat_limit_matches_plan: "Seat limit matches plan",
      seat_pool_within_limit: "Seat pool within allowance",
      school_profile_named: "School name completed",
      billing_profile_started: "Billing profile started",
    };
    Object.entries(result?.checks || {}).forEach(([key, ok]) => {
      const line = document.createElement("div");
      line.className = "spark-school-check";
      line.innerHTML = `<span>${esc(labels[key] || key)}</span><b class="${ok ? "ok" : "bad"}">${ok ? "Ready" : "Check"}</b>`;
      target.append(line);
    });
    if (result) {
      const head = document.createElement("div");
      head.className = "spark-school-check";
      head.innerHTML = `<span>Overall</span><b class="${result.ready ? "ok" : "bad"}">${result.ready ? "Ready" : esc(String(result.stage || "Check setup").replaceAll("_", " "))}</b>`;
      target.prepend(head);
    }
  }

  async function refresh() {
    const supabase = client();
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    if (!data?.session?.user) {
      summary = profile = team = null;
      const panel = document.getElementById("spark-school-admin-panel");
      if (panel) panel.hidden = true;
      return;
    }
    const [s, p, t] = await Promise.all([
      supabase.rpc("spark_school_license_summary"),
      supabase.rpc("spark_school_profile_get"),
      supabase.rpc("spark_school_staff_list"),
    ]);
    summary = s.error ? null : s.data;
    profile = p.error ? null : p.data;
    team = t.error ? null : t.data;
    styleOnce();
    renderProfile();
    renderAdmins();
  }

  function bind(panel) {
    if (panel.dataset.bound === "1") return;
    panel.dataset.bound = "1";
    panel.addEventListener("submit", async (event) => {
      if (event.target.id !== "spark-school-profile-form") return;
      event.preventDefault();
      const supabase = client();
      const button = event.target.querySelector("button[type=submit]");
      if (button) button.disabled = true;
      const { data, error } = await supabase.rpc("spark_school_profile_update", {
        p_school_name: value("spark-school-name"),
        p_legal_name: value("spark-school-legal-name"),
        p_billing_contact_name: value("spark-school-billing-contact"),
        p_billing_email: value("spark-school-billing-email"),
        p_address_line1: value("spark-school-address1"),
        p_address_line2: value("spark-school-address2"),
        p_city: value("spark-school-city"),
        p_region: value("spark-school-region"),
        p_postal_code: value("spark-school-postcode"),
        p_country_code: value("spark-school-country") || "GB",
        p_vat_number: value("spark-school-vat"),
      });
      if (button) button.disabled = false;
      if (error) return notice(error.message || "School details could not be saved.", "error");
      profile = data;
      notice("School and billing details saved.");
      await refresh();
    });

    panel.addEventListener("click", async (event) => {
      const roleButton = event.target.closest?.("[data-spark-staff-role-id]");
      if (roleButton) {
        roleButton.disabled = true;
        const { error } = await client().rpc("spark_school_set_staff_role", {
          p_staff_id: roleButton.dataset.sparkStaffRoleId,
          p_role: roleButton.dataset.sparkStaffRole,
        });
        roleButton.disabled = false;
        if (error) return notice(error.message || "Teacher role could not be changed.", "error");
        notice(roleButton.dataset.sparkStaffRole === "admin" ? "Teacher promoted to school admin." : "Admin changed back to teacher.");
        await refresh();
        window.dispatchEvent(new Event("sparkaccesschange"));
        return;
      }
      if (event.target.closest?.("#spark-school-run-check")) {
        const button = event.target.closest("#spark-school-run-check");
        button.disabled = true;
        button.textContent = "Checking…";
        const { data, error } = await client().rpc("spark_school_readiness_check");
        button.disabled = false;
        button.textContent = "Run setup check";
        if (error) return notice(error.message || "Setup check could not run.", "error");
        renderChecks(data);
        notice(data?.ready ? "Spark school setup checks passed." : "Setup check completed. Review the items marked Check.", data?.ready ? "success" : "info");
      }
    });
  }

  function start() {
    if (started) return;
    started = true;
    styleOnce();
    ensurePanel();
    void refresh();
    client()?.auth?.onAuthStateChange?.(() => setTimeout(() => void refresh(), 250));
    window.addEventListener("sparkaccesschange", () => setTimeout(() => void refresh(), 250));
    const observer = new MutationObserver(() => {
      ensurePanel();
      if (summary?.has_license && document.getElementById("spark-school-admin-panel")?.hidden) renderProfile();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
