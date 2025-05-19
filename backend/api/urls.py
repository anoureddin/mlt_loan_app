from django.urls import path
from .views import list_requests, add_request, delete_request


urlpatterns = [
    path('requests/', list_requests),
    path('requests/add/', add_request),
    path('requests/delete/<int:pk>/', delete_request),
]

