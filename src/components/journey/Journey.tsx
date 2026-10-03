import { education, pick, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { period } from '@/lib/format';

export function Journey({ lang }: { lang: Lang }) {
  return (
    <section id="journey" className="section" aria-labelledby="journey-title">
      <div className="wrap">
        <SectionHead id="journey-title" eyebrow={t(lang, 'sections.journey.eyebrow')} title={t(lang, 'sections.journey.title')} />
        <ol className="timeline" style={{ maxWidth: '52rem' }}>
          {education.map((e) => (
            <li key={e.id} className="step glass">
              <p className="eyebrow">{period(e.start, e.end, t(lang, 'journey.now'))}</p>
              <h3 className="mt-3">{pick(e.level, lang)}</h3>
              <p className="mt-2">{pick(e.school, lang)} <span className="muted">· {e.place}</span></p>
              {e.note ? <p className="muted mt-1">{pick(e.note, lang)}</p> : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
