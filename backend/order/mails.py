from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from order.models import Order
from products.models import ProductProvider
from providers.models import Provider

from users.models import UserEmail
from backend.utils.emails import get_admin_emails


def build_order_table_context(order: Order, title):
    products = []
    quantity_total = 0
    iva_total = 0
    ieps_total = 0
    subtotal = 0

    for requisition in order.requisitions:
        product_provider = ProductProvider.objects.get(
            product=requisition.product.pk,
            provider=order.provider.pk,
        )
        quantity_total += requisition.quantity_requested
        temp_subtotal = product_provider.calculate_subtotal(
            requisition.quantity_requested,
        )
        ieps_total += product_provider.ieps_to_money(temp_subtotal)
        iva_total += product_provider.iva_to_money(temp_subtotal)
        subtotal += temp_subtotal
        products.append({
            **(requisition.__dict__),
            "product": {**(requisition.product.__dict__)},
            "iva": product_provider.iva,
            "original_price": product_provider.price,
            "laboratory": product_provider.laboratory.name,
        })
    context = {
        "pk": order.pk,
        "user": order.user,
        "provider": order.provider,
        "title": title,
        "products": products,
        "total": order.total,
        "subtotal": subtotal,
        "quantity_total": quantity_total,
        "iva_total": iva_total,
        "ieps_total": ieps_total,
    }
    return context


def send_mail_to_provider_on_create_order(orders: "list[Order]"):
    connection = mail.get_connection(fail_silently=True)
    connection.open()
    emails = []
    for order in orders:
        title = f"Orden de compra - {order.pk} - Socio { order.user } "
        subject = f"GAQSA - {title}"

        context = build_order_table_context(order, title)
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
            bcc=to_emails,
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
        title = f"Orden de compra - {order.pk} - Socio { order.user }" \
                f" - Proveedor { order.provider.name }"
        subject = f"GAQSA - {title}"
        context = build_order_table_context(order, title)

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
            bcc=to_emails,
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
    email = mail.EmailMultiAlternatives(
        subject,
        plain_message,
        from_email,
        bcc=to_emails,
    )
    email.attach_alternative(html_message, "text/html")
    email.send(fail_silently=True)
