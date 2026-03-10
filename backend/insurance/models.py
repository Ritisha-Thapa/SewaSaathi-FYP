from django.db import models
from django.conf import settings
from base.models import BaseModel
from booking.models import Booking

class InsurancePool(BaseModel):
    total_funds = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Insurance Pool: {self.total_funds}"

    class Meta:
        verbose_name_plural = "Insurance Pool"

class InsuranceClaim(BaseModel):
    STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    )
    
    RESOLUTION_CHOICES = (
        ("none", "None"),
        ("refund", "Refund"),
        ("rework", "Rework"),
    )

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="claims")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="claims")
    description = models.TextField()
    evidence = models.FileField(upload_to="claim_evidence/", blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    resolution = models.CharField(max_length=20, choices=RESOLUTION_CHOICES, default="none")
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Claim for Booking #{self.booking.id} - {self.status}"
