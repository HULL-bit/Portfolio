import { chromium } from 'playwright';
import { serveOut } from './lib/static-server.mjs';
const { server, origin } = serveOut();
const b = await chromium.launch();
async function run(label, booted, throttle) {
  const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true });
  if (booted) await ctx.addInitScript(() => localStorage.setItem('diaw:booted', '1'));
  const p = await ctx.newPage();
  if (throttle) { const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: throttle }); }
  await p.addInitScript(() => {
    window.__marks = {};
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__marks[e.name] = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__marks.lcp = Math.round(e.startTime) + ':' + (e.element?.className || e.element?.tagName); }).observe({ type: 'largest-contentful-paint', buffered: true });
  });
  await p.goto(origin + '/fr/', { waitUntil: 'load' });
  await p.waitForTimeout(3500);
  const m = await p.evaluate(() => ({ ...window.__marks, dcl: Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart), load: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart) }));
  console.log(label.padEnd(28), JSON.stringify(m));
  await ctx.close();
}
await run('boot, no throttle', false, 0);
await run('no boot, no throttle', true, 0);
await run('boot, cpu 4x', false, 4);
await run('no boot, cpu 4x', true, 4);
await b.close(); server.close();
