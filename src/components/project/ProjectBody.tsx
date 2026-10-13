import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import { t } from '@/i18n';
import type { OverviewRow, ProjectBodyVM } from '@/lib/vm';
import { TabList, type TabItem } from '@/components/ds/Tabs';
import { Coord, Tag } from '@/components/ds/Display';
import { Button } from '@/components/ds/Button';
import { Dialog } from '@/components/ds/Feedback';
import { Icon } from '@/components/ds/Icon';
import { IsoDiagram } from '@/components/ds/IsoDiagram';
import { ErdView } from './ErdView';
import { FlowView } from './FlowView';
import { ArtifactViewer } from './ArtifactViewer';
import { ScreensGallery } from './ScreensGallery';
import { track } from '@/lib/client';

type Tab = 'overview' | 'arch' | 'artifacts';

/*
 * Вкладки проекта. Все панели есть в HTML сразу (видны поисковикам и без JS), неактивные скрыты.
 * Состояние в адресе: ?tab=arch, ?tab=artifacts&doc=<id> — такой ссылкой можно поделиться.
 */
export default function ProjectBody({ vm }: { vm: ProjectBodyVM }) {
  const { lang } = vm;
  const T = t(lang).project;
  const L = t(lang);
  const rootRef = useRef<HTMLDivElement>(null);
  const [tab, setTabState] = useState<Tab>('overview');
  const [doc, setDoc] = useState<string | null>(null);
  const [hot, setHot] = useState<string | null>(null);
  const tabRef = useRef<Tab>('overview');
  tabRef.current = tab;

  const tabs: TabItem[] = [{ id: 'overview', label: T.tabs.overview }];
  if (vm.arch) tabs.push({ id: 'arch', label: T.tabs.arch });
  if (vm.artifacts.length) tabs.push({ id: 'artifacts', label: T.tabs.artifacts, count: vm.artifacts.length });
  const valid = (x: string | null): x is Tab => !!x && tabs.some((tt) => tt.id === x);
  const docA = doc ? vm.artifacts.find((a) => a.id === doc) ?? null : null;

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    const tb = p.get('tab');
    if (valid(tb)) setTabState(tb);
    const d = p.get('doc');
    if (d && vm.artifacts.some((a) => a.id === d)) {
      setTabState(valid(tb) ? tb : vm.screens.some((a) => a.id === d) ? 'overview' : 'artifacts'); setDoc(d);
      // Ссылка сразу на документ: в просмотре страницы адрес без параметров, поэтому документ — отдельным событием
      track(`${vm.slug} / doc / ${d}`, vm.artifacts.find((a) => a.id === d)?.title);
    } else if (valid(tb) && tb !== 'overview') track(`${vm.slug} / tab / ${tb}`, T.tabs[tb]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sync = (nextTab: Tab, nextDoc: string | null) => {
    const p = new URLSearchParams();
    if (nextTab !== 'overview') p.set('tab', nextTab);
    if (nextDoc) p.set('doc', nextDoc);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  };
  const setTab = (id: string) => {
    if (!valid(id)) return;
    if (id !== tab) track(`${vm.slug} / tab / ${id}`, T.tabs[id]);
    setTabState(id); setDoc(null); setHot(null); sync(id, null);
  };
  const scrollToTabs = () => {
    const el = rootRef.current?.querySelector('[role=tablist]');
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72 });
  };
  const openDoc = (id: string) => (e: MouseEvent) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    setDoc(id); sync(tabRef.current, id);
    track(`${vm.slug} / doc / ${id}`, vm.artifacts.find((a) => a.id === id)?.title);
  };
  // Окно открывается поверх текущей вкладки (из «Обзора» — экраны, из «Артефактов» — любой), вкладка не меняется
  const closeDoc = useCallback(() => { setDoc(null); sync(tabRef.current, null); }, []);

  const panel = (id: Tab) => ({ id: 'pb-panel-' + id, role: 'tabpanel', 'aria-labelledby': 'pb-tab-' + id, hidden: tab !== id });
  const A = vm.arch;

  return (
    <div ref={rootRef}>
      <TabList items={tabs} value={tab} onChange={setTab} numbered label={T.tabsAria} idPrefix="pb" />

      {/* ---------- Обзор ---------- */}
      <div {...panel('overview')} style={{ display: tab === 'overview' ? 'flex' : 'none', flexDirection: 'column', paddingTop: 16 }}>
        {vm.screens.length ? <ScreensGallery items={vm.screens} lang={lang} slug={vm.slug} /> : null}
        {vm.rows.map((r, i) => <Row key={i} r={r} lang={lang} />)}
        {A || vm.artifacts.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 28 }}>
            {A ? <Button variant="secondary" iconEnd="arrow-right" onClick={() => { setTab('arch'); scrollToTabs(); }}>{T.tabs.arch}</Button> : null}
            {vm.artifacts.length ? <Button variant="ghost" iconEnd="arrow-right" onClick={() => { setTab('artifacts'); scrollToTabs(); }}>{T.artifactsBtn(vm.artifacts.length)}</Button> : null}
          </div>
        ) : null}
      </div>

      {/* ---------- Архитектура ---------- */}
      {A ? (
        <div {...panel('arch')} style={{ display: tab === 'arch' ? 'flex' : 'none', flexDirection: 'column', gap: 64, paddingTop: 40 }}>
          {A.components ? (
            <section aria-labelledby="h-comp" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexWrap: 'wrap' }}><span className="sw-label">§ 2.1</span><h2 id="h-comp" style={{ fontSize: 'var(--text-h2)', fontWeight: 500 }}>{T.components}</h2></div>
              {A.components.text ? <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: '64ch' }}>{A.components.text}</p> : null}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--grid-gutter)', alignItems: 'flex-start' }}>
                <figure style={{ flex: '2 1 460px', margin: 0, minWidth: 0, border: '1px solid var(--line)', background: 'var(--surface)', padding: '48px 24px 40px', position: 'relative' }}>
                  <figcaption className="sw-label" style={{ position: 'absolute', top: 14, left: 16 }}>{T.figComponents(A.components.fig)}</figcaption>
                  <Coord x={0} y={0} style={{ position: 'absolute', bottom: 14, right: 16 }} />
                  <div className="diagram-scroll">
                    <IsoDiagram nodes={A.components.diagram.nodes} links={A.components.diagram.links} unit={28} animate={tab === 'arch'}
                      highlight={hot} onNodeHover={setHot} label={T.diagramAria} style={{ maxHeight: 440 }} />
                  </div>
                </figure>
                <ol aria-label={T.components} style={{ flex: '1 1 240px', listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line)' }}>
                  {A.components.items.map((n) => (
                    <li key={n.id} tabIndex={0} onPointerEnter={() => setHot(n.id)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(n.id)} onBlur={() => setHot(null)}
                      style={{ display: 'grid', gridTemplateColumns: '28px 1fr', gap: 8, padding: '12px 0', borderBottom: '1px solid var(--line)', opacity: hot && hot !== n.id ? 0.35 : 1, transition: 'opacity 140ms var(--ease-out)' }}>
                      <span className="sw-label">{n.idx}</span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span className="sw-mono" style={{ fontSize: 12, letterSpacing: '.06em' }}>{n.label}</span>
                        <span style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.45 }}>{n.note}</span>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ) : null}

          {A.flows.map((f) => (
            <section key={f.idx} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'baseline', flexWrap: 'wrap' }}><span className="sw-label">§ {f.idx}</span><h2 style={{ fontSize: 'var(--text-h2)', fontWeight: 500 }}>{f.title}</h2></div>
              <div style={{ padding: 'clamp(20px,3vw,32px)', border: '1px solid var(--line)', background: 'var(--surface)' }}><FlowView diagram={f.diagram} lang={lang} /></div>
            </section>
          ))}

          {A.erd ? (
            <section aria-labelledby="h-data" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}><span className="sw-label">§ {A.erd.idx}</span><h2 id="h-data" style={{ fontSize: 'var(--text-h2)', fontWeight: 500 }}>{T.dataModel}</h2></div>
              {A.erd.text ? <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: '64ch' }}>{A.erd.text}</p> : null}
              <ErdView diagram={A.erd.diagram} lang={lang} />
            </section>
          ) : null}

          {A.api ? (
            <section aria-labelledby="h-api" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}><span className="sw-label">§ {A.api.idx}</span><h2 id="h-api" style={{ fontSize: 'var(--text-h2)', fontWeight: 500 }}>{T.api}</h2></div>
              {A.api.endpoints.length ? (
                <ul aria-label={T.endpoints} style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--line)' }}>
                  {A.api.endpoints.map((e) => (
                    <li key={e.method + e.path} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                      <span className="sw-mono" style={{ minWidth: 56, textAlign: 'center', fontSize: 11, letterSpacing: '.08em', padding: '3px 6px', border: '1px solid var(--line-strong)',
                        background: e.method === 'GET' ? 'transparent' : 'var(--inverse-bg)', color: e.method === 'GET' ? 'var(--fg)' : 'var(--inverse-fg)' }}>{e.method}</span>
                      <code style={{ fontSize: 13, flex: '1 1 220px', overflowWrap: 'anywhere' }}>{e.path}</code>
                      {e.text ? <span style={{ fontSize: 14, color: 'var(--fg-2)', flex: '1 1 240px' }}>{e.text}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
              {A.api.integrations.length ? (
                <ul aria-label={T.integrations} style={{ listStyle: 'none', margin: 0, padding: 0, borderTop: '1px solid var(--line)' }}>
                  {A.api.integrations.map((x) => (
                    <li key={x.name} style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 24px', padding: '12px 0', borderBottom: '1px solid var(--line)', alignItems: 'baseline' }}>
                      <span className="sw-mono" style={{ flex: '1 1 200px', fontSize: 13 }}>{x.name}</span>
                      {x.protocol ? <span className="sw-label" style={{ flex: '0 0 140px' }}>{x.protocol}</span> : null}
                      {x.text ? <span style={{ flex: '2 1 260px', fontSize: 14, color: 'var(--fg-2)' }}>{x.text}</span> : null}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          {A.decisions ? (
            <section aria-labelledby="h-dec" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'baseline' }}><span className="sw-label">§ {A.decisions.idx}</span><h2 id="h-dec" style={{ fontSize: 'var(--text-h2)', fontWeight: 500 }}>{T.decisions}</h2></div>
              {A.decisions.items.map((d) => (
                <div key={d.idx} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 24px', padding: 24, background: 'var(--surface)', border: '1px solid var(--line)' }}>
                  <div style={{ flex: '1 1 220px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <span className="sw-label">{T.decision(d.idx)}</span>
                    <h3 style={{ fontSize: 'var(--text-h3)', fontWeight: 500, lineHeight: 1.2 }}>{d.title}</h3>
                  </div>
                  <dl style={{ flex: '2 1 320px', margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {([['choice', T.choice, false], ['why', T.why, true], ['pros', T.pros, false], ['cons', T.cons, true], ['alternatives', T.alternatives, true]] as const).map(([k, label, dim]) =>
                      d[k] ? (
                        <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <dt className="sw-label">{label}</dt>
                          <dd style={{ margin: 0, fontSize: 15, color: dim ? 'var(--fg-2)' : undefined }}>{d[k]}</dd>
                        </div>
                      ) : null)}
                  </dl>
                </div>
              ))}
            </section>
          ) : null}
        </div>
      ) : null}

      {/* ---------- Артефакты ---------- */}
      {vm.artifacts.length ? (
        <div {...panel('artifacts')} style={{ display: tab === 'artifacts' ? 'flex' : 'none', flexDirection: 'column', gap: 16, paddingTop: 32 }}>
          <p style={{ fontSize: 15, color: 'var(--fg-2)', maxWidth: '64ch' }}>{T.artifactsIntro}</p>
          <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--line)' }}>
            {vm.artifacts.map((a) => (
              <a key={a.id} href={a.href} onClick={openDoc(a.id)} className="row-link"
                style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px 24px', padding: '16px 12px', borderBottom: '1px solid var(--line)' }}>
                <div style={{ flex: '1 1 320px', display: 'flex', alignItems: 'center', gap: 16, minWidth: 0 }}>
                  <span aria-hidden="true" style={{ width: 40, height: 40, flex: 'none', display: 'grid', placeItems: 'center', border: '1px solid var(--line)' }}><Icon name={a.icon} size={24} /></span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span className="sw-label">{a.code} · {a.typeLabel}</span>
                    <span style={{ fontSize: 16, lineHeight: 1.35 }}>{a.title}</span>
                  </div>
                </div>
                <div style={{ flex: '0 1 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 24px', marginLeft: 56 }}>
                  <span className="sw-label" style={{ minWidth: 64 }}>{vm.code}</span>
                  <span className="sw-label" style={{ minWidth: 140 }}>{a.metaLine}</span>
                  <span aria-hidden="true" className="arrow-box"><Icon name="arrow-right" size={16} /></span>
                </div>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      <Dialog open={!!docA} onClose={closeDoc} label={docA ? T.artifactLabel(docA.code) : ''} title={docA?.title} closeLabel={L.close} width={1040}>
        {docA ? <ArtifactViewer a={docA} lang={lang} /> : null}
      </Dialog>
    </div>
  );
}

/* Строка вкладки «Обзор»: заголовок слева, содержимое справа. */
function Row({ r, lang }: { r: OverviewRow; lang: ProjectBodyVM['lang'] }) {
  const T = t(lang).project;
  return (
    <section data-reveal="0" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px var(--grid-gutter)', padding: '28px 0', borderBottom: '1px solid var(--line)' }}>
      <h2 style={{ flex: '0 0 220px', fontSize: 20, fontWeight: 500, lineHeight: 1.25 }}>{r.title}</h2>
      <div style={{ flex: '1 1 480px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {r.kind === 'text' ? (
          <>
            <p style={{ fontSize: 17, lineHeight: 1.65, maxWidth: '64ch' }}>{r.text}</p>
            {r.sub ? <p style={{ fontSize: 15, lineHeight: 1.6, maxWidth: '64ch', color: 'var(--fg-2)' }}>{r.sub}</p> : null}
          </>
        ) : null}
        {r.kind === 'list' ? (
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', maxWidth: '64ch' }}>
            {r.items.map((i) => (
              <li key={i.idx} style={{ display: 'grid', gridTemplateColumns: '32px 1fr', gap: 8, padding: '8px 0', borderTop: '1px dashed var(--line)', fontSize: 16 }}>
                <span className="sw-mono" style={{ fontSize: 11, color: 'var(--fg-2)', paddingTop: 4 }}>{i.idx}</span><span>{i.text}</span>
              </li>
            ))}
          </ol>
        ) : null}
        {r.kind === 'chips' ? <div className="chips-wrap" style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{r.items.map((x) => <Tag key={x}>{x}</Tag>)}</div> : null}
        {r.kind === 'stack' ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {r.items.map((x) => <a key={x.href} href={x.href} title={T.techTitle} style={{ textDecoration: 'none' }}><Tag size="sm" hash>{x.text}</Tag></a>)}
          </div>
        ) : null}
        {r.kind === 'reqs' ? (
          <div style={{ overflowX: 'auto' }}>
            <table className="req-table">
              <thead><tr>
                <th scope="col" className="sw-label" style={{ width: 80 }}>{T.reqId}</th>
                <th scope="col" className="sw-label">{T.reqText}</th>
                <th scope="col" className="sw-label" style={{ width: 72, paddingRight: 0 }}>{T.reqPriority}</th>
              </tr></thead>
              <tbody>
                {r.items.map((q) => (
                  <tr key={q.id}>
                    <td className="sw-mono" style={{ fontSize: 12 }}>{q.id}</td>
                    <td style={{ fontSize: 15, lineHeight: 1.45 }}>{q.text}</td>
                    <td className="sw-mono" style={{ fontSize: 12, paddingRight: 0 }}>{q.priority}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {r.kind === 'scenarios' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,280px),1fr))', gap: 'var(--grid-gutter)' }}>
            {r.items.map((s) => (
              <div key={s.title} style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 20, background: 'var(--surface)', border: '1px solid var(--line)' }}>
                {s.actor ? <span className="sw-label">{s.actor}</span> : null}
                <span style={{ fontSize: 17, fontWeight: 500 }}>{s.title}</span>
                <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                  {s.steps.map((st) => (
                    <li key={st.idx} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: 6, padding: '6px 0', borderTop: '1px dashed var(--line)', fontSize: 14, lineHeight: 1.45 }}>
                      <span className="sw-mono" style={{ fontSize: 11, color: 'var(--fg-2)', paddingTop: 2 }}>{st.idx}</span><span>{st.text}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        ) : null}
        {r.kind === 'stages' ? (
          <ol style={{ listStyle: 'none', margin: 0, padding: '0 0 0 20px', display: 'flex', flexDirection: 'column', borderLeft: '1px dashed var(--fg-3)' }}>
            {r.items.map((s) => (
              <li key={s.period + s.title} style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '2px 20px', padding: '0 0 18px' }}>
                <span aria-hidden="true" style={{ position: 'absolute', left: -25, top: 6, width: 9, height: 9, background: 'var(--fg)' }} />
                <span className="sw-label" style={{ flex: '0 0 80px', paddingTop: 3 }}>{s.period}</span>
                <span style={{ flex: '1 1 240px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>{s.title}</span>
                  {s.text ? <span style={{ fontSize: 14, color: 'var(--fg-2)' }}>{s.text}</span> : null}
                </span>
              </li>
            ))}
          </ol>
        ) : null}
        {r.kind === 'challenges' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,260px),1fr))', gap: 'var(--grid-gutter)' }}>
            {r.items.map((c) => (
              <div key={c.title} style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: 18, border: '1px dashed var(--line-strong)' }}>
                <span style={{ fontSize: 16, fontWeight: 500 }}>{c.title}</span>
                <span style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5 }}>{c.text}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
