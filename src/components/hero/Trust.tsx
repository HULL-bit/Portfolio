import { profile, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';

export function Trust({ lang }: { lang: Lang }) {
  return (
    <aside className="trust" aria-label={t(lang, 'trust.title')}>
      <div className="wrap trust-inner">
        <span className="eyebrow">{t(lang, 'trust.title')}</span>
        <ul className="trust-list">
          {profile.trustedBy.map((o) => <li key={o.name}>{o.name}</li>)}
        </ul>
      </div>
    </aside>
  );
}
