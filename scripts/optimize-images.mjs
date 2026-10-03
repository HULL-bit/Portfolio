// Génère les déclinaisons AVIF / WebP / JPEG (plusieurs tailles) :
//   profil/profil.jpeg (+ profil-detoure.png)  → public/images/profil/
//   content-images/<slug>/*                    → public/images/projects/<slug>/
// Les fichiers déjà à jour (mtime) sont ignorés.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const WIDTHS = [480, 800, 1200];
const upToDate = (src, out) => existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs;

async function derive(src, outDir, name) {
  mkdirSync(outDir, { recursive: true });
  const meta = await sharp(src).metadata();
  let n = 0;
  for (const w of WIDTHS.filter((w) => w <= (meta.width ?? w) || w === WIDTHS[0])) {
    for (const [fmt, opts] of [['avif', { quality: 55, effort: 4 }], ['webp', { quality: 78 }], ['jpg', { quality: 82, mozjpeg: true }]]) {
      const out = join(outDir, `${name}-${w}.${fmt}`);
      if (upToDate(src, out)) continue;
      const img = sharp(src).resize({ width: w, withoutEnlargement: true }).rotate();
      await (fmt === 'avif' ? img.avif(opts) : fmt === 'webp' ? img.webp(opts) : img.jpeg(opts)).toFile(out);
      n++;
    }
  }
  return n;
}

let total = 0;
if (existsSync('profil/profil.jpeg')) total += await derive('profil/profil.jpeg', 'public/images/profil', 'profil');
// Détourage : PNG transparent → WebP/AVIF transparents (pas de JPEG).
if (existsSync('profil/profil-detoure.png')) {
  const src = 'profil/profil-detoure.png';
  for (const w of WIDTHS) for (const fmt of ['avif', 'webp']) {
    const out = `public/images/profil/profil-detoure-${w}.${fmt}`;
    if (upToDate(src, out)) continue;
    const img = sharp(src).resize({ width: w, withoutEnlargement: true });
    await (fmt === 'avif' ? img.avif({ quality: 60 }) : img.webp({ quality: 80 })).toFile(out);
    total++;
  }
}
if (existsSync('content-images')) {
  for (const slug of readdirSync('content-images')) {
    const dir = join('content-images', slug);
    if (!statSync(dir).isDirectory()) continue;
    for (const f of readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)))
      total += await derive(join(dir, f), join('public/images/projects', slug), basename(f, extname(f)));
  }
}
console.log(`[images] ${total} fichier(s) généré(s)`);
