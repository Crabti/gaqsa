from django.contrib import admin

from products.models import (
    Product, Laboratory, Category, AnimalGroup, ProductProvider
)


class ProductProviderInline(admin.StackedInline):
    model = ProductProvider


class ProductProviderAdmin(admin.ModelAdmin):
    inlines = [ProductProviderInline]


admin.site.register(Product, ProductProviderAdmin)
admin.site.register(Laboratory)
admin.site.register(Category)
admin.site.register(AnimalGroup)
