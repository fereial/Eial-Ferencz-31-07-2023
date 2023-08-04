from rest_framework.serializers import ModelSerializer
from rest_framework import serializers

from .models import Notification


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['subject', 'message', 'sent_by', 'received_by']
        extra_kwargs = {'sender': {'write_only': True}}

    def create(self, validated_data):
        validated_data["api_user"] = self.context["api_user"]
        return Notification.objects.create(**validated_data)

    def to_representation(self, instance):
        return {
            'subject': instance.subject,
            'message': instance.message,
            'sent_by': instance.sent_by,
            'received_by': instance.received_by,
            'external_id': instance.external_id
        }
