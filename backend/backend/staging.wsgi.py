
"""
WSGI config for backend project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.2/howto/deployment/wsgi/
"""

import os
from django.core.wsgi import get_wsgi_application


def application(environ, start_response):
    os.environ['ENV'] = 'staging'
    os.environ['STAGING_DB_NAME'] = environ['STAGING_DB_NAME']
    os.environ['STAGING_DB_USER'] = environ['STAGING_DB_USER']
    os.environ['STAGING_DB_PASSWORD'] = environ['STAGING_DB_PASSWORD']
    os.environ['SECRET_KEY'] = environ['SECRET_KEY']
    os.environ['EMAIL_HOST'] = environ['STAGING_EMAIL_HOST']
    os.environ['EMAIL_HOST_USER'] = environ['STAGING_EMAIL_HOST_USER']
    os.environ['EMAIL_HOST_PASSWORD'] = environ['STAGING_EMAIL_HOST_PASSWORD']
    os.environ['EMAIL_PORT'] = environ['STAGING_EMAIL_PORT']
    os.environ['EMAIL_USE_SSL'] = 'True'
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
    return get_wsgi_application()(environ, start_response)
