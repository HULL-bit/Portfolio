import { RollingNumber } from '@/components/motion/RollingNumber';

/** « −40 % » → préfixe « − », compteur à rouleaux 40, suffixe « % ». Les valeurs non numériques restent du texte. */
export function ResultValue({ value }: { value: string }) {
  const m = /^(\D*?)(\d+)(.*)$/.exec(value);
  if (!m) return <>{value}</>;
  const [, prefix, num, suffix] = m;
  return (
    <span className="result-value" aria-label={value}>
      {prefix ? <span aria-hidden="true">{prefix}</span> : null}
      <RollingNumber value={Number(num)} suffix={suffix} />
    </span>
  );
}
