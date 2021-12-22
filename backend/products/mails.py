from django.core import mail
from backend.utils.emails import get_admin_emails
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_mail_on_reject_product(data):
    connection = mail.get_connection(fail_silently=True)
    connection.open()
    emails = []
    for instance in data:
        relations = instance.providers.all()
        for relation in relations:
            title = "Modificación de Producto"
            subject = f"GAQSA - {title}"
            context = {
                "relation": relation,
                "provider": relation.provider,
                "product": instance,
                "title": title
            }
            from_email = "noreply@gaqsa.com"
            # TODO: Cambiar correo de admin
            to_emails = [relation.provider.user.email, "admin@temp.com"]
            html_message = render_to_string(
                "product_updated.html",
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


def send_mail_on_create_product_request(product_provider):
    title = "Alta de Producto"
    subject = f"GAQSA - {title}"
    context = {
        "provider": product_provider.provider,
        "product": product_provider.product,
        "product_provider": product_provider,
        "title": title
    }
    from_email = "noreply@gaqsa.com"

    to_emails = [product_provider.provider.user.email] + get_admin_emails()
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
