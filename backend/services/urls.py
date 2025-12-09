from django.urls import path
from .views import ServiceCategoryViewSet, ServiceViewSet

urlpatterns = [

    path('service-categories/', ServiceCategoryViewSet.as_view({'get': 'list', 'post': 'create'}), name='services-category-list'),
    path('service-categories/<str:pk>/', ServiceCategoryViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='service-category-detail'),
    
    path('services/', ServiceViewSet.as_view({'get': 'list', 'post': 'create'}), name='services-list'),
    path('services/<str:pk>/', ServiceViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='service-detail'),

]

