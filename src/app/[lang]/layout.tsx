import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '@/styles/globals.css';
import { FontFaces } from '@/components/ui/FontFaces';
import { LOCALES, isLang } from '@/lib/i18n';

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang}>
      <head><FontFaces /></head>
      <body>
        <a className="skip-link" href="#main">{lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
        {children}
      </body>
    </html>
  );
}
