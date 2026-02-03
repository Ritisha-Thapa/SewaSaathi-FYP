from rest_framework.serializers import ModelSerializer, PrimaryKeyRelatedField,StringRelatedField, ImageField
from .models import ServiceCategory, Service, ProviderService


class ServiceCategorySerializer(ModelSerializer):
    image = ImageField(required=False, allow_null=True)
    class Meta:
        model = ServiceCategory
        fields = ["id", "name", "description","image", "created_at", "updated_at"]


class ServiceSerializer(ModelSerializer):
    # accepts category_id, validates if it exists
    # with PrimaryKeyRelatedField it will expect only pk(ID)
    # queryset=ServiceCategory.objects.all() this ensures the id existence 
    # source="category" means this value will be assigned to the category field in the model
    category_id = PrimaryKeyRelatedField(queryset=ServiceCategory.objects.all(),source="category",write_only=True)

    # Nested serializer for response only
    category = ServiceCategorySerializer(read_only=True) # this is only for returning info instead of returning just the category id
    image = ImageField(required=False, allow_null=True)

    class Meta:
        model = Service
        fields = ["id","name","description","base_price","pricing_type","image","category","category_id","created_at", "updated_at"]


# It connects a provider with a service with some extra info like price rating
# Its like a provider profile with his service or work details to book him

class ProviderServiceSerializer(ModelSerializer):
    provider = StringRelatedField(read_only=True) # we will be setting this on own so read_only
    service = ServiceSerializer(read_only=True) # only for info its a nested serializer so client doesnt send its data but only service_ID

    # Client sends only the service ID
    # source="service" assigns it to the service FK in the model
    service_id = PrimaryKeyRelatedField(queryset=Service.objects.all(),source="service",write_only=True)

    class Meta:
        model = ProviderService
        fields = ["id","provider","service","service_id","price","pricing_type","is_available","rating","created_at", "updated_at"]

    def create(self, validated_data):
        # logged-in user will be set as provider
        # self.context["request"] is passed from the view
        # This enforces ownership 
        validated_data["provider"] = self.context["request"].user
        return super().create(validated_data)

