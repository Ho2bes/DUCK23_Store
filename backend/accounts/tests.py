from django.test import TestCase, Client
from rest_framework import status
from accounts.models import CustomUser

class UserTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.user_data = {
            'username': 'testuser',
            'email': 'testuser@example.com',
            'password': 'testpassword'
        }
        self.user = CustomUser.objects.create_user(**self.user_data)

    def test_register_user(self):
        payload = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpassword1'
        }
        response = self.client.post('/api/accounts/register/', payload, content_type="application/json")

        if response.status_code != status.HTTP_201_CREATED:
            print("🔴 Erreur API:", response.data)

        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])



    def test_login_user(self):
        response = self.client.post('/api/accounts/login/', {
            'username': 'testuser',
            'password': 'testpassword',
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("sessionid", response.cookies)

    def test_get_user_info(self):
        """Test pour récupérer les informations utilisateur après login"""
        self.client.login(username="testuser", password="testpassword")
        response = self.client.get('/api/accounts/user-info/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"], "testuser@example.com")

    def test_update_user(self):
        """Test pour mettre à jour l'utilisateur en session"""
        self.client.login(username="testuser", password="testpassword")

        response = self.client.put('/api/accounts/update/',
                               {"username": "updateduser"},
                               content_type="application/json")

        try:
            print("Réponse JSON de l'API:", response.json())
        except ValueError:
            print("La réponse n'est pas en JSON ou est vide.")

        if response.status_code not in [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT]:
            print("🔴 Erreur API:", response.data)


        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT])


        self.assertEqual(response.json().get('message'), 'User updated successfully.')


    def test_delete_user(self):
        """Test pour supprimer un utilisateur après login"""
        self.client.login(username="testuser", password="testpassword")
        response = self.client.delete('/api/accounts/delete/')
        self.assertIn(response.status_code, [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK])

    def test_get_user_profile(self):
        self.client.login(username="testuser", password="testpassword")
        response = self.client.get('/api/accounts/profile/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("username", response.data)
        self.assertEqual(response.data["username"], "testuser")

    def test_get_user_profile(self):
        self.client.login(username="testuser", password="testpassword")
        response = self.client.get('/api/accounts/user-info/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("email", response.data)
        self.assertEqual(response.data["email"], "testuser@example.com")

    def test_invalid_user_profile_data(self):
        self.client.login(username="testuser", password="testpassword")
        response = self.client.put('/api/accounts/update/', {
            "email": "invalid-email"
        }, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_logout_user(self):
        """Test pour déconnecter un utilisateur"""
        self.client.login(username="testuser", password="testpassword")
        response = self.client.post('/api/accounts/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_login_user_with_incorrect_credentials(self):
        """Test pour vérifier la connexion avec des identifiants incorrects"""
        response = self.client.post('/api/accounts/login/', {
            'username': 'testuser',
            'password': 'wrongpassword',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn("sessionid", response.cookies)
