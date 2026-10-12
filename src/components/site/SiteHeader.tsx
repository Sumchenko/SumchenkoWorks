import { useEffect, useState, type MouseEvent } from 'react';
import { t, type Lang } from '@/i18n';
import { Icon } from '@/components/ds/Icon';
import { IconButton } from '@/components/ds/Button';
import { Tooltip } from '@/components/ds/Feedback';
import { PixelLogo } from '@/components/ds/PixelLogo';
import { reducedMotion } from '@/lib/client';

export const NAV_IDS = ['top', 'approach', 'featured', 'skills', 'contacts'] as const;

type Props = { lang: Lang; isHome: boolean; homeHref: string; altHref: string; altLang: Lang };

export default function SiteHeader({ lang, isHome, homeHref, altHref, altLang }: Props) {
  const T = t(lang);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(isHome ? 'top' : null);

  // Подсветка раздела главной, который сейчас на экране
  useEffect(() => {
    if (!isHome) return;
    const spy = () => {
      let cur = 'top';
      NAV_IDS.forEach((id) => { const el = document.getElementById(id); if (el && el.getBoundingClientRect().top < 140) cur = id; });
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) cur = NAV_IDS[NAV_IDS.length - 1];
      setActive(cur);
    };
    spy();
    window.addEventListener('scroll', spy, { passive: true });
    return () => window.removeEventListener('scroll', spy);
  }, [isHome]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open]);

  const href = (id: string) => (isHome ? '#' + id : id === 'top' ? homeHref : homeHref + '#' + id);

  const toggleTheme = () => {
    const el = document.documentElement;
    const next = el.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    const run = () => el.setAttribute('data-theme', next);
    const d = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    if (d.startViewTransition && !reducedMotion()) d.startViewTransition(run); else run();
    try { localStorage.setItem('sw-theme', next); } catch { /* приватный режим */ }
  };

  // При смене языка сохраняем открытую вкладку проекта и фильтры каталога
  const switchLang = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    location.href = altHref + location.search + location.hash;
  };

  const links = NAV_IDS.map((id, i) => (
    <a key={id} href={href(id)} className="sw-nav__link" aria-current={active === id ? 'page' : undefined} onClick={() => setOpen(false)}>
      <span className="sw-nav__idx">{String(i + 1).padStart(2, '0')}</span>
      <span>{T.nav[id]}</span>
    </a>
  ));

  return (
    <header className="sw-nav">
      <a className="sw-nav__brand" href={homeHref} aria-label={T.brandAria}>
        <PixelLogo size={30} title="Sumchenko Works" />
        <span className="sw-nav__brand-text">Sumchenko Works</span>
      </a>
      <nav className="sw-nav__links" aria-label={T.navAria}>{links}</nav>
      <div className="sw-nav__actions">
        <Tooltip content={T.lang.title} side="bottom">
          <a className="sw-iconbtn sw-langbtn" data-size="sm" href={altHref} hrefLang={altLang} lang={altLang} aria-label={T.lang.title} onClick={switchLang}>
            {T.lang.label}
          </a>
        </Tooltip>
        <Tooltip content={T.theme.toggle} side="bottom">
          <button type="button" className="sw-iconbtn" data-size="sm" data-variant="outline" aria-label={T.theme.toggle} onClick={toggleTheme}>
            <Icon name="moon" size={16} className="theme-icon-moon" />
            <Icon name="sun" size={16} className="theme-icon-sun" />
          </button>
        </Tooltip>
        <IconButton className="sw-nav__menu" icon={open ? 'close' : 'menu'} label={open ? T.menuClose : T.menu} variant="bare" aria-expanded={open} onClick={() => setOpen(!open)} />
      </div>
      <nav className="sw-nav__sheet" data-open={open ? 'true' : undefined} aria-label={T.navMobileAria}>{links}</nav>
    </header>
  );
}
