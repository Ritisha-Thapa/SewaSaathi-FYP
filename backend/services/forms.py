from django import forms
from .models import Service, ServiceCategory


class ServiceCategoryAdminForm(forms.ModelForm):
    class Meta:
        model = ServiceCategory
        fields = [
            "name_key",
            "description_key",
            "image",
        ]


class ServiceAdminForm(forms.ModelForm):
    class Meta:
        model = Service
        fields = [
            "category",
            "name_key",
            "description_key",
            "base_price",
            "pricing_type",
            "image",
        ]


