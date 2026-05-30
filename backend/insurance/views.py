from decimal import Decimal
from django.db import transaction as db_transaction
from django.utils import timezone
from django.core.mail import send_mail
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import InsuranceClaim, InsurancePool
from .serializers import InsuranceClaimSerializer, InsurancePoolSerializer


def _notify_admins_refund(claim):
    """Send in-app notification and email to all admin users after refund resolution."""
    from accounts.models import User
    from notifications.models import Notification

    booking = claim.booking
    customer_name = booking.customer.get_full_name() or booking.customer.username

    if claim.pool_deducted:
        pool_status_msg = (
            f"Pool Sufficient — Rs.{claim.refund_amount} has been deducted from the "
            f"insurance pool. Please process Rs.{claim.refund_amount} refund to {customer_name}."
        )
        notification_type = "admin_refund_pool_sufficient"
    else:
        pool_status_msg = (
            f"Pool Insufficient — Insurance pool does not have enough funds. "
            f"Please manually arrange and process Rs.{claim.refund_amount} refund to {customer_name}."
        )
        notification_type = "admin_refund_pool_insufficient"

    email_body = (
        f"Insurance Refund — Action Required\n\n"
        f"Customer Name : {customer_name}\n"
        f"Booking ID    : #{booking.id}\n"
        f"Original Amount Paid : Rs.{booking.total_price}\n"
        f"Refund Amount (80%)  : Rs.{claim.refund_amount}\n\n"
        f"Pool Status: {pool_status_msg}\n\n"
        f"Log in to the admin panel to mark this refund as resolved once processed."
    )

    admins = User.objects.filter(role="admin", is_active=True)
    for admin in admins:
        Notification.objects.create(
            recipient=admin,
            notification_type=notification_type,
            extra_data={
                "claim_id": str(claim.id),
                "booking_id": str(booking.id),
                "customer_name": customer_name,
                "original_amount": str(booking.total_price),
                "refund_amount": str(claim.refund_amount),
                "pool_deducted": claim.pool_deducted,
                "shortfall": claim.shortfall,
            },
            booking=booking,
        )
        if admin.email:
            try:
                send_mail(
                    subject=f"[SewaSaathi] Insurance Refund — Booking #{booking.id}",
                    message=email_body,
                    from_email="no-reply@sewasaathi.com",
                    recipient_list=[admin.email],
                    fail_silently=True,
                )
            except Exception:
                pass


class InsuranceClaimViewSet(viewsets.ModelViewSet):
    serializer_class = InsuranceClaimSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return InsuranceClaim.objects.all().order_by("-timestamp")
        return InsuranceClaim.objects.filter(customer=user).order_by("-timestamp")

    def perform_create(self, serializer):
        serializer.save(customer=self.request.user)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser], url_path="approve-reject")
    def approve_reject(self, request, pk=None):
        claim = self.get_object()
        new_status = request.data.get("status")
        if new_status not in ["approved", "rejected"]:
            return Response(
                {"error": "Invalid status. Must be 'approved' or 'rejected'."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        claim.status = new_status
        if new_status == "rejected":
            claim.refund_status = "rejected"
        elif new_status == "approved":
            claim.refund_status = "approved"
        claim.save()
        return Response(InsuranceClaimSerializer(claim).data)

    @action(detail=True, methods=["post"], url_path="choose-resolution")
    def choose_resolution(self, request, pk=None):
        claim = self.get_object()
        if claim.customer != request.user:
            return Response(
                {"error": "You are not authorized to perform this action."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if claim.status != "approved":
            return Response(
                {"error": "Resolution can only be chosen for approved claims."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        resolution = request.data.get("resolution")
        if resolution not in ["refund", "rework"]:
            return Response(
                {"error": "Invalid resolution. Must be 'refund' or 'rework'."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        claim.resolution = resolution
        booking = claim.booking

        if resolution == "refund":
            refund_amount = (booking.total_price * Decimal("0.80")).quantize(Decimal("0.01"))

            with db_transaction.atomic():
                pool = InsurancePool.objects.select_for_update().get(id=1)

                if pool.current_balance >= refund_amount:
                    pool.current_balance -= refund_amount
                    pool.total_paid_out += refund_amount
                    pool.save()
                    claim.pool_deducted = True
                    claim.shortfall = False
                else:
                    claim.pool_deducted = False
                    claim.shortfall = True

                claim.refund_amount = refund_amount
                claim.refund_status = "admin_notified"
                claim.admin_notified_at = timezone.now()
                booking.status = "refunded"
                booking.save()
                claim.save()

            _notify_admins_refund(claim)

            from notifications.models import Notification
            Notification.objects.create(
                recipient=claim.customer,
                notification_type="insurance_refund_initiated",
                extra_data={
                    "booking_id": str(booking.id),
                    "service_name_key": booking.service.name_key,
                },
                booking=booking,
            )

        if resolution == "rework":
            booking.status = "accepted"
            booking.is_rework = True
            booking.save()
            claim.save()

            from notifications.models import Notification
            Notification.objects.create(
                recipient=claim.customer,
                notification_type="insurance_rework_started",
                extra_data={"booking_id": str(booking.id)},
                booking=booking,
            )
            Notification.objects.create(
                recipient=booking.provider,
                notification_type="insurance_rework_assigned",
                extra_data={"booking_id": str(booking.id)},
                booking=booking,
            )

        return Response(InsuranceClaimSerializer(claim).data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAdminUser], url_path="mark-resolved")
    def mark_resolved(self, request, pk=None):
        claim = self.get_object()
        if claim.resolution != "refund":
            return Response(
                {"error": "This action is only for refund claims."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if claim.refund_status == "fully_resolved":
            return Response(
                {"error": "This refund is already fully resolved."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        claim.refund_status = "fully_resolved"
        claim.admin_resolved_at = timezone.now()
        claim.save()
        return Response(InsuranceClaimSerializer(claim).data)


class InsurancePoolViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InsurancePool.objects.all()
    serializer_class = InsurancePoolSerializer
    permission_classes = [permissions.IsAdminUser]
