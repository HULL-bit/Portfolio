import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { Nav } from '@/components/nav/Nav';
import { Footer } from '@/components/ui/Footer';
import { Grain } from '@/components/ui/Grain';
import { FaviconState } from '@/components/ui/FaviconState';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { ReadingProgress } from '@/components/motion/ReadingProgress';
import { CursorMount } from '@/components/motion/CursorMount';
import { CircuitRail } from '@/components/motion/CircuitRail';
import { profile, t } from '@/lib/content';
import { withBase } from '@/lib/base';
import { MobileBar } from '@/components/ui/MobileBar';
import { Nebula } from '@/components/ui/Nebula';
import { NebulaTint } from '@/components/ui/NebulaTint';

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <div id="top">
      <Nebula />
      <NebulaTint />
      <Grain />
      <FaviconState />
      <MotionProvider />
      <ReadingProgress label={t(lang, 'a11y.progress')} />
      <CursorMount labels={{ view: t(lang, 'cursor.view'), open: t(lang, 'cursor.open'), drag: t(lang, 'cursor.drag') }} />
      <Nav lang={lang} />
      <main id="main" style={{ position: 'relative' }}>
        <CircuitRail />
        {children}
      </main>
      <Footer lang={lang} />
      <MobileBar
        label={t(lang, 'a11y.mobileBar')}
        items={[
          { id: 'cv', label: t(lang, 'mobileBar.cv'), href: withBase(profile.cv[lang]), download: true, track: 'cv-download' },
          { id: 'email', label: t(lang, 'mobileBar.email'), href: `mailto:${profile.contact.email}`, track: 'email-click' },
          { id: 'whatsapp', label: t(lang, 'mobileBar.whatsapp'), href: profile.contact.whatsapp, track: 'whatsapp-click', external: true },
          { id: 'linkedin', label: t(lang, 'mobileBar.linkedin'), href: profile.contact.linkedin, track: 'linkedin-click', external: true },
        ]}
      />
    </div>
  );
}
