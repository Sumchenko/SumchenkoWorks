import { t, type Lang } from '@/i18n';
import type { CardVM } from '@/lib/vm';
import { Badge, Card, Tag } from './ds/Display';
import { Button } from './ds/Button';
import { IsoDiagram } from './ds/IsoDiagram';

export function ProjectCard({ p, lang }: { p: CardVM; lang: Lang }) {
  const T = t(lang).card;
  return (
    <Card as="article" interactive style={{ flex: 1, width: '100%', gap: 18, height: '100%' }}>
      <div aria-hidden="true" style={{ height: 180, margin: '-24px -24px 0', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 24px', background: 'var(--bg)' }}>
        <IsoDiagram nodes={p.coverNodes} links={p.coverLinks} unit={16} animate={false} labels={false} style={{ maxHeight: 148 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span className="sw-label">{p.code} · {p.year} · {p.categoryLabel}</span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {p.demo ? <Badge variant="dashed" title={T.demoTitle}>{T.demo}</Badge> : null}
          <Badge variant={p.badge.variant} dot={p.badge.dot} pulse={p.badge.pulse}>{p.badge.label}</Badge>
        </div>
      </div>
      <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: 20, fontWeight: 500, lineHeight: 1.2 }}>
        <a href={p.href} className="card-link">{p.title}</a>
      </h3>
      <p style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5 }}>{p.summary}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 'auto' }}>
        {p.techList.map((x) => <Tag key={x.id} size="sm">{x.label}</Tag>)}
      </div>
      {p.links.length ? (
        <div className="card-actions" style={{ display: 'flex', flexWrap: 'wrap', gap: 4, borderTop: '1px dashed var(--line)', paddingTop: 12, marginTop: -4 }}>
          {p.links.map((l) => (
            <Button key={l.label} variant="ghost" size="sm" href={l.href} iconStart={l.icon}
              target={l.external ? '_blank' : undefined} rel={l.external ? 'noopener noreferrer' : undefined}>{l.label}</Button>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
