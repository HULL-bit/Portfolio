'use client';
import { useEffect, useRef } from 'react';
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

/**
 * Boot sequence (≈ 0,65 s : le premier écran recruteur reste lisible en moins de 700 ms), première visite de l'accueil uniquement. Surcouche : le HTML du Hero est déjà dans la page.
 * La chronologie visuelle (logs, barre ASCII, ACCESS GRANTED + glitch 150 ms, fondu) est entièrement en CSS : elle part
 * du premier rendu et ne dépend pas de l'hydratation. Le JS ajoute « Passer » et la mémorisation.
 */
export function BootSequence({ labels }: { labels: { welcome: string; skip: string } }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains('booting')) return;
    let done = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t0 = (window as unknown as { __bootT0?: number }).__bootT0 ?? performance.now();
    const left = (ms: number) => Math.max(0, ms - (performance.now() - t0));

    const finish = () => {
      if (done) return;
      done = true;
      try { localStorage.setItem('diaw:booted', '1'); } catch { /* stockage indisponible */ }
      window.dispatchEvent(new Event('diaw:boot-done'));
    };
    const end = () => { html.classList.remove('booting'); };

    if (prefersReduced()) { finish(); end(); return; }
    timers.push(setTimeout(finish, left(480)));                 // le Hero peut démarrer ses révélations
    timers.push(setTimeout(end, left(660)));                    // fin du boot (premier écran lisible en < 0,7 s)
    const btn = el.querySelector<HTMLButtonElement>('.boot-skip');
    const skip = () => { finish(); end(); };
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
        <div className="boot-big"><span>ACCESS</span><span>GRANTED</span></div>
        <p className="boot-welcome">— {labels.welcome}</p>
      </div>
      <button type="button" className="boot-skip">{labels.skip}</button>
    </div>
  );
}
