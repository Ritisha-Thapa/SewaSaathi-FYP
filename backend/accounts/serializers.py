
from rest_framework.serializers import ModelSerializer, Serializer, CharField, ValidationError, EmailField, ChoiceField, SerializerMethodField
from .models import User, PasswordResetOTP
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from django.core.mail import send_mail
from .utils import generate_otp
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()
from services.serializers import ProviderServiceSerializer



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
        fields = ['phone', 'email','first_name', 'last_name', 'address', 'city','skills', 'experience_years', 'citizenship_image_front', 'citizenship_image_back','profile_image']

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
                },
                'user': {
                    'id': user.id,
                    'first_name': user.first_name,
                    'role': user.role
                }
            }
        }



class ForgotPasswordSerializer(Serializer):
    email = EmailField() #email of the user requesting password reset
    type = ChoiceField(choices=["send", "resend"],default="send")


    def validate(self, data):
        """
        Checks email existance.
        If exists! store the user obj in validated data
        """
        email = data["email"]
        if not User.objects.filter(email=email).exists():
            raise ValidationError("User with this email does not exist")
        data["user"] = User.objects.get(email=email)
        return data # drf now knows this input is valid

    def save(self):
        user = self.validated_data["user"] # data after validation
        req_type = self.validated_data.get("type", "send") 

        # request limit (max allowed 4)
        one_hour_ago = timezone.now() - timedelta(hours=1)
        otp_count = PasswordResetOTP.objects.filter(user=user,created_at__gte=one_hour_ago,).count()

        if otp_count >= 8:
            raise ValidationError(
                "Too many OTP requests. Please try again later."
            )

        # if the otp is not expired cannot send otp request again till its expired
        active_otp = PasswordResetOTP.objects.filter(user=user,is_verified=False).order_by("-created_at").first()


        if active_otp and not active_otp.is_expired():

            remaining = max(0,120 - int((timezone.now() - active_otp.created_at).total_seconds())
            )
            raise ValidationError(
                f"OTP already sent. Please wait {remaining} seconds."
            )

        # Generate OTP
        otp = generate_otp()

        PasswordResetOTP.objects.create(user=user,otp=otp,otp_type=req_type)

        # send through email
        subject = (
            "Your OTP Has Been Resent"
            if req_type == "resend"
            else "OTP for Sewasathi Password Reset"
        )

        send_mail(
            subject=subject,
            message=f"Your OTP is {otp}. It is valid for 2 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email]
        )

        return {"message": "OTP sent successfully"}






class VerifyOTPSerializer(Serializer):
    """
    User submits email and otp
    serializer validates
    marks the otp as verified
    returns user obj
    """
    email = EmailField()
    otp = CharField(max_length=6)

    def validate(self, data):
        email = data['email']
        otp = data['otp']
        try:
            user = User.objects.get(email=email)
            
            #record otp if its valid
            otp_record = PasswordResetOTP.objects.filter(user=user, otp=otp, is_verified=False).last()
            if not otp_record:
                raise ValidationError("Invalid OTP")
            
            if otp_record.is_expired():
                raise ValidationError("OTP expired")
        except User.DoesNotExist:
            raise ValidationError("User does not exist")
        
        #saving the otp obj and user obj in validated data
        data['otp_record'] = otp_record
        data['user'] = user
        return data

    def save(self):
        otp_record = self.validated_data['otp_record']
        otp_record.is_verified = True # finally verifying it
        otp_record.save()
        return self.validated_data['user']


class ResetPasswordSerializer(Serializer):
    email = EmailField()
    new_password = CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise ValidationError("User does not exist")
        return value

    def validate(self, data):
        user = User.objects.get(email=data['email'])
        # Check if OTP is verified
        if not PasswordResetOTP.objects.filter(user=user, is_verified=True).exists():
            raise ValidationError("OTP not verified")
        data['user'] = user
        return data

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.must_change_password = False  
        user.save()
        
        # Clean up OTPs
        PasswordResetOTP.objects.filter(user=user).delete()
        return user


# class ProviderSerializer(ModelSerializer):
#     average_rating = SerializerMethodField()
#     provider_services = ProviderServiceSerializer(many=True, read_only=True)

#     class Meta:
#         model = User
#         fields = ['id', 'first_name', 'last_name', 'profile_image', 'skills', 'experience_years', 'city', 'average_rating', 'provider_services']

#     def get_average_rating(self, obj):
#         # Calculate average rating from ProviderService or return 0
#         services = obj.provider_services.all()
#         if services.exists():
#              total_rating = sum([s.rating for s in services])
#              return round(total_rating / services.count(), 1)
#         return 0.0
