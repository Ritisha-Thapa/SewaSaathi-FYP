from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("insurance", "0003_insurancepool_refactor"),
    ]

    operations = [
        migrations.AddField(
            model_name="insuranceclaim",
            name="refund_amount",
            field=models.DecimalField(decimal_places=2, max_digits=10, null=True, blank=True),
        ),
        migrations.AddField(
            model_name="insuranceclaim",
            name="pool_deducted",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="insuranceclaim",
            name="shortfall",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="insuranceclaim",
            name="admin_notified_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="insuranceclaim",
            name="admin_resolved_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="insuranceclaim",
            name="refund_status",
            field=models.CharField(
                choices=[
                    ("pending", "Pending"),
                    ("approved", "Approved"),
                    ("admin_notified", "Admin Notified"),
                    ("fully_resolved", "Fully Resolved"),
                    ("rejected", "Rejected"),
                ],
                default="pending",
                max_length=20,
            ),
        ),
    ]
