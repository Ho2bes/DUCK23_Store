from decimal import Decimal
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
et d’ajouter des champs calculés utiles pour l’affichage côté front.
"""
class CartItemSerializer(serializers.ModelSerializer):
    # On inclut les infos du produit (lecture seule)
    product = ProductSerializer(read_only=True)
    # On permet aussi de spécifier un product_id lors de la création (écriture seule)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), write_only=True
    )

    # Prix unitaire issu directement du produit
    unit_price = serializers.DecimalField(
        source='product.price', max_digits=10, decimal_places=2, read_only=True
    )
    # Total de la ligne (quantité × prix unitaire), calculé dynamiquement
    line_total = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'quantity', 'unit_price', 'line_total']

    def get_line_total(self, obj: CartItem) -> str:
        qty = Decimal(obj.quantity or 0)
        price = Decimal(obj.product.price or 0)
        total = qty * price
        return f"{total:.2f}"  # renvoyé comme string formatée (ex: "24.00")


"""
On crée un sérialiseur pour le modèle Cart
Ce sérialiseur inclut les items avec leurs détails (produit, prix unitaire, total de ligne)
et ajoute un champ calculé `total` qui correspond au montant total du panier.
"""
class CartSerializer(serializers.ModelSerializer):
    # On inclut les items du panier
    items = CartItemSerializer(many=True, read_only=True)
    # On ajoute un champ calculé `total` (somme de toutes les lignes)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total']

    def get_total(self, obj: Cart) -> str:
        total = Decimal('0.00')
        for it in obj.items.select_related('product').all():
            qty = Decimal(it.quantity or 0)
            price = Decimal(it.product.price or 0)
            total += qty * price
        return f"{total:.2f}"  # string formatée
