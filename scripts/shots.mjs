// Captures desktop (1440) et mobile (390) de out/ → .screenshots/
// Usage : node scripts/shots.mjs [chemin ...]   (défaut : /fr/ /en/)
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { chromium } from 'playwright';

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf', '.bin': 'application/octet-stream' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = join('out', p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!existsSync(f)) f = join('out', '404.html');
  res.writeHead(existsSync(join('out', p)) ? 200 : 404, { 'content-type': MIME[extname(f)] ?? 'application/octet-stream' });
  res.end(await readFile(f));
}).listen(0);
const port = server.address().port;

const args = process.argv.slice(2);
// --at=#projects,.hscroll@1500 (décalage en px après l'ancre) : captures du viewport après défilement jusqu'à ces ancres
const at = (args.find((a) => a.startsWith('--at=')) ?? '').slice(5).split(',').filter(Boolean);
const only = (args.find((a) => a.startsWith('--only=')) ?? '').slice(7);
// --width=1920 --height=1080 : taille de la fenêtre « desktop » (défaut 1440×900)
const dw = Number((args.find((a) => a.startsWith('--width=')) ?? '').slice(8)) || 1440;
const dh = Number((args.find((a) => a.startsWith('--height=')) ?? '').slice(9)) || 900;
const argPaths = args.filter((a) => !a.startsWith('--'));
const paths = argPaths.length ? argPaths : ['/fr/', '/en/'];
await mkdir('.screenshots', { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'] });
const errors = [];
for (const [name, w, h, mobile] of [['desktop', dw, dh, false], ['mobile', 390, 844, true]].filter(([n]) => !only || n === only)) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, deviceScaleFactor: 1 });
  await ctx.addInitScript(({ boot, theme }) => { localStorage.setItem('diaw:gpu', 'force'); if (theme) localStorage.setItem('diaw:theme', theme); if (!boot) localStorage.setItem('diaw:booted', '1'); }, { boot: process.env.BOOT === '1', theme: process.env.THEME ?? '' });
  const page = await ctx.newPage();
  page.on('console', (m) => ['error', 'warning'].includes(m.type()) && errors.push(`[${name}] ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`[${name}] ${e.message}`));
  for (const p of paths) {
    await page.goto(`http://localhost:${port}${p}`, { waitUntil: 'networkidle' });
    await page.waitForSelector('canvas[data-ready]', { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);
    const slug = p.replace(/\//g, '_').replace(/^_|_$/g, '') || 'root';
    await page.screenshot({ path: `.screenshots/${slug}-${name}-fold.png` });
    for (const sel of at) {
      const [q, off = '0'] = sel.split('@');
      await page.evaluate(([qq, o]) => { document.querySelector(qq)?.scrollIntoView({ behavior: 'instant' }); window.scrollBy(0, Number(o)); }, [q, off]);
      await page.waitForTimeout(2200);
      await page.screenshot({ path: `.screenshots/${slug}-${name}-at-${sel.replace(/\W/g, '')}.png` });
    }
    if (!at.length) await page.screenshot({ path: `.screenshots/${slug}-${name}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
server.close();
console.log(errors.length ? `Console :\n${errors.join('\n')}` : 'Console : aucune erreur ni avertissement');
