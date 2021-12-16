from auditlog.middleware import AuditlogMiddleware
import threading
import time
import sys

from functools import partial
from django.apps import apps
from django.conf import settings

from django.db.models.signals import pre_save

from auditlog.models import LogEntry
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
threadlocal = threading.local()

TESTING = len(sys.argv) > 1 and sys.argv[1] == 'test'

class RestFrameworkAuditLogMiddleware(AuditlogMiddleware):
    def process_request(self, request):
        """
        Gets the current user from the request and prepares and
        connects a signal receiver with the user already
        attached to it.
        """

        if TESTING:
            return

        # Initialize thread local storage
        threadlocal.auditlog = {
            "signal_duid": (self.__class__, time.time()),
            "remote_addr": request.META.get("REMOTE_ADDR"),
        }

        # In case of proxy, set 'original' address
        if request.META.get("HTTP_X_FORWARDED_FOR"):
            threadlocal.auditlog["remote_addr"] = request.META.get(
                "HTTP_X_FORWARDED_FOR"
            ).split(",")[0]
        try:
            authentication = JWTAuthentication().authenticate(request)
            if authentication:
                request.user = authentication[0]
        except InvalidToken:
            return

        # Connect signal for automatic logging
        if hasattr(request, "user") and getattr(
            request.user, "is_authenticated", False
        ):
            set_actor = partial(
                self.set_actor,
                user=request.user,
                signal_duid=threadlocal.auditlog["signal_duid"],
            )
            pre_save.connect(
                set_actor,
                sender=LogEntry,
                dispatch_uid=threadlocal.auditlog["signal_duid"],
                weak=False,
            )

    @staticmethod
    def set_actor(user, sender, instance, signal_duid, **kwargs):
        """
        Signal receiver with an extra, required 'user' kwarg.
         This method becomes a real (valid) signal receiver when
        it is curried with the actor.
        """
        if hasattr(threadlocal, "auditlog"):
            if signal_duid != threadlocal.auditlog["signal_duid"]:
                return
            try:
                app_label, model_name = settings.AUTH_USER_MODEL.split(".")
                auth_user_model = apps.get_model(app_label, model_name)
            except ValueError:
                auth_user_model = apps.get_model("auth", "user")
            if (
                sender == LogEntry
                and isinstance(user, auth_user_model)
                and instance.actor is None
            ):
                instance.actor = user

            instance.remote_addr = threadlocal.auditlog["remote_addr"]
