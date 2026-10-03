import { skills, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';

/** Version statique (l'animation en bandeaux infinis arrive à l'étape 5). */
export function TechCloud({ lang }: { lang: Lang }) {
  return (
    <section id="stack" className="section" aria-labelledby="stack-title">
      <div className="wrap">
        <SectionHead id="stack-title" eyebrow={t(lang, 'sections.stack.eyebrow')} title={t(lang, 'sections.stack.title')} />
        <ul className="tech-cloud">
          {skills.marquee.map((n) => <li key={n}><span>{n}</span></li>)}
        </ul>
      </div>
    </section>
  );
}
