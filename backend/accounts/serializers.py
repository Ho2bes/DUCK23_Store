from rest_framework import serializers
from .models import CustomUser
import re

# Serializer pour l'enregistrement
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
        Valide que le nom d'utilisateur est unique et contient des caractères valides.
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
