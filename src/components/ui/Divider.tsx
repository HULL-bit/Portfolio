import { Motif } from './Motif';
import type { MotifName } from './motifs';

/** Séparateur de sections : bande brodée discrète. */
export function Divider({ motif = 'feston', repeat = 60 }: { motif?: MotifName; repeat?: number }) {
  return (
    <div className="divider" aria-hidden="true">
      <Motif name={motif} repeat={repeat} variant="circuit" />
    </div>
  );
}
