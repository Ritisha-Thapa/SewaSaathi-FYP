from django.contrib import admin
from .forms import ServiceAdminForm, ServiceCategoryAdminForm
from .models import Service, ServiceCategory


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    form = ServiceCategoryAdminForm
    list_display = ("name_key", "slug", "updated_at")
    search_fields = ("name_key", "slug")
    readonly_fields = ("slug", "created_at", "updated_at")
    fieldsets = (
        ("Basic Info", {"fields": ("name_key", "description_key", "image")}),
        ("System", {"fields": ("slug", "created_at", "updated_at")}),
    )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    form = ServiceAdminForm
    list_display = ("name_key", "category", "base_price", "pricing_type", "updated_at")
    list_filter = ("category", "pricing_type")
    search_fields = ("name_key", "category__name_key")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("Basic Info", {"fields": ("category", "name_key", "description_key", "base_price", "pricing_type", "image")}),
        ("System", {"fields": ("created_at", "updated_at")}),
    )


