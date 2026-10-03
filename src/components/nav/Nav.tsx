import Link from 'next/link';
import { withBase } from '@/lib/base';
import { localePath } from '@/lib/site';
import { t, profile } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { Logo } from '@/components/ui/Logo';
import { LangSwitch } from './LangSwitch';
import { Menu } from './Menu';

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
            <Menu
              items={[...links, { id: 'express', href: localePath(lang, 'cv/'), label: t(lang, 'nav.express') }, { id: 'contact', href: `${home}#contact`, label: t(lang, 'nav.contact') }]}
              labels={{ menu: 'Menu', open: t(lang, 'a11y.openMenu'), close: t(lang, 'a11y.closeMenu') }}
              cv={{ href: withBase(profile.cv[lang]), label: t(lang, 'hero.ctaCv') }}
            />
          </div>
        </nav>
      </div>
    </header>
  );
}
