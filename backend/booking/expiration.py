from datetime import datetime

from django.utils import timezone

from .models import Booking
from .validators import SERVICE_TZ


def expire_pending_bookings():
    """
    Keep unassigned bookings pending until the scheduled slot passes, then mark not_accepted.
    Normalize legacy 'rejected' rows back to pending while the slot is still in the future.
    """
    now = timezone.now().astimezone(SERVICE_TZ)
    candidates = Booking.objects.filter(
        status__in=["pending", "rejected"],
        provider__isnull=True,
    )

    for booking in candidates:
        scheduled_dt = datetime.combine(
            booking.scheduled_date,
            booking.scheduled_time,
            tzinfo=SERVICE_TZ,
        )
        if now >= scheduled_dt:
            if booking.status != "not_accepted":
                booking.status = "not_accepted"
                booking.save(update_fields=["status", "updated_at"])
        elif booking.status == "rejected":
            booking.status = "pending"
            booking.save(update_fields=["status", "updated_at"])
