// Audit d'accessibilité axe-core (WCAG 2.1 A/AA) sur les pages clés, FR + EN, thème sombre et clair.
// Usage : npm run a11y   (après `npm run build`)
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';
import { serveOut } from './lib/static-server.mjs';

const projects = JSON.parse(readFileSync('content/projects.json', 'utf8'));
const paths = ['/fr/', '/en/', '/fr/cv/', '/en/cv/', `/fr/projets/${projects[1].slug}/`, `/en/projets/${projects[0].slug}/`, '/404.html'];
const { server, origin } = serveOut();
const browser = await chromium.launch();
let failed = 0;
for (const theme of ['dark', 'light']) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(([t]) => { localStorage.setItem('diaw:booted', '1'); localStorage.setItem('diaw:theme', t); }, [theme]);
  const page = await ctx.newPage();
  for (const p of paths) {
    await page.goto(origin + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1800); // révélations terminées
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    console.log(`${violations.length ? '✖' : '✔'} [${theme}] ${p}`);
    for (const v of violations) {
      failed++;
      console.log(`   - ${v.id} (${v.impact}) : ${v.help}`);
      for (const n of v.nodes.slice(0, 3)) console.log(`       ${n.target.join(' ')} — ${(n.failureSummary ?? '').split('\n')[1] ?? ''}`);
    }
  }
  await ctx.close();
}
await browser.close(); server.close();
process.exit(failed ? 1 : 0);
