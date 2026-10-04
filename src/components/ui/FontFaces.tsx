import { withBase } from '@/lib/base';

const FACES = [
  ['Clash Display', '600 700', 'ClashDisplay-Bold'],
  ['Satoshi', 400, 'Satoshi-Regular'],
  ['Satoshi', 500, 'Satoshi-Medium'],
  ['JetBrains Mono', '400 500', 'jetbrains-mono-latin-400-normal'],
] as const;

/**
 * Polices de secours à métriques ajustées (valeurs mesurées par scripts/font-metrics.mjs) : tant que la police web n'est pas
 * chargée, le texte occupe exactement la même largeur → pas de décalage de mise en page (CLS) au remplacement.
 */
const FALLBACKS =
  "@font-face{font-family:'Clash Display Fallback';font-weight:600 700;src:local('Arial Bold'),local('Arial-BoldMT'),local('Liberation Sans Bold'),local('Helvetica Bold'),local('Arimo Bold');size-adjust:105.8%;ascent-override:84.2%;descent-override:23.6%;line-gap-override:8.5%}" +
  "@font-face{font-family:'Satoshi Fallback';font-weight:400 500;src:local('Arial'),local('ArialMT'),local('Liberation Sans'),local('Helvetica'),local('Arimo');size-adjust:98%;ascent-override:103%;descent-override:24.5%;line-gap-override:10.2%}" +
  "@font-face{font-family:'JetBrains Mono Fallback';font-weight:400 500;src:local('Courier New'),local('CourierNewPSMT'),local('Liberation Mono'),local('Cousine');size-adjust:100%;ascent-override:102%;descent-override:30%;line-gap-override:0%}";

/** Les @font-face sont injectés ici pour que les URLs respectent le basePath. */
export function FontFaces() {
  const css =
    FALLBACKS +
    FACES.map(
      ([family, weight, file]) =>
        `@font-face{font-family:'${family}';font-weight:${weight};font-style:normal;font-display:swap;src:url(${withBase(`/fonts/${file}.woff2`)}) format('woff2')}`,
    ).join('');
  return (
    <>
      <link rel="preload" as="font" type="font/woff2" crossOrigin="" href={withBase('/fonts/ClashDisplay-Bold.woff2')} />
      <link rel="preload" as="font" type="font/woff2" crossOrigin="" href={withBase('/fonts/Satoshi-Regular.woff2')} />
      <link rel="preload" as="font" type="font/woff2" crossOrigin="" href={withBase('/fonts/jetbrains-mono-latin-400-normal.woff2')} />
      <link rel="icon" type="image/svg+xml" href={withBase('/favicon.svg')} />
      <meta name="theme-color" content="#05060A" />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  );
}
