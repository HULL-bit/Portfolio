/** Timings et easings centralisés : toute animation du site passe par ces constantes. */
export const DUR = {
  micro: 0.3,     // micro-interactions : 200–350 ms
  reveal: 0.95,   // révélations : 700–1100 ms
  page: 1.0,      // transitions de page : 900–1200 ms
  count: 1.9,     // compteurs
} as const;

export const EASE = {
  out: 'expo.out',        // entrées
  inOut: 'power4.inOut',  // transitions
} as const;

export const STAGGER = { chars: 0.02, lines: 0.09, cards: 0.12, digits: 0.12 } as const;

/** Mêmes courbes pour Framer Motion (transitions de page, layout). */
export const FM_EASE = {
  out: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOut: [0.76, 0, 0.24, 1] as [number, number, number, number],
};

export const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine) and (hover: hover)').matches;

/** Palette de couleurs utilisable côté JS (miroir des tokens CSS). */
export const COLORS = { indigo: '#3D5AFE', violet: '#7C3AED', gold: '#FFB800', cyan: '#00E5FF', magenta: '#FF2E88' } as const;
