'use client';

export function TerminalButton({ label }: { label: string }) {
  return (
    <button type="button" className="icon-btn mono" onClick={() => window.dispatchEvent(new Event('diaw:terminal'))} aria-label={label} title={label + ' ( ` )'}>
      &gt;_
    </button>
  );
}
