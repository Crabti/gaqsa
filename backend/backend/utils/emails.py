from django.contrib.auth.models import User
from users.models import UserEmail
from backend.utils.constants import ADMIN_GROUP


def get_admin_emails() -> list:
    user_emails = list(
        User.objects.filter(
            groups__name=ADMIN_GROUP
        ).values_list('email', flat=True)
    )
    return user_emails


def get_user_invoice_emails(user_id: int) -> list:
    provider_invoice_emails = list(
        UserEmail.objects.filter(
            user=user_id,
            category=UserEmail.INVOICE,
        ).values_list('email', flat=True)
    )
    return provider_invoice_emails
