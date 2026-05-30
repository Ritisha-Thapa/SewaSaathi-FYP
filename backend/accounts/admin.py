from django import forms
from django.contrib import admin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.utils.html import format_html
from django.urls import path
from django.shortcuts import redirect, get_object_or_404
from django.core.mail import send_mail

from .models import User, ServiceProvider, Customer, ContactMessage, PasswordResetOTP, AdminUser
from .utils import generate_password


# =============================================================
# SERVICE PROVIDER ADMIN
# =============================================================

@admin.register(ServiceProvider)
class ServiceProviderAdmin(admin.ModelAdmin):
    list_display = ('phone', 'email', 'provider_status', 'approval_actions')
    list_filter = ('provider_status',)
    search_fields = ('phone', 'email')

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='provider')

    def approval_actions(self, obj):
        if obj.provider_status == 'pending':
            return format_html(
                '<a class="button" href="{}">Approve</a> '
                '<a class="button" style="background:#dc3545;color:white" href="{}">Reject</a>',
                f'approve/{obj.id}/',
                f'reject/{obj.id}/',
            )
        return "—"
    approval_actions.short_description = "Actions"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('approve/<int:user_id>/', self.approve_provider),
            path('reject/<int:user_id>/', self.reject_provider),
        ]
        return custom_urls + urls

    def approve_provider(self, request, user_id):
        user = get_object_or_404(ServiceProvider, id=user_id)
        password = generate_password()
        user.set_password(password)
        user.provider_status = 'approved'
        user.is_active = True
        user.save()
        send_mail(
            subject="SewaSaathi Provider Account Approved",
            message=(
                f"Your provider account has been approved.\n\n"
                f"Login Phone: {user.phone}\n"
                f"Password: {password}\n\n"
                f"Please change your password after login."
            ),
            from_email="no-reply@sewasaathi.com",
            recipient_list=[user.email],
            fail_silently=False,
        )
        self.message_user(request, "Provider approved and credentials sent.")
        return redirect("..")

    def reject_provider(self, request, user_id):
        user = get_object_or_404(ServiceProvider, id=user_id)
        user.provider_status = 'rejected'
        user.is_active = False
        user.save()
        send_mail(
            subject="SewaSaathi Provider Application Update",
            message=(
                f"Dear {user.first_name},\n\n"
                f"Thank you for applying as a service provider on SewaSaathi.\n\n"
                f"After reviewing your application, we regret to inform you that "
                f"your provider request has not been approved at this time.\n\n"
                f"You may re-apply in the future with updated information.\n\n"
                f"— SewaSaathi Team"
            ),
            from_email="no-reply@sewasaathi.com",
            recipient_list=[user.email],
            fail_silently=False,
        )
        self.message_user(request, "Provider rejected and email sent.")
        return redirect("..")


# =============================================================
# CUSTOMER ADMIN
# =============================================================

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ('email', 'status')
    search_fields = ('phone', 'email')

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role='customer')


# =============================================================
# ADMIN MANAGEMENT — Create / Edit admin users with group access
# =============================================================

class AdminCreationForm(forms.ModelForm):
    """Used when adding a new admin from the admin panel."""

    password1 = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password"}),
        min_length=8,
        help_text="Minimum 8 characters.",
    )
    password2 = forms.CharField(
        label="Confirm Password",
        widget=forms.PasswordInput(attrs={"autocomplete": "new-password"}),
        help_text="Enter the same password again for verification.",
    )
    is_superuser = forms.BooleanField(
        label="Grant full superadmin access",
        required=False,
        initial=False,
        help_text=(
            "Superadmins can access and modify everything in the system. "
            "Leave unchecked to restrict access to assigned department groups only."
        ),
    )

    class Meta:
        model = AdminUser
        fields = ("first_name", "last_name", "email", "phone", "is_superuser", "groups")

    def clean_password2(self):
        p1 = self.cleaned_data.get("password1")
        p2 = self.cleaned_data.get("password2")
        if p1 and p2 and p1 != p2:
            raise forms.ValidationError("The two passwords do not match.")
        return p2

    def save(self, commit=True):
        user = super().save(commit=False)
        user.role = "admin"
        user.is_staff = True   # always required to access the admin panel
        user.is_active = True
        # is_superuser comes from the form checkbox
        user.is_superuser = self.cleaned_data.get("is_superuser", False)
        user.set_password(self.cleaned_data["password1"])  # hashes before saving
        if commit:
            user.save()
            self.save_m2m()  # persist the group assignments
        return user


class AdminChangeForm(forms.ModelForm):
    """Used when editing an existing admin from the admin panel."""

    password = ReadOnlyPasswordHashField(
        label="Password",
        help_text=(
            "Passwords are stored encrypted and cannot be viewed here. "
            'To change this admin\'s password use the '
            '<a href="../password/">password change form</a>.'
        ),
    )

    class Meta:
        model = AdminUser
        fields = ("first_name", "last_name", "email", "phone", "password", "is_active", "is_superuser", "groups")


@admin.register(AdminUser)
class AdminUserAdmin(admin.ModelAdmin):
    add_form = AdminCreationForm
    form = AdminChangeForm

    list_display = ("get_full_name", "email", "phone", "get_groups", "is_superuser", "is_active", "date_joined")
    list_filter = ("is_active", "groups")
    search_fields = ("first_name", "last_name", "email", "phone")
    ordering = ("-date_joined",)
    filter_horizontal = ("groups",)

    # Shown when ADDING a new admin
    add_fieldsets = (
        ("Personal Information", {
            "classes": ("wide",),
            "fields": ("first_name", "last_name", "email", "phone"),
        }),
        ("Set Password", {
            "classes": ("wide",),
            "fields": ("password1", "password2"),
        }),
        ("Department / Permissions", {
            "classes": ("wide",),
            "fields": ("is_superuser", "groups"),
        }),
    )

    # Shown when EDITING an existing admin
    fieldsets = (
        ("Personal Information", {
            "fields": ("first_name", "last_name", "email", "phone"),
        }),
        ("Authentication", {
            "fields": ("password",),
        }),
        ("Access & Status", {
            "fields": ("is_active", "is_superuser", "groups"),
        }),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).filter(role="admin")

    def get_form(self, request, obj=None, **kwargs):
        if obj is None:
            kwargs["form"] = self.add_form
        else:
            kwargs["form"] = self.form
        return super().get_form(request, obj, **kwargs)

    def get_fieldsets(self, request, obj=None):
        if obj is None:
            return self.add_fieldsets
        return self.fieldsets

    # ---- computed list columns ----

    def get_full_name(self, obj):
        name = f"{obj.first_name} {obj.last_name}".strip()
        return name or obj.phone
    get_full_name.short_description = "Name"

    def get_groups(self, obj):
        names = list(obj.groups.values_list("name", flat=True))
        if not names:
            return format_html('<span style="color:#999;">No group assigned</span>')
        badges = "".join(
            f'<span style="background:#1B3C53;color:white;padding:2px 10px;'
            f'border-radius:12px;font-size:11px;margin:2px;display:inline-block">'
            f'{n}</span>'
            for n in names
        )
        return format_html(badges)
    get_groups.short_description = "Department"


# =============================================================
# MISC
# =============================================================

try:
    admin.site.unregister(User)
except admin.sites.NotRegistered:
    pass

admin.site.register(ContactMessage)
admin.site.register(User)
admin.site.register(PasswordResetOTP)
