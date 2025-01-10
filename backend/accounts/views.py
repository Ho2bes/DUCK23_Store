from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['POST'])
def register_user(request):
    return Response({"message": "Register endpoint fonctionne"})

@api_view(['POST'])
def login_user(request):
    return Response({"message": "Login endpoint fonctionne"})

@api_view(['PUT'])
def update_user(request):
    return Response({"message": "Update endpoint fonctionne"})

@api_view(['DELETE'])
def delete_user(request):
    return Response({"message": "Delete endpoint fonctionne"})

# Create your views here.
