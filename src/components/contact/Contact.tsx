import { withBase } from '@/lib/base';
import { pick, profile, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';

export function Contact({ lang }: { lang: Lang }) {
  const c = profile.contact;
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead id="contact-title" long eyebrow={t(lang, 'sections.contact.eyebrow')} title={t(lang, 'sections.contact.title')} />
        <p className="badge"><span className="dot" aria-hidden="true" />{t(lang, 'contact.availability')}</p>
        <p className="muted mt-4">{pick(profile.availability.responseTime, lang)}</p>
        <div className="contact-links">
          <a className="btn btn-gold" href={`mailto:${c.email}`} data-track="email-click">{c.email}</a>
          <a className="btn btn-line" href={c.whatsapp} rel="noopener" data-track="whatsapp-click">WhatsApp</a>
          <a className="btn btn-line" href={c.linkedin} rel="noopener" data-track="linkedin-click">LinkedIn</a>
          <a className="btn btn-line" href={c.github} rel="noopener" data-track="github-click">GitHub</a>
          <a className="btn btn-line" href={withBase(profile.cv.fr)} download data-track="cv-download">{t(lang, 'contact.cvFr')}</a>
          <a className="btn btn-line" href={withBase(profile.cv.en)} download data-track="cv-download">{t(lang, 'contact.cvEn')}</a>
        </div>
        <p className="muted mono mt-6" style={{ fontSize: '0.85rem' }}>{c.phone}</p>
      </div>
    </section>
  );
}
