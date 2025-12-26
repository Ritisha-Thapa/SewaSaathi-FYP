from rest_framework import serializers
from .models import ServiceCategory, Service, ProviderService


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "description", "created_at"]


class ServiceSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCategory.objects.all(),
        source="category",
        write_only=True)

    category = ServiceCategorySerializer(read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "name",
            "description",
            "base_price",
            "pricing_type",
            "category",
            "category_id",
            "created_at",
        ]



class ProviderServiceSerializer(serializers.ModelSerializer):
    provider = serializers.StringRelatedField(read_only=True)
    service = ServiceSerializer(read_only=True)

    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),
        source="service",
        write_only=True
    )

    class Meta:
        model = ProviderService
        fields = [
            "id",
            "provider",
            "service",
            "service_id",
            "price",
            "pricing_type",
            "is_available",
            "rating",
            "created_at",
        ]

    def create(self, validated_data):
        validated_data["provider"] = self.context["request"].user
        return super().create(validated_data)

