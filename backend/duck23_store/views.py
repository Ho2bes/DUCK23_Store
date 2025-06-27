"""
on définit les vues de l'application DUCK23 Store
ces vues sont utilisées pour gérer les requêtes HTTP et renvoyer des réponses JSON

"""

from django.http import JsonResponse

def home_view(request):
    return JsonResponse({"message": "Welcome to the DUCK23 Store API"})

def test_view(request):
    return JsonResponse({"message": "Test successful"})
