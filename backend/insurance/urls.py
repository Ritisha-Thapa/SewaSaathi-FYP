from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InsuranceClaimViewSet, InsurancePoolViewSet

router = DefaultRouter()
router.register(r'claims', InsuranceClaimViewSet, basename='insurance-claim')
router.register(r'pool', InsurancePoolViewSet, basename='insurance-pool')

urlpatterns = [
    path('', include(router.urls)),
]
