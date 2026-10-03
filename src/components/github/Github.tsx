import { github, profile, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { SectionHead } from '@/components/ui/SectionHead';

const DAY = 86_400_000;
const level = (n: number) => (n === 0 ? 0 : n <= 1 ? 1 : n <= 3 ? 2 : n <= 6 ? 3 : 4);

/** 13 semaines de cellules LED, calculées à partir de la date des données (déterministe au build). */
function ledCells() {
  if (!github.fetchedAt) return [];
  const [y, m, d] = github.fetchedAt.slice(0, 10).split('-').map(Number) as [number, number, number];
  const end = Date.UTC(y, m - 1, d);
  const start = end - 90 * DAY;
  const lead = (new Date(start).getUTCDay() + 6) % 7;
  const cells: (number | null)[] = Array(lead).fill(null);
  for (let d = start; d <= end; d += DAY) cells.push(github.activity[new Date(d).toISOString().slice(0, 10)] ?? 0);
  return cells;
}

export function Github({ lang }: { lang: Lang }) {
  const cells = ledCells();
  return (
    <section id="github" className="section" aria-labelledby="github-title">
      <div className="wrap">
        <SectionHead id="github-title" eyebrow={t(lang, 'sections.github.eyebrow')} title={t(lang, 'sections.github.title')} />
        <div className="grid12">
          <div className="glass col-span-12 lg:col-span-4">
            <dl className="grid grid-cols-2 gap-6">
              <div><dt className="figure-num">{github.publicRepos}</dt><dd className="muted mt-2" style={{ margin: 0 }}>{t(lang, 'github.repos')}</dd></div>
              <div><dt className="figure-num">{github.stars}</dt><dd className="muted mt-2" style={{ margin: 0 }}>{t(lang, 'github.stars')}</dd></div>
            </dl>
            <a className="link-arrow mt-6" href={profile.contact.github} data-track="github-click" rel="noopener">{t(lang, 'github.profile')} ↗</a>
          </div>
          <div className="glass col-span-12 lg:col-span-8">
            <span className="card-label">{t(lang, 'github.languages')}</span>
            <ul className="grid gap-3">
              {github.languages.map((l) => (
                <li key={l.name}>
                  <div className="flex justify-between mb-1"><span>{l.name}</span><span className="muted mono" style={{ fontSize: '0.8rem' }}>{l.percent} %</span></div>
                  <div className="bar" aria-hidden="true"><i style={{ width: `${l.percent}%`, display: 'block' }} /></div>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass col-span-12 lg:col-span-7">
            <span className="card-label">{t(lang, 'github.pinned')}</span>
            <ul className="grid gap-3">
              {github.repos.slice(0, 6).map((r) => (
                <li key={r.name} className="flex justify-between gap-4 led-row">
                  <a href={r.url} rel="noopener" className="hover:underline">{r.name}</a>
                  <span className="muted mono" style={{ fontSize: '0.8rem' }}>{r.language ?? '—'}</span>
                </li>
              ))}
            </ul>
          </div>
          {cells.length ? (
            <div className="glass col-span-12 lg:col-span-5">
              <span className="card-label">{t(lang, 'github.activity')}</span>
              <div className="led-grid" role="img" aria-label={t(lang, 'github.activity')}>
                {cells.map((c, i) => (c === null ? <i key={i} style={{ visibility: 'hidden' }} /> : <i key={i} data-l={level(c)} />))}
              </div>
              <p className="muted mono mt-4" style={{ fontSize: '0.75rem' }}>{t(lang, 'github.updated')} {github.fetchedAt?.slice(0, 10)}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
