// Échantillonne profil.jpeg → positions de particules pour le Hero (R3F).
// Sortie : Float32Array binaire, 3 floats par point [x, y, luminance]
//   x ∈ [-0.75, 0.75], y ∈ [-1, 1] (haut = +1), luminance ∈ [0, 1].
//   public/data/portrait.bin     24 000 points (desktop)
//   public/data/portrait-sm.bin   9 000 points (tablette / mid)
// Si profil/profil-detoure.png existe, son canal alpha sert de masque ;
// sinon le fond (mur clair, plafond, porte) est retiré par seuillage couleur.
// Usage : node scripts/sample-portrait.mjs [--preview chemin.png]
import sharp from 'sharp';
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';

const SRC = 'profil/profil.jpeg';
const CUTOUT = 'profil/profil-detoure.png';
const OUTS = [['public/data/portrait.bin', 24000], ['public/data/portrait-sm.bin', 9000]];
const previewIdx = process.argv.indexOf('--preview');
const preview = previewIdx > 0 ? process.argv[previewIdx + 1] : null;

if (!existsSync(SRC)) { console.warn('[portrait] profil.jpeg absent — ignoré'); process.exit(0); }
const newest = Math.max(statSync(SRC).mtimeMs, statSync(new URL(import.meta.url)).mtimeMs, existsSync(CUTOUT) ? statSync(CUTOUT).mtimeMs : 0);
if (!preview && OUTS.every(([f]) => existsSync(f) && statSync(f).mtimeMs > newest)) { console.log('[portrait] à jour'); process.exit(0); }

const W = 270, H = 360;
const rgb = await sharp(SRC).rotate().resize(W, H, { fit: 'cover' }).removeAlpha().raw().toBuffer();
const gray = await sharp(SRC).rotate().resize(W, H, { fit: 'cover' }).greyscale().normalise({ lower: 3, upper: 97 }).raw().toBuffer();

// --- masque de premier plan ---
const mask = new Uint8Array(W * H);
const blue = new Uint8Array(W * H);
if (existsSync(CUTOUT)) {
  const a = await sharp(CUTOUT).resize(W, H, { fit: 'cover' }).ensureAlpha().extractChannel(3).raw().toBuffer();
  for (let i = 0; i < W * H; i++) mask[i] = a[i] > 128 ? 1 : 0;
} else {
  for (let i = 0; i < W * H; i++) {
    const r = rgb[i * 3] / 255, g = rgb[i * 3 + 1] / 255, b = rgb[i * 3 + 2] / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    const s = max === 0 ? 0 : d / max;
    let h = 0;
    if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h = (h * 60 + 360) % 360;
    const isBlue = h > 205 && h < 270 && s > 0.35 && max > 0.25;
    blue[i] = isBlue ? 1 : 0;
    const x = i % W, y = (i / W) | 0;
    // A priori géométrique : ellipse de la tête + buste (cadrage selfie de profil.jpeg)
    const inHead = ((x - 130) / 72) ** 2 + ((y - 98) / 88) ** 2 <= 1;
    const inBody = y >= 165;
    // « Mur » : jaune/orangé clair saturé, ou blanc (moulure, vitre)
    const wall = (h >= 31 && h <= 60 && s > 0.33 && max > 0.5) || (max > 0.75 && s < 0.3);
    mask[i] = isBlue || ((inHead || inBody) && !wall) ? 1 : 0;
  }
}
const idx = (x, y) => y * W + x;
const morph = (src, grow) => {
  const out = new Uint8Array(src.length);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    let any = 0, all = 1;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const v = src[idx(x + dx, y + dy)]; any |= v; all &= v; }
    out[idx(x, y)] = grow ? any : all;
  }
  return out;
};
let m = morph(morph(mask, true), false);          // fermeture
m = morph(morph(m, false), true);                  // ouverture
// plus grande composante connexe
const label = new Int32Array(W * H);
let best = 0, bestSize = 0, next = 1;
for (let s = 0; s < W * H; s++) {
  if (!m[s] || label[s]) continue;
  const stack = [s]; label[s] = next; let size = 0;
  while (stack.length) {
    const p = stack.pop(); size++;
    const x = p % W, y = (p / W) | 0;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]])
      if (nx >= 0 && ny >= 0 && nx < W && ny < H && m[idx(nx, ny)] && !label[idx(nx, ny)]) { label[idx(nx, ny)] = next; stack.push(idx(nx, ny)); }
  }
  if (size > bestSize) { bestSize = size; best = next; }
  next++;
}
const fg = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) fg[i] = label[i] === best ? 1 : 0;
// remplissage des trous : tout ce qui n'est pas atteint depuis les bords est du premier plan
const outside = new Uint8Array(W * H);
const q = [];
for (let x = 0; x < W; x++) for (const y of [0, H - 1]) if (!fg[idx(x, y)]) { outside[idx(x, y)] = 1; q.push(idx(x, y)); }
for (let y = 0; y < H; y++) for (const x of [0, W - 1]) if (!fg[idx(x, y)] && !outside[idx(x, y)]) { outside[idx(x, y)] = 1; q.push(idx(x, y)); }
while (q.length) {
  const p = q.pop(); const x = p % W, y = (p / W) | 0;
  for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]])
    if (nx >= 0 && ny >= 0 && nx < W && ny < H && !fg[idx(nx, ny)] && !outside[idx(nx, ny)]) { outside[idx(nx, ny)] = 1; q.push(idx(nx, ny)); }
}
for (let i = 0; i < W * H; i++) if (!outside[i]) fg[i] = 1;

