'use client';
import { useEffect, useState } from 'react';
import { prefersReduced } from '@/lib/motion';

/** Rôle qui alterne toutes les 2,6 s avec un glitch RGB split. La liste complète reste dans le HTML (lecteurs d'écran, SEO). */
export function RoleCycler({ roles }: { roles: string[] }) {
  const [i, setI] = useState(0);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    if (prefersReduced() || roles.length < 2) return;
    let g: ReturnType<typeof setTimeout>;
    const iv = setInterval(() => {
      setI((v) => (v + 1) % roles.length);
      setGlitch(true);
      g = setTimeout(() => setGlitch(false), 320);
    }, 2600);
    return () => { clearInterval(iv); clearTimeout(g); };
  }, [roles]);

  return (
    <p className="role-live" aria-hidden="true">
      <span className="role-prompt">▸</span>
      <span className="role-text" data-text={roles[i]} data-glitch={glitch ? '1' : undefined}>{roles[i]}</span>
    </p>
  );
}
