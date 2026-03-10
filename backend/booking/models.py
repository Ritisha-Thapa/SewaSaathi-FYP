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
    completed_at = models.DateTimeField(null=True, blank=True)

    # Prices
    service_price = models.DecimalField(max_digits=10, decimal_places=2, default=0) # Price of service at booking time
    final_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True) # Final price set by provider after completion
    insurance_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0) # 1% of service_price
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0) # service_price + insurance_fee or final_price + insurance_fee

    payment_method = models.CharField(
        max_length=20,
        choices=(("cash", "Cash"), ("online", "Online")),
        default="cash"
    )
    is_paid = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        is_new = self.pk is None
        
        # Calculate pricing on save
        if self.final_price is not None:
            # Use final price if set
            self.insurance_fee = self.final_price * Decimal('0.01')
            self.total_price = self.final_price + self.insurance_fee
        elif not self.total_price:
            # Use service price if no final price
            self.insurance_fee = self.service_price * Decimal('0.01')  # 1% insurance
            self.total_price = self.service_price + self.insurance_fee
        
        # If status changed to completed, set completed_at
        if not is_new:
            old_status = Booking.objects.get(pk=self.pk).status
            if old_status != 'completed' and self.status == 'completed':
                from django.utils import timezone
                self.completed_at = timezone.now()
                
        super().save(*args, **kwargs)

        # Add to insurance pool if new booking
        if is_new:
            from insurance.models import InsurancePool
            pool, created = InsurancePool.objects.get_or_create(id=1)
            pool.total_funds += self.insurance_fee
            pool.save()

class Review(BaseModel):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="review")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews_given")
    provider = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reviews_received", limit_choices_to={"role": "provider"})
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Review by {self.customer.username} for {self.provider.username} - {self.rating} Stars"
