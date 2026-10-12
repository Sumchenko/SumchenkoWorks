/* <sw-logo-burst size="240"> — пиксельный знак SW с физикой: пиксели разлетаются от курсора и пружиной собираются обратно.
   Сетка — та же выборка 50×35, что и в PixelLogo дизайн-системы. */
(function () {
  if (customElements.get('sw-logo-burst')) return;
  const GRID = ["00000000000000000000000000000000000000000110000000", "00000000000000000000000000000000000000001111000000", "00000000000000000000000000000000000000011111100000", "00000000000001111111111100000000000000001111000000", "00000000000011111111111100000000000000000110000000", "00000000000111111111111100000000000000000000000000", "00000000001111111111111100000000000110110000000000", "00000000001111110000000000000000100000000000011000", "00000000001111000000000000000100000000000000001100", "00000000001111100000000000100000000000000000000110", "00000000001111111111110000000000000000000000000011", "00000000000111111111111000000000000000000000000011", "00000000000011111111111100000000000000000000000011", "00000000000001111111111110000000000000000000000011", "00000000000000000000011111000000001111000000000011", "00000000000000000000111111000000001111000000000110", "00000000011000000001111111000000001111000000000110", "00000000000000000001111111000000001111000000001100", "00000011000000000001111111000000001111000000001000", "00000100001111111111111100011100001111000000010000", "00000000001111111111111100011100001111000000000000", "00011000001111111111111000111110001111000011000000", "00100000001111111111111001111110001111000010000000", "00100000000000000001111001111111001111010000000000", "01000000000000000001111011111111101111000000000000", "01000000000000000001111111111111111111000000000000", "10000000000000000001111111111111111111000000000000", "10000000000000000001111111110111111111000000000000", "10000000000000000000111111100011111110000000000000", "10000000000000000000011111100011111100000000000000", "01000000000000000000001110000000111000000000000000", "01100000000000000000001110000000111000000000000000", "00111000000000000100000000000000000000000000000000", "00011111111001100000000000000000000000000000000000", "00000111111100000000000000000000000000000000000000"];
  const COLS = 50, ROWS = 35;
  const rnd = (i) => { const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
  const K = 26, DAMP = 6.5, VMAX = 140, OMAX = 16;   // пружина, затухание, пределы (в ячейках)
  const HOVER_R = 4.5, HOVER_F = 110;                 // постоянное отталкивание под курсором

  class SWLogoBurst extends HTMLElement {
    static get observedAttributes() { return ['size']; }
    attributeChangedCallback() { if (this._cv) this.resize(); }
    connectedCallback() {
      if (!this._cv) this.build();
      this._onMove = (e) => this.move(e);
      this._onLeave = () => { this._ptr = null; };
      document.addEventListener('pointermove', this._onMove, { passive: true });
      document.addEventListener('pointerleave', this._onLeave);
      window.addEventListener('blur', this._onLeave);
      this._mo = new MutationObserver(() => this.draw());
      this._mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
      this.resize();
      if (!this._rm) this.wake();
    }
    disconnectedCallback() {
      document.removeEventListener('pointermove', this._onMove);
      document.removeEventListener('pointerleave', this._onLeave);
      window.removeEventListener('blur', this._onLeave);
      this._mo.disconnect(); cancelAnimationFrame(this._raf); this._raf = 0;
    }
    build() {
      this.style.display = 'block';
      this._cv = document.createElement('canvas');
      this._cv.setAttribute('role', 'img'); this._cv.setAttribute('aria-label', 'Sumchenko Works');
      this._cv.style.cssText = 'display:block;pointer-events:none;position:absolute';
      this.append(this._cv);
      this._ctx = this._cv.getContext('2d');
      this._rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      const P = [];
      GRID.forEach((row, r) => { for (let c = 0; c < COLS; c++) if (row[c] === '1') P.push({ r, c, k: P.length }); });
      // сборка при появлении: пиксели разбросаны и стартуют слева направо
      P.forEach((p) => {
        const j1 = rnd(p.k + 1), j2 = rnd(p.k + 7), j3 = rnd(p.k + 13);
        p.ox = this._rm ? 0 : (j1 - 0.5) * 18; p.oy = this._rm ? 0 : (j2 - 0.5) * 12 - 4;
        p.vx = 0; p.vy = 0;
        p.t0 = this._rm ? 0 : (p.c / COLS) * 0.38 + j3 * 0.16;
        p.j = j3;
      });
      this._P = P; this._age = 0; this._ptr = null;
    }
    resize() {
      const size = parseFloat(this.getAttribute('size')) || 120;
      const w = Math.round(size), h = Math.round(size * ROWS / COLS), pad = Math.round(size * 0.35);
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      // холст больше знака, чтобы разлетевшиеся пиксели не обрезались
      this._cv.width = Math.round((w + pad * 2) * dpr); this._cv.height = Math.round((h + pad * 2) * dpr);
      this._cv.style.width = (w + pad * 2) + 'px'; this._cv.style.height = (h + pad * 2) + 'px';
      this._cv.style.left = -pad + 'px'; this._cv.style.top = -pad + 'px';
      this.style.position = 'relative'; this.style.width = w + 'px'; this.style.height = h + 'px';
      this._g = { w, h, pad, dpr, cell: w / COLS };
      this.draw();
    }
    toCells(e) {
      const b = this._cv.getBoundingClientRect(), g = this._g;
      return { x: (e.clientX - b.left - g.pad) / g.cell, y: (e.clientY - b.top - g.pad) / g.cell, t: e.timeStamp || performance.now() };
    }
    move(e) {
      if (this._rm || !this._g) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
      (evs.length ? evs : [e]).forEach((ev) => this.stroke(this.toCells(ev)));
    }
    // импульс вдоль всего отрезка между двумя позициями курсора — быстрые движения не «проскакивают» знак
    stroke(p1) {
      const p0 = this._last && p1.t - this._last.t < 120 ? this._last : p1;
      this._last = p1;
      const near = p1.x > -12 && p1.x < COLS + 12 && p1.y > -12 && p1.y < ROWS + 12;
      const near0 = p0.x > -12 && p0.x < COLS + 12 && p0.y > -12 && p0.y < ROWS + 12;
      this._ptr = near ? p1 : null;
      if (!near && !near0) return;
      const dx = p1.x - p0.x, dy = p1.y - p0.y, L2 = dx * dx + dy * dy, dist = Math.sqrt(L2);
      const dt = Math.max(0.008, (p1.t - p0.t) / 1000), speed = Math.min(600, dist / dt);
      const R = 5 + Math.min(6, speed / 45);
      const mx = dist > 0.01 ? dx / dist : 0, my = dist > 0.01 ? dy / dist : 0;
      let hit = false;
      for (const p of this._P) {
        const cx = p.c + 0.5, cy = p.r + 0.5;
        const t = L2 > 0 ? Math.max(0, Math.min(1, ((cx - p0.x) * dx + (cy - p0.y) * dy) / L2)) : 0;
        const ex = cx - (p0.x + dx * t), ey = cy - (p0.y + dy * t), d = Math.hypot(ex, ey);
        if (d > R) continue;
        const f = 1 - d / R, s = f * f * (16 + speed * 0.2);
        const nx = d > 0.01 ? ex / d : Math.cos(p.j * 6.283), ny = d > 0.01 ? ey / d : Math.sin(p.j * 6.283);
        p.vx += nx * s + mx * s * 0.4 + (p.j - 0.5) * s * 0.35;
        p.vy += ny * s + my * s * 0.4 + (rnd(p.k + 3) - 0.5) * s * 0.35;
        hit = true;
      }
      if (hit || this._ptr) this.wake();
    }
    wake() { if (!this._raf) { this._t = performance.now(); this._raf = requestAnimationFrame(this.tick); } }
    tick = (now) => {
      const dt = Math.min(0.033, (now - this._t) / 1000); this._t = now; this._age += dt;
      let energy = 0; const ptr = this._ptr;
      for (const p of this._P) {
        if (this._age < p.t0) { energy += 1; continue; }
        let ax = -K * p.ox - DAMP * p.vx, ay = -K * p.oy - DAMP * p.vy;
        if (ptr) {
          const ex = p.c + 0.5 - ptr.x, ey = p.r + 0.5 - ptr.y, d = Math.hypot(ex, ey);
          if (d < HOVER_R && d > 0.01) { const f = (1 - d / HOVER_R) * HOVER_F; ax += ex / d * f; ay += ey / d * f; }
        }
        p.vx += ax * dt; p.vy += ay * dt;
        const v = Math.hypot(p.vx, p.vy); if (v > VMAX) { p.vx *= VMAX / v; p.vy *= VMAX / v; }
        p.ox += p.vx * dt; p.oy += p.vy * dt;
        const o = Math.hypot(p.ox, p.oy); if (o > OMAX) { p.ox *= OMAX / o; p.oy *= OMAX / o; }
        energy += Math.abs(p.ox) + Math.abs(p.oy) + Math.abs(p.vx) + Math.abs(p.vy);
      }
      this.draw();
      if (energy < 0.02 * this._P.length && !ptr) {
        this._P.forEach((p) => { p.ox = p.oy = p.vx = p.vy = 0; }); this.draw(); this._raf = 0; return;
      }
      this._raf = requestAnimationFrame(this.tick);
    };
    draw() {
      const g = this._g; if (!g) return;
      const ctx = this._ctx, cell = g.cell;
      ctx.setTransform(g.dpr, 0, 0, g.dpr, 0, 0);
      ctx.clearRect(0, 0, g.w + g.pad * 2, g.h + g.pad * 2);
      ctx.fillStyle = getComputedStyle(this).getPropertyValue('--fg').trim() || '#111';
      const q = (v) => Math.round(v * 2) / 2;   // смещение квантуется по полуячейке — движение остаётся «пиксельным»
      for (const p of this._P) {
        const life = this._age - p.t0;
        if (life < 0) continue;
        ctx.globalAlpha = this._rm ? 1 : Math.min(1, life / 0.25);
        const x = g.pad + (p.c + q(p.ox)) * cell, y = g.pad + (p.r + q(p.oy)) * cell;
        ctx.fillRect(Math.round(x * g.dpr) / g.dpr, Math.round(y * g.dpr) / g.dpr, cell + 0.15, cell + 0.15);
      }
      ctx.globalAlpha = 1;
    }
  }
  customElements.define('sw-logo-burst', SWLogoBurst);
})();

export {};
