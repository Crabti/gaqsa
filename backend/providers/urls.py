from django.urls import path
from products.views import list_all_products

urlpatterns = [
    path('<int:pk>/products', list_all_products,
         name="list_all_products"),
]
