'use client';
import { useRef, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { track } from '@/lib/track';

type Labels = {
  title: string; intro: string; name: string; email: string; message: string; send: string; sending: string; success: string; error: string;
  mailto: string; fallback: string; errName: string; errEmail: string; errMessage: string; subject: string;
};
type Status = 'idle' | 'sending' | 'ok' | 'error' | 'mail';

const schema = z.object({
  name: z.string().trim().min(2),
  email: z.email(),
  message: z.string().trim().min(10).max(4000),
});
const ENDPOINT = 'https://api.web3forms.com/submit';

/** Confettis de particules or : canvas 2D, ~1,6 s, sans dépendance. */
function burst(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const r = canvas.getBoundingClientRect();
  canvas.width = r.width * 2; canvas.height = r.height * 2;
  ctx.scale(2, 2);
  const parts = Array.from({ length: 110 }, () => {
    const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * 7;
    return { x: r.width / 2, y: r.height * 0.55, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4, s: 1.5 + Math.random() * 2.8, life: 1, gold: Math.random() > 0.2 };
  });
  const t0 = performance.now();
  const step = (now: number) => {
    ctx.clearRect(0, 0, r.width, r.height);
    const alive = now - t0 < 1700;
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.22; p.vx *= 0.985; p.life = Math.max(0, 1 - (now - t0) / 1700);
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.gold ? '#FFB800' : '#00E5FF';
      ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8;
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }
    if (alive) requestAnimationFrame(step); else ctx.clearRect(0, 0, r.width, r.height);
  };
  requestAnimationFrame(step);
}

export function ContactForm({ labels, to }: { labels: Labels; to: string }) {
  const [v, setV] = useState({ name: '', email: '', message: '' });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>('idle');
  const hp = useRef<HTMLInputElement>(null);
  const confetti = useRef<HTMLCanvasElement>(null);

  const parsed = schema.safeParse(v);
  const bad = new Set(parsed.success ? [] : parsed.error.issues.map((i) => String(i.path[0])));
  const err = (k: 'name' | 'email' | 'message') => (touched[k] && bad.has(k) ? labels[k === 'name' ? 'errName' : k === 'email' ? 'errEmail' : 'errMessage'] : null);
  const mailto = `mailto:${to}?subject=${encodeURIComponent(labels.subject)}&body=${encodeURIComponent(`${v.message}\n\n— ${v.name} (${v.email})`)}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (!parsed.success || status === 'sending') return;
    if (hp.current?.checked) { setStatus('ok'); return; } // honeypot : on fait semblant
    const key = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!key) { track('form-submit'); window.location.href = mailto; setStatus('mail'); return; } // repli mailto
    setStatus('sending');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ access_key: key, subject: labels.subject, from_name: 'Portfolio SYSTEM//DIAW', name: v.name, email: v.email, message: v.message }),
      });
      const json = (await res.json()) as { success?: boolean };
      if (!res.ok || !json.success) throw new Error('send');
      track('form-submit');
      setStatus('ok');
      requestAnimationFrame(() => confetti.current && burst(confetti.current));
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="term">
      <div className="term-bar" aria-hidden="true"><i /><i /><i /><span>{labels.title}</span></div>
      {status === 'ok' ? (
        <div className="term-body" role="status">
          <div className="term-ok">
            <p className="line"><span style={{ color: '#3ddc84' }}>{labels.success}</span></p>
            <p className="line muted">&gt; {to}</p>
            <p className="line muted">&gt; _</p>
          </div>
          <canvas ref={confetti} className="confetti" aria-hidden="true" />
        </div>
      ) : (
        <form className="term-body" onSubmit={onSubmit} noValidate>
          <p className="term-intro">{labels.intro}</p>
          {(['name', 'email', 'message'] as const).map((k) => {
            const id = `f-${k}`;
            return (
              <div key={k} className="term-field" data-invalid={!!err(k)}>
                <label className="term-row" htmlFor={id}>
                  <span className="prompt">&gt; {labels[k]}:</span>
                  {k === 'message' ? (
                    <textarea id={id} rows={4} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} onBlur={() => setTouched((t) => ({ ...t, [k]: true }))} aria-invalid={!!err(k)} aria-describedby={err(k) ? `${id}-e` : undefined} autoComplete="off" required />
                  ) : (
                    <input id={id} type={k === 'email' ? 'email' : 'text'} value={v[k]} onChange={(e) => setV({ ...v, [k]: e.target.value })} onBlur={() => setTouched((t) => ({ ...t, [k]: true }))} aria-invalid={!!err(k)} aria-describedby={err(k) ? `${id}-e` : undefined} autoComplete={k === 'email' ? 'email' : 'name'} required />
                  )}
                </label>
                {err(k) ? <p id={`${id}-e`} className="term-err" role="alert">{err(k)}</p> : null}
              </div>
            );
          })}
          <input ref={hp} type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <div className="term-actions">
            <button type="submit" className="btn btn-gold" disabled={status === 'sending'}>{status === 'sending' ? labels.sending : `${labels.send} ↵`}</button>
          </div>
          <div className="term-out" aria-live="polite">
            {status === 'error' ? <span>{labels.error} <a href={mailto} data-track="email-click">{labels.mailto}</a> — {to}</span> : null}
            {status === 'mail' ? <span>{labels.fallback} <a href={mailto} data-track="email-click">{labels.mailto}</a> — {to}</span> : null}
          </div>
        </form>
      )}
    </div>
  );
}
