from offers.models import Offer
from django.dispatch import receiver
from django.core import mail
from django.db.models.signals import post_save
from django.template.loader import render_to_string
from django.utils.html import strip_tags


@receiver(post_save, sender=Offer)
def send_mail_on_offer_create(sender, instance=None, created=False, **kwargs):
    if created:
        title = "Alta de Nueva Oferta"
        subject = f"GAQSA - {title}"
        context = {
            "offer": instance,
            "percentage": instance.discount_percentage * 100,
            "title": title
        }
        from_email = "noreply@gaqsa.com"
        # TODO: Cambiar correo de admin
        to_emails = [instance.user.email, "admin@temp.com"]
        html_message = render_to_string(
            "offer_created.html",
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
