import { getShot, pick, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import type { Project } from '@/lib/schemas';
import { BrowserFrame } from './BrowserFrame';
import { LiquidVisual } from './LiquidVisual';
import { ProjectShot, shotHref } from './ProjectShot';

/**
 * Visuel d'un projet : vraie capture dans une maquette navigateur (sites en ligne), captures d'application (mobile),
 * ou, à défaut, interface filaire générée (SVG procédural) avec distorsion liquide au survol.
 */
export function ProjectMedia({ project, lang, sizes, eager = false }: { project: Project; lang: Lang; sizes: string; eager?: boolean }) {
  const title = pick(project.title, lang);
  const alt = t(lang, 'projects.shotAlt').replace('{title}', title);
  if (project.images.length) {
    if (project.imageKind === 'mobile') {
      return (
        <div className="appshots">
          {project.images.map((name, i) => (
            <ProjectShot key={name} slug={project.slug} name={name} alt={`${alt} (${i + 1}/${project.images.length})`} sizes={sizes} eager={eager && i === 0} />
          ))}
        </div>
      );
    }
    if (project.imageKind === 'diagram') {
      const name = project.images[0]!;
      const href = shotHref(project.slug, name);
      const img = <ProjectShot slug={project.slug} name={name} alt={t(lang, 'projects.diagramCaption')} sizes={sizes} eager={eager} />;
      return (
        <figure className="diagram">
          {href ? <a href={href} target="_blank" rel="noopener" className="diagram-link" aria-label={t(lang, 'projects.openFull')} data-cursor="view">{img}</a> : img}
          <figcaption>{t(lang, 'projects.diagramCaption')}</figcaption>
        </figure>
      );
    }
    return <WebShot project={project} name={project.images[0]!} alt={alt} sizes={sizes} eager={eager} hint={t(lang, 'projects.hint')} />;
  }
  return <LiquidVisual project={project} title={title} tag={t(lang, 'projects.schematic')} />;
}

/** Capture web dans un cadre navigateur : une capture d'un seul écran garde son format ; une page longue défile au survol. */
export function WebShot({ project, name, alt, sizes, eager = false, hint }: { project: Project; name: string; alt: string; sizes: string; eager?: boolean; hint?: string }) {
  const m = getShot(project.slug, name);
  const r = m ? m.width / m.height : 0;
  return (
    <BrowserFrame url={project.demo} hint={hint} ratio={r >= 1.6 ? r : undefined}>
      <ProjectShot slug={project.slug} name={name} alt={alt} sizes={sizes} eager={eager} />
    </BrowserFrame>
  );
}

/** Captures supplémentaires d'un projet (page projet) : une grille de cadres navigateur. */
export function ProjectGallery({ project, lang }: { project: Project; lang: Lang }) {
  const rest = project.images.slice(1);
  if (project.imageKind !== 'web' || !rest.length) return null;
  const title = pick(project.title, lang);
  return (
    <ul className="gallery">
      {rest.map((name) => (
        <li key={name}><WebShot project={project} name={name} alt={t(lang, 'projects.shotAlt').replace('{title}', title)} sizes="(min-width: 960px) 46vw, 92vw" /></li>
      ))}
    </ul>
  );
}
