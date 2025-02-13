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

# ✅ Connexion (login)
class LoginUserView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        if not username or not password:
            return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            print(refresh.access_token)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "message": "User logged in successfully.",
                },
                status=status.HTTP_200_OK,
            )
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

# ✅ Déconnexion (logout)
class LogoutUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required."}, status=status.HTTP_400_BAD_REQUEST)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "User logged out successfully."}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": "Invalid or expired token.", "details": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# ✅ Récupération des informations utilisateur (GET /user-info/)
class UserInfoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UpdateUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
        return Response({"message": "User deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
