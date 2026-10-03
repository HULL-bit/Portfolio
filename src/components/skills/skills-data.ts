/** Données sérialisables passées du serveur à la baie 3D. */
export type RackDomain = {
  id: 'systems' | 'databases' | 'fullstack' | 'mobile' | 'modeling';
  name: string;
  blurb: string;
  primary: boolean;
  items: { name: string; level: number }[];
};
export type RackLabels = { primary: string; level: string; hint: string; list: string };

export const ACCENT: Record<RackDomain['id'], string> = {
  systems: '#00E5FF',
  databases: '#FFB800',
  fullstack: '#3D5AFE',
  mobile: '#FF2E88',
  modeling: '#7C3AED',
};
