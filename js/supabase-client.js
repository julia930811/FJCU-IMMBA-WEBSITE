(function () {
  function env() {
    return window.IMMBA_ENV || {};
  }

  function create() {
    const url = (env().VITE_SUPABASE_URL || "").trim();
    const key = (env().VITE_SUPABASE_ANON_KEY || "").trim();
    if (!url || !key || !window.supabase || typeof window.supabase.createClient !== "function") {
      return null;
    }
    return window.supabase.createClient(url, key);
  }

  window.IMMBASupabase = {
    client: create(),
    configured() {
      const e = env();
      return !!(e.VITE_SUPABASE_URL && e.VITE_SUPABASE_ANON_KEY && this.client);
    }
  };
})();
