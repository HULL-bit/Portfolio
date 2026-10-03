import Link from 'next/link';
import { withBase } from '@/lib/base';
import { localePath } from '@/lib/site';
import { pick, profile, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { Picture } from '@/components/ui/Picture';
import { Motif } from '@/components/ui/Motif';
import { HeroLoader } from './HeroLoader';
import { HeroFx } from './HeroFx';
import { RoleCycler } from './RoleCycler';
import { HeroStatus } from './HeroStatus';

export function Hero({ lang }: { lang: Lang }) {
  const proofs = profile.keyFigures.filter((f) => f.hero);
  const types = profile.availability.types.map((x) => pick(x, lang)).join(' · ');
  return (
    <section id="hero" className="hero" aria-labelledby="hero-name">
      <Motif name="rosace" variant="circuit" className="hero-rosace" />
      <HeroLoader label={t(lang, 'a11y.canvasHero')} />
      <HeroFx name={profile.name} />
      <div className="wrap hero-grid">
        <div>
          <p className="badge"><span className="dot" aria-hidden="true" />{t(lang, 'hero.available')} — {types}</p>
          <h1 id="hero-name" className="display hero-name">{profile.name}</h1>
          <p className="hero-title">{pick(profile.title, lang)} <span>{profile.stackLine}</span></p>
          <RoleCycler roles={profile.roles.map((r) => pick(r, lang))} />
          <ul className="hero-roles">
            {profile.roles.map((r) => <li key={r.fr}>{pick(r, lang)}</li>)}
          </ul>
          <p className="hero-tagline">{pick(profile.tagline, lang)}</p>
          <p className="hero-cred">{t(lang, 'hero.credibility')}</p>
          <dl className="proofs">
            {proofs.map((f) => (
              <div className="proof" key={f.id}>
                <dt>{f.value}{f.suffix}</dt>
                <dd>{t(lang, `proofs.${f.id}`)}</dd>
              </div>
            ))}
          </dl>
          <div className="cta">
            <a className="btn btn-gold" data-magnetic href={withBase(profile.cv[lang])} download data-track="cv-download">
              <svg className="btn-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path pathLength={1} d="M12 3v12" /><path pathLength={1} d="m7 11 5 5 5-5" /><path pathLength={1} d="M5 20h14" /></svg>
              {t(lang, 'hero.ctaCv')}
            </a>
            <Link className="btn btn-line" href={`${localePath(lang)}#contact`}>{t(lang, 'hero.ctaContact')}</Link>
            <Link className="link-arrow" href={`${localePath(lang)}#projects`}>{t(lang, 'hero.ctaProjects')} →</Link>
          </div>
        </div>
        <div className="duo-wrap">
          <Motif name="rosace" variant="embroidery" className="duo-ring" />
          <figure className="duotone">
            <Picture name="profil" alt={t(lang, 'a11y.portrait')} sizes="(min-width: 960px) 30rem, 90vw" width={800} height={1067} eager />
          </figure>
        </div>
      </div>
      <div className="wrap">
        <HeroStatus scroll={t(lang, 'hero.scroll')} online={t(lang, 'hero.online')} tz={profile.location.timezone} />
      </div>
    </section>
  );
}
