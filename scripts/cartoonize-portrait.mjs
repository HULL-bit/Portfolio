// Portrait « dessin animé » du Hero : photo → aplats de couleurs (k-means) + contours d'encre + détourage « autocollant »
// sur un fond aux couleurs du site. Sortie : profil/hero-cartoon.png (source, déclinée ensuite par optimize-images).
// Usage : node scripts/cartoonize-portrait.mjs [--k=11] [--preview]
import sharp from 'sharp';
import { existsSync, statSync } from 'node:fs';

const SRC = 'profil/profil.jpeg';
const OUT = 'profil/hero-cartoon.png';
const arg = (n, d) => { const a = process.argv.find((x) => x.startsWith(`--${n}=`)); return a ? a.slice(n.length + 3) : d; };
const K = Number(arg('k', 8));
if (!existsSync(SRC)) { console.warn('[cartoon] profil.jpeg absent — ignoré'); process.exit(0); }
if (!process.argv.includes('--force') && existsSync(OUT) && statSync(OUT).mtimeMs > Math.max(statSync(SRC).mtimeMs, statSync(new URL(import.meta.url)).mtimeMs)) { console.log('[cartoon] à jour'); process.exit(0); }

const W = 810, H = 1080;
let seed = 99;
const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

// ── 1. masque du sujet (couleur + a priori géométrique) à basse résolution, puis lissé à pleine résolution ──
const mw = 270, mh = 360;
const small = await sharp(SRC).rotate().resize(mw, mh, { fit: 'cover' }).removeAlpha().raw().toBuffer();
const mask = new Uint8Array(mw * mh), blue = new Uint8Array(mw * mh);
for (let i = 0; i < mw * mh; i++) {
  const r = small[i * 3] / 255, g = small[i * 3 + 1] / 255, b = small[i * 3 + 2] / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, s = max === 0 ? 0 : d / max;
  let h = 0; if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4; h = (h * 60 + 360) % 360;
  const isBlue = h > 205 && h < 270 && s > 0.35 && max > 0.25; blue[i] = isBlue ? 1 : 0;
  const x = i % mw, y = (i / mw) | 0;
  const inHead = ((x - 131) / 60) ** 2 + ((y - 95) / 82) ** 2 <= 1 && !(y < 55 && max > 0.45), inBody = y >= 165;
  const wall = (h >= 31 && h <= 60 && s > 0.33 && max > 0.5) || (max > 0.75 && s < 0.3);
  mask[i] = isBlue || ((inHead || inBody) && !wall) ? 1 : 0;
}
const idx = (x, y) => y * mw + x;
const morph = (src, grow) => { const o = new Uint8Array(src.length); for (let y = 1; y < mh - 1; y++) for (let x = 1; x < mw - 1; x++) { let any = 0, all = 1; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const v = src[idx(x + dx, y + dy)]; any |= v; all &= v; } o[idx(x, y)] = grow ? any : all; } return o; };
let m = morph(morph(mask, true), false); m = morph(morph(m, false), true);
const label = new Int32Array(mw * mh); let best = 0, bestSize = 0, next = 1;
for (let s = 0; s < mw * mh; s++) { if (!m[s] || label[s]) continue; const st = [s]; label[s] = next; let size = 0; while (st.length) { const p = st.pop(); size++; const x = p % mw, y = (p / mw) | 0; for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) if (nx >= 0 && ny >= 0 && nx < mw && ny < mh && m[idx(nx, ny)] && !label[idx(nx, ny)]) { label[idx(nx, ny)] = next; st.push(idx(nx, ny)); } } if (size > bestSize) { bestSize = size; best = next; } next++; }
const fg = new Uint8Array(mw * mh); for (let i = 0; i < mw * mh; i++) fg[i] = label[i] === best ? 1 : 0;
const outside = new Uint8Array(mw * mh), q = [];
for (let x = 0; x < mw; x++) for (const y of [0, mh - 1]) if (!fg[idx(x, y)]) { outside[idx(x, y)] = 1; q.push(idx(x, y)); }
for (let y = 0; y < mh; y++) for (const x of [0, mw - 1]) if (!fg[idx(x, y)] && !outside[idx(x, y)]) { outside[idx(x, y)] = 1; q.push(idx(x, y)); }
while (q.length) { const p = q.pop(); const x = p % mw, y = (p / mw) | 0; for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) if (nx >= 0 && ny >= 0 && nx < mw && ny < mh && !fg[idx(nx, ny)] && !outside[idx(nx, ny)]) { outside[idx(nx, ny)] = 1; q.push(idx(nx, ny)); } }
for (let i = 0; i < mw * mh; i++) if (!outside[i]) fg[i] = 1;
// le sujet se fond vers le bas (cadrage selfie) : on garde tout le buste, coupé net par le bord du cadre
const maskBig = await sharp(Buffer.from(fg.map((v) => v * 255)), { raw: { width: mw, height: mh, channels: 1 } }).resize(W, H, { kernel: 'cubic' }).blur(2.4).linear(3, -255).extractChannel(0).raw().toBuffer(); // 0..255, bord adouci
const hard = new Uint8Array(W * H); for (let i = 0; i < W * H; i++) hard[i] = maskBig[i] > 127 ? 1 : 0;

