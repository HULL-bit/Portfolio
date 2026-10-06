import type { Metadata } from 'next';
import { BASE_PATH } from './base';
import { LOCALES, type Lang } from './i18n';

/** Origine publique du site : domaine officiel par défaut, `NEXT_PUBLIC_SITE_URL` pour le surcharger (sans slash final). */
export const SITE_ORIGIN = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.souleymane-diaw.online').replace(/\/+$/, '');

/** URL absolue d'un chemin du site (basePath inclus). */
export const abs = (path: string) => `${SITE_ORIGIN}${BASE_PATH}${path}`;

/** Chemin d'une page localisée, avec slash final : localePath('fr', 'cv/') → /fr/cv/ */
export const localePath = (lang: Lang, path = '') => `/${lang}/${path}`;

const OG_LOCALE: Record<Lang, string> = { fr: 'fr_FR', en: 'en_US' };

export function pageMeta(opts: { lang: Lang; path?: string; title: string; description: string; og: string; siteName: string }): Metadata {
  const { lang, path = '', title, description, og, siteName } = opts;
  const url = abs(localePath(lang, path));
  const image = abs(`/og/${og}-${lang}.png`);
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { ...Object.fromEntries(LOCALES.map((l) => [l, abs(localePath(l, path))])), 'x-default': abs(localePath('fr', path)) },
    },
    openGraph: { title, description, url, siteName, locale: OG_LOCALE[lang], type: 'website', images: [{ url: image, width: 1200, height: 630, alt: title }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
