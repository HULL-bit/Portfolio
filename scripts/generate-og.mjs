// Génère les images Open Graph 1200×630 (une par page et par langue) → public/og/
// Rendu via Chromium (Playwright) pour utiliser les vraies polices du site.
// Sorties mises en cache : régénérées seulement si le contenu ou ce script changent.
import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';

const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const profile = read('content/profile.json');
const projects = read('content/projects.json');
const OUT = 'public/og';
const HASH_FILE = `${OUT}/.hash`;

const hash = createHash('sha1')
  .update(readFileSync('content/profile.json')).update(readFileSync('content/projects.json'))
  .update(readFileSync(new URL(import.meta.url))).update(readFileSync('public/fonts/ClashDisplay-Bold.woff2'))
  .digest('hex');
if (existsSync(HASH_FILE) && readFileSync(HASH_FILE, 'utf8') === hash) { console.log('[og] à jour'); process.exit(0); }

const font = (f) => `data:font/woff2;base64,${readFileSync(`public/fonts/${f}`).toString('base64')}`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const card = ({ eyebrow, title, sub, accent = '#3D5AFE', chips = [] }) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Clash;font-weight:700;src:url(${font('ClashDisplay-Bold.woff2')})}
@font-face{font-family:Sat;font-weight:500;src:url(${font('Satoshi-Medium.woff2')})}
@font-face{font-family:Mono;font-weight:500;src:url(${font('jetbrains-mono-latin-400-normal.woff2')})}
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;background:#05060A;color:#F5F7FF;position:relative;overflow:hidden;font-family:Sat}
.glow{position:absolute;inset:0;background:radial-gradient(700px 420px at 85% 10%,${accent}66,transparent 70%),radial-gradient(600px 400px at 0% 100%,#7C3AED44,transparent 70%)}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(61,90,254,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(61,90,254,.12) 1px,transparent 1px);background-size:60px 60px;mask-image:linear-gradient(120deg,transparent 30%,#000)}
.wrap{position:absolute;inset:64px;display:flex;flex-direction:column;justify-content:space-between}
.eyebrow{font:500 22px Mono;letter-spacing:.2em;text-transform:uppercase;color:#00E5FF}
h1{font:700 ${title.length > 28 ? 84 : 110}px/0.92 Clash;letter-spacing:-.04em;word-spacing:.12em;max-width:1000px}
.sub{font-size:30px;color:#B9C0D4;max-width:900px;margin-top:22px;line-height:1.3}
.chips{display:flex;gap:12px}
.chip{font:500 20px Mono;padding:8px 16px;border:1px solid rgba(61,90,254,.5);border-radius:99px;color:#F5F7FF}
.brand{font:700 34px Clash;letter-spacing:-.02em}.brand b{color:#FFB800}
.row{display:flex;justify-content:space-between;align-items:flex-end}
</style></head><body><div class="glow"></div><div class="grid"></div><div class="wrap">
<div class="eyebrow">${esc(eyebrow)}</div>
<div><h1>${esc(title)}</h1><p class="sub">${esc(sub)}</p></div>
<div class="row"><div class="chips">${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div><div class="brand">SD<b>_</b></div></div>
</div></body></html>`;

const pages = [];
for (const l of ['fr', 'en']) {
  pages.push([`home-${l}`, {
    eyebrow: l === 'fr' ? '// SYSTEM//DIAW — portfolio' : '// SYSTEM//DIAW — portfolio',
    title: profile.name, sub: `${profile.title[l]} — ${profile.stackLine}`, chips: ['Linux', 'Oracle', 'Django', 'React', 'Spring'],
  }]);
  pages.push([`cv-${l}`, {
    eyebrow: l === 'fr' ? '// vue express — CV' : '// quick view — résumé',
    title: profile.name, sub: profile.title[l], chips: [profile.location.city, profile.availability.types[0][l]],
  }]);
  for (const p of projects)
    pages.push([`projet-${p.slug}-${l}`, {
      eyebrow: l === 'fr' ? '// étude de cas' : '// case study', title: p.title[l], sub: p.summary[l], accent: p.accent, chips: p.stack.slice(0, 4),
    }]);
}

mkdirSync(OUT, { recursive: true });
const expected = new Set(pages.map(([name]) => `${name}.png`));
for (const f of readdirSync(OUT)) if (f.endsWith('.png') && !expected.has(f)) unlinkSync(`${OUT}/${f}`); // images d'anciens projets
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const [name, data] of pages) {
  await page.setContent(card(data), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: `${OUT}/${name}.png` });
}
await browser.close();
writeFileSync(HASH_FILE, hash);
console.log(`[og] ${pages.length} image(s) → ${OUT}/`);
