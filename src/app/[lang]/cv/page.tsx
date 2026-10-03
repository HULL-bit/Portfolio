import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { education, experience, pick, profile, projects, skills, t, tList } from '@/lib/content';
import { withBase } from '@/lib/base';
import { localePath, pageMeta } from '@/lib/site';
import { period } from '@/lib/format';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return pageMeta({ lang, path: 'cv/', og: 'cv', title: t(lang, 'meta.cvTitle'), description: t(lang, 'meta.cvDescription'), siteName: t(lang, 'meta.siteName') });
}

/** Vue express : HTML pur, sans animation, texte sélectionnable (ATS), imprimable en A4. */
export default async function CvPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = profile.contact;
  const L = (k: string) => t(lang, `cvPage.${k}`);
  const shown = projects.filter((p) => !p.draft);
  return (
    <div className="cv-page">
      <main id="main" className="cv">
        <div className="cv-actions no-print">
          <Link href={localePath(lang)}>← {L('back')}</Link>
          <a href={withBase(profile.cv[lang])} download data-track="cv-download">{L('download')}</a>
        </div>
        <header className="cv-head">
          <h1>{profile.name}</h1>
          <p className="cv-title">{pick(profile.title, lang)} — {profile.stackLine}</p>
          <p className="cv-avail">● {t(lang, 'hero.available')} — {profile.availability.types.map((x) => pick(x, lang)).join(' · ')}</p>
          <p className="cv-contact">
            <a href={`mailto:${c.email}`}>{c.email}</a> · <a href={c.whatsapp}>{c.phone}</a> · <a href={c.linkedin}>LinkedIn</a> · <a href={c.github}>GitHub</a> · {profile.location.city}, {profile.location.country}
          </p>
        </header>

        <section>
          <h2>{L('profile')}</h2>
          <p>{pick(profile.tagline, lang)} {tList(lang, 'about.paragraphs')[1]}</p>
        </section>

        <section>
          <h2>{L('experience')}</h2>
          {experience.map((e) => (
            <div key={e.id} className="cv-item">
              <p className="cv-row"><strong>{pick(e.role, lang)} — {e.org}</strong><span>{period(e.start, e.end, t(lang, 'experience.present'))}</span></p>
              <ul>{e.missions.map((m) => <li key={m.fr}>{pick(m, lang)}</li>)}</ul>
            </div>
          ))}
        </section>

        <section>
          <h2>{L('projects')}</h2>
          {shown.map((p) => (
            <div key={p.slug} className="cv-item">
              <p className="cv-row"><strong>{pick(p.title, lang)}</strong><span>{p.stack.join(' · ')}</span></p>
              <p>{pick(p.summary, lang)}{p.results.length ? ` ${p.results.map((r) => `${r.value} ${pick(r.label, lang)}`).join(' ; ')}.` : ''}</p>
            </div>
          ))}
        </section>

        <div className="cv-cols">
          <section>
            <h2>{L('education')}</h2>
            {[...education].reverse().map((e) => (
              <p key={e.id} className="cv-edu"><strong>{pick(e.level, lang)}</strong> — {pick(e.school, lang)} <span>({period(e.start, e.end, t(lang, 'journey.now'))})</span></p>
            ))}
          </section>
          <section>
            <h2>{L('skills')}</h2>
            {skills.domains.map((d) => (
              <p key={d.id} className="cv-skill"><strong>{pick(d.name, lang)} :</strong> {d.items.map((i) => i.name).join(', ')}</p>
            ))}
            <h2 style={{ marginTop: '0.9rem' }}>{L('languages')}</h2>
            <p>{profile.languages.map((l) => `${pick(l.name, lang)} (${pick(l.level, lang)})`).join(' · ')}</p>
          </section>
        </div>
      </main>
    </div>
  );
}
