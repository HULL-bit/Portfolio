import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/ui/Footer';
import { Grain } from '@/components/ui/Grain';
import { FaviconState } from '@/components/ui/FaviconState';
import { BackgroundLoader } from '@/components/three/BackgroundLoader';

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div id="top">
      <BackgroundLoader />
      <Grain />
      <FaviconState />
      <Nav lang={lang} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
