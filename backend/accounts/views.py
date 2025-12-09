from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import CustomerRegisterSerializer, ProviderRegisterSerializer, LoginSerializer



class CustomerRegisterView(APIView):
    def post(self, request):
        serializer = CustomerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Customer created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProviderRegisterView(APIView):
    def post(self, request):
        serializer = ProviderRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Provider registration submitted successfully. Awaiting admin approval.'"सेवा प्रदायक दर्ता सफलतापूर्वक पठाइयो। प्रशासकको अनुमोदनको प्रतीक्षा गर्दै।"},
                            status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        tokens = serializer.get_jwt_token(user)
        return Response(tokens, status=status.HTTP_200_OK)
