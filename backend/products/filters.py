from products.models import Product
import django_filters.rest_framework


class ProductFilter(django_filters.FilterSet):
    class Meta:
        model = Product
        fields = ['status', 'provider']
