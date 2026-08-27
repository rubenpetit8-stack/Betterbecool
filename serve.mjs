#!/usr/bin/env node
/* Local preview server.
 *
 *   node serve.mjs          → http://localhost:8080
 *
 * Mirrors the two Vercel behaviours the site depends on, so a link that works
 * here works in production: `cleanUrls` (/pricing serves public/pricing.html)
 * and a real 404 page. A plain file server would 404 on every internal link,
 * because the links are extensionless and the files are not.
 */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "public");
const PORT = Number(process.env.PORT) || 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

async function resolve(pathname) {
  // Strip any ../ before touching the filesystem.
  const rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  const base = join(ROOT, rel);

  const candidates = rel.endsWith("/")
    ? [join(base, "index.html")]
    : [base, base + ".html", join(base, "index.html")];

  for (const file of candidates) {
    if (!file.startsWith(ROOT)) continue;             // no escaping public/
    try {
      if ((await stat(file)).isFile()) return file;
    } catch { /* try the next candidate */ }
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url, "http://localhost");

  // Match Vercel's cleanUrls: /pricing.html redirects to /pricing.
  if (pathname.endsWith(".html")) {
    const clean = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    res.writeHead(308, { Location: clean || "/" });
    return res.end();
  }

  const file = await resolve(pathname);
  if (!file) {
    const notFound = join(ROOT, "404.html");
    res.writeHead(404, { "Content-Type": TYPES[".html"] });
    return res.end(await readFile(notFound).catch(() => "404"));
  }

  res.writeHead(200, {
    "Content-Type": TYPES[extname(file)] || "application/octet-stream",
    "Cache-Control": "no-store"
  });
  res.end(await readFile(file));
}).listen(PORT, () => {
  console.log(`Better Be Cool — preview on http://localhost:${PORT}`);
});
