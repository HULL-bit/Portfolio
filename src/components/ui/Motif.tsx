import { MOTIFS, type MotifName } from './motifs';

type Props = {
  name: MotifName;
  /** « embroidery » : fil épais brillant · « circuit » : traits fins + pastilles de soudure. */
  variant?: 'embroidery' | 'circuit';
  /** Nombre de répétitions pour les bandes (feston, anneaux, chaînette). */
  repeat?: number;
  className?: string;
  /** Classe appliquée aux tracés (animation DrawSVG à l'étape 5). */
  pathClass?: string;
};

const cache = new Map<string, ReturnType<(typeof MOTIFS)[MotifName]>>();

/** Motif SVG décoratif (aria-hidden). La couleur suit `currentColor`. */
export function Motif({ name, variant = 'embroidery', repeat, className, pathClass = 'motif-path' }: Props) {
  const key = `${name}:${repeat ?? ''}`;
  let g = cache.get(key);
  if (!g) { g = MOTIFS[name](repeat); cache.set(key, g); }
  const circuit = variant === 'circuit';
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
