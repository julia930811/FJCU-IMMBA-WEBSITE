(function () {
  let user = null;
  let profile = null;
  let error = "";

  function fail(msg) {
    error = msg;
    return { error: { message: msg } };
  }

  function notify() {
    window.dispatchEvent(new CustomEvent("immba-auth"));
  }

  function client() {
    return window.IMMBASupabase && window.IMMBASupabase.client;
  }

  function redirectTo(file) {
    return new URL(file, location.href).href;
  }

  function withTimeout(promise, ms, label) {
    let timer;
    return Promise.race([
      Promise.resolve(promise).finally(() => clearTimeout(timer)),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(label || "timeout")), ms);
      })
    ]);
  }

  async function loadProfile() {
    profile = null;
    const sb = client();
    if (!sb || !user) return;
    try {
      const { data, error: e } = await withTimeout(
        sb.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        8000,
        "profile-timeout"
      );
      if (e) error = e.message;
      profile = data || null;
    } catch (e) {
      error = e && e.message === "profile-timeout" ? "讀取帳號逾時" : (e && e.message) || "";
    }
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
    notify();
  }

  function isUnconfirmed(err) {
    const msg = (err && (err.message || err.msg || err.error_description || "")) || "";
    return /email not confirmed|confirm your email/i.test(msg);
  }

  async function confirmViaApi(email) {
    try {
      const r = await fetch(location.origin + "/api/confirm-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const ct = r.headers.get("content-type") || "";
      if (r.status === 404 || !/json/i.test(ct)) return { used: false };
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return { used: true, error: j.error || "無法略過信箱驗證" };
      return { used: true };
    } catch {
      return { used: false };
    }
  }

  async function signUpViaApi(email, password) {
    try {
      const r = await fetch(location.origin + "/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const ct = r.headers.get("content-type") || "";
      if (r.status === 404 || !/json/i.test(ct)) return { used: false };
      const j = await r.json().catch(() => ({}));
      if (!r.ok) return { used: true, error: j.error || "註冊失敗" };
      return { used: true };
    } catch {
      return { used: false };
    }
  }

  async function signUp(email, password) {
    error = "";
    const viaApi = await signUpViaApi(email, password);
    if (viaApi.used) {
      if (viaApi.error) return fail(viaApi.error);
      return signIn(email, password);
    }
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
    let data = null;
    let e = null;
    try {
      const res = await withTimeout(
        sb.auth.signInWithPassword({ email, password }),
        15000,
        "signin-timeout"
      );
      data = res.data;
      e = res.error;
    } catch (err) {
      return fail("登入逾時，請再試一次。");
    }
    if (e && isUnconfirmed(e)) {
      const via = await confirmViaApi(email);
      if (via.used && !via.error) {
        try {
          const res2 = await withTimeout(
            sb.auth.signInWithPassword({ email, password }),
            15000,
            "signin-timeout"
          );
          data = res2.data;
          e = res2.error;
        } catch (err) {
          return fail("登入逾時，請再試一次。");
        }
      }
    }
    if (e) error = e.message;
    user = data && data.user ? data.user : null;
    if (user) await loadProfile();
    notify();
    return { data, error: e };
  }

  async function signOut() {
    const sb = client();
    if (sb) await sb.auth.signOut();
    user = null;
    profile = null;
    notify();
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
    sb.auth.onAuthStateChange((event, session) => {
      user = session && session.user ? session.user : null;
      Promise.resolve(loadProfile()).finally(() => {
        notify();
        if (event === "PASSWORD_RECOVERY" && document.body.dataset.page !== "reset") {
          location.href = "reset.html";
        }
      });
    });
  });

  window.IMMBAAuth = Auth;
})();
