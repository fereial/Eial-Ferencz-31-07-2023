from rest_framework. serializers import ModelSerializer

from .models import Receiver


class ReceiverSerializer(ModelSerializer):
    class Meta:
        model = Receiver
        fields = ['email', 'sender']
        extra_kwargs = {'sender': {'write_only': True}}

    def to_representation(self, instance):
        return {
            'email': instance.email,
            'sender': instance.sender.external_id,
            'external_id': instance.external_id
        }
