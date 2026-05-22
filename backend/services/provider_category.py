from django.contrib.auth import get_user_model
from django.utils.text import slugify

from .models import Service, ServiceCategory

User = get_user_model()


def skill_to_category_name_key(skill: str) -> str | None:
    """Map a provider skill value to the ServiceCategory name_key convention."""
    label = dict(User.SKILLS_CHOICES).get(skill)
    if not label:
        return None
    slug = slugify(label).replace("-", "_")
    return f"category_{slug}"


def parse_provider_skills(skills_value) -> list[str]:
    if not skills_value:
        return []
    if isinstance(skills_value, list):
        return [str(s).strip() for s in skills_value if str(s).strip()]
    return [s.strip() for s in str(skills_value).split(",") if s.strip()]


def get_provider_category_name_keys(user) -> list[str]:
    keys = []
    for skill in parse_provider_skills(user.skills):
        name_key = skill_to_category_name_key(skill)
        if name_key and name_key not in keys:
            keys.append(name_key)
    return keys


def category_name_key_to_skill(category_name_key: str) -> str | None:
    """Map ServiceCategory name_key back to provider skill value."""
    if not category_name_key:
        return None
    for skill, _ in User.SKILLS_CHOICES:
        if skill_to_category_name_key(skill) == category_name_key:
            return skill
    return None


def get_services_for_provider(user):
    """Return all catalog services in categories matching the provider's skill(s)."""
    name_keys = get_provider_category_name_keys(user)
    if not name_keys:
        return Service.objects.none()
    return (
        Service.objects.select_related("category")
        .filter(category__name_key__in=name_keys)
        .order_by("name_key")
    )
