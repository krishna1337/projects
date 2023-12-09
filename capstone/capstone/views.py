import json

from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import ensure_csrf_cookie
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.conf import settings
from django.db import IntegrityError
from .models import *


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    if username is None or password is None:
        return JsonResponse({
            "errors": "Please enter both username and password"
        }, status=400)
    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"detail": "Success"})
    return JsonResponse(
        {"detail": "Invalid credentials"},
        status=400,
    )


@require_POST
def logout_view(request):
    logout(request)
    return HttpResponse("Logged out")


@require_POST
def register(request):
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')
    email = data.get('email')

    try:
        user = User.objects.create_user(username, email, password)
        user.save()
    except IntegrityError:
        return JsonResponse({"error": "Username already exists"}, status=400)

    login(request, user)
    return JsonResponse({"detail": "Success"})


@ensure_csrf_cookie
def set_csrf_cookie(request):
    return JsonResponse({"details": "CSRF cookie set"})


def is_logged(request):
    if request.user.is_authenticated:
        isLogged = request.user.username
    else:
        isLogged = False
    return JsonResponse({"isLogged": isLogged})


@login_required
def create_channel(request):
    data = json.loads(request.body)
    try:
        user = User.objects.get(username=data["user"])
        if user == request.user:
            return JsonResponse({"error": "You can't message yourself"}, status=400)
        if user == None:
            return JsonResponse({"error": "User key not found in request body"}, status=400)
    except User.DoesNotExist:
        return JsonResponse({"error": "User does not exist"}, status=404)
    for i in request.user.channels.all():
        if i.other_user(request.user) == user.username:
            return JsonResponse({"id": i.id})
    channel = Channel.objects.create()
    channel.people.add(request.user, user)
    return JsonResponse({"id": channel.id})


def get_channels(request):
    channels = [
        {"id": channel.id, "name": channel.other_user(request.user)}
        for channel in request.user.channels.all()
    ]
    return JsonResponse(channels, safe=False)


def get_messages(request, channel_id):
    channel = Channel.objects.get(id=channel_id)
    if request.user in channel.people.all():
        before = request.GET.get("before")
        if before != None:
            before = int(before)
            messages = list(channel.messages.all())[-before-10:-before]
        else:
            messages = list(channel.messages.all())[-10:]
        data = [message.serialize() for message in messages]
        return JsonResponse(data, safe=False)
    else:
        return HttpResponse(status=403)


def react(request, *args, **kwargs):
    with open(settings.REACT_BUILD / 'index.html') as f:
        return HttpResponse(f.read())
