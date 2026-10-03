'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LOCALES, type Lang } from '@/lib/i18n';

/** Bascule FR/EN en conservant la page courante (le pathname exclut déjà le basePath). */
export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const pathname = usePathname() ?? `/${lang}/`;
  const rest = pathname.replace(/^\/(fr|en)(?=\/|$)/, '') || '/';
  return (
    <div className="lang-switch" role="group" aria-label={label}>
      {LOCALES.map((l) => (
        <Link key={l} href={`/${l}${rest === '/' ? '/' : rest}`} hrefLang={l} lang={l} aria-current={l === lang} scroll={false}>
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
