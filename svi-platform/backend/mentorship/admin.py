from django.contrib import admin

from .models import MentorshipRequest, Mentorship


@admin.register(MentorshipRequest)
class MentorshipRequestAdmin(admin.ModelAdmin):
    list_display = ("mentee", "mentor", "status", "requested_at", "responded_at")
    list_filter = ("status",)
    search_fields = ("mentee__user__first_name", "mentor__user__first_name")


@admin.register(Mentorship)
class MentorshipAdmin(admin.ModelAdmin):
    list_display = ("mentee", "mentor", "status", "started_at", "ended_at")
    list_filter = ("status",)
