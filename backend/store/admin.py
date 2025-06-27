"""
on enregistre les modèles dans l'interface d'administration de Django
on utilise admin.site.register pour chaque modèle que l'on souhaite gérer via l'admin
on importe les modèles Product, Cart, Order, OrderItem et CartItem

"""
from django.contrib import admin
from .models import Product, Cart, Order, OrderItem, CartItem

# Enregistrer les modèles dans l'interface admin
admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(CartItem)
