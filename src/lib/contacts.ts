import type { Site } from '@/content/schema';

export type ContactVM = { id: string; label: string; icon: string; href: string | null; external: boolean; display: string };

/** Нормализует ссылки профиля: email без mailto: → mailto:, подпись без протокола для показа. */
export function contactLinks(links: Site['profile']['links']): ContactVM[] {
  return links.map((l) => {
    const raw = l.href || null;
    const href = raw && l.id === 'email' && !raw.startsWith('mailto:') ? 'mailto:' + raw : raw;
    const external = !!href && /^https?:/.test(href);
    let display = href ? href.replace(/^mailto:|^https?:\/\//, '').replace(/\/$/, '') : '';
    // длинные адреса (резюме, документы) сокращаются до домена и первого раздела
    if (display.length > 32 && display.includes('/')) display = display.split('/').slice(0, 2).join('/') + '/…';
    return { id: l.id, label: l.label, icon: l.icon, href, external, display };
  });
}
