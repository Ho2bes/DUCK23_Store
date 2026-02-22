"""
on créé une configuration pour l'application store
cette configuration est utilisée par Django pour gérer l'application
elle hérite de AppConfig de Django

"""
from django.apps import AppConfig


class StoreConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'store'
