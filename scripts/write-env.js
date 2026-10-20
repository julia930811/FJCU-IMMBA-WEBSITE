const fs = require("fs");
const url = process.env.VITE_SUPABASE_URL || "";
const key = process.env.VITE_SUPABASE_ANON_KEY || "";
const body = `window.IMMBA_ENV = {\n  VITE_SUPABASE_URL: ${JSON.stringify(url)},\n  VITE_SUPABASE_ANON_KEY: ${JSON.stringify(key)}\n};\n`;
fs.writeFileSync("js/env.js", body);
console.log("wrote js/env.js from Vercel environment variables");
