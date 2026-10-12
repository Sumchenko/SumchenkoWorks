# Выкладка на VPS

- Домен: `sumchenko-tech.ru`
- Сервер: `13.143.64.158` (xorek.cloud, Германия), Ubuntu 22.04, вход под `root`
- Веб-сервер: **Caddy**, общий с проектом Mito. Деплой Mito при каждом запуске перезаписывает `/etc/caddy/Caddyfile`, поэтому портфолио живёт в отдельном файле `/etc/caddy/sites/sumchenko.caddy`, а главный конфиг подключает его строкой `import /etc/caddy/sites/*.caddy` (она есть в шаблоне `Mito/deploy/Caddyfile`). HTTPS-сертификаты Caddy получает и продлевает сам.

Сайт статический: после `npm run build` папка `dist/` — это весь сайт. Node.js на сервере не нужен.

## 1. DNS

У регистратора домена добавьте A-записи:

| Тип | Имя | Значение |
|---|---|---|
| A | `@` | `13.143.64.158` |
| A | `www` | `13.143.64.158` |
| A | `*` | `13.143.64.158` (необязательно: все поддомены для будущих проектов) |

Проверка с компьютера: `nslookup sumchenko-tech.ru` должен вернуть `13.143.64.158`. Дальше переходите только после этого: Caddy не получит сертификат, пока домен не указывает на сервер.

## 2. Сервер (один раз)

```bash
# rsync нужен для выкладки файлов
apt update && apt install -y rsync

# пользователь для автодеплоя и папка сайта
adduser --disabled-password --gecos "" deploy   # уже есть: его использует деплой Mito
mkdir -p /var/www/sumchenko-works
chown deploy:deploy /var/www/sumchenko-works

# резервная копия текущего конфига Caddy
cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.bak

# конфиг портфолио — отдельным файлом (содержимое deploy/sumchenko.caddy из репозитория)
mkdir -p /etc/caddy/sites
nano /etc/caddy/sites/sumchenko.caddy

# подключить папку sites в главный конфиг (до следующего деплоя Mito, дальше её добавит шаблон Mito)
echo 'import /etc/caddy/sites/*.caddy' >> /etc/caddy/Caddyfile

# проверить и применить (при ошибке Caddy продолжит работать со старым конфигом)
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile
systemctl reload caddy
```

Если что-то пошло не так, верните старый конфиг: `cp /etc/caddy/Caddyfile.bak /etc/caddy/Caddyfile && systemctl reload caddy`.

## 3. Ключ для автодеплоя

На своём компьютере создайте отдельный ключ (без пароля) только для деплоя:

```bash
ssh-keygen -t ed25519 -f deploy_key -C "github-deploy" -N ""
```

На сервере разрешите этот ключ пользователю `deploy`:

```bash
mkdir -p /home/deploy/.ssh
nano /home/deploy/.ssh/authorized_keys   # вставить содержимое deploy_key.pub
chown -R deploy:deploy /home/deploy/.ssh
chmod 700 /home/deploy/.ssh && chmod 600 /home/deploy/.ssh/authorized_keys
```

В GitHub: репозиторий → Settings → Secrets and variables → Actions.

- **Secrets:**
  - `SSH_KEY` — содержимое `deploy_key` (приватный ключ целиком),
  - `SSH_HOST` — `13.143.64.158`,
  - `SSH_USER` — `deploy`,
  - `SSH_PORT` — только если SSH не на порту 22.
- **Variables:** `SITE_URL` = `https://sumchenko-tech.ru`.

После этого каждый `git push` в ветку `main` собирает сайт и выкладывает его на сервер примерно за минуту (вкладка Actions в GitHub). Файлы `deploy_key` и `deploy_key.pub` после настройки удалите с компьютера, в репозиторий их не добавляйте.

## Выкладка вручную (без GitHub Actions)

```bash
npm run build
rsync -az --delete dist/ deploy@13.143.64.158:/var/www/sumchenko-works/
```

## Проверка после запуска

- `https://sumchenko-tech.ru/` и `https://sumchenko-tech.ru/en/` открываются, `www.` перенаправляет на основной адрес.
- Несуществующий адрес показывает страницу 404.
- Сайт открывается с мобильного интернета в России без VPN.
- Превью ссылки: вставьте её в Telegram, должны подтянуться заголовок, описание и картинка.
- Другой проект на сервере работает как раньше.
