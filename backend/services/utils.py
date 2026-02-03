import django_filters
from .models import Service,ProviderService, ServiceCategory

class ServiceFilter(django_filters.FilterSet):
    # Multi-select for category
    category = django_filters.ModelMultipleChoiceFilter(queryset=ServiceCategory.objects.all(),field_name='category')

    # Price range filters
    min_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='lte')

    class Meta:
        model = Service
        fields = ['category', 'min_price', 'max_price']



class ProviderServiceFilter(django_filters.FilterSet):
    # Price range
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    
    # Service name (partial match)
    service_name = django_filters.CharFilter(field_name="service__name", lookup_expr="icontains")
    
    # Rating (exact or you could add min_rating, max_rating)
    min_rating = django_filters.NumberFilter(field_name="rating", lookup_expr="gte")
    max_rating = django_filters.NumberFilter(field_name="rating", lookup_expr="lte")
    
    # Availability
    is_available = django_filters.BooleanFilter(field_name="is_available")
    
    class Meta:
        model = ProviderService
        fields = []  # all filters are custom defined above
