from backend.utils.permissions import IsAdmin
from providers.mails import send_mail_on_new_code
from providers.models import Provider, generate_unique_token
from providers.serializers.providers import (
    CreateCodeSerializer, ListProviderSerializer
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework import generics


class ListProviderView(generics.ListAPIView):
    permission_classes = [IsAdmin]
    queryset = Provider.objects.all()
    serializer_class = ListProviderSerializer


class CreateCode(APIView):
    permission_classes = [IsAdmin]

    def put(self, request, format=None):
        providers = []
        if request.data["token_apply_date"]:
            token_apply_date = request.data["token_apply_date"]
        for provider in request.data["providers"]:
            provider = get_object_or_404(Provider, pk=provider['pk'])
            serializer = CreateCodeSerializer(provider, data={
                'token': generate_unique_token(),
                'token_used': False,
                'token_apply_date': token_apply_date
            }, partial=True)
            if serializer.is_valid():
                updated_provider = serializer.save()
                providers.append(updated_provider)
            else:
                return Response(
                    serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        send_mail_on_new_code(
            providers,
            token_apply_date,
            request.user.email,
        )
        return Response(
            {'message': 'Codes created'},
            status=status.HTTP_200_OK)