// ── 2. aplats : lissage fort (médiane répétée à demi-résolution), k-means sur le sujet, filtre majoritaire ──
const half = await sharp(SRC).rotate().resize(W / 2, H / 2, { fit: 'cover' }).median(7).median(7).median(5).blur(0.8).modulate({ saturation: 1.35, brightness: 1.05 }).linear(1.1, -6).resize(W, H, { kernel: 'cubic' }).removeAlpha().raw().toBuffer();
const smooth = half;
const samples = [];
for (let i = 0; i < W * H; i += 13) if (hard[i]) samples.push([smooth[i * 3], smooth[i * 3 + 1], smooth[i * 3 + 2]]);
// k-means++ (graine fixe : même illustration à chaque build)
const cent = [samples[Math.floor(rnd() * samples.length)].slice()];
const d2 = (a, b) => (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
while (cent.length < K) { const dist = samples.map((s) => Math.min(...cent.map((c) => d2(s, c)))); const sum = dist.reduce((a, b) => a + b, 0); let r = rnd() * sum, i = 0; while (i < dist.length - 1 && (r -= dist[i]) > 0) i++; cent.push(samples[i].slice()); }
for (let it = 0; it < 14; it++) {
  const acc = cent.map(() => [0, 0, 0, 0]);
  for (const s of samples) { let bi = 0, bd = 1e9; for (let c = 0; c < K; c++) { const d = d2(s, cent[c]); if (d < bd) { bd = d; bi = c; } } acc[bi][0] += s[0]; acc[bi][1] += s[1]; acc[bi][2] += s[2]; acc[bi][3]++; }
  acc.forEach((a, c) => { if (a[3]) cent[c] = [a[0] / a[3], a[1] / a[3], a[2] / a[3]]; });
}
let lab = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) { if (!hard[i]) continue; const px = [smooth[i * 3], smooth[i * 3 + 1], smooth[i * 3 + 2]]; let bi = 0, bd = 1e9; for (let c = 0; c < K; c++) { const d = d2(px, cent[c]); if (d < bd) { bd = d; bi = c; } } lab[i] = bi; }
for (let pass = 0; pass < 4; pass++) { // filtre majoritaire 11×11 : supprime les parasites, arrondit les aplats
  const out = new Uint8Array(W * H); const cnt = new Uint16Array(K); const R = 5;
  for (let y = R; y < H - R; y++) for (let x = R; x < W - R; x++) { const i = y * W + x; if (!hard[i]) continue; cnt.fill(0); for (let dy = -R; dy <= R; dy += 2) for (let dx = -R; dx <= R; dx += 2) { const j = i + dy * W + dx; if (hard[j]) cnt[lab[j]]++; } let bi = lab[i], bc = cnt[bi]; for (let c = 0; c < K; c++) if (cnt[c] > bc) { bc = cnt[c]; bi = c; } out[i] = bi; }
  lab = out;
}
// peau : dans le visage et le cou, tout ce qui n'est pas cheveu / bleu / col blanc prend le ton de peau le plus proche (pas de taches grises)
{
  const core = new Map();
  for (let y = 300; y < 480; y += 3) for (let x = 330; x < 460; x += 3) { const l = lab[y * W + x]; core.set(l, (core.get(l) ?? 0) + 1); }
  const skin = [...core.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([l]) => l);
  const isBlue = (c) => cent[c][2] > cent[c][0] + 35;
  for (let y = 140; y < 640; y++) for (let x = 200; x < 600; x++) {
    const i = y * W + x; if (!hard[i]) continue;
    const inFace = ((x - 393) / 190) ** 2 + ((y - 285) / 240) ** 2 <= 1 && y > 140;
    const inNeck = x > 300 && x < 470 && y > 500 && y < 625;
    if (!inFace && !inNeck) continue;
    const c = lab[i]; if (skin.includes(c) || isBlue(c)) continue;
    const px = [smooth[i * 3], smooth[i * 3 + 1], smooth[i * 3 + 2]];
    const lum = (px[0] + px[1] + px[2]) / 3;
    if (inNeck && !inFace && lum > 158) continue;
    if (y < 270 && lum < 85) continue; // cheveux et sourcils
    let bi = skin[0], bd = 1e9; for (const sc of skin) { const d = d2(px, cent[sc]); if (d < bd) { bd = d; bi = sc; } }
    lab[i] = bi;
  }
}
// palette « pop » : saturation et contraste renforcés, ombres tirées vers l'indigo
const pop = cent.map(([r, g, b]) => { const l = (r + g + b) / 3; const f = 1.22; const lum = l / 255; const sh = Math.max(0, 0.35 - lum) * 2.2; return [r, g, b].map((v, k) => Math.max(0, Math.min(255, Math.round(l + (v - l) * f + (l - 128) * 0.1 + (k === 2 ? sh * 40 : 0))))); });

