from backend.utils.constants import (
    ADMIN_GROUP, CLIENT_GROUP, INVOICE_MANAGER_GROUP, PROVIDER_GROUP
)


def is_client(user):
    return user.groups.filter(name=CLIENT_GROUP).exists()


def is_provider(user):
    return user.groups.filter(name=PROVIDER_GROUP).exists()


def is_admin(user):
    return user.groups.filter(name=ADMIN_GROUP).exists()


def is_invoice_manager(user):
    return user.groups.filter(name=INVOICE_MANAGER_GROUP).exists()
