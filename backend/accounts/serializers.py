from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

        
class CustomerRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['phone', 'email', 'password', 'role', 'first_name', 'last_name', 'address', 'city']

    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("This phone number already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email already exists")
        return value

    def create(self, validated_data):
        # Auto-generate username
        phone = validated_data['phone']
        validated_data['role'] = 'customer'
        validated_data['username'] = f"user_{phone}"

        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
class ProviderRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    

    class Meta:
        model = User
        fields = [
            'phone', 'email', 'password', 'role',
            'first_name', 'last_name', 'address', 'city',
            'skills', 'experience_years',
            'citizenship_number', 'citizenship_image_front', 'citizenship_image_back',
            'profile_image'
        ]
    def validate(self, data):
        if not data.get('skills'):
            raise serializers.ValidationError({"skills": "Provider must select a skill"})

        if not data.get('citizenship_number'):
            raise serializers.ValidationError({"citizenship_number": "Citizenship number is required"})

        return data 
    
    
    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("This phone number already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email already exists")
        return value

    def create(self, validated_data):
        # Auto-generate username from phone
        phone = validated_data['phone']
        validated_data['username'] = f"user_{phone}"

        # Set provider_status as pending
        
        validated_data['role'] = 'provider'
        validated_data['provider_status'] = 'pending'

        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user 
    


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(username=data['phone'], password=data['password'])
        if not user:
            raise serializers.ValidationError("Invalid phone or password")

        if user.status != 'active':
            raise serializers.ValidationError("Your account is blocked")

        if user.role == 'provider' and user.provider_status != 'approved':
            raise serializers.ValidationError(f"Provider status: {user.provider_status}")

        data['user'] = user
        return data

    def get_jwt_token(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'msg': 'Login successful',
            'data': {
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }
            }
        }
