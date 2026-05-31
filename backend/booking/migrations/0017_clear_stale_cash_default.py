from django.db import migrations


def clear_stale_cash_default(apps, schema_editor):
    """
    Migration 0001 set payment_method default='cash', so every booking ever
    created has payment_method='cash' even before the customer chose a payment
    method. Migration 0016 made the field nullable going forward, but didn't
    backfill existing rows. This migration resets payment_method to NULL for
    all bookings that are not yet paid — the only state where the old default
    is still visible and wrong.
    """
    Booking = apps.get_model("booking", "Booking")
    Booking.objects.filter(is_paid=False, payment_method="cash").update(
        payment_method=None
    )


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0016_payment_method_nullable"),
    ]

    operations = [
        migrations.RunPython(
            clear_stale_cash_default,
            reverse_code=migrations.RunPython.noop,
        ),
    ]