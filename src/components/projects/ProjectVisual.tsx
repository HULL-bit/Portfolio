import { hashString, rng } from '@/lib/rng';
import type { Project } from '@/lib/schemas';

type Props = { project: Pick<Project, 'slug' | 'categories' | 'accent' | 'stack'>; title: string; className?: string };

/**
 * Visuel de remplacement : interface fictive en filaire (indigo/cyan + accent du projet), générée de façon déterministe
 * à partir du slug. Remplacé par les vraies captures dès qu'elles existent (`images[]`). Trois couches pour le parallaxe.
 */
export function ProjectVisual({ project, title, className }: Props) {
  const r = rng(hashString(project.slug));
  const a = project.accent;
  const has = (c: string) => (project.categories as string[]).includes(c);
  const bars = Array.from({ length: 9 }, () => 18 + r() * 62);
  let y = 0;
  const line = Array.from({ length: 12 }, (_, i) => { y = Math.min(70, Math.max(8, y + (r() - 0.45) * 22 + (i === 0 ? 40 : 0))); return [i * 30, 80 - y] as const; });
  const path = line.map(([x, v], i) => `${i ? 'L' : 'M'} ${x} ${v}`).join(' ');
  const lineItems = Array.from({ length: 5 }, () => 40 + r() * 70);
  const id = project.slug;

  return (
    <svg className={className} viewBox="0 0 640 360" role="img" aria-label={title} preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} stopOpacity=".55" /><stop offset="1" stopColor={a} stopOpacity="0" /></linearGradient>
        <filter id={`b-${id}`} x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <rect width="640" height="360" fill="#0A0D18" />
      <g stroke="#3D5AFE" strokeOpacity=".16" strokeWidth="1">
        {Array.from({ length: 17 }, (_, i) => <path key={`v${i}`} d={`M ${i * 40} 0 V 360`} />)}
        {Array.from({ length: 10 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 40} H 640`} />)}
      </g>
      <circle cx="520" cy="40" r="140" fill={a} opacity=".22" filter={`url(#b-${id})`} />

      {/* couche 1 : fenêtre applicative */}
      <g className="vis-l1">
        <rect x="46" y="42" width="430" height="262" rx="14" fill="#0A0D18" fillOpacity=".85" stroke={a} strokeWidth="1.5" />
        <path d="M 46 74 H 476" stroke={a} strokeOpacity=".5" />
        {[0, 1, 2].map((i) => <circle key={i} cx={64 + i * 14} cy="58" r="3.5" fill={i === 0 ? '#FFB800' : a} opacity={i === 0 ? 1 : 0.6} />)}
        <rect x="118" y="51" width="190" height="14" rx="7" fill="none" stroke="#7D8597" strokeOpacity=".6" />
        <text x="128" y="61.5" fontFamily="var(--font-mono)" fontSize="9" fill="#8d95a8">{project.slug}.sys</text>
        <path d="M 46 74 V 304" stroke={a} strokeOpacity=".3" transform="translate(96 0)" />
        {lineItems.map((w, i) => <rect key={i} x="60" y={92 + i * 24} width={Math.min(w, 74)} height="8" rx="4" fill={i === 0 ? a : '#3D5AFE'} opacity={i === 0 ? 0.9 : 0.35} />)}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={156 + i * 104} y="88" width="92" height="52" rx="8" fill="none" stroke="#3D5AFE" strokeOpacity=".6" />
            <rect x={166 + i * 104} y="100" width={30 + r() * 28} height="6" rx="3" fill="#7D8597" />
            <rect x={166 + i * 104} y="118" width={44 + r() * 26} height="12" rx="3" fill={i === 0 ? '#FFB800' : a} opacity=".9" />
          </g>
        ))}
        <g transform="translate(156 158)">
          <path d={`${path} L 330 80 L 0 80 Z`} fill={`url(#g-${id})`} />
          <path d={path} fill="none" stroke={a} strokeWidth="2" strokeLinejoin="round" />
          {line.map(([x, v], i) => (i % 3 === 0 ? <circle key={i} cx={x} cy={v} r="3.4" fill="#05060A" stroke="#00E5FF" strokeWidth="1.5" /> : null))}
        </g>
        {has('bdd') ? bars.slice(0, 5).map((b, i) => <rect key={i} x={160 + i * 24} y={250 - b * 0.4} width="14" height={b * 0.4} rx="2" fill="#00E5FF" opacity=".55" />) : null}
        
      </g>

      {/* couche 2 : mobile, terminal, nœuds IA */}
      <g className="vis-l2">
        {has('mobile') ? (
          <g>
            <rect x="452" y="64" width="124" height="246" rx="22" fill="#05060A" stroke="#00E5FF" strokeWidth="1.5" />
            <rect x="494" y="72" width="40" height="6" rx="3" fill="#3D5AFE" opacity=".6" />
            {[0, 1, 2, 3].map((i) => (
              <g key={i}>
                <rect x="466" y={96 + i * 48} width="96" height="38" rx="9" fill="none" stroke={a} strokeOpacity=".7" />
                <circle cx="482" cy={115 + i * 48} r="8" fill={i === 1 ? '#FFB800' : a} opacity=".85" />
                <rect x="498" y={108 + i * 48} width={36 + (i * 11) % 22} height="6" rx="3" fill="#8d95a8" />
                <rect x="498" y={120 + i * 48} width="24" height="5" rx="2.5" fill="#3D5AFE" opacity=".6" />
              </g>
            ))}
          </g>
        ) : null}
        {has('systeme') ? (
          <g transform="translate(300 232)">
            <rect width="190" height="92" rx="10" fill="#05060A" stroke="#FFB800" strokeOpacity=".7" />
            {['$ systemctl status nginx', '● active (running)', '$ tail -f api.log'].map((l, i) => <text key={i} x="12" y={24 + i * 20} fontFamily="var(--font-mono)" fontSize="9.5" fill={i === 1 ? '#00E5FF' : '#B9C0D4'}>{l}</text>)}
          </g>
        ) : null}
        {has('ia') ? (
          <g transform="translate(386 98)" stroke="#00E5FF" strokeOpacity=".8" fill="#05060A">
            {[[0, 0], [40, -16], [44, 30], [96, 6], [92, 56]].map(([x, yy], i, arr) => (
              <g key={i}>{arr.slice(i + 1).map(([x2, y2], j) => (j < 2 ? <path key={j} d={`M ${x} ${yy} L ${x2} ${y2}`} fill="none" /> : null))}<circle cx={x} cy={yy} r="6" strokeWidth="1.6" /></g>
            ))}
          </g>
        ) : null}
      </g>

      <text x="46" y="334" fontFamily="var(--font-display)" fontWeight="700" fontSize="17" letterSpacing="-.5" fill="#F5F7FF">{title.length > 30 ? `${title.slice(0, 29)}…` : title}</text>

      {/* couche 3 : étiquettes de pile */}
      <g className="vis-l3" fontFamily="var(--font-mono)" fontSize="10">
        {project.stack.slice(0, 2).map((s, i) => (
          <g key={s} transform={`translate(${400 + i * 70} 322)`}>
            <rect width={s.length * 6.4 + 16} height="20" rx="10" fill="none" stroke={a} strokeOpacity=".8" />
            <text x="8" y="13.5" fill="#B9C0D4">{s}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}
