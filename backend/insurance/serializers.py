from rest_framework import serializers
from .models import InsuranceClaim, InsurancePool
from booking.models import Booking

class InsurancePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsurancePool
        fields = '__all__'

class InsuranceClaimSerializer(serializers.ModelSerializer):
    customer_username = serializers.ReadOnlyField(source='customer.username')
    booking_id = serializers.ReadOnlyField(source='booking.id')
    service_name = serializers.ReadOnlyField(source='booking.service.name')

    class Meta:
        model = InsuranceClaim
        fields = (
            'id', 'booking', 'booking_id', 'service_name', 'customer', 
            'customer_username', 'description', 'evidence', 'status', 
            'resolution', 'timestamp'
        )
        read_only_fields = ('customer', 'status', 'resolution', 'timestamp')

    def validate(self, data):
        booking = data.get('booking')
        user = self.context['request'].user

        # Owner validation
        if booking.customer != user:
            raise serializers.ValidationError("You can only file a claim for your own bookings.")

        # Status validation
        if booking.status != 'completed':
            raise serializers.ValidationError("Claims can only be filed for completed services.")

        # 48-hour validation
        if not booking.completed_at:
             raise serializers.ValidationError("Completion time not recorded for this booking.")
             
        from django.utils import timezone
        import datetime
        if timezone.now() > booking.completed_at + datetime.timedelta(hours=48):
            raise serializers.ValidationError("Claims must be submitted within 48 hours of service completion.")

        # Prevent duplicate claims for the same booking
        if InsuranceClaim.objects.filter(booking=booking).exists():
            raise serializers.ValidationError("A claim has already been filed for this booking.")

        return data
