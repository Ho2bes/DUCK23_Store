from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework.test import APIClient as Client
from rest_framework import status

class BasicTests(TestCase):
    def test_server_is_running(self):
        """ Vérifie si le serveur est en ligne en testant une route valide. """
        client = APIClient()
        response = client.get('/api/healthcheck/')  # URL mise à jour
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ServerTests(TestCase):
        def test_nonexistent_route(self):
            client = APIClient()
            response = client.get('/api/nonexistent-route/')
            self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
