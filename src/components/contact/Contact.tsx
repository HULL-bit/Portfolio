import { withBase } from '@/lib/base';
import { pick, profile, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';
import { ContactForm } from './ContactForm';
import { CopyEmail } from './CopyEmail';

export function Contact({ lang }: { lang: Lang }) {
  const c = profile.contact;
  const f = (k: string) => t(lang, `contact.form.${k}`);
  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead id="contact-title" long eyebrow={t(lang, 'sections.contact.eyebrow')} title={t(lang, 'sections.contact.title')} />
        <div className="grid12 contact-grid">
          <div className="col-span-12 lg:col-span-5">
            <p className="badge"><span className="dot" aria-hidden="true" />{t(lang, 'contact.availability')}</p>
            <p className="muted mt-4">{pick(profile.availability.responseTime, lang)}</p>
            <div className="contact-links">
              <CopyEmail email={c.email} labels={{ copy: t(lang, 'contact.copyEmail'), copied: t(lang, 'contact.copied'), write: t(lang, 'contact.write') }} />
              <a className="btn btn-line" data-magnetic href={c.whatsapp} rel="noopener" data-track="whatsapp-click">WhatsApp</a>
              <a className="btn btn-line" data-magnetic href={c.linkedin} rel="noopener" data-track="linkedin-click">LinkedIn</a>
              <a className="btn btn-line" data-magnetic href={c.github} rel="noopener" data-track="github-click">GitHub</a>
              <a className="btn btn-line" data-magnetic href={withBase(profile.cv.fr)} download data-track="cv-download">{t(lang, 'contact.cvFr')}</a>
              <a className="btn btn-line" data-magnetic href={withBase(profile.cv.en)} download data-track="cv-download">{t(lang, 'contact.cvEn')}</a>
            </div>
            <p className="muted mono mt-6" style={{ fontSize: '0.85rem' }}>{c.phone}</p>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <ContactForm
              to={c.email}
              labels={{
                title: t(lang, 'contact.terminalTitle'), intro: t(lang, 'contact.formIntro'), name: f('name'), email: f('email'), message: f('message'), send: f('send'),
                sending: f('sending'), success: f('success'), error: f('error'), mailto: f('mailto'), fallback: f('fallback'), errName: f('errName'), errEmail: f('errEmail'),
                errMessage: f('errMessage'), subject: t(lang, 'contact.mailSubject'),
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
