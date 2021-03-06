from django.urls import path

from users.views import (
    CreateUser, CustomTokenObtainPairView, ListAuditLogView,
    UpdateUserActiveView, ListUserView, RetrieveUserView, UpdateUserView
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(),
         name='token_refresh'),
    path('create', CreateUser.as_view(), name='create-user'),
    path('', ListUserView.as_view(), name='list_users'),
    path('<int:pk>/active', UpdateUserActiveView.as_view(),
         name='user-active'),
    path('<int:pk>/update', UpdateUserView.as_view(), name="update_user"),
    path('<int:pk>', RetrieveUserView.as_view(), name="retrieve_user"),
    path('audit', ListAuditLogView.as_view(), name='list_audit_log'),
]
