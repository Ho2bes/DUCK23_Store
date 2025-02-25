from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import RegisterSerializer, UpdateUserSerializer

# ✅ Enregistrement (register)
class RegisterUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User registered successfully."}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Connexion (login) avec stockage des tokens dans les cookies sécurisés
class LoginUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            response = JsonResponse({"message": "User logged in successfully."})
            response["Access-Control-Allow-Credentials"] = "true"  # 🔥 Autoriser les credentials
            response["Access-Control-Allow-Origin"] = "http://localhost:4200"  # 🔥 Ajuster selon le front
            response.set_cookie(
                key="accessToken",
                value=str(access_token),
                httponly=False,
                secure=False,
                samesite="Lax",
                max_age=900
            )
            response.set_cookie(
                key="refreshToken",
                value=str(refresh),
                httponly=False,
                secure=False,
                samesite="Lax",
                max_age=86400
            )

            print("✅ Cookies envoyés :", response.cookies)  # 🔥 Debug

            return response

        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


# ✅ Rafraîchissement du token (refresh) basé sur le cookie refreshToken
class RefreshTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.COOKIES.get("refreshToken")

        if not refresh_token:
            return Response({"error": "No refresh token provided."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            new_access_token = token.access_token

            response = JsonResponse({"message": "Token refreshed successfully."})
            response.set_cookie(
                key="accessToken",
                value=str(new_access_token),
                httponly=False,
                secure=False,
                samesite="Lax",
                max_age=900  # 15 minutes
            )
            return response
        except Exception:
            return Response({"error": "Invalid or expired refresh token."}, status=status.HTTP_401_UNAUTHORIZED)


# ✅ Déconnexion (logout) en supprimant les cookies contenant les tokens
class LogoutUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        response = JsonResponse({"message": "User logged out successfully."})

        # ✅ Supprimer les cookies
        response.delete_cookie("accessToken")
        response.delete_cookie("refreshToken")

        return response


# ✅ Récupération des informations utilisateur (GET /user-info/)
class UserInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        print("🔍 Cookies reçus dans Django:", request.COOKIES)  # 🔥 Debug
        print("🔍 Authorization Header:", request.headers.get("Authorization"))  # 🔥 Debug
        print("🔍 Utilisateur authentifié:", request.user)  # 🔥 Debug

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
        response = JsonResponse({"message": "User deleted successfully."})

        # ✅ Supprimer les cookies après suppression de compte
        response.delete_cookie("accessToken")
        response.delete_cookie("refreshToken")

        return response
