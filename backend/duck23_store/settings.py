import os
from pathlib import Path
from datetime import timedelta

# ==========================================================================
# BASE CONFIGURATION
# ==========================================================================
BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', 'default-secret-key')
DEBUG = os.getenv('DEBUG', 'True') == 'True'
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', '127.0.0.1,localhost').split(',')

# ==========================================================================
# APPLICATION DEFINITION
# ==========================================================================
INSTALLED_APPS = [
    # Django core apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'django_extensions',
    'rest_framework',
    'rest_framework_simplejwt.token_blacklist',
    'corsheaders',
    
    # Project apps
    'accounts',
    'store',
]

# Custom user model
AUTH_USER_MODEL = 'accounts.CustomUser'

# ==========================================================================
# MIDDLEWARE CONFIGURATION
# ==========================================================================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Doit être en premier
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',  # Gestion CSRF
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# ==========================================================================
# URL & TEMPLATE CONFIGURATION  
# ==========================================================================
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

# ==========================================================================
# DATABASE CONFIGURATION
# ==========================================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('DB_NAME', 'duck23_store_db'),
        'USER': os.getenv('DB_USER', 'hobbes'),
        'PASSWORD': os.getenv('DB_PASSWORD', 'Nicolas1990'),
        'HOST': os.getenv('DB_HOST', 'localhost'),
        'PORT': os.getenv('DB_PORT', '5432'),
    }
}

# ==========================================================================
# AUTHENTICATION & SECURITY CONFIGURATION
# ==========================================================================
# Django REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# JWT Configuration (pour référence, même si nous utilisons des sessions)
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_COOKIE': 'accessToken',
    'AUTH_COOKIE_REFRESH': 'refreshToken',
    'AUTH_COOKIE_SECURE': False,
    'AUTH_COOKIE_HTTP_ONLY': True,
    'AUTH_COOKIE_PATH': '/',
    'AUTH_COOKIE_SAMESITE': 'lax',
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [] if DEBUG else [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ==========================================================================
# SESSION & CSRF CONFIGURATION
# ==========================================================================
# Session Settings
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SECURE = False
SESSION_COOKIE_SAMESITE = "lax"

# CSRF Settings
CSRF_COOKIE_SECURE = not DEBUG            # True en production (HTTPS)
CSRF_COOKIE_SAMESITE = "lax"              # Permet l'utilisation en iframe et requêtes cross-origin
CSRF_USE_SESSIONS = False                 # Stockage dans les cookies, pas en session
CSRF_COOKIE_HTTPONLY = False              # False permet à JavaScript de lire le token
CSRF_COOKIE_NAME = 'csrftoken'            # Nom standard du cookie CSRF
CSRF_HEADER_NAME = 'HTTP_X_CSRFTOKEN'     # En-tête HTTP attendu pour les requêtes
CSRF_TRUSTED_ORIGINS = ['http://localhost:4200']  # Origines autorisées
CSRF_COOKIE_ALWAYS_SEND = True

# ==========================================================================
# CORS CONFIGURATION
# ==========================================================================
CORS_ALLOW_CREDENTIALS = True             # Permet d'envoyer les cookies avec les requêtes
CORS_ALLOW_ALL_ORIGINS = False            # Plus sécurisé que d'autoriser toutes les origines
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',              # Frontend Angular
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']  # Expose l'en-tête CSRF

# ==========================================================================
# INTERNATIONALIZATION & STATIC FILES
# ==========================================================================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'