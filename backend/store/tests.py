from django.test import TestCase, Client
from rest_framework import status
from store.models import Product
from accounts.models import CustomUser

class ProductTests(TestCase):
    def setUp(self):
        self.client = Client()
        self.admin = CustomUser.objects.create_superuser(username="admin", email="admin@example.com", password="adminpassword")
        self.user = CustomUser.objects.create_user(username="testuser", email="testuser@example.com", password="testpassword")
        self.product = Product.objects.create(name="Test Product", price=100, stock=10)

    def test_get_product_list(self):
        response = self.client.get('/api/store/products/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_single_product(self):
        response = self.client.get(f'/api/store/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], self.product.name)

    def test_create_product(self):
        """Test de création de produit avec un utilisateur admin"""
        self.client.login(username="admin", password="adminpassword")  # Correction du mot de passe

        payload = {
            "name": "New Product",
            "description": "A great product",  # Ajout de la description
            "price": 50,
            "stock": 20
        }
        response = self.client.post('/api/store/products/', payload, content_type="application/json")

        if response.status_code != status.HTTP_201_CREATED:
            print("🔴 Erreur API:", response.data)  # Debug

        self.assertIn(response.status_code, [status.HTTP_201_CREATED, status.HTTP_200_OK])


    def test_update_product(self):
        """Test de mise à jour de produit avec un utilisateur admin"""
        self.client.login(username="admin", password="adminpassword")
        response = self.client.put(f'/api/store/products/{self.product.id}/', {
            "name": "Updated Product",
            "description": "Updated description",  # Ajout de la description si nécessaire
            "price": 120,
            "stock": 5
        }, content_type="application/json")
        self.assertIn(response.status_code, [status.HTTP_200_OK, status.HTTP_204_NO_CONTENT, status.HTTP_201_CREATED])


    def test_delete_product(self):
        """Test de suppression de produit avec un utilisateur admin"""
        self.client.login(username="admin", password="adminpassword")
        response = self.client.delete(f'/api/store/products/{self.product.id}/')
        self.assertIn(response.status_code, [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK])

    def test_create_product_non_admin(self):
        self.client.login(username="testuser", password="testpassword")
        response = self.client.post('/api/store/products/', {
            "name": "New Product",
            "price": 50,
            "stock": 20
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_update_product_stock(self):
        self.client.login(username="admin", password="adminpassword")
        response = self.client.put(f'/api/store/products/{self.product.id}/', {
            "name": "Updated Product",
            "price": 120,
            "stock": 15,
            "description": "Updated description"  # Ajoutez ce champ si nécessaire
        }, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.product.refresh_from_db()
        self.assertEqual(self.product.stock, 15)

    def test_invalid_product_data(self):
        self.client.login(username="admin", password="adminpassword")
        response = self.client.post('/api/store/products/', {
            "name": "",
            "price": -10,
            "stock": "invalid"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_delete_product(self):
        self.client.login(username="admin", password="adminpassword")
        response = self.client.delete(f'/api/store/products/{self.product.id}/')
        self.assertIn(response.status_code, [status.HTTP_204_NO_CONTENT, status.HTTP_200_OK])

    def test_create_product_non_admin(self):
        self.client.login(username="testuser", password="testpassword")
        response = self.client.post('/api/store/products/', {
            "name": "New Product",
            "price": 50,
            "stock": 20
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_product_non_admin(self):
        self.client.login(username="testuser", password="testpassword")
        response = self.client.delete(f'/api/store/products/{self.product.id}/')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_product_invalid_data(self):
        self.client.login(username="admin", password="adminpassword")
        response = self.client.post('/api/store/products/', {
            "name": "",
            "price": -10,
            "stock": "invalid"
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_product_with_missing_data(self):
        """Test pour vérifier la création d'un produit avec des données manquantes"""
        self.client.login(username="admin", password="adminpassword")
        response = self.client.post('/api/store/products/', {
            "name": "New Product",
            "price": 50,
        # "stock" est manquant
        }, content_type="application/json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
