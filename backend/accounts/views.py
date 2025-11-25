from django.shortcuts import render

# Create your views here.

from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .serializers import CustomerRegisterSerializer, ProviderRegisterSerializer, LoginSerializer
import logging

logger = logging.getLogger(__name__)

# Registration views

#for customer
class CustomerRegisterView(APIView):
    def post(self, request):

        #passing incoming json data for validation
        serializer = CustomerRegisterSerializer(data=request.data)
        #validating before saving
        if serializer.is_valid():
            # creating user 
            serializer.save()
            return Response({'message': 'Customer created successfully'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#for provider
class ProviderRegisterView(APIView):
    def post(self, request):
        serializer = ProviderRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Provider registration submitted successfully. Awaiting admin approval. सेवा प्रदायक दर्ता सफलतापूर्वक पठाइयो। प्रशासकको अनुमोदनको प्रतीक्षा गर्दै।'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        logger.debug("Login request data: %s", request.data)
        serializer = LoginSerializer(data=request.data)
        if not serializer.is_valid():
            logger.debug("Login serializer errors: %s", serializer.errors)
            return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        response = serializer.get_jwt_token(serializer.validated_data['user'])# gets token
        return Response(response, status=status.HTTP_200_OK)

