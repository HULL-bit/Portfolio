import { t } from '@/lib/content';
import type { Lang } from '@/lib/i18n';
import { Divider } from './Divider';

export function Footer({ lang }: { lang: Lang }) {
  return (
    <footer className="footer">
      <Divider motif="chainette" repeat={70} />
      <div className="wrap footer-inner">
        <p>{t(lang, 'footer.copyright')}</p>
        <a href="#top" className="link-arrow">↑ {t(lang, 'a11y.toTop')}</a>
      </div>
    </footer>
  );
}
