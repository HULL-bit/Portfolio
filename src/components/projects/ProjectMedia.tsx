import { pick, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import type { Project } from '@/lib/schemas';
import { BrowserFrame } from './BrowserFrame';
import { LiquidVisual } from './LiquidVisual';
import { ProjectShot } from './ProjectShot';

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
    return (
      <BrowserFrame url={project.demo} hint={t(lang, 'projects.hint')}>
        <ProjectShot slug={project.slug} name={project.images[0]!} alt={alt} sizes={sizes} eager={eager} />
      </BrowserFrame>
    );
  }
  return <LiquidVisual project={project} title={title} tag={t(lang, 'projects.schematic')} />;
}
