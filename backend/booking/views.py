from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from decimal import Decimal
from .models import Booking, Review
from .serializers import BookingSerializer, BookingStatusUpdateSerializer, ReviewSerializer
from notifications.models import Notification


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'customer':
            return Booking.objects.filter(customer=user).order_by('-created_at')
        elif user.role == 'provider':
            # Provider sees pending requests based on skills + assigned bookings
            # Map provider skills to service categories
            skill_to_category = {
                'cleaner': 'Cleaning',
                'painter': 'Painting', 
                'electrician': 'Electrical Repairing',
                'gardener': 'Gardening',
                'carpenter': 'Carpentry',
                'plumber': 'Plumbing'
            }
            
            # Get provider's skill category
            provider_category = skill_to_category.get(user.skills)
            
            if provider_category:
                # Show bookings from provider's skill category (service-based) + directly assigned bookings
                queryset = Booking.objects.filter(
                    Q(provider=user) |  # Directly assigned bookings
                    Q(provider__isnull=True, service__category__name=provider_category)  # Service-based bookings in their skill category
                ).distinct().order_by('-created_at')
            else:
                # If no skill, only show directly assigned bookings
                queryset = Booking.objects.filter(provider=user).order_by('-created_at')
            
            return queryset
        elif user.role == 'admin':
            return Booking.objects.all().order_by('-created_at')
        return Booking.objects.none()

    def perform_create(self, serializer):
        booking = serializer.save(customer=self.request.user)
        # Notify Provider if assigned
        if booking.provider:
            Notification.objects.create(
                recipient=booking.provider,
                title="New Booking Request",
                message=f"You have a new booking request from {booking.customer.first_name} for {booking.service.name}.",
                booking=booking
            )
        else:
            # Broadcast to all providers with matching skills
            category_name = booking.service.category.name
            skill_map = {
                'Cleaning': 'cleaner',
                'Painting': 'painter',
                'Electrical Repairing': 'electrician',
                'Gardening': 'gardener',
                'Carpentry': 'carpenter',
                'Plumbing': 'plumber'
            }
            target_skill = skill_map.get(category_name)
            if target_skill:
                from accounts.models import User
                eligible_providers = User.objects.filter(role='provider', skills=target_skill)
                for provider in eligible_providers:
                    Notification.objects.create(
                        recipient=provider,
                        title="New Job Available",
                        message=f"A new request for {booking.service.name} is available in {category_name}.",
                        booking=booking
                    )

    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        booking = self.get_object()
        new_status = request.data.get('status')
        
        # Validate status
        if new_status not in dict(Booking.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate status transitions
        current_status = booking.status
        if not self._is_valid_status_transition(current_status, new_status, request.user):
            return Response({"error": "Invalid status transition"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle special logic for completion
        if new_status == 'completed':
            # Allow provider to set final price
            final_price = request.data.get('final_price')
            if final_price and request.user.role == 'provider':
                try:
                    booking.final_price = Decimal(str(final_price))
                except (ValueError, TypeError):
                    return Response({"error": "Invalid final price format"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle payment
        if new_status == 'paid':
            if booking.status != 'completed':
                return Response({"error": "Can only pay for completed bookings"}, status=status.HTTP_400_BAD_REQUEST)
            booking.is_paid = True
            booking.payment_method = request.data.get('payment_method', 'online')
        
        booking.status = new_status
        booking.save()

        # Send Notifications based on status change
        if new_status == 'accepted':
            # Ensure provider is assigned if it was a general request
            if not booking.provider:
                booking.provider = request.user
                booking.save()
                
            Notification.objects.create(
                recipient=booking.customer,
                title="Booking Accepted",
                message=f"Your provider {booking.provider.first_name} has accepted the booking for {booking.service.name} and is on the way.",
                booking=booking
            )
        elif new_status == 'rejected':
            Notification.objects.create(
                recipient=booking.customer,
                title="Booking Rejected",
                message=f"Your booking for {booking.service.name} was rejected.",
                booking=booking
            )
        elif new_status == 'in_progress':
            Notification.objects.create(
                recipient=booking.customer,
                title="Service Started",
                message=f"The provider has started working on your booking for {booking.service.name}.",
                booking=booking
            )
        elif new_status == 'completed':
            Notification.objects.create(
                recipient=booking.customer,
                title="Service Completed",
                message=f"Your booking for {booking.service.name} has been marked as completed. Please review and pay.",
                booking=booking
            )
        elif new_status == 'cancelled':
            # Notify the other party
            recipient = booking.provider if request.user.role == 'customer' else booking.customer
            title = "Booking Cancelled"
            message = f"Booking for {booking.service.name} has been cancelled."
            if recipient:
                Notification.objects.create(recipient=recipient, title=title, message=message, booking=booking)

        return Response(BookingSerializer(booking).data)
    
    def _is_valid_status_transition(self, current_status, new_status, user):
        """Validate status transitions based on user role"""
        # Customer can only cancel
        if user.role == 'customer':
            return new_status in ['cancelled']
        
        # Provider can manage the flow
        if user.role == 'provider':
            valid_transitions = {
                'pending': ['accepted', 'rejected'],
                'accepted': ['in_progress', 'cancelled'],
                'in_progress': ['completed', 'cancelled'],
                'completed': ['paid'],  # Only customer can pay, but provider can mark as paid for cash
                'cancelled': [],
                'rejected': [],
                'paid': []
            }
            return new_status in valid_transitions.get(current_status, [])
        
        # Admin can do anything
        return True

    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        booking = self.get_object()
        
        # Validate booking is completed
        if booking.status != 'completed':
            return Response({"error": "Can only pay for completed bookings"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Only customer can pay for their own booking
        if booking.customer != request.user:
            return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
        
        booking.is_paid = True
        booking.status = 'paid'
        booking.payment_method = 'online'
        booking.save()

        # Notify Provider of payment
        if booking.provider:
            Notification.objects.create(
                recipient=booking.provider,
                title="Payment Received",
                message=f"Payment received successfully from {booking.customer.first_name} for {booking.service.name}.",
                booking=booking
            )
        
        # Notify Customer of payment success
        Notification.objects.create(
            recipient=booking.customer,
            title="Payment Successful",
            message=f"Payment of Rs. {booking.total_price} for {booking.service.name} was successful.",
            booking=booking
        )
        return Response(BookingSerializer(booking).data)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Review.objects.select_related('customer', 'provider', 'booking').all()
        
        # If the user is a provider, maybe they want to see the reviews they RECEIVED?
        # Actually any user might want to see reviews for a specific provider.
        provider_id = self.request.query_params.get('provider_id')
        if provider_id:
            qs = qs.filter(provider_id=provider_id)
            
        # Admin can see all, customer sees what they gave, provider sees what they received?
        # Let's just allow anyone to view reviews (for public profile), but filter by provider_id.
        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
