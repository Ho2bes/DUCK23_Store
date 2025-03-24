# On importe des outils nécessaires pour créer des vues API avec Django REST Framework
from django.http import JsonResponse # On importe la fonction JsonResponse pour renvoyer des réponses JSON
from rest_framework.views import APIView # On importe la classe APIView de DRF pour créer des vues API
from rest_framework.response import Response # On importe la classe Response de DRF pour renvoyer des réponses HTTP
from rest_framework import status, permissions # On importe les classes status et permissions de DRF pour les codes HTTP et les permissions
from django.contrib.auth import authenticate, login, logout # On importe les fonctions pour l'authentification et la connexion
from .models import CustomUser # On importe notre modèle CustomUser
from .serializers import RegisterSerializer, UpdateUserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie

# ✅ Enregistrement (register)
class RegisterUserView(APIView): # On crée une classe RegisterUserView qui hérite de la classe APIView de DRF
    permission_classes = [permissions.AllowAny] # On spécifie les permissions pour cette vue (ici, pas besoin d'être authentifié)

    def post(self, request): # On définit une méthode pour gérer les requêtes POST
        serializer = RegisterSerializer(data=request.data) # On crée une instance de notre sérialiseur RegisterSerializer avec les données de la requête
        if serializer.is_valid(): # On vérifie si les données sont valides
            user = serializer.save() # On enregistre l'utilisateur avec la méthode save() du sérialiseur
            # Connexion automatique après inscription
            login(request, user) # On connecte l'utilisateur automatiquement après son inscription
            return Response({"message": "Inscription et connexion réussies."}, status=status.HTTP_201_CREATED) # On renvoie un message de succès
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # On renvoie les erreurs si les données ne sont pas valides


# ✅ Connexion (login) avec authentification par session
class LoginUserView(APIView): # On crée une classe LoginUserView qui hérite de la classe APIView de DRF
    permission_classes = [permissions.AllowAny] # On spécifie les permissions pour cette vue (ici, pas besoin d'être authentifié)

    def post(self, request): # On définit une méthode pour gérer les requêtes POST
        username = request.data.get("username") # On récupère le nom d'utilisateur de la requête
        password = request.data.get("password") # On récupère le mot de passe de la requête

        user = authenticate(username=username, password=password) # On authentifie l'utilisateur avec les identifiants fournis
        if user is not None:    # Si l'utilisateur est authentifié
            login(request, user) # On connecte l'utilisateur
            return JsonResponse({"message": "Utilisateur connecté avec succès."}) # On renvoie un message de succès

        return Response({"error": "Identifiants invalides."}, status=status.HTTP_401_UNAUTHORIZED) # On renvoie une erreur si l'authentification échoue


# ✅ Déconnexion (logout)
class LogoutUserView(APIView): # On crée une classe LogoutUserView qui hérite de la classe APIView de DRF
    permission_classes = [permissions.IsAuthenticated] # On spécifie les permissions pour cette vue (ici, l'utilisateur doit être authentifié)

    def post(self, request):    # On définit une méthode pour gérer les requêtes POST
        logout(request) # On déconnecte l'utilisateur
        return JsonResponse({"message": "Utilisateur déconnecté avec succès."}) # On renvoie un message de succès


# ✅ Récupération des informations utilisateur (GET /user-info/)
class UserInfoView(APIView): # On crée une classe UserInfoView qui hérite de la classe APIView de DRF
    permission_classes = [permissions.IsAuthenticated] # On spécifie les permissions pour cette vue (ici, l'utilisateur doit être authentifié)

    def get(self, request): # On définit une méthode pour gérer les requêtes GET
        print("🔍 Utilisateur authentifié:", request.user)  # On affiche l'utilisateur authentifié dans la console
        print(f"✅ Utilisateur {request.user} connecté, session_key: {request.session.session_key}") # On affiche la clé de session dans la console

        if request.user.is_authenticated: # Si l'utilisateur est authentifié
            serializer = UpdateUserSerializer(request.user) # On crée une instance du sérialiseur UpdateUserSerializer avec l'utilisateur authentifié
            return Response(serializer.data, status=status.HTTP_200_OK) # On renvoie les données de l'utilisateur

        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED) # On renvoie une erreur si l'utilisateur n'est pas authentifié


# ✅ Mise à jour des informations utilisateur (PUT /update/)
class UpdateUserView(APIView): # On crée une classe UpdateUserView qui hérite de la classe APIView de DRF
    permission_classes = [permissions.IsAuthenticated] # On spécifie les permissions pour cette vue (ici, l'utilisateur doit être authentifié)

    def put(self, request): # On définit une méthode pour gérer les requêtes PUT
        user = request.user # On récupère l'utilisateur authentifié
        serializer = UpdateUserSerializer(user, data=request.data, partial=True, context={'request': request}) # On crée une instance du sérialiseur UpdateUserSerializer avec les données de la requête
        if serializer.is_valid(): # On vérifie si les données sont valides
            serializer.save() # On enregistre les modifications
            return Response({"message": "User updated successfully."}, status=status.HTTP_200_OK) # On renvoie un message de succès
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) # On renvoie les erreurs si les données ne sont pas valides


# ✅ Suppression du compte utilisateur
class DeleteUserView(APIView): # On crée une classe DeleteUserView qui hérite de la classe APIView de DRF
    permission_classes = [permissions.IsAuthenticated] # On spécifie les permissions pour cette vue (ici, l'utilisateur doit être authentifié)

    def delete(self, request): # On définit une méthode pour gérer les requêtes DELETE
        user = request.user # On récupère l'utilisateur authentifié
        user.delete() # On supprime le compte utilisateur
        logout(request)  # Déconnexion après suppression du compte
        return JsonResponse({"message": "User deleted successfully."}) # On renvoie un message de succès
