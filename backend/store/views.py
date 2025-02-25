from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Product, Cart, CartItem
from .serializers import ProductSerializer, CartSerializer, CartItemSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser, AllowAny

# ✅ Gestion des Produits
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


# ✅ Gestion du Panier
class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]  # 🔒 Accès réservé aux utilisateurs connectés

    def get_cart(self, user):
        """🔎 Récupère le panier de l'utilisateur ou le crée s'il n'existe pas"""
        cart, created = Cart.objects.get_or_create(user=user)
        return cart

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """🔎 Affiche le panier de l'utilisateur connecté"""
        print(f"🔍 Requête panier pour l'utilisateur : {request.user}")  # DEBUG

        if not request.user.is_authenticated:
            return Response({"error": "Utilisateur non authentifié."}, status=401)

        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_product(self, request):
        """🛒 Ajoute un produit au panier de l'utilisateur connecté"""
        if not request.user.is_authenticated:
            return Response({"error": "Utilisateur non authentifié."}, status=401)

        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)

        if not product_id:
            return Response({"error": "Aucun produit spécifié."}, status=400)

        try:
            product = get_object_or_404(Product, id=product_id)

            # Vérifier si le produit est déjà dans le panier
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
            cart_item.quantity += int(quantity)
            cart_item.save()

            print(f"✅ Produit {product.name} ajouté au panier de {request.user}")  # DEBUG

            return Response({
                "message": f"{quantity} x {product.name} ajouté au panier.",
                "cart": CartSerializer(cart).data
            }, status=200)

        except Product.DoesNotExist:
            return Response({"error": "Produit introuvable."}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['patch'])
    def update_product(self, request):
        """✏️ Met à jour la quantité d’un produit dans le panier"""
        if not request.user.is_authenticated:
            return Response({"error": "Utilisateur non authentifié."}, status=401)

        cart = self.get_cart(request.user)
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        if not product_id or quantity is None:
            return Response({"error": "Produit et quantité requis."}, status=400)

        try:
            cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
            cart_item.quantity = int(quantity)
            cart_item.save()
            return Response({
                "message": f"Quantité mise à jour pour {cart_item.product.name}.",
                "cart": CartSerializer(cart).data
            }, status=200)

        except CartItem.DoesNotExist:
            return Response({"error": "Produit non trouvé dans le panier."}, status=404)

    @action(detail=False, methods=['delete'])
    def remove_product(self, request):
        """🗑️ Supprime un produit du panier"""
        if not request.user.is_authenticated:
            return Response({"error": "Utilisateur non authentifié."}, status=401)

        cart = self.get_cart(request.user)
        product_id = request.query_params.get('product_id')  # ✅ Corrigé : Prendre `product_id` dans `query_params`

        if not product_id:
            return Response({"error": "Produit requis."}, status=400)

        try:
            cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
            cart_item.delete()
            return Response({
                "message": f"{cart_item.product.name} retiré du panier.",
                "cart": CartSerializer(cart).data
            }, status=200)

        except CartItem.DoesNotExist:
            return Response({"error": "Produit non trouvé dans le panier."}, status=404)

    @action(detail=False, methods=['delete'])
    def clear_cart(self, request):
        """🧹 Vide complètement le panier de l'utilisateur"""
        if not request.user.is_authenticated:
            return Response({"error": "Utilisateur non authentifié."}, status=401)

        cart = self.get_cart(request.user)
        cart.items.all().delete()
        return Response({"message": "Le panier a été vidé."}, status=200)
