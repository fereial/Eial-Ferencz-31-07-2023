import uuid

from django.db import models


class Receiver(models.Model):
    external_id = models.UUIDField(default=uuid.uuid4, editable=False)
    email = models.EmailField()
    user = models.ForeignKey(
        'users.ApiUser', on_delete=models.CASCADE, related_name='sender_user')

    created_at = models.DateTimeField(auto_now_add=True)
