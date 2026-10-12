import { useRef, type KeyboardEvent } from 'react';

export type TabItem = { id: string; label: string; count?: number };

/* Только список вкладок: панели рендерит родитель, чтобы весь контент был в HTML (SEO и работа без JS). */
export function TabList({ items, value, onChange, numbered = false, label, idPrefix }:
  { items: TabItem[]; value: string; onChange: (id: string) => void; numbered?: boolean; label?: string; idPrefix: string }) {
  const listRef = useRef<HTMLDivElement>(null);
  const onKey = (e: KeyboardEvent) => {
    const i = items.findIndex((t) => t.id === value);
    let n = -1;
    if (e.key === 'ArrowRight') n = (i + 1) % items.length;
    if (e.key === 'ArrowLeft') n = (i - 1 + items.length) % items.length;
    if (n >= 0) {
      e.preventDefault();
      onChange(items[n].id);
      const b = listRef.current?.querySelectorAll<HTMLButtonElement>('[role=tab]')[n];
      b?.focus();
    }
  };
  return (
    <div className="sw-tabs" data-variant="underline">
      <div className="sw-tabs__list" role="tablist" aria-label={label} ref={listRef} onKeyDown={onKey}>
        {items.map((t, i) => (
          <button
            key={t.id}
            id={idPrefix + '-tab-' + t.id}
            role="tab"
            type="button"
            className="sw-tab"
            aria-selected={t.id === value}
            aria-controls={idPrefix + '-panel-' + t.id}
            tabIndex={t.id === value ? 0 : -1}
            onClick={() => onChange(t.id)}
          >
            {numbered ? <span className="sw-tab__idx">{String(i + 1).padStart(2, '0')}</span> : null}
            <span>{t.label}</span>
            {t.count != null ? <span className="sw-tab__count">{t.count}</span> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
