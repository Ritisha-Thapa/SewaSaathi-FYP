# Generated manually — add not_accepted booking status

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0012_providerbookingresponse"),
    ]

    operations = [
        migrations.AlterField(
            model_name="booking",
            name="status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("assigned", "Assigned"),
                    ("accepted", "Accepted"),
                    ("in_progress", "In Progress"),
                    ("completed", "Completed"),
                    ("paid", "Paid"),
                    ("cancelled", "Cancelled"),
                    ("not_accepted", "Not Accepted"),
                    ("rejected", "Rejected"),
                    ("refunded", "Refunded"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
    ]
