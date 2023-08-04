import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class ApiUser(AbstractUser):
    email = models.EmailField(unique=True)
    external_id = models.UUIDField(
        default=uuid.uuid4, unique=True, auto_created=True
    )

    @classmethod
    def get_by_external_id(cls, external_id):
        try:
            return cls.objects.get(external_id=external_id)

        except cls.DoesNotExist:
            return None
