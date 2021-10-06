def is_client(user):
    return user.groups.filter(name='Cliente').exists()


def is_provider(user):
    return user.groups.filter(name='Proveedor').exists()


def is_admin(user):
    return user.groups.filter(name='Administrador').exists()
