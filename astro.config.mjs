// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

// Адрес сайта: нужен для canonical, sitemap и абсолютных ссылок в превью (og:image).
// Поменяйте после покупки домена или задайте переменную окружения SITE_URL при сборке.
const SITE = process.env.SITE_URL || 'https://sumchenko-tech.ru';

export default defineConfig({
  site: SITE,
  trailingSlash: 'always',
  build: { format: 'directory' },
  i18n: {
    locales: ['ru', 'en'],
    defaultLocale: 'ru',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    react(),
    sitemap({
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru-RU', en: 'en-US' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
});
