from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction
from django.db.models import Q
from django.db.models import Prefetch
from decimal import Decimal
from .models import Booking, Review, ProviderBookingResponse
from .expiration import expire_pending_bookings
from insurance.models import InsuranceClaim
from .serializers import BookingSerializer, BookingStatusUpdateSerializer, ReviewSerializer
from notifications.models import Notification
from services.provider_category import (
    skill_to_category_name_key,
    category_name_key_to_skill,
)
import requests
from django.conf import settings
from django.utils import timezone


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request, *args, **kwargs):
        expire_pending_bookings()
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        expire_pending_bookings()
        return super().retrieve(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user
        base_qs = Booking.objects.select_related(
            'customer',
            'provider',
            'service',
            'service__category'
        ).prefetch_related(
            Prefetch('claims', queryset=InsuranceClaim.objects.only('id', 'status', 'resolution', 'booking_id').order_by('-timestamp')),
            'review',
        )
        
        if user.role == 'customer':
            return base_qs.filter(customer=user).order_by('-created_at')
        elif user.role == 'provider':
            category_name_key = skill_to_category_name_key(user.skills)

            if category_name_key:
                queryset = base_qs.filter(
                    Q(provider=user)
                    | Q(
                        provider__isnull=True,
                        service__category__name_key=category_name_key,
                    )
                ).distinct().order_by('-created_at')
            else:
                queryset = base_qs.filter(provider=user).order_by('-created_at')

            return queryset.prefetch_related(
                Prefetch(
                    "provider_responses",
                    queryset=ProviderBookingResponse.objects.filter(
                        provider=user,
                        response=ProviderBookingResponse.RESPONSE_DECLINED,
                    ),
                    to_attr="my_decline_responses",
                )
            )
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
        
        # Calculate average rating for Provider
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
                notification_type="new_booking_request",
                extra_data={
                    "customer_name": booking.customer.first_name,
                    "service_name_key": booking.service.name_key
                },
                booking=booking
            )
        else:
            category_name = booking.service.category.name_key
            target_skill = category_name_key_to_skill(category_name)
            if target_skill:
                from accounts.models import User
                eligible_providers = User.objects.filter(
                    role='provider',
                    skills=target_skill,
                    provider_status='approved',
                    is_active=True,
                )
                for provider in eligible_providers:
                    Notification.objects.create(
                        recipient=provider,
                        notification_type="new_job_available",
                        extra_data={
                            "service_name_key": booking.service.name_key,
                            "category_name_key": category_name
                        },
                        booking=booking
                    )

    def _provider_can_act_on_booking(self, booking, user):
        required_skill = category_name_key_to_skill(
            booking.service.category.name_key
        )
        is_assigned = booking.provider == user
        is_eligible_for_pending = (
            booking.provider is None
            and booking.status == "pending"
            and user.skills == required_skill
        )
        return is_assigned or is_eligible_for_pending

    def _open_job_unavailable_response(self, booking):
        if booking.provider_id:
            return Response(
                {
                    "error": "This booking has already been accepted by another provider."
                },
                status=status.HTTP_409_CONFLICT,
            )
        return Response(
            {"error": "This booking is no longer available."},
            status=status.HTTP_409_CONFLICT,
        )

    def _get_locked_booking(self, pk):
        return (
            Booking.objects.select_related("service__category")
            .select_for_update()
            .get(pk=pk)
        )

    def _record_provider_decline(self, booking, provider):
        if booking.status != "pending":
            return Response(
                {"error": "Only pending bookings can be declined."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if booking.provider_id and booking.provider_id != provider.id:
            return self._open_job_unavailable_response(booking)
        ProviderBookingResponse.objects.get_or_create(
            booking=booking,
            provider=provider,
            defaults={"response": ProviderBookingResponse.RESPONSE_DECLINED},
        )
        return Response(BookingSerializer(booking, context={"request": self.request}).data)

    @action(detail=True, methods=["post"], url_path="decline")
    def decline(self, request, pk=None):
        user = request.user
        if user.role != "provider":
            return Response(
                {"error": "Only providers can decline booking requests."},
                status=status.HTTP_403_FORBIDDEN,
            )
        try:
            with transaction.atomic():
                booking = self._get_locked_booking(pk)
                if booking.status != "pending" or booking.provider_id:
                    return self._open_job_unavailable_response(booking)
                if not self._provider_can_act_on_booking(booking, user):
                    return Response(
                        {"error": "You are not authorized to decline this booking."},
                        status=status.HTTP_403_FORBIDDEN,
                    )
                return self._record_provider_decline(booking, user)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], url_path='update-status')
    def update_status(self, request, pk=None):
        new_status = request.data.get('status')
        user = request.user

        # Atomic accept/decline for open job requests — prevents duplicate assignment.
        if user.role == "provider" and new_status in ("accepted", "rejected"):
            try:
                with transaction.atomic():
                    booking = self._get_locked_booking(pk)
                    if new_status == "rejected":
                        if booking.status != "pending" or booking.provider_id:
                            return self._open_job_unavailable_response(booking)
                        if not self._provider_can_act_on_booking(booking, user):
                            return Response(
                                {"error": "You are not authorized to update this booking."},
                                status=status.HTTP_403_FORBIDDEN,
                            )
                        return self._record_provider_decline(booking, user)

                    # Accept
                    if booking.provider_id and booking.provider_id != user.id:
                        return self._open_job_unavailable_response(booking)
                    if booking.status != "pending":
                        return self._open_job_unavailable_response(booking)
                    if not self._provider_can_act_on_booking(booking, user):
                        return Response(
                            {"error": "You are not authorized to update this booking."},
                            status=status.HTTP_403_FORBIDDEN,
                        )
                    booking.provider = user
                    booking.status = "accepted"
                    booking.save(update_fields=["provider", "status", "updated_at"])
                    ProviderBookingResponse.objects.filter(
                        booking=booking,
                        provider=user,
                    ).delete()
            except Booking.DoesNotExist:
                return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

            Notification.objects.create(
                recipient=booking.customer,
                notification_type="booking_accepted",
                extra_data={
                    "provider_name": booking.provider.first_name,
                    "service_name_key": booking.service.name_key,
                },
                booking=booking,
            )
            return Response(
                BookingSerializer(booking, context={"request": request}).data
            )

        # We manually fetch the booking to avoid 404 if it's not in the 'default' filtered queryset
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        # Manual Authorization Check
        if user.role == 'provider':
            if not self._provider_can_act_on_booking(booking, user):
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
            price_note = request.data.get('price_note')
            if price_note and user.role == 'provider':
                booking.price_note = price_note
        
        # Handle payment
        if new_status == 'paid':
            if booking.status != 'completed':
                return Response({"error": "Can only pay for completed bookings"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Set payment method if provided
            payment_method = request.data.get('payment_method')
            
            # Backend Validation: Prevent confirming payment if paymentMethod is not 'cash'
            # (especially when initiated by a provider)
            if user.role == 'provider':
                # If the booking is already set to online, or the incoming method is not cash
                if booking.payment_method != 'cash' and payment_method != 'cash':
                    return Response({
                        "error": "Online payments must be verified through the payment gateway. You cannot manually confirm them."
                    }, status=status.HTTP_400_BAD_REQUEST)

            if payment_method:
                booking.payment_method = payment_method
            
            booking.is_paid = True
            if not booking.paid_at:
                booking.paid_at = timezone.now()
        
        booking.status = new_status
        booking.save()

        # Send Notifications
        if new_status == 'accepted':
            if not booking.provider:
                booking.provider = user
                booking.save()
            if user.role == "provider":
                ProviderBookingResponse.objects.filter(
                    booking=booking,
                    provider=user,
                ).delete()
            Notification.objects.create(
                recipient=booking.customer,
                notification_type="booking_accepted",
                extra_data={
                    "provider_name": booking.provider.first_name,
                    "service_name_key": booking.service.name_key
                },
                booking=booking
            )
        elif new_status == 'in_progress':
            Notification.objects.create(
                recipient=booking.customer,
                notification_type="service_started",
                extra_data={
                    "service_name_key": booking.service.name_key
                },
                booking=booking
            )
        elif new_status == 'completed':
            Notification.objects.create(
                recipient=booking.customer,
                notification_type="service_completed",
                extra_data={
                    "service_name_key": booking.service.name_key
                },
                booking=booking
            )
        elif new_status == 'paid':
            payment_method = request.data.get('payment_method', 'online')
            if payment_method == 'cash':
                Notification.objects.create(
                    recipient=booking.customer,
                    notification_type="payment_successful_cash",
                    extra_data={
                        "service_name_key": booking.service.name_key
                    },
                    booking=booking
                )

        return Response(BookingSerializer(booking).data)
    
    def _is_valid_status_transition(self, current_status, new_status, user):
        """Validate status transitions based on user role"""
        # Allow same status update (idempotent)
        if current_status == new_status:
            return True

        # Customer can only cancel a pending booking (use the /cancel endpoint instead)
        if user.role == 'customer':
            return current_status == 'pending' and new_status == 'cancelled'

        # Provider can manage the flow
        if user.role == 'provider':
            valid_transitions = {
                'pending': ['accepted'],
                'assigned': ['accepted', 'in_progress', 'completed', 'cancelled'],
                'accepted': ['in_progress', 'completed'],
                'in_progress': ['completed'],
                'completed': ['paid'],
                'cancelled': [],
                'paid': []
            }
            return new_status in valid_transitions.get(current_status, [])
        
        # Admin can do anything
        return True

    @action(detail=True, methods=['post'], url_path='cancel')
    def cancel(self, request, pk=None):
        user = request.user
        try:
            booking = Booking.objects.select_related('customer', 'provider', 'service').get(pk=pk)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.role == 'customer':
            if booking.customer_id != user.id:
                return Response({"error": "You are not authorized to cancel this booking."}, status=status.HTTP_403_FORBIDDEN)
            if booking.status != 'pending':
                return Response({"error": "You can only cancel a booking while it is pending."}, status=status.HTTP_400_BAD_REQUEST)
        elif user.role == 'provider':
            if booking.provider_id != user.id:
                return Response({"error": "You are not authorized to cancel this booking."}, status=status.HTTP_403_FORBIDDEN)
            if booking.status != 'accepted':
                return Response({"error": "You can only cancel a booking that is in accepted state."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Only customers and providers can cancel bookings."}, status=status.HTTP_403_FORBIDDEN)

        booking.status = 'cancelled'
        booking.cancelled_by = user.role
        booking.save(update_fields=['status', 'cancelled_by', 'updated_at'])

        if user.role == 'customer' and booking.provider:
            Notification.objects.create(
                recipient=booking.provider,
                notification_type="booking_cancelled_by_customer",
                extra_data={
                    "customer_name": booking.customer.first_name,
                    "service_name_key": booking.service.name_key,
                },
                booking=booking,
            )
        elif user.role == 'provider':
            Notification.objects.create(
                recipient=booking.customer,
                notification_type="booking_cancelled_by_provider",
                extra_data={
                    "provider_name": booking.provider.first_name,
                    "service_name_key": booking.service.name_key,
                },
                booking=booking,
            )

        return Response(BookingSerializer(booking, context={"request": request}).data)

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
            "purchase_order_id": f"booking-{booking.id}",
            "purchase_order_name": f"SewaSaathi Booking #{booking.id}",
        }

        # Khalti minimum is NPR 10 = 1000 paisa
        if payload["amount"] < 1000:
            return Response(
                {"error": f"Minimum payment amount is NPR 10. This booking total is NPR {booking.total_price:.2f}."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
            "Authorization": f"key {settings.KHALTI_SECRET_KEY}",
            "Content-Type": "application/json"
        }
        
        # Mask key for debugging purposes
        secret_key = settings.KHALTI_SECRET_KEY or ""
        masked_key = f"{secret_key[:10]}...{secret_key[-4:]}" if len(secret_key) > 15 else "INVALID_OR_MISSING_KEY"
        
        try:
            # print(f"--- KHALTI INITIATION ---")
            # print(f"Using Khalti Key: {masked_key}")
            # print(f"Endpoint: {settings.KHALTI_INITIATE_URL}")
            # print(f"Payload: {payload}")
            response = requests.post(settings.KHALTI_INITIATE_URL, json=payload, headers=headers)
            res_data = response.json()
            # print(f"Status Code: {response.status_code}")
            # print(f"Response: {res_data}")
            
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
                        notification_type="payment_received_khalti",
                        extra_data={
                            "amount": str(booking.total_price),
                            "service_name_key": booking.service.name_key
                        },
                        booking=booking
                    )
                
                # Notify Customer
                Notification.objects.create(
                    recipient=booking.customer,
                    notification_type="payment_successful_khalti",
                    extra_data={
                        "service_name_key": booking.service.name_key
                    },
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
        # Limit to 3 items and order by most recent
        qs = Review.objects.select_related('customer', 'booking', 'booking__service').filter(rating__gte=4).order_by('-created_at')[:3]
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
