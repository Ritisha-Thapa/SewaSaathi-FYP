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
        ("paid", "Paid"),
        ("cancelled", "Cancelled"),
        ("not_accepted", "Not Accepted"),
        ("rejected", "Rejected"),
        ("refunded", "Refunded"),
    )

    COMMISSION_STATUS = (
        ("collected", "Collected"),  # Khalti
        ("due", "Due"),              # COD — provider owes platform
        ("received", "Received"),    # COD — provider paid commission
    )

    PAYOUT_STATUS = (
        ("pending", "Pending"),           # Khalti — platform owes provider
        ("sent", "Sent"),                 # Khalti — sent to provider
        ("not_applicable", "N/A"),        # COD — no platform payout needed
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

    address = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    completed_at = models.DateTimeField(null=True, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    # Prices
    service_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_note = models.TextField(blank=True, null=True)
    insurance_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    # Commission ledger (populated when booking is paid)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    provider_payout_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    commission_status = models.CharField(max_length=20, choices=COMMISSION_STATUS, null=True, blank=True)
    payout_status = models.CharField(max_length=20, choices=PAYOUT_STATUS, null=True, blank=True)

    cancelled_by = models.CharField(
        max_length=10,
        choices=(("customer", "Customer"), ("provider", "Provider")),
        null=True,
        blank=True,
    )

    payment_method = models.CharField(
        max_length=20,
        choices=(("cash", "Cash"), ("online", "Online"), ("khalti_v2", "Khalti")),
        null=True,
        blank=True,
        default=None,
    )
    is_paid = models.BooleanField(default=False)
    is_rework = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        was_just_paid = False

        # Recalculate pricing
        if self.final_price is not None:
            self.insurance_fee = self.final_price * Decimal('0.01')
            self.total_price = self.final_price + self.insurance_fee
        elif not self.total_price:
            self.insurance_fee = self.service_price * Decimal('0.01')
            self.total_price = self.service_price + self.insurance_fee

        if not is_new:
            old = Booking.objects.get(pk=self.pk)

            if old.status != 'completed' and self.status == 'completed':
                from django.utils import timezone
                self.completed_at = timezone.now()
                if self.total_price == 0:
                    self.is_paid = True

            if self.is_paid and not old.is_paid:
                was_just_paid = True

            if self.is_paid and not self.paid_at:
                from django.utils import timezone
                self.paid_at = timezone.now()

        super().save(*args, **kwargs)

        # Add to insurance pool on new booking (1% contribution)
        if is_new:
            from insurance.models import InsurancePool
            pool, _ = InsurancePool.objects.get_or_create(id=1)
            pool.current_balance += self.insurance_fee
            pool.total_contributed += self.insurance_fee
            pool.save()

        # Record commission split when booking is paid
        if was_just_paid:
            from revenue.models import PlatformRevenue
            from django.db import transaction as db_transaction
            with db_transaction.atomic():
                PlatformRevenue.record_for_booking(self)


class ProviderBookingResponse(BaseModel):
    """Tracks a provider declining a pending job without changing booking status."""

    RESPONSE_DECLINED = "declined"
    RESPONSE_CHOICES = ((RESPONSE_DECLINED, "Declined"),)

    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="provider_responses",
    )
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="booking_responses",
        limit_choices_to={"role": "provider"},
    )
    response = models.CharField(
        max_length=20,
        choices=RESPONSE_CHOICES,
        default=RESPONSE_DECLINED,
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["booking", "provider"],
                name="unique_provider_booking_response",
            )
        ]

    def __str__(self):
        return f"{self.provider_id} declined booking #{self.booking_id}"


class Review(BaseModel):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="review")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews_given")
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews_received", limit_choices_to={"role": "provider"})
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Review by {self.customer.username} for {self.provider.username} - {self.rating} Stars"
