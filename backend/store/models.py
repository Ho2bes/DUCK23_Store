# on définit ici les modèles de données de l'application store
from django.db import models # On importe le module models de Django
from django.utils.timezone import now # On importe la fonction now() pour récupérer la date et l'heure actuelles
from django.contrib.auth import get_user_model # On importe la fonction get_user_model pour récupérer le modèle d'utilisateur personnalisé

# Représente un produit dans le store
class Product(models.Model): # On crée une classe Product qui hérite de la classe Model de Django
    name = models.CharField(max_length=255) # Champ pour le nom du produit
    description = models.TextField() # Champ pour la description du produit
    price = models.DecimalField(max_digits=10, decimal_places=2) # Champ pour le prix du produit
    stock = models.IntegerField() # Champ pour le stock du produit
    created_at = models.DateTimeField(auto_now_add=True) # Date de création
    updated_at = models.DateTimeField(auto_now=True) # Date de mise à jour

    def __str__(self): # Méthode pour afficher le nom du produit dans l'administration
        return self.name # On retourne le nom du produit

    # Réduire le stock lorsqu'un produit est commandé
    def reduce_stock(self, quantity): # On définit une méthode pour réduire le stock du produit
        if self.stock >= quantity: # On vérifie si le stock est suffisant
            self.stock -= quantity # On réduit le stock du produit
            self.save() # On enregistre les modifications
        else: # Si le stock est insuffisant
            raise ValueError("Stock insuffisant !") # On lève une exception avec un message d'erreur


# Représente un panier lié à un utilisateur
class Cart(models.Model): # On crée une classe Cart qui hérite de la classe Model de Django
    user = models.OneToOneField(get_user_model(), on_delete=models.CASCADE) # Champ pour l'utilisateur associé au panier
    created_at = models.DateTimeField(auto_now_add=True) # Date de création

    def __str__(self): # Méthode pour afficher le nom du panier dans l'administration
        return f"Cart of {self.user.username}" # On retourne le nom du panier

    # Calcul du total du panier
    def get_total_price(self): # On définit une méthode pour calculer le prix total du panier
        return sum(item.product.price * item.quantity for item in self.items.all()) # On retourne la somme des prix des produits multipliés par leur quantité


# Représente un produit ajouté à un panier
class CartItem(models.Model): # On crée une classe CartItem qui hérite de la classe Model de Django
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items') # Champ pour le panier associé au produit
    product = models.ForeignKey(Product, on_delete=models.CASCADE) # Champ pour le produit associé
    quantity = models.PositiveIntegerField(default=1) # Champ pour la quantité du produit

    def __str__(self): # Méthode pour afficher le nom du produit dans le panier
        return f"{self.quantity} x {self.product.name} in {self.cart}" # On retourne la quantité et le nom du produit


# Représente une commande passée par un utilisateur
class Order(models.Model): # On crée une classe Order qui hérite de la classe Model de Django
    STATUS_CHOICES = [ # Choix pour le statut de la commande
        ('pending', 'En attente'), # Commande en attente
        ('shipped', 'Expédiée'), # Commande expédiée
        ('delivered', 'Livrée'), # Commande livrée
        ('canceled', 'Annulée'), # Commande
    ]

    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE) # Champ pour l'utilisateur associé à la commande
    created_at = models.DateTimeField(auto_now_add=True) # Date de création
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending') # Champ pour le statut de la commande

    def __str__(self): # Méthode pour afficher le nom de la commande dans l'administration
        return f"Order {self.id} by {self.user.username} ({self.status})" # On retourne le numéro de commande, le nom de l'utilisateur et le statut

    # Calcul automatique du prix total
    def get_total_price(self):  # On définit une méthode pour calculer le prix total de la commande
        return sum(item.get_total_price() for item in self.items.all()) # On retourne la somme des prix totaux des produits

    # Validation de la commande
    def confirm_order(self): # On définit une méthode pour valider la commande
        for item in self.items.all(): # Pour chaque produit dans la commande
            item.product.reduce_stock(item.quantity)  # Réduit le stock des produits
        self.save() # Enregistre les modifications


# Représente un produit dans une commande
class OrderItem(models.Model): # On crée une classe OrderItem qui hérite de la classe Model de Django
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items') # Champ pour la commande associée au produit
    product = models.ForeignKey(Product, on_delete=models.CASCADE) # Champ pour le produit associé
    quantity = models.PositiveIntegerField(default=1) # Champ pour la quantité du produit

    def __str__(self): # Méthode pour afficher le nom du produit dans la commande
        return f"{self.quantity} x {self.product.name} in Order {self.order.id}" # On retourne la quantité et le nom du produit

    # Calcul automatique du prix total par item
    def get_total_price(self): # On définit une méthode pour calculer le prix total du produit
        return self.product.price * self.quantity # On retourne le prix du produit multiplié par sa quantité
