import type { Status } from '@/lib/schemas';

/** Pastille d'état du projet (en ligne, livré, en cours, prototype) avec note facultative. */
export function StatusBadge({ status, label, note }: { status: Status; label: string; note?: string | null }) {
  return (
    <span className={`status status-${status}`}>
      <i aria-hidden="true" />
      {label}
      {note ? <span className="status-note"> — {note}</span> : null}
    </span>
  );
}
