'use client';
import { useEffect, useRef } from 'react';
import { heroBus } from '@/lib/hero-bus';
import { prefersReduced } from '@/lib/motion';

const LOGS = [
  '[    0.000000] Booting SYSTEM//DIAW kernel 6.9-sir',
  '[    0.004211] Command line: BOOT_IMAGE=/vmlinuz-6.9-sir root=/dev/sda1 quiet',
  '[    0.021840] x86/fpu: Supporting XSAVE feature 0x001: x87 floating point',
  '[    0.034102] BIOS-provided physical RAM map: ok',
  '[    0.071230] Security: hardening profile loaded',
  '[    0.098512] Freeing unused kernel image memory',
  '[  OK  ] Started systemd-journald.service',
  '[  OK  ] Mounted /projects',
  '[  OK  ] Mounted /var/www/portfolio',
  '[  OK  ] Reached target Local File Systems',
  '[  OK  ] Started ufw.service — firewall',
  '[  OK  ] Started sshd.service',
  '[  OK  ] Started nginx.service',
  '[  OK  ] Started oracle-db.service',
  '[  OK  ] Started postgresql.service',
  '[  OK  ] Started django-api.service',
  '[  OK  ] Started spring-boot.service',
  '[  OK  ] Started react-ui.service',
  '[  OK  ] Started flutter-bridge.service',
  '[  OK  ] Started docker.service',
  '[  OK  ] Reached target Network is Online',
  '[  OK  ] Reached target Portfolio.',
];

const bar = (pct: number) => {
  const k = Math.round((pct / 100) * 12);
  return `[${'█'.repeat(k)}${'░'.repeat(12 - k)}] ${String(pct).padStart(2, ' ')}%`;
};

/** Points (px viewport) du texte « ACCESS GRANTED » : positions de départ des particules du Hero. */
function sampleText(el: HTMLElement, count: number): Float32Array | null {
  const spans = Array.from(el.querySelectorAll<HTMLElement>('span'));
  if (!spans.length) return null;
  const sc = 1 / 3;
  const c = document.createElement('canvas');
  c.width = Math.round(window.innerWidth * sc);
  c.height = Math.round(window.innerHeight * sc);
  const ctx = c.getContext('2d', { willReadFrequently: true });
  if (!ctx) return null;
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  for (const s of spans) {
    const r = s.getBoundingClientRect();
    const cs = getComputedStyle(s);
    const px = parseFloat(cs.fontSize);
    ctx.font = `700 ${px * sc}px "Clash Display", system-ui, sans-serif`;
    (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-0.04 * px * sc}px`;
    ctx.fillText(s.textContent ?? '', (r.left + r.width / 2) * sc, (r.top + r.height * 0.78) * sc);
  }
  const { data, width, height } = ctx.getImageData(0, 0, c.width, c.height);
  const cand: number[] = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (data[(y * width + x) * 4 + 3]! > 128) cand.push(x, y);
  if (!cand.length) return null;
  const out = new Float32Array(count * 2);
  const m = cand.length / 2;
  for (let i = 0; i < count; i++) {
    const k = Math.floor(Math.random() * m) * 2;
    out[i * 2] = (cand[k]! + Math.random()) / sc;
    out[i * 2 + 1] = (cand[k + 1]! + Math.random()) / sc;
  }
  return out;
}

/**
 * Boot sequence (≤ 1,2 s), première visite de l'accueil uniquement. C'est une surcouche : le HTML du Hero est déjà dans la page.
 * 0 → logs noyau Linux + barre ASCII · 0,48 s ACCESS GRANTED (glitch 150 ms) · 0,72 s implosion en particules · ~1 s fin.
 */
export function BootSequence({ labels }: { labels: { welcome: string; skip: string } }) {
  const root = useRef<HTMLDivElement>(null);
  const log = useRef<HTMLPreElement>(null);
  const barEl = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLDivElement>(null);
  const skip = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains('booting')) return;
    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));

    const finish = (implode: boolean) => {
      if (done) return;
      done = true;
      timers.forEach(clearTimeout);
      if (implode) {
        let pts: Float32Array | null = null;
        try { pts = big.current ? sampleText(big.current, 24000) : null; } catch { pts = null; }
        heroBus.emitImplode(pts);
      } else heroBus.emitImplode(null);
      try { localStorage.setItem('diaw:booted', '1'); } catch { /* stockage indisponible */ }
      html.classList.remove('booting');
      window.dispatchEvent(new Event('diaw:boot-done'));
    };

    if (prefersReduced()) { finish(false); return; }

    at(300, () => { if (skip.current) skip.current.disabled = false; });
    // logs : ~22 lignes très rapides, barre de progression synchronisée
    let n = 0;
    const iv = setInterval(() => {
      n = Math.min(LOGS.length, n + 1);
      if (log.current) log.current.innerHTML = LOGS.slice(0, n).map((l) => (l.startsWith('[  OK  ]') ? `<span class="ok">[  OK  ]</span>${l.slice(8)}` : l)).join('\n');
      if (barEl.current) barEl.current.textContent = bar(Math.round((n / LOGS.length) * 100));
      if (n >= LOGS.length) clearInterval(iv);
    }, 16);
    timers.push(iv as unknown as ReturnType<typeof setTimeout>);
    at(480, () => el.classList.add('granted'));          // ACCESS GRANTED + glitch
    at(720, () => { el.classList.add('implode'); finish(true); }); // texte → particules, le fond noir se dissout
    at(980, () => { el.hidden = true; });

    const onSkip = () => { el.classList.add('implode'); finish(false); setTimeout(() => { el.hidden = true; }, 250); };
    const btn = skip.current;
    btn?.addEventListener('click', onSkip);
    return () => { clearInterval(iv); timers.forEach(clearTimeout); btn?.removeEventListener('click', onSkip); };
  }, []);

  return (
    <div ref={root} className="boot" role="presentation">
      <pre ref={log} className="boot-log" aria-hidden="true" />
      <div ref={barEl} className="boot-bar" aria-hidden="true" />
      <span className="boot-cursor" aria-hidden="true" />
      <div className="boot-grant" aria-hidden="true">
        <div ref={big} className="boot-big"><span>ACCESS</span><span>GRANTED</span></div>
        <p className="boot-welcome">— {labels.welcome}</p>
      </div>
      <button ref={skip} type="button" className="boot-skip" disabled>{labels.skip}</button>
    </div>
  );
}
