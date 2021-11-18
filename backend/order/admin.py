from django.contrib import admin
from order.models import Order, Requisition


class OrderRequisitonInline(admin.StackedInline):
    model = Requisition


class OrderAdmin(admin.ModelAdmin):
    inlines = [OrderRequisitonInline]


# Register your models here.
admin.site.register(Order, OrderAdmin)
admin.site.register(Requisition)
