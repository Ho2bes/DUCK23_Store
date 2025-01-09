from django.test import TestCase
from accounts.models import CustomUser

class CustomUserModelTest(TestCase):
    def test_user_creation(self):
        # Créer un utilisateur standard
        user = CustomUser.objects.create_user(
            username="testuser",
            password="testpass",
            role="user"
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.role, "user")
        self.assertTrue(user.check_password("testpass"))

    def test_admin_creation(self):
        # Créer un administrateur
        admin = CustomUser.objects.create_superuser(
            username="adminuser",
            password="adminpass",
            role="admin"
        )
        self.assertEqual(admin.username, "adminuser")
        self.assertEqual(admin.role, "admin")
        self.assertTrue(admin.is_superuser)
