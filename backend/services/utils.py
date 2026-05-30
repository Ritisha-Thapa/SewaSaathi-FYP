import django_filters
from .models import Service, ServiceCategory


class ServiceFilter(django_filters.FilterSet):
    category = django_filters.ModelMultipleChoiceFilter(queryset=ServiceCategory.objects.all(), field_name='category')
    min_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='base_price', lookup_expr='lte')

    class Meta:
        model = Service
        fields = ['category', 'min_price', 'max_price']
