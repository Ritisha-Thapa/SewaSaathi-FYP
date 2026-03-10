from django.contrib import admin
from .models import InsurancePool, InsuranceClaim

@admin.register(InsurancePool)
class InsurancePoolAdmin(admin.ModelAdmin):
    list_display = ('id', 'total_funds', 'created_at', 'updated_at')

@admin.register(InsuranceClaim)
class InsuranceClaimAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'customer', 'status', 'resolution', 'timestamp')
    list_filter = ('status', 'resolution')
    search_fields = ('booking__id', 'customer__username', 'description')
    readonly_fields = ('timestamp',)
    
    actions = ['approve_claims', 'reject_claims']

    def approve_claims(self, request, queryset):
        queryset.update(status='approved')
    approve_claims.short_description = "Mark selected claims as approved"

    def reject_claims(self, request, queryset):
        queryset.update(status='rejected')
    reject_claims.short_description = "Mark selected claims as rejected"
