from django.urls import path
from .views import RegisterUserView, LoginUserView, LogoutUserView, UpdateUserView, DeleteUserView, UserInfoView, RefreshTokenView
urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('logout/', LogoutUserView.as_view(), name='logout'),
    path('update/', UpdateUserView.as_view(), name='update'),
    path('delete/', DeleteUserView.as_view(), name='delete'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
    path('refresh-token/', RefreshTokenView.as_view(), name='refresh-token'),  # ✅ Ajouté ici
]
