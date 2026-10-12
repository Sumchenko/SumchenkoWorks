import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'solid' | 'outline' | 'subtle' | 'dashed';

export function Badge({ variant = 'solid', dot = false, pulse = false, className = '', children, ...rest }:
  { variant?: BadgeVariant; dot?: boolean; pulse?: boolean } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={('sw-badge ' + className).trim()} data-variant={variant} {...rest}>
      {dot ? <span className="sw-badge__dot" data-pulse={pulse ? 'true' : undefined} /> : null}
      {children}
    </span>
  );
}

export function Tag({ size = 'md', hash = false, selected, onClick, className = '', children, ...rest }:
  { size?: 'sm' | 'md'; hash?: boolean; selected?: boolean; onClick?: () => void } & Omit<HTMLAttributes<HTMLElement>, 'onClick'>) {
  const inner = (
    <>
      {hash ? <span className="sw-tag__hash">#</span> : null}
      <span>{children}</span>
    </>
  );
  if (onClick || selected != null) {
    return (
      <button type="button" className={('sw-tag ' + className).trim()} data-size={size} aria-pressed={selected == null ? undefined : selected} onClick={onClick} {...rest}>
        {inner}
      </button>
    );
  }
  return <span className={('sw-tag ' + className).trim()} data-size={size} {...rest}>{inner}</span>;
}

export function Card({ variant = 'surface', padding = 'md', interactive, ticks, as: Tag = 'div', className = '', children, ...rest }:
  { variant?: 'surface' | 'flat' | 'sunken' | 'inverse'; padding?: 'none' | 'sm' | 'md' | 'lg'; interactive?: boolean; ticks?: boolean; as?: 'div' | 'article' | 'section' } & HTMLAttributes<HTMLElement>) {
  return (
    <Tag
      className={('sw-card ' + className).trim()}
      data-variant={variant}
      data-padding={padding}
      data-interactive={interactive ? 'true' : undefined}
      data-ticks={ticks ? 'always' : undefined}
      {...rest}
    >
      {interactive || ticks ? (
        <>
          <span className="sw-card__tick" data-c="tl" aria-hidden="true" />
          <span className="sw-card__tick" data-c="tr" aria-hidden="true" />
          <span className="sw-card__tick" data-c="bl" aria-hidden="true" />
          <span className="sw-card__tick" data-c="br" aria-hidden="true" />
        </>
      ) : null}
      {children}
    </Tag>
  );
}

export function SpecList({ items = [], dashed = false, className = '' }:
  { items: { label: ReactNode; value: ReactNode }[]; dashed?: boolean; className?: string }) {
  return (
    <dl className={('sw-spec ' + className).trim()} data-dashed={dashed ? 'true' : undefined}>
      {items.map((it, i) => (
        <div key={i} style={{ display: 'contents' }}>
          <dt>{it.label}</dt>
          <dd>{it.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SectionHead({ index, title, meta, size = 'lg', className = '', titleId }:
  { index: ReactNode; title: ReactNode; meta?: ReactNode; size?: 'lg' | 'sm'; className?: string; titleId?: string }) {
  return (
    <div className={('sw-section-head ' + className).trim()} data-size={size}>
      <div className="sw-section-head__idx">{index}</div>
      <div className="sw-section-head__main">
        <h2 className="sw-section-head__title" id={titleId}>{title}</h2>
        {meta ? <div className="sw-section-head__meta">{meta}</div> : null}
      </div>
    </div>
  );
}

const pad3 = (n: number | string) => (typeof n === 'number' ? String(Math.round(n)).padStart(3, '0') : n);

export function Coord({ x = 0, y = 0, children, cross = true, className = '', ...rest }:
  { x?: number; y?: number; cross?: boolean } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={('sw-coord ' + className).trim()} {...rest}>
      {cross ? <span className="sw-coord__cross" aria-hidden="true" /> : null}
      {children != null ? children : <span>X {pad3(x)} · Y {pad3(y)}</span>}
    </span>
  );
}
