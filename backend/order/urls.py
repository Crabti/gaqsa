from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListOrders.as_view(), name="list_order"),
    path("create", views.CreateOrder.as_view(), name="create_order"),
    path("requisitions/",
         views.ListRequisitions.as_view(), name="list_requisitions"),
    path(
        "<int:pk>",
        views.RetrieveOrderView.as_view(),
        name="detail_order",
    ),
    path(
        '<int:pk>/update',
        views.UpdateOrderRequisitionsView.as_view(),
        name="update_order"
    ),
    path(
        "orders/<int:pk>/cancelled",
        views.CancelOrderClient.as_view(),
        name="cancel_order_cliente"
    )
]
