'use client';
import { useEffect, useState } from 'react';
import { getTheme, toggleTheme, type Theme } from '@/lib/theme';

export function ThemeToggle({ label }: { label: string }) {
  const [theme, setT] = useState<Theme>('dark');
  useEffect(() => {
    const sync = () => setT(getTheme());
    sync();
    window.addEventListener('diaw:theme', sync);
    return () => window.removeEventListener('diaw:theme', sync);
  }, []);
  return (
    <button type="button" className="icon-btn" onClick={toggleTheme} aria-label={label} aria-pressed={theme === 'light'} title={label}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        {theme === 'light' ? <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" /> : <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>}
      </svg>
    </button>
  );
}
