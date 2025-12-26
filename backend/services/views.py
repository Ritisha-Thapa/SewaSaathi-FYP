from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import ServiceCategory, Service, ProviderService
from .serializers import ServiceCategorySerializer, ServiceSerializer, ProviderServiceSerializer
from .permissions import IsProvider


class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["name", "created_at"]
    ordering = ["name"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return [AllowAny()]


class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.select_related("category").all()
    serializer_class = ServiceSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category__id", "pricing_type"]
    search_fields = ["name", "category__name"]
    ordering_fields = ["base_price", "created_at"]
    ordering = ["created_at"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return [AllowAny()]


class ProviderServiceViewSet(viewsets.ModelViewSet):
    queryset = ProviderService.objects.select_related("provider", "service").all()
    serializer_class = ProviderServiceSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["service__id", "is_available", "pricing_type"]
    search_fields = ["service__name", "provider__first_name", "provider__last_name", "provider__phone"]
    ordering_fields = ["price", "rating", "created_at"]
    ordering = ["price"]

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsProvider()]
        return [AllowAny()]

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated and user.role == "provider":
            return self.queryset.filter(provider=user)
        return self.queryset
