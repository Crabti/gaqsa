from backend.utils.emails import get_admin_emails
from products.models import Product
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
        to_emails = [instance.provider.user.email, "admin@temp.com"]
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
            fail_silently=True,
        )


def send_mail_on_price_change(
    products,
    provider,
    *args,
    **kwargs,
) -> None:

    title = "Modificación Lista Precios de Proveedor " + provider.name
    subject = f"GAQSA - {title}"
    context = {
        "products": products,
        "provider": provider,
        "title": title,
    }
    from_email = "noreply@gaqsa.com"
    to_emails = get_admin_emails()

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
        fail_silently=True,
    )
