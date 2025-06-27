"""
on importe les classes nécessaires de Django REST Framework (DRF) pour créer des vues API.
on importe les modèles Product, Cart et CartItem pour interagir avec la base de données.
on importe les sérialiseurs ProductSerializer, CartSerializer et CartItemSerializer pour convertir les
données des modèles en JSON et vice versa.
on importe les classes de permissions IsAdminUser et AllowAny pour gérer les permissions d'accès aux
vues.
on importe la classe SessionAuthentication pour l'authentification par session.
on importe la classe JWTAuthentication pour l'authentification JWT.
"""
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from .models import Product, Cart, CartItem
from .serializers import ProductSerializer, CartSerializer, CartItemSerializer
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.authentication import SessionAuthentication
from rest_framework_simplejwt.authentication import JWTAuthentication

"""
On crée une vue pour la déconnexion (logout) des utilisateurs
Cette vue hérite de la classe APIView de Django REST Framework (DRF)
On utilise la fonction logout pour déconnecter l'utilisateur
"""

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_permissions(self):
        """Permet la lecture des produits à tout le monde, mais l’édition seulement aux admins"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]

        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

"""
On crée une vue pour gérer le panier des utilisateurs
Cette vue hérite de la classe ViewSet de Django REST Framework (DRF)
Cette vue permet aux utilisateurs de consulter, ajouter, mettre à jour et supprimer des produits dans leur
panier.
On utilise le modèle Cart pour représenter le panier de l'utilisateur et le modèle CartItem pour
représenter les produits dans le panier.

"""

class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def initialize_request(self, request, *args, **kwargs):
        print(f"✅ CartViewSet: initialize_request appelé")
        print(f"✅ User: {request.user}, est authentifié: {request.user.is_authenticated}")
        print(f"✅ Session key: {request.session.session_key}")

        return super().initialize_request(request, *args, **kwargs)

    def get_cart(self, user):
        """🔎 Récupère le panier de l'utilisateur ou le crée s'il n'existe pas"""
        cart, created = Cart.objects.get_or_create(user=user)
        return cart

    @action(detail=False, methods=['get'])
    def my_cart(self, request):
        """🔎 Affiche le panier de l'utilisateur connecté"""
        print(f"🔍 Requête panier pour l'utilisateur : {request.user}")

        cart = self.get_cart(request.user)
        serializer = CartSerializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_product(self, request):
        """🛒 Ajoute un produit au panier de l'utilisateur connecté"""
        print(f"DEBUG: Session ID: {request.session.session_key}")
        print(f"DEBUG: User: {request.user}")
        print(f"DEBUG: Is authenticated: {request.user.is_authenticated}")
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity', 1)
        if not product_id:
            return Response({"error": "Aucun produit spécifié."}, status=400)

        cart = self.get_cart(request.user)

        try:
            product = get_object_or_404(Product, id=product_id)

            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product) # On récupère l'item du panier ou on le crée s'il n'existe pas
            cart_item.quantity += int(quantity)
            cart_item.save()

            print(f"✅ Produit {product.name} ajouté au panier de {request.user}")

            return Response({
                "message": f"{quantity} x {product.name} ajouté au panier.",
                "cart": CartSerializer(cart).data
            }, status=200)

        except Exception as e: #
            return Response({"error": str(e)}, status=500)

    @action(detail=False, methods=['patch']) # On crée une action personnalisée pour mettre à jour la quantité d’un produit dans le panier
    def update_product(self, request):
        """✏️ Met à jour la quantité d’un produit dans le panier"""
        product_id = request.data.get('product_id')
        quantity = request.data.get('quantity')

        if not product_id or quantity is None:
            return Response({"error": "Produit et quantité requis."}, status=400)

        cart = self.get_cart(request.user)

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

    @action(detail=False, methods=['delete']) # On crée une action personnalisée pour supprimer un produit du panier
    def remove_product(self, request):
        """🗑️ Supprime un produit du panier"""
        product_id = request.query_params.get('product_id')

        if not product_id:
            return Response({"error": "Produit requis."}, status=400)

        cart = self.get_cart(request.user)

        try:
            cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
            cart_item.delete()
            return Response({
                "message": f"{cart_item.product.name} retiré du panier.",
                "cart": CartSerializer(cart).data
            }, status=200)

        except CartItem.DoesNotExist:
            return Response({"error": "Produit non trouvé dans le panier."}, status=404)

    @action(detail=False, methods=['delete']) # On crée une action personnalisée pour vider complètement le panier
    def clear_cart(self, request):
        """🧹 Vide complètement le panier de l'utilisateur"""
        cart = self.get_cart(request.user)
        cart.items.all().delete()
        return Response({"message": "Le panier a été vidé."}, status=200)
