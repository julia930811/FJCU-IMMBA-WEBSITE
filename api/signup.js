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
  const password = String(body.password || "");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6) {
    res.status(400).json({ error: "請輸入有效的 email，密碼至少 6 個字。" });
    return;
  }

  const url = String(process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !key) {
    res.status(500).json({ error: "伺服器尚未設定 SUPABASE_SECRET_KEY，無法註冊。" });
    return;
  }

  const r = await fetch(url + "/auth/v1/admin/users", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + key,
      apikey: key,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password, email_confirm: true })
  });
  const text = await r.text();
  let data = {};
  try { data = JSON.parse(text); } catch {}
  if (!r.ok) {
    const msg = data.msg || data.message || data.error_description || "";
    if (/already|registered|exists|duplicate/i.test(String(msg))) {
      res.status(409).json({ error: "這個信箱已經註冊過了。" });
      return;
    }
    res.status(400).json({ error: msg || "註冊失敗" });
    return;
  }
  res.status(200).json({ ok: true });
};
