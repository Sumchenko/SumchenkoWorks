#!/usr/bin/env bash
# Установка GoatCounter на VPS. Запускать один раз под root:
#   bash /home/deploy/setup-stats.sh
# Файлы рядом (программу, службу, конфиг Caddy) заранее кладёт пользователь deploy в /home/deploy/stats-setup/.
# Повторный запуск безопасен: уже созданные пользователь и база не трогаются.
set -euo pipefail

SRC=/home/deploy/stats-setup
DATA=/var/lib/goatcounter
DB="sqlite+$DATA/db.sqlite3"
EMAIL=nik.sumchenko.2004@mail.ru

if [ "$(id -u)" -ne 0 ]; then echo "Запустите под root"; exit 1; fi

echo "1/5 Пользователь goatcounter"
id goatcounter >/dev/null 2>&1 || useradd --system --home-dir "$DATA" --create-home --shell /usr/sbin/nologin goatcounter
install -d -o goatcounter -g goatcounter -m 0750 "$DATA"

echo "2/5 Программа и служба"
install -m 0755 "$SRC/goatcounter" /usr/local/bin/goatcounter
install -m 0644 "$SRC/goatcounter.service" /etc/systemd/system/goatcounter.service

echo "3/5 База и вход в статистику"
if [ ! -f "$DATA/db.sqlite3" ]; then
  echo "Придумайте пароль для входа в статистику (логин — $EMAIL):"
  cd "$DATA"
  runuser -u goatcounter -- /usr/local/bin/goatcounter db create site -createdb -db "$DB" \
    -vhost stats.sumchenko-tech.ru -user.email "$EMAIL"
fi

echo "4/5 Права deploy на перезапуск статистики (для обновлений)"
echo 'deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart goatcounter' > /etc/sudoers.d/deploy-goatcounter
chmod 0440 /etc/sudoers.d/deploy-goatcounter
visudo -cf /etc/sudoers.d/deploy-goatcounter >/dev/null

echo "5/5 Запуск"
systemctl daemon-reload
systemctl enable --now goatcounter
systemctl reload caddy
sleep 2
systemctl is-active goatcounter && echo "Готово: https://stats.sumchenko-tech.ru"
