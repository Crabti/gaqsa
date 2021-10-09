from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListProductView.as_view(), name="list_products"),
    path("create", views.CreateProductView.as_view(), name="create_product"),
    path(
        "<int:pk>/update",
        views.UpdateProductView.as_view(),
        name="update_product",
    ),
    path(
        "<int:pk>",
        views.RetrieveProductView.as_view(),
        name="detail_product",
    ),
    path(
        "options",
        views.ListProductSelectOptions.as_view(),
        name="list_product_options"
    ),
    path(
        "price_change/<int:pk>",
        views.RequestPriceChange.as_view(),
        name="request_price_change",
    )
]
