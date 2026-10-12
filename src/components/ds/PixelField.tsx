import { useEffect, useRef, type CSSProperties } from 'react';

const reduced = () => typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Поле пикселей на canvas: точки «загораются» вокруг курсора и случайно мерцают. */
export function PixelField({ cell = 16, dot = 2, radius = 96, height = 240, flicker = true, className = '', style }:
  { cell?: number; dot?: number; radius?: number; height?: number | string; flicker?: boolean; className?: string; style?: CSSProperties }) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = wrap.current, c = cvs.current;
    if (!el || !c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    let W = 0, H = 0, cols = 0, rows = 0, energy = new Float32Array(0), raf = 0, last = 0, alive = true;
    let ptr: { x: number; y: number } | null = null;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const still = reduced();
    const colors = () => {
      const cs = getComputedStyle(el);
      return { fg: cs.getPropertyValue('--fg').trim() || '#111', dim: cs.getPropertyValue('--fg-3').trim() || '#aaa' };
    };
    let col = colors();
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
        const e = energy[r * cols + q];
        const s = dot + (cell * 0.62 - dot) * e;
        const x = q * cell + (cell - s) / 2, y = r * cell + (cell - s) / 2;
        ctx.globalAlpha = e > 0.02 ? 0.35 + 0.65 * e : 0.55;
        ctx.fillStyle = e > 0.02 ? col.fg : col.dim;
        ctx.fillRect(Math.round(x), Math.round(y), Math.round(s), Math.round(s));
      }
      ctx.globalAlpha = 1;
    };
    const resize = () => {
      W = el.clientWidth; H = el.clientHeight;
      c.width = W * dpr; c.height = H * dpr; c.style.width = W + 'px'; c.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / cell); rows = Math.ceil(H / cell);
      energy = new Float32Array(cols * rows);
      draw();
    };
    const tick = (t: number) => {
      if (!alive) return;
      const dt = Math.min(48, t - (last || t)); last = t;
      let active = false;
      for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
        const i = r * cols + q;
        let target = 0;
        if (ptr) {
          const d = Math.hypot(q * cell + cell / 2 - ptr.x, r * cell + cell / 2 - ptr.y);
          if (d < radius) target = Math.round((1 - d / radius) * 4) / 4;
        }
        const e = energy[i];
        const k = target > e ? 0.35 : 0.06 * (dt / 16);
        energy[i] = e + (target - e) * k;
        if (energy[i] > 0.01) active = true;
      }
      if (flicker && Math.random() < 0.08 && energy.length) {
        const i = (Math.random() * energy.length) | 0;
        energy[i] = Math.max(energy[i], 0.5); active = true;
      }
      draw();
      // мерцание продолжается только пока поле на экране
      raf = active || ptr || (flicker && visible) ? requestAnimationFrame(tick) : 0;
    };
    let visible = true;
    const kick = () => { if (!raf && !still && visible) { last = 0; raf = requestAnimationFrame(tick); } };
    const move = (e: PointerEvent) => { const b = el.getBoundingClientRect(); ptr = { x: e.clientX - b.left, y: e.clientY - b.top }; kick(); };
    const leave = () => { ptr = null; kick(); };
    const ro = new ResizeObserver(resize); ro.observe(el);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && flicker) kick(); });
    io.observe(el);
    const mo = new MutationObserver(() => { col = colors(); draw(); });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    if (!still) { el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave); if (flicker) kick(); }
    resize();
    return () => {
      alive = false; cancelAnimationFrame(raf);
      ro.disconnect(); io.disconnect(); mo.disconnect();
      el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave);
    };
  }, [cell, dot, radius, flicker]);
  return (
    <div ref={wrap} className={className} aria-hidden="true" style={{ position: 'relative', width: '100%', height, overflow: 'hidden', ...style }}>
      <canvas ref={cvs} style={{ position: 'absolute', inset: 0 }} />
    </div>
  );
}
