'use client';
import { runtime } from '@/lib/runtime';

export function ToTop({ label }: { label: string }) {
  const go = () => {
    if (runtime.lenis) runtime.lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return <button type="button" className="to-top link-arrow" onClick={go}>↑ {label}</button>;
}
