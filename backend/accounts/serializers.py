from rest_framework import serializers
from .models import CustomUser
import re

"""
Serializer pour l'inscription (uniquement `username`, `email`, `password`)
On crée une classe RegisterSerializer pour gérer l'inscription des utilisateurs
Cette classe hérite de serializers.ModelSerializer de Django REST Framework (DRF)
On utilise le modèle CustomUser pour définir les champs à sérialiser

"""
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'password']

    def validate_email(self, value):
        """
        Valide que l'email est au bon format.
        """
        if not re.match(r"[^@]+@[^@]+\.[^@]+", value):
            raise serializers.ValidationError("L'adresse email est invalide.")
        return value

    def validate_password(self, value):
        """
        Valide que le mot de passe répond aux exigences.
        """
        if len(value) < 8:
            raise serializers.ValidationError("Le mot de passe doit contenir au moins 8 caractères.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Le mot de passe doit contenir au moins un chiffre.")
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("Le mot de passe doit contenir au moins une lettre.")
        return value

    def validate_username(self, value):
        """
        Valide que le nom d'utilisateur est unique.
        """
        if CustomUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return value

    def create(self, validated_data):
        """
        Crée un utilisateur après validation des données.
        """
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

"""
Serializer pour la mise à jour du profil (l'utilisateur peut modifier ses infos)
On crée une classe UpdateUserSerializer pour gérer la mise à jour des informations de l'utilisateur
Cette classe hérite aussi de serializers.ModelSerializer de DRF
On utilise le modèle CustomUser pour définir les champs modifiables

"""
class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'address', 'phone_number', 'email']

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
