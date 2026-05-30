from django.db import models
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