// ── 3. contours d'encre : traits de bande dessinée (zones plus sombres que leur voisinage) + silhouette ──
const lumaOf = async (buf, sigma) => sharp(buf, { raw: { width: W, height: H, channels: 3 } }).greyscale().blur(sigma).extractChannel(0).raw().toBuffer();
const fine = await sharp(SRC).rotate().resize(W, H, { fit: 'cover' }).median(3).removeAlpha().raw().toBuffer();
const L1 = await lumaOf(fine, 1.1), L2 = await lumaOf(fine, 7);
const ink = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++) if (hard[i] && L2[i] - L1[i] > 13) ink[i] = 1;
// silhouette : contour intérieur du masque
for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) { const i = y * W + x; if (hard[i] && (!hard[i - 1] || !hard[i + 1] || !hard[i - W] || !hard[i + W])) ink[i] = 1; }
const thick = (src, r) => { const o = new Uint8Array(src.length); for (let y = r; y < H - r; y++) for (let x = r; x < W - r; x++) { if (!src[y * W + x]) continue; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (dx * dx + dy * dy <= r * r) o[(y + dy) * W + x + dx] = 1; } return o; };
// on retire les petits parasites de traits (composantes < 40 px), puis on épaissit d'1 px
const seen = new Uint8Array(W * H);
for (let s0 = 0; s0 < W * H; s0++) { if (!ink[s0] || seen[s0]) continue; const comp = [s0]; seen[s0] = 1; for (let k = 0; k < comp.length; k++) { const p = comp[k]; const x = p % W, y = (p / W) | 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue; const j = ny * W + nx; if (ink[j] && !seen[j]) { seen[j] = 1; comp.push(j); } } } if (comp.length < 45) for (const p of comp) ink[p] = 0; }
const inkThick = thick(ink, 1);

// ── 4. fond aux couleurs du site + autocollant ──
const rays = Array.from({ length: 18 }, (_, i) => { const a0 = (i / 18) * Math.PI * 2, a1 = a0 + Math.PI / 18; const R = 1500, cx = W / 2, cy = H * 0.42; return `<path d="M${cx} ${cy} L${cx + R * Math.cos(a0)} ${cy + R * Math.sin(a0)} L${cx + R * Math.cos(a1)} ${cy + R * Math.sin(a1)} Z" fill="#fff" fill-opacity="${i % 2 ? 0.07 : 0.0}"/>`; }).join('');
const dots = Array.from({ length: 120 }, (_, n) => { const col = n % 12, row = Math.floor(n / 12); const x = 20 + col * 26 + (row % 2) * 13, y = H - 30 - row * 22; const r = Math.max(0, 7 - row * 0.7 - col * 0.12); return r > 0.6 ? `<circle cx="${x}" cy="${y}" r="${r.toFixed(1)}" fill="#00E5FF" fill-opacity="0.55"/>` : ''; }).join('');
const bgSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><defs><radialGradient id="g" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="#6A5BFF"/><stop offset=".55" stop-color="#3D5AFE"/><stop offset="1" stop-color="#1A1F7A"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#g)"/>${rays}<circle cx="${W / 2}" cy="${H * 0.4}" r="${W * 0.36}" fill="#FFB800" fill-opacity="0.92"/><circle cx="${W / 2}" cy="${H * 0.4}" r="${W * 0.36}" fill="none" stroke="#0b1030" stroke-width="6"/><circle cx="${W / 2}" cy="${H * 0.4}" r="${W * 0.43}" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-dasharray="3 14" stroke-linecap="round"/>${dots}</svg>`;
const bg = await sharp(Buffer.from(bgSvg)).png().toBuffer();

const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  const a = maskBig[i];
  if (a === 0) continue;
  const c = pop[lab[i]] ?? [0, 0, 0];
  const col = inkThick[i] ? [11, 16, 48] : c;
  rgba[i * 4] = col[0]; rgba[i * 4 + 1] = col[1]; rgba[i * 4 + 2] = col[2]; rgba[i * 4 + 3] = a;
}
const subject = await sharp(rgba, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
// bordure « autocollant » : silhouette dilatée (blanc) puis filet d'encre
const dil = (r) => { const o = Buffer.alloc(W * H * 4); const t = thick(hard, r); for (let i = 0; i < W * H; i++) if (t[i]) { o[i * 4] = 255; o[i * 4 + 1] = 255; o[i * 4 + 2] = 255; o[i * 4 + 3] = 255; } return o; };
const sticker = await sharp(dil(11), { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
const stickerInk = await sharp(Buffer.from(dil(14).map((v, i) => (i % 4 === 3 ? v : 11 + (i % 4) * 0))), { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
await sharp(bg).composite([{ input: stickerInk }, { input: sticker }, { input: subject }]).png({ compressionLevel: 9 }).toFile(OUT);
console.log(`[cartoon] ${K} aplats → ${OUT}`);
