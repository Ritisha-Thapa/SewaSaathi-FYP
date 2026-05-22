# Generated manually for provider decline tracking

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0011_booking_price_note"),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="ProviderBookingResponse",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "response",
                    models.CharField(
                        choices=[("declined", "Declined")],
                        default="declined",
                        max_length=20,
                    ),
                ),
                (
                    "booking",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="provider_responses",
                        to="booking.booking",
                    ),
                ),
                (
                    "provider",
                    models.ForeignKey(
                        limit_choices_to={"role": "provider"},
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="booking_responses",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="providerbookingresponse",
            constraint=models.UniqueConstraint(
                fields=("booking", "provider"),
                name="unique_provider_booking_response",
            ),
        ),
    ]
