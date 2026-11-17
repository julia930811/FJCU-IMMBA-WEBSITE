function authCopy() {
  const zh = locale() === "zh";
  return {
    zh,
    next: new URLSearchParams(location.search).get("next") || "",
    loginTitle: zh ? "登入（Authentication）" : "Login (Authentication)",
    registerTitle: zh ? "註冊帳號" : "Create your account",
    resetTitle: zh ? "重設密碼" : "Reset password",
    accountTitle: zh ? "帳號狀態" : "Account status"
  };
}

function authStatus(el, msg, ok) {
  if (!el) return;
  el.hidden = !msg;
  el.textContent = msg || "";
  el.className = "admin-status" + (ok ? "" : " is-warn");
}

function errText(err) {
  if (!err) return "";
  if (typeof err === "string") return err;
  return err.message || err.msg || err.error_description || err.error || "";
}

function friendlyAuthError(err, zh) {
  const msg = errText(err);
  if (/email not confirmed|confirm your email/i.test(msg)) {
    return zh ? "這個信箱還沒驗證。請到信箱點開驗證信後再登入。" : "Please confirm your email before signing in.";
  }
  if (/invalid login credentials|invalid_credentials/i.test(msg)) {
    return zh ? "信箱或密碼不正確。" : "Email or password is incorrect.";
  }
  if (/signin-timeout|登入逾時|did not respond|沒有回應/i.test(msg)) {
    return zh ? "登入沒有回應。請關閉這個網站的其他分頁後再試。" : "Sign-in did not respond. Close other tabs of this site and try again.";
  }
  if (/not configured|尚未設定/i.test(msg)) {
    return zh ? "登入服務還沒接上。請重新整理；若仍不行，請確認 Vercel 已設定 Supabase 環境變數。" : "Auth is not configured. Refresh, or set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Vercel.";
  }
  if (/rate limit|over_email_send_rate_limit|email rate limit/i.test(msg)) {
    return zh
      ? "驗證信寄太多次了。請等約一小時再用同一個信箱註冊，或改用還沒試過的信箱。"
      : "Too many confirmation emails were sent. Wait about an hour, or use an email you have not tried yet.";
  }
  return msg;
}

