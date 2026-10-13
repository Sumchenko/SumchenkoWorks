import { useCallback, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type TouchEvent } from 'react';
import { createPortal } from 'react-dom';
import { t, pad2, type Lang } from '@/i18n';
import type { ArtifactVM } from '@/lib/vm';
import { Icon } from '@/components/ds/Icon';
import { track } from '@/lib/client';

/*
 * Галерея экранов в начале «Обзора»: превью со стрелками по бокам и миниатюры.
 * Нажатие на превью открывает полноэкранный просмотр — проект можно посмотреть, даже если он не развёрнут.
 */
export function ScreensGallery({ items, lang, slug }: { items: ArtifactVM[]; lang: Lang; slug: string }) {
  const T = t(lang).project;
  const [cur, setCur] = useState(0);
  const [open, setOpen] = useState(false);
  const n = items.length;
  const go = useCallback((d: number) => setCur((i) => (i + d + n) % n), [n]);
  const close = useCallback(() => setOpen(false), []);
  const a = items[cur] ?? items[0];
  if (!a) return null;

  // События из просмотрщика (портал) всплывают сюда по дереву React — их обрабатывает сам просмотрщик
  const onKey = (e: ReactKeyboardEvent) => {
    if (open) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
  };
  const W = 'calc(70vh * 1.6)';

  return (
    <section aria-label={T.screensAria} aria-roledescription="carousel" data-reveal="0" onKeyDown={onKey}
      style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '28px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px 24px', maxWidth: W }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.25 }}>{T.screens}</h2>
        <span className="sw-label" aria-live="polite">{pad2(cur + 1)} / {pad2(n)}</span>
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: W }}>
        <button type="button" onClick={() => { setOpen(true); track(`${slug} / screens`, a.title); }} aria-label={`${T.screensOpen}: ${a.title}`} title={T.screensOpen}
          style={{ display: 'block', width: '100%', padding: 0, border: '1px solid var(--line)', background: 'var(--surface)', aspectRatio: '16 / 10', overflow: 'hidden', cursor: 'zoom-in' }}>
          <img src={a.src ?? undefined} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        </button>
        {n > 1 ? (
          <>
            <NavBtn side="left" label={T.screensPrev} onClick={() => go(-1)} />
            <NavBtn side="right" label={T.screensNext} onClick={() => go(1)} />
          </>
        ) : null}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '72ch' }}>
        <span style={{ fontSize: 17, fontWeight: 500 }}>{a.title}</span>
        {a.summary ? <span style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.55 }}>{a.summary}</span> : null}
      </div>

      {n > 1 ? (
        <ol role="list" style={{ listStyle: 'none', margin: 0, padding: '4px 0 6px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {items.map((x, i) => (
            <li key={x.id} style={{ flex: '0 0 auto' }}>
              <button type="button" onClick={() => setCur(i)} aria-current={i === cur ? 'true' : undefined} aria-label={x.title} title={x.title}
                style={{ display: 'block', width: 132, aspectRatio: '16 / 10', padding: 0, background: 'var(--surface)', cursor: 'pointer',
                  border: i === cur ? '2px solid var(--fg)' : '1px solid var(--line)', opacity: i === cur ? 1 : 0.7, transition: 'opacity 140ms var(--ease-out)' }}>
                <img src={x.src ?? undefined} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top left', display: 'block' }} />
              </button>
            </li>
          ))}
        </ol>
      ) : null}

      {open ? <Lightbox items={items} cur={cur} go={go} onClose={close} lang={lang} /> : null}
    </section>
  );
}

function NavBtn({ side, label, onClick, big }: { side: 'left' | 'right'; label: string; onClick: () => void; big?: boolean }) {
  const s = big ? 52 : 40;
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      style={{ position: 'absolute', top: '50%', [side]: big ? 'clamp(4px, 1.5vw, 20px)' : 10, transform: 'translateY(-50%)', width: s, height: s, display: 'grid', placeItems: 'center',
        background: big ? 'rgba(20,20,20,.85)' : 'var(--inverse-bg)', color: big ? '#f2f2f2' : 'var(--inverse-fg)', border: big ? '1px solid #555' : '1px solid var(--line-strong)', cursor: 'pointer', zIndex: 1 }}>
      <Icon name={side === 'left' ? 'arrow-left' : 'arrow-right'} size={big ? 22 : 18} />
    </button>
  );
}

/* Полноэкранный просмотр: стрелки, ←/→, Esc, свайп; клик по фону закрывает. */
function Lightbox({ items, cur, go, onClose, lang }: { items: ArtifactVM[]; cur: number; go: (d: number) => void; onClose: () => void; lang: Lang }) {
  const L = t(lang);
  const a = items[cur];
  const closeRef = useRef<HTMLButtonElement>(null);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    const back = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.style.overflow = prev; back?.focus(); };
  }, [go, onClose]);

  const onTouchStart = (e: TouchEvent) => { touch.current = e.touches[0].clientX; };
  const onTouchEnd = (e: TouchEvent) => {
    if (touch.current == null) return;
    const dx = e.changedTouches[0].clientX - touch.current;
    touch.current = null;
    if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
  };
  const backdrop = (e: { target: EventTarget; currentTarget: EventTarget }) => { if (e.target === e.currentTarget) onClose(); };

  return createPortal(
    <div role="dialog" aria-modal="true" aria-label={a.title} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} onMouseDown={backdrop}
      style={{ position: 'fixed', inset: 0, zIndex: 300, background: '#0b0b0b', color: '#f2f2f2', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '12px 16px', flex: 'none' }}>
        <span className="sw-label" style={{ color: '#bdbdbd' }}>{pad2(cur + 1)} / {pad2(items.length)} · {a.code}</span>
        <button ref={closeRef} type="button" onClick={onClose} aria-label={L.close} title={L.close}
          style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', background: 'transparent', color: 'inherit', border: '1px solid #555', cursor: 'pointer' }}>
          <Icon name="close" size={20} />
        </button>
      </div>
      <div onMouseDown={backdrop} style={{ position: 'relative', flex: '1 1 auto', minHeight: 0, minWidth: 0 }}>
        <div onMouseDown={backdrop} style={{ position: 'absolute', inset: '0 clamp(8px, 6vw, 88px)' }}>
          <img key={a.id} src={a.src ?? undefined} alt={a.title} draggable={false}
            style={{ display: 'block', width: '100%', height: '100%', objectFit: 'contain', userSelect: 'none' }} />
        </div>
        {items.length > 1 ? (
          <>
            <NavBtn side="left" label={L.project.screensPrev} onClick={() => go(-1)} big />
            <NavBtn side="right" label={L.project.screensNext} onClick={() => go(1)} big />
          </>
        ) : null}
      </div>
      <div style={{ flex: 'none', padding: '12px 16px 18px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>{a.title}</span>
        {a.summary ? <span style={{ fontSize: 14, color: '#bdbdbd', maxWidth: '80ch', lineHeight: 1.5 }}>{a.summary}</span> : null}
      </div>
    </div>,
    document.body,
  );
}
