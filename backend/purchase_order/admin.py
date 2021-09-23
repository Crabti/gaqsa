from django.contrib import admin
from purchase_order.models import Purchase_Order, Requisition

# Register your models here.
admin.site.register(Purchase_Order)
admin.site.register(Requisition)