// --- contours (Sobel sur gris flouté) + poids de densité ---
const blurred = await sharp(gray, { raw: { width: W, height: H, channels: 1 } }).blur(1.2).raw().toBuffer();
const edge = new Float32Array(W * H);
let emax = 1e-6;
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
  const g = (dx, dy) => blurred[idx(x + dx, y + dy)];
  const gx = -g(-1, -1) - 2 * g(-1, 0) - g(-1, 1) + g(1, -1) + 2 * g(1, 0) + g(1, 1);
  const gy = -g(-1, -1) - 2 * g(0, -1) - g(1, -1) + g(-1, 1) + 2 * g(0, 1) + g(1, 1);
  const e = Math.hypot(gx, gy); edge[idx(x, y)] = e; if (e > emax) emax = e;
}
const lum = new Float32Array(W * H);
const weight = new Float32Array(W * H);
const fgEdges = [];
for (let i = 0; i < W * H; i++) if (fg[i]) fgEdges.push(edge[i]);
fgEdges.sort((x, y) => x - y);
const e95 = fgEdges[Math.floor(fgEdges.length * 0.95)] || 1;
const inHeadZone = (x, y) => ((x - 130) / 80) ** 2 + ((y - 100) / 95) ** 2 <= 1;
// étirement du contraste séparé pour la tête (peau sombre) et pour le buste
const stretch = (pred) => {
  const v = [];
  for (let i = 0; i < W * H; i++) if (fg[i] && pred(i % W, (i / W) | 0)) v.push(gray[i]);
  v.sort((x, y) => x - y);
  return [v[Math.floor(v.length * 0.04)], v[Math.floor(v.length * 0.96)]];
};
const [h0, h1] = stretch((x, y) => inHeadZone(x, y));
const [b0, b1] = stretch((x, y) => !inHeadZone(x, y));
for (let i = 0; i < W * H; i++) {
  if (!fg[i]) continue;
  const x = i % W, y = (i / W) | 0;
  const head = inHeadZone(x, y);
  const fade = Math.min(1, Math.max(0, (1 - y / H) / 0.3)); // le portrait se dissout vers le bas
  const e = Math.min(0.6, edge[i] / e95) / 0.6;
  const [lo, hi] = head ? [h0, h1] : [b0, b1];
  const l = Math.min(1, Math.max(0, (gray[i] - lo) / (hi - lo)));
  lum[i] = Math.max(Math.min(1, 0.1 + Math.pow(l, 1.1) * 0.7 + e * 0.35), blue[i] ? 0.9 : 0);
  // pointillisme : la densité suit la lumière (visage) + les contours (nets, plafonnés)
  weight[i] = head
    ? (0.02 + 1.6 * Math.pow(l, 2) + 0.45 * e) * fade * fade * 2.2
    : (0.03 + 0.3 * l + 0.35 * e + (blue[i] ? 0.45 : 0)) * fade * fade;
}
const cdf = new Float64Array(W * H);
let acc = 0;
for (let i = 0; i < W * H; i++) { acc += weight[i]; cdf[i] = acc; }

// RNG déterministe (mulberry32) : même portrait à chaque build
let seed = 0x5d1a3;
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pick = (r) => { let lo = 0, hi = W * H - 1; while (lo < hi) { const mid = (lo + hi) >> 1; cdf[mid] < r ? (lo = mid + 1) : (hi = mid); } return lo; };

mkdirSync('public/data', { recursive: true });
let previewPts = null;
for (const [file, n] of OUTS) {
  const out = new Float32Array(n * 3);
  for (let k = 0; k < n; k++) {
    const p = pick(rnd() * acc), px = p % W + rnd(), py = ((p / W) | 0) + rnd();
    out[k * 3] = ((px / W) - 0.5) * 1.5;
    out[k * 3 + 1] = (0.5 - py / H) * 2;
    out[k * 3 + 2] = lum[p];
  }
  writeFileSync(file, Buffer.from(out.buffer));
  console.log(`[portrait] ${n} points → ${file} (${(out.byteLength / 1024).toFixed(0)} Ko)`);
  previewPts ??= out;
}
if (preview) {
  const PW = 540, PH = 720, buf = Buffer.alloc(PW * PH * 3);
  for (let k = 0; k < previewPts.length / 3; k++) {
    const x = Math.round((previewPts[k * 3] / 1.5 + 0.5) * PW), y = Math.round((0.5 - previewPts[k * 3 + 1] / 2) * PH), l = previewPts[k * 3 + 2];
    for (let dy = 0; dy < 2; dy++) for (let dx = 0; dx < 2; dx++) {
      const o = ((y + dy) * PW + x + dx) * 3; if (o < 0 || o >= buf.length - 2) continue;
      buf[o] = Math.min(255, buf[o] + 40 + 90 * l * l); buf[o + 1] = Math.min(255, buf[o + 1] + 70 + 185 * l); buf[o + 2] = Math.min(255, buf[o + 2] + 140 + 115 * l);
    }
  }
  await sharp(buf, { raw: { width: PW, height: PH, channels: 3 } }).png().toFile(preview);
  console.log(`[portrait] aperçu → ${preview}`);
}
