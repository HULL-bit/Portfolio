'use client';
import { useEffect, useState } from 'react';

export function DakarClock({ label, tz }: { label: string; tz: string }) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const tick = () => setTime(f.format(new Date()));
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [tz]);
  return <span className="dakar">● {label} {time || '--:--:--'} UTC+0</span>;
}
