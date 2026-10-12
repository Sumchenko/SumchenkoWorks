# Sumchenko Works

Сайт-портфолио: проекты, архитектурные разборы и артефакты (требования, ADR, OpenAPI, диаграммы). Русская и английская версии, светлая и тёмная тема, адаптивная вёрстка.

## Запуск

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # статический сайт в dist/
npm run preview  # посмотреть собранную версию
```

Требуется Node.js 22+.

## Как обновлять

Весь контент лежит в `src/content/` (YAML и Markdown), правила описаны в [CLAUDE.md](CLAUDE.md). Изменили файл, запушили в `main`, и GitHub Actions сам собирает сайт и выкладывает его на сервер.

## Деплой

См. [deploy/README.md](deploy/README.md): домен, nginx, HTTPS и автодеплой.
