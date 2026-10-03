/**
 * Monogramme « SD » : lettres tracées au fil, festons aux extrémités, curseur `_` clignotant.
 * Les tracés portent pathLength=1 pour l'animation de dessin (boot, étape 6).
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 64" fill="none" aria-hidden="true" focusable="false">
      <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        {/* S */}
        <path className="logo-draw" pathLength={1} d="M40 14c-4-5-10-7-17-7C13 7 8 12 8 18c0 15 32 8 32 25 0 7-6 12-16 12-8 0-14-3-18-8" />
        {/* D */}
        <path className="logo-draw" pathLength={1} d="M54 8v46h14c14 0 24-9 24-23S82 8 68 8H54z" />
      </g>
      <g fill="currentColor"><circle cx="40" cy="14" r="2.6" /><circle cx="6" cy="47" r="2.6" /><circle cx="54" cy="8" r="2.6" /><circle cx="54" cy="54" r="2.6" /></g>
      <rect className="logo-cursor" x="100" y="52" width="16" height="5" rx="1" fill="var(--gold)" />
    </svg>
  );
}
