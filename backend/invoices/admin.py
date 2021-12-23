from django.contrib import admin
from invoices.models import Invoice


class InvoiceAdmin(admin.ModelAdmin):
    readonly_fields = (
        'invoice_folio',
        'amount',
        'invoice_date',
        'client',
    )


admin.site.register(Invoice, InvoiceAdmin)
