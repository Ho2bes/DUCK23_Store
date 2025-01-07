from django.http import JsonResponse

def home_view(request):
    return JsonResponse({"message": "Welcome to the DUCK23 Store API"})

def test_view(request):
    return JsonResponse({"message": "Test successful"})
