from django.contrib import admin

from products.models import Product, Laboratory, Category

admin.site.register(Product)
admin.site.register(Laboratory)
admin.site.register(Category)
