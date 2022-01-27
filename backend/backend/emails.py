
from django.core.mail.backends.smtp import EmailBackend
from django.conf import settings


class EmailBackend(EmailBackend):
    def send_messages(self, email_messages):
        if settings.DEBUG:
            for email in email_messages:
                print(f"Sending mail to {email.recipients()}")
        return super().send_messages(email_messages)
