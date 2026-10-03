import { chromium } from 'playwright';
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 412, height: 823 }, isMobile: true, hasTouch: true });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', { interval: 300 });
await cdp.send('Profiler.start');
await p.goto('http://localhost:4010/fr/', { waitUntil: 'load' });
await p.waitForTimeout(8000);
const { profile } = await cdp.send('Profiler.stop');
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const parent = new Map(); for (const n of profile.nodes) for (const c of n.children ?? []) parent.set(c, n.id);
const dt = profile.timeDeltas;
const self = new Map(), incl = new Map();
profile.samples.forEach((s, i) => {
  const d = dt[i] / 1000; const n = byId.get(s);
  const k = `${n.callFrame.functionName || '(anon)'} ${n.callFrame.url.split('/').pop()}:${n.callFrame.lineNumber}:${n.callFrame.columnNumber}`;
  self.set(k, (self.get(k) ?? 0) + d);
  const seen = new Set(); let cur = s;
  while (cur) { const nn = byId.get(cur); const kk = `${nn.callFrame.functionName || '(anon)'} ${nn.callFrame.url.split('/').pop()}:${nn.callFrame.lineNumber}:${nn.callFrame.columnNumber}`; if (!seen.has(kk)) { seen.add(kk); incl.set(kk, (incl.get(kk) ?? 0) + d); } cur = parent.get(cur); }
});
const top = (m, n) => [...m.entries()].filter(([k]) => !k.startsWith('(')).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${Math.round(v)}ms  ${k}`).join('\n');
console.log('SELF\n' + top(self, 10)); console.log('\nINCLUSIVE\n' + top(incl, 22));
await b.close();
