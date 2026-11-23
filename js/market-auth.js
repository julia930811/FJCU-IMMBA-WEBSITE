(function () {
  const KEY = "immba-c2c-session-v1";
  const JIAYI_EMAIL = "jiayiwu009@gmail.com";

  function sameEmail(a, b) {
    return String(a || "").trim().toLowerCase() === String(b || "").trim().toLowerCase();
  }

  function notify() {
    window.dispatchEvent(new CustomEvent("immba-market-auth"));
  }

  function user() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const u = JSON.parse(raw);
      if (u && u.id && u.email) return { id: u.id, email: u.email };
    } catch (err) {}
    return null;
  }

  function save(u) {
    if (!u || !u.id) {
      localStorage.removeItem(KEY);
      notify();
      return;
    }
    localStorage.setItem(KEY, JSON.stringify({ id: u.id, email: u.email || "" }));
    notify();
  }

  function isAdmin() {
    const u = user();
    return !!(u && sameEmail(u.email, JIAYI_EMAIL));
  }

  async function signIn(email, password) {
    const Auth = window.IMMBAAuth;
    if (!Auth || !Auth.signIn) return { error: { message: "Auth is not ready." } };
    const { error } = await Auth.signIn(email, password);
    if (error) return { error };
    const u = Auth.user && Auth.user();
    if (!u) return { error: { message: "Sign-in did not return a user." } };
    save({ id: u.id, email: u.email || email });
    return { error: null };
  }

  function signOut() {
    save(null);
  }

  function initLoginForm() {
    const form = document.getElementById("marketLoginForm");
    if (!form) return;
    const zh = document.documentElement.lang !== "en";
    const status = document.getElementById("authStatus");
    const nextRaw = new URLSearchParams(location.search).get("next") || "";
    const nextFile = nextRaw.replace(/^\//, "").split("#")[0];
    const nextHash = nextRaw.includes("#") ? nextRaw.slice(nextRaw.indexOf("#")) : "";
    const safe = /^(market|marketplace)\.html$/.test(nextFile) ? nextFile + nextHash : "market.html";

    function setStatus(msg, ok) {
      if (!status) return;
      status.hidden = !msg;
      status.textContent = msg || "";
      status.className = "admin-status" + (ok ? "" : " is-warn");
    }

    if (user()) {
      location.href = safe;
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("authEmail").value.trim();
      const password = document.getElementById("authPassword").value;
      setStatus(zh ? "市集登入中…" : "Signing in to the marketplace…", true);
      const { error } = await signIn(email, password);
      if (error) {
        setStatus((zh ? "市集登入失敗：" : "Market login failed: ") + (error.message || String(error)), false);
        return;
      }
      location.href = safe;
    });
  }

  window.IMMBAMarketAuth = {
    user,
    signIn,
    signOut,
    isAdmin,
    initLoginForm,
    jiayiEmail: JIAYI_EMAIL
  };
})();
