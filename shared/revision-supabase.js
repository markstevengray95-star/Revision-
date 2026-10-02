(() => {
  "use strict";

  const SUPABASE_URL = "https://emjmvgginijkupwuflla.supabase.co";
  const PUBLISHABLE_KEY = "sb_publishable_axgWqbWx-24V2b9s7mE1Fw__N3Ce61f";
  const STORAGE_KEY = "revision-supabase-session-v1";
  const listeners = new Set();
  let session = readSession();
  let refreshPromise = null;
  // Keep signed-in areas consistent when another tab signs out or changes account.
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    const previousId = session?.user?.id;
    session = readSession();
    const eventName = !session
      ? "SIGNED_OUT"
      : previousId === session.user?.id
        ? "TOKEN_REFRESHED"
        : "SIGNED_IN";
    listeners.forEach((callback) => {
      try {
        callback(eventName, session);
      } catch (error) {
        console.error(error);
      }
    });
  });

  function appError(message, extra) {
    const error = new Error(message || "Request failed.");
    if (extra && typeof extra === "object") Object.assign(error, extra);
    return error;
  }

  function readSession() {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      return value && value.access_token && value.refresh_token ? value : null;
    } catch {
      return null;
    }
  }

  function writeSession(value, eventName) {
    session = value || null;
    try {
      if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {}
    if (eventName)
      listeners.forEach((callback) => {
        try {
          callback(eventName, session);
        } catch (error) {
          console.error(error);
        }
      });
  }

  function expiresAt(value) {
    if (!value) return 0;
    if (Number(value.expires_at)) return Number(value.expires_at);
    try {
      const payload = JSON.parse(
        atob(
          value.access_token
            .split(".")[1]
            .replace(/-/g, "+")
            .replace(/_/g, "/"),
        ),
      );
      return Number(payload.exp) || 0;
    } catch {
      return 0;
    }
  }

  async function parseResponse(response) {
    const text = await response.text();
    let payload = null;
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        payload = text;
      }
    }
    if (!response.ok) {
      const message =
        payload?.message ||
        payload?.msg ||
        payload?.error_description ||
        payload?.error ||
        `Request failed (${response.status}).`;
      throw appError(String(message), {
        status: response.status,
        code: payload?.code,
        details: payload?.details,
        hint: payload?.hint,
      });
    }
    return payload;
  }

  function normaliseSession(payload) {
    if (!payload?.access_token || !payload?.refresh_token) return null;
    return {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      token_type: payload.token_type || "bearer",
      expires_in: Number(payload.expires_in) || 3600,
      expires_at:
        Number(payload.expires_at) ||
        Math.floor(Date.now() / 1000) + (Number(payload.expires_in) || 3600),
      user: payload.user || session?.user || null,
    };
  }

  async function authFetch(path, options = {}) {
    const headers = new Headers(options.headers || {});
    headers.set("apikey", PUBLISHABLE_KEY);
    headers.set("Content-Type", "application/json");
    if (options.accessToken)
      headers.set("Authorization", `Bearer ${options.accessToken}`);
    const { accessToken: _accessToken, ...requestOptions } = options;
    return fetch(`${SUPABASE_URL}${path}`, { ...requestOptions, headers });
  }

  async function refreshSession() {
    if (!session?.refresh_token)
      return { data: { session: null }, error: null };
    if (refreshPromise) return refreshPromise;
    const originalRefreshToken = session.refresh_token;
    refreshPromise = (async () => {
      try {
        const response = await authFetch(
          "/auth/v1/token?grant_type=refresh_token",
          {
            method: "POST",
            body: JSON.stringify({ refresh_token: originalRefreshToken }),
          },
        );
        const payload = await parseResponse(response);
        if (session?.refresh_token !== originalRefreshToken)
          return { data: { session }, error: null };
        const next = normaliseSession(payload);
        if (!next)
          throw appError("Supabase did not return a valid refreshed session.");
        writeSession(next, "TOKEN_REFRESHED");
        return { data: { session: next }, error: null };
      } catch (error) {
        if (session?.refresh_token !== originalRefreshToken)
          return { data: { session }, error: null };
        writeSession(null, "SIGNED_OUT");
        return { data: { session: null }, error };
      } finally {
        refreshPromise = null;
      }
    })();
    return refreshPromise;
  }

  async function getSession() {
    if (!session) return { data: { session: null }, error: null };
    const expiry = expiresAt(session);
    if (expiry && expiry <= Math.floor(Date.now() / 1000) + 60)
      return refreshSession();
    return { data: { session }, error: null };
  }

  async function accessToken() {
    const result = await getSession();
    if (result.error) throw result.error;
    if (!result.data.session?.access_token)
      throw appError("Authentication required.");
    return result.data.session.access_token;
  }

  const auth = {
    getSession,
    async signInWithPassword({ email, password }) {
      try {
        const response = await authFetch("/auth/v1/token?grant_type=password", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        });
        const payload = await parseResponse(response);
        const next = normaliseSession(payload);
        if (!next) throw appError("Sign-in did not return a valid session.");
        writeSession(next, "SIGNED_IN");
        return { data: { session: next, user: next.user }, error: null };
      } catch (error) {
        return { data: { session: null, user: null }, error };
      }
    },
    async signUp({ email, password, options = {} }) {
      try {
        const response = await authFetch("/auth/v1/signup", {
          method: "POST",
          body: JSON.stringify({ email, password, data: options.data || {} }),
        });
        const payload = await parseResponse(response);
        const next = normaliseSession(payload);
        if (next) writeSession(next, "SIGNED_IN");
        return {
          data: { session: next, user: payload?.user || next?.user || null },
          error: null,
        };
      } catch (error) {
        return { data: { session: null, user: null }, error };
      }
    },
    async signOut() {
      const current = session;
      writeSession(null, "SIGNED_OUT");
      if (current?.access_token) {
        try {
          const response = await authFetch("/auth/v1/logout", {
            method: "POST",
            accessToken: current.access_token,
          });
          if (!response.ok) await parseResponse(response);
        } catch {}
      }
      return { error: null };
    },
    onAuthStateChange(callback) {
      listeners.add(callback);
      return {
        data: {
          subscription: { unsubscribe: () => listeners.delete(callback) },
        },
      };
    },
  };

  class QueryBuilder {
    constructor(table, method = "GET", body = null) {
      this.table = table;
      this.method = method;
      this.body = body;
      this.params = new URLSearchParams();
      this.returnRepresentation = false;
      this.singleResult = false;
      this.executed = null;
    }
    select(columns = "*") {
      this.params.set("select", columns);
      if (this.method !== "GET") this.returnRepresentation = true;
      return this;
    }
    insert(payload) {
      this.method = "POST";
      this.body = payload;
      return this;
    }
    update(payload) {
      this.method = "PATCH";
      this.body = payload;
      return this;
    }
    delete() {
      this.method = "DELETE";
      this.body = null;
      return this;
    }
    eq(column, value) {
      this.params.set(column, `eq.${value}`);
      return this;
    }
    in(column, values) {
      this.params.set(column, `in.(${(values || []).join(",")})`);
      return this;
    }
    order(column, options = {}) {
      this.params.set(
        "order",
        `${column}.${options.ascending === false ? "desc" : "asc"}`,
      );
      return this;
    }
    single() {
      this.singleResult = true;
      return this.execute();
    }
    then(resolve, reject) {
      return this.execute().then(resolve, reject);
    }
    catch(reject) {
      return this.execute().catch(reject);
    }
    finally(callback) {
      return this.execute().finally(callback);
    }
    execute() {
      if (this.executed) return this.executed;
      this.executed = (async () => {
        try {
          const token = await accessToken();
          const headers = new Headers({
            apikey: PUBLISHABLE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          });
          if (this.returnRepresentation)
            headers.set("Prefer", "return=representation");
          const query = this.params.toString();
          const response = await fetch(
            `${SUPABASE_URL}/rest/v1/${encodeURIComponent(this.table)}${query ? `?${query}` : ""}`,
            {
              method: this.method,
              headers,
              body: this.body === null ? undefined : JSON.stringify(this.body),
            },
          );
          let data = await parseResponse(response);
          if (this.singleResult && Array.isArray(data)) data = data[0] ?? null;
          return { data, error: null, status: response.status };
        } catch (error) {
          return { data: null, error, status: error.status || 0 };
        }
      })();
      return this.executed;
    }
  }

  function from(table) {
    return new QueryBuilder(table);
  }

  async function rpc(name, args = {}) {
    try {
      const token = await accessToken();
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/${encodeURIComponent(name)}`,
        {
          method: "POST",
          headers: {
            apikey: PUBLISHABLE_KEY,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(args),
        },
      );
      const data = await parseResponse(response);
      return { data, error: null, status: response.status };
    } catch (error) {
      return { data: null, error, status: error.status || 0 };
    }
  }

  globalThis.revisionSupabase = { auth, from, rpc };
  globalThis.REVISION_SUPABASE_ERROR = "";
})();
