from rest_framework.serializers import ModelSerializer, Serializer, CharField, ValidationError
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed


# the serializer is for customer registration only
# The serializer below is doing 3 things 1. accepts incoming json data, 2. Validates data, 3. Creates a User object in the database.
    
class CustomerRegisterSerializer(ModelSerializer):
    
    # password must be sent via request but shouldnt be returned as response so defining it as write_only
    password = CharField(write_only=True)

    class Meta:
        model = User # tells django which model to serialize
        # which fields are allowed in the api
        fields = ['phone', 'email', 'password', 'first_name', 'last_name', 'address', 'city']

    # phone existence validation
    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise ValidationError("This phone number already exists")
        return value

    # email existence validation
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("This email already exists")
        return value

    # overriding create function which will turn clean data(validated_data) into actual db object
    def create(self, validated_data):
        # for automatically setting fields role and username
        
        phone = validated_data['phone'] # extracting phone to use it to create username later
        
        # we wont be sending this fields in meta as we manually override it like this
        validated_data['role'] = 'customer' # setting role
        validated_data['username'] = f"user_{phone}" # creating auto username
        validated_data['is_active'] = True


        password = validated_data.pop('password') # extracting pass from validated_data to hash cz we dj expects pass to be hashed not plain text
        user = User(**validated_data) # creating user object but password is not set yet
        user.set_password(password) # hashing password
        user.save() #saving data to database
        
        return user  # thus it has not password 


# ProviderRegistration

# Provider needs verification, are not active immediately, cannot set password while registering, pass will be sent via mail

class ProviderRegisterSerializer(ModelSerializer):


    class Meta:
        model = User
        fields = ['phone', 'email','first_name', 'last_name', 'address', 'city','skills', 'experience_years','citizenship_number', 'citizenship_image_front', 'citizenship_image_back','profile_image']

    # Global validation for required provider fields
    def validate(self, data):
        if not data.get('skills'):
            raise ValidationError({"skills": "Skill is required."})


        return data

    # Phone unique validation
    def validate_phone(self, value):
        if User.objects.filter(phone=value).exists():
            raise ValidationError("This phone number already exists.\n")
        return value

    # Email unique validation
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise ValidationError("This email already exists.\n")
        return value
    
    def create(self, validated_data):
        phone = validated_data['phone']

        validated_data['role'] = 'provider'
        validated_data['username'] = f"user_{phone}"
        validated_data['provider_status'] = 'pending'
        validated_data['is_active'] = False
        
        user = User(**validated_data)
        user.save()
        return user

    

# here we'll just use normal Serializer as we dont create or update anything we're just going to authenticate 
class LoginSerializer(Serializer):
    
    # input fields
    phone = CharField()
    password = CharField(write_only=True) # never returned

    def validate(self, data):
        # sending username(phone in my case) and password to authenticate if found returns user obj else 0
        user = authenticate(username=data['phone'], password=data['password'])
        # no user found
        if not user:
            raise ValidationError("Invalid credentials!!")

        # preventing provider to login before approval, handling suspended users
        if not user.is_active:
            raise AuthenticationFailed("Account is inactive.") # AuthenticationFailed returns 401 Unauthorized error


        # Provider case only
        if user.role == 'provider' and user.provider_status != 'approved':
            raise AuthenticationFailed("Provider account not approved yet.")

        data['user'] = user #saving returned user object in validated data
        return data

    def get_jwt_token(self, user):
        refresh = RefreshToken.for_user(user) #creates refresh token
        return {
            'msg': 'Login successful',
            'data': {
                'token': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token) # main token to access authenticated apis
                }
            }
        }
