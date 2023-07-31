import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models


class ApiUser(AbstractUser):
    email = models.EmailField(unique=True)
    external_id = models.UUIDField(
        default=uuid.uuid4, unique=True, auto_created=True
    )
