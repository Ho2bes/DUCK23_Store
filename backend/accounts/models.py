from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.timezone import now


class CustomUser(AbstractUser):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('admin', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    created_at = models.DateTimeField(auto_now_add=True)  # Date de création
    updated_at = models.DateTimeField(auto_now=True)      # Date de mise à jour

    first_name = models.CharField(max_length=150, blank=True, null=True)  # Prénom
    last_name = models.CharField(max_length=150, blank=True, null=True)   # Nom
    address = models.TextField(blank=True, null=True)  # Adresse postale
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Numéro de téléphone

    def __str__(self):
        return self.username

