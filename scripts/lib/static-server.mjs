// Serveur statique minimal pour out/ (tests Playwright), avec prise en charge d'un basePath.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.avif': 'image/avif', '.webp': 'image/webp', '.pdf': 'application/pdf', '.bin': 'application/octet-stream', '.txt': 'text/plain', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json' };

export function serveOut(basePath = '', dir = 'out') {
  const server = createServer(async (req, res) => {
    let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (basePath) { if (!p.startsWith(basePath)) { res.writeHead(404); return res.end(); } p = p.slice(basePath.length) || '/'; }
    let f = join(dir, p);
    if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
    const found = existsSync(f);
    if (!found) f = join(dir, '404.html');
    res.writeHead(found ? 200 : 404, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
    res.end(await readFile(f));
  }).listen(0);
  return { server, origin: `http://localhost:${server.address().port}${basePath}` };
}
