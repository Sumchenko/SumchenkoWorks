/* <sw-lifecycle focus="-1" paused="false"> — изометрическая сцена «от идеи до работающей системы».
   Canvas 2D, процедурная анимация по часам (не зависит от FPS). Шесть станций по кольцу,
   в центре — ядро: архитектура продукта, которая собирается по мере прохождения этапов.
   События наружу: window 'sw:lc' {type:'run'|'hover'|'select', i, cycle}. */
(function () {
  if (customElements.get('sw-lifecycle')) return;
  const N = 6, D = 3.6, RT = 3.4, CYCLE = N * D + RT;
  const CODES = ['IDEA', 'ANALYSIS', 'ARCHITECTURE', 'AI · DEV', 'TESTS · CI', 'PRODUCT'];
  const TH0 = Math.PI / 4, SWAY = 0.07, SE = Math.sin(Math.PI / 6), CE = Math.cos(Math.PI / 6);
  const c0 = Math.cos(TH0), s0 = Math.sin(TH0), RING = 6;
  const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  const steps = (p, n) => Math.floor(clamp(p) * n) / n;
  const eo = (p) => 1 - Math.pow(1 - clamp(p), 3);
  const UV = (u, v) => [u * c0 + v * s0, -u * s0 + v * c0];
  const PHI = [180, 240, 300, 360, 420, 480];
  const ST = PHI.map((deg, i) => {
    const a = deg * Math.PI / 180, u = Math.cos(a) * RING, v = Math.sin(a) * RING, [x, y] = UV(u, v);
    const w = [2.3, 2.4, 2.4, 2.8, 2.6, 2.9][i];
    return { i, a, u, v, x, y, w, ph: i === 5 ? 0.55 : 0.28, du: Math.cos(a), dv: Math.sin(a) };
  });
  const CORE = { w: 4.6, ph: 0.32 };
  const NODES = [
    { id: 'UI', u: -1.6, v: 0.1, h: 0.55 }, { id: 'API', u: -0.4, v: -0.9, h: 0.85 },
    { id: 'LOGIC', u: 0.4, v: 0.75, h: 0.7 }, { id: 'DB', u: 1.6, v: -0.1, h: 0.6 },
    { id: 'EXT', u: 0.75, v: -1.72, h: 0.5, ext: true },
  ].map((n) => { const [x, y] = UV(n.u, n.v); return { ...n, x, y }; });
  const NEDGES = [[0, 1], [1, 2], [2, 3], [1, 4]];
  const CHECK = ['.....#', '....#.', '#..#..', '.##...'];
  const CROSS = ['#...#', '.#.#.', '..#..', '.#.#.', '#...#'];
  const ringPt = (deg, r = RING) => { const a = deg * Math.PI / 180; return UV(Math.cos(a) * r, Math.sin(a) * r); };

  class SWLifecycle extends HTMLElement {
    static get observedAttributes() { return ['focus', 'paused']; }
    attributeChangedCallback(n) {
      if (n === 'focus') { const v = parseInt(this.getAttribute('focus'), 10); this._focus = isNaN(v) || v < 0 ? -1 : v; }
      if (n === 'paused') this._paused = this.getAttribute('paused') === 'true';
      if (this._cv) { this.kick(); this.draw(); }
    }
    connectedCallback() {
      if (!this._cv) this.build();
      this._ro = new ResizeObserver(() => this.layout()); this._ro.observe(this);
      this._io = new IntersectionObserver(([e]) => { this._visible = e.isIntersecting; this.kick(); }, { rootMargin: '120px' }); this._io.observe(this);
      this._mo = new MutationObserver(() => { this._pal = null; this.draw(); });
      this._mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class', 'style'] });
      this._vis = () => this.kick(); document.addEventListener('visibilitychange', this._vis);
      this.layout(); this.kick();
    }
    disconnectedCallback() {
      this._ro.disconnect(); this._io.disconnect(); this._mo.disconnect();
      document.removeEventListener('visibilitychange', this._vis);
      cancelAnimationFrame(this._raf); this._raf = 0;
    }
    build() {
      this.style.display = 'block'; this.style.position = 'relative';
      const cv = this._cv = document.createElement('canvas');
      cv.setAttribute('role', 'img');
      cv.setAttribute('aria-label', 'Схема цикла разработки: идея, системный анализ, архитектура, разработка с AI-инструментами, тестирование и работающий продукт. В центре собирается архитектура системы.');
      cv.style.cssText = 'display:block;width:100%';
      this.append(cv);
      this._ctx = cv.getContext('2d');
      const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      this._clock = rm ? 21.3 : 15.5;
      if (this._focus === undefined) this._focus = -1;
      this._hover = -1; this._run = -1;
      cv.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') return;
        const i = this.hit(e); cv.style.cursor = i >= 0 ? 'pointer' : 'default';
        if (i !== this._hover) { this._hover = i; this.emit('hover', i); }
      });
      cv.addEventListener('pointerleave', () => { if (this._hover !== -1) { this._hover = -1; this.emit('hover', -1); } });
      cv.addEventListener('click', (e) => { const i = this.hit(e); if (i >= 0) this.emit('select', i); });
    }
    emit(type, i) { window.dispatchEvent(new CustomEvent('sw:lc', { detail: { type, i, cycle: this._k || 0 } })); }
    kick() {
      const run = !this._paused && this._visible && !document.hidden;
      if (run && !this._raf) { this._last = performance.now(); this._raf = requestAnimationFrame(this.tick); }
      if (!run && this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    }
    tick = (now) => {
      this._clock += Math.min(0.08, (now - this._last) / 1000); this._last = now;
      this.draw(); this._raf = requestAnimationFrame(this.tick);
    };

    /* ---------- геометрия ---------- */
    setCam(th) { this._ct = Math.cos(th); this._st = Math.sin(th); }
    P(x, y, z) { const xr = x * this._ct - y * this._st, yr = x * this._st + y * this._ct; return [this._ox + this._S * xr, this._oy + this._S * (yr * SE - z * CE)]; }
    depth(x, y) { return x * this._st + y * this._ct; }
    layout() {
      const W = Math.round(this.clientWidth); if (!W || (this._L && this._L.W === W)) return;
      const lite = W < 440, padX = lite ? 14 : 58, padT = lite ? 14 : 30, padB = lite ? 14 : 26;
      const H = Math.round(clamp(W / 1.42 + 30, 280, 660));
      const pts = [];
      ST.forEach((s) => { [-1, 1].forEach((a) => [-1, 1].forEach((b) => [0, 2.3].forEach((z) => pts.push([s.x + a * s.w / 2, s.y + b * s.w / 2, z])))); });
      [-1, 1].forEach((a) => [-1, 1].forEach((b) => [0, 1.6].forEach((z) => pts.push([a * CORE.w / 2, b * CORE.w / 2, z]))));
      let mnx = 1e9, mxx = -1e9, mny = 1e9, mxy = -1e9;
      [TH0 - SWAY, TH0, TH0 + SWAY].forEach((th) => {
        const ct = Math.cos(th), st = Math.sin(th);
        pts.forEach(([x, y, z]) => { const xr = x * ct - y * st, yr = (x * st + y * ct) * SE - z * CE; mnx = Math.min(mnx, xr); mxx = Math.max(mxx, xr); mny = Math.min(mny, yr); mxy = Math.max(mxy, yr); });
      });
      const S = Math.min((W - 2 * padX) / (mxx - mnx), (H - padT - padB) / (mxy - mny));
      this._S = S; this._ox = W / 2 - S * (mnx + mxx) / 2; this._oy = padT + (H - padT - padB - S * (mxy - mny)) / 2 - S * mny;
      const dpr = Math.min(lite ? 1.5 : 2, window.devicePixelRatio || 1);
      this._cv.width = Math.round(W * dpr); this._cv.height = Math.round(H * dpr); this._cv.style.height = H + 'px';
      this._L = { W, H, dpr, lite };
      this.draw();
    }
    hit(e) {
      if (!this._L) return -1;
      const b = this._cv.getBoundingClientRect(), mx = e.clientX - b.left, my = e.clientY - b.top;
      if (this._labels) for (const l of this._labels) if (mx >= l.x - 4 && mx <= l.x + l.w + 4 && my >= l.y - 4 && my <= l.y + l.h + 4) return l.i;
      const order = ST.slice().sort((a, c) => this.depth(c.x, c.y) - this.depth(a.x, a.y));
      for (const s of order) {
        const h = s.w / 2 + 0.15;
        const q = [[s.x - h, s.y - h], [s.x + h, s.y - h], [s.x + h, s.y + h], [s.x - h, s.y + h]];
        for (let k = 0; k <= 4; k++) {
          const z = k * 0.5, pp = q.map(([x, y]) => this.P(x, y, z));
          if (this.inPoly(mx, my, pp)) return s.i;
        }
      }
      return -1;
    }
    inPoly(x, y, pts) {
      let ins = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins;
      }
      return ins;
    }

    /* ---------- примитивы ---------- */
    pal() {
      if (this._pal && this._palAge++ < 40) return this._pal;
      const cs = getComputedStyle(this), C = (k, d) => cs.getPropertyValue(k).trim() || d;
      this._palAge = 0;
      return (this._pal = {
        fg: C('--fg', '#111'), fg2: C('--fg-2', '#62625F'), fg3: C('--fg-3', '#A3A3A0'), line: C('--line', '#D1D1CD'),
        surface: C('--surface', '#fff'), surface2: C('--surface-2', '#E8E8E5'), bg: C('--bg', '#F7F7F5'),
        inv: C('--inverse-bg', '#111'), invfg: C('--inverse-fg', '#F7F7F5'), mono: C('--font-mono', 'monospace'),
      });
    }
    sty(kind, dim) {
      const p = this._p;
      if (kind === 'ghost') return { ghost: true, edge: dim ? p.line : p.fg3 };
      if (kind === 'draft') return { ghost: true, edge: dim ? p.line : p.fg };
      if (kind === 'ink') return dim ? { top: p.surface2, fx: p.line, fy: p.surface2, edge: p.fg3 } : { top: p.inv, fx: p.fg2, fy: p.fg3, edge: p.fg };
      if (kind === 'plat-on') return { top: p.surface, fx: p.line, fy: p.surface2, edge: p.fg };
      if (kind === 'plat') return { top: p.surface, fx: p.line, fy: p.surface2, edge: dim ? p.line : p.fg3 };
      if (kind === 'plat-ink') return dim ? { top: p.surface2, fx: p.line, fy: p.surface2, edge: p.fg3 } : { top: p.inv, fx: p.fg2, fy: p.fg3, edge: p.fg };
      return { top: p.surface, fx: p.line, fy: p.surface2, edge: dim ? p.line : p.fg };
    }
    poly(pts, fill, stroke, dash) {
      const ctx = this._ctx; ctx.beginPath();
      pts.forEach((q, i) => { const [x, y] = this.P(q[0], q[1], q[2]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.setLineDash(dash ? [3, 3] : []); ctx.stroke(); ctx.setLineDash([]); }
    }
    seg(a, b, col, dash, frac = 1) {
      const ctx = this._ctx, [x0, y0] = this.P(a[0], a[1], a[2]), [x1, y1] = this.P(b[0], b[1], b[2]);
      ctx.strokeStyle = col; ctx.setLineDash(dash ? [3, 3] : []);
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * frac, y0 + (y1 - y0) * frac); ctx.stroke(); ctx.setLineDash([]);
    }
    path(pts, col, dash, frac = 1) {
      const ctx = this._ctx; ctx.strokeStyle = col; ctx.setLineDash(dash ? [3, 4] : []); ctx.beginPath();
      const n = Math.max(1, Math.round((pts.length - 1) * clamp(frac)));
      for (let i = 0; i <= n; i++) { const [x, y] = this.P(pts[i][0], pts[i][1], pts[i][2]); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.stroke(); ctx.setLineDash([]);
    }
    box(cx, cy, z, w, d, h, st) {
      const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - d / 2, y1 = cy + d / 2, z1 = z + Math.max(0.001, h);
      if (st.ghost) {
        const c = [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
        for (let i = 0; i < 4; i++) {
          const a = c[i], b = c[(i + 1) % 4];
          this.seg([a[0], a[1], z1], [b[0], b[1], z1], st.edge, true);
          if (h > 0.01) { this.seg([a[0], a[1], z], [b[0], b[1], z], st.edge, true); this.seg([a[0], a[1], z], [a[0], a[1], z1], st.edge, true); }
        }
        return;
      }
      this.poly([[x1, y0, z], [x1, y1, z], [x1, y1, z1], [x1, y0, z1]], st.fx, st.edge);
      this.poly([[x0, y1, z], [x1, y1, z], [x1, y1, z1], [x0, y1, z1]], st.fy, st.edge);
      this.poly([[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]], st.top, st.edge);
    }
    glyph(pat, x, y, col, s = 2) {
      const ctx = this._ctx; ctx.fillStyle = col;
      const w = pat[0].length * s, h = pat.length * s;
      pat.forEach((r, j) => { for (let i = 0; i < r.length; i++) if (r[i] === '#') ctx.fillRect(Math.round(x - w / 2 + i * s), Math.round(y - h / 2 + j * s), s, s); });
    }
    txt(s, x, y, col, size, align = 'center', base = 'middle') {
      const ctx = this._ctx; ctx.font = size + 'px ' + this._p.mono; ctx.fillStyle = col; ctx.textAlign = align; ctx.textBaseline = base;
      if ('letterSpacing' in ctx) ctx.letterSpacing = (size * 0.08).toFixed(2) + 'px';
      ctx.fillText(s, x, y);
    }
    packet(x, y, z, st, s = 0.17) { this.box(x, y, z, s, s, s, st); }
    inFoot(x, y) {
      if (Math.abs(x) < CORE.w / 2 + 0.1 && Math.abs(y) < CORE.w / 2 + 0.1) return true;
      return ST.some((s) => Math.abs(x - s.x) < s.w / 2 + 0.1 && Math.abs(y - s.y) < s.w / 2 + 0.1);
    }

    /* ---------- кадр ---------- */
    draw() {
      const L = this._L; if (!L) return;
      const ctx = this._ctx, p = (this._p = this.pal());
      const T = this._clock, k = Math.floor(T / CYCLE), t = T - k * CYCLE;
      const run = t < N * D ? Math.floor(t / D) : N, dec = run === N ? (t - N * D) / RT : 0;
      const Lv = (i) => (run === N ? 1 - steps(clamp((dec - (5 - i) * 0.08) / 0.5), 6) : run > i ? 1 : run === i ? (t - i * D) / D : 0);
      const blink = Math.floor(T * 2) % 2 === 0;
      if (run !== this._run || k !== this._k) { this._run = run; this._k = k; this.emit('run', run); }
      const f = this._hover >= 0 ? this._hover : this._focus;
      const dimS = (i) => f >= 0 && f !== i;
      const dimLane = (a, b) => f >= 0 && f !== a && f !== b;
      this.setCam(L.lite ? TH0 : TH0 + SWAY * Math.sin(T * 2 * Math.PI / 38));
      ctx.setTransform(L.dpr, 0, 0, L.dpr, 0, 0); ctx.clearRect(0, 0, L.W, L.H); ctx.lineWidth = 1;
      const lv = ST.map((s) => Lv(s.i));
      const coreDim = f === 0;

      /* земля: кольцо, спицы */
      const ring = []; for (let d = 0; d <= 360; d += 6) { const [x, y] = ringPt(d); ring.push([x, y, 0]); }
      this.path(ring, f >= 0 ? p.line : p.fg3, false);
      ST.forEach((s) => this.seg([s.x, s.y, 0], [0, 0, 0], dimS(s.i) ? p.line : p.fg3, true));

      /* очередь объектов с сортировкой по глубине */
      const items = [];
      const add = (d, fn) => items.push({ d, fn });
      ST.forEach((s) => add(this.depth(s.x, s.y), () => this.station(s, lv[s.i], run === s.i, dimS(s.i), T, lv, run)));
      add(0, () => this.core(lv, run, coreDim, T, f));
      // пакеты по кольцу
      const nR = L.lite ? 9 : 14, base = T * 0.16;
      for (let j = 0; j < nR; j++) {
        const a = (base + j * 2 * Math.PI / nR) % (2 * Math.PI); let deg = a * 180 / Math.PI; if (deg < 180) deg += 360;
        const [x, y] = ringPt(deg); if (this.inFoot(x, y)) continue;
        const into = run < N ? run : 0, from = into === 0 ? 480 : PHI[into - 1], to = into === 0 ? 540 : PHI[into];
        const dd = deg < from ? deg + 360 : deg;
        const hot = dd >= from && dd <= to;
        const seg = ST.findIndex((s, i) => { const lo = i === 0 ? 480 : PHI[i - 1], hi = i === 0 ? 540 : PHI[i]; const q = deg < lo ? deg + 360 : deg; return q >= lo && q <= hi; });
        const dm = f >= 0 && seg !== f && (seg + 5) % 6 !== f;
        add(this.depth(x, y), () => this.packet(x, y, 0, this.sty(hot && !dm ? 'ink' : 'ghost', dm), hot ? 0.2 : 0.15));
      }
      // пакеты по спицам: выход этапа уходит в ядро (продукт — наоборот)
      const spoke = (s, n, out, dm) => {
        for (let j = 0; j < n; j++) {
          let q = (T * 0.55 + j / n) % 1; if (out) q = 1 - q;
          const ru = s.du * (RING - s.w * 0.62), rv = s.dv * (RING - s.w * 0.62), cu = s.du * 2.6, cv = s.dv * 2.6;
          const [x, y] = UV(ru + (cu - ru) * q, rv + (cv - rv) * q);
          add(this.depth(x, y), () => this.packet(x, y, 0, this.sty('ink', dm)));
        }
      };
      if (run < 5 && lv[run] > 0.25 && lv[run] < 0.97) spoke(ST[run], L.lite ? 2 : 3, false, dimS(run));
      if (run === 5 && lv[5] > 0.15) spoke(ST[5], L.lite ? 2 : 3, true, dimS(5));
      if (run === N) spoke(ST[0], 3, true, dimS(0));
      items.sort((a, b) => a.d - b.d).forEach((it) => it.fn());

      /* приподнятые дуги: доработка (тесты → AI) и обратная связь (продукт → идея) */
      const arc = (d0, d1, zb, za, n = 24) => { const out = []; for (let i = 0; i <= n; i++) { const s = i / n, [x, y] = ringPt(d0 + (d1 - d0) * s); out.push([x, y, zb + za * Math.sin(Math.PI * s)]); } return out; };
      const rw = arc(408, 372, 0.35, 1.5), fb = arc(492, 528, 0.35, 1.5);
      const rwOn = run === 4 || f === 3 || f === 4;
      if (rwOn) this.path(rw, dimLane(3, 4) ? p.line : p.fg2, true);
      this.path(fb, dimLane(5, 0) ? p.line : p.fg3, true);
      if (run === 4 && lv[4] > 0.36 && lv[4] < 0.62) {
        const q = steps((lv[4] - 0.36) / 0.26, 18), pt = rw[Math.round(q * (rw.length - 1))];
        this.packet(pt[0], pt[1], pt[2], this.sty('ink', dimLane(3, 4)), 0.22);
        const [sx, sy] = this.P(pt[0], pt[1], pt[2] + 0.45); this.glyph(CROSS, sx, sy, dimLane(3, 4) ? p.fg3 : p.fg);
      }
      if (run === N || run === 0) {
        const n = 3; for (let j = 0; j < n; j++) {
          const q = (T * 0.45 + j / n) % 1, pt = fb[Math.round(q * (fb.length - 1))];
          this.packet(pt[0], pt[1], pt[2], this.sty('ink', dimLane(5, 0)));
        }
      }
      if (!L.lite && run === 4) { const m = rw[12], [sx, sy] = this.P(m[0], m[1], m[2]); this.txt('FIX → RETEST', sx, sy - 12, dimLane(3, 4) ? p.fg3 : p.fg2, 9); }

      /* подписи станций */
      this._labels = [];
      ST.forEach((s) => {
        const top = s.ph, act = run === s.i, foc = f === s.i, dm = dimS(s.i);
        let x, y, align = 'center', base = 'top';
        if (s.dv < -0.3) { [x, y] = this.P(s.x, s.y, top + 2.0); base = 'bottom'; }
        else {
          const ex = s.w * 0.8 + 0.5, [gx, gy] = UV(s.u + s.du * ex, s.v + s.dv * ex);
          [x, y] = this.P(gx, gy, 0);
          if (s.du < -0.3) align = 'right'; else if (s.du > 0.3) align = 'left';
          if (s.dv > 0.3) y += 6; else base = 'middle';
        }
        const label = String(s.i + 1).padStart(2, '0') + (L.lite ? '' : ' ' + CODES[s.i]);
        const size = L.lite ? 10 : 11;
        ctx.font = size + 'px ' + p.mono; if ('letterSpacing' in ctx) ctx.letterSpacing = (size * 0.08).toFixed(2) + 'px';
        const tw = ctx.measureText(label).width, ph = 8, bw = tw + ph * 2, bh = size + 10;
        let bx = align === 'center' ? x - bw / 2 : align === 'right' ? x - bw : x;
        let by = base === 'top' ? y : base === 'bottom' ? y - bh : y - bh / 2;
        bx = clamp(bx, 2, L.W - bw - 2); by = clamp(by, 2, L.H - bh - 2);
        if (act) { ctx.fillStyle = dm ? p.surface2 : p.inv; ctx.fillRect(bx, by, bw, bh); }
        else { ctx.fillStyle = p.bg; ctx.fillRect(bx, by, bw, bh); }
        if (foc) { ctx.strokeStyle = p.fg; ctx.setLineDash([]); ctx.strokeRect(Math.round(bx) - 2.5, Math.round(by) - 2.5, Math.round(bw) + 5, Math.round(bh) + 5); }
        this.txt(label, bx + bw / 2, by + bh / 2 + 1, act ? (dm ? p.fg2 : p.invfg) : dm ? p.fg3 : p.fg, size);
        this._labels.push({ i: s.i, x: bx, y: by, w: bw, h: bh });
      });
    }

    /* ---------- ядро: архитектура продукта ---------- */
    core(lv, run, dim, T, f) {
      const p = this._p, top = CORE.ph;
      this.box(0, 0, 0, CORE.w, CORE.w, CORE.ph, this.sty(f >= 1 ? 'plat-on' : 'plat', dim));
      const built = lv[2] > 0.6, live = lv[5] > 0.35;
      NEDGES.forEach(([a, b], ei) => {
        if (lv[1] <= 0) return;
        const A = NODES[a], B = NODES[b], fr = lv[2] > 0 ? 1 : clamp((lv[1] - 0.35) / 0.55);
        this.seg([A.x, A.y, top], [B.x, B.y, top], dim ? p.line : built ? p.fg2 : p.fg3, !built, fr);
      });
      const order = NODES.map((n, j) => ({ n, j })).sort((a, b) => this.depth(a.n.x, a.n.y) - this.depth(b.n.x, b.n.y));
      // потоки данных по связям — рисуются до узлов, узлы их перекрывают
      if (lv[2] > 0.85) NEDGES.forEach(([a, b], ei) => {
        const A = NODES[a], B = NODES[b], n = live ? 2 : 1;
        for (let j = 0; j < n; j++) {
          const q = (T * (live ? 0.5 : 0.3) + ei * 0.27 + j / n) % 1, x = A.x + (B.x - A.x) * q, y = A.y + (B.y - A.y) * q;
          this.packet(x, y, top, this.sty('ink', dim), 0.14);
        }
      });
      order.forEach(({ n, j }) => {
        const fp = clamp((lv[1] - j * 0.12) / 0.35); if (fp <= 0) return;
        const h = n.h * eo(clamp((lv[2] - j * 0.1) / 0.45));
        const impl = lv[3] > 0.12 + j * 0.14;
        const st = n.ext ? this.sty(h > 0.02 ? 'draft' : 'ghost', dim) : h < 0.02 ? this.sty('ghost', dim) : impl ? this.sty('ink', dim) : this.sty('solid', dim);
        this.box(n.x, n.y, top, 0.76, 0.76, h, st);
        const [sx, sy] = this.P(n.x, n.y, top + h);
        if (!this._L.lite && h > 0.2) this.txt(n.id, sx, sy - 11, dim ? p.fg3 : p.fg2, 9);
        if (lv[4] > 0.15 + j * 0.12 && lv[5] < 0.35 && h > 0.2) {
          const fail = j === 2 && lv[4] < 0.72 && lv[4] > 0.27;
          this.glyph(fail ? CROSS : CHECK, sx, sy - (this._L.lite ? 8 : 24), dim ? p.fg3 : p.fg);
        }
      });
      if (live) {
        const [sx, sy] = this.P(NODES[1].x, NODES[1].y, top + NODES[1].h);
        if (Math.floor(T * 2) % 2 === 0 && !dim) { this._ctx.fillStyle = p.fg; this._ctx.fillRect(Math.round(sx) + 18, Math.round(sy) - 15, 6, 6); }
      }
    }

    /* ---------- станции ---------- */
    station(s, L, act, dim, T, lv, run) {
      const p = this._p, top = s.ph;
      this.box(s.x, s.y, 0, s.w, s.w, s.ph, this.sty(s.i === 5 && L > 0.3 ? 'plat-ink' : act ? 'plat-on' : 'plat', dim));
      const W = (u, v) => { const [dx, dy] = UV(u, v); return [s.x + dx, s.y + dy]; };
      const S = (k) => this.sty(k, dim);
      if (s.i === 0) {
        if (L < 0.35) {
          const a = eo(L / 0.35), bob = Math.sin(T * 2.2) * 0.06, [x, y] = W(s.du * (1 - a) * 1.1, s.dv * (1 - a) * 1.1);
          this.box(x, y, top + 0.3 + bob, 0.5, 0.5, 0.5, L === 0 ? S('ghost') : S('ink'));
        } else {
          for (let j = 0; j < 3; j++) {
            const q = eo((L - 0.35 - j * 0.16) / 0.3); if (q <= 0) continue;
            this.box(s.x, s.y, top + 0.1 + j * 0.34 * q, 1.4, 1.0, 0.07, j === 2 ? S('ink') : S('solid'));
          }
        }
      } else if (s.i === 1) {
        const sat = [[0, -0.85], [-0.85, 0.2], [0.85, 0.2]].map(([u, v]) => W(u, v));
        sat.forEach(([x, y], j) => { const q = clamp((L - 0.3 - j * 0.08) / 0.3); if (q > 0) this.seg([x, y, top], [s.x, s.y, top], dim ? p.line : p.fg2, false, q); });
        const back = sat[0], front = sat.slice(1);
        const satBox = ([x, y], j) => this.box(x, y, top, 0.3, 0.3, 0.3, L > 0.1 + j * 0.1 ? S('ink') : S('ghost'));
        satBox(back, 0);
        this.box(s.x, s.y, top, 0.72, 0.72, 0.6, L > 0 ? S('solid') : S('ghost'));
        front.forEach((pt, j) => satBox(pt, j + 1));
        if (L > 0.55) {
          const q = eo((L - 0.55) / 0.3), z = top + 0.95 + q * 0.2 + Math.sin(T * 1.6) * 0.04;
          this.box(s.x, s.y, z, 1.25, 1.25, 0.04, q > 0.6 ? S('solid') : S('draft'));
          const zt = z + 0.04, m = [[-0.32, -0.3], [0.3, -0.3], [0, 0.3]].map(([a, b]) => [s.x + a, s.y + b]);
          m.forEach(([x, y]) => this.poly([[x - 0.14, y - 0.1, zt], [x + 0.14, y - 0.1, zt], [x + 0.14, y + 0.1, zt], [x - 0.14, y + 0.1, zt]], null, dim ? p.line : p.fg));
          this.seg([m[0][0] + 0.14, m[0][1], zt], [m[1][0] - 0.14, m[1][1], zt], dim ? p.line : p.fg, false, q);
          this.seg([m[0][0], m[0][1] + 0.1, zt], [m[2][0], m[2][1] - 0.1, zt], dim ? p.line : p.fg, false, q);
        }
      } else if (s.i === 2) {
        const sz = [1.8, 1.3, 0.8];
        sz.forEach((w, j) => {
          const q = eo((L - j * 0.25) / 0.3), z = top + 0.04 + j * 0.3 + (1 - q) * 0.5;
          if (q <= 0) { this.box(s.x, s.y, top + 0.04 + j * 0.3, w, w, 0.12, S('ghost')); return; }
          this.box(s.x, s.y, z, w, w, 0.12, j === 2 && L >= 1 ? S('ink') : S('solid'));
        });
      } else if (s.i === 3) {
        const [tx, ty] = W(0, -0.85), [ax, ay] = W(0, 0), [rx, ry] = W(0, 0.85);
        const used = act ? Math.floor(clamp(L * 1.6) * 3) : 0;
        for (let j = 0; j < 3 - Math.min(2, used); j++) this.box(tx, ty, top + j * 0.08, 0.6, 0.6, 0.06, S('solid'));
        const fixing = run === 4 && lv[4] > 0.45 && lv[4] < 0.66;
        this.box(ax, ay, top + 0.05, 0.8, 0.8, 0.8, S(act || fixing ? 'draft' : 'ghost'));
        const gen = (act || fixing) && Math.floor(T * 4) % 2 === 0;
        this.box(ax, ay, top + 0.3, 0.3, 0.3, 0.3, S(gen ? 'ink' : 'solid'));
        // ворота ревью: две стойки и перекладина вдоль мировой оси x
        const gw = 0.9;
        this.box(rx - gw / 2, ry, top, 0.1, 0.1, 0.75, S('solid'));
        // черновики: TASK → AI (черновик) → REVIEW (принятый модуль)
        if (act) for (let j = 0; j < 3; j++) {
          const q = clamp(L * 1.5 - j * 0.25); if (q <= 0 || q >= 1) continue;
          let u = 0, v, z, k;
          if (q < 0.33) { v = -0.85 + (q / 0.33) * 0.85; z = top + 0.15 + Math.sin(q / 0.33 * Math.PI) * 0.5; k = 'ghost'; }
          else if (q < 0.7) { const r = (q - 0.33) / 0.37; v = r * 0.85; z = top + 0.15; k = r < 0.85 ? 'draft' : 'ink'; }
          else { const r = (q - 0.7) / 0.3; v = 0.85 + r * 0.9; z = top + 0.15; k = 'ink'; }
          const [x, y] = W(u, v); this.box(x, y, z, 0.28, 0.28, 0.28, S(k));
        }
        this.box(rx + gw / 2, ry, top, 0.1, 0.1, 0.75, S('solid'));
        this.box(rx, ry, top + 0.75, gw + 0.1, 0.1, 0.1, S('solid'));
        if (!this._L.lite && (act || this._focus === 3 || this._hover === 3)) {
          const [px1, py1] = this.P(ax, ay, top + 1.35); this.txt('TASK → AI → REVIEW', px1, py1 - 6, dim ? p.fg3 : p.fg, 9);
        }
      } else if (s.i === 4) {
        const gw = 1.5;
        this.box(s.x, s.y - gw / 2, top, 0.12, 0.12, 0.9, S('solid'));
        const comps = [-0.42, 0, 0.42];
        const ph = [[0, 0.3], [0.2, 0.3], [0.42, 0.28]];
        comps.forEach((off, j) => {
          let q = clamp((L - ph[j][0]) / ph[j][1]), y, k = 'solid', mark = null;
          if (j === 1) {
            if (L < 0.36) { q = clamp((L - 0.2) / 0.16) * 0.5; }
            else if (L < 0.62) { q = -1; }
            else { q = 0.5 + clamp((L - 0.62) / 0.3) * 0.5; }
            if (L >= 0.31 && L < 0.36) mark = CROSS;
          }
          if (L === 0 && !act) { this.box(s.x - 0.75, s.y + off * 0.9, top, 0.32, 0.32, 0.32, S('ghost')); return; }
          if (q < 0) return;
          const yy = -0.95 + q * 1.9; if (q > 0.55) { k = 'ink'; mark = mark || CHECK; }
          const [x, yv] = [s.x + yy, s.y + off * 0.9];
          this.box(x, yv, top, 0.32, 0.32, 0.32, S(k));
          if (mark && (act || L >= 1) && !this._L.lite) { const [sx, sy] = this.P(x, yv, top + 0.32); this.glyph(mark, sx, sy - 10, dim ? p.fg3 : p.fg); }
        });
        this.box(s.x, s.y + gw / 2, top, 0.12, 0.12, 0.9, S('solid'));
        this.box(s.x, s.y, top + 0.9, 0.14, gw + 0.12, 0.12, S('solid'));
        if (act) { const sc = steps((T * 1.3) % 1, 8); this.seg([s.x, s.y - gw / 2, top + 0.1 + sc * 0.75], [s.x, s.y + gw / 2, top + 0.1 + sc * 0.75], dim ? p.line : p.fg); }
        if (!this._L.lite && (act || this._focus === 4 || this._hover === 4)) {
          const ok = Math.min(3, (L > 0.3) + (L > 0.7) + (L > 0.92)), [sx, sy] = this.P(s.x, s.y, top + 1.05);
          this.txt('CI · ' + ok + '/3 PASSED', sx, sy - 10, dim ? p.fg3 : p.fg, 9);
        }
      } else if (s.i === 5) {
        const lineC = !dim && L > 0.3 ? p.invfg : p.fg3;
        const [ax, ay] = W(-0.75, 0.55), [dx, dy] = W(0.75, 0.55), [wx, wy] = W(0, -0.35);
        const qa = eo(clamp(L / 0.25)), qd = eo(clamp((L - 0.1) / 0.25)), qw = eo(clamp((L - 0.3) / 0.35));
        if (L > 0.6) {
          this.seg([ax, ay, top], [wx, wy, top], lineC, false); this.seg([dx, dy, top], [wx, wy, top], lineC, false);
          for (let j = 0; j < 2; j++) { const q = (T * 0.6 + j * 0.5) % 1, src = j ? [dx, dy] : [ax, ay]; const x = src[0] + (wx - src[0]) * q, y = src[1] + (wy - src[1]) * q; this._ctx.fillStyle = lineC; const [sx, sy] = this.P(x, y, top); this._ctx.fillRect(Math.round(sx) - 2, Math.round(sy) - 2, 4, 4); }
        }
        const wh = 1.15 * qw;
        if (L <= 0.3) this.box(wx, wy, top, 1.7, 0.1, 1.15, S('ghost'));
        else {
          this.box(wx, wy, top, 1.7, 0.1, wh, S('solid'));
          const yF = wy + 0.05, x0 = wx - 0.85, z1 = top + wh;
          const ui = clamp((L - 0.6) / 0.3);
          if (ui > 0 && wh > 0.9) {
            const lc = dim ? p.line : p.fg, F = (a, b, c, d) => this.poly([[x0 + a, yF, z1 - c], [x0 + b, yF, z1 - c], [x0 + b, yF, z1 - d], [x0 + a, yF, z1 - d]], dim ? p.surface2 : p.inv);
            this.seg([x0, yF, z1 - 0.2], [x0 + 1.7, yF, z1 - 0.2], lc, false, ui);
            if (ui > 0.3) F(0.12, 0.62, 0.32, 0.9);
            if (ui > 0.6) { F(0.74, 1.58, 0.32, 0.5); F(0.74, 1.3, 0.6, 0.72); }
            if (ui > 0.85) F(0.74, 1.1, 0.8, 0.9);
            if (L > 0.92 && Math.floor(T * 2) % 2 === 0) F(1.48, 1.58, 0.06, 0.14);
          }
        }
        this.box(ax, ay, top + (1 - qa) * 1.2, 0.42, 0.42, 0.42, L > 0 ? S('solid') : S('ghost'));
        this.box(dx, dy, top + (1 - qd) * 1.2, 0.46, 0.46, 0.5, L > 0.1 ? S('solid') : S('ghost'));
        if (L > 0.1) { const zz = top + (1 - qd) * 1.2; this.seg([dx - 0.23, dy + 0.23, zz + 0.17], [dx + 0.23, dy + 0.23, zz + 0.17], dim ? p.line : p.fg3, false); this.seg([dx + 0.23, dy - 0.23, zz + 0.17], [dx + 0.23, dy + 0.23, zz + 0.17], dim ? p.line : p.fg3, false); }
        if (!this._L.lite && L > 0.6) {
          const [sx, sy] = this.P(ax, ay, top + 0.42); this.txt('API', sx, sy - 10, dim ? p.fg3 : p.fg2, 9);
          const [tx, ty] = this.P(dx, dy, top + 0.5); this.txt('DB', tx, ty - 10, dim ? p.fg3 : p.fg2, 9);
        }
      }
    }
  }
  customElements.define('sw-lifecycle', SWLifecycle);
})();
