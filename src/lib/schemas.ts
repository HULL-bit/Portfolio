import { z } from 'zod';

/** Texte bilingue. */
export const L = z.object({ fr: z.string().min(1), en: z.string().min(1) });
export type LText = z.infer<typeof L>;

export const profileSchema = z.object({
  name: z.string(),
  title: L,
  stackLine: z.string(),
  location: z.object({ city: z.string(), country: z.string(), timezone: z.string(), mobility: z.boolean() }),
  roles: z.array(L).min(1),
  tagline: L,
  availability: z.object({ open: z.boolean(), types: z.array(L).min(1), responseTime: L }),
  current: z.object({ role: L, org: z.string(), url: z.url(), since: z.number().int(), study: L }),
  keyFigures: z.array(
    z.object({
      id: z.enum(['projects', 'users', 'years', 'tech']),
      value: z.number(),
      suffix: z.string(),
      hero: z.boolean(),
      todo: z.boolean(),
    }),
  ),
  trustedBy: z.array(z.object({ name: z.string(), url: z.url().optional() })),
  languages: z.array(z.object({ name: L, level: L, value: z.number().min(0).max(1) })),
  contact: z.object({
    email: z.email(),
    phone: z.string(),
    whatsapp: z.url(),
    github: z.url(),
    linkedin: z.url(),
  }),
  cv: z.object({ fr: z.string().startsWith('/'), en: z.string().startsWith('/') }),
  photo: z.object({ src: z.string(), cutout: z.string() }),
  todo: z.array(z.string()),
});

export const educationSchema = z.array(
  z.object({
    id: z.string(),
    start: z.number().int(),
    end: z.number().int().nullable(),
    level: L,
    school: L,
    place: z.string(),
    note: L.nullable(),
  }),
);

export const experienceSchema = z.array(
  z.object({
    id: z.string(),
    service: z.string(),
    role: L,
    org: z.string(),
    url: z.url().optional(),
    place: z.string(),
    start: z.number().int(),
    end: z.number().int().nullable(),
    missions: z.array(L).min(1),
    stack: z.array(z.string()),
    todo: z.array(z.string()).default([]),
  }),
);

export const skillsSchema = z.object({
  levelsTodo: z.boolean(),
  domains: z
    .array(
      z.object({
        id: z.enum(['systems', 'databases', 'fullstack', 'mobile', 'modeling']),
        primary: z.boolean(),
        name: L,
        blurb: L,
        items: z.array(z.object({ name: z.string(), level: z.number().int().min(1).max(5) })).min(1),
      }),
    )
    .length(5),
  marquee: z.array(z.string()).min(1),
});

export const curriculumSchema = z.object({
  todo: z.array(z.string()).default([]),
  /** Phrase courte pour la vue express (CV). */
  cvLine: L,
  domains: z
    .array(
      z.object({
        id: z.string(),
        /** Largeur de la carte sur la grille de 12 colonnes (écrans larges). */
        span: z.number().int().min(3).max(12).default(4),
        name: L,
        blurb: L,
        groups: z
          .array(z.object({ label: L.nullable().default(null), items: z.array(L).min(1), /** Ajoute la pastille « et d'autres… » en fin de groupe. */ more: z.boolean().default(false) }))
          .min(1),
      }),
    )
    .min(1),
});

export const CATEGORIES = ['web', 'mobile', 'systeme', 'bdd', 'ia'] as const;
export type Category = (typeof CATEGORIES)[number];

export const STATUSES = ['live', 'delivered', 'in-progress', 'prototype'] as const;
export type Status = (typeof STATUSES)[number];

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  order: z.number().int(),
  /** Projet mis en avant : grande ligne éditoriale dans la section Projets (les autres : cartes compactes). */
  featured: z.boolean().default(false),
  title: L,
  client: z.string().default(''),
  location: z.string().default(''),
  year: z.number().int().nullable(),
  categories: z.array(z.enum(CATEGORIES)).min(1),
  role: L,
  status: z.enum(STATUSES),
  statusNote: L.nullable().default(null),
  summary: L,
  context: L,
  mission: L,
  actions: z.array(L),
  features: z.array(L),
  /** Réalisation technique : points détaillés (titre + texte). */
  technical: z.array(z.object({ title: L, text: L })),
  architecture: z.object({
    nodes: z.array(
      z.object({ id: z.string(), label: z.string(), kind: z.enum(['front', 'proxy', 'api', 'db', 'host', 'ext']) }),
    ),
    links: z.array(z.object({ from: z.string(), to: z.string() })),
  }),
  stack: z.array(z.string()),
  results: z.array(z.object({ value: z.string(), label: L })).max(3),
  /** Noms des captures dans content-images/<slug>/ (déclinées dans public/images/projects/<slug>/). */
  images: z.array(z.string()),
  imageKind: z.enum(['web', 'mobile', 'diagram']).default('web'),
  repo: z.url().nullable(),
  repoLabel: L.nullable().default(null),
  demo: z.url().nullable(),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  todo: z.array(z.string()).default([]),
});
export type Project = z.infer<typeof projectSchema>;

export const projectsSchema = z
  .array(projectSchema)
  .superRefine((projects, ctx) => {
    const slugs = new Set<string>();
    projects.forEach((p, i) => {
      if (slugs.has(p.slug)) ctx.addIssue({ code: 'custom', message: `slug dupliqué : ${p.slug}`, path: [i, 'slug'] });
      slugs.add(p.slug);
      const ids = new Set(p.architecture.nodes.map((n) => n.id));
      p.architecture.links.forEach((l, j) => {
        if (!ids.has(l.from) || !ids.has(l.to))
          ctx.addIssue({ code: 'custom', message: `lien d'architecture orphelin (${p.slug})`, path: [i, 'architecture', 'links', j] });
      });
    });
  });

/** Manifeste des images de projets, généré par scripts/optimize-images.mjs. */
export const imagesManifestSchema = z.record(
  z.string(),
  z.record(z.string(), z.object({ width: z.number().int(), height: z.number().int(), widths: z.array(z.number().int()).min(1) })),
);

export const testimonialsSchema = z.array(
  z.object({ author: z.string(), role: L, company: z.string(), quote: L, url: z.url().optional() }),
);
export const certificationsSchema = z.array(
  z.object({ name: z.string(), issuer: z.string(), year: z.number().int(), url: z.url().optional() }),
);

export const githubSchema = z.object({
  fetchedAt: z.string().nullable(),
  user: z.string(),
  publicRepos: z.number().int(),
  stars: z.number().int(),
  languages: z.array(z.object({ name: z.string(), bytes: z.number(), percent: z.number() })),
  repos: z.array(
    z.object({
      name: z.string(),
      url: z.url(),
      description: z.string().nullable(),
      homepage: z.string().nullable().optional(),
      language: z.string().nullable(),
      stars: z.number().int(),
      pushedAt: z.string(),
    }),
  ),
  /** Nombre d'événements publics par jour (UTC), ~90 derniers jours. */
  activity: z.record(z.string(), z.number().int()),
});

export const terminalSchema = z.object({
  prompt: z.string(),
  welcome: z.object({ fr: z.array(z.string()), en: z.array(z.string()) }),
  commands: z.array(z.object({ name: z.string(), usage: z.string(), description: L })),
  responses: z.record(z.string(), z.unknown()),
});

export type Tree = { [k: string]: string | string[] | Tree };
export const treeSchema: z.ZodType<Tree> = z.lazy(() =>
  z.record(z.string(), z.union([z.string(), z.array(z.string()), treeSchema])),
);
