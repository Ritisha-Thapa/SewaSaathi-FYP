from decimal import Decimal
from django.db import models
from django.conf import settings
from base.models import BaseModel
from services.models import Service

# Create your models here.
class Booking(BaseModel):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("assigned", "Assigned"),
        ("accepted", "Accepted"),
        ("in_progress", "In Progress"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
        ("rejected", "Rejected"),
    )

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="bookings"
    )

    service = models.ForeignKey(Service, on_delete=models.PROTECT)

    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={"role": "provider"}
    )

    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    
    issue_description = models.TextField(blank=True, null=True)
    issue_images = models.ImageField(upload_to="booking_issues/", blank=True, null=True)

    # Added fields for explicit location and contact if different from profile
    address = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    # Prices
    service_price = models.DecimalField(max_digits=10, decimal_places=2, default=0) # Price of service at booking time
    insurance_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0) # 1% of service_price
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0) # service_price + insurance_fee

    payment_method = models.CharField(
        max_length=20,
        choices=(("cash", "Cash"), ("online", "Online")),
        default="cash"
    )
    is_paid = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        # Calculate pricing on save if not set
        if not self.total_price:
            self.insurance_fee = self.service_price * Decimal('0.01')  # 1% insurance
            self.total_price = self.service_price + self.insurance_fee
        super().save(*args, **kwargs)
