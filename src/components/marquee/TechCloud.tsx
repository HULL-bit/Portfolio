import {
  siDart, siDebian, siDjango, siDotnet, siDocker, siFlutter, siGit, siLinux, siMysql, siNextdotjs, siNginx, siOpenjdk,
  siPostgresql, siPython, siReact, siSpring, siTypescript, siUbuntu, type SimpleIcon,
} from 'simple-icons';
import { skills, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { Marquee } from '@/components/motion/Marquee';

/** Logos monochromes (simple-icons, CC0). Oracle, SQL Server, UML… : texte seul. */
const ICONS: Record<string, SimpleIcon> = {
  Linux: siLinux, Debian: siDebian, Ubuntu: siUbuntu, PostgreSQL: siPostgresql, MySQL: siMysql, Django: siDjango, React: siReact,
  Spring: siSpring, 'Next.js': siNextdotjs, Flutter: siFlutter, Docker: siDocker, Nginx: siNginx, Git: siGit, Python: siPython,
  Java: siOpenjdk, TypeScript: siTypescript, Dart: siDart, '.NET': siDotnet,
};

function Item({ name }: { name: string }) {
  const icon = ICONS[name];
  return (
    <span className="tech-item" role="listitem">
      {icon ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d={icon.path} fill="currentColor" /></svg>
      ) : null}
      <span className="tech-name">{name}</span>
    </span>
  );
}

/** Deux bandeaux en sens opposés (animation : Marquee, côté client). */
export function TechCloud({ lang }: { lang: Lang }) {
  const names = skills.marquee;
  const half = Math.ceil(names.length / 2);
  const rows = [names.slice(0, half), names.slice(half)].map((row) => row.map((n) => <Item key={n} name={n} />));
  return (
    <section id="stack" className="section stack" aria-labelledby="stack-title">
      <div className="wrap">
        <SectionHead id="stack-title" eyebrow={t(lang, 'sections.stack.eyebrow')} title={t(lang, 'sections.stack.title')} />
      </div>
      <Marquee rows={rows} label={t(lang, 'a11y.techBand')} />
    </section>
  );
}
