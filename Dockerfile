FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    gnupg \
    wget \
    fonts-dejavu \
    fonts-kacst \
    fonts-arabeyes \
    fonts-noto-core \
    fonts-noto-ui-arabic \
    lsb-release \
    ca-certificates

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Google Chrome for Puppeteer/Browsershot
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
    && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
    && apt-get update \
    && apt-get install -y google-chrome-stable \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Fix Chrome / Puppeteer directories for www-data inside container
RUN mkdir -p /var/www/.local /var/www/.config /var/www/.pki /var/www/.cache \
    && chown -R www-data:www-data /var/www/.local /var/www/.config /var/www/.pki /var/www/.cache

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy codebase
COPY . .

# Set Permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 storage bootstrap/cache

# Allow node modules execution
ENV PATH="./node_modules/.bin:$PATH"

CMD ["php-fpm"]
