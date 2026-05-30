from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect, get_object_or_404
from django.utils import timezone
from django.db.models import Sum

from .models import PlatformRevenue


@admin.register(PlatformRevenue)
class PlatformRevenueAdmin(admin.ModelAdmin):
    list_display = (
        "booking_id_link",
        "get_provider_name",
        "booking_amount",
        "insurance_deduction",
        "commission_amount",
        "provider_payout_amount",
        "payment_method",
        "commission_status",
        "payout_status",
        "created_at",
        "action_button",
    )
    list_filter = ("commission_status", "payout_status", "payment_method")
    search_fields = ("booking__id", "provider__first_name", "provider__last_name", "provider__phone")
    ordering = ("-created_at", "-id")

    # Prevent any edits — this table is append-only
    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    # ---- Summary cards at top of list ----
    def changelist_view(self, request, extra_context=None):
        from insurance.models import InsurancePool

        qs = PlatformRevenue.objects.all()
        extra_context = extra_context or {}

        extra_context["total_revenue"] = (
            qs.filter(commission_status__in=("collected", "received"))
            .aggregate(t=Sum("commission_amount"))["t"] or 0
        )
        extra_context["pending_payouts_amount"] = (
            qs.filter(payout_status="pending")
            .aggregate(t=Sum("provider_payout_amount"))["t"] or 0
        )
        extra_context["pending_payouts_count"] = qs.filter(payout_status="pending").count()
        extra_context["pending_dues_amount"] = (
            qs.filter(commission_status="due")
            .aggregate(t=Sum("commission_amount"))["t"] or 0
        )
        extra_context["pending_dues_count"] = qs.filter(commission_status="due").count()

        pool = InsurancePool.objects.filter(id=1).first()
        extra_context["pool_balance"] = pool.current_balance if pool else 0

        return super().changelist_view(request, extra_context=extra_context)

    # ---- Computed columns ----
    def booking_id_link(self, obj):
        return format_html("<b>#{}</b>", obj.booking_id)
    booking_id_link.short_description = "Booking"

    def get_provider_name(self, obj):
        if obj.provider:
            return obj.provider.get_full_name() or obj.provider.phone
        return "—"
    get_provider_name.short_description = "Provider"

    def action_button(self, obj):
        if obj.payout_status == "pending":
            return format_html(
                '<a class="button" style="background:#1B3C53;color:white;white-space:nowrap" href="{}">Mark as Sent</a>',
                f"mark-sent/{obj.id}/",
            )
        if obj.commission_status == "due":
            return format_html(
                '<a class="button" style="background:#dc3545;color:white;white-space:nowrap" href="{}">Mark as Received</a>',
                f"mark-received/{obj.id}/",
            )
        if obj.payout_status == "sent":
            return format_html('<span style="color:#28a745;font-weight:bold;">✅ Payout Sent</span>')
        if obj.commission_status == "received":
            return format_html('<span style="color:#28a745;font-weight:bold;">✅ Commission Received</span>')
        return "—"
    action_button.short_description = "Action"

    # ---- Custom URL routes ----
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "mark-sent/<int:record_id>/",
                self.admin_site.admin_view(self.mark_payout_sent),
                name="revenue_mark_payout_sent",
            ),
            path(
                "mark-received/<int:record_id>/",
                self.admin_site.admin_view(self.mark_commission_received),
                name="revenue_mark_commission_received",
            ),
        ]
        return custom_urls + urls

    def mark_payout_sent(self, request, record_id):
        record = get_object_or_404(PlatformRevenue, id=record_id)
        if record.payout_status != "pending":
            self.message_user(request, "Payout is not in pending state.", level="warning")
            return redirect("..")
        record.payout_status = "sent"
        record.payout_sent_at = timezone.now()
        record.save(update_fields=["payout_status", "payout_sent_at", "updated_at"])
        # Mirror to Booking
        record.booking.__class__.objects.filter(pk=record.booking_id).update(payout_status="sent")
        self.message_user(
            request,
            f"Booking #{record.booking_id} — provider payout of Rs.{record.provider_payout_amount} marked as sent.",
        )
        return redirect("..")

    def mark_commission_received(self, request, record_id):
        record = get_object_or_404(PlatformRevenue, id=record_id)
        if record.commission_status != "due":
            self.message_user(request, "Commission is not in 'due' state.", level="warning")
            return redirect("..")
        record.commission_status = "received"
        record.commission_received_at = timezone.now()
        record.save(update_fields=["commission_status", "commission_received_at", "updated_at"])
        # Mirror to Booking
        record.booking.__class__.objects.filter(pk=record.booking_id).update(commission_status="received")
        self.message_user(
            request,
            f"Booking #{record.booking_id} — commission of Rs.{record.commission_amount} marked as received.",
        )
        return redirect("..")
