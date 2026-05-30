from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0014_booking_cancelled_by"),
    ]

    operations = [
        migrations.AddField(
            model_name="booking",
            name="commission_amount",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name="booking",
            name="provider_payout_amount",
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=10, null=True),
        ),
        migrations.AddField(
            model_name="booking",
            name="commission_status",
            field=models.CharField(
                blank=True,
                choices=[
                    ("collected", "Collected"),
                    ("due", "Due"),
                    ("received", "Received"),
                ],
                max_length=20,
                null=True,
            ),
        ),
        migrations.AddField(
            model_name="booking",
            name="payout_status",
            field=models.CharField(
                blank=True,
                choices=[
                    ("pending", "Pending"),
                    ("sent", "Sent"),
                    ("not_applicable", "N/A"),
                ],
                max_length=20,
                null=True,
            ),
        ),
    ]
