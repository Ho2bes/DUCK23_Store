from django.test import TestCase
from accounts.models import CustomUser
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth import get_user_model

class UpdateUserViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = get_user_model().objects.create_user(
            username="testuser",
            email="testuser@example.com",
            password="password123"
        )
        self.client.force_authenticate(user=self.user)

    def test_update_user(self):
        new_data = {"username": "updateduser"}
        response = self.client.put("/api/accounts/update/", new_data)
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT])  # ✅ Accepter 200 et 204
        self.user.refresh_from_db()  # ✅ Recharge les données avant de tester
        self.assertEqual(self.user.username, "updateduser")

    def test_partial_update(self):
        new_data = {"username": "partialupdate"}
        response = self.client.patch("/api/accounts/update/", new_data)  # ✅ PATCH au lieu de PUT
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT])
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "partialupdate")

class BasicTests(TestCase):
    def test_server_is_running(self):
        client = APIClient()
        response = client.get('/api/healthcheck/')  # ✅ Remplacer `/` par une route existante
        self.assertEqual(response.status_code, status.HTTP_200_OK)
