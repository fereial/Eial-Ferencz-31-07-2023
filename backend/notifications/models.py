import uuid

from django.db import models


class Notification (models.Model):
    external_id = models.UUIDField(default=uuid.uuid4, editable=False)
    subject = models.CharField(max_length=255)
    message = models.TextField()

    api_user = models.ForeignKey(
        "users.ApiUser", on_delete=models.CASCADE, related_name='sent_notifications')

    sent_by = models.EmailField()
    received_by = models.EmailField()

    created_at = models.DateTimeField(auto_now_add=True)

    @classmethod
    def create_instance(cls, validated_data):
        return cls.objects.create(**validated_data)
