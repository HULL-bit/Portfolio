import { certifications, pick, t, testimonials } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';

/** Recommandations et certifications : rendues uniquement si les fichiers JSON ne sont pas vides. */
export function Testimonials({ lang }: { lang: Lang }) {
  if (!testimonials.length) return null;
  return (
    <section id="testimonials" className="section" aria-labelledby="testimonials-title">
      <div className="wrap">
        <SectionHead id="testimonials-title" long eyebrow={t(lang, 'sections.testimonials.eyebrow')} title={t(lang, 'sections.testimonials.title')} />
        <div className="grid12">
          {testimonials.map((x) => (
            <figure key={x.author} className="glass col-span-12 lg:col-span-6">
              <blockquote className="prose" style={{ margin: 0 }}>{pick(x.quote, lang)}</blockquote>
              <figcaption className="muted mt-4">{x.author} — {pick(x.role, lang)}, {x.company}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Certifications({ lang }: { lang: Lang }) {
  if (!certifications.length) return null;
  return (
    <section id="certifications" className="section" aria-labelledby="certifications-title">
      <div className="wrap">
        <SectionHead id="certifications-title" long eyebrow={t(lang, 'sections.certifications.eyebrow')} title={t(lang, 'sections.certifications.title')} />
        <ul className="grid12">
          {certifications.map((c) => (
            <li key={c.name} className="glass col-span-12 md:col-span-6 lg:col-span-4">
              <p className="display" style={{ fontSize: '1.5rem', lineHeight: 1.1 }}>{c.name}</p>
              <p className="muted mt-2">{c.issuer} · {c.year}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
