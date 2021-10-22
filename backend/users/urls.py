from django.urls import path

from users.views import CreateUser, CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),
    path('register/', CreateUser.as_view(), name='create-user')
]
