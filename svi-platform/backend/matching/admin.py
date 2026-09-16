from django.contrib import admin

from .models import Match


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ("mentee", "mentor", "interest_score", "goal_score", "overall_score", "computed_at")
    list_filter = ("computed_at",)
    search_fields = ("mentee__user__first_name", "mentor__user__first_name")
    ordering = ("-overall_score",)
