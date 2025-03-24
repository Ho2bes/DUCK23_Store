#on importe les modules nécessaires pour créer des vues avec Django REST Framework (DRF)
from rest_framework import viewsets, permissions # On importe les classes viewsets et permissions de DRF
from rest_framework.response import Response # On importe la classe Response de DRF pour renvoyer des réponses HTTP
from rest_framework.decorators import action # On importe le décorateur action de DRF pour créer des actions personnalisées
from django.shortcuts import get_object_or_404 # On importe la fonction get_object_or_404 pour récupérer un objet ou renvoyer une erreur 404
from .models import Product, Cart, CartItem # On importe les modèles Product, Cart et CartItem
from .serializers import ProductSerializer, CartSerializer, CartItemSerializer # On importe les sérialiseurs correspondants
from django.contrib.auth import get_user_model # On importe la fonction get_user_model pour récupérer le modèle d'utilisateur personnalisé
from rest_framework.permissions import IsAdminUser, AllowAny # On importe les permissions IsAdminUser et AllowAny de DRF
from rest_framework.authentication import SessionAuthentication # On importe l'authentification par session de DRF
from rest_framework_simplejwt.authentication import JWTAuthentication  # On importe l'authentification JWT

# ✅ Gestion des Produits
class ProductViewSet(viewsets.ModelViewSet): # On crée une classe ProductViewSet qui hérite de la classe ModelViewSet de DRF
    queryset = Product.objects.all() # On spécifie la requête pour récupérer tous les produits
    serializer_class = ProductSerializer # On spécifie le sérialiseur à utiliser pour les produits

    def get_permissions(self): # 🔒 Gestion des permissions
        """Permet la lecture des produits à tout le monde, mais l’édition seulement aux admins""" # On définit la méthode get_permissions pour gérer les permissions
        if self.action in ['list', 'retrieve']:  # GET (list, retrieve) # On vérifie si l'action est une lecture
            permission_classes = [AllowAny]  # Tout le monde peut voir les produits # On spécifie les permissions pour les actions de lecture

        else:  # POST, PUT, DELETE (create, update, destroy) # On vérifie si l'action est une modification
            permission_classes = [IsAdminUser]  # Seuls les admins peuvent modifier les produits # On spécifie les permissions pour les actions de modification
        return [permission() for permission in permission_classes] # On retourne les permissions

