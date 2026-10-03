import { useId } from 'react';
import { BAND_TILES, MOTIFS, rosaceSimple, type MotifName } from './motifs';

type Props = {
  name: MotifName;
  /** « embroidery » : fil épais brillant · « circuit » : traits fins + pastilles de soudure. */
  variant?: 'embroidery' | 'circuit';
  /** Nombre de répétitions pour les bandes (feston, anneaux, chaînette) : rendues avec un <pattern>, donc légères. */
  repeat?: number;
  className?: string;
  /** Classe appliquée aux tracés (animation DrawSVG). */
  pathClass?: string;
  /** Rosace allégée (8 pétales, sans connecteurs) pour les petites tailles. */
  simple?: boolean;
};

const cache = new Map<string, ReturnType<(typeof MOTIFS)[MotifName]>>();

/** Motif SVG décoratif (aria-hidden). La couleur suit `currentColor`. */
export function Motif({ name, variant = 'embroidery', repeat, className, pathClass = 'motif-path', simple = false }: Props) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const circuit = variant === 'circuit';
  const tileFactory = BAND_TILES[name];

  // ── bandes : un seul carreau répété par <pattern> ──
  if (tileFactory && repeat) {
    const t = tileFactory();
    const W = t.unit * repeat;
    const pid = `mp${uid}`;
    return (
      <svg className={className} viewBox={`-4 -4 ${W + 8} ${t.h + 8}`} fill="none" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
        <defs>
          <pattern id={pid} width={t.unit} height={t.h} patternUnits="userSpaceOnUse">
            <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={circuit ? 1.2 : 3}>
              {t.paths.map((d, i) => <path key={i} d={d} />)}
            </g>
            {circuit ? <g fill="currentColor">{t.pads.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={2.4} />)}</g> : null}
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={t.h} fill={`url(#${pid})`} />
      </svg>
    );
  }

  const key = `${name}:${repeat ?? ''}:${simple ? 's' : ''}`;
  let g = cache.get(key);
  if (!g) { g = name === 'rosace' && simple ? rosaceSimple() : MOTIFS[name](repeat); cache.set(key, g); }
  const padR = Math.max(g.w, g.h) <= 250 ? 1.6 : 2.6;
  return (
    <svg className={className} viewBox={`-4 -4 ${g.w + 8} ${g.h + 8}`} fill="none" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={circuit ? 1 : 3.2} vectorEffect="non-scaling-stroke">
        {g.paths.map((d, i) => <path key={i} d={d} className={pathClass} pathLength={1} />)}
      </g>
      {!circuit ? (
        <g stroke="var(--cyan)" strokeWidth={0.9} strokeDasharray="3 5" strokeLinecap="round" opacity={0.75}>
          {g.paths.map((d, i) => <path key={i} d={d} />)}
        </g>
      ) : (
        <g fill="currentColor">
          {g.pads.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={padR} />)}
        </g>
      )}
    </svg>
  );
}
