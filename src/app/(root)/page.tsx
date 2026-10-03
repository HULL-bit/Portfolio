import { withBase } from '@/lib/base';

export const metadata = {
  title: 'Souleymane DIAW — Ingénieur Systèmes d’Information Répartis',
  other: { refresh: `0; url=${withBase('/fr/')}` },
};

const REDIRECT = `(function(){try{var l=(navigator.language||'fr').toLowerCase().indexOf('fr')===0?'fr':'en';location.replace(${JSON.stringify(withBase('/'))}+l+'/')}catch(e){}})()`;

export default function Page() {
  return (
    <main className="grid min-h-dvh place-items-center p-8 text-center">
      <script dangerouslySetInnerHTML={{ __html: REDIRECT }} />
      <p className="font-mono text-sm">
        <a className="text-cyan underline" href={withBase('/fr/')}>Français</a>
        {' · '}
        <a className="text-cyan underline" href={withBase('/en/')}>English</a>
      </p>
    </main>
  );
}
