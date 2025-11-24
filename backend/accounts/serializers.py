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
        # for automatically setting fields role and username
        phone = validated_data['phone']
        validated_data['role'] = 'customer'
        validated_data['username'] = f"user_{phone}"

        password = validated_data.pop('password') # extracting pass to hash 
        user = User(**validated_data) # user object
        user.set_password(password) #hashing password
        user.save() #saving data to database
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

    # service provider must enter skills and citizenship 
    def validate(self, data):
        if not data.get('skills'):
            raise serializers.ValidationError({
                "skills": (
                    "Provider must select at least one skill.\n"
                    "सेवा प्रदायकले कम्तिमा एउटा कौशल चयन गर्नुपर्छ।"
                )
            })

        if not data.get('citizenship_number'):
            raise serializers.ValidationError({
                "citizenship_number": (
                    "Citizenship number is required.\n"
                    "नागरिकता नम्बर आवश्यक छ।"
                )
            })

        return data

    # Phone unique validation
    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise serializers.ValidationError(
                "This phone number already exists.\n"
                "यो फोन नम्बर पहिले नै दर्ता गरिएको छ।"
            )
        return value

    # Email unique validation
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "This email already exists.\n"
                "यो इमेल पहिले नै दर्ता गरिएको छ।"
            )
        return value

    def create(self, validated_data):
        # Generate username from phone
        phone = validated_data['phone']
        validated_data['username'] = f"user_{phone}"
        validated_data['role'] = 'provider'

        # Provider accounts always start as 'pending'
        validated_data['provider_status'] = 'pending'

        # Handle password hashing
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
            raise serializers.ValidationError(
                "Your account is blocked.\nतपाईंको खाता ब्लक गरिएको छ।"
            )

        # ---- Provider checks ----
        if user.role == 'provider':
            
            # 1. Pending
            if user.provider_status == 'pending':
                raise serializers.ValidationError(
                    "Your account is not approved yet. Please wait for admin verification.\n"
                    "You will be contacted for an interview if required.\n"
                    "तपाईंको खाता अझै अनुमोदन भएको छैन। कृपया प्रशासकको प्रमाणिकरणको लागि पर्खनुहोस्।\n"
                    "आवश्यक परेमा तपाईंलाई अन्तर्वार्ताका लागि सम्पर्क गरिनेछ।"
                )


            # 2. Rejected
            if user.provider_status == 'rejected':
                raise serializers.ValidationError(
                    f"Your provider application was rejected.\n"
                    "तपाईंको प्रदायक आवेदन अस्वीकृत गरिएको छ।"
                )

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
