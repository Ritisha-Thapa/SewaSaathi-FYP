from django.db import migrations, models
from django.utils.text import slugify


def populate_localization_fields(apps, schema_editor):
    ServiceCategory = apps.get_model("services", "ServiceCategory")
    Service = apps.get_model("services", "Service")

    for category in ServiceCategory.objects.all():
        base_slug = slugify(category.name) or "category"
        slug = base_slug
        counter = 2
        while ServiceCategory.objects.exclude(pk=category.pk).filter(slug=slug).exists():
            slug = f"{base_slug}-{counter}"
            counter += 1

        category.slug = slug
        category.name_translations = {"en": category.name}
        category.description_translations = {"en": category.description} if category.description else {}
        category.save(update_fields=["slug", "name_translations", "description_translations"])

    for service in Service.objects.all():
        service.name_translations = {"en": service.name}
        service.description_translations = {"en": service.description} if service.description else {}
        service.save(update_fields=["name_translations", "description_translations"])


class Migration(migrations.Migration):
    dependencies = [
        ("services", "0006_provideravailability"),
    ]

    operations = [
        migrations.AddField(
            model_name="servicecategory",
            name="slug",
            field=models.SlugField(blank=True, max_length=120, null=True, unique=True),
        ),
        migrations.AddField(
            model_name="servicecategory",
            name="name_translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="servicecategory",
            name="description_translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="service",
            name="name_translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.AddField(
            model_name="service",
            name="description_translations",
            field=models.JSONField(blank=True, default=dict),
        ),
        migrations.RunPython(populate_localization_fields, migrations.RunPython.noop),
        migrations.AlterField(
            model_name="servicecategory",
            name="slug",
            field=models.SlugField(blank=True, max_length=120, unique=True),
        ),
    ]
