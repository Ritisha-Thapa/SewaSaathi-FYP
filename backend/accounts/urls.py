from django.contrib import admin
from django.urls import path
from .views import CustomerRegisterView, ProviderRegisterView, LoginView, ForgotPasswordView, VerifyOTPView, ResetPasswordView

urlpatterns = [

    path('customer-registration/', CustomerRegisterView.as_view(), name='customer_registration' ),
    path('provider-registration/', ProviderRegisterView.as_view(), name='provider_registration' ),
    path('login/', LoginView.as_view(), name='login' ),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset_password'),

]
