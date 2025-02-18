from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

# Enregistre le modèle User dans Django Admin
admin.site.register(User, UserAdmin)
