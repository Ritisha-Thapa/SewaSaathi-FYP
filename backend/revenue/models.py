from decimal import Decimal
from django.db import models
from django.conf import settings
from base.models import BaseModel
from booking.models import Booking


class PlatformRevenue(BaseModel):
    COMMISSION_STATUS = (
        ("collected", "Collected"),    # Khalti — money already in platform account
        ("due", "Due"),                # COD — provider owes commission to platform
        ("received", "Received"),      # COD — provider has paid commission to platform
    )
    PAYOUT_STATUS = (
        ("pending", "Pending"),              # Khalti — platform still needs to pay provider
        ("sent", "Sent"),                    # Khalti — platform has paid the provider
        ("not_applicable", "N/A"),           # COD — provider already holds the money
    )

    booking = models.OneToOneField(
        Booking, on_delete=models.CASCADE, related_name="platform_revenue"
    )
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="revenue_records",
        limit_choices_to={"role": "provider"},
    )
    booking_amount = models.DecimalField(max_digits=10, decimal_places=2)
    insurance_deduction = models.DecimalField(max_digits=10, decimal_places=2)
    commission_amount = models.DecimalField(max_digits=10, decimal_places=2)
    provider_payout_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_method = models.CharField(max_length=20)
    commission_status = models.CharField(max_length=20, choices=COMMISSION_STATUS)
    payout_status = models.CharField(max_length=20, choices=PAYOUT_STATUS)
    commission_received_at = models.DateTimeField(null=True, blank=True)
    payout_sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at", "-id"]

    def __str__(self):
        return f"Revenue — Booking #{self.booking_id} | Commission: Rs.{self.commission_amount}"

    @classmethod
    def record_for_booking(cls, booking):
        """
        Create a PlatformRevenue record atomically when a booking is paid.
        Skips if a record already exists (idempotent guard).
        """
        if cls.objects.filter(booking=booking).exists():
            return

        insurance_deduction = booking.insurance_fee
        base = booking.total_price - insurance_deduction  # service/final price
        commission = (base * Decimal("0.10")).quantize(Decimal("0.01"))
        payout = (base * Decimal("0.90")).quantize(Decimal("0.01"))

        is_khalti = booking.payment_method == "khalti_v2"
        commission_status = "collected" if is_khalti else "due"
        payout_status = "pending" if is_khalti else "not_applicable"

        record = cls.objects.create(
            booking=booking,
            provider=booking.provider,
            booking_amount=booking.total_price,
            insurance_deduction=insurance_deduction,
            commission_amount=commission,
            provider_payout_amount=payout,
            payment_method=booking.payment_method,
            commission_status=commission_status,
            payout_status=payout_status,
        )

        # Mirror onto the Booking row for quick access
        Booking.objects.filter(pk=booking.pk).update(
            commission_amount=commission,
            provider_payout_amount=payout,
            commission_status=commission_status,
            payout_status=payout_status,
        )

        # Notify all admins
        _notify_admins_commission(record)
        return record


def _notify_admins_commission(record):
    from accounts.models import User
    from notifications.models import Notification

    booking = record.booking
    provider_name = booking.provider.get_full_name() if booking.provider else "Unknown"

    if record.payout_status == "pending":
        notification_type = "admin_new_payout_pending"
        msg_detail = (
            f"Khalti booking #{booking.id} — provider payout of "
            f"Rs.{record.provider_payout_amount} is pending. Please transfer to {provider_name}."
        )
    else:
        notification_type = "admin_new_commission_due"
        msg_detail = (
            f"COD booking #{booking.id} — commission of "
            f"Rs.{record.commission_amount} is due from {provider_name}."
        )

    admins = User.objects.filter(role="admin", is_active=True)
    for admin in admins:
        Notification.objects.create(
            recipient=admin,
            notification_type=notification_type,
            extra_data={
                "revenue_id": str(record.id),
                "booking_id": str(booking.id),
                "provider_name": provider_name,
                "amount": str(record.commission_amount),
                "payout_amount": str(record.provider_payout_amount),
                "payment_method": record.payment_method,
                "detail": msg_detail,
            },
            booking=booking,
        )
