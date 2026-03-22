from rest_framework import serializers
from .models import InsuranceClaim, InsurancePool
from booking.models import Booking

class InsurancePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsurancePool
        fields = '__all__'

class InsuranceClaimSerializer(serializers.ModelSerializer):
    customer_username = serializers.ReadOnlyField(source='customer.username')
    customer_name = serializers.ReadOnlyField(source='booking.customer.get_full_name')
    customer_phone = serializers.ReadOnlyField(source='booking.phone')
    booking_location = serializers.ReadOnlyField(source='booking.address')
    booking_id = serializers.ReadOnlyField(source='booking.id')
    service_name = serializers.ReadOnlyField(source='booking.service.name')

    class Meta:
        model = InsuranceClaim
        fields = (
            'id', 'booking', 'booking_id', 'service_name', 'customer', 
            'customer_username', 'customer_name', 'customer_phone', 'booking_location',
            'description', 'evidence', 'status', 
            'resolution', 'timestamp'
        )
        read_only_fields = ('customer', 'status', 'resolution', 'timestamp')
        # extra_kwargs = {
        #     'evidence': {'required': True, 'allow_null': False}
        # }

    def validate(self, data):
        booking = data.get('booking')
        user = self.context['request'].user

        # Owner validation
        if booking.customer != user:
            raise serializers.ValidationError("You can only file a claim for your own bookings.")

        # Status validation - Only paid bookings can be claimed
        if booking.status != 'paid':
            raise serializers.ValidationError("Insurance can only be claimed for bookings with 'Paid' status.")

        # 5-day validation (120 hours)
        if not booking.paid_at:
             raise serializers.ValidationError("Payment time not recorded for this booking. You must pay before filing a claim.")
             
        from django.utils import timezone
        import datetime
        if timezone.now() > booking.paid_at + datetime.timedelta(days=3):
            raise serializers.ValidationError("Claims must be submitted within 3 days of payment.")

        # Prevent duplicate claims for the same booking
        if InsuranceClaim.objects.filter(booking=booking).exists():
            raise serializers.ValidationError("A claim has already been filed for this booking.")

        return data
