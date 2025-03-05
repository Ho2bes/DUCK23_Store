import unittest
from django.test import TestCase
from django.core.exceptions import ValidationError
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

class CustomUserModelTest(TestCase):
    def test_user_creation(self):
        user = get_user_model().objects.create_user(
            username="testuser",
            password="testpass",
            role="user"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.role, "user")
        self.assertTrue(user.check_password("testpass"))

    def test_admin_creation(self):
        admin = get_user_model().objects.create_superuser(
            username="adminuser",
            password="adminpass",
            role="admin"
        )
        self.assertEqual(admin.username, "adminuser")
        self.assertEqual(admin.role, "admin")
        self.assertTrue(admin.is_superuser)

    def test_invalid_user_creation(self):
        with self.assertRaises(ValidationError):
            user = get_user_model()(username="").full_clean()

        with self.assertRaises(ValueError):
            get_user_model().objects.create_user(username="", password="testpass")

class UpdateUserViewTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123",
        )
        self.client = APIClient()
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client.force_authenticate(user=self.user)

    def test_update_user(self):
        new_data = {"username": "updateduser", "email": "updateduser@example.com"}
        response = self.client.put("/api/accounts/update/", new_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "updateduser")
        self.assertEqual(self.user.email, "updateduser@example.com")

    def test_partial_update(self):
        new_data = {"username": "partialupdate"}
        response = self.client.patch("/api/accounts/update/", new_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "partialupdate")
