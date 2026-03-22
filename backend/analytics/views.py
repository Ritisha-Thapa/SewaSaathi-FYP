from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Sum, Count, Avg, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone
from booking.models import Booking
from insurance.models import InsuranceClaim, InsurancePool
from accounts.models import User
import json
from decimal import Decimal

import datetime

class AnalyticsEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, (datetime.datetime, datetime.date)):
            return obj.isoformat()
        return super(AnalyticsEncoder, self).default(obj)

@staff_member_required
def admin_analytics_dashboard(request):
    # Filters
    month_filter = request.GET.get('month')
    provider_filter = request.GET.get('provider_id')
    
    # Base Querysets
    bookings = Booking.objects.all()
    claims = InsuranceClaim.objects.all()
    
    # Global Metrics (Overall)
    overall_revenue = Booking.objects.filter(is_paid=True).aggregate(Sum('total_price'))['total_price__sum'] or 0
    
    # Previous Month Revenue for comparison
    now = timezone.now()
    first_day_current = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_day_prev = first_day_current - timezone.timedelta(days=1)
    first_day_prev = last_day_prev.replace(day=1)
    
    prev_month_revenue = Booking.objects.filter(
        is_paid=True, 
        paid_at__gte=first_day_prev, 
        paid_at__lte=last_day_prev
    ).aggregate(Sum('total_price'))['total_price__sum'] or 0
    
    current_month_revenue = Booking.objects.filter(
        is_paid=True, 
        paid_at__gte=first_day_current
    ).aggregate(Sum('total_price'))['total_price__sum'] or 0
    
    revenue_growth = 0
    if prev_month_revenue > 0:
        revenue_growth = ((current_month_revenue - prev_month_revenue) / prev_month_revenue) * 100

    if month_filter:
        try:
            year, month = map(int, month_filter.split('-'))
            bookings = bookings.filter(created_at__year=year, created_at__month=month)
            claims = claims.filter(timestamp__year=year, timestamp__month=month)
        except ValueError:
            pass
            
    if provider_filter:
        bookings = bookings.filter(provider_id=provider_filter)

    # 1. Revenue Analytics
    total_revenue = bookings.filter(is_paid=True).aggregate(Sum('total_price'))['total_price__sum'] or 0
    
    monthly_revenue_data = Booking.objects.filter(is_paid=True).annotate(
        month=TruncMonth('paid_at')
    ).values('month').annotate(
        revenue=Sum('total_price')
    ).order_by('month')

    # 2. Provider Rankings
    provider_stats = User.objects.filter(role='provider').annotate(
        completed_jobs=Count('booking', filter=Q(booking__status__in=['completed', 'paid'])),
        total_earnings=Sum('booking__total_price', filter=Q(booking__is_paid=True))
    ).filter(completed_jobs__gt=0).order_by('-total_earnings')[:10]
    
    for p in provider_stats:
        p.job_avg = p.total_earnings / p.completed_jobs if p.completed_jobs > 0 else 0

    # 3. Insurance Pool
    pool = InsurancePool.objects.first()
    pool_balance = pool.total_funds if pool else 0
    
    # Calculate Payouts
    refund_claims = InsuranceClaim.objects.filter(resolution='refund').select_related('booking')
    total_payouts = sum(claim.booking.total_price * Decimal('0.8') for claim in refund_claims)

    # 4. Claims Analytics
    claim_stats = claims.aggregate(
        total=Count('id'),
        approved=Count('id', filter=Q(status='approved')),
        rejected=Count('id', filter=Q(status='rejected')),
        pending=Count('id', filter=Q(status='pending')),
        rework=Count('id', filter=Q(resolution='rework')),
        refund=Count('id', filter=Q(resolution='refund'))
    )
    
    if claim_stats['total'] > 0:
        claim_stats['success_rate'] = (claim_stats['approved'] / claim_stats['total']) * 100
    else:
        claim_stats['success_rate'] = 0

    # 5. Booking Activity
    booking_status_qs = bookings.values('status').annotate(count=Count('id'))
    rework_count = bookings.filter(is_rework=True).count()
    
    booking_status_dist = list(booking_status_qs)
    if rework_count > 0:
        booking_status_dist.append({'status': 'rework', 'count': rework_count})
    
    booking_trend = Booking.objects.annotate(
        month=TruncMonth('created_at')
    ).values('month').annotate(
        count=Count('id')
    ).order_by('month')

    total_bookings = bookings.count()
    avg_revenue_per_job = float(total_revenue / total_bookings) if total_bookings > 0 else 0

    context = {
        'total_revenue': float(total_revenue),
        'overall_revenue': float(overall_revenue),
        'current_month_revenue': float(current_month_revenue),
        'revenue_growth': float(revenue_growth),
        'total_bookings': total_bookings,
        'avg_revenue_per_job': avg_revenue_per_job,
        'pool_balance': float(pool_balance),
        'total_payouts': float(total_payouts),
        'claim_stats': claim_stats,
        'provider_stats': provider_stats,
        'booking_status_json': json.dumps(list(booking_status_dist), cls=AnalyticsEncoder),
        'monthly_revenue_json': json.dumps(list(monthly_revenue_data), cls=AnalyticsEncoder),
        'booking_trend_json': json.dumps(list(booking_trend), cls=AnalyticsEncoder),
        'providers_list': list(User.objects.filter(role='provider').values('id', 'first_name', 'last_name')),
    }
    
    return render(request, 'admin/analytics/dashboard.html', context)
