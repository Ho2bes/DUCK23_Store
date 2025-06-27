"""
on importe la fonction JsonResponse pour renvoyer des réponses JSON
on importe la classe APIView de DRF pour créer des vues API
on importe la classe Response de DRF pour renvoyer des réponses HTTP
on importe les classes status et permissions de DRF pour les codes HTTP et les permissions
"""
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login, logout
from .models import CustomUser
from .serializers import RegisterSerializer, UpdateUserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie

"""
On crée une vue pour l'inscription (register) des utilisateurs
Cette vue hérite de la classe APIView de Django REST Framework (DRF)
On utilise le sérialiseur RegisterSerializer pour valider et enregistrer les données de l'utilisateur

"""
class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            login(request, user)
            return Response({"message": "Inscription et connexion réussies."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
On crée une vue pour la connexion (login) des utilisateurs
Cette vue hérite de la classe APIView de Django REST Framework (DRF)
On utilise la fonction authenticate pour vérifier les identifiants de l'utilisateur
On utilise la fonction login pour connecter l'utilisateur si les identifiants sont valides

"""
class LoginUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({"message": "Utilisateur connecté avec succès."})

        return Response({"error": "Identifiants invalides."}, status=status.HTTP_401_UNAUTHORIZED)


"""
On crée une vue pour la déconnexion (logout) des utilisateurs
Cette vue hérite de la classe APIView de Django REST Framework (DRF)
On utilise la fonction logout pour déconnecter l'utilisateur

"""
class LogoutUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return JsonResponse({"message": "Utilisateur déconnecté avec succès."})


"""
On crée une vue pour afficher les informations de l'utilisateur authentifié
Cette vue hérite de la classe APIView de Django REST Framework (DRF)
On utilise le sérialiseur UpdateUserSerializer pour renvoyer les données de l'utilisateur

"""
class UserInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        print("🔍 Utilisateur authentifié:", request.user)
        print(f"✅ Utilisateur {request.user} connecté, session_key: {request.session.session_key}") # On affiche les informations de l'utilisateur authentifié et la clé de session

        if request.user.is_authenticated:
            serializer = UpdateUserSerializer(request.user) # On crée une instance du sérialiseur UpdateUserSerializer avec l'utilisateur authentifié
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)


"""
On crée une vue pour mettre à jour les informations de l'utilisateur authentifié
Cette vue hérite de la classe APIView de Django REST Framework (DRF)
On utilise le sérialiseur UpdateUserSerializer pour valider et enregistrer les modifications apportées

"""

class UpdateUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UpdateUserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


"""
On crée une vue pour supprimer le compte utilisateur
Cette vue hérite de la classe APIView de Django REST Framework (DRF)
On utilise la fonction logout pour déconnecter l'utilisateur après la suppression de son compte

"""
class DeleteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        logout(request)
        return JsonResponse({"message": "User deleted successfully."}) 
