# Create your views here.
from .models import ServiceCategory, Service
from .serializers import ServiceCategorySerializer, ServiceSerializer
from rest_framework.viewsets import ModelViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .utils import ServiceFilter
from .provider_category import get_services_for_provider




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
    search_fields = ["name_key", "category__name_key"]
    ordering_fields = ["base_price", "name_key"]
    ordering = ["name_key"]



class ProviderCategoryServicesView(APIView):
    """Return all catalog services for the authenticated provider's signup category."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role != "provider":
            return Response(
                {"detail": "Only providers can access category services."},
                status=status.HTTP_403_FORBIDDEN,
            )

        services = get_services_for_provider(user)
        serializer = ServiceSerializer(services, many=True, context={"request": request})
        return Response(serializer.data)

