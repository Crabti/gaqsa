from django.contrib.auth.models import User

from backend.utils.constants import ADMIN_GROUP


def get_admin_emails() -> list:
    user_emails = list(
        User.objects.filter(
            groups__name=ADMIN_GROUP
        ).values_list('email', flat=True)
    )
    return user_emails
