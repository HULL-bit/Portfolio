// Tests de fumée Playwright sur out/ : pages, filtres, terminal, langue, thème, formulaire, 404, menu mobile.
// Usage : npm run smoke                       (après `npm run build`)
//         BASE_PATH=/portfolio npm run smoke  (après un build avec NEXT_PUBLIC_BASE_PATH=/portfolio)
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { serveOut } from './lib/static-server.mjs';

const BASE = process.env.BASE_PATH ?? '';
const projects = JSON.parse(readFileSync('content/projects.json', 'utf8'));
const { server, origin } = serveOut(BASE);
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });

let passed = 0;
const failures = [];
const consoleErrors = [];
async function check(name, fn) {
  try { await fn(); passed++; console.log(`  ✔ ${name}`); }
  catch (e) { failures.push(`${name} — ${e.message.split('\n')[0]}`); console.log(`  ✖ ${name}\n      ${e.message.split('\n')[0]}`); }
}
const ok = (cond, msg) => { if (!cond) throw new Error(msg); };

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
  await ctx.addInitScript(() => { localStorage.setItem('diaw:booted', '1'); });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (!['error', 'warning'].includes(m.type())) return;
    if (page.url().includes('n-existe-pas') && m.text().includes('404')) return; // la 404 volontaire du test
    consoleErrors.push(`${page.url()} — ${m.text()}`);
  });
  page.on('pageerror', (e) => consoleErrors.push(`${page.url()} — ${e.message}`));
  return page;
}

console.log(`\nTests de fumée — ${origin}\n`);

// ── Pages principales ──
const page = await newPage();
for (const lang of ['fr', 'en']) {
  await check(`/${lang}/ : héros, CV et contact visibles`, async () => {
    await page.goto(`${origin}/${lang}/`, { waitUntil: 'networkidle' });
    ok(await page.locator('h1').first().innerText() !== '', 'h1 vide');
    ok(await page.locator('html').getAttribute('lang') === lang, 'attribut lang incorrect');
    const cv = page.locator('.hero a[download]').first();
    ok(await cv.isVisible(), 'bouton CV absent du premier écran');
    const href = await cv.getAttribute('href');
    const res = await page.request.get(new URL(href, origin).href);
    ok(res.ok(), `CV introuvable (${href})`);
    ok((await page.locator('.hero .proof').count()) === 3, 'les 3 preuves chiffrées sont absentes');
  });
}
for (const lang of ['fr', 'en']) {
  await check(`/${lang}/cv/ : vue express`, async () => {
    await page.goto(`${origin}/${lang}/cv/`, { waitUntil: 'networkidle' });
    ok((await page.locator('.cv h2').count()) >= 4, 'sections du CV absentes');
  });
}
for (const p of projects) {
  await check(`/fr/projets/${p.slug}/`, async () => {
    const r = await page.goto(`${origin}/fr/projets/${p.slug}/`, { waitUntil: 'domcontentloaded' });
    ok(r.ok(), `statut ${r.status()}`);
    ok((await page.locator('h1').innerText()).length > 3, 'titre vide');
    if (p.architecture.nodes.length) ok((await page.locator('svg.arch').count()) === 1, 'schéma d\'architecture absent');
    if (p.demo) ok((await page.locator(`a[href="${p.demo}"]`).count()) > 0, 'lien de démo absent');
  });
}

