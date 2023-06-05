FROM php:7.4.11-apache-buster

RUN set -eux && apt-get update \
    && apt-get install -y --no-install-recommends mc htop sudo wget \
          libxpm4 libzip4 libwebp-dev libjpeg62-turbo-dev libpng-dev libxpm-dev libfreetype6-dev libzip-dev libfreetype6 libpng16-16 libjpeg62 libwebp6 libwebpmux3 libwebpdemux2 \
	\	
	&& docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) bcmath exif gd mysqli opcache zip \
    \
    && docker-php-source delete \
    && apt-get remove -y libjpeg62-turbo-dev libpng-dev libxpm-dev libfreetype6-dev libzip-dev libwebp-dev \
    && apt-get clean && apt-get autoremove -y && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* /usr/src 

# set recommended PHP.ini settings
# see https://secure.php.net/manual/en/opcache.installation.php
RUN { \
		echo 'opcache.memory_consumption=64'; \
		echo 'opcache.interned_strings_buffer=8'; \
		echo 'opcache.max_accelerated_files=4000'; \
		echo 'opcache.revalidate_freq=2'; \
		echo 'opcache.fast_shutdown=1'; \
	} > /usr/local/etc/php/conf.d/opcache-recommended.ini
# https://wordpress.org/support/article/editing-wp-config-php/#configure-error-logging
RUN { \
# https://www.php.net/manual/en/errorfunc.constants.php
# https://github.com/docker-library/wordpress/issues/420#issuecomment-517839670
		echo 'error_reporting = E_ERROR | E_WARNING | E_PARSE | E_CORE_ERROR | E_CORE_WARNING | E_COMPILE_ERROR | E_COMPILE_WARNING | E_RECOVERABLE_ERROR'; \
		echo 'display_errors = Off'; \
		echo 'display_startup_errors = Off'; \
		echo 'log_errors = On'; \
		echo 'error_log = /dev/stderr'; \
		echo 'log_errors_max_len = 1024'; \
		echo 'ignore_repeated_errors = On'; \
		echo 'ignore_repeated_source = Off'; \
		echo 'html_errors = Off'; \
	} > /usr/local/etc/php/conf.d/error-logging.ini

RUN { \
		echo 'post_max_size = 800M'; \
		echo 'memory_limit = 1024M'; \
		echo 'max_input_vars = 10000'; \
		echo 'upload_max_filesize = 400M'; \
	} > /usr/local/etc/php/conf.d/error-logging.ini

RUN set -eux; \
	a2enmod rewrite expires; \
	\
# https://httpd.apache.org/docs/2.4/mod/mod_remoteip.html
	a2enmod remoteip; \
	{ \
		echo 'RemoteIPHeader X-Forwarded-For'; \
# these IP ranges are reserved for "private" use and should thus *usually* be safe inside Docker
		echo 'RemoteIPTrustedProxy 10.0.0.0/8'; \
		echo 'RemoteIPTrustedProxy 172.16.0.0/12'; \
		echo 'RemoteIPTrustedProxy 192.168.0.0/16'; \
		echo 'RemoteIPTrustedProxy 169.254.0.0/16'; \
		echo 'RemoteIPTrustedProxy 127.0.0.0/8'; \
	} > /etc/apache2/conf-available/remoteip.conf; \
	a2enconf remoteip; \
# https://github.com/docker-library/wordpress/issues/383#issuecomment-507886512
# (replace all instances of "%h" with "%a" in LogFormat)
	find /etc/apache2 -type f -name '*.conf' -exec sed -ri 's/([[:space:]]*LogFormat[[:space:]]+"[^"]*)%h([^"]*")/\1%a\2/g' '{}' +

COPY rootfs/ /

CMD ["/run.sh"]