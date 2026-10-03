import Link from 'next/link';
import { withBase } from '@/lib/base';
import { localePath } from '@/lib/site';
import { t, profile } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { Logo } from '@/components/ui/Logo';
import { LangSwitch } from './LangSwitch';

const LINKS = ['about', 'experience', 'projects', 'skills', 'journey', 'github'] as const;

export function Nav({ lang }: { lang: Lang }) {
  const home = localePath(lang);
  const links = LINKS.map((id) => ({ id, href: `${home}#${id}`, label: t(lang, `nav.${id}`) }));
  return (
    <header className="nav">
      <div className="wrap">
        <nav className="nav-inner" aria-label={t(lang, 'a11y.mainNav')}>
          <Link href={home} aria-label={profile.name}><Logo /></Link>
          <div className="nav-links">
            {links.map((l) => <Link key={l.id} href={l.href}>{l.label}</Link>)}
            <Link href={localePath(lang, 'cv/')}>{t(lang, 'nav.express')}</Link>
          </div>
          <div className="nav-actions">
            <LangSwitch lang={lang} label={t(lang, 'a11y.language')} />
            <a className="btn btn-gold btn-sm" href={withBase(profile.cv[lang])} download data-track="cv-download">{t(lang, 'nav.cv')}</a>
            <Link className="btn btn-line btn-sm nav-contact" href={`${home}#contact`}>{t(lang, 'nav.contact')}</Link>
            <details className="menu">
              <summary className="btn btn-line btn-sm menu-toggle" aria-label={t(lang, 'a11y.openMenu')}>Menu</summary>
              <div className="menu-panel" style={{ position: 'fixed', top: '4.25rem', left: 0, right: 0 }}>
                <div className="wrap">
                  <ul>
                    {links.map((l) => <li key={l.id}><Link href={l.href}>{l.label}</Link></li>)}
                    <li><Link href={localePath(lang, 'cv/')}>{t(lang, 'nav.express')}</Link></li>
                  </ul>
                </div>
              </div>
            </details>
          </div>
        </nav>
      </div>
    </header>
  );
}
