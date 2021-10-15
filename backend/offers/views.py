from django.contrib.auth.models import User
from backend.utils.permissions import IsProvider
from offers.models import Offer
from offers.serializers.offer import CreateOfferSerializer
from rest_framework import generics


class CreateOfferView(generics.CreateAPIView):
    queryset = Offer.objects.all()
    serializer_class = CreateOfferSerializer
    permission_classes = [IsProvider]

    # Save request user
    def perform_create(self, serializer):
        user = User.objects.get(pk=self.request.user.pk)
        serializer.save(user=user)
