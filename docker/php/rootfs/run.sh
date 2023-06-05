#!/bin/bash

got_sigkill=0

_term() {
  echo "Caught SIGTERM signal!"
  kill -QUIT "$child" 2>/dev/null
}

trap _term SIGTERM

usermod -u `stat -c '%u' /var/www/html` www-data
groupmod -g `stat -c '%u' /var/www/html` www-data

if [ -d '/var/www/wp-theme' ]; then
  if [ ! -d '/var/www/html/wp-content/themes/wp-theme' ]; then
    ln -r -s /var/www/wp-theme /var/www/html/wp-content/themes/wp-theme
  fi
fi

cd /

/usr/local/bin/apache2-foreground &

child=$!
wait "$child"
