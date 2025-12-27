from django.db import models
from django.conf import settings
from base.models import BaseModel
from services.models import Service

# Create your models here.
class Booking(BaseModel):
    STATUS_CHOICES = (
        ("requested", "Requested"),
        ("assigned", "Assigned"),
        ("accepted", "Accepted"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
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

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="requested")

    estimated_price = models.DecimalField(max_digits=10, decimal_places=2)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    insurance_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    payment_method = models.CharField(
        max_length=20,
        choices=(("cash", "Cash"), ("online", "Online")),
        default="cash"
    )