function safeNext() {
  const raw = (authCopy().next || "").replace(/^\//, "");
  const file = raw.split("#")[0];
  const hash = raw.includes("#") ? raw.slice(raw.indexOf("#")) : "";
  if (/^(admin-news|admin-faculty|admin-alumni|admin-users|admin-audit|account|market)\.html$/.test(file)) {
    return file + hash;
  }
  return "";
}

function goNext() {
  location.href = safeNext() || "admin-faculty.html";
}

function afterLogin() {
  const Auth = window.IMMBAAuth;
  if (!Auth.user()) return;
  const next = safeNext();
  if (next) {
    location.href = next;
    return;
  }
  if (Auth.canEdit()) {
    location.href = "admin-faculty.html";
    return;
  }
  location.href = "account.html";
}

function initLogin() {
  const zh = locale() === "zh";
  const form = document.getElementById("loginForm");
  const status = document.getElementById("authStatus");
  if (!form) return;
  if (!window.IMMBAAuth.configured()) {
    const envOk = !!(window.IMMBA_ENV && /^https:\/\//.test(window.IMMBA_ENV.VITE_SUPABASE_URL || "") && String(window.IMMBA_ENV.VITE_SUPABASE_ANON_KEY || "").length >= 20);
    const sdkOk = !!(window.supabase && typeof window.supabase.createClient === "function");
    const msg = !sdkOk
      ? (zh ? "登入程式庫沒載入成功（CDN）。請硬重新整理後再試。" : "The auth library did not load. Hard-refresh and try again.")
      : !envOk
        ? (zh ? "Vercel 尚未設定 Supabase 環境變數，所以現在無法登入。請在 Vercel → Settings → Environment Variables 加上 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY 後重新部署。" : "Supabase is not configured on Vercel yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then redeploy.")
        : (zh ? "登入服務還沒接上。請重新整理後再試。" : "Auth is not ready. Refresh and try again.");
    authStatus(status, msg, false);
  }
  if (window.IMMBAAuth.user()) {
    afterLogin();
    return;
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;
    authStatus(status, zh ? "登入中…" : "Signing in…", true);
    let settled = false;
    const watchdog = setTimeout(() => {
      if (settled) return;
      authStatus(status, zh ? "登入沒有回應。請關閉其他分頁後再試一次。" : "Sign-in did not respond. Close other tabs of this site and try again.", false);
    }, 12000);
    const { error } = await window.IMMBAAuth.signIn(email, password);
    settled = true;
    clearTimeout(watchdog);
    if (error) {
      authStatus(status, zh ? "登入失敗：" + (friendlyAuthError(error, true) || "請確認信箱與密碼。") : "Login failed: " + (friendlyAuthError(error, false) || "Check your email and password."), false);
      return;
    }
    afterLogin();
  });
}

function initRegister() {
  const zh = locale() === "zh";
  const form = document.getElementById("registerForm");
  const status = document.getElementById("authStatus");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;
    const confirm = document.getElementById("authPassword2").value;
    if (password.length < 6) {
      authStatus(status, zh ? "密碼至少 6 個字。" : "Password must be at least 6 characters.", false);
      return;
    }
    if (password !== confirm) {
      authStatus(status, zh ? "兩次密碼不一致。" : "The two passwords do not match.", false);
      return;
    }
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    const { data, error } = await window.IMMBAAuth.signUp(email, password);
    if (submit) submit.disabled = false;
    if (error) {
      const msg = errText(error);
      const exists = /already|registered|exists/i.test(msg);
      authStatus(status, exists
        ? (zh ? "這個信箱已經註冊過了，請改按「已有帳號，改登入」。" : "This email is already registered. Use Login instead.")
        : (zh ? "註冊失敗：" + (friendlyAuthError(error, true) || msg || "請稍後再試。") : "Registration failed: " + (friendlyAuthError(error, false) || msg || "Please try again.")), false);
      return;
    }
    if (data && data.session) {
      authStatus(status, zh ? "已註冊。請先完成信箱驗證（若已開通則等待管理員核准）。" : "Registered. Confirm your email if asked, then wait for approval.", true);
      location.href = "account.html";
      return;
    }
    authStatus(status, zh ? "請到信箱點驗證信，確認這個 email 是你的（Email Verification）。" : "Check your inbox and confirm that this email belongs to you (Email Verification).", true);
  });
}

function initReset() {
  const zh = locale() === "zh";
  const request = document.getElementById("resetRequestForm");
  const update = document.getElementById("resetUpdateForm");
  const status = document.getElementById("authStatus");
  const hasSession = !!(window.IMMBAAuth.user());
  if (request) request.hidden = hasSession;
  if (update) update.hidden = !hasSession;
  if (request) {
    request.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("authEmail").value.trim();
      const { error } = await window.IMMBAAuth.resetPassword(email);
      if (error) {
        authStatus(status, zh ? "寄送失敗：" + (errText(error) || "請稍後再試。") : "Could not send reset email: " + (errText(error) || "Please try again."), false);
        return;
      }
      authStatus(status, zh ? "若帳號存在，重設密碼信件已寄出。請從信件回到本頁設定新密碼。" : "If the account exists, a reset email was sent. Open the link to create a new password.", true);
    });
  }
  if (update) {
    update.addEventListener("submit", async (e) => {
      e.preventDefault();
      const password = document.getElementById("authPassword").value;
      const confirm = document.getElementById("authPassword2").value;
      if (password.length < 6 || password !== confirm) {
        authStatus(status, zh ? "請輸入兩次相同、至少 6 字的新密碼。" : "Enter the same new password twice (min. 6 characters).", false);
        return;
      }
      const { error } = await window.IMMBAAuth.updatePassword(password);
      if (error) {
        authStatus(status, zh ? "更新失敗：" + (errText(error) || "請稍後再試。") : "Could not update password: " + (errText(error) || "Please try again."), false);
        return;
      }
      authStatus(status, zh ? "密碼已更新，請用新密碼登入。" : "Password updated. Sign in with the new password.", true);
      await window.IMMBAAuth.signOut();
      location.href = "login.html";
    });
  }
}

