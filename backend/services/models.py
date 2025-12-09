from django.db import models

# Create your models here.

from django.db import models
from django.conf import settings
from base.models import BaseModel


class ServiceCategory(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Service(BaseModel):
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name="services")
    name = models.CharField(max_length=150)
    description = models.TextField(blank=True, null=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ("category", "name")

    def __str__(self):
        return f"{self.name} - {self.category.name}"
    
    
class ProviderService(BaseModel):
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        limit_choices_to={"role": "provider"},
        related_name="provider_services"
    )
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="provider_services")

    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_available = models.BooleanField(default=True)

    # Auto-updated when reviews come
    rating = models.FloatField(default=0.0)

    class Meta:
        unique_together = ("provider", "service")

    def __str__(self):
        return f"{self.provider.username} → {self.service.name}"


# class ServicePackage(BaseModel):
#     PACKAGE_CHOICES = (
#         ("weekly", "Weekly"),
#         ("monthly", "Monthly"),
#     )

#     provider_service = models.ForeignKey(
#         ProviderService, on_delete=models.CASCADE, related_name="packages"
#     )

#     package_type = models.CharField(max_length=20, choices=PACKAGE_CHOICES)
#     visits_per_month = models.PositiveIntegerField(default=4)
#     price = models.DecimalField(max_digits=10, decimal_places=2)

#     def __str__(self):
#         return f"{self.provider_service.provider.username} - {self.package_type} Package"