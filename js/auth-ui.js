function authCopy() {
  const zh = locale() === "zh";
  return {
    zh,
    next: new URLSearchParams(location.search).get("next") || "admin-faculty.html",
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

function goNext() {
  const next = authCopy().next;
  const allowed = /^(admin-news|admin-faculty|admin-users|admin-audit)\.html$/.test(next) ? next : "admin-faculty.html";
  location.href = allowed;
}

function afterLogin() {
  const Auth = window.IMMBAAuth;
  if (!Auth.user()) return;
  if (Auth.canEdit()) {
    goNext();
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
    authStatus(status, zh ? "Vercel 尚未設定 Supabase 環境變數，所以現在無法登入。請在 Vercel → Settings → Environment Variables 加上 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY 後重新部署。" : "Supabase is not configured on Vercel yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY, then redeploy.", false);
  }
  if (window.IMMBAAuth.canEdit()) {
    goNext();
    return;
  }
  if (window.IMMBAAuth.user()) {
    location.href = "account.html";
    return;
  }
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("authEmail").value.trim();
    const password = document.getElementById("authPassword").value;
    const { error } = await window.IMMBAAuth.signIn(email, password);
    if (error) {
      authStatus(status, zh ? "登入失敗：" + (errText(error) || "請確認信箱與密碼。") : "Login failed: " + (errText(error) || "Check your email and password."), false);
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
    const { data, error } = await window.IMMBAAuth.signUp(email, password);
    if (error) {
      const msg = errText(error);
      const exists = /already|registered|exists/i.test(msg);
      authStatus(status, exists
        ? (zh ? "這個信箱已經註冊過了，請改按「已有帳號，改登入」。" : "This email is already registered. Use Login instead.")
        : (zh ? "註冊失敗：" + (msg || "請稍後再試。") : "Registration failed: " + (msg || "Please try again.")), false);
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
    pending: zh ? "pending：已註冊並驗證，尚不能進後台" : "pending: registered and verified, but cannot access the back office yet",
    admin: zh ? "admin：已核准，可管理網站內容" : "admin: approved and allowed to manage website content",
    super_admin: zh ? "super_admin：可核准或拒絕其他管理員" : "super_admin: can approve or reject other administrators",
    rejected: zh ? "未通過：super_admin 未核准此帳號" : "rejected: a super_admin did not approve this account"
  };
  box.innerHTML = `
    <p><strong>${zh ? "目前身分" : "Who are you?"}</strong> ${u.email || ""}</p>
    <p>${labels[role] || role}</p>
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
  if (role === "pending") return zh ? "待 super_admin 審核" : "Pending Super Admin Review";
  if (role === "admin") return zh ? "已核准為 admin" : "Approved as admin";
  if (role === "rejected") return zh ? "已拒絕" : "Rejected";
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
          ${p.role === "super_admin" ? "—" : `
            ${p.role === "admin" ? "" : `<button type="button" class="btn btn-navy" data-approve="${p.id}">${zh ? "核准為 admin" : "Approve as admin"}</button>`}
            ${p.role === "rejected" ? "" : `<button type="button" class="btn btn-line" data-reject="${p.id}">${zh ? "拒絕申請" : "Reject"}</button>`}
          `}
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
    const reject = e.target.closest("[data-reject]");
    if (approve) {
      const { error } = await window.IMMBAAuth.setRole(approve.getAttribute("data-approve"), "admin");
      authStatus(status, error ? errText(error) : (zh ? "已核准為 admin，可管理網站內容。" : "Approved as admin. They can now manage website content."), !error);
      await render();
    }
    if (reject) {
      const { error } = await window.IMMBAAuth.setRole(reject.getAttribute("data-reject"), "rejected");
      authStatus(status, error ? errText(error) : (zh ? "已拒絕此申請，不能進後台。" : "Application rejected. This account cannot access the back office."), !error);
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
    if (next === "rejected") return zh ? "拒絕申請" : "Rejected application";
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
