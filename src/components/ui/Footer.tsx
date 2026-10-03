import { profile, t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { Divider } from './Divider';
import { DakarClock } from './DakarClock';
import { ToTop } from './ToTop';

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="footer">
      <Divider motif="chainette" repeat={70} />
      <div className="wrap footer-inner">
        <p>{t(lang, 'footer.copyright')}</p>
        <DakarClock label={t(lang, 'footer.time')} tz={profile.location.timezone} />
        <ToTop label={t(lang, 'a11y.toTop')} />
      </div>
    </footer>
  );
}
