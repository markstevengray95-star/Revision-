(() => {
  'use strict';
  const url = 'https://emjmvgginijkupwuflla.supabase.co';
  const key = 'sb_publishable_axgWqbWx-24V2b9s7mE1Fw__N3Ce61f';
  const factory = globalThis.supabase && globalThis.supabase.createClient;
  if (!factory) {
    globalThis.REVISION_SUPABASE_ERROR = 'Supabase library failed to load.';
    return;
  }
  globalThis.revisionSupabase = factory(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });
})();
