from datetime import date
from factory import django, LazyAttribute, SubFactory
from invoices.models import Invoice
from order.factories.order import OrderFactory


class InvoiceFactory(django.DjangoModelFactory):
    class Meta:
        model = Invoice

    order = SubFactory(OrderFactory)
    delivery_date = LazyAttribute(
        lambda _: date.today()
    )
