from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, ImageField
from .models import ServiceCategory, Service, ProviderService, ProviderAvailability
from django.contrib.auth import get_user_model

User = get_user_model()


class ServiceCategorySerializer(ModelSerializer):
    image = ImageField(required=False, allow_null=True)

    class Meta:
        model = ServiceCategory
        fields = [
            "id",
            "slug",
            "name_key",
            "description_key",
            "image",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug"]


class ServiceSerializer(ModelSerializer):
    category_id = PrimaryKeyRelatedField(queryset=ServiceCategory.objects.all(),source="category",write_only=True)
    category = ServiceCategorySerializer(read_only=True)
    image = ImageField(required=False, allow_null=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "name_key",
            "description_key",
            "base_price",
            "pricing_type",
            "image",
            "category",
            "category_id",
            "created_at",
            "updated_at",
        ]


class ProviderSummarySerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "profile_image", "city"]

class ProviderServiceSerializer(ModelSerializer):
    provider = ProviderSummarySerializer(read_only=True)
    service = ServiceSerializer(read_only=True)
    service_id = PrimaryKeyRelatedField(queryset=Service.objects.all(),source="service",write_only=True)

    class Meta:
        model = ProviderService
        fields = ["id","provider","service","service_id","price","pricing_type","is_available","rating","created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["provider"] = self.context["request"].user
        return super().create(validated_data)

class ProviderAvailabilitySerializer(ModelSerializer):
    class Meta:
        model = ProviderAvailability
        fields = ['id', 'provider', 'days', 'created_at', 'updated_at']
        read_only_fields = ['id', 'provider', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['provider'] = self.context['request'].user
        return super().create(validated_data)
