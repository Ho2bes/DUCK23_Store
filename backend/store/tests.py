from django.test import TestCase
from store.models import Product, Cart, CartItem
from accounts.models import CustomUser

class ProductModelTest(TestCase):
    def test_product_creation(self):
        # Créer un produit
        product = Product.objects.create(
            name="Test Product",
            price=50.0,
            stock=10
        )
        self.assertEqual(product.name, "Test Product")
        self.assertEqual(product.price, 50.0)
        self.assertEqual(product.stock, 10)

class CartModelTest(TestCase):
    def test_cart_creation(self):
        # Créer un utilisateur et un panier associé
        user = CustomUser.objects.create_user(
            username="testuser",
            password="testpass",
            role="user"
        )
        cart = Cart.objects.create(user=user)
        self.assertEqual(cart.user.username, "testuser")
        self.assertEqual(cart.items.count(), 0)  # Vérifier que le panier est vide

    def test_add_product_to_cart(self):
        # Créer un produit, un utilisateur et un panier
        product = Product.objects.create(
            name="Test Product",
            price=50.0,
            stock=10
        )
        user = CustomUser.objects.create_user(
            username="testuser",
            password="testpass",
            role="user"
        )
        cart = Cart.objects.create(user=user)

        # Ajouter un produit au panier via CartItem
        CartItem.objects.create(cart=cart, product=product, quantity=2)
        cart_items = cart.items.all()  # Utiliser related_name "items"

        self.assertEqual(cart_items.count(), 1)
        self.assertEqual(cart_items.first().product.name, "Test Product")
        self.assertEqual(cart_items.first().quantity, 2)

    def test_cart_total_price(self):
        # Créer des produits, un utilisateur et un panier
        product1 = Product.objects.create(
            name="Test Product 1",
            price=50.0,
            stock=10
        )
        product2 = Product.objects.create(
            name="Test Product 2",
            price=30.0,
            stock=5
        )
        user = CustomUser.objects.create_user(
            username="testuser",
            password="testpass",
            role="user"
        )
        cart = Cart.objects.create(user=user)

        # Ajouter des produits au panier via CartItem
        CartItem.objects.create(cart=cart, product=product1, quantity=2)
        CartItem.objects.create(cart=cart, product=product2, quantity=1)

        # Calculer le prix total
        total_price = sum(item.product.price * item.quantity for item in cart.items.all())

        self.assertEqual(total_price, 130.0)  # 2 * 50.0 + 1 * 30.0
