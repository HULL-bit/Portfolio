import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/ui/Footer';
import { Grain } from '@/components/ui/Grain';
import { FaviconState } from '@/components/ui/FaviconState';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { ReadingProgress } from '@/components/motion/ReadingProgress';
import { Cursor } from '@/components/motion/Cursor';
import { CircuitRail } from '@/components/motion/CircuitRail';
import { t } from '@/lib/content';
import { BackgroundLoader } from '@/components/three/BackgroundLoader';

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div id="top">
      <BackgroundLoader />
      <Grain />
      <FaviconState />
      <MotionProvider />
      <ReadingProgress label={t(lang, 'a11y.progress')} />
      <Cursor labels={{ view: t(lang, 'cursor.view'), open: t(lang, 'cursor.open'), drag: t(lang, 'cursor.drag') }} />
      <Nav lang={lang} />
      <main id="main" style={{ position: 'relative' }}>
        <CircuitRail />
        {children}
      </main>
      <Footer lang={lang} />
    </div>
  );
}
