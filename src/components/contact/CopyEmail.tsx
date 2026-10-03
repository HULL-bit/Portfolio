'use client';
import { useEffect, useState } from 'react';
import { track } from '@/lib/track';

/** E-mail : copie dans le presse-papiers + toast, avec un lien mailto à côté. */
export function CopyEmail({ email, labels }: { email: string; labels: { copy: string; copied: string; write: string } }) {
  const [toast, setToast] = useState(false);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  async function copy() {
    track('email-click');
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = email; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } finally { ta.remove(); }
    }
    setToast(true);
  }

  return (
    <>
      <button type="button" className="btn btn-gold" data-magnetic onClick={copy} aria-label={`${labels.copy} : ${email}`}>{email}</button>
      <a className="btn btn-line" data-magnetic href={`mailto:${email}`} data-track="email-click">{labels.write}</a>
      <span role="status" aria-live="polite">{toast ? <span className="toast">{labels.copied}</span> : null}</span>
    </>
  );
}
