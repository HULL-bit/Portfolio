// Garde-fou « 100 % statique » — lancé en postbuild.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const errors = [];
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const walk = (dir, out = []) => {
  if (!existsSync(dir)) return out;
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    statSync(p).isDirectory() ? walk(p, out) : out.push(p);
  }
  return out;
};

// 1. Motifs interdits dans le code source
const FORBIDDEN = ["'use server'", '"use server"', 'cookies(', 'headers(', 'force-dynamic', 'getServerSideProps'];
for (const f of walk('src').filter((f) => /\.(tsx?|mjs|js)$/.test(f))) {
  const src = readFileSync(f, 'utf8');
  for (const pat of FORBIDDEN) if (src.includes(pat)) errors.push(`${f} : motif interdit ${pat}`);
}
if (existsSync('src/app/api')) errors.push('src/app/api ne doit pas exister');
for (const m of ['middleware.ts', 'src/middleware.ts', 'middleware.js', 'src/middleware.js'])
  if (existsSync(m)) errors.push(`${m} ne doit pas exister`);

// 2. Pages attendues
const must = ['index.html', 'fr/index.html', 'en/index.html', '404.html'];
if (existsSync('content/projects.json')) {
  const projects = JSON.parse(readFileSync('content/projects.json', 'utf8'));
  for (const p of projects)
    for (const l of ['fr', 'en']) {
      must.push(`${l}/projets/${p.slug}/index.html`);
    }
  if (projects.length) for (const l of ['fr', 'en']) must.push(`${l}/cv/index.html`);
}
for (const m of must) if (!existsSync(join('out', m))) errors.push(`out/${m} manquant`);

// 3. Chemins absolus sans basePath dans le HTML (href/src/content="/…")
if (basePath) {
  const re = /(?:href|src|content)="(\/[^"/][^"]*)"/g;
  for (const f of walk('out').filter((f) => extname(f) === '.html')) {
    const html = readFileSync(f, 'utf8');
    for (const [, url] of html.matchAll(re))
      if (!url.startsWith(basePath + '/') && url !== basePath) errors.push(`${f} : chemin sans basePath ${url}`);
  }
}

if (errors.length) {
  console.error('\n✖ check-static a échoué :\n' + errors.map((e) => '  - ' + e).join('\n'));
  process.exit(1);
}
console.log('✔ check-static : site 100 % statique');
