from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags

from users.models import UserEmail


def send_mail_on_new_code(providers, token_apply_date, user_email):
    connection = mail.get_connection(fail_silently=True)
    connection.open()
    emails = []

    for provider in providers:
        title = 'Código Para Cambio de Precio'
        subject = f'GAQSA - {title}'
        context = {
            'provider': provider,
            'title': title,
            'token_apply_date': token_apply_date
        }
        from_email = 'noreply@gaqsa.com'
        provider_emails = list(UserEmail.objects.filter(
            user=provider.user, category=UserEmail.PRICE_CHANGE
        ).values_list('email', flat=True))
        to_emails = provider_emails + [user_email]
        html_message = render_to_string(
            'new_code.html',
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
