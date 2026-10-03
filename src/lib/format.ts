/** « 2024 — aujourd'hui » / « 2022 – 2025 » / « 2022 ». */
export function period(start: number, end: number | null, present: string): string {
  if (end === null) return `${start} — ${present}`;
  return start === end ? `${start}` : `${start} – ${end}`;
}
