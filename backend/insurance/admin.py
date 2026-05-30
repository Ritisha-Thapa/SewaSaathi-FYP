from django.contrib import admin
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect, get_object_or_404
from django.utils import timezone

from .models import InsurancePool, InsuranceClaim


@admin.register(InsurancePool)
class InsurancePoolAdmin(admin.ModelAdmin):
    list_display = ("id", "current_balance", "total_contributed", "total_paid_out", "updated_at")
    readonly_fields = ("current_balance", "total_contributed", "total_paid_out", "created_at", "updated_at")


@admin.register(InsuranceClaim)
class InsuranceClaimAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "booking",
        "get_customer_name",
        "get_original_amount",
        "get_refund_amount",
        "status",
        "resolution",
        "get_pool_status",
        "refund_status",
        "approval_actions",
        "refund_actions",
        "timestamp",
    )
    list_filter = ("status", "resolution", "refund_status", "pool_deducted", "shortfall")
    search_fields = ("booking__id", "customer__username", "description")
    readonly_fields = (
        "timestamp",
        "get_customer_name",
        "get_customer_phone",
        "get_booking_location",
        "refund_amount",
        "pool_deducted",
        "shortfall",
        "admin_notified_at",
        "admin_resolved_at",
        "refund_status",
    )

    fieldsets = (
        (None, {
            "fields": ("booking", "customer", "status", "resolution", "timestamp"),
        }),
        ("Customer Details", {
            "fields": ("get_customer_name", "get_customer_phone", "get_booking_location"),
        }),
        ("Claim Content", {
            "fields": ("description", "evidence"),
        }),
        ("Refund Details", {
            "fields": (
                "refund_amount",
                "refund_status",
                "pool_deducted",
                "shortfall",
                "admin_notified_at",
                "admin_resolved_at",
            ),
        }),
    )

    # ---- change list header: live pool balance ----
    def changelist_view(self, request, extra_context=None):
        pool = InsurancePool.objects.filter(id=1).first()
        extra_context = extra_context or {}
        if pool:
            extra_context["pool_balance"] = pool.current_balance
            extra_context["pool_contributed"] = pool.total_contributed
            extra_context["pool_paid_out"] = pool.total_paid_out
        return super().changelist_view(request, extra_context=extra_context)

    # ---- computed columns ----
    def get_customer_name(self, obj):
        return obj.booking.customer.get_full_name()
    get_customer_name.short_description = "Customer Name"

    def get_customer_phone(self, obj):
        return obj.booking.phone
    get_customer_phone.short_description = "Customer Phone"

    def get_booking_location(self, obj):
        return obj.booking.address
    get_booking_location.short_description = "Booking Location"

    def get_original_amount(self, obj):
        return f"Rs. {obj.booking.total_price}"
    get_original_amount.short_description = "Original Amount"

    def get_refund_amount(self, obj):
        if obj.refund_amount is not None:
            return f"Rs. {obj.refund_amount}"
        return "—"
    get_refund_amount.short_description = "Refund Amount (80%)"

    def get_pool_status(self, obj):
        if obj.resolution != "refund":
            return "—"
        if obj.shortfall:
            return format_html(
                '<span style="color:#dc3545;font-weight:bold;">⚠ Shortfall</span>'
            )
        if obj.pool_deducted:
            return format_html(
                '<span style="color:#28a745;font-weight:bold;">✅ Deducted</span>'
            )
        return "—"
    get_pool_status.short_description = "Pool Status"

    # ---- Approve / Reject buttons (pending claims) ----
    def approval_actions(self, obj):
        if obj.status == "pending":
            return format_html(
                '<a class="button" href="{}">Approve</a>&nbsp;'
                '<a class="button" style="background:#dc3545;color:white" href="{}">Reject</a>',
                f"approve/{obj.id}/",
                f"reject/{obj.id}/",
            )
        return "—"
    approval_actions.short_description = "Claim Actions"

    # ---- Mark as Resolved button (approved refunds awaiting resolution) ----
    def refund_actions(self, obj):
        if obj.resolution == "refund" and obj.refund_status in ("admin_notified",):
            color = "#dc3545" if obj.shortfall else "#1B3C53"
            label = "⚠ Mark Resolved (Shortfall)" if obj.shortfall else "Mark Resolved"
            return format_html(
                '<a class="button" style="background:{};color:white" href="{}">{}</a>',
                color,
                f"mark-resolved/{obj.id}/",
                label,
            )
        if obj.resolution == "refund" and obj.refund_status == "fully_resolved":
            return format_html('<span style="color:#28a745;">✅ Resolved</span>')
        return "—"
    refund_actions.short_description = "Refund Action"

    # ---- custom URL routes ----
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("approve/<int:claim_id>/", self.admin_site.admin_view(self.approve_claim), name="insurance_claim_approve"),
            path("reject/<int:claim_id>/", self.admin_site.admin_view(self.reject_claim), name="insurance_claim_reject"),
            path("mark-resolved/<int:claim_id>/", self.admin_site.admin_view(self.admin_mark_resolved), name="insurance_claim_mark_resolved"),
        ]
        return custom_urls + urls

    def approve_claim(self, request, claim_id):
        claim = get_object_or_404(InsuranceClaim, id=claim_id)
        claim.status = "approved"
        claim.refund_status = "approved"
        claim.save()
        self.message_user(request, f"Claim #{claim.id} approved.")
        return redirect("..")

    def reject_claim(self, request, claim_id):
        claim = get_object_or_404(InsuranceClaim, id=claim_id)
        claim.status = "rejected"
        claim.refund_status = "rejected"
        claim.save()
        self.message_user(request, f"Claim #{claim.id} rejected.")
        return redirect("..")

    def admin_mark_resolved(self, request, claim_id):
        claim = get_object_or_404(InsuranceClaim, id=claim_id)
        if claim.resolution != "refund":
            self.message_user(request, "This claim is not a refund.", level="error")
            return redirect("..")
        if claim.refund_status == "fully_resolved":
            self.message_user(request, f"Claim #{claim.id} is already fully resolved.")
            return redirect("..")
        claim.refund_status = "fully_resolved"
        claim.admin_resolved_at = timezone.now()
        claim.save()
        self.message_user(request, f"Claim #{claim.id} marked as fully resolved.")
        return redirect("..")

    # ---- bulk actions ----
    actions = ["approve_claims", "reject_claims"]

    def approve_claims(self, request, queryset):
        queryset.update(status="approved", refund_status="approved")
    approve_claims.short_description = "Mark selected claims as approved"

    def reject_claims(self, request, queryset):
        queryset.update(status="rejected", refund_status="rejected")
    reject_claims.short_description = "Mark selected claims as rejected"
