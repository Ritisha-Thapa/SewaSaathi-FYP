from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from django.utils import timezone
from rest_framework import serializers

# Service region timezone — aligns with typical Nepal users (Asia/Kathmandu).
SERVICE_TZ = ZoneInfo("Asia/Kathmandu")
BOOKING_BUFFER = timedelta(hours=1)


def validate_scheduled_slot(scheduled_date, scheduled_time):
    """Reject past dates and same-day slots within the 1-hour booking buffer."""
    now = timezone.now().astimezone(SERVICE_TZ)
    today = now.date()

    if scheduled_date < today:
        raise serializers.ValidationError(
            {"scheduled_date": "Cannot book a date in the past."}
        )

    scheduled_dt = datetime.combine(
        scheduled_date, scheduled_time, tzinfo=SERVICE_TZ
    )
    min_dt = now + BOOKING_BUFFER

    if scheduled_date == today and scheduled_dt < min_dt:
        raise serializers.ValidationError(
            {
                "scheduled_time": "You can only book slots at least 1 hour from now."
            }
        )