# ✅ Gestion du Panier
class CartViewSet(viewsets.ViewSet): # On crée une classe CartViewSet qui hérite de la classe ViewSet de DRF
    # authentication_classes = [SessionAuthentication]  # Utiliser l'authentification par session
    permission_classes = [permissions.IsAuthenticated]  # 🔒 Accès réservé aux utilisateurs connectés

    def initialize_request(self, request, *args, **kwargs): # On définit une méthode pour initialiser la requête
        # Cette méthode est appelée pour chaque requête entrante
        print(f"✅ CartViewSet: initialize_request appelé")  # DEBUG # On affiche un message de débogage
        print(f"✅ User: {request.user}, est authentifié: {request.user.is_authenticated}") # DEBUG # On affiche l'utilisateur et son statut d'authentification
        print(f"✅ Session key: {request.session.session_key}")

        # Important: toujours appeler la méthode parent
        return super().initialize_request(request, *args, **kwargs) # On retourne la requête initialisée

    def get_cart(self, user): # On définit une méthode pour récupérer le panier de l'utilisateur ou le créer s'il n'existe pas
        """🔎 Récupère le panier de l'utilisateur ou le crée s'il n'existe pas"""
        cart, created = Cart.objects.get_or_create(user=user) # On récupère le panier de l'utilisateur ou on le crée s'il n'existe pas
        return cart # On retourne le panier

    @action(detail=False, methods=['get']) # On crée une action personnalisée pour afficher le panier
    def my_cart(self, request): # On définit une méthode pour afficher le panier de l'utilisateur connecté
        """🔎 Affiche le panier de l'utilisateur connecté"""
        print(f"🔍 Requête panier pour l'utilisateur : {request.user}")

        cart = self.get_cart(request.user) # On récupère le panier de l'utilisateur
        serializer = CartSerializer(cart) # On crée une instance du sérialiseur CartSerializer avec le panier
        return Response(serializer.data) # On renvoie les données du panier

    @action(detail=False, methods=['post']) # On crée une action personnalisée pour ajouter un produit au panier
    def add_product(self, request): # On définit une méthode pour ajouter un produit au panier de l'utilisateur connecté
        """🛒 Ajoute un produit au panier de l'utilisateur connecté"""
        print(f"DEBUG: Session ID: {request.session.session_key}")
        print(f"DEBUG: User: {request.user}")
        print(f"DEBUG: Is authenticated: {request.user.is_authenticated}")
        product_id = request.data.get('product_id') # On récupère l'ID du produit à ajouter
        quantity = request.data.get('quantity', 1) # On récupère la quantité du produit (par défaut 1)
        if not product_id: # On vérifie si l'ID du produit est manquant
            return Response({"error": "Aucun produit spécifié."}, status=400) # On renvoie une erreur si l'ID du produit est manquant

        cart = self.get_cart(request.user) # On récupère le panier de l'utilisateur

        try: # On essaie d'ajouter le produit au panier
            product = get_object_or_404(Product, id=product_id) # On récupère le produit avec l'ID spécifié

            # Vérifier si le produit est déjà dans le panier
            cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product) # On récupère l'item du panier ou on le crée s'il n'existe pas
            cart_item.quantity += int(quantity) # On ajoute la quantité spécifiée
            cart_item.save() # On enregistre les modifications

            print(f"✅ Produit {product.name} ajouté au panier de {request.user}")  # DEBUG

            return Response({ # On renvoie une réponse avec un message de succès et les données du panier
                "message": f"{quantity} x {product.name} ajouté au panier.", # Message de succès
                "cart": CartSerializer(cart).data # Données du panier
            }, status=200) # Code de statut HTTP 200 (OK)

        except Exception as e: #
            return Response({"error": str(e)}, status=500) # On renvoie une erreur avec le message d'erreur

    @action(detail=False, methods=['patch']) # On crée une action personnalisée pour mettre à jour la quantité d'un produit dans le panier
    def update_product(self, request): # On définit une méthode pour mettre à jour la quantité d'un produit dans le panier
        """✏️ Met à jour la quantité d’un produit dans le panier"""
        product_id = request.data.get('product_id') # On récupère l'ID du produit à mettre à jour
        quantity = request.data.get('quantity') # On récupère la nouvelle quantité du produit

        if not product_id or quantity is None: # On vérifie si l'ID du produit et la quantité sont manquants
            return Response({"error": "Produit et quantité requis."}, status=400) # On renvoie une erreur si l'ID du produit ou la quantité sont manquants

        cart = self.get_cart(request.user) # On récupère le panier de l'utilisateur

        try: # On essaie de mettre à jour la quantité du produit dans le panier
            cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id) # On récupère l'item du panier avec l'ID du produit
            cart_item.quantity = int(quantity)  # On met à jour la quantité du produit
            cart_item.save() # On enregistre les modifications
            return Response({ # On renvoie une réponse avec un message de succès et les données du panier
                "message": f"Quantité mise à jour pour {cart_item.product.name}.", # Message de succès
                "cart": CartSerializer(cart).data # Données du panier
            }, status=200) # Code de statut HTTP 200 (OK)

        except CartItem.DoesNotExist:   # Si l'item du panier n'existe pas
            return Response({"error": "Produit non trouvé dans le panier."}, status=404) # On renvoie une erreur avec un message d'erreur

    @action(detail=False, methods=['delete']) # On crée une action personnalisée pour supprimer un produit du panier
    def remove_product(self, request): # On définit une méthode pour supprimer un produit du panier
        """🗑️ Supprime un produit du panier"""
        product_id = request.query_params.get('product_id') # On récupère l'ID du produit à supprimer

        if not product_id: # On vérifie si l'ID du produit est manquant
            return Response({"error": "Produit requis."}, status=400) # On renvoie une erreur si l'ID du produit est manquant

        cart = self.get_cart(request.user) # On récupère le panier de l'utilisateur

        try: # On essaie de supprimer le produit du panier
            cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id) # On récupère l'item du panier avec l'ID du produit
            cart_item.delete() # On supprime l'item du panier
            return Response({ # On renvoie une réponse avec un message de succès et les données du panier
                "message": f"{cart_item.product.name} retiré du panier.", # Message de succès
                "cart": CartSerializer(cart).data # Données du panier
            }, status=200) # Code de statut HTTP 200 (OK)

        except CartItem.DoesNotExist: # Si l'item du panier n'existe pas
            return Response({"error": "Produit non trouvé dans le panier."}, status=404)

    @action(detail=False, methods=['delete']) # On crée une action personnalisée pour vider complètement le panier
    def clear_cart(self, request): # On définit une méthode pour vider complètement le panier de l'utilisateur
        """🧹 Vide complètement le panier de l'utilisateur"""
        cart = self.get_cart(request.user) # On récupère le panier de l'utilisateur
        cart.items.all().delete() # On supprime tous les items du panier
        return Response({"message": "Le panier a été vidé."}, status=200) # On renvoie un message de succès
