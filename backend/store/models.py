from django.db import models
from django.utils.timezone import now
from django.contrib.auth import get_user_model # On importe la fonction get_user_model pour récupérer le modèle d'utilisateur personnalisé

"""
on crée un modèle de produit pour notre boutique en ligne
ce modèle va nous permettre de gérer les produits avec des informations comme le nom, la description,
le prix, le stock, etc.

"""
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


"""
Représente un panier d'achats pour un utilisateur
Ce modèle va nous permettre de gérer les produits ajoutés au panier par un utilisateur

"""

class Cart(models.Model):
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart of {self.user.username}"

    def get_total_price(self):
        return sum(item.product.price * item.quantity for item in self.items.all())


"""
Représente un produit dans le panier
Ce modèle va nous permettre de gérer les produits ajoutés au panier avec leur quantité

"""
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart}"


"""
On crée un modèle de commande pour gérer les commandes passées par les utilisateurs
Ce modèle va nous permettre de gérer les commandes avec des informations comme l'utilisateur, la date de
création, le statut, etc.
"""
class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'En attente'),
        ('shipped', 'Expédiée'),
        ('delivered', 'Livrée'),
        ('canceled', 'Annulée'),
    ]

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE) # Champ pour l'utilisateur associé à la commande
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Order {self.id} by {self.user.username} ({self.status})"

    def get_total_price(self):
        return sum(item.get_total_price() for item in self.items.all())


    def confirm_order(self):
        for item in self.items.all():
            item.product.reduce_stock(item.quantity)
        self.save()


"""
On crée un modèle d'item de commande pour gérer les produits dans une commande
Ce modèle va nous permettre de gérer les produits commandés avec leur quantité et le prix total

"""

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"


    def get_total_price(self):
        return self.product.price * self.quantity 
