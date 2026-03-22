from django.urls import path
from .views import admin_analytics_dashboard

urlpatterns = [
    path('dashboard/', admin_analytics_dashboard, name='admin-analytics-dashboard'),
]
