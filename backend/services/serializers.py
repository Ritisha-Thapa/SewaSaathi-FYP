from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField, ImageField
from .models import ServiceCategory, Service
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
