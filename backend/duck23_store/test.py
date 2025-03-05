from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser

class BasicTests(TestCase):
    def test_server_is_running(self):
        client = APIClient()
        response = client.get('/api/accounts/user-info/')  # ✅ Utiliser un endpoint valide
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_401_UNAUTHORIZED])

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'testuser@example.com',
        }
        self.user = CustomUser.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=self.user)

    def test_update_user(self):
        new_data = {"username": "updateduser"}
        response = self.client.put('/api/accounts/update/', new_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()  # ✅ Rafraîchir l'objet utilisateur
        self.assertEqual(self.user.username, "updateduser")

    def test_partial_update(self):
        new_data = {"username": "partialupdate"}
        response = self.client.patch('/api/accounts/update/', new_data)  # ✅ PATCH au lieu de PUT
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.user.refresh_from_db()
        self.assertEqual(self.user.username, "partialupdate")
