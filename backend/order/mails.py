from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from order.models import Order
from providers.models import Provider

from users.models import UserEmail
from backend.utils.emails import get_admin_emails


def send_mail_to_provider_on_create_order(orders: "list[Order]"):
    connection = mail.get_connection(fail_silently=True)
    connection.open()
    emails = []
    for order in orders:
        title = f"Orden de compra - {order.pk} - Socio { order.user } "
        subject = f"GAQSA - {title}"
        context = {
            "user": order.user,
            "title": title,
            "provider": order.provider,
            "products": order.requisitions
        }
        user = order.provider.user

        provider_emails = list(UserEmail.objects.filter(
            user=user, category=UserEmail.ORDERS
        ).values_list('email', flat=True))
        admin_emails = get_admin_emails()
        from_email = "noreply@gaqsa.com"
        to_emails = provider_emails + admin_emails
        html_message = render_to_string(
            "order_created.html",
            context
        )
        plain_message = strip_tags(html_message)
        email = mail.EmailMultiAlternatives(
            subject,
            plain_message,
            from_email,
            to_emails,
        )
        email.attach_alternative(html_message, "text/html")
        emails.append(email)
    connection.send_messages(emails)
    connection.close()


def send_mail_to_client_on_create_order(orders: "list[Order]"):
    connection = mail.get_connection(fail_silently=True)
    connection.open()
    emails = []
    for order in orders:
        title = f"Orden de compra - {order.pk} - Socio { order.user } "
        subject = f"GAQSA - {title}"
        context = {
            "pk": order.pk,
            "user": order.user,
            "title": title,
            "products": order.requisitions,
        }
        from_email = "noreply@gaqsa.com"
        admin_emails = get_admin_emails()
        client_emails = list(UserEmail.objects.filter(
            user=order.user, category=UserEmail.ORDERS
        ).values_list('email', flat=True))
        to_emails = client_emails + admin_emails
        html_message = render_to_string(
            "order_create_user.html",
            context
        )
        plain_message = strip_tags(html_message)
        email = mail.EmailMultiAlternatives(
            subject,
            plain_message,
            from_email,
            to_emails,
        )
        email.attach_alternative(html_message, "text/html")
        emails.append(email)
    connection.send_messages(emails)
    connection.close()


def send_main_on_cancel_order(order):
    title = f"Cancelación orden de compra - {order.pk} - Socio { order.user } "
    subject = f"GAQSA - {title}"
    provider = Provider.objects.get(pk=order.provider.pk)
    user = provider.user
    context = {
        "pk": order.pk,
        "user": user,
        "client": order.user,
        "title": title,
    }
    from_email = "noreply@gaqsa.com"

    provider_emails = list(UserEmail.objects.filter(
        user=user, category=UserEmail.ORDERS
    ).values_list('email', flat=True))
    from_email = "noreply@gaqsa.com"
    admin_emails = get_admin_emails()
    to_emails = provider_emails + admin_emails
    html_message = render_to_string(
        "cancel_order.html",
        context
    )
    plain_message = strip_tags(html_message)
    mail.send_mail(
        subject,
        plain_message,
        from_email,
        to_emails,
        html_message=html_message,
        fail_silently=True,
    )
