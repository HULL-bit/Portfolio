/**
 * Pont boot → particules du Hero.
 * Le boot publie les points du texte « ACCESS GRANTED » (coordonnées pixels écran) au moment de l'implosion ;
 * la scène 3D les utilise comme positions de départ des particules.
 */
type Listener = (textPoints: Float32Array | null) => void;
const listeners = new Set<Listener>();
let pending: { points: Float32Array | null } | null = null;

export const heroBus = {
  /** Appelé par le boot : `null` = pas d'implosion (fondu simple). */
  emitImplode(points: Float32Array | null) {
    pending = { points };
    listeners.forEach((l) => l(points));
  },
  /** S'abonne ; si l'implosion a déjà eu lieu, le listener est rappelé immédiatement. */
  onImplode(l: Listener) {
    listeners.add(l);
    if (pending) l(pending.points);
    return () => listeners.delete(l);
  },
};
