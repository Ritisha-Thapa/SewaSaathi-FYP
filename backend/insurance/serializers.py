from rest_framework import serializers
from .models import InsuranceClaim, InsurancePool


class InsurancePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsurancePool
        fields = ("id", "current_balance", "total_contributed", "total_paid_out", "created_at", "updated_at")


class InsuranceClaimSerializer(serializers.ModelSerializer):
    customer_username = serializers.ReadOnlyField(source="customer.username")
    customer_name = serializers.ReadOnlyField(source="booking.customer.get_full_name")
    customer_phone = serializers.ReadOnlyField(source="booking.phone")
    booking_location = serializers.ReadOnlyField(source="booking.address")
    booking_id = serializers.ReadOnlyField(source="booking.id")
    service_name = serializers.ReadOnlyField(source="booking.service.name")
    original_amount = serializers.DecimalField(
        source="booking.total_price", max_digits=10, decimal_places=2, read_only=True
    )

    class Meta:
        model = InsuranceClaim
        fields = (
            "id",
            "booking",
            "booking_id",
            "service_name",
            "customer",
            "customer_username",
            "customer_name",
            "customer_phone",
            "booking_location",
            "description",
            "evidence",
            "status",
            "resolution",
            "timestamp",
            # Refund tracking
            "original_amount",
            "refund_amount",
            "refund_status",
            "pool_deducted",
            "shortfall",
            "admin_notified_at",
            "admin_resolved_at",
        )
        read_only_fields = (
            "customer",
            "status",
            "resolution",
            "timestamp",
            "refund_amount",
            "refund_status",
            "pool_deducted",
            "shortfall",
            "admin_notified_at",
            "admin_resolved_at",
        )

    def validate(self, data):
        booking = data.get("booking")
        user = self.context["request"].user

        if booking.customer != user:
            raise serializers.ValidationError("You can only file a claim for your own bookings.")

        if booking.status != "paid":
            raise serializers.ValidationError("Insurance can only be claimed for bookings with 'Paid' status.")

        if not booking.paid_at:
            raise serializers.ValidationError(
                "Payment time not recorded for this booking. You must pay before filing a claim."
            )

        from django.utils import timezone
        import datetime
        if timezone.now() > booking.paid_at + datetime.timedelta(days=3):
            raise serializers.ValidationError("Claims must be submitted within 3 days of payment.")

        if InsuranceClaim.objects.filter(booking=booking).exists():
            raise serializers.ValidationError("A claim has already been filed for this booking.")

        return data
