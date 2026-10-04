// Sert out/ en local, éventuellement sous un basePath (comme GitHub Pages) :
//   node scripts/serve.mjs                       → http://localhost:4010/
//   node scripts/serve.mjs --base /Portfolio     → http://localhost:4010/Portfolio/
//   node scripts/serve.mjs --port 5000
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';

const arg = (name, def) => { const i = process.argv.indexOf(`--${name}`); return i > 0 ? process.argv[i + 1] : def; };
const PORT = Number(arg('port', 4010));
const BASE = arg('base', process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/$/, '');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.pdf': 'application/pdf', '.bin': 'application/octet-stream', '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };
const COMPRESSIBLE = new Set(['.html', '.js', '.css', '.json', '.svg', '.txt', '.xml', '.webmanifest']);

createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (BASE) { if (!p.startsWith(BASE)) { res.writeHead(404); return res.end('404'); } p = p.slice(BASE.length) || '/'; }
  let f = join('out', p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  const found = existsSync(f);
  if (!found) f = join('out', '404.html');
  const ext = extname(f);
  let body = await readFile(f);
  const headers = { 'content-type': MIME[ext] ?? 'application/octet-stream' };
  if (p.startsWith('/_next/static/')) headers['cache-control'] = 'public, max-age=31536000, immutable';
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) { body = gzipSync(body); headers['content-encoding'] = 'gzip'; }
  res.writeHead(found ? 200 : 404, headers);
  res.end(body);
}).listen(PORT, () => console.log(`Serving out/ on http://localhost:${PORT}${BASE}/`));
