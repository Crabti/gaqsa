from datetime import datetime
from factory import django, LazyAttribute, SubFactory
from invoices.models import Invoice
from order.factories.order import OrderFactory
from django.utils import timezone


class InvoiceFactory(django.DjangoModelFactory):
    class Meta:
        model = Invoice

    order = SubFactory(OrderFactory)
    delivery_date = LazyAttribute(
        lambda _: timezone.make_aware(
            datetime.now(), timezone.get_current_timezone()
        )
    )
