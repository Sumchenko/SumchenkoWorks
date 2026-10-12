/*
 * Sumchenko Works — слой доступа к данным.
 * Страницы обращаются только к window.SWStore. Чтобы перейти на API или CMS,
 * замените SWStore.source на функцию, возвращающую Promise с объектом той же структуры,
 * что и data/content.js, например: () => fetch('/api/content').then(r => r.json()).
 */
(function () {
  if (window.SWStore) return; // loaded once even if several pages include this script
  const S = {
    status: 'idle', error: null, data: null, _subs: new Set(), _promise: null,
    source: function () {
      return new Promise(function (resolve, reject) {
        let n = 0;
        (function wait() {
          if (window.SW_CONTENT) return resolve(window.SW_CONTENT);
          if (++n > 100) return reject(new Error('Файл data/content.js не загрузился'));
          setTimeout(wait, 30);
        })();
      });
    },
  };

  const by = (arr) => { const m = {}; (arr || []).forEach((x) => { m[x.id] = x; }); return m; };
  const pad = (n, l) => String(n).padStart(l || 2, '0');
  S.pad = pad;
  S.plural = function (n, one, few, many) { const m = n % 10, h = n % 100; return n + ' ' + (m === 1 && h !== 11 ? one : m >= 2 && m <= 4 && (h < 12 || h > 14) ? few : many); };

  S.subscribe = function (fn) { S._subs.add(fn); return () => S._subs.delete(fn); };
  const emit = () => S._subs.forEach((f) => { try { f(S.status); } catch (e) { console.error(e); } });

  S.load = function (force) {
    if (S._promise && !force) return S._promise;
    S.status = 'loading'; S.error = null; emit();
    S._promise = Promise.resolve().then(S.source).then(function (d) {
      validate(d);
      S.data = d;
      S.idx = { cat: by(d.categories), status: by(d.statuses), tech: by(d.technologies), type: by(d.artifactTypes), kind: by(d.archKinds), diagram: by(d.diagrams), project: by(d.projects), arch: by(d.architecture), artifact: by(d.artifacts) };
      S.status = 'ready'; emit(); return d;
    }).catch(function (e) {
      console.error('[SWStore]', e);
      S.status = 'error'; S.error = e; S._promise = null; emit(); throw e;
    });
    return S._promise;
  };

  function validate(d) {
    if (!d || !Array.isArray(d.projects)) throw new Error('Некорректная структура контента');
    const ids = new Set(d.projects.map((p) => p.id));
    const dg = new Set((d.diagrams || []).map((x) => x.id));
    (d.projects || []).forEach((p) => {
      (p.related || []).forEach((r) => { if (!ids.has(r)) console.warn('[SWStore] неизвестный связанный проект', p.id, '→', r); });
      if (p.cover && !dg.has(p.cover)) console.warn('[SWStore] неизвестная диаграмма', p.cover);
    });
    (d.artifacts || []).forEach((a) => { if (a.project && !ids.has(a.project)) console.warn('[SWStore] артефакт без проекта', a.id); });
  }

  /* ---------- lookups ---------- */
  S.project = (id) => S.idx.project[id] || null;
  S.arch = (id) => S.idx.arch[id] || null;
  S.artifact = (id) => S.idx.artifact[id] || null;
  S.diagram = (id) => (id && S.idx.diagram[id]) || null;

  const BADGE = {
    live: { variant: 'outline', dot: false, pulse: false },
    wip: { variant: 'solid', dot: true, pulse: true },
    concept: { variant: 'dashed', dot: false, pulse: false },
    archive: { variant: 'subtle', dot: false, pulse: false },
  };
  S.badge = function (status) {
    const s = S.idx.status[status] || { label: status };
    return Object.assign({ label: s.label }, BADGE[status] || BADGE.live);
  };

  const VIEW_ICON = { doc: 'article', code: 'code', erd: 'grid', components: 'layout', flow: 'git-branch', image: 'eye', pdf: 'file', link: 'external-link' };

  /* ---------- view models ---------- */
  S.projectVM = function (p) {
    if (!p) return null;
    const cat = S.idx.cat[p.category] || {};
    const cover = S.diagram(p.cover) || { nodes: [], links: [] };
    const links = [];
    if (p.links && p.links.demo) links.push({ label: 'Демо', href: p.links.demo, icon: 'external-link', external: true });
    if (p.links && p.links.repo) links.push({ label: 'Код', href: p.links.repo, icon: 'github', external: true });
    if (p.links && p.links.docs) links.push({ label: 'Документация', href: p.links.docs, icon: 'file', external: !p.links.docs.startsWith('#') });
    links.forEach((l) => { l.target = l.external ? '_blank' : undefined; l.rel = l.external ? 'noopener noreferrer' : undefined; });
    return Object.assign({}, p, {
      href: '#/works/' + p.id,
      categoryLabel: cat.label || '',
      badge: S.badge(p.status),
      techList: (p.tech || []).map((t) => S.idx.tech[t] || { id: t, label: t }),
      techLine: (p.tech || []).map((t) => (S.idx.tech[t] || { label: t }).label).join(' · '),
      coverNodes: cover.nodes || [], coverLinks: cover.links || [],
      linkList: links, hasLinks: links.length > 0,
      demoLabel: p.demo ? 'Демо-пример' : '',
    });
  };

  S.artifactVM = function (a) {
    if (!a) return null;
    const t = S.idx.type[a.type] || {};
    const p = a.project ? S.project(a.project) : null;
    return Object.assign({}, a, {
      href: a.project ? '#/works/' + a.project + '?tab=artifacts&doc=' + a.id : (a.href || '#/works'), externalHref: a.href || null,
      typeLabel: t.label || a.type, typeCode: t.code || '',
      icon: VIEW_ICON[a.view] || 'file',
      projectTitle: p ? p.title : '—', projectCode: p ? p.code : '—',
      projectHref: p ? '#/works/' + p.id : null, hasProject: !!p,
      metaLine: [a.format, a.size].filter(Boolean).join(' · '),
    });
  };

  S.archVM = function (e) {
    if (!e) return null;
    const p = S.project(e.project);
    const d = S.diagram(e.diagram) || { nodes: [], links: [] };
    return Object.assign({}, e, {
      href: '#/works/' + e.project + '?tab=arch',
      kindLabel: (S.idx.kind[e.kind] || {}).label || e.kind,
      projectTitle: p ? p.title : '—', projectCode: p ? p.code : '', projectHref: p ? '#/works/' + p.id : null,
      nodes: d.nodes || [], links: d.links || [],
    });
  };

  S.techOptions = function () { return S.data.technologies.filter((t) => S.data.projects.some((p) => (p.tech || []).includes(t.id))); };

  /* ---------- queries ---------- */
  const norm = (s) => String(s || '').toLowerCase().replace(/ё/g, 'е');
  S.filterProjects = function (f) {
    const q = norm(f.q).trim();
    return S.data.projects.filter((p) =>
      (!f.cat || f.cat === 'all' || p.category === f.cat) &&
      (!f.status || f.status === 'all' || p.status === f.status) &&
      (!f.tech || f.tech === 'all' || (p.tech || []).includes(f.tech)) &&
      (!q || norm([p.title, p.summary, p.overview, p.code].join(' ')).includes(q)));
  };
  S.filterArtifacts = function (f) {
    const q = norm(f.q).trim();
    return S.data.artifacts.filter((a) =>
      (!f.type || f.type === 'all' || a.type === f.type) &&
      (!f.project || f.project === 'all' || a.project === f.project) &&
      (!q || norm([a.code, a.title, a.summary].join(' ')).includes(q)));
  };
  S.artifactsOf = (pid) => S.data.artifacts.filter((a) => a.project === pid);
  S.archOf = (pid) => S.data.architecture.filter((e) => e.project === pid);
  S.relatedOf = (p) => (p.related || []).map(S.project).filter(Boolean);

  /* ---------- content helpers ---------- */
  S.blocks = function (arr) {
    return (arr || []).map((b, i) => ({ key: i, type: b[0], isH: b[0] === 'h', isP: b[0] === 'p', isUl: b[0] === 'ul', isCode: b[0] === 'code', isLinks: b[0] === 'links', text: typeof b[1] === 'string' ? b[1] : '', items: Array.isArray(b[1]) ? b[1] : [] }));
  };

  S.blocksToMd = function (title, arr) {
    const out = ['# ' + title, ''];
    (arr || []).forEach((b) => {
      if (b[0] === 'h') out.push('## ' + b[1], '');
      else if (b[0] === 'p') out.push(b[1], '');
      else if (b[0] === 'ul') { b[1].forEach((x) => out.push('- ' + x)); out.push(''); }
      else if (b[0] === 'code') out.push('```', b[1], '```', '');
      else if (b[0] === 'links') { b[1].forEach((l) => out.push('- [' + l.label + '](' + l.href + ')')); out.push(''); }
    });
    return out.join('\n');
  };
  S.download = function (filename, text, mime) {
    try {
      const url = URL.createObjectURL(new Blob([text], { type: (mime || 'text/plain') + ';charset=utf-8' }));
      const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      S.toast('Файл сохранён', filename);
    } catch (e) { S.toast('!! Не удалось сохранить файл', String(e.message || e)); }
  };

  /* ---------- UI utilities ---------- */
  S.reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  S.toast = function (title, msg) { window.dispatchEvent(new CustomEvent('sw:toast', { detail: { title: title, msg: msg } })); };
  S.copy = function (text, title) {
    const done = () => S.toast(title || 'Скопировано', text.length > 60 ? text.slice(0, 57) + '…' : text);
    const fail = () => S.toast('!! Не удалось скопировать', 'Выделите текст вручную');
    try { navigator.clipboard.writeText(text).then(done, fail); } catch (e) { fail(); }
  };
  S.scrollTo = function (id) {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: S.reducedMotion() ? 'auto' : 'smooth' });
    el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true });
  };
  /* Fade-up 10px on scroll for [data-reveal] (value = delay in ms). Elements stay visible if JS/IO is unavailable. */
  S.reveal = function (root) {
    if (!root || S.reducedMotion() || !('IntersectionObserver' in window) || !Element.prototype.animate) return () => {};
    const io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        const top = e.boundingClientRect.top;
        if (top < 0) return;
        e.target.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
          { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)', delay: Number(e.target.getAttribute('data-reveal')) || 0, fill: 'backwards' });
      });
    }, { threshold: 0.01 });
    const scan = () => root.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => { el.setAttribute('data-revealed', ''); io.observe(el); });
    scan();
    const mo = new MutationObserver(scan); mo.observe(root, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  };

  window.SWStore = S;
})();
