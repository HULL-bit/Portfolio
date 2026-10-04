import { withBase } from '@/lib/base';
import { getShot } from '@/lib/content';

type Props = { slug: string; name: string; alt: string; sizes: string; eager?: boolean; className?: string };

/** <picture> AVIF → WebP → JPEG d'une capture de projet (tailles issues de content/images-manifest.json). */
export function ProjectShot({ slug, name, alt, sizes, eager = false, className }: Props) {
  const m = getShot(slug, name);
  if (!m) return null;
  const set = (ext: string) => m.widths.map((w) => `${withBase(`/images/projects/${slug}/${name}-${w}.${ext}`)} ${w}w`).join(', ');
  const last = m.widths[m.widths.length - 1]!;
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={withBase(`/images/projects/${slug}/${name}-${last}.jpg`)}
        srcSet={set('jpg')}
        sizes={sizes}
        alt={alt}
        width={m.width}
        height={m.height}
        className={className}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
      />
    </picture>
  );
}

/** URL (JPEG) de la plus grande déclinaison d'une capture : cible du lien « ouvrir en grand » des diagrammes. */
export function shotHref(slug: string, name: string): string | null {
  const m = getShot(slug, name);
  if (!m) return null;
  return withBase(`/images/projects/${slug}/${name}-${m.widths[m.widths.length - 1]}.jpg`);
}
