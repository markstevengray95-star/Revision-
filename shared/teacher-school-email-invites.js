(() => {
  "use strict";

  const SUPABASE_URL = "https://emjmvgginijkupwuflla.supabase.co";
  const PUBLISHABLE_KEY = "sb_publishable_axgWqbWx-24V2b9s7mE1Fw__N3Ce61f";
  const STORAGE_KEY = "revision-supabase-session-v1";
  let handlingSubmit = false;

  function decodeJwt(token) {
    try {
      const part = String(token || "").split(".")[1] || "";
      const padded = part.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((part.length + 3) % 4);
      return JSON.parse(atob(padded));
    } catch {
      return {};
    }
  }

  function captureInviteSession() {
    if (!location.hash || !location.hash.includes("access_token=")) return false;
    const params = new URLSearchParams(location.hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken) return false;

    const payload = decodeJwt(accessToken);
    const expiresIn = Number(params.get("expires_in")) || 3600;
    const session = {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: params.get("token_type") || "bearer",
      expires_in: expiresIn,
      expires_at: Number(payload.exp) || Math.floor(Date.now() / 1000) + expiresIn,
      user: {
        id: payload.sub || null,
        email: payload.email || null,
        user_metadata: payload.user_metadata || {},
        app_metadata: payload.app_metadata || {},
      },
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      return false;
    }

    const clean = new URL(location.href);
    clean.hash = "";
    if (!clean.searchParams.has("school_invite")) clean.searchParams.set("school_invite", "1");
    history.replaceState(null, "", clean.href);
    location.reload();
    return true;
  }

  if (captureInviteSession()) return;

  function client() {
    return globalThis.revisionSupabase || null;
  }

  function showNotice(message, kind = "success") {
    const notice = document.getElementById("teacher-notice");
    if (!notice) return;
    notice.textContent = message;
    notice.dataset.kind = kind;
    notice.hidden = false;
    clearTimeout(showNotice.timer);
    showNotice.timer = setTimeout(() => {
      notice.hidden = true;
    }, 6500);
  }

  async function sendInvite(email, displayName) {
    const supabase = client();
    if (!supabase) throw new Error("Spark account connection is unavailable.");
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    const token = data?.session?.access_token;
    if (!token) throw new Error("Sign in to your teacher account before inviting staff.");

    const response = await fetch(`${SUPABASE_URL}/functions/v1/spark-school-invite-email`, {
      method: "POST",
      headers: {
        apikey: PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, display_name: displayName }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok && response.status !== 207) {
      throw new Error(payload?.error || "Teacher invitation could not be sent.");
    }
    return payload;
  }

  document.addEventListener(
    "submit",
    async (event) => {
      const form = event.target.closest?.("#spark-school-team-form");
      if (!form || handlingSubmit) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      handlingSubmit = true;

      const email = String(document.getElementById("spark-school-teacher-email")?.value || "")
        .trim()
        .toLowerCase();
      const displayName = String(document.getElementById("spark-school-teacher-name")?.value || "").trim();
      const button = form.querySelector("button[type=submit]");
      const originalText = button?.textContent || "Add teacher";
      if (button) {
        button.disabled = true;
        button.textContent = "Sending invite…";
      }

      try {
        const result = await sendInvite(email, displayName);
        form.reset();
        window.dispatchEvent(new Event("sparkaccesschange"));
        if (result?.email_sent) {
          showNotice(`Teacher access added and an invitation email was sent to ${email}.`, "success");
        } else {
          showNotice(
            result?.error || `Teacher access was added for ${email}, but the email could not be sent. Re-add the same email to retry.`,
            "error",
          );
        }
      } catch (error) {
        showNotice(error?.message || "Teacher invitation could not be completed.", "error");
      } finally {
        handlingSubmit = false;
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    },
    true,
  );

  const params = new URLSearchParams(location.search);
  if (params.get("school_invite") === "1") {
    const announce = async () => {
      const supabase = client();
      if (!supabase) return;
      const { data } = await supabase.auth.getSession();
      if (!data?.session?.user) return;
      await supabase.rpc("spark_claim_school_staff_invite");
      window.dispatchEvent(new Event("sparkaccesschange"));
      showNotice("Your Spark school invitation is active. You now share your school's licence and pupil-seat pool.", "success");
      const clean = new URL(location.href);
      clean.searchParams.delete("school_invite");
      history.replaceState(null, "", clean.href);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => void announce(), { once: true });
    else void announce();
  }
})();
