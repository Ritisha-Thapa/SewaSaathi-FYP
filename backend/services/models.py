from django.db import models
from django.conf import settings
from django.utils.text import slugify
from base.models import BaseModel


class ServiceCategory(BaseModel):
    slug = models.SlugField(max_length=120, unique=True, blank=True)
    name_key = models.CharField(max_length=100, unique=True)
    description_key = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="service_categories/", blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name_key) or "category"
            slug = base_slug
            counter = 2
            while ServiceCategory.objects.exclude(pk=self.pk).filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name_key


class Service(BaseModel):
    PRICING_TYPE = (
        ("fixed", "Fixed"),
        ("hourly", "Hourly"),
        ("unit", "Per Unit"),
        ("starting", "Starting From"),
    )

    pricing_type = models.CharField(max_length=20,choices=PRICING_TYPE,default="fixed")

    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name="services")
    name_key = models.CharField(max_length=150)
    description_key = models.TextField(blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="services/", blank=True, null=True)

    class Meta:
        unique_together = ("category", "name_key")

    def __str__(self):
        return f"{self.name_key} - {self.category.name_key}"


class ProviderService(BaseModel):
    provider = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,limit_choices_to={"role": "provider"},related_name="provider_services")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="provider_services")

    pricing_type = models.CharField(max_length=20,choices=Service.PRICING_TYPE,default="fixed")

    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)
    rating = models.FloatField(default=0.0)

    class Meta:
        unique_together = ("provider", "service")

    def __str__(self):
        return f"{self.provider.username} → {self.service.name_key}"

class ProviderAvailability(BaseModel):
    provider = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="availability", limit_choices_to={"role": "provider"})
    # JSONField to store true/false for days: {"Sunday": true, "Monday": true, ...}
    days = models.JSONField(default=dict)
    
    def __str__(self):
        return f"Availability for {self.provider.username}"
