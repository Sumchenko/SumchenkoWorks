import { useEffect, useState, type CSSProperties } from 'react';

export type IsoNode = { id: string; label: string; sub?: string; x: number; y: number; w: number; d: number; h: number };
export type IsoLink = [string, string];

const C30 = Math.cos(Math.PI / 6), S30 = 0.5;
const reduced = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Props = {
  nodes: IsoNode[];
  links: IsoLink[];
  unit?: number;
  animate?: boolean;
  grid?: boolean;
  labels?: boolean;
  highlight?: string | null;
  onNodeHover?: (id: string | null) => void;
  label?: string;
  className?: string;
  style?: CSSProperties;
};

/* Изометрическая схема компонентов: коробки на точечной сетке, пунктирные связи, подписи-выноски. */
export function IsoDiagram({ nodes, links, unit = 28, animate = true, grid = true, labels = true, highlight, onNodeHover, label = 'Architecture diagram', className = '', style }: Props) {
  const [drawn, setDrawn] = useState(!animate);
  const [hover, setHover] = useState<string | null>(null);
  useEffect(() => {
    if (!animate || reduced()) { setDrawn(true); return; }
    setDrawn(false);
    const t = setTimeout(() => setDrawn(true), 40);
    return () => clearTimeout(t);
  }, [animate]);

  const P = (x: number, y: number, z: number) => [(x - y) * C30 * unit, (x + y) * S30 * unit - z * unit];
  const pts = (arr: number[][]) => arr.map((p) => P(p[0], p[1], p[2]).map((v) => v.toFixed(1)).join(',')).join(' ');
  const byId: Record<string, IsoNode> = {};
  nodes.forEach((n) => { byId[n.id] = n; });

  let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
  const grow = (p: number[]) => { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]); };
  let gx = 0, gy = 0;
  nodes.forEach((n) => {
    gx = Math.max(gx, n.x + n.w); gy = Math.max(gy, n.y + n.d);
    [[n.x, n.y, 0], [n.x + n.w, n.y, 0], [n.x, n.y + n.d, 0], [n.x + n.w, n.y + n.d, 0], [n.x, n.y, labels ? n.h + 1.6 : n.h]].forEach((p) => grow(P(p[0], p[1], p[2])));
  });
  gx += 1; gy += 1;
  [[-1, -1], [gx, -1], [-1, gy], [gx, gy]].forEach((p) => grow(P(p[0], p[1], 0)));
  const pad = 12;
  const vb = [minX - pad, minY - pad, maxX - minX + pad * 2, maxY - minY + pad * 2].map((v) => +v.toFixed(1));
  const order = nodes.slice().sort((a, b) => a.x + a.y - (b.x + b.y));
  const step = 110;
  const T = (i: number, extra = 0) => (drawn
    ? `stroke-dashoffset var(--dur-draw) var(--ease-in-out) ${i * step + extra}ms, fill-opacity var(--dur-slow) linear ${i * step + 500}ms, opacity var(--dur-slow) linear ${i * step + extra}ms`
    : 'none');

  const dots = [];
  if (grid) for (let i = -1; i <= gx; i++) for (let j = -1; j <= gy; j++) {
    const p = P(i, j, 0);
    dots.push(<rect key={i + '_' + j} x={+(p[0] - 0.75).toFixed(1)} y={+(p[1] - 0.75).toFixed(1)} width="1.5" height="1.5" fill="var(--fg-3)" />);
  }
  const hot = highlight || hover;
  const setH = (id: string | null) => { setHover(id); onNodeHover?.(id); };

  return (
    <svg className={className} viewBox={vb.join(' ')} width="100%" role="img" aria-label={label}
      style={{ display: 'block', overflow: 'visible', fontFamily: 'var(--font-mono)', ...style }}>
      <g style={{ opacity: drawn ? 1 : 0, transition: drawn ? 'opacity 400ms linear' : 'none' }}>{dots}</g>
      {links.map((l, i) => {
        const a = byId[l[0]], b = byId[l[1]];
        if (!a || !b) return null;
        const ax = a.x + a.w / 2, ay = a.y + a.d / 2, bx = b.x + b.w / 2, by = b.y + b.d / 2;
        const on = hot && (l[0] === hot || l[1] === hot);
        return (
          <polyline key={'l' + i} points={pts([[ax, ay, 0], [bx, ay, 0], [bx, by, 0]])} fill="none"
            stroke={on ? 'var(--fg)' : 'var(--fg-3)'} strokeWidth="1" strokeDasharray="3 3"
            style={{ opacity: drawn ? 1 : 0, transition: T(i + 1, 300) + ', stroke 140ms' }} />
        );
      })}
      {order.map((n, i) => {
        const x0 = n.x, y0 = n.y, x1 = n.x + n.w, y1 = n.y + n.d, h = n.h;
        const top = [[x0, y0, h], [x1, y0, h], [x1, y1, h], [x0, y1, h]];
        const right = [[x1, y0, 0], [x1, y1, 0], [x1, y1, h], [x1, y0, h]];
        const front = [[x0, y1, 0], [x1, y1, 0], [x1, y1, h], [x0, y1, h]];
        const on = hot === n.id;
        const face = (p: number[][], fill: string, k: string) => (
          <polygon key={k} points={pts(p)} pathLength={1} fill={fill} fillOpacity={drawn ? 1 : 0} stroke="var(--fg)"
            strokeWidth={on ? 1.5 : 1} strokeLinejoin="miter" strokeDasharray="1" strokeDashoffset={drawn ? 0 : 1} style={{ transition: T(i) }} />
        );
        return (
          <g key={n.id} onPointerEnter={onNodeHover ? () => setH(n.id) : undefined} onPointerLeave={onNodeHover ? () => setH(null) : undefined}
            style={{ cursor: onNodeHover ? 'pointer' : 'default' }}>
            {face(front, on ? 'var(--fg)' : 'var(--bg)', 'f')}
            {face(right, 'var(--surface-2)', 'r')}
            {face(top, 'var(--surface)', 't')}
          </g>
        );
      })}
      {labels && order.map((n, i) => {
        const lp = P(n.x + n.w / 2, n.y + n.d / 2, n.h);
        const ty = lp[1] - unit * 1.1;
        return (
          <g key={'lab' + n.id} pointerEvents="none" style={{ paintOrder: 'stroke' }}>
            <g style={{ opacity: drawn ? 1 : 0, transition: T(i, 600) }}>
              <line x1={lp[0]} y1={lp[1]} x2={lp[0]} y2={ty} stroke="var(--fg)" strokeWidth="1" />
              <rect x={lp[0] - 1.5} y={lp[1] - 1.5} width="3" height="3" fill="var(--fg)" />
              <text stroke="var(--bg)" strokeWidth="3" strokeLinejoin="round" x={lp[0] + 6} y={ty + 3} fontSize="10" letterSpacing="0.06em" fill="var(--fg)">{n.label}</text>
              {n.sub ? <text stroke="var(--bg)" strokeWidth="3" strokeLinejoin="round" x={lp[0] + 6} y={ty + 15} fontSize="9" fill="var(--fg-2)">{n.sub}</text> : null}
            </g>
          </g>
        );
      })}
    </svg>
  );
}
