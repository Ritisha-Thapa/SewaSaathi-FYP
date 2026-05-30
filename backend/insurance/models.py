from django.db import models
from django.conf import settings
from base.models import BaseModel
from booking.models import Booking


class InsurancePool(BaseModel):
    current_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_contributed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_paid_out = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    def __str__(self):
        return f"Insurance Pool — Balance: {self.current_balance}"

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

    REFUND_STATUS_CHOICES = (
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("admin_notified", "Admin Notified"),
        ("fully_resolved", "Fully Resolved"),
        ("rejected", "Rejected"),
    )

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="claims")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="claims")
    description = models.TextField()
    evidence = models.FileField(upload_to="claim_evidence/")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    resolution = models.CharField(max_length=20, choices=RESOLUTION_CHOICES, default="none")
    timestamp = models.DateTimeField(auto_now_add=True)

    # Refund tracking
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    pool_deducted = models.BooleanField(default=False)
    shortfall = models.BooleanField(default=False)
    admin_notified_at = models.DateTimeField(null=True, blank=True)
    admin_resolved_at = models.DateTimeField(null=True, blank=True)
    refund_status = models.CharField(max_length=20, choices=REFUND_STATUS_CHOICES, default="pending")

    def __str__(self):
        return f"Claim for Booking #{self.booking.id} - {self.status}"
