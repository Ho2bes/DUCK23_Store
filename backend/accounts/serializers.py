# On importe des outils nécessaires pour créer des sérialiseurs avec Django REST Framework (DRF) dans backend/accounts/serializers.py:
from rest_framework import serializers # On importe le module serializers de Django REST Framework (DRF)
from .models import CustomUser # On importe notre modèle CustomUser
import re # On importe le module re pour les expressions régulières (regex) dans Python (pour valider les données)

# ✅ Serializer pour l'inscription (uniquement `username`, `email`, `password`)
class RegisterSerializer(serializers.ModelSerializer): # On crée une classe RegisterSerializer qui hérite de la classe ModelSerializer de DRF
    password = serializers.CharField(write_only=True) # On définit un champ pour le mot de passe (write_only=True pour ne pas l'afficher)

    class Meta: # On définit la classe Meta pour spécifier le modèle et les champs à sérialiser
        model = CustomUser # On spécifie le modèle CustomUser
        fields = ['username', 'email', 'password'] # On spécifie les champs à sérialiser

    def validate_email(self, value): # On définit une méthode pour valider l'adresse email
        """
        Valide que l'email est au bon format.
        """
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value): # On vérifie si l'adresse email est au bon format
            raise serializers.ValidationError("L'adresse email est invalide.") # On lève une exception si l'adresse email est invalide
        return value # On retourne la valeur si elle est valide

    def validate_password(self, value): # On définit une méthode pour valider le mot de passe
        """
        Valide que le mot de passe répond aux exigences.
        """
        if len(value) < 8: # On vérifie si le mot de passe contient au moins 8 caractères
            raise serializers.ValidationError("Le mot de passe doit contenir au moins 8 caractères.") # On lève une exception si le mot de passe est trop court
        if not any(char.isdigit() for char in value): # On vérifie si le mot de passe contient au moins un chiffre
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un chiffre.") # On lève une exception si le mot de passe ne contient pas de chiffre
        if not any(char.isalpha() for char in value): # On vérifie si le mot de passe contient au moins une lettre
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une lettre.") # On lève une exception si le mot de passe ne contient pas de lettre
        return value # On retourne la valeur si elle est valide

    def validate_username(self, value): # On définit une méthode pour valider le nom d'utilisateur
        """
        Valide que le nom d'utilisateur est unique.
        """
        if CustomUser.objects.filter(username=value).exists(): # On vérifie si le nom d'utilisateur existe déjà dans la base de données
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.") # On lève une exception si le nom d'utilisateur est déjà pris
        return value # On retourne la valeur si elle est unique

    def create(self, validated_data): # On définit une méthode pour créer un utilisateur après validation des données
        """
        Crée un utilisateur après validation des données.
        """
        user = CustomUser.objects.create_user( # On crée un utilisateur avec la méthode create_user du modèle CustomUser
            username=validated_data['username'], # On récupère le nom d'utilisateur
            email=validated_data['email'], # On récupère l'adresse email
            password=validated_data['password'] # On récupère le mot de passe
        )
        return user # On retourne l'utilisateur créé

# ✅ Serializer pour la mise à jour du profil (l'utilisateur peut modifier ses infos)
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'address', 'phone_number', 'email']  # Ajout des champs modifiables

    def validate_email(self, value):
        """
        Valide que l'email est au bon format.
        """
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("L'adresse email est invalide.")
        return value

    def validate_phone_number(self, value):
        """
        Valide que le numéro de téléphone contient uniquement des chiffres.
        """
        if value and not value.isdigit():
            raise serializers.ValidationError("Le numéro de téléphone ne doit contenir que des chiffres.")
        return value

    def validate_username(self, value):
        """
        Valide que le nom d'utilisateur est unique, sauf si c'est le même utilisateur.
        """
        request = self.context.get('request')
        if request is None or request.user is None:
            raise serializers.ValidationError("L'utilisateur de la requête n'est pas disponible.")
        if CustomUser.objects.filter(username=value).exclude(id=request.user.id).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return value



'''
from rest_framework import serializers
from .models import CustomUser

# Serializer pour l'enregistrement
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

# Serializer pour la mise à jour
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'email']
'''
