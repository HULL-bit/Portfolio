import { withBase } from '@/lib/base';

const FACES = [
  ['Clash Display', 700, 'ClashDisplay-Bold'],
  ['Clash Display', 600, 'ClashDisplay-Semibold'],
  ['Satoshi', 400, 'Satoshi-Regular'],
  ['Satoshi', 500, 'Satoshi-Medium'],
  ['JetBrains Mono', 400, 'jetbrains-mono-latin-400-normal'],
  ['JetBrains Mono', 500, 'jetbrains-mono-latin-500-normal'],
] as const;

/** Les @font-face sont injectés ici pour que les URLs respectent le basePath. */
export function FontFaces() {
  const css = FACES.map(
    ([family, weight, file]) =>
      `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:swap;src:url(${withBase(`/fonts/${file}.woff2`)}) format('woff2')}`,
  ).join('');
  return (
    <>
      <link rel="preload" as="font" type="font/woff2" crossOrigin="" href={withBase('/fonts/ClashDisplay-Bold.woff2')} />
      <link rel="preload" as="font" type="font/woff2" crossOrigin="" href={withBase('/fonts/Satoshi-Regular.woff2')} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
