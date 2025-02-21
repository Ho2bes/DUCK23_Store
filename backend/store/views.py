from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Product, Cart, CartItem
from .serializers import ProductSerializer, CartSerializer, CartItemSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser, AllowAny


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        """Permet la lecture des produits à tout le monde, mais l’édition seulement aux admins"""
        if self.action in ['list', 'retrieve']:  # GET
            permission_classes = [AllowAny]  # Tout le monde peut voir les produits
        else:  # POST, PUT, DELETE
            permission_classes = [IsAdminUser]  # Seuls les admins peuvent modifier
        return [permission() for permission in permission_classes]

class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [permissions.IsAuthenticated]  # Accès réservé aux utilisateurs connectés

    def get_queryset(self):
        """Récupère uniquement le panier de l’utilisateur connecté"""
        return Cart.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """Associe automatiquement le panier à l’utilisateur connecté"""
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def add_product(self, request, pk=None):
        """Ajoute un produit au panier de l'utilisateur connecté, uniquement pour son propre panier"""
        user = request.user
        try:
            cart = Cart.objects.get(id=pk, user=user)  # Vérifie que le panier appartient bien à l'utilisateur
            product_id = request.data.get('product_id')
            quantity = request.data.get('quantity', 1)

            product = Product.objects.get(id=product_id)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            cart_item.quantity += int(quantity)
            cart_item.save()
            return Response({"message": "Produit ajouté au panier."})
        except Cart.DoesNotExist:
            return Response({"error": "Accès refusé : ce panier ne vous appartient pas."}, status=403)
        except Product.DoesNotExist:
            return Response({"error": "Produit introuvable."}, status=404)

    @action(detail=True, methods=['post'])
    def add_product(self, request, pk=None):
        """Ajoute un produit au panier de l'utilisateur connecté."""
        user = request.user
        cart, created = Cart.objects.get_or_create(user=user)

        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        try:
            product = Product.objects.get(id=product_id)
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            cart_item.quantity += int(quantity)
            cart_item.save()
            return Response({"message": "Produit ajouté au panier."})
        except Product.DoesNotExist:
            return Response({"error": "Produit introuvable."}, status=404)

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """Affiche le panier de l'utilisateur connecté."""
        user = request.user
        cart, created = Cart.objects.get_or_create(user=user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)
