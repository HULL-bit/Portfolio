export function Leds({ level, label }: { level: number; label: string }) {
  return (
    <span className="leds" role="img" aria-label={`${label} ${level}/5`}>
      {[1, 2, 3, 4, 5].map((n) => <i key={n} className={n <= level ? 'on' : ''} />)}
    </span>
  );
}
