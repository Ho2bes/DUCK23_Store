from rest_framework import serializers
from .models import Product, Cart, CartItem

"""
On crée un sérialiseur pour le modèle Product
Ce sérialiseur va nous permettre de convertir les instances du modèle Product en JSON
et vice versa, ce qui est utile pour les API RESTful.

"""
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock', 'created_at', 'updated_at']

"""
On crée un sérialiseur pour le modèle CartItem
Ce sérialiseur va nous permettre de convertir les instances du modèle CartItem en JSON

"""
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity']

"""
On crée un sérialiseur pour le modèle Cart
Ce sérialiseur va nous permettre de convertir les instances du modèle Cart en JSON
et d'inclure les items du panier avec leurs détails de produit.

"""
class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items']
