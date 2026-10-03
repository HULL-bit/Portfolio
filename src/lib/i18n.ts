export const LOCALES = ['fr', 'en'] as const;
export type Lang = (typeof LOCALES)[number];
export const DEFAULT_LANG: Lang = 'fr';

export const isLang = (v: string): v is Lang => (LOCALES as readonly string[]).includes(v);
export const otherLang = (l: Lang): Lang => (l === 'fr' ? 'en' : 'fr');
