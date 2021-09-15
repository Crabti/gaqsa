"""
Django settings for backend project.

Generated by 'django-admin startproject' using Django 3.2.7.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.2/ref/settings/
"""

import os
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/3.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-35!h^w0 \
    ^vffmbcmg^r4+popgutd0bt(5gmhpzdq+scz6c!18#(')

ENVIRONMENT = os.getenv('ENV', 'dev')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = ENVIRONMENT == 'dev'

ALLOWED_HOSTS = [
    'api.staging.gaqsa.com',
    'api.prod.gaqsa.com',
    'localhost',
    '127.0.0.1'
    ]

SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG

SECURE_HSTS_SECONDS = 31536000

CSRF_COOKIE_SECURE = not DEBUG

SECURE_HSTS_PRELOAD = not DEBUG

SECURE_HSTS_INCLUDE_SUBDOMAINS = not DEBUG

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'backend',
    'users'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

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

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
# https://docs.djangoproject.com/en/3.2/ref/settings/#databases

if ENVIRONMENT == 'dev':
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('DB_ENGINE', 'django.db.backends.sqlite3'),
            'NAME': os.getenv('DB_NAME', BASE_DIR / 'db.sqlite3'),
            'USER': os.getenv('DB_USER', 'root'),
            'PASSWORD': os.getenv('DB_PASSWORD', 'password'),
            'HOST': os.getenv('DB_HOST', 'localhost'),
            'PORT': os.getenv('DB_PORT', '3306'),
        },
    }
elif ENVIRONMENT == 'staging':
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('STAGING_DB_ENGINE',
                                'django.db.backends.mysql'),
            'NAME': os.getenv('STAGING_DB_NAME', BASE_DIR / 'db.sqlite3'),
            'USER': os.getenv('STAGING_DB_USER', 'root'),
            'PASSWORD': os.getenv('STAGING_DB_PASSWORD', 'password'),
            'HOST': os.getenv('STAGING_DB_HOST', 'localhost'),
            'PORT': os.getenv('STAGING_DB_PORT', '3306'),
            'OPTIONS': {
                'sql_mode': 'traditional',
            },
        },
    }
elif ENVIRONMENT == 'production':
    DATABASES = {
        'default': {
            'ENGINE': os.getenv('PRODUCTION_DB_ENGINE',
                                'django.db.backends.mysql'),
            'NAME': os.getenv('PRODUCTION_DB_NAME', BASE_DIR / 'db.sqlite3'),
            'USER': os.getenv('PRODUCTION_DB_USER', 'root'),
            'PASSWORD': os.getenv('PRODUCTION_DB_PASSWORD', 'password'),
            'HOST': os.getenv('PRODUCTION_DB_HOST', 'localhost'),
            'PORT': os.getenv('PRODUCTION_DB_PORT', '3306'),
            'OPTIONS': {
                'sql_mode': 'traditional',
            },
        },
    }

# Password validation
# https://docs.djangoproject.com/en/3.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation' +
        '.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation' +
        '.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation' +
        '.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation' +
        '.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/3.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.2/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT = os.path.join(BASE_DIR, 'static/')


# Default primary key field type
# https://docs.djangoproject.com/en/3.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