function initAccount() {
  const box = document.getElementById("accountBox");
  if (!box) return;
  const zh = locale() === "zh";
  const Auth = window.IMMBAAuth;
  const u = Auth.user();
  const role = Auth.role() || "pending";
  if (!u) {
    box.innerHTML = `<p>${zh ? "尚未登入。" : "You are not signed in."}</p>
      <p><a class="btn btn-navy" href="login.html">${zh ? "登入" : "Login"}</a>
      <a class="btn btn-line" href="register.html">${zh ? "註冊" : "Register"}</a></p>`;
    return;
  }
  const labels = {
    pending: zh ? "pending：一般使用者，可登入，不能進後台、不能管理帳號" : "pending: regular user; can sign in, cannot open the back office or manage accounts",
    admin: zh ? "admin：管理員，可編輯網站內容" : "admin: can edit site content",
    super_admin: zh ? "super_admin：超級管理員，可把 pending 核准為 admin" : "super_admin: can approve pending accounts as admin"
  };
  box.innerHTML = `
    <p><strong>${zh ? "目前身分" : "Who are you?"}</strong> ${u.email || ""}</p>
    <p>${labels[role] || role}</p>
    <p class="form-note">${zh ? "學校網站登入只有這三種角色。" : "School-site login has only these three roles."}</p>
    <div class="admin-toolbar">
      ${Auth.canEdit() ? `<a class="btn btn-navy" href="admin-faculty.html">${zh ? "進入後台" : "Open back office"}</a>` : ""}
      ${Auth.isSuper() ? `<a class="btn btn-line" href="admin-users.html">${zh ? "核准管理員" : "Approve administrators"}</a>` : ""}
      <button type="button" class="btn btn-line" id="btnSignOut">${zh ? "登出" : "Log out"}</button>
    </div>
  `;
  document.getElementById("btnSignOut").addEventListener("click", async () => {
    await Auth.signOut();
    location.href = "login.html";
  });
}

function applicationStatus(role, zh) {
  if (role === "pending") return zh ? "pending：待核准" : "pending: awaiting approval";
  if (role === "admin") return zh ? "admin：已核准" : "admin: approved";
  if (role === "super_admin") return "super_admin";
  return role || "";
}

function shortId(id) {
  const s = String(id || "");
  return s.length > 12 ? s.slice(0, 8) + "…" : s;
}

