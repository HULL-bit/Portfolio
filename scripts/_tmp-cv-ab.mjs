import { chromium } from 'playwright';
import { serveOut } from './lib/static-server.mjs';
const b = await chromium.launch();
for (const [name, dir] of [['base', '/tmp/out-a'], ['sections', '/tmp/out-b'], ['rows+sections', '/tmp/out-c']]) {
  const { server, origin } = serveOut('', dir);
  const res = [];
  for (let k = 0; k < 4; k++) {
    const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true });
    await ctx.addInitScript(() => localStorage.setItem('diaw:booted', '1'));
    const p = await ctx.newPage();
    const cdp = await ctx.newCDPSession(p);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.send('Performance.enable');
    await p.addInitScript(() => { window.__fcp = 0; new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === 'first-contentful-paint') window.__fcp = Math.round(e.startTime); }).observe({ type: 'paint', buffered: true }); });
    await p.goto(origin + '/fr/', { waitUntil: 'load' });
    await p.waitForTimeout(3000);
    const m = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
    res.push({ fcp: await p.evaluate(() => window.__fcp), layout: m.LayoutDuration * 1000, style: m.RecalcStyleDuration * 1000, script: m.ScriptDuration * 1000, task: m.TaskDuration * 1000, doc: await p.evaluate(() => document.documentElement.scrollHeight) });
    await ctx.close();
  }
  const avg = (k) => Math.round(res.reduce((a, r) => a + r[k], 0) / res.length);
  console.log(name.padEnd(14), `FCP ${avg('fcp')}  layout ${avg('layout')}ms  style ${avg('style')}ms  script ${avg('script')}ms  task ${avg('task')}ms  docHeight ${avg('doc')}`);
  server.close();
}
await b.close();
