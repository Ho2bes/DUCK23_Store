from django.urls import path
from .views import RegisterUserView, LoginUserView, LogoutUserView, UpdateUserView, DeleteUserView, UserInfoView

"""

This module defines the URL patterns for user account management in the Django application.
It includes paths for user registration, login, logout, profile update, deletion, and viewing user

"""
urlpatterns = [
    path('register/', RegisterUserView.as_view(), name='register'),
    path('login/', LoginUserView.as_view(), name='login'),
    path('logout/', LogoutUserView.as_view(), name='logout'),
    path('update/', UpdateUserView.as_view(), name='update'),
    path('delete/', DeleteUserView.as_view(), name='delete'),
    path('user-info/', UserInfoView.as_view(), name='user-info'),
]
