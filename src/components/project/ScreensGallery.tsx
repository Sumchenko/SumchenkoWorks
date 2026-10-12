import { useState, type MouseEvent } from 'react';
import { t, pad2, type Lang } from '@/i18n';
import type { ArtifactVM } from '@/lib/vm';
import { Icon } from '@/components/ds/Icon';

/*
 * Галерея экранов в начале «Обзора»: большое превью и миниатюры.
 * Превью открывает экран в окне артефакта — так проект можно посмотреть, даже если он не развёрнут.
 */
export function ScreensGallery({ items, lang, onOpen }: { items: ArtifactVM[]; lang: Lang; onOpen: (id: string) => (e: MouseEvent) => void }) {
  const T = t(lang).project;
  const [cur, setCur] = useState(0);
  const a = items[cur] ?? items[0];
  if (!a) return null;

  return (
    <section aria-label={T.screensAria} data-reveal="0" style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '28px 0', borderBottom: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', justifyContent: 'space-between', gap: '6px 24px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 500, lineHeight: 1.25 }}>{T.screens}</h2>
        <span className="sw-label">{a.code} · {pad2(cur + 1)} / {pad2(items.length)}</span>
      </div>

      <a href={a.href} onClick={onOpen(a.id)} title={T.screensOpen} className="screen-main"
        style={{ position: 'relative', display: 'block', width: '100%', maxWidth: 'calc(70vh * 1.6)', border: '1px solid var(--line)', background: 'var(--surface)', aspectRatio: '16 / 10', overflow: 'hidden', cursor: 'zoom-in' }}>
        <img src={a.src ?? undefined} alt={a.title} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
        <span aria-hidden="true" className="screen-main__zoom" style={{ position: 'absolute', right: 12, bottom: 12, width: 36, height: 36, display: 'grid', placeItems: 'center', background: 'var(--inverse-bg)', color: 'var(--inverse-fg)' }}>
          <Icon name="eye" size={18} />
        </span>
      </a>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxWidth: '72ch' }}>
        <span style={{ fontSize: 17, fontWeight: 500 }}>{a.title}</span>
        {a.summary ? <span style={{ fontSize: 15, color: 'var(--fg-2)', lineHeight: 1.55 }}>{a.summary}</span> : null}
      </div>

      {items.length > 1 ? (
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
    </section>
  );
}
