import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { FontFaces } from '@/components/ui/FontFaces';
import { HeadScripts } from '@/components/ui/HeadScripts';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head><FontFaces /><HeadScripts /></head>
      <body>{children}</body>
    </html>
  );
}
