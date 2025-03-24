# On importe des outils nécessaires pour créer un modèle d'utilisateur personnalisé
from django.contrib.auth.models import AbstractUser # On importe la classe AbstractUser de Django
from django.db import models # On importe le module models de Django
from django.utils.timezone import now # On importe la fonction now() pour récupérer la date et l'heure actuelles

# On crée un modèle d'utilisateur personnalisé qui hérite de la classe AbstractUser
class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'), # Choix pour un utilisateur normal
        ('admin', 'Admin'), # Choix pour un administrateur
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user') # Champ pour le rôle de l'utilisateur
    created_at = models.DateTimeField(auto_now_add=True)  # Date de création
    updated_at = models.DateTimeField(auto_now=True)      # Date de mise à jour

    first_name = models.CharField(max_length=150, blank=True, null=True)  # Prénom
    last_name = models.CharField(max_length=150, blank=True, null=True)   # Nom
    address = models.TextField(blank=True, null=True)  # Adresse postale
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Numéro de téléphone

    def __str__(self): # Méthode pour afficher le nom d'utilisateur dans l'administration
        return self.username # On retourne le nom d'utilisateur

