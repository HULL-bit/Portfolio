import { withBase } from '@/lib/base';

const TINTS = ['indigo', 'violet', 'cyan', 'gold'] as const;

/**
 * Fond vivant : quatre nébuleuses pré-calculées (scripts/generate-bg.mjs), empilées en plein écran. Une seule est visible à la fois,
 * la teinte suit la section affichée (voir <NebulaTint />) ; la dérive lente est une animation CSS (compositeur : aucun coût GPU/CPU notable).
 * Rendu identique sur tous les appareils, avec ou sans WebGL.
 */
export function Nebula() {
  return (
    <div className="nebula-stack" aria-hidden="true">
      {TINTS.map((t) => (
        <div key={t} className={`nebula nebula-${t}`} style={{ backgroundImage: `url(${withBase(`/images/bg/nebula-${t}.webp`)})` }} />
      ))}
    </div>
  );
}
