import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/ui/Footer';

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div id="top">
      <Nav lang={lang} />
      <main id="main">{children}</main>
      <Footer lang={lang} />
    </div>
  );
}
