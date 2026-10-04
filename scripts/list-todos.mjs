// Liste tous les « TODO: confirmer » restants (champs `todo` des contenus) en Markdown.
// Usage : npm run todos   — le résultat est reporté en fin de README.md
import { readFileSync } from 'node:fs';

const read = (f) => JSON.parse(readFileSync(f, 'utf8'));
const out = [];
const section = (title, items) => { if (items.length) out.push(`### ${title}`, ...items.map((i) => `- [ ] ${i}`), ''); };

const profile = read('content/profile.json');
section('Profil', profile.todo);
section('Cursus', read('content/curriculum.json').todo);
const skills = read('content/skills.json');
section('Compétences', skills.levelsTodo ? ["Niveaux (1 à 5) des barres de LED : indicatifs, à confirmer"] : []);
section('Expérience', read('content/experience.json').flatMap((e) => (e.todo ?? []).map((t) => `${e.org} : ${t}`)));
for (const p of read('content/projects.json')) section(`Projet « ${p.title.fr} »`, p.todo ?? []);
console.log(out.join('\n'));
