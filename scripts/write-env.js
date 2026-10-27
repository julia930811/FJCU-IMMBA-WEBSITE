const fs = require("fs");
const url = (process.env.VITE_SUPABASE_URL || "").trim();
const key = (process.env.VITE_SUPABASE_ANON_KEY || "").trim();
if (!url || !key) {
  console.warn("Skipping js/env.js: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel Environment Variables.");
  process.exit(0);
}
const body = `window.IMMBA_ENV = {\n  VITE_SUPABASE_URL: ${JSON.stringify(url)},\n  VITE_SUPABASE_ANON_KEY: ${JSON.stringify(key)}\n};\n`;
fs.writeFileSync("js/env.js", body);
console.log("wrote js/env.js from environment variables");
