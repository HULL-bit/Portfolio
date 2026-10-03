// Capture les pages d'accueil des sites en production → content-images/<slug>/home.jpg (1440 px de large, ~2400 px de haut).
// Ces images alimentent les maquettes « navigateur » de la section Projets (optimize-images les décline ensuite).
// Usage : node scripts/capture-project-shots.mjs [slug ...]      (réseau requis ; relancer quand un site change)
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const SITES = {
  'blue-track': { url: 'https://blue-track.net/', wait: 4500 },
  ocrystal: { url: 'https://ocrystale.com/', wait: 5500, dismiss: ['Tout refuser', 'Refuser'] },
  'wagadu-africa': { url: 'https://wagadu-africa.org/fr/', wait: 5000 },
  'daara-dbm': { url: 'https://darabarakatulmahahidi.online/', wait: 4500 },
};
const HEIGHT = 2400;
const only = process.argv.slice(2);
const browser = await chromium.launch();
for (const [slug, cfg] of Object.entries(SITES)) {
  if (only.length && !only.includes(slug)) continue;
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'fr-FR', userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36' });
  const page = await ctx.newPage();
  try {
    await page.goto(cfg.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(cfg.wait);
    for (const label of cfg.dismiss ?? []) {
      const btn = page.getByRole('button', { name: label }).first();
      if (await btn.count()) { await btn.click().catch(() => {}); await page.waitForTimeout(600); break; }
    }
    // défilement progressif pour déclencher les contenus paresseux / révélations
    const total = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < Math.min(total, HEIGHT + 900); y += 450) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(350); }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    mkdirSync(`content-images/${slug}`, { recursive: true });
    await page.screenshot({ path: `content-images/${slug}/home.jpg`, type: 'jpeg', quality: 86, fullPage: true, clip: { x: 0, y: 0, width: 1440, height: Math.min(HEIGHT, total) } });
    console.log(`✔ ${slug} (${total}px de page)`);
  } catch (e) {
    console.log(`✖ ${slug} : ${e.message.slice(0, 100)}`);
  }
  await ctx.close();
}
await browser.close();
