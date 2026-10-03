import '@/styles/globals.css';
import { FontFaces } from '@/components/ui/FontFaces';
import { withBase } from '@/lib/base';

export default function NotFound() {
  return (
    <html lang="fr">
      <head><FontFaces /></head>
      <body>
        <main className="grid min-h-dvh place-items-center p-8 font-mono">
          <div>
            <p className="eyebrow">kernel panic — 404</p>
            <h1 className="display text-7xl">Not syncing</h1>
            <p className="mt-6"><a className="text-cyan underline" href={withBase('/fr/')}>← Accueil</a></p>
          </div>
        </main>
      </body>
    </html>
  );
}
