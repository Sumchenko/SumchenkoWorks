import { useState } from 'react';
import { pad2, t, type Lang } from '@/i18n';
import type { FlowDiagram } from '@/content/schema';
import { Tag } from '@/components/ds/Display';

/* Процесс шагами: участников можно выбрать фильтром или подсветить наведением на шаг. */
export function FlowView({ diagram, lang }: { diagram: FlowDiagram; lang: Lang }) {
  const T = t(lang).flow;
  const [lane, setLane] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const lanes = [...new Set(diagram.steps.map((s) => s.lane))];
  const active = hover || lane;
  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div role="group" aria-label={T.lanesAria} style={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
        <span className="sw-label" style={{ marginRight: 6 }}>{T.lanes}</span>
        {lanes.map((l) => <Tag key={l} size="sm" selected={lane === l} onClick={() => setLane((x) => (x === l ? null : l))}>{l}</Tag>)}
      </div>
      <ol className="dash-rail" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,150px),1fr))', gap: '28px var(--grid-gutter)' }}>
        {diagram.steps.map((s, i) => (
          <li key={i} onPointerEnter={() => setHover(s.lane)} onPointerLeave={() => setHover(null)}
            style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 24, opacity: active && active !== s.lane ? 0.35 : 1, transition: 'opacity 140ms var(--ease-out)' }}>
            <span aria-hidden="true" style={{ position: 'absolute', top: 0, left: 0, width: 9, height: 9, background: active === s.lane ? 'var(--fg)' : active ? 'var(--bg)' : 'var(--fg)', border: '1px solid var(--fg)' }} />
            <span className="sw-label">{pad2(i + 1)} · {s.lane}</span>
            <span style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.3 }}>{s.title}</span>
            {s.text ? <span style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5 }}>{s.text}</span> : null}
          </li>
        ))}
      </ol>
    </figure>
  );
}
