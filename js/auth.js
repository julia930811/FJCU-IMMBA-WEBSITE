(function () {
  let user = null;
  let profile = null;
  let error = "";

  function fail(msg) {
    error = msg;
    return { error: { message: msg } };
  }

  function client() {
    return window.IMMBASupabase && window.IMMBASupabase.client;
  }

  function redirectTo(file) {
    return new URL(file, location.href).href;
  }

  async function loadProfile() {
    profile = null;
    const sb = client();
    if (!sb || !user) return;
    const { data, error: e } = await sb.from("profiles").select("*").eq("id", user.id).maybeSingle();
    if (e) error = e.message;
    profile = data || null;
  }

  async function refresh() {
    error = "";
    const sb = client();
    user = null;
    profile = null;
    if (!sb) return;
    const { data } = await sb.auth.getSession();
    user = data && data.session ? data.session.user : null;
    await loadProfile();
  }

  async function signUp(email, password) {
    error = "";
    const sb = client();
    if (!sb) return fail("Supabase 尚未設定，無法註冊。");
    const { data, error: e } = await sb.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectTo("account.html") }
    });
    if (e) error = e.message;
    user = data && data.user ? data.user : null;
    if (data && data.session) await loadProfile();
    return { data, error: e };
  }

  async function signIn(email, password) {
    error = "";
    const sb = client();
    if (!sb) return fail("Supabase 尚未設定，無法登入。");
    const { data, error: e } = await sb.auth.signInWithPassword({ email, password });
    if (e) error = e.message;
    user = data && data.user ? data.user : null;
    await loadProfile();
    return { data, error: e };
  }

  async function signOut() {
    const sb = client();
    if (sb) await sb.auth.signOut();
    user = null;
    profile = null;
  }

  async function resetPassword(email) {
    error = "";
    const sb = client();
    if (!sb) return fail("Supabase 尚未設定，無法重設密碼。");
    const { data, error: e } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo("reset.html")
    });
    if (e) error = e.message;
    return { data, error: e };
  }

  async function updatePassword(password) {
    error = "";
    const sb = client();
    if (!sb) return fail("Supabase 尚未設定，無法更新密碼。");
    const { data, error: e } = await sb.auth.updateUser({ password });
    if (e) error = e.message;
    return { data, error: e };
  }

  async function listProfiles() {
    const sb = client();
    if (!sb) return [];
    const { data, error: e } = await sb.from("profiles").select("*").order("created_at", { ascending: false });
    if (e) {
      error = e.message;
      return [];
    }
    return data || [];
  }

  async function setRole(id, role) {
    const sb = client();
    if (!sb) return { error: { message: "Supabase is not configured." } };
    const { error: e } = await sb.from("profiles").update({ role }).eq("id", id);
    if (e) error = e.message;
    if (user && user.id === id) await loadProfile();
    return { error: e };
  }

  async function listAudit(limit) {
    const sb = client();
    if (!sb) return [];
    const { data, error: e } = await sb.from("audit_log").select("*").order("created_at", { ascending: false }).limit(limit || 200);
    if (e) {
      error = e.message;
      return [];
    }
    return data || [];
  }

  function role() {
    return (profile && profile.role) || "";
  }

  const Auth = {
    ready: null,
    user() { return user; },
    profile() { return profile; },
    role,
    canEdit() { return role() === "admin" || role() === "super_admin"; },
    isSuper() { return role() === "super_admin"; },
    lastError() { return error; },
    configured() { return !!(window.IMMBASupabase && window.IMMBASupabase.configured()); },
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword,
    listProfiles,
    setRole,
    listAudit,
    refresh
  };

  Auth.ready = refresh().then(() => {
    const sb = client();
    if (!sb) return;
    sb.auth.onAuthStateChange(async (event, session) => {
      user = session && session.user ? session.user : null;
      await loadProfile();
      if (event === "PASSWORD_RECOVERY" && document.body.dataset.page !== "reset") {
        location.href = "reset.html";
      }
    });
  });

  window.IMMBAAuth = Auth;
})();
