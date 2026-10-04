// Calcule les ajustements de métriques (size-adjust, ascent/descent-override) des polices de secours
// pour que le remplacement police de secours → police web ne déplace aucun bloc (CLS).
// Usage : node scripts/font-metrics.mjs   (après `npm run build`) — les valeurs sont reportées dans src/components/ui/FontFaces.tsx
import { chromium } from 'playwright';
import { fromFile } from '@capsizecss/unpack/fs';
import { serveOut } from './lib/static-server.mjs';

const { server, origin } = serveOut();
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await page.addInitScript(() => localStorage.setItem('diaw:booted', '1'));
await page.goto(`${origin}/fr/`, { waitUntil: 'networkidle' });

const ratios = await page.evaluate(async () => {
  await document.fonts.ready;
  const specs = {
    display: { web: '700 100px "Clash Display"', fallback: '700 100px Arial', sel: 'h1, h2, h3, .pj-title, .cur-title' },
    body: { web: '400 100px Satoshi', fallback: '400 100px Arial', sel: 'p, li, dd' },
    mono: { web: '400 100px "JetBrains Mono"', fallback: '400 100px "Courier New"', sel: '.eyebrow, .chip, .meta, .mono' },
  };
  const ctx = document.createElement('canvas').getContext('2d');
  const out = {};
  for (const [k, s] of Object.entries(specs)) {
    await document.fonts.load(s.web);
    let web = 0, fb = 0, n = 0;
    for (const el of document.querySelectorAll(s.sel)) {
      const txt = (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 140);
      if (txt.length < 4) continue;
      ctx.font = s.web; web += ctx.measureText(txt).width;
      ctx.font = s.fallback; fb += ctx.measureText(txt).width;
      n++;
    }
    out[k] = { ratio: web / fb, samples: n };
  }
  return out;
});
await browser.close(); server.close();

const vertical = {};
for (const [k, f] of Object.entries({ display: 'ClashDisplay-Bold', body: 'Satoshi-Regular', mono: 'jetbrains-mono-latin-400-normal' })) {
  const m = await fromFile(`public/fonts/${f}.woff2`);
  const sa = ratios[k].ratio;
  vertical[k] = {
    sizeAdjust: `${(sa * 100).toFixed(1)}%`,
    ascent: `${((m.ascent / (m.unitsPerEm * sa)) * 100).toFixed(1)}%`,
    descent: `${((Math.abs(m.descent) / (m.unitsPerEm * sa)) * 100).toFixed(1)}%`,
    lineGap: `${((m.lineGap / (m.unitsPerEm * sa)) * 100).toFixed(1)}%`,
    samples: ratios[k].samples,
  };
}
console.log(JSON.stringify(vertical, null, 2));
