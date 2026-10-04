// Génère les déclinaisons AVIF / WebP / JPEG (plusieurs tailles) :
//   profil/profil.jpeg (+ profil-detoure.png)  → public/images/profil/
//   content-images/<slug>/*                    → public/images/projects/<slug>/
// Les fichiers déjà à jour (mtime) sont ignorés.
import sharp from 'sharp';
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
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
if (existsSync('profil/hero-cartoon.png')) total += await derive('profil/hero-cartoon.png', 'public/images/profil', 'hero-cartoon'); // portrait illustré du Hero (scripts/cartoonize-portrait.mjs)
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
// Captures de projets : content-images/<slug>/<nom>.{jpg,png,webp} → public/images/projects/<slug>/<nom>-<largeur>.{avif,webp,jpg}
// + manifeste content/images-manifest.json (largeurs générées, dimensions) lu par le site au build.
const manifest = {};
if (existsSync('content-images')) {
  for (const slug of readdirSync('content-images')) {
    const dir = join('content-images', slug);
    if (slug.startsWith('_') || !statSync(dir).isDirectory()) continue; // « _source » : originaux non publiés
    for (const f of readdirSync(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()) {
      const src = join(dir, f);
      const name = basename(f, extname(f));
      const meta = await sharp(src).metadata();
      // les diagrammes (uml*, diagram*) gardent une résolution plus élevée pour rester lisibles au zoom
      const maxW = /^(uml|diagram)/i.test(name) ? 2400 : 1200;
      const widths = [...new Set([...WIDTHS, 1200, 2400].filter((w) => w < (meta.width ?? 0) && w <= maxW).concat(Math.min(meta.width ?? 1200, maxW)))].sort((a, b) => a - b);
      const outDir = join('public/images/projects', slug);
      mkdirSync(outDir, { recursive: true });
      for (const w of widths) {
        for (const [fmt, opts] of [['avif', { quality: 52, effort: 4 }], ['webp', { quality: 76 }], ['jpg', { quality: 80, mozjpeg: true }]]) {
          const out = join(outDir, `${name}-${w}.${fmt}`);
          if (upToDate(src, out)) continue;
          const img = sharp(src).resize({ width: w, withoutEnlargement: true }).flatten({ background: '#05060a' });
          await (fmt === 'avif' ? img.avif(opts) : fmt === 'webp' ? img.webp(opts) : img.jpeg(opts)).toFile(out);
          total++;
        }
      }
      (manifest[slug] ??= {})[name] = { width: meta.width, height: meta.height, widths };
    }
  }
}
writeFileSync('content/images-manifest.json', JSON.stringify(manifest, null, 2) + '\n');
console.log(`[images] ${total} fichier(s) généré(s)`);
