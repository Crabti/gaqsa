from backend.utils.emails import get_admin_emails
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
        admin_emails = get_admin_emails()
        to_emails = [instance.user.email] + admin_emails
        html_message = render_to_string(
            "offer_created.html",
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
