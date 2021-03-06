from django.contrib.auth.models import User

from announcements.models import Announcement
from django.conf import settings
from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from backend.utils.constants import PROVIDER_GROUP, CLIENT_GROUP


def send_mail_on_create_announcement(announcement: Announcement) -> None:
    connection = mail.get_connection(fail_silently=True)
    connection.open()

    title = announcement.title
    subject = f"GAQSA - {title}"
    url = f"{settings.FRONTEND_DOMAIN_URL}/circulares/{announcement.pk}"
    addressee = announcement.addressee
    context = {
        "url": url,
        "title": title,
        "addresee": (
            "Proveedores"
            if addressee == Announcement.PROVIDERS
            else "Clientes"
        )
    }

    group = (
        PROVIDER_GROUP
        if addressee == Announcement.PROVIDERS
        else CLIENT_GROUP
    )

    emails = list(User.objects.filter(
        groups__name=group,
    ).values_list('email', flat=True))

    from_email = "noreply@gaqsa.com"
    to_emails = emails
    html_message = render_to_string(
        "new_announcement.html",
        context
    )
    plain_message = strip_tags(html_message)
    email = mail.EmailMultiAlternatives(
        subject,
        plain_message,
        from_email,
        bcc=to_emails,
    )
    email.attach_alternative(html_message, "text/html")

    connection.send_messages([email])
    connection.close()
