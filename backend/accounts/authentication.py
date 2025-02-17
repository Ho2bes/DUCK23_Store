from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("accessToken")  # 🔥 Récupère le token depuis le cookie

        if not access_token:
            return None  # 🔥 Pas d'auth, Django continue comme si l'utilisateur n'était pas connecté

        validated_token = self.get_validated_token(access_token)  # Vérifie le token

        return self.get_user(validated_token), validated_token
