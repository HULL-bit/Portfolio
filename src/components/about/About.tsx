import { pick, profile, t, tList } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { Picture } from '@/components/ui/Picture';
import { SectionHead } from '@/components/ui/SectionHead';
import { period } from '@/lib/format';
import { Motif } from '@/components/ui/Motif';
import { RollingNumber } from '@/components/motion/RollingNumber';

/** Entoure les mots-clés d'un <span class="kw"> (allumés en cyan après la révélation du texte). */
function Highlighted({ text, words }: { text: string; words: string[] }) {
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  return <>{text.split(re).map((part, i) => (words.includes(part) ? <span key={i} className="kw">{part}</span> : part))}</>;
}

export function About({ lang }: { lang: Lang }) {
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about-title" eyebrow={t(lang, 'sections.about.eyebrow')} title={t(lang, 'sections.about.title')} />
        <div className="grid12">
          <div className="glass col-span-12 lg:col-span-7">
            <div className="prose" data-lines>
              {tList(lang, 'about.paragraphs').map((p) => <p key={p}><Highlighted text={p} words={tList(lang, 'about.highlights')} /></p>)}
            </div>
          </div>
          <div className="photo-wrap col-span-12 sm:col-span-8 sm:col-start-3 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2">
            <Motif name="quatrefeuille" className="corner tl" />
            <Motif name="quatrefeuille" className="corner br" />
            <figure className="photo-frame" style={{ height: '100%' }}>
              <Picture name="profil" alt={t(lang, 'a11y.portrait')} sizes="(min-width: 1024px) 28rem, 90vw" width={800} height={1067} />
            </figure>
          </div>
          <div className="glass col-span-12 lg:col-span-7">
            <span className="card-label">{t(lang, 'about.current')}</span>
            <p className="display" style={{ fontSize: 'clamp(1.6rem,2.6vw,2.4rem)', lineHeight: 1.05 }}>{pick(profile.current.role, lang)}</p>
            <p className="mt-2">{profile.current.org}</p>
            <p className="muted mt-1 mono" style={{ fontSize: '0.85rem' }}>{t(lang, 'about.since')} {profile.current.since}</p>
            <p className="mt-4">{pick(profile.current.study, lang)}</p>
          </div>
          <div className="glass col-span-12">
            <span className="card-label">{t(lang, 'about.languages')}</span>
            <ul className="grid gap-x-10 gap-y-4 md:grid-cols-2">
              {profile.languages.map((l) => (
                <li key={l.name.fr}>
                  <div className="flex justify-between gap-4 mb-2"><span>{pick(l.name, lang)}</span><span className="muted mono" style={{ fontSize: '0.8rem' }}>{pick(l.level, lang)}</span></div>
                  <div className="gauge" role="img" aria-label={`${pick(l.name, lang)} — ${pick(l.level, lang)}`}><i style={{ width: `${l.value * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </div>
          <dl className="col-span-12 grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {profile.keyFigures.map((f) => (
              <div key={f.id}>
                <dt className="figure-num"><RollingNumber value={f.value} suffix={f.suffix} /></dt>
                <dd className="muted mt-2" style={{ margin: 0 }}>{t(lang, `proofs.${f.id}`)}</dd>
              </div>
            ))}
          </dl>
        </div>
        <p className="sr-only">{period(profile.current.since, null, t(lang, 'experience.present'))}</p>
      </div>
    </section>
  );
}
