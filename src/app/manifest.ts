import type { MetadataRoute } from 'next';
import { BASE_PATH } from '@/lib/base';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Souleymane DIAW — SYSTEM//DIAW',
    short_name: 'S. DIAW',
    description: 'Portfolio de Souleymane DIAW, ingénieur systèmes d’information répartis.',
    start_url: `${BASE_PATH}/fr/`,
    display: 'standalone',
    background_color: '#05060A',
    theme_color: '#05060A',
    icons: [{ src: `${BASE_PATH}/favicon.svg`, sizes: 'any', type: 'image/svg+xml' }],
  };
}
