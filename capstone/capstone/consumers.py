import json
from asgiref.sync import async_to_sync
from channels.exceptions import DenyConnection
from channels.generic.websocket import WebsocketConsumer
from channels.generic.http import AsyncHttpConsumer
from .models import Channel, Message

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope['user']
        if self.user.is_authenticated:
            self.user.channel_name = self.channel_name
            self.user.save()
            self.accept()
        else:
            self.close()

    def disconnect(self, code):
        if self.user.is_authenticated:
            self.user.channel_name = None
            self.user.save()

    def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message')
        channel = data.get('channel')
        channel = Channel.objects.get(id=channel)
        users = channel.people.all()

        if self.user in users:
            for user in users:
                if user.channel_name != None:
                    async_to_sync(self.channel_layer.send)(
                        user.channel_name,
                        {
                            'type': 'broadcast',
                            'user': str(self.user),
                            'message': message,
                            'channel': channel.id,
                        }
                    )
            Message.objects.create(channel=channel, sender=self.user, message=message)

    def broadcast(self, event):
        self.send(text_data=json.dumps({
            'message': event['message'],
            'channel': event['channel'],
            'user': event['user'],
        }))
