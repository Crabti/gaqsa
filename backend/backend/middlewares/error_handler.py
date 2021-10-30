import logging

from django.http import HttpResponse
from django.conf import settings
import traceback


class ErrorHandlerMiddleware:
    """Custom error handler for logging any exceptions"""

    def __init__(self, get_response):
        self.get_response = get_response
        self.logger = logging.getLogger("error.handling")

    def __call__(self, request):
        response = self.get_response(request)
        return response

    def process_exception(self, request, exception):
        if not settings.DEBUG:
            if exception:
                # Format error message
                message = "**{url}**\n\n{error}\n\n````{tb}````".format(
                    url=request.build_absolute_uri(),
                    error=repr(exception),
                    tb=traceback.format_exc()
                )
                self.logger.error(message)

            return HttpResponse("Error processing the request.", status=500)
