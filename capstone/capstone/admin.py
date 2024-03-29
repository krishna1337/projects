from django.contrib.sessions.models import Session
from django.contrib import admin
from .models import *


class SessionAdmin(admin.ModelAdmin):
    def _session_data(self, obj):
        return obj.get_decoded()
    list_display = ('session_key', '_session_data', 'expire_date')


admin.site.register(User)
admin.site.register(Channel)
admin.site.register(Message)
admin.site.register(Session, SessionAdmin)
