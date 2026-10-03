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
  for (const s of spans) {
    const r = s.getBoundingClientRect();
    const px = parseFloat(getComputedStyle(s).fontSize);
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
 * Boot sequence (≈ 1 s), première visite de l'accueil uniquement. Surcouche : le HTML du Hero est déjà dans la page.
 * La chronologie visuelle (logs, barre ASCII, ACCESS GRANTED + glitch 150 ms, fondu) est entièrement en CSS : elle part
 * du premier rendu et ne dépend pas de l'hydratation. Le JS ajoute l'implosion en particules, « Passer » et la mémorisation.
 */
export function BootSequence({ labels }: { labels: { welcome: string; skip: string } }) {
  const root = useRef<HTMLDivElement>(null);
  const big = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains('booting')) return;
    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t0 = (window as unknown as { __bootT0?: number }).__bootT0 ?? performance.now();
    const left = (ms: number) => Math.max(0, ms - (performance.now() - t0));

    const finish = (implode: boolean) => {
      if (done) return;
      done = true;
      let pts: Float32Array | null = null;
      if (implode) { try { pts = big.current ? sampleText(big.current, 24000) : null; } catch { pts = null; } }
      heroBus.emitImplode(pts);
      try { localStorage.setItem('diaw:booted', '1'); } catch { /* stockage indisponible */ }
      window.dispatchEvent(new Event('diaw:boot-done'));
    };
    const end = () => { html.classList.remove('booting'); };

    if (prefersReduced()) { finish(false); end(); return; }
    timers.push(setTimeout(() => finish(true), left(720)));   // implosion : texte → particules
    timers.push(setTimeout(end, left(1000)));                   // fin du boot
    const btn = el.querySelector<HTMLButtonElement>('.boot-skip');
    const skip = () => { finish(false); end(); };
    btn?.addEventListener('click', skip);
    return () => { timers.forEach(clearTimeout); btn?.removeEventListener('click', skip); };
  }, []);

  return (
    <div ref={root} className="boot" role="presentation">
      <pre className="boot-log" aria-hidden="true">
        {LOGS.map((l, i) => (
          <span key={i} className="bl" style={{ ['--i' as string]: i }}>
            {l.startsWith('[  OK  ]') ? <><span className="ok">[  OK  ]</span>{l.slice(8)}</> : l}
            {'\n'}
          </span>
        ))}
      </pre>
      <div className="boot-bar" aria-hidden="true">
        [<span className="bb-wrap"><span className="bb-fill">████████████</span></span>]<span className="bb-pct" />
      </div>
      <span className="boot-cursor" aria-hidden="true" />
      <div className="boot-grant" aria-hidden="true">
        <div ref={big} className="boot-big"><span>ACCESS</span><span>GRANTED</span></div>
        <p className="boot-welcome">— {labels.welcome}</p>
      </div>
      <button type="button" className="boot-skip">{labels.skip}</button>
    </div>
  );
}