// ── Mise en page bureau : le nom du héros et la navigation ne débordent jamais ──
await check('Héros et navigation : aucun débordement de 390 à 2560 px', async () => {
  for (const [w, h] of [[390, 844], [768, 1024], [1100, 760], [1240, 720], [1366, 768], [1536, 864], [1920, 1080], [2560, 1440]]) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const range = document.createRange();
      const right = Math.max(...[...document.querySelectorAll('.hn-word')].map((e) => { range.selectNodeContents(e.firstChild); return range.getBoundingClientRect().right; }));
      const col = document.querySelector('.hero-grid > div').getBoundingClientRect();
      const nav = document.querySelector('.nav-inner');
      return { right, colRight: col.right, navOverflow: nav.scrollWidth > nav.clientWidth + 1, hscroll: document.documentElement.scrollWidth > innerWidth + 1 };
    });
    ok(r.right <= r.colRight + 1, `${w}px : le nom déborde de sa colonne (${Math.round(r.right)} > ${Math.round(r.colRight)})`);
    ok(!r.navOverflow, `${w}px : la navigation déborde`);
    ok(!r.hscroll, `${w}px : défilement horizontal parasite`);
  }
  await page.setViewportSize({ width: 1440, height: 900 });
});

// ── Cursus ──
await check('Cursus : 5 domaines, Oracle 19c, SQL Server, C#, .NET', async () => {
  await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
  ok((await page.locator('#cursus .cur-card').count()) === 5, 'les 5 domaines du cursus sont attendus');
  const txt = await page.locator('#cursus').innerText();
  for (const k of ['Algorithmique', 'Architecture des ordinateurs', 'Optique', 'Algèbre', 'Oracle 19c', 'SQL Server', 'C#', '.NET', 'Services IP', 'Réseaux avancés', 'Protocoles']) ok(txt.includes(k), `« ${k} » absent du cursus`);
  await page.goto(`${origin}/en/`, { waitUntil: 'networkidle' });
  ok((await page.locator('#cursus').innerText()).includes('Computer architecture'), 'cursus non traduit en anglais');
});

// ── Section Projets : filtres ──
await check('Projets : filtre catégorie, technologie et réinitialisation', async () => {
  await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const total = await page.locator('[data-pj]').count();
  ok(total === projects.length, `${total} projets affichés au lieu de ${projects.length}`);
  await page.locator('.filters [data-cat="mobile"]').click();
  const visibleMobile = await page.locator('[data-pj]:not([hidden])').count();
  ok(visibleMobile > 0 && visibleMobile < total, `filtre mobile : ${visibleMobile} visibles`);
  await page.locator('.filters [data-cat="all"]').click();
  await page.locator('.pj [data-tech="Django"]').first().click();
  const visibleDjango = await page.locator('[data-pj]:not([hidden])').count();
  ok(visibleDjango > 0 && visibleDjango < total, `filtre Django : ${visibleDjango} visibles`);
  ok(await page.locator('[data-clear]:not([hidden])').count() === 1, 'chip de filtre actif absent');
  await page.locator('[data-clear]').click();
  ok((await page.locator('[data-pj]:not([hidden])').count()) === total, 'le filtre ne se réinitialise pas');
});

// ── Navigation : rideau + changement de langue ──
await check('Langue : le sélecteur conserve la page courante', async () => {
  await page.goto(`${origin}/fr/projets/blue-track/`, { waitUntil: 'networkidle' });
  await page.locator('.lang-switch a[hreflang="en"]').click();
  await page.waitForURL(/\/en\/projets\/blue-track\/$/, { timeout: 8000 });
});
await check('Navigation : clic sur un projet depuis l\'accueil (rideau brodé)', async () => {
  await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2800); // le rideau est chargé au repos
  await page.locator('.pj-title a').first().click();
  await page.waitForURL(/\/fr\/projets\/[a-z0-9-]+\/$/, { timeout: 10000 });
});

// ── Terminal ──
await check('Terminal : touche `, help, ls projects, open, Échap', async () => {
  await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.keyboard.press('`');
  await page.waitForSelector('.terminal.is-open', { timeout: 8000 });
  await page.keyboard.type('help'); await page.keyboard.press('Enter');
  await page.keyboard.type('ls projects'); await page.keyboard.press('Enter');
  await page.keyboard.type('ls cursus'); await page.keyboard.press('Enter');
  const text = await page.locator('.terminal-out').innerText();
  ok(text.includes('whoami') && text.includes('blue-track') && text.includes('Oracle 19c'), 'sortie du terminal incomplète');
  await page.keyboard.type('open blue-track'); await page.keyboard.press('Enter');
  await page.waitForURL(/\/projets\/blue-track\/$/, { timeout: 8000 });
});

