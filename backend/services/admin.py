from django.contrib import admin
from services.models import Service,ServiceCategory,ProviderService
# Register your models here.

admin.site.register(Service)
admin.site.register(ServiceCategory)
admin.site.register(ProviderService)