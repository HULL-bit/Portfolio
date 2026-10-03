import { withBase } from '@/lib/base';

type Props = {
  name: string;
  widths?: number[];
  alt: string;
  sizes: string;
  eager?: boolean;
  className?: string;
  width: number;
  height: number;
};

/** <picture> AVIF → WebP → JPEG, générée par scripts/optimize-images.mjs. */
export function Picture({ name, widths = [480, 800], alt, sizes, eager = false, className, width, height }: Props) {
  const set = (ext: string) => widths.map((w) => `${withBase(`/images/profil/${name}-${w}.${ext}`)} ${w}w`).join(', ');
  const last = widths[widths.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={set('avif')} sizes={sizes} />
      <source type="image/webp" srcSet={set('webp')} sizes={sizes} />
      <img
        src={withBase(`/images/profil/${name}-${last}.jpg`)}
        srcSet={set('jpg')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={className}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding={eager ? 'sync' : 'async'}
      />
    </picture>
  );
}
