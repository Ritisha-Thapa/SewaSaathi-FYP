from django.contrib import admin
from .models import InsurancePool, InsuranceClaim
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect, get_object_or_404

@admin.register(InsurancePool)
class InsurancePoolAdmin(admin.ModelAdmin):
    list_display = ('id', 'total_funds', 'created_at', 'updated_at')

@admin.register(InsuranceClaim)
class InsuranceClaimAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'booking', 'get_customer_name', 'get_customer_phone', 
        'get_booking_location', 'status', 'resolution', 'approval_actions', 'timestamp'
    )
    list_filter = ('status', 'resolution')
    search_fields = ('booking__id', 'customer__username', 'description')
    readonly_fields = ('timestamp', 'get_customer_name', 'get_customer_phone', 'get_booking_location')

    fieldsets = (
        (None, {
            'fields': ('booking', 'customer', 'status', 'resolution', 'timestamp')
        }),
        ('Customer Details', {
            'fields': ('get_customer_name', 'get_customer_phone', 'get_booking_location')
        }),
        ('Claim Content', {
            'fields': ('description', 'evidence')
        }),
    )

    def get_customer_name(self, obj):
        return obj.booking.customer.get_full_name()
    get_customer_name.short_description = 'Customer Name'

    def get_customer_phone(self, obj):
        return obj.booking.phone
    get_customer_phone.short_description = 'Customer Phone'

    def get_booking_location(self, obj):
        return obj.booking.address
    get_booking_location.short_description = 'Booking Location'

    def approval_actions(self, obj):
        if obj.status == 'pending':
            return format_html(
                '<a class="button" href="{}">Approve</a>&nbsp;'
                '<a class="button" style="background:#dc3545;color:white" href="{}">Reject</a>',
                f'approve/{obj.id}/',
                f'reject/{obj.id}/'
            )
        return "—"
    approval_actions.short_description = "Actions"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('approve/<int:claim_id>/', self.approve_claim),
            path('reject/<int:claim_id>/', self.reject_claim),
        ]
        return custom_urls + urls

    def approve_claim(self, request, claim_id):
        claim = get_object_or_404(InsuranceClaim, id=claim_id)
        claim.status = 'approved'
        claim.save()
        self.message_user(request, f"Claim #{claim.id} approved.")
        return redirect("..")

    def reject_claim(self, request, claim_id):
        claim = get_object_or_404(InsuranceClaim, id=claim_id)
        claim.status = 'rejected'
        claim.save()
        self.message_user(request, f"Claim #{claim.id} rejected.")
        return redirect("..")
    
    actions = ['approve_claims', 'reject_claims']

    def approve_claims(self, request, queryset):
        queryset.update(status='approved')
    approve_claims.short_description = "Mark selected claims as approved"

    def reject_claims(self, request, queryset):
        queryset.update(status='rejected')
    reject_claims.short_description = "Mark selected claims as rejected"
