import csv
from django.contrib import admin
from django.http import HttpResponse
from django.utils.html import format_html
from django.db.models import Avg, Count, Q
from django.urls import reverse

from .models import Booking, Review, ProviderBookingResponse


# ─── Booking ─────────────────────────────────────────────────────────────────

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "provider", "service", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("customer__first_name", "customer__last_name", "provider__first_name", "provider__last_name")
    readonly_fields = ("created_at", "updated_at")


# ─── Provider Booking Response ───────────────────────────────────────────────

@admin.register(ProviderBookingResponse)
class ProviderBookingResponseAdmin(admin.ModelAdmin):
    list_display = ("booking", "provider", "response", "created_at")
    list_filter = ("response",)
    search_fields = ("provider__first_name", "provider__last_name")
    readonly_fields = ("created_at", "updated_at")


# ─── Review ───────────────────────────────────────────────────────────────────

class RatingCategoryFilter(admin.SimpleListFilter):
    title = "Rating Category"
    parameter_name = "rating_category"

    def lookups(self, request, model_admin):
        return [
            ("critical", "🔴  Critical  (1–2 stars)"),
            ("medium",   "🟡  Medium    (3 stars)"),
            ("good",     "🟢  Good      (4–5 stars)"),
        ]

    def queryset(self, request, queryset):
        if self.value() == "critical":
            return queryset.filter(rating__in=[1, 2])
        if self.value() == "medium":
            return queryset.filter(rating=3)
        if self.value() == "good":
            return queryset.filter(rating__in=[4, 5])
        return queryset


def export_critical_reviews(modeladmin, request, queryset):
    critical = queryset.filter(rating__in=[1, 2]).select_related(
        "customer", "provider", "booking"
    )
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="critical_reviews.csv"'
    writer = csv.writer(response)
    writer.writerow(["Review ID", "Rating", "Customer", "Provider", "Booking ID", "Comment", "Date"])
    for r in critical:
        writer.writerow([
            r.id,
            r.rating,
            f"{r.customer.get_full_name()} ({r.customer.email})",
            f"{r.provider.get_full_name()} ({r.provider.email})",
            r.booking_id,
            r.comment or "",
            r.created_at.strftime("%Y-%m-%d %H:%M"),
        ])
    return response

export_critical_reviews.short_description = "⬇ Export selected critical reviews (CSV)"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = (
        "rating_badge",
        "needs_attention",
        "customer_display",
        "provider_display",
        "booking_link",
        "short_comment",
        "created_at",
    )
    list_filter = (RatingCategoryFilter, "created_at", "provider")
    search_fields = (
        "customer__first_name", "customer__last_name", "customer__email",
        "provider__first_name", "provider__last_name", "provider__email",
        "comment",
    )
    ordering = ("rating", "-created_at")
    readonly_fields = ("customer", "provider", "booking", "rating", "comment", "created_at", "updated_at")
    actions = [export_critical_reviews]

    # ── display columns ──────────────────────────────────────────────────────

    @admin.display(description="Rating", ordering="rating")
    def rating_badge(self, obj):
        stars = "★" * obj.rating + "☆" * (5 - obj.rating)
        if obj.rating >= 4:
            bg, color = "#d4edda", "#155724"
            label = "Good"
        elif obj.rating == 3:
            bg, color = "#fff3cd", "#856404"
            label = "Medium"
        else:
            bg, color = "#f8d7da", "#721c24"
            label = "Critical"
        return format_html(
            '<span style="background:{};color:{};padding:3px 10px;border-radius:20px;'
            'font-size:12px;font-weight:600;white-space:nowrap;">'
            '{} &nbsp;{}</span>',
            bg, color, stars, label,
        )

    @admin.display(description="⚠", boolean=False)
    def needs_attention(self, obj):
        if obj.rating <= 2:
            return format_html(
                '<span style="background:#dc3545;color:white;padding:2px 8px;'
                'border-radius:20px;font-size:11px;font-weight:700;">NEEDS ACTION</span>'
            )
        return ""

    @admin.display(description="Customer", ordering="customer__first_name")
    def customer_display(self, obj):
        url = reverse("admin:accounts_user_change", args=[obj.customer_id])
        return format_html('<a href="{}">{}</a>', url, obj.customer.get_full_name() or obj.customer.email)

    @admin.display(description="Provider", ordering="provider__first_name")
    def provider_display(self, obj):
        url = reverse("admin:accounts_user_change", args=[obj.provider_id])
        name = obj.provider.get_full_name() or obj.provider.email
        if obj.rating <= 2:
            return format_html(
                '<a href="{}" style="color:#dc3545;font-weight:600;">{}</a>', url, name
            )
        return format_html('<a href="{}">{}</a>', url, name)

    @admin.display(description="Booking")
    def booking_link(self, obj):
        url = reverse("admin:booking_booking_change", args=[obj.booking_id])
        return format_html('<a href="{}">#{}</a>', url, str(obj.booking_id)[:8])

    @admin.display(description="Comment")
    def short_comment(self, obj):
        if not obj.comment:
            return format_html('<span style="color:#999;font-style:italic;">No comment</span>')
        if len(obj.comment) <= 80:
            return obj.comment
        short = obj.comment[:80]
        full = obj.comment.replace('"', '&quot;').replace("'", "&#39;")
        return format_html(
            '<span title="{}" style="cursor:help;">{}&hellip;</span>',
            full, short,
        )

    # ── inject summary stats into changelist context ─────────────────────────

    def changelist_view(self, request, extra_context=None):
        qs = self.get_queryset(request)
        totals = qs.aggregate(
            total=Count("id"),
            good=Count("id", filter=Q(rating__in=[4, 5])),
            medium=Count("id", filter=Q(rating=3)),
            critical=Count("id", filter=Q(rating__in=[1, 2])),
            avg_rating=Avg("rating"),
        )
        good_pct    = round(totals["good"]     / totals["total"] * 100) if totals["total"] else 0
        medium_pct  = round(totals["medium"]   / totals["total"] * 100) if totals["total"] else 0
        critical_pct= round(totals["critical"] / totals["total"] * 100) if totals["total"] else 0
        avg = round(totals["avg_rating"] or 0, 1)

        extra_context = extra_context or {}
        extra_context.update({
            "review_stats": {
                "total":        totals["total"],
                "good":         totals["good"],
                "medium":       totals["medium"],
                "critical":     totals["critical"],
                "avg_rating":   avg,
                "good_pct":     good_pct,
                "medium_pct":   medium_pct,
                "critical_pct": critical_pct,
            }
        })
        return super().changelist_view(request, extra_context=extra_context)
