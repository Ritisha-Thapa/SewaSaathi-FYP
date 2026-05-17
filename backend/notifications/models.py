from django.db import models
from django.conf import settings
from base.models import BaseModel
from booking.models import Booking

class Notification(BaseModel):
    recipient = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications"
    )
    notification_type = models.CharField(max_length=100)
    extra_data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False)
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name="notifications",
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Notification for {self.recipient.username}: {self.notification_type}"

    class Meta:
        ordering = ['-created_at']
