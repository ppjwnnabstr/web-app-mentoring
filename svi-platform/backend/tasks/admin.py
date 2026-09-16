from django.contrib import admin

from .models import Task, TaskUpdate


class TaskUpdateInline(admin.TabularInline):
    model = TaskUpdate
    extra = 0


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ("task_name", "mentorship", "status", "due_date", "created_by")
    list_filter = ("status",)
    search_fields = ("task_name",)
    inlines = [TaskUpdateInline]
