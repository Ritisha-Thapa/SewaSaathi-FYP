from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("insurance", "0002_alter_insuranceclaim_evidence"),
    ]

    operations = [
        # Rename total_funds -> current_balance
        migrations.RenameField(
            model_name="insurancepool",
            old_name="total_funds",
            new_name="current_balance",
        ),
        migrations.AddField(
            model_name="insurancepool",
            name="total_contributed",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
        migrations.AddField(
            model_name="insurancepool",
            name="total_paid_out",
            field=models.DecimalField(decimal_places=2, default=0, max_digits=12),
        ),
    ]
