from django.shortcuts import get_object_or_404

from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response

from tests_website.api.mixins import ApiAuthMixin
from tests_website.subscriptions.models import Subscription


class SubscriptionDetailsForUser(ApiAuthMixin, APIView):
    class OutputSerializer(serializers.ModelSerializer):
        class Meta:
            model = Subscription
            fields = "__all__"

    def get(self, request, id):
        subscription = get_object_or_404(Subscription, id=id)
        serializer = self.OutputSerializer(subscription)

        return Response(serializer.data, status=status.HTTP_200_OK)
