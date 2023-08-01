import uuid

from django.db import models


class Notification (models.Model):
    external_id = models.UUIDField(default=uuid.uuid4, editable=False)
    subject = models.CharField(max_length=255)
    message = models.TextField()

    sent_by = models.ForeignKey(
        'users.ApiUser', on_delete=models.CASCADE, related_name='sent_notifications')
    receiver = models.ForeignKey(
        'receivers.Receiver', on_delete=models.CASCADE, related_name='notifications')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @classmethod
    def create_instance(cls, validated_data):
        return cls.objects.create(**validated_data)
