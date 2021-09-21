from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.request_product, name="request_product"),
    path(
        'products/requests/pending',
        views.list_pending_products,
        name="pending_product_requests",
    ),
    path('<int:pk>', views.manage_product, name='manage_product'),
]
