import { experience, pick, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { period } from '@/lib/format';

export function Experience({ lang }: { lang: Lang }) {
  return (
    <section id="experience" className="section" aria-labelledby="experience-title">
      <div className="wrap">
        <SectionHead id="experience-title" eyebrow={t(lang, 'sections.experience.eyebrow')} title={t(lang, 'sections.experience.title')} />
        <ol className="grid gap-6">
          {experience.map((e) => (
            <li key={e.id} className="glass service">
              <p className="service-status">
                <span className="ok">●</span> <span>{e.service}.service</span> <em>— {pick(e.role, lang)} —</em>
                <span>{t(lang, 'experience.status')} {e.start}{e.end ? ` → ${e.end}` : ''}</span>
              </p>
              <h3>{pick(e.role, lang)} — {e.org}</h3>
              <p className="muted mono" style={{ fontSize: '0.85rem' }}>{e.place} · {period(e.start, e.end, t(lang, 'experience.present'))}</p>
              <dl className="dl">
                <div>
                  <dt>{t(lang, 'experience.missions')}</dt>
                  <dd><ul className="bullets">{e.missions.map((m) => <li key={m.fr}>{pick(m, lang)}</li>)}</ul></dd>
                </div>
                <div>
                  <dt>{t(lang, 'experience.stack')}</dt>
                  <dd><ul className="chips">{e.stack.map((s) => <li key={s} className="chip">{s}</li>)}</ul></dd>
                </div>
              </dl>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
