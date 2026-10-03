import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLang } from '@/lib/i18n';
import { pick, profile, t } from '@/lib/content';
import { abs, pageMeta } from '@/lib/site';
import { Hero } from '@/components/hero/Hero';
import { Trust } from '@/components/hero/Trust';
import { About } from '@/components/about/About';
import { TechCloud } from '@/components/marquee/TechCloud';
import { Experience } from '@/components/experience/Experience';
import { Projects } from '@/components/projects/Projects';
import { Skills } from '@/components/skills/Skills';
import { Journey } from '@/components/journey/Journey';
import { Github } from '@/components/github/Github';
import { Testimonials, Certifications } from '@/components/contact/Optional';
import { Contact } from '@/components/contact/Contact';
import { Divider } from '@/components/ui/Divider';
import { BootSequence } from '@/components/boot/BootSequence';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return pageMeta({ lang, title: t(lang, 'meta.homeTitle'), description: t(lang, 'meta.homeDescription'), og: 'home', siteName: t(lang, 'meta.siteName') });
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: pick(profile.title, lang),
    description: t(lang, 'meta.homeDescription'),
    url: abs(`/${lang}/`),
    email: `mailto:${profile.contact.email}`,
    address: { '@type': 'PostalAddress', addressLocality: profile.location.city, addressCountry: 'SN' },
    knowsAbout: ['Linux', 'Oracle Database 19c', 'PL/SQL', 'SQL Server', 'C#', '.NET', 'Django', 'React', 'Spring Boot', 'Full-Stack', 'DevOps', 'Systèmes distribués', 'Réseaux IP', 'Sécurité informatique'],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'Université Cheikh Anta Diop de Dakar (UCAD)' },
      { '@type': 'School', name: 'Lycée de Mbacké' },
    ],
    worksFor: { '@type': 'Organization', name: 'ONG Wagadu Africa', url: profile.current.url },
    sameAs: [profile.contact.github, profile.contact.linkedin],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <BootSequence labels={{ welcome: t(lang, 'boot.welcome'), skip: t(lang, 'boot.skip') }} />
      <Hero lang={lang} />
      <Trust lang={lang} />
      <Divider motif="feston" />
      <About lang={lang} />
      <TechCloud lang={lang} />
      <Experience lang={lang} />
      <Projects lang={lang} />
      <Skills lang={lang} />
      <Journey lang={lang} />
      <Github lang={lang} />
      <Testimonials lang={lang} />
      <Certifications lang={lang} />
      <Divider motif="anneaux" />
      <Contact lang={lang} />
    </>
  );
}
