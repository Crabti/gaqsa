from django.urls import path
from . import views

urlpatterns = [
    path('request/', views.request_product, name="request_product"),
    path('', views.get_list_products, name="get_list_products"),
    path('<int:pk>', views.manage_product, name='manage_product'),
]
