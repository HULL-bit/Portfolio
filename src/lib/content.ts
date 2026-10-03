import profileJson from '@content/profile.json';
import educationJson from '@content/education.json';
import experienceJson from '@content/experience.json';
import skillsJson from '@content/skills.json';
import projectsJson from '@content/projects.json';
import testimonialsJson from '@content/testimonials.json';
import certificationsJson from '@content/certifications.json';
import githubJson from '@content/github.json';
import terminalJson from '@content/terminal.json';
import imagesManifestJson from '@content/images-manifest.json';
import fr from '@content/i18n/fr.json';
import en from '@content/i18n/en.json';
import type { Lang } from './i18n';
import {
  certificationsSchema,
  educationSchema,
  experienceSchema,
  githubSchema,
  imagesManifestSchema,
  profileSchema,
  projectsSchema,
  skillsSchema,
  terminalSchema,
  testimonialsSchema,
  treeSchema,
  type LText,
  type Tree,
} from './schemas';

// Tout est validé au chargement : une erreur de contenu casse le build.
export const profile = profileSchema.parse(profileJson);
export const education = educationSchema.parse(educationJson);
export const experience = experienceSchema.parse(experienceJson);
export const skills = skillsSchema.parse(skillsJson);
export const projects = projectsSchema.parse(projectsJson).sort((a, b) => a.order - b.order);
export const testimonials = testimonialsSchema.parse(testimonialsJson);
export const certifications = certificationsSchema.parse(certificationsJson);
export const github = githubSchema.parse(githubJson);
export const terminal = terminalSchema.parse(terminalJson);
export const imagesManifest = imagesManifestSchema.parse(imagesManifestJson);

/** Métadonnées d'une capture de projet (tailles générées), ou undefined si elle n'existe pas. */
export const getShot = (slug: string, name: string) => imagesManifest[slug]?.[name];

const dictionaries: Record<Lang, Tree> = { fr: treeSchema.parse(fr), en: treeSchema.parse(en) };

const leafPaths = (t: Tree, prefix = ''): string[] =>
  Object.entries(t).flatMap(([k, v]) =>
    typeof v === 'object' && !Array.isArray(v) ? leafPaths(v, `${prefix}${k}.`) : [`${prefix}${k}`],
  );

// Parité FR/EN : aucune clé ne doit manquer d'un côté.
{
  const a = new Set(leafPaths(dictionaries.fr));
  const b = new Set(leafPaths(dictionaries.en));
  const missing = [...a].filter((k) => !b.has(k)).map((k) => `en: ${k}`).concat([...b].filter((k) => !a.has(k)).map((k) => `fr: ${k}`));
  if (missing.length) throw new Error(`i18n : clés manquantes\n  ${missing.join('\n  ')}`);
}

/** Traduction d'une clé pointée, ex. `t('fr', 'hero.ctaCv')`. */
export function t(lang: Lang, path: string): string {
  const v = get(lang, path);
  if (typeof v !== 'string') throw new Error(`i18n : « ${path} » n'est pas une chaîne`);
  return v;
}
export function tList(lang: Lang, path: string): string[] {
  const v = get(lang, path);
  if (!Array.isArray(v)) throw new Error(`i18n : « ${path} » n'est pas une liste`);
  return v;
}
function get(lang: Lang, path: string) {
  let node: Tree[string] = dictionaries[lang];
  for (const key of path.split('.')) {
    if (typeof node !== 'object' || Array.isArray(node) || !(key in node)) throw new Error(`i18n : clé absente « ${path} » (${lang})`);
    node = node[key] as Tree[string];
  }
  return node;
}

/** Choisit la langue d'un champ `{fr, en}`. */
export const pick = (text: LText, lang: Lang): string => text[lang];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

/** Liste des TODO restants (profil, expériences, projets). */
export function collectTodos(): string[] {
  return [
    ...profile.todo.map((x) => `Profil : ${x}`),
    ...experience.flatMap((e) => e.todo.map((x) => `Expérience ${e.id} : ${x}`)),
    ...(skills.levelsTodo ? ['Compétences : niveaux (1-5) indicatifs à confirmer'] : []),
    ...projects.flatMap((p) => p.todo.map((x) => `Projet ${p.slug} : ${x}`)),
  ];
}
