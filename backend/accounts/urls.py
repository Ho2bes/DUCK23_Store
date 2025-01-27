from django.urls import path
from .views import RegisterUserView, LoginUserView, LogoutUserView, UpdateUserView, DeleteUserView

urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('logout/', LogoutUserView.as_view(), name='logout'),
    path('update/', UpdateUserView.as_view(), name='update'),
    path('delete/', DeleteUserView.as_view(), name='delete'),
]
