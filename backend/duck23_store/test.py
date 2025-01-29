from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser

class BasicTests(TestCase):
    def test_server_is_running(self):
        client = APIClient()
        response = client.get('/')  # Remplace '/' par un endpoint valide.
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'testuser@example.com',
        }

    def test_register_user(self):
        response = self.client.post('/api/accounts/register/', self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        CustomUser.objects.create_user(**self.user_data)
        response = self.client.post('/api/accounts/login/', {
            'username': self.user_data['username'],
            'password': self.user_data['password'],
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=user)
        response = self.client.put('/api/accounts/update/', {'username': 'updateduser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.username, 'updateduser')

    def test_delete_user(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=user)
        response = self.client.delete('/api/accounts/delete/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_register_with_invalid_data(self):
        invalid_data = self.user_data.copy()
        invalid_data['email'] = ''  # Email manquant
        response = self.client.post('/api/accounts/register/', invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)




"""
from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from accounts.models import CustomUser

class BasicTests(TestCase):
    def test_server_is_running(self):
        client = APIClient()
        response = client.get('/')  # Assure-toi que '/' est un endpoint valide.
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'testuser@example.com',
        }

    def test_register_user(self):
        response = self.client.post('/api/accounts/register/', self.user_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        CustomUser.objects.create_user(**self.user_data)
        response = self.client.post('/api/accounts/login/', {
            'username': self.user_data['username'],
            'password': self.user_data['password'],
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=user)
        response = self.client.put('/api/accounts/update/', {'username': 'updateduser'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertEqual(user.username, 'updateduser')

    def test_delete_user(self):
        user = CustomUser.objects.create_user(**self.user_data)
        self.client.force_authenticate(user=user)
        response = self.client.delete('/api/accounts/delete/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

"""
