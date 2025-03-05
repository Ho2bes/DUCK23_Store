import unittest
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser

class BasicTests(TestCase):
    def test_server_is_running(self):
        client = APIClient()
        response = client.get('/api/health/')  # Remplace '/' par un endpoint valide.
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'testuser@example.com',
        }
        self.user = CustomUser.objects.create_user(**self.user_data)

    def test_login_user(self):
        response = self.client.post('/api/accounts/login/', {
            'username': self.user_data['username'],
            'password': self.user_data['password'],
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.put('/api/accounts/update/', {'username': 'updateduser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Recharger l'utilisateur pour vérifier la mise à jour
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'updateduser')

    def test_partial_update(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.patch('/api/accounts/update/', {'username': 'partialupdate'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Recharger l'utilisateur
        self.user.refresh_from_db()
        self.assertEqual(self.user.username, 'partialupdate')

    def test_delete_user(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.delete('/api/accounts/delete/')

        # Vérifier que la réponse est 204 ou 200 selon l'implémentation
        self.assertIn(response.status_code, [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK])

    def test_register_with_invalid_data(self):
        invalid_data = self.user_data.copy()
        invalid_data['email'] = ''  # Email manquant
        response = self.client.post('/api/accounts/register/', invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
