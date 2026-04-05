FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev libzip-dev \
    zip unzip gnupg wget ca-certificates \
    fonts-dejavu fonts-noto-core \
    --no-install-recommends

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Node.js 20
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Chromium (more reliable than Chrome on Debian-based)
RUN apt-get install -y chromium --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Fix permissions for www-data (needed by Puppeteer/Browsershot)
RUN mkdir -p /var/www/.local /var/www/.config /var/www/.pki /var/www/.cache \
    && chown -R www-data:www-data /var/www/.local /var/www/.config /var/www/.pki /var/www/.cache

# Get Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

# Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction

# Install Node dependencies and build assets
RUN npm ci && npm run build

# Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

CMD ["php-fpm"]
