import type { Project } from '@/lib/schemas';

type Node = Project['architecture']['nodes'][number];
const ORDER: Node['kind'][] = ['front', 'proxy', 'api', 'db'];
const KIND_COLOR: Record<Node['kind'], string> = { front: '#00E5FF', proxy: '#7C3AED', api: '#3D5AFE', db: '#FFB800', host: '#8d95a8' };
const NW = 196, NH = 46, GAP = 22, PAD = 28, W = 920;

/** Schéma d'architecture généré depuis `architecture[]` : colonnes par rôle, liens animés avec des paquets de lumière. Aucun JS. */
export function ArchitectureDiagram({ architecture, title }: { architecture: Project['architecture']; title: string }) {
  const nodes = architecture.nodes;
  const cols = ORDER.filter((k) => nodes.some((n) => n.kind === k));
  const hosts = nodes.filter((n) => n.kind === 'host');
  const colX = (i: number) => cols.length === 1 ? (W - NW) / 2 : PAD + (i * (W - 2 * PAD - NW)) / (cols.length - 1);
  const maxCount = Math.max(...cols.map((k) => nodes.filter((n) => n.kind === k).length));
  const mainH = maxCount * NH + (maxCount - 1) * GAP + 2 * 20;
  const pos = new Map<string, { x: number; y: number; n: Node }>();
  cols.forEach((k, ci) => {
    const list = nodes.filter((n) => n.kind === k);
    const total = list.length * NH + (list.length - 1) * GAP;
    list.forEach((n, i) => pos.set(n.id, { x: colX(ci), y: (mainH - total) / 2 + i * (NH + GAP), n }));
  });
  const hostY = mainH + 34;
  hosts.forEach((n, i) => pos.set(n.id, { x: PAD, y: hostY + i * (NH - 4 + 12), n }));
  const H = hosts.length ? hostY + hosts.length * (NH - 4 + 12) + 8 : mainH;

  const links = architecture.links.flatMap((l, i) => {
    const a = pos.get(l.from), b = pos.get(l.to);
    if (!a || !b) return [];
    let d: string;
    if (a.n.kind === 'host' || b.n.kind === 'host') {
      const [h, o] = a.n.kind === 'host' ? [a, b] : [b, a];
      const cx = o.x + NW / 2;
      d = a.n.kind === 'host' ? `M ${cx} ${h.y} L ${cx} ${o.y + NH}` : `M ${cx} ${o.y + NH} L ${cx} ${h.y}`;
    } else if (a.x < b.x) {
      const x1 = a.x + NW, x2 = b.x, dx = (x2 - x1) * 0.5;
      d = `M ${x1} ${a.y + NH / 2} C ${x1 + dx} ${a.y + NH / 2}, ${x2 - dx} ${b.y + NH / 2}, ${x2} ${b.y + NH / 2}`;
    } else if (a.x > b.x) {
      const x1 = a.x, x2 = b.x + NW, dx = (x1 - x2) * 0.5;
      d = `M ${x1} ${a.y + NH / 2} C ${x1 - dx} ${a.y + NH / 2}, ${x2 + dx} ${b.y + NH / 2}, ${x2} ${b.y + NH / 2}`;
    } else {
      const cx = a.x + NW / 2, down = b.y > a.y;
      d = `M ${cx} ${down ? a.y + NH : a.y} L ${cx} ${down ? b.y : b.y + NH}`;
    }
    return [{ d, i, key: l.from + l.to, color: KIND_COLOR[b.n.kind] }];
  });
  const label = `${title} — ${nodes.map((n) => n.label).join(', ')}`;

  return (
    <svg className="arch" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} focusable="false">
      {links.map((l) => <path key={l.key} d={l.d} className="arch-link" fill="none" />)}
      {links.flatMap((l) => [0, 1].map((p) => (
        <circle key={`${l.key}-${p}`} r="3.4" className="arch-packet" fill={l.color} style={{ offsetPath: `path('${l.d}')`, animationDelay: `${(l.i * 0.55 + p * 1.3).toFixed(2)}s` }} />
      )))}
      {[...pos.values()].map(({ x, y, n }) => {
        const host = n.kind === 'host';
        const w = host ? W - 2 * PAD : NW, h = host ? NH - 4 : NH;
        return (
          <g key={n.id}>
            <rect x={x} y={y} width={w} height={h} rx="10" fill="#0A0D18" stroke={KIND_COLOR[n.kind]} strokeWidth="1.4" strokeDasharray={host ? '5 5' : undefined} />
            <circle cx={x + 16} cy={y + h / 2} r="3.4" fill={KIND_COLOR[n.kind]} />
            <text x={x + 30} y={y + h / 2 + 4.5} fontFamily="var(--font-mono)" fontSize="13" fill="#F5F7FF">{n.label}</text>
          </g>
        );
      })}
    </svg>
  );
}
