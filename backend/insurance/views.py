from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import InsuranceClaim, InsurancePool
from .serializers import InsuranceClaimSerializer, InsurancePoolSerializer

class InsuranceClaimViewSet(viewsets.ModelViewSet):
    serializer_class = InsuranceClaimSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return InsuranceClaim.objects.all().order_by('-timestamp')
        return InsuranceClaim.objects.filter(customer=user).order_by('-timestamp')

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser], url_path='approve-reject')
    def approve_reject(self, request, pk=None):
        claim = self.get_object()
        new_status = request.data.get('status')
        if new_status not in ['approved', 'rejected']:
            return Response({"error": "Invalid status. Must be 'approved' or 'rejected'."}, status=status.HTTP_400_BAD_REQUEST)
        
        claim.status = new_status
        claim.save()
        return Response(InsuranceClaimSerializer(claim).data)

    @action(detail=True, methods=['post'], url_path='choose-resolution')
    def choose_resolution(self, request, pk=None):
        claim = self.get_object()
        if claim.customer != request.user:
            return Response({"error": "You are not authorized to perform this action."}, status=status.HTTP_403_FORBIDDEN)
        
        if claim.status != 'approved':
            return Response({"error": "Resolution can only be chosen for approved claims."}, status=status.HTTP_400_BAD_REQUEST)
        
        resolution = request.data.get('resolution')
        if resolution not in ['refund', 'rework']:
            return Response({"error": "Invalid resolution. Must be 'refund' or 'rework'."}, status=status.HTTP_400_BAD_REQUEST)
        
        claim.resolution = resolution
        claim.save()

        booking = claim.booking
        if resolution == 'refund':
            booking.status = 'refunded'
            booking.save()
            
            # Create Notification
            from notifications.models import Notification
            Notification.objects.create(
                recipient=claim.customer,
                title="Refund Initiated",
                message=f"Your refund for Booking #{booking.id} ({booking.service.name}) will be sent within 3 days.",
                booking=booking
            )

        # Handle Rework logic - simplified as per user request (logic to be confirmed later)
        if resolution == 'rework':
            booking.status = 'accepted'
            booking.is_rework = True
            booking.save()
            
            # Create Notifications
            from notifications.models import Notification
            # Notify Customer
            Notification.objects.create(
                recipient=claim.customer,
                title="Rework Started",
                message=f"Your rework request for Booking #{booking.id} has been accepted. The original provider will contact you soon.",
                booking=booking
            )
            # Notify Provider
            Notification.objects.create(
                recipient=booking.provider,
                title="Rework Assigned",
                message=f"A rework has been assigned to you for Booking #{booking.id}. Please check your active jobs.",
                booking=booking
            )

        return Response(InsuranceClaimSerializer(claim).data)

class InsurancePoolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InsurancePool.objects.all()
    serializer_class = InsurancePoolSerializer
    permission_classes = [permissions.IsAdminUser]
