from django.shortcuts import render
# Create your views here.
from rest_framework.views import APIView
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import User
from .serializers import (
    CustomerRegisterSerializer, 
    ProviderRegisterSerializer, 
    LoginSerializer,
    ForgotPasswordSerializer, 
    VerifyOTPSerializer, 
    ResetPasswordSerializer
)



class CustomerRegisterView(APIView):
    def post(self, request):
        
        # request.data is raw data sent from client(frontend) so we pass it to serializer
        # at this moment nothing is validated and nothing is saved
        # here we are just creating serializer object but not actually calling the serializer
        serializer = CustomerRegisterSerializer(data=request.data)
        
        if serializer.is_valid(): # is_valid triggers evrythng inside the serializer, internally drf will do everything inside the serilizer class is defined
            serializer.save() # this finally calls create() inside CustomerRegisterSerializer 
            return Response({'message': 'Customer created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProviderRegisterView(APIView):
    def post(self, request):
        serializer = ProviderRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Provider registration submitted successfully. Awaiting admin approval.'},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True) # this line does everything and has user obj
        # extracting user
        user = serializer.validated_data['user']
        tokens = serializer.get_jwt_token(user)
        return Response(tokens, status=status.HTTP_200_OK)




class ForgotPasswordView(APIView):
    

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
   

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "OTP verified successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ProviderListView(generics.ListAPIView):
#     queryset = User.objects.filter(role='provider', provider_status='approved')
#     serializer_class = ProviderSerializer
#     permission_classes = [permissions.AllowAny]
#     filter_backends = [SearchFilter, DjangoFilterBackend]
#     search_fields = ['first_name', 'last_name', 'city', 'skills']
#     filterset_fields = ['skills', 'city']


# class ProviderDetailView(generics.RetrieveAPIView):
#     queryset = User.objects.filter(role='provider', provider_status='approved')
#     serializer_class = ProviderSerializer
#     permission_classes = [permissions.AllowAny]
