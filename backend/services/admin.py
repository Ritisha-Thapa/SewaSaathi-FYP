from django.contrib import admin

from .forms import ProviderServiceAdminForm, ServiceAdminForm, ServiceCategoryAdminForm
from .models import ProviderService, Service, ServiceCategory


@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    form = ServiceCategoryAdminForm
    list_display = ("name", "slug", "has_nepali_translation", "updated_at")
    search_fields = ("name", "slug")
    readonly_fields = ("slug", "created_at", "updated_at")
    fieldsets = (
        ("English", {"fields": ("name", "description", "image")}),
        ("Nepali", {"fields": ("name_ne", "description_ne")}),
        ("System", {"fields": ("slug", "created_at", "updated_at")}),
    )

    @admin.display(boolean=True, description="Has Nepali")
    def has_nepali_translation(self, obj):
        return bool((obj.name_translations or {}).get("ne"))


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    form = ServiceAdminForm
    list_display = ("name", "category", "base_price", "pricing_type", "has_nepali_translation", "updated_at")
    list_filter = ("category", "pricing_type")
    search_fields = ("name", "category__name")
    readonly_fields = ("created_at", "updated_at")
    fieldsets = (
        ("English", {"fields": ("category", "name", "description", "base_price", "pricing_type", "image")}),
        ("Nepali", {"fields": ("name_ne", "description_ne")}),
        ("System", {"fields": ("created_at", "updated_at")}),
    )

    @admin.display(boolean=True, description="Has Nepali")
    def has_nepali_translation(self, obj):
        return bool((obj.name_translations or {}).get("ne"))


@admin.register(ProviderService)
class ProviderServiceAdmin(admin.ModelAdmin):
    form = ProviderServiceAdminForm
    list_display = ("provider", "service", "price", "pricing_type", "is_available", "rating")
    list_filter = ("pricing_type", "is_available")
    search_fields = ("provider__phone", "provider__email", "service__name")