// ── Commande gpu (diagnostic et forçage de la 3D) ──
await check('Terminal : gpu (état), gpu on / auto (forçage mémorisé)', async () => {
  await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.removeItem('diaw:gpu'));
  await page.keyboard.press('`');
  await page.waitForSelector('.terminal.is-open', { timeout: 8000 });
  await page.keyboard.type('gpu'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => document.querySelector('.terminal-out')?.textContent?.includes('niveau'), null, { timeout: 8000 });
  await page.keyboard.type('gpu on'); await page.keyboard.press('Enter');
  await page.waitForFunction(() => localStorage.getItem('diaw:gpu') === 'force', null, { timeout: 5000 });
  await page.waitForLoadState('load');
  await page.evaluate(() => localStorage.removeItem('diaw:gpu'));
});

// ── Thème ──
await check('Thème : bascule clair / sombre mémorisée', async () => {
  await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
  await page.locator('.nav-tools button[aria-pressed]').click();
  ok(await page.locator('html').getAttribute('data-theme') === 'light', 'thème clair non appliqué');
  await page.reload({ waitUntil: 'networkidle' });
  ok(await page.locator('html').getAttribute('data-theme') === 'light', 'thème non mémorisé');
  await page.locator('.nav-tools button[aria-pressed]').click();
  ok(await page.locator('html').getAttribute('data-theme') === null, 'le retour au thème sombre ne fonctionne pas');
  ok(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme) === 'dark', 'color-scheme: dark attendu');
});

// ── Formulaire ──
await check('Formulaire : validation en direct et repli mailto', async () => {
  await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await page.locator('button[type=submit]').click();
  await page.waitForFunction(() => document.querySelectorAll('.term-err').length === 3, null, { timeout: 5000 }).catch(() => {});
  ok((await page.locator('.term-err').count()) === 3, 'les 3 erreurs de validation sont attendues');
  await page.fill('#f-name', 'Awa Ndiaye');
  await page.fill('#f-email', 'awa@example.com');
  await page.fill('#f-message', 'Bonjour, nous recrutons un DBA Oracle.');
  await page.locator('button[type=submit]').click();
  await page.waitForSelector('.term-out a[href^="mailto:"]', { timeout: 5000 }); // pas de clé Web3Forms → repli mailto
});

// ── 404 ──
await check('404 : page « kernel panic »', async () => {
  const r = await page.goto(`${origin}/fr/n-existe-pas/`, { waitUntil: 'domcontentloaded' });
  ok(r.status() === 404, `statut ${r.status()}`);
  ok((await page.locator('h1').innerText()).toLowerCase().includes('not syncing'), 'contenu 404 inattendu');
});
await page.context().close();

// ── Mobile ──
const m = await newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await check('Mobile : barre d\'action, menu plein écran', async () => {
  await m.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });
  ok((await m.locator('.mobile-bar a').count()) === 4, 'barre d\'action mobile absente');
  await m.locator('.menu-toggle').click();
  await m.waitForSelector('.menu-overlay.is-open', { timeout: 5000 });
  await m.keyboard.press('Escape');
  await m.waitForFunction(() => !document.querySelector('.menu-overlay.is-open'), null, { timeout: 5000 });
  ok(await m.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), 'défilement horizontal parasite');
});
await m.context().close();

await browser.close(); server.close();
console.log(`\n${passed} test(s) réussi(s), ${failures.length} échec(s), ${consoleErrors.length} erreur(s) de console.`);
if (consoleErrors.length) console.log('Console :\n  ' + [...new Set(consoleErrors)].join('\n  '));
if (failures.length) console.log('Échecs :\n  - ' + failures.join('\n  - '));
process.exit(failures.length || consoleErrors.length ? 1 : 0);
