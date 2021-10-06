from django.core import mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags


def send_mail_on_new_code(providers):
    connection = mail.get_connection()
    connection.open()
    emails = []

    for provider in providers:
        title = 'Código Para Cambio de Precio'
        subject = f'GAQSA - {title}'
        context = {
            'provider': provider,
            'title': title
        }
        from_email = 'noreply@gaqsa.com'
        # TODO: Cambiar correo de admin
        to_emails = [provider.email, 'admin@temp.com']
        html_message = render_to_string(
            'new_code.html',
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
