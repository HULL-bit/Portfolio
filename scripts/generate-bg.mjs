// Génère les fonds « nébuleuse » (même bruit fbm que l'ancien shader, pré-calculé) → public/images/bg/nebula-<teinte>.webp
// Rendu identique sur tous les appareils (WebGL ou non) et sans aucun coût GPU : le site anime ces images en CSS.
// Régénère seulement si ce script change. Usage : node scripts/generate-bg.mjs
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

const OUT = 'public/images/bg';
const HASH = `${OUT}/.hash`;
const hash = createHash('sha1').update(readFileSync(new URL(import.meta.url))).digest('hex');
if (existsSync(HASH) && readFileSync(HASH, 'utf8') === hash) { console.log('[bg] à jour'); process.exit(0); }
mkdirSync(OUT, { recursive: true });

// ── bruit simplex 3D (Gustavson) ──
const grad3 = [[1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],[1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],[0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]];
const perm = new Uint8Array(512);
{ let s = 7; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; const p = Array.from({ length: 256 }, (_, i) => i); for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; } for (let i = 0; i < 512; i++) perm[i] = p[i & 255]; }
const F3 = 1 / 3, G3 = 1 / 6;
function snoise(x, y, z) {
  const s = (x + y + z) * F3, i = Math.floor(x + s), j = Math.floor(y + s), k = Math.floor(z + s), t = (i + j + k) * G3;
  const x0 = x - (i - t), y0 = y - (j - t), z0 = z - (k - t);
  let i1, j1, k1, i2, j2, k2;
  if (x0 >= y0) { if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; } else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; } }
  else { if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; } else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; } else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; } }
  const x1 = x0 - i1 + G3, y1 = y0 - j1 + G3, z1 = z0 - k1 + G3, x2 = x0 - i2 + 2 * G3, y2 = y0 - j2 + 2 * G3, z2 = z0 - k2 + 2 * G3, x3 = x0 - 1 + 3 * G3, y3 = y0 - 1 + 3 * G3, z3 = z0 - 1 + 3 * G3;
  const ii = i & 255, jj = j & 255, kk = k & 255;
  const g0 = grad3[perm[ii + perm[jj + perm[kk]]] % 12], g1 = grad3[perm[ii + i1 + perm[jj + j1 + perm[kk + k1]]] % 12], g2 = grad3[perm[ii + i2 + perm[jj + j2 + perm[kk + k2]]] % 12], g3 = grad3[perm[ii + 1 + perm[jj + 1 + perm[kk + 1]]] % 12];
  const c = (t, g, x, y, z) => { let a = 0.6 - x * x - y * y - z * z; if (a < 0) return 0; a *= a; return a * a * (g[0] * x + g[1] * y + g[2] * z); };
  return 32 * (c(0, g0, x0, y0, z0) + c(0, g1, x1, y1, z1) + c(0, g2, x2, y2, z2) + c(0, g3, x3, y3, z3));
}
const fbm = (x, y, z) => { let a = 0.5, s = 0; for (let o = 0; o < 3; o++) { s += a * snoise(x, y, z); x *= 2.02; y *= 2.02; z *= 2.02; a *= 0.5; } return s; };
const smooth = (a, b, v) => { const t = Math.min(1, Math.max(0, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;

// teintes = palettes du fond d'origine : [A principale, B secondaire, C fond], veines or, décalage de temps
const TINTS = {
  indigo: { A: [0.10, 0.14, 0.52], B: [0.30, 0.10, 0.52], C: [0.016, 0.02, 0.04], vein: 0.5, t: 3.0 },
  violet: { A: [0.16, 0.08, 0.50], B: [0.34, 0.07, 0.42], C: [0.016, 0.018, 0.04], vein: 0.9, t: 17.0 },
  cyan: { A: [0.04, 0.24, 0.40], B: [0.10, 0.10, 0.46], C: [0.014, 0.02, 0.04], vein: 0.5, t: 31.0 },
  gold: { A: [0.20, 0.10, 0.52], B: [0.34, 0.14, 0.30], C: [0.016, 0.02, 0.04], vein: 1.0, t: 47.0 },
};
const W = 1600, H = 1000;
for (const [name, T] of Object.entries(TINTS)) {
  const buf = Buffer.alloc(W * H * 3);
  let seed = 1234;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const u = x / W, v = 1 - y / H;
    const px = (u - 0.5) * (W / H) * 0.95, py = (v - 0.5) * 0.95, t = T.t;
    const n = fbm(px, py, t), n2 = fbm(px * 1.6 + 3.1, py * 1.6 + 3.1, t * 1.3 + 5);
    let c = [0, 1, 2].map((i) => mix(T.C[i], T.A[i], smooth(-0.15, 0.55, n)));
    const wB = smooth(0, 0.7, n2) * 0.6;
    c = c.map((val, i) => mix(val, T.B[i], wB));
    const vig = smooth(1.25, 0.15, Math.hypot((u - 0.55) * 1.1, v - 0.42));
    c = c.map((val, i) => mix(T.C[i], val, 0.25 + 0.65 * vig));
    const ridge = Math.pow(1 - Math.abs(fbm(px * 0.9 + 7, py * 0.9 + 7, t * 0.6) * 2), 14);
    const rare = smooth(0.25, 0.6, fbm(px * 0.35 - 2, py * 0.35 - 2, t * 0.2 + 9));
    const gold = ridge * rare * T.vein * 0.32;
    c[0] += gold; c[1] += gold * 0.72;
    const o = (y * W + x) * 3, d = (rnd() - 0.5) / 255; // dithering : évite les bandes
    for (let i = 0; i < 3; i++) buf[o + i] = Math.max(0, Math.min(255, Math.round((c[i] + d) * 255)));
  }
  await sharp(buf, { raw: { width: W, height: H, channels: 3 } }).webp({ quality: 78, effort: 5 }).toFile(`${OUT}/nebula-${name}.webp`);
  console.log(`[bg] nebula-${name}.webp`);
}
writeFileSync(HASH, hash);
