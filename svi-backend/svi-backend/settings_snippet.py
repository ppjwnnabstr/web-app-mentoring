"""
Add/adjust these in your project's settings.py (SQLite is Django's
default DB backend, so no DATABASES change is needed unless you've
already customized it).
"""

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",  # DRF, for the API the React frontend talks to
    "accounts",
    "matching",
    "mentorship",
    "tasks",
    "notifications",
]

# Required since accounts.User replaces the default auth user model
AUTH_USER_MODEL = "accounts.User"

# React dev server origin, if serving FE/BE separately
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # Vite default
    "http://localhost:3000",  # CRA default
]

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"  # BASE_DIR already defined by default settings.py
