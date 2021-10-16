from typing import Optional
from order.models import Requisition

from products.models import Product, ChangePriceRequest
from django.dispatch import receiver
from django.core import mail
from django.db.models.signals import post_save
from django.template.loader import render_to_string
from django.utils.html import strip_tags


@receiver(post_save, sender=Product)
def send_mail_on_create(sender, instance=None, created=False, **kwargs):
    if created:
        title = "Alta de Producto"
        subject = f"GAQSA - {title}"
        context = {
            "provider": instance.provider,
            "product": instance,
            "title": title
        }
        from_email = "noreply@gaqsa.com"
        # TODO: Cambiar correo de admin
        to_emails = [instance.provider.email, "admin@temp.com"]
        html_message = render_to_string(
            "product_created.html",
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
    else:
        title = "Actualización de Producto"
        subject = f"GAQSA - {title}"
        context = {
            "provider": instance.provider,
            "product": instance,
            "title": title
        }
        from_email = "noreply@gaqsa.com"
        # TODO: Cambiar correo de admin
        to_emails = [instance.provider.email, "admin@temp.com"]
        html_message = render_to_string(
            "product_updated.html",
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


@receiver(post_save, sender=ChangePriceRequest)
def send_mail_on_request_price_change(
    sender,
    instance: Optional[ChangePriceRequest] = None,
    created=False,
    **kwargs,
) -> None:
    if not instance:
        return None

    title = "Solicitud de Cambio de Precio de Producto"
    subject = f"GAQSA - {title}"
    context = {
        "provider": instance.provider,
        "product": instance.product,
        "new_price": instance.new_price,
        "title": title,
    }
    from_email = "noreply@gaqsa.com"
    # TODO: Cambiar correo de admin
    to_emails = [instance.provider.email, "admin@temp.com"]
    html_message = render_to_string(
        "change_price_request.html",
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
