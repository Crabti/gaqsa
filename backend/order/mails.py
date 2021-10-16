from itertools import product
from typing import Optional
import order

from order.models import Order, Requisition
from django.dispatch import receiver
from django.core import mail
from django.db.models.signals import post_save
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from order.serializers import RequisitionSerializer



def send_mail_on_create_order(order, providers, user, products):
    print(user)
    for provider  in providers:
        title = f"Orden de compra - {order.pk} - Socio  "
        subject = f"GAQSA - {title}"
        context = {
            "pk": order.pk,
            "user": user,
            "title": title,
            "provider": provider,
            "products": products
        }
        from_email = "noreply@gaqsa.com"
        # TODO: Cambiar correo de admin
        to_emails = ["car_alf_98@icloud.com", "carlos.sanchez@crabti.com"]
        html_message = render_to_string(
            "order_created.html",
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
