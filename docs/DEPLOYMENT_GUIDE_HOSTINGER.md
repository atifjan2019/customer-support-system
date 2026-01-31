# Deploying to Hostinger VPS (Ubuntu/Nginx)

This guide will help you move your **ISP Connect** system from your local XAMPP environment to a Hostinger VPS.

## 🗂️ 1. Prepare Your Code for Production

### Step A: Build the Frontend
On your local machine, navigate to the `frontend` folder and generate the production files:
```bash
cd frontend
npm run build
```
This creates a `dist` folder. This is what we will upload to the server.

### Step B: Database Export
Export your local database `cms` into a `.sql` file using phpMyAdmin.

---

## 🖥️ 2. Connect to Your VPS
Open your terminal and SSH into your Hostinger VPS:
```bash
ssh root@your_vps_ip
```

---

## 🛠️ 3. Install the LEMP Stack
Run these commands on your VPS to install everything needed:

```bash
# Update System
sudo apt update && sudo apt upgrade -y

# Install Nginx
sudo apt install nginx -y

# Install MySQL
sudo apt install mysql-server -y

# Install PHP 8.2 & Extensions
sudo apt install php8.2-fpm php8.2-mysql php8.2-igbinary php8.2-mbstring php8.2-xml php8.2-zip php8.2-curl php8.2-gd php8.2-intl -y

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

---

## 📂 4. Upload & Organize Files

1.  **Create Directory**: `mkdir -p /var/www/isp-connect`
2.  **Upload Backend**: Copy your `backend` folder contents to `/var/www/isp-connect/api`.
3.  **Upload Frontend**: Copy your `frontend/dist` folder contents to `/var/www/isp-connect/public`.

---

## ⚙️ 5. Configure Laravel API

1.  **Permissions**:
    ```bash
    chown -R www-data:www-data /var/www/isp-connect
    chmod -R 775 /var/www/isp-connect/api/storage
    chmod -R 775 /var/www/isp-connect/api/bootstrap/cache
    ```
2.  **Env Setup**:
    - Copy `.env.example` to `.env`.
    - Update `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
    - Update `APP_URL` to your domain.
3.  **Install Dependencies**:
    ```bash
    cd /var/www/isp-connect/api
    composer install --no-dev --optimize-autoloader
    php artisan key:generate
    php artisan migrate --force
    ```

---

## 🌐 6. Configure Nginx (The Important Part)

Create a new Nginx config: `nano /etc/nginx/sites-available/isp-connect`

```nginx
server {
    listen 80;
    server_name yourdomain.com; # Change to your domain

    root /var/www/isp-connect/public; # React Build Folder
    index index.html;

    # Frontend (React)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend (Laravel API)
    location /api {
        alias /var/www/isp-connect/api/public;
        try_files $uri $uri/ @laravel;

        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
            fastcgi_param SCRIPT_FILENAME $request_filename;
        }
    }

    location @laravel {
        rewrite /api/(.*)$ /api/index.php?/$1 last;
    }
}
```

Enable it:
```bash
ln -s /etc/nginx/sites-available/isp-connect /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## 🔒 7. Add SSL (HTTPS)
Hostinger VPS users should use Certbot (Free):
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

---

## ✅ Final Check
1.  Visit `yourdomain.com` - You should see the login screen.
2.  You can now install it as a **PWA** from your live domain!
