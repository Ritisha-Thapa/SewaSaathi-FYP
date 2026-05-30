from decimal import Decimal
from django.core.management.base import BaseCommand
from django.db import transaction


class Command(BaseCommand):
    help = "Backfill PlatformRevenue records for all paid bookings that don't have one yet."

    def handle(self, *args, **options):
        from booking.models import Booking
        from revenue.models import PlatformRevenue

        bookings = (
            Booking.objects
            .filter(is_paid=True, status="paid")
            .exclude(platform_revenue__isnull=False)
            .select_related("provider")
        )

        total = bookings.count()
        if total == 0:
            self.stdout.write(self.style.SUCCESS("Nothing to backfill — all paid bookings already have a revenue record."))
            return

        self.stdout.write(f"Backfilling {total} booking(s)...")

        created = 0
        skipped = 0

        for booking in bookings:
            try:
                with transaction.atomic():
                    insurance_deduction = booking.insurance_fee
                    base = booking.total_price - insurance_deduction
                    commission = (base * Decimal("0.10")).quantize(Decimal("0.01"))
                    payout = (base * Decimal("0.90")).quantize(Decimal("0.01"))

                    is_khalti = booking.payment_method == "khalti_v2"
                    commission_status = "collected" if is_khalti else "due"
                    payout_status = "pending" if is_khalti else "not_applicable"

                    PlatformRevenue.objects.create(
                        booking=booking,
                        provider=booking.provider,
                        booking_amount=booking.total_price,
                        insurance_deduction=insurance_deduction,
                        commission_amount=commission,
                        provider_payout_amount=payout,
                        payment_method=booking.payment_method,
                        commission_status=commission_status,
                        payout_status=payout_status,
                        commission_received_at=None,
                        payout_sent_at=None,
                    )

                    # Mirror commission fields onto the booking row
                    Booking.objects.filter(pk=booking.pk).update(
                        commission_amount=commission,
                        provider_payout_amount=payout,
                        commission_status=commission_status,
                        payout_status=payout_status,
                    )

                    created += 1
                    self.stdout.write(
                        f"  ✓ Booking #{booking.id} | {booking.payment_method} | "
                        f"amount={booking.total_price} commission={commission} payout={payout}"
                    )
            except Exception as e:
                skipped += 1
                self.stdout.write(self.style.WARNING(f"  ✗ Booking #{booking.id} skipped — {e}"))

        self.stdout.write(
            self.style.SUCCESS(
                f"\nDone. Created: {created}  Skipped: {skipped}\n"
                f"Khalti records are marked payout_status='pending' — "
                f"mark them as 'Sent' in the Revenue admin once you've verified payouts were made.\n"
                f"COD records are marked commission_status='due' — "
                f"mark them as 'Received' once you've collected from each provider."
            )
        )