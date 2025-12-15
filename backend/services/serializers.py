from rest_framework import serializers
from .models import ServiceCategory, Service, ProviderService


class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "description", "created_at"]


class ServiceSerializer(serializers.ModelSerializer):
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=ServiceCategory.objects.all(), source="category", write_only=True)

    category = ServiceCategorySerializer(read_only=True)

    class Meta:
        model = Service
        fields = ["id", "name", "description","base_price", "category", "category_id","created_at",]


class ProviderServiceSerializer(serializers.ModelSerializer):
    # Read only → formatted output
    provider = serializers.StringRelatedField(read_only=True)
    service = ServiceSerializer(read_only=True)

    # Write only → actual FK fields
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(),source="service",write_only=True
    )

    class Meta:
        model = ProviderService
        fields = ["id","provider","service", "service_id","price", "is_available", "rating","created_at",]

    def create(self, validated_data):
        """
        Provider is automatically set from request.user.
        No need for provider_id logic.
        Cleaner & safer.
        """
        user = self.context["request"].user
        validated_data["provider"] = user
        return super().create(validated_data)
