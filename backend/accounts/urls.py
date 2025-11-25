from django.contrib import admin
from django.urls import path
from . views import CustomerRegisterView, ProviderRegisterView, LoginView

urlpatterns = [

    path('customer-registration/', CustomerRegisterView.as_view(), name='customer_registration' ),
    path('provider-registration/', ProviderRegisterView.as_view(), name='provider_registration' ),
    path('login/', LoginView.as_view(), name='login' ),
]
