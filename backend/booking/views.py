from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import Booking
from .serializers import BookingSerializer, BookingStatusUpdateSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'customer':
            return Booking.objects.filter(customer=user).order_by('-created_at')
        elif user.role == 'provider':
            # Provider sees bookings assigned to them OR pending requests (if we implement broadcast)
            # For now, let's assume direct assignment or he can see his own jobs
            return Booking.objects.filter(provider=user).order_by('-created_at')
        elif user.role == 'admin':
            return Booking.objects.all().order_by('-created_at')
        return Booking.objects.none()

    def perform_create(self, serializer):
        booking = serializer.save(customer=self.request.user)
        # Notify Provider
        # if booking.provider:
        #     Notification.objects.create(
        #         user=booking.provider,
        #         message=f"New Booking Request from {booking.customer.username} for {booking.service.name}",
        #         booking=booking
        #     )

    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')
        
        # Simple Validation
        if new_status not in dict(Booking.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update
        booking.status = new_status
        
        if new_status == 'completed':
            booking.is_paid = request.data.get('is_paid', booking.is_paid) # Allow setting paid on complete
            
        booking.save()
        
        # Notify Customer
        # Notification.objects.create(
        #     user=booking.customer,
        #     message=f"Your booking for {booking.service.name} is now {new_status}",
        #     booking=booking
        # )
        
        return Response(BookingSerializer(booking).data)

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        booking = self.get_object()
        booking.is_paid = True
        booking.payment_method = 'online'
        booking.save()
        return Response({'status': 'paid'})
