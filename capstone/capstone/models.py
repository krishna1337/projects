from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    channel_name = models.CharField(max_length=74, null=True)


class Channel(models.Model):
    people = models.ManyToManyField(User, related_name="channels")

    def other_user(self, user):
        for i in self.people.all():
            if i != user:
                return i.username
        return None

    def __repr__(self):
        return f"{self.people.first()} <> {self.people.last()}"


class Message(models.Model):
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    message = models.TextField()

    def serialize(self):
        return {
            "message": self.message,
            "channel": self.channel.id,
            "user": self.sender.username,
        }
