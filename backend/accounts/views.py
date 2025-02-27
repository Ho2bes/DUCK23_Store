from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate, login, logout
from .models import CustomUser
from .serializers import RegisterSerializer, UpdateUserSerializer
from django.views.decorators.csrf import ensure_csrf_cookie

# ✅ Enregistrement (register)
class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Connexion automatique après inscription
            login(request, user)
            return Response({"message": "Inscription et connexion réussies."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Connexion (login) avec authentification par session
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


# ✅ Déconnexion (logout)
class LogoutUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        logout(request)
        return JsonResponse({"message": "Utilisateur déconnecté avec succès."})


# ✅ Récupération des informations utilisateur (GET /user-info/)
class UserInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        print("🔍 Utilisateur authentifié:", request.user)  # 🔥 Debug
        print(f"✅ Utilisateur {request.user} connecté, session_key: {request.session.session_key}")

        if request.user.is_authenticated:
            serializer = UpdateUserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response({"error": "Utilisateur non authentifié"}, status=status.HTTP_401_UNAUTHORIZED)


# ✅ Mise à jour des informations utilisateur (PUT /update/)
class UpdateUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = UpdateUserSerializer(user, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User updated successfully."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Suppression du compte utilisateur
class DeleteUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        logout(request)  # Déconnexion après suppression du compte
        return JsonResponse({"message": "User deleted successfully."})