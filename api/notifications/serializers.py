from rest_framework.serializers import ModelSerializer

from .models import Notification


class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notification
        fields = ['subject', 'message', 'receiver', 'sender']
        extra_kwargs = {'sender': {'write_only': True}}

    def to_representation(self, instance):
        return {
            'subject': instance.subject,
            'message': instance.message,
            'receiver': instance.receiver,
            'sender': instance.sender.email,
            'external_id': instance.external_id
        }
