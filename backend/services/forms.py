from django import forms

from .models import ProviderService, Service, ServiceCategory


class TranslationAdminMixin(forms.ModelForm):
    name_ne = forms.CharField(label="Name (Nepali)", required=False)
    description_ne = forms.CharField(
        label="Description (Nepali)",
        required=False,
        widget=forms.Textarea(attrs={"rows": 4}),
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        translations_name = getattr(self.instance, "name_translations", {}) or {}
        translations_description = getattr(self.instance, "description_translations", {}) or {}
        self.fields["name_ne"].initial = translations_name.get("ne", "")
        self.fields["description_ne"].initial = translations_description.get("ne", "")

    def save(self, commit=True):
        instance = super().save(commit=False)

        name_translations = dict(instance.name_translations or {})
        if self.cleaned_data.get("name_ne"):
            name_translations["ne"] = self.cleaned_data["name_ne"]
        else:
            name_translations.pop("ne", None)
        instance.name_translations = name_translations

        description_translations = dict(instance.description_translations or {})
        if self.cleaned_data.get("description_ne"):
            description_translations["ne"] = self.cleaned_data["description_ne"]
        else:
            description_translations.pop("ne", None)
        instance.description_translations = description_translations

        if commit:
            instance.save()
            self.save_m2m()
        return instance


class ServiceCategoryAdminForm(TranslationAdminMixin):
    class Meta:
        model = ServiceCategory
        fields = [
            "name",
            "description",
            "image",
            "name_ne",
            "description_ne",
        ]


class ServiceAdminForm(TranslationAdminMixin):
    class Meta:
        model = Service
        fields = [
            "category",
            "name",
            "description",
            "base_price",
            "pricing_type",
            "image",
            "name_ne",
            "description_ne",
        ]


class ProviderServiceAdminForm(forms.ModelForm):
    class Meta:
        model = ProviderService
        fields = "__all__"
