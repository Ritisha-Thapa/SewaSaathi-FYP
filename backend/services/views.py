from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import ServiceCategory, Service
from .serializers import ServiceCategorySerializer,ServiceSerializer



class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    permission_classes = [AllowAny]


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.select_related("category").all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

    filter_backends = [filters.SearchFilter]
    search_fields = ["name", "category__name"]  # Allows searching both


# class ProviderServiceViewSet(viewsets.ModelViewSet):
#     queryset = ProviderService.objects.select_related("provider", "service").all()
#     serializer_class = ProviderServiceSerializer

#     filter_backends = [filters.SearchFilter, filters.OrderingFilter]
#     search_fields = ["service__name", "provider__first_name", "provider__last_name", "provider__phone"]
#     ordering_fields = ["price", "rating", "created_at"]
#     ordering = ["price"]

#     def get_permissions(self):
#         """
#         Providers must authenticate to create or modify entries.
#         Anyone can list or read.
#         """
#         if self.action in ["create", "update", "partial_update", "destroy"]:
#             return [IsAuthenticated(), IsProvider()]
#         return [AllowAny()]  

#     def get_queryset(self):
#         """
#         Providers only see their own ProviderService listings.
#         Customers & Guests see all.
#         """
#         user = self.request.user
        
#         if user.is_authenticated and user.role == "provider":
#             return self.queryset.filter(provider=user)
#         return self.queryset

