/**
 * Nombre à rouleaux : chaque chiffre est une colonne 0–9 (×2) qui défile jusqu'à sa valeur.
 * Le HTML porte déjà la valeur finale (SSR, lecteurs d'écran, reduced-motion).
 */
export function RollingNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const digits = String(value).split('');
  return (
    <span className="roll" data-roll role="img" aria-label={`${value}${suffix}`}>
      {digits.map((d, i) => (
        <span className="roll-digit" key={i} aria-hidden="true">
          <span className="roll-col" data-d={d} style={{ ['--d' as string]: d }}>
            {[...Array(20)].map((_, n) => <span key={n}>{n % 10}</span>)}
          </span>
        </span>
      ))}
      {suffix ? <span className="roll-suffix" aria-hidden="true">{suffix}</span> : null}
    </span>
  );
}
