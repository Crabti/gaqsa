from django.core.mail import EmailMultiAlternatives

from backend.utils.emails import get_admin_emails, get_user_invoice_emails
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_mail_on_create_invoice(invoice) -> None:
    title = "Alta de Factura"
    subject = f"GAQSA - {title}"
    context = {
        "invoice": invoice,
        "provider": invoice.order.provider,
        "title": title
    }
    from_email = "noreply@gaqsa.com"
    user_invoice_emails = get_user_invoice_emails(
        invoice.order.provider.user.pk
    )
    admin_emails = get_admin_emails()
    to_emails = user_invoice_emails + admin_emails
    html_message = render_to_string(
        "invoice_created.html",
        context
    )
    plain_message = strip_tags(html_message)
    email = EmailMultiAlternatives(
        subject,
        plain_message,
        from_email,
        to_emails,
    )
    email.attach_alternative(html_message, "text/html")
    email.attach_file(invoice.xml_file.path)
    email.attach_file(invoice.invoice_file.path)
    if invoice.extra_file:
        email.attach_file(invoice.extra_file.path)
    email.send(fail_silently=True)


def send_mail_on_invoice_status_update(invoice) -> None:
    accepted = invoice.status == "Aceptado"
    if accepted:
        title = f"Factura #{invoice.invoice_folio} aceptada"
    else:
        title = f"Factura #{invoice.invoice_folio} rechazada"

    subject = f"GAQSA - {title}"
    context = {
        "invoice": invoice,
        "provider": invoice.order.provider,
        "title": title
    }
    from_email = "noreply@gaqsa.com"
    user_invoice_emails = get_user_invoice_emails(
        invoice.order.provider.user.pk
    )
    admin_emails = get_admin_emails()
    to_emails = user_invoice_emails + admin_emails
    if accepted:
        html_message = render_to_string(
            "invoice_accepted.html",
            context
        )
    else:
        html_message = render_to_string(
            "invoice_rejected.html",
            context
        )
    plain_message = strip_tags(html_message)
    email = EmailMultiAlternatives(
        subject,
        plain_message,
        from_email,
        to_emails,
    )
    email.attach_alternative(html_message, "text/html")
    email.attach_file(invoice.invoice_file.path)
    if invoice.extra_file:
        email.attach_file(invoice.extra_file.path)
    email.send(fail_silently=True)
