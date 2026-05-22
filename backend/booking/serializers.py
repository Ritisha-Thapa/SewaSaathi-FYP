from rest_framework import serializers
from .models import Booking, Review, ProviderBookingResponse
from .validators import validate_scheduled_slot
from services.models import Service, ProviderService
from accounts.models import User

class BookingSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    customer_address = serializers.CharField(source='customer.address', read_only=True)
    customer_city = serializers.CharField(source='customer.city', read_only=True)
    provider_name = serializers.CharField(source='provider.get_full_name', read_only=True)
    service_name_key = serializers.CharField(source='service.name_key', read_only=True)
    service_category_name_key = serializers.CharField(source='service.category.name_key', read_only=True)
    service_category_slug = serializers.CharField(source='service.category.slug', read_only=True)
    provider_phone = serializers.CharField(source='provider.phone', read_only=True)
    customer_phone = serializers.CharField(source='customer.phone', read_only=True)
    latest_claim_status = serializers.SerializerMethodField()
    latest_claim_resolution = serializers.SerializerMethodField()
    latest_claim_id = serializers.SerializerMethodField()
    has_reviewed = serializers.SerializerMethodField()
    provider_has_declined = serializers.SerializerMethodField()

    def get_provider_has_declined(self, obj):
        request = self.context.get("request")
        if not request or getattr(request.user, "role", None) != "provider":
            return False
        declined = getattr(obj, "my_decline_responses", None)
        if declined is not None:
            return len(declined) > 0
        return obj.provider_responses.filter(
            provider=request.user,
            response=ProviderBookingResponse.RESPONSE_DECLINED,
        ).exists()

    def get_has_reviewed(self, obj):
        return hasattr(obj, 'review')

    def _get_latest_claim(self, obj):
        # Use prefetched claims if available to avoid N+1 queries.
        prefetched_claims = getattr(obj, '_prefetched_objects_cache', {}).get('claims')
        if prefetched_claims is not None:
            return prefetched_claims[0] if prefetched_claims else None
        return obj.claims.order_by('-timestamp').first()

    def get_latest_claim_status(self, obj):
        claim = self._get_latest_claim(obj)
        return claim.status if claim else None
    
    def get_latest_claim_resolution(self, obj):
        claim = self._get_latest_claim(obj)
        return claim.resolution if claim else None

    def get_latest_claim_id(self, obj):
        claim = self._get_latest_claim(obj)
        return claim.id if claim else None

    def to_representation(self, instance):
        data = super().to_representation(instance)
        request = self.context.get("request")
        if (
            request
            and getattr(request.user, "role", None) == "customer"
            and data.get("status") == "rejected"
        ):
            data["status"] = "pending"
        return data

    class Meta:
        model = Booking
        fields = [
            'id', 'customer', 'customer_name', 'customer_address', 'customer_city', 
            'provider', 'provider_name', 'provider_phone', 
            'service', 'service_name_key', 'service_category_name_key', 'service_category_slug', 'scheduled_date', 'scheduled_time', 
            'issue_description', 'issue_images', 'status', 'address', 'phone', 'customer_phone',
            'service_price', 'final_price', 'price_note', 'insurance_fee', 'total_price',  
            'payment_method', 'is_paid', 'is_rework', 'created_at', 'updated_at', 'completed_at', 'paid_at',
            'latest_claim_status', 'latest_claim_resolution', 'latest_claim_id', 'has_reviewed',
            'provider_has_declined',
        ]
        read_only_fields = ['id', 'customer', 'service_price', 'created_at', 'updated_at', 'total_price', 'insurance_fee', 'is_paid', 'completed_at', 'paid_at', 'latest_claim_status', 'latest_claim_resolution', 'latest_claim_id', 'provider_has_declined']

    def validate(self, attrs):
        scheduled_date = attrs.get("scheduled_date")
        scheduled_time = attrs.get("scheduled_time")
        if scheduled_date is not None and scheduled_time is not None:
            validate_scheduled_slot(scheduled_date, scheduled_time)
        return attrs

    def create(self, validated_data):
        service = validated_data.get('service')
        provider = validated_data.get('provider')
        
        if provider:
            try:
                provider_service = ProviderService.objects.get(provider=provider, service=service)
                validated_data['service_price'] = provider_service.price
            except ProviderService.DoesNotExist:
                validated_data['service_price'] = service.base_price
        else:
            validated_data['service_price'] = service.base_price
            
        return super().create(validated_data)

class BookingStatusUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ['status']
        
    def validate_status(self, value):
        return value

class ReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.get_full_name', read_only=True)
    provider_name = serializers.CharField(source='provider.get_full_name', read_only=True)
    service_name_key = serializers.CharField(source='booking.service.name_key', read_only=True)
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
        fields = ['id', 'booking', 'customer', 'customer_name', 'customer_profile_image', 'provider', 'provider_name', 'rating', 'comment', 'service_name_key', 'created_at']
        read_only_fields = ['id', 'customer', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['customer'] = request.user
        return super().create(validated_data)
