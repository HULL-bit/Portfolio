'use client';
import { useEffect, useState } from 'react';

/** Bas du Hero : indicateur scroll_, statut en ligne et heure de Dakar en direct. */
export function HeroStatus({ scroll, online, tz }: { scroll: string; online: string; tz: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tick = () => setTime(f.format(new Date()));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [tz]);
  return (
    <div className="hero-status mono" aria-hidden="true">
      <span className="scroll-ind">{scroll}</span>
      <span><i className="live-dot" />{online}</span>
      <span className="hero-time">{time || '--:--:--'}</span>
    </div>
  );
}
