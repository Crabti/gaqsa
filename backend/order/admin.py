from django.contrib import admin
from order.models import Order, Requisition

# Register your models here.
admin.site.register(Order)
admin.site.register(Requisition)
