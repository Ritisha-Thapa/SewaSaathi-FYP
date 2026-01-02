from django.urls import path
from .views import ServiceCategoryViewSet, ServiceViewSet, ProviderServiceViewSet

urlpatterns = [

    path('service-categories/', ServiceCategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='services-category-list'),
    path('service-categories/<str:pk>/', ServiceCategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='service-category-detail'),
    
    path('service/', ServiceViewSet.as_view({'get': 'list', 'post': 'create'}), name='services-list'),
    path('service/<str:pk>/', ServiceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='service-detail'),

    path('provider-services/', ProviderServiceViewSet.as_view({'get': 'list', 'post': 'create'}), name='provider-service-list'),
    path('provider-services/<str:pk>/', ProviderServiceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='provider-service-detail'),
]
