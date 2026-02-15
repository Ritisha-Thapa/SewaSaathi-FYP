from rest_framework import serializers
from .models import Booking
from services.models import Service, ProviderService
from accounts.models import User

class BookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_address = serializers.CharField(source='customer.address', read_only=True)
    customer_city = serializers.CharField(source='customer.city', read_only=True)
    provider_name = serializers.CharField(source='provider.get_full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    
    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'customer_name', 'customer_address', 'customer_city', 
            'provider', 'provider_name', 
            'service', 'service_name', 'scheduled_date', 'scheduled_time', 
            'issue_description', 'issue_images', 'status', 'address', 'phone',
            'service_price', 'insurance_fee', 'total_price', 
            'payment_method', 'is_paid', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'customer', 'service_price', 'created_at', 'updated_at', 'total_price', 'insurance_fee', 'status', 'is_paid']

    def create(self, validated_data):
        # Override create to set service_price from ProviderService or Service
        service = validated_data.get('service')
        provider = validated_data.get('provider')
        
        if provider:
            # Try to get price from ProviderService
            try:
                provider_service = ProviderService.objects.get(provider=provider, service=service)
                validated_data['service_price'] = provider_service.price
            except ProviderService.DoesNotExist:
                # If no specific price, use base service price
                validated_data['service_price'] = service.base_price
        else:
            validated_data['service_price'] = service.base_price
            
        return super().create(validated_data)

class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status']
        
    def validate_status(self, value):
        # Add logic to validate status transitions if needed
        # For example, cannot go from 'cancelled' to 'completed'
        return value
