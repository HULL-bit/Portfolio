import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import '@/styles/globals.css';
import { FontFaces } from '@/components/ui/FontFaces';
import { HeadScripts } from '@/components/ui/HeadScripts';
import { PageTransition } from '@/components/transitions/PageTransition';
import { TerminalHost } from '@/components/terminal/TerminalHost';
import { Konami } from '@/components/ui/Konami';
import { Analytics } from '@/components/ui/Analytics';
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
      <head><FontFaces /><HeadScripts /></head>
      <body>
        <a className="skip-link" href="#main">{lang === 'fr' ? 'Aller au contenu' : 'Skip to content'}</a>
        {children}
        <TerminalHost lang={lang} />
        <Konami />
        <Analytics />
        {process.env.NEXT_PUBLIC_GOATCOUNTER ? (
          <script async src="https://gc.zgo.at/count.js" data-goatcounter={`https://${process.env.NEXT_PUBLIC_GOATCOUNTER}.goatcounter.com/count`} />
        ) : null}
        <PageTransition />
      </body>
    </html>
  );
}
