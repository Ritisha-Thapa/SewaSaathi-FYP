from rest_framework import serializers
from .models import Booking, Review
from services.models import Service, ProviderService
from accounts.models import User

class BookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_address = serializers.CharField(source='customer.address', read_only=True)
    customer_city = serializers.CharField(source='customer.city', read_only=True)
    provider_name = serializers.CharField(source='provider.get_full_name', read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    service_category_name = serializers.CharField(source='service.category.name', read_only=True)
    provider_phone = serializers.CharField(source='provider.phone', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)
    latest_claim_status = serializers.SerializerMethodField()
    latest_claim_resolution = serializers.SerializerMethodField()
    latest_claim_id = serializers.SerializerMethodField()
    has_reviewed = serializers.SerializerMethodField()
    
    def get_has_reviewed(self, obj):
        return hasattr(obj, 'review')

    def get_latest_claim_status(self, obj):
        claim = obj.claims.last()
        return claim.status if claim else None
    
    def get_latest_claim_resolution(self, obj):
        claim = obj.claims.last()
        return claim.resolution if claim else None

    def get_latest_claim_id(self, obj):
        claim = obj.claims.last()
        return claim.id if claim else None
    
    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'customer_name', 'customer_address', 'customer_city', 
            'provider', 'provider_name', 'provider_phone', 
            'service', 'service_name', 'service_category_name', 'scheduled_date', 'scheduled_time', 
            'issue_description', 'issue_images', 'status', 'address', 'phone', 'customer_phone',
            'service_price', 'final_price', 'price_note', 'insurance_fee', 'total_price',  
            'payment_method', 'is_paid', 'is_rework', 'created_at', 'updated_at', 'completed_at', 'paid_at',
            'latest_claim_status', 'latest_claim_resolution', 'latest_claim_id', 'has_reviewed'
        ]
        read_only_fields = ['id', 'customer', 'service_price', 'created_at', 'updated_at', 'total_price', 'insurance_fee', 'is_paid', 'completed_at', 'paid_at', 'latest_claim_status', 'latest_claim_resolution', 'latest_claim_id']

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

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    provider_name = serializers.CharField(source='provider.get_full_name', read_only=True)
    service_name = serializers.CharField(source='booking.service.name', read_only=True)
    customer_profile_image = serializers.SerializerMethodField()

    def get_customer_profile_image(self, obj):
        if obj.customer.profile_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.customer.profile_image.url)
            return obj.customer.profile_image.url
        return None

    class Meta:
        model = Review
        fields = ['id', 'booking', 'customer', 'customer_name', 'customer_profile_image', 'provider', 'provider_name', 'rating', 'comment', 'service_name', 'created_at']
        read_only_fields = ['id', 'customer', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['customer'] = request.user
        return super().create(validated_data)
