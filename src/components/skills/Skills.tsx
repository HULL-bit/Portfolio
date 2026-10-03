import { pick, skills, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { Leds } from './Leds';

const SPAN: Record<string, string> = {
  systems: 'lg:col-span-6',
  databases: 'lg:col-span-6',
  fullstack: 'lg:col-span-6 lg:row-span-2',
  mobile: 'lg:col-span-6',
  modeling: 'lg:col-span-6',
};

/** Équivalent HTML de la baie de serveurs 3D (étape 8) : aussi lu par les lecteurs d'écran. */
export function Skills({ lang }: { lang: Lang }) {
  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead id="skills-title" eyebrow={t(lang, 'sections.skills.eyebrow')} title={t(lang, 'sections.skills.title')} />
        <div className="grid12" data-skills-fallback>
          {skills.domains.map((d) => (
            <article key={d.id} className={`glass skill-card col-span-12 ${SPAN[d.id] ?? 'lg:col-span-6'}`}>
              <div className="flex items-center justify-between gap-4 mb-2">
                <h3>{pick(d.name, lang)}</h3>
                {d.primary ? <span className="primary-tag">{t(lang, 'skills.primary')}</span> : null}
              </div>
              <p className="muted mb-4">{pick(d.blurb, lang)}</p>
              <ul>
                {d.items.map((i) => (
                  <li key={i.name} className="led-row"><span>{i.name}</span><Leds level={i.level} label={`${t(lang, 'skills.level')} ${i.name}`} /></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
