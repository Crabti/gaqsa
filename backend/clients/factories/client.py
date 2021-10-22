from users.factories.business import BusinessFactory
from clients.models import Client


class ClientFactory(BusinessFactory):
    class Meta:
        model = Client
