from django.test import TestCase
from accounts.models import CustomUser
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model

class CustomUserModelTest(TestCase):
    def test_user_creation(self):
        user = CustomUser.objects.create_user(
            username="testuser",
            password="testpass",
            role="user"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.role, "user")
        self.assertTrue(user.check_password("testpass"))

    def test_admin_creation(self):
        admin = CustomUser.objects.create_superuser(
            username="adminuser",
            password="adminpass",
            role="admin"
        )
        self.assertEqual(admin.username, "adminuser")
        self.assertEqual(admin.role, "admin")
        self.assertTrue(admin.is_superuser)

    def test_invalid_user_creation(self):
        with self.assertRaises(ValidationError):
            user = CustomUser(username="").full_clean()

        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(username="", password="testpass")

# Tests pour la vue UpdateUserView
class UpdateUserViewTests(APITestCase):
    def setUp(self):
        # Création d'un utilisateur de test
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
        )
        self.client.login(username="testuser", password="password123")  # Authentification

    def test_update_user(self):
        # Test de mise à jour avec des données valides
        new_data = {"username": "updateduser", "email": "updateduser@example.com"}
        response = self.client.put("/api/accounts/update/", new_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "updateduser")
        self.assertEqual(self.user.email, "updateduser@example.com")

    def test_update_user_with_invalid_email(self):
        # Test de mise à jour avec un email invalide
        new_data = {"email": "invalid-email"}
        response = self.client.put("/api/accounts/update/", new_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_partial_update(self):
        # Test de mise à jour partielle avec un seul champ
        new_data = {"username": "partialupdate"}
        response = self.client.put("/api/accounts/update/", new_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "partialupdate")
        self.assertEqual(self.user.email, "testuser@example.com")





"""
from django.test import TestCase
from accounts.models import CustomUser

class CustomUserModelTest(TestCase):
    def test_user_creation(self):
        # Créer un utilisateur standard
        user = CustomUser.objects.create_user(
            username="testuser",
            password="testpass",
            role="user"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.role, "user")
        self.assertTrue(user.check_password("testpass"))

    def test_admin_creation(self):
        # Créer un administrateur
        admin = CustomUser.objects.create_superuser(
            username="adminuser",
            password="adminpass",
            role="admin"
        )
        self.assertEqual(admin.username, "adminuser")
        self.assertEqual(admin.role, "admin")
        self.assertTrue(admin.is_superuser)

        """
