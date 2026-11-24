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
    res.status(500).json({ error: "伺服器尚未設定 SUPABASE_SECRET_KEY。" });
    return;
  }

  const headers = {
    Authorization: "Bearer " + key,
    apikey: key,
    "Content-Type": "application/json"
  };

  const list = await fetch(url + "/auth/v1/admin/users?page=1&per_page=200", { headers });
  const listText = await list.text();
  let listData = {};
  try { listData = JSON.parse(listText); } catch {}
  if (!list.ok) {
    res.status(400).json({ error: listData.msg || listData.message || "找不到帳號。" });
    return;
  }
  const users = listData.users || [];
  const user = users.find((u) => String(u.email || "").trim().toLowerCase() === email);
  if (!user) {
    res.status(200).json({ ok: true });
    return;
  }
  if (user.email_confirmed_at) {
    res.status(200).json({ ok: true });
    return;
  }

  const upd = await fetch(url + "/auth/v1/admin/users/" + user.id, {
    method: "PUT",
    headers,
    body: JSON.stringify({ email_confirm: true })
  });
  const updText = await upd.text();
  let updData = {};
  try { updData = JSON.parse(updText); } catch {}
  if (!upd.ok) {
    res.status(400).json({ error: updData.msg || updData.message || "無法確認信箱。" });
    return;
  }
  res.status(200).json({ ok: true });
};
