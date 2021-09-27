from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListOrders.as_view(), name="list_order"),
    path('create', views.CreateOrder.as_view(), name="create_order"),

]
