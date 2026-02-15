from django.contrib import admin
from .models import User, ServiceProvider, Customer
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect, get_object_or_404
from .models import User
from django.core.mail import send_mail
from .utils import generate_password

# admin.site.register(User)

# -----------------------------
# SERVICE PROVIDER ADMIN
# -----------------------------
@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    list_display = (
        'phone',
        'email',
        'provider_status',
        'approval_actions',
    )
    
    # filter garne field
    list_filter = ('provider_status',)
    search_fields = ('phone', 'email')

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='provider')

    # ---- ACTION BUTTONS ----
    def approval_actions(self, obj):
        if obj.provider_status == 'pending':
            return format_html(
                '<a class="button" href="{}">Approve</a> '
                '<a class="button" style="background:#dc3545;color:white" href="{}">Reject</a>',
                f'approve/{obj.id}/',
                f'reject/{obj.id}/'
            )
        return "—"

    approval_actions.short_description = "Actions"

    # ---- CUSTOM URLS ----
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('approve/<int:user_id>/', self.approve_provider),
            path('reject/<int:user_id>/', self.reject_provider),
        ]
        return custom_urls + urls

    # ---- APPROVE PROVIDER ----
    def approve_provider(self, request, user_id):
        user = get_object_or_404(ServiceProvider, id=user_id)

        password = generate_password()
        user.set_password(password)
        user.provider_status = 'approved'
        user.is_active = True
        user.save()

        # Send credentials email
        send_mail(
            subject="SewaX Provider Account Approved",
            message=(
                f"Your provider account has been approved.\n\n"
                f"Login Phone: {user.phone}\n"
                f"Password: {password}\n\n"
                f"Please change your password after login."
            ),
            from_email="no-reply@sewax.com",
            recipient_list=[user.email],
            fail_silently=False,
        )

        self.message_user(request, "Provider approved and credentials sent.")
        return redirect("..")

    # ---- REJECT PROVIDER ----
    def reject_provider(self, request, user_id):
        user = get_object_or_404(ServiceProvider, id=user_id)

        user.provider_status = 'rejected'
        user.is_active = False
        user.save()

        # Send rejection email
        send_mail(
            subject="SewaX Provider Application Update",
            message=(
                f"Dear {user.first_name},\n\n"
                f"Thank you for applying as a service provider on SewaX.\n\n"
                f"After reviewing your application, we regret to inform you that "
                f"your provider request has not been approved at this time.\n\n"
                f"You may re-apply in the future with updated information.\n\n"
                f"— SewaX Team"
            ),
            from_email="no-reply@sewax.com",
            recipient_list=[user.email],
            fail_silently=False,
        )

        self.message_user(request, "Provider rejected and email sent.")
        return redirect("..")



# -----------------------------
# CUSTOMER ADMIN
# -----------------------------
@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('phone', 'email', 'status')
    search_fields = ('phone', 'email')

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='customer')


# -----------------------------
# OPTIONAL: HIDE RAW USER MODEL
# -----------------------------
try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass
