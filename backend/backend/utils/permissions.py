from django.contrib.auth.models import Group
from backend.utils.constants import (
    ADMIN_GROUP, INVOICE_MANAGER_GROUP, PROVIDER_GROUP
)
from rest_framework import permissions, exceptions
from datetime import date
from django.conf import settings


def _is_in_group(user, group_name):
    try:
        return Group.objects.get(
            name=group_name,
        ).user_set.filter(id=user.id).exists()
    except Group.DoesNotExist:
        return None


def _has_group_permission(user, required_groups):
    return any(
        [_is_in_group(user, group_name) for group_name in required_groups])


def available_today(weekdays_available):
    if weekdays_available:
        today_weekday = date.today().weekday()
        available_weekdays = weekdays_available
        valid = today_weekday in available_weekdays
        return valid
    return True


class CustomBasePermission(permissions.BasePermission):
    required_groups = []

    def has_permission(self, request, view):
        has_group_permission = _has_group_permission(
            request.user, self.required_groups,
        )
        return request.user and has_group_permission

    def has_object_permission(self, request, view, obj):
        has_group_permission = _has_group_permission(
            request.user, self.required_groups,
        )
        return request.user and has_group_permission


class IsAdmin(CustomBasePermission):
    required_groups = [ADMIN_GROUP]


class IsProvider(CustomBasePermission):
    required_groups = [PROVIDER_GROUP]


class IsInvoiceManager(CustomBasePermission):
    required_groups = [INVOICE_MANAGER_GROUP]


class IsOwnUserOrAdmin(permissions.BasePermission):
    """Allow only same users or admins"""

    def has_object_permission(self, request, view, obj):
        return request.user == obj or _is_in_group(request.user, ADMIN_GROUP)


class IsOwnerOrAdmin(permissions.BasePermission):
    """Allow only same users or admins"""

    def has_object_permission(self, request, view, obj):
        return request.user == obj.user or _is_in_group(
            request.user, ADMIN_GROUP
        )


class IsOwnProviderOrAdmin(permissions.BasePermission):
    """Allow only same users or admins"""

    def has_object_permission(self, request, view, obj):
        return request.user == obj.provider.user or _is_in_group(
            request.user, ADMIN_GROUP
        )


class IsInvoiceCheckDay(permissions.BasePermission):
    message = {
        'errors': ['This operation is only available on specific weekdays.'],
        'code': 'UNAVAILABLE_WEEKDAY'
    }

    def has_object_permission(self, request, view, obj):
        valid = available_today(settings.INVOICE_STATUS_UPDATE_WEEKDAYS)
        if valid:
            return True
        raise exceptions.PermissionDenied(
            detail=self.message
        )
