import os

from django.conf.urls import url
from django.core.asgi import get_asgi_application

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter

from capstone.consumers import ChatConsumer

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "final.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            url("", ChatConsumer.as_asgi()),
        ])
    )
})
