
from django.core.mail.backends.smtp import EmailBackend


class EmailBackend(EmailBackend):
    def send_messages(self, email_messages):
        parsed_email_messages = []
        for message in email_messages:
            # Filter out empty/null destination emails
            message.to = list(filter(None, message.recipients()))
            # If destination list is not empty include to send list
            if message.to:
                parsed_email_messages.append(message)
        return super().send_messages(parsed_email_messages)
