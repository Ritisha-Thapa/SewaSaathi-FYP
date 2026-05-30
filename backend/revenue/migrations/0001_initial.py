import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("booking", "0015_booking_commission_fields"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="PlatformRevenue",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("booking", models.OneToOneField(
                    on_delete=django.db.models.deletion.CASCADE,
                    related_name="platform_revenue",
                    to="booking.booking",
                )),
                ("provider", models.ForeignKey(
                    limit_choices_to={"role": "provider"},
                    null=True,
                    on_delete=django.db.models.deletion.SET_NULL,
                    related_name="revenue_records",
                    to=settings.AUTH_USER_MODEL,
                )),
                ("booking_amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("insurance_deduction", models.DecimalField(decimal_places=2, max_digits=10)),
                ("commission_amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("provider_payout_amount", models.DecimalField(decimal_places=2, max_digits=10)),
                ("payment_method", models.CharField(max_length=20)),
                ("commission_status", models.CharField(
                    choices=[
                        ("collected", "Collected"),
                        ("due", "Due"),
                        ("received", "Received"),
                    ],
                    max_length=20,
                )),
                ("payout_status", models.CharField(
                    choices=[
                        ("pending", "Pending"),
                        ("sent", "Sent"),
                        ("not_applicable", "N/A"),
                    ],
                    max_length=20,
                )),
                ("commission_received_at", models.DateTimeField(blank=True, null=True)),
                ("payout_sent_at", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
