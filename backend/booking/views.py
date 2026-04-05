from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from decimal import Decimal
from .models import Booking, Review
from .serializers import BookingSerializer, BookingStatusUpdateSerializer, ReviewSerializer
from notifications.models import Notification
import requests
from django.conf import settings
from django.utils import timezone


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        base_qs = Booking.objects.select_related('customer', 'provider', 'service', 'service__category')
        
        if user.role == 'customer':
            return base_qs.filter(customer=user).order_by('-created_at')
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
                queryset = base_qs.filter(
                    Q(provider=user) |  # Directly assigned bookings
                    Q(provider__isnull=True, service__category__name=provider_category)  # Service-based bookings in their skill category
                ).distinct().order_by('-created_at')
            else:
                # If no skill, only show directly assigned bookings
                queryset = base_qs.filter(provider=user).order_by('-created_at')
            
            return queryset
        elif user.role == 'admin':
            return base_qs.all().order_by('-created_at')
        return base_qs.none()

    @action(detail=False, methods=['get'])
    def stats(self, request):
        queryset = self.get_queryset()
        
        # Calculate counts
        pending = queryset.filter(status='pending').count()
        # Active jobs include those in progress/accepted (regardless of payment for reworks) 
        # plus completed jobs that are not yet paid
        active = queryset.filter(
            Q(status__in=['accepted', 'in_progress']) | 
            Q(status='completed', is_paid=False)
        ).count()
        completed = queryset.filter(status__in=['completed', 'paid']).count()
        
        # Calculate earnings
        from django.db.models import Sum, Avg
        earnings = queryset.filter(is_paid=True, status='paid').aggregate(total=Sum('total_price'))['total'] or 0
        
        # Calculate average rating for provider
        avg_rating = 0
        if request.user.role == 'provider':
            avg_rating = Review.objects.filter(provider=request.user).aggregate(Avg('rating'))['rating__avg'] or 0

        return Response({
            "pending": pending,
            "active": active,
            "completed": completed,
            "earnings": float(earnings),
            "average_rating": round(float(avg_rating), 1)
        })

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
        # We manually fetch the booking to avoid 404 if it's not in the 'default' filtered queryset
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)
            
        new_status = request.data.get('status')
        user = request.user

        # Manual Authorization Check
        if user.role == 'provider':
            # Check if this provider is allowed to act on this booking
            skill_map = {
                'Cleaning': 'cleaner',
                'Painting': 'painter',
                'Electrical Repairing': 'electrician',
                'Gardening': 'gardener',
                'Carpentry': 'carpenter',
                'Plumbing': 'plumber'
            }
            provider_category = skill_map.get(booking.service.category.name)
            
            is_assigned = booking.provider == user
            is_eligible_for_pending = (booking.provider is None and 
                                      booking.status == 'pending' and 
                                      user.skills == provider_category)
            
            if not (is_assigned or is_eligible_for_pending or user.role == 'admin'):
                return Response({"error": "You are not authorized to update this booking."}, 
                                status=status.HTTP_403_FORBIDDEN)
        
        # Validate status
        if new_status not in dict(Booking.STATUS_CHOICES):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Validate status transitions
        current_status = booking.status
        if not self._is_valid_status_transition(current_status, new_status, user):
            return Response(
                {"error": f"Invalid status transition from '{current_status}' to '{new_status}'."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Handle special logic for completion
        if new_status == 'completed':
            final_price = request.data.get('final_price')
            if final_price and user.role == 'provider':
                try:
                    booking.final_price = Decimal(str(final_price))
                except (ValueError, TypeError, Exception) as e:
                    return Response({"error": f"Invalid final price format: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Handle payment
        if new_status == 'paid':
            if booking.status != 'completed':
                return Response({"error": "Can only pay for completed bookings"}, status=status.HTTP_400_BAD_REQUEST)
            booking.is_paid = True
            booking.payment_method = request.data.get('payment_method', 'online')
        
        booking.status = new_status
        booking.save()

        # Send Notifications
        if new_status == 'accepted':
            if not booking.provider:
                booking.provider = user
                booking.save()
            Notification.objects.create(
                recipient=booking.customer,
                title="Booking Accepted",
                message=f"Your provider {booking.provider.first_name} has accepted the booking for {booking.service.name}.",
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

        return Response(BookingSerializer(booking).data)
    
    def _is_valid_status_transition(self, current_status, new_status, user):
        """Validate status transitions based on user role"""
        # Allow same status update (idempotent)
        if current_status == new_status:
            return True

        # Customer can only cancel
        if user.role == 'customer':
            return new_status in ['cancelled']
        
        # Provider can manage the flow
        if user.role == 'provider':
            valid_transitions = {
                'pending': ['accepted', 'rejected'],
                'assigned': ['accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
                'accepted': ['in_progress', 'completed', 'cancelled'],
                'in_progress': ['completed', 'cancelled'],
                'completed': ['paid'],
                'cancelled': [],
                'rejected': [],
                'paid': []
            }
            return new_status in valid_transitions.get(current_status, [])
        
        # Admin can do anything
        return True

    @action(detail=True, methods=['post'], url_path='initialize-payment')
    def initialize_payment(self, request, pk=None):
        booking = self.get_object()
        
        if booking.is_paid:
            return Response({"error": "Booking is already paid"}, status=status.HTTP_400_BAD_REQUEST)
            
        return_url = request.data.get('return_url', 'http://localhost:5173/payment-response')
        
        # Ensure phone is exactly 10 digits for Khalti Sandbox (must start with 98 or 97)
        phone = booking.customer.phone
        if not phone or len(str(phone)) != 10 or not str(phone).startswith(('98', '97')):
            phone = "9800000000"
            
        payload = {
            "return_url": return_url,
            "website_url": "http://localhost:5173/",
            "amount": int(round(float(booking.total_price) * 100)),
            "purchase_order_id": f"{booking.id}_{int(timezone.now().timestamp())}",
            "purchase_order_name": f"Booking {booking.id}",
        }
        
        # Add customer info with validation
        cust_info = {}
        if booking.customer.first_name:
            cust_info["name"] = f"{booking.customer.first_name} {booking.customer.last_name or ''}".strip()
        if booking.customer.email:
            cust_info["email"] = booking.customer.email
        if len(str(phone)) == 10:
            cust_info["phone"] = str(phone)
            
        if cust_info:
            payload["customer_info"] = cust_info
        
        headers = {
            "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        try:
            print(f"--- KHALTI INITIATION ---")
            print(f"Payload: {payload}")
            response = requests.post(settings.KHALTI_INITIATE_URL, json=payload, headers=headers)
            res_data = response.json()
            print(f"Status Code: {response.status_code}")
            print(f"Response: {res_data}")
            
            if response.status_code == 200 and res_data.get('payment_url'):


                return Response({
                    "payment_url": res_data['payment_url'],
                    "pidx": res_data['pidx']
                })
            else:
                return Response({
                    "error": "Failed to initialize payment with Khalti",
                    "details": res_data
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({"error": f"Internal error during initialization: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['post'], url_path='verify-payment')
    def verify_payment(self, request, pk=None):
        booking = self.get_object()
        
        if booking.is_paid:
            return Response({"message": "Booking already paid"}, status=status.HTTP_200_OK)
            
        pidx = request.data.get('pidx')
        if not pidx:
            return Response({"error": "pidx is required"}, status=status.HTTP_400_BAD_REQUEST)

        headers = {
            "Authorization": f"Key {settings.KHALTI_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        payload = {"pidx": pidx}
        
        try:
            response = requests.post(settings.KHALTI_LOOKUP_URL, json=payload, headers=headers)
            res_data = response.json()
            
            # Logic for KPG 2.0 lookup response
            if response.status_code == 200 and res_data.get('status') == 'Completed':
                booking.is_paid = True
                booking.status = 'paid'
                booking.payment_method = 'khalti_v2'
                booking.paid_at = timezone.now()
                booking.save()

                # Notify Provider
                if booking.provider:
                    Notification.objects.create(
                        recipient=booking.provider,
                        title="Payment Received",
                        message=f"Payment of Rs. {booking.total_price} received via Khalti for {booking.service.name}.",
                        booking=booking
                    )
                
                # Notify Customer
                Notification.objects.create(
                    recipient=booking.customer,
                    title="Payment Successful",
                    message=f"Your Khalti payment for {booking.service.name} was successful.",
                    booking=booking
                )
                
                return Response({
                    "message": "Payment verified successfully",
                    "booking": BookingSerializer(booking).data
                })
            else:
                return Response({
                    "error": "Payment verification failed or incomplete",
                    "details": res_data
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({"error": f"Internal error during verification: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def top_reviews(self, request):
        # Fetch high-rated reviews (4+ stars)
        # Limit to 6 items and order by most recent
        qs = Review.objects.select_related('customer', 'booking', 'booking__service').filter(rating__gte=4).order_by('-created_at')[:6]
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        user = self.request.user
        qs = Review.objects.select_related('customer', 'provider', 'booking').all()
        
        provider_id = self.request.query_params.get('provider_id')
        if provider_id:
            qs = qs.filter(provider_id=provider_id)
        elif not user.is_authenticated:
            return qs
        elif user.role == 'provider':
            # If logged in user is a provider and no specific provider_id was requested,
            # only show reviews received by this provider.
            qs = qs.filter(provider=user)
        elif user.role == 'customer':
            # If logged in user is a customer and no specific provider_id was requested,
            # show reviews they HAVE GIVEN.
            qs = qs.filter(customer=user)
            
        return qs.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)
