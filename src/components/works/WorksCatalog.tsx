import { useEffect, useMemo, useState } from 'react';
import { t, type Lang } from '@/i18n';
import type { CardVM } from '@/lib/vm';
import { ProjectCard } from '@/components/ProjectCard';
import { SectionHead, Tag } from '@/components/ds/Display';
import { Button } from '@/components/ds/Button';
import { Input, Select } from '@/components/ds/Forms';

type Props = {
  lang: Lang;
  projects: CardVM[];
  categories: { id: string; label: string }[];
  technologies: { id: string; label: string }[];
  intro: string;
};
type Filters = { q: string; cat: string; tech: string };
const EMPTY: Filters = { q: '', cat: 'all', tech: 'all' };

const norm = (s: string) => s.toLowerCase().replace(/ё/g, 'е');
const match = (p: CardVM, f: Filters) =>
  (f.cat === 'all' || p.category === f.cat) &&
  (f.tech === 'all' || p.tech.includes(f.tech)) &&
  (!f.q.trim() || norm(p.search).includes(norm(f.q.trim())));

/* Каталог: поиск, категория и технология. Фильтры живут в адресе (?q=&cat=&tech=), ссылкой можно поделиться. */
export default function WorksCatalog({ lang, projects, categories, technologies, intro }: Props) {
  const T = t(lang).works;
  const [f, setF] = useState<Filters>(EMPTY);

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setF({ q: p.get('q') || '', cat: p.get('cat') || 'all', tech: p.get('tech') || 'all' });
  }, []);

  const patch = (ch: Partial<Filters>) => {
    const next = { ...f, ...ch };
    setF(next);
    const p = new URLSearchParams();
    if (next.q) p.set('q', next.q);
    if (next.cat !== 'all') p.set('cat', next.cat);
    if (next.tech !== 'all') p.set('tech', next.tech);
    const qs = p.toString();
    history.replaceState(null, '', location.pathname + (qs ? '?' + qs : ''));
  };

  const list = useMemo(() => projects.filter((p) => match(p, f)), [projects, f]);
  const withoutCat = useMemo(() => projects.filter((p) => match(p, { ...f, cat: 'all' })), [projects, f]);
  const cats = [{ id: 'all', label: T.all }, ...categories].map((c) => ({
    ...c, n: c.id === 'all' ? withoutCat.length : withoutCat.filter((p) => p.category === c.id).length,
  }));
  const hasFilters = !!f.q || f.cat !== 'all' || f.tech !== 'all';
  const n = list.length;

  return (
    <>
      <SectionHead index={T.idx} title={T.title} meta={T.meta(n, projects.length)} />
      <p style={{ marginTop: 20, maxWidth: '64ch', color: 'var(--fg-2)', fontSize: 15 }}>{intro}</p>
      <div role="search" aria-label={T.filtersAria} style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '32px 0 24px', padding: '20px 0', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
          <div style={{ flex: '2 1 260px' }}>
            <Input label={T.search} icon="search" type="search" placeholder={T.searchPh} value={f.q} onChange={(e) => patch({ q: e.target.value })} />
          </div>
          <div style={{ flex: '1 1 170px' }}>
            <Select label={T.tech} value={f.tech} onChange={(e) => patch({ tech: e.target.value })}
              options={[{ value: 'all', label: T.allTech }, ...technologies.map((x) => ({ value: x.id, label: x.label }))]} />
          </div>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
          <div role="group" aria-label={T.category} style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {cats.map((c) => <Tag key={c.id} selected={f.cat === c.id} onClick={() => patch({ cat: c.id })}>{c.label} · {c.n}</Tag>)}
          </div>
          {hasFilters ? <Button variant="ghost" size="sm" iconStart="close" onClick={() => patch(EMPTY)}>{T.reset}</Button> : null}
        </div>
      </div>

      <p className="sw-label" aria-live="polite" style={{ marginBottom: 16 }}>{hasFilters ? T.found(n) : T.showingAll(n)}</p>

      {n === 0 ? (
        <div style={{ padding: '64px 24px', border: '1px dashed var(--line)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, textAlign: 'center' }}>
          <span className="sw-label">{T.empty}</span>
          <Button variant="secondary" size="sm" iconStart="reload" onClick={() => patch(EMPTY)}>{T.reset}</Button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,320px),1fr))', gap: 'var(--grid-gutter)' }}>
          {list.map((p, i) => (
            <div key={p.id} data-reveal={Math.min(i, 8) * 50} style={{ display: 'flex' }}><ProjectCard p={p} lang={lang} /></div>
          ))}
        </div>
      )}
    </>
  );
}
