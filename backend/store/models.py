from django.db import models
from django.utils.timezone import now
from django.contrib.auth import get_user_model

# Représente un produit dans le store
class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    # Réduire le stock lorsqu'un produit est commandé
    def reduce_stock(self, quantity):
        if self.stock >= quantity:
            self.stock -= quantity
            self.save()
        else:
            raise ValueError("Stock insuffisant !")


# Représente un panier lié à un utilisateur
class Cart(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

    # Calcul du total du panier
    def get_total_price(self):
        return sum(item.product.price * item.quantity for item in self.items.all())


# Représente un produit ajouté à un panier
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart}"


# Représente une commande passée par un utilisateur
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('shipped', 'Expédiée'),
        ('delivered', 'Livrée'),
        ('canceled', 'Annulée'),
    ]

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Order {self.id} by {self.user.username} ({self.status})"

    # Calcul automatique du prix total
    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())

    # Validation de la commande
    def confirm_order(self):
        for item in self.items.all():
            item.product.reduce_stock(item.quantity)  # Réduit le stock des produits
        self.save()


# Représente un produit dans une commande
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"

    # Calcul automatique du prix total par item
    def get_total_price(self):
        return self.product.price * self.quantity
