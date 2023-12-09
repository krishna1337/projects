from django.urls import path
from .views import *

urlpatterns = [
    # API
    path('api/login/', login_view),
    path('api/logout/', logout_view),
    path('api/register/', register),
    path('api/is-logged/', is_logged),
    path('api/get-channels/', get_channels),
    path('api/get-messages/<channel_id>/', get_messages),
    path('api/create-channel/', create_channel),
    path('api/set-csrf-cookie/', set_csrf_cookie),

    # Frontend
    path('', react),
    path('chat/', react),
    path('login/', react),
    path('register/', react),
    path('channels/<id>/', react),
]
