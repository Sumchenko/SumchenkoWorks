# Выкладка на VPS

Сайт статический: после `npm run build` папка `dist/` — это весь сайт. На сервере нужен только nginx, Node.js не нужен. Существующий проект на VPS не затрагивается: у каждого сайта свой `server`-блок и своя папка.

## 1. Домен

1. Домен: `sumchenko-tech.ru`. Сервер: `13.143.64.158` (xorek.cloud, Германия).
2. В DNS у регистратора добавьте A-записи:
   - `@` → `13.143.64.158`
   - `www` → `13.143.64.158`
   - `*` → `13.143.64.158` (необязательно: все поддомены для других проектов)
3. Подождите, пока записи разойдутся (обычно от 15 минут до пары часов). Проверка: `ping sumchenko-tech.ru`.

## 2. Сервер (один раз)

Команды для Ubuntu/Debian. Если nginx уже стоит ради другого проекта, пропустите его установку.

```bash
sudo apt update && sudo apt install -y nginx certbot python3-certbot-nginx rsync

# папка сайта и пользователь для деплоя
sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /var/www/sumchenko-works
sudo chown deploy:deploy /var/www/sumchenko-works

# конфиг nginx (файл deploy/nginx-sumchenko.conf из репозитория)
sudo nano /etc/nginx/sites-available/sumchenko
sudo ln -s /etc/nginx/sites-available/sumchenko /etc/nginx/sites-enabled/sumchenko
sudo nginx -t && sudo systemctl reload nginx

# HTTPS-сертификат Let's Encrypt (продлевается автоматически)
sudo certbot --nginx -d sumchenko-tech.ru -d www.sumchenko-tech.ru
```

## 3. Ключ для автодеплоя

На своём компьютере создайте отдельный ключ (без пароля) только для деплоя:

```bash
ssh-keygen -t ed25519 -f deploy_key -C "github-deploy" -N ""
```

- Содержимое `deploy_key.pub` добавьте на сервер в `/home/deploy/.ssh/authorized_keys` (права: папка `700`, файл `600`, владелец `deploy`).
- Содержимое `deploy_key` (приватный) добавьте в GitHub: репозиторий → Settings → Secrets and variables → Actions:
  - `SSH_KEY` — приватный ключ целиком,
  - `SSH_HOST` — `13.143.64.158`,
  - `SSH_USER` — `deploy`,
  - `SSH_PORT` — если SSH не на 22.
- Там же во вкладке **Variables** создайте `SITE_URL` = `https://sumchenko-tech.ru`.

После этого каждый `git push` в ветку `main` собирает сайт и выкладывает его на сервер примерно за минуту (вкладка Actions в GitHub).

## Выкладка вручную (без GitHub Actions)

```bash
npm run build
rsync -az --delete dist/ deploy@13.143.64.158:/var/www/sumchenko-works/
```

## Проверка после запуска

- `https://sumchenko-tech.ru/` и `https://sumchenko-tech.ru/en/` открываются, `http://` и `www.` перенаправляют на основной адрес.
- Несуществующий адрес показывает страницу 404.
- Превью ссылки: вставьте её в Telegram — должны подтянуться заголовок, описание и картинка.
