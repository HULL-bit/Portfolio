// Banc de fluidité : fait défiler l'accueil à la molette et mesure le temps de chaque image (rAF).
// Usage : node scripts/perf-scroll.mjs [--gpu=force|auto] [--width=1440] [--css="sélecteur{prop:val}"] [--label=nom]
// Rendu logiciel (SwiftShader) : les valeurs absolues sont pessimistes, mais les écarts entre variantes sont fiables.
import { chromium } from 'playwright';
import { serveOut } from './lib/static-server.mjs';

const arg = (n, d) => (process.argv.find((a) => a.startsWith(`--${n}=`)) ?? '').slice(n.length + 3) || d;
const gpu = arg('gpu', 'force'), width = Number(arg('width', 1440)), height = Number(arg('height', 900)), css = arg('css', ''), label = arg('label', 'base');
const { server, origin } = serveOut();
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width, height } });
await ctx.addInitScript(([g]) => { localStorage.setItem('diaw:booted', '1'); if (g === 'force') localStorage.setItem('diaw:gpu', 'force'); }, [gpu]);
const p = await ctx.newPage();
await p.goto(origin + '/fr/', { waitUntil: 'networkidle' });
if (css) await p.addStyleTag({ content: css });
await p.waitForTimeout(3500); // 3D chargée, moteur d'animation démarré
await p.mouse.move(width / 2, height / 2);
await p.evaluate(() => { window.__dt = []; let last = performance.now(); const loop = (t) => { window.__dt.push(t - last); last = t; requestAnimationFrame(loop); }; requestAnimationFrame(loop); });
const cdp = await ctx.newCDPSession(p); await cdp.send('Performance.enable');
const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
const total = await p.evaluate(() => document.documentElement.scrollHeight);
for (let i = 0; i < 160; i++) { await p.mouse.wheel(0, 90); await p.waitForTimeout(24); }
await p.waitForTimeout(400);
const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
const dt = (await p.evaluate(() => window.__dt)).slice(5).sort((a, c) => a - c);
const avg = dt.reduce((a, c) => a + c, 0) / dt.length;
const q = (f) => dt[Math.min(dt.length - 1, Math.floor(dt.length * f))];
const dur = (m1.Timestamp - m0.Timestamp);
console.log(`${label.padEnd(18)} frames ${String(dt.length).padStart(4)}  fps≈${(1000 / avg).toFixed(1).padStart(5)}  p50 ${q(0.5).toFixed(0)}ms  p95 ${q(0.95).toFixed(0)}ms  >50ms: ${dt.filter((x) => x > 50).length}  | main ${(((m1.TaskDuration - m0.TaskDuration) / dur) * 100).toFixed(0)}%  script ${(((m1.ScriptDuration - m0.ScriptDuration) / dur) * 100).toFixed(0)}%  layout ${(((m1.LayoutDuration - m0.LayoutDuration) / dur) * 100).toFixed(0)}%  style ${(((m1.RecalcStyleDuration - m0.RecalcStyleDuration) / dur) * 100).toFixed(0)}%  scrolled ${await p.evaluate(() => Math.round(scrollY))}/${total}`);
await b.close(); server.close();
