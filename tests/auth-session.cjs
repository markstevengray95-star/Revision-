const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const source = fs.readFileSync(
  path.join(__dirname, "../shared/revision-supabase.js"),
  "utf8",
);
const storageKey = "revision-supabase-session-v1";
const response = (payload, status = 200) => ({
  ok: status < 400,
  status,
  text: async () => JSON.stringify(payload),
});
const session = (id, expired = false) => ({
  access_token: `access-${id}`,
  refresh_token: `refresh-${id}`,
  user: { id },
  expires_at: Math.floor(Date.now() / 1000) + (expired ? -10 : 3600),
});
function setup(initial) {
  const storage = new Map([[storageKey, JSON.stringify(initial)]]);
  const events = new Map();
  let completeRefresh,
    refreshRequests = 0;
  const context = vm.createContext({
    Headers,
    URLSearchParams,
    console,
    atob,
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    },
    window: {
      addEventListener: (name, callback) => events.set(name, callback),
    },
    fetch: async (url) => {
      if (url.includes("grant_type=refresh_token")) {
        ++refreshRequests;
        return new Promise((resolve) => {
          completeRefresh = resolve;
        });
      }
      assert.ok(url.endsWith("/auth/v1/logout"), "Unexpected network request");
      return response(null, 204);
    },
  });
  vm.runInContext(source, context);
  return {
    auth: context.revisionSupabase.auth,
    storage,
    complete: (payload, status) => completeRefresh(response(payload, status)),
    requests: () => refreshRequests,
    otherTab(next) {
      if (next) storage.set(storageKey, JSON.stringify(next));
      else storage.delete(storageKey);
      events.get("storage")({ key: storageKey });
    },
  };
}
async function run() {
  // A late refresh must not revive a session after the user signs out.
  const signedOut = setup(session("student", true));
  const a = signedOut.auth.getSession(),
    b = signedOut.auth.getSession();
  assert.equal(
    signedOut.requests(),
    1,
    "Concurrent refreshes share one request",
  );
  await signedOut.auth.signOut();
  signedOut.complete(session("student"));
  assert.equal((await a).data.session, null);
  assert.equal((await b).data.session, null);
  assert.equal(signedOut.storage.has(storageKey), false);

  // Neither a successful nor failed refresh from a previous account may
  // overwrite the account another tab has just signed in to.
  for (const status of [200, 401]) {
    const switched = setup(session("previous", true));
    const pending = switched.auth.getSession();
    switched.otherTab(session("current"));
    switched.complete(
      status === 200 ? session("previous") : { message: "Expired token" },
      status,
    );
    const result = await pending;
    assert.equal(result.error, null);
    assert.equal(result.data.session.user.id, "current");
    assert.equal(
      JSON.parse(switched.storage.get(storageKey)).user.id,
      "current",
    );
  }

  const tabs = setup(session("student"));
  const notifications = [];
  tabs.auth.onAuthStateChange((event, value) =>
    notifications.push([event, value?.user?.id]),
  );
  tabs.otherTab(session("teacher"));
  assert.equal((await tabs.auth.getSession()).data.session.user.id, "teacher");
  tabs.otherTab(session("teacher"));
  tabs.otherTab(null);
  assert.deepEqual(notifications, [
    ["SIGNED_IN", "teacher"],
    ["TOKEN_REFRESHED", "teacher"],
    ["SIGNED_OUT", undefined],
  ]);
  assert.equal((await tabs.auth.getSession()).data.session, null);
  console.log(
    "Auth session tests passed: refresh coalescing, sign-out races, account switching and cross-tab events.",
  );
}
run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
