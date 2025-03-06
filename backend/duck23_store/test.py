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

        def test_server_error_handling(self):
            client = Client()
        # Simuler une erreur interne en appelant une vue qui lève une exception
            response = client.get('/api/trigger-internal-error/')
            self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

        def test_health_check(self):
            client = Client()
            response = client.get('/api/healthcheck/')
            self.assertEqual(response.status_code, status.HTTP_200_OK)
            self.assertEqual(response.data, {"status": "ok"})
