from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User

class BasicTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_server_is_running(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class UserTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_user(self):
        response = self.client.post('/api/register/', {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_user(self):
        self.client.post('/api/register/', {
            'username': 'testuser',
            'password': 'testpassword'
        })
        response = self.client.post('/api/token/', {
            'username': 'testuser',
            'password': 'testpassword'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_update_user(self):
        user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=user)
        response = self.client.patch('/api/user/', {'email': 'newemail@test.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_user(self):
        user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=user)
        response = self.client.delete('/api/user/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
