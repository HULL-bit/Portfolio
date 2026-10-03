import type { ReactNode } from 'react';
import '@/styles/globals.css';
import { FontFaces } from '@/components/ui/FontFaces';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head><FontFaces /></head>
      <body>{children}</body>
    </html>
  );
}
