import os
from pathlib import Path
from datetime import timedelta

# ✅ Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Secret Key (🔒 Doit être défini dans les variables d'environnement en prod)
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'default-secret-key')

# ✅ Debug mode (Doit être False en production)
DEBUG = os.getenv('DEBUG', 'True') == 'True'

# ✅ Allowed Hosts
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')

# ✅ Installed Applications
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django_extensions',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',  # ✅ Blacklist des tokens JWT
    'corsheaders',  # ✅ Gestion des requêtes cross-origin
    'accounts',
    'store',
]

# ✅ Custom User Model
AUTH_USER_MODEL = 'accounts.CustomUser'

# ✅ Middleware (🔥 `CorsMiddleware` doit être le premier)
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # 🔥 Doit être le premier pour éviter les erreurs CORS
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'duck23_store.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'duck23_store.wsgi.application'

# ✅ Database Configuration (🔒 Sécurisation avec les variables d'environnement)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'duck23_store_db'),
        'USER': os.getenv('DB_USER', 'hobbes'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'Nicolas1990'),  # 🔥 Remplace par le bon mot de passe
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# ✅ REST Framework Configuration (utilisation de CookieJWTAuthentication en premier)
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'accounts.authentication.CookieJWTAuthentication',  # Permet de lire le token dans le cookie
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# ✅ JWT Token Configuration (pour le développement en HTTP)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_COOKIE': 'accessToken',
    'AUTH_COOKIE_REFRESH': 'refreshToken',
    'AUTH_COOKIE_SECURE': False,         # ✅ False en local (HTTP); True en production (HTTPS)
    'AUTH_COOKIE_HTTP_ONLY': True,         # Protège contre les attaques XSS
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SAMESITE': 'lax',         # ✅ 'lax' est compatible avec HTTP en dev
}

# ✅ CORS Configuration (pour l'envoi des cookies)
CORS_ALLOW_CREDENTIALS = True            # Autorise les cookies cross-origin
CORS_ALLOW_ALL_ORIGINS = False           # Ne pas autoriser tous les domaines
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',
]
CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS  # Alignement avec CORS

# ✅ Configuration des cookies de session et CSRF (adapté pour le développement)
SESSION_COOKIE_SECURE = False            # Désactivé en local (True en prod)
CSRF_COOKIE_SECURE = False               # Désactivé en local (True en prod)
SESSION_COOKIE_SAMESITE = "lax"          # 'lax' pour la compatibilité en dev
CSRF_COOKIE_SAMESITE = "lax"             # 'lax' pour la compatibilité en dev

# ✅ Static Files
STATIC_URL = 'static/'

# ✅ Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
] if not DEBUG else []               # Désactivé en mode dev

# ✅ Session Configuration
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = not DEBUG     # En dev, DEBUG=True donc False
CSRF_COOKIE_SECURE = not DEBUG

# ✅ Timezone
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
