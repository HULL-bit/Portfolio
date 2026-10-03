import { ProjectVisual } from './ProjectVisual';
import type { Project } from '@/lib/schemas';

type Props = { project: Pick<Project, 'slug' | 'categories' | 'accent' | 'stack'>; title: string; tag?: string };

/**
 * Visuel de remplacement d'un projet (interface filaire générée) : rendu côté serveur ; la distorsion liquide au survol
 * est assurée par l'îlot <LiquidBehavior /> (repli SVG feDisplacementMap, aucun canvas supplémentaire).
 */
export function LiquidVisual({ project, title, tag }: Props) {
  const id = `liq-${project.slug}`;
  return (
    <div className="liquid" style={{ ['--accent' as string]: project.accent }}>
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute' }}>
        <filter id={id} x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.006 0.012" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <ProjectVisual className="vis" project={project} title={title} />
      {tag ? <span className="schematic-tag" aria-hidden="true">{tag}</span> : null}
    </div>
  );
}
