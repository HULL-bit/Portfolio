import { curriculum, pick, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';

const SPAN: Record<number, string> = {
  3: 'lg:col-span-3', 4: 'lg:col-span-4', 5: 'lg:col-span-5', 6: 'lg:col-span-6', 7: 'lg:col-span-7',
  8: 'lg:col-span-8', 9: 'lg:col-span-9', 12: 'lg:col-span-12',
};

/** Cursus : enseignements suivis, par domaine (fondamentaux, programmation, réseaux, bases de données, sécurité). */
export function Curriculum({ lang }: { lang: Lang }) {
  return (
    <div className="curriculum" id="cursus" aria-labelledby="cursus-title">
      <header className="curriculum-head">
        <span className="eyebrow" data-eyebrow>{t(lang, 'journey.curriculumEyebrow')}</span>
        <h3 id="cursus-title" className="curriculum-title">{t(lang, 'journey.curriculum')}</h3>
        <p className="prose">{t(lang, 'journey.curriculumIntro')}</p>
      </header>
      <div className="grid12">
        {curriculum.domains.map((d, i) => (
          <section key={d.id} className={`glass cur-card col-span-12 md:col-span-6 ${SPAN[d.span] ?? 'lg:col-span-4'}`} aria-label={pick(d.name, lang)}>
            <span className="card-label">{String(i + 1).padStart(2, '0')} / {String(curriculum.domains.length).padStart(2, '0')}</span>
            <h4 className="cur-title">{pick(d.name, lang)}</h4>
            <p className="muted cur-blurb">{pick(d.blurb, lang)}</p>
            {d.groups.map((g, gi) => (
              <div key={gi} className="cur-group">
                {g.label ? <p className="cur-label">{pick(g.label, lang)}</p> : null}
                <ul className="chips">
                  {g.items.map((it) => <li key={it.fr} className="chip">{pick(it, lang)}</li>)}
                  {g.more ? <li className="chip chip-more">{t(lang, 'journey.andMore')}</li> : null}
                </ul>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
