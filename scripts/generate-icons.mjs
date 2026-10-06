// Icônes d'onglet / écran d'accueil à partir de public/favicon-gold.svg (le monogramme « SD ») :
//   public/favicon.ico (32 + 48 px), icon-192.png, icon-512.png, apple-touch-icon.png (180 px, fond plein : iOS applique son propre arrondi)
// Le SVG seul n'est pas pris en charge partout (Safari, iOS, robots de recherche, requête automatique /favicon.ico).
import sharp from 'sharp';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';

const SRC = 'public/favicon-gold.svg';
const OUT = ['public/favicon.ico', 'public/icon-192.png', 'public/icon-512.png', 'public/apple-touch-icon.png'];
if (!existsSync(SRC)) { console.warn('[icons] favicon-gold.svg absent — ignoré'); process.exit(0); }
const newest = Math.max(statSync(SRC).mtimeMs, statSync(new URL(import.meta.url)).mtimeMs);
if (OUT.every((f) => existsSync(f) && statSync(f).mtimeMs >= newest)) { console.log('[icons] à jour'); process.exit(0); }

const svg = readFileSync(SRC, 'utf8');
const square = svg.replace(/rx="\d+"/, 'rx="0"');
const png = (source, size) => sharp(Buffer.from(source), { density: 512 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

// ICO : conteneur minimal, images PNG intégrées (pris en charge par tous les navigateurs actuels)
const sizes = [32, 48];
const images = await Promise.all(sizes.map((s) => png(svg, s)));
const head = Buffer.alloc(6); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = images.map((img, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(sizes[i], 0); e.writeUInt8(sizes[i], 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(img.length, 8); e.writeUInt32LE(offset, 12);
  offset += img.length;
  return e;
});
writeFileSync('public/favicon.ico', Buffer.concat([head, ...entries, ...images]));
writeFileSync('public/icon-192.png', await png(svg, 192));
writeFileSync('public/icon-512.png', await png(svg, 512));
writeFileSync('public/apple-touch-icon.png', await png(square, 180));
console.log('[icons] favicon.ico, icon-192/512.png, apple-touch-icon.png');
