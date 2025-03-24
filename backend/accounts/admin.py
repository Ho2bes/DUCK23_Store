# On importe des outils nécessaires pour créer une interface d'administration Django
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser # On importe notre modèle personnalisé d'utilisateur

# On crée une classe pour personnaliser l'interface d'administration de notre modèle CustomUser
class CustomUserAdmin(UserAdmin):
    model = CustomUser # On spécifie que cette classe est pour le modèle CustomUser
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active') # On spécifie les champs à afficher dans la liste des utilisateurs
    list_filter = ('role', 'is_staff', 'is_active') # On spécifie les filtres à afficher
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password', 'role')}), # On spécifie les champs à afficher dans le formulaire de création d'utilisateur
        ('Permissions', {'fields': ('is_staff', 'is_active', 'groups', 'user_permissions')}), # On spécifie les champs à afficher dans le formulaire de gestion des permissions
    )
    search_fields = ('email', 'username') # On spécifie les champs à utiliser pour la recherche
    ordering = ('email',) # On spécifie l'ordre de tri par défaut

admin.site.register(CustomUser, CustomUserAdmin) # On enregistre notre modèle CustomUser avec l'interface d'administration personnalisée

