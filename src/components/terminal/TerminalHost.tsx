import { pick, profile, projects, skills, t, terminal } from '@/lib/content';
import { withBase } from '@/lib/base';
import { localePath } from '@/lib/site';
import type { Lang } from '@/lib/i18n';
import type { TerminalData } from './Terminal';
import { TerminalLazy } from './TerminalLazy';

type L = { fr: string | string[]; en: string | string[] };
const r = (key: string, lang: Lang) => (terminal.responses[key] as L)[lang];

/** Prépare les données sérialisables du terminal (réponses de content/terminal.json + contenus du site). */
export function TerminalHost({ lang }: { lang: Lang }) {
  const c = profile.contact;
  const data: TerminalData = {
    lang,
    prompt: terminal.prompt,
    welcome: terminal.welcome[lang],
    commands: terminal.commands.map((x) => ({ name: x.name, usage: x.usage, description: pick(x.description, lang) })),
    projects: projects.map((p) => ({ slug: p.slug, title: pick(p.title, lang), href: localePath(lang, `projets/${p.slug}/`) })),
    skills: skills.domains.filter((d) => d.primary).map((d) => ({ name: pick(d.name, lang), items: d.items })),
    whoami: r('whoami', lang) as string[],
    uname: r('uname', lang) as string[],
    neofetchLogo: (terminal.responses.neofetchLogo as string[]),
    neofetchInfo: r('neofetchInfo', lang) as string[],
    cv: {
      href: withBase(profile.cv[lang]),
      lines: [`${profile.name} — ${pick(profile.title, lang)}`, profile.stackLine, `${t(lang, 'hero.available')} — ${profile.availability.types.map((x) => pick(x, lang)).join(' · ')}`, t(lang, 'hero.credibility')],
    },
    contact: [
      { label: 'email', value: c.email, href: `mailto:${c.email}` },
      { label: 'whatsapp', value: c.phone, href: c.whatsapp },
      { label: 'linkedin', value: c.linkedin, href: c.linkedin },
      { label: 'github', value: c.github, href: c.github },
    ],
    msg: {
      sudoPassword: r('sudoPassword', lang) as string, sudoGranted: r('sudoGranted', lang) as string, notFound: r('notFound', lang) as string,
      unknownProject: r('unknownProject', lang) as string, usageLang: r('usageLang', lang) as string, opening: r('opening', lang) as string,
      themeToggled: r('themeToggled', lang) as string, langTo: r('langTo', lang) as string, download: r('download', lang) as string,
    },
    home: localePath(lang),
    nextLang: { fr: 'en', en: 'fr' },
    labels: { title: r('terminalTitle', lang) as string, close: r('close', lang) as string },
  };
  return <TerminalLazy data={data} />;
}
