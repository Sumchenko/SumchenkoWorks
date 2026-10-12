import { useState } from 'react';
import { t, type Lang } from '@/i18n';
import type { ErdDiagram } from '@/content/schema';

/* ER-модель карточками: наведение на сущность подсвечивает её связи, наведение на связь — две сущности. */
export function ErdView({ diagram, lang }: { diagram: ErdDiagram; lang: Lang }) {
  const T = t(lang).erd;
  const [hot, setHot] = useState<string | null>(null);
  const [rel, setRel] = useState<number | null>(null);
  const leave = () => { setHot(null); setRel(null); };
  const rels = diagram.relations;
  const byId = Object.fromEntries(diagram.entities.map((e) => [e.id, e]));
  let on: Set<string> | null = null;
  if (hot) { on = new Set([hot]); rels.forEach(([a, b]) => { if (a === hot) on!.add(b); if (b === hot) on!.add(a); }); }
  if (rel != null && rels[rel]) on = new Set([rels[rel][0], rels[rel][1]]);

  return (
    <figure style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,210px),1fr))', gap: 16 }}>
        {diagram.entities.map((e) => {
          const isOn = !!on?.has(e.id), isHot = hot === e.id;
          const aria = e.name + ': ' + e.fields.map((f) => f[0] + (f[2] ? ' (' + T.keys[f[2]] + ')' : '')).join(', ');
          return (
            <div key={e.id} tabIndex={0} aria-label={aria}
              onPointerEnter={() => { setHot(e.id); setRel(null); }} onPointerLeave={leave} onFocus={() => { setHot(e.id); setRel(null); }} onBlur={leave}
              style={{ background: 'var(--surface)', border: '1px solid ' + (isOn ? 'var(--line-strong)' : 'var(--line)'), opacity: on && !isOn ? 0.35 : 1, transition: 'opacity 140ms var(--ease-out), border-color 140ms var(--ease-out)', cursor: 'default' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, padding: '10px 12px', borderBottom: '1px solid var(--line)', background: isHot ? 'var(--inverse-bg)' : 'transparent', color: isHot ? 'var(--inverse-fg)' : 'var(--fg)' }}>
                <span className="sw-mono" style={{ fontSize: 12, letterSpacing: '.08em' }}>{e.name}</span>
                <span className="sw-mono" style={{ fontSize: 11, opacity: 0.7 }}>{T.fields(e.fields.length)}</span>
              </div>
              {e.fields.map((f) => (
                <div key={f[0]} style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) auto 28px', gap: 8, padding: '6px 12px', borderBottom: '1px dashed var(--line)', fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.4 }}>
                  <span style={{ overflowWrap: 'anywhere' }}>{f[0]}</span>
                  <span style={{ color: 'var(--fg-2)' }}>{f[1]}</span>
                  <span style={{ color: 'var(--fg)', textAlign: 'right', fontSize: 10, letterSpacing: '.06em' }}>{f[2] || ''}</span>
                </div>
              ))}
            </div>
          );
        })}
      </div>
      <figcaption style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line)' }}>
        <span className="sw-label" style={{ padding: '12px 0 8px' }}>{T.relations(rels.length)}</span>
        {rels.map(([a, b, card], i) => (
          <div key={i} onPointerEnter={() => { setRel(i); setHot(null); }} onPointerLeave={leave}
            style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 88px minmax(0,1fr)', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--line)', fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '.06em',
              opacity: (hot && a !== hot && b !== hot) || (rel != null && rel !== i) ? 0.35 : 1 }}>
            <span style={{ overflowWrap: 'anywhere' }}>{(byId[a] || { name: a }).name}</span>
            <span style={{ textAlign: 'center', color: 'var(--fg-2)' }}>— {card || ''} →</span>
            <span style={{ overflowWrap: 'anywhere' }}>{(byId[b] || { name: b }).name}</span>
          </div>
        ))}
      </figcaption>
    </figure>
  );
}
