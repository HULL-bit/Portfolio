import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/i18n';
import { projects } from '@/lib/content';
import { abs, localePath } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['', 'cv/', ...projects.map((p) => `projets/${p.slug}/`)];
  return paths.flatMap((path) =>
    LOCALES.map((lang) => ({
      url: abs(localePath(lang, path)),
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, abs(localePath(l, path))])) },
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1 : 0.7,
    })),
  );
}
