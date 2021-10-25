from faker.providers import BaseProvider
from users.models import UserEmail


class UserEmailProvider(BaseProvider):
    MAIL_CATEGORIES = (
        UserEmail.ORDERS,
        UserEmail.PRICE_CHANGE,
        UserEmail.INVOICE,
        UserEmail.PAYMENTS
    )

    def user_email_category(self) -> str:
        return self.random_element(self.MAIL_CATEGORIES)
