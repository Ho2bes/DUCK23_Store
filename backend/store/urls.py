"""
on créé les routes pour l'application store
ces routes sont utilisées pour accéder aux vues de l'application via l'API REST
on utilise DefaultRouter de Django REST Framework pour gérer les routes automatiquement
on enregistre les vues ProductViewSet et CartViewSet pour les produits et le panier

"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CartViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='product')
router.register(r'cart', CartViewSet, basename='cart')

urlpatterns = [
    path('', include(router.urls)),  # Routes API REST
]
