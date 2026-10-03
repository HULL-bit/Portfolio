/**
 * Motifs inspirés des broderies du boubou : rosaces, festons à anneaux suspendus, chaînettes, treillis, quatre-feuilles.
 * Chaque motif fournit les mêmes formes pour la version « brodée » (traits épais + fil brillant)
 * et la version « circuit » (traits fins + pastilles de soudure aux intersections).
 */
export type MotifName = 'rosace' | 'feston' | 'anneaux' | 'chainette' | 'treillis' | 'quatrefeuille';
export type Geometry = { w: number; h: number; paths: string[]; pads: [number, number][] };

const f = (n: number) => Math.round(n * 100) / 100;
const pt = (cx: number, cy: number, r: number, a: number): [number, number] => [cx + r * Math.cos(a), cy + r * Math.sin(a)];

function rosace(): Geometry {
  const c = 100, N = 12, paths: string[] = [], pads: [number, number][] = [];
  paths.push(`M ${c + 92} ${c} A 92 92 0 1 0 ${c - 92} ${c} A 92 92 0 1 0 ${c + 92} ${c}`);
  paths.push(`M ${c + 30} ${c} A 30 30 0 1 0 ${c - 30} ${c} A 30 30 0 1 0 ${c + 30} ${c}`);
  paths.push(`M ${c + 9} ${c} A 9 9 0 1 0 ${c - 9} ${c} A 9 9 0 1 0 ${c + 9} ${c}`);
  for (let i = 0; i < N; i++) {
    const a = (i / N) * Math.PI * 2, half = Math.PI / N;
    const [x1, y1] = pt(c, c, 30, a), [x2, y2] = pt(c, c, 80, a);
    const [cx1, cy1] = pt(c, c, 66, a - half * 1.25), [cx2, cy2] = pt(c, c, 66, a + half * 1.25);
    paths.push(`M ${f(x1)} ${f(y1)} Q ${f(cx1)} ${f(cy1)} ${f(x2)} ${f(y2)} Q ${f(cx2)} ${f(cy2)} ${f(x1)} ${f(y1)}`);
    pads.push([f(x2), f(y2)], [f(x1), f(y1)]);
    const [ox, oy] = pt(c, c, 92, a + half);
    paths.push(`M ${f(x2)} ${f(y2)} L ${f(ox)} ${f(oy)}`);
    pads.push([f(ox), f(oy)]);
  }
  return { w: 200, h: 200, paths, pads };
}

function feston(count = 40): Geometry {
  const u = 36, paths: string[] = [], pads: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const x = i * u;
    paths.push(`M ${x} 6 A ${u / 2} ${u / 2} 0 0 0 ${x + u} 6`);
    const cx = x + u / 2;
    paths.push(`M ${cx + 5} ${6 + u / 2 + 9} a 5 5 0 1 0 -10 0 a 5 5 0 1 0 10 0`);
    paths.push(`M ${cx} ${6 + u / 2} L ${cx} ${6 + u / 2 + 4}`);
    pads.push([x, 6], [cx, 6 + u / 2]);
  }
  paths.unshift(`M 0 6 L ${count * u} 6`);
  return { w: count * u, h: 6 + u / 2 + 18, paths, pads };
}

function anneaux(count = 40): Geometry {
  const u = 30, paths: string[] = [], pads: [number, number][] = [];
  paths.push(`M 0 4 L ${count * u} 4`);
  for (let i = 0; i < count; i++) {
    const cx = i * u + u / 2, big = i % 2 === 0, r = big ? 9 : 6, len = big ? 22 : 12;
    paths.push(`M ${cx} 4 L ${cx} ${4 + len}`);
    paths.push(`M ${cx + r} ${4 + len + r} a ${r} ${r} 0 1 0 ${-2 * r} 0 a ${r} ${r} 0 1 0 ${2 * r} 0`);
    pads.push([cx, 4]);
  }
  return { w: count * u, h: 4 + 22 + 18 + 2, paths, pads };
}

function chainette(count = 40): Geometry {
  const u = 26, paths: string[] = [], pads: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    const x = i * u;
    paths.push(`M ${x} 14 a 17 8 0 1 0 34 0 a 17 8 0 1 0 -34 0`);
    pads.push([x + 8.5, 14 - 6], [x + 8.5, 14 + 6]);
  }
  return { w: (count - 1) * u + 34, h: 28, paths, pads };
}

function treillis(): Geometry {
  const s = 40, n = 5, paths: string[] = [], pads: [number, number][] = [];
  for (let i = 0; i <= n; i++) for (let j = 0; j <= n; j++) {
    if ((i + j) % 2) continue;
    const x = i * s, y = j * s;
    pads.push([x, y]);
    if (i < n && j < n) paths.push(`M ${x} ${y} L ${x + s} ${y + s}`);
    if (i < n && j > 0) paths.push(`M ${x} ${y} L ${x + s} ${y - s}`);
    paths.push(`M ${x + 6} ${y} a 6 6 0 1 0 -12 0 a 6 6 0 1 0 12 0`);
  }
  return { w: n * s, h: n * s, paths, pads };
}

function quatrefeuille(): Geometry {
  const c = 50, paths: string[] = [], pads: [number, number][] = [];
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2, [x, y] = pt(c, c, 22, a);
    paths.push(`M ${f(x + 18)} ${f(y)} A 18 18 0 1 0 ${f(x - 18)} ${f(y)} A 18 18 0 1 0 ${f(x + 18)} ${f(y)}`);
    const [px, py] = pt(c, c, 40, a);
    pads.push([f(px), f(py)]);
  }
  paths.push(`M ${c + 8} ${c} A 8 8 0 1 0 ${c - 8} ${c} A 8 8 0 1 0 ${c + 8} ${c}`);
  pads.push([c, c]);
  return { w: 100, h: 100, paths, pads };
}

export const MOTIFS: Record<MotifName, (count?: number) => Geometry> = { rosace, feston, anneaux, chainette, treillis, quatrefeuille };
