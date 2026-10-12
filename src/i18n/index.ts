import { ui, type UI } from './ui';

export const LANGS = ['ru', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'ru';

export const isLang = (v: unknown): v is Lang => LANGS.includes(v as Lang);

export function t(lang: Lang): UI {
  return ui[lang];
}

/** '/works/' → '/en/works/' для английской версии; русская живёт без префикса. */
export function localePath(lang: Lang, path = '/'): string {
  const p = path.startsWith('/') ? path : '/' + path;
  return lang === DEFAULT_LANG ? p : '/' + lang + (p === '/' ? '/' : p);
}

/** Определяет язык и «чистый» путь по адресу страницы. */
export function splitPath(pathname: string): { lang: Lang; path: string } {
  const m = pathname.match(/^\/(en)(\/.*)?$/);
  if (m) return { lang: 'en', path: m[2] || '/' };
  return { lang: DEFAULT_LANG, path: pathname || '/' };
}

export function altLang(lang: Lang): Lang {
  return lang === 'ru' ? 'en' : 'ru';
}

export { pluralRu, pluralEn } from './plural';

export const pad2 = (n: number) => String(n).padStart(2, '0');
