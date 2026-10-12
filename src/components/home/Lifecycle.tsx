import { createElement, useEffect, useState } from 'react';
import { pad2, t, type Lang } from '@/i18n';
import type { Site } from '@/content/schema';
import { Button, IconButton } from '@/components/ds/Button';
import { SpecList } from '@/components/ds/Display';

type Props = { lang: Lang; data: Site['lifecycle'] };

/* Схема «от идеи до работающей системы»: canvas-анимация (sw-lifecycle) + панель описания этапа + полоса этапов. */
export default function Lifecycle({ lang, data }: Props) {
  const T = t(lang).lifecycle;
  const ST = data.stages;
  const [sel, setSel] = useState(-1);
  const [hover, setHover] = useState(-1);
  const [run, setRun] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) setPaused(true);
    import('@/scripts/sw-lifecycle.js');
    const on = (e: Event) => {
      const d = (e as CustomEvent).detail || {};
      if (d.type === 'run') { setRun(d.i); setCycle(d.cycle); }
      else if (d.type === 'hover') setHover(d.i);
      else if (d.type === 'select') setSel((s) => (s === d.i ? -1 : d.i));
    };
    window.addEventListener('sw:lc', on);
    return () => window.removeEventListener('sw:lc', on);
  }, []);

  const select = (i: number) => setSel((s) => (s === i ? -1 : i));
  const step = (d: number) => { setSel((s) => (s < 0 ? (d > 0 ? 0 : 5) : (s + d + 6) % 6)); setHover(-1); };
  const shown = hover >= 0 ? hover : sel;
  const s = shown >= 0 ? ST[shown] : null;
  const pv = shown >= 0 ? (shown + 5) % 6 : 0, nx = shown >= 0 ? (shown + 1) % 6 : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px 16px', flexWrap: 'wrap' }}>
        <span className="sw-label">{T.fig}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <span className="sw-label" style={{ color: 'var(--fg)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span aria-hidden="true" style={{ width: 8, height: 8, background: 'var(--fg)', animation: 'sw-lc-blink 1s steps(1) infinite' }} />
            {run < 6 ? T.stage(pad2(run + 1), ST[run].code) : T.closing}
          </span>
          <IconButton icon={paused ? 'play' : 'pause'} label={paused ? T.play : T.pause} pressed={paused} size="sm" variant="bare" onClick={() => setPaused((p) => !p)} />
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--grid-gutter)', alignItems: 'stretch' }}>
        <div className="sw-dotgrid" style={{ flex: '1.9 1 520px', minWidth: 0, border: '1px solid var(--line)', backgroundColor: 'var(--bg)', position: 'relative', minHeight: 280 }}>
          {createElement('sw-lifecycle', { focus: String(shown), paused: paused ? 'true' : 'false', label: T.canvasAria })}
        </div>
        <aside aria-live="polite" style={{ flex: '1 1 280px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 18, borderTop: '1px solid var(--line-strong)', paddingTop: 20 }}>
          <span className="sw-label">{s ? `${pad2(shown + 1)} / 06 · ${s.code}` : T.overviewEyebrow(pad2(cycle + 1))}</span>
          <h3 style={{ margin: 0, fontSize: 'var(--text-h3)', fontWeight: 500, lineHeight: 1.15 }}>{s ? s.name : data.title}</h3>
          <p style={{ margin: 0, color: 'var(--fg-2)', fontSize: 15, lineHeight: 1.6, maxWidth: '46ch' }}>{s ? s.text : data.text}</p>
          {s ? (
            <SpecList items={[
              { label: T.input, value: s.input },
              { label: T.output, value: s.output },
              { label: T.link, value: `← ${pad2(pv + 1)} ${ST[pv].name} · ${pad2(nx + 1)} ${ST[nx].name} →` },
            ]} />
          ) : <span className="sw-mono" style={{ fontSize: 12, color: 'var(--fg-2)' }}>{T.hint}</span>}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginTop: 'auto' }}>
            <IconButton icon="arrow-left" label={T.prev} size="sm" onClick={() => step(-1)} />
            <IconButton icon="arrow-right" label={T.next} size="sm" onClick={() => step(1)} />
            {s ? <Button variant="ghost" size="sm" onClick={() => { setSel(-1); setHover(-1); }}>{T.overview}</Button> : null}
          </div>
        </aside>
      </div>

      <div role="group" aria-label={T.stagesAria} className="lc-strip">
        {ST.map((st, i) => {
          const on = sel === i, hv = hover === i && !on;
          return (
            <button key={st.code} type="button" className="lc-stage" aria-pressed={on} onClick={() => select(i)}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)} onFocus={() => setHover(i)} onBlur={() => setHover(-1)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6, padding: '12px 12px 14px', textAlign: 'left', cursor: 'pointer',
                border: '1px solid ' + (on || hv ? 'var(--fg)' : 'var(--line)'), background: on ? 'var(--inverse-bg)' : 'var(--surface)', color: on ? 'var(--inverse-fg)' : 'var(--fg)',
                font: 'inherit', minHeight: 44,
              }}>
              <span style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <span className="sw-label" style={{ color: 'inherit', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>{pad2(i + 1)} {st.short}</span>
                {run === i ? <span aria-hidden="true" style={{ width: 6, height: 6, background: 'currentColor', animation: 'sw-lc-blink 1s steps(1) infinite' }} /> : null}
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.3 }}>{st.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
