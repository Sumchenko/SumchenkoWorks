/*
 * Браузерные утилиты, общие для островков и скриптов страницы: уведомления, буфер обмена, скачивание файлов.
 * Тексты передаются вызывающим кодом, чтобы утилиты не зависели от языка.
 */
import { ICON_PATHS } from '@/components/ds/icon-paths';

const DURATION = 3200;

function iconSvg(name: string, size: number): string {
  const ds = ICON_PATHS[name] || [];
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" shape-rendering="crispEdges" style="flex:none;margin-top:1px">${ds.map((d) => `<path d="${d}"/>`).join('')}</svg>`;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

/** Уведомление в правом нижнем углу. Заголовок, начинающийся с «!!», показывается как ошибка. */
export function toast(title: string, msg = '', closeLabel = 'Close') {
  let host = document.querySelector<HTMLElement>('.toast-host');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toast-host';
    document.body.appendChild(host);
  }
  host.innerHTML = '';
  const el = document.createElement('div');
  el.className = 'sw-toast';
  el.dataset.variant = 'inverse';
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  const err = title.startsWith('!!');
  el.innerHTML = iconSvg(err ? 'alert' : 'check', 16)
    + `<div class="sw-toast__body"><div class="sw-toast__title">${esc(title)}</div>${msg ? `<div class="sw-toast__msg">${esc(msg)}</div>` : ''}</div>`
    + `<button type="button" class="sw-toast__close" aria-label="${esc(closeLabel)}">${iconSvg('close', 14)}</button>`
    + `<span class="sw-toast__bar" style="animation:sw-toast-bar ${DURATION}ms linear forwards"></span>`;
  const remove = () => el.remove();
  el.querySelector('button')!.addEventListener('click', remove);
  host.appendChild(el);
  setTimeout(remove, DURATION);
}

export type CopyTexts = { done: string; fail: string; failMsg: string; close: string };

export function copyText(text: string, texts: CopyTexts) {
  const done = () => toast(texts.done, text.length > 60 ? text.slice(0, 57) + '…' : text, texts.close);
  const fail = () => toast(texts.fail, texts.failMsg, texts.close);
  try { navigator.clipboard.writeText(text).then(done, fail); } catch { fail(); }
}

export function downloadText(filename: string, text: string, mime: string, texts: { done: string; fail: string; close: string }) {
  try {
    const url = URL.createObjectURL(new Blob([text], { type: mime + ';charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(texts.done, filename, texts.close);
  } catch (e) {
    toast(texts.fail, String((e as Error).message || e), texts.close);
  }
}

export const reducedMotion = () => !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Плавное появление элементов [data-reveal] (значение — задержка в мс). Без JS элементы просто видны. */
export function initReveal(root: Element = document.body) {
  if (reducedMotion() || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      if (e.boundingClientRect.top < 0) return;
      e.target.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }],
        { duration: 420, easing: 'cubic-bezier(.2,.7,.2,1)', delay: Number(e.target.getAttribute('data-reveal')) || 0, fill: 'backwards' });
    });
  }, { threshold: 0.01 });
  const scan = () => root.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => { el.setAttribute('data-revealed', ''); io.observe(el); });
  scan();
  new MutationObserver(scan).observe(root, { childList: true, subtree: true });
}

type GoatCounter = { count?: (v: { path: string; title?: string; event?: boolean }) => void };

/**
 * Событие обезличенной статистики (GoatCounter на stats.sumchenko-tech.ru, без cookie).
 * Если счётчик не загрузился (локальная разработка, блокировщик), вызов просто ничего не делает.
 */
export function track(path: string, title?: string, attempt = 0) {
  try {
    const gc = (window as unknown as { goatcounter?: GoatCounter }).goatcounter;
    // Скрипт счётчика грузится асинхронно: событие при открытии страницы может прийти раньше — ждём до ~5 с
    if (!gc?.count) { if (attempt < 10) setTimeout(() => track(path, title, attempt + 1), 500); return; }
    gc.count({ path, title, event: true });
  } catch {
    /* статистика не должна ломать сайт */
  }
}
