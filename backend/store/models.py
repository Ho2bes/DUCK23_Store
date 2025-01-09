from django.db import models
from django.utils.timezone import now
from django.contrib.auth import get_user_model


# Représente un produit dans le store
class Product(models.Model):
    # Nom du produit, limité à 255 caractères
    name = models.CharField(max_length=255)

    # Description détaillée du produit
    description = models.TextField()

    # Prix du produit, avec un maximum de 10 chiffres dont 2 décimales
    price = models.DecimalField(max_digits=10, decimal_places=2)

    # Quantité disponible en stock
    stock = models.IntegerField()

    # Date de création du produit, ajoutée automatiquement lors de la création
    created_at = models.DateTimeField(auto_now_add=True)

    # Date de dernière mise à jour du produit, mise à jour automatiquement
    updated_at = models.DateTimeField(auto_now=True)

    # Représentation sous forme de chaîne (utile pour l'interface admin et le shell)
    def __str__(self):
        return self.name


# Représente un panier lié à un utilisateur
class Cart(models.Model):
    # Utilisateur propriétaire du panier, avec suppression en cascade si l'utilisateur est supprimé
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    # Date de création du panier
    created_at = models.DateTimeField(auto_now_add=True)

    # Représentation sous forme de chaîne (affiche le propriétaire du panier)
    def __str__(self):
        return f"Cart of {self.user.username}"


# Représente un produit ajouté à un panier
class CartItem(models.Model):
    # Lien vers le panier auquel appartient cet article
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')

    # Lien vers le produit ajouté au panier
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    # Quantité du produit dans le panier, par défaut 1
    quantity = models.PositiveIntegerField(default=1)

    # Représentation sous forme de chaîne (affiche la quantité et le produit dans le panier)
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in {self.cart}"


# Représente une commande passée par un utilisateur
class Order(models.Model):
    # Utilisateur ayant passé la commande
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)

    # Date de création de la commande
    created_at = models.DateTimeField(auto_now_add=True)

    # Total de la commande (somme des produits multipliés par leur quantité)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    # Représentation sous forme de chaîne (affiche l'ID de la commande et l'utilisateur)
    def __str__(self):
        return f"Order {self.id} by {self.user.username}"


# Représente un produit dans une commande
class OrderItem(models.Model):
    # Lien vers la commande à laquelle appartient cet article
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')

    # Lien vers le produit commandé
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    # Quantité du produit dans la commande, par défaut 1
    quantity = models.PositiveIntegerField(default=1)

    # Représentation sous forme de chaîne (affiche la quantité et le produit dans la commande)
    def __str__(self):
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}"
