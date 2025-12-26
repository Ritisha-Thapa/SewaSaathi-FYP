from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .models import PasswordResetOTP
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from .utils import generate_otp

        
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

User = get_user_model()

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    type = serializers.ChoiceField(
        choices=["send", "resend"],
        default="send"
    )


    def validate(self, data):
        email = data["email"]
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("User with this email does not exist")
        data["user"] = User.objects.get(email=email)
        return data

    def save(self):
        user = self.validated_data["user"]
        req_type = self.validated_data.get("type", "send")



        # REQUEST LIMIT (max 5 OTPs per hour)
        one_hour_ago = timezone.now() - timedelta(hours=1)
        otp_count = PasswordResetOTP.objects.filter(
            user=user,
            created_at__gte=one_hour_ago,
            # is_verified=False
        ).count()

        if otp_count >= 5:
            raise serializers.ValidationError(
                "Too many OTP requests. Please try again later."
            )

        # BLOCK if active OTP exists
        active_otp = PasswordResetOTP.objects.filter(
            user=user,
            is_verified=False
        ).order_by("-created_at").first()


        if active_otp and not active_otp.is_expired():

            remaining = max(
                0,
                120 - int((timezone.now() - active_otp.created_at).total_seconds())
            )
            raise serializers.ValidationError(
                f"OTP already sent. Please wait {remaining} seconds."
            )

        #  4. Generate OTP
        otp = generate_otp()

        PasswordResetOTP.objects.create(
            user=user,
            otp=otp,
            otp_type=req_type
        )

        #  5. Email
        subject = (
            "Your OTP Has Been Resent"
            if req_type == "resend"
            else "OTP for SewaSathi Password Reset"
        )

        send_mail(
            subject=subject,
            message=f"Your OTP is {otp}. It is valid for 2 minutes.",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email]
        )

        return {"message": "OTP sent successfully"}






class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

    def validate(self, data):
        email = data['email']
        otp = data['otp']
        try:
            user = User.objects.get(email=email)
            otp_record = PasswordResetOTP.objects.filter(user=user, otp=otp, is_verified=False).last()
            if not otp_record:
                raise serializers.ValidationError("Invalid OTP")
            if otp_record.is_expired():
                raise serializers.ValidationError("OTP expired")
        except User.DoesNotExist:
            raise serializers.ValidationError("User does not exist")
        data['otp_record'] = otp_record
        data['user'] = user
        return data

    def save(self):
        otp_record = self.validated_data['otp_record']
        otp_record.is_verified = True
        otp_record.save()
        return self.validated_data['user']


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        if not User.objects.filter(email=value).exists():
            raise serializers.ValidationError("User does not exist")
        return value

    def validate(self, data):
        user = User.objects.get(email=data['email'])
        # Check if OTP verified
        if not PasswordResetOTP.objects.filter(user=user, is_verified=True).exists():
            raise serializers.ValidationError("OTP not verified")
        data['user'] = user
        return data

    def save(self):
        user = self.validated_data['user']
        user.set_password(self.validated_data['new_password'])
        user.must_change_password = False  # optional
        user.save()
        # Clean up OTPs
        PasswordResetOTP.objects.filter(user=user).delete()
        return user