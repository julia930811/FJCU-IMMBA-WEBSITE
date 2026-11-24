module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body || "{}"); } catch { body = {}; }
  }
  if (!body || typeof body !== "object") body = {};

  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    res.status(400).json({ error: "請輸入有效的 email。" });
    return;
  }

  const url = String(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) {
    res.status(500).json({ error: "伺服器尚未設定 SUPABASE_SECRET_KEY，無法寄重設信。" });
    return;
  }

  const headers = {
    Authorization: "Bearer " + key,
    apikey: key,
    "Content-Type": "application/json"
  };

  function safeRedirect(raw) {
    try {
      const u = new URL(String(raw || ""));
      const hostOk = u.hostname === "fjcu-immba-website-lilac.vercel.app" || u.hostname === "127.0.0.1" || u.hostname === "localhost";
      const pathOk = /\/(en\/)?reset\.html$/i.test(u.pathname);
      if ((u.protocol === "https:" || u.protocol === "http:") && hostOk && pathOk) return u.origin + u.pathname;
    } catch {}
    return "https://fjcu-immba-website-lilac.vercel.app/reset.html";
  }

  async function readJson(r) {
    const text = await r.text();
    try { return JSON.parse(text); } catch { return {}; }
  }

  async function findUser() {
    const byEmail = await fetch(url + "/auth/v1/admin/users?page=1&per_page=50&email=" + encodeURIComponent(email), { headers });
    const byEmailData = await readJson(byEmail);
    const fromQuery = (byEmailData.users || []).find((u) => String(u.email || "").trim().toLowerCase() === email);
    if (fromQuery) return fromQuery;
    for (let page = 1; page <= 20; page += 1) {
      const list = await fetch(url + "/auth/v1/admin/users?page=" + page + "&per_page=200", { headers });
      const listData = await readJson(list);
      const users = listData.users || [];
      const hit = users.find((u) => String(u.email || "").trim().toLowerCase() === email);
      if (hit) return hit;
      if (!list.ok || users.length < 200) break;
    }
    return null;
  }

  const user = await findUser();
  if (user && !user.email_confirmed_at) {
    await fetch(url + "/auth/v1/admin/users/" + user.id, {
      method: "PUT",
      headers,
      body: JSON.stringify({ email_confirm: true, ban_duration: "none" })
    });
  }

  const redirectTo = safeRedirect(body.redirectTo);
  const recover = await fetch(url + "/auth/v1/recover?redirect_to=" + encodeURIComponent(redirectTo), {
    method: "POST",
    headers,
    body: JSON.stringify({ email })
  });
  const recoverData = await readJson(recover);
  if (!recover.ok) {
    const msg = recoverData.msg || recoverData.message || recoverData.error_description || "";
    if (/rate limit|over_email_send_rate_limit/i.test(msg)) {
      res.status(429).json({ error: "信件寄太多次了。請等約一小時再寄重設密碼信。" });
      return;
    }
    if (/redirect/i.test(msg)) {
      const retry = await fetch(url + "/auth/v1/recover?redirect_to=" + encodeURIComponent("https://fjcu-immba-website-lilac.vercel.app/reset.html"), {
        method: "POST",
        headers,
        body: JSON.stringify({ email })
      });
      if (retry.ok) {
        res.status(200).json({ ok: true });
        return;
      }
    }
    res.status(400).json({ error: msg || "無法寄出重設密碼信。" });
    return;
  }
  res.status(200).json({ ok: true });
};
