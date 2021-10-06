from django.urls import path
from . import views

urlpatterns = [
    path('', views.ListProviderView.as_view(), name="list_providers"),
    path('codes', views.CreateCode.as_view(), name="create_code"),
]