async function initAdminUsers() {
  const zh = locale() === "zh";
  const body = document.getElementById("userTableBody");
  const status = document.getElementById("authStatus");
  const count = document.getElementById("pendingCount");
  if (!body) return;
  let filter = "pending";
  let rows = [];
  function applyFilter() {
    const list = filter === "all" ? rows : rows.filter((p) => p.role === filter);
    body.innerHTML = list.map((p) => `
      <tr>
        <td title="${p.id || ""}"><code>${shortId(p.id)}</code></td>
        <td>${p.email || ""}</td>
        <td><span class="role-badge role-${p.role}">${p.role}</span></td>
        <td>${applicationStatus(p.role, zh)}</td>
        <td>${(p.created_at || "").replace("T", " ").slice(0, 19)}</td>
        <td class="admin-row-actions">
          ${p.role === "super_admin" ? "—" : (
            p.role === "admin"
              ? `<button type="button" class="btn btn-line" data-pending="${p.id}">${zh ? "改回 pending" : "Set pending"}</button>`
              : `<button type="button" class="btn btn-navy" data-approve="${p.id}">${zh ? "核准為 admin" : "Approve as admin"}</button>`
          )}
        </td>
      </tr>
    `).join("") || `<tr><td colspan="6">${zh ? "這個篩選沒有申請。" : "No applications in this filter."}</td></tr>`;
    if (count) {
      const n = rows.filter((p) => p.role === "pending").length;
      count.textContent = zh ? `目前 ${n} 筆 pending 申請待審核。` : `${n} pending administrator request(s) awaiting review.`;
    }
  }
  async function render() {
    rows = await window.IMMBAAuth.listProfiles();
    applyFilter();
  }
  document.querySelectorAll("[data-role-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      filter = btn.getAttribute("data-role-filter");
      document.querySelectorAll("[data-role-filter]").forEach((b) => b.classList.toggle("is-active", b === btn));
      applyFilter();
    });
  });
  document.getElementById("main").addEventListener("click", async (e) => {
    const approve = e.target.closest("[data-approve]");
    const pending = e.target.closest("[data-pending]");
    if (approve) {
      const { error } = await window.IMMBAAuth.setRole(approve.getAttribute("data-approve"), "admin");
      authStatus(status, error ? errText(error) : (zh ? "已核准為 admin，可管理網站內容。" : "Approved as admin. They can now manage website content."), !error);
      await render();
    }
    if (pending) {
      const { error } = await window.IMMBAAuth.setRole(pending.getAttribute("data-pending"), "pending");
      authStatus(status, error ? errText(error) : (zh ? "已改回 pending。" : "Role set back to pending."), !error);
      await render();
    }
  });
  await render();
}

function auditActionLabel(row, zh) {
  const act = row.action || "";
  const ent = row.entity || "";
  if (ent === "profiles" && act === "update") {
    const next = row.after_data && row.after_data.role;
    if (next === "admin") return zh ? "核准為 admin" : "Approved as admin";
    if (next === "pending") return zh ? "改回 pending" : "Set pending";
  }
  if (ent === "profiles" && act === "insert") return zh ? "新帳號（pending）" : "New account (pending)";
  if (ent === "faculty" && act === "insert") return zh ? "新增師資" : "Added faculty";
  if (ent === "faculty" && act === "update") return zh ? "修改師資" : "Edited faculty";
  if (ent === "faculty" && act === "delete") return zh ? "刪除師資" : "Deleted faculty";
  return act + " " + ent;
}

async function initAdminAudit() {
  const zh = locale() === "zh";
  const body = document.getElementById("auditTableBody");
  const status = document.getElementById("authStatus");
  if (!body) return;
  const rows = await window.IMMBAAuth.listAudit(200);
  if (window.IMMBAAuth.lastError()) {
    authStatus(status, window.IMMBAAuth.lastError(), false);
  }
  body.innerHTML = rows.map((row) => `
    <tr>
      <td>${(row.created_at || "").replace("T", " ").slice(0, 19)}</td>
      <td>${row.actor_email || (zh ? "（系統／未登入）" : "(system / unknown)")}</td>
      <td>${auditActionLabel(row, zh)}</td>
      <td>${row.summary || row.entity_id || ""}</td>
    </tr>
  `).join("") || `<tr><td colspan="4">${zh ? "尚無異動紀錄。請先在 SQL Editor 執行最新 schema.sql。" : "No audit rows yet. Run the latest schema.sql in the SQL Editor first."}</td></tr>`;
}

function initAuthUI() {
  const page = document.body.dataset.page;
  if (page === "login") initLogin();
  if (page === "register") initRegister();
  if (page === "reset") initReset();
  if (page === "account") initAccount();
  if (page === "admin-users") initAdminUsers();
  if (page === "admin-audit") initAdminAudit();
}
