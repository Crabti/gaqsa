from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListOrders.as_view(), name="list_order"),
    path('create', views.CreateOrder2.as_view(), name="create_order"),
    path('requisitions/',
         views.ListRequisitions.as_view(), name="list_requisitions")
]
