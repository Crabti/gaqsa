from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from providers.models import Provider


def send_mail_on_create_order(order, providers, products):
    connection = mail.get_connection()
    connection.open()
    emails = []

    for provider in providers:
        title = f"Orden de compra - {order.pk} - Socio { order.user } "
        subject = f"GAQSA - {title}"
        context = {
            "user": order.user,
            "title": title,
            "provider": provider,
            "products": products
        }
        get_email = Provider.objects.filter(name=provider).values(
            'email'
            ).last()
        to_email = get_email['email']
        from_email = "noreply@gaqsa.com"
        # TODO: Cambiar correo de admin
        to_emails = [to_email, "temp@temp.com"]
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


def send_mail_on_create_order_user(order, products):
    title = f"Orden de compra - {order.pk} - Socio { order.user } "
    subject = f"GAQSA - {title}"
    context = {
        "pk": order.pk,
        "user": order.user,
        "title": title,
        "products": products
    }
    from_email = "noreply@gaqsa.com"

    # TODO: Cambiar correo de admin
    to_emails = [order.user.email, "temp@temp.com"]
    html_message = render_to_string(
        "order_create_user.html",
        context
    )
    plain_message = strip_tags(html_message)
    mail.send_mail(
        subject,
        plain_message,
        from_email,
        to_emails,
        html_message=html_message,
        fail_silently=False,
    )