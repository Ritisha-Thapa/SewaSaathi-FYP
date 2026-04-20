# Create your views here.
from .models import ServiceCategory, Service, ProviderService, ProviderAvailability
from .serializers import ServiceCategorySerializer,ServiceSerializer,ProviderServiceSerializer,ProviderAvailabilitySerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .utils import ServiceFilter,ProviderServiceFilter  




# ModelViewSet has already bundle of logic, it automatically creates api endpoints and others so we are just configuring it, not writing much logic
#API using ModelViewSet
class ServiceCategoryViewSet(ModelViewSet):
    # tala ko attributes should be of same name
    queryset = ServiceCategory.objects.all() # #queryset ma Crud ko logic run hunxa,, all() le model bata data objects ma lera aauxa which cannot be sent to fornted so we need json(need serializer for that)
    serializer_class = ServiceCategorySerializer# mathi aako data will be objects but API requires json so serializer_class lai call garera ServiceCtegorySerialiser call hune vo ani json ma convert

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()] # only admin can use these methods others are just allowed to view
        return [AllowAny()]


class ServiceViewSet(ModelViewSet):
    queryset = Service.objects.select_related("category").all() #Fetch Service and its category in ONE SQL query else it would have quried Service and category again and again 
    serializer_class = ServiceSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUser()]
        return [AllowAny()]
    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_class = ServiceFilter # can filter category and price range at the same time
    search_fields = ["name", "category__name"]
    ordering_fields = ["base_price", "name"]
    ordering = ["name"]


class ProviderServiceViewSet(ModelViewSet):
    serializer_class = ProviderServiceSerializer
    queryset = ProviderService.objects.select_related("provider", "service", "service__category") #fetch related provider and service in one query

    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_class = ProviderServiceFilter  
    search_fields = ["service__name","provider__first_name","provider__last_name","provider__phone",]
    ordering_fields = ["price", "rating", "created_at"]
    ordering = ["created_at"]

    def get_permissions(self):
    # Only logged-in users can access
        return [IsAuthenticated()]

    def get_queryset(self):
        # If the user is a provider, maybe they want to see only their own services via 'me' or just default all.
        # It's better to fetch user-specific services if they provide a query param, e.g., ?my_services=true
        qs = self.queryset
        if self.request.query_params.get('my_services') == 'true' and self.request.user.is_authenticated:
            qs = qs.filter(provider=self.request.user)
        return qs

class ProviderAvailabilityViewSet(ModelViewSet):
    serializer_class = ProviderAvailabilitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = ProviderAvailability.objects.all()
        provider_id = self.request.query_params.get('provider_id')
        if provider_id:
            qs = qs.filter(provider_id=provider_id)
        elif user.role == 'provider':
            qs = qs.filter(provider=user)
        return qs


