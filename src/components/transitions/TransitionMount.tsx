'use client';
import { IdleMount } from '@/components/ui/IdleMount';

const load = () => import('./PageTransition').then((m) => m.PageTransition);

/** Rideau de transition : chargé après le premier rendu (Framer Motion hors du chemin critique). */
export function TransitionMount() {
  return <IdleMount load={load} />;
}
