from django.urls import path

from . import views

urlpatterns = [
    path("", views.ListProductView.as_view(), name="list_products"),
    path("accept", views.AcceptProductAsNew.as_view(),
         name="accept_products"),
    path("group", views.GroupProductsView.as_view(),
         name="group_products"),
    path("reject", views.RejectProductsView.as_view(),
         name="reject_products"),
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
        "price_change",
        views.RequestPriceChange.as_view(),
        name="request_price_change",
    ),
    path(
        "laboratory/create",
        views.CreateLaboratoryView.as_view(),
        name="create_laboratory"
    ),
    path(
        "laboratory/",
        views.ListLaboratoryView.as_view(),
        name="list_laboratories"
        ),
    path(
        "category/",
        views.ListCategoryView.as_view(),
        name="list_categories"
    ),
    path(
        "category/create",
        views.CreateCategoryView.as_view(),
        name="create_category"
    ),
    path(
        "<int:pk>/providers",
        views.AddProviderToProductView.as_view(),
        name="add_provider"
    ),
    path(
        "productproviders/<int:pk>",
        views.RemoveProviderFromProductView.as_view(),
        name="delete_product_provider"
    )
]
