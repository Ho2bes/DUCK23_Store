# on importe les classes Product, Cart et CartItem du fichier models.py
from rest_framework import serializers # On importe le module serializers de Django REST Framework (DRF)
from .models import Product, Cart, CartItem # On importe les modèles Product, Cart et CartItem

class ProductSerializer(serializers.ModelSerializer): # On crée une classe ProductSerializer qui hérite de la classe ModelSerializer de DRF
    class Meta: # On définit la classe Meta pour spécifier le modèle et les champs à sérialiser
        model = Product # On spécifie le modèle Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'created_at', 'updated_at'] # On spécifie les champs à sérialiser

class CartItemSerializer(serializers.ModelSerializer): # On crée une classe CartItemSerializer qui hérite de la classe ModelSerializer de DRF
    product = ProductSerializer(read_only=True)  # Afficher les détails du produit
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True) # Champ pour l'ID du produit

    class Meta: # On définit la classe Meta pour spécifier le modèle et les champs à sérialiser
        model = CartItem # On spécifie le modèle CartItem
        fields = ['id', 'product', 'product_id', 'quantity'] # On spécifie les champs à sérialiser

class CartSerializer(serializers.ModelSerializer): # On crée une classe CartSerializer qui hérite de la classe ModelSerializer de DRF
    items = CartItemSerializer(many=True, read_only=True)  # Afficher les items du panier

    class Meta: # On définit la classe Meta pour spécifier le modèle et les champs à sérialiser
        model = Cart # On spécifie le modèle Cart
        fields = ['id', 'user', 'items'] # On spécifie les champs à sérialiser
