export function SectionHead({ eyebrow, title, long = false, id }: { eyebrow: string; title: string; long?: boolean; id?: string }) {
  return (
    <header className="section-head">
      <span className="eyebrow" data-eyebrow>{eyebrow}</span>
      <h2 id={id} data-title className={`section-title${long ? ' is-long' : ''}`}>{title}</h2>
    </header>
  );
}
